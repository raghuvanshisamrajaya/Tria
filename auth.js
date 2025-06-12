// auth.js

// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
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

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------------------- 🔐 AUTH ----------------------

// Sign Up (Default role = "user")
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

// Login
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

// Logout
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ---------------------- 📅 BOOKINGS ----------------------

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

export async function getMyBookings() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const bookings = [];
    querySnapshot.forEach(doc => bookings.push({ id: doc.id, ...doc.data() }));

    return { success: true, bookings };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ---------------------- 🛒 MERCHANT STORE ----------------------

// Add Product (for Merchant)
export async function addProduct(productData) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Merchant not authenticated");

    await addDoc(collection(db, "products"), {
      ...productData,
      merchantId: user.uid,
      status: "draft",
      createdAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Update Product
export async function updateProduct(productId, updates) {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Delete Product
export async function deleteProduct(productId) {
  try {
    await deleteDoc(doc(db, "products", productId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get Products for Merchant
export async function getMyProducts() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Merchant not authenticated");

    const q = query(collection(db, "products"), where("merchantId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));

    return { success: true, products };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Exports
export { auth, db };
