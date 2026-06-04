# Orbit — Product Requirements Document (PRD)

## 1. Product Overview

### 1.1 Vision
**Orbit** is a mobile-first platform that connects clients who need professional video content with verified video creators (Partners) who shoot and deliver cinematic reels within 60–120 minutes. Think "Uber for professional videography" — on-demand, real-time, and quality-guaranteed.

### 1.2 Problem Statement
- Clients need professional video content but hiring videographers takes days of back-and-forth
- Freelance videographers struggle with inconsistent lead flow and payment delays
- No platform exists that matches real-time demand with real-time supply for video production

### 1.3 Target Users
| Role | Description |
|------|-------------|
| **Client** | Brands, entrepreneurs, creators who need professional video reels on demand |
| **Partner** | Verified videographers who accept shoots, capture footage, and sync to cloud |
| **Editor** | Professional editors who receive synced footage and deliver polished reels (backend, not in-app) |
| **Admin** | Platform operators managing verification, disputes, and analytics |

---

## 2. Core Business Logic

### 2.1 Booking Lifecycle

```
Client Books → Payment → Dispatch to 5 Nearest Online Partners
                                        ↓
                              Partner Accepts → Others Removed
                                        ↓
                              Navigate → Shoot → Sync → Edit → Deliver
                              
If Partner Declines → Auto Re-dispatch to Next 5 Partners
If Partner Cancels (mid-shoot) → Re-dispatch to Next 5 Partners
If All Partners Decline → Escalate to Admin
```

### 2.2 Dispatch Algorithm
1. **Trigger**: Client completes payment for a booking
2. **Selection**: Find 5 nearest online partners (by proximity to shoot location)
3. **Push**: Real-time WebSocket notification to all 5 partners simultaneously
4. **Accept**: First partner to accept gets the booking; others are notified it's taken
5. **Decline**: If a partner declines, they're removed from this booking's dispatch list
6. **Round Robin**: If all 5 decline, the system automatically dispatches to the next 5 nearest partners
7. **Expiry**: Dispatch offers expire after 60 seconds (configurable), triggering re-dispatch

### 2.3 Payment Flow
```
Client Pays → Payment Gateway (Razorpay/Stripe) → Orbit Escrow
                                                        ↓
                                            Partner Completes Work
                                                        ↓
                                        Orbit Credits Partner Wallet
                                                        ↓
                                    Partner Withdraws to Linked Bank Account
```

**Revenue Model**: Orbit takes a 15% platform fee from each transaction. Partner receives 85% of the package price.

---

## 3. Feature Specifications

### 3.1 Client Features

#### 3.1.1 Authentication
- Email/Phone with OTP verification
- Google OAuth (one-tap sign-in)
- Apple Sign-In (iOS)
- Role selection: Client or Partner

#### 3.1.2 Dashboard Home
- Compact metric cards: Total Videos, Active, Completed, Total Spent
- "Recently Booked Services" collapsible section
- Brand DNA section (for UGC package users)
- Quick action: Book New Session CTA

#### 3.1.3 Package Selection
| Package | Price | Delivery | Features |
|---------|-------|----------|----------|
| **Personalized** | ₹1,999 | 60-120 min | 1 Reel, Color Grading, Music Sync, 1 Revision |
| **Professional (UGC)** | ₹4,999 | 60-120 min | 3 Reels, Brand DNA, Logo Match, Editor Chat, 2 Revisions, Priority Queue |

#### 3.1.4 Booking Flow (3-Step)
1. **Your Details** — Name, Email, Phone + Brand DNA (for Professional tier)
2. **Schedule & Location** — Date/Time picker + "Book Right Now" option + Location + Notes
3. **Review & Payment** — Order summary + Payment gate (Stripe/PayPal)

#### 3.1.5 Real-Time Tracking
- 7-stage animated pipeline: PAID → DISPATCHED → EN_ROUTE → SHOOTING → SYNCING → EDITING → DELIVERED
- Live stats: Sync %, ETA countdown, Package info, Status badge
- En Route card with partner location tracking
- Download Reel button on delivery
- Review section (Partner + Editor star ratings)
- Cancel option (before partner arrives)

#### 3.1.6 Brand DNA (Professional Tier)
- Brand Logo upload
- Brand Font selection
- Brand Color picker
- Editor Requirements text field
- Redirects to UGC Package when clicked

#### 3.1.7 Profile
- Avatar editing (Color/Avatar/Photo modes)
- Brand assets management
- Booking history
- Account settings

### 3.2 Partner Features

#### 3.2.1 Partner Verification (KYC)
- Government ID verification
- Portfolio review
- Device compatibility check
- Bank account verification
- Location verification
- **Status**: Unverified → Pending → Verified
- **Impact**: Unverified partners cannot accept bookings

