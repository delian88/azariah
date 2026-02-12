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
  { name: "Luxurious Decorations - London", url: "https://www.luxuriousdecorations.com", category: "Creative Services", desc: "Visual and experiential design partners for high-level events and studio productions." },
  { name: "Foundation of Luv", url: "https://FoundationofLuv.org", category: "Social Impact", desc: "Strategic advisory partners for grassroots mobilization and social welfare initiatives." },
  { name: "World AI Force", category: "Technology", desc: "Core partners for ethical AI implementation and digital capacity building for underserved communities." },
  { name: "Premegage Tech Solution", url: "https://www.premegagetech.com", category: "Technology", desc: "Engineering partners for robust custom software and cybersecurity infrastructure." },
  { name: "NYCN - North America", category: "Advocacy", desc: "Diaspora engagement partners for youth mobilization and cultural connectivity." },
  { name: "BlackbyAngel", url: "https://blackbyangel.my.canva.site/", category: "Media & Advocacy", desc: "Proprietary partner for the BlackbyAngel talk series and mental health advocacy platforms." }
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

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-nolly-oh',
    title: "Studio AMG Partners on “Nolly Oh!” A Landmark Nollywood & Nigerian Cultural Festival Across the UK",
    date: "October 01, 2025",
    category: "Studio AMG",
    summary: "Azariah Management Group announces its role as technical partner for a UK-wide Nollywood festival celebrating Nigerian culture and cinema.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1925",
    content: [
      "Azariah Management Group (AMG), through its media division Studio AMG, is proud to announce its role as a technical partner and featured creative contributor to “Nolly Oh!”, a landmark Nollywood and Nigerian cultural festival set to take place across the United Kingdom.",
      "Launched in celebration of Nigeria’s 65th Independence Anniversary, Nolly Oh! is a bold, global initiative honoring African storytelling, cultural integration, and the extraordinary impact of Nollywood on the world stage. The festival is presented by Grey Cinema (UK) in partnership with The New Black Film Collective (TNBFC) and is proudly supported by the British Film Institute (BFI).",
      "A UK-Wide Celebration of Nollywood & Nigerian Heritage\nNolly Oh! will run from October to December 2025, with events hosted across London, Birmingham, Manchester, Newcastle, and Liverpool bringing Nigerian cinema and culture directly to diverse communities throughout the UK. The festival officially opens in London on Wednesday, 1st October 2025, aligning with celebrations marking Nigeria’s Independence Day, and setting the tone for a season of cultural excellence, dialogue, and creative exchange.",
      "Opening Night Highlight: “MAMI WATA” UK Screening\nThe highly anticipated opening night will feature the UK screening of MAMI WATA the critically acclaimed, award-nominated film directed by CJ Obasi at 7:00 PM. Coinciding with the BFI’s Melodrama Blockbuster Season, the premiere will also host a panel discussion and live Q&A, bringing together leading Nigerian and global filmmakers, producers, and cultural voices to explore the evolution, influence, and future of Nollywood.",
      "Beyond Film: A Multi-Sensory Cultural Experience\nMore than a traditional film festival, Nolly Oh! is designed as an immersive cultural experience. Audiences will engage with the full spectrum of Nigerian creativity through:\n• Authentic Nigerian cuisine\n• Live music performances\n• Fashion showcases\n• Dance exhibitions\n• Contemporary African art displays\nThis holistic approach celebrates not only storytelling on screen but also the broader creative industries that shape Nigeria’s cultural and economic influence globally.",
      "Studio AMG’s Role\nAs a technical partner, Studio AMG supported the festival through production expertise, media collaboration, and the showcasing of select projects aligned with AMG’s mission to amplify powerful stories, cultural narratives, and global African voices. This partnership reflects Azariah Management Group’s ongoing commitment to cultural advocacy, creative excellence, and diaspora engagement through media and storytelling.",
      "A Global Moment for Nollywood\nNolly Oh! stands as a defining moment for Nollywood’s global journey connecting filmmakers, audiences, institutions, and creatives while honoring Nigeria’s past, present, and future. Azariah Management Group is honored to be part of this historic celebration and looks forward to contributing to its lasting cultural impact."
    ]
  }
];

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