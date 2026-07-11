const _jsxFileName = "src\\app\\layout.tsx";










import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Orbit — Professional Cinema. Delivered in 60 Minutes.",
  description:
    "Desktop-grade professional edits within 60-120 minutes. The Orbit Edge: Fluidity & Precision — using professional human editors at the speed of AI.",
  keywords: [
    "Orbit",
    "Cinema",
    "Video Editing",
    "Professional Reels",
    "UGC",
    "On-Demand",
  ],
  authors: [{ name: "Orbit Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/orbit-logo.png",
    apple: "/orbit-logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Orbit",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}

) {
  return (
    React.createElement('html', { lang: "en", className: "dark", suppressHydrationWarning: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
      , React.createElement('head', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
        , React.createElement('link', { rel: "apple-touch-icon", href: "/orbit-logo.png", __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}} )
        , React.createElement('link', { rel: "apple-touch-icon", sizes: "180x180", href: "/orbit-logo.png", __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}} )
        , React.createElement('meta', { name: "apple-mobile-web-app-capable", content: "yes", __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}} )
        , React.createElement('meta', { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}} )
        , React.createElement('meta', { name: "mobile-web-app-capable", content: "yes", __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}} )
        , React.createElement('meta', { name: "application-name", content: "Orbit", __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}} )
        , React.createElement('meta', { name: "apple-mobile-web-app-title", content: "Orbit", __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}} )
        , React.createElement('meta', { name: "msapplication-TileColor", content: "#000000", __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}} )
        , React.createElement('meta', { name: "msapplication-navbutton-color", content: "#000000", __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}} )
      )
      , React.createElement('body', {
        className: `${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}

        , children
        , React.createElement(Toaster, {
          position: "top-right",
          toastOptions: {
            style: {
              background: "#0A0A0A",
              border: "1px solid #1A1A2E",
              color: "#FFFFFF",
            },
          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
        )
      )
    )
  );
}
