---
id: status-badge
name: Status badge
category: Identity
status: stable
version: 1.2.0
owner: Design System Maintainer
css-classes: [.status, .status--pending, .status--confirmed, .status--checkedin, .status--checkedout, .status--completed, .status--cancelled, .status--refunded, .status--waitlist, .status--approved, .status--live, .status--rejected, .status--inactive, .status__flag, .dot, .status--frozen]
source-css: assets/css/components.css
source-demo: bookings.html
related: [badge, data-table, scheduler]
---

# Status badge

## Purpose
The single way to render a booking's lifecycle stage — a dot + label pill with one fixed color per state, everywhere a booking appears.

## Description
A 24px pill (`--radius-full`, `--text-xs`, semibold, `white-space: nowrap`, `flex-shrink: 0`) containing a 7px `.dot` and a text label. Each of the eight modifiers maps background, text and dot to a dedicated token triple (`--status-{state}-bg/-fg/-dot`) defined in `tokens.css`, with dark-theme overrides swapping backgrounds to alpha tints and foregrounds to lighter shades. The two "live" states pulse: `assets/shell.css` adds an expanding `::after` ring on the dot for `.status--checkedin` and `.status--pending`.

## The subscription lifecycle (third vocabulary, 2026-09-29)

A subscription is not a booking and not a package. Five of its six states reuse classes
that already exist; only **Frozen** needed a new one.

| State | Class | Tokens | Meaning |
|---|---|---|---|
| Upcoming | `.status--confirmed` | `--status-confirmed-*` | bought, has not started |
| Active | `.status--live` | `--status-checkedin-*` | running now |
| **Frozen** | **`.status--frozen`** | `--status-refunded-*` (violet) | **paused — comes back** |
| Expired | `.status--inactive` | `--status-waitlist-*` | ran its course |
| Cancelled | `.status--rejected` | `--status-cancelled-*` | ended early |
| Upgraded | `.status--inactive` | `--status-waitlist-*` | replaced by another subscription; carries "→ {new plan}" |

**Frozen took no new tokens.** The violet `--status-refunded-*` triplet already exists in
both themes, and `status-system.md` asks for exactly this — reuse a triplet rather than
mint a fourth near-identical palette. Grey was the obvious alternative and the wrong one:
it would have read the same as Expired, which is the opposite situation. One comes back.

**Upgraded and Expired deliberately share a tone**, distinguished by their text. It is the
one place in this vocabulary where colour alone does not separate two states.

## Variants
| Variant | Class | Tokens | Use when |
|---|---|---|---|
| Pending | `.status status--pending` | `--status-pending-*` (amber) | Awaiting confirmation/payment — pulses |
| Confirmed | `.status status--confirmed` | `--status-confirmed-*` (navy) | Booked and locked in |
| Checked in | `.status status--checkedin` | `--status-checkedin-*` (green) | Guest is on-site now — pulses |
| Checked out | `.status status--checkedout` | `--status-checkedout-*` (sky) | Guest left, session not yet closed |
| Completed | `.status status--completed` | `--status-completed-*` (teal) | Fully closed out |
| Cancelled | `.status status--cancelled` | `--status-cancelled-*` (red) | Booking was cancelled |
| Refunded | `.status status--refunded` | `--status-refunded-*` (violet) | Money returned |
| Waitlist | `.status status--waitlist` | `--status-waitlist-*` (slate) | Queued for a slot |

**Package lifecycle** — a second vocabulary over the same token palette (no new tokens; see [`../patterns/status-system.md`](../patterns/status-system.md)). It runs on **two independent axes**, one badge each, never combined:

*Approval* — the Super Admin's verdict:

| Variant | Class | Tokens | Use when |
|---|---|---|---|
| Pending Approval | `.status status--pending` | `--status-pending-*` (amber) | Submitted, waiting for Super Admin — shared with the booking vocabulary |
| Approved | `.status status--approved` | `--status-confirmed-*` (navy) | Cleared by the Super Admin |
| Rejected | `.status status--rejected` | `--status-cancelled-*` (red) | Rejected with a reason; pair with an info icon opening a [popover](popover.md) |

*Status* — the partner's own visibility switch, independent of approval:

| Variant | Class | Tokens | Use when |
|---|---|---|---|
| Active | `.status status--live` | `--status-checkedin-*` (green) | Switched on. Does **not** pulse: a list of live records would strobe |
| Inactive | `.status status--inactive` | `--status-waitlist-*` (slate) | Switched off |

