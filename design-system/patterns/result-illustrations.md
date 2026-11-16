# Pattern — Result Illustrations

**Status:** approved · v1.0 (2026-08-04)
Source: client identity handoff, `base_id/HighFive_Status_Icons_SVG/` (9 files). Optimized
copies (480×480 PNG, ~20–40KB each) live in `assets/img/status/`.

## What this is — and isn't

A set of 9 full-canvas illustrations (circle backdrop + monoline icon + sparkle/plus/ring
accents, tinted per outcome) for a **dedicated confirmation/result screen or modal** — the
moment right after an action completes (or fails), before the user moves on.

**This is not the [empty-state](../components/empty-state.md) composite.** That component's
own rule is explicit: *"Don't add illustrations... icon + two lines + one button is the
pattern."* Empty state answers "there's nothing here yet, here's a table row instead of
content"; a result illustration answers "here's what just happened," full-screen or in a
modal, after a real user action. Don't retrofit these into a table's empty-state cell —
build a result screen/modal instead, using the reference layout below.

## The 9 illustrations

| File | Color | Use when |
|---|---|---|
| `01_success_check.png` | Green (`--brand-ufo-green` family) | A generic action completed successfully |
| `02_payment_success.png` | Green | A payment/charge completed |
| `03_complaint_submitted.png` | Green | A complaint/support ticket was submitted |
| `04_booking_cancelled.png` | Navy/dark | A booking was cancelled (neutral, not an error — no red) |
| `05_refund_requested.png` | Green | A refund request was submitted (not yet completed — request only) |
| `06_review_submitted.png` | Green | A review/rating was submitted |
| `07_no_results.png` | Navy/dark | A dedicated full-page "nothing matches" moment (e.g. a search landing page) — NOT a table's inline empty-state cell |
| `08_no_bookings.png` | Navy/dark | A dedicated full-page "nothing yet" moment — same caveat as above |
| `09_general_error.png` | Red (`--color-danger` family) | A full-page/modal failure state (not a form-field error — use [form-validation](form-validation.md) for that) |

## Where these actually apply in this repo

This repo's product surface is the **partner web dashboard**; several of these names
(`payment_success`, `review_submitted`, `complaint_submitted`) describe end-customer moments
that live in the customer-facing mobile app, not the partner dashboard. Do not invent a
partner-dashboard screen just to place an icon — per this repo's closed-world rule (no
inventing business flows the real product doesn't have), only use one of these when a real,
already-scoped feature genuinely calls for a full-screen result/confirmation moment. Until
then, treat this file as a **cataloged, ready-to-use asset set**, not a mandate to retrofit
every screen.

## Reference layout (when a real screen calls for one)

```html
<div class="stack gap-3" style="text-align:center;align-items:center;max-width:360px;margin-inline:auto">
  <img src="assets/img/status/02_payment_success.png" width="180" height="180" alt="">
  <div><b class="t-h4">Payment successful</b><p class="t-sm text-tertiary" style="margin-top:4px">Your receipt has been emailed to you.</p></div>
  <button class="btn btn--sm">Done</button>
</div>
```
`alt=""` — the illustration is decorative; the real message is the heading/body text next to
it, same accessibility rule as empty-state's icon circle.

## Do
- Keep exactly one action below the illustration + copy, same discipline as empty-state.
- Pick the file whose *outcome* matches, not the one that merely looks closest — `04` (navy,
  neutral) is for cancellations, never `09` (red) — a cancellation isn't an error.

## Don't
- Don't drop these into the inline empty-state composite (`empty-state.md` forbids
  illustrations there).
- Don't recolor the PNGs per-theme — they're pre-rendered raster art, not tokens; if dark-mode
  contrast becomes a problem, add a `background` behind them rather than editing the asset.
- Don't invent a partner-dashboard flow just to use one — see above.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-08-04 | Initial registry entry — assets imported from the client identity handoff |
