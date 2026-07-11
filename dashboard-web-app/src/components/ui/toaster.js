const _jsxFileName = "src\\components\\ui\\toaster.tsx";"use client";

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    React.createElement(ToastProvider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
      , toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          React.createElement(Toast, { key: id, ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
            , React.createElement('div', { className: "grid gap-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
              , title && React.createElement(ToastTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}, title)
              , description && (
                React.createElement(ToastDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}, description)
              )
            )
            , action
            , React.createElement(ToastClose, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 28}} )
          )
        )
      })
      , React.createElement(ToastViewport, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 32}} )
    )
  )
}