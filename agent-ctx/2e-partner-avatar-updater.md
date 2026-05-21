# Task 2e - Partner Avatar Updater

## Summary
Updated 3 partner component files to render avatars correctly based on `avatarType` field from UserProfile.

## Files Modified
1. `src/components/partner/partner-navbar.tsx` - Added `renderAvatar()` helper, replaced inline gradient+initials JSX
2. `src/components/partner/partner-bottom-nav.tsx` - Added `renderNavAvatar()` helper, replaced inline gradient+initials JSX
3. `src/components/partner/partner-profile-view.tsx` - Added `renderProfileAvatar()` helper, replaced inline gradient+initials JSX

## Pattern Used
Each render helper follows the same branching logic:
- `avatarType === "photo"` + `avatarPhotoUrl` → `<img>` in rounded-full overflow-hidden div
- `avatarType === "emoji"` + `avatarEmoji` → emoji character in backdrop-blur gradient div
- Default → gradient circle with initials (original behavior, backward compatible)

## Size Parameters
- Navbar: `renderAvatar("w-11 h-11 sm:w-12 sm:h-12", "text-sm sm:text-base")`
- Bottom nav: `renderNavAvatar("w-7 h-7 sm:w-8 sm:h-8", "text-[9px] sm:text-[10px]")`
- Profile: `renderProfileAvatar("w-24 h-24 sm:w-28 sm:h-28", "text-3xl sm:text-4xl")`

## Verification
- ESLint passes with no errors
- Pattern matches existing client-navbar.tsx implementation
