import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Play, Mic2, Coins, TrendingUp, Users, Video, ArrowRight, Wallet, Sparkles, UserPlus } from 'lucide-react';

const CreAItube: React.FC = () => {
  const MONETIZATION_FEATURES = [
    {
      title: "Earn Per View",
      description: "Get paid for every impression. High-quality content is rewarded with industry-leading CPM rates.",
      icon: TrendingUp
    },
    {
      title: "Subscriber Revenue",
      description: "Build a loyal fanbase and earn recurring revenue through tiered subscriber benefits.",
      icon: Users
    },
    {
      title: "Podcast Sponsorships",
      description: "Integrated audio monetization tools for independent podcasters and storytellers.",
      icon: Mic2
    }
  ];

  return (
    <SectionWrapper id="creaitube" bg="dark" className="relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
        <Video className="w-[500px] h-[500px] absolute -top-20 -right-20 text-white" />
      </div>

      <div className="space-y-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              <Sparkles className="w-3 h-3 text-lime-400" /> New Media Economy
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none text-shine-white">
              CreAItube & Podcast.
            </h2>
            
            <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-xl">
              The next-generation content hub where strategy meets storytelling. We empower creators to own their narrative and maximize their earnings.
            </p>

            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-3 px-6 py-4 bg-slate-800 border border-slate-700 rounded-sm">
                  <Coins className="w-6 h-6 text-lime-400" />
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Earnings Policy</div>
                    <div className="text-sm font-bold text-white">Monetize from Day 1</div>
                  </div>
               </div>
               <div className="flex items-center gap-3 px-6 py-4 bg-slate-800 border border-slate-700 rounded-sm">
                  <Wallet className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payouts</div>
                    <div className="text-sm font-bold text-white">Direct-to-Creator</div>
                  </div>
               </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video bg-slate-800 rounded-sm border-8 border-slate-700 shadow-2xl overflow-hidden group">
               <img 
                 src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2070" 
                 alt="Content Creation" 
                 className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-20 h-20 bg-lime-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer shadow-2xl">
                    <Play className="w-8 h-8 fill-slate-900 text-slate-900 ml-1" />
                 </div>
               </div>
               <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/90 backdrop-blur-md border-l-4 border-lime-500 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-black uppercase text-white tracking-widest">Live Streaming Now</p>
                    <p className="text-[10px] font-bold text-lime-400">12.4K Creators Active</p>
                  </div>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {MONETIZATION_FEATURES.map((feature, i) => (
            <div key={i} className="p-10 bg-slate-800/30 border border-slate-700 hover:border-lime-500 transition-all group">
              <feature.icon className="w-10 h-10 text-lime-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* ACCOUNT CREATION CTA */}
        <div className="pt-10 flex flex-col items-center text-center space-y-8">
           <div className="max-w-2xl space-y-4">
              <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Your Mission, Your Platform, Your Profits.</h3>
              <p className="text-slate-400 font-medium">Create video content, launch your podcast, and build a sustainable media empire within the AMG ecosystem.</p>
           </div>
           
           <button 
             className="group px-16 py-8 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-[0_20px_50px_rgba(132,204,22,0.3)] uppercase tracking-widest text-sm flex items-center gap-4 hover:-translate-y-2"
             onClick={() => alert("Registration link coming soon! Stay tuned.")}
           >
             Create Your Creator Account
             <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
           </button>
           
           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-slate-700"></span>
              Join 5,000+ Independent Voices
              <span className="w-8 h-[1px] bg-slate-700"></span>
           </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CreAItube;