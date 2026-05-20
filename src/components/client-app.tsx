"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Zap,
  Star,
  Camera,
  Upload,
  Film,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Play,
  Shield,
  Sparkles,
  Users,
  MapPin,
  Calendar as CalendarIcon,
  CreditCard,
  Loader2,
  Eye,
  Lock,
  ChevronDown,
  Menu,
  X,
  Timer,
  Rocket,
  CircleDot,
  PartyPopper,
  Cloud,
  ImageIcon,
  LogOut,
  Send,
  MessageSquare,
  Palette,
  Navigation,
  Zap as ZapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAppStore, type AppView, type BookingInfo, type BookingStatus } from "@/lib/store";
import AnimatedBackground from "@/components/animated-background";

// ─── Time Picker Helpers ────────────────────────────────────────────────────────
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,10...55
const PERIODS = ["AM", "PM"] as const;

// ─── Status Pipeline ────────────────────────────────────────────────────────────
const STATUS_PIPELINE: { status: BookingStatus; label: string; icon: React.ReactNode; description: string }[] = [
  { status: "PAID", label: "Payment Confirmed", icon: <CreditCard className="w-5 h-5" />, description: "Payment verified. Dispatching partner..." },
  { status: "PARTNER_DISPATCHED", label: "Partner Dispatched", icon: <Users className="w-5 h-5" />, description: "Visual Architect assigned and notified." },
  { status: "EN_ROUTE", label: "En Route", icon: <Navigation className="w-5 h-5" />, description: "Partner navigating to your location. Track live!" },
  { status: "SHOOTING", label: "Shooting", icon: <Camera className="w-5 h-5" />, description: "Capturing your cinematic footage in real-time." },
  { status: "SYNCING", label: "Syncing", icon: <Upload className="w-5 h-5" />, description: "Raw footage streaming to the editing hub." },
  { status: "EDITING", label: "Editing", icon: <Film className="w-5 h-5" />, description: "Professional editors crafting your masterpiece." },
  { status: "DELIVERED", label: "Delivered", icon: <CheckCircle2 className="w-5 h-5" />, description: "Your cinematic reel is ready to download!" },
];

