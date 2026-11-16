# HighFive Super Admin Design System — AI Prompt Library

**Version:** 1.0.0 · **Last updated:** 2026-11-16

Copy-paste prompts for every role. Each prompt pins Claude to the design system's closed
world: registry components only, tokens only, interactive HTML references, and the
`NEW COMPONENT REQUIRED` protocol. **Do not freestyle prompts for production work** — ad-hoc
prompting is how invented components and off-system CSS enter the product.

Same library as the Partner system, re-pointed at the Super Admin: its page catalogue,
its sample data, its shared page kits, and the 1:1-with-the-dashboard rule.

---

## 0. Standard context header

Every prompt below starts with this block. It is the minimum context Claude needs, and it
enforces token-optimized loading (index first, entries on demand — never the whole system).

```text
CONTEXT — HighFive Super Admin Design System (read in this order, nothing more):
1. .claude-rules.md                       (operating rules — highest priority)
2. design-system/components/README.md    (component index — what exists)
3. Only the individual registry entries for components this task actually uses.
Foundations, patterns, layouts: load only if the task touches them.
For an existing page, read its row in design-system/docs/product-pages/README.md
(dashboard source + shared kit) before opening the page itself.
Never load or restate the entire design system. Never read the full CSS files to "get a feel".

HARD RULES:
- Reuse existing components by their documented classes and the shared kits
  (SA.* in assets/js/sa-kit.js, CRUD in sa-crud.js, SATR in sa-translation.js).
  NEVER invent components, classes, styles, or tokens. If nothing in the registry fits:
  NEW COMPONENT REQUIRED — <need>: <why the closest existing component fails>
- Existing product pages are 1:1 with HighFive-SuperAdmin-Front. Never add behaviour the
  dashboard doesn't have unless a user story asks for it; never add Partner-only features.
  No backend changes.
- Modern CSS only, via the existing stylesheets. No Bootstrap, no Tailwind, no UI libraries,
  no inline hex/px values — tokens only.
- Every label in English AND Arabic (L(en, ar) / data-ar). Light + dark. RTL-safe.
- Output is a proposal for review, NOT production code, until approval is recorded.
```

---

## 1. Business Analyst — generate a screen proposal

```text
[STANDARD CONTEXT HEADER]

ROLE: You are generating an interactive HTML UI reference for stakeholder review.

USER STORY:
<paste the full story from the template in 01-business-guide.md §2>

TASK:
1. Analyze the story; list the data, actions, and states it requires.
2. Decide the home (rules §4.11): enhancement of an existing page → build inside that page
   with data-new + .badge--new markers and ?whatsnew=<feature-id>; new screen →
   features/<feature-id>/<story-id>.html, registered in features/features.js.
3. Search the component index and select the components, page template and shared kit
   that cover the story. Output the mapping first (requirement → registry id) and flag any
   gap as NEW COMPONENT REQUIRED before writing any HTML.
4. Generate the reference:
   - standard app shell (RD.boot), correct active nav item
   - three genuinely different design variants behind a Design A · B · C switcher
   - realistic sample data from assets/js/sa-data.js (partners, units, packages, users;
     SAR / EGP / AED by country; Arabic + English names)
   - working interactions: pills, search, filter popover, modals, validations, toasts
   - reachable loading / empty / no-results / error states
   - light + dark theme, EN + AR (RTL), mobile behaviour at ≤768px
5. Write COMPONENTS.md beside it listing every registry id used.
6. Do not modify any file outside the story's home.
```

## 2. Business Analyst — request a modification

