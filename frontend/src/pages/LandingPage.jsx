import React from 'react';
import { 
  ArrowRight, 
  Cpu, 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  Globe, 
  Zap,
  Layout,
  BarChart3,
  Bot
} from 'lucide-react';
import { Link } from 'react-router-dom';
import dashboardPreview from '../assets/dashboard_preview.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-verdant-accent selection:text-verdant-text">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="text-xl font-bold tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-verdant-dark rounded-lg flex items-center justify-center text-white">
                <Wallet size={18} />
              </div>
              <span className="text-verdant-text">Verdant</span>
              <span className="text-verdant-dark">Wealth</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
              <a href="#features" className="hover:text-verdant-dark transition-colors">Features</a>
              <a href="#pricing" className="hover:text-verdant-dark transition-colors">Pricing</a>
              <a href="#about" className="hover:text-verdant-dark transition-colors">About</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium text-gray-600 hover:text-verdant-dark transition-colors">Log in</Link>
            <Link to="/auth">
              <button className="bg-verdant-dark hover:bg-[#0d665f] text-white text-sm font-medium py-2 px-5 rounded-full transition-all shadow-sm hover:shadow-md">
                Get started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-verdant-dark">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-verdant-accent/20 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-verdant-light px-4 py-2 rounded-full text-xs font-semibold tracking-wide mb-8 border border-white/10 uppercase">
             <Bot size={14} className="text-verdant-accent" />
             AI-Powered Wealth Intelligence
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-white mb-8">
            The first wealth tracker <br /> <span className="text-verdant-accent">that thinks.</span>
          </h1>
          <p className="text-lg text-verdant-light/80 mb-12 leading-relaxed max-w-2xl mx-auto">
            Verdant is your AI financial manager — it analyzes, optimizes, and evolves your portfolio before you even ask. Precision engineering for the modern investor.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/auth" className="w-full sm:w-auto">
              <button className="w-full bg-white text-verdant-dark hover:bg-verdant-accent transition-all text-base font-bold py-4 px-10 rounded-full shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Get Started <ArrowRight size={18} />
              </button>
            </Link>
            <button className="w-full sm:w-auto bg-transparent text-white border border-white/20 hover:bg-white/10 transition-all text-base font-bold py-4 px-10 rounded-full">
              Contact Us
            </button>
          </div>

          {/* Hero Preview Image (Glassmorphism) */}
          <div className="relative max-w-5xl mx-auto">
             <div className="absolute inset-0 bg-verdant-accent/20 blur-3xl rounded-[3rem] -z-10"></div>
             <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/40 bg-white/5 backdrop-blur-sm p-2 group">
                <img 
                  src={dashboardPreview} 
                  alt="Verdant Wealth Dashboard" 
                  className="w-full h-auto rounded-xl shadow-inner group-hover:scale-[1.01] transition-transform duration-700"
                />
             </div>
             {/* Floating UI Elements */}
             <div className="absolute -top-10 -right-10 hidden lg:block animate-bounce-slow">
                <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-verdant-dark rounded-xl flex items-center justify-center text-white">
                         <TrendingUp size={24} />
                      </div>
                      <div className="text-left">
                         <p className="text-xs font-bold text-gray-500 uppercase">Growth Engine</p>
                         <p className="text-xl font-bold text-verdant-dark">+24.8% APR</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-verdant-dark font-bold text-sm uppercase tracking-widest mb-4">Features</div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">Smart Features, Real Results</h2>
            <p className="text-gray-500 text-lg">Everything you need to grow your wealth, nothing you don't. Designed for clarity and performance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <FeatureCard 
                icon={<Cpu className="text-verdant-dark" />}
                title="AI Portfolio Suggestions"
                description="Verdant predicts market shifts and suggests rebalancing before your team does."
                color="bg-emerald-50"
             />
             <FeatureCard 
                icon={<BarChart3 className="text-blue-600" />}
                title="Automated Backlog Grooming"
                description="Say goodbye to transaction chaos. Our AI automatically tags and categorizes every cent."
                color="bg-blue-50"
             />
             <FeatureCard 
                icon={<Bot className="text-purple-600" />}
                title="AI Chat That Understands"
                description="Ask anything. Create reports, budgets, and forecasts through natural language."
                color="bg-purple-50"
             />
             <FeatureCard 
                icon={<Layout className="text-orange-600" />}
                title="Live Collaborative Editing"
                description="Manage family or business accounts together in real-time with granular permissions."
                color="bg-orange-50"
             />
             <FeatureCard 
                icon={<ShieldCheck className="text-teal-600" />}
                title="Institutional Security"
                description="Military-grade encryption for all your data. Your privacy is our architecture."
                color="bg-teal-50"
             />
             <FeatureCard 
                icon={<Zap className="text-yellow-600" />}
                title="Zero Setup. Instant Growth"
                description="Connect your accounts and watch Verdant build your financial strategy in seconds."
                color="bg-yellow-50"
             />
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-24 bg-white overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-8">
                    Powered by AI. <br />
                    <span className="text-verdant-dark underline decoration-verdant-accent underline-offset-8">Designed for builders.</span>
                  </h2>
                  <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                    Just describe your goal — Verdant instantly generates a fully structured plan with prioritized tasks. No manual setup, no friction.
                  </p>
                  <div className="space-y-6">
                     <div className="flex items-start gap-4 p-6 rounded-2xl bg-verdant-light border border-verdant-accent/50">
                        <div className="w-10 h-10 rounded-full bg-verdant-dark text-white flex items-center justify-center flex-shrink-0">
                           <Zap size={20} />
                        </div>
                        <div>
                           <p className="font-bold text-gray-900 mb-1">Start by typing a short description</p>
                           <p className="text-sm text-gray-600">No need for detailed specs. Verdant reads between the lines.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center flex-shrink-0">
                           <Layout size={20} />
                        </div>
                        <div>
                           <p className="font-bold text-gray-900 mb-1">Watch your board appear</p>
                           <p className="text-sm text-gray-600">Tasks, milestones, and budgets generated automatically.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="relative">
                  <div className="absolute inset-0 bg-verdant-accent/30 blur-[100px] rounded-full"></div>
                  <div className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl p-4 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                     <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-4">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                     </div>
                     <img src={dashboardPreview} alt="AI Dashboard" className="rounded-xl" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-verdant-light">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Simple, Transparent Pricing</h2>
               <p className="text-gray-500">Choose the plan that fits your growth.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               <PricingCard 
                  title="Starter Plan"
                  price="$14"
                  features={['Unlimited Accounts', 'Basic AI Insights', 'Real-time Sync', 'Standard Security']}
                  cta="Get Started"
               />
               <PricingCard 
                  title="Custom Plan"
                  price="Custom"
                  features={['Institutional Access', 'Advanced AI Engine', 'Priority Support', 'White-glove Onboarding']}
                  cta="Contact Sales"
                  highlight
               />
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="gitbg-white pt-24 pb-12 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
               <div className="col-span-1 md:col-span-1">
                  <div className="text-2xl font-black tracking-tighter mb-6">
                     <span className="text-verdant-dark">VERDANT.</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                     The future of wealth management is here. AI-powered, design-driven, and built for those who build.
                  </p>
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 mb-6">Product</h4>
                  <ul className="space-y-4 text-sm text-gray-500">
                     <li><a href="#" className="hover:text-verdant-dark">Features</a></li>
                     <li><a href="#" className="hover:text-verdant-dark">Integrations</a></li>
                     <li><a href="#" className="hover:text-verdant-dark">Pricing</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 mb-6">Resources</h4>
                  <ul className="space-y-4 text-sm text-gray-500">
                     <li><a href="#" className="hover:text-verdant-dark">Documentation</a></li>
                     <li><a href="#" className="hover:text-verdant-dark">Guides</a></li>
                     <li><a href="#" className="hover:text-verdant-dark">Support</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
                  <ul className="space-y-4 text-sm text-gray-500">
                     <li><a href="#" className="hover:text-verdant-dark">Privacy Policy</a></li>
                     <li><a href="#" className="hover:text-verdant-dark">Terms of Service</a></li>
                     <li><a href="#" className="hover:text-verdant-dark">Cookie Settings</a></li>
                  </ul>
               </div>
            </div>
            <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
               <p className="text-xs text-gray-400">© 2024 Verdant Wealth. All rights reserved.</p>
               <div className="flex gap-8">
                  <Globe size={18} className="text-gray-400 hover:text-verdant-dark cursor-pointer" />
                  <TrendingUp size={18} className="text-gray-400 hover:text-verdant-dark cursor-pointer" />
               </div>
            </div>
         </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-10%); }
          50% { transform: translateY(10%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s infinite ease-in-out;
        }
      `}} />
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
   return (
      <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-2xl hover:shadow-verdant-dark/5 transition-all duration-300 group hover:-translate-y-2">
         <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
            {icon}
         </div>
         <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
         <p className="text-gray-500 leading-relaxed">{description}</p>
      </div>
   );
}

function PricingCard({ title, price, features, cta, highlight }) {
   return (
      <div className={`p-10 rounded-[2.5rem] border transition-all duration-300 ${highlight ? 'bg-verdant-dark text-white border-verdant-dark shadow-2xl scale-105' : 'bg-white text-gray-900 border-gray-100 hover:border-verdant-accent'}`}>
         <h3 className="text-lg font-bold mb-2">{title}</h3>
         <div className="text-5xl font-black mb-8 tracking-tighter">{price}</div>
         <ul className="space-y-4 mb-10">
            {features.map((f, i) => (
               <li key={i} className="flex items-center gap-3 text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-verdant-accent/20 text-verdant-accent' : 'bg-verdant-light text-verdant-dark'}`}>
                     <Zap size={12} />
                  </div>
                  {f}
               </li>
            ))}
         </ul>
         <Link to="/auth" className="block w-full">
            <button className={`w-full py-4 rounded-2xl font-bold transition-all ${highlight ? 'bg-white text-verdant-dark hover:bg-verdant-accent' : 'bg-gray-50 text-gray-900 hover:bg-verdant-dark hover:text-white'}`}>
               {cta}
            </button>
         </Link>
      </div>
   );
}


