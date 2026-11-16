---
id: conditional-panel
name: Conditional panel
category: Forms
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.cond-panel, .cond-panel__note]
source-css: assets/css/components.css
source-demo: components.html
related: [radio-detail, form-section, alert, input]
---

# Conditional panel

## Purpose
Hold the extra fields a choice reveals, tinted and tied visually to the option above it,
so a form that grows on selection still reads as one decision rather than a jumping layout.

## Description
A tinted block (`--color-primary-subtle` on a `--color-primary` border, `--radius-md`)
placed directly under the radio group or control that reveals it. Because the panel owns
the tint, the `.input` and `.select` controls inside are pushed back to the plain
`--color-surface` so they stay legible and keep the standard field rhythm. An optional
`.cond-panel__note` closes the panel with the rule the panel implies — what happens
outside the range, what is not carried over.

## Variants
None — one shape. Panels nest fields; they never nest other panels.

## States
| State | Trigger | Appearance |
|---|---|---|
| Hidden | option not selected | Not rendered — hidden fields must not be validated or saved |
| Revealed | option selected | Tinted panel directly under the group |

## Properties
| Property | How |
|---|---|
| Fields | Any `.field` blocks; multi-column via the page's own grid utility |
| Closing rule | `.cond-panel__note` — one or two lines of secondary text |
| Emphasis | Wrap the note's text in `<b>` for a computed live preview |

## Responsive Behaviour
No breakpoint of its own. The field grid inside it is the page's, and collapses to one
column at the page's mobile breakpoint. Padding is a single spacing token at every size.

## Accessibility
- Reveal by **rendering**, not by `visibility` — hidden fields must leave the tab order,
  which is also the rule that keeps them out of validation and out of the payload.
- Toggling the owning option off clears the panel's values *and* its errors.
- The tint is decoration; the relationship is carried by DOM order (panel immediately
  after its group). Don't rely on colour to express the link.
- Required fields inside a revealed panel are required — mark them with `.req` as usual.

## Dependencies
Tokens: primary, primary-subtle, surface, text-secondary, radius-md, spacing, text-xs.
Embeds [input](input.md) / [select](select.md) inside `.field` wrappers. No JS — the page
decides whether to render it.

## Related Components
- [radio-detail.md](radio-detail.md) — the option group that normally owns the panel.
- [form-section.md](form-section.md) — the section the panel lives inside.
- [alert.md](alert.md) — looks similar, but an alert *informs*; this one *collects input*.
  Never use an alert to hold fields.

## Usage Examples
- Create Package "Display During Specific Period" → Start Date + End Date, closing with
  "Outside this period the package is hidden from the app; existing subscribers are not
  affected."
- Same reference, "Total Subscription Limit" → Max Subscribers.
- "Limited" usage → Visits per period + Usage Reset Period, closing with the live preview
  "**Subscribers get 16 visits per month, resetting on the 1st.**"

## Do
- Put the panel immediately after the control that reveals it — never further down.
- Use the note for the consequence, not for field help; field help is `.field__hint`.
- Clear the panel's values when the option is deselected.

## Don't
- Don't keep a revealed panel in the DOM while hidden — render it or don't.
- Don't nest a panel in a panel; flatten the choice instead.
- Don't put the primary action of the form inside a panel.

## HTML Reference
```html
<div class="field">
  <label class="field__label">Availability Type <span class="req">*</span></label>
  <!-- .check--detail radio group -->
  <span class="field__hint">Defines when the package is visible in the app.</span>
</div>

<div class="cond-panel">
  <div class="field">
    <label class="field__label" for="startDate">Start Date <span class="req">*</span></label>
    <input class="input" type="date" id="startDate">
    <span class="field__hint">Visibility start date.</span>
  </div>
  <div class="field">
    <label class="field__label" for="endDate">End Date <span class="req">*</span></label>
    <input class="input" type="date" id="endDate">
    <span class="field__hint">Visibility end date.</span>
  </div>
  <span class="cond-panel__note">Outside this period the package is hidden from the app;
    existing subscribers are not affected.</span>
</div>
```

## CSS Reference
`assets/css/components.css` → `LONG-FORM COMPOSITION SET` section, block 3.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-08 | Initial build — composed for Packages US1 Create Package, promoted per rules §2.3 |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
