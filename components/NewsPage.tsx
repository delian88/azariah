import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { NEWS_ITEMS } from '../constants';
import { Calendar, Tag, ArrowRight, ChevronLeft, X, Share2, Globe, Sparkles } from 'lucide-react';

const NewsPage: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  const handleShare = (platform: string) => {
    if (!selectedNews) return;
    
    const url = window.location.href;
    const text = encodeURIComponent(selectedNews.title);
    const encodedUrl = encodeURIComponent(url);

    let shareUrl = '';
    switch (platform) {
      case 'Linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`;
        break;
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pt-24">
      {/* HERO SECTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-10"></div>
        <div className="max-w-4xl space-y-8 reveal active">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100">
            <Globe className="w-4 h-4" /> Global Intelligence
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none text-shine">
            News & Press.
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-lime-500 pl-6 max-w-2xl">
            Stay informed with the latest organizational updates, industry insights, and impact reports from Azariah Management Group.
          </p>
        </div>
      </SectionWrapper>

      {/* NEWS GRID */}
      <SectionWrapper bg="light" className="py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEWS_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="reveal active bg-white border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-all duration-500 group cursor-pointer"
              onClick={() => setSelectedNews(item)}
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col space-y-4">
                <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed flex-1">
                  {item.summary}
                </p>
                <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest group-hover:gap-4 transition-all">
                  Read Article <ArrowRight className="w-4 h-4 text-lime-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ARTICLE OVERLAY */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-500 overflow-hidden">
          <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-6 md:px-12 flex justify-between items-center z-50">
            <button 
              onClick={() => setSelectedNews(null)}
              className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to News
            </button>
            <div className="flex items-center gap-4">
               <button 
                 onClick={() => handleShare('Twitter')}
                 className="p-2 text-slate-400 hover:text-slate-950 transition-colors"
                 title="Share on X"
               >
                 <Share2 className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => setSelectedNews(null)}
                 className="p-2 text-slate-400 hover:text-slate-950 transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12">
               <div className="space-y-6">
                  <span className="px-4 py-1.5 bg-lime-500 text-slate-950 text-[10px] font-black uppercase tracking-widest">
                    {selectedNews.category}
                  </span>
                  <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                    {selectedNews.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-8">
                    <Calendar className="w-4 h-4" /> Published {selectedNews.date}
                  </div>
               </div>

               <div className="aspect-video bg-slate-100 overflow-hidden shadow-2xl">
                  <img src={selectedNews.image} className="w-full h-full object-cover" alt="" />
               </div>

               <div className="space-y-8 prose prose-slate prose-lg max-w-none">
                  {selectedNews.content.map((p: string, i: number) => (
                    <p key={i} className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium">
                      {p}
                    </p>
                  ))}
               </div>

               <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row gap-12 items-center justify-between">
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Share on social media</h4>
                    <div className="flex gap-4">
                       {['Linkedin', 'Twitter', 'Facebook'].map(s => (
                         <button 
                           key={s} 
                           onClick={() => handleShare(s)}
                           className="text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors"
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <Sparkles className="w-8 h-8 text-lime-500" />
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest max-w-[200px]">Strategic insight powered by Azariah Management Group</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;