# Orbit — Product Requirements Document

**Version:** 1.0  
**Date:** March 2026  
**Author:** Orbit Product Team  
**Status:** Active  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision & Goals](#3-product-vision--goals)
4. [User Personas](#4-user-personas)
5. [Feature Specifications](#5-feature-specifications)
6. [Feature Ideas for Future Integration](#6-feature-ideas-for-future-integration)
7. [Technical Architecture](#7-technical-architecture)
8. [Monetization Strategy](#8-monetization-strategy)
9. [Success Metrics (KPIs)](#9-success-metrics-kpis)
10. [Roadmap](#10-roadmap)
11. [Risk Analysis](#11-risk-analysis)

---

## 1. Executive Summary

### What is Orbit?

Orbit is a mobile-first, on-demand platform that connects clients who need professional video content with vetted video editors and shooters (Partners). By combining real-time location-based shoot coordination, intelligent brand-identity integration (Brand DNA), and ultra-fast 60–120 minute delivery, Orbit transforms what is traditionally a days-long, back-and-forth editing process into a single seamless session.

### Value Proposition

> **Professional video content, delivered in under 2 hours — from shoot to final edit.**

Orbit eliminates the friction between needing video content and having it. Clients book a shoot, a Partner arrives on-location, captures footage, syncs it for editing in real time, and delivers a polished reel — all within the same session.

### Target Market

| Segment | Description | Size (India) |
|---|---|---|
| Content Creators | Instagram/YouTube creators needing regular reels | ~80 M+ |
| Small Businesses | D2C brands, restaurants, salons needing social content | ~60 M+ |
| Marketing Managers | Brand teams needing UGC and event coverage | ~5 M+ |
| Event Organizers | Wedding planners, corporate event managers | ~2 M+ |

### Key Differentiators

| Differentiator | Description |
|---|---|
| **60–120 min delivery** | Industry-first same-session delivery from shoot to final edit |
| **Brand DNA** | Embedded brand identity system (logo, font, color) auto-applied to edits |
| **On-demand Partner dispatch** | Real-time Partner matching, like Uber for video production |
| **End-to-end workflow** | Navigate → Shoot → Sync → Privacy Shield → Payment in a single flow |
| **Privacy Shield** | Client data protection with AES-256 encryption and consent-based footage handling |
| **Glassmorphism UX** | Premium, modern interface that signals trust and professionalism |

---

## 2. Problem Statement

### Current Pain Points in Video Editing

1. **Slow turnaround**: Traditional video editing takes 3–14 days from brief to final cut. Content creators and brands need content _today_, not next week.

2. **Discovery friction**: Finding a reliable video editor or videographer relies on word-of-mouth, Instagram DMs, or freelance marketplaces with no quality guarantee.

3. **Brand inconsistency**: Every edit looks different. There is no standardized way to ensure brand colors, fonts, and logo placement are consistent across every piece of content.

4. **Opaque process**: Clients have zero visibility into shoot progress, editing status, or delivery timelines. "It's almost done" is the industry standard update.

5. **Payment disputes**: No escrow, no milestone-based payments. Clients pay upfront and hope for the best, or editors deliver and chase payments.

6. **No location coordination**: Shoots require separate messaging to share location, coordinate arrival, and manage on-ground logistics.

### Why Existing Solutions Fall Short

| Solution | Limitation |
|---|---|
| Freelance marketplaces (Fiverr, Upwork) | Multi-day delivery, no on-location shooting, no Brand DNA |
| In-house editors | Expensive ($2,000–5,000/month salary), limited capacity |
| DIY tools (CapCut, InShot) | Steep learning curve, no professional shoot, inconsistent quality |
| Traditional agencies | $5,000+ per project, 2–4 week timelines, overkill for social content |
| Instagram DM freelancers | No quality guarantee, no escrow, no tracking |

### The Gap Orbit Fills

There is no platform that combines **on-demand shoot coordination**, **real-time editing**, and **brand-consistent delivery** in a single transaction. Orbit sits at the intersection of Uber (on-demand dispatch), Canva (brand consistency), and Fiverr (creative services marketplace) — purpose-built for the short-form video era.

---

## 3. Product Vision & Goals

### Vision Statement

> **Orbit makes professional video content as easy to order as a ride — instant, consistent, and delightful.**

### Short-Term Goals (0–3 Months | MVP)

- [ ] Launch core booking flow (Client selects package → books date/time/location → Partner dispatched)
- [ ] Complete Partner workflow (Navigate → Shoot → Sync → Privacy Shield → Payment)
- [ ] Deliver first 100 bookings end-to-end
- [ ] Achieve 4.0+ average Partner rating
- [ ] Onboard 50 verified Partners in Bangalore

### Medium-Term Goals (6–12 Months)

- [ ] Integrate Razorpay/Stripe for real payment processing
- [ ] Launch in-app chat between Client and Partner
- [ ] Implement real-time push notifications (Firebase Cloud Messaging)
- [ ] Scale to 500+ active Partners across 5 Indian cities
- [ ] Introduce Subscription Plans for repeat clients
- [ ] Launch Partner Tier system (Bronze → Silver → Gold → Platinum)
- [ ] Achieve 30%+ month-over-month booking growth

### Long-Term Vision (1–3 Years)

- [ ] Expand to international markets (Southeast Asia, Middle East)
- [ ] Launch AI-powered editing suggestions and auto-quality checks
- [ ] Build Enterprise/Agency dashboard for multi-seat teams
- [ ] Open Orbit API for third-party integrations (Shopify, WordPress, HubSpot)
- [ ] Introduce Brand Partnership Marketplace (connect brands with top Partners)
- [ ] Target 10,000+ monthly active Partners and 50,000+ monthly bookings

---

## 4. User Personas

### Client Personas

#### Persona 1: Priya — Content Creator

| Attribute | Detail |
|---|---|
| **Age** | 24 |
| **Occupation** | Fashion & lifestyle content creator (450K followers) |
| **Goal** | Post 5–7 reels per week with consistent brand aesthetics |
| **Pain** | Spending 6+ hours/week editing; edits don't match her brand colors |
| **How Orbit helps** | Brand DNA ensures every reel matches her palette; 60-min delivery means she can book a shoot in the morning and post by lunch |

#### Persona 2: Rajesh — Small Business Owner

| Attribute | Detail |
|---|---|
| **Age** | 35 |
| **Occupation** | Runs a chain of 3 restaurants in Bangalore |
| **Goal** | Create weekly promotional reels for Instagram and Google Business |
| **Pain** | Cannot afford an in-house editor; freelance editors are unreliable |
| **How Orbit helps** | Professional package at ₹4,999 covers 3 reels; no commitment, pay per booking |

#### Persona 3: Meera — Marketing Manager

| Attribute | Detail |
|---|---|
| **Age** | 29 |
| **Occupation** | Brand manager at a D2C skincare startup |
| **Goal** | Source UGC-style content from real users with brand consistency |
| **How Orbit helps** | Professional UGC package with Brand DNA integration; every piece of content is on-brand, no matter which Partner shoots it |

#### Persona 4: Vikram — Event Organizer

| Attribute | Detail |
|---|---|
| **Age** | 40 |
| **Occupation** | Corporate event planner |
| **Goal** | Get same-day highlight reels from events for social media |
| **Pain** | Traditional editors deliver 3–5 days post-event; the moment has passed |
| **How Orbit helps** | 60–120 min delivery means highlight reels go live before the event ends |

### Partner Personas

#### Persona 5: Arjun — Freelance Video Editor

| Attribute | Detail |
|---|---|
| **Age** | 26 |
| **Occupation** | Full-time freelance video editor |
| **Goal** | Fill idle time between projects; earn consistent monthly income |
| **Pain** | Feast-or-famine income; spends 40% of time finding clients |
| **How Orbit helps** | Steady stream of bookings; no client-hunting; instant payment via Orbit Wallet |

#### Persona 6: Sneha — Professional Videographer

| Attribute | Detail |
|---|---|
| **Age** | 31 |
| **Occupation** | Wedding & event videographer |
| **Goal** | Monetize off-season weekdays when events are sparse |
| **Pain** | Weekday underutilization; equipment sits idle |
| **How Orbit helps** | Toggle online on slow days; accept short-form shoots that fit between events |

#### Persona 7: Rohan — College Student (Part-Time)

| Attribute | Detail |
|---|---|
| **Age** | 20 |
| **Occupation** | Mass communication student |
| **Goal** | Earn pocket money and build a professional portfolio while studying |
| **Pain** | No professional network; no way to find paying gigs |
| **How Orbit helps** | Onboarding with verification; work as much or as little as schedule allows; build verified work history |

---

## 5. Feature Specifications

### 5.1 Client Features

#### 5.1.1 Authentication & Onboarding

| Feature | Detail |
|---|---|
| **Sign-up methods** | Email/OTP, Google Sign-In, Apple Sign-In |
| **OTP flow** | 6-digit OTP sent to email; auto-verify when possible |
| **Profile setup** | Name, avatar selection (4 creative presets + custom photo upload), location |
| **Role selection** | Choose "I need video editing" (Client) or "I am a video professional" (Partner) |

**Acceptance Criteria:**
- OTP is sent within 5 seconds
- Auto-read OTP on supported devices
- Session persists via Zustand + localStorage

#### 5.1.2 Dashboard & Metrics

| Metric Card | Description |
|---|---|
| **Active Bookings** | Count of bookings in PENDING/SHOOTING/EDITING status |
| **Completed Projects** | Total delivered bookings |
| **Downloads** | Total videos downloaded |
| **Spent** | Total amount spent on bookings |

- Cards use glassmorphism with gradient accents (Cyber Lime / Cyan → Purple)
- Pull-to-refresh updates booking statuses
- Empty states guide new users to first booking

#### 5.1.3 Brand DNA

Brand DNA is Orbit's proprietary brand identity system embedded into the client profile. When a Partner edits footage, Brand DNA ensures brand consistency.

| Field | Purpose |
|---|---|
| **Brand Logo** | Uploaded logo overlaid on edits |
| **Brand Font** | Font name passed to Partner's editing template |
| **Brand Color** | Hex color applied to color grading, lower thirds, and text |
| **Editor Requirements** | Free-text instructions (e.g., "Use jump cuts, no slow-mo, trendy audio") |

**Behavior:**
- Brand DNA is auto-included in Professional (UGC) package bookings
- Partners receive Brand DNA as part of the booking brief
- "Complete your Brand DNA" prompt on dashboard if fields are empty
- Completing Brand DNA redirects to packages with a highlight animation

#### 5.1.4 Package Selection & Booking

| Package | Price | Focus | Delivery | Reels | Revisions |
|---|---|---|---|---|---|
| **Personalized** | ₹1,999 | Individual/Event cinematic reels | 60–120 min | 1 (up to 60 sec) | 1 round |
| **Professional (UGC)** | ₹4,999 | Brand-focused storytelling with Brand DNA | 60–120 min | Up to 3 (60 sec each) | 2 rounds |

**Booking Flow:**
1. Select package → See full feature breakdown
2. Select date (calendar picker with available dates)
3. Select time slot (30-min slots: 10:00 AM, 10:30 AM, …)
4. Enter shoot location (text input with location suggestions)
5. Add notes for the Partner
6. Confirm & Pay → Payment processing → Booking confirmed

**Acceptance Criteria:**
- Past dates are disabled in calendar
- Location field validates non-empty input
- Booking status transitions: PENDING → PAID → PARTNER_DISPATCHED
- Payment fails gracefully with retry option

#### 5.1.5 Real-Time Tracking

A visual pipeline showing booking progress through every stage:

| Stage | Description |
|---|---|
| **Partner Dispatched** | Partner matched and notified |
| **En Route** | Partner navigating to shoot location |
| **Shooting** | Partner is on-location capturing footage |
| **Syncing** | Footage uploading for editing (0–100% progress) |
| **Editing** | Editor working on the cut (countdown timer) |
| **Delivered** | Final video ready for download |

**Acceptance Criteria:**
- Sync percentage animates from 0 → 100%
- Edit countdown shows minutes remaining
- Stage transitions are animated (slide/glow effects)
- Completed stages show checkmarks

#### 5.1.6 Video Delivery & Download

- Delivered videos appear in tracking dashboard with download button
- 30-day redownload window after delivery
- Download button disabled after window expires
- Days remaining counter shown
- Downloaded badge shown after first download

#### 5.1.7 Review & Rating System

After delivery, clients can submit a review:

| Field | Type |
|---|---|
| **Partner Rating** | 1–5 stars |
| **Editor Rating** | 1–5 stars |
| **Feedback** | Free text (optional) |

- Reviews are tied to booking IDs (one review per booking)
- Partners see aggregated rating on their profile

#### 5.1.8 Profile Management

| Field | Editable | Notes |
|---|---|---|
| Name | Yes | |
| Avatar | Yes | Choose from 4 presets, or upload photo |
| Email | No | Auth identifier |
| Phone | Yes | |
| Location | Yes | |
| Brand Logo | Yes | Upload image |
| Brand Font | Yes | Text input |
| Brand Color | Yes | Color picker |
| Editor Requirements | Yes | Free text |

- Bottom navigation provides quick access to Dashboard, Packages, Tracking, Profile
- Profile shows avatar prominently with edit overlay

---

### 5.2 Partner Features

#### 5.2.1 Partner Verification & Onboarding

Partner onboarding is a heavy verification process to ensure quality and trust.

| Step | Detail |
|---|---|
| **1. Basic Info** | Full name, phone, email, location |
| **2. ID Verification** | Aadhaar/PAN upload (KYC) |
| **3. Portfolio** | Upload 3+ sample works (video links or files) |
| **4. Device Info** | Device used for shooting (iPhone 15 Pro, Pixel 8, etc.) |
| **5. Bank Account** | Link bank account for payouts (account number, IFSC, holder name) |
| **6. Skills & Specialization** | Tags: Cinematography, UGC, Event, Product, Food, Fashion |
| **7. Agreement** | Accept Partner terms and privacy policy |

**Verification States:**
- `PENDING` → Documents under review
- `VERIFIED` → All checks passed, can accept bookings
- `REJECTED` → Documents insufficient (with reason)

**Acceptance Criteria:**
- Verified fields are locked (non-editable) after verification
- Re-verification required for changes to verified fields
- Device info stored for Partner profile display

#### 5.2.2 Online/Offline Toggle

- Prominent toggle in partner dashboard header
- **Online**: Appears in Partner matching pool, receives booking requests
- **Offline**: Hidden from matching, no new booking alerts
- Toggle persists across sessions
- Visual indicator (green dot = online, gray dot = offline)

#### 5.2.3 Available Work Dashboard

Shows all open booking requests near the Partner's location:

| Card Field | Description |
|---|---|
| Package type | Personalized / Professional (UGC) |
| Location | Shoot address |
| Date & Time | When the shoot is scheduled |
| Earnings | Amount Partner will earn |
| Distance | Distance from Partner's current location |
| Brand DNA indicator | Shows if Brand DNA is attached |

**Actions:**
- **Accept**: Partner takes the booking → status changes to PARTNER_DISPATCHED
- **Decline**: Booking is re-assigned to next available Partner (declined Partner ID stored to prevent re-assignment)

**Acceptance Criteria:**
- Only show bookings within Partner's service radius
- Accepted bookings move to Active Workflow
- Declined bookings disappear from available list

#### 5.2.4 Active Workflow

The Partner's active booking follows a strict pipeline:

```
Navigate → Shoot → Sync → Privacy Shield → Payment
```

| Phase | Description | Partner Action |
|---|---|---|
| **Navigate** | Partner receives shoot location and navigates to client | Open maps integration; confirm arrival |
| **Shoot** | Partner is on-location capturing footage | Mark as "Shooting"; capture per package specs |
| **Sync** | Footage is uploaded for editing | Upload progress bar (0–100%); auto-sync on WiFi if enabled |
| **Privacy Shield** | Client data consent and protection | Confirm footage handling consent; AES-256 encryption applied |
| **Payment** | Earnings credited to Orbit Wallet | Payment confirmation screen with amount breakdown |

**Acceptance Criteria:**
- Each phase must be completed in order (no phase skipping)
- Navigate phase shows integrated map with directions
- Sync phase supports resume on network interruption
- Privacy Shield requires explicit Partner consent
- Payment phase credits wallet and shows breakdown (gross, platform fee, net)

#### 5.2.5 Earnings & Wallet

| Component | Description |
|---|---|
| **Wallet Balance** | Current available balance |
| **Pending Clearance** | Earnings in holding period (T+2 settlement) |
| **Total Withdrawn** | Cumulative withdrawals to date |
| **Last Withdrawal** | Date of most recent withdrawal |
| **Earnings Breakdown** | Per-booking: gross amount, platform fee (15%), net payout |

**Wallet Operations:**
- `creditPartnerWallet(amount)` — Credits after booking delivery
- `withdrawFromWallet(amount)` — Transfer to linked bank account
- `linkBankAccount(account)` — Add/verify bank details

**Acceptance Criteria:**
- Cannot withdraw more than available balance
- Minimum withdrawal: ₹500
- Bank account must be verified before first withdrawal
- Transaction history available

#### 5.2.6 Bank Account Linking & Withdrawal

| Field | Required |
|---|---|
| Bank Name | Yes |
| Account Number | Yes |
| IFSC Code | Yes |
| Account Holder Name | Yes |

- Account verification via penny-drop (₹1 credit to verify ownership)
- Once verified, `isVerified = true` and account is locked
- Withdrawal processing: 24–48 hours to bank account

#### 5.2.7 Settings & Preferences

| Setting | Default | Description |
|---|---|---|
| Notifications | On | Push notifications for bookings, payments |
| New Booking Alerts | On | Sound + vibration for new booking requests |
| Payment Alerts | On | Notification when earnings credited |
| Auto-Sync on WiFi | On | Automatically sync footage when connected to WiFi |
| High Quality Upload | Off | Upload original quality (uses more data) |
| Location Tracking | On | Share location during Navigate phase |

#### 5.2.8 Search

- Full-screen search overlay for finding bookings by:
  - Location name
  - Date
  - Package type
  - Client name
- Recent searches stored locally
- Autocomplete suggestions from booking history

#### 5.2.9 Profile (Locked Verified Fields)

| Field | Editable | Locked After Verification |
|---|---|---|
| Name | No (if verified) | Yes |
| Phone | No (if verified) | Yes |
| Location | Yes | No |
| Device Info | Yes | No |
| Rating | Auto | — |
| Completed Projects | Auto | — |
| Verification Badge | Auto | — |

- Verified fields show a lock icon and "Verified" badge
- Changes to locked fields require re-verification
- Profile shows completed projects count and star rating prominently

---

### 5.3 Shared Features

#### 5.3.1 OTP Authentication

- 6-digit OTP via email
- 5-minute expiry window
- Rate limiting: 3 OTP requests per 10 minutes
- Resend OTP option with countdown timer
- Auto-focus next input field on digit entry

#### 5.3.2 Real-Time Notifications

| Notification Type | Client | Partner |
|---|---|---|
| Booking confirmed | Yes | — |
| Partner dispatched | Yes | — |
| Partner arrived | Yes | — |
| Shooting started | Yes | — |
| Sync progress (25%, 50%, 75%, 100%) | Yes | — |
| Edit complete | Yes | — |
| Video delivered | Yes | — |
| New booking request | — | Yes |
| Payment credited | — | Yes |
| Booking cancelled | Yes | Yes |
| Review received | — | Yes |

#### 5.3.3 Privacy Shield

Privacy Shield is Orbit's data protection framework:

- **Consent-based**: Client must consent to footage usage before Partner begins
- **AES-256 encryption**: All uploaded footage encrypted in transit and at rest
- **Automatic deletion**: Raw footage deleted after 30 days post-delivery
- **Access control**: Only assigned Partner and editor can access footage
- **Audit trail**: All access to client media is logged

#### 5.3.4 Orbit Wallet

Shared wallet system for both Clients and Partners:

| Feature | Client | Partner |
|---|---|---|
| View balance | Payment history | Earnings balance |
| Add funds | Yes (for future bookings) | No |
| Withdraw | No | Yes (to bank account) |
| Transaction history | Yes | Yes |
| Auto-credit | Refunds | Booking payments |

---

## 6. Feature Ideas for Future Integration

The following features are organized by category and represent opportunities to expand Orbit's value proposition beyond the current MVP.

### 6.1 AI-Powered Features

| # | Feature | Description | Impact |
|---|---|---|---|
| 1 | **AI Video Quality Checker** | Automated pre-delivery quality scan (resolution, audio levels, framing) that flags issues before the client sees the final cut | Reduces revision requests by 40%+ |
| 2 | **Auto Thumbnail Generation** | AI selects the best frame and generates 3 thumbnail options with brand-colored text overlay | Increases client social media CTR |
| 3 | **Smart Editing Suggestions** | AI analyzes Brand DNA + trending audio/formats and suggests edit styles to Partners | Improves edit quality consistency |
| 4 | **AI Caption/Subtitle Generation** | Auto-generate captions in Hindi + English with brand font styling | Accessibility + engagement boost |
| 5 | **Voice-to-Text Transcription** | Transcribe shoot audio for searchable notes and subtitle generation | Content repurposing |
| 6 | **Content Calendar** | AI-powered posting schedule based on optimal engagement times for client's niche | Retention feature for repeat bookings |
| 7 | **Smart Matchmaking** | ML model that matches clients with Partners based on style compatibility, past ratings, and specialization | Higher satisfaction, lower cancellation |

### 6.2 Platform Features

| # | Feature | Description | Impact |
|---|---|---|---|
| 8 | **Subscription Plans** | Monthly plans (e.g., 4 reels/month at 20% discount) for repeat clients | Predictable revenue, higher LTV |
| 9 | **Referral Program** | "Invite a friend, get ₹500 off" for clients; "Refer a Partner, get ₹1,000 bonus" for Partners | Organic growth engine |
| 10 | **Loyalty Points (Orbit Coins)** | Earn 1 coin per ₹100 spent; redeem for discounts or free add-ons | Repeat purchase incentive |
| 11 | **Partner Tiers** | Bronze → Silver → Gold → Platinum based on completed projects, ratings, and response time; higher tiers get premium bookings and lower platform fees | Partner retention and quality ladder |
| 12 | **Escrow Payments** | Client payment held in escrow until delivery confirmed; auto-release after 48 hours if no dispute | Trust and dispute reduction |
| 13 | **Dispute Resolution** | In-app ticket system with Orbit mediation; evidence upload (screenshots, chat logs); 72-hour SLA for resolution | Professional conflict handling |

### 6.3 Social Features

| # | Feature | Description | Impact |
|---|---|---|---|
| 14 | **Partner Portfolio/Showcase** | Public profile page with best work, ratings, reviews, and booking CTA | Partner marketing + client trust |
| 15 | **Client Reviews Page** | Public page showing all reviews for a Partner with filterable tags | Social proof and transparency |
| 16 | **Partner Leaderboard** | Monthly rankings by rating, completion rate, and bookings; top Partners get featured placement | Gamification and motivation |
| 17 | **Community Forum** | Partner-only forum for sharing tips, templates, and networking | Partner engagement and retention |

### 6.4 Business Features

| # | Feature | Description | Impact |
|---|---|---|---|
| 18 | **Tax Documentation** | Auto-generated GST invoices for clients; tax summary downloads for Partners (Form 16A equivalent) | Compliance and professional billing |
| 19 | **Team Accounts (Agency)** | Multi-seat accounts for agencies with shared Brand DNA, consolidated billing, and admin controls | Enterprise market entry |
| 20 | **Bulk Booking Discounts** | 10+ bookings/month gets 15% discount; custom quotes for 50+ bookings | Large client acquisition |
| 21 | **Analytics Dashboard** | Client: content performance, spend analytics; Partner: earnings trends, peak hours, acceptance rate optimization | Data-driven decisions |
| 22 | **API for Integrations** | REST API for Shopify (product video automation), WordPress (auto-embed), and HubSpot (marketing video workflows) | Platform ecosystem play |

### 6.5 Communication

| # | Feature | Description | Impact |
|---|---|---|---|
| 23 | **In-App Chat** | Real-time messaging between Client and Partner with media sharing and read receipts | Reduces coordination friction |
| 24 | **Video Call Support** | One-tap video call for shoot briefings, especially for remote/difficult locations | Better creative alignment |
| 25 | **Status Update Push Notifications** | Granular push notifications at every booking stage with deep links to the relevant screen | Reduces "where is my video?" anxiety |

### 6.6 Monetization

| # | Feature | Description | Impact |
|---|---|---|---|
| 26 | **Commission Model** | 15% platform fee on each booking (deducted from Partner payout) | Core revenue stream |
| 27 | **Premium Partner Listing** | Paid promotion for Partners to appear higher in client search results | Partner monetization |
| 28 | **Rush Delivery Surcharge** | 30-min delivery option for +50% fee | Premium revenue from urgent needs |
| 29 | **Brand Partnership Marketplace** | Brands post campaigns; Partners apply to participate; Orbit takes marketplace fee | Two-sided marketplace expansion |

---

## 7. Technical Architecture

### 7.1 Current Stack Overview

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 | Full-stack React framework with App Router |
| **Language** | TypeScript | Type safety across client and server |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with glassmorphism utilities |
| **UI Components** | shadcn/ui | Pre-built accessible components (Dialog, Calendar, Switch, etc.) |
| **State Management** | Zustand | Lightweight client state with localStorage persistence |
| **ORM** | Prisma | Type-safe database queries with SQLite |
| **Database** | SQLite | Embedded database for MVP (migrate to PostgreSQL for production) |
| **Authentication** | Custom OTP | Email-based 6-digit OTP flow |
| **Deployment** | Caddy | Reverse proxy with auto-HTTPS |

### 7.2 Database Schema Overview

```
┌─────────────────────┐       ┌─────────────────────┐
│        User         │       │       Package        │
├─────────────────────┤       ├─────────────────────┤
│ id          (CUID)  │       │ id          (CUID)  │
│ email       (unique)│       │ name                │
│ name               │       │ tier       (unique) │
│ phone              │       │ price      (INR)     │
│ location           │       │ focus               │
│ role    (USER/     │       │ deliveryTime        │
│         PARTNER/   │       │ features   (JSON)   │
│         ADMIN)     │       │ popular             │
│ brandLogo          │       └─────────┬───────────┘
│ brandFont          │                 │
│ brandColor         │                 │ 1:N
│ editorRequirements │                 ▼
│ avatar             │       ┌─────────────────────┐
│ createdAt          │       │       Booking        │
│ updatedAt          │       ├─────────────────────┤
└────────┬───────────┘       │ id          (CUID)  │
         │                   │ userId       (FK)   │
         │ 1:N               │ packageId    (FK)   │
         ▼                   │ partnerId    (FK)   │
┌─────────────────────┐       │ status    (PENDING/ │
│       Partner       │       │   PAID/DISPATCHED/ │
├─────────────────────┤       │   SHOOTING/SYNCING/│
│ id          (CUID)  │       │   EDITING/DELIVERED│
│ userId       (FK)   │       │   /CANCELLED)      │
│ location           │       │ paymentStatus      │
│ latitude           │       │ paymentId          │
│ longitude          │       │ paymentMethod      │
│ availability       │       │ bookingDate        │
│ rating             │       │ timeSlot           │
│ completedProjects  │       │ location           │
│ deviceInfo         │       │ syncPercentage     │
│ createdAt          │       │ editCountdown      │
│ updatedAt          │       │ deliveredAt        │
└─────────────────────┘       │ notes              │
                              │ createdAt          │
                              │ updatedAt          │
                              └─────────────────────┘
```

### 7.3 API Structure

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/send-otp` | POST | Send 6-digit OTP to email |
| `/api/auth/verify-otp` | POST | Verify OTP and authenticate |
| `/api/users` | GET/POST | List users / Create user |
| `/api/packages` | GET | List available packages |
| `/api/bookings` | GET/POST | List bookings / Create booking |
| `/api/bookings/[id]` | GET/PATCH | Get/Update specific booking |
| `/api/bookings/[id]/payment` | POST | Process booking payment |
| `/api/bookings/[id]/track` | GET | Get real-time tracking data |
| `/api/partners` | GET | List available partners |
| `/api/partners/[id]` | GET/PATCH | Get/Update partner profile |

### 7.4 Security Considerations

| Area | Implementation |
|---|---|
| **Encryption at rest** | AES-256 for sensitive fields (bank account numbers, KYC documents) |
| **Encryption in transit** | HTTPS via Caddy reverse proxy; TLS 1.3 |
| **Privacy Shield** | Consent-based footage access; auto-deletion after 30 days |
| **KYC Verification** | Aadhaar/PAN verification for Partners before accepting bookings |
| **Authentication** | OTP with 5-min expiry; rate limiting (3 attempts per 10 min) |
| **Input validation** | Server-side validation on all API endpoints; Zod schemas |
| **SQL injection** | Prevented by Prisma ORM parameterized queries |
| **XSS protection** | React's built-in escaping; Content-Security-Policy headers |
| **Wallet security** | Double-entry bookkeeping; withdrawal requires verified bank account |
| **Rate limiting** | API rate limiting per IP and per user |

---

## 8. Monetization Strategy

### 8.1 Revenue Streams

| Stream | Model | Target Revenue (Year 1) |
|---|---|---|
| **Platform Commission** | 15% per booking (deducted from Partner payout) | ₹75L+ |
| **Rush Delivery Surcharge** | +50% fee for 30-min delivery | ₹10L+ |
| **Premium Partner Listing** | ₹999/month for priority visibility | ₹5L+ |
| **Brand Partnership Marketplace** | 10% fee on brand campaign bookings | ₹8L+ |
| **Enterprise/Agency Plans** | Custom pricing for 50+ bookings/month | ₹15L+ |

### 8.2 Commission Breakdown

For a Professional (UGC) booking at ₹4,999:

| Component | Amount |
|---|---|
| Client pays | ₹4,999 |
| Platform fee (15%) | ₹749.85 |
| Partner receives | ₹4,249.15 |
| Payment gateway fee (~2%) | ₹99.98 |
| **Net platform revenue** | **₹649.87** |

### 8.3 Subscription Tiers (Planned)

| Plan | Price | Included | Target |
|---|---|---|---|
| **Free** | ₹0 | Pay-per-booking | Casual clients |
| **Starter** | ₹2,999/month | 2 reels included + 10% off additional | Regular creators |
| **Pro** | ₹7,999/month | 5 reels included + 20% off + priority matching | Power users |
| **Enterprise** | Custom | Unlimited + team accounts + API access | Agencies |

---

## 9. Success Metrics (KPIs)

### 9.1 Client-Side Metrics

| KPI | Target (6 months) | Measurement |
|---|---|---|
| Bookings per user (monthly) | 2.5+ | Total bookings / active clients |
| Repeat booking rate | 40%+ | % of clients with 2+ bookings |
| Average order value | ₹3,500+ | Total GMV / total bookings |
| Delivery satisfaction | 4.2+ stars avg | Post-delivery rating |
| Time to first booking | < 10 min | Signup → first confirmed booking |
| Brand DNA completion rate | 60%+ | % of clients with all Brand DNA fields filled |

### 9.2 Partner-Side Metrics

| KPI | Target (6 months) | Measurement |
|---|---|---|
| Active Partners (monthly) | 200+ | Partners with ≥1 completed booking |
| Earnings per Partner (monthly) | ₹25,000+ | Average monthly Partner earnings |
| Booking completion rate | 95%+ | Completed / accepted bookings |
| Booking acceptance rate | 70%+ | Accepted / offered bookings |
| Partner retention (3-month) | 80%+ | Partners active after 90 days |
| Average response time | < 5 min | Time from booking offer to accept/decline |

### 9.3 Platform Metrics

| KPI | Target (6 months) | Measurement |
|---|---|---|
| Gross Merchandise Value (GMV) | ₹1Cr+/month | Total booking value |
| Take rate | 15% | Platform revenue / GMV |
| Net Promoter Score (NPS) | 50+ | Quarterly survey |
| Monthly churn rate | < 5% | Lost active users / total active users |
| 60-min delivery success | 80%+ | % of bookings delivered within 60 min |
| Partner dispatch time | < 15 min | Time from PAID to PARTNER_DISPATCHED |

---

## 10. Roadmap

### Phase 1: Core Platform (Current)

**Timeline:** Q1 2026  
**Focus:** MVP launch with end-to-end booking flow

- [x] Client dashboard with metrics
- [x] Brand DNA system
- [x] Package selection (Personalized + Professional)
- [x] Booking flow with date/time/location
- [x] Real-time tracking dashboard
- [x] Partner onboarding and verification
- [x] Partner active workflow (Navigate → Shoot → Sync → Privacy Shield → Payment)
- [x] Partner earnings and wallet
- [x] OTP authentication
- [x] Glassmorphism UI on black background
- [x] Mobile-first responsive design

### Phase 2: Payments & Real-Time (Q2–Q3 2026)

**Focus:** Real money flows and live communication

- [ ] Razorpay/Stripe payment integration
- [ ] Real-time push notifications (Firebase Cloud Messaging)
- [ ] In-app chat between Client and Partner
- [ ] WebSocket-based live tracking updates
- [ ] Escrow payment system
- [ ] Automated GST invoice generation
- [ ] Partner leaderboard
- [ ] Referral program launch

### Phase 3: AI & Subscriptions (Q4 2026 – Q1 2027)

**Focus:** Intelligence layer and recurring revenue

- [ ] AI video quality checker
- [ ] Auto thumbnail generation
- [ ] Smart editing suggestions engine
- [ ] AI caption/subtitle generation
- [ ] Subscription plans (Starter / Pro / Enterprise)
- [ ] Partner Tier system (Bronze → Silver → Gold → Platinum)
- [ ] Loyalty points (Orbit Coins)
- [ ] Content calendar
- [ ] Analytics dashboard (Client + Partner)
- [ ] Rush delivery option

### Phase 4: Enterprise & Expansion (2027+)

**Focus:** Scale and ecosystem

- [ ] Team accounts for agencies
- [ ] Orbit REST API
- [ ] Shopify / WordPress / HubSpot integrations
- [ ] Brand Partnership Marketplace
- [ ] Premium Partner Listing
- [ ] Video call support
- [ ] Community forum
- [ ] International expansion (Southeast Asia, Middle East)
- [ ] PostgreSQL migration for production scale
- [ ] Kubernetes deployment with auto-scaling

---

## 11. Risk Analysis

### 11.1 Market Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Low Partner supply in tier-2 cities | Medium | High | Pre-onboard Partners before city launch; offer sign-up bonuses; partner with film schools |
| Client expectation mismatch (60-min delivery unrealistic for complex edits) | Medium | High | Clear package scope definition; set realistic expectations in booking flow; rush delivery as premium tier |
| Competition from Fiverr/Upwork adding on-demand features | Low | Medium | Focus on location-based shoots (they can't); Brand DNA moat; faster delivery is defensible |
| Price sensitivity in Indian market | High | Medium | Personalized package at ₹1,999 is entry-level; subscription discounts for volume; EMI options for enterprise |

### 11.2 Technical Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| SQLite cannot handle production load | High | High | Plan PostgreSQL migration for Phase 2; load test before scaling; read replicas for analytics |
| Real-time sync fails on poor mobile networks | Medium | High | Offline-first sync with retry queue; auto-sync on WiFi; chunked upload with resume |
| Video upload/storage costs explode | Medium | Medium | Use CDN with tiered storage; auto-delete raw footage after 30 days; compress before upload |
| OTP delivery failures (email latency) | Medium | Medium | Add WhatsApp OTP as fallback; SMS OTP as premium option; longer expiry window (10 min) |

### 11.3 Operational Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Partner no-shows at shoot location | Medium | High | GPS-based arrival confirmation; penalty system for no-shows; auto-reassignment to nearby Partners |
| Quality inconsistency across Partners | Medium | High | AI quality checker; client reviews affect Partner rating; minimum rating threshold to stay active |
| Dispute between Client and Partner | Medium | Medium | Escrow payments; in-app dispute resolution with 72-hour SLA; mediation team |
| Partner churn due to low earnings | Medium | High | Minimum earnings guarantee in first 3 months; Partner tiers with increasing rates; loyalty bonuses |

### 11.4 Regulatory Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| KYC/data privacy regulations (DPDP Act 2023) | High | High | Privacy Shield as built-in compliance; consent-based data handling; DPO appointment |
| GST compliance for service marketplace | High | Medium | Auto-generated GST invoices; marketplace model (Orbit as aggregator vs. service provider) clarity |
| Labor classification (Partner as employee vs. contractor) | Low | High | Clear contractor agreement; Partners set own hours; no minimum work requirement |
| Content moderation (copyright, objectionable content) | Medium | High | AI content scanning; client takes responsibility for shoot content; takedown process |

---

## Appendix A: Glossary

| Term | Definition |
|---|---|
| **Brand DNA** | Orbit's brand identity system (logo, font, color, requirements) auto-applied to edits |
| **Cyber Lime** | Orbit's primary accent color (#CCFF00) |
| **Glassmorphism** | UI design style using frosted glass (backdrop-blur) effects on dark backgrounds |
| **GMV** | Gross Merchandise Value — total value of all bookings processed |
| **KYC** | Know Your Customer — identity verification process |
| **Partner** | A verified video professional (editor/shooter) on the Orbit platform |
| **Privacy Shield** | Orbit's data protection framework with AES-256 encryption and consent-based access |
| **Take Rate** | Platform's commission percentage on each transaction |
| **UGC** | User-Generated Content — authentic-feeling content created by/with real users |

## Appendix B: Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--orbit-cyan` | #00BFFF | Gradient start, links, progress indicators |
| `--orbit-purple` | #A020F0 | Gradient end, accents, active states |
| `--orbit-lime` | #CCFF00 | Primary CTA, success states, highlights |
| `--orbit-bg` | #000000 | Base background |
| `--orbit-glass` | rgba(255,255,255,0.05) | Glassmorphism card background |
| `--orbit-blur` | 16px | Backdrop blur radius |

---

*This document is a living artifact. Last updated: March 2026. For questions, contact the Orbit Product Team.*
