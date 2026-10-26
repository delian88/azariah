<?php
/**
 * Projects & Milestones Management API
 * Azariah Management Group Backend
 */
require_once __DIR__ . '/db.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$pdo = getDbConnection();
ensureDevModuleTables($pdo);

// -----------------------------------------------------------------------------
// 1. DEVELOPER VIEW: GET ASSIGNED PROJECTS & MILESTONES
// -----------------------------------------------------------------------------
if ($action === 'assigned' || str_contains($_SERVER['REQUEST_URI'] ?? '', 'projects/assigned')) {
    $dev = requireDeveloperUser();
    $devId = (int)$dev['id'];

    $stmt = $pdo->prepare("
        SELECT p.id, p.name, p.slug, p.description, p.budget, p.currency, p.status, p.launchDate, p.repoUrl, p.createdAt, pd.roleInProject,
            (SELECT COUNT(*) FROM project_milestones pm WHERE pm.projectId = p.id) as totalMilestones,
            (SELECT COUNT(*) FROM project_milestones pm WHERE pm.projectId = p.id AND pm.status = 'completed') as completedMilestones
        FROM projects p
        JOIN project_developers pd ON p.id = pd.projectId
        WHERE pd.developerId = ?
        ORDER BY p.createdAt DESC
    ");
    $stmt->execute([$devId]);
    $projects = $stmt->fetchAll();

    foreach ($projects as &$proj) {
        $mStmt = $pdo->prepare("SELECT id, title, description, dueDate, status, orderIndex FROM project_milestones WHERE projectId = ? ORDER BY orderIndex ASC, dueDate ASC");
        $mStmt->execute([$proj['id']]);
        $proj['milestones'] = $mStmt->fetchAll();

        // Other developers on this project
        $tStmt = $pdo->prepare("SELECT d.id, d.name, d.roleTitle, pd.roleInProject FROM developers d JOIN project_developers pd ON d.id = pd.developerId WHERE pd.projectId = ?");
        $tStmt->execute([$proj['id']]);
        $proj['team'] = $tStmt->fetchAll();
    }

    sendJson(['success' => true, 'projects' => $projects]);
}

// =============================================================================
// ADMIN OPERATIONS (Require Admin)
// =============================================================================
requireAdminUser();

// -----------------------------------------------------------------------------
// GET /api/projects: List all projects with milestones & assigned developers
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $project = $stmt->fetch();
        if (!$project) {
            sendJson(['success' => false, 'error' => 'Project not found'], 404);
        }

        $mStmt = $pdo->prepare("SELECT * FROM project_milestones WHERE projectId = ? ORDER BY orderIndex ASC, dueDate ASC");
        $mStmt->execute([$id]);
        $project['milestones'] = $mStmt->fetchAll();

        $dStmt = $pdo->prepare("SELECT d.id, d.name, d.email, d.roleTitle, pd.roleInProject, pd.assignedAt FROM developers d JOIN project_developers pd ON d.id = pd.developerId WHERE pd.projectId = ?");
        $dStmt->execute([$id]);
        $project['developers'] = $dStmt->fetchAll();

        sendJson(['success' => true, 'project' => $project]);
    }

    $stmt = $pdo->query("
        SELECT p.id, p.name, p.slug, p.description, p.budget, p.currency, p.status, p.launchDate, p.repoUrl, p.createdAt, p.updatedAt,
            (SELECT COUNT(*) FROM project_milestones pm WHERE pm.projectId = p.id) as milestonesCount,
            (SELECT COUNT(*) FROM project_milestones pm WHERE pm.projectId = p.id AND pm.status = 'completed') as completedMilestonesCount,
            (SELECT COUNT(*) FROM project_developers pd WHERE pd.projectId = p.id) as developersCount,
            (SELECT COALESCE(SUM(totalMinutes), 0) FROM developer_time_logs tl WHERE tl.projectId = p.id) as totalMinutesLogged
        FROM projects p
        ORDER BY p.createdAt DESC
    ");
    $projects = $stmt->fetchAll();

    foreach ($projects as &$proj) {
        $mStmt = $pdo->prepare("SELECT id, title, description, dueDate, status, orderIndex FROM project_milestones WHERE projectId = ? ORDER BY orderIndex ASC, dueDate ASC");
        $mStmt->execute([$proj['id']]);
        $proj['milestones'] = $mStmt->fetchAll();

        $dStmt = $pdo->prepare("SELECT d.id, d.name, d.email, d.roleTitle, pd.roleInProject FROM developers d JOIN project_developers pd ON d.id = pd.developerId WHERE pd.projectId = ?");
        $dStmt->execute([$proj['id']]);
        $proj['developers'] = $dStmt->fetchAll();

        $proj['totalHoursLogged'] = round($proj['totalMinutesLogged'] / 60, 1);
        $totalM = (int)$proj['milestonesCount'];
        $compM = (int)$proj['completedMilestonesCount'];
        $proj['progressPercent'] = $totalM > 0 ? round(($compM / $totalM) * 100) : 0;
    }

    sendJson(['success' => true, 'projects' => $projects]);
}

