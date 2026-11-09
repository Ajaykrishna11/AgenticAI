import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Camera, Bot, Clock, Bell, Package, BarChart3, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch {
      navigate('/login');
    }
  };

  const features = [
    { icon: Camera, title: 'Scan Products', desc: 'Capture or upload images of food, medicine, and cosmetics for automated OCR analysis.' },
    { icon: Bot, title: 'AI Detection', desc: 'Auto-detect manufacturing date, expiry date, brand, category, and storage recommendations.' },
    { icon: Clock, title: 'Expiry Monitoring', desc: 'Autonomous daily scanning agent that calculates remaining shelf-life days.' },
    { icon: Bell, title: 'Smart Alerts', desc: 'Priority notifications (Low, Medium, High, Critical) before items expire.' },
    { icon: Package, title: 'Inventory Control', desc: 'Organize by Refrigerator, Medicine Box, Pantry, Bathroom, or custom locations.' },
    { icon: BarChart3, title: 'Food Waste Analytics', desc: 'Track waste rate percentage, category breakdown, and monthly consumption trends.' }
  ];

  const steps = [
    { number: '01', title: 'Scan Product', desc: 'Use phone camera or upload a packaging photo.' },
    { number: '02', title: 'AI Extracts Details', desc: 'OCR pipeline identifies EXP/MFG dates and brand.' },
    { number: '03', title: 'Confirm & Save', desc: 'Review extracted info and save to inventory.' },
    { number: '04', title: 'Autonomous Monitoring', desc: 'Expiry Agent checks remaining days automatically.' },
    { number: '05', title: 'Receive Smart Alerts', desc: 'Get timely alerts & recipe usage recommendations.' }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between border-b border-gray-800/60 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">SmartShelf <span className="text-emerald-400 font-mono text-xs px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60">AI</span></span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDemoClick}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-sm transition-all"
          >
            ⚡ Try Demo Mode
          </button>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 font-semibold text-sm border border-gray-800 transition-all"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-16 lg:py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-8 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" /> Agentic AI-Powered Household Inventory Management
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Never Forget an <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Expiry Date</span> Again.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Smart AI-powered inventory and expiry management for your food, medicines, groceries, cosmetics, and household items. Reduce food wastage and save money automatically.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>

          <button
            onClick={handleDemoClick}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gray-900/90 hover:bg-gray-800 text-emerald-300 font-bold text-base border border-emerald-500/30 shadow-lg transition-all"
          >
            ⚡ Live Demo Dashboard
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-panel p-6 rounded-2xl border border-gray-800 hover:border-emerald-500/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* How It Works Pipeline */}
        <div className="mt-28 py-12 border-t border-gray-800/80">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">How SmartShelf AI Works</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-12">Seamless end-to-end computer vision and multi-agent coordination.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
            {steps.map((s, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-gray-800/80 relative">
                <span className="font-mono text-2xl font-black text-emerald-400/50 block mb-2">{s.number}</span>
                <h4 className="font-bold text-white text-sm mb-1">{s.title}</h4>
                <p className="text-xs text-gray-400 leading-normal">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-gray-800 text-center text-xs text-gray-500">
        SmartShelf AI © 2026. Built with Agentic AI, Computer Vision OCR, and Full-Stack Engineering.
      </footer>
    </div>
  );
};
