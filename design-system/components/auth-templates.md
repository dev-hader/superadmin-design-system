---
id: auth-templates
name: Auth templates
category: Layout
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.auth-frame, .auth-brand, .auth-form, .auth-card, .divider-or]
source-css: assets/css/components.css
source-demo: templates.html
related: [input, otp, button, checkbox-radio]
---

# Auth templates

## Purpose
The layout shells for every unauthenticated screen — login, registration, verification and password recovery.

## Description
Two shells share one visual language. `.auth-frame` is the split layout: a `--radius-xl`, `--shadow-lg` card whose left `.auth-brand` panel carries the brand ink gradient (`--ink-raised` → `--ink-canvas`) with a subtle lime radial glow (`::before`) and light marketing copy, beside a 400px `.auth-form` column of fields. `.auth-card` is the standalone centered shell (max-width 400px, same radius/shadow) for single-purpose screens. `.divider-or` renders the "or continue with" rule between primary sign-in and social buttons.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Split layout | `.auth-frame` > `.auth-brand` + `.auth-form` | Primary login — brand story beside the form |
| Centered card | `.auth-card` | Register, verify email, recovery — one task, no marketing panel |
| Divider | `.divider-or` | Between the primary button and social/alternate sign-in options |

## States
No interactive states of its own — inputs, buttons and checks inside carry their own states.

## Properties
| Property | How |
|---|---|
| Brand panel copy | `.auth-brand h3` (H3 bold) + `.auth-brand p` (75%-white small text) |
| Form column | `.auth-form` — fixed 400px, `--space-10`/`--space-8` padding, vertically centered `--space-4` stack |
| Card width | `.auth-card` — `max-width: 400px`; override with inline style when placed in a grid |
| Divider label | Text content of `.divider-or` ("or continue with") between two flex rules |

## Responsive Behaviour
`@media (max-width: 860px)` stacks `.auth-frame` into a column and lets `.auth-form` go full width — the brand panel becomes a header band above the form.

## Accessibility
- Wrap fields in `.field` with real `<label class="field__label">`s; the shells impose no form semantics of their own.
- The brand panel is decorative marketing — keep essential instructions in the form column.
- The brand panel is fixed ink-scale (dark) in both themes — its light text and lime glow never change with the theme.

## Dependencies
Tokens: ink scale (brand gradient), lime glow, surface/border, `--radius-xl`, `--shadow-lg`, spacing. Composes `.field`/`.input`, `.btn` (`--block` for the submit), `.check`, `.otp` — no JS.

## Related Components
- [input.md](input.md) — the email/password fields inside `.auth-form`.
- [otp.md](otp.md) — 6-digit code entry inside the verify-email `.auth-card`.
- [button.md](button.md) — full-width submit plus `.btn--secondary` social buttons around `.divider-or`.
- [checkbox-radio.md](checkbox-radio.md) — "Remember me" / terms agreement rows.

## Usage Examples
How `templates.html` composes the login template: an `.auth-frame` (max-width 640px) whose `.auth-brand` holds the logo mark, "Run your venue from one place" heading and a subline, and whose `.auth-form` stacks two `.field`s (Email, Password), a full-width `.btn` "Sign in" and a "Forgot your password?" footnote. The spec site adds the fuller variants: split login with `.divider-or` + Google/Apple `.btn--secondary` pair, and a `.grid.grid-2` of `.auth-card`s for "Create your account" and "Verify your email" (OTP).

## Do
- Use `.auth-frame` for the main login and `.auth-card` for every secondary auth task.
- Keep the form to the essentials — two fields and one primary action for login.

## Don't
- Don't put two primary buttons in one auth form; social options are `.btn--secondary` below `.divider-or`.
- Don't rebuild the brand gradient inline elsewhere — it belongs to `.auth-brand`.

## HTML Reference
```html
<!-- Split login -->
<div class="auth-frame">
  <div class="auth-brand">
    <h3>Run your venue from one place</h3>
    <p>Scheduling, bookings and payments for gyms, studios and academies.</p>
  </div>
  <div class="auth-form">
    <b class="t-title">Sign in</b>
    <div class="field"><label class="field__label">Email</label><input class="input" type="email" placeholder="you@business.com"></div>
    <div class="field"><label class="field__label">Password</label><input class="input" type="password" placeholder="••••••••"></div>
    <button class="btn btn--block">Sign in</button>
    <div class="divider-or">or continue with</div>
    <div class="row gap-3"><button class="btn btn--secondary" style="flex:1">Google</button><button class="btn btn--secondary" style="flex:1">Apple</button></div>
  </div>
</div>

<!-- Centered card -->
<div class="auth-card">
  <h3 class="t-title">Welcome back</h3>
  <div class="field"><label class="field__label">Email</label><input class="input" type="email"></div>
  <button class="btn btn--block">Sign in</button>
</div>
```

## CSS Reference
`assets/css/components.css` → `AUTH TEMPLATES` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
