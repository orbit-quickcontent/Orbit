const _jsxFileName = "src\\app\\page.tsx";/**
 * ⚪ APP ENTRY | Main Page
 *
 * Root page component that manages app phases:
 * - splash → Animated loading screen with Orbit logo
 * - auth → LoginPage (role selection + profile creation)
 * - app → ClientApp or PartnerApp based on role
 *
 * Project Structure (4 sections):
 * └── src/
 *     ├── client/
 *     │   ├── frontend/               # 🔵 CLIENT FRONTEND: Client UI components
 *     │   └── backend/                # 🔵 CLIENT BACKEND: Client API handlers
 *     │
 *     ├── partner/
 *     │   ├── frontend/               # 🟣 PARTNER FRONTEND: Partner UI components
 *     │   └── backend/                # 🟣 PARTNER BACKEND: Partner API handlers
 *     │
 *     ├── shared/
 *     │   ├── frontend/               # 🟡 SHARED FRONTEND: Login, splash, etc.
 *     │   └── backend/                # 🟡 SHARED BACKEND: Auth handlers
 *     │
 *     ├── app/                        # Next.js App Router (thin API route wrappers)
 *     ├── lib/                        # Core: types, store, db, utils
 *     ├── hooks/                      # Custom React hooks
 *     └── components/ui/              # shadcn/ui components
 */

"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { LoginPage } from "@/shared/frontend";
import ClientApp from "@/client/frontend/client-app";
import PartnerApp from "@/partner/frontend/partner-app";

export default function OrbitApp() {
  const { appPhase, isAuthenticated, userRole, logout, _hydrated, _hydrate } = useAppStore();

  // Hydrate state from localStorage after mount
  useEffect(() => {
    _hydrate();
  }, [_hydrate]);

  // Force logout on role mismatch (e.g. Client app loading Partner session)
  useEffect(() => {
    if (_hydrated && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get("role");
      if (roleParam && isAuthenticated && userRole !== roleParam) {
        logout();
      }
    }
  }, [_hydrated, isAuthenticated, userRole, logout]);

  // Before hydration, show a blank loading state to avoid flicker
  if (!_hydrated) {
    return (
      React.createElement('div', { className: "fixed inset-0 z-[200] flex items-center justify-center bg-[#000000]"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
        , React.createElement('div', { className: "flex flex-col items-center gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
          , React.createElement('div', { className: "w-16 h-16 rounded-full border-2 border-orbit-cyan/30 border-t-orbit-cyan animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}} )
          , React.createElement('p', { className: "text-xs text-muted-foreground/40 tracking-widest uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}, "Orbit")
        )
      )
    );
  }

  return (
    React.createElement(React.Fragment, null
      , React.createElement(AnimatePresence, { mode: "wait", __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}
        , appPhase === "auth" && !isAuthenticated && (
          React.createElement(motion.div, {
            key: "login",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.3 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}

            , React.createElement(LoginPage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 80}} )
          )
        )

        , appPhase === "app" && isAuthenticated && (
          React.createElement(motion.div, {
            key: userRole === "PARTNER" ? "partner" : "client",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.3 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}

            , userRole === "PARTNER" ? React.createElement(PartnerApp, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 92}} ) : React.createElement(ClientApp, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 92}} )
          )
        )
      )
    )
  );
}
