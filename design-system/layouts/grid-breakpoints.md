# Layout — Grid & Breakpoints

**Source:** `assets/css/base.css` (utilities), `app.css` (responsive shell),
`assets/shell.css` (mobile app mode).

## Layout utilities (base.css)

| Class | Behaviour |
|---|---|
| `.row` | horizontal flex, vertically centered (`.wrap` to allow wrapping) |
| `.stack` | vertical flex |
| `.grow` | `flex: 1 1 auto` spacer |
| `.gap-1 … .gap-8` | gap from the spacing tokens |
| `.grid-2 / .grid-3 / .grid-4` | equal-column grids |
| `.grid-auto` | `auto-fill, minmax(240px, 1fr)` card grids |

Compose layout from these — don't write bespoke flex/grid CSS per screen.

## Breakpoints

| Width | What happens |
|---|---|
| ≤ 1024px | `.grid-4` and `.grid-3` collapse to 2 columns; sidebar becomes an off-canvas overlay with `.scrim` (see app.css responsive shell) |
| ≤ 768px | **Mobile app mode** — bottom tab bar, table→card restyle, chip-strip side lists, FAB repositioning; see [`../patterns/mobile-app-mode.md`](../patterns/mobile-app-mode.md) |
| ≤ 640px | all equal-column grids collapse to a single column |

Exception: `.rd-kpis.grid-4` stays two-up at ≤768px (KPIs read better 2×2 than stacked).

## Rules

1. Test at 1280 (desktop), 834 (tablet), 390 (mobile) — the device preview frames use
   exactly these.
2. Content max width is `--container-max` (1120px) inside `.content__inner`.
3. Never introduce new breakpoints in a proposal; if a composition needs one, that's a
   system change.
