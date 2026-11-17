/* Package detail — selling · subscribers (+ subscriber page) · comments tabs.
   Mirrors pages/packages/package-detail/{selling,subscribers,comments} and
   users/profile/packages/UserPackageDetailsPage (read-only for packages).
   Permissions: none by job key — the subscriber page's PERMISSIONS.USERS.VIEW_USER_PACKAGES
   is an empty string in the dashboard (open to all); actions follow API flags (can_manage …). */
(function () {
  "use strict";
  const { L, esc, ic, badge, fmt } = SA;
  const { card, kv } = PP;
  const KP = (window.KP = window.KP || { tabs: {} });
  const notice = (tone, icon, html) => `<div class="alert alert--${tone}"><span class="alert__icon">${ic(icon)}</span><div class="alert__body">${html}</div></div>`;
  KP.notice = notice;
  const empty = (icon, title, body) => `<section class="card card--pad animate-in stack gap-2" style="align-items:center;text-align:center;padding:var(--space-10)"><span class="text-tertiary" style="transform:scale(1.6)">${ic(icon)}</span><b class="t-title" style="margin-top:var(--space-3)">${title}</b>${body ? `<p class="t-sm text-tertiary">${body}</p>` : ""}</section>`;
  KP.empty = empty;
  /* Filter popover — PP.filterPop's look and API plus what these filters need:
     type:"segment" (a segmented switch, e.g. Purchased at | Last visited),
     range placeholders ([[en,ar],[en,ar]]) and validate(draft) → an inline error
     that disables Apply (the dashboard shows it under the fields, not as a toast).
     Also used by the user profile's session filters (kp-ops.js is loaded there). */
  KP.filterPop = function (trigger, o) {
    let pop = document.getElementById("kpFilterPop");
    if (pop && pop.classList.contains("is-open") && pop._trigger === trigger) { pop.classList.remove("is-open"); return; }
    if (!pop) { pop = document.createElement("div"); pop.id = "kpFilterPop"; pop.className = "popover"; pop.setAttribute("role", "dialog"); document.body.appendChild(pop); }
    pop._trigger = trigger;
    pop.style.cssText = "width:min(" + (o.width || 320) + "px, calc(100vw - 16px));max-height:520px;overflow-x:hidden;overflow-y:auto";
    const fields = (o.fields || []).filter(Boolean);
    const defaults = (d) => { fields.forEach((fl) => { if (fl.type === "segment" && !d[fl.key] && fl.default) d[fl.key] = fl.default; }); return d; };
    let draft = defaults(JSON.parse(JSON.stringify(o.value || {})));
    const ph = (fl, j) => (fl.placeholders ? esc(SA.T(fl.placeholders[j])) : "");
    const dateIn = (fl, key, j, bound) => {
      const v = draft[key] || "", p = ph(fl, j), type = fl.input || "date";
      /* an empty date input can't show a placeholder — it is a text box until focused */
      return `<input class="input" style="min-width:0;width:100%" type="${p && !v ? "text" : type}" ${p ? `placeholder="${p}" onfocus="this.type='${type}'"` : ""} data-f="${key}" value="${esc(v)}" ${bound} aria-label="${p || (j ? L("To", "إلى") : L("From", "من"))}">`;
    };
    const control = (fl) => {
      const v = draft[fl.key];
      const opts = typeof fl.options === "function" ? fl.options(draft) : fl.options || [];
      if (fl.type === "checks") return `<div class="stack gap-1" style="max-height:132px;overflow:auto">${opts.map((x) => `<label class="check"><input type="checkbox" data-m="${fl.key}" value="${esc(x[0])}" ${(v || []).includes(String(x[0])) ? "checked" : ""}><span class="check__box">${ic("check")}</span>${esc(x[1])}</label>`).join("") || `<span class="t-xs text-tertiary">---</span>`}</div>`;
      if (fl.type === "segment") return `<div class="segmented" role="group" style="display:flex;width:100%">${opts.map((x) => `<button type="button" style="flex:1" data-seg="${fl.key}" value="${esc(x[0])}" class="${String(v) === String(x[0]) ? "is-active" : ""}" aria-pressed="${String(v) === String(x[0])}">${esc(x[1])}</button>`).join("")}</div>`;
      if (fl.type === "range") return `<div style="display:grid;grid-template-columns:auto minmax(0,1fr);gap:var(--space-2) var(--space-3);align-items:center"><span class="t-xs text-tertiary">${L("From", "من")}</span>${dateIn(fl, fl.key + "_from", 0, draft[fl.key + "_to"] ? `max="${esc(draft[fl.key + "_to"])}"` : "")}<span class="t-xs text-tertiary">${L("To", "إلى")}</span>${dateIn(fl, fl.key + "_to", 1, draft[fl.key + "_from"] ? `min="${esc(draft[fl.key + "_from"])}"` : "")}</div>`;
      return SA.select([["", L("All", "الكل"), !v]].concat(opts.map((x) => [x[0], x[1], String(v || "") === String(x[0])])), `data-f="${fl.key}"`);
    };
    const paint = () => {
      const err = o.validate ? o.validate(draft) : "";
      pop.innerHTML = `<div class="popover__title">${L("Filter options", "خيارات التصفية")}</div>
        <div class="popover__body stack gap-3">${fields.map((fl) => SA.field(fl.label || null, control(fl))).join("")}
          ${err ? `<span class="field__error" role="alert">${ic("warn")} ${esc(err)}</span>` : ""}</div>
        <div class="popover__foot"><button type="button" class="btn btn--sm btn--secondary" data-reset>${L("Reset", "إعادة تعيين")}</button><button type="button" class="btn btn--sm" data-apply ${err ? "disabled" : ""}>${L("Apply", "تطبيق")}</button></div>`;
    };
    pop.onchange = (e) => {
      const m = e.target.dataset.m, k = e.target.dataset.f;
      if (m) { const st = new Set(draft[m] || []); e.target.checked ? st.add(e.target.value) : st.delete(e.target.value); draft[m] = [...st]; return; }
      if (!k) return;
      draft[k] = e.target.value;
      (o.cascade || {})[k] && o.cascade[k].forEach((c) => (draft[c] = ""));
      paint();
    };
    pop.onclick = (e) => {
      const sg = e.target.closest("[data-seg]");
      if (sg) { draft[sg.dataset.seg] = sg.value; return paint(); }
      if (e.target.closest("[data-reset]")) { draft = defaults({}); paint(); if (o.resetApplies) { o.onApply(draft); pop.classList.remove("is-open"); } return; }
      const ap = e.target.closest("[data-apply]");
      if (ap && !ap.disabled) { o.onApply(draft); pop.classList.remove("is-open"); }
    };
    paint();
    SA.popover(pop, trigger);
  };
  const NAMES = ["Omar Khalid", "Sara Nabil", "Yousef Adel", "Lama Fahad", "Hassan Ali", "Noura Saad", "Faisal Turki", "Reem Hamad", "Majed Zaid", "Huda Salem", "Ahmad Rami", "Dana Yasser", "Khalid Nasser", "Mona Fawzi", "Tariq Saleh", "Jana Omar", "Ziad Kamal", "Rana Adel", "Saud Ibrahim", "Laila Hani", "Basel Fares", "Maha Sami"];

  /* ================= selling (read-only) ================= */
  KP.tabs.selling = (mount, ctx) => {
    const k = ctx.pkg, i = k.id % 7;
    const method = k.selling_methodology.value;
    const isSet = k.approval_status.value !== "pending" || i % 2 === 0;
    const contacts = method === "contacts" || i % 3 === 0 ? [{ id: 1, name: "Reception", phone: "+966 55 123 4567" }, { id: 2, name: "Sales — Huda", phone: "+966 50 987 6543" }] : [];
    const opts = [
      ["walk_in", "booking", L("Walk-in", "حضوري"), L("Sold at the partner's branches only.", "تُباع في فروع الشريك فقط.")],
      ["contacts", "users", L("Contacts", "جهات الاتصال"), L("Customers reach the partner's contacts to buy.", "يتواصل العملاء مع جهات اتصال الشريك للشراء.")],
      ["online", "revenue", L("Online", "إلكتروني"), L("Bought and paid for in the HighFive app.", "تُشترى وتُدفع عبر تطبيق HighFive.")],
    ];
    const lock = notice("info", "lock", L("Selling settings are managed by the partner.", "يدير الشريك إعدادات البيع."));
    if (!isSet) { mount.innerHTML = lock + empty("package", L("The partner hasn't set how this package is sold yet.", "لم يحدد الشريك طريقة بيع هذه الباقة بعد.")); return; }
    const pol = KP.policy ? KP.policy(k) : null, hasPolicy = pol && pol.state === "linked";
    mount.innerHTML = lock
      + card(L("Selling methodology", "طريقة البيع"), "", `<div class="sa-stats" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space-3)">${opts.map(([v, icon, t, h]) => {
        const on = v === method;
        return `<div class="stack gap-2" style="padding:var(--space-4);border-radius:var(--radius-lg);border:var(--border-thin) solid ${on ? "var(--color-primary)" : "var(--color-border)"};background:${on ? "var(--color-primary-subtle)" : "transparent"}">
          <div class="row between gap-2" style="align-items:center"><span class="row gap-2" style="align-items:center">${ic(icon)}<b>${t}</b></span>${on ? badge("primary", L("Selected", "المختارة")) : ""}</div>
          <span class="t-sm text-tertiary">${h}</span></div>`;
      }).join("")}</div>`)
      + card(L("Contacts", "جهات الاتصال"), "", contacts.length ? kv(contacts.map((c) => [esc(c.name), `<span dir="ltr">${esc(c.phone)}</span>`])) : `<p class="t-sm text-tertiary">${L("No contacts - the package isn't sold through contacts.", "لا توجد جهات اتصال - الباقة لا تُباع عبر جهات الاتصال.")}</p>`)
      + card(L("Policy & display period", "السياسة وفترة العرض"), "", kv([
        [L("Policy", "السياسة"), hasPolicy ? `<a href="${KP.href("policy")}" style="color:var(--color-text-link)">${esc(k.policyD.policy.name)}</a><div class="t-xs text-tertiary" style="font-weight:var(--weight-regular)">${esc(k.policyD.policy.subtitle)}</div>` : "—"],
        [L("Display period", "فترة العرض"), k.availability.display_starts_at ? `${L("Specific period", "فترة محددة")}<div class="t-xs text-tertiary" style="font-weight:var(--weight-regular)">${k.availability.display_starts_at} 12:00 → ${k.availability.display_ends_at}</div>` : L("Always display", "العرض دائماً")],
      ]));
  };

  /* ================= subscribers ================= */
  const ST = {
    active: ["success", "Active", "نشط"], upcoming: ["info", "Upcoming", "قادم"], frozen: ["primary", "Frozen", "مجمّد"], unpaid: ["warning", "Unpaid", "غير مدفوع"],
    expired: ["", "Expired", "منتهي"], cancelled: ["danger", "Cancelled", "ملغى"], upgraded: ["", "Upgraded", "تمت ترقيته"],
  };
  const PAY = { paid: ["success", "Paid", "مدفوع"], "partly-paid": ["warning", "Partly paid", "مدفوع جزئياً"], unpaid: ["danger", "Unpaid", "غير مدفوع"], refunded: ["", "Refunded", "مسترد"] };
  const CH = { app_online: ["App · online", "التطبيق · إلكتروني"], app_cash: ["App · cash", "التطبيق · نقداً"], walk_in: ["Walk-in", "حضوري"], linked: ["Linked", "مرتبط"] };
  const stBadge = (s) => badge(ST[s][0], L(ST[s][1], ST[s][2]));
  KP.subs = function (k) {
    if (k._subs) return k._subs;
    const n = k.approval_status.value === "approved" && k.planList.length ? Math.min(k.subscribers.active + 6, 46) : 0;
    const keys = Object.keys(ST), pays = Object.keys(PAY), chs = Object.keys(CH);
    k._subs = Array.from({ length: n }, (_, j) => {
      const plan = k.planList[j % k.planList.length];
      const st = j < k.subscribers.amount_due ? "unpaid" : j % 9 === 0 ? keys[1 + (j % 6)] : j % 4 === 3 ? keys[j % 7] : "active";
      const pay = st === "unpaid" ? "unpaid" : st === "cancelled" ? "refunded" : j % 6 === 5 ? "partly-paid" : "paid";
      const app = j % 5 !== 4, d = 1 + (j % 27), m = 9 + (j % 3);
      const lim = k.usage_rules.type === "limited" ? k.usage_rules.limit : null, used = j % (lim || 14);
      return {
        id: 3000 + j, reference: "SUB-" + String(21 + j + k.id).padStart(6, "0"),
        subscriber: { name: NAMES[j % NAMES.length], username: app ? NAMES[j % NAMES.length].split(" ")[0].toLowerCase() + (j + 10) : null, phone: `+966 5${j % 10} ${100 + j} ${4000 + j * 7}`, is_app_user: app },
        plan, branch: k.branchList[j % k.branchList.length], status: st,
        payment: { status: pay, total: plan.total_price, paid: pay === "paid" ? plan.total_price : pay === "partly-paid" ? Math.round(plan.total_price / 2) : 0 },
        starts_on: `2026-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, ends_on: `2026-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        ends_soon: st === "active" && j % 7 === 2, frozen_until: st === "frozen" ? "2026-11-30" : null, frozen_days_added: j % 8 === 1 ? 5 : 0, extension_days_added: j % 11 === 3 ? 3 : 0,
        upgraded_to: st === "upgraded" ? k.planList[k.planList.length - 1].name : null,
        usage: lim ? { unlimited: false, used, limit: lim, resets_on: "2026-12-01" } : { unlimited: true, total_used: used },
        last_check_in: j % 5 === 2 ? null : { at: j % 3 ? `0${1 + (j % 9)} Nov 2026 1${j % 10}:4${j % 6}` : L(`Today 13:4${j % 6}`, `اليوم 13:4${j % 6}`), branch: k.branchList[j % k.branchList.length].name },
        purchased_at: `2026-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, channel: chs[j % 4],
      };
    });
    /* is_unpaid (API): money still owed on the subscription — the row is tinted amber whatever its status */
    k._subs.forEach((s) => { s.payment.remaining = s.payment.total - s.payment.paid; s.is_unpaid = s.payment.remaining > 0 && s.status !== "cancelled"; });
    return k._subs;
  };
  const visits = (n) => L(`${n} visit${n === 1 ? "" : "s"}`, n === 0 ? "0 زيارة" : n === 1 ? "زيارة واحدة" : n === 2 ? "زيارتان" : n <= 10 ? `${n} زيارات` : `${n} زيارة`);
  KP.tabs.subscribers = (mount, ctx) => {
    const k = ctx.pkg;
    if (k.approval_status.value !== "approved") { mount.innerHTML = empty("users", L("No subscribers yet", "لا يوجد مشتركون بعد"), L("Subscriptions start once this package is approved.", "تبدأ الاشتراكات بعد قبول هذه الباقة.")); return; }
    const data = KP.subs(k);
    if (!data.length) { mount.innerHTML = empty("users", L("No subscribers yet", "لا يوجد مشتركون بعد")); return; }
    const plan = ctx.params.get("plan");
    /* branch_type (purchased_at | last_visited) is sent with branch_ids[] — purchased_at by default */
    let f = plan ? { plan: [plan], branch_type: "purchased_at" } : { branch_type: "purchased_at" };
    const fCount = () => ["plan", "branch", "payment", "channel", "start", "end", "purchased"].filter((x) => (Array.isArray(f[x]) ? f[x].length : f[x] || f[x + "_from"] || f[x + "_to"])).length;
    const inR = (v, a, b) => (!a || v >= a) && (!b || v <= b);
    const sorters = { newest: (a, b) => b.purchased_at.localeCompare(a.purchased_at), ends_soonest: (a, b) => a.ends_on.localeCompare(b.ends_on), name: (a, b) => a.subscriber.name.localeCompare(b.subscriber.name), usage: (a, b) => (b.usage.used ?? b.usage.total_used) - (a.usage.used ?? a.usage.total_used), unpaid_first: (a, b) => b.payment.remaining - a.payment.remaining };
    let sort = "newest";
    const ctl = SA.list({
      mount, data, sizes: [20, 50, 100],
      pills: ["all"].concat(Object.keys(ST)).map((s) => ({ key: s, label: s === "all" ? ["All", "الكل"] : [ST[s][1], ST[s][2]] })),
      pillMatch: (r, p) => p === "all" || r.status === p,
      search: ["Search by name or phone", "ابحث بالاسم أو رقم الهاتف"],
      searchMatch: (r, q) => r.subscriber.name.toLowerCase().includes(q) || r.subscriber.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")),
      toolbarExtra: () => `${PP.filterBtn(fCount())}
        <div class="select" style="min-width:190px"><select data-sortsel aria-label="${L("Sort", "الترتيب")}">${[["newest", "Newest first", "الأحدث أولاً"], ["ends_soonest", "Ends soonest", "الأقرب انتهاءً"], ["name", "Name (A–Z)", "الاسم (أ–ي)"], ["usage", "Most used", "الأكثر استخداماً"], ["unpaid_first", "Remaining amount first", "المبلغ المتبقي أولاً"]].map((o) => `<option value="${o[0]}" ${o[0] === sort ? "selected" : ""}>${L(o[1], o[2])}</option>`).join("")}</select><span class="select__caret">${ic("chevronDown")}</span></div>
        <button type="button" class="btn btn--sm btn--secondary" data-export>${ic("upload")}<span>${L("Export", "تصدير")}</span></button>`,
      extraMatch: (r, x) => (!(x.plan || []).length || x.plan.includes(String(r.plan.id))) && (!(x.branch || []).length || (x.branch_type === "last_visited" ? !!r.last_check_in && x.branch.includes(String((k.branchList.find((b) => b.name === r.last_check_in.branch) || {}).id)) : x.branch.includes(String(r.branch.id)))) && (!x.payment || r.payment.status === x.payment)
        && (!(x.channel || []).length || x.channel.includes(r.channel)) && inR(r.starts_on, x.start_from, x.start_to) && inR(r.ends_on, x.end_from, x.end_to) && inR(r.purchased_at, x.purchased_from, x.purchased_to),
      sorter: (a, b) => sorters[sort](a, b),
      empty: () => `<b>${L("No subscribers match your filters", "لا يوجد مشتركون يطابقون عوامل التصفية")}</b><div style="margin-top:var(--space-3)"><button type="button" class="btn btn--sm btn--secondary" data-clear>${L("Clear filters", "مسح عوامل التصفية")}</button></div>`,
      columns: [
        { head: ["Subscriber", "المشترك"], cell: (r) => `<div class="cell-user">${PP.avatar(r.subscriber.name)}<div><b>${esc(r.subscriber.name)}</b> ${r.subscriber.is_app_user ? "" : badge("", L("No account", "عميل بدون حساب"))}
            ${r.subscriber.username ? `<div class="t-xs text-tertiary">@${esc(r.subscriber.username)}</div>` : ""}<div class="t-xs text-tertiary" dir="ltr" style="text-align:start">${esc(r.subscriber.phone)}</div></div></div>` },
        { head: ["Package · plan", "الباقة · الخطة"], cell: (r) => `<span style="font-weight:var(--weight-semibold)">${esc(k.name)}</span><div class="t-xs text-tertiary">${esc(r.plan.name)}</div>` },
        { head: ["Status", "الحالة"], cell: (r) => `${stBadge(r.status)}${r.frozen_until ? `<div class="t-xs text-tertiary">${L("until", "حتى")} ${r.frozen_until}</div>` : ""}${r.upgraded_to ? `<div class="t-xs text-tertiary">${L("→", "←")} ${esc(r.upgraded_to)}</div>` : ""}` },
        { head: ["Payment", "الدفع"], cell: (r) => `<b>${KP.money(r.payment.total, k.currency)}</b> ${badge(PAY[r.payment.status][0], L(PAY[r.payment.status][1], PAY[r.payment.status][2]))}${r.payment.remaining > 0 ? `<div class="t-xs" style="color:var(--color-warning)">${L("Remaining", "المتبقي")} ${KP.money(r.payment.remaining, k.currency)}</div>` : ""}` },
        { head: ["Start → end", "البداية ← النهاية"], cell: (r) => `${r.status === "upcoming" ? L(`Starts on ${r.starts_on}`, `يبدأ في ${r.starts_on}`) : `<span dir="ltr">${r.starts_on} → ${r.ends_on}</span>`}${r.ends_soon ? ` <span style="color:var(--color-warning)" title="${L("Ends within 7 days", "ينتهي خلال 7 أيام")}" aria-label="${L("Ends within 7 days", "ينتهي خلال 7 أيام")}">${ic("clock")}</span>` : ""}
            ${r.frozen_days_added || r.extension_days_added ? `<div class="t-xs text-tertiary">${[r.frozen_days_added ? L(`+${r.frozen_days_added} frozen`, `+${r.frozen_days_added} تجميد`) : "", r.extension_days_added ? L(`+${r.extension_days_added} ext.`, `+${r.extension_days_added} تمديد`) : ""].filter(Boolean).join(" · ")}</div>` : ""}` },
        { head: ["Usage", "الاستخدام"], cell: (r) => (r.usage.unlimited ? visits(r.usage.total_used) : `${r.usage.used} / ${r.usage.limit}<div class="progress" style="height:6px;width:90px;margin-block:4px"><div class="progress__bar" style="width:${Math.min(100, (r.usage.used / r.usage.limit) * 100)}%;${r.usage.used >= r.usage.limit ? "background:var(--color-danger)" : ""}"></div></div><div class="t-xs text-tertiary">${L("resets", "يُعاد التعيين")} ${r.usage.resets_on}</div>`) },
        { head: ["Last check-in", "آخر تسجيل دخول"], cell: (r) => (r.last_check_in ? `${esc(r.last_check_in.at)} · ${esc(r.last_check_in.branch)}` : "—") },
        { head: ["", ""], cell: (r) => `<a class="icon-btn" href="${KP.href("subscribers", { ref: r.reference })}" aria-label="${L("View subscriber", "عرض المشترك")}" title="${L("View subscriber", "عرض المشترك")}">${ic("eye")}</a>` },
      ],
      after: (root) => {
        root.querySelectorAll("tbody tr").forEach((tr) => { const a = tr.querySelector("a[href*='ref=']"); const r = a && data.find((x) => a.href.includes(x.reference)); if (r && r.is_unpaid) tr.style.background = "var(--color-warning-subtle)"; });
        /* Export is disabled while the filtered total is 0 (dashboard: result.total === 0) */
        const ex = root.querySelector("[data-export]"); if (ex) ex.disabled = !!root.querySelector("tbody td[colspan]");
      },
    });
    ctl.state.extra = f;
    ctl.paint();
    const branches = k.branchList;
    mount.addEventListener("change", (e) => { if (e.target.matches("[data-sortsel]")) { sort = e.target.value; ctl.state.sort = { key: sort, dir: "asc" }; ctl.paint(); } });
    mount.addEventListener("click", (e) => {
      if (e.target.closest("[data-clear]")) { f = { branch_type: "purchased_at" }; ctl.state.extra = f; ctl.state.q = ""; ctl.state.pill = "all"; return ctl.paint(); }
      if (e.target.closest("[data-export]")) return RD.toast("success", L(`package-${k.id}-subscribers.xlsx downloaded (sample)`, `تم تنزيل package-${k.id}-subscribers.xlsx (عينة)`));
      const b = e.target.closest("[data-filter]");
      if (!b) return;
      KP.filterPop(b, { width: 340, value: f, fields: [
        k.planList.length ? { key: "plan", label: ["Plan :", "الخطة :"], type: "checks", options: () => k.planList.map((p) => [String(p.id), p.name]) } : null,
        branches.length ? { key: "branch", label: ["Branch :", "الفرع :"], type: "checks", options: () => branches.map((x) => [String(x.id), x.name]) } : null,
        branches.length ? { key: "branch_type", type: "segment", default: "purchased_at", options: () => [["purchased_at", L("Purchased at", "مكان الشراء")], ["last_visited", L("Last visited", "آخر زيارة")]] } : null,
        { key: "payment", label: ["Payment :", "الدفع :"], options: () => Object.keys(PAY).map((p) => [p, L(PAY[p][1], PAY[p][2])]) },
        { key: "channel", label: ["Channel :", "القناة :"], type: "checks", options: () => Object.keys(CH).map((c) => [c, L(CH[c][0], CH[c][1])]) },
        { key: "start", label: ["Start date :", "تاريخ البداية :"], type: "range" },
        { key: "end", label: ["End date :", "تاريخ الانتهاء :"], type: "range" },
        { key: "purchased", label: ["Purchase date :", "تاريخ الشراء :"], type: "range" },
      ].filter(Boolean), onApply: (d) => { f = d; ctl.state.extra = f; ctl.state.page = 1; ctl.paint(); } });
    });
  };

  /* ================= subscriber page (read-only) ================= */
  /* opts.href(extra) builds this page's links — the user profile opens the same page (UserPackageDetailsPage) */
  KP.subscriber = (mount, ctx, ref, opts) => {
    const link = (opts && opts.href) || ((x) => KP.href("subscribers", x));
    const k = ctx.pkg, s = KP.subs(k).find((x) => x.reference === ref);
    const back = PP.backBtn(link());
    if (!s) { mount.innerHTML = `<div class="row" style="justify-content:flex-end">${back}</div>` + empty("users", L("Subscription not found", "الاشتراك غير موجود")); return; }
    const tone = (t) => ({ success: "success", warning: "warning", danger: "danger", info: "info", primary: "primary" }[t] || "");
    const st = ST[s.status], pay = PAY[s.payment.status];
    const sub = new URLSearchParams(location.search).get("sub") || "overview";
    const pct = s.usage.unlimited ? null : Math.round((s.usage.used / s.usage.limit) * 100);
    const sumCard = (title, value, t, line) => `<div class="card card--pad stack gap-1"><span class="t-sm text-tertiary">${title}</span><b style="font-size:var(--text-lg);color:${t ? `var(--color-${t})` : "inherit"}">${value}</b>${line ? `<span class="t-xs text-tertiary">${line}</span>` : ""}</div>`;
    const sec = (t, body) => `<section class="stack gap-3" style="padding-block:var(--space-4);border-top:var(--border-thin) dashed var(--color-border)"><h5 class="t-title" style="font-size:var(--text-body)">${t}</h5>${body}</section>`;
    const checkins = s.last_check_in ? Array.from({ length: Math.min(6, (s.usage.used ?? s.usage.total_used) || 1) }, (_, j) => ({ at: `${3 + j} Nov 2026, 1${j}:04 AM`, branch: s.branch.name, method: j % 2 ? L("QR scan", "مسح QR") : L("Manual", "يدوي"), by: j % 2 ? "Reception" : "Coach Sami", period: L("Nov 2026", "نوفمبر 2026"), status: j === 4 ? ["danger", L("Reversed", "ملغى")] : ["success", L("Counted", "محتسب")] })) : [];
    const SUBS = [["overview", "Overview", "نظرة عامة"], ["usage_history", "Usage history", "سجل الاستخدام"], ["payments", "Payments", "المدفوعات"], ["review", "Review", "التقييم"], ["activity", "Activity", "النشاط"]];
    const reviewed = s.id % 3 === 0;
    let body = "";
    if (sub === "overview") body = [
      `<div class="stack gap-3"><h5 class="t-title" style="font-size:var(--text-body)">${L("Subscription", "الاشتراك")}</h5>${kv([[L("Reference", "المرجع"), s.reference], [L("Plan", "الخطة"), esc(s.plan.name)], [L("Branch", "الفرع"), esc(s.branch.name)], [L("Channel", "القناة"), L(CH[s.channel][0], CH[s.channel][1])], [L("Purchased on", "تاريخ الشراء"), s.purchased_at]])}</div>`,
      sec(L("Term", "المدة"), kv([[L("Starts on", "تاريخ البدء"), s.starts_on], [L("Ends on", "تاريخ الانتهاء"), s.ends_on], s.extension_days_added ? [L("Extension days", "أيام التمديد"), `${s.extension_days_added}<div class="t-xs text-tertiary" style="font-weight:var(--weight-regular)">${L("Facility closed for maintenance", "المنشأة مغلقة للصيانة")}</div>`] : null])),
      sec(L("Usage", "الاستخدام"), kv([[L("The rule", "القاعدة"), k.usage_rules.type === "limited" ? L(`${k.usage_rules.limit} visits per ${k.usage_rules.reset_period}`, `${k.usage_rules.limit} زيارات كل ${k.usage_rules.reset_period === "month" ? "شهر" : k.usage_rules.reset_period === "week" ? "أسبوع" : "يوم"}`) : L("Unlimited", "غير محدود")],
        [L("This subscriber", "هذا المشترك"), s.usage.unlimited ? visits(s.usage.total_used) : `${s.usage.used} / ${s.usage.limit}<div class="progress" style="height:6px;width:150px;margin-block:4px"><div class="progress__bar" style="width:${Math.min(100, pct)}%;${pct >= 100 ? "background:var(--color-danger)" : ""}"></div></div><div class="t-xs text-tertiary" style="font-weight:var(--weight-regular)">${L("Resets on", "يُعاد التعيين في")} ${s.usage.resets_on}</div>`]])),
      sec(L("Access", "الوصول"), `<b>${esc(k.access_schedule.label)}</b><span class="t-sm text-tertiary">${esc(s.branch.name)}</span>`),
      sec(L("Payment", "الدفع"), `<div class="stack gap-1"><span class="t-sm text-tertiary">${L("Paid", "المدفوع")}</span><b style="font-size:var(--text-2xl);color:var(--color-${tone(pay[0]) || "text"})">${KP.money(s.payment.paid, k.currency)}</b><span class="t-xs text-tertiary">${s.payment.remaining > 0 ? L(`Remaining ${fmt(s.payment.remaining)} ${k.currency}`, `المتبقي ${fmt(s.payment.remaining)} ${k.currency}`) : L("Paid in full", "مدفوع بالكامل")}</span></div>
        ${kv([[L("Total", "الإجمالي"), KP.money(s.payment.total, k.currency)], [L("Tax", "الضريبة"), KP.money(s.plan.tax_amount, k.currency)]])}
        ${s.payment.paid ? `<h5 class="t-sm" style="font-weight:var(--weight-bold)">${L("Collections", "التحصيلات")}</h5>${SA.table({ rows: [{ a: s.payment.paid, m: L("Cash", "نقداً"), c: "Reception", d: "Oct 12, 2026, 09:40" }], empty: [""], columns: [{ head: ["Amount", "المبلغ"], cell: (x) => KP.money(x.a, k.currency) }, { head: ["Method", "الطريقة"], cell: (x) => x.m }, { head: ["Collector", "المحصِّل"], cell: (x) => x.c }, { head: ["Date", "التاريخ"], cell: (x) => x.d }] })}` : ""}`),
    ].join("");
    if (sub === "usage_history") body = checkins.length
      ? `<span class="t-sm text-secondary" style="font-weight:var(--weight-semibold)">${L(`${checkins.length} check-ins this period`, `${checkins.length} تسجيلات دخول في هذه الفترة`)}</span>
        <div class="row gap-2" style="flex-wrap:wrap">${[["Period", "الفترة"], ["Branch", "الفرع"], ["Method", "الطريقة"]].map((x) => `<div class="select" style="min-width:160px"><select aria-label="${L(x[0], x[1])}"><option>${L(x[0], x[1])}: ${L("All", "الكل")}</option></select><span class="select__caret">${ic("chevronDown")}</span></div>`).join("")}<span class="grow"></span><button type="button" class="btn btn--sm btn--secondary" data-csv>${ic("upload")}<span>${L("Export", "تصدير")}</span></button></div>
        ${SA.table({ rows: checkins, empty: [""], columns: [{ head: ["Date", "التاريخ"], cell: (x) => x.at }, { head: ["Branch", "الفرع"], cell: (x) => esc(x.branch) }, { head: ["Method", "الطريقة"], cell: (x) => x.method }, { head: ["Scanned by", "تم المسح بواسطة"], cell: (x) => x.by }, { head: ["Period", "الفترة"], cell: (x) => x.period }, { head: ["Status", "الحالة"], cell: (x) => badge(x.status[0], x.status[1]) }] })}`
      : `<div class="stack gap-1" style="padding:var(--space-6) 0;text-align:center"><b>${L("Not available yet.", "غير متاح بعد.")}</b></div>`;
    if (sub === "payments") body = SA.table({ rows: [{ t: L("Purchase", "شراء"), a: s.payment.total, m: L(`${CH[s.channel][0]} · ${PAY[s.payment.status][1]}`, `${CH[s.channel][1]} · ${PAY[s.payment.status][2]}`), b: esc(s.subscriber.name), d: s.purchased_at }].concat(s.payment.paid && s.payment.status !== "paid" ? [{ t: L("Collection", "تحصيل"), a: s.payment.paid, m: L("Cash", "نقداً"), b: "Reception", d: "2026-10-12" }] : []), empty: ["Not available yet.", "غير متاح بعد."],
      columns: [{ head: ["Type", "النوع"], cell: (x) => `<b>${x.t}</b>` }, { head: ["Amount", "المبلغ"], cell: (x) => KP.money(x.a, k.currency) }, { head: ["Method / status", "الطريقة / الحالة"], cell: (x) => x.m }, { head: ["By", "بواسطة"], cell: (x) => x.b }, { head: ["Date", "التاريخ"], cell: (x) => x.d }] })
      + `<p class="t-sm text-tertiary">${s.payment.remaining > 0 ? L("Outstanding", "مستحق") : L("Settled", "مُسدد")}</p>`;
    if (sub === "review") body = reviewed
      ? `<div class="stack gap-2" style="padding:var(--space-4);border:var(--border-thin) solid var(--color-border);border-radius:var(--radius-lg)"><div><span style="color:var(--color-warning)">★★★★</span><span class="text-tertiary">★</span> <b>4 / 5</b></div><p>${L("Great coaches and clean facilities.", "مدربون رائعون ومرافق نظيفة.")}</p><span class="t-xs text-tertiary">${esc(s.subscriber.name)} · 08 Nov 2026</span><span class="t-xs text-tertiary">${L("Submitted from the app after 3 check-ins", "أُرسل من التطبيق بعد 3 تسجيلات دخول")}</span></div>`
      : `<p class="text-tertiary">${L("Not available yet.", "غير متاح بعد.")}</p>`;
    if (sub === "activity") body = `<ul class="stack gap-4" style="list-style:none;padding:0;margin:0">${[["success", L("Subscription purchased", "تم شراء الاشتراك"), "", s.subscriber.name, s.purchased_at + " 10:15"], s.frozen_days_added ? ["primary", L(`Frozen for ${s.frozen_days_added} days`, `تم التجميد ${s.frozen_days_added} أيام`), L("Travel", "سفر"), "Reception", "2026-10-20 12:00"] : null, s.status === "cancelled" ? ["danger", L("Subscription cancelled", "تم إلغاء الاشتراك"), L("Customer request", "طلب العميل"), "Reception", "2026-11-02 09:00"] : null].filter(Boolean)
      .map((a) => `<li class="row gap-3" style="align-items:flex-start"><span style="width:10px;height:10px;border-radius:50%;margin-top:6px;flex:none;background:var(--color-${a[0]})"></span><div class="stack gap-1"><b class="t-sm">${a[1]}</b>${a[2] ? `<span class="t-xs text-secondary">${a[2]}</span>` : ""}<span class="t-xs text-tertiary">${esc(a[3])} · ${a[4]}</span></div></li>`).join("")}</ul>`;
    mount.innerHTML = `<section class="card card--pad animate-in row between gap-4" style="align-items:center;flex-wrap:wrap">
        <div class="row gap-3" style="align-items:center">${PP.avatar(s.subscriber.name, "lg")}<div class="stack gap-1"><b class="t-title">${esc(s.subscriber.name)}</b>
          <span class="t-sm text-tertiary" dir="ltr" style="text-align:start">${esc(s.subscriber.phone)}</span><span class="t-sm text-tertiary">${s.subscriber.username ? "@" + esc(s.subscriber.username) : L("No app account", "لا يوجد حساب في التطبيق")}</span>
          <div class="row gap-2">${badge(st[0], L(st[1], st[2]))}${badge(pay[0] || "warning", L(pay[1], pay[2]))}</div></div></div>${back}</section>
      <div class="sa-stats" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
        ${sumCard(L("Status", "الحالة"), L(st[1], st[2]), tone(st[0]), s.frozen_until ? L(`until ${s.frozen_until}`, `حتى ${s.frozen_until}`) : "")}
        ${sumCard(L("Payment", "الدفع"), KP.money(s.payment.paid, k.currency), tone(pay[0]), s.payment.remaining > 0 ? L(`Remaining ${fmt(s.payment.remaining)}`, `المتبقي ${fmt(s.payment.remaining)}`) : L("Paid in full", "مدفوع بالكامل"))}
        ${sumCard(L("Usage", "الاستخدام"), s.usage.unlimited ? visits(s.usage.total_used) : `${s.usage.used} / ${s.usage.limit}`, "", s.usage.unlimited ? L("Unlimited", "غير محدود") : L(`resets ${s.usage.resets_on}`, `يُعاد التعيين ${s.usage.resets_on}`))}
        ${sumCard(L("Ends in", "ينتهي خلال"), L("11 days", "11 يوماً"), "", s.ends_on)}
      </div>
      <section class="card card--pad animate-in stack gap-4"><div class="tabs">${SUBS.map((t) => `<a href="${link({ ref, sub: t[0] })}" class="${t[0] === sub ? "is-active" : ""}">${L(t[1], t[2])}${t[0] === "review" && reviewed ? ` <span style="color:var(--color-warning)">★</span>` : ""}</a>`).join("")}</div><div class="stack gap-3">${body}</div></section>`;
    mount.onclick = (e) => { if (e.target.closest("[data-csv]")) RD.toast("success", L(`usage-history-${ref}.csv downloaded (sample)`, `تم تنزيل usage-history-${ref}.csv (عينة)`)); };
  };

  /* ================= comments ================= */
  const CST = { published: ["success", "Published", "منشور"], deletion_request: ["warning", "Pending deletion", "بانتظار الحذف"], deleted: ["danger", "Deleted", "محذوف"] };
  KP.comments = function (k) {
    if (k._cm) return k._cm;
    const subs = KP.subs(k), TXT = ["Great coaches and clean facilities. The morning slots are always on time and the staff remember your name, which makes it feel like a real community rather than just another gym membership.", "Booking was easy.", "Lockers were broken twice this month.", "ممتاز جداً والأسعار مناسبة", "The pool was closed without notice.", "Perfect for my kids, they love it!"];
    k._cm = subs.slice(0, Math.min(subs.length, 9)).map((s, j) => {
      const key = j % 5 === 2 ? "deletion_request" : j % 6 === 4 ? "deleted" : "published";
      return { id: 800 + j, user: { name: s.subscriber.name }, comment: TXT[j % TXT.length], comment_on: { reference: s.reference, plan: s.plan.name }, rate: [5, 4, 2, 5, 1, 4][j % 6], status: key, created_at: `2026-11-0${1 + (j % 9)} 1${j % 10}:20`,
        deletion_reason: key !== "published" ? L("Contains false claims about the staff.", "يحتوي على ادعاءات غير صحيحة عن الموظفين.") : null,
        deletion_request: key !== "published" ? { reason: L("Contains false claims about the staff.", "يحتوي على ادعاءات غير صحيحة عن الموظفين."), requested_by: k.partner.name, requested_at: "2026-11-05 10:00", status: key === "deleted" ? "approved" : "pending", decided_by: key === "deleted" ? "Super Admin" : null, decided_at: key === "deleted" ? "2026-11-06 09:30" : null, decision_reason: null } : null };
    });
    return k._cm;
  };
  KP.tabs.comments = (mount, ctx) => {
    const k = ctx.pkg, data = KP.comments(k), open = new Set();
    const stars = (r) => (r ? `<span style="color:var(--color-warning)">★</span> ${r}` : "—");
    const trunc = (c, id) => (c.length > 120 && !open.has(id) ? `${esc(c.slice(0, 120))}... <button type="button" class="btn btn--ghost btn--sm" style="padding:0 4px;height:auto" data-more="${id}">${L("Show more", "عرض المزيد")}</button>` : `${esc(c)}${c.length > 120 ? ` <button type="button" class="btn btn--ghost btn--sm" style="padding:0 4px;height:auto" data-more="${id}">${L("Show less", "عرض أقل")}</button>` : ""}`);
    /* GET /packages/{id}/comments `banner` → amber alert above the table; sample via ?demo=banner */
    const ctl = SA.list({
      mount, data, sizes: [20, 50, 100],
      banner: new URLSearchParams(location.search).get("demo") === "banner" ? `<div style="padding:var(--space-3) var(--space-4) 0">${notice("warning", "warn", L("Deletion requests are reviewed within 2 working days.", "تتم مراجعة طلبات الحذف خلال يومَي عمل."))}</div>` : "",
      pills: [["all", "All", "الكل"], ["published", "Published", "منشور"], ["deletion_request", "Deletion request", "طلب حذف"], ["deleted", "Deleted", "محذوف"]].map((p) => ({ key: p[0], label: [p[1], p[2]] })),
      pillMatch: (r, p) => p === "all" || r.status === p,
      search: ["Search by user name", "ابحث باسم المستخدم"],
      searchMatch: (r, q) => r.user.name.toLowerCase().includes(q),
      empty: ["There is no data to display", "لا توجد بيانات لعرضها"],
      columns: [
        { head: ["User", "المستخدم"], cell: (r) => `<div class="cell-user">${PP.avatar(r.user.name)}<div><b>${esc(r.user.name)}</b><div class="t-xs text-tertiary">${r.created_at}</div></div></div>` },
        { head: ["Comment", "التعليق"], cell: (r) => `<div style="max-width:320px;white-space:normal">${trunc(r.comment, r.id)}</div>` },
        { head: ["Comment on", "تعليق على"], cell: (r) => `<a href="${KP.href("subscribers", { ref: r.comment_on.reference })}" style="color:var(--color-text-link)">${r.comment_on.reference}</a><div class="t-xs text-tertiary">${esc(r.comment_on.plan)}</div>` },
        { head: ["Deletion reason", "سبب الحذف"], cell: (r) => (r.deletion_reason ? `<div style="max-width:220px;white-space:normal">${esc(r.deletion_reason)}</div>` : "—") },
        { head: ["Rating", "التقييم"], align: "center", cell: (r) => stars(r.rate) },
        { head: ["Status", "الحالة"], align: "center", cell: (r) => badge(CST[r.status][0], L(CST[r.status][1], CST[r.status][2])) },
        { head: ["Actions", "الإجراءات"], align: "center", cell: (r) => `<div class="row gap-1" style="justify-content:center">${SA.iconBtn("eye", L("View", "عرض"), `data-view="${r.id}"`)}${
          r.status === "published" ? SA.iconBtn("trash", L("Delete", "حذف"), `data-act="delete" data-id="${r.id}"`)
          : r.status === "deletion_request" ? SA.iconBtn("check", L("Approve deletion request", "قبول طلب الحذف"), `data-act="approve" data-id="${r.id}"`) + SA.iconBtn("close", L("Decline deletion request", "رفض طلب الحذف"), `data-act="decline" data-id="${r.id}"`)
          : SA.iconBtn("refresh", L("Restore", "استعادة"), `data-act="restore" data-id="${r.id}"`)}</div>` },
      ],
    });
    const ACT = {
      approve: [L("Approve deletion request", "قبول طلب الحذف"), L("Approving deletes this comment from the package. It can be restored later.", "القبول يحذف هذا التعليق من الباقة. يمكن استعادته لاحقاً."), L("Approve", "قبول"), "danger", 0, L("Deletion request approved", "تم قبول طلب الحذف")],
      decline: [L("Decline deletion request", "رفض طلب الحذف"), L("Declining keeps this comment published. You can tell the partner why.", "الرفض يبقي هذا التعليق منشوراً. يمكنك توضيح السبب للشريك."), L("Decline", "رفض"), "", 1, L("Deletion request declined", "تم رفض طلب الحذف")],
      delete: [L("Delete comment", "حذف التعليق"), L("Please confirm that you want to delete this item", "يرجى تأكيد رغبتك في حذف هذا العنصر"), L("Delete", "حذف"), "danger", 2, L("Comment deleted successfully", "تم حذف التعليق بنجاح")],
      restore: [L("Restore comment", "استعادة التعليق"), L("Please confirm that you want to restore this comment", "يرجى تأكيد رغبتك في استعادة هذا التعليق"), L("Restore", "استعادة"), "success", 0, L("Comment restored successfully", "تم استعادة التعليق بنجاح")],
    };
    function act(kind, r, done) {
      const [title, msg, ok, tone, reason, toast] = ACT[kind];
      const el = SA.modal({ id: "kpCmAct", title, body: `<div class="stack gap-3"><p class="t-sm text-secondary">${msg}</p>
          <div style="padding:var(--space-3);border-radius:var(--radius-md);background:var(--color-surface-sunken)"><b>${esc(r.user.name)}</b><p class="t-sm">${esc(r.comment)}</p></div>
          ${kind === "approve" && r.deletion_reason ? `<p class="t-sm"><b>${L("Deletion reason:", "سبب الحذف:")}</b> ${esc(r.deletion_reason)}</p>` : ""}
          ${reason ? `<div class="field"><label class="field__label">${reason === 2 ? `${L("Reason", "السبب")} <span class="req">*</span>` : L("Reason (optional)", "السبب (اختياري)")}</label><textarea class="input" rows="4" maxlength="500" data-reason></textarea>
            <div class="row between"><span class="t-xs" style="color:var(--color-danger)" data-err></span><span class="t-xs text-tertiary" data-count>0 / 500</span></div></div>` : ""}</div>`,
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn${tone ? " btn--" + tone : ""}" data-ok>${ok}</button>` });
      const ta = el.querySelector("[data-reason]");
      if (ta) { ta.oninput = () => (el.querySelector("[data-count]").textContent = `${ta.value.length} / 500`); setTimeout(() => ta.focus(), 50); }
      el.querySelector("[data-ok]").onclick = () => {
        const v = ta ? ta.value.trim() : "";
        if (reason === 2 && v.length < 10) { el.querySelector("[data-err]").textContent = L("The reason must be at least 10 characters.", "يجب ألا يقل السبب عن 10 أحرف."); return; }
        if (kind === "delete") { r.status = "deleted"; r.deletion_reason = v; }
        if (kind === "approve") { r.status = "deleted"; Object.assign(r.deletion_request, { status: "approved", decided_by: "Super Admin", decided_at: "2026-11-15 12:00" }); }
        if (kind === "decline") { r.status = "published"; Object.assign(r.deletion_request, { status: "rejected", decided_by: "Super Admin", decided_at: "2026-11-15 12:00", decision_reason: v || null }); r.deletion_reason = null; }
        if (kind === "restore") { r.status = "published"; r.deletion_reason = null; }
        SA.close(el); RD.toast("success", toast); (done || ctl.paint)();
      };
    }
    function view(r) {
      const dr = r.deletion_request, DEC = { pending: ["warning", L("Pending", "قيد المراجعة")], approved: ["danger", L("Approved", "مقبول")], rejected: ["success", L("Declined", "مرفوض")] };
      const box = (t, extra, txt) => `<div class="stack gap-1" style="padding:var(--space-3);border:var(--border-thin) dashed var(--color-border);border-radius:var(--radius-md)"><div class="row gap-2" style="align-items:center"><b class="t-sm">${t}</b>${extra || ""}</div><span class="t-sm text-secondary">${txt}</span></div>`;
      SA.modal({ id: "kpCmView", wide: true, title: L("View comment", "عرض التعليق"), body: `<div class="stack gap-4">
          <div class="row between gap-3" style="align-items:center"><div class="cell-user">${PP.avatar(r.user.name)}<div><b>${esc(r.user.name)}</b><div class="t-xs text-tertiary">${r.created_at} · ${stars(r.rate)}</div></div></div>${badge(CST[r.status][0], L(CST[r.status][1], CST[r.status][2]))}</div>
          <p style="padding:var(--space-3);border-radius:var(--radius-md);background:var(--color-surface-sunken);white-space:pre-wrap">${esc(r.comment)}</p>
          ${kv([[L("Subscription", "الاشتراك"), `<a href="${KP.href("subscribers", { ref: r.comment_on.reference })}" data-close style="color:var(--color-text-link)">${r.comment_on.reference}</a>`], [L("Plan", "الخطة"), esc(r.comment_on.plan)]])}
          ${dr ? `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Deletion history", "سجل الحذف")}</h4>
            ${box(L("Partner's request", "طلب الشريك"), "", L(`Requested by ${esc(dr.requested_by)} on ${dr.requested_at} — Reason: ${esc(dr.reason)}`, `طلبه ${esc(dr.requested_by)} في ${dr.requested_at} — السبب: ${esc(dr.reason)}`))}
            ${box(L("HighFive's decision", "قرار HighFive"), badge(DEC[dr.status][0], DEC[dr.status][1]), (dr.decided_by ? L(`Decided by ${dr.decided_by} on ${dr.decided_at} — `, `قرّره ${dr.decided_by} في ${dr.decided_at} — `) : "") + L(`Status: ${DEC[dr.status][1]}`, `الحالة: ${DEC[dr.status][1]}`) + (dr.decision_reason ? L(` — Reason: ${esc(dr.decision_reason)}`, ` — السبب: ${esc(dr.decision_reason)}`) : ""))}` : ""}</div>`,
        foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button>` });
    }
    mount.addEventListener("click", (e) => {
      const m = e.target.closest("[data-more]"); if (m) { const id = +m.dataset.more; open.has(id) ? open.delete(id) : open.add(id); return ctl.paint(); }
      const v = e.target.closest("[data-view]"); if (v) return view(data.find((x) => x.id === +v.dataset.view));
      const a = e.target.closest("[data-act]"); if (a) act(a.dataset.act, data.find((x) => x.id === +a.dataset.id));
    });
    /* All Comments (comments.html) opens these same modals for package rows */
    KP.commentAct = act; KP.commentView = view;
  };
})();
