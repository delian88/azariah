
import { NavItem, ServiceCard, StatItem, ProjectItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Strategic AI', href: '#ai' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }
];

export const SERVICES: ServiceCard[] = [
  {
    title: 'Strategic Planning',
    description: 'We develop robust roadmaps that align organizational objectives with market opportunities for long-term growth.',
    icon: 'target'
  },
  {
    title: 'Operational Excellence',
    description: 'Streamlining processes and optimizing workflows to enhance efficiency and reduce organizational friction.',
    icon: 'zap'
  },
  {
    title: 'Financial Advisory',
    description: 'Data-driven financial strategies to maximize capital efficiency and navigate complex market environments.',
    icon: 'trending-up'
  },
  {
    title: 'Leadership Development',
    description: 'Empowering the next generation of executives through specialized coaching and organizational design.',
    icon: 'users'
  }
];

export const STATS: StatItem[] = [
  { label: 'Years Experience', value: '15', suffix: '+' },
  { label: 'Successful Projects', value: '250', suffix: '+' },
  { label: 'Global Partners', value: '45', suffix: '' },
  { label: 'ROI Improvement', value: '30', suffix: '%' }
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
