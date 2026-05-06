import type { Metadata } from "next";
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
  title: "Orbit Logic — Professional Cinema at On-Demand Speed",
  description:
    "Desktop-grade professional edits within 60–120 minutes. Impact over Speed — using professional human editors at the speed of AI.",
  keywords: [
    "Orbit Logic",
    "Cinema",
    "Video Editing",
    "Professional Reels",
    "UGC",
    "On-Demand",
  ],
  authors: [{ name: "Orbit Logic Team" }],
  icons: {
    icon: "/orbit-logo.png",
  },
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
              background: "#1A1A1A",
              border: "1px solid #222222",
              color: "#F5F5F5",
            },
          }}
        />
      </body>
    </html>
  );
}
