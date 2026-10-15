import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { Send, Loader2, CheckCircle2, AlertCircle, Phone, Mail, ShieldCheck } from 'lucide-react';
import { useContent, getApiUrl } from '../context/ContentContext';

const Contact: React.FC = () => {
  const { settings, getSection, showToast } = useContent();
  const section = getSection('contact');

  const contactEmail = settings?.contact_email || "info@azariahmg.com";
  const contactPhone = settings?.contact_phone || "+1 (443) 222-0000";
  const officeHours = settings?.office_hours || "Mon - Fri, 9:00 AM - 5:00 PM EST";
  const title = section?.title || "Strategic Inquiry";
  const subtitle = section?.subtitle || `Direct transmission to ${contactEmail}`;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    details: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.fullName || !formData.email || !formData.details) {
      showToast("Please fill in all required fields (Name, Email, and Details).", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Primary: Try API endpoint (bridges PHP mailer)
      const response = await fetch(getApiUrl('api/inquiry'), {
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

      showToast(`Inquiry sent! A confirmation email was dispatched to ${formData.email}.`, "success", 8000);
      setFormData({ fullName: '', email: '', organization: '', details: '' });

    } catch (error: any) {
      console.error('Inquiry Error:', error);
      showToast(error.message || `Failed to send inquiry. Please email ${contactEmail} directly.`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="contact" bg="light" className="relative">



      <div className="max-w-5xl mx-auto bg-white rounded-sm shadow-2xl overflow-hidden grid md:grid-cols-5">

        {/* Left info panel */}
        <div className="md:col-span-2 bg-slate-900 p-10 md:p-16 text-white space-y-10">
          <div>
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tighter">
              {title}
            </h2>
            <p className="text-slate-400">
              {subtitle}
            </p>
          </div>

          <div className="space-y-6">
            {/* Office hours */}
            <div className="p-4 bg-slate-800 rounded-sm flex items-center gap-3">
              <Phone className="w-5 h-5 text-lime-500" />
              <div className="text-sm">{officeHours}</div>
            </div>

            {/* Contact channels */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">
                Primary Channels
              </p>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href={`mailto:${contactEmail}`} className="text-sm font-bold hover:text-blue-400">
                  {contactEmail}
                </a>
              </div>
              {contactPhone && (
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-lime-400" />
                  <span>{contactPhone}</span>
                </div>
              )}
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