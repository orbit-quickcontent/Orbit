"use client";

/**
 * 🔵 CLIENT FRONTEND | HeroSection
 * 
 * Landing page hero with orbital ring animations, floating particles,
 * SVG wave backgrounds, and call-to-action buttons.
 * 
 * Used by: client-app.tsx
 * Category: Client UI
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";

export function HeroSection() {
  const { setCurrentView } = useAppStore();
  const particles = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      top: ((i * 37 + 13) % 100),
      left: ((i * 53 + 29) % 100),
      delay: (i * 0.25) % 4,
      dur: 3 + (i % 5),
      cyan: i % 2 === 0,
    })), []
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "url(/hero-bg.png)", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />

        <div className="absolute bottom-0 left-0 right-0 h-40 opacity-10">
          <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path
              fill="url(#orbitGrad)"
              d="M0,224L48,208C96,192,192,160,288,154.7C384,149,480,171,576,186.7C672,203,768,213,864,208C960,203,1056,181,1152,170.7C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
            <defs>
              <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00BFFF" />
                <stop offset="100%" stopColor="#A020F0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[500px] h-[500px] border border-orbit-cyan/5 rounded-full animate-orbit" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-[320px] h-[320px] border border-orbit-purple/8 rounded-full animate-orbit"
            style={{ animationDirection: "reverse", animationDuration: "15s" }}
          />
        </div>

        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              background: p.cyan ? "rgba(0, 191, 255, 0.3)" : "rgba(160, 32, 240, 0.3)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge variant="outline" className="mb-6 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5 px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Professional Cinema at On-Demand Speed
          </Badge>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="text-gradient-orbit">Professional</span>
          <br />
          <span className="text-foreground">Cinema.</span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3 sm:mb-4 leading-relaxed"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
        >
          Delivered in <span className="text-orbit-cyan font-semibold">60 Minutes.</span>
        </motion.p>

        <motion.p
          className="text-sm sm:text-base text-muted-foreground/70 max-w-xl mx-auto mb-6 sm:mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}
        >
          Desktop-grade professional edits by human editors. The Orbit Edge: Fluidity &amp; Precision.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base orbit-glow"
            onClick={() => setCurrentView("packages")}
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-orbit-border text-foreground hover:bg-white/5 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base"
            onClick={() => setCurrentView("tracking")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Track Order
          </Button>
        </motion.div>

        <motion.div
          className="mt-10 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { value: "60", unit: "min", label: "Avg Delivery" },
            { value: "4K", unit: "", label: "Quality" },
            { value: "500+", unit: "", label: "Projects" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-xl sm:text-3xl font-black text-gradient-orbit">
                {stat.value}<span className="text-xs sm:text-sm text-orbit-cyan/60">{stat.unit}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-orbit-cyan/40" />
      </motion.div>
    </section>
  );
}
