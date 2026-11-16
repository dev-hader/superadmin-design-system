# Roadmap — phased build-out

The Super Admin design system is built **in phases, not all at once** (owner directive,
2026-11-15). Each phase ends with a review; the next one starts only when asked.

Every page is built from the existing registry (`design-system/components/README.md`).
A real gap follows the `NEW COMPONENT REQUIRED` flow in `.claude-rules.md` §2.3.

## Phase 1 — Foundation ✅ (2026-11-15)

- Forked the Partner system's stylesheets, shell, registry docs and governance.
- Identity layer → Super Admin orange `#FC6404`, its blue-grey neutrals, `#131313` dark,
  Inter + Tajawal (`.claude-rules.md` §9, `assets/css/tokens.css`).
- Sidebar → the dashboard's 24 sections, same order and labels (EN + AR).
- Permission map → 24 page keys under the `superadmin` system
  ([11-page-permissions.md](11-page-permissions.md)).
- Login → signs in as the `superadmin` system; no Web/Mobile chooser.
- Pages: `index.html` (Dashboard), `foundations.html`, `components.html`,
  `templates.html`, `login-live.html`, `login.html`.

## Phase 2 — Core list pages (in progress)

Shipped 2026-11-15: Partners (+ Add New Partner), Partners Lists and Services (+ list →
services), Units, Packages — all on the shared `assets/js/sa-kit.js`. Still to do:

The most-used screens; together they exercise the list-page pattern (filter bar, data
table, drawer) the rest will reuse.

- `partners.html` — list + filters + status
- `users.html` — done (1.5.0, with `user-profile.html`)
- `bookings.html` — done (1.6.0, with public events, joining list, multi-booking, all comments)
- `packages.html` (incl. the approval queue)

## Phase 3 — Profiles (record detail)

- Partner profile (tabs: owner, location, gallery, documents, branches, units, policies,
  employees, customers, memberships, financials, notes, activity log, QR settings, coupons)
- Unit profile · User profile (wallet, packages, bookings)

## Phase 4 — Operations & money

- Public Events + Joining List · Multi-Booking Sessions · All Comments
- Financials · Wallet · Subscriptions

## Phase 5 — Team & marketing

- Employees · Jobs (permission matrix) · Activity log
- Promo Codes · Partner's Promo Codes · Advertisements

## Phase 6 — Setup & content

- Setup Files (7 CRUD lists, one shared template) · Locations (3) · Activities
- Notifications (+ settings) · Pages Content (pages, help center) · Settings ·
  Activities Contacts · Design System admin (systems, pages, access)
- Shared translation page (`/:id/translation`), reused by every CRUD list

Until a page ships, its sidebar row points to the Dashboard; the target filename is kept on
the nav row as `planned` (`assets/shell.js`).
