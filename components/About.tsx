import React from 'react';
import SectionWrapper from './SectionWrapper';
import { CheckCircle2, Target, Award, Sparkles, Globe, Cpu, Camera } from 'lucide-react';
import { WHY_CHOOSE_AMG, WHO_WE_SERVE } from '../constants';

const About: React.FC = () => {
  return (
    <div id="about">
      <SectionWrapper bg="white" className="relative">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-10">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-widest rounded-sm border border-blue-100">
                 <Sparkles className="w-3 h-3" /> Strategic Identity
               </div>
               <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] text-shine uppercase">
                 Global Strategic <br /> Enterprise.
               </h2>
            </div>
            
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Azariah Management Group (AMG) is a global strategic consulting, technology innovation, and media enterprise providing international business advisory and cross-border growth solutions.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Strategic Consulting", icon: Globe, desc: "US business formation & cross-border expansion." },
                { title: "Tech & Innovation", icon: Cpu, desc: "Digital transformation & AI-driven roadmaps." },
                { title: "Studio AMG", icon: Camera, desc: "Impact-driven media & strategic storytelling." },
                { title: "Social Enterprise", icon: Target, desc: "Community-centered economic empowerment." }
              ].map((pillar, i) => (
                <div key={i} className="space-y-2 group">
                  <div className="flex items-center gap-3">
                    <pillar.icon className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">{pillar.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase leading-tight">{pillar.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-8">
              <p className="text-sm font-bold text-slate-700 leading-relaxed italic border-l-4 border-lime-500 pl-4">
                "We bridge international opportunities with U.S.-based infrastructure, delivering integrated solutions for modern global enterprises."
              </p>
            </div>
          </div>

          <div className="relative">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-lime-500/10 rounded-full blur-3xl"></div>
             <div className="bg-slate-900 p-8 md:p-14 rounded-sm border border-slate-800 shadow-2xl space-y-10 relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Award className="w-32 h-32 text-white" />
                </div>
                
                <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-lime-400">
                  Why Global Clients Choose AMG
                </h3>
                
                <div className="space-y-6">
                   <div className="grid gap-4">
                     {[
                       "Expertise in U.S. business formation for international founders",
                       "Proven cross-border consulting & diaspora engagement",
                       "Integrated consulting, technology, and media capabilities",
                       "Community-based social enterprise model",
                       "Strategy-driven, innovation-enabled approach"
                     ].map(strength => (
                       <div key={strength} className="flex items-start gap-4 group">
                         <div className="w-6 h-6 rounded-full bg-lime-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-lime-500 transition-all duration-300">
                           <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 group-hover:text-slate-950" />
                         </div>
                         <span className="text-xs font-black uppercase tracking-tight text-slate-300 group-hover:text-white transition-colors">{strength}</span>
                       </div>
                     ))}
                   </div>

                   <div className="pt-8 border-t border-slate-800">
                     <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Primary Jurisdictions</p>
                     <div className="flex flex-wrap gap-3">
                       {["United States", "United Kingdom", "Pan-Africa", "Global Diaspora"].map(loc => (
                         <div key={loc} className="px-4 py-2 bg-slate-800 border border-slate-700 text-[8px] font-black text-white rounded-sm uppercase tracking-widest">
                           {loc}
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