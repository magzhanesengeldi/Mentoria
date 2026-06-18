import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Opportunity, Course } from '../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  BookOpen, 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  ChevronRight, 
  School, 
  Hourglass, 
  Bookmark,
  ExternalLink,
  Target,
  ListTodo
} from 'lucide-react';

interface DashboardProps {
  onNav: (view: 'landing' | 'onboarding' | 'dashboard' | 'opportunities' | 'classroom') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNav }) => {
  const { profile, toggleFavorite, updateWeeklyGoal } = useAuth();
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Recommendations state
  const [recommendedOpp, setRecommendedOpp] = useState<Opportunity | null>(null);

  // Load backend catalog to calculate recommendations & bookmarks
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch Opportunities
        const oppsSnap = await getDocs(collection(db, 'opportunities'));
        const oppsList: Opportunity[] = [];
        oppsSnap.forEach((doc) => {
          oppsList.push({ id: doc.id, ...doc.data() } as Opportunity);
        });
        setOpportunities(oppsList);

        // Fetch Courses
        const coursesSnap = await getDocs(collection(db, 'courses'));
        const coursesList: Course[] = [];
        coursesSnap.forEach((doc) => {
          coursesList.push({ id: doc.id, ...doc.data() } as Course);
        });
        setCourses(coursesList);

      } catch (err) {
        console.error('Error fetching dashboard catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [profile]);

  // Recommendation calculations
  useEffect(() => {
    if (opportunities.length === 0 || !profile) return;

    // Scoring algorithm matching interests + details
    const scored = opportunities.map((opp) => {
      let score = 30; // baseline

      if (profile.interests.includes(opp.category)) {
        score += 40;
      }

      // Synergistic category overlap
      const stems = ['STEM', 'Programming', 'Research'];
      const business = ['Business', 'Finance'];
      
      const isOppStemType = stems.includes(opp.category);
      const hasUserStemInterest = profile.interests.some(x => stems.includes(x));
      const hasUserProgInterest = profile.interests.includes('Programming');

      const isOppBizType = business.includes(opp.category);
      const hasUserBizInterest = profile.interests.some(x => business.includes(x));

      if (isOppStemType && hasUserStemInterest) {
        score += 15;
      }
      
      if (opp.category === 'Programming' && hasUserProgInterest) {
        score += 20;
      }

      if (isOppBizType && hasUserBizInterest) {
        score += 15;
      }

      if (profile.goals && profile.goals.length > 0) {
        const goalStr = profile.goals.join(' ').toLowerCase();
        const keywords = opp.title.toLowerCase().split(' ').concat(opp.description.toLowerCase().split(' '));
        
        const overlaps = keywords.some(k => k.length > 4 && goalStr.includes(k));
        if (overlaps) {
          score += 15;
        }
      }

      return { opp, score: Math.min(score, 100) };
    });

    const sorted = scored.sort((a, b) => b.score - a.score);
    if (sorted.length > 0) {
      setRecommendedOpp(sorted[0].opp);
    }
  }, [opportunities, profile]);

  const calculateDaysRemaining = (deadlineStr: string) => {
    const today = new Date('2026-06-18T12:00:00Z');
    const deadDate = new Date(deadlineStr);
    
    const diffTime = deadDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const bookmarkedOpportunities = opportunities
    .filter((opp) => profile?.favorites.includes(opp.id))
    .map((opp) => ({
      ...opp,
      daysLeft: calculateDaysRemaining(opp.deadline)
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const getCompletedLessonsCount = () => {
    return profile?.completedLessons.length || 0;
  };

  const getCompletedCourseRatioString = (courseId: string, totalCount: number) => {
    if (!profile) return '0%';
    const count = profile.completedLessons.filter(id => id.startsWith(courseId)).length;
    return `${Math.min(Math.round((count / totalCount) * 100), 100)}%`;
  };

  const getWeeklyProgressRatio = () => {
    if (!profile) return { current: 3, target: 5, pct: 60 };
    const target = profile.weeklyGoal || 5;
    const completed = profile.favorites.length + profile.completedLessons.length;
    const pct = Math.min((completed / target) * 100, 100);
    return {
      current: completed,
      target,
      pct
    };
  };

  const weeklyProg = getWeeklyProgressRatio();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40 bg-zinc-950 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 relative text-zinc-100">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Greeting Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-[#0c0c0f] via-[#0d0d10] to-zinc-950 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            <span>Profile Slate Verified</span>
          </div>

          <h2 className="text-3xl font-light text-zinc-100 tracking-tight">
            Welcome back, <span className="font-semibold">{profile?.displayName || 'Student'}</span>
          </h2>

          <p className="text-sm text-zinc-400 max-w-xl">
            Registered as a <strong className="text-zinc-200">Grade {profile?.grade || '10'} scholar</strong>. Review your personalized discovery matches below.
          </p>

          {/* Interests display vector */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mr-2 block">My Tracks:</span>
            {profile?.interests.map((int) => (
              <span key={int} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-semibold uppercase">
                {int}
              </span>
            ))}
            <button
              onClick={() => onNav('onboarding')}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline ml-2 cursor-pointer bg-transparent border-none"
            >
              Update interests
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onNav('opportunities')}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition inline-flex items-center gap-1.5 shadow-lg shadow-indigo-600/10 self-stretch md:self-auto text-center justify-center cursor-pointer z-10"
        >
          <span>Find Opportunities</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Analytics Score Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#0d0d10] border border-zinc-800 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Completed Lessons</p>
            <p className="text-2xl font-semibold text-zinc-100 font-mono">{getCompletedLessonsCount()}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#0d0d10] border border-zinc-800 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Bookmarked Targets</p>
            <p className="text-2xl font-semibold text-zinc-100 font-mono">{profile?.favorites.length || 0}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Bookmark className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#0d0d10] border border-zinc-800 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Available Tracks</p>
            <p className="text-2xl font-semibold text-[#7c3aed] font-mono">{courses.length}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Editorial Main Content Layout block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main area (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top matched selection hero */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-6 space-y-6 shadow-xl relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-400" />
                <h3 className="font-bold text-zinc-200 text-xs uppercase tracking-widest">Top Match Selection</h3>
              </div>
              <span className="text-[8px] px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 font-black uppercase tracking-wider">
                Personalized Recommendation
              </span>
            </div>

            {recommendedOpp ? (
              <div className="space-y-5">
                
                {/* Image showcase */}
                <div className="h-48 w-full rounded-xl overflow-hidden bg-zinc-900 relative">
                  <img
                    referrerPolicy="no-referrer"
                    src={recommendedOpp.imageUrl}
                    alt={recommendedOpp.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  <span className="absolute bottom-3 left-4 text-[9px] uppercase font-bold text-white bg-indigo-600 px-2 py-0.5 rounded">
                    {recommendedOpp.category}
                  </span>
                </div>

                {/* Match Information */}
                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-500 font-bold flex items-center gap-1 uppercase tracking-wider">
                    <School className="h-3 w-3" />
                    {recommendedOpp.organization}
                  </span>
                  <h4 className="text-2xl font-light text-zinc-100 tracking-tight leading-snug">
                    {recommendedOpp.title}
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed font-light">
                    {recommendedOpp.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-800/60 bg-zinc-950/40 text-xs grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Target scholars</span>
                    <strong className="text-zinc-300 mt-1 block">{recommendedOpp.eligibility}</strong>
                  </div>
                  <div>
                    <span className="block text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Closing Date</span>
                    <strong className="text-zinc-300 mt-1 block">{recommendedOpp.deadline}</strong>
                  </div>
                </div>

                {/* Interactions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => toggleFavorite(recommendedOpp.id)}
                    className="px-4 py-3 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>{profile?.favorites.includes(recommendedOpp.id) ? 'Saved to Bookmarks' : 'Pin to Timeline'}</span>
                  </button>
                  <a
                    href={recommendedOpp.applicationUrl}
                    target="_blank"
                    rel="no-referrer"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <span>Visit Official Application</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 text-xs">
                Complete onboarding configuration to calculate matched selections.
              </div>
            )}
            
          </div>

          {/* Active Course Tracks panel */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0d0d10] p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-zinc-200 text-xs uppercase tracking-widest">Syllabus Track Status</h3>
            <div className="space-y-3">
              {courses.map((course) => {
                const compRatio = getCompletedCourseRatioString(course.id, course.lessonsCount);
                return (
                  <div key={course.id} className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 hover:bg-zinc-950/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-zinc-200">{course.title}</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Directed by {course.instructor}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-zinc-900 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[8px] text-zinc-500 uppercase font-black block tracking-wider">Progress</span>
                        <strong className="text-xs font-semibold text-zinc-300 font-mono">{compRatio}</strong>
                      </div>
                      <button
                        onClick={() => onNav('classroom')}
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Enter Course
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right main area (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Weekly goal tracker directly matching Editorial Aesthetic CSS layout */}
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Weekly Target Progress</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-indigo-300 uppercase tracking-widest font-bold">Goal Success</span>
                <span className="text-sm font-black font-mono">{weeklyProg.current} / {weeklyProg.target} tasks</span>
              </div>
              <p className="text-[10px] text-zinc-500">Each pinned opportunity and completed course lesson counts towards your target stats.</p>
              
              <div className="h-2 bg-zinc-950 rounded-full w-full overflow-hidden relative border border-zinc-850">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${weeklyProg.pct}%` }}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Goal adjustment:</span>
              <div className="flex gap-1">
                {[3, 5, 8].map((g) => (
                  <button
                    key={g}
                    onClick={() => updateWeeklyGoal(g)}
                    className={`px-1.5 py-0.5 rounded transition ${profile?.weeklyGoal === g ? 'bg-indigo-600 font-bold text-white' : 'bg-zinc-900 border border-zinc-800 hover:text-zinc-350'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines Vertical Countdown Box */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-5">
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span>Upcoming Deadlines</span>
              </h3>
            </div>

            {bookmarkedOpportunities.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-zinc-800 rounded-xl space-y-3">
                <Hourglass className="h-6 w-6 text-zinc-600 mx-auto" />
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed px-4">
                  Bookmark opportunities to unlock imminent countdown markers here.
                </p>
                <button
                  onClick={() => onNav('opportunities')}
                  className="px-3 py-1 bg-indigo-505/10 hover:bg-indigo-600 border border-indigo-500/25 text-indigo-300 hover:text-white rounded-lg text-[9px] font-bold uppercase transition"
                >
                  View Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
                {bookmarkedOpportunities.map((opp) => {
                  const daysLeft = opp.daysLeft;
                  const isUrgent = daysLeft <= 30;

                  return (
                    <div key={opp.id} className="relative pl-8 group">
                      {/* Interactive ring marker */}
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full bg-zinc-950 border-2 flex items-center justify-center transition-all ${
                        isUrgent ? 'border-red-500 group-hover:bg-red-950' : 'border-indigo-500 group-hover:bg-indigo-950'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isUrgent ? 'bg-red-500' : 'bg-indigo-500'}`} />
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-zinc-200 line-clamp-1">{opp.title}</p>
                          <span className="text-[9px] text-zinc-500 block uppercase tracking-widest mt-0.5">{opp.organization}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {daysLeft < 0 ? (
                            <span className="text-[8px] bg-zinc-850 px-1 py-0.5 rounded text-zinc-550 font-bold uppercase">Over</span>
                          ) : (
                            <span className={`text-[10px] font-bold font-mono ${isUrgent ? 'text-red-400' : 'text-indigo-400'}`}>
                              {daysLeft}d left
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Goals checklist */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest text-[#a1a1aa] font-semibold flex items-center gap-1.5">
              <ListTodo className="h-4 w-4 text-emerald-400" />
              <span>Academic Focus Milestones</span>
            </h3>
            
            {profile?.goals && profile.goals.length > 0 ? (
              <ul className="space-y-2.5">
                {profile.goals.map((g, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-xs border-b border-zinc-800/40 pb-2 text-zinc-300">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="leading-tight">{g}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[10px] text-zinc-500">Go to onboarding setup to specify explicit academic priority goals.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
export default Dashboard;
