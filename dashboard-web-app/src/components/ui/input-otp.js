const _jsxFileName = "src\\components\\ui\\input-otp.tsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}

) {
  return (
    React.createElement(OTPInput, {
      'data-slot': "input-otp",
      containerClassName: cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      ),
      className: cn("disabled:cursor-not-allowed", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
    )
  )
}

function InputOTPGroup({ className, ...props }) {
  return (
    React.createElement('div', {
      'data-slot': "input-otp-group",
      className: cn("flex items-center", className),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}
    )
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}

) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = _nullishCoalesce(_optionalChain([inputOTPContext, 'optionalAccess', _ => _.slots, 'access', _2 => _2[index]]), () => ( {}))

  return (
    React.createElement('div', {
      'data-slot': "input-otp-slot",
      'data-active': isActive,
      className: cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className
      ),
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}

      , char
      , hasFakeCaret && (
        React.createElement('div', { className: "pointer-events-none absolute inset-0 flex items-center justify-center"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
          , React.createElement('div', { className: "animate-caret-blink bg-foreground h-4 w-px duration-1000"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}} )
        )
      )
    )
  )
}

function InputOTPSeparator({ ...props }) {
  return (
    React.createElement('div', { 'data-slot': "input-otp-separator", role: "separator", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}
      , React.createElement(MinusIcon, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 72}} )
    )
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }