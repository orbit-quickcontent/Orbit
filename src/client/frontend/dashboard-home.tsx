"use client";

/**
 * 🔵 CLIENT FRONTEND | DashboardHome
 *
 * Compact mobile-first dashboard. Quick actions, active booking,
 * package cards, and collapsible booking history.
 * Optimized for minimal scrolling on mobile.
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

// Compact status label for badges
function compactStatus(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Pending",
    PAID: "Paid",
    PARTNER_DISPATCHED: "Dispatched",
    EN_ROUTE: "En Route",
    SHOOTING: "Shooting",
    SYNCING: "Syncing",
    EDITING: "Editing",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };
  return map[status] || status;
}

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

  const filteredBookings =
    activeTab === "total" ? bookings :
    activeTab === "active" ? activeBookingsList :
    completedBookingsList;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-2.5 sm:space-y-3"
    >
      {/* ─── Quick Actions (2x2 grid — compact) ──────────────── */}
      <motion.div variants={staggerItem}>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              icon: <CalendarCheck className="w-3.5 h-3.5" />,
              label: "Book Now",
              desc: "Schedule a session",
              gradient: "from-orbit-cyan/20 to-blue-500/20",
              iconColor: "text-orbit-cyan",
              onClick: () => setCurrentView("packages"),
            },
            {
              icon: <Radar className="w-3.5 h-3.5" />,
              label: "Track Order",
              desc: currentBooking && !["DELIVERED", "CANCELLED"].includes(currentBooking.status) ? "Live tracking" : "No active",
              gradient: "from-orbit-purple/20 to-pink-500/20",
              iconColor: "text-orbit-purple",
              onClick: () => setCurrentView("tracking"),
            },
            {
              icon: <Package className="w-3.5 h-3.5" />,
              label: "Packages",
              desc: "View pricing",
              gradient: "from-green-500/15 to-emerald-500/15",
              iconColor: "text-green-400",
              onClick: () => setCurrentView("packages"),
            },
            {
              icon: <Sparkles className="w-3.5 h-3.5" />,
              label: "Brand DNA",
              desc: "Customize style",
              gradient: "from-amber-500/15 to-orange-500/15",
              iconColor: "text-amber-400",
              onClick: () => {
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
              className="group orbit-card rounded-xl p-2.5 sm:p-3 text-left hover:border-orbit-cyan/20 transition-all duration-300 active:scale-[0.98]"
            >
              <div
                className={`w-7 h-7 rounded-md bg-gradient-to-br ${action.gradient} flex items-center justify-center ${action.iconColor} mb-1.5 group-hover:scale-110 transition-transform duration-300`}
              >
                {action.icon}
              </div>
              <h3 className="text-[11px] sm:text-xs font-bold text-foreground mb-0.5 truncate">
                {action.label}
              </h3>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground/70 truncate">
                {action.desc}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── Active Booking Card (compact) ───────────────────── */}
      {currentBooking && !["DELIVERED", "CANCELLED"].includes(currentBooking.status) && (
        <motion.div variants={staggerItem}>
          <button
            onClick={() => setCurrentView("tracking")}
            className="w-full text-left group"
          >
            <div className="orbit-card rounded-xl p-2.5 sm:p-3 border-orbit-cyan/20 hover:border-orbit-cyan/40 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orbit-cyan/5 via-transparent to-orbit-purple/5 animate-data-stream" />
              <div className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-orbit-cyan animate-pulse" />
                    <span className="text-[9px] sm:text-[10px] font-bold text-orbit-cyan uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orbit-cyan group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4 text-orbit-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] sm:text-xs font-bold text-foreground truncate">
                      {currentBooking.packageName}
                    </h4>
                    <p className="text-[9px] text-muted-foreground truncate">
                      #{currentBooking.id} · {currentBooking.location}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-orbit-cyan/30 text-orbit-cyan text-[8px] shrink-0"
                  >
                    {compactStatus(currentBooking.status)}
                  </Badge>
                </div>
                {/* Mini progress bar */}
                <div className="h-0.5 bg-white/5 rounded-full overflow-hidden mt-1.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orbit-cyan to-orbit-purple rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width:
                        currentBooking.status === "PAID" ? "15%"
                        : currentBooking.status === "PARTNER_DISPATCHED" ? "30%"
                        : currentBooking.status === "EN_ROUTE" ? "45%"
                        : currentBooking.status === "SHOOTING" ? "60%"
                        : currentBooking.status === "SYNCING" ? "75%"
                        : currentBooking.status === "EDITING" ? "90%"
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

      {/* ─── Package Cards (Horizontal Scroll — compact) ────── */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[10px] sm:text-xs font-bold text-foreground flex items-center gap-1">
            <Zap className="w-3 h-3 text-orbit-cyan" />
            Packages
          </h3>
          <button
            onClick={() => setCurrentView("packages")}
            className="text-[9px] sm:text-[10px] text-orbit-cyan hover:underline flex items-center gap-0.5"
          >
            View All <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5 -mx-3 px-3 scrollbar-hide">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="shrink-0 w-[180px] sm:w-[220px] h-full"
            >
              <button
                onClick={() => {
                  setSelectedPackage(pkg);
                  setCurrentView("packages");
                }}
                className="w-full text-left group h-full"
              >
                <div
                  className={`orbit-card rounded-xl p-2.5 sm:p-3 transition-all duration-300 hover:scale-[1.02] hover:border-orbit-cyan/30 h-full flex flex-col ${
                    pkg.popular ? "border-orbit-cyan/30 orbit-glow" : "border-orbit-border"
                  }`}
                >
                  {pkg.popular && (
                    <Badge className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white text-[7px] font-bold px-1.5 py-0 mb-1.5 w-fit">
                      POPULAR
                    </Badge>
                  )}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                        pkg.popular
                          ? "bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 text-orbit-cyan"
                          : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {pkg.popular ? <Sparkles className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[10px] sm:text-xs font-bold text-foreground truncate">
                        {pkg.name}
                      </h4>
                      <p className="text-[8px] text-muted-foreground">
                        {pkg.deliveryTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-0.5 mb-1.5">
                    <span className="text-base sm:text-lg font-black text-gradient-orbit">
                      {formatCurrency(pkg.price)}
                    </span>
                    <span className="text-[8px] text-muted-foreground">/session</span>
                  </div>
                  <div className="space-y-0.5 mb-1.5 flex-1">
                    {pkg.features.slice(0, 2).map((f, fi) => (
                      <div
                        key={fi}
                        className="flex items-center gap-1 text-[9px] text-muted-foreground"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-orbit-cyan shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                    {pkg.features.length > 2 && (
                      <p className="text-[8px] text-muted-foreground/50">
                        +{pkg.features.length - 2} more
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[9px] sm:text-[10px] text-orbit-cyan font-medium group-hover:underline">
                      Book Now
                    </span>
                    <ArrowRight className="w-2.5 h-2.5 text-orbit-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Total Video — Compact Card + Tab-Filtered Details ─── */}
      {bookings.length > 0 && (
        <motion.div variants={staggerItem}>
          {/* Compact TOTAL Card */}
          <button
            onClick={() => setActiveTab(activeTab ? null : "total")}
            className="w-full orbit-card rounded-xl p-2.5 sm:p-3 text-center transition-all duration-300 active:scale-[0.99] hover:border-orbit-cyan/20"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-7 h-7 rounded-md bg-orbit-cyan/10 flex items-center justify-center">
                <Film className="w-3.5 h-3.5 text-orbit-cyan" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-foreground">
                  {bookings.length}
                </div>
                <div className="text-[8px] text-muted-foreground uppercase tracking-widest">
                  Total Bookings
                </div>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-300 ${
                  activeTab ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Tab Bar */}
          <AnimatePresence>
            {activeTab && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-1 mt-1.5 p-0.5 bg-white/[0.03] rounded-lg">
                  {([
                    { key: "total" as BookingTab, label: "All", count: bookings.length },
                    { key: "active" as BookingTab, label: "Active", count: activeBookings },
                    { key: "done" as BookingTab, label: "Done", count: completedBookings },
                  ]).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                        activeTab === tab.key
                          ? "bg-orbit-cyan/15 text-orbit-cyan"
                          : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-white/[0.03]"
                      }`}
                    >
                      {tab.label}
                      <span className={`ml-0.5 text-[8px] ${
                        activeTab === tab.key ? "text-orbit-cyan/60" : "text-muted-foreground/40"
                      }`}>
                        ({tab.count})
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expandable Detail List */}
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
                <div className="mt-1.5 space-y-1 max-h-52 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,191,255,0.15) transparent" }}>
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
                          className="orbit-card rounded-lg p-2 flex items-center gap-2"
                        >
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                              isDelivered
                                ? "bg-green-500/10 text-green-400"
                                : isCancelled
                                ? "bg-red-500/10 text-red-400"
                                : "bg-orbit-cyan/10 text-orbit-cyan"
                            }`}
                          >
                            {isDelivered ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : isCancelled ? (
                              <X className="w-3 h-3" />
                            ) : (
                              <Film className="w-3 h-3" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] sm:text-[11px] font-medium text-foreground truncate">
                              {b.packageName}
                            </div>
                            <div className="text-[9px] text-muted-foreground/70 truncate">
                              {new Date(b.bookingDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} · {b.timeSlot}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {isDelivered && withinWindow && !b.downloaded && (
                              <Button
                                size="sm"
                                className="h-4 px-1 text-[8px] bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90"
                              >
                                <Download className="w-2 h-2 mr-0.5" /> Save
                              </Button>
                            )}
                            {isDelivered && b.downloaded && (
                              <span className="text-[8px] text-green-400/60">{daysLeft}d</span>
                            )}
                            {isDelivered && !withinWindow && (
                              <span className="text-[8px] text-muted-foreground/40">Expired</span>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-[7px] sm:text-[8px] ${
                                isDelivered
                                  ? "border-green-400/30 text-green-400"
                                  : isCancelled
                                  ? "border-red-400/30 text-red-400"
                                  : "border-orbit-cyan/30 text-orbit-cyan"
                              }`}
                            >
                              {compactStatus(b.status)}
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

      {/* ─── Why Orbit (compact inline) ──────────────────────── */}
      <motion.div variants={staggerItem}>
        <div className="orbit-card rounded-xl p-2.5 sm:p-3">
          <div className="flex items-center justify-around gap-2">
            {[
              { value: "60", unit: "min", label: "Delivery", color: "text-orbit-cyan" },
              { value: "4K", unit: "", label: "Quality", color: "text-orbit-purple" },
              { value: "500+", unit: "", label: "Projects", color: "text-green-400" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-base sm:text-lg font-black ${stat.color}`}>
                  {stat.value}
                  <span className="text-[8px] opacity-60">{stat.unit}</span>
                </div>
                <div className="text-[8px] sm:text-[9px] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── CTA Banner (compact) ─────────────────────────────── */}
      {!currentBooking && (
        <motion.div variants={staggerItem}>
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orbit-cyan to-orbit-purple p-3 sm:p-4">
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative">
              <h3 className="text-xs sm:text-sm font-black text-white mb-0.5">
                Ready to Create Something Cinematic?
              </h3>
              <p className="text-[9px] sm:text-[10px] text-white/70 mb-2">
                Professional edits delivered in 60 minutes.
              </p>
              <Button
                onClick={() => setCurrentView("packages")}
                className="bg-white text-[#000000] hover:bg-white/90 font-bold h-7 text-[10px]"
              >
                <Zap className="w-2.5 h-2.5 mr-0.5" />
                Book a Session
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
