"use client";

/**
 * 🟣 PARTNER FRONTEND | PartnerWork
 *
 * Work section showing completed work history with amounts,
 * monthly total, and expandable list of past jobs.
 * Uses ONLY real data from bookings in the store.
 *
 * Used by: partner-app.tsx
 * Category: Partner UI
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Briefcase,
  Inbox,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function PartnerWork() {
  const { bookings } = useAppStore();
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const completedBookings = bookings.filter((b) => b.status === "DELIVERED");

  // Calculate total earned from completed bookings only
  const totalEarned = completedBookings.reduce((sum, b) => sum + b.packagePrice, 0);

  // Calculate monthly earnings from completed bookings this month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyEarnings = completedBookings
    .filter((b) => {
      const d = new Date(b.bookingDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, b) => sum + b.packagePrice, 0);

  const getCategoryBadge = (packageName: string) => {
    if (packageName.toLowerCase().includes("ugc") || packageName.toLowerCase().includes("professional")) {
      return "border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/10";
    }
    return "border-orbit-purple/30 text-orbit-purple bg-orbit-purple/10";
  };

  const getCategoryLabel = (packageName: string) => {
    if (packageName.toLowerCase().includes("ugc") || packageName.toLowerCase().includes("professional")) {
      return "UGC";
    }
    return "Personalized";
  };

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
            <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center">
              <Briefcase className="w-4.5 h-4.5 text-green-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Work History</h3>
              <p className="text-[11px] text-muted-foreground/60">Completed jobs & earnings</p>
            </div>
          </div>
          <Badge className="bg-green-500/15 text-green-400 border-0 text-[11px] font-bold px-2.5 py-1">
            {completedBookings.length} done
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
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">
                    {completedBookings.length} Projects Completed
                  </div>
                  <div className="text-[10px] text-muted-foreground/60">Lifetime work history</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-green-400">
                  {formatCurrency(totalEarned)}
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
                {formatCurrency(monthlyEarnings)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Completed Work List */}
      <motion.div variants={staggerItem}>
        {completedBookings.length === 0 ? (
          <div className="orbit-card rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-orbit-purple/10 flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6 text-orbit-purple/50" />
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-1">No Completed Work Yet</h4>
            <p className="text-xs text-muted-foreground/60">Your completed bookings will appear here once delivered.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(historyExpanded ? completedBookings : completedBookings.slice(0, 5)).map((entry, idx) => (
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
                      className={`text-[8px] px-1.5 py-0 ${getCategoryBadge(entry.packageName)}`}
                    >
                      {getCategoryLabel(entry.packageName)}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground/60 flex items-center gap-2 mt-0.5">
                    <span>
                      {new Date(entry.bookingDate).toLocaleDateString("en-US", {
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
                    {formatCurrency(entry.packagePrice)}
                  </div>
                  <div className="text-[8px] text-muted-foreground/40 uppercase">Paid</div>
                </div>
              </motion.div>
            ))}

            {/* Expand / Collapse button */}
            {completedBookings.length > 5 && (
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
                    View All ({completedBookings.length}) <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
