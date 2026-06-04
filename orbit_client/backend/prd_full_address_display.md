# Product Requirements Document (PRD)

## 1. Overview
The **Full Address Display** feature enhances the booking flow for clients by ensuring that long, reverse‑geocoded shoot locations are displayed in their entirety. This resolves truncation issues that previously caused addresses to be cut off, improving clarity and user confidence when confirming bookings.

## 2. Goals & Success Metrics
- **Goal**: Provide a clear, multi‑line view of the full address in both the *Schedule & Location* step and the *Review Order* step.
- **Success Metrics**
  - ≥ 95 % of users report that the address is fully visible (post‑deployment survey).
  - Reduce support tickets related to “address cut‑off” by 80 % within 2 weeks.
  - No regressions in visual design or layout (zero UI test failures).

## 3. User Stories
| ID | As a… | I want to… | So that… |
|----|-------|------------|----------|
| US‑001 | Client | see the complete shoot location after selecting it or using live‑location | I can verify the address before proceeding |
| US‑002 | Client | edit the location without the field collapsing or scrolling horizontally | I can comfortably adjust the address if needed |
| US‑003 | Partner | view the full address on the tracking screen when a booking is assigned | I can navigate accurately to the shoot location |

## 4. Functional Requirements
1. **Location Input**
   - Replace the `<Input />` component with a `<Textarea />` that auto‑grows (`field-sizing-content`).
   - Preserve the map pin icon and live‑location button, anchored to the top‑left/right of the textarea.
   - Ensure the textarea respects the design system (glassmorphism background, border, focus styles).
2. **Review Order Summary**
   - Remove the `max-w-[200px] truncate` style for the location row.
   - Apply `break-words` with responsive max‑width (`max-w-[280px] sm:max-w-[360px]`).
   - Preserve alignment with other rows.
3. **Data Flow**
   - The `bookingLocation` state continues to store the full address string.
   - No changes to API contracts; the same string is sent to the backend.
4. **Accessibility**
   - The textarea must have an associated `<label>` and proper `aria‑label` if needed.
   - Keyboard navigation must work (focus, scroll into view).

## 5. Non‑Functional Requirements
- **Performance**: No perceptible latency when switching focus or scrolling. The textarea should render instantly.
- **Responsiveness**: The UI must adapt to mobile (textarea expands vertically, icons stay appropriately positioned).
- **Design Consistency**: Follow existing Orbit design tokens (colors, glassmorphism, shadows).
- **Cross‑Browser**: Tested on Chrome, Edge, Safari (desktop) and Chrome on Android.

## 6. UI/UX Details
- **Step 2 – Schedule & Location**
  - Component: `src/client/frontend/booking-flow.tsx` line ~366.
  - Layout: `<div className="relative">` containing `<MapPin>`, `<Textarea>`, and `<button>` for live location.
  - Styles: `pl-10 pr-10 min-h-[44px] py-2.5 bg-white/5 border-orbit-border focus:border-orbit-cyan/50 resize-none overflow-hidden`.
- **Step 3 – Review Order**
  - Component: same file, lines ~410‑422.
  - Layout: `<div className="flex justify-between items-start gap-4">` with label and value.
  - Styles for location value: ``font-medium text-right ${row.label === "Location" ? "break-words max-w-[280px] sm:max-w-[360px]" : "max-w-[200px] truncate"}``.

## 7. Acceptance Criteria
- ✅ The address input expands automatically as the user types or when auto‑filled via live location.
- ✅ The full address appears without truncation on the Review Order summary.
- ✅ Visual regression tests pass (no layout shift, icons remain correctly positioned).
- ✅ Manual QA confirms that the address is fully visible on screens of width 320 px up to 1920 px.
- ✅ No new linting or TypeScript errors.

## 8. Dependencies
- `src/components/ui/textarea.tsx` (already exists, no changes needed).
- Existing `useAppStore` state for `bookingLocation`.
- No new external libraries.

## 9. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Overflow on very long addresses could push other UI elements off‑screen on mobile. | Medium | Use `max-w-[360px]` and `break-words` to wrap, test on smallest viewport. |
| Changing `<Input>` to `<Textarea>` might affect form submit handling. | Low | Ensure the same `onChange` handler is attached; run form validation tests. |
| Styling inconsistencies with existing design system. | Low | Apply existing CSS utility classes; conduct visual QA with design team. |

## 10. Timeline
- **Day 1** – Finalize UI mock‑up and confirm design token usage.
- **Day 2** – Implement code changes (textarea, summary styles).
- **Day 3** – Run TypeScript compile, lint, and unit/integration tests.
- **Day 4** – Conduct QA across devices and browsers.
- **Day 5** – Merge to `main` and deploy to staging.
- **Day 6‑7** – Feature flag rollout and monitor metrics.

---
**Related Files**
- [Booking Flow Component](file:///c:/Users/utkar/OneDrive/Desktop/Orbitnew/src/client/frontend/booking-flow.tsx)
- [Textarea Component](file:///c:/Users/utkar/OneDrive/Desktop/Orbitnew/src/components/ui/textarea.tsx)

*Prepared by Antigravity – 2026‑06‑03*
