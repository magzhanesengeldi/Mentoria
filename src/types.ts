export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  organization: string;
  eligibility: string;
  deadline: string;
  applicationUrl: string;
  imageUrl: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  question?: {
    quizText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  lessonsCount: number;
  lessons: Lesson[];
  category: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  grade: string;
  interests: string[];
  goals: string[];
  favorites: string[]; // list of opportunity IDs
  completedLessons: string[]; // list of lesson IDs: e.g. "courseId_lessonId"
  onboarded: boolean;
  weeklyGoal: number; // e.g. 5 applications/tasks
}

export type InterestCategory = 'STEM' | 'Programming' | 'Research' | 'Business' | 'Humanities' | 'Arts';
