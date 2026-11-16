---
id: quantity-stepper
name: Quantity Stepper
category: Forms
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.qty-stepper]
source-css: assets/css/components.css
source-demo: components.html
related: [input, time-slots, plan-card]
---

# Quantity Stepper

## Purpose
Increment/decrement control for small bounded numbers — guest/party size, court or lane quantity, session-duration steps.

## Description
An inline bordered pill (`--radius-md`, 4×6px padding) containing a minus button, a bold value, and a plus button. Buttons are 28×28px hover-highlighted squares; the value `<b>` has `min-width: 22px` and centered text so the layout never shifts as the number changes. Disabling a button at the range edge fades it to 0.4 opacity with a `not-allowed` cursor. Value changes are page JS; the CSS is presentation only.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.qty-stepper` > `button` + `b` + `button` | The only variant |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | `--color-border` outline, secondary-color buttons |
| Button hover | `button:hover:not(:disabled)` | `--color-surface-hover` bg, text darkens |
| At floor / capacity | `disabled` on minus / plus | 0.4 opacity, `not-allowed` cursor |

## Properties
| Property | How |
|---|---|
| Value | Text of the `<b>` element (JS-updated) |
| Bounds | Toggle `disabled` on the minus at the floor and the plus at capacity |
| Button glyphs | Text `−` / `+` or a 14px SVG icon |

## Responsive Behaviour
No intrinsic breakpoint changes. `inline-flex`, so it sits inside booking cards and rows at any width; 28px targets remain tappable on mobile.

## Accessibility
- Each button needs an `aria-label` describing the field it controls, not just "+"/"−" — the demos use `aria-label="Decrease guests"` / `aria-label="Increase guests"`.
- Use real `<button>` elements so Enter/Space work.
- Disable, don't hide, the button at a bound — this is how the limit is communicated.
- Consider `aria-live="polite"` on the value so screen readers hear changes, and announce the unit ("2 guests") somewhere adjacent.

## Dependencies
Tokens: color (border/surface-hover/text-secondary/text), radius (md/sm), space-3, weight-semibold. Requires page JS to change the value and manage `disabled`.

## Related Components
- [input.md](input.md) — a plain numeric `.input` when the range is wide or typed entry is faster.
- [time-slots.md](time-slots.md) — sits alongside slot picking in the booking flow.
- [plan-card.md](plan-card.md) — quantity selection near plan/bundle purchase.

## Usage Examples
- Guest / party-size stepper in the Booking Widgets set (value 2, both buttons live).
- Floor case in the same demo: value 1 with the minus disabled.
- Class-pass booking template reuses the identical stepper — nothing venue-specific is a one-off component.

## Do
- Disable the minus at the floor and the plus at capacity.
- Keep the value width fixed (the `<b>` provides this) so adjacent layout never jumps.
- Label buttons with what they change: "Increase guests", "Decrease duration".

## Don't
- Don't use it for large or unbounded numbers — typing beats twenty taps.
- Don't remove the `<b>` wrapper; it carries the min-width that stabilizes the layout.
- Don't stack multiple steppers without visible field labels for each.

## HTML Reference
```html
<div class="qty-stepper">
  <button aria-label="Decrease guests">−</button>
  <b>2</b>
  <button aria-label="Increase guests">+</button>
</div>

<!-- At the floor: minus disabled -->
<div class="qty-stepper">
  <button aria-label="Decrease guests" disabled>−</button>
  <b>1</b>
  <button aria-label="Increase guests">+</button>
</div>
```

## CSS Reference
`assets/css/components.css` → `BOOKING WIDGETS - party stepper, seat map, payment, hold timer, e-ticket` section (`.qty-stepper` rules at the top).

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
