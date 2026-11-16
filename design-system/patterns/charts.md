# Pattern — Charts Specification

**Status:** approved · v2.0 (2026-07-20, replaces the 1.5 KB presentation note)
Charts are hand-built SVG (no chart libraries — system policy) styled by chart tokens,
animated by the shell's draw-in classes, and completed by the chart primitives in
`components.css` ([chart-primitives.md](../components/chart-primitives.md)).
References: `dashboard.html`, `finance.html`, `reports.html`.

## 1. Anatomy

Every chart lives inside a `card` with this structure — no exceptions:

```
.card.card--pad
├── header row    — title (.t-sm semibold) + optional period select / segmented
├── value row     — headline value + delta badge (optional, KPI-style charts)
├── canvas        — the <svg> (viewBox, width 100%, fixed height per size)
├── .chart-legend — when the chart has ≥ 2 series
└── footnote      — .t-xs.text-tertiary (optional: data caveat, "vs last period")
```

Canvas heights: **sm 120px** (inline/KPI), **md 200px** (dashboard grid), **lg 280px**
(reports/finance full-width). Pick from these three only.

## 2. Color & series

- Categorical series take `--chart-1 … --chart-8` **in order** — never skip around the
  palette, never reuse status colors for series.
- Single-series charts use `--chart-2` (brand green) with `--color-primary-subtle` area fill.
- Grid lines `--chart-grid` (1px, horizontal only by default); axis text `--chart-axis`.
- Color is never the only encoding — every series is also named in the legend, a value
  label, or an axis.

## 3. Axes

| Rule | Value |
|---|---|
| Y-axis ticks | 3–5 gridlines, round numbers (0 / 25K / 50K — never 0 / 23.4K / 46.8K) |
| Y-axis labels | `--text-xs`, `--chart-axis`, end-aligned to the plot's inline-start |
| X-axis labels | `--text-xs`; thin out to every 2nd/3rd label before ever rotating; rotation is forbidden |
| Axis lines | no hard axis strokes — the gridlines and baseline are enough |
| Baseline | bars and areas always start at 0; truncated baselines are forbidden (honesty rule) |

## 4. RTL direction

- **Time axes keep LTR order in both directions** (Jan → Dec left-to-right): give the SVG
  wrapper `dir="ltr"`. Reversing time confuses more than it localizes — the industry
  convention Fresha/Google follow.
- Everything HTML around the canvas (title, value, legend, tooltip, footnote) follows the
  document direction automatically — built from logical properties.
- **Horizontal bars are the exception**: category rows read like text, so they mirror.
  `.rd-chart-hbar` already grows from the logical start edge.
- Y-axis value labels stay on the inline-start side of the card in both directions.

## 5. Number & label formatting

| Context | Format |
|---|---|
| SAR in overview charts | `SAR 48,200` — no decimals |
| SAR in tooltips | `SAR 48,231.50` — exact when the user asks by hovering |
| Axis ticks (large) | compact: `48K`, `1.2M` |
| Percentages | one decimal max: `12.4%` |
| Digits policy | **Latin digits (0-9) in both languages** — GCC financial convention; Arabic-Indic digits are never used in charts |
| Arabic mode | month/day labels translate (يناير…); `SAR` stays `SAR` (ISO habit), currency word in surrounding copy is «ر.س» |
| Dates | `12 Jul` axis · `Saturday, 12 July 2026` tooltip title |

## 6. Legend (`.chart-legend`)

- Required at ≥ 2 series; placed under the canvas (block-end), wrapping.
- Item = `.chart-legend__swatch` (9px dot, inline `background` set to the series token) + label.
- Interactive toggle (optional, page-level JS): items get `aria-pressed`; `"false"` dims
  the item and the page hides that series. Never toggle below one visible series.

## 7. Tooltip (`.chart-tip`)

- One tooltip element per chart, absolutely positioned inside the canvas wrapper
  (`position: relative` on the wrapper), shown via `.is-visible`.
- Structure: `.chart-tip__title` (the x value — full date), then one `.chart-tip__row`
  per series: swatch + name + `.chart-tip__val` (tabular numerals).
- Positioning: follow the hovered point, clamped inside the canvas; flip to the other
  side when within 120px of the inline-end edge.
- Touch: tap = show for that point, tap elsewhere = hide. Hover-only data is forbidden —
  whatever the tooltip reveals must also exist as a value label, the legend, or the
  linked data table.

## 8. States

| State | Recipe |
|---|---|
| Loading | `.skeleton` block at the exact canvas height — never a spinner inside a card grid |
| Empty (no data yet) | canvas area shows kpi-ic + "No data for this period yet." + the action that creates data |
| No results (filtered) | same layout, copy "Nothing matches these filters." + Clear filters button |
| Error | `.alert.alert--danger` in place of the canvas + Retry button — never an empty white box |
| Partial period | dashed stroke for the incomplete bucket (current month) + footnote "Month to date" |

## 9. Animation

Shell draw-in classes (`assets/shell.css`), all disabled under `prefers-reduced-motion`:

| Class | Effect | Use on |
|---|---|---|
| `.rd-chart-line` | stroke draw-in | line paths |
| `.rd-chart-area` | delayed fade | area fills |
| `.rd-chart-bar` | grow from bottom | vertical bars |
| `.rd-chart-hbar` | grow from start edge (RTL-aware) | horizontal bars |
| `.rd-chart-dot` | fade in | data points |
| `.rd-chart-pop` | scale-pop | highlights, donut segments |

Stagger bars with inline `animation-delay` steps (40–60ms). Animations run once on
entry — never on data refresh (refresh swaps values in place).

## 10. Accessibility

- The `<svg>` takes `role="img"` + `aria-label` that states the takeaway, not the type:
  `"Revenue grew from SAR 32K in January to SAR 48K in June"` — not `"line chart"`.
- KPI-strip sparklines stay decorative (`aria-hidden="true"`); the accessible value is
  the card's text.
- Every reports/finance chart pairs with a data-table view of the same numbers (a
  "View as table" toggle or an adjacent table) — the table is the screen-reader path.

## 11. Governance

- A new chart **type** (not a new instance) is a pattern change — governance, MINOR bump.
- Chart primitives (`.chart-legend`, `.chart-tip`) live in `components.css`; their
  registry entry is [chart-primitives.md](../components/chart-primitives.md).

## Components composed
`card`, `badge`, `skeleton`, `alert`, `data-table` (table alternative), chart tokens,
shell animation classes, [chart-primitives](../components/chart-primitives.md).
