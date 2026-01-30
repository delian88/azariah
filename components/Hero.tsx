
import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-slate-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold tracking-wider uppercase">
            Global Strategic Partners
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            Engineering the <span className="text-slate-500 underline decoration-slate-200 underline-offset-8">Future</span> of Enterprise.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed">
            Azariah Management Group delivers precision-driven consultancy for organizations ready to scale, optimize, and dominate their respective markets.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-sm hover:bg-slate-800 transition-all flex items-center group">
              Start Your Audit
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-sm hover:bg-slate-50 transition-all flex items-center group">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Process
            </button>
          </div>
          
          <div className="pt-10 flex items-center space-x-8 opacity-50 filter grayscale grayscale-hover transition-all">
            <div className="font-bold text-slate-400">TRUSTED BY</div>
            <div className="text-xl font-black tracking-widest text-slate-300">FORBES</div>
            <div className="text-xl font-black tracking-widest text-slate-300">REUTERS</div>
            <div className="text-xl font-black tracking-widest text-slate-300">FINANCE</div>
          </div>
        </div>

        <div className="relative lg:block hidden">
          <div className="relative rounded-sm overflow-hidden shadow-2xl transition-transform hover:scale-[1.01] duration-500">
            <img 
              src="https://picsum.photos/seed/executive/1200/1400" 
              alt="Strategic Discussion" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/10"></div>
          </div>
          {/* Floating Data Card */}
          <div className="absolute -bottom-10 -left-10 bg-white p-6 shadow-2xl rounded-sm border border-slate-100 animate-bounce-slow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 flex items-center justify-center rounded-full">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Efficiency Optimized</div>
                <div className="text-xs text-slate-500">+14% Growth last quarter</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
