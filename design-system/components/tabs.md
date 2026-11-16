---
id: tabs
name: Tabs
category: Navigation
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.tabs, .is-active]
source-css: assets/css/components.css
source-demo: components.html
related: [segmented-control, breadcrumb, pagination]
---

# Tabs

## Purpose
Switches between sibling views of the same record or page — Overview / Guests / Payments / Timeline on a booking — without navigating away.

## Description
A horizontal row of plain `<button>`s inside a `.tabs` container, sitting on a 1px bottom border. The active tab gets primary-colored text and a 2px primary underline (`border-bottom` pulled over the container rule with `margin-bottom: -1px`). Counts and disabled states travel with the label text; there is no separate count element.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.tabs` | Sibling views of one record/page |
| With counts | `.tabs` (count in the label text, e.g. `Upcoming (3)`) | The number helps the user pick a tab |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | `--color-text-secondary`, transparent underline |
| Hover | `:hover` | Text darkens to `--color-text` |
| Active | `.is-active` on the button | `--color-primary` text + 2px primary underline |
| Disabled | inline `opacity:.45; pointer-events:none` (no dedicated class exists) | Dimmed, non-interactive |

## Properties
| Property | How |
|---|---|
| Count in label | Plain text inside the button label, e.g. `Past (128)` |
| Disabled tab | Inline dimming as in the demo — the system defines no `.tabs`-specific disabled class |

## Responsive Behaviour
No media queries target `.tabs`. Keep tab sets short (3–5) so they fit a phone width; longer sets belong in a different navigation pattern.

## Accessibility
- Tabs are real `<button>`s — keyboard focusable and clickable by default.
- The demo relies on the visual underline for the active state; when wiring panels, add `role="tab"` / `aria-selected` semantics in page code (not provided by the CSS).
- A disabled tab is dimmed and inert (`pointer-events:none`); explain *why* elsewhere on the page since a non-focusable control can't carry a tooltip.

## Dependencies
Tokens: brand, border, text, motion groups. No JS helper — pages toggle `.is-active` themselves.

## Related Components
- [segmented-control.md](segmented-control.md) — short, mutually-exclusive *view-mode* toggle (Day/Week/Month); tabs are for sibling *content* views of the same record.
- [pagination.md](pagination.md) — moving through pages of one list, not between views.

## Usage Examples
- Booking detail: `Overview · Guests · Payments · Timeline` (components.html, Tabs demo).
- Bookings list: `Upcoming (3) · Past (128) · Drafts` with counts and a dimmed Drafts tab.

## Do
- Keep labels one or two words; put counts in parentheses inside the label.
- Use tabs when the views share one underlying record or list.

## Don't
- Don't use tabs as a view-mode toggle — that is the segmented control's job (demo note: "Tabs for sibling views of the same record … segmented for a short, mutually-exclusive view-mode toggle").
- Don't invent a pill/underline hybrid; `.tabs` is underline-only.

## HTML Reference
```html
<div class="tabs">
  <button class="is-active">Overview</button>
  <button>Guests</button>
  <button>Payments</button>
  <button>Timeline</button>
</div>

<!-- Counts + disabled treatment (from the live demo) -->
<div class="tabs">
  <button class="is-active">Upcoming (3)</button>
  <button>Past (128)</button>
  <button style="opacity:.45;pointer-events:none">Drafts</button>
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
