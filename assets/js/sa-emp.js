/* Employees sample data (Employees · Jobs · Activity log) — shaped like
   GET /employees, GET /jobs, GET /activity-logs. One source for the three pages. */
(function () {
  "use strict";
  const S = HF.SA;
  if (S.employees) return;
  S.jobs = ["Super Admin", "Operations Manager", "Finance Officer", "Support Agent", "Content Editor", "Marketing Lead"].map((n, i) => ({ id: 1 + i, name: n, active: i === 5 ? 0 : 1, created_at: `2026-0${1 + i}-0${3 + i} 10:00:00` }));
  const NAMES = ["Mona Fawzi", "Ahmed Saeed", "Reem Al-Harbi", "Khaled Nasser", "Sara Adel", "Omar Tarek", "Huda Salem", "Yasser Fahd", "Lina Haddad", "Tamer Hosny", "Nada Kamal", "Fahad Otaibi", "Rania Samir", "Bilal Aziz", "Dalia Mostafa", "Saeed Ali", "Maha Jaber", "Waleed Hamdi"];
  const G = S.GEO;
  S.employees = NAMES.map((n, i) => {
    const g = G[(i * 2) % G.length], code = g.country.iso === "EG" ? "+20" : g.country.iso === "AE" ? "+971" : "+966";
    return { id: 50 + i, name: n, image: null, created_at: `2026-${String(1 + (i % 11)).padStart(2, "0")}-${String(2 + i).padStart(2, "0")} 09:${String(10 + i).padStart(2, "0")}:00`,
      phone: `5${i % 10}${String(1000000 + i * 7391).slice(0, 7)}`, phone_code: code, email: `${n.split(" ")[0].toLowerCase()}.${i}@highfive.sa`,
      job: S.jobs[i % S.jobs.length], country: { iso: g.country.iso, name: g.country.name }, active: i % 7 === 4 ? 0 : 1 };
  });
  const DESC = ["Full access to the dashboard", "Runs bookings, events and partners day to day", "Wallets, funds, cash out and financials", "Answers users and partners", "Pages, help center and notifications", ""];
  S.jobs.forEach((j, i) => Object.assign(j, { description: DESC[i], employees_count: S.employees.filter((e) => e.job.id === j.id).length }));
  S.jobs[0].name = "admin"; /* job #1 is the protected admin job (no row actions, no permissions page) */

  /* permissions tree as GET /jobs/{id} returns it: { Group: { SubModule: [{id,key,name,checked}] } } */
  const TREE = {
    Partners: { Partners: ["view_partners", "add_partners", "update_partners", "view_partner_details", "login_as_partner"], "Partner Services": ["view_partner_services", "update_partner_services"], "Partner Notes": ["view_partner_notes", "add_partner_notes", "delete_partner_notes"] },
    Units: { Units: ["view_units", "update_units", "view_unit_details"], "Unit Comments": ["view_unit_comments", "delete_unit_comments"], "Unit Settings": ["view_unit_settings", "update_unit_settings"] },
    Users: { Users: ["view_user", "update_user"], "User Wallet": ["view_user_wallet", "add_user_fund"], "User Notes": ["view_user_notes", "add_user_notes", "delete_user_notes"] },
    Operations: { Bookings: ["view_bookings", "view_booking_details"], "Public Events": ["view_public_events", "view_public_event_details", "view_joining_list"], "Multi Booking": ["view_multi_bookings", "view_multi_booking_details"] },
    Finance: { Financials: ["view_financials", "view_financials_details", "view_partner_financials"], Wallets: ["view_wallets", "view_transactions", "view_funds", "update_funds", "view_cashout", "update_cashout", "view_exchanges"] },
    Employees: { Employees: ["view_employees", "add_employees", "update_employees", "delete_employees"], Jobs: ["view_jobs", "add_jobs", "update_jobs", "delete_jobs"], "Activity Log": ["view_activity_log"] },
  };
  const nice = (k) => k.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
  let pid = 1;
  S.permTree = (job) => {
    if (job._perm) return job._perm;
    const out = {};
    Object.entries(TREE).forEach(([g, subs], gi) => { out[g] = {}; Object.entries(subs).forEach(([s, keys]) => (out[g][s] = keys.map((k, ki) => ({ id: pid++, key: k, name: nice(k), checked: job.id === 1 || (gi + job.id) % 3 === 0 || (ki === 0 && gi % 2 === job.id % 2) })))); });
    return (job._perm = out);
  };

  /* activity log (GET /activity-logs, /activity-logs/{id}, /activity-logs/filters).
     Row shape as the API sends it:
       { id, created_at, module:{value,label}, action:{value,label,color}, performed_by:{id,name,role,email,phone},
         acting_as:{value,label,company_name}|null, record:{id,label,exists},
         changes:{ mode:"diff"|"snapshot", count, fields:[
           {field, label, before:{value,label}, after:{value,label}}   ← diff (updates)
           {field, label, value:{value,label}} ] } }                   ← snapshot (create / delete / login …)
     action.color (green · blue · red · amber) decides the badge; action / module labels are the API's
     own strings (English) — the design system shows them translated in Arabic. */
  const MODS = [["partners", "Partners", "Partners"], ["units", "Units", "Partners"], ["packages", "Packages", "Partners"], ["users", "Users", "Users"], ["wallet_funds", "Wallet funds", "Finance"], ["currencies", "Currencies", "Finance"], ["employees", "Employees", "Employees"], ["jobs", "Jobs", "Employees"], ["comments", "Comments", "Operations"]];
  S.logModules = MODS.map((m) => ({ value: m[0], label: m[1], group: m[2] }));
  S.logActions = [["created", "Created", "green"], ["updated", "Updated", "blue"], ["deleted", "Deleted", "red"], ["login", "Login", "amber"], ["translated", "Translated", "amber"]].map((a) => ({ value: a[0], label: a[1], color: a[2] }));
  S.actingAs = S.partners.slice(0, 5).map((p) => ({ value: String(p.id), label: p.owner_name || p.company_name, company: p.company_name }));
  const w = (value, label) => ({ value, label: label === undefined ? (value == null ? null : String(value)) : label });
  S.activityLogs = Array.from({ length: 46 }, (_, i) => {
    const m = MODS[i % MODS.length], act = S.logActions[i % 4 === 3 ? 2 : i % 3 === 0 ? 0 : 1], emp = S.employees[i % 6], p = i % 5 === 1 ? S.actingAs[i % S.actingAs.length] : null;
    const rec = m[0] === "users" ? S.users[i % S.users.length] : m[0] === "partners" ? S.partners[i % S.partners.length] : null;
    const recName = rec ? rec.name || rec.company_name : `${m[1]} #${300 + i}`;
    const fields = act.value === "updated"
      ? (m[0] === "users" ? [{ field: "attribute", label: "Attribute", before: w(null), after: w(i % 2 ? "blocked_from_booking" : "verified") }, { field: "player_id", label: "Player id", before: w(null), after: w(rec.id, rec.name) }]
        : [{ field: "name", label: "Name", before: w("Old name"), after: w(recName) }, { field: "active", label: "Active", before: w(0), after: w(1) },
          { field: "active_action_by", label: "Active action by", before: w(null), after: w(1, "Super Admin") }, { field: "start_date", label: "Start date", before: w("2026-10-01"), after: w("2026-11-20") },
          { field: "updated_at", label: "Updated at", before: w("2026-10-01T09:00:00Z"), after: w("2026-11-1" + (i % 6) + "T12:30:00Z") }])
      : [{ field: "name", label: "Name", value: w(recName) }, { field: "is_featured", label: "Is featured", value: w(i % 2) }, { field: "sessions_count", label: "Sessions count", value: w(1) }, { field: "created_at", label: "Created at", value: w("2026-11-0" + (1 + (i % 9)) + "T08:15:00Z") }];
    return { id: 9000 + i, created_at: `${String(1 + (i % 28)).padStart(2, "0")}/1${i % 2}/2026 ${String(8 + (i % 12)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
      module: { value: m[0], label: m[1] }, action: { value: act.value, label: act.label, color: act.color }, performed_by: { id: emp.id, name: emp.name, role: emp.job.name, email: emp.email, phone: `${emp.phone_code} ${emp.phone}` }, acting_as: p,
      record: { id: rec ? rec.id : 300 + i, label: recName, exists: act.value !== "deleted" },
      changes: { mode: act.value === "updated" ? "diff" : "snapshot", count: fields.length, fields } };
  });
})();
