"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import LoginPage from "@/components/login-page";
import ClientApp from "@/components/client-app";
import PartnerApp from "@/components/partner-app";

export default function OrbitApp() {
  const { isAuthenticated, userRole } = useAppStore();

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <LoginPage />
        </motion.div>
      ) : userRole === "PARTNER" ? (
        <motion.div key="partner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <PartnerApp />
        </motion.div>
      ) : (
        <motion.div key="client" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <ClientApp />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
