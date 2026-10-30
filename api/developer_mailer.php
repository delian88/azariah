<?php
/**
 * Developer Portal & Payroll HTML Mailer for Azariah Management Group
 * Resilient Multi-Tier Delivery: Port 465 SSL -> Port 587 TLS -> Native Exim mail()
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/db.php';
if (file_exists(dirname(__DIR__) . '/vendor/autoload.php')) {
    require_once dirname(__DIR__) . '/vendor/autoload.php';
}

/**
 * Dispatch resilient email using PHPMailer multi-tier fallback
 */
function dispatchAMGDeveloperEmail($recipientEmail, $recipientName, $subject, $htmlBody, $altBody = '') {
    $smtpUser = $_ENV['SMTP_USER'] ?? getenv('SMTP_USER') ?: 'podoremetropolis@gmail.com';
    $smtpPass = $_ENV['SMTP_PASS'] ?? getenv('SMTP_PASS') ?: 'ptfjtrjyaidmyqrf';
    $smtpHost = $_ENV['SMTP_HOST'] ?? getenv('SMTP_HOST') ?: 'smtp.gmail.com';

    // Tier 1: SSL 465
    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUser;
        $mail->Password   = $smtpPass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        $mail->Timeout    = 8;
        $mail->CharSet    = 'UTF-8';
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ];

        $mail->setFrom($smtpUser, 'Azariah Management Group');
        $mail->addAddress($recipientEmail, $recipientName ?: 'Developer');
        $mail->addReplyTo('support@azariahmg.com', 'Azariah Support');
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        $mail->AltBody = $altBody ?: strip_tags($htmlBody);

        $mail->send();
        return ['success' => true, 'transport' => 'smtp_465_ssl'];
    } catch (Exception $e1) {
        $err1 = $mail->ErrorInfo ?: $e1->getMessage();

        // Tier 2: TLS 587
        try {
            $mail2 = new PHPMailer(true);
            $mail2->isSMTP();
            $mail2->Host       = $smtpHost;
            $mail2->SMTPAuth   = true;
            $mail2->Username   = $smtpUser;
            $mail2->Password   = $smtpPass;
            $mail2->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail2->Port       = 587;
            $mail2->Timeout    = 8;
            $mail2->CharSet    = 'UTF-8';
            $mail2->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                ]
            ];

            $mail2->setFrom($smtpUser, 'Azariah Management Group');
            $mail2->addAddress($recipientEmail, $recipientName ?: 'Developer');
            $mail2->addReplyTo('support@azariahmg.com', 'Azariah Support');
            $mail2->isHTML(true);
            $mail2->Subject = $subject;
            $mail2->Body    = $htmlBody;
            $mail2->AltBody = $altBody ?: strip_tags($htmlBody);

            $mail2->send();
            return ['success' => true, 'transport' => 'smtp_587_tls'];
        } catch (Exception $e2) {
            $err2 = $mail2->ErrorInfo ?: $e2->getMessage();

            // Tier 3: Native PHP mail() fallback
            $headers  = "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            $headers .= "From: Azariah Management Group <$smtpUser>\r\n";
            $headers .= "Reply-To: support@azariahmg.com\r\n";

            $sentNative = @mail($recipientEmail, $subject, $htmlBody, $headers);
            if ($sentNative) {
                return ['success' => true, 'transport' => 'native_mail_fallback'];
            }

            @file_put_contents(dirname(__DIR__) . '/smtp_debug.log', date('c') . " [DEV MAIL ERR] SSL: $err1 | TLS: $err2\n", FILE_APPEND);
            return ['success' => false, 'error' => "SSL: $err1 | TLS: $err2"];
        }
    }
}

/**
 * Send Welcome Email with Login Credentials and Confirmation Link to New Developer
 */
