<?php
/**
 * Developer Time Tracking & Attendance API
 * Azariah Management Group Backend
 */
require_once __DIR__ . '/db.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Determine action from URI
if (!$action) {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (str_ends_with($uri, 'timetracker/clock-in') || str_ends_with($uri, 'clock-in')) $action = 'clock-in';
    elseif (str_ends_with($uri, 'timetracker/clock-out') || str_ends_with($uri, 'clock-out')) $action = 'clock-out';
    elseif (str_ends_with($uri, 'timetracker/status') || str_ends_with($uri, 'status')) $action = 'status';
    elseif (str_ends_with($uri, 'timetracker/my-history') || str_ends_with($uri, 'my-history')) $action = 'my-history';
    elseif (str_ends_with($uri, 'timetracker/admin-logs') || str_ends_with($uri, 'admin-logs')) $action = 'admin-logs';
}

$pdo = getDbConnection();
ensureDevModuleTables($pdo);

/**
 * Normalizes a datetime string to standard ISO 8601 UTC with 'Z' suffix
 */
function toUtcIso($dateStr) {
    if (!$dateStr) return null;
    $trimmed = trim($dateStr);
    if (str_ends_with($trimmed, 'Z') || preg_match('/[+-]\d{2}:\d{2}$/', $trimmed)) {
        return $trimmed;
    }
    return str_replace(' ', 'T', $trimmed) . 'Z';
}

