# Orbit Client Mobile Application

This directory contains the **Orbit Client Mobile Application**, a lightweight Flutter web wrapper that acts as the mobile entry point for clients of the Orbit QuickContent marketplace.

## 📱 Platform Overview

The app is built as a hybrid container:
* **Flutter Wrapper**: Manages local settings, customized server URLs (via `SharedPreferences`), native network checks, connection fallbacks, and external URL dispatching using standard device handlers.
* **Next.js Client Webview**: Renders the complete, dynamic cinematic interface served by the connected backend.

---

## 🛠️ Tech Stack & Dependencies

* **Framework**: Flutter SDK (compatible with SDK version `^3.11.5`)
* **Key Packages**:
  * `webview_flutter` (`^4.13.1`): Embeds the client interface.
  * `shared_preferences` (`^2.5.5`): Persists custom server URL configurations.
  * `url_launcher` (`^6.3.0`): Routes phone calls, map coordinate lookups, and third-party pages outside the app.

---

## ⚙️ Core Configuration & Settings

Inside the app, you can configure your connection settings:
1. Tap the **Settings** floating action button at the bottom-right corner.
2. Enter your custom server URL (e.g. for testing: `http://10.0.2.2:3000/?role=USER` on Android emulators or your local computer LAN IP).
3. The app automatically appends the `role=USER` query parameter to secure correct client routing when launching.
4. Saved configurations persist across application relaunches.

---

## 🚀 Getting Started

To launch the client application locally:

### 1. Start the Connected Backend
Ensure the backend server is running in the root workspace:
```bash
npm run dev:backend
```

### 2. Launch the Flutter App
Ensure you have a connected device or active emulator:
```bash
# Get dependencies
flutter pub get

# Launch the app
flutter run
```

---

*For details on database structures, styling tokens, and frontend component maps, see the main [CLIENT_APP_OVERVIEW.md](file:///c:
<truncated 100 bytes>