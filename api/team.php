<?php
/**
 * Management Team & Role-Based Access Control (RBAC) API
 * Azariah Management Group Executive Backend
 *
 * Provides CRUD for Executive Team Members, Workflow Designations (Approver, Reviewer, Contributor, Observer),
 * and Granular Access Permissions.
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/developer_mailer.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Determine action if embedded in URI
if (!$action) {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (str_ends_with($uri, 'team/reset-password')) $action = 'reset-password';
}

$pdo = getDbConnection();
ensureManagementTeamTables($pdo);

// Require authenticated administrative credentials
$currentAdmin = requireAdminUser();
$currentAdminId = (int)$currentAdmin['id'];

// Default permission keys catalog
$availablePermissions = [
    'manage_team'         => 'Manage Management Team & Access Control',
    'manage_content'      => 'Manage Branding, CMS Text & Media Assets',
    'manage_blog'         => 'Create, Edit & Publish Editorial News',
    'manage_projects'     => 'Manage Projects, Scopes & Deliverables',
    'manage_developers'   => 'Manage Developers, Rates & Onboarding',
    'manage_payroll'      => 'Disburse Payroll & Issue Official Payslips',
    'manage_timetracking' => 'Audit & Approve Developer Time Logs',
    'manage_security'     => 'View Device Trust & Audit Security Sessions'
];

// Helper: Compose HTML Welcome Email for new executive
function sendManagementWelcomeEmail($recipientEmail, $recipientName, $plainPassword, $roleTitle, $workflowRole, $department, array $permissions) {
    $workflowLabel = ucfirst($workflowRole);
    $workflowColor = match($workflowRole) {
        'approver' => '#10b981',
        'reviewer' => '#8b5cf6',
        'contributor' => '#0ea5e9',
        default => '#f59e0b'
    };

    $permissionsListHtml = '';
    foreach ($permissions as $p) {
        $name = ucwords(str_replace('_', ' ', str_replace('manage_', '', $p)));
        $permissionsListHtml .= "<li style='margin-bottom: 6px; color: #cbd5e1;'><strong>" . htmlspecialchars($name) . "</strong></li>";
    }

    $loginUrl = 'https://azariahmg.com/#admin';

    $html = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Executive Access Credentials - Azariah Management Group</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #020617; padding: 40px 15px;">
        <tr>
            <td align="center">
                <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 32px 32px 24px 32px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-bottom: 2px solid #84cc16;">
                            <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase;">
                                Azariah <span style="color: #84cc16; font-size: 13px; font-weight: 700; letter-spacing: 0.2em; display: block; margin-top: 4px;">MANAGEMENT GROUP</span>
                            </h1>
                            <p style="margin: 8px 0 0 0; font-size: 11px; letter-spacing: 0.1em; color: #94a3b8; text-transform: uppercase;">
                                Executive Management & Governance Console
                            </p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 32px;">
                            <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 800; color: #ffffff;">
                                Welcome to the Leadership Team, {$recipientName}
                            </h2>
                            <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                                You have been granted access to the Azariah Management Group Executive Console with assigned governance designations and permissions.
                            </p>

                            <!-- Role Card -->
                            <div style="background-color: #020617; border: 1px solid #334155; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="padding-bottom: 10px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Executive Role</td>
                                        <td style="padding-bottom: 10px; font-size: 13px; font-weight: 800; color: #ffffff; text-align: right;">{$roleTitle}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 10px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Workflow Designation</td>
                                        <td style="padding-bottom: 10px; text-align: right;">
                                            <span style="display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; background-color: rgba(255, 255, 255, 0.08); color: {$workflowColor}; border: 1px solid {$workflowColor};">
                                                {$workflowLabel}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 10px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Department</td>
                                        <td style="padding-bottom: 10px; font-size: 13px; font-weight: 700; color: #cbd5e1; text-align: right;">{$department}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Access Email</td>
                                        <td style="font-size: 13px; font-weight: 700; color: #84cc16; text-align: right; font-family: monospace;">{$recipientEmail}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Credentials Box -->
                            <div style="background-color: #1e1b4b; border: 1px solid #4338ca; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                                <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #a5b4fc;">
                                    Temporary Access Password
                                </p>
                                <div style="font-size: 18px; font-weight: 800; font-family: monospace; letter-spacing: 0.15em; color: #ffffff; background-color: #0f172a; padding: 12px 16px; border-radius: 4px; border: 1px dashed #6366f1;">
                                    {$plainPassword}
                                </div>
                                <p style="margin: 8px 0 0 0; font-size: 11px; color: #c7d2fe;">
                                    Please sign in and change your password immediately in System & Security.
                                </p>
                            </div>

                            <!-- Assigned Permissions -->
                            <div style="margin-bottom: 28px;">
                                <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #ffffff;">
                                    Assigned Permissions Matrix:
                                </p>
                                <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
                                    {$permissionsListHtml}
                                </ul>
                            </div>

                            <!-- CTA Button -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <a href="{$loginUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #84cc16; color: #020617; font-size: 13px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; border-radius: 4px; box-shadow: 0 10px 15px -3px rgba(132, 204, 22, 0.3);">
                                            Sign In to Executive Console &rarr;
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 32px; background-color: #020617; border-top: 1px solid #1e293b; text-align: center;">
                            <p style="margin: 0; font-size: 11px; color: #64748b;">
                                &copy; 2026 Azariah Management Group. Confidential &amp; Proprietary Executive Governance.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;

    return dispatchAMGDeveloperEmail(
        $recipientEmail,
        $recipientName,
        'Executive Access Credentials - Azariah Management Group',
        $html
    );
}

// -----------------------------------------------------------------------------
// ACTION: RESET PASSWORD (/api/admin/team/reset-password)
// -----------------------------------------------------------------------------
if ($action === 'reset-password' && $method === 'POST') {
    $input = getJsonInput();
    $memberId = (int)($input['id'] ?? $input['memberId'] ?? 0);
    $customPassword = trim($input['password'] ?? '');
    $sendEmail = !empty($input['sendEmail']);

    if ($memberId <= 0) {
        sendJson(['success' => false, 'error' => 'Team member ID is required'], 400);
    }

    $stmt = $pdo->prepare("SELECT id, username, email, name, roleTitle, workflowRole, department, permissions FROM admin_users WHERE id = ? LIMIT 1");
    $stmt->execute([$memberId]);
    $member = $stmt->fetch();

    if (!$member) {
        sendJson(['success' => false, 'error' => 'Management team member not found'], 404);
    }

    // Generate random 10-character password if not provided
    $plainPassword = $customPassword ?: 'AMG-' . substr(bin2hex(random_bytes(4)), 0, 6) . '!9';
    if (strlen($plainPassword) < 6) {
        sendJson(['success' => false, 'error' => 'Password must be at least 6 characters long'], 400);
    }

    $passwordHash = password_hash($plainPassword, PASSWORD_BCRYPT);
    $pdo->prepare("UPDATE admin_users SET passwordHash = ?, updatedAt = NOW() WHERE id = ?")->execute([$passwordHash, $memberId]);

    $emailSent = false;
    if ($sendEmail && !empty($member['email'])) {
        $perms = !empty($member['permissions']) ? json_decode($member['permissions'], true) : [];
        $mailRes = sendManagementWelcomeEmail(
            $member['email'],
            $member['name'] ?: 'Executive Member',
            $plainPassword,
            $member['roleTitle'],
            $member['workflowRole'],
            $member['department'] ?: 'Executive Management',
            $perms
        );
        $emailSent = !empty($mailRes['success']);
    }

    sendJson([
        'success' => true,
        'message' => 'Password reset successfully for ' . ($member['name'] ?: $member['email']),
        'plainPassword' => $plainPassword,
        'emailSent' => $emailSent
    ]);
}

// -----------------------------------------------------------------------------
// GET /api/admin/team: List all Management Team Members with stats & permissions
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $stmt = $pdo->query("
        SELECT 
            id, username, email, name, role, roleTitle, workflowRole, 
            department, phone, permissions, status, lastLoginAt, createdAt, updatedAt
        FROM admin_users 
        ORDER BY (id = 1) DESC, createdAt ASC
    ");
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stats = [
        'total' => count($members),
        'approvers' => 0,
        'reviewers' => 0,
        'contributors' => 0,
        'observers' => 0,
        'active' => 0,
        'inactive' => 0
    ];

    foreach ($members as &$m) {
        $m['id'] = (int)$m['id'];
        $m['isSuperAdmin'] = ($m['id'] === 1 || $m['role'] === 'super_admin');
        $m['isCurrentUser'] = ($m['id'] === $currentAdminId);

        // Decode JSON permissions or provide full set for primary admin
        if (!empty($m['permissions'])) {
            $decoded = json_decode($m['permissions'], true);
            $m['permissions'] = is_array($decoded) ? $decoded : [];
        } else {
            $m['permissions'] = ($m['id'] === 1 || $m['role'] === 'super_admin') 
                ? array_keys($availablePermissions) 
                : ['manage_content', 'manage_blog'];
        }

        // Stats aggregation
        if ($m['status'] === 'active') {
            $stats['active']++;
        } else {
            $stats['inactive']++;
        }

        $wf = strtolower($m['workflowRole'] ?? 'reviewer');
        if (isset($stats[$wf . 's'])) {
            $stats[$wf . 's']++;
        }
    }

    sendJson([
        'success' => true,
        'members' => $members,
        'stats' => $stats,
        'availablePermissions' => $availablePermissions
    ]);
}

// -----------------------------------------------------------------------------
// POST /api/admin/team: Add a New Management Team Member
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $input = getJsonInput();

    $name = trim($input['name'] ?? '');
    $email = strtolower(trim($input['email'] ?? ''));
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';
    $role = trim($input['role'] ?? 'admin');
    $roleTitle = trim($input['roleTitle'] ?? 'Management Executive');
    $workflowRole = strtolower(trim($input['workflowRole'] ?? 'reviewer'));
    $department = trim($input['department'] ?? 'Executive Management');
    $phone = trim($input['phone'] ?? '');
    $status = in_array($input['status'] ?? '', ['active', 'inactive']) ? $input['status'] : 'active';
    $permissions = is_array($input['permissions'] ?? null) ? $input['permissions'] : [];
    $sendWelcomeEmail = !empty($input['sendWelcomeEmail']);

    if (!$name) {
        sendJson(['success' => false, 'error' => 'Full name is required'], 400);
    }
    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJson(['success' => false, 'error' => 'A valid email address is required'], 400);
    }
    if (!$password || strlen($password) < 6) {
        sendJson(['success' => false, 'error' => 'Password must be at least 6 characters long'], 400);
    }

    // Auto-generate username from email prefix if empty
    if (!$username) {
        $parts = explode('@', $email);
        $username = preg_replace('/[^a-zA-Z0-9._-]/', '', $parts[0]);
    }

    // Validate workflow role
    if (!in_array($workflowRole, ['approver', 'reviewer', 'contributor', 'observer'])) {
        $workflowRole = 'reviewer';
    }

    // Default permissions based on workflow designation if not explicitly selected
    if (empty($permissions)) {
        if ($workflowRole === 'approver') {
            $permissions = array_keys($availablePermissions);
        } elseif ($workflowRole === 'reviewer') {
            $permissions = ['manage_content', 'manage_blog', 'manage_projects', 'manage_timetracking'];
        } elseif ($workflowRole === 'contributor') {
            $permissions = ['manage_content', 'manage_blog', 'manage_projects'];
        } else {
            $permissions = ['manage_content'];
        }
    }

    // Check if email or username is already taken in admin_users
    $dupStmt = $pdo->prepare("SELECT id, email, username FROM admin_users WHERE email = ? OR username = ? LIMIT 1");
    $dupStmt->execute([$email, $username]);
    $existing = $dupStmt->fetch();

    if ($existing) {
        if (strtolower($existing['email']) === $email) {
            sendJson(['success' => false, 'error' => "An administrator with the email '{$email}' already exists."], 400);
        } else {
            // Append random suffix to username if only username collided
            $username .= '_' . rand(10, 99);
        }
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $permissionsJson = json_encode(array_values(array_unique($permissions)));

    $insStmt = $pdo->prepare("
        INSERT INTO admin_users (
            `username`, `email`, `passwordHash`, `name`, `role`, `roleTitle`, 
            `workflowRole`, `department`, `phone`, `permissions`, `status`, `createdAt`, `updatedAt`
        ) VALUES (
            :username, :email, :passwordHash, :name, :role, :roleTitle,
            :workflowRole, :department, :phone, :permissions, :status, NOW(), NOW()
        )
    ");

    $insStmt->execute([
        ':username'     => $username,
        ':email'        => $email,
        ':passwordHash' => $passwordHash,
        ':name'         => $name,
        ':role'         => $role,
        ':roleTitle'    => $roleTitle,
        ':workflowRole' => $workflowRole,
        ':department'   => $department,
        ':phone'        => $phone,
        ':permissions'  => $permissionsJson,
        ':status'       => $status
    ]);

    $newId = (int)$pdo->lastInsertId();

    // Optionally dispatch HTML Welcome Email
    $emailDispatched = false;
    if ($sendWelcomeEmail) {
        $mailRes = sendManagementWelcomeEmail(
            $email,
            $name,
            $password,
            $roleTitle,
            $workflowRole,
            $department,
            $permissions
        );
        $emailDispatched = !empty($mailRes['success']);
    }

    // Fetch newly created record
    $fetchStmt = $pdo->prepare("SELECT id, username, email, name, role, roleTitle, workflowRole, department, phone, permissions, status, createdAt FROM admin_users WHERE id = ?");
    $fetchStmt->execute([$newId]);
    $newMember = $fetchStmt->fetch(PDO::FETCH_ASSOC);
    if ($newMember) {
        $newMember['id'] = (int)$newMember['id'];
        $newMember['permissions'] = json_decode($newMember['permissions'], true) ?: [];
    }

    sendJson([
        'success' => true,
        'message' => "Management Team Member '{$name}' added successfully as {$workflowRole}.",
        'member' => $newMember,
        'emailDispatched' => $emailDispatched,
        'credentials' => [
            'name' => $name,
            'email' => $email,
            'username' => $username,
            'password' => $password,
            'roleTitle' => $roleTitle,
            'workflowRole' => $workflowRole
        ]
    ]);
}

// -----------------------------------------------------------------------------
// PUT /api/admin/team: Update Management Team Member Details, Roles, & Permissions
// -----------------------------------------------------------------------------
if ($method === 'PUT') {
    $input = getJsonInput();
    $id = (int)($input['id'] ?? 0);

    if ($id <= 0) {
        sendJson(['success' => false, 'error' => 'Member ID is required'], 400);
    }

    $stmt = $pdo->prepare("SELECT id, username, email, role, status FROM admin_users WHERE id = ? LIMIT 1");
    $stmt->execute([$id]);
    $member = $stmt->fetch();

    if (!$member) {
        sendJson(['success' => false, 'error' => 'Management team member not found'], 404);
    }

    $name = trim($input['name'] ?? '');
    $email = strtolower(trim($input['email'] ?? ''));
    $username = trim($input['username'] ?? '');
    $role = trim($input['role'] ?? $member['role']);
    $roleTitle = trim($input['roleTitle'] ?? 'Management Executive');
    $workflowRole = strtolower(trim($input['workflowRole'] ?? 'reviewer'));
    $department = trim($input['department'] ?? 'Executive Management');
    $phone = trim($input['phone'] ?? '');
    $status = in_array($input['status'] ?? '', ['active', 'inactive']) ? $input['status'] : 'active';
    $permissions = is_array($input['permissions'] ?? null) ? $input['permissions'] : [];
    $newPassword = trim($input['password'] ?? '');

    if (!$name) {
        sendJson(['success' => false, 'error' => 'Full name cannot be blank'], 400);
    }
    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJson(['success' => false, 'error' => 'A valid email address is required'], 400);
    }
    if (!in_array($workflowRole, ['approver', 'reviewer', 'contributor', 'observer'])) {
        $workflowRole = 'reviewer';
    }

    // Safety checks for primary root administrator
    if ($id === 1) {
        $status = 'active'; // Cannot deactivate primary root admin
        $role = 'super_admin';
        $workflowRole = 'approver';
        // Always preserve all permissions for root
        $permissions = array_keys($availablePermissions);
    }

    // Check duplicate email or username with another user
    $dupStmt = $pdo->prepare("SELECT id FROM admin_users WHERE (email = ? OR username = ?) AND id != ? LIMIT 1");
    $dupStmt->execute([$email, $username, $id]);
    if ($dupStmt->fetch()) {
        sendJson(['success' => false, 'error' => 'Another administrator is already using this email or username'], 400);
    }

    $permissionsJson = json_encode(array_values(array_unique($permissions)));

    if ($newPassword && strlen($newPassword) >= 6) {
        $passwordHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $upStmt = $pdo->prepare("
            UPDATE admin_users SET 
                `name` = :name,
                `email` = :email,
                `username` = :username,
                `role` = :role,
                `roleTitle` = :roleTitle,
                `workflowRole` = :workflowRole,
                `department` = :department,
                `phone` = :phone,
                `permissions` = :permissions,
                `status` = :status,
                `passwordHash` = :passwordHash,
                `updatedAt` = NOW()
            WHERE `id` = :id
        ");
        $upStmt->execute([
            ':name'         => $name,
            ':email'        => $email,
            ':username'     => $username,
            ':role'         => $role,
            ':roleTitle'    => $roleTitle,
            ':workflowRole' => $workflowRole,
            ':department'   => $department,
            ':phone'        => $phone,
            ':permissions'  => $permissionsJson,
            ':status'       => $status,
            ':passwordHash' => $passwordHash,
            ':id'           => $id
        ]);
    } else {
        $upStmt = $pdo->prepare("
            UPDATE admin_users SET 
                `name` = :name,
                `email` = :email,
                `username` = :username,
                `role` = :role,
                `roleTitle` = :roleTitle,
                `workflowRole` = :workflowRole,
                `department` = :department,
                `phone` = :phone,
                `permissions` = :permissions,
                `status` = :status,
                `updatedAt` = NOW()
            WHERE `id` = :id
        ");
        $upStmt->execute([
            ':name'         => $name,
            ':email'        => $email,
            ':username'     => $username,
            ':role'         => $role,
            ':roleTitle'    => $roleTitle,
            ':workflowRole' => $workflowRole,
            ':department'   => $department,
            ':phone'        => $phone,
            ':permissions'  => $permissionsJson,
            ':status'       => $status,
            ':id'           => $id
        ]);
    }

    // Return updated member
    $fetchStmt = $pdo->prepare("SELECT id, username, email, name, role, roleTitle, workflowRole, department, phone, permissions, status, updatedAt FROM admin_users WHERE id = ?");
    $fetchStmt->execute([$id]);
    $updated = $fetchStmt->fetch(PDO::FETCH_ASSOC);
    if ($updated) {
        $updated['id'] = (int)$updated['id'];
        $updated['permissions'] = json_decode($updated['permissions'], true) ?: [];
    }

    sendJson([
        'success' => true,
        'message' => "Management details updated for {$name}.",
        'member' => $updated
    ]);
}

// -----------------------------------------------------------------------------
// DELETE /api/admin/team: Remove Management Team Member
// -----------------------------------------------------------------------------
if ($method === 'DELETE') {
    $input = getJsonInput();
    $id = (int)($input['id'] ?? $_GET['id'] ?? 0);

    if ($id <= 0) {
        sendJson(['success' => false, 'error' => 'Member ID is required'], 400);
    }

    // Safeguard 1: Cannot delete primary super admin (id = 1)
    if ($id === 1) {
        sendJson(['success' => false, 'error' => 'The root primary administrator account cannot be deleted.'], 403);
    }

    // Safeguard 2: Cannot delete currently logged in account
    if ($id === $currentAdminId) {
        sendJson(['success' => false, 'error' => 'You cannot delete your own administrative session account.'], 403);
    }

    $stmt = $pdo->prepare("SELECT id, name, email FROM admin_users WHERE id = ? LIMIT 1");
    $stmt->execute([$id]);
    $member = $stmt->fetch();

    if (!$member) {
        sendJson(['success' => false, 'error' => 'Management member not found'], 404);
    }

    if (strtolower($member['email']) === 'info@azariahmg.com') {
        sendJson(['success' => false, 'error' => 'The foundational corporate administrator cannot be deleted.'], 403);
    }

    // Clean up dependent tables: admin_devices and admin_otps
    $pdo->prepare("DELETE FROM admin_devices WHERE userId = ?")->execute([$id]);
    $pdo->prepare("DELETE FROM admin_otps WHERE userId = ?")->execute([$id]);

    // Delete user
    $pdo->prepare("DELETE FROM admin_users WHERE id = ?")->execute([$id]);

    sendJson([
        'success' => true,
        'message' => "Management member '{$member['name']}' removed from the leadership roster."
    ]);
}

sendJson(['success' => false, 'error' => 'Invalid HTTP method for team management API'], 405);
