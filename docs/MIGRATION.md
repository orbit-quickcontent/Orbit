# Flutter to Native Migration Documentation

This guide describes how the Orbit mobile applications were migrated from Flutter to fully native Android and iOS frameworks.

---

## Archival Reference Guidelines

To mitigate project risks during implementation, the old Flutter repositories were moved to the `archive/` directory:
- `client_app` → `archive/flutter_client_old/`
- `partner_app` → `archive/flutter_partner_old/`

*The archived repositories serve as baseline code blocks to check and compare layout features.*
*Once the native Kotlin and SwiftUI platforms undergo full parity validations, the archived assets can be deleted.*

---

## Framework Transitions

| Segment | Flutter Setup (Old) | Native Android (New) | Native iOS (New) |
|---|---|---|---|
| **Language** | Dart | Kotlin | Swift |
| **Views / UI** | Flutter Widgets | Jetpack Compose (M3) | SwiftUI |
| **State logic** | flutter_riverpod | MVVM (StateFlow/Flow) | MVVM (ObservableObject) |
| **Http layer** | Dio | Retrofit / OkHttp | URLSession |
| **WebSockets** | web_socket_channel | custom Socket.IO (OkHttp) | socket.io-client-swift |
| **Storage** | shared_preferences | EncryptedSharedPreferences | Keychain / UserDefaults |
| **Offline Sync** | None | Room + WorkManager | CoreData |

---

## Design System Translations

### 1. Client App (Kinetic Noir)
- **Colors**: Anchored in absolute black `#000000`. Primary highlights use Neon Blue `#47D6FF` and Electric Purple `#EDB1FF` in linear gradients.
- **Typography**: Headers are rendered in Montserrat, body copy in Plus Jakarta Sans, and labels/metadata in Space Grotesk.

### 2. Partner App (Luminous Dark)
- **Colors**: Pure black background `#000000` with high-contrast White CTA buttons for accepts and Neon Green `#4BE277` for active presence/earnings tags.
- **Typography**: Standardizes on Plus Jakarta Sans for general use, and Geist for status chips and specs.
