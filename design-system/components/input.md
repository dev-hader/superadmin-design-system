---
id: input
name: Input
category: Forms
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.input, .input--num, .field, .field__label, .field__hint, .field__error, .field__counter, .input-wrap, .input-wrap__icon, .input-wrap__suffix, .input-affix, .float, .is-valid, .is-error, .field--locked, .field__label--locked, .field__lock]
source-css: assets/css/components.css
source-demo: components.html
related: [select, phone-field, otp, checkbox-radio]
---

# Input

## Purpose
The single-line (and multi-line) text entry control, plus the `.field` wrapper that gives every form control its label, hint and error rhythm.

## Description
A 42px-tall bordered text box on `--color-surface` with a primary focus ring. It always lives inside a `.field` stack (`label → control → hint/error`) except in the floating-label variant, where the label sits inside the box until focus or a value lifts it. Icon and affix wrappers add leading/trailing content without changing the field height. Textareas reuse the same `.input` class.

## Locked fields

A value the user may read but not change — locked by permission, or by a rule such as
"this plan already has subscribers". The system's position, stated here and in
[select](select.md): **disable the control and explain why in a visible
`.field__hint` — never hide the field.** Three classes carry it:

| Class | On | Does |
|---|---|---|
| `.field--locked` | the `.field` wrapper | Restores the control's text to full contrast. The global `.input:disabled` rule dims text, which is right for "not available yet" and wrong for "locked, here is the current value" |
| `.field__label--locked` | the `.field__label` | Makes the label a flex row so the lock can sit at its trailing end |
| `.field__lock` | a `<span>` inside that label | The 16px lock glyph. Needs a `title` **and** an `aria-label` carrying the same sentence as the hint |

The lock text **replaces** the normal hint rather than joining it — one reason, one line.
A lock on an *action* (a delete icon, a toggle) is a different problem: an icon button has
no hint slot and its tooltip does not exist on touch, so keep it live and explain on click.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Standard | `.field` > `.field__label` + `.input` | Default for all forms |
| With leading icon | `.input-wrap` > `.input-wrap__icon` + `.input` | Search boxes, scannable inputs |
| With suffix | `.input-wrap.has-suffix` + `.input-wrap__suffix` | Trailing icon/unit |
| Prefix/suffix affix | `.input-affix` > `.affix` + `.input` (+ `.affix`) | Currency, units ("SAR … /session") |
| Floating label | `.float` > `.input` + `label` (input needs `placeholder=" "`) | Dense forms where vertical space matters |
| Textarea | `textarea.input` | Multi-line notes, special requests |
| Compact number | `.input.input--num` | A count or a percentage (9ch wide, centred) — inside a sentence, a table cell or beside an affix. Keeps the 42px height |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | 1px `--color-border-strong` border, `--radius-md` |
| Hover | `:hover` | Border darkens to `--color-text-tertiary` |
| Focus | `:focus` | `--color-primary` border + `--shadow-focus` ring |
| Valid | `.is-valid` | `--color-success` border |
| Error | `.is-error` | `--color-danger` border; focus ring becomes `--color-danger-subtle` |
| Disabled / readonly | `disabled` / `readonly` attr | `--color-surface-sunken` bg, disabled text, `not-allowed` cursor |

## Properties
| Property | How |
|---|---|
| Required marker | `<span class="req">*</span>` inside `.field__label` (renders in `--color-danger`) |
| Hint text | `.field__hint` below the control |
| Error message | `.field__error` (14px icon + text, `--color-danger`) |
| Textarea height | `min-height: 96px` default, vertical resize only |
| Character counter | `.field__counter` under the control (`n / max`, tabular figures, end-aligned); add `.is-over` past the limit. Sits *beside* the hint/error slot, not in it |

## Responsive Behaviour
No intrinsic breakpoint changes — the input is `width: 100%` and follows its form grid. Page layouts collapse multi-column form grids at their own breakpoints.

## Accessibility
- Always associate the label: wrap in `<label class="field__label">` or use `for`/`id` — floating labels **require** `for`/`id` (see the demo).
- The floating label depends on `:placeholder-shown`, so the input must carry `placeholder=" "`.
- Mark required fields with `aria-required` plus the visible `.req` asterisk.
- Tie `.field__error` text to the input with `aria-describedby` and set `aria-invalid="true"` alongside `.is-error` — never signal errors by border color alone.
- `.input-wrap__icon` is `pointer-events: none` and decorative; don't put actions in it.

## Dependencies
Tokens: color (border/surface/text/danger/success), radius, spacing, text-scale, shadow-focus, motion groups. No JS — validation classes are toggled by the page.

## Related Components
- [select.md](select.md) — one-of-many choice inside the same `.field` wrapper.
- [phone-field.md](phone-field.md) — composite of country trigger + `.input`.
- [otp.md](otp.md) — segmented code entry instead of one text box.

## Usage Examples
- Guest name / email fields in the booking form (`components.html` profile card).
- Table search with leading search icon (`.input-wrap`) in Bookings, Customers, Memberships toolbars.
- "Session price" with `SAR` / `/session` affixes in the design-system inputs page.
- Floating-label set (name, email, phone with `.is-error`, disabled booking reference, textarea) in the Input section of `components.html`.

## Do
- Keep labels short nouns; use `.field__hint` for format guidance, not errors.
- Reuse the same `.is-error` / `disabled` modifiers on floating-label fields — they are the same input.
- Disable a field whose value is locked (and say why in a hint) rather than hiding it.

## Don't
- Don't use placeholder text as the only label.
- Don't invent new heights — every field is 42px for consistent form rhythm.
- Don't put `.field__error` and `.field__hint` on screen simultaneously for one field.

## HTML Reference
```html
<div class="field">
  <label class="field__label">Email <span class="req">*</span></label>
  <input class="input" type="email" placeholder="guest@email.com">
  <span class="field__hint">We only use this for booking confirmations</span>
</div>

<div class="field">
  <label class="field__label">Emergency contact</label>
  <input class="input is-error" value="5012" aria-invalid="true" aria-describedby="ec-err">
  <span class="field__error" id="ec-err"><!-- RD.icon("warn") --> Enter a complete phone number</span>
</div>

<div class="input-wrap"><span class="input-wrap__icon"><!-- RD.icon("search") --></span><input class="input" placeholder="Search reservations"></div>

<div class="input-affix"><span class="affix">SAR</span><input class="input" value="180"><span class="affix">/session</span></div>

<div class="float"><input class="input" id="flName" placeholder=" "><label for="flName">Full name</label></div>

<textarea class="input" placeholder="Late check-out, extra pillows…"></textarea>

<!-- Textarea with a character counter -->
<div class="field">
  <label class="field__label" for="pkgDesc">Description <span class="req">*</span></label>
  <textarea class="input" id="pkgDesc" rows="4" maxlength="1000"></textarea>
  <span class="field__counter">248 / 1000</span>
  <span class="field__hint">Full explanation of what the package includes.</span>
</div>
```

## CSS Reference
`assets/css/components.css` → `FORM CONTROLS` section (`.field`, `.input`, `.input-wrap`, `.input-affix`, `/* Floating label */`).

## Version
| Version | Date | Change |
|---|---|---|
| 1.2.0 | 2026-09-08 | Added `.input--num` (compact 9ch centred number). Built for Packages US3 Package Policies, promoted per rules §2.3 |
| 1.1.0 | 2026-09-08 | Added `.field__counter` (textarea character count). Built for Packages US1 Create Package |
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
