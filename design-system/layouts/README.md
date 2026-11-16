# Layouts — Index

Everything above the component level: the application shell and the full page templates.

| Topic | File | Source |
|---|---|---|
| App shell: `RD.boot`, sidebar (5 styles), navbar (5 styles), top tabs, mobile tab bar, topbar menus, page loader, style switcher, device preview | [app-shell.md](app-shell.md) | `assets/shell.js`, `assets/shell.css`, `assets/css/app.css` |
| Page templates: login, 404/error, empty, invoice/receipt, QR check-in, packages, onboarding, chat, notifications | [page-templates.md](page-templates.md) | `templates.html`, `assets/css/components.css` (AUTH TEMPLATES etc.) |
| Grid & breakpoints | [grid-breakpoints.md](grid-breakpoints.md) | `assets/css/base.css`, `app.css` |

**AI note:** every screen proposal starts from the app shell (`app-shell.md`); check
`page-templates.md` before composing anything from scratch — a template that already matches
the story beats a new composition.
