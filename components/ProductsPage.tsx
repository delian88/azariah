import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { PRODUCT_ITEMS } from '../constants';
import { 
  Zap, ArrowRight, CheckCircle2, ShoppingBag, 
  ExternalLink, Layers, Sparkles, Globe, ShieldCheck, 
  ChevronRight, Laptop, Smartphone, Rocket, X, Mail, User, Download, Loader2, AlertCircle
} from 'lucide-react';

const ProductsPage: React.FC = () => {
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [emailError, setEmailError] = useState<string | null>(null);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const openDocModal = (product: any) => {
    setSelectedProduct(product);
    setIsDocModalOpen(true);
    setIsSubmitted(false);
    setEmailError(null);
  };

  const closeDocModal = () => {
    setIsDocModalOpen(false);
    setSelectedProduct(null);
    setFormData({ name: '', email: '' });
    setEmailError(null);
  };

  const handleDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid professional email address.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API lead capture
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
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
                   <button 
                     onClick={() => openDocModal(product)}
                     className="px-8 py-4 border-2 border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-sm hover:border-slate-900 transition-all"
                   >
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

      {/* DOCUMENTATION MODAL */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-sm shadow-2xl overflow-hidden relative">
            <button 
              onClick={closeDocModal}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {!isSubmitted ? (
              <div className="p-10 md:p-16 space-y-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" /> Secure Document Portal
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                    Access {selectedProduct?.title} Blueprint
                  </h3>
                  <p className="text-slate-500 font-medium text-sm">
                    Enter your professional details below to receive the comprehensive technical documentation and implementation guide.
                  </p>
                </div>

                <form onSubmit={handleDocSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Cooper"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-all text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Business Email
                    </label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (emailError) setEmailError(null);
                      }}
                      placeholder="jane@organization.com"
                      className={`w-full px-6 py-4 bg-slate-50 border ${emailError ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-sm focus:outline-none focus:border-slate-900 transition-all text-sm font-bold`}
                    />
                    {emailError && (
                      <p className="text-[10px] text-red-600 font-black uppercase tracking-tighter flex items-center gap-2 animate-in slide-in-from-left-2">
                        <AlertCircle className="w-3 h-3" /> {emailError}
                      </p>
                    )}
                  </div>
                  
                  <button 
                    disabled={isSubmitting}
                    className="w-full py-6 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Verifying Credentials...
                      </>
                    ) : (
                      <>
                        Request Access <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[9px] text-center font-black uppercase tracking-widest text-slate-400">
                  By requesting access, you agree to our professional data handling policy.
                </p>
              </div>
            ) : (
              <div className="p-10 md:p-20 text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-lime-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                   <Download className="w-10 h-10 text-slate-950 animate-bounce" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Access Granted</h3>
                  <p className="text-slate-500 font-medium text-sm">
                    Thank you, {formData.name.split(' ')[0]}. Your documentation for <span className="font-black text-slate-900">{selectedProduct?.title}</span> is ready for download.
                  </p>
                </div>
                <div className="pt-4 flex flex-col gap-4">
                   <a 
                     href="#" 
                     onClick={(e) => { e.preventDefault(); alert("Simulated download: " + selectedProduct?.title + "_Documentation.pdf"); }}
                     className="w-full py-6 bg-lime-500 text-slate-950 font-black uppercase tracking-[0.2em] text-xs rounded-sm hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-4 shadow-xl"
                   >
                     Download Blueprint PDF <Download className="w-4 h-4" />
                   </a>
                   <button 
                     onClick={closeDocModal}
                     className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                   >
                     Return to Products
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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