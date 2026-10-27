import { NavItem, NewsItem, ProductItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home', view: 'home' as any },
  { label: 'About Us', href: '#about-page', view: 'about' as any },
  { label: 'Services', href: '#services-page', view: 'services' as any },
  { label: 'Portfolio', href: '#portfolio-page', view: 'portfolio' as any },
  { label: 'Partners', href: '#partners-page', view: 'partners' as any },
  { label: 'Programs', href: '#programs-page', view: 'programs' as any },
  { label: 'Products', href: '#products-page', view: 'products' as any },
  { label: 'News', href: '#news-page', view: 'news' as any },
  { label: 'Studio AMG', href: '#studio-page', view: 'studio' as any },
  { label: 'CreAItube', href: '#creaitube-page', view: 'creaitube' as any },
  { label: 'Contact', href: '#contact' }
];

export const PARTNERS = [
  { name: "Grey Consortium UK", url: "https://www.greyconsortium.com", category: "Global Strategy", desc: "Technical and strategic partners for European market entry and media distribution." },
  { name: "Grey Consortium South Africa", url: "https://www.greyconsortium.com", category: "Global Strategy", desc: "Pan-African operational partners for economic pathway development." },
  { name: "Grey Cinema UK", url: "https://greytvchannel.co.uk/greycinema/", category: "Media & Culture", desc: "Collaborative partners for the Nolly Oh! Festival and African cinematic distribution." },
  { name: "Knight of Columbus - St. Mathews Council Baltimore", category: "Community", desc: "Strategic partners for community governance and social impact programs in Maryland." },
  { name: "Luxurious Decorations - London", url: "https://www.luxuriousdecorations.com", category: "Creative Services", desc: "It is a Premium Luxurious Interior decoration and real estate venture...with its 8D Mural Wallpapper it is transforming how walls come alive" },
  { name: "Foundation of Luv", url: "https://FoundationofLuv.org", category: "Social Impact", desc: "Strategic advisory partners for grassroots mobilization and social welfare initiatives." },
  { name: "World AI Force", category: "Technology", desc: "Core partners for ethical AI implementation and digital capacity building for underserved communities." },
  { name: "Premegage Tech Solution", url: "https://www.premegagetech.com", category: "Technology", desc: "Engineering partners for robust custom software and cybersecurity infrastructure." },
  { name: "NYCN - North America", category: "Advocacy", desc: "Diaspora engagement partners for youth mobilization and cultural connectivity." },
  { name: "BlackbyAngel", url: "https://blackbyangel.my.canva.site/", category: "Media & Advocacy", desc: "Proprietary partner for the BlackbyAngel talk series and mental health advocacy platforms." },
  { name: "Wallfeel Luxurious Decorations", category: "Creative Services", desc: "Redefining luxury wall coverings since 2019. High-performance, sustainable, and custom interior wall solutions." }
];

export const PORTFOLIO_PROJECTS = [
  {
    id: "proj-nolly-oh",
    title: "Nolly Oh! Cultural Festival",
    division: "Studio AMG",
    impact: "UK-Wide cultural celebration reaching 50,000+ attendees across 5 major cities.",
    description: "AMG served as the lead technical and strategic partner for the landmark Nollywood and Nigerian Cultural Festival in the UK. We managed the multi-city tour, media production, and stakeholder coordination.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1925",
    tags: ["Media", "Culture", "Event Strategy"]
  },
  {
    id: "proj-world-ai",
    title: "World AI Force Deployment",
    division: "Innovation & Tech",
    impact: "Upskilled 1,200+ professionals in ethical AI frameworks within 12 months.",
    description: "Developed and deployed a comprehensive AI readiness toolkit for nonprofit organizations, ensuring secure and inclusive digital transformation.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2070",
    tags: ["AI", "Tech for Good", "Consulting"]
  },
  {
    id: "proj-silent-movement",
    title: "The Silent Movement Visuals",
    division: "Studio AMG",
    impact: "Mobilized 50+ grassroots organizations for mental health advocacy.",
    description: "A cinematic advocacy campaign that translated complex mental health data into powerful visual stories, sparking policy-level conversations in Maryland.",
    image: "https://images.unsplash.com/photo-1542204113-e9354e746522?auto=format&fit=crop&q=80&w=1974",
    tags: ["Advocacy", "Cinematic", "Wellness"]
  },
  {
    id: "proj-game-gateway",
    title: "G.A.M.E. Trade Ecosystem",
    division: "Projects & Infra",
    impact: "Facilitated $5M in diaspora-led investment into African innovation hubs.",
    description: "Designed and implemented a verified partner network connecting North American investors with high-growth African tech startups.",
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=2006",
    tags: ["Trade", "Innovation", "Global"]
  }
];

export const NEWS_ITEMS: NewsItem[] = [];

