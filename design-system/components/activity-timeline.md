---
id: activity-timeline
name: Activity timeline
category: Data
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.timeline, .timeline__item, .timeline__item--good, .timeline__item--bad, .timeline__item--warn, .timeline__icon, .timeline__body, .timeline__text, .timeline__meta, .timeline__note]
source-css: assets/css/components.css
source-demo: components.html
related: [card, status-badge, filter-bar, resource-timeline, data-table]
---

# Activity timeline

## Purpose
A record's history as a list of facts on a rail — what happened, who did it, when — newest
first. The answer to "why is this record in the state it is in?"

## Description
`.timeline` is a plain grid of `.timeline__item` rows. Each row is a 28px circular
`.timeline__icon` beside a `.timeline__body` holding a `.timeline__text` sentence and a
`.timeline__meta` line of *who · when*. A 1px rail is drawn by each item's `::before`
except the last, so the line stops at the final dot instead of trailing into the padding.
An entry that needs to carry more than a sentence — a rejection reason, a before/after
value — adds a `.timeline__note` block, set off by a leading rule.

Three tone modifiers colour the icon only: `--good` (success), `--bad` (danger),
`--warn` (warning). The sentence itself stays in body text, so a long feed doesn't become
a traffic light.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Neutral entry | `.timeline__item` | Most events — created, edited, submitted |
| Positive | `.timeline__item timeline__item--good` | Approved, activated, resolved |
| Negative | `.timeline__item timeline__item--bad` | Rejected, cancelled, failed |
| Caution | `.timeline__item timeline__item--warn` | Expiring, limit reached, needs attention |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Icon, sentence, who · when |
| With note | entry has a reason or a before/after | `.timeline__note` block under the meta line |
| Filtered empty | no entry matches the active filter | Replace the `.timeline` with a one-line message — the rail must not render empty |
| Last item | `:last-child` | No rail below the icon |

## Properties
| Property | How |
|---|---|
| Icon | Any `RD.icon` glyph inside `.timeline__icon`; pick the verb, not the object |
| Emphasis in the sentence | `<b>` around the changed value or the actor |
| Filtering | A row of `.filter-chip`s above the card — see [filter-bar](filter-bar.md) |
| Container | Normally inside a `.card card--pad`; the component has no surface of its own |

## Responsive Behaviour
The row is a flex pair with a fixed-width icon, so it reflows to any width with no media
query; long sentences wrap under themselves, never under the icon. On narrow screens the
`who · when` line is what usually wraps first, which is the right thing to lose focus on.

## Accessibility
- Render as a list (`<ol>`/`<li>`) when the order carries meaning to a screen reader; the
  demo uses `<div>`s because the surrounding card already announces "Activity".
- Icons are decorative — the sentence must say what happened without them. Do not put the
  only copy of the event type in the icon.
- Tone is colour **plus** wording ("Rejected by Super Admin"), never colour alone.
- Timestamps are written out ("28 Sep 2026, 9:40 AM"), not relative-only, so they survive
  being read aloud out of context.

## Dependencies
Tokens: spacing, radius (`--radius-full`), border, surface-sunken, the
success/danger/warning subtle pairs, text scale. No JS.

## Related Components
- [resource-timeline](resource-timeline.md) — a **scheduler grid** with a time axis; unrelated despite the name. This one has no axis and no duration.
- [data-table](data-table.md) — when the history needs sorting, filtering by column or export; a timeline is for reading, not analysis.
- [filter-bar](filter-bar.md) — supplies the `.filter-chip` row that scopes the feed.

## Usage Examples
- **Packages › View Package › Activity** (`features/packages/us5-view-package.html`) —
  created · submitted · approved · edited · plan price changed · activated, with the
  rejection reason as a `.timeline__note`, filtered by All / Approval / Edits / Status.
- **Customer profile** (`customer.html`) — currently renders `.tl` / `.tl-item`, classes
  that have **no CSS**; it should adopt `.timeline`.

## Do
- Write each entry as a completed fact in the past tense.
- Name the actor. "Deactivated by Hana Ibrahim" beats "Deactivated".
- Put the reason in a `.timeline__note`, not in parentheses inside the sentence.

## Don't
- Don't colour the text by tone — the icon carries it.
- Don't mix future/scheduled items into a history feed; a plan is not an event.
- Don't paginate a timeline at 10 items. Filter it, or cap it with a "show all" link.

## HTML Reference
```html
<div class="card card--pad">
  <div class="timeline">
    <div class="timeline__item timeline__item--bad">
      <span class="timeline__icon"><!-- close icon --></span>
      <div class="timeline__body">
        <span class="timeline__text">Rejected by Super Admin</span>
        <span class="timeline__meta">Super Admin · 28 Sep 2026, 9:40 AM</span>
        <div class="timeline__note">The cover image shows a branded logo that isn't yours.</div>
      </div>
    </div>
    <div class="timeline__item">
      <span class="timeline__icon"><!-- plus icon --></span>
      <div class="timeline__body">
        <span class="timeline__text">Package created by <b>Hana Ibrahim</b></span>
        <span class="timeline__meta">Hana Ibrahim · 27 Sep 2026, 1:50 PM</span>
      </div>
    </div>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → **RECORD PAGE SET** → *Activity timeline*.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-28 | Promoted from Packages › View Package (rules §2.3). Replaces the undefined `.tl` / `.tl-item` classes in `customer.html` |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
