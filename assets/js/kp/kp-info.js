/* Package detail — sample data + details · plans · branches · gallery tabs.
   Mirrors pages/packages/package-detail/{details,plans,branches,gallery}.
   Registers on KP.tabs; card/kv/btn helpers come from pp-core.js. */
(function () {
  "use strict";
  const { L, esc, ic, badge, fmt } = SA;
  const { card, kv } = PP;
  const KP = (window.KP = window.KP || { tabs: {} });

  /* ---------- per-package sample data (GET /packages/{id} + /details + /plans …) ---------- */
  KP.extend = function (k) {
    if (k._kp) return k;
    k._kp = true;
    const i = k.id % 7, ap = k.approval_status.value;
    const partner = HF.SA.partners.find((p) => p.id === k.partner.id);
    const cur = k.plans.currency;
    const planNames = ["Monthly", "Quarterly", "Annual"].slice(0, k.plans.count);
    const fixed = k.validity.type === "fixed_date_range";
    Object.assign(k, {
      description: `${k.name} gives members access to ${k.categories.join(" & ").toLowerCase()} sessions across ${k.branches.length} branch${k.branches.length > 1 ? "es" : ""}.`,
      rating: i % 3 === 2 ? { average: null, count: 0 } : { average: 4 + (i % 5) / 10, count: 6 + i * 4 },
      package_status: ap === "approved" ? (i % 4 === 3 ? "inactive" : "active") : "inactive",
      action_by: ap === "pending" ? "partner" : "admin", action_on: `2026-${String((i % 9) + 1).padStart(2, "0")}-1${i} 12:00`,
      rejection_reason: ap === "not_approved" ? k.approval_status.tooltip || "Cover image shows a third-party logo. Please replace it." : null,
      status_reason: null,
      hints: ap === "approved" && i % 2 ? [{ key: "tax", label: L("No tax", "بدون ضريبة"), tone: "warning", message: L("No tax is applied to this package's plans.", "لا توجد ضريبة مطبقة على خطط هذه الباقة.") }] : [],
      banner: k.partner.disabled ? { message: L("This partner is disabled — the package can't be sold until the partner is re-activated.", "هذا الشريك موقوف — لا يمكن بيع الباقة حتى يُعاد تفعيل الشريك."), tone: "warning" } : null,
      gender: ["both", "male", "female"][i % 3], all_age_groups: i % 3 === 0, age_groups: i % 3 === 0 ? [] : [{ name: "Teens" }, { name: "Adults" }].slice(0, 1 + (i % 2)),
      availability: { label: i % 2 ? L("Always available", "متاحة دائماً") : L("Display period", "فترة عرض"), display_starts_at: i % 2 ? null : "2026-10-01", display_ends_at: i % 2 ? null : "2027-03-31" },
      access_schedule: { label: i % 2 ? L("Any time", "في أي وقت") : L("Specific days", "أيام محددة"), days: i % 2 ? null : ["sun", "tue"] },
      capacityD: { type: ["unlimited", "total", "active"][i % 3], limit: i % 3 ? 120 : null, used: k.subscribers.active, fully_purchased: i % 3 === 1 && k.subscribers.active >= 120 },
      usage_rules: i % 2 ? { type: "limited", limit: 10, reset_period: "month" } : { type: "unlimited" },
      renew: { manual_renew: { label: L("Manual renew", "التجديد اليدوي"), enabled: i % 2 === 0, can_change: true }, automatic_renew: { label: L("Automatic renew", "التجديد التلقائي"), enabled: false, can_change: false, badge: L("Coming soon", "قريباً"), tooltip: L("Available in a later release", "متاح في إصدار لاحق") } },
      planList: planNames.map((n, j) => {
        const price = k.plans.from_price * (j === 0 ? 1 : j === 1 ? 2.7 : 10);
        const tax = +(price * 0.15).toFixed(2);
        return { id: 9000 + k.id * 10 + j, name: n, active: !(j === 2 && i % 2), price, tax_amount: tax, total_price: +(price + tax).toFixed(2), taxes: [{ name: "VAT", rate: 15 }],
          starts_on: fixed ? k.validity.starts_on : null, ends_on: fixed ? k.validity.ends_on : null, duration_value: [1, 3, 1][j], duration_unit: ["month", "month", "year"][j],
          activation_window_value: k.validity.type === "user_activation" ? 14 : null, activation_window_unit: "day", renewal: j < 2,
          subscribers: { active: Math.round(k.subscribers.active / (j + 1.5)), unpaid: j === 0 ? k.subscribers.amount_due : 0 } };
      }),
      branchList: (partner && partner.branches ? partner.branches : k.branches.map((b, j) => ({ id: 60 + j, name: b.name }))).filter((b) => k.branches.some((x) => x.name === b.name) || true).slice(0, k.branches.length)
        .map((b, j) => ({ id: b.id, name: b.name, city: partner ? partner.city.name : "Riyadh", address: `${["King Fahd Rd", "Olaya St", "Corniche Rd"][j % 3]}, ${partner ? partner.city.name : "Riyadh"}`, active: j !== 2 })),
      galleryList: Array.from({ length: 3 + (i % 3) }, (_, j) => ({ id: j + 1 })),
      partnerRef: partner,
    });
    k.currency = cur;
    return k;
  };

  /* ---------- formatters (detailFormatters.js / planFormat.js) ---------- */
  const DUR = { day: ["day", "days", "يوم واحد", "يومان", "أيام", "يوم"], week: ["week", "weeks", "أسبوع واحد", "أسبوعان", "أسابيع", "أسبوع"], month: ["month", "months", "شهر واحد", "شهران", "أشهر", "شهر"], year: ["year", "years", "سنة واحدة", "سنتان", "سنوات", "سنة"] };
  KP.dur = (n, unit) => {
    const d = DUR[unit];
    if (!d) return `${n} ${unit}`;
    return L(`${n} ${n === 1 ? d[0] : d[1]}`, n === 1 ? d[2] : n === 2 ? d[3] : n <= 10 ? `${n} ${d[4]}` : `${n} ${d[5]}`);
  };
  /* PACKAGES.PLANS_COUNT — AR plural: zero "لا توجد خطط" · one · two · 3–10 "# خطط" · other "# خطة" */
  KP.plansCount = (n) => L(`${n} plan${n === 1 ? "" : "s"}`, n === 0 ? "لا توجد خطط" : n === 1 ? "خطة واحدة" : n === 2 ? "خطتان" : n % 100 >= 3 && n % 100 <= 10 ? `${n} خطط` : `${n} خطة`);
  KP.money = (v, cur) => `${fmt(v)} ${esc(cur)}`;
  KP.approvalBadge = (v) => (v === "pending" ? badge("warning", L("Pending", "قيد المراجعة")) : v === "approved" ? badge("success", L("Approved", "مقبولة")) : v === "not_approved" ? badge("danger", L("Not approved", "غير مقبولة")) : badge("", esc(PP.cap(v))));
  KP.statusBadge = (v) => (v === "active" ? badge("success", L("Active", "نشطة")) : badge("danger", L("Inactive", "غير نشطة")));
  KP.actionBy = (k) => L(`By ${k.action_by === "admin" ? "HighFive" : k.action_by === "partner" ? "the partner" : k.action_by} · ${k.action_on}`, `بواسطة ${k.action_by === "admin" ? "HighFive" : k.action_by === "partner" ? "الشريك" : k.action_by} · ${k.action_on}`);
  KP.editBtn = (section) => `<a class="btn btn--sm btn--secondary" href="package-edit.html?id=${KP.pkg.id}${section ? "&section=" + section : ""}">${ic("edit")}<span>${L("Edit", "تعديل")}</span></a>`;
  const block = (title, rows) => `<section class="stack gap-3" style="padding-block:var(--space-4);border-top:var(--border-thin) dashed var(--color-border)"><h5 class="t-title" style="font-size:var(--text-body)">${title}</h5>${kv(rows)}</section>`;
  const genderTxt = (g) => ({ male: L("Male", "ذكور"), female: L("Female", "إناث"), both: L("Both", "الكل") }[g] || PP.cap(g));

  /* ================= details ================= */
  KP.tabs.details = (mount, ctx) => {
    const k = ctx.pkg;
    const paint = () => {
      const r = k.renew;
      const toggle = (key, o) => `<div class="row between gap-4" style="align-items:center;padding:var(--space-2) 0"><span>${esc(o.label)} ${o.badge ? badge("warning", esc(o.badge)) : ""}</span>
        <label class="switch" ${o.tooltip ? `title="${esc(o.tooltip)}"` : ""}><input type="checkbox" data-renew="${key}" ${o.enabled ? "checked" : ""} ${o.can_change ? "" : "disabled"} aria-label="${esc(o.label)}"><span class="switch__track"></span></label></div>`;
      const fixed = k.validity.type === "fixed_date_range";
      const expl = { fixed_date_range: L("All subscribers start and end on the same dates.", "يبدأ جميع المشتركين وينتهون في نفس التواريخ."), from_purchase: L("Each subscriber starts on the day they buy.", "يبدأ كل مشترك في يوم الشراء."), user_activation: L("The subscriber activates the plan when they choose.", "يفعّل المشترك الخطة متى شاء.") }[k.validity.type];
      const capLbl = { unlimited: [L("Unlimited", "غير محدودة"), ""], total: [L("Total subscribers", "إجمالي المشتركين"), L("Maximum number of subscriptions ever sold on this package.", "الحد الأقصى لعدد الاشتراكات المباعة على هذه الباقة.")], active: [L("Active subscribers", "المشتركون النشطون"), L("Maximum number of active subscribers at any one time.", "الحد الأقصى لعدد المشتركين النشطين في أي وقت.")] }[k.capacityD.type];
      mount.innerHTML = card(L("Details", "التفاصيل"), KP.editBtn(), `
        <section class="stack gap-1"><h5 class="t-title" style="font-size:var(--text-body)">${L("Renew setting", "إعدادات التجديد")}</h5>${toggle("manual_renew", r.manual_renew)}${toggle("automatic_renew", r.automatic_renew)}</section>
        ${block(L("Basic information", "المعلومات الأساسية"), [[L("Age groups", "الفئات العمرية"), k.all_age_groups ? L("All age groups", "جميع الفئات العمرية") : k.age_groups.length ? k.age_groups.map((a) => badge("primary", esc(a.name))).join(" ") : `<span class="text-tertiary">${L("No age groups", "لا توجد فئات عمرية")}</span>`], [L("Gender", "الجنس"), genderTxt(k.gender)]])}
        ${block(L("Package status", "حالة الباقة"), [[L("Package approval", "اعتماد الباقة"), KP.approvalBadge(k.approval_status.value)], [L("Package status", "حالة الباقة"), KP.statusBadge(k.package_status)], [L("Last action", "آخر إجراء"), KP.actionBy(k)], k.rejection_reason ? [L("Rejection reason", "سبب الرفض"), esc(k.rejection_reason)] : null])}
        ${block(L("Availability", "الإتاحة"), [[L("Type", "النوع"), esc(k.availability.label)], k.availability.display_starts_at ? [L("Period", "الفترة"), L(`From ${k.availability.display_starts_at} to ${k.availability.display_ends_at}`, `من ${k.availability.display_starts_at} إلى ${k.availability.display_ends_at}`)] : null])}
        <section class="stack gap-3" style="padding-block:var(--space-4);border-top:var(--border-thin) dashed var(--color-border)"><h5 class="t-title" style="font-size:var(--text-body)">${L("Subscription validity", "صلاحية الاشتراك")}</h5>
          ${kv([[L("Type", "النوع"), `${esc(k.validity.label)}<div class="t-xs text-tertiary" style="font-weight:var(--weight-regular)">${expl || ""}</div>`]])}
          ${SA.table({ rows: k.planList, empty: ["No plans", "لا توجد خطط"], columns: [
            { head: ["Plan", "الخطة"], cell: (p) => esc(p.name) },
            { head: fixed ? ["Dates", "التواريخ"] : ["Duration", "المدة"], cell: (p) => (fixed ? `${p.starts_on} → ${p.ends_on}` : KP.dur(p.duration_value, p.duration_unit)) },
            { head: ["Status", "الحالة"], cell: (p) => (p.active ? badge("success", L("Active", "نشطة")) : badge("danger", L("Inactive", "غير نشطة"))) }] })}</section>
        ${block(L("Access schedule", "جدول الدخول"), [[L("Type", "النوع"), `${esc(k.access_schedule.label)}${k.access_schedule.days ? `<div class="t-xs text-tertiary" style="font-weight:var(--weight-regular)">${L("Schedule details — coming soon", "تفاصيل الجدول — قريباً")}</div>` : ""}`]])}
        ${block(L("Capacity", "السعة"), [[L("Type", "النوع"), `${capLbl[0]}${capLbl[1] ? `<div class="t-xs text-tertiary" style="font-weight:var(--weight-regular)">${capLbl[1]}</div>` : ""}`], [L("Usage", "الاستخدام"), `${k.capacityD.limit ? `${k.capacityD.used} / ${k.capacityD.limit}` : k.capacityD.used} ${k.capacityD.fully_purchased ? badge("warning", L("Fully purchased", "مكتمل الشراء")) : ""}`]])}
        ${block(L("Usage rules", "قواعد الاستخدام"), [[L("Type", "النوع"), k.usage_rules.type === "limited" ? L("Limited", "محدود") : L("Unlimited", "غير محدود")]]
          .concat(k.usage_rules.type === "limited" ? [[L("Visits", "عدد الزيارات"), k.usage_rules.limit], [L("Reset every", "إعادة الضبط كل"), { day: L("Day", "يوم"), week: L("Week", "أسبوع"), month: L("Month", "شهر") }[k.usage_rules.reset_period]]] : []))}`);
    };
    mount.onchange = (e) => {
      if (e.target.dataset.renew !== "manual_renew") return;
      /* PUT /packages/{id}/renew-setting {manual_renew} — saves on toggle */
      k.renew.manual_renew.enabled = e.target.checked;
      RD.toast("success", e.target.checked ? L("Manual renew enabled", "تم تفعيل التجديد اليدوي") : L("Manual renew disabled", "تم إيقاف التجديد اليدوي"));
    };
    paint();
  };

  /* ================= plans ================= */
  KP.tabs.plans = (mount, ctx) => {
    const k = ctx.pkg, P = k.planList;
    let f = "all";
    const fixed = k.validity.type === "fixed_date_range";
    const durTxt = (p) => { const d = fixed ? `${p.starts_on} – ${p.ends_on}` : KP.dur(p.duration_value, p.duration_unit); return p.activation_window_value ? L(`${d}, activate within ${KP.dur(p.activation_window_value, p.activation_window_unit)}`, `${d}، التفعيل خلال ${KP.dur(p.activation_window_value, p.activation_window_unit)}`) : d; };
    const paint = () => {
      const rows = P.filter((p) => f === "all" || (f === "active" ? p.active : !p.active));
      const n = P.length;
      mount.innerHTML = card(`${L("Plans", "الخطط")} <span class="t-sm text-tertiary" style="font-weight:var(--weight-regular)">${KP.plansCount(n)}</span>`, KP.editBtn("plans"),
        !n ? `<div class="stack gap-2" style="align-items:center;padding:var(--space-10)">${ic("layout")}<b>${L("No plans yet", "لا توجد خطط بعد")}</b></div>`
          : `<div class="tabs">${[["all", L("All", "الكل"), n], ["active", L("Active", "نشطة"), P.filter((p) => p.active).length], ["inactive", L("Inactive", "غير نشطة"), P.filter((p) => !p.active).length]].map(([key, t, c]) => `<button type="button" data-pf="${key}" class="${key === f ? "is-active" : ""}">${t} <span class="badge">${c}</span></button>`).join("")}</div>
          ${rows.length ? SA.table({ rows, empty: [""], columns: [
            { head: ["Name", "الاسم"], cell: (p) => `<b>${esc(p.name)}</b>` },
            { head: ["Duration", "المدة"], cell: durTxt },
            { head: ["Price", "السعر"], cell: (p) => `<b>${KP.money(p.total_price, k.currency)}</b>${p.tax_amount > 0 ? `<div class="t-xs text-tertiary">${L(`incl. tax ${fmt(p.tax_amount)}`, `شامل الضريبة ${fmt(p.tax_amount)}`)}</div>` : ""}` },
            { head: ["Subscribers", "المشتركون"], cell: (p) => `${L(`${p.subscribers.active} active`, `${p.subscribers.active} نشط`)}${p.subscribers.unpaid > 0 ? `<div class="t-xs" style="color:var(--color-warning)">${L(`${p.subscribers.unpaid} unpaid`, `${p.subscribers.unpaid} غير مدفوع`)}</div>` : ""}` },
            { head: ["Status", "الحالة"], cell: (p) => (p.active ? badge("success", L("Active", "نشطة")) : badge("", L("Inactive", "غير نشطة"))) },
            { head: ["", ""], cell: (p) => SA.iconBtn("eye", L("View plan", "عرض الخطة"), `data-plan="${p.id}"`) },
          ] }) : `<p class="text-tertiary">${L("No plans match this filter", "لا توجد خطط تطابق هذا الفلتر")}</p>`}`);
    };
    mount.addEventListener("click", (e) => {
      const pf = e.target.closest("[data-pf]"); if (pf) { f = pf.dataset.pf; return paint(); }
      const pv = e.target.closest("[data-plan]");
      if (!pv) return;
      const p = P.find((x) => String(x.id) === pv.dataset.plan);
      const sec = (t, rows) => `<h4 class="t-sm" style="font-weight:var(--weight-bold);margin-top:var(--space-3)">${t}</h4>${kv(rows)}`;
      SA.modal({ id: "kpPlan", title: `${esc(p.name)} ${p.active ? badge("success", L("Active", "نشطة")) : badge("", L("Inactive", "غير نشطة"))}`,
        body: sec(L("Price", "السعر"), p.taxes.map((t) => [esc(t.name), `${t.rate}%`]).concat([[L("Price", "السعر"), KP.money(p.price, k.currency)], [L("Tax", "الضريبة"), KP.money(p.tax_amount, k.currency)], [L("Total", "الإجمالي"), `<b>${KP.money(p.total_price, k.currency)}</b>`]]))
          + sec(L("Validity", "الصلاحية"), [[L("Duration", "المدة"), durTxt(p)], [L("Renewal", "التجديد"), p.renewal ? L("Renewal allowed", "التجديد متاح") : L("No renewal", "بدون تجديد")]])
          + sec(L("Subscribers", "المشتركون"), [[L("Active", "نشط"), p.subscribers.active], [L("Unpaid", "غير مدفوع"), p.subscribers.unpaid > 0 ? `<span style="color:var(--color-warning)">${p.subscribers.unpaid}</span>` : 0]]),
        foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button><a class="btn" href="${KP.href("subscribers", { plan: p.id })}" data-close>${L("View subscribers", "عرض المشتركين")}</a>` });
    });
    paint();
  };

  /* ================= branches ================= */
  KP.tabs.branches = (mount, ctx) => {
    const k = ctx.pkg;
    mount.innerHTML = card(L("Branches", "الفروع"), KP.editBtn("branches"), SA.table({ rows: k.branchList, empty: ["There is no data to display", "لا توجد بيانات لعرضها"], columns: [
      { head: ["Name", "الاسم"], cell: (b) => `<b>${esc(b.name)}</b>` },
      { head: ["City", "المدينة"], cell: (b) => esc(b.city || "—") },
      { head: ["Address", "العنوان"], cell: (b) => esc(b.address || "—") },
      { head: ["Status", "الحالة"], cell: (b) => (b.active ? badge("success", L("Active", "نشطة")) : badge("", L("Inactive", "غير نشطة"))) },
      { head: ["", ""], cell: (b) => (k.partnerRef ? `<a class="icon-btn" href="partner-profile.html?id=${k.partner.id}&tab=branches&branch=${b.id}" aria-label="${L("Open branch", "فتح الفرع")}" title="${L("Open branch", "فتح الفرع")}">${ic("eye")}</a>` : "") },
    ] }));
  };

  /* ================= gallery (cover first + lightbox) ================= */
  KP.tabs.gallery = (mount, ctx) => {
    const k = ctx.pkg, imgs = k.galleryList;
    mount.innerHTML = card(L("Gallery", "المعرض"), KP.editBtn("media"), imgs.length
      ? `<div class="row gap-3" style="flex-wrap:wrap">${imgs.map((g, j) => `<button type="button" class="sa-tile" data-img="${j}" title="${L("View image", "عرض الصورة")}" style="width:125px;height:125px;position:relative;padding:0">
          <div class="sa-tile__media" style="height:100%">${ic("camera")}</div>${j === 0 ? `<span class="badge" style="position:absolute;top:6px;inset-inline-start:6px;background:var(--color-text);color:var(--color-surface)">${L("Cover", "الغلاف")}</span>` : ""}</button>`).join("")}</div>`
      : `<p class="text-tertiary">${L("No images", "لا توجد صور")}</p>`);
    let cur = 0, el;
    const show = () => {
      el = SA.modal({ id: "kpLight", wide: true, title: L(`${cur + 1} of ${imgs.length}`, `${cur + 1} من ${imgs.length}`),
        body: `<div class="row gap-3" style="align-items:center">${imgs.length > 1 ? SA.iconBtn("chevronLeft", L("Previous image", "الصورة السابقة"), "data-prev") : ""}
          <div class="sa-tile__media" style="flex:1;height:min(70vh,420px);border-radius:var(--radius-lg)">${ic("camera")}<span class="t-xs">${cur === 0 ? L("Cover", "الغلاف") : L("Image", "صورة")} ${cur + 1}</span></div>
          ${imgs.length > 1 ? SA.iconBtn("chevronRight", L("Next image", "الصورة التالية"), "data-next") : ""}</div>`,
        foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button>` });
      el.querySelector(".modal__body").onclick = (e) => { if (e.target.closest("[data-prev]")) { cur = (cur - 1 + imgs.length) % imgs.length; show(); } if (e.target.closest("[data-next]")) { cur = (cur + 1) % imgs.length; show(); } };
    };
    mount.addEventListener("click", (e) => { const t = e.target.closest("[data-img]"); if (t) { cur = +t.dataset.img; show(); } });
    document.addEventListener("keydown", function nav(e) {
      if (!el || !el.classList.contains("is-open")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const dir = (e.key === "ArrowRight") !== (document.documentElement.dir === "rtl") ? 1 : -1; cur = (cur + dir + imgs.length) % imgs.length; show(); }
    });
  };
})();
