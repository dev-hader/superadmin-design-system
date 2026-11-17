/* ============================================================================
   SA TRANSLATION — the shared translation page (modules/translations):
   "{name} translation" + back, table Language · <one column per translated
   field> · Created · Actions (edit · delete). Used for partners, branches,
   service lists and services.
   API: GET /translations/{model}/{id} · POST …/{id} · POST …/{id}/delete
   ========================================================================== */
window.SATR = (function () {
  "use strict";
  const { L, esc, ic, badge } = SA;
  const store = {};
  /* o: { key, itemName, cols:[[column_name, label]], src:{column_name:value}, backHref, editTitle? } */
  function render(mount, o) {
    if (!store[o.key]) store[o.key] = [["en", "English"], ["ar", "العربية"], ["fr", "Français"]].map(([code, name]) => ({ id: code, name, created: code !== "fr",
      translations: o.cols.map(([c]) => ({ column_name: c, value: code === "fr" || !o.src[c] ? "" : code === "ar" ? "ترجمة " + o.src[c] : o.src[c] })) }));
    const items = store[o.key];
    const paint = () => {
      mount.innerHTML = `<div class="row between gap-3" style="align-items:center;flex-wrap:wrap;margin-bottom:var(--space-5)"><h3 class="t-title">${L(`${esc(o.itemName)} translation`, `ترجمة ${esc(o.itemName)}`)}</h3>
          <a class="btn btn--sm btn--secondary" href="${o.backHref}">${ic(document.documentElement.dir === "rtl" ? "chevronRight" : "chevronLeft")}<span>${L("back", "رجوع")}</span></a></div>
        <section class="data-table-wrap">${SA.table({ rows: items, empty: ["There is no data to display.", "لا توجد بيانات للعرض."], columns: [
          { head: ["Language", "اللغة"], cell: (t) => `<span class="row gap-2" style="align-items:center"><span class="badge">${t.id.toUpperCase()}</span><b>${esc(t.name)}</b></span>` },
        ].concat(o.cols.map(([c, label]) => ({ head: [label, label], cell: (t) => { const v = (t.translations.find((x) => x.column_name === c) || {}).value; return v ? `<span dir="auto">${esc(v)}</span>` : "---"; } })), [
          { head: ["Created", "تم الإنشاء"], align: "center", cell: (t) => (t.created ? badge("primary", L("Yes", "نعم")) : badge("danger", L("No", "لا"))) },
          { head: ["Actions", "الإجراءات"], align: "center", cell: (t) => `<div class="row gap-1" style="justify-content:center">${SA.iconBtn("edit", L("edit translates", "تعديل الترجمات"), `data-ed="${t.id}"`)}${SA.iconBtn("trash", L("delete translated item", "حذف العنصر المترجم"), `data-del="${t.id}"`)}</div>` },
        ]) })}</section>`;
    };
    mount.addEventListener("click", (e) => {
      const ed = e.target.closest("[data-ed]"), del = e.target.closest("[data-del]");
      if (ed) {
        const t = items.find((x) => x.id === ed.dataset.ed);
        const el = SA.modal({ id: "saTr", title: `${o.editTitle || L("edit translation for", "تعديل الترجمة لـ")} ${esc(o.itemName)} (${esc(t.name)})`,
          body: `<div class="stack gap-4">${o.cols.map(([c, label]) => {
            const v = (t.translations.find((x) => x.column_name === c) || {}).value || "";
            const long = /bio|description|note/.test(c);
            const ph = c === "bio" ? L("enter bio", "أدخل نبذة") : `${L("enter translate", "أدخل الترجمة")} (${label})`;
            return `<div class="sa-formrow"><label class="field__label">${label}:</label>${long ? `<textarea class="input" rows="3" dir="auto" data-c="${c}" placeholder="${ph}">${esc(v)}</textarea>` : `<input class="input" dir="auto" data-c="${c}" value="${esc(v)}" placeholder="${ph}">`}</div>`;
          }).join("")}</div>`,
          foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${L("update", "تحديث")}</button>` });
        el.querySelector("[data-ok]").onclick = () => {
          el.querySelectorAll("[data-c]").forEach((i) => { t.translations.find((x) => x.column_name === i.dataset.c).value = i.value; });
          t.created = t.translations.some((x) => x.value);
          SA.close(el); paint();
        };
      }
      if (del) {
        const t = items.find((x) => x.id === del.dataset.del);
        const el = SA.modal({ id: "saTrDel", title: L("delete translated item", "حذف العنصر المترجم"), body: `<p class="t-sm text-secondary">${L("Please confirm that you want to delete this translated item", "يرجى تأكيد أنك تريد حذف هذا العنصر المترجم")}</p>`,
          foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn btn--danger" data-ok>${L("Confirm", "تأكيد")}</button>` });
        el.querySelector("[data-ok]").onclick = () => { t.translations.forEach((x) => (x.value = "")); t.created = false; SA.close(el); paint(); };
      }
    });
    paint();
  }
  return { render };
})();
