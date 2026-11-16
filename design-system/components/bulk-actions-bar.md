---
id: bulk-actions-bar
name: Bulk actions bar
category: Data
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.bulkbar, .bulkbar__count, .bulkbar__actions, .bulkbar__divider, .bulkbar__close]
source-css: assets/css/components.css
source-demo: components.html
related: [data-table, checkbox-radio, toast]
---

# Bulk actions bar

## Purpose
The moment rows are selected in a table, this floating bar surfaces what can be done to all
of them at once — confirm, message, export — with the live count. Bulk operations are a
daily front-desk task; this is their single home.

## Description
A fixed, horizontally-centered pill (`position: fixed; inset-block-end: --space-6`) on the
**inverted surface** (`--color-text` bg / `--color-text-inverse` text — dark bar in light
mode, light bar in dark mode) so it can never dissolve into the page. Contents:
`.bulkbar__count` ("3 selected"), `.bulkbar__actions` (quiet pill buttons that wash with
`--color-inverse-hover`), a `.bulkbar__divider`, and `.bulkbar__close` to clear the
selection. Enters with a small rise+fade (`prefers-reduced-motion` guarded).

## Variants
| Variant | Class | Use when |
|---|---|---|
| Standard | `.bulkbar` | Every bulk-selection context |

## States
| State | Trigger | Appearance |
|---|---|---|
| Visible | ≥1 row selected | bar animates in, count live-updates |
| Hidden | selection cleared / Escape | removed from DOM (not `display:none`) |
| Action hover | `.bulkbar__actions button:hover` | `--color-inverse-hover` wash, full opacity |

## Properties
| Property | How |
|---|---|
| Count | `.bulkbar__count` — `<b>3</b> selected`; update text, don't re-mount the bar |
| Actions | ≤4 direct actions; overflow goes into a [menu](menu.md) |
| Clear | `.bulkbar__close` + Escape both clear selection |

## Responsive Behaviour
≤768px: `inset-block-end: 96px` clears the mobile tab bar. `max-width: calc(100vw - 32px)`;
if actions can't fit, collapse the least-used into an overflow menu — never wrap to two rows.

## Accessibility
- The bar is `role="toolbar"` with `aria-label="Bulk actions"`; count changes announce via
  `aria-live="polite"`.
- Escape clears selection and returns focus to the table.
- `.bulkbar__close` carries `aria-label="Clear selection"`.
- Destructive bulk actions (cancel bookings) open a confirm [modal](modal.md) stating the
  count — the bar itself never destroys.

## Dependencies
Tokens: text/text-inverse (inverted surface), `--color-inverse-hover`, radius-full,
shadow-xl, z-sticky, motion. Selection state comes from
[data-table](data-table.md) checkboxes ([checkbox-radio](checkbox-radio.md)).

## Related Components
- [data-table.md](data-table.md) — supplies the selection this bar acts on.
- [modal.md](modal.md) — confirm step for destructive bulk actions.
- [toast.md](toast.md) — reports the outcome ("12 bookings confirmed").

## Usage Examples
- Bookings: select 8 pending → Confirm all / Message customers / Export.
- Customers: select a segment → add tag, send campaign.
- Administration: select staff rows → change branch assignment.

## Do
- Show it on the first selected row; kill it on the last deselection.
- Keep labels verb-first and specific ("Confirm", not "Apply").
- Report results with a toast, including partial failures ("10 of 12 confirmed").

## Don't
- Don't put destructive actions directly on the bar without a confirm dialog.
- Don't let it cover the last table row — the table container reserves bottom space
  while the bar is up.
- Don't use it for single-row actions — that's the row's kebab menu.

## HTML Reference
```html
<div class="bulkbar" role="toolbar" aria-label="Bulk actions">
  <span class="bulkbar__count" aria-live="polite"><b>3</b> selected</span>
  <div class="bulkbar__actions">
    <button><!-- RD.icon("check") --> Confirm</button>
    <button><!-- RD.icon("send") --> Message</button>
    <button><!-- RD.icon("box") --> Export</button>
  </div>
  <span class="bulkbar__divider"></span>
  <button class="bulkbar__close" aria-label="Clear selection"><!-- RD.icon("close") --></button>
</div>
```

## CSS Reference
`assets/css/components.css` → `BULK ACTIONS BAR` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-19 | Initial build — P0 gap item (06-gap-analysis-roadmap.md), owner-approved |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
