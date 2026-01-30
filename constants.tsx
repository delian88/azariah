import { NavItem, ServiceCard, StatItem, ProjectItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Who We Are', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Strategic AI', href: '#ai' },
  { label: 'Contact', href: '#contact' }
];

export const SERVICES: ServiceCard[] = [
  {
    title: 'Management Consulting',
    description: 'Strategic advisory and business consulting to help corporations and non-profits scale effectively with clarity and capacity.',
    icon: 'briefcase'
  },
  {
    title: 'Innovation & Tech',
    description: 'AI integration, digital readiness, and modernization strategies to ensure your organization is future-proof.',
    icon: 'cpu'
  },
  {
    title: 'Social Impact',
    description: 'Community program design and social impact strategy for leaders who want to build responsibly and create meaningful impact.',
    icon: 'globe'
  },
  {
    title: 'Studio AMG',
    description: 'Creative storytelling and advocacy media to help your organization grow with purpose-driven communication.',
    icon: 'camera'
  }
];

export const STATS: StatItem[] = [
  { label: 'Years Experience', value: '15', suffix: '+' },
  { label: 'Successful Projects', value: '250', suffix: '+' },
  { label: 'Global Partners', value: '45', suffix: '' },
  { label: 'Impact Score', value: '98', suffix: '%' }
];

export const PROJECTS: ProjectItem[] = [
  {
    title: 'Global Supply Chain Audit',
    category: 'Operations',
    image: 'https://picsum.photos/seed/mgmt1/800/600'
  },
  {
    title: 'FinTech Growth Strategy',
    category: 'Finance',
    image: 'https://picsum.photos/seed/mgmt2/800/600'
  },
  {
    title: 'Executive Leadership Retreat',
    category: 'Leadership',
    image: 'https://picsum.photos/seed/mgmt3/800/600'
  }
];