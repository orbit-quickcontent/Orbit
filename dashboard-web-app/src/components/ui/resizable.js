const _jsxFileName = "src\\components\\ui\\resizable.tsx";"use client";

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({
  className,
  ...props
}) {
  return (
    React.createElement(ResizablePrimitive.PanelGroup, {
      'data-slot': "resizable-panel-group",
      className: cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
    )
  )
}

function ResizablePanel({
  ...props
}) {
  return React.createElement(ResizablePrimitive.Panel, { 'data-slot': "resizable-panel", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}} )
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}

) {
  return (
    React.createElement(ResizablePrimitive.PanelResizeHandle, {
      'data-slot': "resizable-handle",
      className: cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}

      , withHandle && (
        React.createElement('div', { className: "bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}
          , React.createElement(GripVerticalIcon, { className: "size-2.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}} )
        )
      )
    )
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }