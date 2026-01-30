import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Globe2 } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069',
    title: 'Strategy.',
    subtitle: 'Strategic Excellence',
    description: 'We help corporations and nonprofits turn purpose into measurable progress through precise management consulting.'
  },
  {
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070',
    title: 'Innovation.',
    subtitle: 'Future-Ready Solutions',
    description: 'Scaling organizations effectively by integrating cutting-edge technology and AI-driven insights.'
  },
  {
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070',
    title: 'Impact.',
    subtitle: 'Community Development',
    description: 'Building solutions that strengthen communities and unlock sustainable growth through creative storytelling.'
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-slate-900">
      {/* Background Images Slider */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent z-10"></div>
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover scale-105 animate-[zoom_20s_linear_infinite]"
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lime-500 text-slate-900 rounded-sm text-[10px] font-black tracking-[0.25em] uppercase shadow-xl animate-in fade-in slide-in-from-left-4 duration-700">
            <Globe2 className="w-3 h-3" />
            Strategy • Innovation • Community Impact
          </div>

          <div className="space-y-2 overflow-hidden">
            <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter">
              {SLIDES[currentSlide].title}
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-lime-400 tracking-tight">
              {SLIDES[currentSlide].subtitle}
            </p>
          </div>

          <p className="text-xl text-slate-200 leading-relaxed font-medium max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            At Azariah Management Group (AMG), we help corporations, nonprofits, governments, and
            emerging enterprises turn purpose into measurable progress.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-4">
            <button className="px-10 py-5 bg-white text-slate-900 font-black rounded-sm hover:bg-lime-500 hover:text-slate-900 transition-all flex items-center justify-center group shadow-2xl">
              Book a 20-Minute Discovery Call
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-12 left-6 md:left-12 z-30 flex items-center gap-6">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                i === currentSlide ? 'w-12 bg-lime-500' : 'w-4 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-4">
          <button 
            onClick={prevSlide}
            className="p-3 border border-white/20 text-white rounded-full hover:bg-white hover:text-slate-900 transition-all backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="p-3 border border-white/20 text-white rounded-full hover:bg-white hover:text-slate-900 transition-all backdrop-blur-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes zoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </section>
  );
};

export default Hero;