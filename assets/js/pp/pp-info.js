/* Partner profile — info tabs: owner · location · gallery · documents ·
   settings · notes · qr-settings. Mirrors pages/partners/profile/{owner,
   location,gallery,documents,settings,notes,qr-settings}. */
(function () {
  "use strict";
  const { L, esc, ic, badge } = SA;
  const { card, kv, btn, yesNo, onOff, avatar, confirmDelete } = PP;
  const ok = (el, fn) => (el.querySelector("[data-ok]").onclick = fn);
  const foot = (okLabel, danger) => `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn${danger ? " btn--danger" : ""}" data-ok>${okLabel || L("update", "تحديث")}</button>`;
  const errLine = (m) => `<span class="field__error">${ic("warn")} ${m}</span>`;

  /* ================= owner ================= */
  PP.tabs.owner = (mount, ctx) => {
    const p = ctx.partner;
    const paint = () => {
      mount.innerHTML = card(L("owner", "المالك"), btn(L("edit", "تعديل"), "edit", "data-edit", "secondary"), kv([
        [L("name", "الاسم"), esc(p.owner_name)],
        [L("Email", "البريد الإلكتروني"), esc(p.email)],
        [L("phone", "الهاتف"), `<span dir="ltr">${esc(p.partner_phone)}</span>`],
        [L("Password", "كلمة المرور"), `<span class="row gap-3" style="align-items:center">*********${btn(L("reset password", "إعادة تعيين كلمة المرور"), "lock", "data-reset", "ghost")}</span>`],
        [L("Register On", "تاريخ التسجيل"), esc(p.created_at)],
        [L("Username", "اسم المستخدم"), p.username ? esc(p.username) : "---"],
        [L("Show in App", "إظهار في التطبيق"), yesNo(p.show_in_app)],
        [L("Is Independent", "مستقل"), p.is_independent ? L("Independent", "مستقل") : L("Not Independent", "غير مستقل")],
      ]));
      mount.querySelector("[data-edit]").onclick = edit;
      mount.querySelector("[data-reset]").onclick = resetPw;
    };
    function edit() {
      const CODES = [["SA", "Saudi Arabia (🇸🇦)"], ["EG", "Egypt (🇪🇬)"], ["AE", "United Arab Emirates (🇦🇪)"]];
      const el = SA.modal({ id: "ppOwner", title: L("update owner info", "تحديث معلومات المالك"),
        body: `<div class="stack gap-4">
          ${SA.field(["name", "الاسم"], `<input class="input" data-f="name" value="${esc(p.owner_name || "")}" placeholder="${L("enter name", "أدخل الاسم")}"><div data-e="name"></div>`)}
          ${SA.field(["Email", "البريد الإلكتروني"], `<input class="input" data-f="email" value="${esc(p.email)}" placeholder="${L("enter email", "أدخل البريد الإلكتروني")}"><div data-e="email"></div>`)}
          ${SA.field(["country", "البلد"], SA.select([["", L("Select a country", "اختر بلدًا")]].concat(CODES.map((c) => [c[0], c[1], c[0] === p.country.iso])), 'data-f="country"'))}
          ${SA.field(["phone", "الهاتف"], `<input class="input" dir="ltr" data-f="phone" value="${esc(p.partner_phone.replace(/^\+\d+\s?/, ""))}" placeholder="${L("enter phone", "أدخل رقم الهاتف")}"><div data-e="phone"></div>`)}
          ${SA.field(["Username", "اسم المستخدم"], `<input class="input" data-f="username" value="${esc(p.username || "")}" placeholder="${L("enter username", "أدخل اسم المستخدم")}">`)}
          <label class="check"><input type="checkbox" data-f="show_in_app" ${p.show_in_app ? "checked" : ""}><span class="check__box">${ic("check")}</span>${L("Show in App", "إظهار في التطبيق")}</label>
          <label class="check"><input type="checkbox" data-f="is_independent" ${p.is_independent ? "checked" : ""}><span class="check__box">${ic("check")}</span>${L("Is Independent", "مستقل")}</label>
        </div>`, foot: foot() });
      ok(el, () => {
        const v = (k) => el.querySelector(`[data-f="${k}"]`);
        const e = (k, m) => (el.querySelector(`[data-e="${k}"]`).innerHTML = m ? errLine(m) : "");
        ["name", "email", "phone"].forEach((k) => e(k));
        let bad = false;
        const n = v("name").value.trim();
        if (!n) { e("name", L("this field is required", "هذا الحقل مطلوب")); bad = true; }
        else if (n.length < 3) { e("name", L("Minimum 3 symbols", "3 رموز كحد أدنى")); bad = true; }
        else if (n.length > 50) { e("name", L("Maximum 50 symbols", "50 رمزًا كحد أقصى")); bad = true; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email").value)) { e("email", L("Wrong email format", "صيغة البريد الإلكتروني خاطئة")); bad = true; }
        if (!/^\d{7,15}$/.test(v("phone").value.replace(/\s/g, ""))) { e("phone", L("phone number is not valid", "رقم الهاتف غير صالح")); bad = true; }
        if (bad) return;
        /* POST /partners/{id}/update-owner-info */
        Object.assign(p, { owner_name: n, email: v("email").value, username: v("username").value || null, show_in_app: v("show_in_app").checked, is_independent: v("is_independent").checked });
        SA.close(el); paint();
      });
    }
    function resetPw() {
      const el = SA.modal({ id: "ppPw", title: L("reset password", "إعادة تعيين كلمة المرور"),
        body: `<div class="stack gap-4">
          ${SA.field(["new password", "كلمة المرور الجديدة"], `<input class="input" type="password" dir="ltr" data-f="pw" placeholder="${L("enter password", "أدخل كلمة المرور")}"><div data-e="pw"></div>`)}
          ${SA.field(["confirm password", "تأكيد كلمة المرور"], `<input class="input" type="password" dir="ltr" data-f="pw2" placeholder="${L("enter confirm password", "أدخل تأكيد كلمة المرور")}"><div data-e="pw2"></div>`)}
        </div>`, foot: foot() });
      ok(el, () => {
        const a = el.querySelector('[data-f="pw"]').value, b = el.querySelector('[data-f="pw2"]').value;
        const e = (k, m) => (el.querySelector(`[data-e="${k}"]`).innerHTML = m ? errLine(m) : "");
        e("pw"); e("pw2");
        if (!a) return e("pw", L("Password is required", "كلمة المرور مطلوبة"));
        if (a.length < 8) return e("pw", L("Minimum 8 symbols", "8 رموز كحد أدنى"));
        if (!b) return e("pw2", L("Password confirmation is required", "تأكيد كلمة المرور مطلوب"));
        if (a !== b) return e("pw2", L("Password and Confirm Password didn't match", "كلمة المرور وتأكيد كلمة المرور غير متطابقين"));
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
      mount.innerHTML = card(L("location", "الموقع"), btn(L("edit", "تعديل"), "edit", "data-edit", "secondary"),
        kv([[L("country", "البلد"), esc(p.country && p.country.name)], [L("state", "الولاية"), esc(p.state && p.state.name)], [L("city", "المدينة"), esc(p.city && p.city.name)]]));
      mount.querySelector("[data-edit]").onclick = edit;
    };
    function edit() {
      const GEO = HF.SA.GEO.filter((g) => g.country.iso === p.country.iso);
      let st = String(p.state.id), ci = String(p.city.id);
      const body = () => {
        const states = GEO.map((g) => g.state).filter((s, i, a) => a.findIndex((x) => x.id === s.id) === i);
        const cities = GEO.filter((g) => String(g.state.id) === st).map((g) => g.city);
        return `<div class="stack gap-4">
          ${SA.field(["country", "البلد"], SA.select([[p.country.iso, p.country.name, true]], "disabled"))}
          ${SA.field(["state", "الولاية"], SA.select([["", L("select", "اختر")]].concat(states.map((s) => [s.id, s.name, String(s.id) === st])), 'data-f="state"'))}
          ${SA.field(["city", "المدينة"], SA.select([["", L("select", "اختر")]].concat(cities.map((c) => [c.id, c.name, String(c.id) === ci])), 'data-f="city"'))}
        </div>`;
      };
      const el = SA.modal({ id: "ppLoc", title: L("update location", "تحديث الموقع"), body: body(), foot: foot() });
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
  PP.tabs.gallery = (mount, ctx) => {
    const p = ctx.partner;
    const paint = () => {
      const g = p.gallery;
      mount.innerHTML = card(`${L("gallery", "معرض")} (${g.length})`,
        `<div class="stack" style="align-items:flex-end;gap:var(--space-1)">${btn(L("Upload", "رفع"), "upload", "data-up")}<span class="t-xs" style="color:var(--color-danger)">${L("Images: max size 1MB | Videos: max size 10MB", "الصور: الحد الأقصى 1 ميجابايت | الفيديوهات: الحد الأقصى 10 ميجابايت")}</span></div>`,
        g.length ? `<div class="sa-gallery">${g.map((x) => `<figure class="sa-tile${x.main_photo ? " is-main" : ""}">
            <div class="sa-tile__media">${ic(x.is_image ? "camera" : "flash")}<span class="t-xs">${x.is_image ? L("image", "صورة") : L("video", "فيديو")}</span></div>
            <figcaption class="row gap-1">
              ${SA.iconBtn("trash", L("Remove photo", "إزالة الصورة"), `data-del="${x.id}"`)}
              ${SA.iconBtn("star", L("main photo", "الصورة الرئيسية"), `data-main="${x.id}" ${x.main_photo ? 'style="color:var(--color-warning)"' : ""}`)}
              ${SA.iconBtn("edit", L("Change photo", "تغيير الصورة"), `data-up="${x.id}"`)}
              ${SA.iconBtn("eye", L("View", "عرض"), "")}
            </figcaption></figure>`).join("")}</div>`
          : `<p class="text-tertiary">${L("no photo have been added, you can upload photos by pressing the upload button", "لم يتم إضافة أي صور، يمكنك رفع الصور بالضغط على زر الرفع")}</p>`);
    };
    mount.addEventListener("click", (e) => {
      const d = e.target.closest("[data-del]"), m = e.target.closest("[data-main]"), u = e.target.closest("[data-up]");
      if (d) confirmDelete(L("delete item", "حذف العنصر"), L("Please confirm that you want to delete this item", "يرجى تأكيد أنك تريد حذف هذا العنصر"), () => { p.gallery = p.gallery.filter((x) => String(x.id) !== d.dataset.del); paint(); });
      if (m) { p.gallery.forEach((x) => (x.main_photo = String(x.id) === m.dataset.main ? 1 : 0)); paint(); }
      if (u) {
        const el = SA.modal({ id: "ppUpload", title: L("Upload Image OR Video", "رفع صورة أو فيديو"),
          body: `<div class="stack gap-3"><p class="t-xs text-tertiary">${L("Images: max size 1MB | Videos: max size 10MB", "الصور: الحد الأقصى 1 ميجابايت | الفيديوهات: الحد الأقصى 10 ميجابايت")}</p>
            <p class="t-sm" style="color:var(--color-warning)">${L("Max Size:", "الحد الأقصى للحجم:")} 10 MB</p>
            <label class="dropzone" style="cursor:pointer">${ic("upload")}<b>${L("No Upload Any File Yet", "لم يتم رفع أي ملف بعد")}</b><span class="t-xs">${L("Upload", "رفع")}</span><input type="file" accept="image/*,video/*" style="display:none" data-file></label>
            <div data-info></div></div>`,
          foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button><button class="btn" data-ok>${L("Save", "حفظ")}</button>` });
        el.querySelector("[data-file]").onchange = (ev) => {
          const f = ev.target.files[0];
          if (f) el.querySelector("[data-info]").innerHTML = kv([[L("File Name:", "اسم الملف:"), esc(f.name)], [L("File Size:", "حجم الملف:"), (f.size / 1048576).toFixed(2) + " MB"]]);
        };
        ok(el, () => { /* POST /partners/{id}/gallery (images[0]) · edit: POST …/gallery/{photoId} _method=put */
          if (u.dataset.up === "") p.gallery.push({ id: Date.now(), is_image: true, main_photo: 0 });
          SA.close(el); paint();
        });
      }
    });
    paint();
  };

  /* ================= documents ================= */
  PP.tabs.documents = (mount, ctx) => {
    const p = ctx.partner;
    const head = document.createElement("div");
    const listMount = document.createElement("div");
    mount.append(head, listMount);
    head.innerHTML = `<div class="row between gap-3" style="align-items:center"><h3 class="t-title">${L("Documents", "مستندات")}</h3>${btn(L("upload other document", "رفع وثيقة أخرى"), "upload", "data-new")}</div>`;
    const ctl = SA.list({
      mount: listMount, data: p.documents, empty: ["there is no data to display", "لا توجد بيانات للعرض"],
      columns: [
        { head: ["name", "الاسم"], cell: (r) => `<b>${esc(r.file_name)}</b>` },
        { head: ["uploaded by", "رفع بواسطة"], cell: (r) => esc(r.uploaded_by.name) },
        { head: ["uploaded at", "تاريخ الرفع"], cell: (r) => esc(r.uploaded_at) },
        { head: ["Actions", "الإجراءات"], cell: (r) => `<div class="row gap-1"><a class="icon-btn" href="#" aria-label="${L("View", "عرض")}">${ic("eye")}</a>${SA.iconBtn("edit", L("edit document", "تعديل الوثيقة"), `data-ed="${r.id}"`)}${SA.iconBtn("trash", L("delete", "حذف"), `data-del="${r.id}"`)}</div>` },
      ],
    });
    function form(r) {
      const el = SA.modal({ id: "ppDoc", title: r ? L("edit document", "تعديل الوثيقة") : L("upload other document", "رفع وثيقة أخرى"),
        body: `<div class="stack gap-4">
          ${SA.field(["File Name:", "اسم الملف:"], `<input class="input" data-f="n" value="${r ? esc(r.file_name) : ""}" placeholder="${L("enter file name", "أدخل اسم الملف")}"><div data-e></div>`)}
          ${SA.field(["attachment:", "المرفق:"], `<input class="input" type="file" accept=".png,.jpg,.jpeg,.pdf">`)}
        </div>`, foot: foot(r ? L("update", "تحديث") : L("create", "إنشاء")) });
      ok(el, () => {
        const n = el.querySelector('[data-f="n"]').value.trim();
        if (!r && !n) return (el.querySelector("[data-e]").innerHTML = errLine("this field is required"));
        if (n && n.length < 2) return (el.querySelector("[data-e]").innerHTML = errLine("Minimum 3 symbols"));
        /* POST /partners/{id}/documents · edit: POST …/documents/{docId} _method=put */
        if (r) { if (n) r.file_name = n; } else p.documents.unshift({ id: Date.now(), file_name: n, file_path: "#", uploaded_by: { name: "Super Admin" }, uploaded_at: new Date().toISOString().slice(0, 19).replace("T", " ") });
        SA.close(el); ctl.paint();
      });
    }
    head.querySelector("[data-new]").onclick = () => form(null);
    listMount.addEventListener("click", (e) => {
      const ed = e.target.closest("[data-ed]"), d = e.target.closest("[data-del]");
      if (ed) form(ctl.rowById(ed.dataset.ed));
      if (d) { const r = ctl.rowById(d.dataset.del); confirmDelete(`${L("delete", "حذف")} ${esc(r.file_name)}`, L("Please confirm that you want to delete this item", "يرجى تأكيد أنك تريد حذف هذا العنصر"), () => { p.documents.splice(p.documents.indexOf(r), 1); ctl.paint(); }); }
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
      mount.innerHTML = card(L("Settings", "الإعدادات"), btn(L("edit", "تعديل"), "edit", "data-edit", "secondary"),
        `<div class="data-table-scroll"><table class="data-table"><tbody>${SETTINGS.map((r) => `<tr>
          <td><b>${esc(L(...r[1]))}</b></td><td>${r[3] ? `<b>${s[r[0]] || 0}</b>` : onOff(s[r[0]])}</td>
          <td><span class="row gap-2 t-sm text-tertiary" style="align-items:flex-start"><span style="flex-shrink:0">${ic("info")}</span>${esc(L(...r[2]))}</span></td></tr>`).join("")}</tbody></table></div>`);
      mount.querySelector("[data-edit]").onclick = edit;
    };
    function edit() {
      const d = Object.assign({}, s);
      const el = SA.modal({ id: "ppSettings", wide: true, title: L("update settings", "تحديث الإعدادات"),
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
    let composer = false;
    const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");
    const compose = (replyTo) => `<form class="row gap-3" data-compose="${replyTo || ""}" style="align-items:flex-start">${avatar("Super Admin")}
      <textarea class="input" rows="1" placeholder="${L("write a note", "اكتب ملاحظة")}" aria-label="${L("note", "ملاحظة")}" style="flex:1"></textarea>
      <button class="btn btn--sm" type="submit">${ic("send")}<span>${L("send", "إرسال")}</span></button></form>`;
    const paint = () => {
      mount.innerHTML = card(`${L("notes", "ملحوظات")} (${p.notes.length})`, btn(L("new note", "ملاحظة جديدة"), "plus", "data-new"),
        `${composer ? compose() : ""}
        ${p.notes.length ? p.notes.map((n) => `<article class="card card--pad stack gap-3" style="box-shadow:none">
          <div class="row between gap-3"><span class="row gap-3" style="align-items:center">${avatar(n.comment_by.name)}<b>${esc(n.comment_by.name)}</b></span>
            ${btn(L("delete", "حذف"), "trash", `data-del="${n.id}"`, "ghost")}</div>
          <p class="t-sm" dir="auto" style="white-space:pre-wrap">${esc(n.comment)}</p>
          <div class="row gap-4 t-xs text-tertiary" style="align-items:center">${ic("calendar")} ${L("write on:", "كتب في:")} ${esc(n.created_at)}
            <button type="button" class="btn btn--sm btn--ghost" data-rep="${n.id}" ${n.replies.length ? "" : "disabled"}>${n.replies.length} ${L("replies", "ردود")}</button></div>
          <div data-replies="${n.id}" class="stack gap-3" style="padding-inline-start:var(--space-8)" hidden>${n.replies.map((r) => `<div class="row between gap-3"><span class="row gap-3" style="align-items:flex-start">${avatar(r.comment_by.name, "xs")}
              <span><b class="t-sm">${esc(r.comment_by.name)}</b> <span class="t-xs text-tertiary">${esc(r.created_at)}</span><div class="t-sm" dir="auto">${esc(r.comment)}</div></span></span>
              ${SA.iconBtn("trash", L("delete", "حذف"), `data-delr="${n.id}:${r.id}"`)}</div>`).join("")}</div>
          ${compose(n.id)}</article>`).join("") : `<p class="text-tertiary">${L("no data", "لا توجد بيانات")}</p>`}`);
    };
    mount.addEventListener("click", (e) => {
      if (e.target.closest("[data-new]")) { composer = !composer; paint(); }
      const rp = e.target.closest("[data-rep]");
      if (rp) { const box = mount.querySelector(`[data-replies="${rp.dataset.rep}"]`); box.hidden = !box.hidden; }
      const d = e.target.closest("[data-del]");
      if (d) confirmDelete(L("delete note", "حذف الملاحظة"), `${L("are you sure you want to delete this note post?", "هل أنت متأكد من أنك تريد حذف هذه الملاحظة؟")}<br><span style="color:var(--color-danger)">${L("please note that deleting this note post will delete all related comments!", "يرجى ملاحظة أن حذف هذه الملاحظة سيؤدي إلى حذف جميع التعليقات المرتبطة بها!")}</span>`,
        () => { p.notes = p.notes.filter((n) => String(n.id) !== d.dataset.del); paint(); });
      const dr = e.target.closest("[data-delr]");
      if (dr) { const [nid, rid] = dr.dataset.delr.split(":"); confirmDelete(L("delete note", "حذف الملاحظة"), L("are you sure that you to delete this comment?", "هل أنت متأكد من أنك تريد حذف هذا التعليق؟"),
        () => { const n = p.notes.find((x) => String(x.id) === nid); n.replies = n.replies.filter((r) => String(r.id) !== rid); paint(); }); }
    });
    mount.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target.closest("[data-compose]");
      const t = f.querySelector("textarea");
      if (!t.value.trim()) { t.classList.add("is-error"); t.setAttribute("aria-invalid", "true"); t.placeholder = L("this field is required", "هذا الحقل مطلوب"); return; }
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
    const dur = (v, t) => (!v || v <= 0 ? `<span class="badge">${L("off", "غير مفعل")}</span>`
      : t === "hour" ? L(`${v} hour${v > 1 ? "s" : ""}`, v === 1 ? "ساعة واحدة" : `${v} ساعات`)
        : t === "day" ? L(`${v} day${v > 1 ? "s" : ""}`, v === 1 ? "يوم واحد" : `${v} أيام`)
          : L(`${v} minute${v > 1 ? "s" : ""}`, `${v} دقائق`));
    const empCount = (n) => (!n ? L("No employees assigned", "لا يوجد موظفون مُعيّنون") : L(`${n} employee${n > 1 ? "s" : ""} assigned`, n === 1 ? "موظف واحد مُعيّن" : n === 2 ? "موظفان مُعيّنان" : `${n} موظفين مُعيّنين`));
    const units = (u) => (u || []).map((x) => esc(x.name || L(`Unit #${x.id}`, `الوحدة #${x.id}`))).join(L(", ", "، "));
    const paint = () => {
      mount.innerHTML = `
        ${card(L("QR Code Settings and Assignment", "إعدادات رمز QR والتعيين"), "", `<p class="t-sm text-secondary">${L("QR scan behaviour for this partner's branches, and which employees can scan on which units.", "سلوك مسح رمز QR لفروع هذا الشريك، والموظفون المسموح لهم بالمسح في كل وحدة.")}</p>`)}
        ${card(L("General Settings", "الإعدادات العامة"), "", kv([[L("Scan type", "نوع المسح"), `<b>${q.scan_type === "manual" ? L("Manual", "يدوي") : L("Automatic", "تلقائي")}</b><div class="t-xs text-tertiary">${L("Follows the Manual Check-In option in the Settings tab.", "يتبع خيار تسجيل الحضور اليدوي في تبويب الإعدادات.")}</div>`]]))}
        ${card(L("Branches", "الفروع"), "", `<p class="t-sm text-tertiary">${L("Settings apply to all units and all booking types within each branch.", "تُطبّق الإعدادات على جميع الوحدات وكل أنواع الحجوزات داخل كل فرع.")}</p>
          ${q.branches.length ? q.branches.map((b) => {
            const isOpen = open === b.branch_id, t = inner[b.branch_id] || "barcode", s = b.barcode_settings;
            return `<div class="form-section${isOpen ? " is-open" : ""}">
              <button type="button" class="form-section__head" data-acc="${b.branch_id}" aria-expanded="${isOpen}">
                <span class="form-section__txt"><span class="form-section__title">${esc(b.branch_name || L(`Branch #${b.branch_id}`, `الفرع #${b.branch_id}`))} <span class="t-xs text-tertiary">#${b.branch_id}</span></span></span>
                <span class="badge badge--primary">${empCount(b.employees.length)}</span><span class="form-section__chev">${ic("chevronDown")}</span></button>
              ${isOpen ? `<div class="form-section__body stack gap-4">
                <div class="tabs"><button type="button" data-in="barcode" class="${t === "barcode" ? "is-active" : ""}">${L("Barcode Settings", "إعدادات الباركود")}</button><button type="button" data-in="emp" class="${t === "emp" ? "is-active" : ""}">${L("Employees", "الموظفون")}</button></div>
                ${t === "barcode" ? `<div class="data-table-scroll"><table class="data-table"><tbody>
                  <tr><td><b>${L("Check-in before session starts", "الحضور قبل بداية الجلسة")}</b></td><td>${dur(s.check_in_before_session_start, s.check_in_before_session_start_type)}</td><td class="t-sm text-tertiary">${L("How early members can check in before the session begins.", "المدة التي يمكن فيها للأعضاء تسجيل الحضور قبل بداية الجلسة.")}</td></tr>
                  <tr><td><b>${L("Grace period after session starts", "فترة السماح بعد بداية الجلسة")}</b></td><td>${dur(s.grace_after_session_start, s.grace_after_session_start_type)}</td><td class="t-sm text-tertiary">${L("How long late check-in is allowed after the session starts.", "المدة المسموح فيها بتسجيل الحضور المتأخر بعد بداية الجلسة.")}</td></tr>
                  <tr><td><b>${L("Check-in after session ends", "الحضور بعد انتهاء الجلسة")}</b></td><td>${dur(s.check_in_after_session_end, s.check_in_after_session_end_type)}</td><td class="t-sm text-tertiary">${L("How long members can still check in after the session has ended.", "المدة التي يظل فيها بإمكان الأعضاء تسجيل الحضور بعد انتهاء الجلسة.")}</td></tr>
                  <tr><td><b>${L("Check-in mode", "طريقة تسجيل الحضور")}</b></td><td>${s.check_in_mode === "confirmation" ? L("Confirmation required", "يتطلب تأكيدًا") : L("Check in immediately", "تسجيل الحضور فورًا")}</td><td class="t-sm text-tertiary">${s.check_in_mode === "confirmation" ? L("The employee or partner must confirm after scanning.", "يجب على الموظف أو الشريك التأكيد بعد المسح.") : L("Member is checked in instantly on scan.", "يُسجل حضور العضو فور المسح.")}</td></tr>
                </tbody></table></div>`
                : b.employees.length ? `<div class="stack gap-3">${b.employees.map((e) => {
                    const opts = [[e.validate_qr_units, L("Validate QR", "التحقق من QR")], [e.perform_qr_units, L("Perform Scan", "تنفيذ المسح")], [e.view_scan_history_units, L("Scan History", "سجل المسح")]].filter((o) => o[0] && o[0].length);
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
  if (sid) {
    const s = HF.SA.services.find((x) => String(x.id) === sid);
    return SATR.render(mount, { key: "svc" + s.id, itemName: s.name, cols: [["name", L("name", "الاسم")], ["description", L("Description", "الوصف")]], src: { name: s.name, description: s.description }, backHref: PP.href("services", { list: lid || s.service_list.id }) });
  }
  if (lid) {
    const l = HF.SA.serviceLists.find((x) => String(x.id) === lid);
    return SATR.render(mount, { key: "list" + l.id, itemName: l.name, cols: [["name", L("name", "الاسم")], ["note", L("Note", "ملاحظة")]], src: { name: l.name, note: l.note }, backHref: PP.href("services") });
  }
  if (bid) {
    const b = p.branches.find((x) => String(x.id) === bid) || p.branches[0];
    return SATR.render(mount, { key: "branch" + b.id, itemName: b.name, cols: [["name", L("name", "الاسم")], ["description", L("Description", "الوصف")]], src: { name: b.name, description: b.description || "" }, backHref: PP.href("branches", { branch: b.id }) });
  }
  return SATR.render(mount, { key: "partner" + p.id, itemName: p.owner_name || p.company_name, editTitle: L("edit translates", "تعديل الترجمات"),
    cols: [["company_name", L("Company Name", "اسم الشركة")], ["bio", "BIO"]], src: { company_name: p.company_name, bio: p.bio || "" }, backHref: PP.href("owner") });
};
