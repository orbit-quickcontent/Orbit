# Orbit Platform — Native Re-Architecture Implementation Plan (v2.0)

> **Revised:** July 2026 — Incorporates all 15 architectural improvements.  
> **Score:** 9.5/10 after revisions.

---

## Guiding Principles

1. **Archive, don't delete Flutter** — Always have a working reference implementation.
2. **Backend is frozen** — Migration is frontend-only. Zero backend logic changes.
3. **FastAPI = single entry point** — All business logic lives in FastAPI over time.
4. **Kotlin-first** — Java only when forced by interoperability.
5. **Repository pattern everywhere** — UI never calls APIs directly.
6. **API versioning from day one** — `/api/v1/` prefix on all routes.

---

## Current State Assessment

### What Exists (Keep Unchanged — CRITICAL)

> [!IMPORTANT]
> The Python backend (`backend/`), Firestore schema, booking workflow, wallet engine, payout engine, editor workflow, dashboard, all API endpoints, and WebSocket contracts **must remain 100% backward compatible**. This migration is **frontend-only**. The AI agent must not "improve" backend code that is already working.

| Component | Tech | Status |
|-----------|------|--------|
| `backend/src/main.py` | FastAPI Python (1,529 lines) | ✅ FROZEN — Do not modify |
| `backend/src/services/firestore_client.py` | Python Firestore REST | ✅ FROZEN |
| `backend/src/services/websocket_server.py` | Socket.IO Python | ✅ FROZEN |
| `backend/src/services/cashfree_client.py` | Cashfree Python SDK | ✅ FROZEN |
| `backend/requirements.txt` | Python deps | ✅ FROZEN |
| `dashboard-web-app/` | Next.js dashboard | ✅ KEEP (web UI only) |
| `editor-web-app/` | Next.js editor portal | ✅ KEEP (web UI only) |
| `docker-compose.prod.yml` | Docker deployment | ✅ KEEP + light updates |
| `nginx.conf` | Nginx reverse proxy | ✅ KEEP |
| `firestore.rules` | Firebase security rules | ✅ KEEP |
| `backend/prisma/schema.prisma` | DB schema reference | ✅ KEEP |

### Flutter Apps — Archive, Not Delete

> [!WARNING]
> Do **NOT** delete `client_app/` or `partner_app/`. Move them to `archive/` so they serve as the working reference implementation throughout the migration. Only remove them after both Android and iOS native apps are feature-complete, tested, and deployed to production.

```
archive/
  flutter_client_old/    ← moved from client_app/
  flutter_partner_old/   ← moved from partner_app/
```

### What Gets Built (Net New)

| Component | Location | Tech |
|-----------|----------|------|
| Android Client App | `apps/android-client/` | Kotlin + Jetpack Compose |
| Android Partner App | `apps/android-partner/` | Kotlin + Jetpack Compose |
| iOS Client App | `apps/ios-client/` | Swift + SwiftUI |
| iOS Partner App | `apps/ios-partner/` | Swift + SwiftUI |
| Enhanced CI/CD | `.github/workflows/` | GitHub Actions |

---

## Open Questions

> [!IMPORTANT]
> Answers to these determine some implementation details:

1. **iOS Priority** — Build Android first then iOS, or in parallel?
2. **`google-services.json`** — Already in repo or needs GitHub Secrets?
3. **Razorpay In-App** — Android in-app Razorpay SDK, or payment handled via web redirect?
4. **Socket.IO vs Raw WS** — We're invested in Socket.IO on the server. Keep it (recommended), as raw WS migration would require server changes which are frozen.
5. **API versioning migration** — Should `/api/v1/` be added to the FastAPI backend now, or only on new endpoints? (Recommendation: add `/api/v1/` aliases on backend as a non-breaking addition)

---

## Proposed Changes

### Improvement 1 — Flutter Archival (Not Deletion)

#### [NEW] `archive/` directory

Move (do not delete) Flutter apps before building native replacements:

```bash
# Archive Flutter apps as reference implementations
mkdir -p archive
mv client_app/ archive/flutter_client_old/
mv partner_app/ archive/flutter_partner_old/
```

The archived Flutter code remains as:
- A working reference implementation during the migration
- Documentation of existing feature behavior
- A regression test baseline
- Only removed after native apps pass full feature parity testing

---

### Improvement 2 — Backend Freeze Policy

#### [NO CHANGE] `backend/`

**Policy:** The backend is **frozen for this migration sprint**. Any backend improvements (e.g., Firebase Admin SDK adoption, API versioning, background jobs) are tracked as **Phase 2 tickets** and executed in isolation after the mobile apps are stable.

