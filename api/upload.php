<?php
require_once __DIR__ . '/db.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();

// GET: List recent uploaded media
if ($method === 'GET') {
    requireAuthUser();
    try {
        $stmt = $pdo->query("SELECT id, filename, originalName, mimeType, size, url, createdAt FROM uploaded_media ORDER BY createdAt DESC LIMIT 50");
        $media = $stmt->fetchAll();
        sendJson(['success' => true, 'media' => $media]);
    } catch (Exception $e) {
        sendJson(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

// POST: Upload File (Logo or Image)
if ($method === 'POST') {
    requireAuthUser();

    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        sendJson(['success' => false, 'error' => 'No file uploaded or upload error occurred'], 400);
    }

    $file = $_FILES['file'];
    $maxSize = 10 * 1024 * 1024; // 10MB
    if ($file['size'] > $maxSize) {
        sendJson(['success' => false, 'error' => 'File size exceeds maximum 10MB limit'], 400);
    }

    $allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
        'image/gif',
        'image/x-icon',
    ];

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);

    if (!in_array($mimeType, $allowedMimes)) {
        sendJson(['success' => false, 'error' => 'Only image files (JPEG, PNG, WebP, SVG, GIF, ICO) are allowed'], 400);
    }

    $uploadsDir = dirname(__DIR__) . '/uploads';
    if (!is_dir($uploadsDir)) {
        mkdir($uploadsDir, 0755, true);
    }

    $origExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
    $uniqueName = $baseName . '_' . time() . '_' . mt_rand(1000, 9999) . '.' . $origExt;
    $targetPath = $uploadsDir . '/' . $uniqueName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        sendJson(['success' => false, 'error' => 'Failed to save uploaded file to disk'], 500);
    }

    $publicUrl = '/uploads/' . $uniqueName;

    try {
        $stmt = $pdo->prepare("
            INSERT INTO uploaded_media (`filename`, `originalName`, `mimeType`, `size`, `url`, `createdAt`)
            VALUES (:fn, :orig, :mime, :sz, :url, NOW())
        ");
        $stmt->execute([
            ':fn' => $uniqueName,
            ':orig' => $file['name'],
            ':mime' => $mimeType,
            ':sz' => (int)$file['size'],
            ':url' => $publicUrl,
        ]);
        $mediaId = $pdo->lastInsertId();

        // If requested to set as site logo
        $setAsLogo = ($_POST['setAsLogo'] ?? '') === 'true' || ($_POST['setAsLogo'] ?? '') === true;
        if ($setAsLogo) {
            $logoStmt = $pdo->prepare("
                INSERT INTO site_settings (`key`, `value`, `type`, `description`, `updatedAt`)
                VALUES ('logo_url', :url, 'image', 'Website Logo Image', NOW())
                ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updatedAt` = NOW()
            ");
            $logoStmt->execute([':url' => $publicUrl]);
        }

        sendJson([
            'success' => true,
            'message' => 'File uploaded successfully',
            'url' => $publicUrl,
            'media' => [
                'id' => (int)$mediaId,
                'filename' => $uniqueName,
                'originalName' => $file['name'],
                'mimeType' => $mimeType,
                'size' => (int)$file['size'],
                'url' => $publicUrl,
            ]
        ]);
    } catch (Exception $e) {
        sendJson(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

// DELETE: Remove media file
if ($method === 'DELETE' || ($method === 'POST' && ($_POST['_method'] ?? '') === 'DELETE')) {
    requireAuthUser();
    $mediaId = (int)($_GET['id'] ?? 0);
    if (!$mediaId) {
        $input = getJsonInput();
        $mediaId = (int)($input['id'] ?? 0);
    }

    if (!$mediaId) {
        sendJson(['success' => false, 'error' => 'Media ID required for deletion'], 400);
    }

    try {
        $stmt = $pdo->prepare("SELECT filename FROM uploaded_media WHERE id = ? LIMIT 1");
        $stmt->execute([$mediaId]);
        $item = $stmt->fetch();

        if ($item && !empty($item['filename'])) {
            $filePath = dirname(__DIR__) . '/uploads/' . $item['filename'];
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }

        $delStmt = $pdo->prepare("DELETE FROM uploaded_media WHERE id = ?");
        $delStmt->execute([$mediaId]);

        sendJson(['success' => true, 'message' => 'Media item deleted successfully']);
    } catch (Exception $e) {
        sendJson(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
