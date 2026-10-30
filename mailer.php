<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/api/db.php';
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

setCorsHeaders();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "Invalid JSON"]);
    exit;
}

$fullName     = trim($data['fullName'] ?? '');
$email        = trim($data['email'] ?? '');
$organization = trim($data['organization'] ?? '');
$details      = trim($data['details'] ?? '');

if (!$fullName || !$email || !$details) {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

$mail = new PHPMailer(true);

try {

    // ==============================
    // ==============================
    // SMTP CONFIGURATION (GMAIL SSL 465)
    // ==============================
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
    $mail->Encoding   = 'base64';
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ];

    $mail->isHTML(true);
    $mail->setFrom($smtpUser, 'Azariah Management Group');

    // ==============================
    // SEND TO ADMIN EMAILS
    // ==============================
    $mail->addAddress('support@azariahmg.com');
    $mail->addAddress('info@azariahmg.com'); // COPY SENT HERE

    $mail->Subject = "📩 [New Inquiry] from $fullName ($organization)";

    $mail->Body = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Strategic Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #005696 0%, #84cc16 100%);"></td>
          </tr>
          <tr>
            <td style="padding: 28px 30px 18px; text-align: center; border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; text-transform: uppercase;">
                <span style="color: #38bdf8;">AZARI</span><span style="color: #a3e635;">AH</span>
              </h1>
              <p style="margin: 4px 0 0; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: #94a3b8; font-weight: 700;">
                MANAGEMENT GROUP &bull; STRATEGIC INQUIRY
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 32px 24px;">
              <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #ffffff;">
                New Client Inquiry Received
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 14px 18px; font-size: 13px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 5px 6px; color: #64748b; font-weight: 600; width: 120px;">Full Name:</td>
                  <td style="padding: 5px 6px; font-weight: 700; color: #ffffff;">$fullName</td>
                </tr>
                <tr>
                  <td style="padding: 5px 6px; color: #64748b; font-weight: 600;">Email:</td>
                  <td style="padding: 5px 6px; font-weight: 600; color: #38bdf8;"><a href="mailto:$email" style="color: #38bdf8; text-decoration: none;">$email</a></td>
                </tr>
                <tr>
                  <td style="padding: 5px 6px; color: #64748b; font-weight: 600;">Organization:</td>
                  <td style="padding: 5px 6px; font-weight: 600; color: #a3e635;">$organization</td>
                </tr>
              </table>
              <div style="background-color: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 16px; font-size: 13px; line-height: 1.6; color: #f1f5f9;">
                <p style="margin: 0 0 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8;">Inquiry Details:</p>
                <div style="white-space: pre-wrap;">$details</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #020617; padding: 14px 30px; text-align: center; border-top: 1px solid #1e293b; font-size: 11px; color: #475569;">
              &copy; 2026 Azariah Management Group &bull; Secure Intake Dispatcher
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

    $mail->AltBody = "New Strategic Inquiry from $fullName ($organization)\nEmail: $email\n\nDetails:\n$details";
    $mail->send();

    // ==============================
    // SEND CONFIRMATION TO USER
    // ==============================
    $mail->clearAddresses();
    $mail->addAddress($email, $fullName);

    $mail->Subject = "Thank You for Contacting Azariah Management Group";

    $mail->Body = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #005696 0%, #84cc16 100%);"></td>
          </tr>
          <tr>
            <td style="padding: 28px 30px 18px; text-align: center; border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; text-transform: uppercase;">
                <span style="color: #38bdf8;">AZARI</span><span style="color: #a3e635;">AH</span>
              </h1>
              <p style="margin: 4px 0 0; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: #94a3b8; font-weight: 700;">
                MANAGEMENT GROUP &bull; GLOBAL CLIENT LIAISON
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 32px 24px;">
              <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #ffffff;">
                We Have Received Your Inquiry
              </h2>
              <p style="margin: 0 0 18px; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Dear <strong style="color: #ffffff;">$fullName</strong>, thank you for reaching out to Azariah Management Group. Our executive team has received your submission and will review it promptly. You can expect a response within 4 business hours.
              </p>
              <div style="background-color: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px; font-size: 12px; color: #94a3b8;">
                <p style="margin: 0 0 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em;">Summary of Your Submission:</p>
                <p style="margin: 0 0 4px; color: #cbd5e1;"><strong>Organization:</strong> $organization</p>
                <p style="margin: 0; color: #cbd5e1;"><strong>Details:</strong> $details</p>
              </div>
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #64748b;">
                For urgent matters, reach out directly to <a href="mailto:info@azariahmg.com" style="color: #38bdf8; text-decoration: none;">info@azariahmg.com</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #020617; padding: 16px 30px; text-align: center; border-top: 1px solid #1e293b; font-size: 11px; color: #475569;">
              &copy; 2026 Azariah Management Group &bull; Strategic Intelligence &bull; Ethical Innovation
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

    $mail->AltBody = "Thank you $fullName, we have received your inquiry and will respond within 4 business hours.\nAzariah Management Group";
    $mail->send();

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $mail->ErrorInfo
    ]);
}