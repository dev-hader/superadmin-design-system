---
id: plan-card
name: Plan & bundle card
category: Booking
status: stable
version: 1.1.0
owner: Design System Maintainer
css-classes: [.plan, .plan--popular, .plan__badge, .plan__name, .plan__desc, .plan__price, .plan__features, .plan__foot]
source-css: assets/css/components.css
source-demo: index.html#/pricing (design-system spec site)
related: [card, badge, button, progress-indicators]
---

# Plan & bundle card

## Purpose
Pricing card for subscription plans and prepaid session bundles, with one primary-highlighted "most popular" option.

## Description
`.plan` is a compact (`--space-5`, `--radius-lg`) surface card that gains `--shadow-md` on hover. Its anatomy is an uppercase caption `.plan__name` (+ optional `.plan__desc`), a `.plan__price` (H3-scale bold number beside a tertiary unit), a flexible `.plan__features` checklist (15px primary-ink checks, dashed dividers), and a `.plan__foot` meta row (border-top; e.g. member count beside an Edit action) that `margin-top:auto` pins to the bottom. `.plan--popular` adds a primary ring and the floating `.plan__badge` pill (primary fill, near-black text) overhanging the top edge.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.plan` | Any plan or session bundle |
| Popular | `.plan plan--popular` (+ `.plan__badge`) | Exactly one recommended plan per grid |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | 1px border, surface background |
| Hover | `:hover` | `translateY(-4px)` + `--shadow-lg` |
| Popular | `.plan--popular` | `--color-primary` border + 1px primary ring |

## Properties
| Property | How |
|---|---|
| Badge | `.plan__badge` absolutely positioned at `top: -12px`, inline-end aligned |
| Price anchor | `.plan__price > b` at `--text-h2`; `span` for "/month" or a struck-through anchor price |
| Features | `.plan__features > li` rows, each with a leading accent `svg` check; `flex: 1` pushes the CTA to the bottom |
| Equal heights | Place cards in `.grid.grid-3` with `align-items: stretch` |

## Responsive Behaviour
No media queries of its own — the parent grid controls column count; the card stretches to fill its cell.

## Accessibility
- The popular badge is text, not color alone.
- Each CTA should name its plan ("Choose Growth"), not just "Select", for screen readers.
- A struck-through anchor price needs an accessible alternative (e.g. "was SAR 1,800").

## Dependencies
Tokens: brand (primary fill + ink), surface/border, radius, shadow, motion groups. Composes `.btn` (`--block`, any variant), `.badge`, and `.progress` (bundle usage meter). No JS.

## Related Components
- [card.md](card.md) — generic content card; use `.plan` only when presenting a purchasable tier.
- [badge.md](badge.md) — "Save 15%" style savings badges inside bundle cards.
- [button.md](button.md) — the CTA; the popular plan takes the primary/accent button.
- [progress-indicators.md](progress-indicators.md) — accent progress bar for "6 of 10 sessions used".

## Usage Examples
- Pricing page (spec site): three plans in `.grid.grid-3` behind a Monthly/Yearly `.segmented` toggle; the middle plan is `.plan--popular` with a "Most popular" badge.
- Session bundles: "10 × Padel — Court A" `.plan` with a `badge--success` saving, struck-through anchor price, usage `.progress` bar and "Book next session" `.btn--accent`.

## Do
- Highlight exactly one card per grid with `.plan--popular` — the plan most partners should pick.
- Keep `.plan__features` items short; the icon is the bullet.

## Don't
- Don't put two accent-bordered cards side by side — one recommendation, never two.
- Don't move the price out of `.plan__price`; it is the visual anchor at H2 scale.

## HTML Reference
```html
<div class="grid grid-3" style="align-items:stretch">
  <div class="plan plan--popular">
    <span class="plan__badge">Most popular</span>
    <div>
      <div class="plan__name">Growth</div>
      <div class="plan__desc">For venues running daily sessions.</div>
    </div>
    <div class="plan__price"><b>SAR 499</b><span>/month</span></div>
    <ul class="plan__features">
      <li><!-- check icon -->Unlimited bookings</li>
      <li><!-- check icon -->Priority slot holds</li>
    </ul>
    <button class="btn btn--block">Choose Growth</button>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `PLAN & BUNDLE CARDS` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.1.0 | 2026-07-19 | Density redesign: compact scale, checklist dividers, new .plan__foot, popular ring moved accent→primary |
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
