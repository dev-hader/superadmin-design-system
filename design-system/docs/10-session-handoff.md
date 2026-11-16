# Session handoff — how the Super Admin pages are built

Working notes carried in the repo so they survive a machine change. Claude Code
transcripts live only on the machine that ran them (`~/.claude/projects/…`), so
anything worth keeping has to be written down here instead.

**Last updated:** 2026-11-16 · **State:** all 59 pages built, QA'd in EN/AR ×
light/dark × desktop/mobile (changelog 1.12.2), templates + components on Super Admin
content (1.13.0).

---

## 1. What is NOT in the repo

| Path | What it is | Consequence |
|---|---|---|
| `assets/js/env.js` | runtime config (`API_BASE_URL`), **gitignored** — Docker writes it at image build from `env.template.js` | a fresh clone has no `env.js`; copy `env.template.js` and set the URL to preview against a backend |
| `base_id/` | the client brand deck (Partner identity), gitignored | **not needed here** — the Super Admin identity comes from the dashboard's own Sass (`foundations/brand-identity-source.md`) |
| the page generator | the pages were produced by a small build script that lived outside the repo | **nothing depends on it** — every page is self-contained: its script is inline at the bottom of the `.html`. Edit the page directly |
| `HighFive-SuperAdmin-Front` | the live dashboard, a sibling folder | the source of truth for every product page's content (§3); not needed to *run* the DS |

---

### Deploying on Vercel

`vercel.json` makes the repo deployable as a plain static site (Framework Preset
**Other**, no install step). Its `buildCommand` writes `assets/js/env.js` from the
`API_BASE_URL` environment variable — the Vercel twin of the Dockerfile's `envsubst` step.
Set `API_BASE_URL` in Project → Settings → Environment Variables and **redeploy** after
changing it (the value is baked in at build time). `cleanUrls` mirrors nginx
(`/bookings` → `bookings.html`); `.vercelignore` drops the Docker/nginx files. The backend
must allow the Vercel origin in CORS (and the `Authorization` header), or sign-in fails
even with a correct `env.js`.

---

## 2. Two login pages — on purpose

| Page | What it is |
|---|---|
| `login.html` | the **design reference** of the dashboard's Sign In (same copy: "Please Enter Admin Email Or Phone Number And Password", Email Or Phone, Forgot Password ?). No API calls. |
| `login-live.html` | the **real entry point** of the DS site, wired to the Design System Access backend (`superadmin` system, `assets/js/api.js`). |

`RD.boot()` runs the access guard: with no session it redirects to
`login-live.html?redirect=…`. `forgot-password.html` → `verification-code.html` are design
references of the dashboard's reset flow (sample code **1234**).

---

## 3. Page anatomy

Every product page is: shell (`RD.boot`) + sample data + one inline script that composes
the screen from a shared kit. The comment at the top of each page names the dashboard
source it mirrors; the full map is [`product-pages/README.md`](product-pages/README.md).

| File | Global | Role |
|---|---|---|
| `assets/js/sa-data.js` | `HF.SA` | sample records shaped like the API: partners, units, packages, users, CATS/ACTS/TYPES/CAPS, GEO |
| `assets/js/sa-ops.js` · `sa-emp.js` | — | operations (events, bookings, multi-booking, comments) · employees/jobs/activity-log samples |
| `assets/js/sa-kit.js` | `SA` | the list page: `head` (title + breadcrumb), `pills`, `search`, `table` (sortable, `hidden` columns), `pager`, `list(state, …)`, `modal`, `popover`, `field`, `select`, `L`/`T` (EN/AR) |
| `assets/js/sa-crud.js` | `CRUD` | one engine for every plain setup list (Setup Files, Locations, Banks, Notifications, Content…): a config object of columns + field types → table, add/edit modal, delete confirm, translation link |
| `assets/js/sa-translation.js` | `SATR` | the shared `?translation=<id>` page every CRUD list reuses |
| `assets/js/sa-services.js` | — | Partners Lists and Services |
| `assets/js/pp/*` | `PP` | partner profile tabs (core · info · catalog · ops · people); `PP.filterPop`, `PP.ops`, `PP.couponsOf` are reused elsewhere |
| `assets/js/up/*` | — | unit profile tabs |
| `assets/js/kp/*` | `KP` | package detail tabs (info · ops · admin) |
| `assets/js/us/*` | `US` | user profile tabs + wallet |

