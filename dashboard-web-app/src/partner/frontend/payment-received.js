const _jsxFileName = "src\\partner\\frontend\\payment-received.tsx";"use client";

/**
 * 🟣 PARTNER FRONTEND | PaymentReceived
 *
 * Payment confirmation screen showing amount credited, booking details,
 * updated earnings summary (from real booking data), and complete & return action.
 *
 * Used by: partner-dashboard.tsx
 * Category: Partner UI
 */

import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Wallet, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

import { formatCurrency } from "@/lib/constants";
import { useAppStore } from "@/lib/store";






export function PaymentReceived({ booking, onCompleteAndReturn }) {
  const { bookings } = useAppStore();

  // Calculate real earnings from delivered bookings
  const deliveredBookings = bookings.filter((b) => b.status === "DELIVERED");
  const totalEarned = deliveredBookings.length * 700;

  // Calculate monthly earnings from delivered bookings this month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyEarnings = deliveredBookings
    .filter((b) => {
      const d = new Date(b.bookingDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length * 700;

  const totalCompleted = deliveredBookings.length;

  return (
    React.createElement('div', { className: "orbit-card rounded-2xl p-4 sm:p-8 md:p-10 text-center orbit-glow"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}
      , React.createElement(motion.div, {
        className: "w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 flex items-center justify-center border-2 border-orbit-cyan/30"               ,
        initial: { scale: 0 },
        animate: { scale: 1 },
        transition: { type: "spring", duration: 0.8 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}

        , React.createElement(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: 0.3, type: "spring" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
          , React.createElement(CreditCard, { className: "w-8 h-8 sm:w-10 sm:h-10 text-orbit-cyan"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}} )
        )
      )
      , React.createElement(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
        , React.createElement('h3', { className: "text-xl sm:text-2xl font-black mb-2 sm:mb-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
          , React.createElement('span', { className: "text-orbit-cyan", __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}, "Payment"), " Received!"
        )
        , React.createElement('div', { className: "flex items-center justify-center gap-2 mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
          , React.createElement(CheckCircle2, { className: "w-5 h-5 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}} )
          , React.createElement('span', { className: "text-sm font-medium text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}, "Credited to your account"   )
        )
        , React.createElement('p', { className: "text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto text-xs sm:text-sm leading-relaxed"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}, "Payment for this project has been processed and credited to your Orbit Partner wallet."

        )

        /* Amount Credited Card */
        , React.createElement('div', { className: "orbit-card rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 max-w-sm mx-auto border border-orbit-cyan/20"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
          , React.createElement('div', { className: "text-center mb-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
            , React.createElement('span', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}, "Amount Credited" )
            , React.createElement('div', { className: "text-2xl sm:text-3xl font-black text-gradient-orbit mt-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}
              , formatCurrency(700)
            )
          )
          , React.createElement('div', { className: "grid grid-cols-2 gap-3 text-xs"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
            , [
              { label: "Booking ID", value: booking.id },
              { label: "Package", value: booking.packageName },
              { label: "Payment Status", value: "Credited" },
              { label: "Method", value: "Orbit Wallet" },
            ].map((d) => (
              React.createElement('div', { key: d.label, __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
                , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}, d.label)
                , React.createElement('div', { className: `font-bold ${d.value === "Credited" ? "text-green-400" : "text-foreground"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
                  , d.value
                )
              )
            ))
          )
        )

        /* Updated Earnings Summary */
        , React.createElement('div', { className: "orbit-card rounded-xl p-4 mb-8 max-w-sm mx-auto border border-orbit-border"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}
          , React.createElement('div', { className: "text-xs text-muted-foreground mb-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}, "Updated Earnings" )
          , React.createElement('div', { className: "space-y-2.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
                , React.createElement(Wallet, { className: "w-3.5 h-3.5 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}} )
                , React.createElement('span', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}, "Total Earned" )
              )
              , React.createElement('span', { className: "text-lg font-black text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
                , formatCurrency(totalEarned + 700)
              )
            )
            , React.createElement('div', { className: "h-px bg-orbit-border/30" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}} )
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}
                , React.createElement(TrendingUp, { className: "w-3.5 h-3.5 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}} )
                , React.createElement('span', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}, "This Month" )
              )
              , React.createElement('span', { className: "text-lg font-black text-gradient-orbit"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}
                , formatCurrency(monthlyEarnings + 700)
              )
            )
            , React.createElement('div', { className: "h-px bg-orbit-border/30" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}} )
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
                , React.createElement(CheckCircle2, { className: "w-3.5 h-3.5 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}} )
                , React.createElement('span', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}, "Total Completed" )
              )
              , React.createElement('span', { className: "text-lg font-black text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, totalCompleted + 1)
            )
          )
        )

        , React.createElement(Button, {
          onClick: onCompleteAndReturn,
          className: "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold orbit-glow px-8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}

          , React.createElement(CheckCircle2, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}} ), "Complete & Return"

        )
      )
    )
  );
}