import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Plus, Trash2, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onNav: (view: 'dashboard' | 'opportunities' | 'classroom' | 'landing') => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onNav }) => {
  const { profile, saveOnboardingProfile } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [grade, setGrade] = useState(profile?.grade || '10');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile?.interests || ['Programming', 'Research', 'Business']);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(profile?.weeklyGoal || 5);
  
  // Custom goals
  const [goals, setGoals] = useState<string[]>(profile?.goals || [
    'Apply for 2 summer research programs',
    'Complete the Digital SAT Math module'
  ]);
  const [newGoalText, setNewGoalText] = useState('');

  const interestsList = ['STEM', 'Programming', 'Research', 'Business', 'Humanities', 'Arts'];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(x => x !== interest)
        : [...prev, interest]
    );
  };

  const handleAddGoal = () => {
    if (newGoalText.trim()) {
      setGoals(prev => [...prev, newGoalText.trim()]);
      setNewGoalText('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    setGoals(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || selectedInterests.length === 0) {
      alert("Please provide your name and select at least 1 interest category.");
      return;
    }

    try {
      await saveOnboardingProfile({
        displayName: displayName.trim(),
        grade,
        interests: selectedInterests,
        goals,
        weeklyGoal
      });
      onNav('dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 max-w-4xl mx-auto flex flex-col justify-center relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="space-y-6">
        
        {/* Breadcrumb / Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-505/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            <span>Onboarding Engine</span>
          </div>
          <h2 className="text-3xl font-extralight text-white tracking-tight">
            Configure Your <span className="font-semibold text-indigo-400">Profile Slate</span>
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl">
            Mentoria Hub scores fellowships, research slots, and Olympiads using real-time parameter matching against your grade and study tracks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Field 1: Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Your Full Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Rivers"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Field 2: School Academic Year */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold">High School Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="9">Grade 9 (Freshman)</option>
                <option value="10">Grade 10 (Sophomore)</option>
                <option value="11">Grade 11 (Junior)</option>
                <option value="12">Grade 12 (Senior)</option>
              </select>
            </div>

          </div>

          {/* Interests Category Checklist */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Target Core Interests</label>
              <p className="text-xs text-zinc-550">We will recommend matching fellowship directories and syllabus decks based on these interests.</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {interestsList.map((interest) => {
                const isActive = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-2 text-xs rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300 font-semibold'
                        : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weekly Task Goal Sliders */}
          <div className="space-y-3 border-t border-zinc-800/60 pt-6">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Weekly Application Target</label>
              <p className="text-xs text-zinc-550">Identify how many applications, course elements, or tasks you plan to secure each week.</p>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={weeklyGoal} 
                onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                className="flex-1 accent-indigo-500 bg-zinc-950 h-1.5 rounded-full outline-none"
              />
              <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 font-mono text-zinc-100 font-bold text-xs rounded-lg">
                {weeklyGoal} Target tasks/week
              </span>
            </div>
          </div>

          {/* Dynamic Goals Section */}
          <div className="space-y-3 border-t border-zinc-800/60 pt-6">
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Custom Focus Goals</label>
            
            {/* List existing goals */}
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <span className="text-xs text-zinc-300">{goal}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(index)}
                    className="text-zinc-600 hover:text-rose-450 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Input field to add a goal */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Finish Pioneer Academics preliminary proposal"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddGoal}
                className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl flex items-center gap-1 border border-zinc-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Goal</span>
              </button>
            </div>
          </div>

          {/* Launch Applet Submit Block */}
          <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
            <p className="text-[10px] text-zinc-500">Automatically provisions and synchronizes your parameters.</p>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
            >
              <span>Sync Slate Profile</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
export default Onboarding;
