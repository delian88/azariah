<?php
require_once __DIR__ . '/db.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();

// GET: Fetch all settings
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT `key`, `value` FROM site_settings");
        $rows = $stmt->fetchAll();
        $settingsMap = [];
        foreach ($rows as $row) {
            $settingsMap[$row['key']] = $row['value'];
        }
        sendJson(['success' => true, 'settings' => $settingsMap]);
    } catch (Exception $e) {
        sendJson(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

// PUT / POST: Update settings (Requires Admin Auth)
if ($method === 'PUT' || $method === 'POST') {
    requireAuthUser();
    $input = getJsonInput();
    $settings = $input['settings'] ?? $input;

    if (!is_array($settings)) {
        sendJson(['success' => false, 'error' => 'Invalid settings payload'], 400);
    }

    try {
        $pdo->beginTransaction();
        $upsertStmt = $pdo->prepare("
            INSERT INTO site_settings (`key`, `value`, `type`, `updatedAt`) 
            VALUES (:key, :val, :type, NOW())
            ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updatedAt` = NOW()
        ");

        foreach ($settings as $key => $val) {
            $valStr = (string)($val ?? '');
            $type = (str_contains($key, 'url') || str_contains($key, 'image')) ? 'image' : 'text';
            $upsertStmt->execute([
                ':key' => $key,
                ':val' => $valStr,
                ':type' => $type
            ]);
        }
        $pdo->commit();

        // Return updated map
        $stmt = $pdo->query("SELECT `key`, `value` FROM site_settings");
        $rows = $stmt->fetchAll();
        $settingsMap = [];
        foreach ($rows as $row) {
            $settingsMap[$row['key']] = $row['value'];
        }

        sendJson([
            'success' => true,
            'message' => 'Settings updated successfully',
            'settings' => $settingsMap
        ]);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        sendJson(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
