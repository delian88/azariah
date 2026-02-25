import React from 'react';
import SectionWrapper from './SectionWrapper';
import { ArrowLeft, CheckCircle2, ShieldCheck, Leaf, Users, Target, Zap, LayoutGrid } from 'lucide-react';

interface WallfeelPageProps {
  onBack: () => void;
}

const WallfeelPage: React.FC<WallfeelPageProps> = ({ onBack }) => {
  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* HERO SECTION */}
      <SectionWrapper bg="white" className="pb-12 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 reveal active">
          <div className="space-y-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Partners
            </button>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none uppercase">
              WallFeel <span className="text-shine">Luxurious.</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium border-l-4 border-lime-500 pl-6 max-w-2xl">
              Redefining Luxury Wall Coverings Since 2019.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* ABOUT SECTION */}
      <SectionWrapper bg="light" className="py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 reveal">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">About WallFeel</h2>
            <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
              <p>
                Founded in 2019, WallFeel is a leading provider of premium luxury wall coverings and custom interior wall solutions designed to transform residential and commercial spaces. We don’t just decorate walls we engineer statement environments that elevate brands, enhance lifestyles, and create unforgettable experiences.
              </p>
              <p>
                Through our globally recognized premium line, Luxurious Decorations (LD16, LD8 & LD3), we deliver high-performance wall finishes crafted for modern luxury interiors.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white border border-slate-100 rounded-sm">
                <p className="text-4xl font-black text-slate-900 mb-2">357+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clients Served</p>
              </div>
              <div className="p-6 bg-white border border-slate-100 rounded-sm">
                <p className="text-4xl font-black text-slate-900 mb-2">2019</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Established</p>
              </div>
            </div>
          </div>
          <div className="relative reveal">
            <img 
              src="https://images.unsplash.com/photo-1615876234886-fd9a39faa97f?auto=format&fit=crop&q=80&w=1200" 
              alt="WallFeel Luxury Decor" 
              className="w-full aspect-square object-cover rounded-sm shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-8 -left-8 p-8 bg-slate-900 text-white max-w-xs hidden md:block">
              <p className="text-xs font-black uppercase tracking-widest text-lime-500 mb-2">Our Mission</p>
              <p className="text-sm font-medium leading-relaxed italic">
                "We engineer statement environments that elevate brands and enhance lifestyles."
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* PREMIUM WALL COVERINGS */}
      <SectionWrapper bg="white" className="py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-16 reveal">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Premium Wall Coverings Built to Perform</h2>
          <p className="text-lg text-slate-600 font-medium">
            Our signature Premium Fabric Matte Finish is expertly manufactured in a state-of-the-art production facility to meet the highest global quality standards.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 reveal">
          {[
            { icon: <Zap className="w-6 h-6" />, title: "Tear-resistant" },
            { icon: <ShieldCheck className="w-6 h-6" />, title: "Fire-retardant" },
            { icon: <CheckCircle2 className="w-6 h-6" />, title: "Stain-resistant" },
            { icon: <Leaf className="w-6 h-6" />, title: "Water-resistant" },
            { icon: <LayoutGrid className="w-6 h-6" />, title: "Fully customizable" },
            { icon: <Target className="w-6 h-6" />, title: "Durable & Long-lasting" }
          ].map((item, idx) => (
            <div key={idx} className="p-8 bg-slate-50 border border-slate-100 rounded-sm flex items-center gap-4 group hover:bg-slate-900 hover:text-white transition-all duration-500">
              <div className="text-lime-500 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <p className="font-black uppercase tracking-widest text-[10px]">{item.title}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 p-12 bg-slate-900 text-white text-center rounded-sm reveal">
          <p className="text-2xl font-black uppercase tracking-tighter mb-4">When durability meets design, your walls become assets not just surfaces.</p>
          <p className="text-slate-400 font-medium">Ideal for luxury homes, upscale apartments, hotels, restaurants, lounges, corporate offices, airports, hospitals, schools, and commercial developments.</p>
        </div>
      </SectionWrapper>

      {/* MATERIAL INFORMATION */}
      <SectionWrapper bg="light" className="py-20">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16 reveal">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Material Information</h2>
          <div className="h-1 w-24 bg-lime-500 mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 reveal">
          {/* Peel & Stick */}
          <div className="bg-white p-8 border border-slate-100 rounded-sm space-y-6 flex flex-col h-full">
            <div className="space-y-2">
              <p className="text-xs font-black text-lime-600 uppercase tracking-widest">Option 01</p>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Peel & Stick</h3>
            </div>
            <ul className="space-y-3 flex-1">
              {[
                "PVC-free vinyl material",
                "Smooth matte finish",
                "Waterproof surface",
                "Stain resistant and easy to clean",
                "Marker-friendly surface",
                "Fire retardant for added safety",
                "Renter-friendly solution",
                "Removes easily without leaving marks",
                "Scratch resistant and fade-resistant in sunlight",
                "Environmentally friendly",
                "Not suitable for textured walls"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-slate-600 font-medium">
                  <div className="mt-1 w-1.5 h-1.5 bg-lime-500 rounded-full flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Matte */}
          <div className="bg-white p-8 border border-slate-100 rounded-sm space-y-6 flex flex-col h-full">
            <div className="space-y-2">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Option 02</p>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Premium Matte</h3>
            </div>
            <ul className="space-y-3 flex-1">
              {[
                "Installed using wallpaper paste",
                "Lightweight, thin fabric material",
                "Smooth matte surface finish",
                "Waterproof and long-lasting",
                "Tear and stain resistant",
                "Fire retardant for enhanced safety",
                "Suitable for high-traffic areas and bathrooms",
                "Scratch resistant and fade-resistant in sunlight",
                "Environmentally friendly materials"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-slate-600 font-medium">
                  <div className="mt-1 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Textured 3D */}
          <div className="bg-white p-8 border border-slate-100 rounded-sm space-y-6 flex flex-col h-full">
            <div className="space-y-2">
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Option 03</p>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Premium Textured 3D</h3>
            </div>
            <ul className="space-y-3 flex-1">
              {[
                "Installed using wallpaper paste",
                "Easy and seamless installation",
                "Heavy, thick fabric construction",
                "Deeply textured matte finish",
                "Highly realistic 3D visual effects",
                "Waterproof for added durability",
                "Tear, stain, and scratch resistant",
                "Fire retardant for safety compliance",
                "Suitable for smooth and lightly textured walls",
                "Ideal for high-traffic areas and bathrooms",
                "Fade-resistant, even in direct sunlight",
                "Environmentally friendly materials",
                "Trusted by interior designers"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-slate-600 font-medium">
                  <div className="mt-1 w-1.5 h-1.5 bg-slate-900 rounded-full flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionWrapper>

      {/* SUSTAINABLE LUXURY */}
      <SectionWrapper bg="dark" className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-lime-500/5 -z-10"></div>
        <div className="max-w-4xl mx-auto space-y-8 reveal">
          <Leaf className="w-12 h-12 text-lime-500 mx-auto" />
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Sustainable Luxury Wall Solutions</h2>
          <p className="text-xl text-slate-400 font-medium leading-relaxed">
            At WallFeel, innovation includes responsibility. We use eco-conscious, fully biodegradable materials, allowing you to upgrade your interiors while supporting sustainable building practices.
          </p>
          <p className="text-2xl font-black text-lime-500 uppercase tracking-widest italic">Luxury should be bold and responsible.</p>
        </div>
      </SectionWrapper>

      {/* WHY CHOOSE WALLFEEL */}
      <SectionWrapper bg="white" className="py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 reveal">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Why Choose WallFeel?</h2>
            <ul className="space-y-4">
              {[
                "Industry-leading premium wall finishes",
                "Custom design capabilities",
                "High-performance materials",
                "Sustainable production standards",
                "Proven track record across residential and commercial sectors",
                "Expert consultation and project support"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 p-4 border border-slate-50 hover:border-lime-500 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-lime-500" />
                  <span className="font-black uppercase tracking-widest text-[10px] text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-12 bg-slate-50 border border-slate-100 rounded-sm space-y-8 reveal">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Let’s Transform Your Walls</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Your walls are powerful branding tools. They shape perception, influence experience, and define atmosphere.
            </p>
            <div className="space-y-2">
              <p className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Be bold. Get noticed.</p>
              <p className="text-5xl font-black text-lime-600 uppercase tracking-tighter">Feel the Wall.</p>
            </div>
            <button 
              onClick={() => window.location.hash = '#contact'}
              className="w-full py-6 bg-slate-900 text-white font-black uppercase tracking-widest rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all shadow-2xl"
            >
              Request a Consultation
            </button>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default WallfeelPage;
