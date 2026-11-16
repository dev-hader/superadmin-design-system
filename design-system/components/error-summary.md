---
id: error-summary
name: Error summary
category: Feedback
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.form-errors, .form-errors__title]
source-css: assets/css/components.css
source-demo: components.html
related: [input, alert, toast]
---

# Error summary

## Purpose
Form-level validation reporting for long forms: one block at the top of the form that
names every invalid field and links to it. The keyboard/screen-reader path through a
failed submit. Timing and rules: [`../patterns/form-validation.md`](../patterns/form-validation.md).

## Description
A danger-tinted card with a thick inline-start border (logical — mirrors in RTL):
`.form-errors__title` (warn icon + "Fix N issues to continue") over a plain list of
anchor links, one per invalid field, each `href="#field-id"`. Rendered on failed
submit when ≥ 3 fields are invalid or invalid fields sit off-screen; removed once all
listed errors resolve.

## Variants
None — one shape. (Request-level failures use `toast`; single-field failures use
`.field__error` alone.)

## States
| State | Trigger | Appearance |
|---|---|---|
| Visible | failed submit | danger border + subtle bg, focus moves to the block |
| Resolving | user fixes fields | re-render with the remaining links |
| Gone | zero invalid fields | block removed from the DOM |

## Responsive Behaviour
Full form width at every breakpoint; links wrap. Nothing special ≤ 768.

## Accessibility
- `role="alert"` + `aria-labelledby` the title; the block receives focus on render.
- Links focus their field (`tabindex="-1"` on the target wrapper when the input itself
  isn't the anchor).
- Title states the count — "Fix 4 issues to continue" — so the scale is announced.

## Dependencies
Danger tokens, radius, `input`'s `.is-error` styling on the linked fields.

## Related Components
- [input.md](input.md) — the field-level half of the contract.
- [alert.md](alert.md) — visual cousin; alert is informational, this one is navigational.
- [toast.md](toast.md) — request-level failures only, never field errors.

## Usage Examples
- Business settings (long form): submit with 4 empty required fields.
- Booking wizard step with multiple invalid inputs off-screen on mobile.

## Do
- Write each link as the fix: "Enter a branch name" — not "Branch name: invalid".
- Keep link order = field order in the form.

## Don't
- Don't render it for one visible invalid field — the inline error is enough.
- Don't leave it stale: re-render on every fix.

## HTML Reference
```html
<div class="form-errors" role="alert" aria-labelledby="feTitle" tabindex="-1">
  <div class="form-errors__title" id="feTitle"><!-- RD.icon("warn") --> Fix 3 issues to continue</div>
  <ul>
    <li><a href="#branch-name">Enter a branch name</a></li>
    <li><a href="#open-time">Set an opening time</a></li>
    <li><a href="#vat-number">VAT number must be 15 digits</a></li>
  </ul>
</div>
```

## CSS Reference
`assets/css/components.css` → `ERROR SUMMARY` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-20 | Initial build — form-validation P0 item (06-gap-analysis-roadmap.md) |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
