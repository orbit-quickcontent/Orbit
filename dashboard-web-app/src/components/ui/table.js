const _jsxFileName = "src\\components\\ui\\table.tsx";"use client";

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }) {
  return (
    React.createElement('div', {
      'data-slot': "table-container",
      className: "relative w-full overflow-x-auto"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}

      , React.createElement('table', {
        'data-slot': "table",
        className: cn("w-full caption-bottom text-sm", className),
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
      )
    )
  )
}

function TableHeader({ className, ...props }) {
  return (
    React.createElement('thead', {
      'data-slot': "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
    )
  )
}

function TableBody({ className, ...props }) {
  return (
    React.createElement('tbody', {
      'data-slot': "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
    )
  )
}

function TableFooter({ className, ...props }) {
  return (
    React.createElement('tfoot', {
      'data-slot': "table-footer",
      className: cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
    )
  )
}

function TableRow({ className, ...props }) {
  return (
    React.createElement('tr', {
      'data-slot': "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
    )
  )
}

function TableHead({ className, ...props }) {
  return (
    React.createElement('th', {
      'data-slot': "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
    )
  )
}

function TableCell({ className, ...props }) {
  return (
    React.createElement('td', {
      'data-slot': "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
    )
  )
}

function TableCaption({
  className,
  ...props
}) {
  return (
    React.createElement('caption', {
      'data-slot': "table-caption",
      className: cn("text-muted-foreground mt-4 text-sm", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
    )
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}