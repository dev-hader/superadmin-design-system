---
id: date-range-picker
name: Date range picker
category: Forms
status: approved
version: 1.0.0
owner: Design System Maintainer
css-classes: [.daterange, .daterange__presets, .daterange__body, .daterange__cals, .daterange__foot, .daterange__summary]
source-css: assets/css/components.css
source-demo: components.html
related: [calendar, button]
---

# Date range picker

## Purpose
Pick a reporting or filtering period in one gesture: a presets rail for the questions asked
daily (today, last 7/30 days, this month) plus a two-month calendar grid for everything else.
The standard period control for Reports, Finance and any filtered list.

## Description
A popover panel (`--radius-lg`, `--shadow-lg`, raised surface) with three zones: a sunken
presets rail (`.daterange__presets`), a body holding two borderless [calendar](calendar.md)
months side by side (`.daterange__cals`), and a footer (`.daterange__foot`) with the
selected-range summary and Cancel/Apply actions. Range selection rides the calendar
component's own classes: `.cal__day.is-range-start / .is-range-end` (green pill ends,
logical-property rounding so RTL flips correctly) and `.in-range` (subtle wash between).

## Variants
| Variant | Class | Use when |
|---|---|---|
| Full | `.daterange` (presets + 2 months) | Reports/finance toolbars — the default |
| Single-month | `.daterange` with one `.cal` | Tight layouts, mobile sheets |

## States
| State | Trigger | Appearance |
|---|---|---|
| Preset active | `.daterange__presets button.is-active` | `--color-primary-subtle` bg, `--color-primary-ink` text |
| Range endpoints | `.cal__day.is-range-start/.is-range-end` | `--color-primary` fill, `--color-on-primary` text |
| In range | `.cal__day.in-range` | `--color-primary-subtle` wash, squared corners |
| Custom | "Custom" preset active | calendars become the primary input |

## Properties
| Property | How |
|---|---|
| Presets | Buttons in `.daterange__presets` — page supplies the list; keep ≤7 |
| Summary | `.daterange__summary` — `<b>Jul 6 – Jul 12</b> · 7 days` |
| Apply/Cancel | `.btn .btn--sm` + `.btn--ghost` in the footer |

## Responsive Behaviour
≤640px: the panel goes full-width and vertical — the presets rail becomes a horizontal
scrollable chip strip (scrollbar hidden), the two months stack. Footer unchanged.

## Accessibility
- The trigger (page-level) is a button with `aria-expanded` + `aria-haspopup="dialog"`.
- Day cells are focusable in DOM order; endpoints announce via `aria-label`
  ("Start date, July 6"). Apply is the only affirmative action — Enter on a day never closes.
- Presets are real buttons; active preset carries `aria-pressed="true"`.

## Dependencies
Composes [calendar.md](calendar.md) (two instances, borderless via `.daterange__cals .cal`).
Tokens: brand, surface, border, radius, shadow, motion. Open/close + date math are
page-level JS; the system ships the full visual contract.

## Related Components
- [calendar.md](calendar.md) — the month grid and range-day classes live there.
- [button.md](button.md) — footer actions.

## Usage Examples
- Reports header: "Last 30 days" preset driving every chart on the page.
- Finance payouts: custom range across a month boundary (two-month grid earns its keep).
- Bookings filter bar: the "Date" filter chip opens this picker.

## Do
- Default to the most common preset (Last 7 days), not to an empty state.
- Keep the summary visible before Apply — users verify the sentence, not the cells.
- Order presets from smallest to largest period.

## Don't
- Don't close the popover on the first day click — a range needs two.
- Don't invent per-page preset styles; the rail is part of the component.
- Don't use it for a single date — that's the plain [calendar](calendar.md).

## HTML Reference
```html
<div class="daterange">
  <div class="daterange__presets">
    <button>Today</button><button>Yesterday</button>
    <button class="is-active">Last 7 days</button><button>Last 30 days</button>
    <button>This month</button><button>Custom</button>
  </div>
  <div class="daterange__body">
    <div class="daterange__cals"><!-- two .cal months; range days carry
      .is-range-start / .in-range / .is-range-end --></div>
    <div class="daterange__foot">
      <span class="daterange__summary"><b>Jul 6 – Jul 12</b> · 7 days</span>
      <div class="row"><button class="btn btn--sm btn--ghost">Cancel</button>
      <button class="btn btn--sm">Apply</button></div>
    </div>
  </div>
</div>
```

## CSS Reference
`assets/css/components.css` → `DATE RANGE PICKER` section; range-day classes in the
`CALENDAR` section.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-19 | Initial build — P0 gap item (06-gap-analysis-roadmap.md), owner-approved |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
