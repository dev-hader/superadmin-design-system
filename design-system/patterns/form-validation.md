# Pattern — Form Validation

**Status:** approved · v1.0 (2026-07-20)
The system-level contract for validation UX. Field-level error *styles* existed
(`.field__error`, `.is-error`); this pattern defines **when** they fire, how whole forms
report, async validation, and the RTL/Arabic rules. Error-summary block:
[error-summary.md](../components/error-summary.md).

## 1. When validation fires (the timing contract)

| Moment | Behaviour |
|---|---|
| While typing (pristine field) | never validate — don't slap hands mid-word |
| On blur (first exit) | validate; show `.field__error` if invalid |
| While typing (already-invalid field) | re-validate on every input — errors clear the moment the value becomes valid ("reward early, punish late") |
| On submit / Save | validate everything; focus the first invalid field; show the error summary when ≥ 3 fields are invalid or invalid fields sit off-screen |
| Toggle-revealed fields | validate only while their toggle is ON; toggling OFF clears value + error |

Save/submit buttons: **disabled only for emptiness of required fields is forbidden** —
buttons stay enabled and submit runs validation, EXCEPT single-purpose settings panes
(per-branch/per-package Save) where Save may disable until *dirty + valid* because the
whole pane is one visible unit (the QR Management references demonstrate this).

## 2. Field-level errors

- Markup: input gets `.is-error` + `aria-invalid="true"`; message is a `.field__error`
  under the field, linked via `aria-describedby`.
- One message per field — the most important failure only, never a stacked list.
- Message copy: say **what to do**, not what went wrong internally.
  `"Minutes must be 1–59."` ✓ — `"Invalid value."` ✗ `"Validation constraint violated"` ✗
- Never color-only: the message text IS the indicator; the red border is reinforcement.
- `.field__hint` and `.field__error` occupy the same slot — hint hides while an error shows.

## 3. Error summary (`.form-errors`) — long forms

For forms taller than one viewport or with ≥ 3 simultaneous errors:

- A `.form-errors` block renders at the **top of the form** on failed submit:
  title ("Fix N issues to continue") + a link per error.
- Each link is an `<a href="#field-id">` that focuses its field (`tabindex="-1"` on the
  target wrapper if needed) — keyboard users fix errors in sequence without hunting.
- The block is `role="alert"` `aria-labelledby` its title and receives focus on render.
- It disappears once every listed error is resolved (re-render on each fix).

## 4. Async validation (server-checked values)

For uniqueness/availability checks (email exists, slot still free, promo code valid):

1. Fire on blur (not per keystroke); debounce 400ms if wired to input.
2. While pending: `.field__hint--validating` (spinner ≤ 16px + "Checking…") in the hint
   slot. **Never block typing** and never disable the field.
3. Resolve to a normal `.field__error` or a quiet success hint. On network failure,
   don't fake a pass — `"Couldn't verify — we'll check again when you save."` and
   re-check on submit.
4. Submit while a check is pending: wait for it, with the button in its loading state.

## 5. RTL & Arabic

- All error/hint styles use logical properties — the red start-border of `.form-errors`
  and icon placement mirror automatically. Never position error icons with left/right.
- Arabic error copy is fuṣḥā, short, imperative: «أدخل مدة صحيحة.» «الدقائق من 1 إلى 59.»
- Numbers inside error messages use Latin digits (system-wide digits policy — charts.md §5).
- Mixed-direction values (emails, codes) inside Arabic messages wrap in `<bdi>`.

## 6. What is forbidden

- Validating a pristine form on page load, or a pristine field on every keystroke.
- Toast-only errors for field problems — errors live next to their field; toasts are for
  request-level failure ("Something went wrong. Your changes couldn't be saved.").
- Disabling submit as the *only* signal (screen-reader users get silence) — pair any
  disabled state with visible unmet requirements.
- Clearing user input on failed validation. Never.
- `alert()`/native validation bubbles — `novalidate` on every form; the system renders
  all messages.

## Components composed
`input` (`.field`, `.field__error`, `.field__hint`, `.is-error`),
[error-summary](../components/error-summary.md), `button` (loading state), `toast`
(request-level only), `spinner` (async hint).

## Reference implementations
QR Management references: `features/qr-management/us1-branch-barcode-settings.html`
and `us3-package-barcode-settings.html` (range/integer/required + dirty-gated Save).
