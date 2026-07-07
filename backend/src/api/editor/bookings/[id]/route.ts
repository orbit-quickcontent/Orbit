import { NextRequest, NextResponse } from "next/server";
import { firestoreDb } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;

    const booking = await firestoreDb.bookings.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const client = await firestoreDb.clientUsers.findUnique({
      where: { id: booking.userId }
    });

    const pkg = await firestoreDb.packages.findUnique({
      where: { id: booking.packageId }
    });

    let footageUrls: any[] = [];
    if (booking.footageUrls) {
      try {
        footageUrls = JSON.parse(booking.footageUrls);
      } catch (_) {
        if (typeof booking.footageUrls === "string") {
          footageUrls = [booking.footageUrls];
        }
      }
    }

    let proxyFootageUrls: any[] = [];
    if (booking.proxyFootageUrl) {
      try {
        proxyFootageUrls = JSON.parse(booking.proxyFootageUrl);
      } catch (_) {
        if (typeof booking.proxyFootageUrl === "string") {
          proxyFootageUrls = [booking.proxyFootageUrl];
        }
      }
    }

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        footageUrls,
        proxyFootageUrls,
        client: client ? {
          id: client.id,
          name: client.name || "Client",
          email: client.email,
          brandColor: client.brandColor,
          brandFont: client.brandFont,
          brandLogo: client.brandLogo,
          editorRequirements: client.editorRequirements
        } : null,
        package: pkg
      }
    });
  } catch (error) {
    console.error("Error fetching booking details for editor:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking details" },
      { status: 500 }
    );
  }
}
