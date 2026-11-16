---
id: time-slots
name: Time-slot picker
category: Booking
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.slot, .is-selected, .is-disabled]
source-css: assets/css/components.css
source-demo: index.html#/pickers (design-system spec site)
related: [calendar, scheduler, hold-timer]
---

# Time-slot picker

## Purpose
Chip-style buttons for choosing a start time on a chosen date — the core picking interaction of the booking flow.

## Description
A `.slot` is a small bordered chip (`8px 14px` padding, `--radius-sm`, caption-size medium text) rendered as a `<button>`. Slots are laid out in a wrapping row (the demo uses `.row.wrap.gap-2` inside a `.card.card--pad`); exactly one slot carries `.is-selected` at a time, and already-booked times stay visible as `.is-disabled` rather than being removed.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.slot` | Every time chip — no visual variants exist |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | `--color-surface` fill, `--color-border-strong` border |
| Hover | `:hover` | Border and text switch to `--color-primary` |
| Selected | `.is-selected` | Solid `--color-primary` fill and border, white text |
| Disabled (booked) | `.is-disabled` | `opacity: 0.4`, `line-through`, `pointer-events: none` |

## Properties
| Property | How |
|---|---|
| Layout | Parent controls wrapping (e.g. `.row.wrap.gap-2`); slots size to their label |
| Selection | Toggle `.is-selected` on exactly one slot |

## Responsive Behaviour
No media queries — chips wrap naturally on the 8-pt grid, so narrow viewports simply produce more rows.

## Accessibility
- Render slots as real `<button>` elements grouped as a radiogroup (per the spec-site demo notes).
- Disabled slots keep `aria-disabled` and remain readable by screen readers — they are struck through, not hidden, because hiding booked times causes double-booking calls.
- Selection must not rely on color alone; the solid fill plus `aria-checked` covers it.

## Dependencies
Tokens: surface/border/primary groups, `--radius-sm`, `--duration-fast`. No JS helper — selection is a class toggle. Typically composed inside a `.card.card--pad` with a `.badge--success` open-slot counter.

## Related Components
- [calendar.md](calendar.md) — the preceding step; picks the date the slots belong to.
- [scheduler.md](scheduler.md) — staff-side grid view of the same inventory.
- [hold-timer.md](hold-timer.md) — start a hold countdown the moment a slot is selected.

## Usage Examples
- "Padel — Court A · Jul 9" picker on the spec site: 10 chips from 4:00 PM to 8:30 PM, 6:00 PM selected, 5:00/5:30/7:30 PM struck through, with a "6 slots open" badge and a Continue button.

## Do
- Keep booked slots visible as `.is-disabled` so guests see *why* a time is unavailable.
- Pair the picker with a summary line ("6:00 PM – 7:30 PM · 90 min") before the Continue action.

## Don't
- Don't allow multi-select — one `.is-selected` slot per picker.
- Don't invent new slot colors for other meanings; only selected and disabled exist.

## HTML Reference
```html
<div class="card card--pad" style="max-width:520px">
  <div class="row between">
    <b class="t-sm">Padel - Court A · Jul 9</b>
    <span class="badge badge--success"><span class="dot"></span>6 slots open</span>
  </div>
  <div class="row wrap gap-2">
    <button class="slot">4:00 PM</button>
    <button class="slot">4:30 PM</button>
    <button class="slot is-disabled">5:00 PM</button>
    <button class="slot is-selected">6:00 PM</button>
    <button class="slot">6:30 PM</button>
  </div>
  <div class="row between">
    <span class="t-sm text-secondary">6:00 PM – 7:30 PM · 90 min</span>
    <button class="btn btn--sm">Continue</button>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `CALENDAR & TIME SLOTS` section (the `.slot` rules follow the `.cal` rules).

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
