const _jsxFileName = "src\\partner\\frontend\\partner-work.tsx";"use client";

/**
 * 🟣 PARTNER FRONTEND | PartnerWork
 *
 * Work section showing completed work history with amounts.
 * Compact mobile-first layout to reduce scrolling.
 * Uses ONLY real data from bookings in the store.
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
  const totalEarned = completedBookings.length * 700;

  // Calculate monthly earnings from completed bookings this month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyEarnings = completedBookings
    .filter((b) => {
      const d = new Date(b.bookingDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length * 700;

  const getCategoryBadge = (packageName) => {
    if (packageName.toLowerCase().includes("ugc") || packageName.toLowerCase().includes("professional")) {
      return "border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/10";
    }
    return "border-orbit-purple/30 text-orbit-purple bg-orbit-purple/10";
  };

  const getCategoryLabel = (packageName) => {
    if (packageName.toLowerCase().includes("ugc") || packageName.toLowerCase().includes("professional")) {
      return "UGC";
    }
    return "Personalized";
  };

  return (
    React.createElement(motion.div, {
      variants: staggerContainer,
      initial: "hidden",
      animate: "show",
      className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}

      /* Section Header */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}
        , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
            , React.createElement('div', { className: "w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
              , React.createElement(Briefcase, { className: "w-4 h-4 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}} )
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
              , React.createElement('h3', { className: "text-sm font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}, "Work History" )
              , React.createElement('p', { className: "text-[10px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}, "Completed jobs" )
            )
          )
          , React.createElement(Badge, { className: "bg-green-500/15 text-green-400 border-0 text-[10px] font-bold px-2 py-0.5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}
            , completedBookings.length, " done"
          )
        )
      )

      /* Summary Card - Compact */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
        , React.createElement('div', { className: "orbit-card rounded-xl border border-green-500/15 overflow-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}
          , React.createElement('div', { className: "p-3 sm:p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}
            /* Total from completed work */
            , React.createElement('div', { className: "flex items-center justify-between mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
              , React.createElement('div', { className: "flex items-center gap-2.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}
                , React.createElement('div', { className: "w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
                  , React.createElement(CheckCircle2, { className: "w-4 h-4 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}} )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}
                  , React.createElement('div', { className: "text-xs font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}
                    , completedBookings.length, " Completed"
                  )
                  , React.createElement('div', { className: "text-[9px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}, "Lifetime work" )
                )
              )
              , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
                , React.createElement('div', { className: "text-lg font-black text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
                  , formatCurrency(totalEarned)
                )
                , React.createElement('div', { className: "text-[8px] text-muted-foreground/50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}, "Total earned" )
              )
            )

            /* Monthly gain highlight */
            , React.createElement('div', { className: "rounded-lg bg-gradient-to-r from-orbit-purple/[0.08] to-orbit-cyan/[0.08] border border-orbit-purple/10 p-2.5 flex items-center justify-between"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}
              , React.createElement('div', { className: "flex items-center gap-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
                , React.createElement(BarChart3, { className: "w-3.5 h-3.5 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}} )
                , React.createElement('span', { className: "text-[10px] sm:text-xs font-medium text-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}, "This Month" )
              )
              , React.createElement('span', { className: "text-sm sm:text-base font-black text-gradient-orbit"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
                , formatCurrency(monthlyEarnings)
              )
            )
          )
        )
      )

      /* Completed Work List */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
        , completedBookings.length === 0 ? (
          React.createElement('div', { className: "orbit-card rounded-xl p-6 text-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}
            , React.createElement('div', { className: "w-12 h-12 rounded-full bg-orbit-purple/10 flex items-center justify-center mx-auto mb-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
              , React.createElement(Inbox, { className: "w-5 h-5 text-orbit-purple/50"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 128}} )
            )
            , React.createElement('h4', { className: "text-xs font-semibold text-foreground mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}, "No Completed Work Yet"   )
            , React.createElement('p', { className: "text-[10px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}, "Completed bookings will appear here."    )
          )
        ) : (
          React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}
            , (historyExpanded ? completedBookings : completedBookings.slice(0, 5)).map((entry, idx) => (
              React.createElement(motion.div, {
                key: entry.id,
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: idx * 0.03 },
                className: "orbit-card rounded-lg p-2.5 flex items-center gap-2.5 border border-orbit-border/30 hover:border-green-500/20 transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}

                /* Status icon */
                , React.createElement('div', { className: "w-7 h-7 rounded-md bg-green-500/10 flex items-center justify-center shrink-0"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}
                  , React.createElement(CheckCircle2, { className: "w-3.5 h-3.5 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}} )
                )

                /* Info */
                , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}
                  , React.createElement('div', { className: "flex items-center gap-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}
                    , React.createElement('span', { className: "text-[11px] sm:text-xs font-semibold text-foreground truncate"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}
                      , entry.packageName
                    )
                    , React.createElement(Badge, {
                      variant: "outline",
                      className: `text-[7px] px-1 py-0 shrink-0 ${getCategoryBadge(entry.packageName)}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}

                      , getCategoryLabel(entry.packageName)
                    )
                  )
                  , React.createElement('div', { className: "text-[9px] text-muted-foreground/60 flex items-center gap-1.5 mt-0.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}
                      , new Date(entry.bookingDate).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })
                    )
                    , React.createElement('span', { className: "text-muted-foreground/30", __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}, "·")
                    , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}, entry.location)
                  )
                )

                /* Amount */
                , React.createElement('div', { className: "text-right shrink-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
                  , React.createElement('div', { className: "text-xs font-bold text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}
                    , formatCurrency(700)
                  )
                  , React.createElement('div', { className: "text-[7px] text-muted-foreground/40 uppercase"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}, "Paid")
                )
              )
            ))

            /* Expand / Collapse button */
            , completedBookings.length > 5 && (
              React.createElement('button', {
                onClick: () => setHistoryExpanded(!historyExpanded),
                className: "w-full py-2 rounded-lg orbit-card border border-orbit-border/30 hover:border-orbit-cyan/20 transition-colors flex items-center justify-center gap-1 text-[10px] text-muted-foreground/60 hover:text-muted-foreground"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}

                , historyExpanded ? (
                  React.createElement(React.Fragment, null, "Show Less "
                      , React.createElement(ChevronUp, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}} )
                  )
                ) : (
                  React.createElement(React.Fragment, null, "View All ("
                      , completedBookings.length, ") " , React.createElement(ChevronDown, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}} )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}