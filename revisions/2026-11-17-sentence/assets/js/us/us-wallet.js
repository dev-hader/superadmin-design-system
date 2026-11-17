/* User profile — wallet · funds · cash out. Mirrors pages/users/profile/wallet
   (WalletPage, funds/Funds, cashOut/cashOut + Fund / CashOut / Add / Edit modals).
   URL: user-profile.html?id=<userId>&tab=wallet[&sub=funds|cash-out][&vt=booking|public-event&view=<id>]
   Note: the dashboard has no balance cards and no delete actions here.
   Permissions (job keys, as the dashboard — data-perm, demo ?perm=limited | ?perm=none):
   wallet tab view_user_wallet (WalletPage) · Cash out link + cash-out view view_cashout ·
   Funds link + funds view view_user_wallet · row eyes: cash_out view_cashout, wallet_fund
   view_user_wallet, public_event view_public_event_details, booking view_booking_details,
   multi_booking view_multi_booking_details, package rows PERMISSIONS.USERS.VIEW_USER_PACKAGES
   (an empty string in the dashboard = open to all, so left untagged) · New fund add_user_fund ·
   fund edit (pending only) update_funds · cash-out edit (pending only) has NO permission
   check in the dashboard (CashOutTable.js) — left untagged. */
(function () {
  "use strict";
  const { L, esc, ic, badge } = SA;
  const { card, kv } = PP;
  const US = (window.US = window.US || { tabs: {} });
  const dash = (v) => (v == null || v === "" ? "---" : esc(v));
  /* job permissions (RD.can — shell.js; ?perm=limited | none demo) */
  const P = (k) => `data-perm="${k}"`;
  const denied = (mount, key) => { if (!window.RD || !RD.can || RD.can(key)) return false; mount.innerHTML = RD.noPermission(); return true; };

  /* ---------- sample data (GET /users/{id}/wallet · /wallet-fund · /cash-out) ---------- */
  US.wallet = function (u) {
    if (u._wallet) return u._wallet;
    const cur = { code: u.country.iso === "EG" ? "EGP" : u.country.iso === "AE" ? "AED" : "SAR" }, country = u.country.name;
    const sub = (US.subs ? US.subs(u)[0] : null) || null; /* the user's first subscription (same record as the Packages tab) */
    const rows = [], fid = (n) => u.id * 10 + n, cid = (n) => u.id * 10 + 5 + n; /* ids unique across users (the global wallet lists everyone) */
    /* booking / public-event rows point at the user's own sessions (same records as the Bookings / Public events tabs) */
    const S = US.sessions ? US.sessions(u) : { bookings: [], events: [] };
    const bk = (n, d) => (S.bookings[n] ? S.bookings[n].id : d), pe = S.events[0] ? S.events[0].public_event.id : 6102;
    let bal = 0;
    const push = (type, tr, amt, info) => { bal += amt; rows.push({ id: u.id * 100 + rows.length, created_at: `2026-${String(4 + (rows.length % 8)).padStart(2, "0")}-${String(3 + rows.length).padStart(2, "0")} 1${rows.length % 10}:2${rows.length % 6}:00`, transaction: tr, in: amt > 0 ? amt : null, out: amt < 0 ? -amt : null, balance: bal, currency: cur, country, info: Object.assign({ type }, info) }); };
    push("wallet_fund", "wallet fund", 500, { id: fid(1) });
    push("booking", "booking payment", -120, { id: bk(0, 5001), description: "Padel Court 2 · 1h" });
    push("public_event", "public event payment", -60, { id: pe, description: "Friday 5-a-side" });
    push("package_subscription", "", -450, sub ? { id: sub.s.id, reference: sub.s.reference, package: { name: sub.p.name } } : { id: null, reference: null, description: "---" });
    push("wallet_fund", "wallet fund", 300, { id: fid(2) });
    push("multi_booking", "multi booking payment", -200, { id: 77, description: "Tennis — 4 sessions" });
    push("package_payment_refund", "", 150, { id: null, reference: null, description: L("Gateway refund", "استرداد عبر بوابة الدفع") });
    push("cash_out", "cash out", -100, { id: cid(1) });
    push("booking", "booking refund", 120, { id: bk(1, 5003), description: "Cancelled by partner" });
    push("cash_out", "cash out", -50, { id: cid(2) });
    rows.reverse();
    const by = { id: 1, name: "Super Admin" };
    u._wallet = {
      rows, cur, country,
      funds: [{ id: fid(1), amount: 500, status: "completed", fund_reason: "Compensation for cancelled session", action_reason: "Approved", initiated_by: by, initiated_at: "2026-04-03 10:20:00", action_by: by, action_at: "2026-04-03 11:00:00" },
        { id: fid(2), amount: 300, status: "completed", fund_reason: "Loyalty bonus", action_reason: "", initiated_by: { id: 2, name: "Mona Admin" }, initiated_at: "2026-08-07 14:00:00", action_by: by, action_at: "2026-08-07 15:10:00" },
        { id: fid(3), amount: 80, status: "pending", fund_reason: "Goodwill credit", action_reason: null, initiated_by: { id: 2, name: "Mona Admin" }, initiated_at: "2026-11-12 09:30:00", action_by: null, action_at: null },
        { id: fid(4), amount: 1000, status: "rejected", fund_reason: "Duplicate request", action_reason: "Already credited", initiated_by: by, initiated_at: "2026-10-01 12:00:00", action_by: by, action_at: "2026-10-01 12:30:00" }],
      cashouts: [{ id: cid(1), amount: 100, status: "completed", bank_name: "Al Rajhi Bank", iban: "SA03 8000 0000 6080 1016 7519", account_name: u.name, fund_reason: "Withdraw balance", action_reason: "Transferred", action_by: by, action_at: "2026-11-11 10:00:00", initiated_at: "2026-11-10 18:00:00" },
        { id: cid(2), amount: 50, status: "pending", bank_name: "SNB", iban: "SA44 1000 0000 1234 5678 9012", account_name: u.name, fund_reason: "", action_reason: null, action_by: null, action_at: null, initiated_at: "2026-11-14 09:15:00" },
        { id: cid(3), amount: 200, status: "rejected", bank_name: "Riyad Bank", iban: "SA12 2000 0000 9876 5432 1098", account_name: u.name, fund_reason: "", action_reason: "IBAN name mismatch", action_by: by, action_at: "2026-09-02 13:00:00", initiated_at: "2026-09-01 20:00:00" }],
    };
    return u._wallet;
  };

  /* currency: the API's icon when it sends one (currency.icon), else its code */
  const curCell = (W) => `${W.cur.icon ? `<img src="${esc(W.cur.icon)}" alt="${esc(W.cur.code)}" style="height:16px;width:auto;vertical-align:middle">` : esc(W.cur.code)}<div class="t-xs text-tertiary">${esc(W.country)}</div>`;
  /* raw API words → readable EN / AR (PP.cap covers the shared ones) */
  const W_WORDS = { completed: ["Completed", "مكتمل"], rejected: ["Rejected", "مرفوض"], "wallet fund": ["Wallet fund", "إيداع في المحفظة"], "booking payment": ["Booking payment", "دفع حجز"], "booking refund": ["Booking refund", "استرداد حجز"],
    "public event payment": ["Public event payment", "دفع حدث عام"], "multi booking payment": ["Multi booking payment", "دفع حجز متعدد"], "cash out": ["Cash out", "سحب نقدي"] };
  const cap = (v) => { const w = W_WORDS[String(v == null ? "" : v).toLowerCase()]; return w ? L(w[0], w[1]) : PP.cap(v); };
  const stBadge = (s) => badge(s === "pending" ? "warning" : s === "completed" ? "primary" : "danger", cap(s));
  const backBtn = () => PP.backBtn(US.href("wallet"));

  /* read-only detail modals (GET /users/{id}/wallet-fund/{id} · /cash-out/{id}) */
  function fundModal(f) {
    SA.modal({ id: "usFund", title: `${L("Fund ID", "رقم الإيداع")}: ${f.id}`, foot: "", body: kv([
      [L("ID", "الرقم"), f.id], [L("Status", "الحالة"), dash(cap(f.status))], [L("Date & time", "التاريخ والوقت"), dash(f.initiated_at)], [L("Country", "البلد"), dash(US.user.country.name)],
      [L("Amount", "المبلغ"), dash(f.amount)], [L("Reason", "السبب"), dash(f.fund_reason)], [L("Comment", "التعليق"), dash(f.action_reason)],
      [L("Action by", "تم بواسطة"), dash(f.action_by && f.action_by.name)], [L("Action date", "تاريخ الإجراء"), dash(f.action_at)]]) });
  }
  function cashModal(c) {
    SA.modal({ id: "usCash", title: `${L("Cash out ID", "رقم السحب النقدي")}: ${c.id}`, foot: "", body: kv([
      [L("ID", "الرقم"), c.id], [L("Status", "الحالة"), dash(cap(c.status))], [L("Date & time", "التاريخ والوقت"), dash(c.initiated_at)], [L("Country", "البلد"), dash(US.user.country.name)],
      [L("Bank name", "اسم البنك"), dash(c.bank_name)], [L("IBAN", "رقم الآيبان"), `<span dir="ltr">${dash(c.iban)}</span>`], [L("Account holder name", "اسم صاحب الحساب"), dash(c.account_name)],
      [L("Amount", "المبلغ"), dash(c.amount)], [L("Reason", "السبب"), dash(c.action_reason)], [L("Comment", "التعليق"), dash(c.fund_reason)],
      [L("Action by", "تم بواسطة"), dash(c.action_by && c.action_by.name)], [L("Action date", "تاريخ الإجراء"), dash(c.action_at)]]) });
  }
  /* Edit fund / Edit cash out — PUT …/{id} {status, action_reason}; in-modal alert, no toast */
  function editModal(row, isFund, done) {
    const el = SA.modal({ id: "usEditW", title: isFund ? L("Edit fund", "تعديل الإيداع") : L("Edit cash out", "تعديل السحب النقدي"), body: `<div class="stack gap-4"><div data-alert></div>
        ${SA.field(["Status", "الحالة"], SA.select([["completed", L("Completed", "مكتمل"), true], ["rejected", L("Rejected", "مرفوض")]], "data-s"))}
        ${SA.field(["Reason", "السبب"], `<textarea class="input" rows="3" data-r placeholder="${L("Enter action reason", "أدخل سبب الإجراء")}"></textarea>`)}</div>`, /* starts empty — the dashboard reads row.refund_reason, which the API never sends */
      foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${L("Update", "تحديث")}</button>` });
    el.querySelector("[data-ok]").onclick = (e) => {
      const b = e.currentTarget; b.disabled = true; b.textContent = L("Updating ...", "جاري التحديث ...");
      setTimeout(() => {
        row.status = el.querySelector("[data-s]").value; row.action_reason = el.querySelector("[data-r]").value; row.action_by = { id: 1, name: "Super Admin" }; row.action_at = "2026-11-15 12:00:00";
        SA.close(el); done();
      }, 400);
    };
  }

  /* ================= wallet ================= */
  US.tabs.wallet = (mount, ctx) => {
    const sub = ctx.params.get("sub");
    if (sub === "funds") return denied(mount, "view_user_wallet") || funds(mount, ctx);
    if (sub === "cash-out") return denied(mount, "view_cashout") || cashOut(mount, ctx);
    if (denied(mount, "view_user_wallet")) return;
    /* booking / public-event rows open their view inside the Wallet tab (dashboard: wallet/booking/{id}, wallet/public-event/{id}) */
    const vt = ctx.params.get("vt"), vid = ctx.params.get("view");
    if (vid && (vt === "booking" || vt === "public-event")) return US.sharedView(vt, mount, ctx, vid);
    const u = ctx.user, W = US.wallet(u);
    const PKG = ["package_subscription", "package_payment_refund"];
    const eye = (r) => {
      const t = r.info.type;
      if (t === "cash_out" || t === "wallet_fund") return SA.iconBtn("eye", L("View", "عرض"), `data-w="${t}:${r.info.id}" ${P(t === "cash_out" ? "view_cashout" : "view_user_wallet")}`);
      if (t === "public_event") return `<a class="icon-btn" href="${US.href("wallet", { vt: "public-event", view: r.info.id })}" ${P("view_public_event_details")} aria-label="${L("View", "عرض")}">${ic("eye")}</a>`;
      if (t === "booking") return `<a class="icon-btn" href="${US.href("wallet", { vt: "booking", view: r.info.id })}" ${P("view_booking_details")} aria-label="${L("View", "عرض")}">${ic("eye")}</a>`;
      if (t === "multi_booking") return `<a class="icon-btn" href="multi-booking.html?details=${r.info.id}" ${P("view_multi_booking_details")} aria-label="${L("View", "عرض")}">${ic("eye")}</a>`;
      if (PKG.includes(t) && r.info.id != null) return `<a class="icon-btn" href="${US.href("packages", { ref: r.info.reference || r.info.id })}" aria-label="${L("View", "عرض")}">${ic("eye")}</a>`;
      return "";
    };
    SA.list({
      mount, data: W.rows, cardTitle: ["Wallet", "المحفظة"],
      pills: [{ key: "all", label: ["All", "الكل"] }, { key: "in", label: ["In", "وارد"] }, { key: "out", label: ["Out", "صادر"] }],
      pillMatch: (r, k) => k === "all" || (k === "in" ? r.in != null : r.out != null),
      search: ["Search by transaction ID", "البحث برقم المعاملة"],
      searchMatch: (r, q) => String(PKG.includes(r.info.type) ? r.info.reference || r.id : r.id).toLowerCase().includes(q),
      toolbarExtra: `<a class="btn btn--sm btn--secondary" href="${US.href("wallet", { sub: "cash-out" })}" ${P("view_cashout")}>${L("Cash out", "السحب النقدي")} ${ic("trendUp")}</a>
        <a class="btn btn--sm btn--secondary" href="${US.href("wallet", { sub: "funds" })}" ${P("view_user_wallet")}>${L("Funds", "الإيداعات")} ${ic("revenue")}</a>`,
      empty: ["No data", "لا توجد بيانات"],
      columns: [
        { head: ["ID", "الرقم"], cell: (r) => esc(PKG.includes(r.info.type) ? r.info.reference || r.id : r.id) },
        { head: ["Date & time", "التاريخ والوقت"], cell: (r) => esc(r.created_at) },
        { head: ["Transaction", "المعاملة"], cell: (r) => `${esc(cap(r.transaction) || (r.info.type === "package_subscription" ? L("Package payment", "دفع باقة") : r.info.type === "package_payment_refund" ? L("Package refund", "استرداد باقة") : "---"))}${r.info.description || r.info.package ? `<div class="t-xs text-tertiary">${esc(r.info.description || r.info.package.name)}</div>` : ""}` },
        { head: ["In", "وارد"], cell: (r) => `<span style="color:var(--color-success)">${dash(r.in)}</span>` },
        { head: ["Out", "صادر"], cell: (r) => `<span style="color:var(--color-danger)">${dash(r.out)}</span>` },
        { head: ["Balance", "الرصيد"], cell: (r) => esc(r.balance) },
        { head: ["Currency", "العملة"], cell: () => curCell(W) },
        { head: ["Actions", "الإجراءات"], align: "center", cell: eye },
      ],
    });
    mount.addEventListener("click", (e) => {
      const b = e.target.closest("[data-w]");
      if (!b) return;
      const [t, id] = b.dataset.w.split(":");
      if (t === "wallet_fund") fundModal(W.funds.find((f) => String(f.id) === id) || W.funds[0]);
      else cashModal(W.cashouts.find((c) => String(c.id) === id) || W.cashouts[0]);
    });
  };

  /* ================= wallet - funds ================= */
  function funds(mount, ctx) {
    const W = US.wallet(ctx.user);
    mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${L("Wallet", "المحفظة")} · ${L("Funds", "الإيداعات")}</h3>
      <div class="row gap-2">${backBtn()}${PP.btn(L("New fund", "إيداع جديد"), "plus", `data-add ${P("add_user_fund")}`)}</div></div><div data-l></div>`;
    const ctl = SA.list({
      mount: mount.querySelector("[data-l]"), data: W.funds,
      search: ["Search by transaction ID", "البحث برقم المعاملة"], searchMatch: (r, q) => String(r.id).includes(q),
      empty: ["No data", "لا توجد بيانات"],
      columns: [
        { head: ["ID", "الرقم"], cell: (r) => r.id },
        { head: ["Amount", "المبلغ"], cell: (r) => esc(r.amount || "0") },
        { head: ["Currency", "العملة"], cell: () => curCell(W) },
        { head: ["Status", "الحالة"], cell: (r) => stBadge(r.status) },
        { head: ["Initiated by", "أُنشئ بواسطة"], cell: (r) => (r.initiated_by ? `<a href="user-profile.html?id=${r.initiated_by.id}&tab=details" style="color:var(--color-text)">${esc(r.initiated_by.name)}</a>` : "---") },
        { head: ["Initiated on", "تاريخ الإنشاء"], cell: (r) => dash(r.initiated_at) },
        { head: ["Action by", "تم بواسطة"], cell: (r) => (r.action_by ? `<b>${esc(r.action_by.name)}</b>` : "---") },
        { head: ["Action on", "الإجراء في"], cell: (r) => dash(r.action_at) },
        { head: ["Actions", "الإجراءات"], align: "center", cell: (r) => `<div class="row gap-1" style="justify-content:center">${r.status === "pending" ? SA.iconBtn("edit", L("Edit fund", "تعديل الإيداع"), `data-edit="${r.id}" ${P("update_funds")}`) : ""}${SA.iconBtn("eye", L("View", "عرض"), `data-view="${r.id}"`)}</div>` },
      ],
    });
    mount.addEventListener("click", (e) => {
      const v = e.target.closest("[data-view]"); if (v) return fundModal(W.funds.find((f) => f.id === +v.dataset.view));
      const ed = e.target.closest("[data-edit]"); if (ed) return editModal(W.funds.find((f) => f.id === +ed.dataset.edit), true, ctl.paint);
      if (!e.target.closest("[data-add]")) return;
      /* Add fund — POST /users/{id}/wallet-fund {amount, reason}; static backdrop, in-modal alert */
      const el = SA.modal({ id: "usAddFund", title: L("Add fund to user wallet", "إضافة رصيد إلى محفظة المستخدم"), body: `<div class="stack gap-4"><div data-alert></div>
          <div class="field"><label class="field__label">${L("Amount", "المبلغ")} <span class="req">*</span></label><input class="input" type="number" min="1" value="0" data-a placeholder="${L("Enter amount", "أدخل المبلغ")}"><span data-err></span></div>
          ${SA.field(["Reason", "السبب"], `<textarea class="input" rows="3" data-r placeholder="${L("Enter reason", "أدخل السبب")}"></textarea>`)}</div>`,
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${L("Submit", "إرسال")}</button>` });
      el.querySelector(".modal__foot").style.justifyContent = "space-between";
      el.querySelector("[data-ok]").onclick = (ev) => {
        const a = el.querySelector("[data-a]").value;
        el.querySelector("[data-err]").innerHTML = !a || +a < 1 ? `<span class="field__error">${ic("warn")} ${L("This field is required", "هذا الحقل مطلوب")}</span>` : "";
        if (!a || +a < 1) return;
        const b = ev.currentTarget; b.disabled = true; b.textContent = L("Submitting ...", "جاري الإرسال ...");
        setTimeout(() => {
          W.funds.unshift({ id: Math.max(...W.funds.map((f) => f.id)) + 1, amount: +a, status: "pending", fund_reason: el.querySelector("[data-r]").value, action_reason: null, initiated_by: { id: 1, name: "Super Admin" }, initiated_at: "2026-11-15 12:00:00", action_by: null, action_at: null });
          SA.close(el); ctl.paint();
        }, 400);
      };
    });
  }

  /* ================= wallet - cash out ================= */
  function cashOut(mount, ctx) {
    const W = US.wallet(ctx.user);
    mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${L("Wallet", "المحفظة")} · ${L("Cash out", "السحب النقدي")}</h3>${backBtn()}</div><div data-l></div>`;
    const ctl = SA.list({
      mount: mount.querySelector("[data-l]"), data: W.cashouts,
      search: ["Search by transaction ID", "البحث برقم المعاملة"], searchMatch: (r, q) => String(r.id).includes(q),
      empty: ["No data", "لا توجد بيانات"],
      columns: [
        { head: ["ID", "الرقم"], cell: (r) => r.id },
        { head: ["Date & time", "التاريخ والوقت"], cell: (r) => dash(r.initiated_at) },
        { head: ["Amount", "المبلغ"], cell: (r) => esc(r.amount || "0") },
        { head: ["Currency", "العملة"], cell: () => curCell(W) },
        { head: ["Status", "الحالة"], cell: (r) => stBadge(r.status) },
        { head: ["Action by", "تم بواسطة"], cell: (r) => (r.action_by ? `<a href="user-profile.html?id=${r.action_by.id}&tab=details" style="color:var(--color-text)">${esc(r.action_by.name)}</a>` : "---") },
        { head: ["Action on", "الإجراء في"], cell: (r) => dash(r.action_at) },
        { head: ["Actions", "الإجراءات"], align: "center", cell: (r) => `<div class="row gap-1" style="justify-content:center">${r.status === "pending" ? SA.iconBtn("edit", L("Edit cash out", "تعديل السحب النقدي"), `data-edit="${r.id}"`) : ""}${SA.iconBtn("eye", L("View", "عرض"), `data-view="${r.id}"`)}</div>` },
      ],
    });
    mount.addEventListener("click", (e) => {
      const v = e.target.closest("[data-view]"); if (v) return cashModal(W.cashouts.find((c) => c.id === +v.dataset.view));
      const ed = e.target.closest("[data-edit]"); if (ed) editModal(W.cashouts.find((c) => c.id === +ed.dataset.edit), false, ctl.paint);
    });
  }
})();
