/**
 * Shared Backend | Verify OTP Handler
 *
 * Verifies the 6-digit OTP against the stored value.
 * On success, clears the OTP from the store.
 *
 * Used by: /api/auth/verify-otp route
 * Category: Shared Backend - Auth
 */

import { NextRequest, NextResponse } from "next/server";

// Shared in-memory OTP store (same reference as send-otp)
// Since Next.js API routes run in the same server process, we use a global store
const globalForOtp = globalThis as typeof globalThis & {
  __otpStore?: Map<string, { otp: string; expires: number; attempts: number }>;
};

function getOtpStore() {
  if (!globalForOtp.__otpStore) {
    globalForOtp.__otpStore = new Map();
  }
  return globalForOtp.__otpStore;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpStore = getOtpStore();

    const stored = otpStore.get(normalizedEmail);

    if (!stored) {
      return NextResponse.json(
        { error: "No OTP found. Please request a new one." },
        { status: 404 }
      );
    }

    if (stored.expires < Date.now()) {
      otpStore.delete(normalizedEmail);
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 410 }
      );
    }

    if (stored.otp !== otp.toString()) {
      return NextResponse.json(
        { error: "Invalid OTP. Please try again." },
        { status: 401 }
      );
    }

    // Success: clear the OTP
    otpStore.delete(normalizedEmail);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
