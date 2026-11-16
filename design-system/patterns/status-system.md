# Pattern — Status System

One vocabulary for booking lifecycle state, used identically in tables, drawers, cards, and
calendars. Never restyle status ad hoc — the palette is a token contract.

## The eight states

| State | Class | Tokens | Meaning |
|---|---|---|---|
| Pending | `.status--pending` | `--status-pending-*` | awaiting payment/confirmation — **pulses** |
| Confirmed | `.status--confirmed` | `--status-confirmed-*` | locked in |
| Checked in | `.status--checkedin` | `--status-checkedin-*` | guest on site — **pulses** |
| Checked out | `.status--checkedout` | `--status-checkedout-*` | session over, guest left |
| Completed | `.status--completed` | `--status-completed-*` | fulfilled & settled |
| Cancelled | `.status--cancelled` | `--status-cancelled-*` | terminated |
| Refunded | `.status--refunded` | `--status-refunded-*` | money returned |
| Waitlist | `.status--waitlist` | `--status-waitlist-*` | queued |

Markup: `<span class="status status--confirmed"><span class="dot"></span>Confirmed</span>`
Live states (checked-in, pending) get a gentle dot pulse from `assets/shell.css`, disabled
under reduced motion.

## The package lifecycle (second vocabulary, 2026-09-08)

Packages have their own lifecycle — approval, not attendance — so they get their own
classes rather than borrowing booking ones whose names mean something else. They reuse the
**existing token triplets**: four near-identical palettes would be token bloat, and green
already reads as "good, live" in both vocabularies.

Packages carry **two independent axes**, shown as two badges, never combined into one
state. Approval is the Super Admin's verdict; Active/Inactive is the partner's own
visibility switch — a package can be Pending Approval *and* Inactive at the same time.

**Approval**

| State | Class | Tokens | Meaning |
|---|---|---|---|
| Pending Approval | `.status--pending` | `--status-pending-*` | submitted, waiting for Super Admin |
| Approved | `.status--approved` | `--status-confirmed-*` | cleared by the Super Admin |
| Rejected | `.status--rejected` | `--status-cancelled-*` | rejected with a reason |

**Status**

| State | Class | Tokens | Meaning |
|---|---|---|---|
| Active | `.status--live` | `--status-checkedin-*` | switched on by the partner — **does not pulse** |
| Inactive | `.status--inactive` | `--status-waitlist-*` | switched off |

Three notes that generalise beyond packages:
- **Pulse is for the exceptional, not the normal.** `checked-in` pulses because a handful of
  guests are on-site right now; `Active` doesn't, because most rows in a package list are
  active and the page would strobe.
- **Two axes, two badges.** Where a record has independent lifecycles (an approval workflow
  *and* an on/off switch), give each its own column and its own badge. Combined states
  ("Approved · Policy required", "Active · Pending changes") were tried on the Packages
  list and dropped at review: they multiply the vocabulary, and they hide which of the two
  things actually changed.
- **`.status__flag`** marks a *second, concurrent* state on one badge. It has no product
  consumer today (the combined states above were its only one) and survives for cases where
  a second axis genuinely doesn't deserve its own column. Prefer two badges.

## Rules

- The **availability** palette (`--avail-free/partial/booked/blocked`) is a separate
  vocabulary for capacity (scheduler/calendar cells) — don't mix it with booking status.
- Generic `.badge` tones (`--success`, `--warning`…) are for *non-lifecycle* labels (Paid,
  New, Overdue). If it's a booking lifecycle state, it must be a `.status--*`.
- Status is always color + dot + label — never color alone.
- New lifecycle states are a token + component change (governance, MINOR bump), not a
  per-screen improvisation. A whole new **domain** vocabulary (as packages did above) is
  documented here as its own table; reuse the existing token triplets unless the new
  states genuinely need colours the palette doesn't have.

## Components composed
`status-badge`, `badge`, tokens (`design-tokens.md` domain palettes).
