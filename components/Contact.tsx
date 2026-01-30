
import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <SectionWrapper id="contact" bg="light">
      <div className="max-w-5xl mx-auto bg-white rounded-sm shadow-2xl overflow-hidden grid md:grid-cols-5">
        <div className="md:col-span-2 bg-slate-900 p-10 md:p-16 text-white space-y-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Start the Conversation</h2>
            <p className="text-slate-400">Our senior partners are ready to discuss your specific organizational needs.</p>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-slate-800 rounded-sm">
              <div className="text-blue-400 text-xs font-bold uppercase mb-1 tracking-widest">Office Hours</div>
              <div>Mon - Fri, 8:00 - 18:00 EST</div>
            </div>
            <div className="p-4 bg-slate-800 rounded-sm">
              <div className="text-blue-400 text-xs font-bold uppercase mb-1 tracking-widest">Response Time</div>
              <div>Typical response under 4 hours</div>
            </div>
          </div>
        </div>
        
        <form className="md:col-span-3 p-10 md:p-16 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-colors" 
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-colors" 
                placeholder="john@company.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Organization</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-colors" 
              placeholder="Your Company Name"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Project Details</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-colors resize-none" 
              placeholder="Briefly describe your requirements..."
            ></textarea>
          </div>
          
          <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-sm hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 group">
            <span>Send Message</span>
            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </form>
      </div>
    </SectionWrapper>
  );
};

export default Contact;
