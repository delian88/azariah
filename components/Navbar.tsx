import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onNavigate?: (view: 'home' | 'services' | 'about' | 'programs' | 'studio' | 'news' | 'products') => void;
  currentView?: 'home' | 'services' | 'about' | 'programs' | 'studio' | 'news' | 'products';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, href: string, view?: 'home' | 'services' | 'about' | 'programs' | 'studio' | 'news' | 'products') => {
    if (view) {
      e.preventDefault();
      onNavigate?.(view);
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('#')) {
      const el = document.getElementById(href.substring(1));
      if (el) {
        e.preventDefault();
        setIsOpen(false);
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setIsOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home', view: 'home' as const },
    { label: 'About Us', href: '#about-page', view: 'about' as const },
    { label: 'Services', href: '#services-page', view: 'services' as const },
    { label: 'Programs', href: '#programs-page', view: 'programs' as const },
    { label: 'Products', href: '#products-page', view: 'products' as const },
    { label: 'News', href: '#news-page', view: 'news' as const },
    { label: 'Studio AMG', href: '#studio-page', view: 'studio' as const },
    { label: 'CreAItube', href: '#creaitube' },
  ];

  const isInternalView = currentView !== 'home';

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.('home');
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled || isInternalView ? 'bg-white/95 backdrop-blur-xl shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-full px-4 md:px-6 lg:px-8 flex justify-between items-center">
        <a 
          href="/" 
          onClick={handleLogoClick} 
          className="flex items-center group"
        >
          {/* Reduced size: h-4 to h-6 range */}
          <Logo className="h-4 md:h-5 lg:h-6 transition-transform group-hover:scale-105 duration-500" />
        </a>

        {/* Desktop & Tablet Links */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href, (item as any).view)}
              className={`font-black uppercase tracking-widest link-underline transition-colors text-[8px] lg:text-[10px] ${
                scrolled || isInternalView ? 'text-slate-600 hover:text-slate-900' : 'text-slate-200 hover:text-white'
              } ${currentView === item.view ? 'text-lime-600' : ''}`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => {
               setIsOpen(false);
               const el = document.getElementById('contact');
               if (el) {
                 e.preventDefault();
                 el.scrollIntoView({ behavior: 'smooth' });
               }
            }}
            className="px-4 py-2 bg-slate-900 text-white font-black uppercase tracking-widest rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all flex items-center group shadow-xl text-[8px] lg:text-[9px]"
          >
            Work With Us
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 transition-colors ${scrolled || isInternalView ? 'text-slate-900' : 'text-white'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-300 max-h-screen overflow-y-auto">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href, (item as any).view)}
              className="block font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 text-[10px] py-2 border-b border-slate-50 last:border-0"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => {
               setIsOpen(false);
               const el = document.getElementById('contact');
               if (el) {
                 e.preventDefault();
                 el.scrollIntoView({ behavior: 'smooth' });
               }
            }}
            className="block w-full py-4 bg-slate-900 text-white text-center font-black uppercase tracking-widest rounded-sm text-[10px] mt-4"
          >
            Work With Us
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;