const _jsxFileName = "src\\partner\\frontend\\sync-module.tsx";"use client";

/**
 * 🟣 PARTNER FRONTEND | SyncModule
 * 
 * Cloud sync progress visualization showing upload percentage,
 * current file being synced, transfer speed, and upload queue
 * with per-file status indicators.
 * 
 * Used by: partner-dashboard.tsx
 * Category: Partner UI
 */

import { Cloud, CheckCircle2, Film, Loader2, Wifi } from "lucide-react";
import { Progress } from "@/components/ui/progress";








export function SyncModule({ syncProgress, syncSpeed, currentFile, syncFiles }) {
  return (
    React.createElement('div', { className: "orbit-card rounded-2xl p-3 sm:p-6 md:p-8"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}
      , React.createElement('h3', { className: "text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}, React.createElement(Cloud, { className: "w-4 h-4 sm:w-5 sm:h-5 text-orbit-cyan"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}} ), "Orbit Sync Module"  )
      , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-5 mb-4 sm:mb-6"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}
        , React.createElement('div', { className: "flex items-center justify-between mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}
          , React.createElement('span', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}, "Uploading to Open Cloud Server"    )
          , React.createElement('span', { className: "text-lg font-black text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}, syncProgress, "%")
        )
        , React.createElement(Progress, { value: syncProgress, className: "h-3 bg-white/5 mb-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}} )
        , React.createElement('div', { className: "flex items-center justify-between text-xs text-muted-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}, React.createElement(Film, { className: "w-3 h-3 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}} ), React.createElement('span', { className: "truncate max-w-[150px] sm:max-w-none"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}, currentFile))
          , React.createElement('div', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}, React.createElement(Wifi, { className: "w-3 h-3 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}} ), React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}, syncSpeed, " MB/s" ))
        )
      )
      , React.createElement('div', { className: "space-y-2 mb-4 sm:mb-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}
        , React.createElement('h4', { className: "text-xs sm:text-sm font-semibold text-muted-foreground mb-2 sm:mb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}, "Upload Queue" )
        , syncFiles.map((file, idx) => {
          const isDone = syncProgress > ((idx + 1) / syncFiles.length) * 100;
          const isActive = !isDone && syncProgress > (idx / syncFiles.length) * 100;
          return (
            React.createElement('div', { key: file, className: `flex items-center gap-3 orbit-card rounded-lg p-3 text-xs ${isDone ? "border-orbit-cyan/20" : isActive ? "border-orbit-cyan/40 bg-orbit-cyan/5" : "border-orbit-border"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}
              , isDone ? React.createElement(CheckCircle2, { className: "w-4 h-4 text-orbit-cyan shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}} ) : isActive ? React.createElement(Loader2, { className: "w-4 h-4 text-orbit-cyan shrink-0 animate-spin"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}} ) : React.createElement(Film, { className: "w-4 h-4 text-muted-foreground shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}} )
              , React.createElement('span', { className: `truncate ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}, file)
              , isDone && React.createElement('span', { className: "ml-auto text-orbit-cyan/60 shrink-0"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}, "Done")
            )
          );
        })
      )
      , React.createElement('div', { className: "flex items-center gap-2 text-xs text-muted-foreground justify-center"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}
        , React.createElement(Loader2, { className: "w-3 h-3 animate-spin text-orbit-cyan"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}} ), React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}, "Syncing in progress..."  )
      )
    )
  );
}