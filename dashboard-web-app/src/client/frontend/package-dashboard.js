const _jsxFileName = "src\\client\\frontend\\package-dashboard.tsx";"use client";

/**
 * 🔵 CLIENT FRONTEND | PackageDashboard
 * 
 * Package selection cards with pricing, feature lists, and popular badge.
 * Clicking a card directly selects the package and routes the user to the booking flow.
 * 
 * When coming from "Brand DNA", the UGC package is auto-selected and redirects to the booking flow immediately.
 * 
 * Used by: client-app.tsx
 * Category: Client UI
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock, Zap, Star, Rocket, Shield, Lock, CheckCircle2, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/constants";


export function PackageDashboard() {
  const { packages, setSelectedPackage, setCurrentView, highlightedPackageId, setHighlightedPackageId } = useAppStore();

  // Consumes highlighed package ID from Brand DNA redirect and routes directly to Booking
  useEffect(() => {
    if (highlightedPackageId) {
      const targetPkg = packages.find((p) => p.id === highlightedPackageId);
      if (targetPkg) {
        setSelectedPackage(targetPkg);
        setCurrentView("booking");
      }
      setHighlightedPackageId(null);
    }
  }, [highlightedPackageId, packages, setSelectedPackage, setCurrentView, setHighlightedPackageId]);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setCurrentView("booking");
  };

  return (
    React.createElement('section', { className: "pt-2 sm:pt-4 pb-8 sm:pb-12 px-0 sm:px-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
      , React.createElement('div', { className: "max-w-6xl mx-auto" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}
        , React.createElement(motion.div, { className: "text-center mb-8 sm:mb-12"  , initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
          , React.createElement(Badge, { variant: "outline", className: "mb-4 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
            , React.createElement(Zap, { className: "w-3.5 h-3.5 mr-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}} ), "Choose Your Package"

          )
          , React.createElement('h2', { className: "text-2xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}, "The Orbit "
              , React.createElement('span', { className: "text-gradient-orbit", __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}, "Edge")
          )
          , React.createElement('p', { className: "text-sm sm:text-base text-muted-foreground max-w-lg mx-auto"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}, "Select the package that fits your needs. Both include professional editing delivered in 60-120 minutes."

          )
        )

        , React.createElement('div', { className: "grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
          , packages.map((pkg, idx) => {
            const isHighlighted = pkg.id === highlightedPackageId;
            return (
              React.createElement(motion.div, {
                key: pkg.id,
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: idx * 0.15 },
                className: "h-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}

                , React.createElement(Card, {
                  className: `relative overflow-hidden orbit-card transition-all duration-300 hover:scale-[1.02] cursor-pointer group h-full flex flex-col ${
                    pkg.popular
                      ? "border-orbit-cyan/30 hover:border-orbit-cyan/60 orbit-glow"
                      : isHighlighted
                      ? "border-amber-400/50 hover:border-amber-400/70 shadow-[0_0_24px_rgba(245,158,11,0.15)]"
                      : "border-orbit-border hover:border-orbit-cyan/20"
                  }`,
                  onClick: () => handleSelectPackage(pkg), __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}

                  , pkg.popular && (
                    React.createElement('div', { className: "absolute top-0 right-0"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}
                      , React.createElement('div', { className: "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}, "MOST POPULAR"

                      )
                    )
                  )

                  , isHighlighted && !pkg.popular && (
                    React.createElement('div', { className: "absolute top-0 right-0"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}
                      , React.createElement('div', { className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}, "BRAND DNA"

                      )
                    )
                  )

                  , React.createElement(CardHeader, { className: "p-4 sm:p-6 pb-2 sm:pb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
                    , React.createElement('div', { className: "flex items-center gap-3 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
                      , React.createElement('div', { className: `w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                        pkg.popular ? "bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 text-orbit-cyan" : "bg-white/5 text-muted-foreground"
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}
                        , pkg.popular ? React.createElement(Rocket, { className: "w-4 h-4 sm:w-5 sm:h-5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}} ) : React.createElement(Star, { className: "w-4 h-4 sm:w-5 sm:h-5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}} )
                      )
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}
                        , React.createElement(CardTitle, { className: "text-lg sm:text-xl font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}, pkg.name)
                        , React.createElement(CardDescription, { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}, pkg.focus)
                      )
                    )
                  )

                  , React.createElement(CardContent, { className: "p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
                      , React.createElement('div', { className: "flex items-baseline gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
                        , React.createElement('span', { className: "text-3xl sm:text-4xl font-black text-gradient-orbit"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}, formatCurrency(pkg.price))
                        , React.createElement('span', { className: "text-xs sm:text-sm text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}, "/session")
                      )
                      , React.createElement('div', { className: "flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
                        , React.createElement(Clock, { className: "w-3.5 h-3.5 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}} ), "Delivery in "
                          , pkg.deliveryTime
                      )
                    )
                    , React.createElement(Separator, { className: "bg-orbit-border", __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}} )
                    , React.createElement('ul', { className: "space-y-2 sm:space-y-2.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
                      , pkg.features.map((feature, i) => (
                        React.createElement('li', { key: i, className: "flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
                          , React.createElement(CheckCircle2, { className: "w-4 h-4 text-orbit-cyan shrink-0 mt-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}} )
                          , React.createElement('span', { className: "text-foreground/80", __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}, feature)
                        )
                      ))
                    )
                  )

                  , React.createElement(CardFooter, { className: "p-4 sm:p-6 mt-auto"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}
                    , React.createElement(Button, {
                      onClick: (e) => {
                        e.stopPropagation();
                        handleSelectPackage(pkg);
                      },
                      className: `w-full font-bold py-4 sm:py-5 text-sm sm:text-base transition-all ${
                        pkg.popular
                          ? "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 orbit-glow"
                          : "bg-white/10 text-foreground hover:bg-white/15 border border-orbit-border"
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}
, "Book Now"

                      , React.createElement(ArrowRight, { className: "w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}} )
                    )
                  )
                )
              )
            );
          })
        )

        , React.createElement(motion.div, { className: "mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground"          , initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.4 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}
          , [
            { icon: React.createElement(Shield, { className: "w-4 h-4 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}} ), label: "Secure Payment" },
            { icon: React.createElement(Lock, { className: "w-4 h-4 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}} ), label: "Privacy Protected" },
            { icon: React.createElement(Clock, { className: "w-4 h-4 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}} ), label: "60-Min Guarantee" },
          ].map((t, i) => (
            React.createElement('div', { key: i, className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}, t.icon, t.label)
          ))
        )
      )
    )
  );
}