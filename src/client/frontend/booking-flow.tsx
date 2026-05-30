"use client";

/**
 * 🔵 CLIENT FRONTEND | BookingFlow
 * 
 * 3-step booking flow: Your Details → Schedule & Location → Review & Payment.
 * Includes diagonal clock time picker, "Book Right Now" option, Brand DNA
 * integration for Professional tier, and payment gate with UPI/Razorpay.
 * 
 * Used by: client-app.tsx
 * Category: Client UI
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar as CalendarIcon,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  Users,
  ChevronDown,
  Zap as ZapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/constants";
import { type BookingInfo } from "@/lib/types";
import { BrandDNASection } from "./brand-dna-section";

// ─── Time Picker Helpers ────────────────────────────────────────────────────────
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,10...55
const PERIODS = ["AM", "PM"] as const;

export function BookingFlow() {
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
      
      // Process payment
      await fetch(`/api/bookings/${bookingId}/payment`, { method: "POST", headers: { "Content-Type": "application/json" } });

      // Dispatch booking to 5 nearest online partners
      try {
        await fetch(`/api/bookings/${bookingId}/dispatch`, { method: "POST", headers: { "Content-Type": "application/json" } });
      } catch { /* dispatch may fail gracefully — booking still tracked */ }

      const newBooking: BookingInfo = {
        id: bookingId, packageId: selectedPackage.id, packageName: selectedPackage.name, packagePrice: selectedPackage.price,
        status: "PAID", paymentStatus: "PROCESSING", bookingDate: bookingDate!.toISOString(), timeSlot: bookingTimeSlot,
        location: bookingLocation, syncPercentage: 0, editCountdown: 90, partnerName: null, notes: bookingNotes,
        deliveredAt: null, downloaded: false, cancelledBy: null, declinedByPartners: [],
      };

      setCurrentBooking(newBooking);
      addBooking(newBooking);
      setIsProcessing(false);
      toast.success("Payment initiated!", { description: `Booking ${bookingId} — dispatching to partners` });
      setCurrentView("tracking");
    } catch {
      setIsProcessing(false);
      const bookingId = `OL-${Date.now().toString(36).toUpperCase()}`;
      const newBooking: BookingInfo = {
        id: bookingId, packageId: selectedPackage.id, packageName: selectedPackage.name, packagePrice: selectedPackage.price,
        status: "PENDING", paymentStatus: "FAILED", bookingDate: bookingDate!.toISOString(), timeSlot: bookingTimeSlot,
        location: bookingLocation, syncPercentage: 0, editCountdown: 90, partnerName: null, notes: bookingNotes,
        deliveredAt: null, downloaded: false, cancelledBy: null, declinedByPartners: [],
      };
      setCurrentBooking(newBooking);
      addBooking(newBooking);
      toast.error("Payment failed!", { description: "Your booking was created but payment could not be processed. Please retry payment." });
      setCurrentView("tracking");
    }
  };

  return (
    <section className="pt-2 sm:pt-4 pb-8 sm:pb-12 px-0 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div className="text-center mb-6 sm:mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Book Your <span className="text-gradient-orbit">Session</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {selectedPackage ? `${selectedPackage.name} - ${formatCurrency(selectedPackage.price)}` : "Select a package first"}
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
                      <span className="font-black text-gradient-orbit">{formatCurrency(selectedPackage.price)}</span>
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
                  {["UPI", "Razorpay"].map((method) => (
                    <div key={method} className="flex-1 orbit-card rounded-xl p-3 text-center text-xs sm:text-sm font-medium border border-orbit-cyan/20">
                      <CreditCard className="w-4 h-4 mx-auto mb-1.5 text-orbit-cyan" />{method}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)} disabled={isProcessing} className="border-orbit-border text-foreground hover:bg-white/5"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
                <Button onClick={handlePayment} disabled={isProcessing} className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold orbit-glow px-8">
                  {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <><Lock className="w-4 h-4 mr-2" />Pay {formatCurrency(selectedPackage.price)}</>}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
