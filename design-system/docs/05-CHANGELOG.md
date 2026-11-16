# Changelog

Semver per [03-governance-workflow.md](03-governance-workflow.md) §6.

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
