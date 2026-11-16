---
id: detail-list
name: Detail list
category: Data
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.detail-list, .detail-row, .detail-row--stack, .detail-row__k, .detail-row__v]
source-css: assets/css/components.css
source-demo: components.html
related: [drawer, card, data-table, form-section, record-header]
---

# Detail list

## Purpose
Label → value rows for a record shown read-only: the page-level way to render what a form
would have captured, without rendering a form.

## Description
`.detail-list` is a plain grid of `.detail-row`s. Each row puts a tertiary-toned
`.detail-row__k` label at the start and a medium-weight `.detail-row__v` value at the end,
separated by a hairline rule that the last row drops. `.detail-row--stack` flips the row to
a two-line block for values that cannot sit on one line — prose, a set of
[chips](chip.md), a multi-line address — and relaxes the value back to regular weight and
`--leading-relaxed`.

It is the **page-level twin of the drawer's own `.drawer-body-row`**, which does the same
job inside [drawer](drawer.md)'s `RD.openDrawer` helper. Use `.detail-row` everywhere
except inside that helper's output.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Inline | `.detail-row` | The value is short — a date, a count, a status badge |
| Stacked | `.detail-row detail-row--stack` | Prose, chip sets, anything that would wrap awkwardly against its label |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Label start, value end, hairline below |
| Last row | `:last-child` | No rule — the container's own edge closes the list |
| Empty value | page logic | Render an em-dash in `--color-text-tertiary`; never omit the row, or the reader cannot tell "none" from "not shown" |

## Properties
| Property | How |
|---|---|
| Rich values | Any inline content — a [status badge](status-badge.md), a link, a chip row |
| Grouping | Wrap each group in its own [card](card.md) or [form-section](form-section.md); the list itself has no heading |
| Alignment | Values are `text-align: end` inline, `start` when stacked |

## Responsive Behaviour
The inline row is a flex pair with `align-items: baseline`, so a long value wraps under
itself and keeps its label on the first line. No media query is needed; reach for
`--stack` rather than a breakpoint when a value is reliably long.

## Accessibility
- Use a `<dl>` with `<dt>`/`<dd>` when the pairs are genuinely definitional and the page
  has no other structure around them; `<div>`s are acceptable inside a titled card, which
  is what the demo shows.
- Do not rely on position alone to convey which text is the label — the tertiary tone is
  reinforced by the reading order, not a substitute for it.
- A value rendered as a status badge still needs its own text (see
  [status-badge](status-badge.md)).

## Dependencies
Tokens: spacing, `--color-text-tertiary`, `--color-border-subtle`, `--weight-medium`,
`--weight-regular`, `--text-sm`, `--leading-relaxed`. No JS.

## Related Components
- [drawer](drawer.md) — `.drawer-body-row` is this same row inside `RD.openDrawer`.
- [data-table](data-table.md) — when there are many records; a detail list describes exactly one.
- [form-section](form-section.md) — the collapsible card that usually wraps a detail list on a long read-only page.

## Usage Examples
- **Packages › View Package › Details** (`features/packages/us5-view-package.html`) — each
  of the nine Create-Package sections rendered read-only, with Description, Categories,
  Activities and Age groups using `--stack`.
- **Packages › View Package › Policy** — the linked policy's five sections in user-facing
  wording, all stacked.

## Do
- Keep the label wording identical to the form field that captured the value.
- Show every field, including the empty ones, so the reader can trust the list is complete.
- Reach for `--stack` as soon as a value regularly exceeds a few words.

## Don't
- Don't use it for two records side by side — that's a [data-table](data-table.md).
- Don't put editable controls in a value slot; a detail list is read-only by definition.
- Don't use `.drawer-body-row` outside a drawer just because it looks the same.

## HTML Reference
```html
<div class="detail-list">
  <div class="detail-row">
    <span class="detail-row__k">Name</span>
    <span class="detail-row__v">Platinum All-Access</span>
  </div>
  <div class="detail-row detail-row--stack">
    <span class="detail-row__k">Categories</span>
    <span class="detail-row__v">
      <span class="row wrap gap-2"><span class="chip">Fitness &amp; Gym</span><span class="chip">Padel</span></span>
    </span>
  </div>
  <div class="detail-row">
    <span class="detail-row__k">Status</span>
    <span class="detail-row__v"><span class="status status--live"><span class="dot"></span>Active</span></span>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → **RECORD PAGE SET** → *Detail list*.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-28 | Promoted from Packages › View Package (rules §2.3). Generalises the drawer-scoped `.drawer-body-row` to page level |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
