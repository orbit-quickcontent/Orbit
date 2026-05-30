# Task 5+6: Partner Earnings Offline Fix

## Agent: partner-earnings-offline-fix

### Changes Made

#### 1. partner-earnings.tsx — Wallet Balance + Withdrawal UI
- Added `useState` for `withdrawAmount` and `isWithdrawing` state
- Added `MIN_WITHDRAWAL = 500` constant
- Extracted `wallet` and `bankAccount` from `user` store
- Added **Wallet Balance Card** at top with:
  - Current available balance (`wallet.balance`)
  - Pending clearance (`wallet.pendingClearance`) in amber
  - Total withdrawn (`wallet.totalWithdrawn`) in purple
- Added **Withdraw Section** with:
  - If no bank account: "Link Bank Account to Withdraw" message + "Go to Settings" button
  - If bank account linked: masked account info (e.g., "HDFC ****1234"), account holder name, verified badge
  - Dollar-amount input with min $500
  - Withdraw button with loading spinner
  - Insufficient balance warnings
  - Success toast on withdrawal via `withdrawFromWallet(amount)`
- Added new imports: `Button`, `toast`, `ArrowDownToLine`, `Building2`, `Settings`, `AlertCircle`

#### 2. partner-dashboard.tsx — Filter Already-Accepted Bookings
- Added `bookings` from `useAppStore()` destructuring
- Created `availableBookings` by filtering `MOCK_AVAILABLE_BOOKINGS` to exclude IDs already in `store.bookings`
- Replaced 3 references to `MOCK_AVAILABLE_BOOKINGS` in rendering with `availableBookings`
- Verified offline logic (line 230) correctly prevents showing available bookings when offline
- Verified `addBooking` in store prevents duplicates via ID check

#### 3. partner-navbar.tsx — Notification Badge Verification
- Confirmed existing logic is correct: `unreadNotifications = user.isOnline && hasActiveWork ? 1 : 0`
- When offline, `unreadNotifications` is always 0
- No changes needed

### Lint & Dev Server
- All lint checks pass (`bun run lint` — clean)
- Dev server running without errors
