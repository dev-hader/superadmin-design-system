/* Unit profile — details · location · gallery · comments (+ fake comments) ·
   assigned employees · assigned service lists. Mirrors pages/units/profile/
   {details,location,gallery,comments,employees,assigned-services}.
   Permissions (job keys, as the dashboard): details Edit update_units (DetailsPage.js);
   location, assigned employees: not gated. Gallery tab view_unit_images, Upload
   add_unit_images, remove delete_unit_images, change photo update_unit_images (the main-
   photo star is not gated) (GalleryPage.js / Images.js). Comments tab view_unit_comments |
   view_fake_unit_comments; the status pills need view_unit_comments, the Fake comments
   tab view_fake_unit_comments; Add fake comment add_fake_unit_comments; regular rows'
   delete / restore delete_unit_comments, a fake row's trash delete_fake_unit_comments;
   fake table view view_fake_unit_comments, edit update_fake_unit_comments, delete
   delete_fake_unit_comments (CommentsPage.js / CommentsTable.js / FakeCommentsTable.js).
   Assigned service lists tab view_unit_services; the per-unit switch and drag-to-reorder
   need view_unit_services AND update_units — without them the switch is DISABLED and the
   lists are not draggable (AssignedServicesPage.js canToggleUnitVisibility / canReorder). */
