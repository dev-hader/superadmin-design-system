# Pattern — Mobile App Mode (≤768px)

Below 768px the dashboard reads as a native app, not a shrunken desktop. All of this is
already implemented in `assets/shell.css` + `shell.js`; proposals must respect it, and the
responsive review prompt audits against it.

## What changes automatically

| Area | Behaviour |
|---|---|
| Primary nav | Bottom tab bar `.rd-tabbar` (rendered by `RD.boot` on every page): Schedule, Bookings, Customers, More; safe-area padding; active item tinted primary |
| Content | `.content` gains bottom padding (110px) to clear the bar |
| FAB | Moves up (`inset-block-end: 88px`) to clear the tab bar; its panel too |
| Type scale | Page titles drop to 1.65rem; leads to `--text-sm`; tighter page-head margin |
| Side lists | Docs-style side lists (component/template/report/settings navs) become horizontal, scrollbar-less chip strips |
| KPI grid | `.rd-kpis.grid-4` → two-up; card padding and value size reduce |
| Tables | `.data-table` restyles into stacked cards using each cell's `data-label` |
| Chat template | Conversation list collapses to an avatar rail |
| Quicklinks navbar | Jump-strip wraps to its own row |

## What proposals must do

1. Put `data-label` on every non-first table cell — the card restyle depends on it.
2. Choose the mobile-priority action in the story; it becomes the FAB or the first tab-bar item.
3. Prefer bottom sheets (`.sheet--bottom`) over drawers for mobile quick actions.
4. No hover-dependent interactions (flyout sidebar is desktop-only; row actions use kebab menus).
5. Verify at 390 × 844 in the device preview (style-switcher FAB → device buttons) — it uses
   a real iframe so real breakpoints fire.

## Components composed
Shell tab bar, `fab`, `data-table`, `sheet`, `card`.
