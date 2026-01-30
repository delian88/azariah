import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onNavigate?: (view: 'home' | 'services' | 'about' | 'programs' | 'studio') => void;
  currentView?: 'home' | 'services' | 'about' | 'programs' | 'studio';
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
    } else if (href === '#about-page') {
      e.preventDefault();
      onNavigate?.('about');
      setIsOpen(false);
    } else if (href === '#programs-page') {
      e.preventDefault();
      onNavigate?.('programs');
      setIsOpen(false);
    } else if (href === '#studio-page') {
      e.preventDefault();
      onNavigate?.('studio');
      setIsOpen(false);
    } else if (href === '#home') {
      e.preventDefault();
      onNavigate?.('home');
      setIsOpen(false);
    } else if (currentView !== 'home') {
      // If we are on internal page and click a section link, go home first
      onNavigate?.('home');
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
    { label: 'About Us', href: '#about-page' },
    { label: 'Services', href: '#services-page' },
    { label: 'Programs', href: '#programs-page' },
    { label: 'Studio AMG', href: '#studio-page' },
  ];

  const isInternalView = currentView !== 'home';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled || isInternalView ? 'bg-white/95 backdrop-blur-xl shadow-lg py-3' : 'bg-transparent py-6'
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
                scrolled || isInternalView ? 'text-slate-600 hover:text-slate-900' : 'text-slate-200 hover:text-white'
              } ${currentView === 'services' && item.href === '#services-page' ? 'text-lime-600' : ''} 
                ${currentView === 'about' && item.href === '#about-page' ? 'text-blue-600' : ''} 
                ${currentView === 'programs' && item.href === '#programs-page' ? 'text-lime-600' : ''}
                ${currentView === 'studio' && item.href === '#studio-page' ? 'text-blue-600' : ''}`}
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
        <button className={`lg:hidden p-2 transition-colors ${scrolled || isInternalView ? 'text-slate-900' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-0 bg-white/98 backdrop-blur-2xl z-[60] flex flex-col items-center justify-center space-y-6 animate-in slide-in-from-top duration-500">
           <button className="absolute top-6 right-6 text-slate-900 hover:text-lime-600 transition-colors" onClick={() => setIsOpen(false)}>
             <X size={36} />
           </button>
           <Logo variant="light" className="h-16 mb-6" />
           {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className="text-2xl font-black text-slate-900 hover:text-lime-600 transition-colors tracking-tighter uppercase"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact')}
            className="mt-6 px-10 py-4 bg-lime-500 text-slate-950 text-sm font-black uppercase tracking-widest rounded-sm shadow-xl hover:bg-slate-900 hover:text-white transition-all"
          >
            Work With Us
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;