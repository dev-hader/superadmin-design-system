/* Package detail — financial (taxes · commission) · QR management (barcode ·
   employees) · policy · activity log. Mirrors pages/packages/package-detail/
   {financial,qr,policy,activity}. */
(function () {
  "use strict";
  const { L, esc, ic, badge, fmt } = SA;
  const { card, kv } = PP;
  const KP = (window.KP = window.KP || { tabs: {} });
  const subTabs = (items, active, attr) => `<div class="tabs">${items.map((t) => `<button type="button" data-${attr}="${t[0]}" class="${t[0] === active ? "is-active" : ""}">${t[1]}</button>`).join("")}</div>`;
  const today = () => new Date().toISOString().slice(0, 10);

  /* ================= financial ================= */
  const SLOTS = [["online_package", "online_payment"], ["online_package", "cash_payment"], ["walk_in_package", "cash_payment"], ["linked_package", "cash_payment"]];
  const GRP = { online_package: ["Online package", "باقة أونلاين"], walk_in_package: ["Walk-in package", "باقة حضورية"], linked_package: ["Linked package", "باقة مرتبطة"] };
  const PW = { online_payment: ["Online payment", "دفع إلكتروني"], cash_payment: ["Cash payment", "دفع نقدي"] };
  const rates = (seed) => SLOTS.map((s, j) => ({ g: s[0], p: s[1], percent: seed ? [12, 8, 6, 5][j] + (seed % 3) : 0, fixed: seed ? [5, 0, 0, 2][j] : 0 }));
  KP.fin = function (k) {
    if (k._fin) return k._fin;
    const i = k.id % 7, p = k.partnerRef;
    const country = p ? p.country.name : "Saudi Arabia", city = p ? p.city.name : "Riyadh";
    k._fin = {
      banner: k.partner.disabled ? { tone: "warning", message: L("The partner is disabled — no new sales are taken.", "الشريك موقوف — لا تُقبل مبيعات جديدة.") } : null,
      taxes: [{ level: "country", title: L(`${country} taxes`, `ضرائب ${country}`), rows: [{ id: 1, name: "VAT", label: "15.00%", enabled: i % 2 === 0, can_enable: true }] },
        /* the state and the city can share a title ("ضرائب الرياض" twice) — the tab then appends the level */
        { level: "state", title: L(`${city} taxes`, `ضرائب ${city}`), rows: [] },
        { level: "city", title: L(`${city} taxes`, `ضرائب ${city}`), rows: i % 3 ? [{ id: 2, name: L("Municipality fee", "رسوم البلدية"), label: "2.50%", enabled: false, can_enable: i % 3 === 1 }] : [] }],
      set: i % 4 !== 0, def: { rates: rates(i % 4 ? i : 0), by: i % 4 ? "Super Admin" : null, at: i % 4 ? "08 Nov 2026 23:58" : null },
      scheduled: i % 2 ? [{ id: 1, name: L("Ramadan offer", "عرض رمضان"), starts_on: "2027-02-18", ends_on: "2027-03-19", rates: rates(1) }, { id: 2, name: L("Summer push", "دفعة الصيف"), starts_on: "2027-06-01", ends_on: "2027-08-31", rates: rates(2) }] : [],
      history: i % 4 ? [{ who: "Super Admin", when: "08 Nov 2026 23:58", note: L("Aligned with the new partner contract.", "تمت المواءمة مع عقد الشريك الجديد."), changes: [["online_package", "online_payment", "percent", 10, 12 + (i % 3)], ["linked_package", "cash_payment", "fixed", 0, 2]] }] : [],
    };
    return k._fin;
  };
  const ratesView = (rs, cur) => `<div class="data-table-scroll"><table class="data-table"><thead><tr><th>${L("Package type", "نوع الباقة")}</th><th>${L("Payment way", "طريقة الدفع")}</th><th>${L("Percentage", "النسبة")}</th><th>${L("Fixed amount", "مبلغ ثابت")}</th></tr></thead><tbody>${rs.map((r, j) => {
    const first = j === 0 || rs[j - 1].g !== r.g, span = rs.filter((x) => x.g === r.g).length;
    return `<tr>${first ? `<td rowspan="${span}"><b>${L(...GRP[r.g])}</b></td>` : ""}<td>${L(...PW[r.p])}</td><td>${r.percent || 0}%</td><td>${fmt(r.fixed || 0)} ${esc(cur)}</td></tr>`;
  }).join("")}</tbody></table></div>`;

  KP.tabs.financial = (mount, ctx) => {
    const k = ctx.pkg, F = KP.fin(k), cur = k.currency;
    const sub = ctx.params.get("sub") === "commission" ? "commission" : "taxes";
    const paint = (s) => {
      const top = (F.banner ? KP.notice(F.banner.tone, "info", esc(F.banner.message)) : "") + subTabs([["taxes", L("Taxes", "الضرائب")], ["commission", L("Commission", "العمولة")]], s, "fsub");
      mount.innerHTML = top + (s === "taxes" ? taxes() : commission());
    };
    const taxes = () => {
      const named = F.taxes.filter((x) => x.rows.length || true);
      if (!named.length) return card(L("Taxes", "الضرائب"), "", `<p class="text-tertiary">${L("No taxes have been generated", "لم يتم إنشاء أي ضرائب")}</p>`);
      /* PACKAGES.FIN_TAX_SECTION_WITH_LEVEL: a title shared by two sections gets its level — "{title} ({level})" */
      const LEVEL = { country: L("Country", "الدولة"), state: L("State", "المنطقة"), city: L("City", "المدينة") };
      const counts = named.reduce((c, x) => ((c[x.title] = (c[x.title] || 0) + 1), c), {});
      const title = (x) => (!x.title ? LEVEL[x.level] || "" : counts[x.title] > 1 && LEVEL[x.level] ? `${x.title} (${LEVEL[x.level]})` : x.title);
      return named.map((sec) => card(esc(title(sec)), "", sec.rows.length ? SA.table({ rows: sec.rows, empty: [""], columns: [
        { head: ["Name", "الاسم"], cell: (r) => `<b>${esc(r.name)}</b>` },
        { head: ["Tax", "الضريبة"], cell: (r) => r.label },
        { head: ["Actions", "الإجراءات"], align: "end", cell: (r) => `<label class="switch" ${r.can_enable ? "" : `title="${L("Can't be enabled for this package", "لا يمكن تفعيلها لهذه الباقة")}"`}><input type="checkbox" data-tax="${sec.level}:${r.id}" ${r.enabled ? "checked" : ""} ${r.can_enable ? "" : "disabled"} aria-label="${esc(r.name)}"><span class="switch__track"></span></label>` },
      ] }) : `<p class="text-tertiary">${L("No taxes have been generated", "لم يتم إنشاء أي ضرائب")}</p>`)).join("");
    };
    const commission = () => card(L("Default commission", "العمولة الافتراضية"),
        SA.iconBtn("eye", L("View", "عرض"), 'data-cv="default"') + SA.iconBtn("clock", L("History", "السجل"), "data-chist") + SA.iconBtn("edit", L("Edit", "تعديل"), 'data-ce="default"'),
        (F.set ? "" : KP.notice("warning", "warn", L("Commission not set - no commission is taken on this package (0% + 0 fixed) until it is set.", "لم يتم تحديد العمولة - لا تُحتسب عمولة على هذه الباقة (0% + 0 ثابت) حتى يتم تحديدها.")))
        + ratesView(F.def.rates, cur) + (F.def.at || F.def.by ? `<p class="t-xs text-tertiary">${L(`Last updated by ${F.def.by || "---"} on ${F.def.at || "---"}`, `آخر تحديث بواسطة ${F.def.by || "---"} في ${F.def.at || "---"}`)}</p>` : ""))
      + card(L("Scheduled commissions", "العمولات المجدولة"), PP.btn(L("New", "جديد"), "plus", 'data-ce="new"', "secondary"),
        F.scheduled.length ? `<div class="data-table-scroll"><table class="data-table"><thead><tr><th style="width:40px"></th><th>${L("Name", "الاسم")}</th><th>${L("Period", "الفترة")}</th><th style="text-align:center">${L("Actions", "الإجراءات")}</th></tr></thead><tbody>${F.scheduled.map((s) => `<tr>
            <td>${SA.iconBtn(s._open ? "chevronDown" : "chevronRight", s._open ? L("Hide values", "إخفاء القيم") : L("Show values", "عرض القيم"), `data-cx="${s.id}"`)}</td><td><b>${esc(s.name)}</b></td><td dir="ltr" style="text-align:start">${s.starts_on} → ${s.ends_on}</td>
            <td style="text-align:center"><div class="row gap-1" style="justify-content:center">${SA.iconBtn("eye", L("View", "عرض"), `data-cv="${s.id}"`)}${SA.iconBtn("edit", L("Edit", "تعديل"), `data-ce="${s.id}"`)}${SA.iconBtn("trash", L("Delete", "حذف"), `data-cd="${s.id}" style="color:var(--color-danger)"`)}</div></td></tr>
            ${s._open ? `<tr><td colspan="4" style="background:var(--color-primary-subtle)">${ratesView(s.rates, cur)}</td></tr>` : ""}`).join("")}</tbody></table></div>`
          : `<p class="text-tertiary">${L("No scheduled commissions.", "لا توجد عمولات مجدولة.")}</p>`);
    let cur_sub = sub;
    const findS = (id) => F.scheduled.find((s) => String(s.id) === String(id));
    function editDialog(id) {
      const isDef = id === "default", s = isDef ? null : id === "new" ? { name: "", starts_on: "", ends_on: "", rates: rates(0) } : findS(id);
      const rs = (isDef ? F.def.rates : s.rates).map((r) => Object.assign({}, r));
      const title = isDef ? L("Edit default commission", "تعديل العمولة الافتراضية") : id === "new" ? L("New scheduled commission", "عمولة مجدولة جديدة") : L("Edit scheduled commission", "تعديل العمولة المجدولة");
      const groups = Object.keys(GRP).map((g) => `<div class="stack gap-3" style="padding:var(--space-3);border:var(--border-thin) solid var(--color-border);border-radius:var(--radius-md)"><b class="t-sm">${L(...GRP[g])}</b>
        ${rs.map((r, j) => (r.g !== g ? "" : `<div class="sa-formrow" style="grid-template-columns:140px 1fr 1fr;align-items:center"><span class="t-sm">${L(...PW[r.p])}</span>
          <div class="input-affix"><input class="input" type="number" min="0" max="100" step="0.01" data-r="${j}:percent" value="${r.percent}" placeholder="${L("Percentage", "النسبة")}"><span class="affix">%</span></div>
          <div class="input-affix"><input class="input" type="number" min="0" step="0.01" data-r="${j}:fixed" value="${r.fixed}" placeholder="${L("Fixed amount", "مبلغ ثابت")}"><span class="affix">${esc(cur)}</span></div></div>
          <span class="t-xs" style="color:var(--color-danger)" data-e="${j}"></span>`)).join("")}</div>`).join("");
      const el = SA.modal({ id: "kpComm", wide: true, title, body: `<div class="stack gap-4">
          ${isDef ? "" : `${SA.field(["Name", "الاسم"], `<input class="input" maxlength="255" data-n value="${esc(s.name)}">`, { req: 1 })}<span class="t-xs" style="color:var(--color-danger)" data-e="name"></span>
            <div class="grid grid-2">${SA.field(["Start date", "تاريخ البداية"], `<input class="input" type="date" ${id !== "new" && s.starts_on && s.starts_on < today() ? "" : `min="${today()}"`} data-sd value="${s.starts_on}">`, { req: 1 })}${SA.field(["End date", "تاريخ النهاية"], `<input class="input" type="date" data-ed value="${s.ends_on}">`, { req: 1 })}</div><span class="t-xs" style="color:var(--color-danger)" data-e="dates"></span>`}
          ${groups}<span class="t-xs" style="color:var(--color-danger)" data-e="all"></span></div>`,
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok>${L("Save changes", "حفظ التغييرات")}</button>` });
      el.querySelector("[data-ok]").onclick = () => {
        el.querySelectorAll("[data-e]").forEach((x) => (x.textContent = ""));
        let bad = false;
        el.querySelectorAll("[data-r]").forEach((inp) => {
          const [j, f] = inp.dataset.r.split(":"), v = inp.value === "" ? 0 : +inp.value;
          if (v < 0) { el.querySelector(`[data-e="${j}"]`).textContent = L("Must be 0 or more.", "يجب أن تكون القيمة 0 أو أكثر."); bad = true; }
          else if (f === "percent" && v > 100) { el.querySelector(`[data-e="${j}"]`).textContent = L("Can't be more than 100%.", "لا يمكن أن تتجاوز 100%."); bad = true; }
          rs[j][f] = v;
        });
        let n, sd, ed;
        if (!isDef) {
          n = el.querySelector("[data-n]").value.trim(); sd = el.querySelector("[data-sd]").value; ed = el.querySelector("[data-ed]").value;
          const de = el.querySelector('[data-e="dates"]');
          if (!n) { el.querySelector('[data-e="name"]').textContent = L("This field is required.", "هذا الحقل مطلوب."); bad = true; }
          if (!sd || !ed) { de.textContent = L("This field is required.", "هذا الحقل مطلوب."); bad = true; }
          else if (sd < today() && !(id !== "new" && sd === s.starts_on)) { /* an edited one may keep its unchanged past start */ de.textContent = L("The start date can't be in the past.", "لا يمكن أن يكون تاريخ البداية في الماضي."); bad = true; }
          else if (ed < sd) { de.textContent = L("The end date must be on or after the start date.", "يجب أن يكون تاريخ النهاية في يوم البداية أو بعده."); bad = true; }
          else { const o = F.scheduled.find((x) => x !== s && x.starts_on <= ed && sd <= x.ends_on); if (o) { de.textContent = L(`This period overlaps with "${o.name}".`, `هذه الفترة تتداخل مع "${o.name}".`); bad = true; } }
          if (!rs.some((r) => r.percent > 0 || r.fixed > 0)) { el.querySelector('[data-e="all"]').textContent = L("Enter a percentage or a fixed amount greater than 0.", "أدخل نسبة أو مبلغاً ثابتاً أكبر من 0."); bad = true; }
        }
        if (bad) return;
        if (isDef) { F.def = { rates: rs, by: "Super Admin", at: "15 Nov 2026 12:00" }; F.set = true; }
        else if (id === "new") F.scheduled.push({ id: Date.now(), name: n, starts_on: sd, ends_on: ed, rates: rs });
        else Object.assign(s, { name: n, starts_on: sd, ends_on: ed, rates: rs });
        SA.close(el); RD.toast("success", L("Commission saved", "تم حفظ العمولة")); paint(cur_sub);
      };
    }
    mount.addEventListener("click", (e) => {
      const t = e.target.closest("[data-fsub]"); if (t) { cur_sub = t.dataset.fsub; history.replaceState(null, "", KP.href("financial", { sub: cur_sub })); return paint(cur_sub); }
      const cx = e.target.closest("[data-cx]"); if (cx) { const s = findS(cx.dataset.cx); s._open = !s._open; return paint(cur_sub); }
      const cv = e.target.closest("[data-cv]");
      if (cv) { const s = cv.dataset.cv === "default" ? null : findS(cv.dataset.cv); return SA.modal({ id: "kpCommV", wide: true, title: s ? esc(s.name) : L("Default commission", "العمولة الافتراضية"), body: (s ? kv([[L("Start date", "تاريخ البداية"), s.starts_on], [L("End date", "تاريخ النهاية"), s.ends_on]]) : "") + ratesView(s ? s.rates : F.def.rates, cur), foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button>` }); }
      if (e.target.closest("[data-chist]")) {
        const fld = (c) => `${L(...GRP[c[0]])} · ${L(...PW[c[1]])} · ${c[2] === "percent" ? L("Percentage", "النسبة") : L("Fixed amount", "مبلغ ثابت")}`;
        return SA.modal({ id: "kpCommH", wide: true, title: L("History", "السجل"), body: F.history.length ? `<div class="stack gap-3">${F.history.map((h) => `<div class="stack gap-2" style="padding:var(--space-3);border:var(--border-thin) dashed var(--color-border);border-radius:var(--radius-md)">
            <div class="row between"><b>${esc(h.who)}</b><span class="t-xs text-tertiary">${h.when}</span></div>${h.note ? `<span class="t-sm text-secondary">${esc(h.note)}</span>` : ""}
            ${h.changes.map((c) => `<div class="t-sm">${fld(c)}: <s class="text-tertiary">${c[3]}</s> ${document.documentElement.dir === "rtl" ? "←" : "→"} <b>${c[4]}</b></div>`).join("")}</div>`).join("")}</div>` : `<p class="text-tertiary">${L("No changes yet.", "لا توجد تغييرات بعد.")}</p>`,
          foot: `<button class="btn btn--ghost" data-close>${L("Close", "إغلاق")}</button>` });
      }
      const ce = e.target.closest("[data-ce]"); if (ce) return editDialog(ce.dataset.ce);
      const cd = e.target.closest("[data-cd]");
      if (cd) {
        const s = findS(cd.dataset.cd);
        const el = SA.modal({ id: "kpCommD", title: L("Delete scheduled commission?", "حذف العمولة المجدولة؟"), body: `<p class="t-sm text-secondary">${L(`"${esc(s.name)}" will be deleted. This cannot be undone.`, `سيتم حذف "${esc(s.name)}". لا يمكن التراجع عن ذلك.`)}</p>`,
          foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn btn--danger" data-ok>${L("Delete", "حذف")}</button>` });
        el.querySelector("[data-ok]").onclick = () => { F.scheduled = F.scheduled.filter((x) => x !== s); SA.close(el); RD.toast("success", L("Scheduled commission deleted", "تم حذف العمولة المجدولة")); paint(cur_sub); };
      }
    });
    mount.addEventListener("change", (e) => {
      const t = e.target.dataset.tax; if (!t) return;
      const [lv, id] = t.split(":"), r = F.taxes.find((x) => x.level === lv).rows.find((x) => String(x.id) === id);
      r.enabled = e.target.checked;
      RD.toast("success", L(`Taxes updated for ${k.name}`, `تم تحديث الضرائب لـ ${k.name}`));
    });
    paint(sub);
  };

  /* ================= QR management ================= */
  const UNIT = { minute: ["minute", "minutes", "دقيقة", "دقائق"], hour: ["hour", "hours", "ساعة", "ساعات"], day: ["day", "days", "يوم", "أيام"] };
  const dur = (n, u) => (u === "day" && n === 1 ? L("1 day", "يوم واحد") : L(`${n} ${n === 1 ? UNIT[u][0] : UNIT[u][1]}`, `${n} ${n > 2 && n <= 10 ? UNIT[u][3] : UNIT[u][2]}`));
  const SCAN = [["perform_qr", L("Perform QR", "تنفيذ QR"), L("Scan subscribers in at the door.", "تسجيل دخول المشتركين بالمسح عند الباب.")], ["perform_reversal", L("Perform reversal", "تنفيذ الإلغاء"), L("Reverse a check-in inside the reversal period.", "إلغاء تسجيل دخول خلال فترة الإلغاء.")], ["validate_qr", L("Validate QR", "التحقق من QR"), L("Check a code without checking the subscriber in.", "فحص الرمز دون تسجيل دخول المشترك.")]];
  KP.qr = function (k) {
    if (k._qr) return k._qr;
    const i = k.id % 7;
    k._qr = {
      settings: { check_in_mode: i % 2 ? "immediate" : "confirmation", before: [15, "minute"], after: i % 3 ? [1, "hour"] : null, reversal: i % 4 === 3 ? null : [1, "day"], dup: i % 2 ? [2, 30] : null },
      updated_by: k.partner.name, updated_at: "Nov 8, 2026 11:58 PM", reversal_note: L("Check-ins on this package can't be reversed.", "لا يمكن إلغاء تسجيلات الدخول لهذه الباقة."),
      employees: [{ id: 1, name: "Sami Fouad", email: "sami@partner.co", perms: ["perform_qr", "validate_qr"] }, { id: 2, name: "Hala Nour", email: "hala@partner.co", perms: ["perform_qr", "perform_reversal"] }].slice(0, 1 + (i % 2)),
      pool: [{ id: 1, name: "Sami Fouad" }, { id: 2, name: "Hala Nour" }, { id: 3, name: "Rami Aziz" }, { id: 4, name: "Lina Saad" }],
    };
    return k._qr;
  };
  KP.tabs.qr_management = (mount, ctx) => {
    const k = ctx.pkg, Q = KP.qr(k);
    let sub = ctx.params.get("sub") === "employees" ? "employees" : "barcode", editing = null;
    const ROWS = [["before", L("Check-in before access schedule", "تسجيل الدخول قبل جدول الدخول"), L("How early a subscriber can check in before their access time starts.", "المدة التي يمكن للمشترك فيها تسجيل الدخول قبل بدء وقت دخوله.")],
      ["after", L("Check-in after access schedule", "تسجيل الدخول بعد جدول الدخول"), L("How late a subscriber can still check in after their access time ends.", "المدة التي يظل فيها بإمكان المشترك تسجيل الدخول بعد انتهاء وقت دخوله.")],
      ["reversal", L("Reversal period", "فترة الإلغاء"), L("How long after a check-in it can still be reversed.", "المدة التي يمكن خلالها إلغاء تسجيل الدخول.")],
      ["dup", L("Prevent duplicate scans", "منع المسح المكرر"), L("The same code can't be scanned again within this window.", "لا يمكن مسح الرمز نفسه مرة أخرى خلال هذه المدة.")]];
    const off = badge("", L("Off", "متوقف"));
    const MODES = { confirmation: [L("Confirmation required", "يتطلب تأكيدًا"), L("The employee or partner must confirm after scanning.", "يجب على الموظف أو الشريك التأكيد بعد المسح.")], immediate: [L("Check in immediately", "تسجيل الحضور فورًا"), L("Member is checked in instantly on scan.", "يُسجل حضور العضو فور المسح.")] };
    const sw = (key, on) => `<label class="switch"><input type="checkbox" data-sw="${key}" ${on ? "checked" : ""} aria-label="${key}"><span class="switch__track"></span></label>`;
    const val = (key, s, ed) => {
      const v = s[key];
      /* the duplicate window leaves out a zero part ("30 minutes", not "0 hours 30 minutes") */
      if (!ed) return key === "dup" ? (v ? [v[0] > 0 ? dur(v[0], "hour") : "", v[1] > 0 ? dur(v[1], "minute") : ""].filter(Boolean).join(" ") : off) : v ? dur(v[0], v[1]) : off;
      if (key === "dup") return `<div class="row gap-2" style="align-items:center;flex-wrap:wrap">${sw(key, v)}${v ? `<input class="input" type="number" min="0" max="23" style="width:80px" data-dh value="${v[0]}"> ${L("Hours", "ساعات")} <input class="input" type="number" min="0" max="59" style="width:80px" data-dm value="${v[1]}"> ${L("Minutes", "دقائق")}` : ""}</div>`;
      return `<div class="row gap-2" style="align-items:center;flex-wrap:wrap">${sw(key, v)}${v ? `<input class="input" type="number" min="1" style="width:90px" data-n="${key}" value="${v[0]}">${SA.select([["minute", L("Minutes", "دقائق"), v[1] === "minute"], ["hour", L("Hours", "ساعات"), v[1] === "hour"], ["day", L("Days", "أيام"), v[1] === "day"]], `data-u="${key}"`)}` : ""}</div>`;
    };
    const barcode = () => {
      const s = editing || Q.settings, ed = !!editing;
      const dirty = ed && JSON.stringify(editing) !== JSON.stringify(Q.settings);
      return card(L("Barcode settings", "إعدادات الباركود"), ed ? `<button class="btn btn--sm btn--ghost" data-qcancel>${L("Cancel", "إلغاء")}</button><button class="btn btn--sm" data-qsave ${dirty ? "" : "disabled"}>${L("Save changes", "حفظ التغييرات")}</button>` : PP.btn(L("Edit", "تعديل"), "edit", "data-qedit", "secondary"),
        `<div class="stack">${ROWS.map(([key, t, h]) => `<div class="row between gap-4" style="padding-block:var(--space-3);border-bottom:var(--border-thin) dashed var(--color-border);flex-wrap:wrap;align-items:center">
            <div class="stack gap-1" style="flex:1;min-width:220px"><b class="t-sm">${t}</b><span class="t-xs text-tertiary">${h}</span>${key === "reversal" && !s.reversal ? `<span class="t-xs" style="color:var(--color-warning)">${esc(Q.reversal_note)}</span>` : ""}<span class="t-xs" style="color:var(--color-danger)" data-qe="${key}"></span></div>
            <div style="font-weight:var(--weight-semibold)">${val(key, s, ed)}</div></div>`).join("")}
          <div class="stack gap-2" style="padding-block:var(--space-3)"><b class="t-sm">${L("Check-in mode", "طريقة تسجيل الحضور")}</b>${ed
            ? Object.keys(MODES).map((m) => `<label class="check check--radio"><input type="radio" name="kpMode" value="${m}" ${s.check_in_mode === m ? "checked" : ""}><span class="check__box"><span class="check__dot"></span></span><span><b class="t-sm">${MODES[m][0]}</b><span class="t-xs text-tertiary" style="display:block">${MODES[m][1]}</span></span></label>`).join("")
            : `<span>${MODES[s.check_in_mode][0]}</span><span class="t-xs text-tertiary">${MODES[s.check_in_mode][1]}</span>`}</div></div>
         <p class="t-xs text-tertiary">${L(`Last updated by ${esc(Q.updated_by)} · ${Q.updated_at}`, `آخر تحديث بواسطة ${esc(Q.updated_by)} · ${Q.updated_at}`)}</p>`);
    };
    const label = (p) => (SCAN.find((x) => x[0] === p) || [p, p])[1];
    const employees = () => card(L("Employees", "الموظفون"), PP.btn(L("Assign employee", "تعيين موظف"), "plus", "data-qassign", "secondary"),
      Q.employees.length ? `<div class="stack">${Q.employees.map((e) => `<div class="row between gap-3" style="padding-block:var(--space-3);border-bottom:var(--border-thin) dashed var(--color-border);align-items:center;flex-wrap:wrap">
          <div class="cell-user">${PP.avatar(e.name)}<div><b>${esc(e.name)}</b><div class="t-xs text-tertiary">${esc(e.email)}</div></div></div>
          <div class="row gap-1" style="flex-wrap:wrap">${e.perms.length ? e.perms.map((p) => badge("", label(p))).join("") : "—"}</div>
          <div class="row gap-1">${SA.iconBtn("edit", L("Edit permissions", "تعديل الصلاحيات"), `data-qemp="${e.id}"`)}${SA.iconBtn("trash", L("Remove", "إزالة"), `data-qrm="${e.id}"`)}</div></div>`).join("")}</div>`
        : `<div class="stack gap-3" style="align-items:center;padding:var(--space-8)"><p class="text-tertiary">${L("No employees assigned to this package.", "لا يوجد موظفون معيّنون لهذه الباقة.")}</p>${PP.btn(L("Assign employee", "تعيين موظف"), "plus", "data-qassign", "secondary")}</div>`);
    const paint = () => (mount.innerHTML = KP.notice("info", "info", L("These settings apply to this package only.", "تنطبق هذه الإعدادات على هذه الباقة فقط.")) + subTabs([["barcode", L("Barcode settings", "إعدادات الباركود")], ["employees", L("Employees", "الموظفون")]], sub, "qsub") + (sub === "barcode" ? barcode() : employees()));
    const readEdit = () => {
      ["before", "after", "reversal"].forEach((key) => { const n = mount.querySelector(`[data-n="${key}"]`); if (n && editing[key]) editing[key] = [n.value === "" ? "" : +n.value, mount.querySelector(`[data-u="${key}"]`) ? mount.querySelector(`[data-u="${key}"]`).value : editing[key][1]]; });
      const dh = mount.querySelector("[data-dh]"); if (dh && editing.dup) editing.dup = [+dh.value, +mount.querySelector("[data-dm]").value];
      const m = mount.querySelector("[name=kpMode]:checked"); if (m) editing.check_in_mode = m.value;
    };
    function empModal(e) {
      const assigned = Q.employees.map((x) => x.id), free = Q.pool.filter((p) => !assigned.includes(p.id));
      const perms = e ? e.perms.slice() : [];
      const el = SA.modal({ id: "kpQEmp", title: e ? L("Edit permissions", "تعديل الصلاحيات") : L("Assign employee", "تعيين موظف"), body: `<div class="stack gap-4">
          ${SA.field(["Employee", "الموظف"], e ? `<b>${esc(e.name)}</b>` : free.length ? SA.select([["", L("Choose an employee.", "اختر موظفاً.")]].concat(free.map((p) => [p.id, p.name])), "data-pick") : `<p class="t-sm text-tertiary">${L("Every employee is already assigned.", "تم تعيين جميع الموظفين بالفعل.")}</p>`)}
          <span class="t-xs" style="color:var(--color-danger)" data-ee></span>
          ${SA.field(["Permissions", "الصلاحيات"], `<div class="stack gap-2">${SCAN.map((s) => `<label class="check"><input type="checkbox" value="${s[0]}" ${perms.includes(s[0]) ? "checked" : ""}><span class="check__box">${ic("check")}</span><span><b class="t-sm">${s[1]}</b><span class="t-xs text-tertiary" style="display:block">${s[2]}</span></span></label>`).join("")}</div>`)}
          <span class="t-xs" style="color:var(--color-danger)" data-ep></span></div>`,
        /* Assign is disabled when every employee is already assigned (dashboard: !editing && pickable.length === 0) */
        foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn" data-ok ${!e && !free.length ? "disabled" : ""}>${e ? L("Save changes", "حفظ التغييرات") : L("Assign", "تعيين")}</button>` });
      el.querySelector("[data-ok]").onclick = () => {
        const pick = el.querySelector("[data-pick]"), ps = [...el.querySelectorAll(".check input:checked")].map((x) => x.value);
        el.querySelector("[data-ee]").textContent = !e && (!pick || !pick.value) ? L("Choose an employee.", "اختر موظفاً.") : "";
        el.querySelector("[data-ep]").textContent = ps.length ? "" : L("Choose at least one permission.", "اختر صلاحية واحدة على الأقل.");
        if ((!e && (!pick || !pick.value)) || !ps.length) return;
        if (e) e.perms = ps; else { const p = Q.pool.find((x) => String(x.id) === pick.value); Q.employees.push({ id: p.id, name: p.name, email: p.name.split(" ")[0].toLowerCase() + "@partner.co", perms: ps }); }
        SA.close(el); RD.toast("success", e ? L("Permissions updated", "تم تحديث الصلاحيات") : L("Employee assigned", "تم تعيين الموظف")); paint();
      };
    }
    mount.addEventListener("click", (e) => {
      const t = e.target.closest("[data-qsub]"); if (t) { sub = t.dataset.qsub; editing = null; history.replaceState(null, "", KP.href("qr_management", { sub })); return paint(); }
      if (e.target.closest("[data-qedit]")) { editing = JSON.parse(JSON.stringify(Q.settings)); return paint(); }
      if (e.target.closest("[data-qcancel]")) { editing = null; return paint(); }
      if (e.target.closest("[data-qsave]")) {
        readEdit();
        let bad = false;
        mount.querySelectorAll("[data-qe]").forEach((x) => (x.textContent = ""));
        ["before", "after", "reversal"].forEach((key) => { const v = editing[key]; if (!v) return; const max = 365; const err = !Number.isInteger(v[0]) || v[0] < 1 ? L("Enter a whole number of 1 or more.", "أدخل عدداً صحيحاً يساوي 1 أو أكثر.") : v[0] > max ? (() => { const lbl = ROWS.find((r) => r[0] === key)[1]; return L(`${lbl} must be ${max} or less.`, `يجب أن تكون قيمة ${lbl} مساوية لـ ${max} أو أصغر.`); })() : ""; /* PACKAGES.QR_ERR_MAX */ if (err) { mount.querySelector(`[data-qe="${key}"]`).textContent = err; bad = true; } });
        if (editing.dup) { const [h, m] = editing.dup; const err = !(Number.isInteger(h) && Number.isInteger(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59) ? L("Hours must be 0-23 and minutes 0-59 (whole numbers).", "يجب أن تكون الساعات بين 0 و23 والدقائق بين 0 و59 (أعداد صحيحة).") : h === 0 && m === 0 ? L("Set a window longer than 0 minutes, or turn it off.", "حدد مدة أطول من 0 دقيقة، أو أوقف الخيار.") : ""; if (err) { mount.querySelector('[data-qe="dup"]').textContent = err; bad = true; } }
        if (bad) return;
        Q.settings = editing; editing = null; Q.updated_by = "Super Admin"; Q.updated_at = "Nov 15, 2026 12:00 PM";
        /* the dashboard reuses the Financial toast here (PACKAGES.FIN_SAVED_TOAST) — kept 1:1 */
        RD.toast("success", L("Financial settings saved", "تم حفظ الإعدادات المالية")); return paint();
      }
      if (e.target.closest("[data-qassign]")) return empModal(null);
      const ee = e.target.closest("[data-qemp]"); if (ee) return empModal(Q.employees.find((x) => x.id === +ee.dataset.qemp));
      const rm = e.target.closest("[data-qrm]");
      if (rm) {
        const emp = Q.employees.find((x) => x.id === +rm.dataset.qrm);
        const el = SA.modal({ id: "kpQRm", title: L("Remove employee?", "إزالة الموظف؟"), body: `<p class="t-sm text-secondary">${L(`${esc(emp.name)} will no longer be able to scan this package's QR codes.`, `لن يتمكن ${esc(emp.name)} من مسح رموز QR لهذه الباقة بعد الآن.`)}</p>`,
          foot: `<button class="btn btn--ghost" data-close>${L("Cancel", "إلغاء")}</button><button class="btn btn--danger" data-ok>${L("Remove", "إزالة")}</button>` });
        el.querySelector("[data-ok]").onclick = () => { Q.employees = Q.employees.filter((x) => x !== emp); SA.close(el); RD.toast("success", L("Employee removed", "تمت إزالة الموظف")); paint(); };
      }
    });
    mount.addEventListener("change", (e) => {
      if (!editing) return;
      readEdit();
      const s = e.target.dataset.sw;
      if (s) editing[s] = e.target.checked ? (s === "dup" ? [1, 0] : [s === "reversal" ? 1 : 15, s === "reversal" ? "day" : "minute"]) : null;
      paint();
    });
    paint();
  };

  /* ================= policy (read-only) ================= */
  KP.policy = function (k) {
    if (k.policyD) return k.policyD;
    const i = k.id % 7, online = k.selling_methodology.value !== "walk_in";
    k.policyD = !online ? { state: "not_online" } : i % 5 === 4 ? { state: "missing" } : { state: "linked", policy: { name: L("Standard membership policy", "سياسة العضوية القياسية"), subtitle: L("Applies to purchases made in the HighFive app.", "تنطبق على المشتريات عبر تطبيق HighFive."),
      rows: [["visibility", "eye", L("Visibility", "الظهور"), L("Shown to customers before they pay.", "تظهر للعملاء قبل الدفع.")], ["cancellation", "close", L("Cancellation", "الإلغاء"), L("Free cancellation within 24 hours of purchase.", "إلغاء مجاني خلال 24 ساعة من الشراء.")], ["refunds", "revenue", L("Refunds", "الاسترداد"), L("Full refund before the first check-in.", "استرداد كامل قبل أول تسجيل دخول.")], ["freeze", "clock", L("Freeze", "التجميد"), L("Up to 14 days per subscription.", "حتى 14 يوماً لكل اشتراك.")], ["upgrade", "trendUp", L("Upgrade", "الترقية"), L("Pay the difference to move to a longer plan.", "ادفع الفرق للانتقال إلى خطة أطول.")], ["expiration", "calendar", L("Expiration", "الانتهاء"), ""]],
      note: L("The partner can change this policy; changes apply to new purchases only.", "يمكن للشريك تغيير هذه السياسة؛ وتنطبق التغييرات على المشتريات الجديدة فقط.") } };
    return k.policyD;
  };
  KP.tabs.policy = (mount, ctx) => {
    const P = KP.policy(ctx.pkg);
    if (P.state === "not_online") { mount.innerHTML = KP.notice("warning", "warn", L("This package isn't sold online, so no cancellation or refund policy applies.", "هذه الباقة لا تُباع عبر الإنترنت، لذلك لا تنطبق عليها سياسة إلغاء أو استرداد.")); return; }
    if (P.state === "missing") { mount.innerHTML = KP.empty("list", L("No policy linked", "لا توجد سياسة مرتبطة"), L("The partner hasn't linked a policy to this package.", "لم يربط الشريك سياسة بهذه الباقة.")); return; }
    const p = P.policy;
    mount.innerHTML = card(esc(p.name), "", `<p class="t-sm text-tertiary">${esc(p.subtitle)}</p>
      <div class="stack gap-4">${p.rows.map((r) => `<div class="row gap-3" style="align-items:flex-start"><span class="cell-thumb" style="width:40px;height:40px;background:var(--color-primary-subtle);color:var(--color-primary-ink)">${ic(r[1])}</span><div class="stack gap-1"><b class="t-sm">${r[2]}</b><span class="t-sm text-secondary">${r[3] || "—"}</span></div></div>`).join("")}</div>
      ${p.note ? `<div style="padding:var(--space-3);border:var(--border-thin) dashed var(--color-border);border-radius:var(--radius-md);background:var(--color-surface-sunken)" class="t-sm text-secondary">${esc(p.note)}</div>` : ""}`);
  };

  /* ================= activity log ================= */
  const CAT = { approval: ["Approval", "الاعتماد"], edits: ["Edits", "التعديلات"], status: ["Status", "الحالة"], comments: ["Comments", "التعليقات"], renewal: ["Renewal", "التجديد"] };
  const EVT = { commission_changed: ["Commission changed", "تم تغيير العمولة"], qr_settings_changed: ["QR settings changed", "تم تغيير إعدادات QR"], qr_employee_changed: ["QR employee changed", "تم تغيير موظف QR"], comment_deleted: ["Comment deleted", "تم حذف التعليق"], comment_restored: ["Comment restored", "تمت استعادة التعليق"], deletion_request_approved: ["Deletion request approved", "تم قبول طلب الحذف"], deletion_request_declined: ["Deletion request declined", "تم رفض طلب الحذف"] };
  KP.tabs.activity_log = (mount, ctx) => {
    const k = ctx.pkg;
    let log = ctx.params.get("log") === "partner" ? "partner" : "super_admin", f = {};
    const SA_ITEMS = [["approval", "positive", L("Super Admin approved the package", "وافق المشرف العام على الباقة"), "", "Nov 8, 2026", "11:58 PM", "deletion_request_approved"], ["status", "negative", L("Super Admin deactivated the package", "أوقف المشرف العام الباقة"), L("Partner asked to pause sales", "طلب الشريك إيقاف المبيعات"), "Nov 6, 2026", "10:12 AM", "commission_changed"],
      ["edits", "", L("Commission changed", "تم تغيير العمولة"), L("Online · 12%", "إلكتروني · 12%"), "Nov 5, 2026", "09:40 AM", "commission_changed"], ["edits", "", L("QR settings changed", "تم تغيير إعدادات QR"), "", "Nov 4, 2026", "03:22 PM", "qr_settings_changed"], ["comments", "negative", L("Comment deleted", "تم حذف التعليق"), L("Offensive language", "لغة مسيئة"), "Nov 2, 2026", "06:05 PM", "comment_deleted"]]
      .map((x, j) => ({ id: j, category: x[0], tone: x[1], text: x[2], note: x[3], date: x[4], time: x[5], type: x[6], actor: { type: "super_admin", name: j % 2 ? "Mona Admin" : "Super Admin" }, ref: x[0] === "comments" ? "SUB-000031" : "" }));
    const PA_ITEMS = [["edits", "", L("The partner edited the plans", "عدّل الشريك الخطط"), L("Monthly price 450 → 480", "سعر الشهري 450 ← 480"), "Nov 7, 2026", "01:15 PM"], ["renewal", "positive", L("The partner turned on manual renew", "فعّل الشريك التجديد اليدوي"), "", "Nov 3, 2026", "11:00 AM"], ["approval", "", L("The partner submitted the package for review", "أرسل الشريك الباقة للمراجعة"), "", "Oct 30, 2026", "08:30 AM"]]
      .map((x, j) => ({ id: 100 + j, category: x[0], tone: x[1], text: x[2], note: x[3], date: x[4], time: x[5], type: "", actor: { type: "partner", name: k.partner.name }, ref: "" }));
    const paint = () => {
      const items = (log === "super_admin" ? SA_ITEMS : PA_ITEMS).filter((x) => (!f.type || x.type === f.type) && (!f.user || x.actor.name === f.user));
      const n = ["type", "user", "date_from"].filter((x) => f[x] || (x === "date_from" && f.date_to)).length;
      mount.innerHTML = `<section class="data-table-wrap animate-in"><div class="data-table-toolbar" style="flex-wrap:wrap;gap:var(--space-3)">
          <div class="segmented">${[["super_admin", "shield", L("Super Admin log", "سجل المشرف العام")], ["partner", "users", L("Partner log", "سجل الشريك")]].map((t) => `<button type="button" data-log="${t[0]}" class="${t[0] === log ? "is-active" : ""}">${ic(t[1])} ${t[2]}</button>`).join("")}</div>
          <span class="grow"></span>${PP.filterBtn(n)}</div>
        ${SA.table({ rows: items, empty: ["There is no data to display", "لا توجد بيانات لعرضها"], columns: [
          { head: ["When", "الوقت"], cell: (r) => `${r.date}<div class="t-xs text-tertiary">${r.time}</div>` },
          { head: ["Event", "الحدث"], cell: (r) => `${badge(r.tone === "positive" ? "success" : r.tone === "negative" ? "danger" : "", L(...CAT[r.category]))}<div class="t-sm" style="margin-top:4px">${esc(r.actor.type === "super_admin" ? r.text.replace(/Super Admin|المشرف العام/, r.actor.name) : r.text)}</div>` },
          { head: ["By", "بواسطة"], cell: (r) => `<b>${esc(r.actor.name)}</b><div class="t-xs text-tertiary">${r.actor.type === "partner" ? L("Partner", "الشريك") : "HighFive"}</div>` },
          { head: ["Details", "التفاصيل"], cell: (r) => `${r.note ? esc(r.note) : "—"}${r.ref ? `<div class="t-xs text-tertiary">${r.ref}</div>` : ""}` },
        ] })}${SA.pager({ page: 1, limit: 20, total: items.length, sizes: [20, 50, 100] })}</section>`;
    };
    mount.addEventListener("click", (e) => {
      const t = e.target.closest("[data-log]"); if (t) { log = t.dataset.log; f = { date_from: f.date_from, date_to: f.date_to }; history.replaceState(null, "", KP.href("activity_log", { log })); return paint(); }
      const b = e.target.closest("[data-filter]");
      /* the date range error sits under the fields and disables Apply (PACKAGES.DISPLAY_ERR_END_AFTER_START) */
      if (b) KP.filterPop(b, { width: 300, value: f, validate: (d) => (d.date_from && d.date_to && d.date_to < d.date_from ? L("The end date must be after the start date.", "يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء.") : ""), fields: [
        { key: "type", label: ["Event type :", "نوع الحدث :"], options: () => Object.keys(EVT).map((x) => [x, L(...EVT[x])]) },
        { key: "user", label: ["User :", "المستخدم :"], options: () => [...new Set((log === "super_admin" ? SA_ITEMS : PA_ITEMS).map((x) => x.actor.name))].map((x) => [x, x]) },
        { key: "date", label: ["Date range :", "الفترة الزمنية :"], type: "range" },
      ], onApply: (d) => { f = d; paint(); } });
    });
    paint();
  };
})();
