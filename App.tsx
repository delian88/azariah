
import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import StrategicAI from './components/StrategicAI';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  useEffect(() => {
    // Basic reveal animation on scroll using Intersection Observer
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-slate-900 selection:text-white">
      <Navbar />
      
      <main>
        <div className="reveal">
          <Hero />
        </div>
        
        <div className="reveal">
          <Services />
        </div>
        
        <div className="reveal">
          <StrategicAI />
        </div>
        
        <div className="reveal">
          <About />
        </div>
        
        <div className="reveal">
          <Contact />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
