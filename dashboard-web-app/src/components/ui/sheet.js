const _jsxFileName = "src\\components\\ui\\sheet.tsx";"use client";

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Sheet({ ...props }) {
  return React.createElement(SheetPrimitive.Root, { 'data-slot': "sheet", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10}} )
}

function SheetTrigger({
  ...props
}) {
  return React.createElement(SheetPrimitive.Trigger, { 'data-slot': "sheet-trigger", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}} )
}

function SheetClose({
  ...props
}) {
  return React.createElement(SheetPrimitive.Close, { 'data-slot': "sheet-close", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}} )
}

function SheetPortal({
  ...props
}) {
  return React.createElement(SheetPrimitive.Portal, { 'data-slot': "sheet-portal", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}} )
}

function SheetOverlay({
  className,
  ...props
}) {
  return (
    React.createElement(SheetPrimitive.Overlay, {
      'data-slot': "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}
    )
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}

) {
  return (
    React.createElement(SheetPortal, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
      , React.createElement(SheetOverlay, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 57}} )
      , React.createElement(SheetPrimitive.Content, {
        'data-slot': "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}

        , children
        , React.createElement(SheetPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
          , React.createElement(XIcon, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}} )
          , React.createElement('span', { className: "sr-only", __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}, "Close")
        )
      )
    )
  )
}

function SheetHeader({ className, ...props }) {
  return (
    React.createElement('div', {
      'data-slot': "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}
    )
  )
}

function SheetFooter({ className, ...props }) {
  return (
    React.createElement('div', {
      'data-slot': "sheet-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}
    )
  )
}

function SheetTitle({
  className,
  ...props
}) {
  return (
    React.createElement(SheetPrimitive.Title, {
      'data-slot': "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}
    )
  )
}

function SheetDescription({
  className,
  ...props
}) {
  return (
    React.createElement(SheetPrimitive.Description, {
      'data-slot': "sheet-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}
    )
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}