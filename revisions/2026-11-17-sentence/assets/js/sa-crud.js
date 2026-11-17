/* CRUD — one engine for the dashboard's plain setup lists (Setup Files ·
   Locations · Banks …). Each page passes a config; the engine renders the
   head (title, crumbs, Add), status pills, search, table, pager, the Create /
   Edit modal (fields + validation), the Delete modal and the translation view.

   CRUD.page({
     title:[en,ar], crumbs:[[en,ar,href]], add:[en,ar] | null, actionsExtra:html,
     data:[], idKey:"id", pills:true | [{key,label,match}], search:[en,ar], searchKeys:["name"], minSearch,
     columns:[SA.table column], rowActions:(row)=>html (prepended to edit/delete),
     edit:true, del:{title,body,warn,disabled:(row)=>bool} | false,
     translation:{cols:[[key,label]], key:"type"} | null,  // adds the globe → ?translation=<id>
     form:{ createTitle, editTitle, fields:[{key,label,type,placeholder,options,req,rules:[(v,vals)=>msg]}],
            feedback:"silent"|"alert", createFeedback, labelCols:true },
     onSave:(vals,row|null)=>void  // default: assign / push
   })
   Field types: text · number · textarea · select · multi (checkboxes) · image · file · switch · date · color. */
(function () {
  "use strict";
  /* Redesign (2026-11-17): every label / title / button / message the pages pass
     shows in sentence case (SA.TS); status pills render as stat tiles (SA.list
     default) with icons; data is untouched. Previous version in
     revisions/2026-11-17-all-pages/sa-crud.js. */
  const { L, TS, esc, ic, badge } = SA;
  const T = TS;
  const CRUD = (window.CRUD = {});
  const REQ = () => L("This field is required", "هذا الحقل مطلوب");
  CRUD.REQ = REQ;
  CRUD.rules = {
    req: (v) => (v === "" || v == null || (Array.isArray(v) && !v.length) ? REQ() : ""),
    min: (n, msg) => (v) => (v && String(v).length < n ? T(msg) : ""),
    max: (n, msg) => (v) => (v && String(v).length > n ? T(msg) : ""),
    num: (msg) => (v) => (v !== "" && !/^[0-9]+(\.[0-9]+)?$/.test(String(v)) ? T(msg) : ""),
    /* whole numbers only — the dashboard's /^[0-9]+$/ (order, ages…) */
    int: (msg) => (v) => (v !== "" && v != null && !/^[0-9]+$/.test(String(v)) ? T(msg || ["Number is not valid", "الرقم غير صحيح"]) : ""),
  };
  CRUD.statusBadge = (v) => (+v === 1 ? badge("success", L("Active", "نشط")) : badge("danger", L("Inactive", "غير نشط")));
  CRUD.statusPills = [{ key: "all", label: ["All", "الكل"] }, { key: "1", label: ["Active", "نشط"] }, { key: "0", label: ["Inactive", "غير نشط"] }];
  CRUD.alert = (tone, msg) => `<div class="alert alert--${tone}"><span class="alert__icon">${ic(tone === "success" ? "check" : "warn")}</span><div class="alert__body">${msg}</div></div>`;

  function control(f, v) {
    const ph = f.placeholder ? ` placeholder="${esc(T(f.placeholder))}"` : "";
    const opts = typeof f.options === "function" ? f.options() : f.options || [];
    switch (f.type) {
      case "textarea": return `<textarea class="input" rows="${f.rows || 3}" data-f="${f.key}"${ph}>${esc(v == null ? "" : v)}</textarea>`;
      case "select": return SA.select([["", f.placeholder ? T(f.placeholder) : L("Select", "اختر")]].concat(opts.map((o) => [o[0], o[1], String(v) === String(o[0])])), `data-f="${f.key}"${f.disabled ? " disabled" : ""}`);
      case "multi": return `<div class="row gap-3" style="flex-wrap:wrap">${opts.map((o) => `<label class="check"><input type="checkbox" data-m="${f.key}" value="${esc(o[0])}" ${(v || []).map(String).includes(String(o[0])) ? "checked" : ""}><span class="check__box">${ic("check")}</span>${esc(o[1])}</label>`).join("") || `<span class="t-xs text-tertiary">---</span>`}</div>`;
      /* grouped checkboxes: options() → [{group, items:[[value,label,extraHtml]]}], each group has an All / Clear toggle */
      case "groups": return `<div class="stack gap-3" data-groups="${f.key}">${opts.map((g) => { const all = g.items.every((o) => (v || []).map(String).includes(String(o[0]))); return `<div class="stack gap-2" style="padding:var(--space-3);border:var(--border-thin) solid var(--color-border);border-radius:var(--radius-md)"><div class="row between" style="align-items:center"><span class="t-xs text-tertiary" style="text-transform:uppercase;letter-spacing:.06em">${esc(g.group)}</span><button type="button" class="btn btn--sm btn--ghost" data-gtoggle="${esc(g.group)}">${all ? L("Clear", "إلغاء") : L("All", "الكل")}</button></div><div class="row gap-3" style="flex-wrap:wrap">${g.items.map((o) => `<label class="check"><input type="checkbox" data-m="${f.key}" data-g="${esc(g.group)}" value="${esc(o[0])}" ${(v || []).map(String).includes(String(o[0])) ? "checked" : ""}><span class="check__box">${ic("check")}</span>${esc(o[1])}${o[2] || ""}</label>`).join("")}</div></div>`; }).join("")}</div>`;
      case "switch": return `<label class="switch"><input type="checkbox" data-f="${f.key}" ${+v ? "checked" : ""} aria-label="${esc(T(f.label))}"><span class="switch__track"></span></label>`;
      case "image": case "file": return `<div class="row gap-4" style="align-items:center;padding:var(--space-3);border:var(--border-thin) dashed var(--color-border);border-radius:var(--radius-lg);background:var(--color-surface-sunken)">
          <span class="cell-thumb" data-thumb ${typeof v === "string" && v ? `data-had="1"` : ""} style="${typeof v === "string" && v ? `background-image:url('${esc(v)}');` : ""}width:${f.type === "image" ? Math.min(f.size || 72, 72) : 44}px;height:${f.type === "image" ? Math.min(f.size || 72, 72) : 44}px;border-radius:var(--radius-md);flex:none;background:var(--color-surface);background-size:cover;background-position:center">${typeof v === "string" && v ? "" : ic(f.type === "image" ? "camera" : "paperclip")}</span>
          <div class="stack gap-1" style="min-width:0">
            <label class="btn btn--sm btn--secondary" style="align-self:flex-start;cursor:pointer">${ic("upload")}<span>${f.type === "image" ? L("Choose image", "اختر صورة") : L("Choose file", "اختر ملفاً")}</span><input type="file" data-file="${f.key}" accept="${f.accept || "image/*"}" style="position:absolute;inline-size:1px;block-size:1px;opacity:0;pointer-events:none"></label>
            <span class="t-xs text-secondary" data-fname style="overflow-wrap:anywhere">${L("No file chosen", "لم يتم اختيار ملف")}</span>
            <button type="button" class="btn btn--sm btn--ghost" data-fremove hidden style="align-self:flex-start;color:var(--color-danger)">${ic("trash")}<span>${f.type === "image" ? L("Remove photo", "إزالة الصورة") : L("Remove file", "إزالة الملف")}</span></button>
            <span class="field__error" data-fsize hidden>${ic("warn")} ${L(`Max size ${f.maxMB || 1}MB for images`, `الحد الأقصى للصور ${f.maxMB || 1} ميجابايت`)}</span>
            ${f.hint ? `<span class="t-xs text-tertiary">${esc(T(f.hint))}</span>` : ""}${f.warn ? `<span class="t-xs" style="color:var(--color-warning)">${esc(T(f.warn))}</span>` : ""}</div></div>`;
      /* map pick (the dashboard uses a Google Places map — here a stand-in box that records a point) */
      case "map": return `<div class="stack gap-2"><div data-mapbox="${f.key}" role="button" tabindex="0" style="height:${f.height || 200}px;border-radius:var(--radius-lg);border:var(--border-thin) dashed var(--color-border);background:var(--color-surface-sunken);display:grid;place-content:center;justify-items:center;gap:6px;cursor:crosshair;color:var(--color-text-tertiary)">${ic("pin")}<span class="t-sm" data-maplabel>${v ? esc(v) : esc(T(f.placeholder || ["Click the map to pick the location", "اضغط على الخريطة لاختيار الموقع"]))}</span></div><input type="hidden" data-f="${f.key}" value="${esc(v || "")}"></div>`;
      case "color": return `<input class="input" type="color" data-f="${f.key}" value="${esc(v || "#FC6404")}" style="max-width:120px;padding:4px">`;
      default: return `<input class="input" type="${f.type || "text"}" data-f="${f.key}" value="${esc(v == null ? "" : v)}"${ph}${f.min != null ? ` min="${f.min}"` : ""}${f.max != null ? ` max="${f.max}"` : ""}${f.step ? ` step="${f.step}"` : ""}>`;
    }
  }
  function readForm(el, fields) {
    const out = {};
    fields.forEach((f) => {
      if (f.type === "multi" || f.type === "groups") out[f.key] = [...el.querySelectorAll(`[data-m="${f.key}"]:checked`)].map((x) => x.value);
      else if (f.type === "switch") out[f.key] = el.querySelector(`[data-f="${f.key}"]`).checked ? 1 : 0;
      else if (f.type === "image" || f.type === "file") out[f.key] = el.querySelector(`[data-file="${f.key}"]`).files[0] || null;
      else out[f.key] = el.querySelector(`[data-f="${f.key}"]`).value.trim();
    });
    return out;
  }

  /* Create / Edit modal — returns nothing; calls done() after saving */
  CRUD.form = function (cfg, row, done) {
    const F = cfg.form, isNew = !row, fields = typeof F.fields === "function" ? F.fields(row) : F.fields;
    const val = (f) => (row ? (f.get ? f.get(row) : row[f.key]) : f.default != null ? f.default : f.type === "multi" ? [] : "");
    const rowHtml = (f) => {
      const lab = `${esc(T(f.label)).replace(/\s*:\s*$/, "")}${f.req ? ' <span class="req">*</span>' : ""}`;
      return `<div class="field" style="margin:0${f.type === "switch" ? ";flex-direction:row;align-items:center;justify-content:space-between;gap:var(--space-4)" : ""}"><label class="field__label">${lab}</label>${control(f, val(f))}${f.note ? `<span class="field__hint" style="display:inline-flex;align-items:center;gap:var(--space-1)">${ic("lock")}${esc(T(f.note))}</span>` : ""}<span data-e="${f.key}"></span></div>`;
    };
    const el = SA.modal({ id: "crudForm", wide: !!F.wide, title: T(isNew ? F.createTitle : F.editTitle), body: `<div class="stack gap-4"><div data-alert></div>${fields.map(rowHtml).join("")}</div>`,
      foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${isNew ? T(F.createBtn || ["Create", "إنشاء"]) : T(F.updateBtn || ["Update", "تحديث"])}</button>` });
    el.querySelector(".modal__foot").style.justifyContent = "space-between";
    el.querySelectorAll("[data-mapbox]").forEach((box) => (box.onclick = (ev) => { const r = box.getBoundingClientRect(), lat = (24 + (1 - (ev.clientY - r.top) / r.height) * 2).toFixed(4), lng = (45 + ((ev.clientX - r.left) / r.width) * 3).toFixed(4); const v = lat + ", " + lng; box.parentNode.querySelector("[data-f]").value = v; box.querySelector("[data-maplabel]").textContent = v; box.style.color = "var(--color-primary-ink)"; }));
    el.querySelectorAll("[data-gtoggle]").forEach((b) => (b.onclick = () => { const boxes = [...el.querySelectorAll(`[data-g="${b.dataset.gtoggle}"]`)], on = !boxes.every((x) => x.checked); boxes.forEach((x) => (x.checked = on)); b.textContent = on ? L("Clear", "إلغاء") : L("All", "الكل"); }));
    /* image / file picker: size checked on pick (f.maxMB, default 1), crop step for images
       (f.crop = ratio, default 1:1 — UploadCropImage), Remove clears it (sends empty) */
    el.querySelectorAll("[data-file]").forEach((inp) => {
      const f = fields.find((x) => x.key === inp.dataset.file) || {}, box = inp.closest(".row"), th = box.querySelector("[data-thumb]");
      const reset = () => { inp.value = ""; box.querySelector("[data-fname]").textContent = L("No file chosen", "لم يتم اختيار ملف"); th.style.backgroundImage = ""; th.innerHTML = ic(f.type === "image" ? "camera" : "paperclip"); box.querySelector("[data-fremove]").hidden = true; };
      box.querySelector("[data-fremove]").onclick = reset;
      inp.onchange = async () => {
        const file = inp.files[0], tooBig = file && file.size > (f.maxMB || 1) * 1024 * 1024 && f.type === "image";
        box.querySelector("[data-fsize]").hidden = !tooBig;
        if (!file || tooBig) return reset();
        const url = f.type === "image" && f.crop !== false ? await SA.crop(file, { ratio: f.crop || 1 }) : URL.createObjectURL(file);
        if (!url) return reset();
        box.querySelector("[data-fname]").textContent = file.name;
        box.querySelector("[data-fremove]").hidden = false;
        if (f.type === "image") { th.style.backgroundImage = `url("${url}")`; th.innerHTML = ""; }
      };
    });
    if (F.onOpen) F.onOpen(el, row);
    el.querySelector("[data-ok]").onclick = (e) => {
      const vals = readForm(el, fields);
      let bad = false;
      fields.forEach((f) => {
        const msg = (f.rules || []).map((r) => r(vals[f.key], vals, row)).find(Boolean) || "";
        el.querySelector(`[data-e="${f.key}"]`).innerHTML = msg ? `<span class="field__error">${ic("warn")} ${msg}</span>` : "";
        if (msg) bad = true;
      });
      if (bad) return;
      const b = e.currentTarget; b.disabled = true; b.textContent = isNew ? T(F.creatingText || ["Creating…", "جاري الإنشاء…"]) : T(F.updatingText || ["Updating…", "جاري التحديث…"]);
      setTimeout(() => {
        (cfg.onSave || ((v, r) => { const clean = Object.fromEntries(Object.entries(v).filter(([, x]) => !(x instanceof File) && x !== null));
          if (r) Object.assign(r, clean); else cfg.data.unshift(Object.assign({ id: Math.max(0, ...cfg.data.map((x) => +x.id || 0)) + 1, created_at: "2026-11-16 10:00:00" }, clean)); }))(vals, row);
        const fb = isNew ? F.createFeedback || F.feedback : F.feedback;
        if (fb === "alert") { el.querySelector("[data-alert]").innerHTML = CRUD.alert("success", T(isNew ? F.createdText || ["Created successfully", "تم الإنشاء بنجاح"] : F.updatedText || ["Updated successfully", "تم التحديث بنجاح"])); setTimeout(() => { SA.close(el); done(); }, F.delay || 1500); }
        else if (fb === "toast") { RD.toast("success", T(isNew ? F.createdText || ["Created successfully", "تم الإنشاء بنجاح"] : F.updatedText || ["Updated successfully", "تم التحديث بنجاح"])); SA.close(el); done(); }
        else { SA.close(el); done(); }
      }, 400);
    };
  };
  CRUD.del = function (cfg, row, done) {
    const D = cfg.del;
    const dis = D.disabled && D.disabled(row);
    const el = SA.modal({ id: "crudDel", title: T(D.title || ["Delete item", "حذف العنصر"]), body: `<div class="stack gap-2"><div data-alert></div><p class="t-sm text-secondary">${T(D.body || ["Please confirm that you want to delete this item", "يرجى تأكيد أنك تريد حذف هذا العنصر"])}</p>${D.item ? `<div class="t-sm" style="padding:var(--space-2) var(--space-3);border-radius:var(--radius-sm);background:var(--color-surface-sunken)">${D.item(row)}</div>` : ""}${D.warn ? `<p class="t-sm" style="color:var(--color-danger)">${T(D.warn)}</p>` : ""}</div>`,
      foot: `<button class="btn btn--secondary" data-close>${L("Cancel", "إلغاء")}</button><button class="btn ${D.danger ? "btn--danger" : ""}" data-ok ${dis ? "disabled" : ""}>${L("Confirm", "تأكيد")}</button>` });
    el.querySelector("[data-ok]").onclick = (e) => {
      const b = e.currentTarget; b.disabled = true; b.textContent = T(D.busyText || ["Confirming…", "جاري التأكيد…"]);
      setTimeout(() => {
        cfg.data.splice(cfg.data.indexOf(row), 1);
        if (D.feedback === "alert") { el.querySelector("[data-alert]").innerHTML = CRUD.alert("success", T(D.doneText || ["Deleted successfully", "تم الحذف بنجاح"])); setTimeout(() => { SA.close(el); done(); }, 1500); }
        else { SA.close(el); done(); }
      }, 400);
    };
  };

  CRUD.page = function (cfg) {
    const mount = cfg.mount || document.getElementById("listMount"), qs = new URLSearchParams(location.search);
    const base = location.pathname.split("/").pop() + (cfg.baseQuery ? "?" + cfg.baseQuery : "");
    const join = (k, v) => base + (base.includes("?") ? "&" : "?") + k + "=" + encodeURIComponent(v);
    /* translation view */
    if (cfg.translation && qs.get("translation")) {
      const r = cfg.data.find((x) => String(x[cfg.idKey || "id"]) === qs.get("translation")) || cfg.data[0];
      document.getElementById("pageHead").hidden = true;
      SATR.render(mount, { key: (cfg.translation.key || "item") + r.id, itemName: r[cfg.translation.nameKey || "name"], editTitle: L("Edit translations", "تعديل الترجمات"), cols: cfg.translation.cols.map((c) => [c[0], T(c[1])]), src: Object.fromEntries(cfg.translation.cols.map((c) => [c[0], r[c[0]]])), backHref: base });
      return null;
    }
    SA.head(document.getElementById("pageHead"), { title: cfg.title, crumbs: cfg.crumbs, actions: (cfg.actionsExtra || "") + (cfg.add ? PP.btn(T(cfg.add), "plus", "data-crud-add") : "") });
    const pills = cfg.pills === true ? CRUD.statusPills : cfg.pills || null;
    const actions = (r) => `<div class="row gap-1" style="justify-content:center">${cfg.rowActions ? cfg.rowActions(r) : ""}${cfg.translation ? `<a class="icon-btn" href="${join("translation", r[cfg.idKey || "id"])}" aria-label="${L("Translation", "ترجمة")}" data-tip="${L("Translation", "ترجمة")}">${ic("globe")}</a>` : ""}${cfg.edit !== false && cfg.form && (!cfg.canEdit || cfg.canEdit(r)) ? SA.iconBtn("edit", L("Edit", "تعديل"), `data-crud-edit="${r.id}"`) : ""}${cfg.del && (!cfg.canDel || cfg.canDel(r)) ? SA.iconBtn("trash", L("Delete", "حذف"), `data-crud-del="${r.id}"`) : ""}</div>`;
    const ctl = SA.list({
      mount, data: cfg.data, sizes: cfg.sizes || [15, 50, 100], minSearch: cfg.minSearch, cardTitle: cfg.cardTitle,
      pills: pills ? pills.map((p) => ({ key: p.key, label: p.label, icon: p.icon, tone: p.tone })) : null,
      pillMatch: pills ? (r, k) => { const p = pills.find((x) => x.key === k); return k === "all" || (p && p.match ? p.match(r) : String(r[cfg.pillKey || "active"]) === k); } : null,
      search: cfg.search, searchMatch: (r, q) => (cfg.searchKeys || ["name"]).some((k) => String(r[k] == null ? "" : r[k]).toLowerCase().includes(q)),
      toolbarExtra: cfg.toolbarExtra, extraMatch: cfg.extraMatch,
      empty: cfg.empty || ["There is no data to display.", "لا توجد بيانات للعرض."],
      columns: cfg.columns.concat(cfg.noActions ? [] : [{ head: ["Actions", "الإجراءات"], align: "center", cell: actions }]),
    });
    const find = (id) => cfg.data.find((x) => String(x.id) === String(id));
    document.addEventListener("click", (e) => {
      if (document.querySelector(".modal-overlay.is-open")) return;
      if (e.target.closest("[data-crud-add]")) return CRUD.form(cfg, null, ctl.paint);
      const ed = e.target.closest("[data-crud-edit]"); if (ed) return CRUD.form(cfg, find(ed.dataset.crudEdit), ctl.paint);
      const d = e.target.closest("[data-crud-del]"); if (d) CRUD.del(cfg, find(d.dataset.crudDel), ctl.paint);
    });
    return ctl;
  };
})();
