import React, { useState, useEffect } from 'react';
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

  // Initialize EmailJS with your provided Public Key
  useEffect(() => {
    if ((window as any).emailjs) {
      // Public Key: 47Un9Cdef_fd1YWOi
      (window as any).emailjs.init('47Un9Cdef_fd1YWOi');
    }
  }, []);

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
      /** 
       * REQUIRED: Ensure these IDs match your EmailJS Dashboard exactly.
       * Service ID: Created when you connect your email (Gmail/Outlook).
       * Template IDs: Created in the "Email Templates" section.
       */
      const SERVICE_ID = 'default_service'; 
      const ADMIN_TEMPLATE_ID = 'template_amg_admin';
      const CLIENT_TEMPLATE_ID = 'template_amg_client';
      
      // 1. DATA FOR info@azariahmg.com
      const adminEmailParams = {
        to_email: 'info@azariahmg.com',
        from_name: formData.fullName,
        from_email: formData.email,
        organization: formData.organization || 'Individual',
        message: formData.details,
        subject: `Strategic Inquiry: ${formData.fullName}`
      };

      // 2. DATA FOR CLIENT (Using your specific boilerplate)
      const clientEmailParams = {
        to_name: formData.fullName,
        to_email: formData.email,
        project_context: formData.organization ? `project with ${formData.organization}` : "business goals",
        subject: 'Thank you for contacting Azariah Management Group'
      };

      if ((window as any).emailjs) {
        // Dispatch Internal Notification
        await (window as any).emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, adminEmailParams);
        
        // Dispatch "Thank You" Boilerplate to Client
        await (window as any).emailjs.send(SERVICE_ID, CLIENT_TEMPLATE_ID, clientEmailParams);
        
        setToastMessage(`Your inquiry has been transmitted to info@azariahmg.com and a confirmation email was sent to ${formData.email}.`);
        setShowToast(true);
        setFormData({ fullName: '', email: '', organization: '', details: '' });
      } else {
        throw new Error("Email engine not loaded");
      }

      setTimeout(() => setShowToast(false), 10000);
      
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert("Mail server connection error. Please ensure your EmailJS Service and Template IDs are correctly configured, or contact us directly at info@azariahmg.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="contact" bg="light" className="relative">
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in slide-in-from-top-10 duration-500">
          <div className="bg-slate-900 text-white p-6 rounded-sm shadow-2xl border-l-4 border-lime-500 flex items-start gap-4">
            <div className="bg-lime-500 p-2 rounded-full shrink-0">
              <CheckCircle2 className="w-5 h-5 text-slate-900" />
            </div>
            <div className="flex-1">
              <p className="font-black uppercase tracking-widest text-xs mb-1">Message Transmitted</p>
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
        <div className="md:col-span-2 bg-slate-900 p-10 md:p-16 text-white space-y-10">
          <div>
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Strategic Inquiry</h2>
            <p className="text-slate-400">Direct transmission to <span className="text-blue-400">info@azariahmg.com</span> with 4-hour response SLA.</p>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-slate-800 rounded-sm">
              <div className="text-blue-400 text-xs font-bold uppercase mb-1 tracking-widest">Office Hours</div>
              <div className="text-sm">Mon - Fri, 9:00 AM - 5:00 PM EST</div>
            </div>
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Primary Channels</p>
              <div className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 text-lime-500" />
                <a href="tel:240-813-0308" className="text-sm font-bold text-white hover:text-lime-400 transition-colors">240-813-0308</a>
              </div>
              <div className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:info@azariahmg.com" className="text-sm font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-tight">info@azariahmg.com</a>
              </div>
            </div>
          </div>
        </div>
        
        <form className="md:col-span-3 p-10 md:p-16 space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name <span className="text-red-500">*</span></label>
              <input 
                required
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-colors font-bold text-sm" 
                placeholder="Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address <span className="text-red-500">*</span></label>
              <input 
                required
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-colors font-bold text-sm" 
                placeholder="Email"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Organization</label>
            <input 
              type="text" 
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-colors font-bold text-sm" 
              placeholder="Company or Project Name"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Inquiry Details <span className="text-red-500">*</span></label>
            <textarea 
              required
              rows={4}
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-colors resize-none font-bold text-sm" 
              placeholder="Describe your needs..."
            ></textarea>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Secured Connection • Encrypted Transmission Active
            </p>
          </div>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-sm hover:bg-lime-500 hover:text-slate-900 transition-all flex items-center justify-center space-x-3 group disabled:opacity-70 uppercase tracking-widest text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>sending...</span>
              </>
            ) : (
              <>
                <span>Submit</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </SectionWrapper>
  );
};

export default Contact;