/* ============================================================================
   SA TRANSLATION — the shared translation page (modules/translations).
   Used for partners, branches, service lists, services, units, packages,
   activities, currencies and content pages.
   API: GET /translations/{model}/{id} · POST …/{id} · POST …/{id}/delete

   Redesign (2026-11-17): same data, same edit / delete flows and fields, laid
   out as a record header (item name, "n of 3 languages translated" + progress,
   back) over one card per language (status badge, every translated field as
   label over value, Edit / Add translation + delete). The edit modal shows the
   original text above each input as a reference. Previous version in
   revisions/sa-translation-2026-11-17-before-redesign.js.
   ========================================================================== */
window.SATR = (function () {
  "use strict";
  const { L, esc, ic, badge } = SA;
  const store = {};
  /* callers pass dashboard labels as-is ("name", "BIO", "edit translates");
     shown in sentence case */
  const cap = (s) => { s = String(s || ""); return /^[A-Z]{3,}$/.test(s) ? s[0] + s.slice(1).toLowerCase() : s.charAt(0).toUpperCase() + s.slice(1); };
  const valueOf = (t, c) => (t.translations.find((x) => x.column_name === c) || {}).value || "";

  /* o: { key, itemName, cols:[[column_name, label]], src:{column_name:value}, backHref, editTitle? } */
  function render(mount, o) {
    if (!store[o.key]) store[o.key] = [["en", "English"], ["ar", "العربية"], ["fr", "Français"]].map(([code, name]) => ({ id: code, name, created: code !== "fr",
      translations: o.cols.map(([c]) => ({ column_name: c, value: code === "fr" || !o.src[c] ? "" : code === "ar" ? "ترجمة " + o.src[c] : o.src[c] })) }));
    const items = store[o.key];
    const cols = o.cols.map(([c, label]) => [c, cap(label)]);
    const rtl = () => document.documentElement.dir === "rtl";

    const card = (t) => {
      const filled = cols.filter(([c]) => valueOf(t, c)).length;
      const state = !t.created ? ["warning", L("Not translated", "غير مترجم")] : filled < cols.length ? ["info", L("Partly translated", "مترجم جزئياً")] : ["success", L("Translated", "مترجم")];
      return `<article class="card" style="display:flex;flex-direction:column;min-width:0">
        <header class="row gap-3" style="align-items:center;padding:var(--space-4) var(--space-5);border-bottom:1px solid var(--color-border-subtle)">
          <span aria-hidden="true" style="flex:none;inline-size:40px;block-size:40px;border-radius:var(--radius-md);display:grid;place-items:center;background:var(--color-surface-sunken);font-size:var(--text-xs);font-weight:var(--weight-bold);letter-spacing:.04em">${t.id.toUpperCase()}</span>
          <div style="min-width:0;flex:1"><b style="display:block">${esc(t.name)}</b><span class="t-xs text-tertiary">${L(`${filled} of ${cols.length} fields`, `${filled} من ${cols.length} حقول`)}</span></div>
          ${badge(state[0], state[1])}
        </header>
        <dl style="margin:0;padding:var(--space-4) var(--space-5);display:grid;gap:var(--space-4);flex:1">${cols.map(([c, label]) => {
          const v = valueOf(t, c);
          return `<div style="min-width:0"><dt class="t-xs text-tertiary" style="margin-bottom:var(--space-1)">${esc(label)}</dt><dd style="margin:0;font-size:var(--text-sm);overflow-wrap:anywhere">${v
            ? `<span dir="auto" style="display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${esc(v)}</span>`
            : `<span class="text-tertiary" style="font-style:italic">${L("Not translated yet", "لم تتم الترجمة بعد")}</span>`}</dd></div>`;
        }).join("")}</dl>
        <footer class="row gap-2" style="align-items:center;padding:var(--space-3) var(--space-5);border-top:1px solid var(--color-border-subtle)">
          <button type="button" class="btn btn--sm ${t.created ? "btn--secondary" : ""}" data-ed="${t.id}">${ic(t.created ? "edit" : "plus")}<span>${t.created ? L("Edit", "تعديل") : L("Add translation", "إضافة ترجمة")}</span></button>
          <button type="button" class="icon-btn" style="margin-inline-start:auto" data-del="${t.id}" aria-label="${L("Delete translation", "حذف الترجمة")}" data-tip="${L("Delete translated item", "حذف العنصر المترجم")}">${ic("trash")}</button>
        </footer>
      </article>`;
    };

    const paint = () => {
      const done = items.filter((t) => t.created).length;
      mount.innerHTML = `<section class="card card--pad animate-in" style="margin-bottom:var(--space-5)">
          <div class="record-head" style="align-items:center">
            <div class="record-head__media" style="inline-size:56px;block-size:56px;color:var(--color-primary)">${ic("globe")}</div>
            <div class="record-head__id">
              <div class="t-xs text-tertiary" style="margin-bottom:var(--space-1)">${L("Translation", "الترجمة")}</div>
              <h1 class="t-title" style="margin:0 0 var(--space-2);overflow-wrap:anywhere">${esc(o.itemName)}</h1>
              <div class="row gap-3" style="align-items:center;flex-wrap:wrap">
                <div class="progress" style="inline-size:160px;flex:none" role="progressbar" aria-valuemin="0" aria-valuemax="${items.length}" aria-valuenow="${done}" aria-label="${L("Languages translated", "اللغات المترجمة")}"><div class="progress__bar" style="width:${Math.round((done / items.length) * 100)}%"></div></div>
                <span class="t-sm text-secondary">${L(`${done} of ${items.length} languages translated`, `${done} من ${items.length} لغات مترجمة`)}</span>
              </div>
            </div>
            <div class="record-head__actions"><a class="btn btn--secondary" href="${o.backHref}">${ic(rtl() ? "chevronRight" : "chevronLeft")}<span>${L("Back", "رجوع")}</span></a></div>
          </div>
        </section>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr));gap:var(--space-5)">${items.map(card).join("")}</div>`;
    };

    mount.addEventListener("click", (e) => {
      const ed = e.target.closest("[data-ed]"), del = e.target.closest("[data-del]");
      if (ed) {
        const t = items.find((x) => x.id === ed.dataset.ed);
        const title = o.editTitle ? cap(String(o.editTitle).replace(/translates/i, "translations")) : L("Edit translation for", "تعديل الترجمة لـ");
        const el = SA.modal({ id: "saTr", title: `${title}${o.editTitle ? " — " : " "}${esc(o.itemName)} (${esc(t.name)})`,
          body: `<div class="stack gap-5">${cols.map(([c, label]) => {
            const v = valueOf(t, c), src = o.src[c];
            const long = /bio|description|note|content/.test(c);
            const ph = c === "bio" ? L("Enter bio", "أدخل نبذة") : `${L("Enter translation", "أدخل الترجمة")} (${label})`;
            return `<div class="stack gap-2"><label class="field__label" for="tr-${c}">${esc(label)}</label>
              ${src ? `<div class="t-xs text-secondary" style="padding:var(--space-2) var(--space-3);border-radius:var(--radius-sm);background:var(--color-surface-sunken);overflow-wrap:anywhere"><b class="text-tertiary">${L("Original", "النص الأصلي")}:</b> <span dir="auto">${esc(src)}</span></div>` : ""}
              ${long ? `<textarea class="input" id="tr-${c}" rows="3" dir="auto" data-c="${c}" placeholder="${ph}">${esc(v)}</textarea>` : `<input class="input" id="tr-${c}" dir="auto" data-c="${c}" value="${esc(v)}" placeholder="${ph}">`}</div>`;
          }).join("")}</div>`,
          foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${L("Update", "تحديث")}</button>` });
        el.querySelector("[data-ok]").onclick = () => {
          el.querySelectorAll("[data-c]").forEach((i) => { t.translations.find((x) => x.column_name === i.dataset.c).value = i.value; });
          t.created = t.translations.some((x) => x.value);
          SA.close(el); paint();
        };
      }
      if (del) {
        const t = items.find((x) => x.id === del.dataset.del);
        /* DeleteTranslationModal: same wording as the dashboard; allowed on a language with
           nothing translated, which answers "There are no translation columns to delete" */
        const el = SA.modal({ id: "saTrDel", title: L("Delete translated item", "حذف العنصر المترجم"), body: `<div data-alert></div><p class="t-sm text-secondary">${L("Please confirm that you want to delete this translated item", "يرجى تأكيد أنك تريد حذف هذا العنصر المترجم")} <b>(${esc(t.name)})</b></p>`,
          foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn btn--danger" data-ok>${L("Confirm", "تأكيد")}</button>` });
        el.querySelector("[data-ok]").onclick = () => {
          if (!t.translations.some((x) => x.value)) { el.querySelector("[data-alert]").innerHTML = `<div class="alert alert--danger"><span class="alert__icon">${ic("warn")}</span><div class="alert__body">${L("There are no translation columns to delete", "لا توجد أعمدة ترجمة للحذف")}</div></div>`; return; }
          t.translations.forEach((x) => (x.value = "")); t.created = false; SA.close(el); paint();
        };
      }
    });
    paint();
  }
  return { render };
})();
