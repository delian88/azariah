<?php
/**
 * Blog & Articles Management API
 * Azariah Management Group Backend
 */
require_once __DIR__ . '/db.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Determine action from URI if not in query param
if (!$action) {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (str_ends_with($uri, 'blog/admin-list') || str_ends_with($uri, 'admin-list')) $action = 'admin-list';
    elseif (str_ends_with($uri, 'blog/toggle-status') || str_ends_with($uri, 'toggle-status')) $action = 'toggle-status';
    elseif (str_ends_with($uri, 'blog/toggle-featured') || str_ends_with($uri, 'toggle-featured')) $action = 'toggle-featured';
    elseif (str_ends_with($uri, 'blog/categories') || str_ends_with($uri, 'categories')) $action = 'categories';
}

$pdo = getDbConnection();
ensureBlogTables($pdo);

// Permanently purge any hardcoded legacy sample/seed articles
try {
    $pdo->exec("DELETE FROM `blog_posts` WHERE `slug` IN ('studio-amg-partners-on-nolly-oh-festival-uk', 'next-decade-strategic-ai-diaspora-capital') OR `title` LIKE '%Nolly Oh!%' OR `title` LIKE '%Strategic AI & Diaspora Capital Allocation%'");
} catch (Exception $e) {
    // Ignore if table not created yet
}

// Helper function to create clean SEO slugs
function generateSlug($title, $pdo, $excludeId = null) {
    $slug = strtolower(trim($title));
    $slug = preg_replace('/[^a-z0-9-]+/', '-', $slug);
    $slug = trim($slug, '-');
    if (empty($slug)) {
        $slug = 'article-' . time();
    }

    $baseSlug = $slug;
    $counter = 1;
    while (true) {
        $sql = "SELECT id FROM blog_posts WHERE slug = ?";
        $params = [$slug];
        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        if (!$stmt->fetch()) {
            break;
        }
        $slug = $baseSlug . '-' . $counter;
        $counter++;
    }
    return $slug;
}

