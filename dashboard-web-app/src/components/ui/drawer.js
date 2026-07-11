const _jsxFileName = "src\\components\\ui\\drawer.tsx";"use client";

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

function Drawer({
  ...props
}) {
  return React.createElement(DrawerPrimitive.Root, { 'data-slot': "drawer", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}} )
}

function DrawerTrigger({
  ...props
}) {
  return React.createElement(DrawerPrimitive.Trigger, { 'data-slot': "drawer-trigger", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}} )
}

function DrawerPortal({
  ...props
}) {
  return React.createElement(DrawerPrimitive.Portal, { 'data-slot': "drawer-portal", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}} )
}

function DrawerClose({
  ...props
}) {
  return React.createElement(DrawerPrimitive.Close, { 'data-slot': "drawer-close", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}} )
}

function DrawerOverlay({
  className,
  ...props
}) {
  return (
    React.createElement(DrawerPrimitive.Overlay, {
      'data-slot': "drawer-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}
    )
  )
}

function DrawerContent({
  className,
  children,
  ...props
}) {
  return (
    React.createElement(DrawerPortal, { 'data-slot': "drawer-portal", __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}
      , React.createElement(DrawerOverlay, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 55}} )
      , React.createElement(DrawerPrimitive.Content, {
        'data-slot': "drawer-content",
        className: cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        ),
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}

        , React.createElement('div', { className: "bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}} )
        , children
      )
    )
  )
}

function DrawerHeader({ className, ...props }) {
  return (
    React.createElement('div', {
      'data-slot': "drawer-header",
      className: cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
    )
  )
}

function DrawerFooter({ className, ...props }) {
  return (
    React.createElement('div', {
      'data-slot': "drawer-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}
    )
  )
}

function DrawerTitle({
  className,
  ...props
}) {
  return (
    React.createElement(DrawerPrimitive.Title, {
      'data-slot': "drawer-title",
      className: cn("text-foreground font-semibold", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}
    )
  )
}

function DrawerDescription({
  className,
  ...props
}) {
  return (
    React.createElement(DrawerPrimitive.Description, {
      'data-slot': "drawer-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
    )
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}