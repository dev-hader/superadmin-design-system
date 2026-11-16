/* Partner profile — people & money tabs: customers (high five · manual) ·
   memberships (members · categories · category units) · financials ·
   activity-log (+ detail) · coupons (list · view · usage details · new).
   Mirrors pages/partners/profile/{customers,memberships,financials,
   activity-log,marketing/coupons}. */
(function () {
  "use strict";
  const { L, esc, ic, badge, fmt } = SA;
  const { card, kv, btn, avatar, backBtn, confirmDelete, rng } = PP;
  const ok = (el, fn) => (el.querySelector("[data-ok]").onclick = fn);
  const listHead = (title, extra) => `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${title}</h3><div class="row gap-2">${extra || ""}</div></div>`;
  const eye = (href) => `<a class="icon-btn" href="${href}" aria-label="${L("View", "عرض")}">${ic("eye")}</a>`;
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
        record: { id: 500 + i, label: pick(["Booking #4821", "Padel Court 1", "Omar Khalid", "SUMMER10"]), exists: i % 6 !== 5 } })),
      coupons: ["SUMMER10", "WELCOME25", "PADEL50", "KIDSFREE", "RAMADAN15"].map((code, i) => ({ id: 330 + i, code, description: i % 2 ? "" : "Seasonal discount for HighFive users.", type: i % 3 === 2 ? "geographic" : "partners", discount_type: i % 2 ? "percentage" : "fixed", value: i % 2 ? 15 : 25,
        max_amount: i % 2 ? 50 : null, min_amount: 100, usage_limit: i % 3 ? 200 : null, usage_limit_per_user: i % 2 ? 1 : null, start_at: "2026-10-01 00:00", end_at: i === 4 ? "2026-10-31 23:59" : "2026-12-31 23:59",
        total_discount: [1250, 840, 0, 320, 2100][i], status: i === 4 ? "expired" : i === 3 ? "inactive" : "active", country_name: p.country.name, logs: [{ id: 1, admin: { name: "Super Admin" }, status: i === 3 ? "inactive" : "active", created_at: "2026-10-01 09:00" }] })),
    };
    return p._people;
  }

  /* ================= customers ================= */
  PP.tabs.customers = (mount, ctx) => {
    const d = people(ctx.partner).customers;
    const type = ctx.params.get("type") === "manual" ? "manual" : "high-five";
    const counts = { "high-five": d.filter((c) => c.type === "high-five").length, manual: d.filter((c) => c.type === "manual").length };
    const sub3 = L(" (Coming - past - canceled)", " (قادم - ماضي - ملغي)");
    mount.innerHTML = listHead(L("customers", "العملاء"), `<div class="segmented">${[["high-five", L("high five", "هاي فايف")], ["manual", L("manual", "يدوي")]].map(([k, t]) => `<a href="${PP.href("customers", { type: k })}" class="btn btn--sm ${k === type ? "" : "btn--ghost"}" style="${k === type ? "" : ""}">${t} (${counts[k]})</a>`).join("")}</div>`) + `<div data-l></div>`;
    /* the dashboard's colours are inverted on purpose here: blocked → primary, unblock → danger */
    const blk = (v) => (v === 1 ? badge("primary", L("blocked", "محظور")) : badge("danger", L("unblock", "غير محظور")));
    SA.list({ mount: mount.querySelector("[data-l]"), data: d.filter((c) => c.type === type), search: ["search by name", "البحث بالاسم"], searchMatch: (r, q) => r.name.toLowerCase().includes(q), empty: ["there is no data to display", "لا توجد بيانات للعرض"],
      columns: type === "manual" ? [
        { head: ["name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b>` },
        { head: ["phone", "الهاتف"], cell: (r) => `<span dir="ltr">${esc(r.phone)}</span>` },
        { head: [`booking${sub3}`, `الحجز${sub3}`], cell: (r) => `${r.upcoming} - ${r.past} - ${r.canceled}` },
      ] : [
        { head: ["name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b><div class="t-xs text-tertiary">@${esc(r.vie_id)}</div>` },
        { head: [`booking${sub3}`, `الحجز${sub3}`], cell: (r) => `${r.upcoming} - ${r.past} - ${r.canceled}` },
        { head: [`public event${sub3}`, `الحدث العام${sub3}`], cell: (r) => `${r.ev_up} - ${r.ev_past} - ${r.ev_can}` },
        { head: ["booking", "الحجز"], cell: (r) => blk(r.blocked_from_booking) },
        { head: ["public event", "الحدث العام"], cell: (r) => blk(r.blocked_from_event) },
        { head: ["Actions", "الإجراءات"], cell: () => eye("#") },
      ] });
  };

  /* ================= memberships ================= */
  PP.tabs.memberships = (mount, ctx) => {
    const d = people(ctx.partner), sec = ctx.params.get("sec") || "members", cat = ctx.params.get("cat");
    const arrow = ic(document.documentElement.dir === "rtl" ? "chevronLeft" : "chevronRight");
    if (cat) {
      const c = d.cats.find((x) => String(x.id) === cat) || d.cats[0];
      const units = HF.SA.units.filter((u) => u.partner.id === ctx.partner.id).slice(0, c.units);
      const tone = (v) => (v === "waiting" ? "warning" : v === "active" ? "primary" : "danger");
      mount.innerHTML = listHead(`${L("units", "الوحدات")} (${esc(c.name)})`, backBtn(PP.href("memberships", { sec: "categories" }))) + `<div data-l></div>`;
      SA.list({ mount: mount.querySelector("[data-l]"), data: units, empty: ["no data", "لا توجد بيانات"], columns: [
        { head: ["name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { head: ["category", "الفئة"], cell: (r) => esc(r.activity_category.name) },
        { head: ["Activity", "النشاط"], cell: (r) => esc(r.activity.name) },
        { head: ["type", "النوع"], cell: (r) => esc(r.type.name) },
        { head: ["capacity", "القدرة"], cell: (r) => esc(r.capacity) },
        { head: ["booking methodology", "منهجية الحجز"], cell: (r) => esc(r.booking_methodology) },
        { head: ["availability", "التوفر"], cell: (r) => `<span style="color:${r.availability === "Available" ? "var(--color-info)" : "var(--color-danger)"}">${esc(r.availability)}</span>` },
        { head: ["status", "الحالة"], cell: (r) => badge(tone(r.status.value), r.status.lable) },
        { head: ["Actions", "الإجراءات"], cell: () => eye("#") },
      ] });
      return;
    }
    if (sec === "categories") {
      mount.innerHTML = listHead(L("memberships categories", "فئات العضويات"), `<a class="btn btn--sm btn--secondary" href="${PP.href("memberships")}">${L("members", "الأعضاء")} ${arrow}</a>`) + `<div data-l></div>`;
      SA.list({ mount: mount.querySelector("[data-l]"), data: d.cats, search: ["search by name", "البحث بالاسم"], searchMatch: (r, q) => r.name.toLowerCase().includes(q), empty: ["no data", "لا توجد بيانات"], columns: [
        { head: ["name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b>` },
        { head: ["units", "الوحدات"], cell: (r) => `<a href="${PP.href("memberships", { cat: r.id })}" style="color:var(--color-text-link);font-weight:var(--weight-semibold)">${r.units} ${L("units", "الوحدات")}</a>` },
      ] });
      return;
    }
    mount.innerHTML = listHead(L("members", "الأعضاء"), `<a class="btn btn--sm btn--secondary" href="${PP.href("memberships", { sec: "categories" })}">${L("memberships categories", "فئات العضويات")} ${arrow}</a>`) + `<div data-l></div>`;
    const ctl = SA.list({ mount: mount.querySelector("[data-l]"), data: d.members,
      pills: [{ key: "", label: ["all", "الكل"] }, { key: "active", label: ["members", "الأعضاء"] }, { key: "requested", label: ["requested", "مطلوب"] }, { key: "expired", label: ["expired", "منتهي الصلاحية"] }],
      pillMatch: (r, k) => !k || r.status === k, search: ["search by name", "البحث بالاسم"], searchMatch: (r, q) => r.name.toLowerCase().includes(q),
      toolbarExtra: SA.select([["", L("category", "الفئة") + ": " + L("all", "الكل")]].concat(d.cats.map((c) => [c.id, c.name])), 'data-cat aria-label="' + L("category", "الفئة") + '"'),
      extraMatch: (r, f) => !f.cat || String(r.category_id) === f.cat,
      empty: ["there is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b><div class="t-xs text-tertiary">@${esc(r.app_user_id)}</div>` },
        { head: ["reference number", "رقم المرجع"], cell: (r) => `<span dir="ltr">${esc(r.reference_number)}</span>` },
        { head: ["category", "الفئة"], cell: (r) => esc(r.category_name) },
        { head: ["created", "تم الإنشاء"], cell: (r) => esc(r.created_at) },
        { head: ["ending on", "ينتهي في"], cell: (r) => (r.status === "requested" ? "---" : r.expired_at ? esc(r.expired_at) : L("open", "مفتوح")) },
        { head: ["status", "الحالة"], cell: (r) => badge(r.status === "active" ? "success" : r.status === "expired" ? "danger" : "warning", r.status) },
      ] });
    mount.addEventListener("change", (e) => { if (e.target.matches("[data-cat]")) { ctl.state.extra = { cat: e.target.value }; ctl.state.page = 1; ctl.paint(); } });
  };

  /* ================= financials ================= */
  PP.tabs.financials = (mount, ctx) => {
    const p = ctx.partner, r = rng(p.id + 999), int = (a, b) => a + Math.floor(r() * (b - a + 1));
    const hasPkg = HF.SA.packages.some((x) => x.partner.id === p.id);
    const myPkgs = HF.SA.packages.filter((x) => x.partner.id === p.id);
    const unitsOf = HF.SA.units.filter((u) => u.partner.id === p.id);
    const n2 = (v) => (v ? Number(v).toFixed(2) : "00.00");
    /* transactions: bookings / public events + (partners with packages) package sales */
    const tx = Array.from({ length: 18 }, (_, i) => ({ id: 81000 + i, cat: ["Sports", "Kids"][i % 2], catId: [1, 2][i % 2], act: ["Padel", "Trampoline"][i % 2],
      unit: (unitsOf[i % Math.max(1, unitsOf.length)] || { name: "Padel Court 1" }).name, type: ["online booking", "manual booking", "public event", "linked booking"][i % 4], tkey: ["online_booking", "manual_booking", "public_event", "linked_booking"][i % 4],
      tid: 4800 + i, status: ["coming", "ended", "ended", "canceled"][i % 4], date: "2026-" + String((i % 11) + 1).padStart(2, "0") + "-" + String((i % 27) + 1).padStart(2, "0") + " 1" + (i % 10) + ":00",
      amount: [180, 240, 60, 120][i % 4], pay: i % 3 ? "Online" : "Cash", pct: 10, fixed: 2, branch: (p.branches[i % p.branches.length] || {}).name }));
    if (hasPkg) myPkgs.forEach((k, i) => tx.push({ id: 82000 + i, pkg: k, plan: ["Monthly", "Quarterly", "Annual"][i % 3], cat: k.categories[0], catId: 1, act: k.categories[1], unit: k.name, type: ["Walk-in Sale", "Package Subscription", "Renewal", "Extension"][i % 4], tkey: ["walk_in", "subscription", "renewal", "extension"][i % 4],
      reference: "PKG-" + (5100 + i), status: ["active", "frozen", "expired", "cancelled", "upgraded"][i % 5], date: "2026-" + String((i % 11) + 1).padStart(2, "0") + "-1" + (i % 9) + " 12:00", amount: k.plans.from_price, collected: i % 2 ? k.plans.from_price : k.plans.from_price - 150,
      pay: i % 2 ? "Online" : "Cash", pct: 10, fixed: 0, branch: k.branches[0].name, ext: i % 4 === 3 ? { days: 10, visits: 2 } : null }));
    let f = {};
    const SUB = { active: ["success", L("Active", "نشط")], frozen: ["primary", L("Frozen", "مجمّد")], expired: ["", L("Expired", "منتهي")], cancelled: ["danger", L("Cancelled", "ملغى")], upgraded: ["primary", L("Upgraded", "تمت ترقيته")] };
    const match = (x) => (!f.year || x.date.startsWith(f.year)) && (!f.month || x.date.slice(5, 7) === f.month) && (!f.category || String(x.catId) === f.category) && (!f.activity || x.act === f.activity)
      && (!f.unit || x.unit === f.unit) && (!f.branch || x.branch === f.branch) && (!f.packages || !f.packages.length || (x.pkg && f.packages.includes(String(x.pkg.id))))
      && (!f.sub_status || x.status === f.sub_status) && (!f.ttype || x.tkey === f.ttype || (f.ttype === "all_packages" && x.pkg)) && (!f.pay || x.pay.toLowerCase() === f.pay);
    const stats = (rows) => {
      const o = { online_revenue: 0, online_collected: 0, cash_revenue: 0, cash_collected: 0 };
      rows.forEach((x) => { const on = x.pay === "Online"; o[on ? "online_revenue" : "cash_revenue"] += x.amount; o[on ? "online_collected" : "cash_collected"] += on ? x.amount : x.pkg ? x.collected : 0; });
      o.online_hi5_net = o.online_revenue * 0.1; o.online_partner_net = o.online_revenue * 0.9; o.cash_hi5_net = o.cash_revenue * 0.1; o.cash_partner_net = o.cash_revenue * 0.9; o.to_be_collected = o.cash_revenue - o.cash_collected;
      return o;
    };
    const statTable = (title, s, withNets, toCollectCol) => `<section class="card card--pad stack gap-3"><h4 class="t-title">${title}</h4>${SA.table({ rows: [
        [L("online", "عبر الإنترنت"), s.online_revenue, s.online_collected, `<span title="${L("collected by highfive", "محصل من هاي فايف")}" style="color:var(--color-danger)">${ic("info")}</span>`, s.online_hi5_net, s.online_partner_net, null],
        [L("cash", "نقدي"), s.cash_revenue, s.cash_collected, `<span title="${n2(s.cash_revenue - s.cash_collected)} ${L("SAR to be collected", "ريال سعودي للتحصيل")}" style="color:var(--color-danger)">${ic("info")}</span>`, s.cash_hi5_net, s.cash_partner_net, s.to_be_collected],
        [`<b>${L("total", "المجموع")} (SAR)</b>`, s.online_revenue + s.cash_revenue, s.online_collected + s.cash_collected, "", (s.online_hi5_net || 0) + (s.cash_hi5_net || 0), (s.online_partner_net || 0) + (s.cash_partner_net || 0), s.to_be_collected],
      ], empty: [""], columns: [{ head: ["", ""], cell: (x) => x[0] }, { head: ["revenue", "الإيرادات"], cell: (x) => n2(x[1]) }, { head: ["collected", "المحصل"], cell: (x) => `${n2(x[2])} ${x[3]}` }]
        .concat(withNets ? [{ head: ["Net HighFive", "صافي هاي فايف"], cell: (x) => n2(x[4]) }, { head: ["Net partner", "صافي الشريك"], cell: (x) => n2(x[5]) }] : [])
        .concat(toCollectCol ? [{ head: ["To be collected", "المتبقي للتحصيل"], cell: (x) => (x[6] == null ? "---" : `<span style="color:var(--color-warning)">${n2(x[6])}</span>`) }] : []) })}
      ${withNets && !toCollectCol ? `<div class="row between t-sm" style="color:var(--color-warning);font-weight:var(--weight-semibold)"><span>${L("To be collected by partner", "يحصّلها الشريك")}</span><span>${n2(s.to_be_collected)}</span></div>` : ""}</section>`;
    const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    function paint() {
      const rows = tx.filter(match);
      const nonPkg = rows.filter((x) => !x.pkg);
      const book = stats(nonPkg.filter((x) => x.tkey !== "public_event")), ev = stats(nonPkg.filter((x) => x.tkey === "public_event")), pk = stats(rows.filter((x) => x.pkg)), all = stats(rows);
      const when = f.year ? `${f.month ? f.month + " - " : ""}${f.year}` : L("All Times", "جميع الأوقات");
      const pkgNames = (f.packages || []).map((id) => (myPkgs.find((k) => String(k.id) === id) || {}).name).filter(Boolean);
      const active = Object.keys(f).filter((k) => f[k] && (!Array.isArray(f[k]) || f[k].length)).length;
      mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${L("financials transactions of", "المالية المعاملات من")} ${esc(when)} ${f.unit ? "| " + esc(f.unit) : L("in all units", "في جميع الوحدات")}${pkgNames.length ? " · " + pkgNames.map(esc).join(", ") : ""}</h3>
          <div class="row gap-2"><button type="button" class="btn btn--sm btn--secondary" data-export>${ic("upload")}<span>${L("Export", "تصدير")}</span></button>${PP.filterBtn(active)}</div></div>
        <div class="sa-stats">${statTable(L("booking", "الحجز"), book)}${statTable(L("public event", "الحدث العام"), ev)}${hasPkg ? statTable(L("Packages", "الباقات"), pk, true) : ""}${statTable(L("revenues", "الإيرادات"), all, true, true)}</div>
        <div data-l></div>`;
      SA.list({ mount: mount.querySelector("[data-l]"), data: rows, empty: ["there is no data to display", "لا توجد بيانات للعرض"], columns: [
        { head: ["#", "#"], cell: (x) => `#${x.id}` },
        { head: ["Activity", "النشاط"], cell: (x) => `${esc(x.cat)}<div class="t-xs text-tertiary">${esc(x.act)}</div>` },
        { head: ["unit", "الوحدة"], cell: (x) => (x.pkg ? `${esc(x.pkg.name)} · ${x.plan}<div class="t-xs text-tertiary">${esc(x.branch)}</div>` : esc(x.unit)) },
        { head: ["Transaction Type", "نوع المعاملة"], cell: (x) => `${x.type}<div class="t-xs text-tertiary">${x.pkg ? x.reference : "ID: #" + x.tid}</div>${x.ext ? `<div class="t-xs" style="color:var(--color-info)">${L("+" + x.ext.days + " days", "+" + x.ext.days + " يوم")} · ${L("+" + x.ext.visits + " visits", "+" + x.ext.visits + " زيارة")}</div>` : ""}` },
        { head: ["Booking Status", "حالة الحجز"], cell: (x) => (x.pkg ? badge(SUB[x.status][0], SUB[x.status][1]) : PP.sessionStatus(x.status)) },
        { head: ["date & time", "التاريخ والوقت"], cell: (x) => x.date },
        { head: ["revenue", "الإيرادات"], cell: (x) => `${x.amount} SAR<div class="t-xs text-tertiary">${x.pay}</div>` },
        { head: ["Collected Amount", "المبلغ المحصل"], cell: (x) => { const c = x.pkg ? x.collected : x.pay === "Online" ? x.amount : 0; return `${c} SAR<div class="t-xs text-tertiary">${x.pay === "Online" ? "HighFive" : "Partner"}</div>${x.pkg && x.amount - c > 0 ? `<div class="t-xs" style="color:var(--color-warning)">${L("Remaining " + (x.amount - c), "المتبقي " + (x.amount - c))}</div>` : ""}`; } },
        { head: ["Percentage", "النسبة المئوية"], cell: (x) => `${x.pct} %<div class="t-xs text-tertiary">${(x.amount * x.pct / 100).toFixed(2)}</div>` },
        { head: ["Fixed", "ثابت"], cell: (x) => x.fixed },
        { head: ["Net HighFive", "صافي هاي فايف"], cell: (x) => (x.amount * x.pct / 100 + x.fixed).toFixed(2) },
        { head: ["Net partner", "صافي الشريك"], cell: (x) => (x.amount - x.amount * x.pct / 100 - x.fixed).toFixed(2) },
        { head: ["Actions", "الإجراءات"], cell: (x) => (x.pkg ? SA.iconBtn("eye", L("View", "عرض"), `data-sale="${x.id}"`) : eye(x.tkey === "public_event" ? PP.href("public-events", { view: x.tid }) : PP.href("bookings", { view: x.tid }))) },
      ] });
    }
    mount.addEventListener("click", (e) => {
      if (e.target.closest("[data-export]")) {
        /* GET /partners/{id}/financials/export → financials_export.xlsx (sample exports the visible rows as CSV) */
        const rows = tx.filter(match);
        const csv = ["#,activity,unit,transaction type,status,date,revenue,payment"].concat(rows.map((x) => [x.id, x.act, x.pkg ? x.pkg.name : x.unit, x.type, x.status, x.date, x.amount, x.pay].map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(","))).join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        a.download = "financials_export.csv";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }
      const fb = e.target.closest("[data-filter]");
      if (fb) PP.filterPop(fb, { value: f, width: 340, cascade: { category: ["activity"] },
        fields: [
          { key: "year", label: ["year", "السنة"], placeholder: ["select year", "اختر السنة"], options: () => ["2026", "2025", "2024"].map((y) => [y, y]) },
          { key: "month", label: ["month", "الشهر"], placeholder: ["select month", "اختر الشهر"], options: () => MONTHS.map((m) => [m, m]) },
          { key: "category", label: ["category", "الفئة"], placeholder: ["select category", "اختر الفئة"], options: () => HF.SA.CATS.map((c) => [c.id, c.name]) },
          { key: "activity", label: ["Activity", "النشاط"], placeholder: ["select activity", "اختر النشاط"], options: (d) => (d.category ? HF.SA.ACTS[d.category] : []).map((a) => [a, a]) },
          { key: "unit", label: ["unit", "الوحدة"], placeholder: ["select unit", "اختر الوحدة"], options: () => unitsOf.map((u) => [u.name, u.name]) },
          { key: "branch", label: ["Branch", "الفرع"], options: () => p.branches.map((b) => [b.name, b.name]) },
        ].concat(hasPkg ? [
          { key: "packages", type: "checks", label: ["Package", "الباقة"], options: () => myPkgs.map((k) => [k.id, k.name]) },
          { key: "sub_status", label: ["Subscription status", "حالة الاشتراك"], options: () => Object.keys(SUB).map((k) => [k, SUB[k][1]]) },
        ] : []).concat([
          { key: "ttype", label: ["transactions type", "نوع المعاملات"], placeholder: ["select type", "اختر النوع"], options: () => [["online_booking", L("online booking", "حجز عبر الإنترنت")], ["linked_booking", L("linked booking", "حجز مرتبط")], ["manual_booking", L("manual booking", "حجز يدوي")], ["public_event", L("public event", "الحدث العام")]]
            .concat(hasPkg ? [["all_packages", L("All packages", "كل الباقات")], ["subscription", L("Package Subscription", "اشتراك باقة")], ["walk_in", L("Walk-in Sale", "بيع مباشر")], ["linked", L("Linked Sale", "بيع مرتبط")], ["renewal", L("Renewal", "تجديد")], ["upgrade", L("Upgrade", "ترقية")], ["extension", L("Extension", "تمديد")]] : []) },
          { key: "pay", label: ["payment method", "طريقة الدفع"], placeholder: ["select method", "اختر الطريقة"], options: () => [["cash", L("cash", "نقدي")], ["online", L("online", "عبر الإنترنت")]] },
        ]),
        onApply: (d) => { f = d; paint(); } });
      const sb = e.target.closest("[data-sale]");
      if (sb) {
        const x = tx.find((y) => String(y.id) === sb.dataset.sale);
        const sec = (title, rows) => `<h4 class="t-sm" style="font-weight:var(--weight-bold);margin-top:var(--space-2)">${title}</h4>${rows.length ? kv(rows) : "<p>—</p>"}`;
        const com = x.amount * x.pct / 100;
        SA.modal({ id: "ppSale", wide: true, title: L("Package transaction " + x.reference, "معاملة باقة " + x.reference),
          body: sec(L("Summary", "الملخص"), [[L("Packages", "الباقات"), `${esc(x.pkg.name)} · ${x.plan}`], [L("Transaction Type", "نوع المعاملة"), x.type], [L("date & time", "التاريخ والوقت"), x.date], [L("revenue", "الإيرادات"), x.amount + " SAR"], [L("collected", "المحصل"), `${x.collected} · ${x.pay === "Online" ? "HighFive" : "Partner"}`], [L("Remaining", "المتبقي"), x.amount - x.collected]])
            + sec(L("Collections", "التحصيلات"), [[`${x.date.slice(0, 10)} · ${x.pay === "Online" ? "Online" : "Cash desk"}`, x.collected]])
            + sec(L("Refunds", "المبالغ المستردة"), x.status === "cancelled" ? [[`${x.date.slice(0, 10)} · ${L("Cancelled by partner", "ألغاها الشريك")}`, 100]] : [])
            + sec(L("Tax breakdown", "تفاصيل الضرائب"), [["VAT (15%)", (x.amount * 0.15).toFixed(2)]])
            + sec(L("Commission applied", "العمولة المطبقة"), [[L("Rate", "النسبة"), x.pct + "%"], [L("Fixed", "ثابت"), x.fixed], [L("Source", "المصدر"), L("Partner contract", "عقد الشريك")], [L("Rule", "القاعدة"), L("Packages default", "افتراضي الباقات")], [L("Period", "الفترة"), "2026-01-01 → 2026-12-31"],
              [L("Base (collected)", "الأساس (المحصّل)"), x.collected], [L("Commission amount", "مبلغ العمولة"), com.toFixed(2)], [L("Fixed commission", "العمولة الثابتة"), x.fixed], [L("Net HighFive", "صافي هاي فايف"), (com + x.fixed).toFixed(2)], [L("Net partner", "صافي الشريك"), (x.amount - com - x.fixed).toFixed(2)]]),
          foot: `<a class="btn btn--ghost" href="#">${L("Subscriber details", "تفاصيل المشترك")}</a><button class="btn" data-close>${L("Close", "إغلاق")}</button>` });
      }
    });
    paint();
  };

  /* ================= activity log (+ detail) ================= */
  const ACT_TONE = { created: "success", updated: "info", deleted: "danger" };
  PP.tabs["activity-log"] = (mount, ctx) => {
    const d = people(ctx.partner), id = ctx.params.get("log");
    if (id) {
      const g = d.logs.find((x) => String(x.id) === id) || d.logs[0];
      const fields = g.action.value === "updated" ? [["status", "inactive", "active"], ["price", "150", "180"]] : [["name", null, g.record.label]];
      mount.innerHTML = listHead(L(`Activity #${g.id}`, `النشاط #${g.id}`), `<a class="btn btn--sm btn--secondary" href="${PP.href("activity-log")}">${L("Back to activity log", "العودة إلى سجل النشاط")}</a>`)
        + card(`${badge(ACT_TONE[g.action.value] || "warning", g.action.label.replace(/^./, (c) => c.toUpperCase()))} ${esc(g.record.label)} <span class="t-sm text-tertiary">#${g.record.id}</span>`, "", kv([
          [L("Date & time", "التاريخ والوقت"), esc(g.created_at)], [L("Module", "الوحدة"), esc(g.module.label)],
          [L("Related record", "السجل المرتبط"), `<span style="color:var(--color-primary-ink)">${esc(g.module.label)} #${g.record.id}</span>${g.record.exists ? "" : ` (${L("deleted", "محذوف")})`}`],
          [L("Performed by", "تم بواسطة"), `${esc(g.performed_by.name)} · ${esc(g.performed_by.role)}`], [L("Contact", "التواصل"), `${esc(g.performed_by.email)}<br><span dir="ltr">${esc(g.performed_by.phone)}</span>`]]))
        + card(g.action.value === "updated" ? L(`Changed fields (${fields.length})`, `الحقول المتغيرة (${fields.length})`) : L(`Fields (${fields.length})`, `الحقول (${fields.length})`), "",
          SA.table({ rows: fields, empty: [""], columns: g.action.value === "updated"
            ? [{ head: ["Field", "الحقل"], cell: (f) => `<b>${f[0]}</b>` }, { head: ["Before", "قبل"], cell: (f) => `<s style="color:var(--color-danger)">${f[1]}</s>` }, { head: ["After", "بعد"], cell: (f) => `<span style="color:var(--color-success)">${f[2]}</span>` }]
            : [{ head: ["Field", "الحقل"], cell: (f) => `<b>${f[0]}</b>` }, { head: ["Value", "القيمة"], cell: (f) => esc(f[2] || L("Not set", "غير محدد")) }] })
          + `<details><summary class="btn btn--sm btn--ghost">${L("View raw JSON", "عرض JSON الخام")}</summary><pre class="t-xs" style="overflow:auto;background:var(--color-surface-sunken);padding:var(--space-3);border-radius:var(--radius-md)">${esc(JSON.stringify(g, null, 2))}</pre></details>`);
      return;
    }
    const MODS = [["Operations", [["booking", "Bookings"], ["unit", "Units"]]], ["People", [["customer", "Customers"]]], ["Marketing", [["coupon", "Coupons"]]]];
    const modLabel = (sel) => (!sel.length ? L("All modules", "كل الوحدات") : sel.length <= 2 ? sel.map((v) => MODS.flatMap((g) => g[1]).find((m) => m[0] === v)[1]).join(", ") : L(sel.length + " modules", sel.length + " وحدات"));
    const performers = [...new Set(d.logs.map((x) => x.performed_by.name))];
    mount.innerHTML = listHead(L("activity log", "سجل النشاط")) + `<div class="row gap-2" style="flex-wrap:wrap">
        <button type="button" class="btn btn--sm btn--secondary" data-mods aria-haspopup="true">${ic("layers")}<span data-modlabel>${L("All modules", "كل الوحدات")}</span>${ic("chevronDown")}</button>
        ${SA.select([["", L("Performed by", "تم بواسطة")]].concat(performers.map((n) => [n, n])), 'data-f="performer"')}
        ${SA.select([["", L("All actions", "كل الإجراءات")], ["created", "Created"], ["updated", "Updated"], ["deleted", "Deleted"], ["blocked", "Blocked"]], 'data-f="action"')}
        ${SA.select([["", L("Actor type", "نوع الفاعل")], ["system_employee", L("System employee", "موظف نظام")], ["partner", L("Partner", "الشريك")]], 'data-f="actor"')}
        <input class="input" type="date" data-f="from" aria-label="${L("From", "من")}" style="max-width:170px"><input class="input" type="date" data-f="to" aria-label="${L("To", "إلى")}" style="max-width:170px">
      </div><div data-l></div>`;
    const ctl = SA.list({ mount: mount.querySelector("[data-l]"), data: d.logs, search: ["Search record name or #id", "ابحث باسم السجل أو رقمه"],
      searchMatch: (x, q) => x.record.label.toLowerCase().includes(q) || String(x.record.id).includes(q.replace("#", "")),
      extraMatch: (x, f) => (!f.modules || !f.modules.length || f.modules.includes(x.module.value)) && (!f.performer || x.performed_by.name === f.performer) && (!f.action || x.action.value === f.action) && (!f.actor || x.actor_type === f.actor) && (!f.from || x.created_at.slice(0, 10) >= f.from) && (!f.to || x.created_at.slice(0, 10) <= f.to),
      empty: ["There is no data to display.", "لا توجد بيانات للعرض."],
      columns: [
        { head: ["Date & time", "التاريخ والوقت"], cell: (x) => esc(x.created_at) },
        { head: ["Module", "الوحدة"], cell: (x) => esc(x.module.label) },
        { head: ["Action", "الإجراء"], cell: (x) => badge(ACT_TONE[x.action.value] || "warning", x.action.label.replace(/^./, (c) => c.toUpperCase())) },
        { head: ["Performed by", "تم بواسطة"], cell: (x) => `<b>${esc(x.performed_by.name)}</b><div class="t-xs text-tertiary">${esc(x.performed_by.role)}</div>${x.actor_type === "system_employee" ? badge("warning", L("System employee", "موظف نظام")) : ""}` },
        { head: ["Record", "السجل"], cell: (x) => esc(x.record.label) },
        { head: ["Details", "التفاصيل"], cell: (x) => eye(PP.href("activity-log", { log: x.id })) },
      ] });
    mount.addEventListener("change", (e) => { const k = e.target.dataset.f; if (!k) return; ctl.state.extra[k] = e.target.value; ctl.state.page = 1; ctl.paint(); });
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

  /* ================= coupons (list · view · usage · new) ================= */
  const cStatus = (c) => (c.status === "active" ? badge("primary", L("active", "نشط")) : c.status === "expired" ? badge("", L("Ended", "منتهي")) : badge("danger", L("Inactive", "غير نشط")));
  PP.couponsOf = (p) => people(p).coupons; /* partner-created coupons (Partner's Promo Codes list) */
  PP.tabs.coupons = (mount, ctx) => {
    /* ctx.coupons / ctx.newBtn / ctx.global: the Marketing pages (marketing-coupons.html) reuse this tab — in the dashboard it is the same UI, copied */
    const p = ctx.partner, d = ctx.coupons ? { coupons: ctx.coupons } : people(p), view = ctx.params.get("view"), usage = ctx.params.get("usage"), isNew = ctx.params.get("new");
    const back = `<a class="btn btn--sm btn--secondary" href="${PP.href("coupons")}">${L("Back To Coupons", "العودة إلى الكوبونات")}</a>`;
    const cur = p.country.iso === "EG" ? "EGP" : "SAR";
    if (view) {
      const c = d.coupons.find((x) => String(x.id) === view) || d.coupons[0], cp = c._p || p;
      mount.innerHTML = listHead(esc(c.code), back)
        + card(L("coupon code", "رمز الكوبون"), "", kv([[L("Code", "الرمز"), esc(c.code)], [L("Description", "الوصف"), c.description ? esc(c.description) : "---"], [L("status", "الحالة"), cStatus(c)]]))
        + card(L("Coupon Type", "نوع الكوبون"), "", kv([[L("Type", "النوع"), esc(c.type)], [L("country", "الدولة"), esc(c.country_name)], [L("State", "المحافظة"), "---"], [L("City", "المدينة"), "---"], [L("Users", "المستخدمون"), L("All Users", "جميع المستخدمين")]]
            .concat(c.type === "partners" ? [[L("Specific Partner", "شريك محدد"), esc(cp.company_name)], [L("Branches", "الفروع"), cp.branches.map((b) => esc(b.name)).join(", ")], [L("Units", "الوحدات"), L("All Units", "جميع الوحدات")]] : [])))
        + card(L("Discount Type", "نوع الخصم"), "", kv([[L("Type", "النوع"), esc(c.discount_type)], [L("Coupon Amount", "مبلغ الكوبون"), c.discount_type === "fixed" ? `${c.value} ${cur}` : `${c.value}%`], [L("Min Booking / Join Price", "الحد الأدنى لسعر الحجز / الانضمام"), `${c.min_amount} ${cur}`]]))
        + card(L("Usage Limit", "حد الاستخدام"), "", kv([[L("Usage Limit", "حد الاستخدام"), c.usage_limit || "∞"], [L("Usage Limit Per User", "حد الاستخدام لكل مستخدم"), c.usage_limit_per_user || "∞"]]))
        + card(L("Schedules", "الجداول الزمنية"), "", kv([[L("Start Date", "تاريخ البدء"), esc(c.start_at)], [L("Expire Date", "تاريخ الانتهاء"), esc(c.end_at)]]))
        + card(L("Coupon status History", "سجل حالة الكوبون"), "", SA.table({ rows: c.logs, empty: ["No logs available", "لا توجد سجلات متاحة"], columns: [
            { head: ["#", "#"], cell: (l) => l.id }, { head: ["Changed by", "تم التغيير بواسطة"], cell: (l) => esc(l.admin.name) },
            { head: ["Old Status", "الحالة القديمة"], cell: (l) => (l.status === "active" ? badge("danger", L("Inactive", "غير نشط")) : badge("primary", L("active", "نشط"))) },
            { head: ["New Status", "الحالة الجديدة"], cell: (l) => (l.status === "active" ? badge("primary", l.status) : badge("danger", l.status)) },
            { head: ["Change Date/Time", "تاريخ ووقت التغيير"], cell: (l) => esc(l.created_at) }] }));
      return;
    }
    if (usage) {
      const c = d.coupons.find((x) => String(x.id) === usage) || d.coupons[0], cp = c._p || p;
      const tab = ctx.params.get("ut") || "bookings";
      const users = NAMES.slice(0, 6);
      const rows = users.map((u, i) => ({ id: 4900 + i, created_at: `2026-11-0${i + 1} 12:00`, type: tab === "multi" ? "multi" : "booking", company: { id: cp.id, name: cp.company_name }, category: "Sports", activity: "Padel", branch: (cp.branches[0] || {}).name, unit: "Padel Court 1", start: `2026-11-1${i} 18:00`, end: `2026-11-1${i} 19:00`, user: u, username: `vie_${300 + i}`, status: ["coming", "ended", "canceled"][i % 3], discount: c.discount_type === "fixed" ? c.value : 20 }));
      const search = { bookings: ["Search by Booking ID , User name , Username , Company name , Unit name", "البحث بواسطة رقم الحجز، اسم المستخدم، اسم الشركة، اسم الوحدة"], joining: ["Search by Joining ID , User name , Username , Company name , Unit name", "البحث بواسطة رقم الانضمام، اسم المستخدم، اسم الشركة، اسم الوحدة"], multi: ["Search by Multi-Sessions ID , User name , Username , Company name , Unit name", "البحث بواسطة رقم الجلسات المتعددة، اسم المستخدم، اسم الشركة، اسم الوحدة"] }[tab];
      mount.innerHTML = listHead(esc(c.code), back) + `<div class="tabs">${[["bookings", L("Bookings list", "قائمة الحجوزات")], ["joining", L("Joining List", "قائمة الانضمام")], ["multi", L("Multi-Sessions List", "قائمة الجلسات المتعددة")]].map(([k, t]) => `<a href="${PP.href("coupons", { usage: c.id, ut: k })}" class="${k === tab ? "is-active" : ""}">${t}</a>`).join("")}</div><div data-l></div>`;
      const sol = (s) => `<span class="badge badge--${s === "coming" ? "success" : s === "ended" ? "primary" : "danger"}">${esc(s)}</span>`;
      const uctl = SA.list({ mount: mount.querySelector("[data-l]"), data: rows, search, searchMatch: (x, q) => x.user.toLowerCase().includes(q) || String(x.id).includes(q),
        toolbarExtra: PP.filterBtn(), empty: ["there is no data yet", "لا توجد بيانات بعد"],
        extraMatch: (x, fl) => (!fl.status || (fl.status === "past" ? x.status === "ended" : fl.status === "canceled" ? x.status === "canceled" : x.status === fl.status)) && (!fl.category || x.category === fl.category) && (!fl.activity || x.activity === fl.activity)
          && (!fl.session_from || x.start.slice(0, 10) >= fl.session_from) && (!fl.session_to || x.start.slice(0, 10) <= fl.session_to) && (!fl.booked_from || x.created_at.slice(0, 10) >= fl.booked_from) && (!fl.booked_to || x.created_at.slice(0, 10) <= fl.booked_to),
        columns: tab === "joining" ? [
          { head: ["ID", "المعرف"], cell: (x) => `#${x.id}<div class="t-xs text-tertiary">${x.created_at}</div>` },
          { head: ["Company", "الشركة"], cell: (x) => `${esc(x.company.name)}<div class="t-xs text-tertiary">ID #${x.company.id}</div>` },
          { head: ["Branch / Unit", "الفرع / الوحدة"], cell: (x) => `${esc(x.branch)}<div class="t-xs text-tertiary">${x.unit}</div>` },
          { head: ["Category / Activity", "الفئة / النشاط"], cell: (x) => `${x.category}<div class="t-xs text-tertiary">${x.activity}</div>` },
          { head: ["Public Event Time", "وقت الحدث العام"], cell: (x) => `${x.start}<div class="t-xs text-tertiary">${x.end}</div>` },
          { head: ["Age Group", "الفئة العمرية"], cell: () => "Adults" },
          { head: ["Session gender", "جنس الجلسة"], cell: () => "both" },
          { head: ["Users", "المستخدمون"], cell: (x) => `${esc(x.user)}<div class="t-xs text-tertiary">${x.username}</div>` },
          { head: ["joining status", "حالة الانضمام"], cell: () => L("joined", "منضم") },
          { head: ["Public event ID", "معرف الحدث العام"], cell: (x) => `#${x.id + 100}` },
          { head: ["Public event status", "حالة الحدث العام"], cell: (x) => sol(x.status) },
          { head: ["Coupon Usage Amount", "مبلغ استخدام الكوبون"], cell: (x) => `${x.discount} ${cur}` },
          { head: ["Actions", "الإجراءات"], cell: () => eye(PP.href("public-events")) },
        ] : [
          { head: ["ID", "المعرف"], cell: (x) => `#${x.id}<div class="t-xs text-tertiary">${x.created_at}</div>` },
          { head: ["Type", "النوع"], cell: (x) => x.type },
          { head: ["Company", "الشركة"], cell: (x) => `${esc(x.company.name)}<div class="t-xs text-tertiary">ID #${x.company.id}</div>` },
          { head: ["Category / Activity", "الفئة / النشاط"], cell: (x) => `${x.category}<div class="t-xs text-tertiary">${x.activity}</div>` },
          { head: ["Branch / Unit", "الفرع / الوحدة"], cell: (x) => `${esc(x.branch)}<div class="t-xs text-tertiary">${x.unit}</div>` },
          { head: ["Start At / End At", "البداية / النهاية"], cell: (x) => `${x.start}<div class="t-xs text-tertiary">${x.end}</div>` },
          { head: ["Users", "المستخدمون"], cell: (x) => `${esc(x.user)}<div class="t-xs text-tertiary">${x.username}</div>` },
          { head: ["status", "الحالة"], cell: (x) => sol(x.status) },
          { head: ["Coupon Usage Amount", "مبلغ استخدام الكوبون"], cell: (x) => `${x.discount} ${cur}` },
          { head: ["Actions", "الإجراءات"], cell: () => eye(PP.href("bookings")) },
        ] });
      mount.addEventListener("click", (e) => {
        const fb = e.target.closest("[data-filter]");
        if (!fb) return;
        PP.filterPop(fb, { value: uctl.state.extra, width: 340,
          fields: [
            { key: "session", type: "range", label: ["Session Date", "تاريخ الجلسة"] },
            { key: "booked", type: "range", label: tab === "joining" ? ["Joining Date", "تاريخ الانضمام"] : ["Booking Date", "تاريخ الحجز"] },
            { key: "category", label: ["Category", "الفئة"], placeholder: ["select category", "اختر الفئة"], options: () => HF.SA.CATS.map((c) => [c.name, c.name]) },
            { key: "activity", label: ["Activity", "النشاط"], placeholder: ["select Activity", "اختر النشاط"], options: () => ["Padel", "Football", "Trampoline"].map((a) => [a, a]) },
          ].concat(tab === "bookings" ? [{ key: "btype", label: ["Booking Type", "نوع الحجز"], placeholder: ["select Activity", "اختر النشاط"], options: () => [["online", L("online", "عبر الإنترنت")]] }] : [],
            tab === "joining" ? [{ key: "age", label: ["Age Groups", "الفئات العمرية"], placeholder: ["select Age Group", "اختر الفئة العمرية"], options: () => [["kids", "Kids"], ["adults", "Adults"]] }] : [], [
            { key: "gender", label: tab === "joining" ? ["Session gender", "جنس الجلسة"] : ["gender", "الجنس"], placeholder: ["select gender", "اختر الجنس"], options: () => [["male", L("male", "ذكر")], ["female", L("female", "أنثى")], ["both", L("both", "كلاهما")]] },
            { key: "status", label: tab === "joining" ? ["Public event status", "حالة الحدث العام"] : ["Session status", "حالة الجلسة"], placeholder: ["select status", "اختر الحالة"], options: () => [["coming", L("Coming", "قادم")], ["past", L("past", "ماضي")], ["canceled", L("canceled", "ملغى")]] },
          ]),
          onApply: (dd) => { uctl.state.extra = dd; uctl.state.page = 1; uctl.paint(); } });
      });
      return;
    }
    if (isNew) return couponNew(mount, ctx, d, cur);
    mount.innerHTML = (ctx.newBtn ? "" : listHead(L("Coupons", "كوبونات"))) + `<div data-l></div>`;
    const ctl = SA.list({ mount: mount.querySelector("[data-l]"), data: d.coupons,
      pills: [{ key: "", label: ["all", "الكل"] }, { key: "active", label: ["active", "نشط"] }, { key: "inactive", label: ["inactive", "غير نشط"] }, { key: "expired", label: ["expired", "منتهي"] }],
      pillMatch: (c, k) => !k || c.status === k, search: ["search by the coupon code", "البحث برمز الكوبون"], minSearch: 3, searchMatch: (c, q) => c.code.toLowerCase().includes(q),
      empty: ["there is no data yet", "لا توجد بيانات بعد"],
      columns: [
        { head: ["Code", "الرمز"], cell: (c) => `<b>${esc(c.code)}</b>` },
        { head: ["Type", "النوع"], cell: (c) => esc(c.type) },
        { head: ["amount", "المبلغ"], cell: (c) => (c.discount_type === "fixed" ? `${c.value} ${cur}` : `${c.value}%`) },
        { head: ["Max Amount", "المبلغ الأقصى"], cell: (c) => (c.max_amount ? `${c.max_amount} ${cur}` : L("Unlimited", "غير محدود")) },
        { head: ["Usage / Limit", "الاستخدام / الحد"], cell: (c) => `${c.usage_limit || "∞"} / ${c.usage_limit_per_user || "∞"}` },
        { head: ["Dates", "التواريخ"], cell: (c) => `${esc(c.start_at)}<div class="t-xs text-tertiary">${esc(c.end_at)}</div>` },
        { head: ["Total Discount Amount", "إجمالي مبلغ الخصم"], cell: (c) => fmt(c.total_discount) },
        { head: ["status", "الحالة"], cell: cStatus },
        { head: ["Actions", "الإجراءات"], cell: (c) => `<div class="row gap-1">
            <a class="icon-btn" href="${PP.href("coupons", { usage: c.id })}" aria-label="${L("Usage details", "تفاصيل الاستخدام")}">${ic("server")}</a>
            ${c.status === "expired" ? "" : SA.iconBtn("edit", L("status", "الحالة"), `data-st="${c.id}"`)}
            <a class="icon-btn" href="${PP.href("coupons", { view: c.id })}" aria-label="${L("View", "عرض")}">${ic("eye")}</a>
            ${SA.iconBtn("trash", L("delete", "حذف"), `data-del="${c.id}"`)}</div>` },
      ] });
    mount.addEventListener("click", (e) => {
      const s = e.target.closest("[data-st]"), del = e.target.closest("[data-del]");
      if (s) {
        const c = ctl.rowById(s.dataset.st);
        const el = SA.modal({ id: "ppCst", title: esc(c.code), body: SA.field(["status", "الحالة"], SA.select([["", L("select Status", "اختر الحالة")], ["active", L("active", "نشط"), c.status === "active"], ["inactive", L("Inactive", "غير نشط"), c.status === "inactive"]], 'data-f="s"')),
          foot: `<button class="btn btn--ghost" data-close>${L("cancel", "إلغاء")}</button><button class="btn" data-ok>${L("Updata", "تحديث")}</button>` });
        ok(el, () => { const v = el.querySelector('[data-f="s"]').value; if (!v) return; /* PUT /coupons/{id} */ c.status = v; c.logs.unshift({ id: c.logs.length + 1, admin: { name: "Super Admin" }, status: v, created_at: new Date().toISOString().slice(0, 16).replace("T", " ") }); SA.close(el); ctl.paint(); });
      }
      if (del) { const c = ctl.rowById(del.dataset.del); confirmDelete(L("delete item", "حذف العنصر"), L("Are you sure you want to delete this coupon?", "هل أنت متأكد أنك تريد حذف هذا الكوبون؟"), () => { d.coupons.splice(d.coupons.indexOf(c), 1); ctl.paint(); }); }
    });
  };

  /* New Coupon — only reachable by URL in the dashboard (no button on the list) */
  function couponNew(mount, ctx, d, cur) {
    const p = ctx.partner;
    const f = { code: "", description: "", status: "active", all_users: true, type: ctx.global ? "geographic" : "partners", branches: "all", units: "all", discount_type: "fixed", value: "", pct: "", max: "", min: "", ul: "unlimited", uln: "", ulu: "unlimited", ulun: "", start: new Date().toISOString().slice(0, 16), end: "", tab: "type" };
    const radio = (name, val, label) => `<label class="check check--radio"><input type="radio" name="${name}" value="${val}" data-r="${name}" ${f[name] === val ? "checked" : ""}><span class="check__box"><span class="check__dot"></span></span>${label}</label>`;
    const TABS = [["type", L("Coupon Type", "نوع الكوبون")], ["discount", L("Discount Type", "نوع الخصم")], ["usage", L("Usage Limit", "حد الاستخدام")], ["sched", L("Schedules", "الجداول الزمنية")]];
    const affix = (k, ph, type) => `<div class="input-affix"><input class="input" ${type ? `type="${type}"` : ""} data-f="${k}" value="${esc(f[k])}" placeholder="${ph}"><span class="affix">${cur}</span></div>`;
    const panel = () => {
      if (f.tab === "type") return `<div class="row gap-5">${radio("type", "geographic", L("Geographic", "جغرافي"))}${radio("type", "partners", L("For Partner", "للشريك"))}</div>
        ${SA.field(["country", "الدولة"], SA.select([["", f.type === "partners" ? L("All Countries", "جميع الدول") : L("Select a country...", "اختر الدولة...")], [p.country.iso, p.country.name, true]]))}
        <div class="grid grid-2">${SA.field(["State", "المحافظة"], SA.select([["", L("All States", "جميع المحافظات")], [p.state.id, p.state.name]]))}${SA.field(["City", "المدينة"], SA.select([["", L("All Cities", "جميع المدن")], [p.city.id, p.city.name]]))}</div>
        ${f.type === "partners" ? `${SA.field(["Specific Partner", "شريك محدد"], SA.select([[p.id, `${p.company_name} (#${p.id} - ${p.owner_name || "---"})`, true]]))}
          <h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Branches", "الفروع")}</h4><div class="row gap-5">${radio("branches", "all", L("All Branches", "جميع الفروع"))}${radio("branches", "specific", L("Specific Branches", "فروع محددة"))}</div>
          ${f.branches === "specific" ? `<div class="stack gap-1">${p.branches.map((b) => `<label class="check"><input type="checkbox" checked><span class="check__box">${ic("check")}</span>${esc(b.name)}</label>`).join("")}</div>` : ""}
          <h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Units", "الوحدات")}</h4><div class="row gap-5">${radio("units", "all", L("All Units", "جميع الوحدات"))}<span ${f.branches === "specific" ? "" : 'style="opacity:.5;pointer-events:none"'}>${radio("units", "specific", L("Specific Units", "وحدات محددة"))}</span></div>` : ""}`;
      if (f.tab === "discount") return `<div class="row gap-5">${radio("discount_type", "fixed", L("Fixed", "ثابت"))}${radio("discount_type", "percentage", L("Percentage", "نسبة مئوية"))}</div>
        ${f.discount_type === "fixed" ? `${SA.field(["Coupon Amount", "مبلغ الكوبون"], affix("value", L("Enter Coupon Amount", "أدخل مبلغ الكوبون"), "number") + '<div data-e="value"></div>')}${SA.field(["Min Booking / Join Price", "الحد الأدنى لسعر الحجز / الانضمام"], affix("min", L("Unlimited", "غير محدود")))}`
          : `${SA.field(["Coupon Percentage", "نسبة الكوبون"], SA.select([["", L("Select a Percentage...", "اختر النسبة...")]].concat(Array.from({ length: 20 }, (_, i) => [(i + 1) * 5, `${(i + 1) * 5}%`, String(f.pct) === String((i + 1) * 5)])), 'data-f="pct"') + '<div data-e="pct"></div>')}
            ${SA.field(["Max Amount", "المبلغ الأقصى"], affix("max", L("Unlimited", "غير محدود")))}${SA.field(["Min Booking / Join Price", "الحد الأدنى لسعر الحجز / الانضمام"], affix("min", L("Unlimited", "غير محدود")))}`}`;
      if (f.tab === "usage") return `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Usage Limit", "حد الاستخدام")}</h4><div class="row gap-5">${radio("ul", "unlimited", L("Unlimited", "غير محدود"))}${radio("ul", "limited", L("Limited", "محدود"))}</div>
        ${f.ul === "limited" ? SA.field(["The Limit Number", "رقم الحد"], `<input class="input" type="number" placeholder="50" data-f="uln" value="${esc(f.uln)}"><div data-e="uln"></div>`) : ""}
        <h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Usage Limit Per User", "حد الاستخدام لكل مستخدم")}</h4><div class="row gap-5">${radio("ulu", "unlimited", L("Unlimited", "غير محدود"))}${radio("ulu", "limited", L("Limited", "محدود"))}</div>
        ${f.ulu === "limited" ? SA.field(["The Limit Number Per User", "رقم الحد لكل مستخدم"], `<input class="input" type="number" placeholder="50" data-f="ulun" value="${esc(f.ulun)}"><div data-e="ulun"></div>`) : ""}`;
      return `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Date Range Schedules", "جداول النطاق الزمني")}</h4>
        <div class="grid grid-2">${SA.field(["Start Date", "تاريخ البدء"], `<input class="input" type="datetime-local" data-f="start" value="${f.start}"><div data-e="start"></div>`)}${SA.field(["Expiry Date", "تاريخ الانتهاء"], `<input class="input" type="datetime-local" data-f="end" value="${f.end}"><div data-e="end"></div>`)}</div>`;
    };
    const paint = (errors) => {
      mount.innerHTML = listHead(L("New Coupon", "كوبون جديد"), `<a class="btn btn--sm btn--secondary" href="${PP.href("coupons")}">${L("Cancel", "إلغاء")}</a><button class="btn btn--sm" data-create>${L("Create", "إنشاء")}</button>`)
        + (errors && errors.length ? `<div class="alert alert--danger"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${errors.map((x) => `<div>${x}</div>`).join("")}</div></div>` : "")
        + card(L("Code", "الرمز"), "", `<div class="stack gap-4">
          ${SA.field(["Code", "الرمز"], `<input class="input" data-f="code" value="${esc(f.code)}" placeholder="${L("Enter Code", "أدخل الرمز")}">`)}
          ${SA.field(["Description", "الوصف"], `<textarea class="input" rows="3" data-f="description" placeholder="${L("Enter Description", "أدخل الوصف")}">${esc(f.description)}</textarea>`)}
          ${SA.field(["status", "الحالة"], SA.select([["active", L("Active", "نشط"), f.status === "active"], ["inactive", L("Inactive", "غير نشط"), f.status === "inactive"]], 'data-f="status"'))}
          <label class="check"><input type="checkbox" data-f="all_users" ${f.all_users ? "checked" : ""}><span class="check__box">${ic("check")}</span>${L("All Users", "جميع المستخدمين")}</label>
          ${SA.field(["Specific Users", "مستخدمون محددون"], SA.select([["", L("Select Users...", "اختر المستخدمين...")]].concat(NAMES.slice(0, 6).map((n, i) => [i, `${n} (#vie_${300 + i})`]))))}</div>`)
        + card(L("Roles", "الأدوار"), "", `<div class="sa-side"><nav class="sa-side__nav">${TABS.map(([k, t]) => `<a href="#" data-tab="${k}" class="${k === f.tab ? "is-active" : ""}">${t}</a>`).join("")}</nav><div class="stack gap-4">${panel()}</div></div>`);
    };
    mount.addEventListener("input", (e) => { const k = e.target.dataset.f; if (k && e.target.type !== "checkbox") f[k] = e.target.value; });
    mount.addEventListener("change", (e) => {
      const k = e.target.dataset.f, r = e.target.dataset.r;
      if (k === "all_users") f.all_users = e.target.checked; else if (k) f[k] = e.target.value;
      if (r) { f[r] = e.target.value; if (r === "branches" && f.branches === "all") f.units = "all"; paint(); }
    });
    mount.addEventListener("click", (e) => {
      const t = e.target.closest("[data-tab]");
      if (t) { e.preventDefault(); f.tab = t.dataset.tab; paint(); }
      if (e.target.closest("[data-create]")) {
        const er = [];
        if (!f.code.trim()) er.push(L("code is required", "الرمز مطلوب")); else if (f.code.trim().length < 3) er.push(L("Minimum 3 symbols", "3 رموز على الأقل"));
        if (f.discount_type === "fixed") { if (f.value === "") er.push(L("Discount Amount is required", "مبلغ الخصم مطلوب")); else if (+f.value < 1) er.push(L("Coupon Amount Must be greater then 0 for fixed discount type", "يجب أن يكون مبلغ الكوبون أكبر من 0 لنوع الخصم الثابت")); }
        else if (!f.pct) er.push(L("Discount Percentage is required", "نسبة الخصم مطلوبة"));
        if (f.ul === "limited" && !f.uln) er.push(L("Please enter the Usage number", "يرجى إدخال رقم الاستخدام"));
        if (f.ulu === "limited" && !f.ulun) er.push(L("Please enter the Usage number per user", "يرجى إدخال رقم الاستخدام لكل مستخدم"));
        if (!f.start) er.push(L("Start date is required", "تاريخ البدء مطلوب"));
        if (!f.end) er.push(L("Expiry date is required", "تاريخ الانتهاء مطلوب")); else if (f.end.slice(0, 10) <= f.start.slice(0, 10)) er.push(L("End date must be after start date", "يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء"));
        if (er.length) return paint(er);
        /* POST /coupons — success shows the API message, then back to the list */
        d.coupons.unshift({ id: Date.now(), code: f.code.trim(), description: f.description, type: f.type, discount_type: f.discount_type, value: +(f.discount_type === "fixed" ? f.value : f.pct), max_amount: f.max ? +f.max : null, min_amount: +f.min || 0,
          usage_limit: f.ul === "limited" ? +f.uln : null, usage_limit_per_user: f.ulu === "limited" ? +f.ulun : null, start_at: f.start.replace("T", " "), end_at: f.end.replace("T", " "), total_discount: 0, status: f.status, country_name: p.country.name, logs: [] });
        PP.go("coupons");
      }
    });
    paint();
  }
})();
