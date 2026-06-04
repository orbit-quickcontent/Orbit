/**
 * Partner Backend | Partner List Handlers
 *
 * Partner list endpoints:
 * - GET  — List all partners with user info and booking stats
 * - POST — Create a new partner (links to existing user, updates user role)
 *
 * Used by: /api/partners route
 * Category: Partner Backend
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateBody, partnerSchema } from "@/lib/validation";
import { logAudit } from "@/lib/auth-server";

// GET /api/partners — List all partners with their user info and stats
export async function GET() {
  try {
    const partners = await db.partner.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        bookings: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const partnersWithStats = partners.map((partner) => ({
      id: partner.id,
      userId: partner.userId,
      location: partner.location,
      latitude: partner.latitude,
      longitude: partner.longitude,
      availability: partner.availability,
      rating: partner.rating,
      completedProjects: partner.completedProjects,
      deviceInfo: partner.deviceInfo,
      createdAt: partner.createdAt,
      updatedAt: partner.updatedAt,
      user: partner.user,
      stats: {
        totalBookings: partner.bookings.length,
        activeBookings: partner.bookings.filter(
          (b) => b.status === "SHOOTING" || b.status === "SYNCING"
        ).length,
        completedBookings: partner.bookings.filter(
          (b) => b.status === "DELIVERED"
        ).length,
      },
    }));

    return NextResponse.json({ partners: partnersWithStats });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}

// POST /api/partners — Create a new partner (link to existing user)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod input validation
    const validation = validateBody(partnerSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const { userId, location, latitude, longitude, deviceInfo } = validation.data;

    // 2. Check if user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 3. Check if user is already a partner
    const existingPartner = await db.partner.findUnique({
      where: { userId },
    });
    if (existingPartner) {
      return NextResponse.json(
        { error: "User is already a partner" },
        { status: 409 }
      );
    }

    // 4. Create partner and update user role
    const partner = await db.partner.create({
      data: {
        userId,
        location,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        deviceInfo: deviceInfo ?? null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });

    // 5. Update user role to PARTNER
    await db.user.update({
      where: { id: userId },
      data: { role: "PARTNER" },
    });

    // 6. Log audit event
    await logAudit({
      userId,
      action: "PARTNER_ONBOARD",
      entity: "Partner",
      entityId: partner.id,
      details: { userId, location },
      req: request,
    });

    return NextResponse.json({ partner }, { status: 201 });
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 }
    );
  }
}
