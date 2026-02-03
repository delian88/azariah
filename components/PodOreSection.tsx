import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  Users, Briefcase, Wallet, PlayCircle, Video, TrendingUp, 
  ShoppingBag, MessageSquare, BarChart3, Rocket, Users2, 
  GraduationCap, Plus, ArrowRight, Sparkles 
} from 'lucide-react';

const PodOreSection: React.FC = () => {
  const FEATURES = [
    { icon: Users, title: "POD FEED", desc: "Share tech" },
    { icon: Briefcase, title: "CAREERS", desc: "Jobs/Hiring" },
    { icon: Wallet, title: "WALLET", desc: "$ Tokens" },
    { icon: PlayCircle, title: "REELS", desc: "AI for Good" },
    { icon: Video, title: "BOARDROOM", desc: "Video Calls" },
    { icon: TrendingUp, title: "DIGITAL LAB", desc: "Investment" },
    { icon: ShoppingBag, title: "MARKET", desc: "AI Products" },
    { icon: MessageSquare, title: "FORUM", desc: "Global Topics" },
    { icon: BarChart3, title: "AD-MANAGER", desc: "Campaigns" },
    { icon: Rocket, title: "BOOSTING", desc: "Go Viral" },
    { icon: Users2, title: "CIRCLES", desc: "Pro Groups" },
    { icon: GraduationCap, title: "COURSES", desc: "Education" },
  ];

  const handleCreateAccount = () => {
    window.open("https://worldaiforce.org/", "_blank");
  };

  return (
    <SectionWrapper id="podore" bg="white" className="relative overflow-hidden py-32">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-0"></div>
      
      <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="space-y-6 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
              <Sparkles className="w-4 h-4 text-lime-600" /> A Global Digital Ecosystem
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Create Your <br /> PodOre Account.
            </h2>
            <p className="text-xl text-slate-600 font-medium max-w-xl leading-relaxed">
              Join <span className="text-blue-600 font-black">World AI Force</span>. PodOre is a community-based platform where innovators meet, collaborate, and scale their digital impact.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 reveal">
            {FEATURES.map((feat, i) => (
              <div key={i} className="p-6 bg-white border border-slate-100 rounded-sm hover:border-blue-600 hover:shadow-xl transition-all group flex flex-col items-center text-center">
                <feat.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all mb-4" />
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">{feat.title}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-8 reveal">
            <button 
              onClick={handleCreateAccount}
              className="px-12 py-7 bg-blue-600 text-white font-black rounded-sm hover:bg-slate-900 transition-all shadow-2xl flex items-center gap-4 group uppercase tracking-widest text-sm hover:-translate-y-1"
            >
              Create PodOre Account
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>

        <div className="relative reveal">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/10 to-lime-500/10 blur-3xl rounded-full"></div>
          <div className="relative bg-slate-900 rounded-sm shadow-2xl overflow-hidden border-8 border-white aspect-[4/5]">
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" 
              alt="World AI Force Ecosystem" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
               <div className="space-y-4">
                  <div className="w-16 h-1 bg-lime-500"></div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">The Global Marketplace for Innovators</h3>
                  <p className="text-slate-400 font-medium text-sm">Empowering communities through AI products, digital tokens, and pro-level networking.</p>
                  <a href="https://worldaiforce.com" target="_blank" rel="noopener" className="flex items-center gap-2 text-lime-400 font-black uppercase tracking-widest text-[10px] pt-4 hover:text-white transition-colors">
                    Visit worldaiforce.com <ArrowRight className="w-3 h-3" />
                  </a>
               </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default PodOreSection;