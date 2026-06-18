import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Load configuration dynamically from environment variables or project defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || window.firebaseConfig?.apiKey || "AIzaSyAn0hDQ01rjDTP43EAW13c3I2KFf2koObE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || window.firebaseConfig?.authDomain || "lyrical-country-461108-h9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || window.firebaseConfig?.projectId || "lyrical-country-461108-h9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || window.firebaseConfig?.storageBucket || "lyrical-country-461108-h9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || window.firebaseConfig?.messagingSenderId || "698349044384",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || window.firebaseConfig?.appId || "1:698349044384:web:008d6badec768cfd763fc5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
