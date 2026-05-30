# Worklog: Task 2-b — Booking Dispatch Backend API Routes

## Agent: Backend Agent
## Task: Build all booking dispatch API routes and handler files

## Work Completed:

### Handler Files Created (in `src/partner/backend/`):

1. **booking-dispatch-handlers.ts** — `POST /api/bookings/[id]/dispatch`
   - Finds PAID booking with no partner assigned
   - Parses `declinedBy` JSON to exclude already-declined partners
   - Finds online partners (`availability = true`), prioritized by location proximity
   - Dispatches to top 5, creates WorkDispatch records (status: PENDING)
   - Increments `dispatchRound`, sets status to `PARTNER_DISPATCHED`
   - Calls WebSocket service `POST /internal/dispatch`

2. **booking-accept-handlers.ts** — `POST /api/bookings/[id]/accept`
   - Validates booking is `PARTNER_DISPATCHED`, no partner assigned yet
   - Finds PENDING WorkDispatch for partner, updates to ACCEPTED
   - Assigns partner to booking, sets status to `EN_ROUTE`
   - Expires all other PENDING dispatches for the booking
   - Calls WebSocket `POST /internal/accept`

3. **booking-decline-handlers.ts** — `POST /api/bookings/[id]/decline`
   - Updates WorkDispatch to DECLINED, adds partnerId to declinedBy
   - Checks if all dispatches for current round are declined/expired
   - If all responded: auto re-dispatches to next 5 available partners
   - Returns `{ booking, reDispatched: boolean }`

4. **booking-available-handlers.ts** — `GET /api/bookings/available?partnerId=...`
   - Finds all PENDING WorkDispatch records for partner
   - Includes booking details + package + user info
   - Returns `{ availableBookings: [...] }`

5. **partner-wallet-handlers.ts** — GET wallet + POST withdraw
   - **GET `/api/partners/[id]/wallet`**: Returns balance, pendingClearance, totalWithdrawn, recent transactions (last 20)
   - **POST `/api/partners/[id]/withdraw`**: Validates min ₹500, bank linked, sufficient balance; deducts from wallet, creates Transaction

### Updated Files:

6. **booking-detail-handlers.ts** — Enhanced PATCH handler:
   - When status → `DELIVERED`: Credits partner wallet with package price, creates EARNING transaction, increments completedProjects
   - When status → `CANCELLED` with cancelledBy=PARTNER: Clears partnerId, resets to PAID, cancels PENDING dispatches, auto re-dispatches to 5 new partners
   - Added `cancelledBy` field to `UpdateBookingBody`

7. **partner/backend/index.ts** — Added exports for all new handlers

### API Route Files Created (thin wrappers):

8. `src/app/api/bookings/[id]/dispatch/route.ts`
9. `src/app/api/bookings/[id]/accept/route.ts`
10. `src/app/api/bookings/[id]/decline/route.ts`
11. `src/app/api/bookings/available/route.ts`
12. `src/app/api/partners/[id]/wallet/route.ts`
13. `src/app/api/partners/[id]/withdraw/route.ts`

### WebSocket Service Updated:

14. **mini-services/orbit-ws/index.ts** — Added `POST /internal/accept` endpoint:
    - Stores acceptance, notifies other dispatched partners (`booking:accepted-by-other`)
    - Notifies subscribed client (`booking:partner-assigned`, `booking:status-update`)

## Status: ✅ All tasks complete
## Lint: ✅ No errors
## Dev Server: ✅ Running cleanly
