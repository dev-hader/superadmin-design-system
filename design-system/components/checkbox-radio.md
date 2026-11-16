---
id: checkbox-radio
name: Checkbox & Radio
category: Forms
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.check, .check--radio, .check__box, .check__dot]
source-css: assets/css/components.css
source-demo: components.html
related: [switch, chip, data-table]
---

# Checkbox & Radio

## Purpose
Staged selection controls: checkboxes for multi-select choices that are submitted later, radios for one-of-many.

## Description
A `<label class="check">` wraps a visually hidden native input plus a custom 20px `.check__box`. The native input stays in the DOM (absolutely positioned, opacity 0) so keyboard and screen-reader behavior is untouched; checked state is drawn on the sibling box via `input:checked + .check__box`. The check icon (or radio `.check__dot`) pops in with the spring ease. `.check--radio` only rounds the box to a circle and swaps the SVG for a dot — everything else is shared.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Checkbox | `.check` + `<input type="checkbox">` | Independent on/off choices, multi-select |
| Radio | `.check check--radio` + `<input type="radio" name="…">` | Exactly one of a small set |
| Bare (no label text) | Same markup, empty label text | Row selection in `.data-table` headers/cells |

## States
| State | Trigger | Appearance |
|---|---|---|
| Unchecked | — | 1.5px `--color-border-strong` border on `--color-surface` |
| Checked | `input:checked` | `--color-primary` fill + border; white check/dot springs to scale 1 |
| Focus | `input:focus-visible` | `--shadow-focus` ring on the box |
| Disabled | `disabled` attr | Everything after the input fades to `--opacity-disabled` |

## Properties
| Property | How |
|---|---|
| Check icon | `RD.icon("check")` inside `.check__box` (checkbox only) |
| Radio dot | `<span class="check__dot"></span>` inside `.check__box` |
| Label text | Plain text after the box, inside the `<label>` |

## Responsive Behaviour
No intrinsic breakpoint changes. The 20px box with label padding gives an adequate touch target; in dense tables the label alone is the target.

## Accessibility
- The native input must remain in the markup — it carries all keyboard (Space, arrow keys within a radio group) and screen-reader semantics.
- Wrapping everything in `<label>` makes the text and box clickable with no `for`/`id` wiring; add `for`/`id` if the label can't wrap.
- Radios in a group must share `name`.
- Focus ring is driven by `:focus-visible` on the hidden input — never remove it.
- Bare checkboxes (table row selection) need accessible text, e.g. `aria-label="Select row"` on the input.

## Dependencies
Tokens: color (primary/border/surface), radius (xs/full), text-sm, shadow-focus, opacity-disabled, motion (fast + spring). Icon: `RD.icon("check")`. No JS.

## Related Components
- [switch.md](switch.md) — instant settings that apply immediately; checkboxes stage a choice.
- [chip.md](chip.md) — `.chip--select` when the choices should read as visible filters.
- [data-table.md](data-table.md) — hosts bare `.check` controls for row selection.

## Usage Examples
- "Available today only" filter checkbox in the filter drawer (`components.html`).
- Select-all + per-row checkboxes in the selectable data table demo.
- "Breakfast included / Airport transfer" checkboxes and "King bed / Twin beds" radio group on the design-system selection page.

## Do
- Use checkboxes when the choice takes effect on submit; use `.switch` when it applies instantly.
- Keep the check icon markup inside `.check__box` — the fill alone is not the checked indicator.
- Disable (not hide) unavailable options so the set stays scannable.

## Don't
- Don't restyle native inputs directly — the pattern relies on the hidden-input + sibling-box structure.
- Don't use a single radio; a radio group needs two or more options.
- Don't use radios for on/off — that's a checkbox or a switch.

## HTML Reference
```html
<!-- Checkbox -->
<label class="check">
  <input type="checkbox" checked>
  <span class="check__box"><!-- RD.icon("check") --></span>
  Breakfast included
</label>

<label class="check"><input type="checkbox" disabled><span class="check__box"><!-- check --></span> Unavailable</label>

<!-- Radio group -->
<label class="check check--radio">
  <input type="radio" name="bed" checked>
  <span class="check__box"><span class="check__dot"></span></span>
  King bed
</label>
<label class="check check--radio"><input type="radio" name="bed"><span class="check__box"><span class="check__dot"></span></span> Twin beds</label>

<!-- Bare, for table row selection -->
<label class="check"><input type="checkbox" aria-label="Select row"><span class="check__box"><!-- check --></span></label>
```

## CSS Reference
`assets/css/components.css` → `FORM CONTROLS` section, `/* Checkbox / Radio / Switch */` block.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
