import React from 'react';
import * as LucideIcons from 'lucide-react';
import { WHAT_WE_DO, HOW_WE_WORK, DIVISIONS } from '../constants';
import SectionWrapper from './SectionWrapper';

const Services: React.FC = () => {
  return (
    <div id="what-we-do">
      <SectionWrapper bg="light">
        <div className="space-y-16">
          <div className="max-w-3xl space-y-6">
            <div className="w-12 h-1 bg-slate-900"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">What We Do</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              This integrated model helps your organization grow with clarity, capacity, and purpose through a multi-faceted approach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHAT_WE_DO.map((service) => {
              const Icon = (LucideIcons as any)[service.icon.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')] || LucideIcons.Layers;
              return (
                <div 
                  key={service.title}
                  className="group bg-white p-10 rounded-sm border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-slate-50 flex items-center justify-center rounded-sm mb-6 group-hover:bg-slate-900 transition-colors duration-500">
                    <Icon className="w-6 h-6 text-slate-900 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper bg="dark" id="divisions">
        <div className="grid lg:grid-cols-2 gap-20">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">How We Work</h2>
              <div className="w-12 h-1 bg-lime-500"></div>
            </div>
            <div className="space-y-8">
              {HOW_WE_WORK.map(item => (
                <div key={item.step} className="flex gap-6 items-start group">
                  <div className="text-5xl font-black text-slate-800 group-hover:text-lime-500/50 transition-colors duration-500">{item.step}</div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Divisions</h2>
              <div className="w-12 h-1 bg-blue-600"></div>
            </div>
            <div className="grid gap-4">
              {DIVISIONS.map(div => (
                <div key={div} className="p-6 bg-slate-800/50 border border-slate-700 rounded-sm hover:border-slate-500 transition-all flex items-center justify-between group">
                  <span className="text-lg font-bold text-slate-200">{div}</span>
                  <LucideIcons.ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-lime-500 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Services;