**What this means:**
- No new routes added to `main.py` during mobile migration
- No Firestore client changes
- No WebSocket server changes
- No Cashfree client changes
- All mobile API calls use existing endpoints exactly as documented

---

### Improvement 3 — Next.js → FastAPI Migration (Gradual)

**Current state:** Some business logic may still exist in Next.js API routes inside `dashboard-web-app/`.

**Target architecture:**
```
CURRENT (transitional):
  Android/iOS  →  FastAPI  →  Firestore
  Dashboard    →  Next.js API routes  →  Firestore (some legacy)

TARGET (production):
  Android/iOS  →  FastAPI  →  Firestore
  Dashboard    →  FastAPI  →  Firestore      ← Next.js only serves UI
  Editor       →  FastAPI  →  Firestore
```

**Plan:**
- Phase 1 (now): Mobile apps call FastAPI only. Never call Next.js API routes.
- Phase 2 (post-migration): Audit `dashboard-web-app/` API routes. Move any business logic to FastAPI. Dashboard becomes a pure Next.js UI consuming FastAPI.
- Phase 3: `editor-web-app/` same treatment.

---

### Improvement 4 — Firebase Admin SDK (Future Phase)

> [!NOTE]
> The current `firestore_client.py` manually calls Firestore REST API. This works but lacks transaction support and is harder to maintain. **This is a Phase 2 improvement** — do not change during mobile migration.

**Phase 2 plan:**
```python
# Current (REST-based, frozen during migration)
from services.firestore_client import firestoreDb

# Future (Firebase Admin SDK)
import firebase_admin
from firebase_admin import firestore
db = firestore.client()
```

Benefits when migrated:
- Native transaction support
- Real-time listeners
- Simpler query syntax
- Official SDK maintenance

---

### Improvement 5 — Socket.IO Decision

**Decision: Keep Socket.IO.**

Rationale:
- The WebSocket server is frozen and already works well
- Socket.IO provides automatic reconnection, room-based broadcasting, and event namespacing
- Migrating to raw WebSockets would require server changes (backend is frozen)
- Android: implement Socket.IO client using `socket.io-client-java` library
- iOS: implement Socket.IO client using `socket.io-client-swift` library

This gives native apps first-class Socket.IO support without any server changes.

---

### Improvement 6 — Kotlin-Only Android

**Policy:** All Android code is **Kotlin-only**.

- `java/` source directories will only be used if a third-party library strictly requires Java interop (e.g., some payment SDKs)
- All new code: Kotlin
- All new tests: Kotlin + JUnit5 + MockK
- Language level: Kotlin 1.9+
- Coroutines for all async operations
- Flow for reactive state management

---

### Improvement 7 — Monorepo `apps/` Structure

**New repository layout:**

```
orbit/                              (repo root)
├── apps/
│   ├── android-client/             ← Kotlin Jetpack Compose (Client)
│   ├── android-partner/            ← Kotlin Jetpack Compose (Partner)
│   ├── ios-client/                 ← Swift SwiftUI (Client)
│   └── ios-partner/                ← Swift SwiftUI (Partner)
├── backend/                        ← FastAPI Python (FROZEN)
│   ├── src/
│   │   ├── main.py
│   │   └── services/
│   ├── requirements.txt
│   └── Dockerfile
├── dashboard/                      ← renamed from dashboard-web-app/
├── editor/                         ← renamed from editor-web-app/
├── archive/
│   ├── flutter_client_old/
│   └── flutter_partner_old/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── MIGRATION.md
│   └── RUNBOOK.md
├── .github/
│   └── workflows/
├── docker-compose.prod.yml
├── nginx.conf
└── README.md
```

---

### Improvement 8 — API Versioning

**All new mobile API calls use `/api/v1/` prefix.**

The existing FastAPI routes are at `/api/`. In Phase 2, we add `/api/v1/` aliases as non-breaking additions. During mobile migration, mobile apps will use the existing `/api/` routes (no server change needed), with the convention that we'll bump to `/api/v1/` when the backend is next touched.

**Mobile SDK base URL convention:**
```kotlin
// Android (Retrofit)
private const val BASE_URL = "https://api.orbitlogic.io/api/"
// Future: "https://api.orbitlogic.io/api/v1/"
```

**FastAPI versioning plan (Phase 2):**
```python
from fastapi import APIRouter

v1_router = APIRouter(prefix="/api/v1")

@v1_router.get("/bookings")
async def list_bookings_v1():
    # delegates to existing logic
    return await list_bookings()

app.include_router(v1_router)
```

