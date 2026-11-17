# Changelog

Semver per [03-governance-workflow.md](03-governance-workflow.md) §6.

## 1.24.0-trial — 2026-11-17 · Parity with the real dashboard (latest dev) + job permissions

Pre-change copies of the shared files are in `revisions/2026-11-17-parity/`.

- **Synced to HighFive-SuperAdmin-Front `dev` @ d0daa7a:**
  - "Package support" type, and the Type is locked when a category already has tickets ("This category already has tickets.").
  - Partner financials "Collected by" = `collector.label || collector.value`.
  - Subscriber plurals in package-edit.
  - BR-01 branches endpoint and refresh notes.
- **Parity audit** (every page vs the React source, read-only) followed by fixes per page group. Fixes covered fields, filters, validation (real rules and messages), links that pointed to `#`, empty/error/read-only states, and removed invented copy. Arabic was corrected along the way.
  - States the real app reaches only through the API are shown with `?demo=…` flags (documented in each page header); off by default.
  - Highlights:
    - unit edit gains additional categories/activities, with type/capacity/services following the activity;
    - coupon form (country required, linked users/branches/units pickers, cascades);
    - package approval and status modals rebuilt to the real layout and rules;
    - package-edit plan, schedule and capacity rules;
    - activity-log value formatting;
    - notification create defaults and test send;
    - advertisement GPS state/city;
    - policy wording reverted to the real meaning.
- **Job permissions (documentation + demo):**
  - Every gated control carries `data-perm="<real key>"`, and each page passes `RD.boot({ perm })`.
  - `?perm=limited` grants only view keys; `?perm=none` shows the NotHavePermissions card. Default view unchanged. Use `RD.can(key)` for script-rendered disabled states.
  - Keys that are empty in the dashboard (open to all) are left untagged and noted.
  - **Floating switcher** (`permSwitcher` in shell.js), bottom corner on the inline-end side (right in EN, left in AR):
    - shows the simulated level: Full access / View only / No access;
    - picking a level rewrites `?perm=` and reloads;
    - × hides it until the next refresh;
    - it replaces the centred demo pill.
- **Shared:**
  - **sa-kit:** `SA.modal({static})`, `SA.crop()`.
  - **sa-crud:**
    - `rules.int`
    - image picker: size check on pick, Remove, crop, existing image shown on edit
    - `del.item`
    - wording overrides
    - select `disabled` / `note`
    - translation link by `idKey`
  - **filterPop:** "All" first; ranges can't cross.
  - **SATR:** delete wording as the dashboard.
  - **Sentence case:** keeps a capital after `?`.
  - **`.switch`:** positioned, with a disabled look.
- **Shell:**
  - Notifications Settings is a top-level nav item.
  - Collapsed-sidebar tooltips show item names beside the icon.
  - Every `.tabs` bar gets start/end scroll arrows (no jump when a visible tab is clicked).
  - The sidebar keeps its scroll position.
  - Drawers lock page scroll.
- **Sentence-case sweep:** about 240 remaining Title Case English labels across pages and modules are now sentence case, e.g. "Registered on", "Show in app", "Session information", "Campaign name".
  - Sidebar page names, proper names (HighFive, Super Admin), month names and sample place names are kept.
  - Pre-sweep copies are in `revisions/2026-11-17-sentence/`.
- **Preview server:** `.claude/launch.json` now uses `python -m http.server`. `npx serve` leaked file handles and crashed under load.

## 1.23.0-trial — 2026-11-17 · Every remaining page on the redesign

Pre-redesign copies of all pages and the touched modules are in `revisions/2026-11-17-all-pages/`.

- **Skin and palette:** 47 more pages now carry the trial head script, `skin-v2.css?v=7` and the classic palette.
  - units and packages switched from the v2 to the classic palette.
  - The docs pages are left as they are: components, foundations and templates.
- **`sa-kit.js`, sentence case:** `SA.sc()` and `SA.TS()` put UI copy in sentence case. Names in a keep-list keep their capital.
  - `SA.up1()` capitalises page titles' first letter.
  - Search placeholders go through `TS`.
- **`sa-kit.js`, status tiles:** `SA.list` renders status pills as stat tiles by default (`tiles:false` keeps the pill row).
  - The icon and tone are inferred from the status key: all, active/approved…, inactive/rejected…, pending….
- **`sa-kit.js`, tooltips:** `SA.iconBtn` uses the custom tooltip (`data-tip`) instead of `title`.
- **Tooltip moved to `assets/shell.js`:** it now runs on every app page, including the dashboard, which doesn't load sa-kit.
  - Any plain `title=""` is adopted on first hover or focus: it moves to `data-tip`, and becomes `aria-label` when it was the element's only name. So no native browser tooltips are left.
  - SVG `<title>` elements are left alone.
- **`sa-crud.js`:**
  - Labels sit above fields and have no trailing colon.
  - Image and file inputs became a designed picker that shows the file name and an image preview.
  - All page-supplied labels, titles, buttons and messages show in sentence case.
  - Active shows as a success badge.
  - Ellipses are tidied ("Creating…").
- **`<title>` tags:** they start with a capital.
- **Pages:** same data, fields, filters, actions, modals, validation and API notes.
  - **Auth and errors:**
    - login, login-live, forgot-password and verification-code use the new card. The forgot-password and verification-code steps show a 3-step progress bar.
    - 404 and 500 are split cards.
    - Two fixes: the eye toggle on the verification page, and an empty logo slot.
  - **Operations (new `OPS.head` / `OPS.filters` / `OPS.peek` in `sa-ops.js`):**
    - bookings, public events, multi-booking, joining list and comments get a summary head, tiles, filter chips, merged columns and a row-peek drawer.
  - **People:**
    - employees and jobs forms have labels above fields; jobs gets a permissions picker.
    - The activity log gets one filter bar and status-tone badges.
    - Notifications (users and partners) get a sectioned create form.
  - **Setup and content:**
    - Sibling tab bars on setup, locations, design-system, pages-content and marketing.
    - activities as category cards, settings as a card, and notifications as a feed.
    - notifications-settings shows recipient cards.
    - The advertisement view gets a record header and a phone preview.
    - Arabic fixes throughout.
  - **Finance and catalog:**
    - financials gets country cards with totals, and its country view gets stat cards.
    - The wallet overview and its country lists get a sub-nav.
    - users, units and packages are laid out like partners.
    - user, unit and package profiles use the partner-profile frame: record header, grouped side or top nav with arrows and the narrow picker. The choice is saved per page.
    - package-edit is laid out like partners-add.
- **`components.css`:** `.pagination` wraps on phones.
- **`pp-core` / `pp-ops`:** "Filter options", "Select session gender" and "Pending approval" are now sentence case.
- **`sa-crud`:** pills keep their own `icon` and `tone`.
- **`us/*`, `up/*`, `kp/*`:** labels are sentence case at the source. API words go through `PP.cap`, which knows new words: onsite, main/part, available/maintenance, completed/rejected, booking, payment and the wallet transaction types.
  - The temporary label workaround on the profile pages is removed.
  - Many Arabic fixes.
- **Profile pages:** `.pp-pick` drops to z-index 50 on the four pages so it no longer paints over modals.
- **`unit-profile` title:** "Unit profile".
- **Profile navigation choice:** partner, user, unit and package profiles share one saved choice, `rd-pp-nav` (side or tabs).
- **Filter popover (`pp-core`):** date ranges stack as From / To rows, so they no longer overflow the 320px popover. The age range shrinks to fit, and the popover never scrolls sideways.
- **`SA.popover`:** opens above the trigger when there is more room there, and caps its height to the visible space. It closes on page scroll.
- **`RD.openDrawer` scroll lock:** the page behind an open drawer no longer scrolls. `html.rd-scroll-lock` is set in `shell.css` with a stable scrollbar gutter, and the drawer body uses `overscroll-behavior: contain`. This covers the partners peek and every ops-page peek.
- **Notifications (users and partners):** "Sent" is green (success) in both the tile and the badge.
- **Sidebar scroll (`shell.js` `keepSidebarScroll`):** the sidebar keeps its scroll position across page loads (per tab, in sessionStorage `rd-sb-scroll`). The active item is nudged into view only when it would be hidden.
- **Sidebar footer:** "Powered by HighFive · v1.0.0" / «بواسطة هاي فايف · الإصدار 1.0.0».
- **Docs nav group:** new links to the static auth and error designs: sign in, forgot password, verification code, 404 and 500. They are gated by the `design-system` permission and have Arabic labels.
- **Policy view (`pp-ops.js`):** the rules read as full-width sentences with the number as a badge, instead of the narrow key/value grid.
  - The copy is rewritten in proper English and Arabic ("HighFive user", "unlocked", correct plurals).
  - The cash-payment note is a warning alert.
  - This applies to partner and unit profiles.
