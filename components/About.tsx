import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Sparkles, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div id="about">
      <SectionWrapper bg="white" className="relative border-y border-slate-100 py-32">
        <div className="grid lg:grid-cols-1 gap-12 items-start">
          <div className="space-y-12 max-w-6xl mx-auto">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-widest rounded-sm border border-blue-100">
                 <Sparkles className="w-3 h-3" /> Strategic Identity
               </div>
               <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] uppercase text-shine">
                 Global Strategic Enterprise.
               </h2>
            </div>
            
            <div className="space-y-8 text-lg md:text-2xl text-slate-600 leading-relaxed font-bold tracking-tight">
              <p>
                <span className="text-blue-600 font-black uppercase tracking-widest mr-3">Azariah Management Group (AMG):</span>
                Azariah Management Group (AMG) is a global strategic consulting, technology innovation, and media enterprise providing international business advisory and cross-border growth solutions. Headquartered in the United States and serving clients across the U.S., United Kingdom, Africa, and global diaspora markets, AMG supports entrepreneurs, startups, nonprofits, and institutions in building scalable, compliant, and impact-driven organizations. We operate at the intersection of strategy, technology, storytelling, and community development — delivering integrated solutions for modern global enterprises. Our expertise in diaspora markets and multicultural business environments allows us to bridge international opportunities with U.S.-based infrastructure. AMG is not just a consulting firm — we are a global growth partner building sustainable enterprises, digital ecosystems, and impact platforms designed for long-term relevance.
              </p>
            </div>
            
            <div className="pt-8 flex flex-col md:flex-row items-center gap-8">
              <a 
                href="#about-page" 
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#about-page';
                }}
                className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-all"
              >
                Read The Complete Strategic Narrative <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </a>
              <div className="h-[1px] flex-1 bg-slate-100 hidden md:block"></div>
              <div className="flex gap-4">
                 {["USA", "UK", "Pan-Africa", "Global Diaspora"].map(loc => (
                   <span key={loc} className="text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-3 py-1 rounded-sm">
                     {loc}
                   </span>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default About;