# Layout — Page Templates

The Super Admin page types, demonstrated live in **`templates.html`**. Every product page
is one of these plus data — before composing a new screen, check which template the story
fits. Each template in `templates.html` links to the real pages that use it.

| Template | id (templates.html) | Built from | Used in |
|---|---|---|---|
| Sign in | `login` | `.auth-frame`, `.auth-brand`, `.auth-form` (see [auth-templates](../components/auth-templates.md)) | `login.html` |
| Forgot password + code | `otp` | `.card`, `.field`, [otp](../components/otp.md) (`.auth-otp`) | `forgot-password.html`, `verification-code.html` |
| List page | `list` | page head + breadcrumb, [segmented-control](../components/segmented-control.md) pills, search, filter popover, [data-table](../components/data-table.md), [pagination](../components/pagination.md) — `SA.list` in `assets/js/sa-kit.js` | partners, units, packages, users, bookings, employees… |
| Profile with tabs | `profile` | record header card, segmented tabs, [detail-list](../components/detail-list.md) | partner / unit / user profile, package details |
| Setup list + modal | `crud` | data-table + translation/edit/delete icon buttons + [modal](../components/modal.md) form — `CRUD` in `assets/js/sa-crud.js` | Setup Files, Locations, Banks, notifications, content & DS-admin lists |
| Per-currency summary | `finance` | `.card` per country, cash · online · total columns | financials, wallet, subscriptions |
| Empty state | `empty` | [empty-state](../components/empty-state.md) card | every list page |
| 404 / 500 | `error` | centred card + `.btn` | `error-404.html`, `error-500.html` |

Full page → dashboard-source map: [`../docs/product-pages/README.md`](../docs/product-pages/README.md).

## Rules

1. **Reference, don't fork.** A page based on a template links the same stylesheets and
   reuses the same classes (and the same kit — `SA.list`, `CRUD`); it never copies the
   template's CSS.
2. Template modifications that would help every consumer are system changes — route through
   governance; one-off tweaks for a single screen are a smell that the story doesn't fit the
   template.
3. Mobile behaviour is already handled (tables → cards, pills scroll sideways, the template
   list becomes a horizontal strip) — verify at 375px, don't re-implement.
4. New template = MINOR bump, `Added` changelog, and a row in this table.
