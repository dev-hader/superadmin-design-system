/* ============================================================================
   SA DATA — sample records for the Super Admin reference pages, shaped like
   the real API responses (field names match HighFive-SuperAdmin-Front's
   _requests.js consumers) so a developer can map 1:1. Deterministic: the
   same partner appears on Partners, Units, Services and Packages.
   ========================================================================== */
(function () {
  "use strict";
  const HF = (window.HF = window.HF || {});
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pad = (n) => String(n).padStart(2, "0");
  const date = (m, d, h, mi) => `2026-${pad(m)}-${pad(d)} ${pad(h)}:${pad(mi)}:00`;

  const GEO = [
    { country: { iso: "SA", name: "Saudi Arabia" }, state: { id: 1, name: "Riyadh Region" }, city: { id: 11, name: "Riyadh" } },
    { country: { iso: "SA", name: "Saudi Arabia" }, state: { id: 2, name: "Makkah Region" }, city: { id: 21, name: "Jeddah" } },
    { country: { iso: "SA", name: "Saudi Arabia" }, state: { id: 3, name: "Eastern Province" }, city: { id: 31, name: "Dammam" } },
    { country: { iso: "EG", name: "Egypt" }, state: { id: 4, name: "Cairo" }, city: { id: 41, name: "Nasr City" } },
    { country: { iso: "EG", name: "Egypt" }, state: { id: 5, name: "Giza" }, city: { id: 51, name: "Dokki" } },
    { country: { iso: "AE", name: "United Arab Emirates" }, state: { id: 6, name: "Dubai" }, city: { id: 61, name: "Jumeirah" } },
  ];
  const COMPANIES = ["Al Olaya Sports Co.", "Smash Padel Club", "Blue Wave Aquatics", "Strike Bowling Lounge", "نادي الفرسان للياقة", "Kick Off Arena", "Little Champs Academy", "Summit Climbing Gym", "أكاديمية النخبة", "Pitch Perfect Football", "Zen Yoga Studio", "Ace Tennis Center", "Fun Zone Kids", "Riyadh Racquet Club", "مركز الواحة الرياضي", "Golden Lane Bowling", "Wave Rider Surf", "Iron Temple Fitness", "Sky Trampoline Park", "Desert Riders Club", "Marina Sailing Club", "Arena 7 Futsal", "نادي الشروق", "Elite Swim School", "Peak Performance Lab", "Galaxy Kart Racing", "City Squash Club", "Green Fairway Golf", "Bounce House Jeddah", "Power Padel Dammam", "Al Nakheel Riding", "Splash Water Park", "Focus Archery Range", "مملكة المغامرات", "Victory Boxing Gym", "Nile Rowing Club"];
  const OWNERS = ["Ahmed Al-Harbi", "Sara Al-Qahtani", "Omar Farouk", "Lina Haddad", "خالد العتيبي", "Mona Saleh", "Yousef Nasser", "Hana Al-Mutairi", "محمد الدوسري", "Karim Adel", "Reem Al-Shehri", "Tarek Mansour", "نورة السبيعي", "Faisal Al-Zahrani", "Dina Mostafa", "Ali Hassan"];
  const STATUSES = ["active", "active", "active", "waiting", "inactive", "active", 1, "waiting"];

  HF.SA = HF.SA || {};
  HF.SA.GEO = GEO;
  HF.SA.partners = COMPANIES.map((name, i) => {
    const g = GEO[i % GEO.length];
    const owner = OWNERS[i % OWNERS.length];
    return {
      id: 1040 + i,
      photo: null,
      company_name: name,
      created_at: date(int(1, 11), int(1, 28), int(8, 22), int(0, 59)),
      profile_image: null,
      owner_name: i % 13 === 7 ? null : owner,
      partner_phone: (g.country.iso === "EG" ? "+20 10" : g.country.iso === "AE" ? "+971 50" : "+966 5") + int(1000000, 9999999),
      email: owner.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "") + (i ? i : "") + "@" + (/[a-z]/i.test(name) ? name.toLowerCase().replace(/[^a-z]+/g, "") : "partner" + i) + ".com",
      country: g.country, state: g.state, city: g.city,
      units_count: int(0, 14),
      active: STATUSES[i % STATUSES.length],
      created_by: i % 5 === 2 ? "Admin" : "Partner",
      is_independent: i % 4 === 1,
    };
  });

  /* ---- units ---- */
  const CATS = [{ id: 1, name: "Sports" }, { id: 2, name: "Kids" }, { id: 3, name: "Entertainment" }];
  const ACTS = { 1: ["Padel", "Football", "Tennis", "Swimming", "Squash"], 2: ["Trampoline", "Play Area", "Kids Academy"], 3: ["Bowling", "Karting", "Archery"] };
  const TYPES = ["Court", "Field", "Pool", "Lane", "Hall", "Track"];
  const CAPS = ["1 - 4", "5 - 10", "11 - 20", "21 - 50"];
  const METHODS = ["Fixed slots", "Flexible schedule", "Public event", "Multi booking"];
  HF.SA.CATS = CATS; HF.SA.ACTS = ACTS; HF.SA.TYPES = TYPES; HF.SA.CAPS = CAPS;
  const st = (v) => ({ value: v, lable: { waiting: "pending", pending: "pending", active: "approved", inactive: "not approved" }[v] });
  HF.SA.units = [];
  let uid = 3100;
  HF.SA.partners.forEach((p, i) => {
    const n = Math.min(p.units_count, 3) || (i % 3 === 0 ? 1 : 0);
    for (let k = 0; k < n; k++) {
      const cat = CATS[(i + k) % CATS.length];
      const act = ACTS[cat.id][(i + k) % ACTS[cat.id].length];
      const type = TYPES[(i * 2 + k) % TYPES.length];
      const status = ["active", "active", "waiting", "inactive", "active"][(i + k) % 5];
      HF.SA.units.push({
        id: uid++,
        name: `${act} ${type} ${k + 1}`,
        image: null,
        created_at: date(int(1, 11), int(1, 28), int(8, 22), int(0, 59)),
        attendance_type: (i + k) % 7 === 3 ? "online" : "onsite",
        partner: { id: p.id, company_name: p.company_name, photo: null, created_at: p.created_at, is_independent: p.is_independent },
        activity_category: { id: cat.id, name: cat.name }, activity: { name: act }, type: { name: type },
        capacity: CAPS[(i + k) % CAPS.length],
        booking_methodology: METHODS[(i + k) % METHODS.length],
        availability: (i + k) % 6 === 4 ? "Maintenance" : "Available",
        status: st(status),
        ownappactive: p.is_independent ? st(["active", "waiting", "inactive"][(i + k) % 3]) : null,
      });
    }
  });

  /* ---- service lists + services ---- */
  const LIST_NAMES = ["Add-ons", "Equipment rental", "Coaching", "Drinks & snacks", "Extras", "Kids packages", "Private session", "Birthday extras"];
  const SRV = { "Add-ons": ["Extra 30 minutes", "Floodlights", "Changing room"], "Equipment rental": ["Racket rental", "Ball pack", "Shoes rental", "Goggles"], Coaching: ["Beginner coaching", "Advanced drills", "Video analysis"], "Drinks & snacks": ["Water bottle", "Energy drink", "Protein bar", "Fresh juice"], Extras: ["Locker", "Towel", "Parking pass"], "Kids packages": ["Face painting", "Party host", "Goodie bags"], "Private session": ["1:1 trainer", "Private lane"], "Birthday extras": ["Cake", "Decorations", "Photographer"] };
  HF.SA.serviceLists = [];
  HF.SA.services = [];
  let lid = 520, sid = 9100;
  HF.SA.partners.slice(0, 22).forEach((p, i) => {
    const count = 1 + (i % 2);
    for (let k = 0; k < count; k++) {
      const name = LIST_NAMES[(i + k * 3) % LIST_NAMES.length];
      const sel = (i + k) % 3 === 0 ? "single" : "multiple";
      const hasQty = (i + k) % 4 === 3 ? 1 : 0;
      const list = {
        id: lid++, name, partner: { id: p.id, company_name: p.company_name }, is_default: k === 0 && i % 3 === 0,
        status: ["approved", "pending", "approved", "not_approved", "approved", "pending"][(i + k) % 6],
        is_required: (i + k) % 2, selection_type: sel, has_qty: hasQty,
        min_selection: sel === "single" ? 1 : (i + k) % 3, max_selection: sel === "single" ? 1 : ((i + k) % 4 === 0 ? null : 3 + (i % 3)),
        min_total_quantity: hasQty ? 1 : null, max_total_quantity: hasQty ? 10 : null,
        note: (i + k) % 3 === 1 ? "Shown at checkout" : "",
        created_at: date(int(3, 11), int(1, 28), int(8, 22), int(0, 59)),
      };
      list.status_trans = { approved: "Approved", pending: "Pending", not_approved: "Not Approved" }[list.status];
      const names = SRV[name];
      names.forEach((sn, j) => {
        HF.SA.services.push({
          id: sid++, name: sn, description: j % 2 ? "" : `${sn} available for all ${p.company_name} bookings.`,
          image: null, duration: j % 3 === 2 ? null : [15, 30, 45, 60, 90][(i + j) % 5],
          max_quantity: j % 2 ? null : 1 + ((i + j) % 5), minimum_selection: j % 3 ? null : 1,
          price: [0, 15, 25, 40, 60, 120][(i + j) % 6], currency: { code: p.country.iso === "EG" ? "EGP" : p.country.iso === "AE" ? "AED" : "SAR" },
          visibility: (i + j) % 5 === 4 ? "inactive" : "active",
          status: list.status, created_at: date(int(3, 11), int(1, 28), int(8, 22), int(0, 59)),
          partner: { id: p.id, name: p.company_name }, service_list: { id: list.id, name: list.name },
        });
      });
      list.services_count = names.length;
      HF.SA.serviceLists.push(list);
    }
  });

  /* ---- packages ---- */
  const PKG = ["Platinum All-Access", "Padel Pro Season", "Family Swim Pass", "Kids Summer Camp", "Bowling Night Bundle", "Monthly Fitness", "Weekend Warrior", "Junior Tennis Term", "باقة النخبة", "Morning Swim Club", "Squash Ladder", "Climb Unlimited", "Yoga 10-Class Pack", "Karting Grand Prix", "Archery Starter"];
  const VALID = [
    { type: "from_purchase", label: "30 days from purchase" },
    { type: "user_activation", label: "60 days from activation" },
    { type: "fixed_date_range", label: "Fixed dates", starts_on: "01/12/2026", ends_on: "28/02/2027" },
  ];
  const SELL = [{ value: "online", label: "Online" }, { value: "walk_in", label: "Walk-in" }, { value: "both", label: "Online & walk-in" }];
  HF.SA.VALID = VALID; HF.SA.SELL = SELL;
  HF.SA.packages = [];
  let pid = 700;
  HF.SA.partners.slice(0, 18).forEach((p, i) => {
    const n = 1 + (i % 3 === 0 ? 2 : i % 2);
    for (let k = 0; k < n; k++) {
      const plans = 1 + ((i + k) % 3);
      const cur = p.country.iso === "EG" ? "EGP" : p.country.iso === "AE" ? "AED" : "SAR";
      const from = [450, 1500, 220, 990, 300, 1200, 650][(i + k) % 7];
      const ap = ["approved", "pending", "approved", "not_approved", "approved", "pending", "approved"][(i + k) % 7];
      const branches = ["Main Branch", "North Branch", "Corniche Branch", "Mall Branch"].slice(0, 1 + ((i + k) % 3));
      HF.SA.packages.push({
        id: pid++, name: PKG[(i * 2 + k) % PKG.length],
        categories: [CATS[(i + k) % 3].name, ACTS[CATS[(i + k) % 3].id][k % 2]],
        created_at: date(int(6, 11), int(1, 28), int(8, 22), int(0, 59)),
        partner_status: p.active === "inactive" ? { value: "inactive", label: "Partner inactive" } : { value: "active", label: "Active" },
        partner: { id: p.id, name: p.company_name, logo: null, disabled: p.active === "inactive", disabled_label: "Partner disabled" },
        branches: branches.map((b) => ({ name: b })),
        plans: { count: plans, from_price: from, currency: cur, single: plans === 1 },
        validity: VALID[(i + k) % 3],
        usage: { label: ["Unlimited", "10 sessions", "4 sessions / month", "20 sessions"][(i + k) % 4] },
        capacity: { label: ["Unlimited", "50 subscribers", "120 subscribers"][(i + k) % 3] },
        subscribers: { active: [0, 12, 48, 133, 7, 254][(i + k) % 6], amount_due: (i + k) % 5 === 1 ? 2 : 0, amount_due_label: "2 with amount due" },
        selling_methodology: SELL[(i + k + Math.floor(i / 3)) % 3],
        approval_status: { value: ap, label: { approved: "Approved", pending: "Pending", not_approved: "Not Approved" }[ap], tooltip: ap === "not_approved" ? "Cover image shows a third-party logo." : "" },
      });
    }
  });
  HF.SA.pendingPackages = HF.SA.packages.filter((x) => x.approval_status.value === "pending").length;

  /* ---- users (GET /users) ---- */
  const UNAMES = ["Omar Khalid", "Sara Nabil", "Yousef Adel", "Lama Fahad", "Hassan Ali", "Noura Saad", "Faisal Turki", "Reem Hamad", "Majed Zaid", "Huda Salem", "Ahmad Rami", "Dana Yasser", "خالد ناصر", "Mona Fawzi", "Tariq Saleh", "جنى عمر", "Ziad Kamal", "Rana Adel", "Saud Ibrahim", "Laila Hani", "Basel Fares", "Maha Sami", "Ali Hussein", "Nada Kareem", "فهد سعد", "Jude Ammar", "Salma Riad", "Adel Mansour", "Yara Khalil", "Hamza Nabil", "Ghada Omar", "Rakan Fahd", "Tala Majed", "Sami Yousef", "Abeer Salem", "Mazen Ali", "Lulwa Saad", "Kareem Hany", "Farah Zaki", "Nawaf Turki", "Hiba Adel", "Bader Saleh"];
  const CUR = { SA: "SAR", EG: "EGP", AE: "AED" };
  HF.SA.users = UNAMES.map((name, i) => {
    const g = GEO[(i * 5) % GEO.length], loc = GEO[(i * 5 + (i % 4 === 1 ? 2 : 0)) % GEO.length];
    const y = 1980 + int(0, 26), first = name.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "") || "user";
    return {
      id: 2200 + i, photo: null, name, high_five_user_name: i % 11 === 6 ? null : `${first}${10 + i}`,
      email: i % 13 === 9 ? null : `${first || "user"}${i}@mail.com`, email_verified: i % 3 !== 1,
      phone: `+${g.country.iso === "EG" ? "20" : g.country.iso === "AE" ? "971" : "966"} 5${i % 10} ${100 + i * 7} ${1000 + i * 37}`, phone_code: g.country.iso === "EG" ? "+20" : g.country.iso === "AE" ? "+971" : "+966",
      country: { iso: g.country.iso, name: g.country.name, currency: { code: CUR[g.country.iso] } },
      gender: i % 3 === 1 ? "female" : "male", age: 2026 - y, date_of_birth: `${pad(int(1, 28))}/${pad(int(1, 12))}/${y}`,
      profile_location: { iso: g.country.iso, name: g.country.name },
      location: i % 9 === 4 ? { country: null, state: null, city: null } : { country: loc.country.name, state: loc.state.name, city: loc.city.name },
      wallet_amount: [0, 120, 450, 75, 1200, 30, 0, 260][i % 8], active_status: i % 5 === 3 ? "Inactive" : "Active", status: i % 9 === 7 ? 0 : 1,
      biography: i % 4 === 0 ? "Weekend padel player and swimmer." : "", created_at: date(int(1, 11), int(1, 28), int(8, 22), int(0, 59)),
      status_action_by: i % 9 === 7 ? { name: "Super Admin" } : null, status_action_at: i % 9 === 7 ? date(10, 12, 11, 30) : null,
    };
  });
})();
