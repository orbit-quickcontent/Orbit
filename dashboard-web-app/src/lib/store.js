 function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * Orbit - Zustand State Management
 *
 * Central application state using Zustand with localStorage persistence.
 * Manages auth, navigation, user profile, packages, bookings, and partner state.
 *
 * IMPORTANT: localStorage is read AFTER mount (via useHydrate hook) to avoid
 * server/client hydration mismatches.
 */

import { create } from "zustand";


// Generate a stable ID for this device/session
function generatePartnerId() {
  if (typeof window === "undefined") return "";
  const key = "orbit-partner-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `partner-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY = "orbit-app-state";

function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

function saveToStorage(state) {
  if (typeof window === "undefined") return;
  try {
    const toSave = {
      isAuthenticated: state.isAuthenticated,
      userRole: state.userRole,
      user: state.user,
      currentView: state.currentView,
      bookings: state.bookings,
      reviews: state.reviews,
      partnerActiveBooking: state.partnerActiveBooking,
      partnerId: state.partnerId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e2) { /* ignore */ }
}

function clearStorage() {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(STORAGE_KEY); } catch (e3) { /* ignore */ }
}

const defaultWallet = {
  balance: 0,
  pendingClearance: 0,
  totalWithdrawn: 0,
  lastWithdrawnAt: null,
};

const defaultSettings = {
  notificationsEnabled: true,
  newBookingAlerts: true,
  paymentAlerts: true,
  autoSyncOnWifi: true,
  highQualityUpload: false,
  locationTracking: true,
};

const defaultUser = {
  name: "",
  email: "",
  phone: "",
  location: "",
  avatar: null,
  avatarType: "color",
  avatarEmoji: null,
  avatarPhotoUrl: null,
  avatarImage: null,
  brandLogo: null,
  brandFont: null,
  brandColor: null,
  editorRequirements: "",
  authProvider: null,
  isOnline: true,
  bankAccount: null,
  wallet: defaultWallet,
  settings: defaultSettings,
  isVerified: false,
};



























































































export const useAppStore = create((set, get) => ({
  // Hydration — starts false, set to true after localStorage is read
  _hydrated: false,
  _hydrate: () => {
    const stored = loadFromStorage();
    if (stored) {
      const storedUser = _nullishCoalesce((stored.user ), () => ( defaultUser));
      const storedBookings = (_nullishCoalesce((stored.bookings ), () => ( []))).map((b) => ({
        ...b,
        deliveredAt: _nullishCoalesce(b.deliveredAt, () => ( null)),
        downloaded: _nullishCoalesce(b.downloaded, () => ( false)),
        cancelledBy: _nullishCoalesce(b.cancelledBy, () => ( null)),
        declinedByPartners: _nullishCoalesce(b.declinedByPartners, () => ( [])),
      }));
      set({
        _hydrated: true,
        isAuthenticated: _nullishCoalesce((stored.isAuthenticated ), () => ( false)),
        userRole: _nullishCoalesce((stored.userRole ), () => ( "USER")),
        user: {
          ...defaultUser,
          ...storedUser,
          authProvider: _nullishCoalesce(storedUser.authProvider, () => ( null)),
          isOnline: _nullishCoalesce(storedUser.isOnline, () => ( true)),
          bankAccount: _nullishCoalesce(storedUser.bankAccount, () => ( null)),
          wallet: { ...defaultWallet, ...(_nullishCoalesce(storedUser.wallet, () => ( {}))) },
          settings: { ...defaultSettings, ...(_nullishCoalesce(storedUser.settings, () => ( {}))) },
          isVerified: _nullishCoalesce(storedUser.isVerified, () => ( false)),
        },
        currentView: _nullishCoalesce((stored.currentView ), () => ( "landing")),
        bookings: storedBookings,
        reviews: _nullishCoalesce((stored.reviews ), () => ( [])),
        partnerActiveBooking: _nullishCoalesce((stored.partnerActiveBooking ), () => ( null)),
        partnerId: (stored.partnerId ) || generatePartnerId(),
        appPhase: stored.isAuthenticated ? "app" : "auth",
      });
    } else {
      set({ _hydrated: true, partnerId: generatePartnerId() });
    }
  },

  // App phase
  appPhase: "auth",
  setAppPhase: (phase) => set({ appPhase: phase }),

  // Auth
  isAuthenticated: false,
  userRole: "USER",
  login: async (role) => {
    let pid = get().partnerId;
    const email = get().user.email;
    const name = get().user.name;
    const phone = get().user.phone;

    if (role === "PARTNER" && email) {
      try {
        // 1. Fetch all partners to check if partner with this email exists
        const res = await fetch("/api/partners");
        if (res.ok) {
          const data = await res.json();
          const existingPartner = _optionalChain([data, 'access', _ => _.partners, 'optionalAccess', _2 => _2.find, 'call', _3 => _3(
            (p) => _optionalChain([p, 'access', _4 => _4.user, 'optionalAccess', _5 => _5.email, 'optionalAccess', _6 => _6.toLowerCase, 'call', _7 => _7(), 'access', _8 => _8.trim, 'call', _9 => _9()]) === email.toLowerCase().trim()
          )]);

          if (existingPartner) {
            pid = existingPartner.id;
            console.log(`[Store] Found existing partner in DB: ${pid}`);
          } else {
            // 2. If not found, check if a User exists or create one
            let dbUserId = "";
            const userRes = await fetch("/api/users");
            if (userRes.ok) {
              const userData = await userRes.json();
              const existingUser = _optionalChain([userData, 'access', _10 => _10.users, 'optionalAccess', _11 => _11.find, 'call', _12 => _12(
                (u) => _optionalChain([u, 'access', _13 => _13.email, 'optionalAccess', _14 => _14.toLowerCase, 'call', _15 => _15(), 'access', _16 => _16.trim, 'call', _17 => _17()]) === email.toLowerCase().trim()
              )]);
              if (existingUser) {
                dbUserId = existingUser.id;
              }
            }

            if (!dbUserId) {
              // Create user
              const createUserRes = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, phone, role: "PARTNER" }),
              });
              if (createUserRes.ok) {
                const newUserData = await createUserRes.json();
                dbUserId = _optionalChain([newUserData, 'access', _18 => _18.user, 'optionalAccess', _19 => _19.id]);
              }
            }

            if (dbUserId) {
              // Create partner
              const createPartnerRes = await fetch("/api/partners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: dbUserId,
                  location: get().user.location || "Mumbai, India",
                  deviceInfo: "iPhone 15 Pro",
                }),
              });
              if (createPartnerRes.ok) {
                const partnerData = await createPartnerRes.json();
                pid = _optionalChain([partnerData, 'access', _20 => _20.partner, 'optionalAccess', _21 => _21.id]);
                console.log(`[Store] Created new partner in DB: ${pid}`);
              }
            }
          }
        }
      } catch (err) {
        console.error("[Store] Error syncing partner on login:", err);
      }
    }

    if (!pid) pid = generatePartnerId();

    const newState = {
      isAuthenticated: true,
      userRole: role,
      currentView: (role === "PARTNER" ? "partner" : "landing") ,
      appPhase: "app" ,
      partnerId: pid,
    };
    set(newState);
    saveToStorage({ ...get(), ...newState });

    if (role === "PARTNER") {
      await get().fetchPartnerProfile();
    }
  },
  logout: () => {
    set({
      isAuthenticated: false,
      userRole: "USER" ,
      currentView: "landing" ,
      currentBooking: null,
      partnerActiveBooking: null,
      appPhase: "auth" ,
      user: defaultUser,
      bookings: [],
      reviews: [],
      availableBookings: [],
    });
    clearStorage();
  },

  // Navigation
  currentView: "landing",
  setCurrentView: (view) => {
    set({ currentView: view });
    saveToStorage(get());
  },

  // User
  user: defaultUser,
  setUser: (user) =>
    set((state) => {
      const newUser = { ...state.user, ...user };
      const newState = { user: newUser };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),
  toggleOnline: async () => {
    const state = get();
    const nextVal = !state.user.isOnline;
    const updatedUser = { ...state.user, isOnline: nextVal };
    set({ user: updatedUser });
    saveToStorage({ ...get(), user: updatedUser });

    if (state.partnerId && state.userRole === "PARTNER") {
      try {
        await fetch(`/api/partners/${state.partnerId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ availability: nextVal }),
        });
      } catch (err) {
        console.error("[Store] Failed to update availability on server:", err);
      }
    }
  },

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
          const mapped = data.packages.map((pkg) => ({
            id: pkg.id ,
            name: pkg.name ,
            tier: pkg.tier ,
            price: pkg.price ,
            focus: pkg.focus ,
            deliveryTime: pkg.deliveryTime ,
            features: Array.isArray(pkg.features) ? pkg.features  : JSON.parse(pkg.features  || '[]'),
            popular: pkg.popular ,
          }));
          set({ packages: mapped });
        }
      }
    } catch (e4) {
      // Keep client-side defaults
    }
  },
  selectedPackage: null,
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),

  // Package highlight
  highlightedPackageId: null,
  setHighlightedPackageId: (id) => set({ highlightedPackageId: id }),

  // Booking
  currentBooking: null,
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  bookings: [],
  addBooking: (booking) =>
    set((state) => {
      const exists = state.bookings.some((b) => b.id === booking.id);
      if (exists) {
        const newBookings = state.bookings.map((b) =>
          b.id === booking.id ? booking : b
        );
        saveToStorage({ ...get(), bookings: newBookings });
        return { bookings: newBookings };
      }
      const newBookings = [...state.bookings, booking];
      saveToStorage({ ...get(), bookings: newBookings });
      return { bookings: newBookings };
    }),
  updateBookingStatus: (id, status, extra) =>
    set((state) => {
      const newState = {
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status, ...extra } : b
        ),
        currentBooking:
          _optionalChain([state, 'access', _22 => _22.currentBooking, 'optionalAccess', _23 => _23.id]) === id
            ? { ...state.currentBooking, status, ...extra }
            : state.currentBooking,
        ...(status === "EDITING" && state.userRole === "PARTNER"
          ? {
              user: {
                ...state.user,
                wallet: {
                  ...state.user.wallet,
                  balance: state.user.wallet.balance + 700,
                },
              },
            }
          : {}),
      };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),
  updatePaymentStatus: (id, paymentStatus) =>
    set((state) => {
      const newState = {
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, paymentStatus } : b
        ),
        currentBooking:
          _optionalChain([state, 'access', _24 => _24.currentBooking, 'optionalAccess', _25 => _25.id]) === id
            ? { ...state.currentBooking, paymentStatus }
            : state.currentBooking,
      };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),
  updateSyncPercentage: (id, syncPercentage) =>
    set((state) => {
      const newState = {
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, syncPercentage } : b
        ),
        currentBooking:
          _optionalChain([state, 'access', _26 => _26.currentBooking, 'optionalAccess', _27 => _27.id]) === id
            ? { ...state.currentBooking, syncPercentage }
            : state.currentBooking,
      };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),
  updateEditCountdown: (id, editCountdown) =>
    set((state) => {
      const newState = {
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, editCountdown } : b
        ),
        currentBooking:
          _optionalChain([state, 'access', _28 => _28.currentBooking, 'optionalAccess', _29 => _29.id]) === id
            ? { ...state.currentBooking, editCountdown }
            : state.currentBooking,
      };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),
  completeBooking: (id) =>
    set((state) => {
      const updatedBookings = state.bookings.map((b) =>
        b.id === id ? { ...b, status: "DELIVERED"  } : b
      );
      const newState = {
        bookings: updatedBookings,
        currentBooking: null ,
      };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),
  cancelBooking: (id, cancelledBy) =>
    set((state) => {
      const updatedBookings = state.bookings.map((b) =>
        b.id === id
          ? { ...b, status: "CANCELLED" , cancelledBy, paymentStatus: "REFUNDED"  }
          : b
      );
      const updatedCurrentBooking =
        _optionalChain([state, 'access', _30 => _30.currentBooking, 'optionalAccess', _31 => _31.id]) === id
          ? { ...state.currentBooking, status: "CANCELLED" , cancelledBy, paymentStatus: "REFUNDED"  }
          : state.currentBooking;
      const newState = {
        bookings: updatedBookings,
        currentBooking: cancelledBy === "CLIENT" ? null : updatedCurrentBooking,
      };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),
  markBookingDownloaded: (id) =>
    set((state) => {
      const newState = {
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, downloaded: true } : b
        ),
        currentBooking:
          _optionalChain([state, 'access', _32 => _32.currentBooking, 'optionalAccess', _33 => _33.id]) === id
            ? { ...state.currentBooking, downloaded: true }
            : state.currentBooking,
      };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),
  markBookingDelivered: (id) =>
    set((state) => {
      const newState = {
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, deliveredAt: new Date().toISOString() } : b
        ),
        currentBooking:
          _optionalChain([state, 'access', _34 => _34.currentBooking, 'optionalAccess', _35 => _35.id]) === id
            ? { ...state.currentBooking, deliveredAt: new Date().toISOString() }
            : state.currentBooking,
      };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),
  fetchClientBookings: async () => {
    const state = get();
    if (!state.user.email) return;
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(state.user.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.bookings) {
          const historicalBookings = data.bookings.map((b) => {
            // Normalise READY_TO_EDIT → EDITING so the client pipeline step is correct
            const normStatus = b.status === "READY_TO_EDIT" ? "EDITING" : b.status;
            return {
              id: b.id,
              packageId: b.packageId,
              packageName: _optionalChain([b, 'access', _36 => _36.package, 'optionalAccess', _37 => _37.name]) || "",
              packagePrice: _optionalChain([b, 'access', _38 => _38.package, 'optionalAccess', _39 => _39.price]) || 0,
              status: normStatus ,
              paymentStatus: b.paymentStatus ,
              bookingDate: b.bookingDate,
              timeSlot: b.timeSlot,
              location: b.location || "",
              syncPercentage: b.syncPercentage || 0,
              editCountdown: b.editCountdown || null,
              partnerName: _optionalChain([b, 'access', _40 => _40.partner, 'optionalAccess', _41 => _41.user, 'optionalAccess', _42 => _42.name]) || null,
              notes: b.notes || "",
              deliveredAt: b.deliveredAt || null,
              downloaded: b.downloaded || false,
              cancelledBy: b.cancelledBy || null,
              declinedByPartners: b.declinedBy ? (typeof b.declinedBy === 'string' ? JSON.parse(b.declinedBy) : b.declinedBy) : [],
              reelUrl: b.reelUrl,
              masterReelUrl: b.masterReelUrl || null,
              hlsPlaylistUrl: b.hlsPlaylistUrl || null,
              proxyFootageUrl: b.proxyFootageUrl || null,
            };
          });

          // Include DELIVERED bookings that haven't been downloaded yet so
          // the tracking page stays visible until the client downloads their reel.
          const activeBooking = historicalBookings.find(
            (b) => b.status !== "CANCELLED" && !(b.status === "DELIVERED" && b.downloaded)
          ) || null;

          set({
            bookings: historicalBookings,
            currentBooking: activeBooking,
          });
          saveToStorage({ ...get(), bookings: historicalBookings, currentBooking: activeBooking });
        }
      }
    } catch (err) {
      console.error("[Store] Error fetching client bookings:", err);
    }
  },

  // Partner
  partnerActiveBooking: null,
  setPartnerActiveBooking: (booking) => {
    const newState = { partnerActiveBooking: booking };
    set(newState);
    saveToStorage({ ...get(), ...newState });
  },

  // Partner wallet operations
  creditPartnerWallet: (amount) =>
    set((state) => {
      const newState = {
        user: {
          ...state.user,
          wallet: {
            ...state.user.wallet,
            balance: state.user.wallet.balance + amount,
          },
        },
      };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),
  withdrawFromWallet: async (amount) => {
    const state = get();
    const pid = state.partnerId;
    if (!pid) return;

    try {
      const res = await fetch(`/api/partners/${pid}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        await get().fetchPartnerProfile();
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Withdrawal failed");
      }
    } catch (err) {
      console.error("[Store] Error withdrawing from wallet:", err);
      throw err;
    }
  },
  linkBankAccount: async (account) => {
    // NOTE: The linkBankAccount store action is intentionally kept for legacy
    // compatibility (e.g. types). The real bank-linking call is made directly
    // from the UI forms via fetch("/api/partners/link-bank") so that the form
    // can surface per-field validation errors and PAN/penny-drop status to the
    // user in real-time. After the API call succeeds, fetchPartnerProfile() is
    // called to sync the verified bank state back to the store.
    try {
      const res = await fetch("/api/partners/link-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountHolderName: account.accountHolderName,
          accountNumber: account.accountNumber,
          ifsc: account.ifscCode,
          pan: (account ).pan || "",
        }),
      });

      if (res.ok) {
        await get().fetchPartnerProfile();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Bank linking failed");
      }
    } catch (err) {
      console.error("[Store] Error linking bank account:", err);
      throw err;
    }
  },
  fetchPartnerProfile: async () => {
    const state = get();
    const pid = state.partnerId;
    if (!pid || state.userRole !== "PARTNER") return;

    try {
      // 1. Fetch partner detail (including bookings & user details)
      const res = await fetch(`/api/partners/${pid}`);
      if (!res.ok) return;
      const data = await res.json();
      const partner = data.partner;
      if (!partner) return;

      // 2. Fetch partner wallet detail
      const walletRes = await fetch(`/api/partners/${pid}/wallet`);
      let walletData = defaultWallet;
      let bankData = null;
      if (walletRes.ok) {
        const wData = await walletRes.json();
        walletData = {
          balance: wData.balance || 0,
          pendingClearance: wData.pendingClearance || 0,
          totalWithdrawn: wData.totalWithdrawn || 0,
          lastWithdrawnAt: _optionalChain([wData, 'access', _43 => _43.transactions, 'optionalAccess', _44 => _44.find, 'call', _45 => _45((t) => t.type === 'WITHDRAWAL'), 'optionalAccess', _46 => _46.createdAt]) || null,
        };
        if (wData.bankVerified && wData.accountNumberMasked) {
          bankData = {
            id: 'bank-acc',
            bankName: wData.bankName || "",
            accountNumber: wData.accountNumberMasked || "",
            ifscCode: partner.ifscCode || "",
            accountHolderName: partner.accountHolderName || _optionalChain([partner, 'access', _47 => _47.user, 'optionalAccess', _48 => _48.name]) || "",
            isVerified: wData.bankVerified,
            linkedAt: partner.updatedAt,
          };
        }
      }

      // 3. Map bookings list
      const rawBookingsList = partner.bookings || [...(partner.activeBookings || []), ...(partner.completedBookings || [])];
      const historicalBookings = rawBookingsList.map((b) => ({
        id: b.id,
        packageId: b.packageId,
        packageName: _optionalChain([b, 'access', _49 => _49.package, 'optionalAccess', _50 => _50.name]) || "",
        packagePrice: _optionalChain([b, 'access', _51 => _51.package, 'optionalAccess', _52 => _52.price]) || 0,
        status: b.status ,
        paymentStatus: b.paymentStatus ,
        bookingDate: b.bookingDate,
        timeSlot: b.timeSlot,
        location: b.location || "",
        syncPercentage: b.syncPercentage || 0,
        editCountdown: b.editCountdown || null,
        partnerName: _optionalChain([partner, 'access', _53 => _53.user, 'optionalAccess', _54 => _54.name]) || null,
        notes: b.notes || "",
        deliveredAt: b.deliveredAt || null,
        downloaded: b.downloaded || false,
        cancelledBy: b.cancelledBy || null,
        declinedByPartners: (() => {
          if (!b.declinedBy) return [];
          if (typeof b.declinedBy === 'string') {
            try {
              return JSON.parse(b.declinedBy);
            } catch (e5) {
              return [];
            }
          }
          return Array.isArray(b.declinedBy) ? b.declinedBy : [];
        })(),
        reelUrl: b.reelUrl,
        masterReelUrl: b.masterReelUrl || null,
        hlsPlaylistUrl: b.hlsPlaylistUrl || null,
        proxyFootageUrl: b.proxyFootageUrl || null,
      }));

      // 4. Find active booking
      const activeBooking = historicalBookings.find(
        (b) => b.status !== "DELIVERED" && b.status !== "CANCELLED"
      ) || null;

      // Update local state
      const updatedUser = {
        ...state.user,
        name: _optionalChain([partner, 'access', _55 => _55.user, 'optionalAccess', _56 => _56.name]) || state.user.name,
        email: _optionalChain([partner, 'access', _57 => _57.user, 'optionalAccess', _58 => _58.email]) || state.user.email,
        phone: _optionalChain([partner, 'access', _59 => _59.user, 'optionalAccess', _60 => _60.phone]) || state.user.phone,
        location: partner.location || state.user.location,
        avatar: _optionalChain([partner, 'access', _61 => _61.user, 'optionalAccess', _62 => _62.avatar]) || state.user.avatar,
        wallet: walletData,
        bankAccount: bankData,
      };

      set({
        user: updatedUser,
        bookings: historicalBookings,
        partnerActiveBooking: activeBooking,
      });

      saveToStorage({ ...get(), user: updatedUser, bookings: historicalBookings, partnerActiveBooking: activeBooking });
    } catch (err) {
      console.error("[Store] Error fetching partner profile:", err);
    }
  },

  // Partner settings
  updatePartnerSettings: (settings) =>
    set((state) => {
      const newState = {
        user: {
          ...state.user,
          settings: { ...state.user.settings, ...settings },
        },
      };
      saveToStorage({ ...get(), ...newState });
      return newState;
    }),

  // Available bookings for partner (from API/WebSocket)
  availableBookings: [],
  setAvailableBookings: (bookings) => set({ availableBookings: bookings }),
  addAvailableBooking: (booking) =>
    set((state) => {
      if (state.availableBookings.some((b) => b.id === booking.id)) return state;
      return { availableBookings: [...state.availableBookings, booking] };
    }),
  removeAvailableBooking: (bookingId) =>
    set((state) => ({
      availableBookings: state.availableBookings.filter((b) => b.id !== bookingId),
    })),

  // Partner ID
  partnerId: "",
  setPartnerId: (id) => set({ partnerId: id }),

  // Fetch available bookings from API
  fetchAvailableBookings: async () => {
    const state = get();
    if (!state.partnerId || state.userRole !== "PARTNER") return;
    try {
      const res = await fetch(`/api/bookings/available?partnerId=${state.partnerId}`);
      if (res.ok) {
        const data = await res.json();
        const bookings = (data.availableBookings || []).map((d) => {
          // API returns nested { dispatchId, round, dispatchedAt, booking: {...} }
          const booking = _nullishCoalesce((d.booking ), () => ( d));
          const pkg = _nullishCoalesce((booking.package ), () => ( {}));
          return {
            id: booking.id ,
            packageId: _nullishCoalesce(_nullishCoalesce((booking.packageId ), () => ( (pkg.id ))), () => ( "")),
            packageName: _nullishCoalesce(_nullishCoalesce((booking.packageName ), () => ( (pkg.name ))), () => ( "")),
            packagePrice: _nullishCoalesce(_nullishCoalesce((booking.packagePrice ), () => ( (pkg.price ))), () => ( 0)),
            status: booking.status ,
            paymentStatus: booking.paymentStatus ,
            bookingDate: booking.bookingDate ,
            timeSlot: booking.timeSlot ,
            location: (booking.location ) || "",
            syncPercentage: (booking.syncPercentage ) || 0,
            editCountdown: (booking.editCountdown ) || null,
            partnerName: (booking.partnerName ) || null,
            notes: (booking.notes ) || "",
            deliveredAt: (booking.deliveredAt ) || null,
            downloaded: (booking.downloaded ) || false,
            cancelledBy: (booking.cancelledBy ) || null,
            declinedByPartners: (booking.declinedByPartners ) || [],
          };
        });
        set({ availableBookings: bookings });
      }
    } catch (e6) {
      // Graceful fallback — keep existing state
    }
  },

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
