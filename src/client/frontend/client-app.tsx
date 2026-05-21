"use client";

/**
 * 🔵 CLIENT FRONTEND | ClientApp
 * 
 * Main client orchestrator component. Composes the personalized
 * greeting header, modern dashboard home, and all sub-views with
 * Instagram-style bottom navigation.
 * 
 * Used by: page.tsx
 * Category: Client UI
 */

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { AnimatedBackground } from "@/shared/frontend";
import { ClientNavbar } from "./client-navbar";
import { DashboardHome } from "./dashboard-home";
import { PackageDashboard } from "./package-dashboard";
import { BookingFlow } from "./booking-flow";
import { TrackingDashboard } from "./tracking-dashboard";
import { BottomNav } from "./bottom-nav";
import { ProfileView } from "./profile-view";

export default function ClientApp() {
  const { currentView, fetchPackages } = useAppStore();

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <AnimatedBackground />
      <ClientNavbar />
      <main className="flex-1 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {currentView === "landing" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardHome />
              </motion.div>
            )}
            {currentView === "packages" && (
              <motion.div
                key="packages"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <PackageDashboard />
              </motion.div>
            )}
            {currentView === "booking" && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <BookingFlow />
              </motion.div>
            )}
            {currentView === "tracking" && (
              <motion.div
                key="tracking"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <TrackingDashboard />
              </motion.div>
            )}
            {currentView === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <ProfileView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
