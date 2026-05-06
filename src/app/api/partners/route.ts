import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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
    const { userId, location, latitude, longitude, deviceInfo } = body;

    if (!userId || !location) {
      return NextResponse.json(
        { error: "userId and location are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is already a partner
    const existingPartner = await db.partner.findUnique({
      where: { userId },
    });
    if (existingPartner) {
      return NextResponse.json(
        { error: "User is already a partner" },
        { status: 409 }
      );
    }

    // Create partner and update user role
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

    // Update user role to PARTNER
    await db.user.update({
      where: { id: userId },
      data: { role: "PARTNER" },
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