// -----------------------------------------------------------------------------
// 1. DEVELOPER CLOCK IN
// -----------------------------------------------------------------------------
if ($action === 'clock-in' && $method === 'POST') {
    $dev = requireDeveloperUser();
    $devId = (int)$dev['id'];
    $input = getJsonInput();
    $projectId = !empty($input['projectId']) ? (int)$input['projectId'] : null;
    $notes = trim($input['notes'] ?? '');
    $clientTimezone = trim($input['clientTimezone'] ?? 'UTC');
    $clientTimestampStr = !empty($input['clientTimestamp']) ? trim($input['clientTimestamp']) : null;

    // Check if developer already has an active clock-in session
    $activeStmt = $pdo->prepare("SELECT id, clockIn, projectId FROM developer_time_logs WHERE developerId = ? AND clockOut IS NULL LIMIT 1");
    $activeStmt->execute([$devId]);
    $active = $activeStmt->fetch();

    if ($active) {
        $active['clockIn'] = toUtcIso($active['clockIn']);
        sendJson([
            'success' => false,
            'error' => 'You are already clocked in',
            'activeSession' => $active
        ], 400);
    }

    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

    // Exact UTC timestamp. Use client UTC timestamp if valid and within 10 minutes of server
    $clientTs = $clientTimestampStr ? strtotime($clientTimestampStr) : false;
    $serverNow = time();
    if ($clientTs !== false && abs($serverNow - $clientTs) < 600) {
        $clockInUtc = gmdate('Y-m-d H:i:s', $clientTs);
        $clockInIso = gmdate('Y-m-d\TH:i:s\Z', $clientTs);
    } else {
        $clockInUtc = gmdate('Y-m-d H:i:s', $serverNow);
        $clockInIso = gmdate('Y-m-d\TH:i:s\Z', $serverNow);
    }

    $stmt = $pdo->prepare("
        INSERT INTO developer_time_logs (developerId, projectId, clockIn, clockOut, totalMinutes, taskSummary, ipAddress, clientTimezone, createdAt, updatedAt)
        VALUES (:did, :pid, :clockIn, NULL, 0, :notes, :ip, :tz, :createdAt, :updatedAt)
    ");
    $stmt->execute([
        ':did' => $devId,
        ':pid' => $projectId,
        ':clockIn' => $clockInUtc,
        ':notes' => $notes,
        ':ip' => $ip,
        ':tz' => $clientTimezone,
        ':createdAt' => $clockInUtc,
        ':updatedAt' => $clockInUtc
    ]);

    $logId = (int)$pdo->lastInsertId();

    sendJson([
        'success' => true,
        'message' => 'Clock-in successful. Happy coding!',
        'session' => [
            'id' => $logId,
            'developerId' => $devId,
            'projectId' => $projectId,
            'clockIn' => $clockInIso,
            'clockOut' => null
        ]
    ]);
}

// -----------------------------------------------------------------------------
// 2. DEVELOPER CLOCK OUT
// -----------------------------------------------------------------------------
if ($action === 'clock-out' && $method === 'POST') {
    $dev = requireDeveloperUser();
    $devId = (int)$dev['id'];
    $input = getJsonInput();
    $taskSummary = trim($input['taskSummary'] ?? '');
    $clientTimestampStr = !empty($input['clientTimestamp']) ? trim($input['clientTimestamp']) : null;
    $discard = !empty($input['discard']); // Support discarding a session started by mistake

    $stmt = $pdo->prepare("SELECT id, clockIn, taskSummary FROM developer_time_logs WHERE developerId = ? AND clockOut IS NULL ORDER BY id DESC LIMIT 1");
    $stmt->execute([$devId]);
    $session = $stmt->fetch();

    if (!$session) {
        sendJson(['success' => false, 'error' => 'No active clock-in session found to clock out from'], 400);
    }

    if ($discard) {
        $del = $pdo->prepare("DELETE FROM developer_time_logs WHERE id = ?");
        $del->execute([$session['id']]);
        sendJson([
            'success' => true,
            'message' => 'Session discarded successfully.'
        ]);
    }

    $clientTs = $clientTimestampStr ? strtotime($clientTimestampStr) : false;
    $serverNow = time();
    if ($clientTs !== false && abs($serverNow - $clientTs) < 600) {
        $clockOutTs = $clientTs;
    } else {
        $clockOutTs = $serverNow;
    }

    $clockInTime = strtotime($session['clockIn'] . ' UTC');
    $minutes = max(1, round(($clockOutTs - $clockInTime) / 60));
    $clockOutUtc = gmdate('Y-m-d H:i:s', $clockOutTs);
    $clockOutIso = gmdate('Y-m-d\TH:i:s\Z', $clockOutTs);

    $finalSummary = $taskSummary ?: ($session['taskSummary'] ?: 'Engineering session complete.');

    $upd = $pdo->prepare("
        UPDATE developer_time_logs 
        SET clockOut = :clockOut, totalMinutes = :min, taskSummary = :summary, updatedAt = :updatedAt
        WHERE id = :id
    ");
    $upd->execute([
        ':clockOut' => $clockOutUtc,
        ':min' => $minutes,
        ':summary' => $finalSummary,
        ':updatedAt' => $clockOutUtc,
        ':id' => $session['id']
    ]);

    $hours = round($minutes / 60, 2);

    sendJson([
        'success' => true,
        'message' => "Clocked out successfully. You worked $hours hours ($minutes minutes).",
        'summary' => [
            'id' => (int)$session['id'],
            'clockIn' => toUtcIso($session['clockIn']),
            'clockOut' => $clockOutIso,
            'totalMinutes' => (int)$minutes,
            'totalHours' => $hours,
            'taskSummary' => $finalSummary
        ]
    ]);
}

// -----------------------------------------------------------------------------
// 3. DEVELOPER TIME STATS & CURRENT STATUS
// -----------------------------------------------------------------------------
if ($action === 'status' && $method === 'GET') {
    $dev = requireDeveloperUser();
    $devId = (int)$dev['id'];

    // Active session check
    $activeStmt = $pdo->prepare("
        SELECT tl.id, tl.clockIn, tl.projectId, tl.taskSummary, tl.clientTimezone, p.name as projectName 
        FROM developer_time_logs tl 
        LEFT JOIN projects p ON tl.projectId = p.id 
        WHERE tl.developerId = ? AND tl.clockOut IS NULL 
        LIMIT 1
    ");
    $activeStmt->execute([$devId]);
    $active = $activeStmt->fetch();

    $liveElapsedMinutes = 0;
    if ($active) {
        $clockInTs = strtotime($active['clockIn'] . ' UTC');
        $liveElapsedMinutes = max(0, round((time() - $clockInTs) / 60));
    }

    // Today's total minutes (Using UTC date boundary)
    $todayStmt = $pdo->prepare("
        SELECT COALESCE(SUM(totalMinutes), 0) FROM developer_time_logs 
        WHERE developerId = ? AND DATE(clockIn) = CURDATE()
    ");
    $todayStmt->execute([$devId]);
    $todayMinutes = (int)$todayStmt->fetchColumn();

    // Weekly total minutes (Monday to Sunday)
    $weekStmt = $pdo->prepare("
        SELECT COALESCE(SUM(totalMinutes), 0) FROM developer_time_logs 
        WHERE developerId = ? AND YEARWEEK(clockIn, 1) = YEARWEEK(CURDATE(), 1)
    ");
    $weekStmt->execute([$devId]);
    $weekMinutes = (int)$weekStmt->fetchColumn();

    // Monthly total minutes (Current calendar month)
    $monthStmt = $pdo->prepare("
        SELECT COALESCE(SUM(totalMinutes), 0) FROM developer_time_logs 
        WHERE developerId = ? AND YEAR(clockIn) = YEAR(CURDATE()) AND MONTH(clockIn) = MONTH(CURDATE())
    ");
    $monthStmt->execute([$devId]);
    $monthMinutes = (int)$monthStmt->fetchColumn();

    // Lifetime total minutes
    $allTimeStmt = $pdo->prepare("SELECT COALESCE(SUM(totalMinutes), 0) FROM developer_time_logs WHERE developerId = ?");
    $allTimeStmt->execute([$devId]);
    $allTimeMinutes = (int)$allTimeStmt->fetchColumn();

    sendJson([
        'success' => true,
        'isClockedIn' => !empty($active),
        'activeSession' => $active ? [
            'id' => (int)$active['id'],
            'clockIn' => toUtcIso($active['clockIn']),
            'projectId' => $active['projectId'] ? (int)$active['projectId'] : null,
            'projectName' => $active['projectName'] ?? 'General Development',
            'elapsedMinutes' => $liveElapsedMinutes,
            'taskSummary' => $active['taskSummary'],
            'clientTimezone' => $active['clientTimezone'] ?? 'UTC'
        ] : null,
        'metrics' => [
            'todayHours' => round(($todayMinutes + $liveElapsedMinutes) / 60, 1),
            'todayMinutes' => $todayMinutes + $liveElapsedMinutes,
            'weeklyHours' => round(($weekMinutes + $liveElapsedMinutes) / 60, 1),
            'weeklyMinutes' => $weekMinutes + $liveElapsedMinutes,
            'monthlyHours' => round(($monthMinutes + $liveElapsedMinutes) / 60, 1),
            'monthlyMinutes' => $monthMinutes + $liveElapsedMinutes,
            'lifetimeHours' => round(($allTimeMinutes + $liveElapsedMinutes) / 60, 1),
        ]
    ]);
}

// -----------------------------------------------------------------------------
// 4. DEVELOPER TIME LOGS HISTORY
// -----------------------------------------------------------------------------
if ($action === 'my-history' && $method === 'GET') {
    $dev = requireDeveloperUser();
    $devId = (int)$dev['id'];
    $limit = min(200, max(1, (int)($_GET['limit'] ?? 50)));

    $stmt = $pdo->prepare("
        SELECT tl.id, tl.clockIn, tl.clockOut, tl.totalMinutes, tl.taskSummary, tl.createdAt, tl.clientTimezone,
               p.id as projectId, p.name as projectName
        FROM developer_time_logs tl
        LEFT JOIN projects p ON tl.projectId = p.id
        WHERE tl.developerId = ?
        ORDER BY tl.clockIn DESC
        LIMIT $limit
    ");
    $stmt->execute([$devId]);
    $logs = $stmt->fetchAll();

    foreach ($logs as &$log) {
        $log['clockIn'] = toUtcIso($log['clockIn']);
        $log['clockOut'] = toUtcIso($log['clockOut']);
        $log['createdAt'] = toUtcIso($log['createdAt']);
        $log['totalHours'] = round($log['totalMinutes'] / 60, 2);
        $log['isActive'] = empty($log['clockOut']);
    }

    sendJson(['success' => true, 'logs' => $logs]);
}

// =============================================================================
// 5. ADMIN: GLOBAL TIME LOGS & ATTENDANCE DASHBOARD
// =============================================================================
requireAdminUser();

if ($method === 'GET') {
    $devIdFilter = isset($_GET['developerId']) ? (int)$_GET['developerId'] : 0;
    $projectIdFilter = isset($_GET['projectId']) ? (int)$_GET['projectId'] : 0;
    $startDate = $_GET['startDate'] ?? '';
    $endDate = $_GET['endDate'] ?? '';
    $limit = min(500, max(1, (int)($_GET['limit'] ?? 100)));

    $where = [];
    $params = [];

    if ($devIdFilter > 0) {
        $where[] = 'tl.developerId = :did';
        $params[':did'] = $devIdFilter;
    }
    if ($projectIdFilter > 0) {
        $where[] = 'tl.projectId = :pid';
        $params[':pid'] = $projectIdFilter;
    }
    if ($startDate) {
        $where[] = 'DATE(tl.clockIn) >= :sdate';
        $params[':sdate'] = $startDate;
    }
    if ($endDate) {
        $where[] = 'DATE(tl.clockIn) <= :edate';
        $params[':edate'] = $endDate;
    }

    $whereClause = !empty($where) ? ('WHERE ' . implode(' AND ', $where)) : '';

    $stmt = $pdo->prepare("
        SELECT tl.id, tl.developerId, tl.projectId, tl.clockIn, tl.clockOut, tl.totalMinutes, tl.taskSummary, tl.ipAddress, tl.clientTimezone,
               d.name as developerName, d.email as developerEmail, d.roleTitle as developerRole, d.hourlyRate, d.currency,
               p.name as projectName
        FROM developer_time_logs tl
        JOIN developers d ON tl.developerId = d.id
        LEFT JOIN projects p ON tl.projectId = p.id
        $whereClause
        ORDER BY tl.clockIn DESC
        LIMIT $limit
    ");
    $stmt->execute($params);
    $logs = $stmt->fetchAll();

    // Calculate aggregated metrics
    $totalMinutes = 0;
    $activeCount = 0;
    foreach ($logs as &$l) {
        $l['clockIn'] = toUtcIso($l['clockIn']);
        $l['clockOut'] = toUtcIso($l['clockOut']);
        $l['totalHours'] = round($l['totalMinutes'] / 60, 2);
        $l['isActive'] = empty($l['clockOut']);
        $totalMinutes += (int)$l['totalMinutes'];
        if ($l['isActive']) $activeCount++;
    }

    // Currently clocked in developers right now
    $nowActive = $pdo->query("
        SELECT tl.id, tl.clockIn, tl.taskSummary, tl.clientTimezone, d.id as developerId, d.name, d.email, d.roleTitle, p.name as projectName
        FROM developer_time_logs tl
        JOIN developers d ON tl.developerId = d.id
        LEFT JOIN projects p ON tl.projectId = p.id
        WHERE tl.clockOut IS NULL
        ORDER BY tl.clockIn ASC
    ")->fetchAll();

    foreach ($nowActive as &$na) {
        $clockInTs = strtotime($na['clockIn'] . ' UTC');
        $na['clockIn'] = toUtcIso($na['clockIn']);
        $na['elapsedMinutes'] = max(0, round((time() - $clockInTs) / 60));
    }

    sendJson([
        'success' => true,
        'logs' => $logs,
        'activeNow' => $nowActive,
        'metrics' => [
            'totalLogs' => count($logs),
            'totalMinutes' => $totalMinutes,
            'totalHours' => round($totalMinutes / 60, 1),
            'activeDevelopersCount' => count($nowActive)
        ]
    ]);
}

sendJson(['success' => false, 'error' => 'Unsupported method'], 405);
