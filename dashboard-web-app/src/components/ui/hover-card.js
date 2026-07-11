const _jsxFileName = "src\\components\\ui\\hover-card.tsx";"use client";

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

function HoverCard({
  ...props
}) {
  return React.createElement(HoverCardPrimitive.Root, { 'data-slot': "hover-card", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}} )
}

function HoverCardTrigger({
  ...props
}) {
  return (
    React.createElement(HoverCardPrimitive.Trigger, { 'data-slot': "hover-card-trigger", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}} )
  )
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return (
    React.createElement(HoverCardPrimitive.Portal, { 'data-slot': "hover-card-portal", __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}
      , React.createElement(HoverCardPrimitive.Content, {
        'data-slot': "hover-card-content",
        align: align,
        sideOffset: sideOffset,
        className: cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        ),
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}
      )
    )
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }