"use client";

/**
 * 🟣 PARTNER FRONTEND | PartnerDashboard (Home)
 *
 * Home screen showing only Available Work bookings.
 * Active workflow (navigate → shoot → sync → privacy → payment)
 * is also handled here since it starts from accepting a booking.
 *
 * Used by: partner-app.tsx
 * Category: Partner UI
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ArrowRight,
  Calendar as CalendarIcon,
  MapPin,
  Briefcase,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { type BookingInfo } from "@/lib/types";
import { SHOT_LIST, MOCK_AVAILABLE_BOOKINGS } from "./constants";
import { formatCurrency } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { MapNavigation } from "./map-navigation";
import { ShootingPhase } from "./shooting-phase";
import { SyncModule } from "./sync-module";
import { PrivacyShield } from "./privacy-shield";
import { PaymentReceived } from "./payment-received";

type PartnerPhase = "available" | "navigating" | "shooting" | "syncing" | "privacy" | "payment";

export function PartnerDashboard() {
  const { partnerActiveBooking, setPartnerActiveBooking, cancelBooking, updateBookingStatus, markBookingDelivered, markBookingDownloaded, addBooking, user } = useAppStore();
  const [partnerPhase, setPartnerPhase] = useState<PartnerPhase>("available");
  const [shotUploads, setShotUploads] = useState<Map<string, string>>(new Map());
  const [uploadingShotId, setUploadingShotId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [completedShots, setCompletedShots] = useState<Set<string>>(new Set());
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncSpeed, setSyncSpeed] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup sync interval on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, []);

  const syncFiles = ["clip_001_4k.mov", "clip_002_4k.mov", "clip_003_4k.mov", "clip_004_4k.mov", "clip_005_4k.mov"];

  const handleAcceptBooking = (booking: BookingInfo) => {
    // Add the booking to the store's bookings array so earnings/history can track it
    addBooking(booking);
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
      // Auto-check the shot checkbox when file is uploaded
      setCompletedShots((prev) => {
        const next = new Set(prev);
        next.add(uploadingShotId);
        return next;
      });
      toast.success(`Uploaded for ${SHOT_LIST.find((s) => s.id === uploadingShotId)?.name}`, { description: fileName });
    }
    setUploadingShotId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleArrived = () => {
    setPartnerPhase("shooting");
    toast.success("Arrived at location!", { description: "Ready to start shooting" });
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
        if (newFileIdx !== fileIdx) {
          fileIdx = newFileIdx;
          setCurrentFile(syncFiles[newFileIdx]);
        }
        setSyncSpeed(Math.floor(35 + Math.random() * 20));
        return next;
      });
    }, 150);
  };

  const handleViewPayment = () => {
    setPartnerPhase("payment");
  };

  const handleCompleteAndReturn = () => {
    // Update the booking in the store to DELIVERED status
    if (partnerActiveBooking) {
      updateBookingStatus(partnerActiveBooking.id, "DELIVERED");
      markBookingDelivered(partnerActiveBooking.id);
      markBookingDownloaded(partnerActiveBooking.id);
    }
    setPartnerPhase("available");
    setPartnerActiveBooking(null);
    setCompletedShots(new Set());
    setSyncProgress(0);
    toast.success("Project completed! Payment credited to your wallet.");
  };

  // ─── Active Workflow (when partner has accepted a booking) ──────────────
  if (partnerActiveBooking && partnerPhase !== "available") {
    return (
      <section className="pb-8 sm:pb-16 px-0 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="mb-3 border-orbit-purple/30 text-orbit-purple bg-orbit-purple/5">
              <Briefcase className="w-3.5 h-3.5 mr-1.5" />
              Active Work
            </Badge>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1">
              {partnerPhase === "navigating" ? (
                <>Navigate to <span className="text-gradient-orbit">Location</span></>
              ) : partnerPhase === "shooting" ? (
                <>Shoot <span className="text-gradient-orbit">In Progress</span></>
              ) : partnerPhase === "syncing" ? (
                <>Syncing <span className="text-gradient-orbit">Footage</span></>
              ) : partnerPhase === "privacy" ? (
                <>Privacy <span className="text-gradient-orbit">Verified</span></>
              ) : (
                <>Payment <span className="text-gradient-orbit">Received!</span></>
              )}
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {partnerActiveBooking.packageName} · {partnerActiveBooking.location}
            </p>
            {/* Cancel Booking Button - Only show before arriving at location */}
            {(partnerPhase === "navigating") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm("Are you sure you want to cancel this booking? It will be reassigned to another partner.")) {
                    cancelBooking(partnerActiveBooking.id, "PARTNER");
                    setPartnerPhase("available");
                    setPartnerActiveBooking(null);
                    toast.success("Booking cancelled. It will be reassigned to another partner.");
                  }
                }}
                className="mt-3 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 text-xs"
              >
                Cancel Booking
              </Button>
            )}
          </motion.div>

          <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileSelected} />

          <AnimatePresence mode="wait">
            {partnerPhase === "navigating" && (
              <motion.div key="navigating" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <MapNavigation booking={partnerActiveBooking} onArrived={handleArrived} />
              </motion.div>
            )}
            {partnerPhase === "shooting" && (
              <motion.div key="shooting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ShootingPhase booking={partnerActiveBooking} completedShots={completedShots} setCompletedShots={setCompletedShots} shotUploads={shotUploads} handleFileUpload={handleFileUpload} onCompleteShooting={handleCompleteShooting} />
              </motion.div>
            )}
            {partnerPhase === "syncing" && (
              <motion.div key="syncing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <SyncModule syncProgress={syncProgress} syncSpeed={syncSpeed} currentFile={currentFile} syncFiles={syncFiles} />
              </motion.div>
            )}
            {partnerPhase === "privacy" && (
              <motion.div key="privacy" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <PrivacyShield syncFiles={syncFiles} onViewPayment={handleViewPayment} />
              </motion.div>
            )}
            {partnerPhase === "payment" && (
              <motion.div key="payment" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <PaymentReceived booking={partnerActiveBooking} onCompleteAndReturn={handleCompleteAndReturn} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    );
  }

  // ─── Home: Available Work ────────────────────────────────────────────────
  // If partner is offline, show prompt to go online
  if (!user.isOnline) {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-4 sm:space-y-5"
      >
        <motion.div variants={staggerItem}>
          <div className="orbit-card rounded-2xl p-6 sm:p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-500/10 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-gray-400/50" />
            </div>
            <h3 className="text-base font-bold mb-2 text-foreground">You&apos;re Offline</h3>
            <p className="text-xs text-muted-foreground/60 mb-4">
              Go online to receive new booking requests from clients.
            </p>
            <p className="text-[10px] text-muted-foreground/40">
              Tap the <span className="text-gray-400">Online/Offline</span> toggle in the header to go online.
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ─── If partner has an active booking restored from storage (page refresh) ──
  if (partnerActiveBooking && partnerPhase === "available") {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <motion.div variants={staggerItem}>
          <div className="orbit-card rounded-xl p-4 border border-orbit-purple/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-orbit-purple/15 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-orbit-purple" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-foreground truncate">Active Booking Found</h3>
                <p className="text-[10px] text-muted-foreground/60 truncate">
                  {partnerActiveBooking.packageName} · {partnerActiveBooking.location}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setPartnerPhase("navigating")}
                className="flex-1 bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold h-9 text-xs"
              >
                <Play className="w-3.5 h-3.5 mr-1" /> Resume
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  cancelBooking(partnerActiveBooking.id, "PARTNER");
                  setPartnerActiveBooking(null);
                  toast.success("Booking cancelled.");
                }}
                className="border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs h-9"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-3 sm:space-y-4"
    >
      {/* Section Header */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orbit-cyan/15 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-orbit-cyan" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Available Work</h3>
              <p className="text-[10px] text-muted-foreground/60">New bookings waiting for you</p>
            </div>
          </div>
          {MOCK_AVAILABLE_BOOKINGS.length > 0 && (
            <Badge className="bg-orbit-cyan/15 text-orbit-cyan border-0 text-[10px] font-bold px-2 py-0.5">
              {MOCK_AVAILABLE_BOOKINGS.length} new
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Work Cards */}
      {MOCK_AVAILABLE_BOOKINGS.length === 0 ? (
        <motion.div variants={staggerItem}>
          <div className="orbit-card rounded-xl p-6 sm:p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/[0.03] flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-muted-foreground/30" />
            </div>
            <h3 className="text-sm font-bold mb-1">No Available Work</h3>
            <p className="text-xs text-muted-foreground">
              New bookings will appear here when clients book sessions.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-2.5">
          {MOCK_AVAILABLE_BOOKINGS.map((booking, idx) => (
            <motion.div
              key={booking.id}
              variants={staggerItem}
              className="orbit-card rounded-xl overflow-hidden border border-orbit-border/50 hover:border-orbit-cyan/25 transition-all group"
            >
              {/* Card top accent line */}
              <div className="h-[2px] bg-gradient-to-r from-orbit-cyan via-orbit-purple to-orbit-cyan opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="p-3 sm:p-4">
                {/* Row 1: ID + Price */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orbit-cyan/15 to-orbit-purple/15 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-orbit-cyan" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate">{booking.id}</h4>
                      <Badge
                        variant="outline"
                        className={`text-[8px] mt-0.5 ${
                          booking.packagePrice >= 4999
                            ? "border-orbit-cyan/30 text-orbit-cyan"
                            : "border-orbit-purple/30 text-orbit-purple"
                        }`}
                      >
                        {booking.packageName}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-gradient-orbit">
                      {formatCurrency(booking.packagePrice)}
                    </div>
                    <div className="text-[8px] text-muted-foreground/50">per shoot</div>
                  </div>
                </div>

                {/* Row 2: Details */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] sm:text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-2.5 h-2.5 text-orbit-cyan/70" />
                    <span className="truncate">{new Date(booking.bookingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-orbit-cyan/70" />
                    <span className="truncate">{booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-orbit-cyan/70" />
                    <span className="truncate">{booking.location}</span>
                  </div>
                </div>

                {/* Row 3: Notes */}
                {booking.notes && (
                  <p className="text-[10px] text-muted-foreground/40 italic mb-2 line-clamp-1">
                    &ldquo;{booking.notes}&rdquo;
                  </p>
                )}

                {/* Row 4: Accept Button */}
                <Button
                  onClick={() => handleAcceptBooking(booking)}
                  className="w-full bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold orbit-glow h-9 text-xs"
                >
                  Accept Booking
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
