# Task 2a — Avatar Types Update

## Summary
Added avatar type discrimination fields to the Orbit project to support color, emoji, and photo avatar rendering modes.

## Changes Made

### 1. `src/lib/types.ts`
Added three new fields to the `UserProfile` interface:
- `avatarType: "color" | "emoji" | "photo"` — determines how the avatar is rendered
- `avatarEmoji: string | null` — stores the selected emoji character
- `avatarPhotoUrl: string | null` — stores base64 data URL of uploaded photo

### 2. `src/lib/constants.ts`
Added new export:
- `AVATAR_EMOJIS` — `as const` array of 16 human-like avatar emojis

### 3. `src/lib/store.ts`
Updated `defaultUser` object with new fields:
- `avatarType: "color"`
- `avatarEmoji: null`
- `avatarPhotoUrl: null`

## Verification
- ESLint passes with no errors
- All files compile correctly
