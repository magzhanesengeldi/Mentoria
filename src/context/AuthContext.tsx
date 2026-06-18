import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInAnonymously, 
  signOut as fbSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';
import { seedDatabaseIfEmpty } from '../lib/dbSeeder';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInAnonymous: (name?: string) => Promise<void>;
  logout: () => Promise<void>;
  saveOnboardingProfile: (data: Omit<UserProfile, 'uid' | 'email' | 'favorites' | 'completedLessons' | 'onboarded'>) => Promise<void>;
  toggleFavorite: (opportunityId: string) => Promise<void>;
  completeLesson: (lessonKey: string) => Promise<void>;
  updateWeeklyGoal: (goalCount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Trigger Seeder run on mount
  useEffect(() => {
    const seed = async () => {
      await seedDatabaseIfEmpty();
    };
    seed();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        // Authenticated! Retrieve profile
        const profileRef = doc(db, 'users', fbUser.uid);
        try {
          const docSnap = await getDoc(profileRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Initiate default mock profile frame
            const defaultProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || 'anonymous@mentoria.com',
              displayName: 'Alex Rivers',
              grade: '10',
              interests: ['Programming', 'Research', 'Business'],
              goals: ['Apply for 3 summer research opportunities', 'Study SAT Math module', 'Review USACO Bronze templates'],
              favorites: ['opp_wharton'],
              completedLessons: ['course_sat_lesson_sat_1'],
              onboarded: true,
              weeklyGoal: 5
            };
            await setDoc(profileRef, defaultProfile);
            setProfile(defaultProfile);
          }
        } catch (err) {
          console.error("Error loading user profile:", err);
          // Local fallback in case Firestore connection has issues (for instant robust testing)
          const fallbackProfile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || 'test@mentoria.com',
            displayName: 'Alex Rivers (Offline Mode)',
            grade: '10',
            interests: ['Programming', 'Research', 'Business'],
            goals: ['Apply for 3 summer research opportunities'],
            favorites: ['opp_wharton'],
            completedLessons: [],
            onboarded: true,
            weeklyGoal: 3
          };
          setProfile(fallbackProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInAnonymous = async (name: string = 'Explorer') => {
    setLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      const userRef = doc(db, 'users', cred.user.uid);
      const docSnap = await getDoc(userRef);
      
      const defaultProfile: UserProfile = {
        uid: cred.user.uid,
        email: 'anonymous@mentoria.com',
        displayName: name,
        grade: '10',
        interests: ['Programming', 'Business'],
        goals: ['Tackle computer science olympiads', 'Submit summer research applications'],
        favorites: [],
        completedLessons: [],
        onboarded: false,
        weeklyGoal: 3
      };

      if (!docSnap.exists()) {
        await setDoc(userRef, defaultProfile);
        setProfile(defaultProfile);
      } else {
        setProfile(docSnap.data() as UserProfile);
      }
    } catch (err) {
      console.error("Anonymous authentication error:", err);
      // Mock emergency login if completely blocked in networking sandbox
      const mockUid = 'mock_uid_123';
      const mockProfile: UserProfile = {
        uid: mockUid,
        email: 'anonymous@mentoria.com',
        displayName: name,
        grade: '11',
        interests: ['Programming', 'Research', 'Business'],
        goals: ['Complete 3 courses'],
        favorites: ['opp_wharton'],
        completedLessons: [],
        onboarded: true,
        weeklyGoal: 5
      };
      setProfile(mockProfile);
      setUser({ uid: mockUid, email: 'anonymous@mentoria.com' } as User);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
    setUser(null);
    setProfile(null);
  };

  const saveOnboardingProfile = async (data: Omit<UserProfile, 'uid' | 'email' | 'favorites' | 'completedLessons' | 'onboarded'>) => {
    if (!user || !profile) return;
    const profileRef = doc(db, 'users', user.uid);
    const updated: UserProfile = {
      ...profile,
      ...data,
      onboarded: true
    };
    try {
      await setDoc(profileRef, updated);
      setProfile(updated);
    } catch (err) {
      console.error("Error setting onboarding details:", err);
      // Always fallback locally immediately so UI is buttery-smooth
      setProfile(updated);
    }
  };

  const toggleFavorite = async (opportunityId: string) => {
    if (!profile || !user) return;
    const isFav = profile.favorites.includes(opportunityId);
    
    // Optimistic local state modification
    let updatedFavs = [...profile.favorites];
    if (isFav) {
      updatedFavs = updatedFavs.filter(id => id !== opportunityId);
    } else {
      updatedFavs.push(opportunityId);
    }
    setProfile({ ...profile, favorites: updatedFavs });

    // Remote persistence
    try {
      const profileRef = doc(db, 'users', user.uid);
      await updateDoc(profileRef, {
        favorites: isFav ? arrayRemove(opportunityId) : arrayUnion(opportunityId)
      });
    } catch (err) {
      console.error("Error persisting favorite toggle:", err);
    }
  };

  const completeLesson = async (lessonKey: string) => {
    if (!profile || !user) return;
    if (profile.completedLessons.includes(lessonKey)) return; // Already completed

    // Optimistic local state modification
    const updatedLessons = [...profile.completedLessons, lessonKey];
    setProfile({ ...profile, completedLessons: updatedLessons });

    // Remote persistence
    try {
      const profileRef = doc(db, 'users', user.uid);
      await updateDoc(profileRef, {
        completedLessons: arrayUnion(lessonKey)
      });
    } catch (err) {
      console.error("Error persisting completed lesson:", err);
    }
  };

  const updateWeeklyGoal = async (goalCount: number) => {
    if (!profile || !user) return;
    setProfile({ ...profile, weeklyGoal: goalCount });

    try {
      const profileRef = doc(db, 'users', user.uid);
      await updateDoc(profileRef, {
        weeklyGoal: goalCount
      });
    } catch (err) {
      console.error("Error persisting weekly goal:", err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signInAnonymous,
      logout,
      saveOnboardingProfile,
      toggleFavorite,
      completeLesson,
      updateWeeklyGoal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be defined inside AuthProvider wrapper');
  }
  return context;
};
