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
  const { partnerActiveBooking, setPartnerActiveBooking, cancelBooking, updateBookingStatus, markBookingDelivered, markBookingDownloaded } = useAppStore();
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
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-4 sm:space-y-5"
    >
      {/* Section Header */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orbit-cyan/15 flex items-center justify-center">
              <Briefcase className="w-4.5 h-4.5 text-orbit-cyan" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Available Work</h3>
              <p className="text-[11px] text-muted-foreground/60">New bookings waiting for you</p>
            </div>
          </div>
          {MOCK_AVAILABLE_BOOKINGS.length > 0 && (
            <Badge className="bg-orbit-cyan/15 text-orbit-cyan border-0 text-[11px] font-bold px-2.5 py-1">
              {MOCK_AVAILABLE_BOOKINGS.length} new
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Work Cards */}
      {MOCK_AVAILABLE_BOOKINGS.length === 0 ? (
        <motion.div variants={staggerItem}>
          <div className="orbit-card rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.03] flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Available Work</h3>
            <p className="text-sm text-muted-foreground">
              New bookings will appear here when clients book sessions.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {MOCK_AVAILABLE_BOOKINGS.map((booking, idx) => (
            <motion.div
              key={booking.id}
              variants={staggerItem}
              className="orbit-card rounded-2xl overflow-hidden border border-orbit-border/50 hover:border-orbit-cyan/25 transition-all group"
            >
              {/* Card top accent line */}
              <div className="h-[2px] bg-gradient-to-r from-orbit-cyan via-orbit-purple to-orbit-cyan opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="p-4 sm:p-5">
                {/* Row 1: ID + Price */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orbit-cyan/15 to-orbit-purple/15 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-orbit-cyan" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{booking.id}</h4>
                      <Badge
                        variant="outline"
                        className={`text-[9px] mt-0.5 ${
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
                    <div className="text-base font-black text-gradient-orbit">
                      {formatCurrency(booking.packagePrice)}
                    </div>
                    <div className="text-[9px] text-muted-foreground/50">per shoot</div>
                  </div>
                </div>

                {/* Row 2: Details */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3 h-3 text-orbit-cyan/70" />
                    {new Date(booking.bookingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-orbit-cyan/70" />
                    {booking.timeSlot}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-orbit-cyan/70" />
                    {booking.location}
                  </div>
                </div>

                {/* Row 3: Notes */}
                {booking.notes && (
                  <p className="text-[11px] text-muted-foreground/40 italic mb-3 line-clamp-1">
                    &ldquo;{booking.notes}&rdquo;
                  </p>
                )}

                {/* Row 4: Accept Button */}
                <Button
                  onClick={() => handleAcceptBooking(booking)}
                  className="w-full bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold orbit-glow h-10"
                >
                  Accept Booking
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
