const _jsxFileName = "src\\client\\frontend\\client-app.tsx";"use client";

/**
 * 🔵 CLIENT FRONTEND | ClientApp
 * 
 * Main client orchestrator component. Uses React.lazy for
 * code-splitting heavy sub-views. Only DashboardHome loads
 * eagerly since it's the default view.
 * 
 * Used by: page.tsx
 * Category: Client UI
 */

import { useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { ClientNavbar } from "./client-navbar";
import { DashboardHome } from "./dashboard-home";
import { BottomNav } from "./bottom-nav";

// Lazy-load heavy views — they only load when user navigates to them
const PackageDashboard = lazy(() =>
  import("./package-dashboard").then((m) => ({ default: m.PackageDashboard }))
);
const BookingFlow = lazy(() =>
  import("./booking-flow").then((m) => ({ default: m.BookingFlow }))
);
const TrackingDashboard = lazy(() =>
  import("./tracking-dashboard").then((m) => ({ default: m.TrackingDashboard }))
);
const ProfileView = lazy(() =>
  import("./profile-view").then((m) => ({ default: m.ProfileView }))
);

// Minimal loading fallback — avoids layout shift
function ViewLoader() {
  return (
    React.createElement('div', { className: "flex items-center justify-center py-20"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 38}}
      , React.createElement('div', { className: "w-8 h-8 rounded-full border-2 border-orbit-cyan/30 border-t-orbit-cyan animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}} )
    )
  );
}

export default function ClientApp() {
  const { currentView, fetchPackages, fetchClientBookings } = useAppStore();

  useEffect(() => { 
    fetchPackages(); 
    fetchClientBookings();

    // Poll every 10 seconds to keep booking status in sync with the server.
    // This is a fallback for when WebSocket events are missed or the page loads fresh.
    const syncInterval = setInterval(() => {
      fetchClientBookings();
    }, 10000);

    return () => clearInterval(syncInterval);
  }, [fetchPackages, fetchClientBookings]);

  return (
    React.createElement('div', { className: "min-h-screen flex flex-col bg-background relative"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
      , React.createElement(ClientNavbar, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 62}} )
      , React.createElement('main', { className: "flex-1 pb-20 px-3 sm:px-6 lg:px-8 overflow-x-hidden"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
        , React.createElement('div', { className: "max-w-7xl mx-auto" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
          , React.createElement(AnimatePresence, { mode: "wait", __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
            , currentView === "landing" && (
              React.createElement(motion.div, {
                key: "dashboard",
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}

                , React.createElement(DashboardHome, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 74}} )
              )
            )
            , currentView === "packages" && (
              React.createElement(motion.div, {
                key: "packages",
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}

                , React.createElement(Suspense, { fallback: React.createElement(ViewLoader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 85}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
                  , React.createElement(PackageDashboard, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 86}} )
                )
              )
            )
            , currentView === "booking" && (
              React.createElement(motion.div, {
                key: "booking",
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}

                , React.createElement(Suspense, { fallback: React.createElement(ViewLoader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 98}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
                  , React.createElement(BookingFlow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 99}} )
                )
              )
            )
            , currentView === "tracking" && (
              React.createElement(motion.div, {
                key: "tracking",
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}

                , React.createElement(Suspense, { fallback: React.createElement(ViewLoader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 111}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
                  , React.createElement(TrackingDashboard, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 112}} )
                )
              )
            )
            , currentView === "profile" && (
              React.createElement(motion.div, {
                key: "profile",
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}

                , React.createElement(Suspense, { fallback: React.createElement(ViewLoader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 124}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
                  , React.createElement(ProfileView, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 125}} )
                )
              )
            )
          )
        )
      )
      , React.createElement(BottomNav, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 132}} )
    )
  );
}