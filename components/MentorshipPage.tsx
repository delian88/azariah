import React, { useState, useEffect } from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  Users, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Loader2, 
  Linkedin, 
  User, 
  Mail, 
  MessageSquare, 
  Briefcase,
  Zap,
  Globe,
  Award,
  ShieldCheck
} from 'lucide-react';

const MentorshipPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    linkedin: '',
    industry: '',
    interest: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize EmailJS with your provided Public Key: 47Un9Cdef_fd1YWOi
  useEffect(() => {
    if ((window as any).emailjs) {
      (window as any).emailjs.init('47Un9Cdef_fd1YWOi');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const SERVICE_ID = 'default_service';
      const ADMIN_TEMPLATE_ID = 'template_amg_admin';
      const CLIENT_TEMPLATE_ID = 'template_amg_client';
      
      const adminEmailParams = {
        to_email: 'info@azariahmg.com',
        from_name: formData.fullName,
        from_email: formData.email,
        linkedin: formData.linkedin,
        industry: formData.industry,
        interest: formData.interest,
        message: formData.message,
        subject: `Mentorship Application: ${formData.fullName}`
      };

      const clientEmailParams = {
        to_name: formData.fullName,
        to_email: formData.email,
        project_context: "mentorship application",
        subject: 'Thank you for contacting Azariah Management Group'
      };

      if ((window as any).emailjs) {
        // Send to AMG Admin
        await (window as any).emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, adminEmailParams);
        // Send boilerplate to Applicant
        await (window as any).emailjs.send(SERVICE_ID, CLIENT_TEMPLATE_ID, clientEmailParams);
        
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ fullName: '', email: '', linkedin: '', industry: '', interest: '', message: '' });
      } else {
        throw new Error("SDK Load Error");
      }
    } catch (error) {
      console.error("Mentorship Email Error:", error);
      alert("Mail server connection error. Please ensure your EmailJS configuration is correct, or email your application directly to info@azariahmg.com.");
      setIsSubmitting(false);
    }
  };

  const MENTORSHIP_PILLARS = [
    {
      title: "Strategic Leadership",
      desc: "Develop the executive mindset required to lead complex organizations and scale impactful ventures.",
      icon: Target
    },
    {
      title: "Media & Storytelling",
      desc: "Learn to harness the power of cinematic narratives to mobilize communities and build brand equity.",
      icon: Zap
    },
    {
      title: "Digital Transformation",
      desc: "Master the integration of AI and ethical technology systems for operational excellence.",
      icon: Globe
    }
  ];

  return (
    <div className="pt-24">
      {/* HERO SECTION */}
      <SectionWrapper bg="white" className="relative overflow-hidden pb-32">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-10"></div>
        <div className="max-w-4xl space-y-8 reveal active">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-50 text-lime-800 text-[10px] font-black uppercase tracking-widest rounded-full border border-lime-100 shadow-sm">
            <Award className="w-4 h-4 text-lime-600" /> Pathways to Excellence
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none text-shine uppercase">
            Developing <br /> The Next Era of <br /> Global Leaders.
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium border-l-4 border-blue-600 pl-6 max-w-2xl">
            Azariah Management Group’s Mentorship Program bridges the gap between emerging talent and high-level strategic expertise.
          </p>
        </div>
      </SectionWrapper>

      {/* PROGRAM OVERVIEW */}
      <SectionWrapper bg="light" className="relative">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12 reveal active">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">Strategic Guidance for Scale</h2>
              <div className="w-16 h-1 bg-lime-500"></div>
            </div>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              We believe that mentorship is more than just advice—it is a strategic investment in the future of our global ecosystem. Our mentors are senior partners at AMG with decades of experience across corporate innovation, public sector administration, and media production.
            </p>
            
            <div className="space-y-6">
              {MENTORSHIP_PILLARS.map((pillar, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="p-4 bg-white border border-slate-100 rounded-sm shadow-sm group-hover:border-blue-600 transition-all">
                    <pillar.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{pillar.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative reveal active">
            <div className="aspect-[4/5] bg-slate-900 rounded-sm shadow-2xl overflow-hidden group border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2070" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                alt="Mentorship Session"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-blue-600/90 backdrop-blur-md text-white border-l-8 border-lime-500">
                <p className="text-2xl font-black uppercase tracking-tighter leading-tight italic">
                  "The goal is not to copy success, but to engineer it with purpose."
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest mt-4 text-lime-400">AMG Mentorship Core Value</p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* APPLICATION FORM */}
      <SectionWrapper id="apply" bg="white" className="py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16 reveal active">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter text-shine">Apply for Mentorship</h2>
            <p className="text-slate-500 text-lg font-medium">Submissions are processed via secure SMTP to <span className="text-blue-600 font-bold">info@azariahmg.com</span></p>
          </div>

          {isSubmitted ? (
            <div className="p-12 md:p-20 bg-slate-50 border-2 border-dashed border-slate-200 text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-lime-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle2 className="w-10 h-10 text-slate-950" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Application Delivered</h3>
                <p className="text-slate-600 font-medium">
                  Your mentorship request has been securely delivered. You should receive a confirmation email shortly. A member of our leadership team will reach out after reviewing your credentials.
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-slate-900 transition-colors"
                >
                  Submit another application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-slate-100 shadow-2xl p-8 md:p-16 rounded-sm space-y-8 reveal active">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input 
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Professional Email
                  </label>
                  <input 
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-all font-bold text-sm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Linkedin className="w-3 h-3" /> LinkedIn Profile
                  </label>
                  <input 
                    required
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Current Industry
                  </label>
                  <select 
                    required
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-all font-bold text-sm"
                  >
                    <option value="">Select Industry</option>
                    <option value="tech">Technology / AI</option>
                    <option value="nonprofit">Non-Profit / NGO</option>
                    <option value="media">Media / Storytelling</option>
                    <option value="gov">Public Sector / Government</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Target className="w-3 h-3" /> Primary Area of Interest
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Strategic Planning", "Impact Media", "Innovation Ops"].map(item => (
                    <label key={item} className={`flex items-center justify-center gap-2 p-4 border-2 rounded-sm cursor-pointer transition-all font-black text-[10px] uppercase tracking-widest ${formData.interest === item ? 'border-lime-500 bg-lime-50 text-slate-900' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}>
                      <input 
                        type="radio" 
                        name="interest" 
                        value={item} 
                        onChange={handleInputChange}
                        className="hidden" 
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" /> Professional Goals
                </label>
                <textarea 
                  required
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="How can AMG help you achieve your goals?"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-all font-bold text-sm resize-none"
                ></textarea>
              </div>

              <div className="bg-blue-50 p-4 border-l-4 border-blue-600 flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest leading-relaxed">
                  Encryption Layer Active: Secure SMTP Relay via info@azariahmg.com
                </p>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full py-6 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs rounded-sm hover:bg-lime-500 hover:text-slate-950 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> <span>sending...</span>
                  </>
                ) : (
                  <>
                    <span>send to azariah to send</span> <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </SectionWrapper>

      {/* FOOTER CTA */}
      <SectionWrapper bg="dark" className="py-32 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-600/5 -z-10"></div>
         <div className="max-w-4xl mx-auto space-y-12 relative z-10 reveal active">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none text-white uppercase text-shine-white">
              Elevate Your Narrative.
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
              Join a community of visionaries dedicated to building a borderless world of excellence.
            </p>
            <div className="pt-8">
               <button 
                 onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
                 className="px-14 py-7 bg-lime-500 text-slate-950 font-black rounded-sm hover:bg-white transition-all shadow-2xl uppercase tracking-widest text-sm flex items-center justify-center gap-4 group mx-auto"
               >
                 Start Your Application <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               </button>
            </div>
         </div>
      </SectionWrapper>
    </div>
  );
};

export default MentorshipPage;