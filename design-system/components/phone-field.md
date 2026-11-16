---
id: phone-field
name: Phone Field
category: Forms
status: stable
version: 1.0.0
owner: Design System Maintainer
css-classes: [.phone-field, .phone-field__wrap, .phone-field__country, .phone-field__menu, .flag-chip]
source-css: assets/css/components.css (PHONE FIELD block — promoted 2026-07-21)
source-js: assets/shell.js (RD.FLAGS inventory + RD.phoneCountry(btnId, menuId, onPick?) wiring helper)
source-demo: components.html
related: [input, menu, select]
---

# Phone Field

## Purpose
International phone-number entry: a country/dial-code trigger with a real SVG flag fused to a standard `.input`.

## Description
A page-level composite, not a core stylesheet component: `.phone-field`, `.phone-field__country` and `.flag-chip` are defined in the `<style>` block of `components.html` and compose existing pieces (`.field`, `.input`, `.menu` + `RD.portalMenu`). The country trigger is a 42px bordered segment (rounded on the start side only) holding a 20×14px `.flag-chip` SVG and the dial code; the adjacent `.input` drops its start radius so the two read as one control. Clicking the trigger opens a standard portaled `.menu` of countries (flag, name, dial code).

Rationale from the demo: real SVG flags, not emoji — country-flag emoji render as plain two-letter codes on Windows (no system flag glyphs), so a native flag glyph in a form field is a bug on the platform most partner staff actually run.

## Variants
| Variant | Class | Use when |
|---|---|---|
| With country picker | `.phone-field` > `.dropdown-demo` (trigger + `.menu`) + `.input` | User may change country |
| Fixed country | `.phone-field` > static `.phone-field__country` (`cursor:default`) + `.input` | Country is known/locked; no menu |

## States
| State | Trigger | Appearance |
|---|---|---|
| Default | — | Fused segments: bordered trigger + standard `.input` |
| Trigger hover | `:hover` | `--color-surface-hover` background |
| Menu open | JS toggles `.menu.is-open`, `aria-expanded="true"` | Portaled country menu below the trigger |
| Error | `.is-error` on the `.input` + `.field__error` below the `.field` | Danger border on the number segment |

## Properties
| Property | How |
|---|---|
| Flag | Inline 24×16-viewBox SVG inside `.flag-chip` (from the page's `FLAGS` data) |
| Dial code | Text span in the trigger, updated by the menu selection JS |
| Menu items | `.menu__item` with flag chip, country name, trailing dial code |
| Label / error | Standard `.field`, `.field__label`, `.field__error` wrapper |

## Responsive Behaviour
No intrinsic breakpoint changes; the demo caps the composite at `max-width: 320px`. The menu is positioned by `RD.portalMenu` / `RD.positionMenu`, which handles placement at any viewport.

## Accessibility
- The country trigger is a real `<button type="button">` with `aria-haspopup="true"` and `aria-expanded` kept in sync by the open/close JS (the demo resets it to `"false"` on close).
- The `.field__label` ("Mobile number") labels the number input; give the trigger its own accessible name (visible dial code plus, ideally, `aria-label="Country code"`).
- Flag SVGs are decorative — the country name and dial code in the menu items are the accessible text.
- Error handling reuses `.input.is-error` + `.field__error`; pair with `aria-invalid` and `aria-describedby` as for any input.
- Escape closes the menu (page-level `keydown` handler), matching the system menu pattern.

## Dependencies
Core components: `.field`, `.input`, `.menu` / `.menu__item`, `RD.icon("chevronDown")`.
**Promoted 2026-07-21** (governance §6, consumers: `customers.html`,
`scheduling-create-booking.html`): CSS now lives in `assets/css/components.css`
(`.phone-field__wrap` replaces the demo's `.dropdown-demo`; `.phone-field__menu`
anchors the country menu to the trigger's start edge). Wiring:
`const getCountry = RD.phoneCountry("countryBtn", "countryMenu")` fills the trigger and
menu from `RD.FLAGS` (SA/EG/AE/KW), handles open/close incl. outside click, and returns
a `() => {code, name, dial, flag}` getter.

## Related Components
- [input.md](input.md) — the number segment is a standard `.input` with standard states.
- [menu.md](menu.md) — the country dropdown is the system menu, portaled to `<body>`.
- [select.md](select.md) — a native select cannot render SVG flags in options, which is why this composite exists.

## Usage Examples
- "Mobile number" with Saudi Arabia (+966) default and a 4-country menu (`components.html`, Input section).
- "Emergency contact" with a fixed UAE (+971) chip, `.is-error` input and "Enter a complete phone number" error.

## Do
- Use real SVG flags from the page's flag set — never emoji flags (they render as bare letter codes on Windows).
- Default the country to the venue's locale (+966 in the demos) so most users never open the menu.
- Use the fixed-country variant when the account scopes the region — don't offer a dead menu.

## Don't
- Don't rebuild this with a native `<select>` for the country — options can't contain flag SVGs.
- Don't validate the number without the dial code context — the demo's error case is a too-short local number.
- Don't restyle the fused radii per page; the trigger owns the start corners, the input the end corners.

## HTML Reference
```html
<div class="field">
  <label class="field__label">Mobile number</label>
  <div class="phone-field">
    <div class="dropdown-demo">
      <button class="phone-field__country" type="button" aria-haspopup="true" aria-expanded="false">
        <span class="flag-chip"><!-- inline flag SVG --></span><span>+966</span><!-- RD.icon("chevronDown") -->
      </button>
      <div class="menu" style="min-width:230px">
        <button class="menu__item" data-country="0"><span class="flag-chip"><!-- flag --></span><span>Saudi Arabia</span><span>+966</span></button>
        <button class="menu__item" data-country="1"><span class="flag-chip"><!-- flag --></span><span>United Arab Emirates</span><span>+971</span></button>
      </div>
    </div>
    <input class="input" placeholder="5X XXX XXXX">
  </div>
</div>

<!-- Fixed country + error -->
<div class="field">
  <label class="field__label">Emergency contact</label>
  <div class="phone-field">
    <div class="phone-field__country" style="cursor:default"><span class="flag-chip"><!-- flag --></span><span>+971</span></div>
    <input class="input is-error" value="5012">
  </div>
  <span class="field__error"><!-- RD.icon("warn") --> Enter a complete phone number</span>
</div>
```

## CSS Reference
`components.html` → inline `<style>` block (`.phone-field`, `.phone-field__country`, `.flag-chip`, `.dropdown-demo`). Base pieces: `assets/css/components.css` → `FORM CONTROLS` (`.field`, `.input`) and the menu styles used by the country dropdown.

## Version
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial registry entry documenting existing implementation |
| 1.1.0 | 2026-07-21 | Promoted to core: CSS moved to components.css, RD.FLAGS + RD.phoneCountry helper added, `.phone-field__wrap`/`.phone-field__menu` introduced; adopted by customers.html and scheduling-create-booking.html |

## Owner
Design System Maintainer (h.abdulfatah@asasware.com)
