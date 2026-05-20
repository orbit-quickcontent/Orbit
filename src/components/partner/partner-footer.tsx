"use client";

/**
 * 🟣 PARTNER FRONTEND | PartnerFooter
 * 
 * Simple footer with Orbit logo, PARTNER badge, tagline, and copyright.
 * Sticks to bottom of the viewport via mt-auto in partner-app.tsx.
 * 
 * Used by: partner-app.tsx
 * Category: Partner UI
 */

import { Badge } from "@/components/ui/badge";

export function PartnerFooter() {
  return (
    <footer className="border-t border-orbit-border py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orbit-purple to-orbit-cyan" />
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-orbit-purple/20 to-orbit-cyan/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-orbit-purple to-orbit-cyan" />
            </div>
          </div>
          <span className="text-sm font-bold text-gradient-orbit">ORBIT</span>
          <Badge variant="outline" className="text-[10px] border-orbit-purple/30 text-orbit-purple">PARTNER</Badge>
        </div>
        <div className="text-xs text-muted-foreground">Visual Architect Hub</div>
        <div className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Orbit. All rights reserved.</div>
      </div>
    </footer>
  );
}
