const _jsxFileName = "src\\client\\frontend\\dashboard-home.tsx";"use client";

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



// Compact status label for badges
function compactStatus(status) {
  const map = {
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
    selectedPackage,
    setSelectedPackage,
    setHighlightedPackageId,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState(null);

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
    React.createElement(motion.div, {
      variants: staggerContainer,
      initial: "hidden",
      animate: "show",
      className: "space-y-4 sm:space-y-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}

      /* ─── Premium Brand Typography Header ────────────────── */
      , React.createElement(motion.div, { variants: staggerItem, className: "py-4 sm:py-6 select-none"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}
        , React.createElement('h2', { className: "text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-space leading-none"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}, "Shoot"

        )
        , React.createElement('h2', { className: "text-4xl sm:text-5xl font-medium tracking-tight text-gradient-orbit editorial-italic leading-none mt-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}, "In Progress."

        )
        , React.createElement('p', { className: "text-[8px] sm:text-[9.5px] text-white/20 font-bold uppercase tracking-[0.25em] mt-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}, "Orbit v1.0.4 — Premium Access"

        )
      )

      /* ─── Quick Actions (2x2 grid — compact) ──────────────── */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
        , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
          , [
            {
              icon: React.createElement('span', { className: "font-extrabold text-sm text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, "+"),
              label: "BOOK NEW SHOOT",
              desc: "INSTANT MATCHING",
              bg: "bg-orbit-cyan",
              iconBg: "w-8 h-8 rounded-full flex items-center justify-center bg-orbit-cyan",
              onClick: () => {
                if (packages.length > 0 && !selectedPackage) {
                  setSelectedPackage(packages[0]);
                }
                setCurrentView("booking");
              },
            },
            {
              icon: React.createElement('span', { className: "font-extrabold text-[9px] text-white tracking-tighter"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}, "DNA"),
              label: "TRACK ORDER",
              desc: `${activeBookings} ACTIVE`,
              bg: "bg-orbit-purple",
              iconBg: "w-8 h-8 rounded-full flex items-center justify-center bg-orbit-purple",
              onClick: () => setCurrentView("tracking"),
            },
            {
              icon: React.createElement(Film, { className: "w-4 h-4 text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}} ),
              label: "RECENT PROJECTS",
              desc: `${completedBookings} DELIVERED`,
              bg: "bg-white/10",
              iconBg: "w-8 h-8 rounded-full flex items-center justify-center bg-white/10 border border-white/5",
              onClick: () => setActiveTab(activeTab === "done" ? null : "done"),
            },
            {
              icon: React.createElement(Star, { className: "w-3.5 h-3.5 text-white fill-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}} ),
              label: "BRAND IDENTITY",
              desc: "ASSETS & DNA",
              bg: "bg-white/10",
              iconBg: "w-8 h-8 rounded-full flex items-center justify-center bg-white/10 border border-white/5",
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
            React.createElement('button', {
              key: i,
              onClick: action.onClick,
              className: "group orbit-card rounded-2xl p-4 text-left hover:border-orbit-cyan/20 transition-all duration-300 active:scale-[0.97]"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}

              , React.createElement('div', { className: `${action.iconBg} mb-3.5 group-hover:scale-105 transition-transform duration-300`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
                , action.icon
              )
              , React.createElement('h3', { className: "text-[10px] sm:text-xs font-black text-white tracking-wider mb-0.5 font-space truncate"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
                , action.label
              )
              , React.createElement('p', { className: "text-[9px] text-muted-foreground/60 font-bold uppercase tracking-wide truncate"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}
                , action.desc
              )
            )
          ))
        )
      )

      /* ─── Active Booking Card (compact) ───────────────────── */
      , currentBooking && !["DELIVERED", "CANCELLED"].includes(currentBooking.status) && (
        React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}
          , React.createElement('button', {
            onClick: () => setCurrentView("tracking"),
            className: "w-full text-left group"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}

            , React.createElement('div', { className: "orbit-card rounded-xl p-2.5 sm:p-3 border-orbit-cyan/20 hover:border-orbit-cyan/40 transition-all duration-300 relative overflow-hidden"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
              , React.createElement('div', { className: "absolute inset-0 bg-gradient-to-r from-orbit-cyan/5 via-transparent to-orbit-purple/5 animate-data-stream"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}} )
              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}
                , React.createElement('div', { className: "flex items-center justify-between mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}
                  , React.createElement('div', { className: "flex items-center gap-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
                    , React.createElement('div', { className: "w-1.5 h-1.5 rounded-full bg-orbit-cyan animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}} )
                    , React.createElement('span', { className: "text-[9px] sm:text-[10px] font-bold text-orbit-cyan uppercase tracking-wider"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}, "Active"

                    )
                  )
                  , React.createElement(ChevronRight, { className: "w-3 h-3 text-muted-foreground group-hover:text-orbit-cyan group-hover:translate-x-1 transition-all"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}} )
                )
                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
                  , React.createElement('div', { className: "w-8 h-8 rounded-md bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 flex items-center justify-center shrink-0"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
                    , React.createElement(Video, { className: "w-4 h-4 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}} )
                  )
                  , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}
                    , React.createElement('h4', { className: "text-[11px] sm:text-xs font-bold text-foreground truncate"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}
                      , currentBooking.packageName
                    )
                    , React.createElement('p', { className: "text-[9px] text-muted-foreground truncate"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}, "#"
                      , currentBooking.id, " · "  , currentBooking.location ? currentBooking.location.split(" @")[0] : ""
                    )
                  )
                  , React.createElement(Badge, {
                    variant: "outline",
                    className: "border-orbit-cyan/30 text-orbit-cyan text-[8px] shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}

                    , compactStatus(currentBooking.status)
                  )
                )
                /* Mini progress bar */
                , React.createElement('div', { className: "h-0.5 bg-white/5 rounded-full overflow-hidden mt-1.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}
                  , React.createElement(motion.div, {
                    className: "h-full bg-gradient-to-r from-orbit-cyan to-orbit-purple rounded-full"    ,
                    initial: { width: "0%" },
                    animate: {
                      width:
                        currentBooking.status === "PAID" ? "15%"
                          : currentBooking.status === "PARTNER_DISPATCHED" ? "30%"
                            : currentBooking.status === "EN_ROUTE" ? "45%"
                              : currentBooking.status === "SHOOTING" ? "60%"
                                : currentBooking.status === "SYNCING" ? "75%"
                                  : currentBooking.status === "EDITING" ? "90%"
                                    : "100%",
                    },
                    transition: { duration: 1.5, ease: "easeOut" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}
                  )
                )
              )
            )
          )
        )
      )

      /* ─── Package Cards (Horizontal Scroll — compact) ────── */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 229}}
        , React.createElement('div', { className: "flex items-center justify-between mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 230}}
          , React.createElement('h3', { className: "text-[10px] sm:text-xs font-bold text-foreground flex items-center gap-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}
            , React.createElement(Zap, { className: "w-3 h-3 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}} ), "Packages"

          )
          , React.createElement('button', {
            onClick: () => setCurrentView("packages"),
            className: "text-[9px] sm:text-[10px] text-orbit-cyan hover:underline flex items-center gap-0.5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}
, "View All "
              , React.createElement(ChevronRight, { className: "w-2.5 h-2.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 239}} )
          )
        )
        , React.createElement('div', { className: "flex gap-2 overflow-x-auto pb-0.5 -mx-3 px-3 scrollbar-hide"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}
          , packages.map((pkg, i) => (
            React.createElement(motion.div, {
              key: pkg.id,
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.1 + i * 0.1 },
              className: "shrink-0 w-[180px] sm:w-[220px] h-full"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}

              , React.createElement('button', {
                onClick: () => {
                  setSelectedPackage(pkg);
                  setCurrentView("packages");
                },
                className: "w-full text-left group h-full"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}

                , React.createElement('div', {
                  className: `orbit-card rounded-xl p-2.5 sm:p-3 transition-all duration-300 hover:scale-[1.02] hover:border-orbit-cyan/30 h-full flex flex-col ${pkg.popular ? "border-orbit-cyan/30 orbit-glow" : "border-orbit-border"
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 258}}

                  , pkg.popular && (
                    React.createElement(Badge, { className: "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white text-[7px] font-bold px-1.5 py-0 mb-1.5 w-fit"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}, "POPULAR"

                    )
                  )
                  , React.createElement('div', { className: "flex items-center gap-1.5 mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 267}}
                    , React.createElement('div', {
                      className: `w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${pkg.popular
                          ? "bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 text-orbit-cyan"
                          : "bg-white/5 text-muted-foreground"
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}

                      , pkg.popular ? React.createElement(Sparkles, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}} ) : React.createElement(Star, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}} )
                    )
                    , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}
                      , React.createElement('h4', { className: "text-[10px] sm:text-xs font-bold text-foreground truncate"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}
                        , pkg.name
                      )
                      , React.createElement('p', { className: "text-[8px] text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}
                        , pkg.deliveryTime
                      )
                    )
                  )
                  , React.createElement('div', { className: "flex items-baseline gap-0.5 mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}
                    , React.createElement('span', { className: "text-base sm:text-lg font-black text-gradient-orbit"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}
                      , formatCurrency(pkg.price)
                    )
                    , React.createElement('span', { className: "text-[8px] text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}}, "/session")
                  )
                  , React.createElement('div', { className: "space-y-0.5 mb-1.5 flex-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}
                    , pkg.features.slice(0, 2).map((f, fi) => (
                      React.createElement('div', {
                        key: fi,
                        className: "flex items-center gap-1 text-[9px] text-muted-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}}

                        , React.createElement(CheckCircle2, { className: "w-2.5 h-2.5 text-orbit-cyan shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}} )
                        , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}, f)
                      )
                    ))
                    , pkg.features.length > 2 && (
                      React.createElement('p', { className: "text-[8px] text-muted-foreground/50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}, "+"
                        , pkg.features.length - 2, " more"
                      )
                    )
                  )
                  , React.createElement('div', { className: "flex items-center justify-between mt-auto"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}
                    , React.createElement('span', { className: "text-[9px] sm:text-[10px] text-orbit-cyan font-medium group-hover:underline"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}, "Book Now"

                    )
                    , React.createElement(ArrowRight, { className: "w-2.5 h-2.5 text-orbit-cyan opacity-0 group-hover:opacity-100 transition-opacity"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}} )
                  )
                )
              )
            )
          ))
        )
      )

      /* ─── Total Video — Compact Card + Tab-Filtered Details ─── */
      , bookings.length > 0 && (
        React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}
          /* Compact TOTAL Card */
          , React.createElement('button', {
            onClick: () => setActiveTab(activeTab ? null : "total"),
            className: "w-full orbit-card rounded-xl p-2.5 sm:p-3 text-center transition-all duration-300 active:scale-[0.99] hover:border-orbit-cyan/20"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 324}}

            , React.createElement('div', { className: "flex items-center justify-center gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}
              , React.createElement('div', { className: "w-7 h-7 rounded-md bg-orbit-cyan/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}}
                , React.createElement(Film, { className: "w-3.5 h-3.5 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 330}} )
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 332}}
                , React.createElement('div', { className: "text-xl sm:text-2xl font-black text-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}
                  , bookings.length
                )
                , React.createElement('div', { className: "text-[8px] text-muted-foreground uppercase tracking-widest"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 336}}, "Total Bookings"

                )
              )
              , React.createElement(ChevronDown, {
                className: `w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-300 ${activeTab ? "rotate-180" : ""
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}
              )
            )
          )

          /* Tab Bar */
          , React.createElement(AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}
            , activeTab && (
              React.createElement(motion.div, {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                exit: { opacity: 0, height: 0 },
                transition: { duration: 0.25 },
                className: "overflow-hidden", __self: this, __source: {fileName: _jsxFileName, lineNumber: 350}}

                , React.createElement('div', { className: "flex items-center gap-1 mt-1.5 p-0.5 bg-white/[0.03] rounded-lg"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}
                  , ([
                    { key: "total" , label: "All", count: bookings.length },
                    { key: "active" , label: "Active", count: activeBookings },
                    { key: "done" , label: "Done", count: completedBookings },
                  ]).map((tab) => (
                    React.createElement('button', {
                      key: tab.key,
                      onClick: () => setActiveTab(tab.key),
                      className: `flex-1 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === tab.key
                          ? "bg-orbit-cyan/15 text-orbit-cyan"
                          : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-white/[0.03]"
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 363}}

                      , tab.label
                      , React.createElement('span', { className: `ml-0.5 text-[8px] ${activeTab === tab.key ? "text-orbit-cyan/60" : "text-muted-foreground/40"
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 372}}, "("
                        , tab.count, ")"
                      )
                    )
                  ))
                )
              )
            )
          )

          /* Expandable Detail List */
          , React.createElement(AnimatePresence, { mode: "wait", __self: this, __source: {fileName: _jsxFileName, lineNumber: 384}}
            , activeTab && filteredBookings.length > 0 && (
              React.createElement(motion.div, {
                key: activeTab,
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                exit: { opacity: 0, height: 0 },
                transition: { duration: 0.3 },
                className: "overflow-hidden", __self: this, __source: {fileName: _jsxFileName, lineNumber: 386}}

                , React.createElement('div', { className: "mt-1.5 space-y-1 max-h-52 overflow-y-auto"   , style: { scrollbarWidth: "thin", scrollbarColor: "rgba(0,191,255,0.15) transparent" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 394}}
                  , filteredBookings
                    .slice()
                    .reverse()
                    .map((b) => {
                      const isDelivered = b.status === "DELIVERED";
                      const isCancelled = b.status === "CANCELLED";
                      const withinWindow = isDelivered && isWithinRedownloadWindow(b.deliveredAt);
                      const daysLeft = isDelivered ? getRedownloadDaysRemaining(b.deliveredAt) : 0;

                      return (
                        React.createElement('div', {
                          key: b.id,
                          className: "orbit-card rounded-lg p-2 flex items-center gap-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}

                          , React.createElement('div', {
                            className: `w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${isDelivered
                                ? "bg-green-500/10 text-green-400"
                                : isCancelled
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-orbit-cyan/10 text-orbit-cyan"
                              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}}

                            , isDelivered ? (
                              React.createElement(CheckCircle2, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}} )
                            ) : isCancelled ? (
                              React.createElement(X, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 420}} )
                            ) : (
                              React.createElement(Film, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 422}} )
                            )
                          )
                          , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}}
                            , React.createElement('div', { className: "text-[10px] sm:text-[11px] font-medium text-foreground truncate"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 426}}
                              , b.packageName
                            )
                            , React.createElement('div', { className: "text-[9px] text-muted-foreground/70 truncate"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}}
                              , new Date(b.bookingDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" }), " · "  , b.timeSlot
                            )
                          )
                          , React.createElement('div', { className: "flex items-center gap-1 shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 433}}
                            , isDelivered && withinWindow && !b.downloaded && (
                              React.createElement(Button, {
                                size: "sm",
                                className: "h-4 px-1 text-[8px] bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}}

                                , React.createElement(Download, { className: "w-2 h-2 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 439}} ), " Save"
                              )
                            )
                            , isDelivered && b.downloaded && (
                              React.createElement('span', { className: "text-[8px] text-green-400/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 443}}, daysLeft, "d")
                            )
                            , isDelivered && !withinWindow && (
                              React.createElement('span', { className: "text-[8px] text-muted-foreground/40" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 446}}, "Expired")
                            )
                            , React.createElement(Badge, {
                              variant: "outline",
                              className: `text-[7px] sm:text-[8px] ${isDelivered
                                  ? "border-green-400/30 text-green-400"
                                  : isCancelled
                                    ? "border-red-400/30 text-red-400"
                                    : "border-orbit-cyan/30 text-orbit-cyan"
                                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 448}}

                              , compactStatus(b.status)
                            )
                          )
                        )
                      );
                    })
                )
              )
            )
          )
        )
      )

      /* ─── Why Orbit (compact inline) ──────────────────────── */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 471}}
        , React.createElement('div', { className: "orbit-card rounded-xl p-2.5 sm:p-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 472}}
          , React.createElement('div', { className: "flex items-center justify-around gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 473}}
            , [
              { value: "60", unit: "min", label: "Delivery", color: "text-orbit-cyan" },
              { value: "4K", unit: "", label: "Quality", color: "text-orbit-purple" },
              { value: "500+", unit: "", label: "Projects", color: "text-green-400" },
            ].map((stat, i) => (
              React.createElement('div', { key: i, className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 479}}
                , React.createElement('div', { className: `text-base sm:text-lg font-black ${stat.color}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 480}}
                  , stat.value
                  , React.createElement('span', { className: "text-[8px] opacity-60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 482}}, stat.unit)
                )
                , React.createElement('div', { className: "text-[8px] sm:text-[9px] text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 484}}
                  , stat.label
                )
              )
            ))
          )
        )
      )

      /* ─── CTA Banner (compact) ─────────────────────────────── */
      , !currentBooking && (
        React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 495}}
          , React.createElement('div', { className: "relative overflow-hidden rounded-xl bg-gradient-to-r from-orbit-cyan to-orbit-purple p-3 sm:p-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 496}}
            , React.createElement('div', { className: "absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 497}} )
            , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 498}}
              , React.createElement('h3', { className: "text-xs sm:text-sm font-black text-white mb-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 499}}, "Ready to Create Something Cinematic?"

              )
              , React.createElement('p', { className: "text-[9px] sm:text-[10px] text-white/70 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 502}}, "Professional edits delivered in 60 minutes."

              )
              , React.createElement(Button, {
                onClick: () => {
                  if (packages.length > 0 && !selectedPackage) {
                    setSelectedPackage(packages[0]);
                  }
                  setCurrentView("booking");
                },
                className: "bg-white text-[#000000] hover:bg-white/90 font-bold h-7 text-[10px]"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 505}}

                , React.createElement(Zap, { className: "w-2.5 h-2.5 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 514}} ), "Book a Session"

              )
            )
          )
        )
      )
    )
  );
}