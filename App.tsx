
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
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-slate-900 selection:text-white overflow-x-hidden">
      <Navbar />
      
      <main>
        <section className="reveal">
          <Hero />
        </section>
        
        <section className="reveal">
          <Services />
        </section>
        
        <section className="reveal">
          <StrategicAI />
        </section>
        
        <section className="reveal">
          <About />
        </section>
        
        <section className="reveal">
          <Contact />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
