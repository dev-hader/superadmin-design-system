---
id: record-header
name: Record header
category: Layout
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.record-head, .record-head__media, .record-head__id, .record-head__badges, .record-head__meta, .record-head__actions]
source-css: assets/css/components.css
source-demo: components.html
related: [breadcrumb, avatar, status-badge, chip, button, menu, card]
---

# Record header

## Purpose
The identity block at the top of a single-record page: what this record is, what state it
is in, and every action available on it — all above the fold, before any tab.

## Description
`.record-head` is a wrapping flex row with three parts. `.record-head__media` is a fixed
72px square for a cover image, photo or fallback icon; it crops with `object-fit: cover`
and falls back to a sunken tile with a centred icon when the record has no picture.
`.record-head__id` carries the `<h1>`, a `.record-head__badges` row of
[status badges](status-badge.md), and one or more `.record-head__meta` lines of small
secondary facts — [chips](chip.md), an icon, plain text. `.record-head__actions` is pushed
to the far end with `margin-inline-start: auto` and holds the record's buttons plus an
overflow [menu](menu.md).

It sits **inside** a `.page-head` (which supplies the [breadcrumb](breadcrumb.md) and the
`<h1>` typography), replacing that element's single-column stack when the page is about one
record rather than a list.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.record-head` | Any single-record page |
| No media | omit `.record-head__media` | The record has no visual identity (a policy, a report) |
| Icon fallback | `.record-head__media` containing an inline SVG instead of an `<img>` | The record supports a cover but this one has none |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Media, identity, actions on one row |
| Read-only | page logic removes the buttons | The actions slot holds a short reason instead (e.g. "Read-only") — never a row of disabled buttons |
| Wrapped | container narrower than media + 18rem identity | Identity block wraps under the media; actions drop to their own row |

## Properties
| Property | How |
|---|---|
| Media size | Fixed 72px — matches the [avatar](avatar.md) `--_s:72px` used on profile pages |
| Identity minimum | `.record-head__id` is `flex: 1 1 18rem`; below that it wraps |
| Multiple meta lines | Repeat `.record-head__meta`; consecutive lines get `--space-2` between them |
| Overflow list | An `.icon-btn` in the actions slot opening a portalled `.menu` (`RD.portalMenu`) |

## Responsive Behaviour
Flex wrapping does most of the work — no media query is needed until the actions themselves
stop fitting. At **≤640px** `.record-head__actions` loses its auto margin, takes the full
inline size and its `.btn` children grow (`flex: 1 1 auto`) so they read as a full-width
action row rather than a ragged line.

## Accessibility
- The `<h1>` is the record name and the page's only level-1 heading.
- Status badges carry their state as **text**, not colour alone (see
  [status-badge](status-badge.md)).
- A truncated branch/owner list ("+2 branches") must carry the full list in a native
  `title`, and the overflow button needs an `aria-label` — an icon-only control has no
  accessible name otherwise.
- The overflow menu uses `aria-haspopup="true"` and the standard `.menu` keyboard model.

## Dependencies
Tokens: spacing, radius, surface/border colours, text scale. Components:
[status-badge](status-badge.md), [chip](chip.md), [button](button.md),
[menu](menu.md) + `RD.portalMenu` / `RD.positionMenu`, [breadcrumb](breadcrumb.md).

## Related Components
- [page-templates](../layouts/page-templates.md) — `.page-head` is the *list//section* header; this is its single-record form.
- [card](card.md) — for the info cards that usually sit directly beneath a record header.
- [avatar](avatar.md) — use instead of `__media` when the record is a person.

## Usage Examples
- **Packages › View Package** (`features/packages/us5-view-package.html`) — cover, name,
  Approval + Status badges, category/activity chips, branch line, then Edit · Selling
  Methodology · Sell walk-in · overflow.

## Do
- Put every action for the record here, so the user never hunts for them in a tab.
- Give each independent lifecycle its own badge (Approval **and** Status), per
  [status-system](../patterns/status-system.md).
- Keep meta lines to facts that identify the record — not metrics, which belong in cards below.

## Don't
- Don't fill the actions slot with disabled buttons. Remove what the user cannot do and say
  why once, or keep the control live and explain on click.
- Don't stack more than two meta lines; the third is a card, not a header line.
- Don't use it for a list page — that's `.page-head` with a title and a lead.

## HTML Reference
```html
<header class="page-head" style="max-width:none">
  <div class="breadcrumb"><a href="packages.html">Packages</a><!-- chevron --><span>Platinum All-Access</span></div>
  <div class="record-head">
    <span class="record-head__media"><img src="cover.jpg" alt="Platinum All-Access cover"></span>
    <div class="record-head__id">
      <h1>Platinum All-Access</h1>
      <div class="record-head__badges">
        <span class="status status--approved"><span class="dot"></span>Approved</span>
        <span class="status status--live"><span class="dot"></span>Active</span>
      </div>
      <div class="record-head__meta">
        <span class="chip">Fitness &amp; Gym</span><span class="chip">Padel</span>
      </div>
      <div class="record-head__meta">
        <span>Al Olaya Branch · King Fahd Road Branch</span>
        <span class="chip" title="Al Olaya Branch&#10;King Fahd Road Branch&#10;Al Khobar Corniche Branch">+1 branch</span>
      </div>
    </div>
    <div class="record-head__actions">
      <a class="btn btn--secondary" href="#">Edit</a>
      <a class="btn" href="#">Sell walk-in</a>
      <button class="icon-btn" aria-haspopup="true" aria-label="More actions"><!-- menu icon --></button>
    </div>
  </div>
</header>
```

## CSS Reference
`assets/css/components.css` → **RECORD PAGE SET** → *Record header*.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-28 | Promoted from Packages › View Package (rules §2.3). Replaces the undefined page-level `.c360-head` / `.c360-meta` classes in `customer.html` |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
