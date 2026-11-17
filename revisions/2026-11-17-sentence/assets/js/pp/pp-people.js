/* Partner profile — people & money tabs: customers (high five · manual) ·
   memberships (members · categories · category units) · financials ·
   activity-log (+ detail) · coupons (list · view · usage details · new).
   Mirrors pages/partners/profile/{customers,memberships,financials,
   activity-log,marketing/coupons}.
   Permissions (job keys — data-perm, demo ?perm=limited | ?perm=none):
     customers · memberships: open (no key; their eyes too).
     financials: the tab needs view_partner_financials (partner-profile.html nav); row eye
       public event view_public_event_details · booking view_booking_details · multi booking
       view_booking_details|view_multi_booking_details (FinancialsTable: booking_type multi
       OR type booking) · package sale eye open (PackageFinancialRow).
     activity-log: view_partner_activity_log (nav) · detail eye open · View raw JSON
       view_activity_log_raw (shared ActivityLogDetailsBody, PERMISSIONS.EMPLOYEES).
     coupons: list + view view_promo_code · usage icon + usage page view_coupon_usages ·
       status edit update_promo_code · delete delete_promo_code · view eye open · ?new=1
       add_promo_code (CreatePage → NotHavePermissions) · usage eyes: Multi-sessions
       view_multi_booking_details, Bookings and Joining view_booking_details (DetailsPage gates
       every non-multi tab with view_booking_details). */
