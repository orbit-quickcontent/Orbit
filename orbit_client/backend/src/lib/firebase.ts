import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCPRHQqsMPaL8aKYvCFi6NZoGuM8FXRrhc",
  authDomain: "orbit-8db3d.firebaseapp.com",
  projectId: "orbit-8db3d",
  storageBucket: "orbit-8db3d.firebasestorage.app",
  messagingSenderId: "94590872279",
  appId: "1:94590872279:web:3ab059a03d704253581e92",
  measurementId: "G-ZPRSBTJ4DR"
};

// Initialize Firebase (SSR Safe)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics (SSR Safe)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
