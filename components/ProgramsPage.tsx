import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  Zap, ArrowRight, ExternalLink, Play, Heart, Globe, 
  Users, Sparkles, Rocket, ShieldCheck, GraduationCap,
  Tv, Gamepad2, Users2, Landmark, Brain, Film
} from 'lucide-react';
import { SIGNATURE_PROGRAMS } from '../constants';

const ProgramsPage: React.FC = () => {
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
    <div className="pt-24">
      {/* HERO SECTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 left-0 w-1/4 h-full bg-slate-50 -skew-x-12 -translate-x-1/2 -z-10"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 reveal">
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
          <div className="relative reveal delay-300">
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
          <div className="text-center space-y-4 max-w-3xl mx-auto reveal">
             <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase text-shine">Signature Initiatives</h2>
             <p className="text-slate-500 text-lg font-medium">Platform-based solutions driving global cultural and economic transformation.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SIGNATURE_PROGRAMS.map((program, i) => {
              const Icon = getProgramIcon(program.title);
              return (
                <div key={program.title} className="reveal flex flex-col h-full bg-white border border-slate-100 rounded-sm hover:border-slate-900 transition-all duration-500 relative overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 group" style={{ transitionDelay: `${i * 100}ms` }}>
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
                    <button className="w-full py-5 border-t border-slate-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-all">
                      Learn More <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700 opacity-20"></div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ProgramsPage;