```text
[STANDARD CONTEXT HEADER]

TARGET: features/<feature-id>/<story-id>.html   (or the named product page)
CHANGE REQUEST (delta only):
- <numbered, specific changes — element, current behaviour, desired behaviour>

RULES:
- Change ONLY what is listed. After editing, confirm explicitly that nothing else changed
  (layout, components used, states, both languages).
- If the target is a product page and the change makes it differ from the live dashboard,
  stop and say so — that is a user story (01-business-guide.md §1), not a modification.
- If a change requires a component that doesn't exist: NEW COMPONENT REQUIRED, stop.
- If a change alters a shared component or shared kit (sa-kit, sa-crud, pp-*, kp-*, us-*)
  rather than this screen's composition, stop and say so — list every page that uses it.
- Save the previous version to features/<feature-id>/revisions/ before writing.
```

## 3. Product Owner / Design Review

```text
[STANDARD CONTEXT HEADER]

ROLE: Design reviewer. Review <reference or page> against the design system.

CHECK, citing file/line or element for every finding:
1. Registry compliance — every class used maps to a registry component; list any that don't.
2. One primary action per view; correct button variant hierarchy.
3. Correct pattern usage: page head + breadcrumb, status pills, toolbar, data table +
   pager, filter popover, modal vs page.
4. States: loading, empty, no-results, error all present and distinguishable.
5. Copy: matches the dashboard's own strings for existing pages; EN + AR both present.
6. Acceptance criteria from the story — pass/fail each.

OUTPUT: verdict (approve / return with changes / reject) + numbered findings, most severe
first. Do not fix anything — findings only.
```

## 4. Developer — implement an approved proposal

```text
[STANDARD CONTEXT HEADER]

INPUT: the approved reference (FROZEN — see APPROVAL.md) + its COMPONENTS.md.

TASK:
1. Implement the screen 1:1 in HighFive-SuperAdmin-Front (<module path>), reusing the
   exact registry components and classes from the reference. The reference is the spec.
2. Load only the registry entries listed in COMPONENTS.md; follow their HTML Reference
   blocks and accessibility sections exactly.
3. Replace sample data with the real endpoints; keep every state, message and both languages.
4. Response-dependent branches (API success/failure toasts) are marked with code comments
   in the reference — wire them with the exact copy given.
5. If anything cannot be implemented as approved (feasibility, perf, edge case):
   STOP and report the deviation for re-approval. Never silently diverge.
6. No new CSS unless the approval explicitly included it; approved CSS is token-only.
```

## 5. Design System Maintenance — post-release sweep

```text
[STANDARD CONTEXT HEADER]

TRIGGER: <release / approved component / Partner-system port / quarterly audit>

TASK — verify and update every feedback target, reporting each as done/no-change:
1. Component Registry: entries match shipped reality (status, version, classes, usage).
2. Pattern Library: new reusable compositions captured as pattern entries.
3. Documentation: business guide, product-pages manifest, page templates still accurate.
4. Version: propose the semver bump with justification (03-governance-workflow.md §6).
5. Changelog: draft the entry (Added/Changed/Deprecated/Removed/Fixed/Security).
6. AI Prompt Library: any prompt that references changed components or process.
7. Governance docs: only if process changed.
8. Partner parity: list component/shell changes that still need porting either way.
9. Permissions: 11-page-permissions.md and NAV_PERM (assets/shell.js) list the same keys.
Also flag: registry entries whose source-css pointers no longer resolve, components with
zero usage across pages (deprecation candidates), and undocumented classes found in the CSS.
```

## 6. Component Creation — request & build

```text
[STANDARD CONTEXT HEADER]

COMPONENT REQUEST:
- Need: <what it does, one sentence>
- Used on: <≥2 screens/stories — name them>
- Closest existing component: <registry id> — fails because: <reason>
- Variants / states / properties expected: <list>

TASK:
1. Triage first: can an existing component or a new VARIANT of one cover this? If yes,
   recommend that instead and stop.
2. If a genuine gap: build a candidate in design-system/proposals/components/<id>/ —
   - demo.html showing all variants/states in light + dark + RTL
   - CSS using ONLY existing tokens, BEM-ish naming consistent with components.css
   - draft registry entry from components/_TEMPLATE.md, status: in-review
3. Do NOT add it to components.css, the index, or any page until approved.
4. List the post-approval updates required (registry, patterns, docs, version, changelog,
   prompts, governance) per 03-governance-workflow.md §5 — and the Partner-system port.
```