// -----------------------------------------------------------------------------
// 1. ADMIN LIST (All statuses, with counts & metrics)
// -----------------------------------------------------------------------------
if ($action === 'admin-list' && $method === 'GET') {
    requireAuthUser();

    $search = trim($_GET['search'] ?? '');
    $status = trim($_GET['status'] ?? '');
    $category = trim($_GET['category'] ?? '');

    $where = [];
    $params = [];

    if ($search !== '') {
        $where[] = "(title LIKE :q OR excerpt LIKE :q OR tags LIKE :q OR author LIKE :q)";
        $params[':q'] = "%$search%";
    }
    if ($status !== '' && in_array($status, ['published', 'draft', 'archived'])) {
        $where[] = "status = :status";
        $params[':status'] = $status;
    }
    if ($category !== '') {
        $where[] = "category = :category";
        $params[':category'] = $category;
    }

    $whereClause = !empty($where) ? ('WHERE ' . implode(' AND ', $where)) : '';

    $stmt = $pdo->prepare("
        SELECT id, title, slug, excerpt, coverImage, category, tags, author, authorRole, status, isFeatured, readTimeMinutes, views, publishedAt, createdAt, updatedAt
        FROM blog_posts
        $whereClause
        ORDER BY isFeatured DESC, COALESCE(publishedAt, createdAt) DESC
    ");
    $stmt->execute($params);
    $articles = $stmt->fetchAll();

    // Metrics
    $totalCount = (int)$pdo->query("SELECT COUNT(*) FROM blog_posts")->fetchColumn();
    $publishedCount = (int)$pdo->query("SELECT COUNT(*) FROM blog_posts WHERE status = 'published'")->fetchColumn();
    $draftCount = (int)$pdo->query("SELECT COUNT(*) FROM blog_posts WHERE status = 'draft'")->fetchColumn();
    $totalViews = (int)$pdo->query("SELECT COALESCE(SUM(views), 0) FROM blog_posts")->fetchColumn();

    // Distinct categories
    $catStmt = $pdo->query("SELECT DISTINCT category FROM blog_posts WHERE category IS NOT NULL AND category != '' ORDER BY category ASC");
    $categories = $catStmt->fetchAll(PDO::FETCH_COLUMN);

    sendJson([
        'success' => true,
        'articles' => $articles,
        'metrics' => [
            'total' => $totalCount,
            'published' => $publishedCount,
            'draft' => $draftCount,
            'totalViews' => $totalViews
        ],
        'categories' => $categories
    ]);
}

// -----------------------------------------------------------------------------
// 2. TOGGLE STATUS (Published <-> Draft)
// -----------------------------------------------------------------------------
if ($action === 'toggle-status' && $method === 'POST') {
    requireAuthUser();
    $input = getJsonInput();
    $id = (int)($input['id'] ?? 0);
    $newStatus = trim($input['status'] ?? '');

    if (!$id) {
        sendJson(['success' => false, 'error' => 'Article ID is required'], 400);
    }

    if (!in_array($newStatus, ['published', 'draft', 'archived'])) {
        $currStmt = $pdo->prepare("SELECT status FROM blog_posts WHERE id = ?");
        $currStmt->execute([$id]);
        $curr = $currStmt->fetchColumn();
        $newStatus = ($curr === 'published') ? 'draft' : 'published';
    }

    $pubDateUpdate = ($newStatus === 'published') ? "publishedAt = COALESCE(publishedAt, NOW())," : "";

    $stmt = $pdo->prepare("
        UPDATE blog_posts
        SET status = :status, $pubDateUpdate updatedAt = NOW(3)
        WHERE id = :id
    ");
    $stmt->execute([':status' => $newStatus, ':id' => $id]);

    sendJson([
        'success' => true,
        'message' => "Article status updated to $newStatus",
        'status' => $newStatus
    ]);
}

// -----------------------------------------------------------------------------
// 3. TOGGLE FEATURED
// -----------------------------------------------------------------------------
if ($action === 'toggle-featured' && $method === 'POST') {
    requireAuthUser();
    $input = getJsonInput();
    $id = (int)($input['id'] ?? 0);

    if (!$id) {
        sendJson(['success' => false, 'error' => 'Article ID is required'], 400);
    }

    $stmt = $pdo->prepare("
        UPDATE blog_posts
        SET isFeatured = IF(isFeatured = 1, 0, 1), updatedAt = NOW(3)
        WHERE id = ?
    ");
    $stmt->execute([$id]);

    $resStmt = $pdo->prepare("SELECT isFeatured FROM blog_posts WHERE id = ?");
    $resStmt->execute([$id]);
    $newFeatured = (int)$resStmt->fetchColumn();

    sendJson([
        'success' => true,
        'message' => $newFeatured ? "Article marked as Featured" : "Article removed from Featured",
        'isFeatured' => $newFeatured
    ]);
}

// -----------------------------------------------------------------------------
// 4. CATEGORIES LIST
// -----------------------------------------------------------------------------
if ($action === 'categories' && $method === 'GET') {
    $stmt = $pdo->query("
        SELECT category, COUNT(*) as count 
        FROM blog_posts 
        WHERE status = 'published' AND category IS NOT NULL AND category != '' 
        GROUP BY category 
        ORDER BY count DESC, category ASC
    ");
    sendJson([
        'success' => true,
        'categories' => $stmt->fetchAll()
    ]);
}

// -----------------------------------------------------------------------------
// 5. PUBLIC GET: SINGLE ARTICLE OR PUBLISHED LIST
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $slug = trim($_GET['slug'] ?? '');
    $id = !empty($_GET['id']) ? (int)$_GET['id'] : null;

    // Single article request (by slug or ID)
    if ($slug || $id) {
        $sql = "SELECT * FROM blog_posts WHERE " . ($slug ? "slug = ?" : "id = ?");
        $param = $slug ?: $id;
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$param]);
        $article = $stmt->fetch();

        if (!$article) {
            sendJson(['success' => false, 'error' => 'Article not found'], 404);
        }

        // Increment view count if public request
        $pdo->prepare("UPDATE blog_posts SET views = views + 1 WHERE id = ?")->execute([$article['id']]);
        $article['views'] = (int)$article['views'] + 1;

        // Fetch related articles (same category or recent)
        $relStmt = $pdo->prepare("
            SELECT id, title, slug, excerpt, coverImage, category, readTimeMinutes, publishedAt
            FROM blog_posts
            WHERE id != ? AND status = 'published'
            ORDER BY (category = ?) DESC, publishedAt DESC
            LIMIT 3
        ");
        $relStmt->execute([$article['id'], $article['category']]);
        $related = $relStmt->fetchAll();

        sendJson([
            'success' => true,
            'article' => $article,
            'related' => $related
        ]);
    }

    // Public published articles list
    $category = trim($_GET['category'] ?? '');
    $search = trim($_GET['search'] ?? '');
    $tag = trim($_GET['tag'] ?? '');
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 12)));
    $offset = max(0, (int)($_GET['offset'] ?? 0));

    $where = ["status = 'published'"];
    $params = [];

    if ($category !== '' && strtolower($category) !== 'all') {
        $where[] = "category = :category";
        $params[':category'] = $category;
    }
    if ($search !== '') {
        $where[] = "(title LIKE :q OR excerpt LIKE :q OR content LIKE :q OR tags LIKE :q)";
        $params[':q'] = "%$search%";
    }
    if ($tag !== '') {
        $where[] = "tags LIKE :tag";
        $params[':tag'] = "%$tag%";
    }

    $whereClause = 'WHERE ' . implode(' AND ', $where);

    // Total count for pagination
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM blog_posts $whereClause");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    // Featured article for hero highlight
    $featuredStmt = $pdo->query("
        SELECT id, title, slug, excerpt, coverImage, category, tags, author, authorRole, readTimeMinutes, views, publishedAt
        FROM blog_posts
        WHERE status = 'published' AND isFeatured = 1
        ORDER BY COALESCE(publishedAt, createdAt) DESC
        LIMIT 1
    ");
    $featuredArticle = $featuredStmt->fetch();

    // Article records
    $stmt = $pdo->prepare("
        SELECT id, title, slug, excerpt, coverImage, category, tags, author, authorRole, isFeatured, readTimeMinutes, views, publishedAt, createdAt
        FROM blog_posts
        $whereClause
        ORDER BY isFeatured DESC, COALESCE(publishedAt, createdAt) DESC
        LIMIT $limit OFFSET $offset
    ");
    $stmt->execute($params);
    $articles = $stmt->fetchAll();

    // Available categories
    $catsStmt = $pdo->query("
        SELECT DISTINCT category 
        FROM blog_posts 
        WHERE status = 'published' AND category IS NOT NULL AND category != '' 
        ORDER BY category ASC
    ");
    $categories = $catsStmt->fetchAll(PDO::FETCH_COLUMN);

    sendJson([
        'success' => true,
        'articles' => $articles,
        'total' => $total,
        'featured' => $featuredArticle ?: null,
        'categories' => $categories
    ]);
}

// -----------------------------------------------------------------------------
// 6. CREATE ARTICLE (Admin)
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    requireAuthUser();
    $input = getJsonInput();

    $title = trim($input['title'] ?? '');
    if (empty($title)) {
        sendJson(['success' => false, 'error' => 'Article title is required'], 400);
    }

    $content = trim($input['content'] ?? '');
    if (empty($content)) {
        sendJson(['success' => false, 'error' => 'Article content cannot be empty'], 400);
    }

    $slug = trim($input['slug'] ?? '');
    $slug = generateSlug($slug ?: $title, $pdo);

    $excerpt = trim($input['excerpt'] ?? '');
    if (empty($excerpt)) {
        // Auto-generate excerpt from first 200 characters of clean content
        $plain = strip_tags($content);
        $excerpt = mb_substr($plain, 0, 180) . (mb_strlen($plain) > 180 ? '...' : '');
    }

    $coverImage = trim($input['coverImage'] ?? '');
    $category = trim($input['category'] ?? '');
    $tags = trim($input['tags'] ?? '');
    $author = trim($input['author'] ?? '');
    $authorRole = trim($input['authorRole'] ?? '');
    $authorAvatar = trim($input['authorAvatar'] ?? '');
    $status = in_array($input['status'] ?? '', ['published', 'draft', 'archived']) ? $input['status'] : 'published';
    $isFeatured = !empty($input['isFeatured']) ? 1 : 0;

    // Estimate read time (avg 200 words per minute)
    $wordCount = str_word_count(strip_tags($content));
    $readTime = !empty($input['readTimeMinutes']) ? (int)$input['readTimeMinutes'] : max(1, (int)ceil($wordCount / 200));

    $publishedAt = ($status === 'published') ? (!empty($input['publishedAt']) ? $input['publishedAt'] : gmdate('Y-m-d H:i:s')) : null;

    $stmt = $pdo->prepare("
        INSERT INTO blog_posts
        (`title`, `slug`, `excerpt`, `content`, `coverImage`, `category`, `tags`, `author`, `authorRole`, `authorAvatar`, `status`, `isFeatured`, `readTimeMinutes`, `views`, `publishedAt`, `createdAt`, `updatedAt`)
        VALUES
        (:title, :slug, :excerpt, :content, :coverImage, :category, :tags, :author, :authorRole, :authorAvatar, :status, :isFeatured, :readTime, 0, :publishedAt, NOW(3), NOW(3))
    ");

    $stmt->execute([
        ':title' => $title,
        ':slug' => $slug,
        ':excerpt' => $excerpt,
        ':content' => $content,
        ':coverImage' => $coverImage ?: null,
        ':category' => $category,
        ':tags' => $tags ?: null,
        ':author' => $author,
        ':authorRole' => $authorRole,
        ':authorAvatar' => $authorAvatar ?: null,
        ':status' => $status,
        ':isFeatured' => $isFeatured,
        ':readTime' => $readTime,
        ':publishedAt' => $publishedAt
    ]);

    $id = (int)$pdo->lastInsertId();

    sendJson([
        'success' => true,
        'message' => 'Article published successfully!',
        'article' => [
            'id' => $id,
            'title' => $title,
            'slug' => $slug,
            'status' => $status,
            'publishedAt' => $publishedAt
        ]
    ]);
}

// -----------------------------------------------------------------------------
// 7. UPDATE ARTICLE (Admin)
// -----------------------------------------------------------------------------
if ($method === 'PUT') {
    requireAuthUser();
    $input = getJsonInput();

    $id = (int)($input['id'] ?? 0);
    if (!$id) {
        sendJson(['success' => false, 'error' => 'Article ID is required for update'], 400);
    }

    $title = trim($input['title'] ?? '');
    if (empty($title)) {
        sendJson(['success' => false, 'error' => 'Article title is required'], 400);
    }

    $content = trim($input['content'] ?? '');
    if (empty($content)) {
        sendJson(['success' => false, 'error' => 'Article content cannot be empty'], 400);
    }

    $slug = trim($input['slug'] ?? '');
    $slug = generateSlug($slug ?: $title, $pdo, $id);

    $excerpt = trim($input['excerpt'] ?? '');
    if (empty($excerpt)) {
        $plain = strip_tags($content);
        $excerpt = mb_substr($plain, 0, 180) . (mb_strlen($plain) > 180 ? '...' : '');
    }

    $coverImage = trim($input['coverImage'] ?? '');
    $category = trim($input['category'] ?? '');
    $tags = trim($input['tags'] ?? '');
    $author = trim($input['author'] ?? '');
    $authorRole = trim($input['authorRole'] ?? '');
    $authorAvatar = trim($input['authorAvatar'] ?? '');
    $status = in_array($input['status'] ?? '', ['published', 'draft', 'archived']) ? $input['status'] : 'published';
    $isFeatured = !empty($input['isFeatured']) ? 1 : 0;

    $wordCount = str_word_count(strip_tags($content));
    $readTime = !empty($input['readTimeMinutes']) ? (int)$input['readTimeMinutes'] : max(1, (int)ceil($wordCount / 200));

    // Handle published date update
    $existingStmt = $pdo->prepare("SELECT publishedAt, status FROM blog_posts WHERE id = ?");
    $existingStmt->execute([$id]);
    $existing = $existingStmt->fetch();

    $publishedAt = $existing['publishedAt'] ?? null;
    if ($status === 'published' && empty($publishedAt)) {
        $publishedAt = gmdate('Y-m-d H:i:s');
    }
    if (!empty($input['publishedAt'])) {
        $publishedAt = $input['publishedAt'];
    }

    $stmt = $pdo->prepare("
        UPDATE blog_posts
        SET `title` = :title,
            `slug` = :slug,
            `excerpt` = :excerpt,
            `content` = :content,
            `coverImage` = :coverImage,
            `category` = :category,
            `tags` = :tags,
            `author` = :author,
            `authorRole` = :authorRole,
            `authorAvatar` = :authorAvatar,
            `status` = :status,
            `isFeatured` = :isFeatured,
            `readTimeMinutes` = :readTime,
            `publishedAt` = :publishedAt,
            `updatedAt` = NOW(3)
        WHERE `id` = :id
    ");

    $stmt->execute([
        ':title' => $title,
        ':slug' => $slug,
        ':excerpt' => $excerpt,
        ':content' => $content,
        ':coverImage' => $coverImage ?: null,
        ':category' => $category,
        ':tags' => $tags ?: null,
        ':author' => $author,
        ':authorRole' => $authorRole,
        ':authorAvatar' => $authorAvatar ?: null,
        ':status' => $status,
        ':isFeatured' => $isFeatured,
        ':readTime' => $readTime,
        ':publishedAt' => $publishedAt,
        ':id' => $id
    ]);

    sendJson([
        'success' => true,
        'message' => 'Article updated successfully!',
        'article' => [
            'id' => $id,
            'title' => $title,
            'slug' => $slug,
            'status' => $status
        ]
    ]);
}

// -----------------------------------------------------------------------------
// 8. DELETE ARTICLE (Admin)
// -----------------------------------------------------------------------------
if ($method === 'DELETE') {
    requireAuthUser();
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        $input = getJsonInput();
        $id = (int)($input['id'] ?? 0);
    }

    if (!$id) {
        sendJson(['success' => false, 'error' => 'Article ID is required for deletion'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM blog_posts WHERE id = ?");
    $stmt->execute([$id]);

    sendJson([
        'success' => true,
        'message' => 'Article deleted successfully'
    ]);
}