function sendDeveloperWelcomeEmail($recipientEmail, $recipientName, $plainPassword, $roleTitle = 'Developer', $projectNames = [], $portalUrl = '') {
    if (!$portalUrl) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
        $host = $_SERVER['HTTP_HOST'] ?? 'azariahmg.com';
        $portalUrl = $protocol . $host . '/#dev-portal';
    }

    $projectsHtml = '';
    if (!empty($projectNames)) {
        $projectsHtml = '<div style="margin-top: 15px; padding: 12px 16px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 6px;">';
        $projectsHtml .= '<strong style="color: #38bdf8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 6px;">Assigned Project(s):</strong>';
        $projectsHtml .= '<span style="color: #e2e8f0; font-size: 13px;">' . htmlspecialchars(implode(', ', $projectNames)) . '</span>';
        $projectsHtml .= '</div>';
    }

    $subject = "🚀 Welcome to Azariah Management Group — Developer Account Credentials";

    $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Azariah Management Group</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 10px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #0284c7 0%, #10b981 100%);"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding: 32px 30px 20px; text-align: center; border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">
                <span style="color: #38bdf8;">AZARI</span><span style="color: #a3e635;">AH</span>
              </h1>
              <p style="margin: 4px 0 0; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #94a3b8; font-weight: 700;">
                MANAGEMENT GROUP &bull; ENGINEERING COMMAND
              </p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 35px 25px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="display: inline-block; padding: 6px 14px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 20px; font-size: 11px; font-weight: 700; color: #34d399; text-transform: uppercase; letter-spacing: 0.1em;">
                  ⚡ Developer Account Provisioned
                </span>
              </div>
              <h2 style="margin: 0 0 10px; font-size: 20px; font-weight: 700; color: #ffffff; text-align: center;">
                Welcome to the Engineering Team, {$recipientName}!
              </h2>
              <p style="margin: 0 0 22px; font-size: 14px; line-height: 1.6; color: #cbd5e1; text-align: center;">
                Your developer profile has been created for the role of <strong style="color: #38bdf8;">{$roleTitle}</strong>. Use the credentials below to log into the Developer Portal to clock in your work hours, track milestones, and view payslips.
              </p>

              <!-- Credentials Box -->
              <table role="presentation" width="100%" style="background-color: #030712; border: 1px solid #1e293b; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="margin-bottom: 12px;">
                      <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Developer Email / Username</div>
                      <div style="font-size: 15px; color: #ffffff; font-weight: 700; font-family: monospace; margin-top: 4px;">{$recipientEmail}</div>
                    </div>
                    <div>
                      <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Temporary Password</div>
                      <div style="font-size: 16px; color: #34d399; font-weight: 800; font-family: monospace; letter-spacing: 0.05em; margin-top: 4px; padding: 6px 10px; background: rgba(16, 185, 129, 0.1); border-radius: 4px; display: inline-block;">{$plainPassword}</div>
                    </div>
                  </td>
                </tr>
              </table>

              {$projectsHtml}

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0 15px;">
                <a href="{$portalUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 6px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4); text-transform: uppercase; letter-spacing: 0.08em;">
                  Access Developer Portal &rarr;
                </a>
              </div>
              <p style="text-align: center; font-size: 11px; color: #64748b; margin-top: 10px;">
                Direct Portal Link: <a href="{$portalUrl}" style="color: #38bdf8; text-decoration: none;">{$portalUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #0b1120; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                This automated credential dispatch was authorized by Azariah Management Group Executive Admin.<br>
                For technical assistance, contact <a href="mailto:support@azariahmg.com" style="color: #38bdf8; text-decoration: none;">support@azariahmg.com</a>.
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

    return dispatchAMGDeveloperEmail($recipientEmail, $recipientName, $subject, $htmlBody);
}

/**
 * Send Payslip Issuance Email with Breakdown and Confirmation Link
 */
