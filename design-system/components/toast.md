---
id: toast
name: Toast / snackbar
category: Feedback
status: stable
version: 1.1.0
owner: Design System Maintainer
css-classes: [.toast, .toast--success, .toast--danger, .toast__icon, .toast__action, .toast-stack]
source-css: assets/css/components.css
source-demo: components.html (Feedback → Toast — live RD.toast() queue)
related: [alert, payment-result, progress-indicators]
pattern: ../patterns/toast-queue.md
---

# Toast / snackbar

## Purpose
A transient, non-blocking confirmation or notice that appears briefly after an action — "Customer checked in successfully" — then removes itself.

## Description
A dark pill-shaped bar (`--navy-900` background, white text, `--shadow-lg`, `--radius-md`, max-width 380px) with a 20px leading icon, a `--text-sm` message, and an optional trailing control. The trailing slot is either a dismiss button (muted white, full white on hover, pushed to the end by `margin-inline-start: auto`) or an inline action like Undo/Retry. Only one color variant exists as a class — `.toast--success` tints the icon `--green-300`; the demo composes info/warning/danger tones by coloring the icon inline (`--lime-300`, `--amber-300`, `--red-300`).

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.toast` | Neutral notices; tone set by the icon color |
| Success | `.toast toast--success` | Positive confirmations — the icon goes `--green-300` |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Dark bar, white text, elevated shadow |
| Dismiss hover | `:hover` on trailing button | Icon brightens from 60% white to full white |

## Properties
| Property | How |
|---|---|
| Icon | Leading `<span class="toast__icon">` with an 18–20px SVG |
| Action | Trailing `<button>` with a colored bold label (Undo, Retry) |
| Dismiss | Trailing icon `<button aria-label="Dismiss">` |

## Responsive Behaviour
`max-width: 380px` keeps toasts column-shaped on desktop; on narrow screens they shrink with their container. No breakpoint-specific rules.

## Accessibility
- Announce via a polite live region (`role="status"` / `aria-live="polite"`); toasts must not steal focus.
- The dismiss button needs `aria-label="Dismiss"`.
- Never put required information only in a toast — it disappears. Anything the user must act on belongs in an alert or dialog.
- White-on-navy and the 300-series icon tints are chosen for contrast on the dark bar in both themes.

## Behaviour & Stacking — `RD.toast()` (v1.1.0)

Timing and stacking are no longer app-level: the shell ships the shared emitter
`RD.toast(kind, msg, { action, onAction, duration })` which owns the `#rdToasts`
`.toast-stack` and enforces the queue contract — newest on top, **max 3 visible**,
auto-dismiss **5s** (**8s** with an action), timer pauses on hover, `role="status"`
(polite) / `role="alert"` for danger. Full rules, the Undo-over-confirm policy and
copy contracts: [patterns/toast-queue.md](../patterns/toast-queue.md).

## Dependencies
Tokens: `--navy-900`, `--green-300` (and lime/amber/red 300s for inline tones), shadow/radius/type scale. JS: `RD.toast` in `assets/shell.js`; CSS styles the bar + stack.

## Related Components
- [alert.md](alert.md) — persistent and inline; use when the message must stay until resolved.
- [payment-result.md](payment-result.md) — full-card checkout outcome; pair a toast for quieter post-checkout confirmations.
- [progress-indicators.md](progress-indicators.md) — for ongoing work rather than a finished outcome.

## Usage Examples
- "Customer checked in successfully" (`.toast--success`) after a front-desk check-in.
- "Draft saved" with an **Undo** action.
- "Slow connection - retrying sync" warning tone; "Could not reach the payment gateway" with **Retry**.

## Do
- Keep messages to one short sentence in plain words.
- Offer Undo instead of a confirm dialog for easily reversible actions.
- Cap at three; drop the oldest when a fourth arrives.

## Don't
- Don't use toasts for errors that require user action — those persist as alerts.
- Don't stack from the bottom or reorder — newest is always on top.
- Don't auto-dismiss faster than 4s; users must be able to read it.

## HTML Reference
```html
<div class="toast toast--success" role="status">
  <span class="toast__icon"><!-- RD.icon("check") --></span>
  <p>Customer checked in successfully</p>
  <button aria-label="Dismiss"><!-- RD.icon("close") --></button>
</div>

<div class="toast" role="status">
  <span class="toast__icon" style="color:var(--lime-300)"><!-- RD.icon("info") --></span>
  <p>Draft saved</p>
  <button style="margin-inline-start:var(--space-3);color:var(--lime-300);font-weight:600">Undo</button>
</div>
```

## CSS Reference
`assets/css/components.css` → `FEEDBACK: alert / banner / toast / tooltip / progress / skeleton` section (`.toast` block).

## Version
| Version | Date | Change |
|---|---|---|
| 1.1.0 | 2026-07-20 | `RD.toast` shared emitter + `.toast-stack`/`.toast__action` promoted to system CSS; queue contract moved into patterns/toast-queue.md |
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
