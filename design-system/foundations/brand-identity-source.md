# Brand Identity — Source Record (Super Admin)

Where every identity value in this system came from, so nobody has to rediscover it.

**Unlike the Partner system**, the Super Admin identity does **not** come from a client
brand deck (`base_id/`). The owner directive (2026-11-15) was to **keep the dashboard's own
look**: the values below were read straight from the live dashboard,
`HighFive-SuperAdmin-Front`. The locked table lives in `.claude-rules.md` §9; this file
records the evidence.

---

## 1. Sources in the dashboard

| Value | Where it is in `HighFive-SuperAdmin-Front` |
|---|---|
| Primary orange `#FC6404` | `src/_metronic/assets/sass/custom.css` — `:root { --bs-primary: #fc6404 }` |
| Primary light `#FFFBF8` | same file — `--bs-primary-light` |
| Blue-grey neutrals (text `#071437`, `#4B5675`, `#78829D`; borders `#DBDFE9`, `#E4E6EF`) | Metronic gray scale, `src/_metronic/assets/sass/core/components/_variables.scss` |
| Dark surfaces | the dashboard's dark mode (`_variables-dark.scss`), mapped to `#131313` canvas / `#1C1C1C` surface |
| **Inter** (English) | `public/index.html` — Google Fonts `Inter:300,400,500,600,700` |
| **Tajawal** (Arabic) | `custom.css` — `@import … Tajawal` and `.app-default.rtl { font-family: 'Tajawal' }` |
| Logo | the same five-finger HighFive mark as the Partner system |

## 2. How it maps into the tokens

| Role | Token | Value |
|---|---|---|
| Primary | `--lime-500` | `#FC6404` |
| Primary hover / pressed | `--lime-600` / `--lime-700` | `#E05400` / `#B84300` |
| Primary as text on light | `--color-primary-ink` → `--lime-700` | `#B84300` (AA on white) |
| Text on primary | `--color-on-primary` | `#FFFFFF` |

The scale keeps the Partner system's historical `--lime-*` **names** so `components.css`
works unchanged — only the **values** are orange (`assets/css/tokens.css`, Tier-1 only).
Status colours keep the shared semantic palette, so a status reads the same in both
systems.

## 3. What was deliberately not taken from the dashboard

- Metronic's default status colours (`success`/`warning`/`danger`) — replaced by the DS's
  accessible semantic palette.
- `$app-main-color` `#FF6600` — a second, older orange used in a few places; the DS uses
  the single `--bs-primary` value.
- Bootstrap/Metronic components and classes — the DS has its own registry (closed world).

## 4. Where this lives in the implementation

| What | File |
|---|---|
| Tier-1 tokens (the orange scale, neutrals, dark ink) | `assets/css/tokens.css` |
| Governance record (locked values) | `.claude-rules.md` §9 |
| Token architecture writeup | `design-system/foundations/design-tokens.md` |
| Logo mark | `assets/img/logo-mark.svg`, `RD.logoMark` in `assets/shell.js` |
| Favicon (orange gradient on `#131313`) | `<link rel="icon">` in every page head |
