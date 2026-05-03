import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowLeft, MapPin, Mail, Phone, Send, CheckCircle2, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

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
          <p className="text-[10px] font-black text-[#106E4E] uppercase tracking-[0.3em] mb-4">Contact</p>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter mb-6">
            Get in <span className="text-[#106E4E]">touch.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Have a question, feedback, or partnership inquiry? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#F8FAFC] p-8 rounded-[2rem] border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#106E4E] flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Office</p>
                      <p className="text-sm font-bold text-gray-900">120 Yên Lãng, Phường Láng Hạ</p>
                      <p className="text-sm font-medium text-gray-500">Đống Đa, Hà Nội, Vietnam</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#106E4E] flex-shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                      <a href="mailto:hello@verdantwealth.com" className="text-sm font-bold text-[#106E4E] hover:underline">hello@verdantwealth.com</a>
                      <p className="text-sm font-medium text-gray-500 mt-0.5">
                        <a href="mailto:support@verdantwealth.com" className="hover:underline">support@verdantwealth.com</a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#106E4E] flex-shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                      <p className="text-sm font-bold text-gray-900">+84 24 3856 0000</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">Mon–Fri, 9:00 – 18:00 (GMT+7)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#106E4E] p-8 rounded-[2rem] text-white relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <MessageCircle size={28} className="mb-4 text-white/60" />
                  <h3 className="text-lg font-black mb-2">Quick Support</h3>
                  <p className="text-sm text-white/60 font-medium leading-relaxed mb-4">
                    Need help with your account? Our AI assistant is available 24/7 inside the app.
                  </p>
                  <Link to="/auth">
                    <button className="bg-white text-[#106E4E] font-black px-5 py-3 rounded-xl text-sm hover:bg-gray-100 transition-all">
                      Open App
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Send us a message</h3>

                {submitted && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 text-[#106E4E] rounded-2xl font-bold text-sm mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 size={18} />
                    Message sent! We'll get back to you within 24 hours.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                      <input
                        type="text" required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] transition-all font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                      <input
                        type="email" required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] transition-all font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</label>
                    <input
                      type="text" required
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      placeholder="How can we help?"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] transition-all font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message</label>
                    <textarea
                      required rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us more..."
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] transition-all font-bold text-gray-900 resize-none placeholder:text-gray-300 placeholder:font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-5 bg-[#106E4E] text-white font-black rounded-2xl hover:bg-[#0d5a3f] transition-all shadow-xl shadow-[#106E4E]/20 flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
