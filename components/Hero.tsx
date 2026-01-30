import React from 'react';
import { ArrowRight, PlayCircle, BarChart3, ShieldCheck, Globe2 } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white/50 backdrop-blur-3xl">
      {/* Background elements */}
      <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-green-50/50 rounded-full blur-3xl opacity-40 -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-10 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900/5 text-slate-800 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-slate-900/5">
            <Globe2 className="w-3 h-3 text-blue-600" />
            Global Strategic Partners
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
            Architecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">Excellence</span> <br />
            at Scale.
          </h1>
          
          <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
            Azariah Management Group provides the precision-engineered consultancy required for high-velocity organizations to navigate complex global markets.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button className="px-10 py-5 bg-slate-900 text-white font-bold rounded-sm hover:bg-slate-800 transition-all flex items-center justify-center group shadow-xl shadow-slate-900/10">
              Start Your Audit
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-white border border-slate-200 text-slate-900 font-bold rounded-sm hover:bg-slate-50 transition-all flex items-center justify-center group">
              <PlayCircle className="w-5 h-5 mr-2 text-blue-600" />
              Our Methodology
            </button>
          </div>
          
          <div className="pt-8 flex flex-wrap items-center gap-10">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Featured Partners</div>
            <div className="flex gap-8 items-center opacity-40 grayscale contrast-125">
               <span className="text-lg font-black tracking-tighter">FINTECH.</span>
               <span className="text-lg font-black tracking-tighter">LOGIX</span>
               <span className="text-lg font-black tracking-tighter">VERTIX</span>
            </div>
          </div>
        </div>

        <div className="relative lg:block hidden group">
          <div className="relative rounded-sm overflow-hidden shadow-2xl transition-all duration-700 group-hover:scale-[1.02] border border-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
              alt="Corporate Excellence" 
              className="w-full h-[650px] object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
          </div>

          {/* Floating Analytics Card */}
          <div className="absolute top-12 -left-12 bg-white/90 backdrop-blur-md p-6 shadow-2xl rounded-sm border border-slate-100 animate-float">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-sm">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Metric</div>
                <div className="text-2xl font-black text-slate-900">+31.4%</div>
              </div>
            </div>
          </div>

          {/* Floating Trust Card */}
          <div className="absolute -bottom-8 right-12 bg-white p-6 shadow-2xl rounded-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 flex items-center justify-center rounded-full">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Enterprise Verified</div>
                <div className="text-xs text-slate-500 font-medium">Compliance level AAA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;