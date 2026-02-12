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
import NewsPage from './components/NewsPage';
import ProductsPage from './components/ProductsPage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import PortfolioPage from './components/PortfolioPage';
import PartnersPage from './components/PartnersPage';
import CreAItubePage from './components/CreAItubePage';
import Careers from './components/Careers';
import CreAItube from './components/CreAItube';
import ChatBot from './components/ChatBot';
import Partners from './components/Partners';
import PodOreSection from './components/PodOreSection';
import BrandSpotlight from './components/BrandSpotlight';

type ViewState = 'home' | 'services' | 'about' | 'programs' | 'studio' | 'news' | 'products' | 'terms' | 'privacy' | 'portfolio' | 'partners' | 'creaitube';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('home');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash;
      
      let nextView: ViewState = 'home';
      if (hash === '#services-page') nextView = 'services';
      else if (hash === '#about-page') nextView = 'about';
      else if (hash === '#programs-page') nextView = 'programs';
      else if (hash === '#studio-page') nextView = 'studio';
      else if (hash === '#news-page') nextView = 'news';
      else if (hash === '#products-page') nextView = 'products';
      else if (hash === '#terms-page') nextView = 'terms';
      else if (hash === '#privacy-page') nextView = 'privacy';
      else if (hash === '#portfolio-page') nextView = 'portfolio';
      else if (hash === '#partners-page') nextView = 'partners';
      else if (hash === '#creaitube-page') nextView = 'creaitube';
      else nextView = 'home';

      setView(nextView);
      
      if (hash.includes('-page')) {
        window.scrollTo(0, 0);
      } else if (hash.length > 1) {
        const id = hash.substring(1);
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else if (nextView === 'home') {
            setTimeout(() => {
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
          }
        }, nextView === 'home' ? 300 : 100);
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

  useEffect(() => {
    const titleMap: Record<ViewState, string> = {
      home: "Azariah Management Group | Strategic Intelligence & Media Impact",
      services: "Strategic Services | Azariah Management Group",
      about: "About Us | Who We Serve | AMG",
      programs: "Signature Programs & Initiatives | AMG",
      studio: "Studio AMG | Cinematic Storytelling & Media Production",
      news: "News & Insights | Azariah Management Group",
      products: "Digital Products & Ecosystems | AMG",
      terms: "Terms & Conditions | Legal Standards | AMG",
      privacy: "Privacy Policy | Data Protection | AMG",
      portfolio: "Evidence of Excellence | AMG Portfolio",
      partners: "Strategic Ecosystem | Partners & Clients | AMG",
      creaitube: "CreAItube | The New Media Economy | AMG"
    };
    
    document.title = titleMap[view] || "Azariah Management Group";
  }, [view]);

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

    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observerRef.current?.observe(el));
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
      studio: '#studio-page',
      news: '#news-page',
      products: '#products-page',
      terms: '#terms-page',
      privacy: '#privacy-page',
      portfolio: '#portfolio-page',
      partners: '#partners-page',
      creaitube: '#creaitube-page'
    };
    window.location.hash = hashMapping[newView];
    setView(newView);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-[1000] space-y-8">
        <Logo variant="dark" className="h-8 animate-pulse" />
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
            <BrandSpotlight />
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
        {view === 'news' && <NewsPage />}
        {view === 'products' && <ProductsPage />}
        {view === 'terms' && <TermsPage />}
        {view === 'privacy' && <PrivacyPage />}
        {view === 'portfolio' && <PortfolioPage />}
        {view === 'partners' && <PartnersPage />}
        {view === 'creaitube' && <CreAItubePage />}
        
        <Contact />
      </main>

      <Footer onNavigate={navigateTo} />
      <ChatBot />
    </div>
  );
};

export default App;