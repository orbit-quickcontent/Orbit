const _jsxFileName = "src\\components\\ui\\popover.tsx";"use client";

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

function Popover({
  ...props
}) {
  return React.createElement(PopoverPrimitive.Root, { 'data-slot': "popover", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}} )
}

function PopoverTrigger({
  ...props
}) {
  return React.createElement(PopoverPrimitive.Trigger, { 'data-slot': "popover-trigger", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}} )
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return (
    React.createElement(PopoverPrimitive.Portal, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}
      , React.createElement(PopoverPrimitive.Content, {
        'data-slot': "popover-content",
        align: align,
        sideOffset: sideOffset,
        className: cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        ),
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}
      )
    )
  )
}

function PopoverAnchor({
  ...props
}) {
  return React.createElement(PopoverPrimitive.Anchor, { 'data-slot': "popover-anchor", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}} )
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }