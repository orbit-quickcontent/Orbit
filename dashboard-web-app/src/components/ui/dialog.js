const _jsxFileName = "src\\components\\ui\\dialog.tsx";"use client";

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({
  ...props
}) {
  return React.createElement(DialogPrimitive.Root, { 'data-slot': "dialog", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}} )
}

function DialogTrigger({
  ...props
}) {
  return React.createElement(DialogPrimitive.Trigger, { 'data-slot': "dialog-trigger", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}} )
}

function DialogPortal({
  ...props
}) {
  return React.createElement(DialogPrimitive.Portal, { 'data-slot': "dialog-portal", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}} )
}

function DialogClose({
  ...props
}) {
  return React.createElement(DialogPrimitive.Close, { 'data-slot': "dialog-close", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}} )
}

function DialogOverlay({
  className,
  ...props
}) {
  return (
    React.createElement(DialogPrimitive.Overlay, {
      'data-slot': "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 38}}
    )
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}

) {
  return (
    React.createElement(DialogPortal, { 'data-slot': "dialog-portal", __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
      , React.createElement(DialogOverlay, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 59}} )
      , React.createElement(DialogPrimitive.Content, {
        'data-slot': "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}

        , children
        , showCloseButton && (
          React.createElement(DialogPrimitive.Close, {
            'data-slot': "dialog-close",
            className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}

            , React.createElement(XIcon, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 74}} )
            , React.createElement('span', { className: "sr-only", __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}, "Close")
          )
        )
      )
    )
  )
}

function DialogHeader({ className, ...props }) {
  return (
    React.createElement('div', {
      'data-slot': "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
    )
  )
}

function DialogFooter({ className, ...props }) {
  return (
    React.createElement('div', {
      'data-slot': "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}
    )
  )
}

function DialogTitle({
  className,
  ...props
}) {
  return (
    React.createElement(DialogPrimitive.Title, {
      'data-slot': "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
    )
  )
}

function DialogDescription({
  className,
  ...props
}) {
  return (
    React.createElement(DialogPrimitive.Description, {
      'data-slot': "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
    )
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}