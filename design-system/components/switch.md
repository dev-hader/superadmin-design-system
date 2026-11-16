---
id: switch
name: Switch
category: Forms
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.switch, .switch__track]
source-css: assets/css/components.css
source-demo: components.html
related: [checkbox-radio, chip]
---

# Switch

## Purpose
An instant on/off toggle for settings that take effect immediately — no submit step.

## Description
A `<label class="switch">` wrapping a hidden native checkbox and a 42×24px `.switch__track` pill. The 20px white thumb is the track's `::after` pseudo-element and slides 18px with the spring ease when checked; the track fills `--color-primary`. Like `.check`, the real input stays in the DOM for keyboard and assistive-tech behavior. An RTL override flips the thumb travel direction (`[dir="rtl"]` rule), so it works in Arabic layouts unchanged.

## Variants
| Variant | Class | Use when |
|---|---|---|
| Default | `.switch` > hidden checkbox + `.switch__track` | The only variant — one size, one style |

## States
| State | Trigger | Appearance |
|---|---|---|
| Off | — | `--color-border-strong` track, thumb at inline-start |
| On | `input:checked` | `--color-primary` track, thumb slides 18px (mirrored in RTL) |
| Focus | `input:focus-visible` | `--shadow-focus` ring on the track |

## Properties
| Property | How |
|---|---|
| Label text | Text inside the `<label>` after the track (or before — the demo settings page uses `justify-content:space-between` for full-width rows) |
| Row layout | Utility styles on the label (e.g. `style="justify-content:space-between;width:100%"` in settings.html) |

## Responsive Behaviour
No intrinsic breakpoint changes. Track is `flex-shrink: 0`, so long labels wrap without squashing the control.

## Accessibility
- Built on a native checkbox — Space toggles it; never replace with a div + click handler.
- The wrapping `<label>` associates the visible text; a bare switch (as in the settings integrations list) needs `aria-label` on the input.
- Announcements are "checkbox, checked/unchecked", which is acceptable; add `role="switch"` and `aria-checked` only if a true switch semantic is required, keeping the checkbox behavior.
- Focus ring via `:focus-visible` + `--shadow-focus` — never suppress.
- Because the change applies instantly, give feedback (e.g. a toast) when the toggle triggers a background save.

## Dependencies
Tokens: color (primary/border-strong), radius-full, text-sm, shadow-sm, shadow-focus, motion (base + spring). RTL support baked into the CSS. No JS.

## Related Components
- [checkbox-radio.md](checkbox-radio.md) — choose a checkbox when the value is staged and submitted with a form.
- [chip.md](chip.md) — `.chip--select` for toggling visible filters rather than settings.

## Usage Examples
- Notification preference rows in Settings (`settings.html` — full-width label/track rows with `justify-content:space-between`).
- Integration on/off toggles ("SMS gateway", etc.) in the Settings integrations list.
- "Instant booking" / "Allow pets" toggles on the design-system selection-controls page.

## Do
- Use a switch only when the effect is immediate — flipping it should change the system right away.
- Keep label text short and stateless ("Instant booking", not "Enable/disable instant booking").
- Put the switch on the trailing edge in settings rows so labels align in a column.

## Don't
- Don't use a switch inside a form that has a Save button — that's a checkbox.
- Don't invent sizes or colored variants; there is exactly one switch.
- Don't hard-code the thumb translation — RTL is already handled in the stylesheet.

## HTML Reference
```html
<label class="switch">
  <input type="checkbox" checked>
  <span class="switch__track"></span>
  Instant booking
</label>

<!-- Full-width settings row (label first, control trailing) -->
<label class="switch" style="justify-content:space-between;width:100%">
  Booking reminders
  <input type="checkbox" checked><span class="switch__track"></span>
</label>

<!-- Bare switch in a list row -->
<label class="switch"><input type="checkbox" aria-label="Enable SMS gateway" checked><span class="switch__track"></span></label>
```

## CSS Reference
`assets/css/components.css` → `FORM CONTROLS` section, `/* Checkbox / Radio / Switch */` block (`.switch`, `.switch__track`, RTL override).

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
