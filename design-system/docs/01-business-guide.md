# HighFive Super Admin Design System — Business Analyst Guide

**Audience:** Business Analysts and Product Owners
**Version:** 1.0.0 · **Last updated:** 2026-11-16

This guide explains how to turn a Super Admin business need into an approved,
implementable UI proposal using this design system and Claude. You never write code. You
write clear user stories, generate proposals with AI, and route them through the approval
workflow.

---

## 1. The two rules that make everything work

> **1. Every screen is assembled from existing, approved components. Nothing is invented per-screen.**

The design system already contains buttons, forms, tables, modals, filter popovers, the
app shell, and full page templates. Your job is to describe *what the business needs*;
the AI's job is to compose it *from what already exists*. If something genuinely doesn't
exist, the AI outputs **`NEW COMPONENT REQUIRED`** — that triggers a separate approval
flow (§6) instead of an improvised design.

> **2. Product pages are 1:1 with the live dashboard (`HighFive-SuperAdmin-Front`).**

The 59 pages in this repo are a *look-only* redesign of the real Super Admin: same
columns, filters, tabs, modals, validations and messages — only the visual layer is new.
They carry **no Partner-only features and need no backend change**. A request to add or
change behaviour on an existing page is therefore a **user story** (§2), never a silent
edit; it lands as a marked enhancement inside that page (§3, enhancement path).

---

## 2. How to write a User Story

Use this template. Every field matters — vague stories produce vague screens.

```markdown
## User Story: <short title>

**As a** <role: Super Admin / Operations admin / Finance admin / Support admin / Marketing admin …>
**I want** <capability>
**So that** <business outcome>

### Context
- Module: <Dashboard | Partners | Partners Lists and Services | Units | Packages | Users |
  Public Events | Bookings | Multi-Booking Sessions | All Comments | Employees | Financials |
  Wallet | Activities | Subscriptions | Setup Files | Locations | Marketing | Notifications |
  Pages Content | Settings | Activities Contacts | Design System>
- Trigger: <how the admin arrives at this screen>
- Frequency: <daily / weekly / occasional>
- Permission: <which page key / permission group sees it — see 11-page-permissions.md>

### Data on screen
- <every piece of information the admin must see, with realistic examples>
- <e.g. "Partner company name (Smash Padel Club), owner, country, units count, approval status">

### Actions the user can take
- Primary action: <exactly one>
- Secondary actions: <list>
- Destructive actions: <list — these get confirm dialogs>

### States to design
- Loading, empty ("There is no data to display"), no-results (after filtering), error
- <any domain states: pending approval, not approved, inactive, blocked …>

### Acceptance criteria
- [ ] Given <context>, when <action>, then <result>
- [ ] …

### Out of scope
- <explicitly excluded, to prevent scope creep>
```

**Quality checklist (INVEST):** Independent · Negotiable · Valuable · Estimable · Small · Testable.
If your story needs more than one screen, split it.

**Good:** "As an Operations admin I want to filter packages by approval status and see
how long each has been pending, so that no package waits more than 48h for review." —
one screen, clear data, clear action.
**Bad:** "As an admin I want a better packages page." — no role, no data, no outcome, not testable.

---

## 3. How to request a new screen (or an enhancement)

1. Write the User Story (§2).
2. Decide where it lives (`.claude-rules.md` §4.11):
   - **Enhancement of an existing page** (a new column on `bookings.html`, a filter on
     `packages.html`) → built **inside that page**; every new element is green-tinted and
     labelled **New** (`data-new` + `.badge--new`). Review it with
     `<page>.html?whatsnew=<feature-id>`.
   - **Genuinely new screen** → a UI reference under `features/<feature-id>/`, listed in
     the sidebar's **Features** accordion ([`07-features-workflow.md`](07-features-workflow.md)).
3. Open Claude in this repository and use the **Screen Proposal prompt** from
   [`04-ai-prompts.md`](04-ai-prompts.md) §1, pasting your story into it.
4. Claude will:
   - search the component registry ([`../components/README.md`](../components/README.md)),
   - reuse existing components, the shared page kits and the page templates,
   - produce **one interactive HTML reference** (three design variants, A · B · C),
   - list every component it used in `COMPONENTS.md`, and flag `NEW COMPONENT REQUIRED` for gaps.
5. Open the page. It is clickable: pills filter, modals open, validations fire.
6. Review against your acceptance criteria, then submit for stakeholder review (§7).

**What you should expect in every proposal:**
- The standard app shell (sidebar + topbar), light and dark theme, English + Arabic (RTL).
- Realistic sample data shaped like the dashboard's API — partners, packages and users
  from `assets/js/sa-data.js`, amounts in SAR / EGP / AED by country.
- All four baseline states (loading / empty / no-results / error) reachable or shown.
- A `COMPONENTS.md` listing registry IDs — this is what reviewers approve.

---

## 4. How to generate UI proposals (working with Claude)

- **Always start from the prompt library** ([`04-ai-prompts.md`](04-ai-prompts.md)). The prompts
  pin Claude to the registry and the AI rules; free-form prompting is how inventions sneak in.
- **One story per proposal.** Batch requests produce shallow screens.
- **Give real data examples.** "Show revenue" produces a placeholder; "Show Saudi Arabia
  online revenue SAR 101,010 vs cash SAR 28,305" produces a reviewable screen.
- **Name the dashboard behaviour you are changing.** "Today the Units list has no
  country filter" is clearer than "add filters".
- **Iterate in the same conversation.** Claude keeps the context of what it already built.
- **Never accept invented components.** If a proposal contains a control you can't find in
  the registry index, reject it and ask Claude to either reuse an existing component or
  declare `NEW COMPONENT REQUIRED`.

---

## 5. How to request modifications

For changes to an existing (approved or proposed) screen:

