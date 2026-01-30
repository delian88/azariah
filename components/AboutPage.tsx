
import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  ShieldCheck, Target, Award, Globe, Users, Zap, CheckCircle2, 
  ArrowRight, Heart, Sparkles, Rocket, Camera, BookOpen, 
  Handshake, LineChart, Briefcase, Settings
} from 'lucide-react';
import { WHO_SERVED } from '../constants';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 animate-in fade-in duration-1000">
      {/* HERO SECTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-1/2 z-0"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100">
              <Sparkles className="w-4 h-4" /> About Azariah Management Group
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Where Strategy, Innovation, and Social Impact Work as One
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-lime-500 pl-6">
              Azariah Management Group (AMG) is a multidisciplinary consulting and media firm helping
              organizations build stronger communities, accelerate growth, and execute with confidence.
            </p>
            <p className="text-slate-500 font-medium">
              We combine corporate strategy, innovation and AI consulting, government and nonprofit expertise, 
              and creative storytelling through Studio AMG—delivering solutions that move organizations from 
              feasibility → readiness → execution.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {[
               { icon: Target, label: 'Strategy', color: 'text-blue-600' },
               { icon: Zap, label: 'Innovation', color: 'text-lime-600' },
               { icon: Heart, label: 'Impact', color: 'text-red-500' },
               { icon: Camera, label: 'Storytelling', color: 'text-blue-400' }
             ].map((item, i) => (
               <div key={i} className="bg-white p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center gap-4">
                  <item.icon className={`w-12 h-12 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-black text-slate-900 uppercase tracking-widest text-xs">{item.label}</span>
               </div>
             ))}
          </div>
        </div>
      </SectionWrapper>

      {/* MISSION & SERVE */}
      <SectionWrapper bg="light">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Our Mission</h2>
              <div className="w-16 h-1 bg-lime-500"></div>
              <p className="text-2xl font-bold text-slate-700 leading-tight">
                "To empower businesses, governments, and nonprofits to create sustainable, measurable impact
                by aligning strategy, innovation, community development, and storytelling in one seamless
                ecosystem."
              </p>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Who We Serve</h2>
              <div className="w-16 h-1 bg-blue-600"></div>
              <p className="text-slate-600 font-medium">
                AMG partners with organizations across industries and continents who choose us because we 
                understand both the strategic landscape and the communities they're called to serve.
              </p>
              <div className="grid gap-3">
                {WHO_SERVED.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-sm hover:border-lime-500 transition-all group">
                    <CheckCircle2 className="w-5 h-5 text-lime-500 shrink-0" />
                    <span className="text-sm font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-10 md:p-16 rounded-sm text-white shadow-2xl space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Award className="w-40 h-40 text-white" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-shine-white">What Makes AMG Different</h2>
            
            <div className="space-y-12">
              {[
                { 
                  title: 'Integrated Consulting + Media Power', 
                  desc: 'While most firms offer strategy—or storytelling—AMG merges both. Our consulting divisions work hand-in-hand with Studio AMG to transform insights into campaigns.'
                },
                { 
                  title: 'Real-World Expertise Across Sectors', 
                  desc: 'Our team brings experience from the private sector, government, public agencies, and international collaborations.' 
                },
                { 
                  title: 'End-to-End Support', 
                  desc: 'We guide clients across every phase: Feasibility, Readiness, and Execution.' 
                },
                { 
                  title: 'Community Impact at the Core', 
                  desc: 'Every project includes a lens of equity, community advancement, and sustainable development.' 
                }
              ].map((item, i) => (
                <div key={i} className="space-y-2 group">
                  <h4 className="text-lg font-black text-lime-400 group-hover:translate-x-2 transition-transform uppercase tracking-tight">{item.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* GLOBAL REACH & STORY */}
      <SectionWrapper bg="white">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full"></div>
             <div className="relative bg-slate-50 p-10 md:p-16 border border-slate-100 rounded-sm space-y-10 shadow-inner">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Our Global Reach</h2>
                <p className="text-slate-600 font-medium">
                  Through partnerships in the U.S., Europe, UK, and Africa, AMG supports diaspora innovation,
                  international market entry, cross-cultural collaboration, and global capacity building.
                </p>
                <div className="space-y-4">
                  {[
                    { name: 'Luxurious Decorations', area: 'EU/Africa operations' },
                    { name: 'Foundation of Luv', area: 'Global social impact and advocacy' },
                    { name: 'Studio AMG', area: 'Creative & media production' }
                  ].map((part, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white border-l-4 border-blue-600 shadow-sm">
                      <span className="font-black text-slate-900 uppercase tracking-tight text-sm">{part.name}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase">{part.area}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-[10px]">
                   <Globe className="w-4 h-4 animate-spin-slow" /> Uniquely positioned for borderless growth
                </div>
             </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">Our Story</h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              AMG was founded with a clear belief: innovation, community impact, and storytelling must
              exist together to create lasting change.
            </p>
            <div className="space-y-6 text-slate-500 font-medium">
              <p>
                What started as a consulting practice evolved into a global ecosystem where strategy, social
                impact, and media are intertwined—serving clients who want not only to grow but to make a
                difference.
              </p>
              <p>
                Today, AMG supports entrepreneurs, nonprofits, public agencies, and corporate leaders in
                building solutions that shape healthier economies, stronger communities, and more connected
                futures.
              </p>
            </div>
            <button className="px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all">
              Learn How We Work
            </button>
          </div>
        </div>
      </SectionWrapper>

      {/* HOW WE CREATE IMPACT */}
      <SectionWrapper bg="light">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase text-shine">How We Create Impact</h2>
             <p className="text-slate-500 text-lg">We help organizations navigate complex landscapes and scale meaningful results.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, text: "Strengthen community development and corporate social responsibility initiatives" },
              { icon: Users, text: "Build nonprofit capacity and design programs that deliver real results" },
              { icon: Briefcase, text: "Support government modernization with strategic project management" },
              { icon: Zap, text: "Innovate using technology, AI strategy, and digital transformation" },
              { icon: Globe, text: "Expand internationally through diaspora-led economic pathways" },
              { icon: Camera, text: "Amplify missions and campaigns through creative storytelling" }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white border border-slate-100 hover:border-blue-600 hover:shadow-2xl transition-all group flex gap-6 items-start">
                 <item.icon className="w-8 h-8 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                 <p className="text-sm font-bold text-slate-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* OUR APPROACH */}
      <SectionWrapper bg="dark">
         <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-shine-white">Our Approach</h2>
               <p className="text-xl text-slate-400 font-medium">People-first. Insight-driven. Execution-focused.</p>
               <p className="text-slate-500 leading-relaxed">
                 We listen deeply, collaborate intentionally, and execute with precision. This integrated method 
                 ensures every solution is practical, culturally aligned, and built for long-term success.
               </p>
               
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: BookOpen, label: 'Strategy' },
                    { icon: Rocket, label: 'Innovation' },
                    { icon: Camera, label: 'Media' },
                    { icon: Handshake, label: 'Partnerships' },
                    { icon: LineChart, label: 'Evaluation' },
                    { icon: Settings, label: 'Design' }
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-sm">
                       <step.icon className="w-4 h-4 text-lime-400" />
                       <span className="text-[10px] font-black uppercase text-white tracking-widest">{step.label}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white p-10 md:p-16 rounded-sm space-y-8 text-slate-950 shadow-2xl relative">
               <div className="absolute top-0 right-0 p-4">
                  <Camera className="w-12 h-12 text-blue-500 opacity-20" />
               </div>
               <h3 className="text-3xl font-black tracking-tighter uppercase text-shine">Meet Studio AMG</h3>
               <p className="text-slate-600 font-medium">
                 Studio AMG is our creative engine—a media and storytelling division that transforms strategies into stories that connect, mobilize, and inspire.
               </p>
               <div className="space-y-4">
                 {[
                   'Impact documentaries',
                   'Branded content',
                   'Advocacy campaigns',
                   'Corporate storytelling',
                   'Nonprofit and community-focused media'
                 ].map((svc, i) => (
                   <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-800">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      {svc}
                   </div>
                 ))}
               </div>
               <button className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-lime-500 hover:text-slate-950 transition-all">
                 View Studio Showreel
               </button>
            </div>
         </div>
      </SectionWrapper>

      {/* COMMITMENT & CTA */}
      <SectionWrapper bg="white" className="text-center py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-slate-50 opacity-30 -skew-y-3 origin-right"></div>
         <div className="max-w-4xl mx-auto space-y-12 relative z-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-shine">Our Commitment</h2>
            <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">
              We are committed to advancing innovation, economic opportunity, social impact, and global
              collaboration. Every client is a partner, every project is a mission, and every outcome is designed
              to create meaningful change.
            </p>
            
            <div className="pt-12 space-y-10">
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">Let’s Build Something That Creates Impact</h3>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Whether you’re a start-up scaling new solutions, a nonprofit driving change, or an agency
                executing a major initiative—AMG is your partner for innovation, strategy, and community
                advancement.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <a 
                  href="#contact" 
                  className="px-14 py-7 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-2xl uppercase tracking-widest text-sm"
                >
                  Work With AMG
                </a>
              </div>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default AboutPage;
