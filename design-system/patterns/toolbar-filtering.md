# Pattern — Toolbar & Filtering

The control row between a page's KPIs and its content: find, narrow, switch view, act.

## Composition

```html
<div class="rd-toolbar">
  <!-- search: reuse the topbar .search input pattern, max-width constrained -->
  <div class="search" style="max-width:280px"> … </div>

  <!-- quick filters: select chips -->
  <span class="chip chip--select is-active">All</span>
  <span class="chip chip--select">Arrivals</span>

  <!-- view toggle -->
  <div class="segmented"><button class="is-active">List</button><button>Calendar</button></div>

  <span class="grow"></span>

  <!-- deep filters live in a drawer, not inline -->
  <button class="btn btn--secondary">Filters</button>
  <!-- the ONE primary action -->
  <button class="btn">New booking</button>
</div>
```

## Rules

- **Three-level filtering:** instant chips for the 2–4 most-used slices → drawer
  (`.drawer--right`) for the full filter set → search for needle-in-haystack. Don't put ten
  selects inline.
- Active filters render as dismissible `.chip`s below the toolbar so state is visible and
  reversible.
- Filtering to zero results shows the **no-results** empty state (with "Clear filters"),
  never the "no data yet" one — see [`../components/empty-state.md`](../components/empty-state.md).
- View toggles are `.segmented` (mutually exclusive modes); content-scoping switches are
  `.tabs` (with counts).
- Bulk actions do **not** live here — table selection swaps in `.data-table-toolbar`
  (see [`../components/data-table.md`](../components/data-table.md)).

## Components composed
`chip`, `segmented-control`, `button`, `drawer`, `data-table`, search input.