---

### Improvement 9 — Background Jobs (Phase 2)

> [!NOTE]
> This is a **Phase 2 improvement**. The current APScheduler-based payout retry exists in `main.py`. During mobile migration, it stays unchanged. Post-migration, migrate to Celery.

**Current (keep frozen):**
```python
# main.py — APScheduler in-process
scheduler.add_job(check_and_retry_payouts, "interval", minutes=5)
```

**Phase 2 target:**
```
Redis Queue
    ↓
Celery Worker
    ↓
Tasks:
  - payout_processing
  - push_notifications (FCM)
  - email_notifications (SendGrid)
  - video_processing (thumbnail generation)
  - analytics_events
  - payout_retry (move from APScheduler)
```

**Docker service addition (Phase 2):**
```yaml
# docker-compose.prod.yml addition
celery-worker:
  build:
    context: ./backend
  command: celery -A src.tasks worker --loglevel=info
  depends_on:
    - redis
```

---

### Improvement 10 — Observability Stack

**Phase 1 (during mobile migration):** Add structured logging to mobile apps.

**Android (Client + Partner):**
```kotlin
// Timber + custom JSON formatter
Timber.plant(object : Timber.DebugTree() {
    override fun log(priority: Int, tag: String?, message: String, t: Throwable?) {
        // Structured JSON log: {timestamp, level, tag, message, userId}
    }
})
```

**Phase 2 (backend observability):**

| Layer | Tool |
|-------|------|
| Structured Logging | Python `structlog` → JSON |
| Error Tracking | Sentry (Python SDK + Android SDK + iOS SDK) |
| Performance Monitoring | Sentry Performance or Datadog APM |
| API Metrics | Prometheus + FastAPI middleware |
| Audit Logs | Already in Firestore (`client_audit_logs`, `partner_audit_logs`) |
| Uptime Monitoring | UptimeRobot or Betterstack |

**FastAPI observability middleware (Phase 2):**
```python
from structlog import get_logger
log = get_logger()

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    log.info("api_request",
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        duration_ms=round((time.time() - start) * 1000, 2)
    )
    return response
```

---

### Improvement 11 — Enhanced CI/CD Pipeline

**Full pipeline on every push to `main`:**

```
Push to main
    │
    ├─► Backend Tests         (.github/workflows/backend-test.yml)
    │       ├── Python lint (ruff)
    │       ├── Type check (mypy)
    │       ├── Unit tests (pytest)
    │       └── Security scan (bandit)
    │
    ├─► Android Client Build  (.github/workflows/android-client.yml)
    │       ├── Static analysis (detekt + lint)
    │       ├── Unit tests
    │       ├── Build debug APK
    │       ├── Build release APK
    │       ├── Build release AAB
    │       └── Upload all as artifacts
    │
    ├─► Android Partner Build (.github/workflows/android-partner.yml)
    │       └── (same as above)
    │
    ├─► iOS Client Build      (.github/workflows/ios-client.yml)
    │       ├── SwiftLint
    │       ├── Unit tests (XCTest)
    │       └── Build (xcodebuild)
    │
    ├─► iOS Partner Build     (.github/workflows/ios-partner.yml)
    │       └── (same as above)
    │
    └─► Create Release        (on tagged push)
            ├── Generate release notes (from commits)
            ├── Attach APKs + AABs
            └── Deploy backend (docker compose up)
```

**Workflow files:**
```
.github/workflows/
  backend-test.yml         — Python lint + mypy + pytest + bandit
  android-client.yml       — detekt + lint + test + APK + AAB + upload
  android-partner.yml      — detekt + lint + test + APK + AAB + upload
  ios-client.yml           — SwiftLint + XCTest + xcodebuild
  ios-partner.yml          — SwiftLint + XCTest + xcodebuild
  release.yml              — Release notes + artifact attach + deploy
```

---

### Improvement 12 — API Versioning (Detailed)

From day one, mobile apps use a versioned base URL. Even though the backend currently serves `/api/`, the mobile Retrofit clients will be configured to hit `/api/v1/` once the Phase 2 aliases are added.

**Retrofit setup (Android):**
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    private const val BASE_URL = BuildConfig.API_BASE_URL // "https://api.orbitlogic.io/"

    @Provides
    fun provideApiService(okHttpClient: OkHttpClient): OrbitApiService =
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(OrbitApiService::class.java)
}

