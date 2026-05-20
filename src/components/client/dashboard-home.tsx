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

import { motion } from "framer-motion";
import {
  Zap,
  CalendarCheck,
  Radar,
  Package,
  ArrowRight,
  Clock,
  Film,
  Star,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Video,
  Play,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function DashboardHome() {
  const {
    currentBooking,
    bookings,
    packages,
    setCurrentView,
    setSelectedPackage,
  } = useAppStore();

  const completedBookings = bookings.filter(
    (b) => b.status === "DELIVERED"
  ).length;
  const activeBookings = bookings.filter(
    (b) => !["DELIVERED", "CANCELLED"].includes(b.status)
  ).length;

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
              onClick: () => setCurrentView("booking"),
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

      {/* ─── Stats Overview ─────────────────────────────────────── */}
      <motion.div variants={staggerItem}>
        <div className="orbit-card rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orbit-cyan" />
              Your Stats
            </h3>
            <Badge
              variant="outline"
              className="border-orbit-cyan/20 text-orbit-cyan text-[10px]"
            >
              Client
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: <Film className="w-4 h-4 text-orbit-cyan" />,
                value: bookings.length,
                label: "Total",
              },
              {
                icon: <Clock className="w-4 h-4 text-yellow-400" />,
                value: activeBookings,
                label: "Active",
              },
              {
                icon: <Star className="w-4 h-4 text-orbit-purple" />,
                value: completedBookings,
                label: "Done",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center justify-center mb-1.5">
                  {stat.icon}
                </div>
                <div className="text-xl sm:text-2xl font-black text-foreground">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
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
              className="shrink-0 w-[260px] sm:w-[280px]"
            >
              <button
                onClick={() => {
                  setSelectedPackage(pkg);
                  setCurrentView("booking");
                }}
                className="w-full text-left group"
              >
                <div
                  className={`orbit-card rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02] hover:border-orbit-cyan/30 h-full ${
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
                  <div className="space-y-1.5 mb-3">
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
                  <div className="flex items-center justify-between">
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

      {/* ─── Recent Activity ────────────────────────────────────── */}
      {bookings.length > 0 && (
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Recent Activity
            </h3>
          </div>
          <div className="space-y-2">
            {bookings
              .slice(-3)
              .reverse()
              .map((b) => (
                <div
                  key={b.id}
                  className="orbit-card rounded-xl p-3 sm:p-4 flex items-center gap-3"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      b.status === "DELIVERED"
                        ? "bg-green-500/10 text-green-400"
                        : b.status === "CANCELLED"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-orbit-cyan/10 text-orbit-cyan"
                    }`}
                  >
                    {b.status === "DELIVERED" ? (
                      <CheckCircle2 className="w-4 h-4" />
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
                  <Badge
                    variant="outline"
                    className={`text-[9px] shrink-0 ${
                      b.status === "DELIVERED"
                        ? "border-green-400/30 text-green-400"
                        : b.status === "CANCELLED"
                        ? "border-red-400/30 text-red-400"
                        : "border-orbit-cyan/30 text-orbit-cyan"
                    }`}
                  >
                    {b.status}
                  </Badge>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* ─── CTA Banner ─────────────────────────────────────────── */}
      {!currentBooking && (
        <motion.div variants={staggerItem}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orbit-cyan to-orbit-purple p-5 sm:p-6">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

            <div className="relative">
              <h3 className="text-lg sm:text-xl font-black text-white mb-1">
                Ready to Create?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 mb-4">
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
