import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, Minus, Zap, ArrowRight, Bot } from 'lucide-react';
import { startStrategicChat } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const QUICK_STARTS = [
  "How can AMG help scale my nonprofit?",
  "Tell me about Studio AMG's media services.",
  "What is your approach to AI in business?",
  "How do I book a CSR consultation?"
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your Azariah Strategic Advisor. I’m here to help you navigate your organizational challenges with precision and impact. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isStreaming, isLoading]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!chatRef.current) {
      chatRef.current = startStrategicChat();
    }
  };

  const handleSend = async (userInput: string) => {
    if (!userInput.trim() || isLoading || isStreaming) return;

    const userMessage = userInput.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = startStrategicChat();
      }

      const streamResponse = await chatRef.current.sendMessageStream({ message: userMessage });
      setIsLoading(false);
      setIsStreaming(true);

      // Add placeholder for model response
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      let accumulatedText = '';
      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text || "";
        accumulatedText += chunkText;
        
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex].role === 'model') {
            newMessages[lastIndex] = { ...newMessages[lastIndex], text: accumulatedText };
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting to the strategic engine. Please check your connection or try again in a moment." }]);
      setIsLoading(false);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[92vw] md:w-[450px] h-[550px] md:h-[700px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-6 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-800">
                  <Bot className="w-6 h-6 text-slate-900" />
                </div>
                {(isStreaming || isLoading) && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-slate-900"></span>
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">AMG Advisor</h3>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-blue-400 animate-pulse' : 'bg-lime-500'}`}></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {isStreaming ? 'Advisor is typing...' : 'Always Online'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-lg">
              <Minus className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[88%] p-4 md:p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-br-none border border-slate-800' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none prose prose-slate prose-sm'
                }`}>
                  {msg.text || (msg.role === 'model' && (isLoading || isStreaming) ? null : msg.text)}
                  {msg.role === 'model' && isStreaming && i === messages.length - 1 && (
                    <span className="inline-block w-1 h-4 bg-lime-500 ml-1 animate-pulse align-middle"></span>
                  )}
                </div>
              </div>
            ))}
            
            {(isLoading) && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-3 items-center">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Quick Starts */}
            {!isLoading && !isStreaming && messages[messages.length-1].role === 'model' && (
              <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-lime-500" /> Suggested Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_STARTS.map((text, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(text)}
                      className="text-left px-4 py-2 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 hover:border-lime-500 hover:bg-lime-50 transition-all flex items-center gap-2 group shadow-sm"
                    >
                      {text}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* User Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
            className="p-6 bg-white border-t border-slate-100 flex gap-3 items-center"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                disabled={isLoading || isStreaming}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-slate-900 transition-colors disabled:opacity-50"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading || isStreaming || !input.trim()}
              className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-lime-500 hover:text-slate-900 transition-all disabled:opacity-50 shadow-lg group shrink-0"
            >
              {isLoading || isStreaming ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </form>
        </div>
      )}

      {/* Main Chat Trigger Button */}
      <button
        onClick={toggleChat}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group relative ${
          isOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-lime-500 text-slate-900'
        }`}
      >
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-lg">
            HI
          </span>
        )}
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />}
      </button>
    </div>
  );
};

export default ChatBot;