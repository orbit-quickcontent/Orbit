/**
 * Partner Backend | Partner Wallet Handlers
 *
 * GET  — Get partner wallet details (balance, pending, withdrawn, recent transactions)
 * POST — Partner withdrawal request
 *
 * Re-exported by: src/app/api/partners/[id]/wallet/route.ts (GET)
 *                src/app/api/partners/[id]/withdraw/route.ts (POST)
 * Category: Partner Backend
 */

import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/partners/[id]/wallet — Get partner wallet details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: partnerId } = await params

    const partner = await db.partner.findUnique({
      where: { id: partnerId },
    })

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      )
    }

    // Get recent transactions (last 20)
    const transactions = await db.transaction.findMany({
      where: { partnerId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({
      balance: partner.walletBalance,
      pendingClearance: partner.pendingClearance,
      totalWithdrawn: partner.totalWithdrawn,
      bankVerified: partner.bankVerified,
      bankName: partner.bankName,
      // Mask account number for security
      accountNumberMasked: partner.accountNumber
        ? `****${partner.accountNumber.slice(-4)}`
        : null,
      transactions,
    })
  } catch (error) {
    console.error('Error fetching wallet details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wallet details' },
      { status: 500 }
    )
  }
}

// POST /api/partners/[id]/withdraw — Partner withdrawal
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: partnerId } = await params
    const body = await request.json()
    const { amount } = body

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid withdrawal amount is required' },
        { status: 400 }
      )
    }

    // Minimum withdrawal check
    if (amount < 500) {
      return NextResponse.json(
        { error: 'Minimum withdrawal amount is ₹500' },
        { status: 400 }
      )
    }

    const partner = await db.partner.findUnique({
      where: { id: partnerId },
    })

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      )
    }

    // Verify bank account is linked
    if (!partner.bankVerified || !partner.accountNumber) {
      return NextResponse.json(
        { error: 'Bank account must be linked and verified before withdrawal' },
        { status: 400 }
      )
    }

    // Verify sufficient balance
    if (partner.walletBalance < amount) {
      return NextResponse.json(
        { error: `Insufficient balance. Current balance: ₹${partner.walletBalance}` },
        { status: 400 }
      )
    }

    // Deduct from walletBalance, add to totalWithdrawn
    const updatedPartner = await db.partner.update({
      where: { id: partnerId },
      data: {
        walletBalance: partner.walletBalance - amount,
        totalWithdrawn: partner.totalWithdrawn + amount,
      },
    })

    // Create Transaction record
    await db.transaction.create({
      data: {
        partnerId,
        type: 'WITHDRAWAL',
        amount: -amount,
        status: 'COMPLETED',
        description: `Withdrawal of ₹${amount} to ${partner.bankName} account ****${partner.accountNumber.slice(-4)}`,
      },
    })

    return NextResponse.json({
      success: true,
      newBalance: updatedPartner.walletBalance,
      withdrawnAmount: amount,
    })
  } catch (error) {
    console.error('Error processing withdrawal:', error)
    return NextResponse.json(
      { error: 'Failed to process withdrawal' },
      { status: 500 }
    )
  }
}
