<?php
require_once __DIR__ . '/db.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$key = $_GET['key'] ?? '';

// If path has /sections/:key
if (!$key) {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (preg_match('#/sections/([a-zA-Z0-9_-]+)#', $uri, $m)) {
        $key = $m[1];
    }
}

$pdo = getDbConnection();

// GET: Fetch all or single section
if ($method === 'GET') {
    try {
        if ($key) {
            $stmt = $pdo->prepare("SELECT * FROM section_contents WHERE sectionKey = ? LIMIT 1");
            $stmt->execute([$key]);
            $section = $stmt->fetch();
            if (!$section) {
                sendJson(['success' => false, 'error' => 'Section not found'], 404);
            }
            $section['parsedData'] = $section['data'] ? json_decode($section['data'], true) : null;
            sendJson(['success' => true, 'section' => $section]);
        } else {
            $stmt = $pdo->query("SELECT * FROM section_contents");
            $rows = $stmt->fetchAll();
            $sectionsMap = [];
            foreach ($rows as $row) {
                $row['parsedData'] = $row['data'] ? json_decode($row['data'], true) : null;
                $sectionsMap[$row['sectionKey']] = $row;
            }
            sendJson(['success' => true, 'sections' => $sectionsMap]);
        }
    } catch (Exception $e) {
        sendJson(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

// PUT / POST: Update section content
if ($method === 'PUT' || $method === 'POST') {
    requireAuthUser();
    if (!$key) {
        sendJson(['success' => false, 'error' => 'Section key is required'], 400);
    }

    $input = getJsonInput();
    $badge = $input['badge'] ?? null;
    $title = $input['title'] ?? null;
    $subtitle = $input['subtitle'] ?? null;
    $content = $input['content'] ?? null;
    $ctaText = $input['ctaText'] ?? null;
    $ctaLink = $input['ctaLink'] ?? null;
    $mediaUrl = $input['mediaUrl'] ?? null;
    
    $dataRaw = $input['data'] ?? null;
    $dataString = null;
    if ($dataRaw !== null) {
        $dataString = is_string($dataRaw) ? $dataRaw : json_encode($dataRaw, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO section_contents (`sectionKey`, `badge`, `title`, `subtitle`, `content`, `ctaText`, `ctaLink`, `mediaUrl`, `data`, `updatedAt`)
            VALUES (:key, :badge, :title, :subtitle, :content, :ctaText, :ctaLink, :mediaUrl, :data, NOW())
            ON DUPLICATE KEY UPDATE
                `badge` = VALUES(`badge`),
                `title` = VALUES(`title`),
                `subtitle` = VALUES(`subtitle`),
                `content` = VALUES(`content`),
                `ctaText` = VALUES(`ctaText`),
                `ctaLink` = VALUES(`ctaLink`),
                `mediaUrl` = VALUES(`mediaUrl`),
                `data` = COALESCE(VALUES(`data`), `data`),
                `updatedAt` = NOW()
        ");

        $stmt->execute([
            ':key' => $key,
            ':badge' => $badge,
            ':title' => $title,
            ':subtitle' => $subtitle,
            ':content' => $content,
            ':ctaText' => $ctaText,
            ':ctaLink' => $ctaLink,
            ':mediaUrl' => $mediaUrl,
            ':data' => $dataString,
        ]);

        // Fetch back updated section
        $fetchStmt = $pdo->prepare("SELECT * FROM section_contents WHERE sectionKey = ? LIMIT 1");
        $fetchStmt->execute([$key]);
        $updated = $fetchStmt->fetch();
        if ($updated) {
            $updated['parsedData'] = $updated['data'] ? json_decode($updated['data'], true) : null;
        }

        sendJson([
            'success' => true,
            'message' => "Section '$key' updated successfully",
            'section' => $updated
        ]);
    } catch (Exception $e) {
        sendJson(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
