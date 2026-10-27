<?php
/**
 * Root Entrypoint for Azariah Management Group PHP Backend & SPA
 * Works seamlessly under WAMP (http://localhost/azariah/), cPanel, and Apache
 */

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// 1. API routes -> delegate to api/index.php
if (preg_match('#/api(?:/|$)#i', $uri)) {
    require __DIR__ . '/api/index.php';
    exit(0);
}

// 2. Static asset handling for /assets/
if (preg_match('#/assets/(.+)$#', $uri, $m)) {
    $assetFile = __DIR__ . '/dist/assets/' . $m[1];
    if (file_exists($assetFile)) {
        $ext = pathinfo($assetFile, PATHINFO_EXTENSION);
        $mimes = [
            'js' => 'application/javascript',
            'css' => 'text/css',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'woff2' => 'font/woff2',
            'woff' => 'font/woff',
            'ttf' => 'font/ttf',
            'json' => 'application/json'
        ];
        if (isset($mimes[$ext])) {
            header("Content-Type: " . $mimes[$ext]);
        }
        readfile($assetFile);
        exit(0);
    }
}

// 3. Static asset handling for /uploads/
if (preg_match('#/uploads/(.+)$#', $uri, $m)) {
    $uploadFile = __DIR__ . '/uploads/' . $m[1];
    if (file_exists($uploadFile)) {
        $mime = mime_content_type($uploadFile) ?: 'application/octet-stream';
        header("Content-Type: $mime");
        readfile($uploadFile);
        exit(0);
    }
}

// 4. Dynamic Open Graph & Metadata Injection for Shared Articles
$articleSlug = '';
if (preg_match('#^/(?:article|news|blog)/([^/?#]+)#i', $uri, $slugMatch)) {
    $articleSlug = $slugMatch[1];
} elseif (!empty($_GET['article'])) {
    $articleSlug = trim($_GET['article']);
} elseif (!empty($_GET['slug'])) {
    $articleSlug = trim($_GET['slug']);
}

$articleData = null;
if (!empty($articleSlug)) {
    try {
        $defaultHost = (php_sapi_name() === 'cli' || strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost') !== false) ? '127.0.0.1' : 'localhost';
        $dbHost = $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? getenv('DB_HOST') ?: $defaultHost;
        $dbPort = $_ENV['DB_PORT'] ?? $_SERVER['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
        $dbName = $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? getenv('DB_NAME') ?: 'worlvjwl_azariahmg';
        $dbUser = $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? getenv('DB_USER') ?: 'worlvjwl_azariahmg-user';
        $dbPass = $_ENV['DB_PASS'] ?? $_SERVER['DB_PASS'] ?? (getenv('DB_PASS') !== false ? getenv('DB_PASS') : 'azariahmg-user$1');

        $pdo = new PDO("mysql:host=$dbHost;port=$dbPort;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 2
        ]);

        $stmt = $pdo->prepare("
            SELECT id, title, slug, excerpt, content, coverImage, category, author 
            FROM blog_posts 
            WHERE slug = ? OR id = ? 
            LIMIT 1
        ");
        $stmt->execute([$articleSlug, is_numeric($articleSlug) ? (int)$articleSlug : 0]);
        $articleData = $stmt->fetch();
    } catch (Throwable $t) {
        $articleData = null;
    }
}

// 5. Serve compiled production SPA with dynamic meta injection
$htmlFile = file_exists(__DIR__ . '/dist/index.html') ? __DIR__ . '/dist/index.html' : __DIR__ . '/index.html';
if (file_exists($htmlFile)) {
    header("Content-Type: text/html; charset=UTF-8");
    $html = file_get_contents($htmlFile);

    if ($articleData) {
        $scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'azariahmg.com';
        $baseUrl = "$scheme://$host";

        $artTitle = htmlspecialchars($articleData['title'], ENT_QUOTES, 'UTF-8');
        $rawDesc = !empty($articleData['excerpt']) 
            ? $articleData['excerpt'] 
            : mb_substr(strip_tags($articleData['content']), 0, 180) . '...';
        $artDesc = htmlspecialchars($rawDesc, ENT_QUOTES, 'UTF-8');
        $fullTitle = "$artTitle | Azariah Management Group";
        $canonicalUrl = "$baseUrl/article/" . urlencode($articleData['slug']);
        $ogImageUrl = "$baseUrl/api/og-image?slug=" . urlencode($articleData['slug']);

        // Replace Title
        $html = preg_replace('#<title>.*?</title>#si', "<title>$fullTitle</title>", $html, 1);

        // Replace Meta Title & Description
        $html = preg_replace('#<meta\s+name=["\']title["\']\s+content=["\'].*?["\']>#si', "<meta name=\"title\" content=\"$fullTitle\">", $html, 1);
        $html = preg_replace('#<meta\s+name=["\']description["\']\s+content=["\'].*?["\']>#si', "<meta name=\"description\" content=\"$artDesc\">", $html, 1);

        // Replace Canonical
        $html = preg_replace('#<link\s+rel=["\']canonical["\']\s+href=["\'].*?["\']>#si', "<link rel=\"canonical\" href=\"$canonicalUrl\">", $html, 1);

        // Replace OpenGraph
        $html = preg_replace('#<meta\s+property=["\']og:title["\']\s+content=["\'].*?["\']>#si', "<meta property=\"og:title\" content=\"$fullTitle\">", $html, 1);
        $html = preg_replace('#<meta\s+property=["\']og:description["\']\s+content=["\'].*?["\']>#si', "<meta property=\"og:description\" content=\"$artDesc\">", $html, 1);
        $html = preg_replace('#<meta\s+property=["\']og:url["\']\s+content=["\'].*?["\']>#si', "<meta property=\"og:url\" content=\"$canonicalUrl\">", $html, 1);
        $html = preg_replace('#<meta\s+property=["\']og:image["\']\s+content=["\'].*?["\']>#si', "<meta property=\"og:image\" content=\"$ogImageUrl\"><meta property=\"og:image:width\" content=\"1200\"><meta property=\"og:image:height\" content=\"630\"><meta property=\"og:type\" content=\"article\">", $html, 1);

        // Replace Twitter Cards
        $html = preg_replace('#<meta\s+property=["\']twitter:title["\']\s+content=["\'].*?["\']>#si', "<meta property=\"twitter:title\" content=\"$fullTitle\">", $html, 1);
        $html = preg_replace('#<meta\s+property=["\']twitter:description["\']\s+content=["\'].*?["\']>#si', "<meta property=\"twitter:description\" content=\"$artDesc\">", $html, 1);
        $html = preg_replace('#<meta\s+property=["\']twitter:url["\']\s+content=["\'].*?["\']>#si', "<meta property=\"twitter:url\" content=\"$canonicalUrl\">", $html, 1);
        $html = preg_replace('#<meta\s+property=["\']twitter:image["\']\s+content=["\'].*?["\']>#si', "<meta property=\"twitter:image\" content=\"$ogImageUrl\">", $html, 1);
    }

    echo $html;
    exit(0);
}

http_response_code(404);
echo "Azariah Management Group - 404 Not Found";
