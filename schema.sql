-- ==============================================================================
-- Azariah Management Group - Production Database Schema & Migration
-- Target Engine: MySQL 8.0+ / MariaDB 10.3+
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ==============================================================================
-- INSTRUCTIONS FOR CPANEL / PHPMYADMIN:
-- 1. Log in to cPanel -> Databases -> phpMyAdmin
-- 2. Select your production database (e.g. worlvjwl_azariah or your designated DB)
-- 3. Click the "Import" or "SQL" tab
-- 4. Paste or upload this file and click "Go"
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. Table: admin_users
-- Stores administrative user credentials and profile details.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NULL DEFAULT 'Administrator',
  `role` VARCHAR(64) NOT NULL DEFAULT 'admin',
  `roleTitle` VARCHAR(191) NOT NULL DEFAULT 'Managing Executive',
  `workflowRole` VARCHAR(64) NOT NULL DEFAULT 'approver',
  `department` VARCHAR(128) NULL DEFAULT 'Executive Management',
  `phone` VARCHAR(64) NULL,
  `permissions` LONGTEXT NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `lastLoginAt` DATETIME NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_users_username_key` (`username`),
  UNIQUE KEY `admin_users_email_key` (`email`),
  INDEX `idx_admin_workflow` (`workflowRole`),
  INDEX `idx_admin_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Table: site_settings
-- Global brand text, logos, contact info, and system configuration.
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 3. Table: section_contents
-- Dynamic content for all website sections, headers, footers, and standalone pages.
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 4. Table: uploaded_media
-- Media library catalog for images, logos, banners, and documents.
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 5. Table: admin_otps
-- One-time passwords for recognized device authentication and 7-day revalidation.
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 6. Table: admin_devices
-- Trusted devices tracking with 7-day session validity.
-- ------------------------------------------------------------------------------
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

-- ==============================================================================
-- DEFAULT SEED DATA
-- ==============================================================================

