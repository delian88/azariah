
import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { PRODUCT_ITEMS } from '../constants';
import { 
  Zap, ArrowRight, CheckCircle2, ShoppingBag, 
  ExternalLink, Layers, Sparkles, Globe, ShieldCheck, 
  ChevronRight, Laptop, Smartphone, Rocket
} from 'lucide-react';

const ProductsPage: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24">
      {/* HERO SECTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 left-0 w-1/4 h-full bg-slate-50 -skew-x-12 -translate-x-1/2 -z-10"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 reveal active">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-50 text-lime-800 text-xs font-black uppercase tracking-widest rounded-full border border-lime-100 animate-pulse">
              <Zap className="w-4 h-4 fill-lime-500" /> Digital Infrastructure
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none text-shine">
              The Product Ecosystem.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-blue-600 pl-6">
              Our digital tools and frameworks are designed to move organizations from baseline operations to high-impact excellence.
            </p>
          </div>
          <div className="relative reveal active">
             <div className="aspect-square bg-slate-900 rounded-sm shadow-2xl overflow-hidden p-12 flex flex-col justify-center items-center text-center space-y-6">
                <Rocket className="w-24 h-24 text-lime-500 animate-bounce" />
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Tools for the Modern Mission</h3>
                <p className="text-slate-400 text-sm font-medium">Scalable. Secure. Purpose-Driven.</p>
             </div>
          </div>
        </div>
      </SectionWrapper>

      {/* PRODUCT GRID */}
      <SectionWrapper bg="light" className="py-24">
        <div className="space-y-24">
          {PRODUCT_ITEMS.map((product, i) => (
            <div key={product.id} className={`grid lg:grid-cols-2 gap-20 items-center reveal active ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`space-y-8 ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">{product.category}</span>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                    {product.title}
                  </h2>
                  <p className="text-2xl font-bold text-lime-600 tracking-tight">{product.tagline}</p>
                </div>
                
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  {product.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                   {product.features.map((feature, idx) => (
                     <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-sm shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-700">{feature}</span>
                     </div>
                   ))}
                </div>

                <div className="pt-6 flex flex-wrap gap-4">
                   <button 
                    onClick={scrollToContact}
                    className="px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-xl"
                   >
                     Request Product Demo
                   </button>
                   <button className="px-8 py-4 border-2 border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-sm hover:border-slate-900 transition-all">
                     View Documentation
                   </button>
                </div>
              </div>

              <div className={`relative group ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                 <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/5 to-lime-500/5 blur-3xl rounded-full"></div>
                 <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden shadow-2xl border-8 border-white group-hover:-translate-y-2 transition-transform duration-700">
                    <img src={product.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={product.title} />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA SECTION */}
      <SectionWrapper bg="dark" className="py-32 text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 p-20 opacity-5">
            <ShieldCheck className="w-96 h-96 text-white" />
         </div>
         <div className="max-w-4xl mx-auto space-y-12 relative z-10 reveal active">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-shine-white uppercase">
              Build Your Digital Future.
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
              Integrate AMG products into your operational workflow and see the difference that strategic engineering can make.
            </p>
            <div className="pt-8">
               <button 
                 onClick={scrollToContact}
                 className="px-14 py-7 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-2xl uppercase tracking-widest text-sm flex items-center justify-center gap-4 group mx-auto"
               >
                 Inquire About Custom Solutions <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default ProductsPage;
