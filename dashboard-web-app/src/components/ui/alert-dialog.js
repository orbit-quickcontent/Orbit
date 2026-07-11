const _jsxFileName = "src\\components\\ui\\alert-dialog.tsx";"use client";

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function AlertDialog({
  ...props
}) {
  return React.createElement(AlertDialogPrimitive.Root, { 'data-slot': "alert-dialog", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}} )
}

function AlertDialogTrigger({
  ...props
}) {
  return (
    React.createElement(AlertDialogPrimitive.Trigger, { 'data-slot': "alert-dialog-trigger", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}} )
  )
}

function AlertDialogPortal({
  ...props
}) {
  return (
    React.createElement(AlertDialogPrimitive.Portal, { 'data-slot': "alert-dialog-portal", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}} )
  )
}

function AlertDialogOverlay({
  className,
  ...props
}) {
  return (
    React.createElement(AlertDialogPrimitive.Overlay, {
      'data-slot': "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}
    )
  )
}

function AlertDialogContent({
  className,
  ...props
}) {
  return (
    React.createElement(AlertDialogPortal, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
      , React.createElement(AlertDialogOverlay, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 53}} )
      , React.createElement(AlertDialogPrimitive.Content, {
        'data-slot': "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}
      )
    )
  )
}

function AlertDialogHeader({
  className,
  ...props
}) {
  return (
    React.createElement('div', {
      'data-slot': "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}
    )
  )
}

function AlertDialogFooter({
  className,
  ...props
}) {
  return (
    React.createElement('div', {
      'data-slot': "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
    )
  )
}

function AlertDialogTitle({
  className,
  ...props
}) {
  return (
    React.createElement(AlertDialogPrimitive.Title, {
      'data-slot': "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
    )
  )
}

function AlertDialogDescription({
  className,
  ...props
}) {
  return (
    React.createElement(AlertDialogPrimitive.Description, {
      'data-slot': "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}
    )
  )
}

function AlertDialogAction({
  className,
  ...props
}) {
  return (
    React.createElement(AlertDialogPrimitive.Action, {
      className: cn(buttonVariants(), className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}
    )
  )
}

function AlertDialogCancel({
  className,
  ...props
}) {
  return (
    React.createElement(AlertDialogPrimitive.Cancel, {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}
    )
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}