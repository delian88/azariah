import React from 'react';
import SectionWrapper from './SectionWrapper';
import { CheckCircle2, Target, Award, Sparkles } from 'lucide-react';
import { WHY_CHOOSE_AMG, WHO_WE_SERVE } from '../constants';

const About: React.FC = () => {
  return (
    <div id="about">
      <SectionWrapper bg="white" className="relative">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-10">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-widest rounded-sm border border-blue-100">
                 <Sparkles className="w-3 h-3" /> Who We Are
               </div>
               <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] text-shine">
                 A Strategic Partner for Global Growth
               </h2>
            </div>
            
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              AMG is a social enterprise and strategic consulting firm operating at the intersection of corporate innovation, community development, and creative media.
            </p>
            
            <div className="space-y-8 py-8 border-y border-slate-100">
               <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                 <Target className="w-5 h-5 text-lime-500" /> Primary Audiences
               </h3>
               <div className="grid sm:grid-cols-2 gap-4">
                 {WHO_WE_SERVE.primary.map(item => (
                   <div key={item} className="p-4 bg-slate-50 border-l-4 border-lime-500 flex items-center gap-3 text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors">
                     {item}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="relative">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-lime-500/10 rounded-full blur-3xl"></div>
             <div className="bg-slate-900 p-8 md:p-14 rounded-sm border border-slate-800 shadow-2xl space-y-10 relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Award className="w-32 h-32 text-white" />
                </div>
                
                <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-lime-400">
                  Why Clients Choose AMG
                </h3>
                
                <div className="space-y-8">
                   <div className="grid gap-4">
                     {WHY_CHOOSE_AMG.strengths.map(strength => (
                       <div key={strength} className="flex items-start gap-4 group">
                         <div className="w-6 h-6 rounded-full bg-lime-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-lime-500 transition-all duration-300">
                           <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 group-hover:text-slate-950" />
                         </div>
                         <span className="text-base font-medium text-slate-300 group-hover:text-white transition-colors">{strength}</span>
                       </div>
                     ))}
                   </div>

                   <div className="pt-8 border-t border-slate-800">
                     <p className="text-[10px] font-black text-slate-500 uppercase mb-6 tracking-widest">Core Differentiators</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {WHY_CHOOSE_AMG.differentiators.map(diff => (
                         <div key={diff} className="p-4 bg-slate-800/50 border border-slate-700 text-xs font-bold text-white rounded-sm hover:border-lime-500 transition-all cursor-default">
                           {diff}
                         </div>
                       ))}
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default About;