#### 3.2.2 Dashboard (Available Work)
- Real-time list of dispatched bookings
- Auto-refresh via WebSocket push
- Each card shows: Booking ID, Package, Price, Date, Time, Location, Notes
- **Accept** button (calls API, removes from others' dashboards)
- **Decline** button (removes from this partner, auto re-dispatches if all decline)
- Loading state while fetching available work
- Empty state when no work available
- Offline mode: Shows "You're Offline" card, no work pushed

#### 3.2.3 Active Workflow
1. **Navigate** — Map with route to location + ETA + Cancel option
2. **Shoot** — Shot list with upload checkboxes + file upload per shot
3. **Sync** — Animated upload progress with file names and speed
4. **Privacy Shield** — Client data protection confirmation
5. **Payment Received** — Amount credited to wallet

#### 3.2.4 Online/Offline Toggle
- Toggle in header (persistent across views)
- **Online**: Receives new booking dispatches via WebSocket
- **Offline**: No dispatches, no notifications, available work hidden
- State persisted in localStorage

#### 3.2.5 Earnings Dashboard
- Wallet Balance card (Available, Pending, Withdrawn)
- Withdraw section (requires linked bank account, min ₹500)
- Earnings summary: Lifetime, Monthly, Weekly, Avg per project
- Stats grid: Completed, Rating, Weekly earnings, Avg earnings
- Earnings breakdown table

#### 3.2.6 Work History
- Completed bookings list with amounts
- Category badges (UGC vs Personalized)
- Expand/collapse for long lists
- Summary card: Total completed + total earned + monthly highlight

#### 3.2.7 Settings
- **Notifications**: Master toggle + New Booking Alerts + Payment Alerts
- **Sync & Upload**: Auto-sync on Wi-Fi, High Quality Upload, Location Tracking
- **Bank Account**: Link bank details (Bank Name, Account Number, IFSC, Holder Name) with verification badge
- **Wallet & Withdrawal**: Balance display, Withdraw funds, Withdrawal history
- **Account & Security**: Verification status, Contact Support
- **About**: App version, Terms of Service, Privacy Policy

#### 3.2.8 Profile (Restricted Editing)
- **Avatar only**: Partners can change their avatar (color/avatar/photo)
- **Locked fields**: Name, Email, Phone are read-only (verification-gated)
- **Amber notice**: "Contact Support to Change" for verified fields
- Verification badge display
- Wallet balance with withdraw button
- Bank account section
- Menu: Privacy Shield, App Settings, Help & Support, Logout

#### 3.2.9 Search
- Search across all bookings by ID, Package, Location, Notes
- Offline-aware: hides PENDING bookings when offline
- Click navigates to relevant view (earnings for completed, dashboard for active)

---

## 4. Technical Architecture

### 4.1 Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (New York) |
| State | Zustand (client) + TanStack Query (server, planned) |
| Database | Prisma ORM + SQLite (dev) → PostgreSQL (prod) |
| Real-Time | Socket.io (WebSocket mini-service on port 3003) |
| Animations | Framer Motion |
| Auth | NextAuth.js v4 (planned) |
| Payments | Razorpay (INR) / Stripe (USD) |
| File Upload | Local storage (dev) → S3/GCS (prod) |

### 4.2 Database Schema
```
User → 1:1 → Partner
User → 1:N → Booking
Package → 1:N → Booking
Partner → 1:N → Booking
Booking → 1:N → WorkDispatch (dispatch tracking per round)
Partner → 1:N → Transaction (wallet ledger)
```

### 4.3 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create/Find user |
| GET | `/api/packages` | List packages |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/[id]` | Get booking details |
| PATCH | `/api/bookings/[id]` | Update booking (status, payment, partner) |
| POST | `/api/bookings/[id]/payment` | Process payment |
| POST | `/api/bookings/[id]/dispatch` | Dispatch to 5 nearest partners |
| POST | `/api/bookings/[id]/accept` | Partner accepts |
| POST | `/api/bookings/[id]/decline` | Partner declines |
| GET | `/api/bookings/[id]/track` | Get tracking data |
| GET | `/api/bookings/available` | Partner's available work |
| GET | `/api/partners` | List partners |
| POST | `/api/partners` | Create partner |
| GET | `/api/partners/[id]` | Partner details |
| PATCH | `/api/partners/[id]` | Update partner (availability, location) |
| GET | `/api/partners/[id]/wallet` | Wallet + transactions |
| POST | `/api/partners/[id]/withdraw` | Withdraw funds |

### 4.4 WebSocket Events (Port 3003)

**Server → Partner:**
- `booking:dispatched` — New booking pushed to partner
- `booking:accepted-by-other` — Another partner accepted
- `booking:cancelled` — Booking cancelled

**Server → Client:**
- `booking:partner-assigned` — Partner accepted
- `booking:status-update` — Status changed

**Partner → Server:**
- `partner:online` / `partner:offline`
- `booking:accept` / `booking:decline`

**Internal REST (for API routes):**
- `POST /internal/dispatch` — Dispatch to partners
- `POST /internal/notify-client` — Notify client
- `POST /internal/notify-partners` — Notify specific partners
- `GET /internal/online-partners` — List online partner IDs

---

## 5. Business Rules

### 5.1 Dispatch Rules
- Dispatch to **5 nearest online partners** per round
- Partners who previously declined are excluded from future rounds
- Each round increments `dispatchRound` on the booking
- If all dispatched partners decline/expire, auto-trigger next round
- Maximum 3 rounds before escalating to admin

### 5.2 Payment Rules
- Minimum withdrawal: **₹500**
- Payment held in escrow until delivery confirmed
- Partner receives **85%** of package price (15% platform fee)
- Bank account must be linked and verified before withdrawal
- Earnings auto-credited to partner wallet on DELIVERED status

### 5.3 Cancellation Rules
| Who Cancels | When | What Happens |
|-------------|------|-------------|
| Client | Before partner arrives | Full refund, booking cancelled |
| Client | After partner arrives | Partial refund (50%), partner gets shoot fee |
| Partner | Before arriving | Booking re-dispatched to next 5 partners |
| Partner | During shoot | Booking re-dispatched, partner penalized |

### 5.4 Partner Verification Tiers
| Tier | Capabilities |
|------|-------------|
| **Unverified** | Cannot accept bookings, view-only |
| **Pending** | Can view available work, cannot accept |
| **Verified** | Full access: accept, complete, withdraw |
| **Suspended** | Cannot accept new work, existing work continues |

### 5.5 Data Isolation
- Each client's data is allotted to **one specific editor at a time**
- Partners see only the data relevant to their assigned bookings
- Editor access is managed through the web dashboard (separate from mobile app)
- Cloud sync ensures footage flows: Partner device → Cloud → Editor workstation

---

## 6. Future Features (Roadmap)

### Phase 2 (Next 4 weeks)
- [ ] Push notifications (FCM/APNs)
- [ ] In-app chat between client and partner
- [ ] Partner ratings and reviews public page
- [ ] Editor web dashboard for receiving synced footage
- [ ] Real payment gateway integration (Razorpay)
- [ ] Admin dashboard for managing partners and disputes

### Phase 3 (Next 8 weeks)
- [ ] Partner heatmap showing real-time availability
- [ ] Smart matching (partner skills ↔ client requirements)
- [ ] Subscription packages for recurring clients
- [ ] Referral program (₹200 credit per referral)
- [ ] Multi-city expansion with city-specific pricing
- [ ] AI-powered shot suggestions for partners

### Phase 4 (Next 12 weeks)
- [ ] Native iOS/Android apps (React Native)
- [ ] Cloud sync with resume capability
- [ ] 4K/HDR upload support with adaptive compression
- [ ] Team accounts for agencies
- [ ] White-label solution for enterprise clients
- [ ] Analytics dashboard for clients (engagement metrics)

---

## 7. Mobile App ↔ Web App Sync

### 7.1 Architecture
```
[Mobile App] ←→ [Next.js API] ←→ [SQLite/PostgreSQL]
                                  ←→ [WebSocket Service] ←→ [Real-time Push]
                                  
[Partner Device] → [Cloud Storage] → [Editor Web Dashboard]
     (shoot)         (sync footage)    (edit & deliver)
```

### 7.2 Sync Process
1. Partner captures footage on mobile
2. App syncs raw files to cloud storage (S3/GCS)
3. Editor web dashboard receives notification
4. Editor downloads footage, edits, and uploads final reel
5. Client receives delivery notification on mobile
6. Client downloads reel within 30-day window

### 7.3 Web Dashboard (Editor)
- Login with editor credentials
- View assigned bookings with footage status
- Download raw footage from cloud
- Upload edited reels
- Track editing progress and delivery deadlines
- Communicate with client (via in-app chat)

---

## 8. Security & Privacy

- All partner profile fields are **verification-gated** — cannot change name/email/phone without support
- Client data is **isolated** per editor assignment
- Privacy Shield ensures partner acknowledges data protection before accessing client info
- Payment processing via PCI-compliant gateways only
- WebSocket connections authenticated with partner/user tokens
- API rate limiting to prevent abuse
- File uploads validated for type and size

---

## 9. Success Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|--------|-------------------|-------------------|
| Bookings completed | 50 | 500 |
| Active partners | 20 | 100 |
| Average delivery time | 100 min | 75 min |
| Partner acceptance rate | 70% | 85% |
| Client satisfaction (4+ stars) | 80% | 90% |
| Withdrawal success rate | 95% | 99% |

---

## 10. Non-Goals (Out of Scope)
- Video editing within the mobile app (editors use desktop tools)
- Live streaming capabilities
- Drone/aerial shot booking
- International payments (INR only for v1)
- Multi-language support (English only for v1)
