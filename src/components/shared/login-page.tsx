"use client";

/**
 * SHARED | LoginPage
 *
 * Three-step login flow:
 * Step 1: Choose role (Client or Partner)
 * Step 2: Create profile with Google/Apple OAuth, avatar selection (color/emoji/photo), India phone (10 digits)
 * Step 3: Verify email via OTP
 *
 * Used by: page.tsx
 * Category: Shared UI
 */

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  Film,
  Zap,
  Star,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ImagePlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { AVATAR_COLORS, AVATAR_EMOJIS } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { type UserRole } from "@/lib/types";
import OTPVerification from "./otp-verification";

// Pre-computed particle positions (avoids hydration mismatch)
const LOGIN_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  top: ((i * 41 + 17) % 100),
  left: ((i * 59 + 23) % 100),
  delay: (i * 0.2) % 4,
  dur: 3 + (i % 5),
  cyan: i % 2 === 0,
}));

type LoginStep = "role" | "profile" | "otp";
type AvatarMode = "color" | "emoji" | "photo";

export default function LoginPage() {
  const { login, setUser } = useAppStore();
  const [step, setStep] = useState<LoginStep>("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [hoveredRole, setHoveredRole] = useState<"USER" | "PARTNER" | null>(null);

  // Profile form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarColor, setAvatarColor] = useState(0);
  const [avatarMode, setAvatarMode] = useState<AvatarMode>("color");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Phone validation for India (10 digits)
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const limited = raw.slice(0, 10);
    setPhone(limited);
  }, []);

  const isPhoneValid = phone.length === 0 || phone.length === 10;

  // Photo upload handler
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return; // max 5MB
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      setAvatarMode("photo");
    };
    reader.readAsDataURL(file);
  }, []);

  // Step 1→2
  const handleRoleSelect = useCallback((role: UserRole) => {
    setSelectedRole(role);
    setStep("profile");
  }, []);

  // Step 2→3
  const handleProfileComplete = useCallback(() => {
    if (!name.trim() || !email.trim()) return;
    if (phone.length > 0 && phone.length !== 10) return;

    const avatarValue = avatarMode === "color"
      ? AVATAR_COLORS[avatarColor]
      : avatarMode === "emoji" && selectedEmoji
      ? selectedEmoji
      : photoPreview;

    setUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() ? `+91${phone.trim()}` : "",
      avatar: avatarValue ?? AVATAR_COLORS[0],
      avatarType: avatarMode,
      avatarEmoji: avatarMode === "emoji" ? selectedEmoji : null,
      avatarPhotoUrl: avatarMode === "photo" ? photoPreview : null,
    });
    setStep("otp");
  }, [name, email, phone, avatarColor, avatarMode, selectedEmoji, photoPreview, setUser]);

  // Step 3→done
  const handleOtpVerified = useCallback(() => {
    if (selectedRole) login(selectedRole);
  }, [selectedRole, login]);

  const handleOtpBack = useCallback(() => {
    setStep("profile");
  }, []);

  // Google OAuth — redirects to NextAuth Google provider
  const handleGoogleLogin = useCallback(() => {
    // In production with real OAuth credentials: redirect to NextAuth endpoint
    // window.location.href = "/api/auth/signin/google?callbackUrl=/";
    // For demo: auto-fill and proceed
    setName("Google User");
    setEmail("user@gmail.com");
  }, []);

  // Apple OAuth — redirects to NextAuth Apple provider
  const handleAppleLogin = useCallback(() => {
    // In production: window.location.href = "/api/auth/signin/apple?callbackUrl=/";
    // For demo: auto-fill and proceed
    setName("Apple User");
    setEmail("user@icloud.com");
  }, []);

  // Render the current avatar preview based on mode
  const renderAvatarPreview = () => {
    const size = "w-24 h-24";

    if (avatarMode === "photo" && photoPreview) {
      return (
        <div className="relative">
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-orbit-cyan opacity-20 blur-xl scale-125" />
          <div className={`relative ${size} rounded-full overflow-hidden shadow-lg ring-2 ring-white/20`}>
            <img src={photoPreview} alt="Your photo" className="w-full h-full object-cover" />
          </div>
        </div>
      );
    }

    if (avatarMode === "emoji" && selectedEmoji) {
      return (
        <div className="relative">
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-orbit-purple opacity-20 blur-xl scale-125" />
          <div className={`relative ${size} rounded-full bg-gradient-to-br from-orbit-purple/20 to-orbit-cyan/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-lg ring-2 ring-white/10`}>
            {selectedEmoji}
          </div>
        </div>
      );
    }

    // Default: color gradient with initials
    return (
      <div className="relative">
        <div className={`absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br ${AVATAR_COLORS[avatarColor]} opacity-30 blur-xl scale-125`} />
        <div className={`relative ${size} rounded-full bg-gradient-to-br ${AVATAR_COLORS[avatarColor]} flex items-center justify-center text-3xl font-black text-white shadow-lg transition-all duration-300`}>
          {getInitials(name)}
        </div>
      </div>
    );
  };

  const isAccentCyan = selectedRole === "USER";

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "url(/hero-bg.png)", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:block">
          <div className="w-[600px] h-[600px] border border-orbit-cyan/5 rounded-full animate-orbit" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:block">
          <div
            className="w-[400px] h-[400px] border border-orbit-purple/8 rounded-full animate-orbit"
            style={{ animationDirection: "reverse", animationDuration: "15s" }}
          />
        </div>

        {LOGIN_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              background: p.cyan ? "rgba(0, 191, 255, 0.3)" : "rgba(160, 32, 240, 0.3)",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Image
              src="/orbit-logo.png"
              alt="Orbit Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-gradient-orbit">ORBIT</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {step === "role" && (
              <motion.div
                key="role-step"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {/* Title */}
                <div className="text-center mb-10 sm:mb-14">
                  <Badge variant="outline" className="mb-5 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5 px-4 py-1.5">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Welcome to Orbit
                  </Badge>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.95] mb-4">
                    <span className="text-gradient-orbit">Choose Your</span>
                    <br />
                    <span className="text-foreground">Experience</span>
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    Select how you want to use Orbit. You&apos;ll stay in your lane — no switching between modes.
                  </p>
                </div>

                {/* Role Cards */}
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-8 max-w-3xl mx-auto">
                  {/* Client Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onMouseEnter={() => setHoveredRole("USER")}
                    onMouseLeave={() => setHoveredRole(null)}
                    className="group cursor-pointer"
                    onClick={() => handleRoleSelect("USER")}
                  >
                    <div className={`relative orbit-card rounded-2xl p-6 sm:p-8 h-full transition-all duration-300 ${
                      hoveredRole === "USER" ? "border-orbit-cyan/50 scale-[1.02] orbit-glow" : "border-orbit-border hover:border-orbit-cyan/20"
                    }`}>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orbit-cyan/10 to-orbit-purple/10 flex items-center justify-center mb-6 group-hover:from-orbit-cyan/20 group-hover:to-orbit-purple/20 transition-colors">
                        <Film className="w-8 h-8 sm:w-10 sm:h-10 text-orbit-cyan" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black mb-2">Client</h2>
                      <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                        Book professional video sessions, track your edits in real-time, and receive cinematic reels in 60 minutes.
                      </p>
                      <ul className="space-y-3 mb-8">
                        {[
                          { icon: <Zap className="w-4 h-4" />, text: "Browse & Book Packages" },
                          { icon: <Camera className="w-4 h-4" />, text: "Real-Time Tracking" },
                          { icon: <Shield className="w-4 h-4" />, text: "Secure Payment Gate" },
                          { icon: <Star className="w-4 h-4" />, text: "Brand DNA Matching" },
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                            <span className="text-orbit-cyan">{item.icon}</span>
                            {item.text}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold py-5 sm:py-6 text-base orbit-glow">
                        Enter as Client
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>

                  {/* Partner Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    onMouseEnter={() => setHoveredRole("PARTNER")}
                    onMouseLeave={() => setHoveredRole(null)}
                    className="group cursor-pointer"
                    onClick={() => handleRoleSelect("PARTNER")}
                  >
                    <div className={`relative orbit-card rounded-2xl p-6 sm:p-8 h-full transition-all duration-300 ${
                      hoveredRole === "PARTNER" ? "border-orbit-purple/50 scale-[1.02] orbit-glow" : "border-orbit-border hover:border-orbit-purple/20"
                    }`}>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orbit-purple/10 to-orbit-cyan/10 flex items-center justify-center mb-6 group-hover:from-orbit-purple/20 group-hover:to-orbit-cyan/20 transition-colors">
                        <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-orbit-purple" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black mb-2">Partner</h2>
                      <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                        Accept bookings, capture footage with the Orbit Capture Module, sync to cloud, and protect client privacy.
                      </p>
                      <ul className="space-y-3 mb-8">
                        {[
                          { icon: <Users className="w-4 h-4" />, text: "Accept Bookings" },
                          { icon: <Camera className="w-4 h-4" />, text: "Orbit Capture Module" },
                          { icon: <Shield className="w-4 h-4" />, text: "Privacy Shield Protocol" },
                          { icon: <Zap className="w-4 h-4" />, text: "Cloud Sync & Wipe" },
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                            <span className="text-orbit-purple">{item.icon}</span>
                            {item.text}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full bg-gradient-to-r from-orbit-purple to-orbit-cyan text-white hover:opacity-90 font-bold py-5 sm:py-6 text-base"
                        style={{ boxShadow: hoveredRole === "PARTNER" ? "0 0 30px rgba(160, 32, 240, 0.3)" : undefined }}
                      >
                        Enter as Partner
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                </div>

                <motion.p
                  className="text-center text-xs text-muted-foreground/50 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Your role is locked after selection. You can log out anytime to switch.
                </motion.p>
              </motion.div>
            )}

            {step === "profile" && (
              <motion.div
                key="profile-step"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-md mx-auto">
                  {/* Back button */}
                  <button
                    onClick={() => setStep("role")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to role selection
                  </button>

                  {/* Title */}
                  <div className="text-center mb-6">
                    <Badge variant="outline" className={`mb-4 ${
                      isAccentCyan
                        ? "border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5"
                        : "border-orbit-purple/30 text-orbit-purple bg-orbit-purple/5"
                    } px-4 py-1.5`}>
                      {selectedRole === "USER" ? "Client Account" : "Partner Account"}
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
                      <span className="text-gradient-orbit">Join the</span>{" "}
                      <span className="text-foreground">Orbit</span>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Sign in or create your account to get started
                    </p>
                  </div>

                  {/* ─── Social Login Buttons ─── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {/* Google Login */}
                    <button
                      onClick={handleGoogleLogin}
                      className="orbit-card rounded-xl px-4 py-3 flex items-center justify-center gap-2.5 hover:border-orbit-cyan/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span className="text-sm font-semibold text-foreground/90 group-hover:text-foreground">Google</span>
                    </button>

                    {/* Apple Login */}
                    <button
                      onClick={handleAppleLogin}
                      className="orbit-card rounded-xl px-4 py-3 flex items-center justify-center gap-2.5 hover:border-orbit-purple/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      <span className="text-sm font-semibold text-foreground/90 group-hover:text-foreground">Apple</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-orbit-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-3 text-muted-foreground/60 tracking-widest">Or Email</span>
                    </div>
                  </div>

                  {/* ─── Avatar Selection ─── */}
                  <div className="orbit-card rounded-2xl p-5 sm:p-6 mb-4">
                    {/* Avatar mode tabs */}
                    <div className="flex items-center justify-center gap-2 mb-5">
                      {[
                        { mode: "color" as AvatarMode, label: "Color", icon: <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-orbit-cyan to-orbit-purple inline-block" /> },
                        { mode: "emoji" as AvatarMode, label: "Avatar", icon: <span className="text-sm">👤</span> },
                        { mode: "photo" as AvatarMode, label: "Photo", icon: <ImagePlus className="w-3.5 h-3.5" /> },
                      ].map((tab) => (
                        <button
                          key={tab.mode}
                          onClick={() => setAvatarMode(tab.mode)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                            avatarMode === tab.mode
                              ? "bg-white/10 text-foreground ring-1 ring-white/20"
                              : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-white/5"
                          }`}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Large avatar preview */}
                    <div className="flex items-center justify-center mb-5">
                      {renderAvatarPreview()}
                    </div>

                    {/* Color selection */}
                    {avatarMode === "color" && (
                      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                        {AVATAR_COLORS.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => setAvatarColor(i)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br ${color} transition-all duration-200 ${
                              avatarColor === i
                                ? "scale-125 ring-2 ring-white/70 ring-offset-2 ring-offset-[#081C43]"
                                : "opacity-50 hover:opacity-100 hover:scale-110"
                            }`}
                            aria-label={`Avatar color ${i + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Emoji avatar selection */}
                    {avatarMode === "emoji" && (
                      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-32 overflow-y-auto scrollbar-hide">
                        {AVATAR_EMOJIS.map((emoji, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedEmoji(emoji)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all duration-200 ${
                              selectedEmoji === emoji
                                ? "bg-orbit-purple/20 ring-2 ring-orbit-purple/50 scale-110"
                                : "bg-white/5 hover:bg-white/10 hover:scale-105"
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Photo upload */}
                    {avatarMode === "photo" && (
                      <div className="flex flex-col items-center gap-3">
                        {photoPreview ? (
                          <div className="relative group">
                            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-orbit-cyan/30">
                              <img src={photoPreview} alt="Your photo" className="w-full h-full object-cover" />
                            </div>
                            <button
                              onClick={() => { setPhotoPreview(null); setAvatarMode("color"); }}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : null}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-orbit-border/50 text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
                        >
                          <Camera className="w-4 h-4" />
                          {photoPreview ? "Change Photo" : "Choose from Gallery"}
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <p className="text-[10px] text-muted-foreground/40">Max 5MB · JPG, PNG, WebP</p>
                      </div>
                    )}
                  </div>

                  {/* ─── Profile Form ─── */}
                  <div className="orbit-card rounded-2xl p-5 sm:p-6 space-y-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Full Name *
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="bg-white/5 border-orbit-border text-foreground placeholder:text-muted-foreground/40 focus:border-orbit-cyan h-11"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" /> Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          type="email"
                          className="bg-white/5 border-orbit-border text-foreground placeholder:text-muted-foreground/40 focus:border-orbit-cyan h-11 pl-10"
                        />
                      </div>
                    </div>

                    {/* Phone (India — 10 digits) */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> Phone
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm text-muted-foreground/60 font-medium">
                          <span className="text-xs">🇮🇳</span>
                          <span>+91</span>
                          <span className="text-orbit-border">|</span>
                        </div>
                        <Input
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="10-digit mobile number"
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          className={`bg-white/5 text-foreground placeholder:text-muted-foreground/40 h-11 w-full pl-[5.5rem] ${
                            !isPhoneValid
                              ? "border-destructive focus:border-destructive"
                              : "border-orbit-border focus:border-orbit-cyan"
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        {!isPhoneValid && phone.length > 0 ? (
                          <p className="text-xs text-destructive">Please enter exactly 10 digits</p>
                        ) : (
                          <p className="text-xs text-muted-foreground/40">India mobile numbers only</p>
                        )}
                        <p className="text-xs text-muted-foreground/40">{phone.length}/10</p>
                      </div>
                    </div>
                  </div>

                  {/* Continue Button → OTP */}
                  <Button
                    onClick={handleProfileComplete}
                    disabled={!name.trim() || !email.trim() || !isPhoneValid}
                    className={`w-full mt-6 font-bold py-6 text-base transition-all duration-300 ${
                      !name.trim() || !email.trim() || !isPhoneValid
                        ? "bg-white/5 text-muted-foreground/40 cursor-not-allowed"
                        : isAccentCyan
                        ? "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 orbit-glow"
                        : "bg-gradient-to-r from-orbit-purple to-orbit-cyan text-white hover:opacity-90"
                    }`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Continue to Verify Email
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <p className="text-center text-xs text-muted-foreground/40 mt-4">
                    You&apos;ll need to verify your email before continuing.
                  </p>

                  {/* Footer links */}
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-6">
                    <button className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
                      Privacy Policy
                    </button>
                    <span className="text-muted-foreground/20 hidden sm:inline">|</span>
                    <button className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
                      Terms of Service
                    </button>
                    <span className="text-muted-foreground/20 hidden sm:inline">|</span>
                    <button className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
                      Support
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "otp" && selectedRole && (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
              >
                <OTPVerification
                  email={email.trim()}
                  role={selectedRole}
                  onVerified={handleOtpVerified}
                  onBack={handleOtpBack}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-4">
        <div className="text-center text-xs text-muted-foreground/40">
          &copy; {new Date().getFullYear()} Orbit. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
