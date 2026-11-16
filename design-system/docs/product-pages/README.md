# Product pages — manifest

One row per page: which part of `HighFive-SuperAdmin-Front` it mirrors 1:1, and which
shared kit composes it. Read the page's row **before** opening the page; the comment at
the top of each `.html` repeats its source in more detail.

The Partner system keeps one `*.COMPONENTS.md` per page; with 59 look-only ports and a
handful of shared kits, one table says the same thing here. A page that gains a user-story
enhancement gets its own `<page>.COMPONENTS.md` in this folder at that point (rules §4.11),
linked from its row.

Sources are relative to `HighFive-SuperAdmin-Front/src/app/`. Kits are in `assets/js/`
(`sa-data.js` + `sa-kit.js` are on almost every page and are left out below).
Permission keys: [`../11-page-permissions.md`](../11-page-permissions.md).

**Shared registry components on every list page:** `data-table` (+ toolbar, footer),
`segmented-control` (status pills), `input` search, `popover` filter, `pagination`,
`status-badge` / `badge`, `modal`, `toast`, `empty-state`.

## Auth & system

| Page | Mirrors | Kit / notes |
|---|---|---|
| `login.html` | `modules/auth/components/Login.tsx` | static design reference (no API) |
| `login-live.html` | — | the DS site's real login (Design System Access backend) |
| `forgot-password.html` | `modules/auth/components/ForgotPassword.tsx` | `auth.js` |
| `verification-code.html` | `modules/auth/components/VerificationCode.tsx` | `auth.js` · sample code 1234 |
| `error-404.html` | `modules/errors/components/Error404.tsx` | static |
| `error-500.html` | `modules/errors/components/Error500.tsx` | static |
| `index.html` | `pages/dashboard` | inline (stat cards + charts) |

## Partners, units, packages

| Page | Mirrors | Kit / notes |
|---|---|---|
| `partners.html` | `pages/partners` (list) | `SA.list` |
| `partners-add.html` | `pages/partners/AddPartnerPage.js` | 3-step form |
| `partner-profile.html` | `pages/partners/profile` | `pp/*` (all tabs), `sa-services.js`, `sa-translation.js` |
| `partner-services.html` | `pages/partners-services` | `sa-services.js` |
| `partner-services-list.html` | `pages/partners-services` (ServiceListServicesPage) | `sa-services.js` |
| `services-translation.html` | the services `/:id/translation` routes | `sa-translation.js` |
| `units.html` | `pages/units` (list) | `SA.list` |
| `unit-profile.html` | `pages/units/profile` | `up/*`, `pp-ops.js` |
| `packages.html` | `pages/packages` (global list + approval pills) | `SA.list` |
| `package-detail.html` | `pages/packages/package-detail` | `kp/*` |
| `package-edit.html` | `pages/packages/package-edit` | `kp-info.js`, `kp-ops.js` |

## Users & operations

| Page | Mirrors | Kit / notes |
|---|---|---|
| `users.html` | `pages/users` | `SA.list`, `PP.filterPop` |
| `user-profile.html` | `pages/users/profile` | `us/*` (tabs + wallet), reuses `pp-ops`, `kp-*` |
| `public-events.html` | `pages/public-events` (+ PublicEventView) | `sa-ops.js`, `pp-ops.js` |
| `joining-list.html` | `pages/public-events/joining-list` | `sa-ops.js`, `pp-ops.js` |
| `bookings.html` | `pages/bookings` (+ BookingView) | `sa-ops.js`, `pp-ops.js` |
| `multi-booking.html` | `pages/multi-booking` | `sa-ops.js`, `pp-ops.js` |
| `comments.html` | `pages/comments` | `sa-ops.js`, `pp-ops.js`, `kp-*` (package comment modals) |

## Money

| Page | Mirrors | Kit / notes |
|---|---|---|
| `financials.html` | `pages/financials` | per-currency cards + stats table |
| `wallet.html` | `pages/wallet` | `us-wallet.js`, `us-tabs.js` |
| `activities.html` | `pages/activites` | inline |
| `subscriptions.html` | `pages/subscriptions` (read-only) | inline |

## Employees

| Page | Mirrors | Kit / notes |
|---|---|---|
| `employees.html` | `pages/emploayees` (list) | `sa-emp.js` |
| `jobs.html` | `pages/emploayees/jobs` (permission matrix) | `sa-emp.js` |
| `activity-log.html` | `pages/emploayees/activity-log` | `sa-emp.js` |

## Setup files & locations — all on the CRUD engine (`sa-crud.js` + `sa-translation.js`)

| Page | Mirrors |
|---|---|
| `setup-types.html` | `pages/setup-files/types` |
| `setup-capacities.html` | `pages/setup-files/capacities` |
| `setup-services.html` | `pages/setup-files/services` |
| `setup-age-groups.html` | `pages/setup-files/age-groups` |
| `setup-languages.html` | `pages/setup-files/languages` |
| `setup-support-categories.html` | `pages/setup-files/support` |
| `setup-banks.html` | `pages/banks` |
| `locations-countries.html` | `pages/locations/countries` |
| `locations-states.html` | `pages/locations/states` |
| `locations-cities.html` | `pages/locations/cities` |

## Marketing & notifications

| Page | Mirrors | Kit / notes |
|---|---|---|
| `marketing-promo-codes.html` | `pages/marketing/coupons` | `pp-people.js` (`PP.couponsOf`) |
| `marketing-partner-promo-codes.html` | `pages/marketing/partner-coupons` | `pp-people.js` |
| `marketing-advertisements.html` | `pages/marketing/advertisements` | `sa-crud.js` + phone preview |
| `notifications.html` | `pages/notifications/notifications` | `sa-crud.js` |
| `notifications-users.html` | `pages/notifications/users` | `sa-crud.js`, `sa-emp.js` |
| `notifications-partners.html` | `pages/notifications/partners` | `sa-crud.js`, `sa-emp.js` |
| `notifications-settings.html` | `pages/notifications/settings` | `sa-crud.js` |

## Content, settings, design system admin — CRUD engine

| Page | Mirrors | Notes |
|---|---|---|
| `pages-content-pages.html` | `pages/pages-content/pages` | rich-text editor field |
| `pages-content-help-center.html` | `pages/pages-content/help-center` | |
| `settings.html` | `pages/settings` | |
| `activities-contacts.html` | `pages/activities-contacts` | |
| `design-systems.html` | `pages/design-systems` | |
| `design-system-pages.html` | `pages/design-system-pages` | |
| `design-system-access.html` | `pages/design-system-access` | |

## Design-system docs pages (not product pages)

`foundations.html` · `components.html` (28 components, Super Admin sample content) ·
`templates.html` (the 8 Super Admin page types — [`../../layouts/page-templates.md`](../../layouts/page-templates.md)).