interface OrbitApiService {
    @POST("api/auth/send-otp")           // Phase 1: /api/
    // Future: @POST("api/v1/auth/send-otp")  // Phase 2: /api/v1/
    suspend fun sendOtp(@Body body: SendOtpRequest): Response<SendOtpResponse>
    
    @POST("api/bookings")
    suspend fun createBooking(@Body body: CreateBookingRequest): Response<BookingResponse>
    // ... all endpoints
}
```

---

### Improvement 13 — Resumable Video Uploads (Partner App)

**Current:** Mock S3 upload to `PUT /api/upload/mock-s3`.

**Production-grade upload for Partner app:**

```
Partner films clips
    │
    ├─ Normal connectivity: Standard multipart upload
    │       OkHttp → PUT /api/upload/mock-s3
    │
    └─ Large files / poor connectivity: Chunked resumable upload
            Step 1: POST /api/upload/initiate  → uploadId
            Step 2: PUT /api/upload/chunk/{uploadId}/{partNumber}
            Step 3: POST /api/upload/complete/{uploadId}
```

**Android WorkManager for background uploads:**
```kotlin
// Upload continues even if app is backgrounded
class FootageSyncWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {
    override suspend fun doWork(): Result {
        val bookingId = inputData.getString("bookingId") ?: return Result.failure()
        return try {
            uploadFootageWithRetry(bookingId)
            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry() else Result.failure()
        }
    }
}

// Enqueue with constraints
val uploadRequest = OneTimeWorkRequestBuilder<FootageSyncWorker>()
    .setConstraints(Constraints(requiredNetworkType = NetworkType.CONNECTED))
    .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 30, TimeUnit.SECONDS)
    .setInputData(workDataOf("bookingId" to bookingId))
    .build()

WorkManager.getInstance(context).enqueue(uploadRequest)
```

**Features:**
- ✅ Continues upload in background (WorkManager)
- ✅ Automatic retry with exponential backoff (up to 3 attempts)
- ✅ Resumes after connectivity loss
- ✅ Progress updates to UI via LiveData/StateFlow
- ✅ Upload only when network is connected

---

### Improvement 14 — Offline Support for Partners

**Partner app offline-first design:**

```
Partner loses connectivity
    │
    ├─ Gig acceptance pending → Queue in Room DB
    ├─ Stage updates pending → Queue in Room DB
    ├─ Sync start pending → Queue in Room DB
    └─ Show offline banner in UI

Connectivity restored
    │
    ├─ Process queued actions in order
    ├─ Sync with server
    └─ Dismiss offline banner
```

**Room DB for offline queue:**
```kotlin
@Entity(tableName = "pending_actions")
data class PendingAction(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val type: String,           // ACCEPT_BOOKING, UPDATE_STAGE, SYNC_COMPLETE
    val payload: String,        // JSON serialized payload
    val bookingId: String,
    val createdAt: Long = System.currentTimeMillis(),
    val retryCount: Int = 0
)

@Dao
interface PendingActionDao {
    @Query("SELECT * FROM pending_actions ORDER BY createdAt ASC")
    fun observeAll(): Flow<List<PendingAction>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(action: PendingAction)

    @Delete
    suspend fun delete(action: PendingAction)
}
```

**Connectivity Monitor:**
```kotlin
class ConnectivityMonitor @Inject constructor(
    private val context: Context
) {
    val isOnline: StateFlow<Boolean> = // observe ConnectivityManager
    
    // When online: flush queue
    // When offline: show banner, queue actions
}
```

---

### Improvement 15 — Strict MVVM Repository Pattern

**Every screen follows this exact pattern — no exceptions:**

```
UI (Composable / SwiftUI View)
    │  observes State
    ▼
ViewModel
    │  calls UseCases / Repository methods
    ▼
Repository (interface + implementation)
    │  abstracts data source
    ▼
API Service (Retrofit / URLSession)
    │  makes HTTP calls
    ▼
Backend (FastAPI)
```

**Android implementation:**
```kotlin
// 1. API Service (Retrofit interface)
interface OrbitApiService {
    @POST("api/bookings/{id}/accept")
    suspend fun acceptBooking(
        @Path("id") bookingId: String,
        @Body body: AcceptBookingRequest
    ): Response<BookingResponse>
}

// 2. Repository Interface
interface BookingRepository {
    suspend fun acceptBooking(bookingId: String, partnerId: String): Result<Booking>
    fun observeAvailableGigs(): Flow<List<Booking>>
}

