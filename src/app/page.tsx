"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
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
  Orbit,
  Video,
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
  HardDrive,
  Palette,
  Type,
  ImageIcon,
  Wifi,
  RefreshCw,
  History,
  LayoutDashboard,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAppStore, type AppView, type BookingInfo, type BookingStatus } from "@/lib/store";

// ─── Time Slot Data ───────────────────────────────────────────────────────────
const TIME_SLOTS = [
  { value: "09:00 AM", label: "9:00 AM", available: true },
  { value: "10:00 AM", label: "10:00 AM", available: true },
  { value: "11:00 AM", label: "11:00 AM", available: true },
  { value: "12:00 PM", label: "12:00 PM", available: true },
  { value: "02:00 PM", label: "2:00 PM", available: true },
  { value: "03:00 PM", label: "3:00 PM", available: false },
  { value: "04:00 PM", label: "4:00 PM", available: true },
  { value: "05:00 PM", label: "5:00 PM", available: true },
];

// ─── Status Pipeline ──────────────────────────────────────────────────────────
const STATUS_PIPELINE: { status: BookingStatus; label: string; icon: React.ReactNode; description: string }[] = [
  { status: "PAID", label: "Payment Confirmed", icon: <CreditCard className="w-5 h-5" />, description: "Payment verified. Dispatching partner..." },
  { status: "PARTNER_DISPATCHED", label: "Partner Dispatched", icon: <Users className="w-5 h-5" />, description: "Visual Architect en route to your location." },
  { status: "SHOOTING", label: "Shooting", icon: <Camera className="w-5 h-5" />, description: "Capturing your cinematic footage in real-time." },
  { status: "SYNCING", label: "Syncing", icon: <Upload className="w-5 h-5" />, description: "Raw footage streaming to the editing hub." },
  { status: "EDITING", label: "Editing", icon: <Film className="w-5 h-5" />, description: "Professional editors crafting your masterpiece." },
  { status: "DELIVERED", label: "Delivered", icon: <CheckCircle2 className="w-5 h-5" />, description: "Your cinematic reel is ready to download!" },
];

// ─── Brand Palette Presets ────────────────────────────────────────────────────
const BRAND_PALETTES = [
  { name: "Minimalist", colors: ["#FFFFFF", "#1A1A1A", "#CCFF00"] },
  { name: "Sunset", colors: ["#FF6B35", "#F7C59F", "#004E89"] },
  { name: "Ocean", colors: ["#0077B6", "#00B4D8", "#90E0EF"] },
  { name: "Forest", colors: ["#2D6A4F", "#95D5B2", "#D8F3DC"] },
  { name: "Royal", colors: ["#7B2CBF", "#C77DFF", "#E0AAFF"] },
  { name: "Warm", colors: ["#D4A373", "#FAEDCD", "#FEFAE0"] },
];

// ─── Shot List ────────────────────────────────────────────────────────────────
const SHOT_LIST = [
  { id: "shot-1", name: "Establishing Shot", description: "Wide angle of location/venue" },
  { id: "shot-2", name: "Subject Intro", description: "Introduction of the main subject" },
  { id: "shot-3", name: "Action Sequence", description: "Key moments and activity" },
  { id: "shot-4", name: "B-Roll", description: "Detail shots and cutaway footage" },
  { id: "shot-5", name: "Closing Shot", description: "Final frame and wrap-up" },
];

// ─── Mock Available Bookings for Partner ──────────────────────────────────────
const MOCK_AVAILABLE_BOOKINGS: BookingInfo[] = [
  {
    id: "OL-AVAIL001",
    packageId: "pkg-professional",
    packageName: "Professional (UGC)",
    packagePrice: 4999,
    status: "PAID",
    paymentStatus: "SUCCESS",
    bookingDate: new Date(Date.now() + 86400000).toISOString(),
    timeSlot: "10:00 AM",
    location: "Connaught Place, New Delhi",
    syncPercentage: 0,
    editCountdown: null,
    partnerName: null,
    notes: "Brand shoot for tech startup. Need corporate aesthetic.",
  },
  {
    id: "OL-AVAIL002",
    packageId: "pkg-personalized",
    packageName: "Personalized",
    packagePrice: 1999,
    status: "PAID",
    paymentStatus: "SUCCESS",
    bookingDate: new Date(Date.now() + 86400000).toISOString(),
    timeSlot: "02:00 PM",
    location: "Juhu Beach, Mumbai",
    syncPercentage: 0,
    editCountdown: null,
    partnerName: null,
    notes: "Pre-wedding candid reel. Golden hour preferred.",
  },
  {
    id: "OL-AVAIL003",
    packageId: "pkg-professional",
    packageName: "Professional (UGC)",
    packagePrice: 4999,
    status: "PAID",
    paymentStatus: "SUCCESS",
    bookingDate: new Date(Date.now() + 172800000).toISOString(),
    timeSlot: "11:00 AM",
    location: "Koramangala, Bangalore",
    syncPercentage: 0,
    editCountdown: null,
    partnerName: null,
    notes: "Product launch video. Brand assets will be shared.",
  },
];

