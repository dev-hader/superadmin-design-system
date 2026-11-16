# Pattern — Record-Detail Drawer

Row-level detail without leaving the list: clicking a table row opens the shared live drawer
from the end edge (RTL-aware). The list keeps its scroll position and filters.

## API (shell.js)

```js
RD.openDrawer("HF-24810 · Amelia Hartwell", [
  ["Status", '<span class="status status--confirmed"><span class="dot"></span>Confirmed</span>'],
  ["Activity", "Padel — Court B"],
  ["Time", "Jul 15, 7:30 PM"],
  ["Amount", "SAR 180.00"],
], [
  { label: "Check in", cls: "btn", onClick: … },
  { label: "Cancel booking", cls: "btn btn--danger btn--ghost", onClick: … },
]);
```

Markup pieces (in `assets/shell.css`): `.drawer-backdrop`, `.drawer-live` (380px, max 92vw),
`.drawer-body-row` label/value rows.

## Rules

- Use for **peek + quick actions** (check in, message, cancel). If the record needs tabs,
  history, or editing across many fields, it deserves a full page — don't build a mega-drawer.
- Values column accepts registry components (status badges, links) — labels stay plain text.
- Footer buttons follow button hierarchy: one primary, destructive as danger-ghost.
- Backdrop click and `Esc` close it; it slides from `inset-inline-end` and mirrors in RTL
  automatically.
- Never nest a second drawer or a modal on top of the drawer; close it first.

## Components composed
`drawer` (live variant), `status-badge`, `button`, `avatar`.
