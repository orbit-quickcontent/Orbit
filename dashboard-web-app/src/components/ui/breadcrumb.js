const _jsxFileName = "src\\components\\ui\\breadcrumb.tsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

function Breadcrumb({ ...props }) {
  return React.createElement('nav', { 'aria-label': "breadcrumb", 'data-slot': "breadcrumb", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8}} )
}

function BreadcrumbList({ className, ...props }) {
  return (
    React.createElement('ol', {
      'data-slot': "breadcrumb-list",
      className: cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
    )
  )
}

function BreadcrumbItem({ className, ...props }) {
  return (
    React.createElement('li', {
      'data-slot': "breadcrumb-item",
      className: cn("inline-flex items-center gap-1.5", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}
    )
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}

) {
  const Comp = asChild ? Slot : "a"

  return (
    React.createElement(Comp, {
      'data-slot': "breadcrumb-link",
      className: cn("hover:text-foreground transition-colors", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
    )
  )
}

function BreadcrumbPage({ className, ...props }) {
  return (
    React.createElement('span', {
      'data-slot': "breadcrumb-page",
      role: "link",
      'aria-disabled': "true",
      'aria-current': "page",
      className: cn("text-foreground font-normal", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}
    )
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}) {
  return (
    React.createElement('li', {
      'data-slot': "breadcrumb-separator",
      role: "presentation",
      'aria-hidden': "true",
      className: cn("[&>svg]:size-3.5", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}

      , _nullishCoalesce(children, () => ( React.createElement(ChevronRight, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 78}} )))
    )
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}) {
  return (
    React.createElement('span', {
      'data-slot': "breadcrumb-ellipsis",
      role: "presentation",
      'aria-hidden': "true",
      className: cn("flex size-9 items-center justify-center", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}

      , React.createElement(MoreHorizontal, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}} )
      , React.createElement('span', { className: "sr-only", __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}, "More")
    )
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
