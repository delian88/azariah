import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Globe2 } from 'lucide-react';

const SLIDES = [
  {
    video: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27db08e124845114704b2d352332f1f50a80d2a&profile_id=164&oauth2_token_id=57447761',
    poster: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069',
    title: 'Strategy.',
    subtitle: 'Strategic Excellence',
    description: 'We help corporations and nonprofits turn purpose into measurable progress through precise management consulting.'
  },
  {
    video: 'https://player.vimeo.com/external/371433917.sd.mp4?s=694406a461b40213032d8478418f430635489814&profile_id=164&oauth2_token_id=57447761',
    title: 'Innovation.',
    poster: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070',
    subtitle: 'Future-Ready Solutions',
    description: 'Scaling organizations effectively by integrating cutting-edge technology and AI-driven insights.'
  },
  {
    video: 'https://player.vimeo.com/external/403810419.sd.mp4?s=e52f5979f046e8c89c8a071c33f274a7b7a42142&profile_id=164&oauth2_token_id=57447761',
    title: 'Impact.',
    poster: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070',
    subtitle: 'Community Development',
    description: 'Building solutions that strengthen communities and unlock sustainable growth through creative storytelling.'
  }
];

const AUTO_SCROLL_INTERVAL = 8000;

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(timer);
  }, [currentSlide, isTransitioning]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-slate-900">
      {/* Background Videos Slider */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent z-10"></div>
          <video
            ref={el => { videoRefs.current[index] = el; }}
            src={slide.video}
            poster={slide.poster}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover grayscale-[30%] contrast-[1.1]"
          />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
        <div className="max-w-4xl space-y-6 md:space-y-10">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-lime-500/90 text-slate-950 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <Globe2 className="w-4 h-4 animate-spin-slow" />
            Purpose • Innovation • Impact
          </div>

          <div className="space-y-4 overflow-hidden">
            <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black text-white leading-[0.85] tracking-tighter transition-all duration-700 text-shine-white">
              {SLIDES[currentSlide].title}
            </h1>
            <p className="text-2xl md:text-4xl font-bold text-lime-400 tracking-tight flex items-center gap-4">
              <span className="w-12 h-[2px] bg-lime-400 hidden md:block"></span>
              {SLIDES[currentSlide].subtitle}
            </p>
          </div>

          <p className="text-lg md:text-2xl text-slate-300 leading-relaxed font-medium max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            Azariah Management Group (AMG) empowers leaders to turn purpose into progress through strategy, tech innovation, and storytelling.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <button 
              onClick={scrollToContact}
              className="px-10 py-6 bg-white text-slate-900 font-black rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all flex items-center justify-center group shadow-2xl text-base tracking-wider uppercase border-b-4 border-slate-200 active:translate-y-1 active:border-b-0"
            >
              Book Discovery Call
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="flex items-center gap-4 px-6 py-4 rounded-sm bg-slate-800/40 backdrop-blur-md border border-white/10">
              <span className="text-white font-bold text-xs uppercase tracking-widest">Global Reach:</span>
              <div className="flex -space-x-2">
                {['US', 'EU', 'UK', 'AF'].map(reg => (
                  <div key={reg} className="w-8 h-8 rounded-full bg-slate-700 border border-white/20 flex items-center justify-center text-[10px] font-black text-lime-400">{reg}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-10 md:bottom-16 left-6 md:left-12 z-30 flex flex-col md:flex-row items-start md:items-center gap-8">
        <div className="flex gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`relative h-2 overflow-hidden transition-all duration-500 rounded-full ${
                i === currentSlide ? 'w-24 md:w-32 bg-white/30' : 'w-6 md:w-8 bg-white/20 hover:bg-white/50'
              }`}
            >
              {i === currentSlide && (
                <div 
                  key={currentSlide}
                  className="absolute inset-0 bg-lime-500 animate-progress origin-left"
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <button 
            onClick={prevSlide}
            disabled={isTransitioning}
            className="group p-4 border border-white/20 text-white rounded-full hover:bg-white hover:text-slate-900 transition-all backdrop-blur-md disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={nextSlide}
            disabled={isTransitioning}
            className="group p-4 border border-white/20 text-white rounded-full hover:bg-white hover:text-slate-900 transition-all backdrop-blur-md disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;