const _jsxFileName = "src\\partner\\frontend\\partner-app.tsx";"use client";

/**
 * 🟣 PARTNER FRONTEND | PartnerApp
 *
 * Main partner orchestrator component. Uses React.lazy for
 * code-splitting heavy sub-views. Only PartnerDashboard loads
 * eagerly since it's the default view.
 *
 * Used by: page.tsx
 * Category: Partner UI
 */

import { lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { PartnerNavbar } from "./partner-navbar";
import { PartnerDashboard } from "./partner-dashboard";
import { PartnerBottomNav } from "./partner-bottom-nav";

// Lazy-load heavy views
const PartnerWork = lazy(() =>
  import("./partner-work").then((m) => ({ default: m.PartnerWork }))
);
const PartnerEarnings = lazy(() =>
  import("./partner-earnings").then((m) => ({ default: m.PartnerEarnings }))
);
const PartnerProfileView = lazy(() =>
  import("./partner-profile-view").then((m) => ({ default: m.PartnerProfileView }))
);
const PartnerSettings = lazy(() =>
  import("./partner-settings").then((m) => ({ default: m.PartnerSettings }))
);

// Minimal loading fallback
function ViewLoader() {
  return (
    React.createElement('div', { className: "flex items-center justify-center py-20"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 38}}
      , React.createElement('div', { className: "w-8 h-8 rounded-full border-2 border-orbit-purple/30 border-t-orbit-purple animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}} )
    )
  );
}

export default function PartnerApp() {
  const { currentView } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case "partner-work":
        return (
          React.createElement(motion.div, {
            key: "work",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}

            , React.createElement(Suspense, { fallback: React.createElement(ViewLoader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 58}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
              , React.createElement(PartnerWork, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 59}} )
            )
          )
        );
      case "partner-earnings":
        return (
          React.createElement(motion.div, {
            key: "earnings",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}

            , React.createElement(Suspense, { fallback: React.createElement(ViewLoader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 72}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}
              , React.createElement(PartnerEarnings, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 73}} )
            )
          )
        );
      case "profile":
        return (
          React.createElement(motion.div, {
            key: "profile",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}

            , React.createElement(Suspense, { fallback: React.createElement(ViewLoader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 86}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}
              , React.createElement(PartnerProfileView, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 87}} )
            )
          )
        );
      case "partner-settings":
        return (
          React.createElement(motion.div, {
            key: "partner-settings",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}

            , React.createElement(Suspense, { fallback: React.createElement(ViewLoader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 100}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
              , React.createElement(PartnerSettings, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 101}} )
            )
          )
        );
      default:
        return (
          React.createElement(motion.div, {
            key: "dashboard",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}

            , React.createElement(PartnerDashboard, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 114}} )
          )
        );
    }
  };

  return (
    React.createElement('div', { className: "min-h-screen flex flex-col bg-background relative"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
      , React.createElement(PartnerNavbar, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 122}} )
      , React.createElement('main', { className: "flex-1 pb-20 px-3 sm:px-6 lg:px-8"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}
        , React.createElement('div', { className: "max-w-2xl mx-auto" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
          , React.createElement(AnimatePresence, { mode: "wait", __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
            , renderView()
          )
        )
      )
      , React.createElement(PartnerBottomNav, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 130}} )
    )
  );
}