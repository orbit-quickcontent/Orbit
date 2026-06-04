/**
 * Admin Backend | Onboarded Directory Aggregator API
 *
 * Aggregates onboarded partners and clients directory, showing verification status,
 * booking summaries, ratings, and system-wide statistics for admin dashboards.
 *
 * Endpoint: GET /api/admin/onboarded-directory
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // 1. Fetch system-wide metrics
    const totalPartners = await db.partner.count();
    const verifiedPartners = await db.partner.count({ where: { isVerified: true } });
    const onlinePartners = await db.partner.count({ where: { availability: true } });
    const totalClients = await db.user.count({ where: { role: "USER" } });
    const totalBookings = await db.booking.count();

    // 2. Fetch partners with their user profiles and booking stats
    const partners = await db.partner.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        bookings: {
          select: {
            id: true,
            status: true,
            package: {
              select: {
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const partnerDirectory = partners.map((p) => {
      const completed = p.bookings.filter((b) => b.status === "DELIVERED");
      const active = p.bookings.filter(
        (b) => b.status !== "DELIVERED" && b.status !== "CANCELLED" && b.status !== "PENDING"
      );
      const totalEarnings = completed.reduce((sum, b) => sum + (b.package?.price || 0), 0);

      return {
        id: p.id,
        userId: p.userId,
        name: p.user?.name || "N/A",
        email: p.user?.email || "N/A",
        phone: p.user?.phone || "N/A",
        avatar: p.user?.avatar,
        location: p.location,
        isVerified: p.isVerified,
        availability: p.availability ? "ONLINE" : "OFFLINE",
        rating: p.rating,
        completedProjects: p.completedProjects,
        deviceInfo: p.deviceInfo,
        walletBalance: p.walletBalance,
        totalWithdrawn: p.totalWithdrawn,
        stats: {
          totalBookings: p.bookings.length,
          completedBookings: completed.length,
          activeBookings: active.length,
          totalEarnings,
        },
        createdAt: p.createdAt,
      };
    });

    // 3. Fetch clients with their booking stats
    const clients = await db.user.findMany({
      where: { role: "USER" },
      include: {
        bookings: {
          select: {
            id: true,
            status: true,
            package: {
              select: {
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const clientDirectory = clients.map((c) => {
      const completed = c.bookings.filter((b) => b.status === "DELIVERED");
      const spent = completed.reduce((sum, b) => sum + (b.package?.price || 0), 0);

      return {
        id: c.id,
        name: c.name || "N/A",
        email: c.email || "N/A",
        phone: c.phone || "N/A",
        avatar: c.avatar,
        brandLogo: c.brandLogo,
        brandFont: c.brandFont,
        brandColor: c.brandColor,
        createdAt: c.createdAt,
        stats: {
          totalBookings: c.bookings.length,
          completedBookings: completed.length,
          totalSpent: spent,
        },
      };
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalPartners,
        verifiedPartners,
        onlinePartners,
        verificationRate: totalPartners > 0 ? (verifiedPartners / totalPartners) * 100 : 0,
        totalClients,
        totalBookings,
      },
      partners: partnerDirectory,
      clients: clientDirectory,
    });
  } catch (error) {
    console.error("Error aggregating admin onboarded-directory:", error);
    return NextResponse.json(
      { error: "Failed to aggregate directory data" },
      { status: 500 }
    );
  }
}
