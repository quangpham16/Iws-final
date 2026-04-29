import React from 'react';
import {
  Bell,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Cpu,
  Globe,
  ArrowRight
} from 'lucide-react';

import plantSprout from '../assets/plant_sprout.png';
import greenhouseBuilding from '../assets/greenhouse_building.png';
import abstractSpiral from '../assets/abstract_spiral.png';
import { Link } from 'react-router-dom';


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fcfdfc] text-[#111827] font-sans selection:bg-verdant-accent selection:text-verdant-text">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-12">
          <div className="text-xl font-bold tracking-tight">
            <span className="text-verdant-text">Verdant</span>
            <span className="text-verdant-dark">Wealth</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="text-verdant-dark border-b-2 border-verdant-dark pb-1">Dashboard</a>
            <a href="#" className="hover:text-verdant-dark transition-colors">Portfolio</a>
            <a href="#" className="hover:text-verdant-dark transition-colors">Market</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-gray-500 hover:text-verdant-dark transition-colors">
            <Bell size={20} />
          </button>
          <div className="h-5 w-px bg-gray-200"></div>
          <Link to="/auth" className="text-sm font-medium text-verdant-dark hover:text-verdant-text transition-colors">Register</Link>
          <Link to="/auth">
            <button className="bg-verdant-dark hover:bg-[#0d665f] text-white text-sm font-medium py-2 px-5 rounded-md transition-all shadow-sm hover:shadow-md">
              Sign in
            </button>
          </Link>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        {/* Left Content */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-verdant-accent/50 text-verdant-text px-3 py-1.5 rounded-full text-xs font-bold tracking-wider mb-8 uppercase">
            <ArrowUpRight size={14} className="text-verdant-dark" />
            Growth Architecture 2024
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-gray-900 mb-6">
            Financial <span className="text-verdant-dark">Vitality</span> <br /> Through Design.
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-md">
            Moving beyond static sanctuary assets. We engineer high-yield, growth-oriented portfolios that reflect the lush complexity of organic prosperity.
          </p>
          <div className="flex items-center gap-6">
            <button className="bg-verdant-dark hover:bg-[#0d665f] text-white text-base font-medium py-3.5 px-8 rounded-lg transition-all shadow-lg shadow-verdant-dark/20 hover:shadow-xl hover:shadow-verdant-dark/30 hover:-translate-y-0.5">
              Get Started
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">+12.4%</span>
              <span className="text-xs text-gray-500 font-medium">Avg. Annual Yield</span>
            </div>
          </div>
        </div>

        {/* Right Images Composition */}
        <div className="relative h-[500px] w-full flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[500px] h-full">
            {/* Top Right Image */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-3xl overflow-hidden shadow-2xl z-10 hover:scale-105 transition-transform duration-500">
              <img src={plantSprout} alt="Sprouting plant" className="w-full h-full object-cover" />
            </div>

            {/* Bottom Left Image */}
            <div className="absolute top-40 left-0 w-64 h-40 rounded-3xl overflow-hidden shadow-2xl z-0 hover:scale-105 transition-transform duration-500">
              <img src={greenhouseBuilding} alt="Greenhouse" className="w-full h-full object-cover" />
            </div>

            {/* Bottom Right Image */}
            <div className="absolute top-52 right-12 w-28 h-28 rounded-2xl overflow-hidden shadow-xl z-10 hover:scale-105 transition-transform duration-500">
              <img src={abstractSpiral} alt="Abstract growth" className="w-full h-full object-cover" />
            </div>

            {/* Floating Card */}
            <div className="absolute top-64 left-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-4 animate-bounce-slow">
              <div className="w-10 h-10 rounded-lg bg-[#b48600] flex items-center justify-center text-white">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Assets</p>
                <p className="text-lg font-bold text-gray-900">$2.4M Growth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="bg-verdant-light py-24 border-t border-verdant-dark/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">The Verdant Architecture</h2>
            <p className="text-gray-500 text-sm">
              We reject the "SaaS-in-a-box" look for a sophisticated layering of premium financial services.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Big Card 1 */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-10 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b48600] to-transparent opacity-50"></div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
                <Wallet size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Growth-Oriented Portfolio</h3>
              <p className="text-gray-500 leading-relaxed mb-12 max-w-md">
                Our portfolios are dynamic ecosystems. We don't just protect wealth; we cultivate it through strategic exposure to emerging architecture.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-xs font-bold text-verdant-dark hover:text-verdant-text uppercase tracking-wider transition-colors">
                Explore Yields <ArrowRight size={14} />
              </a>
            </div>

            {/* Big Card 2 */}
            <div className="bg-verdant-dark rounded-3xl p-10 shadow-sm text-white relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
              <h3 className="text-xl font-bold mb-4">Market Analysis</h3>
              <p className="text-verdant-light/80 text-sm leading-relaxed mb-12">
                Real-time telemetry on global market shifts, rendered in architectural clarity.
              </p>
              <div>
                <p className="text-5xl font-bold text-[#fbbf24] mb-1">98%</p>
                <p className="text-xs font-medium text-verdant-light/70 uppercase tracking-wider">Accuracy Rating</p>
              </div>
            </div>
          </div>

          {/* 3 Small Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Sustainable Security</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                End-to-end encryption anchored in institutional-grade protocols.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Cpu size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">AI Optimization</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Machine learning that adapts your strategy to real-world volatility.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Globe size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Global Exposure</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Access to international growth markets from a single dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <div className="text-lg font-bold tracking-tight mb-4">
                <span className="text-verdant-text">Verdant</span>
                <span className="text-verdant-dark">Wealth</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                Elevating investment management through organic architectural principles and growth-oriented telemetry.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6">Ecosystem</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-xs text-gray-500 hover:text-verdant-dark transition-colors">Portfolio Explorer</a></li>
                <li><a href="#" className="text-xs text-gray-500 hover:text-verdant-dark transition-colors">Growth Engine</a></li>
                <li><a href="#" className="text-xs text-gray-500 hover:text-verdant-dark transition-colors">Yield Optimization</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-xs text-gray-500 hover:text-verdant-dark transition-colors">Market Reports</a></li>
                <li><a href="#" className="text-xs text-gray-500 hover:text-verdant-dark transition-colors">Wealth Theory</a></li>
                <li><a href="#" className="text-xs text-gray-500 hover:text-verdant-dark transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6">Newsletter</h4>
              <p className="text-xs text-gray-500 mb-4">Architectural insights delivered weekly.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-gray-50 border border-gray-200 text-sm px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-verdant-dark focus:border-verdant-dark"
                />
                <button className="bg-verdant-dark hover:bg-[#0d665f] text-white px-4 py-2 rounded-r-md transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4 md:mb-0">
              © 2024 VerdantWealth Architecture. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-gray-600">Privacy</a>
              <a href="#" className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-gray-600">Terms</a>
              <a href="#" className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-gray-600">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s infinite ease-in-out;
        }
      `}} />
    </div>
  );

}


