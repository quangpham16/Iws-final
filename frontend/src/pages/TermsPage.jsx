import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-5xl font-black tracking-tighter mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-400 font-bold mb-12">Last updated: May 1, 2026</p>

          <div className="prose prose-gray max-w-none space-y-8">
            {[
              {
                title: '1. Acceptance of Terms',
                content: `By accessing or using Verdant Wealth ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not use the Service. The Service is operated by Verdant Wealth, headquartered at 120 Yên Lãng, Phường Láng Hạ, Đống Đa, Hà Nội, Vietnam.`,
              },
              {
                title: '2. Description of Service',
                content: `Verdant Wealth is an AI-powered personal finance management platform that helps users track income, expenses, budgets, savings goals, and subscriptions. The Service provides automated financial insights and recommendations. Verdant Wealth is not a licensed financial advisor, bank, or investment firm.`,
              },
              {
                title: '3. Account Registration',
                content: `You must register for an account to use the Service. You agree to provide accurate, current, and complete information. You are responsible for safeguarding your password and for all activities under your account. You must notify us immediately of any unauthorized access.`,
              },
              {
                title: '4. Acceptable Use',
                content: `You agree not to: (a) use the Service for any unlawful purpose, (b) attempt to gain unauthorized access to any portion of the Service, (c) interfere with or disrupt the Service, (d) upload malicious code, or (e) impersonate any person or entity. Violation of these terms may result in immediate account termination.`,
              },
              {
                title: '5. Financial Disclaimer',
                content: `The Service provides financial tools and AI-generated suggestions for informational purposes only. These do NOT constitute financial, investment, tax, or legal advice. You should consult qualified professionals before making financial decisions. Verdant Wealth is not liable for any financial losses resulting from actions taken based on information provided by the Service.`,
              },
              {
                title: '6. Intellectual Property',
                content: `All content, features, and functionality of the Service — including but not limited to text, graphics, logos, icons, software, and design — are the exclusive property of Verdant Wealth and are protected by international copyright, trademark, and other intellectual property laws.`,
              },
              {
                title: '7. Data & Privacy',
                content: `Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of information as described in our Privacy Policy.`,
              },
              {
                title: '8. Service Availability',
                content: `We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. The Service may be temporarily unavailable for maintenance, updates, or due to circumstances beyond our control. We will notify users of planned downtime when possible.`,
              },
              {
                title: '9. Limitation of Liability',
                content: `To the maximum extent permitted by law, Verdant Wealth shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months prior to the event giving rise to liability.`,
              },
              {
                title: '10. Termination',
                content: `We may suspend or terminate your account at any time for violation of these Terms. You may delete your account at any time through Settings. Upon termination, your right to use the Service ceases immediately, and we will delete your data in accordance with our Privacy Policy.`,
              },
              {
                title: '11. Governing Law',
                content: `These Terms are governed by the laws of the Socialist Republic of Vietnam. Any disputes arising from these Terms shall be resolved through the competent courts of Hanoi, Vietnam.`,
              },
              {
                title: '12. Contact',
                content: `For questions about these Terms, contact us at legal@verdantwealth.com or write to: Verdant Wealth, 120 Yên Lãng, Phường Láng Hạ, Đống Đa, Hà Nội, Vietnam.`,
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
