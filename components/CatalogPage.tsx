import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Image, ArrowLeft, Download, Play, Film } from 'lucide-react';

const CATALOG_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
    title: "Modern Minimalist Living",
    category: "Interior Design"
  },
  {
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200",
    title: "Luxury Suite Decor",
    category: "Hospitality"
  },
  {
    url: "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&q=80&w=1200",
    title: "8D Mural Concept - Nature",
    category: "Wallpapers"
  },
  {
    url: "https://images.unsplash.com/photo-1615876234886-fd9a39faa97f?auto=format&fit=crop&q=80&w=1200",
    title: "Classic Elegance",
    category: "Residential"
  },
  {
    url: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=1200",
    title: "Contemporary Office Space",
    category: "Commercial"
  },
  {
    url: "https://images.unsplash.com/photo-1617806118233-18e1ff208fa0?auto=format&fit=crop&q=80&w=1200",
    title: "8D Mural Concept - Abstract",
    category: "Wallpapers"
  },
  {
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200",
    title: "Scandinavian Kitchen",
    category: "Interior Design"
  },
  {
    url: "https://images.unsplash.com/photo-1600607687940-467f5b637a61?auto=format&fit=crop&q=80&w=1200",
    title: "Zen Master Bedroom",
    category: "Residential"
  },
  {
    url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200",
    title: "Urban Loft Concept",
    category: "Commercial"
  },
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
    title: "Art Deco Revival",
    category: "Interior Design"
  },
  {
    url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=1200",
    title: "Coastal Retreat",
    category: "Hospitality"
  },
  {
    url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200",
    title: "Industrial Chic Office",
    category: "Commercial"
  },
  {
    url: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=1200",
    title: "Bohemian Living Room",
    category: "Residential"
  },
  {
    url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=1200",
    title: "Marble Luxe Bathroom",
    category: "Hospitality"
  },
  {
    url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=1200",
    title: "Smart Home Integration",
    category: "Technology"
  },
  {
    url: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&q=80&w=1200",
    title: "Penthouse Terrace",
    category: "Real Estate"
  },
  {
    url: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&q=80&w=1200",
    title: "Boutique Hotel Lobby",
    category: "Hospitality"
  },
  {
    url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200",
    title: "Minimalist Workspace",
    category: "Commercial"
  },
  {
    url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200",
    title: "8D Mural - Geometric",
    category: "Wallpapers"
  },
  {
    url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=1200",
    title: "Luxury Estate Entrance",
    category: "Real Estate"
  }
];

const CATALOG_VIDEOS = [
  {
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
    title: "8D Mural Installation Process",
    duration: "2:45",
    category: "Tutorial"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1600607687940-467f5b637a61?auto=format&fit=crop&q=80&w=800",
    title: "Luxury Villa Walkthrough",
    duration: "5:12",
    category: "Showcase"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
    title: "Interior Design Trends 2026",
    duration: "3:30",
    category: "Insights"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
    title: "Behind the Scenes: Studio AMG",
    duration: "4:15",
    category: "Production"
  }
];

interface CatalogPageProps {
  onBack: () => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ onBack }) => {
  return (
    <div className="pt-24 min-h-screen bg-white">
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
              Luxurious <span className="text-shine">Catalog.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl">
              Explore our premium collection of 20+ interior decorations, real estate ventures, and transformative 8D Mural Wallpapers.
            </p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all flex items-center gap-2">
               <Download className="w-4 h-4" /> Download PDF
             </button>
          </div>
        </div>
      </SectionWrapper>

      {/* IMAGE GALLERY */}
      <SectionWrapper bg="light" className="py-20">
        <div className="flex items-center gap-4 mb-12">
          <Image className="w-5 h-5 text-lime-500" />
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Visual Collection</h2>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {CATALOG_IMAGES.map((img, idx) => (
            <div key={idx} className="group relative aspect-[4/5] overflow-hidden bg-slate-200 reveal">
              <img 
                src={img.url} 
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-all duration-500 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100">
                <p className="text-[10px] font-black text-lime-500 uppercase tracking-widest mb-2">{img.category}</p>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">{img.title}</h3>
                <div className="mt-6 h-[2px] w-0 group-hover:w-full bg-lime-500 transition-all duration-700 delay-100"></div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* VIDEO SECTION */}
      <SectionWrapper bg="white" className="py-20">
        <div className="flex items-center gap-4 mb-12">
          <Film className="w-5 h-5 text-blue-600" />
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Cinematic Showcases</h2>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATALOG_VIDEOS.map((video, idx) => (
            <div key={idx} className="group relative aspect-video overflow-hidden bg-slate-900 rounded-sm reveal">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-lime-500 group-hover:border-lime-500 transition-all duration-500">
                  <Play className="w-6 h-6 text-white group-hover:text-slate-950 fill-current" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900 to-transparent">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-lime-500 uppercase tracking-widest mb-2">{video.category}</p>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{video.title}</h3>
                  </div>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{video.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper bg="dark" className="py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-8 reveal">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <Image className="w-8 h-8 text-slate-300" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Request Custom Design</h2>
          <p className="text-slate-500 font-medium">
            Interested in a bespoke 8D Mural or a full interior consultation? Our team is ready to bring your vision to life.
          </p>
          <button 
            onClick={() => window.location.hash = '#contact'}
            className="px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all"
          >
            Start a Project
          </button>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default CatalogPage;
