# Foundations — Design Tokens

**Source of truth:** `assets/css/tokens.css` — never duplicate values into components or docs.
**Architecture:** 3 tiers — **Primitives → Semantic → Component**.

> **Brand identity (locked, `.claude-rules.md` §9):** light-first, **Super Admin orange
> `#FC6404`** (= `--lime-500`) with white text on primary, the dashboard's blue-grey
> neutrals (`--gray-100…900`, canvas `#FCFCFC`, text `#071437`) and `#131313` / `#1C1C1C`
> dark chrome. Fonts: Inter (EN) + Tajawal (AR). Everything below the identity layer —
> spacing, radius, motion, z-index, status and chart roles — is inherited from the Partner
> system unchanged. The `--lime-*` names are historical; the values are orange.

> **Never hardcode values in components. Reference tokens only.** Components consume **Tier 2
> (semantic)** tokens; Tier 1 primitives are raw material and are not used directly in UI.

## Tier 1 — Primitives

| Group | Tokens | Notes |
|---|---|---|
| Brand green (**primary**) | `--lime-50` … `--lime-950` | anchored to the locked brand value `#B6EC1D` "Green Lizard" (= `--lime-500`); scale keeps its historical `--lime-*` names |
| Brand navy (secondary / accent) | `--navy-50` … `--navy-950` | 11-step scale |
| Brand secondary accents | `--brand-ufo-green` `#29E766`, `--brand-cadmium-orange` `#E3882D`, `--brand-peridot` `#E2E800`, `--brand-button-blue` `#2DA8E3` | client deck's "Secondary Color" set — illustrative/accent use only, not a replacement for the semantic status hues below |
| Brand ink | `--brand-rich-black` `#020607` | the client identity's primary ink, paired with Green Lizard for the highest-contrast lockup |
| Ink (brand near-black) | `--ink-canvas/-surface/-raised/-border/-border-soft/-text/-muted` | the locked dark-theme surfaces & text |
| Neutrals | `--slate-0` … `--slate-950` | |
| Semantic hues | `--green-*`, `--amber-*`, `--red-*`, `--salmon-400`, `--sky-*`, `--violet-*`, `--teal-*`, `--pink-500`, `--orange-500` | feed status & chart roles; `--salmon-400` is the locked dark-theme danger `#FF6B5B` |

## Spacing — 8pt grid with 4px half-steps

`--space-0..24`: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px.
Use tokens for every margin/padding/gap. No raw px in component CSS.

## Radius, borders

`--radius-xs (4)`, `-sm (8)`, `-md (12)`, `-lg (16)`, `-xl (20)`, `-2xl (24)`, `-3xl (32)`, `-full`.
Borders: `--border-thin (1px)`, `--border-base (1.5px)`, `--border-thick (2px)`.

## Typography

- Families: `--font-sans` (Poppins, body EN) · `--font-display` (Poppins, headings EN) ·
  `--font-ar-body` (Tajawal) · `--font-ar-display` (Tajawal) ·
  `--font-mono` (JetBrains Mono). `html[lang="ar"]` remaps `--font-display` and the body
  family to Tajawal automatically (see `assets/css/base.css`). Per the client deck: Headline =
  Bold, Sub-headline = Medium, Body = Regular — both languages.
- Scale: `--text-display (56)`, `--text-h1 (40)`, `--text-h2 (32)`, `--text-h3 (24)`,
  `--text-title (20)`, `--text-lg (18)`, `--text-body (16)`, `--text-sm (14)`,
  `--text-caption (13)`, `--text-xs (12)`.
- Weights `--weight-regular/medium/semibold/bold`; leading `--leading-tight/snug/normal/relaxed`;
  tracking `--tracking-tight … --tracking-caps`.
- Utility classes (`.t-sm`, `.t-xs`, `.t-title`, `.t-h2`, `.text-secondary`, `.text-tertiary`)
  exist in the base/app stylesheets — use them instead of new CSS.

## Motion

