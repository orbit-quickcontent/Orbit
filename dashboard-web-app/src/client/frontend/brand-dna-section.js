const _jsxFileName = "src\\client\\frontend\\brand-dna-section.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

/**
 * 🔵 CLIENT FRONTEND | BrandDNASection
 * 
 * Brand DNA upload and editor chat for Professional tier bookings.
 * Includes logo upload, font selector, color picker, and real-time
 * editor requirements chat box.
 * 
 * Used by: booking-flow.tsx
 * Category: Client UI
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Sparkles, ImageIcon, X, Send, MessageSquare, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";

export function BrandDNASection() {
  const { user, setUser } = useAppStore();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Welcome! Describe your editing requirements here. Tell us about the style, mood, transitions, music preference, or any specific look you want for your reel.", sender: "system", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    _optionalChain([chatEndRef, 'access', _ => _.current, 'optionalAccess', _2 => _2.scrollIntoView, 'call', _3 => _3({ behavior: "smooth" })]);
  }, [messages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      text: chatInput.trim(),
      sender: "user" ,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setUser({ editorRequirements: user.editorRequirements ? `${user.editorRequirements}
${chatInput.trim()}` : chatInput.trim() });
    setChatInput("");
    toast.success("Requirement sent to editor!");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    React.createElement(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
      , React.createElement(Separator, { className: "bg-orbit-border", __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}} )
      , React.createElement('div', { className: "flex items-center gap-2 text-orbit-cyan"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
        , React.createElement(Sparkles, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}} )
        , React.createElement('span', { className: "text-sm font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}, "Brand DNA" )
        , React.createElement(Badge, { variant: "outline", className: "text-[10px] border-orbit-purple/30 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}, "PRO")
      )
      , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}, "Upload your brand assets and tell our editors exactly what you need."           )

      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
        , React.createElement('label', { className: "text-sm font-medium text-muted-foreground mb-1.5 block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}, "Brand Logo" )
        , React.createElement('div', { className: "orbit-card rounded-xl p-4 border border-dashed border-orbit-border hover:border-orbit-cyan/30 transition-colors"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
          , user.brandLogo ? (
            React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}
              , React.createElement('div', { className: "w-12 h-12 rounded-lg bg-gradient-to-br from-orbit-cyan/10 to-orbit-purple/10 flex items-center justify-center"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
                , React.createElement(ImageIcon, { className: "w-6 h-6 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}} )
              )
              , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
                , React.createElement('div', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}, user.brandLogo)
                , React.createElement('div', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}, "Logo uploaded" )
              )
              , React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => setUser({ brandLogo: null }), className: "text-muted-foreground hover:text-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}
                , React.createElement(X, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}} )
              )
            )
          ) : (
            React.createElement('label', { className: "flex flex-col items-center gap-2 cursor-pointer"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
              , React.createElement('div', { className: "w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}
                , React.createElement(Upload, { className: "w-5 h-5 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}} )
              )
              , React.createElement('span', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}, "Click to upload logo (PNG, SVG)"     )
              , React.createElement('input', { type: "file", className: "hidden", accept: "image/*", onChange: (e) => {
                const file = _optionalChain([e, 'access', _4 => _4.target, 'access', _5 => _5.files, 'optionalAccess', _6 => _6[0]]);
                if (file) { setUser({ brandLogo: file.name }); toast.success("Logo uploaded", { description: file.name }); }
              }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}} )
            )
          )
        )
      )

      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
        , React.createElement('label', { className: "text-sm font-medium text-muted-foreground mb-1.5 block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}, "Brand Font" )
        , React.createElement(Select, { value: user.brandFont || "", onValueChange: (value) => setUser({ brandFont: value }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
          , React.createElement(SelectTrigger, { className: "bg-white/5 border-orbit-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}, React.createElement(SelectValue, { placeholder: "Select a font"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}} ))
          , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}
            , ["Inter", "Playfair Display", "Montserrat", "Roboto", "Aventa"].map((f) => (
              React.createElement(SelectItem, { key: f, value: f, __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}, f)
            ))
          )
        )
      )

      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
        , React.createElement('label', { className: "text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}
          , React.createElement(Palette, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}} ), "Brand Color"

        )
        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
          , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
            , React.createElement('input', {
              type: "color",
              value: user.brandColor || "#00BFFF",
              onChange: (e) => setUser({ brandColor: e.target.value }),
              className: "w-10 h-10 rounded-lg border border-orbit-border cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
            )
          )
          , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
            , React.createElement(Input, {
              value: user.brandColor || "#00BFFF",
              onChange: (e) => setUser({ brandColor: e.target.value }),
              placeholder: "#00BFFF",
              className: "bg-white/5 border-orbit-border focus:border-orbit-cyan/50 font-mono text-sm"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}
            )
          )
          , React.createElement('div', { className: "flex gap-1.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}
            , ["#00BFFF", "#A020F0", "#FF6B35", "#2D6A4F", "#FF4081", "#FFB300"].map((color) => (
              React.createElement('button', {
                key: color,
                onClick: () => setUser({ brandColor: color }),
                className: `w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                  user.brandColor === color ? "border-white scale-110" : "border-white/10"
                }`,
                style: { backgroundColor: color }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}}
              )
            ))
          )
        )
      )

      /* Editor Requirements Chat Box */
      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}
        , React.createElement('label', { className: "text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}
          , React.createElement(MessageSquare, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}} ), "Editor Requirements"

        )
        , React.createElement('div', { className: "orbit-card rounded-xl overflow-hidden border border-orbit-cyan/10"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}
          /* Chat Messages Area */
          , React.createElement('div', { className: "max-h-56 overflow-y-auto p-4 space-y-3"   , style: { scrollbarWidth: "thin", scrollbarColor: "rgba(0,191,255,0.2) transparent" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}
            , messages.map((msg, idx) => (
              React.createElement('div', { key: idx, className: `flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}
                , React.createElement('div', { className: `max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-orbit-cyan/20 to-orbit-purple/20 text-foreground border border-orbit-cyan/10"
                    : "bg-white/5 text-muted-foreground border border-orbit-border"
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}
                  , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}, msg.text)
                  , React.createElement('p', { className: `text-[10px] mt-1 ${msg.sender === "user" ? "text-orbit-cyan/50" : "text-muted-foreground/40"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}, msg.time)
                )
              )
            ))
            , React.createElement('div', { ref: chatEndRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}} )
          )

          /* Chat Input */
          , React.createElement('div', { className: "border-t border-orbit-border p-3 flex items-end gap-2 bg-white/[0.02]"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
            , React.createElement('textarea', {
              value: chatInput,
              onChange: (e) => setChatInput(e.target.value),
              onKeyDown: handleKeyDown,
              placeholder: "Type your editing requirements... (e.g. cinematic look, warm tones, slow-mo transitions)"          ,
              rows: 2,
              className: "flex-1 bg-white/5 border border-orbit-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-orbit-cyan/50 focus:outline-none focus:ring-1 focus:ring-orbit-cyan/20 resize-none"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
            )
            , React.createElement(Button, {
              onClick: handleSendMessage,
              disabled: !chatInput.trim(),
              className: "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90 shrink-0 rounded-xl h-10 w-10 p-0 flex items-center justify-center"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}

              , React.createElement(Send, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}} )
            )
          )
        )
        , React.createElement('p', { className: "text-[10px] text-muted-foreground/50 mt-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}}, "Press Enter to send. Your requirements will be shared with our editors."           )
      )
    )
  );
}