**Ticket lifecycle** (ADO #2868, Support › My Tickets) — a fourth vocabulary over the same
token palette, **no new tokens**:

| Variant | Class | Tokens | Use when |
|---|---|---|---|
| Open | `.status status--pending` | `--status-pending-*` (amber) | Sent, not yet picked up — pulses |
| In Progress | `.status status--checkedin` | `--status-checkedin-*` (green) | HighFive is actively on it — pulses |
| Awaiting your reply | `.status status--frozen` | `--status-refunded-*` (violet) | Paused on HighFive's side until the partner responds |
| Closed | `.status status--completed` | `--status-completed-*` (teal) | Resolved, read-only |
| Cancelled | `.status status--cancelled` | `--status-cancelled-*` (red) | Partner withdrew it while still Open |

`.status__flag` is a 6px trailing dot marking a **second, concurrent** state on one badge.
It has **no product consumer today** — the combined states it was built for
("Active · Pending changes") were dropped at review in favour of two columns. Prefer two
badges; reach for the flag only when a second axis genuinely doesn't deserve its own column.

## States
| State | Trigger | Appearance |
|---|---|---|
| Static | any of the 8 modifiers | Token bg + fg, dot in the `-dot` token color |
| Live pulse | `--checkedin` / `--pending` only | Dot gains a `rd-dot-pulse` ring (1.8s, infinite) via `shell.css` |
| Reduced motion | `prefers-reduced-motion: reduce` | Pulse ring removed entirely (`animation: none; display: none`) |

## Properties
One size only. The `.dot` child is required — the pill is always dot + label together.

## Responsive Behaviour
None; `nowrap` + `flex-shrink: 0` keep it intact in tight table rows and the stacked mobile card view.

## Accessibility
- The label text is the source of truth for screen readers; the dot is decorative (mark it `aria-hidden="true"`).
- Never color-only: all eight states carry distinct visible words.
- The pulse honours `prefers-reduced-motion` in `shell.css`.

## Dependencies
Tokens: the `--status-*-fg/-bg/-dot` triples in `tokens.css` (light block + dark-theme overrides). Pulse animation: `assets/shell.css` (`rd-dot-pulse`). No JS.

## Related Components
- [badge.md](badge.md) — generic tones for everything that is *not* a booking lifecycle state.
- [data-table.md](data-table.md) — the Status column renderer in Bookings.
- [scheduler.md](scheduler.md) — event popovers render the same pill.

## Usage Examples
- Status column of the Bookings table (`bookings.html`, rendered per-row from `r.status`).
- Event detail rows in Scheduling (`scheduling.html`).
- Confirmation header in the booking-detail template (`templates.html`).

## Do
- Use exactly these 8 values — the set mirrors the `booking_status` domain.
- Keep dot + label together, colors from the status palette only.
- Let pending/checked-in pulse — it signals "live" states on busy screens.

## Don't
- Don't invent a ninth status ad hoc.
- Don't recolor a status per page "to match" a theme.
- Don't animate transitions between values — the underlying status changes, the badge does not tween.

## HTML Reference
```html
<span class="status status--pending"><span class="dot"></span>Pending</span>
<span class="status status--confirmed"><span class="dot"></span>Confirmed</span>
<span class="status status--checkedin"><span class="dot"></span>Checked in</span>
<span class="status status--checkedout"><span class="dot"></span>Checked out</span>
<span class="status status--completed"><span class="dot"></span>Completed</span>
<span class="status status--cancelled"><span class="dot"></span>Cancelled</span>
<span class="status status--refunded"><span class="dot"></span>Refunded</span>
<span class="status status--waitlist"><span class="dot"></span>Waitlist</span>
```

## CSS Reference
`assets/css/components.css` → `BADGES / TAGS / CHIPS / AVATAR` section (`.status` block). Tokens: `assets/css/tokens.css` → status palette (`--status-*-fg/bg/dot`, plus dark overrides). Pulse: `assets/shell.css` → "Status dots pulse gently for live states".

## Version
| Version | Date | Change |
|---|---|---|
| 1.2.0 | 2026-11-05 | Added the ticket lifecycle vocabulary (Open/In Progress/Awaiting your reply/Closed/Cancelled), reusing the existing token triplets. Built for Support › My Tickets (ADO #2868), promoted per rules §2.3 |
| 1.1.0 | 2026-09-08 | Added the package lifecycle vocabulary (`--approved`, `--live`, `--rejected`, `--inactive`) plus `.status__flag`, mapped onto the existing token triplets rather than duplicating four palettes. Built for Packages US2, promoted per rules §2.3 |
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
