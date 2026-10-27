import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
  Star,
  Calendar,
  Share2,
  ArrowLeft,
  Upload,
  Globe,
  Tag,
  Check,
  X,
  BookOpen,
  TrendingUp,
  User
} from 'lucide-react';
import { blogService, BlogPost, BlogMetrics } from '../../services/blogService';
import WordPressEditor from './WordPressEditor';

interface AdminBlogTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onViewLiveArticle?: (slug: string) => void;
}

const STANDARD_BLOG_CATEGORIES = [
  'Insights',
  'Strategic Advisory',
  'AI & Innovation',
  'Studio AMG',
  'Global Trade',
  'Press Release'
];

const HARDCODED_SAMPLE_SLUGS = [
  'studio-amg-partners-on-nolly-oh-festival-uk',
  'next-decade-strategic-ai-diaspora-capital'
];

export const AdminBlogTab: React.FC<AdminBlogTabProps> = ({ showToast, onViewLiveArticle }) => {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [metrics, setMetrics] = useState<BlogMetrics>({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [publishedAt, setPublishedAt] = useState('');

  // Preview Modal
  const [previewArticle, setPreviewArticle] = useState<BlogPost | null>(null);

  // Cover image upload
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Fetch articles
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await blogService.adminGetArticles({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        category: categoryFilter || undefined
      });

      if (res.success && res.articles) {
        // Filter out any legacy hardcoded sample/seed articles
        const cleanArticles = res.articles.filter(
          (a) =>
            !HARDCODED_SAMPLE_SLUGS.includes(a.slug) &&
            !a.title?.toLowerCase().includes('nolly oh!') &&
            !a.title?.toLowerCase().includes('strategic ai & diaspora capital')
        );
        setArticles(cleanArticles);

        // Recalculate metrics accurately based on clean real articles
        if (cleanArticles.length !== res.articles.length) {
          const publishedCount = cleanArticles.filter((a) => a.status === 'published').length;
          const draftCount = cleanArticles.filter((a) => a.status === 'draft').length;
          const totalViews = cleanArticles.reduce((sum, a) => sum + (Number(a.views) || 0), 0);
          setMetrics({
            total: cleanArticles.length,
            published: publishedCount,
            draft: draftCount,
            totalViews
          });
        } else if (res.metrics) {
          setMetrics(res.metrics);
        }

        if (res.categories) {
          setCategories(res.categories);
        }
      } else {
        setArticles([]);
        setMetrics({ total: 0, published: 0, draft: 0, totalViews: 0 });
        setCategories([]);
        if (res.error) {
          showToast(res.error, 'error');
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Network error fetching articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [searchTerm, statusFilter, categoryFilter]);

  // Open Creator for a New Article
  const handleCreateNew = () => {
    setEditingArticleId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setCategory('');
    setIsCustomCategory(false);
    setTags('');
    setAuthor('');
    setAuthorRole('');
    setStatus('published');
    setIsFeatured(false);
    setPublishedAt(new Date().toISOString().slice(0, 16));
    setIsEditing(true);
  };

  // Open Editor for an Existing Article
  const handleEdit = (art: BlogPost) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setSlug(art.slug);
    setExcerpt(art.excerpt || '');
    setContent(art.content || '');
    setCoverImage(art.coverImage || '');
    setCategory(art.category || '');
    setIsCustomCategory(Boolean(art.category && !STANDARD_BLOG_CATEGORIES.includes(art.category)));
    setTags(art.tags || '');
    setAuthor(art.author || '');
    setAuthorRole(art.authorRole || '');
    setStatus(art.status);
    setIsFeatured(Boolean(art.isFeatured));
    setPublishedAt(art.publishedAt ? art.publishedAt.slice(0, 16) : '');
    setIsEditing(true);
  };

  // Save / Update Article
  const handleSave = async (targetStatus?: 'published' | 'draft') => {
    if (!title.trim()) {
      showToast('Article title is required', 'error');
      return;
    }
    if (!content.trim()) {
      showToast('Article content cannot be empty', 'error');
      return;
    }

    setSaving(true);
    const finalStatus = targetStatus || status;

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: coverImage.trim() || null,
      category: category.trim(),
      tags: tags.trim() || null,
      author: author.trim() || undefined,
      authorRole: authorRole.trim() || undefined,
      status: finalStatus,
      isFeatured: isFeatured ? 1 : 0,
      publishedAt: publishedAt || undefined
    };

    try {
      let res;
      if (editingArticleId) {
        res = await blogService.adminUpdateArticle({ ...payload, id: editingArticleId });
      } else {
        res = await blogService.adminCreateArticle(payload);
      }

      if (res.success) {
        showToast(
          editingArticleId
            ? 'Article updated successfully!'
            : `Article "${payload.title}" published successfully!`
        );
        setIsEditing(false);
        fetchArticles();
      } else {
        showToast(res.error || 'Failed to save article', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving article', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    const res = await blogService.adminToggleStatus(id, nextStatus);
    if (res.success) {
      showToast(`Article status updated to ${nextStatus}`);
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
      );
      fetchArticles();
    } else {
      showToast(res.error || 'Failed to update status', 'error');
    }
  };

  // Quick Toggle Featured
  const handleToggleFeatured = async (id: number) => {
    const res = await blogService.adminToggleFeatured(id);
    if (res.success) {
      showToast(res.message || 'Featured status updated');
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isFeatured: res.isFeatured ? 1 : 0 } : a))
      );
    } else {
      showToast(res.error || 'Failed to update featured', 'error');
    }
  };

  // Delete Article
  const handleDelete = async (art: BlogPost) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${art.title}"?`)) {
      return;
    }
    const res = await blogService.adminDeleteArticle(art.id);
    if (res.success) {
      showToast('Article deleted successfully');
      setArticles((prev) => prev.filter((a) => a.id !== art.id));
      fetchArticles();
    } else {
      showToast(res.error || 'Failed to delete article', 'error');
    }
  };

  // Upload Cover Image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const res = await blogService.uploadImage(file);
      if (res.success && res.url) {
        setCoverImage(res.url);
        showToast('Cover photo uploaded successfully');
      } else {
        showToast(res.error || 'Cover photo upload failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error uploading cover photo', 'error');
    } finally {
      setUploadingCover(false);
    }
  };

  // ---------------------------------------------------------------------------
  // VIEW: EDITING / CREATING SCREEN (WordPress Style)
  // ---------------------------------------------------------------------------
  if (isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
              title="Return to Articles List"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-lime-500/10 text-lime-400 border border-lime-500/30">
                  {editingArticleId ? 'Editing Article' : 'New Article'}
                </span>
                <span className="text-xs text-slate-400 font-mono">WordPress Gutenberg Mode</span>
              </div>
              <h2 className="text-base font-black text-white mt-0.5 truncate max-w-xl">
                {title || 'Untitled Article'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                setPreviewArticle({
                  id: editingArticleId || 0,
                  title: title || 'Preview Article',
                  slug: slug || 'preview',
                  excerpt: excerpt || '',
                  content: content || '',
                  coverImage: coverImage || null,
                  category: category || '',
                  tags: tags || '',
                  author: author || '',
                  authorRole: authorRole || '',
                  status,
                  isFeatured: isFeatured ? 1 : 0,
                  readTimeMinutes: Math.max(1, Math.ceil(content.split(' ').length / 200)),
                  views: 0,
                  publishedAt: publishedAt || new Date().toISOString()
                })
              }
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" /> Preview
            </button>
            <button
              type="button"
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-lime-500/20 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />{' '}
                  {editingArticleId ? 'Update & Publish' : 'Publish Article'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2-Column WordPress Layout: Left = Main Canvas; Right = Document Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Editing Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title & Permalink Box */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Add Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-2xl sm:text-4xl font-black text-white placeholder-slate-600 focus:outline-none tracking-tight"
                />
              </div>

              {/* Permalink / Slug preview */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-950 px-3 py-2 rounded-xl border border-slate-800/80">
                <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="text-slate-500 truncate">azariahmg.com/#news-page?article=</span>
                <input
                  type="text"
                  placeholder="url-friendly-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-transparent text-sky-400 focus:outline-none font-bold underline flex-1"
                />
              </div>

              {/* Summary / Excerpt */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Article Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide a compelling 1-2 sentence lead summary to hook readers..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500 leading-relaxed"
                />
              </div>
            </div>

            {/* WordPress Visual & HTML Editor */}
            <WordPressEditor
              initialContent={content}
              onChange={(newHtml) => setContent(newHtml)}
              minHeight="460px"
              placeholder="Start drafting your article, add rich quotes, bold points, images, and videos..."
            />
          </div>

          {/* Right Document Settings Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Status & Visibility Box */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" /> Publishing Settings
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-semibold"
                >
                  <option value="published">Published (Live to public)</option>
                  <option value="draft">Draft (Private admin review)</option>
                  <option value="archived">Archived (Unlisted)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-lime-500 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Featured Showcase</span>
                    <span className="text-[10px] text-slate-400 block">Pin this story to the top of the blog and news grid</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Featured Cover Image Box */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-lime-400" /> Featured Cover Image
              </h3>

              <input
                type="file"
                ref={coverImageInputRef}
                onChange={handleCoverUpload}
                accept="image/*"
                className="hidden"
              />

              {coverImage ? (
                <div className="space-y-3">
                  <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative group">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-lg transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => coverImageInputRef.current?.click()}
                      disabled={uploadingCover}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" /> Replace Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => coverImageInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-lime-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40 group"
                >
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-lime-400 mx-auto mb-2 transition-colors" />
                  <p className="text-xs font-bold text-white">Click to upload cover photo</p>
                  <p className="text-[10px] text-slate-400 mt-1">Recommended: 16:9 ratio high-res image</p>
                  {uploadingCover && <p className="text-xs text-lime-400 font-bold mt-2 animate-pulse">Uploading...</p>}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Or Paste Image URL directly
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-lime-500 font-mono truncate"
                />
              </div>
            </div>

            {/* 3. Categories & Tags Box */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-400" /> Taxonomy & Metadata
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Category
                </label>
                <div className="space-y-2">
                  <select
                    value={isCustomCategory ? 'Custom' : category}
                    onChange={(e) => {
                      if (e.target.value === 'Custom') {
                        setIsCustomCategory(true);
                        setCategory('');
                      } else {
                        setIsCustomCategory(false);
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
                  >
                    <option value="">-- No Category / General --</option>
                    <option value="Insights">Global Insights</option>
                    <option value="Strategic Advisory">Strategic Advisory</option>
                    <option value="AI & Innovation">AI & Strategic Technology</option>
                    <option value="Studio AMG">Studio AMG & Media</option>
                    <option value="Global Trade">Trade & Capital Infrastructure</option>
                    <option value="Press Release">Official Press Release</option>
                    <option value="Custom">+ Custom Category...</option>
                  </select>
                  {isCustomCategory && (
                    <input
                      type="text"
                      placeholder="Type custom category name"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      autoFocus
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI, Nollywood, Finance, Capital"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* 4. Author & Credit Box */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" /> Author & Byline
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Author Role / Title
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. Executive Director, Head of Strategy"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW: ARTICLES DASHBOARD & DIRECTORY
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top Banner & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-lime-400" /> Blog & Editorial Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Publish articles, press releases, corporate insights, and multimedia stories with WordPress-grade editorial tools.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchArticles}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync
          </button>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-lime-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Write New Article
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Total Published</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{metrics.published}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Drafts In Review</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{metrics.draft}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Total Cumulative Views</span>
          <div className="text-2xl font-black text-sky-400 mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" /> {metrics.totalViews.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Total Articles</span>
          <div className="text-2xl font-black text-white mt-1">{metrics.total}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search articles by title, keywords or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-lime-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-lime-500"
          >
            <option value="">All Publication Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts Only</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-lime-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Story</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Author</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Stats</th>
                <th className="py-3.5 px-5">Published Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No articles found. Click <strong>Write New Article</strong> above to publish your first story!
                  </td>
                </tr>
              ) : (
                articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Story Title & Thumbnail */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5 max-w-md">
                        {art.coverImage ? (
                          <img
                            src={art.coverImage}
                            alt=""
                            className="w-14 h-10 object-cover rounded-lg shrink-0 border border-slate-800"
                          />
                        ) : (
                          <div className="w-14 h-10 bg-slate-800 rounded-lg shrink-0 flex items-center justify-center text-slate-600">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            {Boolean(art.isFeatured) && (
                              <button
                                onClick={() => handleToggleFeatured(art.id)}
                                title="Featured Story"
                                className="text-amber-400"
                              >
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(art)}
                              className="font-bold text-white hover:text-lime-400 transition-colors text-xs truncate text-left"
                            >
                              {art.title}
                            </button>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate mt-0.5">
                            /{art.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-sky-400 border border-slate-700/60">
                        {art.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-4 px-5 text-slate-300">
                      <div className="font-semibold text-white">{art.author}</div>
                      <div className="text-[10px] text-slate-500">{art.authorRole}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5">
                      <button
                        onClick={() => handleToggleStatus(art.id, art.status)}
                        title="Click to toggle status"
                        className="group flex items-center gap-1.5"
                      >
                        {art.status === 'published' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500/20 transition-all flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 group-hover:bg-amber-500/20 transition-all flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Draft
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Stats */}
                    <td className="py-4 px-5 text-slate-400 whitespace-nowrap">
                      <div className="font-bold text-white">{art.views} views</div>
                      <div className="text-[10px] text-slate-500">{art.readTimeMinutes} min read</div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                      {art.publishedAt
                        ? new Date(art.publishedAt).toLocaleDateString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'Unpublished'}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewArticle(art)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                          title="Preview Article"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(art)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg transition-colors"
                          title="Edit in WordPress Editor"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(art)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          LIVE ARTICLE PREVIEW MODAL
      ===================================================================== */}
      {previewArticle && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-lime-500 text-slate-950">
                  Live Preview
                </span>
                {previewArticle.category && <span className="text-xs text-slate-400">{previewArticle.category}</span>}
              </div>
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Reader */}
            <div className="p-8 sm:p-12 overflow-y-auto space-y-8 flex-1">
              <div className="space-y-4">
                {previewArticle.category && (
                  <span className="px-3.5 py-1 bg-lime-500 text-slate-950 text-[10px] font-black uppercase tracking-widest inline-block">
                    {previewArticle.category}
                  </span>
                )}
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {previewArticle.title}
                </h1>
                {previewArticle.excerpt && (
                  <p className="text-lg text-slate-600 font-medium leading-relaxed border-l-4 border-lime-500 pl-4">
                    {previewArticle.excerpt}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-100 pb-6">
                  {previewArticle.author && (
                    <span>By <strong>{previewArticle.author}</strong> {previewArticle.authorRole ? `(${previewArticle.authorRole})` : ''}</span>
                  )}
                  {previewArticle.author && <span>•</span>}
                  <span>{previewArticle.readTimeMinutes} min read</span>
                  <span>•</span>
                  <span>{previewArticle.views} views</span>
                </div>
              </div>

              {previewArticle.coverImage && (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={previewArticle.coverImage}
                    alt={previewArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Rendered HTML Body */}
              <div
                className="prose max-w-none text-slate-800 leading-relaxed text-sm sm:text-base space-y-4
                  [&>h1]:text-3xl [&>h1]:font-black [&>h1]:text-slate-900 [&>h1]:mb-4
                  [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:mt-8 [&>h2]:mb-3
                  [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-blue-600 [&>h3]:mt-6 [&>h3]:mb-2
                  [&>p]:mb-4 [&>p]:leading-relaxed
                  [&>blockquote]:border-l-4 [&>blockquote]:border-lime-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&>blockquote]:bg-slate-50 [&>blockquote]:py-3 [&>blockquote]:my-6
                  [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2
                  [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2
                  [&>img]:rounded-xl [&>img]:shadow-lg [&>img]:my-6"
                dangerouslySetInnerHTML={{ __html: previewArticle.content }}
              />
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogTab;