// 3. Repository Implementation
class BookingRepositoryImpl @Inject constructor(
    private val api: OrbitApiService,
    private val pendingActionDao: PendingActionDao,
    private val connectivityMonitor: ConnectivityMonitor
) : BookingRepository {
    override suspend fun acceptBooking(bookingId: String, partnerId: String): Result<Booking> {
        return if (connectivityMonitor.isOnline.value) {
            try {
                val response = api.acceptBooking(bookingId, AcceptBookingRequest(partnerId))
                if (response.isSuccessful) Result.success(response.body()!!.booking.toDomain())
                else Result.failure(Exception(response.errorBody()?.string()))
            } catch (e: Exception) {
                // Queue for offline retry
                pendingActionDao.insert(PendingAction(
                    type = "ACCEPT_BOOKING",
                    payload = """{"bookingId":"$bookingId","partnerId":"$partnerId"}""",
                    bookingId = bookingId
                ))
                Result.failure(OfflineException("Action queued for when online"))
            }
        } else {
            pendingActionDao.insert(PendingAction(...))
            Result.failure(OfflineException("No internet connection"))
        }
    }
}

// 4. ViewModel
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val bookingRepository: BookingRepository,
    private val partnerRepository: PartnerRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    fun acceptGig(bookingId: String, partnerId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            bookingRepository.acceptBooking(bookingId, partnerId)
                .onSuccess { booking ->
                    _uiState.update { it.copy(activeBooking = booking, isLoading = false) }
                }
                .onFailure { error ->
                    _uiState.update { it.copy(error = error.message, isLoading = false) }
                }
        }
    }
}

// 5. UI (Composable)
@Composable
fun AvailableGigsScreen(viewModel: HomeViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    // render based on uiState
}
```

---

## Android Client App — Screen Specifications

**Location:** `apps/android-client/`  
**Design:** Kinetic Noir — `#000000` base, `#A5E7FF` neon blue, `#EDB1FF` electric purple, Montserrat + Plus Jakarta Sans + Space Grotesk

### Screen Map
```
AuthScreen        → email entry + OTP verification
HomeScreen        → bottom nav shell (4 tabs)
  ├─ HomeFeedTab  → 2×2 grid + packages strip + stats + CTA
  ├─ PackagesTab  → full package listing (Personalized + Professional)
  ├─ TrackingTab  → live booking stepper (8 stages)
  └─ ProfileTab   → user info + settings
BookingFlowScreen → 3-step wizard (Contact → Date/Location → Package+Brand)
```

### Project Structure
```
apps/android-client/
  app/
    build.gradle.kts
    src/main/
      java/io/orbit/client/
        OrbitClientApp.kt
        MainActivity.kt
        navigation/NavGraph.kt
        di/
          NetworkModule.kt
          RepositoryModule.kt
        data/
          remote/
            OrbitApiService.kt         — Retrofit interface
            OrbitSocketClient.kt       — Socket.IO client (socket.io-client-java)
            dto/                       — Request/Response DTOs
          repository/
            AuthRepositoryImpl.kt
            BookingRepositoryImpl.kt
            PackageRepositoryImpl.kt
          local/
            OrbitDatabase.kt           — Room database
            SecurePrefs.kt             — EncryptedSharedPreferences
        domain/
          model/User.kt, Booking.kt, Package.kt
          repository/                  — Repository interfaces
        ui/
          theme/
            KineticNoirTheme.kt
            Color.kt, Typography.kt, Shape.kt
          auth/AuthScreen.kt + AuthViewModel.kt
          home/HomeFeedScreen.kt + HomeViewModel.kt
          packages/PackagesScreen.kt + PackagesViewModel.kt
          booking/BookingFlowScreen.kt + BookingViewModel.kt
          tracking/TrackingScreen.kt + TrackingViewModel.kt
          profile/ProfileScreen.kt + ProfileViewModel.kt
          components/                  — Shared composables
      res/
        values/strings.xml
        font/montserrat*.ttf, plus_jakarta_sans*.ttf, space_grotesk*.ttf
    google-services.json              — from GitHub Secrets in CI
```

---

## Android Partner App — Screen Specifications

**Location:** `apps/android-partner/`  
**Design:** Luminous Dark — `#000000` base, `#4BE277` neon green, `#DDB7FF` ethereal purple, Plus Jakarta Sans + Geist

### Screen Map
```
AuthScreen           → email + password login
HomeScreen           → bottom nav shell + online/offline toggle header
  ├─ GigsTab         → dispatched booking cards + Accept/Decline
  ├─ WorkTab         → 4-stage shoot workflow
  ├─ EarningsTab     → wallet + transaction log + withdraw
  └─ ProfileTab      → KYC stats + bank account linking
```

