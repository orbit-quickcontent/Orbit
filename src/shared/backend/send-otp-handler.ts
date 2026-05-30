/**
 * Shared Backend | Send OTP Handler
 *
 * Generates a 6-digit OTP and stores it in-memory for verification.
 * In production, this would send the OTP via email (SendGrid, Resend, etc.)
 * For demo purposes, the OTP is also returned in the response.
 *
 * Used by: /api/auth/send-otp route
 * Category: Shared Backend - Auth
 */

import { NextRequest, NextResponse } from "next/server";

// Shared global OTP store: email → { otp, expires, attempts }
const globalForOtp = globalThis as typeof globalThis & {
  __otpStore?: Map<string, { otp: string; expires: number; attempts: number }>;
  __otpCleanup?: ReturnType<typeof setInterval>;
};

function getOtpStore() {
  if (!globalForOtp.__otpStore) {
    globalForOtp.__otpStore = new Map();
  }
  return globalForOtp.__otpStore;
}

// Clean up expired OTPs every 5 minutes (only once globally)
if (!globalForOtp.__otpCleanup) {
  globalForOtp.__otpCleanup = setInterval(() => {
    const store = getOtpStore();
    const now = Date.now();
    for (const [key, val] of store.entries()) {
      if (val.expires < now) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpStore = getOtpStore();

    // Rate limiting: max 5 OTP requests per email per 5 minutes
    const existing = otpStore.get(normalizedEmail);
    if (existing && existing.attempts >= 5 && existing.expires > Date.now()) {
      const waitSeconds = Math.ceil((existing.expires - Date.now()) / 1000);
      return NextResponse.json(
        { error: `Too many requests. Please wait ${waitSeconds}s` },
        { status: 429 }
      );
    }

    const otp = generateOTP();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(normalizedEmail, { otp, expires, attempts: (existing?.attempts || 0) + 1 });

    // In production: send email with OTP here
    // await sendEmail(normalizedEmail, "Your Orbit Verification Code", `Your OTP is: ${otp}`);

    if (process.env.NODE_ENV === "development") {
      console.log(`[OTP] ${normalizedEmail} → ${otp}`);
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      // For demo: include OTP in response so UI can show it
      demoOtp: otp,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
