/**
 * 🔴 BACKEND | Health Check API
 * 
 * Root API endpoint for health checks.
 * - GET /api — Returns a simple health check response.
 * 
 * Category: Backend API
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "Orbit API", version: "1.0" });
}