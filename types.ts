
export interface ServiceCard {
  title: string;
  description: string;
  icon: string;
}

export interface StatItem {
  label: string;
  value: string;
  suffix?: string;
}

export interface NavItem {
  label: string;
  href: string;
  view?: 'home' | 'services' | 'about' | 'programs' | 'studio' | 'news' | 'products';
}

export interface ProjectItem {
  title: string;
  category: string;
  image: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  content: string[];
}

export interface ProductItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  category: string;
}
