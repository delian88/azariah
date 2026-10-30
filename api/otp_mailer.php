<?php
/**
 * HTML OTP Mailer for Azariah Management Group Security System
 * Multi-Tier Resilient Delivery: Port 465 SSL -> Port 587 TLS -> Native Exim mail()
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/db.php';
if (file_exists(dirname(__DIR__) . '/vendor/autoload.php')) {
    require_once dirname(__DIR__) . '/vendor/autoload.php';
}

function sendAdminOtpEmail($recipientEmail, $recipientName, $otpCode, $deviceName = 'Unknown Device', $ipAddress = 'Unknown IP', $reason = 'Unrecognized Device Login') {
    $smtpUser = $_ENV['SMTP_USER'] ?? getenv('SMTP_USER') ?: 'podoremetropolis@gmail.com';
    $smtpPass = $_ENV['SMTP_PASS'] ?? getenv('SMTP_PASS') ?: 'ptfjtrjyaidmyqrf';
    $smtpHost = $_ENV['SMTP_HOST'] ?? getenv('SMTP_HOST') ?: 'smtp.gmail.com';

    $subject = "🔐 [Security Code: $otpCode] Azariah Admin Login Verification";

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
              <div style="background-color: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px;">
                  Session & Verification Details
                </div>
                <table width="100%" cellspacing="0" cellpadding="4" style="font-size: 12px;">
                  <tr>
                    <td style="color: #94a3b8; width: 35%;">Reason:</td>
                    <td style="color: #f1f5f9; font-weight: 600;">$reason</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Device / OS:</td>
                    <td style="color: #f1f5f9; font-weight: 600;">$deviceName</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Client IP:</td>
                    <td style="color: #38bdf8; font-family: monospace;">$ipAddress</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Trust Duration:</td>
                    <td style="color: #a3e635; font-weight: 600;">7 Days Upon Verification</td>
                  </tr>
                </table>
              </div>

              <!-- Notice Box -->
              <div style="background-color: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 6px; padding: 12px 16px; margin-bottom: 22px; font-size: 12px; line-height: 1.5; color: #7dd3fc;">
                <strong>Security Protection:</strong> Once authorized, this device will remain recognized for 7 days so you won't need to re-verify on every sign-in.
              </div>

              <!-- Warning -->
              <div style="border-top: 1px solid #1e293b; padding-top: 18px; font-size: 11px; line-height: 1.5; color: #64748b; text-align: center;">
                <p style="margin: 0;">
                  If you did not initiate this login request, ignore this message. Your password remains protected.
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #020617; padding: 16px 30px; text-align: center; border-top: 1px solid #1e293b; font-size: 11px; color: #475569;">
              &copy; 2026 Azariah Management Group &bull; Autonomous Security Guardian<br>
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

    $altBody = "Azariah Admin Verification Code: $otpCode\nExpires in 15 minutes.\nDevice: $deviceName ($ipAddress)\nReason: $reason";

    // --- ATTEMPT 1: Primary SMTP (Port 465 SSL) ---
    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUser;
        $mail->Password   = $smtpPass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        $mail->Timeout    = 10;
        $mail->CharSet    = 'UTF-8';
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ];

        $mail->setFrom($smtpUser, 'Azariah Security Command');
        $mail->addAddress($recipientEmail, $recipientName ?: 'Azariah Administrator');

        // Deliver also to support@azariahmg.com and SMTP account backup
        if (strcasecmp($recipientEmail, 'support@azariahmg.com') !== 0) {
            $mail->addAddress('support@azariahmg.com', 'Azariah Support Inbox');
        }
        if (filter_var($smtpUser, FILTER_VALIDATE_EMAIL) && strcasecmp($recipientEmail, $smtpUser) !== 0) {
            $mail->addBCC($smtpUser, 'Security Backup');
        }

        $mail->isHTML(true);
        $mail->Encoding = 'base64';
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        $mail->AltBody = $altBody;

        $mail->send();
        return ['success' => true, 'transport' => 'smtp_465_ssl'];
    } catch (Exception $e1) {
        $err1 = $mail->ErrorInfo ?: $e1->getMessage();

        // --- ATTEMPT 2: Fallback SMTP (Port 587 STARTTLS) ---
        try {
            $mail2 = new PHPMailer(true);
            $mail2->isSMTP();
            $mail2->Host       = $smtpHost;
            $mail2->SMTPAuth   = true;
            $mail2->Username   = $smtpUser;
            $mail2->Password   = $smtpPass;
            $mail2->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail2->Port       = 587;
            $mail2->Timeout    = 10;
            $mail2->CharSet    = 'UTF-8';
            $mail2->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                ]
            ];

            $mail2->setFrom($smtpUser, 'Azariah Security Command');
            $mail2->addAddress($recipientEmail, $recipientName ?: 'Azariah Administrator');
            if (strcasecmp($recipientEmail, 'support@azariahmg.com') !== 0) {
                $mail2->addAddress('support@azariahmg.com', 'Azariah Support Inbox');
            }
            if (filter_var($smtpUser, FILTER_VALIDATE_EMAIL) && strcasecmp($recipientEmail, $smtpUser) !== 0) {
                $mail2->addBCC($smtpUser, 'Security Backup');
            }

            $mail2->isHTML(true);
            $mail2->Encoding = 'base64';
            $mail2->Subject = $subject;
            $mail2->Body    = $htmlBody;
            $mail2->AltBody = $altBody;

            $mail2->send();
            return ['success' => true, 'transport' => 'smtp_587_tls'];
        } catch (Exception $e2) {
            $err2 = $mail2->ErrorInfo ?: $e2->getMessage();

            // --- ATTEMPT 3: Local Exim/PHP mail() Fallback ---
            $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
            $encodedFrom    = '=?UTF-8?B?' . base64_encode('Azariah Security Command') . '?= <' . $smtpUser . '>';
            $headers  = "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            $headers .= "Content-Transfer-Encoding: base64\r\n";
            $headers .= "From: " . $encodedFrom . "\r\n";
            $headers .= "Reply-To: support@azariahmg.com\r\n";
            $headers .= "Cc: support@azariahmg.com\r\n";
            $headers .= "X-Mailer: Azariah Security Service/2.0\r\n";

            $bodyChunked = rtrim(chunk_split(base64_encode($htmlBody)));
            $sentNative  = @mail($recipientEmail, $encodedSubject, $bodyChunked, $headers, "-f" . $smtpUser);
            if ($sentNative) {
                return ['success' => true, 'transport' => 'cpanel_exim_mail_fallback'];
            }

            file_put_contents(dirname(__DIR__) . '/smtp_debug.log', date('c') . " [OTP ERR] SSL: $err1 | TLS: $err2\n", FILE_APPEND);
            return ['success' => false, 'error' => "SSL: $err1 | TLS: $err2"];
        }
    }
}

/**
 * Send HTML Login Alert Notification to Administrator
 */
