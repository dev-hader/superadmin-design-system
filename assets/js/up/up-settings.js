/* Unit profile — settings (general · age groups · taxes) and financial
   (default + scheduled + logs). Mirrors pages/units/profile/{settings,
   financial}. Registers on UP.tabs; card/kv/btn helpers come from pp-core.js.
   Demo flag: …&tab=settings&sec=taxes&demo=nolocation — a unit without state / city
   shows "There is no state data" / "There is no city data".
   Permissions (job keys, as the dashboard): settings General + Taxes view_unit_settings
   (GeneralSettings.js / TaxesSettings.js — NotHavePermissions beside the side nav), General
   Edit update_unit_settings; the Age groups nav item + section view_age_groups
   (SettingsNav.js / AgeGroupsSettings.js); the age-group switches need update_age_groups
   — DISABLED (not hidden) without it (AgeGroupsTable.js). Tax switches: not gated.
   Financial view_unit_financials (FinancialPage.js / LogsPage.js); edit (default +
   scheduled) update_unit_financials, New add_unit_financials, delete delete_unit_financials
   (FinancialPage.js / ScheduledTable.js); Logs and View are not gated. */
(function () {
  "use strict";
  const { L, esc, ic, badge } = SA;
  const { card, kv, btn, confirmDelete } = PP;
  const UP = (window.UP = window.UP || { tabs: {} });
  const ok = (el, fn) => (el.querySelector("[data-ok]").onclick = fn);
  const errLine = (m) => `<span class="field__error">${ic("warn")} ${m}</span>`;
  /* job permissions (RD.can — shell.js; ?perm=limited | none demo) */
  const can = (k) => !window.RD || !RD.can || RD.can(k);
  const P = (k) => `data-perm="${k}"`;
  const onOff = (v) => (v === 1 ? `<span class="badge badge--success">${L("On", "مفعّل")}</span>` : `<span class="badge">${L("Off", "غير مفعّل")}</span>`);

  function data(u) {
    if (u._set) return u._set;
    const i = u.id % 7;
    u._set = {
      general: { allow_highfive_user_public_events: i % 2 ? 1 : 0, allow_mix_gender_public_event: i % 3 ? 0 : 1, allow_multi_booking: i % 2 ? 1 : 0, max_capacity_for_multi_booking: 4 + i, allow_flexible_slots: i % 4 === 1 ? 1 : 0, min_session_length_in_minutes: 60, max_session_length_in_minutes: 180, min_users_no: 2, max_users_no: 10 + i * 2 },
      taxes: {
        country: [{ id: 1, name: "VAT", tax: 15 }, { id: 2, name: "Municipality fee", tax: 2.5 }],
        state: [{ id: 11, name: "Regional tourism levy", tax: 1 }],
        city: [],
        assigned: new Set([1]),
      },
      ageGroups: [["Kids", 4, 12], ["Teens", 13, 17], ["Adults", 18, 59], ["Seniors", 60, 90]].map((a, k) => ({ id: 30 + k, name: a[0], starting_age: a[1], ending_age: a[2], description: `${a[0]} sessions`, created_at: "2026-03-0" + (k + 1) + " 10:00:00", assigned: k < 3 })),
      fin: {
        currency: { code: u.partner && /EG/.test(u.partner.company_name) ? "EGP" : "SAR" },
        default: { id: 1, name: "", online_booking: { online: { percent: 10, fixed: 2 }, cash: { percent: 5, fixed: 0 } }, walk_in_booking: { percent: 0, fixed: 3 }, linked_booking: { percent: 4, fixed: 0 }, public_event: { online: { percent: 12, fixed: 0 }, cash: { percent: 6, fixed: 0 } },
          logs: [{ admin: { name: "Super Admin" }, date: "2026-06-01 09:12:00" }, { admin: { name: "Mona (Finance)" }, date: "2026-02-14 11:40:00" }] },
        scheduled: [
          { id: 21, name: "Ramadan campaign", start_at: "2027-02-18 00:00:00", end_at: "2027-03-19 23:59:00", status: "upcoming", online_booking: { online: { percent: 6, fixed: 0 }, cash: { percent: 3, fixed: 0 } }, walk_in_booking: { percent: 0, fixed: 2 }, linked_booking: { percent: 2, fixed: 0 }, public_event: { online: { percent: 8, fixed: 0 }, cash: { percent: 4, fixed: 0 } }, logs: [{ admin: { name: "Super Admin" }, date: "2026-11-01 10:00:00" }] },
          { id: 20, name: "Summer 2026", start_at: "2026-06-01 00:00:00", end_at: "2026-08-31 23:59:00", status: "expired", online_booking: { online: { percent: 8, fixed: 1 }, cash: { percent: 4, fixed: 0 } }, walk_in_booking: { percent: 0, fixed: 2 }, linked_booking: { percent: 3, fixed: 0 }, public_event: { online: { percent: 10, fixed: 0 }, cash: { percent: 5, fixed: 0 } }, logs: [{ admin: { name: "Super Admin" }, date: "2026-05-20 08:30:00" }] },
        ],
      },
    };
    /* each log carries the rates saved at that time (GET /units/{id}/financial/{fid}/logs → logs[].data) */
    [u._set.fin.default].concat(u._set.fin.scheduled).forEach((rec) => rec.logs.forEach((lg, k) => {
      const d = snap(rec);
      if (k) [d.online_booking.online, d.online_booking.cash, d.public_event.online, d.public_event.cash].forEach((o) => (o.percent = Math.max(0, o.percent - k * 2)));
      lg.data = d;
    }));
    return u._set;
  }
  const snap = (r) => JSON.parse(JSON.stringify({ online_booking: r.online_booking, walk_in_booking: r.walk_in_booking, linked_booking: r.linked_booking, public_event: r.public_event }));

  /* ================= settings (side nav: general · age groups · taxes) ================= */
  UP.tabs.settings = (mount, ctx) => {
    const u = ctx.unit, s = data(u);
    const sec = ctx.params.get("sec") || "general";
    const nav = `<nav class="sa-side__nav" aria-label="${L("Settings", "الإعدادات")}">${[["general", L("General", "عام")], ["age-groups", L("Age groups", "الفئات العمرية")], ["taxes", L("Taxes", "الضرائب")]]
      .map(([k, t]) => `<a href="${UP.href("settings", { sec: k })}" class="${k === sec ? "is-active" : ""}"${k === "age-groups" ? " " + P("view_age_groups") : ""}>${t}</a>`).join("")}</nav>`;
    const wrap = (inner) => (mount.innerHTML = `<div class="sa-side">${nav}<div class="stack gap-6">${inner}</div></div>`);
    const g = s.general;
    /* the section's own key missing → NotHavePermissions next to the side nav */
    if (!can(sec === "age-groups" ? "view_age_groups" : "view_unit_settings")) return wrap(RD.noPermission());

    if (sec === "general") {
      const paint = () => {
        wrap(card(L("General settings", "الإعدادات العامة"), btn(L("Edit", "تعديل"), "edit", `data-edit ${P("update_unit_settings")}`, "secondary"), `<div class="data-table-scroll"><table class="data-table"><tbody>
          ${[[L("HighFive users public events:", "أحداث المستخدمين العامة:"), onOff(g.allow_highfive_user_public_events), L("Allow to create online public events for HighFive app users in approved units", "السماح بإنشاء أحداث عامة عبر الإنترنت لمستخدمي التطبيق في الوحدات المعتمدة")],
            [L("Mixed gender public event:", "الحدث العام المختلط:"), onOff(g.allow_mix_gender_public_event), L("Allow to create mixed gender public event", "السماح بإنشاء حدث عام مختلط")],
            [L("Min/max session length", "الحد الأدنى/الأقصى لمدة الجلسة"), `<b>${g.min_session_length_in_minutes || 0}M / ${g.max_session_length_in_minutes || 0}M</b>`, L("Set the minimum and maximum duration of session in this unit", "تعيين الحد الأدنى والأقصى لمدة الجلسة في هذه الوحدة")],
            [L("Number of users", "عدد المستخدمين"), `<b>${g.min_users_no ?? "—"} / ${g.max_users_no ?? "—"}</b>`, L("Minimum and maximum number of users", "الحد الأدنى والأقصى لعدد المستخدمين")],
            [L("Multi booking:", "الحجز المتعدد:"), onOff(g.allow_multi_booking), L("Allows partners to create sessions with multi-booking configuration", "يسمح للشركاء بإنشاء جلسات مع تكوين الحجز المتعدد")],
          ].map((r) => `<tr><td style="width:300px"><b>${r[0]}</b></td><td>${r[1]}</td><td><span class="row gap-2 t-sm text-tertiary" style="align-items:flex-start"><span style="flex-shrink:0">${ic("info")}</span>${r[2]}</span></td></tr>`).join("")}
          ${g.allow_multi_booking === 1 ? `<tr><td style="padding-inline-start:var(--space-8)">${L("Max capacity", "الحد الأقصى للسعة")}</td><td><b>${g.max_capacity_for_multi_booking}</b></td><td></td></tr>` : ""}
          <tr><td><b>${L("Flexible slot session:", "جلسة الفتحات المرنة:")}</b></td><td>${onOff(g.allow_flexible_slots)}</td><td><span class="row gap-2 t-sm text-tertiary"><span>${ic("info")}</span>${L("Allows partners to create sessions with flexible time slots", "يسمح للشركاء بإنشاء جلسات مع فتحات زمنية مرنة")}</span></td></tr>
          </tbody></table></div>`));
        mount.querySelector("[data-edit]").onclick = edit;
      };
      function edit() {
        const d = Object.assign({}, g);
        const hrs = (k) => SA.select(Array.from({ length: 25 }, (_, h) => [h, `${h} ${L("hr", "ساعة")}`, Math.floor((d[k] || 0) / 60) === h]), `data-h="${k}"`);
        const mins = (k) => SA.select([[0, `0 ${L("min", "دقيقة")}`, (d[k] || 0) % 60 === 0], [30, `30 ${L("min", "دقيقة")}`, (d[k] || 0) % 60 !== 0]], `data-m="${k}"`);
        const sw = (k, label) => `<div class="sa-formrow"><label class="field__label">${label}</label><label class="switch"><input type="checkbox" data-s="${k}" ${d[k] === 1 ? "checked" : ""} aria-label="${label}"><span class="switch__track"></span></label></div>`;
        const body = () => `<div class="stack gap-4">
          ${sw("allow_highfive_user_public_events", L("HighFive users public events:", "أحداث المستخدمين العامة:"))}
          ${sw("allow_mix_gender_public_event", L("Mixed gender public event:", "الحدث العام المختلط:"))}
          <div class="sa-formrow"><label class="field__label">${L("Min session length:", "الحد الأدنى لمدة الجلسة:")}</label><div class="grid grid-2">${hrs("min_session_length_in_minutes")}${mins("min_session_length_in_minutes")}</div></div>
          <div class="sa-formrow"><label class="field__label">${L("Max session length:", "الحد الأقصى لمدة الجلسة:")}</label><div class="grid grid-2">${hrs("max_session_length_in_minutes")}${mins("max_session_length_in_minutes")}</div></div>
          <div class="sa-formrow"><label class="field__label">${L("Number of users", "عدد المستخدمين")}</label><div><div class="grid grid-2"><input class="input" data-n="min_users_no" value="${d.min_users_no ?? ""}" placeholder="${L("Min users", "الحد الأدنى للمستخدمين")}"><input class="input" data-n="max_users_no" value="${d.max_users_no ?? ""}" placeholder="${L("Max users", "الحد الأقصى للمستخدمين")}"></div><div data-e="users"></div></div></div>
          ${sw("allow_multi_booking", L("Multi booking:", "الحجز المتعدد:"))}
          ${d.allow_multi_booking === 1 ? `<div class="sa-formrow"><label class="field__label">${L("Max capacity", "الحد الأقصى للسعة")}</label><div><input class="input" data-n="max_capacity_for_multi_booking" value="${d.max_capacity_for_multi_booking ?? ""}" placeholder="${L("Enter max capacity", "أدخل الحد الأقصى للسعة")}"><div data-e="cap"></div></div></div>` : ""}
          ${sw("allow_flexible_slots", L("Flexible slot session:", "جلسة الفتحات المرنة:"))}</div>`;
        const el = SA.modal({ id: "upSet", wide: true, title: L("Update settings", "تحديث الإعدادات"), body: body(),
          foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${L("Update", "تحديث")}</button>` });
        const b = el.querySelector(".modal__body");
        b.onchange = (e) => {
          const t = e.target;
          if (t.dataset.s) { d[t.dataset.s] = t.checked ? 1 : 0; if (t.dataset.s === "allow_multi_booking") { if (!t.checked) d.max_capacity_for_multi_booking = null; b.innerHTML = body(); } }
          if (t.dataset.h || t.dataset.m) { const k = t.dataset.h || t.dataset.m; const h = +b.querySelector(`[data-h="${k}"]`).value, m = +b.querySelector(`[data-m="${k}"]`).value; d[k] = h * 60 + m; }
        };
        b.oninput = (e) => { if (e.target.dataset.n) d[e.target.dataset.n] = e.target.value; };
        ok(el, () => {
          const num = (v) => /^\d+$/.test(String(v ?? ""));
          const e1 = el.querySelector('[data-e="users"]'), e2 = el.querySelector('[data-e="cap"]');
          e1.innerHTML = ""; if (e2) e2.innerHTML = "";
          let bad = false;
          if (d.min_users_no === "" || d.max_users_no === "" || d.min_users_no == null || d.max_users_no == null) { e1.innerHTML = errLine(L("This field is required", "هذا الحقل مطلوب")); bad = true; }
          else if (!num(d.min_users_no) || !num(d.max_users_no)) { e1.innerHTML = errLine(L("Number is not valid", "الرقم غير صحيح")); bad = true; }
          if (d.allow_multi_booking === 1 && !num(d.max_capacity_for_multi_booking)) { e2.innerHTML = errLine(d.max_capacity_for_multi_booking ? L("Number is not valid", "الرقم غير صحيح") : L("This field is required", "هذا الحقل مطلوب")); bad = true; }
          if (bad) return;
          /* POST /units/{unitId}/update-settings */
          ["min_users_no", "max_users_no", "max_capacity_for_multi_booking"].forEach((k) => d[k] != null && d[k] !== "" && (d[k] = +d[k]));
          Object.assign(g, d); SA.close(el); paint();
        });
      }
      return paint();
    }
    if (sec === "age-groups") {
      const canAg = can("update_age_groups");
      const paint = () => wrap(card(L("Age group settings", "إعدادات الفئات العمرية"), "", SA.table({ rows: s.ageGroups, empty: ["No data", "لا توجد بيانات"], columns: [
        { head: ["Name", "الاسم"], cell: (a) => `<div class="cell-user"><span class="cell-thumb">${ic("users")}</span><div><b>${esc(a.name)}</b><div class="t-xs text-tertiary">${esc(a.created_at)}</div></div></div>` },
        { head: ["Starting age", "عمر البداية"], align: "center", cell: (a) => `${a.starting_age} ${L("year", "سنة")}` },
        { head: ["Ending age", "عمر النهاية"], align: "center", cell: (a) => `${a.ending_age} ${L("year", "سنة")}` },
        { head: ["Description", "الوصف"], align: "center", cell: (a) => esc(a.description) },
        { head: ["Actions", "الإجراءات"], align: "center", cell: (a) => `<label class="switch" style="position:relative${canAg ? "" : ";cursor:not-allowed;opacity:.55"}"${canAg ? "" : ` data-tip="${L("You don't have permission", "ليس لديك صلاحية")}"`}><input type="checkbox" data-ag="${a.id}" ${a.assigned ? "checked" : ""} ${canAg ? "" : "disabled"} aria-label="${esc(a.name)}"><span class="switch__track"></span></label>` },
      ] })));
      mount.onchange = (e) => { const id = e.target.dataset.ag; if (!id) return; /* POST /units/{id}/assign-age-groups {age_groups:[ids]} — saves on toggle */ s.ageGroups.find((a) => String(a.id) === id).assigned = e.target.checked; };
      return paint();
    }
    /* taxes: one section per location level (country · state · city) */
    const T = s.taxes;
    const level = (name, rows) => `<section class="stack gap-3"><h4 class="t-title">${L(`${esc(name)} taxes`, `ضرائب ${esc(name)}`)}</h4>${rows.length ? SA.table({ rows, empty: [""], columns: [
      { head: ["Name", "الاسم"], cell: (x) => `<b>${esc(x.name)}</b>` },
      { head: ["Tax", "الضريبة"], align: "center", cell: (x) => `${x.tax}%` },
      { head: ["Actions", "الإجراءات"], align: "center", cell: (x) => `<label class="switch" style="position:relative"><input type="checkbox" data-tx="${x.id}" ${T.assigned.has(x.id) ? "checked" : ""} aria-label="${esc(x.name)}"><span class="switch__track"></span></label>` },
    ] }) : `<p class="text-tertiary">${L("No taxes have been generated", "لم يتم إنشاء ضرائب")}</p>`}</section>`;
    /* TaxesSettings: a level the unit's location lacks shows its own empty line */
    const noLoc = ctx.params.get("demo") === "nolocation";
    const lvl = (geo, rows, empty) => (geo && geo.name ? level(geo.name, rows) : `<p class="text-tertiary">${empty}</p>`);
    wrap(card(L("Tax settings", "إعدادات الضرائب"), "", `<div class="stack gap-6">${lvl(u.loc.country, T.country, L("There is no country data", "لا توجد بيانات دولة"))}${lvl(noLoc ? null : u.loc.state, T.state, L("There is no state data", "لا توجد بيانات محافظة"))}${lvl(noLoc ? null : u.loc.city, T.city, L("There is no city data", "لا توجد بيانات مدينة"))}</div>`));
    mount.onchange = (e) => { const id = +e.target.dataset.tx; if (!id) return; /* POST /units/{id}/assign-taxes {country_taxes, state_taxes, city_taxes} — saves on toggle */ e.target.checked ? T.assigned.add(id) : T.assigned.delete(id); };
  };

  /* ================= financial (default · scheduled · logs) ================= */
  const pf = (o, cur) => `<div class="t-sm">${L("Pct", "النسبة")}: <b>${o && o.percent != null ? o.percent : 0} %</b></div><div class="t-sm">${L("Fixed", "ثابت")}: <b>${o && o.fixed != null ? o.fixed : 0} ${esc(cur)}</b></div>`;
  const block = (title, o, cur) => `<div class="stack gap-1" style="margin-bottom:var(--space-2)"><span class="t-xs text-tertiary" style="font-weight:var(--weight-semibold)">${title}</span>${pf(o, cur)}</div>`;
  const nowLocal = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };
  const OP = () => L("Online payment", "الدفع عبر الإنترنت"), CP = () => L("Cash payment", "الدفع نقداً");
  const rateCols = (cur) => [
    { head: ["Online booking:", "الحجز عبر الإنترنت:"], cell: (r) => block(OP(), r.online_booking.online, cur) + block(CP(), r.online_booking.cash, cur) },
    { head: ["Walk-in booking:", "الحجز المباشر:"], cell: (r) => block(CP(), r.walk_in_booking, cur) },
    { head: ["Linked booking:", "الحجز المرتبط:"], cell: (r) => block(CP(), r.linked_booking, cur) },
    { head: ["Online public event:", "الحدث العام عبر الإنترنت:"], cell: (r) => block(OP(), r.public_event.online, cur) + block(CP(), r.public_event.cash, cur) },
  ];
  UP.tabs.financial = (mount, ctx) => {
    const u = ctx.unit, F = data(u).fin, cur = F.currency.code;
    if (!can("view_unit_financials")) { mount.innerHTML = RD.noPermission(); return; }
    const logsId = ctx.params.get("logs");
    if (logsId) {
      const rec = logsId === "1" ? F.default : F.scheduled.find((x) => String(x.id) === logsId) || F.default;
      const nm = rec.name || L("Default", "الافتراضي");
      mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${L(`${esc(nm)} logs`, `سجلات ${esc(nm)}`)}</h3>
          <a class="btn btn--sm btn--secondary" href="${UP.href("financial")}">${ic(document.documentElement.dir === "rtl" ? "chevronRight" : "chevronLeft")}<span>${L("Back to financial", "العودة إلى المالية")}</span></a></div><div data-l></div>`;
      /* GET /units/{id}/financial/{fid}/logs — each row shows that log's own data snapshot */
      SA.list({ mount: mount.querySelector("[data-l]"), data: rec.logs.map((lg) => Object.assign({}, lg.data || snap(rec), { admin: lg.admin, date: lg.date })), empty: ["There is no data to display", "لا توجد بيانات للعرض"],
        columns: [{ head: ["Period:", "الفترة:"], cell: (r) => `${L("By", "بواسطة")} <b>${esc(r.admin.name)}</b><div class="t-xs text-tertiary">${esc(r.date)}</div>` }].concat(rateCols(cur)) });
      return;
    }
    const icons = (r, isDefault) => `<div class="row gap-1" style="flex-wrap:wrap;justify-content:center;max-width:90px">
      ${SA.iconBtn("edit", L("Edit", "تعديل"), `data-ed="${isDefault ? "default" : r.id}" ${P("update_unit_financials")}`)}
      <a class="icon-btn" href="${UP.href("financial", { logs: isDefault ? 1 : r.id })}" aria-label="${L("Logs", "سجلات")}" title="${L("Logs", "سجلات")}">${ic("clock")}</a>
      ${SA.iconBtn("eye", L("View", "عرض"), `data-vw="${isDefault ? "default" : r.id}"`)}
      ${isDefault ? "" : SA.iconBtn("trash", L("Delete scheduled", "حذف الجدولة"), `data-del="${r.id}" ${P("delete_unit_financials")}`)}</div>`;
    const paint = () => {
      mount.innerHTML = card(L("Default", "الافتراضي"), "", `<section class="data-table-wrap">${SA.table({ rows: [F.default], empty: [""], columns: rateCols(cur).concat([{ head: ["Actions", "الإجراءات"], align: "center", cell: (r) => icons(r, true) }]) })}</section>`)
        + `<div data-sched></div>`;
      const host = mount.querySelector("[data-sched]");
      host.innerHTML = `<div class="row between gap-3" style="align-items:center;margin-bottom:var(--space-3)"><h3 class="t-title">${L("Scheduled", "الجدولة")}</h3>${btn(L("New", "جديد"), "plus", `data-new ${P("add_unit_financials")}`)}</div><div data-l></div>`;
      SA.list({ mount: host.querySelector("[data-l]"), data: F.scheduled, empty: ["There is no data to display", "لا توجد بيانات للعرض"],
        columns: [{ head: ["Name:", "الاسم:"], cell: (r) => `<b>${esc(r.name)}</b><div class="t-xs text-tertiary">${esc(r.start_at)}</div><div class="t-xs text-tertiary">${esc(r.end_at)}</div>` }]
          .concat(rateCols(cur), [{ head: ["Actions", "الإجراءات"], align: "center", cell: (r) => icons(r, false) }]) });
    };
    const rec = (k) => (k === "default" ? F.default : F.scheduled.find((x) => String(x.id) === k));
    /* Add / Edit — same layout; default record hides Name + Period */
    function form(r, isDefault) {
      const v = r ? JSON.parse(JSON.stringify(r)) : { name: "", start_at: "", end_at: "", online_booking: { online: {}, cash: {} }, walk_in_booking: {}, linked_booking: {}, public_event: { online: {}, cash: {} } };
      const started = r && !isDefault && r.start_at && new Date(r.start_at.replace(" ", "T")) < new Date();
      const pair = (path, title) => {
        const o = path.reduce((a, k) => a[k], v);
        return `<div class="stack gap-2"><h5 class="t-sm" style="font-weight:var(--weight-semibold)">${title}</h5><div class="grid grid-2">
          <div class="input-affix"><input class="input" data-p="${path.join(".")}.percent" value="${o.percent ?? ""}" placeholder="${L("Pct", "النسبة")}"><span class="affix">%</span></div>
          <div class="input-affix"><input class="input" data-p="${path.join(".")}.fixed" value="${o.fixed ?? ""}" placeholder="${L("Fixed", "ثابت")}"><span class="affix">${esc(cur)}</span></div></div><div data-pe="${path.join(".")}"></div></div>`;
      };
      const body = `<div class="stack gap-5"><div data-top></div>
        ${isDefault ? "" : `<div class="stack gap-2"><h3 class="t-title">${L("Name:", "الاسم:")}</h3><input class="input" data-f="name" value="${esc(v.name)}" placeholder="${r ? esc(r.name) : L("Name", "الاسم")}"><div data-e="name"></div></div>
        <div class="stack gap-2"><h3 class="t-title">${L("Period:", "الفترة:")}</h3><div class="grid grid-2">
          <input class="input" type="datetime-local" data-f="start_at" min="${nowLocal()}" value="${v.start_at ? v.start_at.slice(0, 16).replace(" ", "T") : ""}" aria-label="${L("Start date", "تاريخ البداية")}" ${started ? "disabled" : ""}>
          <input class="input" type="datetime-local" data-f="end_at" min="${v.start_at ? v.start_at.slice(0, 16).replace(" ", "T") : nowLocal()}" value="${v.end_at ? v.end_at.slice(0, 16).replace(" ", "T") : ""}" aria-label="${L("End date", "تاريخ النهاية")}"></div>
          ${started ? `<p class="t-xs" style="color:var(--color-warning)">${L("The start date cannot be modified as it has already begun.", "لا يمكن تعديل تاريخ البداية لأنه قد بدأ بالفعل.")}</p>` : ""}<div data-e="period"></div></div>`}
        <div class="stack gap-3"><h3 class="t-title">${L("Online booking:", "الحجز عبر الإنترنت:")}</h3>${pair(["online_booking", "online"], OP())}${pair(["online_booking", "cash"], CP())}</div>
        <div class="stack gap-3"><h3 class="t-title">${L("Walk-in booking:", "الحجز المباشر:")}</h3>${pair(["walk_in_booking"], CP())}</div>
        <div class="stack gap-3"><h3 class="t-title">${L("Linked booking:", "الحجز المرتبط:")}</h3>${pair(["linked_booking"], CP())}</div>
        <div class="stack gap-3"><h3 class="t-title">${L("Online public event:", "الحدث العام عبر الإنترنت:")}</h3>${pair(["public_event", "online"], OP())}${pair(["public_event", "cash"], CP())}</div></div>`;
      const title = isDefault ? L("Edit default", "تعديل الافتراضي") : r ? `${L("Edit", "تعديل")} ${esc(r.name)}` : L("New scheduled", "جدولة جديدة");
      const el = SA.modal({ id: "upFin", wide: true, title, body,
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok ${r && r.status === "expired" ? "disabled" : ""}>${r ? L("Update", "تحديث") : L("Create", "إنشاء")}</button>` });
      /* date pickers: Start min = now (minDate new Date()), End min = Start */
      const sIn = el.querySelector('[data-f="start_at"]'), eIn = el.querySelector('[data-f="end_at"]');
      if (sIn && eIn) sIn.addEventListener("change", () => { eIn.min = sIn.value || nowLocal(); });
      ok(el, () => {
        let bad = false;
        el.querySelectorAll("[data-pe],[data-e]").forEach((x) => (x.innerHTML = ""));
        el.querySelectorAll("[data-p]").forEach((i) => {
          const parts = i.dataset.p.split("."), key = parts.pop(), o = parts.reduce((a, k) => a[k], v);
          o[key] = i.value === "" ? null : i.value;
        });
        /* per sub-group rules */
        [["online_booking", "online"], ["online_booking", "cash"], ["walk_in_booking"], ["linked_booking"], ["public_event", "online"], ["public_event", "cash"]].forEach((path) => {
          const o = path.reduce((a, k) => a[k], v), box = el.querySelector(`[data-pe="${path.join(".")}"]`);
          let m = "";
          if (o.percent == null && o.fixed == null) { if (!r) m = `<span class="t-xs" style="color:var(--color-warning)">${L("Please set at least one of percent or fixed", "يرجى تعيين واحد على الأقل من النسبة أو الثابت")}</span>`; }
          else if (o.percent != null && isNaN(+o.percent)) m = errLine(L("Percent must be a number", "يجب أن تكون النسبة رقماً"));
          else if (o.percent != null && (+o.percent < 0 || +o.percent > 100)) m = errLine(L("Percent must be between 0 and 100", "يجب أن تكون النسبة بين 0 و 100"));
          else if (o.fixed != null && isNaN(+o.fixed)) m = errLine(L("Fixed value must be a number", "يجب أن تكون القيمة الثابتة رقماً"));
          else if (o.fixed != null && +o.fixed < 0) /* 0 allowed — AddModal / EditModal reject only < 0 */ m = errLine(L("Fixed value must be greater than 0", "يجب أن تكون القيمة الثابتة أكبر من 0"));
          if (m) { box.innerHTML = m; if (m.includes("field__error") || !r) bad = true; }
        });
        if (!isDefault && !r) {
          const nm = el.querySelector('[data-f="name"]').value.trim(), s0 = el.querySelector('[data-f="start_at"]').value, e0 = el.querySelector('[data-f="end_at"]').value;
          if (!nm) { el.querySelector('[data-e="name"]').innerHTML = errLine(L("Name is required", "الاسم مطلوب")); bad = true; }
          else if (nm.length >= 100) { el.querySelector('[data-e="name"]').innerHTML = errLine(L("Name must be less than 101 characters", "يجب أن يكون الاسم أقل من 101 حرف")); bad = true; }
          const pe = el.querySelector('[data-e="period"]');
          if (!s0) { pe.innerHTML = errLine(L("Start date is required", "تاريخ البداية مطلوب")); bad = true; }
          else if (!e0) { pe.innerHTML = errLine(L("End date is required", "تاريخ النهاية مطلوب")); bad = true; }
          else if (e0 <= s0) { pe.innerHTML = errLine(L("End date must be after start date", "يجب أن يكون تاريخ النهاية بعد تاريخ البداية")); bad = true; }
          v.name = nm; v.start_at = s0.replace("T", " ") + ":00"; v.end_at = e0.replace("T", " ") + ":00";
        }
        if (bad) return (el.querySelector("[data-top]").innerHTML = `<div class="alert alert--danger"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${L("Please make sure that all fields are valid", "يرجى التأكد من أن جميع الحقول صحيحة")}</div></div>`);
        /* create: POST /units/{id}/financial · edit: POST /units/{id}/financial/{rid} (_method=put) */
        if (!r) F.scheduled.unshift(Object.assign(v, { id: Date.now(), status: "upcoming", logs: [{ admin: { name: "Super Admin" }, date: new Date().toISOString().slice(0, 19).replace("T", " "), data: snap(v) }] }));
        else { if (!isDefault) { const n = el.querySelector('[data-f="name"]').value.trim(); if (n) v.name = n; } const logs = r.logs; Object.assign(r, v); r.logs = logs; r.logs.unshift({ admin: { name: "Super Admin" }, date: new Date().toISOString().slice(0, 19).replace("T", " "), data: snap(r) }); }
        SA.close(el); paint();
      });
    }
    function view(r, isDefault) {
      SA.modal({ id: "upFinV", wide: true, title: isDefault ? L("Default", "الافتراضي") : esc(r.name),
        body: (isDefault ? "" : kv([[L("Period:", "الفترة:"), `${esc(r.start_at)} - ${esc(r.end_at)}`]])) + `<div class="data-table-scroll" style="margin-top:var(--space-4)">${SA.table({ rows: [r], empty: [""], columns: rateCols(cur) })}</div>`,
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button>` });
    }
    mount.addEventListener("click", (e) => {
      if (e.target.closest("[data-new]")) form(null, false);
      const ed = e.target.closest("[data-ed]"), vw = e.target.closest("[data-vw]"), del = e.target.closest("[data-del]");
      if (ed) form(rec(ed.dataset.ed), ed.dataset.ed === "default");
      if (vw) view(rec(vw.dataset.vw), vw.dataset.vw === "default");
      if (del) {
        const r = rec(del.dataset.del);
        const el = SA.modal({ id: "upFinD", title: `${L("Delete scheduled", "حذف الجدولة")} #${r.id} (${esc(r.name)})`,
          body: `<h5 class="t-sm" style="color:var(--color-danger);font-weight:var(--weight-semibold)">${L(`Are you sure you want to delete scheduled #${r.id}?`, `هل أنت متأكد من أنك تريد حذف الجدولة #${r.id}؟`)}</h5>`,
          foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${L("Confirm", "تأكيد")}</button>` });
        ok(el, () => { /* DELETE /units/{id}/financial/{rid} */ F.scheduled.splice(F.scheduled.indexOf(r), 1); SA.close(el); paint(); });
      }
    });
    paint();
  };
})();
