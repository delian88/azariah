import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Minus,
  Undo,
  Redo,
  Maximize2,
  Minimize2,
  Eye,
  FileCode,
  Sparkles,
  Upload,
  Check,
  X,
  Youtube,
  Table,
  HelpCircle
} from 'lucide-react';
import { blogService } from '../../services/blogService';

interface WordPressEditorProps {
  initialContent: string;
  onChange: (htmlContent: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const WordPressEditor: React.FC<WordPressEditorProps> = ({
  initialContent,
  onChange,
  placeholder = 'Write your article story here, add headings, media, and insights...',
  minHeight = '420px'
}) => {
  const [mode, setMode] = useState<'visual' | 'html'>('visual');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [contentHtml, setContentHtml] = useState(initialContent || '');
  
  // Modals state
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTab, setMediaTab] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const visualEditorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedSelectionRange = useRef<Range | null>(null);

  // Sync content on mount and whenever initialContent changes
  useEffect(() => {
    setContentHtml(initialContent || '');
    if (visualEditorRef.current && visualEditorRef.current.innerHTML !== (initialContent || '')) {
      visualEditorRef.current.innerHTML = initialContent || '';
    }
  }, [initialContent]);

  // Sync visual editor content when switching between modes
  useEffect(() => {
    if (mode === 'visual' && visualEditorRef.current) {
      visualEditorRef.current.innerHTML = contentHtml;
    }
  }, [mode]);

  // Word & character stats
  const cleanText = contentHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = cleanText ? cleanText.split(' ').length : 0;
  const charCount = cleanText.length;
  const readTimeEstimate = Math.max(1, Math.ceil(wordCount / 200));

  // Handle content changes
  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      const html = visualEditorRef.current.innerHTML;
      setContentHtml(html);
      onChange(html);
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContentHtml(val);
    onChange(val);
  };

