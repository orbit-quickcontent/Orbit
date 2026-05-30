/**
 * Client Backend | Payment Handlers
 *
 * Payment processing business logic:
 * - POST — Initiate payment for a booking
 *   Sets paymentStatus to PROCESSING, then asynchronously to SUCCESS.
 *   Triggers the booking pipeline (partner dispatch → shooting → syncing → editing → delivered).
 *
 * Re-exported by: src/app/api/bookings/[id]/payment/route.ts
 */

import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// Status progression pipeline for partner dispatch and shooting
const STATUS_PIPELINE: Record<string, string> = {
  PAID: 'PARTNER_DISPATCHED',
  PARTNER_DISPATCHED: 'EN_ROUTE',
  EN_ROUTE: 'SHOOTING',
  SHOOTING: 'SYNCING',
  SYNCING: 'EDITING',
  EDITING: 'DELIVERED',
}

// Delay in ms between each pipeline step (simulated)
const PIPELINE_STEP_DELAY = 8000 // 8 seconds per step for demo

async function progressBookingPipeline(bookingId: string, currentStatus: string) {
  let status = currentStatus

  while (STATUS_PIPELINE[status]) {
    // Wait for simulated delay
    await new Promise((resolve) => setTimeout(resolve, PIPELINE_STEP_DELAY))

    const nextStatus = STATUS_PIPELINE[status]

    const updateData: Record<string, unknown> = { status: nextStatus }

    // Assign a partner when dispatching
    if (nextStatus === 'PARTNER_DISPATCHED') {
      const availablePartner = await db.partner.findFirst({
        where: { availability: true },
      })
      if (availablePartner) {
        updateData.partnerId = availablePartner.id
      }
    }

    // Update sync percentage when syncing
    if (nextStatus === 'SYNCING') {
      updateData.syncPercentage = 25
      updateData.editCountdown = 90
    }

    // Progress sync percentage during editing
    if (nextStatus === 'EDITING') {
      updateData.syncPercentage = 75
      updateData.editCountdown = 30
    }

    // Mark as delivered
    if (nextStatus === 'DELIVERED') {
      updateData.syncPercentage = 100
      updateData.editCountdown = 0
      updateData.deliveredAt = new Date()
    }

    await db.booking.update({
      where: { id: bookingId },
      data: updateData,
    })

    status = nextStatus
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verify booking exists
    const booking = await db.booking.findUnique({
      where: { id },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if already paid
    if (booking.paymentStatus === 'SUCCESS' || booking.paymentStatus === 'PROCESSING') {
      return NextResponse.json(
        { error: `Payment already ${booking.paymentStatus.toLowerCase()}` },
        { status: 400 }
      )
    }

    // Simulate payment: set to PROCESSING
    await db.booking.update({
      where: { id },
      data: {
        paymentStatus: 'PROCESSING',
        paymentId: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        paymentMethod: 'razorpay',
      },
    })

    // Simulate payment delay then success (async, don't block the response)
    ;(async () => {
      try {
        // Simulate payment gateway delay (2 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Update payment status to SUCCESS and booking status to PAID
        await db.booking.update({
          where: { id },
          data: {
            paymentStatus: 'SUCCESS',
            status: 'PAID',
          },
        })

        // Trigger partner dispatch pipeline
        progressBookingPipeline(id, 'PAID').catch((err) => {
          console.error('Error in pipeline progression:', err)
        })
      } catch (err) {
        console.error('Error processing payment:', err)
        await db.booking.update({
          where: { id },
          data: { paymentStatus: 'FAILED' },
        }).catch(() => {})
      }
    })()

    return NextResponse.json({
      message: 'Payment initiated',
      bookingId: id,
      paymentStatus: 'PROCESSING',
    })
  } catch (error) {
    console.error('Error initiating payment:', error)
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}
