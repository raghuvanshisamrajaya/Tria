// firebase.js

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbknkfD6Je1a3wDZRTzn6lC62CNUhhwLc",
  authDomain: "store-471f1.firebaseapp.com",
  projectId: "store-471f1",
  storageBucket: "store-471f1.firebasestorage.app",
  messagingSenderId: "619523242611",
  appId: "1:619523242611:web:fdfa53044c62f844574806",
  measurementId: "G-16C8MYT70G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export services for use in other files
export { auth, db, analytics };
