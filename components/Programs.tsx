import React from 'react';
import SectionWrapper from './SectionWrapper';
import { SIGNATURE_PROGRAMS } from '../constants';
import { ExternalLink } from 'lucide-react';

const Programs: React.FC = () => {
  return (
    <SectionWrapper id="programs" bg="white">
      <div className="space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight">Signature Programs & Ventures</h2>
          <p className="text-slate-600">Driven by innovation, culture, and storytelling. Our initiatives create measurable impact across diverse sectors.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SIGNATURE_PROGRAMS.map(program => (
            <div key={program.title} className="group p-8 border border-slate-100 rounded-sm hover:border-slate-900 transition-all duration-300 relative overflow-hidden bg-white hover:shadow-2xl">
              <div className="space-y-4 relative z-10">
                <div className="flex gap-2">
                  {program.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 bg-slate-100 text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-black text-slate-900">{program.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{program.description}</p>
                <div className="pt-4">
                   <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-lime-600 transition-colors">
                     View Project <ExternalLink className="w-3 h-3" />
                   </button>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-[3] transition-transform duration-700 opacity-50 z-0"></div>
            </div>
          ))}
        </div>

        <div className="pt-12 text-center">
           <div className="inline-flex flex-col md:flex-row gap-4">
              <button className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-900 transition-all shadow-xl">
                → Book a 20-Minute Discovery Call
              </button>
              <button className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-900 font-black rounded-sm hover:bg-slate-50 transition-all">
                Download Community Impact Blueprint
              </button>
           </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Programs;