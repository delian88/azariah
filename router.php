<?php
/**
 * PHP Built-in Server Router for Azariah Management Group
 * Usage: php -S 127.0.0.1:8000 router.php
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. API calls -> route to api/index.php
if (str_starts_with($uri, '/api')) {
    require __DIR__ . '/api/index.php';
    exit(0);
}

// 2. Direct uploads files -> serve directly
if (str_starts_with($uri, '/uploads/')) {
    $filePath = __DIR__ . $uri;
    if (file_exists($filePath) && !is_dir($filePath)) {
        $mime = mime_content_type($filePath) ?: 'application/octet-stream';
        header("Content-Type: $mime");
        readfile($filePath);
        exit(0);
    }
}

// 3. Existing static files (CSS, JS, images in dist/ or root) -> let PHP built-in server handle
$distFile = __DIR__ . '/dist' . $uri;
if (file_exists($distFile) && !is_dir($distFile)) {
    $ext = pathinfo($distFile, PATHINFO_EXTENSION);
    $mimes = [
        'js' => 'application/javascript',
        'css' => 'text/css',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'svg' => 'image/svg+xml',
        'json' => 'application/json',
        'woff2' => 'font/woff2',
        'woff' => 'font/woff',
        'ttf' => 'font/ttf'
    ];
    if (isset($mimes[$ext])) {
        header("Content-Type: " . $mimes[$ext]);
    }
    readfile($distFile);
    exit(0);
}

// 4. Default: serve dist/index.html (or index.html for Vite)
if (file_exists(__DIR__ . '/dist/index.html')) {
    header("Content-Type: text/html; charset=UTF-8");
    readfile(__DIR__ . '/dist/index.html');
    exit(0);
}

if (file_exists(__DIR__ . '/index.html')) {
    header("Content-Type: text/html; charset=UTF-8");
    readfile(__DIR__ . '/index.html');
    exit(0);
}

// Return 404
http_response_code(404);
echo "404 Not Found";
