/**
 * Client Backend | Booking Detail Handlers
 *
 * Individual booking business logic:
 * - GET   — Get booking with full details (user, package, partner)
 * - PATCH — Update booking (status, payment, sync, partner assignment)
 *           Includes wallet crediting on DELIVERED and re-dispatch on PARTNER cancel
 *
 * Re-exported by: src/app/api/bookings/[id]/route.ts
 */

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
  cancelledBy?: string // CLIENT or PARTNER
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
            brandColor: true,
            editorRequirements: true,
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

    // Verify booking exists with package info for wallet crediting
    const existing = await db.booking.findUnique({
      where: { id },
      include: { package: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // ── Handle PARTNER cancellation with re-dispatch ──
    if (body.status === 'CANCELLED' && body.cancelledBy === 'PARTNER') {
      // 1. Set cancelledBy = "PARTNER"
      // 2. Clear partnerId from booking
      // 3. Reset status to PAID (so it can be re-dispatched)
      const cancelledPartnerId = existing.partnerId

      await db.booking.update({
        where: { id },
        data: {
          cancelledBy: 'PARTNER',
          partnerId: null,
          status: 'PAID',
        },
      })

      // Cancel any PENDING work dispatches for this booking
      await db.workDispatch.updateMany({
        where: {
          bookingId: id,
          status: 'PENDING',
        },
        data: {
          status: 'CANCELLED',
          respondedAt: new Date(),
        },
      })

      // Auto-trigger dispatch to 5 new partners
      try {
        // Parse declinedBy to exclude already-declined partners
        let declinedBy: string[] = []
        if (existing.declinedBy) {
          try {
            declinedBy = JSON.parse(existing.declinedBy)
          } catch {
            declinedBy = []
          }
        }
        // Also exclude the cancelling partner
        if (cancelledPartnerId && !declinedBy.includes(cancelledPartnerId)) {
          declinedBy.push(cancelledPartnerId)
        }

        const availablePartners = await db.partner.findMany({
          where: {
            availability: true,
            id: { notIn: declinedBy },
          },
        })

        if (availablePartners.length > 0) {
          const newRound = existing.dispatchRound + 1
          const partnersToDispatch = availablePartners.slice(0, 5)

          await Promise.all(
            partnersToDispatch.map((partner) =>
              db.workDispatch.create({
                data: {
                  bookingId: id,
                  partnerId: partner.id,
                  status: 'PENDING',
                  round: newRound,
                },
              })
            )
          )

          await db.booking.update({
            where: { id },
            data: {
              dispatchRound: newRound,
              status: 'PARTNER_DISPATCHED',
              declinedBy: JSON.stringify(declinedBy),
            },
          })

          // Notify WebSocket
          const partnerIds = partnersToDispatch.map((p) => p.id)
          try {
            await fetch('http://localhost:3003/internal/dispatch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                bookingId: id,
                partnerIds,
                round: newRound,
              }),
            })
          } catch (wsError) {
            console.error('Failed to notify WebSocket for re-dispatch:', wsError)
          }
        }
      } catch (reDispatchError) {
        console.error('Error during auto re-dispatch after cancellation:', reDispatchError)
      }

      const reDispatchedBooking = await db.booking.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          package: true,
          partner: {
            include: {
              user: {
                select: { id: true, name: true, phone: true },
              },
            },
          },
        },
      })

      return NextResponse.json({ booking: reDispatchedBooking, reDispatched: true })
    }

    // ── Build normal update data object ──
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
    if (body.cancelledBy !== undefined) updateData.cancelledBy = body.cancelledBy

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

    // ── Handle DELIVERED: credit partner wallet ──
    if (body.status === 'DELIVERED' && booking.partnerId) {
      const packagePrice = booking.package?.price ?? 0
      const partnerId = booking.partnerId

      // Add package price to partner wallet
      const partner = await db.partner.findUnique({
        where: { id: partnerId },
      })

      if (partner) {
        await db.partner.update({
          where: { id: partnerId },
          data: {
            walletBalance: partner.walletBalance + packagePrice,
            completedProjects: partner.completedProjects + 1,
          },
        })

        // Create Transaction record
        await db.transaction.create({
          data: {
            partnerId,
            bookingId: id,
            type: 'EARNING',
            amount: packagePrice,
            status: 'COMPLETED',
            description: `Earning for booking ${id.substring(0, 8)}... (${booking.package?.name ?? 'Package'})`,
          },
        })
      }
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
