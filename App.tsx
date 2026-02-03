
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Services from './components/Services';
import About from './components/About';
import Programs from './components/Programs';
import StrategicAI from './components/StrategicAI';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Logo from './components/Logo';
import ServicesPage from './components/ServicesPage';
import AboutPage from './components/AboutPage';
import ProgramsPage from './components/ProgramsPage';
import StudioAMGPage from './components/StudioAMGPage';
import Careers from './components/Careers';
import CreAItube from './components/CreAItube';
import ChatBot from './components/ChatBot';
import Partners from './components/Partners';
import PodOreSection from './components/PodOreSection';

type ViewState = 'home' | 'services' | 'about' | 'programs' | 'studio';

// Completed the App component to fix the '() => void' is not assignable to type 'FC<{}>' error
const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('home');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Handle Hash Routing
  useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash;
      if (hash === '#services-page') setView('services');
      else if (hash === '#about-page') setView('about');
      else if (hash === '#programs-page') setView('programs');
      else if (hash === '#studio-page') setView('studio');
      else setView('home');
      
      // If we're on the home page and have a specific section hash, scroll to it
      if (!hash.includes('-page') && hash.length > 1) {
        const id = hash.substring(1);
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo(0, 0);
      }
    };

    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', handleHashRouting);
    };
  }, []);

  // Intersection Observer for "reveal" animations
  useEffect(() => {
    if (loading) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Re-scan DOM after view updates
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observerRef.current?.observe(el));
      
      // Fail-safe
      setTimeout(() => {
        const stuckElements = document.querySelectorAll('.reveal:not(.active)');
        stuckElements.forEach(el => el.classList.add('active'));
      }, 2000);

    }, 300);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [loading, view]);

  const navigateTo = (newView: ViewState) => {
    const hashMapping: Record<ViewState, string> = {
      home: '#home',
      services: '#services-page',
      about: '#about-page',
      programs: '#programs-page',
      studio: '#studio-page'
    };
    window.location.hash = hashMapping[newView];
    setView(newView);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-[1000] space-y-8">
        <Logo variant="dark" className="h-20 animate-pulse" />
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-lime-500 animate-loading-bar origin-left"></div>
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">
          Initializing Strategy...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={navigateTo} currentView={view} />
      
      <main>
        {view === 'home' && (
          <>
            <Hero />
            <Philosophy />
            <Partners />
            <Services onExploreMore={() => navigateTo('services')} />
            <About />
            <Programs />
            <StrategicAI />
            <CreAItube />
            <PodOreSection />
            <Careers />
          </>
        )}

        {view === 'services' && <ServicesPage />}
        {view === 'about' && <AboutPage />}
        {view === 'programs' && <ProgramsPage />}
        {view === 'studio' && <StudioAMGPage />}
        
        <Contact />
      </main>

      <Footer />
      <ChatBot />
      
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        .text-shine {
          background: linear-gradient(to right, #0f172a 20%, #475569 40%, #475569 60%, #0f172a 80%);
          background-size: 200% auto;
          color: #000;
          background-clip: text;
          text-fill-color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 4s linear infinite;
        }
        .text-shine-white {
          background: linear-gradient(to right, #fff 20%, #94a3b8 40%, #94a3b8 60%, #fff 80%);
          background-size: 200% auto;
          background-clip: text;
          text-fill-color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 4s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
        @keyframes loading-bar {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out forwards;
        }
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
};

// Added default export to fix "Module has no default export" error in index.tsx
export default App;
