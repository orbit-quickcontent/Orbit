"use client";

/**
 * 🔵 CLIENT FRONTEND | ComparisonSection
 * 
 * "Why Orbit Wins" comparison table showing Orbit vs traditional
 * production houses vs AI tools. Responsive desktop table and mobile cards.
 * 
 * Used by: client-app.tsx
 * Category: Client UI
 */

import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ComparisonSection() {
  const comparisons = [
    { feature: "Delivery Time", orbit: "60-120 min", traditional: "2-5 days", ai: "Instant (low quality)" },
    { feature: "Quality", orbit: "4K Professional", traditional: "4K Professional", ai: "720p Automated" },
    { feature: "Human Editors", orbit: "✓", traditional: "✓", ai: "✗" },
    { feature: "Brand Matching", orbit: "✓ DNA System", traditional: "Manual Brief", ai: "✗" },
    { feature: "Privacy", orbit: "Auto-Wipe", traditional: "Manual Delete", ai: "Cloud Stored" },
    { feature: "Price", orbit: "₹1,999–₹4,999", traditional: "₹15,000+", ai: "Free–₹500" },
  ];

  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-14"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            The Content Gap
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Why <span className="text-gradient-orbit">Orbit</span> Wins
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
            We bridge the gap between cheap AI edits and expensive production houses.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="orbit-card rounded-2xl overflow-hidden">
            {/* Desktop table */}
            <div className="hidden sm:grid grid-cols-4 gap-0 text-sm">
              <div className="p-4 border-b border-orbit-border text-xs font-bold text-muted-foreground">Feature</div>
              <div className="p-4 border-b border-orbit-cyan/20 bg-gradient-to-r from-orbit-cyan/5 to-orbit-purple/5 text-center">
                <div className="text-xs font-black text-gradient-orbit">ORBIT</div>
              </div>
              <div className="p-4 border-b border-orbit-border text-center text-xs font-bold text-muted-foreground">Production House</div>
              <div className="p-4 border-b border-orbit-border text-center text-xs font-bold text-muted-foreground">AI Tools</div>
              {comparisons.map((row, idx) => (
                <React.Fragment key={idx}>
                  <div className={`p-3.5 text-xs font-medium text-muted-foreground ${idx < comparisons.length - 1 ? "border-b border-orbit-border" : ""}`}>{row.feature}</div>
                  <div className={`p-3.5 text-center text-xs font-bold text-orbit-cyan bg-gradient-to-r from-orbit-cyan/5 to-orbit-purple/5 ${idx < comparisons.length - 1 ? "border-b border-orbit-border" : ""}`}>{row.orbit}</div>
                  <div className={`p-3.5 text-center text-xs text-muted-foreground ${idx < comparisons.length - 1 ? "border-b border-orbit-border" : ""}`}>{row.traditional}</div>
                  <div className={`p-3.5 text-center text-xs text-muted-foreground/60 ${idx < comparisons.length - 1 ? "border-b border-orbit-border" : ""}`}>{row.ai}</div>
                </React.Fragment>
              ))}
            </div>
            {/* Mobile cards */}
            <div className="sm:hidden space-y-0">
              {comparisons.map((row, idx) => (
                <div key={idx} className={`p-4 ${idx < comparisons.length - 1 ? "border-b border-orbit-border" : ""}`}>
                  <div className="text-xs font-bold text-foreground mb-2">{row.feature}</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-[10px] text-orbit-cyan font-bold mb-1">ORBIT</div>
                      <div className="text-xs font-bold text-orbit-cyan">{row.orbit}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground font-bold mb-1">Traditional</div>
                      <div className="text-xs text-muted-foreground">{row.traditional}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground font-bold mb-1">AI</div>
                      <div className="text-xs text-muted-foreground/60">{row.ai}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
