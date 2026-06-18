import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Use the public configuration stored in our config json, or fallback with defaults
const firebaseConfig = {
  apiKey: "AIzaSyCBrD0DkctTJAveslfFrei1xQXbamCd6s4",
  authDomain: "gold-beach-h8gvj.firebaseapp.com",
  projectId: "gold-beach-h8gvj",
  storageBucket: "gold-beach-h8gvj.firebasestorage.app",
  messagingSenderId: "779677457622",
  appId: "1:779677457622:web:6699cab569a2d0fb593d77"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with robust local caching
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const auth = getAuth(app);

export { app, db, auth };
