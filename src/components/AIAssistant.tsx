import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, BrainCircuit, ArrowUpRight, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Markdown from 'react-markdown';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export const AIAssistant: React.FC = () => {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hey **${profile?.displayName || 'Explorer'}**! I'm your elite academic co-pilot and mentor. Ask me how to tackle upcoming deadlines, draft research statements, crackUSACO algorithms, or level up your college admission portfolio. How can I help you succeed today?`,
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput.trim();
    if (!textToSend || loading) return;

    if (!customText) {
      setChatInput('');
    }

    const newUserMessage: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          profile: profile,
          history: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      const newAssistantMessage: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: data.text || 'Sorry, I fell off-track for a moment. What was that?',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (err) {
      console.error('Advisor Fetch error:', err);
      const errorMessage: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: '⚠️ **Network Delay / Missing Key**: I was unable to reach the mentoring hub core. Please verify your `GEMINI_API_KEY` is configured in **Settings > Secrets** to enable server-side processing.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const PRESET_PROMPTS = [
    {
      label: 'Suggest Elite Programs',
      prompt: 'Based on my goals and grade, please suggest elite summer research programs or high school business leadership opportunities.',
      icon: GraduationCap,
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5'
    },
    {
      label: 'Build USACO/Math Plan',
      prompt: 'Can you sketch a rigorous 4-step preparation roadmap to advance in computing olympiads (USACO) and mathematics competitions this semester?',
      icon: BrainCircuit,
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5'
    },
    {
      label: 'Startup Portfolio Review',
      prompt: 'Analyze my academic milestones and pitch me a compelling resume-enhancing research project or startup idea that college admissions will love.',
      icon: Sparkles,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5'
    }
  ];

  return (
    <>
      {/* Floating Sparkle Action Badge */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          id="ai-badge-trigger"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 via-[#7c3aed] to-purple-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 cursor-pointer relative group border border-indigo-400/40"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 flex items-center justify-center text-[8px] font-bold">AI</span>
          </span>
          <BrainCircuit className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
        </motion.button>
      </div>

      {/* Dynamic Slide-Over Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />

            {/* Main Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              id="ai-academic-copilot-panel"
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl z-50 flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-zinc-850 bg-[#0d0d10] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow shadow-indigo-500/20">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
                      Mentoria AI Mentor
                      <span className="text-[8px] font-medium tracking-wide bg-indigo-600 px-1.5 py-0.5 rounded uppercase font-mono text-zinc-100">Live</span>
                    </h3>
                    <p className="text-[10px] text-zinc-400 tracking-wide font-medium">Academic Co-Pilot • Powered by Gemini 3.5</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chat Content Panel */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-zinc-950 flex flex-col justify-between">
                
                {/* Messages feed */}
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed border transition-all ${
                          msg.sender === 'user'
                            ? 'bg-indigo-600/10 border-indigo-500/25 text-zinc-100'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <Markdown
                          components={{
                            h3: ({ node, ...props }) => <h3 className="font-bold text-indigo-400 mt-2 mb-1 text-sm uppercase tracking-wider" {...props} />,
                            h4: ({ node, ...props }) => <h4 className="font-bold text-zinc-200 mt-1.5 mb-1" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                            li: ({ node, ...props }) => <li className="list-disc list-inside ml-2 text-zinc-350" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold text-zinc-100 text-indigo-400" {...props} />
                          }}
                        >
                          {msg.text}
                        </Markdown>
                        <span className="text-[8px] text-zinc-550 font-mono block text-right mt-2 font-bold uppercase">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 text-xs text-zinc-400 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Formulating Advisor Plan...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Preset Suggestions Block */}
                {messages.length === 1 && (
                  <div className="mt-8 space-y-2.5">
                    <p className="text-[9px] uppercase font-black tracking-widest text-zinc-550">Recommended Quick Starters</p>
                    <div className="grid grid-cols-1 gap-2">
                      {PRESET_PROMPTS.map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(item.prompt)}
                            disabled={loading}
                            className={`p-3 rounded-xl border text-left text-xs hover:border-indigo-500/40 transition-all flex items-center justify-between group text-zinc-300 hover:text-white cursor-pointer ${item.color}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                                <IconComponent className="h-3.5 w-3.5" />
                              </div>
                              <span className="font-semibold tracking-tight text-[11px]">{item.label}</span>
                            </div>
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-indigo-400" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Chat Input Footer */}
              <div className="p-4 border-t border-zinc-850 bg-[#0d0d10]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    id="ai-advisor-input"
                    type="text"
                    placeholder="Ask about USACO, SAT, Business..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-indigo-500 rounded-xl text-xs text-white"
                  />
                  <button
                    id="ai-advisor-send-btn"
                    type="submit"
                    disabled={loading || !chatInput.trim()}
                    className="h-9 w-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow shadow-indigo-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
                <p className="text-[8px] text-center text-zinc-500 tracking-wider font-bold uppercase mt-2.5">
                  Private & Secure Session • Direct Firebase Sync active
                </p>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
