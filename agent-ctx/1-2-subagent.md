# Task 1-2: Map Navigation Dashboard + Cloud Upload Per Shot

## Agent: Subagent
## Status: Completed

## Changes Made to `/home/z/my-project/src/components/partner-app.tsx`

### Task 1: Map Navigation Dashboard

**New Phase Added**: `navigating` (between `available` and `shooting`)

- **Phase type** updated: `"available" | "navigating" | "shooting" | "syncing" | "privacy" | "payment"`
- **`handleAcceptBooking`** now sets `partnerPhase` to `"navigating"` instead of `"shooting"`
- **SVG Map Dashboard** features:
  - Space Navy (#081C43) background with grid pattern overlays
  - Simulated road/block shapes for visual context
  - Animated route line: gradient cyan→purple dashed path with `pathLength` animation + continuous dash offset
  - Partner location: animated pulse dot (cyan) with glow filter + "You" label
  - Destination: animated pulse dot (purple) with glow filter + "Destination" label + 📍 pin
  - Overlay badges: "Live Tracking" (cyan pulse) and "Optimized Route" (purple)
- **Info cards**: Distance (8.4 km), ETA (22 min), Location, Time Slot in responsive grid
- **Buttons**: "Navigate" (gradient, toast feedback) + "Arrived at Location" (green, transitions to `shooting` phase)
- Description text updated to include navigating phase

### Task 2: Cloud Upload Per Shot

**New State Variables**:
- `shotUploads`: `Map<string, string>` — maps shotId → uploaded filename
- `uploadingShotId`: `string | null` — tracks which shot initiated file selection
- `fileInputRef`: `useRef<HTMLInputElement>` — hidden file input element

**New Functions**:
- `handleFileUpload(shotId)`: sets uploadingShotId and triggers file input click
- `handleFileSelected(e)`: reads selected file, updates shotUploads map, shows toast

**UI Section**: "Upload Footage Per Shot"
- Section header with CloudUpload icon and progress badge (X/5 uploaded)
- Per shot: name, uploaded filename with green checkmark OR "No file uploaded" text
- Per shot: Upload button (CloudUpload icon) or green CheckCircle2 when uploaded
- Green border styling for uploaded shots
- Progress bar at bottom when at least 1 file uploaded
- Badge turns green when all 5 shots uploaded

### New Imports Added
- `CloudUpload` from lucide-react
- `Navigation2` from lucide-react  
- `Route` from lucide-react

### Flow
`available` → `navigating` → `shooting` → `syncing` → `privacy` → `payment`

### Verification
- `bun run lint` passes with 0 errors
- File size: 495 lines → 710 lines
