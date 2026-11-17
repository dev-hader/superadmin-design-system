/* Operations sample data (Public events · Joining list · Bookings · Multi-booking ·
   All comments). Every record is taken from the partners' own sessions
   (PP.ops in pp-ops.js), so the global lists, the partner/unit/user profiles
   and the views all show the same rows. */
(function () {
  "use strict";
  const OPS = (window.OPS = window.OPS || {});
  let cache = null;
  OPS.all = function () {
    if (cache) return cache;
    const events = [], bookings = [], multi = [];
    HF.SA.partners.forEach((p) => {
      PP.extend(p);
      const o = PP.ops(p);
      o.events.forEach((e, i) => {
        e.company_name = p.company_name; e._partner = p.id;
        e.app_type = p.is_independent && i % 3 === 0 ? ["highFive", "partner"] : ["highFive"];
        e.check_in_summary = e.status !== "ended" ? { checked_in: 0, total: e.joined_players } : { checked_in: Math.max(0, e.joined_players - (i % 3)), total: e.joined_players };
        events.push(e);
      });
      const cur = { code: p.country.iso === "EG" ? "EGP" : p.country.iso === "AE" ? "AED" : "SAR" };
      o.bookings.forEach((b, i) => {
        Object.assign(b, { company_name: p.company_name, _partner: p.id, currency: cur, is_flexible_slot: b.booking_type === "online" && i % 5 === 2,
          check_in_at: b.status === "ended" && i % 4 !== 3 ? `${b.date} ${b.start_time}` : null });
        bookings.push(b);
      });
      o.multi.forEach((m, i) => {
        Object.assign(m, { _partner: p.id, app_type: p.is_independent && i % 2 ? ["highFive", "partner"] : ["highFive"], max_tickets_per_user: 4, session_type: "normal", overnight: false, is_edited: i % 3 === 1 /* session edited after booking → "Edited" badge */,
          check_in_summary: m.status !== "ended" ? { checked_in: 0, total: m.booked_tickets } : { checked_in: Math.max(0, m.booked_tickets - 2), total: m.booked_tickets } });
        multi.push(m);
      });
    });
    const byNew = (a, b) => b.created_at.localeCompare(a.created_at);
    events.sort(byNew); bookings.sort(byNew); multi.sort(byNew);

    /* joining list = one row per player joining an event (GET /joining-list) */
    const users = HF.SA.users, joins = [];
    events.forEach((e, i) => {
      const p = HF.SA.partners.find((x) => x.id === e._partner);
      for (let k = 0; k < Math.min(e.joined_players, 3); k++) {
        const u = users[(i * 3 + k) % users.length], st = (i + k) % 7 === 5 ? "left" : (i + k) % 11 === 9 ? "removed" : "joined";
        const checked = e.status === "ended" && st === "joined" && k !== 2;
        joins.push({ id: 30000 + i * 10 + k, created_at: e.created_at, company: { id: p.id, name: p.company_name }, branch: { name: (p.branches[0] || {}).name || "Main Branch" }, unit: { name: e.unit_name },
          category: e.activity_category_name, activity: e.activity_name, start_at: `${e.date} ${e.start_time}`, end_at: `${e.date} ${e.end_time}`, age_group: e.age_group_name, gender: e.session_gender,
          user: { id: u.id, name: u.name, username: u.high_five_user_name }, status: st, status_date: e.date, joined_at: e.created_at.slice(0, 10),
          check_in_at: checked ? `${e.date} ${e.start_time}` : null, checked_by: checked ? "Ahmed Saeed" : null, method: checked ? (k ? "manual" : "qr") : null,
          public_event: { id: e.id, created_at: e.created_at, status: e.status === "ended" ? "past" : e.status }, price_per_user: e.price_per_user, currency: { code: p.country.iso === "EG" ? "EGP" : p.country.iso === "AE" ? "AED" : "SAR" }, _partner: p.id });
      }
    });
    cache = { events, bookings, multi, joins };
    return cache;
  };
  OPS.partnerOf = (row) => HF.SA.partners.find((p) => p.id === row._partner);

  /* bookings inside one multi-booking session (GET /multi-booking/{id} → bookers[]).
     Booking ids are session id × 10 + n, so /multi-booking/details/{bookingId} can find its session. */
  OPS.bookers = function (m) {
    if (m._bookers) return m._bookers;
    const users = HF.SA.users, out = [];
    let left = m.booked_tickets, k = 0;
    while (left > 0 && k < 9) {
      const u = users[(m.id + k * 5) % users.length], t = Math.min(left, 1 + ((m.id + k) % m.max_tickets_per_user));
      left -= t;
      const st = m.status === "canceled" ? "cancelled" : m.status === "ended" ? "ended" : k === 2 ? "pending" : "booked";
      out.push({ id: m.id * 10 + k, user: u, tickets: t, booking_time: `${String(9 + k).padStart(2, "0")}:15`, booking_date: m.created_at.slice(0, 10), total: +(t * +m.price_per_user * 1.15).toFixed(2), status: st, is_time_edited: k === 1,
        tickets_list: Array.from({ length: t }, (_, j) => ({ id: m.id * 100 + k * 10 + j, ticket_number: `T-${m.id}-${k + 1}${j + 1}`, holder_name: j ? `${u.name.split(" ")[0]} +${j}` : u.name,
          check_in_at: m.status === "ended" && j < t - (k % 2) ? `${m.date} ${m.start_time}` : null, checked_by: "Ahmed Saeed", checked_in_type: j % 2 ? "manual" : "qr" })) });
      k++;
    }
    m._bookers = out;
    return out;
  };
  /* the session a booking id belongs to */
  OPS.bookingInMulti = function (bookingId) {
    const D = OPS.all(), m = D.multi.find((x) => x.id === Math.floor(+bookingId / 10)) || D.multi[0];
    const b = OPS.bookers(m).find((x) => String(x.id) === String(bookingId)) || OPS.bookers(m)[0];
    return { m, b };
  };

  /* shared session Filter Options (dashboard FilterDropdown.js — one per list, same fields) */
  OPS.catFields = () => [
    { key: "category", label: ["Category", "الفئة"], placeholder: ["Select category", "اختر الفئة"], options: () => HF.SA.CATS.map((c) => [c.name, c.name]) },
    { key: "activity", label: ["Activity", "النشاط"], placeholder: ["Select activity", "اختر النشاط"], options: (d) => (d.category ? HF.SA.ACTS[(HF.SA.CATS.find((c) => c.name === d.category) || {}).id] || [] : []).map((a) => [a, a]) },
  ];
  OPS.genderField = () => ({ key: "gender", label: ["Session gender", "جنس الجلسة"], placeholder: ["Select session gender", "اختر جنس الجلسة"], options: () => [["male", SA.L("Male", "ذكر")], ["female", SA.L("Female", "أنثى")], ["both", SA.L("Both", "كلاهما")]] });
  OPS.ageField = () => ({ key: "age", label: ["Age group", "الفئة العمرية"], placeholder: ["Select age group", "اختر الفئة العمرية"], options: () => ["Kids", "Teens", "Adults"].map((a) => [a, a]) });
  OPS.sessionBadge = (s) => SA.badge(s === "coming" ? "success" : s === "ended" ? "primary" : "danger", PP.cap(s));

  /* ======================================================================
     Global page layer (redesign 2026-11-17) — the all-partners lists share
     partners.html's composition: a head with a live summary line, status
     stat tiles, one search + Filter bar, removable chips for the applied
     filters, and a read-only summary drawer on row click. Data, filters,
     columns' fields, actions and routes are unchanged.
     ====================================================================== */
  const esc = (s) => SA.esc(s);
  /* Head: title · breadcrumb · summary · actions (partners.html .pt-head) */
  OPS.head = function (mount, o) {
    const T = SA.T, title = SA.up1(T(o.title));
    const crumbs = [["Dashboard", "لوحة القيادة", "index.html"]].concat(o.crumbs || []);
    mount.innerHTML = `<div class="ops-head animate-in">
        <div style="min-width:0">
          <h1 class="t-h3">${esc(title)}</h1>
          <nav class="t-sm text-tertiary" aria-label="Breadcrumb" style="margin-top:var(--space-1)">${crumbs.map((c) => `<a href="${c[2]}" style="color:inherit">${esc(SA.L(c[0], c[1]))}</a>`).join(" › ")} › <span>${esc(title)}</span></nav>
          ${o.sub ? `<p class="t-sm text-secondary" style="margin-top:var(--space-1)">${o.sub}</p>` : ""}
        </div>
        ${o.actions ? `<div class="row gap-2" style="flex-wrap:wrap">${o.actions}</div>` : ""}
      </div>`;
  };

  /* Applied-filter chips + Filter button count for an SA.list.
     defs: [{ keys:[filter keys], label:[en,ar], value:(f)=>text, also:[keys cleared with it] }]
     Use: const fx = OPS.filters(defs); SA.list({ toolbarExtra: fx.toolbarExtra, after: fx.after, … }); fx.bind(mount, ctl). */
  OPS.range = (a, b) => `${a ? String(a).replace("T", " ") : "…"} → ${b ? String(b).replace("T", " ") : "…"}`;
  OPS.filters = function (defs) {
    let st = null;
    const on = (f) => defs.filter((d) => d.keys.some((k) => f[k] != null && String(f[k]) !== ""));
    return {
      toolbarExtra: (s) => { st = s; return PP.filterBtn(on(s.extra).length); },
      after: (root, extraAfter) => {
        if (st) {
          const list = on(st.extra);
          if (list.length) {
            const bars = root.querySelectorAll(".data-table-toolbar");
            bars[bars.length - 1].insertAdjacentHTML("afterend", `<div class="filterbar ops-chips">${list.map((d) => {
              const lab = SA.TS(d.label);
              return `<span class="filter-chip"><span class="filter-chip__key">${esc(lab)}</span><span class="filter-chip__op">${SA.L("is", "=")}</span><span class="filter-chip__val">${esc(d.value(st.extra))}</span><button type="button" class="filter-chip__x" data-unchip="${d.keys.concat(d.also || []).join(",")}" aria-label="${esc(SA.L("Remove", "إزالة") + " " + lab)}">${SA.ic("close")}</button></span>`;
            }).join("")}<button type="button" class="filterbar__clear" data-unchip="*">${SA.L("Clear all", "مسح الكل")}</button></div>`);
          }
        }
        if (extraAfter) extraAfter(root);
      },
      bind: (mount, ctl) => mount.addEventListener("click", (e) => {
        const un = e.target.closest("[data-unchip]");
        if (!un) return;
        if (un.dataset.unchip === "*") ctl.state.extra = {};
        else { const f = Object.assign({}, ctl.state.extra); un.dataset.unchip.split(",").forEach((k) => delete f[k]); ctl.state.extra = f; }
        ctl.state.page = 1; ctl.paint();
      }),
    };
  };
  /* chip value helpers */
  OPS.opt = (opts, v) => { const o = (typeof opts === "function" ? opts({}) : opts).find((x) => String(x[0]) === String(v)); return o ? o[1] : v; };

  /* Row → read-only summary drawer (partners.html peek). The row's first cell carries
     a [data-peek] button; clicking the row (not a link/button) or that button opens it.
     build(r) → { title, rows, href, open, perm } — perm = the job key the open link needs
     (the same key as the row's eye, e.g. view_booking_details); it hides with ?perm=none. */
  OPS.peek = function (mount, find, build) {
    mount.addEventListener("click", (e) => {
      const b = e.target.closest("[data-peek]");
      let id = b ? b.dataset.peek : null;
      if (!id) {
        const tr = e.target.closest("tbody tr");
        if (!tr || e.target.closest("a, button, input, select, label")) return;
        const p = tr.querySelector("[data-peek]");
        if (!p) return;
        id = p.dataset.peek;
      }
      const r = find(id);
      if (!r) return;
      const d = build(r);
      RD.openDrawer(d.title, d.rows, `<button class="btn btn--ghost" data-drawer-close>${SA.L("Close", "إغلاق")}</button>${d.href ? `<a class="btn" href="${d.href}"${d.perm ? ` data-perm="${esc(d.perm)}"` : ""}>${SA.ic("eye")}<span>${esc(d.open || SA.L("Open details", "فتح التفاصيل"))}</span></a>` : ""}`);
    });
  };
  OPS.peekId = (id, label) => `<button type="button" class="ops-id" data-peek="${esc(id)}">${esc(label)}</button>`;

  /* small cell helpers shared by the lists */
  OPS.two = (a, b) => `<div class="ops-two"><b>${a}</b>${b ? `<span class="t-xs text-tertiary">${b}</span>` : ""}</div>`;
  OPS.when = (date, s, e) => OPS.two(esc(date), `<span dir="ltr">${esc(s)}${e ? " – " + esc(e) : ""}</span>`);
  /* words = the check-in count wording (CheckInCount: "{a}/{b} checked in") */
  OPS.check = (a, b, words) => `<div class="ops-check"><span class="t-sm" style="font-weight:var(--weight-semibold);white-space:nowrap;font-variant-numeric:tabular-nums">${words ? SA.L(`${a}/${b} checked in`, `${a}/${b} سجّلوا الحضور`) : `${a}/${b}`}</span><span class="progress" style="width:72px;height:4px"><span class="progress__bar" style="width:${b ? Math.round((a / b) * 100) : 0}%"></span></span></div>`;
  OPS.appType = (arr) => arr.map((t) => `<span class="chip">${t === "highFive" ? SA.L("HighFive app", "تطبيق هاي فايف") : SA.L("Partner app", "تطبيق الشريك")}</span>`).join(" ");
  OPS.dash = (v) => (v == null || v === "" ? "---" : esc(PP.cap(v)));
  OPS.count = (n, en, ar) => SA.L(`${SA.fmt(n)} ${en}`, `${SA.fmt(n)} ${ar}`);
  /* date filters compare the day part only (inputs are YYYY-MM-DD) */
  OPS.inRange = (v, a, b) => { const d = String(v || "").slice(0, 10); return (!a || d >= a.slice(0, 10)) && (!b || d <= b.slice(0, 10)); };
})();
