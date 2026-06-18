import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Landing } from './components/Landing';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Opportunities } from './components/Opportunities';
import { Classroom } from './components/Classroom';
import { AIAssistant } from './components/AIAssistant';
import { LogOut, Menu, X } from 'lucide-react';

type NavView = 'dashboard' | 'opportunities' | 'classroom' | 'onboarding' | 'landing';

const MainAppContent: React.FC = () => {
  const { user, profile, loading, logout } = useAuth();
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If initial load in progress, show spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent mx-auto" />
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Constructing Profile Slate...</p>
        </div>
      </div>
    );
  }

  // 1. If no authenticated user, stay on Landing
  if (!user) {
    return <Landing />;
  }

  // 2. If logged in but hasn't completed onboarding quiz, force it
  if (profile && !profile.onboarded) {
    return <Onboarding onNav={(view) => setActiveView(view as NavView)} />;
  }

  // Define views layout structure switcher
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNav={(view) => setActiveView(view as NavView)} />;
      case 'opportunities':
        return <Opportunities />;
      case 'classroom':
        return <Classroom />;
      case 'onboarding':
        return <Onboarding onNav={(view) => setActiveView(view as NavView)} />;
      default:
        return <Dashboard onNav={(view) => setActiveView(view as NavView)} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col justify-between overflow-x-hidden">
      
      {/* Top Editorial Nav Bar */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        
        {/* Brand identity */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 bg-transparent border-none text-left p-0 cursor-pointer"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="font-semibold tracking-tight text-xl text-white">Mentoria<span className="text-indigo-400">Hub</span></span>
          </button>

          {/* Desktop links navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest font-black">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`transition cursor-pointer ${activeView === 'dashboard' ? 'text-indigo-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('opportunities')}
              className={`transition cursor-pointer ${activeView === 'opportunities' ? 'text-indigo-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Opportunities
            </button>
            <button
              onClick={() => setActiveView('classroom')}
              className={`transition cursor-pointer ${activeView === 'classroom' ? 'text-indigo-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Classroom Decks
            </button>
          </nav>
        </div>

        {/* User Badge or Mobile Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:text-right">
            <p className="text-xs font-semibold text-zinc-200">{profile?.displayName || ' Alex Rivers'}</p>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest">
              Grade {profile?.grade || '10'} • {profile?.interests[0] || 'STEM'} Track
            </p>
          </div>

          <div className="hidden sm:flex w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900/60 items-center justify-center font-mono text-xs font-extrabold text-zinc-300">
            {(profile?.displayName || 'AR').slice(0, 2).toUpperCase()}
          </div>

          <button
            onClick={logout}
            title="Log Out Profile"
            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:text-rose-400 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 md:hidden text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </header>

      {/* Mobile Links Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="bg-zinc-950 border-b border-zinc-800 px-6 py-4 space-y-3 md:hidden z-30 relative font-bold uppercase tracking-wider text-xs">
          <button
            onClick={() => { setActiveView('dashboard'); setMobileMenuOpen(false); }}
            className="w-full text-left py-1 text-zinc-350 hover:text-white block"
          >
            Dashboard
          </button>
          <button
            onClick={() => { setActiveView('opportunities'); setMobileMenuOpen(false); }}
            className="w-full text-left py-1 text-zinc-350 hover:text-white block"
          >
            Opportunities
          </button>
          <button
            onClick={() => { setActiveView('classroom'); setMobileMenuOpen(false); }}
            className="w-full text-left py-1 text-zinc-350 hover:text-white block"
          >
            Classroom Decks
          </button>
          <div className="pt-2 border-t border-zinc-900 text-[10px] text-zinc-500">
            Grade {profile?.grade || '10'} • {profile?.interests.join(', ')}
          </div>
        </div>
      )}

      {/* Main app viewport container */}
      <main className="flex-1 pb-16">
        {renderActiveView()}
        <AIAssistant />
      </main>

      {/* Bottom Editorial Footer */}
      <footer className="h-8 border-t border-zinc-800 bg-zinc-950 px-6 flex items-center justify-between mt-auto text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span>Cloud Sync Active</span>
          </div>
          <span className="text-zinc-800 text-xs">|</span>
          <span>Firebase: Connected</span>
        </div>
        <span>Mentoria Hub v1.0.4 Early Access</span>
      </footer>

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
