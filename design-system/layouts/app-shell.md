# Layout — Application Shell

The chrome every product page lives in. Rendered by **`RD.boot(ctx)`** from
`assets/shell.js` into stable mount points — **never hand-built per page.**

## Page skeleton & boot

```html
<div class="app" id="app">
  <div class="scrim"></div>
  <aside class="sidebar" id="sidebarMount"></aside>
  <div class="main">
    <header class="topbar" id="topbarMount"></header>
    <nav id="topTabsMount"></nav>
    <main class="content"><div class="content__inner"> …page… </div></main>
  </div>
</div>
<script src="assets/js/data.js"></script>
<script src="assets/shell.js"></script>
<script>RD.boot({ activeId: "bookings", title: "Bookings" });</script>
```

`RD.boot` renders the chosen sidebar + navbar styles, the mobile tab bar, the page-loader
progress bar, the style-switcher FAB, and wires theme/direction toggles. The pre-paint
inline `<head>` script applies persisted theme (`rd-theme`) and direction (`rd-dir`) before
first render — copy it verbatim into new pages.

## Navigation model — `RD.NAV`

The single source every renderer reads. Groups: **Operate** (Scheduling, Bookings,
Customers, Memberships), **Grow** (Marketing, Finance, Reports), **Configure**
(Administration, Settings), plus Templates and Components references. A new module = one
entry in `RD.NAV` (id, title, icon, href, optional badge) — every sidebar/navbar/tab-bar
style picks it up automatically.

## Sidebar — 5 switchable styles (`assets/shell.css`)

| Style | Class hook | Behaviour |
|---|---|---|
| Grouped (default) | `.sidebar` + `.nav-group`/`.nav-link` | labeled groups, collapsible to icon rail |
| Icon flyout | `.rd-sb--flyout` | 76px rail; hover/click reveals a floating group panel — desktop only |
| Two-tier | `.rd-sb--twotier` | 64px section rail + labeled panel for the active section |
| Top tabs | `.app.rd-no-sidebar` + `.rd-toptabs` | no sidebar; horizontal strip under the topbar |
| Search-first | `.rd-sb--searchfirst` | flat dense list led by an in-sidebar search field |

## Navbar — 5 switchable styles

| Style | Class | Character |
|---|---|---|
| Standard (default) | `.rd-navbar--standard` | search-first, icon actions |
| Compact | `.rd-navbar--compact` | dense command bar, title-first |
| Centered | `.rd-navbar--centered` | brand centered, actions split to both edges |
| Quicklinks | `.rd-navbar--quicklinks` | search + jump-strip to top modules |
| Minimal | `.rd-navbar--minimal` | ultra slim, icon-triggered search |

The style switcher (FAB, bottom-end) lets stakeholders flip navbar/sidebar styles and
preview tablet/mobile in a real iframe (`.device-stage`) so genuine breakpoints fire.
Choices persist in `localStorage`.

## Shared shell pieces

- **Topbar menus** (notifications, profile): `app.css`, portal-positioned like all menus.
- **Mobile tab bar** `.rd-tabbar`: see [`../patterns/mobile-app-mode.md`](../patterns/mobile-app-mode.md).
- **Record-detail drawer** `RD.openDrawer`: see [`../patterns/record-detail-drawer.md`](../patterns/record-detail-drawer.md).
- **Page loader** `.rd-topload`: 3px gradient progress bar on boot; hidden under reduced motion.
- **Helpers:** `RD.icon(name)`, `RD.kpiStrip(items)`, `RD.stagger(list, step)`,
  `RD.portalMenu(menu)` + `RD.positionMenu(menu, trigger, align)`.

## Rules

1. Proposals default to **Grouped sidebar + Standard navbar** unless the story says otherwise;
   the switcher exists for evaluation, not per-screen variety.
2. `activeId` must be correct — it drives `aria-current`, active tints, and the tab bar.
3. Layout constants come from tokens: `--sidebar-width`, `--topbar-height`, `--container-max`.
4. Everything is RTL-safe via logical properties; don't add physical left/right offsets.
