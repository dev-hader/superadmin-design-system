---
id: modal
name: Modal
category: Overlays
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.modal-overlay, .modal, .modal__head, .modal__body, .modal__foot, .is-open]
source-css: assets/css/components.css
source-demo: components.html
related: [drawer, menu, button]
---

# Modal

## Purpose
Interrupts the page for one focused decision or a small edit that must finish (or cancel) before anything else — "Cancel reservation?" or "Edit guest details".

## Description
A fixed, full-viewport `.modal-overlay` (dimmed with `--color-overlay`, `z-index: var(--z-modal)`) centers a max-width 460px `.modal` card that animates in with `hf-fade-up`. The card is three slots: `.modal__head` (title + icon-btn close), `.modal__body` (stacked content), and `.modal__foot` (sunken, right-aligned action row). Opening is a single class toggle: `.modal-overlay.is-open` switches from `display: none` to `flex`.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Confirm modal | `.modal` with a sentence body + Keep/Danger footer | Deciding one thing, often destructive |
| Form modal | `.modal` with `.field`s in the body + Cancel/Save footer | Editing a few fields without leaving the page |

## States
| State | Trigger | Appearance |
|---|---|---|
| Closed | — | `display: none` on the overlay |
| Open | `.is-open` on `.modal-overlay` | Overlay dims page; card fades up (`hf-fade-up`, `--duration-base`) |

## Properties
| Property | How |
|---|---|
| Close wiring | Any element with `data-close` inside the modal closes it; clicking the overlay itself and `Escape` also close (see the delegated listeners in `components.html`) |
| Width | `max-width: 460px` default; the card stretches to overlay padding on small screens |
| Footer actions | `.btn--ghost` for the safe exit, `.btn` / `.btn--danger` for the commit |

## Responsive Behaviour
The overlay carries `padding: var(--space-4)`, so on small screens the 100%-width card simply narrows to fit. No modal-specific media queries. **The card is a flex column capped at `calc(100vh - var(--space-8))`: `.modal__head` and `.modal__foot` stay fixed (`flex-shrink: 0`) while `.modal__body` (`flex: 1; min-height: 0; overflow-y: auto`) scrolls — so a tall body (long forms, many options) never pushes the footer actions off-screen.** Short modals are unaffected (content below the cap doesn't scroll).

## Accessibility
From the live demo: **focus moves into the dialog on open, Esc and backdrop-click both close it, and focus returns to the trigger after.** Additionally:
- The card carries `role="dialog" aria-modal="true" aria-labelledby="<title id>"` (see `#demoModal` in components.html).
- The head's close button is icon-only and **must** have `aria-label="Close"`.
- Destructive confirms put the danger action last and keep a ghost "Keep booking" escape.

## Dependencies
Tokens: overlay, surface, border, radius, shadow, z-index, motion groups. Keyframe `hf-fade-up`. JS: page-level toggles of `.is-open` plus `data-close` / Esc / backdrop listeners — no shared helper.

## Related Components
- [drawer.md](drawer.md) — "the modal's calmer sibling": side tasks and filters that shouldn't hide the page underneath.
- [button.md](button.md) — footer actions; `.btn--danger` for the destructive choice.
- [menu.md](menu.md) — lightweight per-record actions that don't warrant an interruption.

## Usage Examples
- Confirm: "Cancel reservation?" explaining the refund + slot release, Keep booking / Cancel booking (`#demoModal`).
- Form: "Edit guest details" with a couple of fields, Cancel / Save changes (`#formModal`).

## Do
- Keep modals to one decision or a handful of fields; anything larger is a page or a `.wiz`.
- Wire all three close paths: `data-close` buttons, backdrop click, and Escape.
- Render modal markup as static top-level elements (the demo keeps them outside the swapped stage so they're always available).

## Don't
- Don't stack modals or open one from another.
- Don't omit the ghost escape route in a confirm — the danger button must never be the only option.

## HTML Reference
```html
<!-- From components.html (#demoModal) -->
<div class="modal-overlay" id="demoModal">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="demoModalTitle">
    <div class="modal__head">
      <span id="demoModalTitle">Cancel reservation?</span>
      <button class="icon-btn" data-close style="width:32px;height:32px" aria-label="Close"><!-- RD.icon("close") --></button>
    </div>
    <div class="modal__body">
      <p class="t-sm text-secondary">Cancelling HF-24810 will refund SAR 180 to the customer and release Padel Court B, 7:30 PM back to availability.</p>
    </div>
    <div class="modal__foot">
      <button class="btn btn--ghost" data-close>Keep booking</button>
      <button class="btn btn--danger" data-close>Cancel booking</button>
    </div>
  </div>
</div>
<!-- Open:  document.getElementById("demoModal").classList.add("is-open") -->
```

## CSS Reference
`assets/css/components.css` → `MODAL (live)` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
