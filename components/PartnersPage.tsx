import React from 'react';
import SectionWrapper from './SectionWrapper';
import { PARTNERS } from '../constants';
import { 
  Globe, 
  Handshake, 
  Target, 
  Briefcase, 
  Award, 
  Zap, 
  ShieldCheck, 
  ExternalLink,
  Users
} from 'lucide-react';

const PartnersPage: React.FC = () => {
  const categories = ["Global Strategy", "Media & Culture", "Technology", "Social Impact", "Community", "Creative Services"];

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24">
      {/* HERO */}
      <SectionWrapper bg="white" className="relative overflow-hidden border-b border-slate-100 pb-20">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-10"></div>
        <div className="max-w-4xl space-y-6 reveal active">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
            <Handshake className="w-4 h-4 text-lime-500" /> Strategic Ecosystem
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none uppercase text-shine">
            Partners & Clients.
          </h1>
          <p className="text-xl text-slate-600 font-medium border-l-4 border-blue-600 pl-6 max-w-2xl">
            We collaborate with global visionaries, technology leaders, and community advocates to bridge the gap between innovation and impact.
          </p>
        </div>
      </SectionWrapper>

      {/* CATEGORIZED PARTNERS */}
      <SectionWrapper bg="light" className="py-20">
        <div className="space-y-32">
          {categories.map((cat, idx) => {
            const catPartners = PARTNERS.filter(p => p.category === cat);
            if (catPartners.length === 0) return null;

            return (
              <div key={idx} className="space-y-12 reveal">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">{cat}</h2>
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {catPartners.map((partner, pIdx) => (
                    <div key={pIdx} className="bg-white p-10 border border-slate-100 rounded-sm hover:border-slate-900 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
                       <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                             <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-lime-500" />
                          </div>
                          {partner.url && (
                             <a href={partner.url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-600">
                               <ExternalLink className="w-4 h-4" />
                             </a>
                          )}
                       </div>
                       <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4 group-hover:text-blue-600 transition-colors">
                         {partner.name}
                       </h3>
                       <p className="text-slate-500 text-sm font-medium leading-relaxed flex-1">
                         {partner.desc || "Collaborative strategic partner within the AMG global ecosystem."}
                       </p>
                       <div className="pt-6 mt-6 border-t border-slate-50 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-300 group-hover:text-slate-900">
                          <ShieldCheck className="w-3 h-3 text-lime-500" /> Verified Partnership
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* BECOME A PARTNER CTA */}
      <SectionWrapper bg="dark" className="py-32 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-600/5 -z-10"></div>
         <div className="max-w-4xl mx-auto space-y-12 relative z-10 reveal">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-shine-white uppercase">
              Join the Ecosystem.
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
              We are always looking to partner with organizations that prioritize purpose-driven growth and ethical innovation.
            </p>
            <div className="pt-8">
               <button 
                 onClick={scrollToContact}
                 className="px-14 py-7 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-4 group mx-auto"
               >
                 Inquire About Partnership <Handshake className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               </button>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default PartnersPage;