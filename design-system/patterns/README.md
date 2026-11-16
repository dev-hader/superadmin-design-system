# Pattern Library — Index

Patterns are **approved compositions of components** — the recurring page-level recipes the
product is built from. A pattern uses only registry components; it earns an entry here when
the same composition appears (or will appear) on two or more screens.

| Pattern | File | Seen on |
|---|---|---|
| Module page anatomy (page-head → KPI strip → toolbar → content) | [module-page.md](module-page.md) | every list page |
| Toolbar & filtering (search + chips + segmented + drawer) | [toolbar-filtering.md](toolbar-filtering.md) | partners, packages, users, bookings |
| Record-detail drawer (`RD.openDrawer`) | [record-detail-drawer.md](record-detail-drawer.md) | row detail without leaving a list |
| Status system (one vocabulary for booking state) | [status-system.md](status-system.md) | bookings, public events, multi-booking |
| Form validation (when errors show) | [form-validation.md](form-validation.md) | add partner, package edit, CRUD modals, auth pages |
| Toast queue & Undo (`RD.toast`) | [toast-queue.md](toast-queue.md) | every save / delete / status change |
| Mobile app mode (≤768px transformations) | [mobile-app-mode.md](mobile-app-mode.md) | every page |
| Chart presentation & animation | [charts.md](charts.md) | dashboard, financials |
| Result illustrations | [result-illustrations.md](result-illustrations.md) | foundations page |

Partner-only patterns (booking flow, customer 360, email templates, POS checkout,
scheduler drag & drop, Quick Access QR) are **not** part of this system — the Super Admin
dashboard has none of those surfaces. They live in the Partner Web Design System; port one
here only if a Super Admin user story needs it.

**AI note:** when composing a screen, start from `module-page.md` — it is the default page
recipe. Load other patterns only when the story calls for them.

### Adding a pattern
Post-release, the Design System Maintainer captures new reusable compositions here
(governance stage 3.8). A pattern entry documents: intent, the components it composes (by
registry id), the markup skeleton, and known constraints. MINOR version bump + `Added`
changelog line.
