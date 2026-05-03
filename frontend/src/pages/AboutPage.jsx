import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowLeft, Target, Cpu, Users, MapPin, Mail, ArrowRight } from 'lucide-react';
import founderHoa from '../assets/founder_hoa.png';
import founderQuang from '../assets/founder_quang.png';
import founderQuyet from '../assets/founder_quyet.png';

const team = [
  { name: 'Nguyễn Văn Hòa', role: 'Co-Founder & CEO', desc: 'Visionary leader with deep expertise in fintech architecture and product strategy.', img: founderHoa },
  { name: 'Phạm Đăng Quang', role: 'Co-Founder & CTO', desc: 'Full-stack engineer specializing in AI-driven financial systems and cloud infrastructure.', img: founderQuang },
  { name: 'Hoàng Kiên Quyết', role: 'Co-Founder & CPO', desc: 'Product designer focused on creating intuitive, human-centered financial experiences.', img: founderQuyet },
];

export default function AboutPage() {
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
          <p className="text-[10px] font-black text-[#106E4E] uppercase tracking-[0.3em] mb-4">About Us</p>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter mb-6">
            We're building the future of <span className="text-[#106E4E]">personal finance.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Verdant Wealth was born from a simple belief: managing money should be as effortless as spending it. We combine AI intelligence with elegant design to make wealth-building accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Our Mission', desc: 'Empower individuals to take control of their financial future through intelligent automation and intuitive design.' },
              { icon: Cpu, title: 'Our Approach', desc: 'We leverage cutting-edge AI to analyze, optimize, and evolve your financial portfolio — automatically and transparently.' },
              { icon: Users, title: 'Our Values', desc: 'Transparency, security, and user empowerment drive every decision we make. Your data is yours, always.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#106E4E] mb-6">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black text-[#106E4E] uppercase tracking-[0.3em] mb-4">Our Story</p>
            <h2 className="text-4xl font-black tracking-tighter mb-6">From a university project to a vision.</h2>
          </div>
          <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
            <p>
              Verdant Wealth started in 2026 as a graduation project at the <strong className="text-gray-900">Faculty of Information Technology, Hanoi University (HANU)</strong>. Three students — frustrated by the complexity of existing budgeting tools — decided to build something radically different.
            </p>
            <p>
              Instead of spreadsheets and manual entry, we envisioned a platform where AI does the heavy lifting. One where you simply describe your financial goals in plain language, and the system builds an actionable plan for you — complete with budgets, savings targets, and smart forecasts.
            </p>
            <p>
              Today, Verdant Wealth is our answer to the question: <em className="text-[#106E4E] font-bold">"What if managing money was actually enjoyable?"</em>
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black text-[#106E4E] uppercase tracking-[0.3em] mb-4">Leadership</p>
            <h2 className="text-4xl font-black tracking-tighter">Meet the founders.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-24 h-24 rounded-[1.5rem] mx-auto mb-6 overflow-hidden group-hover:scale-105 transition-transform shadow-lg shadow-gray-200/50 border-2 border-gray-100">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1">{member.name}</h3>
                <p className="text-[10px] font-black text-[#106E4E] uppercase tracking-widest mb-4">{member.role}</p>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 text-gray-400 mb-4">
            <MapPin size={16} />
            <span className="text-sm font-bold">Headquartered in Hanoi, Vietnam</span>
          </div>
          <p className="text-gray-500 font-medium mb-8">120 Yên Lãng, Phường Láng Hạ, Đống Đa, Hà Nội</p>
          <Link to="/auth">
            <button className="bg-[#106E4E] text-white font-black px-8 py-4 rounded-2xl hover:bg-[#0d5a3f] transition-all shadow-xl shadow-[#106E4E]/20 hover:-translate-y-0.5 flex items-center gap-2 mx-auto">
              Join Verdant Today <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
