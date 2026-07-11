const _jsxFileName = "src\\components\\ui\\tooltip.tsx";"use client";

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return (
    React.createElement(TooltipPrimitive.Provider, {
      'data-slot': "tooltip-provider",
      delayDuration: delayDuration,
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
    )
  )
}

function Tooltip({
  ...props
}) {
  return (
    React.createElement(TooltipProvider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}
      , React.createElement(TooltipPrimitive.Root, { 'data-slot': "tooltip", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}} )
    )
  )
}

function TooltipTrigger({
  ...props
}) {
  return React.createElement(TooltipPrimitive.Trigger, { 'data-slot': "tooltip-trigger", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}} )
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return (
    React.createElement(TooltipPrimitive.Portal, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
      , React.createElement(TooltipPrimitive.Content, {
        'data-slot': "tooltip-content",
        sideOffset: sideOffset,
        className: cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        ),
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}

        , children
        , React.createElement(TooltipPrimitive.Arrow, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}} )
      )
    )
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }