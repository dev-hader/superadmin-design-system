---
id: stat-tile
name: Stat tile
category: Data
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.stat-strip, .stat-tile, .stat-tile--alert, .stat-tile--static, .stat-tile__txt, .stat-tile__val, .stat-tile__label, .is-active]
source-css: assets/css/components.css
source-demo: components.html
related: [card, filter-bar, data-table, badge]
---

# Stat tile

## Purpose
The glance row above a list: a handful of counts that both summarise the data and act as
one-click filters into it. "What do I have, and what needs me?" answered in one line.

## Description
`.stat-strip` is an auto-fitting grid of `.stat-tile`s (min 200px, so four tiles sit in a
row on desktop and stack on a phone with no media query). Each tile is a `<button>`: a
40px `.kpi-ic` beside a `.stat-tile__val` count over a `.stat-tile__label`. Clicking it
applies its filter to the list below and the tile takes `.is-active`; clicking the active
tile clears the filter again. `--alert` flips the icon tile to the danger pair for a
"needs action" count; `--static` is the same tile as a `<div>` for a metric with nowhere
to navigate.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Filter tile | `.stat-tile` (a `<button>`) | The count maps to a filter on the list below — the default |
| Alert tile | `.stat-tile stat-tile--alert` | A count that means work is waiting (rejected, overdue, unpaid) |
| Static metric | `.stat-tile stat-tile--static` (a `<div>`) | A number with no destination; renders identically, offers nothing |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Surface card, 1px border |
| Hover | `:hover` | `--color-primary` border + `--shadow-md` (not on `--static`) |
| Focus | `:focus-visible` | `--shadow-focus` ring |
| Active | `.is-active` | `--color-primary` border + `--color-primary-subtle` fill |

## Properties
| Property | How |
|---|---|
| Icon | Any inventory icon inside `.kpi-ic` |
| Value | `.stat-tile__val` — the count, already formatted (thousands separators) |
| Label | `.stat-tile__label` — plural noun phrase, sentence case |
| Filter state | Page toggles `.is-active` and mirrors it in `aria-pressed` |

## Responsive Behaviour
`repeat(auto-fit, minmax(200px, 1fr))` does all of it: four across at content width, two on
tablet, one per row on a phone. No breakpoint of its own.

## Accessibility
- A filter tile is a real `<button>` with `aria-pressed` reflecting `.is-active` — it is a
  toggle, not a link, because clicking the active tile clears the filter.
- A `--static` tile must be a `<div>`, never a disabled button: there is no action to
  announce, and a disabled control in a summary row reads as something broken.
- The count alone is not the accessible name — keep the label inside the button.
- Announce the resulting list size in the page's `aria-live` region ("Showing 3 packages"),
  because the visible change happens below the tile.
- Hover/shadow transition is dropped under `prefers-reduced-motion`.

## Dependencies
Tokens: surface, border, primary, primary-subtle, danger-subtle, radius-lg, shadow (xs/md/
focus), text-h3, motion. Embeds `.kpi-ic` (shell.css). Filtering is page JS.

## Related Components
- [card.md](card.md) / `RD.kpiStrip` — the dashboard KPI card shows a value plus a
  period-over-period delta badge and is not interactive; this tile is a filter control.
  Use the KPI strip on dashboards, stat tiles above lists.
- [filter-bar.md](filter-bar.md) — a tile's filter must appear there as a removable chip,
  so the state stays visible and undoable in one place.
- [data-table.md](data-table.md) — the list being summarised and filtered.

## Usage Examples
- Packages list: Active packages · Pending approval · Active subscribers (`--static`, its
  Subscribers screen doesn't exist yet) — `features/packages/us2-packages-list.html`.
- `--alert` has no product consumer at the moment (the Packages "Needs action" tile it was
  built for was dropped at review); it is demonstrated in the "List-screen set" entry of
  `components.html` and is the right flavour for any count that means work is waiting.

## Do
- Keep the strip to 3–5 tiles; past that it stops being a glance.
- Make the active tile clear its own filter on a second click.
- Mirror every tile filter into the filter chips so it can be removed there too.

## Don't
- Don't use a tile for a number that filters nothing and links nowhere unless it is
  `--static` — a dead button is worse than a plain figure.
- Don't put deltas or sparklines in it; that's the dashboard KPI card.
- Don't let two tiles apply contradictory filters silently — toggling one should replace
  the other's status set, not fight it.

## HTML Reference
```html
<div class="stat-strip">
  <button type="button" class="stat-tile is-active" aria-pressed="true">
    <span class="kpi-ic"><!-- RD.icon("package") --></span>
    <span class="stat-tile__txt">
      <span class="stat-tile__val">13</span>
      <span class="stat-tile__label">Active packages</span>
    </span>
  </button>

  <button type="button" class="stat-tile" aria-pressed="false">
    <span class="kpi-ic"><!-- RD.icon("clock") --></span>
    <span class="stat-tile__txt">
      <span class="stat-tile__val">6</span><span class="stat-tile__label">Pending approval</span></span>
  </button>

  <button type="button" class="stat-tile stat-tile--alert" aria-pressed="false">
    <span class="kpi-ic"><!-- RD.icon("warn") --></span>
    <span class="stat-tile__txt">
      <span class="stat-tile__val">4</span><span class="stat-tile__label">Needs action</span></span>
  </button>

  <!-- a metric with no destination: a div, not a disabled button -->
  <div class="stat-tile stat-tile--static">
    <span class="kpi-ic"><!-- RD.icon("users") --></span>
    <span class="stat-tile__txt">
      <span class="stat-tile__val">954</span><span class="stat-tile__label">Active subscribers</span></span>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `LIST-SCREEN SET` section, block 4.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-08 | Initial build — composed for Packages US2 Packages List, promoted per rules §2.3 |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
