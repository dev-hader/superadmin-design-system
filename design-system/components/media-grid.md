---
id: media-grid
name: Media grid
category: Forms
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.media-grid, .media-thumb, .media-thumb--cover, .media-thumb__name, .media-thumb__del]
source-css: assets/css/components.css
source-demo: components.html
related: [file-upload, progress-indicators, card, empty-state, lightbox]
---

# Media grid

## Purpose
Show the images a user has attached — as pictures, not filenames — each removable, so an
upload field reads as a gallery once it has content.

## Description
`.media-grid` is an auto-filling grid of `.media-thumb` tiles (min 120px, `16/9`
aspect-ratio, `--radius-md`) that replaces the [dropzone](file-upload.md) once at least one
image exists. Each tile crops its `<img>` with `object-fit: cover`, captions it with a
truncating `.media-thumb__name` over the overlay token, and carries a round
`.media-thumb__del` in the trailing top corner that turns danger-toned on hover.
`.media-thumb--cover` spans the whole row at a wider `16/6` ratio for a single hero image.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Gallery tile | `.media-thumb` | One of many images |
| Cover tile | `.media-thumb media-thumb--cover` | The single lead image — spans the grid, wider crop |

## States
| State | Trigger | Appearance |
|---|---|---|
| Empty | no images | Grid not rendered — the `.dropzone` shows instead |
| Populated | ≥1 image | Tiles with preview, caption and remove control |
| Remove hover | `:hover` on `.media-thumb__del` | Button fills `--color-danger` |
| At maximum | page logic | "Add more" is disabled and the count is stated |
| Uploading | page logic | Use `file-upload`'s `.file-row` + `.progress` beneath the grid |

## Properties
| Property | How |
|---|---|
| Preview | `<img src>` — an object URL locally, the stored asset URL after upload |
| Caption | `.media-thumb__name` — the filename, ellipsised |
| Remove | `.media-thumb__del` with `RD.icon("close")` and an `aria-label` naming the image |
| Tile size | Grid `minmax(120px, 1fr)` — the page doesn't set widths |
| Add / replace | A `.btn.btn--secondary.btn--sm` under the grid ("Add more", "Replace") |

## Responsive Behaviour
The `auto-fill` track does the work: four tiles at content width, two on tablet, one at
phone width, with no media query. The cover tile always spans the full row, so it simply
gets shorter. Captions truncate rather than wrap at every size.

## Accessibility
- Every `<img>` needs real `alt` text — the filename is an acceptable fallback, an empty
  `alt` is not, because the tile carries no other text description.
- Remove buttons must name their image: `aria-label="Remove cover-hero.png"`.
- The caption sits on `--color-overlay` with `--color-text-inverse`; don't swap in a
  lighter overlay, it is what keeps the filename readable over arbitrary photos.
- Rejections (wrong type, over size) must be announced — the grid changing shape is not
  feedback. Use a [toast](toast.md) and keep the already-attached images untouched.
- Keep click-to-browse working alongside drag-and-drop; the grid is not a drop target on
  its own.

## Dependencies
Tokens: surface-sunken, border, overlay, text-inverse, danger, radius (md/full), spacing,
text-xs. Pairs with [file-upload](file-upload.md) (`.dropzone`, and `.file-row` +
`.progress` for in-flight uploads). Page JS owns previews, limits and removal.

## Related Components
- [lightbox](lightbox.md) — the full-size viewer a thumbnail opens. A read-only gallery pairs the two; an upload field uses the grid alone.
- [file-upload.md](file-upload.md) — the pick/drop target and the per-file progress rows;
  this component is the *result* view for images. Documents stay as `.file-row`s.
- [empty-state.md](empty-state.md) — for a gallery on a read-only page with no images.

## Usage Examples
- Create Package "Cover Image": a single `--cover` tile with a Replace action, shown
  instead of the dropzone once an image is chosen.
- Same reference, "Package Gallery": up to ten tiles with "Add more" and a
  "3 of 10 images" count; PNG/JPG over 10MB is rejected with a toast and no tile added.

## Do
- Replace the dropzone with the grid once there is content — don't show both.
- State the limit and the current count next to the add action.
- Revoke object URLs when a tile is removed.

## Don't
- Don't show images as `.file-row` filename rows — that's for documents.
- Don't drop a rejected file silently; say why in a toast.
- Don't set fixed tile widths on the page; the grid's track is the contract.

## HTML Reference
```html
<!-- Empty: the dropzone owns the field -->
<button type="button" class="dropzone">
  <!-- RD.icon("camera") --><b>Click to upload or drag and drop</b>
  <span class="t-xs">PNG, JPG up to 10MB · recommended 16:9</span>
</button>

<!-- Cover chosen -->
<div class="media-grid">
  <div class="media-thumb media-thumb--cover">
    <img src="blob:…" alt="cover-hero.png">
    <span class="media-thumb__name">cover-hero.png</span>
    <button type="button" class="media-thumb__del" aria-label="Remove cover-hero.png">
      <!-- RD.icon("close") --></button>
  </div>
</div>
<div class="row gap-2" style="margin-block-start:var(--space-2)">
  <button type="button" class="btn btn--secondary btn--sm">Replace</button>
</div>

<!-- Gallery -->
<div class="media-grid">
  <div class="media-thumb">
    <img src="blob:…" alt="padel-court.jpg">
    <span class="media-thumb__name">padel-court.jpg</span>
    <button type="button" class="media-thumb__del" aria-label="Remove padel-court.jpg">
      <!-- RD.icon("close") --></button>
  </div>
  <!-- … -->
</div>
<div class="row gap-2" style="margin-block-start:var(--space-2)">
  <button type="button" class="btn btn--secondary btn--sm">Add more</button>
  <span class="t-xs text-tertiary">3 of 10 images</span>
</div>
```

## CSS Reference
`assets/css/components.css` → `LONG-FORM COMPOSITION SET` section, block 6.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-08 | Initial build — composed for Packages US1 Create Package, promoted per rules §2.3 |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
