"use client";

/**
 * 🟣 PARTNER FRONTEND | PartnerEarnings
 *
 * Earnings section showing:
 * - Total Amount Earned (hero number)
 * - Monthly gain, Weekly earnings breakdown
 * - Stats grid: Done, Rating, Week, Streak
 *
 * Used by: partner-app.tsx
 * Category: Partner UI
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
import { MOCK_COMPLETED_HISTORY } from "@/components/partner/constants";
import { DEFAULT_PARTNER_STATS, formatCurrency } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function PartnerEarnings() {
  const { bookings } = useAppStore();

  const partnerStats = DEFAULT_PARTNER_STATS;

  const completedBookings = bookings.filter((b) => b.status === "DELIVERED");
  const totalEarned = completedBookings.reduce((sum, b) => sum + b.packagePrice, 0) + partnerStats.totalEarnings;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const thisMonthHistory = MOCK_COMPLETED_HISTORY.filter((h) => {
    const d = new Date(h.completedDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const monthlyHistoryTotal = thisMonthHistory.reduce((sum, h) => sum + h.amount, 0) + partnerStats.monthlyEarnings;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-5 sm:space-y-6"
    >
      {/* ─── Hero Earnings Card ─────────────────────────────────── */}
      <motion.div variants={staggerItem}>
        <div className="relative overflow-hidden rounded-2xl border border-orbit-border/50">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.08] via-transparent to-orbit-purple/[0.05]" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orbit-cyan/10 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/5 to-transparent rounded-tr-full" />

          <div className="relative p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Earnings Overview</h3>
                  <p className="text-[10px] text-muted-foreground/70">Your income summary</p>
                </div>
              </div>
              <Badge variant="outline" className="border-green-500/20 text-green-400 text-[10px] gap-1">
                <TrendingUp className="w-3 h-3" />
                +12%
              </Badge>
            </div>

            {/* Total Earned — Hero number */}
            <div className="text-center mb-6 pb-6 border-b border-white/[0.06]">
              <p className="text-[10px] sm:text-xs text-muted-foreground/60 uppercase tracking-widest mb-2">
                Total Amount Earned
              </p>
              <div className="flex items-center justify-center gap-1.5">
                <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
                <span className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
                  {totalEarned.toLocaleString("en-US")}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <ArrowUpRight className="w-3 h-3 text-green-400" />
                <span className="text-[11px] text-green-400 font-medium">
                  +{formatCurrency(partnerStats.weeklyEarnings)} this week
                </span>
              </div>
            </div>

            {/* Monthly + Weekly row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-orbit-purple/[0.08] border border-orbit-purple/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-orbit-purple" />
                  <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Monthly</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-orbit-purple">
                  {formatCurrency(monthlyHistoryTotal)}
                </div>
              </div>
              <div className="rounded-xl bg-orbit-cyan/[0.08] border border-orbit-cyan/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-4 h-4 text-orbit-cyan" />
                  <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">This Week</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-orbit-cyan">
                  {formatCurrency(partnerStats.weeklyEarnings)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Stats Grid ─────────────────────────────────────────── */}
      <motion.div variants={staggerItem}>
        <div className="grid grid-cols-2 gap-3">
          {/* Done */}
          <div className="orbit-card rounded-2xl p-4 sm:p-5 border border-orbit-border/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CircleCheckBig className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground/60 uppercase tracking-wider">Done</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-green-400">
              {partnerStats.completed}
            </div>
            <p className="text-[9px] text-muted-foreground/40 mt-1">Projects completed</p>
          </div>

          {/* Rating */}
          <div className="orbit-card rounded-2xl p-4 sm:p-5 border border-orbit-border/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground/60 uppercase tracking-wider">Rating</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {partnerStats.rating}
            </div>
            <p className="text-[9px] text-muted-foreground/40 mt-1">Average client rating</p>
          </div>

          {/* Week */}
          <div className="orbit-card rounded-2xl p-4 sm:p-5 border border-orbit-border/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orbit-cyan/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-orbit-cyan" />
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground/60 uppercase tracking-wider">Week</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-orbit-cyan">
              {formatCurrency(partnerStats.weeklyEarnings)}
            </div>
            <p className="text-[9px] text-muted-foreground/40 mt-1">This week&apos;s earnings</p>
          </div>

          {/* Streak */}
          <div className="orbit-card rounded-2xl p-4 sm:p-5 border border-orbit-border/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orbit-purple/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-orbit-purple" />
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground/60 uppercase tracking-wider">Streak</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-orbit-purple">
              {partnerStats.completed + 3}
            </div>
            <p className="text-[9px] text-muted-foreground/40 mt-1">Consecutive weeks active</p>
          </div>
        </div>
      </motion.div>

      {/* ─── Quick Breakdown ────────────────────────────────────── */}
      <motion.div variants={staggerItem}>
        <div className="orbit-card rounded-2xl p-4 sm:p-5 border border-orbit-border/30">
          <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Earnings Breakdown</h4>
          <div className="space-y-3">
            {[
              { label: "Total Lifetime", amount: totalEarned, color: "text-green-400" },
              { label: "This Month", amount: monthlyHistoryTotal, color: "text-orbit-purple" },
              { label: "This Week", amount: partnerStats.weeklyEarnings, color: "text-orbit-cyan" },
              { label: "Avg Per Project", amount: Math.round(totalEarned / partnerStats.completed), color: "text-amber-400" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground/70">{row.label}</span>
                <span className={`text-sm font-bold ${row.color}`}>{formatCurrency(row.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
