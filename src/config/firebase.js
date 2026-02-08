import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyARBAj7Qf_GGpFBNYmui9lUno6jKiU2c9U",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tickswapr.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tickswapr",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tickswapr.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "287494670329",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:287494670329:web:2274fcaf091f3eca4d1f28"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Admin email from environment
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "jhasaurav562@gmail.com";

export default app;
