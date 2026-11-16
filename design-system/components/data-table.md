---
id: data-table
name: Data table
category: Data
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.data-table-wrap, .data-table-toolbar, .data-table-scroll, .data-table, .data-table--pinned, .sortable, .th-inner, .cell-user, .cell-sub, .cell-thumb, .data-table-footer, tr.is-flagged]
source-css: assets/css/components.css
source-demo: components.html
related: [pagination, menu, checkbox-radio, badge, avatar, drawer]
---

# Data table

## Purpose
The primary surface for lists of records — bookings, customers, staff — with search, filtering, selection, per-row actions and pagination.

## Description
A bordered, shadowed `.data-table-wrap` card stacks up to four slots: `.data-table-toolbar` (search, filter chips, actions), `.data-table-scroll` (the horizontal-scroll container holding the `<table class="data-table">`), and `.data-table-footer` (row summary + [pagination](pagination.md)). Headers are sticky, uppercase, tertiary; rows highlight on hover; `.cell-user` composes avatar + name, `.cell-sub` a muted second line. `th.sortable` (+ `.th-inner`) marks sortable columns.

## Variants — the three documented patterns
| Pattern | Composition | Use when |
|---|---|---|
| Basic | `.data-table-wrap > .data-table-scroll > .data-table` only | A quiet, secondary list — activity feed, settings summary — "not the primary record manager on a page" (demo note) |
| Selectable + bulk toolbar | Leading checkbox column; selecting any row swaps the default toolbar for a bulk-action one showing the count; trailing per-row kebab `.menu` | The page's main record manager |
| Expandable rows | `tr.exp-row` toggling a following `tr.exp-detail` (colspan cell) | Compact list with full detail one click away |

Note: `.exp-row` / `.exp-detail` / `.exp-chevron` are **demo-level classes** styled in `components.html`'s own `<style>` block, not in components.css — copy that block if you reuse the pattern.

**Pinned ends (v1.5.0):** add `.data-table--pinned` alongside `.data-table` to hold the
**first** column (the identity cell) and the **last** column (row actions) in place while
the middle scrolls horizontally. Both offsets are logical (`inset-inline-start/end`), so RTL
pins the mirror sides with no extra rule; header cells keep their existing vertical sticking
and gain the horizontal one. Pinning switches itself off at ≤640px, where the table is
already a stack of cards. Use it once a table passes roughly eight columns — below that it
costs a hairline and buys nothing.

**Thumbnail cell (v1.5.0):** `.cell-thumb` is the square (44px, `--radius-sm`) counterpart
to the round `.avatar` inside `.cell-user` — for records whose identity is a **picture**
(a package cover, a venue photo) rather than a person. It crops its `<img>` with
`object-fit: cover` and falls back to a centred icon when there is no image. People keep
the avatar; things get the thumb.

**Density (v1.4.0):** cell padding and font ride the density tokens (`--table-pad-y/-x`,
`--table-head-pad-y`, `--table-font`). `data-density="compact"` on `<html>` (user-set via
the style switcher, persisted as `rd-density`) tightens every table system-wide — pages
never hardcode compact paddings.

## States
| State | Trigger | Appearance |
|---|---|---|
| Row hover | `:hover` on `tbody tr` | `--color-surface-hover` background |
| Sortable header hover | `th.sortable:hover` | Header text darkens |
| Row selected | Page JS (checkbox) | Toolbar swaps to bulk actions with "N selected" |
| Row expanded | `.is-open` on `.exp-row`/`.exp-detail` (demo) | Chevron rotates 90°, detail row shows |

## Properties
| Property | How |
|---|---|
| Toolbar | `.data-table-toolbar`: check-all, `.input-wrap` search, filter chips, `.grow` spacer, `.btn--sm` actions |
| Identity cell | `.cell-user` (avatar + bold name), optional `.cell-sub` |
| Row actions | Trailing cell with kebab `.icon-btn` + portaled `.menu` (see [menu.md](menu.md)) |
| Footer | `.data-table-footer`: summary span + `.pagination` |
| Mobile labels | `data-label="…"` attribute on every non-first `<td>` — **required** (see below) |

