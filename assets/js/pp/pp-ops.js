/* Partner profile — operations tabs (read-only in the dashboard):
   public-events (+ view) · bookings (+ view) · multi-bookings · policies
   (+ units, + view) · employees (+ units) · contacts (+ units).
   Mirrors pages/partners/profile/{public-events,bookings,multi-bookings,
   policies,employees,contacts} and modules/{bookings,public-events}.
   Demo flag: ?demo=nopolicy shows the policy view's "No data" state.
   Permissions (job keys, as the dashboard): public events tab view_public_events
   (partner + unit PublicEvents.js), its view view_public_event_details
   (SessionPublicEventView.js), list eye view_public_event_details in unit mode only
   (units/profile/public-events/PublicEventsTable.js; the partner table is not gated);
   bookings tab view_bookings, view view_booking_details (SessionBookingView.js), list eye
   view_booking_details in unit mode only (units/profile/bookings/BookingsTable.js);
   multi-bookings tab view_multi_bookings, eye view_multi_booking_details (partner + unit
   MultiBookingsTable.js). Policies, employees, contacts (+ their units lists) carry no
   permission check in the dashboard. A tab whose key is missing shows NotHavePermissions. */
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
      bookings: Array.from({ length: int(8, 22) }, (_, i) => Object.assign(mk(i + 40, ["coming", "pending", "ended", "ended", "canceled"]), { user_name: pick(USERS), booking_type: pick(["online", "manual", "linked"]), paid_price: pick([120, 180, 240]), payment_method: pick(["online", "cash"]) },
        /* view-only flags (derived from i so the random sequence above is unchanged):
           edited_after_booking → "Edited" on General information · is_edited → "Edited" on
           Session information · is_multi_booking + tickets → "… - Multi-booking session" type
           and a Tickets line in the price breakdown · session_status may be empty · additional services may be none */
        { edited_after_booking: i % 4 === 1, is_edited: i % 5 === 2, is_multi_booking: i % 6 === 3 ? 1 : 0, tickets: 2 + (i % 3), session_status_set: i % 3 !== 0, has_services: i % 3 !== 2 })),
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
        { key: "session", type: "range", label: ["Session date", "تاريخ الجلسة"] },
        { key: "category", label: ["Category", "الفئة"], placeholder: ["Select category", "اختر الفئة"], options: () => HF.SA.CATS.map((c) => [c.name, c.name]) },
        { key: "activity", label: ["Activity", "النشاط"], placeholder: ["Select activity", "اختر النشاط"], options: (d) => (d.category ? HF.SA.ACTS[(HF.SA.CATS.find((c) => c.name === d.category) || {}).id] || [] : []).map((a) => [a, a]) },
      ].concat(kind === "events"
        ? [{ key: "age", label: ["Age group", "الفئة العمرية"], placeholder: ["Select age group", "اختر الفئة العمرية"], options: () => ["Kids", "Teens", "Adults"].map((a) => [a, a]) }]
        : [{ key: "btype", label: ["Booking type", "نوع الحجز"], placeholder: ["Select booking type", "اختر نوع الحجز"], options: () => [["online", L("Online", "عبر الإنترنت")], ["linked", L("Linked", "مرتبط")], ["manual", L("Manual", "يدوي")]] }],
      [{ key: "gender", label: ["Session gender", "جنس الجلسة"], placeholder: ["Select session gender", "اختر جنس الجلسة"], options: () => [["male", L("Male", "ذكر")], ["female", L("Female", "أنثى")], ["both", L("Both", "كلاهما")]] }]),
      /* the dashboard's Reset only clears the form */
      onApply: (d) => { ctl.state.extra = d; ctl.state.page = 1; ctl.paint(); } });
  });
  const unitMatch = (r, f) => (!f.session_from || r.date >= f.session_from) && (!f.session_to || r.date <= f.session_to) && (!f.category || r.activity_category_name === f.category) && (!f.activity || r.activity_name === f.activity)
    && (!f.age || r.age_group_name === f.age) && (!f.btype || r.booking_type === f.btype) && (!f.gender || r.session_gender === f.gender);
  const money = (v, cur) => `${fmt(v)} ${esc(cur || "SAR")}`;
  const listHead = (title, extra) => `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${title}</h3>${extra || ""}</div>`;
  const eye = (href, label, perm) => `<a class="icon-btn" href="${href}" aria-label="${label || L("View", "عرض")}"${perm ? ` data-perm="${perm}"` : ""}>${ic("eye")}</a>`;
  /* the dashboard's <NotHavePermissions /> in place of a tab / view (RD.can — shell.js) */
  const denied = (mount, key) => { if (!window.RD || !RD.can || RD.can(key)) return false; mount.innerHTML = RD.noPermission(); return true; };
  const statusPills = (withPending) => [{ key: "", label: ["All", "الكل"], icon: "calendar" }, { key: "coming", label: ["Coming", "قادم"], icon: "clock", tone: "info" }].concat(withPending ? [{ key: "pending", label: ["Pending approval", "في انتظار الموافقة"], icon: "warn", tone: "warning" }] : []).concat([{ key: "ended", label: ["Ended", "انتهى"], icon: "check", tone: "success" }, { key: "canceled", label: ["Cancelled", "ملغي"], icon: "close", tone: "danger" }]);
  /* GeneralInformationTable links: partner → /partners/profile/{id}/owner, unit → /units/profile/{id}/details */
  const unitOf = (ctx, name) => ctx.unit || HF.SA.units.find((u) => u.name === name) || null;
  const link = (href, t) => (href ? `<a href="${href}" style="color:var(--color-text-link)">${esc(t)}</a>` : esc(t));
  const partnerLink = (p) => link(`partner-profile.html?id=${p.id}&tab=owner`, p.company_name);
  const unitLink = (ctx, name) => { const u = unitOf(ctx, name); return link(u ? `unit-profile.html?id=${u.id}&tab=details` : "", name); };
  const isOnline = (ctx, name) => (unitOf(ctx, name) || {}).attendance_type === "online";
  const sideBadges = (edited, online) => `${edited ? badge("info", L("Edited", "محرر")) : ""}${online ? " " + badge("success", `${L("Attendance", "الحضور")} : ${L("Online", "عبر الإنترنت")}`) : ""}`;

  /* ---------- units table reused by policy / employee / contact units ----------
     API: GET /partners/{id}/units?policy_id= | ?employee_id= | ?contact_id= */
  function unitsSub(mount, ctx, title, backTab, withActions) {
    const data = ops(ctx.partner).unitsList;
    const tone = (v) => (v === "waiting" || v === "pending" ? "warning" : v === "active" ? "primary" : "danger");
    const lbl = (v) => ({ waiting: L("Pending", "معلق"), active: L("Approved", "معتمد"), inactive: L("Not approved", "غير معتمد") }[v] || v);
    mount.innerHTML = listHead(`${L("Units", "الوحدات")} (${esc(title)})`, backBtn(PP.href(backTab))) + `<div data-l></div>`;
    SA.list({ mount: mount.querySelector("[data-l]"), data, empty: ["There is no data to display", "لا توجد بيانات للعرض"], columns: [
      { head: ["Name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
      { head: ["Category", "الفئة"], cell: (r) => esc(r.activity_category.name) },
      { head: ["Activity", "النشاط"], cell: (r) => esc(r.activity.name) },
      { head: ["Type", "النوع"], cell: (r) => esc(r.type.name) },
      { head: ["Capacity", "القدرة"], cell: (r) => esc(r.capacity) },
      { head: ["Booking methodology", "منهجية الحجز"], cell: (r) => esc(PP.cap(r.booking_methodology)) },
      { head: ["Availability", "التوفر"], cell: (r) => `<span style="color:${r.availability === "Available" ? "var(--color-info)" : "var(--color-danger)"};font-weight:var(--weight-semibold)">${esc(r.availability)}</span>` },
      { head: ["Status", "الحالة"], cell: (r) => badge(tone(r.status.value), lbl(r.status.value)) },
    ].concat(withActions ? [{ head: ["Actions", "الإجراءات"], cell: (r) => eye(`unit-profile.html?id=${r.id}&tab=details`) }] : []) });
  }

  /* ---------- player card + payment history (session views) ---------- */
  const playerCard = (name, i, checked) => `<a class="card card--pad stack gap-2" href="user-profile.html?id=${(HF.SA.users[i % HF.SA.users.length] || {}).id}&tab=details" style="box-shadow:none;color:inherit;text-decoration:none">
    <div class="row gap-3" style="align-items:center">${avatar(name)}<div><b>${esc(name)}</b><div class="t-xs text-tertiary">@vie_${1200 + i}</div></div></div>
    <div class="t-xs text-tertiary">2026-11-0${(i % 8) + 1} 10:2${i % 10}:00 · #J-${3300 + i}</div>
    <div class="row between" style="align-items:center"><span class="t-xs">${i % 3 ? L("HighFive app", "تطبيق هاي فايف") : `${L("Partner app", "تطبيق الشريك")} (${L("Partner app", "تطبيق الشريك")})`}</span>
      ${checked != null ? (checked ? badge("success", L("Checked-in", "تم تسجيل الحضور")) : badge("", L("Not checked-in", "لم يسجّل الحضور"))) : ""}</div>
    ${checked ? `<div class="t-xs text-tertiary">2026-11-10 18:0${i % 10} · Ahmed Saeed · ${L("QR scan", "مسح رمز QR")}</div>` : ""}</a>`;
  const payHistory = (rows, withUser) => SA.table({ empty: ["No data", "لا توجد بيانات"], rows, columns: [].concat(
    withUser ? [{ head: ["User Name", "اسم المستخدم"], cell: (t) => `<b>${esc(t.name)}</b> <span class="t-xs text-tertiary">#${t.vie}</span>` }] : [],
    [{ head: ["Type", "النوع"], cell: (t) => esc(PP.cap(t.type)) },
      { head: ["Total Amount", "إجمالي المبلغ"], cell: (t) => money(t.amount) },
      { head: ["Coupon code", "كود الكوبون"], cell: (t) => (t.coupon ? `${esc(t.coupon)} ${t.partnerCoupon ? badge("primary", L("Partner coupon", "كوبون الشريك")) : badge("info", L("Super Admin coupon", "كوبون المشرف العام"))}` : "---") },
      { head: ["Paid from Coupon", "المدفوع من الكوبون"], cell: (t) => money(t.discount) },
      { head: ["Paid From High Five Wallet", "المدفوع من محفظة هاي فايف"], cell: (t) => money(t.wallet) },
      { head: ["Paid from Bank", "المدفوع من البنك"], cell: (t) => money((t.amount - t.discount - t.wallet).toFixed(2)) },
      { head: ["Date and Time", "التاريخ والوقت"], cell: (t) => esc(t.at) }]) });
  const txs = (users, base) => users.map((u, i) => ({ name: u, vie: 1200 + i, type: "payment", amount: base, coupon: i % 3 === 0 ? "SUMMER10" : null, partnerCoupon: i % 2, discount: i % 3 === 0 ? 10 : 0, wallet: i % 2 ? 20 : 0, at: `2026-11-0${(i % 8) + 1} 1${i % 10}:15:00` }));
  function breakdown(id, title, rows) {
    SA.modal({ id, title, body: kv(rows), foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button>` });
  }

  /* ================= public events =================
     List status filter: the Cancelled tile sends status=cancelled, while the counts
     and the rows use "canceled" (as in the dashboard). View: GET /public-events/{id}.
     ctx.noBack: the global public-events page's view has no Back (PublicEventView.js). */
  PP.tabs["public-events"] = (mount, ctx) => {
    const o = ops(ctx.partner), view = ctx.params.get("view");
    if (denied(mount, view ? "view_public_event_details" : "view_public_events")) return;
    if (view) {
      const e = o.events.find((x) => String(x.id) === view) || o.events[0];
      const joined = o.users.slice(0, e.joined_players);
      const price = { base: e.price_per_user, discount: 0, tax: +(e.price_per_user * 0.15).toFixed(2) };
      price.total = +(price.base + price.tax).toFixed(2);
      let filter = "all";
      const paint = () => {
        const shown = joined.map((n, i) => [n, i, i % 3 !== 2]).filter(([, , c]) => filter === "all" || (filter === "in" ? c : !c));
        /* the global page's view (PublicEventView.js) has no Back — ctx.noBack */
        mount.innerHTML = listHead(ctx.unit ? `${L("Public event id:", "معرف الحدث العام:")} ${e.id}` : `${L("Public event ID", "رقم الحدث العام")} ${e.id}`, ctx.noBack ? "" : backBtn(PP.href("public-events")))
          + card(`${L("General information", "المعلومات العامة")}`, "", kv([[L("Partner", "الشريك"), partnerLink(ctx.partner)], [L("Unit", "الوحدة"), unitLink(ctx, e.unit_name)], [L("Category", "الفئة"), esc(e.activity_category_name)], [L("Activity", "النشاط"), esc(e.activity_name)]]))
          + card(`${L("Session information", "معلومات الجلسة")} ${sideBadges(false, isOnline(ctx, e.unit_name))}`, "", kv([[L("Session ID", "معرف الجلسة"), `S-${e.id}`], [L("Type", "النوع"), L("Public event", "حدث عام")], [L("Date", "التاريخ"), e.date], [L("Start", "البداية"), e.start_time], [L("End", "النهاية"), e.end_time], [L("Overnight", "طوال الليل"), yesNo(false)], [L("Gender", "الجنس"), esc(PP.cap(e.session_gender))], [L("Price", "السعر"), money(price.total)]]))
          + card(L("Public event", "الحدث العام"), "", kv([[L("Public event ID", "رقم الحدث العام"), e.id], [L("Public event status", "حالة الحدث العام"), esc(PP.cap(e.status))], [L("Number of player", "عدد اللاعبين"), e.joined_players], [L("Age group", "الفئة العمرية"), esc(e.age_group_name)], [L("Created by", "أنشئ بواسطة"), esc(ctx.partner.company_name)], [L("Created at", "تاريخ الإنشاء"), esc(e.created_at)]]
            .concat(e.status === "canceled" ? [[L("Cancelled by", "ألغي بواسطة"), "Super Admin"], [L("Cancelled at", "ألغي في"), esc(e.date)]] : [])))
          /* each players section: the header only when its count is 0 (no "No data"); the
             check-in filter's "No data" shows only when the filter leaves no joined player */
          + card(`${L("Joined players", "اللاعبون المنضمون")} (${e.joined_players}/${e.player_numbers})`, e.joined_players ? `<div class="segmented" style="flex-wrap:wrap;max-width:100%;height:auto">${[["all", L("All", "الكل")], ["in", L("Checked-in", "تم تسجيل الحضور")], ["out", L("Not checked-in", "لم يسجّل الحضور")]].map(([k, t]) => `<button type="button" data-pf="${k}" class="${k === filter ? "is-active" : ""}">${t}</button>`).join("")}</div>` : "",
            !e.joined_players ? "" : shown.length ? `<div class="sa-players">${shown.map(([n, i, c]) => playerCard(n, i, c)).join("")}</div>` : `<p class="text-tertiary">${L("No data", "لا توجد بيانات")}</p>`)
          + card(`${L("Left players (early)", "اللاعبون الذين غادروا (مبكراً)")} (1)`, "", `<div class="sa-players">${playerCard(o.users[7], 7)}</div>`)
          + card(`${L("Left players (late)", "اللاعبون الذين غادروا (متأخراً)")} (0)`, "", "")
          + card(`${L("Removed players", "اللاعبون المحذوفون")} (0)`, "", "")
          + card(L("Payment", "الدفع"), "", kv([[L("Payment method", "طريقة الدفع"), esc(PP.cap(e.payment_method))],
            [L("Price per user", "السعر لكل مستخدم"), `${money(price.total)} ${SA.iconBtn("info", L("Price per user break down", "تفصيل السعر لكل مستخدم"), 'data-bd="ppu"')}`],
            [L("Charge for leave within", "رسوم المغادرة خلال"), `6 ${L("Hours", "ساعات")}`], [L("Cancelation fee per user", "رسوم الإلغاء لكل مستخدم"), `${money(price.total / 2)} (50%)`]])
            + `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Summery", "الملخص")}</h4>` + kv([
              [L("Total payment from joined players", "إجمالي الدفع من اللاعبين المنضمين"), `${money(price.total * e.joined_players)} ${SA.iconBtn("info", L("Break down", "التفصيل"), 'data-bd="joined"')}`],
              [L("Total fee from left players", "إجمالي الرسوم من اللاعبين الذين غادروا"), `${money(0)} ${SA.iconBtn("info", L("Break down", "التفصيل"), 'data-bd="left"')}`],
              [L("Total income from public event", "إجمالي الدخل من الحدث العام"), `${money(price.total * e.joined_players)} ${SA.iconBtn("info", L("Break down", "التفصيل"), 'data-bd="income"')}`]]))
          + card(L("Payment history", "سجل الدفع"), "", payHistory(txs(joined, price.total), true));
      };
      mount.addEventListener("click", (ev) => {
        const pf = ev.target.closest("[data-pf]"); if (pf) { filter = pf.dataset.pf; paint(); }
        const bd = ev.target.closest("[data-bd]");
        if (!bd) return;
        const k = bd.dataset.bd;
        if (k === "ppu") breakdown("ppBd", L("Price per user break down", "تفصيل السعر لكل مستخدم"), [[L("Price per player :", "السعر لكل لاعب :"), money(price.total)], [L("Base price :", "السعر الأساسي :"), money(price.base)], [L("Discount", "الخصم"), money(0)], [L("Public event price :", "سعر الحدث العام :"), money(price.base)], [`${L("Tax", "الضريبة")} (15%)`, money(price.tax)], [L("Total", "المجموع"), `<b>${money(price.total)}</b>`]]);
        if (k === "joined") breakdown("ppBd", L("Total payment from joined players break down", "تفصيل إجمالي الدفع من اللاعبين المنضمين"), [[L("Total number of players :", "إجمالي عدد اللاعبين :"), e.joined_players], [L("Price per player :", "السعر لكل لاعب :"), money(price.total)], [L("Total", "المجموع"), `<b>${money(price.total * e.joined_players)}</b>`]]);
        if (k === "left") breakdown("ppBd", L("Total fee from left players break down", "تفصيل إجمالي الرسوم من اللاعبين الذين غادروا"), [[L("Total number of left players with fee :", "إجمالي عدد اللاعبين الذين غادروا مع الرسوم :"), 0], [L("Fee price per player :", "سعر الرسوم لكل لاعب :"), money(price.total / 2)], [L("Total", "المجموع"), `<b>${money(0)}</b>`]]);
        if (k === "income") breakdown("ppBd", L("Total income from public event break down", "تفصيل إجمالي الدخل من الحدث العام"), [[L("Total number of players :", "إجمالي عدد اللاعبين :"), e.joined_players], [L("Price per player :", "السعر لكل لاعب :"), money(price.base)], [L("Total number of left players with fee :", "إجمالي عدد اللاعبين الذين غادروا مع الرسوم :"), 0], [L("Fee price per player :", "سعر الرسوم لكل لاعب :"), money(price.total / 2)], [L("Total", "المجموع"), `<b>${money(price.total * e.joined_players)}</b>`]]);
      });
      paint();
      return;
    }
    mount.innerHTML = listHead(L("Public events", "الأحداث العامة")) + `<div data-l></div>`;
    const evCtl = SA.list({ mount: mount.querySelector("[data-l]"), data: forUnit(ctx, o.events), tiles: true, pills: statusPills(false), pillMatch: (r, k) => !k || r.status === k,
      search: ["Search by name", "البحث بالاسم"], searchMatch: (r, q) => r.unit_name.toLowerCase().includes(q) || r.activity_name.toLowerCase().includes(q),
      toolbarExtra: ctx.unit ? PP.filterBtn() : "", extraMatch: unitMatch,
      empty: ["There is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["#", "#"], cell: (r) => `<b>#${r.id}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { hidden: !!ctx.unit, head: ["Unit", "الوحدة"], cell: (r) => esc(r.unit_name) },
        { head: ["Session time", "وقت الجلسة"], cell: (r) => `${r.date}<div class="t-xs text-tertiary">${r.start_time} – ${r.end_time}</div>` },
        { head: ["Activity", "النشاط"], cell: (r) => `${esc(r.activity_category_name)}<div class="t-xs text-tertiary">${esc(r.activity_name)}</div>` },
        { head: ["Age group", "الفئة العمرية"], cell: (r) => esc(r.age_group_name) },
        { head: ["Session gender", "جنس الجلسة"], cell: (r) => esc(PP.cap(r.session_gender)) },
        { head: ["Joined users", "المستخدمون المنضمون"], cell: (r) => `${r.joined_players} / ${r.player_numbers}` },
        { head: ["Price Per User", "السعر لكل مستخدم"], cell: (r) => `${r.price_per_user} SAR<div class="t-xs text-tertiary">${esc(PP.cap(r.payment_method))}</div>` },
        { head: ["Status", "الحالة"], cell: (r) => sessionStatus(r.status) },
        { head: ["Actions", "الإجراءات"], cell: (r) => eye(PP.href("public-events", { view: r.id }), "", ctx.unit ? "view_public_event_details" : "") },
      ] });
    if (ctx.unit) unitFilter(mount, evCtl, "events");
  };

  /* ================= bookings =================
     ctx.noBack: the global bookings page's view has no Back (pages/bookings/BookingView.js). */
  PP.tabs.bookings = (mount, ctx) => {
    const o = ops(ctx.partner), view = ctx.params.get("view");
    if (denied(mount, view ? "view_booking_details" : "view_bookings")) return;
    if (view) {
      const b = o.bookings.find((x) => String(x.id) === view) || o.bookings[0];
      /* SessionBookingView (modules/bookings) — GET /session-booking/{id}.
         Multi-booking booking: Type "… - Multi-booking session", a Tickets line in the
         breakdown, and session price / tax × tickets. Additional services table only when
         there are services; Session status only when it has a value. */
      const svc = b.has_services ? [{ name: "Racket rental", price: 10, qty: 2, duration: 30 }] : [];
      const svcTotal = svc.reduce((a, s) => a + s.price * s.qty, 0);
      const tk = b.is_multi_booking ? b.tickets : 1;
      const pd = { base: b.paid_price, discount: 0, tax: +(b.paid_price * 0.15).toFixed(2) };
      pd.subtotal = +((pd.base + pd.tax) * tk + svcTotal).toFixed(2);
      const checked = b.status === "ended";
      const bType = `${L("Normal", "عادي")}${b.is_multi_booking ? ` - ${L("Multi-booking session", "جلسة الحجز المتعدد")}` : ""}`;
      mount.innerHTML = listHead(ctx.unit ? `${L("Booking id:", "رقم الحجز:")} ${b.id}` : `${L("Booking ID", "رقم الحجز")} ${b.id}`, ctx.noBack ? "" : backBtn(PP.href("bookings")))
        + card(`${L("General information", "المعلومات العامة")} ${b.edited_after_booking ? badge("success", L("Edited", "محرر")) : ""}`, "", kv([[L("Partner", "الشريك"), partnerLink(ctx.partner)], [L("Unit", "الوحدة"), unitLink(ctx, b.unit_name)], [L("Category", "الفئة"), esc(b.activity_category_name)], [L("Activity", "النشاط"), esc(b.activity_name)]]))
        + card(`${L("Session information", "معلومات الجلسة")} ${sideBadges(b.is_edited, isOnline(ctx, b.unit_name))}`, "", kv([[L("Session ID", "معرف الجلسة"), `S-${b.id}`], [L("Type", "النوع"), bType], b.session_status_set ? [L("Session status", "حالة الجلسة"), esc(PP.cap(b.status))] : null, [L("Date", "التاريخ"), b.date], [L("Start", "البداية"), b.start_time], [L("End", "النهاية"), b.end_time], [L("Overnight", "طوال الليل"), yesNo(false)], [L("Gender", "الجنس"), esc(PP.cap(b.session_gender))],
            [L("Price", "السعر"), `${money(pd.subtotal)} ${SA.iconBtn("info", L("Break down", "التفصيل"), "data-bdb")}`]])
          + (svc.length ? `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Additional services", "الخدمات الإضافية")}</h4>`
            + SA.table({ rows: svc, empty: ["No data", "لا توجد بيانات"], columns: [{ head: ["Name", "الاسم"], cell: (s) => esc(s.name) }, { head: ["Price", "السعر"], cell: (s) => money(s.price) }, { head: ["Qty", "الكمية"], cell: (s) => s.qty }, { head: ["Duration", "المدة"], cell: (s) => `${pad(Math.floor(s.duration / 60))}:${pad(s.duration % 60)}` }, { head: ["Total", "الإجمالي"], cell: (s) => money(s.price * s.qty) }] }) : ""))
        + card(L("Booking", "الحجز"), "", kv([[L("Booking id", "معرف الحجز"), `B-${b.id}`], [L("Type", "النوع"), esc(PP.cap(b.booking_type))], [L("Booking status", "حالة الحجز"), esc(PP.cap(b.status))],
            [L("Booked for", "محجوز لـ"), `<span class="row gap-3" style="align-items:center">${avatar(b.user_name)}<span><b>${esc(b.user_name)}</b><div class="t-xs text-tertiary">@vie_${b.id % 900} · ${L("High five user", "مستخدم هاي فايف")}</div></span></span>`],
            [L("Booked by", "محجوز بواسطة"), esc(b.booking_type === "manual" ? ctx.partner.company_name : b.user_name)], [L("Booked at", "تم الحجز في"), esc(b.created_at)]]
            .concat(b.status === "canceled" ? [[L("Cancelled by", "ألغي بواسطة"), esc(b.user_name)], [L("Cancelled at", "ألغي في"), b.date]] : [])))
        + card(L("Check-in", "تسجيل الحضور"), "", kv([[L("Check-in status", "حالة تسجيل الحضور"), checked ? badge("success", L("Checked-in", "تم تسجيل الحضور")) : badge("", L("Not checked-in", "لم يسجّل الحضور"))]]
            .concat(checked ? [[L("Checked-in at", "وقت تسجيل الحضور"), `${b.date} ${b.start_time}`], [L("Checked-in by", "سجّله"), "Ahmed Saeed"], [L("Branch", "الفرع"), esc((ctx.partner.branches[0] || {}).name)], [L("Method", "الطريقة"), L("QR scan", "مسح رمز QR")]] : [])))
        + card(L("Payment", "الدفع"), "", kv([[L("Payment method", "طريقة الدفع"), esc(PP.cap(b.payment_method))], [L("Payment status", "حالة الدفع"), b.payment_method === "online" ? L("Paid", "مدفوع") : L("Unpaid", "غير مدفوع")]]
            .concat(b.status === "canceled" ? [[L("Cancelation fee", "رسوم الإلغاء"), `50% (${money(b.paid_price / 2)})`]] : [])))
        + card(L("Payment history", "سجل الدفع"), "", payHistory(txs([b.user_name], pd.subtotal), false));
      mount.querySelector("[data-bdb]").onclick = () => breakdown("ppBdb", L("Break down", "التفصيل"), [[L("Base price :", "السعر الأساسي :"), money(pd.base)],
        b.is_multi_booking ? [L("Tickets", "تذاكر"), tk] : null,
        [`${L("Discount", "الخصم")} (0%)`, money(0)], [L("Total session price :", "إجمالي سعر الجلسة :"), money((pd.base * tk).toFixed(2))], [L("Tax for", "الضريبة لـ"), `VAT (15%) ${money(pd.tax)}`], [`${L("Total tax", "إجمالي الضريبة")} (15%)`, money((pd.tax * tk).toFixed(2))]]
        .concat(svc.length ? [[L("Additional services", "الخدمات الإضافية"), svc.map((s) => `${esc(s.name)} (${L("price", "السعر")}: ${s.price} - ${L("Qty", "الكمية")}: ${s.qty}) ${money(s.price * s.qty)}`).join("<br>")]] : [])
        .concat([[L("Total additional services", "إجمالي الخدمات الإضافية"), money(svcTotal.toFixed(2))], [L("Total", "المجموع"), `<b>${money(pd.subtotal)}</b>`]]));
      return;
    }
    /* Redesign (2026-11-17): the status pills became stat tiles with counts (same
       five statuses, same match); everything else — search, unit filter, columns,
       the booking view — is unchanged. Shared by the partner and unit profiles. */
    const bkData = forUnit(ctx, o.bookings);
    let tile = "";
    const TILE_LOOK = { "": ["booking", ""], coming: ["calendar", "info"], pending: ["clock", "warning"], ended: ["check", "success"], canceled: ["close", "danger"] };
    const paintTiles = () => (mount.querySelector("[data-tiles]").innerHTML = PP.tiles(statusPills(true).map((s) => ({ key: s.key, label: s.label, icon: TILE_LOOK[s.key][0], tone: TILE_LOOK[s.key][1], count: s.key ? bkData.filter((r) => r.status === s.key).length : bkData.length })), tile));
    mount.innerHTML = listHead(L("Bookings", "الحجوزات")) + `<div data-tiles></div><div data-l></div>`;
    paintTiles();
    mount.addEventListener("click", (e) => {
      const t = e.target.closest("[data-tile]");
      if (!t) return;
      tile = t.dataset.tile === tile ? "" : t.dataset.tile;
      bkCtl.state.page = 1; paintTiles(); bkCtl.paint();
    });
    const bkCtl = SA.list({ mount: mount.querySelector("[data-l]"), data: bkData,
      search: ctx.unit ? ["Search by booking id", "البحث برقم الحجز"] : ["Search by unit name", "البحث باسم الوحدة"], searchMatch: (r, q) => (ctx.unit ? String(r.id).includes(q) : r.unit_name.toLowerCase().includes(q)),
      toolbarExtra: ctx.unit ? PP.filterBtn() : "", extraMatch: (r, f) => (!tile || r.status === tile) && unitMatch(r, f),
      empty: () => `<span class="stack gap-2" style="align-items:center">${ic("calendar")}<b>${L("No bookings yet", "لا توجد حجوزات")}</b><span class="t-sm">${L("Try another tab, adjust filters, or search again.", "جرّب تبويبًا آخر أو غيّر عوامل التصفية أو أعد البحث.")}</span></span>`,
      columns: [
        { head: ["#", "#"], cell: (r) => `<b>#${r.id}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { hidden: !!ctx.unit, head: ["Unit", "الوحدة"], cell: (r) => esc(r.unit_name) },
        { head: ["Date & time", "التاريخ والوقت"], cell: (r) => `${r.date} ${r.start_time}<div class="t-xs text-tertiary">${r.end_time}</div>` },
        { head: ["Activity", "النشاط"], cell: (r) => `${esc(r.activity_category_name)}<div class="t-xs text-tertiary">${esc(r.activity_name)}</div>` },
        { head: ["User", "المستخدم"], cell: (r) => esc(r.user_name) },
        { head: ["Session gender", "جنس الجلسة"], cell: (r) => esc(PP.cap(r.session_gender)) },
        { head: ["Booking type", "نوع الحجز"], cell: (r) => esc(PP.cap(r.booking_type)) },
        { head: ["Price Per User", "السعر لكل مستخدم"], cell: (r) => `${r.paid_price} SAR<div class="t-xs text-tertiary">${esc(PP.cap(r.payment_method))}</div>` },
        { head: ["Status", "الحالة"], cell: (r) => sessionStatus(r.status) },
        { head: ["Actions", "الإجراءات"], cell: (r) => eye(PP.href("bookings", { view: r.id }), "", ctx.unit ? "view_booking_details" : "") },
      ] });
    if (ctx.unit) unitFilter(mount, bkCtl, "bookings");
  };

  /* ================= multi-bookings ================= */
  PP.tabs["multi-bookings"] = (mount, ctx) => {
    const o = ops(ctx.partner);
    if (denied(mount, "view_multi_bookings")) return;
    mount.innerHTML = listHead(L("Multi-booking sessions", "جلسات الحجز المتعدد")) + `<div data-l></div>`;
    SA.list({ mount: mount.querySelector("[data-l]"), data: forUnit(ctx, o.multi), tiles: true, pills: statusPills(false), pillMatch: (r, k) => !k || r.status === k,
      search: ctx.unit ? ["Search by session id", "البحث برقم الجلسة"] : ["Search by unit name", "البحث باسم الوحدة"], searchMatch: (r, q) => (ctx.unit ? String(r.id).includes(q) : r.unit_name.toLowerCase().includes(q)),
      empty: ["There is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["#", "#"], cell: (r) => `<b>#${r.id}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { hidden: !!ctx.unit, head: ["Unit", "الوحدة"], cell: (r) => `${esc(r.unit_name)}<div class="t-xs text-tertiary">${esc(r.company_name)}</div>` },
        { head: ["Date & time", "التاريخ والوقت"], cell: (r) => `${r.date}<div class="t-xs text-tertiary">${r.start_time} - ${r.end_time}</div>` },
        { head: ["Activity", "النشاط"], cell: (r) => `${esc(r.activity_category_name)}<div class="t-xs text-tertiary">${esc(r.activity_name)}</div>` },
        { head: ["Session gender", "جنس الجلسة"], cell: (r) => esc(PP.cap(r.session_gender)) },
        { head: ["Price Per User", "السعر لكل مستخدم"], cell: (r) => `${r.price_per_user} ${esc(r.currency.code)}<div class="t-xs text-tertiary">${esc(PP.cap(r.payment_method))}</div>` },
        { head: ["Capacity", "القدرة"], cell: (r) => `${r.booked_tickets} / ${r.max_capacity}` },
        { head: ["Status", "الحالة"], cell: (r) => sessionStatus(r.status) },
        { head: ["Actions", "الإجراءات"], cell: (r) => eye(`multi-booking.html?id=${r.id}&redirect_to_page=1&${ctx.unit ? "from=units-profile&unit_id=" + ctx.unit.id : "from=partners-profile&user_id=" + ctx.partner.id}`, "", "view_multi_booking_details") },
      ] });
  };

  /* ================= policies (+ units, + view) ================= */
  PP.tabs.policies = (mount, ctx) => {
    const o = ops(ctx.partner), view = ctx.unit ? String(o.policies[0].id) : ctx.params.get("view"), units = ctx.unit ? null : ctx.params.get("units");
    if (units) return unitsSub(mount, ctx, (o.policies.find((x) => String(x.id) === units) || {}).name || "", "policies", false);
    if (view) {
      /* no policy (GET returns nothing) → "No data" — sample via ?demo=nopolicy */
      if (new URLSearchParams(location.search).get("demo") === "nopolicy") {
        mount.innerHTML = `<p class="text-tertiary">${L("No data", "لا توجد بيانات")}</p>`;
        return;
      }
      const p = o.policies.find((x) => String(x.id) === view) || o.policies[0];
      /* Redesign (2026-11-17): the policy rules read as full sentences (label over a
         full-width line, the number as a badge) instead of being squeezed into the
         narrow key/value grid. Same fields and meaning as the dashboard's
         PolicyView (partner: pages/partners/profile/policies, unit: pages/units/profile/policy). */
      const n = (v) => `<b class="badge badge--success" style="vertical-align:baseline;font-variant-numeric:tabular-nums">${esc(v == null || v === "" ? "0" : v)}</b>`;
      const hrs = (v) => L(+v === 1 ? "hour" : "hours", +v === 1 ? "ساعة" : +v >= 3 && +v <= 10 ? "ساعات" : "ساعة");
      const rules = (rows) => `<div class="stack gap-5">${rows.filter(Boolean).map((r) => `<div style="min-width:0"><div class="t-xs text-tertiary" style="margin-bottom:var(--space-1)">${r[0]}</div><p class="t-sm" style="margin:0;line-height:1.8;max-width:72ch">${r[1]}</p>${r[2] ? `<p class="t-xs text-tertiary" style="margin:var(--space-1) 0 0">${r[2]}</p>` : ""}</div>`).join("")}</div>`;
      const note = (t) => `<p class="t-sm row gap-1" style="margin:0;color:var(--color-danger);align-items:flex-start">${ic("info")}<span>${t}</span></p>`;
      const cut = p.book_multi_session_before_session_end;
      mount.innerHTML = listHead(esc(p.name), ctx.unit ? "" : backBtn(PP.href("policies")))
        + card(L("Policies", "السياسات"), "", kv([[L("Name", "الاسم"), dash(p.name)], [L("Who can book?", "من يمكنه الحجز؟"), dash(p.who_can_book)]]))
        + card(L("Booking frequency", "تكرار الحجز"), "", kv([[L("How many sessions can a HighFive user book?", "كم عدد الجلسات التي يمكن لمستخدم هاي فايف حجزها؟"), dash(p.booking_frequency)]]))
        /* requires_approval: 1 Yes · 0 No · anything else "---" */
        + card(L("Approval configuration", "إعدادات الموافقة"), "", kv([[L("Requires approval", "يتطلب موافقة"), p.requires_approval === 1 || p.requires_approval === 0 ? yesNo(p.requires_approval) : "---"]].concat(p.requires_approval === 1 ? [[L("Approval duration", "مدة الموافقة"), p.approval_duration_hours != null && p.approval_duration_hours !== "" ? `${p.approval_duration_hours} ${L("Hours", "ساعات")}` : "---"], [L("Operation hours", "ساعات العمل"), p.operation_hours_from && p.operation_hours_to ? `${p.operation_hours_from.slice(0, 5)} - ${p.operation_hours_to.slice(0, 5)}` : "---"]] : [])))
        + card(L("Cancellation policy", "سياسة الإلغاء"), "", `<h4 class="t-sm" style="font-weight:var(--weight-bold);margin:0 0 var(--space-4)">${L("Online payment", "الدفع الإلكتروني")}</h4>` + rules([
            /* HIGH_FIVE_USER_WILL_GET_FULL_REFUND … HOURS_BEFORE_SESSION_START_TIME: a full refund when cancelled WITHIN n hours before the start */
            [L("Free cancellation", "الإلغاء المجاني"), L(`A HighFive user gets a full refund if they cancel within ${n(p.free_cancellation_time)} hours before the session starts.`, `يحصل مستخدم هاي فايف على استرداد كامل إذا ألغى الحجز خلال ${n(p.free_cancellation_time)} ساعة قبل بداية الجلسة.`)],
            [L("Fees for cancellation", "رسوم الإلغاء"), L(`Charge the HighFive user ${n(p.fees_for_cancellation)} % of the paid amount.`, `يُخصم من مستخدم هاي فايف ${n(p.fees_for_cancellation)} % من المبلغ المدفوع.`)]])
          + `<h4 class="t-sm" style="font-weight:var(--weight-bold);margin:var(--space-6) 0 var(--space-3)">${L("Cash payment", "الدفع النقدي")}</h4><div class="alert alert--warning"><span class="alert__icon">${ic("info")}</span><div class="alert__body">${L("Cancellation charges for cash bookings are agreed directly with the HighFive user and are not counted in your accounting page.", "رسوم إلغاء الحجوزات المدفوعة نقدًا تخضع للاتفاق مع مستخدم هاي فايف، ولا تُحتسب ماليًا في صفحة المحاسبة.")}</div></div>`)
        + card(L("Locker", "القفل"), "", rules([[L("Locker", "القفل"), L(`All unlocked bookings will be auto locked in ${n(p.locker_time)} ${hrs(p.locker_time)} before start time.`, `سيتم قفل جميع الحجوزات غير المقفلة تلقائيًا خلال ${n(p.locker_time)} ${hrs(p.locker_time)} قبل وقت البداية.`)]]))
        + card(L("Receive bookings time control", "التحكم في وقت استقبال الحجوزات"), "", rules([[L("Time control", "التحكم في الوقت"), L(`Do not show any available session to HighFive users within ${n(p.receiving_booking_time_control)} ${hrs(p.receiving_booking_time_control)} before start time.`, `لا تظهر أي جلسة متاحة لمستخدمي هاي فايف خلال ${n(p.receiving_booking_time_control)} ${hrs(p.receiving_booking_time_control)} قبل وقت البداية.`)]])
          /* unit PolicyView only (commented out in the partner's PolicyView) */
          + (ctx.unit ? `<div class="stack gap-2">${note(L("(zero) is the best option if you are in unit during operations hour", "(صفر) هو الخيار الأفضل إذا كنت في الوحدة خلال ساعات العمل"))}${note(L("Note: you have full control to link or create manual booking in any available session", "ملاحظة: لديك تحكم كامل لربط أو إنشاء حجز يدوي في أي جلسة متاحة"))}</div>` : ""))
        + card(L("Receive bookings before end of session hours", "استقبال الحجوزات قبل نهاية ساعات الجلسة"), "", rules([[L("Enable booking cutoff before end time", "تفعيل وقت انتهاء الحجز قبل وقت الانتهاء"), cut != null && cut !== "" ? L(`${n(cut)} ${hrs(cut)} before end time`, `${n(cut)} ${hrs(cut)} قبل وقت الانتهاء`) : "---"]]));
      return;
    }
    mount.innerHTML = listHead(L("Policies", "السياسات")) + `<div data-l></div>`;
    SA.list({ mount: mount.querySelector("[data-l]"), data: o.policies, search: ["Search by name", "البحث بالاسم"], searchMatch: (r, q) => r.name.toLowerCase().includes(q), empty: ["There is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["Name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b>` },
        { head: ["Units", "الوحدات"], cell: (r) => `<a href="${PP.href("policies", { units: r.id })}" style="color:var(--color-text-link);font-weight:var(--weight-semibold)">${r.units_count} ${L("Units", "الوحدات")}</a>` },
        { head: ["Actions", "الإجراءات"], cell: (r) => eye(PP.href("policies", { view: r.id })) },
      ] });
  };

  /* ================= employees (+ units) ================= */
  PP.tabs.employees = (mount, ctx) => {
    const p = ctx.partner, units = ctx.params.get("units");
    if (units) return unitsSub(mount, ctx, (p.employees.find((x) => String(x.id) === units) || {}).name || "", "employees", true);
    mount.innerHTML = listHead(L("Employees", "الموظفين")) + `<div data-l></div>`;
    SA.list({ mount: mount.querySelector("[data-l]"), data: p.employees, search: ["Search by name", "البحث بالاسم"], searchMatch: (r, q) => r.name.toLowerCase().includes(q), empty: ["There is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["Name", "الاسم"], cell: (r) => `<div class="cell-user">${avatar(r.name)}<div><b>${esc(r.name)}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div></div></div>` },
        { head: ["Phone", "الهاتف"], cell: (r) => `<span dir="ltr">${esc(r.phone)}</span>` },
        { head: ["Email", "البريد الإلكتروني"], cell: (r) => esc(r.email) },
        { head: ["Assignment", "التعيين"], cell: (r) => `<a href="${PP.href("employees", { units: r.id })}" style="color:var(--color-text-link);font-weight:var(--weight-semibold)">${r.units_assigned_count} ${L("Units", "الوحدات")}</a>` },
        { head: ["Status", "الحالة"], cell: (r) => (r.active === 1 ? badge("primary", L("Active", "نشط")) : badge("danger", L("Inactive", "غير نشط"))) },
      ] });
  };

  /* ================= contacts (+ units) ================= */
  PP.tabs.contacts = (mount, ctx) => {
    const p = ctx.partner, units = ctx.params.get("units");
    if (units) return unitsSub(mount, ctx, (p.contacts.find((x) => String(x.id) === units) || {}).name || "", "contacts", true);
    mount.innerHTML = listHead(L("Contacts", "جهات الاتصال")) + `<div data-l></div>`;
    SA.list({ mount: mount.querySelector("[data-l]"), data: p.contacts, search: ["Search by name", "البحث بالاسم"], searchMatch: (r, q) => r.name.toLowerCase().includes(q), empty: ["There is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["Name", "الاسم"], cell: (r) => `<div class="cell-user">${avatar(r.name)}<div><b>${esc(r.name)}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div></div></div>` },
        { head: ["Phone", "الهاتف"], cell: (r) => `<span dir="ltr">${esc(r.phone)}</span>` },
        { hidden: !!ctx.unit, head: ["Assignment", "التعيين"], cell: (r) => `<a href="${PP.href("contacts", { units: r.id })}" style="color:var(--color-text-link);font-weight:var(--weight-semibold)">${r.units_count} ${L("Units", "الوحدات")}</a>` },
      ] });
  };
})();
