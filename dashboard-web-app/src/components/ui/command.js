const _jsxFileName = "src\\components\\ui\\command.tsx";"use client";

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function Command({
  className,
  ...props
}) {
  return (
    React.createElement(CommandPrimitive, {
      'data-slot': "command",
      className: cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
    )
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}




) {
  return (
    React.createElement(Dialog, { ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
      , React.createElement(DialogHeader, { className: "sr-only", __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}
        , React.createElement(DialogTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}, title)
        , React.createElement(DialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}, description)
      )
      , React.createElement(DialogContent, {
        className: cn("overflow-hidden p-0", className),
        showCloseButton: showCloseButton, __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}

        , React.createElement(Command, { className: "[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}
          , children
        )
      )
    )
  )
}

function CommandInput({
  className,
  ...props
}) {
  return (
    React.createElement('div', {
      'data-slot': "command-input-wrapper",
      className: "flex h-9 items-center gap-2 border-b px-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}

      , React.createElement(SearchIcon, { className: "size-4 shrink-0 opacity-50"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}} )
      , React.createElement(CommandPrimitive.Input, {
        'data-slot': "command-input",
        className: cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
      )
    )
  )
}

function CommandList({
  className,
  ...props
}) {
  return (
    React.createElement(CommandPrimitive.List, {
      'data-slot': "command-list",
      className: cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}
    )
  )
}

function CommandEmpty({
  ...props
}) {
  return (
    React.createElement(CommandPrimitive.Empty, {
      'data-slot': "command-empty",
      className: "py-6 text-center text-sm"  ,
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
    )
  )
}

function CommandGroup({
  className,
  ...props
}) {
  return (
    React.createElement(CommandPrimitive.Group, {
      'data-slot': "command-group",
      className: cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
    )
  )
}

function CommandSeparator({
  className,
  ...props
}) {
  return (
    React.createElement(CommandPrimitive.Separator, {
      'data-slot': "command-separator",
      className: cn("bg-border -mx-1 h-px", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}
    )
  )
}

function CommandItem({
  className,
  ...props
}) {
  return (
    React.createElement(CommandPrimitive.Item, {
      'data-slot': "command-item",
      className: cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}
    )
  )
}

function CommandShortcut({
  className,
  ...props
}) {
  return (
    React.createElement('span', {
      'data-slot': "command-shortcut",
      className: cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}
    )
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}