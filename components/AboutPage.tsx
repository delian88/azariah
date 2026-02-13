import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Globe, ArrowRight, Eye, Sparkles } from 'lucide-react';

const AboutPage: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24">
      {/* HERO HEADER */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-12">
        <div className="max-w-6xl space-y-8 reveal active">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
            <Globe className="w-4 h-4 text-lime-600" /> The AMG Global Narrative
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase text-shine">
            Strategic <br /> Excellence.
          </h1>
        </div>
      </SectionWrapper>

      {/* UNIFIED WRITE-UP SECTION */}
      <SectionWrapper bg="white" className="py-20 border-y border-slate-100">
        <div className="max-w-6xl mx-auto reveal active">
          <div className="space-y-12">
            <p className="text-xl md:text-3xl text-slate-800 font-bold leading-[1.6] tracking-tight text-justify">
              <span className="text-blue-600 font-black uppercase tracking-widest mr-3 block md:inline mb-4 md:mb-0">About Azariah Management Group (AMG):</span>
              Azariah Management Group (AMG) is a global strategic consulting, technology innovation, and media enterprise providing international business advisory and cross-border growth solutions. Headquartered in the United States and serving clients across the U.S., United Kingdom, Africa, and global diaspora markets, AMG supports entrepreneurs, startups, nonprofits, and institutions in building scalable, compliant, and impact-driven organizations. We operate at the intersection of strategy, technology, storytelling, and community development — delivering integrated solutions for modern global enterprises.
              <br /><br />
              <span className="text-slate-950 font-black uppercase tracking-tight mr-3">Global Strategic Consulting & Business Advisory:</span>
              As an international business consulting firm, AMG specializes in U.S. business formation and entity setup for international entrepreneurs, cross-border business expansion strategy, organizational structuring and operational development, corporate compliance advisory (federal, state, and local regulations), brand positioning and market entry strategy, and revenue growth and sustainability frameworks. We provide structured advisory services for founders seeking to establish or expand operations in the United States while maintaining global reach. Our expertise in diaspora markets and multicultural business environments allows us to bridge international opportunities with U.S.-based infrastructure.
              <br /><br />
              <span className="text-slate-950 font-black uppercase tracking-tight mr-3">Technology & Innovation Division:</span>
              AMG’s Technology & Innovation Division delivers digital transformation, AI-powered strategy, and innovation consulting services designed to future-proof businesses. Our services include digital business development and platform strategy, technology integration consulting, AI-driven media and content production systems, innovation roadmap design, digital infrastructure advisory, and web-based ecosystem and platform development. We help organizations leverage emerging technologies, automation systems, and scalable digital models to increase efficiency, global accessibility, and long-term competitive advantage. By integrating technology with strategy, AMG transforms traditional businesses into adaptive, innovation-ready enterprises.
              <br /><br />
              <span className="text-slate-950 font-black uppercase tracking-tight mr-3">Media, Production & Cultural Impact (Studio AMG):</span>
              Through Studio AMG, our media and production division, we develop and produce original impact-driven content, entrepreneurial docu-series, leadership narratives, and advocacy programming. Our media portfolio includes projects such as Start-Point and BlackbyAngel, focused on entrepreneurship, family systems, mental health advocacy, and diaspora storytelling. As a global media production and consulting firm, we help brands and institutions develop intellectual property, produce strategic storytelling campaigns, amplify community-based initiatives, and build cultural authority through media. We view storytelling as a strategic asset — transforming narratives into scalable influence and economic value.
              <br /><br />
              <span className="text-slate-950 font-black uppercase tracking-tight mr-3">A Community-Based Social Enterprise:</span>
              Azariah Management Group operates as a community-centered social enterprise committed to economic empowerment, leadership development, and global collaboration. Our work supports entrepreneurship and small business development, diaspora economic integration, international partnerships, cultural and educational programming, and sustainable community impact initiatives. We believe business growth and social responsibility are interconnected. Our advisory and media services are designed to generate measurable economic value while strengthening communities across borders.
              <br /><br />
              <span className="text-slate-950 font-black uppercase tracking-tight mr-3">Why Global Clients Choose AMG:</span>
              Expertise in U.S. business formation for international founders, proven cross-border consulting and diaspora engagement, integrated consulting, technology, and media capabilities, community-based social enterprise model, and strategy-driven, innovation-enabled approach. AMG is not just a consulting firm — we are a global growth partner building sustainable enterprises, digital ecosystems, and impact platforms designed for long-term relevance.
            </p>

            {/* VISION CALLOUT */}
            <div className="pt-20 border-t border-slate-100">
               <div className="flex items-center gap-4 mb-8">
                 <div className="h-[1px] flex-1 bg-slate-200"></div>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <div className="w-2 h-2 rounded-full bg-lime-500"></div>
                 </div>
                 <div className="h-[1px] flex-1 bg-slate-200"></div>
               </div>
               <p className="text-2xl md:text-5xl font-black text-slate-900 text-center uppercase tracking-tighter leading-tight">
                 "To be a leading global strategic consulting, technology innovation, and media enterprise empowering entrepreneurs, institutions, and diaspora communities to build sustainable businesses, shape culture, and create generational impact across borders."
               </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA SECTION */}
      <SectionWrapper bg="dark" className="text-center py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 -z-10"></div>
        <div className="max-w-5xl mx-auto space-y-12 reveal">
          <div className="inline-flex items-center gap-2 text-lime-400 font-black text-[10px] uppercase tracking-[0.4em]">
             <Eye className="w-6 h-6" /> Partner with AMG
          </div>
          <p className="text-2xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter text-shine-white">
            Transforming Complex Challenges Into Scalable Opportunities.
          </p>
          <div className="pt-8">
            <button 
              onClick={scrollToContact}
              className="px-14 py-7 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-2xl uppercase tracking-widest text-sm flex items-center justify-center gap-4 group mx-auto"
            >
              Initiate Strategic Engagement <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default AboutPage;