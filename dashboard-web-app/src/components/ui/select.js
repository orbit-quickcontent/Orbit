const _jsxFileName = "src\\components\\ui\\select.tsx";"use client";

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({
  ...props
}) {
  return React.createElement(SelectPrimitive.Root, { 'data-slot': "select", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}} )
}

function SelectGroup({
  ...props
}) {
  return React.createElement(SelectPrimitive.Group, { 'data-slot': "select-group", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}} )
}

function SelectValue({
  ...props
}) {
  return React.createElement(SelectPrimitive.Value, { 'data-slot': "select-value", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}} )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}

) {
  return (
    React.createElement(SelectPrimitive.Trigger, {
      'data-slot': "select-trigger",
      'data-size': size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}

      , children
      , React.createElement(SelectPrimitive.Icon, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
        , React.createElement(ChevronDownIcon, { className: "size-4 opacity-50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}} )
      )
    )
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return (
    React.createElement(SelectPrimitive.Portal, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
      , React.createElement(SelectPrimitive.Content, {
        'data-slot': "select-content",
        className: cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        ),
        position: position,
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}

        , React.createElement(SelectScrollUpButton, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 72}} )
        , React.createElement(SelectPrimitive.Viewport, {
          className: cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}

          , children
        )
        , React.createElement(SelectScrollDownButton, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 82}} )
      )
    )
  )
}

function SelectLabel({
  className,
  ...props
}) {
  return (
    React.createElement(SelectPrimitive.Label, {
      'data-slot': "select-label",
      className: cn("text-muted-foreground px-2 py-1.5 text-xs", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
    )
  )
}

function SelectItem({
  className,
  children,
  ...props
}) {
  return (
    React.createElement(SelectPrimitive.Item, {
      'data-slot': "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}

      , React.createElement('span', { className: "absolute right-2 flex size-3.5 items-center justify-center"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
        , React.createElement(SelectPrimitive.ItemIndicator, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
          , React.createElement(CheckIcon, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}} )
        )
      )
      , React.createElement(SelectPrimitive.ItemText, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}, children)
    )
  )
}

function SelectSeparator({
  className,
  ...props
}) {
  return (
    React.createElement(SelectPrimitive.Separator, {
      'data-slot': "select-separator",
      className: cn("bg-border pointer-events-none -mx-1 my-1 h-px", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}
    )
  )
}

function SelectScrollUpButton({
  className,
  ...props
}) {
  return (
    React.createElement(SelectPrimitive.ScrollUpButton, {
      'data-slot': "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}

      , React.createElement(ChevronUpIcon, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}} )
    )
  )
}

function SelectScrollDownButton({
  className,
  ...props
}) {
  return (
    React.createElement(SelectPrimitive.ScrollDownButton, {
      'data-slot': "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}

      , React.createElement(ChevronDownIcon, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}} )
    )
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}