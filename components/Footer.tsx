import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center">
            <Logo variant="dark" className="h-12" />
          </div>
          <p className="text-slate-400 leading-relaxed text-sm">
            Azariah Management Group: Turning purpose into progress through strategic consulting, technology, and social impact.
          </p>
          <div className="flex space-x-4">
            <a 
              href="https://www.linkedin.com/company/azariahmanagementgroup/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href="https://www.instagram.com/azariahmanagementgroup/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Services</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Business Consulting</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Innovation Strategy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Social Impact Design</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Studio AMG Media</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Digital Readiness</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Company</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#about" className="hover:text-white transition-colors">Who We Are</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Our Impact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Client Stories</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Partnerships</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-slate-500" />
              <span>Upper Marlboro, MD, 20772 USA</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-slate-500" />
              <span>+1 (212) 555-0198</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-slate-500" />
              <span>info@azariahmg.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
        <p>© 2024 Azariah Management Group (AMG). All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;