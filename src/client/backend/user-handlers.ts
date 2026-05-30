/**
 * Client Backend | User Handlers
 *
 * User management business logic:
 * - GET  — List all users with booking counts
 * - POST — Create a new user (email required, unique)
 *
 * Re-exported by: src/app/api/users/route.ts
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET — List users
export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        location: true,
        role: true,
        brandLogo: true,
        brandFont: true,
        brandColor: true,
        editorRequirements: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const usersWithStats = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      location: user.location,
      role: user.role,
      brandLogo: user.brandLogo,
      brandFont: user.brandFont,
      brandColor: user.brandColor,
      editorRequirements: user.editorRequirements,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      totalBookings: user._count.bookings,
    }));

    return NextResponse.json({ users: usersWithStats });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST — Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, location, role, brandLogo, brandFont, brandColor, editorRequirements } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const user = await db.user.create({
      data: {
        email,
        name: name ?? null,
        phone: phone ?? null,
        location: location ?? null,
        role: role ?? "USER",
        brandLogo: brandLogo ?? null,
        brandFont: brandFont ?? null,
        brandColor: brandColor ?? null,
        editorRequirements: editorRequirements ?? null,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
