
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
          <p className="text-slate-400 leading-relaxed">
            Revolutionizing management consultancy through data-driven insights and radical operational transparency.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all"><Instagram className="w-4 h-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-lg uppercase tracking-wider text-sm">Services</h4>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-white transition-colors">Strategic Planning</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Digital Transformation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Operations Audit</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Human Capital</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Investment Advisory</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-lg uppercase tracking-wider text-sm">Company</h4>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Our Process</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-lg uppercase tracking-wider text-sm">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-slate-500" />
              <span>1200 Wall Street, NY 10005</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-slate-500" />
              <span>+1 (212) 555-0198</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-slate-500" />
              <span>info@azariahmgmt.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <p>© 2024 Azariah Management Group. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
