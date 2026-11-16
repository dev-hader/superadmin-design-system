---
id: repeater
name: Repeater
category: Forms
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.repeater, .repeater__item, .repeater__head, .repeater__num, .repeater__foot, .is-invalid]
source-css: assets/css/components.css
source-demo: components.html
related: [form-section, card, button, conditional-panel]
---

# Repeater

## Purpose
A list of identical field groups the user can add to and remove from — subscription plans,
weekday schedules, contacts, price tiers — where each entry is its own small form.

## Description
`.repeater` is a `grid` that spaces `.repeater__item` cards. Each item is a sunken,
bordered block (`--color-surface-sunken`, `--radius-md`) opening with a `.repeater__head`
row: a semibold `.repeater__num` label ("Plan 1", "Sunday") that takes the free space, and
trailing controls — usually a trash `.icon-btn`. `.repeater__foot` is the matching trailing
row for per-item toggles. `.is-invalid` on the item turns its border danger-toned so a long
list points at the entry with the problem. Items nest: a weekday item holds its own
repeater of time slots.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.repeater` > `.repeater__item` | Any add/remove list of field groups |
| Nested | a `.repeater` inside a `.repeater__item` | Two-level structures (day → time slots) |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Sunken bordered card |
| Invalid | `.is-invalid` on the item | `--color-danger` border; field errors show inside as usual |
| Only item | page logic | Remove control is not rendered — a minimum of one entry stays |
| At maximum | page logic | The add button is not rendered |

## Properties
| Property | How |
|---|---|
| Item label | `.repeater__num` — "Plan 1", "Sunday"; renumber on removal |
| Add control | A `.btn.btn--secondary.btn--sm` above the list (section sub-header) or below it |
| Remove control | `.icon-btn` with `RD.icon("trash")` and an `aria-label` naming the item |
| Per-item toggle | `.repeater__foot` with a [switch](switch.md) |
| Minimum / maximum | Page logic — hide the remove control at the minimum, the add control at the maximum |

## Responsive Behaviour
No breakpoint of its own; items are full width. The field grid inside each item is the
page's and collapses to one column on mobile, at which point the head row's label and
trailing controls still share one line because the label is the flexible element.

## Accessibility
- Remove buttons must name their target — `aria-label="Remove Plan 2"`, not "Remove".
- Renumber `.repeater__num` **and** the labels after a removal so the visible order and
  the announced order agree.
- Removing an entry is destructive: confirm it with a [modal](modal.md) when the entry
  holds data, and never silently drop the user's input.
- Field ids inside items must be unique per item (suffix them with a stable item key, not
  the index — indexes shift on removal and break `for`/`aria-describedby` wiring).
- The added item should receive focus on its first field.

## Dependencies
Tokens: surface-sunken, border, danger, radius-md, spacing, text-sm, weight-semibold.
Embeds [input](input.md), [select](select.md), [switch](switch.md), [button](button.md),
`.icon-btn`. Add/remove and renumbering are page JS.

## Related Components
- [form-section.md](form-section.md) — the section that contains the repeater.
- [card.md](card.md) — a single, non-repeating group; no numbering or remove affordance.
- [data-table.md](data-table.md) — when entries are rows of *data* to scan, not field
  groups to fill.

## Usage Examples
- Create Package "Subscription Plans": Plan 1 / Plan 2 / Plan 3, each with name, SAR
  price, per-type date or duration fields and a plan-status switch; minimum one plan, so
  the last card has no trash icon.
- Same reference, "Access Schedule": one item per weekday Sunday → Saturday, each holding
  a nested repeater of up to three From/To time slots, with "Apply to All" on the first
  enabled day.

## Do
- Keep a sensible minimum (usually one) and drop the remove control at that floor.
- Confirm removal of an entry the user has typed into.
- Key item field ids by a stable id, not the array index.

## Don't
- Don't renumber only the heading and leave stale field ids behind.
- Don't let the list grow without a maximum when the backend has one — hide the add
  control and say the limit ("3 of 10 images", "max 3 slots per day").
- Don't nest more than two levels; a third level means the data model needs its own screen.

## HTML Reference
```html
<div class="cp-subhead">
  <h3>Subscription Plans</h3>
  <button type="button" class="btn btn--secondary btn--sm"><!-- RD.icon("plus") --> Add Plan</button>
</div>

<div class="repeater">
  <div class="repeater__item">
    <div class="repeater__head">
      <span class="repeater__num">Plan 1</span>
      <button class="icon-btn" style="width:32px;height:32px" aria-label="Remove Plan 1">
        <!-- RD.icon("trash") --></button>
    </div>

    <div class="field">
      <label class="field__label" for="pname-a1">Plan Name <span class="req">*</span></label>
      <input class="input" id="pname-a1" placeholder="e.g., Monthly Plan">
      <span class="field__hint">Name of the plan as users see it at checkout.</span>
    </div>

    <div class="repeater__foot">
      <label class="switch"><input type="checkbox" checked><span class="switch__track"></span> Plan active</label>
    </div>
  </div>

  <!-- flagged by the form's validation pass -->
  <div class="repeater__item is-invalid">…</div>
</div>
```

## CSS Reference
`assets/css/components.css` → `LONG-FORM COMPOSITION SET` section, block 4.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-08 | Initial build — composed for Packages US1 Create Package, promoted per rules §2.3 |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
