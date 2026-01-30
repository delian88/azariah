import React from 'react';
import { ArrowRight, PlayCircle, BarChart3, ShieldCheck, Globe2 } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-white/40 backdrop-blur-xl">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 -z-10 w-[1000px] h-[1000px] bg-blue-50/40 rounded-full blur-[120px] opacity-70 translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[800px] h-[800px] bg-lime-50/40 rounded-full blur-[100px] opacity-50 -translate-x-1/4 translate-y-1/4"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-2 gap-20 items-center relative z-10">
        <div className="space-y-12 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-sm text-[10px] font-bold tracking-[0.25em] uppercase shadow-lg shadow-slate-900/10">
            <Globe2 className="w-3 h-3 text-lime-400" />
            Global Infrastructure
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black text-slate-900 leading-[0.9] tracking-tighter">
            Build <br />
            <span className="text-[#005696]">Legacy</span> <br />
            Efficiency.
          </h1>
          
          <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
            Azariah Management Group delivers the analytical precision and operational rigor required for tier-one global organizations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
            <button className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm hover:bg-black transition-all flex items-center justify-center group shadow-2xl shadow-slate-900/20">
              Launch Partnership
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-sm hover:border-slate-300 transition-all flex items-center justify-center group">
              <PlayCircle className="w-5 h-5 mr-2 text-[#005696]" />
              Watch Process
            </button>
          </div>
          
          <div className="pt-12 flex flex-wrap items-center gap-12">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Reach</div>
            <div className="flex gap-10 items-center opacity-30 grayscale saturate-0 contrast-150">
               <span className="text-2xl font-black italic tracking-tighter">CORP.</span>
               <span className="text-2xl font-black italic tracking-tighter">INSTITUTION</span>
               <span className="text-2xl font-black italic tracking-tighter">VENTURE</span>
            </div>
          </div>
        </div>

        <div className="relative lg:block hidden">
          <div className="relative rounded-sm overflow-hidden shadow-[0_40px_100px_-15px_rgba(0,0,0,0.15)] border border-slate-100 animate-in zoom-in-95 duration-1000">
            <img 
              src="https://images.unsplash.com/photo-1570126618983-dd757552a99a?auto=format&fit=crop&q=80&w=2070" 
              alt="Strategic Vision" 
              className="w-full h-[700px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#005696]/20 to-transparent"></div>
          </div>

          {/* Floating High-Performance Card */}
          <div className="absolute -top-10 -left-10 bg-white p-8 shadow-2xl rounded-sm border border-slate-50 animate-float">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#005696] flex items-center justify-center rounded-sm">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Efficiency</div>
                <div className="text-3xl font-black text-slate-900">99.2%</div>
              </div>
            </div>
          </div>

          {/* Floating Trust Badge */}
          <div className="absolute -bottom-10 right-10 bg-white p-8 shadow-2xl rounded-sm border border-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-lime-100 flex items-center justify-center rounded-full">
                <ShieldCheck className="w-6 h-6 text-[#84cc16]" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-900">Verified Strategic</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Audit Pass 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;