// -----------------------------------------------------------------------------
// POST /api/projects: Create new project with milestones and developer assignments
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $input = getJsonInput();
    $name = trim($input['name'] ?? '');
    $description = trim($input['description'] ?? '');
    $budget = (float)($input['budget'] ?? 0.00);
    $currency = trim($input['currency'] ?? 'USD');
    $status = trim($input['status'] ?? 'planning');
    $launchDate = !empty($input['launchDate']) ? $input['launchDate'] : null;
    $repoUrl = trim($input['repoUrl'] ?? '');
    $milestones = is_array($input['milestones'] ?? null) ? $input['milestones'] : [];
    $developerIds = is_array($input['developerIds'] ?? null) ? $input['developerIds'] : [];

    if (!$name) {
        sendJson(['success' => false, 'error' => 'Project name is required'], 400);
    }

    // Generate unique slug
    $baseSlug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
    $baseSlug = trim($baseSlug, '-');
    $slug = $baseSlug ?: 'project-' . time();
    $slugCheck = $pdo->prepare("SELECT id FROM projects WHERE slug = ?");
    $slugCheck->execute([$slug]);
    if ($slugCheck->fetch()) {
        $slug .= '-' . substr(bin2hex(random_bytes(2)), 0, 4);
    }

    $insStmt = $pdo->prepare("
        INSERT INTO projects (name, slug, description, budget, currency, status, launchDate, repoUrl, createdAt, updatedAt)
        VALUES (:name, :slug, :desc, :budget, :curr, :status, :launch, :repo, NOW(3), NOW(3))
    ");
    $insStmt->execute([
        ':name' => $name,
        ':slug' => $slug,
        ':desc' => $description,
        ':budget' => $budget,
        ':curr' => $currency,
        ':status' => in_array($status, ['planning', 'in_progress', 'in_review', 'launched', 'on_hold']) ? $status : 'planning',
        ':launch' => $launchDate,
        ':repo' => $repoUrl
    ]);

    $projectId = (int)$pdo->lastInsertId();

    // Insert Milestones
    if (!empty($milestones)) {
        $mIns = $pdo->prepare("
            INSERT INTO project_milestones (projectId, title, description, dueDate, status, orderIndex, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, NOW(3), NOW(3))
        ");
        foreach ($milestones as $idx => $m) {
            $mTitle = trim($m['title'] ?? '');
            if ($mTitle) {
                $mIns->execute([
                    $projectId,
                    $mTitle,
                    trim($m['description'] ?? ''),
                    !empty($m['dueDate']) ? $m['dueDate'] : null,
                    in_array($m['status'] ?? '', ['pending', 'in_progress', 'completed']) ? $m['status'] : 'pending',
                    (int)($m['orderIndex'] ?? $idx)
                ]);
            }
        }
    }

    // Assign Developers
    if (!empty($developerIds)) {
        $dIns = $pdo->prepare("INSERT IGNORE INTO project_developers (projectId, developerId, roleInProject, assignedAt) VALUES (?, ?, ?, NOW(3))");
        foreach ($developerIds as $devId) {
            $devId = (int)$devId;
            if ($devId > 0) {
                $dIns->execute([$projectId, $devId, 'Team Engineer']);
            }
        }
    }

    sendJson([
        'success' => true,
        'message' => 'Project created successfully',
        'project' => [
            'id' => $projectId,
            'name' => $name,
            'slug' => $slug,
            'status' => $status,
            'budget' => $budget,
            'currency' => $currency,
            'launchDate' => $launchDate
        ]
    ], 201);
}

// -----------------------------------------------------------------------------
// PUT /api/projects: Update project, milestones, and developer assignments
// -----------------------------------------------------------------------------
if ($method === 'PUT') {
    $input = getJsonInput();
    $id = (int)($input['id'] ?? 0);
    if (!$id) {
        sendJson(['success' => false, 'error' => 'Project ID is required'], 400);
    }

    $name = trim($input['name'] ?? '');
    $description = isset($input['description']) ? trim($input['description']) : null;
    $budget = isset($input['budget']) ? (float)$input['budget'] : null;
    $currency = trim($input['currency'] ?? '');
    $status = trim($input['status'] ?? '');
    $launchDate = isset($input['launchDate']) ? $input['launchDate'] : null;
    $repoUrl = isset($input['repoUrl']) ? trim($input['repoUrl']) : null;
    $milestones = is_array($input['milestones'] ?? null) ? $input['milestones'] : null;
    $developerIds = is_array($input['developerIds'] ?? null) ? $input['developerIds'] : null;

    $updFields = ['updatedAt = NOW(3)'];
    $params = [':id' => $id];

    if ($name) { $updFields[] = 'name = :name'; $params[':name'] = $name; }
    if ($description !== null) { $updFields[] = 'description = :desc'; $params[':desc'] = $description; }
    if ($budget !== null) { $updFields[] = 'budget = :budget'; $params[':budget'] = $budget; }
    if ($currency) { $updFields[] = 'currency = :curr'; $params[':curr'] = $currency; }
    if ($status && in_array($status, ['planning', 'in_progress', 'in_review', 'launched', 'on_hold'])) {
        $updFields[] = 'status = :status'; $params[':status'] = $status;
    }
    if ($launchDate !== null) {
        $updFields[] = 'launchDate = :launch';
        $params[':launch'] = !empty($launchDate) ? $launchDate : null;
    }
    if ($repoUrl !== null) { $updFields[] = 'repoUrl = :repo'; $params[':repo'] = $repoUrl; }

    $sql = "UPDATE projects SET " . implode(', ', $updFields) . " WHERE id = :id";
    $pdo->prepare($sql)->execute($params);

    // Sync Milestones if explicitly sent
    if ($milestones !== null) {
        $pdo->prepare("DELETE FROM project_milestones WHERE projectId = ?")->execute([$id]);
        $mIns = $pdo->prepare("
            INSERT INTO project_milestones (projectId, title, description, dueDate, status, orderIndex, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, NOW(3), NOW(3))
        ");
        foreach ($milestones as $idx => $m) {
            $mTitle = trim($m['title'] ?? '');
            if ($mTitle) {
                $mIns->execute([
                    $id,
                    $mTitle,
                    trim($m['description'] ?? ''),
                    !empty($m['dueDate']) ? $m['dueDate'] : null,
                    in_array($m['status'] ?? '', ['pending', 'in_progress', 'completed']) ? $m['status'] : 'pending',
                    (int)($m['orderIndex'] ?? $idx)
                ]);
            }
        }
    }

    // Sync Developer assignments if explicitly sent
    if ($developerIds !== null) {
        $pdo->prepare("DELETE FROM project_developers WHERE projectId = ?")->execute([$id]);
        $dIns = $pdo->prepare("INSERT INTO project_developers (projectId, developerId, roleInProject, assignedAt) VALUES (?, ?, 'Team Engineer', NOW(3))");
        foreach ($developerIds as $devId) {
            $devId = (int)$devId;
            if ($devId > 0) {
                $dIns->execute([$id, $devId]);
            }
        }
    }

    sendJson(['success' => true, 'message' => 'Project updated successfully']);
}

// -----------------------------------------------------------------------------
// DELETE /api/projects: Delete project
// -----------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        $input = getJsonInput();
        $id = (int)($input['id'] ?? 0);
    }

    if (!$id) {
        sendJson(['success' => false, 'error' => 'Project ID required'], 400);
    }

    $pdo->prepare("DELETE FROM projects WHERE id = ?")->execute([$id]);
    sendJson(['success' => true, 'message' => 'Project deleted successfully']);
}

sendJson(['success' => false, 'error' => 'Unsupported method'], 405);
