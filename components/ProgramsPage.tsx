import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  Zap, ArrowRight, ChevronLeft, Heart, Globe, 
  Sparkles, Tv, Gamepad2, Brain, ShieldCheck, X, Info,
  Clapperboard, Share2, Target, Play, ShieldAlert, Scale,
  BookOpen, LayoutDashboard, HeartHandshake, Users, BarChart3,
  TrendingUp, MessageSquare, Megaphone, GraduationCap,
  CheckCircle2, Link
} from 'lucide-react';
import { SIGNATURE_PROGRAMS } from '../constants';

const ProgramsPage: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  const getProgramIcon = (title: string) => {
    switch (title) {
      case 'Start Point': return Tv;
      case 'Captain Chiffon': return Gamepad2;
      case 'Family First': return Heart;
      case 'G.A.M.E.': return Globe;
      case 'Voices of the Diaspora': return Globe;
      case 'AI Force Hub': return Brain;
      case 'BlackbyAngel Initiative': return ShieldCheck;
      case 'The Silent Movement': return ShieldAlert;
      default: return Zap;
    }
  };

  const PROGRAM_DETAILS: Record<string, any> = {
    'Start Point': {
      synopsis: [
        "Start Point is a docu-reality series that follows the authentic journeys of entrepreneurs, founders, and CEOs at the pivotal moments where vision meets uncertainty. Rather than spotlighting success alone, the series captures the real decisions, risks, failures, and breakthroughs that shape leadership from the ground up.",
        "Through candid storytelling and behind-the-scenes access, Start Point reveals what it truly takes to build something meaningful offering inspiration, practical insight, and human connection for aspiring leaders, innovators, and changemakers."
      ],
      themes: "Entrepreneurship • Leadership • Resilience • Innovation • Purpose",
      format: "Docu-Reality / Business & Human Interest"
    },
    'Voices of the Diaspora': {
      synopsis: [
        "Voices of the Diaspora is a powerful storytelling and dialogue series that amplifies the lived experiences, perspectives, and contributions of people across the global African diaspora. Through intimate conversations, cultural exploration, and personal narratives, the series examines identity, migration, heritage, innovation, and the interconnectedness of global Black communities.",
        "Spanning continents and generations, Voices of the Diaspora highlights how culture, history, and resilience shape modern realities while creating a shared space for understanding, healing, and collective progress. The series bridges global perspectives with local impact, honoring roots while spotlighting forward-thinking voices shaping the future."
      ],
      themes: "Diaspora Identity • Culture & Heritage • Migration • Belonging • Global Community • Legacy",
      format: "Documentary / Talk / Cultural & Advocacy Series"
    },
    'Family First': {
      synopsis: [
        "Family First is a values-centered series that explores the dynamics of family, parenting, and relationships in today’s rapidly evolving world. Through real conversations, expert insights, and lived experiences, the series addresses mental health, communication, generational challenges, and the importance of nurturing strong family foundations.",
        "Designed to educate, empower, and heal, Family First creates a safe and relatable space for families to engage in honest dialogue, strengthen bonds, and prioritize emotional well-being across generations."
      ],
      themes: "Family • Parenting • Mental Health • Relationships • Community Wellness",
      format: "Lifestyle / Educational / Advocacy"
    },
    'BlackbyAngel Initiative': {
      synopsis: [
        "BlackbyAngel is a bold, culturally resonant talk and advocacy series that centers Black voices, experiences, and perspectives through meaningful dialogue and storytelling. Hosted by Angelica Watkins, the series blends social commentary, mental health awareness, cultural identity, and empowerment into conversations that challenge narratives and inspire growth.",
        "Produced by Azariah Management Group under Studio AMG, BlackbyAngel is more than a show—it is a platform for visibility, healing, and forward-thinking dialogue that uplifts community voices and sparks impactful change."
      ],
      themes: "Culture • Identity • Mental Health • Advocacy • Empowerment",
      format: "Talk Show / Advocacy / Cultural Commentary"
    },
    'Captain Chiffon': {
      synopsis: [
        "Captain Chiffon is an empowering, imaginative, and educational series that follows Captain Chiffon—a courageous, compassionate leader who guides children and families through life’s everyday challenges using creativity, emotional intelligence, and problem-solving skills.",
        "Blending storytelling, positive messaging, and real-world lessons, the series encourages confidence, kindness, resilience, and self-belief. Each episode explores themes such as leadership, empathy, teamwork, mental wellness, and purpose—helping young viewers learn how to navigate their world with courage and care.",
        "At its core, Captain Chiffon inspires children to see themselves as leaders, helpers, and changemakers—reminding them that strength comes not just from power, but from character."
      ],
      themes: "Leadership • Confidence • Emotional Intelligence • Kindness • Purpose • Mental Wellness",
      format: "Educational / Animated or Live-Action Youth Series"
    },
    'The Silent Movement': {
      synopsis: [
        "The Silent Movement is a high-impact advocacy and policy-focused initiative designed to bridge the gap between awareness and action. It serves as a mobilizing force that takes the cultural narratives from our media platforms and converts them into tangible systemic change.",
        "Focused on underrepresented voices and critical social issues, the movement leverages award-winning visuals and data-driven strategy to engage policymakers, grassroots organizations, and global stakeholders in meaningful dialogue."
      ],
      strategicFit: "The Silent Movement serves as the advocacy backbone connecting Family First, BlackbyAngel, and Voices of the Diaspora, translating conversation and storytelling into measurable community impact and policy-aligned action.",
      themes: "Policy Reform • Advocacy • Systemic Change • Community Empowerment",
      format: "Advocacy Campaign / Policy Initiative"
    }
  };

  const getProgramImage = (title: string) => {
    switch (title) {
      case 'Family First':
        return "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=2070";
      case 'BlackbyAngel Initiative':
        return "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=2067";
      case 'Start Point':
        return "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2074";
      case 'Voices of the Diaspora':
        return "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2059";
      case 'Captain Chiffon':
        return "https://images.unsplash.com/photo-1534643900280-4533df516147?auto=format&fit=crop&q=80&w=2071";
      case 'The Silent Movement':
        return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070";
      default:
        return "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2071";
    }
  };

  return (
    <div className="pt-24">
      {/* HERO SECTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 left-0 w-1/4 h-full bg-slate-50 -skew-x-12 -translate-x-1/2 -z-10"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 reveal active">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-50 text-lime-800 text-xs font-black uppercase tracking-widest rounded-full border border-lime-100 animate-pulse">
              <Zap className="w-4 h-4 fill-lime-500" /> High-Impact Ventures
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              The Engine of Innovation.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-blue-600 pl-6">
              Our signature programs are the living proof of our commitment to community impact and economic growth.
            </p>
          </div>
          <div className="relative reveal active">
             <div className="aspect-square bg-slate-900 rounded-sm shadow-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071" 
                  alt="Innovation" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute bottom-10 left-10 p-8 bg-white/95 backdrop-blur-sm border-l-8 border-lime-500 max-w-sm shadow-2xl">
                   <p className="text-2xl font-black text-slate-900 tracking-tight uppercase">Purpose-Led Innovation in Motion</p>
                </div>
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* MEDIA SLATE OVERVIEW */}
      <SectionWrapper bg="light" className="relative overflow-hidden border-y border-slate-100">
        <div className="space-y-24 relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-blue-600">
                <LayoutDashboard className="w-5 h-5" /> Media Slate Overview
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">
                Azariah Management Group (AMG) – Media Slate
              </h2>
              <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
                <p className="text-lg">
                  The AMG Media Slate is a curated portfolio of original programming and advocacy initiatives designed to inform, inspire, and drive impact across business, culture, family, and community.
                </p>
                <p>
                  Through storytelling, dialogue, and education, AMG leverages media as a strategic tool to elevate underrepresented voices, strengthen systems, and catalyze meaningful change.
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-6">
              {[
                { 
                  pillar: "1. Leadership & Innovation", 
                  title: "Start Point", 
                  desc: "Spotlighting authentic journeys of CEOs at critical moments. Reframes success by focusing on resilience and purpose-driven leadership.",
                  icon: Zap,
                  tag: "Entrepreneurship"
                },
                { 
                  pillar: "2. Family & Wellness", 
                  title: "Family First | Silent Movement", 
                  desc: "Creating space for dialogue on parenting and mental wellness, translating storytelling into measurable advocacy action.",
                  icon: Heart,
                  tag: "Mental Health"
                },
                { 
                  pillar: "3. Culture & Identity", 
                  title: "BlackbyAngel | Voices", 
                  desc: "Honoring lived experience and global Black voices. Exploring identity, heritage, and interconnectedness across the diaspora.",
                  icon: Globe,
                  tag: "Social Progress"
                },
                { 
                  pillar: "4. Youth & Education", 
                  title: "Captain Chiffon", 
                  desc: "Empowering children to see themselves as leaders and changemakers through emotional intelligence and character-building.",
                  icon: Sparkles,
                  tag: "Future Leaders"
                }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-white border border-slate-100 rounded-sm hover:border-slate-900 transition-all group shadow-sm">
                   <div className="flex justify-between items-start mb-6">
                     <item.icon className="w-8 h-8 text-blue-600 group-hover:text-lime-500 transition-colors" />
                     <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{item.tag}</span>
                   </div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.pillar}</h4>
                   <h5 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-3">{item.title}</h5>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* INTEGRATED IMPACT MODEL */}
          <div className="py-20 border-t border-slate-200">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Integrated Impact Model</h3>
                  <p className="text-slate-500 font-medium">Moving audiences through a continuum of intentional change.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  {[
                    { step: "Awareness", icon: Megaphone, label: "Media & Storytelling spark awareness (Start Point, BlackbyAngel)" },
                    { step: "Conversation", icon: MessageSquare, label: "Dialogue & Education deepen understanding (Family First, Voices)" },
                    { step: "Empowerment", icon: TrendingUp, label: "Advocacy & Engagement mobilize action (The Silent Movement)" },
                    { step: "Action", icon: Target, label: "Youth Programming ensures generational continuity (Captain Chiffon)" }
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-6 bg-white border border-slate-100 group hover:border-blue-600 transition-all rounded-sm shadow-sm">
                       <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-slate-100">
                         <s.icon className="w-6 h-6 text-blue-600 mb-2" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{s.step}</span>
                       </div>
                       <p className="text-sm font-bold text-slate-600 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 p-12 md:p-16 rounded-sm text-white space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Scale className="w-48 h-48 text-white" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-shine-white">Why the Slate Matters</h3>
                <div className="space-y-8">
                  {[
                    { title: "Aligned Impact", desc: "Maps directly to advocacy, education, and community goals." },
                    { title: "Strategic Partnerships", desc: "Designed for nonprofits, sponsors, and institutions." },
                    { title: "Measurable Outcomes", desc: "Generates real data alongside audience engagement." }
                  ].map((v, idx) => (
                    <div key={idx} className="flex items-start gap-5 group">
                      <div className="w-6 h-6 rounded-full bg-lime-500/20 flex items-center justify-center shrink-0 group-hover:bg-lime-500 transition-all">
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 group-hover:text-slate-950" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-lg font-black uppercase tracking-tight text-white">{v.title}</h5>
                        <p className="text-slate-400 text-sm font-medium">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-10 border-t border-slate-800 flex flex-wrap gap-4">
                  {["Streaming", "Education", "CSR", "Public Impact"].map(tag => (
                    <span key={tag} className="px-4 py-2 bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* STRATEGIC FIT WITHIN AMG - ADDED HERE */}
      <SectionWrapper bg="white" className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto py-12">
          <div className="bg-slate-50 border-y border-slate-100 p-12 md:p-20 relative group">
            <div className="absolute top-0 left-0 w-2 h-full bg-lime-500"></div>
            <div className="space-y-10 reveal active">
              <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-slate-900">
                <Link className="w-5 h-5 text-lime-500" /> Strategic Fit Within AMG
              </div>
              <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[1.2] uppercase">
                The Silent Movement serves as the advocacy backbone connecting <span className="text-blue-600">Family First</span>, <span className="text-lime-600">BlackbyAngel</span>, and <span className="text-blue-400">Voices of the Diaspora</span>.
              </p>
              <div className="flex flex-col md:flex-row gap-10 items-start md:items-center pt-8 border-t border-slate-200">
                <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-2xl italic">
                  "Translating conversation and storytelling into measurable community impact and policy-aligned action."
                </p>
                <div className="flex -space-x-4">
                  {[Heart, ShieldCheck, Globe].map((Icon, i) => (
                    <div key={i} className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-lg transform hover:-translate-y-2 transition-transform duration-500">
                       <Icon className="w-6 h-6 text-slate-900" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* PROGRAMS GRID */}
      <SectionWrapper bg="light">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto reveal active">
             <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase text-shine">Signature Initiatives</h2>
             <p className="text-slate-500 text-lg font-medium">Platform-based solutions driving global cultural and economic transformation.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SIGNATURE_PROGRAMS.map((program) => {
              const Icon = getProgramIcon(program.title);
              
              return (
                <div key={program.title} className="reveal active flex flex-col h-full bg-white border border-slate-100 rounded-sm hover:border-slate-900 transition-all duration-500 relative overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 group">
                  <div className="p-10 space-y-6 flex-grow">
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-slate-50 rounded-sm group-hover:bg-slate-950 transition-colors duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <Icon className="w-8 h-8 text-slate-900 group-hover:text-lime-500 transition-colors" />
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {program.tags.map(tag => (
                          <span key={tag} className="text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 bg-slate-100 text-slate-500 group-hover:bg-lime-500 group-hover:text-slate-900 transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors uppercase">{program.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      {program.description}
                    </p>
                  </div>

                  <div className="p-10 pt-0">
                    <button 
                      onClick={() => setSelectedProgram(program)}
                      className="w-full py-5 border-t border-slate-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-all"
                    >
                      Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700 opacity-20"></div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* FULL-PAGE PROGRAM DETAIL OVERLAY */}
      {selectedProgram && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-500 overflow-hidden">
          {/* NAV BAR */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-6 md:px-12 flex justify-between items-center z-50">
            <button 
              onClick={() => setSelectedProgram(null)}
              className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Programs
            </button>
            <div className="flex items-center gap-4">
               <div className="hidden md:flex flex-col items-end">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Project Profile</span>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{selectedProgram.title}</span>
               </div>
               <div className="w-px h-8 bg-slate-100 mx-2 hidden md:block"></div>
               <button 
                 onClick={() => setSelectedProgram(null)}
                 className="p-2 text-slate-400 hover:text-slate-950 transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col lg:flex-row min-h-full">
              {/* LEFT COLUMN: Visual Anchor */}
              <div className="w-full lg:w-[40%] bg-slate-900 relative min-h-[400px] lg:min-h-0">
                 <img 
                   src={getProgramImage(selectedProgram.title)} 
                   className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
                   alt={selectedProgram.title}
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-transparent flex flex-col justify-end p-12 md:p-20">
                    <div className="space-y-8 animate-in slide-in-from-left-8 duration-700 delay-200">
                      <div className="w-20 h-20 bg-lime-500 rounded-sm flex items-center justify-center shadow-2xl">
                         {React.createElement(getProgramIcon(selectedProgram.title), { className: "w-10 h-10 text-slate-950" })}
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {selectedProgram.tags.map((tag: string) => (
                            <span key={tag} className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/10 text-white border border-white/20 px-3 py-1 backdrop-blur-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] text-shine-white">
                          {selectedProgram.title}.
                        </h2>
                      </div>
                    </div>
                 </div>
              </div>

              {/* RIGHT COLUMN: Reading Experience */}
              <div className="flex-1 bg-white p-12 md:p-20 lg:p-32 max-w-5xl">
                <div className="space-y-20 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                  
                  {PROGRAM_DETAILS[selectedProgram.title] ? (
                    <div className="space-y-20">
                      {/* Synopsis Section */}
                      <div className="space-y-8">
                        <h4 className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-blue-600">
                          <Info className="w-5 h-5" /> Synopsis
                        </h4>
                        <div className="space-y-10 border-l-8 border-slate-50 pl-10 md:pl-16">
                          {PROGRAM_DETAILS[selectedProgram.title].synopsis.map((para: string, idx: number) => (
                            <p key={idx} className="text-2xl md:text-3xl text-slate-800 font-medium leading-[1.4] tracking-tight">
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* NEW: Strategic Fit Section */}
                      {PROGRAM_DETAILS[selectedProgram.title].strategicFit && (
                        <div className="p-10 md:p-16 bg-slate-50 border-l-8 border-lime-500 space-y-6">
                           <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-slate-900">
                              <Target className="w-5 h-5 text-lime-500" /> Strategic Fit Within AMG
                           </h4>
                           <p className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed italic">
                              "{PROGRAM_DETAILS[selectedProgram.title].strategicFit}"
                           </p>
                        </div>
                      )}

                      {/* Technical Specs */}
                      <div className="grid md:grid-cols-2 gap-12 pt-16 border-t border-slate-100">
                        <div className="space-y-6">
                           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <Scale className="w-4 h-4 text-lime-500" /> Key Themes
                           </div>
                           <p className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                              {PROGRAM_DETAILS[selectedProgram.title].themes}
                           </p>
                        </div>
                        <div className="space-y-6">
                           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <Clapperboard className="w-4 h-4 text-blue-600" /> Platform Format
                           </div>
                           <p className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                              {PROGRAM_DETAILS[selectedProgram.title].format}
                           </p>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="pt-10 flex flex-col md:flex-row items-center gap-8">
                         <button 
                           onClick={() => {
                              setSelectedProgram(null);
                              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                           }}
                           className="w-full md:w-auto px-16 py-8 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-4 group"
                         >
                           Partner with this Project <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                         </button>
                         <button 
                           className="w-full md:w-auto px-16 py-8 border-2 border-slate-200 text-slate-900 font-black rounded-sm hover:border-slate-900 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-4 group"
                         >
                           Media Inquiries <Play className="w-5 h-5" />
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 text-center space-y-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm">
                      <Sparkles className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
                      <div className="space-y-2">
                        <h4 className="text-xl font-black text-slate-900 uppercase">Profile Under Construction</h4>
                        <p className="text-slate-500 text-sm font-medium">The full strategic blueprint for {selectedProgram.title} is currently being finalized.</p>
                      </div>
                      <button 
                        onClick={() => setSelectedProgram(null)}
                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Notify me when available
                      </button>
                    </div>
                  )}

                  {/* FOOTER AREA */}
                  <div className="pt-20 border-t border-slate-100 opacity-50 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
                      Azariah Management Group • Initiative Profile • {new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramsPage;