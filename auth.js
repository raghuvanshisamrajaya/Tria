// auth.js

// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase Config
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
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Sign Up (Default role = "user")
export async function signUpUser(name, email, password, role = "user") {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
      createdAt: serverTimestamp()
    });

    return { success: true, uid: user.uid, role };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ✅ Login
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const role = userDoc.exists() ? userDoc.data().role : null;

    return { success: true, uid: user.uid, role };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ✅ Logout
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ✅ Create Booking
export async function createBooking(data) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    await addDoc(collection(db, "bookings"), {
      ...data,
      userId: user.uid,
      status: "pending",
      createdAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ✅ Get Bookings for Current User
export async function getMyBookings() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const bookings = [];
    querySnapshot.forEach(doc => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, bookings };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { auth, db };
