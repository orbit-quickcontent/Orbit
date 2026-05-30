"use client";

/**
 * 🟣 PARTNER FRONTEND | MapNavigation
 * 
 * SVG map visualization dashboard showing route from partner
 * location to destination. Includes animated route line, pulse
 * location markers, distance/ETA info, and navigation buttons.
 * 
 * Used by: partner-dashboard.tsx
 * Category: Partner UI
 */

import { motion } from "framer-motion";
import { Navigation2, MapPin, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { type BookingInfo } from "@/lib/types";

interface MapNavigationProps {
  booking: BookingInfo;
  onArrived: () => void;
}

export function MapNavigation({ booking, onArrived }: MapNavigationProps) {
  return (
    <div className="orbit-card rounded-2xl p-3 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h3 className="text-base sm:text-lg font-bold flex items-center gap-2"><Navigation2 className="w-4 h-4 sm:w-5 sm:h-5 text-orbit-cyan" />Navigate to Location</h3>
        <Badge variant="outline" className="border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/10 w-fit">{booking.id}</Badge>
      </div>

      {/* Map Visualization */}
      <div className="orbit-card rounded-xl p-0 mb-4 sm:mb-6 border border-orbit-cyan/20 overflow-hidden relative" style={{ minHeight: "260px" }}>
        <svg viewBox="0 0 600 320" className="w-full h-auto" style={{ minHeight: "240px" }}>
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0,191,255,0.06)" strokeWidth="0.5" />
            </pattern>
            <pattern id="gridLarge" width="150" height="150" patternUnits="userSpaceOnUse">
              <path d="M 150 0 L 0 0 0 150" fill="none" stroke="rgba(0,191,255,0.12)" strokeWidth="1" />
            </pattern>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00BFFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#6B5CE7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A020F0" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glowCyan">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glowPurple">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <rect width="600" height="320" fill="#000000" />
          <rect width="600" height="320" fill="url(#grid)" />
          <rect width="600" height="320" fill="url(#gridLarge)" />

          {/* Simulated roads/blocks */}
          <rect x="80" y="60" width="180" height="80" rx="4" fill="rgba(0,191,255,0.04)" stroke="rgba(0,191,255,0.08)" strokeWidth="0.5" />
          <rect x="300" y="140" width="200" height="100" rx="4" fill="rgba(160,32,240,0.04)" stroke="rgba(160,32,240,0.08)" strokeWidth="0.5" />
          <rect x="60" y="200" width="160" height="80" rx="4" fill="rgba(0,191,255,0.03)" stroke="rgba(0,191,255,0.06)" strokeWidth="0.5" />
          <rect x="380" y="40" width="140" height="70" rx="4" fill="rgba(160,32,240,0.03)" stroke="rgba(160,32,240,0.06)" strokeWidth="0.5" />

          {/* Route line (animated dashed) */}
          <motion.path
            d="M 120 260 C 180 240, 220 200, 280 180 C 340 160, 380 140, 460 100"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="12 8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          {/* Animated dash offset */}
          <motion.path
            d="M 120 260 C 180 240, 220 200, 280 180 C 340 160, 380 140, 460 100"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="12 8"
            animate={{ strokeDashoffset: [0, -40] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            opacity={0.5}
          />

          {/* Partner current location (animated pulse) */}
          <motion.circle cx="120" cy="260" r="18" fill="rgba(0,191,255,0.1)" animate={{ r: [18, 28, 18] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle cx="120" cy="260" r="10" fill="rgba(0,191,255,0.15)" animate={{ r: [10, 16, 10] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          <circle cx="120" cy="260" r="6" fill="#00BFFF" filter="url(#glowCyan)" />
          <circle cx="120" cy="260" r="3" fill="white" />
          {/* Partner label */}
          <text x="120" y="290" textAnchor="middle" fill="#00BFFF" fontSize="11" fontWeight="bold" fontFamily="system-ui">You</text>

          {/* Destination location */}
          <motion.circle cx="460" cy="100" r="18" fill="rgba(160,32,240,0.1)" animate={{ r: [18, 28, 18] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle cx="460" cy="100" r="10" fill="rgba(160,32,240,0.15)" animate={{ r: [10, 16, 10] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
          <circle cx="460" cy="100" r="6" fill="#A020F0" filter="url(#glowPurple)" />
          <circle cx="460" cy="100" r="3" fill="white" />
          {/* Destination label */}
          <text x="460" y="80" textAnchor="middle" fill="#A020F0" fontSize="11" fontWeight="bold" fontFamily="system-ui">Destination</text>

          {/* Location pin icon at destination */}
          <circle cx="460" cy="72" r="3" fill="#A020F0" />
        </svg>

        {/* Overlay info on map */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="orbit-card-strong rounded-lg px-3 py-2 text-xs flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orbit-cyan animate-pulse" />
            <span className="text-orbit-cyan font-medium">Live Tracking</span>
          </div>
          <div className="orbit-card-strong rounded-lg px-3 py-2 text-xs text-muted-foreground flex items-center gap-1">
            <Route className="w-3 h-3 text-orbit-purple" />
            <span className="text-orbit-purple font-medium">Optimized Route</span>
          </div>
        </div>
      </div>

      {/* Distance & ETA Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="orbit-card rounded-xl p-3 text-center border border-orbit-cyan/20">
          <div className="text-xs text-muted-foreground mb-1">Distance</div>
          <div className="text-lg font-black text-gradient-orbit">8.4 km</div>
        </div>
        <div className="orbit-card rounded-xl p-3 text-center border border-orbit-cyan/20">
          <div className="text-xs text-muted-foreground mb-1">ETA</div>
          <div className="text-lg font-black text-gradient-orbit">22 min</div>
        </div>
        <div className="orbit-card rounded-xl p-3 text-center border border-orbit-cyan/20">
          <div className="text-xs text-muted-foreground mb-1">Location</div>
          <div className="text-sm font-bold text-foreground truncate">{booking.location}</div>
        </div>
        <div className="orbit-card rounded-xl p-3 text-center border border-orbit-cyan/20">
          <div className="text-xs text-muted-foreground mb-1">Time Slot</div>
          <div className="text-sm font-bold text-foreground">{booking.timeSlot}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => toast.success("Navigation started!", { description: "Follow the route to the shoot location" })} className="flex-1 bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold orbit-glow">
          <Navigation2 className="w-4 h-4 mr-2" />Navigate
        </Button>
        <Button onClick={onArrived} className="flex-1 border border-green-500/30 text-green-400 hover:bg-green-500/10 font-bold bg-green-500/5">
          <MapPin className="w-4 h-4 mr-2" />Arrived at Location
        </Button>
      </div>
    </div>
  );
}
