import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,

  updateProfile,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "./app";

// Google Auth Provider Setup
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.profile");
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.email");

export const authService = {
  /**
   * Log in with email and password
   */
  loginWithEmail: async (email, pass) => {
    return signInWithEmailAndPassword(auth, email, pass);
  },

  /**
   * Register with email and password
   */
  registerWithEmail: async (email, pass, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
      await sendEmailVerification(cred.user);
    }
    return cred;
  },

  /**
   * Log in with Google popup
   */
  loginWithGoogle: async () => {
    return signInWithPopup(auth, googleProvider);
  },

  /**
   * Initialize ReCAPTCHA verifier for Phone Sign-In
   */
  initPhoneVerifier: (elementId) => {
    return new RecaptchaVerifier(auth, elementId, {
      size: "invisible",
      callback: () => {
        console.log("[Admin Auth] ReCAPTCHA verifier initialized");
      }
    });
  },

  /**
   * Request OTP verification code on a phone number
   */
  requestOTP: async (phoneNumber, verifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, verifier);
  },

  /**
   * Send password reset request email
   */
  resetPassword: async (email) => {
    return sendPasswordResetEmail(auth, email);
  },

  /**
   * Sign out current admin user
   */
  logout: async () => {
    return signOut(auth);
  },

  /**
   * Get JWT access token of currently logged in user
   */
  getJWTToken: async () => {
    const user = auth.currentUser;
    if (user) {
      return user.getIdToken(true);
    }
    return null;
  }
};
