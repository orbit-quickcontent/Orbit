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

const googleProvider = new GoogleAuthProvider();

export const authService = {
  loginWithEmail: async (email, pass) => {
    return signInWithEmailAndPassword(auth, email, pass);
  },
  registerWithEmail: async (email, pass, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
      await sendEmailVerification(cred.user);
    }
    return cred;
  },
  loginWithGoogle: async () => {
    return signInWithPopup(auth, googleProvider);
  },
  initPhoneVerifier: (elementId) => {
    return new RecaptchaVerifier(auth, elementId, {
      size: "invisible",
      callback: () => {
        console.log("[Client Auth] ReCAPTCHA verifier initialized");
      }
    });
  },
  requestOTP: async (phoneNumber, verifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, verifier);
  },
  resetPassword: async (email) => {
    return sendPasswordResetEmail(auth, email);
  },
  logout: async () => {
    return signOut(auth);
  },
  getJWTToken: async () => {
    const user = auth.currentUser;
    return user ? user.getIdToken(true) : null;
  }
};