function sendPayslipEmail($recipientEmail, $recipientName, $payslipData, $portalUrl = '') {
    if (!$portalUrl) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
        $host = $_SERVER['HTTP_HOST'] ?? 'azariahmg.com';
        $portalUrl = $protocol . $host . '/#dev-portal';
    }

    $ref = htmlspecialchars($payslipData['referenceNo'] ?? 'AMG-PAY');
    $period = htmlspecialchars(($payslipData['periodStart'] ?? '') . ' to ' . ($payslipData['periodEnd'] ?? ''));
    $hours = number_format((float)($payslipData['hoursBilled'] ?? 0), 1);
    $rate = number_format((float)($payslipData['hourlyRate'] ?? 0), 2);
    $total = number_format((float)($payslipData['totalAmount'] ?? 0), 2);
    $currency = htmlspecialchars($payslipData['currency'] ?? 'USD');
    $method = htmlspecialchars($payslipData['paymentMethod'] ?? 'Direct Transfer');
    $notes = !empty($payslipData['notes']) ? htmlspecialchars($payslipData['notes']) : 'Standard engineering disbursement.';

    $subject = "💳 [Payslip: {$ref}] Azariah Management Group — Disbursement Issued";

    $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Voucher - Azariah Management Group</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 10px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #10b981 0%, #38bdf8 100%);"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding: 32px 30px 20px; text-align: center; border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">
                <span style="color: #38bdf8;">AZARI</span><span style="color: #a3e635;">AH</span>
              </h1>
              <p style="margin: 4px 0 0; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #94a3b8; font-weight: 700;">
                MANAGEMENT GROUP &bull; PAYROLL DISBURSEMENT
              </p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 35px 25px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="display: inline-block; padding: 6px 14px; background-color: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 20px; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.1em;">
                  💳 Payment Voucher Issued
                </span>
              </div>
              <h2 style="margin: 0 0 10px; font-size: 20px; font-weight: 700; color: #ffffff; text-align: center;">
                Payment Statement for {$recipientName}
              </h2>
              <p style="margin: 0 0 22px; font-size: 14px; line-height: 1.6; color: #cbd5e1; text-align: center;">
                A new payment has been processed for your engineering hours. Please review the breakdown below and log in to confirm payment receipt.
              </p>

              <!-- Payslip Summary Card -->
              <table role="presentation" width="100%" style="background-color: #030712; border: 1px solid #1e293b; border-radius: 8px; margin-bottom: 24px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: #94a3b8; font-weight: 600;">Voucher Reference</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b; font-size: 13px; color: #ffffff; font-weight: 700; font-family: monospace; text-align: right;">{$ref}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: #94a3b8; font-weight: 600;">Billing Period</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b; font-size: 13px; color: #ffffff; font-weight: 600; text-align: right;">{$period}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: #94a3b8; font-weight: 600;">Hours Billed</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b; font-size: 13px; color: #ffffff; font-weight: 600; text-align: right;">{$hours} hrs @ {$currency} {$rate}/hr</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: #94a3b8; font-weight: 600;">Payment Method</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b; font-size: 13px; color: #38bdf8; font-weight: 600; text-align: right;">{$method}</td>
                </tr>
                <tr>
                  <td style="padding: 18px; background-color: rgba(16, 185, 129, 0.08); font-size: 14px; color: #ffffff; font-weight: 700;">Total Net Amount</td>
                  <td style="padding: 18px; background-color: rgba(16, 185, 129, 0.08); font-size: 20px; color: #34d399; font-weight: 800; text-align: right; font-family: monospace;">{$currency} {$total}</td>
                </tr>
              </table>

              <div style="padding: 12px 16px; background: rgba(30, 41, 59, 0.5); border-radius: 6px; margin-bottom: 24px; font-size: 12px; color: #94a3b8;">
                <strong style="color: #e2e8f0;">Voucher Memo:</strong> {$notes}
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 25px 0 15px;">
                <a href="{$portalUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 6px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); text-transform: uppercase; letter-spacing: 0.08em;">
                  Confirm Payment Received &rarr;
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #0b1120; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                Azariah Management Group &bull; Corporate Financial Operations &bull; Upper Marlboro, MD, USA<br>
                Please preserve this receipt for your personal tax and financial records.
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

    return dispatchAMGDeveloperEmail($recipientEmail, $recipientName, $subject, $htmlBody);
}

/**
 * Send Task Assignment Email with Priority, Due Date, and Developer Portal Direct Link
 */
