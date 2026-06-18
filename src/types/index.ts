export type InterestCategory = 'STEM' | 'Business' | 'Finance' | 'Programming' | 'Research' | 'Social Impact';

export const ALL_INTERESTS: InterestCategory[] = [
  'STEM',
  'Business',
  'Finance',
  'Programming',
  'Research',
  'Social Impact'
];

export type GradeLevel = '8' | '9' | '10' | '11';

export const ALL_GRADES: GradeLevel[] = ['8', '9', '10', '11'];

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'admin';
  grade: GradeLevel | '';
  interests: InterestCategory[];
  goals: string[];
  onboarded: boolean;
  favorites: string[]; // Opportunity IDs
  completedLessons: string[]; // Lesson IDs
  createdAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: InterestCategory;
  deadline: string; // ISO string or human-readable date
  prerequisites: string[];
  imageUrl: string;
  isOnline: boolean;
  location?: string;
  organization: string;
  eligibility: string;
  applicationUrl: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
}

export interface Lesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  content: string; // Rich text / markdown
  videoPlaceholder?: string; // YouTube / Video embed placeholder
  quiz: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  imageUrl: string;
  category: InterestCategory;
  lessonsCount: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number; // 0 to 100
  completedLessonIds: string[];
  updatedAt: string;
}

export interface Favorite {
  id: string;
  studentId: string;
  opportunityId: string;
  createdAt: string;
}
