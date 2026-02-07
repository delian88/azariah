import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { SIGNATURE_PROGRAMS } from '../constants';
import { 
  ExternalLink, Zap, X, ChevronLeft, Info, 
  Play, Share2, Scale, Clapperboard, BarChart3,
  Tv, Gamepad2, Heart, Globe, Brain, ShieldCheck, ShieldAlert, Sparkles
} from 'lucide-react';

const Programs: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  const PROGRAM_DETAILS: Record<string, any> = {
    'Start Point': {
      synopsis: [
        "Start Point is a docu-reality series that follows the authentic journeys of entrepreneurs, founders, and CEOs at the pivotal moments where vision meets uncertainty. Rather than spotlighting success alone, the series captures the real decisions, risks, failures, and breakthroughs that shape leadership from the ground up.",
        "Through candid storytelling and behind-the-scenes access, Start Point reveals what it truly takes to build something meaningful offering inspiration, practical insight, and human connection for aspiring leaders, innovators, and changemakers."
      ],
      themes: "Entrepreneurship • Leadership • Resilience • Innovation • Purpose",
      format: "Docu-Reality / Business & Human Interest",
      impact: "High-impact docu-series reaching a wide range of viewers, featuring emerging CEOs and scaling the narrative of innovators."
    },
    'Voices of the Diaspora': {
      synopsis: [
        "Voices of the Diaspora is a powerful storytelling and dialogue series that amplifies the lived experiences, perspectives, and contributions of people across the global African diaspora. Through intimate conversations, cultural exploration, and personal narratives, the series examines identity, migration, heritage, innovation, and the interconnectedness of global Black communities.",
        "Spanning continents and generations, Voices of the Diaspora highlights how culture, history, and resilience shape modern realities while creating a shared space for understanding, healing, and collective progress. The series bridges global perspectives with local impact, honoring roots while spotlighting forward-thinking voices shaping the future."
      ],
      themes: "Diaspora Identity • Culture & Heritage • Migration • Belonging • Global Community • Legacy",
      format: "Documentary / Talk / Cultural & Advocacy Series",
      impact: "Influenced global trade policy discussions for the G.A.M.E. ecosystem, bridging connections between North America and the African Diaspora."
    },
    'Family First': {
      synopsis: [
        "Family First is a values-centered series that explores the dynamics of family, parenting, and relationships in today’s rapidly evolving world. Through real conversations, expert insights, and lived experiences, the series addresses mental health, communication, generational challenges, and the importance of nurturing strong family foundations.",
        "Designed to educate, empower, and heal, Family First creates a safe and relatable space for families to engage in honest dialogue, strengthen bonds, and prioritize emotional well-being across generations."
      ],
      themes: "Family • Parenting • Mental Health • Relationships • Community Wellness",
      format: "Lifestyle / Educational / Advocacy",
      impact: "Creating safe spaces for families to engage in honest dialogue, strengthen bonds, and prioritize emotional well-being."
    },
    'BlackbyAngel Initiative': {
      synopsis: [
        "BlackbyAngel is a bold, culturally resonant talk and advocacy series that centers Black voices, experiences, and perspectives through meaningful dialogue and storytelling. Hosted by Angelica Watkins, the series blends social commentary, mental health awareness, cultural identity, and empowerment into conversations that challenge narratives and inspire growth.",
        "Produced by Azariah Management Group under Studio AMG, BlackbyAngel is more than a show—it is a platform for visibility, healing, and forward-thinking dialogue that uplifts community voices and sparks impactful change."
      ],
      themes: "Culture • Identity • Mental Health • Advocacy • Empowerment",
      format: "Talk Show / Advocacy / Cultural Commentary",
      impact: "A platform for visibility, healing, and forward-thinking dialogue that uplifts community voices and sparks impactful change."
    },
    'Captain Chiffon': {
      synopsis: [
        "Captain Chiffon is an empowering, imaginative, and educational series that follows Captain Chiffon—a courageous, compassionate leader who guides children and families through life’s everyday challenges using creativity, emotional intelligence, and problem-solving skills.",
        "Blending storytelling, positive messaging, and real-world lessons, the series encourages confidence, kindness, resilience, and self-belief. Each episode explores themes such as leadership, empathy, teamwork, mental wellness, and purpose—helping young viewers learn how to navigate their world with courage and care.",
        "At its core, Captain Chiffon inspires children to see themselves as leaders, helpers, and changemakers—reminding them that strength comes not just from power, but from character."
      ],
      themes: "Leadership • Confidence • Emotional Intelligence • Kindness • Purpose • Mental Wellness",
      format: "Educational / Animated or Live-Action Youth Series",
      impact: "Empowering children to see themselves as leaders, helpers, and changemakers—reminding them that strength comes from character."
    },
    'The Silent Movement': {
      synopsis: [
        "The Silent Movement is an advocacy-driven initiative and storytelling platform dedicated to amplifying voices that are too often unheard—those affected by mental health challenges, family instability, systemic barriers, and social inequities. The movement sheds light on the quiet struggles happening within communities, homes, and institutions, and transforms awareness into action.",
        "Through real stories, educational content, and community engagement, The Silent Movement challenges stigma, encourages dialogue, and promotes access to support, resources, and policy change. It centers dignity, empathy, and accountability creating space for healing while mobilizing collective responsibility.",
        "At its core, The Silent Movement affirms that silence is not weakness, and visibility is the first step toward meaningful change."
      ],
      strategicFit: "The Silent Movement serves as the advocacy backbone connecting Family First, BlackbyAngel, and Voices of the Diaspora, translating conversation and storytelling into measurable community impact and policy-aligned action.",
      themes: "Mental Health Advocacy • Family & Community Wellness • Social Equity • Awareness to Action",
      format: "Advocacy Campaign / Media Series / Community Initiative",
      impact: "Award-winning advocacy visuals that mobilized 50+ grassroots organizations for mental health awareness."
    },
    'G.A.M.E.': {
      synopsis: [
        "The Global African Market Enterprise (G.A.M.E.) is a comprehensive innovation and trade ecosystem designed to bridge the gap between North American investment and the burgeoning economic potential of the African continent and its diaspora.",
        "By fostering public-private partnerships, providing digital trade infrastructure, and highlighting high-growth startups, G.A.M.E. creates a verified network for cross-border collaboration, ensuring that innovation leads to generational wealth and sustainable development."
      ],
      themes: "Economic Empowerment • Trade • Innovation • Diaspora Connectivity • Sustainability",
      format: "Ecosystem / Trade Platform / Partnership Network",
      impact: "Connecting international investors with local innovators to drive direct foreign investment into community-led tech projects."
    },
    'AI Force Hub': {
      synopsis: [
        "The AI Force Hub is a dedicated center for technical training, research, and collaborative implementation of artificial intelligence systems. We prioritize ethical AI deployment and technical literacy for underserved communities, ensuring that the next wave of technological progress is inclusive and humanity-centered.",
        "The Hub provides the resources, mentorship, and infrastructure necessary for organizations to move from digital legacy to AI-native operations without compromising security or organizational values."
      ],
      themes: "Artificial Intelligence • Digital Inclusion • Ethics • Capacity Building • Technical Literacy",
      format: "Training Hub / Research Lab / Implementation Center",
      impact: "Upskilling over 1,000 professionals in ethical AI frameworks and securing high-value digital transitions for nonprofits."
    }
  };

  return (
    <SectionWrapper id="programs" bg="white" className="relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-1/4 h-full bg-slate-50 -translate-y-1/2 -skew-x-12 -z-0"></div>
      
      <div className="space-y-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-lime-600 font-black text-xs uppercase tracking-widest">
              <Zap className="w-4 h-4 fill-lime-500" /> Signature Ventures
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              Innovation & Storytelling
            </h2>
            <p className="text-xl text-slate-600 font-medium">
              We don't just consult; we build. Explore our ecosystem of high-impact platforms and programs.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="flex gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <span>Culture</span>
              <span className="text-slate-200">/</span>
              <span>Impact</span>
              <span className="text-slate-200">/</span>
              <span>Growth</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SIGNATURE_PROGRAMS.map(program => (
            <div 
              key={program.title} 
              className="group p-10 border border-slate-100 rounded-sm hover:border-slate-900 transition-all duration-500 relative overflow-hidden bg-white hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] cursor-pointer"
              onClick={() => setSelectedProgram(program)}
            >
              <div className="space-y-6 relative z-10">
                <div className="flex gap-2">
                  {program.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 bg-slate-900 text-white group-hover:bg-lime-500 group-hover:text-slate-950 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-blue-700 transition-colors uppercase">{program.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium">{program.description}</p>
                <div className="pt-4">
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       setSelectedProgram(program);
                     }}
                     className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-all transform group-hover:translate-x-2"
                   >
                     Learn More <ExternalLink className="w-4 h-4" />
                   </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700 opacity-40 z-0"></div>
            </div>
          ))}
        </div>

        <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-center gap-8">
            <button 
              onClick={scrollToContact}
              className="w-full md:w-auto px-12 py-6 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-2xl uppercase tracking-widest text-sm"
            >
              Book Discovery Call
            </button>
            <button 
              className="w-full md:w-auto px-12 py-6 bg-white text-slate-900 border-2 border-slate-900 font-black rounded-sm hover:bg-slate-50 transition-all uppercase tracking-widest text-sm"
            >
              Impact Blueprint
            </button>
        </div>
      </div>

      {/* DETAILED PROJECT OVERLAY */}
      {selectedProgram && (
        <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in fade-in duration-500 overflow-hidden">
          {/* NAVIGATION BAR */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-6 md:px-12 flex justify-between items-center z-50">
            <button 
              onClick={() => setSelectedProgram(null)}
              className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Overview
            </button>
            <button 
              onClick={() => setSelectedProgram(null)}
              className="p-2 text-slate-400 hover:text-slate-950 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col lg:flex-row min-h-full">
              {/* LEFT COLUMN: VISUAL ANCHOR */}
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

              {/* RIGHT COLUMN: READING EXPERIENCE */}
              <div className="flex-1 bg-white p-12 md:p-20 lg:p-32 max-w-5xl">
                <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                  
                  {PROGRAM_DETAILS[selectedProgram.title] ? (
                    <div className="space-y-16">
                      {/* Synopsis Section */}
                      <div className="space-y-8">
                        <h4 className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-blue-600">
                          <Info className="w-5 h-5" /> Detailed Synopsis
                        </h4>
                        <div className="space-y-10 border-l-8 border-slate-50 pl-10 md:pl-16">
                          {PROGRAM_DETAILS[selectedProgram.title].synopsis.map((para: string, idx: number) => (
                            <p key={idx} className="text-2xl md:text-3xl text-slate-800 font-medium leading-[1.4] tracking-tight">
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Strategic Fit Section */}
                      {PROGRAM_DETAILS[selectedProgram.title].strategicFit && (
                        <div className="p-10 md:p-16 bg-slate-50 border-l-8 border-lime-500 space-y-6">
                           <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-slate-900">
                              <Zap className="w-5 h-5 text-lime-500" /> Strategic Backbone
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
                              <Scale className="w-4 h-4 text-lime-500" /> Core Themes
                           </div>
                           <p className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                              {PROGRAM_DETAILS[selectedProgram.title].themes}
                           </p>
                        </div>
                        <div className="space-y-6">
                           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <Clapperboard className="w-4 h-4 text-blue-600" /> Platform Type
                           </div>
                           <p className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                              {PROGRAM_DETAILS[selectedProgram.title].format}
                           </p>
                        </div>
                      </div>

                      {/* Impact Highlight */}
                      <div className="p-10 bg-slate-50 border-l-8 border-blue-600">
                        <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-slate-900 mb-6">
                           <BarChart3 className="w-5 h-5 text-blue-600" /> Impact Statement
                        </h4>
                        <p className="text-xl font-bold text-slate-700 leading-relaxed">
                          {PROGRAM_DETAILS[selectedProgram.title].impact || selectedProgram.description}
                        </p>
                      </div>

                      {/* Call to Action */}
                      <div className="pt-10 flex flex-col md:flex-row items-center gap-8">
                         <button 
                           onClick={() => {
                              setSelectedProgram(null);
                              scrollToContact();
                           }}
                           className="w-full md:w-auto px-16 py-8 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-4 group"
                         >
                           Inquire for Partnership <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 text-center space-y-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm">
                      <Sparkles className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
                      <div className="space-y-2">
                        <h4 className="text-xl font-black text-slate-900 uppercase">Information Loading</h4>
                        <p className="text-slate-500 text-sm font-medium">The full strategic blueprint for {selectedProgram.title} is currently being synchronized.</p>
                      </div>
                      <button 
                        onClick={() => setSelectedProgram(null)}
                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  )}

                  <div className="pt-20 border-t border-slate-100 opacity-50 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
                      Azariah Management Group • Project Profile • {new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default Programs;