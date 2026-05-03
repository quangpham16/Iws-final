import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group hover:opacity-80 transition-all">
            <div className="w-8 h-8 bg-[#106E4E] rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Wallet size={16} />
            </div>
            <span className="text-xl font-black tracking-tight">Verdant</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#106E4E] transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#106E4E] mx-auto mb-6 shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <p className="text-[10px] font-black text-[#106E4E] uppercase tracking-[0.3em] mb-4">Security</p>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter mb-6">
            Your data is <span className="text-[#106E4E]">sacred.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            At Verdant Wealth, security isn't a feature — it's our foundation. Here's how we protect your financial data.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {[
            {
              title: 'End-to-End Encryption',
              content: 'All data transmitted between your device and our servers is encrypted using TLS 1.3 (AES-256). Your financial data is encrypted at rest using industry-standard encryption protocols. Even our own engineers cannot read your personal information.',
            },
            {
              title: 'Zero-Knowledge Architecture',
              content: 'We follow a zero-knowledge design philosophy wherever possible. Sensitive credentials (like bank passwords) are never stored on our servers. Authentication is handled through secure OAuth 2.0 and JWT token-based sessions.',
            },
            {
              title: 'Infrastructure Security',
              content: 'Our infrastructure is hosted on enterprise-grade cloud servers with SOC 2 Type II compliance. We implement automatic backups, disaster recovery, and continuous monitoring with real-time alerts for any suspicious activity.',
            },
            {
              title: 'Access Control',
              content: 'We enforce strict role-based access control (RBAC) internally. All access to production data is logged and auditable. Two-factor authentication (2FA) is available for all user accounts and is required for administrative access.',
            },
            {
              title: 'Regular Audits',
              content: 'Our codebase undergoes regular security reviews and penetration testing. We follow OWASP Top 10 guidelines and maintain a responsible disclosure policy for security researchers.',
            },
            {
              title: 'Data Privacy',
              content: 'We never sell your data to third parties. Your financial information is yours — we use it only to provide you with personalized insights and recommendations. You can export or delete your data at any time from your account settings.',
            },
          ].map((section, idx) => (
            <div key={idx} className="bg-[#F8FAFC] p-8 rounded-[2rem] border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{section.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
