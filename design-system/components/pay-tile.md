---
id: pay-tile
name: Payment method tile
category: Booking
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.pay-tile, .pay-tile-group, .is-active]
source-css: assets/css/components.css
source-demo: index.html#/booking-widgets (design-system spec site)
related: [checkbox-radio, payment-result, hold-timer]
---

# Payment method tile

## Purpose
Card-styled single-select for choosing how a booking is paid — card, digital wallet, or pay at venue.

## Description
A `.pay-tile-group` is a wrapping flex row of equal-width `.pay-tile`s (`flex: 1; min-width: 140px`). Each tile stacks a 22px SVG icon, a bold `--text-sm` method name and a tertiary `--text-xs` description inside a 1.5px border. Exactly one tile carries `.is-active`, which fills it with `--color-primary-subtle` and turns the border and icon primary — a filled tint, not just a border change, so the selection reads at a glance.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Group | `.pay-tile-group` | Always wrap tiles in the group container |
| Tile | `.pay-tile` | One per payment method |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | 1.5px `--color-border`, secondary-colored icon |
| Hover | `:hover` | Border switches to `--color-primary` |
| Selected | `.is-active` | Primary border, `--color-primary-subtle` fill, primary icon |

## Properties
| Property | How |
|---|---|
| Anatomy | `svg` (22px) + `b` (method name) + `span` (supported networks / detail) |
| Sizing | Tiles flex equally with `min-width: 140px`; the group wraps on narrow widths |

## Responsive Behaviour
No media queries — `flex-wrap: wrap` on the group plus the 140px tile minimum makes tiles stack into rows on narrow viewports automatically.

## Accessibility
- Implement as a radio group (`role="radiogroup"` on the group, `role="radio"` + `aria-checked` per tile) even though it is styled as cards — per the spec-site demo notes.
- Tiles must be keyboard-focusable; selection may not be hover/click-only.
- The selected state pairs fill + border + icon color; still expose it programmatically via `aria-checked`.

## Dependencies
Tokens: primary, border, radius, `--duration-fast`. Icons from the 18/22px stroke set (`RD.icon`). No JS helper — selection is an `.is-active` class toggle.

## Related Components
- [checkbox-radio.md](checkbox-radio.md) — plain radios; use tiles when each option deserves an icon and description.
- [payment-result.md](payment-result.md) — the outcome screen after the chosen method is charged.
- [hold-timer.md](hold-timer.md) — usually visible above the payment step while the slot is held.

## Usage Examples
- Checkout payment step (spec site Booking Widgets): "Card — Visa, Mastercard, Mada" active, "Digital wallet — Apple Pay, STC Pay" and "Pay at venue — Cash or card on arrival" idle.
- Default the active tile to the guest's last-used method; hide "Pay at venue" for activities requiring prepayment.

## Do
- Keep descriptions to the supported networks or the arrival condition — one short line.
- Preselect the most likely method so checkout is one tap shorter.

## Don't
- Don't use pay-tiles for anything other than payment-method choice; generic option cards are `.chip--select` or `.check` territory.
- Don't allow zero-selection states at the payment step — one tile is always `.is-active`.

## HTML Reference
```html
<div class="pay-tile-group" role="radiogroup" aria-label="Payment method">
  <div class="pay-tile is-active" role="radio" aria-checked="true" tabindex="0">
    <!-- RD.icon("card") -->
    <b>Card</b><span>Visa, Mastercard, Mada</span>
  </div>
  <div class="pay-tile" role="radio" aria-checked="false" tabindex="-1">
    <!-- RD.icon("wallet") -->
    <b>Digital wallet</b><span>Apple Pay, STC Pay</span>
  </div>
  <div class="pay-tile" role="radio" aria-checked="false" tabindex="-1">
    <!-- RD.icon("hotel") -->
    <b>Pay at venue</b><span>Cash or card on arrival</span>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `BOOKING WIDGETS - party stepper, seat map, payment, hold timer, e-ticket` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
