---
id: method-option
name: Method option
category: Forms
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.method-opt, .method-opt__head, .method-opt__note, .method-opt__picked, .method-opt__error]
source-css: assets/css/components.css
source-demo: components.html
related: [checkbox-radio, radio-detail, conditional-panel, card]
---

# Method option

## Purpose
One mutually-exclusive **way of doing something** — how a unit is booked, how a package is
sold — given enough room to explain itself and to carry the setup it depends on.

## Description
A row inside a `.card--pad`, separated from its siblings by a rule rather than boxed:
`.method-opt__head` puts the [radio](checkbox-radio.md) and its label on one line with a
right-aligned secondary button (the setup the option needs — *Edit contacts*,
*Select policy*), `.method-opt__note` explains the consequence in a sentence or two,
`.method-opt__picked` echoes what is currently chosen, and `.method-opt__error` states the
requirement when the option cannot be saved yet. First and last rows drop their outer
padding so the set sits flush inside the card.

## Variants
None — one shape. Rows without a setup step simply omit the button and the picked line.

## States
| State | Trigger | Appearance |
|---|---|---|
| Unselected | — | Radio empty; note and button still readable and clickable |
| Selected | `input:checked` | Radio filled (inherited from `checkbox-radio`) |
| Requirement unmet | `.method-opt__error` rendered | Danger-toned line under the note, naming what to pick |
| Configured | `.method-opt__picked` rendered | The chosen policy / contacts echoed under the note |

## Properties
| Property | How |
|---|---|
| Setup button | `.btn--sm.btn--secondary` inside `.method-opt__head`; relabel it once set (*Select policy* → *Edit policy*) |
| Current value | `.method-opt__picked` — the policy in brackets, the contact names joined |
| Requirement | `.method-opt__error` + `RD.icon("warn")`, shown on failed save, not on load |

## Responsive Behaviour
`.method-opt__head` wraps, so a long option label and its setup button stack on a phone
instead of squeezing. No breakpoint of its own.

## Accessibility
- Radios in the set share a `name`; the native input carries all keyboard behaviour.
- The setup button is a **sibling of the label, not inside it** — a label forwards clicks to
  its control, so a button nested in it would select the radio every time the user tried to
  open the picker. (Same hazard as [check-inline](check-inline.md).)
- An option whose requirement is unmet stays **selectable**; the block happens on Save, with
  the reason in `.method-opt__error` beside the option. Never disable the radio — a disabled
  control cannot say why it is disabled.
- The error is not a toast: the requirement belongs next to the thing that requires it.

## Dependencies
Composes [checkbox-radio](checkbox-radio.md) and [button](button.md). Tokens: border-subtle,
text-secondary, danger, spacing, text-sm/caption, weight-medium. No JS of its own.

## Related Components
- [radio-detail.md](radio-detail.md) — a tiled radio whose description sits inside the
  label. Use it when the choice needs no setup step; use `method-opt` when the option owns a
  picker, a current value and a requirement.
- [conditional-panel.md](conditional-panel.md) — when a choice reveals several fields rather
  than a single picker.

## Usage Examples
- Packages › Selling Methodology: Walk-in only · Contacts (*Edit contacts*) · Online
  subscription (*Select policy*, showing *(Gym Standard Policy)* underneath)
  (`features/packages/us4-selling-methodology.html`).
- Branch unit › Booking Methodology: the same three-way choice for a unit
  (`branches-unit-booking-methodology.html`) — **still carries its original page-level
  `.bm-opt` copy of these styles; adopt `.method-opt` there in a follow-up so the two
  screens share one source.**

## Do
- Write the note as what the user will see happen, not as a setting description.
- Relabel the setup button once a value exists, and echo the value beneath.
- Keep the requirement message identical to the one Save enforces.

## Don't
- Don't nest the setup button inside the radio's `<label>`.
- Don't disable an option whose requirement is unmet — explain it on Save instead.
- Don't box each row; the card is the container and the rules are the separators.

## HTML Reference
```html
<div class="card card--pad">
  <b class="t-title">Selling methodology settings</b>
  <p class="t-sm text-secondary">Please select how this package is sold:</p>

  <div class="method-opt">
    <div class="method-opt__head">
      <label class="check check--radio"><input type="radio" name="method" value="walkin" checked>
        <span class="check__box"><span class="check__dot"></span></span>Walk-in only</label>
    </div>
    <p class="method-opt__note">Your package will not be shown in the user app, but you can
      sell it from the dashboard (Walk-in purchase).</p>
  </div>

  <div class="method-opt">
    <div class="method-opt__head">
      <label class="check check--radio"><input type="radio" name="method" value="online">
        <span class="check__box"><span class="check__dot"></span></span>Online subscription</label>
      <button class="btn btn--sm btn--secondary">Edit policy</button>
    </div>
    <p class="method-opt__note">Your package is shown in the user app with a
      <b>Subscribe</b> button.</p>
    <div class="method-opt__picked">(Gym Standard Policy)</div>
  </div>

  <!-- requirement not met, shown after a failed Save -->
  <div class="method-opt">
    <div class="method-opt__head">
      <label class="check check--radio"><input type="radio" name="method" value="contacts">
        <span class="check__box"><span class="check__dot"></span></span>Contacts</label>
      <button class="btn btn--sm btn--secondary">Edit contacts</button>
    </div>
    <p class="method-opt__note">Subscriptions are sold at the branch.</p>
    <div class="method-opt__error"><!-- RD.icon("warn") -->
      Select at least one contact to choose this option.</div>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `METHOD OPTION` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-08 | Promoted from the page-level `.bm-opt` block in `branches-unit-booking-methodology.html` when Packages US4 Selling Methodology needed the identical pattern (rules §2.3) |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
