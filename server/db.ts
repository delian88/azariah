import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "mysql://root:@localhost:3306/azariah_db";
const adapter = new PrismaMariaDb(connectionString);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function seedInitialData() {
  try {
    // 1. Ensure Admin exists with requested credentials
    const targetEmail = "info@azariahmg.com";
    const passwordHash = await bcrypt.hash("Admin@webmaster$1", 10);
    
    const adminByEmail = await prisma.adminUser.findFirst({
      where: {
        OR: [{ email: targetEmail }, { username: targetEmail }, { username: "admin" }],
      },
    });

    if (adminByEmail) {
      await prisma.adminUser.update({
        where: { id: adminByEmail.id },
        data: {
          username: "info@azariahmg.com",
          email: targetEmail,
          passwordHash,
          name: "Azariah Administrator",
        },
      });
      console.log("[DB Seed] Updated admin credentials for info@azariahmg.com");
    } else {
      await prisma.adminUser.create({
        data: {
          username: "info@azariahmg.com",
          email: targetEmail,
          name: "Azariah Administrator",
          passwordHash,
        },
      });
      console.log("[DB Seed] Created admin: info@azariahmg.com / Admin@webmaster$1");
    }

    // 2. Default Site Settings
    const defaultSettings: Array<{ key: string; value: string; type: string; description: string }> = [
      {
        key: "logo_url",
        value: "",
        type: "image",
        description: "Custom logo image URL (leave empty to use default SVG globe logo)",
      },
      {
        key: "logo_text",
        value: "Azariah",
        type: "text",
        description: "Primary Brand Logo Text",
      },
      {
        key: "logo_subtext",
        value: "MANAGEMENT GROUP",
        type: "text",
        description: "Secondary Brand Logo Subtext",
      },
      {
        key: "site_name",
        value: "Azariah Management Group",
        type: "text",
        description: "Website Site Name",
      },
      {
        key: "tagline",
        value: "Strategic Intelligence & Media Impact",
        type: "text",
        description: "Brand Tagline",
      },
      {
        key: "contact_email",
        value: "info@azariahmg.com",
        type: "text",
        description: "Public Contact Email Address",
      },
      {
        key: "contact_phone",
        value: "+1 (443) 222-0000",
        type: "text",
        description: "Public Contact Phone Number",
      },
      {
        key: "contact_address",
        value: "Baltimore, Maryland, USA",
        type: "text",
        description: "Corporate Headquarters Location",
      },
      {
        key: "office_hours",
        value: "Mon - Fri: 8:00 AM - 6:00 PM EST",
        type: "text",
        description: "Office Operating Hours",
      },
    ];

    for (const setting of defaultSettings) {
      const exists = await prisma.siteSetting.findUnique({
        where: { key: setting.key },
      });
      if (!exists) {
        await prisma.siteSetting.create({
          data: setting,
        });
      }
    }

    // 3. Default Section Contents
    const defaultSections: Array<{
      sectionKey: string;
      badge: string;
      title: string;
      subtitle: string;
      content: string;
      ctaText: string;
      ctaLink: string;
      mediaUrl: string;
      data: any;
    }> = [
      {
        sectionKey: "hero",
        badge: "AZARIAH MANAGEMENT GROUP",
        title: "Azariah.",
        subtitle: "Management Group",
        content: "We deliver high-performance consulting and media solutions for organizations that demand excellence and impact.",
        ctaText: "Start Your Journey",
        ctaLink: "#contact",
        mediaUrl: "",
        data: {
          slides: [
            {
              video: "https://player.vimeo.com/external/434045526.sd.mp4?s=c27db08e124845114704b2d352332f1f50a80d2a&profile_id=164&oauth2_token_id=57447761",
              poster: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069",
              title: "Azariah.",
              subtitle: "Management Group",
              description: "We deliver high-performance consulting and media solutions for organizations that demand excellence and impact.",
              alt: "Corporate team working in modern office space"
            },
            {
              video: "https://player.vimeo.com/external/371433917.sd.mp4?s=694406a461b40213032d8478418f430635489814&profile_id=164&oauth2_token_id=57447761",
              title: "Impact Driven.",
              poster: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070",
              subtitle: "Future-Ready Systems",
              description: "Integrating advanced technology and creative storytelling to maximize your reach and results.",
              alt: "Global digital connectivity network visualization"
            },
            {
              video: "https://player.vimeo.com/external/403810419.sd.mp4?s=e52f5979f046e8c89c8a071c33f274a7b7a42142&profile_id=164&oauth2_token_id=57447761",
              title: "Global Scale.",
              poster: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070",
              subtitle: "Strategic Excellence",
              description: "Azariah Management Group partners with visionaries to transform complex challenges into scalable opportunities.",
              alt: "Modern workspace collaboration"
            }
          ]
        }
      },
      {
        sectionKey: "philosophy",
        badge: "CORE PHILOSOPHY",
        title: "AZARIAH MANAGEMENT GROUP.",
        subtitle: "The Quadruple Helix Framework",
        content: "Strategy should be purposeful, innovation should be responsible, and growth should create lasting value.",
        ctaText: "",
        ctaLink: "",
        mediaUrl: "",
        data: {
          paragraph1: "We partner with visionaries to transform ideas into scalable impact. At Azariah Management Group, we bridge the gap between business intelligence and human-centered design.",
          paragraph2: "Our core is rooted in integrity. We ensure every solution strengthens systems, empowers talent, and builds sustainable global futures for our clients."
        }
      },
      {
        sectionKey: "about",
        badge: "Strategic Identity",
        title: "Global Strategic Enterprise.",
        subtitle: "Catalyzing Cross-Continental Growth & Innovation",
        content: "Azariah Management Group (AMG) is a global strategic consulting, technology innovation, and media enterprise providing international business advisory and cross border growth solutions. Headquartered in the United States and serving clients across the U.S., United Kingdom, Africa, and global diaspora markets, AMG supports entrepreneurs, startups, nonprofits, and institutions in building scalable, compliant, and impact driven organizations.",
        ctaText: "Read The Complete Strategic Narrative",
        ctaLink: "#about-page",
        mediaUrl: "",
        data: {
          secondaryContent: "We operate at the intersection of strategy, technology, storytelling, and community development — delivering integrated solutions for modern global enterprises. Our expertise in diaspora markets and multicultural business environments allows us to bridge international opportunities with U.S. based infrastructure.",
          locations: ["USA", "UK", "Pan Africa", "Global Diaspora"]
        }
      },
      {
        sectionKey: "services",
        badge: "Our Core Capabilities",
        title: "Strategic Advisory, Innovation & Media.",
        subtitle: "Delivering excellence across critical growth pillars",
        content: "Comprehensive services engineered to accelerate enterprise growth, digital transformation, and international market positioning.",
        ctaText: "Explore All Services",
        ctaLink: "#services-page",
        mediaUrl: "",
        data: {
          features: [
            {
              title: "Strategic Consulting & Advisory",
              description: "Cross-border strategy, market entry, regulatory compliance, and organizational restructuring."
            },
            {
              title: "Technology & AI Innovation",
              description: "Applied artificial intelligence solutions, enterprise systems integration, and digital modernization."
            },
            {
              title: "Media Production & Storytelling",
              description: "High-impact cinematic production, digital marketing campaigns, and international cultural events via Studio AMG."
            },
            {
              title: "Capital Pathways & Trade",
              description: "Structuring cross-continental investment networks and diaspora business facilitation."
            }
          ]
        }
      },
      {
        sectionKey: "strategic_ai",
        badge: "Technology Division",
        title: "Ethical AI & Scalable Digital Intelligence.",
        subtitle: "Bridging Enterprise Innovation and Human Values",
        content: "We empower organizations with tailored AI readiness strategies, data workflow automations, and digital literacy frameworks to ensure sustainable technology adoption.",
        ctaText: "Discover AI Solutions",
        ctaLink: "#contact",
        mediaUrl: "",
        data: {
          metrics: [
            { value: "1,200+", label: "Professionals Trained" },
            { value: "99.8%", label: "System Reliability" },
            { value: "10x", label: "Workflow Efficiency" }
          ]
        }
      },
      {
        sectionKey: "contact",
        badge: "Get In Touch",
        title: "Connect With Our Global Leadership Team.",
        subtitle: "Let's discuss how Azariah Management Group can accelerate your strategic goals.",
        content: "Reach out directly to schedule a confidential strategic consultation or explore partnership opportunities.",
        ctaText: "Submit Inquiry",
        ctaLink: "#contact",
        mediaUrl: "",
        data: {
          email: "info@azariahmg.com",
          phone: "+1 (443) 222-0000",
          address: "Baltimore, Maryland, USA",
          responseSla: "We respond within 4 business hours"
        }
      },
      {
        sectionKey: "footer",
        badge: "AMG GLOBAL",
        title: "Azariah Management Group",
        subtitle: "Global Strategic Intelligence & Media Enterprise",
        content: "Providing international business advisory, advanced technology innovation, and cinematic media production across the U.S., UK, Africa, and global diaspora markets.",
        ctaText: "",
        ctaLink: "",
        mediaUrl: "",
        data: {
          copyright: "© 2026 Azariah Management Group. All rights reserved.",
          registeredOffice: "Headquartered in Maryland, USA with strategic alliances across London, Lagos, and Johannesburg."
        }
      }
    ];

    for (const section of defaultSections) {
      const exists = await prisma.sectionContent.findUnique({
        where: { sectionKey: section.sectionKey },
      });
      if (!exists) {
        await prisma.sectionContent.create({
          data: {
            sectionKey: section.sectionKey,
            badge: section.badge,
            title: section.title,
            subtitle: section.subtitle,
            content: section.content,
            ctaText: section.ctaText,
            ctaLink: section.ctaLink,
            mediaUrl: section.mediaUrl,
            data: JSON.stringify(section.data),
          },
        });
      }
    }

    console.log("[DB Seed] Completed successfully.");
  } catch (err) {
    console.error("[DB Seed Error]:", err);
  }
}
