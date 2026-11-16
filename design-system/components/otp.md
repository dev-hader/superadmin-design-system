---
id: otp
name: OTP Input
category: Forms
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.otp]
source-css: assets/css/components.css
source-demo: components.html
related: [input, auth-templates]
---

# OTP Input

## Purpose
Segmented one-time-code entry — one large box per digit for verification codes sent by SMS or email.

## Description
A `.otp` flex row of plain `<input maxlength="1">` boxes, each 48×56px with centered, title-size semibold digits. Border, surface and the primary focus ring match the standard `.input`, so it reads as one family. The stylesheet is presentation-only: focus-advance, paste-splitting and backspace behavior are page-level JS, not part of the component.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.otp` > n × `<input maxlength="1">` | The only variant; 6 boxes in the demos |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | 1px `--color-border-strong` border, `--radius-md` |
| Focus | `:focus` | `--color-primary` border + `--shadow-focus` ring on the focused box |
| Filled | value present | Digit at `--text-title` / `--weight-semibold` |

## Properties
| Property | How |
|---|---|
| Code length | Number of child inputs (demos use 6) |
| Label | Wrap in `.field` with `.field__label` ("Verification code") |
| Alignment | Flex container — e.g. `style="justify-content:center"` in the auth template |

## Responsive Behaviour
No intrinsic breakpoint changes. Six 48px boxes plus `--space-2` gaps fit comfortably inside the auth card at mobile widths.

## Accessibility
- Give the group a label: `.field__label` plus `aria-label` per box (e.g. "Digit 1 of 6"), since one visible label can't reference six inputs.
- Use `inputmode="numeric"` and `autocomplete="one-time-code"` on the boxes so mobile keyboards show digits and the OS can autofill the SMS code.
- If adding JS: advancing focus on input must not trap the user — Backspace on an empty box should move focus back, and paste should distribute across boxes.
- Each box keeps the standard focus ring; never remove it.

## Dependencies
Tokens: color (border-strong/surface/text/primary), radius-md, space-2, text-title, weight-semibold, shadow-focus. Behavior JS is per-page, not shipped with the CSS.

## Related Components
- [input.md](input.md) — a single `.input` is fine when the code is long or alphanumeric.
- [auth-templates.md](auth-templates.md) — the 2FA verification screen that hosts the centered OTP row.

## Usage Examples
- "Verification code" field on the design-system inputs page (6 boxes, partially filled).
- Centered OTP row in the two-factor verification auth template (`templates.js` auth flow).
- Product context: SMS gateway sends "Booking reminders and OTP codes" (Settings integrations), which this control receives.

## Do
- Keep it to short numeric codes (4–6 digits) — that's what per-digit boxes are good at.
- Wire `autocomplete="one-time-code"` so the code fills itself where the platform supports it.
- Pair with a "resend code" action in the surrounding template.

## Don't
- Don't use segmented boxes for long or alphanumeric secrets — use a single `.input`.
- Don't restyle box dimensions per screen; the 48×56 size is the system size.
- Don't block paste — pasting the whole code must work.

## HTML Reference
```html
<div class="field">
  <label class="field__label">Verification code</label>
  <div class="otp">
    <input maxlength="1" inputmode="numeric" autocomplete="one-time-code" aria-label="Digit 1 of 6">
    <input maxlength="1" inputmode="numeric" aria-label="Digit 2 of 6">
    <input maxlength="1" inputmode="numeric" aria-label="Digit 3 of 6">
    <input maxlength="1" inputmode="numeric" aria-label="Digit 4 of 6">
    <input maxlength="1" inputmode="numeric" aria-label="Digit 5 of 6">
    <input maxlength="1" inputmode="numeric" aria-label="Digit 6 of 6">
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `FORM CONTROLS` section, `/* OTP */` block.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
