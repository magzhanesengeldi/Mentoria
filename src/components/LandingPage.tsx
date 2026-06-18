import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  GraduationCap, 
  FileCheck, 
  Award, 
  Users, 
  Lock, 
  UserCheck, 
  BookOpen 
} from 'lucide-react';

interface LandingPageProps {
  onNav: (view: 'landing' | 'onboarding' | 'dashboard' | 'opportunities' | 'classroom') => void;
  openAuthModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNav, openAuthModal }) => {
  const { user, profile, loginDemo, logout } = useAuth();
  const [demoLoading, setDemoLoading] = useState<number | null>(null);

  const handleDemoLogin = async (index: number) => {
    setDemoLoading(index);
    try {
      await loginDemo(index);
      onNav('dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setDemoLoading(null);
    }
  };

  const CARD_VARIANTS = {
    hover: { 
      y: -6, 
      borderColor: 'rgba(124, 58, 237, 0.4)',
      boxShadow: '0 10px 30px -10px rgba(79, 70, 229, 0.15)',
      transition: { duration: 0.2 } 
    }
  };

  const DEMO_PROFILES = [
    { name: 'Jane Doe', tag: 'STEM & Research Focus', class: 'border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-500/5' },
    { name: 'Alex Rivera', tag: 'Business & Finance', class: 'border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5' },
    { name: 'Sofia Chen', tag: 'Social Impact & IELTS', class: 'border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/5' },
    { name: 'Ryan Thompson', tag: 'Grades 8-9 & SAT Preparation', class: 'border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/5' }
  ];

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 overflow-hidden">
      {/* Dynamic Background Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_-10%,#000_100%,transparent_100%)] opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-indigo-500/10 via-purple-500/20 to-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Landing Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-900 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-450 bg-clip-text text-transparent">
              Mentoria<span className="text-indigo-500">Hub</span>
            </h1>
            <p className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">Next-Gen College Prep</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-400">Hello, {profile?.displayName || 'Student'}</span>
              <button 
                onClick={() => onNav('dashboard')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-md shadow-indigo-500/10"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => logout()}
                className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-medium rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={openAuthModal}
              className="px-4 py-2 bg-[#121214] border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-200 hover:text-white text-xs font-semibold rounded-lg transition"
            >
              Access Platform
            </button>
          )}
        </div>
      </header>

      {/* Hero Visual Area */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-xs text-indigo-400 mb-6 font-medium">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-500" />
          <span>The Premium High-School Opportunity & Learning Hub</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Unlock Prestigious <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
            Scholarships & Global Programs
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-zinc-400 text-base md:text-lg mb-8 leading-relaxed">
          Discover top-tier olympiads, summer research programs, fellowships, and startup challenges. 
          Combine discoveries with asynchronous premium curricula for the SAT, IELTS, and Economics.
        </p>

        {/* Dynamic Launch Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          {user ? (
            <button 
              onClick={() => onNav('dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              Open Candidate Slate
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <>
              <button 
                onClick={openAuthModal}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                Create Free Candidate Account
                <ArrowRight className="h-4 w-4" />
              </button>
              <a 
                href="#demo-section" 
                className="px-6 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-semibold rounded-xl text-sm transition"
              >
                Instant Student Simulation
              </a>
            </>
          )}
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left relative">
          
          {/* Card 1 */}
          <motion.div 
            variants={CARD_VARIANTS}
            whileHover="hover"
            className="p-6 rounded-2xl bg-[#0d0d10]/90 border border-zinc-900 flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                <Compass className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Curated Opportunities</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Filter through 10 deeply structured challenges including ISSAI summer programs, Stanford Business competitions, and international olympiads.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-900/50 flex justify-between items-center text-xs text-indigo-400 font-semibold">
              <span>EXPLORE DIRECTORIES</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={CARD_VARIANTS}
            whileHover="hover"
            className="p-6 rounded-2xl bg-[#0d0d10]/90 border border-zinc-900 flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                <BookOpen className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Asynchronous Theater</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Unlock 3 Master Courses (SAT Prep, IELTS, and Economics) featuring rich markdown text fields, media feeds, and custom reactive interactive quizzes.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-900/50 flex justify-between items-center text-xs text-purple-400 font-semibold">
              <span>EXPLORE ASSESSMENTS</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            variants={CARD_VARIANTS}
            whileHover="hover"
            className="p-6 rounded-2xl bg-[#0d0d10]/90 border border-zinc-900 flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6">
                <Sparkles className="h-5 w-5 text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Recommendation Engine</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                State normalization matches choices layout-wide. If you toggle interest in STEM or Business, the matrix automatically elevates corresponding material.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-900/50 flex justify-between items-center text-xs text-pink-400 font-semibold">
              <span>LEARN SCORING METRICS</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </motion.div>

        </div>

        {/* Quick Platform Metrics */}
        <div className="mt-20 py-10 border-y border-zinc-900 bg-[#0b0b0d]/50 max-w-5xl mx-auto rounded-xl grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-zinc-100 font-mono">10</p>
            <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase mt-1">SaaS Opportunities</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-indigo-400 font-mono">3</p>
            <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase mt-1">Master Courses</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-purple-400 font-mono">15</p>
            <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase mt-1">Graded Lectures</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-zinc-100 font-mono">5</p>
            <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase mt-1">Simulation Profiles</p>
          </div>
        </div>

        {/* Interactive Simulation Dashboard Profiles Panel */}
        <div id="demo-section" className="mt-24 max-w-4xl mx-auto p-8 rounded-2xl border border-zinc-900 bg-[#0d0d10]/90 text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">AI Studio Smoke-Testing Suite</h3>
              <p className="text-xs text-zinc-400">Select any preloaded demo biography to bypass forms and test the layout-wide recommender state instantly.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_PROFILES.map((deb, index) => (
              <button
                key={index}
                onClick={() => handleDemoLogin(index)}
                disabled={demoLoading !== null}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 group disabled:opacity-50 ${deb.class}`}
              >
                <div>
                  <h4 className="font-bold text-zinc-200 group-hover:text-white transition">{deb.name}</h4>
                  <p className="text-xs text-zinc-400 mt-1">{deb.tag}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-500 group-hover:text-indigo-400 font-semibold w-full">
                  <span>{demoLoading === index ? 'BOOTING SUITE...' : 'SIMULATE PROFILE'}</span>
                  {!demoLoading && <ArrowRight className="h-3 w-3 translate-x-0 group-hover:translate-x-1 transition-transform" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#08080a] py-8 text-zinc-600 text-xs text-center mt-20 relative z-10">
        <p>&copy; 2026 Mentoria Hub Corp. Preserving elite candidate outcomes.</p>
        <p className="mt-2 text-[10px] text-zinc-700 font-mono uppercase tracking-[0.2em]">Crafted for Grades 8-11</p>
      </footer>
    </div>
  );
};
