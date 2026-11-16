/* User profile — info · bookings · multi-bookings · public events · packages ·
   comments · notes. Mirrors pages/users/profile/{details,bookings,multi-bookings,
   public-events,packages,comments,notes}. Booking / public-event views, the
   notes thread and the subscription page are the same components the
   dashboard shares with the partner and package pages, so they are reused. */
(function () {
  "use strict";
  const { L, esc, ic, badge, fmt } = SA;
  const { card, kv } = PP;
  const US = (window.US = window.US || { tabs: {} });
  const dash = (v) => (v == null || v === "" ? "---" : esc(v));
  const eye = (href, label, extra) => `<a class="icon-btn" href="${href}" aria-label="${label || L("View", "عرض")}" title="${label || L("View", "عرض")}" ${extra || ""}>${ic("eye")}</a>`;
  const statusBadge = (s) => badge(s === "coming" ? "success" : s === "ended" ? "primary" : "danger", s);

  /* ---------- per-user sample sessions, taken from partners' sessions (one source) ---------- */
  US.sessions = function (u) {
    if (u._ses) return u._ses;
    const ps = [0, 3, 7].map((k) => HF.SA.partners[(u.id + k) % HF.SA.partners.length]);
    const bookings = [], multi = [], events = [];
    ps.forEach((p, pi) => {
      PP.extend(p);
      const o = PP.ops(p);
      o.bookings.slice(0, 3 + (pi % 2)).forEach((b) => { b.user_name = u.name; bookings.push(Object.assign(b, { company_name: p.company_name, _partner: p.id })); });
      o.multi.slice(0, 2).forEach((m) => multi.push(Object.assign({}, m, { company_name: p.company_name, booking_type: "online", paid_price: m.price_per_user, _partner: p.id })));
      o.events.slice(0, 2).forEach((e, k) => events.push({ id: 8000 + e.id, created_at: e.created_at, company: { id: p.id, name: p.company_name }, branch: { name: (p.branches[0] || {}).name || "Main Branch" }, unit: { name: e.unit_name }, category: e.activity_category_name, activity: e.activity_name,
        start_at: `${e.date} ${e.start_time}`, end_at: `${e.date} ${e.end_time}`, age_group: e.age_group_name, gender: e.session_gender, user: { name: u.name, username: u.high_five_user_name },
        status: ["joined", "left", "removed"][(k + pi) % 3], status_date: e.date, public_event: { id: e.id, created_at: e.created_at, status: e.status }, price_per_user: e.price_per_user, currency: { code: u.country.currency.code }, _partner: p.id }));
    });
    u._ses = { bookings, multi, events };
    return u._ses;
  };

  /* ================= info ================= */
  US.tabs.details = (mount, ctx) => {
    const u = ctx.user;
    const paint = () => (mount.innerHTML = card(L("info", "معلومات"), PP.btn(L("edit", "تعديل"), "edit", "data-edit", "secondary"), kv([
      [L("name", "الاسم"), dash(u.name)], [L("username", "اسم المستخدم"), dash(u.high_five_user_name)], [L("country", "البلد"), dash(u.country.name)],
      [L("phone", "الهاتف"), `<span dir="ltr">${dash(u.phone)}</span>`], [L("email", "البريد الإلكتروني"), dash(u.email)], [L("gender", "الجنس"), dash(u.gender)],
      [L("date of birth", "تاريخ الميلاد"), dash(u.date_of_birth)], [L("location", "الموقع"), dash(u.location.state)], [L("registered at", "تاريخ التسجيل"), dash(u.created_at)]])));
    mount.addEventListener("click", (e) => {
      if (!e.target.closest("[data-edit]")) return;
      /* update user — POST /users/{id}/update-info (multipart, _method=PUT). Validation copy is hard-coded English in the dashboard. */
      const codes = [...new Set(HF.SA.users.map((x) => x.phone_code))];
      const [d, m, y] = (u.date_of_birth || "").split("/");
      const el = SA.modal({ id: "usEdit", title: L("update user", "تحديث المستخدم"), body: `<div class="stack gap-4"><div data-alert></div>
          <div class="row gap-3" style="align-items:center">${PP.avatar(u.name, "lg")}<button type="button" class="btn btn--sm btn--secondary">${ic("camera")}<span>${L("Change image", "Change image")}</span></button></div>
          <div class="field"><label class="field__label">${L("name:", "الاسم:")}</label><input class="input" data-f="name" value="${esc(u.name)}" placeholder="${L("enter name", "أدخل الاسم")}"><span data-e="name"></span></div>
          ${SA.field(["username:", "اسم المستخدم:"], `<input class="input" data-f="username" value="${esc(u.high_five_user_name || "")}" placeholder="${L("enter username", "أدخل اسم المستخدم")}">`)}
          <div class="field"><label class="field__label">${L("email:", "البريد الإلكتروني:")}</label><input class="input" data-f="email" value="${esc(u.email || "")}" placeholder="${L("enter email", "أدخل البريد الإلكتروني")}"><span data-e="email"></span></div>
          <div class="field"><label class="field__label">${L("phone:", "الهاتف:")}</label><div class="row gap-2" dir="ltr">${SA.select(codes.map((c) => [c, c, c === u.phone_code]), 'data-f="code" style="width:110px"')}<input class="input" data-f="phone" value="${esc((u.phone || "").replace(u.phone_code, "").trim())}" placeholder="${L("enter phone", "أدخل رقم الهاتف")}"></div><span data-e="phone"></span></div>
          <div class="field"><label class="field__label">${L("gender:", "الجنس:")}</label>${SA.select([["", L("select gender", "اختر الجنس")], ["male", L("male", "ذكر"), u.gender === "male"], ["female", L("female", "أنثى"), u.gender === "female"]], 'data-f="gender"')}<span data-e="gender"></span></div>
          ${SA.field(["date of birth:", "تاريخ الميلاد:"], `<input class="input" type="date" max="2012-12-31" data-f="dob" value="${y ? `${y}-${m}-${d}` : ""}" placeholder="${L("select birth date", "اختر تاريخ الميلاد")}">`)}</div>`,
        foot: `<button class="btn btn--ghost" data-close>${L("cancel", "إلغاء")}</button><button class="btn" data-ok>${L("update", "تحديث")}</button>` });
      el.querySelector("[data-ok]").onclick = (ev) => {
        const v = (k) => el.querySelector(`[data-f="${k}"]`).value.trim(), errs = {};
        if (!v("name")) errs.name = "this field is required"; else if (v("name").length < 3) errs.name = "Minimum 3 symbols"; else if (v("name").length > 50) errs.name = "Maximum 50 symbols";
        if (!v("phone")) errs.phone = "this field is required"; else if (!/^[0-9 ]{6,15}$/.test(v("phone"))) errs.phone = "phone number is not valid";
        if (!v("gender")) errs.gender = "this field is required";
        if (!v("email")) errs.email = "this field is required"; else if (!/^\S+@\S+\.\S+$/.test(v("email"))) errs.email = "Wrong email format";
        ["name", "phone", "gender", "email"].forEach((k) => (el.querySelector(`[data-e="${k}"]`).innerHTML = errs[k] ? `<span class="field__error">${ic("warn")} ${errs[k]}</span>` : ""));
        if (Object.keys(errs).length) return;
        const b = ev.currentTarget; b.disabled = true; b.textContent = L("update ...", "جاري التحديث...");
        setTimeout(() => {
          const dob = v("dob").split("-");
          Object.assign(u, { name: v("name"), high_five_user_name: v("username") || null, email: v("email"), phone_code: v("code"), phone: `${v("code")} ${v("phone")}`, gender: v("gender"), date_of_birth: dob.length === 3 ? `${dob[2]}/${dob[1]}/${dob[0]}` : u.date_of_birth });
          SA.close(el); paint(); US.refreshHero(); /* no toast — as in the dashboard */
        }, 400);
      };
    });
    paint();
  };

  /* ---------- shared Filter Options for the three session lists ---------- */
  const sessionFilter = (mount, ctl, kind) => mount.addEventListener("click", (e) => {
    const fb = e.target.closest("[data-filter]");
    if (!fb) return;
    PP.filterPop(fb, { value: ctl.state.extra, width: 300, cascade: { category: ["activity"] },
      fields: [
        { key: "session", type: "range", label: ["session date :", "تاريخ الجلسة:"] },
        { key: "category", label: ["Category :", "الفئة:"], placeholder: ["select category", "اختر الفئة"], options: () => HF.SA.CATS.map((c) => [c.name, c.name]) },
        { key: "activity", label: ["activity:", "النشاط:"], placeholder: ["select activity", "اختر النشاط"], options: (d) => (d.category ? HF.SA.ACTS[(HF.SA.CATS.find((c) => c.name === d.category) || {}).id] || [] : []).map((a) => [a, a]) },
        kind === "bookings" ? { key: "btype", label: ["booking type:", "نوع الحجز:"], placeholder: ["select booking type", "اختر نوع الحجز"], options: () => [["online", L("online", "عبر الإنترنت")], ["linked", L("linked", "مرتبط")], ["manual", L("manual", "يدوي")]] } : null,
        /* the dashboard reuses "select booking type" as this field's placeholder — kept 1:1 */
        kind === "events" ? { key: "age", label: ["age group:", "الفئة العمرية:"], placeholder: ["select booking type", "اختر نوع الحجز"], options: () => ["Kids", "Teens", "Adults"].map((a) => [a, a]) } : null,
        { key: "gender", label: ["session Gender:", "جنس الجلسة:"], placeholder: ["select session Gender", "اختر جنس الجلسة"], options: () => [["male", L("male", "ذكر")], ["female", L("female", "أنثى")], ["both", L("both", "كلاهما")]] },
      ].filter(Boolean),
      onApply: (d) => { ctl.state.extra = d; ctl.paint(); } });
  });
  const sessionMatch = (date) => (r, f) => (!f.session_from || date(r) >= f.session_from) && (!f.session_to || date(r) <= f.session_to)
    && (!f.category || (r.activity_category_name || r.category) === f.category) && (!f.activity || (r.activity_name || r.activity) === f.activity)
    && (!f.btype || r.booking_type === f.btype) && (!f.age || r.age_group === f.age) && (!f.gender || (r.session_gender || r.gender) === f.gender);
  const sessionCols = (withType) => [
    { head: ["#", "#"], cell: (r) => `<b>#${r.id}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
    { head: ["company", "الشركة"], align: "center", cell: (r) => dash(r.company_name) },
    { head: ["unit", "الوحدة"], align: "center", cell: (r) => dash(r.unit_name) },
    { head: ["date & time", "التاريخ والوقت"], align: "center", cell: (r) => `${esc(r.date)}<div class="t-xs text-tertiary">${esc(r.start_time)}</div><div class="t-xs text-tertiary">${esc(r.end_time)}</div>` },
    { head: ["activity", "النشاط"], align: "center", cell: (r) => `${esc(r.activity_category_name)}<div class="t-xs text-tertiary">${esc(r.activity_name)}</div>` },
    { head: ["session gender", "جنس الجلسة"], align: "center", cell: (r) => dash(r.session_gender) },
    { hidden: !withType, head: ["booking type", "نوع الحجز"], align: "center", cell: (r) => dash(r.booking_type) },
    /* "SAR" is hard-coded in the dashboard cell — kept 1:1 */
    { head: ["price per user", "السعر لكل مستخدم"], align: "center", cell: (r) => `<b>${r.paid_price || 0}</b> <span class="t-xs">SAR</span><div class="t-xs text-tertiary">${dash(r.payment_method)}</div>` },
    { head: ["status", "الحالة"], align: "center", cell: (r) => statusBadge(r.status) },
  ];
  /* booking / public-event view = the partner profile's view (same dashboard component) */
  const sharedView = (tab, mount, ctx, row) => PP.tabs[tab](mount, { partner: HF.SA.partners.find((p) => p.id === row._partner), params: new URLSearchParams({ view: String(row.id) }) });

  /* ================= bookings ================= */
  US.tabs.bookings = (mount, ctx) => {
    const S = US.sessions(ctx.user), view = ctx.params.get("view");
    if (view) { const row = S.bookings.find((b) => String(b.id) === view) || S.bookings[0]; return sharedView("bookings", mount, ctx, row); }
    const ctl = SA.list({
      mount, data: S.bookings, cardTitle: ["bookings", "الحجوزات"],
      pills: [["all", "all", "الكل"], ["coming", "coming", "قادم"], ["pending", "Pending Approval", "في انتظار الموافقة"], ["ended", "ended", "انتهى"], ["canceled", "cancelled", "ملغي"]].map((p) => ({ key: p[0], label: [p[1], p[2]] })),
      pillMatch: (r, k) => k === "all" || r.status === k,
      search: ["search by unit name or id", "البحث باسم الوحدة أو الرقم"], searchMatch: (r, q) => r.unit_name.toLowerCase().includes(q) || String(r.id).includes(q),
      toolbarExtra: PP.filterBtn(), extraMatch: sessionMatch((r) => r.date),
      empty: () => `<div class="stack gap-2" style="align-items:center"><span style="transform:scale(1.6)">${ic("calendar")}</span><b style="margin-top:var(--space-2)">${L("No bookings yet", "لا توجد حجوزات")}</b><span class="t-sm">${L("Try another tab, adjust filters, or search again.", "جرّب تبويبًا آخر أو غيّر عوامل التصفية أو أعد البحث.")}</span></div>`,
      columns: sessionCols(true).concat([{ head: ["Actions", "الإجراءات"], align: "center", cell: (r) => eye(US.href("bookings", { view: r.id })) }]),
    });
    sessionFilter(mount, ctl, "bookings");
  };

  /* ================= multi-bookings ================= */
  US.tabs["multi-bookings"] = (mount, ctx) => {
    const S = US.sessions(ctx.user);
    const ctl = SA.list({
      mount, data: S.multi, cardTitle: ["multi-bookings", "الحجوزات المتعددة"],
      pills: [["all", "all", "الكل"], ["coming", "coming", "قادم"], ["ended", "ended", "انتهى"], ["canceled", "cancelled", "ملغي"]].map((p) => ({ key: p[0], label: [p[1], p[2]] })),
      pillMatch: (r, k) => k === "all" || r.status === k,
      search: ["search by unit name or id", "البحث باسم الوحدة أو الرقم"], searchMatch: (r, q) => r.unit_name.toLowerCase().includes(q) || String(r.id).includes(q),
      toolbarExtra: PP.filterBtn(), extraMatch: sessionMatch((r) => r.date),
      empty: ["no data", "لا توجد بيانات"],
      /* eye → /multi-booking/details/{bookingId} — the user's own booking inside the session */
      columns: sessionCols(false).concat([{ head: ["Actions", "الإجراءات"], align: "center", cell: (r) => eye(`multi-booking.html?details=${r.id * 10}&redirect_to_page=1`) }]),
    });
    sessionFilter(mount, ctl, "multi");
  };

  /* ================= public events ================= */
  US.tabs["public-events"] = (mount, ctx) => {
    const S = US.sessions(ctx.user), view = ctx.params.get("view");
    if (view) { const row = S.events.find((x) => String(x.public_event.id) === view) || S.events[0]; return sharedView("public-events", mount, ctx, Object.assign({}, row, { id: row.public_event.id })); }
    const ctl = SA.list({
      mount, data: S.events, cardTitle: ["public events", "الأحداث العامة"],
      pills: [["all", "all", "الكل"], ["joined", "joined", "منضم"], ["left", "left", "غادر"], ["removed", "removed", "مُزال"]].map((p) => ({ key: p[0], label: [p[1], p[2]] })),
      pillMatch: (r, k) => k === "all" || r.status === k,
      search: ["search by joining ID", "البحث برقم الانضمام"], searchMatch: (r, q) => String(r.id).includes(q),
      toolbarExtra: PP.filterBtn(), extraMatch: sessionMatch((r) => r.start_at.slice(0, 10)),
      empty: ["no data", "لا توجد بيانات"],
      columns: [
        { head: ["id", "الرقم"], cell: (r) => `<b>${r.id}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { head: ["company", "الشركة"], align: "center", cell: (r) => `${esc(r.company.name)}<div class="t-xs text-tertiary">ID #${r.company.id}</div>` },
        { head: ["Branch / Unit", "الفرع / الوحدة"], align: "center", cell: (r) => `${esc(r.branch.name)}<div class="t-xs text-tertiary">${esc(r.unit.name)}</div>` },
        { head: ["Category / Activity", "الفئة / النشاط"], align: "center", cell: (r) => `${esc(r.category)}<div class="t-xs text-tertiary">${esc(r.activity)}</div>` },
        { head: ["Public Event Time", "وقت الحدث العام"], align: "center", cell: (r) => `${esc(r.start_at)}<div class="t-xs text-tertiary">${esc(r.end_at)}</div>` },
        { head: ["age group", "الفئة العمرية"], align: "center", cell: (r) => dash(r.age_group) },
        { head: ["session gender", "جنس الجلسة"], align: "center", cell: (r) => dash(r.gender) },
        { head: ["Users", "المستخدمون"], align: "center", cell: (r) => `${esc(r.user.name)}<div class="t-xs text-tertiary">${dash(r.user.username)}</div>` },
        { head: ["joining status", "حالة الانضمام"], align: "center", cell: (r) => `${esc({ joined: L("joined", "منضم"), left: L("left", "غادر"), removed: L("removed", "مُزال") }[r.status])}${r.status !== "joined" ? `<div class="t-xs text-tertiary">${esc(r.status_date)}</div>` : ""}` },
        { head: ["Public event ID", "رقم الحدث العام"], align: "center", cell: (r) => `#${r.public_event.id}<div class="t-xs text-tertiary">${esc(r.public_event.created_at)}</div>` },
        { head: ["Price Per User", "السعر لكل مستخدم"], align: "center", cell: (r) => `${r.price_per_user} ${esc(r.currency.code)}` },
        { head: ["Public event status", "حالة الحدث العام"], align: "center", cell: (r) => statusBadge(r.public_event.status) },
        /* dashboard: /public-events/view/{id} — the same PublicEventView, shown here inside the profile */
        { head: ["Actions", "الإجراءات"], align: "center", cell: (r) => eye(US.href("public-events", { view: r.public_event.id })) },
      ],
    });
    sessionFilter(mount, ctl, "events");
  };

  /* ================= packages ================= */
  const PILL = { upcoming: ["info", "Upcoming", "قادم"], active: ["success", "Active", "نشط"], frozen: ["primary", "Frozen", "مجمّد"], expired: ["", "Expired", "منتهي"], cancelled: ["danger", "Cancelled", "ملغى"], upgraded: ["primary", "Upgraded", "تمت ترقيته"], unpaid: ["warning", "Unpaid", "غير مدفوع"] };
  /* the user's subscriptions are rows of the packages' subscriber lists (one source for both pages) */
  US.subs = function (u) {
    if (u._subs) return u._subs;
    const pk = HF.SA.packages.filter((p) => p.approval_status.value === "approved" && p.subscribers.active > 0);
    u._subs = [0, 4, 9].map((k, j) => {
      const p = KP.extend(pk[(u.id + k) % pk.length]), s = KP.subs(p)[(u.id + j) % KP.subs(p).length];
      Object.assign(s.subscriber, { name: u.name, username: u.high_five_user_name, phone: u.phone, is_app_user: true });
      return { s, p };
    });
    if (u.id % 7 === 3) u._subs = []; /* some users have no subscriptions */
    return u._subs;
  };
  US.tabs.packages = (mount, ctx) => {
    const u = ctx.user, rows = US.subs(u), ref = ctx.params.get("ref");
    if (ref) {
      const hit = rows.find((x) => x.s.reference === ref) || rows[0];
      if (hit) return KP.subscriber(mount, { pkg: hit.p }, hit.s.reference, { href: (x) => US.href("packages", x) });
    }
    if (!rows.length) { mount.innerHTML = KP.empty("package", L("This user has no package subscriptions.", "لا توجد اشتراكات باقات لهذا المستخدم.")); return; }
    const TYPE = { app_online: L("Online", "عبر الإنترنت"), app_cash: L("Online", "عبر الإنترنت"), linked: L("Linked", "مرتبط"), walk_in: L("Walk-in", "حضوري") };
    let f = {};
    const ctl = SA.list({
      mount, data: rows, cardTitle: ["Packages", "الباقات"],
      pills: ["all", "upcoming", "active", "frozen", "expired", "cancelled", "upgraded"].map((k) => ({ key: k, label: k === "all" ? ["All", "الكل"] : [PILL[k][1], PILL[k][2]] })),
      pillMatch: (r, k) => k === "all" || r.s.status === k,
      search: ["Search by package name", "ابحث باسم الباقة"], searchMatch: (r, q) => r.p.name.toLowerCase().includes(q),
      toolbarExtra: () => PP.filterBtn(["partner", "package", "payment", "purchased"].filter((x) => (Array.isArray(f[x]) ? f[x].length : f[x] || f[x + "_from"] || f[x + "_to"])).length),
      extraMatch: (r, x) => (!(x.partner || []).length || x.partner.includes(String(r.p.partner.id))) && (!(x.package || []).length || x.package.includes(String(r.p.id))) && (!x.payment || r.s.payment.status === x.payment)
        && (!x.purchased_from || r.s.purchased_at >= x.purchased_from) && (!x.purchased_to || r.s.purchased_at <= x.purchased_to),
      empty: (st) => (st.q || Object.keys(st.extra).length ? L("No packages match your search.", "لا توجد باقات تطابق بحثك.") : L(`No ${PILL[st.pill] ? PILL[st.pill][1].toLowerCase() : ""} subscriptions.`, `لا توجد اشتراكات ${PILL[st.pill] ? PILL[st.pill][2] : ""}.`)),
      columns: [
        { head: ["Subscription ID", "رقم الاشتراك"], cell: (r) => `<b>${r.s.reference}</b><div class="t-xs text-tertiary">${r.s.purchased_at}, 09:40</div>` },
        { head: ["Company", "الشركة"], cell: (r) => `<a class="cell-user" href="partner-profile.html?id=${r.p.partner.id}" style="color:var(--color-text)">${PP.avatar(r.p.partner.name)}<span>${esc(r.p.partner.name)}</span></a>` },
        { head: ["Package · Plan", "الباقة · الخطة"], cell: (r) => `<a href="package-detail.html?id=${r.p.id}&tab=details" style="color:var(--color-text-link);font-weight:var(--weight-semibold)">${esc(r.p.name)}</a><div class="t-xs text-tertiary">${esc(r.s.plan.name)}</div>` },
        { head: ["Start → End", "البداية ← النهاية"], cell: (r) => `${r.s.status === "upcoming" ? r.s.starts_on : `<span dir="ltr">${r.s.starts_on} → ${r.s.ends_on}</span>`}${r.s.frozen_days_added || r.s.extension_days_added ? `<div class="t-xs text-tertiary">${[r.s.frozen_days_added ? L(`+${r.s.frozen_days_added} frozen`, `+${r.s.frozen_days_added} تجميد`) : "", r.s.extension_days_added ? L(`+${r.s.extension_days_added} ext.`, `+${r.s.extension_days_added} تمديد`) : ""].filter(Boolean).join(" · ")}</div>` : ""}` },
        { head: ["Subscription Type", "نوع الاشتراك"], cell: (r) => TYPE[r.s.channel] || "—" },
        { head: ["Price", "السعر"], cell: (r) => `<b>${KP.money(r.s.payment.total, r.p.currency)}</b><div class="t-xs text-tertiary">${r.s.channel === "app_online" ? L("Online", "إلكتروني") : L("Cash", "نقدي")}</div>${r.s.payment.remaining > 0 ? `<div class="t-xs" style="color:var(--color-warning)">${L("Remaining", "المتبقي")} ${KP.money(r.s.payment.remaining, r.p.currency)}</div>` : ""}` },
        { head: ["Usage", "الاستخدام"], cell: (r) => (r.s.status === "upcoming" ? "—" : r.s.usage.unlimited ? L(`${r.s.usage.total_used} visits this period`, `${r.s.usage.total_used} زيارة في هذه الفترة`) : L(`${r.s.usage.used} / ${r.s.usage.limit} visits for the current period`, `${r.s.usage.used} / ${r.s.usage.limit} زيارة للفترة الحالية`)) },
        { head: ["Status", "الحالة"], cell: (r) => badge(PILL[r.s.status][0], L(PILL[r.s.status][1], PILL[r.s.status][2])) },
        { head: ["", ""], cell: (r) => eye(US.href("packages", { ref: r.s.reference }), L("View subscription", "عرض الاشتراك")) },
      ],
      after: (root) => root.querySelectorAll("tbody tr").forEach((tr, i) => { const a = tr.querySelector("a[href*='ref=']"); const hit = a && rows.find((x) => a.getAttribute("href").includes(x.s.reference)); if (hit && hit.s.status === "unpaid") tr.style.background = "rgba(245,158,11,.08)"; }),
    });
    mount.addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]");
      if (!b) return;
      PP.filterPop(b, { width: 320, value: f, resetApplies: true, fields: [
        { key: "partner", label: ["Partner :", "الشريك :"], type: "checks", options: () => [...new Map(rows.map((r) => [String(r.p.partner.id), r.p.partner.name])).entries()] },
        { key: "package", label: ["Package :", "الباقة :"], type: "checks", options: () => rows.map((r) => [String(r.p.id), r.p.name]) },
        { key: "payment", label: ["Payment :", "الدفع :"], options: () => [["paid", L("Paid", "مدفوع")], ["partly-paid", L("Partly paid", "مدفوع جزئياً")], ["unpaid", L("Unpaid", "غير مدفوع")], ["refunded", L("Refunded", "مسترد")]] },
        { key: "purchased", label: ["Purchase date :", "تاريخ الشراء :"], type: "range" },
      ], onApply: (d) => { f = d; ctl.state.extra = d; ctl.state.page = 1; ctl.paint(); } });
    });
  };

  /* ================= comments ================= */
  US.comments = function (u) {
    if (u._cm) return u._cm;
    const S = US.sessions(u);
    u._cm = S.bookings.slice(0, 5).map((b, j) => ({ id: 900 + j, comment: ["Great court, clean and well lit.", "Staff were friendly and helpful.", "Lights went off mid-session.", "ممتاز جداً والأسعار مناسبة", "Parking was full."][j], type: j === 2 ? "public event" : "booking", booking_id: b.id,
      company_name: b.company_name, unit_name: b.unit_name, created_at: b.created_at, status: [2, 2, 1, 0, 2][j], deleted_at: j === 3 ? "2026-10-20 09:00:00" : null, deleted_reason: j === 3 ? "Offensive language" : j === 2 ? "Requested by partner" : null, rate: [5, 4, 2, 5, 3][j], _b: b }));
    return u._cm;
  };
  US.tabs.comments = (mount, ctx) => {
    const u = ctx.user, data = US.comments(u);
    const ST = (s) => (s === 0 ? ["", L("deleted", "محذوف")] : s === 1 ? ["danger", L("deletion request", "طلب حذف")] : ["primary", L("published", "منشور")]);
    const ctl = SA.list({
      mount, data, cardTitle: ["comments", "تعليقات"],
      pills: [{ key: "all", label: ["all", "الكل"] }, { key: "2", label: ["published", "منشور"] }, { key: "1", label: ["deletion request", "طلب حذف"] }, { key: "0", label: ["deleted", "محذوف"] }],
      pillMatch: (r, k) => k === "all" || String(r.status) === k,
      search: ["search by comment, company, unit", "البحث بالتعليق، الشركة، الوحدة"], searchMatch: (r, q) => [r.comment, r.company_name, r.unit_name].some((v) => v.toLowerCase().includes(q)),
      empty: ["no data", "لا توجد بيانات"],
      columns: [
        { head: ["Comment", "التعليق"], cell: (r) => `<div style="max-width:360px;white-space:pre-wrap" dir="auto">${esc(r.comment)}</div>` },
        { head: ["Comment On", "تعليق على"], align: "center", cell: (r) => `<a href="${US.href("bookings", { view: r.booking_id })}" style="color:var(--color-text-link)">${esc(r.type)}<div class="t-xs">${L("ID", "المعرف")}: #${r.booking_id}</div></a>` },
        { head: ["company", "الشركة"], align: "center", cell: (r) => dash(r.company_name) },
        { head: ["unit", "الوحدة"], align: "center", cell: (r) => dash(r.unit_name) },
        { head: ["time", "الوقت"], align: "center", cell: (r) => dash(r.created_at) },
        { head: ["status", "الحالة"], align: "center", cell: (r) => `${badge(ST(r.status)[0], ST(r.status)[1])}${r.deleted_at ? `<div class="t-xs text-tertiary">${esc(r.deleted_at)}</div>` : ""}` },
        { head: ["Actions", "الإجراءات"], align: "center", cell: (r) => `<div class="row gap-1" style="justify-content:center">${SA.iconBtn("eye", L("View", "عرض"), `data-view="${r.id}"`)}${r.status === 0 ? SA.iconBtn("refresh", L("Restore", "استعادة"), `data-restore="${r.id}"`) : SA.iconBtn("trash", L("Delete", "حذف"), `data-del="${r.id}"`)}</div>` },
      ],
    });
    mount.addEventListener("click", (e) => {
      const find = (a) => data.find((x) => x.id === +e.target.closest(`[${a}]`).getAttribute(a));
      if (e.target.closest("[data-del]")) {
        const r = find("data-del");
        const el = SA.modal({ id: "usCmDel", title: L("delete item", "حذف العنصر"), body: `<p class="t-sm text-secondary">${L("Please confirm that you want to delete this item", "يرجى تأكيد أنك تريد حذف هذا العنصر")}</p>`,
          foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn btn--danger" data-ok>${L("Confirm", "تأكيد")}</button>` });
        el.querySelector("[data-ok]").onclick = () => { r.status = 0; r.deleted_at = "2026-11-15 12:00:00"; SA.close(el); ctl.paint(); };
      }
      if (e.target.closest("[data-restore]")) { const r = find("data-restore"); r.status = 2; r.deleted_at = null; RD.toast("success", L("Comment restored successfully.", "تم استعادة التعليق بنجاح.")); ctl.paint(); }
      if (e.target.closest("[data-view]")) {
        const r = find("data-view"), V = r.status === 0 ? ["danger", L("Deleted", "محذوف")] : r.status === 1 ? ["warning", L("Pending Deletion", "بانتظار الحذف")] : ["success", L("Published", "منشور")];
        SA.modal({ id: "usCmView", wide: true, title: L("View Comment", "عرض التعليق"), body: `<div class="stack gap-4">
            <div class="cell-user">${PP.avatar(u.name)}<div><b>${esc(u.name)}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div></div></div>
            ${kv([[L("Rating", "التقييم"), `<span style="color:var(--color-warning)">${"★".repeat(r.rate)}</span><span class="text-tertiary">${"★".repeat(5 - r.rate)}</span> (${r.rate}/5)`],
              [L("Comment", "التعليق"), `<div style="padding:var(--space-3);border-radius:var(--radius-md);background:var(--color-surface-sunken);font-weight:var(--weight-regular)">${esc(r.comment)}</div>`],
              [L("Comment On", "تعليق على"), `${esc(r.type)} #${r.booking_id} <a class="btn btn--sm btn--secondary" href="${US.href("bookings", { view: r.booking_id })}" data-close>${r.type === "booking" ? L("Open booking", "فتح الحجز") : L("Open public event", "فتح الفعالية العامة")}</a>`],
              [L("Unit / Package Name", "اسم الوحدة / الباقة"), esc(r.unit_name)], [L("Company Name", "اسم الشركة"), esc(r.company_name)], [L("Status", "الحالة"), badge(V[0], V[1])],
              r.deleted_reason ? [L("Deletion Reason", "سبب الحذف"), `<div style="padding:var(--space-3);border-radius:var(--radius-md);background:rgba(239,68,68,.08)">${esc(r.deleted_reason)}</div>`] : null,
              r.deleted_at ? [L("Deleted At", "تاريخ الحذف"), esc(r.deleted_at)] : null])}</div>`, foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button>` });
      }
    });
  };

  /* ================= notes (shared note-comments module, type=user) ================= */
  US.tabs.notes = (mount, ctx) => {
    const u = ctx.user;
    if (!u.notes) u.notes = u.id % 3 ? [{ id: 1, comment: L("Called about a refund — escalated to the partner.", "اتصل بخصوص استرداد — تم التصعيد للشريك."), created_at: "2026-10-02 10:15:00", comment_by: { name: "Mona Admin" },
      replies: [{ id: 11, comment: L("Partner confirmed the refund.", "أكد الشريك الاسترداد."), created_at: "2026-10-03 09:00:00", comment_by: { name: "Super Admin" } }] }] : [];
    PP.tabs.notes(mount, { partner: u });
  };
})();
