import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowLeft, Clock, User, ArrowRight, Tag } from 'lucide-react';

const posts = [
  {
    id: 1,
    category: 'Product',
    title: 'Introducing Verdant AI: Your Financial Co-Pilot',
    excerpt: 'We are excited to announce the launch of our AI-powered financial assistant. Verdant AI can analyze your spending, suggest budget optimizations, and even create savings plans — all through natural conversation.',
    date: 'May 1, 2026',
    author: 'Phạm Đăng Quang',
    readTime: '5 min read',
  },
  {
    id: 2,
    category: 'Engineering',
    title: 'How We Built a Real-Time Wealth Tracker with React & Spring Boot',
    excerpt: 'A deep dive into the architecture behind Verdant Wealth — from our Spring Boot backend to our React frontend — and how we achieved real-time sync across all devices.',
    date: 'Apr 25, 2026',
    author: 'Hoàng Kiên Quyết',
    readTime: '8 min read',
  },
  {
    id: 3,
    category: 'Finance',
    title: '5 Budgeting Mistakes Every Vietnamese Student Makes',
    excerpt: 'Managing finances as a university student is tough. We surveyed 200+ HANU students and found these five common pitfalls — and how Verdant can help you avoid them.',
    date: 'Apr 18, 2026',
    author: 'Nguyễn Văn Hòa',
    readTime: '4 min read',
  },
  {
    id: 4,
    category: 'Company',
    title: 'Verdant Wealth: From Classroom to Product',
    excerpt: 'The story of how three IT students at Hanoi University turned a graduation project into a full-fledged fintech platform. Lessons learned, mistakes made, and dreams ahead.',
    date: 'Apr 10, 2026',
    author: 'Nguyễn Văn Hòa',
    readTime: '6 min read',
  },
];

const categoryColors = {
  Product: 'bg-emerald-50 text-[#106E4E]',
  Engineering: 'bg-indigo-50 text-indigo-600',
  Finance: 'bg-amber-50 text-amber-700',
  Company: 'bg-sky-50 text-sky-600',
};

export default function BlogPage() {
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
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <p className="text-[10px] font-black text-[#106E4E] uppercase tracking-[0.3em] mb-4">Blog</p>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter mb-6">
            Insights & <span className="text-[#106E4E]">Updates</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Stories from our team about product development, personal finance tips, and the journey of building Verdant Wealth.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className={`bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${
                  index === 0 ? 'md:col-span-2 md:flex-row md:gap-10 md:items-center' : ''
                }`}
              >
                {/* Featured image placeholder */}
                <div className={`bg-gradient-to-br from-[#106E4E]/10 to-emerald-50 rounded-2xl flex items-center justify-center mb-6 ${
                  index === 0 ? 'md:w-1/2 md:mb-0 h-64' : 'h-48'
                }`}>
                  <div className="text-[#106E4E]/30 text-6xl font-black">V</div>
                </div>

                <div className={index === 0 ? 'md:w-1/2' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-50 text-gray-500'}`}>
                      {post.category}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {post.readTime}
                    </span>
                  </div>

                  <h2 className={`font-black text-gray-900 tracking-tight mb-3 leading-tight ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <User size={12} /> {post.author} · {post.date}
                    </div>
                    <button className="text-[#106E4E] font-black text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      Read <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
