/* ============================================================================
   PP CORE — shared plumbing for the Partner Profile (partner-profile.html).
   Tab files register renderers on PP.tabs[key] = (mount, ctx) => void.
   Sample records are attached per partner by PP.extend(), shaped like the
   real /partners/{id}/… responses.
   ========================================================================== */
window.PP = (function () {
  "use strict";
  const { L, esc, ic } = SA;
  const tabs = {};

  /* ---------- deterministic per-partner sample data ---------- */
  function rng(seed) { let s = seed; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
  const pad = (n) => String(n).padStart(2, "0");
  function extend(p) {
    if (p._pp) return;
    p._pp = true;
    const r = rng(p.id);
    const int = (a, b) => a + Math.floor(r() * (b - a + 1));
    const date = (m, d) => `2026-${pad(m)}-${pad(d)} ${pad(int(8, 22))}:${pad(int(0, 59))}:00`;
    p.bio = p.id % 3 ? `${p.company_name} runs premium sports and leisure venues with online booking through HighFive.` : "";
    p.username = p.id % 4 ? p.company_name.toLowerCase().replace(/[^a-z]+/g, "_").replace(/^_|_$/g, "") || "partner_" + p.id : null;
    p.show_in_app = p.id % 5 !== 3;
    p.activated_by = p.active === "waiting" ? null : { name: "Super Admin" };
    p.activated_at = p.active === "waiting" ? null : date(int(1, 10), int(1, 28));
    p.settings = {
      allow_booking_online_payment: 1, allow_public_event_online_payment: p.id % 2, allow_multi_booking_online_payment: 1,
      allow_tax: 1, max_units_count: 10 + (p.id % 5) * 5, allow_units_in_other_location: p.id % 3 === 0 ? 1 : 0,
      allow_membership_management: 1, allow_create_services: p.id % 2, allow_online_attendance: p.id % 4 === 1 ? 1 : 0,
      allow_create_promo_code: 1, allow_activity_log: p.id % 2, allow_manual_check_in: 1,
    };
    p.gallery = Array.from({ length: int(3, 8) }, (_, i) => ({ id: 400 + i, image: null, is_image: i !== 2, main_photo: i === 0 ? 1 : 0 }));
    const docs = ["Commercial Registration", "VAT Certificate", "Municipality Permit", "Civil Defense Certificate", "Bank Letter"];
    p.documents = docs.slice(0, int(2, 5)).map((n, i) => ({ id: 800 + i, file_name: n, file_path: "#", uploaded_by: { name: i % 2 ? "Super Admin" : p.owner_name || "Partner" }, uploaded_at: date(int(1, 10), int(1, 28)) }));
    p.notes = [
      { id: 1, comment: "Requested a higher unit limit for the new branch — approved by finance.", created_at: date(10, 3), comment_by: { name: "Mona (Ops)" },
        replies: [{ id: 11, comment: "Limit raised to 20.", created_at: date(10, 4), comment_by: { name: "Super Admin" } }] },
      { id: 2, comment: "Follow up on the missing VAT certificate.", created_at: date(9, 18), comment_by: { name: "Karim (Onboarding)" }, replies: [] },
    ];
    const branchNames = ["Main Branch", "North Branch", "Corniche Branch"].slice(0, int(1, 3));
    p.branches = branchNames.map((name, i) => ({ id: 60 + i, name }));
    p.employees = ["Ahmed Saeed", "Noura Ali", "Fahad Omar", "Laila Hassan", "Sami Khaled"].slice(0, int(2, 5)).map((name, i) => ({
      id: 900 + i, name, image: null, phone: "+966 5" + int(1000000, 9999999), email: name.toLowerCase().replace(" ", ".") + "@" + (p.email.split("@")[1] || "partner.com"),
      units_assigned_count: int(0, 4), active: i % 4 === 3 ? 0 : 1, created_at: date(int(1, 10), int(1, 28)),
    }));
    p.contacts = ["Front Desk", "Bookings Line", "Manager on duty"].slice(0, int(1, 3)).map((name, i) => ({ id: 950 + i, name, image: null, phone: "+966 1" + int(1000000, 9999999), units_count: int(1, 3), created_at: date(int(1, 10), int(1, 28)) }));
    p.qr = {
      scan_type: p.settings.allow_manual_check_in ? "manual" : "automatic",
      branches: p.branches.map((b, i) => ({
        branch_id: b.id, branch_name: b.name,
        barcode_settings: { check_in_mode: i % 2 ? "confirmation" : "immediate", check_in_before_session_start: 15, check_in_before_session_start_type: "minute",
          grace_after_session_start: i % 2 ? 0 : 10, grace_after_session_start_type: "minute", check_in_after_session_end: 1, check_in_after_session_end_type: "hour" },
        employees: p.employees.slice(0, 2 + i).filter((_, k) => (k + i) % 3 !== 2).map((e, k) => ({ id: e.id, name: e.name, image: null,
          validate_qr_units: [{ id: 1, name: "Court 1" }], perform_qr_units: k % 2 ? null : [{ id: 1, name: "Court 1" }, { id: 2, name: "Court 2" }], view_scan_history_units: k ? [{ id: 1, name: "Court 1" }] : null })),
      })),
    };
  }

  /* ---------- shared view helpers ---------- */
  function card(title, actions, body, extra) {
    return `<section class="card card--pad animate-in stack gap-4" ${extra || ""}>
      <div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${title}</h3><div class="row gap-2">${actions || ""}</div></div>
      ${body}</section>`;
  }
  /* label | value pairs (redesign 2026-11-17): each pair is a compact field — a small
     label over its value — laid out in a grid, so on a wide card the value sits right
     under its label instead of a screen-width away from it. Labels lose a trailing ":". */
  function kv(rows) {
    return `<dl style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));gap:var(--space-5) var(--space-6);margin:0">${rows.filter(Boolean).map((r) =>
      `<div style="min-width:0"><dt class="t-xs text-tertiary" style="margin-bottom:var(--space-1)">${String(r[0]).replace(/\s*:\s*$/, "")}</dt><dd style="margin:0;font-size:var(--text-sm);font-weight:var(--weight-semibold);overflow-wrap:anywhere">${r[1] == null || r[1] === "" ? "---" : r[1]}</dd></div>`).join("")}</dl>`;
  }
  /* Display a raw data word: known API values get their EN / AR label ("coming" →
     "Coming" / "قادم"); anything else is just capitalised ("padel" → "Padel"). */
  const WORDS = {
    onsite: ["Onsite", "حضوري"], main: ["Main", "رئيسي"], part: ["Part", "جزء"], available: ["Available", "متاحة"], maintenance: ["Maintenance", "تحت الصيانة"],
    completed: ["Completed", "مكتمل"], rejected: ["Rejected", "مرفوض"], booking: ["Booking", "حجز"], payment: ["Payment", "دفع"],
    "wallet fund": ["Wallet fund", "إيداع في المحفظة"], "booking payment": ["Booking payment", "دفع حجز"], "booking refund": ["Booking refund", "استرداد حجز"],
    "public event payment": ["Public event payment", "دفع حدث عام"], "multi booking payment": ["Multi-booking payment", "دفع حجز متعدد"], "cash out": ["Cash out", "سحب نقدي"],
    coming: ["Coming", "قادم"], ended: ["Ended", "انتهى"], canceled: ["Cancelled", "ملغي"], cancelled: ["Cancelled", "ملغي"],
    pending: ["Pending", "معلق"], active: ["Active", "نشط"], inactive: ["Inactive", "غير نشط"], requested: ["Requested", "مطلوب"],
    expired: ["Expired", "منتهي"], frozen: ["Frozen", "مجمّد"], upgraded: ["Upgraded", "تمت ترقيته"],
    male: ["Male", "ذكر"], female: ["Female", "أنثى"], both: ["Both", "كلاهما"],
    online: ["Online", "عبر الإنترنت"], cash: ["Cash", "نقدي"], manual: ["Manual", "يدوي"], linked: ["Linked", "مرتبط"], normal: ["Normal", "عادي"],
    partners: ["Partners", "شركاء"], geographic: ["Geographic", "جغرافي"], fixed: ["Fixed", "مبلغ ثابت"], percentage: ["Percentage", "نسبة مئوية"],
    "online booking": ["Online booking", "حجز إلكتروني"], "manual booking": ["Manual booking", "حجز يدوي"], "linked booking": ["Linked booking", "حجز مرتبط"],
    "public event": ["Public event", "حدث عام"], "walk-in sale": ["Walk-in sale", "بيع مباشر"], "package subscription": ["Package subscription", "اشتراك باقة"],
    renewal: ["Renewal", "تجديد"], extension: ["Extension", "تمديد"],
    created: ["Created", "تم الإنشاء"], updated: ["Updated", "تم التحديث"], deleted: ["Deleted", "تم الحذف"], blocked: ["Blocked", "محظور"],
    bookings: ["Bookings", "الحجوزات"], units: ["Units", "الوحدات"], customers: ["Customers", "العملاء"], coupons: ["Coupons", "الكوبونات"],
    operations: ["Operations", "التشغيل"], people: ["People", "الأشخاص"], marketing: ["Marketing", "التسويق"],
    "fixed slots": ["Fixed slots", "مواعيد ثابتة"], "flexible schedule": ["Flexible schedule", "جدول مرن"], "multi booking": ["Multi booking", "حجز متعدد"],
  };
  const cap = (v) => {
    if (v == null || v === "") return v;
    const w = WORDS[String(v).trim().toLowerCase()];
    return w ? L(w[0], w[1]) : String(v).charAt(0).toUpperCase() + String(v).slice(1);
  };
  const btn = (label, icon, attrs, kind) => `<button type="button" class="btn btn--sm${kind ? " btn--" + kind : ""}" ${attrs || ""}>${icon ? ic(icon) : ""}<span>${label}</span></button>`;
  const yesNo = (v) => (v ? L("Yes", "نعم") : L("No", "لا"));
  const onOff = (v) => (v ? `<span class="badge badge--success">${L("On", "مفعل")}</span>` : `<span class="badge">${L("Off", "غير مفعل")}</span>`);
  const initials = (s) => (s || "?").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const avatar = (name, size) => `<span class="avatar${size ? " avatar--" + size : " avatar--sm"}">${esc(initials(name))}</span>`;
  const confirmDelete = (title, body, onOk) => {
    const el = SA.modal({ id: "ppConfirm", title, body: `<p class="t-sm text-secondary">${body}</p>`,
      foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn btn--danger" data-ok>${L("Confirm", "تأكيد")}</button>` });
    el.querySelector("[data-ok]").onclick = () => { SA.close(el); onOk(); };
  };
  const backBtn = (href) => `<a class="btn btn--sm btn--secondary" href="${href}">${ic(document.documentElement.dir === "rtl" ? "chevronRight" : "chevronLeft")}<span>${L("Back", "رجوع")}</span></a>`;
  /* Status badge shared by Public Events / Bookings / Multi-Bookings lists:
     coming → success, ended → primary, everything else → danger (raw text). */
  const sessionStatus = (s) => `<span class="badge badge--${s === "coming" ? "success" : s === "ended" ? "primary" : "danger"}">${esc(cap(s))}</span>`;

  /* Filter Options popover shared by every profile tab filter.
     fields: [{ key, label:[en,ar], type:"select"|"checks"|"date"|"month"|"year", options:(draft)=>[[value,label]] }]
     onApply(draft) gets the chosen values; resetApplies=true re-queries on Reset
     (the dashboard differs per screen — some Resets only clear the fields). */
  function filterPop(trigger, o) {
    let pop = document.getElementById("ppFilterPop");
    if (pop && pop.classList.contains("is-open") && pop._trigger === trigger) { pop.classList.remove("is-open"); return; }
    if (!pop) { pop = document.createElement("div"); pop.id = "ppFilterPop"; pop.className = "popover"; pop.setAttribute("role", "dialog"); document.body.appendChild(pop); }
    pop._trigger = trigger;
    pop.style.cssText = "width:min(" + (o.width || 320) + "px, calc(100vw - 16px));max-height:520px;overflow-x:hidden;overflow-y:auto";
    let draft = JSON.parse(JSON.stringify(o.value || {}));
    const ALL = L("All", "الكل");
    const control = (fl) => {
      const v = draft[fl.key];
      const opts = typeof fl.options === "function" ? fl.options(draft) : fl.options || [];
      if (fl.type === "checks") return `<div class="stack gap-1" style="max-height:132px;overflow:auto">${opts.map((x) => `<label class="check"><input type="checkbox" data-m="${fl.key}" value="${esc(x[0])}" ${(v || []).includes(String(x[0])) ? "checked" : ""}><span class="check__box">${ic("check")}</span>${esc(x[1])}</label>`).join("") || `<span class="t-xs text-tertiary">---</span>`}</div>`;
      if (fl.type === "date" || fl.type === "month") return `<input class="input" type="${fl.type}" data-f="${fl.key}" value="${esc(v || "")}">`;
      if (fl.type === "agerange") return `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-2)"><input class="input" type="number" min="1" data-f="min_age" value="${esc(draft.min_age || "")}" placeholder="${L("Min year", "الحد الأدنى للعمر")}"><input class="input" type="number" min="1" data-f="max_age" value="${esc(draft.max_age || "")}" placeholder="${L("Max year", "الحد الأقصى للعمر")}"></div>`;
      if (fl.type === "range") return `<div style="display:grid;grid-template-columns:auto minmax(0,1fr);gap:var(--space-2) var(--space-3);align-items:center"><span class="t-xs text-tertiary">${L("From", "من")}</span><input class="input" style="min-width:0;width:100%" type="${fl.input || "date"}" data-f="${fl.key}_from" value="${esc(draft[fl.key + "_from"] || "")}" ${draft[fl.key + "_to"] ? `max="${esc(draft[fl.key + "_to"])}"` : ""} aria-label="${L("From", "من")}"><span class="t-xs text-tertiary">${L("To", "إلى")}</span><input class="input" style="min-width:0;width:100%" type="${fl.input || "date"}" data-f="${fl.key}_to" value="${esc(draft[fl.key + "_to"] || "")}" ${draft[fl.key + "_from"] ? `min="${esc(draft[fl.key + "_from"])}"` : ""} aria-label="${L("To", "إلى")}"></div>`;
      return SA.select([["", ALL, !v]] /* the dashboard's selects open on an explicit "All" */.concat(opts.map((x) => [x[0], x[1], String(v || "") === String(x[0])])), `data-f="${fl.key}" ${fl.disabled && fl.disabled(draft) ? "disabled" : ""}`);
    };
    const paint = () => {
      pop.innerHTML = `<div class="popover__title">${L("Filter options", "خيارات التصفية")}</div>
        <div class="popover__body stack gap-3">${o.fields.map((fl) => SA.field(fl.label, control(fl))).join("")}</div>
        <div class="popover__foot"><button type="button" class="btn btn--sm btn--secondary" data-reset>${L("Reset", "إعادة تعيين")}</button><button type="button" class="btn btn--sm" data-apply>${L("Apply", "تطبيق")}</button></div>`;
    };
    pop.onchange = (e) => {
      const m = e.target.dataset.m, k = e.target.dataset.f;
      if (m) { const s = new Set(draft[m] || []); e.target.checked ? s.add(e.target.value) : s.delete(e.target.value); draft[m] = [...s]; return; }
      if (!k) return;
      draft[k] = e.target.value;
      (o.cascade || {})[k] && o.cascade[k].forEach((c) => (draft[c] = ""));
      paint();
    };
    pop.onclick = (e) => {
      if (e.target.closest("[data-reset]")) { draft = {}; paint(); if (o.resetApplies) { o.onApply({}); pop.classList.remove("is-open"); } }
      if (e.target.closest("[data-apply]")) { o.onApply(draft); pop.classList.remove("is-open"); }
    };
    paint();
    SA.popover(pop, trigger);
  }
  const filterBtn = (count) => `<button type="button" class="btn btn--sm btn--secondary" data-filter aria-haspopup="dialog">${ic("sliders")}<span>${L("Filter", "تصفية")}</span>${count ? ` <span class="badge badge--primary">${count}</span>` : ""}</button>`;

  /* Status filter as registry stat-tiles (redesign 2026-11-17) — replaces a row of
     status pills: [{ key, label:[en,ar], icon, count, tone }] → buttons with
     data-tile + aria-pressed. Tones reuse the status tokens the badges use. */
  const TONE = { warning: ["--color-warning-subtle", "--color-warning"], primary: ["--color-primary-subtle", "--color-primary-ink"], success: ["--color-success-subtle", "--color-success"], danger: ["--color-danger-subtle", "--color-danger"], info: ["--color-info-subtle", "--color-info"], "": ["--color-surface-sunken", "--color-text-secondary"] };
  const tiles = (items, active) => `<div class="stat-strip" role="group" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">${items.map((t) => {
    const on = t.key === active, tn = TONE[t.tone || ""];
    return `<button type="button" class="stat-tile${on ? " is-active" : ""}" aria-pressed="${on}" data-tile="${esc(t.key)}">
      <span class="kpi-ic" style="background:var(${tn[0]});color:var(${tn[1]});box-shadow:none">${ic(t.icon)}</span>
      <span class="stat-tile__txt"><span class="stat-tile__val" style="font-variant-numeric:tabular-nums">${SA.fmt(t.count)}</span><span class="stat-tile__label">${esc(SA.T(t.label))}</span></span></button>`;
  }).join("")}</div>`;

  return { filterPop, filterBtn, tabs, extend, card, kv, btn, yesNo, onOff, avatar, initials, confirmDelete, backBtn, sessionStatus, rng, tiles, cap };
})();
