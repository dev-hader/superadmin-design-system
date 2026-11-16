---
id: drawer
name: Drawer & bottom sheet
category: Overlays
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.drawer, .drawer--right, .drawer__head, .drawer__body, .drawer__foot, .sheet, .sheet__handle, .drawer-live, .drawer-backdrop, .drawer-body-row, .is-open, .drawer-live--wide, .drawer-live--xl]
source-css: assets/css/components.css
source-demo: components.html
related: [modal, data-table, menu]
---

# Drawer & bottom sheet

## Purpose
A side panel for filters, side tasks and record details that shouldn't hide the page underneath — "the modal's calmer sibling" (demo note). The bottom sheet is its mobile equivalent.

## Description
Three implementations share the head/body/foot anatomy:
1. **Static drawer** — `.drawer.drawer--right` absolutely positioned inside a container, `width: 78%`/`max-width: 300px`, for in-page panels like a filter rail (demo shows it inside a `.drawer-stage`).
2. **Bottom sheet** — `.sheet` pinned to the container bottom with rounded top corners and a `.sheet__handle` grab bar; the demo marks it `sheet sheet--bottom` (the styling all comes from `.sheet`).
3. **Live record-detail drawer** — shell-level `.drawer-live` + `.drawer-backdrop`, fixed to the viewport's inline-end at 380px (`max-width: 92vw`), slides in with a transform transition above `var(--z-modal)`. Created and reused on every page by `RD.openDrawer` in `assets/shell.js`.

## Variants
| Variant | Class | Use when |
|---|---|---|
| In-page right drawer | `.drawer drawer--right` | Filters/side tasks scoped to a region of the page |
| Bottom sheet | `.sheet` (demo: `sheet sheet--bottom`) | Mobile quick actions sliding from the bottom |
| Live record drawer | `.drawer-live` + `.drawer-backdrop` (shell.css) | Viewing one record's details from any list page |
| Wide live drawer | `.drawer-live drawer-live--wide` | 560px instead of 380px — the live drawer sized for a **form** rather than a summary list (Add/Edit opened beside the list it belongs to) |

## States
| State | Trigger | Appearance |
|---|---|---|
| Closed (live) | — | `transform: translateX(105%)` off-canvas; backdrop `opacity: 0`, `pointer-events: none` |
| Open (live) | `.is-open` on both elements | Drawer slides to `transform: none`; backdrop fades in |

## Properties — `RD.openDrawer(title, rows, footButtons)`
| Argument | Meaning |
|---|---|
| `title` | Text for `.drawer__head` (a close icon-btn with `data-drawer-close` is added automatically) |
| `rows` | Array of `[label, value]` pairs, each rendered as a `.drawer-body-row` (label tertiary/start, value medium-weight/end) |
| `footButtons` | Optional HTML for `.drawer__foot`; defaults to a ghost Close button |

Closing: backdrop click, `Escape`, or any `[data-drawer-close]` element — all wired once by the helper.

## Responsive Behaviour
The live drawer's `max-width: 92vw` keeps a sliver of page visible on phones. **RTL:** the off-canvas transform flips — `[dir="rtl"] .drawer-live { transform: translateX(-105%); }` (shell.css) — so the drawer slides from the correct side in Arabic; positioning uses logical properties (`inset-inline-end`).

## Accessibility
- The generated close button carries `aria-label="Close"`; `Escape` always closes the live drawer.
- The live drawer is an `<aside id="rdDrawer">`; only one instance ever exists (the helper reuses it).
- The static `.drawer__body` scrolls (`overflow-y: auto`) so footer actions stay reachable.

## Dependencies
Tokens: surface, border, overlay, shadow, z-index, motion groups. JS: `RD.openDrawer` (shell.js). Shell CSS: `.drawer-live`, `.drawer-backdrop`, `.drawer-body-row` under "Shared page-composition helpers".

## Live drawer widths

| Class | Width | For |
|---|---|---|
| `.drawer-live` | 380px | a label/value summary of one record |
| `.drawer-live--wide` | 560px | a form |
| `.drawer-live--xl` | 60vw, max 62rem | a small page — tabs, a table inside it |

`--xl` drops to full width below 768px: 60% of a phone is a sliver, not a panel.

**All three live in `shell.css`, beside `.drawer-live` itself** — not in
`components.css`. `shell.css` is linked *after* `components.css`, so a width modifier
written there would lose to the base rule on equal specificity.

## Related Components
- [detail-list](detail-list.md) — `.drawer-body-row` is that component's row, scoped to `RD.openDrawer`. Outside a drawer, use `.detail-row`.
- [modal.md](modal.md) — use a modal when the task must interrupt; a drawer when the page should stay visible.
- [data-table.md](data-table.md) — row click / kebab "view" actions open the live drawer.
- [menu.md](menu.md) — the bottom sheet plays the menu's role on touch screens.

## Usage Examples
- Filters drawer: activity-type chips + "Available today only" check, Clear / Apply filters footer (components.html).
- Mobile quick actions sheet: Check in guest / Message guest / Cancel booking.
- Any list page: `RD.openDrawer("Booking HF-24810", [["Guest","Sara A."], ["Court","Padel B"]], ...)`.

## Do
- Feed the live drawer label/value pairs — `.drawer-body-row` handles the two-column layout.
- Keep the primary action in `.drawer__foot`, not buried in the body.

## Don't
- Don't rebuild a bespoke record panel per page — `RD.openDrawer` exists so every page shares one.
- Don't hard-code `left`/`right` offsets; the drawer relies on logical properties + the RTL transform override.

## HTML Reference
```html
<!-- Static in-page drawer (filters) -->
<div class="drawer drawer--right">
  <div class="drawer__head"><b>Filters</b>
    <button class="icon-btn" style="width:32px;height:32px" aria-label="Close"><!-- close --></button></div>
  <div class="drawer__body">
    <div class="field"><label class="field__label">Activity type</label>
      <div class="row wrap gap-2"><span class="chip chip--select is-active">Padel</span><span class="chip chip--select">Bowling</span></div></div>
    <label class="check"><input type="checkbox" checked><span class="check__box"><!-- check --></span> Available today only</label>
  </div>
  <div class="drawer__foot"><button class="btn btn--ghost">Clear</button><button class="btn">Apply filters</button></div>
</div>

<!-- Bottom sheet -->
<div class="sheet sheet--bottom">
  <div class="sheet__handle"></div>
  <b class="t-sm">Quick actions</b>
  <!-- action buttons -->
</div>

<!-- Live record drawer: no markup to write — call the shell helper -->
<script>
  RD.openDrawer("Booking HF-24810",
    [["Guest", "Sara A."], ["Court", "Padel B"], ["Amount", "SAR 180"]],
    '<button class="btn btn--danger" data-drawer-close>Cancel booking</button>');
</script>
```

## CSS Reference
`assets/css/components.css` → `DRAWER & BOTTOM SHEET` section (static drawer + sheet). Live drawer: `assets/shell.css` → "Shared page-composition helpers" (`.drawer-backdrop`, `.drawer-live`, `.drawer-body-row`).

## Version
| Version | Date | Change |
|---|---|---|
| 1.1.0 | 2026-09-08 | Added `.drawer-live--wide` (560px form-sized live drawer). Built for Packages US3 Package Policies, promoted per rules §2.3 |
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
