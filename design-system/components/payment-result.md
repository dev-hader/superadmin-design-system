---
id: payment-result
name: Payment result
category: Feedback
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.payresult, .payresult__icon]
source-css: components.html (inline <style>)
source-demo: components.html
related: [toast, alert, progress-indicators, pay-tile]
---

# Payment result

## Purpose
The full-card outcome screen at the end of a checkout: the charge succeeded, is still processing, or failed.

## Description
A composite card defined in the inline `<style>` of `components.html` (not in `components.css`): `.payresult` is a centered, bordered, `--radius-lg` panel (min-width 220px, `--space-6` padding) with a 52px circular `.payresult__icon` on a surface background, a `t-title` headline, one secondary detail line, and a centered action row. The three states are composed by tinting border/background with the semantic status tokens (`success`, `warning` for processing, `danger`) — **processing is a real third state**, not just success-or-fail, and it swaps the buttons for a `.spinner`.

## Variants
| State | Composition | Content |
|---|---|---|
| Successful | `--color-success-border` border, `--color-success-subtle` bg, success icon | Amount + method line; **View receipt** (secondary) + **Done** (primary) |
| Processing | `--color-warning-border` / `--color-warning-subtle`, warning icon | "Your bank is confirming the charge…" + centered `.spinner`, no buttons |
| Failed | `--color-danger-border` / `--color-danger-subtle`, danger icon | "Your card was declined. No charge was made." + **Use a different method** (ghost) / **Try again** (danger) |

## States
| State | Trigger | Appearance |
|---|---|---|
| Static per outcome | rendered by the checkout flow | One of the three tinted compositions above |

## Properties
| Property | How |
|---|---|
| Icon | `.payresult__icon` — 52px `--radius-full` circle, 26px SVG, `--color-surface` fill, tone-colored icon |
| Headline | `b.t-title` (block) |
| Detail | `p.t-sm.text-secondary` — state the amount/method or the exact consequence |
| Actions | Centered `.row.gap-2` of `.btn--sm` buttons (or a `.spinner` while processing) |

## Responsive Behaviour
`flex: 1; min-width: 220px` — cards sit side by side in wide demos and stack on narrow screens via the flex-wrap container.

## Accessibility
- The outcome is stated in the headline text; the tint and icon reinforce it.
- Failed state says the consequence explicitly ("No charge was made") — never leave doubt about whether money moved.
- Processing needs a live announcement in product code (`role="status"`) since the spinner alone is silent; it must resolve to success or failed.

## Dependencies
Composite styles: inline `<style>` in `components.html` (`.payresult`, `.payresult__icon`). Core pieces: `.btn`, `.spinner`, `.row`, type utilities, semantic status tokens from `tokens.css`.

## Related Components
- [toast.md](toast.md) — pair a toast for quieter confirmations once the guest is already past checkout; this full card is for the checkout flow itself.
- [alert.md](alert.md) — a persistent banner for payment issues *outside* the checkout moment.
- [progress-indicators.md](progress-indicators.md) — the processing state embeds `.spinner`.
- [pay-tile.md](pay-tile.md) — payment-method selection earlier in the same flow.

## Usage Examples
- "Payment successful — SAR 220.00 charged to Visa ···· 4821" with View receipt / Done.
- "Payment processing — Your bank is confirming the charge - this can take up to a minute." with spinner.
- "Payment failed — Your card was declined. No charge was made." with recovery actions.

## Do
- Treat processing as a real third state with its own screen — poll and resolve it.
- Give the failed state two ways forward: retry, or switch method.
- State amount and payment method on success so the receipt is verifiable at a glance.

## Don't
- Don't collapse processing into a success screen "optimistically".
- Don't use this card outside checkout — post-checkout confirmations are toasts.
- Don't add extra actions to the processing state; the user waits or nothing.

## HTML Reference
```html
<div class="payresult" style="border-color:var(--color-success-border);background:var(--color-success-subtle)">
  <span class="payresult__icon" style="background:var(--color-surface);color:var(--color-success)"><!-- RD.icon("check") --></span>
  <b class="t-title" style="display:block">Payment successful</b>
  <p class="t-sm text-secondary" style="margin:6px 0 var(--space-4)">SAR 220.00 charged to Visa ···· 4821</p>
  <div class="row gap-2" style="justify-content:center">
    <button class="btn btn--secondary btn--sm">View receipt</button>
    <button class="btn btn--sm">Done</button>
  </div>
</div>

<div class="payresult" style="border-color:var(--color-warning-border);background:var(--color-warning-subtle)">
  <span class="payresult__icon" style="background:var(--color-surface);color:var(--color-warning)"><!-- RD.icon("info") --></span>
  <b class="t-title" style="display:block">Payment processing</b>
  <p class="t-sm text-secondary" style="margin:6px 0 var(--space-4)">Your bank is confirming the charge - this can take up to a minute.</p>
  <div class="row gap-2" style="justify-content:center"><span class="spinner" style="margin:0 auto"></span></div>
</div>
```

## CSS Reference
Composite: inline `<style>` block in `components.html` (`.payresult` rules). Buttons/spinner/status tokens: `assets/css/components.css` and `assets/css/tokens.css`.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
