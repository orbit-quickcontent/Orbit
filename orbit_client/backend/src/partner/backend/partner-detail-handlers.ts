/**
 * Partner Backend | Partner Detail Handlers
 *
 * Individual partner endpoints:
 * - GET   — Get partner with bookings, active/completed counts, and earnings
 * - PATCH — Update partner (availability, location, device info, rating)
 *
 * Used by: /api/partners/[id] route
 * Category: Partner Backend
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/partners/[id] — Get specific partner with their bookings
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const partner = await db.partner.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            location: true,
            avatar: true,
            brandLogo: true,
            brandFont: true,
            brandColor: true,
            editorRequirements: true,
          },
        },
        bookings: {
          include: {
            package: {
              select: {
                name: true,
                tier: true,
                price: true,
              },
            },
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!partner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    const activeBookings = partner.bookings.filter(
      (b) =>
        b.status === "PARTNER_DISPATCHED" ||
        b.status === "SHOOTING" ||
        b.status === "SYNCING"
    );

    const completedBookings = partner.bookings.filter(
      (b) => b.status === "DELIVERED"
    );

    return NextResponse.json({
      partner: {
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
        activeBookings,
        completedBookings,
        stats: {
          totalBookings: partner.bookings.length,
          activeCount: activeBookings.length,
          completedCount: completedBookings.length,
          totalEarnings: completedBookings.reduce(
            (sum, b) => sum + (b.package?.price ?? 0),
            0
          ),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching partner:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner" },
      { status: 500 }
    );
  }
}

// PATCH /api/partners/[id] — Update partner (availability, location, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if partner exists
    const existingPartner = await db.partner.findUnique({ where: { id } });
    if (!existingPartner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

     const updateData: {
      availability?: boolean;
      location?: string;
      latitude?: number | null;
      longitude?: number | null;
      deviceInfo?: string | null;
      rating?: number;
      completedProjects?: number;
      bankName?: string | null;
      accountNumber?: string | null;
      ifscCode?: string | null;
      accountHolderName?: string | null;
      bankVerified?: boolean;
    } = {};

    if (typeof body.availability === "boolean") {
      updateData.availability = body.availability;
    }
    if (body.location !== undefined) {
      updateData.location = body.location;
    }
    if (body.latitude !== undefined) {
      updateData.latitude = body.latitude;
    }
    if (body.longitude !== undefined) {
      updateData.longitude = body.longitude;
    }
    if (body.deviceInfo !== undefined) {
      updateData.deviceInfo = body.deviceInfo;
    }
    if (typeof body.rating === "number") {
      updateData.rating = body.rating;
    }
    if (typeof body.completedProjects === "number") {
      updateData.completedProjects = body.completedProjects;
    }
    if (body.bankName !== undefined) {
      updateData.bankName = body.bankName;
    }
    if (body.accountNumber !== undefined) {
      updateData.accountNumber = body.accountNumber;
    }
    if (body.ifscCode !== undefined) {
      updateData.ifscCode = body.ifscCode;
    }
    if (body.accountHolderName !== undefined) {
      updateData.accountHolderName = body.accountHolderName;
    }
    if (typeof body.bankVerified === "boolean") {
      updateData.bankVerified = body.bankVerified;
    }

    const updatedPartner = await db.partner.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ partner: updatedPartner });
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { error: "Failed to update partner" },
      { status: 500 }
    );
  }
}