function sendDeveloperTaskEmail($recipientEmail, $recipientName, $taskData, $portalUrl = '') {
    if (!$portalUrl) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
        $host = $_SERVER['HTTP_HOST'] ?? 'azariahmg.com';
        $portalUrl = $protocol . $host . '/#dev-portal';
    }

    $taskTitle = htmlspecialchars($taskData['title'] ?? 'New Engineering Task');
    $rawDesc = $taskData['description'] ?? '';
    $taskDescHtml = !empty($rawDesc) ? nl2br(htmlspecialchars($rawDesc)) : '<em style="color:#64748b;">No detailed description provided.</em>';
    $projectName = htmlspecialchars($taskData['projectName'] ?? ($taskData['projectId'] ? 'Project #' . $taskData['projectId'] : 'General Assignment / Engineering'));
    $priority = strtolower($taskData['priority'] ?? 'medium');

    $priorityColor = match($priority) {
        'urgent' => '#ef4444',
        'high'   => '#f97316',
        'medium' => '#38bdf8',
        default  => '#a3e635'
    };
    $priorityBg = match($priority) {
        'urgent' => 'rgba(239, 68, 68, 0.15)',
        'high'   => 'rgba(249, 115, 22, 0.15)',
        'medium' => 'rgba(56, 189, 248, 0.15)',
        default  => 'rgba(163, 230, 53, 0.15)'
    };
    $priorityLabel = strtoupper($priority);

    $dueDate = !empty($taskData['dueDate']) ? htmlspecialchars($taskData['dueDate']) : 'Not Specified';
    $estHours = !empty($taskData['estimatedHours']) ? number_format((float)$taskData['estimatedHours'], 1) . ' hrs' : 'Open / Unbounded';
    $assignedBy = htmlspecialchars($taskData['assignedByAdminName'] ?? 'AMG Project Lead');
    $status = strtoupper(str_replace('_', ' ', $taskData['status'] ?? 'PENDING'));

    $subject = "📋 [Task Assigned: {$taskTitle}] — Azariah Management Group";

    $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Task Assigned - Azariah Management Group</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 590px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 10px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #38bdf8 0%, #a3e635 100%);"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding: 32px 30px 20px; text-align: center; border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">
                <span style="color: #38bdf8;">AZARI</span><span style="color: #a3e635;">AH</span>
              </h1>
              <p style="margin: 4px 0 0; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #94a3b8; font-weight: 700;">
                MANAGEMENT GROUP &bull; TASK MANAGEMENT & ENGINEERING COMMAND
              </p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 35px 25px;">
              <div style="text-align: center; margin-bottom: 18px;">
                <span style="display: inline-block; padding: 6px 14px; background-color: {$priorityBg}; border: 1px solid {$priorityColor}; border-radius: 20px; font-size: 11px; font-weight: 800; color: {$priorityColor}; text-transform: uppercase; letter-spacing: 0.1em;">
                  ⚡ {$priorityLabel} PRIORITY &bull; NEW TASK ASSIGNED
                </span>
              </div>
              <h2 style="margin: 0 0 10px; font-size: 21px; font-weight: 700; color: #ffffff; text-align: center; line-height: 1.3;">
                {$taskTitle}
              </h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #cbd5e1; text-align: center;">
                Hello <strong style="color: #38bdf8;">{$recipientName}</strong>, a new task has been officially assigned to you in the Azariah Management Group workflow pipeline. Please review the assignment details below.
              </p>

              <!-- Task Details Summary Card -->
              <table role="presentation" width="100%" style="background-color: #030712; border: 1px solid #1e293b; border-radius: 8px; margin-bottom: 22px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 13px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: #94a3b8; font-weight: 600; width: 38%;">Assigned Project</td>
                  <td style="padding: 13px 18px; border-bottom: 1px solid #1e293b; font-size: 13px; color: #ffffff; font-weight: 700; text-align: right;">{$projectName}</td>
                </tr>
                <tr>
                  <td style="padding: 13px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: #94a3b8; font-weight: 600;">Priority Level</td>
                  <td style="padding: 13px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; font-weight: 800; color: {$priorityColor}; text-align: right; text-transform: uppercase;">{$priorityLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 13px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: #94a3b8; font-weight: 600;">Due Date</td>
                  <td style="padding: 13px 18px; border-bottom: 1px solid #1e293b; font-size: 13px; color: #fbbf24; font-weight: 700; text-align: right;">{$dueDate}</td>
                </tr>
                <tr>
                  <td style="padding: 13px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: #94a3b8; font-weight: 600;">Estimated Hours</td>
                  <td style="padding: 13px 18px; border-bottom: 1px solid #1e293b; font-size: 13px; color: #38bdf8; font-weight: 700; font-family: monospace; text-align: right;">{$estHours}</td>
                </tr>
                <tr>
                  <td style="padding: 13px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: #94a3b8; font-weight: 600;">Assigned By</td>
                  <td style="padding: 13px 18px; border-bottom: 1px solid #1e293b; font-size: 13px; color: #e2e8f0; font-weight: 600; text-align: right;">{$assignedBy}</td>
                </tr>
                <tr>
                  <td style="padding: 13px 18px; font-size: 12px; color: #94a3b8; font-weight: 600;">Current Status</td>
                  <td style="padding: 13px 18px; font-size: 12px; color: #a3e635; font-weight: 800; text-align: right; letter-spacing: 0.05em;">{$status}</td>
                </tr>
              </table>

              <!-- Scope of Work / Description -->
              <div style="background-color: #030712; border: 1px solid #1e293b; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 700; margin-bottom: 8px;">
                  Scope of Work & Instructions:
                </div>
                <div style="font-size: 13px; line-height: 1.6; color: #f1f5f9;">
                  {$taskDescHtml}
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0 15px;">
                <a href="{$portalUrl}" target="_blank" style="display: inline-block; padding: 14px 34px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 6px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.45); text-transform: uppercase; letter-spacing: 0.08em;">
                  Open Developer Portal &rarr;
                </a>
              </div>
              <p style="text-align: center; font-size: 11px; color: #64748b; margin-top: 10px;">
                Direct Portal Link: <a href="{$portalUrl}" style="color: #38bdf8; text-decoration: none;">{$portalUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #0b1120; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                Azariah Management Group &bull; Corporate Engineering Operations &bull; Upper Marlboro, MD, USA<br>
                For technical questions regarding this task, communicate directly with your project administrator.
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

    return dispatchAMGDeveloperEmail($recipientEmail, $recipientName, $subject, $htmlBody);
}

