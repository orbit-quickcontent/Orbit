# Task 2-a: Orbit WebSocket Mini-Service

## Agent: WS Service Builder
## Date: 2026-03-05

## Task
Create a WebSocket mini-service at `/home/z/my-project/mini-services/orbit-ws/` for real-time notification pushing in the Orbit platform.

## Work Completed

### 1. Created Project Structure
- `/home/z/my-project/mini-services/orbit-ws/package.json` — Independent bun project with `socket.io@^4.8.1` dependency
- `/home/z/my-project/mini-services/orbit-ws/index.ts` — Complete WebSocket service implementation
- Dev command: `bun --hot index.ts` (supports auto-restart on file changes)

### 2. Socket.io Configuration
- **Port**: 3003 (hardcoded)
- **Path**: `/socket.io/` (default, not `/` — avoids conflict with REST endpoints)
- **CORS**: All origins allowed for development
- **Ping**: 60s timeout, 25s interval

### 3. Implemented Socket.io Events

#### Server → Client (Partner):
- `booking:dispatched` — Pushed when a new booking is dispatched to a partner
- `booking:cancelled` — Pushed when a booking is cancelled
- `booking:accepted-by-other` — Pushed when another partner accepted a booking

#### Server → Client (Client):
- `booking:partner-assigned` — Pushed when a partner accepts a booking
- `booking:status-update` — Pushed when booking status changes

#### Client → Server (Partner):
- `partner:online` — Partner goes online, joins room `partner:{partnerId}`
- `partner:offline` — Partner goes offline, leaves room
- `booking:accept` — Partner accepts a booking (with duplicate acceptance prevention)
- `booking:decline` — Partner declines a booking

#### Client → Server (Client):
- `client:subscribe` — Client subscribes to booking updates, joins room `booking:{bookingId}`

### 4. In-Memory State
- `connectedPartners`: Map<partnerId, socketId> — tracks online partners
- `partnerRooms`: Map<partnerId, Set<dispatchId>> — pending dispatches per partner
- `clientSubscriptions`: Map<bookingId, socketId> — clients tracking a booking
- `dispatchBookingMap`: Map<dispatchId, bookingId> — dispatch lookup
- `bookingDispatches`: Map<bookingId, Set<dispatchId>> — all dispatches for a booking
- `dispatchPartners`: Map<dispatchId, Set<partnerId>> — partners per dispatch
- `bookingAcceptances`: Map<bookingId, partnerId> — who accepted which booking

### 5. REST Endpoints (Internal API)
All endpoints tested and verified working:

- **POST /internal/dispatch** — Dispatch booking to partners
  - Body: `{ bookingId, partnerIds: string[], booking: object, round: number }`
  - Returns: `{ dispatched: number }`
  - ✅ Tested: Returns `{"dispatched":2}` for 2 partners

- **POST /internal/notify-client** — Notify subscribed client
  - Body: `{ bookingId, event, payload }`
  - Returns: `{ notified: true/false }`
  - ✅ Tested: Returns `{"notified":false,"reason":"No client subscribed"}` when no client

- **POST /internal/notify-partners** — Notify specific partners
  - Body: `{ partnerIds: string[], event, payload }`
  - Returns: `{ notified: number }`
  - ✅ Tested: Returns `{"notified":2}` for 2 partners

- **GET /internal/online-partners** — List online partners
  - Returns: `{ partners: string[], count: number }`
  - ✅ Tested: Returns `{"partners":[],"count":0}` when no partners online

### 6. Key Design Decisions

**Socket.io Path**: Used `/socket.io/` instead of `/` because:
- With `path: '/'`, socket.io intercepts ALL HTTP requests, blocking REST endpoints
- With `/socket.io/`, socket.io only intercepts requests to that path, allowing REST to work
- Frontend should connect with: `io({ path: '/socket.io/' })` with `XTransformPort=3003`

**REST Handler Integration**: Used `createServer(restHandler)` as the HTTP server callback, then attached socket.io. Socket.io wraps the handler and passes non-matching requests through.

**Booking Accept Flow**: When `booking:accept` is received:
1. Check for duplicate acceptance (reject if already accepted by another partner)
2. Store acceptance
3. Emit `booking:accepted-by-other` to ALL other partners who had this booking dispatched
4. Emit `booking:partner-assigned` to client if subscribed
5. Emit `booking:status-update` to client if subscribed

### 7. Frontend Connection Guide
```typescript
// Partner connection
const socket = io('/?XTransformPort=3003', {
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
})

// Client connection
const socket = io('/?XTransformPort=3003', {
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
})

// Next.js API calling REST endpoints
fetch('/internal/dispatch?XTransformPort=3003', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bookingId, partnerIds, booking, round }),
})
```
