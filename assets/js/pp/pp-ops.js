/* Partner profile — operations tabs (read-only in the dashboard):
   public-events (+ view) · bookings (+ view) · multi-bookings · policies
   (+ units, + view) · employees (+ units) · contacts (+ units).
   Mirrors pages/partners/profile/{public-events,bookings,multi-bookings,
   policies,employees,contacts} and modules/{bookings,public-events}. */
(function () {
  "use strict";
  const { L, esc, ic, badge, fmt } = SA;
  const { card, kv, avatar, backBtn, sessionStatus, yesNo, rng } = PP;
  const dash = (v) => (v == null || v === "" ? "---" : esc(v));
  const pad = (n) => String(n).padStart(2, "0");

  /* ---------- per-partner sample sessions ---------- */
  function ops(p) {
    if (p._ops) return p._ops;
    const r = rng(p.id + 77), int = (a, b) => a + Math.floor(r() * (b - a + 1)), pick = (a) => a[Math.floor(r() * a.length)];
    const units = HF.SA.units.filter((u) => u.partner.id === p.id);
    const unitNames = units.length ? units.map((u) => u.name) : ["Padel Court 1", "Padel Court 2"];
    const cats = [["Sports", "Padel"], ["Sports", "Football"], ["Kids", "Trampoline"]];
    const day = () => `2026-${pad(int(9, 12))}-${pad(int(1, 28))}`;
    const time = (h) => `${pad(h)}:00`;
    const USERS = ["Omar Khalid", "Sara Nabil", "Yousef Adel", "Lama Fahad", "Hassan Ali", "Noor Sami", "Rami Tarek", "Dana Majed"];
    const mk = (i, statuses) => { const h = int(8, 21), c = pick(cats); return { id: 5000 + i * 7 + (p.id % 7), created_at: `${day()} ${time(int(8, 20))}:00`, unit_name: pick(unitNames), date: day(), start_time: time(h), end_time: time(h + 1), activity_category_name: c[0], activity_name: c[1], session_gender: pick(["male", "female", "both"]), status: pick(statuses) }; };
    p._ops = {
      events: Array.from({ length: int(4, 9) }, (_, i) => Object.assign(mk(i, ["coming", "coming", "ended", "canceled"]), { age_group_name: pick(["Kids", "Teens", "Adults"]), joined_players: int(2, 10), player_numbers: 12, price_per_user: pick([45, 60, 80]), payment_method: pick(["online", "cash"]) })),
      bookings: Array.from({ length: int(8, 22) }, (_, i) => Object.assign(mk(i + 40, ["coming", "pending", "ended", "ended", "canceled"]), { user_name: pick(USERS), booking_type: pick(["online", "manual", "linked"]), paid_price: pick([120, 180, 240]), payment_method: pick(["online", "cash"]) })),
      multi: Array.from({ length: int(2, 6) }, (_, i) => Object.assign(mk(i + 90, ["coming", "ended", "canceled"]), { company_name: p.company_name, price_per_user: pick([35, 50]).toFixed(2), currency: { code: p.country.iso === "EG" ? "EGP" : "SAR" }, payment_method: pick(["online", "cash"]), booked_tickets: int(3, 18), max_capacity: 20 })),
      policies: ["Standard policy", "Weekend policy", "Kids academy policy"].slice(0, int(1, 3)).map((n, i) => ({ id: 70 + i, name: n, units_count: int(1, 4), who_can_book: pick(["all users", "members only"]), booking_frequency: pick(["unlimited", "1 session per day", "2 sessions per week"]), requires_approval: i % 2, approval_duration_hours: 6, operation_hours_from: "09:00", operation_hours_to: "22:00", free_cancellation_time: 24, fees_for_cancellation: 50, locker_time: 3, receiving_booking_time_control: 2, book_multi_session_before_session_end: i ? null : 1 })),
      users: USERS,
      unitsList: units,
    };
    return p._ops;
  }
  PP.ops = ops; /* the user profile reuses these sessions (and the booking / event views) */
  /* unit mode: the partner's sessions relabelled to this unit (sample data) */
  const forUnit = (ctx, arr) => (ctx.unit ? arr.map((x) => Object.assign({}, x, { unit_name: ctx.unit.name })) : arr);
  const unitFilter = (mount, ctl, kind) => mount.addEventListener("click", (e) => {
    const fb = e.target.closest("[data-filter]");
    if (!fb) return;
    PP.filterPop(fb, { value: ctl.state.extra, width: 340, cascade: { category: ["activity"] },
      fields: [
        { key: "session", type: "range", label: ["session date", "تاريخ الجلسة"] },
        { key: "category", label: ["Category", "الفئة"], placeholder: ["select category", "اختر الفئة"], options: () => HF.SA.CATS.map((c) => [c.name, c.name]) },
        { key: "activity", label: ["activity", "النشاط"], placeholder: ["select activity", "اختر النشاط"], options: (d) => (d.category ? HF.SA.ACTS[(HF.SA.CATS.find((c) => c.name === d.category) || {}).id] || [] : []).map((a) => [a, a]) },
      ].concat(kind === "events"
        ? [{ key: "age", label: ["age group", "الفئة العمرية"], placeholder: ["select age group", "اختر الفئة العمرية"], options: () => ["Kids", "Teens", "Adults"].map((a) => [a, a]) }]
        : [{ key: "btype", label: ["booking type", "نوع الحجز"], placeholder: ["select booking type", "اختر نوع الحجز"], options: () => [["online", L("online", "عبر الإنترنت")], ["linked", L("linked", "مرتبط")], ["manual", L("manual", "يدوي")]] }],
      [{ key: "gender", label: ["session gender", "جنس الجلسة"], placeholder: ["select session Gender", "اختر جنس الجلسة"], options: () => [["male", L("male", "ذكر")], ["female", L("female", "أنثى")], ["both", L("both", "كلاهما")]] }]),
      /* the dashboard's Reset only clears the form */
      onApply: (d) => { ctl.state.extra = d; ctl.state.page = 1; ctl.paint(); } });
  });
  const unitMatch = (r, f) => (!f.session_from || r.date >= f.session_from) && (!f.session_to || r.date <= f.session_to) && (!f.category || r.activity_category_name === f.category) && (!f.activity || r.activity_name === f.activity)
    && (!f.age || r.age_group_name === f.age) && (!f.btype || r.booking_type === f.btype) && (!f.gender || r.session_gender === f.gender);
  const money = (v, cur) => `${fmt(v)} ${esc(cur || "SAR")}`;
  const listHead = (title, extra) => `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${title}</h3>${extra || ""}</div>`;
  const eye = (href, label) => `<a class="icon-btn" href="${href}" aria-label="${label || L("View", "عرض")}">${ic("eye")}</a>`;
  const statusPills = (withPending) => [{ key: "", label: ["all", "الكل"] }, { key: "coming", label: ["Coming", "قادم"] }].concat(withPending ? [{ key: "pending", label: ["Pending Approval", "في انتظار الموافقة"] }] : []).concat([{ key: "ended", label: ["ended", "انتهى"] }, { key: "canceled", label: ["cancelled", "ملغي"] }]);
  const sideBadges = (edited, online) => `${edited ? badge("info", L("edited", "محرر")) : ""}${online ? " " + badge("success", `${L("Attendance", "الحضور")} : ${L("online", "عبر الإنترنت")}`) : ""}`;

  /* ---------- units table reused by policy / employee / contact units ---------- */
  function unitsSub(mount, ctx, title, backTab, withActions) {
    const data = ops(ctx.partner).unitsList;
    const tone = (v) => (v === "waiting" || v === "pending" ? "warning" : v === "active" ? "primary" : "danger");
    const lbl = (v) => ({ waiting: L("pending", "معلق"), active: L("approved", "معتمد"), inactive: L("not approved", "غير معتمد") }[v] || v);
    mount.innerHTML = listHead(`${L("units", "الوحدات")} (${esc(title)})`, backBtn(PP.href(backTab))) + `<div data-l></div>`;
    SA.list({ mount: mount.querySelector("[data-l]"), data, empty: ["no data", "لا توجد بيانات"], columns: [
      { head: ["name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
      { head: ["category", "الفئة"], cell: (r) => esc(r.activity_category.name) },
      { head: ["Activity", "النشاط"], cell: (r) => esc(r.activity.name) },
      { head: ["type", "النوع"], cell: (r) => esc(r.type.name) },
      { head: ["capacity", "القدرة"], cell: (r) => esc(r.capacity) },
      { head: ["booking methodology", "منهجية الحجز"], cell: (r) => esc(r.booking_methodology) },
      { head: ["availability", "التوفر"], cell: (r) => `<span style="color:${r.availability === "Available" ? "var(--color-info)" : "var(--color-danger)"};font-weight:var(--weight-semibold)">${esc(r.availability)}</span>` },
      { head: ["status", "الحالة"], cell: (r) => badge(tone(r.status.value), lbl(r.status.value)) },
    ].concat(withActions ? [{ head: ["Actions", "الإجراءات"], cell: (r) => eye(`unit-profile.html?id=${r.id}&tab=details`) }] : []) });
  }

  /* ---------- player card + payment history (session views) ---------- */
  const playerCard = (name, i, checked) => `<div class="card card--pad stack gap-2" style="box-shadow:none">
    <div class="row gap-3" style="align-items:center">${avatar(name)}<div><b>${esc(name)}</b><div class="t-xs text-tertiary">@vie_${1200 + i}</div></div></div>
    <div class="t-xs text-tertiary">2026-11-0${(i % 8) + 1} 10:2${i % 10}:00 · #J-${3300 + i}</div>
    <div class="row between" style="align-items:center"><span class="t-xs">${i % 3 ? L("High Five App", "تطبيق هاي فايف") : `${L("Partner App", "تطبيق الشريك")} (${L("Partner App", "تطبيق الشريك")})`}</span>
      ${checked != null ? (checked ? badge("success", L("Checked-in", "تم تسجيل الحضور")) : badge("", L("Not checked-in", "لم يسجّل الحضور"))) : ""}</div>
    ${checked ? `<div class="t-xs text-tertiary">2026-11-10 18:0${i % 10} · Ahmed Saeed · ${L("QR Scan", "مسح رمز QR")}</div>` : ""}</div>`;
  const payHistory = (rows, withUser) => SA.table({ empty: ["no data", "لا توجد بيانات"], rows, columns: [].concat(
    withUser ? [{ head: ["User Name", "اسم المستخدم"], cell: (t) => `<b>${esc(t.name)}</b> <span class="t-xs text-tertiary">#${t.vie}</span>` }] : [],
    [{ head: ["Type", "النوع"], cell: (t) => esc(t.type) },
      { head: ["Total Amount", "إجمالي المبلغ"], cell: (t) => money(t.amount) },
      { head: ["Coupon code", "كود الكوبون"], cell: (t) => (t.coupon ? `${esc(t.coupon)} ${t.partnerCoupon ? badge("primary", L("Partner Coupon", "كوبون الشريك")) : badge("info", L("Super Admin Coupon", "كوبون المشرف العام"))}` : "---") },
      { head: ["Paid from Coupon", "المدفوع من الكوبون"], cell: (t) => money(t.discount) },
      { head: ["Paid From High Five Wallet", "المدفوع من محفظة هاي فايف"], cell: (t) => money(t.wallet) },
      { head: ["Paid from Bank", "المدفوع من البنك"], cell: (t) => money((t.amount - t.discount - t.wallet).toFixed(2)) },
      { head: ["Date and Time", "التاريخ والوقت"], cell: (t) => esc(t.at) }]) });
  const txs = (users, base) => users.map((u, i) => ({ name: u, vie: 1200 + i, type: "payment", amount: base, coupon: i % 3 === 0 ? "SUMMER10" : null, partnerCoupon: i % 2, discount: i % 3 === 0 ? 10 : 0, wallet: i % 2 ? 20 : 0, at: `2026-11-0${(i % 8) + 1} 1${i % 10}:15:00` }));
  function breakdown(id, title, rows) {
    SA.modal({ id, title, body: kv(rows), foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button>` });
  }

  /* ================= public events ================= */
  PP.tabs["public-events"] = (mount, ctx) => {
    const o = ops(ctx.partner), view = ctx.params.get("view");
    if (view) {
      const e = o.events.find((x) => String(x.id) === view) || o.events[0];
      const joined = o.users.slice(0, e.joined_players);
      const price = { base: e.price_per_user, discount: 0, tax: +(e.price_per_user * 0.15).toFixed(2) };
      price.total = +(price.base + price.tax).toFixed(2);
      let filter = "all";
      const paint = () => {
        const shown = joined.map((n, i) => [n, i, i % 3 !== 2]).filter(([, , c]) => filter === "all" || (filter === "in" ? c : !c));
        mount.innerHTML = listHead(ctx.unit ? `${L("public event id:", "معرف الحدث العام:")} ${e.id}` : `${L("Public event ID", "رقم الحدث العام")} ${e.id}`, backBtn(PP.href("public-events")))
          + card(`${L("general Information", "المعلومات العامة")}`, "", kv([[L("partner", "الشريك"), `<a href="#" style="color:var(--color-text-link)">${esc(ctx.partner.company_name)}</a>`], [L("unit", "الوحدة"), `<a href="#" style="color:var(--color-text-link)">${esc(e.unit_name)}</a>`], [L("category", "الفئة"), esc(e.activity_category_name)], [L("Activity", "النشاط"), esc(e.activity_name)]]))
          + card(`${L("Session Information", "معلومات الجلسة")} ${sideBadges(false, false)}`, "", kv([[L("Session ID", "معرف الجلسة"), `S-${e.id}`], [L("type", "النوع"), L("public event", "حدث عام")], [L("Date", "التاريخ"), e.date], [L("Start", "البداية"), e.start_time], [L("end", "النهاية"), e.end_time], [L("overnight", "طوال الليل"), yesNo(false)], [L("gender", "الجنس"), esc(e.session_gender)], [L("price", "السعر"), money(price.total)]]))
          + card(L("public event", "الحدث العام"), "", kv([[L("Public event ID", "رقم الحدث العام"), e.id], [L("Public event status", "حالة الحدث العام"), esc(e.status)], [L("Number Of Player", "عدد اللاعبين"), e.joined_players], [L("age group", "الفئة العمرية"), esc(e.age_group_name)], [L("Created By", "أنشئ بواسطة"), esc(ctx.partner.company_name)], [L("Created At", "تاريخ الإنشاء"), esc(e.created_at)]]
            .concat(e.status === "canceled" ? [[L("Cancelled By", "ألغي بواسطة"), "Super Admin"], [L("Cancelled At", "ألغي في"), esc(e.date)]] : [])))
          + card(`${L("Joined Players", "اللاعبون المنضمون")} (${e.joined_players}/${e.player_numbers})`, `<div class="segmented">${[["all", L("all", "الكل")], ["in", L("Checked-in", "تم تسجيل الحضور")], ["out", L("Not checked-in", "لم يسجّل الحضور")]].map(([k, t]) => `<button type="button" data-pf="${k}" class="${k === filter ? "is-active" : ""}">${t}</button>`).join("")}</div>`,
            shown.length ? `<div class="sa-players">${shown.map(([n, i, c]) => playerCard(n, i, c)).join("")}</div>` : `<p class="text-tertiary">${L("no data", "لا توجد بيانات")}</p>`)
          + card(`${L("Left Players (Early)", "اللاعبون الذين غادروا (مبكراً)")} (1)`, "", `<div class="sa-players">${playerCard(o.users[7], 7)}</div>`)
          + card(`${L("Left Players (Late)", "اللاعبون الذين غادروا (متأخراً)")} (0)`, "", `<p class="text-tertiary">${L("no data", "لا توجد بيانات")}</p>`)
          + card(`${L("Removed Players", "اللاعبون المحذوفون")} (0)`, "", `<p class="text-tertiary">${L("no data", "لا توجد بيانات")}</p>`)
          + card(L("Payment", "الدفع"), "", kv([[L("payment method", "طريقة الدفع"), esc(e.payment_method)],
            [L("Price Per User", "السعر لكل مستخدم"), `${money(price.total)} ${SA.iconBtn("info", L("Price per user Break Down", "تفصيل السعر لكل مستخدم"), 'data-bd="ppu"')}`],
            [L("Charge For Leave Within", "رسوم المغادرة خلال"), `6 ${L("Hours", "ساعات")}`], [L("Cancelation Fee Per User", "رسوم الإلغاء لكل مستخدم"), `${money(price.total / 2)} (50%)`]])
            + `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Summery", "الملخص")}</h4>` + kv([
              [L("Total Payment From Joined Players", "إجمالي الدفع من اللاعبين المنضمين"), `${money(price.total * e.joined_players)} ${SA.iconBtn("info", L("Break Down", "التفصيل"), 'data-bd="joined"')}`],
              [L("Total Fee From Left Players", "إجمالي الرسوم من اللاعبين الذين غادروا"), `${money(0)} ${SA.iconBtn("info", L("Break Down", "التفصيل"), 'data-bd="left"')}`],
              [L("Total Income From Public Event", "إجمالي الدخل من الحدث العام"), `${money(price.total * e.joined_players)} ${SA.iconBtn("info", L("Break Down", "التفصيل"), 'data-bd="income"')}`]]))
          + card(L("Payment History", "سجل الدفع"), "", payHistory(txs(joined, price.total), true));
      };
      mount.addEventListener("click", (ev) => {
        const pf = ev.target.closest("[data-pf]"); if (pf) { filter = pf.dataset.pf; paint(); }
        const bd = ev.target.closest("[data-bd]");
        if (!bd) return;
        const k = bd.dataset.bd;
        if (k === "ppu") breakdown("ppBd", L("Price per user Break Down", "تفصيل السعر لكل مستخدم"), [[L("Price per player :", "السعر لكل لاعب :"), money(price.total)], [L("Base Price :", "السعر الأساسي :"), money(price.base)], [L("Discount", "الخصم"), money(0)], [L("Public Event Price :", "سعر الحدث العام :"), money(price.base)], [`${L("Tax", "الضريبة")} (15%)`, money(price.tax)], [L("total", "المجموع"), `<b>${money(price.total)}</b>`]]);
        if (k === "joined") breakdown("ppBd", L("Total Payment from joined players Break Down", "تفصيل إجمالي الدفع من اللاعبين المنضمين"), [[L("Total Number of Players :", "إجمالي عدد اللاعبين :"), e.joined_players], [L("Price per player :", "السعر لكل لاعب :"), money(price.total)], [L("total", "المجموع"), `<b>${money(price.total * e.joined_players)}</b>`]]);
        if (k === "left") breakdown("ppBd", L("Total fee from left players Break Down", "تفصيل إجمالي الرسوم من اللاعبين الذين غادروا"), [[L("Total Number of left players with fee :", "إجمالي عدد اللاعبين الذين غادروا مع الرسوم :"), 0], [L("Fee Price per player :", "سعر الرسوم لكل لاعب :"), money(price.total / 2)], [L("total", "المجموع"), `<b>${money(0)}</b>`]]);
        if (k === "income") breakdown("ppBd", L("Total income from public event Break Down", "تفصيل إجمالي الدخل من الحدث العام"), [[L("Total Number of Players :", "إجمالي عدد اللاعبين :"), e.joined_players], [L("Price per player :", "السعر لكل لاعب :"), money(price.base)], [L("Total Number of left players with fee :", "إجمالي عدد اللاعبين الذين غادروا مع الرسوم :"), 0], [L("Fee Price per player :", "سعر الرسوم لكل لاعب :"), money(price.total / 2)], [L("total", "المجموع"), `<b>${money(price.total * e.joined_players)}</b>`]]);
      });
      paint();
      return;
    }
    mount.innerHTML = listHead(L("public events", "الأحداث العامة")) + `<div data-l></div>`;
    const evCtl = SA.list({ mount: mount.querySelector("[data-l]"), data: forUnit(ctx, o.events), pills: statusPills(false), pillMatch: (r, k) => !k || r.status === k,
      search: ["search by name", "البحث بالاسم"], searchMatch: (r, q) => r.unit_name.toLowerCase().includes(q) || r.activity_name.toLowerCase().includes(q),
      toolbarExtra: ctx.unit ? PP.filterBtn() : "", extraMatch: unitMatch,
      empty: ["there is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["#", "#"], cell: (r) => `<b>#${r.id}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { hidden: !!ctx.unit, head: ["unit", "الوحدة"], cell: (r) => esc(r.unit_name) },
        { head: ["session time", "وقت الجلسة"], cell: (r) => `${r.date}<div class="t-xs text-tertiary">${r.start_time} – ${r.end_time}</div>` },
        { head: ["Activity", "النشاط"], cell: (r) => `${esc(r.activity_category_name)}<div class="t-xs text-tertiary">${esc(r.activity_name)}</div>` },
        { head: ["age group", "الفئة العمرية"], cell: (r) => esc(r.age_group_name) },
        { head: ["session gender", "جنس الجلسة"], cell: (r) => esc(r.session_gender) },
        { head: ["joined users", "المستخدمون المنضمون"], cell: (r) => `${r.joined_players} / ${r.player_numbers}` },
        { head: ["Price Per User", "السعر لكل مستخدم"], cell: (r) => `${r.price_per_user} SAR<div class="t-xs text-tertiary">${esc(r.payment_method)}</div>` },
        { head: ["status", "الحالة"], cell: (r) => sessionStatus(r.status) },
        { head: ["Actions", "الإجراءات"], cell: (r) => eye(PP.href("public-events", { view: r.id })) },
      ] });
    if (ctx.unit) unitFilter(mount, evCtl, "events");
  };

  /* ================= bookings ================= */
  PP.tabs.bookings = (mount, ctx) => {
    const o = ops(ctx.partner), view = ctx.params.get("view");
    if (view) {
      const b = o.bookings.find((x) => String(x.id) === view) || o.bookings[0];
      const pd = { base: b.paid_price - 20, discount: 0, tax: +((b.paid_price - 20) * 0.15).toFixed(2), services: [["Racket rental", 10, 2, 0]] };
      pd.subtotal = +(pd.base + pd.tax + 20).toFixed(2);
      const checked = b.status === "ended";
      mount.innerHTML = listHead(ctx.unit ? `${L("booking id:", "رقم الحجز:")} ${b.id}` : `${L("Booking ID", "رقم الحجز")} ${b.id}`, backBtn(PP.href("bookings")))
        + card(L("general Information", "المعلومات العامة"), "", kv([[L("partner", "الشريك"), `<a href="#" style="color:var(--color-text-link)">${esc(ctx.partner.company_name)}</a>`], [L("unit", "الوحدة"), `<a href="#" style="color:var(--color-text-link)">${esc(b.unit_name)}</a>`], [L("category", "الفئة"), esc(b.activity_category_name)], [L("Activity", "النشاط"), esc(b.activity_name)]]))
        + card(L("Session Information", "معلومات الجلسة"), "", kv([[L("Session ID", "معرف الجلسة"), `S-${b.id}`], [L("type", "النوع"), L("normal", "عادي")], [L("Session status", "حالة الجلسة"), esc(b.status)], [L("Date", "التاريخ"), b.date], [L("Start", "البداية"), b.start_time], [L("end", "النهاية"), b.end_time], [L("overnight", "طوال الليل"), yesNo(false)], [L("gender", "الجنس"), esc(b.session_gender)],
            [L("price", "السعر"), `${money(pd.subtotal)} ${SA.iconBtn("info", L("Break Down", "التفصيل"), "data-bdb")}`]])
          + `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Additional Services", "الخدمات الإضافية")}</h4>`
          + SA.table({ rows: pd.services, empty: ["no data", "لا توجد بيانات"], columns: [{ head: ["name", "الاسم"], cell: (s) => esc(s[0]) }, { head: ["Price", "السعر"], cell: (s) => money(s[1]) }, { head: ["Qty", "الكمية"], cell: (s) => s[2] }, { head: ["Duration", "Duration"], cell: () => "00:30" }, { head: ["Total", "الإجمالي"], cell: (s) => money(s[1] * s[2]) }] }))
        + card(L("booking", "الحجز"), "", kv([[L("booking Id", "معرف الحجز"), `B-${b.id}`], [L("type", "النوع"), esc(b.booking_type)], [L("Booking Status", "حالة الحجز"), esc(b.status)],
            [L("Booked for", "محجوز لـ"), `<span class="row gap-3" style="align-items:center">${avatar(b.user_name)}<span><b>${esc(b.user_name)}</b><div class="t-xs text-tertiary">@vie_${b.id % 900} · ${L("High Five user", "مستخدم هاي فايف")}</div></span></span>`],
            [L("Booked By", "محجوز بواسطة"), esc(b.booking_type === "manual" ? ctx.partner.company_name : b.user_name)], [L("Booked At", "تم الحجز في"), esc(b.created_at)]]
            .concat(b.status === "canceled" ? [[L("Cancelled By", "ألغي بواسطة"), esc(b.user_name)], [L("Cancelled At", "ألغي في"), b.date]] : [])))
        + card(L("Check-in", "تسجيل الحضور"), "", kv([[L("Check-in Status", "حالة تسجيل الحضور"), checked ? badge("success", L("Checked-in", "تم تسجيل الحضور")) : badge("", L("Not checked-in", "لم يسجّل الحضور"))]]
            .concat(checked ? [[L("Checked-in At", "وقت تسجيل الحضور"), `${b.date} ${b.start_time}`], [L("Checked-in By", "سجّله"), "Ahmed Saeed"], [L("Branch", "الفرع"), esc((ctx.partner.branches[0] || {}).name)], [L("Method", "الطريقة"), L("QR Scan", "مسح رمز QR")]] : [])))
        + card(L("Payment", "الدفع"), "", kv([[L("payment method", "طريقة الدفع"), esc(b.payment_method)], [L("Payment status", "حالة الدفع"), b.payment_method === "online" ? L("paid", "مدفوع") : L("unpaid", "غير مدفوع")]]
            .concat(b.status === "canceled" ? [[L("Cancelation Fee", "رسوم الإلغاء"), `50% (${money(b.paid_price / 2)})`]] : [])))
        + card(L("Payment History", "سجل الدفع"), "", payHistory(txs([b.user_name], pd.subtotal), false));
      mount.querySelector("[data-bdb]").onclick = () => breakdown("ppBdb", L("Break Down", "التفصيل"), [[L("Base Price :", "السعر الأساسي :"), money(pd.base)], [`${L("Discount", "الخصم")} (0%)`, money(0)], [L("Total Session Price :", "إجمالي سعر الجلسة :"), money(pd.base)], [L("Tax For", "الضريبة لـ"), `VAT (15%) ${money(pd.tax)}`], [`${L("total Tax", "إجمالي الضريبة")} (15%)`, money(pd.tax)], [L("Additional Services", "الخدمات الإضافية"), `Racket rental (price: 10 - Qty: 2) ${money(20)}`], [L("Total Additional Services", "إجمالي الخدمات الإضافية"), money(20)], [L("total", "المجموع"), `<b>${money(pd.subtotal)}</b>`]]);
      return;
    }
    mount.innerHTML = listHead(L("bookings", "الحجوزات")) + `<div data-l></div>`;
    const bkCtl = SA.list({ mount: mount.querySelector("[data-l]"), data: forUnit(ctx, o.bookings), pills: statusPills(true), pillMatch: (r, k) => !k || r.status === k,
      search: ctx.unit ? ["search by booking id", "البحث برقم الحجز"] : ["search by unit name", "البحث باسم الوحدة"], searchMatch: (r, q) => (ctx.unit ? String(r.id).includes(q) : r.unit_name.toLowerCase().includes(q)),
      toolbarExtra: ctx.unit ? PP.filterBtn() : "", extraMatch: unitMatch,
      empty: () => `<span class="stack gap-2" style="align-items:center">${ic("calendar")}<b>${L("No bookings yet", "لا توجد حجوزات")}</b><span class="t-sm">${L("Try another tab, adjust filters, or search again.", "جرّب تبويبًا آخر أو غيّر عوامل التصفية أو أعد البحث.")}</span></span>`,
      columns: [
        { head: ["#", "#"], cell: (r) => `<b>#${r.id}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { hidden: !!ctx.unit, head: ["unit", "الوحدة"], cell: (r) => esc(r.unit_name) },
        { head: ["date & time", "التاريخ والوقت"], cell: (r) => `${r.date} ${r.start_time}<div class="t-xs text-tertiary">${r.end_time}</div>` },
        { head: ["Activity", "النشاط"], cell: (r) => `${esc(r.activity_category_name)}<div class="t-xs text-tertiary">${esc(r.activity_name)}</div>` },
        { head: ["user", "المستخدم"], cell: (r) => esc(r.user_name) },
        { head: ["session gender", "جنس الجلسة"], cell: (r) => esc(r.session_gender) },
        { head: ["booking type", "نوع الحجز"], cell: (r) => esc(r.booking_type) },
        { head: ["Price Per User", "السعر لكل مستخدم"], cell: (r) => `${r.paid_price} SAR<div class="t-xs text-tertiary">${esc(r.payment_method)}</div>` },
        { head: ["status", "الحالة"], cell: (r) => sessionStatus(r.status) },
        { head: ["Actions", "الإجراءات"], cell: (r) => eye(PP.href("bookings", { view: r.id })) },
      ] });
    if (ctx.unit) unitFilter(mount, bkCtl, "bookings");
  };

  /* ================= multi-bookings ================= */
  PP.tabs["multi-bookings"] = (mount, ctx) => {
    const o = ops(ctx.partner);
    mount.innerHTML = listHead(L("Multi-Booking Sessions", "جلسات الحجز المتعدد")) + `<div data-l></div>`;
    SA.list({ mount: mount.querySelector("[data-l]"), data: forUnit(ctx, o.multi), pills: statusPills(false), pillMatch: (r, k) => !k || r.status === k,
      search: ctx.unit ? ["search by session id", "البحث برقم الجلسة"] : ["search by unit name", "البحث باسم الوحدة"], searchMatch: (r, q) => (ctx.unit ? String(r.id).includes(q) : r.unit_name.toLowerCase().includes(q)),
      empty: ["there is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["#", "#"], cell: (r) => `<b>#${r.id}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { hidden: !!ctx.unit, head: ["unit", "الوحدة"], cell: (r) => `${esc(r.unit_name)}<div class="t-xs text-tertiary">${esc(r.company_name)}</div>` },
        { head: ["date & time", "التاريخ والوقت"], cell: (r) => `${r.date}<div class="t-xs text-tertiary">${r.start_time} - ${r.end_time}</div>` },
        { head: ["Activity", "النشاط"], cell: (r) => `${esc(r.activity_category_name)}<div class="t-xs text-tertiary">${esc(r.activity_name)}</div>` },
        { head: ["session gender", "جنس الجلسة"], cell: (r) => esc(r.session_gender) },
        { head: ["Price Per User", "السعر لكل مستخدم"], cell: (r) => `${r.price_per_user} ${esc(r.currency.code)}<div class="t-xs text-tertiary">${esc(r.payment_method)}</div>` },
        { head: ["capacity", "القدرة"], cell: (r) => `${r.booked_tickets} / ${r.max_capacity}` },
        { head: ["status", "الحالة"], cell: (r) => sessionStatus(r.status) },
        { head: ["Actions", "الإجراءات"], cell: (r) => eye(`multi-booking.html?id=${r.id}&redirect_to_page=1&${ctx.unit ? "from=units-profile&unit_id=" + ctx.unit.id : "from=partners-profile&user_id=" + ctx.partner.id}`) },
      ] });
  };

  /* ================= policies (+ units, + view) ================= */
  PP.tabs.policies = (mount, ctx) => {
    const o = ops(ctx.partner), view = ctx.unit ? String(o.policies[0].id) : ctx.params.get("view"), units = ctx.unit ? null : ctx.params.get("units");
    if (units) return unitsSub(mount, ctx, (o.policies.find((x) => String(x.id) === units) || {}).name || "", "policies", false);
    if (view) {
      const p = o.policies.find((x) => String(x.id) === view) || o.policies[0];
      const n = (v) => `<span class="badge badge--success">${v}</span>`;
      mount.innerHTML = listHead(esc(p.name), ctx.unit ? "" : backBtn(PP.href("policies")))
        + card(L("Policies", "السياسات"), "", kv([[L("name", "الاسم"), esc(p.name)], [L("who can book?", "من يمكنه الحجز؟"), esc(p.who_can_book)]]))
        + card(L("booking frequency", "تكرار الحجز"), "", kv([[L("how many sessions can be booked by high five user?", "كم عدد الجلسات التي يمكن حجزها من قبل مستخدم هاي فايف؟"), esc(p.booking_frequency)]]))
        + card(L("approval configuration", "إعدادات الموافقة"), "", kv([[L("requires approval", "يتطلب موافقة"), yesNo(p.requires_approval)]].concat(p.requires_approval ? [[L("approval duration", "مدة الموافقة"), `${p.approval_duration_hours} ${L("hours", "ساعات")}`], [L("operation hours", "ساعات العمل"), `${p.operation_hours_from} – ${p.operation_hours_to}`]] : [])))
        + card(L("cancellation policy", "سياسة الإلغاء"), "", `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("online payment", "الدفع الإلكتروني")}</h4>` + kv([
            [L("free cancellation", "الإلغاء المجاني"), L(`high five user will get full refund for cancellation if cancelled within ${n(p.free_cancellation_time)} hours before session start time`, `سيحصل مستخدم هاي فايف على استرداد كامل للإلغاء إذا تم الإلغاء خلال ${n(p.free_cancellation_time)} ساعات قبل وقت بداية الجلسة`)],
            [L("fees for cancellation", "رسوم الإلغاء"), L(`charge high five user ${n(p.fees_for_cancellation)} % of paid amount if cancelled after free cancellation period`, `تحميل مستخدم هاي فايف ${n(p.fees_for_cancellation)} % من المبلغ المدفوع إذا تم الإلغاء بعد فترة الإلغاء المجاني`)]])
          + `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("cash payment", "الدفع النقدي")}</h4><p class="t-sm" style="color:var(--color-danger)">${ic("info")} ${L("cancellation charge is subject to agreement with high five user and will not be considered financially in your accounting page", "رسوم الإلغاء تخضع للاتفاق مع مستخدم هاي فايف ولن يتم اعتبارها ماليًا في صفحة المحاسبة الخاصة بك")}</p>`)
        + card(L("locker", "القفل"), "", kv([[L("locker", "القفل"), L(`all unloked bookings will be auto locked in ${n(p.locker_time)} hours before start time . 3 hours minimum`, `سيتم قفل جميع الحجوزات غير المقفلة تلقائيًا خلال ${n(p.locker_time)} ساعات قبل وقت البداية. 3 ساعات كحد أدنى`)]]))
        + card(L("receive bookings time control", "التحكم في وقت استقبال الحجوزات"), "", kv([[L("time control", "التحكم في الوقت"), L(`do not show any available session to high five users within ${n(p.receiving_booking_time_control)} hours before start time`, `لا تظهر أي جلسة متاحة لمستخدمي هاي فايف خلال ${n(p.receiving_booking_time_control)} ساعات قبل وقت البداية`)]]))
        + card(L("receive bookings before end of session hours", "استقبال الحجوزات قبل نهاية ساعات الجلسة"), "", kv([[L("enable booking cutoff before end time", "تفعيل وقت انتهاء الحجز قبل وقت الانتهاء"), p.book_multi_session_before_session_end ? `${n(p.book_multi_session_before_session_end)} ${L("hours before end time", "ساعات قبل وقت الانتهاء")}` : "---"]]));
      return;
    }
    mount.innerHTML = listHead(L("Policies", "السياسات")) + `<div data-l></div>`;
    SA.list({ mount: mount.querySelector("[data-l]"), data: o.policies, search: ["search by name", "البحث بالاسم"], searchMatch: (r, q) => r.name.toLowerCase().includes(q), empty: ["there is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b>` },
        { head: ["units", "الوحدات"], cell: (r) => `<a href="${PP.href("policies", { units: r.id })}" style="color:var(--color-text-link);font-weight:var(--weight-semibold)">${r.units_count} ${L("units", "الوحدات")}</a>` },
        { head: ["Actions", "الإجراءات"], cell: (r) => eye(PP.href("policies", { view: r.id })) },
      ] });
  };

  /* ================= employees (+ units) ================= */
  PP.tabs.employees = (mount, ctx) => {
    const p = ctx.partner, units = ctx.params.get("units");
    if (units) return unitsSub(mount, ctx, (p.employees.find((x) => String(x.id) === units) || {}).name || "", "employees", true);
    mount.innerHTML = listHead(L("employees", "الموظفين")) + `<div data-l></div>`;
    SA.list({ mount: mount.querySelector("[data-l]"), data: p.employees, search: ["search by name", "البحث بالاسم"], searchMatch: (r, q) => r.name.toLowerCase().includes(q), empty: ["there is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["name", "الاسم"], cell: (r) => `<div class="cell-user">${avatar(r.name)}<div><b>${esc(r.name)}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div></div></div>` },
        { head: ["phone", "الهاتف"], cell: (r) => `<span dir="ltr">${esc(r.phone)}</span>` },
        { head: ["Email", "البريد الإلكتروني"], cell: (r) => esc(r.email) },
        { head: ["assignment", "التعيين"], cell: (r) => `<a href="${PP.href("employees", { units: r.id })}" style="color:var(--color-text-link);font-weight:var(--weight-semibold)">${r.units_assigned_count} ${L("units", "الوحدات")}</a>` },
        { head: ["status", "الحالة"], cell: (r) => (r.active === 1 ? badge("primary", L("active", "نشط")) : badge("danger", L("inactive", "غير نشط"))) },
      ] });
  };

  /* ================= contacts (+ units) ================= */
  PP.tabs.contacts = (mount, ctx) => {
    const p = ctx.partner, units = ctx.params.get("units");
    if (units) return unitsSub(mount, ctx, (p.contacts.find((x) => String(x.id) === units) || {}).name || "", "contacts", true);
    mount.innerHTML = listHead(L("contacts", "جهات الاتصال")) + `<div data-l></div>`;
    SA.list({ mount: mount.querySelector("[data-l]"), data: p.contacts, search: ["search by name", "البحث بالاسم"], searchMatch: (r, q) => r.name.toLowerCase().includes(q), empty: ["there is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["name", "الاسم"], cell: (r) => `<div class="cell-user">${avatar(r.name)}<div><b>${esc(r.name)}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div></div></div>` },
        { head: ["phone", "الهاتف"], cell: (r) => `<span dir="ltr">${esc(r.phone)}</span>` },
        { hidden: !!ctx.unit, head: ["assignment", "التعيين"], cell: (r) => `<a href="${PP.href("contacts", { units: r.id })}" style="color:var(--color-text-link);font-weight:var(--weight-semibold)">${r.units_count} ${L("units", "الوحدات")}</a>` },
      ] });
  };
})();
