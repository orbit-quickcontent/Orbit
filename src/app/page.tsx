/**
 * ⚪ APP ENTRY | Main Page
 * 
 * Root page component that manages app phases:
 * - splash → Animated loading screen with Orbit logo
 * - auth → LoginPage (role selection + profile creation)
 * - app → ClientApp or PartnerApp based on role
 * 
 * Auth state is persisted in localStorage so users stay logged in.
 * Hydration-safe: localStorage is read AFTER mount to avoid SSR mismatch.
 * 
 * Project Structure:
 * └── src/
 *     ├── app/                        # Next.js App Router
 *     │   ├── page.tsx                # ← This file: Main entry & phase routing
 *     │   ├── layout.tsx              # Root layout with providers
 *     │   ├── globals.css             # Global styles & Tailwind config
 *     │   └── api/                    # 🔴 BACKEND: API Routes
 *     │
 *     ├── components/
 *     │   ├── client/                 # 🔵 CLIENT FRONTEND: Client-specific UI
 *     │   │   ├── client-app.tsx      #   Client orchestrator
 *     │   │   ├── client-navbar.tsx   #   Navigation bar
 *     │   │   ├── bottom-nav.tsx      #   Instagram-style bottom nav
 *     │   │   ├── profile-view.tsx    #   User profile page
 *     │   │   ├── hero-section.tsx    #   Landing page hero
 *     │   │   ├── booking-flow.tsx    #   3-step booking + Brand DNA
 *     │   │   ├── tracking-dashboard.tsx # Real-time tracking
 *     │   │   └── ...                 #   Other client sections
 *     │   │
 *     │   ├── partner/                # 🟣 PARTNER FRONTEND: Partner-specific UI
 *     │   │   ├── partner-app.tsx     #   Partner orchestrator
 *     │   │   └── ...                 #   Other partner sections
 *     │   │
 *     │   ├── shared/                 # 🟡 SHARED: Common across Client & Partner
 *     │   │   ├── login-page.tsx      #   Login with role + profile creation
 *     │   │   ├── splash-screen.tsx   #   Animated loading screen
 *     │   │   └── animated-background.tsx # Moving graphic background
 *     │   │
 *     │   └── ui/                     # ⚪ UI LIB: shadcn/ui components
 *     │
 *     ├── lib/                        # 🟠 CORE: Backend & shared utilities
 *     │   ├── types.ts               #   Shared type definitions
 *     │   ├── store.ts               #   Zustand state (with localStorage)
 *     │   ├── db.ts                  #   Prisma database client
 *     │   └── utils.ts               #   Utility functions
 *     │
 *     └── hooks/                      # 🟠 HOOKS: Custom React hooks
 */

"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { LoginPage, SplashScreen } from "@/components/shared";
import ClientApp from "@/components/client/client-app";
import PartnerApp from "@/components/partner/partner-app";

export default function OrbitApp() {
  const { appPhase, setAppPhase, isAuthenticated, userRole, _hydrated, _hydrate } = useAppStore();

  // Hydrate state from localStorage after mount
  useEffect(() => {
    _hydrate();
  }, [_hydrate]);

  const handleSplashComplete = useCallback(() => {
    if (isAuthenticated) {
      setAppPhase("app");
    } else {
      setAppPhase("auth");
    }
  }, [isAuthenticated, setAppPhase]);

  // Before hydration, show a blank loading state to avoid flicker
  if (!_hydrated) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#081C43]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-orbit-cyan/30 border-t-orbit-cyan animate-spin" />
          <p className="text-xs text-muted-foreground/40 tracking-widest uppercase">Orbit</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {appPhase === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SplashScreen onComplete={handleSplashComplete} />
          </motion.div>
        )}

        {appPhase === "auth" && !isAuthenticated && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginPage />
          </motion.div>
        )}

        {appPhase === "app" && isAuthenticated && (
          <motion.div
            key={userRole === "PARTNER" ? "partner" : "client"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {userRole === "PARTNER" ? <PartnerApp /> : <ClientApp />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
