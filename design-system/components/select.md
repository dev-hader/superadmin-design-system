---
id: select
name: Select
category: Forms
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.select, .select__caret]
source-css: assets/css/components.css
source-demo: components.html
related: [input, menu, chip]
---

# Select

## Purpose
One-of-many choice from a native dropdown — the default picker for activity, resource, sort and filter values in forms and toolbars.

## Description
A styled native `<select>` inside a `.select` positioning wrapper. `appearance: none` removes the OS arrow and a decorative `.select__caret` (18px chevron, `pointer-events: none`) is absolutely positioned at the inline-end. Same 42px height, border, radius and focus ring as `.input`, so it lines up perfectly in mixed form rows. Because the popup is native, it works everywhere with zero JS.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.select` > `select` + `.select__caret` | Any single choice |
| Grouped options | native `<optgroup label="…">` inside | Long resource lists (~8+ options) — group by activity type, not alphabetically |
| Multi-select | `<select multiple size="n" class="input">` (height auto) | Rare multi-value choice; the caret wrapper is omitted |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | 1px `--color-border-strong` border, `--radius-md`, pointer cursor |
| Focus | `:focus` | `--color-primary` border + `--shadow-focus` ring |
| Disabled / locked | `disabled` attr on the `<select>` | Native disabled rendering; pair with a `.field__hint` explaining the lock |

## Properties
| Property | How |
|---|---|
| Label / hint / error | Wrap in `.field` with `.field__label`, `.field__hint`, `.field__error` |
| Option grouping | Native `<optgroup>` |
| Caret icon | `RD.icon("chevronDown")` inside `.select__caret` |

## Responsive Behaviour
No intrinsic breakpoint changes; width comes from the surrounding `.field`/grid. The native popup adapts to the platform (wheel picker on mobile), which is exactly why the native element is kept.

## Accessibility
- Native `<select>` gives keyboard (arrows, type-ahead) and screen-reader support for free — never replace it with a div-based dropdown for form choices.
- Associate the `.field__label` with the select (`for`/`id` or wrapping label).
- `.select__caret` is decorative (`pointer-events: none`); it needs no ARIA.
- When a value is locked (e.g. staff scoped to one branch), disable the select and explain why in a visible `.field__hint` — don't hide the field.
- `<optgroup label>` is announced by screen readers; use meaningful group names.

## Dependencies
Tokens: color (border/surface/text/primary), radius, spacing, text-scale, shadow-focus. Icon: `RD.icon("chevronDown")`. No JS.

## Related Components
- [input.md](input.md) — free text entry in the same `.field` wrapper.
- [menu.md](menu.md) — action dropdowns (not form values); portaled via `RD.portalMenu`.
- [chip.md](chip.md) — `.chip--select` for a short visible filter set instead of a hidden list.

## Usage Examples
- "Book an activity" grouped by Padel / Bowling / Spa venues (`components.html` Input section).
- "Sort by" (Most popular / Price / Rating) in listing toolbars.
- "Branch" locked select with hint "Locked - staff accounts are scoped to one branch".
- "Membership tiers" multi-select (`multiple size="3"`).

## Do
- Use `<optgroup>` once a list passes roughly 8 options, grouped by activity type.
- Keep the caret `span` in the markup — without it the select has no visual arrow.
- Prefer disabling over hiding when a value is locked, not just empty.

## Don't
- Don't rebuild selects as custom menus; form values stay native.
- Don't wrap the multi-select in `.select` — the caret pattern is for single selects.
- Don't use a select for 2–4 visible choices; use `.segmented` or radio `.check--radio` instead.

## HTML Reference
```html
<div class="field" style="min-width:240px">
  <label class="field__label">Book an activity</label>
  <div class="select">
    <select>
      <optgroup label="Padel"><option>Court A - SHQ Club</option><option>Court B - SHQ Club</option></optgroup>
      <optgroup label="Bowling"><option>Lane 2 - Strike Zone</option><option>Lane 4 - Strike Zone</option></optgroup>
    </select>
    <span class="select__caret"><!-- RD.icon("chevronDown") --></span>
  </div>
</div>

<!-- Locked -->
<div class="field">
  <label class="field__label">Branch</label>
  <div class="select"><select disabled><option>SHQ Club, Riyadh</option></select><span class="select__caret"><!-- chevronDown --></span></div>
  <span class="field__hint">Locked - staff accounts are scoped to one branch</span>
</div>

<!-- Multi-select -->
<select multiple size="3" class="input" style="height:auto;padding:6px">
  <option selected>Gold</option><option selected>Silver</option><option>Standard</option>
</select>
```

## CSS Reference
`assets/css/components.css` → `FORM CONTROLS` section, `/* Select */` block.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
