<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle both CLI (from Node.js bridge) and Web requests
if (!isset($json)) {
    $json = file_get_contents('php://input');
}

$data = json_decode($json, true);

$fullName = $data['fullName'] ?? '';
$email = $data['email'] ?? '';
$organization = $data['organization'] ?? 'N/A';
$details = $data['details'] ?? '';

if (empty($fullName) || empty($email) || empty($details)) {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

$to_admin = "info@azariahmg.com";
$subject_admin = "New Strategic Inquiry: $fullName";

$message_admin = "
<html>
<head><title>New Strategic Inquiry</title></head>
<body style='font-family: sans-serif;'>
    <div style='max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;'>
        <h2 style='color: #111;'>New Strategic Inquiry</h2>
        <p><strong>From:</strong> $fullName ($email)</p>
        <p><strong>Organization:</strong> $organization</p>
        <p><strong>Details:</strong></p>
        <p style='background: #f9f9f9; padding: 15px; border-radius: 5px;'>$details</p>
    </div>
</body>
</html>
";

$subject_user = "Inquiry Received - Azariah Management Group";
$message_user = "
<html>
<head><title>Inquiry Received</title></head>
<body style='font-family: sans-serif;'>
    <div style='max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;'>
        <h2 style='color: #111;'>Inquiry Received</h2>
        <p>Hello <strong>$fullName</strong>,</p>
        <p>Thank you for reaching out to <strong>Azariah Management Group</strong>. We have received your inquiry and our team will get back to you shortly.</p>
        <hr />
        <p><strong>Details provided:</strong></p>
        <p><strong>Organization:</strong> $organization</p>
        <p><strong>Message:</strong> $details</p>
        <hr />
        <p style='font-size: 12px; color: #777;'>Best regards,<br />The AMG Team</p>
    </div>
</body>
</html>
";

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: AMG Inquiry System <noreply@azariahmg.com>" . "\r\n";

// Send to Admin
$mail_admin = mail($to_admin, $subject_admin, $message_admin, $headers);

// Send Confirmation to User
$headers_user = "MIME-Version: 1.0" . "\r\n";
$headers_user .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers_user .= "From: Azariah Management Group <info@azariahmg.com>" . "\r\n";
$mail_user = mail($email, $subject_user, $message_user, $headers_user);

if ($mail_admin) {
    echo json_encode(["success" => true, "message" => "Inquiry sent successfully"]);
} else {
    echo json_encode(["success" => false, "error" => "PHP mail() function failed. Check server mail logs."]);
}
?>
