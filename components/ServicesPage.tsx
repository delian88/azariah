import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  ShieldCheck, Briefcase, Landmark, Cpu, Code2, Camera, 
  CheckCircle2, Target, Globe, Heart, BarChart3, Share2,
  Search, ClipboardList, Coins, Layout, Users, FileText,
  Workflow, Settings, Layers, Sparkles, Monitor, Lock, Terminal,
  Calendar, Zap, Play, Mic2, Tv, Video, Send, MessageSquare, Brain, Rocket,
  ShieldAlert, Database, Server, Smartphone, Laptop, Clapperboard, Film,
  MapPin, Lightbulb
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
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100 animate-pulse">
              <Globe className="w-4 h-4" /> Integrated Strategic Ecosystem
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
              <p className="text-base text-slate-500 font-bold uppercase tracking-widest">
                Serving Government, Private Sector, & Global Non-Profits.
              </p>
            </div>
          </div>

          <div className="relative reveal active">
            <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/10 to-blue-600/10 blur-3xl rounded-full"></div>
            <div className="relative aspect-square bg-slate-900 rounded-sm shadow-2xl overflow-hidden group border-8 border-white">
               <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
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
              We design and execute CSR strategies that strengthen communities, align with corporate values, and deliver measurable results for the Private Sector.
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
          </div>
          <div className="hidden lg:block reveal">
            <div className="aspect-[4/5] bg-slate-200 rounded-sm overflow-hidden shadow-2xl border-4 border-white rotate-2">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071" className="w-full h-full object-cover" alt="CSR Strategy" />
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 3 — SERVICE CATEGORY #2: Nonprofit */}
      <SectionWrapper bg="white" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 hidden lg:block reveal">
            <div className="aspect-[4/5] bg-slate-200 rounded-sm overflow-hidden shadow-2xl border-4 border-white -rotate-2">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015" className="w-full h-full object-cover" alt="Nonprofit Support" />
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8 reveal">
            <div className="w-16 h-1 bg-blue-600 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              2. Non-Profits & Civil Society Strategy
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
                <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-sm hover:bg-white hover:border-blue-600 transition-all group shadow-sm">
                  <item.icon className="w-6 h-6 text-blue-600 mb-3" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                </div>
              ))}
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
              3. Government Agencies & Public Sector
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
          </div>
          <div className="hidden lg:block reveal">
            <div className="aspect-[4/5] bg-slate-200 rounded-sm overflow-hidden shadow-2xl border-4 border-white">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Public Sector Consulting" />
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 5 — SERVICE CATEGORY #4: Innovation & AI */}
      <SectionWrapper bg="dark" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-16 relative z-10 reveal">
            <div className="max-w-3xl space-y-6">
              <div className="w-16 h-1 bg-lime-500 mb-6"></div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none text-shine-white">
                4. Innovation, AI Strategy & Tech Transformation
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed font-medium">
                We help organizations adopt emerging technologies, build AI readiness, and modernize their systems for the future through precision engineering.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Brain, title: "AI Readiness", desc: "Assessments and implementation roadmaps." },
                { icon: Rocket, title: "Innovation", desc: "Digital transformation & roadmaps." },
                { icon: Workflow, title: "Automation", desc: "Workflow & process optimization." },
                { icon: Zap, title: "Startup Support", desc: "Innovation pipeline development." }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-slate-800/50 border border-slate-700 rounded-sm hover:border-lime-500 transition-all group">
                  <item.icon className="w-8 h-8 text-lime-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block reveal">
            <div className="aspect-[4/5] bg-slate-800 rounded-sm overflow-hidden shadow-2xl border-4 border-slate-700 rotate-1">
              <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-60" alt="Innovation Hub" />
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 6 — SERVICE CATEGORY #5: Cyber Security */}
      <SectionWrapper bg="white" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 hidden lg:block reveal">
            <div className="aspect-[4/5] bg-slate-200 rounded-sm overflow-hidden shadow-2xl border-4 border-white rotate-1">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Cyber Security" />
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8 reveal">
            <div className="w-16 h-1 bg-slate-900 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              5. Cyber Security & Software Engineering
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Protecting digital assets and engineering robust custom platforms and systems that ensure operational resilience and security.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: ShieldAlert, text: "Enterprise Threat Protection" },
                { icon: Terminal, text: "Custom Software Engineering" },
                { icon: Database, text: "Secure Data Architecture" },
                { icon: Smartphone, text: "Mobile Application Dev" },
                { icon: Server, text: "Cloud Infrastructure" },
                { icon: Laptop, text: "Digital Platform Modernization" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm hover:border-slate-900 transition-all">
                  <item.icon className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                  <span className="text-xs font-bold text-slate-700 leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 7 — SERVICE CATEGORY #6: Community Impact & Development */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-8 reveal">
            <div className="w-16 h-1 bg-lime-500 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              6. Community Impact & Development
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Driving sustainable change through grassroots mobilization, urban development support, and strategic community partnerships.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Users, text: "Community Mobilization & Engagement" },
                { icon: MapPin, text: "Urban & Rural Development Support" },
                { icon: Lightbulb, text: "Social Enterprise Incubation" },
                { icon: Briefcase, text: "Workforce Development Programs" },
                { icon: Share2, text: "Ecosystem Building & Advocacy" },
                { icon: Heart, text: "Health & Wellness Initiatives" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-sm hover:shadow-lg transition-shadow">
                  <item.icon className="w-4 h-4 text-lime-600 shrink-0 mt-1" />
                  <span className="text-xs font-bold text-slate-700 leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block reveal">
            <div className="aspect-[4/5] bg-slate-200 rounded-sm overflow-hidden shadow-2xl border-4 border-white -rotate-1">
              <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Community Development" />
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 8 — SERVICE CATEGORY #7: Creative Storytelling (Studio AMG) */}
      <SectionWrapper bg="white" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 hidden lg:block reveal">
            <div className="aspect-[4/5] bg-slate-200 rounded-sm overflow-hidden shadow-2xl border-4 border-white rotate-2">
              <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2071" className="w-full h-full object-cover" alt="Studio AMG Production" />
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8 reveal">
            <div className="w-16 h-1 bg-blue-600 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              7. Creative Storytelling & Media Production
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Elevating missions through cinematic production and strategic media campaigns that transform data into compelling human narratives.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Clapperboard, text: "Documentary & Docu-series Production" },
                { icon: Film, text: "Impact Film & Cinematic Content" },
                { icon: Video, text: "Branded Social Storytelling" },
                { icon: Mic2, text: "Podcasting & Audio Production" },
                { icon: Share2, text: "Multi-platform Advocacy Campaigns" },
                { icon: Tv, text: "Broadcast & Media Partnerships" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm hover:border-blue-600 transition-all">
                  <item.icon className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                  <span className="text-xs font-bold text-slate-700 leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 9 — CALL-TO-ACTION BLOCK */}
      <SectionWrapper bg="dark" className="text-center py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-lime-500/10 -z-10"></div>
         <div className="max-w-4xl mx-auto space-y-12 relative z-10 reveal">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-shine-white">
              Let’s Build Something Transformative Together
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
              Whether you're growing your nonprofit, expanding your CSR strategy, or scaling community impact—AMG provides the expertise to move your mission forward.
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