"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Star,
  Camera,
  Upload,
  Film,
  CheckCircle2,
  ArrowRight,
  Play,
  Shield,
  Calendar as CalendarIcon,
  CreditCard,
  Loader2,
  MapPin,
  Cloud,
  HardDrive,
  Wifi,
  RefreshCw,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAppStore, type BookingInfo } from "@/lib/store";

// ─── Shot List ──────────────────────────────────────────────────────────────────
const SHOT_LIST = [
  { id: "shot-1", name: "Establishing Shot", description: "Wide angle of location/venue" },
  { id: "shot-2", name: "Subject Intro", description: "Introduction of the main subject" },
  { id: "shot-3", name: "Action Sequence", description: "Key moments and activity" },
  { id: "shot-4", name: "B-Roll", description: "Detail shots and cutaway footage" },
  { id: "shot-5", name: "Closing Shot", description: "Final frame and wrap-up" },
];

// ─── Mock Partner Bookings ─────────────────────────────────────────────────────
const MOCK_AVAILABLE_BOOKINGS: BookingInfo[] = [
  {
    id: "OL-AVAIL001", packageId: "pkg-professional", packageName: "Professional (UGC)",
    packagePrice: 4999, status: "PAID", paymentStatus: "SUCCESS",
    bookingDate: new Date(Date.now() + 86400000).toISOString(), timeSlot: "10:00 AM",
    location: "Connaught Place, New Delhi", syncPercentage: 0, editCountdown: null,
    partnerName: null, notes: "Brand shoot for tech startup. Need corporate aesthetic.",
  },
  {
    id: "OL-AVAIL002", packageId: "pkg-personalized", packageName: "Personalized",
    packagePrice: 1999, status: "PAID", paymentStatus: "SUCCESS",
    bookingDate: new Date(Date.now() + 86400000).toISOString(), timeSlot: "02:00 PM",
    location: "Juhu Beach, Mumbai", syncPercentage: 0, editCountdown: null,
    partnerName: null, notes: "Pre-wedding candid reel. Golden hour preferred.",
  },
  {
    id: "OL-AVAIL003", packageId: "pkg-professional", packageName: "Professional (UGC)",
    packagePrice: 4999, status: "PAID", paymentStatus: "SUCCESS",
    bookingDate: new Date(Date.now() + 172800000).toISOString(), timeSlot: "11:00 AM",
    location: "Koramangala, Bangalore", syncPercentage: 0, editCountdown: null,
    partnerName: null, notes: "Product launch video. Brand assets will be shared.",
  },
];