// ─── Navigation Component ─────────────────────────────────────────────────────
function Navbar() {
  const { currentView, setCurrentView, currentBooking, userRole, setUserRole } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userNavItems: { label: string; view: AppView; show: boolean }[] = [
    { label: "Home", view: "landing", show: true },
    { label: "Packages", view: "packages", show: true },
    { label: "Book Now", view: "booking", show: true },
    { label: "Track Order", view: "tracking", show: !!currentBooking },
  ];

  const partnerNavItems: { label: string; view: AppView; show: boolean }[] = [
    { label: "Dashboard", view: "partner", show: true },
    { label: "Active Shoot", view: "partner", show: true },
    { label: "History", view: "partner", show: true },
  ];

  const navItems = userRole === "USER" ? userNavItems : partnerNavItems;

  const handleRoleSwitch = (role: "USER" | "PARTNER") => {
    setUserRole(role);
    if (role === "PARTNER") {
      setCurrentView("partner");
    } else {
      setCurrentView("landing");
    }
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setCurrentView(userRole === "PARTNER" ? "partner" : "landing")}
            className="flex items-center gap-2 group"
          >
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-2 border-cyber-lime opacity-60 group-hover:opacity-100 transition-opacity animate-orbit" />
              <div className="absolute inset-1.5 rounded-full bg-cyber-lime/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyber-lime" />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-gradient-lime">ORBIT</span>
              <span className="text-foreground ml-1">LOGIC</span>
            </span>
          </button>

          {/* Desktop Nav + Role Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Role Toggle */}
            <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-surface-border mr-2">
              <button
                onClick={() => handleRoleSwitch("USER")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                  userRole === "USER"
                    ? "bg-cyber-lime text-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Client
              </button>
              <button
                onClick={() => handleRoleSwitch("PARTNER")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                  userRole === "PARTNER"
                    ? "bg-cyber-lime text-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Partner
              </button>
            </div>

            {navItems
              .filter((n) => n.show)
              .map((item) => (
                <button
                  key={item.view + item.label}
                  onClick={() => setCurrentView(item.view)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentView === item.view
                      ? "bg-cyber-lime/10 text-cyber-lime"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </div>

          {/* Mobile Menu Toggle */}
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
            className="md:hidden glass-strong border-t border-surface-border"
          >
            <div className="px-4 py-3 space-y-3">
              {/* Role Toggle Mobile */}
              <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-surface-border">
                <button
                  onClick={() => handleRoleSwitch("USER")}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                    userRole === "USER"
                      ? "bg-cyber-lime text-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Client
                </button>
                <button
                  onClick={() => handleRoleSwitch("PARTNER")}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                    userRole === "PARTNER"
                      ? "bg-cyber-lime text-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Partner
                </button>
              </div>

              {navItems
                .filter((n) => n.show)
                .map((item) => (
                  <button
                    key={item.view + item.label}
                    onClick={() => {
                      setCurrentView(item.view);
                      setMobileOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      currentView === item.view
                        ? "bg-cyber-lime/10 text-cyber-lime"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const { setCurrentView } = useAppStore();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyber-lime/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyber-lime/3 blur-[100px]" />

        {/* Orbital Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[600px] h-[600px] border border-cyber-lime/5 rounded-full animate-orbit" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-[400px] h-[400px] border border-cyber-lime/8 rounded-full animate-orbit"
            style={{ animationDirection: "reverse", animationDuration: "15s" }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-[200px] h-[200px] border border-cyber-lime/10 rounded-full animate-orbit"
            style={{ animationDuration: "10s" }}
          />
        </div>

        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyber-lime/30 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Badge
            variant="outline"
            className="mb-6 border-cyber-lime/30 text-cyber-lime bg-cyber-lime/5 px-4 py-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Professional Cinema at On-Demand Speed
          </Badge>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          <span className="text-gradient-lime">Impact</span>
          <br />
          <span className="text-foreground">over Speed</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Desktop-grade professional edits delivered within{" "}
          <span className="text-cyber-lime font-semibold">60–120 minutes</span> of your
          shoot. Professional human editors at the speed of AI.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <Button
            size="lg"
            className="bg-cyber-lime text-black hover:bg-cyber-lime-dark font-bold px-8 py-6 text-base glow-lime"
            onClick={() => setCurrentView("packages")}
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-surface-border text-foreground hover:bg-white/5 px-8 py-6 text-base"
            onClick={() => setCurrentView("tracking")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Track Order
          </Button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { value: "60", unit: "min", label: "Avg Delivery" },
            { value: "4K", unit: "", label: "Quality" },
            { value: "500+", unit: "", label: "Projects" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-cyber-lime">
                {stat.value}
                <span className="text-sm text-cyber-lime/60">{stat.unit}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-cyber-lime/40" />
      </motion.div>
    </section>
  );
}

// ─── Package Dashboard ────────────────────────────────────────────────────────
function PackageDashboard() {
  const { packages, setSelectedPackage, setCurrentView } = useAppStore();

  const handleSelect = (pkg: (typeof packages)[0]) => {
    setSelectedPackage(pkg);
    setCurrentView("booking");
  };

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-4 border-cyber-lime/30 text-cyber-lime bg-cyber-lime/5"
          >
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Choose Your Package
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            Professional Edits,{" "}
            <span className="text-gradient-lime">On Demand</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Select the package that fits your needs. Both include professional
            editing delivered in 60–120 minutes.
          </p>
        </motion.div>

        {/* Package Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <Card
                className={`relative overflow-hidden glass transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
                  pkg.popular
                    ? "border-cyber-lime/30 hover:border-cyber-lime/60 glow-lime"
                    : "border-surface-border hover:border-cyber-lime/20"
                }`}
                onClick={() => handleSelect(pkg)}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-cyber-lime text-black text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        pkg.popular
                          ? "bg-cyber-lime/20 text-cyber-lime"
                          : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {pkg.popular ? (
                        <Rocket className="w-5 h-5" />
                      ) : (
                        <Star className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {pkg.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {pkg.focus}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-gradient-lime">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /session
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-cyber-lime" />
                      Delivery in {pkg.deliveryTime}
                    </div>
                  </div>

                  <Separator className="bg-surface-border" />

                  {/* Features */}
                  <ul className="space-y-2.5">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-cyber-lime shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full font-bold py-5 transition-all ${
                      pkg.popular
                        ? "bg-cyber-lime text-black hover:bg-cyber-lime-dark glow-lime"
                        : "bg-white/10 text-foreground hover:bg-white/15 border border-surface-border"
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

        {/* Trust Badges */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyber-lime" />
            Secure Payment
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyber-lime" />
            Privacy Protected
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyber-lime" />
            60-Min Guarantee
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Brand DNA Component ─────────────────────────────────────────────────────
function BrandDNASection() {
  const { user, setUser } = useAppStore();
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);

  const handlePaletteSelect = (palette: typeof BRAND_PALETTES[0]) => {
    setSelectedPalette(palette.name);
    setUser({ brandPalette: JSON.stringify(palette.colors) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      <Separator className="bg-surface-border" />
      <div className="flex items-center gap-2 text-cyber-lime">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-bold">Brand DNA</span>
        <Badge variant="outline" className="text-[10px] border-cyber-lime/30 text-cyber-lime">
          PRO
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Upload your brand assets for logo, font, and palette matching in your reels.
      </p>

      {/* Brand Logo Upload */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
          Brand Logo
        </label>
        <div className="glass rounded-xl p-4 border border-dashed border-surface-border hover:border-cyber-lime/30 transition-colors">
          {user.brandLogo ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-cyber-lime/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-cyber-lime" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{user.brandLogo}</div>
                <div className="text-xs text-muted-foreground">Logo uploaded</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUser({ brandLogo: null })}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">
                Click to upload logo (PNG, SVG)
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUser({ brandLogo: file.name });
                    toast.success("Logo uploaded", { description: file.name });
                  }
                }}
              />
            </label>
          )}
        </div>
      </div>

      {/* Brand Font Selector */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
          Brand Font
        </label>
        <Select
          value={user.brandFont || ""}
          onValueChange={(value) => setUser({ brandFont: value })}
        >
          <SelectTrigger className="bg-white/5 border-surface-border focus:border-cyber-lime/50 focus:ring-cyber-lime/20">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inter">Inter</SelectItem>
            <SelectItem value="Playfair Display">Playfair Display</SelectItem>
            <SelectItem value="Montserrat">Montserrat</SelectItem>
            <SelectItem value="Roboto">Roboto</SelectItem>
            <SelectItem value="Custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Brand Palette */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
          Brand Palette
        </label>
        <div className="grid grid-cols-3 gap-2">
          {BRAND_PALETTES.map((palette) => (
            <button
              key={palette.name}
              onClick={() => handlePaletteSelect(palette)}
              className={`glass rounded-lg p-2.5 text-left transition-all ${
                selectedPalette === palette.name
                  ? "border-cyber-lime/50 bg-cyber-lime/5"
                  : "border-surface-border hover:border-cyber-lime/20"
              }`}
            >
              <div className="flex gap-1 mb-1.5">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border border-white/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="text-[10px] font-medium text-muted-foreground">
                {palette.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Booking Flow ─────────────────────────────────────────────────────────────
function BookingFlow() {
  const {
    selectedPackage,
    bookingDate,
    setBookingDate,
    bookingTimeSlot,
    setBookingTimeSlot,
    bookingLocation,
    setBookingLocation,
    bookingNotes,
    setBookingNotes,
    setCurrentView,
    setCurrentBooking,
    addBooking,
    user,
    setUser,
  } = useAppStore();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const canProceedStep1 = user.name && user.email && user.phone;
  const canProceedStep2 = bookingDate && bookingTimeSlot && bookingLocation;
  const canProceedStep3 = selectedPackage;
  const isProfessionalTier = selectedPackage && selectedPackage.price >= 4999;

  const handlePayment = async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);

    try {
      // Step 1: Create or find user
      let userId = "";
      try {
        const userRes = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            phone: user.phone,
            location: bookingLocation,
            brandLogo: user.brandLogo,
            brandFont: user.brandFont,
            brandPalette: user.brandPalette,
          }),
        });
        const userData = await userRes.json();
        userId = userData.user?.id || "demo-user";
      } catch {
        userId = "demo-user";
      }

      // Step 2: Create booking
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          packageId: selectedPackage.id,
          bookingDate: bookingDate!.toISOString(),
          timeSlot: bookingTimeSlot,
          location: bookingLocation,
          notes: bookingNotes,
        }),
      });
      const bookingData = await bookingRes.json();

      if (!bookingRes.ok) {
        throw new Error(bookingData.error || "Failed to create booking");
      }

      const bookingId = bookingData.booking?.id || `OL-${Date.now().toString(36).toUpperCase()}`;

      // Step 3: Process payment (triggers the status pipeline on the backend)
      const paymentRes = await fetch(`/api/bookings/${bookingId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(paymentData.error || "Payment failed");
      }

      const newBooking: BookingInfo = {
        id: bookingId,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price,
        status: "PAID",
        paymentStatus: "PROCESSING",
        bookingDate: bookingDate!.toISOString(),
        timeSlot: bookingTimeSlot,
        location: bookingLocation,
        syncPercentage: 0,
        editCountdown: 90,
        partnerName: null,
        notes: bookingNotes,
      };

      setCurrentBooking(newBooking);
      addBooking(newBooking);
      setIsProcessing(false);

      toast.success("Payment initiated! Processing...", {
        description: `Booking ${bookingId} — Partner will be dispatched shortly`,
      });

      setCurrentView("tracking");
    } catch (error) {
      setIsProcessing(false);
      // Fallback: simulate payment for demo purposes
      const bookingId = `OL-${Date.now().toString(36).toUpperCase()}`;
      const newBooking: BookingInfo = {
        id: bookingId,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price,
        status: "PAID",
        paymentStatus: "SUCCESS",
        bookingDate: bookingDate!.toISOString(),
        timeSlot: bookingTimeSlot,
        location: bookingLocation,
        syncPercentage: 0,
        editCountdown: 90,
        partnerName: null,
        notes: bookingNotes,
      };

      setCurrentBooking(newBooking);
      addBooking(newBooking);

      toast.success("Payment successful! Partner dispatching...", {
        description: `Booking ${bookingId} confirmed`,
      });

      setCurrentView("tracking");
    }
  };

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-black tracking-tight mb-2">
            Book Your <span className="text-gradient-lime">Session</span>
          </h2>
          <p className="text-muted-foreground">
            {selectedPackage
              ? `${selectedPackage.name} — ₹${selectedPackage.price.toLocaleString("en-IN")}`
              : "Select a package first"}
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s
                    ? "bg-cyber-lime text-black"
                    : "bg-white/5 text-muted-foreground border border-surface-border"
                }`}
              >
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-0.5 ${
                    step > s ? "bg-cyber-lime" : "bg-surface-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyber-lime" />
                Your Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Full Name *
                  </label>
                  <Input
                    value={user.name}
                    onChange={(e) => setUser({ name: e.target.value })}
                    placeholder="Enter your name"
                    className="bg-white/5 border-surface-border focus:border-cyber-lime/50 focus:ring-cyber-lime/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ email: e.target.value })}
                    placeholder="you@example.com"
                    className="bg-white/5 border-surface-border focus:border-cyber-lime/50 focus:ring-cyber-lime/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Phone *
                  </label>
                  <Input
                    type="tel"
                    value={user.phone}
                    onChange={(e) => setUser({ phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="bg-white/5 border-surface-border focus:border-cyber-lime/50 focus:ring-cyber-lime/20"
                  />
                </div>

                {/* Brand DNA Section - Only for Professional Tier */}
                {isProfessionalTier && <BrandDNASection />}
              </div>
              <div className="mt-8 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="bg-cyber-lime text-black hover:bg-cyber-lime-dark font-bold"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-cyber-lime" />
                Schedule & Location
              </h3>
              <div className="space-y-6">
                {/* Calendar */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Select Date *
                  </label>
                  <div className="glass rounded-xl p-4 inline-block">
                    <Calendar
                      mode="single"
                      selected={bookingDate}
                      onSelect={setBookingDate}
                      disabled={{ before: new Date() }}
                      className="text-foreground"
                    />
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Select Time Slot *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.value}
                        onClick={() =>
                          slot.available && setBookingTimeSlot(slot.value)
                        }
                        disabled={!slot.available}
                        className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          bookingTimeSlot === slot.value
                            ? "bg-cyber-lime text-black"
                            : slot.available
                            ? "bg-white/5 text-foreground hover:bg-white/10 border border-surface-border"
                            : "bg-white/3 text-muted-foreground/40 cursor-not-allowed line-through"
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Shoot Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={bookingLocation}
                      onChange={(e) => setBookingLocation(e.target.value)}
                      placeholder="Enter shoot location or address"
                      className="pl-10 bg-white/5 border-surface-border focus:border-cyber-lime/50 focus:ring-cyber-lime/20"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Additional Notes
                  </label>
                  <Textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Any special requests or instructions..."
                    className="bg-white/5 border-surface-border focus:border-cyber-lime/50 focus:ring-cyber-lime/20 min-h-[80px]"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-surface-border text-foreground hover:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="bg-cyber-lime text-black hover:bg-cyber-lime-dark font-bold"
                >
                  Review Order
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyber-lime" />
                Review & Payment
              </h3>

              {selectedPackage && (
                <div className="space-y-4">
                  {/* Order Summary */}
                  <div className="glass rounded-xl p-5 space-y-3">
                    <div className="text-sm font-medium text-cyber-lime">
                      Order Summary
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Package</span>
                        <span className="font-medium">
                          {selectedPackage.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">
                          {bookingDate?.toLocaleDateString("en-IN", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{bookingTimeSlot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium max-w-[200px] truncate">
                          {bookingLocation}
                        </span>
                      </div>
                      {/* Brand DNA Summary */}
                      {isProfessionalTier && (user.brandLogo || user.brandFont || user.brandPalette) && (
                        <>
                          <Separator className="bg-surface-border" />
                          <div className="text-xs font-medium text-cyber-lime mb-1">Brand DNA</div>
                          {user.brandLogo && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Logo</span>
                              <span className="font-medium text-xs">{user.brandLogo}</span>
                            </div>
                          )}
                          {user.brandFont && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Font</span>
                              <span className="font-medium text-xs">{user.brandFont}</span>
                            </div>
                          )}
                          {user.brandPalette && (
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Palette</span>
                              <div className="flex gap-1">
                                {JSON.parse(user.brandPalette).map((color: string, i: number) => (
                                  <div
                                    key={i}
                                    className="w-4 h-4 rounded-full border border-white/10"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <Separator className="bg-surface-border" />
                      <div className="flex justify-between text-base">
                        <span className="font-semibold">Total</span>
                        <span className="font-black text-cyber-lime">
                          ₹{selectedPackage.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Gate Notice */}
                  <div className="glass rounded-xl p-5 border-cyber-lime/20">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-cyber-lime shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold mb-1">
                          Payment Gate
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          The &quot;Notify Videographer&quot; process{" "}
                          <strong className="text-cyber-lime">
                            cannot start
                          </strong>{" "}
                          until payment is confirmed. This ensures our Visual
                          Architects are only dispatched for verified bookings.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods (Visual) */}
                  <div className="flex gap-3">
                    {["Razorpay", "Stripe"].map((method) => (
                      <div
                        key={method}
                        className="flex-1 glass rounded-xl p-3 text-center text-sm font-medium border border-cyber-lime/20"
                      >
                        <CreditCard className="w-4 h-4 mx-auto mb-1.5 text-cyber-lime" />
                        {method}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={isProcessing}
                  className="border-surface-border text-foreground hover:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !canProceedStep3}
                  className="bg-cyber-lime text-black hover:bg-cyber-lime-dark font-bold glow-lime px-8"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay ₹{selectedPackage?.price.toLocaleString("en-IN")}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Tracking Dashboard ───────────────────────────────────────────────────────
function TrackingDashboard() {
  const { currentBooking, setCurrentView, updateBookingStatus, updateSyncPercentage, updateEditCountdown } = useAppStore();
  const [activeStep, setActiveStep] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  const [countdown, setCountdown] = useState(90);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate tracking progression
  useEffect(() => {
    if (!currentBooking) return;

    // Try polling the backend for real tracking data
    const pollBackend = async () => {
      try {
        const res = await fetch(`/api/bookings/${currentBooking.id}/track`);
        if (res.ok) {
          const data = await res.json();
          if (data.tracking) {
            const statusIndex = STATUS_PIPELINE.findIndex(s => s.status === data.tracking.status);
            if (statusIndex >= 0) {
              setActiveStep(statusIndex);
            }
            if (data.tracking.syncPercentage !== undefined) {
              setSyncProgress(data.tracking.syncPercentage);
              updateSyncPercentage(currentBooking.id, data.tracking.syncPercentage);
            }
            if (data.tracking.editCountdown !== undefined && data.tracking.editCountdown !== null) {
              setCountdown(data.tracking.editCountdown);
              updateEditCountdown(currentBooking.id, data.tracking.editCountdown);
            }
            updateBookingStatus(currentBooking.id, data.tracking.status);
          }
        }
      } catch {
        // Fallback: use client-side simulation
      }
    };

    // Poll every 5 seconds
    pollRef.current = setInterval(pollBackend, 5000);
    pollBackend(); // Initial poll

    // Client-side simulation as fallback
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= STATUS_PIPELINE.length - 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 8000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [currentBooking]);

  // Sync progress animation
  useEffect(() => {
    if (activeStep >= 5) {
      const syncTimeout = setTimeout(() => {
        setSyncProgress(() => 100);
      }, 0);
      return () => clearTimeout(syncTimeout);
    } else if (activeStep >= 3) {
      const targetProgress = activeStep >= 4 ? 75 : 25;
      const syncInterval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= targetProgress) {
            clearInterval(syncInterval);
            return targetProgress;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(syncInterval);
    }
  }, [activeStep]);

  // Countdown
  useEffect(() => {
    if (activeStep >= 2) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 0) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 60000);
      return () => clearInterval(countdownInterval);
    }
  }, [activeStep]);

  if (!currentBooking) {
    return (
      <section className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <motion.div
          className="text-center glass rounded-2xl p-10 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Orbit className="w-8 h-8 text-cyber-lime" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Active Booking</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Book a session to start tracking your cinematic edit in real-time.
          </p>
          <Button
            onClick={() => setCurrentView("packages")}
            className="bg-cyber-lime text-black hover:bg-cyber-lime-dark font-bold"
          >
            Browse Packages
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </section>
    );
  }

  const currentStatus = STATUS_PIPELINE[activeStep];

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge
            variant="outline"
            className="mb-4 border-cyber-lime/30 text-cyber-lime bg-cyber-lime/5"
          >
            <Orbit className="w-3.5 h-3.5 mr-1.5" />
            Live Tracking
          </Badge>
          <h2 className="text-3xl font-black tracking-tight mb-2">
            Your Edit is{" "}
            <span className="text-gradient-lime">{currentStatus?.label}</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            Booking ID: {currentBooking.id}
          </p>
        </motion.div>

        {/* Status Pipeline */}
        <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
          <div className="relative">
            {/* Pipeline Line */}
            <div className="hidden md:block absolute top-5 left-5 right-5 h-0.5 bg-surface-border">
              <motion.div
                className="h-full bg-cyber-lime"
                initial={{ width: "0%" }}
                animate={{
                  width: `${(activeStep / (STATUS_PIPELINE.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </div>

            {/* Steps */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between">
              {STATUS_PIPELINE.map((step, idx) => {
                const isActive = idx === activeStep;
                const isCompleted = idx < activeStep;

                return (
                  <div
                    key={step.status}
                    className="flex md:flex-col items-start md:items-center gap-3 md:gap-2 relative"
                  >
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                        isActive
                          ? "bg-cyber-lime text-black glow-lime"
                          : isCompleted
                          ? "bg-cyber-lime/20 text-cyber-lime"
                          : "bg-white/5 text-muted-foreground border border-surface-border"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        step.icon
                      )}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full border-2 border-cyber-lime animate-pulse-ring" />
                      )}
                    </div>
                    <div className="md:text-center">
                      <div
                        className={`text-xs font-semibold ${
                          isActive
                            ? "text-cyber-lime"
                            : isCompleted
                            ? "text-cyber-lime/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </div>
                      {isActive && (
                        <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[120px] md:mx-auto">
                          {step.description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            className="glass rounded-xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-3.5 h-3.5 text-cyber-lime" />
              <span className="text-xs text-muted-foreground">Sync</span>
            </div>
            <div className="text-2xl font-black text-cyber-lime">
              {activeStep >= 5 ? 100 : syncProgress}%
            </div>
            <Progress
              value={activeStep >= 5 ? 100 : syncProgress}
              className="mt-2 h-1 bg-white/5"
            />
          </motion.div>

          <motion.div
            className="glass rounded-xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-3.5 h-3.5 text-cyber-lime" />
              <span className="text-xs text-muted-foreground">ETA</span>
            </div>
            <div className="text-2xl font-black text-foreground">
              {activeStep >= 5 ? "0" : countdown}
              <span className="text-sm text-muted-foreground"> min</span>
            </div>
          </motion.div>

          <motion.div
            className="glass rounded-xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Film className="w-3.5 h-3.5 text-cyber-lime" />
              <span className="text-xs text-muted-foreground">Package</span>
            </div>
            <div className="text-sm font-bold text-foreground truncate">
              {currentBooking.packageName}
            </div>
          </motion.div>

          <motion.div
            className="glass rounded-xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <CircleDot className="w-3.5 h-3.5 text-cyber-lime" />
              <span className="text-xs text-muted-foreground">Status</span>
            </div>
            <Badge
              variant="outline"
              className={`text-xs font-bold ${
                activeStep >= 5
                  ? "border-green-500/30 text-green-400 bg-green-500/10"
                  : "border-cyber-lime/30 text-cyber-lime bg-cyber-lime/10"
              }`}
            >
              {activeStep >= 5 ? "Complete" : "In Progress"}
            </Badge>
          </motion.div>
        </div>

        {/* Delivery Card */}
        <AnimatePresence>
          {activeStep >= 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 text-center glow-lime"
            >
              <PartyPopper className="w-12 h-12 mx-auto mb-4 text-cyber-lime" />
              <h3 className="text-2xl font-black mb-2">
                Your Reel is <span className="text-gradient-lime">Ready!</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                Professional cinematic edit delivered in record time.
              </p>
              <Button className="bg-cyber-lime text-black hover:bg-cyber-lime-dark font-bold glow-lime px-8">
                <Play className="w-4 h-4 mr-2" />
                Download Reel
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Details */}
        <div className="glass rounded-2xl p-6 mt-6">
          <h4 className="text-sm font-semibold mb-4 text-muted-foreground">
            Booking Details
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Date</span>
              <div className="font-medium">
                {new Date(currentBooking.bookingDate).toLocaleDateString(
                  "en-IN",
                  { weekday: "short", month: "short", day: "numeric" }
                )}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Time</span>
              <div className="font-medium">{currentBooking.timeSlot}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Location</span>
              <div className="font-medium">{currentBooking.location}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Amount</span>
              <div className="font-medium text-cyber-lime">
                ₹{currentBooking.packagePrice.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Partner Dashboard ────────────────────────────────────────────────────────
function PartnerDashboard() {
  const { partnerActiveBooking, setPartnerActiveBooking } = useAppStore();
  const [partnerPhase, setPartnerPhase] = useState<"available" | "shooting" | "syncing" | "privacy">("available");
  const [completedShots, setCompletedShots] = useState<Set<string>>(new Set());
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncSpeed, setSyncSpeed] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Partner stats
  const [partnerStats, setPartnerStats] = useState({
    completedProjects: 47,
    rating: 4.9,
    earnings: 84500,
  });

  // Simulated file names for sync
  const syncFiles = [
    "clip_001_4k.mov",
    "clip_002_4k.mov",
    "clip_003_4k.mov",
    "clip_004_4k.mov",
    "clip_005_4k.mov",
    "clip_006_4k.mov",
    "clip_007_4k.mov",
  ];

  const handleAcceptBooking = (booking: BookingInfo) => {
    setPartnerActiveBooking(booking);
    setPartnerPhase("shooting");
    setCompletedShots(new Set());
    toast.success("Booking accepted!", {
      description: `Heading to ${booking.location}`,
    });
  };

  const handleStartShooting = () => {
    toast.success("Orbit Capture Module activated", {
      description: "Recording in 4K at 60fps",
    });
  };

  const handleShotCheck = (shotId: string) => {
    setCompletedShots((prev) => {
      const next = new Set(prev);
      if (next.has(shotId)) {
        next.delete(shotId);
      } else {
        next.add(shotId);
      }
      return next;
    });
  };

  const handleCompleteShooting = () => {
    setPartnerPhase("syncing");
    setSyncProgress(0);
    setCurrentFile(syncFiles[0]);
    setSyncSpeed(42);

    // Simulate sync progress
    let fileIdx = 0;
    syncIntervalRef.current = setInterval(() => {
      setSyncProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
          setTimeout(() => {
            setPartnerPhase("privacy");
          }, 500);
          return 100;
        }

        // Update file name based on progress
        const newFileIdx = Math.min(Math.floor((next / 100) * syncFiles.length), syncFiles.length - 1);
        if (newFileIdx !== fileIdx) {
          fileIdx = newFileIdx;
          setCurrentFile(syncFiles[newFileIdx]);
        }

        // Vary speed
        setSyncSpeed(Math.floor(35 + Math.random() * 20));

        return next;
      });
    }, 150);
  };

  const handleCompleteAndReturn = () => {
    setPartnerPhase("available");
    setPartnerActiveBooking(null);
    setCompletedShots(new Set());
    setSyncProgress(0);
    setPartnerStats((prev) => ({ ...prev, completedProjects: prev.completedProjects + 1 }));
    toast.success("Project completed successfully!", {
      description: "Returning to dashboard",
    });
  };

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Partner Stats Bar */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-cyber-lime" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="text-2xl font-black text-cyber-lime">
              {partnerStats.completedProjects}
            </div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-4 h-4 text-cyber-lime" />
              <span className="text-xs text-muted-foreground">Rating</span>
            </div>
            <div className="text-2xl font-black text-cyber-lime">
              {partnerStats.rating}
            </div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-cyber-lime" />
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <div className="text-2xl font-black text-cyber-lime">
              ₹{(partnerStats.earnings).toLocaleString("en-IN")}
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Badge
            variant="outline"
            className="mb-4 border-cyber-lime/30 text-cyber-lime bg-cyber-lime/5"
          >
            <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
            Partner Dashboard
          </Badge>
          <h2 className="text-3xl font-black tracking-tight mb-2">
            Visual <span className="text-gradient-lime">Architect</span> Hub
          </h2>
          <p className="text-muted-foreground text-sm">
            {partnerPhase === "available"
              ? "Accept bookings and start capturing cinematic footage"
              : partnerPhase === "shooting"
              ? "Active shoot in progress"
              : partnerPhase === "syncing"
              ? "Uploading footage to cloud"
              : "Privacy verification complete"}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ─── Available Bookings Panel ─── */}
          {partnerPhase === "available" && !partnerActiveBooking && (
            <motion.div
              key="available"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyber-lime" />
                  Available Bookings
                  <Badge variant="outline" className="ml-2 border-cyber-lime/30 text-cyber-lime text-xs">
                    {MOCK_AVAILABLE_BOOKINGS.length} new
                  </Badge>
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {MOCK_AVAILABLE_BOOKINGS.map((booking, idx) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass rounded-xl p-4 border border-surface-border hover:border-cyber-lime/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">{booking.id}</span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                booking.packagePrice >= 4999
                                  ? "border-cyber-lime/30 text-cyber-lime"
                                  : "border-surface-border text-muted-foreground"
                              }`}
                            >
                              {booking.packageName}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <CalendarIcon className="w-3 h-3 text-cyber-lime" />
                              {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-cyber-lime" />
                              {booking.timeSlot}
                            </div>
                            <div className="flex items-center gap-1.5 col-span-2">
                              <MapPin className="w-3 h-3 text-cyber-lime" />
                              {booking.location}
                            </div>
                          </div>
                          {booking.notes && (
                            <p className="text-xs text-muted-foreground/60 italic">
                              &ldquo;{booking.notes}&rdquo;
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleAcceptBooking(booking)}
                          className="bg-cyber-lime text-black hover:bg-cyber-lime-dark font-bold whitespace-nowrap glow-lime"
                        >
                          Accept Booking
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Active Shoot Panel ─── */}
          {partnerPhase === "shooting" && partnerActiveBooking && (
            <motion.div
              key="shooting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Camera className="w-5 h-5 text-cyber-lime" />
                    Active Shoot
                  </h3>
                  <Badge
                    variant="outline"
                    className="border-cyber-lime/30 text-cyber-lime bg-cyber-lime/10"
                  >
                    {partnerActiveBooking.id}
                  </Badge>
                </div>

                {/* Booking Info */}
                <div className="glass rounded-xl p-4 mb-6 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Location</span>
                    <div className="font-medium">{partnerActiveBooking.location}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Package</span>
                    <div className="font-medium">{partnerActiveBooking.packageName}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Time</span>
                    <div className="font-medium">{partnerActiveBooking.timeSlot}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Notes</span>
                    <div className="font-medium text-xs">{partnerActiveBooking.notes || "None"}</div>
                  </div>
                </div>

                {/* Orbit Capture Module */}
                <div className="glass rounded-xl p-5 mb-6 border border-cyber-lime/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                      <div className="absolute inset-0 w-4 h-4 rounded-full bg-red-500 animate-ping opacity-30" />
                    </div>
                    <span className="text-sm font-bold text-red-400">REC</span>
                    <span className="text-xs text-muted-foreground">Orbit Capture Module — 4K 60fps</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <HardDrive className="w-3 h-3 text-cyber-lime" />
                    <span>Storage: 24.8 GB available</span>
                    <span className="text-surface-border">|</span>
                    <Wifi className="w-3 h-3 text-cyber-lime" />
                    <span>Cloud: Connected</span>
                  </div>
                </div>

                {/* Shot List */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground">Shot List</h4>
                  {SHOT_LIST.map((shot, idx) => (
                    <motion.div
                      key={shot.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className={`flex items-center gap-3 glass rounded-lg p-3 transition-all ${
                        completedShots.has(shot.id)
                          ? "border-cyber-lime/30 bg-cyber-lime/5"
                          : "border-surface-border"
                      }`}
                    >
                      <Checkbox
                        id={shot.id}
                        checked={completedShots.has(shot.id)}
                        onCheckedChange={() => handleShotCheck(shot.id)}
                        className="border-cyber-lime/50 data-[state=checked]:bg-cyber-lime data-[state=checked]:text-black"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={shot.id}
                          className={`text-sm font-medium cursor-pointer ${
                            completedShots.has(shot.id)
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {shot.name}
                        </label>
                        <p className="text-xs text-muted-foreground">{shot.description}</p>
                      </div>
                      {completedShots.has(shot.id) && (
                        <CheckCircle2 className="w-4 h-4 text-cyber-lime" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleStartShooting}
                    variant="outline"
                    className="flex-1 border-cyber-lime/30 text-cyber-lime hover:bg-cyber-lime/10 font-bold"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Shooting
                  </Button>
                  <Button
                    onClick={handleCompleteShooting}
                    disabled={completedShots.size < SHOT_LIST.length}
                    className="flex-1 bg-cyber-lime text-black hover:bg-cyber-lime-dark font-bold glow-lime"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Complete & Sync ({completedShots.size}/{SHOT_LIST.length})
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Orbit Sync Module ─── */}
          {partnerPhase === "syncing" && (
            <motion.div
              key="syncing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-cyber-lime" />
                  Orbit Sync Module
                </h3>

                {/* Sync Progress */}
                <div className="glass rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Uploading to Open Cloud Server</span>
                    <span className="text-lg font-black text-cyber-lime">{syncProgress}%</span>
                  </div>
                  <Progress
                    value={syncProgress}
                    className="h-3 bg-white/5 mb-4"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Film className="w-3 h-3 text-cyber-lime" />
                      <span>{currentFile}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-cyber-lime" />
                      <span>{syncSpeed} MB/s</span>
                    </div>
                  </div>
                </div>

                {/* File List */}
                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">Upload Queue</h4>
                  {syncFiles.map((file, idx) => {
                    const fileProgress = Math.min(
                      100,
                      Math.max(0, Math.floor(((syncProgress - (idx * (100 / syncFiles.length))) / (100 / syncFiles.length)) * 100))
                    );
                    const isDone = syncProgress > ((idx + 1) / syncFiles.length) * 100;
                    const isActive = !isDone && syncProgress > (idx / syncFiles.length) * 100;

                    return (
                      <div
                        key={file}
                        className={`flex items-center gap-3 glass rounded-lg p-3 text-xs ${
                          isDone
                            ? "border-cyber-lime/20"
                            : isActive
                            ? "border-cyber-lime/40 bg-cyber-lime/5"
                            : "border-surface-border"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-cyber-lime shrink-0" />
                        ) : isActive ? (
                          <Loader2 className="w-4 h-4 text-cyber-lime shrink-0 animate-spin" />
                        ) : (
                          <Film className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                        <span className={isDone ? "text-muted-foreground line-through" : "text-foreground"}>
                          {file}
                        </span>
                        {isActive && (
                          <span className="ml-auto text-cyber-lime font-medium">{fileProgress}%</span>
                        )}
                        {isDone && (
                          <span className="ml-auto text-cyber-lime/60">Done</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <Loader2 className="w-3 h-3 animate-spin text-cyber-lime" />
                  <span>Syncing in progress... Please wait</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Privacy Shield ─── */}
          {partnerPhase === "privacy" && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="glass rounded-2xl p-8 sm:p-10 text-center glow-lime">
                {/* Animated Shield Icon */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Shield className="w-10 h-10 text-green-400" />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-2xl font-black mb-3">
                    <span className="text-green-400">Privacy Shield</span> Activated
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-green-400">
                      100% Synced & Verified
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    All local footage has been securely wiped from your device.
                    The raw footage is now safely on the Open Cloud Server for
                    professional editing.
                  </p>

                  <div className="glass rounded-xl p-4 mb-8 max-w-sm mx-auto border border-green-500/20">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Files Synced</span>
                        <div className="font-bold text-foreground">{syncFiles.length}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Local Wipe</span>
                        <div className="font-bold text-green-400">Complete</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cloud Status</span>
                        <div className="font-bold text-green-400">Verified</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Encryption</span>
                        <div className="font-bold text-green-400">AES-256</div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCompleteAndReturn}
                    className="bg-cyber-lime text-black hover:bg-cyber-lime-dark font-bold glow-lime px-8"
                  >
                    Complete & Return to Dashboard
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Testimonials Section ─────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Riya Mehta",
      role: "Fashion Influencer",
      quote: "Got my reel in 47 minutes. The color grading was insane — way beyond what I expected for the price.",
      avatar: "RM",
    },
    {
      name: "Karan Desai",
      role: "Startup Founder",
      quote: "The Brand DNA feature is a game-changer. Our UGC reels now match our corporate identity perfectly.",
      avatar: "KD",
    },
    {
      name: "Ananya Singh",
      role: "Wedding Planner",
      quote: "My clients cried happy tears when they saw their cinematic highlight reel the same evening.",
      avatar: "AS",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-4 border-cyber-lime/30 text-cyber-lime bg-cyber-lime/5"
          >
            <Star className="w-3.5 h-3.5 mr-1.5" />
            What Creators Say
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Trusted by <span className="text-gradient-lime">500+</span> Creators
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="glass border-surface-border hover:border-cyber-lime/20 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-cyber-lime/10 flex items-center justify-center text-cyber-lime text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex gap-0.5 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-cyber-lime fill-cyber-lime" />
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

// ─── Comparison Section ───────────────────────────────────────────────────────
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
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-4 border-cyber-lime/30 text-cyber-lime bg-cyber-lime/5"
          >
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            The Content Gap
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Why <span className="text-gradient-lime">Orbit Logic</span> Wins
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
            We bridge the gap between cheap AI edits and expensive production houses.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 gap-0 text-sm">
              {/* Header Row */}
              <div className="p-4 border-b border-surface-border text-xs font-bold text-muted-foreground">
                Feature
              </div>
              <div className="p-4 border-b border-cyber-lime/20 bg-cyber-lime/5 text-center">
                <div className="text-xs font-black text-cyber-lime">ORBIT LOGIC</div>
              </div>
              <div className="p-4 border-b border-surface-border text-center">
                <div className="text-xs font-bold text-muted-foreground">Production House</div>
              </div>
              <div className="p-4 border-b border-surface-border text-center">
                <div className="text-xs font-bold text-muted-foreground">AI Tools</div>
              </div>

              {/* Data Rows */}
              {comparisons.map((row, idx) => (
                <>
                  <div
                    key={`f-${idx}`}
                    className={`p-3.5 text-xs font-medium text-muted-foreground ${
                      idx < comparisons.length - 1 ? "border-b border-surface-border" : ""
                    }`}
                  >
                    {row.feature}
                  </div>
                  <div
                    key={`o-${idx}`}
                    className={`p-3.5 text-center text-xs font-bold text-cyber-lime bg-cyber-lime/5 ${
                      idx < comparisons.length - 1 ? "border-b border-surface-border" : ""
                    }`}
                  >
                    {row.orbit}
                  </div>
                  <div
                    key={`t-${idx}`}
                    className={`p-3.5 text-center text-xs text-muted-foreground ${
                      idx < comparisons.length - 1 ? "border-b border-surface-border" : ""
                    }`}
                  >
                    {row.traditional}
                  </div>
                  <div
                    key={`a-${idx}`}
                    className={`p-3.5 text-center text-xs text-muted-foreground/60 ${
                      idx < comparisons.length - 1 ? "border-b border-surface-border" : ""
                    }`}
                  >
                    {row.ai}
                  </div>
                </>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Workflow Section (Landing) ───────────────────────────────────────────────
function WorkflowSection() {
  const steps = [
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Book & Pay",
      description: "Choose a package, pick a slot, and complete secure payment.",
      num: "01",
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Shoot",
      description: "A Visual Architect captures professional footage at your location.",
      num: "02",
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Cloud Sync",
      description: "4K footage streams directly to our editing hub in real-time.",
      num: "03",
    },
    {
      icon: <Film className="w-6 h-6" />,
      title: "Edit & Deliver",
      description: "Professional editors craft your reel within 60–120 minutes.",
      num: "04",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-4 border-cyber-lime/30 text-cyber-lime bg-cyber-lime/5"
          >
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            How It Works
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            The <span className="text-gradient-lime">Logic</span> Behind Orbit
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="glass border-surface-border hover:border-cyber-lime/20 transition-all duration-300 group h-full">
                <CardContent className="p-6">
                  <div className="text-3xl font-black text-cyber-lime/10 mb-3">
                    {step.num}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-cyber-lime/10 flex items-center justify-center text-cyber-lime mb-4 group-hover:bg-cyber-lime/20 transition-colors">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: <Timer className="w-5 h-5" />,
      title: "60-Min Delivery",
      description: "Professional edits faster than anyone in the market.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Privacy Shield",
      description: "Auto-wipe of local footage after cloud sync verification.",
    },
    {
      icon: <Video className="w-5 h-5" />,
      title: "4K Quality",
      description: "Raw footage captured on flagship devices, edited on desktop software.",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Brand DNA",
      description: "Logo, font, and palette matching for the Pro tier.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Human Editors",
      description: "Not AI — real professionals using Premiere Pro & DaVinci.",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Payment Gate",
      description: "Hard stop: partners only dispatched after payment success.",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-4 border-cyber-lime/30 text-cyber-lime bg-cyber-lime/5"
          >
            <Star className="w-3.5 h-3.5 mr-1.5" />
            Why Orbit Logic
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Built for <span className="text-gradient-lime">Impact</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <div className="glass rounded-xl p-5 hover:border-cyber-lime/20 transition-all duration-300 group h-full">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyber-lime/10 flex items-center justify-center text-cyber-lime shrink-0 group-hover:bg-cyber-lime/20 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
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

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-surface-border py-10 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 rounded-full border border-cyber-lime/40" />
              <div className="absolute inset-1 rounded-full bg-cyber-lime/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-lime" />
              </div>
            </div>
            <span className="text-sm font-bold">
              <span className="text-cyber-lime">ORBIT</span>
              <span className="text-foreground ml-1">LOGIC</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>Professional Cinema at On-Demand Speed</span>
          </div>

          {/* Copyright */}
          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Orbit Logic. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function OrbitLogicApp() {
  const { currentView, currentBooking, fetchPackages } = useAppStore();

  // Fetch packages from API on mount
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection />
              <ComparisonSection />
              <WorkflowSection />
              <FeaturesSection />
              <TestimonialsSection />
            </motion.div>
          )}
          {currentView === "packages" && (
            <motion.div
              key="packages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PackageDashboard />
            </motion.div>
          )}
          {currentView === "booking" && (
            <motion.div
              key="booking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BookingFlow />
            </motion.div>
          )}
          {currentView === "tracking" && (
            <motion.div
              key={`tracking-${currentBooking?.id || 'none'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TrackingDashboard />
            </motion.div>
          )}
          {currentView === "partner" && (
            <motion.div
              key="partner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PartnerDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
