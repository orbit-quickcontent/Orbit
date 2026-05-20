"use client";

/**
 * 🔵 CLIENT FRONTEND | ClientNavbar
 * 
 * Personalized greeting header inspired by modern app dashboards.
 * Shows user avatar, greeting ("Hi, {Name}"), subtitle, and notification bell.
 * No traditional nav links — navigation is handled by BottomNav.
 * 
 * Used by: client-app.tsx
 * Category: Client UI
 */

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Settings, ChevronDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { getInitials, getGreeting } from "@/lib/utils";

export function ClientNavbar() {
  const { user, currentBooking, bookings, logout, setCurrentView } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const avatarGradient = user.avatar || "from-orbit-cyan to-orbit-purple";
  const initials = getInitials(user.name);

  const firstName = user.name ? user.name.split(" ")[0] : "there";
  const activeBookings = bookings.filter(
    (b) => !["DELIVERED", "CANCELLED"].includes(b.status)
  ).length;
  // Only show notification for truly active (non-completed) bookings
  const hasActiveBooking = currentBooking
    ? !["DELIVERED", "CANCELLED"].includes(currentBooking.status)
    : false;
  const unreadNotifications = hasActiveBooking ? 1 : activeBookings > 0 ? activeBookings : 0;

  return (
    <header className="sticky top-0 z-50">
      {/* Gradient background that blends with content */}
      <div className="bg-gradient-to-b from-[#081C43] via-[#0A2860] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-5">
            {/* Left: Avatar + Greeting */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Avatar */}
              <button
                onClick={() => setCurrentView("profile")}
                className="relative group"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-sm sm:text-base font-bold text-white shadow-lg transition-transform duration-200 group-hover:scale-105 group-active:scale-95`}
                >
                  {initials}
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-green-400 border-2 border-[#0A2860]" />
              </button>

              {/* Greeting Text */}
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground/70 font-medium">
                  {getGreeting()}
                </p>
                <h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                  Hi, {firstName}
                </h1>
              </div>
            </div>

            {/* Right: Search + Notification + Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search button */}
              <button className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/[0.06] backdrop-blur-xl flex items-center justify-center text-muted-foreground hover:text-orbit-cyan hover:bg-white/10 transition-all duration-200">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Notification bell */}
              <button
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/[0.06] backdrop-blur-xl flex items-center justify-center text-muted-foreground hover:text-orbit-cyan hover:bg-white/10 transition-all duration-200"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Quick menu dropdown toggle (mobile) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-10 h-10 rounded-full bg-white/[0.06] backdrop-blur-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Subtitle / Status line */}
          <div className="pb-3 sm:pb-4 flex items-center gap-2">
            {hasActiveBooking ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orbit-cyan animate-pulse" />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Your edit is{" "}
                  <span
                    className="text-orbit-cyan font-semibold cursor-pointer hover:underline"
                    onClick={() => setCurrentView("tracking")}
                  >
                    being tracked
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground/70">
                Ready to create something cinematic?
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 sm:right-6 top-20 sm:top-24 w-56 orbit-card-strong rounded-2xl overflow-hidden shadow-2xl z-[60]"
          >
            <div className="p-2">
              {/* Notifications */}
              {activeBookings > 0 && (
                <button
                  onClick={() => {
                    setCurrentView("tracking");
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-orbit-cyan/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-orbit-cyan" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Booking</p>
                    <p className="text-xs text-muted-foreground">
                      {activeBookings} in progress
                    </p>
                  </div>
                </button>
              )}

              <button
                onClick={() => {
                  setCurrentView("profile");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-orbit-purple/10 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-orbit-purple" />
                </div>
                <div>
                  <p className="text-sm font-medium">Settings</p>
                  <p className="text-xs text-muted-foreground">
                    Profile & preferences
                  </p>
                </div>
              </button>

              <div className="h-px bg-orbit-border/30 my-1" />

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/5 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-400">Log Out</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
