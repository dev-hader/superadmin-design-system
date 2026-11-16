---
id: rating
name: Rating
category: Identity
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.stars, .is-empty]
source-css: assets/css/components.css
source-demo: templates.html
related: [badge, card]
---

# Rating

## Purpose
Displays a star score — a venue's review average or a single review's rating — as a row of stars.

## Description
An inline flex row (`.stars`, 2px gap) of 20px star SVGs colored `--amber-500`. Filled stars use `fill="currentColor"`; empty stars carry `.is-empty`, which drops them to `--color-border-strong` (and they render outline-only via `fill="none"`). It is display-only — the system has no interactive star-input styles; scores come from data.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.stars` | Anywhere a 0–5 score is shown |

## States
| State | Trigger | Appearance |
|---|---|---|
| Filled star | plain child SVG | `--amber-500`, solid fill |
| Empty star | child SVG with `.is-empty` | `--color-border-strong`, outline only |

## Properties
| Property | How |
|---|---|
| Score | Render N filled + (5−N) empty star SVGs |
| Compact size | Demo pages override per-instance (inline `style` on the SVGs); the component size is 20px |

## Responsive Behaviour
None — `inline-flex` flows with the surrounding text at every breakpoint.

## Accessibility
- Always pair the stars with the numeric value as visible text ("4.8", "Display · 4.0") — the SVG row alone is not readable.
- Mark the star row `aria-hidden="true"` when the number is adjacent, or give the wrapper an `aria-label` like "4 of 5 stars".
- Amber-on-surface is decorative; meaning lives in the number and review count.

## Dependencies
Tokens: `--amber-500`, `--color-border-strong`. Star path SVGs are inlined by page scripts (see `assets/js/pages/templates.js`). No JS behavior.

## Related Components
- [badge.md](badge.md) — for non-score labels next to review counts.
- [card.md](card.md) — review summary blocks sit inside cards.

## Usage Examples
- Venue detail header: five compact stars + "**4.8** (214)" (templates page, venue template).
- Reviews summary block: `4.0` display rating (4 filled + 1 `.is-empty`) and the `4.8 · 214 reviews` aggregate.

## Do
- Show the numeric value with the stars, every time.
- Use whole-star rendering (filled vs `.is-empty`) — the system has no half-star treatment.
- Keep all five stars present so the scale is visible.

## Don't
- Don't build a clickable rating input out of `.stars` — no input styles exist; propose one through governance first.
- Don't recolor stars per page; amber is the rating color.
- Don't show stars without context (count of reviews or the number).

## HTML Reference
```html
<span class="stars">
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 17l-5.4 2.6 1-6L3.3 9.4l6-.9L12 3Z"/></svg>
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 17l-5.4 2.6 1-6L3.3 9.4l6-.9L12 3Z"/></svg>
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 17l-5.4 2.6 1-6L3.3 9.4l6-.9L12 3Z"/></svg>
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 17l-5.4 2.6 1-6L3.3 9.4l6-.9L12 3Z"/></svg>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" class="is-empty"><path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 17l-5.4 2.6 1-6L3.3 9.4l6-.9L12 3Z"/></svg>
</span>
<span class="t-xs text-tertiary">Display · 4.0</span>
```

## CSS Reference
`assets/css/components.css` → `RATING & ACCORDION` section (`.stars` block).

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
