
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
    // If it's the home link, we handle it internally to avoid too many tabs if they click Home from Home
    if (href === '#home') {
      e.preventDefault();
      onNavigate?.('home');
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // For other links, we let the default behavior (opening in a new tab) happen
      // but we still close the mobile menu if it's open
      setIsOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home', newTab: false },
    { label: 'About Us', href: '#about-page', newTab: true },
    { label: 'Services', href: '#services-page', newTab: true },
    { label: 'Programs', href: '#programs-page', newTab: true },
    { label: 'Studio AMG', href: '#studio-page', newTab: true },
  ];

  const isInternalView = currentView !== 'home';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled || isInternalView ? 'bg-white/95 backdrop-blur-xl shadow-lg py-2 md:py-3' : 'bg-transparent py-4 md:py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex justify-between items-center">
        <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="flex items-center group">
          <Logo className="h-9 md:h-11 lg:h-12 transition-transform group-hover:scale-105 duration-500" />
        </a>

        {/* Desktop & Tablet Links */}
        <div className="hidden md:flex items-center md:space-x-4 lg:space-x-10">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              target={item.newTab ? "_blank" : undefined}
              rel={item.newTab ? "noopener noreferrer" : undefined}
              className={`font-black uppercase tracking-widest link-underline transition-colors md:text-[10px] lg:text-[13px] ${
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
            className="md:px-4 lg:px-8 md:py-2.5 lg:py-3 bg-slate-900 text-white font-black uppercase tracking-widest rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all flex items-center group shadow-xl md:text-[9px] lg:text-[12px]"
          >
            Work With Us
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-6 space-y-4 shadow-xl">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              target={item.newTab ? "_blank" : undefined}
              rel={item.newTab ? "noopener noreferrer" : undefined}
              className="block font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 text-xs"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="block w-full py-4 bg-slate-900 text-white text-center font-black uppercase tracking-widest rounded-sm text-xs"
          >
            Work With Us
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
