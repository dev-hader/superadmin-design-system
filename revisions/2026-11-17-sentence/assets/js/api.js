/* ============================================================================
   API — thin fetch wrapper around the real Design System Access backend
   (external service, provisioned by the Super Admin — see #2528/#2527).
   No dependency on shell.js/RD: usable from the real login page (login-live.html)
   and product pages alike. Base URL is injected at runtime via assets/js/env.js
   (window.ENV.API_BASE_URL) — see .env.example / README for how that file
   is generated from .env (local copy or Docker envsubst at container start).

   Endpoints (tickets #2525 / #2526), mounted under /api/design-system:
     POST /api/design-system/login   { email, password } -> { token, expiresIn }
     GET  /api/design-system/me      Bearer token         -> { profile, permissions }
     POST /api/design-system/logout  Bearer token          -> invalidates the session
   The live backend wraps these in its own envelope — { success, data: {...},
   message } — instead of the flat shapes above; see unwrap()/errorMessage() below,
   which read through that envelope so the rest of the file only ever deals with
   plain { token, expiresIn } / { profile, permissions } objects.

   MULTIPLE DESIGN SYSTEMS (backend change, 2026-08-16)
   ---------------------------------------------------
   The backend now models more than one design system — a Partner system (this
   deck, which kept the permissions that used to be the only ones) and a User
   system — and a user's permissions belong to a system. Both login and /me now
   carry the whole picture, measured from api-dev.hfive.com on 2026-08-16:

     data.permissions  ["booking","customers",...,"design-system","dashboard",
                        "dated-schedule","365"]        <- UNION of every system
     data.systems      [{ id: 1, name: "partner", title: "Partner Design System",
                          permissions: [{ id, permission, title }, ...] },
                        { id: 2, name: "user",    title: "User Design System",
                          permissions: [{ id, permission, title }, ...] }]

   `name` is the slug, `title` is the label, and each permission's key is its
   `permission` field.

   The backend also added GET /design-systems/active and GET
   /design-systems/permissions?system_ids[]=… — this file deliberately calls
   NEITHER. Both answers are already inside the login and /me payloads above, so
   fetching them again would be a second round-trip for data already in hand, on
   a path that would then have to be kept configured and correct. If a screen
   ever needs the catalogue of systems the user does NOT hold, that is when to
   add them back.

   WHICH SYSTEM THIS DECK IS: the Partner one, statically. SYSTEM below is a
   const, not config — this repo can only ever be the Partner design system, and
   a value that cannot legitimately vary is not a setting. pickSystem() selects
   it by slug out of whatever the response carried, and ITS permissions — never
   the union in data.permissions — are what gate the nav, so a User key can't
   unlock anything here. An account holding only the User system is refused
   exactly like one with no access record at all (owner decision, 2026-08-16).

   The Partner system's keys are the ones this deck already gated on — dashboard,
   dated-schedule, booking, customers, membership, marketing, financial,
   management, design-system (plus a stray "542"). The NAV_PERM block in
   assets/shell.js maps each to the page it gates.

   BACKWARD COMPATIBLE. A response with no `systems` key at all keeps the old
   flat behaviour end to end: no selection is attempted, nobody is refused, and
   the flat `permissions` list still drives the nav.
   ========================================================================== */
