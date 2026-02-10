import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  Shield, 
  Info, 
  Gavel, 
  Scale, 
  Mail, 
  Globe, 
  Lock, 
  FileText, 
  AlertTriangle, 
  Handshake, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="pt-24">
      {/* HEADER */}
      <SectionWrapper bg="white" className="relative overflow-hidden border-b border-slate-100 pb-20">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-10"></div>
        <div className="max-w-4xl space-y-6 reveal active">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
            <Lock className="w-4 h-4 text-lime-500" /> Professional Standards
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none uppercase text-shine">
            Terms & Conditions.
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
             <span className="text-slate-900">Azariah Management Group (AMG)</span>
             <span className="hidden md:block w-2 h-2 rounded-full bg-lime-500"></span>
             <span>Effective Date: 04/17/2024</span>
          </div>
        </div>
      </SectionWrapper>

      {/* CONTENT */}
      <SectionWrapper bg="light" className="py-20">
        <div className="max-w-4xl mx-auto space-y-20">
          
          <div className="grid gap-16">
            {/* 1. Acceptance */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-sm shadow-lg font-black italic">1</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Acceptance of Terms</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed pl-14">
                By accessing or using this website, you agree to be bound by these Terms & Conditions and all applicable laws. If you do not agree, please discontinue use of the site.
              </p>
            </section>

            {/* 2. About AMG */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-lime-500 text-slate-950 flex items-center justify-center rounded-sm shadow-lg font-black italic">2</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">About Azariah Management Group</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed pl-14">
                Azariah Management Group (“AMG,” “we,” “our,” or “us”) provides consulting, media production, strategic advisory, and community impact services. Information on this website is provided for general informational purposes only.
              </p>
            </section>

            {/* 3. Use of Website */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-sm shadow-lg font-black italic">3</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Use of Website</h3>
              </div>
              <div className="pl-14 space-y-4">
                <p className="text-slate-600 font-medium leading-relaxed">
                  You agree to use this website lawfully and not to:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Violate any applicable laws or regulations",
                    "Interfere with site security or functionality",
                    "Upload malicious code or attempt unauthorized access",
                    "Misrepresent your identity or affiliation"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 text-xs font-bold text-slate-700">
                      <ChevronRight className="w-3 h-3 text-lime-500" /> {item}
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-4 p-4 border-l-4 border-slate-900 bg-slate-50 italic">
                  AMG reserves the right to restrict access for misuse.
                </p>
              </div>
            </section>

            {/* 4. Intellectual Property */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-sm shadow-lg font-black italic">4</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Intellectual Property</h3>
              </div>
              <div className="pl-14 space-y-6">
                <div className="p-8 bg-slate-900 text-white rounded-sm shadow-2xl relative overflow-hidden group">
                  <FileText className="absolute top-0 right-0 w-32 h-32 opacity-5 -translate-y-8 translate-x-8" />
                  <p className="text-lg leading-relaxed font-medium relative z-10">
                    All content on this website—including text, graphics, logos, videos, designs, and trademarks—is the property of Azariah Management Group or its licensors and is protected by intellectual property laws.
                  </p>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">
                  You may not reproduce, distribute, modify, or use any content without prior written permission, except for personal, non-commercial use.
                </p>
              </div>
            </section>

            {/* 5. Client Engagement */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-lime-500 text-slate-950 flex items-center justify-center rounded-sm shadow-lg font-black italic">5</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Client Engagement & Services</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed pl-14">
                Engaging AMG services may require a separate written agreement outlining scope, fees, timelines, and deliverables. Website content alone does not constitute a binding service agreement.
              </p>
            </section>

            {/* 6. Payments */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-sm shadow-lg font-black italic">6</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Payments & Billing</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed pl-14">
                Where applicable, payments, invoicing, and refund terms will be governed by the specific service agreement or invoice issued by AMG.
              </p>
            </section>

            {/* 7. Third-Party Links */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-sm shadow-lg font-black italic">7</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Third-Party Links</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed pl-14">
                This website may include links to third-party websites. AMG does not control or endorse these sites and is not responsible for their content, policies, or practices.
              </p>
            </section>

            {/* 8. Disclaimer */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-lime-500 text-slate-950 flex items-center justify-center rounded-sm shadow-lg font-black italic">8</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Disclaimer</h3>
              </div>
              <div className="pl-14 space-y-4">
                <div className="flex gap-4 p-6 bg-amber-50 border border-amber-100 rounded-sm">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  <p className="text-amber-900 font-medium leading-relaxed">
                    All information on this website is provided “as is” and “as available.” AMG makes no warranties, express or implied, regarding accuracy, reliability, or completeness.
                  </p>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed italic">
                  We do not guarantee specific business, financial, or operational outcomes from the use of our services or content.
                </p>
              </div>
            </section>

            {/* 9. Limitation of Liability */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-sm shadow-lg font-black italic">9</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Limitation of Liability</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed pl-14">
                To the fullest extent permitted by law, Azariah Management Group shall not be liable for any indirect, incidental, consequential, or special damages arising from your use of this website or services.
              </p>
            </section>

            {/* 10. Indemnification */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-sm shadow-lg font-black italic">10</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Indemnification</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed pl-14">
                You agree to indemnify and hold harmless AMG, its directors, partners, and affiliates from any claims arising from your misuse of the website or violation of these Terms.
              </p>
            </section>

            {/* 11. Privacy */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-lime-500 text-slate-950 flex items-center justify-center rounded-sm shadow-lg font-black italic">11</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Privacy</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed pl-14">
                Your use of this website is also governed by our Privacy Policy, which explains how we collect, use, and protect your data.
              </p>
            </section>

            {/* 12. Modifications */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-sm shadow-lg font-black italic">12</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Modifications</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed pl-14">
                AMG may update these Terms & Conditions at any time. Continued use of the website after updates constitutes acceptance of the revised terms.
              </p>
            </section>

            {/* 13. Governing Law */}
            <section className="space-y-4 reveal active">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-sm shadow-lg font-black italic">13</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Governing Law</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed pl-14">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
              </p>
            </section>

            {/* 14. Contact */}
            <section className="p-10 bg-slate-900 rounded-sm text-white space-y-12 reveal active shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Sparkles className="w-48 h-48" />
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-lime-500 text-slate-950 flex items-center justify-center rounded-sm shadow-lg font-black italic">14</div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-lime-400">Contact Information</h3>
                </div>
                <p className="text-slate-400 font-medium text-sm pl-14">
                  For questions regarding these Terms & Conditions:
                </p>
              </div>
              
              <div className="pl-14 pt-4 relative z-10">
                <div className="space-y-8">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Azariah Management Group</p>
                      <div className="flex flex-col gap-4">
                        <a href="mailto:info@azariahmg.com" className="flex items-center gap-3 text-xl md:text-3xl font-black text-white hover:text-lime-500 transition-colors uppercase tracking-tighter">
                          <Mail className="w-6 h-6 text-blue-500" /> info@azariahmg.com
                        </a>
                        <a href="https://www.azariahmg.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xl md:text-3xl font-black text-white hover:text-lime-500 transition-colors uppercase tracking-tighter">
                          <Globe className="w-6 h-6 text-lime-500" /> www.azariahmg.com
                        </a>
                      </div>
                   </div>
                </div>
              </div>
            </section>

          </div>

          <div className="pt-20 border-t border-slate-200 text-center opacity-50">
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                Azariah Management Group • Built for Scale • © {new Date().getFullYear()}
             </p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default TermsPage;