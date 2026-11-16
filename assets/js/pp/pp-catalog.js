/* Partner profile — catalogue tabs: packages (general · age groups ·
   packages) · services (lists → services) · branches (+ branch details) ·
   units. Mirrors pages/partners/profile/{packages,services,branches,units}. */
(function () {
  "use strict";
  const { L, esc, ic, badge, fmt } = SA;
  const { card, kv, btn, avatar, confirmDelete } = PP;
  const ok = (el, fn) => (el.querySelector("[data-ok]").onclick = fn);
  const foot = (label) => `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${label}</button>`;
  const errLine = (m) => `<span class="field__error">${ic("warn")} ${m}</span>`;
  const dash = (v) => (v == null || v === "" ? "---" : esc(v));

  /* ================= packages ================= */
  function pkgState(p) {
    if (!p._pkg) {
      const mine = HF.SA.packages.filter((x) => x.partner.id === p.id);
      p._pkg = {
        packages_enabled: mine.length > 0 || p.id % 2 === 0, online_package_payment: mine.length > 0,
        has_packages: mine.length > 0, active_subscriptions: mine.reduce((a, x) => a + x.subscribers.active, 0),
        pending: mine.filter((x) => x.approval_status.value === "pending").length, items: mine,
        age_groups: [["Kids", 4, 12], ["Teens", 13, 17], ["Adults", 18, 59], ["Seniors", 60, 90]].map((a, i) => ({ id: 30 + i, name: a[0], starting_age: a[1], ending_age: a[2], description: `${a[0]} sessions and packages`, active: i !== 3, for_packages: i < 3 })),
      };
    }
    return p._pkg;
  }
  PP.tabs.packages = (mount, ctx) => {
    const p = ctx.partner, s = pkgState(p);
    let sec = ctx.params.get("sec") || "general";
    const locked = (k) => !s.packages_enabled && (k !== "packages" || !s.has_packages);
    if (locked(sec)) sec = "general";
    const side = () => `<nav class="sa-side__nav" aria-label="${L("Packages", "الباقات")}">${[["general", L("general", "عام")], ["age-groups", L("age groups", "الفئات العمرية")], ["packages", `${L("Packages", "الباقات")} (${s.items.length})`]].map(([k, t]) =>
      locked(k) ? `<span class="is-locked" title="${L("Enable Packages first", "قم بتفعيل الباقات أولاً")}">${t}</span>`
        : `<a href="${PP.href("packages", { sec: k })}" class="${k === sec ? "is-active" : ""}">${t}${k === "packages" && s.pending ? ` <span class="badge badge--warning">${s.pending}</span>` : ""}</a>`).join("")}</nav>`;
    const wrap = (inner) => (mount.innerHTML = `<div class="sa-side">${side()}<div class="stack gap-6">${inner}</div></div>`);
    const partnerName = esc(p.company_name);

    if (sec === "general") {
      const row = (k, label, helper, disabled, tip) => `<div class="row between gap-4" style="align-items:center;padding:var(--space-4) 0;border-bottom:var(--border-thin) solid var(--color-border-subtle)">
        <div><b>${label}</b><p class="t-sm text-tertiary" style="max-width:620px;margin-top:var(--space-1)">${helper}</p></div>
        <label class="switch" ${disabled ? `title="${tip}"` : ""}><input type="checkbox" data-t="${k}" ${s[k] ? "checked" : ""} ${disabled ? "disabled" : ""} aria-label="${label}"><span class="switch__track"></span></label></div>`;
      const summary = [L(`${s.items.length} package${s.items.length === 1 ? "" : "s"}`, `${s.items.length} باقة`), s.pending ? L(`${s.pending} pending review`, `${s.pending} بانتظار المراجعة`) : "", L(`${s.active_subscriptions} active subscribers`, `${s.active_subscriptions} مشترك نشط`)].filter(Boolean).join(" · ");
      wrap(card(L("Packages Settings", "إعدادات الباقات"), "", `<p class="t-sm text-secondary">${L("Controls what this partner can do with membership packages.", "تتحكم فيما يمكن لهذا الشريك فعله بباقات العضوية.")}</p>
        <p class="t-sm text-tertiary">${summary}</p>
        <div>${row("packages_enabled", L("Packages", "الباقات"), L("Allow this partner to create and sell packages. When off, no new packages or subscriptions can be sold; existing subscriptions continue and can still be scanned.", "السماح لهذا الشريك بإنشاء الباقات وبيعها. عند الإيقاف، لا يمكن بيع باقات أو اشتراكات جديدة؛ تستمر الاشتراكات الحالية ويمكن مسحها."))}
        ${row("online_package_payment", L("Online Package Payment", "الدفع الإلكتروني للباقات"), L("Allow the partner to accept online payment for packages. When off, the partner's Payment Settings > Packages falls back to Cash.", "السماح للشريك بقبول الدفع الإلكتروني للباقات. عند الإيقاف، تعود إعدادات الدفع > الباقات لدى الشريك إلى الدفع النقدي."), !s.packages_enabled, L("Enable Packages first", "قم بتفعيل الباقات أولاً"))}</div>`));
      mount.onchange = (e) => {
        const k = e.target.dataset.t;
        if (!k) return;
        /* PUT /partners/{id}/packages/settings — only the changed field; saves on toggle */
        if (k === "packages_enabled" && !e.target.checked && (s.has_packages || s.active_subscriptions > 0)) {
          e.target.checked = true;
          const el = SA.modal({ id: "ppPkgOff", title: L(`Disable packages for ${partnerName}?`, `إيقاف الباقات لـ ${partnerName}؟`),
            body: `<div class="alert alert--warning"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${L(`No new packages or subscriptions can be sold. ${s.active_subscriptions} active subscriptions continue and can still be scanned.`, `لن يمكن بيع باقات أو اشتراكات جديدة. تستمر ${s.active_subscriptions} من الاشتراكات النشطة ويمكن مسحها.`)}</div></div>`,
            foot: `<button class="btn btn--ghost" data-close>${L("Keep enabled", "إبقاء التفعيل")}</button><button class="btn btn--danger" data-ok>${L("Disable", "إيقاف")}</button>` });
          ok(el, () => { s.packages_enabled = false; s.online_package_payment = false; SA.close(el); ctx.rerender(); });
          return;
        }
        s[k] = e.target.checked;
        if (k === "packages_enabled" && !s[k]) s.online_package_payment = false;
        ctx.rerender();
      };
      return;
    }
    if (sec === "age-groups") {
      wrap(card(L("age groups", "الفئات العمرية"), btn(L("Add age group", "إضافة فئة عمرية"), "plus", "data-add", "secondary"),
        `<p class="t-sm text-secondary">${L("The partner's age groups (shared with Public Events). Switch on the groups the partner may pick when creating a package; hidden groups stay available for events.", "الفئات العمرية للشريك (مشتركة مع الفعاليات العامة). فعّل الفئات التي يمكن للشريك اختيارها عند إنشاء باقة؛ تظل الفئات المخفية متاحة للفعاليات.")}</p>
        ${SA.table({ empty: ["no data", "لا توجد بيانات"], rows: s.age_groups, columns: [
          { head: ["Image", "الصورة"], cell: () => `<span class="cell-thumb">${ic("users")}</span>` },
          { head: ["name", "الاسم"], cell: (a) => `<b style="${a.active ? "" : "opacity:.5"}">${esc(a.name)}</b>` },
          { head: ["starting age", "العمر البداية"], cell: (a) => `${a.starting_age} ${L("year", "سنة")}` },
          { head: ["ending age", "العمر النهاية"], cell: (a) => `${a.ending_age} ${L("year", "سنة")}` },
          { head: ["description", "الوصف"], cell: (a) => esc(a.description) },
          { head: ["For packages", "للباقات"], cell: (a) => `<label class="switch" ${a.active ? "" : `title="${L("Activate the age group first", "قم بتفعيل الفئة العمرية أولاً")}"`}><input type="checkbox" data-ag="${a.id}" ${a.for_packages ? "checked" : ""} ${a.active ? "" : "disabled"}><span class="switch__track"></span>${a.for_packages ? L("Available", "متاحة") : L("Hidden", "مخفية")}</label>` },
        ] })}`) + `<p class="t-xs text-tertiary">${L("Turning a group off does not affect packages that already use it; the partner simply cannot pick it for new packages.", "إيقاف فئة لا يؤثر على الباقات التي تستخدمها بالفعل؛ لن يتمكن الشريك فقط من اختيارها للباقات الجديدة.")}</p>`);
      mount.onchange = (e) => { const id = e.target.dataset.ag; if (!id) return; /* PUT …/packages/age-groups/{id} {available} */ s.age_groups.find((a) => String(a.id) === id).for_packages = e.target.checked; ctx.rerender(); };
      mount.querySelector("[data-add]").onclick = () => {
        const el = SA.modal({ id: "ppAg", title: L("create new age group", "إنشاء فئة عمرية جديدة"),
          body: `<div class="stack gap-4">
            ${SA.field(["image:", "image:"], `<label class="btn btn--sm btn--secondary" style="align-self:flex-start">${ic("upload")}<span>${L("Image", "صورة")}</span><input type="file" accept=".png,.jpg,.jpeg" style="display:none"></label>`)}
            ${SA.field(["name", "الاسم"], `<input class="input" data-f="name" placeholder="${L("enter name", "أدخل الاسم")}"><div data-e="name"></div>`, { req: true })}
            ${SA.field(["description", "الوصف"], `<input class="input" data-f="description" placeholder="${L("enter description", "أدخل الوصف")}">`)}
            ${SA.field(["age range", "الفئة العمرية"], `<div class="grid grid-2"><input class="input" type="number" min="1" data-f="start" placeholder="${L("start", "البداية")}"><input class="input" type="number" min="1" data-f="end" placeholder="${L("end", "النهاية")}"></div><div data-e="range"></div>`, { req: true })}
            ${SA.field(["status", "الحالة"], SA.select([["", L("select status", "اختر الحالة")], ["1", L("active", "نشط")], ["0", L("inactive", "غير نشط")]], 'data-f="active"') + '<div data-e="active"></div>', { req: true })}
          </div>`, foot: foot(L("create", "إنشاء")) });
        ok(el, () => {
          const v = (k) => el.querySelector(`[data-f="${k}"]`).value.trim();
          const e = (k, m) => (el.querySelector(`[data-e="${k}"]`).innerHTML = m ? errLine(m) : "");
          ["name", "range", "active"].forEach((k) => e(k));
          let bad = false;
          if (!v("name")) { e("name", L("this field is required", "هذا الحقل مطلوب")); bad = true; } else if (v("name").length < 2) { e("name", L("Minimum 3 symbols", "الحد الأدنى 3 رموز")); bad = true; }
          if (!v("start") || !v("end")) { e("range", L("this field is required", "هذا الحقل مطلوب")); bad = true; }
          if (v("active") === "") { e("active", L("this field is required", "هذا الحقل مطلوب")); bad = true; }
          if (bad) return;
          /* POST /age-groups (FormData) */
          s.age_groups.push({ id: Date.now(), name: v("name"), description: v("description"), starting_age: +v("start"), ending_age: +v("end"), active: v("active") === "1", for_packages: false });
          SA.close(el); ctx.rerender();
        });
      };
      return;
    }
    /* sec === packages — the global list without the Partner column/filter */
    wrap(`<div id="ppPkgList"></div>`);
    const APPROVAL = { pending: ["warning", L("Pending", "قيد المراجعة")], approved: ["success", L("Approved", "مقبولة")], not_approved: ["danger", L("Not Approved", "غير مقبولة")] };
    SA.list({
      mount: mount.querySelector("#ppPkgList"), data: s.items, sizes: [20, 50, 100], cardTitle: ["Packages", "الباقات"],
      pills: [{ key: "all", label: ["All", "الكل"] }, { key: "pending", label: ["Pending", "قيد المراجعة"] }, { key: "approved", label: ["Approved", "مقبولة"] }, { key: "not_approved", label: ["Not Approved", "غير مقبولة"] }],
      pillMatch: (r, k) => k === "all" || r.approval_status.value === k,
      search: ["Search by package name", "ابحث باسم الباقة"], searchMatch: (r, q) => r.name.toLowerCase().includes(q),
      sorter: (a, b, k) => (k === "name" ? a.name.localeCompare(b.name) : k === "subscribers" ? a.subscribers.active - b.subscribers.active : a.approval_status.value.localeCompare(b.approval_status.value)),
      empty: (st) => (st.q || st.pill !== "all" ? L("No packages match your search.", "لا توجد باقات تطابق بحثك.") : L("This partner has no packages yet.", "لا توجد باقات لهذا الشريك بعد.")),
      columns: [
        { head: ["Name", "الاسم"], sort: "name", cell: (r) => `<a href="package-detail.html?id=${r.id}&tab=details" style="font-weight:var(--weight-bold);color:var(--color-text)">${esc(r.name)}</a><div class="t-xs text-secondary">${r.categories.map(esc).join(" · ")}</div><div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { head: ["Branches", "الفروع"], cell: (r) => `${esc(r.branches[0].name)}${r.branches.length > 1 ? ` <span class="badge" title="${esc(r.branches.slice(1).map((b) => b.name).join(", "))}">+${r.branches.length - 1}</span>` : ""}` },
        { head: ["Plans", "الخطط"], cell: (r) => (r.plans.single ? `1 · ${fmt(r.plans.from_price)} ${r.plans.currency}` : L(`${r.plans.count} · from ${fmt(r.plans.from_price)} ${r.plans.currency}`, `${r.plans.count} · من ${fmt(r.plans.from_price)} ${r.plans.currency}`)) },
        { head: ["Validity", "الصلاحية"], cell: (r) => `${esc(r.validity.label)}${r.validity.type === "fixed_date_range" ? `<div class="t-xs text-tertiary">${r.validity.starts_on} – ${r.validity.ends_on}</div>` : ""}` },
        { head: ["Usage", "الاستخدام"], cell: (r) => esc(r.usage.label) },
        { head: ["Capacity", "السعة"], cell: (r) => esc(r.capacity.label) },
        { head: ["Subscribers", "المشتركون"], sort: "subscribers", cell: (r) => `<b>${fmt(r.subscribers.active)}</b>${r.subscribers.amount_due > 0 ? `<div class="t-xs" style="color:var(--color-warning)">${esc(r.subscribers.amount_due_label)}</div>` : ""}` },
        { head: ["Selling Methodology", "طريقة البيع"], cell: (r) => esc(r.selling_methodology.label) },
        { head: ["Status", "الحالة"], sort: "status", align: "center", cell: (r) => { const a = APPROVAL[r.approval_status.value] || ["", r.approval_status.label]; return badge(a[0], a[1]); } },
        { head: ["Actions", "الإجراءات"], align: "center", cell: (r) => `<a class="icon-btn" href="package-detail.html?id=${r.id}&tab=details" aria-label="${L("View", "عرض")} ${esc(r.name)}" title="${L("View", "عرض")}">${ic("eye")}</a>` },
      ],
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
    const trList = (r) => PP.href("translation", { list: r.id });
    if (listId) {
      const list = lists.find((l) => String(l.id) === listId) || lists[0];
      mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${L(esc(list.name) + " · Services", "الخدمات · " + esc(list.name))}</h3>
          <div class="row gap-2"><a class="btn btn--sm btn--secondary" href="${PP.href("services")}">${ic(document.documentElement.dir === "rtl" ? "chevronRight" : "chevronLeft")}<span>${L("Service Lists", "قوائم الخدمات")}</span></a>
          <button type="button" class="btn btn--sm" data-add>${ic("plus")}<span>${L("add new", "إضافة جديد")}</span></button></div></div>
        <div data-summary></div><div data-l></div>`;
      SV.services(mount.querySelector("[data-l]"), { list, partner: p, data: HF.SA.services.filter((s) => s.service_list.id === list.id),
        summary: mount.querySelector("[data-summary]"), addButton: mount.querySelector("[data-add]"), translationHref: (s) => PP.href("translation", { service: s.id, list: list.id }) });
      return;
    }
    mount.innerHTML = `<div class="row gap-3" style="justify-content:flex-end"><button type="button" class="btn btn--sm" data-addlist>${ic("plus")}<span>${L("Add service list", "إضافة قائمة خدمات")}</span></button></div><div data-l></div>`;
    const ctl = SV.lists(mount.querySelector("[data-l]"), { data: lists, partner: p, servicesHref: svcHref, translationHref: trList });
    mount.querySelector("[data-addlist]").onclick = () => SV.addList({ partner: p }, (l) => { lists.unshift(l); ctl.paint(); });
  };

  /* ================= branches (+ details) ================= */
  function branchData(p) {
    return p.branches.map((b, i) => Object.assign(b, b._d ? {} : {
      _d: 1, description: i ? "" : `${p.company_name} flagship venue with parking and changing rooms.`, image: null,
      country: p.country, state: p.state, city: p.city, address: `${p.city.name}, ${p.state.name}, ${p.country.name}`, manual_address: i % 2 ? "" : "King Fahd Rd, Al Olaya",
      latitude: 24.7 + i / 100, longitude: 46.68 + i / 100, approved_units_count: 3 + i, not_approved_units_count: i, pending_units_count: (i + 1) % 2,
      gallery: [{ id: 1, is_image: true, main_photo: 1 }, { id: 2, is_image: true, main_photo: 0 }],
    }));
  }
  PP.tabs.branches = (mount, ctx) => {
    const p = ctx.partner, data = branchData(p);
    const bid = ctx.params.get("branch");
    if (bid) {
      const b = data.find((x) => String(x.id) === bid) || data[0];
      const paint = () => {
        mount.innerHTML = `
          ${card(`<span class="row gap-4" style="align-items:center"><span class="cell-thumb" style="width:72px;height:72px">${ic("hotel")}</span>${esc(b.name || L("branch name", "اسم الفرع"))}</span>`,
            `<a class="icon-btn" href="${PP.href("translation", { branch: b.id })}" aria-label="${L("translation", "ترجمة")}">${ic("globe")}</a>${SA.iconBtn("edit", L("Edit Branch", "تعديل الفرع"), "data-eb")}`,
            kv([[L("ID:", "المعرف:"), b.id], [L("Description:", "الوصف:"), b.description ? esc(b.description) : "---"]]))}
          ${card(`${L("gallery", "معرض")} (${b.gallery.length})`, `<div class="stack" style="align-items:flex-end;gap:var(--space-1)">${btn(L("Upload", "رفع"), "upload", 'data-gu=""')}<span class="t-xs" style="color:var(--color-danger)">${L("Images: max size 1MB | Videos: max size 10MB", "الصور: الحد الأقصى 1 ميجابايت | الفيديوهات: الحد الأقصى 10 ميجابايت")}</span></div>`,
            `<div class="sa-gallery">${b.gallery.map((x) => `<figure class="sa-tile${x.main_photo ? " is-main" : ""}"><div class="sa-tile__media" style="height:125px">${ic("camera")}</div>
              <figcaption class="row gap-1">${SA.iconBtn("trash", L("Remove photo", "إزالة الصورة"), `data-gd="${x.id}"`)}${SA.iconBtn("star", L("main photo", "الصورة الرئيسية"), `data-gm="${x.id}" ${x.main_photo ? 'style="color:var(--color-warning)"' : ""}`)}${SA.iconBtn("edit", L("Change photo", "تغيير الصورة"), `data-gu="${x.id}"`)}${SA.iconBtn("eye", L("View", "عرض"))}</figcaption></figure>`).join("")}</div>`)}
          ${card(L("location", "الموقع"), SA.iconBtn("edit", L("Edit Location", "تعديل الموقع"), "data-el"), kv([[L("Country:", "البلد:"), esc(b.country.name)], [L("State:", "الولاية:"), esc(b.state.name)], [L("City:", "المدينة:"), esc(b.city.name)], [L("address:", "العنوان:"), dash(b.address)], [L("Street and district :", "الشارع والحي:"), dash(b.manual_address)]])
            + `<div><b class="t-sm">${L("Map :", "الخريطة:")}</b><div class="sa-tile__media" style="height:260px;border-radius:var(--radius-lg);margin-top:var(--space-2)">${ic("pin")}<span class="t-xs">${b.latitude.toFixed(4)}, ${b.longitude.toFixed(4)}</span></div></div>`)}`;
      };
      mount.addEventListener("click", (e) => {
        const gd = e.target.closest("[data-gd]"), gm = e.target.closest("[data-gm]");
        if (gd) confirmDelete(L("delete item", "حذف العنصر"), L("Please confirm that you want to delete this item", "يرجى تأكيد أنك تريد حذف هذا العنصر"), () => { b.gallery = b.gallery.filter((x) => String(x.id) !== gd.dataset.gd); paint(); });
        if (gm) { b.gallery.forEach((x) => (x.main_photo = String(x.id) === gm.dataset.gm ? 1 : 0)); paint(); }
        const gu = e.target.closest("[data-gu]");
        if (gu) {
          const el = SA.modal({ id: "ppBrUp", title: L("Upload Image OR Video", "رفع صورة أو فيديو"),
            body: `<div class="stack gap-3"><p class="t-xs text-tertiary">${L("Images: max size 1MB | Videos: max size 10MB", "الصور: الحد الأقصى 1 ميجابايت | الفيديوهات: الحد الأقصى 10 ميجابايت")}</p>
              <p class="t-sm" style="color:var(--color-warning)">${L("Max Size:", "الحد الأقصى للحجم:")} 10 MB</p>
              <label class="dropzone" style="cursor:pointer">${ic("upload")}<b>${L("No Upload Any File Yet", "لم يتم رفع أي ملف بعد")}</b><span class="t-xs">${L("Upload", "رفع")}</span><input type="file" accept="image/*,video/*" style="display:none" data-file></label><div data-info></div></div>`,
            foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button><button class="btn" data-ok>${L("Save", "حفظ")}</button>` });
          el.querySelector("[data-file]").onchange = (ev) => { const f = ev.target.files[0]; if (!f) return;
            const big = f.size > (f.type.startsWith("video") ? 10 : 1) * 1048576;
            el.querySelector("[data-info]").innerHTML = kv([[L("File Name:", "اسم الملف:"), esc(f.name)], [L("File Size:", "حجم الملف:"), (f.size / 1048576).toFixed(2) + " MB"]]) + (big ? `<p class="t-sm" style="color:var(--color-danger)">${f.type.startsWith("video") ? L("Max size 10MB for videos", "الحد الأقصى للفيديوهات 10 ميجابايت") : L("Max size 1MB for images", "الحد الأقصى للصور 1 ميجابايت")}</p>` : "");
            el.querySelector("[data-ok]").hidden = big; };
          el.querySelector("[data-ok]").onclick = () => { /* POST /branches/{b}/gallery · edit: POST …/gallery/{photo} _method=put */ if (gu.dataset.gu === "") b.gallery.push({ id: Date.now(), is_image: true, main_photo: 0 }); SA.close(el); paint(); };
        }
        if (e.target.closest("[data-eb]")) {
          const el = SA.modal({ id: "ppEb", title: L("Edit Branch", "تعديل الفرع"), body: `<div class="stack gap-4">
            ${SA.field(["Photo", "الصورة"], `<label class="btn btn--sm btn--secondary" style="align-self:flex-start">${ic("upload")}<span>${L("Photo", "الصورة")}</span><input type="file" accept=".png,.jpg,.jpeg" style="display:none"></label>`, { hint: ["The image should be an icon with a transparent background.", "يجب أن تكون الصورة أيقونة ذات خلفية شفافة."] })}
            ${SA.field(["name", "الاسم"], `<input class="input" data-f="name" value="${esc(b.name)}"><div data-e></div>`)}
            ${SA.field(["Description", "الوصف"], `<textarea class="input" rows="3" data-f="d">${esc(b.description)}</textarea>`)}</div>`, foot: foot(L("update", "تحديث")) });
          ok(el, () => {
            const n = el.querySelector('[data-f="name"]').value.trim();
            if (n.length < 3) return (el.querySelector("[data-e]").innerHTML = errLine("Name is required and should be at least 3 characters long"));
            /* POST /partners/{id}/branches/{branchId} (_method=put) */
            b.name = n; b.description = el.querySelector('[data-f="d"]').value; SA.close(el); paint();
          });
        }
        if (e.target.closest("[data-el]")) {
          const G = HF.SA.GEO.filter((g) => g.country.iso === b.country.iso);
          let st = String(b.state.id), ci = String(b.city.id);
          const geo = () => `${SA.field(["State:", "الولاية:"], SA.select([["", L("select state", "اختر الولاية")]].concat(G.map((g) => g.state).filter((s, i, a) => a.findIndex((y) => y.id === s.id) === i).map((s) => [s.id, s.name, String(s.id) === st])), 'data-g="state"'))}${SA.field(["City:", "المدينة:"], SA.select([["", L("select city", "اختر المدينة")]].concat(G.filter((g) => String(g.state.id) === st).map((g) => [g.city.id, g.city.name, String(g.city.id) === ci])), 'data-g="city"'))}`;
          const el = SA.modal({ id: "ppElc", wide: true, title: L("Edit Location", "تعديل الموقع"), body: `<div class="stack gap-4">
            ${SA.field(["country", "البلد"], SA.select([[b.country.iso, b.country.name, true]], "disabled"))}
            <div class="grid grid-2" data-geo>${geo()}</div>
            ${SA.field(["Street and district :", "الشارع والحي:"], `<input class="input" data-f="m" value="${esc(b.manual_address)}">`)}
            ${SA.field(["search for address", "البحث عن العنوان"], `<div class="input-wrap"><span class="input-wrap__icon">${ic("search")}</span><input class="input" placeholder="search location"></div>`)}
            <div class="sa-tile__media" style="height:260px;border-radius:var(--radius-lg)">${ic("pin")}</div></div>`, foot: foot(L("update", "تحديث")) });
          el.querySelector("[data-geo]").onchange = (ev) => { if (ev.target.dataset.g === "state") { st = ev.target.value; ci = ""; el.querySelector("[data-geo]").innerHTML = geo(); } if (ev.target.dataset.g === "city") ci = ev.target.value; };
          ok(el, () => {
            /* POST /partners/{id}/branches/{branchId} (_method=put): state_id, city_id, manual_address, address, lat/lng */
            const g = HF.SA.GEO.find((x) => String(x.city.id) === ci) || HF.SA.GEO.find((x) => String(x.state.id) === st);
            if (g) { b.state = g.state; if (ci) b.city = g.city; }
            b.manual_address = el.querySelector('[data-f="m"]').value; SA.close(el); paint();
          });
        }
      });
      paint();
      return;
    }
    const exp = new Set();
    mount.innerHTML = `<h3 class="t-title">${L("Branches", "الفروع")}</h3><div id="ppBr"></div>`;
    const ctl = SA.list({ mount: mount.querySelector("#ppBr"), data,
      search: ["search by Branch Name", "البحث باسم الفرع"], searchMatch: (r, q) => r.name.toLowerCase().includes(q),
      toolbarExtra: PP.filterBtn(),
      extraMatch: (r, f) => (!f.country || r.country.iso === f.country) && (!f.state || String(r.state.id) === f.state) && (!f.city || String(r.city.id) === f.city),
      empty: ["there is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["#", "#"], cell: (r) => `<span class="row gap-2" style="align-items:center;flex-wrap:nowrap"><button type="button" class="icon-btn" data-x="${r.id}" aria-expanded="${exp.has(r.id)}" aria-label="${L("Details", "التفاصيل")}"><span style="display:inline-flex;transition:transform var(--duration-fast);${exp.has(r.id) ? "transform:rotate(180deg)" : ""}">${ic("chevronDown")}</span></button>${data.indexOf(r) + 1}</span>` },
        { head: ["id", "الرقم"], cell: (r) => r.id },
        { head: ["Name / Tags", "الاسم / العلامات"], cell: (r) => `<b>${esc(r.name)}</b>${exp.has(r.id) ? `<div class="grid grid-2 t-sm" style="margin-top:var(--space-3);min-width:420px;gap:var(--space-4)">
            <div class="stack gap-2"><span><b>${L("Description", "الوصف")}</b><br>${r.description ? esc(r.description) : L("No description available.", "لا يوجد وصف متاح.")}</span>
              <span><b>${L("Address :", "العنوان:")}</b> ${r.address ? esc(r.address) : L("No address available.", "لا يوجد عنوان متاح.")}</span>
              <span><b>${L("Street and district :", "الشارع والحي:")}</b> ${r.manual_address ? esc(r.manual_address) : L("no data", "لا توجد بيانات")}</span></div>
            <div><b>${L("location", "الموقع")}:</b><div class="sa-tile__media" style="height:140px;border-radius:var(--radius-md);margin-top:var(--space-1)">${ic("pin")}</div></div></div>` : ""}` },
        { head: ["State, City", "الولاية، المدينة"], cell: (r) => `${esc(r.state.name)} -  ${esc(r.city.name)}` },
        { head: ["Approved", "معتمد"], cell: (r) => r.approved_units_count },
        { head: ["Not Approved", "غير معتمد"], cell: (r) => r.not_approved_units_count },
        { head: ["pending", "معلق"], cell: (r) => r.pending_units_count },
        { head: ["Actions", "الإجراءات"], cell: (r) => `<div class="row gap-1"><a class="icon-btn" href="${PP.href("branches", { branch: r.id })}" aria-label="${L("View", "عرض")}">${ic("eye")}</a><a class="icon-btn" href="${PP.href("translation", { branch: r.id })}" aria-label="${L("translation", "ترجمة")}">${ic("globe")}</a></div>` },
      ] });
    mount.addEventListener("click", (e) => {
      const x = e.target.closest("[data-x]"); if (x) { const id = +x.dataset.x; exp.has(id) ? exp.delete(id) : exp.add(id); ctl.paint(); }
      const fb = e.target.closest("[data-filter]");
      if (fb) {
        const G = HF.SA.GEO, uniq = (a, k) => a.filter((x, i) => a.findIndex((y) => k(y) === k(x)) === i);
        PP.filterPop(fb, { value: ctl.state.extra, cascade: { country: ["state", "city"], state: ["city"] },
          fields: [
            { key: "country", label: ["country", "البلد"], placeholder: ["Select country", "اختر البلد"], options: () => uniq(G.map((g) => g.country), (c) => c.iso).map((c) => [c.iso, c.name]) },
            { key: "state", label: ["State:", "الولاية:"], placeholder: ["select state", "اختر الولاية"], disabled: (d) => !d.country, options: (d) => uniq(G.filter((g) => g.country.iso === d.country).map((g) => g.state), (s) => s.id).map((s) => [s.id, s.name]) },
            { key: "city", label: ["City:", "المدينة:"], placeholder: ["select city", "اختر المدينة"], disabled: (d) => !d.state, options: (d) => G.filter((g) => String(g.state.id) === d.state).map((g) => [g.city.id, g.city.name]) },
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
    const lbl = (v) => ({ waiting: L("pending", "معلق"), pending: L("pending", "معلق"), active: L("approved", "معتمد"), inactive: L("not approved", "غير معتمد") }[v] || v);
    mount.innerHTML = `<h3 class="t-title">${L("units", "الوحدات")}</h3><div id="ppUnits"></div>`;
    const uctl = SA.list({ mount: mount.querySelector("#ppUnits"), data,
      pills: [{ key: "all", label: ["all", "الكل"] }, { key: "waiting", label: ["pending", "معلق"] }, { key: "active", label: ["Approved", "معتمد"] }, { key: "inactive", label: ["Not Approved", "غير معتمد"] }],
      pillMatch: (r, k) => k === "all" || r.status.value === k, search: ["search by unit name", "البحث باسم الوحدة"], searchMatch: (r, q) => r.name.toLowerCase().includes(q),
      toolbarExtra: PP.filterBtn(),
      extraMatch: (r, f) => (!f.category || String(r.activity_category.id) === f.category) && (!f.activity || r.activity.name === f.activity) && (!f.type || r.type.name === f.type) && (!f.capacity || r.capacity === f.capacity) && (!f.availability || r.availability.toLowerCase() === f.availability),
      empty: ["there is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b> ${r.attendance_type === "online" ? badge("primary", L("online", "عبر الإنترنت")) : ""}<div class="t-xs text-tertiary">${esc(r.created_at)}</div>` },
        { head: ["branch", "الفرع"], cell: (r) => dash(r.branch) },
        { head: ["category", "الفئة"], cell: (r) => esc(r.activity_category.name) },
        { head: ["Activity", "النشاط"], cell: (r) => esc(r.activity.name) },
        { head: ["type", "النوع"], cell: (r) => esc(r.type.name) },
        { head: ["capacity", "القدرة"], cell: (r) => esc(r.capacity) },
        { head: ["booking methodology", "منهجية الحجز"], cell: (r) => esc(r.booking_methodology) },
        { head: ["availability", "التوفر"], cell: (r) => `<span style="color:${r.availability === "Available" ? "var(--color-info)" : "var(--color-danger)"};font-weight:var(--weight-semibold)">${esc(r.availability)}</span>` },
        { head: ["Partner App Status", "حالة تطبيق الشريك"], cell: (r) => (p.is_independent && r.ownappactive ? badge(tone(r.ownappactive.value), lbl(r.ownappactive.value)) : "---") },
        { head: ["High Five Status", "حالة هاي فايف"], cell: (r) => badge(tone(r.status.value), lbl(r.status.value)) },
        { head: ["Actions", "الإجراءات"], cell: (r) => `<a class="icon-btn" href="unit-profile.html?id=${r.id}&tab=details" aria-label="${L("View", "عرض")}">${ic("eye")}</a>` },
      ] });
    mount.addEventListener("click", (e) => {
      const fb = e.target.closest("[data-filter]");
      if (!fb) return;
      PP.filterPop(fb, { value: uctl.state.extra, cascade: { category: ["activity"] },
        fields: [
          { key: "category", label: ["Category :", "الفئة:"], placeholder: ["select category", "اختر الفئة"], options: () => HF.SA.CATS.map((c) => [c.id, c.name]) },
          { key: "activity", label: ["activity:", "النشاط:"], placeholder: ["select state", "اختر الولاية"], options: (d) => (d.category ? HF.SA.ACTS[d.category] : []).map((a) => [a, a]) },
          { key: "type", label: ["type:", "النوع:"], placeholder: ["select state", "اختر الولاية"], options: () => HF.SA.TYPES.map((t) => [t, t]) },
          { key: "capacity", label: ["capacity:", "السعة:"], placeholder: ["select state", "اختر الولاية"], options: () => HF.SA.CAPS.map((c) => [c, c]) },
          { key: "availability", label: ["availability:", "التوفر:"], placeholder: ["select state", "اختر الولاية"], options: () => [["available", L("available", "متاح")], ["maintenance", L("maintenance", "صيانة")]] },
        ],
        onApply: (d) => { uctl.state.extra = d; uctl.state.page = 1; uctl.paint(); } });
    });
  };
})();
