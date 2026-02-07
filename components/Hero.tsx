import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const SLIDES = [
  {
    video: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27db08e124845114704b2d352332f1f50a80d2a&profile_id=164&oauth2_token_id=57447761',
    poster: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069',
    title: 'Azariah.',
    subtitle: 'Management Group',
    description: 'We deliver high-performance consulting and media solutions for organizations that demand excellence and impact.'
  },
  {
    video: 'https://player.vimeo.com/external/371433917.sd.mp4?s=694406a461b40213032d8478418f430635489814&profile_id=164&oauth2_token_id=57447761',
    title: 'Impact Driven.',
    poster: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070',
    subtitle: 'Future-Ready Systems',
    description: 'Integrating advanced technology and creative storytelling to maximize your reach and results.'
  },
  {
    video: 'https://player.vimeo.com/external/403810419.sd.mp4?s=e52f5979f046e8c89c8a071c33f274a7b7a42142&profile_id=164&oauth2_token_id=57447761',
    title: 'Global Scale.',
    poster: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070',
    subtitle: 'Strategic Excellence',
    description: 'Azariah Management Group partners with visionaries to transform complex challenges into scalable opportunities.'
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
    <section id="home" className="relative h-screen w-full overflow-hidden bg-slate-950">
      {/* Background Videos */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-slate-950/40 z-10"></div>
          <video
            ref={el => { videoRefs.current[index] = el; }}
            src={slide.video}
            poster={slide.poster}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover grayscale brightness-50 contrast-125"
          />
        </div>
      ))}

      {/* Hero Grid Lines Overlay */}
      <div className="absolute inset-0 bg-grid-lines opacity-10 z-15 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white text-slate-950 rounded-none text-[12px] font-black tracking-[0.3em] uppercase shadow-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <Zap className="w-4 h-4 fill-slate-950" />
            AZARIAH MANAGEMENT GROUP
          </div>

          <div className="space-y-2 overflow-hidden">
            <h1 className="text-7xl sm:text-8xl md:text-[9rem] font-black text-white leading-[0.8] tracking-tighter transition-all duration-700 text-shine-white">
              {SLIDES[currentSlide].title}
            </h1>
            <p className="text-3xl md:text-5xl font-black text-lime-400 tracking-tighter uppercase italic">
              {SLIDES[currentSlide].subtitle}
            </p>
          </div>

          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-bold max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            {SLIDES[currentSlide].description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <button 
              onClick={scrollToContact}
              className="px-12 py-7 bg-lime-500 text-slate-950 font-black rounded-none hover:bg-white transition-all flex items-center justify-center group shadow-2xl text-lg tracking-widest uppercase border-r-8 border-slate-900 active:translate-y-1 active:border-r-0"
            >
              Start Your Journey
              <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="px-8 py-7 bg-slate-900/80 backdrop-blur-md border border-white/10 text-white font-black uppercase tracking-widest text-xs flex items-center gap-4">
              <span className="text-lime-400">STATUS:</span>
              <span>OPERATIONAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-12 left-6 md:left-12 z-30 flex flex-col md:flex-row items-start md:items-center gap-8">
        <div className="flex gap-4">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`relative h-1 overflow-hidden transition-all duration-500 rounded-none ${
                i === currentSlide ? 'w-32 bg-white/20' : 'w-8 bg-white/10 hover:bg-white/40'
              }`}
            >
              {i === currentSlide && (
                <div 
                  key={currentSlide}
                  className="absolute inset-0 bg-lime-500 animate-progress"
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={prevSlide}
            className="p-5 bg-white text-slate-950 rounded-none hover:bg-lime-500 transition-all shadow-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="p-5 bg-white text-slate-950 rounded-none hover:bg-lime-500 transition-all shadow-xl"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;