(function () {
  "use strict";
  const { L, esc, ic, badge, fmt } = SA;
  const { card, kv, btn, avatar, backBtn, confirmDelete, rng } = PP;
  const ok = (el, fn) => (el.querySelector("[data-ok]").onclick = fn);
  const listHead = (title, extra) => `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${title}</h3><div class="row gap-2">${extra || ""}</div></div>`;
  /* perm: optional dashboard job key(s) for the eye (data-perm) */
  const eye = (href, perm) => `<a class="icon-btn" href="${href}"${perm ? ` data-perm="${perm}"` : ""} aria-label="${L("View", "عرض")}">${ic("eye")}</a>`;
  const errLine = (m) => `<span class="field__error">${ic("warn")} ${m}</span>`;
  const NAMES = ["Omar Khalid", "Sara Nabil", "Yousef Adel", "Lama Fahad", "Hassan Ali", "Noor Sami", "Rami Tarek", "Dana Majed", "Khaled Saad", "Rana Hamed", "Ziad Fouad", "Huda Amin"];

  function people(p) {
    if (p._people) return p._people;
    const r = rng(p.id + 313), int = (a, b) => a + Math.floor(r() * (b - a + 1)), pick = (a) => a[Math.floor(r() * a.length)];
    const cats = ["Gold", "Silver", "Family"].map((n, i) => ({ id: 210 + i, name: n, units: int(1, 4) }));
    p._people = {
      customers: NAMES.map((n, i) => ({ id: 7000 + i, name: n, vie_id: `vie_${300 + i}`, phone: "+966 5" + int(1000000, 9999999), type: i % 4 === 3 ? "manual" : "high-five",
        upcoming: int(0, 4), past: int(0, 12), canceled: int(0, 2), ev_up: int(0, 2), ev_past: int(0, 5), ev_can: int(0, 1), blocked_from_booking: i % 5 === 2 ? 1 : 0, blocked_from_event: i % 7 === 3 ? 1 : 0 })),
      cats,
      members: NAMES.slice(0, 9).map((n, i) => ({ id: i, name: n, app_user_id: `vie_${300 + i}`, reference_number: `MB-${88100 + i}`, category_name: cats[i % 3].name, category_id: cats[i % 3].id, created_at: `2026-0${(i % 9) + 1}-1${i % 9} 10:00:00`, status: ["active", "active", "requested", "expired", "active"][i % 5], expired_at: i % 4 ? `2027-0${(i % 9) + 1}-01` : null })),
      logs: Array.from({ length: 14 }, (_, i) => ({ id: 61000 + i, created_at: `2026-11-${String(14 - (i % 14)).padStart(2, "0")} ${String(8 + (i % 12)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
        module: pick([{ value: "booking", label: "Bookings" }, { value: "unit", label: "Units" }, { value: "customer", label: "Customers" }, { value: "coupon", label: "Coupons" }]),
        action: pick([{ value: "created", label: "created" }, { value: "updated", label: "updated" }, { value: "deleted", label: "deleted" }, { value: "blocked", label: "blocked" }]),
        actor_type: i % 4 === 0 ? "system_employee" : "partner", performed_by: { name: i % 4 === 0 ? "Mona (Ops)" : pick(p.employees).name, role: i % 4 === 0 ? "Support" : "Receptionist", email: "staff@" + (p.email.split("@")[1] || "partner.com"), phone: "+966 50 000 0000" },
        record: { id: 500 + i, label: pick(["Booking #4821", "Padel Court 1", "Omar Khalid", "SUMMER10"]), exists: i % 6 !== 5 },
        /* a system employee working inside the partner's dashboard ("login as partner") */
        acting_as: i % 4 === 0 ? { name: p.owner_name || "---", company: p.company_name } : null })),
      coupons: ["SUMMER10", "WELCOME25", "PADEL50", "KIDSFREE", "RAMADAN15"].map((code, i) => ({ id: 330 + i, code, description: i % 2 ? "" : "Seasonal discount for HighFive users.", type: i % 3 === 2 ? "geographic" : "partners", discount_type: i % 2 ? "percentage" : "fixed", value: i % 2 ? 15 : 25,
        max_amount: i % 2 ? 50 : null, min_amount: 100, usage_limit: i % 3 ? 200 : null, usage_limit_per_user: i % 2 ? 1 : null, start_at: "2026-10-01 00:00", end_at: i === 4 ? "2026-10-31 23:59" : "2026-12-31 23:59",
        total_discount: [1250, 840, 0, 320, 2100][i], status: i === 4 ? "expired" : i === 3 ? "inactive" : "active", country_name: p.country.name,
        currency: p.country.iso === "EG" ? "EGP" : p.country.iso === "AE" ? "AED" : "SAR",
        /* GET /coupons/{id}: the coupon's own states, cities, users, partner, branches, units ([] → "---") */
        states: i % 2 ? [] : [{ id: p.state.id, name: p.state.name }], cities: i % 2 ? [] : [{ id: p.city.id, name: p.city.name }],
        users: i === 1 ? [{ name: NAMES[0], username: "vie_300" }, { name: NAMES[1], username: "vie_301" }] : [],
        partner_name: i % 3 === 2 ? null : p.company_name, branches: i === 0 ? p.branches.slice(0, 1).map((b) => ({ id: b.id, name: b.name })) : [], units: [], logs: [{ id: 1, admin: { name: "Super Admin" }, status: i === 3 ? "inactive" : "active", created_at: "2026-10-01 09:00" }] })),
    };
    return p._people;
  }

  /* ================= customers ================= */
  /* GET /partners/{id}/customers?partner_customer_type=high-five|manual&search=&page=&limit= */
  PP.tabs.customers = (mount, ctx) => {
    const d = people(ctx.partner).customers;
    const type = ctx.params.get("type") === "manual" ? "manual" : "high-five";
    const counts = { "high-five": d.filter((c) => c.type === "high-five").length, manual: d.filter((c) => c.type === "manual").length };
    const sub3 = L(" (Coming - past - canceled)", " (قادم - ماضي - ملغي)");
    mount.innerHTML = listHead(L("Customers", "العملاء"), `<div class="segmented">${[["high-five", L("High five", "هاي فايف")], ["manual", L("Manual", "يدوي")]].map(([k, t]) => `<a href="${PP.href("customers", { type: k })}" class="btn btn--sm ${k === type ? "" : "btn--ghost"}" style="${k === type ? "" : ""}">${t} (${counts[k]})</a>`).join("")}</div>`) + `<div data-l></div>`;
    /* the dashboard's colours are inverted on purpose here: blocked → primary, unblock → danger */
    const blk = (v) => (v === 1 ? badge("primary", L("Blocked", "محظور")) : badge("danger", L("Unblock", "غير محظور")));
    SA.list({ mount: mount.querySelector("[data-l]"), data: d.filter((c) => c.type === type), search: ["Search by name", "البحث بالاسم"], searchMatch: (r, q) => r.name.toLowerCase().includes(q), empty: ["There is no data to display", "لا توجد بيانات للعرض"],
      columns: type === "manual" ? [
        { head: ["Name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b>` },
        { head: ["Phone", "الهاتف"], cell: (r) => `<span dir="ltr">${esc(r.phone)}</span>` },
        { head: [`Booking${sub3}`, `الحجز${sub3}`], cell: (r) => `${r.upcoming} - ${r.past} - ${r.canceled}` },
      ] : [
        { head: ["Name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b><div class="t-xs text-tertiary">@${esc(r.vie_id)}</div>` },
        { head: [`Booking${sub3}`, `الحجز${sub3}`], cell: (r) => `${r.upcoming} - ${r.past} - ${r.canceled}` },
        { head: [`Public event${sub3}`, `الحدث العام${sub3}`], cell: (r) => `${r.ev_up} - ${r.ev_past} - ${r.ev_can}` },
        { head: ["Booking", "الحجز"], cell: (r) => blk(r.blocked_from_booking) },
        { head: ["Public event", "الحدث العام"], cell: (r) => blk(r.blocked_from_event) },
        { head: ["Actions", "الإجراءات"], cell: (r) => eye(`user-profile.html?id=${r.id}&tab=details`) },
      ] });
  };

  /* ================= memberships ================= */
  PP.tabs.memberships = (mount, ctx) => {
    const d = people(ctx.partner), sec = ctx.params.get("sec") || "members", cat = ctx.params.get("cat");
    const arrow = ic(document.documentElement.dir === "rtl" ? "chevronLeft" : "chevronRight");
    if (cat) {
      const c = d.cats.find((x) => String(x.id) === cat) || d.cats[0];
      const units = HF.SA.units.filter((u) => u.partner.id === ctx.partner.id).slice(0, c.units);
      /* MembershipCategoryUnitsTable.js: tone by the server label (pending warning · approved primary · else danger) */
      const tone = (x) => { const k = String((x && x.lable) || "").toLowerCase(); return k === "pending" ? "warning" : k === "approved" ? "primary" : "danger"; };
      mount.innerHTML = listHead(`${L("Units", "الوحدات")} (${esc(c.name)})`, backBtn(PP.href("memberships", { sec: "categories" }))) + `<div data-l></div>`;
      SA.list({ mount: mount.querySelector("[data-l]"), data: units, empty: ["There is no data to display", "لا توجد بيانات لعرضها"], columns: [
        { head: ["Name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { head: ["Category", "الفئة"], cell: (r) => esc(r.activity_category.name) },
        { head: ["Activity", "النشاط"], cell: (r) => esc(r.activity.name) },
        { head: ["Type", "النوع"], cell: (r) => esc(r.type.name) },
        { head: ["Capacity", "السعة"], cell: (r) => esc(r.capacity) },
        { head: ["Booking methodology", "منهجية الحجز"], cell: (r) => esc(r.booking_methodology) },
        { head: ["Availability", "التوفر"], cell: (r) => `<span style="color:${r.availability === "Available" ? "var(--color-info)" : "var(--color-danger)"}">${esc(r.availability)}</span>` },
        { head: ["Status", "الحالة"], cell: (r) => badge(tone(r.status), esc(PP.cap(r.status.lable))) },
        { head: ["Actions", "الإجراءات"], cell: (r) => eye(`unit-profile.html?id=${r.id}&tab=details`) },
      ] });
      return;
    }
    if (sec === "categories") {
      mount.innerHTML = listHead(L("Memberships categories", "فئات العضوية"), `<a class="btn btn--sm btn--secondary" href="${PP.href("memberships")}">${L("Members", "الأعضاء")} ${arrow}</a>`) + `<div data-l></div>`;
      SA.list({ mount: mount.querySelector("[data-l]"), data: d.cats, search: ["Search by name", "البحث بالاسم"], searchMatch: (r, q) => r.name.toLowerCase().includes(q), empty: ["There is no data to display", "لا توجد بيانات لعرضها"], columns: [
        { head: ["Name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b>` },
        { head: ["Units", "الوحدات"], cell: (r) => `<a href="${PP.href("memberships", { cat: r.id })}" style="color:var(--color-text-link);font-weight:var(--weight-semibold)">${r.units} ${L("Units", "الوحدات")}</a>` },
      ] });
      return;
    }
    mount.innerHTML = listHead(L("Members", "الأعضاء"), `<a class="btn btn--sm btn--secondary" href="${PP.href("memberships", { sec: "categories" })}">${L("Memberships categories", "فئات العضوية")} ${arrow}</a>`) + `<div data-l></div>`;
    let ctl = null;
    const ctlPill = () => (ctl ? ctl.state.pill : "");
    const memberCols = () => [
      { head: ["Name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b><div class="t-xs text-tertiary">@${esc(r.app_user_id)}</div>` },
      { head: ["Reference number", "رقم المرجع"], cell: (r) => `<span dir="ltr">${esc(r.reference_number)}</span>` },
      { head: ["Category", "الفئة"], cell: (r) => esc(r.category_name) },
      { head: ["Created", "تم الإنشاء"], cell: (r) => esc(r.created_at) },
      /* MembersTable.js: no "Ending on" column on the Requested tab */
      ...(ctlPill() === "requested" ? [] : [{ head: ["Ending on", "ينتهي في"], cell: (r) => (r.status === "requested" ? "---" : r.expired_at ? esc(r.expired_at) : L("Open", "مفتوح")) }]),
      { head: ["Status", "الحالة"], cell: (r) => badge(r.status === "active" ? "success" : r.status === "expired" ? "danger" : "warning", PP.cap(r.status)) },
    ];
    ctl = SA.list({ mount: mount.querySelector("[data-l]"), data: d.members,
      tiles: true,
      pills: [{ key: "", label: ["All", "الكل"], icon: "users" }, { key: "active", label: ["Members", "الأعضاء"], icon: "check", tone: "primary" }, { key: "requested", label: ["Requested", "مطلوب"], icon: "clock", tone: "warning" }, { key: "expired", label: ["Expired", "منتهي الصلاحية"], icon: "close", tone: "danger" }],
      pillMatch: (r, k) => !k || r.status === k, search: ["Search by name", "البحث بالاسم"], searchMatch: (r, q) => r.name.toLowerCase().includes(q),
      toolbarExtra: SA.select([["", L("Category", "الفئة") + ": " + L("All", "الكل")]].concat(d.cats.map((c) => [c.id, c.name])), 'data-cat aria-label="' + L("Category", "الفئة") + '"'),
      extraMatch: (r, f) => !f.cat || String(r.category_id) === f.cat,
      empty: ["There is no data to display", "لا توجد بيانات لعرضها"],
      /* read on every paint, so the Requested tile drops the column */
      get columns() { return memberCols(); },
    });
    mount.addEventListener("change", (e) => { if (e.target.matches("[data-cat]")) { ctl.state.extra = { cat: e.target.value }; ctl.state.page = 1; ctl.paint(); } });
  };

  /* ================= financials ================= */
  /* GET /partners/{id}/financials (transaction_types, payment_type, year, month, unit_id,
     branch_id, status, package_ids[], page, limit) · GET /partners/{id}/financials/filter-options
     Demo flags (?tab=financials&demo=…), off by default:
     fin-422   applying a Branch / Package filter answers 422 → message under that filter + toast
     sale-404  the package sale modal answers 404 → "This transaction wasn't found." */
  PP.tabs.financials = (mount, ctx) => {
    const p = ctx.partner, r = rng(p.id + 999), int = (a, b) => a + Math.floor(r() * (b - a + 1));
    const DEMO = new URLSearchParams(location.search).get("demo") || "";
    const hasPkg = HF.SA.packages.some((x) => x.partner.id === p.id);
    const myPkgs = HF.SA.packages.filter((x) => x.partner.id === p.id);
    const unitsOf = HF.SA.units.filter((u) => u.partner.id === p.id);
    const n2 = (v) => (v ? Number(v).toFixed(2) : "00.00");
    /* transactions: bookings / public events + (partners with packages) package sales */
    const tx = Array.from({ length: 18 }, (_, i) => ({ id: 81000 + i, cat: ["Sports", "Kids"][i % 2], catId: [1, 2][i % 2], act: ["Padel", "Trampoline"][i % 2],
      unit: (unitsOf[i % Math.max(1, unitsOf.length)] || { name: "Padel Court 1" }).name, type: ["online booking", "manual booking", "public event", "linked booking"][i % 4], tkey: ["online_booking", "manual_booking", "public_event", "linked_booking"][i % 4],
      tid: 4800 + i, status: ["coming", "ended", "ended", "canceled"][i % 4], date: "2026-" + String((i % 11) + 1).padStart(2, "0") + "-" + String((i % 27) + 1).padStart(2, "0") + " 1" + (i % 10) + ":00",
      amount: [180, 240, 60, 120][i % 4], pay: i % 3 ? "Online" : "Cash", pct: 10, fixed: 2, branch: (p.branches[i % p.branches.length] || {}).name,
      booking_type: i % 4 !== 2 && i % 5 === 4 ? "multi" : "single" }));
    if (hasPkg) myPkgs.forEach((k, i) => tx.push({ id: 82000 + i, pkg: k, plan: ["Monthly", "Quarterly", "Annual"][i % 3], cat: k.categories[0], catId: 1, act: k.categories[1], unit: k.name, type: ["Walk-in Sale", "Package Subscription", "Renewal", "Extension"][i % 4], tkey: ["walk_in_sale", "package_subscription", "renewal", "extension"][i % 4],
      reference: "PKG-" + (5100 + i), status: ["active", "frozen", "expired", "cancelled", "upgraded"][i % 5], date: "2026-" + String((i % 11) + 1).padStart(2, "0") + "-1" + (i % 9) + " 12:00", amount: k.plans.from_price, collected: i % 2 ? k.plans.from_price : k.plans.from_price - 150,
      pay: i % 2 ? "Online" : "Cash", pct: 10, fixed: 0, branch: k.branches[0].name, ext: i % 4 === 3 ? { days: 10, visits: 2 } : null,
      /* API collector {value, label} (readCollector); one sample row comes without it → "—" */
      collector: i === 2 ? null : i % 2 ? { value: "highfive", label: "HighFive" } : { value: "partner", label: p.company_name } }));
    /* who collected: collector.label || collector.value || "—" (table and sale modal alike) */
    const collectorOf = (x) => (x.collector ? x.collector.label || x.collector.value : "") || "—";
    let f = {}, fieldErrors = {};
    const SUB = { active: ["success", L("Active", "نشط")], frozen: ["primary", L("Frozen", "مجمّد")], expired: ["", L("Expired", "منتهي")], cancelled: ["danger", L("Cancelled", "ملغى")], upgraded: ["primary", L("Upgraded", "تمت ترقيته")] };
    const match = (x) => (!f.year || x.date.startsWith(f.year)) && (!f.month || x.date.slice(5, 7) === f.month) && (!f.category || String(x.catId) === f.category) && (!f.activity || x.act === f.activity)
      && (!f.unit || x.unit === f.unit) && (!f.branch || x.branch === f.branch) && (!f.packages || !f.packages.length || (x.pkg && f.packages.includes(String(x.pkg.id))))
      && (!f.sub_status || x.status === f.sub_status) && (!f.ttype || x.tkey === f.ttype || (f.ttype === "package" && x.pkg)) && (!f.pay || x.pay.toLowerCase() === f.pay);
    const stats = (rows) => {
      const o = { online_revenue: 0, online_collected: 0, cash_revenue: 0, cash_collected: 0 };
      rows.forEach((x) => { const on = x.pay === "Online"; o[on ? "online_revenue" : "cash_revenue"] += x.amount; o[on ? "online_collected" : "cash_collected"] += on ? x.amount : x.pkg ? x.collected : 0; });
      o.online_hi5_net = o.online_revenue * 0.1; o.online_partner_net = o.online_revenue * 0.9; o.cash_hi5_net = o.cash_revenue * 0.1; o.cash_partner_net = o.cash_revenue * 0.9; o.to_be_collected = o.cash_revenue - o.cash_collected;
      return o;
    };
    /* Redesign (2026-11-17): the four stat tables (booking · public event · packages ·
       revenues) became a KPI strip for the period's totals + ONE comparison table by
       source. Same stats() figures; nothing dropped — every source keeps its online /
       cash revenue and collected split, and the nets / to-be-collected columns. */
    const kpi = (label, value, tone, hint) => `<div class="stat-tile stat-tile--static" style="cursor:default">
        <span class="stat-tile__txt"><span class="stat-tile__label">${label}</span><span class="stat-tile__val" style="font-variant-numeric:tabular-nums${tone ? ";color:var(--color-" + tone + ")" : ""}">${n2(value)} <span class="t-xs text-tertiary">SAR</span></span>${hint ? `<span class="t-xs text-tertiary">${hint}</span>` : ""}</span></div>`;
    function overview(book, ev, pk, all) {
      const tot = (s, a, b) => (s[a] || 0) + (s[b] || 0);
      /* the booking and public-event cards carry revenue + collected only; nets and
         "to be collected" come with the packages and revenues (all) figures */
      const src = [[L("Booking", "الحجز"), book, false, true], [L("Public event", "الحدث العام"), ev, false, true]].concat(pk ? [[L("Packages", "الباقات"), pk]] : []).concat([[`<b>${L("Total", "المجموع")}</b>`, all, true]]);
      const NA = '<span class="text-tertiary">—</span>';
      return `<div class="stat-strip" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr))">
          ${kpi(L("Revenues", "الإيرادات"), tot(all, "online_revenue", "cash_revenue"), "", `${L("Online", "عبر الإنترنت")} ${n2(all.online_revenue)} · ${L("Cash", "نقدي")} ${n2(all.cash_revenue)}`)}
          ${kpi(L("Collected", "المحصل"), tot(all, "online_collected", "cash_collected"))}
          ${kpi(L("Net HighFive", "صافي هاي فايف"), tot(all, "online_hi5_net", "cash_hi5_net"))}
          ${kpi(L("Net partner", "صافي الشريك"), tot(all, "online_partner_net", "cash_partner_net"))}
          ${kpi(L("To be collected by partner", "يحصّلها الشريك"), all.to_be_collected, "warning")}
        </div>
        <section class="card card--pad stack gap-3"><h4 class="t-title">${L("By source", "حسب المصدر")}</h4>${SA.table({ rows: src, empty: [""], columns: [
          { head: ["", ""], cell: (x) => x[0] },
          { head: ["Online revenue", "إيرادات الإنترنت"], align: "end", cell: (x) => n2(x[1].online_revenue) },
          { head: ["Online collected", "المحصل عبر الإنترنت"], align: "end", cell: (x) => `<span style="display:inline-flex;align-items:center;gap:var(--space-1);white-space:nowrap">${n2(x[1].online_collected)}<span tabindex="0" data-tip="${L("Collected by HighFive", "محصل من هاي فايف")}" aria-label="${L("Collected by HighFive", "محصل من هاي فايف")}" style="display:inline-flex;color:var(--color-text-tertiary)">${ic("info")}</span></span>` },
          { head: ["Cash revenue", "الإيرادات النقدية"], align: "end", cell: (x) => n2(x[1].cash_revenue) },
          { head: ["Cash collected", "المحصل نقدًا"], align: "end", cell: (x) => `<span style="display:inline-flex;align-items:center;gap:var(--space-1);white-space:nowrap">${n2(x[1].cash_collected)}<span tabindex="0" data-tip="${n2(x[1].cash_collected)} ${L("SAR to be collected", "ريال سعودي للتحصيل")}" aria-label="${n2(x[1].cash_collected)} ${L("SAR to be collected", "ريال سعودي للتحصيل")}" style="display:inline-flex;color:var(--color-text-tertiary)">${ic("info")}</span></span>` },
          { head: ["Net HighFive", "صافي هاي فايف"], align: "end", cell: (x) => (x[3] ? NA : n2(tot(x[1], "online_hi5_net", "cash_hi5_net"))) },
          { head: ["Net partner", "صافي الشريك"], align: "end", cell: (x) => (x[3] ? NA : n2(tot(x[1], "online_partner_net", "cash_partner_net"))) },
          { head: ["To be collected", "المتبقي للتحصيل"], align: "end", cell: (x) => (x[3] ? NA : `<span style="color:var(--color-warning);font-weight:var(--weight-semibold)">${n2(x[1].to_be_collected)}</span>`) },
        ] })}</section>`;
    }
    const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    function paint() {
      const rows = tx.filter(match);
      const nonPkg = rows.filter((x) => !x.pkg);
      const book = stats(nonPkg.filter((x) => x.tkey !== "public_event")), ev = stats(nonPkg.filter((x) => x.tkey === "public_event")), pk = stats(rows.filter((x) => x.pkg)), all = stats(rows);
      /* packages block {present, visible, hiddenReason, note}: a unit filter hides the
         packages figures (sales aren't per unit) — the server sends a note instead */
      const pkgHidden = hasPkg && !!f.unit;
      const when = f.year ? `${f.month ? f.month + " - " : ""}${f.year}` : L("All Times", "جميع الأوقات");
      const pkgNames = (f.packages || []).map((id) => (myPkgs.find((k) => String(k.id) === id) || {}).name).filter(Boolean);
      const active = Object.keys(f).filter((k) => f[k] && (!Array.isArray(f[k]) || f[k].length)).length;
      mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${L("Financials transactions of", "المالية المعاملات من")} ${esc(when)} ${L("in all units", "في جميع الوحدات")}${pkgNames.length ? " · " + pkgNames.map(esc).join(", ") : ""}</h3>
          <div class="row gap-2"><button type="button" class="btn btn--sm btn--secondary" data-export>${ic("upload")}<span>${L("Export", "تصدير")}</span></button>${PP.filterBtn(active)}</div></div>
        ${overview(book, ev, hasPkg && !pkgHidden ? pk : null, all)}
        ${pkgHidden ? `<div class="alert alert--warning"><span class="alert__icon">${ic("info")}</span><div class="alert__body">${L("Package sales aren't linked to a unit, so they're hidden while a unit filter is applied.", "مبيعات الباقات غير مرتبطة بوحدة، لذلك تُخفى أثناء تطبيق تصفية الوحدة.")}</div></div>` : ""}
        <div data-l></div>`;
      SA.list({ mount: mount.querySelector("[data-l]"), data: rows, empty: ["There is no data to display", "لا توجد بيانات للعرض"], columns: [
        { head: ["#", "#"], cell: (x) => `#${x.id}` },
        { head: ["Activity", "النشاط"], cell: (x) => `${esc(x.cat)}<div class="t-xs text-tertiary">${esc(x.act)}</div>` },
        { head: ["Unit", "الوحدة"], cell: (x) => (x.pkg ? `${esc(x.pkg.name)} · ${x.plan}<div class="t-xs text-tertiary">${esc(x.branch)}</div>` : esc(x.unit)) },
        { head: ["Transaction type", "نوع المعاملة"], cell: (x) => `${x.tkey === "online_booking" ? L("Online booking", "حجز إلكتروني") : PP.cap(x.type)}<div class="t-xs text-tertiary">${x.pkg ? x.reference : "ID: #" + x.tid}</div>${x.ext ? `<div class="t-xs" style="color:var(--color-info)">${L("+" + x.ext.days + " days", "+" + x.ext.days + " يوم")} · ${L("+" + x.ext.visits + " visits", "+" + x.ext.visits + " زيارة")}</div>` : ""}` },
        { head: ["Booking Status", "حالة الحجز"], cell: (x) => (x.pkg ? badge(SUB[x.status][0], SUB[x.status][1]) : PP.sessionStatus(x.status)) },
        { head: ["Date & time", "التاريخ والوقت"], cell: (x) => x.date },
        { head: ["Revenue", "الإيرادات"], cell: (x) => `${x.amount} SAR<div class="t-xs text-tertiary">${x.pay}</div>` },
        { head: ["Collected Amount", "المبلغ المحصل"], cell: (x) => { const c = x.pkg ? x.collected : x.pay === "Online" ? x.amount : 0; /* who collected: API collector.label → collector.value (readCollector, dev 2026-11-16); sample rows derive it */
          const by = x.pkg ? collectorOf(x) : x.pay === "Online" ? L("HighFive", "هاي فايف") : L("Partner", "الشريك");
          return `${c} SAR<div class="t-xs text-tertiary">${esc(by)}</div>${x.pkg && x.amount - c > 0 ? `<div class="t-xs" style="color:var(--color-warning)">${L("Remaining " + (x.amount - c), "المتبقي " + (x.amount - c))}</div>` : ""}`; } },
        { head: ["Percentage", "النسبة المئوية"], cell: (x) => `${x.pct} %<div class="t-xs text-tertiary">${(x.amount * x.pct / 100).toFixed(2)}</div>` },
        { head: ["Fixed", "ثابت"], cell: (x) => x.fixed },
        { head: ["Net HighFive", "صافي هاي فايف"], cell: (x) => (x.amount * x.pct / 100 + x.fixed).toFixed(2) },
        { head: ["Net partner", "صافي الشريك"], cell: (x) => (x.amount - x.amount * x.pct / 100 - x.fixed).toFixed(2) },
        /* public event → /public-events/view/{id} · multi booking → /multi-booking/{id} · else /bookings/view/{id} */
        { head: ["Actions", "الإجراءات"], cell: (x) => (x.pkg ? SA.iconBtn("eye", L("View", "عرض"), `data-sale="${x.id}"`) : eye(x.tkey === "public_event" ? `public-events.html?view=${x.tid}` : x.booking_type === "multi" ? `multi-booking.html?id=${x.tid}` : `bookings.html?view=${x.tid}`,
          x.tkey === "public_event" ? "view_public_event_details" : x.booking_type === "multi" ? "view_booking_details|view_multi_booking_details" : "view_booking_details")) },
      ] });
    }
    mount.addEventListener("click", (e) => {
      if (e.target.closest("[data-export]")) {
        /* GET /partners/{id}/financials/export (same params as the list, blob) → financials_export.xlsx
           (the static sample exports the visible rows as CSV) */
        const rows = tx.filter(match);
        const csv = ["#,activity,unit,transaction type,status,date,revenue,payment"].concat(rows.map((x) => [x.id, x.act, x.pkg ? x.pkg.name : x.unit, x.type, x.status, x.date, x.amount, x.pay].map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(","))).join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        a.download = "financials_export.csv";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }
      const fb = e.target.closest("[data-filter]");
      /* filter-options: branches / packages may carry archived:true → " (deleted)" */
      const del = (o) => (o.archived ? `${o.name} (${L("deleted", "محذوفة")})` : o.name);
      const branchOpts = hasPkg ? p.branches.map((b) => ({ value: b.name, name: b.name })).concat([{ value: "Old branch", name: "Old branch", archived: true }]) : [];
      const pkgOpts = myPkgs.map((k, i) => ({ value: k.id, name: k.name, archived: myPkgs.length > 1 && i === myPkgs.length - 1 }));
      if (fb) PP.filterPop(fb, { value: f, width: 340, cascade: { category: ["activity"] },
        fields: [
          { key: "year", label: ["Year", "السنة"], placeholder: ["Select year", "اختر السنة"], options: () => ["2026", "2025", "2024"].map((y) => [y, y]) },
          { key: "month", label: ["Month", "الشهر"], placeholder: ["Select month", "اختر الشهر"], options: () => MONTHS.map((m) => [m, m]) },
          { key: "category", label: ["Category", "الفئة"], placeholder: ["Select category", "اختر الفئة"], options: () => HF.SA.CATS.map((c) => [c.id, c.name]) },
          { key: "activity", label: ["Activity", "النشاط"], placeholder: ["Select activity", "اختر النشاط"], options: (d) => (d.category ? HF.SA.ACTS[d.category] : []).map((a) => [a, a]) },
          { key: "unit", label: ["Unit", "الوحدة"], placeholder: ["Select unit", "اختر الوحدة"], options: () => unitsOf.map((u) => [u.name, u.name]) },
        ].concat(branchOpts.length ? [
          /* only when filter-options returns branches */
          { key: "branch", label: ["Branch", "الفرع"], options: () => branchOpts.map((b) => [b.value, del(b)]) },
        ] : []).concat(hasPkg ? [
          { key: "packages", type: "checks", label: ["Package", "الباقة"], options: () => pkgOpts.map((k) => [k.value, del(k)]) },
          { key: "sub_status", label: ["Subscription status", "حالة الاشتراك"], options: () => Object.keys(SUB).map((k) => [k, SUB[k][1]]) },
        ] : []).concat([
          { key: "ttype", label: ["Transactions type", "نوع المعاملات"], placeholder: ["Select type", "اختر النوع"], options: () => [["online_booking", L("Online booking", "حجز إلكتروني")], ["linked_booking", L("Linked booking", "حجز مرتبط")], ["manual_booking", L("Manual booking", "حجز يدوي")], ["public_event", L("Public event", "الحدث العام")]]
            /* package types (US #2794) when filter-options sends no list */
            .concat(hasPkg ? [["package", L("All packages", "كل الباقات")], ["package_subscription", L("Package subscription", "اشتراك باقة")], ["walk_in_sale", L("Walk-in sale", "بيع مباشر")], ["linked_sale", L("Linked sale", "بيع مرتبط")], ["renewal", L("Renewal", "تجديد")], ["upgrade", L("Upgrade", "ترقية")], ["extension", L("Extension", "تمديد")]] : []) },
          { key: "pay", label: ["Payment method", "طريقة الدفع"], placeholder: ["Select method", "اختر الطريقة"], options: () => [["cash", L("Cash", "نقدي")], ["online", L("Online", "عبر الإنترنت")]] },
        ]),
        onApply: (d) => {
          /* 422 (a branch / package that isn't this partner's): message under that filter + toast; the table keeps its data */
          if (DEMO === "fin-422" && (d.branch || (d.packages && d.packages.length))) {
            fieldErrors = d.branch ? { branch: L("The selected branch is invalid.", "الفرع المحدد غير صالح.") } : { packages: L("The selected package is invalid.", "الباقة المحددة غير صالحة.") };
            return RD.toast("error", Object.values(fieldErrors)[0]);
          }
          fieldErrors = {}; f = d; paint();
        } });
      if (fb) Object.keys(fieldErrors).forEach((k) => {
        const c = document.querySelector(`#ppFilterPop [data-f="${k}"], #ppFilterPop [data-m="${k}"]`);
        const fl = c && c.closest(".field");
        if (fl) fl.insertAdjacentHTML("beforeend", errLine(esc(fieldErrors[k])));
      });
      const sb = e.target.closest("[data-sale]");
      if (sb) {
        const x = tx.find((y) => String(y.id) === sb.dataset.sale);
        /* GET /partners/{id}/financials/package-sales/{sale} — 404 → "This transaction wasn't found." */
        if (DEMO === "sale-404") return SA.modal({ id: "ppSale", title: L("Package transaction", "معاملة باقة"),
          body: `<div class="alert alert--danger"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${L("This transaction wasn't found.", "لم يتم العثور على هذه المعاملة.")}</div></div>`,
          foot: `<button class="btn" data-close>${L("Close", "إغلاق")}</button>` });
        const sec = (title, rows) => `<h4 class="t-sm" style="font-weight:var(--weight-bold);margin-top:var(--space-2)">${title}</h4>${rows.length ? kv(rows) : "<p>—</p>"}`;
        const com = x.amount * x.pct / 100;
        SA.modal({ id: "ppSale", wide: true, title: L("Package transaction " + x.reference, "معاملة باقة " + x.reference),
          body: sec(L("Summary", "الملخص"), [[L("Packages", "الباقات"), `${esc(x.pkg.name)} · ${x.plan}`], [L("Transaction Type", "نوع المعاملة"), x.type], [L("Date & time", "التاريخ والوقت"), x.date], [L("Revenue", "الإيرادات"), x.amount + " SAR"], [L("Collected", "المحصل"), `${x.collected} · ${esc(collectorOf(x))}`], [L("Remaining", "المتبقي"), x.amount - x.collected]])
            + sec(L("Collections", "التحصيلات"), [[`${x.date.slice(0, 10)} · ${x.pay === "Online" ? "Online" : "Cash desk"}`, x.collected]])
            + sec(L("Refunds", "المبالغ المستردة"), x.status === "cancelled" ? [[`${x.date.slice(0, 10)} · ${L("Cancelled by partner", "ألغاها الشريك")}`, 100]] : [])
            + sec(L("Tax breakdown", "تفاصيل الضرائب"), [["VAT (15%)", (x.amount * 0.15).toFixed(2)]])
            + sec(L("Commission applied", "العمولة المطبقة"), [[L("Rate", "النسبة"), x.pct + "%"], [L("Fixed", "ثابت"), x.fixed], [L("Source", "المصدر"), L("Partner contract", "عقد الشريك")], [L("Rule", "القاعدة"), L("Packages default", "افتراضي الباقات")], [L("Period", "الفترة"), "2026-01-01 → 2026-12-31"],
              [L("Base (collected)", "الأساس (المحصّل)"), x.collected], [L("Commission amount", "مبلغ العمولة"), com.toFixed(2)], [L("Fixed commission", "العمولة الثابتة"), x.fixed], [L("Net HighFive", "صافي هاي فايف"), (com + x.fixed).toFixed(2)], [L("Net partner", "صافي الشريك"), (x.amount - com - x.fixed).toFixed(2)]]),
          foot: `<a class="btn btn--ghost" href="package-detail.html?id=${x.pkg.id}&tab=subscribers">${L("Subscriber details", "تفاصيل المشترك")}</a><button class="btn" data-close>${L("Close", "إغلاق")}</button>` });
      }
    });
    paint();
  };

  /* ================= activity log (+ detail) ================= */
  const ACT_TONE = { created: "success", updated: "info", deleted: "danger" };
  /* GET /partners/{id}/activity-log?search=&modules[]=&action=&performed_by=&actor_type=&date_from=&date_to=&page=&limit=
     GET /partners/{id}/activity-log/filters (modules grouped, actions, this partner's performers)
     GET /partners/{id}/activity-log/{logId} (detail)
     In the dashboard the filters and page live in the URL (back from a detail reopens the same list). */
  PP.tabs["activity-log"] = (mount, ctx) => {
    const d = people(ctx.partner), id = ctx.params.get("log");
    if (id) {
      const g = d.logs.find((x) => String(x.id) === id) || d.logs[0];
      const fields = g.action.value === "updated" ? [["status", "inactive", "active"], ["price", "150", "180"]] : [["name", null, g.record.label]];
      mount.innerHTML = listHead(L(`Activity #${g.id}`, `النشاط #${g.id}`), `<a class="btn btn--sm btn--secondary" href="${PP.href("activity-log")}">${L("Back to activity log", "العودة إلى سجل النشاط")}</a>`)
        + card(`${badge(ACT_TONE[g.action.value] || "warning", g.action.label.replace(/^./, (c) => c.toUpperCase()))} ${esc(g.record.label)} <span class="t-sm text-tertiary">#${g.record.id}</span>`, "", kv([
          [L("Date & time", "التاريخ والوقت"), esc(g.created_at)], [L("Module", "الوحدة"), esc(g.module.label)],
          [L("Related record", "السجل المرتبط"), `<span style="color:var(--color-primary-ink)">${esc(g.module.label)} #${g.record.id}</span>${g.record.exists ? "" : ` (${L("Deleted", "محذوف")})`}`],
          [L("Performed by", "تم بواسطة"), `${esc(g.performed_by.name)} · ${esc(g.performed_by.role)}`], [L("Contact", "التواصل"), `${esc(g.performed_by.email)}<br><span dir="ltr">${esc(g.performed_by.phone)}</span>`]])
          + (g.acting_as ? `<div class="alert alert--warning" style="margin-top:var(--space-4)"><div class="alert__body stack gap-2"><b class="t-xs" style="text-transform:uppercase;letter-spacing:var(--tracking-caps)">${L("Acting as", "بالنيابة عن")}</b>${kv([[L("Partner", "الشريك"), esc(g.acting_as.name)], [L("Company", "الشركة"), esc(g.acting_as.company)]])}</div></div>` : ""))
        + card(g.action.value === "updated" ? L(`Changed fields (${fields.length})`, `الحقول المتغيرة (${fields.length})`) : L(`Fields (${fields.length})`, `الحقول (${fields.length})`), "",
          SA.table({ rows: fields, empty: [""], columns: g.action.value === "updated"
            ? [{ head: ["Field", "الحقل"], cell: (f) => `<b>${f[0]}</b>` }, { head: ["Before", "قبل"], cell: (f) => `<s style="color:var(--color-danger)">${f[1]}</s>` }, { head: ["After", "بعد"], cell: (f) => `<span style="color:var(--color-success)">${f[2]}</span>` }]
            : [{ head: ["Field", "الحقل"], cell: (f) => `<b>${f[0]}</b>` }, { head: ["Value", "القيمة"], cell: (f) => esc(f[2] || L("Not set", "غير محدد")) }] })
          + `<details data-perm="view_activity_log_raw"><summary class="btn btn--sm btn--ghost">${L("View raw JSON", "عرض JSON الخام")}</summary><pre class="t-xs" style="overflow:auto;background:var(--color-surface-sunken);padding:var(--space-3);border-radius:var(--radius-md)">${esc(JSON.stringify(g, null, 2))}</pre></details>`);
      return;
    }
    const cap = PP.cap;
    const MODS = [[cap("operations"), [["booking", cap("bookings")], ["unit", cap("units")]]], [cap("people"), [["customer", cap("customers")]]], [cap("marketing"), [["coupon", cap("coupons")]]]];
    const modLabel = (sel) => (!sel.length ? L("All modules", "كل الوحدات") : sel.length <= 2 ? sel.map((v) => MODS.flatMap((g) => g[1]).find((m) => m[0] === v)[1]).join(", ") : L(sel.length + " modules", sel.length + " وحدات"));
    const performers = [...new Set(d.logs.map((x) => x.performed_by.name))];
    mount.innerHTML = listHead(L("Activity log", "سجل النشاط")) + `<div class="row gap-2" style="flex-wrap:wrap">
        <button type="button" class="btn btn--sm btn--secondary" data-mods aria-haspopup="true">${ic("layers")}<span data-modlabel>${L("All modules", "كل الوحدات")}</span>${ic("chevronDown")}</button>
        ${SA.select([["", L("Performed by", "تم بواسطة")]].concat(performers.map((n) => [n, n])), 'data-f="performer"')}
        ${SA.select([["", L("All actions", "كل الإجراءات")], ["created", cap("created")], ["updated", cap("updated")], ["deleted", cap("deleted")], ["blocked", cap("blocked")]], 'data-f="action"')}
        ${SA.select([["", L("Actor type", "نوع الفاعل")], ["system_employee", L("System employee", "موظف نظام")], ["partner", L("Partner", "الشريك")]], 'data-f="actor"')}
        <input class="input" type="date" data-f="from" aria-label="${L("From", "من")}" style="max-width:170px"><input class="input" type="date" data-f="to" aria-label="${L("To", "إلى")}" style="max-width:170px">
        <button type="button" class="btn btn--sm btn--ghost" data-clear-all>${L("Clear all", "مسح الكل")}</button>
      </div><div data-l></div>`;
    const ctl = SA.list({ mount: mount.querySelector("[data-l]"), data: d.logs, search: ["Search record name or #id", "ابحث باسم السجل أو رقمه"],
      searchMatch: (x, q) => x.record.label.toLowerCase().includes(q) || String(x.record.id).includes(q.replace("#", "")),
      extraMatch: (x, f) => (!f.modules || !f.modules.length || f.modules.includes(x.module.value)) && (!f.performer || x.performed_by.name === f.performer) && (!f.action || x.action.value === f.action) && (!f.actor || x.actor_type === f.actor) && (!f.from || x.created_at.slice(0, 10) >= f.from) && (!f.to || x.created_at.slice(0, 10) <= f.to),
      empty: () => `<div class="stack gap-3" style="align-items:center">${L("There is no data to display.", "لا توجد بيانات للعرض.")}<button type="button" class="btn btn--sm btn--secondary" data-clear-all>${L("Clear all", "مسح الكل")}</button></div>`,
      columns: [
        { head: ["Date & time", "التاريخ والوقت"], cell: (x) => esc(x.created_at) },
        { head: ["Module", "الوحدة"], cell: (x) => esc(cap(x.module.label)) },
        { head: ["Action", "الإجراء"], cell: (x) => badge(ACT_TONE[x.action.value] || "warning", cap(x.action.label)) },
        { head: ["Performed by", "تم بواسطة"], cell: (x) => `<b>${esc(x.performed_by.name)}</b><div class="t-xs text-tertiary">${esc(x.performed_by.role)}</div>${x.actor_type === "system_employee" ? badge("warning", L("System employee", "موظف نظام")) : ""}` },
        { head: ["Record", "السجل"], cell: (x) => esc(x.record.label) },
        { head: ["Details", "التفاصيل"], cell: (x) => eye(PP.href("activity-log", { log: x.id })) },
      ] });
    mount.addEventListener("change", (e) => { const k = e.target.dataset.f; if (!k) return; ctl.state.extra[k] = e.target.value; ctl.state.page = 1; ctl.paint(); });
    /* Clear all: search, modules, performer, action, actor type and dates */
    mount.addEventListener("click", (e) => {
      if (!e.target.closest("[data-clear-all]")) return;
      ctl.state.extra = {}; ctl.state.q = ""; ctl.state.page = 1; picked = [];
      mount.querySelectorAll("[data-f]").forEach((c) => (c.value = ""));
      mount.querySelector("[data-modlabel]").textContent = modLabel([]);
      ctl.paint();
    });
    /* Modules: grouped multi-checkbox dropdown with its own search, Clear modules and Apply */
    const menu = document.createElement("div");
    menu.className = "menu menu--select";
    menu.style.cssText = "min-width:260px;max-height:360px;overflow:auto";
    let picked = [];
    const paintMenu = (q) => {
      q = (q || "").toLowerCase();
      menu.innerHTML = `<div class="input-wrap" style="margin-bottom:var(--space-2)"><span class="input-wrap__icon">${ic("search")}</span><input class="input" data-msearch placeholder="${L("Search modules", "ابحث في الوحدات")}" value="${esc(q)}"></div>
        ${MODS.map(([g, items]) => { const vis = items.filter((m) => m[1].toLowerCase().includes(q)); return vis.length ? `<div class="t-xs text-tertiary" style="padding:var(--space-1) var(--space-2);text-transform:uppercase">${g}</div>${vis.map((m) => `<label class="check"><input type="checkbox" value="${m[0]}" ${picked.includes(m[0]) ? "checked" : ""}><span class="check__box">${ic("check")}</span>${m[1]}</label>`).join("")}` : ""; }).join("")}
        <div class="menu--select__foot row between"><button type="button" class="btn btn--sm btn--ghost" data-mclear>${L("Clear modules", "مسح الوحدات")}</button><button type="button" class="btn btn--sm" data-mapply>${L("Apply", "تطبيق")}</button></div>`;
    };
    menu.addEventListener("input", (e) => { if (e.target.matches("[data-msearch]")) { paintMenu(e.target.value); const s = menu.querySelector("[data-msearch]"); s.focus(); s.setSelectionRange(s.value.length, s.value.length); } });
    menu.addEventListener("change", (e) => { if (e.target.type === "checkbox") { e.target.checked ? picked.push(e.target.value) : (picked = picked.filter((v) => v !== e.target.value)); } });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("[data-mclear]")) { picked = []; paintMenu(); }
      if (e.target.closest("[data-mapply]")) { ctl.state.extra.modules = picked.slice(); ctl.state.page = 1; menu.classList.remove("is-open"); mount.querySelector("[data-modlabel]").textContent = modLabel(picked); ctl.paint(); }
    });
    mount.querySelector("[data-mods]").addEventListener("click", (e) => {
      const b = e.currentTarget;
      if (menu.classList.contains("is-open")) return menu.classList.remove("is-open");
      picked = (ctl.state.extra.modules || []).slice();
      paintMenu();
      RD.portalMenu(menu); RD.positionMenu(menu, b, "start"); menu.classList.add("is-open");
    });
  };

  /* ================= coupons (list · view · usage · new) =================
     API: GET /coupons (list) · GET /coupons/{id} (view) · PUT /coupons/{id} {status, _method:put}
     · DELETE /coupons/{id} · POST /coupons (create — body in couponNew) · usage lists
     GET /coupons/{id}/bookings|public-events|multi-bookings (keyword from 3 chars). */
  const CUR = { SA: "SAR", EG: "EGP", AE: "AED", KW: "KWD", BH: "BHD" };
  const curOf = (iso) => CUR[iso] || "SAR";
  const cStatus = (c) => (c.status === "active" ? badge("primary", L("Active", "نشط")) : c.status === "expired" ? badge("", L("Ended", "منتهي")) : badge("danger", L("Inactive", "غير نشط")));
  const none = "---";
  const listOf = (a, f) => (a && a.length ? `<div class="stack" style="gap:2px">${a.map(f).join("")}</div>` : none);
  PP.couponsOf = (p) => people(p).coupons; /* partner-created coupons (Partner's Promo Codes list) */
  PP.tabs.coupons = (mount, ctx) => {
    /* ctx.coupons / ctx.newBtn / ctx.global: the Marketing pages (marketing-coupons.html) reuse this tab — in the dashboard it is the same UI, copied */
    const p = ctx.partner, d = ctx.coupons ? { coupons: ctx.coupons } : people(p), view = ctx.params.get("view"), usage = ctx.params.get("usage"), isNew = ctx.params.get("new");
    const back = `<a class="btn btn--sm btn--secondary" href="${PP.href("coupons")}">${L("Back to coupons", "العودة إلى الكوبونات")}</a>`;
    const cur = curOf(p.country.iso);
    const cCur = (c) => c.currency || cur; /* the coupon's own currency (country / partner) */
    if (view) {
      const c = d.coupons.find((x) => String(x.id) === view) || d.coupons[0];
      mount.innerHTML = listHead(esc(c.code), back)
        + card(L("Coupon code", "رمز الكوبون"), "", kv([[L("Code", "الرمز"), esc(c.code)], [L("Description", "الوصف"), c.description ? esc(c.description) : none], [L("Status", "الحالة"), cStatus(c)]]))
        /* ViewPage.js: every list shows "---" when empty (no "All users" / "All units" wording) */
        + card(L("Coupon type", "نوع الكوبون"), "", kv([[L("Type", "النوع"), esc(PP.cap(c.type))], [L("Country", "الدولة"), c.country_name ? esc(c.country_name) : none],
            [L("State", "المحافظة"), listOf(c.states, (x) => `<span>${esc(x.name)}</span>`)], [L("City", "المدينة"), listOf(c.cities, (x) => `<span>${esc(x.name)}</span>`)],
            [L("Users", "المستخدمون"), listOf(c.users, (x) => `<span><b>${esc(x.name)}</b> <span class="t-xs text-tertiary">${esc(x.username || "")}</span></span>`)]]
            .concat(c.type === "partners" ? [[L("Specific partner", "شريك محدد"), c.partner_name ? esc(c.partner_name) : none], [L("Branches", "الفروع"), listOf(c.branches, (x) => `<span>${esc(x.name)}</span>`)], [L("Units", "الوحدات"), listOf(c.units, (x) => `<span>${esc(x.name)}</span>`)]] : [])))
        + card(L("Discount type", "نوع الخصم"), "", kv([[L("Type", "النوع"), esc(PP.cap(c.discount_type))], [L("Coupon amount", "مبلغ الكوبون"), c.discount_type === "fixed" ? `${c.value} ${cCur(c)}` : `${c.value}%`], [L("Min booking / join price", "الحد الأدنى لسعر الحجز / الانضمام"), c.min_amount ? `${c.min_amount} ${cCur(c)}` : none]]))
        + card(L("Usage limit", "حد الاستخدام"), "", kv([[L("Usage limit", "حد الاستخدام"), c.usage_limit || none], [L("Usage limit per user", "حد الاستخدام لكل مستخدم"), c.usage_limit_per_user || none]]))
        + card(L("Schedules", "الجداول الزمنية"), "", kv([[L("Start date", "تاريخ البدء"), esc(c.start_at)], [L("Expire date", "تاريخ الانتهاء"), esc(c.end_at)]]))
        + card(L("Coupon status history", "سجل حالة الكوبون"), "", SA.table({ rows: c.logs, empty: ["No logs available", "لا توجد سجلات متاحة"], columns: [
            { head: ["#", "#"], cell: (l) => l.id }, { head: ["Changed by", "تم التغيير بواسطة"], cell: (l) => esc(l.admin.name) },
            { head: ["Old status", "الحالة القديمة"], cell: (l) => (l.status === "active" ? badge("danger", L("Inactive", "غير نشط")) : badge("primary", L("Active", "نشط"))) },
            { head: ["New status", "الحالة الجديدة"], cell: (l) => (l.status === "active" ? badge("primary", L("Active", "نشط")) : badge("danger", L("Inactive", "غير نشط"))) },
            { head: ["Change date/time", "تاريخ ووقت التغيير"], cell: (l) => esc(l.created_at) }] }));
      return;
    }
    if (usage) {
      /* DetailsPage: without view_coupon_usages the page is the NotHavePermissions card */
      if (!RD.can("view_coupon_usages")) return (mount.innerHTML = RD.noPermission());
      const c =d.coupons.find((x) => String(x.id) === usage) || d.coupons[0], cp = c._p || p;
      const tab = ctx.params.get("ut") || "bookings";
      const users = NAMES.slice(0, 6);
      const rows = users.map((u, i) => ({ id: 4900 + i, created_at: `2026-11-0${i + 1} 12:00`, type: tab === "multi" ? "multi" : "booking", company: { id: cp.id, name: cp.company_name }, category: "Sports", activity: "Padel", branch: (cp.branches[0] || {}).name, unit: "Padel Court 1", start: `2026-11-1${i} 18:00`, end: `2026-11-1${i} 19:00`, user: u, username: `vie_${300 + i}`, status: ["coming", "ended", "canceled"][i % 3], discount: c.discount_type === "fixed" ? c.value : 20,
        joining: i % 3 === 2 ? { value: "left", label: L("Left", "غادر"), date: `2026-11-0${i + 2} 09:30` } : { value: "joined", label: L("Joined", "منضم") }, public_event: { id: 7700 + i, created_at: `2026-10-2${i} 10:00` } }));
      const search = { bookings: ["Search by booking ID, user name, username, company name, unit name", "البحث برقم الحجز، اسم المستخدم، اسم الشركة، اسم الوحدة"], joining: ["Search by joining ID, user name, username, company name, unit name", "البحث برقم الانضمام، اسم المستخدم، اسم الشركة، اسم الوحدة"], multi: ["Search by multi-sessions ID, user name, username, company name, unit name", "البحث برقم الجلسات المتعددة، اسم المستخدم، اسم الشركة، اسم الوحدة"] }[tab];
      mount.innerHTML = listHead(esc(c.code), back) + `<div class="tabs">${[["bookings", L("Bookings list", "قائمة الحجوزات")], ["joining", L("Joining list", "قائمة الانضمام")], ["multi", L("Multi-sessions list", "قائمة الجلسات المتعددة")]].map(([k, t]) => `<a href="${PP.href("coupons", { usage: c.id, ut: k })}" class="${k === tab ? "is-active" : ""}">${t}</a>`).join("")}</div><div data-l></div>`;
      const sol = (s) => `<span class="badge badge--${s === "coming" ? "success" : s === "ended" ? "primary" : "danger"}">${esc(PP.cap(s))}</span>`;
      /* search (from 3 characters) by ID, user name, username, company name and unit name */
      const uctl = SA.list({ mount: mount.querySelector("[data-l]"), data: rows, search, minSearch: 3,
        searchMatch: (x, q) => [String(x.id), x.user, x.username, x.company.name, x.unit].some((v) => String(v).toLowerCase().includes(q.replace("#", ""))),
        toolbarExtra: PP.filterBtn(), empty: ["There is no data yet", "لا توجد بيانات بعد"],
        extraMatch: (x, fl) => (!fl.status || (fl.status === "past" ? x.status === "ended" : fl.status === "canceled" ? x.status === "canceled" : x.status === fl.status)) && (!fl.category || x.category === fl.category) && (!fl.activity || x.activity === fl.activity)
          && (!fl.session_from || x.start.slice(0, 10) >= fl.session_from) && (!fl.session_to || x.start.slice(0, 10) <= fl.session_to) && (!fl.booked_from || x.created_at.slice(0, 10) >= fl.booked_from) && (!fl.booked_to || x.created_at.slice(0, 10) <= fl.booked_to),
        columns: tab === "joining" ? [
          { head: ["ID", "المعرف"], cell: (x) => `#${x.id}<div class="t-xs text-tertiary">${x.created_at}</div>` },
          { head: ["Company", "الشركة"], cell: (x) => `${esc(x.company.name)}<div class="t-xs text-tertiary">ID #${x.company.id}</div>` },
          { head: ["Branch / unit", "الفرع / الوحدة"], cell: (x) => `${esc(x.branch)}<div class="t-xs text-tertiary">${x.unit}</div>` },
          { head: ["Category / activity", "الفئة / النشاط"], cell: (x) => `${x.category}<div class="t-xs text-tertiary">${x.activity}</div>` },
          { head: ["Public event time", "وقت الحدث العام"], cell: (x) => `${x.start}<div class="t-xs text-tertiary">${x.end}</div>` },
          { head: ["Age group", "الفئة العمرية"], cell: () => "Adults" },
          { head: ["Session gender", "جنس الجلسة"], cell: () => L("Both", "كلاهما") },
          { head: ["Users", "المستخدمون"], cell: (x) => `${esc(x.user)}<div class="t-xs text-tertiary">${x.username}</div>` },
          /* status_translated, + status_date when not "joined" */
          { head: ["Joining status", "حالة الانضمام"], cell: (x) => `${x.joining.label}${x.joining.value !== "joined" ? `<div class="t-xs text-tertiary">${x.joining.date}</div>` : ""}` },
          { head: ["Public event ID", "معرف الحدث العام"], cell: (x) => `#${x.public_event.id}<div class="t-xs text-tertiary">${x.public_event.created_at}</div>` },
          { head: ["Public event status", "حالة الحدث العام"], cell: (x) => sol(x.status) },
          { head: ["Coupon usage amount", "مبلغ استخدام الكوبون"], cell: (x) => `${x.discount} ${cCur(c)}` },
          { head: ["Actions", "الإجراءات"], cell: (x) => eye(`public-events.html?view=${x.public_event.id}`, "view_booking_details") },
        ] : [
          { head: ["ID", "المعرف"], cell: (x) => `#${x.id}<div class="t-xs text-tertiary">${x.created_at}</div>` },
          { head: ["Type", "النوع"], cell: (x) => esc(PP.cap(x.type)) },
          { head: ["Company", "الشركة"], cell: (x) => `${esc(x.company.name)}<div class="t-xs text-tertiary">ID #${x.company.id}</div>` },
          { head: ["Category / activity", "الفئة / النشاط"], cell: (x) => `${x.category}<div class="t-xs text-tertiary">${x.activity}</div>` },
          { head: ["Branch / unit", "الفرع / الوحدة"], cell: (x) => `${esc(x.branch)}<div class="t-xs text-tertiary">${x.unit}</div>` },
          { head: ["Start at / end at", "البداية / النهاية"], cell: (x) => `${x.start}<div class="t-xs text-tertiary">${x.end}</div>` },
          { head: ["Users", "المستخدمون"], cell: (x) => `${esc(x.user)}<div class="t-xs text-tertiary">${x.username}</div>` },
          { head: ["Status", "الحالة"], cell: (x) => sol(x.status) },
          { head: ["Coupon usage amount", "مبلغ استخدام الكوبون"], cell: (x) => `${x.discount} ${cCur(c)}` },
          /* multi → /multi-booking/details/{id} · bookings → /bookings/view/{id} */
          { head: ["Actions", "الإجراءات"], cell: (x) => eye(tab === "multi" ? `multi-booking.html?details=${x.id}` : `bookings.html?view=${x.id}`, tab === "multi" ? "view_multi_booking_details" : "view_booking_details") },
        ] });
      mount.addEventListener("click", (e) => {
        const fb = e.target.closest("[data-filter]");
        if (!fb) return;
        /* BookingsFilterDropdown: the Bookings list says Booking date / Session status; the
           Joining AND Multi-sessions lists say Joining date / Public event status */
        const bk = tab === "bookings";
        PP.filterPop(fb, { value: uctl.state.extra, width: 340,
          fields: [
            { key: "session", type: "range", label: ["Session date", "تاريخ الجلسة"] },
            { key: "booked", type: "range", label: bk ? ["Booking date", "تاريخ الحجز"] : ["Joining date", "تاريخ الانضمام"] },
            { key: "category", label: ["Category", "الفئة"], placeholder: ["Select category", "اختر الفئة"], options: () => HF.SA.CATS.map((x) => [x.name, x.name]) },
            { key: "activity", label: ["Activity", "النشاط"], placeholder: ["Select activity", "اختر النشاط"], options: () => ["Padel", "Football", "Trampoline"].map((a) => [a, a]) },
          ].concat(bk ? [{ key: "btype", label: ["Booking type", "نوع الحجز"], placeholder: ["Select activity", "اختر النشاط"], options: () => [["online", L("Online", "عبر الإنترنت")]] }] : [],
            tab === "joining" ? [{ key: "age", label: ["Age groups", "الفئات العمرية"], placeholder: ["Select age group", "اختر الفئة العمرية"], options: () => [["kids", "Kids"], ["adults", "Adults"]] }] : [], [
            { key: "gender", label: tab === "joining" ? ["Session gender", "جنس الجلسة"] : ["Gender", "الجنس"], placeholder: ["Select gender", "اختر الجنس"], options: () => [["male", L("Male", "ذكر")], ["female", L("Female", "أنثى")], ["both", L("Both", "كلاهما")]] },
            { key: "status", label: bk ? ["Session status", "حالة الجلسة"] : ["Public event status", "حالة الحدث العام"], placeholder: ["Select status", "اختر الحالة"], options: () => [["coming", L("Coming", "قادم")], ["past", L("Past", "ماضي")], ["canceled", L("Canceled", "ملغى")]] },
          ]),
          onApply: (dd) => { uctl.state.extra = dd; uctl.state.page = 1; uctl.paint(); } });
      });
      return;
    }
    /* CreatePage: without add_promo_code the page is the NotHavePermissions card */
    if (isNew) return RD.can("add_promo_code") ? couponNew(mount, ctx, d, cur) : (mount.innerHTML = RD.noPermission());
    mount.innerHTML = (ctx.newBtn ? "" : listHead(L("Coupons", "كوبونات"))) + `<div data-l></div>`;
    const ctl = SA.list({ mount: mount.querySelector("[data-l]"), data: d.coupons,
      tiles: true,
      pills: [{ key: "", label: ["All", "الكل"], icon: "megaphone" }, { key: "active", label: ["Active", "نشط"], icon: "check", tone: "primary" }, { key: "inactive", label: ["Inactive", "غير نشط"], icon: "close" }, { key: "expired", label: ["Expired", "منتهي"], icon: "clock", tone: "danger" }],
      pillMatch: (c, k) => !k || c.status === k, search: ["Search by the coupon code", "البحث برمز الكوبون"], minSearch: 3, searchMatch: (c, q) => c.code.toLowerCase().includes(q),
      empty: ["There is no data yet", "لا توجد بيانات بعد"],
      columns: [
        { head: ["Code", "الرمز"], cell: (c) => `<b>${esc(c.code)}</b>` },
        { head: ["Type", "النوع"], cell: (c) => esc(PP.cap(c.type)) },
        { head: ["Amount", "المبلغ"], cell: (c) => (c.discount_type === "fixed" ? `${c.value} ${cCur(c)}` : `${c.value}%`) },
        { head: ["Max amount", "المبلغ الأقصى"], cell: (c) => (c.max_amount ? `${c.max_amount} ${cCur(c)}` : L("Unlimited", "غير محدود")) },
        { head: ["Usage / limit", "الاستخدام / الحد"], cell: (c) => `${c.usage_limit || "∞"} / ${c.usage_limit_per_user || "∞"}` },
        { head: ["Dates", "التواريخ"], cell: (c) => `${esc(c.start_at)}<div class="t-xs text-tertiary">${esc(c.end_at)}</div>` },
        { head: ["Total discount amount", "إجمالي مبلغ الخصم"], cell: (c) => fmt(c.total_discount) },
        { head: ["Status", "الحالة"], cell: cStatus },
        { head: ["Actions", "الإجراءات"], cell: (c) => `<div class="row gap-1">
            <a class="icon-btn" data-perm="view_coupon_usages" href="${PP.href("coupons", { usage: c.id })}" aria-label="${L("Usage details", "تفاصيل الاستخدام")}" data-tip="${L("Usage details", "تفاصيل الاستخدام")}">${ic("server")}</a>
            ${c.status === "expired" ? "" : SA.iconBtn("edit", L("Status", "الحالة"), `data-st="${c.id}" data-perm="update_promo_code"`)}
            <a class="icon-btn" href="${PP.href("coupons", { view: c.id })}" aria-label="${L("View", "عرض")}" data-tip="${L("View", "عرض")}">${ic("eye")}</a>
            ${SA.iconBtn("trash", L("Delete", "حذف"), `data-del="${c.id}" data-perm="delete_promo_code"`)}</div>` },
      ] });
    mount.addEventListener("click", (e) => {
      const s = e.target.closest("[data-st]"), del = e.target.closest("[data-del]");
      if (s) {
        const c = ctl.rowById(s.dataset.st);
        const el = SA.modal({ id: "ppCst", title: esc(c.code), body: `<div data-msg></div>` + SA.field(["Status", "الحالة"], `<div class="select"><select data-f="s"><option value="active" ${c.status === "active" ? "selected" : ""}>${L("Active", "نشط")}</option><option value="inactive" ${c.status === "inactive" ? "selected" : ""}>${L("Inactive", "غير نشط")}</option><option value="expired" disabled ${c.status === "expired" ? "selected" : ""}>${L("Ended", "منتهي")}</option></select><span class="select__caret">${ic("chevronDown")}</span></div>`),
          foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${L("Update", "تحديث")}</button>` });
        ok(el, () => {
          /* EditModal.js: an expired coupon can't change status */
          if (c.status === "expired") { el.querySelector("[data-msg]").innerHTML = `<div class="alert alert--danger" style="margin-bottom:var(--space-3)"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${L("You can not change status for Expired item", "لا يمكنك تغيير حالة العنصر المنتهي")}</div></div>`; return setTimeout(() => SA.close(el), 2000); }
          const v = el.querySelector('[data-f="s"]').value; /* PUT /coupons/{id} {status, _method:'put'} */
          c.status = v; c.logs.unshift({ id: c.logs.length + 1, admin: { name: "Super Admin" }, status: v, created_at: new Date().toISOString().slice(0, 16).replace("T", " ") }); SA.close(el); ctl.paint();
        });
      }
      if (del) { const c = ctl.rowById(del.dataset.del); confirmDelete(L("Delete item", "حذف العنصر"), L("Are you sure you want to delete this coupon?", "هل أنت متأكد أنك تريد حذف هذا الكوبون؟"), () => { d.coupons.splice(d.coupons.indexOf(c), 1); ctl.paint(); }); }
    });
  };

  /* New coupon — only reachable by URL in the dashboard (no button on the list).
     Mirrors CreatePage.js (marketing/coupons and the partner profile copy):
     POST /coupons {code, description, status, users[], type: 'geographic'|'partners',
       branches[], units[], discount_type: 'fixed'|'percentage', discount_value,
       min_booking_amount, max_amount_applied, usage_limit|null, usage_limit_per_user|null,
       start_at, end_at (YYYY-MM-DD HH:mm:ss, Asia/Riyadh),
       country_iso, states[], cities[] (+ partner_id when type = partners)}
     Options: GET /general/countries · /general/states?country_iso= · /general/cities?states[]=
     · /users?limit=100 · /general/partners?status=active&country=&states=&cities=&limit=100
     · /partners/{id}/branches · /general/units?branches[]= */
  function couponNew(mount, ctx, d, cur) {
    const p = ctx.partner, G = HF.SA.GEO;
    const uniq = (a, k) => a.filter((x, i) => a.findIndex((y) => k(y) === k(x)) === i);
    const COUNTRIES = uniq(G.map((g) => g.country), (c) => c.iso);
    const USERS = HF.SA.users.slice(0, 40).filter((u) => u.high_five_user_name);
    const nowLocal = () => { const n = new Date(); n.setMinutes(n.getMinutes() - n.getTimezoneOffset()); return n.toISOString().slice(0, 16); };
    /* the profile copy starts "For partner" with this partner; the global page starts "Geographic" */
    const f = { code: "", description: "", status: "active", all_users: true, users: [], type: ctx.global ? "geographic" : "partners",
      country: "", states: [], cities: [], partner: ctx.global ? "" : String(p.id), branches_type: "all", branches: [], units_type: "all", units: [],
      discount_type: "fixed", value: "", pct: "", max: "", min: "", ul: "unlimited", uln: "", ulu: "unlimited", ulun: "", start: nowLocal(), end: nowLocal(), tab: "type" };
    let open = null, tried = false, currency = cur;
    const partnerOf = (id) => { const x = HF.SA.partners.find((q) => String(q.id) === String(id)); if (x) PP.extend(x); return x; };
    const statesOf = (iso) => uniq(G.filter((g) => g.country.iso === iso).map((g) => g.state), (s) => s.id);
    const citiesOf = (ids) => G.filter((g) => ids.includes(String(g.state.id))).map((g) => g.city);
    /* active partners, filtered by the chosen location (partnersParams) */
    const partners = () => HF.SA.partners.filter((x) => (x.active === "active" || x.active === 1) && (!f.country || x.country.iso === f.country) && (!f.states.length || f.states.includes(String(x.state.id))) && (!f.cities.length || f.cities.includes(String(x.city.id))));
    const unitsOf = (pp) => HF.SA.units.filter((u) => u.partner.id === pp.id).map((u, i) => ({ id: String(u.id), name: u.name, branch: (pp.branches[i % pp.branches.length] || {}) }));
    const radio = (name, val, label, dis) => `<label class="check check--radio"${dis ? ' style="opacity:.5"' : ""}><input type="radio" name="${name}" value="${val}" data-r="${name}" ${f[name] === val ? "checked" : ""} ${dis ? "disabled" : ""}><span class="check__box"><span class="check__dot"></span></span>${label}</label>`;
    const errL = (m) => `<span class="field__error">${ic("warn")} ${m}</span>`;
    /* searchable multi-select: chips in the trigger, a checklist under it */
    const msel = (key, opts, ph, dis) => {
      const sel = f[key], labels = opts.filter((o) => sel.includes(String(o[0])));
      return `<div class="cp-msel" style="position:relative">
        <button type="button" class="input" data-msel="${key}" ${dis ? "disabled" : ""} aria-haspopup="listbox" aria-expanded="${open === key}" style="display:flex;align-items:center;gap:var(--space-1);flex-wrap:wrap;min-height:44px;height:auto;padding-block:6px;text-align:start;cursor:${dis ? "not-allowed" : "pointer"}">
          ${labels.length ? labels.map((o) => `<span class="chip" style="height:24px">${esc(o[1])}</span>`).join("") : `<span class="text-tertiary">${ph}</span>`}<span style="margin-inline-start:auto;display:inline-flex">${ic("chevronDown")}</span></button>
        ${open === key && !dis ? `<div class="menu menu--select is-open" role="listbox" aria-multiselectable="true" style="inset-inline:0;min-width:0">
          ${opts.length > 6 ? `<div class="input-wrap" style="margin-bottom:var(--space-2)"><span class="input-wrap__icon">${ic("search")}</span><input class="input" data-msearch="${key}" placeholder="${L("Search", "بحث")}" aria-label="${L("Search", "بحث")}"></div>` : ""}
          ${opts.map((o) => `<label class="check" data-opt="${esc(String(o[1]).toLowerCase())}"><input type="checkbox" data-m="${key}" value="${esc(o[0])}" ${sel.includes(String(o[0])) ? "checked" : ""}><span class="check__box">${ic("check")}</span>${esc(o[1])}</label>`).join("") || `<span class="t-xs text-tertiary">${L("No options", "لا توجد خيارات")}</span>`}
        </div>` : ""}</div>`;
    };
    /* single searchable select (the partner) */
    const ssel = (key, opts, ph) => {
      const cur1 = opts.find((o) => String(o[0]) === String(f[key]));
      return `<div class="cp-msel" style="position:relative">
        <button type="button" class="input" data-msel="${key}" aria-haspopup="listbox" aria-expanded="${open === key}" style="display:flex;align-items:center;gap:var(--space-2);text-align:start;cursor:pointer"><span class="${cur1 ? "" : "text-tertiary"}" style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${cur1 ? esc(cur1[1]) : ph}</span>${ic("chevronDown")}</button>
        ${open === key ? `<div class="menu menu--select is-open" role="listbox" style="inset-inline:0;min-width:0">
          <div class="input-wrap" style="margin-bottom:var(--space-2)"><span class="input-wrap__icon">${ic("search")}</span><input class="input" data-msearch="${key}" placeholder="${L("Search", "بحث")}" aria-label="${L("Search", "بحث")}"></div>
          ${opts.map((o) => `<button type="button" class="menu__item" role="option" data-opt="${esc(String(o[1]).toLowerCase())}" data-pick="${key}" data-v="${esc(o[0])}" aria-selected="${String(o[0]) === String(f[key])}" style="width:100%;text-align:start">${esc(o[1])}</button>`).join("") || `<span class="t-xs text-tertiary">${L("No options", "لا توجد خيارات")}</span>`}
        </div>` : ""}</div>`;
    };
    const TABS = [["type", L("Coupon type", "نوع الكوبون")], ["discount", L("Discount type", "نوع الخصم")], ["usage", L("Usage limit", "حد الاستخدام")], ["sched", L("Schedules", "الجداول الزمنية")]];
    const affix = (k, ph, type) => `<div class="input-affix"><input class="input" ${type ? `type="${type}"` : ""} data-f="${k}" value="${esc(f[k])}" placeholder="${ph}"><span class="affix">${currency}</span></div>`;
    const pt = () => partnerOf(f.partner);
    const panel = () => {
      if (f.tab === "type") {
        const geo = f.type === "geographic";
        const states = f.country ? statesOf(f.country) : [], cities = f.states.length ? citiesOf(f.states) : [];
        const P = pt();
        const branchOpts = P ? P.branches.map((b) => [String(b.id), b.name]) : [];
        const unitOpts = P ? unitsOf(P).filter((u) => f.branches.includes(String(u.branch.id))).map((u) => [u.id, `${u.branch.name || "---"} - ${u.name}`]) : [];
        const unitsOk = f.branches_type === "specific" && f.branches.length > 0;
        return `<div class="row gap-5">${radio("type", "geographic", L("Geographic", "جغرافي"))}${radio("type", "partners", L("For partner", "للشريك"))}</div>
        ${SA.field(["Country", "الدولة"], SA.select([["", geo ? L("Select a country...", "اختر الدولة...") : L("All countries", "جميع الدول"), !f.country]].concat(COUNTRIES.map((c) => [c.iso, c.name, f.country === c.iso])), 'data-geo="country"')
          + (geo && tried && !f.country ? errL(L("Country is required", "الدولة مطلوبة")) : ""), { req: geo })}
        <div class="grid grid-2">${SA.field(["State", "المحافظة"], msel("states", states.map((s) => [String(s.id), s.name]), L("All states", "جميع المحافظات"), !f.country))}${SA.field(["City", "المدينة"], msel("cities", cities.map((c) => [String(c.id), c.name]), L("All cities", "جميع المدن"), !f.states.length))}</div>
        ${geo ? "" : `${SA.field(["Specific partner", "شريك محدد"], ssel("partner", partners().map((x) => [String(x.id), `${x.company_name} (#${x.id} - ${x.owner_name || "---"})`]), L("Select partner...", "اختر الشريك...")))}
          <h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Branches", "الفروع")}</h4><div class="row gap-5">${radio("branches_type", "all", L("All branches", "جميع الفروع"))}${radio("branches_type", "specific", L("Specific branches", "فروع محددة"))}</div>
          ${f.branches_type === "specific" ? msel("branches", branchOpts, L("Select branches...", "اختر الفروع..."), !P) + (!f.branches.length ? errL(L("Partner branches required if specific branch selected", "الفروع مطلوبة إذا تم اختيار فرع محدد")) : "") : ""}
          <h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Units", "الوحدات")}</h4><div class="row gap-5">${radio("units_type", "all", L("All units", "جميع الوحدات"))}${radio("units_type", "specific", L("Specific units", "وحدات محددة"), !unitsOk)}</div>
          ${f.units_type === "specific" ? msel("units", unitOpts, L("Select units...", "اختر الوحدات..."), !unitsOk) + (!f.units.length ? errL(L("Partner units required if specific unit selected", "الوحدات مطلوبة إذا تم اختيار وحدة محددة")) : "") : ""}`}`;
      }
      if (f.tab === "discount") return `<div class="row gap-5">${radio("discount_type", "fixed", L("Fixed", "ثابت"))}${radio("discount_type", "percentage", L("Percentage", "نسبة مئوية"))}</div>
        ${f.discount_type === "fixed" ? `${SA.field(["Coupon amount", "مبلغ الكوبون"], affix("value", L("Enter coupon amount", "أدخل مبلغ الكوبون"), "number"))}${SA.field(["Min booking / join price", "الحد الأدنى لسعر الحجز / الانضمام"], affix("min", L("Unlimited", "غير محدود")))}`
          : `${SA.field(["Coupon percentage", "نسبة الكوبون"], SA.select([["", L("Select a percentage...", "اختر النسبة...")]].concat(Array.from({ length: 20 }, (_, i) => [(i + 1) * 5, `${(i + 1) * 5}%`, String(f.pct) === String((i + 1) * 5)])), 'data-f="pct"'))}
            ${SA.field(["Max amount", "المبلغ الأقصى"], affix("max", L("Unlimited", "غير محدود")))}${SA.field(["Min booking / join price", "الحد الأدنى لسعر الحجز / الانضمام"], affix("min", L("Unlimited", "غير محدود")))}`}`;
      if (f.tab === "usage") return `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Usage limit", "حد الاستخدام")}</h4><div class="row gap-5">${radio("ul", "unlimited", L("Unlimited", "غير محدود"))}${radio("ul", "limited", L("Limited", "محدود"))}</div>
        ${f.ul === "limited" ? SA.field(["The limit number", "رقم الحد"], `<input class="input" inputmode="numeric" placeholder="50" data-f="uln" value="${esc(f.uln)}">`) : ""}
        <h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Usage limit per user", "حد الاستخدام لكل مستخدم")}</h4><div class="row gap-5">${radio("ulu", "unlimited", L("Unlimited", "غير محدود"))}${radio("ulu", "limited", L("Limited", "محدود"))}</div>
        ${f.ulu === "limited" ? SA.field(["The limit number per user", "رقم الحد لكل مستخدم"], `<input class="input" inputmode="numeric" placeholder="50" data-f="ulun" value="${esc(f.ulun)}">`) : ""}`;
      return `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Date range schedules", "جداول النطاق الزمني")}</h4>
        <div class="grid grid-2">${SA.field(["Start date", "تاريخ البدء"], `<input class="input" type="datetime-local" data-f="start" value="${f.start}">`)}${SA.field(["Expiry date", "تاريخ الانتهاء"], `<input class="input" type="datetime-local" data-f="end" value="${f.end}">`)}</div>`;
    };
    let errors = null, painted = false;
    const paint = () => {
      const focus = document.activeElement && mount.contains(document.activeElement) && document.activeElement.dataset.msearch;
      mount.innerHTML = listHead(L("New coupon", "قسيمة جديدة"), `<a class="btn btn--sm btn--secondary" href="${PP.href("coupons")}">${L("Cancel", "إلغاء")}</a><button class="btn btn--sm" data-create>${L("Create", "إنشاء")}</button>`)
        + (errors && errors.length ? `<div class="alert alert--danger"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${errors.map((x) => `<div>${x}</div>`).join("")}</div></div>` : "")
        + card(L("Code", "الرمز"), "", `<div class="stack gap-4">
          ${SA.field(["Code", "الرمز"], `<input class="input" data-f="code" value="${esc(f.code)}" placeholder="${L("Enter code", "أدخل الرمز")}">`)}
          ${SA.field(["Description", "الوصف"], `<textarea class="input" rows="3" data-f="description" placeholder="${L("Enter description", "أدخل الوصف")}">${esc(f.description)}</textarea>`)}
          ${SA.field(["Status", "الحالة"], SA.select([["active", L("Active", "نشط"), f.status === "active"], ["inactive", L("Inactive", "غير نشط"), f.status === "inactive"]], 'data-f="status"'))}
          <div><label class="check"><input type="checkbox" data-all-users ${f.all_users ? "checked" : ""}><span class="check__box">${ic("check")}</span>${L("All users", "جميع المستخدمين")}</label>
            ${!f.all_users && !f.users.length ? errL(L("Must be checked if no specific users selected", "يجب تحديده إذا لم يتم اختيار مستخدمين محددين")) : ""}</div>
          ${SA.field(["Specific users", "مستخدمون محددون"], msel("users", USERS.map((u) => [String(u.id), `${u.name} (#${u.high_five_user_name})`]), L("Select users...", "اختر المستخدمين...")))}</div>`)
        + card(L("Roles", "الأدوار"), "", `<div class="sa-side"><nav class="sa-side__nav">${TABS.map(([k, t]) => `<a href="#" data-tab="${k}" class="${k === f.tab ? "is-active" : ""}">${t}</a>`).join("")}</nav><div class="stack gap-4">${panel()}</div></div>`);
      if (focus) { const s = mount.querySelector(`[data-msearch="${focus}"]`); if (s) s.focus(); }
      /* the form repaints on every choice — only the first paint animates in */
      if (painted) mount.querySelectorAll(".animate-in").forEach((x) => x.classList.remove("animate-in"));
      painted = true;
    };
    /* location changes clear the partner, its branches and units (and re-filter partners) */
    const clearPartner = () => { if (ctx.global || f.type === "geographic") f.partner = ""; f.branches = []; f.units = []; f.units_type = "all"; };
    const setCurrency = () => {
      const P = f.type === "partners" && pt();
      currency = P ? curOf(P.country.iso) : f.country ? curOf(f.country) : cur;
    };
    mount.addEventListener("input", (e) => {
      const ms = e.target.dataset.msearch;
      if (ms) { const q = e.target.value.toLowerCase(); e.target.closest(".menu").querySelectorAll("[data-opt]").forEach((o) => (o.hidden = !o.dataset.opt.includes(q))); return; }
      const k = e.target.dataset.f; if (k) f[k] = e.target.value;
    });
    mount.addEventListener("change", (e) => {
      const k = e.target.dataset.f, r = e.target.dataset.r, m = e.target.dataset.m, g = e.target.dataset.geo;
      if (e.target.matches("[data-all-users]")) { f.all_users = e.target.checked; if (f.all_users) f.users = []; return paint(); }
      if (m) {
        const s = new Set(f[m]); e.target.checked ? s.add(e.target.value) : s.delete(e.target.value); f[m] = [...s];
        if (m === "users" && f.users.length) f.all_users = false;
        if (m === "states") { f.cities = []; clearPartner(); }
        if (m === "cities") clearPartner();
        if (m === "branches") { f.units = []; if (!f.branches.length) f.units_type = "all"; }
        return paint();
      }
      if (g === "country") { f.country = e.target.value; f.states = []; f.cities = []; clearPartner(); setCurrency(); return paint(); }
      if (k) f[k] = e.target.value;
      if (r) {
        f[r] = e.target.value;
        if (r === "type") { f.country = ""; f.states = []; f.cities = []; f.partner = ctx.global ? "" : String(p.id); f.branches_type = "all"; f.branches = []; f.units_type = "all"; f.units = []; setCurrency(); }
        if (r === "branches_type" && f.branches_type === "all") { f.branches = []; f.units_type = "all"; f.units = []; }
        paint();
      }
    });
    mount.addEventListener("click", (e) => {
      const t = e.target.closest("[data-tab]");
      if (t) { e.preventDefault(); f.tab = t.dataset.tab; open = null; return paint(); }
      const ms = e.target.closest("button[data-msel]");
      if (ms) { open = open === ms.dataset.msel ? null : ms.dataset.msel; return paint(); }
      const pk = e.target.closest("[data-pick]");
      if (pk) { f[pk.dataset.pick] = pk.dataset.v; f.branches = []; f.units = []; f.units_type = "all"; open = null; setCurrency(); return paint(); }
      /* outside click closes the open picker — without a repaint, so the click's own change still lands */
      if (open && !e.target.closest(".cp-msel")) {
        const mm = mount.querySelector(".cp-msel .menu");
        if (mm) mm.remove();
        const tb = mount.querySelector(`[data-msel="${open}"]`);
        if (tb) tb.setAttribute("aria-expanded", "false");
        open = null;
      }
      if (e.target.closest("[data-create]")) {
        tried = true;
        const er = [], code = f.code.trim();
        if (!code) er.push(L("Code is required", "الرمز مطلوب")); else if (code.length < 3) er.push(L("Minimum 3 symbols", "3 رموز على الأقل"));
        else if (code.length > 200) er.push(L("Maximum 50 symbols", "50 رمز على الأكثر")); /* the dashboard's max(200) carries the "Maximum 50 symbols" text */
        if (!f.all_users && !f.users.length) er.push(L("Must be checked if no specific users selected", "يجب تحديده إذا لم يتم اختيار مستخدمين محددين"));
        if (f.type === "geographic" && !f.country) er.push(L("Country is required", "الدولة مطلوبة"));
        if (f.type === "partners" && f.branches_type === "specific" && !f.branches.length) er.push(L("Partner branches required if specific branch selected", "الفروع مطلوبة إذا تم اختيار فرع محدد"));
        if (f.type === "partners" && f.units_type === "specific" && !f.units.length) er.push(L("Partner units required if specific unit selected", "الوحدات مطلوبة إذا تم اختيار وحدة محددة"));
        if (f.discount_type === "fixed") { if (f.value === "") er.push(L("Discount amount is required", "مبلغ الخصم مطلوب")); else if (+f.value < 1) er.push(L("Coupon amount must be greater than 0 for fixed discount type", "يجب أن يكون مبلغ الكوبون أكبر من 0 لنوع الخصم الثابت")); }
        else if (!f.pct) er.push(L("Discount percentage is required", "نسبة الخصم مطلوبة"));
        /* usage numbers: Yup.number().integer() */
        const num = (v, req) => (v === "" ? req : isNaN(Number(v)) ? L("Must be a number", "يجب أن يكون رقمًا") : !Number.isInteger(Number(v)) ? L("Must be integer", "يجب أن يكون عدد صحيح") : "");
        if (f.ul === "limited") { const m = num(f.uln, L("Please enter the usage number", "يرجى إدخال رقم الاستخدام")); if (m) er.push(m); }
        if (f.ulu === "limited") { const m = num(f.ulun, L("Please enter the usage number per user", "يرجى إدخال رقم الاستخدام لكل مستخدم")); if (m) er.push(m); }
        if (!f.start) er.push(L("Start date is required", "تاريخ البدء مطلوب"));
        if (!f.end) er.push(L("Expiry date is required", "تاريخ الانتهاء مطلوب")); else if (f.end <= f.start) er.push(L("End date must be after start date", "يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء"));
        errors = er;
        if (er.length) return paint();
        const P = f.type === "partners" ? pt() : null, ctry = G.find((g) => g.country.iso === (f.country || (P && P.country.iso))) || {};
        const byId = (arr, ids) => arr.filter((x) => ids.includes(String(x.id))).map((x) => ({ id: x.id, name: x.name }));
        /* POST /coupons — success shows the API message, then back to the list */
        d.coupons.unshift({ id: Date.now(), code, description: f.description, type: f.type, discount_type: f.discount_type, value: +(f.discount_type === "fixed" ? f.value : f.pct), max_amount: f.max ? +f.max : null, min_amount: +f.min || 0,
          usage_limit: f.ul === "limited" ? +f.uln : null, usage_limit_per_user: f.ulu === "limited" ? +f.ulun : null, start_at: f.start.replace("T", " "), end_at: f.end.replace("T", " "), total_discount: 0, status: f.status,
          country_name: ctry.country ? ctry.country.name : null, currency, states: byId(statesOf(f.country), f.states), cities: byId(G.map((g) => g.city), f.cities),
          users: USERS.filter((u) => f.users.includes(String(u.id))).map((u) => ({ name: u.name, username: u.high_five_user_name })),
          partner_name: P ? P.company_name : null, branches: P ? byId(P.branches, f.branches) : [], units: P ? byId(unitsOf(P), f.units) : [], _p: P || undefined, logs: [] });
        PP.go("coupons");
      }
    });
    setCurrency();
    paint();
  }
})();
