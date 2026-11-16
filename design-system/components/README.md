# Component Registry — Index

> **AI note:** this index is the only file you need to *find* a component. Load an individual
> entry only when the current task actually uses that component. Schema: [`_TEMPLATE.md`](_TEMPLATE.md).
> Governance and field definitions: [`../docs/02-component-registry.md`](../docs/02-component-registry.md).

All components live in **`assets/css/components.css`** (core) and are demonstrated live in
**`components.html`** and **`templates.html`**. Shell-level pieces live in **`assets/shell.css`** / **`assets/shell.js`**.
**Never recreate these — reference them.**

## Forms

| Component | Entry | Key classes | Status |
|---|---|---|---|
| Button | [button.md](button.md) | `.btn` + 7 variants, `.btn-group`, `.btn-split`, `.fab` | stable |
| Input | [input.md](input.md) | `.input`, `.input--num`, `.field` (+ `--locked`), `.field__lock`, `.float`, `.input-wrap`, `.input-affix` | stable |
| Select | [select.md](select.md) | `.select`, `.select__caret` | stable |
| Phone field | [phone-field.md](phone-field.md) | `.phone-field`, `.phone-field__country`, `.phone-field__wrap`, `.phone-field__menu`, `.flag-chip` | stable |
| Checkbox & Radio | [checkbox-radio.md](checkbox-radio.md) | `.check`, `.check--radio`, `.check__box` | stable |
| Inline condition checkbox | [check-inline.md](check-inline.md) | `.check-inline`, `.check-inline__hint` | approved |
| Method option | [method-option.md](method-option.md) | `.method-opt`, `__head`, `__note`, `__picked`, `__error` | approved |
| Switch | [switch.md](switch.md) | `.switch` | stable |
| OTP input | [otp.md](otp.md) | `.otp` | stable |
| Quantity stepper | [quantity-stepper.md](quantity-stepper.md) | `.qty-stepper` | stable |
| File upload | [file-upload.md](file-upload.md) | `.dropzone`, `.file-row` | stable |
| Media grid | [media-grid.md](media-grid.md) | `.media-grid`, `.media-thumb`, `.media-thumb--cover` | approved |
| Date range picker | [date-range-picker.md](date-range-picker.md) | `.daterange` + `.cal` range classes | approved |
| Form section | [form-section.md](form-section.md) | `.form-section` (+ `--static`, `.is-open`, `.is-invalid`), `.form-section__tag` | approved |
| Radio / checkbox with description | [radio-detail.md](radio-detail.md) | `.check--detail`, `.check__detail`, `.check__desc` | approved |
| Conditional panel | [conditional-panel.md](conditional-panel.md) | `.cond-panel`, `.cond-panel__note` | approved |
| Repeater | [repeater.md](repeater.md) | `.repeater`, `.repeater__item`, `.repeater__num` | approved |
| Form action bar | [form-action-bar.md](form-action-bar.md) | `.formbar`, `.formbar__spacer` | approved |

## Identity & Display

| Component | Entry | Key classes | Status |
|---|---|---|---|
| Avatar | [avatar.md](avatar.md) | `.avatar` (+ sizes), `.avatar-group`, `.avatar__status` | stable |
| Badge | [badge.md](badge.md) | `.badge` + 5 tone variants | stable |
| Status badge | [status-badge.md](status-badge.md) | `.status`, booking `--pending`…`--waitlist`, package `--approved`/`--live`/`--rejected`/`--inactive`, subscription `--frozen`, `.status__flag`, `.dot` | stable |
| Chip | [chip.md](chip.md) | `.chip`, `.chip--select` | stable |
| Rating | [rating.md](rating.md) | `.stars` | stable |

## Navigation

| Component | Entry | Key classes | Status |
|---|---|---|---|
| Tabs | [tabs.md](tabs.md) | `.tabs` | stable |
| Command palette (⌘K) | [command-palette.md](command-palette.md) | `.rd-cmdk*` (shell) | approved |
| Segmented control | [segmented-control.md](segmented-control.md) | `.segmented` | stable |
| Breadcrumb | [breadcrumb.md](breadcrumb.md) | `.breadcrumb` (in `app.css`, page-head) | stable |
| Pagination | [pagination.md](pagination.md) | `.pagination`, `.pg-prev` | stable |
| Stepper / wizard | [stepper.md](stepper.md) | `.stepper`, `.stepper--vertical`, `.step`, `.wiz` | stable |

## Overlays

