---
id: check-inline
name: Inline condition checkbox
category: Forms
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.check-inline, .check-inline__hint]
source-css: assets/css/components.css
source-demo: components.html
related: [checkbox-radio, input, conditional-panel, radio-detail]
---

# Inline condition checkbox

## Purpose
A rule the user switches on and then parameterises **in the same sentence** —
"☑ Can cancel within `[ 14 ]` days from the subscription start date" — so the setting
reads as the sentence it will enforce rather than a checkbox stacked above a stray field.

## Description
A wrapping flex row (`.check-inline`) holding three things in reading order: a
[`.check`](checkbox-radio.md) label carrying the box **and the leading words**, a compact
[`.input--num`](input.md) field, and the trailing words as plain text. A
`.check-inline__hint` takes the full row beneath and carries the helper text — or the
field's error, since the two share one slot as everywhere else in the system. Rows stack
with an adjacent-sibling rule, so a group needs no wrapper.

**The number input sits outside the `<label>` on purpose.** A label forwards clicks to its
control, so an input nested inside it would toggle the checkbox every time the user tried
to click into the field. Splitting the sentence at the field is what makes the pattern
work, not a styling preference.

## Variants
None — one shape. The sentence is supplied by the page.

## States
| State | Trigger | Appearance |
|---|---|---|
| Off | checkbox unchecked | Number field `disabled` (page sets it), value cleared |
| On | checkbox checked | Field enabled and required |
| Error | `.is-error` on the field | Message replaces the helper in `.check-inline__hint` |

## Properties
| Property | How |
|---|---|
| Leading words | Text inside the `<label class="check">`, after the box |
| Field | `.input.input--num` — a sibling of the label, never a child |
| Trailing words | A plain `<span>` after the field |
| Helper / error | `.check-inline__hint`, full-width, one slot for both |
| Disabled field | Page adds `disabled` while the checkbox is off, and clears the value |

## Responsive Behaviour
The row wraps: on a narrow screen the trailing words fall to the next line while the box,
the leading words and the field stay together. `line-height: 1.6` keeps a wrapped sentence
readable against the 42px field. No breakpoint of its own.

## Accessibility
- The number input **must** carry its own `aria-label` (or an associated label) — the
  sentence around it is not programmatically its name.
- Only the leading words are inside the `<label>`, so only they toggle the checkbox. That
  is the intended behaviour; do not extend the label over the field to "fix" it.
- Disable the field rather than hiding it when the rule is off — the sentence stays
  readable and the layout doesn't jump.
- A disabled field is not validated, matching the conditional-field rule in
  [`../patterns/form-validation.md`](../patterns/form-validation.md).

## Dependencies
Composes [checkbox-radio](checkbox-radio.md) (`.check`, `.check__box`) and
[input](input.md) (`.input--num`). Tokens: text-sm/xs, text colours, spacing. Enable and
clear behaviour is page JS.

## Related Components
- [checkbox-radio.md](checkbox-radio.md) — a plain on/off with no parameter.
- [radio-detail.md](radio-detail.md) — one-of-many with an explanation line; use it when
  the options are alternatives rather than independent rules.
- [conditional-panel.md](conditional-panel.md) — where several revealed fields belong;
  this component is for a single value living inside its own sentence.

## Usage Examples
- Package Policies, cancellation conditions: "☑ Can cancel within `[14]` days from the
  subscription start date" and "☑ Can cancel only if used less than `[3]` times", both
  feeding a live preview sentence underneath
  (`features/packages/us3-policies.html`).

## Do
- Write the row as a full sentence — read it aloud with a number in the field.
- Clear the value when the checkbox goes off, so a stale number can't be saved.
- Put the unit ("days", "times") in the trailing words, not inside the field.

## Don't
- Don't nest the input inside the label; the checkbox will fight the field.
- Don't use it for a value that is always required — that is a plain `.field`.
- Don't stack more than two or three of these; past that, use a conditional panel.

## HTML Reference
```html
<div class="check-inline" id="w-f-days">
  <label class="check">
    <input type="checkbox" checked>
    <span class="check__box"><!-- RD.icon("check") --></span>Can cancel within
  </label>
  <input class="input input--num" type="number" min="1" value="14"
         id="f-days" aria-label="Days from the subscription start date">
  <span>days from the subscription start date</span>
  <span class="check-inline__hint">Counted from the day the subscription starts, not the purchase day.</span>
</div>

<!-- Off: the field is disabled and empty, the sentence still reads -->
<div class="check-inline">
  <label class="check"><input type="checkbox">
    <span class="check__box"><!-- check --></span>Can cancel only if used less than</label>
  <input class="input input--num" type="number" disabled aria-label="Number of uses">
  <span>times</span>
  <span class="check-inline__hint">A “use” is one successful check-in. <b>0 = only before the first use.</b></span>
</div>
```

## CSS Reference
`assets/css/components.css` → `CONDITION ROW + COMPACT NUMBER` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-08 | Initial build — composed for Packages US3 Package Policies, promoted per rules §2.3 |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
