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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

// ─── Navigation Component ─────────────────────────────────────────────────────
function Navbar() {
  const { currentView, setCurrentView, currentBooking } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { label: string; view: AppView; show: boolean }[] = [
    { label: "Home", view: "landing", show: true },
    { label: "Packages", view: "packages", show: true },
    { label: "Book Now", view: "booking", show: true },
    { label: "Track Order", view: "tracking", show: !!currentBooking },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setCurrentView("landing")}
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems
              .filter((n) => n.show)
              .map((item) => (
                <button
                  key={item.view}
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
            <div className="px-4 py-3 space-y-1">
              {navItems
                .filter((n) => n.show)
                .map((item) => (
                  <button
                    key={item.view}
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
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
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
    user,
    setUser,
  } = useAppStore();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const totalSteps = 3;

  const canProceedStep1 = user.name && user.email && user.phone;
  const canProceedStep2 = bookingDate && bookingTimeSlot && bookingLocation;
  const canProceedStep3 = selectedPackage;

  const handlePayment = async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
    setIsProcessing(false);

    toast.success("Payment successful! Partner dispatching...", {
      description: `Booking ${bookingId} confirmed`,
    });

    setCurrentView("tracking");
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
  const { currentBooking, setCurrentView } = useAppStore();
  const [activeStep, setActiveStep] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  const [countdown, setCountdown] = useState(90);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate tracking progression
  useEffect(() => {
    if (!currentBooking) return;

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
    };
  }, [currentBooking]);

  // Sync progress animation
  useEffect(() => {
    if (activeStep >= 5) {
      // DELIVERED step - use interval to avoid direct setState
      const syncTimeout = setTimeout(() => {
        setSyncProgress(() => 100);
      }, 0);
      return () => clearTimeout(syncTimeout);
    } else if (activeStep >= 3) {
      // SYNCING or EDITING step
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
      }, 60000); // Every minute
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
                const isPending = idx > activeStep;

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
          {/* Sync Percentage */}
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

          {/* Countdown */}
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

          {/* Package */}
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

          {/* Status */}
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
  const { currentView } = useAppStore();

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
              <WorkflowSection />
              <FeaturesSection />
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
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