-- 1. Default Super Administrator Account
-- Username / Email: info@azariahmg.com
-- Initial Password:  Admin@webmaster$1
INSERT INTO `admin_users` (`username`, `email`, `passwordHash`, `name`, `createdAt`, `updatedAt`)
VALUES (
  'info@azariahmg.com',
  'info@azariahmg.com',
  '$2y$10$w02.J5L0E5q6H9e9M1dE..08QoK.034iXgV65zJtN7w3d2L.eQv0O', -- bcrypt hash for Admin@webmaster$1
  'Azariah Administrator',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`);

-- 2. Default Site Settings
INSERT INTO `site_settings` (`key`, `value`, `type`, `description`, `updatedAt`)
VALUES
  ('logo_url', '', 'image', 'Website Logo Image', NOW(3)),
  ('logo_text', 'Azariah', 'text', 'Primary Logo Brand Text', NOW(3)),
  ('logo_subtext', 'MANAGEMENT GROUP', 'text', 'Secondary Brand Subtext', NOW(3)),
  ('site_name', 'Azariah Management Group', 'text', 'Organization Name', NOW(3)),
  ('tagline', 'Strategic Intelligence & Media Impact', 'text', 'Brand Tagline', NOW(3)),
  ('contact_email', 'info@azariahmg.com', 'text', 'Contact Email', NOW(3)),
  ('contact_phone', '240-813-0308', 'text', 'Contact Phone', NOW(3)),
  ('contact_address', 'Upper Marlboro, MD, 20772 USA', 'text', 'Headquarters Location', NOW(3)),
  ('office_hours', 'Mon - Fri, 9:00 AM - 5:00 PM EST', 'text', 'Office Hours', NOW(3))
ON DUPLICATE KEY UPDATE
  `description` = VALUES(`description`);

-- 3. Default Section Contents (Landing Page, Headers, Footers, Standalone Pages)
INSERT INTO `section_contents` (`sectionKey`, `badge`, `title`, `subtitle`, `content`, `ctaText`, `ctaLink`, `mediaUrl`, `data`, `updatedAt`)
VALUES
  (
    'hero',
    'AZARIAH MANAGEMENT GROUP',
    'Azariah.',
    'Management Group',
    'We deliver high-performance consulting and media solutions for organizations that demand excellence and impact.',
    'Start Your Journey',
    '#contact',
    '',
    '{"slides":[{"video":"https://player.vimeo.com/external/434045526.sd.mp4?s=c27db08e124845114704b2d352332f1f50a80d2a&profile_id=164&oauth2_token_id=57447761","poster":"https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069","title":"Azariah.","subtitle":"Management Group","description":"We deliver high-performance consulting and media solutions for organizations that demand excellence and impact.","alt":"Corporate team working in modern office space"},{"video":"https://player.vimeo.com/external/371433917.sd.mp4?s=694406a461b40213032d8478418f430635489814&profile_id=164&oauth2_token_id=57447761","title":"Impact Driven.","poster":"https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070","subtitle":"Future-Ready Systems","description":"Integrating advanced technology and creative storytelling to maximize your reach and results.","alt":"Global digital connectivity network visualization"},{"video":"https://player.vimeo.com/external/403810419.sd.mp4?s=e52f5979f046e8c89c8a071c33f274a7b7a42142&profile_id=164&oauth2_token_id=57447761","title":"Global Scale.","poster":"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070","subtitle":"Strategic Excellence","description":"Azariah Management Group partners with visionaries to transform complex challenges into scalable opportunities.","alt":"Modern workspace collaboration"}]}',
    NOW(3)
  ),
  (
    'philosophy',
    'CORE PHILOSOPHY',
    'AZARIAH MANAGEMENT GROUP.',
    'The Quadruple Helix Framework',
    'Strategy should be purposeful, innovation should be responsible, and growth should create lasting value.',
    'Learn More About Our Philosophy',
    '#about-page',
    '',
    '{"paragraph1":"We partner with visionaries to transform ideas into scalable impact. At Azariah Management Group, we bridge the gap between business intelligence and human-centered design.","paragraph2":"Our core is rooted in integrity. We ensure every solution strengthens systems, empowers talent, and builds sustainable global futures for our clients."}',
    NOW(3)
  ),
  (
    'brand_spotlight',
    'Brand Spotlight',
    'Strategic Storytelling.',
    'Cinematic Impact & Narrative Vision',
    'Experience how Azariah Management Group crafts compelling brand narratives that inspire trust, shape public perception, and amplify global influence.',
    'Watch Complete Reel',
    'https://www.youtube.com/watch?v=liPxM5UGeec',
    'https://www.youtube.com/embed/liPxM5UGeec?autoplay=1&mute=1&loop=1&playlist=liPxM5UGeec&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0',
    NULL,
    NOW(3)
  ),
  (
    'partners_section',
    'Trusted Alliances',
    'Trusted Partners & Clients',
    'Collaborating with industry pioneers, philanthropic foundations, and disruptive technology ventures',
    'Azariah Management Group maintains strategic alliances with global institutions, government bodies, and enterprise innovators across North America, Europe, and Africa.',
    'View All Global Partners',
    '#partners-page',
    '',
    NULL,
    NOW(3)
  ),
  (
    'services',
    'Our Core Capabilities',
    'What We Do',
    'Delivering excellence across critical growth pillars',
    'This integrated model helps your organization grow with clarity, capacity, and purpose through a multi-faceted approach encompassing business advisory, media production, and digital systems.',
    'Explore Our Full Service Suite',
    '#services-page',
    '',
    NULL,
    NOW(3)
  ),
  (
    'about',
    'Strategic Identity',
    'Global Strategic Enterprise.',
    'Catalyzing Cross-Continental Growth & Innovation',
    'Azariah Management Group (AMG) is a global strategic consulting, technology innovation, and media enterprise providing international business advisory and cross border growth solutions. Headquartered in the United States and serving clients across the U.S., United Kingdom, Africa, and global diaspora markets, AMG supports entrepreneurs, startups, nonprofits, and institutions in building scalable, compliant, and impact driven organizations.',
    'Read The Complete Strategic Narrative',
    '#about-page',
    '',
    '{"secondaryContent":"We operate at the intersection of strategy, technology, storytelling, and community development — delivering integrated solutions for modern global enterprises. Our expertise in diaspora markets and multicultural business environments allows us to bridge international opportunities with U.S. based infrastructure.","locations":["USA","UK","Pan Africa","Global Diaspora"]}',
    NOW(3)
  ),
  (
    'programs_section',
    'Signature Ventures',
    'Innovation & Storytelling',
    'High-impact platforms and proprietary accelerator initiatives',
    'We don\'t just consult; we build. Explore our ecosystem of high-impact platforms, community blueprints, and developmental fellowships designed for scalable social and economic outcomes.',
    'Book Discovery Call',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'strategic_ai',
    'Technology Division',
    'Ethical AI & Scalable Digital Intelligence.',
    'Bridging Enterprise Innovation and Human Values',
    'We empower organizations with tailored AI readiness strategies, automated intelligent workflows, and ethical digital governance to unlock exponential productivity while safeguarding human dignity.',
    'Discover AI Solutions',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'creaitube_section',
    'Creator Economy & Digital Media',
    'CreAItube Monetization Ecosystem',
    'Transform Your Vision Into Sustainable Digital Equity',
    'A creator-first digital media and podcast distribution hub where independent voices, storytellers, and thought leaders monetize their audience with industry-leading RPM rates.',
    'Create Your CreAItor Account',
    '#creaitube-page',
    '',
    NULL,
    NOW(3)
  ),
  (
    'podore_section',
    'A Global Digital Ecosystem',
    'Create Your PodOre Account.',
    'Join World AI Force & Shape Tomorrow',
    'PodOre is a collaborative community platform where innovators, technologists, and entrepreneurs converge to collaborate on generative AI applications and venture scaling.',
    'Launch PodOre Portal',
    'https://worldaiforce.org/',
    '',
    NULL,
    NOW(3)
  ),
  (
    'careers_section',
    'Career & Growth',
    'Pathways to Excellence',
    'Where Exceptional Talent Meets Transformative Opportunities',
    'Join the Azariah Management mission. We build ecosystems where talent meets opportunity, leadership is cultivated through mentorship, and strategic capacity drives global change.',
    'Explore Career Pathways',
    '#mentorship-page',
    '',
    NULL,
    NOW(3)
  ),
  (
    'contact',
    'Get In Touch',
    'Strategic Inquiry',
    'Direct transmission to info@azariahmg.com',
    'Reach out directly to schedule a confidential strategic consultation, explore enterprise partnerships, or commission tailored advisory engagements.',
    'Submit Strategic Inquiry',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'header',
    'AZARIAH MANAGEMENT GROUP',
    'Global Strategic Intelligence',
    'Header & Navigation Menu',
    'Global navigation configuration for Azariah Management Group website.',
    'Work With Us',
    '#contact',
    '',
    '{"topNotice":"Official Enterprise Portal • Strategic Intelligence & Global Media Impact","navCtaText":"Work With Us","navCtaLink":"#contact"}',
    NOW(3)
  ),
  (
    'footer',
    'AMG GLOBAL CORP',
    'Azariah Management Group',
    'Global Strategic Intelligence & Media Enterprise',
    'AZARIAH MANAGEMENT GROUP: Delivering transformative strategy, ethical AI systems, and high-impact media production for modern institutions and forward-looking enterprises worldwide.',
    'Schedule Consultation',
    '#contact',
    '',
    '{"copyright":"© 2026 AZARIAH MANAGEMENT GROUP. BUILT FOR SCALE.","tagline":"Strategic Intelligence • Ethical Innovation • Media Impact","badge":"Verified Enterprise Architecture"}',
    NOW(3)
  ),
  (
    'services_page',
    'Comprehensive Practice Areas',
    'Strategic Services & Enterprise Solutions',
    'Integrated Advisory, Technology Deployment, and Cinematic Storytelling',
    'Our multidisciplinary advisory model provides full lifecycle support for international business expansion, philanthropic community program architecture, and intelligent workflow automation.',
    'Request Capability Statement',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'about_page',
    'Corporate Governance & Heritage',
    'About Azariah Management Group',
    'Catalyzing Sustainable Global Transformation',
    'Azariah Management Group is built upon the Quadruple Helix innovation model, harmonizing private enterprise, academia, government policy, and grassroots communities to solve complex multi-jurisdictional challenges.',
    'Connect With Our Leadership',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'programs_page',
    'Signature Frameworks',
    'Programs & Global Initiatives',
    'Action-Oriented Platforms Delivering Quantifiable Outcomes',
    'From the Community Impact Blueprint™ to cross-border accelerator programs, AMG designs institutional frameworks that convert social responsibility goals into high-visibility measurable realities.',
    'Download Impact Framework',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'mentorship_page',
    'Leadership Development',
    'Executive Mentorship Program',
    'Empowering Next-Generation Visionaries & Global Change-Makers',
    'A rigorous 1-on-1 and cohort-based mentorship initiative connecting emerging leaders with proven executives across strategic consulting, media production, and digital technologies.',
    'Submit Mentorship Application',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'studio_page',
    'Cinematic Production Division',
    'Studio AMG Media & Entertainment',
    'Award-Winning Visual Storytelling, Podcasts & Documentary Journalism',
    'Studio AMG is the creative powerhouse of Azariah Management Group, developing compelling visual narratives, corporate brand anthems, and multi-platform digital broadcasts that move audiences to action.',
    'Commission Production',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'news_page',
    'Intellectual Capital',
    'News & Strategic Insights',
    'Briefings, Thought Leadership & Press Releases',
    'Stay informed with analysis from AMG partners on international market dynamics, regulatory compliance, generative AI governance, and creator economy trends.',
    'Subscribe to Briefings',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'products_page',
    'Digital Ecosystems',
    'Digital Products & Frameworks',
    'Proprietary Software Systems, Toolkits & Blueprints',
    'Explore our suite of enterprise software platforms, strategic toolkits, and structured operational blueprints engineered for immediate deployment.',
    'Request Product Demo',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'portfolio_page',
    'Client Case Studies',
    'Strategic Engagement Portfolio',
    'Proven Track Record Across Enterprise & Social Sectors',
    'Review our documented client outcomes, cross-border venture expansions, and large-scale media campaigns executed with uncompromising precision.',
    'Discuss Your Project Scope',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'partners_page',
    'Institutional Network',
    'Strategic Partners & Global Alliances',
    'Collaborating with Industry Pioneers & Academic Institutions',
    'Our alliance ecosystem spans premier financial institutions, technology leaders, media syndicates, and international trade organizations.',
    'Explore Alliance Opportunities',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'catalog_page',
    'Executive Solutions Suite',
    'AMG Solutions & Services Catalog',
    'A Comprehensive Guide to Consulting Modules and Technology Packages',
    'Detailed specifications, deliverables, and implementation timelines for AMG strategic services, media production packages, and corporate advisory retainers.',
    'Download Full Catalog PDF',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'wallfeel_page',
    'Luxury Interior Systems',
    'Wallfeel Architectural Decor',
    'Bespoke Acoustic Wall Panels, Luxury Textures & Interior Art',
    'Wallfeel combines acoustic engineering with haute interior aesthetics, transforming corporate boardrooms, creative studios, and luxury residences into sensory masterpieces.',
    'Explore Wallfeel Gallery',
    '#wallfeel-catalog-page',
    '',
    NULL,
    NOW(3)
  ),
  (
    'wallfeel_catalog_page',
    'Artisan Finishes',
    'Wallfeel Collection Catalog',
    'Curated Acoustic Sculptures & Custom Architectural Installations',
    'Browse our premier collection of sound-absorbing acoustic art, sustainable wooden textures, and bespoke wall installations tailored for commercial and residential environments.',
    'Request Material Samples',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'creaitube_page',
    'Media Platform',
    'CreAItube Creator Hub',
    'The Next-Generation Digital Media & Video Production Studio',
    'Empowering podcasters, filmmakers, and digital storytellers with decentralized monetization, AI-assisted video editing, and global audience distribution.',
    'Access CreAItube Studio',
    '#contact',
    '',
    NULL,
    NOW(3)
  ),
  (
    'terms_page',
    'Legal Standards & Compliance',
    'Terms & Conditions of Service',
    'Corporate Governance and Client Engagement Framework',
    'Official legal terms, service-level agreements, intellectual property covenants, and engagement standards governing all Azariah Management Group business interactions.',
    'Contact Legal Counsel',
    'mailto:info@azariahmg.com',
    '',
    NULL,
    NOW(3)
  ),
  (
    'privacy_page',
    'Data Protection & Security',
    'Global Privacy Policy',
    'Commitment to Data Privacy, Security, and Ethical Governance',
    'How Azariah Management Group collects, safeguards, and processes institutional and individual information in strict compliance with GDPR, CCPA, and global data privacy regulations.',
    'Privacy Office Inquiries',
    'mailto:info@azariahmg.com',
    '',
    NULL,
    NOW(3)
  )
ON DUPLICATE KEY UPDATE
  `badge` = COALESCE(NULLIF(VALUES(`badge`), ''), `badge`),
  `title` = COALESCE(NULLIF(VALUES(`title`), ''), `title`),
  `subtitle` = COALESCE(NULLIF(VALUES(`subtitle`), ''), `subtitle`),
  `content` = COALESCE(NULLIF(VALUES(`content`), ''), `content`),
  `ctaText` = COALESCE(NULLIF(VALUES(`ctaText`), ''), `ctaText`),
  `ctaLink` = COALESCE(NULLIF(VALUES(`ctaLink`), ''), `ctaLink`),
-- ------------------------------------------------------------------------------
-- 7. Table: developers
-- Profiles, authentication, and credentials for assigned engineers.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `developers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `roleTitle` VARCHAR(191) NOT NULL DEFAULT 'Developer',
  `departmentId` INT NULL,
  `department` VARCHAR(191) NULL DEFAULT 'Engineering & Technology',
  `compensationType` VARCHAR(32) NOT NULL DEFAULT 'hourly',
  `hourlyRate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `salary` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `paytime` VARCHAR(64) NOT NULL DEFAULT 'hourly',
  `contractAmount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `contractTerms` TEXT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `phone` VARCHAR(64) NULL,
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
  `emailConfirmed` TINYINT(1) NOT NULL DEFAULT 0,
  `confirmationToken` VARCHAR(128) NULL,
  `lastLoginAt` DATETIME NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `developers_email_key` (`email`),
  INDEX `idx_developers_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. Table: projects
-- Corporate projects with milestones, budget, status, and launch target.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` LONGTEXT NULL,
  `budget` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `status` ENUM('planning', 'in_progress', 'in_review', 'launched', 'on_hold') NOT NULL DEFAULT 'planning',
  `launchDate` DATE NULL,
  `repoUrl` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_slug_key` (`slug`),
  INDEX `idx_projects_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. Table: project_milestones
-- Key deliverables, deadlines, and completion flags for projects.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_milestones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `projectId` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `dueDate` DATE NULL,
  `status` ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
  `orderIndex` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_milestones_project` (`projectId`),
  CONSTRAINT `fk_milestones_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 10. Table: project_developers
-- Mapping assignments between developers and projects.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_developers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `projectId` INT NOT NULL,
  `developerId` INT NOT NULL,
  `roleInProject` VARCHAR(191) NULL DEFAULT 'Lead Developer',
  `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_project_developer` (`projectId`, `developerId`),
  INDEX `idx_dev_assignments` (`developerId`),
  CONSTRAINT `fk_proj_dev_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_proj_dev_developer` FOREIGN KEY (`developerId`) REFERENCES `developers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 11. Table: developer_time_logs
-- Clock-in / clock-out records, elapsed time, and task summaries.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `developer_time_logs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `developerId` INT NOT NULL,
  `projectId` INT NULL,
  `clockIn` DATETIME NOT NULL,
  `clockOut` DATETIME NULL,
  `totalMinutes` INT NOT NULL DEFAULT 0,
  `taskSummary` TEXT NULL,
  `ipAddress` VARCHAR(64) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_timelogs_dev` (`developerId`),
  INDEX `idx_timelogs_proj` (`projectId`),
  INDEX `idx_timelogs_clockin` (`clockIn`),
  CONSTRAINT `fk_timelogs_developer` FOREIGN KEY (`developerId`) REFERENCES `developers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_timelogs_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 12. Table: payslips
-- Payment records, hours billed, disbursements, and confirmation receipts.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payslips` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `developerId` INT NOT NULL,
  `referenceNo` VARCHAR(64) NOT NULL,
  `periodStart` DATE NOT NULL,
  `periodEnd` DATE NOT NULL,
  `hoursBilled` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `hourlyRate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `bonus` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `deductions` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `totalAmount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `paymentMethod` VARCHAR(128) NOT NULL DEFAULT 'Bank Transfer',
  `notes` TEXT NULL,
  `status` ENUM('issued', 'confirmed') NOT NULL DEFAULT 'issued',
  `confirmedAt` DATETIME NULL,
  `issuedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `payslips_ref_key` (`referenceNo`),
  INDEX `idx_payslips_dev` (`developerId`),
  INDEX `idx_payslips_status` (`status`),
  CONSTRAINT `fk_payslips_developer` FOREIGN KEY (`developerId`) REFERENCES `developers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 13. Table: developer_tasks
-- Task assignments, priority levels, workflow status, estimated hours, and email alerts.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `developer_tasks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` LONGTEXT NULL,
  `developerId` INT NOT NULL,
  `projectId` INT NULL,
  `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  `status` ENUM('pending', 'in_progress', 'in_review', 'completed', 'blocked') NOT NULL DEFAULT 'pending',
  `dueDate` DATE NULL,
  `estimatedHours` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
  `actualHours` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
  `assignedByAdminId` INT NULL,
  `assignedByAdminName` VARCHAR(191) NULL DEFAULT 'Admin',
  `completedAt` DATETIME NULL,
  `notes` TEXT NULL,
  `emailNotified` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_tasks_dev` (`developerId`),
  INDEX `idx_tasks_status` (`status`),
  INDEX `idx_tasks_priority` (`priority`),
  INDEX `idx_tasks_proj` (`projectId`),
  INDEX `idx_tasks_due` (`dueDate`),
  CONSTRAINT `fk_tasks_developer` FOREIGN KEY (`developerId`) REFERENCES `developers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tasks_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

