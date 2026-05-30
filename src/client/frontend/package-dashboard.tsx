"use client";

/**
 * 🔵 CLIENT FRONTEND | PackageDashboard
 * 
 * Package selection cards with pricing, feature lists, and popular badge.
 * Clicking a card opens a detail overlay. From the detail view,
 * the user can proceed to the booking flow.
 * 
 * When coming from "Brand DNA", the UGC package is auto-highlighted
 * and its detail view opens automatically.
 * 
 * Used by: client-app.tsx
 * Category: Client UI
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Zap, Star, Rocket, Shield, Lock, CheckCircle2, ArrowRight,
  X, Sparkles, Palette, MessageSquare, Film, Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/constants";

// ─── Brand DNA Feature List (shown only in UGC detail) ──────────────────────
const BRAND_DNA_FEATURES = [
  {
    icon: <Palette className="w-4 h-4 text-orbit-purple" />,
    title: "Brand Color & Font",
    desc: "Match your brand identity with custom colors and typography.",
  },
  {
    icon: <MessageSquare className="w-4 h-4 text-orbit-purple" />,
    title: "Editor Chat",
    desc: "Real-time chat with editors to describe your exact vision.",
  },
  {
    icon: <Sparkles className="w-4 h-4 text-orbit-purple" />,
    title: "Logo Integration",
    desc: "Upload your brand logo for seamless video integration.",
  },
  {
    icon: <Film className="w-4 h-4 text-orbit-purple" />,
    title: "Multi-Platform Export",
    desc: "Optimized for Instagram, TikTok, YouTube Shorts & more.",
  },
];

export function PackageDashboard() {
  const { packages, setSelectedPackage, setCurrentView, selectedPackage, highlightedPackageId, setHighlightedPackageId } = useAppStore();

  // Determine the initial detail package: Brand DNA highlight takes priority, then any pre-selected package
  const initialDetailPkg = highlightedPackageId ?? selectedPackage?.id ?? null;

  const [detailPkg, setDetailPkg] = useState<string | null>(initialDetailPkg);

  // Clear the highlight once it's been consumed (so it doesn't re-trigger on revisit)
  useEffect(() => {
    if (highlightedPackageId) {
      setHighlightedPackageId(null);
    }
  }, [highlightedPackageId, setHighlightedPackageId]);

  const selectedDetail = packages.find((p) => p.id === detailPkg) ?? null;
  const isUGC = selectedDetail?.tier === "PROFESSIONAL";

  const handleBookNow = (pkg: typeof selectedDetail) => {
    if (!pkg) return;
    setSelectedPackage(pkg);
    setDetailPkg(null);
    setCurrentView("booking");
  };

  return (
    <section className="pt-2 sm:pt-4 pb-8 sm:pb-12 px-0 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Badge variant="outline" className="mb-4 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Choose Your Package
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-3">
            The Orbit <span className="text-gradient-orbit">Edge</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Select the package that fits your needs. Both include professional editing delivered in 60-120 minutes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {packages.map((pkg, idx) => {
            const isHighlighted = pkg.id === highlightedPackageId;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="h-full"
              >
                <Card
                  className={`relative overflow-hidden orbit-card transition-all duration-300 hover:scale-[1.02] cursor-pointer group h-full flex flex-col ${
                    pkg.popular
                      ? "border-orbit-cyan/30 hover:border-orbit-cyan/60 orbit-glow"
                      : isHighlighted
                      ? "border-amber-400/50 hover:border-amber-400/70 shadow-[0_0_24px_rgba(245,158,11,0.15)]"
                      : "border-orbit-border hover:border-orbit-cyan/20"
                  }`}
                  onClick={() => setDetailPkg(pkg.id)}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  {isHighlighted && !pkg.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                        BRAND DNA
                      </div>
                    </div>
                  )}

                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                        pkg.popular ? "bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 text-orbit-cyan" : "bg-white/5 text-muted-foreground"
                      }`}>
                        {pkg.popular ? <Rocket className="w-4 h-4 sm:w-5 sm:h-5" /> : <Star className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg sm:text-xl font-bold">{pkg.name}</CardTitle>
                        <CardDescription className="text-xs">{pkg.focus}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-gradient-orbit">{formatCurrency(pkg.price)}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground">/session</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 text-orbit-cyan" />
                        Delivery in {pkg.deliveryTime}
                      </div>
                    </div>
                    <Separator className="bg-orbit-border" />
                    <ul className="space-y-2 sm:space-y-2.5">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-orbit-cyan shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-4 sm:p-6 mt-auto">
                    <Button
                      className={`w-full font-bold py-4 sm:py-5 text-sm sm:text-base transition-all ${
                        pkg.popular
                          ? "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 orbit-glow"
                          : "bg-white/10 text-foreground hover:bg-white/15 border border-orbit-border"
                      }`}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {[
            { icon: <Shield className="w-4 h-4 text-orbit-cyan" />, label: "Secure Payment" },
            { icon: <Lock className="w-4 h-4 text-orbit-cyan" />, label: "Privacy Protected" },
            { icon: <Clock className="w-4 h-4 text-orbit-cyan" />, label: "60-Min Guarantee" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2">{t.icon}{t.label}</div>
          ))}
        </motion.div>
      </div>

      {/* ─── Package Detail Overlay ──────────────────────────────────── */}
      <AnimatePresence>
        {selectedDetail && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDetailPkg(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Detail Sheet */}
            <motion.div
              className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border-t sm:border border-orbit-border sm:rounded-2xl rounded-t-2xl shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,191,255,0.15) transparent" }}
            >
              {/* Handle bar (mobile) */}
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Close button */}
              <button
                onClick={() => setDetailPkg(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-5 sm:p-7 space-y-5">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedDetail.popular
                      ? "bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 text-orbit-cyan"
                      : "bg-white/5 text-muted-foreground"
                  }`}>
                    {selectedDetail.popular ? <Rocket className="w-6 h-6" /> : <Star className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black">{selectedDetail.name}</h3>
                      {selectedDetail.popular && (
                        <Badge className="bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white text-[9px] font-bold px-2 py-0.5">
                          POPULAR
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{selectedDetail.focus}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gradient-orbit">{formatCurrency(selectedDetail.price)}</span>
                  <span className="text-sm text-muted-foreground">/session</span>
                  <div className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-orbit-cyan" />
                    {selectedDetail.deliveryTime}
                  </div>
                </div>

                <Separator className="bg-orbit-border" />

                {/* ─── Brand DNA Section (UGC only) ────────────────────── */}
                {isUGC && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold text-amber-400">Brand DNA Included</span>
                      <Badge variant="outline" className="text-[9px] border-orbit-purple/30 text-orbit-purple">PRO</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Customize your brand identity — logo, fonts, colors, and chat directly with editors to craft the perfect brand video.
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {BRAND_DNA_FEATURES.map((f, i) => (
                        <div
                          key={i}
                          className="orbit-card rounded-xl p-3 border border-orbit-purple/10 hover:border-orbit-purple/20 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {f.icon}
                            <span className="text-xs font-semibold text-foreground">{f.title}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orbit-cyan" />
                    What&apos;s Included
                  </h4>
                  <ul className="space-y-2">
                    {selectedDetail.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-orbit-cyan shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sample Preview */}
                <div className="orbit-card rounded-xl overflow-hidden">
                  <div className="relative aspect-video bg-gradient-to-br from-orbit-cyan/10 via-orbit-purple/10 to-orbit-cyan/5 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                        <Play className="w-6 h-6 text-orbit-cyan ml-1" />
                      </div>
                      <p className="text-xs text-muted-foreground">Sample {selectedDetail.name} Edit</p>
                    </div>
                    {/* Decorative gradient overlay */}
                    <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={() => handleBookNow(selectedDetail)}
                  className={`w-full font-bold py-5 text-base transition-all ${
                    selectedDetail.popular
                      ? "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 orbit-glow"
                      : "bg-white/10 text-foreground hover:bg-white/15 border border-orbit-border"
                  }`}
                >
                  {isUGC ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Book with Brand DNA
                    </>
                  ) : (
                    <>
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-[10px] text-muted-foreground/50 text-center">
                  Secure payment · Cancel anytime before shooting begins
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
