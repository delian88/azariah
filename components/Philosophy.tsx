import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Quote } from 'lucide-react';

const Philosophy: React.FC = () => {
  return (
    <SectionWrapper id="philosophy" bg="white" className="relative overflow-hidden border-y border-slate-100">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-30 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
        <div className="lg:w-1/3 space-y-4">
          <div className="w-12 h-1 bg-lime-500 mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Azariah Management <br /> Group Philosophy
          </h2>
        </div>
        
        <div className="lg:w-2/3 relative">
          <Quote className="absolute -top-10 -left-10 w-20 h-20 text-slate-100 -z-10" />
          <div className="border-l-4 border-blue-600 pl-8 md:pl-12 py-2">
            <p className="text-xl md:text-3xl text-slate-700 font-bold leading-tight md:leading-snug">
              At Azariah Management Group, we believe that strategy should be purposeful, innovation should be responsible, and growth should create lasting value. 
            </p>
            <div className="mt-8 space-y-6">
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                We partner with visionaries, organizations, and communities to transform ideas into scalable impact—blending business intelligence, technology, and human-centered design. 
              </p>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Our philosophy is rooted in integrity, collaboration, and stewardship, ensuring that every solution we deliver strengthens systems, empowers people, and builds sustainable futures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Philosophy;