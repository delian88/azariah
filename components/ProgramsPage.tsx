import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  Zap, ArrowRight, ExternalLink, Play, Heart, Globe, 
  Users, Sparkles, Rocket, ShieldCheck, GraduationCap,
  Tv, Gamepad2, Users2, Landmark, Brain, Film, X, Info
} from 'lucide-react';
import { SIGNATURE_PROGRAMS } from '../constants';

const ProgramsPage: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

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

  const PROGRAM_DETAILS: Record<string, any> = {
    'Start Point': {
      synopsis: "Start Point is a docu-reality series that follows the authentic journeys of entrepreneurs, founders, and CEOs at the pivotal moments where vision meets uncertainty. Rather than spotlighting success alone, the series captures the real decisions, risks, failures, and breakthroughs that shape leadership from the ground up. Through candid storytelling and behind-the-scenes access, Start Point reveals what it truly takes to build something meaningful offering inspiration, practical insight, and human connection for aspiring leaders, innovators, and changemakers.",
      themes: "Entrepreneurship • Leadership • Resilience • Innovation • Purpose",
      format: "Docu-Reality / Business & Human Interest"
    }
  };

  return (
    <div className="pt-24">
      {/* HERO SECTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 left-0 w-1/4 h-full bg-slate-50 -skew-x-12 -translate-x-1/2 -z-10"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 reveal active">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-50 text-lime-800 text-xs font-black uppercase tracking-widest rounded-full border border-lime-100 animate-pulse">
              <Zap className="w-4 h-4 fill-lime-500" /> High-Impact Ventures
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              The Engine of Innovation.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-blue-600 pl-6">
              Our signature programs are the living proof of our commitment to community impact and economic growth.
            </p>
          </div>
          <div className="relative reveal active">
             <div className="aspect-square bg-slate-900 rounded-sm shadow-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071" 
                  alt="Innovation" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute bottom-10 left-10 p-8 bg-white/95 backdrop-blur-sm border-l-8 border-lime-500 max-w-sm shadow-2xl">
                   <p className="text-2xl font-black text-slate-900 tracking-tight">Purpose-Led Innovation in Motion</p>
                </div>
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* PROGRAMS GRID */}
      <SectionWrapper bg="light">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto reveal active">
             <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase text-shine">Signature Initiatives</h2>
             <p className="text-slate-500 text-lg font-medium">Platform-based solutions driving global cultural and economic transformation.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SIGNATURE_PROGRAMS.map((program, i) => {
              const Icon = getProgramIcon(program.title);
              const hasDetail = PROGRAM_DETAILS[program.title];
              
              return (
                <div key={program.title} className="reveal active flex flex-col h-full bg-white border border-slate-100 rounded-sm hover:border-slate-900 transition-all duration-500 relative overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 group">
                  <div className="p-10 space-y-6 flex-grow">
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-slate-50 rounded-sm group-hover:bg-slate-950 transition-colors duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <Icon className="w-8 h-8 text-slate-900 group-hover:text-lime-500 transition-colors" />
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {program.tags.map(tag => (
                          <span key={tag} className="text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 bg-slate-100 text-slate-500 group-hover:bg-lime-500 group-hover:text-slate-900 transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{program.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      {program.description}
                    </p>
                  </div>

                  <div className="p-10 pt-0">
                    <button 
                      onClick={() => setSelectedProgram(program)}
                      className="w-full py-5 border-t border-slate-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-all"
                    >
                      {hasDetail ? 'View Full Content' : 'Learn More'} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700 opacity-20"></div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* PROGRAM DETAIL MODAL */}
      {selectedProgram && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelectedProgram(null)}></div>
          
          <div className="relative w-full max-w-4xl bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in slide-in-from-bottom-10 duration-500 max-h-[90vh]">
            {/* Left Image Side */}
            <div className="w-full md:w-1/3 bg-slate-900 relative">
               <img 
                 src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071" 
                 className="w-full h-full object-cover opacity-50"
                 alt={selectedProgram.title}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent flex items-end p-8">
                  <div className="p-4 bg-lime-500 rounded-sm mb-4">
                     {React.createElement(getProgramIcon(selectedProgram.title), { className: "w-8 h-8 text-slate-950" })}
                  </div>
               </div>
            </div>

            {/* Right Content Side */}
            <div className="flex-1 p-8 md:p-16 overflow-y-auto bg-white">
              <button 
                onClick={() => setSelectedProgram(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-950 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {selectedProgram.tags.map((tag: string) => (
                      <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                    {selectedProgram.title}
                  </h2>
                </div>

                {PROGRAM_DETAILS[selectedProgram.title] ? (
                  <div className="space-y-10">
                    <div className="space-y-6">
                      <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                        <Info className="w-4 h-4 text-lime-500" /> Synopsis
                      </h4>
                      <p className="text-xl text-slate-700 font-medium leading-relaxed border-l-4 border-slate-100 pl-8">
                        {PROGRAM_DETAILS[selectedProgram.title].synopsis}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Themes</p>
                        <p className="text-sm font-bold text-slate-900">{PROGRAM_DETAILS[selectedProgram.title].themes}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Format</p>
                        <p className="text-sm font-bold text-slate-900">{PROGRAM_DETAILS[selectedProgram.title].format}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 border-2 border-dashed border-slate-100 rounded-sm text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Extended content coming soon</p>
                    <p className="text-slate-400 text-[10px] mt-2">Inquire via the contact form for program blueprints.</p>
                  </div>
                )}

                <div className="pt-8">
                   <button 
                     onClick={() => {
                        setSelectedProgram(null);
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                     }}
                     className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-xl uppercase tracking-widest text-[10px] flex items-center gap-4 group"
                   >
                     Partner with this Initiative <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramsPage;