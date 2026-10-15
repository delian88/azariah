<?php
// Prevent multiple inclusions
if (defined('AMG_API_DB_LOADED')) {
    return;
}
define('AMG_API_DB_LOADED', true);

// Set standard JSON and CORS headers
function setCorsHeaders() {
    if (php_sapi_name() === 'cli') {
        return;
    }
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Content-Type: application/json; charset=UTF-8");

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(200);
        exit(0);
    }
}

// Simple .env parser
function loadEnv($path = null) {
    if (!$path) {
        $path = dirname(__DIR__) . '/.env';
    }
    if (!file_exists($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value, " \t\n\r\0\x0B\"'");
            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv("$name=$value");
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
}

loadEnv();

// Database Connection
function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $isLocal = false;
    $httpHost = $_SERVER['HTTP_HOST'] ?? '';
    if (php_sapi_name() === 'cli' || strpos($httpHost, 'localhost') !== false || strpos($httpHost, '127.0.0.1') !== false) {
        $isLocal = true;
    }

    if ($isLocal) {
        $defaultHost = '127.0.0.1';
        $defaultPort = '3306';
        $defaultName = 'azariah_db';
        $defaultUser = 'root';
        $defaultPass = '';
    } else {
        $defaultHost = 'localhost';
        $defaultPort = '3306';
        $defaultName = 'worlvjwl_azariahmg';
        $defaultUser = 'worlvjwl_azariahmg-user';
        $defaultPass = 'azariahmg-user$1';
    }

    $dbHost = $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? getenv('DB_HOST') ?: $defaultHost;
    $dbPort = $_ENV['DB_PORT'] ?? $_SERVER['DB_PORT'] ?? getenv('DB_PORT') ?: $defaultPort;
    $dbName = $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? getenv('DB_NAME') ?: $defaultName;
    $dbUser = $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? getenv('DB_USER') ?: $defaultUser;
    $dbPass = $_ENV['DB_PASS'] ?? $_SERVER['DB_PASS'] ?? (getenv('DB_PASS') !== false ? getenv('DB_PASS') : $defaultPass);

    // Check if DATABASE_URL is set (from Prisma .env)
    $databaseUrl = $_ENV['DATABASE_URL'] ?? $_SERVER['DATABASE_URL'] ?? getenv('DATABASE_URL');
    if ($databaseUrl) {
        $parsed = parse_url($databaseUrl);
        if ($parsed) {
            $dbHost = $parsed['host'] ?? $dbHost;
            $dbPort = $parsed['port'] ?? $dbPort;
            if (isset($parsed['user'])) {
                $dbUser = urldecode($parsed['user']);
            }
            if (isset($parsed['pass'])) {
                $dbPass = urldecode($parsed['pass']);
            }
            if (isset($parsed['path'])) {
                $dbName = ltrim($parsed['path'], '/');
            }
        }
    }

    // Explicit DB_PASS / DB_USER / DB_NAME take final precedence
    if (!empty($_ENV['DB_USER'])) {
        $dbUser = $_ENV['DB_USER'];
    }
    if (!empty($_ENV['DB_PASS'])) {
        $dbPass = $_ENV['DB_PASS'];
    }
    if (!empty($_ENV['DB_NAME'])) {
        $dbName = $_ENV['DB_NAME'];
    }
    if (!empty($_ENV['DB_HOST'])) {
        $dbHost = $_ENV['DB_HOST'];
    }

    try {
        $dsn = "mysql:host=$dbHost;port=$dbPort;dbname=$dbName;charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        sendJson([
            'success' => false,
            'error' => 'Database connection failed: ' . $e->getMessage()
        ], 500);
        exit(1);
    }
}

// Send JSON Response
function sendJson($data, $statusCode = 200) {
    if (php_sapi_name() !== 'cli' && !headers_sent()) {
        http_response_code($statusCode);
    }
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit(0);
}

// Read JSON Input
function getJsonInput() {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

// Base64URL Helpers
function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

// Generate JWT Token
function generateJwt($payload) {
    $secret = getenv('JWT_SECRET') ?: 'azariah-jwt-secret-key-2025-secure';
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);

    $payload['iat'] = time();
    $payload['exp'] = time() + (86400 * 180); // 180 days (keeps session active until explicit signout)

    $base64Header = base64UrlEncode($header);
    $base64Payload = base64UrlEncode(json_encode($payload));

    $signature = hash_hmac('sha256', "$base64Header.$base64Payload", $secret, true);
    $base64Signature = base64UrlEncode($signature);

    return "$base64Header.$base64Payload.$base64Signature";
}

// Verify JWT Token
function verifyJwt($token) {
    if (!$token) return null;
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    list($base64Header, $base64Payload, $base64Signature) = $parts;
    $secret = getenv('JWT_SECRET') ?: 'azariah-jwt-secret-key-2025-secure';

    $expectedSignature = base64UrlEncode(hash_hmac('sha256', "$base64Header.$base64Payload", $secret, true));
    if (!hash_equals($expectedSignature, $base64Signature)) {
        return null;
    }

    $payload = json_decode(base64UrlDecode($base64Payload), true);
    if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
        return null;
    }

    return $payload;
}

// Require Authentication Middleware
function requireAuthUser() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!$authHeader && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        sendJson(['success' => false, 'error' => 'Unauthorized: Missing or invalid token'], 401);
    }

    $token = trim($matches[1]);
    $user = verifyJwt($token);
    if (!$user) {
        sendJson(['success' => false, 'error' => 'Unauthorized: Invalid or expired token'], 401);
    }

    return $user;
}
