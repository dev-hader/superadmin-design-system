---
id: menu
name: Menu (dropdown)
category: Overlays
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.menu, .menu--select, .menu__head, .menu__item, .menu--select__foot, .is-danger, .is-open]
source-css: assets/css/app.css
source-demo: components.html
related: [button, data-table, card, tooltip]
---

# Menu (dropdown)

## Purpose
A small popover list of actions or options anchored to a trigger — the topbar notification/profile menus, a table row's kebab actions, the phone field's country picker.

## Description
`.menu` is a hidden, elevated surface panel (`min-width: 300px`, `--shadow-lg`, `z-index: var(--z-popover)`) that fades up when `.is-open` is added. Items are full-width `.menu__item` buttons with an optional leading 17px icon or status dot; `.menu__head` gives notification-style menus a title row with an inline action. In its raw CSS the menu positions absolutely under a `position: relative` trigger wrapper (`.topbar__menu`) — but in the product it is **always portaled to `<body>`** (see below).

## Variants
| Variant | Class | Use when |
|---|---|---|
| Action menu | `.menu` of `.menu__item`s | Row kebab, split-button dropdown |
| With header | `.menu` + `.menu__head` | Notifications ("Mark all read") style panels |
| Danger item | `.menu__item is-danger` | The destructive action, always listed last |
| Multi-select filter | `.menu menu--select` of `.check` labels (+ `.menu--select__foot`) | A filter dropdown where several values can be on at once |

## States
| State | Trigger | Appearance |
|---|---|---|
| Closed | — | `display: none` |
| Open | `.is-open` | Visible, `hf-fade-up` at `--duration-fast` |
| Item hover | `:hover` | `--color-surface-hover` background |
| Danger item | `.is-danger` | Text and icon in `--color-danger` |

## The portal pattern (critical)
Never leave an open menu nested inside a card. From the `RD.portalMenu` comment in `assets/shell.js`: "Any menu left nested inside a card inherits that card's stacking context - and cards on this product animate in on every load (opacity/transform), which creates a stacking context of its own for the whole animation. A menu trapped inside loses to a later sibling card regardless of its z-index … Portaling to body sidesteps the problem entirely instead of chasing every place a transform might appear."

So every open goes through the two shell helpers:
- `RD.portalMenu(menu)` — re-appends the menu to `<body>` (idempotent).
- `RD.positionMenu(menu, trigger, align)` — sets `position: fixed` coordinates from the trigger's bounding box; `align: "end"` right-aligns to the trigger, and the result is clamped 8px inside the viewport.

## Responsive Behaviour
No menu-specific media queries. `positionMenu`'s viewport clamp keeps menus on-screen at any width; on touch layouts prefer the bottom [sheet](drawer.md) for long action lists.

## Accessibility
- Kebab triggers are icon-only: `aria-label="Row actions"` + `aria-haspopup="true"` (see the table demo).
- Items are real `<button>`s; clicking an item or anywhere outside closes all menus (delegated document listener in the demo).
- Only one menu is open at a time — the demo's `openMenu` closes every other `.menu.is-open` first.

## Dependencies
Tokens: surface, border, shadow, z-index, motion groups. JS: `RD.portalMenu` + `RD.positionMenu` (assets/shell.js) — required, not optional. Keyframe `hf-fade-up`.

## Related Components
- [button.md](button.md) — the kebab `.icon-btn` and split-button chevron are the usual triggers.
- [data-table.md](data-table.md) — per-row kebab menus (`#rowMenu{i}`).
- [card.md](card.md) — documents the same stacking-context hazard from the card's side (shadow-only hover, no transform).

## Usage Examples
- Table row kebab: Reschedule / View customer / danger Cancel (components.html, selectable table demo).
- Topbar notifications and profile menus (`.topbar__menu` wrapper, app shell).
- Phone field country picker (`#countryMenu`, portaled with `align: "start"`).

## Do
- Route every open through `RD.portalMenu` + `RD.positionMenu`, then toggle `.is-open`.
- Put the destructive item last, marked `.is-danger`.

## Don't
- Don't position a menu with raw absolute offsets inside a card and z-index your way out — the stacking context wins regardless of z-index.
- Don't leave a menu open while another opens; close all others first.

## HTML Reference
```html
<!-- Row kebab + menu (from the selectable-table demo) -->
<button class="icon-btn tbl-kebab" style="width:32px;height:32px" aria-label="Row actions" aria-haspopup="true">
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="6" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="12" cy="18" r="1.9"/></svg>
</button>
<div class="menu" id="rowMenu0">
  <button class="menu__item"><!-- RD.icon("calendar") --> Reschedule</button>
  <button class="menu__item"><!-- RD.icon("users") --> View customer</button>
  <button class="menu__item is-danger"><!-- RD.icon("close") --> Cancel</button>
</div>

<!-- Multi-select filter dropdown. The rows are .check LABELS, not .menu__item
     buttons — a checkbox inside a button is invalid markup. Bind to `change`
     on the inputs, never `click` on the row: a label click also dispatches a
     synthetic click on its input, so a click handler fires twice per toggle. -->
<div class="menu menu--select" id="statusFilterMenu">
  <label class="check"><input type="checkbox" value="pending">
    <span class="check__box"><!-- RD.icon("check") --></span> Pending Approval</label>
  <label class="check"><input type="checkbox" value="rejected" checked>
    <span class="check__box"><!-- RD.icon("check") --></span> Rejected</label>
  <label class="check"><input type="checkbox" value="active">
    <span class="check__box"><!-- RD.icon("check") --></span> Active</label>
  <div class="menu--select__foot"><button class="btn btn--sm btn--ghost">Clear</button></div>
</div>

<script>
  // The only sanctioned open sequence:
  RD.portalMenu(menu);
  RD.positionMenu(menu, triggerBtn, "end");
  menu.classList.add("is-open");
</script>
```

## CSS Reference
`assets/css/app.css` → `MAIN + TOPBAR` section, "Topbar dropdown menus (notifications, profile)" block. Portal/positioning helpers: `assets/shell.js` (`RD.portalMenu`, `RD.positionMenu`) — rationale comments there and above the delegated wiring in `components.html`.

## Version
| Version | Date | Change |
|---|---|---|
| 1.1.0 | 2026-09-08 | Added the `.menu--select` filter-dropdown variant (rows are `.check` labels, scrolls past 300px, optional Clear footer). Built for Packages US2 Packages List, promoted per rules §2.3 |
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
