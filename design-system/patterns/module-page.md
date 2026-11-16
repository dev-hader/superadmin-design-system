# Pattern — Module Page Anatomy

The default recipe for every module screen (Bookings, Customers, Finance…). Start here for
any new-screen proposal.

## Structure

```html
<div class="app" id="app">
  <div class="scrim"></div>
  <aside class="sidebar" id="sidebarMount"></aside>
  <div class="main">
    <header class="topbar" id="topbarMount"></header>
    <nav id="topTabsMount"></nav>
    <main class="content"><div class="content__inner">

      <!-- 1 · Page head: title + lead. Ambient color blobs render via CSS, no markup -->
      <header class="page-head animate-in">
        <h1>Bookings</h1>
        <p class="lead">One line of purpose, not a paragraph.</p>
      </header>

      <!-- 2 · KPI strip (optional): 3–4 cards, .rd-tone-N rotates icon tints -->
      <div class="grid-4 rd-kpis">
        <div class="card card--pad rd-tone-0"> …kpi-ic + value + delta… </div>
        …
      </div>

      <!-- 3 · Toolbar: search / filters / view toggle / ONE primary action -->
      <div class="rd-toolbar"> … </div>

      <!-- 4 · Content: table, scheduler, cards grid … -->

    </div></main>
  </div>
</div>
<script src="assets/js/data.js"></script>
<script src="assets/shell.js"></script>
<script>RD.boot({ activeId: "bookings", title: "Bookings" });</script>
```

## Rules

- `RD.boot({activeId, title})` renders sidebar, topbar, mobile tab bar, and page loader —
  never hand-build shell chrome. `activeId` must match an id in `RD.NAV`.
- KPI strip: use `RD.kpiStrip(items)` or the markup above; icon tones rotate with
  `.rd-tone-0..3`; cards get the gradient top edge automatically via `.rd-kpis .card`.
- Entrance stagger: `RD.stagger(selector)` adds `.animate-in` with delays — use for card
  grids, never for tables' individual rows.
- Exactly one primary `.btn` in the toolbar; everything else secondary/ghost.
- Below the fold, prefer the [record-detail drawer](record-detail-drawer.md) over navigation
  for row-level detail.

## Components composed
`card`, `button`, `tabs`/`segmented-control`, `data-table` (typical), `status-badge`,
`menu`, plus shell (see `../layouts/app-shell.md`).