### Project Structure
```
apps/android-partner/
  app/
    build.gradle.kts
    src/main/
      java/io/orbit/partner/
        OrbitPartnerApp.kt
        MainActivity.kt
        navigation/NavGraph.kt
        di/
          NetworkModule.kt
          RepositoryModule.kt
          WorkManagerModule.kt
        data/
          remote/
            OrbitPartnerApiService.kt
            PartnerSocketClient.kt     — Socket.IO (socket.io-client-java)
            dto/
          repository/
            PartnerRepositoryImpl.kt
            BookingRepositoryImpl.kt
            EarningsRepositoryImpl.kt
          local/
            OrbitPartnerDatabase.kt    — Room (PendingAction, CachedBooking)
            SecurePrefs.kt
          workers/
            FootageSyncWorker.kt       — WorkManager upload worker
            OfflineActionSyncWorker.kt — Flush pending actions on reconnect
        domain/
          model/PartnerProfile.kt, Booking.kt, Transaction.kt, PendingAction.kt
          repository/
        ui/
          theme/
            LuminousDarkTheme.kt
            Color.kt, Typography.kt, Shape.kt
          auth/AuthScreen.kt + AuthViewModel.kt
          home/
            HomeScreen.kt
            AvailableGigsScreen.kt + HomeViewModel.kt
          work/WorkDetailScreen.kt + WorkViewModel.kt
          earnings/EarningsScreen.kt + EarningsViewModel.kt
          profile/ProfileScreen.kt + ProfileViewModel.kt
          components/
            OnlineBadge.kt
            GigCard.kt
            WalletCard.kt
            SyncProgressBar.kt
      res/
        font/plus_jakarta_sans*.ttf, geist*.ttf
    google-services.json
```

---

## iOS Apps — Structure

### `apps/ios-client/` — Swift + SwiftUI (Kinetic Noir)
```
OrbitClient.xcodeproj
OrbitClient/
  App/OrbitClientApp.swift + ContentView.swift
  Navigation/AppRouter.swift
  Network/
    APIClient.swift            — URLSession async/await
    SocketManager.swift        — socket.io-client-swift
  Data/
    Repository/
      AuthRepository.swift
      BookingRepository.swift
      PackageRepository.swift
    Local/KeychainManager.swift
  Domain/Model/User.swift, Booking.swift, Package.swift
  Presentation/
    Auth/AuthView.swift + AuthViewModel.swift
    Home/HomeFeedView.swift + HomeViewModel.swift
    Packages/PackagesView.swift
    Booking/BookingFlowView.swift + BookingViewModel.swift
    Tracking/TrackingView.swift + TrackingViewModel.swift
    Profile/ProfileView.swift
  Design/KineticNoirTheme.swift, Colors.swift, Typography.swift
GoogleService-Info.plist
```

### `apps/ios-partner/` — Swift + SwiftUI (Luminous Dark)
```
OrbitPartner.xcodeproj
OrbitPartner/
  App/OrbitPartnerApp.swift
  Network/
    APIClient.swift
    SocketManager.swift        — socket.io-client-swift
  Data/
    Repository/
      PartnerRepository.swift
      BookingRepository.swift
      EarningsRepository.swift
    Local/
      CoreDataManager.swift    — offline queue
      KeychainManager.swift
  Domain/Model/PartnerProfile.swift, Booking.swift, Transaction.swift
  Presentation/
    Auth/AuthView.swift + AuthViewModel.swift
    Home/AvailableGigsView.swift + HomeViewModel.swift
    Work/WorkDetailView.swift + WorkViewModel.swift
    Earnings/EarningsView.swift + EarningsViewModel.swift
    Profile/ProfileView.swift + ProfileViewModel.swift
  Design/LuminousDarkTheme.swift
GoogleService-Info.plist
```

---

## GitHub Actions CI/CD Workflows

### `android-client.yml`
```yaml
name: Android Client — Build & Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: zulu, java-version: '17' }
      - name: Static Analysis (detekt)
        working-directory: apps/android-client
        run: ./gradlew detekt
      - name: Android Lint
        working-directory: apps/android-client
        run: ./gradlew lint
      - name: Unit Tests
        working-directory: apps/android-client
        run: ./gradlew test
      - name: Build Debug APK
        working-directory: apps/android-client
        run: ./gradlew assembleDebug
      - name: Build Release APK
        working-directory: apps/android-client
        env:
          KEYSTORE_BASE64: ${{ secrets.KEYSTORE_BASE64 }}
          KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
          STORE_PASSWORD: ${{ secrets.STORE_PASSWORD }}
        run: ./gradlew assembleRelease
      - name: Build Release AAB
        working-directory: apps/android-client
        run: ./gradlew bundleRelease
      - uses: actions/upload-artifact@v4
        with:
          name: orbit-client-apk-debug
          path: apps/android-client/app/build/outputs/apk/debug/*.apk
      - uses: actions/upload-artifact@v4
        with:
          name: orbit-client-apk-release
          path: apps/android-client/app/build/outputs/apk/release/*.apk
      - uses: actions/upload-artifact@v4
        with:
          name: orbit-client-aab-release
          path: apps/android-client/app/build/outputs/bundle/release/*.aab
```

