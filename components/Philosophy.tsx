import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Quote } from 'lucide-react';

const Philosophy: React.FC = () => {
  return (
    <SectionWrapper id="philosophy" bg="white" className="relative overflow-hidden border-b border-slate-100 py-32">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-lines opacity-30 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">
        <div className="lg:w-1/3 space-y-6">
          <div className="w-20 h-2 bg-slate-900 mb-6"></div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-[0.8]">
            AZARIAH <br /> <span className="text-lime-600">MANAGEMENT</span> <br /> GROUP.
          </h2>
        </div>
        
        <div className="lg:w-2/3 relative">
          <Quote className="absolute -top-16 -left-16 w-32 h-32 text-slate-50 -z-10" />
          <div className="space-y-12">
            <p className="text-2xl md:text-5xl text-slate-900 font-black leading-[1.1] tracking-tighter uppercase italic border-l-8 border-slate-900 pl-10">
              Strategy should be purposeful, innovation should be responsible, and growth should create lasting value. 
            </p>
            <div className="grid md:grid-cols-2 gap-10">
              <p className="text-lg text-slate-600 font-bold leading-relaxed">
                We partner with visionaries to transform ideas into scalable impact. At Azariah Management Group, we bridge the gap between business intelligence and human-centered design.
              </p>
              <p className="text-lg text-slate-600 font-bold leading-relaxed">
                Our core is rooted in integrity. We ensure every solution strengthens systems, empowers talent, and builds sustainable global futures for our clients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Philosophy;