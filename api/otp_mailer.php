<?php
/**
 * HTML OTP Mailer for Azariah Management Group Security System
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/db.php';
if (file_exists(dirname(__DIR__) . '/vendor/autoload.php')) {
    require_once dirname(__DIR__) . '/vendor/autoload.php';
}

function sendAdminOtpEmail($recipientEmail, $recipientName, $otpCode, $deviceName = 'Unknown Device', $ipAddress = 'Unknown IP', $reason = 'Unrecognized Device Login') {
    $mail = new PHPMailer(true);

    try {
        $smtpUser = $_ENV['SMTP_USER'] ?? getenv('SMTP_USER') ?: 'podoremetropolis@gmail.com';
        $smtpPass = $_ENV['SMTP_PASS'] ?? getenv('SMTP_PASS') ?: 'ptfjtrjyaidmyqrf';
        $smtpHost = $_ENV['SMTP_HOST'] ?? getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $smtpPort = (int)($_ENV['SMTP_PORT'] ?? getenv('SMTP_PORT') ?: 465);

        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUser;
        $mail->Password   = $smtpPass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = $smtpPort;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom($smtpUser, 'Azariah Security Command');
        $mail->addAddress($recipientEmail, $recipientName ?: 'Azariah Administrator');

        $mail->isHTML(true);
        $mail->Subject = "🔐 [Security Code: $otpCode] Azariah Admin Login Verification";

        $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Azariah Security Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #005696 0%, #84cc16 100%);"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding: 32px 30px 20px; text-align: center; border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">
                <span style="color: #38bdf8;">AZARI</span><span style="color: #a3e635;">AH</span>
              </h1>
              <p style="margin: 4px 0 0; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: #94a3b8; font-weight: 700;">
                MANAGEMENT GROUP &bull; SECURITY COMMAND
              </p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 35px 25px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="display: inline-block; padding: 6px 14px; background-color: rgba(132, 204, 22, 0.15); border: 1px solid rgba(132, 204, 22, 0.4); border-radius: 20px; font-size: 11px; font-weight: 700; color: #a3e635; text-transform: uppercase; letter-spacing: 0.1em;">
                  🔐 Authentication Required
                </span>
              </div>
              <h2 style="margin: 0 0 10px; font-size: 20px; font-weight: 700; color: #ffffff; text-align: center;">
                One-Time Login Verification
              </h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #94a3b8; text-align: center;">
                A sign-in request was initiated for your administrator account (<strong style="color: #ffffff;">$recipientEmail</strong>). Please enter the 6-digit code below to complete authorization:
              </p>

              <!-- OTP Code Display Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #020617; border: 2px dashed #84cc16; border-radius: 8px; padding: 18px 32px; text-align: center;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #a3e635; margin-right: -12px;">
                        $otpCode
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiration Notice -->
              <p style="margin: 0 0 24px; text-align: center; font-size: 12px; color: #f59e0b; font-weight: 600;">
                ⏱ This verification code expires in 15 minutes.
              </p>

              <!-- Device & Security Metadata -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 14px 18px; font-size: 12px; line-height: 1.6; color: #cbd5e1;">
                <tr>
                  <td style="padding: 4px 6px; color: #64748b; font-weight: 600; width: 130px;">Trigger Reason:</td>
                  <td style="padding: 4px 6px; font-weight: 600; color: #ffffff;">$reason</td>
                </tr>
                <tr>
                  <td style="padding: 4px 6px; color: #64748b; font-weight: 600;">Device:</td>
                  <td style="padding: 4px 6px; font-weight: 600; color: #ffffff;">$deviceName</td>
                </tr>
                <tr>
                  <td style="padding: 4px 6px; color: #64748b; font-weight: 600;">IP Address:</td>
                  <td style="padding: 4px 6px; font-weight: 600; color: #ffffff;">$ipAddress</td>
                </tr>
                <tr>
                  <td style="padding: 4px 6px; color: #64748b; font-weight: 600;">Device Trust:</td>
                  <td style="padding: 4px 6px; font-weight: 600; color: #a3e635;">Active for 7 days upon entry</td>
                </tr>
              </table>

              <!-- Security Warning -->
              <p style="margin: 24px 0 0; font-size: 11px; line-height: 1.5; color: #64748b; border-top: 1px solid #1e293b; padding-top: 18px; text-align: center;">
                If you did not initiate this login request, please ensure your password is secure and contact security immediately at <a href="mailto:info@azariahmg.com" style="color: #38bdf8; text-decoration: none;">info@azariahmg.com</a>.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #020617; padding: 18px 30px; text-align: center; border-top: 1px solid #1e293b; font-size: 11px; color: #475569;">
              &copy; 2026 Azariah Management Group. All rights reserved.<br>
              Strategic Intelligence &bull; Ethical Innovation &bull; Media Impact
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

        $mail->Body = $htmlBody;
        $mail->AltBody = "Azariah Admin Verification Code: $otpCode\nExpires in 15 minutes.\nDevice: $deviceName ($ipAddress)\nReason: $reason";

        $mail->send();
        return ['success' => true];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}

/**
 * Send HTML Login Alert Notification to Administrator
 */
