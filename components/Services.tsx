import React from 'react';
import * as LucideIcons from 'lucide-react';
import { SERVICES } from '../constants';
import SectionWrapper from './SectionWrapper';

const Services: React.FC = () => {
  return (
    <SectionWrapper id="services" bg="light">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <div className="w-12 h-1 bg-slate-900"></div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Our Pillars of Excellence</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            This integrated model helps your organization grow with clarity, capacity, and purpose through a multi-faceted approach.
          </p>
          <div className="pt-4">
             <button className="text-slate-900 font-bold border-b-2 border-slate-900 pb-1 hover:text-slate-600 hover:border-slate-600 transition-all">
                Download Capabilities Sheet
             </button>
          </div>
        </div>

        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
          {SERVICES.map((service) => {
            const Icon = (LucideIcons as any)[service.icon.charAt(0).toUpperCase() + service.icon.slice(1)] || LucideIcons.Layers;
            return (
              <div 
                key={service.title}
                className="group bg-white p-10 rounded-sm border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
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
  );
};

export default Services;