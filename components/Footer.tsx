import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  onNavigate?: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const socialLinks = [
    { Icon: Linkedin, href: "#", label: "LinkedIn" },
    { Icon: Instagram, href: "#", label: "Instagram" },
    { Icon: Twitter, href: "https://x.com/AzariahGroup", label: "X" },
    { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61587353685276", label: "Facebook" }
  ];

  const handleLinkClick = (e: React.MouseEvent, view: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(view);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-32 pb-12 px-6 md:px-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <div className="space-y-8">
          <Logo variant="dark" className="h-6" />
          <p className="text-slate-500 leading-relaxed font-bold text-sm">
            AZARIAH MANAGEMENT GROUP: Advanced strategic consulting, engineering, and digital transformation for a borderless world.
          </p>
          <div className="flex space-x-2">
            {socialLinks.map((social, i) => (
              <a 
                key={i}
                href={social.href} 
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-12 h-12 bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-lime-500 hover:text-slate-950 transition-all"
              >
                <social.Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-black mb-8 uppercase tracking-[0.3em] text-[11px] border-l-4 border-lime-500 pl-4">Divisions</h4>
          <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
            <li><a href="#services-page" onClick={(e) => handleLinkClick(e, 'services')} className="hover:text-white transition-colors">Strategy</a></li>
            <li><a href="#services-page" onClick={(e) => handleLinkClick(e, 'services')} className="hover:text-white transition-colors">Innovation</a></li>
            <li><a href="#studio-page" onClick={(e) => handleLinkClick(e, 'studio')} className="hover:text-white transition-colors">Studio AMG</a></li>
            <li><a href="#products-page" onClick={(e) => handleLinkClick(e, 'products')} className="hover:text-white transition-colors">Digital OS</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-black mb-8 uppercase tracking-[0.3em] text-[11px] border-l-4 border-blue-600 pl-4">Company</h4>
          <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
            <li><a href="#portfolio-page" onClick={(e) => handleLinkClick(e, 'portfolio')} className="hover:text-white transition-colors">Portfolio</a></li>
            <li><a href="#partners-page" onClick={(e) => handleLinkClick(e, 'partners')} className="hover:text-white transition-colors">Partners</a></li>
            <li><a href="#about-page" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-white transition-colors">Who We Are</a></li>
            <li><a href="#programs-page" onClick={(e) => handleLinkClick(e, 'programs')} className="hover:text-white transition-colors">Programs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-black mb-8 uppercase tracking-[0.3em] text-[11px] border-l-4 border-slate-600 pl-4">Intelligence</h4>
          <ul className="space-y-6 text-xs font-bold uppercase tracking-widest">
            <li className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-lime-500 shrink-0" />
              <span>Upper Marlboro, MD, 20772 USA</span>
            </li>
            <li className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-blue-500 shrink-0" />
              <span className="break-all">info@azariahmg.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600 uppercase tracking-[0.5em] font-black">
        <p>© {new Date().getFullYear()} AZARIAH MANAGEMENT GROUP. BUILT FOR SCALE.</p>
        <div className="flex space-x-8 mt-6 md:mt-0">
          <a href="#terms-page" onClick={(e) => handleLinkClick(e, 'terms')} className="hover:text-white transition-colors">Privacy</a>
          <a href="#terms-page" onClick={(e) => handleLinkClick(e, 'terms')} className="hover:text-white transition-colors">Terms</a>
          <a href="#terms-page" onClick={(e) => handleLinkClick(e, 'terms')} className="hover:text-white transition-colors">Legal</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;