## 7. Accessibility Review

```text
[STANDARD CONTEXT HEADER]

TARGET: <reference or page>

AUDIT against the system baseline (foundations/accessibility.md):
1. Keyboard: every interactive element reachable and operable; focus visible
   (:focus-visible + --shadow-focus never suppressed); focus trapped in open modals and
   returned to the trigger on close; filter popovers close on Esc.
2. Semantics/ARIA: real <button>/<a>; aria-label on icon-only controls (row actions,
   translation globe, edit, delete); aria-expanded on popover triggers; aria-current on
   the active nav item; labels associated with inputs; field errors announced.
3. Contrast: text and status colours on their subtle backgrounds in BOTH themes —
   orange text uses --color-primary-ink (#B84300 on light), never the raw primary.
4. Motion: prefers-reduced-motion honoured.
5. Tooltips shown on focus, not hover-only; disabled controls explain why.
6. RTL: logical properties only; directional icons mirrored; avatar initials and
   [translate="no"] text not passed through the Arabic pass.

OUTPUT: findings table (severity: blocker / major / minor, element, fix using existing
system mechanisms). No fixes applied.
```

## 8. Responsive Review

```text
[STANDARD CONTEXT HEADER]

TARGET: <reference or page>

VERIFY at desktop (>1024px), tablet (≤1024px), mobile (≤768px, test at 375px):
1. Sidebar collapses to the drawer; topbar actions stay reachable.
2. Tables: data-label on every non-first cell so the card restyle works; long values wrap
   inside the card (no cell wider than the card).
3. Status pills (.segmented) scroll sideways instead of overflowing.
4. No horizontal page scroll at 375px; touch targets ≥ 40px; modals fit the viewport.
5. Nothing depends on hover alone at touch sizes (row actions, tooltips, popovers).

OUTPUT: findings per breakpoint with the specific element and the existing system mechanism
that should handle it. No fixes applied.
```

## 9. Regression Review — after any modification

```text
[STANDARD CONTEXT HEADER]

INPUT: previous version (revisions/<n>.html) vs current page
CHANGE REQUEST that was authorized: <paste §2 delta list>

TASK:
1. Diff the two artifacts. List EVERY difference (structure, classes, text EN + AR, data, states).
2. Classify each: (a) authorized by the change request, (b) necessary consequence of an
   authorized change — justify, (c) UNAUTHORIZED drift.
3. Any (c) finding = fail: report exactly what must be reverted.
4. If a shared kit changed, list every page that uses it and confirm each still renders.
5. Confirm the components-used list is unchanged, or that COMPONENTS.md was updated to match.

OUTPUT: pass/fail + classified diff table.
```

## 10. Parity check — a product page vs the live dashboard

```text
[STANDARD CONTEXT HEADER]

TARGET: <page>.html  ·  SOURCE: HighFive-SuperAdmin-Front/src/app/pages/<module>/
(the mapping is in design-system/docs/product-pages/README.md)

TASK:
1. List the dashboard's columns, pills, filters, tabs, modals, validations and messages
   for this page, citing the source file for each.
2. Compare with the DS page. Classify each difference: missing in DS · extra in DS
   (not in the dashboard — remove) · copy mismatch · behaviour mismatch.
3. Arabic: confirm every dashboard string has its Arabic twin.

OUTPUT: parity table + verdict (1:1 / gaps). No fixes applied.
```

---

## Maintaining this library

This file is one of the seven post-approval update targets. When a component, pattern, kit
or process changes, re-check every prompt that names it (grep by registry id or kit name).
Prompt changes are `Changed` entries in the changelog and a PATCH bump unless they alter
the workflow itself.