export const PRODUCT_ITEMS: ProductItem[] = [
  {
    id: 'prod-1',
    title: "AI Readiness Toolkit",
    tagline: "Modernization for the Human Scale",
    category: "Digital Tools",
    description: "A comprehensive assessment and roadmap generator for organizations transitioning to AI-integrated operations.",
    features: ["Risk-based AI auditing", "Custom implementation roadmaps", "Employee training modules", "Impact measurement dashboard"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070"
  },
  {
    id: 'prod-2',
    title: "Impact Metric OS",
    tagline: "Measure what Matters",
    category: "SaaS",
    description: "A proprietary dashboard for CSR and non-profit leaders to track social return on investment (SROI) in real-time.",
    features: ["Real-time data ingestion", "Stakeholder sentiment analysis", "Automated impact reporting", "Benchmarking against global standards"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015"
  },
  {
    id: 'prod-3',
    title: "G.A.M.E. Gateway",
    tagline: "Connecting the Diaspora",
    category: "Ecosystem",
    description: "A digital trade and innovation ecosystem connecting North American investors with African innovation hubs.",
    features: ["Verified partner network", "Cross-border compliance tools", "Supply chain visibility", "Collaborative project hubs"],
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=2006"
  }
];

export const WHAT_WE_DO = [
  {
    title: 'Corporate Social Responsibility',
    description: 'Designing and executing CSR strategies that strengthen communities and deliver measurable results.',
    icon: 'shield-check'
  },
  {
    title: 'Nonprofit Strategy & Capacity',
    description: 'Helping nonprofits move from overwhelmed to operationally strong through planning and program design.',
    icon: 'briefcase'
  },
  {
    title: 'Government & Public Sector',
    description: 'Supporting agencies with strategic planning, program management, and interagency coordination.',
    icon: 'landmark'
  },
  {
    title: 'AI & Tech for Good',
    description: 'Ensuring that underrepresented communities have access to emerging technology that should serve humanity not exploit it.',
    icon: 'cpu'
  },
  {
    title: 'Cyber Security & Software Engineering',
    description: 'Protecting digital assets and engineering robust custom platforms and systems.',
    icon: 'code-2'
  },
  {
    title: 'Community Impact & Development',
    description: 'Grassroots mobilization and urban development support to create lasting social change.',
    icon: 'users'
  },
  {
    title: 'Creative Storytelling (Studio AMG)',
    description: 'World-class cinematic storytelling and media production to elevate missions and inspire action.',
    icon: 'camera'
  }
];

export const HOW_WE_WORK = [
  {
    step: '1',
    title: 'Listen & Learn',
    description: 'We understand your mission, community, and operational realities.'
  },
  {
    step: '2',
    title: 'Co-Create Solutions',
    description: 'We design tailored strategies that merge innovation, impact, and execution.'
  },
  {
    step: '3',
    title: 'Measure & Scale Impact',
    description: 'We help you track outcomes, strengthen partnerships, and build long-term sustainability.'
  }
];

export const DIVISIONS = [
  'Consulting Division',
  'Projects & Infrastructure Division',
  'Innovation & Technology Division (Engineering & Cyber)',
  'Community & Social Impact Division',
  'Studio AMG (Creative & Media Division)'
];

export const SIGNATURE_PROGRAMS = [
  {
    title: 'Start Point',
    description: 'Docu-series highlighting emerging CEOs & founders.',
    tags: ['Media', 'Entrepreneurship']
  },
  {
    title: 'Voices of the Diaspora',
    description: 'Storytelling series amplifying experiences across the global African diaspora.',
    tags: ['Culture', 'Documentary']
  },
  {
    title: 'Captain Chiffon',
    description: 'Children’s animated superhero promoting courage & compassion.',
    tags: ['Animation', 'Social Good']
  },
  {
    title: 'Family First',
    description: 'Media platform for family unity & emotional wellness.',
    tags: ['Wellness', 'Media']
  },
  {
    title: 'The Silent Movement',
    description: 'Advocacy backbone translating storytelling into community impact.',
    tags: ['Advocacy', 'Policy']
  },
  {
    title: 'G.A.M.E.',
    description: 'Global African Market Enterprise – Diaspora innovation & trade ecosystem.',
    tags: ['Trade', 'Innovation']
  },
  {
    title: 'AI Force Hub',
    description: 'Collaboration & training center for ethical AI implementation.',
    tags: ['Technology', 'Training']
  },
  {
    title: 'BlackbyAngel Initiative',
    description: 'Mental health, relationships & community empowerment.',
    tags: ['Advocacy', 'Health']
  }
];

export const WHY_CHOOSE_AMG = {
  strengths: [
    "Multidisciplinary Strategic Expertise",
    "Ethical & Inclusive AI Integration",
    "High-Impact Creative Storytelling",
    "Scalable Community Development Models"
  ],
  differentiators: [
    "Integrated Media-Strategy Ecosystem",
    "Real-World Operational Experience",
    "Cultural & Diaspora Intelligence",
    "End-to-End Execution"
  ]
};

export const WHO_WE_SERVE = {
  primary: [
    "Government & Public Sector Agencies",
    "Corporate CSR & ESG Departments",
    "Non-Profit & Civil Society Organizations",
    "Global Development Foundations"
  ]
};

export const WHO_SERVED = [
  "Corporate Leadership Teams",
  "Public Sector Administrators",
  "Non-Profit Directors",
  "Social Entrepreneurs",
  "Community Organizers",
  "International Development Agencies"
];