import React from 'react';
import SectionWrapper from './SectionWrapper';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface WallfeelPageProps {
  onBack: () => void;
}

const WallfeelPage: React.FC<WallfeelPageProps> = ({ onBack }) => {
  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* HEADER */}
      <SectionWrapper bg="white" className="pb-12 border-b border-slate-100">
        <div className="reveal active">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Partners
          </button>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none uppercase mb-6">
            WallFeel <span className="text-shine">Showcase.</span>
          </h1>
        </div>
      </SectionWrapper>

      {/* EDITORIAL CONTENT */}
      <SectionWrapper bg="white" className="py-20">
        <div className="max-w-3xl mx-auto space-y-16 reveal">
          
          {/* ABOUT */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter border-b-2 border-lime-500 pb-2 inline-block">
              About WallFeel – Redefining Luxury Wall Coverings Since 2019
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Founded in 2019, WallFeel is a leading provider of premium luxury wall coverings and custom interior wall solutions designed to transform residential and commercial spaces. We don’t just decorate walls we engineer statement environments that elevate brands, enhance lifestyles, and create unforgettable experiences.
            </p>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Through our globally recognized premium line, Luxurious Decorations (LD16, LD8 & LD3), we deliver high-performance wall finishes crafted for modern luxury interiors.
            </p>
          </div>

          {/* PREMIUM WALL COVERINGS */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter border-b-2 border-lime-500 pb-2 inline-block">
              Premium Wall Coverings Built to Perform
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Our signature Premium Fabric Matte Finish is expertly manufactured in a state-of-the-art production facility to meet the highest global quality standards. Unlike traditional wallpaper or standard wall panels, WallFeel coverings are:
            </p>
            <ul className="grid grid-cols-2 gap-4 text-slate-600 font-bold uppercase tracking-widest text-[10px]">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500" /> Tear-resistant</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500" /> Fire-retardant</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500" /> Stain-resistant</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500" /> Water-resistant</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500" /> Fully customizable</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500" /> Durable and long-lasting</li>
            </ul>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Our products are designed for both beauty and functionality making them ideal for luxury homes, upscale apartments, hotels, restaurants, lounges, corporate offices, airports, hospitals, schools, and commercial developments. When durability meets design, your walls become assets not just surfaces.
            </p>
          </div>

          {/* TRUSTED */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter border-b-2 border-lime-500 pb-2 inline-block">
              Trusted by Luxury Clients & Commercial Developers
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Since inception, we have proudly served over 357 clients, partnering with homeowners, interior designers, architects, developers, hospitality brands, and corporate institutions seeking distinctive, high-impact interiors.
            </p>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Every project is customized. Every installation is intentional. We collaborate closely with our clients to deliver tailored wall décor solutions that align with their brand identity, design vision, and performance requirements.
            </p>
          </div>

          {/* SUSTAINABLE */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter border-b-2 border-lime-500 pb-2 inline-block">
              Sustainable Luxury Wall Solutions
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              At WallFeel, innovation includes responsibility. We use eco-conscious, fully biodegradable materials, allowing you to upgrade your interiors while supporting sustainable building practices. Luxury should be bold and responsible.
            </p>
          </div>

          {/* WHY CHOOSE */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter border-b-2 border-lime-500 pb-2 inline-block">
              Why Choose WallFeel?
            </h2>
            <div className="space-y-4">
              {[
                "Industry-leading premium wall finishes",
                "Custom design capabilities",
                "High-performance materials",
                "Sustainable production standards",
                "Proven track record across residential and commercial sectors",
                "Expert consultation and project support"
              ].map((item, idx) => (
                <p key={idx} className="flex items-start gap-3 text-lg text-slate-600 font-medium leading-relaxed">
                  <span className="text-lime-500 font-black">•</span> {item}
                </p>
              ))}
            </div>
          </div>

          {/* TRANSFORM */}
          <div className="space-y-6 bg-slate-900 p-12 text-white rounded-sm">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Let’s Transform Your Walls</h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              Your walls are powerful branding tools. They shape perception, influence experience, and define atmosphere. Be bold. Get noticed. Feel the Wall.
            </p>
            <button 
              onClick={() => window.location.hash = '#contact'}
              className="px-8 py-4 bg-lime-500 text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-white transition-colors"
            >
              Contact us today for a consultation
            </button>
          </div>

          {/* MATERIAL INFORMATION */}
          <div className="pt-20 space-y-12">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter text-center">Material Information</h2>
            
            {/* 1. Peel & Stick */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-lime-500 pl-4">1. Peel & Stick</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Our Peel & Stick solution is crafted from PVC-free vinyl material with a smooth matte finish. It features a waterproof surface that is stain resistant and easy to clean, even with markers. This fire retardant, renter-friendly solution removes easily without leaving marks. It is scratch resistant and fade-resistant in sunlight, making it an environmentally friendly choice, though it is not suitable for textured walls.
              </p>
            </div>

            {/* 2. Premium Matte */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4">2. Premium Matte</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Installed using wallpaper paste, the Premium Matte is a lightweight, thin fabric material with a smooth matte surface finish. It is waterproof, long-lasting, and both tear and stain resistant. This fire retardant material is designed for enhanced safety and is suitable for high-traffic areas and bathrooms. It remains scratch resistant and fade-resistant in sunlight using environmentally friendly materials.
              </p>
            </div>

            {/* 3. Premium Textured 3D */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4">3. Premium Textured 3D</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                The Premium Textured 3D option is installed using wallpaper paste and offers an easy, seamless installation. It features a heavy, thick fabric construction with a deeply textured matte finish for highly realistic 3D visual effects. Waterproof, tear-resistant, and scratch-resistant, it is fire retardant for safety compliance. Suitable for both smooth and lightly textured walls, it is ideal for high-traffic areas and bathrooms. It is fade-resistant in direct sunlight and crafted from environmentally friendly materials trusted by interior designers.
              </p>
            </div>
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};

export default WallfeelPage;
