---
Task ID: 1
Agent: main
Task: Comprehensive Orbit app update - OAuth, avatars, UI fixes, cancel booking, redownload, online/offline, remove fake data

Work Log:
- Updated types.ts: Added deliveredAt, downloaded, cancelledBy, declinedByPartners to BookingInfo; Added authProvider, isOnline to UserProfile; Changed avatarType "emoji" to "avatar"
- Updated constants.ts: Replaced AVATAR_EMOJIS (16 emojis) with AVATAR_PRESETS (4 creative avatars: Creator, Professional, Artist, Explorer); Removed DEFAULT_PARTNER_STATS; Added REDOWNLOAD_WINDOW_MS, isWithinRedownloadWindow, getRedownloadDaysRemaining helpers
- Updated store.ts: Added cancelBooking, markBookingDownloaded, markBookingDelivered actions; Added authProvider and isOnline to defaultUser; Added migration logic for old bookings
- Rewrote login-page.tsx: 4 creative avatars (Color/Avatar/Photo tabs); Google/Apple OAuth buttons with white/black styling; Photo upload with capture="environment" for mobile gallery; India +91 phone with 10-digit limit
- Updated client-navbar.tsx: Changed avatarType "emoji" to "avatar"; Improved opacity on buttons (0.06→0.08); Replaced orbit-card-strong with more opaque dropdowns
- Updated client profile-view.tsx: Full 3-mode avatar editing; Download History section with 30-day redownload window; Cancel Booking button with confirmation; Days remaining indicator
- Updated tracking-dashboard.tsx: Cancel Booking button for client; markBookingDelivered/markBookingDownloaded on download
- Updated partner-navbar.tsx: Online/offline toggle switch; avatarType "emoji"→"avatar"; More opaque UI elements
- Updated partner-profile-view.tsx: Full avatar editing; Online/offline toggle in profile; Real data only (no DEFAULT_PARTNER_STATS)
- Updated partner-work.tsx: Removed all mock/fake data; Shows only real completed bookings
- Updated partner-earnings.tsx: Removed DEFAULT_PARTNER_STATS and MOCK_COMPLETED_HISTORY; All earnings from real bookings
- Updated payment-received.tsx: Removed DEFAULT_PARTNER_STATS; Shows real earnings from store
- Updated partner-dashboard.tsx: Cancel Booking button for partner with reassignment toast
- Updated booking-flow.tsx: Added new BookingInfo fields (deliveredAt, downloaded, cancelledBy, declinedByPartners)
- Updated partner/constants.ts: Added new BookingInfo fields to mock available bookings
- Updated bottom-nav.tsx and partner-bottom-nav.tsx: avatarType "emoji"→"avatar"
- Updated partner/index.ts: Removed MOCK_COMPLETED_HISTORY export
- ESLint passes clean, production build succeeds

Stage Summary:
- Google/Apple OAuth buttons with real OAuth redirect capability (demo mode fills provider info)
- 4 creative human avatars: Creator (🎬), Professional (💼), Artist (🎨), Explorer (🌍)
- Photo upload from device gallery with capture="environment" attribute
- Name and profile pic can be changed in profile settings (both client & partner)
- All fake revenue data removed - app shows only real data from bookings
- Partner online/offline toggle in navbar and profile
- Cancel booking system for both client and partner (partner cancel triggers reassignment)
- Client can redownload edited video within 30 days from profile history
- Expired downloads show "Expired" badge after 30 days
- UI fixes: more white/opaque elements, less transparency, fixed overlaps
- App compiles and runs successfully on port 3000
