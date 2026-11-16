---
id: lightbox
name: Lightbox
category: Overlays
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.lightbox, .lightbox__img, .lightbox__close, .lightbox__nav, .lightbox__nav--prev, .lightbox__nav--next, .lightbox__count]
source-css: assets/css/components.css
source-demo: components.html
related: [media-grid, modal, file-upload, drawer]
---

# Lightbox

## Purpose
Show one image from a gallery at full size, with a way to step through the rest — the
answer to clicking a thumbnail.

## Description
`.lightbox` is a fixed, full-viewport overlay that becomes a centring flex container with
`.is-open`. It holds a single `.lightbox__img` capped at `82vh` and `1100px`, two circular
`.lightbox__nav` buttons pinned to the inline edges, a `.lightbox__close` in the trailing
top corner, and a `.lightbox__count` pill ("3 / 5") at the bottom.

It sits at `--z-popover`, **above** the modal layer, because it is opened *from* cards and
modals and must cover whatever launched it. That is the one way it differs structurally
from [modal](modal.md) — everything else about it is deliberately plainer, because an
image viewer should disappear behind its image.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Gallery | `.lightbox` with both `.lightbox__nav` buttons and `.lightbox__count` | More than one image |
| Single image | `.lightbox` with the nav buttons and count omitted | Exactly one image — arrows that do nothing are worse than no arrows |

## States
| State | Trigger | Appearance |
|---|---|---|
| Closed | no `.is-open` | `display: none` |
| Open | `.is-open` | Flex overlay above the modal layer |
| Nav hover | `:hover` on a nav/close button | Surface lifts to `--color-surface-hover` |
| First / last image | page logic | The index **wraps** rather than disabling the arrows — a two-image gallery with a dead arrow reads as broken |

## Properties
| Property | How |
|---|---|
| Position in set | `.lightbox__count` text, e.g. `3 / 5` |
| Backdrop dismiss | Page logic: a click whose target **is** the overlay itself closes it |
| Keyboard | Page logic: `Escape` closes, `ArrowLeft` / `ArrowRight` step |
| RTL arrows | Handled by the stylesheet — the nav glyphs are mirrored with `scaleX(-1)` under `[dir="rtl"]`, so "next" always points along the reading direction |

## Responsive Behaviour
At **≤640px** the overlay padding drops to `--space-4` and the nav buttons move to
`--space-2` from the edges, so a 40px control never overlaps the image on a phone. The
image itself is already bounded by `max-inline-size: 100%` and `max-block-size: 82vh`.

## Accessibility
- `role="dialog"` + `aria-modal="true"` + an `aria-label` naming the gallery.
- Every control needs an `aria-label` — they are all icon-only.
- `Escape` must close it, and focus should return to the thumbnail that opened it.
- The `<img>` takes the caption as its `alt`; a decorative `alt=""` is only correct when
  the caption is already rendered as text beside it.
- No animation is defined, so there is nothing for `prefers-reduced-motion` to suppress —
  keep it that way; a zooming lightbox is a motion-sickness trigger.

## Dependencies
Tokens: `--z-popover`, `--color-overlay`, surface/border colours, radius, `--shadow-lg`,
`--duration-fast`, `--ease-standard`. No JS helper — open/close/step is page logic.

## Related Components
- [media-grid](media-grid.md) — the thumbnails this opens from; the two are almost always used together.
- [modal](modal.md) — for anything with content, controls or a decision. A lightbox shows one image and gets out of the way.

## Usage Examples
- **Packages › View Package › Details › Package Media**
  (`features/packages/us5-view-package.html`) — the cover plus gallery images, stepped with
  the arrows or the arrow keys, counted "2 / 5".

## Do
- Wrap the index, so the arrows always work.
- Close on backdrop click, on `Escape`, and on the close button — all three.
- Show the position in the set; a viewer with no count feels like a dead end.

## Don't
- Don't put actions (delete, download, set as cover) in the lightbox. It is a viewer;
  editing belongs to the [media-grid](media-grid.md) tile.
- Don't animate the open. See the accessibility note.
- Don't nest it under `--z-modal` — it will open behind the modal that launched it.

## HTML Reference
```html
<div class="lightbox" id="lbox" role="dialog" aria-modal="true" aria-label="Package image">
  <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image"><!-- chevronLeft --></button>
  <img class="lightbox__img" id="lboxImg" alt="">
  <button class="lightbox__nav lightbox__nav--next" aria-label="Next image"><!-- chevronRight --></button>
  <button class="lightbox__close" aria-label="Close"><!-- close --></button>
  <span class="lightbox__count" id="lboxCount">2 / 5</span>
</div>
```

## CSS Reference
`assets/css/components.css` → **RECORD PAGE SET** → *Lightbox*.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-28 | Promoted from Packages › View Package (rules §2.3) — the system had no full-size image viewer |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
