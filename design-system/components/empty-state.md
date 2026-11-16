---
id: empty-state
name: Empty state
category: Feedback
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.card, .card--pad, .stack, .btn]
source-css: assets/css/components.css
source-demo: components.html
related: [card, button, alert, data-table]
---

# Empty state

## Purpose
Fills a content area that has nothing to show, telling the user *why* it's empty and what to do next.

## Description
A composite, not a dedicated class: a centered `.card.card--pad.stack` (max-width ~320px) holding a 48px circular icon, a short bold title with one line of tertiary explanation, and a single small button as the next action. The three flavours are distinguished by icon tint and — critically — by which action they offer. Only core classes are used; the icon circle is styled inline in the demo.

## Variants
| Flavour | Icon treatment | Next action | Use when |
|---|---|---|---|
| No data yet | Neutral (sunken circle, tertiary icon) | Primary `.btn btn--sm` — create the first item | The feature is unused so far |
| No results | Neutral (search icon) | `.btn btn--secondary btn--sm` — clear filters | A query/filter matched nothing |
| Failed to load | `--color-danger-subtle` circle, `--color-danger` icon | `.btn btn--secondary btn--sm` — Retry | The fetch errored |

## States
| State | Trigger | Appearance |
|---|---|---|
| Static | — | Card with icon, title, explanation, one action; no other states |

## Properties
| Property | How |
|---|---|
| Icon | 48px `--radius-full` circle, `display:grid; place-items:center`, tinted per flavour |
| Copy | `b.t-sm` title + `p.t-xs.text-tertiary` one-liner |
| Action | Exactly one `.btn--sm` (primary only for "create the first one") |

## Responsive Behaviour
The card caps at ~320px and centers inside whatever region is empty; it inherits `.card`'s behavior at all breakpoints.

## Accessibility
- Title and explanation are real text — screen readers get the same story as sighted users.
- The action is a real `<button>`; the icon circle is decorative (`aria-hidden` on the SVG).
- For the error flavour, meaning is carried by the words ("Couldn't load this page"), not just the red tint.

## Dependencies
Components: `.card`, `.btn`. Utilities: `.stack`, `.t-sm`, `.t-xs`, `.text-tertiary`. Tokens: surface-sunken, danger-subtle/danger, `--radius-full`. Icons via `RD.icon`. No JS.

## Related Components
- [card.md](card.md) — the container this composite is built on.
- [button.md](button.md) — the single next-action.
- [alert.md](alert.md) — for a condition *within* populated content, not an empty region.
- [data-table.md](data-table.md) — tables show this composite when zero rows match.

## Usage Examples
- Bookings page before the first booking: calendar icon, "No bookings yet", **Create a booking**.
- Search with no matches: "No results for \"padel court c\"" + "Check the spelling or clear your filters." → **Clear filters**.
- Failed page load: warning icon in danger tint, "Couldn't load this page" → **Retry**.

## Do
- Distinguish the three flavours — "no data yet", "no results" and "failed to load" each need a **different next action**, not just different copy.
- Echo the user's query in the no-results title so the miss is obvious.
- Keep exactly one action; it should resolve the emptiness.

## Don't
- Don't show a generic "Nothing here" for all three situations.
- Don't use a primary button for Retry/Clear — primary is reserved for creating the first item.
- Don't add illustrations or extra paragraphs; icon + two lines + one button is the pattern.

## HTML Reference
```html
<!-- No data yet -->
<div class="card card--pad stack gap-3" style="text-align:center;align-items:center;max-width:320px">
  <span style="width:48px;height:48px;border-radius:var(--radius-full);background:var(--color-surface-sunken);color:var(--color-text-tertiary);display:grid;place-items:center"><!-- RD.icon("calendar") --></span>
  <div><b class="t-sm">No bookings yet</b><p class="t-xs text-tertiary" style="margin-top:2px">When a guest books an activity, it'll show up here.</p></div>
  <button class="btn btn--sm">Create a booking</button>
</div>

<!-- Failed to load -->
<div class="card card--pad stack gap-3" style="text-align:center;align-items:center;max-width:320px">
  <span style="width:48px;height:48px;border-radius:var(--radius-full);background:var(--color-danger-subtle);color:var(--color-danger);display:grid;place-items:center"><!-- RD.icon("warn") --></span>
  <div><b class="t-sm">Couldn't load this page</b><p class="t-xs text-tertiary" style="margin-top:2px">Check your connection and try again.</p></div>
  <button class="btn btn--secondary btn--sm">Retry</button>
</div>
```

## CSS Reference
Composite: markup composition lives in `components.html` (Empty state demo). All classes are core — `assets/css/components.css` (`.card` in CARD section, `.btn` in BUTTON section) plus stack/type utilities.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
