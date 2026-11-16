---
id: message-thread
name: Message thread
category: Data
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.msg-thread, .msg, .msg--out, .msg__bubble, .msg__name, .msg__text, .msg__time, .msg__attachments, .msg__attachment, .msg-thread__system]
source-css: assets/css/components.css
source-demo: features/support-tickets/us2-ticket-details.html
related: [activity-timeline, avatar, card, badge, file-upload]
---

# Message thread

## Purpose
A two-party conversation — one side's messages aligned start, the other's aligned end — for records where more than one named person can write, such as a support ticket.

## Description
`.msg-thread` stacks `.msg` rows newest-last. Each `.msg` pairs an `.avatar` with a `.msg__bubble` holding a `.msg__name` (the writer), `.msg__text` and a trailing `.msg__time`. The default alignment (icon/avatar first, bubble after, sunken background) reads as "the other party"; `.msg--out` reverses the row and tints the bubble with `--color-primary-subtle` to read as "you". A status or lifecycle change that isn't a message from either party renders as `.msg-thread__system` — a centered, muted line between messages — instead of a bubble, so the eye doesn't mistake a fact for dialogue.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Incoming | `.msg` | A message from the other party (e.g. HighFive Support) |
| Outgoing | `.msg msg--out` | A message from the current viewer's own side |
| System line | `.msg-thread__system` | A status change or other fact, not authored by either party |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Sunken bubble, avatar leads |
| Outgoing | `.msg--out` | Row reversed, primary-subtle bubble, name tinted primary |
| With attachments | message carries files | `.msg__attachments` row of `.msg__attachment` chips under the text |

## Properties
| Property | How |
|---|---|
| Writer name | `.msg__name` — always the real person ("Mona Khaled"), never a role alone, except the one fixed system identity ("HighFive Support") |
| Attachments | One `.msg__attachment` chip per file: a paperclip icon + filename |
| Timestamp | `.msg__time`, written out, not relative-only (same rule as [activity-timeline](activity-timeline.md)) |

## Responsive Behaviour
`.msg` caps at 72% of the thread's width so a short reply doesn't span the page; it reflows to any container width with no media query. On ≤768px the same 72% cap still reads comfortably since the thread container itself has already narrowed.

## Accessibility
- Render `.msg-thread` as a `role="log"` (or a plain list) so assistive tech announces new entries as a feed, not a static block.
- The writer name is real text, not color alone — `.msg--out`'s tint is a convenience, not the only signal of whose message it is.
- Attachment chips are links/buttons with the filename as their accessible name.
- Timestamps are absolute ("5 Nov 2026, 3:40 PM"), matching the activity-timeline rule.

## Dependencies
Tokens: surface-sunken, primary-subtle/-ink, border, radius (lg/full), spacing, text scale. Embeds [avatar](avatar.md) and, for attachments, the same file metaphor as [file-upload](file-upload.md). Pairs with [badge](badge.md) for an inline status pill inside a system line.

## Related Components
- [activity-timeline](activity-timeline.md) — single-rail facts about one record; reach for a message thread instead the moment a second named party can write entries too.
- [avatar](avatar.md) — the identity mark leading every `.msg`.
- [file-upload](file-upload.md) — the dropzone/file-row pair that produces the attachments a `.msg__attachment` chip displays after sending.

## Usage Examples
- **Support › Ticket details** (`features/support-tickets/us2-ticket-details.html`) — the partner (Owner or an employee, named) and "HighFive Support" replying in turn, with status changes ("Ticket set to In Progress") as system lines between them.

## Do
- Always name the actual writer on the partner side — several employees may reply on one ticket.
- Keep the fixed "HighFive Support" identity exactly as written; it is a team signature, not a person.
- Put a status change on its own `.msg-thread__system` line, never inside a bubble.

## Don't
- Don't use this for a single-author history — that's [activity-timeline](activity-timeline.md).
- Don't color-code by party beyond the subtle tint; the name text is what actually disambiguates.
- Don't stack attachments inside the text line — they get their own `.msg__attachments` row.

## HTML Reference
```html
<div class="msg-thread" role="log">
  <div class="msg">
    <span class="avatar" style="--_s:32px">HS</span>
    <div class="msg__bubble">
      <span class="msg__name">HighFive Support</span>
      <p class="msg__text">Thanks for the details — we're looking into the pricing issue now.</p>
      <span class="msg__time">5 Nov 2026, 10:12 AM</span>
    </div>
  </div>

  <div class="msg-thread__system">
    <span class="badge">Status changed to In Progress</span>
  </div>

  <div class="msg msg--out">
    <span class="avatar" style="--_s:32px">MK</span>
    <div class="msg__bubble">
      <span class="msg__name">Mona Khaled</span>
      <p class="msg__text">Here's a screenshot of the wrong price.</p>
      <div class="msg__attachments">
        <span class="msg__attachment"><!-- RD.icon("paperclip") -->price-screenshot.png</span>
      </div>
      <span class="msg__time">5 Nov 2026, 10:20 AM</span>
    </div>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `MESSAGE THREAD` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-11-05 | Composed for Support › Ticket details (ADO #2868), promoted per rules §2.3/§6 — no existing component covered two-party asymmetric dialogue |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
