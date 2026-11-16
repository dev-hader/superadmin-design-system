---
id: accordion
name: Accordion
category: Data
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.accordion, .accordion__item, .accordion__head, .accordion__body, .is-open]
source-css: assets/css/components.css
source-demo: components.html
related: [data-table, card, tabs]
---

# Accordion

## Purpose
Collapses a vertical list of question/answer or label/detail pairs — FAQs, policy sections — so users scan headings and expand only what they need.

## Description
A bordered, shadowed `.accordion` card whose `.accordion__item`s are separated by subtle top borders. Each item is a full-width `.accordion__head` button (semibold title + trailing 18px chevron) over a hidden `.accordion__body`. Adding `.is-open` to the **item** shows the body (`display: block`) and rotates the chevron 180° with an eased transition.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.accordion` | Any stacked expand/collapse list (FAQ, help, policy text) |

## States
| State | Trigger | Appearance |
|---|---|---|
| Collapsed | — | Head only, chevron down |
| Head hover | `:hover` | Title turns `--color-primary` |
| Open | `.is-open` on `.accordion__item` | Body visible, chevron rotated 180° |

## Properties
| Property | How |
|---|---|
| Initially open item | Render it with `.is-open` and `aria-expanded="true"` |
| Toggle behavior | Page JS toggles `.is-open` per item; items are independent (multiple can be open) |

## Responsive Behaviour
No media queries target `.accordion`. It is full-width block content and degrades naturally on narrow screens.

## Accessibility
- Heads are real `<button>`s — keyboard operable by default; keep `aria-expanded` in sync when toggling (the demo renders it).
- The body uses `display: none` when collapsed, so hidden content is out of the tab order and invisible to screen readers.
- The chevron is decorative; state is carried by `aria-expanded`, not the icon.

## Dependencies
Tokens: surface, border, radius, shadow, text, motion groups. Icon: `chevronDown`. No JS helper — pages toggle `.is-open` on the item.

## Related Components
- [data-table.md](data-table.md) — expandable *rows* do the same job inside a table.
- [tabs.md](tabs.md) — few, equally important views; the accordion suits many, skimmable sections.
- [card.md](card.md) — the accordion is itself a surface card; don't nest one inside a padded card.

## Usage Examples
- FAQ: "Can customers reschedule a session?" / "How do refunds work with Mada?" / "When do payouts arrive?" — first item open by default (Pickers & Advanced demo page).

## Do
- Keep head text to one line; put all detail in the body.
- Render the most useful item pre-opened when the list answers a common question.

## Don't
- Don't hide critical, always-needed information inside a collapsed item.
- Don't use it as navigation — expanding shouldn't change the page.

## HTML Reference
```html
<div class="accordion">
  <div class="accordion__item is-open">
    <button class="accordion__head" aria-expanded="true">
      Can customers reschedule a session?
      <!-- RD.icon("chevronDown") -->
    </button>
    <div class="accordion__body">
      Yes — up to 6 hours before the start time, from the app or the partner dashboard.
      The slot is instantly released back to availability.
    </div>
  </div>
  <div class="accordion__item">
    <button class="accordion__head" aria-expanded="false">
      How do refunds work with Mada?
      <!-- RD.icon("chevronDown") -->
    </button>
    <div class="accordion__body">
      Refunds are pushed back to the original Mada card within 3–5 business days.
    </div>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `RATING & ACCORDION` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
