import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// --- THE LEGENDARY SINGLETON PATTERN ---

// Forge the Firebase App instance. This logic runs ONCE when the module is first loaded.
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Forge the master keys for Auth and Firestore from the single app instance.
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Export the master keys directly. No more functions. No more photocopies.
export { app, auth, db };