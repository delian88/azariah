import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Globe, ArrowRight, Eye } from 'lucide-react';

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
      <SectionWrapper bg="white" className="relative overflow-hidden pb-8">
        <div className="max-w-5xl space-y-6 reveal active">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-100">
            <Globe className="w-3.5 h-3.5 text-lime-600" /> The AMG Global Narrative
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase text-shine">
            Strategic <br /> Excellence.
          </h1>
        </div>
      </SectionWrapper>

      {/* READABLE PARAGRAPHS SECTION */}
      <SectionWrapper bg="white" className="py-12 border-y border-slate-100">
        <div className="max-w-4xl mx-auto reveal active space-y-10">
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600">About Azariah Management Group (AMG)</h3>
            <p className="text-base md:text-lg text-slate-700 font-bold leading-relaxed">
              Azariah Management Group (AMG) is a global strategic consulting, technology innovation, and media enterprise providing international business advisory and cross border growth solutions. Headquartered in the United States and serving clients across the U.S., United Kingdom, Africa, and global diaspora markets, AMG supports entrepreneurs, startups, nonprofits, and institutions in building scalable, compliant, and impact driven organizations. We operate at the intersection of strategy, technology, storytelling, and community development — delivering integrated solutions for modern global enterprises.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Global Strategic Consulting & Business Advisory</h3>
            <p className="text-base md:text-lg text-slate-700 font-bold leading-relaxed">
              As an international business consulting firm, AMG specializes in: U.S. business formation and entity setup for international entrepreneurs, cross border business expansion strategy, organizational structuring and operational development, corporate compliance advisory (federal, state, and local regulations), brand positioning and market entry strategy, and revenue growth and sustainability frameworks. We provide structured advisory services for founders seeking to establish or expand operations in the United States while maintaining global reach. Our expertise in diaspora markets and multicultural business environments allows us to bridge international opportunities with U.S. based infrastructure.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Technology & Innovation Division</h3>
            <p className="text-base md:text-lg text-slate-700 font-bold leading-relaxed">
              AMG’s Technology & Innovation Division delivers digital transformation, AI powered strategy, and innovation consulting services designed to future proof businesses. Our services include digital business development and platform strategy, technology integration consulting, AI driven media and content production systems, innovation roadmap design, digital infrastructure advisory, and web based ecosystem and platform development. We help organizations leverage emerging technologies, automation systems, and scalable digital models to increase efficiency, global accessibility, and long term competitive advantage. By integrating technology with strategy, AMG transforms traditional businesses into adaptive, innovation ready enterprises.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Media, Production & Cultural Impact (Studio AMG)</h3>
            <p className="text-base md:text-lg text-slate-700 font-bold leading-relaxed">
              Through Studio AMG, our media and production division, we develop and produce original impact driven content, entrepreneurial docu series, leadership narratives, and advocacy programming. Our media portfolio includes projects such as Start Point and BlackbyAngel, focused on entrepreneurship, family systems, mental health advocacy, and diaspora storytelling. As a global media production and consulting firm, we help brands and institutions: develop intellectual property, produce strategic storytelling campaigns, amplify community based initiatives, and build cultural authority through media. We view storytelling as a strategic asset — transforming narratives into scalable influence and economic value.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">A Community Based Social Enterprise</h3>
            <p className="text-base md:text-lg text-slate-700 font-bold leading-relaxed">
              Azariah Management Group operates as a community centered social enterprise committed to economic empowerment, leadership development, and global collaboration. Our work supports: entrepreneurship and small business development, diaspora economic integration, international partnerships, cultural and educational programming, and sustainable community impact initiatives. We believe business growth and social responsibility are interconnected. Our advisory and media services are designed to generate measurable economic value while strengthening communities across borders.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Why Global Clients Choose AMG</h3>
            <p className="text-base md:text-lg text-slate-700 font-bold leading-relaxed">
              Expertise in U.S. business formation for international founders, proven cross border consulting and diaspora engagement, integrated consulting, technology, and media capabilities, community based social enterprise model, and strategy driven, innovation enabled approach. AMG is not just a consulting firm — we are a global growth partner building sustainable enterprises, digital ecosystems, and impact platforms designed for long term relevance.
            </p>
          </div>

          {/* VISION CALLOUT */}
          <div className="pt-12 border-t border-slate-100">
             <p className="text-xl md:text-3xl font-black text-slate-900 text-center uppercase tracking-tighter leading-tight">
               "To be a leading global strategic consulting, technology innovation, and media enterprise empowering entrepreneurs, institutions, and diaspora communities to build sustainable businesses, shape culture, and create generational impact across borders."
             </p>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA SECTION */}
      <SectionWrapper bg="dark" className="text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 -z-10"></div>
        <div className="max-w-4xl mx-auto space-y-10 reveal">
          <div className="inline-flex items-center gap-2 text-lime-400 font-black text-[9px] uppercase tracking-[0.4em]">
             <Eye className="w-5 h-5" /> Partner with AMG
          </div>
          <p className="text-xl md:text-3xl font-black text-white leading-tight uppercase tracking-tighter text-shine-white">
            Transforming Complex Challenges Into Scalable Opportunities.
          </p>
          <div className="pt-4">
            <button 
              onClick={scrollToContact}
              className="px-10 py-5 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 mx-auto"
            >
              Initiate Strategic Engagement <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default AboutPage;