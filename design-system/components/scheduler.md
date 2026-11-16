---
id: scheduler
name: Scheduler (week-view booking calendar)
category: Booking
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.sched, .sched__toolbar, .sched__title, .sched__scroll, .sched__grid, .sched__head, .sched__dayhead, .sched__body, .sched__time, .sched__cell, .sched__evt, .sched__evt--confirmed, .sched__evt--checkedin, .sched__evt--pending, .sched__evt--cancelled, .sched__evt--avail, .sched__evt--event, .sched__evt-kebab, .sched__now, .sched__legend, .is-today, .is-hour]
source-css: assets/css/components.css
source-demo: scheduling.html
related: [calendar, time-slots, status-badge, drawer, segmented-control, button]
---

# Scheduler (week-view booking calendar)

## Purpose
The staff-side grid that shows every reservation, open session and public event across a venue, in a week or one-day timeline layout.

## Description
`.sched` is a bordered surface card with three bands: a `.sched__toolbar` (Today button, prev/next `icon-btn`s, `.sched__title`, resource `.select`, "New booking" `.btn`), a horizontally scrollable `.sched__scroll` holding the CSS-grid `.sched__grid` (`.sched__head` day headers + `.sched__body` cells and events), and a `.sched__legend` of `.sw` swatches. Rows are 26px half-hour slots (`grid-auto-rows: 26px`); events are absolutely placed with inline `grid-column` / `grid-row … span` values. Event colors come from the booking-status palette in `tokens.css`.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Container | `.sched` | Always — one scheduler component, column meaning changes per view |
| Event: confirmed | `.sched__evt sched__evt--confirmed` | Confirmed booking (navy) |
| Event: checked in | `.sched__evt sched__evt--checkedin` | Guest on site (green) |
| Event: pending | `.sched__evt sched__evt--pending` | Awaiting payment/approval (amber) |
| Event: cancelled | `.sched__evt sched__evt--cancelled` | Kept visible, red palette |
| Open availability | `.sched__evt sched__evt--avail` | Dashed accent outline, "+ Open · N spots" |
| Public event | `.sched__evt sched__evt--event` | Navy gradient with lime edge (tournaments etc.) |

## States
| State | Trigger | Appearance |
|---|---|---|
| Cell hover | `.sched__cell:hover` | Surface-hover tint + centered "+" affordance (`::after`) |
| Hour line | `.sched__cell.is-hour` | Top border on full-hour rows |
| Today column | `.sched__dayhead.is-today` / `.sched__cell.is-today` | `--color-primary-subtle` wash, primary day label |
| Event hover | `.sched__evt:hover` | Lift (`translateY(-1px)`, `--shadow-md`), reveals `.sched__evt-kebab` |
| Now line | `.sched__now` | 2px `--color-danger` rule with a dot, spans all columns |

## Properties
| Property | How |
|---|---|
| Columns | Inline `grid-template-columns: 56px repeat(N, 1fr)` on `__grid`, `__head`, `__body` — days (week view) or resources (timeline view) |
| Hour range | Rows generated per half-hour; `.sched__time` labels span 2 rows each |
| Event placement | Inline `grid-column` / `grid-row: start / span n` per event |
| Row menu | Optional `.sched__evt-kebab` icon button inside an event |

## Responsive Behaviour
`.sched__scroll` is `overflow-x: auto` and `.sched__grid` keeps `min-width: 780px`, so on tablets/phones the grid scrolls sideways instead of squashing. The toolbar wraps (`flex-wrap: wrap`).

## Accessibility
- Every `.sched__evt` opens a detail drawer — make events focusable and keyboard-activatable, not click-only.
- `.sched__evt-kebab` appears on hover *and* `:focus-visible`, so keyboard users can reach the per-event menu.
- Status is encoded by color plus the legend; the drawer repeats it as a text `.status` badge.
- `.sched__now` is `pointer-events: none` and purely decorative.

## Dependencies
- Tokens: `--status-confirmed/checkedin/pending/cancelled-(bg|fg|dot)` (BOOKING STATUS palette, `tokens.css`), surface/border/primary/accent/danger groups.
- Composed with `.btn`, `.icon-btn`, `.select`, `.segmented` (view switcher) and `RD.openDrawer` (shell.js) for event details.

## Related Components
- [calendar.md](calendar.md) — guest-facing date picking; the scheduler is staff-facing.
- [time-slots.md](time-slots.md) — the `--avail` blocks correspond to open slots guests can book.
- [status-badge.md](status-badge.md) — same status palette in badge form (used in the drawer).
- [drawer.md](drawer.md) — booking detail panel opened from an event.
- [segmented-control.md](segmented-control.md) — Week / Timeline view switcher above the grid.

## Usage Examples
How `scheduling.html` composes it: one `buildGrid(cols, events, opts)` engine renders both panels — **Week** (columns = 7 days, 3–10 PM) and **Timeline · Today** (columns = 6 resources, 8 AM–10 PM, `.sched__now` shown). A `.segmented` toggle swaps `.view-panel.is-active`. Clicking any non-`--avail` event reads its `data-*` attributes and opens `RD.openDrawer` with status badge, booking code, guest, resource, time, amount, plus Reschedule / Cancel booking actions.

## Do
- Keep cancelled bookings on the grid — an emptied slot with no explanation causes confusion.
- Render open capacity as `--avail` blocks so staff can sell gaps at a glance.

## Don't
- Don't add new event colors — the six documented modifiers map 1:1 to the status/availability model.
- Don't shrink the grid below 780px; let `.sched__scroll` scroll instead.

## HTML Reference
```html
<div class="sched">
  <div class="sched__toolbar">
    <button class="btn btn--sm btn--secondary">Today</button>
    <button class="icon-btn" aria-label="Previous"><!-- chevronLeft --></button>
    <button class="icon-btn" aria-label="Next"><!-- chevronRight --></button>
    <b class="sched__title">July 9 – 15, 2026</b>
    <span class="grow"></span>
    <button class="btn btn--sm">New booking</button>
  </div>
  <div class="sched__scroll"><div class="sched__grid">
    <div class="sched__head">
      <div></div>
      <div class="sched__dayhead is-today"><b>Thu</b><span>Jul 9</span></div>
      <!-- …more day/resource headers -->
    </div>
    <div class="sched__body">
      <div class="sched__time" style="grid-row:1 / span 2">3 PM</div>
      <div class="sched__cell is-today is-hour" style="grid-column:2;grid-row:1"></div>
      <div class="sched__evt sched__evt--confirmed" style="grid-column:3;grid-row:4 / span 4">
        <b>Football Academy U12</b><span>Development Academy</span><span>4:30 – 6:30 PM</span>
      </div>
      <div class="sched__evt sched__evt--avail" style="grid-column:2;grid-row:11 / span 2">+ Open · 4 spots</div>
      <div class="sched__now" style="grid-column:2 / -1;grid-row:7"></div>
    </div>
  </div></div>
  <div class="sched__legend">
    <span class="row gap-2"><span class="sw" style="background:var(--status-confirmed-dot)"></span>Confirmed</span>
    <span class="row gap-2"><span class="sw" style="border:1.5px dashed var(--color-accent)"></span>Open session</span>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `SCHEDULER - week-view booking calendar` section. Status palette: `assets/css/tokens.css` → `BOOKING STATUS palette`.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
