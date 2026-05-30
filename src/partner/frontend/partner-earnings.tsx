"use client";

/**
 * PartnerEarnings
 *
 * Earnings section showing real earnings from completed bookings.
 * Compact mobile-first layout to reduce scrolling.
 */

import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  CreditCard,
  Star,
  CircleCheckBig,
  Clock,
  Sparkles,
  Timer,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function PartnerEarnings() {
  const { bookings, reviews } = useAppStore();

  const completedBookings = bookings.filter((b) => b.status === "DELIVERED");
  const totalEarned = completedBookings.reduce((sum, b) => sum + b.packagePrice, 0);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentWeek = getWeekNumber(now);

  const monthlyEarnings = completedBookings
    .filter((b) => {
      const d = new Date(b.bookingDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, b) => sum + b.packagePrice, 0);

  const weeklyEarnings = completedBookings
    .filter((b) => {
      const d = new Date(b.bookingDate);
      return getWeekNumber(d) === currentWeek && d.getFullYear() === currentYear;
    })
    .reduce((sum, b) => sum + b.packagePrice, 0);

  const avgPerProject = completedBookings.length > 0
    ? Math.round(totalEarned / completedBookings.length)
    : 0;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.partnerRating, 0) / reviews.length).toFixed(1)
    : "-";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-3 sm:space-y-4"
    >
      {/* Hero Earnings Card - Compact */}
      <motion.div variants={staggerItem}>
        <div className="relative overflow-hidden rounded-xl border border-orbit-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.08] via-transparent to-orbit-purple/[0.05]" />

          <div className="relative p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">Earnings</h3>
                  <p className="text-[9px] text-muted-foreground/70">Income summary</p>
                </div>
              </div>
              {completedBookings.length > 0 && (
                <Badge variant="outline" className="border-green-500/20 text-green-400 text-[9px] gap-1">
                  <TrendingUp className="w-2.5 h-2.5" />
                  {completedBookings.length} done
                </Badge>
              )}
            </div>

            {/* Total Earned */}
            <div className="text-center mb-3 pb-3 border-b border-white/[0.06]">
              <p className="text-[9px] text-muted-foreground/60 uppercase tracking-widest mb-1">
                Total Earned
              </p>
              <div className="flex items-center justify-center gap-1">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span className="text-xl sm:text-3xl font-black text-foreground tracking-tight">
                  {totalEarned.toLocaleString("en-US")}
                </span>
              </div>
              {weeklyEarnings > 0 && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <ArrowUpRight className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-[10px] text-green-400 font-medium">
                    +{formatCurrency(weeklyEarnings)} this week
                  </span>
                </div>
              )}
            </div>

            {/* Monthly + Weekly row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-orbit-purple/[0.08] border border-orbit-purple/10 p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <CreditCard className="w-3 h-3 text-orbit-purple" />
                  <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Month</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-orbit-purple truncate">
                  {formatCurrency(monthlyEarnings)}
                </div>
              </div>
              <div className="rounded-lg bg-orbit-cyan/[0.08] border border-orbit-cyan/10 p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Timer className="w-3 h-3 text-orbit-cyan" />
                  <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Week</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-orbit-cyan truncate">
                  {formatCurrency(weeklyEarnings)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Compact */}
      <motion.div variants={staggerItem}>
        <div className="grid grid-cols-2 gap-2">
          <div className="orbit-card rounded-xl p-3 border border-orbit-border/30">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center">
                <CircleCheckBig className="w-3 h-3 text-green-400" />
              </div>
              <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Done</span>
            </div>
            <div className="text-xl font-black text-green-400">
              {completedBookings.length}
            </div>
          </div>

          <div className="orbit-card rounded-xl p-3 border border-orbit-border/30">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-6 h-6 rounded-md bg-amber-400/10 flex items-center justify-center">
                <Star className="w-3 h-3 text-amber-400" />
              </div>
              <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Rating</span>
            </div>
            <div className="text-xl font-black text-amber-400">
              {avgRating}
            </div>
          </div>

          <div className="orbit-card rounded-xl p-3 border border-orbit-border/30">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-6 h-6 rounded-md bg-orbit-cyan/10 flex items-center justify-center">
                <Clock className="w-3 h-3 text-orbit-cyan" />
              </div>
              <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Week</span>
            </div>
            <div className="text-xl font-black text-orbit-cyan truncate">
              {formatCurrency(weeklyEarnings)}
            </div>
          </div>

          <div className="orbit-card rounded-xl p-3 border border-orbit-border/30">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-6 h-6 rounded-md bg-orbit-purple/10 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-orbit-purple" />
              </div>
              <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Avg</span>
            </div>
            <div className="text-xl font-black text-orbit-purple truncate">
              {formatCurrency(avgPerProject)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Earnings Breakdown - Compact */}
      <motion.div variants={staggerItem}>
        <div className="orbit-card rounded-xl p-3 border border-orbit-border/30">
          <h4 className="text-[10px] font-bold text-foreground mb-2 uppercase tracking-wider">Breakdown</h4>
          <div className="space-y-2">
            {[
              { label: "Lifetime", amount: totalEarned, color: "text-green-400" },
              { label: "This Month", amount: monthlyEarnings, color: "text-orbit-purple" },
              { label: "This Week", amount: weeklyEarnings, color: "text-orbit-cyan" },
              { label: "Avg/Project", amount: avgPerProject, color: "text-amber-400" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-muted-foreground/70">{row.label}</span>
                <span className={`text-xs sm:text-sm font-bold ${row.color}`}>{formatCurrency(row.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper: get ISO week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
