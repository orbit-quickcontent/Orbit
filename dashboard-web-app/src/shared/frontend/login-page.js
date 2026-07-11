const _jsxFileName = "src\\shared\\frontend\\login-page.tsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

/**
 * SHARED | LoginPage
 *
 * Three-step login flow:
 * Step 1: Choose role (Client or Partner)
 * Step 2: Create profile with Google/Apple OAuth, 4 creative avatars + photo upload, India phone
 * Step 3: Verify email via OTP
 */

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  User,
  Mail,
  Phone,
  ImagePlus,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { AVATAR_COLORS, AVATAR_PRESETS } from "@/lib/constants";


import { toast } from "sonner";

import OTPVerification from "./otp-verification";




export default function LoginPage() {
  const { login, setUser, user } = useAppStore();
  const [selectedRole, setSelectedRole] = useState(null);
  const [step, setStep] = useState("profile");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");
    if (roleParam === "USER" || roleParam === "PARTNER") {
      setSelectedRole(roleParam );
    } else {
      setSelectedRole("USER");
    }
  }, []);


  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSocialLogin, setIsSocialLogin] = useState(false);
  const isSocial = user.authProvider === "google" || user.authProvider === "apple" || isSocialLogin;

  // Profile form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarMode, setAvatarMode] = useState("avatar");
  const [selectedAvatarPreset, setSelectedAvatarPreset] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Phone validation for India (10 digits)
  const handlePhoneChange = useCallback((e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const limited = raw.slice(0, 10);
    setPhone(limited);
  }, []);

  const isPhoneValid = phone.length === 0 || phone.length === 10;

  // Photo upload handler
  const handlePhotoUpload = useCallback((e) => {
    const file = _optionalChain([e, 'access', _ => _.target, 'access', _2 => _2.files, 'optionalAccess', _3 => _3[0]]);
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result ;
      setPhotoPreview(result);
      setAvatarMode("photo");
    };
    reader.readAsDataURL(file);
  }, []);



  // Step 2→3 (Firebase Passwordless Email Link Auth)
  const handleProfileComplete = useCallback(async () => {
    if (!name.trim() || !email.trim()) return;
    if (phone.length > 0 && phone.length !== 10) return;

    const avatarValue = avatarMode === "avatar" && selectedAvatarPreset
      ? _nullishCoalesce(_optionalChain([AVATAR_PRESETS, 'access', _4 => _4.find, 'call', _5 => _5(p => p.id === selectedAvatarPreset), 'optionalAccess', _6 => _6.gradient]), () => ( AVATAR_COLORS[0]))
      : photoPreview;

    const selectedPreset = avatarMode === "avatar" && selectedAvatarPreset
      ? AVATAR_PRESETS.find(p => p.id === selectedAvatarPreset)
      : null;

    const isSocial = user.authProvider === "google" || user.authProvider === "apple" || isSocialLogin;
    
    const userPayload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() ? phone.trim() : "",
      avatar: _nullishCoalesce(avatarValue, () => ( AVATAR_COLORS[0])),
      avatarType: avatarMode === "photo" ? ("photo" ) : ("avatar" ),
      avatarEmoji: _nullishCoalesce(_optionalChain([selectedPreset, 'optionalAccess', _7 => _7.emoji]), () => ( null)),
      avatarPhotoUrl: avatarMode === "photo" ? photoPreview : null,
      avatarImage: _nullishCoalesce(_optionalChain([selectedPreset, 'optionalAccess', _8 => _8.image]), () => ( null)),
      isVerified: isSocial,
    };

    setUser(userPayload);

    if (isSocial) {
      if (selectedRole) {
        login(selectedRole);
        toast.success("Welcome aboard!", { 
          description: `Logged in successfully as a ${selectedRole === "USER" ? "Client" : "Partner"}.` 
        });
      }
    } else {
      setStep("otp");
    }
  }, [name, email, phone, avatarMode, selectedAvatarPreset, photoPreview, setUser, user.authProvider, isSocialLogin, selectedRole, login]);

  const handleOtpVerified = useCallback(async () => {
    try {
      const { auth: firebaseAuth } = await import("@/lib/firebase");
      const { signInAnonymously } = await import("firebase/auth");
      
      try {
        await signInAnonymously(firebaseAuth);
      } catch (anonErr) {
        console.warn("Firebase Anonymous Sign-In fallback active:", anonErr);
      }

      setUser({ authProvider: "email", isVerified: true });
      if (selectedRole) login(selectedRole);
    } catch (err) {
      console.error("Firebase Email OTP Auth Error:", err);
      toast.error("Firebase Authentication failed", {
        description: err.message || "Please try again."
      });
    }
  }, [selectedRole, login, setUser]);

  const handleOtpBack = useCallback(() => {
    setStep("profile");
  }, []);

  // Google OAuth
  const handleGoogleLogin = useCallback(async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    const loadingToast = toast.loading("Connecting to Google...");
    try {
      const { auth } = await import("@/lib/firebase");
      const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      setName(user.displayName || "Google User");
      setEmail(user.email || "");
      
      if (user.photoURL) {
        setPhotoPreview(user.photoURL);
        setAvatarMode("photo");
      } else {
        setSelectedAvatarPreset(AVATAR_PRESETS[0].id);
        setAvatarMode("avatar");
      }
      
      setUser({ authProvider: "google" });
      setIsSocialLogin(true);
      
      toast.dismiss(loadingToast);
      toast.success("Signed in with Google!", { 
        description: "Profile auto-filled from your Google account. You can now customize your details below." 
      });
    } catch (err) {
      console.error("Firebase Google Login Error:", err);
      toast.dismiss(loadingToast);
      
      if (err.code === "auth/cancelled-popup-request" || err.code === "auth/popup-closed-by-user") {
        toast.info("Sign-in cancelled", {
          description: "Google sign-in popup was closed."
        });
      } else if (err.code === "auth/popup-blocked") {
        toast.warning("Popup blocked", {
          description: "Please allow popups for this website in your browser settings to sign in."
        });
      } else {
        toast.error("Google Sign-In failed", { 
          description: err.message || "Please try again." 
        });
      }
    } finally {
      setIsAuthenticating(false);
    }
  }, [setUser, isAuthenticating]);

  // Apple OAuth
  const handleAppleLogin = useCallback(async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    const loadingToast = toast.loading("Connecting to Apple...");
    try {
      const { auth } = await import("@/lib/firebase");
      const { signInWithPopup, OAuthProvider } = await import("firebase/auth");
      const provider = new OAuthProvider("apple.com");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      setName(user.displayName || "Apple User");
      setEmail(user.email || "");
      
      if (user.photoURL) {
        setPhotoPreview(user.photoURL);
        setAvatarMode("photo");
      } else {
        setSelectedAvatarPreset(AVATAR_PRESETS[1].id);
        setAvatarMode("avatar");
      }
      
      setUser({ authProvider: "apple" });
      setIsSocialLogin(true);
      
      toast.dismiss(loadingToast);
      toast.success("Signed in with Apple!", { 
        description: "Profile auto-filled from your Apple ID. You can now customize your details below." 
      });
    } catch (err) {
      console.error("Firebase Apple Login Error:", err);
      toast.dismiss(loadingToast);
      
      if (err.code === "auth/cancelled-popup-request" || err.code === "auth/popup-closed-by-user") {
        toast.info("Sign-in cancelled", {
          description: "Apple sign-in popup was closed."
        });
      } else if (err.code === "auth/popup-blocked") {
        toast.warning("Popup blocked", {
          description: "Please allow popups for this website in your browser settings to sign in."
        });
      } else {
        toast.error("Apple Sign-In failed", { 
          description: err.message || "Please try again." 
        });
      }
    } finally {
      setIsAuthenticating(false);
    }
  }, [setUser, isAuthenticating]);

  // Render the current avatar preview based on mode
  const renderAvatarPreview = () => {
    const size = "w-24 h-24";

    if (avatarMode === "photo" && photoPreview) {
      return (
        React.createElement('div', { className: "relative group" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}
          , React.createElement('div', { className: "absolute inset-0 w-24 h-24 rounded-full bg-orbit-cyan opacity-20 blur-xl scale-125"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}} )
          , React.createElement('div', { className: `relative ${size} rounded-full overflow-hidden shadow-lg ring-2 ring-white/30`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}
            , React.createElement('img', { src: photoPreview, alt: "Profile photo" , className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}} )
          )
          , React.createElement('button', {
            onClick: () => { setPhotoPreview(null); setAvatarMode("avatar"); },
            className: "absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500/90 flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors z-20"              ,
            title: "Remove photo" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}

            , React.createElement(X, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}} )
          )
        )
      );
    }

    if (avatarMode === "avatar" && selectedAvatarPreset) {
      const preset = AVATAR_PRESETS.find(p => p.id === selectedAvatarPreset);
      if (preset) {
        return (
          React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}
            , React.createElement('div', { className: `absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br ${preset.gradient} opacity-30 blur-xl scale-125`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}} )
            , React.createElement('div', { className: `relative ${size} rounded-full overflow-hidden shadow-lg ring-2 ring-white/30`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}}
              , React.createElement('img', { src: preset.image, alt: preset.label, className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}} )
            )
          )
        );
      }
    }

    // Default: show first avatar preset or color gradient with initials
    const defaultPreset = AVATAR_PRESETS[0];
    return (
      React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
        , React.createElement('div', { className: `absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br ${defaultPreset.gradient} opacity-30 blur-xl scale-125`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}} )
        , React.createElement('div', { className: `relative ${size} rounded-full overflow-hidden shadow-lg ring-2 ring-white/20 opacity-50`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}}
          , React.createElement('img', { src: defaultPreset.image, alt: "Default", className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}} )
        )
      )
    );
  };

  const isAccentCyan = selectedRole === "USER";

  if (!isClient) {
    return (
      React.createElement('div', { className: "min-h-screen flex flex-col bg-background relative overflow-y-auto"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}
        , React.createElement('div', { className: "absolute inset-0 bg-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 318}} )
        , React.createElement('header', { className: "relative z-10 pt-8 pb-4 px-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}
          , React.createElement('div', { className: "max-w-7xl mx-auto flex items-center justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}
            , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}
              , React.createElement(Image, {
                src: "/orbit-logo.png",
                alt: "Orbit Logo" ,
                width: 48,
                height: 48,
                className: "rounded-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}
              )
              , React.createElement('span', { className: "text-2xl sm:text-3xl font-black tracking-tight text-gradient-orbit"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}}, "ORBIT")
            )
          )
        )
        , React.createElement('main', { className: "relative z-10 flex-1 flex items-center justify-center px-4 py-8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}
          , React.createElement('div', { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-orbit-cyan"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 334}})
        )
      )
    );
  }

  return (
    React.createElement('div', { className: "min-h-screen flex flex-col bg-background relative overflow-y-auto"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}
      /* Background — pure black, no image */
      , React.createElement('div', { className: "absolute inset-0 bg-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}} )

      /* Header */
      , React.createElement('header', { className: "relative z-10 pt-8 pb-4 px-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}
        , React.createElement('div', { className: "max-w-7xl mx-auto flex items-center justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 347}}
          , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}
            , React.createElement(Image, {
              src: "/orbit-logo.png",
              alt: "Orbit Logo" ,
              width: 48,
              height: 48,
              className: "rounded-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}
            )
            , React.createElement('span', { className: "text-2xl sm:text-3xl font-black tracking-tight text-gradient-orbit"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 356}}, "ORBIT")
          )
        )
      )

      /* Main Content */
      , React.createElement('main', { className: "relative z-10 flex-1 flex items-start justify-center px-4 py-8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 362}}
        , React.createElement('div', { className: "w-full max-w-md mx-auto"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 363}}
          , React.createElement('div', { className: "text-center mb-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 364}}
            , React.createElement(Badge, { variant: "outline", className: `mb-4 ${
              isAccentCyan
                ? "border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5"
                : "border-orbit-purple/30 text-orbit-purple bg-orbit-purple/5"
            } px-4 py-1.5`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 365}}
              , selectedRole === "USER" ? "Client Account" : "Partner Account"
            )
            , React.createElement('h2', { className: "text-3xl sm:text-4xl font-black tracking-tight mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 372}}
              , React.createElement('span', { className: "text-gradient-orbit", __self: this, __source: {fileName: _jsxFileName, lineNumber: 373}}, "Join the" ), " "
              , React.createElement('span', { className: "text-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}, "Orbit")
            )
            , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}, "Sign in or create your account to get started"

            )
          )

          , React.createElement(AnimatePresence, { mode: "wait", __self: this, __source: {fileName: _jsxFileName, lineNumber: 381}}
            , step === "profile" && (
            React.createElement(motion.div, {
              key: "profile",
              initial: { opacity: 0, y: 15 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -15 },
              transition: { duration: 0.2 },
              className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}

              /* Profile Card */
              , React.createElement('div', { className: "orbit-card rounded-3xl p-5 sm:p-7 border border-white/[0.08]"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}}
                /* ─── Social Login ─── */
                , React.createElement('div', { className: "grid grid-cols-2 gap-3 mb-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 394}}
                  /* Google Login */
                  , React.createElement('button', {
                    onClick: handleGoogleLogin,
                    disabled: isAuthenticating,
                    className: `bg-white rounded-xl px-4 py-3.5 flex items-center justify-center gap-2.5 transition-all duration-200 ${
                      isAuthenticating
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 396}}

                    , React.createElement('svg', { className: "w-5 h-5" , viewBox: "0 0 24 24"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}
                      , React.createElement('path', { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"        , fill: "#4285F4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}})
                      , React.createElement('path', { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"            , fill: "#34A853", __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}})
                      , React.createElement('path', { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"         , fill: "#FBBC05", __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}})
                      , React.createElement('path', { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"                   , fill: "#EA4335", __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}})
                    )
                    , React.createElement('span', { className: "text-sm font-semibold text-gray-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}}, "Google")
                  )

                  /* Apple Login */
                  , React.createElement('button', {
                    onClick: handleAppleLogin,
                    disabled: isAuthenticating,
                    className: `bg-black rounded-xl px-4 py-3.5 flex items-center justify-center gap-2.5 transition-all duration-200 ${
                      isAuthenticating
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 415}}

                    , React.createElement('svg', { className: "w-5 h-5 text-white"  , viewBox: "0 0 24 24"   , fill: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
                      , React.createElement('path', { d: "M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"                            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}})
                    )
                    , React.createElement('span', { className: "text-sm font-semibold text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 427}}, "Apple")
                  )
                )

                /* Divider */
                , React.createElement('div', { className: "relative mb-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 432}}
                  , React.createElement('div', { className: "absolute inset-0 flex items-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 433}}
                    , React.createElement('div', { className: "w-full border-t border-white/10"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 434}} )
                  )
                  , React.createElement('div', { className: "relative flex justify-center text-xs uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}
                    , React.createElement('span', { className: "bg-background px-3 text-muted-foreground/60 tracking-widest"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}, "Or Email" )
                  )
                )

                /* ─── Avatar Selection (Unified: Avatar + Photo) ─── */
                , React.createElement('div', { className: "bg-white/[0.07] backdrop-blur-lg rounded-2xl p-5 sm:p-6 mb-4 border border-white/10"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 442}}
                  , React.createElement('h3', { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 443}}, "Choose Your Profile Picture"

                  )

                  /* Large avatar preview */
                  , React.createElement('div', { className: "flex items-center justify-center mb-5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 448}}
                    , renderAvatarPreview()
                  )

                  /* Avatar mode tabs — only Avatar & Photo */
                  , React.createElement('div', { className: "flex items-center justify-center gap-2 mb-5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 453}}
                    , [
                      { mode: "avatar" , label: "Avatar", icon: React.createElement(User, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 455}} ) },
                      { mode: "photo" , label: "Photo", icon: React.createElement(ImagePlus, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 456}} ) },
                    ].map((tab) => (
                      React.createElement('button', {
                        key: tab.mode,
                        onClick: () => setAvatarMode(tab.mode),
                        className: `flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          avatarMode === tab.mode
                            ? "bg-white/15 text-white ring-1 ring-white/20"
                            : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-white/5"
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 458}}

                        , tab.icon
                        , tab.label
                      )
                    ))
                  )

                  /* 4 Creative Avatar Presets — each with a color accent */
                  , avatarMode === "avatar" && (
                    React.createElement('div', { className: "grid grid-cols-4 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 475}}
                      , AVATAR_PRESETS.map((preset) => (
                        React.createElement('button', {
                          key: preset.id,
                          onClick: () => setSelectedAvatarPreset(preset.id),
                          className: `flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                            selectedAvatarPreset === preset.id
                              ? "bg-white/15 ring-2 ring-white/30 scale-105"
                              : "bg-white/5 hover:bg-white/10 hover:scale-105"
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 477}}

                          , React.createElement('div', { className: `w-12 h-12 rounded-full overflow-hidden shadow-lg ring-1 ring-white/10`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 486}}
                            , React.createElement('img', { src: preset.image, alt: preset.label, className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 487}} )
                          )
                          , React.createElement('span', { className: "text-[10px] font-semibold text-foreground/80"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 489}}, preset.label)
                          )
                        ))
                      )
                    )

                    /* Photo upload */
                    , avatarMode === "photo" && (
                      React.createElement('div', { className: "flex flex-col items-center gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 497}}
                        , React.createElement('button', {
                          onClick: () => _optionalChain([fileInputRef, 'access', _9 => _9.current, 'optionalAccess', _10 => _10.click, 'call', _11 => _11()]),
                          className: "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-muted-foreground hover:text-foreground transition-all duration-200"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 498}}

                          , React.createElement(Camera, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 502}} )
                          , photoPreview ? "Change Photo" : "Choose from Gallery"
                        )
                        , React.createElement('input', {
                          ref: fileInputRef,
                          type: "file",
                          accept: "image/*",
                          capture: "environment",
                          onChange: handlePhotoUpload,
                          className: "hidden", __self: this, __source: {fileName: _jsxFileName, lineNumber: 505}}
                        )
                        , React.createElement('p', { className: "text-[10px] text-muted-foreground/40" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 513}}, "Max 5MB - JPG, PNG, WebP"     )
                      )
                    )
                  )

                  /* ─── Profile Form ─── */
                  , React.createElement('div', { className: "bg-white/[0.07] backdrop-blur-lg rounded-2xl p-5 sm:p-6 space-y-4 border border-white/10"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 519}}
                    /* Full Name */
                    , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 521}}
                      , React.createElement('label', { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 522}}
                        , React.createElement(User, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 523}} ), " Full Name *"
                      )
                      , React.createElement(Input, {
                        value: name,
                        onChange: (e) => setName(e.target.value),
                        placeholder: "Enter your name"  ,
                        className: "bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground/40 focus:border-orbit-cyan h-11"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 525}}
                      )
                    )

                    /* Email */
                    , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 534}}
                      , React.createElement('label', { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 535}}
                        , React.createElement(Mail, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 536}} ), " Email Address *"
                      )
                      , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 538}}
                        , React.createElement(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 539}} )
                        , React.createElement(Input, {
                          value: email,
                          onChange: (e) => setEmail(e.target.value),
                          placeholder: "you@example.com",
                          type: "email",
                          disabled: isSocial,
                          className: "bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground/40 focus:border-orbit-cyan h-11 pl-10 disabled:opacity-50 disabled:cursor-not-allowed"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 540}}
                        )
                      )
                    )

                    /* Phone (India - 10 digits) */
                    , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 552}}
                      , React.createElement('label', { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 553}}
                        , React.createElement(Phone, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 554}} ), " Phone"
                      )
                      , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 556}}
                        , React.createElement('div', { className: "absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm text-muted-foreground/60 font-medium"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 557}}
                          , React.createElement('span', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 558}}, "+91")
                          , React.createElement('span', { className: "text-white/20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 559}}, "|")
                        )
                        , React.createElement(Input, {
                          value: phone,
                          onChange: handlePhoneChange,
                          placeholder: "10-digit mobile number"  ,
                          type: "tel",
                          inputMode: "numeric",
                          maxLength: 10,
                          className: `bg-white/5 text-foreground placeholder:text-muted-foreground/40 h-11 w-full pl-[4.5rem] ${
                            !isPhoneValid
                              ? "border-destructive focus:border-destructive"
                              : "border-white/10 focus:border-orbit-cyan"
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 561}}
                        )
                      )
                      , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 575}}
                        , !isPhoneValid && phone.length > 0 ? (
                          React.createElement('p', { className: "text-xs text-destructive" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 577}}, "Please enter exactly 10 digits"    )
                        ) : (
                          React.createElement('p', { className: "text-xs text-muted-foreground/40" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 579}}, "India mobile numbers only"   )
                        )
                        , React.createElement('p', { className: "text-xs text-muted-foreground/40" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 581}}, phone.length, "/10")
                      )
                    )
                  )

                  /* Continue Button */
                  , (() => {
                    const isSocial = user.authProvider === "google" || user.authProvider === "apple" || isSocialLogin;
                    return (
                      React.createElement(React.Fragment, null
                        , React.createElement(Button, {
                          onClick: handleProfileComplete,
                          disabled: !name.trim() || !email.trim() || !isPhoneValid,
                          className: `w-full mt-6 font-bold py-6 text-base transition-all duration-300 ${
                            !name.trim() || !email.trim() || !isPhoneValid
                              ? "bg-white/5 text-muted-foreground/40 cursor-not-allowed"
                              : isAccentCyan
                              ? "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 shadow-lg shadow-orbit-cyan/20"
                              : "bg-gradient-to-r from-orbit-purple to-orbit-cyan text-white hover:opacity-90 shadow-lg shadow-orbit-purple/20"
                          }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 591}}

                          , isSocial ? (
                            React.createElement(Sparkles, { className: "w-4 h-4 mr-2 text-orbit-cyan animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 603}} )
                          ) : (
                            React.createElement(Mail, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 605}} )
                          )
                          , isSocial ? "Complete Profile & Enter" : "Continue to Verify Email"
                          , React.createElement(ArrowRight, { className: "w-4 h-4 ml-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 608}} )
                        )

                        , React.createElement('p', { className: "text-center text-xs text-muted-foreground/40 mt-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 611}}
                          , isSocial
                            ? `Profile verified via ${user.authProvider === "google" || isSocialLogin ? "Google" : "Apple"}.`
                            : "You'll need to verify your email before continuing."
                        )
                      )
                    );
                  })()

                  /* Footer links */
                  , React.createElement('div', { className: "flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-6"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 621}}
                    , React.createElement('button', { className: "text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 622}}, "Privacy Policy"

                    )
                    , React.createElement('span', { className: "text-muted-foreground/20 hidden sm:inline"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 625}}, "|")
                    , React.createElement('button', { className: "text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 626}}, "Terms of Service"

                    )
                    , React.createElement('span', { className: "text-muted-foreground/20 hidden sm:inline"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 629}}, "|")
                    , React.createElement('button', { className: "text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 630}}, "Support"

                    )
                  )
                )
              )
            )

            , step === "otp" && selectedRole && (
              React.createElement(motion.div, {
                key: "otp-step",
                initial: { opacity: 0, x: 30 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: 30 },
                transition: { duration: 0.3 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 639}}

                , React.createElement(OTPVerification, {
                  email: email.trim(),
                  role: selectedRole,
                  onVerified: handleOtpVerified,
                  onBack: handleOtpBack, __self: this, __source: {fileName: _jsxFileName, lineNumber: 646}}
                )
              )
            )
          )
        )
      )

      /* Footer */
      , React.createElement('footer', { className: "relative z-10 py-4 px-4 mt-auto"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 659}}
        , React.createElement('div', { className: "text-center text-xs text-muted-foreground/40"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 660}}, "© "
           , new Date().getFullYear(), " Orbit. All rights reserved."
        )
      )
    )
  );
}