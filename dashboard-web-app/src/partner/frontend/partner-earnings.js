const _jsxFileName = "src\\partner\\frontend\\partner-earnings.tsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

/**
 * PartnerEarnings
 *
 * Earnings section showing real earnings from completed bookings.
 * Compact mobile-first layout to reduce scrolling.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  IndianRupee,
  CreditCard,
  Star,
  CircleCheckBig,
  Clock,
  Sparkles,
  Timer,
  ArrowUpRight,
  ArrowDownToLine,
  Building2,
  Settings,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";

const MIN_WITHDRAWAL = 500;

export function PartnerEarnings() {
  const { bookings, reviews, user, withdrawFromWallet, setCurrentView, fetchPartnerProfile, partnerId } = useAppStore();

  useEffect(() => {
    if (partnerId) {
      fetchPartnerProfile();
    }
  }, [partnerId, fetchPartnerProfile]);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const { wallet, bankAccount } = user;

  const completedBookings = bookings.filter((b) => b.status === "DELIVERED");
  const totalEarned = completedBookings.length * 700;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentWeek = getWeekNumber(now);

  const monthlyEarnings = completedBookings
    .filter((b) => {
      const d = new Date(b.bookingDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length * 700;

  const weeklyEarnings = completedBookings
    .filter((b) => {
      const d = new Date(b.bookingDate);
      return getWeekNumber(d) === currentWeek && d.getFullYear() === currentYear;
    }).length * 700;

  const avgPerProject = completedBookings.length > 0
    ? Math.round(totalEarned / completedBookings.length)
    : 0;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.partnerRating, 0) / reviews.length).toFixed(1)
    : "-";

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount, 10);
    if (isNaN(amount) || amount < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal is ${formatCurrency(MIN_WITHDRAWAL)}`);
      return;
    }
    if (amount > wallet.balance) {
      toast.error("Insufficient wallet balance");
      return;
    }
    setIsWithdrawing(true);
    // Simulate a short delay for UX
    setTimeout(() => {
      withdrawFromWallet(amount);
      setWithdrawAmount("");
      setIsWithdrawing(false);
      toast.success(`${formatCurrency(amount)} withdrawn successfully!`, {
        description: `Transferred to ${_nullishCoalesce(_optionalChain([bankAccount, 'optionalAccess', _ => _.bankName]), () => ( "bank account"))}`,
      });
    }, 800);
  };

  const maskedAccount = bankAccount
    ? `${bankAccount.bankName} ****${bankAccount.accountNumber.slice(-4)}`
    : null;

  return (
    React.createElement(motion.div, {
      variants: staggerContainer,
      initial: "hidden",
      animate: "show",
      className: "space-y-3 sm:space-y-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}

      /* Wallet Balance Card */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}
        , React.createElement('div', { className: "relative overflow-hidden rounded-xl border border-orbit-border/50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}
          , React.createElement('div', { className: "absolute inset-0 bg-gradient-to-br from-green-500/[0.10] via-transparent to-orbit-cyan/[0.05]"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}} )
          , React.createElement('div', { className: "relative p-3 sm:p-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
            , React.createElement('div', { className: "flex items-center justify-between mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
                , React.createElement('div', { className: "w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
                  , React.createElement(Wallet, { className: "w-4 h-4 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}} )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
                  , React.createElement('h3', { className: "text-xs font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, "Wallet Balance" )
                  , React.createElement('p', { className: "text-[9px] text-muted-foreground/70" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}, "Available to withdraw"  )
                )
              )
            )

            , React.createElement('div', { className: "text-center mb-3 pb-3 border-b border-white/[0.06]"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}
              , React.createElement('div', { className: "flex items-center justify-center gap-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
                , React.createElement(IndianRupee, { className: "w-4 h-4 sm:w-5 sm:h-5 text-green-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}} )
                , React.createElement('span', { className: "text-xl sm:text-3xl font-black text-foreground tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}
                  , wallet.balance.toLocaleString("en-IN")
                )
              )
            )

            , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}
              , React.createElement('div', { className: "rounded-lg bg-amber-500/[0.08] border border-amber-500/10 p-2.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}
                , React.createElement('div', { className: "flex items-center gap-1.5 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}
                  , React.createElement(Clock, { className: "w-3 h-3 text-amber-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}} )
                  , React.createElement('span', { className: "text-[9px] text-muted-foreground/60 uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}, "Pending")
                )
                , React.createElement('div', { className: "text-lg sm:text-xl font-black text-amber-400 truncate"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}
                  , formatCurrency(wallet.pendingClearance)
                )
              )
              , React.createElement('div', { className: "rounded-lg bg-orbit-purple/[0.08] border border-orbit-purple/10 p-2.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}
                , React.createElement('div', { className: "flex items-center gap-1.5 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
                  , React.createElement(ArrowDownToLine, { className: "w-3 h-3 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}} )
                  , React.createElement('span', { className: "text-[9px] text-muted-foreground/60 uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}, "Withdrawn")
                )
                , React.createElement('div', { className: "text-lg sm:text-xl font-black text-orbit-purple truncate"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
                  , formatCurrency(wallet.totalWithdrawn)
                )
              )
            )
          )
        )
      )

      /* Withdraw Section */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}
        , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-4 border border-orbit-border/30"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}
            , React.createElement('div', { className: "w-7 h-7 rounded-lg bg-orbit-cyan/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}
              , React.createElement(ArrowDownToLine, { className: "w-3.5 h-3.5 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 166}} )
            )
            , React.createElement('h4', { className: "text-[11px] font-bold text-foreground uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}, "Withdraw")
          )

          , !bankAccount ? (
            React.createElement('div', { className: "text-center py-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}
              , React.createElement('div', { className: "w-10 h-10 mx-auto mb-2 rounded-full bg-white/[0.04] flex items-center justify-center"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
                , React.createElement(Building2, { className: "w-5 h-5 text-muted-foreground/40"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}} )
              )
              , React.createElement('p', { className: "text-xs text-muted-foreground/70 mb-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}, "Link Bank Account to Withdraw"    )
              , React.createElement('p', { className: "text-[10px] text-muted-foreground/40 mb-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}, "Add your bank details to start withdrawing earnings"       )
              , React.createElement(Button, {
                onClick: () => setCurrentView("profile"),
                variant: "outline",
                className: "border-orbit-cyan/30 text-orbit-cyan hover:bg-orbit-cyan/10 text-xs h-8"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}

                , React.createElement(Settings, { className: "w-3 h-3 mr-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}} ), " Go to Settings"
              )
            )
          ) : (
            React.createElement('div', { className: "space-y-2.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
              /* Bank Info */
              , React.createElement('div', { className: "flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.03] border border-orbit-border/20"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}
                , React.createElement(Building2, { className: "w-4 h-4 text-orbit-cyan/70 shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}} )
                , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}}
                  , React.createElement('p', { className: "text-xs font-medium text-foreground truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}, maskedAccount)
                  , React.createElement('p', { className: "text-[9px] text-muted-foreground/50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}, bankAccount.accountHolderName)
                )
                , bankAccount.isVerified && (
                  React.createElement(Badge, { variant: "outline", className: "border-green-500/20 text-green-400 text-[8px] shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
                    , React.createElement(CircleCheckBig, { className: "w-2.5 h-2.5 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}} ), " Verified"
                  )
                )
              )

              /* Withdraw Input */
              , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 203}}
                , React.createElement('div', { className: "relative flex-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}
                  , React.createElement(IndianRupee, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}} )
                  , React.createElement('input', {
                    type: "number",
                    value: withdrawAmount,
                    onChange: (e) => setWithdrawAmount(e.target.value),
                    placeholder: `${MIN_WITHDRAWAL}`,
                    min: MIN_WITHDRAWAL,
                    max: wallet.balance,
                    className: "w-full h-9 pl-8 pr-2 rounded-lg bg-white/[0.05] border border-orbit-border/30 text-foreground text-sm font-medium placeholder:text-muted-foreground/30 focus:outline-none focus:border-orbit-cyan/40 focus:ring-1 focus:ring-orbit-cyan/20 transition-colors"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}
                  )
                )
                , React.createElement(Button, {
                  onClick: handleWithdraw,
                  disabled: isWithdrawing || !withdrawAmount || wallet.balance < MIN_WITHDRAWAL,
                  className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 font-bold h-9 text-xs px-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}

                  , isWithdrawing ? (
                    React.createElement('span', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}
                      , React.createElement('span', { className: "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}} ), "Processing"

                    )
                  ) : (
                    React.createElement(React.Fragment, null
                      , React.createElement(ArrowDownToLine, { className: "w-3.5 h-3.5 mr-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}} ), " Withdraw"
                    )
                  )
                )
              )

              , wallet.balance < MIN_WITHDRAWAL && wallet.balance > 0 && (
                React.createElement('div', { className: "flex items-start gap-1.5 px-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}
                  , React.createElement(AlertCircle, { className: "w-3 h-3 text-amber-400 shrink-0 mt-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}} )
                  , React.createElement('p', { className: "text-[10px] text-amber-400/80" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}, "Minimum withdrawal is "   , formatCurrency(MIN_WITHDRAWAL), ". You need "   , formatCurrency(MIN_WITHDRAWAL - wallet.balance), " more." )
                )
              )
              , wallet.balance === 0 && (
                React.createElement('p', { className: "text-[10px] text-muted-foreground/40 text-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}, "No balance available for withdrawal"    )
              )
            )
          )
        )
      )

      /* Hero Earnings Card - Compact */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}
        , React.createElement('div', { className: "relative overflow-hidden rounded-xl border border-orbit-border/50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}
          , React.createElement('div', { className: "absolute inset-0 bg-gradient-to-br from-green-500/[0.08] via-transparent to-orbit-purple/[0.05]"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}} )

          , React.createElement('div', { className: "relative p-3 sm:p-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}
            , React.createElement('div', { className: "flex items-center justify-between mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}
                , React.createElement('div', { className: "w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}
                  , React.createElement(Wallet, { className: "w-4 h-4 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}} )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 259}}
                  , React.createElement('h3', { className: "text-xs font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}, "Earnings")
                  , React.createElement('p', { className: "text-[9px] text-muted-foreground/70" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}, "Income summary" )
                )
              )
              , completedBookings.length > 0 && (
                React.createElement(Badge, { variant: "outline", className: "border-green-500/20 text-green-400 text-[9px] gap-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}}
                  , React.createElement(TrendingUp, { className: "w-2.5 h-2.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}} )
                  , completedBookings.length, " done"
                )
              )
            )

            /* Total Earned */
            , React.createElement('div', { className: "text-center mb-3 pb-3 border-b border-white/[0.06]"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}
              , React.createElement('p', { className: "text-[9px] text-muted-foreground/60 uppercase tracking-widest mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}, "Total Earned"

              )
              , React.createElement('div', { className: "flex items-center justify-center gap-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}
                , React.createElement(IndianRupee, { className: "w-4 h-4 sm:w-5 sm:h-5 text-green-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}} )
                , React.createElement('span', { className: "text-xl sm:text-3xl font-black text-foreground tracking-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 279}}
                  , totalEarned.toLocaleString("en-IN")
                )
              )
              , weeklyEarnings > 0 && (
                React.createElement('div', { className: "flex items-center justify-center gap-1 mt-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
                  , React.createElement(ArrowUpRight, { className: "w-2.5 h-2.5 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}} )
                  , React.createElement('span', { className: "text-[10px] text-green-400 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}, "+"
                    , formatCurrency(weeklyEarnings), " this week"
                  )
                )
              )
            )

            /* Monthly + Weekly row */
            , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}
              , React.createElement('div', { className: "rounded-lg bg-orbit-purple/[0.08] border border-orbit-purple/10 p-2.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}
                , React.createElement('div', { className: "flex items-center gap-1.5 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}
                  , React.createElement(CreditCard, { className: "w-3 h-3 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}} )
                  , React.createElement('span', { className: "text-[9px] text-muted-foreground/60 uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}, "Month")
                )
                , React.createElement('div', { className: "text-lg sm:text-xl font-black text-orbit-purple truncate"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}
                  , formatCurrency(monthlyEarnings)
                )
              )
              , React.createElement('div', { className: "rounded-lg bg-orbit-cyan/[0.08] border border-orbit-cyan/10 p-2.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
                , React.createElement('div', { className: "flex items-center gap-1.5 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}
                  , React.createElement(Timer, { className: "w-3 h-3 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}} )
                  , React.createElement('span', { className: "text-[9px] text-muted-foreground/60 uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}, "Week")
                )
                , React.createElement('div', { className: "text-lg sm:text-xl font-black text-orbit-cyan truncate"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}
                  , formatCurrency(weeklyEarnings)
                )
              )
            )
          )
        )
      )

      /* Stats Grid - Compact */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}
        , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}
          , React.createElement('div', { className: "orbit-card rounded-xl p-3 border border-orbit-border/30"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}
            , React.createElement('div', { className: "flex items-center gap-1.5 mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}
              , React.createElement('div', { className: "w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}
                , React.createElement(CircleCheckBig, { className: "w-3 h-3 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 324}} )
              )
              , React.createElement('span', { className: "text-[9px] text-muted-foreground/60 uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}, "Done")
            )
            , React.createElement('div', { className: "text-xl font-black text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}
              , completedBookings.length
            )
          )

          , React.createElement('div', { className: "orbit-card rounded-xl p-3 border border-orbit-border/30"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}
            , React.createElement('div', { className: "flex items-center gap-1.5 mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 334}}
              , React.createElement('div', { className: "w-6 h-6 rounded-md bg-amber-400/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 335}}
                , React.createElement(Star, { className: "w-3 h-3 text-amber-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 336}} )
              )
              , React.createElement('span', { className: "text-[9px] text-muted-foreground/60 uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}, "Rating")
            )
            , React.createElement('div', { className: "text-xl font-black text-amber-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}
              , avgRating
            )
          )

          , React.createElement('div', { className: "orbit-card rounded-xl p-3 border border-orbit-border/30"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}
            , React.createElement('div', { className: "flex items-center gap-1.5 mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}
              , React.createElement('div', { className: "w-6 h-6 rounded-md bg-orbit-cyan/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 347}}
                , React.createElement(Clock, { className: "w-3 h-3 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}} )
              )
              , React.createElement('span', { className: "text-[9px] text-muted-foreground/60 uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 350}}, "Week")
            )
            , React.createElement('div', { className: "text-xl font-black text-orbit-cyan truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}
              , formatCurrency(weeklyEarnings)
            )
          )

          , React.createElement('div', { className: "orbit-card rounded-xl p-3 border border-orbit-border/30"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}
            , React.createElement('div', { className: "flex items-center gap-1.5 mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 358}}
              , React.createElement('div', { className: "w-6 h-6 rounded-md bg-orbit-purple/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 359}}
                , React.createElement(Sparkles, { className: "w-3 h-3 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 360}} )
              )
              , React.createElement('span', { className: "text-[9px] text-muted-foreground/60 uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 362}}, "Avg")
            )
            , React.createElement('div', { className: "text-xl font-black text-orbit-purple truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 364}}
              , formatCurrency(avgPerProject)
            )
          )
        )
      )

      /* Earnings Breakdown - Compact */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 372}}
        , React.createElement('div', { className: "orbit-card rounded-xl p-3 border border-orbit-border/30"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 373}}
          , React.createElement('h4', { className: "text-[10px] font-bold text-foreground mb-2 uppercase tracking-wider"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}, "Breakdown")
          , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 375}}
            , [
              { label: "Lifetime", amount: totalEarned, color: "text-green-400" },
              { label: "This Month", amount: monthlyEarnings, color: "text-orbit-purple" },
              { label: "This Week", amount: weeklyEarnings, color: "text-orbit-cyan" },
              { label: "Avg/Project", amount: avgPerProject, color: "text-amber-400" },
            ].map((row) => (
              React.createElement('div', { key: row.label, className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 382}}
                , React.createElement('span', { className: "text-[10px] sm:text-xs text-muted-foreground/70"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}, row.label)
                , React.createElement('span', { className: `text-xs sm:text-sm font-bold ${row.color}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 384}}, formatCurrency(row.amount))
              )
            ))
          )
        )
      )
    )
  );
}

// Helper: get ISO week number
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}