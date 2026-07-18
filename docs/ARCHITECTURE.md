# Orbit System Architecture

## Architecture Overview

Orbit is structured as a native mobile platform communicating with a unified backend via REST APIs and WebSockets.

```
┌────────────────────────────────────────────────────────┐
│                    MOBILE CLIENTS                      │
│  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │  Android Client App  │  │  Android Partner App │   │
│  │  (Jetpack Compose)   │  │  (Jetpack Compose)   │   │
│  │  Kotlin + Hilt +     │  │  Kotlin + Hilt +     │   │
│  │  Retrofit + OkHttp   │  │  Retrofit + OkHttp   │   │
│  └──────────┬───────────┘  └──────────┬───────────┘   │
└─────────────┼──────────────────────────┼───────────────┘
              │ REST + Socket.IO          │
┌─────────────▼──────────────────────────▼───────────────┐
│                  BACKEND (UNCHANGED)                    │
│  FastAPI Python (port 5000)  │  Socket.IO (port 3003)  │
│  Firebase Admin SDK          │  Redis                  │
│  Cashfree Payout Engine      │  Firestore              │
└─────────────────────────────────────────────────────────┘
              │                          │
┌─────────────▼──────────────────────────▼───────────────┐
│                   WEB CLIENTS (UNCHANGED)               │
│  Dashboard Next.js (port 3000)  │  Editor Next.js      │
└─────────────────────────────────────────────────────────┘
```

---

## Technical Components

### 1. Mobile Apps
- **Android**: Engineered natively in Kotlin using Jetpack Compose. Utilizes Hilt for dependency injection, Retrofit for REST APIs, Room for offline local caches/actions queue, and OkHttp for custom Socket.IO v4 wire protocol communication.
- **iOS**: Engineered natively in Swift using SwiftUI for modern high-energy UI styling, URLSession for async REST endpoints, and CoreData for offline queues.

### 2. Backend API Server (FastAPI)
- Acts as the single entry point for all mobile REST transactions.
- Integrates Firebase Admin SDK to perform authentication and validation checks.
- Interacts with Firestore database to manage collection documents for users, bookings, dispatches, transactions and OTP registries.

### 3. Real-time Dispatch Websocket (Socket.IO)
- Coordinates live booking dispatches (`booking:dispatched`), accepted-by-other alerts, and status stepper tracking (`booking:status-update`).
- Communicates internally with FastAPI REST triggers to broadcast changes across matching rooms.

### 4. Cashfree Payout integration
- Automates direct bank transfer salary payout of ₹700 to partner accounts on raw footage sync completion.
- Performs bank validations (Penny Drop account verification) on partner profile linking.
