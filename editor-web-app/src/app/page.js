const _jsxFileName = "src\\app\\page.tsx";"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function EditorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login for editor_1
    setTimeout(() => {
      const emailLower = email.toLowerCase();
      const isAllowed = 
        (emailLower === "orbit.quickcontent@gmail.com" && password === "MAU.editor.amg") ||
        (emailLower.includes("editor") && password !== "") || 
        (emailLower === "admin@orbit.com" && password !== "") ||
        (emailLower === "micke14y@gmail.com") ||
        (emailLower === "");

      if (isAllowed) {
        // Save mock editorId to localStorage for session
        localStorage.setItem("orbit_editor_id", "editor_1");
        const displayName = email.toLowerCase() === "orbit.quickcontent@gmail.com" 
          ? "Orbit QuickContent Editor" 
          : "Alex Mercer";
        localStorage.setItem("orbit_editor_name", displayName);
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Please verify your email and password.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    React.createElement('main', { className: "min-h-screen flex items-center justify-center bg-black relative overflow-hidden px-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}
      /* Background radial glow */
      , React.createElement('div', { className: "absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orbit-cyan/5 blur-[120px] pointer-events-none"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}} )
      , React.createElement('div', { className: "absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-orbit-purple/5 blur-[120px] pointer-events-none"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}} )

      , React.createElement(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "w-full max-w-md" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}

        /* Brand logo / header */
        , React.createElement('div', { className: "text-center mb-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
          , React.createElement('h1', { className: "text-4xl font-extrabold tracking-tight text-gradient-orbit mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}, "ORBIT"

          )
          , React.createElement('p', { className: "text-sm font-semibold tracking-wider text-muted-foreground uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}, "EDITOR STUDIO"

          )
        )

        /* Login Card */
        , React.createElement('div', { className: "orbit-card-strong p-8 rounded-2xl border border-orbit-border/50 shadow-2xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}
          , React.createElement('h2', { className: "text-xl font-bold mb-6 text-white text-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}, "Sign In to Workspace"

          )

          , React.createElement('form', { onSubmit: handleSubmit, className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
              , React.createElement('label', { className: "block text-xs font-semibold text-muted-foreground uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}, "Email Address"

              )
              , React.createElement('input', {
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "e.g. editor@orbit.com" ,
                className: "w-full bg-[#111] border border-orbit-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orbit-cyan transition-colors"           ,
                required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
              )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}
              , React.createElement('label', { className: "block text-xs font-semibold text-muted-foreground uppercase mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}, "Password"

              )
              , React.createElement('input', {
                type: "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: "••••••••",
                className: "w-full bg-[#111] border border-orbit-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orbit-cyan transition-colors"           ,
                required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
              )
            )

            , error && (
              React.createElement('p', { className: "text-sm text-red-400 font-medium text-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
                , error
              )
            )

            , React.createElement('button', {
              type: "submit",
              disabled: isLoading,
              className: "w-full bg-gradient-to-r from-orbit-cyan to-orbit-purple text-black font-semibold rounded-xl py-3 mt-6 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}

              , isLoading ? (
                React.createElement('div', { className: "w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}} )
              ) : (
                React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}, "Access Workspace" )
              )
            )
          )
        )

        , React.createElement('p', { className: "text-center text-xs text-gray-600 mt-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, "Authorized Orbit editors only. Live tracking active."

        )
      )
    )
  );
}
