"use client";

import { useState, useRef } from "react";
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
  CloudUpload,
  HardDrive,
  Wifi,
  RefreshCw,
  LayoutDashboard,
  Navigation2,
  Route,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAppStore, type BookingInfo } from "@/lib/store";
import AnimatedBackground from "@/components/animated-background";

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
  const [partnerPhase, setPartnerPhase] = useState<"available" | "navigating" | "shooting" | "syncing" | "privacy" | "payment">("available");
  const [shotUploads, setShotUploads] = useState<Map<string, string>>(new Map());
  const [uploadingShotId, setUploadingShotId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [completedShots, setCompletedShots] = useState<Set<string>>(new Set());
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncSpeed, setSyncSpeed] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [partnerStats, setPartnerStats] = useState({ completed: 47, rating: 4.9, earnings: 84500 });

  const syncFiles = ["clip_001_4k.mov", "clip_002_4k.mov", "clip_003_4k.mov", "clip_004_4k.mov", "clip_005_4k.mov"];

  const handleAcceptBooking = (booking: BookingInfo) => {
    setPartnerActiveBooking(booking);
    setPartnerPhase("navigating");
    setCompletedShots(new Set());
    setShotUploads(new Map());
    toast.success("Booking accepted!", { description: `Navigate to ${booking.location}` });
  };

  const handleFileUpload = (shotId: string) => {
    setUploadingShotId(shotId);
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && uploadingShotId) {
      const fileName = e.target.files[0].name;
      setShotUploads((prev) => {
        const next = new Map(prev);
        next.set(uploadingShotId, fileName);
        return next;
      });
      toast.success(`Uploaded for ${SHOT_LIST.find((s) => s.id === uploadingShotId)?.name}`, { description: fileName });
    }
    setUploadingShotId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  const handleViewPayment = () => {
    setPartnerPhase("payment");
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
    <section className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Stats */}
        <motion.div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {[
            { icon: <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orbit-cyan" />, label: "Completed", value: partnerStats.completed },
            { icon: <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orbit-cyan" />, label: "Rating", value: partnerStats.rating },
            { icon: <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orbit-cyan" />, label: "This Month", value: `₹${partnerStats.earnings.toLocaleString("en-IN")}` },
          ].map((s, i) => (
            <div key={i} className="orbit-card rounded-xl p-2.5 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">{s.icon}<span className="text-[10px] sm:text-xs text-muted-foreground">{s.label}</span></div>
              <div className="text-lg sm:text-2xl font-black text-gradient-orbit">{s.value}</div>
            </div>
          ))}
        </motion.div>

        <motion.div className="text-center mb-6 sm:mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Badge variant="outline" className="mb-3 sm:mb-4 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5">
            <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />Partner Dashboard
          </Badge>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight mb-1 sm:mb-2">Visual <span className="text-gradient-orbit">Architect</span> Hub</h2>
          <p className="text-muted-foreground text-sm">
            {partnerPhase === "available" ? "Accept bookings and start capturing" : partnerPhase === "navigating" ? "Navigate to the shoot location" : partnerPhase === "shooting" ? "Active shoot in progress" : partnerPhase === "syncing" ? "Uploading footage" : partnerPhase === "privacy" ? "Privacy verification complete" : "Payment received for project"}
          </p>
        </motion.div>

        {/* Hidden file input for shot uploads */}
        <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileSelected} />

        <AnimatePresence mode="wait">
          {/* Available Bookings */}
          {partnerPhase === "available" && !partnerActiveBooking && (
            <motion.div key="available" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="orbit-card rounded-2xl p-3 sm:p-6 md:p-8">
                <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-orbit-cyan" />Available Bookings
                  <Badge variant="outline" className="ml-2 border-orbit-cyan/30 text-orbit-cyan text-xs">{MOCK_AVAILABLE_BOOKINGS.length} new</Badge>
                </h3>
                <div className="space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
                  {MOCK_AVAILABLE_BOOKINGS.map((booking, idx) => (
                    <motion.div key={booking.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                      className="orbit-card rounded-xl p-3 sm:p-4 border border-orbit-border hover:border-orbit-cyan/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-foreground">{booking.id}</span>
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

          {/* Map Navigation Dashboard */}
          {partnerPhase === "navigating" && partnerActiveBooking && (
            <motion.div key="navigating" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="orbit-card rounded-2xl p-3 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2"><Navigation2 className="w-4 h-4 sm:w-5 sm:h-5 text-orbit-cyan" />Navigate to Location</h3>
                  <Badge variant="outline" className="border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/10 w-fit">{partnerActiveBooking.id}</Badge>
                </div>

                {/* Map Visualization */}
                <div className="orbit-card rounded-xl p-0 mb-4 sm:mb-6 border border-orbit-cyan/20 overflow-hidden relative" style={{ minHeight: "260px" }}>
                  <svg viewBox="0 0 600 320" className="w-full h-auto" style={{ minHeight: "240px" }}>
                    {/* Background grid */}
                    <defs>
                      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0,191,255,0.06)" strokeWidth="0.5" />
                      </pattern>
                      <pattern id="gridLarge" width="150" height="150" patternUnits="userSpaceOnUse">
                        <path d="M 150 0 L 0 0 0 150" fill="none" stroke="rgba(0,191,255,0.12)" strokeWidth="1" />
                      </pattern>
                      <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00BFFF" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#6B5CE7" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#A020F0" stopOpacity="0.8" />
                      </linearGradient>
                      <filter id="glowCyan">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                      <filter id="glowPurple">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    <rect width="600" height="320" fill="#081C43" />
                    <rect width="600" height="320" fill="url(#grid)" />
                    <rect width="600" height="320" fill="url(#gridLarge)" />

                    {/* Simulated roads/blocks */}
                    <rect x="80" y="60" width="180" height="80" rx="4" fill="rgba(0,191,255,0.04)" stroke="rgba(0,191,255,0.08)" strokeWidth="0.5" />
                    <rect x="300" y="140" width="200" height="100" rx="4" fill="rgba(160,32,240,0.04)" stroke="rgba(160,32,240,0.08)" strokeWidth="0.5" />
                    <rect x="60" y="200" width="160" height="80" rx="4" fill="rgba(0,191,255,0.03)" stroke="rgba(0,191,255,0.06)" strokeWidth="0.5" />
                    <rect x="380" y="40" width="140" height="70" rx="4" fill="rgba(160,32,240,0.03)" stroke="rgba(160,32,240,0.06)" strokeWidth="0.5" />

                    {/* Route line (animated dashed) */}
                    <motion.path
                      d="M 120 260 C 180 240, 220 200, 280 180 C 340 160, 380 140, 460 100"
                      fill="none"
                      stroke="url(#routeGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="12 8"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    {/* Animated dash offset */}
                    <motion.path
                      d="M 120 260 C 180 240, 220 200, 280 180 C 340 160, 380 140, 460 100"
                      fill="none"
                      stroke="url(#routeGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="12 8"
                      animate={{ strokeDashoffset: [0, -40] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      opacity={0.5}
                    />

                    {/* Partner current location (animated pulse) */}
                    <motion.circle cx="120" cy="260" r="18" fill="rgba(0,191,255,0.1)" animate={{ r: [18, 28, 18] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.circle cx="120" cy="260" r="10" fill="rgba(0,191,255,0.15)" animate={{ r: [10, 16, 10] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                    <circle cx="120" cy="260" r="6" fill="#00BFFF" filter="url(#glowCyan)" />
                    <circle cx="120" cy="260" r="3" fill="white" />
                    {/* Partner label */}
                    <text x="120" y="290" textAnchor="middle" fill="#00BFFF" fontSize="11" fontWeight="bold" fontFamily="system-ui">You</text>

                    {/* Destination location */}
                    <motion.circle cx="460" cy="100" r="18" fill="rgba(160,32,240,0.1)" animate={{ r: [18, 28, 18] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.circle cx="460" cy="100" r="10" fill="rgba(160,32,240,0.15)" animate={{ r: [10, 16, 10] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
                    <circle cx="460" cy="100" r="6" fill="#A020F0" filter="url(#glowPurple)" />
                    <circle cx="460" cy="100" r="3" fill="white" />
                    {/* Destination label */}
                    <text x="460" y="80" textAnchor="middle" fill="#A020F0" fontSize="11" fontWeight="bold" fontFamily="system-ui">Destination</text>

                    {/* Location pin icon at destination */}
                    <text x="460" y="72" textAnchor="middle" fontSize="14" fill="#A020F0">📍</text>
                  </svg>

                  {/* Overlay info on map */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="orbit-card-strong rounded-lg px-3 py-2 text-xs flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orbit-cyan animate-pulse" />
                      <span className="text-orbit-cyan font-medium">Live Tracking</span>
                    </div>
                    <div className="orbit-card-strong rounded-lg px-3 py-2 text-xs text-muted-foreground flex items-center gap-1">
                      <Route className="w-3 h-3 text-orbit-purple" />
                      <span className="text-orbit-purple font-medium">Optimized Route</span>
                    </div>
                  </div>
                </div>

                {/* Distance & ETA Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="orbit-card rounded-xl p-3 text-center border border-orbit-cyan/20">
                    <div className="text-xs text-muted-foreground mb-1">Distance</div>
                    <div className="text-lg font-black text-gradient-orbit">8.4 km</div>
                  </div>
                  <div className="orbit-card rounded-xl p-3 text-center border border-orbit-cyan/20">
                    <div className="text-xs text-muted-foreground mb-1">ETA</div>
                    <div className="text-lg font-black text-gradient-orbit">22 min</div>
                  </div>
                  <div className="orbit-card rounded-xl p-3 text-center border border-orbit-cyan/20">
                    <div className="text-xs text-muted-foreground mb-1">Location</div>
                    <div className="text-sm font-bold text-foreground truncate">{partnerActiveBooking.location}</div>
                  </div>
                  <div className="orbit-card rounded-xl p-3 text-center border border-orbit-cyan/20">
                    <div className="text-xs text-muted-foreground mb-1">Time Slot</div>
                    <div className="text-sm font-bold text-foreground">{partnerActiveBooking.timeSlot}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => toast.success("Navigation started!", { description: "Follow the route to the shoot location" })} className="flex-1 bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold orbit-glow">
                    <Navigation2 className="w-4 h-4 mr-2" />Navigate
                  </Button>
                  <Button onClick={() => { setPartnerPhase("shooting"); toast.success("Arrived at location!", { description: "Ready to start shooting" }); }} className="flex-1 border border-green-500/30 text-green-400 hover:bg-green-500/10 font-bold bg-green-500/5">
                    <MapPin className="w-4 h-4 mr-2" />Arrived at Location
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Shoot */}
          {partnerPhase === "shooting" && partnerActiveBooking && (
            <motion.div key="shooting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="orbit-card rounded-2xl p-3 sm:p-6 md:p-8 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2"><Camera className="w-4 h-4 sm:w-5 sm:h-5 text-orbit-cyan" />Active Shoot</h3>
                  <Badge variant="outline" className="border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/10 w-fit">{partnerActiveBooking.id}</Badge>
                </div>

                <div className="orbit-card rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
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
                <div className="orbit-card rounded-xl p-3 sm:p-5 mb-4 sm:mb-6 border border-orbit-cyan/20">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
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
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground">Shot List</h4>
                  {SHOT_LIST.map((shot) => (
                    <div key={shot.id} className={`flex items-center gap-2 sm:gap-3 orbit-card rounded-lg p-2.5 sm:p-3 transition-all ${completedShots.has(shot.id) ? "border-orbit-cyan/30 bg-orbit-cyan/5" : "border-orbit-border"}`}>
                      <Checkbox id={shot.id} checked={completedShots.has(shot.id)} onCheckedChange={() => {
                        setCompletedShots((prev) => { const next = new Set(prev); if (next.has(shot.id)) { next.delete(shot.id); } else { next.add(shot.id); } return next; });
                      }} className="border-orbit-cyan/50 data-[state=checked]:bg-orbit-cyan data-[state=checked]:text-black" />
                      <div className="flex-1 min-w-0">
                        <label htmlFor={shot.id} className={`text-xs sm:text-sm font-medium cursor-pointer ${completedShots.has(shot.id) ? "line-through text-muted-foreground" : "text-foreground"}`}>{shot.name}</label>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">{shot.description}</p>
                      </div>
                      {completedShots.has(shot.id) && <CheckCircle2 className="w-4 h-4 text-orbit-cyan shrink-0" />}
                    </div>
                  ))}
                </div>

                {/* Upload Footage Per Shot */}
                <div className="orbit-card rounded-xl p-3 sm:p-5 mb-4 sm:mb-6 border border-orbit-purple/20">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                      <CloudUpload className="w-4 h-4 text-orbit-purple" />
                      Upload Footage Per Shot
                    </h4>
                    <Badge variant="outline" className={`text-xs ${shotUploads.size === SHOT_LIST.length ? "border-green-500/30 text-green-400 bg-green-500/5" : "border-orbit-purple/30 text-orbit-purple bg-orbit-purple/5"}`}>
                      {shotUploads.size}/{SHOT_LIST.length} uploaded
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {SHOT_LIST.map((shot) => {
                      const uploadedFile = shotUploads.get(shot.id);
                      return (
                        <div key={shot.id} className={`flex items-center gap-3 orbit-card rounded-lg p-3 transition-all ${uploadedFile ? "border-green-500/30 bg-green-500/5" : "border-orbit-border"}`}>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-foreground">{shot.name}</span>
                            {uploadedFile ? (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                                <span className="text-xs text-green-400 truncate">{uploadedFile}</span>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground mt-0.5">No file uploaded</p>
                            )}
                          </div>
                          {uploadedFile ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFileUpload(shot.id)}
                              className="border-orbit-purple/30 text-orbit-purple hover:bg-orbit-purple/10 hover:text-orbit-purple shrink-0"
                            >
                              <CloudUpload className="w-4 h-4 mr-1.5" />Upload
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {shotUploads.size > 0 && (
                    <div className="mt-3">
                      <Progress value={(shotUploads.size / SHOT_LIST.length) * 100} className="h-1.5 bg-white/5" />
                    </div>
                  )}
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
              <div className="orbit-card rounded-2xl p-3 sm:p-6 md:p-8">
                <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2"><Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-orbit-cyan" />Orbit Sync Module</h3>
                <div className="orbit-card rounded-xl p-3 sm:p-5 mb-4 sm:mb-6">
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
                <div className="space-y-2 mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-2 sm:mb-3">Upload Queue</h4>
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
              <div className="orbit-card rounded-2xl p-4 sm:p-8 md:p-10 text-center orbit-glow">
                <motion.div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500/30" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
                    <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
                  </motion.div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3"><span className="text-green-400">Privacy Shield</span> Activated</h3>
                  <div className="flex items-center justify-center gap-2 mb-4"><CheckCircle2 className="w-5 h-5 text-green-400" /><span className="text-sm font-medium text-green-400">100% Synced & Verified</span></div>
                  <p className="text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">All local footage has been securely wiped from your device. The raw footage is now safely on the Open Cloud Server.</p>
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
                  <Button onClick={handleViewPayment} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 font-bold orbit-glow px-8">
                    <CreditCard className="w-4 h-4 mr-2" />View Payment
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
          {/* Payment Received */}
          {partnerPhase === "payment" && partnerActiveBooking && (
            <motion.div key="payment" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="orbit-card rounded-2xl p-4 sm:p-8 md:p-10 text-center orbit-glow">
                <motion.div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 flex items-center justify-center border-2 border-orbit-cyan/30" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
                    <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-orbit-cyan" />
                  </motion.div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3"><span className="text-orbit-cyan">Payment</span> Received!</h3>
                  <div className="flex items-center justify-center gap-2 mb-4"><CheckCircle2 className="w-5 h-5 text-green-400" /><span className="text-sm font-medium text-green-400">Credited to your account</span></div>
                  <p className="text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">Payment for this project has been processed and credited to your Orbit Partner wallet.</p>
                  
                  <div className="orbit-card rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 max-w-sm mx-auto border border-orbit-cyan/20">
                    <div className="text-center mb-4">
                      <span className="text-xs text-muted-foreground">Amount Credited</span>
                      <div className="text-2xl sm:text-3xl font-black text-gradient-orbit mt-1">
                        ₹{partnerActiveBooking.packagePrice.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { label: "Booking ID", value: partnerActiveBooking.id },
                        { label: "Package", value: partnerActiveBooking.packageName },
                        { label: "Payment Status", value: "Credited" },
                        { label: "Method", value: "Orbit Wallet" },
                      ].map((d) => (
                        <div key={d.label}>
                          <span className="text-muted-foreground">{d.label}</span>
                          <div className={`font-bold ${d.value === "Credited" ? "text-green-400" : "text-foreground"}`}>{d.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="orbit-card rounded-xl p-4 mb-8 max-w-sm mx-auto border border-orbit-border">
                    <div className="text-xs text-muted-foreground mb-2">Updated Earnings</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">This Month</span>
                      <span className="text-lg font-black text-gradient-orbit">₹{(partnerStats.earnings + partnerActiveBooking.packagePrice).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium">Total Completed</span>
                      <span className="text-lg font-black text-foreground">{partnerStats.completed + 1}</span>
                    </div>
                  </div>

                  <Button onClick={handleCompleteAndReturn} className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold orbit-glow px-8">
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
    <div className="min-h-screen flex flex-col bg-background relative">
      <AnimatedBackground />
      <PartnerNavbar />
      <main className="flex-1">
        <PartnerDashboard />
      </main>
      <PartnerFooter />
    </div>
  );
}
