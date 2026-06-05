/**
 * Client Backend | Payment Handlers
 *
 * Payment processing business logic using Firestore:
 * - POST — Initiate payment for a booking
 *   Sets paymentStatus to PROCESSING, then asynchronously to SUCCESS.
 *   Triggers the booking pipeline.
 *
 * Re-exported by: src/app/api/bookings/[id]/payment/route.ts
 */

import { firestoreDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verify booking exists
    const booking = await firestoreDb.bookings.findUnique({
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
    await firestoreDb.bookings.update({
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
        await firestoreDb.bookings.update({
          where: { id },
          data: {
            paymentStatus: 'SUCCESS',
            status: 'PAID',
          },
        })

        // Automatically trigger dispatch once paid
        try {
          await fetch(`http://localhost:3000/api/bookings/${id}/dispatch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (dispatchErr) {
          console.error('Failed to trigger automatic dispatch:', dispatchErr)
        }
      } catch (err) {
        console.error('Error processing payment:', err)
        await firestoreDb.bookings.update({
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
