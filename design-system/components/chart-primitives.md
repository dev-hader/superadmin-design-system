---
id: chart-primitives
name: Chart primitives (legend & tooltip)
category: Data
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.chart-legend, .chart-legend__item, .chart-legend__swatch, .chart-tip, .chart-tip__title, .chart-tip__row, .chart-tip__val]
source-css: assets/css/components.css
source-demo: components.html (Charts → Chart primitives — interactive legend + tooltip)
related: [card, data-table, badge]
---

# Chart primitives (legend & tooltip)

## Purpose
The two HTML pieces every multi-series chart needs around its SVG canvas: a wrapping
legend that names the series, and a dark tooltip that reveals exact values on
hover/tap. Full chart rules: [`../patterns/charts.md`](../patterns/charts.md).

## Description
`.chart-legend` is a wrapping flex row of `__item`s (9px round `__swatch` — inline
`background` set to the series' `--chart-n` token — plus a text label). `.chart-tip` is
an absolutely-positioned inverted card (`--color-text` surface) inside the chart's
`position: relative` wrapper: `__title` (the x value), then `__row`s of swatch + name +
`__val` in tabular numerals; shown via `.is-visible`.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Static legend | `.chart-legend` | naming series (default) |
| Toggleable legend | items carry `aria-pressed` | page JS hides/shows series; `"false"` dims to 40% |

## States
| State | Trigger | Appearance |
|---|---|---|
| Tooltip hidden | default | opacity 0, 4px offset |
| Tooltip visible | `.is-visible` | fades/slides in (reduced-motion safe) |
| Legend item off | `aria-pressed="false"` | 40% opacity, neutral swatch |

## Responsive Behaviour
Legend wraps naturally under the canvas. Tooltip clamps inside the canvas and flips
near the inline-end edge (page JS). Touch: tap shows, tap-away hides.

## Accessibility
- Legend labels are real text — the accessible series names.
- Tooltip is `aria-hidden="true"`; its data must also exist accessibly (value labels or
  the paired data table — charts.md §10).
- Toggleable items are `<button aria-pressed>` with the series name as the label.

## Dependencies
Chart tokens (`--chart-1…8`), inverse-surface tokens, `--z-popover`. Positioning JS is
page-level.

## Related Components
- [card.md](card.md) — every chart's wrapper.
- [data-table.md](data-table.md) — the accessible twin of any reports chart.

## Usage Examples
- Dashboard revenue: 2-series line (This period / Last period) + legend + tooltip.
- Reports occupancy: bars with toggleable branch legend.

## Do
- Set swatch colors from `--chart-n` tokens in series order.
- Keep tooltip values exact (decimals allowed) even when the axis is compact ("48K").

## Don't
- Don't put actions inside the tooltip — it's pointer-following, not a popover.
- Don't render a legend for single-series charts; the title already names it.

## HTML Reference
```html
<div style="position:relative"> <!-- canvas wrapper -->
  <svg role="img" aria-label="Revenue grew from SAR 32K in January to SAR 48K in June">…</svg>
  <div class="chart-tip is-visible">
    <div class="chart-tip__title">Saturday, 12 July 2026</div>
    <div class="chart-tip__row"><span><span class="chart-legend__swatch" style="background:var(--chart-2)"></span>Revenue</span>
      <span class="chart-tip__val">SAR 48,231.50</span></div>
  </div>
</div>
<div class="chart-legend">
  <span class="chart-legend__item"><span class="chart-legend__swatch" style="background:var(--chart-2)"></span>This period</span>
  <span class="chart-legend__item"><span class="chart-legend__swatch" style="background:var(--chart-1)"></span>Last period</span>
</div>
```

## CSS Reference
`assets/css/components.css` → `CHART PRIMITIVES` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-20 | Initial build — charts-spec P0 item (06-gap-analysis-roadmap.md) |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
