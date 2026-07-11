const _jsxFileName = "src\\components\\ui\\pagination.tsx";import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Pagination({ className, ...props }) {
  return (
    React.createElement('nav', {
      role: "navigation",
      'aria-label': "pagination",
      'data-slot': "pagination",
      className: cn("mx-auto flex w-full justify-center", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
    )
  )
}

function PaginationContent({
  className,
  ...props
}) {
  return (
    React.createElement('ul', {
      'data-slot': "pagination-content",
      className: cn("flex flex-row items-center gap-1", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}
    )
  )
}

function PaginationItem({ ...props }) {
  return React.createElement('li', { 'data-slot': "pagination-item", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}} )
}






function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}) {
  return (
    React.createElement('a', {
      'aria-current': isActive ? "page" : undefined,
      'data-slot': "pagination-link",
      'data-active': isActive,
      className: cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
    )
  )
}

function PaginationPrevious({
  className,
  ...props
}) {
  return (
    React.createElement(PaginationLink, {
      'aria-label': "Go to previous page"   ,
      size: "default",
      className: cn("gap-1 px-2.5 sm:pl-2.5", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}

      , React.createElement(ChevronLeftIcon, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 79}} )
      , React.createElement('span', { className: "hidden sm:block" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}, "Previous")
    )
  )
}

function PaginationNext({
  className,
  ...props
}) {
  return (
    React.createElement(PaginationLink, {
      'aria-label': "Go to next page"   ,
      size: "default",
      className: cn("gap-1 px-2.5 sm:pr-2.5", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}

      , React.createElement('span', { className: "hidden sm:block" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}, "Next")
      , React.createElement(ChevronRightIcon, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 97}} )
    )
  )
}

function PaginationEllipsis({
  className,
  ...props
}) {
  return (
    React.createElement('span', {
      'aria-hidden': true,
      'data-slot': "pagination-ellipsis",
      className: cn("flex size-9 items-center justify-center", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}

      , React.createElement(MoreHorizontalIcon, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}} )
      , React.createElement('span', { className: "sr-only", __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}, "More pages" )
    )
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
