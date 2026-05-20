"use client";

/**
 * 🔵 CLIENT FRONTEND | ClientFooter
 * 
 * Simple footer with Orbit logo, tagline, and copyright notice.
 * Sticks to the bottom of the viewport via mt-auto in client-app.tsx.
 * 
 * Used by: client-app.tsx
 * Category: Client UI
 */

export function ClientFooter() {
  return (
    <footer className="border-t border-orbit-border py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orbit-cyan to-orbit-purple" />
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-orbit-cyan/20 to-orbit-purple/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-orbit-cyan to-orbit-purple" />
            </div>
          </div>
          <span className="text-sm font-bold text-gradient-orbit">ORBIT</span>
        </div>
        <div className="text-xs text-muted-foreground">Professional Cinema. Delivered in 60 Minutes.</div>
        <div className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Orbit. All rights reserved.</div>
      </div>
    </footer>
  );
}
