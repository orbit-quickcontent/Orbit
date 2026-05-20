"use client";

/**
 * 🟣 PARTNER FRONTEND | PartnerWork
 *
 * Work section showing completed work history with amounts,
 * monthly total, and expandable list of past jobs.
 *
 * Used by: partner-app.tsx
 * Category: Partner UI
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  History,
  CircleCheckBig,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import {
  MOCK_COMPLETED_HISTORY,
  type CompletedWorkEntry,
} from "@/components/partner/constants";
import { DEFAULT_PARTNER_STATS, formatCurrency } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function PartnerWork() {
  const { bookings } = useAppStore();
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const completedBookings = bookings.filter((b) => b.status === "DELIVERED");
  const partnerStatsCompleted = DEFAULT_PARTNER_STATS.completed;
  const partnerStatsTotalEarnings = DEFAULT_PARTNER_STATS.totalEarnings;
  const partnerStatsMonthlyEarnings = DEFAULT_PARTNER_STATS.monthlyEarnings;

  // Calculate monthly earnings from mock history
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const thisMonthHistory = MOCK_COMPLETED_HISTORY.filter((h) => {
    const d = new Date(h.completedDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const monthlyHistoryTotal = thisMonthHistory.reduce((sum, h) => sum + h.amount, 0) + partnerStatsMonthlyEarnings;
  const totalEarned = completedBookings.reduce((sum, b) => sum + b.packagePrice, 0) + partnerStatsTotalEarnings;
  const historyTotalAmount = MOCK_COMPLETED_HISTORY.reduce((sum, h) => sum + h.amount, 0) + totalEarned;

  const getCategoryColor = (category: CompletedWorkEntry["category"]) => {
    switch (category) {
      case "UGC": return "border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/10";
      case "Personalized": return "border-orbit-purple/30 text-orbit-purple bg-orbit-purple/10";
      case "Event": return "border-amber-400/30 text-amber-400 bg-amber-400/10";
    }
  };

  const allHistory = [
    ...MOCK_COMPLETED_HISTORY,
    ...completedBookings.map((b) => ({
      id: b.id,
      packageName: b.packageName,
      amount: b.packagePrice,
      completedDate: b.bookingDate,
      location: b.location,
      timeSlot: b.timeSlot,
      category: "Personalized" as const,
    })),
  ];

  const totalDone = partnerStatsCompleted + completedBookings.length;

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
            <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center">
              <Briefcase className="w-4.5 h-4.5 text-green-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Work History</h3>
              <p className="text-[11px] text-muted-foreground/60">Completed jobs & earnings</p>
            </div>
          </div>
          <Badge className="bg-green-500/15 text-green-400 border-0 text-[11px] font-bold px-2.5 py-1">
            {totalDone} done
          </Badge>
        </div>
      </motion.div>

      {/* Summary Card */}
      <motion.div variants={staggerItem}>
        <div className="orbit-card rounded-2xl border border-green-500/15 overflow-hidden">
          <div className="p-4 sm:p-5">
            {/* Total from completed work */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CircleCheckBig className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">
                    {totalDone} Projects Completed
                  </div>
                  <div className="text-[10px] text-muted-foreground/60">Lifetime work history</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-green-400">
                  {formatCurrency(historyTotalAmount)}
                </div>
                <div className="text-[9px] text-muted-foreground/50">Total earned</div>
              </div>
            </div>

            {/* Monthly gain highlight */}
            <div className="rounded-xl bg-gradient-to-r from-orbit-purple/[0.08] to-orbit-cyan/[0.08] border border-orbit-purple/10 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orbit-purple" />
                <span className="text-xs font-medium text-foreground">This Month&apos;s Earnings</span>
              </div>
              <span className="text-lg font-black text-gradient-orbit">
                {formatCurrency(monthlyHistoryTotal)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Completed Work List */}
      <motion.div variants={staggerItem}>
        <div className="space-y-2">
          {(historyExpanded ? allHistory : allHistory.slice(0, 5)).map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="orbit-card rounded-xl p-3 sm:p-3.5 flex items-center gap-3 border border-orbit-border/30 hover:border-green-500/20 transition-colors"
            >
              {/* Status icon */}
              <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {entry.packageName}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[8px] px-1.5 py-0 ${getCategoryColor(entry.category)}`}
                  >
                    {entry.category}
                  </Badge>
                </div>
                <div className="text-[10px] text-muted-foreground/60 flex items-center gap-2 mt-0.5">
                  <span>
                    {new Date(entry.completedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-muted-foreground/30">·</span>
                  <span>{entry.location}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-green-400">
                  {formatCurrency(entry.amount)}
                </div>
                <div className="text-[8px] text-muted-foreground/40 uppercase">Paid</div>
              </div>
            </motion.div>
          ))}

          {/* Expand / Collapse button */}
          {allHistory.length > 5 && (
            <button
              onClick={() => setHistoryExpanded(!historyExpanded)}
              className="w-full py-2.5 rounded-xl orbit-card border border-orbit-border/30 hover:border-orbit-cyan/20 transition-colors flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground"
            >
              {historyExpanded ? (
                <>
                  Show Less <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  View All ({allHistory.length}) <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
