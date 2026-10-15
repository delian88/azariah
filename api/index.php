<?php
/**
 * Master API Router for Azariah Management Group PHP Backend
 */
require_once __DIR__ . '/db.php';
setCorsHeaders();

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Extract the path after /api/ or api/ (works for root domains, localhost:3000, and subfolders like /azariah/api/...)
$path = '';
if (preg_match('#(?:^|/)api(?:/index\.php)?(?:/(.*))?$#i', $uri, $matches)) {
    $path = $matches[1] ?? '';
} else {
    $path = trim($uri, '/');
}
$path = trim($path, '/');

// 1. Settings Routes (/settings, /admin/settings)
if ($path === 'settings' || $path === 'admin/settings') {
    require __DIR__ . '/settings.php';
    exit(0);
}

// 2. Sections Routes (/sections, /sections/:key, /admin/sections/:key)
if ($path === 'sections' || str_starts_with($path, 'sections/') || str_starts_with($path, 'admin/sections/')) {
    // Extract key if present
    if (preg_match('#(?:admin/)?sections/([a-zA-Z0-9_-]+)#', $path, $matches)) {
        $_GET['key'] = $matches[1];
    }
    require __DIR__ . '/sections.php';
    exit(0);
}

// 3. Auth Routes (/admin/login, /admin/me, /admin/change-password, /admin/verify-otp, /admin/resend-otp, /admin/devices)
if ($path === 'admin/login' || $path === 'login') {
    $_GET['action'] = 'login';
    require __DIR__ . '/auth.php';
    exit(0);
}
if ($path === 'admin/verify-otp' || $path === 'verify-otp') {
    $_GET['action'] = 'verify-otp';
    require __DIR__ . '/auth.php';
    exit(0);
}
if ($path === 'admin/resend-otp' || $path === 'resend-otp') {
    $_GET['action'] = 'resend-otp';
    require __DIR__ . '/auth.php';
    exit(0);
}
if ($path === 'admin/devices' || $path === 'devices') {
    $_GET['action'] = 'devices';
    require __DIR__ . '/auth.php';
    exit(0);
}
if ($path === 'admin/revoke-device' || $path === 'revoke-device') {
    $_GET['action'] = 'revoke-device';
    require __DIR__ . '/auth.php';
    exit(0);
}
if ($path === 'admin/me' || $path === 'me') {
    $_GET['action'] = 'me';
    require __DIR__ . '/auth.php';
    exit(0);
}
if ($path === 'admin/change-password') {
    $_GET['action'] = 'change-password';
    require __DIR__ . '/auth.php';
    exit(0);
}

// 4. Upload & Media Routes (/admin/upload, /upload, /admin/media, /media)
if ($path === 'admin/upload' || $path === 'upload' || $path === 'admin/media' || $path === 'media' || str_starts_with($path, 'admin/media/')) {
    if (preg_match('#(?:admin/)?media/([0-9]+)#', $path, $matches)) {
        $_GET['id'] = $matches[1];
    }
    require __DIR__ . '/upload.php';
    exit(0);
}

// 5. Inquiry & Contact Routes (/inquiry, /contact)
if ($path === 'inquiry' || $path === 'contact') {
    require dirname(__DIR__) . '/mailer.php';
    exit(0);
}

// 6. Database Setup / Schema migration route (/setup)
if ($path === 'setup') {
    require __DIR__ . '/setup.php';
    exit(0);
}

// 7. Root API status check
if ($path === '' || $path === 'status') {
    sendJson([
        'success' => true,
        'message' => 'Azariah Management Group PHP Backend API Operational',
        'php_version' => PHP_VERSION,
        'timestamp' => date('c'),
    ]);
}

// Fallback: 404
sendJson([
    'success' => false,
    'error' => "Endpoint not found: $uri"
], 404);
