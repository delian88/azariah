
import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  ShieldCheck, Target, Award, Globe, Users, Zap, CheckCircle2, 
  ArrowRight, Heart, Sparkles, Rocket, Camera, BookOpen, 
  Handshake, LineChart, Briefcase, Settings, Scale, Eye,
  Building2, Landmark, Code2, HeartHandshake, FileText, Cpu
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24">
      {/* HERO SECTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-10"></div>
        <div className="relative z-10 max-w-5xl space-y-8 reveal active">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
            <Sparkles className="w-4 h-4 text-lime-600" /> Strategic Intelligence • Media Impact • Technology
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] text-shine uppercase">
            About Azariah <br /> Management Group.
          </h1>
          <div className="space-y-6 max-w-4xl border-l-8 border-blue-600 pl-8">
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-bold">
              Azariah Management Group (AMG) is a global strategic consulting, technology innovation, and media enterprise providing international business advisory and cross-border growth solutions.
            </p>
            <p className="text-lg text-slate-500 font-medium">
              Headquartered in the United States and serving clients across the U.S., United Kingdom, Africa, and global diaspora markets, AMG supports entrepreneurs, startups, nonprofits, and institutions in building scalable, compliant, and impact-driven organizations.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* CORE IDENTITY */}
      <SectionWrapper bg="light" className="py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 reveal">
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">The Intersection of Innovation</h2>
              <div className="w-16 h-1 bg-lime-500"></div>
            </div>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              We operate at the intersection of strategy, technology, storytelling, and community development — delivering integrated solutions for modern global enterprises.
            </p>
            <div className="grid gap-4">
              {[
                { title: "Strategy", icon: Target, color: "text-blue-600" },
                { title: "Technology", icon: Cpu, color: "text-lime-600" },
                { title: "Storytelling", icon: Camera, color: "text-blue-400" },
                { title: "Community", icon: Users, color: "text-slate-900" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-sm shadow-sm">
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                  <span className="font-black uppercase tracking-widest text-[10px] text-slate-900">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative reveal">
            <div className="aspect-square bg-slate-900 rounded-sm shadow-2xl overflow-hidden border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover opacity-60" 
                alt="Global Operations" 
              />
              <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                <p className="text-3xl font-black text-white leading-tight uppercase tracking-tighter italic">
                  "Building sustainable businesses and shaping culture across borders."
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* DIVISION 1: CONSULTING */}
      <SectionWrapper bg="white" className="py-24">
        <div className="grid lg:grid-cols-2 gap-20">
          <div className="space-y-10 reveal">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">
                <Landmark className="w-4 h-4" /> Consulting Division
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Global Strategic Consulting & Business Advisory
              </h2>
            </div>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              As an international business consulting firm, AMG specializes in structured advisory services for founders seeking to establish or expand operations in the United States while maintaining global reach.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "U.S. business formation & setup",
                "Cross-border expansion strategy",
                "Organizational structuring",
                "Corporate compliance advisory",
                "Brand positioning & market entry",
                "Revenue growth frameworks"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                  <span className="text-xs font-bold text-slate-700 leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 p-10 md:p-16 rounded-sm border-l-8 border-blue-600 reveal self-center">
            <p className="text-xl font-bold text-slate-800 leading-relaxed italic">
              "Our expertise in diaspora markets and multicultural business environments allows us to bridge international opportunities with U.S.-based infrastructure."
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* DIVISION 2: TECH */}
      <SectionWrapper bg="dark" className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-blue-600/5 pointer-events-none"></div>
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative reveal">
            <div className="aspect-[4/3] bg-slate-800 rounded-sm overflow-hidden border-8 border-slate-700">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-40" alt="Tech Innovation" />
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-10 reveal">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-lime-400 font-black text-[10px] uppercase tracking-[0.3em]">
                <Cpu className="w-4 h-4" /> Innovation Division
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none text-shine-white">
                Technology & Innovation
              </h2>
            </div>
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              AMG’s Technology & Innovation Division delivers digital transformation, AI-powered strategy, and innovation consulting services designed to future-proof businesses.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Digital business development",
                "Technology integration",
                "AI-driven media systems",
                "Innovation roadmap design",
                "Digital infrastructure advisory",
                "Web-based ecosystem dev"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-800 border border-slate-700">
                  <Zap className="w-4 h-4 text-lime-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-slate-500 pt-4 border-t border-slate-800">
              Helping organizations increase efficiency, global accessibility, and long-term competitive advantage.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* DIVISION 3: STUDIO AMG */}
      <SectionWrapper bg="white" className="py-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 reveal">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em]">
                <Camera className="w-4 h-4" /> Media & Cultural Division
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Media, Production & Cultural Impact
              </h2>
            </div>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Through Studio AMG, we develop and produce original impact-driven content, entrepreneurial docu-series, leadership narratives, and advocacy programming. Our portfolio includes projects like <span className="text-blue-600 font-black">Start-Point</span> and <span className="text-blue-600 font-black">BlackbyAngel</span>.
            </p>
            <div className="space-y-4">
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Our Media Capabilities:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Develop intellectual property",
                  "Strategic storytelling campaigns",
                  "Amplify community initiatives",
                  "Build cultural authority"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative reveal">
            <div className="p-12 bg-slate-900 text-white rounded-sm border-r-8 border-blue-400 shadow-2xl space-y-6">
              <QuoteIcon className="w-12 h-12 text-blue-400/20" />
              <p className="text-2xl font-black uppercase tracking-tight leading-tight">
                "We view storytelling as a strategic asset — transforming narratives into scalable influence and economic value."
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SOCIAL ENTERPRISE */}
      <SectionWrapper bg="light" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-white -z-0 -skew-x-12 translate-x-1/2"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 reveal">
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">A Community-Based Social Enterprise</h2>
              <div className="w-16 h-1 bg-lime-500"></div>
            </div>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Azariah Management Group operates as a community-centered social enterprise committed to economic empowerment, leadership development, and global collaboration.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Entrepreneurship", icon: Briefcase },
                { title: "Diaspora Integration", icon: Globe },
                { title: "Int. Partnerships", icon: Handshake },
                { title: "Cultural Programming", icon: Sparkles }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white border border-slate-100 rounded-sm text-center space-y-3">
                  <item.icon className="w-6 h-6 text-slate-900 mx-auto" />
                  <span className="block text-[8px] font-black uppercase tracking-widest text-slate-500">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-10 bg-white border border-slate-100 reveal shadow-xl">
             <p className="text-xl text-slate-800 font-bold leading-relaxed">
               "We believe business growth and social responsibility are interconnected. Our advisory and media services are designed to generate measurable economic value while strengthening communities across borders."
             </p>
          </div>
        </div>
      </SectionWrapper>

      {/* WHY CHOOSE AMG */}
      <SectionWrapper bg="white" className="py-24">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto reveal">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Why Global Clients Choose AMG</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 reveal">
            {[
              "Expertise in U.S. business formation",
              "Cross-border consulting & diaspora engagement",
              "Integrated tech & media capabilities",
              "Community-based social enterprise model",
              "Strategy-driven, innovation-enabled approach"
            ].map((item, i) => (
              <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-sm hover:border-blue-600 transition-all text-center space-y-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs font-black uppercase tracking-tight text-slate-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* VISION SECTION */}
      <SectionWrapper bg="dark" className="text-center py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 -z-10"></div>
        <div className="max-w-4xl mx-auto space-y-12 reveal">
          <div className="inline-flex items-center gap-2 text-lime-400 font-black text-[10px] uppercase tracking-[0.4em]">
             <Eye className="w-5 h-5" /> Our Vision
          </div>
          <p className="text-2xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter text-shine-white">
            "To be a leading global strategic consulting, technology innovation, and media enterprise empowering entrepreneurs, institutions, and diaspora communities to build sustainable businesses, shape culture, and create generational impact across borders."
          </p>
          <div className="pt-8 flex flex-col items-center gap-6">
            <button 
              onClick={scrollToContact}
              className="px-14 py-7 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-2xl uppercase tracking-widest text-sm flex items-center justify-center gap-4 group"
            >
              Partner with the Mission <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">AZARIAH MANAGEMENT GROUP • BUILT FOR IMPACT</p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

export default AboutPage;