window.API = (function () {
  "use strict";

  const BASE = ((window.ENV && window.ENV.API_BASE_URL) || "").replace(/\/+$/, "");
  const PREFIX = BASE + "/api/design-system";

  /* Which design system this deck is — the backend's own slug for it
     (systems[].name === "partner"). Static by design; see the header block. */
  const SYSTEM = "superadmin";

  /* True only when env.js actually provided a usable absolute URL. False when:
       - env.js failed to load at all (window.ENV undefined -> BASE === "")
       - env.js was never regenerated from env.template.js, so BASE is still the
         raw, un-substituted envsubst placeholder "${API_BASE_URL}" (docker
         entrypoint didn't run / API_BASE_URL wasn't set in the container env)
       - .env has API_BASE_URL= blank
     A relative/garbage BASE would otherwise resolve fetch() against the
     current origin (e.g. .../${API_BASE_URL}/api/design-system/me), silently
     404 instead of throwing, and let the "fail open on non-401" logic in
     shell.js's enforceAccess() paper over a completely broken deployment. */
  const CONFIGURED = /^https?:\/\//i.test(BASE);

  /* Prints on every single page load — if you don't see this line (with today's
     date) in the console after a reload, the browser is running a STALE cached
     copy of this file, not the one on disk. Bump the date whenever you're
     debugging a "the code looks right but the bug persists" situation. */
  console.info("[API] api.js build 2026-08-16b loaded — API_BASE_URL =", BASE || "(empty — check assets/js/env.js)",
    "· design system =", SYSTEM);
  if (!CONFIGURED) console.error("[API] API_BASE_URL is missing or unresolved (\"" + BASE + "\") — assets/js/env.js was not generated correctly. All backend calls will fail; shell.js will render a connection-error page instead of the app.");

  const TOKEN_KEY = "hf_token";
  const EXP_KEY = "hf_token_exp";
  /* The user's systems (each with its permissions) and the id of the one this
     deck selected, stored beside the token so a reload doesn't have to wait for
     /me to resolve before the nav can paint. "hf_permissions" — the selected
     system's permission list — is written here too, because that is the key
     shell.js's RD.currentPermissions() already reads for its first paint. */
  const SYSTEMS_KEY = "hf_systems";
  const SYSTEM_KEY = "hf_system_id";
  const PERMS_KEY = "hf_permissions";

  /* token lives in localStorage when "Remember me" was checked, sessionStorage
     otherwise (cleared with the browser tab) — either is checked on read so a
     page never needs to know which one applies. */
  function store(remember) { return remember ? localStorage : sessionStorage; }

  /* A missing/zero/non-numeric expiresIn must NOT be treated as "expires now" (that
     bug bounced a just-logged-in user straight back to the login page on the very
     next page load) — treat it as "no expiry known" instead, same as isExpired()
     already does when EXP_KEY isn't set at all. */
  function saveSession(token, expiresIn, remember, systemList) {
    try {
      const s = store(remember);
      s.setItem(TOKEN_KEY, token);
      const secs = Number(expiresIn);
      if (secs > 0) s.setItem(EXP_KEY, String(Date.now() + secs * 1000));
      else s.removeItem(EXP_KEY);
    } catch (e) {}
    /* Optional 4th argument: the systems login returned. Persisting them here
       means the very first product page paints against this system's real
       permissions instead of the "browse only" guest default. */
    if (Array.isArray(systemList)) saveSystems(systemList, remember);
  }

  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null; }
    catch (e) { return null; }
  }

  function isExpired() {
    try {
      const exp = localStorage.getItem(EXP_KEY) || sessionStorage.getItem(EXP_KEY);
      return exp ? Date.now() > Number(exp) : false;
    } catch (e) { return false; }
  }

  function clearSession() {
    try {
      [localStorage, sessionStorage].forEach(function (s) {
        [TOKEN_KEY, EXP_KEY, SYSTEMS_KEY, SYSTEM_KEY, PERMS_KEY].forEach(function (k) { s.removeItem(k); });
      });
    } catch (e) {}
  }

  /* ---- design systems ------------------------------------------------------
     Reads the measured shape in the header block: systems[] of
       { id, name (slug), title (label), permissions: [{ id, permission, title }] }
     A permission arriving as a bare string is accepted too — that costs one line
     and covers the backend ever flattening the list. */

  function permKey(p) {
    if (p == null) return "";
    if (typeof p === "string" || typeof p === "number") return String(p);
    return String(p.permission || p.slug || p.key || p.name || "");
  }
  function normalizePermissions(list) {
    if (!Array.isArray(list)) return [];
    return list.map(permKey).filter(Boolean);
  }

  /* "user", "User Design System" and "user-design-system" all reduce to "user",
     so the match holds whether it reads systems[].name or systems[].title. */
  function slugify(text) {
    return String(text || "").toLowerCase().replace(/design\s*[-_]?\s*systems?/g, "").replace(/[^a-z0-9]+/g, "");
  }

  function normalizeSystem(s) {
    if (!s || typeof s !== "object") return null;
    return {
      id: s.id != null ? s.id : null,
      /* label for display; `name` is the backend's slug, `title` the human one */
      name: s.title || s.name || "",
      slug: slugify(s.name || s.slug || s.title),
      permissions: normalizePermissions(s.permissions || []),
    };
  }

  function readSystems(body) {
    const list = body && typeof body === "object" ? body.systems : null;
    if (!Array.isArray(list)) return null; /* null = backend said nothing about systems */
    return list.map(normalizeSystem).filter(Boolean);
  }

  /* The one this deck is. Null when the user simply doesn't hold it. */
  function pickSystem(systems) {
    if (!Array.isArray(systems) || !systems.length) return null;
    return systems.filter(function (s) { return s.slug === SYSTEM; })[0] || null;
  }

  /* Persist the list + the selection into the same store the token is in, so a
     "remember me" session and a tab-only one behave identically. */
  function saveSystems(systems, remember) {
    if (!Array.isArray(systems)) return null;
    const chosen = pickSystem(systems);
    try {
      const s = remember === undefined ? currentStore() : store(remember);
      s.setItem(SYSTEMS_KEY, JSON.stringify(systems.map(function (x) {
        return { id: x.id, name: x.name, slug: x.slug, permissions: x.permissions };
      })));
      if (chosen) {
        s.setItem(SYSTEM_KEY, String(chosen.id != null ? chosen.id : chosen.slug));
        s.setItem(PERMS_KEY, JSON.stringify(chosen.permissions));
      } else {
        s.removeItem(SYSTEM_KEY);
        s.removeItem(PERMS_KEY);
      }
    } catch (e) {}
    return chosen;
  }

  /* Wherever the token already lives — so saveSystems() called after login (from
     /me, with no `remember` to hand) writes next to it instead of splitting the
     session across the two stores. */
  function currentStore() {
    try { if (localStorage.getItem(TOKEN_KEY)) return localStorage; } catch (e) {}
    return sessionStorage;
  }

  function systems() {
    try {
      const raw = localStorage.getItem(SYSTEMS_KEY) || sessionStorage.getItem(SYSTEMS_KEY);
      const list = raw ? JSON.parse(raw) : null;
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }
  /* The selected system as last persisted (null on the old flat backend, or when
     the user doesn't hold this system). */
  function activeSystem() { return pickSystem(systems()); }
  function activeSystemId() {
    const s = activeSystem();
    return s && s.id != null ? s.id : null;
  }

  function apiError(status, code) {
    const err = new Error(code || "request_failed");
    err.status = status; err.code = code;
    return err;
  }

  async function parseJson(res) {
    try { return await res.json(); } catch (e) { return {}; }
  }

  /* The real backend wraps every payload in an envelope — { success, data: {...},
     message } — instead of returning the ticket's documented shape directly at the
     top level. Unwrap `data` when present so the rest of this file can keep reading
     plain { token, expiresIn } / { profile, permissions } shapes. */
  function unwrap(body) {
    return body && typeof body === "object" && body.data && typeof body.data === "object" ? body.data : body;
  }
  function errorMessage(body) {
    return body && (body.error || body.message);
  }

  /* fetch() itself rejects (TypeError, no .status) for CORS blocks, DNS/connection
     failures, etc. — the Network tab can still show a complete 200 response with a
     body in that case (the browser received it fine; CORS just stops JS from ever
     reading it), which is confusing to debug. Wrap every call so that failure mode
     always surfaces as apiError(0, "network_error") instead of a bare TypeError,
     and log the original error so it's inspectable in the console. */
  async function safeFetch(url, opts) {
    try {
      return await fetch(url, opts);
    } catch (e) {
      console.error("[API] network/CORS error calling", url, e);
      throw apiError(0, "network_error");
    }
  }

  /* POST /auth/login (#2525) — email + password created by the Super Admin.
     401 invalid_credentials · 403 no_access (valid email, no/removed access record). */
  async function login(email, password) {
    const res = await safeFetch(PREFIX + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await parseJson(res);
    console.debug("[API] POST /login ->", res.status, body); /* exact runtime response — inspect this first on any login failure */
    if (!res.ok) throw apiError(res.status, errorMessage(body));
    const data = unwrap(body);
    if (!data || !data.token) {
      console.error("[API] login got a 2xx but no usable token in it. Raw body:", body, "unwrapped:", data);
      throw apiError(res.status, "malformed_response");
    }
    /* `systems` is null (not []) when the response says nothing about systems at
       all — the caller has to tell "old backend, carry on" apart from "this user
       holds no system here", which is a refusal. */
    const list = readSystems(data);
    return {
      token: data.token,
      expiresIn: data.expiresIn ?? data.expires_in ?? null,
      systems: list,
      system: list ? pickSystem(list) : null,
    };
  }

  /* GET /auth/me (#2526) — resolved profile + permissions (page keys) for the
     current token. 401 -> caller redirects to login. */
  async function me() {
    const token = getToken();
    if (!token || isExpired()) { clearSession(); throw apiError(401, "no_token"); }
    const res = await safeFetch(PREFIX + "/me", { headers: { Authorization: "Bearer " + token } });
    if (res.status === 401) { clearSession(); throw apiError(401, "unauthorized"); }
    const body = await parseJson(res);
    if (!res.ok) throw apiError(res.status, errorMessage(body));
    const data = unwrap(body) || {};
    /* /me is the authoritative refresh: re-select and re-persist on every load,
       so a system granted (or revoked) since sign-in takes effect on the next
       page view rather than at the next login. */
    const list = readSystems(data);
    const chosen = list ? saveSystems(list) : null;
    return {
      profile: data.profile || data.user || null,
      /* Scoped to the selected system when the backend sends systems; the old
         flat list otherwise. Never data.permissions when systems are present —
         that field is the union across systems, so reading it would hand this
         deck the Partner's keys. */
      permissions: chosen ? chosen.permissions : (list ? [] : (data.permissions || [])),
      systems: list,
      system: chosen,
    };
  }

  /* Logout invalidates the session server-side; the client-side token is
     cleared regardless of whether the request succeeds (best-effort). */
  async function logout() {
    const token = getToken();
    clearSession();
    if (!token) return;
    try {
      await fetch(PREFIX + "/logout", { method: "POST", headers: { Authorization: "Bearer " + token } });
    } catch (e) {}
  }

  /* Guest guard for the login pages themselves (login.html AND login-live.html):
     if this tab already holds a non-expired token, there's no reason to show the
     login form again — bounce straight to the destination, honoring the same
     ?redirect= param the real login page uses on successful sign-in. Returns
     true (and navigates away) when it redirected, false otherwise, so callers
     can bail out of their own init before rendering the form. */
  function redirectIfAuthenticated(fallback) {
    if (!getToken() || isExpired()) return false;
    const r = new URLSearchParams(location.search).get("redirect");
    const target = r && /^\/(?!\/)/.test(r) ? r : (fallback || "index.html");
    location.replace(target);
    return true;
  }

  return {
    login, me, logout, getToken, isExpired, saveSession, clearSession, redirectIfAuthenticated,
    isConfigured: () => CONFIGURED,
    /* multi-system surface (see the header block) */
    systems, activeSystem, activeSystemId, saveSystems,
    designSystem: () => SYSTEM,
  };
})();
