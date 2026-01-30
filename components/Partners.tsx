import React from 'react';
import { PARTNERS } from '../constants';

const Partners: React.FC = () => {
  // Duplicate the array to create a seamless loop
  const displayPartners = [...PARTNERS, ...PARTNERS];

  return (
    <div className="py-12 bg-white border-y border-slate-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-slate-200"></div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">Trusted Partners & Clients</h3>
        <div className="h-[1px] flex-1 bg-slate-200"></div>
      </div>
      
      <div className="relative flex">
        {/* Sliding Container */}
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {displayPartners.map((partner, index) => {
            const content = (
              <div 
                key={index} 
                className={`mx-12 text-lg md:text-xl font-black transition-all uppercase tracking-tighter ${
                  partner.url 
                  ? 'text-slate-400 hover:text-blue-600 cursor-pointer underline decoration-transparent hover:decoration-blue-600 underline-offset-8' 
                  : 'text-slate-300 hover:text-slate-900'
                }`}
              >
                {partner.name}
              </div>
            );

            if (partner.url) {
              return (
                <a 
                  key={index}
                  href={partner.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  {content}
                </a>
              );
            }
            return content;
          })}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Gradient Masks for fade effect at edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default Partners;