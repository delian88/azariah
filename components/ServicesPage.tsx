import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  ShieldCheck, Cpu, Briefcase, Heart, Camera, Globe, ArrowRight, CheckCircle2, 
  Users, BarChart3, Target, Share2, Search, ClipboardList, Coins, Layout, 
  MessageSquare, Sparkles, Landmark, Puzzle, ClipboardCheck, FileText, Zap, Users2,
  Rocket, Workflow, RefreshCcw, Brain, Settings, Layers,
  MapPin, HeartPulse, GraduationCap, LineChart, Compass, Lightbulb,
  Video, Play, Mic, Film, Megaphone, Clapperboard, Calendar, ShieldAlert, Code2, Terminal, Monitor, Lock
} from 'lucide-react';
import { WHAT_WE_DO, DIVISIONS } from '../constants';

const ServicesPage: React.FC = () => {
  return (
    <div className="pt-24">
      {/* SECTION 1 — PAGE INTRODUCTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-10"></div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100 animate-pulse">
              <Globe className="w-4 h-4" /> Integrated Strategic Ecosystem
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] text-shine">
              Strategy, Innovation & Impact Built for Scale
            </h1>
            
            <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-lime-500 pl-6 animate-in slide-in-from-left duration-700">
              <p>
                Azariah Management Group (AMG) provides integrated consulting, program execution,
                innovation support, and creative storytelling that help organizations drive measurable community
                impact and sustainable growth.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-xl uppercase tracking-widest text-sm hover:-translate-y-1">
                Get Strategic Clarity
              </button>
              <button className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-900 font-black rounded-sm hover:bg-slate-50 transition-all uppercase tracking-widest text-sm hover:-translate-y-1">
                Our Impact Framework
              </button>
            </div>
          </div>

          <div className="relative reveal delay-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/10 to-blue-600/10 blur-3xl rounded-full"></div>
            <div className="relative bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-inner grid grid-cols-2 gap-4">
               {[
                 { label: 'Cyber Security', color: 'bg-red-500', icon: ShieldAlert },
                 { label: 'Software Eng', color: 'bg-blue-600', icon: Code2 },
                 { label: 'Web Development', color: 'bg-slate-900', icon: Monitor },
                 { label: 'AI Strategy', color: 'bg-lime-500', icon: Brain }
               ].map((card, i) => (
                 <div key={card.label} className="p-6 bg-white rounded-xl shadow-md border border-slate-100 flex flex-col justify-between h-40 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="flex justify-between items-start">
                      <div className={`w-8 h-1 ${card.color} group-hover:w-full transition-all duration-700`}></div>
                      <card.icon className="w-5 h-5 text-slate-200 group-hover:text-slate-900 transition-colors" />
                    </div>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{card.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* NEW SECTION — TECHNOLOGY & DIGITAL ENGINEERING */}
      <SectionWrapper bg="dark" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5">
           <Code2 className="w-96 h-96 text-white" />
        </div>
        <div className="space-y-16 relative z-10">
          <div className="max-w-3xl space-y-6 reveal">
            <div className="w-16 h-1 bg-lime-500 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none text-shine-white">
              Digital Engineering & Cyber Resilience
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              We build and protect the technical foundations of modern organizations, ensuring scalability, performance, and uncompromising security.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cyber Security */}
            <div className="reveal p-10 bg-slate-800/50 border border-slate-700 rounded-sm hover:border-red-500 transition-all group">
              <Lock className="w-10 h-10 text-red-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Cyber Security</h3>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> Enterprise Threat Protection</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> Risk & Vulnerability Audits</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> Secure Cloud Architecture</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> Incident Response Planning</li>
              </ul>
            </div>

            {/* Web Development */}
            <div className="reveal delay-100 p-10 bg-slate-800/50 border border-slate-700 rounded-sm hover:border-blue-500 transition-all group">
              <Monitor className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Web Development</h3>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Custom Platform Engineering</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> High-Performance E-commerce</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Progressive Web Apps (PWA)</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Accessible UX/UI Implementation</li>
              </ul>
            </div>

            {/* Software Engineering */}
            <div className="reveal delay-200 p-10 bg-slate-800/50 border border-slate-700 rounded-sm hover:border-lime-500 transition-all group">
              <Terminal className="w-10 h-10 text-lime-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Software Engineering</h3>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0" /> Full-Stack Custom Systems</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0" /> API Integration & Microservices</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0" /> Enterprise Software Design</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0" /> Legacy System Modernization</li>
              </ul>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 2 — SERVICE CATEGORY: CSR & STRATEGY */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="order-2 lg:order-1 space-y-12">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Target, text: "CSR strategy development & execution" },
                { icon: Users, text: "Community impact framework design" },
                { icon: Globe, text: "Partnership development" },
                { icon: Heart, text: "Grantmaking support" },
                { icon: BarChart3, text: "CSR reporting & metrics" },
                { icon: Share2, text: "Employee engagement" }
              ].map((item, i) => (
                <div key={i} className={`reveal flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-sm hover:border-lime-500 transition-all group hover:shadow-lg`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="p-2 bg-slate-50 rounded-sm group-hover:bg-lime-500 transition-colors">
                    <item.icon className="w-5 h-5 text-slate-900 group-hover:text-white group-hover:rotate-12 transition-all" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8 reveal">
            <div className="w-16 h-1 bg-lime-500 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Corporate Social Responsibility
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Designing sustainable ecosystems of shared value that strengthen communities and corporate brand equity.
            </p>
            <div className="p-8 bg-slate-900 text-white rounded-sm border-l-8 border-lime-500 shadow-xl group hover:shadow-2xl transition-all">
               <div className="text-[10px] font-black uppercase tracking-widest text-lime-400 mb-2">The Outcome</div>
               <p className="text-lg font-medium italic group-hover:text-lime-200 transition-colors">
                 "A CSR function that is strategic, credible, and deeply connected to global standards."
               </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 3 — SERVICE CATEGORY: NONPROFIT STRATEGY */}
      <SectionWrapper bg="white" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 reveal">
            <div className="w-16 h-1 bg-blue-600 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Nonprofit Strategy & Capacity
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Transforming visionary missions into operationally resilient, investment-ready organizations.
            </p>
            <div className="p-8 bg-blue-50 border border-blue-100 rounded-sm relative overflow-hidden group hover:bg-white hover:shadow-2xl transition-all">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <ShieldCheck className="w-20 h-20 text-blue-900" />
               </div>
               <div className="text-[10px] font-black uppercase tracking-widest text-blue-800 mb-2">The Mission</div>
               <p className="text-lg font-bold text-slate-800">
                 "Transforming visibility into investment-ready stability."
               </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Search, title: "Assessments", desc: "Gap analysis and health checks." },
              { icon: ClipboardList, title: "Planning", desc: "Practical growth roadmaps." },
              { icon: Coins, title: "Fundraising", desc: "Revenue diversification." },
              { icon: Layout, title: "Program Design", desc: "Scalable evaluation frameworks." }
            ].map((item, i) => (
              <div key={i} className="reveal p-8 bg-slate-50 border border-slate-100 rounded-sm hover:bg-white hover:border-blue-600 hover:shadow-2xl transition-all group" style={{ transitionDelay: `${i * 150}ms` }}>
                <item.icon className="w-8 h-8 text-blue-600 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 5 — SERVICE CATEGORY: INNOVATION & AI STRATEGY */}
      <SectionWrapper bg="white">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 reveal">
            <div className="w-16 h-1 bg-blue-500 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              AI Strategy & Tech Transformation
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Helping organizations harness AI for operational excellence and strategic advantage.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: Brain, title: "AI Readiness Assessments" },
                { icon: Rocket, title: "Innovation Roadmaps" },
                { icon: RefreshCcw, title: "Digital Transformation" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 p-6 border border-slate-100 rounded-sm hover:border-blue-500 hover:shadow-xl transition-all group bg-slate-50 hover:bg-white">
                   <div className="shrink-0 p-4 bg-white rounded-sm group-hover:bg-slate-900 transition-all shadow-sm">
                      <item.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-all" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{item.title}</h4>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative reveal delay-300">
             <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full animate-pulse"></div>
             <div className="relative bg-slate-900 p-10 md:p-16 rounded-sm shadow-2xl border border-slate-800 space-y-10">
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { icon: Workflow, label: "Workflow Automation" },
                     { icon: Settings, label: "Optimization" },
                     { icon: Layers, label: "Program Design" },
                     { icon: Sparkles, label: "Startup Support" }
                   ].map((feat, i) => (
                     <div key={i} className="p-6 border border-slate-700 hover:border-blue-500 transition-all text-center space-y-3 group bg-slate-800/50">
                        <feat.icon className="w-6 h-6 text-blue-400 mx-auto group-hover:scale-110 transition-transform" />
                        <span className="block text-[10px] font-black text-white uppercase tracking-widest">{feat.label}</span>
                     </div>
                   ))}
                </div>
                <button className="w-full py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white transition-all hover:scale-[1.02]">
                   Audit Your AI Readiness
                </button>
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CALL-TO-ACTION BLOCK */}
      <SectionWrapper bg="dark" className="text-center py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-lime-500/10 -z-10"></div>
         <div className="max-w-4xl mx-auto space-y-12 relative z-10 reveal">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-shine-white">
              Build Your Digital Future
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
              From engineering scalable platforms to securing global infrastructure.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-6">
               <a 
                 href="#contact" 
                 className="group px-14 py-7 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-2xl uppercase tracking-widest text-sm flex items-center gap-4 hover:-translate-y-1"
               >
                 Consult a Senior Architect
                 <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               </a>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default ServicesPage;