import React from 'react';
import SectionWrapper from './SectionWrapper';
import { SIGNATURE_PROGRAMS } from '../constants';
import { ExternalLink, Zap } from 'lucide-react';

const Programs: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SectionWrapper id="programs" bg="white" className="relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-1/4 h-full bg-slate-50 -translate-y-1/2 -skew-x-12 -z-0"></div>
      
      <div className="space-y-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-lime-600 font-black text-xs uppercase tracking-widest">
              <Zap className="w-4 h-4 fill-lime-500" /> Signature Ventures
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Innovation & Storytelling
            </h2>
            <p className="text-xl text-slate-600 font-medium">
              We don't just consult; we build. Explore our ecosystem of high-impact platforms and programs.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="flex gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <span>Culture</span>
              <span className="text-slate-200">/</span>
              <span>Impact</span>
              <span className="text-slate-200">/</span>
              <span>Growth</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SIGNATURE_PROGRAMS.map(program => (
            <div key={program.title} className="group p-10 border border-slate-100 rounded-sm hover:border-slate-900 transition-all duration-500 relative overflow-hidden bg-white hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]">
              <div className="space-y-6 relative z-10">
                <div className="flex gap-2">
                  {program.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 bg-slate-900 text-white group-hover:bg-lime-500 group-hover:text-slate-950 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-blue-700 transition-colors">{program.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium">{program.description}</p>
                <div className="pt-4">
                   <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-all transform group-hover:translate-x-2">
                     Learn More <ExternalLink className="w-4 h-4" />
                   </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700 opacity-40 z-0"></div>
            </div>
          ))}
        </div>

        <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-center gap-8">
            <button 
              onClick={scrollToContact}
              className="w-full md:w-auto px-12 py-6 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-2xl uppercase tracking-widest text-sm"
            >
              Book Discovery Call
            </button>
            <button className="w-full md:w-auto px-12 py-6 bg-white text-slate-900 border-2 border-slate-900 font-black rounded-sm hover:bg-slate-50 transition-all uppercase tracking-widest text-sm">
              Impact Blueprint
            </button>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Programs;