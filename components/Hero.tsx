import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Globe2 } from 'lucide-react';

const SLIDES = [
  {
    video: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27db08e124845114704b2d352332f1f50a80d2a&profile_id=164&oauth2_token_id=57447761',
    title: 'Strategy.',
    subtitle: 'Strategic Excellence',
    description: 'We help corporations and nonprofits turn purpose into measurable progress through precise management consulting.'
  },
  {
    video: 'https://player.vimeo.com/external/371433917.sd.mp4?s=694406a461b40213032d8478418f430635489814&profile_id=164&oauth2_token_id=57447761',
    title: 'Innovation.',
    subtitle: 'Future-Ready Solutions',
    description: 'Scaling organizations effectively by integrating cutting-edge technology and AI-driven insights.'
  },
  {
    video: 'https://player.vimeo.com/external/403810419.sd.mp4?s=e52f5979f046e8c89c8a071c33f274a7b7a42142&profile_id=164&oauth2_token_id=57447761',
    title: 'Impact.',
    subtitle: 'Community Development',
    description: 'Building solutions that strengthen communities and unlock sustainable growth through creative storytelling.'
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 9000);
    return () => clearInterval(timer);
  }, [currentSlide]);

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
            ref={videoRefs[index]}
            src={slide.video}
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
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lime-500 text-slate-900 rounded-sm text-[10px] font-black tracking-[0.25em] uppercase shadow-xl animate-in fade-in slide-in-from-left-4 duration-700">
            <Globe2 className="w-3 h-3" />
            Purpose. Innovation. Impact.
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
            emerging enterprises turn purpose into measurable progress. Through strategy, innovation, and creative storytelling, we unlock sustainable growth.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <button className="px-10 py-5 bg-white text-slate-900 font-black rounded-sm hover:bg-lime-500 hover:text-slate-900 transition-all flex items-center justify-center group shadow-2xl">
              → Book a 20-Minute Discovery Call
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
    </section>
  );
};

export default Hero;