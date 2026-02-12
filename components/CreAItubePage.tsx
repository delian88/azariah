import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  Play, 
  Mic2, 
  Coins, 
  TrendingUp, 
  Users, 
  Video, 
  ArrowRight, 
  Wallet, 
  Sparkles, 
  UserPlus, 
  Youtube, 
  Tv, 
  Zap,
  Globe,
  Share2
} from 'lucide-react';

const CreAItubePage: React.FC = () => {
  const MONETIZATION_FEATURES = [
    {
      title: "Earn Per View",
      description: "Get paid for every impression. High-quality content is rewarded with industry-leading CPM rates and recurring bonuses.",
      icon: TrendingUp
    },
    {
      title: "Subscriber Revenue",
      description: "Build a loyal fanbase and earn recurring revenue through tiered subscriber benefits and exclusive access levels.",
      icon: Users
    },
    {
      title: "Podcast Sponsorships",
      description: "Integrated audio monetization tools for independent podcasters and storytellers to secure brand deals directly.",
      icon: Mic2
    }
  ];

  return (
    <div className="pt-24">
      {/* HERO SECTION */}
      <SectionWrapper bg="dark" className="relative overflow-hidden py-32 md:py-48 min-h-[80vh] flex items-center">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
           <Video className="w-[800px] h-[800px] absolute -top-40 -right-40 text-white" />
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
           <div className="space-y-8 reveal active">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                <Sparkles className="w-3 h-3 text-lime-400" /> The New Media Economy
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none text-shine-white uppercase">
                CreAItube <br /> & Podcast.
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-medium max-w-xl">
                The ultimate platform for modern creators where strategic storytelling meets decentralized monetization. 
              </p>
              <div className="flex flex-wrap gap-4 pt-6">
                <button className="px-12 py-6 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-xl uppercase tracking-widest text-xs flex items-center gap-3">
                  Join as Creator <UserPlus className="w-4 h-4" />
                </button>
                <a 
                  href="https://www.youtube.com/@STUDIOAMG-NETWORK" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-12 py-6 bg-slate-800 text-white border border-slate-700 font-black rounded-sm hover:bg-slate-700 transition-all uppercase tracking-widest text-xs flex items-center gap-3"
                >
                  <Youtube className="w-4 h-4 text-red-600" /> View Network
                </a>
              </div>
           </div>
           <div className="relative reveal active hidden lg:block">
              <div className="aspect-video bg-slate-800 rounded-sm border-8 border-slate-700 shadow-2xl overflow-hidden group">
                 <img 
                   src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2070" 
                   alt="Content Creation" 
                   className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-24 h-24 bg-lime-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer shadow-2xl">
                      <Play className="w-10 h-10 fill-slate-900 text-slate-900 ml-1" />
                   </div>
                 </div>
              </div>
           </div>
        </div>
      </SectionWrapper>

      {/* CORE VALUE PROPOSITIONS */}
      <SectionWrapper bg="white" className="py-24">
         <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: Coins, 
                title: "Monetize Daily", 
                desc: "Unlike traditional platforms, we offer immediate access to monetization pathways through our verified partner network." 
              },
              { 
                icon: Wallet, 
                title: "Direct Payouts", 
                desc: "Creators enjoy lower platform fees and direct-to-wallet payouts, ensuring you keep more of what you earn." 
              },
              { 
                icon: Globe, 
                title: "Global Reach", 
                desc: "Integrated with the PodOre ecosystem, reaching millions of innovators across North America and Africa." 
              }
            ].map((item, i) => (
              <div key={i} className="space-y-6 reveal p-10 bg-slate-50 border border-slate-100 rounded-sm hover:border-slate-900 transition-all">
                 <div className="w-16 h-16 bg-white shadow-xl flex items-center justify-center rounded-sm">
                    <item.icon className="w-8 h-8 text-blue-600" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{item.title}</h3>
                 <p className="text-slate-600 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
         </div>
      </SectionWrapper>

      {/* MONETIZATION DEEP DIVE */}
      <SectionWrapper bg="light" className="relative overflow-hidden py-32">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto reveal">
             <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 uppercase text-shine">Creator Economics</h2>
             <p className="text-slate-500 text-lg font-medium">Multiple streams of income designed for the modern media entrepreneur.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {MONETIZATION_FEATURES.map((feature, i) => (
              <div key={i} className="p-10 bg-white border border-slate-100 hover:border-lime-500 transition-all group reveal shadow-sm hover:shadow-2xl">
                <feature.icon className="w-10 h-10 text-lime-600 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CALL TO ACTION */}
      <SectionWrapper bg="dark" className="text-center py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-600/5 -z-10"></div>
         <div className="max-w-4xl mx-auto space-y-12 relative z-10 reveal">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-shine-white uppercase">
              Ownership Starts Here.
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
              Stop building on rented land. Join CreAItube and own your audience, your content, and your financial future.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-8">
               <button className="px-14 py-7 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-2xl uppercase tracking-widest text-sm flex items-center justify-center gap-4 group hover:-translate-y-1">
                 Create Your Account <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               </button>
               <button className="px-14 py-7 border-2 border-slate-700 text-white font-black rounded-sm hover:border-white transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-4 group">
                 Partner with Creators <Share2 className="w-5 h-5" />
               </button>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default CreAItubePage;