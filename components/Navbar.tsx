import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, ChevronDown } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onNavigate?: (view: 'home' | 'services' | 'about' | 'programs' | 'mentorship' | 'studio' | 'news' | 'products' | 'portfolio' | 'partners' | 'creaitube') => void;
  currentView?: 'home' | 'services' | 'about' | 'programs' | 'mentorship' | 'studio' | 'news' | 'products' | 'portfolio' | 'partners' | 'creaitube';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProgramsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, href: string, view?: any) => {
    if (view) {
      e.preventDefault();
      onNavigate?.(view);
      setIsOpen(false);
      setProgramsDropdownOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('#')) {
      const el = document.getElementById(href.substring(1));
      if (el && currentView === 'home') {
        e.preventDefault();
        setIsOpen(false);
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  const isInternalView = currentView !== 'home';
  const textColorClass = scrolled || isInternalView ? 'text-slate-600 hover:text-slate-900' : 'text-slate-200 hover:text-white';

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
          <Logo className="h-4 md:h-5 lg:h-6 transition-transform group-hover:scale-105 duration-500" />
        </a>

        {/* Desktop & Tablet Links */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <a href="#home" onClick={(e) => handleLinkClick(e, '#home', 'home')} className={`font-black uppercase tracking-widest transition-colors text-[8px] lg:text-[10px] ${textColorClass}`}>Home</a>
          <a href="#about-page" onClick={(e) => handleLinkClick(e, '#about-page', 'about')} className={`font-black uppercase tracking-widest transition-colors text-[8px] lg:text-[10px] ${textColorClass}`}>About Us</a>
          <a href="#portfolio-page" onClick={(e) => handleLinkClick(e, '#portfolio-page', 'portfolio')} className={`font-black uppercase tracking-widest transition-colors text-[8px] lg:text-[10px] ${textColorClass}`}>Portfolio</a>
          
          {/* Programs Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setProgramsDropdownOpen(!programsDropdownOpen)}
              className={`flex items-center gap-1 font-black uppercase tracking-widest transition-colors text-[8px] lg:text-[10px] ${textColorClass} ${currentView === 'programs' || currentView === 'mentorship' ? 'text-lime-600' : ''}`}
            >
              Programs <ChevronDown className={`w-3 h-3 transition-transform ${programsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {programsDropdownOpen && (
              <div className="absolute top-full left-0 mt-4 w-48 bg-white border border-slate-100 shadow-2xl rounded-sm py-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <a 
                  href="#programs-page" 
                  onClick={(e) => handleLinkClick(e, '#programs-page', 'programs')}
                  className="block px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all"
                >
                  General Programs
                </a>
                <a 
                  href="#mentorship-page" 
                  onClick={(e) => handleLinkClick(e, '#mentorship-page', 'mentorship')}
                  className="block px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-lime-600 hover:bg-slate-50 transition-all"
                >
                  Mentorship
                </a>
              </div>
            )}
          </div>

          <a href="#services-page" onClick={(e) => handleLinkClick(e, '#services-page', 'services')} className={`font-black uppercase tracking-widest transition-colors text-[8px] lg:text-[10px] ${textColorClass}`}>Services</a>
          <a href="#products-page" onClick={(e) => handleLinkClick(e, '#products-page', 'products')} className={`font-black uppercase tracking-widest transition-colors text-[8px] lg:text-[10px] ${textColorClass}`}>Products</a>
          <a href="#studio-page" onClick={(e) => handleLinkClick(e, '#studio-page', 'studio')} className={`font-black uppercase tracking-widest transition-colors text-[8px] lg:text-[10px] ${textColorClass}`}>Studio AMG</a>
          <a href="#creaitube-page" onClick={(e) => handleLinkClick(e, '#creaitube-page', 'creaitube')} className={`font-black uppercase tracking-widest transition-colors text-[8px] lg:text-[10px] ${textColorClass}`}>CreAItube</a>

          <a
            href="#contact"
            onClick={(e) => {
               const el = document.getElementById('contact');
               if (el && currentView === 'home') {
                 e.preventDefault();
                 setIsOpen(false);
                 el.scrollIntoView({ behavior: 'smooth' });
               } else {
                 setIsOpen(false);
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
          <a href="#home" onClick={(e) => handleLinkClick(e, '#home', 'home')} className="block font-black uppercase tracking-widest text-slate-600 py-2 border-b border-slate-50 text-[10px]">Home</a>
          <a href="#about-page" onClick={(e) => handleLinkClick(e, '#about-page', 'about')} className="block font-black uppercase tracking-widest text-slate-600 py-2 border-b border-slate-50 text-[10px]">About Us</a>
          <div className="py-2 border-b border-slate-50">
            <p className="font-black uppercase tracking-widest text-slate-400 text-[8px] mb-2">Programs</p>
            <div className="pl-4 space-y-2">
              <a href="#programs-page" onClick={(e) => handleLinkClick(e, '#programs-page', 'programs')} className="block font-black uppercase tracking-widest text-slate-600 text-[10px]">General Programs</a>
              <a href="#mentorship-page" onClick={(e) => handleLinkClick(e, '#mentorship-page', 'mentorship')} className="block font-black uppercase tracking-widest text-slate-600 text-[10px]">Mentorship</a>
            </div>
          </div>
          <a href="#services-page" onClick={(e) => handleLinkClick(e, '#services-page', 'services')} className="block font-black uppercase tracking-widest text-slate-600 py-2 border-b border-slate-50 text-[10px]">Services</a>
          <a href="#studio-page" onClick={(e) => handleLinkClick(e, '#studio-page', 'studio')} className="block font-black uppercase tracking-widest text-slate-600 py-2 border-b border-slate-50 text-[10px]">Studio AMG</a>
          <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')} className="block w-full py-4 bg-slate-900 text-white text-center font-black uppercase tracking-widest rounded-sm text-[10px] mt-4">Work With Us</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;