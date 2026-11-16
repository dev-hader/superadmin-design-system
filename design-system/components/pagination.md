---
id: pagination
name: Pagination
category: Navigation
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.pagination, .pg-prev, .pg-next, .is-active]
source-css: assets/css/components.css
source-demo: components.html
related: [data-table, tabs]
---

# Pagination

## Purpose
Moves through pages of one long list — the standard right-hand half of a data table's footer.

## Description
A tight flex row (`gap: 2px`) of plain `<button>`s: a `.pg-prev` chevron, numbered pages, an ellipsis button, the last page number, and a `.pg-next` chevron. Buttons are 34px tall with `min-width: 34px`; the current page carries `.is-active` (solid primary, white text). It lives inside `.data-table-footer`, which pairs a row-summary span on the start side with the pagination on the end side (`justify-content: space-between`).

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.pagination` | Inside `.data-table-footer` under any paged table |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | `--color-text-secondary` number buttons |
| Hover | `:hover` | `--color-surface-hover` background |
| Current page | `.is-active` | `--color-primary` background, white text |

## Properties
| Property | How |
|---|---|
| Prev / next arrows | `.pg-prev` / `.pg-next` buttons with 16px chevron SVGs and `aria-label` |
| Truncation | A literal `…` button between the visible window and the last page |
| Row summary | Sibling `<span>` in `.data-table-footer` (e.g. "Showing 1–10 of 2,310") |

## Responsive Behaviour
No media queries target `.pagination` itself. On mobile the table above it restyles into stacked cards (see [data-table.md](data-table.md)); keep the visible page window short so the footer fits.

## Accessibility
- Arrow buttons **must** carry `aria-label="Previous"` / `aria-label="Next"` — they are icon-only.
- **RTL:** chevrons mirror via CSS — LTR flips the prev icon (`.pg-prev svg { transform: scaleX(-1); }`), and `[dir="rtl"]` swaps which side is flipped, so the same markup works in Arabic.
- The current page is marked with `.is-active`; add `aria-current="page"` in page wiring for screen readers.

## Dependencies
Tokens: brand, surface, radius, text groups. Icons: `chevronLeft` / `chevronRight` injected by page JS (see `bookings.html`). No dedicated JS helper.

## Related Components
- [data-table.md](data-table.md) — pagination is designed as the second half of `.data-table-footer`.
- [tabs.md](tabs.md) — switching views, not pages of one list.

## Usage Examples
- Bookings list footer: "`<span id="rowSummary">`" + pages `1 2 3 … 231` with prev/next (`bookings.html`).

## Do
- Always pair with a row summary inside `.data-table-footer` so users know list size.
- Keep a short window of page numbers plus the last page behind an ellipsis.

## Don't
- Don't use pagination for wizard steps — that's the [stepper](stepper.md).
- Don't hand-roll different button sizes; the 34px metrics come from `.pagination button`.

## HTML Reference
```html
<!-- From bookings.html — footer of a .data-table-wrap -->
<div class="data-table-footer">
  <span id="rowSummary">Showing 1–10 of 2,310</span>
  <div class="pagination">
    <button class="pg-prev" aria-label="Previous"><!-- RD.icon("chevronLeft") --></button>
    <button class="is-active">1</button>
    <button>2</button>
    <button>3</button>
    <button>…</button>
    <button>231</button>
    <button class="pg-next" aria-label="Next"><!-- RD.icon("chevronRight") --></button>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `TABLE` section (pagination rules sit at its end, with `.data-table-footer`).

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
