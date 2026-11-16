---
id: calc-sheet
name: Calculation sheet
category: Data
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.calc-sheet, .calc-row, .calc-row--pick, .calc-row--fee, .calc-row--total, .calc-row__k, .calc-row__v, .calc-sheet__rule]
source-css: assets/css/components.css
source-demo: components.html
related: [detail-list, input, modal, alert]
---

# Calculation sheet

## Purpose
Show how a number was arrived at, line by line, immediately above the field where the user
can overrule it. For figures a person has to **explain out loud** — a refund to the
customer standing at the counter, a proration on an invoice.

## Description
`.calc-sheet` is a sunken, bordered block of `.calc-row`s, each a label and a
tabular-numeric value pushed to opposite ends. Three modifiers carry the shape of an
argument rather than decoration: `--pick` marks the winning line of a comparison
(the lower of two candidate refunds), `--fee` renders a subtraction in the danger tone,
and `--total` sets the concluding line larger and semibold. `.calc-sheet__rule` draws the
line above that total.

It is deliberately **read-only**. The editable field belongs underneath it, so the derived
figure and the figure being submitted are visibly two different things.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Plain line | `.calc-row` | An input to the calculation |
| Chosen line | `.calc-row calc-row--pick` | The winner of a min/max comparison |
| Deduction | `.calc-row calc-row--fee` | A fee or penalty subtracted |
| Result | `.calc-row calc-row--total` | The concluding figure, after `.calc-sheet__rule` |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Sunken block, one row per step |
| Recalculated | page logic re-renders it | Values change in place; do not animate — the user is reading numbers |
| Not applicable | page logic | Omit the sheet entirely (an unpaid subscription has no refund to derive) rather than showing zeroes |

## Properties
| Property | How |
|---|---|
| Alignment | `.calc-row__v` is `tabular-nums` and `nowrap`, so digits line up down the column |
| Showing the rule used | Name it in a `detail-list` row above the sheet ("Refund rule · after start and used"), not inside it |
| The editable figure | A separate `.field` with `.input--num` **below** the sheet, with a hint saying the difference is recorded |

## Responsive Behaviour
Rows are flex pairs that wrap at very small widths; the value stays with its label. No
media query — keep labels short enough that a phone does not need one.

## Accessibility
- Not a `<table>`: these are steps in an argument, not tabular data. If the sheet grows
  past ~6 rows, reconsider whether it is really a table.
- The total must not rely on weight alone — its label says what it is
  ("Refund per policy").
- When the editable amount diverges from the derived one, say so in text near the input.
  A screen-reader user should not have to compare two numbers to notice.

## Dependencies
Tokens: surface-sunken, border, text scale, `--color-danger`, weights. No JS.

## Related Components
- [detail-list](detail-list.md) — for facts that are simply looked up. Use it *above* a calc-sheet to state the inputs and the rule.
- [input](input.md) — `.input--num` for the overridable figure beneath.

## Usage Examples
- **Packages › Subscribers › Cancel** (`features/packages/us7-subscribers.html`) — remaining
  days vs remaining visits, the lower marked `--pick`, the 10% fee as `--fee`, the refund
  as `--total`; the amount below it is editable.
- The same file's **Freeze** and **Extend** dialogs use the plain rows as a preview of what
  the action will do to the end date.

## Do
- Show every step, including the one that lost the comparison. The step that did *not* win
  is usually the one the customer asks about.
- Put the rule that was applied in words somewhere adjacent.
- Let the user overrule the result, and record that they did.

## Don't
- Don't make the sheet itself editable — derived and entered must look different.
- Don't hide the arithmetic behind a tooltip or a "how is this calculated?" link.
- Don't use it for a plain total (a basket subtotal). That is a `detail-list`; this is for
  a number that needs **defending**.

## HTML Reference
```html
<div class="calc-sheet">
  <div class="calc-row calc-row--pick">
    <span class="calc-row__k">Remaining days · 19 / 30</span>
    <span class="calc-row__v">203 SAR</span>
  </div>
  <div class="calc-row">
    <span class="calc-row__k">Remaining visits · 16 / 20</span>
    <span class="calc-row__v">256 SAR</span>
  </div>
  <div class="calc-row calc-row--fee">
    <span class="calc-row__k">Fee 10%</span>
    <span class="calc-row__v">− 20 SAR</span>
  </div>
  <hr class="calc-sheet__rule">
  <div class="calc-row calc-row--total">
    <span class="calc-row__k">Refund per policy</span>
    <span class="calc-row__v">182 SAR</span>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → **SUBSCRIPTION SET** → *Calculation sheet*.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-29 | Promoted from Packages › Subscribers, cancel/refund dialog (rules §2.3) |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
