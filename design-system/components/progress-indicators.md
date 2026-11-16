---
id: progress-indicators
name: Progress indicators
category: Feedback
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.progress, .progress__bar, .progress__bar--accent, .skeleton, .spinner]
source-css: assets/css/components.css
source-demo: components.html
related: [button, hold-timer, data-table]
---

# Progress indicators

## Purpose
Three ways to say "work is happening": a determinate bar (`.progress`), a shape-preserving loading placeholder (`.skeleton`), and an indeterminate spinner (`.spinner`).

## Description
The **progress bar** is an 8px full-radius track (`--color-surface-sunken`) whose `.progress__bar` fill is `--color-primary` and animates width changes (`--duration-slow`, `--ease-out`); `.progress__bar--accent` swaps the fill to `--color-accent`. The **skeleton** is a shimmer block — a three-stop gradient over sunken/border-subtle surfaces sweeping via the `hf-shimmer` keyframes (1.4s, infinite); size it per placeholder. The **spinner** is a 24px ring, `--color-border` with a `--color-primary` top arc, rotating via `hf-spin` (0.7s linear) — the same animation the button's `.is-loading` state uses.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Progress bar | `.progress` > `.progress__bar` | Progress toward a known total (campaign spend, quota) |
| Accent bar | `.progress__bar--accent` | Brand-accent fill for highlight metrics |
| Skeleton | `.skeleton` | Content of a known shape is loading (rows, cards, text lines) |
| Spinner | `.spinner` | Unknown-shape or short inline waits |

## States
| State | Trigger | Appearance |
|---|---|---|
| Bar value | inline `width: N%` on `.progress__bar` | Fill animates to the new width |
| Loading | element present | Skeleton shimmers / spinner rotates until replaced by content |
| Reduced motion | `prefers-reduced-motion: reduce` | `base.css` collapses all animation durations to ~0 |

## Properties
| Property | How |
|---|---|
| Bar value | `style="width: 64%"` (set/updated by JS) |
| Skeleton shape | Set `width`/`height` per placeholder; `--radius-sm` corners built in |
| Spinner size | Fixed 24px; the button loading spinner is its own 16px rule |

## Responsive Behaviour
All three are fluid: the bar fills its container, skeletons take whatever box you give them, the spinner is fixed-size. No breakpoint rules.

## Accessibility
- Give the bar `role="progressbar"` with `aria-valuenow/min/max`; the CSS is purely visual.
- Skeletons are decorative — `aria-hidden="true"`, and announce loading once on the region (`aria-busy="true"`).
- The spinner needs a text alternative ("Loading…") for screen readers; the ring itself is decorative.
- Reduced-motion users get near-static rendering via the global rule in `base.css`.

## Dependencies
Tokens: primary/accent, surface-sunken, border colors, `--radius-full/-sm`, `--duration-slow`, `--ease-out`. Keyframes `hf-spin` and `hf-shimmer` live at the end of the FEEDBACK section. JS sets bar widths (e.g. `data-pct` animation on the Marketing page).

## Related Components
- [button.md](button.md) — `.is-loading` reuses the spin animation inside the button.
- [hold-timer.md](hold-timer.md) — embeds a `.progress` bar for the slot-hold countdown.
- [data-table.md](data-table.md) — loading tables show skeleton rows.

## Usage Examples
- Campaign budget bars on Marketing (`.progress__bar` width driven by `data-pct`).
- The payment-result "Processing" card centers a `.spinner`.
- Skeleton rows while a table's data loads.

## Do
- Prefer a skeleton when you know the shape of what's coming — it reduces layout shift.
- Match skeleton count to a realistic result set (4 rows for a table that usually has 4).
- Animate bar width changes by setting the width and letting the built-in transition run.

## Don't
- Don't use a skeleton for genuinely unknown-shape content — use a spinner instead.
- Don't fake determinate progress; if the total is unknown, it's a spinner.
- Don't leave any indicator running after content arrives — replace it.

## HTML Reference
```html
<!-- Determinate bar -->
<div class="progress" role="progressbar" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100">
  <div class="progress__bar" style="width:64%"></div>
</div>

<!-- Skeleton placeholders (size per shape) -->
<div class="skeleton" style="width:100%;height:16px" aria-hidden="true"></div>
<div class="skeleton" style="width:60%;height:16px" aria-hidden="true"></div>

<!-- Indeterminate spinner -->
<span class="spinner"></span>
```

## CSS Reference
`assets/css/components.css` → `FEEDBACK: alert / banner / toast / tooltip / progress / skeleton` section (`.progress`, `.skeleton`, `.spinner` blocks + `hf-spin` / `hf-shimmer` keyframes). Reduced motion: `assets/css/base.css`.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
