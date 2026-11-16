---
id: popover
name: Popover
category: Overlays
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.popover, .popover__title, .popover__body, .popover__foot, .is-open]
source-css: assets/css/components.css
source-demo: components.html
related: [tooltip, menu, modal, drawer]
---

# Popover

## Purpose
A small click-opened panel anchored to its trigger, holding a sentence or two of
explanation and — unlike a tooltip — the action that resolves it.

## Description
A raised, bordered panel (`--radius-md`, `--shadow-lg`) positioned `fixed` from its
trigger's bounding box, shown by adding `.is-open`. Three optional zones: a
`.popover__title` (icon + heading), a `.popover__body` of secondary-toned text, and a
`.popover__foot` of small buttons. It caps at 280px and shrinks on narrow viewports, so
it never becomes a modal in disguise. Like `menu`, it is positioned with fixed
coordinates rather than being nested in the card that triggered it.

## Variants
None — one shape. Width can be overridden inline for a denser filter panel.

## States
| State | Trigger | Appearance |
|---|---|---|
| Closed | — | `display: none` |
| Open | `.is-open` | Panel visible, anchored under the trigger |

## Properties
| Property | How |
|---|---|
| Anchor | Page JS sets `top` / `left` from `trigger.getBoundingClientRect()`, clamped into the viewport |
| Title | `.popover__title` — icon + short heading |
| Actions | `.popover__foot` — `.btn--sm`, the resolving action first |
| Reuse | One instance in the DOM, re-anchored and refilled per trigger |

## Responsive Behaviour
`min(280px, calc(100vw - var(--space-8)))` keeps it inside the viewport at every width, and
the anchoring JS clamps it 8px from either edge. Below roughly 360px it becomes an almost
full-width sheet under the trigger, which is the right shape at that size.

## Accessibility
- The panel is `role="dialog"` with `aria-labelledby` its title; the trigger carries
  `aria-haspopup="dialog"` and `aria-expanded`.
- Escape closes it and returns focus to the trigger; clicking outside closes it.
- Close it on `resize`/`scroll` rather than trying to re-anchor a stale position.
- It is **not** a tooltip: never put the only copy of essential information behind hover.
- Keep it out of the tab order while closed — `display: none` does that.

## Dependencies
Tokens: surface-raised, border, radius-md, shadow-lg, z-popover, text/spacing groups.
Positioning and open/close are page JS (the same fixed-coordinate approach as
`RD.positionMenu`).

## Related Components
- [tooltip.md](tooltip.md) — hover, text only, no actions. If the user needs to *do*
  something about it, it isn't a tooltip.
- [menu.md](menu.md) — a list of actions. If the content is prose, it isn't a menu.
- [modal.md](modal.md) — takes over the screen and blocks the page; use it when the
  decision is consequential (delete, discard) rather than explanatory.

## Usage Examples
- Packages list: the info icon on a **Rejected** row opens "Why this was rejected" with the
  Super Admin's reason and an **Edit & resubmit** button
  (`features/packages/us2-packages-list.html`).
- The same screen's **More** filters panel — checkbox groups plus a date range, with
  Apply / Clear these in the footer.

## Do
- Lead with the answer; the title should say what the panel is about, not "Info".
- Put the action that resolves the situation in the footer — that is the whole point.
- Reuse one instance and re-anchor it; don't render one popover per row.

## Don't
- Don't open it on hover.
- Don't nest form-heavy flows in it — that's a modal or a drawer.
- Don't leave it anchored to a scrolled-away trigger; close instead.

## HTML Reference
```html
<div class="popover" id="rejectPop" role="dialog" aria-labelledby="rejectPopTitle">
  <div class="popover__title" id="rejectPopTitle"><!-- RD.icon("warn") --> Why this was rejected</div>
  <div class="popover__body">The cover image shows a branded logo that isn't yours.
    Replace it and make sure the description matches the plans you listed.</div>
  <div class="popover__foot">
    <button class="btn btn--sm">Edit &amp; resubmit</button>
    <button class="btn btn--sm btn--ghost">Close</button>
  </div>
</div>

<script>
  // anchor it the same way menus are anchored
  const r = trigger.getBoundingClientRect();
  pop.style.position = "fixed";
  pop.style.top = r.bottom + 6 + "px";
  pop.style.left = Math.min(Math.max(8, r.left), innerWidth - pop.offsetWidth - 8) + "px";
  pop.classList.add("is-open");
</script>
```

## CSS Reference
`assets/css/components.css` → `LIST-SCREEN SET` section, block 5.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-08 | Initial build — composed for Packages US2 Packages List, promoted per rules §2.3 |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
