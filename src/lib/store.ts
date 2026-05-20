/**
 * 🟠 CORE | Zustand State Management
 * 
 * Central application state using Zustand with localStorage persistence.
 * Manages auth, navigation, user profile, packages, bookings, and partner state.
 * 
 * IMPORTANT: localStorage is read AFTER mount (via useHydrate hook) to avoid
 * server/client hydration mismatches.
 * 
 * Used by: page.tsx, client-app.tsx, partner-app.tsx, all components
 * Category: Core
 */

import { create } from "zustand";
import { type AppView, type AppPhase, type BookingStatus, type PaymentStatus, type UserRole, type PackageInfo, type BookingInfo, type UserProfile, type ReviewInfo } from "./types";

// ─── localStorage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY = "orbit-app-state";

function loadFromStorage(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveToStorage(state: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const toSave = {
      isAuthenticated: state.isAuthenticated,
      userRole: state.userRole,
      user: state.user,
      currentView: state.currentView,
      bookings: state.bookings,
      reviews: state.reviews,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch { /* ignore */ }
}

function clearStorage() {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

const defaultUser: UserProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  avatar: null,
  brandLogo: null,
  brandFont: null,
  brandColor: null,
  editorRequirements: "",
};

interface AppState {
  // Hydration
  _hydrated: boolean;
  _hydrate: () => void;

  // App phase
  appPhase: AppPhase;
  setAppPhase: (phase: AppPhase) => void;

  // Auth
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;

  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // User
  user: UserProfile;
  setUser: (user: Partial<UserProfile>) => void;

  // Packages
  packages: PackageInfo[];
  fetchPackages: () => Promise<void>;
  selectedPackage: PackageInfo | null;
  setSelectedPackage: (pkg: PackageInfo | null) => void;

  // Booking
  currentBooking: BookingInfo | null;
  setCurrentBooking: (booking: BookingInfo | null) => void;
  bookings: BookingInfo[];
  addBooking: (booking: BookingInfo) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  updateSyncPercentage: (id: string, percentage: number) => void;
  updateEditCountdown: (id: string, minutes: number) => void;
  completeBooking: (id: string) => void;

  // Partner
  partnerActiveBooking: BookingInfo | null;
  setPartnerActiveBooking: (booking: BookingInfo | null) => void;

  // Booking form
  bookingDate: Date | undefined;
  setBookingDate: (date: Date | undefined) => void;
  bookingTimeSlot: string;
  setBookingTimeSlot: (slot: string) => void;
  bookingLocation: string;
  setBookingLocation: (location: string) => void;
  bookingNotes: string;
  setBookingNotes: (notes: string) => void;

  // Reviews
  reviews: ReviewInfo[];
  submitReview: (review: ReviewInfo) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Hydration — starts false, set to true after localStorage is read
  _hydrated: false,
  _hydrate: () => {
    const stored = loadFromStorage();
    if (stored) {
      set({
        _hydrated: true,
        isAuthenticated: (stored.isAuthenticated as boolean) ?? false,
        userRole: (stored.userRole as UserRole) ?? "USER",
        user: (stored.user as UserProfile) ?? defaultUser,
        currentView: (stored.currentView as AppView) ?? "landing",
        bookings: (stored.bookings as BookingInfo[]) ?? [],
        reviews: (stored.reviews as ReviewInfo[]) ?? [],
        appPhase: stored.isAuthenticated ? "app" : "splash",
      });
    } else {
      set({ _hydrated: true });
    }
  },

  // App phase — always starts at "splash" on server, corrected after hydration
  appPhase: "splash",
  setAppPhase: (phase) => set({ appPhase: phase }),

  // Auth
  isAuthenticated: false,
  userRole: "USER",
  login: (role) => {
    const newState = {
      isAuthenticated: true,
      userRole: role,
      currentView: (role === "PARTNER" ? "partner" : "landing") as AppView,
      appPhase: "app" as AppPhase,
    };
    set(newState);
    saveToStorage({ ...get(), ...newState });
  },
  logout: () => {
    set({
      isAuthenticated: false,
      userRole: "USER" as UserRole,
      currentView: "landing" as AppView,
      currentBooking: null,
      partnerActiveBooking: null,
      appPhase: "auth" as AppPhase,
      user: defaultUser,
      bookings: [],
      reviews: [],
    });
    clearStorage();
  },

  // Navigation
  currentView: "landing",
  setCurrentView: (view) => set({ currentView: view }),

  // User
  user: defaultUser,
  setUser: (user) =>
    set((state) => {
      const newUser = { ...state.user, ...user };
      const newState = { user: newUser };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),

  // Packages
  packages: [
    {
      id: "pkg-personalized",
      name: "Personalized",
      tier: "PERSONALIZED",
      price: 1999,
      focus: "Individual/Event cinematic reels",
      deliveryTime: "60-120 mins",
      features: [
        "Professional cinematic edit",
        "1 Reel (up to 60 sec)",
        "Color grading & transitions",
        "Background music sync",
        "60-120 min delivery",
        "1 revision round",
      ],
      popular: false,
    },
    {
      id: "pkg-professional",
      name: "Professional (UGC)",
      tier: "PROFESSIONAL",
      price: 4999,
      focus: "Brand-focused storytelling with Brand DNA",
      deliveryTime: "60-120 mins",
      features: [
        "All Personalized features",
        "Brand DNA integration",
        "Logo/Font matching & Editor chat",
        "Up to 3 Reels (60 sec each)",
        "Multi-platform optimization",
        "2 revision rounds",
        "Priority editing queue",
      ],
      popular: true,
    },
  ],
  fetchPackages: async () => {
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const data = await res.json();
        if (data.packages && data.packages.length > 0) {
          const mapped: PackageInfo[] = data.packages.map((pkg: Record<string, unknown>) => ({
            id: pkg.id as string,
            name: pkg.name as string,
            tier: pkg.tier as string,
            price: pkg.price as number,
            focus: pkg.focus as string,
            deliveryTime: pkg.deliveryTime as string,
            features: Array.isArray(pkg.features) ? pkg.features as string[] : JSON.parse(pkg.features as string || '[]'),
            popular: pkg.popular as boolean,
          }));
          set({ packages: mapped });
        }
      }
    } catch {
      // Keep client-side defaults
    }
  },
  selectedPackage: null,
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),

  // Booking
  currentBooking: null,
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  bookings: [],
  addBooking: (booking) =>
    set((state) => {
      const newBookings = [...state.bookings, booking];
      saveToStorage({ ...get(), bookings: newBookings });
      return { bookings: newBookings };
    }),
  updateBookingStatus: (id, status) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status } : b
      ),
      currentBooking:
        state.currentBooking?.id === id
          ? { ...state.currentBooking, status }
          : state.currentBooking,
    })),
  updatePaymentStatus: (id, paymentStatus) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, paymentStatus } : b
      ),
      currentBooking:
        state.currentBooking?.id === id
          ? { ...state.currentBooking, paymentStatus }
          : state.currentBooking,
    })),
  updateSyncPercentage: (id, syncPercentage) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, syncPercentage } : b
      ),
      currentBooking:
        state.currentBooking?.id === id
          ? { ...state.currentBooking, syncPercentage }
          : state.currentBooking,
    })),
  updateEditCountdown: (id, editCountdown) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, editCountdown } : b
      ),
      currentBooking:
        state.currentBooking?.id === id
          ? { ...state.currentBooking, editCountdown }
          : state.currentBooking,
    })),
  completeBooking: (id) =>
    set((state) => {
      const updatedBookings = state.bookings.map((b) =>
        b.id === id ? { ...b, status: "DELIVERED" as BookingStatus } : b
      );
      const newState = {
        bookings: updatedBookings,
        currentBooking: null as BookingInfo | null,
      };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),

  // Partner
  partnerActiveBooking: null,
  setPartnerActiveBooking: (booking) => set({ partnerActiveBooking: booking }),

  // Booking form
  bookingDate: undefined,
  setBookingDate: (date) => set({ bookingDate: date }),
  bookingTimeSlot: "",
  setBookingTimeSlot: (slot) => set({ bookingTimeSlot: slot }),
  bookingLocation: "",
  setBookingLocation: (location) => set({ bookingLocation: location }),
  bookingNotes: "",
  setBookingNotes: (notes) => set({ bookingNotes: notes }),

  // Reviews
  reviews: [],
  submitReview: (review) =>
    set((state) => {
      const newReviews = [...state.reviews.filter((r) => r.bookingId !== review.bookingId), review];
      saveToStorage({ ...get(), reviews: newReviews });
      return { reviews: newReviews };
    }),
}));
