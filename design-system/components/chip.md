---
id: chip
name: Chip
category: Identity
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.chip, .chip--select, .is-active]
source-css: assets/css/components.css
source-demo: components.html
related: [badge, drawer, data-table]
---

# Chip

## Purpose
A compact interactive token for a value the user controls — an applied filter they can remove, or a filter option they can toggle.

## Description
A 32px pill (`--radius-full`, sunken background, 1px border, `--text-sm`) in two flavours. The dismissible chip embeds a 16px round remove `<button>` (12px close icon) that darkens on hover. The `.chip--select` filter chip is itself the click target: it gains `cursor: pointer` and a fast transition, and `.is-active` fills it with `--color-primary` and white text.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Dismissible | `.chip` + child `<button aria-label="Remove">` | Showing an applied filter/value the user can take away |
| Filter (select) | `.chip chip--select` | A toggleable option in a filter row |
| Filter, active | `.chip chip--select is-active` | The currently selected option(s) |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Sunken background, `--color-border` outline |
| Remove hover | `:hover` on the inner button | Button gets `--color-border` background, full-strength icon |
| Active | `.is-active` on `.chip--select` | `--color-primary` fill, white text, borderless |

## Properties
| Property | How |
|---|---|
| Remove control | Inner `<button>` with a 12px SVG and `aria-label` |
| Toggle | Add/remove `.is-active` (JS class toggle) |

## Responsive Behaviour
Chips wrap naturally inside `.row.wrap`. In the table toolbar at ≤640px the filter-chip row takes its own full-width line under the search field (`.data-table-toolbar > .row.wrap { width: 100% }`).

## Accessibility
- The remove button must carry `aria-label` ("Remove") — its icon is the only visible content.
- Filter chips act as toggles: use a real `<button>` per chip in product code and reflect state with `aria-pressed`.
- `.is-active` uses white-on-primary; state is also conveyed by the fill, not color-shift alone.

## Dependencies
Tokens: surface/border/primary colors, `--radius-full`, `--duration-fast`, spacing. JS: only a class toggle for `.is-active` / removal.

## Related Components
- [badge.md](badge.md) — read-only label; use when the user cannot interact with it.
- [drawer.md](drawer.md) — the Filters drawer composes `.chip--select` rows.
- [data-table.md](data-table.md) — toolbar filter chips above tables.

## Usage Examples
- Applied filters in the demo: "Padel - Court A" and "Bowling", each with a remove button.
- Segmenting filter row: `All` (active) / `Arrivals` / `Departures`.
- Activity-type chips inside the Filters drawer (`Padel` active, `Bowling`, `Spa`).

## Do
- Show one chip per applied filter so users see and undo their whole query.
- Keep exactly one obvious way to clear: the chip's own remove button (plus an optional "Clear filters" action).
- Toggle `.is-active` on click for select chips — nothing else changes.

## Don't
- Don't use chips as static labels — that's a badge.
- Don't nest a dismiss button inside a `.chip--select`; the two flavours don't mix.
- Don't rely on the active fill alone in a long row — keep labels short and distinct.

## HTML Reference
```html
<!-- Dismissible -->
<span class="chip">Padel - Court A <button aria-label="Remove"><!-- RD.icon("close") --></button></span>

<!-- Filter chips -->
<span class="chip chip--select is-active">All</span>
<span class="chip chip--select">Arrivals</span>
<span class="chip chip--select">Departures</span>
```

## CSS Reference
`assets/css/components.css` → `BADGES / TAGS / CHIPS / AVATAR` section (`.chip` block). Toolbar wrapping at ≤640px: same file, mobile `.data-table-toolbar` rules.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
