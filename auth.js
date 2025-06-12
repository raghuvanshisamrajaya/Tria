// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyHY4bRUYd-bB-PD2V-0Yd_DXdZKWuabQ",
  authDomain: "raghuvanshi-healthcare.firebaseapp.com",
  projectId: "raghuvanshi-healthcare",
  storageBucket: "raghuvanshi-healthcare.firebasestorage.app",
  messagingSenderId: "607175735611",
  appId: "1:607175735611:web:2b8431fc8093c691439f1e",
  measurementId: "G-RW66WW5JKC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
