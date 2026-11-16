---
component: resource-timeline
status: stable
version: 1.0.0
css-classes: ".sched, .sched__toolbar, .sched__title, .sched__scroll, .sched__grid, .sched__head, .sched__dayhead, .sched__body, .sched__time, .sched__cell, .sched__evt (--confirmed/--checkedin/--pending/--cancelled/--event/--avail), .sched__now, .sched__legend"
source-css: assets/shell.css (sched block) — rendered by the page-level buildGrid() engine
source-demo: scheduling.html → "Timeline · Today" view
related: [charts (RTL axis rule), status]
---

# Resource Timeline

The scheduler view that answers "what is happening on each court/lane/room today":
**columns = resources, rows = time**. It is the same grid engine as the Week view
(`buildGrid()` in `scheduling.html`) with a different column model — documented here
because the "Timeline" toggle shipped long before its contract did (gap-analysis P1).

## Anatomy

```
.sched
├── .sched__toolbar      — Today btn · prev/next · .sched__title · resource filter select · New booking
├── .sched__scroll > .sched__grid   (grid-template-columns: 56px repeat(N, 1fr))
│   ├── .sched__head     — one .sched__dayhead per resource: name + activity sub-label
│   └── .sched__body     — .sched__time gutter · .sched__cell lattice · .sched__evt blocks · .sched__now
└── .sched__legend       — status swatches (shared with Week view)
```

## The column model (vs Week view)

| | Week | **Resource timeline** |
|---|---|---|
| Column | a day | a bookable resource (Court A, Lane 4, Room 1…) |
| `dayhead` label | weekday + date | resource name + activity (`Court A` / `Padel`) |
| Hour range | peak window (e.g. 3–10 PM) | **full business day** (8 AM – 10 PM) |
| `is-today` | today's column | optional highlight for the focused resource |
| Now line | shown when today is visible | always (`showNow: true`) |

## Event blocks

`.sched__evt` positioned by `grid-column` (resource) + `grid-row` (30-min rows;
`rowOf()` maps "HH:MM"). Status variants ride the status tokens
(`--status-*-dot`): `--confirmed`, `--checkedin`, `--pending`, `--cancelled`,
`--event` (public event, navy gradient), `--avail` (dashed open-slot, "+ Open · N spots").
In this view the block's `<b>` is the **guest name** (the resource is the column, so
repeating it inside the block is noise); `<span>`s carry activity + time.

## Behaviour

- Clicking an event opens the shared booking drawer (`data-*` attrs feed it).
- The toolbar's resource select filters columns (all / activity group).
- Horizontal overflow scrolls inside `.sched__scroll` — the page never scrolls sideways.
- ≤768: columns keep a readable min-width and the grid pans; pinch/scroll, no reflow
  to cards (a timeline reflowed to cards stops being a timeline).

## RTL

Time is vertical here, so **columns may mirror with the document direction** (unlike
the Week grid's horizontal time axis, which stays LTR — charts §4 rule). The time
gutter sits at the inline-start in both directions.

## Rules

- Max ~8 visible columns before the resource filter becomes the primary navigation.
- New column *types* (staff as columns, rooms grouped by floor) are a governance change,
  not a page hack.
