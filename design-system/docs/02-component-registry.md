# HighFive Design System — Component Registry

**Version:** 1.0.0 · **Last updated:** 2026-07-17
**Index of all components:** [`../components/README.md`](../components/README.md)
**Entry template:** [`../components/_TEMPLATE.md`](../components/_TEMPLATE.md)

The registry is the contract between Business Analysts, the AI, reviewers, and developers.
If a component is not in the registry, it does not exist — proposals may not use it, and the
AI must output `NEW COMPONENT REQUIRED` instead of improvising.

---

## 1. Registry architecture

- **One file per component** in [`../components/`](../components/), named by its stable `id`
  (e.g. `button.md`, `data-table.md`).
- **Machine-readable frontmatter + human sections.** The YAML frontmatter lets AI locate and
  filter components without loading full entries (token optimization); the body carries the
  guidance humans and AI read once a component is actually being used.
- **Styles are never duplicated into the registry.** Every entry points at the single source:
  `assets/css/components.css` (core), `assets/shell.css` (shell), or a demo page for
  page-level composites. Copying CSS into docs is how systems drift.

## 2. Entry schema — field definitions

Every entry contains all of the following, in this order:

| Field | Definition | Rules |
|---|---|---|
| **Name** | Human display name | Singular ("Button", not "Buttons") |
| **Purpose** | One sentence: the job it does | If you need two sentences, it's two components |
| **Description** | How it behaves, its anatomy, where it appears | 2–4 sentences, no marketing language |
| **Variants** | Visual/semantic alternatives | Table: variant, exact class, "use when". Only variants that exist in CSS |
| **States** | Interaction & lifecycle states | Table: state, trigger, appearance. Include disabled/loading/error where they exist |
| **Properties** | Configurable aspects | Size, icon slots, width, counts — each mapped to a class or attribute |
| **Responsive Behaviour** | What changes at 1024px / 768px | Cite the actual media query behaviour; "no change" is a valid, explicit answer |
| **Accessibility** | Roles, ARIA, keyboard, focus, contrast | Must be actionable ("`aria-label` required on icon-only"), not aspirational |
| **Dependencies** | Token groups, JS helpers, embedded components | e.g. `RD.portalMenu` for menus |
| **Related Components** | Alternatives and companions | With one line on when to choose each instead |
| **Usage Examples** | Real product situations | From the live demo pages, not invented |
| **Do** | 3–5 rules that make usage correct | Imperative voice |
| **Don't** | 3–5 known misuses | Each one should prevent a real mistake |
| **HTML Reference** | Copy-paste-ready markup | Existing classes only; this is what proposals copy |
| **CSS Reference** | Pointer to the source section | Section banner name in the stylesheet — never inline CSS |
| **Version** | Per-component semver + change table | Independent of the system version |
| **Owner** | Accountable maintainer | Name/role + contact |

### Frontmatter (AI-first metadata)

```yaml
---
id: data-table            # stable, kebab-case, never renamed
name: Data Table
category: Forms | Identity | Navigation | Overlays | Feedback | Data | Booking | Layout
status: proposed | in-review | approved | stable | deprecated
version: 1.2.0
owner: Design System Maintainer
css-classes: [.data-table, .data-table-wrap]   # exact selectors, for search
source-css: assets/css/components.css
source-demo: components.html
related: [pagination, menu, status-badge]
---
```

## 3. Component lifecycle

```
proposed ──► in-review ──► approved ──► stable ──► deprecated ──► (removed at next MAJOR)
   │             │             │
   └── rejected ◄┘             └── returned for changes
```

| Status | Meaning | Usable in proposals? |
|---|---|---|
| `proposed` | Request filed, entry drafted | No |
| `in-review` | Candidate build exists, under stakeholder review | Only inside its own review proposal |
| `approved` | Signed off, not yet shipped in production | Yes, flagged as "pending release" |
| `stable` | In production, safe default | Yes |
| `deprecated` | Replacement exists; entry names it | No new usage; migration note required |

## 4. Naming conventions

- **Component ids:** kebab-case nouns (`status-badge`, `time-slots`).
- **CSS classes:** existing BEM-ish convention — block (`.btn`), element (`.modal__head`),
  modifier (`.btn--danger`), state (`.is-active`, `.is-loading`, `.is-error`).
- **New classes** (approved components only) must follow the same convention and reference
  **tokens only** — a raw hex value or px spacing in component CSS fails review.

## 5. Worked example

See [`../components/button.md`](../components/button.md) — the canonical entry. Every other
entry follows its structure exactly.

## 6. Maintenance rules

1. **Registry changes ride the governance flow.** No direct edits to `stable` entries except
   typo/clarity fixes (patch bump, changelog line).
2. **Every approved proposal that used a component in a new way** should feed back a Usage
   Example or a Do/Don't line — the registry is a living record of decisions.
3. **Deprecation requires:** replacement id, migration note in the entry, `Deprecated` line in
   the changelog, and a MINOR version bump; removal happens only at the next MAJOR.
4. **The index (`../components/README.md`) and this document must never disagree.** The index
   is the source of truth for what exists; update both in the same change.
5. **Audit cadence:** quarterly sweep by the Design System Maintainer — statuses, owners,
   and source pointers verified against the stylesheets (use the Maintenance prompt,
   [`04-ai-prompts.md`](04-ai-prompts.md) §5).
