---
id: command-palette
name: Command palette (⌘K)
category: Navigation
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.rd-cmdk, .rd-cmdk__panel, .rd-cmdk__head, .rd-cmdk__input, .rd-cmdk__list, .rd-cmdk__group, .rd-cmdk__item, .rd-cmdk__empty, .rd-cmdk__foot]
source-css: assets/shell.css
source-demo: every page (shell chrome — press ⌘K / Ctrl+K)
related: [modal, menu]
---

# Command palette (⌘K)

## Purpose
Keyboard-first jump-to-anything: every page, feature story and shell action behind one
input. The topbar search advertised ⌘K since day one — this is that promise, kept. The
topbar search field itself is a trigger (focus opens the palette), so the product has
one search surface, not two.

## Description
Shell chrome (`assets/shell.js` → `initCmdk`, booted on every page). A centered
top-aligned panel over the page overlay: search input with Esc hint, a grouped listbox
(**Pages** — from `RD.FLAT` · **Features** — from `window.HF.FEATURES` · **Actions** —
theme/direction toggles), and a footer with key hints. Filtering is case-insensitive
substring over label + group; in Arabic mode the items are already Arabic because
`arInit()` mutates the nav model before the palette reads it.

## Variants
None — one palette per app.

## States
| State | Trigger | Appearance |
|---|---|---|
| Open | ⌘K / Ctrl+K, or focusing the topbar search | panel drops in (reduced-motion safe) |
| Active row | ArrowUp/Down or hover | `--color-primary-subtle` wash |
| Empty | query matches nothing | "No results…" copy, no ghost rows |
| Closed | Esc, backdrop click, or executing an item | removed from view; state resets on reopen |

## Properties
| Property | How |
|---|---|
| Items | pages (icon + title + group crumb), stories (feature crumb), actions |
| Execute | Enter or click → navigate / run, palette closes |
| Shortcut | ⌘K toggles (also closes when open) |

## Responsive Behaviour
≤ 640: panel starts near the top (small padding), max-height 78vh; same interactions.
Touch users reach it from the topbar search field.

## Accessibility
- Panel is `role="dialog" aria-modal="true"`; list is `role="listbox"`, items `role="option"`.
- Focus lands in the input on open; arrows move the active option; Esc always closes.
- The trigger search input keeps its `aria-label`; blurring it into the palette is
  announced by the dialog's label.

## Dependencies
Shell (`RD.FLAT`, `HF.FEATURES`, icon set), overlay/z-modal tokens. No page code — it
exists everywhere `RD.boot` runs.

## Related Components
- [menu.md](menu.md) — small contextual lists; the palette is global.
- [modal.md](modal.md) — same overlay contract.

## Usage Examples
- "qr" → the four QR Management stories.
- "dark" / "سمة" → Toggle theme action.

## Do
- Add new global destinations to `RD.NAV` / `features.js` — the palette picks them up.
- Keep action labels verb-first ("Toggle theme").

## Don't
- Don't build page-local palettes; extend the item sources instead.
- Don't advertise shortcuts the shell doesn't bind.

## HTML Reference
Rendered by the shell — pages never write this markup. Programmatic open: `RD.cmdk()`.

## CSS Reference
`assets/shell.css` → `COMMAND PALETTE` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-20 | Initial build — P1 item, closed the ⌘K honesty gap (06-gap-analysis-roadmap.md) |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
