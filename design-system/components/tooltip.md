---
id: tooltip
name: Tooltip
category: Overlays
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.tooltip]
source-css: assets/css/components.css
source-demo: components.html
related: [button, menu]
---

# Tooltip

## Purpose
A small floating text label that clarifies a control on hover or focus — including the standard way to explain *why* a control is disabled.

## Description
A compact inverted-surface bubble (`--color-text` background, `--color-text-inverse` `--text-xs` medium text — dark bubble in light mode, light bubble in dark mode — 6×10px padding, `--radius-sm`, `--shadow-md`, `white-space: nowrap`) positioned near its trigger. The stylesheet provides the bubble itself; the demo wraps triggers in a `position: relative` container (`.tooltip-demo`) and shows the bubble on both hover and keyboard focus. Content is one short plain-text line — never markup, never interactive.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.tooltip` | Every tooltip — one look, one size |

## States
| State | Trigger | Appearance |
|---|---|---|
| Hidden | default | Not rendered / not visible |
| Visible | trigger `:hover` **and** `:focus-visible` | Dark bubble appears adjacent to the trigger |

## Properties
| Property | How |
|---|---|
| Positioning | Wrap the trigger in a relative container; the demo also shows a `position: static` inline flow variant |
| Disabled-control explanation | `title` + descriptive `aria-label` on the disabled control, tooltip text states the reason |

## Responsive Behaviour
`white-space: nowrap` keeps the bubble to one line; keep copy short so it fits small screens. Touch devices have no hover — which is exactly why a tooltip can never be the only place information lives.

## Accessibility
- Must show on **hover and keyboard focus** — never hover-only.
- Connect trigger and tip with `aria-describedby` pointing at the tooltip's `id`.
- **Never the only place required information lives** — tooltips are unreachable by touch and easy to miss; required info must exist as visible text or an accessible name too.
- For disabled controls, mirror the reason in `title` and `aria-label` (e.g. `aria-label="Export disabled - requires the Finance role"`).

## Dependencies
Tokens: `--color-text`/`--color-text-inverse` (inverted surface), `--radius-sm`, `--shadow-md`, type scale. Show/hide wiring (hover + focus handlers or CSS sibling rules) is page-level; the demo's `.tooltip-demo` wrapper lives in the same FEEDBACK section.

## Related Components
- [button.md](button.md) — disabled buttons explain themselves via tooltip + `title`/`aria-label`.
- [menu.md](menu.md) — if the content needs interaction or more than a line, it's a menu/popover, not a tooltip.

## Usage Examples
- "Refunds process in 3-5 days" on a refund info icon (`aria-describedby` on the icon button).
- "87% of capacity for this week" clarifying the Occupancy figure inline.
- Disabled **Export** button carrying `title="Requires the Finance role"`.

## Do
- Keep it to one short factual sentence.
- Attach to a focusable trigger so keyboard users get it too.
- Use it as the standard explanation for disabled controls.

## Don't
- Don't put links, buttons, or any interactive content inside a tooltip.
- Don't make it the only home of required information.
- Don't show on hover only — focus must trigger it as well.

## HTML Reference
```html
<!-- Icon trigger described by a tooltip -->
<button class="icon-btn" aria-label="Info" aria-describedby="tt1"><!-- RD.icon("info") --></button>
<span class="tooltip" id="tt1">Refunds process in 3-5 days</span>

<!-- Inline clarification -->
<span class="row gap-2 t-sm text-tertiary">Occupancy
  <span class="tooltip" style="position:static">87% of capacity for this week</span>
</span>

<!-- Explaining a disabled control -->
<button class="btn btn--ghost btn--sm" disabled title="Requires the Finance role"
        aria-label="Export disabled - requires the Finance role">Export</button>
```

## CSS Reference
`assets/css/components.css` → `FEEDBACK: alert / banner / toast / tooltip / progress / skeleton` section (`.tooltip` + `.tooltip-demo` block).

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
