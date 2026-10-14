<?php
/**
 * Authentication & Security Engine with 2FA OTP & 7-Day Device Trust
 * Azariah Management Group PHP Backend
 */
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/otp_mailer.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Allow action from path if called via router
if (!$action) {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (str_ends_with($uri, 'login')) $action = 'login';
    elseif (str_ends_with($uri, 'verify-otp')) $action = 'verify-otp';
    elseif (str_ends_with($uri, 'resend-otp')) $action = 'resend-otp';
    elseif (str_ends_with($uri, 'devices')) $action = 'devices';
    elseif (str_ends_with($uri, 'revoke-device')) $action = 'revoke-device';
    elseif (str_ends_with($uri, 'me')) $action = 'me';
    elseif (str_ends_with($uri, 'change-password')) $action = 'change-password';
}

$pdo = getDbConnection();

// Helpers
function getClientIp() {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) return $_SERVER['HTTP_CF_CONNECTING_IP'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

function parseFriendlyDevice($userAgent) {
    if (!$userAgent) return 'Web Browser';
    $os = 'Unknown OS';
    if (stripos($userAgent, 'Windows') !== false) $os = 'Windows';
    elseif (stripos($userAgent, 'Macintosh') !== false || stripos($userAgent, 'Mac OS') !== false) $os = 'macOS';
    elseif (stripos($userAgent, 'iPhone') !== false) $os = 'iPhone (iOS)';
    elseif (stripos($userAgent, 'iPad') !== false) $os = 'iPad (iPadOS)';
    elseif (stripos($userAgent, 'Android') !== false) $os = 'Android';
    elseif (stripos($userAgent, 'Linux') !== false) $os = 'Linux';

    $browser = 'Browser';
    if (stripos($userAgent, 'Edg') !== false) $browser = 'Edge';
    elseif (stripos($userAgent, 'Chrome') !== false) $browser = 'Chrome';
    elseif (stripos($userAgent, 'Safari') !== false) $browser = 'Safari';
    elseif (stripos($userAgent, 'Firefox') !== false) $browser = 'Firefox';

    return "$browser on $os";
}

function maskEmail($email) {
    $parts = explode('@', $email);
    if (count($parts) !== 2) return $email;
    $name = $parts[0];
    $domain = $parts[1];
    $len = strlen($name);
    if ($len <= 2) {
        return $name . '***@' . $domain;
    }
    return substr($name, 0, 2) . str_repeat('*', max(1, $len - 2)) . '@' . $domain;
}

// -------------------------------------------------------------
// ACTION 1: LOGIN (Password + Device Verification Check)
// -------------------------------------------------------------
if ($action === 'login' && $method === 'POST') {
    $input = getJsonInput();
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';
    $deviceToken = trim($input['deviceToken'] ?? '');
    $deviceName = trim($input['deviceName'] ?? '');

    if (!$username || !$password) {
        sendJson(['success' => false, 'error' => 'Username and password required'], 400);
    }

    if (!$deviceToken) {
        $deviceToken = 'amg_dev_' . bin2hex(random_bytes(16));
    }

    $sanitized = str_replace(',', '.', $username);
    $stmt = $pdo->prepare("
        SELECT id, username, email, passwordHash, name 
        FROM admin_users 
        WHERE username = :u1 OR email = :u2 OR username = :u3 OR email = :u4 
        LIMIT 1
    ");
    $stmt->execute([
        ':u1' => $username,
        ':u2' => $username,
        ':u3' => $sanitized,
        ':u4' => $sanitized
    ]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['passwordHash'])) {
        sendJson(['success' => false, 'error' => 'Invalid username or password'], 401);
    }

    $userId = (int)$user['id'];
    $ip = getClientIp();
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if (!$deviceName) {
        $deviceName = parseFriendlyDevice($ua);
    }

    // Check if this device is recognized and within the 7-day trust window
    $devStmt = $pdo->prepare("
        SELECT id, deviceToken, deviceName, trustedUntil, 
               (trustedUntil > NOW()) AS isTrusted
        FROM admin_devices 
        WHERE userId = ? AND deviceToken = ?
        LIMIT 1
    ");
    $devStmt->execute([$userId, $deviceToken]);
    $deviceRecord = $devStmt->fetch();

    $isTrusted = $deviceRecord && ((int)$deviceRecord['isTrusted'] === 1);

    // CASE A: Device is Recognized & within 7-day trust window -> Direct Login
    if ($isTrusted) {
        // Update last login timestamp
        $upDev = $pdo->prepare("
            UPDATE admin_devices 
            SET lastLoginAt = NOW(), ipAddress = ?, userAgent = ? 
            WHERE id = ?
        ");
        $upDev->execute([$ip, $ua, $deviceRecord['id']]);

        $token = generateJwt([
            'id' => $userId,
            'username' => $user['username'],
            'email' => $user['email'],
            'name' => $user['name']
        ]);

        sendJson([
            'success' => true,
            'requiresOtp' => false,
            'token' => $token,
            'deviceToken' => $deviceToken,
            'trustedUntil' => $deviceRecord['trustedUntil'],
            'user' => [
                'id' => $userId,
                'username' => $user['username'],
                'email' => $user['email'],
                'name' => $user['name']
            ]
        ]);
    }

    // CASE B: Unrecognized Device OR 7 days have passed -> Send OTP Email
    $reason = $deviceRecord 
        ? 'Periodic 7-day security re-verification required' 
        : 'Sign-in from an unrecognized device';

    // Generate 6-digit OTP code
    $otpCode = sprintf('%06d', random_int(100000, 999999));

    // Invalidate prior unused OTPs for this user & device
    $pdo->prepare("UPDATE admin_otps SET used = 1 WHERE userId = ? AND deviceToken = ? AND used = 0")
        ->execute([$userId, $deviceToken]);

    // Insert new OTP with 15-minute expiration
    $insOtp = $pdo->prepare("
        INSERT INTO admin_otps (`userId`, `otpCode`, `deviceToken`, `ipAddress`, `userAgent`, `expiresAt`, `used`, `createdAt`)
        VALUES (:uid, :code, :dt, :ip, :ua, DATE_ADD(NOW(), INTERVAL 15 MINUTE), 0, NOW())
    ");
    $insOtp->execute([
        ':uid' => $userId,
        ':code' => $otpCode,
        ':dt' => $deviceToken,
        ':ip' => $ip,
        ':ua' => $ua
    ]);

    // Send the HTML Email
    $mailResult = sendAdminOtpEmail(
        $user['email'],
        $user['name'] ?: 'Administrator',
        $otpCode,
        $deviceName,
        $ip,
        $reason
    );

    $isLocal = in_array($ip, ['127.0.0.1', '::1', 'localhost']) || str_contains($_SERVER['HTTP_HOST'] ?? '', 'localhost');

    $response = [
        'success' => true,
        'requiresOtp' => true,
        'message' => 'A 6-digit security code has been sent to ' . maskEmail($user['email']),
        'email' => $user['email'],
        'emailMasked' => maskEmail($user['email']),
        'deviceToken' => $deviceToken,
        'deviceName' => $deviceName,
        'reason' => $reason,
        'mailSent' => $mailResult['success']
    ];

    if (!$mailResult['success']) {
        $response['mailError'] = $mailResult['error'] ?? 'SMTP delivery failed';
        if ($isLocal) {
            $response['devOtpCode'] = $otpCode;
        }
    }

    sendJson($response);
}

// -------------------------------------------------------------
// ACTION 2: VERIFY OTP
// -------------------------------------------------------------
if ($action === 'verify-otp' && $method === 'POST') {
    $input = getJsonInput();
    $username = trim($input['username'] ?? '');
    $otpCode = trim($input['otpCode'] ?? '');
    $deviceToken = trim($input['deviceToken'] ?? '');
    $deviceName = trim($input['deviceName'] ?? '');

    if (!$username || !$otpCode || !$deviceToken) {
        sendJson(['success' => false, 'error' => 'Username, verification code, and device token required'], 400);
    }

    $sanitized = str_replace(',', '.', $username);
    $userStmt = $pdo->prepare("SELECT id, username, email, name FROM admin_users WHERE username = :u1 OR email = :u2 OR username = :u3 OR email = :u4 LIMIT 1");
    $userStmt->execute([
        ':u1' => $username,
        ':u2' => $username,
        ':u3' => $sanitized,
        ':u4' => $sanitized
    ]);
    $user = $userStmt->fetch();

    if (!$user) {
        sendJson(['success' => false, 'error' => 'User not found'], 404);
    }

    $userId = (int)$user['id'];

    // Check OTP record
    $otpStmt = $pdo->prepare("
        SELECT id, otpCode, expiresAt, used 
        FROM admin_otps 
        WHERE userId = :uid AND otpCode = :code AND deviceToken = :dt AND used = 0 AND expiresAt >= NOW()
        ORDER BY id DESC 
        LIMIT 1
    ");
    $otpStmt->execute([
        ':uid' => $userId,
        ':code' => $otpCode,
        ':dt' => $deviceToken
    ]);
    $otpRecord = $otpStmt->fetch();

    if (!$otpRecord) {
        sendJson(['success' => false, 'error' => 'Invalid or expired verification code. Please check your email or request a new code.'], 400);
    }

    // Mark OTP as used
    $pdo->prepare("UPDATE admin_otps SET used = 1 WHERE id = ?")->execute([$otpRecord['id']]);

    // Authorize & trust this device for 7 days
    $ip = getClientIp();
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if (!$deviceName) {
        $deviceName = parseFriendlyDevice($ua);
    }

    $devUpsert = $pdo->prepare("
        INSERT INTO admin_devices (`userId`, `deviceToken`, `deviceName`, `ipAddress`, `userAgent`, `trustedUntil`, `lastLoginAt`, `createdAt`)
        VALUES (:uid, :dt, :dn, :ip, :ua, DATE_ADD(NOW(), INTERVAL 7 DAY), NOW(), NOW())
        ON DUPLICATE KEY UPDATE 
            `trustedUntil` = DATE_ADD(NOW(), INTERVAL 7 DAY),
            `lastLoginAt` = NOW(),
            `deviceName` = VALUES(`deviceName`),
            `ipAddress` = VALUES(`ipAddress`),
            `userAgent` = VALUES(`userAgent`)
    ");
    $devUpsert->execute([
        ':uid' => $userId,
        ':dt' => $deviceToken,
        ':dn' => $deviceName,
        ':ip' => $ip,
        ':ua' => $ua
    ]);

    // Issue Long-lived Session Token (180 days)
    $token = generateJwt([
        'id' => $userId,
        'username' => $user['username'],
        'email' => $user['email'],
        'name' => $user['name']
    ]);

    sendJson([
        'success' => true,
        'message' => 'Device verified successfully. Trusted for 7 days.',
        'token' => $token,
        'deviceToken' => $deviceToken,
        'trustedUntil' => date('Y-m-d H:i:s', strtotime('+7 days')),
        'user' => [
            'id' => $userId,
            'username' => $user['username'],
            'email' => $user['email'],
            'name' => $user['name']
        ]
    ]);
}

// -------------------------------------------------------------
// ACTION 3: RESEND OTP
// -------------------------------------------------------------
if ($action === 'resend-otp' && $method === 'POST') {
    $input = getJsonInput();
    $username = trim($input['username'] ?? '');
    $deviceToken = trim($input['deviceToken'] ?? '');
    $deviceName = trim($input['deviceName'] ?? '');

    if (!$username || !$deviceToken) {
        sendJson(['success' => false, 'error' => 'Username and device token required'], 400);
    }

    $sanitized = str_replace(',', '.', $username);
    $userStmt = $pdo->prepare("SELECT id, username, email, name FROM admin_users WHERE username = :u1 OR email = :u2 OR username = :u3 OR email = :u4 LIMIT 1");
    $userStmt->execute([
        ':u1' => $username,
        ':u2' => $username,
        ':u3' => $sanitized,
        ':u4' => $sanitized
    ]);
    $user = $userStmt->fetch();

    if (!$user) {
        sendJson(['success' => false, 'error' => 'User not found'], 404);
    }

    $userId = (int)$user['id'];
    $ip = getClientIp();
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if (!$deviceName) {
        $deviceName = parseFriendlyDevice($ua);
    }

    $otpCode = sprintf('%06d', random_int(100000, 999999));

    // Invalidate previous OTPs
    $pdo->prepare("UPDATE admin_otps SET used = 1 WHERE userId = ? AND deviceToken = ? AND used = 0")
        ->execute([$userId, $deviceToken]);

    // Insert fresh OTP
    $insOtp = $pdo->prepare("
        INSERT INTO admin_otps (`userId`, `otpCode`, `deviceToken`, `ipAddress`, `userAgent`, `expiresAt`, `used`, `createdAt`)
        VALUES (:uid, :code, :dt, :ip, :ua, DATE_ADD(NOW(), INTERVAL 15 MINUTE), 0, NOW())
    ");
    $insOtp->execute([
        ':uid' => $userId,
        ':code' => $otpCode,
        ':dt' => $deviceToken,
        ':ip' => $ip,
        ':ua' => $ua
    ]);

    $mailResult = sendAdminOtpEmail(
        $user['email'],
        $user['name'] ?: 'Administrator',
        $otpCode,
        $deviceName,
        $ip,
        'Verification Code Resend Requested'
    );

    $isLocal = in_array($ip, ['127.0.0.1', '::1', 'localhost']) || str_contains($_SERVER['HTTP_HOST'] ?? '', 'localhost');
    $response = [
        'success' => true,
        'message' => 'A new 6-digit verification code has been dispatched to ' . maskEmail($user['email']),
        'mailSent' => $mailResult['success']
    ];
    if (!$mailResult['success']) {
        $response['mailError'] = $mailResult['error'] ?? 'SMTP delivery failed';
        if ($isLocal) {
            $response['devOtpCode'] = $otpCode;
        }
    }

    sendJson($response);
}

// -------------------------------------------------------------
// ACTION 4: LIST TRUSTED DEVICES
// -------------------------------------------------------------
if ($action === 'devices' && $method === 'GET') {
    $auth = requireAuthUser();
    $userId = (int)$auth['id'];

    $stmt = $pdo->prepare("
        SELECT id, deviceToken, deviceName, ipAddress, trustedUntil, lastLoginAt, createdAt,
               (trustedUntil > NOW()) AS isTrusted
        FROM admin_devices 
        WHERE userId = ? 
        ORDER BY lastLoginAt DESC
    ");
    $stmt->execute([$userId]);
    $devices = $stmt->fetchAll();

    sendJson(['success' => true, 'devices' => $devices]);
}

// -------------------------------------------------------------
// ACTION 5: REVOKE A TRUSTED DEVICE
// -------------------------------------------------------------
if ($action === 'revoke-device' && $method === 'POST') {
    $auth = requireAuthUser();
    $userId = (int)$auth['id'];
    $input = getJsonInput();
    $deviceId = (int)($input['deviceId'] ?? 0);
    $deviceToken = trim($input['deviceToken'] ?? '');

    if ($deviceId > 0) {
        $del = $pdo->prepare("DELETE FROM admin_devices WHERE id = ? AND userId = ?");
        $del->execute([$deviceId, $userId]);
    } elseif ($deviceToken) {
        $del = $pdo->prepare("DELETE FROM admin_devices WHERE deviceToken = ? AND userId = ?");
        $del->execute([$deviceToken, $userId]);
    } else {
        sendJson(['success' => false, 'error' => 'Device ID or token required'], 400);
    }

    sendJson(['success' => true, 'message' => 'Device authorization revoked successfully']);
}

// -------------------------------------------------------------
// ACTION 6: CURRENT USER PROFILE (Verify Session)
// -------------------------------------------------------------
if ($action === 'me' && $method === 'GET') {
    $auth = requireAuthUser();
    $stmt = $pdo->prepare("SELECT id, username, email, name, createdAt FROM admin_users WHERE id = ? LIMIT 1");
    $stmt->execute([(int)$auth['id']]);
    $user = $stmt->fetch();

    if (!$user) {
        sendJson(['success' => false, 'error' => 'User not found'], 404);
    }

    sendJson(['success' => true, 'user' => $user]);
}

// -------------------------------------------------------------
// ACTION 7: CHANGE PASSWORD
// -------------------------------------------------------------
if ($action === 'change-password' && $method === 'POST') {
    $auth = requireAuthUser();
    $input = getJsonInput();
    $currentPassword = $input['currentPassword'] ?? '';
    $newPassword = $input['newPassword'] ?? '';

    if (!$currentPassword || !$newPassword) {
        sendJson(['success' => false, 'error' => 'Current and new password required'], 400);
    }
    if (strlen($newPassword) < 6) {
        sendJson(['success' => false, 'error' => 'New password must be at least 6 characters'], 400);
    }

    $stmt = $pdo->prepare("SELECT id, passwordHash FROM admin_users WHERE id = ? LIMIT 1");
    $stmt->execute([(int)$auth['id']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($currentPassword, $user['passwordHash'])) {
        sendJson(['success' => false, 'error' => 'Current password is incorrect'], 400);
    }

    $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
    $upStmt = $pdo->prepare("UPDATE admin_users SET passwordHash = ?, updatedAt = NOW() WHERE id = ?");
    $upStmt->execute([$newHash, (int)$user['id']]);

    sendJson(['success' => true, 'message' => 'Password updated successfully']);
}

sendJson(['success' => false, 'error' => 'Invalid auth endpoint or method'], 404);
