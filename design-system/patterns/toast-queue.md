# Pattern — Toast Queue & Undo

**Status:** approved · v1.0 (2026-07-20)
The system-level rules for transient feedback, and the shared emitter that enforces them:
`RD.toast(kind, message, opts)` in `assets/shell.js`. Pages never hand-roll toast stacks
anymore — the shell owns the queue.

## 1. The emitter

```js
RD.toast("success", "Changes saved successfully.");
RD.toast("danger",  "Could not reach the payment gateway.", { action: "Retry", onAction: retryFn });
RD.toast("info",    "Booking cancelled.", { action: "Undo", onAction: restoreFn });
```

| Param | Values |
|---|---|
| `kind` | `success` · `danger` · `warn` · `info` |
| `opts.action` | label for one action button (Undo / Retry) — one action max, never two |
| `opts.onAction` | fires once, then the toast closes |
| `opts.duration` | override ms — rarely needed; the defaults below are the contract |
| returns | a `dismiss()` function for programmatic close (e.g. the undone action completed) |

## 2. Queue rules (what the emitter enforces)

- **One stack per page** (`#rdToasts`, `.toast-stack`) — fixed below the topbar at the
  inline-end edge; full-width on ≤640px.
- **Newest on top.** Max **3 visible** — a fourth arrival evicts the oldest immediately.
- **Auto-dismiss: 5s**, or **8s when there's an action** (the user needs time to decide).
- **Hover pauses the timer**; leaving restarts a short 2.5s grace.
- `role="status"` (polite) for success/info/warn; `role="alert"` for danger.

## 3. Undo — the rule that shapes destructive UX

Destructive-but-reversible actions (cancel booking, remove employee, archive customer)
**commit immediately and offer Undo in the toast** — no "Are you sure?" modal.
Confirm dialogs are reserved for the genuinely irreversible (permanent delete, refund).

- Undo restores the exact prior state, then confirms with its own quiet toast
  ("Booking restored.") — no toast chains beyond that.
- The action window is the toast's 8s life. After it expires, the change stands; deeper
  recovery is a product feature (history), not a toast concern.
- Never put Undo on a **danger** toast — danger reports a failure, there is nothing to undo.

## 4. Copy rules

- One sentence, verb-first, ends with a period: *"Changes saved successfully."*
- Name the object when ambiguous: *"HF-24815 cancelled."* not *"Item cancelled."*
- Failure toasts say what to do next: *"…Please try again."* — see the microcopy guide
  (docs/09) for the Arabic equivalents.

## 5. Toast vs alert (decision rule)

| Use a **toast** when | Use an **alert/banner** when |
|---|---|
| the event is done and transient | the condition persists until resolved |
| triggered by the user's own action | triggered by the system (overbooking risk) |
| nothing on the page must change | the page content is affected |

## Components composed
`toast` (`.toast`, `.toast__icon`, `.toast__action`), `.toast-stack` (components.css),
icons `check/close/warn/info`. Demo: components.html → Feedback → Toast / snackbar.
