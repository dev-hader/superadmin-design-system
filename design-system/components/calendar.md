---
id: calendar
name: Calendar (month)
category: Booking
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.cal, .cal__head, .cal__grid, .cal__dow, .cal__day, .is-muted, .is-today, .in-range, .is-selected, .has-dot]
source-css: assets/css/components.css
source-demo: index.html#/pickers (design-system spec site)
related: [time-slots, scheduler]
---

# Calendar (month)

## Purpose
Compact month grid for picking a single date or a date range in booking flows.

## Description
A max-width 340px surface card containing a `.cal__head` (prev/next `icon-btn`s around a bold month label) and a 7-column `.cal__grid`. The grid mixes `.cal__dow` weekday headers with square `.cal__day` cells. Range selection is expressed by two `.is-selected` endpoints with `.in-range` cells between them; days that already have bookings carry a `.has-dot` accent marker.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.cal` | Single-date or range picking anywhere in a booking flow |

There are no size or color modifiers — one calendar, everywhere.

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Square cell, `--radius-sm`, caption text |
| Hover | `:hover` | `--color-surface-hover` background |
| Outside month | `.is-muted` | `--color-text-disabled`, `pointer-events: none` |
| Today | `.is-today` | Inset 1.5px `--color-primary` ring, semibold |
| In range | `.in-range` | `--color-primary-subtle` fill, radius removed so the band reads continuous |
| Selected | `.is-selected` | Solid `--color-primary`, white text, semibold |
| Has bookings | `.has-dot` | 4px `--color-accent` dot below the number (turns white when combined with `.is-selected`) |

## Properties
| Property | How |
|---|---|
| Range selection | `.is-selected` on both endpoints + `.in-range` on the days between |
| Booking indicator | `.has-dot` on any day |
| Month navigation | Two `.icon-btn` chevrons inside `.cal__head` |

## Responsive Behaviour
No media queries of its own — `width: 100%; max-width: 340px` lets it shrink fluidly inside any column; `aspect-ratio: 1` keeps day cells square at every width.

## Accessibility
- Grid should use arrow-key navigation with `aria-selected`; mark today with `aria-current="date"` (per the spec-site demo notes).
- `.is-muted` days are removed from pointer interaction — keep them out of tab order too.
- The `.has-dot` marker is color-only; pair it with an accessible name (e.g. "Jul 10, 3 bookings").

## Dependencies
- Tokens: surface/border/primary/accent groups, radius, `--duration-fast`.
- Availability palette (`tokens.css` → AVAILABILITY palette): `--avail-free`, `--avail-partial`, `--avail-booked`, `--avail-blocked` are the sanctioned colors for availability displays around the calendar (e.g. the resource-availability heatmap); the calendar's own dot uses `--color-accent`.
- Embeds `.icon-btn` for month navigation.

## Related Components
- [time-slots.md](time-slots.md) — the step after a date is picked; choose it for intra-day times.
- [scheduler.md](scheduler.md) — full week/timeline grid when staff need to see bookings, not just pick a date.

## Usage Examples
- Date-range picker on the spec site's Pickers & Advanced page (July 2026, range 9–12 selected, dots on days with bookings).
- Date step of the new-booking flow before showing time slots.

## Do
- Keep leading/trailing days of adjacent months visible as `.is-muted` so weeks stay aligned.
- Use `.in-range` only between two `.is-selected` endpoints.

## Don't
- Don't hide days with no availability — mute or annotate them instead.
- Don't repurpose `.has-dot` for anything other than "this day has bookings".

## HTML Reference
```html
<div class="cal">
  <div class="cal__head">
    <button class="icon-btn" aria-label="Previous month"><!-- chevronLeft --></button>
    <b>July 2026</b>
    <button class="icon-btn" aria-label="Next month"><!-- chevronRight --></button>
  </div>
  <div class="cal__grid">
    <span class="cal__dow">Su</span><span class="cal__dow">Mo</span><!-- …7 headers -->
    <span class="cal__day is-muted">30</span>
    <span class="cal__day">8</span>
    <span class="cal__day is-selected is-today">9</span>
    <span class="cal__day in-range has-dot">10</span>
    <span class="cal__day in-range">11</span>
    <span class="cal__day is-selected">12</span>
    <span class="cal__day has-dot">14</span>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `CALENDAR & TIME SLOTS` section. Availability palette: `assets/css/tokens.css` → `AVAILABILITY palette`.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
