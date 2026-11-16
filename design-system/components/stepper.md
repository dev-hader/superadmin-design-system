---
id: stepper
name: Stepper / wizard
category: Navigation
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.stepper, .stepper--vertical, .step, .step__dot, .step__label, .is-done, .is-active, .wiz, .wiz__head, .wiz__body, .wiz__panel, .wiz__foot]
source-css: assets/css/components.css
source-demo: components.html
related: [pagination, modal, progress-indicators]
---

# Stepper / wizard

## Purpose
Shows progress through an ordered multi-step flow — checkout, onboarding, a booking's lifecycle — and (via `.wiz`) frames the form panels of that flow.

## Description
`.stepper` lays `.step` items in an equal-width flex row; each step is a 32px `.step__dot` (number, or check icon once done) over a `.step__label`, joined by 2px connector lines drawn with `::before`. Done steps fill the dot primary; the active step gets a primary ring (`box-shadow: 0 0 0 4px var(--color-primary-subtle)`) and a primary, semibold label. `.stepper--vertical` stacks the same steps top-to-bottom with a vertical connector (`::after`), dots left of labels. `.wiz` is the companion form-wizard card: head, panel body (`.wiz__panel.is-active` shows one panel at a time with a fade-up), and a sunken footer for Back/Next.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Horizontal (default) | `.stepper` | A wizard that fits comfortably across the screen width (checkout, onboarding) |
| Vertical | `.stepper stepper--vertical` | A narrow column or sidebar — e.g. a booking's lifecycle beside its detail; add a timestamp under the label to make it an activity log |
| Compact (no labels) | `.stepper` with `.step__dot` only, no `.step__label` | A toolbar or card header where space is tight — numbers/checks only |
| Form wizard | `.wiz` (+ a `.stepper` in `.wiz__head`) | Multi-step sign-up / form flow in one card |

## States
| State | Trigger | Appearance |
|---|---|---|
| Upcoming | — | Outlined dot, tertiary number, grey connector |
| Done | `.is-done` on `.step` | Primary-filled dot with check icon, primary connector, `cursor: pointer` (done steps are revisitable) |
| Active | `.is-active` on `.step` | Primary border + primary number, 4px subtle ring, primary semibold label |

## Properties
| Property | How |
|---|---|
| Dot content | Step number, or `RD.icon("check")` when done |
| Label | Optional `.step__label`; omit entirely for the compact variant |
| Sub-line | Extra `<span class="t-xs text-tertiary">` under the label (vertical demo's timestamps) |
| Panel switching | `.wiz__panel.is-active` — exactly one visible, animated by `hf-fade-up` |

## Responsive Behaviour
No media queries target `.stepper` or `.wiz`. Guidance from the demos: horizontal is the default where width allows; switch to `.stepper--vertical` for narrow columns rather than letting labels collide.

## Accessibility
- Steps are `<div>`s in the demos; interactive "go back" behavior on `.is-done` steps must be wired in page code with real buttons/handlers.
- Connector color alone doesn't convey state — the dot's fill/number/check does; keep both.
- `.wiz__panel` swaps use `display: none`, so hidden panels are correctly removed from tab order.

## Dependencies
Tokens: brand, border, radius, shadow, motion groups. Icons: `check`. Keyframe `hf-fade-up` (components.css `KEYFRAMES`) for wizard panels. No JS helper — pages toggle `.is-done` / `.is-active`.

## Related Components
- [pagination.md](pagination.md) — pages of a list, not ordered stages.
- [progress-indicators.md](progress-indicators.md) — a `.progress` bar shows continuous completion, a stepper shows named stages.
- [modal.md](modal.md) — short 1–2 field flows fit a form modal; three or more stages earn a `.wiz`.

## Usage Examples
- Booking checkout: `Details · Schedule · Payment · Confirm` horizontal stepper.
- Compact `Cart · Details · Payment` dots-only row in a card header.
- Vertical order tracking: `Order placed → Preparing → On the way → Delivered` with timestamps.

## Do
- Mark every completed step `.is-done` and exactly one step `.is-active`.
- Use vertical + timestamps when the stepper narrates a record's lifecycle.

## Don't
- Don't skip the check icon on done dots — the number alone reads as "not started".
- Don't cram a labeled horizontal stepper into a sidebar; use `.stepper--vertical` or the compact variant.

## HTML Reference
```html
<!-- Horizontal (checkout) -->
<div class="stepper">
  <div class="step is-done"><span class="step__dot"><!-- RD.icon("check") --></span><span class="step__label">Details</span></div>
  <div class="step is-done"><span class="step__dot"><!-- RD.icon("check") --></span><span class="step__label">Schedule</span></div>
  <div class="step is-active"><span class="step__dot">3</span><span class="step__label">Payment</span></div>
  <div class="step"><span class="step__dot">4</span><span class="step__label">Confirm</span></div>
</div>

<!-- Compact: dots only, no labels -->
<div class="stepper" style="max-width:480px">
  <div class="step is-done"><span class="step__dot"><!-- check --></span></div>
  <div class="step"><span class="step__dot">2</span></div>
  <div class="step"><span class="step__dot">3</span></div>
</div>

<!-- Vertical lifecycle with timestamp sub-line -->
<div class="stepper stepper--vertical">
  <div class="step is-done"><span class="step__dot"><!-- check --></span>
    <span><span class="step__label" style="display:block">Order placed</span><span class="t-xs text-tertiary">Jul 9, 6:02 PM</span></span></div>
  <div class="step is-active"><span class="step__dot">2</span><span class="step__label">On the way</span></div>
  <div class="step"><span class="step__dot">3</span><span class="step__label">Delivered</span></div>
</div>

<!-- Form wizard frame -->
<div class="wiz">
  <div class="wiz__head"><!-- .stepper here --></div>
  <div class="wiz__body">
    <div class="wiz__panel is-active"><!-- current step's fields --></div>
    <div class="wiz__panel"><!-- next step --></div>
  </div>
  <div class="wiz__foot"><button class="btn btn--ghost">Back</button><span class="grow"></span><button class="btn">Continue</button></div>
</div>
```

## CSS Reference
`assets/css/components.css` → `STEPPER` section (includes the vertical-orientation comment and the `.wiz` form-wizard block).

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
