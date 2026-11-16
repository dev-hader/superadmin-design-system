---
id: avatar
name: Avatar
category: Identity
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.avatar, .avatar--xs, .avatar--sm, .avatar--lg, .avatar--xl, .avatar__status, .avatar-group, .more]
source-css: assets/css/components.css
source-demo: components.html
related: [badge, status-badge, data-table]
---

# Avatar

## Purpose
Represents a person (guest or staff) as a circle of initials or a photo, anywhere identity needs to be visible at a glance.

## Description
A circular element sized by an internal custom property (`--_s`, 40px default) so one rule set covers every size — the initials' font-size scales automatically at `calc(var(--_s) * 0.38)`. Holds either text initials or an `<img>` (cover-fit). An optional `.avatar__status` presence dot sits on the bottom trailing edge, and `.avatar-group` overlaps several avatars into a facepile with a `.more` counter.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.avatar` | Standard identity, e.g. beside a name in a table cell |
| Group | `.avatar-group` of `.avatar`s | Several people share one context (staff on a shift) |
| Overflow counter | `.avatar.more` (inside a group) | More people than fit — shows `+N` |
| With presence | `.avatar` + child `.avatar__status` | Online/checked-in presence matters |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | `--color-primary-subtle` background, primary-colored initials |
| Photo | child `<img>` | Image covers the circle (`object-fit: cover`) |
| Presence | child `.avatar__status` | 30%-sized dot, `--color-success`, 2px `--color-surface` ring |

## Properties
| Property | How |
|---|---|
| Size | `.avatar--xs` (24px), `.avatar--sm` (32px), default (40px), `.avatar--lg` (48px), `.avatar--xl` (64px) |
| Content | Two-letter initials as text, or an `<img>` |
| Group overlap | `.avatar-group` adds `-10px` inline-start margin + 2px surface border per avatar |

## Responsive Behaviour
No intrinsic breakpoints; `flex-shrink: 0` keeps the circle from squashing in tight rows. In the mobile stacked table (≤640px) the `.cell-user` avatar+name cell renders full-width with no label prefix.

## Accessibility
- Initials are visible text and readable as-is; photos need `alt` with the person's name.
- The `.avatar__status` dot is color-only — pair it with text ("Checked in") nearby; never let the dot be the sole signal.
- Decorative avatars in dense lists can use `aria-hidden` on a duplicate when the name is already adjacent.

## Dependencies
Tokens: brand (`--color-primary-subtle`), semantic surface/success colors, `--radius-full`, weight tokens. No JS.

## Related Components
- [badge.md](badge.md) — state/count label; often sits next to an avatar+name pair.
- [status-badge.md](status-badge.md) — booking lifecycle pill, not presence.
- [data-table.md](data-table.md) — the `cell-user` pattern embeds `.avatar--sm`.

## Usage Examples
- Guest column in the Bookings table (`.avatar--sm` + name, `cell-user`).
- Facepile of assigned staff in the demo Avatars & tags section (`+6` overflow).
- Presence dot on the topbar user avatar.

## Do
- Use two uppercase initials (first + last name) for text avatars.
- Keep group overlap order meaningful — most relevant person first.
- Put the `.more` counter last in the group.

## Don't
- Don't invent new sizes — the five documented modifiers are the scale.
- Don't use the presence dot for booking status; that's the status badge's job.
- Don't stretch an avatar; it is always a circle.

## HTML Reference
```html
<span class="avatar avatar--xs">AH</span>
<span class="avatar avatar--sm">MC</span>
<span class="avatar">SG</span>
<span class="avatar avatar--lg">JO</span>
<span class="avatar">SG<span class="avatar__status"></span></span>
<div class="avatar-group">
  <span class="avatar avatar--sm">AH</span>
  <span class="avatar avatar--sm">MC</span>
  <span class="avatar avatar--sm">SG</span>
  <span class="avatar avatar--sm more">+6</span>
</div>
```

## CSS Reference
`assets/css/components.css` → `BADGES / TAGS / CHIPS / AVATAR` section (`.avatar` block at the end of it).

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
