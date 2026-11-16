# Foundations — Accessibility Baseline

Target: **WCAG 2.1 AA**. These are the mechanisms already built into the system — proposals
and implementations must use them, and the accessibility review prompt
([`../docs/04-ai-prompts.md`](../docs/04-ai-prompts.md) §7) audits against this page.

## Keyboard & focus

- Every interactive element is a real `<button>`, `<a>`, or form control — never a `div`
  with a click handler.
- Focus visibility comes from `:focus-visible` + `--shadow-focus` (4px ring using
  `--color-focus-ring`, theme-aware). **Never suppress or restyle it.**
- Modals: focus moves in on open, `Esc` and backdrop-click close, focus returns to the
  trigger (see [`../components/modal.md`](../components/modal.md)).
- Menus/dropdowns: trigger carries `aria-haspopup` + `aria-expanded`; menus close on
  outside click and `Esc`.

## Semantics & ARIA

- Icon-only buttons and the FAB: `aria-label` required.
- Active nav link: `aria-current="page"` (rendered by `RD.boot`).
- Inputs: `<label class="field__label">` associated with the control (or the floating-label
  `for`/`id` pair); hints via `.field__hint`; errors via `.field__error` adjacent to the field.
- Tooltips appear on hover **and** keyboard focus — never hover-only — and are never the
  only place required information lives.
- Disabled controls explain *why* (`title` + `aria-label`), not just that they are.

## Color & contrast

- Text tokens meet 4.5:1 on their intended surfaces in **both themes**; status `-fg` colors
  are paired with their `-bg`/`-subtle` counterparts — don't mix pairs across states.
- Color is never the only signal: status badges pair color with a label and dot; charts pair
  the categorical palette with labels/tooltips.

## Motion

- All system animation (chart draw-ins, status-dot pulses, FAB pulse, entrances, page
  loader) is disabled under `prefers-reduced-motion: reduce`. Any new animation must
  include the same guard.

## RTL & localization

- Layout uses **logical properties** (`inset-inline-end`, `border-start-start-radius`,
  `margin-inline-start`…) throughout — it mirrors automatically under `dir="rtl"`.
- Directional-only glyphs are mirrored by the dedicated RTL rules in `app.css`; the live
  drawer flips its slide direction (`[dir="rtl"] .drawer-live`).
- Direction persists via `localStorage("rd-dir")`, applied pre-paint. Test every proposal in
  RTL — Arabic is a first-class market for HighFive.

## Touch & responsive

- Touch targets ≥ 40px effective size (buttons are 40px; `.btn--sm` is for dense desktop
  contexts, not primary mobile actions).
- Nothing depends on hover at touch sizes: row actions have kebab menus, the flyout sidebar
  is a desktop-only style, tooltips have inline alternatives.
- Tables require `data-label` on non-first cells so the ≤768px card restyle stays readable
  (see [`../components/data-table.md`](../components/data-table.md)).