1. Reference the page by file name and the specific element
   ("the status pills on `packages.html`", "the Add modal on `setup-languages.html`").
2. State the change as a delta, not a re-description of the whole screen.
3. Use the **Modification prompt** ([`04-ai-prompts.md`](04-ai-prompts.md) §2).
4. Claude must change **only** what you named and confirm nothing else moved
   (the regression review prompt exists for exactly this).

Modification requests that change a *component's* look or behaviour (not just a screen's
composition) are component changes — route them through §6 instead. A change that makes a
page differ from the live dashboard is a story, not a modification (§1, rule 2).

---

## 6. How to request a new component

When a proposal comes back with `NEW COMPONENT REQUIRED`, or you know upfront that nothing
in the registry fits:

1. Check the registry index first — most "new" needs are a variant of an existing component
   (a new badge tone is not a new component).
2. Fill in the **Component Request** using the prompt in [`04-ai-prompts.md`](04-ai-prompts.md) §6:
   purpose, where it will be used (≥2 screens is the bar — single-use pieces are patterns,
   not components), variants, states, and the closest existing component with the reason it fails.
3. The Design System Maintainer reviews for overlap and either:
   - maps it to an existing component/variant, or
   - approves a candidate build → Claude generates it token-only, with a registry entry draft.
4. After approval it enters the registry, the changelog, and the version bump
   (flow: [`03-governance-workflow.md`](03-governance-workflow.md) §5; versioning rules: §6).
5. **Port it to the Partner system too** — the two systems share `components.css` /
   `shell.js` lineage (`.claude-rules.md` §0, upstream rule).

**A component is never used in a production proposal while status = proposed/in-review.**

---

## 7. Approval workflow (summary)

Full detail with roles and diagrams: [`03-governance-workflow.md`](03-governance-workflow.md).

```
User Story → AI Proposal (interactive HTML) → Stakeholder Review → Approval
          → Developer Implementation → Production → Design System Update → Version Increment
```

Your responsibilities as BA:
- The story is complete before AI generation (no "we'll clarify later").
- The proposal honestly reflects the story before it goes to review.
- Review feedback is turned into modification requests (§5), not verbal notes.
- Nothing goes to developers without recorded Product Owner approval.

---

## 8. Best practices

- **Reuse the page templates first.** Sign in, forgot password + code, list page,
  profile with tabs, setup list + modal, per-currency summary, empty state and 404/500 are
  live in `templates.html` ([`../layouts/page-templates.md`](../layouts/page-templates.md)).
  Almost every Super Admin screen is one of these + data.
- **Reuse the shared page kits.** List pages run on `SA.list` (`assets/js/sa-kit.js`),
  setup lists on the CRUD engine (`assets/js/sa-crud.js`), translations on
  `assets/js/sa-translation.js`. A new setup list is a config object, not a new page design.
- **Name components by registry ID** in stories and feedback ("use `status-badge`, not a
  coloured label"). It removes ambiguity and speeds up generation.
- **Design the unhappy path.** Empty, error and permission-denied states are where support
  tickets come from; the registry has distinct patterns for each.
- **Respect the one-primary-button rule.** If your story has three "primary" actions, the
  story is really three stories.
- **Think mobile from the start.** Below 768px tables become cards and pills scroll
  sideways. Say what the mobile priority is in the story.
- **Keep both languages in mind.** Every label needs its Arabic twin; sample data should
  include Arabic-script names (the dashboard has them: "نادي الفرسان للياقة").
- **Mind permissions.** A new page needs a page key in
  [`11-page-permissions.md`](11-page-permissions.md) and `NAV_PERM` (`assets/shell.js`).

---

## 9. Worked examples

### Example A — enhancement inside an existing page (accepted flow)

> **Story:** As an Operations admin I want to see how many days each package has been
> waiting for approval on the Packages list, so that none waits more than 48h.

Built inside `packages.html` (it already exists): a "Waiting" column, green-tinted and
labelled **New**, reviewed via `packages.html?whatsnew=packages-waiting-days`. Reused:
`data-table`, `status-badge` (`--pending`), `segmented-control` (approval pills),
`popover` filter. **Zero new components.** Approved in one review cycle.

### Example B — `NEW COMPONENT REQUIRED` (correct behaviour)

> **Story:** …show every partner on a map of the Kingdom, coloured by approval status…

Proposal returned: `NEW COMPONENT REQUIRED — map-view: no geographic visualization exists
in the registry (the location tab only has a single-pin picker). Closest match: none.
Recommend component request.` The BA filed a component request instead of accepting an
improvised map. Correct outcome — the alternative was an unreviewed one-off.

---

## 10. Where things live

| Need | File |
|---|---|
| Component index | [`../components/README.md`](../components/README.md) |
| Registry field definitions | [`02-component-registry.md`](02-component-registry.md) |
| Governance & roles | [`03-governance-workflow.md`](03-governance-workflow.md) |
| Copy-paste AI prompts | [`04-ai-prompts.md`](04-ai-prompts.md) |
| Change history & versions | [`05-CHANGELOG.md`](05-CHANGELOG.md) |
| Build-out phases | [`06-roadmap.md`](06-roadmap.md) |
| New features (Features accordion) | [`07-features-workflow.md`](07-features-workflow.md) |
| Page permission keys | [`11-page-permissions.md`](11-page-permissions.md) |
| Each product page → dashboard source | [`product-pages/README.md`](product-pages/README.md) |
| Tokens, type, color, motion | [`../foundations/README.md`](../foundations/README.md) |
| Page patterns | [`../patterns/README.md`](../patterns/README.md) |
| Shell & page templates | [`../layouts/README.md`](../layouts/README.md) |
| AI operating rules | [`../../.claude-rules.md`](../../.claude-rules.md) |