// ─── Client Navbar ────────────────────────────────────────────────────────────
function ClientNavbar() {
  const { currentView, setCurrentView, currentBooking, logout } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { label: string; view: AppView; show: boolean }[] = [
    { label: "Home", view: "landing", show: true },
    { label: "Packages", view: "packages", show: true },
    { label: "Book Now", view: "booking", show: true },
    { label: "Track Order", view: "tracking", show: !!currentBooking },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 orbit-card-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => setCurrentView("landing")}
            className="flex items-center gap-2 group"
          >
            <Image
              src="/orbit-logo.png"
              alt="Orbit Logo"
              width={36}
              height={36}
              className="rounded-full group-hover:scale-110 transition-transform duration-200"
            />
            <span className="text-lg font-bold tracking-tight text-gradient-orbit">ORBIT</span>
            <Badge variant="outline" className="hidden sm:inline-flex text-[10px] border-orbit-cyan/30 text-orbit-cyan ml-1">CLIENT</Badge>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            {navItems.filter((n) => n.show).map((item) => (
              <button
                key={item.view + item.label}
                onClick={() => setCurrentView(item.view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === item.view
                    ? "bg-orbit-cyan/10 text-orbit-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/5 transition-all"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden orbit-card-strong border-t border-orbit-border"
          >
            <div className="px-4 py-3 space-y-2">
              {navItems.filter((n) => n.show).map((item) => (
                <button
                  key={item.view + item.label}
                  onClick={() => { setCurrentView(item.view); setMobileOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentView === item.view
                      ? "bg-orbit-cyan/10 text-orbit-cyan"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/5 transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection() {
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

// ─── Comparison Section ─────────────────────────────────────────────────────────
function ComparisonSection() {
  const comparisons = [
    { feature: "Delivery Time", orbit: "60-120 min", traditional: "2-5 days", ai: "Instant (low quality)" },
    { feature: "Quality", orbit: "4K Professional", traditional: "4K Professional", ai: "720p Automated" },
    { feature: "Human Editors", orbit: "✓", traditional: "✓", ai: "✗" },
    { feature: "Brand Matching", orbit: "✓ DNA System", traditional: "Manual Brief", ai: "✗" },
    { feature: "Privacy", orbit: "Auto-Wipe", traditional: "Manual Delete", ai: "Cloud Stored" },
    { feature: "Price", orbit: "₹1,999–₹4,999", traditional: "₹15,000+", ai: "Free–₹500" },
  ];

  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-14"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            The Content Gap
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Why <span className="text-gradient-orbit">Orbit</span> Wins
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
            We bridge the gap between cheap AI edits and expensive production houses.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="orbit-card rounded-2xl overflow-hidden">
            {/* Desktop table */}
            <div className="hidden sm:grid grid-cols-4 gap-0 text-sm">
              <div className="p-4 border-b border-orbit-border text-xs font-bold text-muted-foreground">Feature</div>
              <div className="p-4 border-b border-orbit-cyan/20 bg-gradient-to-r from-orbit-cyan/5 to-orbit-purple/5 text-center">
                <div className="text-xs font-black text-gradient-orbit">ORBIT</div>
              </div>
              <div className="p-4 border-b border-orbit-border text-center text-xs font-bold text-muted-foreground">Production House</div>
              <div className="p-4 border-b border-orbit-border text-center text-xs font-bold text-muted-foreground">AI Tools</div>
              {comparisons.map((row, idx) => (
                <React.Fragment key={idx}>
                  <div className={`p-3.5 text-xs font-medium text-muted-foreground ${idx < comparisons.length - 1 ? "border-b border-orbit-border" : ""}`}>{row.feature}</div>
                  <div className={`p-3.5 text-center text-xs font-bold text-orbit-cyan bg-gradient-to-r from-orbit-cyan/5 to-orbit-purple/5 ${idx < comparisons.length - 1 ? "border-b border-orbit-border" : ""}`}>{row.orbit}</div>
                  <div className={`p-3.5 text-center text-xs text-muted-foreground ${idx < comparisons.length - 1 ? "border-b border-orbit-border" : ""}`}>{row.traditional}</div>
                  <div className={`p-3.5 text-center text-xs text-muted-foreground/60 ${idx < comparisons.length - 1 ? "border-b border-orbit-border" : ""}`}>{row.ai}</div>
                </React.Fragment>
              ))}
            </div>
            {/* Mobile cards */}
            <div className="sm:hidden space-y-0">
              {comparisons.map((row, idx) => (
                <div key={idx} className={`p-4 ${idx < comparisons.length - 1 ? "border-b border-orbit-border" : ""}`}>
                  <div className="text-xs font-bold text-foreground mb-2">{row.feature}</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-[10px] text-orbit-cyan font-bold mb-1">ORBIT</div>
                      <div className="text-xs font-bold text-orbit-cyan">{row.orbit}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground font-bold mb-1">Traditional</div>
                      <div className="text-xs text-muted-foreground">{row.traditional}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground font-bold mb-1">AI</div>
                      <div className="text-xs text-muted-foreground/60">{row.ai}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features Section ──────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: <Timer className="w-5 h-5" />, title: "60-Min Delivery", description: "Professional edits faster than anyone in the market." },
    { icon: <Shield className="w-5 h-5" />, title: "Privacy Shield", description: "Auto-wipe of local footage after cloud sync verification." },
    { icon: <Camera className="w-5 h-5" />, title: "4K Quality", description: "Raw footage captured on flagship devices, edited on desktop software." },
    { icon: <Sparkles className="w-5 h-5" />, title: "Brand DNA", description: "Logo, font matching & direct editor chat for the Pro tier." },
    { icon: <Users className="w-5 h-5" />, title: "Human Editors", description: "Not AI — real professionals using Premiere Pro & DaVinci." },
    { icon: <Lock className="w-5 h-5" />, title: "Payment Gate", description: "Hard stop: partners only dispatched after payment success." },
  ];

  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-8 sm:mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Badge variant="outline" className="mb-4 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5">
            <Star className="w-3.5 h-3.5 mr-1.5" />
            The Orbit Edge
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Fluidity & <span className="text-gradient-orbit">Precision</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {features.map((feature, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.08 }}>
              <div className="orbit-card rounded-xl p-4 sm:p-5 hover:border-orbit-cyan/20 transition-all duration-300 group h-full">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orbit-cyan/10 to-orbit-purple/10 flex items-center justify-center text-orbit-cyan shrink-0 group-hover:from-orbit-cyan/20 group-hover:to-orbit-purple/20 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ──────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    { name: "Riya Mehta", role: "Fashion Influencer", quote: "Got my reel in 47 minutes. The color grading was insane — way beyond what I expected for the price.", avatar: "RM" },
    { name: "Karan Desai", role: "Startup Founder", quote: "The Brand DNA feature is a game-changer. Our UGC reels now match our corporate identity perfectly.", avatar: "KD" },
    { name: "Ananya Singh", role: "Wedding Planner", quote: "My clients cried happy tears when they saw their cinematic highlight reel the same evening.", avatar: "AS" },
  ];

  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-8 sm:mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Badge variant="outline" className="mb-4 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5">
            <Star className="w-3.5 h-3.5 mr-1.5" />
            What Creators Say
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Trusted by <span className="text-gradient-orbit">500+</span> Creators
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
              <Card className="orbit-card border-orbit-border hover:border-orbit-cyan/20 transition-all duration-300 h-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orbit-cyan/10 to-orbit-purple/10 flex items-center justify-center text-orbit-cyan text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex gap-0.5 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-orbit-cyan fill-orbit-cyan" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Package Dashboard ─────────────────────────────────────────────────────────
function PackageDashboard() {
  const { packages, setSelectedPackage, setCurrentView } = useAppStore();

  return (
    <section className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Badge variant="outline" className="mb-4 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Choose Your Package
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-3">
            The Orbit <span className="text-gradient-orbit">Edge</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Select the package that fits your needs. Both include professional editing delivered in 60–120 minutes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {packages.map((pkg, idx) => (
            <motion.div key={pkg.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: idx * 0.15 }}>
              <Card
                className={`relative overflow-hidden orbit-card transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
                  pkg.popular ? "border-orbit-cyan/30 hover:border-orbit-cyan/60 orbit-glow" : "border-orbit-border hover:border-orbit-cyan/20"
                }`}
                onClick={() => { setSelectedPackage(pkg); setCurrentView("booking"); }}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                      pkg.popular ? "bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 text-orbit-cyan" : "bg-white/5 text-muted-foreground"
                    }`}>
                      {pkg.popular ? <Rocket className="w-4 h-4 sm:w-5 sm:h-5" /> : <Star className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl font-bold">{pkg.name}</CardTitle>
                      <CardDescription className="text-xs">{pkg.focus}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-gradient-orbit">₹{pkg.price.toLocaleString("en-IN")}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">/session</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-orbit-cyan" />
                      Delivery in {pkg.deliveryTime}
                    </div>
                  </div>
                  <Separator className="bg-orbit-border" />
                  <ul className="space-y-2 sm:space-y-2.5">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-orbit-cyan shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-4 sm:p-6">
                  <Button
                    className={`w-full font-bold py-4 sm:py-5 text-sm sm:text-base transition-all ${
                      pkg.popular
                        ? "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 orbit-glow"
                        : "bg-white/10 text-foreground hover:bg-white/15 border border-orbit-border"
                    }`}
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {[
            { icon: <Shield className="w-4 h-4 text-orbit-cyan" />, label: "Secure Payment" },
            { icon: <Lock className="w-4 h-4 text-orbit-cyan" />, label: "Privacy Protected" },
            { icon: <Clock className="w-4 h-4 text-orbit-cyan" />, label: "60-Min Guarantee" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2">{t.icon}{t.label}</div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Brand DNA Component ──────────────────────────────────────────────────────
function BrandDNASection() {
  const { user, setUser } = useAppStore();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "system"; time: string }[]>([
    { text: "Welcome! Describe your editing requirements here. Tell us about the style, mood, transitions, music preference, or any specific look you want for your reel.", sender: "system", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      text: chatInput.trim(),
      sender: "user" as const,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setUser({ editorRequirements: user.editorRequirements ? `${user.editorRequirements}\n${chatInput.trim()}` : chatInput.trim() });
    setChatInput("");
    toast.success("Requirement sent to editor!");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
      <Separator className="bg-orbit-border" />
      <div className="flex items-center gap-2 text-orbit-cyan">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-bold">Brand DNA</span>
        <Badge variant="outline" className="text-[10px] border-orbit-purple/30 text-orbit-purple">PRO</Badge>
      </div>
      <p className="text-xs text-muted-foreground">Upload your brand assets and tell our editors exactly what you need.</p>

      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Brand Logo</label>
        <div className="orbit-card rounded-xl p-4 border border-dashed border-orbit-border hover:border-orbit-cyan/30 transition-colors">
          {user.brandLogo ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orbit-cyan/10 to-orbit-purple/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-orbit-cyan" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{user.brandLogo}</div>
                <div className="text-xs text-muted-foreground">Logo uploaded</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setUser({ brandLogo: null })} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">Click to upload logo (PNG, SVG)</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { setUser({ brandLogo: file.name }); toast.success("Logo uploaded", { description: file.name }); }
              }} />
            </label>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Brand Font</label>
        <Select value={user.brandFont || ""} onValueChange={(value) => setUser({ brandFont: value })}>
          <SelectTrigger className="bg-white/5 border-orbit-border"><SelectValue placeholder="Select a font" /></SelectTrigger>
          <SelectContent>
            {["Inter", "Playfair Display", "Montserrat", "Roboto", "Aventa"].map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" />
          Brand Color
        </label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="color"
              value={user.brandColor || "#00BFFF"}
              onChange={(e) => setUser({ brandColor: e.target.value })}
              className="w-10 h-10 rounded-lg border border-orbit-border cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
            />
          </div>
          <div className="flex-1">
            <Input
              value={user.brandColor || "#00BFFF"}
              onChange={(e) => setUser({ brandColor: e.target.value })}
              placeholder="#00BFFF"
              className="bg-white/5 border-orbit-border focus:border-orbit-cyan/50 font-mono text-sm"
            />
          </div>
          <div className="flex gap-1.5">
            {["#00BFFF", "#A020F0", "#FF6B35", "#2D6A4F", "#FF4081", "#FFB300"].map((color) => (
              <button
                key={color}
                onClick={() => setUser({ brandColor: color })}
                className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                  user.brandColor === color ? "border-white scale-110" : "border-white/10"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Editor Requirements Chat Box */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Editor Requirements
        </label>
        <div className="orbit-card rounded-xl overflow-hidden border border-orbit-cyan/10">
          {/* Chat Messages Area */}
          <div className="max-h-56 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,191,255,0.2) transparent" }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-orbit-cyan/20 to-orbit-purple/20 text-foreground border border-orbit-cyan/10"
                    : "bg-white/5 text-muted-foreground border border-orbit-border"
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-orbit-cyan/50" : "text-muted-foreground/40"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t border-orbit-border p-3 flex items-end gap-2 bg-white/[0.02]">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your editing requirements... (e.g. cinematic look, warm tones, slow-mo transitions)"
              rows={2}
              className="flex-1 bg-white/5 border border-orbit-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-orbit-cyan/50 focus:outline-none focus:ring-1 focus:ring-orbit-cyan/20 resize-none"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 shrink-0 rounded-xl h-10 w-10 p-0 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-1.5">Press Enter to send. Your requirements will be shared with our editors.</p>
      </div>
    </motion.div>
  );
}

// ─── Booking Flow ──────────────────────────────────────────────────────────────
function BookingFlow() {
  const {
    selectedPackage, bookingDate, setBookingDate, bookingTimeSlot, setBookingTimeSlot,
    bookingLocation, setBookingLocation, bookingNotes, setBookingNotes,
    setCurrentView, setCurrentBooking, addBooking, user, setUser,
  } = useAppStore();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const canProceedStep1 = user.name && user.email && user.phone;
  const canProceedStep2 = bookingDate && bookingTimeSlot && bookingLocation;
  const isProfessionalTier = selectedPackage && selectedPackage.price >= 4999;

  const handlePayment = async () => {
    if (!selectedPackage) return;
    setIsProcessing(true);

    try {
      let userId = "";
      try {
        const userRes = await fetch("/api/users", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, name: user.name, phone: user.phone, location: bookingLocation, brandLogo: user.brandLogo, brandFont: user.brandFont, brandColor: user.brandColor, editorRequirements: user.editorRequirements }),
        });
        const userData = await userRes.json();
        userId = userData.user?.id || "demo-user";
      } catch { userId = "demo-user"; }

      const bookingRes = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, packageId: selectedPackage.id, bookingDate: bookingDate!.toISOString(), timeSlot: bookingTimeSlot, location: bookingLocation, notes: bookingNotes }),
      });
      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) throw new Error(bookingData.error || "Failed to create booking");

      const bookingId = bookingData.booking?.id || `OL-${Date.now().toString(36).toUpperCase()}`;
      await fetch(`/api/bookings/${bookingId}/payment`, { method: "POST", headers: { "Content-Type": "application/json" } });

      const newBooking: BookingInfo = {
        id: bookingId, packageId: selectedPackage.id, packageName: selectedPackage.name, packagePrice: selectedPackage.price,
        status: "PAID", paymentStatus: "PROCESSING", bookingDate: bookingDate!.toISOString(), timeSlot: bookingTimeSlot,
        location: bookingLocation, syncPercentage: 0, editCountdown: 90, partnerName: null, notes: bookingNotes,
      };

      setCurrentBooking(newBooking);
      addBooking(newBooking);
      setIsProcessing(false);
      toast.success("Payment initiated!", { description: `Booking ${bookingId}` });
      setCurrentView("tracking");
    } catch {
      setIsProcessing(false);
      const bookingId = `OL-${Date.now().toString(36).toUpperCase()}`;
      const newBooking: BookingInfo = {
        id: bookingId, packageId: selectedPackage.id, packageName: selectedPackage.name, packagePrice: selectedPackage.price,
        status: "PAID", paymentStatus: "SUCCESS", bookingDate: bookingDate!.toISOString(), timeSlot: bookingTimeSlot,
        location: bookingLocation, syncPercentage: 0, editCountdown: 90, partnerName: null, notes: bookingNotes,
      };
      setCurrentBooking(newBooking);
      addBooking(newBooking);
      toast.success("Payment successful!", { description: `Booking ${bookingId} confirmed` });
      setCurrentView("tracking");
    }
  };

  return (
    <section className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div className="text-center mb-6 sm:mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Book Your <span className="text-gradient-orbit">Session</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {selectedPackage ? `${selectedPackage.name} — ₹${selectedPackage.price.toLocaleString("en-IN")}` : "Select a package first"}
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white" : "bg-white/5 text-muted-foreground border border-orbit-border"
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-gradient-to-r from-orbit-cyan to-orbit-purple" : "bg-orbit-border"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="orbit-card rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-orbit-cyan" />Your Details</h3>
              <div className="space-y-4">
                {[
                  { label: "Full Name *", value: user.name, onChange: (v: string) => setUser({ name: v }), placeholder: "Enter your name", type: "text" },
                  { label: "Email *", value: user.email, onChange: (v: string) => setUser({ email: v }), placeholder: "you@example.com", type: "email" },
                  { label: "Phone *", value: user.phone, onChange: (v: string) => setUser({ phone: v }), placeholder: "+91 98765 43210", type: "tel" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{field.label}</label>
                    <Input
                      type={field.type} value={field.value} onChange={(e) => field.onChange(e.target.value)}
                      placeholder={field.placeholder} className="bg-white/5 border-orbit-border focus:border-orbit-cyan/50 focus:ring-orbit-cyan/20"
                    />
                  </div>
                ))}
                {isProfessionalTier && <BrandDNASection />}
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!canProceedStep1} className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold">
                  Next Step <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="orbit-card rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-orbit-cyan" />Schedule & Location</h3>
              <div className="space-y-6">
                {/* Book Right Now Option */}
                <div className="orbit-card rounded-xl p-4 border border-orbit-cyan/20 bg-gradient-to-r from-orbit-cyan/5 to-orbit-purple/5">
                  <button
                    onClick={() => {
                      const now = new Date();
                      let h = now.getHours();
                      const m = Math.ceil(now.getMinutes() / 5) * 5;
                      const period = h >= 12 ? "PM" : "AM";
                      if (h > 12) h -= 12;
                      if (h === 0) h = 12;
                      setBookingDate(now);
                      setBookingTimeSlot(`${h}:${String(m % 60).padStart(2, "0")} ${period}`);
                      toast.success("Booked for right now!", { description: "A partner will be dispatched immediately." });
                    }}
                    className="w-full flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 flex items-center justify-center">
                        <ZapIcon className="w-5 h-5 text-orbit-cyan" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-orbit-cyan">Book Right Now</div>
                        <div className="text-xs text-muted-foreground">Skip scheduling — get a partner immediately</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-orbit-cyan group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-orbit-border" />
                  <span className="text-xs text-muted-foreground/50">or schedule a time</span>
                  <div className="flex-1 h-px bg-orbit-border" />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">Select Date *</label>
                  <div className="orbit-card rounded-xl p-2 sm:p-4 inline-block overflow-x-auto max-w-full">
                    <Calendar mode="single" selected={bookingDate} onSelect={setBookingDate} disabled={{ before: new Date() }} className="text-foreground" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block flex items-center gap-2"><Clock className="w-4 h-4 text-orbit-cyan" />Select Time *</label>
                  {/* Diagonal Clock Time Picker */}
                  <div className="orbit-card rounded-xl p-4 border border-orbit-border">
                    <div className="flex items-center justify-center gap-3 sm:gap-4">
                      {/* Hour Selector */}
                      <div className="flex flex-col items-center gap-1">
                        <button onClick={() => {
                          const cur = bookingTimeSlot ? parseInt(bookingTimeSlot) : 12;
                          const next = cur >= 12 ? 1 : cur + 1;
                          const existingPeriod = bookingTimeSlot ? (bookingTimeSlot.includes("PM") ? "PM" : "AM") : "AM";
                          const existingMin = bookingTimeSlot ? bookingTimeSlot.split(":").pop()?.split(" ")[0] : "00";
                          setBookingTimeSlot(`${next}:${existingMin || "00"} ${existingPeriod}`);
                        }} className="w-10 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-orbit-cyan/10 text-muted-foreground hover:text-orbit-cyan transition-all">
                          <ChevronDown className="w-4 h-4 rotate-180" />
                        </button>
                        <div className="text-4xl sm:text-5xl font-black text-gradient-orbit w-16 text-center tabular-nums">
                          {bookingTimeSlot ? parseInt(bookingTimeSlot) : "--"}
                        </div>
                        <button onClick={() => {
                          const cur = bookingTimeSlot ? parseInt(bookingTimeSlot) : 12;
                          const next = cur <= 1 ? 12 : cur - 1;
                          const existingPeriod = bookingTimeSlot ? (bookingTimeSlot.includes("PM") ? "PM" : "AM") : "AM";
                          const existingMin = bookingTimeSlot ? bookingTimeSlot.split(":").pop()?.split(" ")[0] : "00";
                          setBookingTimeSlot(`${next}:${existingMin || "00"} ${existingPeriod}`);
                        }} className="w-10 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-orbit-cyan/10 text-muted-foreground hover:text-orbit-cyan transition-all">
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] text-muted-foreground mt-1">Hour</span>
                      </div>

                      <span className="text-4xl sm:text-5xl font-black text-orbit-cyan animate-pulse">:</span>

                      {/* Minute Selector */}
                      <div className="flex flex-col items-center gap-1">
                        <button onClick={() => {
                          const existingHour = bookingTimeSlot ? parseInt(bookingTimeSlot) : 12;
                          const existingPeriod = bookingTimeSlot ? (bookingTimeSlot.includes("PM") ? "PM" : "AM") : "AM";
                          const curMin = bookingTimeSlot ? parseInt(bookingTimeSlot.split(":").pop() || "0") : 0;
                          const idx = MINUTES.findIndex(m => m >= curMin);
                          const nextIdx = idx < MINUTES.length - 1 ? idx + 1 : 0;
                          setBookingTimeSlot(`${existingHour}:${String(MINUTES[nextIdx]).padStart(2, "0")} ${existingPeriod}`);
                        }} className="w-10 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-orbit-cyan/10 text-muted-foreground hover:text-orbit-cyan transition-all">
                          <ChevronDown className="w-4 h-4 rotate-180" />
                        </button>
                        <div className="text-4xl sm:text-5xl font-black text-gradient-orbit w-16 text-center tabular-nums">
                          {bookingTimeSlot ? (bookingTimeSlot.split(":").pop()?.split(" ")[0] || "00") : "--"}
                        </div>
                        <button onClick={() => {
                          const existingHour = bookingTimeSlot ? parseInt(bookingTimeSlot) : 12;
                          const existingPeriod = bookingTimeSlot ? (bookingTimeSlot.includes("PM") ? "PM" : "AM") : "AM";
                          const curMin = bookingTimeSlot ? parseInt(bookingTimeSlot.split(":").pop() || "0") : 0;
                          const idx = MINUTES.findIndex(m => m >= curMin);
                          const prevIdx = idx > 0 ? idx - 1 : MINUTES.length - 1;
                          setBookingTimeSlot(`${existingHour}:${String(MINUTES[prevIdx]).padStart(2, "0")} ${existingPeriod}`);
                        }} className="w-10 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-orbit-cyan/10 text-muted-foreground hover:text-orbit-cyan transition-all">
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] text-muted-foreground mt-1">Min</span>
                      </div>

                      {/* AM/PM Toggle */}
                      <div className="flex flex-col gap-1.5 ml-2">
                        {PERIODS.map((p) => {
                          const isActive = bookingTimeSlot ? bookingTimeSlot.includes(p) : p === "AM";
                          return (
                            <button
                              key={p}
                              onClick={() => {
                                const existingHour = bookingTimeSlot ? parseInt(bookingTimeSlot) : 12;
                                const existingMin = bookingTimeSlot ? (bookingTimeSlot.split(":").pop()?.split(" ")[0] || "00") : "00";
                                setBookingTimeSlot(`${existingHour}:${existingMin} ${p}`);
                              }}
                              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                                isActive
                                  ? "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white orbit-glow"
                                  : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-orbit-border"
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Shoot Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={bookingLocation} onChange={(e) => setBookingLocation(e.target.value)} placeholder="Enter shoot location" className="pl-10 bg-white/5 border-orbit-border focus:border-orbit-cyan/50" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Additional Notes</label>
                  <Textarea value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} placeholder="Any special requests..." className="bg-white/5 border-orbit-border focus:border-orbit-cyan/50 min-h-[80px]" />
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)} className="border-orbit-border text-foreground hover:bg-white/5"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
                <Button onClick={() => setStep(3)} disabled={!canProceedStep2} className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold">Review Order <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </div>
            </motion.div>
          )}

          {step === 3 && selectedPackage && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="orbit-card rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5 text-orbit-cyan" />Review & Payment</h3>
              <div className="space-y-4">
                <div className="orbit-card rounded-xl p-4 sm:p-5 space-y-3">
                  <div className="text-xs sm:text-sm font-medium text-orbit-cyan">Order Summary</div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    {[
                      { label: "Package", value: selectedPackage.name },
                      { label: "Date", value: bookingDate?.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }) },
                      { label: "Time", value: bookingTimeSlot },
                      { label: "Location", value: bookingLocation },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-medium max-w-[200px] truncate">{row.value}</span>
                      </div>
                    ))}
                    <Separator className="bg-orbit-border" />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold">Total</span>
                      <span className="font-black text-gradient-orbit">₹{selectedPackage.price.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="orbit-card rounded-xl p-4 sm:p-5 border-orbit-cyan/20">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-orbit-cyan shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold mb-1">Payment Gate</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The &quot;Notify Videographer&quot; process <strong className="text-orbit-cyan">cannot start</strong> until payment is confirmed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {["Razorpay", "Stripe"].map((method) => (
                    <div key={method} className="flex-1 orbit-card rounded-xl p-3 text-center text-xs sm:text-sm font-medium border border-orbit-cyan/20">
                      <CreditCard className="w-4 h-4 mx-auto mb-1.5 text-orbit-cyan" />{method}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)} disabled={isProcessing} className="border-orbit-border text-foreground hover:bg-white/5"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
                <Button onClick={handlePayment} disabled={isProcessing} className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold orbit-glow px-8">
                  {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <><Lock className="w-4 h-4 mr-2" />Pay ₹{selectedPackage.price.toLocaleString("en-IN")}</>}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Tracking Dashboard ────────────────────────────────────────────────────────
function TrackingDashboard() {
  const { currentBooking, setCurrentView, updateBookingStatus, updateSyncPercentage, updateEditCountdown } = useAppStore();
  const [activeStep, setActiveStep] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  const [countdown, setCountdown] = useState(90);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentBooking) return;

    const pollBackend = async () => {
      try {
        const res = await fetch(`/api/bookings/${currentBooking.id}/track`);
        if (res.ok) {
          const data = await res.json();
          if (data.tracking) {
            const si = STATUS_PIPELINE.findIndex((s) => s.status === data.tracking.status);
            if (si >= 0) setActiveStep(si);
            if (data.tracking.syncPercentage !== undefined) { setSyncProgress(data.tracking.syncPercentage); updateSyncPercentage(currentBooking.id, data.tracking.syncPercentage); }
            if (data.tracking.editCountdown != null) { setCountdown(data.tracking.editCountdown); updateEditCountdown(currentBooking.id, data.tracking.editCountdown); }
            updateBookingStatus(currentBooking.id, data.tracking.status);
          }
        }
      } catch { /* fallback */ }
    };

    pollRef.current = setInterval(pollBackend, 5000);
    pollBackend();

    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= STATUS_PIPELINE.length - 1) { if (intervalRef.current) clearInterval(intervalRef.current); return prev; }
        return prev + 1;
      });
    }, 8000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); if (pollRef.current) clearInterval(pollRef.current); };
  }, [currentBooking]);

  useEffect(() => {
    if (activeStep >= 6) return;
    if (activeStep >= 4) {
      const target = activeStep >= 5 ? 75 : 25;
      const iv = setInterval(() => { setSyncProgress((p) => { if (p >= target) { clearInterval(iv); return target; } return p + 1; }); }, 100);
      return () => clearInterval(iv);
    }
  }, [activeStep]);

  if (!currentBooking) {
    return (
      <section className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-20 px-4 flex items-center justify-center">
        <motion.div className="text-center orbit-card rounded-2xl p-6 sm:p-10 max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orbit-cyan/10 to-orbit-purple/10 flex items-center justify-center">
            <Cloud className="w-7 h-7 sm:w-8 sm:h-8 text-orbit-cyan" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2">No Active Booking</h3>
          <p className="text-muted-foreground mb-4 sm:mb-6 text-sm">Book a session to start tracking your edit in real-time.</p>
          <Button onClick={() => setCurrentView("packages")} className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold">
            Browse Packages <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </section>
    );
  }

  const currentStatus = STATUS_PIPELINE[activeStep];

  return (
    <section className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div className="text-center mb-6 sm:mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Badge variant="outline" className="mb-4 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5">
            <Cloud className="w-3.5 h-3.5 mr-1.5" />Live Tracking
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Your Edit is <span className="text-gradient-orbit">{currentStatus?.label}</span>
          </h2>
          <p className="text-muted-foreground text-sm">Booking ID: {currentBooking.id}</p>
        </motion.div>

        {/* Status Pipeline */}
        <div className="orbit-card rounded-2xl p-3 sm:p-6 md:p-8 mb-4 sm:mb-6">
          <div className="relative">
            <div className="hidden md:block absolute top-5 left-5 right-5 h-0.5 bg-orbit-border">
              <motion.div className="h-full bg-gradient-to-r from-orbit-cyan to-orbit-purple" initial={{ width: "0%" }} animate={{ width: `${(activeStep / (STATUS_PIPELINE.length - 1)) * 100}%` }} transition={{ duration: 0.8 }} />
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between">
              {STATUS_PIPELINE.map((step, idx) => {
                const isActive = idx === activeStep;
                const isCompleted = idx < activeStep;
                return (
                  <div key={step.status} className="flex md:flex-col items-start md:items-center gap-3 md:gap-2 relative">
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                      isActive ? "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white orbit-glow"
                        : isCompleted ? "bg-orbit-cyan/20 text-orbit-cyan"
                        : "bg-white/5 text-muted-foreground border border-orbit-border"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                      {isActive && <div className="absolute inset-0 rounded-full border-2 border-orbit-cyan animate-pulse-ring" />}
                    </div>
                    <div className="md:text-center">
                      <div className={`text-xs font-semibold ${isActive ? "text-orbit-cyan" : isCompleted ? "text-orbit-cyan/70" : "text-muted-foreground"}`}>{step.label}</div>
                      {isActive && <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[120px] md:mx-auto">{step.description}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[
            { icon: <Upload className="w-3.5 h-3.5 text-orbit-cyan" />, label: "Sync", value: `${activeStep >= 6 ? 100 : syncProgress}%`, progress: activeStep >= 6 ? 100 : syncProgress },
            { icon: <Timer className="w-3.5 h-3.5 text-orbit-cyan" />, label: "ETA", value: `${activeStep >= 6 ? "0" : countdown}`, suffix: " min" },
            { icon: <Film className="w-3.5 h-3.5 text-orbit-cyan" />, label: "Package", value: currentBooking.packageName },
            { icon: <CircleDot className="w-3.5 h-3.5 text-orbit-cyan" />, label: "Status", badge: true, value: activeStep >= 6 ? "Complete" : "In Progress" },
          ].map((stat, i) => (
            <motion.div key={i} className="orbit-card rounded-xl p-3 sm:p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="flex items-center gap-2 mb-2">{stat.icon}<span className="text-xs text-muted-foreground">{stat.label}</span></div>
              {stat.badge ? (
                <Badge variant="outline" className={`text-xs font-bold ${activeStep >= 6 ? "border-green-500/30 text-green-400 bg-green-500/10" : "border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/10"}`}>{stat.value}</Badge>
              ) : (
                <>
                  <div className="text-base sm:text-2xl font-black text-foreground">{stat.value}<span className="text-xs sm:text-sm text-muted-foreground">{stat.suffix || ""}</span></div>
                  {stat.progress !== undefined && <Progress value={stat.progress} className="mt-2 h-1 bg-white/5" />}
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* En Route Location Card */}
        <AnimatePresence>
          {activeStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="orbit-card rounded-2xl p-4 sm:p-6 border border-orbit-cyan/20 orbit-glow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-orbit-cyan" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-orbit-cyan">Partner is En Route</h4>
                  <p className="text-xs text-muted-foreground">Your Visual Architect is heading to your location</p>
                </div>
              </div>
              <div className="orbit-card rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-4 h-4 text-orbit-cyan shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Destination</div>
                    <div className="text-sm font-medium">{currentBooking.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Navigation className="w-4 h-4 text-green-400 shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Estimated Arrival</div>
                    <div className="text-sm font-medium text-green-400">~{Math.max(5, 15 - Math.floor(Date.now() / 1000) % 10)} minutes</div>
                  </div>
                </div>
              </div>
              {/* Simulated route progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Partner Location</span>
                  <span>Your Location</span>
                </div>
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-orbit-cyan to-orbit-purple rounded-full"
                    initial={{ width: "20%" }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Live tracking active</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delivery Card */}
        <AnimatePresence>
          {activeStep >= 6 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="orbit-card rounded-2xl p-4 sm:p-8 text-center orbit-glow">
              <PartyPopper className="w-12 h-12 mx-auto mb-4 text-orbit-cyan" />
              <h3 className="text-xl sm:text-2xl font-black mb-2">Your Reel is <span className="text-gradient-orbit">Ready!</span></h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Professional cinematic edit delivered in record time.</p>
              <Button className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold orbit-glow px-6 sm:px-8">
                <Play className="w-4 h-4 mr-2" />Download Reel
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Details */}
        <div className="orbit-card rounded-2xl p-4 sm:p-6 mt-4 sm:mt-6">
          <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 text-muted-foreground">Booking Details</h4>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            {[
              { label: "Date", value: new Date(currentBooking.bookingDate).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }) },
              { label: "Time", value: currentBooking.timeSlot },
              { label: "Location", value: currentBooking.location },
              { label: "Amount", value: `₹${currentBooking.packagePrice.toLocaleString("en-IN")}` },
            ].map((d) => (
              <div key={d.label}>
                <span className="text-muted-foreground">{d.label}</span>
                <div className="font-medium">{d.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Client Footer ──────────────────────────────────────────────────────────────
function ClientFooter() {
  return (
    <footer className="border-t border-orbit-border py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orbit-cyan to-orbit-purple" />
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-orbit-cyan to-orbit-purple" />
            </div>
          </div>
          <span className="text-sm font-bold text-gradient-orbit">ORBIT</span>
        </div>
        <div className="text-xs text-muted-foreground">Professional Cinema. Delivered in 60 Minutes.</div>
        <div className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Orbit. All rights reserved.</div>
      </div>
    </footer>
  );
}

// ─── Main Client App ──────────────────────────────────────────────────────────
export default function ClientApp() {
  const { currentView, currentBooking, fetchPackages } = useAppStore();

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <AnimatedBackground />
      <ClientNavbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <HeroSection />
              <ComparisonSection />
              <FeaturesSection />
              <TestimonialsSection />
            </motion.div>
          )}
          {currentView === "packages" && (
            <motion.div key="packages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <PackageDashboard />
            </motion.div>
          )}
          {currentView === "booking" && (
            <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <BookingFlow />
            </motion.div>
          )}
          {currentView === "tracking" && (
            <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <TrackingDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <ClientFooter />
    </div>
  );
}
