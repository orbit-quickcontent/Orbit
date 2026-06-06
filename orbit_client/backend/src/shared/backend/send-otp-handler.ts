/**
 * Shared Backend | Send OTP Handler
 *
 * Generates a 6-digit OTP and stores it in-memory for verification.
 * Sends the OTP via Nodemailer SMTP if credentials are provided in env.
 * Otherwise, falls back to Ethereal Email and prints the preview link / OTP to console.
 *
 * Used by: /api/auth/send-otp route
 * Category: Shared Backend - Auth
 */

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

// Nodemailer transport setup
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_PASS;
const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
const smtpFrom = process.env.SMTP_FROM || smtpUser || '"Orbit" <noreply@orbit.com>';

let transporter: any = null;

if (smtpUser && smtpPass) {
  if (process.env.GMAIL_USER) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }
}

async function sendOtpEmail(to: string, otp: string): Promise<{ success: boolean; isDemo: boolean; previewUrl?: string }> {
  const subject = "Your Orbit Verification Code";
  const text = `Your Orbit verification code is: ${otp}. This code is valid for 5 minutes.`;
  const html = `
    <div style="background-color: #0b0b0f; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1f1f2e; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 28px; font-weight: 900; letter-spacing: -0.05em; color: #00f0ff; margin: 0;">ORBIT</h2>
      </div>
      <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 16px; color: #ffffff;">Verify Your Email</h1>
      <p style="font-size: 15px; color: #a1a1aa; line-height: 1.6; margin-bottom: 24px;">
        Use the verification code below to complete your registration on Orbit. This code is valid for 5 minutes.
      </p>
      <div style="background-color: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.25); padding: 18px 30px; border-radius: 8px; display: inline-block; margin-bottom: 24px;">
        <span style="font-size: 36px; font-weight: 900; letter-spacing: 0.1em; color: #00f0ff;">${otp}</span>
      </div>
      <p style="font-size: 12px; color: #52525b; line-height: 1.5; margin-top: 32px;">
        If you did not request this code, you can safely ignore this email.
        <br />
        &copy; 2026 Orbit. Professional Cinema. Delivered in 60 Minutes.
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: smtpFrom,
        to,
        subject,
        text,
        html,
      });
      console.log(`[OTP] Email successfully sent to ${to} via SMTP`);
      return { success: true, isDemo: false };
    } catch (err) {
      console.error("[OTP] Error sending SMTP email:", err);
      // fallback if SMTP sending failed
    }
  }

  // Fallback to Ethereal Email
  try {
    const testAccount = await nodemailer.createTestAccount();
    const etherealTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await etherealTransporter.sendMail({
      from: '"Orbit" <noreply@orbit.com>',
      to,
      subject,
      text,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
    console.log(`[OTP-Fallback] Ethereal email sent to ${to}`);
    console.log(`[OTP-Fallback] Preview URL: ${previewUrl}`);
    return { success: true, isDemo: true, previewUrl };
  } catch (err) {
    console.error("[OTP-Fallback] Ethereal email fallback failed:", err);
    return { success: false, isDemo: true };
  }
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

    if (process.env.NODE_ENV === "development") {
      console.log(`[OTP] Generated: ${normalizedEmail} → ${otp}`);
    }

    // Send the email
    const emailResult = await sendOtpEmail(normalizedEmail, otp);

    const responsePayload: Record<string, any> = {
      success: true,
      message: "OTP sent successfully",
    };

    // Only return demoOtp if we are running in fallback mode (no SMTP configured) and NOT in production or beta launch mode
    const isProductionOrBeta = process.env.NODE_ENV === "production" || process.env.PRODUCTION_BETA === "true";
    if (emailResult.isDemo && !isProductionOrBeta) {
      responsePayload.demoOtp = otp;
      if (emailResult.previewUrl) {
        responsePayload.previewUrl = emailResult.previewUrl;
      }
    }

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    console.error("[OTP API] Internal Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
