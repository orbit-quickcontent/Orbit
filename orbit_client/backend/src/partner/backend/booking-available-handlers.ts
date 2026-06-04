/**
 * Partner Backend | Available Bookings Handlers
 *
 * Get all available (dispatched) bookings for a partner:
 * - Finds all PENDING WorkDispatch records for the partner
 * - Includes booking details + package info
 *
 * Re-exported by: src/app/api/bookings/available/route.ts
 * Category: Partner Backend
 */

import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get('partnerId')

    if (!partnerId) {
      return NextResponse.json(
        { error: 'partnerId query parameter is required' },
        { status: 400 }
      )
    }

    // Check if partner exists in DB — if not, return empty list
    // (partnerId may be a client-generated ID before DB registration)
    const partner = await db.partner.findUnique({
      where: { id: partnerId },
    })

    if (!partner) {
      // Also try by userId in case the partnerId is a user ID
      const partnerByUser = await db.partner.findUnique({
        where: { userId: partnerId },
      })
      if (!partnerByUser) {
        return NextResponse.json({ availableBookings: [] })
      }
    }

    // Find all PENDING WorkDispatch records for this partner
    const pendingDispatches = await db.workDispatch.findMany({
      where: {
        partnerId,
        status: 'PENDING',
      },
      include: {
        booking: {
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
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        dispatchedAt: 'desc',
      },
    })

    const availableBookings = pendingDispatches.map((dispatch) => ({
      dispatchId: dispatch.id,
      round: dispatch.round,
      dispatchedAt: dispatch.dispatchedAt,
      booking: dispatch.booking,
    }))

    return NextResponse.json({ availableBookings })
  } catch (error) {
    console.error('Error fetching available bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available bookings' },
      { status: 500 }
    )
  }
}
