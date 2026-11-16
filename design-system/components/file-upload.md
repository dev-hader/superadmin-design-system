---
id: file-upload
name: File Upload
category: Forms
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.dropzone, .file-row, .file-row__icon]
source-css: assets/css/components.css
source-demo: components.html
related: [progress-indicators, alert, card]
---

# File Upload

## Purpose
Two-part upload pattern: a `.dropzone` target for choosing files, and `.file-row` entries showing each file's progress or result.

## Description
The dropzone is a full-width dashed-border panel (`--radius-lg`, sunken surface) with an upload icon, a bold prompt and a caption line; hovering tints it with the primary subtle palette to signal it's a live target. Each queued file renders as a `.file-row` — a bordered card row with a 36px tinted `.file-row__icon`, a name/meta column, and a trailing icon button. Uploading rows embed a `.progress` bar; completed rows swap the icon tint to success. Drag-and-drop wiring and progress updates are page JS.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Dropzone | `.dropzone` | The pick/drop target above the file list |
| File row — uploading | `.file-row` + embedded `.progress` | In-flight upload with percent |
| File row — done | `.file-row` with success-tinted `.file-row__icon` | Completed upload with size/status meta |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | 1.5px dashed `--color-border-strong`, `--color-surface-sunken` bg, tertiary text |
| Hover (dropzone) | `:hover` | `--color-primary` border, `--color-primary-subtle` bg, primary text |
| Uploading (row) | `.progress__bar` width via JS | Progress bar + percent caption |
| Uploaded (row) | JS swaps icon/meta | Success-tinted icon, "1.2 MB · Uploaded" meta |

## Properties
| Property | How |
|---|---|
| Prompt / constraints | `<b>` headline + caption span inside the dropzone ("PNG, JPG up to 10MB") |
| File-type icon | Any 18px icon in `.file-row__icon`; tint via `--color-primary-subtle` (default) or success tokens |
| Row action | Trailing `.icon-btn` — "Cancel" while uploading, "Remove" when done |

## Responsive Behaviour
No intrinsic breakpoint changes. The demo lays dropzone and file list in a two-column grid that collapses with the page grid; both pieces are `width: 100%` friendly.

## Accessibility
- The dropzone needs a real input: pair it with a visually hidden `<input type="file">` (or open one on click/Enter) — a styled div alone is not keyboard-accessible.
- State file constraints (types, max size) as visible text in the dropzone, not only in error toasts.
- Trailing row buttons must carry `aria-label` ("Cancel", "Remove") — the demos do.
- Give the progress bar `role="progressbar"` with `aria-valuenow` when wiring real uploads.
- Announce completion/failure (e.g. toast or live region) — color-tint change alone is not enough.

## Dependencies
Tokens: color (border/surface/primary/success subtle pairs), radius (lg/md/sm), spacing, motion-fast. Embeds `.progress` and `.icon-btn`. Requires page JS for drag/drop, progress and row state.

## Related Components
- [progress-indicators.md](progress-indicators.md) — the `.progress` bar embedded in uploading rows.
- [alert.md](alert.md) — for upload-wide failures (wrong type, over limit).
- [card.md](card.md) — file rows share the bordered-surface row language.

## Usage Examples
- "Drop venue photos here … PNG, JPG up to 10MB" dropzone in the venue-onboarding template.
- `court-a-hero.jpg` uploading row at 72% with a Cancel button.
- `license.pdf` completed row ("1.2 MB · Uploaded") with success icon and Remove button.

## Do
- Show each file as its own `.file-row` so individual cancel/remove is possible.
- Put allowed types and size limits in the dropzone caption up front.
- Switch the row icon tint to the success pair only when the upload has actually finished.

## Don't
- Don't make drag-and-drop the only path — click-to-browse must always work.
- Don't remove a failed row silently; keep it visible with the error and a retry/remove action.
- Don't nest a dropzone inside a modal footer or other cramped container — it needs its padding to read as a target.

## HTML Reference
```html
<div class="dropzone">
  <!-- RD.icon("upload") -->
  <b>Drop venue photos here</b>
  <span class="t-xs">or click to browse · PNG, JPG up to 10MB</span>
</div>

<!-- Uploading -->
<div class="file-row">
  <span class="file-row__icon"><!-- RD.icon("card") --></span>
  <div style="flex:1;min-width:0">
    <div class="t-sm" style="font-weight:600">court-a-hero.jpg</div>
    <div class="row gap-3" style="margin-top:6px;align-items:center">
      <div class="progress" style="flex:1"><div class="progress__bar" style="width:72%"></div></div>
      <span class="t-xs text-tertiary">72%</span>
    </div>
  </div>
  <button class="icon-btn" style="width:32px;height:32px" aria-label="Cancel"><!-- close --></button>
</div>

<!-- Done -->
<div class="file-row">
  <span class="file-row__icon" style="background:var(--color-success-subtle);color:var(--color-success)"><!-- check2 --></span>
  <div style="flex:1;min-width:0">
    <div class="t-sm" style="font-weight:600">license.pdf</div>
    <div class="t-xs text-tertiary">1.2 MB · Uploaded</div>
  </div>
  <button class="icon-btn" style="width:32px;height:32px" aria-label="Remove"><!-- close --></button>
</div>
```

## CSS Reference
`assets/css/components.css` → `FILE UPLOAD` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
