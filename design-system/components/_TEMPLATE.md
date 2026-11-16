---
id: <kebab-case-id>            # unique, stable — never changes after creation
name: <Human Name>
category: Forms | Identity | Navigation | Overlays | Feedback | Data | Booking | Layout
status: proposed | in-review | approved | stable | deprecated
version: 1.0.0
owner: Design System Maintainer
css-classes: [.example, .example--variant]
source-css: assets/css/components.css   # where the styles actually live — never duplicated here
source-demo: components.html               # live, interactive reference
related: [other-component-id]
---

# <Component Name>

## Purpose
One sentence: the job this component does and when to reach for it.

## Description
2–4 sentences: how it behaves, what it is made of, where it appears in the product.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.example` | … |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | … |
| Hover / Focus / Active / Disabled / Loading / Error | … | … |

## Properties
Configurable aspects (size, icon slot, block width, counts…), each with its class or attribute.

## Responsive Behaviour
What changes at ≤1024px (tablet) and ≤768px (mobile). Reference the actual media queries.

## Accessibility
Required roles/ARIA, keyboard behaviour, focus handling, contrast notes, reduced-motion notes.

## Dependencies
Tokens groups used; JS helpers (e.g. `RD.portalMenu`); other components it embeds.

## Related Components
Links, with one line on when to choose each instead.

## Usage Examples
Real product situations (from the demo pages), not abstract ones.

## Do
- …

## Don't
- …

## HTML Reference
```html
<!-- Copy-paste-ready markup using ONLY existing classes -->
```

## CSS Reference
`assets/css/components.css` → section name / line range. **Never copy CSS into a proposal — link the stylesheet.**

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
