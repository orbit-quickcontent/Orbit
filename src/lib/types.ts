/**
 * ═══════════════════════════════════════════════════════════════
 *  Orbit — Shared Type Definitions
 * ═══════════════════════════════════════════════════════════════
 * 
 *  🔵 CLIENT types: AppView, BookingStatus, PaymentStatus,
 *     PackageInfo, BookingInfo, UserProfile
 * 
 *  🟣 PARTNER types: (uses BookingInfo, BookingStatus)
 * 
 *  🟡 SHARED types: UserRole
 * ═══════════════════════════════════════════════════════════════
 */

export type AppView = "landing" | "packages" | "booking" | "tracking" | "partner" | "partner-work" | "partner-earnings" | "profile";

export type BookingStatus =
  | "PENDING"
  | "PAID"
  | "PARTNER_DISPATCHED"
  | "EN_ROUTE"
  | "SHOOTING"
  | "SYNCING"
  | "EDITING"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED";

export type UserRole = "USER" | "PARTNER";

export type AppPhase = "splash" | "auth" | "app";

export interface PackageInfo {
  id: string;
  name: string;
  tier: string;
  price: number;
  focus: string;
  deliveryTime: string;
  features: string[];
  popular: boolean;
}

export interface BookingInfo {
  id: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  bookingDate: string;
  timeSlot: string;
  location: string;
  syncPercentage: number;
  editCountdown: number | null;
  partnerName: string | null;
  notes: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string | null;
  brandLogo: string | null;
  brandFont: string | null;
  brandColor: string | null;
  editorRequirements: string;
}

export interface ReviewInfo {
  bookingId: string;
  partnerRating: number;
  editorRating: number;
  feedback: string;
}
