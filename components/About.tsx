
import React from 'react';
import { STATS } from '../constants';
import SectionWrapper from './SectionWrapper';

const About: React.FC = () => {
  return (
    <SectionWrapper id="about" bg="white">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1 relative">
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://picsum.photos/seed/abt1/600/800" className="rounded-sm w-full h-64 object-cover shadow-lg" alt="Team 1" />
                <img src="https://picsum.photos/seed/abt2/600/400" className="rounded-sm w-full h-40 object-cover shadow-lg" alt="Team 2" />
              </div>
              <div className="space-y-4 pt-8">
                <img src="https://picsum.photos/seed/abt3/600/400" className="rounded-sm w-full h-40 object-cover shadow-lg" alt="Team 3" />
                <img src="https://picsum.photos/seed/abt4/600/800" className="rounded-sm w-full h-64 object-cover shadow-lg" alt="Team 4" />
              </div>
           </div>
           {/* Floating experience tag */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white p-8 rounded-sm shadow-2xl text-center">
              <div className="text-4xl font-bold">15+</div>
              <div className="text-xs uppercase tracking-widest font-medium opacity-70">Years of Growth</div>
           </div>
        </div>

        <div className="order-1 lg:order-2 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Built on Integrity, Driven by Results.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Azariah Management Group was founded on a simple premise: complexity shouldn't hinder progress. We bridge the gap between high-level vision and tactical execution.
          </p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6">
            <blockquote className="border-l-4 border-slate-900 pl-6 py-2 italic text-slate-700 text-xl">
              "Their ability to identify hidden operational bottlenecks transformed our annual revenue by 24% within just two quarters."
              <footer className="not-italic text-sm font-bold text-slate-900 mt-4 uppercase tracking-widest">— CEO, Global Logistics Corp</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;
