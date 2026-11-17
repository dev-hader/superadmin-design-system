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
  /* Sentence case for UI copy (redesign 2026-11-17): the dashboard's English
     labels arrive as "create new type", "Create New Service", "edit Category".
     First letter up; later Capitalised words down unless they are names
     (languages, brands) — acronyms (SMS, ID, VAT) stay. Arabic is untouched.
     For labels and titles only, never for data. */
  const KEEP = /^(English|Arabic|French|HighFive|High|Five|Google|Apple|Android|Facebook|Instagram|Twitter|Saudi|Riyal|Egyptian|Pound|UAE|Dirham|Euro|Dollar|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Super|Admin)$/;
  const sc = (v) => {
    const str = String(v == null ? "" : v);
    return str.replace(/^(\s*)([a-z])/, (m, sp, c) => sp + c.toUpperCase()).replace(/(\s)([A-Z][a-z]+)\b/g, (m, sp, w, at, all) => (KEEP.test(w) || /[.?!:]\s*$/.test(all.slice(0, at)) ? m : sp + w.toLowerCase()));
  };
  const TS = (pair) => sc(T(pair));
  /* page titles keep the sidebar’s Title Case — only the first letter is fixed */
  const up1 = (v) => String(v == null ? "" : v).replace(/^(\s*)([a-z])/, (m, sp, c) => sp + c.toUpperCase());
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (n) => Number(n || 0).toLocaleString("en-US");

  /* Page head: title + breadcrumb (Dashboard › …) + toolbar slot */
  function head(mount, o) {
    const crumbs = [["Dashboard", "لوحة القيادة", "index.html"]].concat(o.crumbs || []);
    mount.innerHTML = `
      <div class="row between gap-4 animate-in" style="flex-wrap:wrap;align-items:flex-end;margin-bottom:var(--space-6)">
        <div>
          <h1 class="t-h3">${esc(up1(T(o.title)))}</h1>
          <nav class="t-sm text-tertiary" aria-label="Breadcrumb" style="margin-top:var(--space-1)">
            ${crumbs.map((c) => `<a href="${c[2]}" style="color:inherit">${esc(L(c[0], c[1]))}</a>`).join(" › ")} › <span>${esc(up1(T(o.title)))}</span>
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
      <input class="input" type="search" data-search placeholder="${esc(TS(placeholder))}" value="${esc(value || "")}" aria-label="${esc(TS(placeholder))}"></div>`;
  }

  function badge(tone, text) {
    return `<span class="badge${tone ? " badge--" + tone : ""}">${esc(text)}</span>`;
  }

  function iconBtn(icon, label, attrs) {
    return `<button type="button" class="icon-btn" aria-label="${esc(label)}" data-tip="${esc(label)}" ${attrs || ""}>${ic(icon)}</button>`;
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

  /* Status filter as registry stat-tiles instead of pills (opt-in: list({ tiles: true })).
     Same data-pill hook and counts as the pills; each pill may carry { icon, tone }. */
  const TONES = { warning: ["--color-warning-subtle", "--color-warning"], primary: ["--color-primary-subtle", "--color-primary-ink"], success: ["--color-success-subtle", "--color-success"], danger: ["--color-danger-subtle", "--color-danger"], info: ["--color-info-subtle", "--color-info"] };
  const AUTO_LOOK = (k) => {
    k = String(k || "").toLowerCase();
    if (k === "all") return ["list", "primary"];
    if (/^(1|active|approved|completed|complete|accepted|paid|published|purchased|success|done|confirmed|verified|read|sent|in)$/.test(k)) return ["check", "success"];
    if (/^(0|inactive|not_approved|rejected|cancell?ed|failed|expired|ended|blocked|unpaid|refunded|out|deleted)$/.test(k)) return ["close", "danger"];
    if (/^(pending|requested|waiting|processing|upcoming|scheduled|draft|unread|new|in_progress)$/.test(k)) return ["clock", "warning"];
    return ["layers", ""];
  };
  function tiles(items, active) {
    items = items.map((it) => (it.icon ? it : Object.assign({}, it, { icon: AUTO_LOOK(it.key)[0], tone: it.tone || AUTO_LOOK(it.key)[1] })));
    return `<div class="stat-strip animate-in" role="group" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-bottom:var(--space-4)">${items.map((it) => {
      const on = it.key === active, tn = TONES[it.tone] || ["--color-surface-sunken", "--color-text-secondary"];
      return `<button type="button" class="stat-tile${on ? " is-active" : ""}" aria-pressed="${on}" data-pill="${esc(it.key)}">${it.icon ? `<span class="kpi-ic" style="background:var(${tn[0]});color:var(${tn[1]});box-shadow:none">${ic(it.icon)}</span>` : ""}
        <span class="stat-tile__txt"><span class="stat-tile__val" style="font-variant-numeric:tabular-nums">${fmt(it.count)}</span><span class="stat-tile__label">${esc(TS(it.label))}</span></span></button>`;
    }).join("")}</div>`;
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
      const counts = o.pills ? o.pills.map((p) => ({ key: p.key, label: p.label, icon: p.icon, tone: p.tone, count: o.data.filter((r) => o.pillMatch(r, p.key)).length })) : null;
      /* entrance animation on first paint only — repaints (search, paging) must not flicker */
      const anim = st.painted ? "" : " animate-in";
      st.painted = true;
      root.innerHTML = `${counts && o.tiles !== false ? tiles(counts, st.pill) : ""}<section class="data-table-wrap${anim}">
        ${o.cardTitle ? `<div class="data-table-toolbar"><b class="t-title">${esc(T(o.cardTitle))}</b></div>` : ""}
        <div class="data-table-toolbar" style="flex-wrap:wrap;gap:var(--space-3)">
          ${counts && o.tiles === false ? pills(counts, st.pill) : ""}
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
      /* tiles: clicking the active tile clears it back to the first one (stat-tile contract) */
      if (p) { st.pill = o.tiles !== false && p.dataset.pill === st.pill ? o.pills[0].key : p.dataset.pill; st.page = 1; return paint(); }
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
      el.addEventListener("click", (e) => { if ((e.target === el && !el._sa_static) || e.target.closest("[data-close]")) close(el); });
    }
    /* o.static: like the dashboard's backdrop='static' keyboard={false} — only the
       close / Cancel buttons close it (no backdrop click, no Esc) */
    el._sa_static = !!o.static;
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
    if (e.key === "Escape") document.querySelectorAll(".modal-overlay.is-open").forEach((m) => { if (!m._sa_static) close(m); });
  });

  /* Popover anchored under a trigger (filter dropdowns). */
  /* Fixed popover anchored to its trigger: opens below, or above when there is
     more room there; its height is capped to the visible space (it scrolls inside);
     closes on outside click and when the page scrolls (it would drift off the trigger). */
  function popover(pop, trigger) {
    const r = trigger.getBoundingClientRect(), gap = 6, pad = 8;
    pop.style.position = "fixed";
    pop.classList.add("is-open");
    const below = innerHeight - r.bottom - gap - pad, above = r.top - gap - pad;
    const up = pop.offsetHeight > below && above > below;
    const room = Math.max(160, up ? above : below);
    if (pop.offsetHeight > room) pop.style.maxHeight = room + "px";
    pop.style.top = (up ? Math.max(pad, r.top - gap - pop.offsetHeight) : r.bottom + gap) + "px";
    const left = AR() ? r.left : r.right - pop.offsetWidth;
    pop.style.left = Math.min(Math.max(pad, left), innerWidth - pop.offsetWidth - pad) + "px";
    const close = () => { pop.classList.remove("is-open"); document.removeEventListener("click", off); removeEventListener("scroll", onScroll, true); };
    const off = (e) => { if (!pop.contains(e.target) && !trigger.contains(e.target)) close(); };
    const onScroll = (e) => { if (!pop.contains(e.target)) close(); };
    setTimeout(() => { document.addEventListener("click", off); addEventListener("scroll", onScroll, true); });
  }

  const field = (label, control, o) => `<div class="field">${label ? `<label class="field__label">${esc(T(label))}${o && o.req ? ' <span class="req">*</span>' : ""}</label>` : ""}${control}${o && o.hint ? `<span class="field__hint">${esc(T(o.hint))}</span>` : ""}</div>`;
  const select = (opts, attrs) => `<div class="select"><select ${attrs || ""}>${opts.map((x) => `<option value="${esc(x[0])}" ${x[2] ? "selected" : ""}>${esc(x[1])}</option>`).join("")}</select><span class="select__caret">${ic("chevronDown")}</span></div>`;

  /* the designed tooltip (data-tip / title) lives in assets/shell.js so every page has it */

  /* Crop step (stand-in for the dashboard's UploadCropImage): after a file is picked,
     show it under a fixed-ratio frame with Crop / Cancel. Resolves with an object URL
     of the picked image (the static design system doesn't re-encode the pixels) or
     null when cancelled. o: { ratio: 1 | 16/9 | 1.415, title? }  */
  function crop(file, o) {
    o = o || {};
    return new Promise((resolve) => {
      if (!file || !/^image\//.test(file.type)) return resolve(file ? URL.createObjectURL(file) : null);
      const url = URL.createObjectURL(file), ratio = o.ratio || 1;
      const el = modal({ id: "saCrop", static: true, title: esc(o.title || L("Crop image", "قص الصورة")),
        body: `<div style="position:relative;width:100%;max-width:420px;margin-inline:auto;aspect-ratio:${ratio};border-radius:var(--radius-md);overflow:hidden;background:var(--color-surface-sunken) url('${url}') center/cover no-repeat">
            <div aria-hidden="true" style="position:absolute;inset:10%;border:2px solid #fff;box-shadow:0 0 0 999px rgba(0,0,0,.45);border-radius:var(--radius-sm)"></div></div>
          <p class="t-xs text-tertiary" style="margin:var(--space-3) 0 0;text-align:center">${L("Drag to choose the visible area.", "اسحب لاختيار الجزء الظاهر.")}</p>`,
        foot: `<button class="btn btn--ghost" data-crop-cancel>${L("Cancel", "إلغاء")}</button><button class="btn" data-crop-ok>${L("Crop", "قص")}</button>` });
      document.body.appendChild(el); /* keep the crop step above the modal that opened it */
      el.querySelector("[data-crop-ok]").onclick = () => { close(el); resolve(url); };
      el.querySelector("[data-crop-cancel]").onclick = () => { close(el); resolve(null); };
      el.querySelector(".modal__head [data-close]").onclick = () => resolve(null);
    });
  }

  return { L, T, sc, TS, up1, esc, fmt, ic, head, pills, search, badge, iconBtn, table, pager, list, modal, close, popover, field, select, crop };
})();
