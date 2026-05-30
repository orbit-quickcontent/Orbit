"use client";

/**
 * 🟡 SHARED | SplashScreen
 * 
 * Animated loading screen shown before the app starts.
 * Features the Orbit logo with a pulsing glow ring,
 * gradient loading bar, and smooth fade-out transition.
 * 
 * Used by: page.tsx
 * Category: Shared UI
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Variable speed - fast at start, slows down, then fast finish
        const increment = prev < 30 ? 4 : prev < 70 ? 2 : prev < 90 ? 3 : 5;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Small delay then fade out
      const timer = setTimeout(() => setFadeOut(true), 400);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [fadeOut, onComplete]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#000000]"
        >


          {/* Logo container with glow */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          >
            {/* Glow behind logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 blur-2xl" />
            </div>

            {/* Logo */}
            <div className="relative">
              <Image
                src="/orbit-logo.png"
                alt="Orbit Logo"
                width={80}
                height={80}
                className="sm:w-24 sm:h-24 rounded-full"
                priority
              />
              {/* Pulse ring around logo */}
              <div className="absolute inset-0 rounded-full animate-pulse-ring border-2 border-orbit-cyan/30" />
            </div>
          </motion.div>

          {/* App name */}
          <motion.div
            className="relative z-10 mt-6 sm:mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gradient-orbit">
              ORBIT
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground/60 mt-2 tracking-widest uppercase">
              Professional Cinema. Delivered.
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="relative z-10 mt-10 sm:mt-14 w-48 sm:w-64"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orbit-cyan to-orbit-purple transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-muted-foreground/40 tracking-wider uppercase">Loading</span>
              <span className="text-[10px] text-muted-foreground/40 tabular-nums">{progress}%</span>
            </div>
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            className="absolute bottom-8 text-[10px] text-muted-foreground/25 tracking-widest uppercase z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            The Orbit Edge
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
