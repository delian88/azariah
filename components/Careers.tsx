import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Users, GraduationCap, Handshake, ArrowRight, Star } from 'lucide-react';

const Careers: React.FC = () => {
  const CAREER_PATHWAYS = [
    {
      title: "Mentorship",
      description: "Empowering the next generation of leaders through one-on-one guidance and high-impact career coaching.",
      icon: Users,
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Affiliate Marketing",
      description: "Partner with us to grow your influence and revenue through our strategic business ecosystem.",
      icon: Handshake,
      color: "bg-lime-500",
      lightColor: "bg-lime-50",
      textColor: "text-lime-600"
    },
    {
      title: "Training",
      description: "Professional development and technical capacity building designed for operational excellence.",
      icon: GraduationCap,
      color: "bg-slate-900",
      lightColor: "bg-slate-100",
      textColor: "text-slate-900"
    }
  ];

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SectionWrapper id="careers" bg="light" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white -skew-x-12 translate-x-1/2 -z-0"></div>
      
      <div className="space-y-16 relative z-10">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-sm">
            <Star className="w-3 h-3 text-lime-400" /> Career & Growth
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase text-shine">
            Pathways to Excellence
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            Join the Azariah Manage mission. We build ecosystems where talent meets opportunity and strategy meets impact.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {CAREER_PATHWAYS.map((pathway) => (
            <div 
              key={pathway.title}
              className="group bg-white p-10 rounded-sm border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
            >
              <div className={`w-16 h-16 ${pathway.lightColor} flex items-center justify-center rounded-sm mb-8 group-hover:${pathway.color} transition-colors duration-500`}>
                <pathway.icon className={`w-8 h-8 ${pathway.textColor} group-hover:text-white transition-colors duration-500`} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase">{pathway.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm font-medium mb-8 flex-grow">
                {pathway.description}
              </p>
              <button 
                onClick={scrollToContact}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${pathway.textColor} hover:opacity-70 transition-all transform group-hover:translate-x-2`}
              >
                Inquire Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 p-10 md:p-16 rounded-sm text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent"></div>
          <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-shine-white">Ready to scale your future?</h3>
            <p className="text-slate-400 font-medium">Connect with our talent development team to explore custom professional pathways.</p>
          </div>
          <button 
            onClick={scrollToContact}
            className="px-12 py-6 bg-lime-500 text-slate-900 font-black rounded-sm hover:bg-white transition-all shadow-xl uppercase tracking-widest text-xs relative z-10 whitespace-nowrap"
          >
            Connect With Talent Team
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Careers;