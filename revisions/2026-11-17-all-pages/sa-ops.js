/* Operations sample data (Public events · Joining list · Bookings · Multi-booking ·
   All comments). Every record is taken from the partners' own sessions
   (PP.ops in pp-ops.js), so the global lists, the partner/unit/user profiles
   and the views all show the same rows. */
(function () {
  "use strict";
  const OPS = (window.OPS = window.OPS || {});
  let cache = null;
  OPS.all = function () {
    if (cache) return cache;
    const events = [], bookings = [], multi = [];
    HF.SA.partners.forEach((p) => {
      PP.extend(p);
      const o = PP.ops(p);
      o.events.forEach((e, i) => {
        e.company_name = p.company_name; e._partner = p.id;
        e.app_type = p.is_independent && i % 3 === 0 ? ["highFive", "partner"] : ["highFive"];
        e.check_in_summary = e.status !== "ended" ? { checked_in: 0, total: e.joined_players } : { checked_in: Math.max(0, e.joined_players - (i % 3)), total: e.joined_players };
        events.push(e);
      });
      const cur = { code: p.country.iso === "EG" ? "EGP" : p.country.iso === "AE" ? "AED" : "SAR" };
      o.bookings.forEach((b, i) => {
        Object.assign(b, { company_name: p.company_name, _partner: p.id, currency: cur, is_flexible_slot: b.booking_type === "online" && i % 5 === 2,
          check_in_at: b.status === "ended" && i % 4 !== 3 ? `${b.date} ${b.start_time}` : null });
        bookings.push(b);
      });
      o.multi.forEach((m, i) => {
        Object.assign(m, { _partner: p.id, app_type: p.is_independent && i % 2 ? ["highFive", "partner"] : ["highFive"], max_tickets_per_user: 4, session_type: "normal", overnight: false,
          check_in_summary: m.status !== "ended" ? { checked_in: 0, total: m.booked_tickets } : { checked_in: Math.max(0, m.booked_tickets - 2), total: m.booked_tickets } });
        multi.push(m);
      });
    });
    const byNew = (a, b) => b.created_at.localeCompare(a.created_at);
    events.sort(byNew); bookings.sort(byNew); multi.sort(byNew);

    /* joining list = one row per player joining an event (GET /joining-list) */
    const users = HF.SA.users, joins = [];
    events.forEach((e, i) => {
      const p = HF.SA.partners.find((x) => x.id === e._partner);
      for (let k = 0; k < Math.min(e.joined_players, 3); k++) {
        const u = users[(i * 3 + k) % users.length], st = (i + k) % 7 === 5 ? "left" : (i + k) % 11 === 9 ? "removed" : "joined";
        const checked = e.status === "ended" && st === "joined" && k !== 2;
        joins.push({ id: 30000 + i * 10 + k, created_at: e.created_at, company: { id: p.id, name: p.company_name }, branch: { name: (p.branches[0] || {}).name || "Main Branch" }, unit: { name: e.unit_name },
          category: e.activity_category_name, activity: e.activity_name, start_at: `${e.date} ${e.start_time}`, end_at: `${e.date} ${e.end_time}`, age_group: e.age_group_name, gender: e.session_gender,
          user: { id: u.id, name: u.name, username: u.high_five_user_name }, status: st, status_date: e.date, joined_at: e.created_at.slice(0, 10),
          check_in_at: checked ? `${e.date} ${e.start_time}` : null, checked_by: checked ? "Ahmed Saeed" : null, method: checked ? (k ? "manual" : "qr") : null,
          public_event: { id: e.id, created_at: e.created_at, status: e.status === "ended" ? "past" : e.status }, price_per_user: e.price_per_user, currency: { code: p.country.iso === "EG" ? "EGP" : p.country.iso === "AE" ? "AED" : "SAR" }, _partner: p.id });
      }
    });
    cache = { events, bookings, multi, joins };
    return cache;
  };
  OPS.partnerOf = (row) => HF.SA.partners.find((p) => p.id === row._partner);

  /* bookings inside one multi-booking session (GET /multi-booking/{id} → bookers[]).
     Booking ids are session id × 10 + n, so /multi-booking/details/{bookingId} can find its session. */
  OPS.bookers = function (m) {
    if (m._bookers) return m._bookers;
    const users = HF.SA.users, out = [];
    let left = m.booked_tickets, k = 0;
    while (left > 0 && k < 9) {
      const u = users[(m.id + k * 5) % users.length], t = Math.min(left, 1 + ((m.id + k) % m.max_tickets_per_user));
      left -= t;
      const st = m.status === "canceled" ? "cancelled" : m.status === "ended" ? "ended" : k === 2 ? "pending" : "booked";
      out.push({ id: m.id * 10 + k, user: u, tickets: t, booking_time: `${String(9 + k).padStart(2, "0")}:15`, booking_date: m.created_at.slice(0, 10), total: +(t * +m.price_per_user * 1.15).toFixed(2), status: st, is_time_edited: k === 1,
        tickets_list: Array.from({ length: t }, (_, j) => ({ id: m.id * 100 + k * 10 + j, ticket_number: `T-${m.id}-${k + 1}${j + 1}`, holder_name: j ? `${u.name.split(" ")[0]} +${j}` : u.name,
          check_in_at: m.status === "ended" && j < t - (k % 2) ? `${m.date} ${m.start_time}` : null, checked_by: "Ahmed Saeed", checked_in_type: j % 2 ? "manual" : "qr" })) });
      k++;
    }
    m._bookers = out;
    return out;
  };
  /* the session a booking id belongs to */
  OPS.bookingInMulti = function (bookingId) {
    const D = OPS.all(), m = D.multi.find((x) => x.id === Math.floor(+bookingId / 10)) || D.multi[0];
    const b = OPS.bookers(m).find((x) => String(x.id) === String(bookingId)) || OPS.bookers(m)[0];
    return { m, b };
  };

  /* shared session Filter Options (dashboard FilterDropdown.js — one per list, same fields) */
  OPS.catFields = () => [
    { key: "category", label: ["category :", "الفئة :"], placeholder: ["select category", "اختر الفئة"], options: () => HF.SA.CATS.map((c) => [c.name, c.name]) },
    { key: "activity", label: ["Activity :", "النشاط :"], placeholder: ["select activity", "اختر النشاط"], options: (d) => (d.category ? HF.SA.ACTS[(HF.SA.CATS.find((c) => c.name === d.category) || {}).id] || [] : []).map((a) => [a, a]) },
  ];
  OPS.genderField = () => ({ key: "gender", label: ["session gender :", "جنس الجلسة :"], placeholder: ["select session Gender", "اختر جنس الجلسة"], options: () => [["male", SA.L("male", "ذكر")], ["female", SA.L("female", "أنثى")], ["both", SA.L("both", "كلاهما")]] });
  OPS.ageField = () => ({ key: "age", label: ["age group :", "الفئة العمرية :"], placeholder: ["select age group", "اختر الفئة العمرية"], options: () => ["Kids", "Teens", "Adults"].map((a) => [a, a]) });
  OPS.sessionBadge = (s) => SA.badge(s === "coming" ? "success" : s === "ended" ? "primary" : "danger", s);
  /* date filters compare the day part only (inputs are YYYY-MM-DD) */
  OPS.inRange = (v, a, b) => { const d = String(v || "").slice(0, 10); return (!a || d >= a.slice(0, 10)) && (!b || d <= b.slice(0, 10)); };
})();
