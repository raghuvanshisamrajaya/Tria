// auth.js

// SIGN UP with Role, Email Verification, Firestore user data
async function signUp(name, email, password, role = "user") {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const uid = user.uid;

    // Store user data in Firestore
    await db.collection("users").doc(uid).set({
      name,
      email,
      role,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Send email verification
    await user.sendEmailVerification();

    return { success: true, message: "Signup successful. Please verify your email.", uid };
  } catch (error) {
    console.error("Signup Error:", error);
    return { success: false, error: error.message };
  }
}

// LOGIN and fetch role
async function login(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      return { success: false, error: "Please verify your email before logging in." };
    }

    const uid = user.uid;
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return { success: false, error: "User data not found in Firestore." };
    }

    const userData = userDoc.data();
    return { success: true, uid, role: userData.role };
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, error: error.message };
  }
}

// LOGOUT
async function logout() {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    console.error("Logout Error:", error);
    return { success: false, error: error.message };
  }
}

// CHECK CURRENT USER
function getCurrentUser() {
  return auth.currentUser;
}

// RESET PASSWORD (email link)
async function resetPassword(email) {
  try {
    await auth.sendPasswordResetEmail(email);
    return { success: true, message: "Reset link sent to your email." };
  } catch (error) {
    console.error("Password Reset Error:", error);
    return { success: false, error: error.message };
  }
}

// SEND VERIFICATION EMAIL (if needed)
async function resendVerificationEmail() {
  const user = auth.currentUser;
  if (user && !user.emailVerified) {
    try {
      await user.sendEmailVerification();
      return { success: true, message: "Verification email sent." };
    } catch (error) {
      return { success: false, error: error.message };
    }
  } else {
    return { success: false, error: "User not found or already verified." };
  }
}

// REDIRECT BY ROLE
async function redirectUserByRole() {
  const user = auth.currentUser;
  if (!user) return;

  const userDoc = await db.collection("users").doc(user.uid).get();
  const role = userDoc.data()?.role;

  if (role === "admin") {
    window.location.href = "/admin-dashboard.html";
  } else if (role === "doctor") {
    window.location.href = "/doctor-dashboard.html";
  } else if (role === "merchant") {
    window.location.href = "/merchant-dashboard.html";
  } else {
    window.location.href = "/user-dashboard.html";
  }
}