(function () {
  "use strict";
  const { L, esc, ic, badge } = SA;
  const { card, kv, btn, avatar, confirmDelete } = PP;
  const UP = (window.UP = window.UP || { tabs: {} });
  const ok = (el, fn) => (el.querySelector("[data-ok]").onclick = fn);
  const errLine = (m) => `<span class="field__error">${ic("warn")} ${m}</span>`;
  const foot = (label) => `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${label || L("Update", "تحديث")}</button>`;
  /* raw API words → readable EN / AR (PP.cap covers the shared ones) */
  const U_WORDS = { onsite: ["Onsite", "حضوري"], main: ["Main", "رئيسي"], part: ["Part", "جزء"], available: ["Available", "متاح"], maintenance: ["Maintenance", "صيانة"] };
  /* sample service names offered per activity (the activity's services in the dashboard) */
  const SVCS = ["Changing rooms", "Parking", "Lighting", "Equipment", "Coaching"];
  const cap = (v) => { const w = U_WORDS[String(v == null ? "" : v).toLowerCase()]; return w ? L(w[0], w[1]) : PP.cap(v); };
  const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");
  /* job permissions (RD.can — shell.js; ?perm=limited | none demo) */
  const can = (k) => !window.RD || !RD.can || RD.can(k);
  const denied = (mount, key) => { if (can(key)) return false; mount.innerHTML = RD.noPermission(); return true; };
  const P = (k) => `data-perm="${k}"`;

  /* ================= details ================= */
  UP.tabs.details = (mount, ctx) => {
    const u = ctx.unit;
    const paint = () => {
      mount.innerHTML = card(L("Details", "التفاصيل"), btn(L("Edit", "تعديل"), "edit", `data-edit ${P("update_units")}`, "secondary"), kv([
        [L("Name", "الاسم"), esc(u.name)], [L("Company", "الشركة"), esc(u.partner.company_name)],
        [L("Main category", "الفئة الرئيسية"), esc(u.activity_category.name)], [L("Main activity", "النشاط الرئيسي"), esc(u.activity.name)],
        u.extra_categories.length ? [L("Additional categories", "الفئات الإضافية"), esc(u.extra_categories.join(", "))] : null,
        u.extra_activities.length ? [L("Additional activities", "الأنشطة الإضافية"), esc(u.extra_activities.join(", "))] : null,
        [L("Type", "النوع"), esc(u.type.name)], [L("Attendance type", "نوع الحضور"), esc(cap(u.attendance_type))],
        [L("Capacity", "السعة"), esc(u.capacity)], [L("Availability", "التوفر"), esc(cap(u.availability))],
        [L("Services", "الخدمات"), esc(u.services.join(", "))], [L("Gender", "الجنس"), esc(cap(u.gender))], [L("Created at:", "تاريخ الإنشاء:"), esc(u.created_at)],
      ]));
      mount.querySelector("[data-edit]").onclick = edit;
    };
    function edit() {
      /* EditProfileModal: Type, Capacity and Services come from the chosen main activity
         (activity.types / capacities / services); changing the activity clears all three.
         Additional categories (multi) → Additional activities (multi, the activities of the
         chosen categories); clearing the categories clears the activities.
         PUT /units/{id} payload: name · activity_category_id · categories · activity_id ·
         floor_type_id · capacity_id · services · gender · description · show_in_app ·
         attendance_type · additional_activities (kept here as extra_categories / extra_activities). */
      const d = { name: u.name, attendance_type: u.attendance_type, cat: String(u.activity_category.id), act: u.activity.name, type: u.type.name, capacity: u.capacity, gender: u.gender, description: u.description, show_in_app: u.show_in_app,
        services: u.services.slice(), cats: u.extra_categories.slice(), acts: u.extra_activities.slice() };
      const startOnline = u.attendance_type === "online";
      const row = (label, control) => `<div class="sa-formrow"><label class="field__label">${label}:</label><div>${control}</div></div>`;
      const sel = (k, opts, ph) => SA.select([["", ph]].concat(opts.map((o) => [o[0], o[1], String(d[k]) === String(o[0])])), `data-f="${k}"`);
      /* multi-select: checkbox list under its placeholder (or the picked count) */
      const multi = (k, opts, ph) => `<div class="stack gap-2" style="padding:var(--space-2) var(--space-3);border:var(--border-thin) solid var(--color-border);border-radius:var(--radius-md)">
          <span class="t-xs text-tertiary">${d[k].length ? L(`${d[k].length} selected`, `تم اختيار ${d[k].length}`) : ph}</span>
          ${opts.length ? `<div class="row gap-3" style="flex-wrap:wrap">${opts.map((o) => `<label class="check"><input type="checkbox" data-m="${k}" value="${esc(o)}" ${d[k].includes(o) ? "checked" : ""}><span class="check__box">${ic("check")}</span>${esc(o)}</label>`).join("")}</div>` : ""}</div>`;
      const listsOf = (act) => {
        if (!act) return { types: [], caps: [], svcs: [] };
        const h = [...act].reduce((a, c) => a + c.charCodeAt(0), 0), rot = (arr, n) => arr.map((_, i) => arr[(h + i) % arr.length]).slice(0, n);
        const own = act === u.activity.name, uniq = (a) => a.filter((x, i) => a.indexOf(x) === i);
        return { types: uniq((own ? [u.type.name] : []).concat(rot(HF.SA.TYPES, 3))), caps: uniq((own ? [u.capacity] : []).concat(rot(HF.SA.CAPS, 3))), svcs: uniq((own ? u.services : []).concat(rot(SVCS, 3))) };
      };
      const extraActs = () => d.cats.flatMap((n) => HF.SA.ACTS[(HF.SA.CATS.find((c) => c.name === n) || {}).id] || []).filter((a, i, arr) => arr.indexOf(a) === i);
      const body = () => { const ls = listsOf(d.act); return `<div class="stack gap-4">
        ${row(L("Name", "الاسم"), `<input class="input" data-f="name" value="${esc(d.name)}" placeholder="${L("Enter name", "أدخل الاسم")}"><div data-e="name"></div>`)}
        ${u.partner_allow_online ? row(L("Attendance type", "نوع الحضور"), sel("attendance_type", [["onsite", L("Onsite", "حضوري")], ["online", L("Online", "أونلاين")]], L("Select attendance type", "اختر نوع الحضور"))
          + (!startOnline && d.attendance_type === "online" ? `<p class="t-xs" style="color:var(--color-info);margin-top:var(--space-1)">${L("The location will not be visible to the end user because this unit is online.", "لن يظهر الموقع للمستخدم النهائي لأن هذه الوحدة أونلاين.")}</p>` : "")) : ""}
        ${row(L("Main category", "الفئة الرئيسية"), sel("cat", HF.SA.CATS.map((c) => [c.id, c.name]), L("Select category", "اختر الفئة")))}
        ${row(L("Main activity", "النشاط الرئيسي"), sel("act", (HF.SA.ACTS[d.cat] || []).map((a) => [a, a]), L("Select activity", "اختر النشاط")))}
        ${row(L("Type", "النوع"), sel("type", ls.types.map((t) => [t, t]), L("Select type", "اختر النوع")))}
        ${row(L("Capacity", "السعة"), sel("capacity", ls.caps.map((c) => [c, c]), L("Select capacity", "اختر السعة")))}
        ${row(L("Services", "الخدمات"), multi("services", ls.svcs, L("Select services", "اختر الخدمات")))}
        ${row(L("Additional categories", "الفئات الإضافية"), multi("cats", HF.SA.CATS.map((c) => c.name), L("Select categories", "اختر الفئات")))}
        ${row(L("Additional activities", "الأنشطة الإضافية"), multi("acts", extraActs(), L("Select additional activities", "اختر الأنشطة الإضافية")))}
        ${row(L("Gender", "الجنس"), sel("gender", [["Male", L("Male", "ذكر")], ["Female", L("Female", "أنثى")], ["Both", L("Both", "كلاهما")]], L("Select gender", "اختر الجنس")))}
        ${row(L("Description", "الوصف"), `<textarea class="input" rows="3" data-f="description" placeholder="${L("Enter description", "أدخل الوصف")}">${esc(d.description)}</textarea>`)}
        ${row(L("Show in app", "إظهار في التطبيق"), `<label class="check"><input type="checkbox" data-f="show_in_app" ${d.show_in_app ? "checked" : ""}><span class="check__box">${ic("check")}</span>${L("Show in app", "إظهار في التطبيق")}</label>`)}</div>`; };
      const el = SA.modal({ id: "upEd", wide: true, title: L("Update unit", "تحديث الوحدة"), body: body(), foot: foot() });
      const b = el.querySelector(".modal__body");
      b.oninput = (e) => { const k = e.target.dataset.f; if (k && e.target.type !== "checkbox") d[k] = e.target.value; };
      b.onchange = (e) => {
        const m = e.target.dataset.m;
        if (m) {
          d[m] = [...b.querySelectorAll(`[data-m="${m}"]:checked`)].map((x) => x.value);
          if (m === "cats") { const still = extraActs(); d.acts = d.cats.length ? d.acts.filter((a) => still.includes(a)) : []; }
          b.innerHTML = body();
          return;
        }
        const k = e.target.dataset.f;
        if (k === "show_in_app") return (d.show_in_app = e.target.checked);
        if (!k) return;
        d[k] = e.target.value;
        if (k === "cat") { d.act = (HF.SA.ACTS[d.cat] || [])[0] || ""; }
        if (k === "cat" || k === "act") { d.type = ""; d.capacity = ""; d.services = []; }
        if (["cat", "act", "attendance_type"].includes(k)) b.innerHTML = body();
      };
      ok(el, () => {
        const n = d.name.trim(), e = el.querySelector('[data-e="name"]');
        e.innerHTML = "";
        if (!n) return (e.innerHTML = errLine(L("This field is required", "هذا الحقل مطلوب")));
        if (n.length < 3) return (e.innerHTML = errLine(L("Minimum 3 characters", "3 أحرف على الأقل")));
        if (n.length > 50) return (e.innerHTML = errLine(L("Maximum 50 characters", "50 حرفًا كحد أقصى")));
        /* PUT /units/{id} — then the header re-fetches ("unit:updated") */
        const cat = HF.SA.CATS.find((c) => String(c.id) === d.cat);
        Object.assign(u, { name: n, attendance_type: d.attendance_type, gender: d.gender, description: d.description, show_in_app: d.show_in_app, capacity: d.capacity || u.capacity,
          services: d.services, extra_categories: d.cats, extra_activities: d.acts });
        if (cat) u.activity_category = { id: cat.id, name: cat.name };
        if (d.act) u.activity = { name: d.act };
        if (d.type) u.type = { name: d.type };
        SA.close(el); UP.refreshHero(); paint();
      });
    }
    paint();
  };

  /* ================= location ================= */
  UP.tabs.location = (mount, ctx) => {
    const u = ctx.unit, l = u.loc;
    const others = HF.SA.units.filter((x) => x.partner.id === u.partner.id && x.id !== u.id);
    /* sample main / part split (unit-profile.html: part when id % 9 % 4 === 2) */
    const typeOf = (x) => (x.loc ? x.loc.type : (x.id % 9) % 4 === 2 ? "part" : "main");
    /* "Part from" = the partner's MAIN units except this one (GET /general/main-units?partner_id=) */
    const mains = others.filter((x) => typeOf(x) === "main");
    /* "Conflicted with" = the part units of the chosen main (GET /general/part-units?main_id=) */
    const partsOf = (mainId) => { const i = mains.findIndex((m) => String(m.id) === String(mainId)); return i < 0 ? [] : others.filter((x) => typeOf(x) === "part" && x.id % mains.length === i); };
    const paint = () => {
      mount.innerHTML = card(L("Location", "الموقع"), btn(L("Edit", "تعديل"), "edit", "data-edit", "secondary"), kv([
        [L("Type", "النوع"), esc(cap(l.type))],
        l.type === "part" ? [L("Part from", "جزء من"), l.part_from ? `<a href="unit-profile.html?id=${l.part_from.id}" style="color:var(--color-text-link)">${esc(l.part_from.name)}</a>` : "---"] : null,
        l.type === "part" ? [L("Conflicted with", "متضارب مع"), l.conflicted_with.length ? l.conflicted_with.map((c) => `<a href="unit-profile.html?id=${c.id}" style="color:var(--color-text-link)">${esc(c.name)}</a>`).join(", ") : "---"] : null,
        [L("Country", "البلد"), esc(l.country.name)], [L("Branch", "الفرع"), esc(l.branch)], [L("State", "الولاية"), esc(l.state.name)], [L("City", "المدينة"), esc(l.city.name)],
        [L("Address", "العنوان"), esc(l.address)], [L("Latitude", "خط العرض"), l.latitude], [L("Longitude", "خط الطول"), l.longitude],
        [L("Map", "الخريطة"), `<div class="sa-tile__media" style="height:300px;border-radius:var(--radius-lg)">${ic("pin")}<span class="t-xs">${l.latitude}, ${l.longitude}</span></div>`],
      ]));
      mount.querySelector("[data-edit]").onclick = edit;
    };
    function edit() {
      const G = HF.SA.GEO.filter((g) => g.country.iso === l.country.iso);
      const d = { type: l.type, part: l.part_from ? String(l.part_from.id) : "", st: String(l.state.id), ci: String(l.city.id), cw: l.conflicted_with.map((c) => String(c.id)) };
      const locked = l.type === "part";
      const body = () => `<div class="stack gap-4"><div class="alert alert--info"><span class="alert__icon">${ic("info")}</span><div class="alert__body">${L("You must choose a location within the branch country.", "يجب عليك اختيار موقع داخل بلد الفرع.")}</div></div>
        ${SA.field(["Branch", "الفرع"], `<input class="input" value="${esc(l.branch)}" readonly>`)}
        ${SA.field(["Type", "النوع"], SA.select([["", L("Select type", "اختر النوع")], ["main", L("Main", "رئيسي"), d.type === "main"], ["part", L("Part", "جزء"), d.type === "part"]], 'data-f="type"'))}
        ${d.type === "part" ? `${SA.field(["Part from", "جزء من"], SA.select([["", L("Select", "اختر")]].concat(mains.map((x) => [x.id, x.name, String(x.id) === d.part])), 'data-f="part"'))}
          ${SA.field(["Conflicted with", "متضارب مع"], `<div class="stack gap-1">${partsOf(d.part).map((x) => `<label class="check"><input type="checkbox" data-cw value="${x.id}" ${d.cw.includes(String(x.id)) ? "checked" : ""}><span class="check__box">${ic("check")}</span>${esc(x.name)}</label>`).join("") || "---"}</div>`)}` : ""}
        ${SA.field(["Country", "البلد"], `<input class="input" value="${esc(l.country.name)}" readonly>`)}
        <div class="grid grid-2">${SA.field(["State", "الولاية"], SA.select([["", L("Select state", "اختر الولاية")]].concat(G.map((g) => g.state).filter((s, i, a) => a.findIndex((y) => y.id === s.id) === i).map((s) => [s.id, s.name, String(s.id) === d.st])), `data-f="st" ${locked ? "disabled" : ""}`) + '<div data-e="st"></div>')}
          ${SA.field(["City", "المدينة"], SA.select([["", L("Select city", "اختر المدينة")]].concat(G.filter((g) => String(g.state.id) === d.st).map((g) => [g.city.id, g.city.name, String(g.city.id) === d.ci])), `data-f="ci" ${locked ? "disabled" : ""}`) + '<div data-e="ci"></div>')}</div>
        ${SA.field(["Search for address", "البحث عن العنوان"], `<div class="input-wrap"><span class="input-wrap__icon">${ic("search")}</span><input class="input" placeholder="${L("Search location", "البحث عن الموقع")}"></div>`)}
        <div class="sa-tile__media" style="height:300px;border-radius:var(--radius-lg)">${ic("pin")}</div></div>`;
      const el = SA.modal({ id: "upLoc", wide: true, title: L("Update location", "تحديث الموقع"), body: body(), foot: foot() });
      const b = el.querySelector(".modal__body");
      b.onchange = (e) => {
        if (e.target.matches("[data-cw]")) { d.cw = [...b.querySelectorAll("[data-cw]:checked")].map((c) => c.value); return; }
        const k = e.target.dataset.f; if (!k) return; d[k] = e.target.value;
        if (k === "st") d.ci = "";
        if (k === "part") d.cw = []; /* the part-units list reloads for the new main */
        if (k === "type" || k === "st" || k === "part") b.innerHTML = body();
      };
      ok(el, () => {
        let bad = false;
        if (!d.st) { el.querySelector('[data-e="st"]').innerHTML = errLine(L("This field is required", "هذا الحقل مطلوب")); bad = true; }
        if (!d.ci) { el.querySelector('[data-e="ci"]').innerHTML = errLine(L("This field is required", "هذا الحقل مطلوب")); bad = true; }
        if (bad) return;
        /* PUT /units/{id}/update-location */
        const g = HF.SA.GEO.find((x) => String(x.city.id) === d.ci);
        if (g) { l.state = g.state; l.city = g.city; }
        l.type = d.type || l.type;
        const pf = mains.find((x) => String(x.id) === d.part);
        l.part_from = l.type === "part" && pf ? { id: pf.id, name: pf.name } : null;
        l.conflicted_with = l.type === "part" ? d.cw.map((id) => others.find((y) => String(y.id) === id)).filter(Boolean).map((x) => ({ id: x.id, name: x.name })) : [];
        SA.close(el); paint();
      });
    }
    paint();
  };

  /* ================= gallery ================= */
  UP.tabs.gallery = (mount, ctx) => {
    const u = ctx.unit;
    if (denied(mount, "view_unit_images")) return;
    const paint = () => {
      const g = u.gallery;
      mount.innerHTML = card(`${L("Gallery", "المعرض")} (${g.length})`,
        `<div class="stack" style="align-items:flex-end;gap:var(--space-1)">${btn(L("Upload", "رفع"), "upload", `data-up="" ${P("add_unit_images")}`)}<span class="t-xs" style="color:var(--color-danger)">${L("Images: max size 1MB | Videos: max size 10MB", "الصور: الحد الأقصى 1 ميجابايت | الفيديوهات: الحد الأقصى 10 ميجابايت")}</span></div>`,
        g.length ? `<div class="sa-gallery">${g.map((x) => `<figure class="sa-tile${x.main_photo ? " is-main" : ""}"><div class="sa-tile__media" style="height:125px">${ic(x.is_image ? "camera" : "flash")}<span class="t-xs">${x.is_image ? L("Image", "صورة") : L("Video", "فيديو")}</span></div>
          <figcaption class="row gap-1" style="flex-wrap:wrap">${SA.iconBtn("trash", L("Remove photo", "إزالة الصورة"), `data-del="${x.id}" ${P("delete_unit_images")}`)}${SA.iconBtn("star", L("Main photo", "الصورة الرئيسية"), `data-main="${x.id}" ${x.main_photo ? 'style="color:var(--color-warning)"' : ""}`)}${SA.iconBtn("edit", L("Change photo", "تغيير الصورة"), `data-up="${x.id}" ${P("update_unit_images")}`)}
            <a class="icon-btn" href="#" aria-label="${L("View image", "عرض الصورة")}" title="${L("View image", "عرض الصورة")}">${ic("eye")}</a>${x.original ? `<a class="icon-btn" href="#" aria-label="${L("View original image", "عرض الصورة الأصلية")}" title="${L("View original image", "عرض الصورة الأصلية")}">${ic("layout")}</a>` : ""}</figcaption></figure>`).join("")}</div>`
          : `<p class="text-tertiary">${L("No photos have been added yet. You can upload photos with the upload button.", "لم تتم إضافة أي صور بعد. يمكنك رفع الصور بالضغط على زر الرفع.")}</p>`);
    };
    mount.addEventListener("click", (e) => {
      const d = e.target.closest("[data-del]"), m = e.target.closest("[data-main]"), up = e.target.closest("[data-up]");
      if (d) confirmDelete(L("Delete item", "حذف العنصر"), L("Please confirm that you want to delete this item", "يرجى تأكيد أنك تريد حذف هذا العنصر"), () => { u.gallery = u.gallery.filter((x) => String(x.id) !== d.dataset.del); paint(); });
      if (m) { /* PUT /units/{id}/gallery/{photo}/set-as-main */ u.gallery.forEach((x) => (x.main_photo = String(x.id) === m.dataset.main ? 1 : 0)); paint(); }
      if (up) {
        let full = false;
        const el = SA.modal({ id: "upUp", title: L("Upload image or video", "رفع صورة أو فيديو"),
          body: `<div class="stack gap-3"><p class="t-xs text-tertiary">${L("Images: max size 1MB | Videos: max size 10MB", "الصور: الحد الأقصى 1 ميجابايت | الفيديوهات: الحد الأقصى 10 ميجابايت")}</p>
            <label class="dropzone" style="cursor:pointer">${ic("upload")}<b>${L("No file uploaded yet", "لم يتم رفع أي ملف بعد")}</b><span class="t-xs">${L("Upload", "رفع")}</span><input type="file" accept="image/*,video/*" style="display:none" data-file></label><div data-info></div></div>`,
          foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button><button class="btn" data-ok disabled>${L("Save", "حفظ")}</button>` });
        el.querySelector("[data-file]").onchange = (ev) => {
          const f = ev.target.files[0]; if (!f) return;
          const vid = f.type.startsWith("video"), big = f.size > (vid ? 10 : 1) * 1048576;
          el.querySelector("[data-info]").innerHTML = kv([[L("File name", "اسم الملف"), esc(f.name)], [L("File size", "حجم الملف"), (f.size / 1048576).toFixed(2) + " MB"]])
            + (big ? `<p class="t-sm" style="color:var(--color-danger)">${vid ? L("Max size 10MB for videos", "الحد الأقصى للفيديوهات 10 ميجابايت") : L("Max size 1MB for images", "الحد الأقصى للصور 1 ميجابايت")}</p>` : "")
            + (vid && !big ? `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Preview video:", "معاينة الفيديو:")}</h4><video src="${URL.createObjectURL(f)}" controls style="width:100%;border-radius:var(--radius-md)"></video>` : "")
            + (!vid ? `<h4 class="t-sm" style="font-weight:var(--weight-bold)">${L("Crop", "قص")}</h4><label class="check"><input type="checkbox" data-full><span class="check__box">${ic("check")}</span>${L("Full image", "صورة كاملة")}</label><p class="t-xs text-tertiary" data-fullhint hidden>${L("Both cropped (slider) and original (gallery) versions will be saved", "سيتم حفظ كل من النسخة المقطوعة (السلايدر) والنسخة الأصلية (المعرض)")}</p>` : "");
          const okBtn = el.querySelector("[data-ok]"); okBtn.hidden = big; okBtn.disabled = false;
          const fc = el.querySelector("[data-full]"); if (fc) fc.onchange = () => { full = fc.checked; el.querySelector("[data-fullhint]").hidden = !full; };
        };
        ok(el, () => { /* POST /units/{id}/gallery (images[0], original_images[0]) · edit: …/gallery/{photo} _method=put */
          if (up.dataset.up === "") u.gallery.push({ id: Date.now(), is_image: true, main_photo: 0, original: full });
          SA.close(el); paint();
        });
      }
    });
    paint();
  };

  /* ================= comments (+ fake comments) ================= */
  UP.tabs.comments = (mount, ctx) => {
    const u = ctx.unit, C = u.comments;
    if (denied(mount, "view_unit_comments|view_fake_unit_comments")) return;
    /* only fake comments allowed → that list opens first (CommentsPage.js) */
    let tab = can("view_unit_comments") ? "" : "fake";
    const stars = (n) => `<span style="color:var(--color-warning)">${ic("star")}</span> ${n}`;
    const statusBadge = (s) => (s === 0 ? badge("", L("Deleted", "محذوف")) : s === 1 ? badge("danger", L("Deletion request", "طلب حذف")) : badge("primary", L("Published", "منشور")));
    /* Comment on: a link to the booking / event when there is an id; else the regular list shows
       "#---" and the fake-comments table the source label only (fake comments carry no id) */
    const srcLabel = (r) => (r.source_type === "public_event" ? L("Public event", "حدث عام") : L("Booking", "حجز"));
    const onLink = (r) => `${srcLabel(r)}<div class="t-xs">${r.ref ? `<a href="${UP.href(r.source_type === "public_event" ? "public-events" : "bookings", { view: r.ref })}" style="color:var(--color-text-link)">#${r.ref}</a>` : `<span class="text-tertiary">#---</span>`}</div>`;
    const onLinkFake = (r) => (r.ref ? onLink(r) : srcLabel(r));
    /* &commentId= deep link (CommentsTable): open the view, highlight the row, scroll to it, drop the param */
    let hl = null;
    const deep = ctx.params.get("commentId");
    const counts = () => ({ "": C.real.length, published: C.real.filter((r) => r.status === 2).length, deletion_request: C.real.filter((r) => r.status === 1).length, deleted: C.real.filter((r) => r.status === 0).length });
    function paint() {
      const n = counts();
      const pills = [["", L("All", "الكل"), n[""]], ["published", L("Published", "منشور"), n.published], ["deletion_request", L("Deletion request", "طلب حذف"), n.deletion_request], ["deleted", L("Deleted", "محذوف"), n.deleted]];
      mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${L("Comments", "التعليقات")}</h3>${btn(L("Add fake comment", "إضافة تعليق وهمي"), "plus", `data-addfake ${P("add_fake_unit_comments")}`)}</div>
        <div class="segmented" role="tablist">${pills.map((p) => `<button type="button" data-ct="${p[0]}" ${P("view_unit_comments")} class="${tab === p[0] ? "is-active" : ""}">${p[1]} (${p[2]})</button>`).join("")}<button type="button" data-ct="fake" ${P("view_fake_unit_comments")} class="${tab === "fake" ? "is-active" : ""}">${L("Fake comments", "تعليقات وهمية")}</button></div><div data-l></div>`;
      const box = mount.querySelector("[data-l]");
      if (tab === "fake") {
        SA.list({ mount: box, data: C.fake, search: ["Search by user name", "البحث باسم المستخدم"], searchMatch: (r, q) => r.user_name.toLowerCase().includes(q), empty: ["There is no data to display", "لا توجد بيانات للعرض"], columns: [
          { head: ["User", "المستخدم"], cell: (r) => `<div class="cell-user">${avatar(r.user_name)}<b>${esc(r.user_name)}</b></div>` },
          { head: ["Comment", "التعليق"], cell: (r) => `<span dir="auto">${esc(r.description)}</span>` },
          { head: ["User count", "عدد المستخدمين"], cell: (r) => r.user_count },
          { head: ["Comment on", "التعليق على"], cell: onLinkFake },
          { head: ["Rating", "التقييم"], cell: (r) => stars(r.rate) },
          { head: ["Commented at", "تاريخ التعليق"], cell: (r) => esc(r.commented_at) },
          { head: ["Actions", "الإجراءات"], cell: (r) => `<div class="row gap-1">${SA.iconBtn("eye", L("View", "عرض"), `data-vf="${r.id}" ${P("view_fake_unit_comments")}`)}${SA.iconBtn("edit", L("Edit fake comment", "تعديل تعليق وهمي"), `data-ef="${r.id}" ${P("update_fake_unit_comments")}`)}${SA.iconBtn("trash", L("Delete fake comment", "حذف التعليق الوهمي"), `data-df="${r.id}" ${P("delete_fake_unit_comments")}`)}</div>` },
        ] });
        return;
      }
      SA.list({ mount: box, after: (root) => { if (hl == null) return; const v = root.querySelector(`[data-vr="${hl}"]`); if (v) v.closest("tr").style.background = "var(--color-primary-subtle)"; }, data: C.real.filter((r) => !tab || (tab === "published" ? r.status === 2 : tab === "deletion_request" ? r.status === 1 : r.status === 0)),
        search: ["Search by user name", "البحث باسم المستخدم"], searchMatch: (r, q) => r.user_name.toLowerCase().includes(q), empty: ["There is no data to display", "لا توجد بيانات للعرض"], columns: [
          { head: ["User", "المستخدم"], cell: (r) => `<div class="cell-user">${avatar(r.user_name)}<div><b>${esc(r.user_name)}</b><div class="t-xs text-tertiary">${L("Created at:", "تاريخ الإنشاء:")} ${esc(r.created_at)}</div></div></div>` },
          { head: ["Comment", "التعليق"], cell: (r) => `<span dir="auto">${esc(r.comment)}</span>` },
          { head: ["Comment on", "التعليق على"], cell: onLink },
          { head: ["Deletion reason", "سبب الحذف"], cell: (r) => (r.deleted_reason ? esc(r.deleted_reason) : "---") },
          { head: ["Rating", "التقييم"], cell: (r) => stars(r.rate) },
          { head: ["Status", "الحالة"], cell: (r) => `${statusBadge(r.status)}${r.deleted_at ? `<div class="t-xs text-tertiary">${esc(r.deleted_at)}</div>` : ""}` },
          /* a fake row's trash opens "Delete fake comment" (DeleteFakeCommentModal) */
          { head: ["Actions", "الإجراءات"], cell: (r) => `<div class="row gap-1">${SA.iconBtn("eye", L("View", "عرض"), `data-vr="${r.id}"`)}${r.is_fake ? SA.iconBtn("trash", L("Delete fake comment", "حذف التعليق الوهمي"), `data-dfr="${r.id}" ${P("delete_fake_unit_comments")}`) : r.status === 0 ? SA.iconBtn("refresh", L("Restore", "استعادة"), `data-rs="${r.id}" ${P("delete_unit_comments")}`) : SA.iconBtn("trash", L("Delete comment", "حذف التعليق"), `data-dr="${r.id}" ${P("delete_unit_comments")}`)}</div>` },
        ] });
    }
    function viewModal(r, fake) {
      const st = fake ? 2 : r.status;
      SA.modal({ id: "upCv", wide: true, title: L("View comment", "عرض التعليق"),
        body: `<div class="stack gap-4"><div class="row gap-3" style="align-items:center">${avatar(r.user_name)}<div><b>${esc(r.user_name)}</b><div class="t-xs text-tertiary">${esc(fake ? r.commented_at || r.created_at : r.created_at)}</div></div></div>
          ${fake ? kv([[L("User count", "عدد المستخدمين"), r.user_count]]) : ""}
          ${kv([[L("Rating", "التقييم"), `${"★".repeat(r.rate)}${"☆".repeat(5 - r.rate)} (${r.rate}/5)`]])}
          <div><b class="t-sm">${L("Comment", "التعليق")}</b><p class="t-sm" dir="auto" style="background:var(--color-surface-sunken);padding:var(--space-3);border-radius:var(--radius-md);margin-top:var(--space-1)">${esc(fake ? r.description || r.comment : r.comment)}</p></div>
          ${kv([[L("Comment on", "تعليق على"), `${r.source_type === "public_event" ? L("Public event", "حدث عام") : L("Booking", "حجز")} · ${L("ID", "المعرف")}: #${r.ref || "---"}`], [L("Unit / package name", "اسم الوحدة / الباقة"), esc(u.name)], [L("Company name", "اسم الشركة"), esc(u.partner.company_name)],
            [L("Status", "الحالة"), st === 0 ? badge("danger", L("Deleted", "محذوف")) : st === 1 ? badge("warning", L("Pending deletion", "بانتظار الحذف")) : badge("success", L("Published", "منشور"))]])}
          ${r.deleted_reason ? `<div class="alert alert--danger"><div class="alert__body"><b>${L("Deletion reason", "سبب الحذف")}</b><br>${esc(r.deleted_reason)}</div></div>` : ""}
          ${r.deleted_at ? kv([[L("Deleted at", "تاريخ الحذف"), esc(r.deleted_at)]]) : ""}
          ${r.ref ? `<a class="btn btn--sm btn--secondary" style="align-self:flex-start" href="${UP.href(r.source_type === "public_event" ? "public-events" : "bookings", { view: r.ref })}">${r.source_type === "public_event" ? L("Open public event", "فتح الفعالية العامة") : L("Open booking", "فتح الحجز")}</a>` : "" /* no entity link without an id */}</div>`,
        foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button>` });
    }
    function fakeForm(r) {
      const d = r ? Object.assign({}, r) : { user_name: "", user_count: "1", rate: 0, description: "", commented_at: "", source_type: "" };
      const body = () => `<div class="stack gap-4"><div data-top></div>
        ${SA.field(["User name", "اسم المستخدم"], `<input class="input" data-f="user_name" value="${esc(d.user_name)}"><div data-e="user_name"></div>`, { req: true })}
        ${SA.field(["User count", "عدد المستخدمين"], `<input class="input" type="number" min="1" data-f="user_count" value="${esc(d.user_count)}"><div data-e="user_count"></div>`, { req: true })}
        <div class="field"><label class="field__label">${L("Rating", "التقييم")} <span class="req">*</span></label><div class="row gap-1" style="align-items:center">
          ${[1, 2, 3, 4, 5].map((s) => `<button type="button" class="icon-btn" data-star="${s}" aria-label="${L(`Rate ${s} out of 5`, `تقييم ${s} من 5`)}" style="color:${s <= d.rate ? "var(--color-warning)" : "var(--color-text-disabled)"}">${ic("star")}</button>`).join("")}
          <span class="t-xs text-tertiary">${d.rate ? L(`${d.rate} stars`, `${d.rate} نجوم`) : L("Select rating", "اختر التقييم")}</span>
          ${d.rate ? `<button type="button" class="btn btn--sm btn--ghost" data-clear>${L("Clear selection", "إلغاء التحديد")}</button>` : ""}</div><div data-e="rate"></div></div>
        ${SA.field(["Description / comment", "الوصف / التعليق"], `<textarea class="input" rows="4" data-f="description">${esc(d.description)}</textarea><div data-e="description"></div>`, { req: true })}
        ${SA.field(["Date & time", "التاريخ والوقت"], `<input class="input" type="datetime-local" step="900" max="${new Date().toISOString().slice(0, 16)}" data-f="commented_at" value="${esc((d.commented_at || "").slice(0, 16).replace(" ", "T"))}"><div data-e="commented_at"></div>`, { req: true, hint: ["Only past or current date and time can be selected.", "يُسمح فقط باختيار تاريخ ووقت في الماضي أو الآن."] })}
        ${SA.field(["Source type", "نوع المصدر"], SA.select([["", L("Select source type", "اختر نوع المصدر")], ["booking", L("Booking", "حجز"), d.source_type === "booking"], ["public_event", L("Public event", "حدث عام"), d.source_type === "public_event"]], 'data-f="source_type"') + '<div data-e="source_type"></div>', { req: true })}</div>`;
      const el = SA.modal({ id: "upFake", wide: true, title: r ? L("Edit fake comment", "تعديل تعليق وهمي") : L("Add fake comment", "إضافة تعليق وهمي"), body: body(), foot: foot(L("Submit", "إرسال")) });
      const b = el.querySelector(".modal__body");
      b.oninput = (e) => { const k = e.target.dataset.f; if (k) d[k] = e.target.value; };
      b.onchange = b.oninput;
      b.onclick = (e) => { const s = e.target.closest("[data-star]"); if (s) { d.rate = +s.dataset.star; b.innerHTML = body(); } if (e.target.closest("[data-clear]")) { d.rate = 0; b.innerHTML = body(); } };
      ok(el, () => {
        let bad = false;
        ["user_name", "user_count", "description", "commented_at", "source_type"].forEach((k) => { const box = el.querySelector(`[data-e="${k}"]`); box.innerHTML = ""; if (!String(d[k] || "").trim() || (k === "user_count" && +d[k] < 1)) { box.innerHTML = errLine(L("This field is required", "هذا الحقل مطلوب")); bad = true; } });
        el.querySelector('[data-e="rate"]').innerHTML = d.rate ? "" : errLine(L("This field is required", "هذا الحقل مطلوب"));
        if (!d.rate) bad = true;
        if (bad) return (el.querySelector("[data-top]").innerHTML = `<div class="alert alert--danger"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${L("Please fill in all required fields with valid values.", "يرجى تعبئة جميع الحقول المطلوبة بقيم صحيحة.")}</div></div>`);
        /* add: POST /units/{id}/fake-comments · edit: PUT …/fake-comments/{fid} */
        const rec = { user_name: d.user_name.trim(), user_count: +d.user_count, rate: d.rate, description: d.description, commented_at: d.commented_at.replace("T", " ") + ":00", source_type: d.source_type, ref: r ? r.ref : 5012 };
        if (r) Object.assign(r, rec); else C.fake.unshift(Object.assign({ id: Date.now() }, rec));
        tab = "fake";
        SA.close(el); paint();
      });
    }
    mount.addEventListener("click", (e) => {
      const t = e.target.closest("[data-ct]"); if (t) { tab = t.dataset.ct; return paint(); }
      if (e.target.closest("[data-addfake]")) return fakeForm(null);
      const g = (a) => e.target.closest(`[${a}]`);
      const find = (arr, a) => arr.find((x) => String(x.id) === g(a).getAttribute(a));
      if (g("data-vr")) { const r = find(C.real, "data-vr"); viewModal(r, !!r.is_fake); }
      if (g("data-dfr")) { const r = find(C.real, "data-dfr"); confirmDelete(L("Delete fake comment", "حذف التعليق الوهمي"), L("Please confirm that you want to delete this fake comment.", "يرجى تأكيد أنك تريد حذف هذا التعليق الوهمي."), () => { C.real.splice(C.real.indexOf(r), 1); paint(); }); }
      if (g("data-vf")) viewModal(find(C.fake, "data-vf"), true);
      if (g("data-ef")) fakeForm(find(C.fake, "data-ef"));
      if (g("data-rs")) { /* PUT /units/{id}/comments/{cid}/restore — no confirmation */ const r = find(C.real, "data-rs"); r.status = 2; r.deleted_at = null; r.deleted_reason = null; paint(); }
      if (g("data-dr")) { const r = find(C.real, "data-dr"); confirmDelete(L("Delete comment", "حذف التعليق"), L("Please confirm that you want to delete this comment", "يرجى تأكيد أنك تريد حذف هذا التعليق"), () => { r.status = 0; r.deleted_at = now(); paint(); }); }
      if (g("data-df")) { const r = find(C.fake, "data-df"); confirmDelete(L("Delete fake comment", "حذف التعليق الوهمي"), L("Please confirm that you want to delete this fake comment.", "يرجى تأكيد أنك تريد حذف هذا التعليق الوهمي."), () => { C.fake.splice(C.fake.indexOf(r), 1); paint(); }); }
    });
    paint();
    if (deep) {
      const r = C.real.find((x) => String(x.id) === deep);
      if (r) {
        hl = r.id; tab = ""; paint();
        requestAnimationFrame(() => { const v = mount.querySelector(`[data-vr="${r.id}"]`); if (v) v.closest("tr").scrollIntoView({ behavior: "smooth", block: "center" }); });
        viewModal(r, !!r.is_fake);
      }
      const q = new URLSearchParams(location.search); q.delete("commentId"); history.replaceState(null, "", "?" + q.toString());
    }
  };

  /* ================= assigned employees (owner first, coordinator contact) ================= */
  UP.tabs["assigned-employees"] = (mount, ctx) => {
    const u = ctx.unit, p = ctx.partner;
    const rows = [{ id: 0, name: p.owner_name || p.company_name, owner: true, phone: p.partner_phone, email: p.email, created_at: p.created_at, coordinator_contact: 1 }]
      .concat(p.employees.slice(0, 3).map((e, i) => Object.assign({}, e, { coordinator_contact: i % 2 })));
    mount.innerHTML = `<h3 class="t-title">${L("Employees", "الموظفون")}</h3><div data-l></div>`;
    SA.list({ mount: mount.querySelector("[data-l]"), data: rows, empty: ["There is no data to display", "لا توجد بيانات للعرض"], columns: [
      { head: ["Name", "الاسم"], cell: (r) => `<div class="cell-user">${avatar(r.name)}<div><b>${esc(r.name)}</b>${r.owner ? ` <span class="text-tertiary">${L("(owner)", "(المالك)")}</span>` : ""}<div class="t-xs text-tertiary">${r.created_at ? esc(r.created_at) : L("No date and time", "لا يوجد تاريخ ووقت")}</div></div></div>` },
      { head: ["Phone", "الهاتف"], cell: (r) => `<span dir="ltr">${esc(r.phone)}</span>` },
      { head: ["Email", "البريد الإلكتروني"], cell: (r) => esc(r.email) },
      { head: ["Coordinator contact", "جهة اتصال المنسق"], cell: (r) => (r.coordinator_contact ? L("On", "مفعّل") : L("Off", "غير مفعّل")) },
    ] });
    void u;
  };

  /* ================= assigned service lists (toggle per unit + drag to reorder) ================= */
  UP.tabs["assigned-services"] = (mount, ctx) => {
    const u = ctx.unit;
    if (denied(mount, "view_unit_services")) return;
    /* switch + reorder: view_unit_services AND update_units — else disabled (not hidden) */
    const canEdit = can("view_unit_services") && can("update_units");
    const noEditTip = L("You don't have permission", "ليس لديك صلاحية");
    if (!u._lists) u._lists = HF.SA.serviceLists.filter((l) => l.partner.id === u.partner.id).map((l, i) => ({ list: l, enabled: i % 3 !== 2, open: false }));
    const lists = u._lists;
    let q = "", dragFrom = null;
    const TONE = { approved: ["success", L("Approved", "موافق عليه")], pending: ["warning", L("Pending", "معلق")], not_approved: ["danger", L("Not approved", "غير موافق عليه")] };
    const svcs = (l) => HF.SA.services.filter((s) => s.service_list.id === l.id);
    function paint() {
      const qq = q.length >= 3 ? q.toLowerCase() : "";
      const shown = lists.filter((x) => !qq || x.list.name.toLowerCase().includes(qq) || svcs(x.list).some((s) => s.name.toLowerCase().includes(qq)));
      const canDrag = !qq && lists.length > 1 && canEdit;
      mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap"><h3 class="t-title">${L("Assigned service lists", "قوائم الخدمات المعيّنة")}</h3>
          <div class="input-wrap" style="min-width:min(100%,320px)"><span class="input-wrap__icon">${ic("search")}</span><input class="input" type="search" data-q value="${esc(q)}" placeholder="${L("Search by service name...", "البحث باسم الخدمة...")}"></div></div>
        ${qq && lists.length > 1 ? `<p class="t-xs text-tertiary">${L("Reordering is unavailable while searching. Clear the search to reorder lists.", "إعادة الترتيب غير متاحة أثناء البحث. امسح البحث لإعادة ترتيب القوائم.")}</p>` : ""}
        ${canDrag ? `<p class="t-xs text-tertiary">${L("Drag lists by the handle to change their display order. The new order saves automatically.", "اسحب القوائم من المقبض لتغيير ترتيب العرض. يُحفظ الترتيب الجديد تلقائياً.")}</p>` : ""}
        ${!lists.length ? `<p class="text-tertiary">${L("No service lists have been assigned to this unit yet.", "لم يتم تعيين أي قوائم خدمات لهذه الوحدة بعد.")}</p>`
          : !shown.length ? `<p class="text-tertiary">${L("No service lists match your search.", "لا توجد قوائم خدمات تطابق بحثك.")}</p>`
            : `<div class="stack gap-3">${shown.map((x) => {
              const t = TONE[x.list.status] || ["", cap(x.list.status) || "—"], ss = svcs(x.list); /* a matching list shows all its services (AssignedServicesPage filters lists only) */
              return `<div class="form-section${x.open ? " is-open" : ""}" data-item="${lists.indexOf(x)}" ${canDrag ? 'draggable="true"' : ""} style="${x.enabled ? "" : "opacity:.6"}">
                <div class="form-section__head" style="cursor:${canDrag ? "grab" : "default"}">
                  ${canDrag ? `<span class="text-tertiary" aria-hidden="true" title="${L("Drag lists by the handle to change their display order. The new order saves automatically.", "اسحب القوائم من المقبض لتغيير ترتيب العرض. يُحفظ الترتيب الجديد تلقائياً.")}">⋮⋮</span>` : ""}
                  <button type="button" class="form-section__txt" data-tog="${lists.indexOf(x)}" aria-expanded="${x.open}" style="text-align:start;flex:1"><span class="form-section__title">${esc(x.list.name)} ${badge(t[0], t[1])}</span></button>
                  <label class="switch row gap-2" style="align-items:center${canEdit ? "" : ";cursor:not-allowed;opacity:.55"}"${canEdit ? "" : ` data-tip="${noEditTip}"`}><span class="t-xs text-tertiary">${x.enabled ? L("Enabled", "مفعّل") : L("Disabled", "معطّل")}</span><input type="checkbox" data-en="${lists.indexOf(x)}" ${x.enabled ? "checked" : ""} ${canEdit ? "" : "disabled"} aria-label="${L("Enable or disable this service list for this unit only", "تفعيل أو تعطيل قائمة الخدمات هذه لهذه الوحدة فقط")}"><span class="switch__track"></span></label>
                  <span class="form-section__chev">${ic("chevronDown")}</span></div>
                ${x.open ? `<div class="form-section__body">${ss.length ? SA.table({ rows: ss, empty: [""], columns: [
                  { head: ["Service name", "اسم الخدمة"], cell: (s) => `<b>${esc(s.name)}</b>` },
                  { head: ["Description", "الوصف"], cell: (s) => (s.description ? `<span style="display:block;max-width:420px">${esc(s.description)}</span>` : "—") },
                  { head: ["Price", "السعر"], cell: (s) => `${s.price} ${esc(s.currency.code)}` },
                  { head: ["Duration", "المدة"], cell: (s) => (s.duration ? `${s.duration} ${L("min", "دقيقة")}` : "—") },
                  { head: ["Min selection", "الحد الأدنى للاختيار"], cell: (s) => (s.minimum_selection == null ? "—" : s.minimum_selection) },
                  { head: ["Max quantity", "الحد الأقصى للكمية"], cell: (s) => (s.max_quantity == null ? "—" : s.max_quantity) },
                ] }) : `<p class="text-tertiary">${L("No services in this list.", "لا توجد خدمات في هذه القائمة.")}</p>`}</div>` : ""}</div>`;
            }).join("")}</div>`}`;
      const s = mount.querySelector("[data-q]");
      if (document.activeElement === document.body && q) { s.focus(); s.setSelectionRange(q.length, q.length); }
    }
    mount.addEventListener("input", (e) => { if (e.target.matches("[data-q]")) { q = e.target.value; paint(); const s = mount.querySelector("[data-q]"); s.focus(); s.setSelectionRange(q.length, q.length); } });
    mount.addEventListener("click", (e) => { const t = e.target.closest("[data-tog]"); if (t) { const x = lists[+t.dataset.tog]; x.open = !x.open; paint(); } });
    mount.addEventListener("change", (e) => { const en = e.target.dataset.en; if (en != null) { /* PATCH /units/{id}/service-lists/{listId}/toggle */ lists[+en].enabled = e.target.checked; paint(); } });
    mount.addEventListener("dragstart", (e) => { const it = e.target.closest("[data-item]"); if (it) { dragFrom = +it.dataset.item; e.dataTransfer.effectAllowed = "move"; } });
    mount.addEventListener("dragover", (e) => { const it = e.target.closest("[data-item]"); if (it && dragFrom != null) { e.preventDefault(); it.style.outline = "2px solid var(--color-primary)"; } });
    mount.addEventListener("dragleave", (e) => { const it = e.target.closest("[data-item]"); if (it) it.style.outline = ""; });
    mount.addEventListener("drop", (e) => {
      const it = e.target.closest("[data-item]");
      if (!it || dragFrom == null) return;
      e.preventDefault();
      const to = +it.dataset.item, [m] = lists.splice(dragFrom, 1);
      lists.splice(to, 0, m);
      dragFrom = null;
      /* POST /units/{id}/service-lists/reorder {service_list_ids} — optimistic, reverted on error */
      paint();
    });
    paint();
  };
})();
