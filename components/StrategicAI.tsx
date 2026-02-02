import React, { useState } from 'react';
import { Sparkles, Send, Loader2, RefreshCw, ExternalLink, Globe } from 'lucide-react';
import { getStrategicInsight, StrategicResponse } from '../services/geminiService';
import SectionWrapper from './SectionWrapper';

const StrategicAI: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<StrategicResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getStrategicInsight(input);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const reset = () => {
    setInput('');
    setResult(null);
    setError(null);
  };

  return (
    <SectionWrapper id="ai" bg="dark" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <div className="grid grid-cols-6 md:grid-cols-12 h-full w-full">
          {[...Array(48)].map((_, i) => (
            <div key={i} className="border-[0.5px] border-slate-400 aspect-square"></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 md:space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 text-blue-400 font-mono text-xs md:text-sm tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Advanced Strategic Engine</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight px-4 text-shine-white">
            Strategic Insight Engine
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto px-4">
            Leverage Pro-grade models and real-time Google Search grounding to analyze your business challenges.
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="relative group px-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-lime-600 rounded-sm blur opacity-25 group-focus-within:opacity-50 transition-opacity"></div>
            <div className="relative flex flex-col md:flex-row bg-slate-800 p-1.5 md:p-2 rounded-sm border border-slate-700">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., How can we leverage AI in community impact projects?"
                className="flex-1 bg-transparent px-4 md:px-6 py-4 outline-none text-white text-base md:text-lg placeholder:text-slate-500 min-h-[56px]"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-slate-900 px-6 md:px-8 py-4 font-black rounded-sm flex items-center justify-center space-x-2 hover:bg-lime-500 hover:text-slate-950 transition-all disabled:opacity-50 mt-2 md:mt-0 uppercase tracking-widest text-xs"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                <span>Analyze</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-12 rounded-sm border border-slate-700 text-left space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mx-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-mono text-lime-400 uppercase tracking-tighter">Analysis Complete</div>
                {result.sources && result.sources.length > 0 && (
                  <div className="flex items-center gap-1 text-[8px] text-blue-400 font-bold uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">
                    <Globe className="w-2.5 h-2.5" /> Grounded Result
                  </div>
                )}
              </div>
              <button 
                onClick={reset}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-full"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            
            <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-slate-300 text-sm md:text-base border-l-2 border-lime-500/30 pl-6">
              {result.text}
            </div>

            {result.sources && result.sources.length > 0 && (
              <div className="pt-6 border-t border-slate-700/50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Sources & References</p>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-blue-500 transition-all rounded-sm group"
                    >
                      <span className="text-[10px] text-slate-400 group-hover:text-blue-400 font-bold truncate max-w-[150px] md:max-w-xs">{source.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-blue-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-700 flex justify-center">
              <button 
                onClick={scrollToContact}
                className="text-xs font-black uppercase tracking-[0.2em] text-slate-950 bg-lime-500 px-8 py-4 rounded-sm hover:bg-white transition-all shadow-xl hover:-translate-y-1"
              >
                Book Full Partner Audit
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-xs md:text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        <div className="text-slate-500 text-[10px] md:text-xs italic px-4 uppercase tracking-[0.1em] font-bold">
          Strategic Reasoning Engine • Grounded Intelligence • Pro Series 3
        </div>
      </div>
    </SectionWrapper>
  );
};

export default StrategicAI;