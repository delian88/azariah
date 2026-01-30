import React, { useState } from 'react';
import { Sparkles, Send, Loader2, RefreshCw } from 'lucide-react';
import { getStrategicInsight } from '../services/geminiService';
import SectionWrapper from './SectionWrapper';

const StrategicAI: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const insight = await getStrategicInsight(input);
      setResult(insight || null);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
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
            <span>AI-Driven Strategy</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight px-4">
            Strategic Insight Engine
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto px-4">
            Experience a preview of our analytical approach. Describe a business challenge, and our Strategic AI will provide a preliminary recommendation.
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="relative group px-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-sm blur opacity-25 group-focus-within:opacity-50 transition-opacity"></div>
            <div className="relative flex flex-col md:flex-row bg-slate-800 p-1.5 md:p-2 rounded-sm border border-slate-700">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., How can we scale for 20% growth?"
                className="flex-1 bg-transparent px-4 md:px-6 py-4 outline-none text-white text-base md:text-lg placeholder:text-slate-500 min-h-[56px]"
                style={{ fontSize: '16px' }} // Critical for preventing iOS zoom
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-slate-900 px-6 md:px-8 py-4 font-bold rounded-sm flex items-center justify-center space-x-2 hover:bg-blue-50 transition-colors disabled:opacity-50 mt-2 md:mt-0"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                <span>Analyze</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-12 rounded-sm border border-slate-700 text-left space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mx-4">
            <div className="flex justify-between items-start">
              <div className="text-[10px] font-mono text-blue-400 uppercase tracking-tighter">Analysis Complete</div>
              <button 
                onClick={reset}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-slate-300 text-sm md:text-base">
              {result}
            </div>
            <div className="pt-6 border-t border-slate-700 flex justify-center">
              <button className="text-sm font-semibold text-white bg-blue-600 px-6 py-3 rounded-sm hover:bg-blue-700 transition-colors">
                Book Full Audit
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-xs md:text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        <div className="text-slate-500 text-[10px] md:text-xs italic px-4">
          Powered by Gemini 3 Strategic Models • Real-time Business Intelligence
        </div>
      </div>
    </SectionWrapper>
  );
};

export default StrategicAI;