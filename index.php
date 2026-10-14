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

// 4. Serve compiled production SPA
if (file_exists(__DIR__ . '/dist/index.html')) {
    header("Content-Type: text/html; charset=UTF-8");
    readfile(__DIR__ . '/dist/index.html');
    exit(0);
}

// 5. Fallback to Vite source index.html
if (file_exists(__DIR__ . '/index.html')) {
    header("Content-Type: text/html; charset=UTF-8");
    readfile(__DIR__ . '/index.html');
    exit(0);
}

http_response_code(404);
echo "Azariah Management Group - 404 Not Found";
