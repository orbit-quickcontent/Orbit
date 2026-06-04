/**
 * Backend API | Booking Sync Complete Handler
 *
 * This endpoint is called when the partner finishes uploading all raw footage files.
 * It updates the booking status to EDITING, credits the partner's wallet, records the
 * transaction, and broadcasts the status update.
 *
 * Endpoint: POST /api/bookings/[id]/sync-complete
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;
    const body = await request.json();
    const { footageUrls, fileName, fileSize } = body;

    if (!Array.isArray(footageUrls) || footageUrls.length === 0) {
      return NextResponse.json(
        { error: "footageUrls array is required and cannot be empty" },
        { status: 400 }
      );
    }

    // 1. Fetch booking with package and user details
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        package: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            brandLogo: true,
            brandFont: true,
            brandColor: true,
            editorRequirements: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (!booking.partnerId) {
      return NextResponse.json(
        { error: "No partner assigned to this booking" },
        { status: 400 }
      );
    }

    // Check if partner has already been credited (e.g., if status is already EDITING or later)
    const alreadyCredited = booking.status === "EDITING" || booking.status === "DELIVERED";

    // 2. Update booking: status to EDITING, syncPercentage to 100, save footageUrls
    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: {
        status: "EDITING",
        syncPercentage: 100,
        footageUrls: JSON.stringify(footageUrls),
      },
      include: {
        package: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            brandLogo: true,
            brandFont: true,
            brandColor: true,
            editorRequirements: true,
          },
        },
        partner: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    // 3. Credit Partner's Wallet in database if not already done
    if (!alreadyCredited) {
      const packagePrice = booking.package?.price ?? 0;
      const partner = await db.partner.findUnique({
        where: { id: booking.partnerId },
      });

      if (partner) {
        await db.partner.update({
          where: { id: booking.partnerId },
          data: {
            walletBalance: partner.walletBalance + packagePrice,
            completedProjects: partner.completedProjects + 1,
          },
        });

        // Record the Earning Transaction
        await db.transaction.create({
          data: {
            partnerId: booking.partnerId,
            bookingId: bookingId,
            type: "EARNING",
            amount: packagePrice,
            status: "COMPLETED",
            description: `Earning for booking ${bookingId.substring(0, 8)}... (${booking.package?.name ?? "Package"})`,
          },
        });
      }
    }

    // 4. Notify WebSocket service about status change to EDITING
    try {
      await fetch("http://localhost:3003/internal/notify-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          event: "booking:status-update",
          payload: {
            bookingId,
            status: "EDITING",
            previousStatus: booking.status,
          },
        }),
      });
    } catch (wsError) {
      console.error("Failed to notify WebSocket service of sync-complete:", wsError);
    }

    // Return the editor metadata dashboard item payload
    return NextResponse.json({
      success: true,
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
        syncPercentage: updatedBooking.syncPercentage,
        footageUrls,
        fileName: fileName || (footageUrls[footageUrls.length - 1]?.split("/").pop() ?? ""),
        fileSize: fileSize || 0,
        editorRequirements: updatedBooking.user?.editorRequirements || "",
        brandLogo: updatedBooking.user?.brandLogo || null,
        brandFont: updatedBooking.user?.brandFont || null,
        brandColor: updatedBooking.user?.brandColor || null,
        createdAt: updatedBooking.createdAt,
        updatedAt: updatedBooking.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in sync-complete handler:", error);
    return NextResponse.json(
      { error: "Failed to complete sync" },
      { status: 500 }
    );
  }
}
