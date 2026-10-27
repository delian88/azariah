<?php
/**
 * Dynamic Open Graph & Social Preview Image Generator with AMG Watermark
 * Azariah Management Group
 * Generates 1200x630 crisp social cards for WhatsApp, LinkedIn, X/Twitter, Facebook
 */
require_once __DIR__ . '/db.php';

// Disable error output in image stream
ini_set('display_errors', '0');
error_reporting(0);

$slug = trim($_GET['slug'] ?? $_GET['article'] ?? $_GET['id'] ?? '');

$article = null;
$siteLogoUrl = '';
$siteName = 'AZARIAH MANAGEMENT GROUP';

try {
    $defaultHost = (php_sapi_name() === 'cli' || strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost') !== false) ? '127.0.0.1' : 'localhost';
    $dbHost = $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? getenv('DB_HOST') ?: $defaultHost;
    $dbPort = $_ENV['DB_PORT'] ?? $_SERVER['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
    $dbName = $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? getenv('DB_NAME') ?: 'worlvjwl_azariahmg';
    $dbUser = $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? getenv('DB_USER') ?: 'worlvjwl_azariahmg-user';
    $dbPass = $_ENV['DB_PASS'] ?? $_SERVER['DB_PASS'] ?? (getenv('DB_PASS') !== false ? getenv('DB_PASS') : 'azariahmg-user$1');

    $pdo = new PDO("mysql:host=$dbHost;port=$dbPort;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 2
    ]);

    if (!empty($slug)) {
        $stmt = $pdo->prepare("
            SELECT id, title, slug, excerpt, content, coverImage, category, author, authorRole, publishedAt 
            FROM blog_posts 
            WHERE slug = ? OR id = ? 
            LIMIT 1
        ");
        $stmt->execute([$slug, is_numeric($slug) ? (int)$slug : 0]);
        $article = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    $settingsStmt = $pdo->query("SELECT `key_name`, `value` FROM `settings` WHERE `key_name` IN ('logo_url', 'site_name')");
    $settings = $settingsStmt->fetchAll(PDO::FETCH_KEY_PAIR);
    if (!empty($settings['logo_url'])) $siteLogoUrl = $settings['logo_url'];
    if (!empty($settings['site_name'])) $siteName = strtoupper($settings['site_name']);
} catch (Throwable $e) {
    // Graceful fallback to default brand card
}

// Canvas Setup: Standard Open Graph Dimensions
$width = 1200;
$height = 630;
$im = imagecreatetruecolor($width, $height);
imagealphablending($im, true);
imagesavealpha($im, true);

// Brand Colors
$colBgDark = imagecolorallocate($im, 11, 19, 43);        // #0B132B
$colNavy   = imagecolorallocate($im, 15, 23, 42);        // #0F172A
$colLime   = imagecolorallocate($im, 132, 204, 22);      // #84CC16 (AMG Green)
$colBlue   = imagecolorallocate($im, 0, 86, 150);        // #005696 (AMG Blue)
$colWhite  = imagecolorallocate($im, 255, 255, 255);
$colGray   = imagecolorallocate($im, 148, 163, 184);     // #94A3B8
$colMuted  = imagecolorallocate($im, 100, 116, 139);     // #64748B

// 1. Fill base canvas
imagefilledrectangle($im, 0, 0, $width, $height, $colBgDark);

// 2. Load Cover Image if available
$hasCover = false;
$coverUrl = $article['coverImage'] ?? '';

if (!empty($coverUrl)) {
    $imgData = null;
    if (preg_match('#^https?://#i', $coverUrl)) {
        $ctx = stream_context_create([
            'http' => [
                'timeout' => 3,
                'user_agent' => 'AzariahBot/1.0'
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ]);
        $imgData = @file_get_contents($coverUrl, false, $ctx);
    } else {
        $localPath = dirname(__DIR__) . '/' . ltrim($coverUrl, '/');
        if (file_exists($localPath)) {
            $imgData = @file_get_contents($localPath);
        }
    }

    if ($imgData) {
        $srcImg = @imagecreatefromstring($imgData);
        if ($srcImg) {
            $srcW = imagesx($srcImg);
            $srcH = imagesy($srcImg);

            // Cover crop math
            $targetRatio = $width / $height;
            $srcRatio = $srcW / $srcH;

            if ($srcRatio > $targetRatio) {
                $cropW = (int)($srcH * $targetRatio);
                $cropH = $srcH;
                $cropX = (int)(($srcW - $cropW) / 2);
                $cropY = 0;
            } else {
                $cropW = $srcW;
                $cropH = (int)($srcW / $targetRatio);
                $cropX = 0;
                $cropY = (int)(($srcH - $cropH) / 2);
            }

            imagecopyresampled($im, $srcImg, 0, 0, $cropX, $cropY, $width, $height, $cropW, $cropH);
            imagedestroy($srcImg);
            $hasCover = true;
        }
    }
}

// 3. Apply Multi-Layer Gradient Overlay for Cinematic Legibility
// Bottom dark gradient
for ($y = 0; $y < $height; $y++) {
    $factor = $y / $height;
    // Top is 40% dark, bottom is 96% dark
    $alpha = (int)(127 - (45 + $factor * 78));
    $alpha = max(0, min(127, $alpha));
    $gradCol = imagecolorallocatealpha($im, 10, 15, 30, 127 - $alpha);
    imageline($im, 0, $y, $width, $y, $gradCol);
}

// Left dark gradient for text readability
for ($x = 0; $x < 800; $x++) {
    $factor = 1.0 - ($x / 800);
    $alpha = (int)($factor * 50);
    $sideGrad = imagecolorallocatealpha($im, 7, 11, 22, 127 - $alpha);
    imageline($im, $x, 0, $x, $height, $sideGrad);
}

// 4. Draw Accent Lines & Border
$accentCol = imagecolorallocatealpha($im, 132, 204, 22, 70);
imagefilledrectangle($im, 0, 0, $width, 5, $colLime); // Top lime strip
imagefilledrectangle($im, 0, $height - 4, $width, $height, $colBlue); // Bottom blue strip

// Fonts
$boldFont = __DIR__ . '/fonts/bold.ttf';
$regFont  = __DIR__ . '/fonts/regular.ttf';
$useTtf = file_exists($boldFont) && function_exists('imagettftext');

// 5. Draw AMG Logo & Watermark (Top Left & Top Right)
// Function to draw official AMG Globe Tiles
function drawAmgGlobe($im, $x, $y, $colBlue, $colLime) {
    // 3 main arcs
    imagefilledrectangle($im, $x, $y + 12, $x + 6, $y + 18, $colBlue);
    imagefilledrectangle($im, $x + 8, $y + 8, $x + 14, $y + 14, $colBlue);
    imagefilledrectangle($im, $x + 16, $y + 5, $x + 22, $y + 11, $colBlue);
    imagefilledrectangle($im, $x + 24, $y + 5, $x + 30, $y + 11, $colLime);
    imagefilledrectangle($im, $x + 32, $y + 8, $x + 38, $y + 14, $colLime);

    imagefilledrectangle($im, $x + 4, $y + 20, $x + 10, $y + 26, $colBlue);
    imagefilledrectangle($im, $x + 12, $y + 18, $x + 18, $y + 24, $colBlue);
    imagefilledrectangle($im, $x + 20, $y + 17, $x + 26, $y + 23, $colBlue);
    imagefilledrectangle($im, $x + 28, $y + 17, $x + 34, $y + 23, $colLime);
    imagefilledrectangle($im, $x + 36, $y + 20, $x + 42, $y + 26, $colLime);

    imagefilledrectangle($im, $x + 8, $y + 28, $x + 14, $y + 34, $colBlue);
    imagefilledrectangle($im, $x + 16, $y + 27, $x + 22, $y + 33, $colBlue);
    imagefilledrectangle($im, $x + 24, $y + 27, $x + 30, $y + 33, $colLime);
    imagefilledrectangle($im, $x + 32, $y + 28, $x + 38, $y + 34, $colLime);

    imagefilledrectangle($im, $x + 12, $y + 36, $x + 18, $y + 42, $colBlue);
    imagefilledrectangle($im, $x + 20, $y + 36, $x + 26, $y + 42, $colLime);
}

// Draw Top Header Watermark Badge
$badgeBg = imagecolorallocatealpha($im, 15, 23, 42, 35);
imagefilledrectangle($im, 50, 40, 480, 105, $badgeBg);
imagerectangle($im, 50, 40, 480, 105, imagecolorallocatealpha($im, 255, 255, 255, 110));

drawAmgGlobe($im, 65, 48, $colBlue, $colLime);

if ($useTtf) {
    imagettftext($im, 16, 0, 125, 72, $colWhite, $boldFont, "AZARIAH");
    imagettftext($im, 16, 0, 218, 72, $colLime, $boldFont, "MANAGEMENT");
    imagettftext($im, 9, 0, 126, 92, $colGray, $regFont, "STRATEGIC INTELLIGENCE & MEDIA");
} else {
    imagestring($im, 5, 125, 55, "AZARIAH MANAGEMENT", $colWhite);
    imagestring($im, 2, 125, 75, "STRATEGIC INTELLIGENCE", $colGray);
}

// 6. Draw Category Badge
$categoryName = strtoupper($article['category'] ?? 'INSIGHTS & EDITORIAL');
$catPillBg = imagecolorallocatealpha($im, 132, 204, 22, 100);
$catPillBorder = $colLime;

if ($useTtf) {
    $catBox = imagettfbbox(12, 0, $boldFont, $categoryName);
    $catW = abs($catBox[4] - $catBox[0]) + 30;
    imagefilledrectangle($im, 50, 140, 50 + $catW, 175, $catPillBg);
    imagerectangle($im, 50, 140, 50 + $catW, 175, $catPillBorder);
    imagettftext($im, 11, 0, 65, 164, $colLime, $boldFont, $categoryName);
} else {
    imagefilledrectangle($im, 50, 140, 260, 175, $catPillBg);
    imagestring($im, 4, 65, 148, $categoryName, $colLime);
}

// 7. Draw Article Title (Wrapped neatly)
$titleText = $article['title'] ?? 'Strategic Intelligence & Global Industry Leadership';

function wordWrapTtf($fontSize, $angle, $fontFile, $text, $maxWidth) {
    $words = explode(' ', $text);
    $lines = [];
    $currentLine = '';

    foreach ($words as $word) {
        $testLine = $currentLine === '' ? $word : $currentLine . ' ' . $word;
        $box = imagettfbbox($fontSize, $angle, $fontFile, $testLine);
        $testW = abs($box[4] - $box[0]);
        if ($testW > $maxWidth && $currentLine !== '') {
            $lines[] = $currentLine;
            $currentLine = $word;
        } else {
            $currentLine = $testLine;
        }
    }
    if ($currentLine !== '') {
        $lines[] = $currentLine;
    }
    return $lines;
}

$titleY = 240;
if ($useTtf) {
    $titleLines = wordWrapTtf(28, 0, $boldFont, $titleText, 1050);
    // Cap at 3 lines
    $titleLines = array_slice($titleLines, 0, 3);
    foreach ($titleLines as $idx => $line) {
        // Shadow for depth
        imagettftext($im, 28, 0, 52, $titleY + 2 + ($idx * 52), imagecolorallocatealpha($im, 0, 0, 0, 50), $boldFont, $line);
        imagettftext($im, 28, 0, 50, $titleY + ($idx * 52), $colWhite, $boldFont, $line);
    }
    $lastTitleY = $titleY + (count($titleLines) * 52);
} else {
    imagestring($im, 5, 50, $titleY, substr($titleText, 0, 65), $colWhite);
    $lastTitleY = $titleY + 50;
}

// 8. Draw Excerpt / Summary
$excerptText = $article['excerpt'] ?? '';
if (empty($excerptText) && !empty($article['content'])) {
    $plain = strip_tags($article['content']);
    $excerptText = mb_substr($plain, 0, 160) . '...';
}

if (!empty($excerptText) && $useTtf) {
    $excerptLines = wordWrapTtf(14, 0, $regFont, $excerptText, 950);
    $excerptLines = array_slice($excerptLines, 0, 2);
    $excerptY = $lastTitleY + 15;
    foreach ($excerptLines as $i => $line) {
        imagettftext($im, 14, 0, 50, $excerptY + ($i * 28), $colGray, $regFont, $line);
    }
}

// 9. Bottom Watermark Bar: Logo Watermark + Official Verification Stamp
$footerY = 560;

// Watermark Pill (Bottom Right)
$stampBg = imagecolorallocatealpha($im, 15, 23, 42, 20);
imagefilledrectangle($im, 780, 545, 1150, 595, $stampBg);
imagerectangle($im, 780, 545, 1150, 595, imagecolorallocatealpha($im, 132, 204, 22, 90));

drawAmgGlobe($im, 795, 550, $colBlue, $colLime);

if ($useTtf) {
    imagettftext($im, 11, 0, 850, 570, $colWhite, $boldFont, "AZARIAH MANAGEMENT GROUP");
    imagettftext($im, 10, 0, 850, 587, $colLime, $regFont, "azariahmg.com • Official Editorial");

    // Author byline on left
    $authorName = $article['author'] ?? 'Azariah Editorial Team';
    $authorRole = $article['authorRole'] ?? 'Strategic Intelligence';
    imagettftext($im, 12, 0, 50, 570, $colWhite, $boldFont, "By " . $authorName);
    imagettftext($im, 10, 0, 50, 588, $colMuted, $regFont, $authorRole . " • Azariah Management Group");
} else {
    imagestring($im, 3, 850, 555, "AZARIAH MANAGEMENT GROUP", $colWhite);
    imagestring($im, 2, 850, 572, "azariahmg.com", $colLime);
    imagestring($im, 3, 50, 565, "By " . ($article['author'] ?? 'Azariah Editorial Team'), $colWhite);
}

// 10. Output & Cache
header("Content-Type: image/jpeg");
header("Cache-Control: public, max-age=86400, s-maxage=86400");
header("X-Content-Type-Options: nosniff");

imagejpeg($im, null, 90);
imagedestroy($im);
exit(0);