| Component | Entry | Key classes | Status |
|---|---|---|---|
| Modal | [modal.md](modal.md) | `.modal-overlay`, `.modal`, `__head/__body/__foot` | stable |
| Drawer & bottom sheet | [drawer.md](drawer.md) | `.drawer`, `.drawer--right`, `.sheet`, `.drawer-live` (+ `--wide`, `--xl`) (shell) | stable |
| Menu (dropdown) | [menu.md](menu.md) | `.menu`, `.menu__item`, `.menu--select` + `RD.portalMenu` | stable |
| Tooltip | [tooltip.md](tooltip.md) | `.tooltip` | stable |
| Popover | [popover.md](popover.md) | `.popover`, `__title`, `__body`, `__foot` | approved |
| Lightbox | [lightbox.md](lightbox.md) | `.lightbox`, `__img`, `__nav`, `__close`, `__count` | approved |
| Notifications center | [notifications-center.md](notifications-center.md) | `.rd-notif*` (shell) | approved |

## Feedback

| Component | Entry | Key classes | Status |
|---|---|---|---|
| Toast | [toast.md](toast.md) | `.toast`, `.toast--success` | stable |
| Alert / banner | [alert.md](alert.md) | `.alert` + 4 severities | stable |
| Progress indicators | [progress-indicators.md](progress-indicators.md) | `.progress`, `.skeleton`, `.spinner` | stable |
| Empty state | [empty-state.md](empty-state.md) | `.card` composite (3 flavours) | stable |
| Payment result | [payment-result.md](payment-result.md) | `.payresult` composite | stable |
| Error summary | [error-summary.md](error-summary.md) | `.form-errors` | approved |

## Data

| Component | Entry | Key classes | Status |
|---|---|---|---|
| Data table | [data-table.md](data-table.md) | `.data-table*`, toolbar / selectable / expandable / `--pinned`, `.cell-thumb`, `tr.is-flagged` | stable |
| Stat tile | [stat-tile.md](stat-tile.md) | `.stat-strip`, `.stat-tile` (+ `--alert`, `--static`) | approved |
| Filter bar & saved views | [filter-bar.md](filter-bar.md) | `.filterbar`, `.filter-chip` | approved |
| Bulk actions bar | [bulk-actions-bar.md](bulk-actions-bar.md) | `.bulkbar` | approved |
| Accordion | [accordion.md](accordion.md) | `.accordion` | stable |
| Card & KPI card | [card.md](card.md) | `.card`, `.card--pad`, `.kpi-ic`, `.rd-kpis` (shell) | stable |
| Chart primitives | [chart-primitives.md](chart-primitives.md) | `.chart-legend`, `.chart-tip` | approved |
| Detail list | [detail-list.md](detail-list.md) | `.detail-list`, `.detail-row` (+ `--stack`), `__k`, `__v` | approved |
| Calculation sheet | [calc-sheet.md](calc-sheet.md) | `.calc-sheet`, `.calc-row` (+ `--pick`/`--fee`/`--total`), `.calc-sheet__rule` | approved |
| Activity timeline | [activity-timeline.md](activity-timeline.md) | `.timeline`, `__item` (+ `--good`/`--bad`/`--warn`), `__icon`, `__text`, `__meta`, `__note` | approved |
| Message thread | [message-thread.md](message-thread.md) | `.msg-thread`, `.msg` (+ `--out`), `__bubble`, `__name`, `__text`, `__time`, `__attachments`, `.msg-thread__system` | approved |

## Booking domain

| Component | Entry | Key classes | Status |
|---|---|---|---|
| Calendar | [calendar.md](calendar.md) | `.cal` | stable |
| Time slots | [time-slots.md](time-slots.md) | `.slot` | stable |
| Scheduler (week view) | [scheduler.md](scheduler.md) | `.sched` | stable |
| Resource timeline | [resource-timeline.md](resource-timeline.md) | `.sched` (columns = resources) | stable |
| Plan & bundle card | [plan-card.md](plan-card.md) | `.plan`, `.plan--popular` | stable |
| Payment tile | [pay-tile.md](pay-tile.md) | `.pay-tile`, `.pay-tile-group` | stable |
| Seat map | [seat-map.md](seat-map.md) | `.seatmap` | stable |
| Hold timer | [hold-timer.md](hold-timer.md) | `.hold-timer` | stable |
| E-ticket | [eticket.md](eticket.md) | `.eticket` | stable |

## Layout

| Component | Entry | Key classes | Status |
|---|---|---|---|
| Auth templates | [auth-templates.md](auth-templates.md) | `.auth-frame`, `.auth-card`, `.auth-form`, `.divider-or` | stable |
| Record header | [record-header.md](record-header.md) | `.record-head`, `__media`, `__id`, `__badges`, `__meta`, `__actions` | approved |

## Layout & shell (documented under /layouts)

App shell, sidebar (5 variants), navbar (5 variants), top tabs, mobile tab bar, topbar menus,
page loader, style switcher — see [`../layouts/README.md`](../layouts/README.md).

---

### Adding a component to this registry

1. It must be **approved** through the governance flow first — [`../docs/03-governance-workflow.md`](../docs/03-governance-workflow.md).
2. Copy `_TEMPLATE.md`, fill every section, add a row to the right table above.
3. Update `../docs/05-CHANGELOG.md` and bump the system version.
