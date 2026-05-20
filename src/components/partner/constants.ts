/**
 * 🟣 PARTNER FRONTEND | Constants
 * 
 * Shared constants for the partner frontend: shot list definitions,
 * mock available bookings, and mock completed history for the partner dashboard.
 * 
 * Used by: partner-dashboard.tsx, shooting-phase.tsx
 * Category: Partner UI
 */

import { type BookingInfo } from "@/lib/types";

export const SHOT_LIST = [
  { id: "shot-1", name: "Establishing Shot", description: "Wide angle of location/venue" },
  { id: "shot-2", name: "Subject Intro", description: "Introduction of the main subject" },
  { id: "shot-3", name: "Action Sequence", description: "Key moments and activity" },
  { id: "shot-4", name: "B-Roll", description: "Detail shots and cutaway footage" },
  { id: "shot-5", name: "Closing Shot", description: "Final frame and wrap-up" },
];

export const MOCK_AVAILABLE_BOOKINGS: BookingInfo[] = [
  {
    id: "OL-AVAIL001", packageId: "pkg-professional", packageName: "Professional (UGC)",
    packagePrice: 4999, status: "PAID", paymentStatus: "SUCCESS",
    bookingDate: new Date(Date.now() + 86400000).toISOString(), timeSlot: "10:00 AM",
    location: "Connaught Place, New Delhi", syncPercentage: 0, editCountdown: null,
    partnerName: null, notes: "Brand shoot for tech startup. Need corporate aesthetic.",
  },
  {
    id: "OL-AVAIL002", packageId: "pkg-personalized", packageName: "Personalized",
    packagePrice: 1999, status: "PAID", paymentStatus: "SUCCESS",
    bookingDate: new Date(Date.now() + 86400000).toISOString(), timeSlot: "02:00 PM",
    location: "Juhu Beach, Mumbai", syncPercentage: 0, editCountdown: null,
    partnerName: null, notes: "Pre-wedding candid reel. Golden hour preferred.",
  },
  {
    id: "OL-AVAIL003", packageId: "pkg-professional", packageName: "Professional (UGC)",
    packagePrice: 4999, status: "PAID", paymentStatus: "SUCCESS",
    bookingDate: new Date(Date.now() + 172800000).toISOString(), timeSlot: "11:00 AM",
    location: "Koramangala, Bangalore", syncPercentage: 0, editCountdown: null,
    partnerName: null, notes: "Product launch video. Brand assets will be shared.",
  },
];

export interface CompletedWorkEntry {
  id: string;
  packageName: string;
  amount: number;
  completedDate: string;
  location: string;
  timeSlot: string;
  category: "UGC" | "Personalized" | "Event";
}

export const MOCK_COMPLETED_HISTORY: CompletedWorkEntry[] = [
  {
    id: "OL-1001",
    packageName: "Professional (UGC)",
    amount: 4999,
    completedDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    location: "Bandra, Mumbai",
    timeSlot: "09:00 AM",
    category: "UGC",
  },
  {
    id: "OL-1002",
    packageName: "Personalized",
    amount: 1999,
    completedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    location: "Hauz Khas, Delhi",
    timeSlot: "04:00 PM",
    category: "Personalized",
  },
  {
    id: "OL-1003",
    packageName: "Professional (UGC)",
    amount: 4999,
    completedDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    location: "Indiranagar, Bangalore",
    timeSlot: "11:00 AM",
    category: "UGC",
  },
  {
    id: "OL-1004",
    packageName: "Personalized",
    amount: 1999,
    completedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    location: "Marina Beach, Chennai",
    timeSlot: "06:00 PM",
    category: "Personalized",
  },
  {
    id: "OL-1005",
    packageName: "Professional (UGC)",
    amount: 4999,
    completedDate: new Date(Date.now() - 86400000 * 8).toISOString(),
    location: "MG Road, Pune",
    timeSlot: "10:00 AM",
    category: "UGC",
  },
  {
    id: "OL-1006",
    packageName: "Personalized",
    amount: 1999,
    completedDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    location: "Park Street, Kolkata",
    timeSlot: "03:00 PM",
    category: "Personalized",
  },
  {
    id: "OL-1007",
    packageName: "Professional (UGC)",
    amount: 4999,
    completedDate: new Date(Date.now() - 86400000 * 14).toISOString(),
    location: "Cyber City, Gurgaon",
    timeSlot: "01:00 PM",
    category: "UGC",
  },
  {
    id: "OL-1008",
    packageName: "Personalized",
    amount: 1999,
    completedDate: new Date(Date.now() - 86400000 * 18).toISOString(),
    location: "Jubilee Hills, Hyderabad",
    timeSlot: "05:00 PM",
    category: "Personalized",
  },
  {
    id: "OL-1009",
    packageName: "Professional (UGC)",
    amount: 4999,
    completedDate: new Date(Date.now() - 86400000 * 22).toISOString(),
    location: "Salt Lake, Kolkata",
    timeSlot: "09:30 AM",
    category: "UGC",
  },
  {
    id: "OL-1010",
    packageName: "Personalized",
    amount: 1999,
    completedDate: new Date(Date.now() - 86400000 * 28).toISOString(),
    location: "Vashi, Navi Mumbai",
    timeSlot: "02:30 PM",
    category: "Personalized",
  },
];
