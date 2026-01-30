import React from 'react';
import { STATS } from '../constants';
import SectionWrapper from './SectionWrapper';
import { CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <SectionWrapper id="about" bg="white">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1 relative">
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" className="rounded-sm w-full h-64 object-cover shadow-lg" alt="Workshop" />
                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800" className="rounded-sm w-full h-40 object-cover shadow-lg" alt="Analysis" />
              </div>
              <div className="space-y-4 pt-8">
                <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800" className="rounded-sm w-full h-40 object-cover shadow-lg" alt="Success" />
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" className="rounded-sm w-full h-64 object-cover shadow-lg" alt="Team" />
              </div>
           </div>
           {/* Floating experience tag */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white p-8 rounded-sm shadow-2xl text-center">
              <div className="text-4xl font-bold">AMG</div>
              <div className="text-xs uppercase tracking-widest font-medium opacity-70">Social Enterprise</div>
           </div>
        </div>

        <div className="order-1 lg:order-2 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            A Strategic Partner for Growth, Innovation & Social Impact
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            AMG is a social enterprise and strategic consulting firm operating at the intersection of corporate innovation, community development, and creative media. We partner with leaders who want to build responsibly, scale effectively, and create meaningful impact.
          </p>
          
          <div className="space-y-4 pt-2">
            {[
              "Management & business consulting",
              "Innovation & technology strategy (AI, digital readiness)",
              "Community and social impact program design",
              "Creative storytelling and advocacy through Studio AMG"
            ].map((pillar) => (
              <div key={pillar} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#84cc16] shrink-0" />
                <span className="text-slate-700 font-medium">{pillar}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 pt-4 border-t border-slate-100">
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
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;