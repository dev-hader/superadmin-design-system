---
id: hold-timer
name: Booking hold timer
category: Booking
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.hold-timer]
source-css: assets/css/components.css
source-demo: index.html#/booking-widgets (design-system spec site)
related: [time-slots, pay-tile, progress-indicators, alert]
---

# Booking hold timer

## Purpose
Countdown banner telling the guest their selected slot is temporarily reserved and checkout must finish before it expires.

## Description
`.hold-timer` is a single flex row on the warning palette (`--color-warning-subtle` fill, `--color-warning-border` border, `--radius-md`): an 18px warning-colored SVG icon, a message whose countdown value sits in a monospace `<b>`, and optionally a flexible `.progress` bar (`flex: 1; min-width: 80px`) showing time remaining. It uses warning — not danger — styling because it is a nudge, not an error.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.hold-timer` | The only form — with or without the trailing `.progress` |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Warning-subtle banner; the countdown text updates via JS |

The component itself has no modifier states; expiry is handled by the flow (slot released back to availability), not by a class.

## Properties
| Property | How |
|---|---|
| Countdown | `<b>` inside the message — `--font-mono` keeps digits from jittering |
| Progress | Optional `.progress` element as the last child, fills remaining row width |
| Width | Block-level; constrain with a max-width wrapper (demo uses 380px) |

## Responsive Behaviour
No media queries — the flex row compresses naturally; the `.progress` keeps an 80px minimum.

## Accessibility
- Update the visible timer at most once per second and expose the deadline via `aria-live="polite"` — never announce every tick (per the spec-site demo notes).
- The icon is decorative; the message carries the meaning.
- Warning palette contrast is token-governed for both themes.

## Dependencies
Tokens: warning group (`--color-warning`, `--color-warning-subtle`, `--color-warning-border`), `--font-mono`, `--radius-md`. Embeds the `.progress` component. Countdown logic is page JS — no shared helper.

## Related Components
- [time-slots.md](time-slots.md) — the hold starts the moment a slot is selected there.
- [pay-tile.md](pay-tile.md) — the step the timer is pressuring the guest to complete.
- [progress-indicators.md](progress-indicators.md) — the embedded `.progress` bar.
- [alert.md](alert.md) — use an alert, not a hold-timer, for non-time-boxed warnings.

## Usage Examples
- Checkout: "Court held for **09:42** — complete checkout to keep this slot" above the payment step.
- Start the countdown when a slot is selected; on expiry release the hold back to availability automatically.

## Do
- Keep the message specific about what is held ("Court held for…", "Lane held for…").
- Release expired holds automatically and return the guest to the slot picker gracefully.

## Don't
- Don't restyle it with the danger palette — this is a nudge, not an error.
- Don't hide the timer during later checkout steps; it should stay visible until payment completes.

## HTML Reference
```html
<div class="hold-timer" style="max-width:380px">
  <!-- RD.icon("warn") -->
  <span class="t-sm">Court held for <b>09:42</b> - complete checkout to keep this slot</span>
</div>

<!-- With a progress bar -->
<div class="hold-timer">
  <!-- RD.icon("warn") -->
  <span class="t-sm">Held for <b>09:42</b></span>
  <div class="progress"><div class="progress__bar" style="width:65%"></div></div>
</div>
```

## CSS Reference
`assets/css/components.css` → `BOOKING WIDGETS - party stepper, seat map, payment, hold timer, e-ticket` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
