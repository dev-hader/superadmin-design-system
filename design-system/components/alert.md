---
id: alert
name: Alert / banner
category: Feedback
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.alert, .alert--success, .alert--info, .alert--warning, .alert--danger, .alert__icon, .alert__body]
source-css: assets/css/components.css
source-demo: components.html
related: [toast, empty-state, payment-result]
---

# Alert / banner

## Purpose
A persistent inline message about a condition the user should know about — it stays on the page until the underlying condition resolves.

## Description
A flex row (`--space-3` gap, `--space-4` padding, `--radius-md`) with a fixed 20px `.alert__icon` and an `.alert__body` holding a small semibold heading (`h4`) and secondary body text. All four severities share this one layout; each modifier only swaps the tint (`*-subtle` background, `*-border` border) and icon color. Neutral base is a bordered surface. Unlike a toast, it does not time out.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Neutral | `.alert` | Plain contextual note, no severity |
| Success | `.alert alert--success` | A positive outcome worth keeping visible (confirmation banner) |
| Info | `.alert alert--info` | Neutral news — a connected channel, a sync schedule |
| Warning | `.alert alert--warning` | Needs attention soon — pending payment |
| Danger | `.alert alert--danger` | Active problem — overbooking risk |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Severity tint + matching icon color; static |
| — | — | No hover/focus states; alerts are not interactive containers |

## Properties
| Property | How |
|---|---|
| Icon | `.alert__icon` with a 20px severity-matching SVG |
| Heading + body | `.alert__body > h4` (title) and `p` (detail) |

## Responsive Behaviour
None — the flex row wraps its text naturally at any width; place it in a `.stack` for full-width banners.

## Accessibility
- Use `role="alert"` only for danger/warning messages that appear dynamically; static page banners need no live-region role.
- The icon repeats the severity visually; the heading text carries the meaning — never color alone.
- Severity `*-subtle` backgrounds with full-strength text meet contrast in light and dark themes.

## Persistent vs toast
An alert **stays until the underlying condition resolves**; a toast confirms a moment and disappears. If the user must eventually do something about it, it is an alert. If it's a passing confirmation, it is a toast.

## Dependencies
Tokens: semantic severity groups (`--color-success/-warning/-danger/-info` + `-subtle` and `-border`), radius, spacing, type scale. No JS.

## Related Components
- [toast.md](toast.md) — transient sibling for momentary confirmations.
- [empty-state.md](empty-state.md) — when the *content area itself* is the message.
- [payment-result.md](payment-result.md) — a full-card outcome for the checkout flow.

## Usage Examples
- "Reservation confirmed — HF-24814 for Marcus Chen…" success banner after confirming.
- "Payment pending — Layla Hassan's Mada payment of SAR 250 hasn't cleared yet." warning.
- "Overbooking risk — Padel courts are at 102% capacity for Friday evening." danger.
- Compact thank-you banner after a signup form ("Thanks for signing up!") — same component, inline after the form.

## Do
- Lead with a short `h4` that states the condition; put the specifics in the paragraph.
- Keep it in place until the condition clears — that persistence is the point.
- Use the same layout for all severities; only tint and icon change.

## Don't
- Don't auto-dismiss an alert — that's a toast.
- Don't stack multiple alerts for one condition; consolidate.
- Don't put primary page actions inside an alert body — link to where the fix happens.

## HTML Reference
```html
<div class="alert alert--success">
  <span class="alert__icon"><!-- RD.icon("check") --></span>
  <div class="alert__body">
    <h4>Reservation confirmed</h4>
    <p>HF-24814 for Marcus Chen is confirmed. A receipt was emailed to the guest.</p>
  </div>
</div>

<div class="alert alert--danger">
  <span class="alert__icon"><!-- RD.icon("close") --></span>
  <div class="alert__body">
    <h4>Overbooking risk</h4>
    <p>Padel courts are at 102% capacity for Friday evening, Jul 12.</p>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `FEEDBACK: alert / banner / toast / tooltip / progress / skeleton` section (`.alert` block at the top of it).

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
