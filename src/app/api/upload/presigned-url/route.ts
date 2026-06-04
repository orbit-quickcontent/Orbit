/**
 * Backend API | S3 Pre-signed URL Generator (Mock)
 *
 * Generates mock pre-signed upload URLs for partners to upload raw video footage
 * directly to a mock local cloud storage endpoint.
 *
 * Endpoint: POST /api/upload/presigned-url
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, contentType, bookingId } = body;

    if (!filename || !bookingId) {
      return NextResponse.json(
        { error: "filename and bookingId are required" },
        { status: 400 }
      );
    }

    // Generate target key: bookings/[bookingId]/[filename]
    const key = `bookings/${bookingId}/${filename}`;
    
    // For local dev, return a relative URL targeting our mock S3 PUT receiver route
    const mockPresignedUrl = `/api/upload/mock-s3?key=${encodeURIComponent(key)}&bookingId=${bookingId}`;

    return NextResponse.json({
      url: mockPresignedUrl,
      key,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
