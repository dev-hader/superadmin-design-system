/* Partner profile — info tabs: owner · location · gallery · documents ·
   settings · notes · qr-settings. Mirrors pages/partners/profile/{owner,
   location,gallery,documents,settings,notes,qr-settings}.
   Permissions (job keys — data-perm, demo ?perm=limited | ?perm=none):
     owner: Edit + Reset password update_partners (OwnerPage) · location / settings Edit:
     open to all (no key in the dashboard) · gallery: body view_partner_images, Upload
     add_partner_images, remove delete_partner_images, change photo update_partner_images,
     star (set as main) open · documents: Upload other document add_partner_documents, edit
     update_partner_documents, delete delete_partner_documents, eye open · notes (shared
     with the user profile, modules/note-comments): New note add_{partner|user}_notes,
     main-note Delete delete_{partner|user}_notes, reply Delete open · qr-settings: read-only. */
(function () {
  "use strict";
  const { L, esc, ic, badge } = SA;
  const { card, kv, btn, yesNo, onOff, avatar, confirmDelete } = PP;
  const ok = (el, fn) => (el.querySelector("[data-ok]").onclick = fn);
  const foot = (okLabel, danger) => `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn${danger ? " btn--danger" : ""}" data-ok>${okLabel || L("Update", "تحديث")}</button>`;
  const errLine = (m) => `<span class="field__error">${ic("warn")} ${m}</span>`;

  /* Image pick → size check → crop (stand-in for UploadCropImage /
     UploadCropImageORVideo). Shared by the pp-* tabs and the profile header.
     o: { ratio, maxMB = 1, onError(msg) }. Resolves an object URL or null. */
  PP.pickImage = (file, o) => {
    o = o || {};
    if (!file) return Promise.resolve(null);
    if ((o.maxMB || 1) * 1048576 < file.size) {
      if (o.onError) o.onError(o.sizeMsg || L("Max size 1MB for images", "الحد الأقصى للصور 1 ميجابايت"));
      return Promise.resolve(null);
    }
    if (o.onError) o.onError("");
    const pr = SA.crop(file, { ratio: o.ratio || 1 });
    /* keep the crop step above the modal that opened it */
    const c = document.getElementById("saCrop");
    if (c) document.body.appendChild(c);
    return pr;
  };

  /* ================= owner ================= */
  PP.tabs.owner = (mount, ctx) => {
    const p = ctx.partner;
    /* Redesign (2026-11-17): identity header + two grouped detail lists (contact ·
       account) instead of one long key/value card. Same fields, same two actions. */
    const row = (k, v) => `<div class="detail-row"><span class="detail-row__k">${k}</span><span class="detail-row__v" style="min-width:0;overflow-wrap:anywhere">${v}</span></div>`;
    const group = (title, rows) => `<div class="stack gap-2" style="min-width:0"><span class="t-xs text-tertiary" style="text-transform:uppercase;letter-spacing:var(--tracking-caps);font-weight:var(--weight-semibold)">${title}</span><div class="detail-list">${rows}</div></div>`;
    const paint = () => {
      mount.innerHTML = `<section class="card card--pad stack gap-6">
        <header class="row between gap-4" style="align-items:center;flex-wrap:wrap">
          <div class="row gap-4" style="align-items:center;min-width:0">
            ${avatar(p.owner_name || "-", "lg")}
            <div style="min-width:0"><b class="t-title">${p.owner_name ? esc(p.owner_name) : "---"}</b>
              <div class="t-sm text-tertiary">${L("Owner", "المالك")} · ${L("Registered on", "تاريخ التسجيل")} ${esc(p.created_at)}</div></div>
          </div>
          <div class="row gap-2" style="flex-wrap:wrap">${btn(L("Reset password", "إعادة تعيين كلمة المرور"), "lock", 'data-reset data-perm="update_partners"', "secondary")}${btn(L("Edit", "تعديل"), "edit", 'data-edit data-perm="update_partners"', "secondary")}</div>
        </header>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:var(--space-6)">
          ${group(L("Contact", "التواصل"),
            row(L("Email", "البريد الإلكتروني"), `<a href="mailto:${esc(p.email)}" style="color:var(--color-text-link)">${esc(p.email)}</a>`) +
            row(L("Phone", "الهاتف"), `<a href="tel:${esc(p.partner_phone).replace(/\s/g, "")}" dir="ltr" style="color:var(--color-text-link)">${esc(p.partner_phone)}</a>`) +
            row(L("Username", "اسم المستخدم"), p.username ? esc(p.username) : "---"))}
          ${group(L("Account", "الحساب"),
            row(L("Password", "كلمة المرور"), "*********") +
            row(L("Show in app", "إظهار في التطبيق"), p.show_in_app ? badge("success", yesNo(true)) : badge("", yesNo(false))) +
            row(L("Is independent", "مستقل"), p.is_independent ? badge("primary", L("Independent", "مستقل")) : badge("", L("Not independent", "غير مستقل"))))}
        </div>
      </section>`;
      mount.querySelector("[data-edit]").onclick = edit;
      mount.querySelector("[data-reset]").onclick = resetPw;
    };
    function edit() {
      const CODES = [["SA", "Saudi Arabia (🇸🇦)"], ["EG", "Egypt (🇪🇬)"], ["AE", "United Arab Emirates (🇦🇪)"]];
      const el = SA.modal({ id: "ppOwner", title: L("Update owner info", "تحديث معلومات المالك"),
        body: `<div class="stack gap-4">
          ${SA.field(["Name", "الاسم"], `<input class="input" data-f="name" value="${esc(p.owner_name || "")}" placeholder="${L("Enter name", "أدخل الاسم")}"><div data-e="name"></div>`)}
          ${SA.field(["Email", "البريد الإلكتروني"], `<input class="input" data-f="email" value="${esc(p.email)}" placeholder="${L("Enter email", "أدخل البريد الإلكتروني")}"><div data-e="email"></div>`)}
          ${SA.field(["Country", "البلد"], SA.select([["", L("Select a country", "اختر بلدًا")]].concat(CODES.map((c) => [c[0], c[1], c[0] === p.country.iso])), 'data-f="country"'))}
          ${SA.field(["Phone", "الهاتف"], `<input class="input" dir="ltr" data-f="phone" value="${esc(p.partner_phone.replace(/^\+\d+\s?/, ""))}" placeholder="${L("Enter phone", "أدخل رقم الهاتف")}"><div data-e="phone"></div>`)}
          ${SA.field(["Username", "اسم المستخدم"], `<input class="input" data-f="username" value="${esc(p.username || "")}" placeholder="${L("Enter username", "أدخل اسم المستخدم")}">`)}
          <label class="check"><input type="checkbox" data-f="show_in_app" ${p.show_in_app ? "checked" : ""}><span class="check__box">${ic("check")}</span>${L("Show in app", "إظهار في التطبيق")}</label>
          <label class="check"><input type="checkbox" data-f="is_independent" ${p.is_independent ? "checked" : ""}><span class="check__box">${ic("check")}</span>${L("Is independent", "مستقل")}</label>
        </div>`, foot: foot() });
      ok(el, () => {
        const v = (k) => el.querySelector(`[data-f="${k}"]`);
        const e = (k, m) => (el.querySelector(`[data-e="${k}"]`).innerHTML = m ? errLine(m) : "");
        ["name", "email", "phone"].forEach((k) => e(k));
        let bad = false;
        const n = v("name").value.trim();
        if (!n) { e("name", L("This field is required", "هذا الحقل مطلوب")); bad = true; }
        else if (n.length < 3) { e("name", L("Minimum 3 symbols", "3 رموز كحد أدنى")); bad = true; }
        else if (n.length > 50) { e("name", L("Maximum 50 symbols", "50 رمزًا كحد أقصى")); bad = true; }
        const em = v("email").value.trim();
        if (!em) { e("email", L("This field is required", "هذا الحقل مطلوب")); bad = true; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { e("email", L("Wrong email format", "صيغة البريد الإلكتروني خاطئة")); bad = true; }
        else if (em.length < 3) { e("email", L("Minimum 3 symbols", "3 رموز كحد أدنى")); bad = true; }
        else if (em.length > 50) { e("email", L("Maximum 50 symbols", "50 رمزًا كحد أقصى")); bad = true; }
        /* same phoneRegExp as EditOwnerProfileModal.js — accepts formatted numbers
           (+966 (555) 123-4567, 555 123 4567, 5551234567) */
        const PHONE_RE = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
        const ph = v("phone").value.trim();
        if (!ph) { e("phone", L("This field is required", "هذا الحقل مطلوب")); bad = true; }
        else if (!PHONE_RE.test(ph)) { e("phone", L("Phone number is not valid", "رقم الهاتف غير صالح")); bad = true; }
        if (bad) return;
        /* POST /partners/{id}/update-owner-info */
        Object.assign(p, { owner_name: n, email: v("email").value, username: v("username").value || null, show_in_app: v("show_in_app").checked, is_independent: v("is_independent").checked });
        SA.close(el); paint();
      });
    }
    function resetPw() {
      const el = SA.modal({ id: "ppPw", title: L("Reset password", "إعادة تعيين كلمة المرور"),
        body: `<div class="stack gap-4">
          ${SA.field(["New password", "كلمة المرور الجديدة"], `<input class="input" type="password" dir="ltr" data-f="pw" placeholder="${L("Enter password", "أدخل كلمة المرور")}"><div data-e="pw"></div>`)}
          ${SA.field(["Confirm password", "تأكيد كلمة المرور"], `<input class="input" type="password" dir="ltr" data-f="pw2" placeholder="${L("Enter confirm password", "أدخل تأكيد كلمة المرور")}"><div data-e="pw2"></div>`)}
        </div>`, foot: foot() });
      ok(el, () => {
        const a = el.querySelector('[data-f="pw"]').value, b = el.querySelector('[data-f="pw2"]').value;
        const e = (k, m) => (el.querySelector(`[data-e="${k}"]`).innerHTML = m ? errLine(m) : "");
        e("pw"); e("pw2");
        if (!a) return e("pw", L("Password is required", "كلمة المرور مطلوبة"));
        if (a.length < 8) return e("pw", L("Minimum 8 symbols", "8 رموز كحد أدنى"));
        if (a.length > 50) return e("pw", L("Maximum 50 symbols", "50 رمزًا كحد أقصى"));
        if (!b) return e("pw2", L("Password confirmation is required", "تأكيد كلمة المرور مطلوب"));
        if (b.length > 50) return e("pw2", L("Maximum 50 symbols", "50 رمزًا كحد أقصى"));
        if (a !== b) return e("pw2", L("Password and confirm password didn't match", "كلمة المرور وتأكيد كلمة المرور غير متطابقين"));
        /* POST /partners/{id}/update-password */
        SA.close(el);
      });
    }
    paint();
  };

  /* ================= location ================= */
  PP.tabs.location = (mount, ctx) => {
    const p = ctx.partner;
    const paint = () => {
      mount.innerHTML = card(L("Location", "الموقع"), btn(L("Edit", "تعديل"), "edit", "data-edit", "secondary"),
        kv([[L("Country", "البلد"), esc(p.country && p.country.name)], [L("State", "الولاية"), esc(p.state && p.state.name)], [L("City", "المدينة"), esc(p.city && p.city.name)]]));
      mount.querySelector("[data-edit]").onclick = edit;
    };
    function edit() {
      const GEO = HF.SA.GEO.filter((g) => g.country.iso === p.country.iso);
      let st = String(p.state.id), ci = String(p.city.id);
      const body = () => {
        const states = GEO.map((g) => g.state).filter((s, i, a) => a.findIndex((x) => x.id === s.id) === i);
        const cities = GEO.filter((g) => String(g.state.id) === st).map((g) => g.city);
        return `<div class="stack gap-4">
          ${SA.field(["Country", "البلد"], SA.select([[p.country.iso, p.country.name, true]], "disabled"))}
          ${SA.field(["State", "الولاية"], SA.select([["", L("Select", "اختر")]].concat(states.map((s) => [s.id, s.name, String(s.id) === st])), 'data-f="state"'))}
          ${SA.field(["City", "المدينة"], SA.select([["", L("Select", "اختر")]].concat(cities.map((c) => [c.id, c.name, String(c.id) === ci])), 'data-f="city"'))}
        </div>`;
      };
      const el = SA.modal({ id: "ppLoc", title: L("Update location", "تحديث الموقع"), body: body(), foot: foot() });
      el.querySelector(".modal__body").onchange = (e) => {
        if (e.target.dataset.f === "state") { st = e.target.value; ci = ""; el.querySelector(".modal__body").innerHTML = body(); }
        if (e.target.dataset.f === "city") ci = e.target.value;
      };
      ok(el, () => {
        /* POST /partners/{id}/update-location {country_iso, state_id, city_id} */
        const g = HF.SA.GEO.find((x) => String(x.state.id) === st);
        if (g) { p.state = g.state; p.city = (HF.SA.GEO.find((x) => String(x.city.id) === ci) || g).city; }
        SA.close(el); paint();
      });
    }
    paint();
  };

  /* ================= gallery ================= */
  /* Shared by the partner gallery and the branch gallery (pp-catalog.js):
     per-type size check (images 1MB / videos 10MB), crop step for images at
     1.415:1, eye opens the file in a new tab, star inactive on the main photo. */
  const SAMPLE_FILE = "assets/img/logo-mark.svg"; /* stand-in for item.image (the file URL) */
  /* keys: { del, upd } job keys for remove / change photo (partner by default; the
     branch gallery passes delete_branch_images / update_branch_images) */
  PP.galleryTiles = (g, keys) => { keys = keys || { del: "delete_partner_images", upd: "update_partner_images" }; return `<div class="sa-gallery">${g.map((x) => `<figure class="sa-tile${x.main_photo ? " is-main" : ""}">
      <div class="sa-tile__media"${x.image && x.is_image ? ` style="background:var(--color-surface-sunken) url('${esc(x.image)}') center/cover no-repeat"` : ""}>${x.image && x.is_image ? "" : `${ic(x.is_image ? "camera" : "flash")}<span class="t-xs">${x.is_image ? L("Image", "صورة") : L("Video", "فيديو")}</span>`}</div>
      <figcaption class="row gap-1">
        ${x.main_photo ? "" : SA.iconBtn("trash", L("Remove photo", "إزالة الصورة"), `data-del="${x.id}" data-perm="${keys.del}"`)}
        ${x.main_photo ? SA.iconBtn("star", L("Main photo", "الصورة الرئيسية"), 'disabled aria-disabled="true" style="color:var(--color-warning);cursor:default"')
          : SA.iconBtn("star", L("Set as main photo", "تعيين كصورة رئيسية"), `data-main="${x.id}"`)}
        ${SA.iconBtn("edit", L("Change photo", "تغيير الصورة"), `data-up="${x.id}" data-perm="${keys.upd}"`)}
        <a class="icon-btn" href="${esc(x.image || SAMPLE_FILE)}" target="_blank" rel="noreferrer" aria-label="${L("View", "عرض")}" data-tip="${L("View", "عرض")}">${ic("eye")}</a>
      </figcaption></figure>`).join("")}</div>`; };
  /* the Upload Image OR Video modal; done({ image, is_image }) on Save */
  PP.galleryUpload = (done) => {
    let picked = null;
    const el = SA.modal({ id: "ppUpload", static: true, title: L("Upload image or video", "رفع صورة أو فيديو"),
      body: `<div class="stack gap-3"><p class="t-xs text-tertiary">${L("Images: max size 1MB | Videos: max size 10MB", "الصور: الحد الأقصى 1 ميجابايت | الفيديوهات: الحد الأقصى 10 ميجابايت")}</p>
        <div data-err></div>
        <label class="dropzone" style="cursor:pointer">${ic("upload")}<b data-dz>${L("No file uploaded yet", "لم يتم رفع أي ملف بعد")}</b><span class="t-xs">${L("Upload", "رفع")}</span><input type="file" accept="image/*,video/*" style="display:none" data-file></label>
        <div data-info></div></div>`,
      foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button><button class="btn" data-ok disabled>${L("Save", "حفظ")}</button>` });
    const err = (m) => (el.querySelector("[data-err]").innerHTML = m ? `<div class="alert alert--danger"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${m}</div></div>` : "");
    el.querySelector("[data-file]").onchange = (ev) => {
      const f = ev.target.files[0];
      ev.target.value = "";
      if (!f) return;
      const isImg = /^image\//.test(f.type), isVid = /^video\//.test(f.type);
      /* UploadCropImageORVideo: images 1MB, videos 10MB, each with its own message */
      if (isImg && f.size > 1048576) return err(L("Max size 1MB for images", "الحد الأقصى للصور 1 ميجابايت"));
      if (isVid && f.size > 10485760) return err(L("Max size 10MB for videos", "الحد الأقصى للفيديوهات 10 ميجابايت"));
      err("");
      const show = (url) => {
        if (!url) return;
        picked = { image: url, is_image: isImg };
        el.querySelector("[data-dz]").textContent = f.name;
        el.querySelector("[data-info]").innerHTML = kv([[L("File name:", "اسم الملف:"), esc(f.name)], [L("File size:", "حجم الملف:"), (f.size / 1048576).toFixed(2) + " MB"]]);
        el.querySelector("[data-ok]").disabled = false;
      };
      if (isImg) PP.pickImage(f, { ratio: 1.415 }).then(show);
      else show(URL.createObjectURL(f));
    };
    ok(el, () => { if (!picked) return; done(picked); SA.close(el); });
  };
  PP.tabs.gallery = (mount, ctx) => {
    const p = ctx.partner;
    const paint = () => {
      const g = p.gallery;
      mount.innerHTML = card(`${L("Gallery", "معرض")} (${g.length})`,
        `<div class="stack" data-perm="add_partner_images" style="align-items:flex-end;gap:var(--space-1)">${btn(L("Upload", "رفع"), "upload", "data-up")}<span class="t-xs" style="color:var(--color-danger)">${L("Images: max size 1MB | Videos: max size 10MB", "الصور: الحد الأقصى 1 ميجابايت | الفيديوهات: الحد الأقصى 10 ميجابايت")}</span></div>`,
        /* GalleryPage: without view_partner_images the body is the NotHavePermissions card */
        !RD.can("view_partner_images") ? RD.noPermission()
        : g.length ? PP.galleryTiles(g)
          : `<p class="text-tertiary">${L("No photo has been added, you can upload photos by pressing the upload button", "لم يتم إضافة أي صور، يمكنك رفع الصور بالضغط على زر الرفع")}</p>`);
    };
    mount.addEventListener("click", (e) => {
      const d = e.target.closest("[data-del]"), m = e.target.closest("[data-main]"), u = e.target.closest("[data-up]");
      /* DELETE /partners/{id}/gallery/{photoId} */
      if (d) confirmDelete(L("Delete item", "حذف العنصر"), L("Please confirm that you want to delete this item", "يرجى تأكيد أنك تريد حذف هذا العنصر"), () => { p.gallery = p.gallery.filter((x) => String(x.id) !== d.dataset.del); paint(); });
      /* PUT /partners/{id}/gallery/{photoId}/set-as-main */
      if (m) { p.gallery.forEach((x) => (x.main_photo = String(x.id) === m.dataset.main ? 1 : 0)); paint(); }
      if (u) PP.galleryUpload((f) => {
        /* POST /partners/{id}/gallery (images[0]) · edit: POST …/gallery/{photoId} _method=put */
        if (u.dataset.up === "") p.gallery.push({ id: Date.now(), image: f.image, is_image: f.is_image, main_photo: 0 });
        else Object.assign(p.gallery.find((x) => String(x.id) === u.dataset.up) || {}, f);
        paint();
      });
    });
    paint();
  };

  /* ================= documents ================= */
  PP.tabs.documents = (mount, ctx) => {
    const p = ctx.partner;
    const head = document.createElement("div");
    const listMount = document.createElement("div");
    mount.append(head, listMount);
    head.innerHTML = `<div class="row between gap-3" style="align-items:center"><h3 class="t-title">${L("Documents", "وثائق")}</h3>${btn(L("Upload other document", "رفع وثيقة أخرى"), "upload", 'data-new data-perm="add_partner_documents"')}</div>`;
    const ctl = SA.list({
      mount: listMount, data: p.documents, empty: ["There is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["Name", "الاسم"], cell: (r) => `<b>${esc(r.file_name)}</b>` },
        { head: ["Uploaded by", "رفع بواسطة"], cell: (r) => esc(r.uploaded_by.name) },
        { head: ["Uploaded at", "تاريخ الرفع"], cell: (r) => esc(r.uploaded_at) },
        { head: ["Actions", "الإجراءات"], cell: (r) => `<div class="row gap-1"><a class="icon-btn" href="${esc(r.file_path && r.file_path !== "#" ? r.file_path : "assets/img/logo-mark.svg")}" target="_blank" rel="noreferrer" aria-label="${L("View", "عرض")}" data-tip="${L("View", "عرض")}">${ic("eye")}</a>${SA.iconBtn("edit", L("Edit document", "تعديل الوثيقة"), `data-ed="${r.id}" data-perm="update_partner_documents"`)}${SA.iconBtn("trash", L("Delete", "حذف"), `data-del="${r.id}" data-perm="delete_partner_documents"`)}</div>` },
      ],
    });
    function form(r) {
      const el = SA.modal({ id: "ppDoc", title: r ? L("Edit document", "تعديل الوثيقة") : L("Upload other document", "رفع وثيقة أخرى"),
        body: `<div class="stack gap-4">
          ${SA.field(["File Name:", "اسم الملف:"], `<input class="input" data-f="n" value="${r ? esc(r.file_name) : ""}" placeholder="${L("Enter file name", "أدخل اسم الملف")}"><div data-e></div>`)}
          ${SA.field(["Attachment:", "المرفق:"], `<input class="input" type="file" accept=".png,.jpg,.jpeg,.pdf">`)}
        </div>`, foot: foot(r ? L("Update", "تحديث") : L("Create", "إنشاء")) });
      ok(el, () => {
        const n = el.querySelector('[data-f="n"]').value.trim();
        if (!r && !n) return (el.querySelector("[data-e]").innerHTML = errLine(L("This field is required", "هذا الحقل مطلوب")));
        if (n && n.length < 2) return (el.querySelector("[data-e]").innerHTML = errLine(L("Minimum 3 symbols", "3 رموز كحد أدنى")));
        if (n.length > 50) return (el.querySelector("[data-e]").innerHTML = errLine(L("Maximum 50 symbols", "50 رمزًا كحد أقصى")));
        /* POST /partners/{id}/documents · edit: POST …/documents/{docId} _method=put */
        if (r) { if (n) r.file_name = n; } else p.documents.unshift({ id: Date.now(), file_name: n, file_path: "#", uploaded_by: { name: "Super Admin" }, uploaded_at: new Date().toISOString().slice(0, 19).replace("T", " ") });
        SA.close(el); ctl.paint();
      });
    }
    head.querySelector("[data-new]").onclick = () => form(null);
    listMount.addEventListener("click", (e) => {
      const ed = e.target.closest("[data-ed]"), d = e.target.closest("[data-del]");
      if (ed) form(ctl.rowById(ed.dataset.ed));
      if (d) { const r = ctl.rowById(d.dataset.del); confirmDelete(`${L("Delete", "حذف")} ${esc(r.file_name)}`, L("Please confirm that you want to delete this item", "يرجى تأكيد أنك تريد حذف هذا العنصر"), () => { p.documents.splice(p.documents.indexOf(r), 1); ctl.paint(); }); }
    });
  };

  /* ================= settings ================= */
  const SETTINGS = [
    ["allow_booking_online_payment", ["Online booking Payment", "الدفع الإلكتروني للحجوزات"], ["Allow To Select Online Payment Option For Bookings", "السماح بخيار الدفع الإلكتروني للحجوزات"]],
    ["allow_public_event_online_payment", ["Online public event Payment", "الدفع الإلكتروني للفعاليات العامة"], ["Allow To Select Online Payment Option For Public Events", "السماح بخيار الدفع الإلكتروني للفعاليات العامة"]],
    ["allow_multi_booking_online_payment", ["Online Multi-Booking Payment", "الدفع الإلكتروني للحجوزات المتعددة"], ["Allow To Select Online Payment Option For Multi-Bookings", "السماح بخيار الدفع الإلكتروني للحجوزات المتعددة"]],
    ["allow_tax", ["Tax", "الضريبة"], ["Allow tax", "السماح بالضريبة"]],
    ["max_units_count", ["Max Number Of Units", "العدد الأقصى للوحدات"], ["Set The Maximum Number Of Units To Be Created For This Company", "تحديد العدد الأقصى للوحدات التي يمكن إنشاؤها لهذه الشركة"], true],
    ["allow_units_in_other_location", ["Units In Other Location", "الوحدات في مواقع أخرى"], ["Allow To Create Units In Other States/Cities", "السماح بإنشاء وحدات في ولايات/مدن أخرى"]],
    ["allow_membership_management", ["Membership Management", "إدارة العضوية"], ["Allow To Create Membership Category And Manage Members", "السماح بإنشاء فئات العضوية وإدارة الأعضاء"]],
    ["allow_create_services", ["Allow Create own services", "السماح بإنشاء الخدمات الخاصة به"], ["Allow Create own services for partner", "السماح بإنشاء الخدمات الخاصة بالشريك"]],
    ["allow_online_attendance", ["Online Attendance for Units", "السماح بالحضور أونلاين للوحدات"], ["Allow partners to create online units", "السماح للشريك بإنشاء وحدات أونلاين"]],
    ["allow_create_promo_code", ["Coupon Management", "إدارة الكوبونات"], ["Allow partners to create and manage coupons. The coupon discount cost will be deducted from the partner's revenue unless configured otherwise by the Super Admin.", "السماح للشركاء بإنشاء وإدارة الكوبونات. سيتم خصم تكلفة خصم الكوبون من إيرادات الشريك ما لم يقم المشرف العام بتكوينه بشكل مختلف."]],
    ["allow_activity_log", ["Activity Log", "سجل النشاط"], ["Allow partners to view the activity log of their employees", "السماح للشركاء بعرض سجل نشاط موظفيهم"]],
    ["allow_manual_check_in", ["Manual Check-in", "تسجيل الدخول اليدوي"], ["Allow the partner's staff to check in members by hand (by search or by entering a code), not only by scanning the QR code.", "السماح لموظفي الشريك بتسجيل دخول الأعضاء يدويًا (بالبحث أو بإدخال الرمز)، وليس فقط عن طريق مسح رمز QR."]],
  ];
  PP.tabs.settings = (mount, ctx) => {
    const s = ctx.partner.settings;
    const paint = () => {
      mount.innerHTML = card(L("Settings", "الإعدادات"), btn(L("Edit", "تعديل"), "edit", "data-edit", "secondary"),
        `<div class="data-table-scroll"><table class="data-table"><tbody>${SETTINGS.map((r) => `<tr>
          <td><b>${esc(L(...r[1]))}</b></td><td>${r[3] ? `<b>${s[r[0]] || 0}</b>` : onOff(s[r[0]])}</td>
          <td><span class="row gap-2 t-sm text-tertiary" style="align-items:flex-start"><span style="flex-shrink:0">${ic("info")}</span>${esc(L(...r[2]))}</span></td></tr>`).join("")}</tbody></table></div>`);
      mount.querySelector("[data-edit]").onclick = edit;
    };
    function edit() {
      const d = Object.assign({}, s);
      const el = SA.modal({ id: "ppSettings", wide: true, title: L("Update settings", "تحديث الإعدادات"),
        body: `<div class="stack gap-3">${SETTINGS.map((r) => `<div class="row between gap-4" style="align-items:center;padding:var(--space-2) 0;border-bottom:var(--border-thin) solid var(--color-border-subtle)">
          <span class="t-sm" style="font-weight:var(--weight-semibold)">${esc(L(...r[1]))}:</span>
          ${r[3] ? `<input class="input" type="number" min="1" placeholder="1" data-f="${r[0]}" value="${d[r[0]] || ""}" style="max-width:140px">`
            : `<label class="switch"><input type="checkbox" data-f="${r[0]}" ${d[r[0]] ? "checked" : ""} aria-label="${esc(L(...r[1]))}"><span class="switch__track"></span></label>`}</div>`).join("")}</div>`,
        foot: foot() });
      el.querySelector(".modal__body").onchange = (e) => {
        const k = e.target.dataset.f;
        if (!k) return;
        if (k === "allow_manual_check_in" && !e.target.checked) {
          e.target.checked = true;
          const w = SA.modal({ id: "ppMci", title: L("Turn off manual check-in?", "إيقاف تسجيل الدخول اليدوي؟"),
            body: `<div class="alert alert--warning"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${L("Staff will only be able to check in by scanning the QR code. Manual check-in will not work.", "لن يتمكن الموظفون من تسجيل الدخول إلا عن طريق مسح رمز QR. لن يعمل تسجيل الدخول اليدوي.")}</div></div>`,
            foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn btn--danger" data-ok>${L("Confirm", "تأكيد")}</button>` });
          ok(w, () => { e.target.checked = false; d.allow_manual_check_in = 0; SA.close(w); });
          return;
        }
        d[k] = e.target.type === "checkbox" ? (e.target.checked ? 1 : 0) : +e.target.value;
      };
      ok(el, () => { /* POST /partners/{id}/update-settings */ Object.assign(s, d); SA.close(el); paint(); });
    }
    paint();
  };

  /* ================= notes ================= */
  PP.tabs.notes = (mount, ctx) => {
    const p = ctx.partner;
    /* modules/note-comments: HeaderNoteComment add_{type}_notes · MainNoteComment
       delete_{type}_notes (type = user | partner); reply delete has no key */
    const NK = ctx.type === "user" ? "user" : "partner";
    let composer = false;
    const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");
    const compose = (replyTo) => `<form class="row gap-3" data-compose="${replyTo || ""}" style="align-items:flex-start">${avatar("Super Admin")}
      <textarea class="input" rows="1" placeholder="${L("Write a note", "اكتب ملاحظة")}" aria-label="${L("Note", "ملاحظة")}" style="flex:1"></textarea>
      <button class="btn btn--sm" type="submit">${ic("send")}<span>${L("Send", "إرسال")}</span></button></form>`;
    const paint = () => {
      mount.innerHTML = card(`${L("Notes", "ملحوظات")} (${p.notes.length})`, btn(L("New note", "ملاحظة جديدة"), "plus", `data-new data-perm="add_${NK}_notes"`),
        `${composer ? compose() : ""}
        ${p.notes.length ? p.notes.map((n) => `<article class="card card--pad stack gap-3" style="box-shadow:none">
          <div class="row between gap-3"><span class="row gap-3" style="align-items:center">${avatar(n.comment_by.name)}<b>${esc(n.comment_by.name)}</b></span>
            ${btn(L("Delete", "حذف"), "trash", `data-del="${n.id}" data-perm="delete_${NK}_notes"`, "ghost")}</div>
          <p class="t-sm" dir="auto" style="white-space:pre-wrap">${esc(n.comment)}</p>
          <div class="row gap-4 t-xs text-tertiary" style="align-items:center">${ic("calendar")} ${L("Write on:", "كتب في:")} ${esc(n.created_at)}
            <button type="button" class="btn btn--sm btn--ghost" data-rep="${n.id}" ${n.replies.length ? "" : "disabled"}>${n.replies.length} ${L("Replies", "ردود")}</button></div>
          <div data-replies="${n.id}" class="stack gap-3" style="padding-inline-start:var(--space-8)" hidden>${n.replies.map((r) => `<div class="row between gap-3"><span class="row gap-3" style="align-items:flex-start">${avatar(r.comment_by.name, "xs")}
              <span><b class="t-sm">${esc(r.comment_by.name)}</b> <span class="t-xs text-tertiary">${esc(r.created_at)}</span><div class="t-sm" dir="auto">${esc(r.comment)}</div></span></span>
              ${SA.iconBtn("trash", L("Delete", "حذف"), `data-delr="${n.id}:${r.id}"`)}</div>`).join("")}</div>
          ${compose(n.id)}</article>`).join("") : `<p class="text-tertiary">${L("No data", "لا توجد بيانات")}</p>`}`);
    };
    mount.addEventListener("click", (e) => {
      if (e.target.closest("[data-new]")) { composer = !composer; paint(); }
      const rp = e.target.closest("[data-rep]");
      if (rp) { const box = mount.querySelector(`[data-replies="${rp.dataset.rep}"]`); box.hidden = !box.hidden; }
      const d = e.target.closest("[data-del]");
      if (d) confirmDelete(L("Delete note", "حذف الملاحظة"), `${L("Are you sure you want to delete this note post?", "هل أنت متأكد من أنك تريد حذف هذه الملاحظة؟")}<br><span style="color:var(--color-danger)">${L("Please note that deleting this note post will delete all related comments!", "يرجى ملاحظة أن حذف هذه الملاحظة سيؤدي إلى حذف جميع التعليقات المرتبطة بها!")}</span>`,
        () => { p.notes = p.notes.filter((n) => String(n.id) !== d.dataset.del); paint(); });
      const dr = e.target.closest("[data-delr]");
      if (dr) { const [nid, rid] = dr.dataset.delr.split(":"); confirmDelete(L("Delete note", "حذف الملاحظة"), L("Are you sure that you to delete this comment?", "هل أنت متأكد من أنك تريد حذف هذا التعليق؟"),
        () => { const n = p.notes.find((x) => String(x.id) === nid); n.replies = n.replies.filter((r) => String(r.id) !== rid); paint(); }); }
    });
    mount.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target.closest("[data-compose]");
      const t = f.querySelector("textarea");
      if (!t.value.trim()) { t.classList.add("is-error"); t.setAttribute("aria-invalid", "true"); t.placeholder = L("This field is required", "هذا الحقل مطلوب"); return; }
      /* POST /note-comments {comment, type:'partner', entity_id, reply_to} */
      const item = { id: Date.now(), comment: t.value.trim(), created_at: now(), comment_by: { name: "Super Admin" }, replies: [] };
      if (f.dataset.compose) p.notes.find((n) => String(n.id) === f.dataset.compose).replies.push(item);
      else { p.notes.unshift(item); composer = false; }
      paint();
    });
    paint();
  };

  /* ================= qr-settings (read-only) ================= */
  PP.tabs["qr-settings"] = (mount, ctx) => {
    const q = ctx.partner.qr;
    let open = q.branches[0] ? q.branches[0].branch_id : null;
    const inner = {};
    const dur = (v, t) => (!v || v <= 0 ? `<span class="badge">${L("Off", "غير مفعل")}</span>`
      : t === "hour" ? L(`${v} hour${v > 1 ? "s" : ""}`, v === 1 ? "ساعة واحدة" : `${v} ساعات`)
        : t === "day" ? L(`${v} day${v > 1 ? "s" : ""}`, v === 1 ? "يوم واحد" : `${v} أيام`)
          : L(`${v} minute${v > 1 ? "s" : ""}`, `${v} دقائق`));
    const empCount = (n) => (!n ? L("No employees assigned", "لا يوجد موظفون مُعيّنون") : L(`${n} employee${n > 1 ? "s" : ""} assigned`, n === 1 ? "موظف واحد مُعيّن" : n === 2 ? "موظفان مُعيّنان" : `${n} موظفين مُعيّنين`));
    const units = (u) => (u || []).map((x) => esc(x.name || L(`Unit #${x.id}`, `الوحدة #${x.id}`))).join(L(", ", "، "));
    const paint = () => {
      mount.innerHTML = `
        ${card(L("QR code settings and assignment", "إعدادات رمز QR والتعيين"), "", `<p class="t-sm text-secondary">${L("QR scan behaviour for this partner's branches, and which employees can scan on which units.", "سلوك مسح رمز QR لفروع هذا الشريك، والموظفون المسموح لهم بالمسح في كل وحدة.")}</p>`)}
        ${card(L("General settings", "الإعدادات العامة"), "", kv([[L("Scan type", "نوع المسح"), `<b>${q.scan_type === "manual" ? L("Manual", "يدوي") : L("Automatic", "تلقائي")}</b><div class="t-xs text-tertiary">${L("Follows the manual check-in option in the settings tab.", "يتبع خيار تسجيل الحضور اليدوي في تبويب الإعدادات.")}</div>`]]))}
        ${card(L("Branches", "الفروع"), "", `<p class="t-sm text-tertiary">${L("Settings apply to all units and all booking types within each branch.", "تُطبّق الإعدادات على جميع الوحدات وكل أنواع الحجوزات داخل كل فرع.")}</p>
          ${q.branches.length ? q.branches.map((b) => {
            const isOpen = open === b.branch_id, t = inner[b.branch_id] || "barcode", s = b.barcode_settings;
            return `<div class="form-section${isOpen ? " is-open" : ""}">
              <button type="button" class="form-section__head" data-acc="${b.branch_id}" aria-expanded="${isOpen}">
                <span class="form-section__txt"><span class="form-section__title">${esc(b.branch_name || L(`Branch #${b.branch_id}`, `الفرع #${b.branch_id}`))} <span class="t-xs text-tertiary">#${b.branch_id}</span></span></span>
                <span class="badge badge--primary">${empCount(b.employees.length)}</span><span class="form-section__chev">${ic("chevronDown")}</span></button>
              ${isOpen ? `<div class="form-section__body stack gap-4">
                <div class="tabs"><button type="button" data-in="barcode" class="${t === "barcode" ? "is-active" : ""}">${L("Barcode settings", "إعدادات الباركود")}</button><button type="button" data-in="emp" class="${t === "emp" ? "is-active" : ""}">${L("Employees", "الموظفون")}</button></div>
                ${t === "barcode" ? `<div class="data-table-scroll"><table class="data-table"><tbody>
                  <tr><td><b>${L("Check-in before session starts", "الحضور قبل بداية الجلسة")}</b></td><td>${dur(s.check_in_before_session_start, s.check_in_before_session_start_type)}</td><td class="t-sm text-tertiary">${L("How early members can check in before the session begins.", "المدة التي يمكن فيها للأعضاء تسجيل الحضور قبل بداية الجلسة.")}</td></tr>
                  <tr><td><b>${L("Grace period after session starts", "فترة السماح بعد بداية الجلسة")}</b></td><td>${dur(s.grace_after_session_start, s.grace_after_session_start_type)}</td><td class="t-sm text-tertiary">${L("How long late check-in is allowed after the session starts.", "المدة المسموح فيها بتسجيل الحضور المتأخر بعد بداية الجلسة.")}</td></tr>
                  <tr><td><b>${L("Check-in after session ends", "الحضور بعد انتهاء الجلسة")}</b></td><td>${dur(s.check_in_after_session_end, s.check_in_after_session_end_type)}</td><td class="t-sm text-tertiary">${L("How long members can still check in after the session has ended.", "المدة التي يظل فيها بإمكان الأعضاء تسجيل الحضور بعد انتهاء الجلسة.")}</td></tr>
                  <tr><td><b>${L("Check-in mode", "طريقة تسجيل الحضور")}</b></td><td>${s.check_in_mode === "confirmation" ? L("Confirmation required", "يتطلب تأكيدًا") : L("Check in immediately", "تسجيل الحضور فورًا")}</td><td class="t-sm text-tertiary">${s.check_in_mode === "confirmation" ? L("The employee or partner must confirm after scanning.", "يجب على الموظف أو الشريك التأكيد بعد المسح.") : L("Member is checked in instantly on scan.", "يُسجل حضور العضو فور المسح.")}</td></tr>
                </tbody></table></div>`
                : b.employees.length ? `<div class="stack gap-3">${b.employees.map((e) => {
                    const opts = [[e.validate_qr_units, L("Validate QR", "التحقق من QR")], [e.perform_qr_units, L("Perform scan", "تنفيذ المسح")], [e.view_scan_history_units, L("Scan history", "سجل المسح")]].filter((o) => o[0] && o[0].length);
                    return `<div class="row gap-3" style="align-items:center;flex-wrap:wrap">${avatar(e.name)}<b>${esc(e.name)}</b>${opts.length ? opts.map((o) => `<span class="badge badge--info">${o[1]} · ${units(o[0])}</span>`).join("") : `<span class="badge">${L("No scan options granted", "لم تُمنح أي صلاحيات مسح")}</span>`}</div>`;
                  }).join("")}</div>` : `<p class="text-tertiary">${L("No employees are assigned to this branch yet.", "لا يوجد موظفون مُعيّنون لهذا الفرع بعد.")}</p>`}
              </div>` : ""}</div>`;
          }).join("") : `<p class="text-tertiary">${L("This partner has no branches yet.", "لا توجد فروع لهذا الشريك بعد.")}</p>`}`)}`;
    };
    mount.addEventListener("click", (e) => {
      const a = e.target.closest("[data-acc]");
      if (a) { const id = +a.dataset.acc; open = open === id ? null : id; inner[id] = "barcode"; paint(); }
      const t = e.target.closest("[data-in]");
      if (t) { inner[open] = t.dataset.in; paint(); }
    });
    paint();
  };
})();

/* ================= translation (partner · branch · service list · service) =================
   A page of its own in the dashboard (no profile header / tab bar); rendered by
   assets/js/sa-translation.js like every other translation page. */
PP.tabs.translation = (mount, ctx) => {
  const { L } = SA, p = ctx.partner, q = ctx.params;
  const bid = q.get("branch"), lid = q.get("list"), sid = q.get("service");
  /* service list / service translation are global routes in the dashboard
     (/services/service-list/:id/translation, /services/:id/translation) —
     old profile links forward to services-translation.html */
  if (sid || lid) {
    const s = sid && HF.SA.services.find((x) => String(x.id) === sid);
    const list = lid || (s && s.service_list.id) || "";
    location.replace(`services-translation.html?list=${list}${sid ? "&service=" + sid : ""}`);
    return;
  }
  if (bid) {
    const b = p.branches.find((x) => String(x.id) === bid) || p.branches[0];
    return SATR.render(mount, { key: "branch" + b.id, itemName: b.name, cols: [["name", L("Name", "الاسم")], ["description", L("Description", "الوصف")]], src: { name: b.name, description: b.description || "" }, backHref: PP.href("branches", { branch: b.id }) });
  }
  return SATR.render(mount, { key: "partner" + p.id, itemName: p.owner_name || p.company_name, editTitle: L("Edit translates", "تعديل الترجمات"),
    cols: [["company_name", L("Company name", "اسم الشركة")], ["bio", "BIO"]], src: { company_name: p.company_name, bio: p.bio || "" }, backHref: PP.href("owner") });
};
