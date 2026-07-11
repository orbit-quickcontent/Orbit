const _jsxFileName = "src\\components\\ui\\scroll-area.tsx";"use client";

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}) {
  return (
    React.createElement(ScrollAreaPrimitive.Root, {
      'data-slot': "scroll-area",
      className: cn("relative", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}

      , React.createElement(ScrollAreaPrimitive.Viewport, {
        'data-slot': "scroll-area-viewport",
        className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}

        , children
      )
      , React.createElement(ScrollBar, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 25}} )
      , React.createElement(ScrollAreaPrimitive.Corner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 26}} )
    )
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return (
    React.createElement(ScrollAreaPrimitive.ScrollAreaScrollbar, {
      'data-slot': "scroll-area-scrollbar",
      orientation: orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}

      , React.createElement(ScrollAreaPrimitive.ScrollAreaThumb, {
        'data-slot': "scroll-area-thumb",
        className: "bg-border relative flex-1 rounded-full"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}
      )
    )
  )
}

export { ScrollArea, ScrollBar }