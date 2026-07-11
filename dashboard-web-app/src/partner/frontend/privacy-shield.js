const _jsxFileName = "src\\partner\\frontend\\privacy-shield.tsx";"use client";

/**
 * 🟣 PARTNER FRONTEND | PrivacyShield
 * 
 * Privacy verification completion screen. Displays sync verification
 * status, local wipe confirmation, cloud status, and encryption info.
 * Provides "View Payment" action to proceed.
 * 
 * Used by: partner-dashboard.tsx
 * Category: Partner UI
 */

import { motion } from "framer-motion";
import { Shield, CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";






export function PrivacyShield({ syncFiles, onViewPayment }) {
  return (
    React.createElement('div', { className: "orbit-card rounded-2xl p-4 sm:p-8 md:p-10 text-center orbit-glow"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}
      , React.createElement(motion.div, { className: "w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500/30"             , initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: "spring", duration: 0.8 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}
        , React.createElement(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: 0.3, type: "spring" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}
          , React.createElement(Shield, { className: "w-8 h-8 sm:w-10 sm:h-10 text-green-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}} )
        )
      )
      , React.createElement(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}
        , React.createElement('h3', { className: "text-xl sm:text-2xl font-black mb-2 sm:mb-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}, React.createElement('span', { className: "text-green-400", __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}, "Privacy Shield" ), " Activated" )
        , React.createElement('div', { className: "flex items-center justify-center gap-2 mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}, React.createElement(CheckCircle2, { className: "w-5 h-5 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}} ), React.createElement('span', { className: "text-sm font-medium text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}, "100% Synced & Verified"   ))
        , React.createElement('p', { className: "text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto text-xs sm:text-sm leading-relaxed"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}, "All local footage has been securely wiped from your device. The raw footage is now safely on the Open Cloud Server."                    )
        , React.createElement('div', { className: "orbit-card rounded-xl p-4 mb-8 max-w-sm mx-auto border border-green-500/20"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}
          , React.createElement('div', { className: "grid grid-cols-2 gap-3 text-xs"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}
            , [
              { label: "Files Synced", value: String(syncFiles.length) },
              { label: "Local Wipe", value: "Complete" },
              { label: "Cloud Status", value: "Verified" },
              { label: "Encryption", value: "AES-256" },
            ].map((d) => (
              React.createElement('div', { key: d.label, __self: this, __source: {fileName: _jsxFileName, lineNumber: 43}}
                , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}, d.label)
                , React.createElement('div', { className: `font-bold ${d.value === "Complete" || d.value === "Verified" ? "text-green-400" : "text-foreground"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}, d.value)
              )
            ))
          )
        )
        , React.createElement(Button, { onClick: onViewPayment, className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 font-bold orbit-glow px-8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}
          , React.createElement(CreditCard, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}} ), "View Payment"
        )
      )
    )
  );
}