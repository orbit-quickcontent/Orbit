import { create } from "zustand";

export type AppView = "landing" | "packages" | "booking" | "tracking" | "partner";

export type BookingStatus =
  | "PENDING"
  | "PAID"
  | "PARTNER_DISPATCHED"
  | "SHOOTING"
  | "SYNCING"
  | "EDITING"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED";

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
  brandLogo: string | null;
  brandFont: string | null;
  brandPalette: string | null;
}

interface AppState {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Role
  userRole: "USER" | "PARTNER";
  setUserRole: (role: "USER" | "PARTNER") => void;

  // User
  user: UserProfile;
  setUser: (user: Partial<UserProfile>) => void;

  // Packages
  packages: PackageInfo[],
  setPackages: (packages: PackageInfo[]) => void;
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

  // UI
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  currentView: "landing",
  setCurrentView: (view) => set({ currentView: view }),

  // Role
  userRole: "USER",
  setUserRole: (role) => set({ userRole: role }),

  // User
  user: {
    name: "",
    email: "",
    phone: "",
    location: "",
    brandLogo: null,
    brandFont: null,
    brandPalette: null,
  },
  setUser: (user) =>
    set((state) => ({ user: { ...state.user, ...user } })),

  // Packages
  packages: [
    {
      id: "pkg-personalized",
      name: "Personalized",
      tier: "PERSONALIZED",
      price: 1999,
      focus: "Individual/Event cinematic reels",
      deliveryTime: "60–120 mins",
      features: [
        "Professional cinematic edit",
        "1 Reel (up to 60 sec)",
        "Color grading & transitions",
        "Background music sync",
        "60–120 min delivery",
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
      deliveryTime: "60–120 mins",
      features: [
        "All Personalized features",
        "Brand DNA integration",
        "Logo/Font/Palette matching",
        "Up to 3 Reels (60 sec each)",
        "Multi-platform optimization",
        "2 revision rounds",
        "Priority editing queue",
      ],
      popular: true,
    },
  ],
  setPackages: (packages) => set({ packages }),
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
    set((state) => ({ bookings: [...state.bookings, booking] })),
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

  // UI
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
