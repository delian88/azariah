import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { NEWS_ITEMS } from '../constants';
import { 
  Calendar, 
  ArrowRight, 
  ChevronLeft, 
  X, 
  Share2, 
  Globe, 
  Sparkles, 
  Mail, 
  MessageCircle, 
  Copy, 
  Check, 
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ExternalLink
} from 'lucide-react';

const NewsPage: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const getValidUrl = () => {
    try {
      // Ensure we have a valid, absolute URL for sharing
      // Some browsers/OS reject localhost or non-https URLs in navigator.share
      const currentUrl = window.location.href;
      return new URL(currentUrl).href;
    } catch (e) {
      return window.location.origin + window.location.pathname + window.location.hash;
    }
  };

  const handleNativeShare = async () => {
    if (!selectedNews) return;
    
    const shareUrl = getValidUrl();
    const shareData = {
      title: selectedNews.title,
      text: selectedNews.summary,
      url: shareUrl,
    };

    // Robust check for share capability
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Handle cancellation or errors gracefully
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
          copyToClipboard();
        }
      }
    } else {
      // Fallback to manual copy if navigator.share is not supported
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const url = getValidUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualShare = (platform: string) => {
    if (!selectedNews) return;
    
    const url = getValidUrl();
    const text = selectedNews.title;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    let shareUrl = '';
    switch (platform) {
      case 'Linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'WhatsApp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'Instagram':
        // Instagram doesn't support direct URL sharing via web intent.
        // We copy the link for them and notify.
        copyToClipboard();
        alert("Link copied! You can now paste it in your Instagram story or bio.");
        return;
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
                 onClick={handleNativeShare}
                 className="p-2 text-slate-400 hover:text-slate-950 transition-colors"
                 title="One-click share"
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
                    <p key={i} className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                      {p}
                    </p>
                  ))}
               </div>

               <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row gap-12 items-center justify-between">
                  <div className="space-y-8 w-full md:w-auto">
                    <div className="space-y-2">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Share on social media</h4>
                       <p className="text-[10px] text-slate-500 font-bold uppercase">Click to share this article with your network</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                       {/* PRIMARY ONE-CLICK SHARE */}
                       <button 
                         onClick={handleNativeShare}
                         className="flex items-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all group shadow-xl"
                       >
                         <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                         <span className="text-xs font-black uppercase tracking-widest">One-Click Share</span>
                       </button>

                       {/* COPY LINK */}
                       <button 
                         onClick={copyToClipboard}
                         className={`flex items-center gap-3 px-8 py-5 border-2 transition-all rounded-sm font-black uppercase tracking-widest text-xs ${
                           copied 
                           ? 'bg-lime-500 border-lime-500 text-slate-950' 
                           : 'border-slate-200 text-slate-900 hover:border-slate-900'
                         }`}
                       >
                         {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                         <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                       </button>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-50">
                       <button onClick={() => handleManualShare('Linkedin')} title="Share on LinkedIn" className="flex flex-col items-center gap-2 group">
                         <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all rounded-full shadow-sm">
                           <Linkedin className="w-5 h-5" />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">LinkedIn</span>
                       </button>

                       <button onClick={() => handleManualShare('Twitter')} title="Share on X / Twitter" className="flex flex-col items-center gap-2 group">
                         <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all rounded-full shadow-sm">
                           <Twitter className="w-5 h-5" />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">X</span>
                       </button>

                       <button onClick={() => handleManualShare('Facebook')} title="Share on Facebook" className="flex flex-col items-center gap-2 group">
                         <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-blue-800 group-hover:text-white transition-all rounded-full shadow-sm">
                           <Facebook className="w-5 h-5" />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">Facebook</span>
                       </button>

                       <button onClick={() => handleManualShare('Instagram')} title="Share to Instagram" className="flex flex-col items-center gap-2 group">
                         <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 group-hover:text-white transition-all rounded-full shadow-sm">
                           <Instagram className="w-5 h-5" />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">Instagram</span>
                       </button>

                       <button onClick={() => handleManualShare('WhatsApp')} title="Share on WhatsApp" className="flex flex-col items-center gap-2 group">
                         <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-green-600 group-hover:text-white transition-all rounded-full shadow-sm">
                           <MessageCircle className="w-5 h-5" />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">WhatsApp</span>
                       </button>

                       <button onClick={() => handleManualShare('Email')} title="Share via Email" className="flex flex-col items-center gap-2 group">
                         <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all rounded-full shadow-sm">
                           <Mail className="w-5 h-5" />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">Email</span>
                       </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 p-6 border border-slate-100 rounded-sm">
                     <Sparkles className="w-8 h-8 text-lime-500" />
                     <div>
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Azariah Management Group</p>
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Strategic insight powered by Azariah Management Group</p>
                     </div>
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