<?php
/**
 * Tasks & Developer Assignment API
 * Azariah Management Group Backend
 */
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/developer_mailer.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Determine action from URI if not in query
if (!$action) {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (str_ends_with($uri, 'tasks/my-tasks') || str_ends_with($uri, 'my-tasks')) $action = 'my-tasks';
    elseif (str_ends_with($uri, 'tasks/stats') || str_ends_with($uri, 'stats')) $action = 'stats';
    elseif (str_ends_with($uri, 'tasks/resend-email') || str_ends_with($uri, 'resend-email')) $action = 'resend-email';
    elseif (str_ends_with($uri, 'tasks/update-status') || str_ends_with($uri, 'update-status')) $action = 'update-status';
}

$pdo = getDbConnection();
ensureDevModuleTables($pdo);

// -----------------------------------------------------------------------------
// 1. DEVELOPER VIEW: LIST MY ASSIGNED TASKS
// -----------------------------------------------------------------------------
if ($action === 'my-tasks' && $method === 'GET') {
    $dev = requireDeveloperUser();
    $devId = (int)$dev['id'];

    $stmt = $pdo->prepare("
        SELECT t.id, t.title, t.description, t.developerId, t.projectId, t.departmentId,
               COALESCE(t.department, d.department, 'Engineering & Technology') as department,
               t.priority, t.status, t.dueDate, t.estimatedHours, t.actualHours, t.assignedByAdminId,
               t.assignedByAdminName, t.completedAt, t.notes, t.emailNotified, t.createdAt, t.updatedAt,
               p.name as projectName, p.slug as projectSlug
        FROM developer_tasks t
        LEFT JOIN developers d ON t.developerId = d.id
        LEFT JOIN projects p ON t.projectId = p.id
        WHERE t.developerId = ?
        ORDER BY 
            CASE t.status
                WHEN 'in_progress' THEN 1
                WHEN 'pending' THEN 2
                WHEN 'in_review' THEN 3
                WHEN 'blocked' THEN 4
                WHEN 'completed' THEN 5
                ELSE 6
            END,
            CASE t.priority
                WHEN 'urgent' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                WHEN 'low' THEN 4
                ELSE 5
            END,
            t.dueDate ASC,
            t.createdAt DESC
    ");
    $stmt->execute([$devId]);
    $tasks = $stmt->fetchAll();

    sendJson(['success' => true, 'tasks' => $tasks]);
}

// -----------------------------------------------------------------------------
// 2. DEVELOPER ACTION: UPDATE TASK STATUS & LOG NOTES / HOURS
// -----------------------------------------------------------------------------
if ($action === 'update-status' && ($method === 'POST' || $method === 'PUT')) {
    $user = requireAuthUser();
    $input = getJsonInput();
    $taskId = (int)($input['id'] ?? $input['taskId'] ?? 0);
    $newStatus = trim($input['status'] ?? '');
    $notes = isset($input['notes']) ? trim($input['notes']) : null;
    $actualHours = isset($input['actualHours']) ? (float)$input['actualHours'] : null;

    if (!$taskId) {
        sendJson(['success' => false, 'error' => 'Task ID is required'], 400);
    }

    $validStatuses = ['pending', 'in_progress', 'in_review', 'completed', 'blocked'];
    if (!in_array($newStatus, $validStatuses, true)) {
        sendJson(['success' => false, 'error' => "Invalid status: $newStatus"], 400);
    }

    // If user is developer, verify ownership
    if (isset($user['role']) && $user['role'] === 'developer') {
        $devId = (int)$user['id'];
        $chk = $pdo->prepare("SELECT id, status FROM developer_tasks WHERE id = ? AND developerId = ? LIMIT 1");
        $chk->execute([$taskId, $devId]);
        if (!$chk->fetch()) {
            sendJson(['success' => false, 'error' => 'Task not found or unauthorized'], 403);
        }
    }

    $completedAtExpr = ($newStatus === 'completed') ? 'NOW()' : 'NULL';
    if ($notes !== null && $actualHours !== null) {
        $sql = "UPDATE developer_tasks SET status = ?, notes = ?, actualHours = ?, completedAt = $completedAtExpr, updatedAt = NOW(3) WHERE id = ?";
        $pdo->prepare($sql)->execute([$newStatus, $notes, $actualHours, $taskId]);
    } elseif ($notes !== null) {
        $sql = "UPDATE developer_tasks SET status = ?, notes = ?, completedAt = $completedAtExpr, updatedAt = NOW(3) WHERE id = ?";
        $pdo->prepare($sql)->execute([$newStatus, $notes, $taskId]);
    } elseif ($actualHours !== null) {
        $sql = "UPDATE developer_tasks SET status = ?, actualHours = ?, completedAt = $completedAtExpr, updatedAt = NOW(3) WHERE id = ?";
        $pdo->prepare($sql)->execute([$newStatus, $actualHours, $taskId]);
    } else {
        $sql = "UPDATE developer_tasks SET status = ?, completedAt = $completedAtExpr, updatedAt = NOW(3) WHERE id = ?";
        $pdo->prepare($sql)->execute([$newStatus, $taskId]);
    }

    // Fetch updated task
    $stmt = $pdo->prepare("
        SELECT t.*, d.name as developerName, d.email as developerEmail, p.name as projectName
        FROM developer_tasks t
        LEFT JOIN developers d ON t.developerId = d.id
        LEFT JOIN projects p ON t.projectId = p.id
        WHERE t.id = ?
        LIMIT 1
    ");
    $stmt->execute([$taskId]);
    $updated = $stmt->fetch();

    sendJson([
        'success' => true,
        'message' => "Task status updated to " . strtoupper(str_replace('_', ' ', $newStatus)),
        'task' => $updated
    ]);
}

// =============================================================================
// ADMIN OPERATIONS (Require Administrator Privileges)
// =============================================================================
$admin = requireAdminUser();
$adminId = (int)($admin['id'] ?? 0);
$adminName = $admin['name'] ?? $admin['username'] ?? 'Administrator';

// -----------------------------------------------------------------------------
// 3. GET /api/tasks/stats: TASK MANAGEMENT AGGREGATE METRICS
// -----------------------------------------------------------------------------
if ($action === 'stats' && $method === 'GET') {
    $metrics = [
        'total' => 0,
        'pending' => 0,
        'in_progress' => 0,
        'in_review' => 0,
        'completed' => 0,
        'blocked' => 0,
        'urgent' => 0,
        'totalEstimatedHours' => 0.0,
        'totalActualHours' => 0.0
    ];

    $stmt = $pdo->query("
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
            SUM(CASE WHEN status = 'in_review' THEN 1 ELSE 0 END) as in_review,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) as blocked,
            SUM(CASE WHEN priority = 'urgent' AND status != 'completed' THEN 1 ELSE 0 END) as urgent,
            COALESCE(SUM(estimatedHours), 0) as totalEstimatedHours,
            COALESCE(SUM(actualHours), 0) as totalActualHours
        FROM developer_tasks
    ");
    $row = $stmt->fetch();
    if ($row) {
        $metrics = [
            'total' => (int)$row['total'],
            'pending' => (int)$row['pending'],
            'in_progress' => (int)$row['in_progress'],
            'in_review' => (int)$row['in_review'],
            'completed' => (int)$row['completed'],
            'blocked' => (int)$row['blocked'],
            'urgent' => (int)$row['urgent'],
            'totalEstimatedHours' => (float)$row['totalEstimatedHours'],
            'totalActualHours' => (float)$row['totalActualHours']
        ];
    }

    sendJson(['success' => true, 'metrics' => $metrics]);
}

// -----------------------------------------------------------------------------
// 4. POST /api/tasks/resend-email: RESEND TASK ASSIGNMENT EMAIL
// -----------------------------------------------------------------------------
if ($action === 'resend-email' && $method === 'POST') {
    $input = getJsonInput();
    $taskId = (int)($input['taskId'] ?? $input['id'] ?? 0);

    if (!$taskId) {
        sendJson(['success' => false, 'error' => 'Task ID is required'], 400);
    }

    $stmt = $pdo->prepare("
        SELECT t.*, d.name as developerName, d.email as developerEmail, p.name as projectName
        FROM developer_tasks t
        JOIN developers d ON t.developerId = d.id
        LEFT JOIN projects p ON t.projectId = p.id
        WHERE t.id = ?
        LIMIT 1
    ");
    $stmt->execute([$taskId]);
    $task = $stmt->fetch();

    if (!$task) {
        sendJson(['success' => false, 'error' => 'Task or assigned developer not found'], 404);
    }

    $emailResult = sendDeveloperTaskEmail(
        $task['developerEmail'],
        $task['developerName'],
        $task
    );

    if ($emailResult['success'] ?? false) {
        $pdo->prepare("UPDATE developer_tasks SET emailNotified = 1, updatedAt = NOW(3) WHERE id = ?")->execute([$taskId]);
    }

    sendJson([
        'success' => true,
        'message' => "Assignment confirmation email successfully sent to {$task['developerEmail']}.",
        'emailResult' => $emailResult
    ]);
}

// -----------------------------------------------------------------------------
// 5. GET /api/tasks: LIST ALL TASKS WITH COMPREHENSIVE FILTERS
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id > 0) {
        $stmt = $pdo->prepare("
            SELECT t.*, d.name as developerName, d.email as developerEmail, d.roleTitle as developerRole,
                   p.name as projectName, p.slug as projectSlug
            FROM developer_tasks t
            LEFT JOIN developers d ON t.developerId = d.id
            LEFT JOIN projects p ON t.projectId = p.id
            WHERE t.id = ?
            LIMIT 1
        ");
        $stmt->execute([$id]);
        $task = $stmt->fetch();
        if (!$task) {
            sendJson(['success' => false, 'error' => 'Task not found'], 404);
        }
        sendJson(['success' => true, 'task' => $task]);
    }

    $devId = isset($_GET['developerId']) ? (int)$_GET['developerId'] : 0;
    $projId = isset($_GET['projectId']) ? (int)$_GET['projectId'] : 0;
    $deptId = isset($_GET['departmentId']) ? (int)$_GET['departmentId'] : 0;
    $dept = isset($_GET['department']) && $_GET['department'] !== 'all' ? trim($_GET['department']) : '';
    $status = isset($_GET['status']) && $_GET['status'] !== 'all' ? trim($_GET['status']) : '';
    $priority = isset($_GET['priority']) && $_GET['priority'] !== 'all' ? trim($_GET['priority']) : '';
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';

    $where = [];
    $params = [];

    if ($devId > 0) {
        $where[] = "t.developerId = ?";
        $params[] = $devId;
    }
    if ($projId > 0) {
        $where[] = "t.projectId = ?";
        $params[] = $projId;
    }
    if ($deptId > 0) {
        $where[] = "(t.departmentId = ? OR d.departmentId = ?)";
        $params[] = $deptId;
        $params[] = $deptId;
    } elseif ($dept !== '') {
        $where[] = "(t.department = ? OR d.department = ?)";
        $params[] = $dept;
        $params[] = $dept;
    }
    if ($status !== '') {
        $where[] = "t.status = ?";
        $params[] = $status;
    }
    if ($priority !== '') {
        $where[] = "t.priority = ?";
        $params[] = $priority;
    }
    if ($search !== '') {
        $where[] = "(t.title LIKE ? OR t.description LIKE ? OR d.name LIKE ? OR p.name LIKE ? OR t.department LIKE ? OR d.department LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    $whereSql = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "
        SELECT t.id, t.title, t.description, t.developerId, t.projectId, t.departmentId,
               COALESCE(t.department, d.department, 'Engineering & Technology') as department,
               t.priority, t.status, t.dueDate, t.estimatedHours, t.actualHours, t.assignedByAdminId,
               t.assignedByAdminName, t.completedAt, t.notes, t.emailNotified, t.createdAt, t.updatedAt,
               d.name as developerName, d.email as developerEmail, d.roleTitle as developerRole,
               p.name as projectName, p.slug as projectSlug
        FROM developer_tasks t
        LEFT JOIN developers d ON t.developerId = d.id
        LEFT JOIN projects p ON t.projectId = p.id
        $whereSql
        ORDER BY 
            CASE t.status
                WHEN 'in_progress' THEN 1
                WHEN 'pending' THEN 2
                WHEN 'in_review' THEN 3
                WHEN 'blocked' THEN 4
                WHEN 'completed' THEN 5
                ELSE 6
            END,
            CASE t.priority
                WHEN 'urgent' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                WHEN 'low' THEN 4
                ELSE 5
            END,
            t.dueDate ASC,
            t.createdAt DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $tasks = $stmt->fetchAll();

    sendJson(['success' => true, 'tasks' => $tasks]);
}

// -----------------------------------------------------------------------------
// 6. POST /api/tasks: CREATE & ASSIGN NEW TASK (WITH EMAIL CONFIRMATION)
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $input = getJsonInput();
    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $developerId = (int)($input['developerId'] ?? 0);
    $projectId = !empty($input['projectId']) ? (int)$input['projectId'] : null;
    $departmentId = !empty($input['departmentId']) ? (int)$input['departmentId'] : null;
    $department = trim($input['department'] ?? '');
    $priority = strtolower(trim($input['priority'] ?? 'medium'));
    $status = strtolower(trim($input['status'] ?? 'pending'));
    $dueDate = !empty($input['dueDate']) ? trim($input['dueDate']) : null;
    $estimatedHours = isset($input['estimatedHours']) ? (float)$input['estimatedHours'] : 0.00;
    $sendEmail = isset($input['sendEmail']) ? (bool)$input['sendEmail'] : true;

    if (empty($title)) {
        sendJson(['success' => false, 'error' => 'Task title is required'], 400);
    }
    if ($developerId <= 0) {
        sendJson(['success' => false, 'error' => 'A valid staff member must be selected'], 400);
    }

    // Validate developer/staff exists
    $devStmt = $pdo->prepare("SELECT id, name, email, roleTitle, departmentId, department FROM developers WHERE id = ? LIMIT 1");
    $devStmt->execute([$developerId]);
    $dev = $devStmt->fetch();
    if (!$dev) {
        sendJson(['success' => false, 'error' => 'Staff member not found in system'], 404);
    }

    // Default department from developer profile if not passed
    if (!$departmentId && !empty($dev['departmentId'])) {
        $departmentId = (int)$dev['departmentId'];
    }
    if (empty($department)) {
        $department = $dev['department'] ?: 'Engineering & Technology';
    }

    // Validate project if provided
    $projectName = 'General Assignment';
    if ($projectId) {
        $pStmt = $pdo->prepare("SELECT id, name FROM projects WHERE id = ? LIMIT 1");
        $pStmt->execute([$projectId]);
        $proj = $pStmt->fetch();
        if ($proj) {
            $projectName = $proj['name'];
        }
    }

    $validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!in_array($priority, $validPriorities, true)) {
        $priority = 'medium';
    }

    $validStatuses = ['pending', 'in_progress', 'in_review', 'completed', 'blocked'];
    if (!in_array($status, $validStatuses, true)) {
        $status = 'pending';
    }

    $completedAt = ($status === 'completed') ? date('Y-m-d H:i:s') : null;

    $stmt = $pdo->prepare("
        INSERT INTO developer_tasks 
            (title, description, developerId, projectId, departmentId, department, priority, status, dueDate, estimatedHours, actualHours, assignedByAdminId, assignedByAdminName, completedAt, emailNotified, createdAt, updatedAt)
        VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.00, ?, ?, ?, 0, NOW(3), NOW(3))
    ");
    $stmt->execute([
        $title,
        $description,
        $developerId,
        $projectId,
        $departmentId,
        $department,
        $priority,
        $status,
        $dueDate,
        $estimatedHours,
        $adminId,
        $adminName,
        $completedAt
    ]);

    $taskId = (int)$pdo->lastInsertId();

    $taskData = [
        'id' => $taskId,
        'title' => $title,
        'description' => $description,
        'developerId' => $developerId,
        'projectId' => $projectId,
        'projectName' => $projectName,
        'department' => $department,
        'priority' => $priority,
        'status' => $status,
        'dueDate' => $dueDate,
        'estimatedHours' => $estimatedHours,
        'assignedByAdminName' => $adminName
    ];

    // Send email confirmation to staff if enabled
    $emailSent = false;
    $emailError = null;
    if ($sendEmail && !empty($dev['email'])) {
        $mailRes = sendDeveloperTaskEmail(
            $dev['email'],
            $dev['name'],
            $taskData
        );
        if ($mailRes['success'] ?? false) {
            $emailSent = true;
            $pdo->prepare("UPDATE developer_tasks SET emailNotified = 1 WHERE id = ?")->execute([$taskId]);
        } else {
            $emailError = $mailRes['error'] ?? 'Unknown mailer error';
        }
    }

    // Fetch newly created task with relations
    $fetchStmt = $pdo->prepare("
        SELECT t.*, d.name as developerName, d.email as developerEmail, d.roleTitle as developerRole,
               COALESCE(t.department, d.department, 'Engineering & Technology') as department,
               p.name as projectName, p.slug as projectSlug
        FROM developer_tasks t
        LEFT JOIN developers d ON t.developerId = d.id
        LEFT JOIN projects p ON t.projectId = p.id
        WHERE t.id = ?
        LIMIT 1
    ");
    $fetchStmt->execute([$taskId]);
    $createdTask = $fetchStmt->fetch();

    sendJson([
        'success' => true,
        'message' => "Task '{$title}' created and assigned to {$dev['name']} ({$department})." . ($emailSent ? " Confirmation email dispatched." : ""),
        'task' => $createdTask,
        'emailSent' => $emailSent,
        'emailError' => $emailError
    ], 201);
}

// -----------------------------------------------------------------------------
// 7. PUT /api/tasks: UPDATE TASK DETAILS & STATUS (ADMIN)
// -----------------------------------------------------------------------------
if ($method === 'PUT') {
    $input = getJsonInput();
    $id = (int)($input['id'] ?? 0);

    if ($id <= 0) {
        sendJson(['success' => false, 'error' => 'Task ID is required for update'], 400);
    }

    $chk = $pdo->prepare("SELECT * FROM developer_tasks WHERE id = ? LIMIT 1");
    $chk->execute([$id]);
    $existing = $chk->fetch();
    if (!$existing) {
        sendJson(['success' => false, 'error' => 'Task not found'], 404);
    }

    $title = isset($input['title']) ? trim($input['title']) : $existing['title'];
    $description = isset($input['description']) ? trim($input['description']) : $existing['description'];
    $developerId = isset($input['developerId']) ? (int)$input['developerId'] : (int)$existing['developerId'];
    $projectId = array_key_exists('projectId', $input) ? (!empty($input['projectId']) ? (int)$input['projectId'] : null) : $existing['projectId'];
    $priority = isset($input['priority']) ? strtolower(trim($input['priority'])) : $existing['priority'];
    $status = isset($input['status']) ? strtolower(trim($input['status'])) : $existing['status'];
    $dueDate = array_key_exists('dueDate', $input) ? (!empty($input['dueDate']) ? trim($input['dueDate']) : null) : $existing['dueDate'];
    $estimatedHours = isset($input['estimatedHours']) ? (float)$input['estimatedHours'] : (float)$existing['estimatedHours'];
    $actualHours = isset($input['actualHours']) ? (float)$input['actualHours'] : (float)$existing['actualHours'];
    $notes = isset($input['notes']) ? trim($input['notes']) : $existing['notes'];

    $completedAt = $existing['completedAt'];
    if ($status === 'completed' && $existing['status'] !== 'completed') {
        $completedAt = date('Y-m-d H:i:s');
    } elseif ($status !== 'completed') {
        $completedAt = null;
    }

    $stmt = $pdo->prepare("
        UPDATE developer_tasks
        SET title = ?, description = ?, developerId = ?, projectId = ?, priority = ?,
            status = ?, dueDate = ?, estimatedHours = ?, actualHours = ?, notes = ?,
            completedAt = ?, updatedAt = NOW(3)
        WHERE id = ?
    ");
    $stmt->execute([
        $title,
        $description,
        $developerId,
        $projectId,
        $priority,
        $status,
        $dueDate,
        $estimatedHours,
        $actualHours,
        $notes,
        $completedAt,
        $id
    ]);

    // If reassigned to a new developer, optionally send notification email
    $emailSent = false;
    if (!empty($input['sendEmail']) && $developerId !== (int)$existing['developerId']) {
        $devStmt = $pdo->prepare("SELECT id, name, email FROM developers WHERE id = ? LIMIT 1");
        $devStmt->execute([$developerId]);
        $newDev = $devStmt->fetch();
        if ($newDev && !empty($newDev['email'])) {
            $pName = 'General Assignment';
            if ($projectId) {
                $pStmt = $pdo->prepare("SELECT name FROM projects WHERE id = ? LIMIT 1");
                $pStmt->execute([$projectId]);
                $pRow = $pStmt->fetch();
                if ($pRow) $pName = $pRow['name'];
            }
            $taskData = [
                'id' => $id,
                'title' => $title,
                'description' => $description,
                'developerId' => $developerId,
                'projectId' => $projectId,
                'projectName' => $pName,
                'priority' => $priority,
                'status' => $status,
                'dueDate' => $dueDate,
                'estimatedHours' => $estimatedHours,
                'assignedByAdminName' => $adminName
            ];
            $mailRes = sendDeveloperTaskEmail($newDev['email'], $newDev['name'], $taskData);
            $emailSent = ($mailRes['success'] ?? false);
            if ($emailSent) {
                $pdo->prepare("UPDATE developer_tasks SET emailNotified = 1 WHERE id = ?")->execute([$id]);
            }
        }
    }

    $fetchStmt = $pdo->prepare("
        SELECT t.*, d.name as developerName, d.email as developerEmail, d.roleTitle as developerRole,
               p.name as projectName, p.slug as projectSlug
        FROM developer_tasks t
        LEFT JOIN developers d ON t.developerId = d.id
        LEFT JOIN projects p ON t.projectId = p.id
        WHERE t.id = ?
        LIMIT 1
    ");
    $fetchStmt->execute([$id]);
    $updated = $fetchStmt->fetch();

    sendJson([
        'success' => true,
        'message' => "Task '{$title}' updated successfully.",
        'task' => $updated,
        'emailSent' => $emailSent
    ]);
}

// -----------------------------------------------------------------------------
// 8. DELETE /api/tasks: DELETE TASK (ADMIN)
// -----------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        $input = getJsonInput();
        $id = (int)($input['id'] ?? 0);
    }

    if ($id <= 0) {
        sendJson(['success' => false, 'error' => 'Task ID is required for deletion'], 400);
    }

    $chk = $pdo->prepare("SELECT title FROM developer_tasks WHERE id = ? LIMIT 1");
    $chk->execute([$id]);
    $task = $chk->fetch();

    if (!$task) {
        sendJson(['success' => false, 'error' => 'Task not found'], 404);
    }

    $stmt = $pdo->prepare("DELETE FROM developer_tasks WHERE id = ?");
    $stmt->execute([$id]);

    sendJson([
        'success' => true,
        'message' => "Task '{$task['title']}' permanently deleted."
    ]);
}

sendJson(['success' => false, 'error' => 'Unsupported method or endpoint'], 405);
