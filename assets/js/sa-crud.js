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
  const { L, T, esc, ic, badge } = SA;
  const CRUD = (window.CRUD = {});
  const REQ = () => L("this field is required", "هذا الحقل مطلوب");
  CRUD.REQ = REQ;
  CRUD.rules = {
    req: (v) => (v === "" || v == null || (Array.isArray(v) && !v.length) ? REQ() : ""),
    min: (n, msg) => (v) => (v && String(v).length < n ? T(msg) : ""),
    max: (n, msg) => (v) => (v && String(v).length > n ? T(msg) : ""),
    num: (msg) => (v) => (v !== "" && !/^[0-9]+(\.[0-9]+)?$/.test(String(v)) ? T(msg) : ""),
  };
  CRUD.statusBadge = (v) => (+v === 1 ? badge("primary", L("active", "نشط")) : badge("danger", L("inactive", "غير نشط")));
  CRUD.statusPills = [{ key: "all", label: ["all", "الكل"] }, { key: "1", label: ["active", "نشط"] }, { key: "0", label: ["inactive", "غير نشط"] }];
  CRUD.alert = (tone, msg) => `<div class="alert alert--${tone}"><span class="alert__icon">${ic(tone === "success" ? "check" : "warn")}</span><div class="alert__body">${msg}</div></div>`;

  function control(f, v) {
    const ph = f.placeholder ? ` placeholder="${esc(T(f.placeholder))}"` : "";
    const opts = typeof f.options === "function" ? f.options() : f.options || [];
    switch (f.type) {
      case "textarea": return `<textarea class="input" rows="${f.rows || 3}" data-f="${f.key}"${ph}>${esc(v == null ? "" : v)}</textarea>`;
      case "select": return SA.select([["", f.placeholder ? T(f.placeholder) : L("select", "اختر")]].concat(opts.map((o) => [o[0], o[1], String(v) === String(o[0])])), `data-f="${f.key}"`);
      case "multi": return `<div class="row gap-3" style="flex-wrap:wrap">${opts.map((o) => `<label class="check"><input type="checkbox" data-m="${f.key}" value="${esc(o[0])}" ${(v || []).map(String).includes(String(o[0])) ? "checked" : ""}><span class="check__box">${ic("check")}</span>${esc(o[1])}</label>`).join("") || `<span class="t-xs text-tertiary">---</span>`}</div>`;
      /* grouped checkboxes: options() → [{group, items:[[value,label,extraHtml]]}], each group has an All / Clear toggle */
      case "groups": return `<div class="stack gap-3" data-groups="${f.key}">${opts.map((g) => { const all = g.items.every((o) => (v || []).map(String).includes(String(o[0]))); return `<div class="stack gap-2" style="padding:var(--space-3);border:var(--border-thin) solid var(--color-border);border-radius:var(--radius-md)"><div class="row between" style="align-items:center"><span class="t-xs text-tertiary" style="text-transform:uppercase;letter-spacing:.06em">${esc(g.group)}</span><button type="button" class="btn btn--sm btn--ghost" data-gtoggle="${esc(g.group)}">${all ? L("Clear", "إلغاء") : L("All", "الكل")}</button></div><div class="row gap-3" style="flex-wrap:wrap">${g.items.map((o) => `<label class="check"><input type="checkbox" data-m="${f.key}" data-g="${esc(g.group)}" value="${esc(o[0])}" ${(v || []).map(String).includes(String(o[0])) ? "checked" : ""}><span class="check__box">${ic("check")}</span>${esc(o[1])}${o[2] || ""}</label>`).join("")}</div></div>`; }).join("")}</div>`;
      case "switch": return `<label class="switch"><input type="checkbox" data-f="${f.key}" ${+v ? "checked" : ""} aria-label="${esc(T(f.label))}"><span class="switch__track"></span></label>`;
      case "image": case "file": return `<div class="row gap-3" style="align-items:center">${f.type === "image" ? `<span class="cell-thumb" style="width:${f.size || 90}px;height:${f.size || 90}px;border-radius:var(--radius-lg)">${ic("camera")}</span>` : ""}
          <div class="stack gap-1"><input class="input" type="file" data-file="${f.key}" accept="${f.accept || "image/*"}" style="padding-top:8px">${f.hint ? `<span class="t-xs text-tertiary">${esc(T(f.hint))}</span>` : ""}${f.warn ? `<span class="t-xs" style="color:var(--color-warning)">${esc(T(f.warn))}</span>` : ""}</div></div>`;
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
      const lab = `${esc(T(f.label))}${F.colon === false ? "" : ":"}${f.req ? ' <span class="req">*</span>' : ""}`;
      return F.labelCols ? `<div class="sa-formrow"><label class="field__label">${lab}</label><div class="stack gap-1">${control(f, val(f))}<span data-e="${f.key}"></span></div></div>`
        : `<div class="field"><label class="field__label">${lab}</label>${control(f, val(f))}<span data-e="${f.key}"></span></div>`;
    };
    const el = SA.modal({ id: "crudForm", wide: !!F.wide, title: T(isNew ? F.createTitle : F.editTitle), body: `<div class="stack gap-4"><div data-alert></div>${fields.map(rowHtml).join("")}</div>`,
      foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${isNew ? T(F.createBtn || ["create", "إنشاء"]) : T(F.updateBtn || ["update", "تحديث"])}</button>` });
    el.querySelector(".modal__foot").style.justifyContent = "space-between";
    el.querySelectorAll("[data-mapbox]").forEach((box) => (box.onclick = (ev) => { const r = box.getBoundingClientRect(), lat = (24 + (1 - (ev.clientY - r.top) / r.height) * 2).toFixed(4), lng = (45 + ((ev.clientX - r.left) / r.width) * 3).toFixed(4); const v = lat + ", " + lng; box.parentNode.querySelector("[data-f]").value = v; box.querySelector("[data-maplabel]").textContent = v; box.style.color = "var(--color-primary-ink)"; }));
    el.querySelectorAll("[data-gtoggle]").forEach((b) => (b.onclick = () => { const boxes = [...el.querySelectorAll(`[data-g="${b.dataset.gtoggle}"]`)], on = !boxes.every((x) => x.checked); boxes.forEach((x) => (x.checked = on)); b.textContent = on ? L("Clear", "إلغاء") : L("All", "الكل"); }));
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
      const b = e.currentTarget; b.disabled = true; b.textContent = isNew ? T(F.creatingText || ["creating ...", "جاري الإنشاء ..."]) : T(F.updatingText || ["updating ...", "جاري التحديث ..."]);
      setTimeout(() => {
        (cfg.onSave || ((v, r) => { const clean = Object.fromEntries(Object.entries(v).filter(([, x]) => !(x instanceof File) && x !== null));
          if (r) Object.assign(r, clean); else cfg.data.unshift(Object.assign({ id: Math.max(0, ...cfg.data.map((x) => +x.id || 0)) + 1, created_at: "2026-11-16 10:00:00" }, clean)); }))(vals, row);
        const fb = isNew ? F.createFeedback || F.feedback : F.feedback;
        if (fb === "alert") { el.querySelector("[data-alert]").innerHTML = CRUD.alert("success", isNew ? L("created successfully", "تم الإنشاء بنجاح") : L("updated successfully", "تم التحديث بنجاح")); setTimeout(() => { SA.close(el); done(); }, F.delay || 1500); }
        else if (fb === "toast") { RD.toast("success", isNew ? L("created successfully", "تم الإنشاء بنجاح") : L("updated successfully", "تم التحديث بنجاح")); SA.close(el); done(); }
        else { SA.close(el); done(); }
      }, 400);
    };
  };
  CRUD.del = function (cfg, row, done) {
    const D = cfg.del;
    const dis = D.disabled && D.disabled(row);
    const el = SA.modal({ id: "crudDel", title: T(D.title || ["delete item", "حذف العنصر"]), body: `<div class="stack gap-2"><div data-alert></div><p class="t-sm text-secondary">${T(D.body || ["Please confirm that you want to delete this item", "يرجى تأكيد أنك تريد حذف هذا العنصر"])}</p>${D.warn ? `<p class="t-sm" style="color:var(--color-danger)">${T(D.warn)}</p>` : ""}</div>`,
      foot: `<button class="btn btn--secondary" data-close>${L("Cancel", "إلغاء")}</button><button class="btn ${D.danger ? "btn--danger" : ""}" data-ok ${dis ? "disabled" : ""}>${L("Confirm", "تأكيد")}</button>` });
    el.querySelector("[data-ok]").onclick = (e) => {
      const b = e.currentTarget; b.disabled = true; b.textContent = L("Confirming ...", "جاري التأكيد ...");
      setTimeout(() => {
        cfg.data.splice(cfg.data.indexOf(row), 1);
        if (D.feedback === "alert") { el.querySelector("[data-alert]").innerHTML = CRUD.alert("success", L("deleted successfully", "تم الحذف بنجاح")); setTimeout(() => { SA.close(el); done(); }, 1500); }
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
      SATR.render(mount, { key: (cfg.translation.key || "item") + r.id, itemName: r[cfg.translation.nameKey || "name"], editTitle: L("edit translates", "تعديل الترجمات"), cols: cfg.translation.cols.map((c) => [c[0], T(c[1])]), src: Object.fromEntries(cfg.translation.cols.map((c) => [c[0], r[c[0]]])), backHref: base });
      return null;
    }
    SA.head(document.getElementById("pageHead"), { title: cfg.title, crumbs: cfg.crumbs, actions: (cfg.actionsExtra || "") + (cfg.add ? PP.btn(T(cfg.add), "plus", "data-crud-add") : "") });
    const pills = cfg.pills === true ? CRUD.statusPills : cfg.pills || null;
    const actions = (r) => `<div class="row gap-1" style="justify-content:center">${cfg.rowActions ? cfg.rowActions(r) : ""}${cfg.translation ? `<a class="icon-btn" href="${join("translation", r.id)}" aria-label="${L("translation", "ترجمة")}" title="${L("translation", "ترجمة")}">${ic("globe")}</a>` : ""}${cfg.edit !== false && cfg.form && (!cfg.canEdit || cfg.canEdit(r)) ? SA.iconBtn("edit", L("edit", "تعديل"), `data-crud-edit="${r.id}"`) : ""}${cfg.del && (!cfg.canDel || cfg.canDel(r)) ? SA.iconBtn("trash", L("delete", "حذف"), `data-crud-del="${r.id}"`) : ""}</div>`;
    const ctl = SA.list({
      mount, data: cfg.data, sizes: cfg.sizes || [15, 50, 100], minSearch: cfg.minSearch, cardTitle: cfg.cardTitle,
      pills: pills ? pills.map((p) => ({ key: p.key, label: p.label })) : null,
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
