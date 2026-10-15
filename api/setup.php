<?php
/**
 * Database Auto-Installer and Seed Script for Azariah Management Group (PHP Backend)
 * Runs automatically if tables are missing, or can be run via CLI / browser.
 */
require_once __DIR__ . '/db.php';
setCorsHeaders();

$pdo = getDbConnection();

try {
    // 1. Create admin_users table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `admin_users` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `username` VARCHAR(191) NOT NULL,
            `email` VARCHAR(191) NOT NULL,
            `passwordHash` VARCHAR(191) NOT NULL,
            `name` VARCHAR(191) NULL,
            `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
            `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
            PRIMARY KEY (`id`),
            UNIQUE KEY `admin_users_username_key` (`username`),
            UNIQUE KEY `admin_users_email_key` (`email`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 2. Create site_settings table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `site_settings` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `key` VARCHAR(191) NOT NULL,
            `value` LONGTEXT NOT NULL,
            `type` VARCHAR(191) NOT NULL DEFAULT 'text',
            `description` VARCHAR(191) NULL,
            `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
            PRIMARY KEY (`id`),
            UNIQUE KEY `site_settings_key_key` (`key`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 3. Create section_contents table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `section_contents` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `sectionKey` VARCHAR(191) NOT NULL,
            `badge` TEXT NULL,
            `title` TEXT NULL,
            `subtitle` TEXT NULL,
            `content` LONGTEXT NULL,
            `ctaText` TEXT NULL,
            `ctaLink` TEXT NULL,
            `mediaUrl` TEXT NULL,
            `data` LONGTEXT NULL,
            `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
            PRIMARY KEY (`id`),
            UNIQUE KEY `section_contents_sectionKey_key` (`sectionKey`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 4. Create uploaded_media table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `uploaded_media` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `filename` VARCHAR(191) NOT NULL,
            `originalName` VARCHAR(191) NOT NULL,
            `mimeType` VARCHAR(191) NOT NULL,
            `size` INT NOT NULL,
            `url` VARCHAR(191) NOT NULL,
            `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 5. Create admin_otps table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `admin_otps` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `userId` INT NOT NULL,
            `otpCode` VARCHAR(10) NOT NULL,
            `deviceToken` VARCHAR(128) NOT NULL,
            `ipAddress` VARCHAR(64) NULL,
            `userAgent` TEXT NULL,
            `expiresAt` DATETIME NOT NULL,
            `used` TINYINT(1) NOT NULL DEFAULT 0,
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            INDEX `idx_otp_verify` (`userId`, `otpCode`, `deviceToken`, `used`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 6. Create admin_devices table (trusted devices with 7-day expiration)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `admin_devices` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `userId` INT NOT NULL,
            `deviceToken` VARCHAR(128) NOT NULL,
            `deviceName` VARCHAR(255) NULL,
            `ipAddress` VARCHAR(64) NULL,
            `userAgent` TEXT NULL,
            `trustedUntil` DATETIME NOT NULL,
            `lastLoginAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `idx_user_device` (`userId`, `deviceToken`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 5. Seed / Update Admin User with credentials
    $targetEmail = 'info@azariahmg.com';
    $passwordHash = password_hash('Admin@webmaster$1', PASSWORD_BCRYPT);

    $checkAdmin = $pdo->prepare("SELECT id FROM admin_users WHERE email = ? OR username = ? OR username = 'admin' LIMIT 1");
    $checkAdmin->execute([$targetEmail, $targetEmail]);
    $existingAdmin = $checkAdmin->fetch();

    if ($existingAdmin) {
        $updateAdmin = $pdo->prepare("
            UPDATE admin_users 
            SET username = :u, email = :e, passwordHash = :p, name = 'Azariah Administrator'
            WHERE id = :id
        ");
        $updateAdmin->execute([
            ':u' => $targetEmail,
            ':e' => $targetEmail,
            ':p' => $passwordHash,
            ':id' => $existingAdmin['id'],
        ]);
        $adminStatus = "Admin credentials updated for $targetEmail";
    } else {
        $insertAdmin = $pdo->prepare("
            INSERT INTO admin_users (`username`, `email`, `passwordHash`, `name`)
            VALUES (:u, :e, :p, 'Azariah Administrator')
        ");
        $insertAdmin->execute([
            ':u' => $targetEmail,
            ':e' => $targetEmail,
            ':p' => $passwordHash,
        ]);
        $adminStatus = "Admin created with $targetEmail";
    }

    // 6. Seed Site Settings if missing
    $defaultSettings = [
        ['logo_url', '', 'image', 'Website Logo Image'],
        ['logo_text', 'Azariah', 'text', 'Primary Logo Brand Text'],
        ['logo_subtext', 'MANAGEMENT GROUP', 'text', 'Secondary Brand Subtext'],
        ['site_name', 'Azariah Management Group', 'text', 'Organization Name'],
        ['tagline', 'Strategic Intelligence & Media Impact', 'text', 'Brand Tagline'],
        ['contact_email', 'info@azariahmg.com', 'text', 'Contact Email'],
        ['contact_phone', '240-813-0308', 'text', 'Contact Phone'],
        ['contact_address', 'Upper Marlboro, MD, 20772 USA', 'text', 'Headquarters Location'],
        ['office_hours', 'Mon - Fri, 9:00 AM - 5:00 PM EST', 'text', 'Office Hours'],
    ];

    $settingStmt = $pdo->prepare("
        INSERT IGNORE INTO site_settings (`key`, `value`, `type`, `description`, `updatedAt`)
        VALUES (?, ?, ?, ?, NOW())
    ");
    foreach ($defaultSettings as $s) {
        $settingStmt->execute($s);
    }

    // 7. Seed Default Section Contents if missing
    $defaultSections = [
        // --- 1. LANDING PAGE SECTIONS ---
        [
            'hero',
            'AZARIAH MANAGEMENT GROUP',
            'Azariah.',
            'Management Group',
            'We deliver high-performance consulting and media solutions for organizations that demand excellence and impact.',
            'Start Your Journey',
            '#contact',
            '',
            json_encode([
                'slides' => [
                    [
                        'video' => 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27db08e124845114704b2d352332f1f50a80d2a&profile_id=164&oauth2_token_id=57447761',
                        'poster' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069',
                        'title' => 'Azariah.',
                        'subtitle' => 'Management Group',
                        'description' => 'We deliver high-performance consulting and media solutions for organizations that demand excellence and impact.',
                        'alt' => 'Corporate team working in modern office space'
                    ],
                    [
                        'video' => 'https://player.vimeo.com/external/371433917.sd.mp4?s=694406a461b40213032d8478418f430635489814&profile_id=164&oauth2_token_id=57447761',
                        'title' => 'Impact Driven.',
                        'poster' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070',
                        'subtitle' => 'Future-Ready Systems',
                        'description' => 'Integrating advanced technology and creative storytelling to maximize your reach and results.',
                        'alt' => 'Global digital connectivity network visualization'
                    ],
                    [
                        'video' => 'https://player.vimeo.com/external/403810419.sd.mp4?s=e52f5979f046e8c89c8a071c33f274a7b7a42142&profile_id=164&oauth2_token_id=57447761',
                        'title' => 'Global Scale.',
                        'poster' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070',
                        'subtitle' => 'Strategic Excellence',
                        'description' => 'Azariah Management Group partners with visionaries to transform complex challenges into scalable opportunities.',
                        'alt' => 'Modern workspace collaboration'
                    ]
                ]
            ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
        ],
        [
            'philosophy',
            'CORE PHILOSOPHY',
            'AZARIAH MANAGEMENT GROUP.',
            'The Quadruple Helix Framework',
            'Strategy should be purposeful, innovation should be responsible, and growth should create lasting value.',
            'Learn More About Our Philosophy',
            '#about-page',
            '',
            json_encode([
                'paragraph1' => 'We partner with visionaries to transform ideas into scalable impact. At Azariah Management Group, we bridge the gap between business intelligence and human-centered design.',
                'paragraph2' => 'Our core is rooted in integrity. We ensure every solution strengthens systems, empowers talent, and builds sustainable global futures for our clients.'
            ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
        ],
        [
            'brand_spotlight',
            'Brand Spotlight',
            'Strategic Storytelling.',
            'Cinematic Impact & Narrative Vision',
            'Experience how Azariah Management Group crafts compelling brand narratives that inspire trust, shape public perception, and amplify global influence.',
            'Watch Complete Reel',
            'https://www.youtube.com/watch?v=liPxM5UGeec',
            'https://www.youtube.com/embed/liPxM5UGeec?autoplay=1&mute=1&loop=1&playlist=liPxM5UGeec&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0',
            null
        ],
        [
            'partners_section',
            'Trusted Alliances',
            'Trusted Partners & Clients',
            'Collaborating with industry pioneers, philanthropic foundations, and disruptive technology ventures',
            'Azariah Management Group maintains strategic alliances with global institutions, government bodies, and enterprise innovators across North America, Europe, and Africa.',
            'View All Global Partners',
            '#partners-page',
            '',
            null
        ],
        [
            'services',
            'Our Core Capabilities',
            'What We Do',
            'Delivering excellence across critical growth pillars',
            'This integrated model helps your organization grow with clarity, capacity, and purpose through a multi-faceted approach encompassing business advisory, media production, and digital systems.',
            'Explore Our Full Service Suite',
            '#services-page',
            '',
            null
        ],
        [
            'about',
            'Strategic Identity',
            'Global Strategic Enterprise.',
            'Catalyzing Cross-Continental Growth & Innovation',
            'Azariah Management Group (AMG) is a global strategic consulting, technology innovation, and media enterprise providing international business advisory and cross border growth solutions. Headquartered in the United States and serving clients across the U.S., United Kingdom, Africa, and global diaspora markets, AMG supports entrepreneurs, startups, nonprofits, and institutions in building scalable, compliant, and impact driven organizations.',
            'Read The Complete Strategic Narrative',
            '#about-page',
            '',
            json_encode([
                'secondaryContent' => 'We operate at the intersection of strategy, technology, storytelling, and community development — delivering integrated solutions for modern global enterprises. Our expertise in diaspora markets and multicultural business environments allows us to bridge international opportunities with U.S. based infrastructure.',
                'locations' => ['USA', 'UK', 'Pan Africa', 'Global Diaspora']
            ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
        ],
        [
            'programs_section',
            'Signature Ventures',
            'Innovation & Storytelling',
            'High-impact platforms and proprietary accelerator initiatives',
            'We don\'t just consult; we build. Explore our ecosystem of high-impact platforms, community blueprints, and developmental fellowships designed for scalable social and economic outcomes.',
            'Book Discovery Call',
            '#contact',
            '',
            null
        ],
        [
            'strategic_ai',
            'Technology Division',
            'Ethical AI & Scalable Digital Intelligence.',
            'Bridging Enterprise Innovation and Human Values',
            'We empower organizations with tailored AI readiness strategies, automated intelligent workflows, and ethical digital governance to unlock exponential productivity while safeguarding human dignity.',
            'Discover AI Solutions',
            '#contact',
            '',
            null
        ],
        [
            'creaitube_section',
            'Creator Economy & Digital Media',
            'CreAItube Monetization Ecosystem',
            'Transform Your Vision Into Sustainable Digital Equity',
            'A creator-first digital media and podcast distribution hub where independent voices, storytellers, and thought leaders monetize their audience with industry-leading RPM rates.',
            'Create Your CreAItor Account',
            '#creaitube-page',
            '',
            null
        ],
        [
            'podore_section',
            'A Global Digital Ecosystem',
            'Create Your PodOre Account.',
            'Join World AI Force & Shape Tomorrow',
            'PodOre is a collaborative community platform where innovators, technologists, and entrepreneurs converge to collaborate on generative AI applications and venture scaling.',
            'Launch PodOre Portal',
            'https://worldaiforce.org/',
            '',
            null
        ],
        [
            'careers_section',
            'Career & Growth',
            'Pathways to Excellence',
            'Where Exceptional Talent Meets Transformative Opportunities',
            'Join the Azariah Management mission. We build ecosystems where talent meets opportunity, leadership is cultivated through mentorship, and strategic capacity drives global change.',
            'Explore Career Pathways',
            '#mentorship-page',
            '',
            null
        ],
        [
            'contact',
            'Get In Touch',
            'Strategic Inquiry',
            'Direct transmission to info@azariahmg.com',
            'Reach out directly to schedule a confidential strategic consultation, explore enterprise partnerships, or commission tailored advisory engagements.',
            'Submit Strategic Inquiry',
            '#contact',
            '',
            null
        ],

        // --- 2. HEADER & FOOTER CONFIGURATIONS ---
        [
            'header',
            'AZARIAH MANAGEMENT GROUP',
            'Global Strategic Intelligence',
            'Header & Navigation Menu',
            'Global navigation configuration for Azariah Management Group website.',
            'Work With Us',
            '#contact',
            '',
            json_encode([
                'topNotice' => 'Official Enterprise Portal • Strategic Intelligence & Global Media Impact',
                'navCtaText' => 'Work With Us',
                'navCtaLink' => '#contact'
            ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
        ],
        [
            'footer',
            'AMG GLOBAL CORP',
            'Azariah Management Group',
            'Global Strategic Intelligence & Media Enterprise',
            'AZARIAH MANAGEMENT GROUP: Delivering transformative strategy, ethical AI systems, and high-impact media production for modern institutions and forward-looking enterprises worldwide.',
            'Schedule Consultation',
            '#contact',
            '',
            json_encode([
                'copyright' => '© ' . date('Y') . ' AZARIAH MANAGEMENT GROUP. BUILT FOR SCALE.',
                'tagline' => 'Strategic Intelligence • Ethical Innovation • Media Impact',
                'badge' => 'Verified Enterprise Architecture'
            ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
        ],

        // --- 3. DEDICATED STANDALONE PAGES ---
        [
            'services_page',
            'Comprehensive Practice Areas',
            'Strategic Services & Enterprise Solutions',
            'Integrated Advisory, Technology Deployment, and Cinematic Storytelling',
            'Our multidisciplinary advisory model provides full lifecycle support for international business expansion, philanthropic community program architecture, and intelligent workflow automation.',
            'Request Capability Statement',
            '#contact',
            '',
            null
        ],
        [
            'about_page',
            'Corporate Governance & Heritage',
            'About Azariah Management Group',
            'Catalyzing Sustainable Global Transformation',
            'Azariah Management Group is built upon the Quadruple Helix innovation model, harmonizing private enterprise, academia, government policy, and grassroots communities to solve complex multi-jurisdictional challenges.',
            'Connect With Our Leadership',
            '#contact',
            '',
            null
        ],
        [
            'programs_page',
            'Signature Frameworks',
            'Programs & Global Initiatives',
            'Action-Oriented Platforms Delivering Quantifiable Outcomes',
            'From the Community Impact Blueprint™ to cross-border accelerator programs, AMG designs institutional frameworks that convert social responsibility goals into high-visibility measurable realities.',
            'Download Impact Framework',
            '#contact',
            '',
            null
        ],
        [
            'mentorship_page',
            'Leadership Development',
            'Executive Mentorship Program',
            'Empowering Next-Generation Visionaries & Global Change-Makers',
            'A rigorous 1-on-1 and cohort-based mentorship initiative connecting emerging leaders with proven executives across strategic consulting, media production, and digital technologies.',
            'Submit Mentorship Application',
            '#contact',
            '',
            null
        ],
        [
            'studio_page',
            'Cinematic Production Division',
            'Studio AMG Media & Entertainment',
            'Award-Winning Visual Storytelling, Podcasts & Documentary Journalism',
            'Studio AMG is the creative powerhouse of Azariah Management Group, developing compelling visual narratives, corporate brand anthems, and multi-platform digital broadcasts that move audiences to action.',
            'Commission Production',
            '#contact',
            '',
            null
        ],
        [
            'news_page',
            'Intellectual Capital',
            'News & Strategic Insights',
            'Briefings, Thought Leadership & Press Releases',
            'Stay informed with analysis from AMG partners on international market dynamics, regulatory compliance, generative AI governance, and creator economy trends.',
            'Subscribe to Briefings',
            '#contact',
            '',
            null
        ],
        [
            'products_page',
            'Digital Ecosystems',
            'Digital Products & Frameworks',
            'Proprietary Software Systems, Toolkits & Blueprints',
            'Explore our suite of enterprise software platforms, strategic toolkits, and structured operational blueprints engineered for immediate deployment.',
            'Request Product Demo',
            '#contact',
            '',
            null
        ],
        [
            'portfolio_page',
            'Client Case Studies',
            'Strategic Engagement Portfolio',
            'Proven Track Record Across Enterprise & Social Sectors',
            'Review our documented client outcomes, cross-border venture expansions, and large-scale media campaigns executed with uncompromising precision.',
            'Discuss Your Project Scope',
            '#contact',
            '',
            null
        ],
        [
            'partners_page',
            'Institutional Network',
            'Strategic Partners & Global Alliances',
            'Collaborating with Industry Pioneers & Academic Institutions',
            'Our alliance ecosystem spans premier financial institutions, technology leaders, media syndicates, and international trade organizations.',
            'Explore Alliance Opportunities',
            '#contact',
            '',
            null
        ],
        [
            'catalog_page',
            'Executive Solutions Suite',
            'AMG Solutions & Services Catalog',
            'A Comprehensive Guide to Consulting Modules and Technology Packages',
            'Detailed specifications, deliverables, and implementation timelines for AMG strategic services, media production packages, and corporate advisory retainers.',
            'Download Full Catalog PDF',
            '#contact',
            '',
            null
        ],
        [
            'wallfeel_page',
            'Luxury Interior Systems',
            'Wallfeel Architectural Decor',
            'Bespoke Acoustic Wall Panels, Luxury Textures & Interior Art',
            'Wallfeel combines acoustic engineering with haute interior aesthetics, transforming corporate boardrooms, creative studios, and luxury residences into sensory masterpieces.',
            'Explore Wallfeel Gallery',
            '#wallfeel-catalog-page',
            '',
            null
        ],
        [
            'wallfeel_catalog_page',
            'Artisan Finishes',
            'Wallfeel Collection Catalog',
            'Curated Acoustic Sculptures & Custom Architectural Installations',
            'Browse our premier collection of sound-absorbing acoustic art, sustainable wooden textures, and bespoke wall installations tailored for commercial and residential environments.',
            'Request Material Samples',
            '#contact',
            '',
            null
        ],
        [
            'creaitube_page',
            'Media Platform',
            'CreAItube Creator Hub',
            'The Next-Generation Digital Media & Video Production Studio',
            'Empowering podcasters, filmmakers, and digital storytellers with decentralized monetization, AI-assisted video editing, and global audience distribution.',
            'Access CreAItube Studio',
            '#contact',
            '',
            null
        ],
        [
            'terms_page',
            'Legal Standards & Compliance',
            'Terms & Conditions of Service',
            'Corporate Governance and Client Engagement Framework',
            'Official legal terms, service-level agreements, intellectual property covenants, and engagement standards governing all Azariah Management Group business interactions.',
            'Contact Legal Counsel',
            'mailto:info@azariahmg.com',
            '',
            null
        ],
        [
            'privacy_page',
            'Data Protection & Security',
            'Global Privacy Policy',
            'Commitment to Data Privacy, Security, and Ethical Governance',
            'How Azariah Management Group collects, safeguards, and processes institutional and individual information in strict compliance with GDPR, CCPA, and global data privacy regulations.',
            'Privacy Office Inquiries',
            'mailto:info@azariahmg.com',
            '',
            null
        ]
    ];

    $sectionStmt = $pdo->prepare("
        INSERT INTO section_contents (`sectionKey`, `badge`, `title`, `subtitle`, `content`, `ctaText`, `ctaLink`, `mediaUrl`, `data`, `updatedAt`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
            `badge` = COALESCE(NULLIF(VALUES(`badge`), ''), `badge`),
            `title` = COALESCE(NULLIF(VALUES(`title`), ''), `title`),
            `subtitle` = COALESCE(NULLIF(VALUES(`subtitle`), ''), `subtitle`),
            `content` = COALESCE(NULLIF(VALUES(`content`), ''), `content`),
            `ctaText` = COALESCE(NULLIF(VALUES(`ctaText`), ''), `ctaText`),
            `ctaLink` = COALESCE(NULLIF(VALUES(`ctaLink`), ''), `ctaLink`),
            `mediaUrl` = COALESCE(NULLIF(VALUES(`mediaUrl`), ''), `mediaUrl`),
            `data` = COALESCE(VALUES(`data`), `data`)
    ");
    foreach ($defaultSections as $sec) {
        $sectionStmt->execute($sec);
    }

    sendJson([
        'success' => true,
        'message' => 'PHP Backend Database Setup & Schema verification completed successfully',
        'admin_status' => $adminStatus,
        'tables' => ['admin_users', 'site_settings', 'section_contents', 'uploaded_media', 'admin_otps', 'admin_devices'],
    ]);

} catch (Exception $e) {
    sendJson([
        'success' => false,
        'error' => 'Setup failed: ' . $e->getMessage()
    ], 500);
}
