import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  ShieldCheck, Briefcase, Landmark, Cpu, Code2, Camera, 
  CheckCircle2, Target, Globe, Heart, BarChart3, Share2,
  Search, ClipboardList, Coins, Layout, Users, FileText,
  Workflow, Settings, Layers, Sparkles, Monitor, Lock, Terminal,
  Calendar, Zap, Play, Mic2, Tv, Video, Send, MessageSquare, Brain, Rocket
} from 'lucide-react';

const ServicesPage: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              Strategy, Innovation & Impact—Built for Organizations Ready to Grow
            </h1>
            
            <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-lime-500 pl-6 animate-in slide-in-from-left duration-700">
              <p>
                Azariah Management Group (AMG) provides integrated consulting, program execution,
                innovation support, and creative storytelling that help organizations drive measurable community
                impact and sustainable growth.
              </p>
              <p className="text-base text-slate-500">
                We partner with corporations, nonprofits, public-sector agencies, start-ups, and international
                partners who want strategic clarity, operational strength, and meaningful social responsibility.
              </p>
            </div>
          </div>

          <div className="relative reveal delay-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/10 to-blue-600/10 blur-3xl rounded-full"></div>
            <div className="relative aspect-square bg-slate-900 rounded-sm shadow-2xl overflow-hidden group border-8 border-white">
               <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
               <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-blue-900/20 backdrop-blur-[2px]">
                  <p className="text-3xl font-black text-white leading-tight uppercase tracking-tighter text-shine-white">Turning Purpose into Measurable Progress.</p>
               </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 2 — SERVICE CATEGORY #1: CSR */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-8 reveal">
            <div className="w-16 h-1 bg-lime-500 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              1. Corporate Social Responsibility Consulting
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We design and execute CSR strategies that strengthen communities, align with corporate values, and deliver measurable results.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Target, text: "CSR strategy development & execution" },
                { icon: Layers, text: "Community impact framework design" },
                { icon: Globe, text: "Partnership development" },
                { icon: Coins, text: "Grantmaking & philanthropy support" },
                { icon: BarChart3, text: "CSR reporting, metrics & storytelling" },
                { icon: Share2, text: "Employee engagement programs" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-sm hover:shadow-md transition-shadow">
                  <item.icon className="w-4 h-4 text-lime-600 shrink-0 mt-1" />
                  <span className="text-xs font-bold text-slate-700 leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-900 text-white rounded-sm border-l-4 border-lime-500">
               <div className="text-[10px] font-black uppercase tracking-widest text-lime-400 mb-2">Outcome</div>
               <p className="text-sm font-medium italic">"A CSR function that is strategic, credible, and deeply connected to the communities you serve."</p>
            </div>
          </div>
          <div className="hidden lg:block">
            <ShieldCheck className="w-full h-auto text-slate-100 opacity-50" />
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 3 — SERVICE CATEGORY #2: Nonprofit */}
      <SectionWrapper bg="white" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 hidden lg:block">
             <Briefcase className="w-full h-auto text-slate-50 opacity-50" />
          </div>
          <div className="order-1 lg:order-2 space-y-8 reveal">
            <div className="w-16 h-1 bg-blue-600 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              2. Nonprofit Strategy & Capacity Building
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We help nonprofits move from overwhelmed to operationally strong through strategic planning, program design, and structural support.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Search, title: "Assessments", desc: "Organizational health checks." },
                { icon: ClipboardList, title: "Planning", desc: "Strategic & operational roadmaps." },
                { icon: Coins, title: "Fundraising", desc: "Grant-readiness & support." },
                { icon: Layout, title: "Program Design", desc: "Execution & evaluation models." },
                { icon: MessageSquare, title: "Communications", desc: "PR & storytelling." },
                { icon: Landmark, title: "Governance", desc: "Board & leadership development." }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-sm hover:bg-white hover:border-blue-600 transition-all group">
                  <item.icon className="w-6 h-6 text-blue-600 mb-3" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="p-6 bg-blue-600 text-white rounded-sm border-l-4 border-slate-900 shadow-xl">
               <div className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-2">Outcome</div>
               <p className="text-sm font-bold">"A more stable, visible, and investment-ready nonprofit."</p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 4 — SERVICE CATEGORY #3: Government */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 reveal">
            <div className="w-16 h-1 bg-slate-900 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              3. Government & Public Sector Consulting
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We support government agencies with strategic planning, program management, community engagement, and cross-sector partnership development.
            </p>
            <ul className="space-y-4">
              {[
                "Program & project management",
                "Community engagement strategies",
                "Interagency coordination",
                "Public-sector innovation & modernization",
                "Federal/state/local partnership development",
                "Policy-aligned program design & reporting"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-slate-900" /> {item}
                </li>
              ))}
            </ul>
            <div className="p-6 bg-slate-900 text-white rounded-sm">
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Outcome</div>
               <p className="text-sm font-medium">"Effective programs, stronger public trust, and improved service delivery."</p>
            </div>
          </div>
          <div className="hidden lg:block relative">
             <Landmark className="w-full h-auto text-slate-200 opacity-50" />
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 5 — SERVICE CATEGORY #4: Innovation & Tech (Including Cyber, Web, Software) */}
      <SectionWrapper bg="dark" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5">
           <Code2 className="w-96 h-96 text-white" />
        </div>
        <div className="space-y-16 relative z-10">
          <div className="max-w-3xl space-y-6 reveal">
            <div className="w-16 h-1 bg-lime-500 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none text-shine-white">
              4. Innovation, AI Strategy & Technology Transformation
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              We help organizations adopt emerging technologies, build AI readiness, and modernize their systems for the future through precision engineering and secure architectures.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "AI Readiness", desc: "Assessments and implementation roadmaps." },
              { icon: Rocket, title: "Innovation", desc: "Digital transformation & roadmaps." },
              { icon: Workflow, title: "Automation", desc: "Workflow & process optimization." },
              { icon: Zap, title: "Startup Support", desc: "Innovation pipeline development." },
              { icon: Lock, title: "Cyber Security", desc: "Enterprise threat protection & risk audits." },
              { icon: Monitor, title: "Web Development", desc: "Custom digital platforms & e-commerce." },
              { icon: Terminal, title: "Software Eng", desc: "Custom systems & API engineering." }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-slate-800/50 border border-slate-700 rounded-sm hover:border-lime-500 transition-all group">
                <item.icon className="w-8 h-8 text-lime-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="p-8 bg-slate-800 border-l-8 border-lime-500 max-w-2xl">
             <div className="text-[10px] font-black uppercase tracking-widest text-lime-400 mb-2">Outcome</div>
             <p className="text-lg font-bold text-white">"Smarter operations, increased efficiency, and future-proof capabilities."</p>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 6 — SERVICE CATEGORY #5: Community Impact */}
      <SectionWrapper bg="white" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 reveal">
            <div className="w-16 h-1 bg-lime-500 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              5. Community Impact & Development
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We design and implement initiatives that strengthen communities, improve quality of life, and create long-term impact.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Search, text: "Needs Assessments" },
                { icon: Sparkles, text: "Impact Initiative Design" },
                { icon: Heart, text: "Wellness Programs" },
                { icon: Zap, text: "Youth Empowerment" },
                { icon: Globe, text: "Global Partnerships" },
                { icon: BarChart3, text: "Impact Reporting" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-lime-600" />
                  <span className="text-xs font-bold text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-50 border-t-4 border-lime-500">
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Outcome</div>
               <p className="text-sm font-bold text-slate-900">"Programs that empower people and create measurable transformation."</p>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="aspect-square bg-slate-100 rounded-sm relative overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 7 — SERVICE CATEGORY #6: Studio AMG */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="hidden lg:block">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                   <div className="aspect-video bg-slate-900 rounded-sm overflow-hidden"><img src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-60" /></div>
                   <div className="aspect-square bg-slate-900 rounded-sm overflow-hidden"><img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2059" className="w-full h-full object-cover opacity-60" /></div>
                </div>
                <div className="space-y-4 pt-12">
                   <div className="aspect-square bg-slate-900 rounded-sm overflow-hidden"><img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1964" className="w-full h-full object-cover opacity-60" /></div>
                   <div className="aspect-video bg-slate-900 rounded-sm overflow-hidden"><img src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=2050" className="w-full h-full object-cover opacity-60" /></div>
                </div>
             </div>
          </div>
          <div className="space-y-8 reveal">
            <div className="w-16 h-1 bg-blue-600 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              6. Creative Storytelling & Media Production (Studio AMG)
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We create powerful content that elevates your mission, inspires action, and expands your reach through cinema-quality production.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Video, text: "Advocacy & Doc-style films" },
                { icon: Zap, text: "Animation & Branded content" },
                { icon: Play, text: "Program launch videos" },
                { icon: Share2, text: "Storytelling campaigns" },
                { icon: Mic2, text: "Podcast & Branded series" },
                { icon: Tv, text: "Narrative development" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-sm">
                  <item.icon className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-900 text-white rounded-sm">
               <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Outcome</div>
               <p className="text-sm font-medium">"Authentic storytelling that drives visibility, credibility, and engagement."</p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 8 — CALL-TO-ACTION BLOCK */}
      <SectionWrapper bg="dark" className="text-center py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-lime-500/10 -z-10"></div>
         <div className="max-w-4xl mx-auto space-y-12 relative z-10 reveal">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-shine-white">
              Let’s Build Something Transformative Together
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
              Whether you're growing your nonprofit, expanding your CSR strategy, modernizing your organization, or scaling community impact—AMG provides the expertise to move your mission forward.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-6">
               <button 
                 onClick={scrollToContact}
                 className="group px-14 py-7 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-2xl uppercase tracking-widest text-sm flex items-center gap-4 hover:-translate-y-1"
               >
                 Book a 20-Minute Discovery Call
                 <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               </button>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default ServicesPage;