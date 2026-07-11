const _jsxFileName = "src\\partner\\frontend\\shooting-phase.tsx";"use client";

/**
 * 🟣 PARTNER FRONTEND | ShootingPhase
 * 
 * Active shooting interface with Orbit Capture Module status,
 * shot checklist, per-shot file upload, and complete & sync action.
 * 
 * Used by: partner-dashboard.tsx
 * Category: Partner UI
 */

import { Camera, Upload, Play, CheckCircle2, CloudUpload, HardDrive, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import { SHOT_LIST } from "./constants";










export function ShootingPhase({
  booking,
  completedShots,
  setCompletedShots,
  shotUploads,
  handleFileUpload,
  onCompleteShooting,
}) {
  return (
    React.createElement('div', { className: "orbit-card rounded-2xl p-3 sm:p-6 md:p-8 mb-4 sm:mb-6"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}
      , React.createElement('div', { className: "flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}
        , React.createElement('h3', { className: "text-base sm:text-lg font-bold flex items-center gap-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}, React.createElement(Camera, { className: "w-4 h-4 sm:w-5 sm:h-5 text-orbit-cyan"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}} ), "Active Shoot" )
        , React.createElement(Badge, { variant: "outline", className: "border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/10 w-fit"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 43}}, booking.id)
      )

      , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
        , [
          { label: "Location", value: booking.location ? booking.location.split(" @")[0] : "" },
          { label: "Package", value: booking.packageName },
          { label: "Time", value: booking.timeSlot },
          { label: "Notes", value: booking.notes || "None" },
        ].map((d) => (
          React.createElement('div', { key: d.label, __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}, React.createElement('span', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}, d.label), React.createElement('div', { className: "font-medium text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}, d.value))
        ))
      )

      /* Orbit Capture Module */
      , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-5 mb-4 sm:mb-6 border border-orbit-cyan/20"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
        , React.createElement('div', { className: "flex items-center gap-3 mb-3 sm:mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
          , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
            , React.createElement('div', { className: "w-4 h-4 rounded-full bg-red-500 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}} )
            , React.createElement('div', { className: "absolute inset-0 w-4 h-4 rounded-full bg-red-500 animate-ping opacity-30"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}} )
          )
          , React.createElement('span', { className: "text-sm font-bold text-red-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}, "REC")
          , React.createElement('span', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}, "Orbit Capture Module — 4K 60fps"     )
        )
        , React.createElement('div', { className: "flex items-center gap-2 text-xs text-muted-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}
          , React.createElement(HardDrive, { className: "w-3 h-3 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}} ), React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}, "Storage: 24.8 GB"  )
          , React.createElement('span', { className: "text-orbit-border", __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}, "|")
          , React.createElement(Wifi, { className: "w-3 h-3 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}} ), React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}, "Cloud: Connected" )
        )
      )

      /* Integrated Shot Checklist & Uploads */
      , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-5 mb-4 sm:mb-6 border border-orbit-cyan/20"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
        , React.createElement('div', { className: "flex items-center justify-between mb-3 sm:mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
          , React.createElement('h4', { className: "text-xs sm:text-sm font-semibold flex items-center gap-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
            , React.createElement(CloudUpload, { className: "w-4 h-4 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}} ), "Shot Checklist & Footage Uploads"

          )
          , React.createElement(Badge, { variant: "outline", className: `text-xs ${shotUploads.size === SHOT_LIST.length ? "border-green-500/30 text-green-400 bg-green-500/5" : "border-orbit-purple/30 text-orbit-purple bg-orbit-purple/5"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
            , shotUploads.size, "/", SHOT_LIST.length, " uploaded"
          )
        )

        , React.createElement('div', { className: "space-y-2.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}
          , SHOT_LIST.map((shot) => {
            const isCompleted = completedShots.has(shot.id);
            const uploadedFile = shotUploads.get(shot.id);

            return (
              React.createElement('div', {
                key: shot.id,
                className: `flex items-center gap-3 orbit-card rounded-lg p-3 transition-all ${
                  uploadedFile
                    ? "border-green-500/30 bg-green-500/5"
                    : isCompleted
                    ? "border-orbit-cyan/30 bg-orbit-cyan/5"
                    : "border-orbit-border"
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}

                /* Checkbox to check off the shot manually */
                , React.createElement(Checkbox, {
                  id: shot.id,
                  checked: isCompleted,
                  onCheckedChange: () => {
                    setCompletedShots((prev) => {
                      const next = new Set(prev);
                      if (next.has(shot.id)) {
                        next.delete(shot.id);
                      } else {
                        next.add(shot.id);
                      }
                      return next;
                    });
                  },
                  className: "border-orbit-cyan/50 data-[state=checked]:bg-orbit-cyan data-[state=checked]:text-black shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}
                )

                , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}
                  , React.createElement('label', {
                    htmlFor: shot.id,
                    className: `text-xs sm:text-sm font-medium cursor-pointer ${
                      isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}

                    , shot.name
                  )
                  , React.createElement('p', { className: "text-[11px] sm:text-xs text-muted-foreground line-clamp-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}, shot.description)
                  , uploadedFile && (
                    React.createElement('div', { className: "flex items-center gap-1.5 mt-1 text-[10px] text-green-400"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}
                      , React.createElement(CheckCircle2, { className: "w-3 h-3 shrink-0"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}} )
                      , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}, uploadedFile)
                    )
                  )
                )

                /* Upload Button or Completed Icon */
                , React.createElement('div', { className: "shrink-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}
                  , uploadedFile ? (
                    React.createElement('div', { className: "w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}
                      , React.createElement(CheckCircle2, { className: "w-4 h-4 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}} )
                    )
                  ) : (
                    React.createElement(Button, {
                      size: "sm",
                      variant: "outline",
                      onClick: () => handleFileUpload(shot.id),
                      className: "border-orbit-purple/30 text-orbit-purple hover:bg-orbit-purple/10 hover:text-orbit-purple h-8 text-xs px-2.5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}}

                      , React.createElement(Upload, { className: "w-3.5 h-3.5 mr-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}} ), "Upload"

                    )
                  )
                )
              )
            );
          })
        )

        , shotUploads.size > 0 && (
          React.createElement('div', { className: "mt-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}
            , React.createElement('div', { className: "flex justify-between text-[10px] text-muted-foreground mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}, "Sync Progress" )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}, Math.round((shotUploads.size / SHOT_LIST.length) * 100), "%")
            )
            , React.createElement(Progress, { value: (shotUploads.size / SHOT_LIST.length) * 100, className: "h-1.5 bg-white/5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 167}} )
          )
        )
      )

      , React.createElement('div', { className: "flex flex-col sm:flex-row gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}
        , React.createElement(Button, { onClick: () => toast.success("Orbit Capture Module activated", { description: "Recording in 4K at 60fps" }), variant: "outline", className: "flex-1 border-orbit-cyan/30 text-orbit-cyan hover:bg-orbit-cyan/10 font-bold"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
          , React.createElement(Play, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}} ), "Start Shooting"
        )
        , React.createElement(Button, { onClick: onCompleteShooting, disabled: completedShots.size < SHOT_LIST.length, className: "flex-1 bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 font-bold orbit-glow"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}
          , React.createElement(Upload, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}} ), "Complete & Sync ("   , completedShots.size, "/", SHOT_LIST.length, ")"
        )
      )
    )
  );
}