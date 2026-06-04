/**
 * Client Backend | Booking List Handlers
 *
 * Booking list business logic:
 * - GET  — List all bookings with user, package, and partner info
 * - POST — Create a new booking (userId, packageId, bookingDate, timeSlot required)
 *
 * Re-exported by: src/app/api/bookings/route.ts
 */

import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { validateBody, bookingSchema } from '@/lib/validation'
import { logAudit } from '@/lib/auth-server'

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
    const body = await request.json()

    // 1. Zod input validation
    const validation = validateBody(bookingSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      )
    }

    const { userId, packageId, bookingDate, timeSlot, location, notes } = validation.data

    // 2. Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 3. Verify package exists
    const pkg = await db.package.findUnique({
      where: { id: packageId },
    })

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    const booking = await db.booking.create({
      data: {
        userId,
        packageId,
        bookingDate: new Date(bookingDate),
        timeSlot,
        location: location || null,
        notes: notes || null,
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

    // 4. Record audit log
    await logAudit({
      userId,
      action: "CREATE_BOOKING",
      entity: "Booking",
      entityId: booking.id,
      details: { packageId, bookingDate, timeSlot },
      req: request,
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
