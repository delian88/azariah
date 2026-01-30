import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  Camera, Play, Film, Tv, Megaphone, Sparkles, ArrowRight, 
  MessageSquare, Users, Target, Heart, Globe, Clapperboard,
  MonitorPlay, Mic2, Share2, Layers, Workflow, ShieldCheck,
  CheckCircle2, XCircle, Zap, ExternalLink
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
      impact: "Helped secure $2M in additional grant funding."
    },
    {
      title: "Corporate ESG: The New Standard",
      category: "Branded Content",
      image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=2050",
      impact: "Internal engagement increased by 45% post-release."
    },
    {
      title: "The Silent Movement",
      category: "Advocacy Campaign",
      image: "https://images.unsplash.com/photo-1542204113-e9354e746522?auto=format&fit=crop&q=80&w=1974",
      impact: "Mobilized 50+ grassroots organizations for mental health awareness."
    },
    {
      title: "Tech for Humanity",
      category: "Narrative Short",
      image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=2006",
      impact: "Winner of the 'Innovation in Storytelling' Award 2023."
    }
  ];

  return (
    <div className="pt-24 animate-in fade-in duration-1000">
      {/* SECTION 1 — HERO HEADER */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 -skew-x-12 translate-x-1/2 z-0"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100">
              <Camera className="w-4 h-4" /> Creative Engine of AMG
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Creative Storytelling for Social Impact
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium border-l-4 border-lime-500 pl-6">
              Powerful narratives, documentary-style films, and branded content that move communities, 
              influence decision-makers, and elevate mission-driven organizations.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-10 py-5 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-xl uppercase tracking-widest text-sm">
                Book a Creative Discovery Call
              </button>
              <button className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-900 font-black rounded-sm hover:bg-slate-50 transition-all uppercase tracking-widest text-sm">
                View Our Work
              </button>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-video bg-slate-900 rounded-sm shadow-2xl overflow-hidden group border-8 border-white">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 flex items-end p-8">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center animate-pulse">
                      <Play className="w-6 h-6 fill-slate-950 text-slate-950" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">Studio Showreel 2024</span>
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2071" 
                  alt="Studio Media Production" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
             </div>
             <div className="absolute -bottom-6 -right-6 p-6 bg-lime-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl">
               Cinematic Impact
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 2 — STUDIO AMG OVERVIEW */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
            Where Strategy, Creativity & Social Impact Converge
          </h2>
          <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
            <p>
              Studio AMG is the creative and media division of Azariah Management Group—specializing in
              purpose-driven storytelling that amplifies voices, elevates brands, and advances community-centered missions.
            </p>
            <p className="text-slate-500">
              From executive-level campaigns to grassroots initiatives, we build emotionally resonant,
              cinematic content that not only inspires, but drives measurable action.
            </p>
          </div>
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { icon: Target, label: 'Strategy-Led' },
               { icon: Heart, label: 'Emotionally Resonant' },
               { icon: Globe, label: 'Culturally Aligned' },
               { icon: Sparkles, label: 'Cinematic Quality' }
             ].map((item, i) => (
               <div key={i} className="p-6 bg-white border border-slate-100 flex flex-col items-center gap-3">
                 <item.icon className="w-6 h-6 text-blue-600" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{item.label}</span>
               </div>
             ))}
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 3 — WHAT WE CREATE */}
      <SectionWrapper bg="white">
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="w-12 h-1 bg-lime-500"></div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase text-shine">Signature Creative Services</h2>
              <p className="text-slate-500 text-lg">Comprehensive media solutions designed for influence and engagement.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 1. Documentary & Narrative Production */}
            <div className="group p-10 bg-slate-50 border border-slate-100 rounded-sm hover:bg-white hover:border-slate-900 hover:shadow-2xl transition-all duration-500">
              <div className="mb-8 p-4 bg-white inline-block rounded-sm group-hover:bg-slate-950 transition-colors">
                <Film className="w-8 h-8 text-blue-600 group-hover:text-lime-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tighter uppercase">1. Documentary & Narrative Production</h3>
              <ul className="space-y-4">
                {[
                  'Social impact films',
                  'Founder and origin-story documentaries',
                  'Nonprofit + foundation storytelling',
                  'Diaspora and cultural narratives'
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-1.5 h-1.5 bg-lime-500 rounded-full"></div> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Branded Content & Corporate Storytelling */}
            <div className="group p-10 bg-slate-50 border border-slate-100 rounded-sm hover:bg-white hover:border-slate-900 hover:shadow-2xl transition-all duration-500">
              <div className="mb-8 p-4 bg-white inline-block rounded-sm group-hover:bg-slate-950 transition-colors">
                <Clapperboard className="w-8 h-8 text-blue-600 group-hover:text-lime-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tighter uppercase">2. Branded Content & Corporate Storytelling</h3>
              <ul className="space-y-4">
                {[
                  'Mission films for CSR & ESG',
                  'Executive interviews',
                  'Government and public-sector communications',
                  'Internal culture stories'
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Marketing & Campaign Assets */}
            <div className="group p-10 bg-slate-50 border border-slate-100 rounded-sm hover:bg-white hover:border-slate-900 hover:shadow-2xl transition-all duration-500">
              <div className="mb-8 p-4 bg-white inline-block rounded-sm group-hover:bg-slate-950 transition-colors">
                <Megaphone className="w-8 h-8 text-blue-600 group-hover:text-lime-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tighter uppercase">3. Marketing & Campaign Assets</h3>
              <ul className="space-y-4">
                {[
                  'Short-form social content',
                  'Digital ad creatives',
                  'Event recap films',
                  'Multi-platform micro-story campaigns'
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-1.5 h-1.5 bg-lime-500 rounded-full"></div> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. TV, Media & Original Programming */}
            <div className="group p-10 bg-slate-50 border border-slate-100 rounded-sm hover:bg-white hover:border-slate-900 hover:shadow-2xl transition-all duration-500">
              <div className="mb-8 p-4 bg-white inline-block rounded-sm group-hover:bg-slate-950 transition-colors">
                <Tv className="w-8 h-8 text-blue-600 group-hover:text-lime-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tighter uppercase">4. TV, Media & Original Programming</h3>
              <ul className="space-y-4">
                {[
                  "Docu-reality series development (e.g., AMG's Start-Point)",
                  'Episodic branded content',
                  'Multi-channel distribution strategy',
                  'Partnership development with broadcasters & digital platforms'
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 4 — THE STUDIO AMG ADVANTAGE */}
      <SectionWrapper bg="light" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="w-12 h-1 bg-slate-900"></div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase text-shine">Why Impact-Driven Brands Choose Studio AMG</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                We merge strategic depth with cinematic execution to create media that matters.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { 
                  icon: Workflow, 
                  title: 'Consulting + Media Integration', 
                  desc: 'You’re supported by strategists, storytellers, and project managers who understand community needs and organizational goals.' 
                },
                { 
                  icon: ShieldCheck, 
                  title: 'Government & Nonprofit Expertise', 
                  desc: 'We translate complex missions into compelling narratives that attract funders, partners, and public audiences.' 
                },
                { 
                  icon: Globe, 
                  title: 'Global Perspective', 
                  desc: 'Storytelling informed by work across the U.S., Europe, and Africa—especially through partnerships with Luxurious Decorations and the Foundation of Luv.' 
                },
                { 
                  icon: Layers, 
                  title: 'Full-Cycle Production', 
                  desc: 'From ideation to scripting, filming, editing, and distribution strategy.' 
                },
                { 
                  icon: Heart, 
                  title: 'Stories that Move People', 
                  desc: 'Every project is designed to create emotional resonance that leads to real-world action.' 
                }
              ].map((adv, i) => (
                <div key={i} className="flex gap-6 p-6 bg-white border border-slate-100 rounded-sm hover:border-blue-600 hover:shadow-xl transition-all group">
                   <div className="shrink-0 p-3 bg-slate-50 rounded-sm group-hover:bg-slate-900 transition-all">
                      <adv.icon className="w-6 h-6 text-blue-600 group-hover:text-lime-500" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{adv.title}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{adv.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-first lg:order-last">
             <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full"></div>
             <div className="relative bg-slate-900 p-10 md:p-16 rounded-sm shadow-2xl border border-slate-800 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Impact Without Compromise</h3>
                  <p className="text-slate-400 font-medium">
                    Our integrated approach means your media assets are optimized for the platforms and audiences that drive your specific growth targets.
                  </p>
                </div>
                <div className="space-y-4">
                   {[
                     'Strategic Brand Positioning',
                     'Stakeholder Engagement',
                     'Fundraising & Advocacy',
                     'Public Sector Credibility'
                   ].map(item => (
                     <div key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-lime-400">
                        <CheckCircle2 className="w-4 h-4" /> {item}
                     </div>
                   ))}
                </div>
                <div className="pt-6">
                  <button className="w-full py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-lime-500 transition-all">
                    Start Your Narrative Audit
                  </button>
                </div>
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 5 — PROBLEM / SOLUTION / IMPACT */}
      <SectionWrapper bg="white" className="py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-50/50 -skew-y-3 origin-left z-0"></div>
        <div className="relative z-10 max-w-5xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight max-w-4xl mx-auto">
              Your Mission Deserves More Than Words — It Deserves a Story People Feel
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* The Problem */}
            <div className="p-10 bg-white border-t-8 border-slate-300 shadow-sm space-y-6 hover:shadow-2xl transition-all duration-500">
              <div className="p-3 bg-slate-100 inline-block rounded-sm">
                <XCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">The Problem</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Most organizations struggle to communicate their impact clearly. Their work is powerful—but
                their audience doesn’t feel it.
              </p>
            </div>

            {/* Our Solution */}
            <div className="p-10 bg-white border-t-8 border-blue-600 shadow-xl space-y-6 hover:-translate-y-2 transition-all duration-500 relative">
              <div className="absolute -top-4 -right-4">
                 <Zap className="w-8 h-8 text-lime-500 fill-lime-500" />
              </div>
              <div className="p-3 bg-blue-50 inline-block rounded-sm">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Our Solution</h3>
              <p className="text-slate-600 leading-relaxed font-bold">
                Studio AMG uses documentary-style storytelling, cinematic production, and strategic messaging
                to transform complex missions into emotionally compelling narratives.
              </p>
            </div>

            {/* The Impact */}
            <div className="p-10 bg-slate-900 text-white border-t-8 border-lime-500 shadow-sm space-y-6 hover:shadow-2xl transition-all duration-500">
              <div className="p-3 bg-slate-800 inline-block rounded-sm">
                <Sparkles className="w-8 h-8 text-lime-400" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-shine-white">The Impact</h3>
              <div className="space-y-4 font-bold text-slate-300">
                <p>Your stakeholders become believers.</p>
                <p>Your community becomes engaged.</p>
                <p>Your mission becomes unforgettable.</p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 6 — FEATURED WORK */}
      <SectionWrapper bg="light">
        <div className="space-y-16">
          <div className="max-w-3xl space-y-4">
            <div className="w-12 h-1 bg-slate-900"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase text-shine">
              Our Portfolio: Stories That Change Minds & Mobilize Communities
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Explore our record of high-impact visual storytelling and strategic media campaigns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO_ITEMS.map((project, i) => (
              <div key={i} className="group relative overflow-hidden bg-slate-900 aspect-[4/5] rounded-sm">
                 <img 
                   src={project.image} 
                   alt={project.title} 
                   className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-60 group-hover:opacity-100"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>
                 <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                    <div className="space-y-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                       <span className="px-3 py-1 bg-lime-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-sm">
                         {project.category}
                       </span>
                       <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">
                         {project.title}
                       </h3>
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          <p className="text-slate-300 text-sm font-medium mb-4">
                             {project.impact}
                          </p>
                          <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-lime-400">
                             View Case Study <ExternalLink className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>

          <div className="pt-10 flex justify-center">
             <button className="px-12 py-5 border-2 border-slate-900 text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all">
                View All Projects
             </button>
          </div>
        </div>
      </SectionWrapper>

      {/* FINAL CTA */}
      <SectionWrapper bg="dark" className="text-center py-32">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-shine-white">
              Let’s Tell Your Impact Story
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
              We help you move from visibility to influence. Whether it's a documentary film or a global 
              advocacy campaign, we build media that works.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-6">
               <button className="px-14 py-7 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-2xl uppercase tracking-widest text-sm flex items-center gap-4">
                 Book a Creative Discovery Call <ArrowRight className="w-5 h-5" />
               </button>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default StudioAMGPage;