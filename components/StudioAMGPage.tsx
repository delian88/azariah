import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  Camera, Play, Film, Tv, Megaphone, Sparkles, ArrowRight, 
  MessageSquare, Users, Target, Heart, Globe, Clapperboard,
  MonitorPlay, Mic2, Share2, Layers, Workflow, ShieldCheck,
  CheckCircle2, XCircle, Zap, ExternalLink, Quote, FileText, Send,
  Brain, Cpu, X, ChevronLeft, Info, Clock, BarChart3, Youtube
} from 'lucide-react';

const IMAGE_FALLBACK = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2071";

const StudioAMGPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = IMAGE_FALLBACK;
  };

  const NETWORK_VIDEOS = [
    { id: 'm0_tXv_Xv5o', title: 'Studio AMG Network Launch', category: 'Network' },
    { id: 'Ueo4httxgVY', title: 'Studio AMG (Azariah Management Group)', category: 'Brand' },
    { id: 'Hz4_3mcTvyA', title: 'BLACK BY ANGEL THE ORIGIN', category: 'Talk Show' },
    { id: 'i8Qmu8H2w24', title: 'BLACKBYANGEL "THE JOURNEY"', category: 'Talk Show' },
    { id: 'IP9qfZJUldU', title: 'MY BARBER’S LOUNGE', category: 'Lifestyle' },
    { id: 'KDDQ9et05t4', title: 'We Rise', category: 'Documentary' },
    { id: 'IWPdFb0r3n4', title: 'CAPTAIN CHIFFON THEME Song', category: 'Animation' },
    { id: 'n_rhhqNeXEY', title: 'CAPTAIN CHIFFON PODCAST ADVERT', category: 'Animation' },
    { id: '6nA7dh5JPbM', title: 'BlackbyAngel (Boundaries and Bondage)', category: 'Talk Show' },
    { id: '9J16DpeksTw', title: '@BLACKBYANGEL EP 2 BOUNDARIES & BONDAGE', category: 'Talk Show' },
    { id: '4wrb_2Pedhc', title: 'BAD FRIEND BONUS EPISODE', category: 'Talk Show' },
    { id: 'bRHiFE9NElU', title: 'The Pink Bosses', category: 'Talk Show' },
    { id: 'bD2OXMZE0bI', title: 'The Pink Bosses Show', category: 'Talk Show' },
    { id: 'KHt6oWqSkcE', title: 'Wrong Diagnosis Ep 5', category: 'Advocacy' },
    { id: 'Y7e8gvlkCeU', title: 'Family First: Wellness & Unity', category: 'Wellness' },
    { id: 'fL_USE9Hn10', title: 'Marriage Restoration Story', category: 'Wellness' },
    { id: 'IK1_vZ4v4bI', title: 'Family First: On a Budget', category: 'Wellness' },
    { id: 'q9p9OP6WK6w', title: "Life's Second Chance", category: 'Originals' },
    { id: 'vB_K7tH6s2M', title: 'Start Point: The Series Trailer', category: 'Originals' },
    { id: '7DDRz6mG_C4', title: 'The Silent Movement: Mental Health', category: 'Advocacy' }
  ];

  const PORTFOLIO_ITEMS = [
    {
      id: 'start-point',
      title: "Start Point: The Series",
      category: "Original Programming",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2071",
      impact: "High-impact docu-series reaching a wide range of viewers, featuring emerging CEOs and scaling the narrative of innovators.",
      details: {
        synopsis: [
          "Start Point is a docu-reality series that follows the authentic journeys of entrepreneurs, founders, and CEOs at the pivotal moments where vision meets uncertainty. Rather than spotlighting success alone, the series captures the real decisions, risks, failures, and breakthroughs that shape leadership from the ground up.",
          "Through candid storytelling and behind-the-scenes access, Start Point reveals what it truly takes to build something meaningful offering inspiration, practical insight, and human connection for aspiring leaders, innovators, and changemakers."
        ],
        themes: "Entrepreneurship • Leadership • Resilience • Innovation • Purpose",
        format: "Docu-Reality / Business & Human Interest"
      }
    },
    {
      id: 'voices-diaspora',
      title: "Voices of the Diaspora",
      category: "Documentary",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2059",
      impact: "Influenced global trade policy discussions for the G.A.M. ecosystem, bridging connections between North America and the African Diaspora.",
      details: {
        synopsis: [
          "Voices of the Diaspora is a powerful storytelling and dialogue series that amplifies the lived experiences, perspectives, and contributions of people across the global African diaspora.",
          "Spanning continents and generations, the series bridges global perspectives with local impact, honoring roots while spotlighting forward-thinking voices shaping the future."
        ],
        themes: "Culture • Identity • Migration • Global Community",
        format: "Documentary / Cultural & Advocacy Series"
      }
    },
    {
      id: 'family-first',
      title: "Family First",
      category: "Lifestyle & Advocacy Series",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=2070",
      impact: "Creating safe spaces for families to engage in honest dialogue, strengthen bonds, and prioritize emotional well-being.",
      details: {
        synopsis: [
          "Family First is a values-centered series that explores the dynamics of family, parenting, and relationships in today’s rapidly evolving world. Through real conversations, expert insights, and lived experiences, the series addresses mental health, communication, generational challenges, and the importance of nurturing strong family foundations.",
          "Designed to educate, empower, and heal, Family First creates a safe and relatable space for families to engage in honest dialogue, strengthen bonds, and prioritize emotional well-being across generations."
        ],
        themes: "Family • parenting • Mental Health • Relationships • Community Wellness",
        format: "Lifestyle / Educational / Advocacy"
      }
    },
    {
      id: 'blackbyangel',
      title: "BlackbyAngel",
      category: "Talk & Advocacy Series",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=2067",
      impact: "A platform for visibility, healing, and forward-thinking dialogue that uplifts community voices and sparks impactful change.",
      details: {
        synopsis: [
          "BlackbyAngel is a bold, culturally resonant talk and advocacy series that centers Black voices, experiences, and perspectives through meaningful dialogue and storytelling. Hosted by Angelica Watkins, the series blends social commentary, mental health awareness, cultural identity, and empowerment into conversations that challenge narratives and inspire growth.",
          "Produced by Azariah Management Group under Studio AMG, BlackbyAngel is more than a show—it is a platform for visibility, healing, and forward-thinking dialogue that uplifts community voices and sparks impactful change."
        ],
        themes: "Culture • Identity • Mental Health • Advocacy • Empowerment",
        format: "Talk Show / Advocacy / Cultural Commentary"
      }
    },
    {
      id: 'captain-chiffon',
      title: "Captain Chiffon",
      category: "Animation & Youth Series",
      image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=2069",
      impact: "Empowering children to see themselves as leaders, helpers, and changemakers—reminding them that strength comes from character.",
      details: {
        synopsis: [
          "Captain Chiffon is an empowering, imaginative, and educational series that follows Captain Chiffon—a courageous, compassionate leader who guides children and families through life’s everyday challenges using creativity, emotional intelligence, and problem-solving skills.",
          "Blending storytelling, positive messaging, and real-world lessons, the series encourages confidence, kindness, resilience, and self-belief. Each episode explores themes such as leadership, empathy, teamwork, mental wellness, and purpose—helping young viewers learn how to navigate their world with courage and care.",
          "At its core, Captain Chiffon inspires children to see themselves as leaders, helpers, and changemakers—reminding them that strength comes not just from power, but from character."
        ],
        themes: "Leadership • Confidence • Emotional Intelligence • Kindness • Purpose • Mental Wellness",
        format: "Educational / Animated or Live-Action Youth Series"
      }
    },
    {
      id: 'silent-movement',
      title: "The Silent Movement",
      category: "Advocacy Campaign",
      image: "https://images.unsplash.com/photo-1542204113-e9354e746522?auto=format&fit=crop&q=80&w=1974",
      impact: "Award-winning advocacy visuals that mobilized 50+ grassroots organizations for mental health awareness.",
      details: {
        synopsis: [
          "The Silent Movement is an advocacy-driven initiative and storytelling platform dedicated to amplifying voices that are too often unheard—those affected by mental health challenges, family instability, systemic barriers, and social inequities. The movement sheds light on the quiet struggles happening within communities, homes, and institutions, and transforms awareness into action.",
          "Through real stories, educational content, and community engagement, The Silent Movement challenges stigma, encourages dialogue, and promotes access to support, resources, and policy change. It centers dignity, empathy, and accountability creating space for healing while mobilizing collective responsibility.",
          "At its core, The Silent Movement affirms that silence is not weakness, and visibility is the first step toward meaningful change."
        ],
        themes: "Mental Health Advocacy • Family & Community Wellness • Social Equity • Awareness to Action",
        format: "Advocacy Campaign / Media Series / Community Initiative"
      }
    }
  ];

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24">
      {/* SECTION 1 — HERO HEADER */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 -z-10 -skew-x-12 translate-x-1/2"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 reveal active">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100 animate-pulse">
              <Camera className="w-4 h-4" /> The Creative Hub
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Studio AMG.
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium border-l-4 border-lime-500 pl-6">
              Where high-level strategy meets world-class cinematic storytelling to drive measurable impact.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={scrollToContact}
                className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-xl uppercase tracking-widest text-[10px] hover:-translate-y-1"
              >
                Book Discovery Call
              </button>
              <a 
                href="https://www.youtube.com/@STUDIOAMG-NETWORK" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-10 py-5 border-2 border-slate-200 text-slate-900 font-black rounded-sm hover:border-slate-900 transition-all uppercase tracking-widest text-[10px] flex items-center gap-3"
              >
                <Youtube className="w-4 h-4 text-red-600" /> Visit Network
              </a>
            </div>
          </div>
          <div className="relative reveal active">
             <div className="aspect-video bg-slate-900 rounded-sm shadow-2xl overflow-hidden group border-8 border-white">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/m0_tXv_Xv5o?autoplay=1&mute=1&loop=1&playlist=m0_tXv_Xv5o" 
                  title="Studio AMG Featured" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* COMPREHENSIVE NETWORK SPOTLIGHT SECTION */}
      <SectionWrapper bg="dark" className="relative overflow-hidden py-32">
         <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5 pointer-events-none"></div>
         <div className="space-y-16 relative z-10">
            <div className="max-w-4xl space-y-6 reveal">
               <div className="flex items-center gap-3 text-lime-400 font-black text-xs uppercase tracking-widest">
                  <MonitorPlay className="w-5 h-5" /> Network Spotlight
               </div>
               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none text-shine-white">
                 Broadcasts & Originals
               </h2>
               <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                 Explore the extensive library of broadcasts, documentaries, and advocacy series from the STUDIO AMG NETWORK ecosystem.
               </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 reveal">
               {NETWORK_VIDEOS.map((video, idx) => (
                 <div key={idx} className="group bg-slate-800 rounded-sm overflow-hidden shadow-xl border border-slate-700 hover:border-lime-500 transition-all flex flex-col h-full">
                    <div className="aspect-video relative overflow-hidden bg-slate-900">
                       <iframe 
                          className="w-full h-full grayscale-[40%] group-hover:grayscale-0 transition-all duration-700"
                          src={`https://www.youtube.com/embed/${video.id}`} 
                          title={video.title}
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                       ></iframe>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                       <div className="flex justify-between items-start mb-3">
                         <h4 className="text-xs font-black text-white uppercase tracking-widest group-hover:text-lime-400 transition-colors flex-1 line-clamp-2">
                           {video.title}
                         </h4>
                         <span className="text-[7px] font-black uppercase tracking-widest bg-slate-950 px-2 py-0.5 text-blue-400 rounded-full border border-blue-400/20 shrink-0 ml-2">
                           {video.category}
                         </span>
                       </div>
                       <div className="mt-auto flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                          <span className="flex items-center gap-1.5"><Zap className="w-2.5 h-2.5 text-lime-500" /> AMG</span>
                          <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> Featured</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            <div className="pt-12 text-center reveal">
               <a 
                 href="https://www.youtube.com/@STUDIOAMG-NETWORK" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-4 px-12 py-6 bg-slate-800 text-white font-black rounded-sm hover:bg-white hover:text-slate-950 transition-all shadow-xl uppercase tracking-widest text-xs group"
               >
                 View All 100+ Videos on YouTube <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
               </a>
            </div>
         </div>
      </SectionWrapper>

      {/* OPERATING PHILOSOPHY */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="space-y-20 relative z-10">
          <div className="max-w-4xl space-y-8 reveal">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-blue-600"></div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600">AMG Operating Philosophy</h2>
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight uppercase">
              Philosophy Aligned to Media, <br className="hidden md:block" /> Advocacy & AI Initiatives
            </h3>
            <p className="text-xl md:text-2xl text-slate-700 font-bold leading-snug border-l-4 border-slate-900 pl-8">
              "At Azariah Management Group, we operate at the intersection of strategy, storytelling, and systems change. We believe advocacy without structure lacks sustainability, and technology without values lacks purpose."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 reveal">
            {[
              {
                icon: Megaphone,
                title: "Media & Platforms",
                desc: "Through media platforms like BlackbyAngel and Family First, we elevate authentic narratives that inspire awareness and action."
              },
              {
                icon: Users,
                title: "Advocacy & Community",
                desc: "Through advocacy and community initiatives, we design solutions that address real needs and foster deep-rooted systemic change."
              },
              {
                icon: Brain,
                title: "AI & Technology",
                desc: "Through AI and emerging technologies, we build tools that expand access, efficiency, and opportunity ethically and inclusively."
              }
            ].map((pillar, i) => (
              <div key={i} className="p-10 bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                 <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-sm mb-6 group-hover:bg-slate-900 transition-colors">
                    <pillar.icon className="w-6 h-6 text-slate-900 group-hover:text-lime-500 transition-colors" />
                 </div>
                 <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4">{pillar.title}</h4>
                 <p className="text-slate-500 text-sm leading-relaxed font-medium">
                   {pillar.desc}
                 </p>
              </div>
            ))}
          </div>

          <div className="pt-10 flex flex-col items-center text-center space-y-6 reveal">
             <div className="w-full h-[1px] bg-slate-200"></div>
             <p className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter text-shine">
               Our philosophy is simple: impact must be intentional, scalable, and human-centered.
             </p>
             <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="w-2 h-2 rounded-full bg-lime-500"></span>
                <span className="w-2 h-2 rounded-full bg-slate-900"></span>
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* PORTFOLIO GRID */}
      <SectionWrapper bg="white" className="py-24">
        <div className="space-y-16">
          <div className="max-w-3xl space-y-4 reveal">
            <div className="w-12 h-1 bg-slate-900"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase text-shine">
              The Portfolio
            </h2>
            <p className="text-xl text-slate-500 font-medium">Original programming and high-impact branded content.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO_ITEMS.map((project, i) => (
              <div 
                key={i} 
                className="reveal group relative overflow-hidden bg-slate-900 aspect-[4/5] rounded-sm shadow-xl cursor-pointer" 
                onClick={() => setSelectedProject(project)}
              >
                 <img 
                   src={project.image} 
                   alt={project.title} 
                   onError={handleImageError}
                   className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-60 group-hover:opacity-100"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>
                 <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                    <div className="space-y-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                       <span className="px-3 py-1 bg-lime-500 text-slate-950 text-[8px] font-black uppercase tracking-widest rounded-sm">
                         {project.category}
                       </span>
                       <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tighter">
                         {project.title}
                       </h3>
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          <p className="text-slate-300 text-xs font-medium mb-4">{project.impact}</p>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-lime-400 hover:text-white transition-colors">
                             View Details <ExternalLink className="w-3 h-3" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* PROJECT DETAIL OVERLAY */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-500 overflow-hidden">
          {/* HEADER */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-6 md:px-12 flex justify-between items-center z-50">
            <button 
              onClick={() => setSelectedProject(null)}
              className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Portfolio
            </button>
            <button 
              onClick={() => setSelectedProject(null)}
              className="p-2 text-slate-400 hover:text-slate-950 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col lg:flex-row min-h-full">
              {/* LEFT COLUMN: Visual */}
              <div className="w-full lg:w-[40%] bg-slate-900 relative min-h-[400px] lg:min-h-0">
                 <img 
                   src={selectedProject.image} 
                   onError={handleImageError}
                   className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
                   alt={selectedProject.title}
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-transparent flex flex-col justify-end p-12 md:p-20">
                    <div className="space-y-8 animate-in slide-in-from-left-8 duration-700 delay-200">
                      <div className="w-16 h-16 bg-lime-500 rounded-sm flex items-center justify-center shadow-2xl">
                         <Play className="w-8 h-8 text-slate-950" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/10 text-white border border-white/20 px-3 py-1 backdrop-blur-sm">
                          {selectedProject.category}
                        </span>
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] text-shine-white">
                          {selectedProject.title}.
                        </h2>
                      </div>
                    </div>
                 </div>
              </div>

              {/* RIGHT COLUMN: Info */}
              <div className="flex-1 bg-white p-12 md:p-20 lg:p-32 max-w-5xl">
                <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                  
                  {selectedProject.details ? (
                    <div className="space-y-16">
                      {/* Synopsis */}
                      <div className="space-y-8">
                        <h4 className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-blue-600">
                          <Info className="w-5 h-5" /> Synopsis
                        </h4>
                        <div className="space-y-10 border-l-8 border-slate-50 pl-10 md:pl-16">
                          {selectedProject.details.synopsis.map((para: string, idx: number) => (
                            <p key={idx} className="text-2xl md:text-3xl text-slate-800 font-medium leading-[1.4] tracking-tight">
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Technical Specs */}
                      <div className="grid md:grid-cols-2 gap-12 pt-16 border-t border-slate-100">
                        <div className="space-y-6">
                           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <Zap className="w-4 h-4 text-lime-500" /> Key Themes
                           </div>
                           <p className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                              {selectedProject.details.themes}
                           </p>
                        </div>
                        <div className="space-y-6">
                           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <Clapperboard className="w-4 h-4 text-blue-600" /> Platform Format
                           </div>
                           <p className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                              {selectedProject.details.format}
                           </p>
                        </div>
                      </div>

                      {/* Impact Highlight */}
                      <div className="p-10 bg-slate-50 border-l-8 border-blue-600">
                        <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-6">
                           <BarChart3 className="w-5 h-5 text-blue-600" /> Strategic Impact
                        </h4>
                        <p className="text-xl font-bold text-slate-700 leading-relaxed">
                          {selectedProject.impact}
                        </p>
                      </div>

                      <div className="pt-10 flex flex-col md:flex-row items-center gap-8">
                         <button 
                           onClick={() => {
                              setSelectedProject(null);
                              scrollToContact();
                           }}
                           className="w-full md:w-auto px-16 py-8 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-4 group"
                         >
                           Inquire for Partnership <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-12">
                      <div className="space-y-8">
                        <h4 className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-blue-600">
                          <Info className="w-5 h-5" /> Project Impact
                        </h4>
                        <div className="border-l-8 border-slate-50 pl-10 md:pl-16">
                          <p className="text-2xl md:text-3xl text-slate-800 font-medium leading-[1.4] tracking-tight">
                            {selectedProject.impact}
                          </p>
                        </div>
                      </div>
                      
                      <div className="py-20 text-center space-y-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm">
                        <Sparkles className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
                        <div className="space-y-2">
                          <h4 className="text-xl font-black text-slate-900 uppercase">Profile Finalization</h4>
                          <p className="text-slate-500 text-sm font-medium">The full cinematic blueprint for this project is currently being uploaded.</p>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedProject(null);
                            scrollToContact();
                          }}
                          className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Request Full Case Study
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-20 border-t border-slate-100 opacity-50 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
                      Azariah Management Group • Studio Portfolio • {new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALL TO ACTION */}
      <SectionWrapper bg="dark" className="relative overflow-hidden py-32 md:py-48">
         <div className="absolute inset-0 bg-blue-600/5 -z-10 animate-pulse"></div>
         <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10 reveal">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-shine-white">
              Ready to Amplify Your Impact?
            </h2>
            <p className="text-xl md:text-3xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
              Let’s build a cinematic narrative that inspires action, builds trust, and elevates your mission.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-8">
               <button 
                onClick={scrollToContact}
                className="w-full md:w-auto px-14 py-7 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-4 group hover:-translate-y-2"
               >
                 Start Your Creative Project <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default StudioAMGPage;