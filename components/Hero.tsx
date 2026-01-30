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
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent z-10"></div>
          <video
            ref={el => { videoRefs.current[index] = el; }}
            src={slide.video}
            poster={slide.poster}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover grayscale-[20%] contrast-[1.1]"
          />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
        <div className="max-w-3xl space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 bg-lime-500 text-slate-900 rounded-sm text-[10px] font-black tracking-[0.25em] uppercase shadow-xl animate-in fade-in slide-in-from-left-4 duration-700">
            <Globe2 className="w-3 h-3" />
            Purpose. Innovation. Impact.
          </div>

          <div className="space-y-2 overflow-hidden">
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter transition-all duration-700">
              {SLIDES[currentSlide].title}
            </h1>
            <p className="text-xl md:text-3xl font-bold text-lime-400 tracking-tight">
              {SLIDES[currentSlide].subtitle}
            </p>
          </div>

          <p className="text-base md:text-xl text-slate-200 leading-relaxed font-medium max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            At Azariah Management Group (AMG), we help corporations, nonprofits, governments, and
            emerging enterprises turn purpose into measurable progress. Through strategy, innovation, and creative storytelling, we unlock sustainable growth.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <button className="px-6 md:px-10 py-4 md:py-5 bg-white text-slate-900 font-black rounded-sm hover:bg-lime-500 hover:text-slate-900 transition-all flex items-center justify-center group shadow-2xl text-sm md:text-base">
              → Book Discovery Call
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-10 md:bottom-12 left-6 md:left-12 z-30 flex items-center gap-6">
        <div className="flex gap-2 md:gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`relative h-1 md:h-1.5 overflow-hidden transition-all duration-300 rounded-full ${
                i === currentSlide ? 'w-10 md:w-16 bg-white/20' : 'w-3 md:w-4 bg-white/20 hover:bg-white/40'
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
        <div className="flex gap-2 md:gap-4">
          <button 
            onClick={prevSlide}
            disabled={isTransitioning}
            className="p-2 md:p-3 border border-white/20 text-white rounded-full hover:bg-white hover:text-slate-900 transition-all backdrop-blur-md disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button 
            onClick={nextSlide}
            disabled={isTransitioning}
            className="p-2 md:p-3 border border-white/20 text-white rounded-full hover:bg-white hover:text-slate-900 transition-all backdrop-blur-md disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;