---
id: seat-map
name: Seat / resource map
category: Booking
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.seatmap, .seatmap__row, .seatmap__seat, .is-selected, .is-booked, .seatmap__legend]
source-css: assets/css/components.css
source-demo: index.html#/booking-widgets (design-system spec site)
related: [time-slots, quantity-stepper]
---

# Seat / resource map

## Purpose
Grid picker for choosing specific seats, lanes or positions when the booking is tied to a physical spot rather than just a time.

## Description
`.seatmap` is an inline grid of `.seatmap__row` flex rows, each holding 28×28px `.seatmap__seat` cells labeled with a row letter + number ("A1", "C4"). Free seats are bordered and clickable, selected seats fill with `--color-primary`, and already-booked seats go sunken with a dashed border and `cursor: not-allowed`. A `.seatmap__legend` of `.sw` swatches decodes the three appearances.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.seatmap` | Any seat/lane/position layout — rows and cells compose the shape |

## States
| State | Trigger | Appearance |
|---|---|---|
| Available | — | 1px `--color-border`, tertiary label |
| Hover | `:hover` | Border and label switch to `--color-primary` |
| Selected | `.is-selected` | Solid `--color-primary`, white label |
| Booked | `.is-booked` | `--color-surface-sunken` fill, dashed border, `opacity: 0.6`, `cursor: not-allowed` |

## Properties
| Property | How |
|---|---|
| Layout | One `.seatmap__row` per physical row; 6px gaps both axes |
| Labels | Cell text is the seat code (row letter + column number) |
| Legend | `.seatmap__legend` with `.sw` swatches for Available / Selected / Booked |
| Multi-select | Multiple cells may carry `.is-selected` (e.g. two adjacent seats) |

## Responsive Behaviour
No media queries — the grid is `inline-grid` at fixed 28px cells; wrap it in a horizontally scrollable container if a layout exceeds the viewport.

## Accessibility
- Render seats as focusable controls with names like "Seat B3, available"; booked seats keep `aria-disabled` rather than disappearing.
- The booked state is not color-only (dashed border + reduced opacity), but pair it with text in the accessible name.
- Keep the legend adjacent to the grid — it is the only key to the encoding.

## Dependencies
Tokens: primary, border, surface-sunken, `--radius-sm`, `--duration-fast`. No JS helper — selection is a class toggle. Often paired with a summary `.card` listing the chosen seats and price.

## Related Components
- [time-slots.md](time-slots.md) — pick the time first; the seat map narrows *where* within it.
- [quantity-stepper.md](quantity-stepper.md) — for capacity-only activities where specific positions don't matter.

## Usage Examples
- Spec-site Booking Widgets: a 4×6 map (rows A–D) with seats C3+C4 selected, the first seat of some rows booked, beside a selection-summary card.
- Lane or court pickers where the venue sells positions, not just capacity.

## Do
- Keep booked seats visible so guests understand the real layout.
- Mirror the venue's physical arrangement — rows in `.seatmap__row` order.

## Don't
- Don't use the seat map when any-seat capacity is being sold — use the quantity stepper instead.
- Don't add new seat states; available, selected and booked are the complete model.

## HTML Reference
```html
<div class="seatmap">
  <div class="seatmap__row">
    <span class="seatmap__seat is-booked">A1</span>
    <span class="seatmap__seat">A2</span>
    <span class="seatmap__seat">A3</span>
  </div>
  <div class="seatmap__row">
    <span class="seatmap__seat">B1</span>
    <span class="seatmap__seat is-selected">B2</span>
    <span class="seatmap__seat is-selected">B3</span>
  </div>
  <div class="seatmap__legend">
    <span><span class="sw" style="background:var(--color-surface)"></span> Available</span>
    <span><span class="sw" style="background:var(--color-primary);border-color:var(--color-primary)"></span> Selected</span>
    <span><span class="sw" style="background:var(--color-surface-sunken);border-style:dashed"></span> Booked</span>
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
