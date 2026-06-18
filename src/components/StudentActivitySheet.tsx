import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  Timer, 
  UserCheck 
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  milestone: string;
  score: number;
  kudos: number;
}

export const StudentActivitySheet: React.FC = () => {
  // Gamified Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([
    { id: '1', name: 'Magzhan Esengeldi', milestone: 'ISSAI Draft Master & USACO Gold', score: 285, kudos: 42 },
    { id: '2', name: 'Zayn S.', milestone: 'USACO Silver Class Completed', score: 240, kudos: 29 },
    { id: '3', name: 'Claire W.', milestone: 'Wharton Portfolio 1st Place', score: 225, kudos: 36 },
    { id: '4', name: 'Alex Rivers (You)', milestone: 'Exploring Scholar Tracks', score: 85, kudos: 12 },
    { id: '5', name: 'Aruzhan K.', milestone: 'Regeneron STS Semifinalist', score: 210, kudos: 25 },
  ]);

  // Daily Challenge Quiz State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [challengeCorrect, setChallengeCorrect] = useState(false);

  // Live kudos interaction state
  const [kudosGiven, setKudosGiven] = useState<Record<string, boolean>>({});

  const DAILY_CHALLENGE = {
    category: 'USACO / Algebra Olympiad',
    question: 'An algorithm has a time complexity of O(N log N). For an input array size of N = 8, approximately how many operations will be executed?',
    options: [
      '8 operations',
      '24 operations (8 * log2(8))',
      '64 operations (8 * 8)',
      '1 operations (constant time)'
    ],
    correctIdx: 1,
    pointsAwarded: 15,
    explanation: 'Since log2(8) = 3, N log N yields 8 * 3 = 24 operations. This runs near-instantaneously.'
  };

  const handleKudos = (userId: string) => {
    if (kudosGiven[userId]) return;

    setKudosGiven(prev => ({ ...prev, [userId]: true }));
    setLeaderboard(prev => 
      prev.map(user => {
        if (user.id === userId) {
          return { ...user, kudos: user.kudos + 1, score: user.score + 5 };
        }
        return user;
      })
    );
  };

  const handleSubmission = () => {
    if (selectedOption === null || challengeSubmitted) return;

    const isCorrect = selectedOption === DAILY_CHALLENGE.correctIdx;
    setChallengeCorrect(isCorrect);
    setChallengeSubmitted(true);

    if (isCorrect) {
      setLeaderboard(prev => 
        prev.map(user => {
          if (user.id === '4') {
            return { ...user, score: user.score + DAILY_CHALLENGE.pointsAwarded };
          }
          return user;
        })
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
      
      {/* Container A: Daily Olympiad Drill */}
      <div className="bg-[#0b0b0e] border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[9px] font-bold uppercase tracking-wider">
              <Timer className="h-3 w-3 animate-pulse text-indigo-400" />
              <span>Daily Olympiad Gym</span>
            </span>
            <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Gain +{DAILY_CHALLENGE.pointsAwarded} Score</span>
          </div>

          <div className="space-y-2">
            <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-black block">{DAILY_CHALLENGE.category}</span>
            <h4 className="text-sm font-semibold text-zinc-200 tracking-tight leading-snug">
              {DAILY_CHALLENGE.question}
            </h4>
          </div>

          {/* Interactive Options list */}
          <div className="space-y-2 pt-2">
            {DAILY_CHALLENGE.options.map((opt, idx) => {
              const selected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => !challengeSubmitted && setSelectedOption(idx)}
                  disabled={challengeSubmitted}
                  className={`w-full p-3 text-left text-xs rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    selected 
                      ? 'bg-indigo-650/15 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-zinc-950 border-zinc-900 hover:bg-zinc-90 w-full hover:border-zinc-800 text-zinc-400'
                  }`}
                >
                  <span>{opt}</span>
                  <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${selected ? 'border-indigo-400 bg-indigo-500/30' : 'border-zinc-800'}`}>
                    {selected && <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Triggers */}
        <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between">
          {!challengeSubmitted ? (
            <button
              onClick={handleSubmission}
              disabled={selectedOption === null}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest transition cursor-pointer"
            >
              Verify Equation
            </button>
          ) : (
            <div className={`w-full p-3 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
              challengeCorrect 
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/5 border-red-500/20 text-red-400'
            }`}>
              <div className="flex items-center gap-1.5">
                {challengeCorrect ? <Trophy className="h-4 w-4 text-emerald-400" /> : <Award className="h-4 w-4 text-red-400" />}
                <strong className="font-bold uppercase tracking-wider">{challengeCorrect ? 'Awesome! Gym level cleared' : 'Check Explanation'}</strong>
              </div>
              <p className="text-[11px] text-zinc-300 font-light">{DAILY_CHALLENGE.explanation}</p>
            </div>
          )}
        </div>

      </div>

      {/* Container B: Cohort Leaderboard & Kudos */}
      <div className="bg-[#0b0b0e] border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-purple-400 animate-bounce" />
              <span>Cohort Scholar Board</span>
            </h4>
            <span className="text-[9px] bg-zinc-900 border border-zinc-850 text-zinc-500 px-2 py-0.5 rounded font-mono font-bold uppercase">YC Cohort-Beta</span>
          </div>

          {/* Leaderboard flow stack */}
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {leaderboard
              .sort((a,b) => b.score - a.score)
              .map((u, idx) => {
                const isCurrentUser = u.id === '4';
                const hasKudosed = kudosGiven[u.id];

                return (
                  <div 
                    key={u.id} 
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                      isCurrentUser 
                        ? 'bg-indigo-650/10 border-indigo-500/30' 
                        : 'bg-zinc-950/40 border-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Placement number highlight */}
                      <span className={`font-mono font-black text-[11px] w-4 text-center ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-zinc-300' : 'text-zinc-550'}`}>
                        {idx + 1}
                      </span>

                      {/* Name & custom status tag */}
                      <div className="text-left min-w-0">
                        <span className={`font-bold block truncate ${isCurrentUser ? 'text-white' : 'text-zinc-200'}`}>
                          {u.name}
                        </span>
                        <span className="text-[9px] text-zinc-500 block truncate leading-tight">{u.milestone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Score point label */}
                      <div className="text-right">
                        <span className="block text-[10px] font-black font-mono text-zinc-200">{u.score}</span>
                        <span className="block text-[8px] text-zinc-650 uppercase font-black tracking-widest mt-0.5">pts</span>
                      </div>

                      {/* Kudos Interaction */}
                      <button
                        onClick={() => handleKudos(u.id)}
                        disabled={hasKudosed || isCurrentUser}
                        className={`px-2 py-1.5 rounded-lg border transition-all flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold ${
                          hasKudosed 
                            ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                            : isCurrentUser
                              ? 'border-transparent text-zinc-600 bg-transparent cursor-not-allowed'
                              : 'border-zinc-800 bg-[#0d0d12] hover:border-zinc-700 hover:text-white text-zinc-400 cursor-pointer'
                        }`}
                      >
                        <Flame className={`h-3 w-3 ${hasKudosed ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
                        <span>{u.kudos}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
          </div>
        </div>

        {/* Live System Synchronization ticker */}
        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest pt-2 border-t border-zinc-900 text-center flex items-center justify-center gap-1">
          <UserCheck className="h-3 w-3 text-emerald-500" />
          <span>Real-time Sandbox score updates online</span>
        </p>
      </div>

    </div>
  );
};
