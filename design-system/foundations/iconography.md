# Foundations — Iconography

**Source of truth:** the `PATHS` map + `RD.icon(name)` in `assets/shell.js`.
**Live inventory:** `foundations.html` → Iconography renders the full grid straight from
`RD.iconNames` — it can never drift from the source.
Icons are inline SVG — 24px viewBox, `stroke="currentColor"`, stroke-width 1.75, round caps
and joins, `fill="none"`. They inherit text color, so they theme automatically.

## Usage

```js
RD.icon("calendar")   // returns the <svg> string
```
In static markup, copy the rendered SVG from a demo page. Never introduce icon fonts,
emoji-as-icons, or third-party icon sets.

## Available icons

| Name | Meaning / typical use |
|---|---|
| `home` | Home / overview |
| `calendar` | Scheduling, dates, new booking |
| `booking` | Bookings module (calendar + check) |
| `users` | Customers, guests, staff |
| `membership` | Memberships (card) |
| `megaphone` | Marketing |
| `revenue` | Finance, money, payments |
| `hotel` | Venue / property |
| `chart` | Reports, analytics |
| `gear` | Administration |
| `sliders` | Settings, filters |
| `box` | Templates, packages, empty states |
| `search` | Search |
| `bell` | Notifications |
| `headset` | Support |
| `mail` | Contact / message |
| `moon` / `sun` | Theme toggle |
| `close` | Dismiss, cancel, error |
| `chevronDown/Left/Right` | Disclosure, navigation, menus |
| `menu` | Hamburger |
| `layout` | Components, grid view |
| `desktop` / `tablet` / `mobile` | Device preview |
| `check` | Success, done, selection |
| `plus` | Add / create — "New" primary actions (add member, new record) |
| `trash` | Delete / remove — destructive row actions (delete coupon) |
| `edit` | Edit-in-place (pencil) — row actions, assignments |
| `chat` | Messages |
| `send` | Send message |
| `warn` | Warning |
| `info` | Information |
| `steps` | Stepper / process |
| `layers` | Layers / stacking |
| `list` | Lists, catalogs |
| `click` | Button/action |
| `qrcode` | QR check-in |
| `package` | Bundles |
| `flash` | Quick actions |
| `globe` | Language / region |
| `clock` | Time / awaiting — "Not yet" check-in state |
| `ticket` | Tickets — Multi Booking scan count |
| `eye` | View / audit-only detail action |
| `camera` | Camera permission / QR scan viewport |
| `lock` | Unauthorized / permission-denied state |
| `shield` | Permissions / access management — assign/edit permissions row action |
| `refresh` | Retry — connection/verification failure |
| `pin` | Location / address / map marker |
| `star` | Rating (comments/reviews) |
| `server` | Usage details / system-log row action (Coupons table) |

## Sizing conventions

Icons size via CSS on the consuming component: 18px inside `.btn` (15px in `.btn--sm`),
15px in menus/nav sublinks, 20px in `.kpi-ic`, 21px in the mobile tab bar. Don't set
width/height attributes on the SVG — let the component's CSS govern.

## Rules

1. Icon-only controls always carry `aria-label`; decorative icons need nothing.
2. Directional icons (chevrons) mirror in RTL via the `app.css` RTL rules — never bake
   direction into new markup.
3. Missing an icon? That's a system addition: request it through governance
   (MINOR bump, `Added` changelog entry). **Closed-world guard:** `RD.icon` renders the
   `warn` glyph and logs a console warning for any unknown name — an invented icon name is
   loud and visible, never a silent blank (guard added 2026-07-19).
4. Country flags are real SVG flags (see [phone-field](../components/phone-field.md)), never
   emoji — Windows renders flag emoji as bare letter codes.
