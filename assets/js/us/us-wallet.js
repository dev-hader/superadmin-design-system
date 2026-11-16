/* User profile — wallet · funds · cash out. Mirrors pages/users/profile/wallet
   (WalletPage, funds/Funds, cashOut/cashOut + Fund / CashOut / Add / Edit modals).
   URL: user-profile.html?id=<userId>&tab=wallet[&sub=funds|cash-out]
   Note: the dashboard has no balance cards and no delete actions here. */
(function () {
  "use strict";
  const { L, esc, ic, badge } = SA;
  const { card, kv } = PP;
  const US = (window.US = window.US || { tabs: {} });
  const dash = (v) => (v == null || v === "" ? "---" : esc(v));

  /* ---------- sample data (GET /users/{id}/wallet · /wallet-fund · /cash-out) ---------- */
  US.wallet = function (u) {
    if (u._wallet) return u._wallet;
    const cur = { code: u.country.iso === "EG" ? "EGP" : u.country.iso === "AE" ? "AED" : "SAR" }, country = u.country.name;
    const sub = (US.subs ? US.subs(u)[0] : null) || null; /* the user's first subscription (same record as the Packages tab) */
    const rows = [], fid = (n) => u.id * 10 + n, cid = (n) => u.id * 10 + 5 + n; /* ids unique across users (the global wallet lists everyone) */
    let bal = 0;
    const push = (type, tr, amt, info) => { bal += amt; rows.push({ id: u.id * 100 + rows.length, created_at: `2026-${String(4 + (rows.length % 8)).padStart(2, "0")}-${String(3 + rows.length).padStart(2, "0")} 1${rows.length % 10}:2${rows.length % 6}:00`, transaction: tr, in: amt > 0 ? amt : null, out: amt < 0 ? -amt : null, balance: bal, currency: cur, country, info: Object.assign({ type }, info) }); };
    push("wallet_fund", "wallet fund", 500, { id: fid(1) });
    push("booking", "booking payment", -120, { id: 5001, description: "Padel Court 2 · 1h" });
    push("public_event", "public event payment", -60, { id: 6102, description: "Friday 5-a-side" });
    push("package_subscription", "", -450, sub ? { id: sub.s.id, reference: sub.s.reference, package: { name: sub.p.name } } : { id: null, reference: null, description: "---" });
    push("wallet_fund", "wallet fund", 300, { id: fid(2) });
    push("multi_booking", "multi booking payment", -200, { id: 77, description: "Tennis — 4 sessions" });
    push("package_payment_refund", "", 150, { id: null, reference: null, description: L("Gateway refund", "استرداد عبر بوابة الدفع") });
    push("cash_out", "cash out", -100, { id: cid(1) });
    push("booking", "booking refund", 120, { id: 5003, description: "Cancelled by partner" });
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

  const curCell = (W) => `${esc(W.cur.code)}<div class="t-xs text-tertiary">${esc(W.country)}</div>`;
  const stBadge = (s) => badge(s === "pending" ? "warning" : s === "completed" ? "primary" : "danger", s); /* raw API text, untranslated — as in the dashboard */
  const backBtn = () => PP.backBtn(US.href("wallet"));

  /* read-only detail modals (GET /users/{id}/wallet-fund/{id} · /cash-out/{id}) */
  function fundModal(f) {
    SA.modal({ id: "usFund", title: `${L("fund", "أموال")} ${L("id", "الرقم")}: ${f.id}`, foot: "", body: kv([
      [L("id", "الرقم"), f.id], [L("status", "الحالة"), dash(f.status)], [L("date & time", "التاريخ والوقت"), dash(f.initiated_at)], [L("country", "البلد"), dash(US.user.country.name)],
      [L("amount", "المبلغ"), dash(f.amount)], [L("reason", "السبب"), dash(f.fund_reason)], [L("Comment", "التعليق"), dash(f.action_reason)],
      [L("action by", "تم بواسطة"), dash(f.action_by && f.action_by.name)], [L("action date", "تاريخ الإجراء"), dash(f.action_at)]]) });
  }
  function cashModal(c) {
    SA.modal({ id: "usCash", title: `${L("cash out", "نقود")} ${L("id", "الرقم")}: ${c.id}`, foot: "", body: kv([
      [L("id", "الرقم"), c.id], [L("status", "الحالة"), dash(c.status)], [L("date & time", "التاريخ والوقت"), dash(c.initiated_at)], [L("country", "البلد"), dash(US.user.country.name)],
      [L("bank name", "اسم البنك"), dash(c.bank_name)], [L("IBAN", "رقم الآيبان"), `<span dir="ltr">${dash(c.iban)}</span>`], [L("account holder name", "اسم صاحب الحساب"), dash(c.account_name)],
      [L("amount", "المبلغ"), dash(c.amount)], [L("reason", "السبب"), dash(c.action_reason)], [L("Comment", "التعليق"), dash(c.fund_reason)],
      [L("action by", "تم بواسطة"), dash(c.action_by && c.action_by.name)], [L("action date", "تاريخ الإجراء"), dash(c.action_at)]]) });
  }
  /* Edit fund / Edit cash out — PUT …/{id} {status, action_reason}; in-modal alert, no toast */
  function editModal(row, isFund, done) {
    const el = SA.modal({ id: "usEditW", title: isFund ? L("edit fund", "تعديل الأموال") : L("edit cash out", "تعديل النقود"), body: `<div class="stack gap-4"><div data-alert></div>
        ${SA.field(["status", "الحالة"], SA.select([["completed", L("completed", "مكتمل"), true], ["rejected", L("rejected", "مرفوض")]], "data-s"))}
        ${SA.field(["reason", "السبب"], `<textarea class="input" rows="3" data-r placeholder="${L("enter action reason", "أدخل سبب الإجراء")}">${esc(row.fund_reason || "")}</textarea>`)}</div>`,
      foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${L("update", "تحديث")}</button>` });
    el.querySelector("[data-ok]").onclick = (e) => {
      const b = e.currentTarget; b.disabled = true; b.textContent = L("updating ...", "جاري التحديث ...");
      setTimeout(() => {
        row.status = el.querySelector("[data-s]").value; row.action_reason = el.querySelector("[data-r]").value; row.action_by = { id: 1, name: "Super Admin" }; row.action_at = "2026-11-15 12:00:00";
        SA.close(el); done();
      }, 400);
    };
  }

  /* ================= wallet ================= */
  US.tabs.wallet = (mount, ctx) => {
    const sub = ctx.params.get("sub");
    if (sub === "funds") return funds(mount, ctx);
    if (sub === "cash-out") return cashOut(mount, ctx);
    const u = ctx.user, W = US.wallet(u);
    const PKG = ["package_subscription", "package_payment_refund"];
    const eye = (r) => {
      const t = r.info.type;
      if (t === "cash_out" || t === "wallet_fund") return SA.iconBtn("eye", L("View", "عرض"), `data-w="${t}:${r.info.id}"`);
      if (t === "public_event") return `<a class="icon-btn" href="${US.href("public-events", { view: r.info.id })}" aria-label="${L("View", "عرض")}">${ic("eye")}</a>`;
      if (t === "booking") return `<a class="icon-btn" href="${US.href("bookings", { view: r.info.id })}" aria-label="${L("View", "عرض")}">${ic("eye")}</a>`;
      if (t === "multi_booking") return `<a class="icon-btn" href="multi-booking.html?details=${r.info.id}" aria-label="${L("View", "عرض")}">${ic("eye")}</a>`;
      if (PKG.includes(t) && r.info.id != null) return `<a class="icon-btn" href="${US.href("packages", { ref: r.info.reference || r.info.id })}" aria-label="${L("View", "عرض")}">${ic("eye")}</a>`;
      return "";
    };
    SA.list({
      mount, data: W.rows, cardTitle: ["wallet", "محفظة"],
      pills: [{ key: "all", label: ["all", "الكل"] }, { key: "in", label: ["in", "داخل"] }, { key: "out", label: ["out", "خارج"] }],
      pillMatch: (r, k) => k === "all" || (k === "in" ? r.in != null : r.out != null),
      search: ["search by transaction id", "البحث برقم المعاملة"],
      searchMatch: (r, q) => String(PKG.includes(r.info.type) ? r.info.reference || r.id : r.id).toLowerCase().includes(q),
      toolbarExtra: `<a class="btn btn--sm btn--secondary" href="${US.href("wallet", { sub: "cash-out" })}">${L("cash out", "نقود")} ${ic("trendUp")}</a>
        <a class="btn btn--sm btn--secondary" href="${US.href("wallet", { sub: "funds" })}">${L("funds", "أموال")} ${ic("revenue")}</a>`,
      empty: ["no data", "لا توجد بيانات"],
      columns: [
        { head: ["id", "الرقم"], cell: (r) => esc(PKG.includes(r.info.type) ? r.info.reference || r.id : r.id) },
        { head: ["date & time", "التاريخ والوقت"], cell: (r) => esc(r.created_at) },
        { head: ["transaction", "معاملة"], cell: (r) => `${esc(r.transaction || (r.info.type === "package_subscription" ? L("Package Payment", "دفع باقة") : r.info.type === "package_payment_refund" ? L("Package Refund", "استرداد باقة") : "---"))}${r.info.description || r.info.package ? `<div class="t-xs text-tertiary">${esc(r.info.description || r.info.package.name)}</div>` : ""}` },
        { head: ["in", "داخل"], cell: (r) => `<span style="color:var(--color-success)">${dash(r.in)}</span>` },
        { head: ["out", "خارج"], cell: (r) => `<span style="color:var(--color-danger)">${dash(r.out)}</span>` },
        { head: ["balance", "الرصيد"], cell: (r) => esc(r.balance) },
        { head: ["currency", "العملة"], cell: () => curCell(W) },
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
    mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${L("wallet", "محفظة")} - ${L("funds", "أموال")}</h3>
      <div class="row gap-2">${backBtn()}${PP.btn(L("new fund", "اضافة اموال"), "plus", "data-add")}</div></div><div data-l></div>`;
    const ctl = SA.list({
      mount: mount.querySelector("[data-l]"), data: W.funds,
      search: ["search by transaction id", "البحث برقم المعاملة"], searchMatch: (r, q) => String(r.id).includes(q),
      empty: ["no data", "لا توجد بيانات"],
      columns: [
        { head: ["id", "الرقم"], cell: (r) => r.id },
        { head: ["amount", "المبلغ"], cell: (r) => esc(r.amount || "0") },
        { head: ["currency", "العملة"], cell: () => curCell(W) },
        { head: ["status", "الحالة"], cell: (r) => stBadge(r.status) },
        { head: ["initiated by", "بدأ بواسطة"], cell: (r) => (r.initiated_by ? `<a href="user-profile.html?id=${r.initiated_by.id}&tab=details" style="color:var(--color-text)">${esc(r.initiated_by.name)}</a>` : "---") },
        { head: ["initiated on", "بدأ في"], cell: (r) => dash(r.initiated_at) },
        { head: ["action by", "تم بواسطة"], cell: (r) => (r.action_by ? `<b>${esc(r.action_by.name)}</b>` : "---") },
        { head: ["action on", "الإجراء في"], cell: (r) => dash(r.action_at) },
        { head: ["Actions", "الإجراءات"], align: "center", cell: (r) => `<div class="row gap-1" style="justify-content:center">${r.status === "pending" ? SA.iconBtn("edit", L("edit fund", "تعديل الأموال"), `data-edit="${r.id}"`) : ""}${SA.iconBtn("eye", L("View", "عرض"), `data-view="${r.id}"`)}</div>` },
      ],
    });
    mount.addEventListener("click", (e) => {
      const v = e.target.closest("[data-view]"); if (v) return fundModal(W.funds.find((f) => f.id === +v.dataset.view));
      const ed = e.target.closest("[data-edit]"); if (ed) return editModal(W.funds.find((f) => f.id === +ed.dataset.edit), true, ctl.paint);
      if (!e.target.closest("[data-add]")) return;
      /* Add fund — POST /users/{id}/wallet-fund {amount, reason}; static backdrop, in-modal alert */
      const el = SA.modal({ id: "usAddFund", title: L("add fund to user wallet", "إضافة أموال لمحفظة المستخدم"), body: `<div class="stack gap-4"><div data-alert></div>
          <div class="field"><label class="field__label">${L("amount", "المبلغ")} <span class="req">*</span></label><input class="input" type="number" min="1" value="0" data-a placeholder="${L("enter amount", "أدخل المبلغ")}"><span data-err></span></div>
          ${SA.field(["reason", "السبب"], `<textarea class="input" rows="3" data-r placeholder="${L("enter reason", "أدخل السبب")}"></textarea>`)}</div>`,
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${L("submit", "إرسال")}</button>` });
      el.querySelector(".modal__foot").style.justifyContent = "space-between";
      el.querySelector("[data-ok]").onclick = (ev) => {
        const a = el.querySelector("[data-a]").value;
        el.querySelector("[data-err]").innerHTML = !a || +a < 1 ? `<span class="field__error">${ic("warn")} ${L("this field is required", "هذا الحقل مطلوب")}</span>` : "";
        if (!a || +a < 1) return;
        const b = ev.currentTarget; b.disabled = true; b.textContent = L("submitting ...", "جاري الإرسال ...");
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
    mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${L("wallet", "محفظة")} - ${L("cash out", "نقود")}</h3>${backBtn()}</div><div data-l></div>`;
    const ctl = SA.list({
      mount: mount.querySelector("[data-l]"), data: W.cashouts,
      search: ["search by transaction id", "البحث برقم المعاملة"], searchMatch: (r, q) => String(r.id).includes(q),
      empty: ["no data", "لا توجد بيانات"],
      columns: [
        { head: ["id", "الرقم"], cell: (r) => r.id },
        { head: ["date & time", "التاريخ والوقت"], cell: (r) => dash(r.initiated_at) },
        { head: ["amount", "المبلغ"], cell: (r) => esc(r.amount || "0") },
        { head: ["currency", "العملة"], cell: () => curCell(W) },
        { head: ["status", "الحالة"], cell: (r) => stBadge(r.status) },
        { head: ["action by", "تم بواسطة"], cell: (r) => (r.action_by ? `<a href="user-profile.html?id=${r.action_by.id}&tab=details" style="color:var(--color-text)">${esc(r.action_by.name)}</a>` : "---") },
        { head: ["action on", "الإجراء في"], cell: (r) => dash(r.action_at) },
        { head: ["Actions", "الإجراءات"], align: "center", cell: (r) => `<div class="row gap-1" style="justify-content:center">${r.status === "pending" ? SA.iconBtn("edit", L("edit cash out", "تعديل النقود"), `data-edit="${r.id}"`) : ""}${SA.iconBtn("eye", L("View", "عرض"), `data-view="${r.id}"`)}</div>` },
      ],
    });
    mount.addEventListener("click", (e) => {
      const v = e.target.closest("[data-view]"); if (v) return cashModal(W.cashouts.find((c) => c.id === +v.dataset.view));
      const ed = e.target.closest("[data-edit]"); if (ed) editModal(W.cashouts.find((c) => c.id === +ed.dataset.edit), false, ctl.paint);
    });
  }
})();
