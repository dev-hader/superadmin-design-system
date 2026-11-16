# Foundations — Index

The non-negotiable base layer every component and screen is built on.

| Topic | File | Source of truth |
|---|---|---|
| Design tokens (color, spacing, type, motion, elevation, z-index, domain palettes, dark theme) | [design-tokens.md](design-tokens.md) | `assets/css/tokens.css` |
| Iconography | [iconography.md](iconography.md) | `assets/shell.js` (`RD.icon`) |
| Accessibility baseline (focus, ARIA, contrast, motion, RTL, touch) | [accessibility.md](accessibility.md) | mechanisms across `base.css` / `app.css` / `components.css` |

**AI note:** load `design-tokens.md` only when writing or reviewing CSS; load
`accessibility.md` for a11y reviews; `iconography.md` when choosing icons. For screen
composition, the component registry entries already embed what you need.
