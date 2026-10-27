import React, { useState, useEffect } from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  Calendar, 
  ArrowRight, 
  ChevronLeft, 
  X, 
  Share2, 
  Globe, 
  Mail, 
  MessageCircle, 
  Copy, 
  Check, 
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Clock,
  Eye,
  Search,
  Filter,
  Star,
  User,
  BookOpen
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { blogService, BlogPost } from '../services/blogService';

const NewsPage: React.FC = () => {
  const { getSection } = useContent();
  const section = getSection('news_page');
  const badge = section?.badge || "Intellectual Capital";
  const title = section?.title || "News & Strategic Insights";
  const subtitle = section?.subtitle || "Briefings, Thought Leadership & Press Releases";
  const content = section?.content || "Stay informed with analysis from AMG partners on international market dynamics, regulatory compliance, generative AI governance, and creator economy trends.";

  // Dynamic Blog State
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [featuredArticle, setFeaturedArticle] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Selected Article for Reading Modal
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch dynamic articles strictly from the blog backend API
  const loadBlogArticles = async () => {
    setLoading(true);
    try {
      const res = await blogService.getArticles({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery || undefined
      });

      if (res.success && Array.isArray(res.articles)) {
        setArticles(res.articles);
        setFeaturedArticle(res.featured || (res.articles.find((a: any) => a.isFeatured) ?? null));
        
        // Dynamically compute categories from actual returned articles and backend list
        const apiCategories = res.categories || [];
        const articleCategories = res.articles.map((a: any) => a.category).filter(Boolean);
        const combined = Array.from(new Set([...apiCategories, ...articleCategories]));
        setCategories(combined.length > 0 ? ['All', ...combined] : ['All']);
      } else {
        setArticles([]);
        setFeaturedArticle(null);
        setCategories(['All']);
      }
    } catch (err) {
      console.error('Failed to load blog articles:', err);
      setArticles([]);
      setFeaturedArticle(null);
      setCategories(['All']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogArticles();
  }, [selectedCategory, searchQuery]);

  // Check URL parameter for direct article linking (e.g. #news-page?article=slug)
  useEffect(() => {
    const checkDeepLink = async () => {
      const hash = window.location.hash;
      if (hash.includes('article=')) {
        const slug = hash.split('article=')[1]?.split('&')[0];
        if (slug) {
          const res = await blogService.getArticleBySlug(slug);
          if (res.success && res.article) {
            setSelectedNews(res.article);
          }
        }
      }
    };
    checkDeepLink();
  }, []);

  const getValidUrl = () => {
    try {
      const currentUrl = window.location.href;
      if (currentUrl.startsWith('blob:') || !currentUrl.startsWith('http')) {
        return window.location.origin;
      }
      return new URL(currentUrl).href;
    } catch {
      return window.location.origin;
    }
  };

  const handleNativeShare = async () => {
    if (!selectedNews) return;
    
    const shareUrl = getValidUrl();
    const shareData = {
      title: selectedNews.title,
      text: selectedNews.excerpt || selectedNews.summary,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
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
        copyToClipboard();
        window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');
        return;
      case 'Email':
        shareUrl = `mailto:?subject=${encodedText}&body=Check out this article from Azariah Management Group: ${encodedUrl}`;
        break;
      default:
        return;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDisplayDate = (dStr?: string) => {
    if (!dStr) return '';
    try {
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return dStr;
      return d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dStr;
    }
  };

  return (
    <div className="pt-24 pb-20">
      {/* =====================================================================
          HERO BANNER
      ===================================================================== */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-16">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-10" />
        <div className="max-w-4xl space-y-6 reveal active">
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100">
              <Globe className="w-4 h-4 text-lime-600" /> {badge}
            </div>
          )}
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none text-shine">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm md:text-base font-black uppercase tracking-widest text-lime-600">
              {subtitle}
            </p>
          )}
          {content && (
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-lime-500 pl-6 max-w-2xl">
              {content}
            </p>
          )}
        </div>
      </SectionWrapper>

      {/* =====================================================================
          SEARCH & CATEGORIES FILTER BAR
      ===================================================================== */}
      {(categories.length > 1 || articles.length > 0 || searchQuery) && (
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            {/* Category Tabs */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-sm transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search articles & press..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-900 font-medium focus:outline-none focus:border-slate-900 transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          FEATURED HERO ARTICLE HIGHLIGHT (IF AVAILABLE)
      ===================================================================== */}
      {featuredArticle && selectedCategory === 'All' && !searchQuery && (
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-16">
          <div
            onClick={() => setSelectedNews(featuredArticle)}
            className="group cursor-pointer bg-slate-900 rounded-sm overflow-hidden grid lg:grid-cols-12 shadow-2xl hover:shadow-lime-500/10 transition-all border border-slate-800"
          >
            {featuredArticle.coverImage && (
              <div className="lg:col-span-7 aspect-video lg:aspect-auto overflow-hidden relative">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1 bg-lime-500 text-slate-950 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-slate-950" /> Featured Story
                  </span>
                </div>
              </div>
            )}

            <div className={`${featuredArticle.coverImage ? 'lg:col-span-5' : 'lg:col-span-12'} p-8 md:p-12 flex flex-col justify-between text-white space-y-6`}>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  {featuredArticle.category && (
                    <span className="text-lime-400 font-bold uppercase">{featuredArticle.category}</span>
                  )}
                  {featuredArticle.readTimeMinutes && (
                    <>
                      <span>•</span>
                      <span>{featuredArticle.readTimeMinutes} min read</span>
                    </>
                  )}
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight group-hover:text-lime-400 transition-colors leading-tight">
                  {featuredArticle.title}
                </h2>
                {featuredArticle.excerpt && (
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 font-medium">
                    {featuredArticle.excerpt}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-black uppercase tracking-wider text-lime-400 group-hover:gap-2 transition-all">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4 text-lime-400 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ARTICLES GRID
      ===================================================================== */}
      <SectionWrapper bg="light" className="py-12">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-slate-900 border-t-lime-500 rounded-full animate-spin mx-auto" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Loading articles & intelligence...
            </p>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-24 text-center bg-white border border-slate-200 rounded-sm p-12 max-w-xl mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-black uppercase text-slate-900">No articles published yet</h3>
            <p className="text-xs text-slate-500">
              Articles and news published from the Admin Blog Manager will appear here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((item) => (
              <div 
                key={item.id} 
                className="reveal active bg-white border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                onClick={() => setSelectedNews(item)}
              >
                {item.coverImage ? (
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={item.coverImage} 
                      alt={item.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                    />
                    {item.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest">
                          {item.category}
                        </span>
                      </div>
                    )}
                    {Boolean(item.isFeatured) && (
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-lime-500 text-slate-950 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-slate-950" /> Featured
                        </span>
                      </div>
                    )}
                  </div>
                ) : item.category ? (
                  <div className="p-6 pb-0 flex items-center justify-between">
                    <span className="px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest">
                      {item.category}
                    </span>
                    {Boolean(item.isFeatured) && (
                      <span className="px-2 py-1 bg-lime-500 text-slate-950 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-slate-950" /> Featured
                      </span>
                    )}
                  </div>
                ) : null}

                <div className="p-8 flex-1 flex flex-col space-y-4">
                  {(item.publishedAt || item.readTimeMinutes) && (
                    <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {item.publishedAt && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" /> {formatDisplayDate(item.publishedAt)}
                        </div>
                      )}
                      {item.publishedAt && item.readTimeMinutes && <span>•</span>}
                      {item.readTimeMinutes && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> {item.readTimeMinutes} min read
                        </div>
                      )}
                    </div>
                  )}

                  <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  {item.excerpt && (
                    <p className="text-slate-500 text-sm font-medium leading-relaxed flex-1 line-clamp-3">
                      {item.excerpt}
                    </p>
                  )}

                  <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest group-hover:gap-4 transition-all">
                      Read Article <ArrowRight className="w-4 h-4 text-lime-500" />
                    </div>
                    {item.views > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {item.views}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionWrapper>

      {/* =====================================================================
          ARTICLE READER OVERLAY / MODAL
      ===================================================================== */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-500 overflow-hidden">
          {/* Header Action Bar */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-5 md:px-12 flex justify-between items-center z-50">
            <button 
              onClick={() => setSelectedNews(null)}
              className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-950 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Blog & News
            </button>
            <div className="flex items-center gap-3">
               <button 
                 onClick={handleNativeShare}
                 className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-sm text-xs font-black uppercase tracking-wider hover:bg-lime-500 hover:text-slate-950 transition-colors"
                 title="Quick Share"
               >
                 <Share2 className="w-4 h-4" /> Share
               </button>
               <button 
                 onClick={() => setSelectedNews(null)}
                 className="p-2 text-slate-400 hover:text-slate-950 transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>
          </div>

          {/* Reader Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12">
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    {selectedNews.category && (
                      <span className="px-4 py-1.5 bg-lime-500 text-slate-950 text-[10px] font-black uppercase tracking-widest">
                        {selectedNews.category}
                      </span>
                    )}
                    {selectedNews.readTimeMinutes && (
                      <span className="text-xs text-slate-400 font-mono">
                        {selectedNews.readTimeMinutes} min read
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                    {selectedNews.title}
                  </h1>

                  {/* Author Byline */}
                  {(selectedNews.author || selectedNews.publishedAt) && (
                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-8">
                      {selectedNews.author && (
                        <div className="flex items-center gap-3 text-slate-700">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-lime-400 flex items-center justify-center font-bold">
                            {selectedNews.author.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-slate-900">{selectedNews.author}</div>
                            {selectedNews.authorRole && (
                              <div className="text-[10px] text-slate-400">{selectedNews.authorRole}</div>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedNews.publishedAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Published {formatDisplayDate(selectedNews.publishedAt)}
                        </div>
                      )}
                    </div>
                  )}
               </div>

               {/* Cover Image */}
               {selectedNews.coverImage && (
                 <div className="aspect-video bg-slate-100 overflow-hidden shadow-2xl rounded-sm">
                    <img 
                      src={selectedNews.coverImage} 
                      className="w-full h-full object-cover" 
                      alt={selectedNews.title} 
                    />
                 </div>
               )}

               {/* Formatted Content */}
               <div className="space-y-6">
                  {typeof selectedNews.content === 'string' && selectedNews.content.includes('<') ? (
                    <div 
                      className="prose prose-slate prose-xl max-w-none text-slate-800 leading-relaxed font-medium
                        [&>h1]:text-3xl [&>h1]:font-black [&>h1]:text-slate-900 [&>h1]:mt-10 [&>h1]:mb-4
                        [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:mt-8 [&>h2]:mb-3
                        [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-blue-600 [&>h3]:mt-6 [&>h3]:mb-2
                        [&>p]:text-xl [&>p]:md:text-2xl [&>p]:text-slate-700 [&>p]:leading-relaxed [&>p]:mb-6
                        [&>blockquote]:border-l-4 [&>blockquote]:border-lime-500 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&>blockquote]:bg-slate-50 [&>blockquote]:py-4 [&>blockquote]:my-8
                        [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:space-y-3 [&>ul]:text-lg
                        [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:space-y-3 [&>ol]:text-lg
                        [&>figure]:my-10 [&>figure>img]:rounded-xl [&>figure>img]:shadow-2xl [&>figure>figcaption]:text-xs [&>figure>figcaption]:text-slate-500 [&>figure>figcaption]:mt-2"
                      dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                    />
                  ) : Array.isArray(selectedNews.content) ? (
                    <div className="space-y-8 prose prose-slate prose-lg max-w-none">
                      {selectedNews.content.map((p: string, i: number) => (
                        <p key={i} className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                          {p}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                      {selectedNews.content}
                    </p>
                  )}
               </div>

               {/* Share & Distribution Footer */}
               <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row gap-12 items-center justify-between">
                  <div className="space-y-10 w-full md:w-auto">
                    <div className="space-y-2">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Share this insight</h4>
                       <p className="text-[10px] text-slate-500 font-bold uppercase">Distribute to your professional network</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                       <button 
                         onClick={handleNativeShare}
                         className="flex items-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all group shadow-xl"
                       >
                         <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                         <span className="text-xs font-black uppercase tracking-widest">One-Click Share</span>
                       </button>

                       <button 
                         onClick={copyToClipboard}
                         className={`flex items-center gap-3 px-8 py-5 border-2 transition-all rounded-sm font-black uppercase tracking-widest text-xs ${
                           copied 
                           ? 'bg-lime-500 border-lime-500 text-slate-950' 
                           : 'border-slate-200 text-slate-900 hover:border-slate-900'
                         }`}
                       >
                         {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                         <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                       </button>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-50">
                       <button onClick={() => handleManualShare('Linkedin')} title="LinkedIn" className="flex flex-col items-center gap-2 group">
                         <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-[#0077B5] group-hover:text-white transition-all rounded-full shadow-sm">
                           <Linkedin className="w-5 h-5" />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">LinkedIn</span>
                       </button>

                       <button onClick={() => handleManualShare('Twitter')} title="Twitter / X" className="flex flex-col items-center gap-2 group">
                         <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all rounded-full shadow-sm">
                           <Twitter className="w-5 h-5" />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">X</span>
                       </button>

                       <button onClick={() => handleManualShare('Facebook')} title="Facebook" className="flex flex-col items-center gap-2 group">
                         <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-[#1877F2] group-hover:text-white transition-all rounded-full shadow-sm">
                           <Facebook className="w-5 h-5" />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">Facebook</span>
                       </button>

                       <button onClick={() => handleManualShare('Instagram')} title="Instagram" className="flex flex-col items-center gap-2 group">
                         <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] group-hover:text-white transition-all rounded-full shadow-sm">
                           <Instagram className="w-5 h-5" />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">Instagram</span>
                       </button>

                       <button onClick={() => handleManualShare('WhatsApp')} title="WhatsApp" className="flex flex-col items-center gap-2 group">
                         <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-[#25D366] group-hover:text-white transition-all rounded-full shadow-sm">
                           <MessageCircle className="w-5 h-5" />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">WhatsApp</span>
                       </button>

                       <button onClick={() => handleManualShare('Email')} title="Email" className="flex flex-col items-center gap-2 group">
                         <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-[#D44638] group-hover:text-white transition-all rounded-full shadow-sm">
                           <Mail className="w-5 h-5" />
                         </div>
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">Email</span>
                       </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 border border-slate-100 rounded-sm max-w-sm">
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Azariah Management Group</p>
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Strategic intelligence powered by AMG Executive Editorial</p>
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