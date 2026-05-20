/**
 * ⚪ APP ENTRY | Root Layout
 * 
 * Root HTML layout with Geist fonts, dark mode, and Sonner toast provider.
 * Sets up global styles, metadata, and favicon.
 * 
 * Used by: Next.js App Router (automatic)
 * Category: App Entry
 */

import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#081C43",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0A2860",
              border: "1px solid #123566",
              color: "#FFFFFF",
            },
          }}
        />
      </body>
    </html>
  );
}
