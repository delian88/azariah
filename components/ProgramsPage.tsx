
import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  Zap, ArrowRight, ExternalLink, Play, Heart, Globe, 
  Users, Sparkles, Rocket, ShieldCheck, GraduationCap,
  Tv, Gamepad2, Users2, Landmark, Brain, Film
} from 'lucide-react';
import { SIGNATURE_PROGRAMS } from '../constants';

const ProgramsPage: React.FC = () => {
  // Mapping icons to programs for better visual representation
  const getProgramIcon = (title: string) => {
    switch (title) {
      case 'Start Point': return Tv;
      case 'Captain Chiffon': return Gamepad2;
      case 'Family First': return Heart;
      case 'G.A.M.E.': return Globe;
      case 'AI Force Hub': return Brain;
      case 'BlackbyAngel Initiative': return ShieldCheck;
      default: return Zap;
    }
  };

  return (
    <div className="pt-24 animate-in fade-in duration-1000">
      {/* HERO SECTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 left-0 w-1/4 h-full bg-slate-50 -skew-x-12 -translate-x-1/2 z-0"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-50 text-lime-800 text-xs font-black uppercase tracking-widest rounded-full border border-lime-100">
              <Zap className="w-4 h-4 fill-lime-500" /> Signature Ventures & Impact Platforms
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Innovation & Storytelling Ecosystem
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-blue-600 pl-6">
              We don’t just consult; we build. Our signature programs are the living proof of our commitment to 
              community impact, economic growth, and creative storytelling.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-xl uppercase tracking-widest text-xs">
                Partner with a Program
              </button>
              <button className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-900 font-black rounded-sm hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">
                View Impact Report
              </button>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square bg-slate-900 rounded-sm shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-lime-500/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071" 
                  alt="Innovation" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-10 left-10 p-8 bg-white/95 backdrop-blur-sm border-l-8 border-lime-500 max-w-sm">
                   <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Current Reach</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tight">Across 4 Continents & 12 Specialized Industries</p>
                </div>
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* PROGRAMS GRID */}
      <SectionWrapper bg="light">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase text-shine">Our Signature Initiatives</h2>
             <p className="text-slate-500 text-lg">Platform-based solutions that drive cultural and economic transformation.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SIGNATURE_PROGRAMS.map((program, i) => {
              const Icon = getProgramIcon(program.title);
              return (
                <div key={program.title} className="group flex flex-col h-full bg-white border border-slate-100 rounded-sm hover:border-slate-900 transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-2xl">
                  <div className="p-10 space-y-6 flex-grow">
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-slate-50 rounded-sm group-hover:bg-slate-950 transition-colors duration-500">
                        <Icon className="w-8 h-8 text-slate-900 group-hover:text-lime-500 transition-colors" />
                      </div>
                      <div className="flex gap-2">
                        {program.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 bg-slate-100 text-slate-500 group-hover:bg-lime-500 group-hover:text-slate-900 transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{program.title}</h3>
                    <p className="text-slate-500 text-base leading-relaxed font-medium">
                      {program.description}
                    </p>

                    <ul className="space-y-3 pt-4">
                      {['Strategic Alignment', 'Community Engagement', 'Scalable Impact'].map(point => (
                        <li key={point} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-10 pt-0">
                    <button className="w-full py-5 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-blue-700 transition-all">
                      Learn More <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* WHY THESE PROGRAMS MATTER */}
      <SectionWrapper bg="white">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">Impact-Led Ventures</h2>
            <div className="space-y-8">
               {[
                 { 
                   title: 'Bridging the Knowledge Gap', 
                   desc: 'Our programs like Start Point and AI Force Hub provide real-world insights and tools to underserved entrepreneurs and organizations.',
                   icon: GraduationCap
                 },
                 { 
                   title: 'Global Trade & Innovation', 
                   desc: 'G.A.M.E. builds a powerful ecosystem for diaspora innovation, creating sustainable trade pathways between the US, EU, and Africa.',
                   icon: Landmark
                 },
                 { 
                   title: 'Social & Emotional Wellness', 
                   desc: 'Initiatives like Family First and BlackbyAngel focus on the human core of community development: mental health and unity.',
                   icon: Heart
                 }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 group">
                   <div className="shrink-0 p-4 bg-slate-50 rounded-sm group-hover:bg-slate-900 transition-all">
                      <item.icon className="w-6 h-6 text-blue-600 group-hover:text-lime-500" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-slate-900 p-10 md:p-16 rounded-sm text-white shadow-2xl space-y-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <Sparkles className="w-40 h-40" />
             </div>
             <h3 className="text-3xl font-black tracking-tighter uppercase text-shine-white">The Studio AMG Advantage</h3>
             <p className="text-slate-400 font-medium">
               Most of our programs are powered by Studio AMG, ensuring that every initiative isn't just a project—it's a story that reaches millions.
             </p>
             <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Advocacy Media', icon: Tv },
                  { label: 'Docu-Series', icon: Film },
                  { label: 'Impact Campaigns', icon: Users2 },
                  { label: 'Narrative Dev', icon: Sparkles }
                ].map((feat, i) => (
                  <div key={i} className="p-6 border border-slate-700 hover:border-lime-500 transition-all flex flex-col gap-3">
                     <feat.icon className="w-5 h-5 text-lime-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest">{feat.label}</span>
                  </div>
                ))}
             </div>
             <button className="w-full py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-lime-500 transition-all">
                Explore Studio Media
             </button>
          </div>
        </div>
      </SectionWrapper>

      {/* CALL TO ACTION */}
      <SectionWrapper bg="light" className="text-center py-32 relative overflow-hidden">
         <div className="max-w-4xl mx-auto space-y-12 relative z-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-shine">
              Ready to Join the Movement?
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">
              We are actively seeking strategic partners, sponsors, and collaborators for our 2024-2025 program cycle. 
              Let's create measurable transformation together.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-6">
               <a 
                 href="#contact" 
                 className="group px-14 py-7 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-2xl uppercase tracking-[0.1em] text-sm flex items-center gap-4 border-b-4 border-slate-700 active:translate-y-1 active:border-b-0"
               >
                 Inquire About Program Partnership
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
               </a>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default ProgramsPage;
