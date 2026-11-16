---
id: eticket
name: E-ticket / QR confirmation
category: Booking
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.eticket, .eticket__top, .eticket__qr, .eticket__divider, .eticket__foot]
source-css: assets/css/components.css
source-demo: index.html#/booking-widgets (design-system spec site)
related: [status-badge, button, payment-result]
---

# E-ticket / QR confirmation

## Purpose
The booking-confirmed artifact: a ticket-shaped card carrying the QR check-in code, booking summary and follow-up actions.

## Description
`.eticket` is a `max-width: 380px` card (`--radius-lg`, `--shadow-md`) in three bands: `.eticket__top` places an 88×88px `.eticket__qr` well (sunken background, 56px QR SVG) beside the booking summary stack — status badge, activity title, venue/time line, monospace booking code; `.eticket__divider` draws the dashed "perforation" line that signals *ticket* at a glance; `.eticket__foot` holds the action buttons. It reuses the same radius and shadow language as every other card.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.eticket` | The only form — content inside the bands varies, the frame doesn't |

## States
No interactive states of its own — buttons inside the footer carry their own states; the status badge communicates the booking state.

## Properties
| Property | How |
|---|---|
| QR well | `.eticket__qr` — fixed 88px square, `--color-surface-sunken`, icon/graphic centered |
| Summary | Free-form stack next to the QR: `.status` badge, `t-title` name, `t-sm` detail, `t-mono` code |
| Perforation | `.eticket__divider` — dashed border with `--space-6` side margins |
| Actions | `.eticket__foot` flex row — e.g. a flexed `.btn--secondary` plus a `.btn--ghost.btn--icon` |

## Responsive Behaviour
No media queries — the card caps at 380px and shrinks fluidly below that; it is equally at home on the confirmation page, in email/SMS renderings and on a phone screen.

## Accessibility
- The QR code needs a text fallback — the visible booking code (e.g. `HF-24814`) — for anyone who can't scan it (per the spec-site demo notes).
- Icon-only footer buttons must carry `aria-label` ("Download ticket").
- The status badge is text + dot, never color alone.

## Dependencies
Tokens: surface/border, `--radius-lg`/`--radius-md`, `--shadow-md`. Composes `.status` (booking status palette), `.btn`, and the icon set (`RD.icon("qrcode")` as the QR placeholder). No JS.

## Related Components
- [status-badge.md](status-badge.md) — the "Confirmed" pill inside the summary.
- [button.md](button.md) — "Add to calendar" / download actions in the footer.
- [payment-result.md](payment-result.md) — the checkout outcome screen that precedes issuing the ticket.

## Usage Examples
- Confirmation page (spec site Booking Widgets): QR beside "Padel — Court A · SHQ Club, Riyadh · Jul 15, 7:00 PM", code `HF-24814`, footer with "Add to calendar" and a download icon button.
- The primary artifact of the booking-confirmed email/SMS; the guest-facing QR check-in template in `templates.html` presents the same code full-screen for the front desk.

## Do
- Always show the booking code as text under the summary — it doubles as the QR fallback.
- Keep the footer to at most one labeled action plus icon buttons.

## Don't
- Don't rebuild the ticket as a generic `.card` — the dashed perforation is the recognizable cue.
- Don't crowd the summary; activity, venue/time, code and one status badge is the complete anatomy.

## HTML Reference
```html
<div class="eticket">
  <div class="eticket__top">
    <div class="eticket__qr"><!-- RD.icon("qrcode") --></div>
    <div class="stack gap-1">
      <span class="status status--confirmed"><span class="dot"></span>Confirmed</span>
      <b class="t-title">Padel - Court A</b>
      <span class="t-sm text-secondary">SHQ Club, Riyadh · Jul 15, 7:00 PM</span>
      <span class="t-xs t-mono text-tertiary">HF-24814</span>
    </div>
  </div>
  <div class="eticket__divider"></div>
  <div class="eticket__foot">
    <button class="btn btn--secondary" style="flex:1"><!-- calendar icon --> Add to calendar</button>
    <button class="btn btn--ghost btn--icon" aria-label="Download ticket"><!-- arrowDown icon --></button>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `BOOKING WIDGETS - party stepper, seat map, payment, hold timer, e-ticket` section (final block).

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