### `android-partner.yml`
*(Identical structure, targeting `apps/android-partner/`)*

### `backend-test.yml`
```yaml
name: Backend — Test, Lint & Security Scan

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - name: Install dependencies
        run: pip install -r backend/requirements.txt ruff mypy bandit pytest pytest-asyncio
      - name: Lint (ruff)
        run: ruff check backend/src/
      - name: Type check (mypy)
        run: mypy backend/src/ --ignore-missing-imports
      - name: Security scan (bandit)
        run: bandit -r backend/src/ -ll
      - name: Run tests
        run: pytest backend/tests/ -v
        env:
          FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          FIREBASE_CLIENT_EMAIL: ${{ secrets.FIREBASE_CLIENT_EMAIL }}
          FIREBASE_PRIVATE_KEY: ${{ secrets.FIREBASE_PRIVATE_KEY }}
```

### `ios-client.yml`
```yaml
name: iOS Client — Build & Test

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - name: SwiftLint
        run: swiftlint apps/ios-client/OrbitClient/
      - name: Build & Test
        working-directory: apps/ios-client
        run: |
          xcodebuild test \
            -project OrbitClient.xcodeproj \
            -scheme OrbitClient \
            -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest' \
            CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
```

### `release.yml`
```yaml
name: Create Release

on:
  push:
    tags: ['v*']

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate Release Notes
        uses: release-drafter/release-drafter@v6
        with: { config-name: release-drafter.yml }
        env: { GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} }
      - name: Download APK artifacts
        uses: actions/download-artifact@v4
      - name: Attach artifacts to release
        uses: softprops/action-gh-release@v2
        with:
          files: |
            orbit-client-apk-release/*.apk
            orbit-partner-apk-release/*.apk
            orbit-client-aab-release/*.aab
            orbit-partner-aab-release/*.aab
```

---

## Complete Booking Lifecycle (End-to-End)

```
CLIENT BOOKS (Android/iOS Client App)
   └─ POST /api/bookings  →  Status: PENDING
   └─ Backend auto-dispatches to online partners
   └─ Status: PARTNER_DISPATCHED

PARTNER RECEIVES GIG (Android/iOS Partner App)
   └─ Socket.IO: booking:dispatched → Gig card appears in AvailableGigsScreen
   └─ Partner sees: package, ₹700, location, date/time

PARTNER ACCEPTS (Partner App)
   └─ POST /api/bookings/{id}/accept
   └─ Cashfree bank verification (penny drop)
   └─ Status: EN_ROUTE
   └─ Socket.IO → client: booking:partner-assigned
   └─ Other partners: booking:accepted-by-other (remove gig card)

PARTNER SHOOTS (Partner App WorkDetailScreen)
   └─ Stage 0: Navigating → Stage 1: Arrived → Stage 2: Shooting checklist
   └─ 5 clips: Wide Pan, Tracking, Close-up, Tilt-shift, Outro

PARTNER SYNCS FOOTAGE (Partner App)
   └─ WorkManager uploads (resumable, retry on failure)
   └─ POST /api/bookings/{id}/sync-complete
   └─ Status: READY_TO_EDIT
   └─ Partner wallet: +₹700 (Transaction created)
   └─ Socket.IO: editor:booking-ready

EDITOR ACCEPTS (Editor Web App)
   └─ POST /api/editor/bookings/{id}
   └─ Status: EDITING
   └─ Socket.IO → client: booking:status-update (EDITING)

EDITOR DELIVERS (Editor Web App)
   └─ POST /api/editor/deliver
   └─ Status: DELIVERED + masterReelUrl set
   └─ Socket.IO → client: booking:status-update + reelUrl

CLIENT DOWNLOADS REEL (Client App TrackingScreen)
   └─ Presigned URL shown in TrackingScreen
   └─ Download button → saves to device

DASHBOARD UPDATED (Admin Web App)
   └─ Shows booking history with all status changes
   └─ Shows partner earnings (+₹700 credited)
   └─ Shows complete audit trail
```