- Easings: `--ease-standard`, `--ease-out`, `--ease-in`, `--ease-spring`.
- Durations: `--duration-instant (80ms)`, `-fast (140ms)`, `-base (220ms)`, `-slow (360ms)`.
- **Every animation must respect `prefers-reduced-motion`** — the system's chart draw-ins,
  pulses and entrances already do; new animation that doesn't will fail review.

## Z-index scale

`--z-base (1)`, `--z-sticky (100)`, `--z-drawer (900)`, `--z-modal (1000)`,
`--z-popover (1100)`, `--z-toast (1200)`. Never invent intermediate values; if two things
fight, the layering model is wrong (see the menu portal pattern in `../components/menu.md`).

## Layout constants

`--sidebar-width: 288px`, `--topbar-height: 64px`, `--container-max: 1120px`.

## Tier 2 — Semantic roles (what components actually use)

| Role group | Key tokens |
|---|---|
| Brand | `--color-primary(-hover/-pressed/-subtle/-subtle-hover)` (green **fill**), `--color-on-primary` (near-black, per §9), `--color-primary-ink` (readable green for text/icons — deep green `--lime-800` in light, `--lime-400` in dark), `--color-accent(-hover/-subtle)` (navy), `--color-on-accent` |
| Selection | `--color-selection-bg/-fg` — green-on-black selection per §9 (black bg + green text in light; green bg + black text in dark) |
| Status | `--color-success/warning/danger/info` + `-subtle` + `-border` each |
| Surfaces | `--color-canvas` (app bg), `--color-surface` (cards), `--color-surface-raised/-sunken/-hover`, `--color-overlay` |
| Sidebar chrome | `--sidebar-bg/glow/border/divider/text/text-strong/muted/hover/active/ic-*/badge-*/user-*` — theme-aware set |
| Text | `--color-text`, `-secondary`, `-tertiary`, `-disabled`, `-inverse`, `-link` |
| Borders & focus | `--color-border(-strong/-subtle)`, `--color-divider`, `--color-focus-ring`, `--shadow-focus` |
| Elevation | `--shadow-xs … --shadow-xl`, `--shadow-glass`, `--glass-bg`, `--glass-blur` |
| State opacities | `--opacity-disabled (0.45)`, `--opacity-hover`, `--opacity-pressed`, `--opacity-backdrop` |

## Domain palettes

- **Charts (categorical, use in order):** `--chart-1 … --chart-8`
  (navy, lime, sky, violet, amber, teal, pink, orange) + `--chart-grid`, `--chart-axis`.
- **Booking status (8 states):** `--status-<state>-fg/-bg/-dot` for
  `pending, confirmed, checkedin, checkedout, completed, cancelled, refunded, waitlist`.
  Consumed by the [status badge](../components/status-badge.md) — never restyle statuses ad hoc.
- **Availability:** `--avail-free/-partial/-booked/-blocked` (scheduler & calendar).

## Dark theme — the locked brand identity

Dark is a **remap, not an inversion** — and it is the §9 locked palette verbatim:
`:root[data-theme="dark"]` (and `.theme-dark` for scoped previews) maps surfaces onto the
ink scale (canvas `#0A0B0A`, surface `#131413`, raised `#191B19`, borders `#262925`/`#1D201D`),
text to `#F1F4F1`/`#9AA396`, primary to Green Lizard `#B6EC1D` with the §9 alpha soft/mid subtles,
danger to `#FF6B5B` (`--salmon-400`), and status palettes to `-300` foregrounds on alpha
backgrounds. **Components that only use semantic tokens get dark mode for free.**
Theme choice persists in `localStorage("rd-theme")` and is applied pre-paint by the inline
script at the top of every page.

## Rules

1. Components reference Tier 2 only. Tier 1 appears only inside `tokens.css` (and the two
   documented shell gradients).
2. New tokens require the governance flow (MINOR bump); renames/removals are MAJOR.
3. A raw hex, px, ms, or z-index in component CSS is an automatic review failure.
