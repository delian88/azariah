import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import Logo from './Logo';

interface NavbarProps {
  onNavigate?: (view: 'home' | 'services') => void;
  currentView?: 'home' | 'services';
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

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href === '#services-page') {
      e.preventDefault();
      onNavigate?.('services');
      setIsOpen(false);
    } else if (href === '#home') {
      e.preventDefault();
      onNavigate?.('home');
      setIsOpen(false);
    } else if (currentView === 'services') {
      // If we are on services page and click a section link, go home first
      onNavigate?.('home');
      // Timeout to allow scroll after view switch
      setTimeout(() => {
        const id = href.replace('#', '');
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services-page' },
    { label: 'Who We Are', href: '#about' },
    { label: 'Programs', href: '#programs' },
    { label: 'Strategic AI', href: '#ai' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled || currentView === 'services' ? 'bg-white/95 backdrop-blur-xl shadow-lg py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="flex items-center group">
          <Logo className="h-10 md:h-12 transition-transform group-hover:scale-105 duration-500" />
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className={`text-[13px] font-black uppercase tracking-widest link-underline transition-colors ${
                scrolled || currentView === 'services' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-200 hover:text-white'
              } ${currentView === 'services' && item.href === '#services-page' ? 'text-lime-600' : ''}`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact')}
            className="px-8 py-3 bg-slate-900 text-white text-[12px] font-black uppercase tracking-widest rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all flex items-center group shadow-xl"
          >
            Work With Us
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className={`lg:hidden p-2 transition-colors ${scrolled || currentView === 'services' ? 'text-slate-900' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-0 bg-slate-950 z-[60] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
           <button className="absolute top-8 right-8 text-white" onClick={() => setIsOpen(false)}>
             <X size={40} />
           </button>
           <Logo variant="dark" className="h-20 mb-10" />
           {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className="text-4xl font-black text-white hover:text-lime-500 transition-colors tracking-tighter"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact')}
            className="mt-10 px-12 py-5 bg-lime-500 text-slate-950 text-xl font-black uppercase tracking-widest rounded-sm"
          >
            Work With Us
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;