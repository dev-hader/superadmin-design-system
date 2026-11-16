# State Coverage Matrix

**Status:** living document · v2.0 (2026-11-16) — rewritten for the Super Admin. The
v1.0 rows described Partner screens (scheduling, customers, branches…) that this system
does not have.

The per-screen map of non-happy-path states. The recipes are fixed system-wide; what
differs here is the **1:1 rule**: product pages show the states **the dashboard itself
shows, with its own copy**. A recipe the dashboard doesn't use is not added to a product
page unless a user story asks for it.

## The five states & their recipes

| State | Recipe (always) |
|---|---|
| **Loading** | `.skeleton` blocks matching the real layout's silhouette — never spinners in content areas; `.spinner` only inside buttons (`.is-loading`) |
| **First-run empty** | product pages: the dashboard's table-row message (copy below). New screens: the empty-state composite (icon chip + what + how + primary action, docs/09 §4) |
| **No results (filtered)** | product pages: the same table-row message, reached by search/filter. New screens: "Nothing matches these filters." + **Clear filters** |
| **Error** | form/field validation inline with the dashboard's messages; load/save failures are API responses — marked as code comments with their copy, wired at integration (rules §4.9) |
| **Offline / degraded** | not part of the dashboard; P2 pattern only, never per-screen |

**Empty copy used on product pages** (the dashboard's own strings, kept per page):
"there is no data to display" / "There is no data to display." / "There is no data yet",
plus the page-specific "No users found. Try adjusting your search…" and "No pages found…".
Arabic: «لا توجد بيانات للعرض» / «لا توجد بيانات لعرضها».

## Matrix — product pages

✅ designed & reachable · ◐ the dashboard's plain table-row message (reachable) · ❒ not drawn · n/a

| Pages | Loading | First-run | No results | Error |
|---|---|---|---|---|
| Sign in · Forgot password · Verification code | n/a | n/a | n/a | ✅ field validation + wrong-code alert (dashboard copy) |
| 404 · 500 | n/a | n/a | n/a | ✅ (they are the error pages) |
| Dashboard (`index.html`) | ❒ | n/a (stat cards render zeros) | n/a | ❒ |
| List pages — Partners · Units · Packages · Users · Employees · Jobs · Activity log · Subscriptions · Activities | ❒ | ◐ | ◐ search / pills / filter popover | ❒ load failure (API) |
| Operations — Public events · Joining list · Bookings · Multi-booking · All comments | ❒ | ◐ | ◐ | ❒ load failure (API) |
| Add partner (`partners-add.html`) | n/a | n/a | n/a | ✅ per-step validation + error alert |
| Package edit (`package-edit.html`) | n/a | n/a | n/a | ✅ field validation (dashboard messages) |
| Profiles — Partner · Unit · User · Package details (every tab) | ❒ | ◐ per tab (each tab's own dashboard message) | ◐ where a tab has search/filter | ❒ |
| Financials · Wallet | ❒ | ◐ | ◐ date / country filter | ❒ |
| CRUD lists — Setup Files (7, incl. Banks) · Locations (3) · Content (2) · Settings · Activities contacts · Design System admin (3) · Notifications (4) · Advertisements | ❒ | ◐ | ◐ search (`minSearch` where the dashboard has one) | ✅ modal field validation; save failure = API response |
| Translation page (`?translation=`) | ❒ | ◐ | n/a | ❒ save failure (API) |

## Matrix — feature references

Empty until the first Super Admin user story ([`07-features-workflow.md`](07-features-workflow.md)).
Every story adds its row here in the same change.

| Story | Loading | First-run | No results | Error | Notes |
|---|---|---|---|---|---|

## Rules

1. New screens and enhancements add or update their row **in the same change** — a
   missing row fails review.
2. ❒ on a product page is correct when the dashboard draws nothing for that state; it is
   not a gap to fill silently. Filling it is a user story.
3. ◐ is acceptable for product pages (it is what the dashboard does). Feature references
   use the full recipes.
4. Recipes live in the components (`empty-state`, `progress-indicators`, `alert`) — this
   file only maps coverage, it never redefines the recipes.
