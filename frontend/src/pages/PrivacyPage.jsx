import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <p className="text-[10px] font-black text-[#106E4E] uppercase tracking-[0.3em] mb-4">Legal</p>
          <h1 className="text-5xl font-black tracking-tighter mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-400 font-bold mb-12">Last updated: May 1, 2026</p>

          <div className="prose prose-gray max-w-none space-y-8">
            {[
              {
                title: '1. Information We Collect',
                content: `When you use Verdant Wealth, we collect information you provide directly, such as your name, email address, and financial data you choose to input (wallets, transactions, budgets, and goals). We also collect usage data including device information, IP address, and interaction patterns to improve our service.`,
              },
              {
                title: '2. How We Use Your Information',
                content: `Your data is used exclusively to: (a) provide and maintain the Verdant Wealth service, (b) generate personalized financial insights and AI-powered recommendations, (c) improve our product through anonymized analytics, and (d) communicate with you about service updates and security alerts.`,
              },
              {
                title: '3. Data Sharing',
                content: `We do NOT sell, rent, or trade your personal or financial data to any third party. We may share anonymized, aggregated data for research purposes. In the event of a legal requirement, we may disclose information as required by Vietnamese law.`,
              },
              {
                title: '4. Data Storage & Security',
                content: `All data is stored on encrypted servers within enterprise-grade cloud infrastructure. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. Access to production data is strictly limited and fully auditable.`,
              },
              {
                title: '5. Your Rights',
                content: `You have the right to: (a) access all personal data we hold about you, (b) request correction of inaccurate data, (c) export your data in a standard format, and (d) delete your account and all associated data at any time through Settings > Account.`,
              },
              {
                title: '6. Cookies & Tracking',
                content: `We use essential cookies to maintain your session and preferences. We do not use third-party advertising trackers. Analytics cookies are anonymized and used solely for product improvement.`,
              },
              {
                title: '7. Children\'s Privacy',
                content: `Verdant Wealth is not intended for users under the age of 16. We do not knowingly collect information from children. If you believe a child has provided us with personal data, please contact us immediately.`,
              },
              {
                title: '8. Changes to This Policy',
                content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notification. Continued use of the service after changes constitutes acceptance.`,
              },
              {
                title: '9. Contact Us',
                content: `For privacy-related inquiries, contact us at privacy@verdantwealth.com or write to: Verdant Wealth, 120 Yên Lãng, Phường Láng Hạ, Đống Đa, Hà Nội, Vietnam.`,
              },
            ].map((section, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-black text-gray-900 mb-3">{section.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
