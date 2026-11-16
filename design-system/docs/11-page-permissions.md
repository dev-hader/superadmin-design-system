# Page permissions — Super Admin design system

The keys the **Design System Access** backend must hold for this deck. This deck signs in
as the backend's **`superadmin`** system (`SYSTEM` in `assets/js/api.js`), so every key
below must be created **under that system** — not under `partner` or `user`.

Where to create them: Super Admin dashboard → **Design System → Design Systems** (create
the system) → **Design System Pages** (add the keys) → **Design System Access** (grant them
to accounts).

## The system

| Field | Value |
|---|---|
| `name` (slug) | `superadmin` — must match exactly, `api.js` selects the system by it |
| `title` | Super Admin Design System |

## The page keys (24)

One key per top-level sidebar row. A key unlocks that row **and every child under it**.
The same table is coded in `NAV_PERM` (`assets/shell.js`) — keep the two identical.

| # | Key | Page (EN) | Page (AR) | Children it unlocks |
|---|---|---|---|---|
| 1 | `dashboard` | Dashboard | لوحة القيادة | — (always granted, baseline) |
| 2 | `partners` | Partners | الشركاء | partner profile and all its tabs |
| 3 | `partner-services` | Partners Lists and Services | قوائم وخدمات الشركاء | — |
| 4 | `units` | Units | الوحدات | unit profile and its tabs |
| 5 | `packages` | Packages | الباقات | package details, edit, subscribers |
| 6 | `users` | Users | المستخدمون | user profile, wallet |
| 7 | `public-events` | Public Events | الأحداث العامة | Public Events · Joining List |
| 8 | `bookings` | Bookings | الحجوزات | booking details |
| 9 | `multi-booking` | Multi-Booking Sessions | جلسات الحجز المتعدد | session details |
| 10 | `comments` | All Comments | جميع التعليقات | — |
| 11 | `employees` | Employees | موظفين | Employees · Jobs · Activity log |
| 12 | `financials` | Financials | البيانات المالية | transactions |
| 13 | `wallet` | Wallet | محفظة | funds, exchanges, cash-out, currencies |
| 14 | `activities` | Activities | أنشطة | categories → activities |
| 15 | `subscriptions` | Subscriptions | الاشتراكات | — |
| 16 | `setup-files` | Setup Files | ملفات الإعداد | Types · Capacities · Services · Age Groups · Languages · Banks · Support Categories |
| 17 | `locations` | Locations | المواقع | Countries · States · Cities |
| 18 | `marketing` | Marketing | تسويق | Promo Codes · Partner's Promo Codes · Advertisement Management |
| 19 | `design-system-admin` | Design System | نظام التصميم | Design Systems · Design System Pages · Design System Access |
| 20 | `notifications` | Notifications | إشعارات | Notifications Settings · Partners · Users |
| 21 | `pages-content` | Pages Content | محتوى الصفحات | Pages · Help Center |
| 22 | `settings` | Settings | الإعدادات | — |
| 23 | `activities-contacts` | Activities Contacts | جهات اتصال الأنشطة | — |
| 24 | `design-system` | *Foundations · Components · Templates* | *الأساسيات · المكوّنات · القوالب* | the DS documentation group |

### Notes

- **`design-system-admin` ≠ `design-system`.** The first is the *product page* that manages
  design systems (row 19); the second gates this deck's own documentation pages
  (Foundations / Components / Templates), same key the Partner system uses.
- **Notifications Settings** is a separate top-level item in the dashboard; here it sits
  inside the Notifications group under the one `notifications` key.
- **Granularity is per section, not per action.** `view_x` / `add_x` / `update_x` in the
  dashboard are product permissions; this catalogue only decides which design-system pages
  an account can open.
- Unknown keys cost nothing: the backend may send extra keys and they are ignored.
- A key that exists here but isn't granted hides its sidebar row entirely (not greyed) and
  blocks deep links to it.
