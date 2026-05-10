"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Camera,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  Film,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";

// Pre-computed particle positions (avoids hydration mismatch)
const LOGIN_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  top: ((i * 41 + 17) % 100),
  left: ((i * 59 + 23) % 100),
  delay: (i * 0.2) % 4,
  dur: 3 + (i % 5),
  cyan: i % 2 === 0,
}));

export default function LoginPage() {
  const { login } = useAppStore();
  const [hoveredRole, setHoveredRole] = useState<"USER" | "PARTNER" | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "url(/hero-bg.png)", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />

        {/* Orbital Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[600px] h-[600px] border border-orbit-cyan/5 rounded-full animate-orbit" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-[400px] h-[400px] border border-orbit-purple/8 rounded-full animate-orbit"
            style={{ animationDirection: "reverse", animationDuration: "15s" }}
          />
        </div>

        {/* Floating Particles */}
        {LOGIN_PARTICLES.map((p, i) => (
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

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Image
              src="/orbit-logo.png"
              alt="Orbit Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-gradient-orbit">ORBIT</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <motion.div
            className="text-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-5 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Welcome to Orbit
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.95] mb-4">
              <span className="text-gradient-orbit">Choose Your</span>
              <br />
              <span className="text-foreground">Experience</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Select how you want to use Orbit. You&apos;ll stay in your lane — no switching between modes.
            </p>
          </motion.div>

          {/* Role Cards */}
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-8 max-w-3xl mx-auto">
            {/* Client Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onMouseEnter={() => setHoveredRole("USER")}
              onMouseLeave={() => setHoveredRole(null)}
              className="group cursor-pointer"
              onClick={() => login("USER")}
            >
              <div className={`relative orbit-card rounded-2xl p-6 sm:p-8 h-full transition-all duration-300 ${
                hoveredRole === "USER" ? "border-orbit-cyan/50 scale-[1.02] orbit-glow" : "border-orbit-border hover:border-orbit-cyan/20"
              }`}>
                {/* Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orbit-cyan/10 to-orbit-purple/10 flex items-center justify-center mb-6 group-hover:from-orbit-cyan/20 group-hover:to-orbit-purple/20 transition-colors">
                  <Film className="w-8 h-8 sm:w-10 sm:h-10 text-orbit-cyan" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-black mb-2">Client</h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                  Book professional video sessions, track your edits in real-time, and receive cinematic reels in 60 minutes.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {[
                    { icon: <Zap className="w-4 h-4" />, text: "Browse & Book Packages" },
                    { icon: <Camera className="w-4 h-4" />, text: "Real-Time Tracking" },
                    { icon: <Shield className="w-4 h-4" />, text: "Secure Payment Gate" },
                    { icon: <Star className="w-4 h-4" />, text: "Brand DNA Matching" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <span className="text-orbit-cyan">{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold py-5 sm:py-6 text-base orbit-glow"
                >
                  Enter as Client
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>

            {/* Partner Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onMouseEnter={() => setHoveredRole("PARTNER")}
              onMouseLeave={() => setHoveredRole(null)}
              className="group cursor-pointer"
              onClick={() => login("PARTNER")}
            >
              <div className={`relative orbit-card rounded-2xl p-6 sm:p-8 h-full transition-all duration-300 ${
                hoveredRole === "PARTNER" ? "border-orbit-purple/50 scale-[1.02] orbit-glow" : "border-orbit-border hover:border-orbit-purple/20"
              }`}>
                {/* Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orbit-purple/10 to-orbit-cyan/10 flex items-center justify-center mb-6 group-hover:from-orbit-purple/20 group-hover:to-orbit-cyan/20 transition-colors">
                  <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-orbit-purple" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-black mb-2">Partner</h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                  Accept bookings, capture footage with the Orbit Capture Module, sync to cloud, and protect client privacy.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {[
                    { icon: <Users className="w-4 h-4" />, text: "Accept Bookings" },
                    { icon: <Camera className="w-4 h-4" />, text: "Orbit Capture Module" },
                    { icon: <Shield className="w-4 h-4" />, text: "Privacy Shield Protocol" },
                    { icon: <Zap className="w-4 h-4" />, text: "Cloud Sync & Wipe" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <span className="text-orbit-purple">{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full bg-gradient-to-r from-orbit-purple to-orbit-cyan text-white hover:opacity-90 font-bold py-5 sm:py-6 text-base"
                  style={{ boxShadow: hoveredRole === "PARTNER" ? "0 0 30px rgba(160, 32, 240, 0.3)" : undefined }}
                >
                  Enter as Partner
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Bottom Note */}
          <motion.p
            className="text-center text-xs text-muted-foreground/50 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Your role is locked after selection. You can log out anytime to switch.
          </motion.p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-4">
        <div className="text-center text-xs text-muted-foreground/40">
          &copy; {new Date().getFullYear()} Orbit. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
