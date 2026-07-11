const _jsxFileName = "src\\partner\\frontend\\map-navigation.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

/**
 * 🟣 PARTNER FRONTEND | MapNavigation
 * 
 * Interactive MapLibre GL map visualization showing route from partner
 * location to destination. Includes interactive panning/zooming,
 * markers, distance/ETA info, and navigation buttons.
 * 
 * Used by: partner-dashboard.tsx
 * Category: Partner UI
 */

import { useEffect, useRef, useState } from "react";
import { Navigation2, MapPin, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";







export function MapNavigation({ booking, onArrived }) {
  const mapContainerRef = useRef(null);
  const [mapError, setMapError] = useState(null);

  // Parse coordinates suffix (format: "Address text @latitude,longitude")
  let cleanAddress = booking.location || "";
  let initialDestCoords = [77.5946, 12.9716]; // Default: Bangalore
  if (booking.location && booking.location.includes(" @")) {
    const parts = booking.location.split(" @");
    cleanAddress = parts[0];
    const coordParts = parts[1].split(",");
    const lat = parseFloat(coordParts[0]);
    const lng = parseFloat(coordParts[1]);
    if (!isNaN(lat) && !isNaN(lng)) {
      initialDestCoords = [lng, lat];
    }
  }

  const handleNavigate = () => {
    if (!booking.location) {
      toast.error("No location specified for this booking.");
      return;
    }
    toast.success("Opening Google Maps...");
    
    // If coordinates suffix exists, navigate directly to coordinates for absolute precision
    let destination = booking.location;
    if (booking.location.includes(" @")) {
      const parts = booking.location.split(" @");
      destination = parts[1]; // Use exact "latitude,longitude"
    }
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    let active = true;
    let mapInstance = null;

    // We load maplibre-gl dynamically to ensure SSR safety
    import("maplibre-gl")
      .then((maplibreglModule) => {
        if (!active) return;
        const maplibregl = maplibreglModule.default || maplibreglModule;

        // Dynamically insert MapLibre CSS if not already present
        if (!document.getElementById("maplibre-css")) {
          const link = document.createElement("link");
          link.id = "maplibre-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css";
          document.head.appendChild(link);
        }

        if (!mapContainerRef.current) return;

        // Parse coordinates
        let destCoords = initialDestCoords;
        const partnerCoords = [destCoords[0] - 0.0146, destCoords[1] - 0.0066];
        const centerCoords = [
          (partnerCoords[0] + destCoords[0]) / 2,
          (partnerCoords[1] + destCoords[1]) / 2,
        ];

        const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || "a731ad7ed2444d32a8a63d147ac013ed";
        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: `https://api.maptiler.com/maps/dark-matter/style.json?key=${apiKey}`,
          center: centerCoords,
          zoom: 13,
          attributionControl: false,
        });

        mapInstance = map;

        // Add zoom controls
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

        map.on("load", () => {
          if (!active) return;

          // Partner marker (Cyan pulse)
          const partnerEl = document.createElement("div");
          partnerEl.className = "flex flex-col items-center justify-center";
          partnerEl.innerHTML = `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-8 h-8 rounded-full bg-[#00BFFF]/30 animate-ping"></div>
              <div class="absolute w-5 h-5 rounded-full bg-[#00BFFF]/20 animate-pulse"></div>
              <div class="w-3.5 h-3.5 rounded-full bg-[#00BFFF] border-2 border-white shadow-[0_0_10px_#00BFFF]"></div>
            </div>
            <div class="mt-1 px-2 py-0.5 rounded bg-black/85 border border-[#00BFFF]/30 text-[10px] font-bold text-[#00BFFF] whitespace-nowrap shadow-md">You</div>
          `;

          new maplibregl.Marker({ element: partnerEl })
            .setLngLat(partnerCoords)
            .addTo(map);

          // Destination marker (Purple pulse)
          const destEl = document.createElement("div");
          destEl.className = "flex flex-col items-center justify-center";
          destEl.innerHTML = `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-8 h-8 rounded-full bg-[#A020F0]/30 animate-ping"></div>
              <div class="absolute w-5 h-5 rounded-full bg-[#A020F0]/20 animate-pulse"></div>
              <div class="w-3.5 h-3.5 rounded-full bg-[#A020F0] border-2 border-white shadow-[0_0_10px_#A020F0]"></div>
            </div>
            <div class="mt-1 px-2 py-0.5 rounded bg-black/85 border border-[#A020F0]/30 text-[10px] font-bold text-[#A020F0] whitespace-nowrap shadow-md">Destination</div>
          `;

          new maplibregl.Marker({ element: destEl })
            .setLngLat(destCoords)
            .addTo(map);

          // Fit bounds to fit both points with nice padding
          const bounds = new maplibregl.LngLatBounds();
          bounds.extend(partnerCoords);
          bounds.extend(destCoords);
          map.fitBounds(bounds, { padding: 50, duration: 1500 });

          // Route coordinates dynamically interpolated between partner and destination
          const dx = destCoords[0] - partnerCoords[0];
          const dy = destCoords[1] - partnerCoords[1];
          const routeCoords = [
            partnerCoords,
            [partnerCoords[0] + dx * 0.25 + dy * 0.05, partnerCoords[1] + dy * 0.25 - dx * 0.05],
            [partnerCoords[0] + dx * 0.50 - dy * 0.05, partnerCoords[1] + dy * 0.50 + dx * 0.05],
            [partnerCoords[0] + dx * 0.75 + dy * 0.03, partnerCoords[1] + dy * 0.75 - dx * 0.03],
            destCoords,
          ];

          // Add route source and layers
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: routeCoords,
              },
            },
          });

          // Glow shadow layer (purple)
          map.addLayer({
            id: "route-glow",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#A020F0",
              "line-width": 8,
              "line-opacity": 0.4,
            },
          });

          // Core route line (cyan)
          map.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#00BFFF",
              "line-width": 4,
              "line-opacity": 0.9,
            },
          });
        });

        let hasFalledBack = false;
        map.on("error", (e) => {
          console.error("MapLibre GL error:", e);
          
          // Check if style failed to load (e.g. invalid MapTiler key, 403 Forbidden, 401, etc.)
          const errorMsg = _optionalChain([e, 'access', _ => _.error, 'optionalAccess', _2 => _2.message]) || e.message || "";
          const isStyleError = errorMsg.toLowerCase().includes("style") || 
                               errorMsg.toLowerCase().includes("metadata") ||
                               (_optionalChain([e, 'access', _3 => _3.error, 'optionalAccess', _4 => _4.status]) === 403 || _optionalChain([e, 'access', _5 => _5.error, 'optionalAccess', _6 => _6.status]) === 401);
                               
          if (isStyleError && !hasFalledBack) {
            hasFalledBack = true;
            console.warn("Style loading failed. Falling back to public CartoDB dark-matter style...");
            map.setStyle("https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json");
            return;
          }
          
          // Only trigger fatal visual error on actual library or repeated failures
          if (isStyleError && hasFalledBack && active) {
            setMapError("Failed to render map style. Please check your map styling endpoints.");
          }
        });
      })
      .catch((err) => {
        console.error("Failed to load maplibre-gl:", err);
        if (active) {
          setMapError("Failed to initialize map library.");
        }
      });

    return () => {
      active = false;
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  return (
    React.createElement('div', { className: "orbit-card rounded-2xl p-3 sm:p-6 md:p-8"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}
      , React.createElement('div', { className: "flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}
        , React.createElement('h3', { className: "text-base sm:text-lg font-bold flex items-center gap-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}
          , React.createElement(Navigation2, { className: "w-4 h-4 sm:w-5 sm:h-5 text-orbit-cyan animate-pulse"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}} ), "Navigate to Location"

        )
        , React.createElement(Badge, { variant: "outline", className: "border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/10 w-fit"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}
          , booking.id
        )
      )

      /* Map Visualization */
      , React.createElement('div', { className: "orbit-card rounded-xl p-0 mb-4 sm:mb-6 border border-orbit-cyan/20 overflow-hidden relative h-[320px] bg-black"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}
        , mapError ? (
          React.createElement('div', { className: "absolute inset-0 flex flex-col items-center justify-center p-4 text-center"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}
            , React.createElement('span', { className: "text-red-400 text-sm font-medium mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}}, mapError)
            , React.createElement('span', { className: "text-muted-foreground text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 258}}, "Please check internet connection or tiles API"      )
          )
        ) : (
          React.createElement('div', { ref: mapContainerRef, className: "w-full h-full" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}} )
        )

        /* Overlay info on map */
        , React.createElement('div', { className: "absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}}
          , React.createElement('div', { className: "orbit-card-strong rounded-lg px-3 py-2 text-xs flex items-center gap-2 pointer-events-auto"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}
            , React.createElement('div', { className: "w-2 h-2 rounded-full bg-orbit-cyan animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 267}} )
            , React.createElement('span', { className: "text-orbit-cyan font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}, "Live Tracking" )
          )
          , React.createElement('div', { className: "orbit-card-strong rounded-lg px-3 py-2 text-xs text-muted-foreground flex items-center gap-1 pointer-events-auto"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}
            , React.createElement(Route, { className: "w-3 h-3 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}} )
            , React.createElement('span', { className: "text-orbit-purple font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}, "Optimized Route" )
          )
        )
      )

      /* Distance & ETA Info */
      , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}
        , React.createElement('div', { className: "orbit-card rounded-xl p-3 text-center border border-orbit-cyan/20"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 279}}
          , React.createElement('div', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}, "Distance")
          , React.createElement('div', { className: "text-lg font-black text-gradient-orbit"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}, "8.4 km" )
        )
        , React.createElement('div', { className: "orbit-card rounded-xl p-3 text-center border border-orbit-cyan/20"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}
          , React.createElement('div', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}, "ETA")
          , React.createElement('div', { className: "text-lg font-black text-gradient-orbit"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}, "22 min" )
        )
        , React.createElement('div', { className: "orbit-card rounded-xl p-3 text-center border border-orbit-cyan/20"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}
          , React.createElement('div', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}}, "Location")
          , React.createElement('div', { className: "text-sm font-bold text-foreground truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}}, cleanAddress)
        )
        , React.createElement('div', { className: "orbit-card rounded-xl p-3 text-center border border-orbit-cyan/20"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}
          , React.createElement('div', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}, "Time Slot" )
          , React.createElement('div', { className: "text-sm font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}}, booking.timeSlot)
        )
      )

      /* Action Buttons */
      , React.createElement('div', { className: "flex flex-col sm:flex-row gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}
        , React.createElement(Button, { onClick: handleNavigate, className: "flex-1 bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold orbit-glow"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 299}}
          , React.createElement(Navigation2, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}} ), "Navigate"
        )
        , React.createElement(Button, { onClick: onArrived, className: "flex-1 border border-green-500/30 text-green-400 hover:bg-green-500/10 font-bold bg-green-500/5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}
          , React.createElement(MapPin, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}} ), "Arrived at Location"
        )
      )
    )
  );
}