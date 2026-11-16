/* ============================================================================
   SA KIT — the pieces every Super Admin list page repeats, built ONLY from
   registry components (segmented, input-wrap, data-table, badge, pagination,
   modal, popover, select). Pages describe WHAT to show; this file renders it
   the same way everywhere, so 20+ CRUD screens stay identical.

   Load after assets/shell.js. Every label is passed in by the page as
   [EN, AR] — the kit never invents copy.
   ========================================================================== */
window.SA = (function () {
  "use strict";
  const ic = (n) => RD.icon(n);
  const AR = () => document.documentElement.dir === "rtl";
  const L = (en, ar) => (AR() ? ar : en);
  const T = (pair) => (Array.isArray(pair) ? L(pair[0], pair[1]) : pair);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (n) => Number(n || 0).toLocaleString("en-US");

  /* Page head: title + breadcrumb (Dashboard › …) + toolbar slot */
  function head(mount, o) {
    const crumbs = [["Dashboard", "لوحة القيادة", "index.html"]].concat(o.crumbs || []);
    mount.innerHTML = `
      <div class="row between gap-4 animate-in" style="flex-wrap:wrap;align-items:flex-end;margin-bottom:var(--space-6)">
        <div>
          <h1 class="t-h3">${esc(T(o.title))}</h1>
          <nav class="t-sm text-tertiary" aria-label="Breadcrumb" style="margin-top:var(--space-1)">
            ${crumbs.map((c) => `<a href="${c[2]}" style="color:inherit">${esc(L(c[0], c[1]))}</a>`).join(" › ")} › <span>${esc(T(o.title))}</span>
          </nav>
        </div>
        <div class="row gap-2" style="flex-wrap:wrap">${o.actions || ""}</div>
      </div>`;
  }

  /* Status pills with counts — the dashboard's "all (n) · pending (n)…" tabs */
  function pills(items, active) {
    return `<div class="segmented" role="tablist">${items
      .map((it) => `<button type="button" role="tab" data-pill="${esc(it.key)}" aria-selected="${it.key === active}" class="${it.key === active ? "is-active" : ""}">${esc(T(it.label))} (${fmt(it.count)})</button>`)
      .join("")}</div>`;
  }

  function search(placeholder, value) {
    return `<div class="input-wrap" style="min-width:min(100%,340px)"><span class="input-wrap__icon">${ic("search")}</span>
      <input class="input" type="search" data-search placeholder="${esc(T(placeholder))}" value="${esc(value || "")}" aria-label="${esc(T(placeholder))}"></div>`;
  }

  function badge(tone, text) {
    return `<span class="badge${tone ? " badge--" + tone : ""}">${esc(text)}</span>`;
  }

  function iconBtn(icon, label, attrs) {
    return `<button type="button" class="icon-btn" aria-label="${esc(label)}" title="${esc(label)}" ${attrs || ""}>${ic(icon)}</button>`;
  }

  /* Table body + footer. columns: [{head:[en,ar], cell:(row)=>html, label?:[en,ar], align?}] */
  function table(o) {
    const cols = o.columns.filter((c) => c && !c.hidden);
    const head = `<thead><tr>${cols.map((c) => {
      const al = c.align ? ` style="text-align:${c.align}"` : "";
      if (!c.sort) return `<th${al}>${esc(T(c.head))}</th>`;
      const on = o.sort && o.sort.key === c.sort;
      return `<th class="sortable"${al} aria-sort="${on ? (o.sort.dir === "asc" ? "ascending" : "descending") : "none"}"><button type="button" class="th-inner" data-sort="${c.sort}" style="${on ? "color:var(--color-primary-ink)" : ""}">${esc(T(c.head))} <span aria-hidden="true">${on ? (o.sort.dir === "asc" ? "↑" : "↓") : "↕"}</span></button></th>`;
    }).join("")}</tr></thead>`;
    const body = o.rows.length
      ? o.rows.map((r) => `<tr>${cols.map((c, i) => `<td${i ? ` data-label="${esc(T(c.label || c.head))}"` : ""}${c.align ? ` style="text-align:${c.align}"` : ""}>${c.cell(r)}</td>`).join("")}</tr>`).join("")
      : `<tr><td colspan="${cols.length}" style="text-align:center;padding:var(--space-10) var(--space-4)" class="text-tertiary">${o.emptyRaw ? o.empty : esc(T(o.empty))}</td></tr>`;
    return `<div class="data-table-scroll"><table class="data-table">${head}<tbody>${body}</tbody></table></div>`;
  }

  /* Footer: "Showing X to Y of N items · Show [15|50|100] items · First ‹ 1 2 3 › Last" */
  function pager(o) {
    const pages = Math.max(1, Math.ceil(o.total / o.limit));
    const from = o.total ? (o.page - 1) * o.limit + 1 : 0;
    const to = Math.min(o.total, o.page * o.limit);
    let s = Math.max(1, o.page - 2), e = Math.min(pages, s + 4);
    s = Math.max(1, e - 4);
    const nums = [];
    for (let p = s; p <= e; p++) nums.push(p);
    const btn = (p, label, cls, dis) => `<button type="button" data-page="${p}" class="${cls || ""}" ${dis ? "disabled" : ""}>${label}</button>`;
    return `<div class="data-table-footer" style="flex-wrap:wrap;gap:var(--space-3)">
      <span class="t-sm text-tertiary">${L(`Showing ${from} to ${to} of ${fmt(o.total)} items`, `عرض ${from} إلى ${to} من ${fmt(o.total)} عنصر`)}</span>
      <span class="row gap-2 t-sm text-tertiary" style="align-items:center">${L("Show", "عرض")}
        <span class="select" style="min-width:76px"><select data-limit aria-label="${L("Items per page", "عدد العناصر")}">${(o.sizes || [15, 50, 100]).map((n) => `<option ${n === o.limit ? "selected" : ""}>${n}</option>`).join("")}</select><span class="select__caret">${ic("chevronDown")}</span></span>
        ${L("items", "عناصر")}</span>
      <div class="pagination">
        ${btn(1, L("First", "الأولى"), "", o.page === 1)}
        ${btn(o.page - 1, ic("chevronRight"), "pg-prev", o.page === 1)} <!-- one glyph for both; components.css mirrors per direction -->
        ${nums.map((p) => btn(p, p, p === o.page ? "is-active" : "")).join("")}
        ${btn(o.page + 1, ic("chevronRight"), "pg-next", o.page === pages)}
        ${btn(pages, L("Last", "الأخيرة"), "", o.page === pages)}
      </div>
    </div>`;
  }

  /* List controller: state + filtering + paging over in-page sample rows. */
  function list(o) {
    const st = { pill: o.pills ? o.pills[0].key : null, q: "", page: 1, limit: (o.sizes || [15])[0], extra: {}, sort: null };
    const root = o.mount;
    function rows() {
      return o.data.filter((r) => (!o.pillMatch || o.pillMatch(r, st.pill)) && (!st.q || o.searchMatch(r, st.q.toLowerCase())) && (!o.extraMatch || o.extraMatch(r, st.extra)));
    }
    function paint() {
      const all = rows();
      if (st.sort && o.sorter) all.sort((a, b) => o.sorter(a, b, st.sort.key) * (st.sort.dir === "asc" ? 1 : -1));
      const pages = Math.max(1, Math.ceil(all.length / st.limit));
      if (st.page > pages) st.page = pages;
      const slice = all.slice((st.page - 1) * st.limit, st.page * st.limit);
      const counts = o.pills ? o.pills.map((p) => ({ key: p.key, label: p.label, count: o.data.filter((r) => o.pillMatch(r, p.key)).length })) : null;
      /* entrance animation on first paint only — repaints (search, paging) must not flicker */
      const anim = st.painted ? "" : " animate-in";
      st.painted = true;
      root.innerHTML = `<section class="data-table-wrap${anim}">
        ${o.cardTitle ? `<div class="data-table-toolbar"><b class="t-title">${esc(T(o.cardTitle))}</b></div>` : ""}
        <div class="data-table-toolbar" style="flex-wrap:wrap;gap:var(--space-3)">
          ${counts ? pills(counts, st.pill) : ""}
          <span class="grow"></span>
          ${o.search ? search(o.search, st.q) : ""}
          ${typeof o.toolbarExtra === "function" ? o.toolbarExtra(st) : o.toolbarExtra || ""}
        </div>
        ${o.banner ? o.banner : ""}
        ${table({ columns: o.columns, rows: slice, empty: typeof o.empty === "function" ? o.empty(st) : o.empty, emptyRaw: typeof o.empty === "function", sort: st.sort })}
        ${pager({ page: st.page, limit: st.limit, total: all.length, sizes: o.sizes })}
      </section>`;
      const inp = root.querySelector("[data-search]");
      if (inp && st.focus) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); st.focus = false; }
      if (o.after) o.after(root);
    }
    root.addEventListener("click", (e) => {
      const p = e.target.closest("[data-pill]");
      if (p) { st.pill = p.dataset.pill; st.page = 1; return paint(); }
      const so = e.target.closest("[data-sort]");
      if (so) { const k = so.dataset.sort; st.sort = st.sort && st.sort.key === k ? { key: k, dir: st.sort.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }; return paint(); }
      const g = e.target.closest("[data-page]");
      if (g && !g.disabled) { st.page = +g.dataset.page; return paint(); }
    });
    root.addEventListener("input", (e) => {
      if (e.target.matches("[data-search]")) {
        const v = e.target.value;
        if (o.minSearch && v.length && v.length < o.minSearch) return; /* dashboard rule: search from N chars */
        st.q = v; st.page = 1; st.focus = true; paint();
      }
    });
    root.addEventListener("change", (e) => {
      if (e.target.matches("[data-limit]")) { st.limit = +e.target.value; st.page = 1; paint(); }
    });
    paint();
    return { state: st, paint, rowById: (id) => o.data.find((r) => String(r.id) === String(id)) };
  }

  /* Modal: build once from {title, body, foot}; data-close closes it. */
  function modal(o) {
    let el = document.getElementById(o.id);
    if (!el) {
      el = document.createElement("div");
      el.className = "modal-overlay";
      el.id = o.id;
      document.body.appendChild(el);
      el.addEventListener("click", (e) => { if (e.target === el || e.target.closest("[data-close]")) close(el); });
    }
    el.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="${o.id}T" style="${o.wide ? "max-width:760px;width:100%" : ""}">
      <div class="modal__head"><span id="${o.id}T">${o.title}</span>
        <button class="icon-btn" data-close style="width:32px;height:32px" aria-label="${L("Close", "إغلاق")}">${ic("close")}</button></div>
      <div class="modal__body" style="${o.wide ? "max-height:70vh;overflow:auto" : ""}">${o.body}</div>
      <div class="modal__foot">${o.foot}</div></div>`;
    /* open on the next frame so the transition runs — unless it was closed first */
    el._sa_open = true;
    requestAnimationFrame(() => { if (el._sa_open) el.classList.add("is-open"); });
    return el;
  }
  function close(el) {
    const m = typeof el === "string" ? document.getElementById(el) : el;
    m._sa_open = false;
    m.classList.remove("is-open");
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.querySelectorAll(".modal-overlay.is-open").forEach(close);
  });

  /* Popover anchored under a trigger (filter dropdowns). */
  function popover(pop, trigger) {
    const r = trigger.getBoundingClientRect();
    pop.style.position = "fixed";
    pop.style.top = r.bottom + 6 + "px";
    pop.classList.add("is-open");
    const left = AR() ? r.left : r.right - pop.offsetWidth;
    pop.style.left = Math.min(Math.max(8, left), innerWidth - pop.offsetWidth - 8) + "px";
    const off = (e) => {
      if (!pop.contains(e.target) && !trigger.contains(e.target)) { pop.classList.remove("is-open"); document.removeEventListener("click", off); }
    };
    setTimeout(() => document.addEventListener("click", off));
  }

  const field = (label, control, o) => `<div class="field">${label ? `<label class="field__label">${esc(T(label))}${o && o.req ? ' <span class="req">*</span>' : ""}</label>` : ""}${control}${o && o.hint ? `<span class="field__hint">${esc(T(o.hint))}</span>` : ""}</div>`;
  const select = (opts, attrs) => `<div class="select"><select ${attrs || ""}>${opts.map((x) => `<option value="${esc(x[0])}" ${x[2] ? "selected" : ""}>${esc(x[1])}</option>`).join("")}</select><span class="select__caret">${ic("chevronDown")}</span></div>`;

  return { L, T, esc, fmt, ic, head, pills, search, badge, iconBtn, table, pager, list, modal, close, popover, field, select };
})();