// ─── Partner Navbar ────────────────────────────────────────────────────────────
function PartnerNavbar() {
  const { logout } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 orbit-card-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Image
              src="/orbit-logo.png"
              alt="Orbit Logo"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className="text-lg font-bold tracking-tight text-gradient-orbit">ORBIT</span>
            <Badge variant="outline" className="hidden sm:inline-flex text-[10px] border-orbit-purple/30 text-orbit-purple ml-1">PARTNER</Badge>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Badge variant="outline" className="border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5 text-xs">
              <LayoutDashboard className="w-3 h-3 mr-1" /> Dashboard
            </Badge>
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
              <div className="px-4 py-2.5 flex items-center gap-2 text-orbit-cyan">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </div>
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

// ─── Partner Dashboard ─────────────────────────────────────────────────────────
function PartnerDashboard() {
  const { partnerActiveBooking, setPartnerActiveBooking } = useAppStore();
  const [partnerPhase, setPartnerPhase] = useState<"available" | "shooting" | "syncing" | "privacy">("available");
  const [completedShots, setCompletedShots] = useState<Set<string>>(new Set());
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncSpeed, setSyncSpeed] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [partnerStats, setPartnerStats] = useState({ completed: 47, rating: 4.9, earnings: 84500 });

  const syncFiles = ["clip_001_4k.mov", "clip_002_4k.mov", "clip_003_4k.mov", "clip_004_4k.mov", "clip_005_4k.mov"];

  const handleAcceptBooking = (booking: BookingInfo) => {
    setPartnerActiveBooking(booking);
    setPartnerPhase("shooting");
    setCompletedShots(new Set());
    toast.success("Booking accepted!", { description: `Heading to ${booking.location}` });
  };

  const handleCompleteShooting = () => {
    setPartnerPhase("syncing");
    setSyncProgress(0);
    setCurrentFile(syncFiles[0]);
    setSyncSpeed(42);
    let fileIdx = 0;
    syncIntervalRef.current = setInterval(() => {
      setSyncProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
          setTimeout(() => setPartnerPhase("privacy"), 500);
          return 100;
        }
        const newFileIdx = Math.min(Math.floor((next / 100) * syncFiles.length), syncFiles.length - 1);
        if (newFileIdx !== fileIdx) { fileIdx = newFileIdx; setCurrentFile(syncFiles[newFileIdx]); }
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
    setPartnerStats((prev) => ({ ...prev, completed: prev.completed + 1 }));
    toast.success("Project completed!");
  };

  return (
    <section className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Stats */}
        <motion.div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {[
            { icon: <CheckCircle2 className="w-4 h-4 text-orbit-cyan" />, label: "Completed", value: partnerStats.completed },
            { icon: <Star className="w-4 h-4 text-orbit-cyan" />, label: "Rating", value: partnerStats.rating },
            { icon: <CreditCard className="w-4 h-4 text-orbit-cyan" />, label: "This Month", value: `₹${partnerStats.earnings.toLocaleString("en-IN")}` },
          ].map((s, i) => (
            <div key={i} className="orbit-card rounded-xl p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">{s.icon}<span className="text-xs text-muted-foreground">{s.label}</span></div>
              <div className="text-xl sm:text-2xl font-black text-gradient-orbit">{s.value}</div>
            </div>
          ))}
        </motion.div>

        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Badge variant="outline" className="mb-4 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5">
            <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />Partner Dashboard
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Visual <span className="text-gradient-orbit">Architect</span> Hub</h2>
          <p className="text-muted-foreground text-sm">
            {partnerPhase === "available" ? "Accept bookings and start capturing" : partnerPhase === "shooting" ? "Active shoot in progress" : partnerPhase === "syncing" ? "Uploading footage" : "Privacy verification complete"}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Available Bookings */}
          {partnerPhase === "available" && !partnerActiveBooking && (
            <motion.div key="available" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="orbit-card rounded-2xl p-4 sm:p-6 md:p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-orbit-cyan" />Available Bookings
                  <Badge variant="outline" className="ml-2 border-orbit-cyan/30 text-orbit-cyan text-xs">{MOCK_AVAILABLE_BOOKINGS.length} new</Badge>
                </h3>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {MOCK_AVAILABLE_BOOKINGS.map((booking, idx) => (
                    <motion.div key={booking.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                      className="orbit-card rounded-xl p-4 border border-orbit-border hover:border-orbit-cyan/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-foreground">{booking.id}</span>
                            <Badge variant="outline" className={`text-[10px] ${booking.packagePrice >= 4999 ? "border-orbit-cyan/30 text-orbit-cyan" : "border-orbit-border text-muted-foreground"}`}>{booking.packageName}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5"><CalendarIcon className="w-3 h-3 text-orbit-cyan" />{new Date(booking.bookingDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</div>
                            <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-orbit-cyan" />{booking.timeSlot}</div>
                            <div className="flex items-center gap-1.5 col-span-2"><MapPin className="w-3 h-3 text-orbit-cyan" />{booking.location}</div>
                          </div>
                          {booking.notes && <p className="text-xs text-muted-foreground/60 italic">&ldquo;{booking.notes}&rdquo;</p>}
                        </div>
                        <Button onClick={() => handleAcceptBooking(booking)} className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold whitespace-nowrap orbit-glow">
                          Accept <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Shoot */}
          {partnerPhase === "shooting" && partnerActiveBooking && (
            <motion.div key="shooting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="orbit-card rounded-2xl p-4 sm:p-6 md:p-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                  <h3 className="text-lg font-bold flex items-center gap-2"><Camera className="w-5 h-5 text-orbit-cyan" />Active Shoot</h3>
                  <Badge variant="outline" className="border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/10 w-fit">{partnerActiveBooking.id}</Badge>
                </div>

                <div className="orbit-card rounded-xl p-4 mb-6 grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Location", value: partnerActiveBooking.location },
                    { label: "Package", value: partnerActiveBooking.packageName },
                    { label: "Time", value: partnerActiveBooking.timeSlot },
                    { label: "Notes", value: partnerActiveBooking.notes || "None" },
                  ].map((d) => (
                    <div key={d.label}><span className="text-xs text-muted-foreground">{d.label}</span><div className="font-medium text-sm">{d.value}</div></div>
                  ))}
                </div>

                {/* Orbit Capture Module */}
                <div className="orbit-card rounded-xl p-4 sm:p-5 mb-6 border border-orbit-cyan/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                      <div className="absolute inset-0 w-4 h-4 rounded-full bg-red-500 animate-ping opacity-30" />
                    </div>
                    <span className="text-sm font-bold text-red-400">REC</span>
                    <span className="text-xs text-muted-foreground">Orbit Capture Module — 4K 60fps</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <HardDrive className="w-3 h-3 text-orbit-cyan" /><span>Storage: 24.8 GB</span>
                    <span className="text-orbit-border">|</span>
                    <Wifi className="w-3 h-3 text-orbit-cyan" /><span>Cloud: Connected</span>
                  </div>
                </div>

                {/* Shot List */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground">Shot List</h4>
                  {SHOT_LIST.map((shot) => (
                    <div key={shot.id} className={`flex items-center gap-3 orbit-card rounded-lg p-3 transition-all ${completedShots.has(shot.id) ? "border-orbit-cyan/30 bg-orbit-cyan/5" : "border-orbit-border"}`}>
                      <Checkbox id={shot.id} checked={completedShots.has(shot.id)} onCheckedChange={() => {
                        setCompletedShots((prev) => { const next = new Set(prev); if (next.has(shot.id)) { next.delete(shot.id); } else { next.add(shot.id); } return next; });
                      }} className="border-orbit-cyan/50 data-[state=checked]:bg-orbit-cyan data-[state=checked]:text-black" />
                      <div className="flex-1">
                        <label htmlFor={shot.id} className={`text-sm font-medium cursor-pointer ${completedShots.has(shot.id) ? "line-through text-muted-foreground" : "text-foreground"}`}>{shot.name}</label>
                        <p className="text-xs text-muted-foreground">{shot.description}</p>
                      </div>
                      {completedShots.has(shot.id) && <CheckCircle2 className="w-4 h-4 text-orbit-cyan" />}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => toast.success("Orbit Capture Module activated", { description: "Recording in 4K at 60fps" })} variant="outline" className="flex-1 border-orbit-cyan/30 text-orbit-cyan hover:bg-orbit-cyan/10 font-bold">
                    <Play className="w-4 h-4 mr-2" />Start Shooting
                  </Button>
                  <Button onClick={handleCompleteShooting} disabled={completedShots.size < SHOT_LIST.length} className="flex-1 bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold orbit-glow">
                    <Upload className="w-4 h-4 mr-2" />Complete & Sync ({completedShots.size}/{SHOT_LIST.length})
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Orbit Sync Module */}
          {partnerPhase === "syncing" && (
            <motion.div key="syncing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="orbit-card rounded-2xl p-4 sm:p-6 md:p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Cloud className="w-5 h-5 text-orbit-cyan" />Orbit Sync Module</h3>
                <div className="orbit-card rounded-xl p-4 sm:p-5 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Uploading to Open Cloud Server</span>
                    <span className="text-lg font-black text-orbit-cyan">{syncProgress}%</span>
                  </div>
                  <Progress value={syncProgress} className="h-3 bg-white/5 mb-4" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2"><Film className="w-3 h-3 text-orbit-cyan" /><span className="truncate max-w-[150px] sm:max-w-none">{currentFile}</span></div>
                    <div className="flex items-center gap-1"><Wifi className="w-3 h-3 text-orbit-cyan" /><span>{syncSpeed} MB/s</span></div>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">Upload Queue</h4>
                  {syncFiles.map((file, idx) => {
                    const isDone = syncProgress > ((idx + 1) / syncFiles.length) * 100;
                    const isActive = !isDone && syncProgress > (idx / syncFiles.length) * 100;
                    return (
                      <div key={file} className={`flex items-center gap-3 orbit-card rounded-lg p-3 text-xs ${isDone ? "border-orbit-cyan/20" : isActive ? "border-orbit-cyan/40 bg-orbit-cyan/5" : "border-orbit-border"}`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-orbit-cyan shrink-0" /> : isActive ? <Loader2 className="w-4 h-4 text-orbit-cyan shrink-0 animate-spin" /> : <Film className="w-4 h-4 text-muted-foreground shrink-0" />}
                        <span className={`truncate ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>{file}</span>
                        {isDone && <span className="ml-auto text-orbit-cyan/60 shrink-0">Done</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <Loader2 className="w-3 h-3 animate-spin text-orbit-cyan" /><span>Syncing in progress...</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy Shield */}
          {partnerPhase === "privacy" && (
            <motion.div key="privacy" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="orbit-card rounded-2xl p-6 sm:p-8 md:p-10 text-center orbit-glow">
                <motion.div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500/30" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
                    <Shield className="w-10 h-10 text-green-400" />
                  </motion.div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <h3 className="text-2xl font-black mb-3"><span className="text-green-400">Privacy Shield</span> Activated</h3>
                  <div className="flex items-center justify-center gap-2 mb-4"><CheckCircle2 className="w-5 h-5 text-green-400" /><span className="text-sm font-medium text-green-400">100% Synced & Verified</span></div>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">All local footage has been securely wiped from your device. The raw footage is now safely on the Open Cloud Server.</p>
                  <div className="orbit-card rounded-xl p-4 mb-8 max-w-sm mx-auto border border-green-500/20">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { label: "Files Synced", value: String(syncFiles.length) },
                        { label: "Local Wipe", value: "Complete" },
                        { label: "Cloud Status", value: "Verified" },
                        { label: "Encryption", value: "AES-256" },
                      ].map((d) => (
                        <div key={d.label}>
                          <span className="text-muted-foreground">{d.label}</span>
                          <div className={`font-bold ${d.value === "Complete" || d.value === "Verified" ? "text-green-400" : "text-foreground"}`}>{d.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleCompleteAndReturn} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 font-bold orbit-glow px-8">
                    <CheckCircle2 className="w-4 h-4 mr-2" />Complete & Return
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

// ─── Partner Footer ────────────────────────────────────────────────────────────
function PartnerFooter() {
  return (
    <footer className="border-t border-orbit-border py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orbit-purple to-orbit-cyan" />
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-orbit-purple/20 to-orbit-cyan/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-orbit-purple to-orbit-cyan" />
            </div>
          </div>
          <span className="text-sm font-bold text-gradient-orbit">ORBIT</span>
          <Badge variant="outline" className="text-[10px] border-orbit-purple/30 text-orbit-purple">PARTNER</Badge>
        </div>
        <div className="text-xs text-muted-foreground">Visual Architect Hub</div>
        <div className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Orbit. All rights reserved.</div>
      </div>
    </footer>
  );
}

// ─── Main Partner App ──────────────────────────────────────────────────────────
export default function PartnerApp() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PartnerNavbar />
      <main className="flex-1">
        <PartnerDashboard />
      </main>
      <PartnerFooter />
    </div>
  );
}
