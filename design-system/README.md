# HighFive Super Admin Design System

**The single source of truth for all HighFive Super Admin Dashboard UI.**
Forked from the Partner Web Design System — the identity (orange, Inter/Tajawal) and the
page catalogue differ; components, patterns and governance are shared.
Version **1.0.0** · maintained per [`docs/03-governance-workflow.md`](docs/03-governance-workflow.md)

Every future screen is assembled from the components, patterns, and layouts documented
here. Business Analysts generate proposals with Claude; stakeholders approve the interactive
HTML; developers implement 1:1. Nothing is invented per-screen.

## Repository map

```
/design-system
├── README.md                ← you are here — start point for humans and AI
├── foundations/             ← tokens, iconography, accessibility baseline
├── components/              ← the registry: one entry per component (+ index in README.md)
├── patterns/                ← approved compositions (module page, toolbar, status system…)
├── layouts/                 ← app shell, page templates, grid & breakpoints
└── docs/
    ├── 01-business-guide.md      ← how a BA turns a need into an approved screen
    ├── 02-component-registry.md  ← registry schema & rules
    ├── 03-governance-workflow.md ← roles, pipeline, versioning
    ├── 04-ai-prompts.md          ← copy-paste prompts for every role
    ├── 05-CHANGELOG.md           ← semver history
    ├── 06-roadmap.md             ← phased build-out — what ships next
    ├── 07-features-workflow.md   ← where a user story lands (page vs Features accordion)
    ├── 08-state-coverage-matrix.md
    ├── 09-content-microcopy-guide.md
    ├── 10-session-handoff.md     ← how the pages are built + gotchas
    ├── 11-page-permissions.md    ← the 24 page keys the backend must hold
    └── product-pages/README.md   ← each page → its dashboard source + shared kit

Implementation (referenced, never duplicated):
assets/css/{tokens,base,app,components}.css   ← the styles (core)
assets/shell.{css,js}                            ← app shell, RD.* helpers
components.html · templates.html                 ← live interactive reference
*.html (partners, packages, users, …)            ← the 59 Super Admin pages (1:1 with the dashboard)
assets/js/sa-*.js, pp/ up/ kp/ us/               ← sample data + shared page kits
.claude-rules.md (repo root)                     ← AI operating rules, highest priority
```

## For each audience

- **Business Analyst / Product Owner** → [`docs/01-business-guide.md`](docs/01-business-guide.md),
  then the prompts in [`docs/04-ai-prompts.md`](docs/04-ai-prompts.md).
- **Developer** → the frozen proposal + the registry entries it lists; implementation prompt
  in [`docs/04-ai-prompts.md`](docs/04-ai-prompts.md) §4.
- **Design System Maintainer** → [`docs/02-component-registry.md`](docs/02-component-registry.md),
  [`docs/03-governance-workflow.md`](docs/03-governance-workflow.md), maintenance prompt §5.
- **Picking the work back up on another machine** →
  [`docs/10-session-handoff.md`](docs/10-session-handoff.md): what lives outside git,
  how the pages and shared kits are built, Arabic rules, and the gotchas that cost
  real time. Written down here because AI session transcripts
  never leave the machine that produced them.

## For AI (token-optimized loading order)

1. `.claude-rules.md` (repo root) — operating rules, highest priority.
2. [`components/README.md`](components/README.md) — the index of what exists.
3. **Only** the registry entries, pattern, or layout files the current task touches.

Never load the whole system or read full stylesheets to "get a feel". The frontmatter in
each registry entry (`css-classes`, `status`, `related`) exists so you can decide relevance
without opening the body.

## Non-negotiables

- Reuse existing components; a missing component yields **`NEW COMPONENT REQUIRED`**, never
  an invention.
- Modern CSS via the existing stylesheets only — no Bootstrap, no Tailwind, no UI libraries.
- Tokens only; raw values fail review ([`foundations/design-tokens.md`](foundations/design-tokens.md)).
- Proposals are interactive HTML for review; production code only after recorded approval.
- Light + dark, RTL, reduced-motion, and mobile app mode are baseline, not extras.
