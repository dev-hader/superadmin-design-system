---
id: notifications-center
name: Notifications center
category: Overlays
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.rd-notif, .rd-notif__scrim, .rd-notif__panel, .rd-notif__head, .rd-notif__mark, .rd-notif__list, .rd-notif__day, .rd-notif__item, .rd-notif__body, .rd-notif__unread, .rd-notif__empty, .rd-notif__foot, .rd-notif-dot]
source-css: assets/shell.css
source-demo: every page (shell chrome — the topbar bell)
related: [drawer, toast, badge]
---

# Notifications center

## Purpose
In-product inbox behind the topbar bell: booking changes, payments, waitlist promotions
surface **inside** the product, not only by email. Toasts announce what just happened;
the center is where it can still be found an hour later.

## Description
Shell chrome (`assets/shell.js` → `initNotif`, booted on every page). The bell carries
a danger `.rd-notif-dot` while anything is unread (survives navbar style switches — the
wiring is delegated). Clicking opens an inline-end drawer: header (title + "Mark all as
read" + close), a scrollable list grouped by day (`.rd-notif__day`: Today / Yesterday /
…), and a "Clear all" footer. Item = icon chip + title/body/time + green unread dot;
clicking an item marks it read (`.is-read` mutes it). Clearing everything shows the
empty state ("You're all caught up"). Reference data is sample; the real product feeds
the same markup from the API.

## Variants
None. (Grouping is by day; category tabs are a future extension via governance.)

## States
| State | Trigger | Appearance |
|---|---|---|
| Unread badge | any unread item | 8px danger dot on the bell |
| Unread item | `unread: true` | semibold title + green dot |
| Read item | click / mark all | `.is-read` — muted title, dot hidden |
| Empty | Clear all / no items | bell glyph + "You're all caught up" |
| Open/closed | bell / Esc / scrim / × | drawer slides from inline-end (RTL-aware, reduced-motion safe) |

## Responsive Behaviour
Panel is `min(400px, 92vw)` — near-full-width sheet on phones, fixed drawer on desktop.
List scrolls independently; header/footer stay pinned.

## Accessibility
- Panel is `role="dialog" aria-modal="true" aria-label="Notifications"`; Esc closes.
- Items are full `<button>`s — title, body and time are all inside the accessible name.
- The unread dot is decorative; unread state is conveyed by the item being a semibold
  button before its first activation.

## Dependencies
Shell icon set, kpi-ic chips, overlay/z-modal tokens, danger + primary tokens. No page
code — exists everywhere `RD.boot` runs.

## Related Components
- [toast.md](toast.md) — the moment something happens; the center is its memory.
- [drawer.md](drawer.md) — same surface family; this one is shell-owned.
- [badge.md](badge.md) — the dot pattern on the bell.

## Usage Examples
- New booking lands → toast now + unread item under Today.
- Payout settled → revenue-icon item; opening the center clears the bell dot as items
  are read.

## Do
- Keep titles event-first ("Payout settled") and bodies one sentence with the numbers.
- Group strictly by day labels the vocabulary knows (Today/Yesterday translate to اليوم/أمس).

## Don't
- Don't use it for field errors or confirmations — those are toasts/dialogs.
- Don't auto-open it; the user opens their inbox.

## HTML Reference
Rendered by the shell — pages never write this markup.

## CSS Reference
`assets/shell.css` → `NOTIFICATIONS CENTER` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-20 | Initial build — P0 item (06-gap-analysis-roadmap.md) |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
