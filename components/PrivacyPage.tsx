import React from 'react';
import SectionWrapper from './SectionWrapper';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  UserCheck, 
  Database, 
  Globe, 
  Mail, 
  Phone,
  ArrowRight,
  Shield,
  ChevronRight,
  Sparkles,
  Search,
  Settings,
  Bell
} from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const today = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

  const sections = [
    {
      id: "1",
      title: "Information We Collect",
      icon: Search,
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 font-medium">We collect information only when it is necessary to deliver value, improve our services, or comply with legal obligations.</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white border border-slate-100 shadow-sm rounded-sm space-y-4">
              <h4 className="font-black uppercase tracking-widest text-blue-600 text-xs">a. Information You Provide Voluntarily</h4>
              <p className="text-sm text-slate-500 font-medium">This may include: Full name, Email address, Phone number, Company or organization name, Project details or inquiry content, Billing or payment-related information (when applicable).</p>
              <div className="pt-2">
                <p className="text-[10px] font-black uppercase text-slate-400">Contexts:</p>
                <ul className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-2 space-y-1">
                  <li>• Contact forms or email</li>
                  <li>• Consultation bookings</li>
                  <li>• Newsletter subscriptions</li>
                  <li>• Service engagements</li>
                </ul>
              </div>
            </div>
            
            <div className="p-6 bg-white border border-slate-100 shadow-sm rounded-sm space-y-4">
              <h4 className="font-black uppercase tracking-widest text-lime-600 text-xs">b. Information Collected Automatically</h4>
              <p className="text-sm text-slate-500 font-medium">When you visit our website, we may collect: IP address, Browser type and device information, Pages visited and time spent on the site, Referral sources.</p>
              <p className="text-[10px] font-bold text-slate-400 italic">This data is collected via cookies or similar technologies to help us improve website performance and user experience.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "2",
      title: "How We Use Your Information",
      icon: Settings,
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Respond to inquiries and provide requested services",
            "Deliver consulting, media, and community impact solutions",
            "Process transactions and manage client relationships",
            "Improve website functionality and service offerings",
            "Communicate updates, insights, or relevant offerings",
            "Maintain security and prevent fraud"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700">
              <ChevronRight className="w-4 h-4 text-lime-500" /> {item}
            </div>
          ))}
          <div className="md:col-span-2 p-4 bg-blue-50 border-l-4 border-blue-600 mt-2">
            <p className="text-xs font-black uppercase tracking-widest text-blue-900">We do not sell, rent, or trade your personal information.</p>
          </div>
        </div>
      )
    },
    {
      id: "3",
      title: "Data Sharing & Disclosure",
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 font-medium">We may share limited information only:</p>
          <ul className="space-y-3 pl-6">
            {[
              "With trusted service providers (e.g., hosting, payment processors, analytics tools) strictly for business operations",
              "When required by law, regulation, or legal process",
              "To protect the rights, safety, or property of AMG, our clients, or the public"
            ].map((text, i) => (
              <li key={i} className="text-sm font-bold text-slate-500 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                {text}
              </li>
            ))}
          </ul>
          <p className="text-[10px] font-black uppercase text-slate-400 mt-4 italic">All third parties are required to maintain appropriate confidentiality and security standards.</p>
        </div>
      )
    },
    {
      id: "4",
      title: "Cookies & Tracking",
      icon: Eye,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 font-medium">Our website may use cookies to enhance user experience, analyze site traffic and performance, and understand user preferences.</p>
          <p className="text-sm font-bold text-slate-500">You may disable cookies through your browser settings, though some site features may not function optimally.</p>
        </div>
      )
    },
    {
      id: "5",
      title: "Data Security & Protection",
      icon: Lock,
      content: (
        <div className="bg-slate-900 p-8 text-white rounded-sm space-y-6 relative overflow-hidden">
          <Shield className="absolute top-0 right-0 w-32 h-32 opacity-5 -translate-y-8 translate-x-8" />
          <p className="text-lg font-medium leading-relaxed">We implement reasonable administrative, technical, and organizational safeguards to protect your information, including:</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800 border border-slate-700 rounded-sm text-center space-y-2">
              <Database className="w-6 h-6 text-lime-400 mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-widest">Secure Servers</p>
            </div>
            <div className="p-4 bg-slate-800 border border-slate-700 rounded-sm text-center space-y-2">
              <Lock className="w-6 h-6 text-blue-400 mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-widest">Encrypted Tools</p>
            </div>
            <div className="p-4 bg-slate-800 border border-slate-700 rounded-sm text-center space-y-2">
              <UserCheck className="w-6 h-6 text-white mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-widest">Limited Access</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-bold italic">While no system is 100% secure, AMG takes data protection seriously and applies industry-appropriate measures.</p>
        </div>
      )
    },
    {
      id: "6",
      title: "Data Retention",
      icon: Database,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 font-medium">We retain personal information only for as long as necessary to fulfill business and contractual obligations, comply with legal requirements, and resolve disputes.</p>
          <p className="text-sm font-black uppercase text-blue-600">When no longer needed, data is securely deleted or anonymized.</p>
        </div>
      )
    },
    {
      id: "7",
      title: "Your Privacy Rights",
      icon: UserCheck,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 font-medium">Depending on your jurisdiction, you may have the right to:</p>
          <div className="flex flex-wrap gap-4">
            {["Access data", "Request corrections", "Request deletion", "Opt out of marketing"].map((right, i) => (
              <span key={i} className="px-4 py-2 bg-white border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-900 rounded-full shadow-sm hover:border-lime-500 transition-colors">
                {right}
              </span>
            ))}
          </div>
          <p className="text-sm font-bold text-slate-500 mt-4">To exercise any of these rights, contact us using the details provided below.</p>
        </div>
      )
    },
    {
      id: "8",
      title: "Children’s Privacy",
      icon: ShieldCheck,
      content: (
        <p className="text-slate-600 font-medium">AMG does not knowingly collect personal information from individuals under the age of 13. If such data is discovered, it will be promptly removed.</p>
      )
    },
    {
      id: "9",
      title: "External Links",
      icon: Globe,
      content: (
        <p className="text-slate-600 font-medium">Our website may contain links to third-party websites. AMG is not responsible for the privacy practices or content of external sites. We encourage you to review their policies separately.</p>
      )
    },
    {
      id: "10",
      title: "Policy Updates",
      icon: Bell,
      content: (
        <p className="text-slate-600 font-medium">We may update this Privacy Policy periodically to reflect changes in law, technology, or our operations. Updates will be posted on this page with a revised effective date.</p>
      )
    }
  ];

  return (
    <div className="pt-24">
      {/* HEADER */}
      <SectionWrapper bg="white" className="relative overflow-hidden border-b border-slate-100 pb-20">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-10"></div>
        <div className="max-w-4xl space-y-6 reveal active">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
            <ShieldCheck className="w-4 h-4 text-lime-400" /> Data Handling Statement
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none uppercase text-shine">
            Privacy Policy.
          </h1>
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-slate-900">Azariah Management Group (AMG)</p>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 border-l-4 border-lime-500 pl-4">Effective Date: {today}</p>
          </div>
          <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-3xl">
            Azariah Management Group (“AMG,” “we,” “our,” or “us”) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, and safeguard your information when you visit <a href="https://www.azariahmg.com" className="text-blue-600 underline">www.azariahmg.com</a> or engage with our services.
          </p>
          <p className="text-sm font-black uppercase text-slate-400 italic">By using our website or services, you consent to the practices described in this policy.</p>
        </div>
      </SectionWrapper>

      {/* BODY */}
      <SectionWrapper bg="light" className="py-20">
        <div className="max-w-4xl mx-auto space-y-24">
          {sections.map((section) => (
            <section key={section.id} className="space-y-8 reveal">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white shadow-xl rounded-sm flex items-center justify-center shrink-0">
                  <section.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Section {section.id}</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{section.title}</h3>
                </div>
              </div>
              <div className="pl-0 md:pl-20">
                {section.content}
              </div>
            </section>
          ))}

          {/* 11. CONTACT US */}
          <section className="p-10 md:p-16 bg-slate-900 rounded-sm text-white space-y-12 reveal shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Sparkles className="w-48 h-48" />
            </div>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lime-500 text-slate-950 flex items-center justify-center rounded-sm shadow-lg font-black italic">11</div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-lime-400">Contact Us</h3>
              </div>
              <p className="text-slate-400 font-medium text-sm">
                If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact:
              </p>
            </div>
            
            <div className="relative z-10 border-t border-slate-800 pt-10">
              <div className="grid md:grid-cols-2 gap-10">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">The Firm</p>
                    <h4 className="text-2xl font-black uppercase tracking-tighter text-white">Azariah Management Group</h4>
                 </div>
                 <div className="space-y-6">
                    <a href="mailto:info@azariahmg.com" className="flex items-center gap-4 group">
                      <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <Mail className="w-5 h-5 text-blue-500 group-hover:text-white" />
                      </div>
                      <span className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">info@azariahmg.com</span>
                    </a>
                    <a href="https://www.azariahmg.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                      <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-lime-600 transition-colors">
                        <Globe className="w-5 h-5 text-lime-500 group-hover:text-white" />
                      </div>
                      <span className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">www.azariahmg.com</span>
                    </a>
                 </div>
              </div>
            </div>
          </section>

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

export default PrivacyPage;