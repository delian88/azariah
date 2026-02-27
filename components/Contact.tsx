import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { Send, Loader2, CheckCircle2, AlertCircle, Phone, Mail, ShieldCheck } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    details: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.fullName || !formData.email || !formData.details) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/mailer.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error("Server returned invalid response."); }

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send inquiry.");
      }

      setToastMessage(`Your inquiry has been received. A confirmation email was sent to ${formData.email}.`);
      setShowToast(true);
      setFormData({ fullName: '', email: '', organization: '', details: '' });
      setTimeout(() => setShowToast(false), 10000);

    } catch (error: any) {
      console.error('Inquiry Error:', error);
      alert(error.message || "Failed to send inquiry. Please contact us at info@azariahmg.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="contact" bg="light" className="relative">

      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
          <div className="bg-slate-900 text-white p-6 rounded-sm shadow-2xl border-l-4 border-lime-500 flex items-start gap-4">
            <div className="bg-lime-500 p-2 rounded-full shrink-0">
              <CheckCircle2 className="w-5 h-5 text-slate-900" />
            </div>
            <div className="flex-1">
              <p className="font-black uppercase tracking-widest text-xs mb-1">
                Message Transmitted
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-relaxed">
                {toastMessage}
              </p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-slate-500 hover:text-white shrink-0">
              <AlertCircle className="w-4 h-4 rotate-45" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white rounded-sm shadow-2xl overflow-hidden grid md:grid-cols-5">

        {/* Left info panel */}
        <div className="md:col-span-2 bg-slate-900 p-10 md:p-16 text-white space-y-10">
          <div>
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tighter">
              Strategic Inquiry
            </h2>
            <p className="text-slate-400">
              Direct transmission to <span className="text-blue-400">info@azariahmg.com</span>
            </p>
          </div>

          <div className="space-y-6">
            {/* Office hours */}
            <div className="p-4 bg-slate-800 rounded-sm flex items-center gap-3">
              <Phone className="w-5 h-5 text-lime-500" />
              <div className="text-sm">Mon - Fri, 9:00 AM - 5:00 PM EST</div>
            </div>

            {/* Contact channels */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">
                Primary Channels
              </p>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:info@azariahmg.com" className="text-sm font-bold hover:text-blue-400">
                  info@azariahmg.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <form className="md:col-span-3 p-10 md:p-16 space-y-6" onSubmit={handleSubmit}>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              required
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 border"
            />

            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 border"
            />
          </div>

          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="Organization"
            className="w-full px-4 py-3 border"
          />

          <textarea
            required
            rows={4}
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="Describe your needs..."
            className="w-full px-4 py-3 border resize-none"
          />

          {/* Security notice with ShieldCheck */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 border rounded-sm text-xs text-slate-600 font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            Secured Connection • Encrypted Transmission Active
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-slate-900 text-white font-bold flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Submit
                <Send className="w-4 h-4" />
              </>
            )}
          </button>

        </form>
      </div>
    </SectionWrapper>
  );
};

export default Contact;