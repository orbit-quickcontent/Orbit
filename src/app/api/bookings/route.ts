/**
 * 🔴 BACKEND | Bookings API
 * 
 * Booking management endpoints:
 * - GET  /api/bookings — List all bookings with user, package, and partner info
 * - POST /api/bookings — Create a new booking (userId, packageId, bookingDate, timeSlot required)
 * 
 * Used by: booking-flow.tsx (booking creation during payment)
 * Category: Backend API
 */

import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

interface CreateBookingBody {
  userId: string
  packageId: string
  bookingDate: string
  timeSlot: string
  location?: string
  notes?: string
}

export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        package: true,
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
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBookingBody = await request.json()

    // Validate required fields
    if (!body.userId || !body.packageId || !body.bookingDate || !body.timeSlot) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, packageId, bookingDate, timeSlot' },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: body.userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify package exists
    const pkg = await db.package.findUnique({
      where: { id: body.packageId },
    })

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    const booking = await db.booking.create({
      data: {
        userId: body.userId,
        packageId: body.packageId,
        bookingDate: new Date(body.bookingDate),
        timeSlot: body.timeSlot,
        location: body.location || null,
        notes: body.notes || null,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        syncPercentage: 0,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        package: true,
      },
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
