---
id: button
name: Button
category: Forms
status: stable
version: 1.1.0
owner: Design System Maintainer
css-classes: [.btn, .btn--secondary, .btn--outline, .btn--ghost, .btn--accent, .btn--success, .btn--danger, .btn--sm, .btn--lg, .btn--icon, .btn--block, .btn-group, .btn-split, .fab, .is-loading, .is-disabled]
source-css: assets/css/components.css
source-demo: components.html
related: [menu]
---

# Button

## Purpose
The single interactive element for triggering an action. Every clickable action in the product is a `.btn` (or a `.btn--icon` for bare icons).

## Description
A fixed-height (40px default) rounded action element driven by internal custom properties (`--_bg`, `--_fg`, `--_bd`) so variants only re-map colors, never re-declare layout. Supports leading/trailing 18px SVG icons, loading spinner overlay, split and grouped compositions, and a floating action button (`.fab`) for the primary mobile action.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Primary | `.btn` | The single most important action on the view — brand-green fill, near-black text (brand §9) |
| Secondary | `.btn btn--secondary` | Routine actions alongside a primary |
| Outline | `.btn btn--outline` | Medium emphasis, brand-tinted |
| Ghost | `.btn btn--ghost` | Low emphasis, inline/toolbar actions |
| Accent | `.btn btn--accent` | Rare, high-emphasis secondary-brand moment (navy). Never routine actions |
| Success | `.btn btn--success` | Confirming a positive irreversible action |
| Danger | `.btn btn--danger` | Destructive actions (cancel booking, delete) |
| Icon-only | `.btn btn--icon` + `aria-label` | Toolbar action where the icon is unambiguous |
| Split | `.btn-split` wrapping `.btn` + `.btn btn--icon` | Primary action with related alternatives |
| Group | `.btn-group` of `.btn--secondary` | Tightly related peer actions (Day/Week/Month) |
| FAB | `.fab` + `aria-label` | Single floating primary action (mobile-first) |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Variant colors, `--radius-md` |
| Hover | `:hover` | Shifted bg (`--color-primary-hover` — darker lime in light, lighter in dark), `--shadow-sm` |
| Active | `:active` | `translateY(1px)`, pressed color |
| Focus | `:focus-visible` | `--shadow-focus` ring — never remove |
| Disabled | `disabled` attr or `.is-disabled` | `--opacity-disabled`, no pointer events |
| Loading | `.is-loading` | Label hidden, centered spinner, no pointer events |

## Properties
| Property | How |
|---|---|
| Size | `.btn--sm` (32px), default (40px), `.btn--lg` (48px) |
| Icon | Inline `RD.icon("name")` SVG before/after the label |
| Full width | `.btn--block` |

## Responsive Behaviour
No intrinsic breakpoint changes. In mobile app mode (≤768px) the primary page action typically moves to the `.fab`, which clears the bottom tab bar (`inset-block-end: 88px`, see `assets/shell.css`).

## Accessibility
- Use a real `<button>` element; links styled as buttons only for navigation.
- Icon-only buttons and the FAB **must** carry `aria-label`.
- Focus ring comes from `:focus-visible` + `--shadow-focus` — never suppress it.
- Loading state keeps the element in the DOM and focusable order; the spinner is decorative.
- Explain *why* a button is disabled with a tooltip (`title` + `aria-label`), never silence alone.

## Dependencies
Tokens: brand, status, radius, shadow, motion groups. No JS required (loading/disabled are class toggles).

## Related Components
- [menu.md](menu.md) — pair with the split button's chevron half.
- [iconography.md](../foundations/iconography.md) — the 18px stroke icon set.

## Usage Examples
- `New booking` (primary + calendar icon) in the Bookings toolbar.
- `Export ▾` split/secondary in Reports.
- Day/Week/Month `.btn-group` in Scheduling.
- Danger `Cancel booking` in the confirm modal footer.

## Do
- One primary button per view — everything else secondary, outline or ghost.
- Keep labels verb-first ("Create a booking", not "Booking creation").
- Use `.btn--danger` for the destructive choice inside confirm dialogs.

## Don't
- Don't use `.btn--accent` (navy) for routine actions — it is reserved for one rare high-emphasis moment.
- Don't build custom-colored buttons; only the seven documented variants exist.
- Don't stack two primaries side-by-side; demote one.

## HTML Reference
```html
<button class="btn">Primary</button>
<button class="btn btn--secondary">Secondary</button>
<button class="btn btn--danger">Cancel booking</button>
<button class="btn btn--sm btn--ghost">Small ghost</button>
<button class="btn is-loading">Saving</button>
<button class="btn btn--icon btn--secondary" aria-label="Search"><!-- RD.icon("search") --></button>
<div class="btn-split"><button class="btn">Confirm</button><button class="btn btn--icon" aria-label="More"><!-- chevronDown --></button></div>
<div class="btn-group"><button class="btn btn--secondary">Day</button><button class="btn btn--secondary">Week</button></div>
<button class="fab" aria-label="Add booking"><!-- RD.icon("calendar") --></button>
```

## CSS Reference
`assets/css/components.css` → `BUTTON` section (top of file). FAB positioning/pulse: `assets/shell.css`.

## Version
| Version | Date | Change |
|---|---|---|
| 1.1.0 | 2026-07-19 | Brand re-theme: primary = lime fill + black text; accent = navy; outline/text usages moved to `--color-primary-ink`; success/danger labels use `--color-text-inverse` |
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
