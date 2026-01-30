import React from 'react';
import SectionWrapper from './SectionWrapper';
import { CheckCircle2, Target, Award } from 'lucide-react';
import { WHY_CHOOSE_AMG, WHO_WE_SERVE } from '../constants';

const About: React.FC = () => {
  return (
    <div id="about">
      <SectionWrapper bg="white">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="inline-block px-3 py-1 bg-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest">Who We Are</div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              A Strategic Partner for Growth, Innovation & Social Impact
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              AMG is a social enterprise and strategic consulting firm operating at the intersection of corporate innovation, community development, and creative media. We partner with leaders who want to build responsibly, scale effectively, and create meaningful impact—locally and globally.
            </p>
            
            <div className="space-y-6 py-6 border-y border-slate-100">
               <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-900">
                 <Target className="w-4 h-4 text-lime-500" /> Who We Serve
               </h3>
               <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                   <p className="text-xs font-bold text-slate-400 uppercase">Primary</p>
                   {WHO_WE_SERVE.primary.map(item => (
                     <div key={item} className="flex gap-2 text-sm font-medium text-slate-700">
                       <span className="text-lime-500">•</span> {item}
                     </div>
                   ))}
                 </div>
                 <div className="space-y-3">
                   <p className="text-xs font-bold text-slate-400 uppercase">Secondary</p>
                   {WHO_WE_SERVE.secondary.map(item => (
                     <div key={item} className="flex gap-2 text-sm font-medium text-slate-700">
                       <span className="text-lime-500">•</span> {item}
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 md:p-12 rounded-sm border border-slate-100 shadow-sm space-y-8">
             <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-900">
               <Award className="w-4 h-4 text-blue-600" /> Why Clients Choose AMG
             </h3>
             
             <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-tighter">Our Strengths</p>
                  <div className="space-y-3">
                    {WHY_CHOOSE_AMG.strengths.map(strength => (
                      <div key={strength} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-tighter">Our Differentiators</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {WHY_CHOOSE_AMG.differentiators.map(diff => (
                      <div key={diff} className="p-3 bg-white border border-slate-100 text-xs font-bold text-slate-600 rounded-sm">
                        {diff}
                      </div>
                    ))}
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