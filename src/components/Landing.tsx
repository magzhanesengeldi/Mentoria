import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { signInAnonymous, loading } = useAuth();
  const [userName, setUserName] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const handleDemoSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    setSigningIn(true);
    try {
      await signInAnonymous(userName.trim());
    } catch (err) {
      console.error(err);
    } finally {
      setSigningIn(false);
    }
  };

  const KEY_METRICS = [
    { title: '150+', desc: 'Elite Academic Competitions' },
    { title: 'MIT/Harvard', desc: 'Fellowship Target Aligns' },
    { title: 'USACO/YYGS', desc: 'Direct Action Pathways' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between overflow-x-hidden relative">
      {/* Subtle Grid Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      
      {/* Soft Indigo / Purple Atmosphere backlights */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Pristine Minimal Header bar */}
      <header className="h-16 border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md px-6 z-40 relative">
        <div className="max-w-5xl w-full mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 bg-indigo-650 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20"
            >
              <span className="text-white font-extrabold text-sm">M</span>
            </motion.div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold tracking-tight text-lg text-white">
                Mentoria<span className="text-indigo-400">Hub</span>
              </span>
              <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-black -mt-1">Academic Portfolio Slate</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-black">Secure Sandbox Active</span>
          </div>
        </div>
      </header>

      {/* Main Single-Screen Centered Entrance Layout */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center py-10 relative z-10">
        
        <div className="w-full max-w-md mx-auto space-y-8 text-center">
          
          {/* Tagline Animation */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-850 rounded-full text-[9px] font-bold uppercase tracking-widest text-zinc-400"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Core MVP Academic System</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-zinc-100">
              Unlock Elite <span className="font-extrabold text-gradient bg-gradient-to-r from-indigo-300 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Olympiads</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 font-light max-w-sm mx-auto leading-relaxed">
              Match grade-specific fellowships and manage Olympiad prep timelines backed by live AI strategic advising.
            </p>
          </motion.div>

          {/* Clean Portal Entrance Sign-In Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0b0b0e] border border-zinc-850 p-6 md:p-8 rounded-2xl shadow-2xl relative z-10 text-left space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold tracking-tight text-white flex items-center justify-between">
                <span>Access Sandbox Slate</span>
                <span className="text-[8px] font-mono tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded">DEMO</span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Type your full name to automatically populate matching scholastic target maps.
              </p>
            </div>

            <form onSubmit={handleDemoSignIn} className="space-y-4">
              
              <div className="space-y-1.5">
                <label htmlFor="name-input" className="block text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Scholar Full Name</label>
                <input
                  id="name-input"
                  type="text"
                  required
                  placeholder="e.g. Alex Rivers"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-700"
                />
              </div>

              <motion.button
                id="signin-btn"
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading || signingIn || !userName.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 disabled:opacity-50"
              >
                <span>{signingIn ? "Syncing Firebase..." : "Enter Portal"}</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>

            </form>

            <div className="pt-4 border-t border-zinc-900 text-center text-zinc-500 text-[9px] tracking-wide">
              🔒 Real-time Firestore document syncing module active
            </div>

          </motion.div>

          {/* Clean Metric List */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-900">
            {KEY_METRICS.map((metric, idx) => (
              <div key={idx} className="text-left">
                <span className="block text-sm font-black text-indigo-400 font-mono">{metric.title}</span>
                <span className="block text-[10px] text-zinc-500 tracking-tight leading-tight">{metric.desc}</span>
              </div>
            ))}
          </div>

        </div>

      </main>

      {/* Elegant Minimal Footer */}
      <footer className="shrink-0 border-t border-zinc-900 bg-zinc-950/20 px-6 py-6 z-10 relative">
        <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400">System Connected</span>
          </div>
          <span>Mentoria Hub © 2026 • Private Academic Directory</span>
        </div>
      </footer>
    </div>
  );
};
export default Landing;