function sendAdminLoginAlertEmail($recipientEmail, $recipientName, $deviceName = 'Unknown Device', $ipAddress = 'Unknown IP', $authMethod = 'Password & 2FA Verification') {
    $mail = new PHPMailer(true);

    try {
        $smtpUser = $_ENV['SMTP_USER'] ?? getenv('SMTP_USER') ?: 'podoremetropolis@gmail.com';
        $smtpPass = $_ENV['SMTP_PASS'] ?? getenv('SMTP_PASS') ?: 'ptfjtrjyaidmyqrf';
        $smtpHost = $_ENV['SMTP_HOST'] ?? getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $smtpPort = (int)($_ENV['SMTP_PORT'] ?? getenv('SMTP_PORT') ?: 465);

        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUser;
        $mail->Password   = $smtpPass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = $smtpPort;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom($smtpUser, 'Azariah Security Command');
        $mail->addAddress($recipientEmail, $recipientName ?: 'Azariah Administrator');

        $mail->isHTML(true);
        $timestamp = date('M d, Y • h:i:s A T');
        $mail->Subject = "🛡️ [Security Alert] New Login to Azariah Admin Console";

        $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Azariah Security - Login Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #10b981 0%, #38bdf8 100%);"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding: 30px 30px 18px; text-align: center; border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">
                <span style="color: #38bdf8;">AZARI</span><span style="color: #a3e635;">AH</span>
              </h1>
              <p style="margin: 4px 0 0; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: #94a3b8; font-weight: 700;">
                MANAGEMENT GROUP &bull; SECURITY MONITORING
              </p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 30px 35px 25px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="display: inline-block; padding: 6px 14px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 20px; font-size: 11px; font-weight: 700; color: #34d399; text-transform: uppercase; letter-spacing: 0.1em;">
                  ✅ Successful Administrator Sign-In
                </span>
              </div>
              <h2 style="margin: 0 0 10px; font-size: 20px; font-weight: 700; color: #ffffff; text-align: center;">
                Security Login Alert
              </h2>
              <p style="margin: 0 0 22px; font-size: 14px; line-height: 1.6; color: #94a3b8; text-align: center;">
                A new administrator session was successfully established for <strong style="color: #ffffff;">$recipientEmail</strong>. Review the session details below:
              </p>

              <!-- Login Metadata Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 16px 20px; font-size: 13px; line-height: 1.7; color: #cbd5e1; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 5px 6px; color: #64748b; font-weight: 600; width: 140px;">Account:</td>
                  <td style="padding: 5px 6px; font-weight: 700; color: #ffffff;">$recipientEmail</td>
                </tr>
                <tr>
                  <td style="padding: 5px 6px; color: #64748b; font-weight: 600;">Time of Sign-in:</td>
                  <td style="padding: 5px 6px; font-weight: 600; color: #ffffff;">$timestamp</td>
                </tr>
                <tr>
                  <td style="padding: 5px 6px; color: #64748b; font-weight: 600;">Device:</td>
                  <td style="padding: 5px 6px; font-weight: 600; color: #38bdf8;">$deviceName</td>
                </tr>
                <tr>
                  <td style="padding: 5px 6px; color: #64748b; font-weight: 600;">IP Address:</td>
                  <td style="padding: 5px 6px; font-weight: 600; color: #ffffff; font-family: monospace;">$ipAddress</td>
                </tr>
                <tr>
                  <td style="padding: 5px 6px; color: #64748b; font-weight: 600;">Auth Method:</td>
                  <td style="padding: 5px 6px; font-weight: 600; color: #a3e635;">$authMethod</td>
                </tr>
                <tr>
                  <td style="padding: 5px 6px; color: #64748b; font-weight: 600;">Session Status:</td>
                  <td style="padding: 5px 6px; font-weight: 600; color: #34d399;">Active until explicit logout</td>
                </tr>
              </table>

              <!-- Notice Box -->
              <div style="background-color: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 6px; padding: 12px 16px; margin-bottom: 22px; font-size: 12px; line-height: 1.5; color: #7dd3fc;">
                <strong>Did you just sign in?</strong> If this was you, you can safely disregard this notification. Your session will remain active across landing pages and tab changes until you sign out.
              </div>

              <!-- Security Warning -->
              <div style="border-top: 1px solid #1e293b; padding-top: 18px; font-size: 11px; line-height: 1.5; color: #64748b; text-align: center;">
                <p style="margin: 0 0 8px; color: #ef4444; font-weight: 700;">
                  ⚠️ Don't recognize this activity?
                </p>
                <p style="margin: 0;">
                  If you did not sign in or authorize this session, please revoke the device in your System Console and reset your password immediately, or contact <a href="mailto:info@azariahmg.com" style="color: #38bdf8; text-decoration: none;">info@azariahmg.com</a>.
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #020617; padding: 16px 30px; text-align: center; border-top: 1px solid #1e293b; font-size: 11px; color: #475569;">
              &copy; 2026 Azariah Management Group &bull; Autonomous Security Guardian<br>
              Strategic Intelligence &bull; Media Impact
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

        $mail->Body = $htmlBody;
        $mail->AltBody = "Security Alert: Successful Administrator Login to Azariah Admin Console\nAccount: $recipientEmail\nDevice: $deviceName\nIP: $ipAddress\nTime: $timestamp\nAuth Method: $authMethod";

        $mail->send();
        return ['success' => true];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}

