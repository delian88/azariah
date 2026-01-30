import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  ShieldCheck, Cpu, Briefcase, Heart, Camera, Globe, ArrowRight, CheckCircle2, 
  Users, BarChart3, Target, Share2, Search, ClipboardList, Coins, Layout, 
  MessageSquare, Sparkles, Landmark, Puzzle, ClipboardCheck, FileText, Zap, Users2,
  Rocket, Workflow, RefreshCcw, Brain, Settings, Layers,
  MapPin, HeartPulse, GraduationCap, LineChart, Compass, Lightbulb,
  Video, Play, Mic, Film, Megaphone, Clapperboard, Calendar
} from 'lucide-react';
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

      {/* SECTION 2 — SERVICE CATEGORY #1: CSR CONSULTING */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-100/50 -skew-x-12 translate-x-1/2 z-0"></div>
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="order-2 lg:order-1 space-y-12">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Target, text: "CSR strategy development & execution" },
                { icon: Users, text: "Community impact framework design" },
                { icon: Globe, text: "Partnership development (local, national, global)" },
                { icon: Heart, text: "Grantmaking & philanthropic program support" },
                { icon: BarChart3, text: "CSR reporting, metrics, and storytelling" },
                { icon: Share2, text: "Employee engagement & volunteerism" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-sm hover:border-lime-500 transition-all group">
                  <div className="p-2 bg-slate-50 rounded-sm group-hover:bg-lime-500 transition-colors">
                    <item.icon className="w-5 h-5 text-slate-900 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
            
            <div className="p-8 bg-slate-900 text-white rounded-sm border-l-8 border-lime-500 shadow-2xl">
               <div className="text-[10px] font-black uppercase tracking-widest text-lime-400 mb-2">The Outcome</div>
               <p className="text-lg font-medium italic">
                 "A CSR function that is strategic, credible, and deeply connected to the communities you serve."
               </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div className="w-16 h-1 bg-lime-500 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Corporate Social Responsibility Consulting
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We design and execute CSR strategies that strengthen communities, align with corporate values,
              and deliver measurable results. 
            </p>
            <p className="text-slate-500 font-medium">
              In an era of rising expectations, we help organizations move beyond "giving back" to building sustainable ecosystems of shared value.
            </p>
            <div className="pt-6">
              <button className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-900 group">
                Download CSR Blueprint <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 3 — SERVICE CATEGORY #2: NONPROFIT STRATEGY */}
      <SectionWrapper bg="white" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="w-16 h-1 bg-blue-600 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Nonprofit Strategy & Capacity Building
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We help nonprofits move from overwhelmed to operationally strong through strategic planning,
              program design, and structural support.
            </p>
            
            <div className="p-8 bg-blue-50 border border-blue-100 rounded-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ShieldCheck className="w-20 h-20 text-blue-900" />
               </div>
               <div className="text-[10px] font-black uppercase tracking-widest text-blue-800 mb-2">The Mission</div>
               <p className="text-lg font-bold text-slate-800">
                 "Transforming visibility into investment-ready stability."
               </p>
            </div>

            <div className="pt-4">
              <button className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest text-xs">
                Strengthen Your Organization
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Search, title: "Organizational Assessments", desc: "Gap analysis and operational health checks." },
              { icon: ClipboardList, title: "Strategic Planning", desc: "Practical 3-5 year growth and impact roadmaps." },
              { icon: Coins, title: "Fundraising Support", desc: "Grant-readiness and revenue diversification." },
              { icon: Layout, title: "Program Design", desc: "Scalable execution and evaluation frameworks." },
              { icon: MessageSquare, title: "Communications & PR", desc: "Advocacy-driven storytelling and visibility." },
              { icon: Users, title: "Board Governance", desc: "Leadership development and structural excellence." }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-sm hover:bg-white hover:border-blue-600 hover:shadow-xl transition-all group">
                <item.icon className="w-6 h-6 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 4 — SERVICE CATEGORY #3: GOVERNMENT & PUBLIC SECTOR */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 grid sm:grid-cols-2 gap-6">
            {[
              { icon: ClipboardCheck, title: "Program Management", desc: "Precision execution of complex public initiatives." },
              { icon: Users2, title: "Community Engagement", desc: "Inclusive strategies to build public trust & rapport." },
              { icon: Puzzle, title: "Interagency Coordination", desc: "Streamlining collaboration across departments." },
              { icon: Zap, title: "Public Innovation", desc: "Modernizing service delivery with digital solutions." },
              { icon: Landmark, title: "Partnership Development", desc: "Linking federal, state, and local stakeholders." },
              { icon: FileText, title: "Policy Alignment", desc: "Designing programs that meet strict compliance & reporting." }
            ].map((item, i) => (
              <div key={i} className="group bg-white p-6 border-b-4 border-slate-200 hover:border-lime-500 transition-all shadow-sm">
                <item.icon className="w-8 h-8 text-slate-900 mb-4 group-hover:text-blue-700 transition-colors" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div className="w-16 h-1 bg-slate-900 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Government & Public Sector Consulting
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We support government agencies with strategic planning, program management, community engagement, and cross-sector partnership development.
            </p>
            
            <div className="p-8 bg-slate-900 text-white rounded-sm">
               <div className="text-[10px] font-black uppercase tracking-widest text-lime-400 mb-2">Public Benefit</div>
               <p className="text-lg font-medium italic">
                 "Effective programs, stronger public trust, and improved service delivery."
               </p>
            </div>
            
            <div className="pt-4">
              <button className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-900 group">
                Review Public Sector Capabilities <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 5 — SERVICE CATEGORY #4: INNOVATION & AI STRATEGY */}
      <SectionWrapper bg="white" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="w-16 h-1 bg-blue-500 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Innovation, AI Strategy & Technology Transformation
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We help organizations adopt emerging technologies, build AI readiness, and modernize their
              systems for the future.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: Brain, title: "AI Readiness Assessments", desc: "Evaluating infrastructure, data quality, and ethical considerations." },
                { icon: Rocket, title: "Innovation Roadmaps", desc: "Phase-by-phase planning for tech adoption and scale." },
                { icon: RefreshCcw, title: "Digital Transformation", desc: "Modernizing legacy systems for high-performance operations." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="shrink-0 p-4 bg-slate-50 rounded-sm group-hover:bg-slate-900 transition-all">
                      <item.icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
             <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full animate-pulse"></div>
             <div className="relative bg-slate-900 p-10 md:p-16 rounded-sm shadow-2xl border border-slate-800 space-y-10">
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { icon: Workflow, label: "Workflow Automation" },
                     { icon: Settings, label: "Process Optimization" },
                     { icon: Layers, label: "Tech Program Design" },
                     { icon: Sparkles, label: "Startup Support" }
                   ].map((feat, i) => (
                     <div key={i} className="p-6 border border-slate-700 hover:border-blue-500 transition-all text-center space-y-3">
                        <feat.icon className="w-6 h-6 text-blue-400 mx-auto" />
                        <span className="block text-[10px] font-black text-white uppercase tracking-widest">{feat.label}</span>
                     </div>
                   ))}
                </div>

                <div className="p-6 bg-blue-600/10 border-l-4 border-blue-500">
                   <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">The Outcome</div>
                   <p className="text-white font-bold leading-tight">
                     "Smarter operations, increased efficiency, and future-proof capabilities."
                   </p>
                </div>

                <button className="w-full py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white transition-all">
                   Audit Your AI Readiness
                </button>
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 6 — SERVICE CATEGORY #5: COMMUNITY IMPACT & DEVELOPMENT */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 grid sm:grid-cols-2 gap-6">
            {[
              { icon: Search, title: "Needs Assessments", desc: "In-depth research to understand local operational realities." },
              { icon: Compass, title: "Impact Initiative Design", desc: "Creating tailored programs that drive meaningful change." },
              { icon: HeartPulse, title: "Wellness Programs", desc: "Focusing on social support, mental health, and community wellness." },
              { icon: GraduationCap, title: "Youth & Workforce", desc: "Empowerment initiatives that build future leadership." },
              { icon: Globe, title: "Global Partnerships", desc: "Bridging international resources with local execution." },
              { icon: LineChart, title: "Impact Reporting", desc: "Rigorous monitoring and evaluation of social transformation." }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-lime-500 transition-all group rounded-sm">
                <item.icon className="w-10 h-10 text-slate-900 mb-4 group-hover:scale-110 group-hover:text-blue-600 transition-all" />
                <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase mb-2">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div className="w-16 h-1 bg-lime-500 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Community Impact & Development
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We design and implement initiatives that strengthen communities, improve quality of life, and
              create long-term impact.
            </p>
            
            <div className="p-8 bg-white border-l-8 border-slate-900 shadow-2xl">
               <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">The Transformation</div>
               <p className="text-lg font-bold text-slate-800 italic">
                 "Programs that empower people and create measurable transformation."
               </p>
            </div>
            
            <div className="pt-4">
               <button className="px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all flex items-center gap-3">
                 Explore Impact Framework <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 7 — SERVICE CATEGORY #6: CREATIVE STORYTELLING & MEDIA PRODUCTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="w-16 h-1 bg-blue-400 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Creative Storytelling & Media Production (Studio AMG)
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We create powerful content that elevates your mission, inspires action, and expands your reach.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Video, title: "Advocacy & Documentary", desc: "Compelling narratives that highlight mission-driven results." },
                { icon: Sparkles, title: "Animation & Branding", desc: "Creative visuals that bring complex ideas to life." },
                { icon: Play, title: "Program Launch Videos", desc: "High-impact media to kickstart your new initiatives." },
                { icon: Megaphone, title: "Social Storytelling", desc: "Targeted campaigns designed for digital engagement." },
                { icon: Mic, title: "Podcast Production", desc: "Professional branded series for deep-dive discussions." },
                { icon: Clapperboard, title: "Media Strategy", desc: "Coherent narrative development across all platforms." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-3 p-6 bg-slate-50 border border-slate-100 group hover:bg-white hover:border-blue-400 hover:shadow-xl transition-all">
                  <item.icon className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative p-2 bg-slate-900 rounded-sm shadow-2xl">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="bg-slate-800 p-8 md:p-12 space-y-8 border border-slate-700">
               <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="text-[10px] font-black text-white uppercase tracking-widest">Studio Active</div>
                  </div>
                  <Film className="w-6 h-6 text-slate-500" />
               </div>
               
               <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Beyond Deliverables</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Strategy + Storytelling in one ecosystem. We don't just produce media; we build campaigns that align with your strategic growth targets.
                  </p>
               </div>

               <div className="p-6 bg-blue-500/10 border-l-4 border-blue-400">
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">The Outcome</div>
                  <p className="text-white font-bold italic text-lg leading-tight">
                    "Authentic storytelling that drives visibility, credibility, and engagement."
                  </p>
               </div>

               <button className="w-full py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-blue-400 hover:text-white transition-all">
                  View Studio Showreel
               </button>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CORE SERVICES BREAKDOWN */}
      <SectionWrapper bg="light">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase text-shine">Detailed Service Pillars</h2>
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

      {/* SECTION 8 — CALL-TO-ACTION BLOCK */}
      <SectionWrapper bg="white" className="text-center py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-slate-50 opacity-30 -skew-y-3 origin-right"></div>
         <div className="max-w-4xl mx-auto space-y-12 relative z-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-shine">
              Let’s Build Something Transformative Together
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">
              Whether you're growing your nonprofit, expanding your CSR strategy, modernizing your
              organization, or scaling community impact—AMG provides the expertise to move your mission
              forward.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-6">
               <a 
                 href="#contact" 
                 className="group px-14 py-7 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-2xl uppercase tracking-[0.1em] text-sm flex items-center gap-4 border-b-4 border-slate-700 active:translate-y-1 active:border-b-0"
               >
                 Book a 20-Minute Discovery Call
                 <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               </a>
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                 <span className="w-8 h-px bg-slate-200"></span>
                 Impact Ready
                 <span className="w-8 h-px bg-slate-200"></span>
               </div>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default ServicesPage;