---
id: badge
name: Badge
category: Identity
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.badge, .badge--primary, .badge--success, .badge--warning, .badge--danger, .badge--info]
source-css: assets/css/components.css
source-demo: components.html
related: [status-badge, chip, avatar]
---

# Badge

## Purpose
A small, non-interactive label for a state or count — "Paid", "Overdue", "New" — attached to another element.

## Description
A 22px pill (`--radius-full`, `--text-xs`, semibold) that defaults to a neutral bordered look and re-tints via five tone modifiers, each swapping to a `*-subtle` background with a transparent border. Supports an optional leading dot (`.dot`, 6px, `currentColor`) or an 11px inline SVG icon. Purely presentational — it never receives focus or clicks.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Neutral | `.badge` | Counts and labels with no judgement ("12 items") |
| Primary | `.badge badge--primary` | Brand-tinted emphasis, e.g. "New" feature markers |
| Success | `.badge badge--success` | Positive state — "Paid", "Active" |
| Warning | `.badge badge--warning` | Needs attention — "Pending" |
| Danger | `.badge badge--danger` | Problem state — "Overdue" |
| Info | `.badge badge--info` | Informational — "New" |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Tone background + tone text; neutral gets a `--color-border` outline |
| — | — | No hover/focus/active states — badges are static |

## Properties
| Property | How |
|---|---|
| Leading dot | Child `<span class="dot"></span>` (6px, inherits text color) |
| Icon | Inline 11px SVG before the label |

## Responsive Behaviour
None — fixed 22px height at every breakpoint. In stacked mobile tables it renders inside the label/value row like any other cell content.

## Accessibility
- Color alone never carries the meaning — the label text does; the dot inherits `currentColor` and is decorative.
- Static element: no role, no tab stop. If a badge conveys a count for a control, put the accessible text on the control.
- Tone pairs (`*-subtle` background + tone foreground) come from the semantic palette and meet contrast in both themes.

## Dependencies
Tokens: semantic status colors (`--color-success/-warning/-danger/-info/-primary` + their `-subtle` backgrounds), `--radius-full`, type scale. No JS.

## Related Components
- [status-badge.md](status-badge.md) — use for the eight booking lifecycle states instead of hand-picking badge tones.
- [chip.md](chip.md) — interactive; use when the user can remove or toggle the label.
- [avatar.md](avatar.md) — badges often annotate an avatar+name pair.

## Usage Examples
- Payment column in tables: `badge--success` "Paid" / `badge--warning` "Pending" / `badge--danger` "Overdue".
- Membership status in the expandable table demo: `badge--success` "Active" vs `badge--warning` with a `.dot`.
- Neutral count badges beside tab labels.

## Do
- Keep labels to one or two words.
- Pick the tone by meaning (success = money in, danger = overdue), consistently across pages.
- Use the `.dot` when a hint of "liveness" helps a scanning eye.

## Don't
- Don't make badges clickable — reach for a chip or button.
- Don't use a badge for booking lifecycle states — that's the status badge with its dedicated 8-value palette.
- Don't invent new tones; only the five documented modifiers exist.

## HTML Reference
```html
<span class="badge">Neutral</span>
<span class="badge badge--primary">Primary</span>
<span class="badge badge--success">Paid</span>
<span class="badge badge--warning">Pending</span>
<span class="badge badge--danger">Overdue</span>
<span class="badge badge--info">New</span>
<span class="badge badge--success"><span class="dot"></span>Active</span>
```

## CSS Reference
`assets/css/components.css` → `BADGES / TAGS / CHIPS / AVATAR` section (`.badge` block at the top of it).

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
