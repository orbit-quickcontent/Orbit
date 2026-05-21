# Task 3-b: Fix Package Card Sizing Inconsistency

## Work Log

### package-dashboard.tsx
- Added `h-full` class to the `motion.div` wrapper around each Card
- This ensures the wrapper stretches to fill the grid cell, allowing the Card inside (which already has `h-full flex flex-col`) to match the height of the taller sibling
- Existing correct classes confirmed: Card has `h-full flex flex-col`, CardContent has `flex-1`, CardFooter has `mt-auto`
- Grid uses `items-stretch` by default, so both grid cells will be equal height

### dashboard-home.tsx
- Added `h-full` to the `motion.div` with `shrink-0` so it stretches to the flex container's cross-axis height
- Added `h-full` to the `button` element so it fills the motion.div, allowing the inner card div's `h-full` to work properly
- Existing correct classes confirmed: inner card div has `h-full flex flex-col`, features section has `flex-1`, "Book Now" row has `mt-auto`
- The flex container uses `items-stretch` by default, ensuring all cards match the tallest one

### Verification
- `bun run lint` passes with no errors

## Summary
The root cause of the height inconsistency was that the `motion.div` wrapper (and in dashboard-home, the `button` wrapper) did not have `h-full`, so even though the inner elements had flex layout classes, they couldn't resolve `h-full` because their parents didn't have a definite height. Adding `h-full` to each wrapper in the chain ensures the height propagates from the grid/flex container all the way down to the card content.
