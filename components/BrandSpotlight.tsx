import React from 'react';
import SectionWrapper from './SectionWrapper';

const BrandSpotlight: React.FC = () => {
  return (
    <section id="brand-spotlight" className="bg-slate-950 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto">
        <div className="relative w-full aspect-video md:aspect-[21/9] lg:aspect-[2.4/1]">
          <iframe 
            className="absolute inset-0 w-full h-full pointer-events-none grayscale-[0.2] contrast-[1.1]"
            src="https://www.youtube.com/embed/liPxM5UGeec?autoplay=1&mute=1&loop=1&playlist=liPxM5UGeec&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0" 
            title="Azariah Management Group Brand Vision" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
          
          {/* Overlay mask for aesthetic integration */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20 pointer-events-none"></div>
          
          {/* Text Anchor */}
          <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 z-10 space-y-2 reveal active">
            <div className="h-[1px] w-12 bg-lime-500 mb-4"></div>
            <p className="text-[10px] font-black text-lime-400 uppercase tracking-[0.5em]">Brand Spotlight</p>
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
              Strategic <br /> Storytelling.
            </h3>
          </div>

          {/* Decorative side scanlines */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%]"></div>
        </div>
      </div>
    </section>
  );
};

export default BrandSpotlight;