  // Save current selection for restoring after modal interactions
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRange.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRange.current);
      }
    }
  };

  // Execute formatting command
  const execCmd = (cmd: string, val: string | undefined = undefined) => {
    if (mode !== 'visual') return;
    visualEditorRef.current?.focus();
    document.execCommand(cmd, false, val);
    handleVisualInput();
  };

  // Block format (Headings & Paragraphs)
  const formatBlock = (tag: string) => {
    if (mode !== 'visual') return;
    visualEditorRef.current?.focus();
    document.execCommand('formatBlock', false, `<${tag}>`);
    handleVisualInput();
  };

  // ---------------------------------------------------------------------------
  // LINK INSERTION
  // ---------------------------------------------------------------------------
  const openLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    const selectedText = sel ? sel.toString() : '';
    setLinkText(selectedText);
    setLinkUrl('');
    setLinkModalOpen(true);
  };

  const insertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;

    restoreSelection();
    visualEditorRef.current?.focus();

    const formattedUrl = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') || linkUrl.startsWith('#') || linkUrl.startsWith('/')
      ? linkUrl
      : `https://${linkUrl}`;

    if (linkText) {
      const targetAttr = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      const html = `<a href="${formattedUrl}"${targetAttr} class="text-blue-400 hover:text-blue-300 underline font-medium">${linkText}</a>`;
      document.execCommand('insertHTML', false, html);
    } else {
      document.execCommand('createLink', false, formattedUrl);
    }

    setLinkModalOpen(false);
    handleVisualInput();
  };

  // ---------------------------------------------------------------------------
  // IMAGE / MEDIA INSERTION
  // ---------------------------------------------------------------------------
  const openMediaModal = () => {
    saveSelection();
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setUploadError('');
    setMediaModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError('');
    try {
      const res = await blogService.uploadImage(file);
      if (res.success && res.url) {
        setImageUrl(res.url);
        setImageAlt(file.name.replace(/\.[^/.]+$/, ''));
      } else {
        setUploadError(res.error || 'Failed to upload image.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Image upload error.');
    } finally {
      setUploadingImage(false);
    }
  };

  const insertMedia = () => {
    if (!imageUrl) return;

    restoreSelection();
    visualEditorRef.current?.focus();

    const altAttr = imageAlt ? ` alt="${imageAlt}"` : ' alt="Blog Article Image"';
    let html = `<figure class="my-8 text-center"><img src="${imageUrl}"${altAttr} class="rounded-2xl max-w-full h-auto mx-auto shadow-2xl border border-slate-700/60 transition-transform duration-300" />`;
    if (imageCaption) {
      html += `<figcaption class="text-xs text-slate-400 italic mt-2.5 font-medium">${imageCaption}</figcaption>`;
    }
    html += `</figure><p><br/></p>`;

    if (mode === 'visual') {
      document.execCommand('insertHTML', false, html);
      handleVisualInput();
    } else {
      setContentHtml((prev) => prev + '\n' + html);
      onChange(contentHtml + '\n' + html);
    }

    setMediaModalOpen(false);
  };

  // ---------------------------------------------------------------------------
  // VIDEO EMBED INSERTION
  // ---------------------------------------------------------------------------
  const openVideoModal = () => {
    saveSelection();
    setVideoUrl('');
    setVideoModalOpen(true);
  };

  const insertVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;

    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const vId = videoUrl.split('v=')[1]?.split('&')[0];
      if (vId) embedUrl = `https://www.youtube.com/embed/${vId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const vId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      if (vId) embedUrl = `https://www.youtube.com/embed/${vId}`;
    }

    const html = `
      <div class="my-8 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <iframe src="${embedUrl}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p><br/></p>
    `;

    restoreSelection();
    visualEditorRef.current?.focus();
    if (mode === 'visual') {
      document.execCommand('insertHTML', false, html);
      handleVisualInput();
    } else {
      setContentHtml((prev) => prev + '\n' + html);
      onChange(contentHtml + '\n' + html);
    }
    setVideoModalOpen(false);
  };

  // Insert Table
  const insertTable = () => {
    saveSelection();
    const html = `
      <div class="overflow-x-auto my-6">
        <table class="w-full text-xs text-left border border-slate-700/80 rounded-lg overflow-hidden">
          <thead class="bg-slate-950 text-slate-300 font-bold uppercase tracking-wider border-b border-slate-700">
            <tr>
              <th class="p-3 border-r border-slate-800">Column 1</th>
              <th class="p-3 border-r border-slate-800">Column 2</th>
              <th class="p-3">Column 3</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/80 text-slate-300">
            <tr>
              <td class="p-3 border-r border-slate-800">Data Point A</td>
              <td class="p-3 border-r border-slate-800">Data Point B</td>
              <td class="p-3">Data Point C</td>
            </tr>
            <tr>
              <td class="p-3 border-r border-slate-800">Item 1</td>
              <td class="p-3 border-r border-slate-800">Item 2</td>
              <td class="p-3">Item 3</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><br/></p>
    `;
    visualEditorRef.current?.focus();
    document.execCommand('insertHTML', false, html);
    handleVisualInput();
  };

  return (
    <div
      className={`border border-slate-800 rounded-2xl bg-slate-950 shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-[999] flex flex-col bg-slate-950 shadow-2xl overflow-hidden' : 'relative'
      }`}
    >
      {/* =====================================================================
          HEADER BAR: TABS & FULLSCREEN TOGGLE
      ===================================================================== */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMode('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'visual'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" /> Visual
          </button>
          <button
            type="button"
            onClick={() => setMode('html')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'html'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-lime-400" /> Text (HTML)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openMediaModal}
            className="flex items-center gap-1.5 px-3 py-1 bg-lime-500/15 hover:bg-lime-500/25 text-lime-400 border border-lime-500/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          >
            <ImageIcon className="w-3.5 h-3.5" /> Add Media
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* =====================================================================
          FORMATTING TOOLBAR (Wordpress Classic/Gutenberg Style)
      ===================================================================== */}
      {mode === 'visual' && (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900/60 border-b border-slate-800 text-slate-300">
          {/* Headings Dropdown */}
          <select
            onChange={(e) => formatBlock(e.target.value)}
            defaultValue="p"
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500 font-semibold"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Basic Text Formatting */}
          <button
            type="button"
            onClick={() => execCmd('bold')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('italic')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('underline')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('strikeThrough')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Alignment */}
          <button
            type="button"
            onClick={() => execCmd('justifyLeft')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyCenter')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyRight')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyFull')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Bulleted List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatBlock('blockquote')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatBlock('pre')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Links & Inserts */}
          <button
            type="button"
            onClick={openLinkModal}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4 text-sky-400" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('unlink')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Remove Link"
          >
            <Unlink className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={openVideoModal}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Embed Video"
          >
            <Youtube className="w-4 h-4 text-rose-400" />
          </button>
          <button
            type="button"
            onClick={insertTable}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Insert Table"
          >
            <Table className="w-4 h-4 text-amber-400" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertHorizontalRule')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => execCmd('undo')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('redo')}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =====================================================================
          MAIN EDITOR BODY: VISUAL OR HTML
      ===================================================================== */}
      <div className={`p-5 overflow-y-auto ${isFullscreen ? 'flex-1' : ''}`} style={{ minHeight }}>
        {mode === 'visual' ? (
          <div
            ref={visualEditorRef}
            contentEditable
            onInput={handleVisualInput}
            className="prose prose-invert max-w-none focus:outline-none min-h-[360px] text-slate-200 text-sm leading-relaxed
              [&>h1]:text-3xl [&>h1]:font-black [&>h1]:text-white [&>h1]:tracking-tight [&>h1]:mb-4
              [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:tracking-tight [&>h2]:mt-6 [&>h2]:mb-3
              [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-sky-400 [&>h3]:mt-5 [&>h3]:mb-2
              [&>p]:mb-4 [&>p]:leading-relaxed
              [&>blockquote]:border-l-4 [&>blockquote]:border-lime-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-400 [&>blockquote]:my-6 [&>blockquote]:bg-slate-900/50 [&>blockquote]:py-2 [&>blockquote]:rounded-r-lg
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1.5 [&>ul]:mb-4
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-1.5 [&>ol]:mb-4
              [&>pre]:bg-slate-900 [&>pre]:border [&>pre]:border-slate-800 [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:font-mono [&>pre]:text-xs [&>pre]:text-lime-400 [&>pre]:overflow-x-auto [&>pre]:mb-4
              [&>a]:text-blue-400 [&>a]:underline [&>a]:hover:text-blue-300
              [&>hr]:border-slate-800 [&>hr]:my-6"
            data-placeholder={placeholder}
          />
        ) : (
          <textarea
            value={contentHtml}
            onChange={handleHtmlChange}
            placeholder="Type or paste HTML markup here..."
            className="w-full h-full min-h-[360px] bg-transparent text-emerald-400 font-mono text-xs focus:outline-none resize-y leading-relaxed"
            spellCheck={false}
          />
        )}
      </div>

      {/* =====================================================================
          FOOTER STATUS BAR: WORD COUNT, CHARACTERS & READ TIME
      ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-4">
          <span>Words: <strong className="text-slate-300">{wordCount}</strong></span>
          <span>Characters: <strong className="text-slate-300">{charCount}</strong></span>
          <span>Est. Reading: <strong className="text-sky-400">{readTimeEstimate} min</strong></span>
        </div>
        <div className="text-[10px] text-slate-500">
          Mode: <span className="text-slate-400 uppercase font-bold">{mode}</span>
        </div>
      </div>

      {/* =====================================================================
          INSERT LINK MODAL
      ===================================================================== */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-[1001] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-sky-400" /> Insert Hyperlink
              </h4>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={insertLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Destination URL</label>
                <input
                  type="text"
                  placeholder="https://example.com or #section"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Anchor Text (optional)</label>
                <input
                  type="text"
                  placeholder="Text to display"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-sky-500"
                />
                <span>Open in new window / tab</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          INSERT MEDIA / IMAGE MODAL
      ===================================================================== */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-[1001] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-lime-400" /> Insert Media & Pictures
              </h4>
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tabs: Upload or URL */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setMediaTab('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mediaTab === 'upload' ? 'bg-lime-500/15 text-lime-400 border border-lime-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Upload from Computer
              </button>
              <button
                type="button"
                onClick={() => setMediaTab('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mediaTab === 'url' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Insert from Web URL
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-400">
                {uploadError}
              </div>
            )}

            {mediaTab === 'upload' ? (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-lime-500/80 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-950/60 group"
                >
                  <Upload className="w-8 h-8 text-slate-500 group-hover:text-lime-400 mx-auto mb-2 transition-colors" />
                  <p className="text-xs font-bold text-white">Click to choose image file</p>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WebP, SVG, GIF up to 10MB</p>
                  {uploadingImage && <p className="text-xs text-lime-400 font-bold mt-2 animate-pulse">Uploading file to server...</p>}
                </div>

                {imageUrl && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                    <img src={imageUrl} alt="Uploaded preview" className="w-16 h-12 object-cover rounded-lg" />
                    <div className="flex-1 truncate text-xs text-slate-300">
                      <div className="font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Uploaded successfully
                      </div>
                      <div className="truncate text-slate-500 text-[10px]">{imageUrl}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Alt Text (Accessibility)</label>
              <input
                type="text"
                placeholder="Brief description of the image"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Caption (Displays below picture)</label>
              <input
                type="text"
                placeholder="Photo source / Figure caption"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertMedia}
                disabled={!imageUrl || uploadingImage}
                className="px-5 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
              >
                Insert Picture into Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          INSERT VIDEO EMBED MODAL
      ===================================================================== */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-[1001] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Youtube className="w-4 h-4 text-rose-500" /> Embed Video
              </h4>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={insertVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">YouTube / Vimeo Video URL</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  autoFocus
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                >
                  Insert Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordPressEditor;
