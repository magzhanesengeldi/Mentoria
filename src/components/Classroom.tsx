import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Course, Lesson } from '../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SAMPLE_COURSES } from '../lib/dbSeeder';
import Markdown from 'react-markdown';
import { BookOpen, ArrowLeft, CheckCircle, Sparkles, AlertCircle, Award, HelpCircle } from 'lucide-react';

export const Classroom: React.FC = () => {
  const { profile, completeLesson } = useAuth();
  const [courses, setCourses] = useState<Course[]>(SAMPLE_COURSES);
  const loading = false;

  // Active navigation inside Classroom
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Interactive Quiz State
  const [quizAnswerIdx, setQuizAnswerIdx] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  // Load courses background synchronization
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        if (!querySnapshot.empty) {
          const list: Course[] = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as Course);
          });
          setCourses(list);
        }
      } catch (err) {
        console.error("Background error loading curriculum tracks:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setSelectedLesson(null);
    setQuizSubmitted(false);
    setQuizAnswerIdx(null);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setQuizAnswerIdx(null);
    setQuizSubmitted(false);
    setQuizSuccess(false);
  };

  const handleAnswerQuiz = (optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswerIdx(optionIdx);
  };

  const evalQuiz = () => {
    if (quizAnswerIdx === null || !selectedLesson?.question) return;
    
    const isCorrect = quizAnswerIdx === selectedLesson.question.correctIndex;
    setQuizSuccess(isCorrect);
    setQuizSubmitted(true);

    if (isCorrect && selectedCourse) {
      // Opt-in local context completion tracking
      completeLesson(`${selectedCourse.id}_${selectedLesson.id}`);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    if (!profile || !selectedCourse) return false;
    return profile.completedLessons.includes(`${selectedCourse.id}_${lessonId}`);
  };

  const getCourseProgressPercentage = (course: Course) => {
    if (!profile) return 0;
    const count = profile.completedLessons.filter(id => id.startsWith(course.id)).length;
    return Math.min(Math.round((count / course.lessonsCount) * 100), 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 relative text-zinc-100">
      
      {/* Visual background element */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* VIEW LEVEL A: Course Catalogue index */}
      {!selectedCourse ? (
        <div className="space-y-8">
          
          {/* Header banner */}
          <div className="pb-6 border-b border-zinc-800 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Mentorship Classrooms</span>
            </div>
            <h2 className="text-3xl font-light text-zinc-100 tracking-tight">
              Interactive <span className="font-semibold text-white">Study Curriculum Decks</span>
            </h2>
            <p className="text-xs text-zinc-550 max-w-lg leading-relaxed">
              Tackle diagnostic pre-college SAT drills, formal scholarly research standards, and olympiad-level algorithm proofs. Complete quizzes to unlock credentials.
            </p>
          </div>

          {/* Courses grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const compPct = getCourseProgressPercentage(course);
              return (
                <div 
                  key={course.id}
                  className="bg-zinc-920/80 border border-zinc-900 rounded-2xl p-6 hover:border-zinc-800 hover:bg-zinc-900 transition-all duration-300 flex flex-col justify-between shadow-xl group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-zinc-950 text-zinc-400 border border-zinc-850 text-[9px] rounded font-bold uppercase tracking-widest">
                        {course.category}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{course.lessonsCount} Core Modules</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] text-zinc-500 font-bold block uppercase tracking-wider">Directed by {course.instructor}</span>
                      <h4 className="text-lg font-semibold text-zinc-200 group-hover:text-white tracking-tight leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light line-clamp-3">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress segment */}
                  <div className="mt-8 pt-4 border-t border-zinc-905 flex flex-col gap-3">
                    <div className="flex justify-between items-baseline text-[10px]">
                      <span className="text-zinc-500 uppercase tracking-widest font-bold">Track Mastery</span>
                      <span className="font-mono font-bold text-indigo-400">{compPct}%</span>
                    </div>
                    {/* Tiny styled slider */}
                    <div className="h-1.5 bg-zinc-950 border border-zinc-855 rounded-full w-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${compPct}%` }} />
                    </div>

                    <button
                      onClick={() => handleSelectCourse(course)}
                      className="mt-2 w-full py-2 bg-zinc-900 group-hover:bg-indigo-600 border group-hover:border-indigo-500 border-zinc-800 text-zinc-300 group-hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition"
                    >
                      Enter Deck
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* VIEW LEVEL B: Individual Course detail & Reader view */
        <div className="space-y-6">
          
          {/* Back trigger bar */}
          <button
            onClick={() => setSelectedCourse(null)}
            className="flex items-center gap-1.5 text-xs text-zinc-450 hover:text-white uppercase tracking-widest font-bold cursor-pointer transition bg-transparent border-none"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Catalog</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Rail (4 Cols) - Syllabus List */}
            <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5">
              
              <div className="border-b border-zinc-800/80 pb-3">
                <span className="text-[8px] text-zinc-550 font-black uppercase tracking-widest">{selectedCourse.category} Track</span>
                <h3 className="font-semibold text-zinc-200 text-md leading-tight mt-1">{selectedCourse.title}</h3>
                <p className="text-[10px] text-zinc-450 mt-1 uppercase tracking-wider">Instructor: {selectedCourse.instructor}</p>
              </div>

              {/* Lesson playlist */}
              <div className="space-y-2">
                <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Syllabus Flow</span>
                {selectedCourse.lessons.map((lesson, idx) => {
                  const completed = isLessonCompleted(lesson.id);
                  const isReading = selectedLesson?.id === lesson.id;
                  
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson)}
                      className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${
                        isReading 
                          ? 'bg-zinc-855 border-indigo-500' 
                          : 'bg-zinc-950 border-zinc-900/60 hover:bg-zinc-850'
                      }`}
                    >
                      <div className={`mt-0.5 h-4.5 w-4.5 rounded-full flex items-center justify-center border font-mono text-[9px] font-bold ${
                        completed 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}>
                        {completed ? '✓' : idx + 1}
                      </div>

                      <div className="flex-1 space-y-0.5">
                        <p className={`text-xs font-semibold leading-tight ${isReading ? 'text-white' : 'text-zinc-200'}`}>
                          {lesson.title}
                        </p>
                        <span className="text-[9px] text-zinc-500 block">{lesson.duration} instruction</span>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Right Reader Desk (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {selectedLesson ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-8 min-h-[50vh]">
                  
                  {/* Lesson Heading */}
                  <div className="border-b border-zinc-800 pb-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wide">Instructor Lecture Notes</span>
                      {isLessonCompleted(selectedLesson.id) && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-550/10 border border-emerald-500/20 text-emerald-400 text-[9px] rounded-full font-bold uppercase tracking-wider">
                          <CheckCircle className="h-3 w-3" />
                          <span>Credentials Earned</span>
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-light text-zinc-100 tracking-tight leading-snug">{selectedLesson.title}</h2>
                    <p className="text-[10px] text-zinc-450 uppercase tracking-widest">Duration: {selectedLesson.duration} • Markdown Compatible Layout</p>
                  </div>

                  {/* Rendering Lesson markdown contents */}
                  <div className="markdown-body text-sm text-zinc-300 leading-relaxed font-light space-y-4">
                    <Markdown>{selectedLesson.content}</Markdown>
                  </div>

                  {/* QUIZ PORTLET */}
                  {selectedLesson.question && (
                    <div className="border border-zinc-805 bg-zinc-950 p-5 md:p-6 rounded-2xl space-y-5">
                      <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                        <HelpCircle className="h-4 w-4" />
                        <span>Interactive Comprehension Quiz</span>
                      </h4>

                      <p className="text-sm text-zinc-200 font-medium">
                        {selectedLesson.question.quizText}
                      </p>

                      {/* Quiz options */}
                      <div className="space-y-2.5">
                        {selectedLesson.question.options.map((opt, oIdx) => {
                          const isSelected = quizAnswerIdx === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleAnswerQuiz(oIdx)}
                              disabled={quizSubmitted}
                              className={`w-full p-3.5 text-left text-xs rounded-xl border transition flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 font-semibold'
                                  : 'bg-zinc-900 border-zinc-850 hover:bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              <span>{opt}</span>
                              <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-indigo-400 bg-indigo-500/20' : 'border-zinc-700'}`}>
                                {isSelected && <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Action trigger */}
                      {!quizSubmitted ? (
                        <button
                          onClick={evalQuiz}
                          disabled={quizAnswerIdx === null}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition cursor-pointer"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        /* Feedback results */
                        <div className={`p-4 rounded-xl border space-y-2 ${
                          quizSuccess
                            ? 'bg-emerald-500/10 border-emerald-550/30 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-550/30 text-rose-450'
                        }`}>
                          <div className="flex items-center gap-2">
                            {quizSuccess ? <Award className="h-4 w-4 text-emerald-400 animate-bounce" /> : <AlertCircle className="h-4 w-4 text-rose-400" />}
                            <strong className="text-sm font-bold uppercase tracking-wider">{quizSuccess ? 'Answer Correct!' : 'Incorrect Answer'}</strong>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed font-light">{selectedLesson.question.explanation}</p>
                          
                          {!quizSuccess && (
                            <button 
                              onClick={() => { setQuizSubmitted(false); setQuizAnswerIdx(null); }}
                              className="text-[10px] text-indigo-400 underline font-bold uppercase tracking-widest mt-2 block cursor-pointer"
                            >
                              Try again
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center min-h-[50vh] flex flex-col justify-center items-center space-y-4">
                  <BookOpen className="h-12 w-12 text-zinc-700 animate-pulse" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-zinc-400 uppercase tracking-widest text-xs">Awaiting Class Entrance</h4>
                    <p className="text-xs text-zinc-500 max-w-sm">
                      Select any of the curriculum modules on the left rail playlist to load the interactive lectern paper content notes.
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
export default Classroom;
