---
id: form-section
name: Form section
category: Forms
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.form-section, .form-section--static, .form-section__head, .form-section__ic, .form-section__txt, .form-section__title, .form-section__sub, .form-section__chev, .form-section__body, .is-open, .is-invalid, .form-section__tag]
source-css: assets/css/components.css
source-demo: components.html
related: [accordion, card, form-action-bar, conditional-panel]
---

# Form section

## Purpose
The section unit of a long form: a card whose header carries an icon, a title and a
one-line subtitle, and whose body holds that section's fields — collapsible when the form
is a stack, static when the layout shows every section at once.

## Description
A bordered surface card (`--radius-lg`, `--shadow-xs`) whose `.form-section__head` is a
full-width button laying out a 40px tinted `.form-section__ic`, a two-line
`.form-section__txt` (semibold `__title` over tertiary `__sub`) and a trailing 18px
`.form-section__chev`. `.is-open` on the **section** reveals `.form-section__body` and
rotates the chevron 180°. `.is-invalid` — set by the form when a field inside failed
validation — turns the border and the icon tile danger-toned, so a collapsed section still
announces that it holds a problem. `.form-section--static` drops the disclosure entirely
for wizard panels and two-pane layouts.

## Section tag

`.form-section__tag` is a slot between the title block and the chevron for one short
status word about the whole section — a `.badge` reading "Locked", or a count of changes.
It only sets `flex-shrink: 0`; the badge supplies the look. Use it when the state belongs
to every field inside, not to one of them — a section whose fields are all locked can then
also start collapsed, since there is nothing in it to act on.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Collapsible | `.form-section` (+ `.is-open`) | Long single-column forms — the section stack is the navigation |
| Static | `.form-section--static` | Wizard steps or a two-pane layout, where an outer control already scopes what is visible |

## States
| State | Trigger | Appearance |
|---|---|---|
| Collapsed | — | Head only, chevron down |
| Open | `.is-open` on the section | Body visible, chevron rotated, divider above the body |
| Head hover | `:hover` | `--color-surface-hover` wash (collapsible only) |
| Head focus | `:focus-visible` | `--shadow-focus` ring |
| Invalid | `.is-invalid` on the section | Danger border; icon tile flips to the danger subtle pair |

## Properties
| Property | How |
|---|---|
| Icon | Any inventory icon inside `.form-section__ic` (`RD.icon`) |
| Numbering | Prefix the `__title` text ("1. Basic Information") — no separate slot |
| Subtitle | `.form-section__sub`, one line, sentence case, no terminal period |
| Initially open | Render the section with `.is-open` and `aria-expanded="true"` on the head |
| Invalid flag | Page toggles `.is-invalid` from its validation pass |

## Responsive Behaviour
No breakpoint of its own — full-width block content, and the head's flex row lets long
titles wrap while the icon and chevron hold their size. Field grids inside the body
collapse at the page's own breakpoints.

## Accessibility
- The collapsible head is a real `<button>`; keep `aria-expanded` in sync and point
  `aria-controls` at the body id.
- The body uses `display: none` when collapsed, so hidden fields leave the tab order —
  which is also why hidden fields must not be validated.
- The chevron is decorative; state rides `aria-expanded`.
- `.is-invalid` is reinforcement only — the real error messages are the `.field__error`
  lines inside, and the [error summary](error-summary.md) is the navigational path.
- On the static variant the head is a `<div>`, not a button — nothing is interactive.
- Head and chevron transitions are dropped under `prefers-reduced-motion`.

## Dependencies
Tokens: surface, border, radius, shadow, text, primary-subtle, danger-subtle, motion.
Icons: any inventory icon + `chevronDown`. No JS helper — pages toggle `.is-open`.

## Related Components
- [accordion.md](accordion.md) — plain text disclosure list (FAQ, policy copy); it has no
  icon or subtitle slot and no invalid state, so it is not a form section.
- [card.md](card.md) — the plain surface underneath; use it when there is no section header.
- [form-action-bar.md](form-action-bar.md) — the sticky Save/Cancel bar that closes the stack.
- [conditional-panel.md](conditional-panel.md) — reveals dependent fields *inside* a section.

## Usage Examples
- Create Package: nine sections (Basic Information · Package Status · Branch Assignment ·
  Package Media · Package Availability · Subscription Validity & Plans · Access Schedule ·
  Subscriber Capacity · Usage Rules), all expanded by default, invalid ones flagged and
  auto-opened when Save reports their error (`features/packages/us1-create-package.html`).
- `--static`: no product consumer yet — it exists for wizard panels and two-pane layouts,
  where an outer control already scopes what is visible. Demonstrated in the "Long-form
  composition set" entry of `components.html`. (It was built for the section-rail and
  wizard variants of the Create Package proposal, which were withdrawn when the
  accordion layout was selected — see that feature's `APPROVAL.md`.)

## Do
- Give every section a subtitle — it is what makes a collapsed stack scannable.
- Open the sections a user must fill; a create form usually opens all of them.
- Auto-open an invalid collapsed section when Save reports its error.

## Don't
- Don't nest a form section inside `.card--pad` — it is already a card.
- Don't hide a required field behind a collapsed section without flagging the section.
- Don't use the collapsible variant inside a wizard step; the step is already the scope.

## HTML Reference
```html
<section class="form-section is-open" id="sec-basic">
  <button type="button" class="form-section__head" aria-expanded="true" aria-controls="body-basic">
    <span class="form-section__ic"><!-- RD.icon("info") --></span>
    <span class="form-section__txt">
      <span class="form-section__title">1. Basic Information</span>
      <span class="form-section__sub">Package details and targeting</span>
    </span>
    <span class="form-section__chev"><!-- RD.icon("chevronDown") --></span>
  </button>
  <div class="form-section__body" id="body-basic">
    <!-- .field blocks -->
  </div>
</section>

<!-- Invalid, collapsed: the head still tells the user something is wrong -->
<section class="form-section is-invalid">…</section>

<!-- Static: wizard panel / two-pane layout -->
<section class="form-section form-section--static">
  <div class="form-section__head">
    <span class="form-section__ic"><!-- RD.icon("users") --></span>
    <span class="form-section__txt">
      <span class="form-section__title">8. Subscriber Capacity</span>
      <span class="form-section__sub">Maximum number of subscribers</span>
    </span>
    <span class="form-section__chev"></span>
  </div>
  <div class="form-section__body">…</div>
</section>
```

## CSS Reference
`assets/css/components.css` → `LONG-FORM COMPOSITION SET` section, block 1.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-08 | Initial build — composed for Packages US1 Create Package, promoted per rules §2.3 |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
