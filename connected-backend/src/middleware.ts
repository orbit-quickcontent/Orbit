import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "orbit-super-secret-jwt-key",
  });

  const { pathname } = request.nextUrl;

  // Protect Admin dashboard & admin APIs
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!token) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "ADMIN") {
      const unauthorizedUrl = new URL("/", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Protect partner APIs
  if (pathname.startsWith("/api/partners") && request.method !== "POST") {
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
  }

  // Protect client bookings APIs
  if (pathname.startsWith("/api/bookings")) {
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// Specify matchers for routes to run middleware
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/bookings/:path*",
    "/api/partners/:path*",
  ],
};
