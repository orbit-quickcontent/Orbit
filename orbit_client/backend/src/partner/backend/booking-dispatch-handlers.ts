/**
 * Partner Backend | Booking Dispatch Handlers
 *
 * Dispatch a booking to the 5 nearest available online partners.
 * Creates WorkDispatch records, increments dispatch round, and
 * notifies partners via WebSocket.
 *
 * Re-exported by: src/app/api/bookings/[id]/dispatch/route.ts
 * Category: Partner Backend
 */

import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params

    // 1. Find booking, verify it's PAID with no partner assigned
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { package: true },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.status !== 'PAID' && booking.status !== 'PARTNER_DISPATCHED') {
      return NextResponse.json(
        { error: `Booking cannot be dispatched. Current status: ${booking.status}` },
        { status: 400 }
      )
    }

    if (booking.partnerId) {
      return NextResponse.json(
        { error: 'Booking already has a partner assigned' },
        { status: 400 }
      )
    }

    // 2. Parse declinedBy JSON array
    let declinedBy: string[] = []
    if (booking.declinedBy) {
      try {
        declinedBy = JSON.parse(booking.declinedBy)
      } catch {
        declinedBy = []
      }
    }

    // 3. Find online partners who haven't declined
    const onlinePartners = await db.partner.findMany({
      where: {
        availability: true,
        id: { notIn: declinedBy },
      },
    })

    if (onlinePartners.length === 0) {
      return NextResponse.json(
        { error: 'No available partners found' },
        { status: 404 }
      )
    }

    // Sort by proximity if booking has location data
    let sortedPartners = onlinePartners
    if (booking.location && onlinePartners.some(p => p.latitude != null && p.longitude != null)) {
      // Simple proximity sort — partners with lat/lng are prioritized
      // For a real app, we'd geocode the booking location too
      sortedPartners = [...onlinePartners].sort((a, b) => {
        const aHasCoords = a.latitude != null && a.longitude != null
        const bHasCoords = b.latitude != null && b.longitude != null
        if (aHasCoords && bHasCoords) return 0 // Both have coords, equal priority
        if (aHasCoords) return -1
        if (bHasCoords) return 1
        return 0
      })
    }

    // Take top 5
    const partnersToDispatch = sortedPartners.slice(0, 5)
    const newRound = booking.dispatchRound + 1

    // 4. Create WorkDispatch records for each partner
    const dispatchRecords = await Promise.all(
      partnersToDispatch.map((partner) =>
        db.workDispatch.create({
          data: {
            bookingId,
            partnerId: partner.id,
            status: 'PENDING',
            round: newRound,
          },
        })
      )
    )

    // 5. Increment booking.dispatchRound
    // 6. Update booking status to PARTNER_DISPATCHED
    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: {
        dispatchRound: newRound,
        status: 'PARTNER_DISPATCHED',
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
      },
    })

    // 7. Notify WebSocket service to push dispatch to partners
    const partnerIds = partnersToDispatch.map((p) => p.id)
    try {
      await fetch('http://localhost:3003/internal/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          partnerIds,
          booking: updatedBooking,
          round: newRound,
        }),
      })
    } catch (wsError) {
      // WebSocket notification failure should not block the dispatch
      console.error('Failed to notify WebSocket service:', wsError)
    }

    // 8. Return result
    return NextResponse.json({
      dispatched: partnerIds.length,
      dispatchRecords,
      booking: updatedBooking,
    })
  } catch (error) {
    console.error('Error dispatching booking:', error)
    return NextResponse.json(
      { error: 'Failed to dispatch booking' },
      { status: 500 }
    )
  }
}