function sendAdminLoginAlertEmail($recipientEmail, $recipientName, $deviceName = 'Unknown Device', $ipAddress = 'Unknown IP', $authMethod = 'Password & 2FA Verification') {
    $smtpUser = $_ENV['SMTP_USER'] ?? getenv('SMTP_USER') ?: 'podoremetropolis@gmail.com';
    $smtpPass = $_ENV['SMTP_PASS'] ?? getenv('SMTP_PASS') ?: 'ptfjtrjyaidmyqrf';
    $smtpHost = $_ENV['SMTP_HOST'] ?? getenv('SMTP_HOST') ?: 'smtp.gmail.com';
    $timestamp = date('M d, Y • h:i:s A T');

    $subject = "🛡️ [Security Alert] New Login to Azariah Admin Console";

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
                <span style="color: #38bdf8;">AZARI</span><span style="color: #34d399;">AH</span>
              </h1>
              <p style="margin: 4px 0 0; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: #94a3b8; font-weight: 700;">
                MANAGEMENT GROUP &bull; SECURITY MONITORING
              </p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 35px 25px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="display: inline-block; padding: 6px 14px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 20px; font-size: 11px; font-weight: 700; color: #34d399; text-transform: uppercase; letter-spacing: 0.1em;">
                  ✅ Session Authorized
                </span>
              </div>
              <h2 style="margin: 0 0 10px; font-size: 20px; font-weight: 700; color: #ffffff; text-align: center;">
                Successful Admin Login
              </h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #94a3b8; text-align: center;">
                A new administrator session was authorized for <strong style="color: #ffffff;">$recipientEmail</strong> on the Azariah Management Group System Console.
              </p>

              <!-- Session Details Box -->
              <div style="background-color: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 18px 22px; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px;">
                  Session Details
                </div>
                <table width="100%" cellspacing="0" cellpadding="5" style="font-size: 12px;">
                  <tr>
                    <td style="color: #94a3b8; width: 35%;">Authorized User:</td>
                    <td style="color: #f1f5f9; font-weight: 600;">$recipientName ($recipientEmail)</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Auth Method:</td>
                    <td style="color: #34d399; font-weight: 600;">$authMethod</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Device / Client:</td>
                    <td style="color: #f1f5f9; font-weight: 600;">$deviceName</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">IP Address:</td>
                    <td style="color: #38bdf8; font-family: monospace;">$ipAddress</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Timestamp:</td>
                    <td style="color: #f1f5f9;">$timestamp</td>
                  </tr>
                </table>
              </div>

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
                  If you did not sign in or authorize this session, please revoke the device in your System Console and reset your password immediately, or contact <a href="mailto:support@azariahmg.com" style="color: #38bdf8; text-decoration: none;">support@azariahmg.com</a>.
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

    $altBody = "Security Alert: Successful Administrator Login to Azariah Admin Console\nAccount: $recipientEmail\nDevice: $deviceName\nIP: $ipAddress\nTime: $timestamp\nAuth Method: $authMethod";

    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUser;
        $mail->Password   = $smtpPass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        $mail->Timeout    = 10;
        $mail->CharSet    = 'UTF-8';
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ];

        $mail->setFrom($smtpUser, 'Azariah Security Command');
        $mail->addAddress($recipientEmail, $recipientName ?: 'Azariah Administrator');
        if (strcasecmp($recipientEmail, 'support@azariahmg.com') !== 0) {
            $mail->addAddress('support@azariahmg.com', 'Azariah Support Inbox');
        }
        if (filter_var($smtpUser, FILTER_VALIDATE_EMAIL) && strcasecmp($recipientEmail, $smtpUser) !== 0) {
            $mail->addBCC($smtpUser, 'Security Backup');
        }

        $mail->isHTML(true);
        $mail->Encoding = 'base64';
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        $mail->AltBody = $altBody;

        $mail->send();
        return ['success' => true, 'transport' => 'smtp_465_ssl'];
    } catch (Exception $e) {
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $encodedFrom    = '=?UTF-8?B?' . base64_encode('Azariah Security Command') . '?= <' . $smtpUser . '>';
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "Content-Transfer-Encoding: base64\r\n";
        $headers .= "From: " . $encodedFrom . "\r\n";
        $headers .= "Reply-To: support@azariahmg.com\r\n";
        $headers .= "Cc: support@azariahmg.com\r\n";
        $headers .= "X-Mailer: Azariah Security Service/2.0\r\n";

        $bodyChunked = rtrim(chunk_split(base64_encode($htmlBody)));
        @mail($recipientEmail, $encodedSubject, $bodyChunked, $headers, "-f" . $smtpUser);
        return ['success' => true, 'transport' => 'cpanel_exim_mail_fallback'];
    }
}
