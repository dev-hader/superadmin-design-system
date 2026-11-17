/* User profile — info · bookings · multi-bookings · public events · packages ·
   comments · notes. Mirrors pages/users/profile/{details,bookings,multi-bookings,
   public-events,packages,comments,notes}. Booking / public-event views, the
   notes thread and the subscription page are the same components the
   dashboard shares with the partner and package pages, so they are reused.
   Permissions (job keys, as the dashboard — data-perm, demo ?perm=limited | ?perm=none):
   Info Edit update_user (DetailsPage) · bookings tab view_bookings, eye view_booking_details ·
   multi-bookings tab view_multi_bookings, eye view_multi_booking_details · public events tab
   view_public_events, eye view_public_event_details · packages tab + subscription eye
   PERMISSIONS.USERS.VIEW_USER_PACKAGES — an empty string in the dashboard (open to all),
   so left untagged · comments tab view_user_comments, delete / restore delete_user_comments
   (the comment eye is not gated) · notes tab view_user_notes (New note add_user_notes and
   note Delete delete_user_notes live in PP.tabs.notes — pp-info.js). A tab whose key is
   missing shows NotHavePermissions. */
(function () {
  "use strict";
  const { L, esc, ic, badge, fmt } = SA;
  const { card, kv } = PP;
  const US = (window.US = window.US || { tabs: {} });
  const dash = (v) => (v == null || v === "" ? "---" : esc(v));
  /* job permissions (RD.can — shell.js; ?perm=limited | none demo) */
  const P = (k) => `data-perm="${k}"`;
  const denied = (mount, key) => { if (!window.RD || !RD.can || RD.can(key)) return false; mount.innerHTML = RD.noPermission(); return true; };
  const eye = (href, label, extra) => `<a class="icon-btn" href="${href}" aria-label="${label || L("View", "عرض")}" title="${label || L("View", "عرض")}" ${extra || ""}>${ic("eye")}</a>`;
  const statusBadge = (s) => badge(s === "coming" ? "success" : s === "ended" ? "primary" : "danger", PP.cap(s));
  /* raw API words → readable EN / AR (PP.cap covers the shared ones) */
  const cap = (v) => (v === "booking" ? L("Booking", "حجز") : PP.cap(v));

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

  /* the dashboard's phone rule (EditProfileModal phoneRegExp) */
  const PHONE_RE = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

  /* ================= info ================= */
  US.tabs.details = (mount, ctx) => {
    const u = ctx.user;
    const paint = () => (mount.innerHTML = card(L("Info", "معلومات"), PP.btn(L("Edit", "تعديل"), "edit", `data-edit ${P("update_user")}`, "secondary"), kv([
      [L("Name", "الاسم"), dash(u.name)], [L("Username", "اسم المستخدم"), dash(u.high_five_user_name)], [L("Country", "البلد"), dash(u.country.name)],
      [L("Phone", "الهاتف"), `<span dir="ltr">${dash(u.phone)}</span>`], [L("Email", "البريد الإلكتروني"), dash(u.email)], [L("Gender", "الجنس"), dash(PP.cap(u.gender))],
      [L("Date of birth", "تاريخ الميلاد"), dash(u.date_of_birth)], [L("Location", "الموقع"), dash(u.location.state)], [L("Registered at", "تاريخ التسجيل"), dash(u.created_at)]])));
    mount.addEventListener("click", (e) => {
      if (!e.target.closest("[data-edit]")) return;
      /* update user — POST /users/{id}/update-info (multipart, _method=PUT). Validation copy is hard-coded English in the dashboard. */
      const codes = [...new Set(HF.SA.users.map((x) => x.phone_code))];
      const [d, m, y] = (u.date_of_birth || "").split("/");
      const el = SA.modal({ id: "usEdit", title: L("Update user", "تحديث المستخدم"), body: `<div class="stack gap-4"><div data-alert></div>
          <div class="row gap-3" style="align-items:center;flex-wrap:wrap" data-imgrow></div><input type="file" accept=".png,.jpg,.jpeg" hidden data-imgfile>
          <div class="field"><label class="field__label">${L("Name:", "الاسم:")}</label><input class="input" data-f="name" value="${esc(u.name)}" placeholder="${L("Enter name", "أدخل الاسم")}"><span data-e="name"></span></div>
          ${SA.field(["Username:", "اسم المستخدم:"], `<input class="input" data-f="username" value="${esc(u.high_five_user_name || "")}" placeholder="${L("Enter username", "أدخل اسم المستخدم")}">`)}
          <div class="field"><label class="field__label">${L("Email:", "البريد الإلكتروني:")}</label><input class="input" data-f="email" value="${esc(u.email || "")}" placeholder="${L("Enter email", "أدخل البريد الإلكتروني")}"><span data-e="email"></span></div>
          <div class="field"><label class="field__label">${L("Phone:", "الهاتف:")}</label><div class="row gap-2" dir="ltr">${SA.select(codes.map((c) => [c, c, c === u.phone_code]), 'data-f="code" style="width:110px"')}<input class="input" data-f="phone" value="${esc((u.phone || "").replace(u.phone_code, "").trim())}" placeholder="${L("Enter phone", "أدخل رقم الهاتف")}"></div><span data-e="phone"></span></div>
          <div class="field"><label class="field__label">${L("Gender:", "الجنس:")}</label>${SA.select([["", L("Select gender", "اختر الجنس")], ["male", L("Male", "ذكر"), u.gender === "male"], ["female", L("Female", "أنثى"), u.gender === "female"]], 'data-f="gender"')}<span data-e="gender"></span></div>
          ${SA.field(["Date of birth:", "تاريخ الميلاد:"], `<input class="input" type="date" max="2012-12-31" data-f="dob" value="${y ? `${y}-${m}-${d}` : ""}" placeholder="${L("Select birth date", "اختر تاريخ الميلاد")}">`)}</div>`,
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${L("Update", "تحديث")}</button>` });
      /* image: UploadCropImage — pick → crop (1:1) → preview; "Remove photo" clears it (sent as image: '') */
      let img = u.photo || null;
      const imgRow = () => (el.querySelector("[data-imgrow]").innerHTML = `${img ? `<span class="avatar avatar--lg"><img src="${esc(img)}" alt=""></span>` : PP.avatar(u.name, "lg")}
        <button type="button" class="btn btn--sm btn--secondary" data-pick>${ic("camera")}<span>${L("Change image", "تغيير الصورة")}</span></button>
        ${img ? `<button type="button" class="btn btn--sm btn--ghost" style="color:var(--color-danger)" data-rmimg>${ic("trash")}<span>${L("Remove photo", "إزالة الصورة")}</span></button>` : ""}`);
      imgRow();
      el.querySelector("[data-imgrow]").onclick = (ev) => {
        if (ev.target.closest("[data-pick]")) el.querySelector("[data-imgfile]").click();
        if (ev.target.closest("[data-rmimg]")) { img = null; imgRow(); }
      };
      el.querySelector("[data-imgfile]").onchange = async (ev) => {
        const file = ev.target.files[0]; ev.target.value = "";
        const url = file && (await SA.crop(file, { ratio: 1, title: L("Profile image", "صورة الملف الشخصي") }));
        if (url) { img = url; imgRow(); }
      };
      el.querySelector("[data-ok]").onclick = (ev) => {
        const v = (k) => el.querySelector(`[data-f="${k}"]`).value.trim(), errs = {};
        const REQ = L("This field is required", "هذا الحقل مطلوب");
        if (!v("name")) errs.name = REQ; else if (v("name").length < 3) errs.name = L("Minimum 3 characters", "3 أحرف على الأقل"); else if (v("name").length > 50) errs.name = L("Maximum 50 characters", "50 حرفًا كحد أقصى");
        if (!v("phone")) errs.phone = REQ; else if (!PHONE_RE.test(v("phone"))) errs.phone = L("Phone number is not valid", "رقم الهاتف غير صحيح");
        if (!v("gender")) errs.gender = REQ;
        if (!v("email")) errs.email = REQ; else if (!/^\S+@\S+\.\S+$/.test(v("email"))) errs.email = L("Wrong email format", "صيغة البريد الإلكتروني غير صحيحة");
        ["name", "phone", "gender", "email"].forEach((k) => (el.querySelector(`[data-e="${k}"]`).innerHTML = errs[k] ? `<span class="field__error">${ic("warn")} ${errs[k]}</span>` : ""));
        if (Object.keys(errs).length) return;
        const b = ev.currentTarget; b.disabled = true; b.textContent = L("Updating ...", "جاري التحديث...");
        setTimeout(() => {
          const dob = v("dob").split("-");
          Object.assign(u, { photo: img, name: v("name"), high_five_user_name: v("username") || null, email: v("email"), phone_code: v("code"), phone: `${v("code")} ${v("phone")}`, gender: v("gender"), date_of_birth: dob.length === 3 ? `${dob[2]}/${dob[1]}/${dob[0]}` : u.date_of_birth });
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
    KP.filterPop(fb, { value: ctl.state.extra, width: 300, cascade: { category: ["activity"] },
      fields: [
        { key: "session", type: "range", label: ["Session date :", "تاريخ الجلسة:"], placeholders: [["Select session start", "اختر بداية الجلسة"], ["Select session end", "اختر نهاية الجلسة"]] },
        { key: "category", label: ["Category :", "الفئة:"], placeholder: ["Select category", "اختر الفئة"], options: () => HF.SA.CATS.map((c) => [c.name, c.name]) },
        { key: "activity", label: ["Activity:", "النشاط:"], placeholder: ["Select activity", "اختر النشاط"], options: (d) => (d.category ? HF.SA.ACTS[(HF.SA.CATS.find((c) => c.name === d.category) || {}).id] || [] : []).map((a) => [a, a]) },
        kind === "bookings" ? { key: "btype", label: ["Booking type:", "نوع الحجز:"], placeholder: ["Select booking type", "اختر نوع الحجز"], options: () => [["online", L("Online", "عبر الإنترنت")], ["linked", L("Linked", "مرتبط")], ["manual", L("Manual", "يدوي")]] } : null,
        /* the dashboard reuses "select booking type" as this field's placeholder — kept 1:1 */
        kind === "events" ? { key: "age", label: ["Age group:", "الفئة العمرية:"], placeholder: ["Select booking type", "اختر نوع الحجز"], options: () => ["Kids", "Teens", "Adults"].map((a) => [a, a]) } : null,
        { key: "gender", label: ["Session gender:", "جنس الجلسة:"], placeholder: ["Select session gender", "اختر جنس الجلسة"], options: () => [["male", L("Male", "ذكر")], ["female", L("Female", "أنثى")], ["both", L("Both", "كلاهما")]] },
      ].filter(Boolean),
      onApply: (d) => { ctl.state.extra = d; ctl.paint(); } });
  });
  const sessionMatch = (date) => (r, f) => (!f.session_from || date(r) >= f.session_from) && (!f.session_to || date(r) <= f.session_to)
    && (!f.category || (r.activity_category_name || r.category) === f.category) && (!f.activity || (r.activity_name || r.activity) === f.activity)
    && (!f.btype || r.booking_type === f.btype) && (!f.age || r.age_group === f.age) && (!f.gender || (r.session_gender || r.gender) === f.gender);
  const sessionCols = (withType) => [
    { head: ["#", "#"], cell: (r) => `<b>#${r.id}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
    { head: ["Company", "الشركة"], align: "center", cell: (r) => dash(r.company_name) },
    { head: ["Unit", "الوحدة"], align: "center", cell: (r) => dash(r.unit_name) },
    { head: ["Date & time", "التاريخ والوقت"], align: "center", cell: (r) => `${esc(r.date)}<div class="t-xs text-tertiary">${esc(r.start_time)}</div><div class="t-xs text-tertiary">${esc(r.end_time)}</div>` },
    { head: ["Activity", "النشاط"], align: "center", cell: (r) => `${esc(r.activity_category_name)}<div class="t-xs text-tertiary">${esc(r.activity_name)}</div>` },
    { head: ["Session gender", "جنس الجلسة"], align: "center", cell: (r) => dash(PP.cap(r.session_gender)) },
    { hidden: !withType, head: ["Booking type", "نوع الحجز"], align: "center", cell: (r) => dash(PP.cap(r.booking_type)) },
    /* "SAR" is hard-coded in the dashboard cell — kept 1:1 */
    { head: ["Price per user", "السعر لكل مستخدم"], align: "center", cell: (r) => `<b>${r.paid_price || 0}</b> <span class="t-xs">SAR</span><div class="t-xs text-tertiary">${dash(PP.cap(r.payment_method))}</div>` },
    { head: ["Status", "الحالة"], align: "center", cell: (r) => statusBadge(r.status) },
  ];
  /* booking / public-event view = the partner profile's view (same dashboard component) */
  const sharedView = (tab, mount, ctx, row) => PP.tabs[tab](mount, { partner: HF.SA.partners.find((p) => p.id === row._partner), params: new URLSearchParams({ view: String(row.id) }) });
  /* the wallet opens the same views inside the Wallet tab (?tab=wallet&view=…&vt=booking|public-event); Back returns to the wallet */
  US.sharedView = (kind, mount, ctx, id) => {
    const S = US.sessions(ctx.user), saved = PP.href;
    PP.href = (key, extra) => (extra && extra.view ? saved(key, extra) : US.href("wallet"));
    try {
      if (kind === "public-event") { const row = S.events.find((x) => String(x.public_event.id) === String(id)) || S.events[0]; sharedView("public-events", mount, ctx, Object.assign({}, row, { id: row.public_event.id })); }
      else sharedView("bookings", mount, ctx, S.bookings.find((b) => String(b.id) === String(id)) || S.bookings[0]);
    } finally { PP.href = saved; }
  };

  /* ================= bookings ================= */
  US.tabs.bookings = (mount, ctx) => {
    if (denied(mount, "view_bookings")) return;
    const S = US.sessions(ctx.user), view = ctx.params.get("view");
    if (view) { const row = S.bookings.find((b) => String(b.id) === view) || S.bookings[0]; return sharedView("bookings", mount, ctx, row); }
    const ctl = SA.list({
      mount, data: S.bookings, cardTitle: ["Bookings", "الحجوزات"],
      /* the Cancelled pill sends status=cancelled; its count comes back under `canceled` (counts.canceled ?? counts.cancelled) */
      pills: [["all", "All", "الكل"], ["coming", "Coming", "قادم"], ["pending", "Pending approval", "في انتظار الموافقة"], ["ended", "Ended", "انتهى"], ["canceled", "Cancelled", "ملغي"]].map((p) => ({ key: p[0], label: [p[1], p[2]] })),
      pillMatch: (r, k) => k === "all" || r.status === k,
      search: ["Search by unit name or ID", "البحث باسم الوحدة أو الرقم"], searchMatch: (r, q) => r.unit_name.toLowerCase().includes(q) || String(r.id).includes(q),
      toolbarExtra: PP.filterBtn(), extraMatch: sessionMatch((r) => r.date),
      empty: () => `<div class="stack gap-2" style="align-items:center"><span style="transform:scale(1.6)">${ic("calendar")}</span><b style="margin-top:var(--space-2)">${L("No bookings yet", "لا توجد حجوزات")}</b><span class="t-sm">${L("Try another tab, adjust filters, or search again.", "جرّب تبويبًا آخر أو غيّر عوامل التصفية أو أعد البحث.")}</span></div>`,
      columns: sessionCols(true).concat([{ head: ["Actions", "الإجراءات"], align: "center", cell: (r) => eye(US.href("bookings", { view: r.id }), null, P("view_booking_details")) }]),
    });
    sessionFilter(mount, ctl, "bookings");
  };

  /* ================= multi-bookings ================= */
  US.tabs["multi-bookings"] = (mount, ctx) => {
    if (denied(mount, "view_multi_bookings")) return;
    const S = US.sessions(ctx.user);
    const ctl = SA.list({
      mount, data: S.multi, cardTitle: ["Multi-bookings", "الحجوزات المتعددة"],
      pills: [["all", "All", "الكل"], ["coming", "Coming", "قادم"], ["ended", "Ended", "انتهى"], ["canceled", "Cancelled", "ملغي"]].map((p) => ({ key: p[0], label: [p[1], p[2]] })),
      pillMatch: (r, k) => k === "all" || r.status === k,
      search: ["Search by unit name or ID", "البحث باسم الوحدة أو الرقم"], searchMatch: (r, q) => r.unit_name.toLowerCase().includes(q) || String(r.id).includes(q),
      toolbarExtra: PP.filterBtn(), extraMatch: sessionMatch((r) => r.date),
      empty: ["No data", "لا توجد بيانات"],
      /* eye → /multi-booking/details/{bookingId} — the user's own booking inside the session */
      columns: sessionCols(false).concat([{ head: ["Actions", "الإجراءات"], align: "center", cell: (r) => eye(`multi-booking.html?details=${r.id * 10}&redirect_to_page=1`, null, P("view_multi_booking_details")) }]),
    });
    sessionFilter(mount, ctl, "multi");
  };

  /* ================= public events ================= */
  US.tabs["public-events"] = (mount, ctx) => {
    if (denied(mount, "view_public_events")) return;
    const S = US.sessions(ctx.user), view = ctx.params.get("view");
    if (view) { const row = S.events.find((x) => String(x.public_event.id) === view) || S.events[0]; return sharedView("public-events", mount, ctx, Object.assign({}, row, { id: row.public_event.id })); }
    let ctl = null;
    ctl = SA.list({
      mount, data: S.events, cardTitle: ["Public events", "الأحداث العامة"],
      pills: [["all", "All", "الكل"], ["joined", "Joined", "منضم"], ["left", "Left", "غادر"], ["removed", "Removed", "مُزال"]].map((p) => ({ key: p[0], label: [p[1], p[2]] })),
      pillMatch: (r, k) => k === "all" || r.status === k,
      search: ["Search by joining ID", "البحث برقم الانضمام"], searchMatch: (r, q) => String(r.id).includes(q),
      toolbarExtra: PP.filterBtn(), extraMatch: sessionMatch((r) => r.start_at.slice(0, 10)),
      empty: ["No data", "لا توجد بيانات"],
      columns: [
        { head: ["ID", "الرقم"], cell: (r) => `<b>${r.id}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { head: ["Company", "الشركة"], align: "center", cell: (r) => `${esc(r.company.name)}<div class="t-xs text-tertiary">ID #${r.company.id}</div>` },
        { head: ["Branch / unit", "الفرع / الوحدة"], align: "center", cell: (r) => `${esc(r.branch.name)}<div class="t-xs text-tertiary">${esc(r.unit.name)}</div>` },
        { head: ["Category / activity", "الفئة / النشاط"], align: "center", cell: (r) => `${esc(r.category)}<div class="t-xs text-tertiary">${esc(r.activity)}</div>` },
        { head: ["Public event time", "وقت الحدث العام"], align: "center", cell: (r) => `${esc(r.start_at)}<div class="t-xs text-tertiary">${esc(r.end_at)}</div>` },
        { head: ["Age group", "الفئة العمرية"], align: "center", cell: (r) => dash(r.age_group) },
        { head: ["Session gender", "جنس الجلسة"], align: "center", cell: (r) => dash(PP.cap(r.gender)) },
        { head: ["Users", "المستخدمون"], align: "center", cell: (r) => `${esc(r.user.name)}<div class="t-xs text-tertiary">${dash(r.user.username)}</div>` },
        { head: ["Joining status", "حالة الانضمام"], align: "center", cell: (r) => `${esc({ joined: L("Joined", "منضم"), left: L("Left", "غادر"), removed: L("Removed", "مُزال") }[r.status])}${r.status !== "joined" ? `<div class="t-xs text-tertiary">${esc(r.status_date)}</div>` : ""}` },
        { head: ["Public event ID", "رقم الحدث العام"], align: "center", cell: (r) => `#${r.public_event.id}<div class="t-xs text-tertiary">${esc(r.public_event.created_at)}</div>` },
        { head: ["Price per user", "السعر لكل مستخدم"], align: "center", cell: (r) => `${r.price_per_user} ${esc(r.currency.code)}` },
        { head: ["Public event status", "حالة الحدث العام"], align: "center", cell: (r) => statusBadge(r.public_event.status) },
        /* dashboard: /public-events/view/{id}?redirect_to_page={page} — the global public event view */
        { head: ["Actions", "الإجراءات"], align: "center", cell: (r) => eye(`public-events.html?view=${r.public_event.id}&redirect_to_page=${ctl ? ctl.state.page : 1}`, null, P("view_public_event_details")) },
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
    /* the active pill lives in the URL (?chip=upcoming) so Back from a subscription keeps it; All drops it */
    const PILLS = ["all", "upcoming", "active", "frozen", "expired", "cancelled", "upgraded"];
    const chip = PILLS.includes(ctx.params.get("chip")) ? ctx.params.get("chip") : "all";
    let pillNow = chip;
    const keep = (x) => Object.assign({ chip: pillNow === "all" ? null : pillNow }, x);
    if (ref) {
      const hit = rows.find((x) => x.s.reference === ref) || rows[0];
      if (hit) return KP.subscriber(mount, { pkg: hit.p }, hit.s.reference, { href: (x) => US.href("packages", keep(x)) });
    }
    /* GET /users/{id}/packages failed → error + Retry (sample: ?demo=error) */
    if (ctx.params.get("demo") === "error") {
      mount.innerHTML = `<section class="card card--pad animate-in stack gap-4" style="align-items:center;text-align:center;padding:var(--space-10)">${KP.notice("danger", "warn", L("Could not load the subscribers.", "تعذر تحميل المشتركين."))}
        <button type="button" class="btn btn--sm" data-retry>${ic("refresh")}<span>${L("Retry", "إعادة المحاولة")}</span></button></section>`;
      mount.querySelector("[data-retry]").onclick = () => { history.replaceState(null, "", US.href("packages", keep({}))); ctx.rerender(); };
      return;
    }
    if (!rows.length) { mount.innerHTML = KP.empty("package", L("This user has no package subscriptions.", "لا توجد اشتراكات باقات لهذا المستخدم.")); return; }
    const TYPE = { app_online: L("Online", "عبر الإنترنت"), app_cash: L("Online", "عبر الإنترنت"), linked: L("Linked", "مرتبط"), walk_in: L("Walk-in", "حضوري") };
    let f = {};
    const ctl = SA.list({
      mount, data: rows, cardTitle: ["Packages", "الباقات"],
      pills: PILLS.map((k) => ({ key: k, label: k === "all" ? ["All", "الكل"] : [PILL[k][1], PILL[k][2]] })),
      pillMatch: (r, k) => k === "all" || r.s.status === k,
      search: ["Search by package name", "ابحث باسم الباقة"], searchMatch: (r, q) => r.p.name.toLowerCase().includes(q),
      toolbarExtra: () => PP.filterBtn(["partner", "package", "payment", "purchased"].filter((x) => (Array.isArray(f[x]) ? f[x].length : f[x] || f[x + "_from"] || f[x + "_to"])).length),
      extraMatch: (r, x) => (!(x.partner || []).length || x.partner.includes(String(r.p.partner.id))) && (!(x.package || []).length || x.package.includes(String(r.p.id))) && (!x.payment || r.s.payment.status === x.payment)
        && (!x.purchased_from || r.s.purchased_at >= x.purchased_from) && (!x.purchased_to || r.s.purchased_at <= x.purchased_to),
      empty: (st) => (st.q || Object.keys(st.extra).length ? L("No packages match your search.", "لا توجد باقات تطابق بحثك.") : L(`No ${PILL[st.pill] ? PILL[st.pill][1].toLowerCase() : ""} subscriptions.`, `لا توجد اشتراكات ${PILL[st.pill] ? PILL[st.pill][2] : ""}.`)),
      columns: [
        { head: ["Subscription ID", "رقم الاشتراك"], cell: (r) => `<b>${r.s.reference}</b><div class="t-xs text-tertiary">${r.s.purchased_at}, 09:40</div>` },
        { head: ["Company", "الشركة"], cell: (r) => `<a class="cell-user" href="partner-profile.html?id=${r.p.partner.id}" style="color:var(--color-text)">${PP.avatar(r.p.partner.name)}<span>${esc(r.p.partner.name)}</span></a>` },
        { head: ["Package · plan", "الباقة · الخطة"], cell: (r) => `<a href="package-detail.html?id=${r.p.id}&tab=details" style="color:var(--color-text-link);font-weight:var(--weight-semibold)">${esc(r.p.name)}</a><div class="t-xs text-tertiary">${esc(r.s.plan.name)}</div>` },
        { head: ["Start → end", "البداية ← النهاية"], cell: (r) => `${r.s.status === "upcoming" ? r.s.starts_on : `<span dir="ltr">${r.s.starts_on} → ${r.s.ends_on}</span>`}${r.s.frozen_days_added || r.s.extension_days_added ? `<div class="t-xs text-tertiary">${[r.s.frozen_days_added ? L(`+${r.s.frozen_days_added} frozen`, `+${r.s.frozen_days_added} تجميد`) : "", r.s.extension_days_added ? L(`+${r.s.extension_days_added} ext.`, `+${r.s.extension_days_added} تمديد`) : ""].filter(Boolean).join(" · ")}</div>` : ""}` },
        { head: ["Subscription type", "نوع الاشتراك"], cell: (r) => TYPE[r.s.channel] || "—" },
        { head: ["Price", "السعر"], cell: (r) => `<b>${KP.money(r.s.payment.total, r.p.currency)}</b><div class="t-xs text-tertiary">${r.s.channel === "app_online" ? L("Online", "إلكتروني") : L("Cash", "نقدي")}</div>${r.s.payment.remaining > 0 ? `<div class="t-xs" style="color:var(--color-warning)">${L("Remaining", "المتبقي")} ${KP.money(r.s.payment.remaining, r.p.currency)}</div>` : ""}` },
        { head: ["Usage", "الاستخدام"], cell: (r) => (r.s.status === "upcoming" ? "—" : r.s.usage.unlimited ? L(`${r.s.usage.total_used} visits this period`, `${r.s.usage.total_used} زيارة في هذه الفترة`) : L(`${r.s.usage.used} / ${r.s.usage.limit} visits for the current period`, `${r.s.usage.used} / ${r.s.usage.limit} زيارة للفترة الحالية`)) },
        { head: ["Status", "الحالة"], cell: (r) => badge(PILL[r.s.status][0], L(PILL[r.s.status][1], PILL[r.s.status][2])) },
        { head: ["", ""], cell: (r) => eye(US.href("packages", keep({ ref: r.s.reference })), L("View subscription", "عرض الاشتراك")) },
      ],
      after: (root) => root.querySelectorAll("tbody tr").forEach((tr, i) => { const a = tr.querySelector("a[href*='ref=']"); const hit = a && rows.find((x) => a.getAttribute("href").includes(x.s.reference)); if (hit && hit.s.status === "unpaid") tr.style.background = "rgba(245,158,11,.08)"; }),
    });
    if (chip !== "all") { ctl.state.pill = chip; ctl.paint(); }
    /* GET /users/{id}/packages/filter-options — Partner / Package only when it returns them */
    const opts = { partners: [...new Map(rows.map((r) => [String(r.p.partner.id), r.p.partner.name])).entries()], packages: [...new Map(rows.map((r) => [String(r.p.id), r.p.name])).entries()] };
    mount.addEventListener("click", (e) => {
      const pl = e.target.closest("[data-pill]");
      if (pl) { pillNow = ctl.state.pill; history.replaceState(null, "", US.href("packages", keep({}))); return ctl.paint(); }
      const b = e.target.closest("[data-filter]");
      if (!b) return;
      KP.filterPop(b, { width: 320, value: f, resetApplies: true,
        validate: (d) => (d.purchased_from && d.purchased_to && d.purchased_to < d.purchased_from ? L("The end date must be on or after the start date.", "يجب أن يكون تاريخ الانتهاء في يوم البدء أو بعده.") : ""),
        fields: [
        opts.partners.length ? { key: "partner", label: ["Partner :", "الشريك :"], type: "checks", options: () => opts.partners } : null,
        opts.packages.length ? { key: "package", label: ["Package :", "الباقة :"], type: "checks", options: () => opts.packages } : null,
        { key: "payment", label: ["Payment :", "الدفع :"], options: () => [["paid", L("Paid", "مدفوع")], ["partly-paid", L("Partly paid", "مدفوع جزئياً")], ["unpaid", L("Unpaid", "غير مدفوع")], ["refunded", L("Refunded", "مسترد")]] },
        { key: "purchased", label: ["Purchase date :", "تاريخ الشراء :"], type: "range" },
      ], onApply: (d) => { f = d; ctl.state.extra = d; ctl.state.page = 1; ctl.paint(); } });
    });
  };

  /* ================= comments ================= */
  US.comments = function (u) {
    if (u._cm) return u._cm;
    const S = US.sessions(u);
    const unitOf = (pid) => (HF.SA.units.find((x) => x.partner.id === pid) || {}).id || null;
    u._cm = S.bookings.slice(0, 5).map((b, j) => ({ id: 900 + j, comment: ["Great court, clean and well lit.", "Staff were friendly and helpful.", "Lights went off mid-session.", "ممتاز جداً والأسعار مناسبة", "Parking was full."][j], type: j === 2 ? "public event" : "booking", booking_id: j === 2 ? null : b.id, session_id: j === 2 ? (S.events[0] || {}).public_event ? S.events[0].public_event.id : b.id : null,
      unit_id: unitOf(b._partner), company_name: b.company_name, unit_name: b.unit_name, created_at: b.created_at, status: [2, 2, 1, 0, 2][j], deleted_at: j === 3 ? "2026-10-20 09:00:00" : null, deleted_reason: j === 3 ? "Offensive language" : j === 2 ? "Requested by partner" : null, rate: [5, 4, 2, 5, 3][j], _b: b }));
    /* a package review (type "Package") — links to the package page's Comments tab */
    const sub = US.subs(u)[0];
    if (sub) u._cm.push({ id: 960, comment: "Great value for the price.", type: "Package", package_id: sub.p.id, booking_id: null, session_id: null, unit_id: null, company_name: sub.p.partner.name, unit_name: sub.p.name, created_at: sub.s.purchased_at + " 18:20:00", status: 2, deleted_at: null, deleted_reason: null, rate: 4 });
    return u._cm;
  };
  /* where a comment opens (helpers/commentEntityLinks): a package review → package Comments tab;
     with a unit → the unit's booking / public event view; else the global views */
  const isPkg = (r) => String(r.type || "").toLowerCase().includes("package") || r.package_id != null;
  const isPE = (r) => !isPkg(r) && (String(r.type || "").toLowerCase().includes("public") || (!!r.session_id && !r.booking_id));
  const entityLink = (r) => {
    if (isPkg(r)) return r.package_id != null ? `package-detail.html?id=${r.package_id}&tab=comments` : null;
    const id = r.booking_id || r.session_id;
    if (!id) return null;
    if (r.unit_id) return `unit-profile.html?id=${r.unit_id}&tab=${isPE(r) ? "public-events" : "bookings"}&view=${id}`;
    return isPE(r) ? `public-events.html?view=${id}` : `bookings.html?view=${id}`;
  };
  US.tabs.comments = (mount, ctx) => {
    if (denied(mount, "view_user_comments")) return;
    const u = ctx.user, data = US.comments(u);
    const ST = (s) => (s === 0 ? ["", L("Deleted", "محذوف")] : s === 1 ? ["danger", L("Deletion request", "طلب حذف")] : ["primary", L("Published", "منشور")]);
    const ctl = SA.list({
      mount, data, cardTitle: ["Comments", "التعليقات"],
      pills: [{ key: "all", label: ["All", "الكل"] }, { key: "2", label: ["Published", "منشور"] }, { key: "1", label: ["Deletion request", "طلب حذف"] }, { key: "0", label: ["Deleted", "محذوف"] }],
      pillMatch: (r, k) => k === "all" || String(r.status) === k,
      search: ["Search by comment, company, unit", "البحث بالتعليق، الشركة، الوحدة"], searchMatch: (r, q) => [r.comment, r.company_name, r.unit_name].some((v) => v.toLowerCase().includes(q)),
      empty: ["No data", "لا توجد بيانات"],
      columns: [
        { head: ["Comment", "التعليق"], cell: (r) => `<div style="max-width:360px;white-space:pre-wrap" dir="auto">${esc(r.comment)}</div>` },
        { head: ["Comment on", "تعليق على"], align: "center", cell: (r) => { const href = entityLink(r), id = isPkg(r) ? r.package_id : r.booking_id || r.session_id; const inner = `${esc(isPkg(r) ? L("Package", "باقة") : cap(r.type))}<div class="t-xs">${L("ID", "المعرف")}: #${id}</div>`; return href ? `<a href="${href}" style="color:var(--color-text-link)">${inner}</a>` : inner; } },
        { head: ["Company", "الشركة"], align: "center", cell: (r) => dash(r.company_name) },
        { head: ["Unit", "الوحدة"], align: "center", cell: (r) => dash(r.unit_name) },
        { head: ["Time", "الوقت"], align: "center", cell: (r) => dash(r.created_at) },
        { head: ["Status", "الحالة"], align: "center", cell: (r) => `${badge(ST(r.status)[0], ST(r.status)[1])}${r.deleted_at ? `<div class="t-xs text-tertiary">${esc(r.deleted_at)}</div>` : ""}` },
        { head: ["Actions", "الإجراءات"], align: "center", cell: (r) => `<div class="row gap-1" style="justify-content:center">${SA.iconBtn("eye", L("View", "عرض"), `data-view="${r.id}"`)}${r.status === 0 ? SA.iconBtn("refresh", L("Restore", "استعادة"), `data-restore="${r.id}" ${P("delete_user_comments")}`) : SA.iconBtn("trash", L("Delete", "حذف"), `data-del="${r.id}" ${P("delete_user_comments")}`)}</div>` },
      ],
    });
    mount.addEventListener("click", (e) => {
      const find = (a) => data.find((x) => x.id === +e.target.closest(`[${a}]`).getAttribute(a));
      if (e.target.closest("[data-del]")) {
        const r = find("data-del");
        const el = SA.modal({ id: "usCmDel", title: L("Delete item", "حذف العنصر"), body: `<p class="t-sm text-secondary">${L("Please confirm that you want to delete this item", "يرجى تأكيد أنك تريد حذف هذا العنصر")}</p>`,
          foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn btn--danger" data-ok>${L("Confirm", "تأكيد")}</button>` });
        el.querySelector("[data-ok]").onclick = () => { r.status = 0; r.deleted_at = "2026-11-15 12:00:00"; SA.close(el); ctl.paint(); };
      }
      /* restore: PUT /units/{unit_id}/comments/{id}/restore */
      if (e.target.closest("[data-restore]")) { const r = find("data-restore"); r.status = 2; r.deleted_at = null; RD.toast("success", L("Comment restored successfully.", "تم استعادة التعليق بنجاح.")); ctl.paint(); }
      if (e.target.closest("[data-view]")) {
        const r = find("data-view"), V = r.status === 0 ? ["danger", L("Deleted", "محذوف")] : r.status === 1 ? ["warning", L("Pending deletion", "بانتظار الحذف")] : ["success", L("Published", "منشور")];
        SA.modal({ id: "usCmView", wide: true, title: L("View comment", "عرض التعليق"), body: `<div class="stack gap-4">
            <div class="cell-user">${PP.avatar(u.name)}<div><b>${esc(u.name)}</b><div class="t-xs text-tertiary">${esc(r.created_at)}</div></div></div>
            ${kv([[L("Rating", "التقييم"), `<span style="color:var(--color-warning)">${"★".repeat(r.rate)}</span><span class="text-tertiary">${"★".repeat(5 - r.rate)}</span> (${r.rate}/5)`],
              [L("Comment", "التعليق"), `<div style="padding:var(--space-3);border-radius:var(--radius-md);background:var(--color-surface-sunken);font-weight:var(--weight-regular)">${esc(r.comment)}</div>`],
              [L("Comment on", "تعليق على"), `${esc(isPkg(r) ? L("Package", "باقة") : cap(r.type))} #${isPkg(r) ? r.package_id : r.booking_id || r.session_id} ${entityLink(r) ? `<a class="btn btn--sm btn--secondary" href="${entityLink(r)}">${isPE(r) ? L("Open public event", "فتح الفعالية العامة") : L("Open booking", "فتح الحجز") /* the dashboard labels a package link "Open booking" too — kept 1:1 */}</a>` : ""}`],
              [L("Unit / package name", "اسم الوحدة / الباقة"), esc(r.unit_name)], [L("Company name", "اسم الشركة"), esc(r.company_name)], [L("Status", "الحالة"), badge(V[0], V[1])],
              r.deleted_reason ? [L("Deletion reason", "سبب الحذف"), `<div style="padding:var(--space-3);border-radius:var(--radius-md);background:rgba(239,68,68,.08)">${esc(r.deleted_reason)}</div>`] : null,
              r.deleted_at ? [L("Deleted at", "تاريخ الحذف"), esc(r.deleted_at)] : null])}</div>`, foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button>` });
      }
    });
  };

  /* ================= notes (shared note-comments module, type=user) ================= */
  US.tabs.notes = (mount, ctx) => {
    if (denied(mount, "view_user_notes")) return;
    const u = ctx.user;
    if (!u.notes) u.notes = u.id % 3 ? [{ id: 1, comment: L("Called about a refund — escalated to the partner.", "اتصل بخصوص استرداد — تم التصعيد للشريك."), created_at: "2026-10-02 10:15:00", comment_by: { name: "Mona Admin" },
      replies: [{ id: 11, comment: L("Partner confirmed the refund.", "أكد الشريك الاسترداد."), created_at: "2026-10-03 09:00:00", comment_by: { name: "Super Admin" } }] }] : [];
    /* note-comments module with type "user" (GET/POST /note-comments?type=user&entity_id={userId}) */
    PP.tabs.notes(mount, { partner: u, type: "user" });
  };
})();
