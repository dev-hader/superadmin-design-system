/* Partner profile — catalogue tabs: packages (general · age groups ·
   packages) · services (lists → services) · branches (+ branch details) ·
   units. Mirrors pages/partners/profile/{packages,services,branches,units}.
   Permissions (job keys — data-perm, demo ?perm=limited | ?perm=none):
     packages: the tab, its list and its switches are open — PERMISSIONS.PARTNERS.
       MANAGE_PACKAGES / VIEW_PARTNER_PACKAGES are "" in the dashboard (temporary); the
       switches still follow the API's can_manage (?demo=pkg-noperm) · Add age group
       add_age_groups (AgeGroupsSection) · package eye open.
     services: Add service list / Add new update_partner_services (ServicesPage /
       ServiceListServicesToolbarWrapper); row actions in sa-services.js.
     branches: list, view, translation, Edit branch, Edit location open (no key) · branch
       gallery: body view_branch_images, Upload add_branch_images, remove
       delete_branch_images, change photo update_branch_images, star open.
     units: the profile's units table eye is open (UnitsTable in partners/profile has no
       key — unlike units.html's view_unit_details). */
(function () {
  "use strict";
  const { L, esc, ic, badge, fmt } = SA;
  const { card, kv, btn, avatar, confirmDelete } = PP;
  const ok = (el, fn) => (el.querySelector("[data-ok]").onclick = fn);
  const foot = (label) => `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${label}</button>`;
  const errLine = (m) => `<span class="field__error">${ic("warn")} ${m}</span>`;
  const dash = (v) => (v == null || v === "" ? "---" : esc(v));

  /* ================= packages ================= */
  /* Demo flags (partner-profile.html?tab=packages&demo=…), off by default:
     pkg-off     packages switched off while the partner already has packages →
                 Packages stays reachable with the server's read-only banner
     pkg-noperm  settings.can_manage = false → every switch disabled + tooltip
     pkg-error   the save fails → "Could not save the change…" toast */
  const DEMO = new URLSearchParams(location.search).get("demo") || "";
  function pkgState(p) {
    if (!p._pkg) {
      const mine = HF.SA.packages.filter((x) => x.partner.id === p.id);
      p._pkg = {
        packages_enabled: DEMO === "pkg-off" ? false : mine.length > 0 || p.id % 2 === 0, online_package_payment: DEMO !== "pkg-off" && mine.length > 0,
        has_packages: mine.length > 0 || DEMO === "pkg-off", active_subscriptions: mine.reduce((a, x) => a + x.subscribers.active, 0),
        can_manage: DEMO !== "pkg-noperm",
        pending: mine.filter((x) => x.approval_status.value === "pending").length, items: mine,
        age_groups: [["Kids", 4, 12], ["Teens", 13, 17], ["Adults", 18, 59], ["Seniors", 60, 90]].map((a, i) => ({ id: 30 + i, name: a[0], starting_age: a[1], ending_age: a[2], description: `${a[0]} sessions and packages`, active: i !== 3, for_packages: i < 3 })),
      };
    }
    return p._pkg;
  }
  /* ICU plurals of PACKAGES.SUMMARY_* (en one/other · ar zero/one/two/few/many/other) */
  const arPlural = (n, f) => (n === 0 ? f[0] : n === 1 ? f[1] : n === 2 ? f[2] : n % 100 >= 3 && n % 100 <= 10 ? `${n} ${f[3]}` : n % 100 >= 11 ? `${n} ${f[4]}` : `${n} ${f[5]}`);
  const nPackages = (n) => L(`${n} package${n === 1 ? "" : "s"}`, arPlural(n, ["لا توجد باقات", "باقة واحدة", "باقتان", "باقات", "باقة", "باقة"]));
  const nActiveSubs = (n) => L(`${n} active subscriber${n === 1 ? "" : "s"}`, arPlural(n, ["لا يوجد مشتركون نشطون", "مشترك نشط واحد", "مشتركان نشطان", "مشتركين نشطين", "مشتركًا نشطًا", "مشترك نشط"]));
  const NO_PERM = () => L("You don't have permission to change package settings", "ليس لديك صلاحية لتغيير إعدادات الباقات");
  const SAVE_FAILED = () => L("Could not save the change. Please try again.", "تعذر حفظ التغيير. يرجى المحاولة مرة أخرى.");
  /* every settings / age-group save: success → apply + toast, failure → error toast */
  const save = (apply, okMsg) => {
    if (DEMO === "pkg-error") return RD.toast("error", SAVE_FAILED());
    apply();
    RD.toast("success", okMsg);
  };
  PP.tabs.packages = (mount, ctx) => {
    const p = ctx.partner, s = pkgState(p);
    let sec = ctx.params.get("sec") || "general";
    /* isPackagesSectionEnabled(): General always; the rest while packages are on;
       Packages also while off if the partner already has packages */
    const locked = (k) => k !== "general" && !s.packages_enabled && (k !== "packages" || !s.has_packages);
    if (locked(sec)) sec = "general";
    const side = () => `<nav class="sa-side__nav" aria-label="${L("Packages", "الباقات")}">${[["general", L("General", "عام")], ["age-groups", L("Age groups", "الفئات العمرية")], ["packages", `${L("Packages", "الباقات")} (${s.items.length})`]].map(([k, t]) =>
      locked(k) ? `<span class="is-locked" tabindex="0" aria-disabled="true" data-tip="${L("Enable Packages first", "قم بتفعيل الباقات أولاً")}">${t}</span>`
        : `<a href="${PP.href("packages", { sec: k })}" class="${k === sec ? "is-active" : ""}">${t}${k === "packages" && s.pending ? ` <span class="badge badge--warning">${s.pending}</span>` : ""}</a>`).join("")}</nav>`;
    const wrap = (inner) => (mount.innerHTML = `<div class="sa-side">${side()}<div class="stack gap-6">${inner}</div></div>`);
    const partnerName = esc(p.company_name);

    if (sec === "general") {
      /* a disabled switch fires no mouse events, so the reason tooltip sits on its wrapper */
      const row = (k, label, helper, reason) => `<div class="row between gap-4" style="align-items:center;padding:var(--space-4) 0;border-bottom:var(--border-thin) solid var(--color-border-subtle)">
        <div><b>${label}</b><p class="t-sm text-tertiary" style="max-width:620px;margin-top:var(--space-1)">${helper}</p></div>
        <span ${reason ? `tabindex="0" data-tip="${reason}"` : ""}><label class="switch"><input type="checkbox" data-t="${k}" ${s[k] ? "checked" : ""} ${reason ? "disabled" : ""} aria-label="${label}"><span class="switch__track"></span></label></span></div>`;
      /* "{n} packages · {n} pending review · {n} active subscribers" — pending always shown */
      const summary = [nPackages(s.items.length), L(`${s.pending} pending review`, `${s.pending} بانتظار المراجعة`), nActiveSubs(s.active_subscriptions)].join(" · ");
      const noPerm = s.can_manage ? "" : NO_PERM();
      wrap(card(L("Packages settings", "إعدادات الباقات"), "", `<p class="t-sm text-secondary">${L("Controls what this partner can do with membership packages.", "تتحكم فيما يمكن لهذا الشريك فعله بباقات العضوية.")}</p>
        <p class="t-sm text-tertiary">${summary}</p>
        <div>${row("packages_enabled", L("Packages", "الباقات"), L("Allow this partner to create and sell packages. When off, no new packages or subscriptions can be sold; existing subscriptions continue and can still be scanned.", "السماح لهذا الشريك بإنشاء الباقات وبيعها. عند الإيقاف، لا يمكن بيع باقات أو اشتراكات جديدة؛ تستمر الاشتراكات الحالية ويمكن مسحها."), noPerm)}
        ${row("online_package_payment", L("Online package payment", "الدفع الإلكتروني للباقات"), L("Allow the partner to accept online payment for packages. When off, the partner's Payment Settings > Packages falls back to Cash.", "السماح للشريك بقبول الدفع الإلكتروني للباقات. عند الإيقاف، تعود إعدادات الدفع > الباقات لدى الشريك إلى الدفع النقدي."), noPerm || (s.packages_enabled ? "" : L("Enable Packages first", "قم بتفعيل الباقات أولاً")))}</div>`));
      const disable = () => save(() => { s.packages_enabled = false; s.online_package_payment = false; }, L(`Packages disabled for ${p.company_name}`, `تم إيقاف الباقات لـ ${p.company_name}`));
      mount.onchange = (e) => {
        const k = e.target.dataset.t;
        if (!k) return;
        const on = e.target.checked;
        e.target.checked = !on; /* the switch moves only once the save succeeds */
        /* PUT /partners/{id}/packages/settings — only the changed field; saves on toggle */
        if (k === "packages_enabled" && !on && (s.has_packages || s.active_subscriptions > 0)) {
          const el = SA.modal({ id: "ppPkgOff", static: true, title: L(`Disable packages for ${partnerName}?`, `إيقاف الباقات لـ ${partnerName}؟`),
            body: `<div class="alert alert--warning"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${L(`No new packages or subscriptions can be sold. ${s.active_subscriptions} active subscriptions continue and can still be scanned.`, `لن يمكن بيع باقات أو اشتراكات جديدة. تستمر ${s.active_subscriptions} من الاشتراكات النشطة ويمكن مسحها.`)}</div></div>`,
            foot: `<button class="btn btn--ghost" data-close>${L("Keep enabled", "إبقاء التفعيل")}</button><button class="btn btn--danger" data-ok>${L("Disable", "إيقاف")}</button>` });
          ok(el, () => { SA.close(el); disable(); ctx.rerender(); });
          return;
        }
        if (k === "packages_enabled") on ? save(() => (s.packages_enabled = true), L(`Packages enabled for ${p.company_name}`, `تم تفعيل الباقات لـ ${p.company_name}`)) : disable();
        else save(() => (s.online_package_payment = on), on ? L("Online package payment enabled", "تم تفعيل الدفع الإلكتروني للباقات") : L("Online package payment disabled", "تم إيقاف الدفع الإلكتروني للباقات"));
        ctx.rerender();
      };
      return;
    }
    if (sec === "age-groups") {
      const agReason = (a) => (!s.can_manage ? NO_PERM() : !a.active ? L("Activate the age group first", "قم بتفعيل الفئة العمرية أولاً") : "");
      wrap(card(L("Age groups", "الفئات العمرية"), btn(L("Add age group", "إضافة فئة عمرية"), "plus", 'data-add data-perm="add_age_groups"', "secondary"),
        `<p class="t-sm text-secondary">${L("The partner's age groups (shared with Public Events). Switch on the groups the partner may pick when creating a package; hidden groups stay available for events.", "الفئات العمرية للشريك (مشتركة مع الفعاليات العامة). فعّل الفئات التي يمكن للشريك اختيارها عند إنشاء باقة؛ تظل الفئات المخفية متاحة للفعاليات.")}</p>
        ${SA.table({ empty: ["No data", "لا توجد بيانات"], rows: s.age_groups, columns: [
          { head: ["Image", "الصورة"], cell: (a) => `<span class="cell-thumb"${a.image ? ` style="background:url('${esc(a.image)}') center/cover no-repeat"` : ""}>${a.image ? "" : ic("users")}</span>` },
          { head: ["Name", "الاسم"], cell: (a) => `<b style="${a.active ? "" : "opacity:.5"}">${esc(a.name)}</b>` },
          { head: ["Starting age", "العمر البداية"], cell: (a) => `${a.starting_age} ${L("Year", "سنة")}` },
          { head: ["Ending age", "العمر النهاية"], cell: (a) => `${a.ending_age} ${L("Year", "سنة")}` },
          { head: ["Description", "الوصف"], cell: (a) => dash(a.description) },
          { head: ["For packages", "للباقات"], cell: (a) => { const r = agReason(a); return `<span ${r ? `tabindex="0" data-tip="${r}"` : ""} style="display:inline-block"><label class="switch"><input type="checkbox" data-ag="${a.id}" ${a.for_packages ? "checked" : ""} ${r ? "disabled" : ""}><span class="switch__track"></span>${a.for_packages ? L("Available", "متاحة") : L("Hidden", "مخفية")}</label></span>`; } },
        ] })}`) + `<p class="t-xs text-tertiary">${L("Turning a group off does not affect packages that already use it; the partner simply cannot pick it for new packages.", "إيقاف فئة لا يؤثر على الباقات التي تستخدمها بالفعل؛ لن يتمكن الشريك فقط من اختيارها للباقات الجديدة.")}</p>`);
      mount.onchange = (e) => {
        const id = e.target.dataset.ag;
        if (!id) return;
        const a = s.age_groups.find((x) => String(x.id) === id), on = e.target.checked;
        /* PUT /partners/{id}/packages/age-groups/{ageGroupId} {available} */
        save(() => (a.for_packages = on), on ? L("Age group available for packages", "الفئة العمرية متاحة للباقات") : L("Age group hidden for packages", "الفئة العمرية مخفية عن الباقات"));
        ctx.rerender();
      };
      mount.querySelector("[data-add]").onclick = () => {
        /* setup-files/age-groups/CreateModal.js (UploadCropImage 1:1, 1MB, Remove photo) */
        let image = null;
        const el = SA.modal({ id: "ppAg", title: L("Create new age group", "إنشاء فئة عمرية جديدة"),
          body: `<div class="stack gap-4">
            ${SA.field(["Image", "الصورة"], `<div data-e="image"></div><div class="row gap-3" style="align-items:center;flex-wrap:wrap"><span class="cell-thumb" data-img-prev style="width:64px;height:64px">${ic("users")}</span>
              <label class="btn btn--sm btn--secondary">${ic("upload")}<span>${L("Image", "صورة")}</span><input type="file" accept=".png,.jpg,.jpeg" style="display:none" data-img></label>
              <button type="button" class="btn btn--sm btn--ghost" data-img-rm hidden>${ic("trash")}<span>${L("Remove photo", "إزالة الصورة")}</span></button></div>`, { hint: ["Max size 1MB for images", "الحد الأقصى للصور 1 ميجابايت"] })}
            ${SA.field(["Name", "الاسم"], `<input class="input" data-f="name" placeholder="${L("Enter name", "أدخل الاسم")}"><div data-e="name"></div>`, { req: true })}
            ${SA.field(["Description", "الوصف"], `<textarea class="input" rows="3" data-f="description" placeholder="${L("Enter description", "أدخل الوصف")}"></textarea><div data-e="description"></div>`)}
            ${SA.field(["Age range", "الفئة العمرية"], `<div class="grid grid-2"><input class="input" inputmode="numeric" data-f="start" placeholder="${L("Start", "البداية")}" aria-label="${L("Starting age", "العمر البداية")}"><input class="input" inputmode="numeric" data-f="end" placeholder="${L("End", "النهاية")}" aria-label="${L("Ending age", "العمر النهاية")}"></div><div data-e="range"></div>`, { req: true })}
            ${SA.field(["Status", "الحالة"], SA.select([["", L("Select status", "اختر الحالة")], ["1", L("Active", "نشط")], ["0", L("Inactive", "غير نشط")]], 'data-f="active"') + '<div data-e="active"></div>', { req: true })}
          </div>`, foot: foot(L("Create", "إنشاء")) });
        const e = (k, m) => (el.querySelector(`[data-e="${k}"]`).innerHTML = m ? errLine(m) : "");
        const prev = el.querySelector("[data-img-prev]"), rm = el.querySelector("[data-img-rm]");
        const showImg = () => { prev.style.background = image ? `url('${image}') center/cover no-repeat` : ""; prev.innerHTML = image ? "" : ic("users"); rm.hidden = !image; };
        el.querySelector("[data-img]").onchange = (ev) => { const f = ev.target.files[0]; ev.target.value = ""; PP.pickImage(f, { ratio: 1, onError: (m) => e("image", m) }).then((u) => { if (u) { image = u; showImg(); } }); };
        rm.onclick = () => { image = null; showImg(); };
        ok(el, () => {
          const v = (k) => el.querySelector(`[data-f="${k}"]`).value.trim();
          ["name", "description", "range", "active"].forEach((k) => e(k));
          let bad = false;
          const REQ = L("This field is required", "هذا الحقل مطلوب");
          if (!v("name")) { e("name", REQ); bad = true; }
          else if (v("name").length < 2) { e("name", L("Minimum 3 symbols", "الحد الأدنى 3 رموز")); bad = true; }
          else if (v("name").length > 50) { e("name", L("Maximum 50 symbols", "50 رمزًا كحد أقصى")); bad = true; }
          if (v("description").length > 150) { e("description", L("Maximum 150 symbols", "150 رمزًا كحد أقصى")); bad = true; }
          /* starting_age / ending_age: required, digits only (/^[0-9]+$/), at most 10 characters */
          const age = (x) => (!x ? REQ : !/^[0-9]+$/.test(x) ? L("Number is not valid", "الرقم غير صحيح") : x.length > 10 ? L("Maximum 50 symbols", "50 رمزًا كحد أقصى") : "");
          const rangeErr = age(v("start")) || age(v("end"));
          if (rangeErr) { e("range", rangeErr); bad = true; }
          if (v("active") === "") { e("active", REQ); bad = true; }
          if (bad) return;
          /* POST /age-groups (FormData: name, description, starting_age, ending_age, active, image?) */
          s.age_groups.push({ id: Date.now(), image, name: v("name"), description: v("description"), starting_age: +v("start"), ending_age: +v("end"), active: v("active") === "1", for_packages: false });
          SA.close(el); ctx.rerender();
        });
      };
      return;
    }
    /* sec === packages — the global list without the Partner column/filter.
       GET /partners/{id}/packages (+ the same query) · filter options and pill
       labels: GET /partners/{id}/packages/filter-options */
    wrap(`<div id="ppPkgList"></div>`);
    const APPROVAL = { pending: ["warning", L("Pending", "قيد المراجعة")], approved: ["success", L("Approved", "مقبولة")], not_approved: ["danger", L("Not approved", "غير مقبولة")] };
    const activeGroups = (f) => ["branch_ids", "partner_status", "selling", "validity"].filter((k) => f[k] && f[k].length).length + (f.commission ? 1 : 0) + (f.created_from || f.created_to ? 1 : 0);
    /* the server's banner (data.banner) — e.g. packages switched off while the partner has packages; the list is read-only then */
    const banner = !s.packages_enabled && s.has_packages
      ? `<div class="alert alert--warning" style="margin:0 var(--space-4) var(--space-3)"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${L("Packages are turned off for this partner. Existing packages are shown read-only; no new packages or subscriptions can be sold.", "الباقات متوقفة لهذا الشريك. تُعرض الباقات الحالية للقراءة فقط؛ ولا يمكن بيع باقات أو اشتراكات جديدة.")}</div></div>` : "";
    const pctl = SA.list({
      mount: mount.querySelector("#ppPkgList"), data: s.items, sizes: [20, 50, 100], cardTitle: ["Packages", "الباقات"],
      tiles: true, banner,
      pills: [{ key: "all", label: ["All", "الكل"], icon: "package" }, { key: "pending", label: ["Pending", "قيد المراجعة"], icon: "clock", tone: "warning" }, { key: "approved", label: ["Approved", "مقبولة"], icon: "check", tone: "primary" }, { key: "not_approved", label: ["Not approved", "غير مقبولة"], icon: "close", tone: "danger" }],
      pillMatch: (r, k) => k === "all" || r.approval_status.value === k,
      search: ["Search by package name", "ابحث باسم الباقة"], searchMatch: (r, q) => r.name.toLowerCase().includes(q),
      toolbarExtra: (st) => PP.filterBtn(activeGroups(st.extra)),
      extraMatch: (r, f) =>
        (!f.branch_ids || !f.branch_ids.length || r.branches.some((b) => f.branch_ids.includes(b.name))) &&
        (!f.partner_status || !f.partner_status.length || f.partner_status.includes(r.partner_status.value)) &&
        (!f.selling || !f.selling.length || f.selling.includes(r.selling_methodology.value)) &&
        (!f.validity || !f.validity.length || f.validity.includes(r.validity.type)) &&
        (!f.created_from || r.created_at.slice(0, 10) >= f.created_from) && (!f.created_to || r.created_at.slice(0, 10) <= f.created_to),
      sorter: (a, b, k) => (k === "name" ? a.name.localeCompare(b.name) : k === "subscribers" ? a.subscribers.active - b.subscribers.active : a.approval_status.value.localeCompare(b.approval_status.value)),
      empty: (st) => (st.q || st.pill !== "all" || activeGroups(st.extra) ? L("No packages match your search.", "لا توجد باقات تطابق بحثك.") : L("This partner has no packages yet.", "لا توجد باقات لهذا الشريك بعد.")),
      columns: [
        /* partner status only when it isn't active (PackagesTable.js) */
        { head: ["Name", "الاسم"], sort: "name", cell: (r) => `<a href="package-detail.html?id=${r.id}&tab=details" style="font-weight:var(--weight-bold);color:var(--color-text)">${esc(r.name)}</a><div class="t-xs text-secondary">${r.categories.map(esc).join(" · ")}</div><div class="t-xs text-tertiary">${esc(r.created_at)}</div>${r.partner_status && r.partner_status.value !== "active" ? `<div style="margin-top:var(--space-1)">${badge("danger", r.partner_status.value === "inactive" ? L("Partner inactive", "الشريك غير نشط") : esc(r.partner_status.label || r.partner_status.value))}</div>` : ""}` },
        { head: ["Branches", "الفروع"], cell: (r) => `${esc(r.branches[0].name)}${r.branches.length > 1 ? ` <span class="badge" tabindex="0" data-tip-label="${L("Other branches", "فروع أخرى")}" data-tip="${esc(r.branches.slice(1).map((b) => b.name).join(", "))}">+${r.branches.length - 1}</span>` : ""}` },
        { head: ["Plans", "الخطط"], cell: (r) => (r.plans.single ? `1 · ${fmt(r.plans.from_price)} ${r.plans.currency}` : L(`${r.plans.count} · from ${fmt(r.plans.from_price)} ${r.plans.currency}`, `${r.plans.count} · من ${fmt(r.plans.from_price)} ${r.plans.currency}`)) },
        { head: ["Validity", "الصلاحية"], cell: (r) => `${esc(r.validity.label)}${r.validity.type === "fixed_date_range" ? `<div class="t-xs text-tertiary">${r.validity.starts_on} – ${r.validity.ends_on}</div>` : ""}` },
        { head: ["Usage", "الاستخدام"], cell: (r) => esc(r.usage.label) },
        { head: ["Capacity", "السعة"], cell: (r) => esc(r.capacity.label) },
        { head: ["Subscribers", "المشتركون"], sort: "subscribers", cell: (r) => `<b>${fmt(r.subscribers.active)}</b>${r.subscribers.amount_due > 0 ? `<div class="t-xs" style="color:var(--color-warning)">${esc(r.subscribers.amount_due_label)}</div>` : ""}` },
        { head: ["Selling methodology", "طريقة البيع"], cell: (r) => esc(r.selling_methodology.label) },
        { head: ["Status", "الحالة"], sort: "status", align: "center", cell: (r) => { const a = APPROVAL[r.approval_status.value] || ["", r.approval_status.label]; return badge(a[0], a[1]); } },
        { head: ["Actions", "الإجراءات"], align: "center", cell: (r) => `<a class="icon-btn" href="package-detail.html?id=${r.id}&tab=details" aria-label="${L("View", "عرض")} ${esc(r.name)}" data-tip="${L("View package", "عرض الباقة")}">${ic("eye")}</a>` },
      ],
    });
    /* Filter options — PackagesFilterDropdown without Partner: Branch · Partner status ·
       Selling methodology · Validity (multi) · Commission (single) · Created date From/To */
    mount.querySelector("#ppPkgList").addEventListener("click", (e) => {
      const fb = e.target.closest("[data-filter]");
      if (!fb) return;
      const branches = s.items.flatMap((x) => x.branches.map((b) => b.name)).filter((b, i, a) => a.indexOf(b) === i);
      PP.filterPop(fb, { value: pctl.state.extra, width: 340, resetApplies: true,
        fields: [
          { key: "branch_ids", label: ["Branch", "الفرع"], type: "checks", options: () => branches.map((b) => [b, b]) },
          { key: "partner_status", label: ["Partner status", "حالة الشريك"], type: "checks", options: () => [["active", L("Active", "نشط")], ["inactive", L("Partner inactive", "الشريك غير نشط")]] },
          { key: "selling", label: ["Selling methodology", "طريقة البيع"], type: "checks", options: () => HF.SA.SELL.map((x) => [x.value, x.label]) },
          { key: "validity", label: ["Validity", "الصلاحية"], type: "checks", options: () => HF.SA.VALID.map((x) => [x.type, x.label]) },
          { key: "commission", label: ["Commission", "العمولة"], options: () => [["with", L("With commission", "مع عمولة")], ["without", L("Without commission", "بدون عمولة")]] },
          { key: "created", label: ["Created date", "تاريخ الإنشاء"], type: "range" },
        ],
        onApply: (d) => { pctl.state.extra = d; pctl.state.page = 1; pctl.paint(); } });
    });
  };

  /* ================= services (lists → services) =================
     Same table, modals and rules as the global pages (assets/js/sa-services.js),
     in the dashboard's profile variant: no Company column, list search only,
     + "Add service list"; a list opens its services under the profile. */
  PP.tabs.services = (mount, ctx) => {
    const p = ctx.partner;
    const lists = HF.SA.serviceLists.filter((l) => l.partner.id === p.id);
    const listId = ctx.params.get("list");
    const svcHref = (r) => PP.href("services", { list: r.id });
    /* translation pages are global routes (/services/service-list/:id/translation, /services/:id/translation) */
    const trList = (r) => `services-translation.html?list=${r.id}`;
    if (listId) {
      const list = lists.find((l) => String(l.id) === listId) || lists[0];
      mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${L(esc(list.name) + " · Services", "الخدمات · " + esc(list.name))}</h3>
          <div class="row gap-2"><a class="btn btn--sm btn--secondary" href="${PP.href("services")}">${ic(document.documentElement.dir === "rtl" ? "chevronRight" : "chevronLeft")}<span>${L("Service Lists", "قوائم الخدمات")}</span></a>
          <button type="button" class="btn btn--sm" data-add data-perm="update_partner_services">${ic("plus")}<span>${L("Add new", "إضافة جديد")}</span></button></div></div>
        <div data-summary></div><div data-l></div>`;
      SV.services(mount.querySelector("[data-l]"), { list, partner: p, data: HF.SA.services.filter((s) => s.service_list.id === list.id),
        summary: mount.querySelector("[data-summary]"), addButton: mount.querySelector("[data-add]"), translationHref: (s) => `services-translation.html?list=${list.id}&service=${s.id}` });
      return;
    }
    mount.innerHTML = `<div class="row gap-3" style="justify-content:flex-end"><button type="button" class="btn btn--sm" data-addlist data-perm="update_partner_services">${ic("plus")}<span>${L("Add service list", "إضافة قائمة خدمات")}</span></button></div><div data-l></div>`;
    const ctl = SV.lists(mount.querySelector("[data-l]"), { data: lists, partner: p, servicesHref: svcHref, translationHref: trList });
    mount.querySelector("[data-addlist]").onclick = () => SV.addList({ partner: p }, (l) => { lists.unshift(l); ctl.paint(); });
  };

  /* ================= branches (+ details) ================= */
  function branchData(p) {
    return p.branches.map((b, i) => Object.assign(b, b._d ? {} : {
      _d: 1, description: i ? "" : `${p.company_name} flagship venue with parking and changing rooms.`, image: null,
      country: p.country, state: p.state, city: p.city, address: `${p.city.name}, ${p.state.name}, ${p.country.name}`, manual_address: i % 2 ? "" : "King Fahd Rd, Al Olaya",
      latitude: 24.7 + i / 100, longitude: 46.68 + i / 100, approved_units_count: 3 + i, not_approved_units_count: i, pending_units_count: (i + 1) % 2,
      gallery: [{ id: 1, image: null, is_image: true, main_photo: 1 }, { id: 2, image: null, is_image: true, main_photo: 0 }],
    }));
  }
  /* map stand-in (Google Map with a marker at latitude / longitude) */
  const mapTile = (b, h) => `<div class="sa-tile__media" style="height:${h}px;border-radius:var(--radius-lg)">${ic("pin")}<span class="t-xs" dir="ltr">${(+b.latitude).toFixed(4)}, ${(+b.longitude).toFixed(4)}</span></div>`;
  const stateCity = (b) => `${b.state ? esc(b.state.name) : "---"} - ${b.city ? esc(b.city.name) : "---"}`;
  PP.tabs.branches = (mount, ctx) => {
    /* BR-01 (dev 2026-11-16): branches are created on the Partner side, so the
       dashboard re-reads GET /partners/{id}/branches (same filters + page) when the
       window regains focus or the tab becomes visible again. */
    const p = ctx.partner, data = branchData(p);
    const bid = ctx.params.get("branch");
    if (bid) {
      /* GET /partners/{id}/branches/{branchId} · gallery: GET /branches/{branchId}/gallery */
      const b = data.find((x) => String(x.id) === bid) || data[0];
      const thumb = (size) => `<span class="cell-thumb" style="width:${size}px;height:${size}px${b.image ? `;background:url('${esc(b.image)}') center/cover no-repeat` : ""}">${b.image ? "" : ic("hotel")}</span>`;
      const paint = () => {
        mount.innerHTML = `
          ${card(`<span class="row gap-4" style="align-items:center">${thumb(72)}${esc(b.name || L("Branch name", "اسم الفرع"))}</span>`,
            `<a class="icon-btn" href="${PP.href("translation", { branch: b.id })}" aria-label="${L("Translation", "ترجمة")}" data-tip="${L("Translation", "ترجمة")}">${ic("globe")}</a>${SA.iconBtn("edit", L("Edit branch", "تعديل الفرع"), "data-eb")}`,
            kv([[L("ID:", "المعرف:"), b.id], [L("Description:", "الوصف:"), b.description ? esc(b.description) : "---"]]))}
          ${card(`${L("Gallery", "معرض")} (${b.gallery.length})`, `<div class="stack" data-perm="add_branch_images" style="align-items:flex-end;gap:var(--space-1)">${btn(L("Upload", "رفع"), "upload", 'data-up=""')}<span class="t-xs" style="color:var(--color-danger)">${L("Images: max size 1MB | Videos: max size 10MB", "الصور: الحد الأقصى 1 ميجابايت | الفيديوهات: الحد الأقصى 10 ميجابايت")}</span></div>`,
            !RD.can("view_branch_images") ? RD.noPermission()
            : b.gallery.length ? PP.galleryTiles(b.gallery, { del: "delete_branch_images", upd: "update_branch_images" })
              : `<p class="text-tertiary">${L("No photo has been added, you can upload photos by pressing the upload button", "لم يتم إضافة أي صورة، يمكنك رفع الصور بالضغط على زر الرفع")}</p>`)}
          ${card(L("Location", "الموقع"), SA.iconBtn("edit", L("Edit location", "تعديل الموقع"), "data-el"), kv([[L("Country:", "البلد:"), esc(b.country.name)], [L("State:", "الولاية:"), esc(b.state.name)], [L("City:", "المدينة:"), esc(b.city.name)], [L("Address:", "العنوان:"), dash(b.address)], [L("Street and district:", "الشارع والحي:"), dash(b.manual_address)]])
            + `<div><b class="t-sm">${L("Map:", "الخريطة:")}</b><div style="margin-top:var(--space-2)">${mapTile(b, 260)}</div></div>`)}`;
      };
      mount.addEventListener("click", (e) => {
        const gd = e.target.closest("[data-del]"), gm = e.target.closest("[data-main]"), gu = e.target.closest("[data-up]");
        /* DELETE /branches/{branchId}/gallery/{photoId} */
        if (gd) confirmDelete(L("Delete item", "حذف العنصر"), L("Please confirm that you want to delete this item", "يرجى تأكيد أنك تريد حذف هذا العنصر"), () => { b.gallery = b.gallery.filter((x) => String(x.id) !== gd.dataset.del); paint(); });
        /* PUT /branches/{branchId}/gallery/{photoId}/set-as-main */
        if (gm) { b.gallery.forEach((x) => (x.main_photo = String(x.id) === gm.dataset.main ? 1 : 0)); paint(); }
        /* upload (crop 1.415:1 for images): POST /branches/{branchId}/gallery · edit: POST /branches/{branchId}/gallery/{photoId} (_method=put) */
        if (gu) PP.galleryUpload((f) => {
          if (gu.dataset.up === "") b.gallery.push({ id: Date.now(), image: f.image, is_image: f.is_image, main_photo: 0 });
          else Object.assign(b.gallery.find((x) => String(x.id) === gu.dataset.up) || {}, f);
          paint();
        });
        if (e.target.closest("[data-eb]")) {
          /* UploadCropImage (1:1, 1MB on pick) */
          let photo = b.image;
          const el = SA.modal({ id: "ppEb", title: L("Edit branch", "تعديل الفرع"), body: `<div class="stack gap-4">
            ${SA.field(["Photo", "الصورة"], `<div data-e="img"></div><div class="row gap-3" style="align-items:center;flex-wrap:wrap"><span class="cell-thumb" data-img-prev style="width:64px;height:64px">${ic("hotel")}</span>
              <label class="btn btn--sm btn--secondary">${ic("upload")}<span>${L("Photo", "الصورة")}</span><input type="file" accept=".png,.jpg,.jpeg" style="display:none" data-img></label></div>`, { hint: ["Max size 1MB for images", "الحد الأقصى للصور 1 ميجابايت"] })}
            ${SA.field(["Name", "الاسم"], `<input class="input" data-f="name" value="${esc(b.name)}"><div data-e="name"></div>`)}
            ${SA.field(["Description", "الوصف"], `<textarea class="input" rows="3" data-f="d">${esc(b.description)}</textarea>`)}</div>`, foot: foot(L("Update", "تحديث")) });
          const prev = el.querySelector("[data-img-prev]");
          const showImg = () => { prev.style.background = photo ? `url('${photo}') center/cover no-repeat` : ""; prev.innerHTML = photo ? "" : ic("hotel"); };
          showImg();
          el.querySelector("[data-img]").onchange = (ev) => { const f = ev.target.files[0]; ev.target.value = "";
            PP.pickImage(f, { ratio: 1, onError: (m) => (el.querySelector('[data-e="img"]').innerHTML = m ? errLine(m) : "") }).then((u) => { if (u) { photo = u; showImg(); } }); };
          ok(el, () => {
            const n = el.querySelector('[data-f="name"]').value.trim();
            if (n.length < 3) return (el.querySelector('[data-e="name"]').innerHTML = errLine(L("Name is required and should be at least 3 characters long", "الاسم مطلوب ويجب ألا يقل عن 3 أحرف")));
            /* POST /partners/{id}/branches/{branchId} (_method=put): name, description, image? + the location fields */
            b.name = n; b.description = el.querySelector('[data-f="d"]').value; b.image = photo; SA.close(el); paint();
          });
        }
        if (e.target.closest("[data-el]")) {
          const G = HF.SA.GEO.filter((g) => g.country.iso === b.country.iso);
          let st = String(b.state.id), ci = String(b.city.id);
          /* State / City are disabled while their list has no options (beside "All") */
          const geo = () => {
            const states = G.map((g) => g.state).filter((s, i, a) => a.findIndex((y) => y.id === s.id) === i);
            const cities = G.filter((g) => String(g.state.id) === st).map((g) => g.city);
            return `${SA.field(["State:", "الولاية:"], SA.select([["", L("Select state", "اختر الولاية")]].concat(states.map((s) => [s.id, s.name, String(s.id) === st])), `data-g="state" ${states.length ? "" : "disabled"}`))}${SA.field(["City:", "المدينة:"], SA.select([["", L("Select city", "اختر المدينة")]].concat(cities.map((c) => [c.id, c.name, String(c.id) === ci])), `data-g="city" ${cities.length ? "" : "disabled"}`))}`;
          };
          const el = SA.modal({ id: "ppElc", wide: true, title: L("Edit location", "تعديل الموقع"), body: `<div class="stack gap-4">
            ${SA.field(["Country", "البلد"], SA.select([[b.country.iso, b.country.name, true]], "disabled"))}
            <div class="grid grid-2" data-geo>${geo()}</div>
            ${SA.field(["Street and district:", "الشارع والحي:"], `<input class="input" data-f="m" value="${esc(b.manual_address)}">`)}
            ${SA.field(["Search for address", "البحث عن العنوان"], `<div class="input-wrap"><span class="input-wrap__icon">${ic("search")}</span><input class="input" data-f="addr" value="${esc(b.address)}" placeholder="${L("Search location", "ابحث عن الموقع")}"></div>`)}
            ${mapTile(b, 260)}</div>`, foot: foot(L("Update", "تحديث")) });
          el.querySelector("[data-geo]").onchange = (ev) => { if (ev.target.dataset.g === "state") { st = ev.target.value; ci = ""; el.querySelector("[data-geo]").innerHTML = geo(); } if (ev.target.dataset.g === "city") ci = ev.target.value; };
          ok(el, () => {
            /* POST /partners/{id}/branches/{branchId} (multipart, _method=put): name, description,
               country_iso, state_id, city_id, latitude, longitude (map marker),
               address[en] + address[ar] (the searched address), manual_address, image? */
            const g = HF.SA.GEO.find((x) => String(x.city.id) === ci) || HF.SA.GEO.find((x) => String(x.state.id) === st);
            if (g) { b.state = g.state; if (ci) b.city = g.city; }
            b.manual_address = el.querySelector('[data-f="m"]').value;
            b.address = el.querySelector('[data-f="addr"]').value || b.address;
            SA.close(el); paint();
          });
        }
      });
      paint();
      return;
    }
    /* Redesign (2026-11-17): a card per branch instead of a table with expandable
       rows — what the expand used to hide (description, address, street, map) is on
       the card, with the approved / pending / not-approved unit counts. Same
       search, same location filter, same view + translation links, 15 per page. */
    const ctl = { state: { q: "", extra: {}, page: 1, limit: 15 }, paint: null };
    const unitStat = (label, n, tone) => `<div class="stack" style="gap:2px;min-width:0"><b style="font-variant-numeric:tabular-nums;font-size:var(--text-title)">${n}</b>
        <span class="t-xs" style="display:inline-flex;align-items:center;gap:6px;color:var(--color-text-tertiary);white-space:nowrap"><span style="width:8px;height:8px;border-radius:var(--radius-full);background:var(--color-${tone})"></span>${label}</span></div>`;
    const branchCard = (r) => `<article class="card card--pad stack gap-4" style="min-width:0">
        <div class="row gap-3" style="align-items:center">
          <span class="cell-thumb" style="width:44px;height:44px${r.image ? `;background:url('${esc(r.image)}') center/cover no-repeat` : ""}">${r.image ? "" : ic("hotel")}</span>
          <div style="min-width:0;flex:1"><b style="display:block">${esc(r.name)}</b><span class="t-xs text-tertiary">#${r.id} · ${stateCity(r)}</span></div>
          <a class="icon-btn" href="${PP.href("translation", { branch: r.id })}" aria-label="${L("Translation", "ترجمة")} ${esc(r.name)}" data-tip="${L("Translation", "ترجمة")}">${ic("globe")}</a>
          <a class="icon-btn" href="${PP.href("branches", { branch: r.id })}" aria-label="${L("View", "عرض")} ${esc(r.name)}" data-tip="${L("View", "عرض")}">${ic("eye")}</a>
        </div>
        <p class="t-sm text-secondary" style="margin:0">${r.description ? esc(r.description) : L("No description available.", "لا يوجد وصف متاح.")}</p>
        <div class="stack gap-1 t-xs text-tertiary">
          <span style="display:inline-flex;gap:6px;align-items:flex-start">${ic("pin")}<span>${r.address ? esc(r.address) : L("No address available.", "لا يوجد عنوان متاح.")}</span></span>
          <span>${L("Street and district:", "الشارع والحي:")} ${r.manual_address ? esc(r.manual_address) : L("No data", "لا توجد بيانات")}</span>
        </div>
        <div class="stack gap-1"><span class="t-xs text-tertiary">${L("Location", "الموقع")}:</span>${mapTile(r, 120)}</div>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--color-border-subtle)">
          ${unitStat(L("Approved", "معتمد"), r.approved_units_count, "success")}${unitStat(L("Pending", "معلق"), r.pending_units_count, "warning")}${unitStat(L("Not approved", "غير معتمد"), r.not_approved_units_count, "danger")}
        </div>
      </article>`;
    ctl.paint = () => {
      const st = ctl.state, f = st.extra, q = st.q.toLowerCase();
      const rows = data.filter((r) => (!q || r.name.toLowerCase().includes(q)) && (!f.country || r.country.iso === f.country) && (!f.state || String(r.state.id) === f.state) && (!f.city || String(r.city.id) === f.city));
      const pages = Math.max(1, Math.ceil(rows.length / st.limit));
      if (st.page > pages) st.page = pages;
      const slice = rows.slice((st.page - 1) * st.limit, st.page * st.limit);
      const hadFocus = document.activeElement && mount.contains(document.activeElement) && document.activeElement.matches("[data-search]");
      const active = ["country", "state", "city"].filter((k) => f[k]).length;
      mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap">
          <h3 class="t-title">${L("Branches", "الفروع")} <span class="badge">${data.length}</span></h3>
          <div class="row gap-2" style="align-items:center;flex-wrap:wrap">${SA.search(["Search by branch name", "البحث باسم الفرع"], st.q)}${PP.filterBtn(active)}</div>
        </div>
        ${slice.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,400px),1fr));gap:var(--space-4)">${slice.map(branchCard).join("")}</div>
          <div class="card" style="overflow:hidden">${SA.pager({ page: st.page, limit: st.limit, total: rows.length })}</div>`
          : `<div class="card card--pad text-tertiary" style="text-align:center">${L("There is no data to display", "لا توجد بيانات لعرضها")}</div>`}`;
      if (hadFocus) { const i = mount.querySelector("[data-search]"); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
    };
    mount.addEventListener("input", (e) => { if (e.target.matches("[data-search]")) { ctl.state.q = e.target.value; ctl.state.page = 1; ctl.paint(); } });
    mount.addEventListener("change", (e) => { if (e.target.matches("[data-limit]")) { ctl.state.limit = +e.target.value; ctl.state.page = 1; ctl.paint(); } });
    ctl.paint();
    mount.addEventListener("click", (e) => {
      const pg = e.target.closest("[data-page]");
      if (pg && !pg.disabled) { ctl.state.page = +pg.dataset.page; return ctl.paint(); }
      const fb = e.target.closest("[data-filter]");
      if (fb) {
        const G = HF.SA.GEO, uniq = (a, k) => a.filter((x, i) => a.findIndex((y) => k(y) === k(x)) === i);
        PP.filterPop(fb, { value: ctl.state.extra, cascade: { country: ["state", "city"], state: ["city"] },
          fields: [
            { key: "country", label: ["Country", "البلد"], placeholder: ["Select country", "اختر البلد"], options: () => uniq(G.map((g) => g.country), (c) => c.iso).map((c) => [c.iso, c.name]) },
            { key: "state", label: ["State:", "الولاية:"], placeholder: ["Select state", "اختر الولاية"], disabled: (d) => !d.country, options: (d) => uniq(G.filter((g) => g.country.iso === d.country).map((g) => g.state), (s) => s.id).map((s) => [s.id, s.name]) },
            { key: "city", label: ["City:", "المدينة:"], placeholder: ["Select city", "اختر المدينة"], disabled: (d) => !d.state, options: (d) => G.filter((g) => String(g.state.id) === d.state).map((g) => [g.city.id, g.city.name]) },
          ],
          onApply: (d) => { ctl.state.extra = d; ctl.state.page = 1; ctl.paint(); } });
      }
    });
  };

  /* ================= units ================= */
  PP.tabs.units = (mount, ctx) => {
    const p = ctx.partner;
    const data = HF.SA.units.filter((u) => u.partner.id === p.id).map((u, i) => Object.assign(u, { branch: u.branch || (p.branches[i % p.branches.length] || {}).name }));
    const tone = (v) => (v === "waiting" || v === "pending" ? "warning" : v === "active" ? "primary" : "danger");
    /* UnitsTable.js: both statuses show the server's label (status.lable / ownappactive.lable);
       HighFive status tone by label (pending warning · approved primary · else danger),
       partner app status tone by value (pending warning · active primary · else danger) */
    const srvLbl = (x) => { const k = String((x && x.lable) || "").toLowerCase(); return ({ pending: L("Pending", "معلق"), approved: L("Approved", "معتمد"), "not approved": L("Not approved", "غير معتمد"), active: L("Active", "نشط"), inactive: L("Inactive", "غير نشط") })[k] || ((x && x.lable) ? esc(x.lable) : "---"); };
    const hfTone = (x) => { const k = String((x && x.lable) || "").toLowerCase(); return k === "pending" ? "warning" : k === "approved" ? "primary" : "danger"; };
    /* Redesign (2026-11-17): status pills → stat tiles with counts; category ·
       activity, type · capacity and the two statuses each share one column.
       Same search, same filter popover, same view link. */
    let tile = "all";
    const TILES = [["all", ["All", "الكل"], "box", ""], ["waiting", ["Pending", "معلق"], "clock", "warning"], ["active", ["Approved", "معتمد"], "check", "primary"], ["inactive", ["Not Approved", "غير معتمد"], "close", "danger"]];
    const paintTiles = () => (mount.querySelector("[data-tiles]").innerHTML = PP.tiles(TILES.map(([key, label, icon, tn]) => ({ key, label, icon, tone: tn, count: key === "all" ? data.length : data.filter((r) => r.status.value === key).length })), tile));
    mount.innerHTML = `<h3 class="t-title">${L("Units", "الوحدات")}</h3><div data-tiles></div><div id="ppUnits"></div>`;
    paintTiles();
    const uctl = SA.list({ mount: mount.querySelector("#ppUnits"), data,
      search: ["Search by unit name", "البحث باسم الوحدة"], searchMatch: (r, q) => r.name.toLowerCase().includes(q),
      toolbarExtra: PP.filterBtn(),
      extraMatch: (r, f) => (tile === "all" || r.status.value === tile) && (!f.category || String(r.activity_category.id) === f.category) && (!f.activity || r.activity.name === f.activity) && (!f.type || r.type.name === f.type) && (!f.capacity || r.capacity === f.capacity) && (!f.availability || r.availability.toLowerCase() === f.availability),
      empty: ["There is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["Name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b> ${r.attendance_type === "online" ? badge("primary", L("Online", "عبر الإنترنت")) : ""}<div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { head: ["Branch", "الفرع"], cell: (r) => dash(r.branch) },
        { head: ["Activity", "النشاط"], cell: (r) => `${esc(r.activity.name)}<div class="t-xs text-tertiary">${esc(r.activity_category.name)}</div>` },
        { head: ["Type", "النوع"], cell: (r) => `${esc(r.type.name)}<div class="t-xs text-tertiary">${L("Capacity", "القدرة")} ${esc(r.capacity)}</div>` },
        { head: ["Booking methodology", "منهجية الحجز"], cell: (r) => esc(PP.cap(r.booking_methodology)) },
        { head: ["Availability", "التوفر"], cell: (r) => `<span style="color:${r.availability === "Available" ? "var(--color-info)" : "var(--color-danger)"};font-weight:var(--weight-semibold)">${esc(r.availability)}</span>` },
        { head: ["Status", "الحالة"], cell: (r) => `<div class="stack gap-1" style="align-items:flex-start"><span class="t-xs text-tertiary">${L("HighFive status", "حالة هاي فايف")}</span>${badge(hfTone(r.status), srvLbl(r.status))}<span class="t-xs text-tertiary">${L("Partner app status", "حالة تطبيق الشريك")}</span>${p.is_independent && r.ownappactive ? badge(tone(r.ownappactive.value), srvLbl(r.ownappactive)) : "---"}</div>` },
        { head: ["Actions", "الإجراءات"], cell: (r) => `<a class="icon-btn" href="unit-profile.html?id=${r.id}&tab=details" aria-label="${L("View", "عرض")}">${ic("eye")}</a>` },
      ] });
    mount.addEventListener("click", (e) => {
      const t = e.target.closest("[data-tile]");
      if (t) { tile = t.dataset.tile === tile && tile !== "all" ? "all" : t.dataset.tile; uctl.state.page = 1; paintTiles(); return uctl.paint(); }
      const fb = e.target.closest("[data-filter]");
      if (!fb) return;
      PP.filterPop(fb, { value: uctl.state.extra, cascade: { category: ["activity"] },
        fields: [
          { key: "category", label: ["Category :", "الفئة:"], placeholder: ["Select category", "اختر الفئة"], options: () => HF.SA.CATS.map((c) => [c.id, c.name]) },
          { key: "activity", label: ["Activity:", "النشاط:"], placeholder: ["Select state", "اختر الولاية"], options: (d) => (d.category ? HF.SA.ACTS[d.category] : []).map((a) => [a, a]) },
          { key: "type", label: ["Type:", "النوع:"], placeholder: ["Select state", "اختر الولاية"], options: () => HF.SA.TYPES.map((t) => [t, t]) },
          { key: "capacity", label: ["Capacity:", "السعة:"], placeholder: ["Select state", "اختر الولاية"], options: () => HF.SA.CAPS.map((c) => [c, c]) },
          { key: "availability", label: ["Availability:", "التوفر:"], placeholder: ["Select state", "اختر الولاية"], options: () => [["available", L("Available", "متاح")], ["maintenance", L("Maintenance", "صيانة")]] },
        ],
        onApply: (d) => { uctl.state.extra = d; uctl.state.page = 1; uctl.paint(); } });
    });
  };
})();
