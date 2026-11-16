---
id: segmented-control
name: Segmented control
category: Navigation
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.segmented, .is-active]
source-css: assets/css/components.css
source-demo: components.html
related: [tabs, button]
---

# Segmented control

## Purpose
A short, mutually-exclusive view-mode toggle — Day/Week/Month, List/Calendar — where exactly one option is always on.

## Description
An `inline-flex` group of plain `<button>`s inside a sunken, bordered `.segmented` track (3px inner padding, 2px gaps). The active segment pops forward as a raised surface chip (`--color-surface` background + `--shadow-xs`); inactive segments are flat secondary text. Unlike tabs it reads as one control, not a navigation row.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.segmented` | 2–4 short text options |
| Icon-only | `.segmented` with icon-only buttons + `aria-label` | The icons are unambiguous (grid vs list view) |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Flat, `--color-text-secondary` on sunken track |
| Active | `.is-active` on the button | Surface background, `--color-text`, `--shadow-xs` |

## Properties
| Property | How |
|---|---|
| Icon-only segments | 18px `RD.icon(...)` SVG as the button's only child, plus `aria-label` |
| Option count | Keep to 2–4; the control has no overflow behavior |

## Responsive Behaviour
No media queries target `.segmented`. It stays inline-sized; on narrow screens keep labels to one word or switch to the icon-only variant.

## Accessibility
- Segments are real `<button>`s; exactly one carries `.is-active` at all times.
- Icon-only segments **must** carry `aria-label` (the demo does: `aria-label="Grid view"`).
- Active state is conveyed by contrast + elevation; pair with `aria-pressed` or `aria-current` in page wiring if the context isn't obvious.

## Dependencies
Tokens: surface, border, text, radius, shadow, motion groups. No JS helper — pages toggle `.is-active`.

## Related Components
- [tabs.md](tabs.md) — per the live demo note: "Tabs for sibling views of the same record … segmented for a short, mutually-exclusive view-mode toggle, icon-only once the meaning is unambiguous."
- [button.md](button.md) — `.btn-group` looks similar but its buttons are independent actions, not one exclusive choice.

## Usage Examples
- Scheduling: `Day / Week / Month` range toggle (components.html, Tabs & segmented demo).
- Bookings: `List / Calendar` display-mode switch.
- Icon-only grid/list view toggle in dense toolbars.

## Do
- Reserve it for *how* one dataset is displayed, with one option always active.
- Go icon-only only once the meaning is unambiguous.

## Don't
- Don't use it for navigation between different records or pages — that's tabs.
- Don't exceed four segments or mix icon-only and text segments in one control.

## HTML Reference
```html
<div class="segmented">
  <button class="is-active">Day</button>
  <button>Week</button>
  <button>Month</button>
</div>

<!-- Icon-only (aria-label required) -->
<div class="segmented">
  <button class="is-active" aria-label="Grid view"><!-- RD.icon("layout") --></button>
  <button aria-label="List view"><!-- RD.icon("chart") --></button>
</div>
```

## CSS Reference
`assets/css/components.css` → `TABS / SEGMENTED / BREADCRUMB` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
