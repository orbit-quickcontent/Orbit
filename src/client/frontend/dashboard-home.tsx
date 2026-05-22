"use client";

/**
 * 🔵 CLIENT FRONTEND | DashboardHome
 * 
 * Modern dashboard home view inspired by top app designs.
 * Features: Quick action cards, booking stats, active booking tracker,
 * package overview, and recent activity feed.
 * 
 * Used by: client-app.tsx
 * Category: Client UI
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  CalendarCheck,
  Radar,
  Package,
  ArrowRight,
  Film,
  Star,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Video,
  Play,
  CheckCircle2,
  Download,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { formatCurrency, isWithinRedownloadWindow, getRedownloadDaysRemaining } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";

type BookingTab = "total" | "active" | "done";

export function DashboardHome() {
  const {
    currentBooking,
    bookings,
    packages,
    setCurrentView,
    setSelectedPackage,
    setHighlightedPackageId,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<BookingTab | null>(null);

  const completedBookingsList = bookings.filter((b) => b.status === "DELIVERED");
  const activeBookingsList = bookings.filter(
    (b) => !["DELIVERED", "CANCELLED"].includes(b.status)
  );
  const completedBookings = completedBookingsList.length;
  const activeBookings = activeBookingsList.length;

  // Get filtered bookings based on active tab
  const filteredBookings =
    activeTab === "total" ? bookings :
    activeTab === "active" ? activeBookingsList :
    completedBookingsList;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-5 sm:space-y-6"
    >
      {/* ─── Quick Actions ─────────────────────────────────────── */}
      <motion.div variants={staggerItem}>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: <CalendarCheck className="w-5 h-5" />,
              label: "Book Now",
              desc: "Schedule a session",
              gradient: "from-orbit-cyan/20 to-blue-500/20",
              iconColor: "text-orbit-cyan",
              onClick: () => setCurrentView("packages"),
            },
            {
              icon: <Radar className="w-5 h-5" />,
              label: "Track Order",
              desc: currentBooking && !["DELIVERED", "CANCELLED"].includes(currentBooking.status) ? "Live tracking" : "No active order",
              gradient: "from-orbit-purple/20 to-pink-500/20",
              iconColor: "text-orbit-purple",
              onClick: () => setCurrentView("tracking"),
            },
            {
              icon: <Package className="w-5 h-5" />,
              label: "Packages",
              desc: "View pricing",
              gradient: "from-green-500/15 to-emerald-500/15",
              iconColor: "text-green-400",
              onClick: () => setCurrentView("packages"),
            },
            {
              icon: <Sparkles className="w-5 h-5" />,
              label: "Brand DNA",
              desc: "Customize style",
              gradient: "from-amber-500/15 to-orange-500/15",
              iconColor: "text-amber-400",
              onClick: () => {
                // Brand DNA is a Professional/UGC exclusive feature
                // Highlight the UGC package on the packages page
                const ugcPkg = packages.find((p) => p.tier === "PROFESSIONAL" || p.id === "pkg-professional");
                if (ugcPkg) {
                  setSelectedPackage(ugcPkg);
                  setHighlightedPackageId(ugcPkg.id);
                }
                setCurrentView("packages");
              },
            },
          ].map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className="group orbit-card rounded-2xl p-4 sm:p-5 text-left hover:border-orbit-cyan/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center ${action.iconColor} mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                {action.icon}
              </div>
              <h3 className="text-sm font-bold text-foreground mb-0.5">
                {action.label}
              </h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground/70">
                {action.desc}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── Active Booking Card ────────────────────────────────── */}
      {currentBooking && !["DELIVERED", "CANCELLED"].includes(currentBooking.status) && (
        <motion.div variants={staggerItem}>
          <button
            onClick={() => setCurrentView("tracking")}
            className="w-full text-left group"
          >
            <div className="orbit-card rounded-2xl p-4 sm:p-5 border-orbit-cyan/20 hover:border-orbit-cyan/40 transition-all duration-300 relative overflow-hidden">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orbit-cyan/5 via-transparent to-orbit-purple/5 animate-data-stream" />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orbit-cyan animate-pulse" />
                    <span className="text-xs font-bold text-orbit-cyan uppercase tracking-wider">
                      Active Booking
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orbit-cyan group-hover:translate-x-1 transition-all" />
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 flex items-center justify-center">
                    <Video className="w-6 h-6 text-orbit-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate">
                      {currentBooking.packageName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Booking #{currentBooking.id}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-orbit-cyan/30 text-orbit-cyan text-[10px] shrink-0"
                  >
                    {currentBooking.status}
                  </Badge>
                </div>

                {/* Mini progress bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orbit-cyan to-orbit-purple rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width:
                        currentBooking.status === "PAID"
                          ? "15%"
                          : currentBooking.status === "PARTNER_DISPATCHED"
                          ? "30%"
                          : currentBooking.status === "EN_ROUTE"
                          ? "45%"
                          : currentBooking.status === "SHOOTING"
                          ? "60%"
                          : currentBooking.status === "SYNCING"
                          ? "75%"
                          : currentBooking.status === "EDITING"
                          ? "90%"
                          : "100%",
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </button>
        </motion.div>
      )}

      {/* ─── Package Cards (Horizontal Scroll) ──────────────────── */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-orbit-cyan" />
            Packages
          </h3>
          <button
            onClick={() => setCurrentView("packages")}
            className="text-xs text-orbit-cyan hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="shrink-0 w-[260px] sm:w-[280px] h-full"
            >
              <button
                onClick={() => {
                  setSelectedPackage(pkg);
                  setCurrentView("packages");
                }}
                className="w-full text-left group h-full"
              >
                <div
                  className={`orbit-card rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02] hover:border-orbit-cyan/30 h-full flex flex-col ${
                    pkg.popular
                      ? "border-orbit-cyan/30 orbit-glow"
                      : "border-orbit-border"
                  }`}
                >
                  {pkg.popular && (
                    <Badge className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white text-[9px] font-bold px-2 py-0.5 mb-3">
                      MOST POPULAR
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        pkg.popular
                          ? "bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 text-orbit-cyan"
                          : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {pkg.popular ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {pkg.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        {pkg.deliveryTime} delivery
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-xl sm:text-2xl font-black text-gradient-orbit">
                      {formatCurrency(pkg.price)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      /session
                    </span>
                  </div>
                  <div className="space-y-1.5 mb-3 flex-1">
                    {pkg.features.slice(0, 3).map((f, fi) => (
                      <div
                        key={fi}
                        className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                      >
                        <CheckCircle2 className="w-3 h-3 text-orbit-cyan shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                    {pkg.features.length > 3 && (
                      <p className="text-[10px] text-muted-foreground/50">
                        +{pkg.features.length - 3} more
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[11px] text-orbit-cyan font-medium group-hover:underline">
                      Book Now
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-orbit-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Why Orbit ──────────────────────────────────────────── */}
      <motion.div variants={staggerItem}>
        <div className="orbit-card rounded-2xl p-4 sm:p-5">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Play className="w-4 h-4 text-orbit-purple" />
            Why Orbit?
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                value: "60",
                unit: "min",
                label: "Avg Delivery",
                color: "text-orbit-cyan",
              },
              {
                value: "4K",
                unit: "",
                label: "Quality",
                color: "text-orbit-purple",
              },
              {
                value: "500+",
                unit: "",
                label: "Projects",
                color: "text-green-400",
              },
            ].map((stat, i) => (
              <div key={i} className="text-center p-2">
                <div
                  className={`text-xl sm:text-2xl font-black ${stat.color}`}
                >
                  {stat.value}
                  <span className="text-xs opacity-60">{stat.unit}</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Total Video — Compact Card + Tab-Filtered Details ─── */}
      {bookings.length > 0 && (
        <motion.div variants={staggerItem}>
          {/* Compact TOTAL Card */}
          <button
            onClick={() => setActiveTab(activeTab ? null : "total")}
            className="w-full orbit-card rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] hover:border-orbit-cyan/20"
          >
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 rounded-xl bg-orbit-cyan/10 flex items-center justify-center">
                <Film className="w-5 h-5 text-orbit-cyan" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-foreground">
              {bookings.length}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">
              Total
            </div>
            <div className="mt-2 flex items-center justify-center">
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground/50 transition-transform duration-300 ${
                  activeTab ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Tab Bar: Total | Active | Done */}
          <AnimatePresence>
            {activeTab && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-1 mt-3 p-1 bg-white/[0.03] rounded-xl">
                  {([
                    { key: "total" as BookingTab, label: "Total", count: bookings.length },
                    { key: "active" as BookingTab, label: "Active", count: activeBookings },
                    { key: "done" as BookingTab, label: "Done", count: completedBookings },
                  ]).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                        activeTab === tab.key
                          ? "bg-orbit-cyan/15 text-orbit-cyan"
                          : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-white/[0.03]"
                      }`}
                    >
                      {tab.label}
                      <span className={`ml-1 text-[10px] ${
                        activeTab === tab.key
                          ? "text-orbit-cyan/60"
                          : "text-muted-foreground/40"
                      }`}>
                        ({tab.count})
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expandable Detail List (filtered by active tab) */}
          <AnimatePresence mode="wait">
            {activeTab && filteredBookings.length > 0 && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,191,255,0.15) transparent" }}>
                  {filteredBookings
                    .slice()
                    .reverse()
                    .map((b) => {
                      const isDelivered = b.status === "DELIVERED";
                      const isCancelled = b.status === "CANCELLED";
                      const withinWindow = isDelivered && isWithinRedownloadWindow(b.deliveredAt);
                      const daysLeft = isDelivered ? getRedownloadDaysRemaining(b.deliveredAt) : 0;

                      return (
                        <div
                          key={b.id}
                          className="orbit-card rounded-xl p-3 sm:p-4 flex items-center gap-3"
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isDelivered
                                ? "bg-green-500/10 text-green-400"
                                : isCancelled
                                ? "bg-red-500/10 text-red-400"
                                : "bg-orbit-cyan/10 text-orbit-cyan"
                            }`}
                          >
                            {isDelivered ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : isCancelled ? (
                              <X className="w-4 h-4" />
                            ) : (
                              <Film className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                              {b.packageName}
                            </div>
                            <div className="text-[11px] text-muted-foreground/70">
                              {new Date(b.bookingDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              · {b.timeSlot}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isDelivered && withinWindow && !b.downloaded && (
                              <Button
                                size="sm"
                                className="h-6 px-2 text-[10px] bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90"
                              >
                                <Download className="w-3 h-3 mr-1" /> Save
                              </Button>
                            )}
                            {isDelivered && b.downloaded && (
                              <span className="text-[10px] text-green-400/60">
                                {daysLeft}d left
                              </span>
                            )}
                            {isDelivered && !withinWindow && (
                              <span className="text-[10px] text-muted-foreground/40">Expired</span>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-[9px] shrink-0 ${
                                isDelivered
                                  ? "border-green-400/30 text-green-400"
                                  : isCancelled
                                  ? "border-red-400/30 text-red-400"
                                  : "border-orbit-cyan/30 text-orbit-cyan"
                              }`}
                            >
                              {b.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ─── CTA Banner ─────────────────────────────────────────── */}
      {!currentBooking && (
        <motion.div variants={staggerItem}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orbit-cyan to-orbit-purple p-5 sm:p-6 mt-2">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

            <div className="relative">
              <h3 className="text-lg sm:text-xl font-black text-white mb-1.5">
                Ready to Create Something Cinematic?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 mb-4 leading-relaxed">
                Get professional cinematic edits delivered in 60 minutes.
              </p>
              <Button
                onClick={() => setCurrentView("packages")}
                className="bg-white text-[#081C43] hover:bg-white/90 font-bold shadow-lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                Book a Session
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
