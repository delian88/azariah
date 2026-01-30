import React from 'react';
import SectionWrapper from './SectionWrapper';
import { ShieldCheck, Cpu, Briefcase, Heart, Camera, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { WHAT_WE_DO, DIVISIONS } from '../constants';

const ServicesPage: React.FC = () => {
  return (
    <div className="pt-24 animate-in fade-in duration-1000">
      {/* SECTION 1 — PAGE INTRODUCTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100">
              <Globe className="w-4 h-4 animate-pulse" /> Corporate Social Responsibility Consulting
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] text-shine">
              Strategy, Innovation & Impact—Built for Organizations Ready to Grow
            </h1>
            
            <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-lime-500 pl-6">
              <p>
                Azariah Management Group (AMG) provides integrated consulting, program execution,
                innovation support, and creative storytelling that help organizations drive measurable community
                impact and sustainable growth.
              </p>
              <p>
                We partner with corporations, nonprofits, public-sector agencies, start-ups, and international
                partners who want strategic clarity, operational strength, and meaningful social responsibility.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-xl uppercase tracking-widest text-sm">
                Get Strategic Clarity
              </button>
              <button className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-900 font-black rounded-sm hover:bg-slate-50 transition-all uppercase tracking-widest text-sm">
                Our Impact Framework
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/10 to-blue-600/10 blur-3xl rounded-full"></div>
            <div className="relative bg-slate-50 border border-slate-100 p-8 rounded-2xl shadow-inner grid grid-cols-2 gap-4">
               {[
                 { label: 'CSR Consulting', color: 'bg-lime-500' },
                 { label: 'Nonprofit Strategy', color: 'bg-blue-600' },
                 { label: 'AI Strategy', color: 'bg-slate-900' },
                 { label: 'Creative Media', color: 'bg-blue-400' }
               ].map(card => (
                 <div key={card.label} className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-40 group hover:shadow-lg transition-all">
                    <div className={`w-8 h-1 ${card.color} group-hover:w-full transition-all duration-500`}></div>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{card.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CORE SERVICES BREAKDOWN */}
      <SectionWrapper bg="light">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">Detailed Service Pillars</h2>
             <p className="text-slate-500 text-lg">Integrated solutions that scale with your organizational maturity.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHAT_WE_DO.map((service, idx) => {
              const icons = [Briefcase, ShieldCheck, Cpu, Heart, Camera];
              const Icon = icons[idx] || Briefcase;
              return (
                <div key={service.title} className="bg-white p-12 border border-slate-100 rounded-sm hover:shadow-2xl transition-all duration-500 group">
                  <div className="mb-8 p-4 bg-slate-50 inline-block rounded-sm group-hover:bg-slate-950 transition-colors">
                    <Icon className="w-8 h-8 text-slate-950 group-hover:text-lime-500 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {['Strategic Readiness', 'Growth Planning', 'Impact Metrics'].map(item => (
                      <li key={item} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-lime-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* DIVISIONS & CROSS-SELLING */}
      <SectionWrapper bg="dark">
         <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-shine-white">Our Operational Divisions</h2>
               <p className="text-slate-400 text-lg leading-relaxed">
                 By leveraging multi-division expertise, we offer a capacity-building model that most boutique firms cannot match. From infrastructure to media production, we are your execution partner.
               </p>
               <div className="space-y-4">
                 {DIVISIONS.map(div => (
                   <div key={div} className="flex items-center justify-between p-5 bg-slate-800 border border-slate-700 rounded-sm hover:border-lime-500 transition-all group">
                     <span className="text-lg font-bold text-white">{div}</span>
                     <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-lime-500 transition-all transform group-hover:translate-x-2" />
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="bg-white p-10 md:p-16 rounded-sm space-y-10 text-slate-950 shadow-2xl relative">
               <div className="absolute top-0 right-0 p-4">
                  <ShieldCheck className="w-12 h-12 text-blue-500 opacity-20" />
               </div>
               <h3 className="text-3xl font-black tracking-tighter uppercase text-shine">The AMG Advantage</h3>
               <div className="space-y-6">
                 {[
                   { t: 'Integrated Ecosystem', d: 'Consulting + Innovation + Media in one place.' },
                   { t: 'Outcome Oriented', d: 'We frame services around transformation, not just deliverables.' },
                   { t: 'Expertise & Capacity', d: 'Depth to handle complex government and private-sector mandates.' }
                 ].map(adv => (
                   <div key={adv.t} className="space-y-1">
                      <div className="text-sm font-black text-blue-800 uppercase tracking-widest">{adv.t}</div>
                      <p className="text-slate-600 text-sm font-medium">{adv.d}</p>
                   </div>
                 ))}
               </div>
               <button className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-lime-500 hover:text-slate-950 transition-all">
                 Request Full Service Brochure
               </button>
            </div>
         </div>
      </SectionWrapper>

      {/* CTA SECTION */}
      <SectionWrapper bg="white" className="text-center py-32">
         <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-shine">Ready to Build Your Impact-Driven Future?</h2>
            <p className="text-xl text-slate-500 font-medium">
              Whether you're a startup seeking AI strategy or a corporation looking for CSR excellence, our team is ready to execute.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
               <a href="#contact" className="px-12 py-6 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-2xl uppercase tracking-widest">
                 Book Discovery Call
               </a>
               <button className="px-12 py-6 bg-white text-slate-900 border-2 border-slate-900 font-black rounded-sm hover:bg-slate-50 transition-all uppercase tracking-widest">
                 View Case Studies
               </button>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default ServicesPage;