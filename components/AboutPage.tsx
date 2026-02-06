import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  ShieldCheck, Target, Award, Globe, Users, Zap, CheckCircle2, 
  ArrowRight, Heart, Sparkles, Rocket, Camera, BookOpen, 
  Handshake, LineChart, Briefcase, Settings, Scale, Eye
} from 'lucide-react';
import { WHO_SERVED } from '../constants';

const AboutPage: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const CORE_VALUES = [
    {
      title: "Purpose Before Profit",
      desc: "Impact and integrity guide every decision we make for our clients and communities.",
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-50"
    },
    {
      title: "Strategic Excellence",
      desc: "We deliver thoughtful, data-informed, and actionable solutions that drive real growth.",
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "AI & Tech for Good",
      desc: "Ensuring that underrepresented communities have access to emerging technology that should serve humanity not exploit it.",
      icon: Zap,
      color: "text-lime-600",
      bg: "bg-lime-50"
    },
    {
      title: "Collaboration & Partnership",
      desc: "We build alongside our clients, not above them, fostering long-term shared success.",
      icon: Handshake,
      color: "text-blue-400",
      bg: "bg-blue-50"
    },
    {
      title: "Stewardship & Accountability",
      desc: "We take ownership of outcomes and focus on building sustainable, long-term value.",
      icon: ShieldCheck,
      color: "text-slate-900",
      bg: "bg-slate-100"
    }
  ];

  return (
    <div className="pt-24">
      {/* HERO SECTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-10"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 reveal active">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100 animate-pulse">
              <Sparkles className="w-4 h-4" /> The AMG Ecosystem
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Strategy, Innovation, Impact.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-lime-500 pl-6">
              A multidisciplinary firm operating at the intersection of corporate innovation, community development, and creative media.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 reveal active">
             {[
               { icon: Target, label: 'Strategy', color: 'text-blue-600' },
               { icon: Zap, label: 'Innovation', color: 'text-lime-600' },
               { icon: Heart, label: 'Impact', color: 'text-red-500' },
               { icon: Camera, label: 'Storytelling', color: 'text-blue-400' }
             ].map((item, i) => (
               <div key={i} className="bg-white p-8 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col items-center text-center gap-4 hover:-translate-y-2 rounded-sm">
                  <item.icon className={`w-12 h-12 ${item.color} group-hover:scale-110 group-hover:rotate-3 transition-transform`} />
                  <span className="font-black text-slate-900 uppercase tracking-widest text-[10px]">{item.label}</span>
               </div>
             ))}
          </div>
        </div>
      </SectionWrapper>

      {/* MISSION & VISION */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          <div className="space-y-12 bg-white p-10 md:p-16 border border-slate-100 rounded-sm shadow-sm reveal">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Our Mission</h2>
              </div>
              <div className="w-16 h-1 bg-blue-600"></div>
              <p className="text-2xl font-bold text-slate-700 leading-tight">
                "To empower businesses, governments, and nonprofits to create sustainable, measurable impact
                by aligning strategy, innovation, and storytelling."
              </p>
            </div>
          </div>

          <div className="space-y-12 bg-slate-900 p-10 md:p-16 rounded-sm text-white shadow-2xl reveal">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-lime-400" />
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Our Vision</h2>
              </div>
              <div className="w-16 h-1 bg-lime-500"></div>
              <p className="text-2xl font-bold text-slate-200 leading-tight italic">
                "A future where businesses, technology, and community systems work together to create economic strength, social equity, and generational opportunity."
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CORE VALUES SECTION */}
      <SectionWrapper bg="white" className="py-32">
        <div className="space-y-20">
          <div className="max-w-3xl space-y-4 reveal">
            <div className="w-12 h-1 bg-slate-900"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase text-shine">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-500 font-medium">The principles that drive our operational excellence and strategic commitment.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CORE_VALUES.map((value, i) => (
              <div key={i} className="reveal group p-10 bg-white border border-slate-100 rounded-sm hover:border-slate-900 transition-all duration-500 hover:-translate-y-2">
                 <div className={`w-14 h-14 ${value.bg} flex items-center justify-center rounded-sm mb-8 group-hover:scale-110 transition-transform`}>
                    <value.icon className={`w-7 h-7 ${value.color}`} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase">{value.title}</h3>
                 <p className="text-slate-500 text-sm leading-relaxed font-medium">
                   {value.desc}
                 </p>
              </div>
            ))}
            
            {/* Call to Action Card */}
            <div className="reveal p-10 bg-blue-600 text-white rounded-sm shadow-xl flex flex-col justify-between items-start group hover:bg-slate-900 transition-colors cursor-pointer" onClick={scrollToContact}>
               <div className="space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Work With Us</h3>
                  <p className="text-blue-100 text-sm font-medium">Ready to align your mission with our values? Let's start the conversation.</p>
               </div>
               <div className="mt-8 flex items-center gap-3 font-black uppercase tracking-widest text-[10px]">
                  Schedule a Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
               </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* AUDIENCES / WHO WE SERVE */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-white -skew-x-12 translate-x-1/2 -z-0"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-8 reveal">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Who We Serve</h2>
            <div className="w-16 h-1 bg-blue-600"></div>
            <div className="grid gap-3">
              {WHO_SERVED.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-sm hover:border-lime-500 hover:shadow-xl transition-all group">
                  <div className="shrink-0 p-1 bg-lime-50 rounded-full group-hover:bg-lime-500 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-lime-500 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-10 md:p-16 rounded-sm text-white shadow-2xl space-y-10 relative overflow-hidden reveal">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Award className="w-40 h-40 text-white" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-shine-white">The AMG Difference</h2>
            
            <div className="space-y-8">
              {[
                { title: 'Integrated Ecosystem', desc: 'Strategy and storytelling under one roof.' },
                { title: 'Real-World Expertise', desc: 'Experience spanning public and private sectors.' },
                { title: 'End-to-End Support', desc: 'From feasibility to execution.' }
              ].map((item, i) => (
                <div key={i} className="space-y-2 group p-6 border border-slate-800 rounded-sm hover:border-lime-500 hover:bg-slate-800/50 transition-all">
                  <h4 className="text-lg font-black text-lime-400 uppercase tracking-tight flex items-center gap-3">
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* GLOBAL REACH */}
      <SectionWrapper bg="white">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative reveal">
             <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full"></div>
             <div className="relative bg-slate-50 p-10 md:p-16 border border-slate-100 rounded-sm space-y-10 shadow-inner">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Our Global Footprint</h2>
                <div className="space-y-4">
                  {[
                    { name: 'US / EU / UK', area: 'Market Entry & Innovation' },
                    { name: 'Africa', area: 'Economic Pathway Development' }
                  ].map((part, i) => (
                    <div key={i} className="flex justify-between items-center p-6 bg-white border-l-4 border-blue-600 shadow-md hover:shadow-xl transition-all hover:-translate-x-1">
                      <span className="font-black text-slate-900 uppercase tracking-tight text-sm">{part.name}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase">{part.area}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-[10px] animate-pulse">
                   <Globe className="w-4 h-4" /> Borderless growth strategies
                </div>
             </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8 reveal">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">Our Vision In Action</h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We believe innovation, community impact, and storytelling must exist together to create lasting change. Every program we build and every strategy we design is a step toward this unified future.
            </p>
            <button 
              onClick={scrollToContact}
              className="px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all hover:shadow-2xl"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default AboutPage;