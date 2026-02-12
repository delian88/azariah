import React from 'react';
import SectionWrapper from './SectionWrapper';
import { PORTFOLIO_PROJECTS } from '../constants';
import { 
  ArrowRight, 
  BarChart3, 
  Globe, 
  Zap, 
  CheckCircle2, 
  Award, 
  Sparkles,
  ExternalLink,
  Target,
  TrendingUp
} from 'lucide-react';

const PortfolioPage: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24">
      {/* HERO */}
      <SectionWrapper bg="white" className="relative overflow-hidden border-b border-slate-100 pb-20">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-10"></div>
        <div className="max-w-4xl space-y-6 reveal active">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
            <Award className="w-4 h-4 text-lime-400" /> Evidence of Excellence
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none uppercase text-shine">
            Portfolio.
          </h1>
          <p className="text-xl text-slate-600 font-medium border-l-4 border-blue-600 pl-6 max-w-2xl">
            From UK-wide cultural festivals to ethical AI deployments, explore how we translate strategic intelligence into measurable results.
          </p>
        </div>
      </SectionWrapper>

      {/* PROJECT GRID */}
      <SectionWrapper bg="light" className="py-24">
        <div className="space-y-32">
          {PORTFOLIO_PROJECTS.map((project, idx) => (
            <div key={project.id} className={`grid lg:grid-cols-2 gap-20 items-center reveal ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`space-y-8 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">{project.division}</span>
                    <div className="h-[1px] w-8 bg-slate-200"></div>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                    {project.title}
                  </h2>
                </div>
                
                <div className="p-8 bg-white border border-slate-100 rounded-sm shadow-xl space-y-4 border-l-8 border-lime-500">
                   <div className="flex items-center gap-2 text-lime-600 font-black text-[10px] uppercase tracking-widest">
                      <BarChart3 className="w-4 h-4" /> Strategic Impact
                   </div>
                   <p className="text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase">
                     {project.impact}
                   </p>
                </div>

                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                   {project.tags.map(tag => (
                     <span key={tag} className="px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest">
                       {tag}
                     </span>
                   ))}
                </div>

                <div className="pt-6">
                   <button 
                     onClick={scrollToContact}
                     className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-all"
                   >
                     View Case Study Details <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                   </button>
                </div>
              </div>

              <div className={`relative group ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                 <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/5 to-lime-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative aspect-video bg-slate-200 overflow-hidden shadow-2xl rounded-sm border-8 border-white group-hover:-translate-y-2 transition-transform duration-700">
                    <img 
                      src={project.image} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
                      alt={project.title} 
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute bottom-6 left-6 p-4 bg-white/95 backdrop-blur-sm border-l-4 border-lime-500 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Project ID: {project.id}</p>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* PROJECTED TARGET SECTION */}
      <SectionWrapper bg="dark" className="relative overflow-hidden py-32">
         <div className="absolute top-0 right-0 w-full h-full bg-grid-lines opacity-5 pointer-events-none"></div>
         <div className="relative z-10 space-y-16">
            <div className="text-center space-y-4 reveal">
               <div className="inline-flex items-center gap-2 text-lime-400 font-black text-[10px] uppercase tracking-[0.4em]">
                  <TrendingUp className="w-4 h-4" /> Strategic Growth
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter text-shine-white">Projected Target</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 text-center">
               {[
                 { label: "Community Partners", value: "1000+", icon: Target },
                 { label: "Projects Delivered", value: "45+", icon: CheckCircle2 },
                 { label: "Media Reach", value: "2.5M+", icon: Globe }
               ].map((stat, i) => (
                 <div key={i} className="space-y-4 reveal">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                       <stat.icon className="w-8 h-8 text-lime-400" />
                    </div>
                    <div className="text-5xl md:text-7xl font-black text-white tracking-tighter text-shine-white">{stat.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{stat.label}</div>
                 </div>
               ))}
            </div>
         </div>
      </SectionWrapper>

      {/* FOOTER CTA */}
      <SectionWrapper bg="white" className="py-32 text-center relative overflow-hidden">
         <div className="max-w-4xl mx-auto space-y-12 reveal">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none text-slate-900 uppercase">
              Build Your Case Study with AMG.
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed">
              Ready to create measurable impact and world-class narratives for your organization?
            </p>
            <div className="pt-8">
               <button 
                 onClick={scrollToContact}
                 className="px-14 py-7 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-4 group mx-auto"
               >
                 Initiate Your Project <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               </button>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default PortfolioPage;