---

## Risk-Reducing Implementation Order

> This order ensures there is always a working reference implementation available. Flutter apps are archived (not deleted) so the team can always reference or roll back.

### Phase 0 — Freeze & Archive (Day 1)
1. Archive Flutter apps: `mv client_app/ archive/flutter_client_old/`
2. Archive Flutter apps: `mv partner_app/ archive/flutter_partner_old/`
3. Restructure to `apps/` monorepo layout
4. Rename `dashboard-web-app/` → `dashboard/`, `editor-web-app/` → `editor/`
5. Add `backend/tests/` directory with placeholder tests
6. Verify Flutter archived apps still build (reference check)
7. Commit "Phase 0: Archive Flutter, establish monorepo structure"

### Phase 1 — Android Client App (Days 2-7)
1. Initialize `apps/android-client/` as Kotlin Gradle project
2. Add Hilt, Retrofit, OkHttp, Navigation Compose, Room, Firebase
3. Add socket.io-client-java dependency
4. Implement KineticNoirTheme (Material3 tokens)
5. AuthScreen + AuthViewModel + AuthRepository
6. HomeFeedScreen + HomeViewModel
7. PackagesScreen
8. BookingFlowScreen (3-step wizard)
9. TrackingScreen (WebSocket integration)
10. ProfileScreen
11. Integration test against existing backend
12. Commit "Phase 1: Android Client App complete"

### Phase 2 — Android Partner App (Days 8-14)
1. Initialize `apps/android-partner/` as Kotlin Gradle project
2. LuminousDarkTheme
3. AuthScreen
4. AvailableGigsScreen + Socket.IO integration (`booking:dispatched`)
5. WorkDetailScreen (4-stage flow + WorkManager uploads)
6. EarningsScreen + WithdrawFlow
7. ProfileScreen + Bank linking bottom sheet
8. Offline queue (Room + ConnectivityMonitor)
9. Integration test against existing backend
10. Commit "Phase 2: Android Partner App complete"

### Phase 3 — CI/CD Workflows (Day 15)
1. Replace `build-apk.yml` with 5 new workflow files
2. Add GitHub Secrets documentation to `docs/`
3. Verify all workflows pass on push
4. Commit "Phase 3: CI/CD complete"

### Phase 4 — iOS Client App (Days 16-20)
1. Initialize `apps/ios-client/` Xcode project
2. KineticNoirTheme (SwiftUI Color + Font extensions)
3. All screens (feature parity with Android)
4. socket.io-client-swift integration
5. Integration test against existing backend
6. Commit "Phase 4: iOS Client App complete"

### Phase 5 — iOS Partner App (Days 21-25)
1. Initialize `apps/ios-partner/` Xcode project
2. All screens + offline CoreData queue
3. Integration test
4. Commit "Phase 5: iOS Partner App complete"

### Phase 6 — Final Verification & Flutter Removal (Day 26+)
1. Full end-to-end test on both Android + iOS, both apps
2. Side-by-side comparison vs Flutter archived apps
3. Feature parity confirmed ✅
4. All CI workflows green ✅
5. Backend still unmodified ✅
6. **Only now**: `git rm -r archive/` — Flutter code finally removed
7. Commit "Phase 6: Migration complete, Flutter removed"

---

## Docs to Generate

```
docs/
  ARCHITECTURE.md    — System diagram + component overview
  API.md             — All FastAPI endpoints (auto-generated from OpenAPI)
  MIGRATION.md       — Flutter → Native migration notes
  RUNBOOK.md         — Deployment + on-call procedures
  OFFLINE.md         — Partner offline flow documentation
  UPLOAD.md          — Video upload chunking + retry documentation
README.md            — Project overview + quick start
```

---

## Summary Scorecard

| Area | Before | After |
|------|--------|-------|
| Platform | Flutter WebView | Native Kotlin + Swift |
| Backend risk | High (could be changed) | Zero (frozen policy) |
| Flutter removal | Immediate delete | Archived until parity |
| API structure | `/api/` flat | `/api/v1/` versioned |
| Background jobs | In-process APScheduler | Phase 2: Celery |
| Observability | None | Structured logs + Sentry |
| CI/CD | Flutter APK only | 5 workflows + security scan + release |
| Video uploads | Basic PUT | Resumable + WorkManager |
| Offline support | None | Room queue + auto-sync |
| Architecture | Flutter widgets → API | MVVM + Repository + UseCase |
| Monorepo | Flat | `apps/` structure |
