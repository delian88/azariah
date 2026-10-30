<?php
/**
 * Departments Management API
 * Azariah Management Group Backend
 */
require_once __DIR__ . '/db.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$pdo = getDbConnection();
ensureDevModuleTables($pdo);

// -----------------------------------------------------------------------------
// 1. GET /api/departments: List all departments with staff & task counts
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $stmt = $pdo->query("
        SELECT dept.id, dept.name, dept.slug, dept.description, dept.color, dept.leadStaffId, dept.createdAt, dept.updatedAt,
               (SELECT COUNT(*) FROM developers d WHERE d.departmentId = dept.id OR d.department = dept.name) as staffCount,
               (SELECT COUNT(*) FROM developer_tasks t WHERE t.departmentId = dept.id OR t.department = dept.name) as tasksCount
        FROM departments dept
        ORDER BY dept.name ASC
    ");
    $departments = $stmt->fetchAll();

    sendJson(['success' => true, 'departments' => $departments]);
}

// =============================================================================
// ADMIN CRUD OPERATIONS (Require Administrator Privileges)
// =============================================================================
requireAdminUser();

// -----------------------------------------------------------------------------
// 2. POST /api/departments: Create a new department
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $input = getJsonInput();
    $name = trim($input['name'] ?? '');
    $description = trim($input['description'] ?? '');
    $color = trim($input['color'] ?? '#38bdf8');
    $leadStaffId = !empty($input['leadStaffId']) ? (int)$input['leadStaffId'] : null;

    if (empty($name)) {
        sendJson(['success' => false, 'error' => 'Department name is required'], 400);
    }

    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name), '-'));

    // Check duplicate
    $chk = $pdo->prepare("SELECT id FROM departments WHERE name = ? OR slug = ? LIMIT 1");
    $chk->execute([$name, $slug]);
    if ($chk->fetch()) {
        sendJson(['success' => false, 'error' => "A department named '{$name}' already exists"], 409);
    }

    $stmt = $pdo->prepare("
        INSERT INTO departments (name, slug, description, color, leadStaffId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, NOW(3), NOW(3))
    ");
    $stmt->execute([$name, $slug, $description, $color, $leadStaffId]);
    $deptId = (int)$pdo->lastInsertId();

    $stmt = $pdo->prepare("SELECT * FROM departments WHERE id = ?");
    $stmt->execute([$deptId]);
    $created = $stmt->fetch();
    $created['staffCount'] = 0;
    $created['tasksCount'] = 0;

    sendJson([
        'success' => true,
        'message' => "Department '{$name}' created successfully",
        'department' => $created
    ], 201);
}

// -----------------------------------------------------------------------------
// 3. PUT /api/departments: Update an existing department
// -----------------------------------------------------------------------------
if ($method === 'PUT') {
    $input = getJsonInput();
    $id = (int)($input['id'] ?? 0);

    if ($id <= 0) {
        sendJson(['success' => false, 'error' => 'Department ID is required'], 400);
    }

    $chk = $pdo->prepare("SELECT * FROM departments WHERE id = ? LIMIT 1");
    $chk->execute([$id]);
    $existing = $chk->fetch();
    if (!$existing) {
        sendJson(['success' => false, 'error' => 'Department not found'], 404);
    }

    $name = isset($input['name']) ? trim($input['name']) : $existing['name'];
    $description = isset($input['description']) ? trim($input['description']) : $existing['description'];
    $color = isset($input['color']) ? trim($input['color']) : $existing['color'];
    $leadStaffId = array_key_exists('leadStaffId', $input) ? (!empty($input['leadStaffId']) ? (int)$input['leadStaffId'] : null) : $existing['leadStaffId'];

    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name), '-'));

    $stmt = $pdo->prepare("
        UPDATE departments 
        SET name = ?, slug = ?, description = ?, color = ?, leadStaffId = ?, updatedAt = NOW(3)
        WHERE id = ?
    ");
    $stmt->execute([$name, $slug, $description, $color, $leadStaffId, $id]);

    // If name changed, update existing staff / task text references
    if ($name !== $existing['name']) {
        $pdo->prepare("UPDATE developers SET department = ? WHERE departmentId = ? OR department = ?")->execute([$name, $id, $existing['name']]);
        $pdo->prepare("UPDATE developer_tasks SET department = ? WHERE departmentId = ? OR department = ?")->execute([$name, $id, $existing['name']]);
    }

    $stmt = $pdo->prepare("
        SELECT dept.*,
               (SELECT COUNT(*) FROM developers d WHERE d.departmentId = dept.id OR d.department = dept.name) as staffCount,
               (SELECT COUNT(*) FROM developer_tasks t WHERE t.departmentId = dept.id OR t.department = dept.name) as tasksCount
        FROM departments dept
        WHERE dept.id = ?
    ");
    $stmt->execute([$id]);
    $updated = $stmt->fetch();

    sendJson([
        'success' => true,
        'message' => "Department '{$name}' updated successfully",
        'department' => $updated
    ]);
}

// -----------------------------------------------------------------------------
// 4. DELETE /api/departments: Delete a department
// -----------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        $input = getJsonInput();
        $id = (int)($input['id'] ?? 0);
    }

    if ($id <= 0) {
        sendJson(['success' => false, 'error' => 'Department ID is required'], 400);
    }

    $chk = $pdo->prepare("SELECT name FROM departments WHERE id = ? LIMIT 1");
    $chk->execute([$id]);
    $existing = $chk->fetch();
    if (!$existing) {
        sendJson(['success' => false, 'error' => 'Department not found'], 404);
    }

    // Set staff and tasks in this department to null/General
    $pdo->prepare("UPDATE developers SET departmentId = NULL, department = 'General' WHERE departmentId = ?")->execute([$id]);
    $pdo->prepare("UPDATE developer_tasks SET departmentId = NULL, department = 'General' WHERE departmentId = ?")->execute([$id]);

    $pdo->prepare("DELETE FROM departments WHERE id = ?")->execute([$id]);

    sendJson([
        'success' => true,
        'message' => "Department '{$existing['name']}' deleted successfully"
    ]);
}

sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
