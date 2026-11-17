/* ============================================================================
   SA SERVICES — Partners Lists and Services, shared by the global pages
   (partner-services.html · partner-services-list.html) and the partner
   profile "Lists and Services" tab. Generated from the page scripts; differences
   per context come in through options (o.partner hides the Company column and
   the summary's company line, exactly like the dashboard's profile variant).
   API: global GET /partner-service-lists · /partner-services?service_list_id=
        profile GET /partners/{id}/service-list · /partners/{id}/services?service_list_id=
   Permissions (job keys — data-perm, demo ?perm=limited | ?perm=none): the pages / tab need
   view_partner_services (PartnersServicesPage / PartnerServicesOutlet); every row action —
   translation, approve, edit, delete, visibility — and Add service list / Add new need
   update_partner_services (ServiceListsTable, PartnersServicesTable,
   ServiceListServicesToolbarWrapper, ServicesPage). The callers tag their Add buttons.
   ========================================================================== */
window.SV = (function () {
  "use strict";
  const { L, esc, ic, badge, iconBtn } = SA;

  /* the rule chips of a list, each with its own explanation (tooltip):
     [text, strong, tip label, tip text] — shared by the lists table and the services summary */
  function RULES(r, long) {
    const min = r.has_qty ? r.min_total_quantity : r.min_selection, max = r.has_qty ? r.max_total_quantity : r.max_selection;
    const mm = `${min == null ? 0 : min} / ${max == null || max === "" ? L("Unlimited", "بدون حد أقصى") : max}`;
    return [
      r.is_required ? [L("Required", "مطلوب"), true, L("Requirement", "الإلزام"), L("Required — users must pick at least the minimum", "مطلوبة — يجب اختيار الحد الأدنى على الأقل")]
        : [L("Optional", "اختياري"), false, L("Requirement", "الإلزام"), L("Optional — users may skip this list", "اختيارية — يمكن تخطي هذه القائمة")],
      r.selection_type === "single" ? [long ? L("Single selection", "اختيار فردي") : L("Single", "فردي"), false, L("Selection type", "نوع الاختيار"), L("Single — one service only", "فردي — خدمة واحدة فقط")]
        : [long ? L("Multiple selection", "اختيار متعدد") : L("Multiple", "متعدد"), false, L("Selection type", "نوع الاختيار"), L("Multiple — several services can be picked", "متعدد — يمكن اختيار أكثر من خدمة")],
      [`${L("Min / max", "الأدنى / الأقصى")} ${mm}`, false, r.has_qty ? L("Min / max total quantity", "الحد الأدنى / الأقصى لإجمالي الكمية") : L("Min / max selection", "الحد الأدنى / الأقصى للاختيار"), mm],
    ].concat(r.has_qty ? [[L("By quantity", "حسب الكمية"), false, L("Quantity mode", "وضع الكمية"), L("Limits count the total quantity across the selected services", "الحدود تحسب إجمالي الكمية عبر الخدمات المختارة")]] : []);
  }
  const tipChip = (t, strong, tipLabel, tip) => `<span class="chip" tabindex="0" data-tip-label="${esc(tipLabel)}" data-tip="${esc(tip)}" style="height:auto;padding:var(--space-1) var(--space-2);font-size:var(--text-xs);white-space:nowrap;cursor:help;${strong ? "font-weight:var(--weight-semibold)" : ""}">${t}</span>`;
  const companyTip = (p) => `tabindex="0" data-tip-label="${esc(L("Company name", "اسم الشركة"))}" data-tip="${esc(p.company_name)} · ${esc(L("Partner ID", "رقم الشريك"))} ${p.id}" style="cursor:help"`;

  /* o: { data, partner?, servicesHref(list), translationHref(list) } */
  function lists(listMount, o) {
    const data = o.data;
    const TONE = { approved: "success", pending: "warning", not_approved: "danger" };
    const STATUS_TXT = (s) => ({ approved: L("Approved", "موافق عليه"), pending: L("Pending", "معلق"), not_approved: L("Not Approved", "غير موافق عليه") }[s] || s);
    const svcCount = (n) => L(`${n} ${n === 1 ? "Service" : "Services"}`, `${n} خدمات`);
    const rules = (r) => `<div class="row gap-1" style="flex-wrap:wrap">${RULES(r).map((x) => tipChip(...x)).join("")}</div>`;
    /* live summary for the page head (global pages pass o.summary) */
    const paintHead = () => {
      if (!o.summary) return;
      const pend = data.filter((r) => r.status === "pending").length, svc = data.reduce((a, r) => a + (r.services_count || 0), 0);
      o.summary.textContent = L(`${data.length} lists · ${svc} services · ${pend} waiting for approval`, `${data.length} قائمة · ${svc} خدمة · ${pend} في انتظار الموافقة`);
    };

    const ctl = SA.list({
      mount: listMount,
      data,
      tiles: true,
      pills: [
        { key: "", label: ["All", "الكل"], icon: "list" },
        { key: "pending", label: ["Pending", "معلق"], icon: "clock", tone: "warning" },
        { key: "approved", label: ["Approved", "موافق عليه"], icon: "check", tone: "primary" },
        { key: "not_approved", label: ["Not Approved", "غير موافق عليه"], icon: "close", tone: "danger" },
      ],
      pillMatch: (r, k) => !k || r.status === k,
      search: o.partner ? ["Search by list name…", "البحث باسم القائمة…"] : ["Search by list name or company name…", "البحث باسم القائمة أو اسم الشركة…"],
      minSearch: 3,
      searchMatch: (r, q) => r.name.toLowerCase().includes(q) || r.partner.company_name.toLowerCase().includes(q),
      empty: ["No service lists found", "لم يتم العثور على قوائم خدمات"],
      after: paintHead,
      /* Redesign (2026-11-17): 9 → 6 columns, nothing dropped — company / id under
         the list name (global pages), and required · selection type · min / max
         as one "Rules" column of chips. */
      columns: [
        { head: ["List", "القائمة"], cell: (r) => `<b>${esc(r.name)}</b>${r.is_default ? " " + badge("info", L("Default", "افتراضي")) : ""}${o.partner ? "" : `<div class="t-xs text-tertiary"><span ${companyTip(r.partner)}>${esc(r.partner.company_name)} · ${L("ID", "الرقم")} ${r.partner.id}</span></div>`}` },
        { head: ["Services", "الخدمات"], cell: (r) => `<a href="${o.servicesHref(r)}" style="color:var(--color-text-link);font-weight:var(--weight-semibold);white-space:nowrap">${svcCount(r.services_count)}</a>` },
        { head: ["Rules", "القواعد"], cell: (r) => rules(r) },
        { head: ["Status", "الحالة"], cell: (r) => badge(TONE[r.status] || "", STATUS_TXT(r.status)) },
        { head: ["Created Date", "تاريخ الإنشاء"], cell: (r) => `<span class="t-sm text-tertiary">${esc(r.created_at)}</span>` },
        { head: ["Actions", "الإجراءات"], cell: (r) => `<div class="row gap-1" data-perm="update_partner_services">
            <a class="icon-btn" href="${o.translationHref(r)}" aria-label="${L("Translation", "ترجمة")}" title="${L("Translation", "ترجمة")}">${ic("globe")}</a>
            ${iconBtn("check", L("Approve / reject list", "الموافقة / الرفض على القائمة"), `data-approve="${r.id}"`)}
            ${iconBtn("edit", L("Edit service", "تعديل الخدمة"), `data-edit="${r.id}"`)}
            ${r.is_default ? "" : iconBtn("trash", L("Delete", "حذف"), `data-del="${r.id}"`)}
          </div>` },
      ].filter(Boolean),
    });
  
    /* ---------------- Approve / reject ---------------- */
    function approve(r) {
      const el = SA.modal({
        id: "approveModal",
        title: L("Approve / reject list", "الموافقة / الرفض على القائمة"),
        body: `<div class="stack gap-3">
          ${SA.field(["New Status:", "الحالة الجديدة:"], SA.select([["", L("Select", "اختر"), true], ["approved", L("Approved", "موافق عليه")], ["not_approved", L("Not Approved", "غير موافق عليه")]], 'id="newStatus"'))}
          <p class="t-xs text-tertiary">${L("Approving or rejecting a list updates approval for all services in that list.", "الموافقة أو الرفض على مستوى القائمة يحدّث حالة جميع الخدمات ضمنها.")}</p>
          <div id="approveErr"></div></div>`,
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" id="approveGo">${L("Update", "تحديث")}</button>`,
      });
      el.querySelector("#approveGo").onclick = () => {
        const s = el.querySelector("#newStatus").value;
        if (!s || s === r.status) {
          el.querySelector("#approveErr").innerHTML = `<div class="alert alert--danger"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${L("Please select a different status", "يرجى اختيار حالة مختلفة")}</div></div>`;
          return;
        }
        /* PUT /partners/{partnerId}/service-list/{listId}/status {status} */
        r.status = s;
        SA.close(el);
        ctl.paint();
      };
    }
  
    /* ---------------- Edit service list ---------------- */
    function edit(r) {
      const f = { name: r.name, note: r.note || "", is_required: !!r.is_required, has_qty: !!r.has_qty, selection_type: r.selection_type,
        min: r.has_qty ? r.min_total_quantity : r.min_selection, max: r.has_qty ? r.max_total_quantity : r.max_selection };
      const sec = (title, hint, body) => `<section class="card card--pad stack gap-4" style="box-shadow:none">
          <div class="row between gap-3" style="flex-wrap:wrap"><b>${title}</b><span class="t-xs text-tertiary">${hint}</span></div>${body}</section>`;
      function body() {
        const q = f.has_qty;
        const single = f.selection_type === "single";
        const unlimited = f.max == null || f.max === "";
        return `<div class="stack gap-4">
          <p class="t-sm text-tertiary">${L("Update list name, notes, and selection rules for this group.", "حدّث اسم القائمة والملاحظات وقواعد الاختيار لهذه المجموعة.")}</p>
          ${sec(L("Basic information", "المعلومات الأساسية"), L("Provide a name and optional note", "أدخل اسماً وملاحظة اختيارية"), `
            ${SA.field(["List name", "اسم القائمة"], `<input class="input" data-f="name" value="${esc(f.name)}">`, { req: true })}
            <div id="nameErr"></div>
            ${SA.field(["Note", "ملاحظة"], `<input class="input" data-f="note" value="${esc(f.note)}">`, { hint: ["Optional helper note for administrators.", "ملاحظة اختيارية للمسؤولين."] })}`)}
          ${sec(L("Configuration", "الإعدادات"), L("Behavior and selection rules", "السلوك وقواعد الاختيار"), `
            <div><label class="switch"><input type="checkbox" data-f="is_required" ${f.is_required ? "checked" : ""}><span class="switch__track"></span>${L("Required", "إلزامي")}</label>
              <div class="t-xs text-tertiary" style="margin-top:var(--space-1)">${L("If enabled, user must select at least the minimum.", "عند التفعيل، يجب على المستخدم اختيار الحد الأدنى على الأقل.")}</div></div>
            <div><label class="switch"><input type="checkbox" data-f="has_qty" ${q ? "checked" : ""}><span class="switch__track"></span>${L("Enable quantity-based selection", "تفعيل الاختيار حسب الكمية الإجمالية")}</label>
              <div class="t-xs text-tertiary" style="margin-top:var(--space-1)">${L("Counts total quantity across selected services.", "يحسب إجمالي الكمية عبر الخدمات المختارة.")}</div></div>
            <div class="field"><span class="field__label">${L("Selection type", "نوع الاختيار")}</span>
              <div class="row gap-5" style="flex-wrap:wrap">
                <label class="check check--radio"><input type="radio" name="selType" value="single" data-f="selection_type" ${single ? "checked" : ""}><span class="check__box"><span class="check__dot"></span></span>${L("Single selection", "اختيار فردي")}</label>
                <label class="check check--radio"><input type="radio" name="selType" value="multiple" data-f="selection_type" ${single ? "" : "checked"}><span class="check__box"><span class="check__dot"></span></span>${L("Multiple selection", "اختيار متعدد")}</label>
              </div><span class="field__hint">${L("Single selection will restrict maximum to 1 automatically.", "الاختيار الفردي يقيّد الحد الأقصى تلقائياً إلى 1.")}</span></div>`)}
          ${sec(L("Dynamic rules", "القواعد الديناميكية"), L("Rules adapt to quantity mode and selection type", "تتأثر القواعد بوضع الكمية ونوع الاختيار"), `
            <b class="t-sm">${L("Selection limits", "حدود الاختيار")}</b>
            <div class="grid grid-2">
              ${SA.field(q ? ["Min total quantity", "الحد الأدنى لإجمالي الكمية"] : ["Min selection", "الحد الأدنى للاختيار"], `<input class="input" type="number" min="0" data-f="min" value="${f.min == null ? "" : f.min}">`)}
              ${SA.field(q ? ["Max total quantity", "الحد الأقصى لإجمالي الكمية"] : ["Max selection", "الحد الأقصى للاختيار"], `<input class="input" type="number" min="1" data-f="max" value="${unlimited ? "" : f.max}" placeholder="${L("Leave empty for unlimited", "اتركه فارغاً لعدم وجود حد أقصى")}" ${single && !q ? "disabled" : ""}>`)}
            </div>
            <label class="check"><input type="checkbox" data-f="unlimited" ${unlimited ? "checked" : ""} ${single && !q ? "disabled" : ""}><span class="check__box">${ic("check")}</span>${L("Unlimited", "بدون حد أقصى")}</label>
            <div id="ruleErr"></div>`)}
        </div>`;
      }
      const el = SA.modal({ id: "editListModal", wide: true, title: L("Edit service list", "تعديل قائمة الخدمات"), body: body(),
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" id="editGo">${L("Save", "حفظ")}</button>` });
      const repaint = () => (el.querySelector(".modal__body").innerHTML = body());
      el.querySelector(".modal__body").onchange = (e) => {
        const k = e.target.dataset.f;
        if (!k) return;
        if (k === "is_required" || k === "has_qty") f[k] = e.target.checked;
        else if (k === "selection_type") { f.selection_type = e.target.value; if (f.selection_type === "single" && !f.has_qty) f.max = 1; }
        else if (k === "unlimited") f.max = e.target.checked ? null : 1;
        else f[k] = e.target.value;
        repaint();
      };
      el.querySelector(".modal__body").oninput = (e) => { const k = e.target.dataset.f; if (k === "name" || k === "note" || k === "min" || k === "max") f[k] = e.target.value; };
      const alertBox = (msg) => `<div class="alert alert--danger"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${msg}</div></div>`;
      el.querySelector("#editGo").onclick = () => {
        el.querySelector("#nameErr").innerHTML = "";
        el.querySelector("#ruleErr").innerHTML = "";
        if (!String(f.name).trim()) return (el.querySelector("#nameErr").innerHTML = `<span class="field__error">${ic("warn")} ${L("List name is required.", "اسم القائمة مطلوب.")}</span>`);
        const min = f.min === "" || f.min == null ? null : +f.min, max = f.max === "" || f.max == null ? null : +f.max;
        let m = "";
        if (min == null || min < 0) m = f.has_qty ? L("Enter a valid minimum quantity (0 or greater).", "أدخل حداً أدنى للكمية صالحاً (0 أو أكثر).") : L("Enter a valid minimum (0 or greater).", "أدخل حداً أدنى صالحاً (0 أو أكثر).");
        else if (!f.has_qty && f.selection_type === "single" && max !== 1) m = L("For single selection, max must be 1.", "للاختيار الفردي يجب أن يكون الحد الأقصى 1.");
        else if (!f.has_qty && f.selection_type === "single" && !f.is_required && min > 1) m = L("For optional single selection, use min 0 or 1.", "للاختيار الفردي الاختياري استخدم حداً أدنى 0 أو 1.");
        else if (max != null && max < 1) m = f.has_qty ? L("Maximum quantity must be at least 1 or empty.", "يجب أن يكون الحد الأقصى للكمية 1 على الأقل أو فارغاً.") : L("Max must be at least 1 or empty for unlimited.", "يجب أن يكون الحد الأقصى 1 على الأقل أو فارغاً لعدم التقييد.");
        else if (max != null && max < min) m = f.has_qty ? L("Maximum quantity must be greater than or equal to minimum.", "يجب أن يكون الحد الأقصى للكمية أكبر من أو يساوي الحد الأدنى.") : L("Max must be greater than or equal to min.", "يجب أن يكون الحد الأقصى أكبر من أو يساوي الحد الأدنى.");
        else if (f.is_required && min === 0) m = f.has_qty ? L("When the list is required, minimum total quantity must be greater than 0.", "عند جعل القائمة مطلوبة يجب أن يكون الحد الأدنى لإجمالي الكمية أكبر من 0.") : L("When the list is required, minimum selection must be greater than 0.", "عند جعل القائمة مطلوبة يجب أن يكون الحد الأدنى للاختيار أكبر من 0.");
        if (m) return (el.querySelector("#ruleErr").innerHTML = alertBox(m));
        /* PUT /partners/{pid}/service-list/{id} {name,is_required,selection_type,note,has_qty,min,max} */
        Object.assign(r, { name: f.name, note: f.note, is_required: f.is_required ? 1 : 0, has_qty: f.has_qty ? 1 : 0, selection_type: f.selection_type });
        if (f.has_qty) { r.min_total_quantity = min; r.max_total_quantity = max; } else { r.min_selection = min; r.max_selection = max; }
        SA.close(el);
        ctl.paint();
      };
    }
  
    /* ---------------- Delete ---------------- */
    function del(r) {
      const el = SA.modal({
        id: "delListModal",
        title: L("Delete service list", "حذف قائمة الخدمات"),
        body: `<p class="t-sm text-secondary">${L("Please confirm that you want to delete this service list.", "يرجى تأكيد حذف قائمة الخدمات هذه.")}</p>`,
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn btn--danger" id="delGo">${L("Delete", "حذف")}</button>`,
      });
      el.querySelector("#delGo").onclick = () => {
        /* DELETE /partners/{pid}/service-list/{id} */
        data.splice(data.indexOf(r), 1);
        SA.close(el);
        ctl.paint();
      };
    }
  
    listMount.addEventListener("click", (e) => {
      const a = e.target.closest("[data-approve]"), ed = e.target.closest("[data-edit]"), d = e.target.closest("[data-del]");
      if (a) approve(ctl.rowById(a.dataset.approve));
      if (ed) edit(ctl.rowById(ed.dataset.edit));
      if (d) del(ctl.rowById(d.dataset.del));
    });
  
    return ctl;
  }

  /* o: { list, data, partner?, summary (element), addButton (element), translationHref(service) } */
  function services(listMount, o) {
    const list = o.list, data = o.data, summary = o.summary;
    const TONE = { approved: "success", pending: "warning", not_approved: "danger" };
    const STATUS_TXT = (s) => ({ approved: L("Approved", "موافق عليه"), pending: L("Pending", "معلق"), not_approved: L("Not Approved", "غير موافق عليه") }[s] || s);
    /* Redesign (2026-11-17): the summary card is a small record header — list name,
       default + status badges, company, the selection rules as chips and three
       quick counts (services · visible · pending) — same facts as before, plus
       counts derived from the same rows. */
    const count = (label, n, tone) => `<div class="stack" style="gap:2px;min-width:0"><b style="font-size:var(--text-title);font-variant-numeric:tabular-nums${tone ? ";color:var(--color-" + tone + ")" : ""}">${n}</b><span class="t-xs text-tertiary" style="white-space:nowrap">${label}</span></div>`;
    const paintSummary = () => {
      summary.innerHTML = `<section class="card card--pad animate-in" style="margin-bottom:var(--space-5);display:flex;gap:var(--space-6);flex-wrap:wrap;align-items:center;justify-content:space-between">
        <div class="stack gap-2" style="min-width:0;flex:1 1 320px">
          <div class="row gap-2" style="align-items:center;flex-wrap:wrap"><h2 class="t-title">${esc(list.name)}</h2>${list.is_default ? badge("info", L("Default", "افتراضي")) : ""}${badge(TONE[list.status] || "", STATUS_TXT(list.status))}</div>
          ${o.partner ? "" : `<div class="t-sm text-secondary"><a href="partner-profile.html?id=${list.partner.id}&tab=services" data-tip-label="${esc(L("Company name", "اسم الشركة"))}" data-tip="${esc(list.partner.company_name)} · ${esc(L("Partner ID", "رقم الشريك"))} ${list.partner.id}" style="color:var(--color-text-link);font-weight:var(--weight-semibold)">${esc(list.partner.company_name)}</a> <span class="text-tertiary">· ${L("ID", "الرقم")} ${list.partner.id}</span></div>`}
          <div class="row gap-1" style="flex-wrap:wrap">${RULES(list, true).map((x) => tipChip(...x)).join("")}</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,auto);gap:var(--space-6)">
          ${count(L("Services", "الخدمات"), data.length)}${count(L("Visible", "ظاهرة"), data.filter((s) => s.visibility === "active").length, "success")}${count(L("Pending", "معلق"), data.filter((s) => s.status === "pending").length, "warning")}
        </div></section>`;
    };
    paintSummary();

    const dash = (v) => (v == null || v === "" ? "—" : esc(v));
    const vis = (r) => (r.visibility === "active" ? badge("success", L("Active", "نشط")) : badge("", L("Inactive", "غير نشط")));
    /* PartnersServicesTableWrapper.js: when the API sends visibility-based counts the
       tiles become All / Active / Inactive and filter by visibility (not approval).
       Sample: ?demo=vis-counts (or o.variant = "visibility"). */
    const visVariant = o.variant === "visibility" || new URLSearchParams(location.search).get("demo") === "vis-counts";
    const ctl = SA.list({
      mount: listMount,
      data,
      tiles: true,
      pills: visVariant ? [
        { key: "", label: ["All", "الكل"], icon: "list" },
        { key: "active", label: ["Active", "نشيط"], icon: "eye", tone: "primary" },
        { key: "inactive", label: ["Inactive", "غير نشط"], icon: "eyeOff", tone: "danger" },
      ] : [
        { key: "", label: ["All", "الكل"], icon: "list" },
        { key: "pending", label: ["Pending", "معلق"], icon: "clock", tone: "warning" },
        { key: "approved", label: ["Approved", "موافق عليه"], icon: "check", tone: "primary" },
        { key: "not_approved", label: ["Not Approved", "غير موافق عليه"], icon: "close", tone: "danger" },
      ],
      pillMatch: visVariant ? (r, k) => !k || r.visibility === k : (r, k) => !k || r.status === k,
      search: ["Search by service name...", "البحث باسم الخدمة..."],
      minSearch: 3,
      searchMatch: (r, q) => r.name.toLowerCase().includes(q),
      empty: ["No services found", "لم يتم العثور على خدمات"],
      /* Redesign (2026-11-17): 10 → 7 columns, nothing dropped — image + name +
         description (two lines) in one Service column; max quantity + minimum
         selection in one Quantity column. */
      after: () => paintSummary(),
      columns: [
        { head: ["Service", "الخدمة"], cell: (r) => `<div class="cell-user" style="align-items:flex-start"><span class="cell-thumb"${r.image ? ` style="background:url('${esc(r.image)}') center/cover no-repeat"` : ""}>${r.image ? "" : ic("camera")}</span>
            <div style="min-width:220px;max-width:380px;white-space:normal"><b>${esc(r.name)}</b><div class="t-xs text-tertiary" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden" title="${esc(r.description || "")}">${dash(r.description)}</div></div></div>` },
        { head: ["Duration", "المدة"], cell: (r) => (r.duration ? L(`${r.duration} min`, `${r.duration} دقيقة`) : "—") },
        { head: ["Quantity", "الكمية"], cell: (r) => `<div class="t-sm">${L("Max", "الأقصى")} <b>${dash(r.max_quantity)}</b></div><div class="t-xs text-tertiary">${L("Min selection", "أدنى اختيار")} ${dash(r.minimum_selection)}</div>` },
        { head: ["Price", "السعر"], cell: (r) => `<b>${r.price}</b> <span class="t-xs text-tertiary">${esc(r.currency.code)}</span>` },
        { head: ["Visibility", "الظهور"], cell: vis },
        { head: ["Created Date", "تاريخ الإنشاء"], cell: (r) => `<span class="t-sm text-tertiary">${esc(r.created_at)}</span>` },
        { head: ["Actions", "الإجراءات"], cell: (r) => `<div class="row gap-1" data-perm="update_partner_services">
            <a class="icon-btn" href="${o.translationHref(r)}" aria-label="${L("Translation", "ترجمة")}" title="${L("Translation", "ترجمة")}">${ic("globe")}</a>
            ${iconBtn("edit", L("Edit service", "تعديل الخدمة"), `data-edit="${r.id}"`)}
            ${iconBtn(r.visibility === "active" ? "eyeOff" : "eye", L("Enable / disable service visibility", "تفعيل / إلغاء ظهور الخدمة"), `data-vis="${r.id}"`)}
            ${iconBtn("trash", L("Delete", "حذف"), `data-del="${r.id}"`)}
          </div>` },
      ],
    });
  
    /* ---------------- Create / edit service ---------------- */
    const DUR = [];
    for (let m = 5; m <= 180; m += 5) {
      const h = Math.floor(m / 60), mm = m % 60;
      DUR.push([m, m < 60 ? L(`${m} minutes`, `${m} دقائق`) : mm ? L(`${h} Hour${h > 1 ? "s" : ""} and ${mm} minutes`, `${h} ساعة و ${mm} دقائق`) : L(`${h} Hour${h > 1 ? "s" : ""}`, `${h} ${h > 1 ? "ساعات" : "ساعة"}`)]);
    }
    function svcForm(r) {
      const s = r || { name: "", description: "", visibility: "active", duration: "", price: "", max_quantity: "", minimum_selection: "" };
      const row = (label, control) => `<div class="sa-formrow"><label class="field__label">${label}</label><div>${control}</div></div>`;
      const visSel = SA.select([["1", L("Active", "نشط"), s.visibility === "active"], ["0", L("Inactive", "غير نشط"), s.visibility !== "active"]], 'data-f="visibility"');
      /* partnerServiceImageUpload.js: JPG / PNG only, 1 MB, checked on pick; "Remove image" */
      const img = `<div class="row gap-3" style="align-items:center;flex-wrap:wrap"><span class="cell-thumb" data-img-prev${s.image ? ` style="background:url('${esc(s.image)}') center/cover no-repeat"` : ""}>${s.image ? "" : ic("camera")}</span>
          <span class="t-sm text-tertiary" data-img-none ${s.image ? "hidden" : ""}>${L("No image uploaded.", "لا توجد صورة.")}</span>
          <label class="btn btn--sm btn--secondary">${ic("upload")}<span>${L("Service image", "صورة الخدمة")}</span><input type="file" accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png" style="display:none" data-img></label>
          <button type="button" class="btn btn--sm btn--ghost" data-img-rm ${s.image ? "" : "hidden"}>${ic("trash")}<span>${L("Remove image", "إزالة الصورة")}</span></button></div>
          <div data-err="image"></div>
          <span class="field__hint">${L("JPG or PNG only. Maximum file size 1 MB.", "صيغ JPG أو PNG فقط. الحد الأقصى لحجم الملف 1 ميجابايت.")}</span>`;
      const parts = {
        name: row(L("Name:", "الاسم"), `<input class="input" data-f="name" value="${esc(s.name)}" placeholder="${L("Enter type name", "أدخل اسم الخدمة")}"><div data-err="name"></div>`),
        vis: row(L("Visibility:", "الظهور"), visSel),
        desc: row(L("Description:", "الوصف"), `<textarea class="input" rows="4" data-f="description" placeholder="${L("Enter description", "أدخل الوصف")}">${esc(s.description)}</textarea>`),
        img: row(L("Service image", "صورة الخدمة"), img),
        dur: row(L("Duration:", "المدة"), SA.select([["", L("Select duration (optional)", "اختر المدة (اختياري)"), !s.duration]].concat(DUR.map((d) => [d[0], d[1], +s.duration === d[0]])), 'data-f="duration"')),
        price: row(L("Price:", "السعر"), `<input class="input" type="number" min="0" placeholder="0" data-f="price" value="${s.price === "" ? "" : esc(s.price)}"><div data-err="price"></div>`),
        maxq: row(L("Max Quantity", "الحد الأقصى للكمية"), `<input class="input" type="number" min="0" placeholder="${L("Optional", "اختياري")}" data-f="max_quantity" value="${s.max_quantity == null ? "" : esc(s.max_quantity)}">`),
        mins: row(L("Minimum Selection", "الحد الأدنى للاختيار"), `<input class="input" type="number" min="0" placeholder="${L("Enter minimum selection", "اختياري")}" data-f="minimum_selection" value="${s.minimum_selection == null ? "" : esc(s.minimum_selection)}">`),
      };
      /* field order differs between the dashboard's create and edit modals */
      return `<div class="stack gap-4"><div data-err="form"></div>${(r ? ["name", "desc", "img", "dur", "maxq", "mins", "price", "vis"] : ["name", "vis", "desc", "img", "dur", "price", "maxq", "mins"]).map((k) => parts[k]).join("")}</div>`;
    }
    function openSvc(r) {
      const el = SA.modal({ id: "svcModal", wide: true, title: r ? L("Edit service", "تعديل الخدمة") : L("Add service", "إضافة خدمة"), body: svcForm(r),
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" id="svcGo">${r ? L("Update", "تحديث") : L("Add new", "إضافة جديد")}</button>` });
      const errAt = (k, msg) => (el.querySelector(`[data-err="${k}"]`).innerHTML = msg ? `<span class="field__error">${ic("warn")} ${msg}</span>` : "");
      const formErr = (msg) => (el.querySelector('[data-err="form"]').innerHTML = msg ? `<div class="alert alert--danger"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${msg}</div></div>` : "");
      let image = r ? r.image : null;
      const showImg = () => {
        const pv = el.querySelector("[data-img-prev]");
        pv.style.background = image ? `url('${image}') center/cover no-repeat` : "";
        pv.innerHTML = image ? "" : ic("camera");
        el.querySelector("[data-img-none]").hidden = !!image;
        el.querySelector("[data-img-rm]").hidden = !image;
      };
      el.querySelector("[data-img]").onchange = (ev) => {
        const file = ev.target.files[0];
        ev.target.value = "";
        if (!file) return;
        const extOk = /\.(jpe?g|png)$/i.test(file.name || ""), mimeOk = ["image/jpeg", "image/jpg", "image/png"].includes(file.type);
        if (!mimeOk && !extOk) return errAt("image", L("Unsupported image format. Supported formats: JPG, PNG", "صيغة الصورة غير مدعومة. الصيغ المدعومة: JPG, PNG"));
        if (file.size > 1048576) return errAt("image", L("Max size 1MB for images", "الحد الأقصى للصور 1 ميجابايت"));
        errAt("image");
        image = URL.createObjectURL(file);
        showImg();
      };
      el.querySelector("[data-img-rm]").onclick = () => { image = null; errAt("image"); showImg(); };
      el.querySelector("#svcGo").onclick = () => {
        const get = (k) => el.querySelector(`[data-f="${k}"]`).value;
        errAt("name"); errAt("price"); formErr();
        let bad = false;
        if (get("name").trim().length < 3) { errAt("name", L("Minimum 3 symbols", "الحد الأدنى 3 رموز")); bad = true; }
        if (get("price") !== "" && +get("price") < 0) { errAt("price", L("Price must be 0 or greater", "يجب أن يكون السعر 0 أو أكثر")); bad = true; }
        if (bad) return;
        /* EditServiceModal.js / CreatePartnerServiceModal.js: one message at the top */
        const nonNeg = (v) => v === "" || (!isNaN(Number(v)) && Number(v) >= 0);
        if (get("duration") !== "" && (isNaN(Number(get("duration"))) || Number(get("duration")) < 0)) return formErr(L("Enter a valid duration.", "يرجى إدخال مدة صحيحة."));
        if (!nonNeg(get("max_quantity"))) return formErr(L("Max quantity must be 0 or greater", "يجب أن تكون الكمية القصوى 0 أو أكثر"));
        if (!nonNeg(get("minimum_selection"))) return formErr(L("Minimum selection must be 0 or greater", "يجب أن يكون الحد الأدنى للاختيار 0 أو أكثر"));
        const vals = { name: get("name").trim(), description: get("description"), visibility: get("visibility") === "1" ? "active" : "inactive",
          duration: get("duration") ? +get("duration") : null, price: +get("price") || 0,
          max_quantity: get("max_quantity") === "" ? null : +get("max_quantity"), minimum_selection: get("minimum_selection") === "" ? null : +get("minimum_selection"), image };
        /* create: POST /partners/{pid}/services · edit: POST /partners/{pid}/services/{id}/update-data (_method=PUT) */
        if (r) Object.assign(r, vals);
        else data.unshift(Object.assign({ id: Date.now(), currency: data[0] ? data[0].currency : { code: "SAR" }, status: "pending", created_at: new Date().toISOString().slice(0, 19).replace("T", " "), service_list: { id: list.id, name: list.name } }, vals));
        SA.close(el);
        ctl.paint();
      };
    }
  
    function confirmBox(id, title, text, okLabel, danger, onOk) {
      const el = SA.modal({ id, title, body: `<p class="t-sm text-secondary">${text}</p>`,
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn${danger ? " btn--danger" : ""}" data-ok>${okLabel}</button>` });
      el.querySelector("[data-ok]").onclick = () => { onOk(); SA.close(el); ctl.paint(); };
    }
  
    o.addButton.onclick = () => openSvc(null);
    listMount.addEventListener("click", (e) => {
      const ed = e.target.closest("[data-edit]"), v = e.target.closest("[data-vis]"), d = e.target.closest("[data-del]");
      if (ed) openSvc(ctl.rowById(ed.dataset.edit));
      if (v) {
        const r = ctl.rowById(v.dataset.vis);
        const next = r.visibility === "active" ? L("Inactive", "غير نشط") : L("Active", "نشط");
        confirmBox("visModal", L("Change service visibility", "تغيير ظهور الخدمة"), L(`Set visibility for "${esc(r.name)}" to ${next}?`, `تعيين ظهور "${esc(r.name)}" إلى ${next}؟`), L("Confirm", "تأكيد"), false,
          () => (r.visibility = r.visibility === "active" ? "inactive" : "active"));
      }
      if (d) {
        const r = ctl.rowById(d.dataset.del);
        confirmBox("delSvcModal", L("Please confirm that you want to delete this service", "يرجى تأكيد أنك تريد حذف هذه الخدمة"), L("Please confirm that you want to delete this service.", "يرجى تأكيد حذف هذه الخدمة."), L("Delete", "حذف"), true,
          () => data.splice(data.indexOf(r), 1));
      }
    });
  
    return ctl;
  }

  /* "Add service list" — profile only (CreatePartnerServiceListModal.js) */
  function addList(o, onDone) {
    const f = { name: "", note: "", req: false, qty: false, sel: "multiple", min: "0", max: "", unlimited: true };
    const errLine = (m) => `<span class="field__error">${ic("warn")} ${m}</span>`;
    const sec = (title, hint, body) => `<section class="card card--pad stack gap-4" style="box-shadow:none">
        <div class="row between gap-3" style="flex-wrap:wrap"><b>${title}</b><span class="t-xs text-tertiary">${hint}</span></div>${body}</section>`;
    const body = () => {
      const single = f.sel === "single" && !f.qty;
      return `<div class="stack gap-4"><p class="t-sm text-tertiary">${L("Create a new list with selection rules for this partner.", "أنشئ قائمة جديدة بقواعد الاختيار لهذا الشريك.")}</p>
      ${sec(L("Basic information", "المعلومات الأساسية"), L("Provide a name and optional note", "أدخل اسماً وملاحظة اختيارية"), `
        ${SA.field(["List name", "اسم القائمة"], `<input class="input" data-f="name" value="${esc(f.name)}"><div data-e="name"></div>`, { req: true })}
        ${SA.field(["Note", "ملاحظة"], `<input class="input" data-f="note" value="${esc(f.note)}">`, { hint: ["Optional helper note for administrators.", "ملاحظة اختيارية للمسؤولين."] })}`)}
      ${sec(L("Configuration", "الإعدادات"), L("Behavior and selection rules", "السلوك وقواعد الاختيار"), `
        <div><label class="switch"><input type="checkbox" data-f="req" ${f.req ? "checked" : ""}><span class="switch__track"></span>${L("Required", "إلزامي")}</label>
          <div class="t-xs text-tertiary" style="margin-top:var(--space-1)">${L("If enabled, user must select at least the minimum.", "عند التفعيل، يجب على المستخدم اختيار الحد الأدنى على الأقل.")}</div></div>
        <div><label class="switch"><input type="checkbox" data-f="qty" ${f.qty ? "checked" : ""}><span class="switch__track"></span>${L("Enable quantity-based selection", "تفعيل الاختيار حسب الكمية الإجمالية")}</label>
          <div class="t-xs text-tertiary" style="margin-top:var(--space-1)">${L("Counts total quantity across selected services.", "يحسب إجمالي الكمية عبر الخدمات المختارة.")}</div></div>
        <div class="field"><span class="field__label">${L("Selection type", "نوع الاختيار")}</span><div class="row gap-5" style="flex-wrap:wrap">
          <label class="check check--radio"><input type="radio" name="svSel" value="single" data-f="sel" ${f.sel === "single" ? "checked" : ""}><span class="check__box"><span class="check__dot"></span></span>${L("Single selection", "اختيار فردي")}</label>
          <label class="check check--radio"><input type="radio" name="svSel" value="multiple" data-f="sel" ${f.sel === "multiple" ? "checked" : ""}><span class="check__box"><span class="check__dot"></span></span>${L("Multiple selection", "اختيار متعدد")}</label></div>
          <span class="field__hint">${L("Single selection will restrict maximum to 1 automatically.", "الاختيار الفردي يقيّد الحد الأقصى تلقائياً إلى 1.")}</span></div>`)}
      ${sec(L("Dynamic rules", "القواعد الديناميكية"), L("Rules adapt to quantity mode and selection type", "تتأثر القواعد بوضع الكمية ونوع الاختيار"), `
        <b class="t-sm">${L("Selection limits", "حدود الاختيار")}</b>
        <div class="grid grid-2">${SA.field(f.qty ? ["Min total quantity", "الحد الأدنى لإجمالي الكمية"] : ["Min selection", "الحد الأدنى للاختيار"], `<input class="input" type="number" min="0" data-f="min" value="${f.min}">`)}
          ${SA.field(f.qty ? ["Max total quantity", "الحد الأقصى لإجمالي الكمية"] : ["Max selection", "الحد الأقصى للاختيار"], `<input class="input" type="number" min="1" data-f="max" value="${single ? 1 : f.unlimited ? "" : f.max}" placeholder="${L("Leave empty for unlimited", "اتركه فارغاً لعدم وجود حد أقصى")}" ${single || f.unlimited ? "disabled" : ""}>`)}</div>
        <label class="check"><input type="checkbox" data-f="unlimited" ${f.unlimited && !single ? "checked" : ""} ${single ? "disabled" : ""}><span class="check__box">${ic("check")}</span>${L("Unlimited", "بدون حد أقصى")}</label>
        <div data-e="rules"></div>`)}</div>`;
    };
    const el = SA.modal({ id: "svAddList", wide: true, title: L("Add service list", "إضافة قائمة خدمات"), body: body(),
      foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${L("Add new", "إضافة جديد")}</button>` });
    const b = el.querySelector(".modal__body");
    b.oninput = (e) => { const k = e.target.dataset.f; if (k === "name" || k === "note" || k === "min" || k === "max") f[k] = e.target.value; };
    b.onchange = (e) => { const k = e.target.dataset.f; if (k === "req" || k === "qty" || k === "unlimited") f[k] = e.target.checked; if (k === "sel") f.sel = e.target.value; if (["req", "qty", "sel", "unlimited"].includes(k)) b.innerHTML = body(); };
    el.querySelector("[data-ok]").onclick = () => {
      el.querySelector('[data-e="name"]').innerHTML = ""; el.querySelector('[data-e="rules"]').innerHTML = "";
      if (!f.name.trim()) return (el.querySelector('[data-e="name"]').innerHTML = errLine(L("List name is required.", "اسم القائمة مطلوب.")));
      const single = f.sel === "single" && !f.qty, min = f.min === "" ? null : +f.min, max = single ? 1 : f.unlimited || f.max === "" ? null : +f.max;
      let m = "";
      if (min == null || min < 0) m = f.qty ? L("Enter a valid minimum quantity (0 or greater).", "أدخل حداً أدنى للكمية صالحاً (0 أو أكثر).") : L("Enter a valid minimum (0 or greater).", "أدخل حداً أدنى صالحاً (0 أو أكثر).");
      else if (single && !f.req && min > 1) m = L("For optional single selection, use min 0 or 1.", "للاختيار الفردي الاختياري استخدم حداً أدنى 0 أو 1.");
      else if (max != null && max < 1) m = f.qty ? L("Maximum quantity must be at least 1 or empty.", "يجب أن يكون الحد الأقصى للكمية 1 على الأقل أو فارغاً.") : L("Max must be at least 1 or empty for unlimited.", "يجب أن يكون الحد الأقصى 1 على الأقل أو فارغاً لعدم التقييد.");
      else if (max != null && max < min) m = f.qty ? L("Maximum quantity must be greater than or equal to minimum.", "يجب أن يكون الحد الأقصى للكمية أكبر من أو يساوي الحد الأدنى.") : L("Max must be greater than or equal to min.", "يجب أن يكون الحد الأقصى أكبر من أو يساوي الحد الأدنى.");
      else if (f.req && min === 0) m = f.qty ? L("When the list is required, minimum total quantity must be greater than 0.", "عند جعل القائمة مطلوبة يجب أن يكون الحد الأدنى لإجمالي الكمية أكبر من 0.") : L("When the list is required, minimum selection must be greater than 0.", "عند جعل القائمة مطلوبة يجب أن يكون الحد الأدنى للاختيار أكبر من 0.");
      if (m) return (el.querySelector('[data-e="rules"]').innerHTML = `<div class="alert alert--danger"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${m}</div></div>`);
      /* POST /partners/{id}/service-list */
      const l = { id: Date.now(), name: f.name.trim(), note: f.note, partner: { id: o.partner.id, company_name: o.partner.company_name }, is_default: false, status: "pending", status_trans: "Pending",
        is_required: f.req ? 1 : 0, selection_type: f.sel, has_qty: f.qty ? 1 : 0, min_selection: f.qty ? null : min, max_selection: f.qty ? null : max, min_total_quantity: f.qty ? min : null, max_total_quantity: f.qty ? max : null,
        services_count: 0, created_at: new Date().toISOString().slice(0, 19).replace("T", " ") };
      HF.SA.serviceLists.unshift(l);
      SA.close(el);
      onDone(l);
    };
  }

  return { lists, services, addList };
})();
