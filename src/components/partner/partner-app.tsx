"use client";

/**
 * 🟣 PARTNER FRONTEND | PartnerApp
 *
 * Main partner orchestrator component. Routes between:
 * - Home (partner): Available Work
 * - Work (partner-work): Completed Work History
 * - Earnings (partner-earnings): Earnings Overview + Stats
 * - Profile: User profile page
 *
 * Used by: page.tsx
 * Category: Partner UI
 */

import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { AnimatedBackground } from "@/components/shared";
import { PartnerNavbar } from "@/components/partner/partner-navbar";
import { PartnerDashboard } from "@/components/partner/partner-dashboard";
import { PartnerWork } from "@/components/partner/partner-work";
import { PartnerEarnings } from "@/components/partner/partner-earnings";
import { PartnerBottomNav } from "@/components/partner/partner-bottom-nav";
import { PartnerProfileView } from "@/components/partner/partner-profile-view";

export default function PartnerApp() {
  const { currentView } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case "partner-work":
        return (
          <motion.div
            key="work"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <PartnerWork />
          </motion.div>
        );
      case "partner-earnings":
        return (
          <motion.div
            key="earnings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <PartnerEarnings />
          </motion.div>
        );
      case "profile":
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <PartnerProfileView />
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            <PartnerDashboard />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <AnimatedBackground />
      <PartnerNavbar />
      <main className="flex-1 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </div>
      </main>
      <PartnerBottomNav />
    </div>
  );
}
