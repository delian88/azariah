<?php
/**
 * Developer Management & Authentication API
 * Azariah Management Group Backend
 */
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/developer_mailer.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Determine action from URI if routed via index.php
if (!$action) {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (str_ends_with($uri, 'developers/login') || str_ends_with($uri, 'developer/login')) $action = 'login';
    elseif (str_ends_with($uri, 'developers/me') || str_ends_with($uri, 'developer/me')) $action = 'me';
    elseif (str_ends_with($uri, 'developers/resend-invite')) $action = 'resend-invite';
    elseif (str_ends_with($uri, 'developers/change-password')) $action = 'change-password';
}

$pdo = getDbConnection();
ensureDevModuleTables($pdo);

// -----------------------------------------------------------------------------
// 1. DEVELOPER LOGIN (Developer Self-Service)
// -----------------------------------------------------------------------------
if ($action === 'login' && $method === 'POST') {
    $input = getJsonInput();
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        sendJson(['success' => false, 'error' => 'Email and password are required'], 400);
    }

    $stmt = $pdo->prepare("SELECT id, name, email, passwordHash, roleTitle, departmentId, department, hourlyRate, currency, phone, status, emailConfirmed FROM developers WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $dev = $stmt->fetch();

    if (!$dev || !password_verify($password, $dev['passwordHash'])) {
        sendJson(['success' => false, 'error' => 'Invalid email or password'], 401);
    }

    if ($dev['status'] === 'inactive') {
        sendJson(['success' => false, 'error' => 'Your staff account is inactive. Please contact your manager.'], 403);
    }

    // Update last login
    $pdo->prepare("UPDATE developers SET lastLoginAt = NOW(), emailConfirmed = 1 WHERE id = ?")->execute([$dev['id']]);

    // Issue Developer JWT Token
    $token = generateJwt([
        'id' => (int)$dev['id'],
        'email' => $dev['email'],
        'name' => $dev['name'],
        'role' => 'developer',
        'roleTitle' => $dev['roleTitle'],
        'department' => $dev['department'] ?: 'Engineering & Technology'
    ]);

    // Fetch assigned projects
    $projStmt = $pdo->prepare("
        SELECT p.id, p.name, p.slug, p.status, p.launchDate, pd.roleInProject 
        FROM projects p 
        JOIN project_developers pd ON p.id = pd.projectId 
        WHERE pd.developerId = ?
    ");
    $projStmt->execute([$dev['id']]);
    $projects = $projStmt->fetchAll();

    sendJson([
        'success' => true,
        'token' => $token,
        'developer' => [
            'id' => (int)$dev['id'],
            'name' => $dev['name'],
            'email' => $dev['email'],
            'roleTitle' => $dev['roleTitle'],
            'departmentId' => $dev['departmentId'],
            'department' => $dev['department'] ?: 'Engineering & Technology',
            'hourlyRate' => (float)$dev['hourlyRate'],
            'currency' => $dev['currency'],
            'phone' => $dev['phone'],
            'status' => $dev['status'],
            'emailConfirmed' => (bool)$dev['emailConfirmed'],
            'projects' => $projects
        ]
    ]);
}

// -----------------------------------------------------------------------------
// 2. DEVELOPER ME (Fetch profile & assigned projects)
// -----------------------------------------------------------------------------
if ($action === 'me' && $method === 'GET') {
    $auth = requireDeveloperUser();
    $devId = $auth['id'];

    $stmt = $pdo->prepare("SELECT id, name, email, roleTitle, departmentId, department, hourlyRate, currency, phone, status, emailConfirmed, lastLoginAt, createdAt FROM developers WHERE id = ? LIMIT 1");
    $stmt->execute([$devId]);
    $dev = $stmt->fetch();

    if (!$dev) {
        sendJson(['success' => false, 'error' => 'Developer record not found'], 404);
    }

    $projStmt = $pdo->prepare("
        SELECT p.id, p.name, p.slug, p.description, p.status, p.launchDate, p.repoUrl, pd.roleInProject 
        FROM projects p 
        JOIN project_developers pd ON p.id = pd.projectId 
        WHERE pd.developerId = ?
    ");
    $projStmt->execute([$devId]);
    $dev['projects'] = $projStmt->fetchAll();

    sendJson(['success' => true, 'developer' => $dev]);
}

// -----------------------------------------------------------------------------
// 3. DEVELOPER CHANGE PASSWORD
// -----------------------------------------------------------------------------
if ($action === 'change-password' && $method === 'POST') {
    $auth = requireDeveloperUser();
    $input = getJsonInput();
    $currentPass = $input['currentPassword'] ?? '';
    $newPass = $input['newPassword'] ?? '';

    if (strlen($newPass) < 6) {
        sendJson(['success' => false, 'error' => 'New password must be at least 6 characters long'], 400);
    }

    $stmt = $pdo->prepare("SELECT passwordHash FROM developers WHERE id = ?");
    $stmt->execute([$auth['id']]);
    $hash = $stmt->fetchColumn();

    if (!password_verify($currentPass, $hash)) {
        sendJson(['success' => false, 'error' => 'Current password is incorrect'], 400);
    }

    $newHash = password_hash($newPass, PASSWORD_BCRYPT);
    $pdo->prepare("UPDATE developers SET passwordHash = ? WHERE id = ?")->execute([$newHash, $auth['id']]);

    sendJson(['success' => true, 'message' => 'Password updated successfully']);
}

// -----------------------------------------------------------------------------
// 4. ADMIN: RESEND INVITE WITH TEMPORARY PASSWORD
// -----------------------------------------------------------------------------
if ($action === 'resend-invite' && $method === 'POST') {
    requireAdminUser();
    $input = getJsonInput();
    $devId = (int)($input['developerId'] ?? 0);
    $customPass = trim($input['password'] ?? '');

    $stmt = $pdo->prepare("SELECT id, name, email, roleTitle FROM developers WHERE id = ?");
    $stmt->execute([$devId]);
    $dev = $stmt->fetch();

    if (!$dev) {
        sendJson(['success' => false, 'error' => 'Developer not found'], 404);
    }

    $plainPassword = $customPass ?: 'AMG-Dev-' . substr(bin2hex(random_bytes(4)), 0, 8) . '!';
    $passwordHash = password_hash($plainPassword, PASSWORD_BCRYPT);

    $pdo->prepare("UPDATE developers SET passwordHash = ? WHERE id = ?")->execute([$passwordHash, $devId]);

    // Fetch assigned project titles
    $pStmt = $pdo->prepare("SELECT p.name FROM projects p JOIN project_developers pd ON p.id = pd.projectId WHERE pd.developerId = ?");
    $pStmt->execute([$devId]);
    $projectNames = $pStmt->fetchAll(PDO::FETCH_COLUMN);

    $mailResult = sendDeveloperWelcomeEmail(
        $dev['email'],
        $dev['name'],
        $plainPassword,
        $dev['roleTitle'],
        $projectNames
    );

    sendJson([
        'success' => true,
        'message' => 'Invitation credentials sent to ' . $dev['email'],
        'emailSent' => $mailResult['success'],
        'credentials' => [
            'email' => $dev['email'],
            'password' => $plainPassword
        ]
    ]);
}

// =============================================================================
// ADMIN CRUD OPERATIONS (Require Admin)
// =============================================================================
requireAdminUser();

// -----------------------------------------------------------------------------
// GET /api/developers: List all staff/developers with project and hours aggregates
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $deptFilter = isset($_GET['department']) && $_GET['department'] !== 'all' ? trim($_GET['department']) : '';
    $deptIdFilter = isset($_GET['departmentId']) ? (int)$_GET['departmentId'] : 0;

    $where = [];
    $params = [];
    if ($deptIdFilter > 0) {
        $where[] = "(d.departmentId = ?)";
        $params[] = $deptIdFilter;
    } elseif ($deptFilter !== '') {
        $where[] = "(d.department = ? OR d.departmentId IN (SELECT id FROM departments WHERE name = ?))";
        $params[] = $deptFilter;
        $params[] = $deptFilter;
    }

    $whereSql = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $stmt = $pdo->prepare("
        SELECT d.id, d.name, d.email, d.roleTitle, d.departmentId, d.department, d.hourlyRate, d.currency, d.phone, d.status, d.emailConfirmed, d.lastLoginAt, d.createdAt,
            (SELECT COUNT(*) FROM project_developers pd WHERE pd.developerId = d.id) as assignedProjectsCount,
            (SELECT COALESCE(SUM(totalMinutes), 0) FROM developer_time_logs tl WHERE tl.developerId = d.id) as totalMinutesLogged,
            (SELECT COUNT(*) FROM developer_time_logs tl WHERE tl.developerId = d.id AND tl.clockOut IS NULL) as isCurrentlyClockedIn
        FROM developers d 
        $whereSql
        ORDER BY d.createdAt DESC
    ");
    $stmt->execute($params);
    $developers = $stmt->fetchAll();

    // Attach assigned projects to each developer
    foreach ($developers as &$d) {
        $projStmt = $pdo->prepare("
            SELECT p.id, p.name, p.status, pd.roleInProject 
            FROM projects p 
            JOIN project_developers pd ON p.id = pd.projectId 
            WHERE pd.developerId = ?
        ");
        $projStmt->execute([$d['id']]);
        $d['projects'] = $projStmt->fetchAll();
        $d['totalHoursLogged'] = round($d['totalMinutesLogged'] / 60, 1);
        $d['isCurrentlyClockedIn'] = (bool)$d['isCurrentlyClockedIn'];
        if (empty($d['department'])) {
            $d['department'] = 'Engineering & Technology';
        }
    }

    sendJson(['success' => true, 'developers' => $developers]);
}

// -----------------------------------------------------------------------------
// POST /api/developers: Create a new developer/staff profile and assign projects
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $input = getJsonInput();
    $name = trim($input['name'] ?? '');
    $email = strtolower(trim($input['email'] ?? ''));
    $roleTitle = trim($input['roleTitle'] ?? 'Team Member');
    $departmentId = !empty($input['departmentId']) ? (int)$input['departmentId'] : null;
    $department = trim($input['department'] ?? '');

    // If departmentId is provided and department is empty, resolve name from departments table
    if ($departmentId && empty($department)) {
        $dStmt = $pdo->prepare("SELECT name FROM departments WHERE id = ? LIMIT 1");
        $dStmt->execute([$departmentId]);
        $department = $dStmt->fetchColumn() ?: 'General';
    } elseif (empty($department)) {
        $department = 'Engineering & Technology';
    }

    $hourlyRate = (float)($input['hourlyRate'] ?? 0.00);
    $currency = trim($input['currency'] ?? 'USD');
    $phone = trim($input['phone'] ?? '');
    $assignedProjectIds = is_array($input['assignedProjectIds'] ?? null) ? $input['assignedProjectIds'] : [];
    $sendEmail = isset($input['sendEmail']) ? (bool)$input['sendEmail'] : true;

    // Use admin provided password or auto-generate secure password
    $plainPassword = trim($input['password'] ?? '');
    if (!$plainPassword) {
        $plainPassword = 'Dev-' . substr(bin2hex(random_bytes(4)), 0, 6) . '@AMG';
    }

    if (!$name || !$email) {
        sendJson(['success' => false, 'error' => 'Staff full name and email are required'], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJson(['success' => false, 'error' => 'Please provide a valid email address'], 400);
    }

    // Check if email already exists
    $checkStmt = $pdo->prepare("SELECT id FROM developers WHERE email = ?");
    $checkStmt->execute([$email]);
    if ($checkStmt->fetch()) {
        sendJson(['success' => false, 'error' => "A staff member with email '$email' already exists"], 409);
    }

    $passwordHash = password_hash($plainPassword, PASSWORD_BCRYPT);
    $confirmationToken = bin2hex(random_bytes(32));

    $insStmt = $pdo->prepare("
        INSERT INTO developers (name, email, passwordHash, roleTitle, departmentId, department, hourlyRate, currency, phone, status, emailConfirmed, confirmationToken, createdAt, updatedAt)
        VALUES (:name, :email, :pass, :role, :deptId, :dept, :rate, :curr, :phone, 'active', 0, :token, NOW(3), NOW(3))
    ");
    $insStmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':pass' => $passwordHash,
        ':role' => $roleTitle,
        ':deptId' => $departmentId,
        ':dept' => $department,
        ':rate' => $hourlyRate,
        ':curr' => $currency,
        ':phone' => $phone,
        ':token' => $confirmationToken
    ]);

    $newDevId = (int)$pdo->lastInsertId();

    // Assign to selected projects
    $assignedProjectNames = [];
    if (!empty($assignedProjectIds)) {
        $assignStmt = $pdo->prepare("INSERT IGNORE INTO project_developers (projectId, developerId, roleInProject, assignedAt) VALUES (?, ?, ?, NOW(3))");
        foreach ($assignedProjectIds as $pId) {
            $pId = (int)$pId;
            if ($pId > 0) {
                $assignStmt->execute([$pId, $newDevId, $roleTitle]);
            }
        }

        // Fetch project names for email
        $inClause = implode(',', array_map('intval', $assignedProjectIds));
        if ($inClause) {
            $names = $pdo->query("SELECT name FROM projects WHERE id IN ($inClause)")->fetchAll(PDO::FETCH_COLUMN);
            $assignedProjectNames = $names ?: [];
        }
    }

    // Send Welcome Email if requested
    $mailStatus = false;
    $mailTransport = null;
    if ($sendEmail) {
        $mailResult = sendDeveloperWelcomeEmail(
            $email,
            $name,
            $plainPassword,
            $roleTitle . ($department ? " ($department)" : ""),
            $assignedProjectNames
        );
        $mailStatus = $mailResult['success'];
        $mailTransport = $mailResult['transport'] ?? null;
    }

    sendJson([
        'success' => true,
        'message' => 'Staff profile created successfully',
        'developer' => [
            'id' => $newDevId,
            'name' => $name,
            'email' => $email,
            'roleTitle' => $roleTitle,
            'departmentId' => $departmentId,
            'department' => $department,
            'hourlyRate' => $hourlyRate,
            'currency' => $currency,
            'phone' => $phone,
            'status' => 'active',
            'assignedProjects' => $assignedProjectNames
        ],
        'credentials' => [
            'name' => $name,
            'email' => $email,
            'password' => $plainPassword,
            'portalUrl' => ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'azariahmg.com') . '/#dev-portal'
        ],
        'emailDispatched' => $mailStatus,
        'emailTransport' => $mailTransport
    ], 201);
}

// -------------------------------------------------------------
// PUT /api/developers: Update developer profile or reset password
// -------------------------------------------------------------
if ($method === 'PUT') {
    $input = getJsonInput();
    $id = (int)($input['id'] ?? 0);
    if (!$id) {
        sendJson(['success' => false, 'error' => 'Staff ID is required'], 400);
    }

    $name = trim($input['name'] ?? '');
    $roleTitle = trim($input['roleTitle'] ?? '');
    $departmentId = array_key_exists('departmentId', $input) ? (!empty($input['departmentId']) ? (int)$input['departmentId'] : null) : null;
    $department = isset($input['department']) ? trim($input['department']) : null;

    if ($departmentId && empty($department)) {
        $dStmt = $pdo->prepare("SELECT name FROM departments WHERE id = ? LIMIT 1");
        $dStmt->execute([$departmentId]);
        $department = $dStmt->fetchColumn() ?: null;
    }

    $hourlyRate = isset($input['hourlyRate']) ? (float)$input['hourlyRate'] : null;
    $currency = trim($input['currency'] ?? 'USD');
    $phone = trim($input['phone'] ?? '');
    $status = trim($input['status'] ?? 'active');
    $assignedProjectIds = is_array($input['assignedProjectIds'] ?? null) ? $input['assignedProjectIds'] : null;
    $newPassword = trim($input['password'] ?? '');

    $updFields = ['updatedAt = NOW(3)'];
    $params = [':id' => $id];

    if ($name) { $updFields[] = 'name = :name'; $params[':name'] = $name; }
    if ($roleTitle) { $updFields[] = 'roleTitle = :role'; $params[':role'] = $roleTitle; }
    if (array_key_exists('departmentId', $input)) { $updFields[] = 'departmentId = :deptId'; $params[':deptId'] = $departmentId; }
    if ($department !== null) { $updFields[] = 'department = :dept'; $params[':dept'] = $department; }
    if ($hourlyRate !== null) { $updFields[] = 'hourlyRate = :rate'; $params[':rate'] = $hourlyRate; }
    if ($currency) { $updFields[] = 'currency = :curr'; $params[':curr'] = $currency; }
    if ($phone !== null) { $updFields[] = 'phone = :phone'; $params[':phone'] = $phone; }
    if (in_array($status, ['active', 'inactive', 'pending'])) { $updFields[] = 'status = :status'; $params[':status'] = $status; }
    if ($newPassword) {
        $updFields[] = 'passwordHash = :pass';
        $params[':pass'] = password_hash($newPassword, PASSWORD_BCRYPT);
    }

    $sql = "UPDATE developers SET " . implode(', ', $updFields) . " WHERE id = :id";
    $pdo->prepare($sql)->execute($params);

    // Update project assignments if provided
    if ($assignedProjectIds !== null) {
        $pdo->prepare("DELETE FROM project_developers WHERE developerId = ?")->execute([$id]);
        $ins = $pdo->prepare("INSERT INTO project_developers (projectId, developerId, roleInProject, assignedAt) VALUES (?, ?, ?, NOW(3))");
        foreach ($assignedProjectIds as $pId) {
            $pId = (int)$pId;
            if ($pId > 0) {
                $ins->execute([$pId, $id, $roleTitle ?: 'Developer']);
            }
        }
    }

    sendJson(['success' => true, 'message' => 'Developer profile updated successfully']);
}

// -------------------------------------------------------------
// DELETE /api/developers: Delete developer
// -------------------------------------------------------------
if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        $input = getJsonInput();
        $id = (int)($input['id'] ?? 0);
    }

    if (!$id) {
        sendJson(['success' => false, 'error' => 'Developer ID required'], 400);
    }

    $pdo->prepare("DELETE FROM developers WHERE id = ?")->execute([$id]);
    sendJson(['success' => true, 'message' => 'Developer deleted successfully']);
}

sendJson(['success' => false, 'error' => 'Unsupported method'], 405);