- **404 / 500:** language and theme toggles, via `AUTH.tools()`, newly exported from `auth.js`.
- **Kept, as decided:** the Super Admin copy on the auth brand rail, and the row-peek drawer on the ops pages.

## 1.22.0-trial — 2026-11-17 · Translation page redesigned

Same data, edit and delete flows, and fields. The previous version is in `revisions/sa-translation-2026-11-17-before-redesign.js`.

- **`sa-translation.js`:** the language table became a record header plus one card per language.
  - The header shows the item name, "n of 3 languages translated" with a progress bar, and Back.
  - Each card shows its status badge (Translated, Partly translated or Not translated) and every field as label over value. An empty field reads "Not translated yet".
  - Each card has Edit (or Add translation when the language isn't created yet) and delete. Delete is disabled until there is something to delete.
  - The edit modal shows the original text above each input.
  - Callers' lowercase labels and titles now show in sentence case ("name", "BIO", "edit translates").
- **Pages that follow automatically:** every page that renders `SATR`. That covers the services, partner, branch, unit, package, activity, currency and content-page translations.
- **`app.css`:** `.icon-btn:disabled` now dims and stops pointer events, matching `.btn:disabled`.
- **`services-translation.html`:** the title is "Translation".

## 1.21.1-trial — 2026-11-17 · Explaining tooltips on list rules and company

- **`sa-kit.js`:** one shared tooltip (registry `.tooltip`) for any element with `data-tip` and an optional `data-tip-label`.
  - Shows on hover and on keyboard focus, sitting above the element and flipping below when there is no room, kept inside the viewport.
  - Hides on leave, blur and Escape, and on scroll unless the element has focus.
  - Content is set as text, never as HTML.
  - Uses `aria-describedby`.
- **`sa-services.js`:** the rule chips (Requirement, Selection type, Min / max selection or total quantity, Quantity mode) and the company line explain themselves in EN and AR.
  - Applies to the lists table and the services summary.
  - The chips come from one shared `RULES()` source.
- **`.tooltip` (components.css):** it no longer inverts the theme.
  - It now uses the raised surface with a border and `--shadow-lg`: white in light mode, dark in dark mode.
  - The label sits on its own line in tertiary text.

## 1.21.0-trial — 2026-11-17 · Partners Lists and Services redesigned

Same data, modals, validation and API notes; classic palette; previous versions in `revisions/` (the three pages + `sa-services.js`). The shared module also drives the partner profile's "Lists and services" section, so it follows.

### Changed — service lists (`partner-services.html`, `SV.lists`)
-   Head: a live summary line under the title ("33 lists · 100 services · 7 waiting for approval"), refreshed after every change.
-   Status filter as stat tiles (from 1.20.2). Table **9 → 6 columns, nothing dropped**: List (name, Default badge, company · ID underneath) · Services (link) · **Rules** (Required / Optional, Single / Multiple, Min / max, By quantity — as small chips) · Status · Created date · Actions.

### Changed — services of a list (`partner-services-list.html`, `SV.services`)
-   The summary card is a small record header: list name + Default + status badges, the company (now a link to its profile's Lists and services section) · ID, the rules as chips, and three live counts — services · visible · pending.
-   Table **10 → 7 columns, nothing dropped**: Service (image + name + two-line description) · Duration · Quantity (max over min selection) · Price · Visibility · Created date · Actions.

### Changed — copy
-   Sentence case for the 24 lower-case display strings in `sa-services.js` (+ 3 in the pages); skin + classic palette on the three pages (incl. `services-translation.html`).
-   Verified: tiles toggle, search, approve / reject → summary refresh, visibility toggle → "Visible" count, add-service modal; the three pages + the profile section in AR + dark at 375 / 1280 — 0 errors, no overflow, only data left in English.

## 1.20.3-trial — 2026-11-17 · Arabic data words, key/value fields, branch cards

-   **Arabic:** `PP.cap` is now a small vocabulary of known API values (statuses, gender, payment method, booking / transaction type, coupon type, booking methodology, activity-log actions and modules) with their EN / AR label; unknown words are just capitalised. In Arabic mode the profile no longer shows "Coming / Ended / Created / Fixed slots…" in English. A scan of every section in AR leaves only real data (names, cities, units, activity and age-group names, membership categories, codes). Activity log: action filter options, action badges and module names go through it too.
-   **`PP.kv()` → compact fields:** owner feedback — on a wide card the detail-list rows put the value a screen-width away from its label. Each pair is now a small label over its value, in a grid (`minmax(min(100%,220px),1fr)`), so values sit under their labels (location, QR settings, booking / event / coupon views, user · unit · package cards).
-   **Branch cards:** wider (`minmax(min(100%,400px),1fr)`), the meta line is "#id · city" on one line (the full address is below), the unit-count labels no longer wrap ("Not Approved").
-   Verified: partner (22) · user (8) · unit (13) · package (11) profiles + bookings, EN and AR, 1280 and 375 — 0 errors, no empty section, no page overflow.

## 1.20.2-trial — 2026-11-17 · Tabs no longer jump; every profile section brought in line

### Fixed
-   **Tabs row jumped on click** even when the clicked tab was fully visible: the row re-rendered at scroll 0 and `scrollIntoView` then moved it. The row now keeps its scroll position when the same group re-renders and moves only by the exact amount needed when the open tab is partly hidden under an edge / arrow (physical deltas, LTR + RTL); `scrollIntoView` (which could also nudge the page) is gone.

### Changed — audit of all 22 sections (shared helpers, so every page that uses them follows)
-   **Status pills → stat tiles everywhere they were left:** `SA.list` gained an opt-in `tiles: true` (+ per-pill `icon` / `tone`; clicking the active tile clears it). Turned on for packages, public events, multi-booking, members, coupons and service lists / services (`sa-services.js` — also the Partners Lists and Services pages). The customers High five / Manual switch stays a segmented control (it switches views, it doesn't filter).
-   **`PP.kv()` → registry `detail-list`**, two columns when the card is wide, trailing ":" dropped from labels — replaces the old `.sa-kv` grid in every key/value card (location, QR settings, booking / event / coupon views, user · unit · package profile cards).
-   **Display case for raw data words** (`PP.cap`): session gender, status, payment method, booking type, coupon type / discount type, transaction type and the session status badges now read "Male", "Online", "Coming"… (data unchanged); customers' "booking / public event (Coming - past - canceled)" headers capitalised.
-   Verified: all 50 app pages load with an error hook installed before any script — 0 errors, content rendered, no overflow; every section clicked (and a tile toggled) in partner profile 22 · user profile 8 · unit profile 13 · package details 11 — 0 errors, 0 empty.

## 1.20.1-trial — 2026-11-17 · Section nav: scroll arrows + a designed narrow-screen picker

-   **Tabs view — scroll arrows:** when a group's sections don't fit, start / end arrow buttons sit over the row's edges (with a fade), each shown only while there is more in that direction; they scroll by 70% of the row, smooth unless reduced motion, and are RTL-aware (direction and glyphs mirror). The open tab is scrolled into view on load. Hidden when the row fits (e.g. Operations, 3 sections).
-   **Narrow screens (< 1100px) — designed picker instead of the native `<select>`:** a button with the current section's icon + name + chevron opens a grouped menu (registry `.menu`) — group titles, an icon per section, the open one tinted with a check; scrolls to the open section; closes on pick, outside click or Escape; items are the same `?tab=` links the router already handles.
-   Fix found while testing: the picker's menu painted under the animated section cards that follow it — `.pp-pick` now sits on `--z-popover`.
-   Verified: arrows LTR + RTL (end → hides end, start → back, hides start); picker open / outside-close / pick → section + label update; 375px dark — menu on top, no overflow.

## 1.20.0-trial — 2026-11-17 · Partner profile: better section nav (side / tabs) + four sections redesigned

### Changed — section navigation (`partner-profile.html`)
-   Side list restyled: a "Sections" card with an icon per section, group titles with their counts, an accent rail + tinted row for the open section, slim scrollbar.
-   **Admin's choice of layout:** a switch in the nav header toggles **side list ↔ tabs on top**. Tabs view is two rows — the four groups (with counts) on top, the chosen group's sections with icons and an underline below — so nothing is hidden behind "More" as in the old bar. The choice is a per-viewer preference (`localStorage` `rd-pp-nav`, guarded); below 1100px both views use the grouped select.

### Changed — sections (shared `assets/js/pp/*`, approach A)
-   **Owner** (`pp-info.js`, partner profile only): identity header (avatar · name · registered on) with Reset password + Edit; the fields in two grouped detail lists — Contact (email and phone as mailto / tel links, username) and Account (password, show in app, independent as badges). Same modals and validation.
-   **Branches** (`pp-catalog.js`, partner profile only): a card per branch instead of a table with expandable rows — description, address and street (what the expand used to hide) on the card, plus approved / pending / not-approved unit counts; same search, same location filter, same view + translation links.
-   **Units** (`pp-catalog.js`, partner profile only): status pills → stat tiles with counts; 11 → 8 columns with nothing dropped (activity over category, type over capacity, High Five status over the partner-app status).
-   **Bookings list** (`pp-ops.js`, partner + unit profile): status pills → stat tiles with counts (same five statuses). The booking view — also used by `bookings.html` — is untouched.
-   **Financials** (`pp-people.js`, partner profile only): the four stat tables → a KPI strip (revenues with online / cash split, collected, net HighFive, net partner, to be collected) + one "By source" table (booking · public event · packages · total) keeping every online / cash revenue and collected figure and the nets; same transactions table, filter and export.
-   `pp-core.js`: `PP.tiles()` — the shared stat-tile status filter used by units and bookings.
-   Verified: all 11 pages that load `pp/*` (every section clicked) — 0 errors, 0 empty; the five sections in AR + dark at 375 / 1440 — no page or card overflow (a long email in the owner card was wrapped).

## 1.19.0-trial — 2026-11-17 · Partners inner pages: profile + add partner redesigned

Same data, actions, validation and API notes; classic palette like the Partners list. Previous layouts in `revisions/`.

### Changed — `partner-profile.html`
-   **Record header** (registry `record-head`) replaces the hero card: initials media · name · status + ID badges · location + units · status action by / on · bio; every action in one place — Login as partner (primary), Update status, Edit profile, Translation, Back. Same two modals, same API comments.
-   **Grouped section nav** replaces the 22-tab bar with 12 sections hidden under "More": all 22 sections visible in four titled groups (Profile · Catalogue · Operations · Customers & money), sticky beside the content; a grouped `<select>` below 1100px. Same `?tab=` keys, same router, same section bodies (`assets/js/pp/*`).

### Changed — `partners-add.html`
-   Horizontal stepper across the top; fields in a two-column grid (country · state · city in three); a **live partner summary** beside the form (owner, email, phone, company, location, documents uploaded / required) — read-only, nothing new collected; Cancel · Previous · Next/Submit in a `formbar`. Same 3 steps, fields, validation copy and submit.

-   Fix (owner review): the stepper is centred in its band; the phone country code is now the registry **`phone-field`** (flag + dial button joined to the input, country menu with real SVG flags) instead of a plain `select` glued to the input — same five codes, same `phone_country` value; menu closes on pick / outside click / Escape and returns focus to the number.
-   `assets/shell.js`: Bahrain (+973) added to `RD.FLAGS` — the dashboard offers it and the flag inventory didn't have it.
-   Fix (owner review, round 2): the phone field still read as two boxes — `skin-v2.css`'s 10px input radius (higher specificity) re-rounded the input edge that meets the country button, and the button used `--color-border` while the input uses `--input-border`. SHAPE now squares that edge, gives the button the input border and the start radius, and turns both halves orange together on hover / focus. Measured light/dark × LTR/RTL: 0 gap, 0 inner radius, same border colour, both 42px. Skin links bumped to `?v=7`.

### Changed — sentence case in the shared section modules
-   `assets/js/pp/*.js`: 434 display strings (`L("…")` and `[en, ar]` pairs only — keys untouched) now start with a capital. These modules also render parts of user/unit profile, bookings, public events, joining list, multi-booking, comments, wallet and both promo-code pages, so those pages pick up the same casing.
-   Regression: all 11 pages that load `pp/*` opened and every section clicked (partner profile 22 · user profile 8 · unit profile 13) — 0 errors, 0 empty sections. Both redesigned pages: EN/AR, light/dark, 375/768/1440 — no overflow.

## 1.18.1-trial — 2026-11-17 · Sentence case on the redesigned pages

-   `index.html` (57 strings) and `partners.html` (21 strings): every English label, title, heading, tab, option, placeholder and badge now starts with a capital (sentence case) — e.g. "partners statistics" → "Partners statistics", "units" → "Units", "show all" → "Show all", "all / year / month" → "All / Year / Month", "active" → "Active", "search by …" → "Search by …". Owner request; a deliberate departure from the dashboard's own lower-case copy on these two redesigned pages only.
-   Kept lower case on purpose: mid-sentence words ("is" inside a filter chip, "items" after the page-size select, "37 pending" after a number) and data (emails). Arabic is unaffected.
-   Verified by walking every visible text node (page, Filter popover, drawer): nothing else starts lower case.

## 1.18.0-trial — 2026-11-17 · Dashboard: layout redesign, classic colours

Same statistics, filters and links as the dashboard — re-composed (`index.html`, classic palette like Partners; `?palette=v2` for the v2 colours). Previous layout kept at `revisions/index-2026-11-17-before-redesign.html`.

### Changed
-   **Head:** title + one-line summary; the location filter's "all - all - all" text → removable `filter-chip`s (country · state · city; removing a level clears the levels below), "All locations" when none; Filter is a secondary button.
-   **KPI strip:** the five headline totals (partners, units, users, bookings, public events) as `stat-tile` links to their lists — each with one existing sub-figure (pending / very active / coming). 5 across, 3 below 1200px, 2 on phones (icon on top; an odd last tile takes the full row).
-   **One card per domain** instead of a stats card beside a chart card: header (icon · title · sub · period / filters · show all) + chart + breakdown. The big total isn't repeated inside the card (it lives in the strip).
-   **Breakdowns:** dashed boxes → proportion rows (swatch · label · value · % over a `progress` bar) for partners, units, users and engagement; bookings / events columns show total + donut + split.
-   **Sections** with titles — Partners & units (2 across) · Users (users chart 2/3 + engagement, gender + age table 2/3) · Bookings & public events (full width). One column below 1200px.
-   Verified: 5 tiles → partners/units/users/bookings/public-events; 5 show-all links; period toggles swap their picker; filter apply → chips → remove cascades; EN/AR, light/dark, 375/768/1280/1440/1920 — no page or card overflow.
-   Cards in a row share one height (`align-items: stretch`) and pin their breakdown to the bottom, so the proportion rows of side-by-side cards line up (partners ↔ units, users ↔ engagement, gender ↔ age table). User engagement gained a donut of its own four figures so the taller card isn't empty. Measured at 1440 and 1920: equal heights in every row.

## 1.17.1-trial — 2026-11-17 · Partners: new layout, classic colours

-   `skin-v2.css` split into **SHAPE** (radius, type, density, table/segment structure — always on) and **PALETTE** (ink sidebar, stone canvas, ink pills, ink button label — skipped under `data-palette="classic"`). The ink-sidebar-only details (white logo text, sidebar focus outline) moved into PALETTE so they never land on the white sidebar.
-   `partners.html` sets `data-palette="classic"`: the redesigned layout with the dashboard's own colours (owner preference). `?palette=v2` shows it in v2 colours. Dashboard / Units / Packages are unchanged (still v2 colours).
-   Note: classic colours bring back the dashboard's white label on the orange button (3.02:1) and the original grey text — the AA fixes from the ui-ux-pro-max pass live in the v2 palette only.

## 1.17.0-trial — 2026-11-17 · Partners: layout redesign (not just the skin)

Same data, rules and routes as the dashboard's Partners list — re-composed. Previous layout kept at `revisions/partners-2026-11-17-before-redesign.html`.

### Changed (`partners.html`)
-   **Head:** title + breadcrumb + a live summary line ("36 partners · 9 waiting for approval"); Add New Partner is the one full-size primary button.
-   **Status pills → four `stat-tile`s** (All · Pending · active · inactive) with counts; `aria-pressed`; clicking the active tile clears it (stat-tile contract). Each tile icon uses the matching status tone; 4 across, 2 × 2 below 900px.
-   **Toolbar:** search + Filter in one bar; applied filters (created by · country · state · city) show as removable `filter-chip`s with Clear all — removing a country also clears state/city, like the popover's cascade.
-   **Table 9 → 7 columns, no field dropped:** Partner (name + #id) · Owner (name, phone, email) · **Location** (city over state · country) · Units · Status · **Created** (date + by Partner/Admin) · Actions (eye → profile, `redirect_to_page` kept).
-   **Summary drawer** (registry `drawer` via `RD.openDrawer`): clicking a row or the partner name shows all of the partner's list fields read-only, with Open profile.
-   Verified: counts 36/9/23/4 as before; tiles, search (focus kept while typing), Filter popover + chips, paging, eye link and drawer; EN/AR, light/dark, 375/768/1440/1920 — no overflow.

## 1.16.0-trial — 2026-11-17 · Redesign trial (skin v2) on the first 4 pages

### Added
-   `assets/css/skin-v2.css` — a look-only redesign scoped under `:root[data-skin="v2"]`: dark ink sidebar in both themes, warm stone canvas, hairline cards, ink pill for the active segment / page, uppercase hairline table header, gradient KPI tiles and larger tabular numbers on the dashboard. Tokens first; no markup, copy, data or JS behaviour touched.
-   Enabled on `index.html`, `partners.html`, `units.html`, `packages.html` (a one-line head script sets `data-skin="v2"`; `?skin=classic` shows the current look for comparison). Every other page is unchanged.
-   Checked: EN/AR, light/dark, desktop/mobile — no overflow, no errors.

### Changed — ui-ux-pro-max pass
-   Style verified against the skill's **Data-Dense Dashboard** entry (the `--design-system` output proposed glassmorphism + Fira fonts — rejected: off-brand, and the identity is locked). Rows back to the compact base padding (12px); `tabular-nums` on every table cell; `cursor: pointer` on sortable headers.
-   Contrast (`color-accessible-pairs`, measured): grey text `#767985` → `#686b77` (3.74 → 4.58:1 on the sunken surface); sidebar group labels `#6f7380` → `#868a96` (3.82 → 5.24:1); **primary button label white → ink** (white on `#FC6404` is 3.02:1, ink is 6.0:1 — the orange fill is unchanged).
-   Table header text 11px → 12px (no text below 12px).
-   Solid orange focus outline inside the ink sidebar (`focus-states`) — the base translucent ring was too faint there.

### Added — three alternative shapes (`assets/css/skin-v2-looks.css`)
-   Same v2 colours, different shape — picked from ui-ux-pro-max `--domain style`: `?look=swiss` (Minimalism & Swiss: 2–4px radius, no shadows, underline tabs, 2px rule under the table head), `?look=bento` (Bento Box Grid: 24px tiles, bigger KPI, hover lift 1.01 behind `prefers-reduced-motion`), `?look=soft` (Soft UI Evolution: borderless cards with layered soft shadows, pressed state, 3px focus outline). Flat Design was rejected (it needs a new saturated palette).
-   Checked on index + partners × 3 looks × 375/1440 in AR + dark: no overflow.
-   `?look=glass` (Glassmorphism — the skill rates it "risk: conditional, requires contrast-text-4.5"): frosted panels (72% surface, `blur(18px)`), white edge + top shine, smoked-glass sidebar, and the light source is the brand orange as two fixed canvas glows — no new colours. The catalogue's 15% glass was rejected for data tables. Measured: grey text 4.70–5.02:1 on the glass (light/dark); glow capped at 10% so text sitting straight on the canvas (page head, dashboard filter summary) stays ≥ 4.57:1. Solid fallback for `prefers-reduced-transparency` and browsers without `backdrop-filter`.

### Fixed
-   The trial head script had a literal backspace character where `\b` was meant, so `?skin=classic` never switched back to the current look. Rewritten with `URLSearchParams`; `?skin=classic`, `?look=…` and an unknown look are all verified.

## 1.15.4 — 2026-11-16 · Vercel deployment config

### Added
-   `vercel.json` — static deploy (no framework, output `.`): the build command writes `assets/js/env.js` from the `API_BASE_URL` env var; `cleanUrls` like nginx; the same security and cache headers as `nginx.conf` (CSS/JS `no-cache`, images 7 days).
-   `.vercelignore` — Docker/nginx/serve files and local `env.js` / `.env` stay out of the deployment.
-   `docs/10-session-handoff.md` §1 — how to deploy on Vercel (env var, redeploy, CORS).

## 1.15.3 — 2026-11-16 · Topbar account: avatar only on mobile

### Fixed
-   Topbar account button showed avatar + full name on phones and pushed the topbar off-screen. At ≤768px it is now the avatar only (photo or initials); the name still shows on desktop and inside the account menu. `.rd-acct__name` (`shell.js`) + one media rule at the end of `shell.css`.

## 1.15.2 — 2026-11-16 · Sidebar version line in the collapsed rail

### Changed
-   Sidebar footer: the icon-only sidebar (collapsed, and the 76px flyout style) shows only **"v 1.0.0"** instead of wrapping "powered by high five - v 1.0.0" over four lines. `.sidebar__ver-full` / `.sidebar__ver-short` in `app.css`; the short label is `translate="no"`.

## 1.15.1 — 2026-11-16 · Quick Access removed from the shell

### Removed
-   `assets/shell.js`: the Partner Quick Access QR modal (`initQuickAccess`, ~690 lines — never called in this system), the dead QR button in the ≤640px app header (it opened nothing), its Arabic regex entry and its AR vocabulary block. Kept the three strings other pages still use ("n/a", "Joining", "Try again").
-   `assets/shell.css`: the `.rd-qa` / `.qa-*` styles (~195 lines).
-   Verified: `node --check` passes; bookings renders in AR + mobile with no errors.

## 1.15.0 — 2026-11-16 · Partner-only patterns removed

### Removed
-   `patterns/booking-flow.md`, `customer-360.md`, `email-templates.md`, `pos-checkout.md`, `scheduler-dnd.md`, `quick-access.md` — Partner surfaces the Super Admin dashboard doesn't have (create-booking wizard, customer profile, transactional emails, front-desk POS, scheduler, Quick Access QR). No Super Admin page used them. They stay in the Partner system; port one only for a Super Admin user story.

### Changed
-   `patterns/README.md` — index lists the 9 patterns that apply (module page, toolbar & filtering, record-detail drawer, status system, form validation, toast queue, mobile app mode, charts, result illustrations) with Super Admin "Seen on" pages; `form-validation`, `toast-queue` and `result-illustrations` were missing from the index before.
-   `components/record-header.md`, `components/resource-timeline.md` — dropped the links to the removed patterns.

## 1.14.0 — 2026-11-16 · Docs set complete for the Super Admin

### Added
-   `docs/01-business-guide.md` — the BA guide re-pointed at the Super Admin: the two rules (closed world + 1:1 with `HighFive-SuperAdmin-Front`), story template with the Super Admin modules and a permission line, enhancement-vs-new-screen routing, worked examples on Packages.
-   `docs/04-ai-prompts.md` — the prompt library with a Super Admin context header (shared kits, 1:1 rule, EN + AR) and a new **§10 parity check** (DS page vs dashboard source).
-   `docs/07-features-workflow.md` — where a story lands (product page with New markers vs the Features accordion), registry schema, BA loop, versioning, client-artifact recipe adapted to the Super Admin kits.
-   `docs/10-session-handoff.md` — what is outside the repo, the two login pages, page anatomy (every kit and its global), Arabic rules, gotchas, Partner parity, open items.
-   `docs/product-pages/README.md` — one manifest for all 59 pages: dashboard source path + shared kit.
-   `foundations/brand-identity-source.md` — where each identity value was read in the dashboard (custom.css, Metronic variables, index.html fonts).

### Changed
-   `docs/08-state-coverage-matrix.md` v2.0 — rewritten for Super Admin pages (the v1.0 rows were Partner screens); states follow the 1:1 rule, with the dashboard's own empty copy.
-   `layouts/page-templates.md` — the 8 Super Admin page types instead of the Partner future templates.
-   `design-system/README.md` — docs map lists every doc; handoff blurb no longer mentions Partner-only `base_id/` work.
-   `.claude-rules.md` §4.11 — the worked example no longer points at a Partner-only `bookings.html` enhancement.

### Fixed
-   Links to `01`, `04`, `07`, `10` and `brand-identity-source.md` from the README, rules, `.gitignore` and governance docs were dead; all resolve now.
-   `templates.html`: the empty-state copy uses the dashboard's "There is no data to display"; the setup-list template links Settings instead of Jobs (Jobs is not on the CRUD engine).

## 1.13.0 — 2026-11-16 · Design-system pages speak Super Admin

-   **templates.html** rewritten: "Future Page Templates" (Partner POS, QR check-in, chat, email, package shop, onboarding) replaced by the 8 **Super Admin page types** - Sign in · Forgot password + code · List page · Profile with tabs · Setup list + modal · Per-currency summary · Empty state · 404/500. Each links to the real pages that use it, follows EN/AR and stacks on mobile.
-   **components.html**: same 28 components, sample content switched from Partner (guests, courts, venues, walk-in sales, POS) to Super Admin data - partners, packages, approval, employees and permission groups, countries, wallet balance - with names from `sa-data.js`. The notifications-center demo now describes the bell → Notifications page.

## 1.12.2 — 2026-11-16 · QA pass (all pages × EN/AR × light/dark × desktop/mobile)

-   Checked 92 URLs (59 pages + tabs/variants) in 4 combinations: no JS errors, no horizontal overflow.
-   **Fix** `components.css`: mobile data-table cards wrap long content (`td > *` min-width 0 + `overflow-wrap:anywhere`); `.segmented` scrolls horizontally instead of overflowing.
-   **Fix** financials: per-currency money rows wrap; stats table wrapped in `data-table-scroll`.
-   **Fix** advertisements: preview side column uses `auto-fit` + `min(100%,340px)`; preview buttons wrap.
-   **Fix** design-system-access: removed the permissions cell min-width (mobile overflow).
-   **Fix** content editor: toolbar labels translated.
-   **Fix** `shell.js` arabize: skips text inside `.avatar`, `[translate="no"]`, `.notranslate` (initials like "OK" were being translated).

## 1.12.1 — 2026-11-16 · Auth + error pages

The dashboard's remaining routed screens, outside the sidebar.

- **login.html** now matches `modules/auth/Login.tsx`:
  - "Sign In" heading, the "Please Enter Admin Email Or Phone Number And Password" subtitle,
    an "Email Or Phone" field, and "Forgot Password ?".
  - Validation copy follows the dashboard's Yup rules: required, min 3, max 50, and "The
    login details are incorrect".
  - Removed because the dashboard doesn't have them: "Sign up" (commented out there),
    "Remember me" and the "Super Admin access" eyebrow.
  - The live API sign-in is unchanged. The dashboard's 4-digit login code step is not added:
    the dev API signs in directly.
- **forgot-password.html** (`auth/forgot-password`): email field, validated for format,
  min 3, max 50 and required. Next → verification code. Back To Login.
- **verification-code.html** (`auth/forgot-password/verification-code`):
  - **Step 1:** a 4-digit code sent to the masked phone. Boxes auto-advance and go back on
    backspace; validation shows "Must be a digit" or "this field is required". A wrong code
    clears the boxes and shows an error. Resend becomes available after a 30-second
    countdown. The sample code is 1234.
  - **Step 2:** New Password and Confirm Password (min 8, max 50, must match), then Reset
    Password.
- **error-404.html / error-500.html** (`error/404`, `error/500`): "Oops!" / "System Error"
  with an illustration and Return Home. The dashboard's copy is English-only; these pages
  add the Arabic.

## 1.12.0 — 2026-11-16 · Last sidebar pages — every Super Admin page is now built

No sidebar item is marked "coming soon" any more (`href: SOON` count: 0).

- **Design System admin** (`design-systems.html`, `design-system-pages.html`,
  `design-system-access.html`, `dsadmin.js`, CRUD engine):
  - **Systems:** name and active switch. A duplicate-name check uses the dashboard's
    message.
  - **Pages:**
    - Info note and a system filter.
    - System / New badges, plus a Key code column.
    - System pages are read-only.
    - The key auto-slugs from the name until it is edited by hand. Its validation is
      `^[a-z0-9]+(-[a-z0-9]+)*$` plus a duplicate check.
  - **Access:**
    - Users with name, email and password (8+ characters, a letter and a number; optional
      on edit).
    - Permissions are grouped by system, with an All / Clear toggle per group (new CRUD
      field type `groups`).
    - Picking any page of a system also grants that system's `dashboard` page.
- **Pages Content** (`pages-content-pages.html`, `pages-content-help-center.html`,
  `content.js`)
  - **Pages:**
    - Gallery button, no "add" (commented out in the dashboard).
    - Edit, view, gallery, translation.
  - **Help center:**
    - Add new.
    - A children link drills into `?parent=` (two levels).
    - Create / edit with parent and order fields.
    - View, gallery, delete.
  - **Content editor:** a small rich-text box (bold, italic, heading, lists, link) stands
    in for the dashboard's CKEditor 5. Validation copy is English-only, as in the
    dashboard.
- **settings.html:** one row (App Version). The update-version modal uses the English-only
  required message, as in the dashboard.
- **activities-contacts.html:** read-only list with an "All" pill and search. Columns: ID,
  name, email, phone, type badge, created at.
- **CRUD engine:** gains the `groups` field type and the `canEdit` / `canDel` per-row
  guards.

## 1.11.0 — 2026-11-16 · Notifications

The Notifications pages are live, and the topbar bell now opens the all-notifications
page.

- **notifications-users.html / notifications-partners.html**
  - **List:**
    - Pills: all / pending / send / failed.
    - Search.
    - A "Sending..." column header (the dashboard's own wording).
    - Status badge tones as in the dashboard: "sent" shows red.
    - A full-width targeting row under each notification:
      - **Users:** users, location type, location, gender, age, language, timing, statistics.
      - **Partners:** status, main location, categories, activities, timing, statistics.
    - Delete:
      - **Users:** any notification except sent.
      - **Partners:** pending only.
  - **Create** (`?new=1`): title, message (with the dashboard's mismatched "Maximum 50" text
    for a 200 limit), timing now / scheduled, then the targeting section.
  - **Users targeting:**
    - User type: guest and all force GPS and hide profile settings.
    - Activity status.
    - Phone country, or GPS country → state → city.
    - Gender and age group.
    - App language.
  - **Partners targeting:**
    - Status.
    - Country → state → city, filtering the Partner multi-select ("All" clears the other picks).
    - Category → activities.
  - **Both:**
    - Image (10 MB, JPG / PNG).
    - External link: its errors are English-only, as in the dashboard.
    - Test send: phone or email validation, then a success alert that clears after 3 s.
  - The dashboard's Edit pages are not built: nothing links to them.
- **notifications-settings.html** (CRUD engine): name, email, trigger chips (raw service
  names, as in the dashboard). Add and edit: name, email, triggers (at least one). Delete
  shows a "cannot be undone" note.
- **notifications.html**: the bell's page. Each row has title, body, date and a type button.
  The button links by type: partner, new comment, delete comment, cash out.

## 1.10.0 — 2026-11-16 · Marketing

The three Marketing pages are live.

- **Promo Codes and Partner's Promo Codes** (`marketing-promo-codes.html`,
  `marketing-partner-promo-codes.html`)
  - **One component.** The dashboard copies the same coupon UI three times: marketing,
    partner coupons, and the partner profile. Here all three use **one** component,
    `PP.tabs.coupons` in pp-people.js. It now accepts `ctx.coupons` (data), `ctx.newBtn` and
    `ctx.global` (create defaults to Geographic). A coupon's own partner (`c._p`) drives its
    view and usage rows.
  - **Promo Codes:** "+ new" in the toolbar; Super Admin coupons.
  - **Partner's Promo Codes:** the coupons partners created (`PP.couponsOf`); no "new", as in
    the dashboard.
  - **Shared parts:** list, status-only edit (with the "Updata" typo, as in the dashboard),
    delete, view with status history, usage details (bookings / joining / multi-sessions
    tabs plus Filter Options) and the New Coupon form.
- **Advertisement Management** (`marketing-advertisements.html`, `ads.js`)
  - **List:**
    - Pills: all / active / inactive / scheduled / expired. The display status is computed
      client-side from active plus the start and end dates.
    - Search: by name, or by exact ID when the query is all digits.
    - Priority badges are English-only, as in the dashboard.
    - Row actions: view, edit, activate / deactivate (confirm modal), and delete.
  - **Campaign form** (`?new=1` · `?edit=`): a three-step stepper. Steps are clickable in any
    order; Next validates the current step.
    - **Details:** basic info and priority segments, the send-campaign schedule (one time or
      periodic), delivery controls, and targeting (user type → activity, phone / GPS
      location, profile, language) with the dashboard's rules and messages.
    - **Trigger:** three trigger cards with screen / event pickers and an immediate or delayed
      start.
    - **Content:** accordions for image, action button (action → extra field, colours, font
      size, radius), close button, and popup settings (full screen, animations, overlay
      colour and opacity).
  - **Live preview:** a phone mock showing the overlay, popup or full-screen ad, CTA and
    close button. Replay, RTL and Full Screen work; clicking the overlay or close button
    plays the exit animation.
  - **View** (`?view=`): ten detail cards, plus the same preview.

## 1.9.0 — 2026-11-16 · Setup Files + Locations

Ten sidebar pages are live. They run on one new engine, **`assets/js/sa-crud.js`**
(`CRUD.page`, `CRUD.form`, `CRUD.del`, `CRUD.rules`).

The engine renders:
- the page head with the Add button;
- status pills, or pills built from a config;
- search, the table and the pager;
- the Create / Edit modal: fields with labels in the left column, rules and their exact
  messages, an image field, a multi-select, a switch and a map pick;
- the Delete modal (with an optional warning, and an alert or a silent close);
- the translation view (`?translation=`).

Each page is only a config. Two page scripts carry them: `setup.js` and `locations.js`.

- **Setup Files** (pages/setup-files, plus pages/banks):
  - **Types, Capacities, Services:** image, name, order and status.
    - The labels reuse TYPES.* strings, e.g. "enter type name", as in the dashboard.
    - Services validates differently on create ("Minimum 2", no order length) and adds
      the transparent-icon note.
    - The delete warning shows on Types and Capacities only.
  - **Age Groups:** start and end age, plus a description. The default group (#1) shows
    ∞, has no delete, and Edit hides its age range.
  - **Languages:** no pills and no search. Columns: description and ISO. The en and ar
    languages cannot be deleted.
  - **Banks:** a text order field and a native status select with no default.
  - **Support Categories:** pills by type (partner / user / booking / public event) and a
    required Type field. There is a tickets count and a subcategories link into the nested
    list (`?parent=`); the nested list's title is "{name} / {type}".
- **Locations** (pages/locations):
  - **Countries:** flag, ISO, phone code, currency, time zone, and documents / taxes count
    links.
  - **States:** country.
  - **Cities:** country → state cascade.
  - All three: status defaults to inactive, and a map pick is required. The map is a
    stand-in for the dashboard's Google Places map. On cities, a missing pick shows the
    "not within the governorate boundaries" message.
  - **Documents** (`?docs=`): pills required / not required.
  - **Taxes** (`?taxes=`): "{tax}%".
  - Documents and taxes work at all three levels. Their breadcrumb is always "Countries",
    as in the dashboard.
  - The State delete text says "city" in English: the dashboard's own i18n bug, kept.

## 1.8.0 — 2026-11-16 · Employees

The Employees group in the sidebar is live: three pages rebuilt from pages/emploayees. The
content is one to one with the dashboard; only the look changes. All three read one shared
data file, `assets/js/sa-emp.js` (new).

- **employees.html**
  - Add new, pills (all / active / inactive), search by name / phone / email, and a Filter
    for country and job.
  - Seven columns.
  - Row actions:
    - **Reset password:** 8–50 characters, and the two fields must match.
    - **Edit employee:** same form as Create.
    - **Delete.**
  - **Create / edit employee form:** image (1 MB), name, email, phone code + phone (the
    dashboard's regex), job, country and status.
  - As in the dashboard, success closes silently and errors show inline.
- **jobs.html**
  - Pills, search, and a list with an employees count.
  - Create and edit job. The dashboard's mismatched validation messages are kept: the
    message says 3 while the rule is 2, and says 50 while the rule is 150.
  - Delete is disabled while employees are linked to the job. The modal stays open on the
    success alert, as it does in the dashboard.
  - Job #1 (admin) has no actions.
  - **Permissions** (`?id=`):
    - group picker, with an accordion per group;
    - select-all for each sub-module;
    - removing a group asks first, using the dashboard's own English-only confirm;
    - Save Updates shows an inline alert that clears after 3 s.
- **activity-log.html**
  - Search, plus a Modules checkbox menu that is grouped and searchable, with Clear and
    Apply.
  - Action and Performed by filters.
  - An "Acting as" partner menu with its note, a date range and Clear all.
  - Filters are kept in the URL.
  - Action badges use the dashboard's inline colours.
  - **Details** (`?id=`):
    - summary;
    - acting-as box;
    - changed fields (before / after) or a list of fields;
    - attribute badges and player links;
    - Yes/No and Active/Inactive, left untranslated as in the dashboard;
    - date formatting;
    - raw JSON.
    - Back restores the list's filters.

## 1.7.0 — 2026-11-15 · Finance

Four more sidebar pages are live, rebuilt from the dashboard. Content is 1:1; only the look
changes.

- **financials.html** (pages/financials)
  - **Overview:** Export (CSV) and Filter (year, month). One card per country, with a
    revenues table (online / cash / total × revenue / collected) and a **Show** button.
  - **Country page** (`?iso=`): four stat tables (booking, public event, packages when they
    are visible, revenues). The collected cells carry info tips.
  - Partner rows show cash / online / total per group.
  - Filter: year, month, state → city. Reset re-queries.
  - The eye opens the partner's financials tab. No charts, as in the dashboard.
- **wallet.html** (pages/wallet), six views:
  - **Country wallets:** total balance, plus pending funds, pending cash out and exchanges
    with their counts.
  - **Transactions:** in / out pills. The eye opens the fund or cash-out modal, the booking,
    event or multi-booking page, or the user's subscription.
  - **Funds and cash out:** status pills; edit pending rows; view modal.
  - **Exchanges:** view modal with old / new phone.
  - **Currencies:** pills, base-currency exchange rate, create / edit with the dashboard
    validation, delete, and a translation page.
  - Rows are the users' own wallet records, so an edit here also shows in the user
    profile. Fund and cash-out ids are now unique per user.
- **activities.html** (pages/activites)
  - **Categories:** pills, search, and an activities-count link. Create / edit / delete, all
    with inline alerts.
  - **Activities** (`?cat=`): type, capacity and services chips. Edit can move an activity
    to another category.
  - **Translation:** `?translation=`.
- **subscriptions.html**: read-only id + email list. Search starts at 3 characters.
- **Kept one to one with the dashboard:**
  - the "States / المحافظات" status header;
  - "Minimum 3 symbols" shown for a 2-character minimum;
  - the fund / cash-out edit title "add fund to user wallet";
  - the "fund id" title on exchanges, and the missing id in the funds / cash-out modal
    titles.
- **Not kept:** the dashboard's double colon in "State::" / "City::". It is a rendering bug,
  so it shows a single colon here.

## 1.6.0 — 2026-11-15 · Operations

Five sidebar pages are now live, rebuilt from the dashboard pages listed below. Their
content is one to one with the dashboard; only the look changes.

- **public-events.html** (pages/public-events)
  - Pills: all / coming / ended / cancelled.
  - Filter Options: session date, category → activity, age group and session gender.
  - 13 columns, including App Type and the Check-in count.
  - `?view=<id>` opens the shared event view inside a "Public event ID" card, with no back
    button (the dashboard has it commented out).
- **joining-list.html** (public-events/joining-list)
  - Pills: joined / left / removed.
  - Search starts at 3 characters.
  - Filter Options: 8 fields. Session and joining dates take a time too. Reset re-queries.
  - 14 columns, including the Check-in status with time, by and method.
- **bookings.html** (pages/bookings)
  - 5 pills, including Pending Approval.
  - Filter Options: session date, check-in date, category → activity, booking type and
    gender.
  - The Flexible badge and the "Online Flexible Booking" type.
  - `?view=<id>` opens the shared booking view.
- **multi-booking.html** (pages/multi-booking), three views:
  - **List:** booked / max capacity, App Type and Check-in.
  - **Session** (`?id=`): general information, session information with the Break Down
    modal, and User Bookings with search. Back follows `from` / `unit_id` / `user_id` /
    `redirect_to_page`.
  - **Booking details** (`?details=`): session, booking, ticket check-ins, payment and
    payment history (coupon columns are hidden for cash). It has its own Break Down modal
    and no back button.
- **comments.html** (pages/comments)
  - Pills: all / published / deletion request / deleted.
  - 9 columns.
  - Booking and event rows open the Delete / Restore modals; their result shows as an
    inline alert that closes after 1 s. Package rows open the package page's own modals
    (approve, decline, delete with reason, restore, view). `KP.commentAct` and
    `KP.commentView` are now exposed so both pages share them.
  - `?commentId=` deep link.
- **One data source.** `assets/js/sa-ops.js` (new) builds every list from the partners' own
  sessions (`PP.ops`). The same rows show in the partner, unit and user profiles.
- **Links now point to the new pages.** The multi-booking eye on the partner, unit and user
  profiles and the multi-booking row in the user wallet now open these pages.
- **Kit:** `PP.filterPop` range fields accept `input: "datetime-local"`.

## 1.5.1 — 2026-11-15 · Input borders

Owner request: inputs and selects are neutral at rest. They turn brand orange on hover and
are orange with the focus ring on focus.

- This replaces the inherited Partner rule (`--input-border-accent`), which had them
  orange at rest and grey on hover.
- New tokens: `--input-border` (`--color-border-strong`) and `--input-border-hover`
  (`--color-primary`).
- Disabled, read-only and error fields keep their own border on hover.
- The auth fields' orange-tinted resting border is removed as well.

## 1.5.0 — 2026-11-15 · Users + user profile

`users.html` and `user-profile.html?id=<userId>&tab=<key>[&redirect_to_page=…]` are rebuilt
from pages/users. The content matches the dashboard one to one; only the look is new. The
sidebar's Users item is live now.

- **Users list:**
  - Pills: all, available, blocked.
  - Search on name, username, phone or email; it starts at 3 characters.
  - Filter Options: country, profile location, GPS country → state → city, gender, and
    min/max age. Reset only clears the form.
  - 10 columns, including the dashboard's "statu activity" header typo.
  - Page sizes 15/50/100. The eye keeps `redirect_to_page`.
- **Profile shell:** hero with photo, name, (username), bio, country, gender, age and
  wallet. Status block plus the Update status modal (blocked/active). 8 tabs.
- **`assets/js/us/us-tabs.js`:**
  - info, with the update-user modal. Its validation copy stays English, as in the dashboard.
  - bookings, multi-bookings and public events: pills, search, the shared Filter Options and
    the dashboard columns.
  - packages: 7 pills, Filter Options, the dashboard columns and unpaid rows tinted.
  - comments: pills, view, delete and restore.
  - notes.
- **`assets/js/us/us-wallet.js`:**
  - wallet: in/out pills, transaction search, and a row eye that opens the matching view:
    fund, cash-out, booking, event or subscription.
  - wallet - funds: new fund, edit pending, view.
  - wallet - cash out: edit pending, view.
  - There are no balance cards and no delete actions, matching the dashboard.
- **Shared rather than copied:** in the dashboard these are the same components, so the
  design system reuses them here too.
  - The booking and public-event views come from `pp-ops.js` via `PP.ops`.
  - Notes is the partner thread.
  - The subscription page is `KP.subscriber`, which gains `opts.href`.
  - A user's subscriptions and sessions are the same records the package and partner pages
    show.
- **Kit:** `PP.filterPop` gains an `agerange` field. `sa-data.js` gains 42 sample users.
- **Not linked yet:** the multi-booking eye points to `/multi-booking/details/{id}`, which
  is the Multi-Booking Sessions details page and is not built yet.

## 1.4.0 — 2026-11-15 · Package details + edit package

`package-detail.html?id=<pkgId>&tab=<key>` and `package-edit.html?id=<pkgId>[&section=…]`,
rebuilt from pages/packages/{package-detail,package-edit}. The page content matches the dashboard one to one; only the look changes. Opened from the
name or eye on Packages and on the partner profile's Packages list. Back returns to the
exact list URL (`sessionStorage packages:listUrl`).

- **Header:** banner, cover, `#id`, approval badge (Approved in green, as on the list), status badge, hints. The pencil opens **Package Approval** while the package is
  pending: review, then Reject with a reason (10–500 characters) or Approve, then jump to
  the next pending package. Otherwise it opens **Package Status**, where deactivating
  needs a reason. The header also has translation, previous/next ("n of total"), partner,
  categories, rating, description, the last action and the rejection reason.
- **Tabs with counts.** QR Management appears only once the package is approved. Policy
  is hidden on walk-in packages.
  - `kp-info.js`: details (manual renew toggle), plans (filter chips + plan modal →
    subscribers), branches, gallery (cover first + lightbox).
  - `kp-ops.js`: selling (read-only); subscribers (8 status chips, search, Filter Options,
    sort, export, unpaid rows tinted); the subscriber page (summary cards + overview,
    usage history, payments, review and activity, all read-only); comments (pills;
    view / delete / approve / decline / restore modals).
  - `kp-admin.js`:
    - financial: taxes switches; default and scheduled commission with
      add/edit/view/delete and history, plus every validation rule.
    - QR management: barcode settings edit with validation; employees assign/edit/remove.
    - policy: linked / missing / not online.
    - activity log: Super Admin / Partner logs, Filter Options.
- **Edit package:** 9 sections (status, basic, branches, media, availability, validity &
  plans, access schedule, capacity, usage). It has the "fix the highlighted fields in"
  jump list, a sticky Cancel / Save bar (or "Save and resubmit" on rejected packages) that
  stays disabled until something changes, and a Discard-changes guard.
- **Kept one to one with the dashboard:** saving the QR barcode settings shows the
  Financial toast ("Financial settings saved"), exactly as the dashboard does.

## 1.3.0 — 2026-11-15 · Unit profile

`unit-profile.html?id=<unitId>&tab=<key>` — rebuilt from pages/units/profile (content
1:1, look only). Opened from the eye on Units, on the partner profile's Units tab and on
every "units" sub-table.

- **Shell:** "units profile", back (keeps `redirect_to_page`), hero (rating, booking
  methodology, online badge, name, company, description, translation) and the status block
  — HighFive status, plus Partner App status for independent show-in-app partners, with
  the two dashboard modals (simple / Partner-App-gated). 13 tabs in a scrolling strip
  (no "More", as in the dashboard).
- **Unit-only tabs** (`assets/js/up/up-info.js`, `up-settings.js`): details (+ update unit
  modal with category → activity reset and the online-attendance note), location (main /
  part, part from, conflicted with, cascading state → city), gallery (Full Image option),
  comments (status pills, fake comments add/edit/delete/view, restore, view modal),
  assigned employees (owner first, coordinator contact), assigned service lists
  (per-unit enable switch, drag to reorder, search), settings (general + edit, age groups,
  taxes per country/state/city), financial (default + scheduled, add/edit/view/delete,
  logs).
- **Shared tabs in unit mode** (`pp-ops.js` reads `ctx.unit`): public events and bookings
  (no Unit column, unit search, Filter Options), multi-bookings, the single policy (no
  back), contacts (name + phone). Kit: columns can opt out with `hidden: true`.
- **Translation:** unit name + description via `sa-translation.js`.

## 1.2.2 — 2026-11-15 · Lists and Services — one implementation

- `assets/js/sa-services.js` (new) holds the Service Lists table, the services table and
  every modal (approve/reject, edit list, delete, add/edit service, visibility, delete).
  Used by `partner-services.html`, `partner-services-list.html` **and** the partner
  profile "Lists and Services" tab, so they can no longer drift. The profile variant is
  the dashboard's: no Company column, "Search by list name…", no company line in the
  summary, plus **Add service list** (full form + validation) and **add new** service.
- `assets/js/sa-translation.js` (new) — the one translation page renderer.
  `services-translation.html` (new) covers `?list=` (name · note) and `?service=`
  (name · description); the profile uses it for partner, branch, list and service.
  Every globe icon on lists/services now opens its translation page.

## 1.2.1 — 2026-11-15 · Partner profile — gaps closed

- **Translation pages** (partner + branch): own page (no profile header / tab bar),
  Language · translated fields · Created · Actions, edit + delete modals. Opened from the
  globe on the hero and on branches.
- **Filters now work** via one shared `PP.filterPop` (Filter Options popover): branches
  (country → state → city), units (category → activity, type, capacity, availability),
  financials (year, month, category → activity, unit, branch, package multi, subscription
  status, transactions type, payment method; active-filter count on the button), coupon
  usage (session / booking-joining date ranges, category, activity, booking type or age
  group, gender, status). Activity log: grouped, searchable Modules multi-select (Clear
  modules · Apply) + Performed by.
- **Financials:** Export (sample: CSV of the visible rows), package sale rows with the
  "Package transaction" modal (summary, collections, refunds, tax breakdown, commission).
- **Branch details:** Edit Location state → city now cascade; gallery Upload / Change photo
  open the upload modal (size limits enforced).
- **Fixes:** pagination arrows (one glyph, CSS mirrors — were reversed in both
  directions), More button alignment, overflowing tabs move into More, tables no longer
  replay their entrance animation on every repaint.

## 1.2.0 — 2026-11-15 · Partner profile

`partner-profile.html?id=<partnerId>&tab=<key>` — rebuilt from
pages/partners/profile (content 1:1, look only). Opened from the eye on Partners.

- **Shell:** title "partner profile", Login as Partner + back, hero (photo · name ·
  translation · edit profile · ID · bio · status block with update-status modal), and the
  22-tab bar — 10 on the bar, 12 under a pinned "More" menu. Tabs switch in place with
  their own URL (deep-linkable, back/forward work).
- **Info tabs** (`assets/js/pp/pp-info.js`): owner (+ edit owner, reset password),
  location (+ edit), gallery (upload, main photo, delete), documents (upload/edit/delete),
  settings (12 rows + edit, manual check-in off warning), notes (compose, replies, delete),
  QR settings (read-only branches accordion).
- **Catalogue tabs** (`pp-catalog.js`): packages (general toggles + disable warning, age
  groups + add, partner package list), lists & services (+ add service list, list →
  services), branches (expandable rows, branch details with gallery/location + edit
  modals), units.
- **Operations tabs** (`pp-ops.js`): public events (+ full event view with players,
  payment and 4 break-down modals), bookings (+ booking view: session, additional
  services, check-in, payment, history), multi-bookings, policies (+ units, + view),
  employees (+ units), contacts (+ units).
- **People & money tabs** (`pp-people.js`): customers (high five · manual), memberships
  (members, categories, category units), financials (4 stat tables + 13-column
  transactions), activity log (+ detail), coupons (list, view, usage details, new coupon
  with validation — URL-only, as in the dashboard: `&new=1`).

Shared: `assets/js/pp/pp-core.js` (tab registry, per-partner sample data, card / kv
helpers). Component change: `.tabs` now also styles link tabs (`.tabs > a`), same look
as button tabs — navigation tabs must be links so each tab has a real URL.

## 1.1.0 — 2026-11-15 · Partners, Services, Units, Packages

Rebuilt from the real React pages (content 1:1, look only):

- **partners.html** — status pills with counts (all · Pending · active · inactive), search,
  Filter Options (Created by · country · state · city), 9 columns, eye → profile.
- **partners-add.html** — 3-step vertical wizard (Sign Up · Company Information ·
  Documents) with the dashboard's validation copy; documents follow country/state/city.
- **partner-services.html** — Service Lists (pills, 3-char search, 9 columns) + Approve /
  reject, Edit service list (3 sections + all validation rules) and Delete modals; Delete
  hidden on default lists.
- **partner-services-list.html** — list summary card + services table (approval pills,
  10 columns) + Add / Edit service (each in its own field order), visibility confirm, delete.
- **units.html** — pills, search, 7-field filter, 11 columns.
- **packages.html** — approval pills, search, filter with active-groups count, sortable
  Name / Subscribers / Status, 11 columns, 20/50/100 page sizes; sidebar pending count.

New shared files: `assets/js/sa-kit.js` (head, pills, search, table, pager, list
controller, modal, popover — composed only from registry components) and
`assets/js/sa-data.js` (sample records shaped like the API responses).

Deliberate differences from the dashboard: the package "Approved" badge uses the system's
success green instead of the custom amber `#f59e0b` (amber already means Pending); the
eye / translation / profile links point nowhere until those pages ship (phase 3).

## 1.0.1 — 2026-11-15 · Look only — match the real Super Admin

Rule (owner): this system restyles the Super Admin; it never changes a page's content and
never adds Partner-only features.

- **Shell chrome = the real dashboard's.** Topbar: language + dark-mode toggles (owner request), notification bell (link + count) and the
  user block (avatar + name) only. User menu: name/email + edit, Email · phone · job ·
  country rows, Sign Out. Sidebar footer: "powered by high
  five - v 1.0.0".
- **Removed** (not in the Super Admin): QR quick access/scanner, Support flyout, Partner
  mobile-app mode (app header, pill nav, device switch), topbar search and ⌘K palette,
  style-switcher FAB, phone tab bar, notifications panel, Company Profile.
- **Dashboard rebuilt from `Dashboard.js`**: title + "country - state - city" filter
  (Filter Options · country/state/city · Reset/Apply), then the six real rows — Partners,
  Units, Users (+ user engagement), gender & age groups, Bookings, Public events — each a
  stats card beside its chart card, same labels (EN/AR), same period toggles
  (all/year/month) and category/activity filters. The invented dashboard from 1.0.0 is gone.

## 1.0.0 — 2026-11-15 · Fork from the Partner Web Design System

**Phase 1 (foundation).** See [06-roadmap.md](06-roadmap.md).

### Inherited unchanged
- `assets/css/{base,app,components,datepicker}.css`, `assets/shell.css` — every component,
  pattern and layout of the Partner system, same classes.
- Registry, patterns, layouts and foundations docs (`design-system/`).

### Changed — identity (Tier-1 tokens only)
- Primary ramp `--lime-*` → Super Admin orange, `--lime-500` = `#FC6404`.
- `--color-on-primary` → `#FFFFFF` (the dashboard's white-on-orange buttons).
- `--color-primary-ink` (light) → `--lime-700` `#B84300`, readable as text on white.
- New `--gray-100 … --gray-900` primitives (the dashboard's own blue-grey scale);
  light canvas `#FCFCFC`, text `#071437`, borders `#DBDFE9`, white sidebar.
- Dark theme → `#131313` canvas/sidebar, `#1C1C1C` surfaces.
- Shadows → the dashboard's soft purple-grey `rgba(82,63,105,…)`.
- Fonts → Inter (EN) + Tajawal (AR).

### Changed — shell
- `RD.NAV` → the Super Admin sidebar (24 sections, accordions, EN + AR labels).
- `NAV_PERM` → 24 page keys ([11-page-permissions.md](11-page-permissions.md)).
- Removed the Partner-only `?packages=off` sidebar variant.
- Quick links → Partners, Bookings, Users, Packages, Financials.
- Header sub-label → "HighFive Super Admin".

### Changed — access
- `api.js` `SYSTEM` → `"superadmin"`.
- Login copy → Super Admin; the post-login Web/Mobile chooser no longer opens (no mobile app).

### Known contrast note
White text on `#FC6404` measures ≈ 3.0 : 1 — passes for large text and UI shapes (AA 3 : 1)
but not for small body text (4.5 : 1). Kept because it is the dashboard's current button
style; button labels are semibold. Revisit if the client wants strict AA on small buttons.
