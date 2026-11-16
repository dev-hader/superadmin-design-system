---
id: filter-bar
name: Filter bar & saved views
category: Data
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.filterbar, .filter-chip, .filter-chip__key, .filter-chip__op, .filter-chip__val, .filter-chip__x, .filterbar__add, .filterbar__clear, .filterbar__views]
source-css: assets/css/components.css
source-demo: components.html
related: [chip, data-table, date-range-picker]
---

# Filter bar & saved views

## Purpose
Multi-dimension filtering that scales past one status row: each active filter is a readable
chip (field · operator · value) removable in place, plus an add-filter affordance, clear-all,
and named saved views. The standard filtering surface for every list screen.

## Description
A wrapping flex row (`.filterbar`). Active filters render as `.filter-chip` pills whose three
spans read as a sentence — `.filter-chip__key` (muted field), `.filter-chip__op` (muted
operator: is / in / ≥), `.filter-chip__val` (medium-weight value) — ending in a
`.filter-chip__x` remove button that turns danger-red on hover. `.filterbar__add` is a
dashed ghost pill; `.filterbar__clear` a quiet text action. `.filterbar__views` sits at the
logical end of the bar (auto margin): each saved view is a named set of chips, the active
one washed in `--color-primary-subtle`.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Full | `.filterbar` with views | List pages (bookings, customers, finance) |
| Chips-only | `.filterbar` without `.filterbar__views` | Drawers, secondary lists |

## States
| State | Trigger | Appearance |
|---|---|---|
| Chip hover on × | `.filter-chip__x:hover` | `--color-danger-subtle` bg, danger icon |
| Add hover | `.filterbar__add:hover` | border + text to `--color-primary-ink` |
| Active view | `.filterbar__views button.is-active` | `--color-primary-subtle` bg, ink text |
| Empty | no chips | only Add filter + views render — never an empty ghost row |

## Properties
| Property | How |
|---|---|
| Operator wording | plain language: is / is not / in / before / after / ≥ |
| Value pickers | chip click reopens its editor (select, [date-range-picker](date-range-picker.md), input) |
| Saved views | page persists them; a view = name + serialized chip set |

## Responsive Behaviour
The bar wraps naturally. ≤640px: `.filterbar__views` drops to its own full-width horizontally
scrollable row (scrollbar hidden). Chips stay full sentences — never truncate the value.

## Accessibility
- `.filter-chip__x` carries `aria-label="Remove <field> filter"`.
- The bar is a `role="group"` with `aria-label="Active filters"`; changes announce via the
  page's `aria-live` results region ("Showing 42 results").
- Views are buttons with `aria-pressed`.

## Dependencies
Tokens: surface, border, radius-full, danger, brand subtle groups. Chip add/remove and view
persistence are page-level JS. Distinct from the display [chip.md](chip.md) — a filter chip
is an interactive sentence, not a tag.

## Related Components
- [date-range-picker.md](date-range-picker.md) — the editor behind any date chip.
- [data-table.md](data-table.md) — the surface being filtered; pair with its toolbar.
- [chip.md](chip.md) — visual cousin; different contract.

## Usage Examples
- Bookings: `Status is Confirmed` + `Venue is SHQ Club` + `Date in Last 7 days`.
- Customers: `Membership is Active` + `Spend ≥ SAR 1,000` with a saved "VIPs" view.
- Finance: saved views "Unsettled payouts" / "Refunds this month".

## Do
- Read every chip aloud as a sentence — if it doesn't read, reword the operator.
- Jump straight into the field's value editor when a filter is added.
- Treat saved views as team vocabulary — seed each module with 2–3 sensible ones.

## Don't
- Don't truncate chip values — wrap the bar instead.
- Don't hide active filters inside a dropdown; visible chips ARE the state.
- Don't mix display tags into the bar — filters only.

## HTML Reference
```html
<div class="filterbar" role="group" aria-label="Active filters">
  <span class="filter-chip"><span class="filter-chip__key">Status</span>
    <span class="filter-chip__op">is</span><span class="filter-chip__val">Confirmed</span>
    <button class="filter-chip__x" aria-label="Remove Status filter"><!-- RD.icon("close") --></button></span>
  <button class="filterbar__add"><!-- RD.icon("sliders") --> Add filter</button>
  <button class="filterbar__clear">Clear all</button>
  <div class="filterbar__views">
    <button class="is-active" aria-pressed="true">All bookings</button>
    <button>Unpaid</button>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `FILTER BAR` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-19 | Initial build — P0 gap item (06-gap-analysis-roadmap.md), owner-approved |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
