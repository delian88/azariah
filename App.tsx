import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
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
import ChatBot from './components/ChatBot';
import Partners from './components/Partners';

type ViewState = 'home' | 'services' | 'about' | 'programs' | 'studio';

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
      window.scrollTo(0, 0);
    };

    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', handleHashRouting);
    };
  }, []);

  // Intersection Observer for "reveal" animations
  // This needs to re-run whenever the 'view' changes to catch new elements
  useEffect(() => {
    if (loading) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    // Clean up old observer if it exists
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

    // Short delay to ensure DOM has rendered the new view
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observerRef.current?.observe(el));
    }, 150);

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
    // Hash change listener will handle the setView and Scroll
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
        <div className="animate-pulse-logo">
          <Logo className="h-20 md:h-24" />
        </div>
        <div className="mt-8 w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#005696] animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
        <style>{`
          @keyframes pulse-logo {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }
          .animate-pulse-logo {
            animation: pulse-logo 2s ease-in-out infinite;
          }
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  const renderContent = () => {
    switch(view) {
      case 'services':
        return <ServicesPage />;
      case 'about':
        return <AboutPage />;
      case 'programs':
        return <ProgramsPage />;
      case 'studio':
        return <StudioAMGPage />;
      default:
        return (
          <>
            <div className="reveal">
              <Hero />
            </div>
            
            <Partners />

            <div className="reveal">
              <About />
            </div>
            
            <div className="reveal">
              <Services onExploreMore={() => navigateTo('services')} />
            </div>

            <div className="reveal">
              <Programs />
            </div>
            
            <div className="reveal">
              <StrategicAI />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-slate-900 selection:text-white overflow-x-hidden">
      <Navbar onNavigate={navigateTo} currentView={view} />
      
      <main>
        {renderContent()}
        <div className="reveal">
          <Contact />
        </div>
      </main>
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default App;