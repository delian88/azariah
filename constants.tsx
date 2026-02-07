
import { NavItem, NewsItem, ProductItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home', view: 'home' },
  { label: 'About Us', href: '#about-page', view: 'about' },
  { label: 'Services', href: '#services-page', view: 'services' },
  { label: 'Programs', href: '#programs-page', view: 'programs' },
  { label: 'Products', href: '#products-page', view: 'products' },
  { label: 'News', href: '#news-page', view: 'news' },
  { label: 'Studio AMG', href: '#studio-page', view: 'studio' },
  { label: 'CreAItube', href: '#creaitube' },
  { label: 'Contact', href: '#contact' }
];

export const PARTNERS = [
  { name: "Grey Consortium UK", url: "https://www.greyconsortium.com" },
  { name: "Grey Consortium South Africa", url: "https://www.greyconsortium.com" },
  { name: "Grey Cinema UK", url: "https://greytvchannel.co.uk/greycinema/" },
  { name: "Knight of Columbus - St. Mathews Council Baltimore" },
  { name: "Luxurious Decorations - London", url: "https://www.luxuriousdecorations.com" },
  { name: "Foundation of Luv", url: "https://FoundationofLuv.org" },
  { name: "World AI Force" },
  { name: "Premegage Tech Solution", url: "https://www.premegagetech.com" },
  { name: "NYCN - North America" },
  { name: "BlackbyAngel", url: "https://blackbyangel.my.canva.site/" }
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: "AMG Expands Global Impact Strategy in Sub-Saharan Africa",
    date: "May 15, 2024",
    category: "Corporate News",
    summary: "New partnership initiatives focused on economic pathway development and digital inclusion.",
    image: "https://images.unsplash.com/photo-1526253038957-bce54e05968e?auto=format&fit=crop&q=80&w=2070",
    content: ["Azariah Management Group (AMG) has officially announced a new phase of its global impact strategy, specifically targeting emerging markets in Sub-Saharan Africa. The initiative, led by our International Organizations & Donor Agencies division, aims to foster public-private partnerships that bridge the digital divide.", "Working with local grassroots organizations, AMG will implement strategic management frameworks that prioritize long-term sustainability and local leadership."]
  },
  {
    id: 'news-2',
    title: "AI & Tech for Good: New Ethics Framework Released",
    date: "April 28, 2024",
    category: "Technology",
    summary: "A proprietary framework for underrepresented communities to access AI responsibly.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070",
    content: ["As part of our Innovation & Technology Division, AMG has released a foundational whitepaper on 'Responsible AI for Community Systems'. This framework provides actionable guidelines for ensuring that emerging technologies serve humanity rather than exploit it.", "The framework is now being integrated into our consulting services for NGOs and government agencies."]
  },
  {
    id: 'news-3',
    title: "Studio AMG Receives Advocacy Storytelling Award",
    date: "March 12, 2024",
    category: "Studio AMG",
    summary: "Recognized for 'The Silent Movement' campaign's impact on mental health awareness.",
    image: "https://images.unsplash.com/photo-1542204113-e9354e746522?auto=format&fit=crop&q=80&w=1974",
    content: ["Our creative division, Studio AMG, has been honored with a regional award for Excellence in Advocacy Media. The award highlights the measurable impact of 'The Silent Movement', which mobilized over 50 grassroots organizations."]
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
    'Tailored consulting for every growth stage',
    'Deep expertise in engineering, transformation & execution',
    'Integrated consulting + media ecosystem',
    'Real-world government & private-sector experience',
    'Community-centered, relationship-driven approach',
    'Proven global partnerships (U.S., Europe, Africa)',
    'Ability to take clients from feasibility → readiness → execution'
  ],
  differentiators: [
    'Strategy + storytelling in one ecosystem',
    'Strong investment in small businesses & community development',
    'Measurable impact frameworks',
    'Multidisciplinary team spanning strategy, technology, culture, and media'
  ]
};

export const WHO_SERVED = [
  'Government Agencies / Public Sector & Private Sector',
  'Non-Profits & Civil Society Organizations',
  'International Organizations & Donor Agencies (North/South America, E.U, UK, Asia, Africa)',
  'Communities',
  'Tech & engineering firms innovating and scaling new solutions',
  'Creative & mission-driven brands looking for advocacy or branded storytelling'
];

export const WHO_WE_SERVE = {
  primary: [
    'Government Agencies / Public Sector & Private Sector',
    'Non-Profits & Civil Society Organizations',
    'International Organizations & Donor Agencies (North/South America, E.U, UK, Asia, Africa)',
    'Communities'
  ],
  secondary: [
    'Tech & engineering firms',
    'Enterprises undergoing modernization',
    'Creative industries seeking advocacy or branded media'
  ]
};