Rule of thumb: when the dashboard copies a component between pages, the DS **shares** it
(bookings/event views, notes, coupons, subscriber page). Change the kit, then check every
page that loads it.

---

## 4. Arabic

- Strings are written as `L("English", "عربي")` inside scripts, or `data-ar="…"` on static
  markup. The shell also runs a text-node pass (`arabize()`, `AR_VOCAB` in `shell.js`) for
  shared vocabulary.
- **`data-ar` replaces the element's whole `textContent`.** Put it on a leaf `<span>`,
  never on an element that also holds an icon — the icon gets eaten.
- **The text-node pass skips `.avatar`, `[translate="no"]` and `.notranslate`.** Avatar
  initials like "OK" were being translated to "موافق" before this rule (1.12.2). Mark any
  code/ID-like text the same way.
- What stays English in Arabic mode **on purpose**: data (names, descriptions),
  strings the dashboard itself hardcodes in English ("Permissions Group:", raw permission
  names, notification types), and the DS docs pages (foundations/components).

---

## 5. Gotchas that cost real time here

- **Line endings.** `assets/css/*.css` and `shell.css` are CRLF (tokens.css/shell.css are
  mixed). A scripted find-and-replace must normalise to LF, edit, and restore CRLF —
  otherwise the match silently misses.
- **Previewing without a backend.** The access guard redirects every page to
  `login-live.html`. To check a page locally without a session, serve a temporary copy
  with the `env.js` and `api.js` `<script>` tags removed — and delete the copy after.
- **The space scale has holes.** Only `--space-0,1,2,3,4,5,6,8,10,12,16,20,24` exist.
  `var(--space-7)` inside a `padding` shorthand voids the whole declaration.
- **Mobile tables become cards** (≤768px). Every non-first cell needs `data-label`; long
  content wraps because `.data-table td > *` has `min-width: 0` + `overflow-wrap: anywhere`.
  Wide inner tables go inside `.data-table-scroll`.
- **Status pills (`.segmented`) scroll sideways** on narrow screens instead of wrapping.
- **Sample numbers can arrive as strings** (shaped like the API) — coerce with `+x` before
  arithmetic (`(base + tax).toFixed` failed on multi-booking once).
- **Inputs:** border is grey at rest and orange on hover/focus
  (`--input-border` / `--input-border-hover`, 1.5.1) — never orange at rest.
- **`overflow: auto/hidden` clips box-shadows** into a hard rectangle.

---

## 6. Partner parity

This repo is a fork of the Partner Web Design System. Component and shell fixes should be
ported both ways (`.claude-rules.md` §0). Things that intentionally differ:

- identity (orange, Inter/Tajawal, `#131313` dark) — `tokens.css` Tier-1 only;
- the page catalogue, sidebar and `NAV_PERM` keys;
- the notifications bell links to `notifications.html` (no inbox drawer);
- `templates.html` shows the Super Admin page types, not Partner future templates.

---

## 7. Open / queued

- **No Super Admin user story yet** — `features/features.js` is empty; the first story
  follows [`07-features-workflow.md`](07-features-workflow.md).
- **Deployment** — hostname, GitHub repo and secrets are not set up
  (`.claude-rules.md` §8).
- **Backend setup** — the `superadmin` system and its 24 page keys must exist in the
  dashboard's Design System pages before anyone can sign in to `login-live.html`
  ([`11-page-permissions.md`](11-page-permissions.md)).
