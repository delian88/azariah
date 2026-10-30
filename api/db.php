<?php
// Prevent multiple inclusions
if (defined('AMG_API_DB_LOADED')) {
    return;
}
define('AMG_API_DB_LOADED', true);

// Enforce standard UTC timezone across all PHP operations
date_default_timezone_set('UTC');

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
        // Enforce UTC timezone for all MySQL session queries and functions
        $pdo->exec("SET time_zone = '+00:00'");
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

// Require Admin Privilege
function requireAdminUser() {
    $user = requireAuthUser();
    if (isset($user['role']) && $user['role'] === 'developer') {
        sendJson(['success' => false, 'error' => 'Forbidden: Administrator privileges required'], 403);
    }
    return $user;
}

// Require Developer Privilege
function requireDeveloperUser() {
    $user = requireAuthUser();
    if (!isset($user['role']) || $user['role'] !== 'developer') {
        sendJson(['success' => false, 'error' => 'Forbidden: Developer privileges required'], 403);
    }
    return $user;
}

// Automatically ensure developer and project tables exist in the database
function ensureDevModuleTables($pdo) {
    static $tablesChecked = false;
    if ($tablesChecked) return;

    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `developers` (
              `id` INT NOT NULL AUTO_INCREMENT,
              `name` VARCHAR(191) NOT NULL,
              `email` VARCHAR(191) NOT NULL,
              `passwordHash` VARCHAR(191) NOT NULL,
              `roleTitle` VARCHAR(191) NOT NULL DEFAULT 'Developer',
              `hourlyRate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
              `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
              `phone` VARCHAR(64) NULL,
              `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
              `emailConfirmed` TINYINT(1) NOT NULL DEFAULT 0,
              `confirmationToken` VARCHAR(128) NULL,
              `lastLoginAt` DATETIME NULL,
              `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
              `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
              PRIMARY KEY (`id`),
              UNIQUE KEY `developers_email_key` (`email`),
              INDEX `idx_developers_status` (`status`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `projects` (
              `id` INT NOT NULL AUTO_INCREMENT,
              `name` VARCHAR(191) NOT NULL,
              `slug` VARCHAR(191) NOT NULL,
              `description` LONGTEXT NULL,
              `budget` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
              `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
              `status` ENUM('planning', 'in_progress', 'in_review', 'launched', 'on_hold') NOT NULL DEFAULT 'planning',
              `launchDate` DATE NULL,
              `repoUrl` VARCHAR(255) NULL,
              `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
              `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
              PRIMARY KEY (`id`),
              UNIQUE KEY `projects_slug_key` (`slug`),
              INDEX `idx_projects_status` (`status`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `project_milestones` (
              `id` INT NOT NULL AUTO_INCREMENT,
              `projectId` INT NOT NULL,
              `title` VARCHAR(255) NOT NULL,
              `description` TEXT NULL,
              `dueDate` DATE NULL,
              `status` ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
              `orderIndex` INT NOT NULL DEFAULT 0,
              `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
              `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
              PRIMARY KEY (`id`),
              INDEX `idx_milestones_project` (`projectId`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `project_developers` (
              `id` INT NOT NULL AUTO_INCREMENT,
              `projectId` INT NOT NULL,
              `developerId` INT NOT NULL,
              `roleInProject` VARCHAR(191) NULL DEFAULT 'Lead Developer',
              `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
              PRIMARY KEY (`id`),
              UNIQUE KEY `idx_project_developer` (`projectId`, `developerId`),
              INDEX `idx_dev_assignments` (`developerId`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `developer_time_logs` (
              `id` INT NOT NULL AUTO_INCREMENT,
              `developerId` INT NOT NULL,
              `projectId` INT NULL,
              `clockIn` DATETIME NOT NULL,
              `clockOut` DATETIME NULL,
              `totalMinutes` INT NOT NULL DEFAULT 0,
              `taskSummary` TEXT NULL,
              `ipAddress` VARCHAR(64) NULL,
              `clientTimezone` VARCHAR(64) NULL,
              `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
              `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
              PRIMARY KEY (`id`),
              INDEX `idx_timelogs_dev` (`developerId`),
              INDEX `idx_timelogs_proj` (`projectId`),
              INDEX `idx_timelogs_clockin` (`clockIn`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `payslips` (
              `id` INT NOT NULL AUTO_INCREMENT,
              `developerId` INT NOT NULL,
              `referenceNo` VARCHAR(64) NOT NULL,
              `periodStart` DATE NOT NULL,
              `periodEnd` DATE NOT NULL,
              `hoursBilled` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
              `hourlyRate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
              `bonus` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
              `deductions` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
              `totalAmount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
              `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
              `paymentMethod` VARCHAR(128) NOT NULL DEFAULT 'Bank Transfer',
              `notes` TEXT NULL,
              `status` ENUM('issued', 'confirmed') NOT NULL DEFAULT 'issued',
              `confirmedAt` DATETIME NULL,
              `issuedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
              `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
              PRIMARY KEY (`id`),
              UNIQUE KEY `payslips_ref_key` (`referenceNo`),
              INDEX `idx_payslips_dev` (`developerId`),
              INDEX `idx_payslips_status` (`status`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `developer_tasks` (
              `id` INT NOT NULL AUTO_INCREMENT,
              `title` VARCHAR(255) NOT NULL,
              `description` LONGTEXT NULL,
              `developerId` INT NOT NULL,
              `projectId` INT NULL,
              `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
              `status` ENUM('pending', 'in_progress', 'in_review', 'completed', 'blocked') NOT NULL DEFAULT 'pending',
              `dueDate` DATE NULL,
              `estimatedHours` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
              `actualHours` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
              `assignedByAdminId` INT NULL,
              `assignedByAdminName` VARCHAR(191) NULL DEFAULT 'Admin',
              `completedAt` DATETIME NULL,
              `notes` TEXT NULL,
              `emailNotified` TINYINT(1) NOT NULL DEFAULT 0,
              `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
              `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
              PRIMARY KEY (`id`),
              INDEX `idx_tasks_dev` (`developerId`),
              INDEX `idx_tasks_status` (`status`),
              INDEX `idx_tasks_priority` (`priority`),
              INDEX `idx_tasks_proj` (`projectId`),
              INDEX `idx_tasks_due` (`dueDate`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `departments` (
              `id` INT NOT NULL AUTO_INCREMENT,
              `name` VARCHAR(191) NOT NULL,
              `slug` VARCHAR(191) NOT NULL,
              `description` TEXT NULL,
              `color` VARCHAR(64) NULL DEFAULT '#38bdf8',
              `leadStaffId` INT NULL,
              `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
              `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
              PRIMARY KEY (`id`),
              UNIQUE KEY `idx_dept_name` (`name`),
              UNIQUE KEY `idx_dept_slug` (`slug`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        // Safely migrate existing developers table to have departmentId & department
        try {
            $pdo->exec("ALTER TABLE `developers` ADD COLUMN `departmentId` INT NULL AFTER `roleTitle`");
        } catch (Exception $e) {}
        try {
            $pdo->exec("ALTER TABLE `developers` ADD COLUMN `department` VARCHAR(191) NULL DEFAULT 'Engineering & Technology' AFTER `departmentId`");
        } catch (Exception $e) {}

        // Safely migrate existing developer_tasks table to have departmentId & department
        try {
            $pdo->exec("ALTER TABLE `developer_tasks` ADD COLUMN `departmentId` INT NULL AFTER `projectId`");
        } catch (Exception $e) {}
        try {
            $pdo->exec("ALTER TABLE `developer_tasks` ADD COLUMN `department` VARCHAR(191) NULL AFTER `departmentId`");
        } catch (Exception $e) {}

        // Safely migrate existing developer_time_logs table to have clientTimezone column
        try {
            $pdo->exec("ALTER TABLE `developer_time_logs` ADD COLUMN `clientTimezone` VARCHAR(64) NULL AFTER `ipAddress`");
        } catch (Exception $colEx) {
            // Column already exists
        }

        // Auto-seed standard enterprise departments if table is empty
        try {
            $deptCount = (int)$pdo->query("SELECT COUNT(*) FROM `departments`")->fetchColumn();
            if ($deptCount === 0) {
                $defaultDepts = [
                    ['Engineering & Technology', 'engineering-technology', 'Software engineering, cloud infrastructure, AI architecture, and full stack development.', '#38bdf8'],
                    ['Strategic Marketing & Media', 'strategic-marketing-media', 'Media production, strategic communications, brand campaigns, and audience intelligence.', '#a855f7'],
                    ['Operations & Advisory', 'operations-advisory', 'Executive consulting, cross-border business execution, and strategic resource coordination.', '#10b981'],
                    ['Corporate Finance & Accounting', 'corporate-finance-accounting', 'Financial analysis, investor relations, budgeting, and capital allocation.', '#fbbf24'],
                    ['Legal & Compliance', 'legal-compliance', 'Corporate governance, contracts, intellectual property, and regulatory affairs.', '#f97316'],
                    ['Creative Direction & Design', 'creative-direction-design', 'Visual branding, UI/UX interface design, multimedia art, and digital assets.', '#ec4899'],
                    ['Human Resources & Talent', 'human-resources-talent', 'People operations, talent acquisition, culture development, and organizational growth.', '#06b6d4']
                ];

                $insStmt = $pdo->prepare("INSERT INTO `departments` (`name`, `slug`, `description`, `color`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, NOW(3), NOW(3))");
                foreach ($defaultDepts as $d) {
                    $insStmt->execute($d);
                }
            }
        } catch (Exception $deptErr) {
            // Logged gracefully
        }

        $tablesChecked = true;
    } catch (Exception $e) {
        // Table creation error logged gracefully
        @file_put_contents(dirname(__DIR__) . '/db_migration_err.log', date('c') . " " . $e->getMessage() . "\n", FILE_APPEND);
    }
}

function ensureBlogTables($pdo) {
    static $blogTablesChecked = false;
    if ($blogTablesChecked) return;

    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `blog_posts` (
              `id` INT NOT NULL AUTO_INCREMENT,
              `title` VARCHAR(255) NOT NULL,
              `slug` VARCHAR(255) NOT NULL,
              `excerpt` TEXT NULL,
              `content` LONGTEXT NOT NULL,
              `coverImage` VARCHAR(500) NULL,
              `category` VARCHAR(100) NOT NULL DEFAULT 'Insights',
              `tags` VARCHAR(255) NULL,
              `author` VARCHAR(191) NOT NULL DEFAULT 'Azariah Editorial Team',
              `authorRole` VARCHAR(191) NULL DEFAULT 'Executive Contributor',
              `authorAvatar` VARCHAR(500) NULL,
              `status` ENUM('published', 'draft', 'archived') NOT NULL DEFAULT 'published',
              `isFeatured` TINYINT(1) NOT NULL DEFAULT 0,
              `readTimeMinutes` INT NOT NULL DEFAULT 5,
              `views` INT NOT NULL DEFAULT 0,
              `publishedAt` DATETIME NULL,
              `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
              `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
              PRIMARY KEY (`id`),
              UNIQUE KEY `blog_slug_key` (`slug`),
              INDEX `idx_blog_status` (`status`),
              INDEX `idx_blog_category` (`category`),
              INDEX `idx_blog_featured` (`isFeatured`),
              INDEX `idx_blog_published` (`publishedAt`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        // Clean out hardcoded sample/seed articles so only real admin-published articles exist
        $pdo->exec("DELETE FROM `blog_posts` WHERE `slug` IN ('studio-amg-partners-on-nolly-oh-festival-uk', 'next-decade-strategic-ai-diaspora-capital') OR `title` LIKE '%Nolly Oh!%' OR `title` LIKE '%Strategic AI & Diaspora Capital Allocation%'");

        $blogTablesChecked = true;
    } catch (Exception $e) {
        @file_put_contents(dirname(__DIR__) . '/db_migration_err.log', date('c') . " [Blog Migration Error] " . $e->getMessage() . "\n", FILE_APPEND);
    }
}

function ensureManagementTeamTables($pdo) {
    static $teamTablesChecked = false;
    if ($teamTablesChecked) return;

    try {
        // Fetch existing columns in admin_users
        $colsStmt = $pdo->query("SHOW COLUMNS FROM `admin_users`");
        $existingCols = [];
        while ($col = $colsStmt->fetch(PDO::FETCH_ASSOC)) {
            $existingCols[strtolower($col['Field'])] = true;
        }

        if (!isset($existingCols['role'])) {
            try { $pdo->exec("ALTER TABLE `admin_users` ADD COLUMN `role` VARCHAR(64) NOT NULL DEFAULT 'admin' AFTER `name`"); } catch (Exception $e) {}
        }
        if (!isset($existingCols['roletitle'])) {
            try { $pdo->exec("ALTER TABLE `admin_users` ADD COLUMN `roleTitle` VARCHAR(191) NOT NULL DEFAULT 'Managing Executive' AFTER `role`"); } catch (Exception $e) {}
        }
        if (!isset($existingCols['workflowrole'])) {
            try { $pdo->exec("ALTER TABLE `admin_users` ADD COLUMN `workflowRole` VARCHAR(64) NOT NULL DEFAULT 'approver' AFTER `roleTitle`"); } catch (Exception $e) {}
        }
        if (!isset($existingCols['department'])) {
            try { $pdo->exec("ALTER TABLE `admin_users` ADD COLUMN `department` VARCHAR(128) NULL DEFAULT 'Executive Management' AFTER `workflowRole`"); } catch (Exception $e) {}
        }
        if (!isset($existingCols['phone'])) {
            try { $pdo->exec("ALTER TABLE `admin_users` ADD COLUMN `phone` VARCHAR(64) NULL AFTER `department`"); } catch (Exception $e) {}
        }
        if (!isset($existingCols['permissions'])) {
            try { $pdo->exec("ALTER TABLE `admin_users` ADD COLUMN `permissions` LONGTEXT NULL AFTER `phone`"); } catch (Exception $e) {}
        }
        if (!isset($existingCols['status'])) {
            try { $pdo->exec("ALTER TABLE `admin_users` ADD COLUMN `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' AFTER `permissions`"); } catch (Exception $e) {}
        }
        if (!isset($existingCols['lastloginat'])) {
            try { $pdo->exec("ALTER TABLE `admin_users` ADD COLUMN `lastLoginAt` DATETIME NULL AFTER `status`"); } catch (Exception $e) {}
        }

        // Set default super admin permissions and executive title for root admin (id = 1 or username = 'admin' or email = 'info@azariahmg.com')
        $fullPerms = json_encode([
            'manage_team',
            'manage_content',
            'manage_blog',
            'manage_projects',
            'manage_developers',
            'manage_payroll',
            'manage_timetracking',
            'manage_security'
        ]);
        $pdo->prepare("
            UPDATE `admin_users` 
            SET `role` = 'super_admin',
                `roleTitle` = COALESCE(NULLIF(`roleTitle`, ''), 'Managing Partner'),
                `workflowRole` = 'approver',
                `department` = COALESCE(NULLIF(`department`, ''), 'Executive Leadership'),
                `permissions` = COALESCE(`permissions`, :perms)
            WHERE `id` = 1 OR `username` = 'admin' OR `email` = 'info@azariahmg.com'
        ")->execute([':perms' => $fullPerms]);

        $teamTablesChecked = true;
    } catch (Exception $e) {
        @file_put_contents(dirname(__DIR__) . '/db_migration_err.log', date('c') . " [Team Migration Error] " . $e->getMessage() . "\n", FILE_APPEND);
    }
}
