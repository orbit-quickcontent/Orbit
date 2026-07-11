const _jsxFileName = "src\\app\\layout.tsx";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Orbit Editor Studio — Real-time Video Assembly",
  description: "Workspace for professional human video editors at Orbit. Receive raw footage, view client brand DNA, and deliver cinematic edits instantly.",
  icons: {
    icon: "/orbit-logo.png",
    apple: "/orbit-logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}

) {
  return (
    React.createElement('html', { lang: "en", className: "dark", suppressHydrationWarning: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 38}}
      , React.createElement('body', {
        className: `${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}

        , children
      )
    )
  );
}