## Responsive Behaviour
At ≤640px every `.data-table` restyles from a horizontally-scrolling grid into **a stack of cards — one card per row, each cell as a label/value pair via the cell's own `data-label` attribute** (components.css mobile comment, TABLE section). Specifics:
- `thead` is hidden; each `tr` becomes a bordered card; each `td` becomes a flex label/value row whose label is `attr(data-label)`.
- Cells **without** `data-label` (identity cells that carry their own context, like avatar + name) render with no label prefix; checkbox-only cells are hidden outright.
- The toolbar wraps: search stretches full-width on its own row, chips wrap beneath, buttons keep readable labels.
So `data-label` is required on every non-first data cell or the value renders with no context on phones.

## Accessibility
- Use real `<table>/<thead>/<tbody>` semantics — the mobile card restyle is pure CSS on top.
- Kebab buttons: `aria-label="Row actions"` + `aria-haspopup="true"`; select-all and row checkboxes are `.check` labels with real inputs.
- Sticky headers keep column context while scrolling; sortable headers are pointer-styled `th.sortable`.

## Dependencies
Tokens: surface, border, radius, shadow, text, spacing groups. Components embedded: check, input, chip, badge, avatar, menu, pagination. JS: page-level wiring for sort/select/expand; `RD.portalMenu`/`RD.positionMenu` for row menus; `RD.stagger` optionally fades rows in.

## Related Components
- [pagination.md](pagination.md) — lives in `.data-table-footer`.
- [menu.md](menu.md) — per-row kebab actions (portal pattern is mandatory).
- [drawer.md](drawer.md) — row "view" actions open the live record drawer.

## Usage Examples
- Bookings page: full pattern — toolbar with search + status chips, sortable columns, select-all, footer summary + pagination (`bookings.html`).
- Activity feed / settings summary: basic pattern, no toolbar or selection.
- Staff list with expandable permission details (components.html, expandable demo).

## Do
- Put `data-label` on every non-first cell — the mobile card view depends on it.
- Swap the toolbar content for bulk actions while rows are selected; keep the per-row kebab for single-record actions.

## Don't
- Don't nest the row-menu open state inside the table card without portaling — see [menu.md](menu.md).
- Don't use the selectable pattern for a passive list; the basic table exists for that.

## HTML Reference
```html
<div class="data-table-wrap">
  <div class="data-table-toolbar">
    <label class="check"><input type="checkbox"><span class="check__box"><!-- check --></span></label>
    <div class="input-wrap" style="max-width:260px"><span class="input-wrap__icon"><!-- search --></span>
      <input class="input" placeholder="Search reservations"></div>
    <span class="grow"></span>
    <button class="btn btn--sm btn--secondary">Export</button>
    <button class="btn btn--sm">New booking</button>
  </div>
  <div class="data-table-scroll"><table class="data-table">
    <thead><tr>
      <th style="width:40px"></th>
      <th class="sortable"><span class="th-inner">Customer</span></th>
      <th>Amount</th><th style="width:40px"></th>
    </tr></thead>
    <tbody>
      <tr>
        <td><label class="check"><input type="checkbox"><span class="check__box"><!-- check --></span></label></td>
        <td><div class="cell-user"><span class="avatar avatar--sm">SA</span><div style="font-weight:600">Sara A.</div></div></td>
        <td data-label="Amount" style="font-weight:600">SAR 180</td>
        <td><button class="icon-btn tbl-kebab" style="width:32px;height:32px" aria-label="Row actions" aria-haspopup="true"><!-- kebab dots --></button></td>
      </tr>
    </tbody>
  </table></div>
  <div class="data-table-footer">
    <span>Showing 1–10 of 2,310</span>
    <div class="pagination"><!-- see pagination.md --></div>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `TABLE` section (including the ≤640px mobile-cards block and its comment). Expandable-row demo styles: `<style>` block in `components.html`.

## Version
| Version | Date | Change |
|---|---|---|
| 1.5.0 | 2026-09-08 | Added `.data-table--pinned` (sticky first/last column, logical offsets, off ≤640px) and `.cell-thumb` (square picture cell). Built for Packages US2 Packages List, promoted per rules §2.3 |
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
