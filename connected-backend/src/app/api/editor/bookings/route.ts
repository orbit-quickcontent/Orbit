import { NextRequest, NextResponse } from "next/server";
import { firestoreDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const editorId = searchParams.get("editorId") || "editor_1";

    const bookings = await firestoreDb.bookings.findMany({
      where: {
        editorId: editorId
      }
    });

    let targetBookings = bookings;
    if (targetBookings.length === 0) {
      targetBookings = await firestoreDb.bookings.findMany({
        where: {
          status: "EDITING"
        }
      });
      // Mock-assign to this editor for the demonstration
      await Promise.all(
        targetBookings.map(b => 
          firestoreDb.bookings.update({
            where: { id: b.id },
            data: { editorId }
          })
        )
      );
    }

    // Resolve client details
    const resolvedBookings = await Promise.all(
      targetBookings.map(async (booking) => {
        const client = await firestoreDb.clientUsers.findUnique({
          where: { id: booking.userId }
        });
        const pkg = await firestoreDb.packages.findUnique({
          where: { id: booking.packageId }
        });
        
        return {
          ...booking,
          client: client ? {
            id: client.id,
            name: client.name || "Client",
            email: client.email,
            phone: client.phone || "N/A",
            brandColor: client.brandColor,
            brandFont: client.brandFont,
            brandLogo: client.brandLogo,
            editorRequirements: client.editorRequirements
          } : null,
          package: pkg
        };
      })
    );

    return NextResponse.json({ success: true, bookings: resolvedBookings });
  } catch (error) {
    console.error("Error fetching editor bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
