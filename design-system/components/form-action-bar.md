---
id: form-action-bar
name: Form action bar
category: Forms
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.formbar, .formbar__spacer]
source-css: assets/css/components.css
source-demo: components.html
related: [button, form-section, error-summary, bulk-actions-bar]
---

# Form action bar

## Purpose
Keep a long form's commit and abandon actions permanently reachable: a sticky bar pinned to
the bottom of the content column holding the secondary action, a spacer and the primary one.

## Description
A `position: sticky` bar at `inset-block-end: 0` on `--color-surface-raised`, with a top
border and `--shadow-md` so content scrolling underneath reads as *behind* it. Negative
inline margins bleed it to the full width of the content column, cancelling the page
padding it sits inside. `.formbar__spacer` is a `flex: 1 1 auto` element that pushes
everything after it to the trailing edge — so Cancel sits at the inline start and Save at
the inline end without either being positioned. Wizard variants slot Back / Next between
the spacer and Save.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.formbar` | Any form taller than one viewport |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Raised bar, primary action at the inline end |
| Saving | `disabled` on both buttons; `.spinner` in the primary | "Saving…" with a 16px spinner |

## Properties
| Property | How |
|---|---|
| Action order | Secondary first in DOM, then `.formbar__spacer`, then the primary — the visual order follows in both directions |
| Extra actions | Insert between the spacer and the primary (wizard Back / Next) |
| Save hint | `title` on the primary when the outcome needs saying ("Submits the package for Super Admin approval") |

## Responsive Behaviour
≤768px the bleed switches to the mobile page padding and every `.btn` inside gets
`flex: 1 1 auto`, so the actions become equal-width full-row buttons — the standard mobile
form footer. The bar keeps its sticky position at every size.

## Accessibility
- The primary action **must not be disabled merely because required fields are empty**
  (`patterns/form-validation.md` §1) — leave it enabled and let Save run validation, which
  is the only path that produces a message for screen-reader users.
- Disable both buttons only *while* the request is in flight, and pair the disabled state
  with the visible "Saving…" label — never a bare spinner.
- The bar is not a landmark; it lives inside the form. Don't give it `role="toolbar"`.
- Because it overlays the end of the form, keep the last field's error visible by
  scrolling errors into the middle of the viewport, not the bottom.

## Dependencies
Tokens: surface-raised, border, shadow-md, spacing, z-sticky. Embeds
[button](button.md) and `.spinner` from [progress-indicators](progress-indicators.md).

## Related Components
- [button.md](button.md) — the actions themselves and their variant rules.
- [error-summary.md](error-summary.md) — where a failed Save reports; the bar only triggers it.
- [bulk-actions-bar.md](bulk-actions-bar.md) — the selection-driven cousin for tables;
  it appears on selection, this one is always present.
- [stepper.md](stepper.md) — `.wiz__foot` is the wizard's own footer; use this bar instead
  when the wizard must also keep Cancel permanently visible.

## Usage Examples
- Create Package: Cancel · Save, kept in view through a nine-section form
  (`features/packages/us1-create-package.html`).
- The post-save confirmation on the same screen reuses the bar for a single trailing
  "Create another package" action.
- The wizard arrangement (Back / Next between the spacer and Save) is demonstrated in the
  "Long-form composition set" entry of `components.html`.

## Do
- Put exactly one primary action in the bar.
- Keep the bar's actions the same across a wizard's steps so their position never moves.
- Confirm an abandon (Cancel with unsaved changes) with a [modal](modal.md).

## Don't
- Don't disable Save to signal an incomplete form.
- Don't stack a second sticky bar on the same page.
- Don't put navigation or filters in it — it is for committing the form.

## HTML Reference
```html
<div class="formbar">
  <button type="button" class="btn btn--ghost">Cancel</button>
  <span class="formbar__spacer"></span>
  <button type="button" class="btn" title="Submits the package for Super Admin approval">Save</button>
</div>

<!-- Wizard: extra actions sit between the spacer and the primary -->
<div class="formbar">
  <button type="button" class="btn btn--ghost">Cancel</button>
  <span class="formbar__spacer"></span>
  <button type="button" class="btn btn--secondary">Back</button>
  <button type="button" class="btn btn--secondary">Next</button>
</div>

<!-- Saving -->
<div class="formbar">
  <button type="button" class="btn btn--ghost" disabled>Cancel</button>
  <span class="formbar__spacer"></span>
  <button type="button" class="btn" disabled>
    <span class="spinner" style="width:16px;height:16px"></span> Saving…</button>
</div>
```

## CSS Reference
`assets/css/components.css` → `LONG-FORM COMPOSITION SET` section, block 5.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-08 | Initial build — composed for Packages US1 Create Package (generalises the per-page `.qm-savebar` used by the QR Management references), promoted per rules §2.3 |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
