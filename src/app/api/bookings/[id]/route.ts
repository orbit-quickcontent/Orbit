import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

interface UpdateBookingBody {
  status?: string
  paymentStatus?: string
  syncPercentage?: number
  editCountdown?: number | null
  partnerId?: string | null
  location?: string
  notes?: string
  timeSlot?: string
  bookingDate?: string
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            location: true,
            brandLogo: true,
            brandFont: true,
            brandPalette: true,
            avatar: true,
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
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateBookingBody = await request.json()

    // Verify booking exists
    const existing = await db.booking.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Build update data object
    const updateData: Record<string, unknown> = {}

    if (body.status !== undefined) updateData.status = body.status
    if (body.paymentStatus !== undefined) updateData.paymentStatus = body.paymentStatus
    if (body.syncPercentage !== undefined) updateData.syncPercentage = body.syncPercentage
    if (body.editCountdown !== undefined) updateData.editCountdown = body.editCountdown
    if (body.partnerId !== undefined) updateData.partnerId = body.partnerId
    if (body.location !== undefined) updateData.location = body.location
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.timeSlot !== undefined) updateData.timeSlot = body.timeSlot
    if (body.bookingDate !== undefined) updateData.bookingDate = new Date(body.bookingDate)

    // If status is DELIVERED, set deliveredAt
    if (body.status === 'DELIVERED') {
      updateData.deliveredAt = new Date()
    }

    const booking = await db.booking.update({
      where: { id },
      data: updateData,
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
    })

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
