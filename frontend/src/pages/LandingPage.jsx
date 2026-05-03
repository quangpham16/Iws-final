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
  Bot,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import dashboardPreview from '../assets/dashboard_preview.png';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPage() {
  return (
    <div className="bg-[#F8FAFC] text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-xl font-black tracking-tight flex items-center gap-2 group hover:opacity-80 transition-all">
              <div className="w-8 h-8 bg-verdant-dark rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Wallet size={16} />
              </div>
              <span className="text-gray-900">Verdant</span>
            </button>
            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-400">
              <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
              <a href="#ai-section" className="hover:text-gray-900 transition-colors">AI</a>
              <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-bold text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-2.5 rounded-xl transition-all">Log in</Link>
            <Link to="/auth">
              <button className="bg-verdant-dark hover:bg-[#0d665f] text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-1">
                Get started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-12 bg-white">
        {/* Crisp Background Image with proper contrast gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-white">
          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.35 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={dashboardPreview} 
            alt="Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-6 text-center w-full"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Spotlight glow behind text to make it stand out perfectly */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[500px] bg-white/70 blur-[100px] rounded-full pointer-events-none -z-10"></div>

          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md text-verdant-dark px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] mb-8 border border-emerald-100 shadow-sm uppercase">
             <Bot size={14} className="text-verdant-dark" />
             AI-Powered Wealth Intelligence
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tighter text-gray-900 mb-6 max-w-4xl mx-auto drop-shadow-sm">
            The first wealth tracker <br /> <span className="text-verdant-dark">that actually thinks.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-gray-900 font-bold mb-10 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            Verdant is your AI financial manager. It analyzes, optimizes, and evolves your portfolio before you even have to ask.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 relative z-20">
            <Link to="/auth" className="w-full sm:w-auto">
              <button className="w-full bg-verdant-dark text-white hover:bg-[#0d665f] transition-all text-sm font-black py-3.5 px-8 rounded-2xl shadow-xl shadow-verdant-dark/30 hover:-translate-y-1 flex items-center justify-center gap-2">
                Start Building <ArrowRight size={16} />
              </button>
            </Link>
            <button className="w-full sm:w-auto bg-white/90 backdrop-blur-md text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm font-bold py-3.5 px-8 rounded-2xl shadow-sm">
              View Demo
            </button>
          </motion.div>

          {/* Floating UI Elements over Background */}
          {/* Left: Growth Card */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-[60%] lg:top-[55%] left-[2%] lg:left-[5%] hidden md:block z-10"
          >
            <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                      <TrendingUp size={24} />
                  </div>
                  <div className="text-left">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Growth</p>
                      <p className="text-xl font-black text-gray-900">+24.8% APR</p>
                  </div>
                </div>
            </div>
          </motion.div>

          {/* Top Right: Insights Card (compact, above text zone) */}
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[2%] lg:top-[4%] right-[2%] lg:right-[8%] hidden md:block z-10"
          >
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl shadow-gray-200/40 border border-white/50 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 flex-shrink-0">
                    <Zap size={15} />
                </div>
                <div className="text-left">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Insights</p>
                    <p className="text-sm font-black text-gray-900 leading-tight">Auto-Optimized</p>
                </div>
            </div>
          </motion.div>

          {/* Bottom Right: Security Card */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[2%] lg:bottom-[8%] right-[5%] lg:right-[15%] hidden md:block z-10"
          >
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <ShieldCheck size={20} />
                  </div>
                  <div className="text-left">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Security</p>
                      <p className="text-base font-black text-gray-900">Encrypted</p>
                  </div>
                </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="min-h-screen flex flex-col justify-center py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="text-verdant-dark font-black text-[10px] uppercase tracking-[0.2em] mb-4">Engineered for Performance</div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900 mb-4">Everything you need. <br/> Nothing you don't.</h2>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12"
          >
             <FeatureCard 
                icon={<Cpu className="text-gray-900" />}
                title="AI Suggestions"
                description="Verdant predicts market shifts and suggests rebalancing before your team does."
             />
             <FeatureCard 
                icon={<BarChart3 className="text-gray-900" />}
                title="Auto Grooming"
                description="Say goodbye to transaction chaos. Our AI automatically tags and categorizes every cent."
             />
             <FeatureCard 
                icon={<Bot className="text-gray-900" />}
                title="Smart Chat"
                description="Ask anything. Create reports, budgets, and forecasts through natural language."
             />
             <FeatureCard 
                icon={<Layout className="text-gray-900" />}
                title="Live Sync"
                description="Manage family or business accounts together in real-time with granular permissions."
             />
             <FeatureCard 
                icon={<ShieldCheck className="text-gray-900" />}
                title="Institutional Security"
                description="Military-grade encryption for all your data. Your privacy is our architecture."
             />
             <FeatureCard 
                icon={<Zap className="text-gray-900" />}
                title="Zero Setup"
                description="Connect your accounts and watch Verdant build your financial strategy in seconds."
             />
          </motion.div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai-section" className="min-h-screen flex flex-col justify-center py-20 bg-[#F8FAFC] border-y border-gray-100 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
                  <motion.h2 variants={fadeInUp} className="text-4xl lg:text-6xl font-black tracking-tighter text-gray-900 mb-6 leading-[1.1]">
                    Powered by AI. <br />
                    <span className="text-verdant-dark">Designed for builders.</span>
                  </motion.h2>
                  <motion.p variants={fadeInUp} className="text-lg font-medium text-gray-500 mb-10 leading-relaxed max-w-lg">
                    Just describe your goal. Verdant instantly generates a fully structured plan with prioritized tasks. No manual setup.
                  </motion.p>
                  <motion.div variants={staggerContainer} className="space-y-4">
                     <motion.div variants={fadeInUp} className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-gray-200 shadow-sm">
                        <div className="w-10 h-10 rounded-2xl bg-verdant-dark text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                           <Zap size={18} />
                        </div>
                        <div>
                           <p className="font-black text-gray-900 mb-1 text-base">Start by typing</p>
                           <p className="text-gray-500 text-sm font-medium leading-relaxed">No need for detailed specs. Verdant reads between the lines and structures your wealth automatically.</p>
                        </div>
                     </motion.div>
                     <motion.div variants={fadeInUp} className="flex items-start gap-4 p-5 rounded-3xl bg-transparent">
                        <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center flex-shrink-0">
                           <Layout size={18} />
                        </div>
                        <div>
                           <p className="font-black text-gray-400 mb-1 text-base">Watch it build</p>
                           <p className="text-gray-400 text-sm font-medium leading-relaxed">Budgets, goals, and forecasts are generated and tracked without lifting a finger.</p>
                        </div>
                     </motion.div>
                  </motion.div>
               </motion.div>
               
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.8, ease: "easeOut" }}
                 className="relative"
               >
                  <div className="bg-white rounded-[2rem] border border-gray-200 shadow-2xl p-3 max-w-md ml-auto">
                     <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100 shadow-inner">
                        <div className="flex gap-4 mb-5">
                           <div className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-200">
                              <Wallet size={14} />
                           </div>
                           <div className="bg-white p-3 px-4 rounded-2xl rounded-tl-sm border border-gray-200 shadow-sm text-sm font-bold text-gray-700 leading-relaxed">
                              I want to save $15k for a car by next year. Can we do it?
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-8 h-8 rounded-full bg-verdant-dark text-white flex items-center justify-center flex-shrink-0 shadow-md">
                              <Bot size={14} />
                           </div>
                           <div className="bg-emerald-50 p-3 px-4 rounded-2xl rounded-tl-sm border border-emerald-100/50 text-sm font-medium text-gray-800 leading-relaxed shadow-sm">
                              <p className="mb-2"><strong>Absolutely.</strong> I've created a new goal "Car Fund" with a target of $15,000 by May 2027.</p>
                              <p>I've also reallocated $250/mo from your Dining budget to keep you on track. <span className="font-bold text-emerald-700 cursor-pointer hover:underline">Review changes</span></p>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="min-h-screen flex flex-col justify-center py-20 bg-white">
         <div className="max-w-7xl mx-auto px-6 w-full">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
              className="text-center mb-16"
            >
               <div className="text-verdant-dark font-black text-[10px] uppercase tracking-[0.2em] mb-4">Pricing</div>
               <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900 mb-4">Simple, transparent plans.</h2>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
               <PricingCard 
                  title="Starter"
                  price="$14"
                  features={['Unlimited Accounts', 'Basic AI Insights', 'Real-time Sync', 'Standard Security']}
                  cta="Get Started"
               />
               <PricingCard 
                  title="Professional"
                  price="$49"
                  features={['Institutional Access', 'Advanced AI Engine', 'Priority Support', 'White-glove Onboarding']}
                  cta="Contact Sales"
                  highlight
               />
            </motion.div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 pt-16 pb-8 border-t border-gray-200">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
               {/* Brand */}
               <div className="max-w-xs">
                  <div className="flex items-center gap-2.5 mb-5">
                     <div className="w-9 h-9 bg-[#106E4E] rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                        <Wallet size={18} />
                     </div>
                     <span className="text-xl font-black text-gray-900 tracking-tight">Verdant</span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                     The future of wealth management. AI-powered, design-driven, and built for those who build.
                  </p>
                  <div className="flex items-center gap-3 mt-6">
                     <a href="#" className="w-9 h-9 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all shadow-sm">
                        <Globe size={15} />
                     </a>
                     <a href="#" className="w-9 h-9 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all shadow-sm">
                        <TrendingUp size={15} />
                     </a>
                  </div>
               </div>
               {/* Links */}
               <div className="flex gap-20">
                  <div>
                     <h4 className="font-black text-gray-900 mb-5 text-xs uppercase tracking-widest">Product</h4>
                     <ul className="space-y-3 text-sm">
                        <li><a href="#features" className="text-gray-500 hover:text-[#106E4E] transition-colors font-medium">Features</a></li>
                        <li><a href="#pricing" className="text-gray-500 hover:text-[#106E4E] transition-colors font-medium">Pricing</a></li>
                        <li><a href="#ai-section" className="text-gray-500 hover:text-[#106E4E] transition-colors font-medium">AI Engine</a></li>
                        <li><Link to="/security" className="text-gray-500 hover:text-[#106E4E] transition-colors font-medium">Security</Link></li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-black text-gray-900 mb-5 text-xs uppercase tracking-widest">Company</h4>
                     <ul className="space-y-3 text-sm">
                        <li><Link to="/about" className="text-gray-500 hover:text-[#106E4E] transition-colors font-medium">About</Link></li>
                        <li><Link to="/blog" className="text-gray-500 hover:text-[#106E4E] transition-colors font-medium">Blog</Link></li>
                        <li><Link to="/careers" className="text-gray-500 hover:text-[#106E4E] transition-colors font-medium">Careers</Link></li>
                        <li><Link to="/contact" className="text-gray-500 hover:text-[#106E4E] transition-colors font-medium">Contact</Link></li>
                     </ul>
                  </div>
               </div>
            </div>
            <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
               <p className="text-xs font-medium text-gray-400">© 2026 Verdant Wealth. All rights reserved.</p>
               <div className="flex gap-6 text-xs text-gray-400 font-medium">
                  <Link to="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
                  <Link to="/terms" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
   return (
      <motion.div variants={fadeInUp} className="group">
         <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-verdant-dark group-hover:text-white transition-all duration-300">
            {icon}
         </div>
         <h3 className="text-lg font-black text-gray-900 mb-2">{title}</h3>
         <p className="text-gray-500 text-sm font-medium leading-relaxed">{description}</p>
      </motion.div>
   );
}

function PricingCard({ title, price, features, cta, highlight }) {
   return (
      <motion.div variants={fadeInUp} className={`p-10 rounded-[2rem] border transition-all duration-300 ${highlight ? 'bg-verdant-dark text-white border-verdant-dark shadow-2xl shadow-verdant-dark/20' : 'bg-[#F8FAFC] text-gray-900 border-gray-200 shadow-sm'}`}>
         <h3 className={`text-base font-black mb-3 ${highlight ? 'text-verdant-accent' : 'text-gray-500'}`}>{title}</h3>
         <div className="text-5xl font-black mb-8 tracking-tighter">{price}</div>
         <ul className="space-y-4 mb-10">
            {features.map((f, i) => (
               <li key={i} className="flex items-center gap-3 font-medium text-sm">
                  <CheckCircle2 size={18} className={highlight ? 'text-verdant-accent' : 'text-verdant-dark'} />
                  {f}
               </li>
            ))}
         </ul>
         <Link to="/auth" className="block w-full">
            <button className={`w-full py-3.5 rounded-xl font-black text-sm transition-all ${highlight ? 'bg-white text-verdant-dark hover:bg-verdant-accent' : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 shadow-sm'}`}>
               {cta}
            </button>
         </Link>
      </motion.div>
   );
}
