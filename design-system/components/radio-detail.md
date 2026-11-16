---
id: radio-detail
name: Radio / checkbox with description
category: Forms
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.check--detail, .check__detail, .check__desc]
source-css: assets/css/components.css
source-demo: components.html
related: [checkbox-radio, conditional-panel, chip, segmented-control]
---

# Radio / checkbox with description

## Purpose
A selectable option that needs a sentence of explanation, not just a label — the choice
between mutually exclusive *behaviours* whose consequences the user cannot guess from a
two-word name.

## Description
A `.check--detail` modifier on the existing [checkbox / radio](checkbox-radio.md): the
label becomes a bordered, full-width tile with the control top-aligned beside a
`.check__detail` block holding a semibold `<b>` label over a `.check__desc` explanation
line. The tile is the click target because the native input still fills the label, and
`:has(input:checked)` fills the selected tile with `--color-primary-subtle` and a primary
border. Stacked tiles space themselves with an adjacent-sibling rule, so a group needs no
wrapper class.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Radio, with description | `.check check--radio check--detail` | One of several behaviours (the common case) |
| Checkbox, with description | `.check check--detail` | Independent opt-ins that each need explaining |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | 1px `--color-border` tile on the plain surface |
| Hover | `:hover` | Border darkens to `--color-border-strong` |
| Selected | `:has(input:checked)` | `--color-primary` border + `--color-primary-subtle` fill |
| Focus | `input:focus-visible` | `--shadow-focus` ring on the box (inherited) |
| Disabled | `disabled` attr | Contents fade to `--opacity-disabled` (inherited) |

## Properties
| Property | How |
|---|---|
| Label | `<b>` inside `.check__detail` |
| Description | `.check__desc` — one or two lines, plain language, ends with a period |
| Grouping | Radios share `name`; adjacent tiles self-space, no wrapper needed |
| Revealed fields | Put them in a [conditional panel](conditional-panel.md) after the group, never inside a tile |

## Responsive Behaviour
No breakpoint of its own: the tile is `inline-size: 100%` and the description wraps.
Because the control is top-aligned (`align-items: flex-start`), a description that wraps
to three lines keeps the radio beside the label rather than centred against the block.

## Accessibility
- The native input stays in the DOM — Space and arrow-key group navigation are untouched.
- The whole tile is inside the `<label>`, so label, description and control are one target.
- `.check__desc` is *not* wired to the input with `aria-describedby`: it sits inside the
  label, so screen readers already read it as part of the accessible name. Don't add both.
- Selection is conveyed by the border and the fill, not colour alone.
- The tile's border/background transition is dropped under `prefers-reduced-motion`.

## Dependencies
Extends [checkbox-radio](checkbox-radio.md) — that entry's box, dot, check icon and focus
handling are unchanged. Tokens: border, primary, primary-subtle, surface, text, radius-md,
motion-fast. Requires `:has()` support for the selected fill (evergreen browsers).

## Related Components
- [checkbox-radio.md](checkbox-radio.md) — plain options whose labels are self-explanatory;
  prefer it, and reach for `--detail` only when a description is genuinely needed.
- [conditional-panel.md](conditional-panel.md) — the tinted block a selected option reveals.
- [chip.md](chip.md) — short, visible, toggleable values (categories, branches).
- [segmented-control.md](segmented-control.md) — 2–4 view modes with no explanation needed.

## Usage Examples
- Create Package "Subscription Validity Type": *Fixed Date Range* — "All subscribers start
  and end on the same dates (e.g. a summer camp)." · *Start from Purchase + Duration* ·
  *User Activation after Purchase*.
- Same reference, "Capacity Type": Unlimited / Total Subscription Limit / Active
  Subscribers Limit, where the difference between the last two is entirely in the
  description.
- "Access Type": Full Access / Scheduled Access.

## Do
- Write the description as the consequence of choosing it, not a restatement of the label.
- Keep every description in a group to a similar length — ragged tiles read as unequal options.
- Default-select the safest option and let its tile show as filled on first paint.

## Don't
- Don't put form fields inside a tile — reveal them in a conditional panel below the group.
- Don't use it for on/off; that's a [switch](switch.md) or a plain checkbox.
- Don't mix `--detail` tiles and bare `.check` rows in the same group.

## HTML Reference
```html
<label class="check check--radio check--detail">
  <input type="radio" name="validity" value="fixed" checked>
  <span class="check__box"><span class="check__dot"></span></span>
  <span class="check__detail">
    <b>Fixed Date Range</b>
    <span class="check__desc">All subscribers start and end on the same dates (e.g. a summer camp).</span>
  </span>
</label>

<label class="check check--radio check--detail">
  <input type="radio" name="validity" value="purchase">
  <span class="check__box"><span class="check__dot"></span></span>
  <span class="check__detail">
    <b>Start from Purchase + Duration</b>
    <span class="check__desc">The subscription starts the moment the user buys it.</span>
  </span>
</label>

<!-- Checkbox flavour -->
<label class="check check--detail">
  <input type="checkbox">
  <span class="check__box"><!-- RD.icon("check") --></span>
  <span class="check__detail">
    <b>Send a renewal reminder</b>
    <span class="check__desc">Subscribers get a notification three days before the plan ends.</span>
  </span>
</label>
```

## CSS Reference
`assets/css/components.css` → `LONG-FORM COMPOSITION SET` section, block 2 (box, dot and
focus styles remain in `FORM CONTROLS`).

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-08 | Initial build — composed for Packages US1 Create Package, promoted per rules §2.3 |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
