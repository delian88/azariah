import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  Camera, Play, Film, Tv, Megaphone, Sparkles, ArrowRight, 
  MessageSquare, Users, Target, Heart, Globe, Clapperboard,
  MonitorPlay, Mic2, Share2, Layers, Workflow, ShieldCheck,
  CheckCircle2, XCircle, Zap, ExternalLink, Quote, FileText, Send
} from 'lucide-react';

const StudioAMGPage: React.FC = () => {
  const PORTFOLIO_ITEMS = [
    {
      title: "Voices of the Diaspora",
      category: "Documentary",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2059",
      impact: "Influenced trade policy discussions across 3 regions."
    },
    {
      title: "Start Point: The Series",
      category: "Original Programming",
      image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=2070",
      impact: "Reached 1.2M+ viewers across digital platforms."
    },
    {
      title: "Foundation of Luv Impact Film",
      category: "Social Impact Film",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1964",
      impact: "Helped secure $2M in grant funding."
    },
    {
      title: "Corporate ESG Standard",
      category: "Branded Content",
      image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=2050",
      impact: "Internal engagement increased by 45%."
    },
    {
      title: "The Silent Movement",
      category: "Advocacy Campaign",
      image: "https://images.unsplash.com/photo-1542204113-e9354e746522?auto=format&fit=crop&q=80&w=1974",
      impact: "Mobilized 50+ grassroots organizations."
    },
    {
      title: "Tech for Humanity",
      category: "Narrative Short",
      image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=2006",
      impact: "Winner of 'Innovation in Storytelling' Award."
    }
  ];

  const TESTIMONIALS = [
    {
      quote: "Studio AMG helped us tell a story we never had the words for. Their film tripled our reach.",
      author: "Nonprofit Director"
    },
    {
      quote: "Their ability to translate government programs into relatable stories is unmatched.",
      author: "Public Agency Official"
    }
  ];

  return (
    <div className="pt-24">
      {/* SECTION 1 — HERO HEADER */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 -z-10 -skew-x-12 translate-x-1/2"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100 animate-pulse">
              <Camera className="w-4 h-4" /> The Creative Hub
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Impact Stories.
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium border-l-4 border-lime-500 pl-6">
              Powerful narratives that move communities and elevate mission-driven brands.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-xl uppercase tracking-widest text-[10px] hover:-translate-y-1">
                Book Discovery Call
              </button>
            </div>
          </div>
          <div className="relative reveal delay-300">
             <div className="aspect-video bg-slate-900 rounded-sm shadow-2xl overflow-hidden group border-8 border-white">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 flex items-end p-8">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center animate-pulse group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-slate-950 text-slate-950" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">Studio Showreel</span>
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2071" 
                  alt="Studio Media" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80"
                />
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 5 — PROBLEM / SOLUTION / IMPACT */}
      <SectionWrapper bg="white" className="py-32 relative overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto space-y-20">
          <div className="text-center space-y-6 reveal">
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight max-w-4xl mx-auto text-shine">
              Stories That Resonate.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* The Problem */}
            <div className="reveal p-10 bg-white border-t-8 border-slate-300 shadow-xl space-y-6 hover:-translate-y-2 transition-all duration-500">
              <div className="p-3 bg-slate-100 inline-block rounded-sm">
                <XCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">The Problem</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">
                Organizations struggle to communicate impact clearly. Their work is powerful—but it's not felt.
              </p>
            </div>

            {/* Our Solution */}
            <div className="reveal delay-200 p-10 bg-white border-t-8 border-blue-600 shadow-2xl space-y-6 hover:-translate-y-4 transition-all duration-500 relative z-20">
              <div className="p-3 bg-blue-50 inline-block rounded-sm">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Our Solution</h3>
              <p className="text-slate-600 leading-relaxed font-bold text-sm">
                Cinematic production and strategic messaging that transforms missions into compelling narratives.
              </p>
            </div>

            {/* The Impact */}
            <div className="reveal delay-400 p-10 bg-slate-900 text-white border-t-8 border-lime-500 shadow-xl space-y-6 hover:-translate-y-2 transition-all duration-500">
              <div className="p-3 bg-slate-800 inline-block rounded-sm">
                <Sparkles className="w-8 h-8 text-lime-400" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-shine-white">The Impact</h3>
              <p className="text-slate-300 font-bold text-sm">Believing stakeholders. Engaged communities. Unforgettable missions.</p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 6 — FEATURED WORK */}
      <SectionWrapper bg="light">
        <div className="space-y-16">
          <div className="max-w-3xl space-y-4 reveal">
            <div className="w-12 h-1 bg-slate-900"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase text-shine">
              Our Portfolio
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO_ITEMS.map((project, i) => (
              <div key={i} className="reveal group relative overflow-hidden bg-slate-900 aspect-[4/5] rounded-sm shadow-xl" style={{ transitionDelay: `${i * 100}ms` }}>
                 <img 
                   src={project.image} 
                   alt={project.title} 
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
                          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-lime-400">
                             Case Study <ExternalLink className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 8 — CLEAR CALL TO ACTION */}
      <SectionWrapper bg="dark" className="relative overflow-hidden py-32 md:py-48">
         <div className="absolute inset-0 bg-blue-600/5 -z-10 animate-pulse"></div>
         <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10 reveal">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-shine-white">
              Ready to Bring Your Story to Life?
            </h2>
            <p className="text-xl md:text-3xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
              Let’s build a narrative that inspires action, strengthens your brand, and amplifies your impact.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-8">
               <button className="w-full md:w-auto px-14 py-7 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-4 group hover:-translate-y-2">
                 Start Your Creative Project <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
               <button className="w-full md:w-auto px-14 py-7 border-2 border-white/20 text-white font-black rounded-sm hover:bg-white hover:text-slate-900 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-4 group hover:-translate-y-2">
                 Request a Media Proposal <FileText className="w-5 h-5" />
               </button>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default StudioAMGPage;