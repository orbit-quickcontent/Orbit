const _jsxFileName = "src\\partner\\frontend\\partner-bottom-nav.tsx";"use client";

/**
 * 🟣 PARTNER FRONTEND | PartnerBottomNav
 *
 * Bottom navigation with 4 tabs: Home, Work, Earnings, Profile
 * Each tab navigates to its own view in the partner app.
 *
 * Used by: partner-app.tsx
 * Category: Partner UI
 */

import { motion } from "framer-motion";
import { LayoutDashboard, Briefcase, Wallet, User } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getInitials } from "@/lib/utils";


const NAV_ITEMS




 = [
  { icon: LayoutDashboard, label: "Home", view: "partner" },
  { icon: Briefcase, label: "Work", view: "partner-work" },
  { icon: Wallet, label: "Earnings", view: "partner-earnings" },
  { icon: User, label: "Profile", view: "profile", isProfile: true },
];

export function PartnerBottomNav() {
  const { currentView, setCurrentView, user, partnerActiveBooking } = useAppStore();

  const getIsActive = (view) => {
    if (view === "partner") return currentView === "partner";
    if (view === "partner-work") return currentView === "partner-work";
    if (view === "partner-earnings") return currentView === "partner-earnings";
    if (view === "profile") return currentView === "profile";
    return false;
  };

  const avatarGradient = user.avatar || "from-orbit-purple to-orbit-cyan";
  const initials = getInitials(user.name);

  const renderNavAvatar = (size, textSize) => {
    if (user.avatarType === "photo" && user.avatarPhotoUrl) {
      return (
        React.createElement('div', { className: `${size} rounded-full overflow-hidden`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}
          , React.createElement('img', { src: user.avatarPhotoUrl, alt: "Profile", className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}} )
        )
      );
    }
    if (user.avatarType === "avatar" && user.avatarEmoji) {
      return (
        React.createElement('div', { className: `${size} rounded-full bg-gradient-to-br from-orbit-purple/20 to-orbit-cyan/20 backdrop-blur-sm flex items-center justify-center ${textSize}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}
          , user.avatarEmoji
        )
      );
    }
    return (
      React.createElement('div', { className: `${size} rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center ${textSize} font-bold text-white`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
        , initials
      )
    );
  };

  return (
    React.createElement('nav', { className: "fixed bottom-0 left-0 right-0 z-50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
      , React.createElement('div', { className: "px-4 sm:px-6 pb-[env(safe-area-inset-bottom,8px)] pt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
        , React.createElement('div', { className: "orbit-nav-pill max-w-lg mx-auto"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
          , React.createElement('div', { className: "flex items-center justify-around h-[52px] sm:h-[56px] relative"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}
            , NAV_ITEMS.map((navItem, idx) => {
              const isActive = getIsActive(navItem.view);
              const Icon = navItem.icon;

              // ─── Profile Tab ────────────────────────────
              if (navItem.isProfile) {
                return (
                  React.createElement('button', {
                    key: navItem.view,
                    onClick: () => setCurrentView(navItem.view),
                    className: "relative flex flex-col items-center justify-center gap-0.5 w-14 sm:w-18 h-full group"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}

                    /* Active indicator */
                    , isActive && (
                      React.createElement(motion.div, {
                        layoutId: "partnerNavIndicator",
                        className: "absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-gradient-to-r from-orbit-purple to-orbit-cyan"         ,
                        transition: { type: "spring", stiffness: 350, damping: 30 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}
                      )
                    )

                    , React.createElement('div', { className: `relative z-10 transition-all duration-200 ${
                      isActive
                        ? "ring-2 ring-white/30 scale-110"
                        : "opacity-50 group-hover:opacity-80 group-hover:scale-105"
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
                      , renderNavAvatar("w-5 h-5 sm:w-6 sm:h-6", "text-[8px] sm:text-[10px]")
                    )

                    , React.createElement('span', {
                      className: `relative z-10 text-[8px] sm:text-[10px] leading-tight transition-colors duration-200 ${
                        isActive
                          ? "text-foreground font-bold"
                          : "text-muted-foreground/40 font-medium group-hover:text-muted-foreground/70"
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}

                      , navItem.label
                    )
                  )
                );
              }

              // ─── Regular Tabs ───────────────────────────
              return (
                React.createElement('button', {
                  key: navItem.label + idx,
                  onClick: () => setCurrentView(navItem.view),
                  className: "relative flex flex-col items-center justify-center gap-0.5 w-14 sm:w-18 h-full group"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}

                  /* Active indicator bar */
                  , isActive && (
                    React.createElement(motion.div, {
                      layoutId: "partnerNavIndicator",
                      className: "absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-gradient-to-r from-orbit-cyan to-orbit-purple"         ,
                      transition: { type: "spring", stiffness: 350, damping: 30 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}
                    )
                  )

                  , React.createElement('div', { className: "relative z-10" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}
                    , React.createElement('div', {
                      className: `w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-br from-orbit-cyan/15 to-orbit-purple/15 scale-105"
                          : "group-hover:bg-white/[0.04] group-hover:scale-105"
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}

                      , React.createElement(Icon, {
                        className: `w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] transition-all duration-200 ${
                          isActive
                            ? navItem.view === "partner-earnings"
                              ? "text-green-400"
                              : navItem.view === "partner-work"
                                ? "text-green-400"
                                : "text-orbit-cyan"
                            : "text-muted-foreground/40 group-hover:text-muted-foreground/70"
                        }`,
                        strokeWidth: isActive ? 2.2 : 1.8, __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}
                      )
                    )
                  )

                  , React.createElement('span', {
                    className: `relative z-10 text-[8px] sm:text-[10px] leading-tight transition-colors duration-200 ${
                      isActive
                        ? "text-foreground font-bold"
                        : "text-muted-foreground/40 font-medium group-hover:text-muted-foreground/70"
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}

                    , navItem.label
                  )

                  /* Work badge — shows when active booking */
                  , navItem.label === "Work" && partnerActiveBooking && (
                    React.createElement('div', { className: "absolute top-0.5 right-3 sm:right-4 w-2 h-2 rounded-full bg-orbit-purple animate-pulse z-20"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}} )
                  )

                  /* Earnings dot */
                  , navItem.label === "Earnings" && (
                    React.createElement('div', { className: "absolute top-0.5 right-3 sm:right-4 w-2 h-2 rounded-full bg-green-400 z-20"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}} )
                  )
                )
              );
            })
          )
        )
      )
    )
  );
}