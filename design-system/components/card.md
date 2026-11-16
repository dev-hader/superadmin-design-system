---
id: card
name: Card & KPI card
category: Data
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.card, .card--pad, .kpi-ic, .rd-kpis, .rd-tone-0, .rd-tone-1, .rd-tone-2, .rd-tone-3, .animate-in]
source-css: assets/css/app.css
source-demo: components.html
related: [menu, badge, data-table]
---

# Card & KPI card

## Purpose
`.card` is the generic surface container of the product; composed with `.kpi-ic` inside an `.rd-kpis` grid it becomes the KPI glance row at the top of every module page.

## Description
`.card` (app.css) is simply surface background + 1px border + `--radius-lg` + `--shadow-sm`; `.card--pad` adds `--space-6` padding. The shell layer (`assets/shell.css`) adds product-wide behavior: a shadow-only hover lift, and the KPI composition — a 40px icon blob (`.kpi-ic`, organic border-radius that morphs on card hover), four rotating accent tones, a 3px gradient top edge on KPI cards, and a staggered `.animate-in` entrance. `RD.kpiStrip(items)` in `assets/shell.js` renders the whole strip (icon blob + delta badge + value + label per card, tone cycling `i % 4`, 70ms stagger).

## Variants
| Variant | Class | Use when |
|---|---|---|
| Bare surface | `.card` | Any bordered container you'll pad yourself |
| Padded | `.card card--pad` | The default content card |
| KPI card | `.card card--pad` inside `.grid.grid-4.rd-kpis`, with `.kpi-ic` + tone class | Page-top glance metrics |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | `--shadow-sm` |
| Hover | `:hover` | `--shadow-lg` only — **no transform** (see below); `.kpi-ic` blob morphs its radius |

### Why hover is shadow-only
From the shell.css comment: "Cards lift on hover throughout the redesigned product … Shadow-only, deliberately no transform: a hover transform promotes the card to its own stacking context, which then traps any dropdown/menu positioned inside it - the trapped menu loses to any later sibling card regardless of its own z-index. Box-shadow alone still reads as 'lifted' with none of that risk." This is the same hazard [menu.md](menu.md) solves with the portal pattern.

## Properties
| Property | How |
|---|---|
| KPI icon blob | `.kpi-ic` — 40px grid-centered, organic border-radius, primary-subtle by default |
| Tone rotation | `.rd-tone-0` (primary) / `.rd-tone-1` (accent) / `.rd-tone-2` (info) / `.rd-tone-3` (success) on the icon's row — `RD.kpiStrip` cycles them automatically |
| Gradient top edge | `.rd-kpis .card::before` — 3px `linear-gradient(90deg, var(--lime-500), var(--lime-700))` strip |
| Entrance | `.animate-in` + inline `animation-delay` (70ms steps from `kpiStrip`, or `RD.stagger`) |

## Responsive Behaviour
≤ mobile breakpoint (shell.css): `.rd-kpis.grid-4` collapses to two columns (`1fr 1fr`), KPI cards drop to `--space-4` padding and the value type scales down to 1.4rem — "two-up instead of one giant column".

## Accessibility
- Cards are non-interactive containers; if a whole card must be clickable, put a real link/button inside rather than click handlers on the div.
- The gradient edge and tone colors are decorative; the value + label text carry the meaning.
- Entrance animation uses `animation-fill-mode: both`; keep content readable if animations are disabled.

## Dependencies
Tokens: surface, border, radius, shadow, brand (lime/navy), status-subtle groups. JS: `RD.kpiStrip`, `RD.stagger` (assets/shell.js). Embeds [badge.md](badge.md) for the delta chip.

## Related Components
- [menu.md](menu.md) — never trap a dropdown in a card's stacking context; portal it.
- [data-table.md](data-table.md) — `.data-table-wrap` is the table-shaped sibling surface.
- [badge.md](badge.md) — `badge--success` / `badge--danger` deltas in KPI cards.

## Usage Examples
- Finance page: `<div class="grid grid-4 rd-kpis" id="kpiRow">` filled by `RD.kpiStrip(kpis)` (`finance.html`).
- Memberships: three-up plan KPI row (`grid grid-3 rd-kpis`).
- Any padded content block across module pages: `.card card--pad`.

## Do
- Build KPI rows with `RD.kpiStrip` so tones, stagger and markup stay consistent.
- Let the tone classes cycle 0–3; they exist so the glance row "reads with color instead of one repeated navy tint" (shell.js comment).

## Don't
- Don't add `transform` (scale/translate) to card hover — it creates a stacking context that traps nested dropdowns; the shadow-only rule is deliberate.
- Don't hand-pick one tone for every card in a row; the rotation is the design.

## HTML Reference
```html
<!-- Generic padded card -->
<div class="card card--pad">…</div>

<!-- KPI strip container (cards rendered by RD.kpiStrip) -->
<div class="grid grid-4 rd-kpis" id="kpiRow"></div>
<script>
  document.getElementById("kpiRow").innerHTML = RD.kpiStrip([
    { icon: "revenue", value: "SAR 48,200", label: "Revenue this week", delta: "+12%", up: true },
    /* … 3 more; tones .rd-tone-0..3 and 70ms stagger applied automatically */
  ]);
</script>

<!-- Shape of one card kpiStrip emits -->
<div class="card card--pad animate-in" style="animation-delay:70ms">
  <div class="row between rd-tone-1">
    <span class="kpi-ic"><!-- RD.icon("revenue") --></span>
    <span class="badge badge--success">+12%</span>
  </div>
  <div class="t-h2" style="margin:var(--space-3) 0 2px">SAR 48,200</div>
  <div class="t-sm text-tertiary">Revenue this week</div>
</div>
```

## CSS Reference
`assets/css/app.css` → `DOC CONTENT` section, "Generic surface card" (`.card`, `.card--pad`). Shell layer: `assets/shell.css` → "VISUAL REFRESH" (`.kpi-ic` blob, `.rd-tone-0..3`, shadow-only card hover comment, `.rd-kpis .card::before` gradient edge) and the mobile `.rd-kpis` rules.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
