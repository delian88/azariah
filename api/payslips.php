<?php
/**
 * Payslips & Payroll Disbursement API
 * Azariah Management Group Backend
 */
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/developer_mailer.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Determine action from URI
if (!$action) {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (str_ends_with($uri, 'payslips/my-payslips') || str_ends_with($uri, 'my-payslips')) $action = 'my-payslips';
    elseif (str_ends_with($uri, 'payslips/confirm') || str_ends_with($uri, 'confirm')) $action = 'confirm';
    elseif (str_ends_with($uri, 'payslips/calculate') || str_ends_with($uri, 'calculate')) $action = 'calculate';
}

$pdo = getDbConnection();
ensureDevModuleTables($pdo);

// -----------------------------------------------------------------------------
// 1. DEVELOPER VIEW: LIST MY PAYSLIPS
// -----------------------------------------------------------------------------
if ($action === 'my-payslips' && $method === 'GET') {
    $dev = requireDeveloperUser();
    $devId = (int)$dev['id'];

    $stmt = $pdo->prepare("
        SELECT ps.id, ps.referenceNo, ps.periodStart, ps.periodEnd, ps.hoursBilled, ps.hourlyRate,
               ps.bonus, ps.deductions, ps.totalAmount, ps.currency, ps.paymentMethod, ps.notes,
               ps.status, ps.confirmedAt, ps.issuedAt, ps.createdAt,
               d.name as developerName, d.email as developerEmail, d.roleTitle as developerRole
        FROM payslips ps
        JOIN developers d ON ps.developerId = d.id
        WHERE ps.developerId = ?
        ORDER BY ps.issuedAt DESC
    ");
    $stmt->execute([$devId]);
    $payslips = $stmt->fetchAll();

    sendJson(['success' => true, 'payslips' => $payslips]);
}

// -----------------------------------------------------------------------------
// 2. DEVELOPER ACTION: CONFIRM PAYMENT RECEIVED
// -----------------------------------------------------------------------------
if ($action === 'confirm' && $method === 'POST') {
    $dev = requireDeveloperUser();
    $devId = (int)$dev['id'];
    $input = getJsonInput();
    $payslipId = (int)($input['payslipId'] ?? 0);

    if (!$payslipId) {
        sendJson(['success' => false, 'error' => 'Payslip ID is required'], 400);
    }

    $stmt = $pdo->prepare("SELECT id, referenceNo, status, totalAmount, currency FROM payslips WHERE id = ? AND developerId = ? LIMIT 1");
    $stmt->execute([$payslipId, $devId]);
    $payslip = $stmt->fetch();

    if (!$payslip) {
        sendJson(['success' => false, 'error' => 'Payslip not found or unauthorized'], 404);
    }

    if ($payslip['status'] === 'confirmed') {
        sendJson(['success' => true, 'message' => 'Payment has already been confirmed', 'confirmedAt' => date('Y-m-d H:i:s')]);
    }

    $now = date('Y-m-d H:i:s');
    $pdo->prepare("UPDATE payslips SET status = 'confirmed', confirmedAt = NOW(), updatedAt = NOW(3) WHERE id = ?")->execute([$payslipId]);

    sendJson([
        'success' => true,
        'message' => "Payment of {$payslip['currency']} {$payslip['totalAmount']} confirmed successfully. Thank you!",
        'referenceNo' => $payslip['referenceNo'],
        'status' => 'confirmed',
        'confirmedAt' => $now
    ]);
}

// =============================================================================
// ADMIN OPERATIONS (Require Admin)
// =============================================================================
requireAdminUser();

// -----------------------------------------------------------------------------
// HELPER: CALCULATE HOURS & ESTIMATED PAY FOR DATE RANGE
// -----------------------------------------------------------------------------
if ($action === 'calculate' && $method === 'GET') {
    $devId = (int)($_GET['developerId'] ?? 0);
    $startDate = $_GET['startDate'] ?? '';
    $endDate = $_GET['endDate'] ?? '';

    if (!$devId || !$startDate || !$endDate) {
        sendJson(['success' => false, 'error' => 'developerId, startDate, and endDate required'], 400);
    }

    $dStmt = $pdo->prepare("SELECT id, name, email, hourlyRate, currency FROM developers WHERE id = ?");
    $dStmt->execute([$devId]);
    $dev = $dStmt->fetch();

    if (!$dev) {
        sendJson(['success' => false, 'error' => 'Developer not found'], 404);
    }

    $tStmt = $pdo->prepare("
        SELECT COALESCE(SUM(totalMinutes), 0) as totalMinutes, COUNT(*) as sessionsCount
        FROM developer_time_logs 
        WHERE developerId = ? AND DATE(clockIn) >= ? AND DATE(clockIn) <= ? AND clockOut IS NOT NULL
    ");
    $tStmt->execute([$devId, $startDate, $endDate]);
    $data = $tStmt->fetch();

    $minutes = (int)$data['totalMinutes'];
    $hours = round($minutes / 60, 2);
    $rate = (float)$dev['hourlyRate'];
    $estimatedPay = round($hours * $rate, 2);

    sendJson([
        'success' => true,
        'developer' => $dev,
        'periodStart' => $startDate,
        'periodEnd' => $endDate,
        'totalMinutes' => $minutes,
        'hoursBilled' => $hours,
        'hourlyRate' => $rate,
        'estimatedPay' => $estimatedPay,
        'currency' => $dev['currency']
    ]);
}

// -----------------------------------------------------------------------------
// GET /api/payslips: Admin list all payslips
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $devIdFilter = isset($_GET['developerId']) ? (int)$_GET['developerId'] : 0;
    $statusFilter = trim($_GET['status'] ?? '');

    $where = [];
    $params = [];

    if ($devIdFilter > 0) {
        $where[] = 'ps.developerId = :did';
        $params[':did'] = $devIdFilter;
    }
    if ($statusFilter && in_array($statusFilter, ['issued', 'confirmed'])) {
        $where[] = 'ps.status = :status';
        $params[':status'] = $statusFilter;
    }

    $whereClause = !empty($where) ? ('WHERE ' . implode(' AND ', $where)) : '';

    $stmt = $pdo->prepare("
        SELECT ps.id, ps.developerId, ps.referenceNo, ps.periodStart, ps.periodEnd, ps.hoursBilled, ps.hourlyRate,
               ps.bonus, ps.deductions, ps.totalAmount, ps.currency, ps.paymentMethod, ps.notes,
               ps.status, ps.confirmedAt, ps.issuedAt, ps.createdAt,
               d.name as developerName, d.email as developerEmail, d.roleTitle as developerRole
        FROM payslips ps
        JOIN developers d ON ps.developerId = d.id
        $whereClause
        ORDER BY ps.issuedAt DESC
    ");
    $stmt->execute($params);
    $payslips = $stmt->fetchAll();

    // Aggregates
    $totalDisbursed = 0;
    $confirmedCount = 0;
    $issuedCount = 0;
    foreach ($payslips as $p) {
        $totalDisbursed += (float)$p['totalAmount'];
        if ($p['status'] === 'confirmed') $confirmedCount++;
        else $issuedCount++;
    }

    sendJson([
        'success' => true,
        'payslips' => $payslips,
        'summary' => [
            'totalPayslips' => count($payslips),
            'totalAmount' => round($totalDisbursed, 2),
            'confirmedCount' => $confirmedCount,
            'pendingConfirmationCount' => $issuedCount
        ]
    ]);
}

// -----------------------------------------------------------------------------
// POST /api/payslips: Record payment & issue payslip
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $input = getJsonInput();
    $developerId = (int)($input['developerId'] ?? 0);
    $periodStart = trim($input['periodStart'] ?? date('Y-m-01'));
    $periodEnd = trim($input['periodEnd'] ?? date('Y-m-d'));
    $hoursBilled = (float)($input['hoursBilled'] ?? 0.00);
    $hourlyRate = (float)($input['hourlyRate'] ?? 0.00);
    $bonus = (float)($input['bonus'] ?? 0.00);
    $deductions = (float)($input['deductions'] ?? 0.00);
    $currency = trim($input['currency'] ?? 'USD');
    $paymentMethod = trim($input['paymentMethod'] ?? 'Bank Transfer');
    $notes = trim($input['notes'] ?? '');
    $sendEmail = isset($input['sendEmail']) ? (bool)$input['sendEmail'] : true;

    if (!$developerId) {
        sendJson(['success' => false, 'error' => 'Developer is required'], 400);
    }

    $dStmt = $pdo->prepare("SELECT id, name, email, roleTitle, hourlyRate, currency FROM developers WHERE id = ?");
    $dStmt->execute([$developerId]);
    $dev = $dStmt->fetch();

    if (!$dev) {
        sendJson(['success' => false, 'error' => 'Developer not found'], 404);
    }

    if ($hourlyRate <= 0 && (float)$dev['hourlyRate'] > 0) {
        $hourlyRate = (float)$dev['hourlyRate'];
    }

    // Calculate total amount: (hours * rate) + bonus - deductions
    $calculatedAmount = round(($hoursBilled * $hourlyRate) + $bonus - $deductions, 2);
    $totalAmount = isset($input['totalAmount']) && (float)$input['totalAmount'] > 0 
        ? (float)$input['totalAmount'] 
        : $calculatedAmount;

    // Generate reference number
    $referenceNo = 'AMG-PAY-' . date('Ym') . '-' . sprintf('%04d', random_int(1000, 9999));

    $insStmt = $pdo->prepare("
        INSERT INTO payslips (developerId, referenceNo, periodStart, periodEnd, hoursBilled, hourlyRate, bonus, deductions, totalAmount, currency, paymentMethod, notes, status, issuedAt, createdAt, updatedAt)
        VALUES (:did, :ref, :pstart, :pend, :hours, :rate, :bonus, :ded, :total, :curr, :method, :notes, 'issued', NOW(), NOW(3), NOW(3))
    ");
    $insStmt->execute([
        ':did' => $developerId,
        ':ref' => $referenceNo,
        ':pstart' => $periodStart,
        ':pend' => $periodEnd,
        ':hours' => $hoursBilled,
        ':rate' => $hourlyRate,
        ':bonus' => $bonus,
        ':ded' => $deductions,
        ':total' => $totalAmount,
        ':curr' => $currency,
        ':method' => $paymentMethod,
        ':notes' => $notes
    ]);

    $payslipId = (int)$pdo->lastInsertId();

    // Send Payslip HTML Email if requested
    $mailStatus = false;
    if ($sendEmail) {
        $mailResult = sendPayslipEmail(
            $dev['email'],
            $dev['name'],
            [
                'referenceNo' => $referenceNo,
                'periodStart' => $periodStart,
                'periodEnd' => $periodEnd,
                'hoursBilled' => $hoursBilled,
                'hourlyRate' => $hourlyRate,
                'totalAmount' => $totalAmount,
                'currency' => $currency,
                'paymentMethod' => $paymentMethod,
                'notes' => $notes
            ]
        );
        $mailStatus = $mailResult['success'];
    }

    sendJson([
        'success' => true,
        'message' => 'Payslip generated and recorded successfully',
        'payslip' => [
            'id' => $payslipId,
            'referenceNo' => $referenceNo,
            'developerName' => $dev['name'],
            'totalAmount' => $totalAmount,
            'currency' => $currency,
            'status' => 'issued'
        ],
        'emailSent' => $mailStatus
    ], 201);
}

// -----------------------------------------------------------------------------
// DELETE /api/payslips: Delete payslip record
// -----------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        $input = getJsonInput();
        $id = (int)($input['id'] ?? 0);
    }

    if (!$id) {
        sendJson(['success' => false, 'error' => 'Payslip ID required'], 400);
    }

    $pdo->prepare("DELETE FROM payslips WHERE id = ?")->execute([$id]);
    sendJson(['success' => true, 'message' => 'Payslip record deleted']);
}

sendJson(['success' => false, 'error' => 'Unsupported method'], 405);
