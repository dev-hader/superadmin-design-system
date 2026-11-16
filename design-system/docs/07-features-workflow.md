# Features Workflow — how business features land in the system

**Status: ADOPTED** (inherited from the Partner system's owner directive, 2026-07-19;
re-pointed at the Super Admin 2026-11-16). This is the structure the Business Analyst
follows for every new Super Admin feature UI. It extends `.claude-rules.md` §4 (proposal
protocol): the UI reference described here IS the proposal artifact.

**Today:** the registry is empty (`HF.FEATURES = []`) — no Super Admin user story has
arrived yet, so the Features accordion does not show. It appears by itself with the
first entry.

## 1. Enhancement or new feature — decide first

`.claude-rules.md` §4.11 decides where a story's design lives:

| The story… | Lives in | Marked by |
|---|---|---|
| adds to a page that already exists (a column on `bookings.html`, a filter on `packages.html`, a tab on `partner-profile.html`) | **that product page** | green tint + **New** badge on every new element (`data-new="<feature-id>"` + `.badge--new`); focused review via `<page>.html?whatsnew=<feature-id>` |
| is a screen the dashboard doesn't have | `features/<feature-id>/` + an entry in the **Features** accordion | the accordion entry and its version chip |

An enhancement is recorded in the product page's row of
[`product-pages/README.md`](product-pages/README.md) and is **not** listed in
`features/features.js`.

## 2. The navigation structure

Inside the **Design System** accordion in the sidebar, a nested accordion named
**Features** (فيتشرز):

```
DESIGN SYSTEM ▾
├── Foundations
├── Components
├── Templates
└── FEATURES ▾                          ← nested accordion (hidden while empty)
    ├── Partner approval SLA   v1.1 ▾   ← one entry per feature: name + version chip
    │   ├── Pending approvals queue     ← the feature's user stories
    │   └── Escalate overdue approval   ← click → opens the story's UI reference
    └── Bulk notifications     v1.0 ▾
        └── Send to a user segment
```

(Feature names above are illustrative.)

- **Feature row** = feature name + concise semver chip, itself an accordion.
- **Story row** = user-story title; clicking opens the UI reference page for that story.
- Everything renders from one registry file — nothing is hand-edited in the shell.

## 3. Files & single source of truth

| Piece | Location | Notes |
|---|---|---|
| Features registry | `features/features.js` → `window.HF.FEATURES` | `[{ id, name, name_ar?, version, stories: [{ id, title, title_ar?, href }] }]` — the shell renders the accordion from this array |
| Story UI reference | `features/<feature-id>/<story-id>.html` | a full app-shell page composed **100% from registry components and the shared kits** (closed world) |
| Components manifest | `features/<feature-id>/<story-id>.COMPONENTS.md` | registry ids used (rules §4.3) + non-visual acceptance criteria |
| Approval record | `features/<feature-id>/APPROVAL.md` | who approved, when, which stories (rules §4.4) |

The shell loads `features/features.js` by itself (`ensureFeatures()` in
`assets/shell.js`), so a page never includes it. A story page loads only the sample data it
needs (`assets/js/sa-data.js`, and `sa-ops.js` / `sa-emp.js` for operations or employees).

## 4. The BA loop (per user story)

**Standing directives — apply without being asked:**
- Receiving a user story IS the instruction to build it. No confirmation questions.
- Every story ships **3 genuinely different design variants** (one page, a Design A · B · C
  switcher) for the client to choose; after approval the winner stays, the rest are removed.
- References are **fully interactive, like a real product** — every AC interaction works:
  flows, validations (disabled/enabled), state changes, toasts, empty/error states.
- **No meta content on the artifact**: reviewer notes / system-behaviour ACs live in the
  story's `COMPONENTS.md`, never on the reference page — and **no simulation/testing
  controls either**. Response-dependent states are wired by the frontend developer from
  the user story at API-integration time; the reference leaves a code comment marking the
  branch and its exact copy.
- **Both languages from day one**: every string as `L(en, ar)` or `data-ar`.
- A component the story needs but the registry lacks: compose it in the story, and **after
  the feature design is done, add it to the design system automatically** (CSS + registry
  entry `approved` + index + demo + changelog), then port it to the Partner system.

1. **Write the user story** ([`01-business-guide.md`](01-business-guide.md) §2 format).
2. **Decide the home** (§1).
3. **Generate the UI reference**: registry components + tokens only; 3 variants; reachable
   loading/empty/no-results/error states; light + dark; EN + AR; ≤768px behaviour;
   sample data from `sa-data.js`.
4. **Register it**: add/extend the feature entry in `features/features.js` — it appears in
   the sidebar automatically. Add the feature/story names to the Arabic vocabulary.
5. **Review on the real link** → client picks a variant → record approval in `APPROVAL.md`,
   keep the chosen variant only. Approved references are frozen; changes ride the
   modification flow (rules §4.4–4.5).
6. **Grow the system**: promote any newly-composed piece into the registry (§4, last directive).

## 5. Feature versioning (the chip)

Per-feature semver, shown concisely next to the name:

| Bump | When |
|---|---|
| **MINOR** `x.Y` | a new user story / new UI reference added |
| **PATCH** `x.y.Z` | a fix or approved modification to an existing story's UI |
| **MAJOR** `X.0` | the feature's UI is rebuilt or its scope redefined |

Every bump gets a line in [`05-CHANGELOG.md`](05-CHANGELOG.md) under the feature's name.

## 6. Client artifact delivery

The conversational contract between Claude and the Business Analyst (same as the Partner
system):

1. **After delivering any story's design**, Claude always closes with the reminder:
   *"بمجرد ما تخلّصي بيزنس الفيتشر كلها بلّغيني — أكريتلك أرتفكت بالتصميم اللي خلص."*
2. **When the BA says the feature's business is done**, Claude asks exactly one question:
   *"قوليلي اسم الفيتشر اللي عايزة تعملي بيها أرتفكت عشان تشيريها للعميل."*
3. **When the BA names the feature**, Claude publishes an artifact for **that feature
   only** and hands back the link(s) to share with the client — reminding the BA the
   artifact is private until shared from the artifact page's share menu.

**Build recipe (self-contained artifact per story page):** take the story's reference
page → remove doctype/html/head/body wrappers and Google-Fonts links (artifact CSP; system
font fallbacks apply) → inline, in order, `tokens/base/app/components` CSS + `shell.css`
into one `<style>` → inline `sa-data.js` (+ any other data file the page loads),
`shell.js`, `features/features.js` and the kits it uses (`sa-kit.js`, …) before the page
script → drop `env.js` / `api.js` and the auth guard (the artifact has no backend) → add a
guard that `preventDefault()`s shell nav links (the artifact is one page) → publish titled
"<Feature> — <Story>". A feature with several stories gets one artifact per story plus, on
request, a small index artifact linking them.

## 7. Rules that never bend here

- Story pages are **references built on the design system** — if a story needs something
  the registry doesn't have, that's a component request, not a workaround.
- Product pages stay 1:1 with the dashboard; only a story may change them, and only with
  the New markers (§1).
- The Features accordion lives inside the Design System group: these are review artifacts,
  not product pages — they get docs-mode treatment (ribbon + blueprint canvas).
