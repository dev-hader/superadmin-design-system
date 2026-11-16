/* ============================================================================
   REDESIGN SHELL - shared chrome engine for every page in /redesign.
   5 navbar styles × 5 sidebar styles, switchable from a floating picker and
   persisted per-browser. One engine renders every variant from one NAV model
   - the same "one engine, many views" principle used by the Scheduling grid.
   ========================================================================== */
(function () {
    "use strict";
    const RD = (window.RD = window.RD || {});

    /* ---- icon set (24px, 1.75 stroke, round - matches the rest of the system) */
    const PATHS = {
        home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
        calendar:
            '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v3M16 3v3"/>',
        booking:
            '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v3M16 3v3"/><path d="m9 14 2 2 4-4"/>',
        users: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5a3.5 3.5 0 0 1 0 7M21 20a6 6 0 0 0-4-5.7"/>',
        membership:
            '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 20h10M9 4v2m6-2v2"/><circle cx="12" cy="11" r="2.5"/>',
        megaphone:
            '<path d="M3 11v2a1 1 0 0 0 1 1h2l7 4V6L6 10H4a1 1 0 0 0-1 1Z"/><path d="M16 8.5a4 4 0 0 1 0 7"/><path d="M19 6a7.5 7.5 0 0 1 0 12"/>',
        revenue:
            '<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
        hotel: '<path d="M3 21h18M5 21V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M10 21v-4h4v4"/>',
        chart: '<path d="M4 20V4M4 20h16"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/>',
        gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
        sliders:
            '<path d="M4 6h10M4 12h6M4 18h10"/><circle cx="17" cy="6" r="2"/><circle cx="13" cy="18" r="2"/>',
        box: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9"/>',
        search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.5-4.5"/>',
        bell: '<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
        headset:
            '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/><path d="M19.5 19v1a2 2 0 0 1-2 2h-3"/>',
        mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
        moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
        sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
        close: '<path d="M6 6l12 12M18 6 6 18"/>',
        chevronDown: '<path d="m6 9 6 6 6-6"/>',
        chevronLeft: '<path d="m15 18-6-6 6-6"/>',
        chevronRight: '<path d="m9 18 6-6-6-6"/>',
        menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
        layout: '<rect x="3" y="3" width="7" height="18" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="14" width="8" height="7" rx="1.5"/>',
        desktop:
            '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
        tablet: '<rect x="5" y="2.5" width="14" height="19" rx="2"/>',
        mobile: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/>',
        check: '<path d="m5 12 5 5 9-11"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        trash: '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6"/>',
        edit: '<path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 3 21l.5-4.5L17 3Z"/>',
        chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/>',
        send: '<path d="m3 11 18-8-8 18-2-8-8-2Z"/>',
        warn: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/>',
        info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
        steps: '<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><path d="M5 8v8M9 6h10M9 18h10"/>',
        layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
        list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1.5"/><circle cx="3.5" cy="12" r="1.5"/><circle cx="3.5" cy="18" r="1.5"/>',
        click: '<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M8 12h4"/>',
        qrcode: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM19 14h2M14 19h2M19 19h2"/>',
        package:
            '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9"/><path d="M8 5.25 16 9.75"/>',
        flash: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
        globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.9 5.6 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.6-3.9-9S9.5 5.6 12 3Z"/>',
        clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.5 2"/>',
        ticket: '<path d="M3 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 11v2M13 17v2"/>',
        eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
        /* gap fill (ADO #2868 — ticket attachments): file-upload.md's own HTML
         reference already called for RD.icon("upload") but no page had ever
         used the dropzone, so the icon was never added. paperclip marks an
         attached file inline (reply composer, message bubble). */
        upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
        paperclip: '<path d="M8 12.5 15.5 5a3.5 3.5 0 0 1 5 5L12 18.5a5.5 5.5 0 0 1-7.8-7.8L13 2"/>',
        eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a13.9 13.9 0 0 1-3.4 4.3M6.5 6.6C3.9 8.3 2 12 2 12s3.5 7 10 7a10.4 10.4 0 0 0 3.2-.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
        camera: '<path d="M3 8.5a2 2 0 0 1 2-2h1.6l1.1-1.7a1 1 0 0 1 .84-.45h6.9a1 1 0 0 1 .83.45l1.13 1.7H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="3.5"/>',
        lock: '<rect x="4.5" y="10" width="15" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v2"/>',
        shield: '<path d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
        refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v5h-5"/>',
        pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
        star: '<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7L12 3Z"/>',
        server: '<rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/><path d="M8 7h.01M8 17h.01"/>',
        trendUp: '<path d="M3 17 9.5 10.5 14 15l7-8"/><path d="M15 7h6v6"/>',
        accessibility:
            '<circle cx="12" cy="5" r="2.2"/><path d="M12 8v5m0 0-3.5 7M12 13l3.5 7M6 10l6 1.5 6-1.5"/>',
        puzzle: '<path d="M9 4h3.5a1 1 0 0 1 1 1 1.8 1.8 0 0 0 3.5 0 1 1 0 0 1 1-1H19a1 1 0 0 1 1 1v1.5a1.8 1.8 0 0 0 0 3.5V13a1 1 0 0 1-1 1h-1.5a1.8 1.8 0 0 0-3.5 0V15a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-1a1.8 1.8 0 0 0-3.5 0v.5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3.5a1.8 1.8 0 0 0 0-3.5V6a1 1 0 0 1 1-1h1.5a1.8 1.8 0 0 0 3.5 0 1 1 0 0 1 1-1Z"/>',
        heart: '<path d="M12 20.5S3.5 15 3.5 9a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2c0 6-8.5 11.5-8.5 11.5Z"/>',
    };
    function ic(name) {
        /* Closed-world guard: an unknown icon name is a spec violation - make it
       loud (console) and visible (warn glyph) instead of silently rendering
       nothing. The full inventory: design-system/foundations/iconography.md */
        if (!PATHS[name]) {
            try {
                console.warn(
                    `[HighFive DS] Unknown icon "${name}" - not in the registry inventory (foundations/iconography.md).`,
                );
            } catch (e) {}
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${PATHS.warn}</svg>`;
        }
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${PATHS[name]}</svg>`;
    }
    RD.icon = ic;
    RD.iconNames =
        Object.keys(PATHS); /* the closed-world inventory, from the source */

    /* The HighFive brand mark (5-finger "high five" icon) — one shape for all
       three identities, as an INLINE vector (assets/img/logo-mark.svg's five
       paths) filled with a token-driven <linearGradient>. It used to be a
       <span class="hf-logo-mask"> painted through a CSS `mask-image`, but
       Chrome refuses to load a mask image over file:// (every file is its own
       opaque origin), so the mark rendered completely invisible whenever a
       teammate double-clicked an HTML file instead of serving it. Same
       conversion assets/js/auth.js already got.
       Colour still comes entirely from tokens, with zero JS: the gradient
       stops carry .lg-mark__from/__mid/__to, whose stop-color is set from
       --lime-N in components.css (shared with the auth pages' mark) — the
       brand's own mint/teal ramp, no per-page markup swap.
       width/height="100%" so the caller keeps sizing the wrapper exactly as
       it did with the <span> (viewBox + the default preserveAspectRatio
       reproduce mask-size:contain / mask-position:center). The attributes are
       load-bearing: base.css's `svg:not([width])` would otherwise pin any
       bare <svg> to 20x20. The same 100%/100% is repeated as an inline style
       because the mark now IS an <svg>, so blanket icon rules that never used
       to reach it do (`.rd-navbar--centered .rd-navbar__brand svg` sizes
       icons 20x20, which stretched the 20x17 brand slot); an inline style
       outranks any of them, and the wrapper stays the single source of size.
       markHTML() takes a gradient id because SVG ids must be unique per
       document and the mark is injected more than once per page (sidebar
       brand + centered navbar brand); RD.logoMark is a getter so every read
       hands back a fresh, collision-free one. */
    const MARK_PATHS = `<path d="M9.19 34.39C8.66 33.98 8.39 33.32 6.29 32.44 4.52 31.7 2 32.73 2.07 35.06 2.15 37.81 7.95 50.58 10.44 53.63 12.15 55.74 16.3 54.67 16.78 51.56 17.46 47.1 11.6 36.26 9.19 34.39" /><path d="M57.86 13.44C56.88 13.08 53.96 13.48 51.32 19.16 49.99 22.02 45.55 38.6 45.63 40.58 45.75 43.74 50.36 45.81 52.67 42.28 53.44 41.11 59.78 19.81 60.15 18.41 60.95 15.37 59.63 14.07 57.86 13.44" /><path d="M33.57 5.08C32.57 4.75 30.43 5.64 27.22 11.03 25.3 14.24 20.01 34.86 19.9 41.69 19.81 47.32 25.82 46.77 27.05 43.99 29.87 37.62 35.64 11.65 36.03 9.96 36.72 6.9 35.36 5.65 33.57 5.08" /><path d="M66.39 28.04C65.4 27.69 62.48 28.08 59.84 33.76 58.93 35.72 54.31 49.26 54.65 51.63 55.03 54.21 59.1 56.24 61.35 53.21 61.99 52.35 62.74 49.48 63.38 47.41 65.82 39.58 68.02 33.43 68.31 32.3 69.12 29.26 68.16 28.68 66.39 28.04" /><path d="M50.27 7.33C51.07 4.29 49.76 3 47.98 2.36 47 2 44.08 2.39 41.44 8.08 39.7 11.81 32.43 33.12 33.95 37.77 34.71 40.1 37.95 41.32 40.38 38.99 42.69 36.78 49.81 9.09 50.27 7.33" />`;
    let markSeq = 0;
    const markHTML = (id) =>
        `<svg class="hf-logo-mask" width="100%" height="100%" style="width:100%;height:100%" viewBox="0 0 71.12 58.24" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop class="lg-mark__from" offset="0" /><stop class="lg-mark__mid" offset=".6" /><stop class="lg-mark__to" offset="1" /></linearGradient></defs><g fill="url(#${id})">${MARK_PATHS}</g></svg>`;
    const LOGO_MARK = () => markHTML("hfMarkGrad" + ++markSeq);
    RD.markHTML = markHTML;
    /* getter, not a plain string: `${RD.logoMark}` reads exactly as before at
       every existing call site (auth.js included) but yields a unique id. */
    Object.defineProperty(RD, "logoMark", { get: LOGO_MARK });

    /* Country inventory for the phone-field component (real SVG flags, never emoji -
     flag emoji render as bare two-letter codes on Windows). */
    RD.FLAGS = [
        {
            code: "SA",
            name: "Saudi Arabia",
            dial: "+966",
            flag: '<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#0f7a3d"/><rect x="4" y="7" width="12" height="1.6" fill="#fff"/><circle cx="17" cy="7.8" r="1.4" fill="#fff"/></svg>',
        },
        {
            code: "EG",
            name: "Egypt",
            dial: "+20",
            flag: '<svg viewBox="0 0 24 16"><rect width="24" height="5.33" fill="#ce1126"/><rect y="5.33" width="24" height="5.33" fill="#fff"/><rect y="10.67" width="24" height="5.33" fill="#000"/><circle cx="12" cy="8" r="1.6" fill="#c8a227"/></svg>',
        },
        {
            code: "AE",
            name: "United Arab Emirates",
            dial: "+971",
            flag: '<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#fff"/><rect width="8" height="16" fill="#ef3340"/><rect x="8" width="16" height="5.33" fill="#00732f"/><rect x="8" y="5.33" width="16" height="5.33" fill="#fff"/><rect x="8" y="10.67" width="16" height="5.33" fill="#000"/></svg>',
        },
        {
            code: "KW",
            name: "Kuwait",
            dial: "+965",
            flag: '<svg viewBox="0 0 24 16"><rect width="24" height="5.33" fill="#007a3d"/><rect y="5.33" width="24" height="5.33" fill="#fff"/><rect y="10.67" width="24" height="5.33" fill="#ce1126"/><path d="M0 0 L7 5.33 V10.67 L0 16 Z" fill="#000"/></svg>',
        },
    ];
    /* Wire a flag+dial country picker: btn/menu ids + onPick(flagObj). Returns a
     getter/setter: call with no args to read the current country; call with a
     country code (e.g. "EG") to preselect it — used when opening an edit form
     for an existing record whose country may not be the SA default. */
    RD.phoneCountry = function (btnId, menuId, onPick) {
        const btn = document.getElementById(btnId),
            menu = document.getElementById(menuId);
        let idx = 0;
        const paint = () => {
            btn.innerHTML = `<span class="flag-chip">${RD.FLAGS[idx].flag}</span><span>${RD.FLAGS[idx].dial}</span>${ic("chevronDown")}`;
        };
        menu.classList.add("phone-field__menu");
        menu.innerHTML = RD.FLAGS.map(
            (f, i) =>
                `<button class="menu__item" type="button" data-country="${i}"><span class="flag-chip">${f.flag}</span><span>${f.name}</span><span>${f.dial}</span></button>`,
        ).join("");
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("is-open");
        });
        menu.addEventListener("click", (e) => {
            const b = e.target.closest("[data-country]");
            if (!b) return;
            idx = +b.dataset.country;
            paint();
            menu.classList.remove("is-open");
            if (onPick) onPick(RD.FLAGS[idx]);
        });
        document.addEventListener("click", (e) => {
            if (
                !e.target.closest("#" + menuId) &&
                !e.target.closest("#" + btnId)
            )
                menu.classList.remove("is-open");
        });
        paint();
        return (code) => {
            if (code) {
                const i = RD.FLAGS.findIndex((f) => f.code === code);
                if (i > -1) {
                    idx = i;
                    paint();
                }
            }
            return RD.FLAGS[idx];
        };
    };

    /* ---- product nav model - the single source every renderer reads from --- */
    /* Mirrors the Super Admin dashboard sidebar exactly
     (HighFive-SuperAdmin-Front · SidebarMenuMain.tsx): same order, same
     accordions, same labels. Every TOP-LEVEL id is also the page's
     permission key (see NAV_PERM below), so the backend's Super Admin
     design-system catalogue and this menu share one vocabulary.

     Leaves whose DS page isn't built yet carry `planned` (the file the page
     will live in) and point at the dashboard until that phase ships —
     a link that opens something beats a 404 in a client review. */
    const SOON = "index.html";
    RD.NAV = [
        {
            label: "",
            items: [
                { id: "dashboard", title: "Dashboard", icon: "home", href: "index.html" },
                { id: "partners", title: "Partners", icon: "hotel", href: "partners.html" },
                { id: "partner-services", title: "Partners Lists and Services", icon: "list", href: "partner-services.html" },
                { id: "units", title: "Units", icon: "box", href: "units.html" },
                /* badge = pending-review count (GET /packages/pending-count); 10 matches the sample data */
                { id: "packages", title: "Packages", icon: "package", href: "packages.html", badge: "10" },
                { id: "users", title: "Users", icon: "users", href: "users.html" },
                {
                    id: "public-events",
                    title: "Public Events",
                    icon: "ticket",
                    children: [
                        { id: "pe-list", title: "Public Events", icon: "ticket", href: "public-events.html" },
                        { id: "pe-joining-list", title: "Joining List", icon: "list", href: "joining-list.html" },
                    ],
                },
                { id: "bookings", title: "Bookings", icon: "booking", href: "bookings.html" },
                { id: "multi-booking", title: "Multi-Booking Sessions", icon: "calendar", href: "multi-booking.html" },
                { id: "comments", title: "All Comments", icon: "chat", href: "comments.html" },
                {
                    id: "employees",
                    title: "Employees",
                    icon: "users",
                    children: [
                        { id: "emp-list", title: "Employees", icon: "users", href: "employees.html" },
                        { id: "emp-jobs", title: "Jobs", icon: "shield", href: "jobs.html" },
                        { id: "emp-activity-log", title: "Activity log", icon: "clock", href: "activity-log.html" },
                    ],
                },
                { id: "financials", title: "Financials", icon: "revenue", href: "financials.html" },
                { id: "wallet", title: "Wallet", icon: "trendUp", href: "wallet.html" },
                { id: "activities", title: "Activities", icon: "star", href: "activities.html" },
                { id: "subscriptions", title: "Subscriptions", icon: "membership", href: "subscriptions.html" },
                {
                    id: "setup-files",
                    title: "Setup Files",
                    icon: "sliders",
                    children: [
                        { id: "sf-types", title: "Types", icon: "layers", href: "setup-types.html" },
                        { id: "sf-capacities", title: "Capacities", icon: "users", href: "setup-capacities.html" },
                        { id: "sf-services", title: "Services", icon: "list", href: "setup-services.html" },
                        { id: "sf-age-groups", title: "Age Groups", icon: "users", href: "setup-age-groups.html" },
                        { id: "sf-languages", title: "Languages", icon: "globe", href: "setup-languages.html" },
                        { id: "sf-banks", title: "Banks", icon: "revenue", href: "setup-banks.html" },
                        { id: "sf-support-categories", title: "Support Categories", icon: "headset", href: "setup-support-categories.html" },
                    ],
                },
                {
                    id: "locations",
                    title: "Locations",
                    icon: "pin",
                    children: [
                        { id: "loc-countries", title: "Countries", icon: "globe", href: "locations-countries.html" },
                        { id: "loc-states", title: "States", icon: "pin", href: "locations-states.html" },
                        { id: "loc-cities", title: "Cities", icon: "pin", href: "locations-cities.html" },
                    ],
                },
                {
                    id: "marketing",
                    title: "Marketing",
                    icon: "megaphone",
                    children: [
                        { id: "mk-promo-codes", title: "Promo Codes", icon: "ticket", href: "marketing-promo-codes.html" },
                        { id: "mk-partner-promo-codes", title: "Partner's Promo Codes", icon: "ticket", href: "marketing-partner-promo-codes.html" },
                        { id: "mk-advertisements", title: "Advertisement Management", icon: "megaphone", href: "marketing-advertisements.html" },
                    ],
                },
                {
                    id: "design-system-admin",
                    title: "Design System",
                    icon: "puzzle",
                    children: [
                        { id: "dsa-systems", title: "Design Systems", icon: "layers", href: "design-systems.html" },
                        { id: "dsa-pages", title: "Design System Pages", icon: "layout", href: "design-system-pages.html" },
                        { id: "dsa-access", title: "Design System Access", icon: "lock", href: "design-system-access.html" },
                    ],
                },
                {
                    id: "notifications",
                    title: "Notifications",
                    icon: "bell",
                    children: [
                        { id: "nt-settings", title: "Notifications Settings", icon: "gear", href: "notifications-settings.html" },
                        { id: "nt-partners", title: "Partners", icon: "hotel", href: "notifications-partners.html" },
                        { id: "nt-users", title: "Users", icon: "users", href: "notifications-users.html" },
                    ],
                },
                {
                    id: "pages-content",
                    title: "Pages Content",
                    icon: "layout",
                    children: [
                        { id: "pc-pages", title: "Pages", icon: "layout", href: "pages-content-pages.html" },
                        { id: "pc-help-center", title: "Help Center", icon: "info", href: "pages-content-help-center.html" },
                    ],
                },
                { id: "settings", title: "Settings", icon: "gear", href: "settings.html" },
                { id: "activities-contacts", title: "Activities Contacts", icon: "mail", href: "activities-contacts.html" },
            ],
        },
        /* The design-system documentation lives in the same shell but is a
       different world — one pinned group, visually set apart (ds flag). */
        {
            label: "Design System",
            ds: true,
            items: [
                { id: "foundations", title: "Foundations", icon: "layers", href: "foundations.html", badge: "DS" },
                { id: "components", title: "Components", icon: "layout", href: "components.html", badge: "DS" },
                { id: "templates", title: "Templates", icon: "box", href: "templates.html", badge: "DS" },
            ],
        },
    ];

    RD.leaves = (items) =>
        items.flatMap((it) =>
            it.children ? RD.leaves(it.children) : [it],
        ); /* parents expand recursively to leaf pages */
    RD.NAV_FULL =
        RD.NAV; /* unfiltered catalogue — RD.applyPermissions rebinds RD.NAV to a
    subset below; every renderer reads RD.NAV live at paint time, so reassigning it later
    (once /auth/me resolves) is safe. */

    /* ---- permission gating: nav id -> Design System Pages catalogue key.
     The Super Admin design system is the backend's THIRD system (slug
     "superadmin", beside "partner" and "user"); its page keys must be
     created in the Super Admin dashboard under Design System → Design System
     Pages before an account can see these pages. One key per TOP-LEVEL menu
     row — a key guards that row and every child under it, exactly the way
     the dashboard's own sidebar gates whole sections.

     Ids absent from this map carry no gate. "dashboard" is the baseline,
     always granted. The documentation group is gated behind the single
     "design-system" key, same as the Partner system. */
    const NAV_PERM = {
        dashboard: "dashboard",
        partners: "partners",
        "partner-services": "partner-services",
        units: "units",
        packages: "packages",
        users: "users",
        "public-events": "public-events",
        bookings: "bookings",
        "multi-booking": "multi-booking",
        comments: "comments",
        employees: "employees",
        financials: "financials",
        wallet: "wallet",
        activities: "activities",
        subscriptions: "subscriptions",
        "setup-files": "setup-files",
        locations: "locations",
        marketing: "marketing",
        "design-system-admin": "design-system-admin",
        notifications: "notifications",
        "pages-content": "pages-content",
        settings: "settings",
        "activities-contacts": "activities-contacts",
        foundations: "design-system",
        components: "design-system",
        templates: "design-system",
    };
    /* Pages whose ctx.activeId is NOT a nav row id (none yet — kept so a
       detail page can map itself to its section's key). Keyed by activeId. */
    const PAGE_PERM = {};
    function filterNavItems(items, allowed) {
        return items
            .filter((it) => {
                const key = NAV_PERM[it.id];
                return !key || allowed.has(key);
            })
            .map((it) =>
                it.children
                    ? Object.assign({}, it, {
                          children: filterNavItems(it.children, allowed),
                      })
                    : it,
            );
    }
    /* Rebinds RD.NAV/RD.FLAT to the subset of RD.NAV_FULL the given permissions unlock.
     Called once at boot with a cached/default set (first paint, no flash of unauthorized
     items) and again once GET /auth/me resolves with the real, server-resolved list. */
    /* The permission set actually in force = the server-resolved list plus this
     deck's AC-mandated "dashboard" baseline. One place, so the nav filter and
     the deep-link guard can never disagree about what a session holds. */
    function effectivePermissions(permissions) {
        const allowed = new Set(permissions || []);
        allowed.add("dashboard");
        return allowed;
    }
    /* The design system this session resolved to (null on the older flat
     backend that returned no `systems`). */
    RD.currentSystem = function () {
        if (window.HF && HF.session && HF.session.system) return HF.session.system;
        return window.API && API.activeSystem ? API.activeSystem() : null;
    };
    RD.hasPermission = function (key, permissions) {
        return effectivePermissions(
            permissions || RD.currentPermissions(),
        ).has(key);
    };
    RD.applyPermissions = function (permissions) {
        const allowed = effectivePermissions(permissions);
        RD.NAV = RD.NAV_FULL.map((g) =>
            Object.assign({}, g, { items: filterNavItems(g.items, allowed) }),
        ).filter((g) => g.items.length);
        RD.FLAT = RD.NAV.flatMap((g) =>
            RD.leaves(g.items).map((it) =>
                Object.assign({ group: g.label }, it),
            ),
        );
    };
    /* Resolves the permission key guarding a page, given the ctx.activeId it
     passes to RD.boot:
       1. the id's own nav key, or a page key for a page with no nav row
          (scheduling-*.html, finance.html — see PAGE_PERM);
       2. otherwise the nearest permissioned ANCESTOR, e.g. leaf "m-branches" ->
          its "management" parent's key;
       3. null when the id is in no catalogue at all, or carries no gate. */
    RD.permKeyForActiveId = function (id) {
        if (!id) return null;
        if (NAV_PERM[id]) return NAV_PERM[id];
        if (PAGE_PERM[id]) return PAGE_PERM[id];
        let chain = null;
        RD.NAV_FULL.forEach((g) => {
            const walk = (items, trail) =>
                items.forEach((it) => {
                    const next = trail.concat([it]);
                    if (it.id === id) chain = next;
                    if (it.children) walk(it.children, next);
                });
            walk(g.items, []);
        });
        if (!chain) return null;
        for (let i = chain.length - 1; i >= 0; i--)
            if (NAV_PERM[chain[i].id]) return NAV_PERM[chain[i].id];
        return null;
    };
    /* Best-known permission list for this tab: the live session if /auth/me already
     resolved this boot, else whatever this tab last confirmed (sessionStorage), else
     the safe "dashboard only" default. Re-derived (not just read once) so a later
     re-filter — e.g. arInit() re-deriving RD.NAV after translating RD.NAV_FULL — always
     reflects the most current permission set instead of silently resetting it. */
    RD.currentPermissions = function () {
        if (window.HF && HF.session && HF.session.permissions)
            return HF.session.permissions;
        try {
            /* Either store: api.js writes the selected system's permissions
               beside the token, which lives in localStorage for a "remember me"
               sign-in and sessionStorage otherwise. */
            const c = JSON.parse(
                localStorage.getItem("hf_permissions") ||
                    sessionStorage.getItem("hf_permissions") ||
                    "null",
            );
            if (c) return c;
        } catch (e) {}
        return ["dashboard"];
    };
    /* Pages that don't load assets/js/api.js (e.g. archived revisions/ snapshots) never
     get their RD.NAV narrowed — unchanged, pre-integration behaviour. Pages that do load
     it start from a safe "dashboard only" default (or whatever this tab last confirmed
     via /auth/me) until the access guard inside RD.boot (see enforceAccess() further
     down this file) confirms the real list. */
    if (window.API) {
        RD.applyPermissions(RD.currentPermissions());
    } else {
        RD.FLAT = RD.NAV.flatMap((g) =>
            RD.leaves(g.items).map((it) =>
                Object.assign({ group: g.label }, it),
            ),
        );
    }
    const SECTION_ICON = {
        "Design System": "layers",
    };
    const QUICKLINK_IDS = [
        "partners",
        "bookings",
        "users",
        "packages",
        "financials",
    ];
    /* Resolve nav ids for flat surfaces (quicklinks, mobile bar). A parent with no
     page of its own resolves to its first leaf so it still gets a working href. */
    RD.navPick = (ids) =>
        ids
            .map((id) => {
                let node;
                const walk = (items) =>
                    items.forEach((it) => {
                        if (it.id === id) node = it;
                        if (it.children) walk(it.children);
                    });
                RD.NAV.forEach((g) => walk(g.items));
                if (!node) return null;
                const href = node.href || (RD.leaves([node])[0] || {}).href;
                const ids = [node.id].concat(
                    RD.leaves([node]).map((l) => l.id),
                ); /* self + descendants, for active-state */
                return href
                    ? {
                          id: node.id,
                          title: node.title,
                          icon: node.icon,
                          href,
                          ids,
                      }
                    : null;
            })
            .filter(Boolean);

    function navLink(it, activeId, dense) {
        /* Parent item → in-place accordion, nests to any depth
       (Customers → HighFive/Walk-in · Scheduling → Branch → Units).
       Open only when a descendant is currently active; otherwise collapsed
       by default. Deliberately NOT persisted (owner correction — it used to
       remember the last choice across page loads via localStorage, which
       read as "stuck open" since every click elsewhere never re-collapsed
       it) — clicking the toggle only affects the current page view. */
        if (it.children) {
            /* A parent counts as active when a DESCENDANT matches — or when
               the page names the parent itself. The second half was missing,
               and it is the case the whole Packages module uses: 74 pages
               boot with activeId "packages", which is the accordion, not a
               leaf. Without this they highlight nothing and the group stays
               collapsed on every package screen. */
            const descActive =
                it.id === activeId ||
                RD.leaves([it]).some((c) => c.id === activeId);
            const open = descActive;
            return `<div class="nav-parent${open ? " is-open" : ""}" data-navp="${it.id}">
        <button class="nav-link nav-parent__toggle${descActive ? " is-active" : ""}" type="button" aria-expanded="${open}">
          <span class="nav-ic">${ic(it.icon)}</span><span>${it.title}</span>${ic("chevronDown")}
        </button>
        <div class="nav-parent__items">${it.children.map((c) => navLink(c, activeId, dense)).join("")}</div>
      </div>`;
        }
        return `<a class="nav-link ${it.id === activeId ? "is-active" : ""}" href="${it.href}" ${it.id === activeId ? 'aria-current="page"' : ""}>
      <span class="nav-ic">${ic(it.icon)}</span><span>${it.title}</span>${it.badge ? `<span class="nav-badge${it.badge === "DS" ? " nav-badge--ds" : ""}">${it.badge}</span>` : ""}
    </a>`;
    }
    /* Reads the live session (set by RD.__enforceAccess once GET /auth/me resolves,
     #2526) and falls back to the design-system's default demo identity when no
     session exists yet (page without api.js, or the very first paint before /me
     resolves) — keeps every reference/preview page working exactly as before. */
    function currentProfile() {
        const p = (window.HF && HF.session && HF.session.profile) || null;
        const name = (p && p.name) || "---";
        const initials = name
            .trim()
            .split(/\s+/)
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
        const dash = (v) => (v == null || v === "" ? "---" : v);
        return {
            name,
            initials,
            avatar: p && p.avatar,
            email: dash(p && p.email),
            phone: dash(p && ((p.phone_code || "") + (p.phone || ""))),
            job: dash(p && (p.job && p.job.name ? p.job.name : p.job)),
            country: dash(p && (p.country && p.country.name ? p.country.name : p.country)),
        };
    }
    /* pages that greet the signed-in partner by name (the dashboard hero) need
       the same model the sidebar row and topbar avatar use — and need to know
       when it arrives, since /auth/me resolves after first paint (see the
       "hf:session" event dispatched in enforceAccess). */
    RD.currentProfile = currentProfile;
    const avatarInner = (p) =>
        p.avatar
            ? `<img src="${p.avatar}" alt="" style="width:100%;height:100%;border-radius:inherit;object-fit:cover">`
            : p.initials;
    /* Sidebar footer — the Super Admin's SidebarFooter: a muted version line,
       no user card (the user lives in the topbar). The collapsed (icon-only)
       sidebar shows the version alone — .sidebar__ver-full / __ver-short in app.css. */
    const userFoot = () => {
        const ar = document.documentElement.dir === "rtl";
        return `<div class="sidebar__ver t-xs text-tertiary" style="text-align:center;padding:var(--space-4) var(--space-3)">
          <span class="sidebar__ver-full">${ar ? "بواسطة هاي فايف - اصدار 1.0.0" : "powered by high five - v 1.0.0"}</span>
          <span class="sidebar__ver-short" translate="no">v 1.0.0</span></div>`;
    };
    /* Support — pinned below the menu tree on every sidebar style (mirrors the
     partner app's SidebarFooter: a headset button that opens a small flyout,
     not a Management submenu row — see .claude-rules research). ADO #2868
     grows the flyout from the single "Contact Us" form into two pages: New
     Ticket (the same form, renamed) and My Tickets — see features/support-
     tickets/. The unread count (HighFive replies / status changes the
     partner hasn't opened yet) rides the same .nav-badge the rest of the
     nav uses; a static demo number stands in for GET /support/tickets'
     unread_count until the API is wired. */
    const SUPPORT_UNREAD = 2;
    const supportFoot = () => `<div class="sidebar__support">
    <button class="sidebar__support-btn" id="supportBtn" type="button" aria-haspopup="true" aria-expanded="false">
      <span class="nav-ic">${ic("headset")}</span><span class="sidebar__support-label">Support</span>${SUPPORT_UNREAD ? `<span class="nav-badge">${SUPPORT_UNREAD}</span>` : ""}<span class="sidebar__support-chevron">${ic("chevronDown")}</span>
    </button>
    <div class="menu" id="supportMenu" role="menu">
      <a class="menu__item" role="menuitem" href="support.html">${ic("mail")}<span>New Ticket</span></a>
      <a class="menu__item" role="menuitem" href="features/support-tickets/us1-my-tickets-list.html">${ic("ticket")}<span>My Tickets</span>${SUPPORT_UNREAD ? `<span class="nav-badge">${SUPPORT_UNREAD}</span>` : ""}</a>
    </div>
  </div>`;
    const brand = (compact) => `<div class="sidebar__brand" ${compact ? 'style="justify-content:center;padding:var(--space-5) 0"' : ""}>
    <a class="sidebar__logo" href="index.html" style="display:flex;align-items:center;justify-content:${compact ? "center" : "flex-start"};gap:10px;color:var(--color-primary-ink);font-weight:700">
      <span style="display:inline-flex;width:26px;height:22px;flex-shrink:0">${LOGO_MARK()}</span>
      ${compact ? "" : '<span class="sidebar__logo-text">HighFive</span>'}
    </a>
  </div>`;

    /* =====================================================================
     SIDEBAR RENDERERS - 5 styles, one NAV model
     ===================================================================== */
    const SIDEBAR_NAMES = [
        "Grouped",
        "Icon flyout",
        "Two-tier",
        "Top tabs",
        "Search-first",
    ];

    function sbGrouped(ctx) {
        /* The DS group is an accordion: open automatically while you're inside
       the docs, collapsed otherwise. Deliberately NOT persisted (owner
       correction — it used to remember the last choice across page loads
       via localStorage, which read as "stuck open"); clicking the toggle
       only affects the current page view, same non-persistence policy as
       the Identity switcher above it. */
        const activeInDs = RD.NAV.some(
            (g) => g.ds && g.items.some((it) => it.id === ctx.activeId),
        );
        const dsOpen = activeInDs;
        return `<button class="sidebar__collapse" id="collapseBtn" aria-label="Collapse sidebar">${ic("chevronLeft")}</button>
      ${brand(false)}
      <nav class="sidebar__scroll" aria-label="Product">
        ${RD.NAV.map((g) =>
            g.ds
                ? `
          <div class="nav-group nav-group--ds${dsOpen ? " is-open" : ""}" id="dsGroup">
            <button class="nav-group__label nav-group__toggle" id="dsToggle" aria-expanded="${dsOpen}">${g.label}${ic("chevronDown")}</button>
            <div class="nav-group__items">${g.items.map((it) => navLink(it, ctx.activeId)).join("")}<div id="dsFeatures"></div></div>
          </div>`
                : `
          <div class="nav-group">${g.label ? `<div class="nav-group__label">${g.label}</div>` : ""}${g.items.map((it) => navLink(it, ctx.activeId)).join("")}</div>`,
        ).join("")}
      </nav>
      ${userFoot()}`;
    }

    function sbFlyout(ctx) {
        return `${brand(true)}
      <nav class="sidebar__scroll" style="padding-top:var(--space-3)">
        ${RD.NAV.map(
            (g) => `
          <div class="rd-flyout-group${g.ds ? " rd-flyout-group--ds" : ""}">
            <div class="rd-flyout-trigger" tabindex="0"><span class="nav-ic">${ic(g.items[0].icon)}</span></div>
            <div class="rd-flyout-panel"><b>${g.label}</b>${RD.leaves(g.items)
                .map(
                    (it) =>
                        `<a class="${it.id === ctx.activeId ? "is-active" : ""}" href="${it.href}">${ic(it.icon)}${it.title}</a>`,
                )
                .join("")}</div>
          </div>`,
        ).join("")}
      </nav>
      <div class="sidebar__user" style="justify-content:center;padding:var(--space-3)"><span class="sidebar__user-avatar">HA</span></div>`;
    }

    function sbTwotier(ctx) {
        const activeSection = Math.max(
            0,
            RD.NAV.findIndex(
                (g) =>
                    /* same rule as navLink: the page may name a parent */
                    g.items.some((it) => it.id === ctx.activeId) ||
                    RD.leaves(g.items).some((it) => it.id === ctx.activeId),
            ),
        );
        return `<div class="rd-twotier-rail">
        ${RD.NAV.map((g, i) => `<button data-sec="${i}" class="${i === activeSection ? "is-active" : ""}" aria-label="${g.label}" title="${g.label}">${ic(SECTION_ICON[g.label] || "box")}</button>`).join("")}
      </div>
      <div class="rd-twotier-panel" id="twotierPanel">${twotierPanelHTML(activeSection, ctx.activeId)}</div>`;
    }
    function twotierPanelHTML(sectionIdx, activeId) {
        const g = RD.NAV[sectionIdx];
        return `<div class="rd-twotier-panel__title">${g.label}</div>${g.items.map((it) => navLink(it, activeId)).join("")}`;
    }

    function sbSearchFirst(ctx) {
        return `${brand(false)}
      <nav class="sidebar__scroll">
        <div class="rd-sb-search">${ic("search")}<input type="text" placeholder="Jump to a page…" aria-label="Jump to a page"></div>
        <div class="nav-group">${RD.FLAT.map((it) => navLink(it, ctx.activeId)).join("")}</div>
      </nav>
      ${userFoot()}`;
    }

    function topTabsHTML(ctx) {
        return `<nav class="rd-toptabs" aria-label="Product">${RD.FLAT.map((it) => `<a class="${it.id === ctx.activeId ? "is-active" : ""}" href="${it.href}">${ic(it.icon)}${it.title}</a>`).join("")}</nav>`;
    }

    const SIDEBAR_RENDER = [
        sbGrouped,
        sbFlyout,
        sbTwotier,
        () => "",
        sbSearchFirst,
    ];
    const SIDEBAR_CLASS = [
        "",
        "rd-sb--flyout",
        "rd-sb--twotier",
        "",
        "rd-sb--searchfirst",
    ];

    /* =====================================================================
     TOPBAR RENDERERS - 5 styles
     ===================================================================== */
    const TOPBAR_NAMES = [
        "Standard",
        "Compact",
        "Centered",
        "Quick-links",
        "Minimal",
    ];
    const TOPBAR_HEIGHT = [64, 52, 64, "auto", 52];

    const mobileBtn = () =>
        `<button class="icon-btn topbar__mobile" id="menuBtn" aria-label="Open navigation">${ic("menu")}</button>`;
    /* Account menu — mirrors the Super Admin HeaderUserMenu (Account Settings ·
     Sign out). The avatar is its trigger; the .menu popover portals
     to <body> on open (see wireAccountMenu). */
    const acctMenu = (avatarSize) => {
        const p = currentProfile();
        const ar = document.documentElement.dir === "rtl";
        const L = (en, arTxt) => (ar ? arTxt : en);
        const row = (label, val) =>
            `<div class="row between gap-3 t-sm" style="padding:var(--space-2) var(--space-3)"><b>${label}</b><span class="text-tertiary">${val}</span></div>`;
        return `<span class="rd-acct" style="position:relative;display:inline-flex">
    <button class="row gap-2" id="acctBtn" aria-haspopup="true" aria-expanded="false" aria-label="Account" style="align-items:center">
      <span class="avatar avatar--${avatarSize || "sm"}">${avatarInner(p)}</span><b class="t-sm rd-acct__name">${p.name}</b>
    </button>
    <div class="menu" id="acctMenu" role="menu" style="min-width:275px">
      <div class="menu__head"><span class="row gap-3" style="align-items:center">
        <span class="avatar">${avatarInner(p)}</span>
        <span class="stack" style="flex:1;min-width:0"><b>${p.name}</b><span class="t-xs text-tertiary">${p.email}</span></span>
        <button class="icon-btn" type="button" aria-label="${L("Edit profile", "تعديل الملف")}">${ic("edit")}</button>
      </span></div>
      ${row(L("Email:", "البريد الإلكتروني:"), p.email)}
      ${row(L("phone:", "الهاتف:"), p.phone)}
      ${row(L("job:", "الوظيفة:"), p.job)}
      ${row(L("country:", "البلد:"), p.country)}
      <div style="height:1px;background:var(--color-border-subtle);margin:var(--space-1) var(--space-2)"></div>
      <button class="menu__item is-danger" role="menuitem" id="acctSignout">${ic("lock")}<span>${L("Sign Out", "تسجيل الخروج")}</span></button>
    </div>
  </span>`;
    };
    /* Topbar actions: language + dark-mode toggles (owner request — out in the
       topbar, not inside the user menu), then the Super Admin's own bell
       (a link to Notifications with an unread count) and user block. */
    const NOTIF_COUNT = 3;
    const themeAndBell = (avatarSize) => `
    <button class="icon-btn" id="dirBtn" aria-label="${document.documentElement.dir === "rtl" ? "English" : "العربية"}" title="${document.documentElement.dir === "rtl" ? "English" : "العربية"}" aria-pressed="false">${ic("globe")}</button>
    <button class="icon-btn" id="themeBtn" aria-label="Toggle theme"></button>
    <a class="icon-btn" id="notifBtn" href="notifications.html" aria-label="Notifications" style="position:relative;color:${NOTIF_COUNT ? "var(--color-primary)" : "inherit"}">${ic("bell")}${NOTIF_COUNT ? `<span class="rd-notif-count">${NOTIF_COUNT}</span>` : ""}</a>
    ${acctMenu(avatarSize)}`;

    function tbStandard() {
        return `<div class="rd-navbar rd-navbar--standard">
      ${mobileBtn()}
      <span class="grow"></span>${themeAndBell()}
    </div>`;
    }
    function tbCompact(ctx) {
        return `<div class="rd-navbar rd-navbar--compact">
      ${mobileBtn()}
      <span class="rd-navbar__title">${ctx.title || ""}</span>
      <span class="grow"></span>
      ${themeAndBell("xs")}
    </div>`;
    }
    function tbCentered() {
        return `<div class="rd-navbar rd-navbar--centered">
      <span class="rd-navbar__side">${mobileBtn()}</span>
      <span class="rd-navbar__brand" style="color:var(--color-primary-ink)"><span style="display:inline-flex;width:20px;height:17px">${LOGO_MARK()}</span> HighFive</span>
      <span class="rd-navbar__side rd-navbar__side--end">${themeAndBell()}</span>
    </div>`;
    }
    function tbQuicklinks(ctx) {
        const items = RD.navPick(QUICKLINK_IDS);
        return `<div class="rd-navbar rd-navbar--quicklinks">
      ${mobileBtn()}
      <nav class="rd-navbar__quicklinks">${items.map((it) => `<a href="${it.href}" class="${it.ids.includes(ctx.activeId) ? "is-active" : ""}">${it.title}</a>`).join("")}</nav>
      <span class="grow"></span>${themeAndBell()}
    </div>`;
    }
    function tbMinimal() {
        return `<div class="rd-navbar rd-navbar--minimal" id="minimalNavbar">
      ${mobileBtn()}
      <span class="grow"></span>
      ${themeAndBell()}
    </div>`;
    }
    const TOPBAR_RENDER = [
        tbStandard,
        tbCompact,
        tbCentered,
        tbQuicklinks,
        tbMinimal,
    ];

    /* =====================================================================
     APPLY + PERSIST
     ===================================================================== */
    function readStyle(key, max) {
        const v = parseInt(localStorage.getItem(key), 10);
        return isNaN(v) || v < 0 || v >= max ? 0 : v;
    }
    function writeStyle(key, v) {
        try {
            localStorage.setItem(key, v);
        } catch (e) {}
    }

    function applyTopbar(idx, ctx) {
        const mount = document.getElementById("topbarMount");
        if (!mount) return;
        mount.className = "topbar";
        mount.style.height =
            TOPBAR_HEIGHT[idx] === "auto" ? "auto" : TOPBAR_HEIGHT[idx] + "px";
        mount.innerHTML = TOPBAR_RENDER[idx](ctx);
        wireTopbar();
        /* phone-width app header shows the same profile as the topbar avatar —
       repaint it in lockstep with every chrome repaint (enforceAccess re-calls
       applyTopbar once GET /auth/me resolves the real profile). No-op until
       initMobileAppHeader has mounted it. */
        syncMobileAppHeader();
    }
    function applySidebar(idx, ctx) {
        const app = document.getElementById("app");
        const mount = document.getElementById("sidebarMount");
        const tabs = document.getElementById("topTabsMount");
        if (!app || !mount) return;
        app.classList.toggle("rd-no-sidebar", idx === 3);
        app.classList.toggle(
            "rd-sb-rail",
            idx === 1,
        ); /* icon rail is 76px — content must expand */
        mount.className = "sidebar " + SIDEBAR_CLASS[idx];
        mount.innerHTML =
            idx === 3 ? "" : SIDEBAR_RENDER[idx](ctx);
        if (tabs) tabs.innerHTML = idx === 3 ? topTabsHTML(ctx) : "";
        wireSidebar(idx, ctx);
    }

    function wireTopbar() {
        const theme = document.getElementById("themeBtn");
        if (theme) {
            const sync = () => {
                theme.innerHTML =
                    document.documentElement.getAttribute("data-theme") ===
                    "dark"
                        ? ic("sun")
                        : ic("moon");
            };
            sync();
            theme.addEventListener("click", () => {
                const t =
                    document.documentElement.getAttribute("data-theme") ===
                    "dark"
                        ? "light"
                        : "dark";
                document.documentElement.setAttribute("data-theme", t);
                writeStyle("rd-theme", t === "dark" ? 1 : 0);
                sync();
            });
        }
        const dirBtn = document.getElementById("dirBtn");
        if (dirBtn) {
            const syncDir = () =>
                dirBtn.setAttribute(
                    "aria-pressed",
                    document.documentElement.dir === "rtl",
                );
            syncDir();
            dirBtn.addEventListener("click", () => {
                const rtl = document.documentElement.dir !== "rtl";
                writeStyle("rd-dir", rtl ? "1" : "0");
                /* Reload rather than flip `dir` live: switching TO Arabic needs
           arInit() (nav-model translation + a one-way DOM text walk via
           arabize()) which only ever runs once, at RD.boot() - and switching
           BACK to English has no clean live "undo" for that same one-way
           text-node rewrite. A reload re-runs RD.boot() with the value just
           persisted above, so the whole page - nav labels, page copy, RTL
           layout - is correct on first paint instead of only after a manual
           refresh. */
                location.reload();
            });
        }
        const menu = document.getElementById("menuBtn");
        if (menu)
            menu.addEventListener("click", () =>
                document.getElementById("app").classList.toggle("nav-open"),
            );

        /* account menu — portal the popover to <body>, position under the avatar */
        const acctBtn = document.getElementById("acctBtn");
        const acctMenuEl = document.getElementById("acctMenu");
        if (acctBtn && acctMenuEl) {
            const closeAcct = () => {
                acctMenuEl.classList.remove("is-open");
                acctBtn.setAttribute("aria-expanded", "false");
            };
            acctBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const isOpen = acctMenuEl.classList.contains("is-open");
                if (isOpen) return closeAcct();
                RD.portalMenu(acctMenuEl);
                acctMenuEl.classList.add("is-open");
                RD.positionMenu(acctMenuEl, acctBtn, "end");
                acctBtn.setAttribute("aria-expanded", "true");
            });
            document.addEventListener("click", (e) => {
                if (!acctMenuEl.contains(e.target) && e.target !== acctBtn)
                    closeAcct();
            });
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") closeAcct();
            });
            const signout = document.getElementById("acctSignout");
            if (signout)
                signout.addEventListener("click", () => {
                    closeAcct();
                    RD.toast("info", "Signing out…");
                    /* login-live.html is the real, backend-wired login (login.html is the static
           view-only reference) — see redirectToLogin() above. */
                    const done = () =>
                        setTimeout(
                            () => (location.href = "login-live.html"),
                            600,
                        );
                    /* POST /auth/logout — invalidates the session server-side (#2525 AC); the local
           token is cleared either way so the client can't keep acting as this user. */
                    if (window.API) API.logout().then(done, done);
                    else done();
                });
        }
        const searchToggle = document.getElementById("searchToggleBtn");
        const minimalBar = document.getElementById("minimalNavbar");
        if (searchToggle && minimalBar) {
            searchToggle.addEventListener("click", () => {
                minimalBar.classList.add("search-open");
                const input = minimalBar.querySelector("#searchInput");
                if (input) input.focus();
            });
            minimalBar.addEventListener("focusout", (e) => {
                if (!minimalBar.contains(e.relatedTarget))
                    minimalBar.classList.remove("search-open");
            });
        }
    }

    function wireSidebar(idx) {
        ensureFeatures(); /* nested Features accordion (re-renders on style switch) */
        /* Collapsible parent nav items (e.g. Customers) */
        document
            .querySelectorAll("[data-navp] > .nav-parent__toggle")
            .forEach((btn) => {
                btn.addEventListener("click", () => {
                    const grp = btn.closest("[data-navp]");
                    const open = grp.classList.toggle("is-open");
                    btn.setAttribute("aria-expanded", open);
                });
            });
        const dsToggle = document.getElementById("dsToggle");
        if (dsToggle) {
            dsToggle.addEventListener("click", () => {
                const open = document
                    .getElementById("dsGroup")
                    .classList.toggle("is-open");
                dsToggle.setAttribute("aria-expanded", open);
            });
        }
        const collapseBtn = document.getElementById("collapseBtn");
        if (collapseBtn) {
            const app = document.getElementById("app");
            try {
                if (localStorage.getItem("rd-collapsed") === "1")
                    app.classList.add("is-collapsed");
            } catch (e) {}
            collapseBtn.addEventListener("click", () => {
                const on = app.classList.toggle("is-collapsed");
                writeStyle("rd-collapsed", on ? "1" : "0");
            });
        }
        if (idx === 2) {
            document
                .querySelectorAll(".rd-twotier-rail button")
                .forEach((b) => {
                    b.addEventListener("click", () => {
                        document
                            .querySelectorAll(".rd-twotier-rail button")
                            .forEach((x) =>
                                x.classList.toggle("is-active", x === b),
                            );
                        document.getElementById("twotierPanel").innerHTML =
                            twotierPanelHTML(+b.dataset.sec, RD.__activeId);
                    });
                });
        }

        /* Support flyout — opens upward since the trigger sits at the sidebar's
       bottom edge; portaled to <body> so it can't be clipped by the
       scrollable nav above it. */
        const supportBtn = document.getElementById("supportBtn");
        const supportMenu = document.getElementById("supportMenu");
        if (supportBtn && supportMenu) {
            const closeSupport = () => {
                supportMenu.classList.remove("is-open");
                supportBtn.setAttribute("aria-expanded", "false");
            };
            supportBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (supportMenu.classList.contains("is-open"))
                    return closeSupport();
                RD.portalMenu(supportMenu);
                supportMenu.classList.add("is-open");
                const r = supportBtn.getBoundingClientRect();
                Object.assign(supportMenu.style, {
                    position: "fixed",
                    insetInlineEnd: "auto",
                    top: "auto",
                    left: r.left + "px",
                    bottom: window.innerHeight - r.top + 6 + "px",
                    minWidth: r.width + "px",
                });
                supportBtn.setAttribute("aria-expanded", "true");
            });
            document.addEventListener("click", (e) => {
                if (!supportMenu.contains(e.target) && e.target !== supportBtn)
                    closeSupport();
            });
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") closeSupport();
            });
        }
    }

    /* =====================================================================
     FLOATING STYLE SWITCHER + DEVICE PREVIEW
     ===================================================================== */
    function fabPanelHTML(navIdx, sbIdx, device) {
        const opt = (name, i, active, dataAttr) =>
            `<button class="fab-opt ${i === active ? "is-on" : ""}" data-${dataAttr}="${i}"><span class="fab-opt__swatch">${ic("layout")}</span>${name}</button>`;
        return `
      <div class="fab-panel__group"><b>Navbar style</b><div class="fab-panel__opts">${TOPBAR_NAMES.map((n, i) => opt(n, i, navIdx, "navstyle")).join("")}</div></div>
      <div class="fab-panel__group"><b>Sidebar style</b><div class="fab-panel__opts">${SIDEBAR_NAMES.map((n, i) => opt(n, i, sbIdx, "sbstyle")).join("")}</div></div>
      <div class="fab-panel__group"><b>Preview device</b><div class="fab-panel__device">
        <button class="${device === "desktop" ? "is-on" : ""}" data-device="desktop">${ic("desktop")}Desktop</button>
        <button class="${device === "tablet" ? "is-on" : ""}" data-device="tablet">${ic("tablet")}Tablet</button>
        <button class="${device === "mobile" ? "is-on" : ""}" data-device="mobile">${ic("mobile")}Mobile</button>
      </div></div>
      <div class="fab-panel__group"><b>Density</b><div class="fab-panel__device">
        <button class="${readStyle("rd-density", 2) !== 1 ? "is-on" : ""}" data-density-opt="0">${ic("layout")}Comfortable</button>
        <button class="${readStyle("rd-density", 2) === 1 ? "is-on" : ""}" data-density-opt="1">${ic("menu")}Compact</button>
      </div></div>
      <div class="fab-panel__foot">Navbar and sidebar choices apply on every page in this project and are saved to this browser. Device preview is per-visit.</div>`;
    }

    function applyDevice(mode) {
        const stage = document.getElementById("deviceStage");
        if (!stage) return;
        if (mode === "desktop") {
            document.body.classList.remove("device-active");
            stage.classList.remove("is-active");
            stage.innerHTML = "";
            return;
        }
        document.body.classList.add("device-active");
        stage.classList.add("is-active");
        const label =
            mode === "tablet"
                ? "Tablet preview · 834 × 1112"
                : "Mobile preview · 390 × 844";
        const sep = location.href.indexOf("?") > -1 ? "&" : "?";
        stage.innerHTML = `<div>
      <div class="device-frame__label">${label}</div>
      <div class="device-frame device-frame--${mode}"><iframe src="${location.pathname}${sep}rdpreview=1" title="Device preview"></iframe></div>
    </div>`;
    }

    function initFab(ctx) {
        if (document.getElementById("fabBtn")) return;
        const btn = document.createElement("button");
        btn.className = "fab";
        btn.id = "fabBtn";
        btn.setAttribute(
            "aria-label",
            "Switch navbar, sidebar or preview device",
        );
        btn.innerHTML = ic("layout");
        const panel = document.createElement("div");
        panel.className = "fab-panel";
        panel.id = "fabPanel";
        document.body.appendChild(btn);
        document.body.appendChild(panel);

        let device = "desktop";
        function redraw() {
            panel.innerHTML = fabPanelHTML(
                readStyle("rd-navbar-style", 5),
                readStyle("rd-sidebar-style", 5),
                device,
            );
        }
        redraw();

        btn.addEventListener("click", () => panel.classList.toggle("is-open"));
        document.addEventListener("click", (e) => {
            if (
                !panel.contains(e.target) &&
                e.target !== btn &&
                !btn.contains(e.target)
            )
                panel.classList.remove("is-open");
        });
        panel.addEventListener("click", (e) => {
            const nb = e.target.closest("[data-navstyle]");
            if (nb) {
                writeStyle("rd-navbar-style", nb.dataset.navstyle);
                applyTopbar(+nb.dataset.navstyle, ctx);
                redraw();
                return;
            }
            const sb = e.target.closest("[data-sbstyle]");
            if (sb) {
                writeStyle("rd-sidebar-style", sb.dataset.sbstyle);
                applySidebar(+sb.dataset.sbstyle, ctx);
                redraw();
                return;
            }
            const db = e.target.closest("[data-device]");
            if (db) {
                device = db.dataset.device;
                applyDevice(device);
                redraw();
                return;
            }
            const dn = e.target.closest("[data-density-opt]");
            if (dn) {
                writeStyle("rd-density", dn.dataset.densityOpt);
                applyDensity();
                redraw();
                return;
            }
        });
    }
    /* Floating utility stack, bottom-right (owner: "like a menu") — two
       buttons vertically above each other: switch-to-mobile (top) and the
       existing style FAB #fabBtn
       (bottom, from initFab). No theme button here — owner removed it; the
       topbar's own #themeBtn stays the theme toggle. The mobile link's
       matching "Switch to Web" lives on the mobile side (shared/options.js).
       Absolute path so it works from every page regardless of folder depth
       (some dashboard pages live in subfolders, e.g. features/, revisions/). */
    /* Per-page deep links to this feature's mobile counterpart — falls back to
     the mobile app's Home (main_screen) for every page with no match. Keyed
     by pathname so it works regardless of query string / hash. The reverse
     map (mobile -> web) lives beside the mobile "Switch to Web" link, in
     partner-mobile-in-web-design/shared/options.js. */
    const DEVICE_LINKS = {
        "/features/qr-scan-web/us1-scan-checkin-fullcases.html":
            "/partner-mobile-in-web-design/qr_scanner/index.html",
        "/bookings.html":
            "/partner-mobile-in-web-design/main_screen/index.html?tab=home",
    };
    function initDeviceSwitchButton() {
        if (!document.getElementById("deviceSwitchBtn")) {
            const a = document.createElement("a");
            a.id = "deviceSwitchBtn";
            a.href =
                DEVICE_LINKS[location.pathname] ||
                "/partner-mobile-in-web-design/main_screen/index.html";
            a.setAttribute("aria-label", "Switch to mobile app");
            a.title = "Mobile app";
            a.innerHTML =
                '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>';
            document.body.appendChild(a);
        }
    }

    function applyDensity() {
        if (readStyle("rd-density", 2) === 1)
            document.documentElement.setAttribute("data-density", "compact");
        else document.documentElement.removeAttribute("data-density");
    }

    /* =====================================================================
     COMMAND PALETTE (⌘K) - the topbar advertised it; now it exists.
     Items: every nav page + feature stories + shell actions. Filter is a
     case-insensitive substring over title + group (works in Arabic mode
     because arInit mutates the nav model before this reads it).
     registry: command-palette.md
     ===================================================================== */
    function initCmdk() {
        if (document.getElementById("rdCmdk")) return;
        const root = document.createElement("div");
        root.className = "rd-cmdk";
        root.id = "rdCmdk";
        root.innerHTML = `<div class="rd-cmdk__panel" role="dialog" aria-modal="true" aria-label="Command palette">
      <div class="rd-cmdk__head">${ic("search")}<input class="rd-cmdk__input" id="cmdkInput" type="text"
        placeholder="Type a command or search…" aria-label="Type a command or search"><kbd>Esc</kbd></div>
      <div class="rd-cmdk__list" id="cmdkList" role="listbox"></div>
      <div class="rd-cmdk__foot"><span><kbd>↑↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span></div>
    </div>`;
        document.body.appendChild(root);
        const input = root.querySelector("#cmdkInput");
        const list = root.querySelector("#cmdkList");
        let items = [],
            active = 0;

        function buildItems() {
            const pages = RD.FLAT.map((it) => ({
                icon: it.icon,
                label: it.title,
                crumb: it.group,
                run: () => {
                    location.href = it.href;
                },
            }));
            const stories = (
                window.HF && window.HF.FEATURES ? window.HF.FEATURES : []
            ).flatMap((f) =>
                f.stories.map((s) => ({
                    icon: "qrcode",
                    label: s.title,
                    crumb: f.name,
                    run: () => {
                        location.href = s.href;
                    },
                })),
            );
            const actions = [
                {
                    icon: "moon",
                    label: "Toggle theme",
                    crumb: "Action",
                    run: () =>
                        document.getElementById("themeBtn") &&
                        document.getElementById("themeBtn").click(),
                },
                {
                    icon: "globe",
                    label: "Toggle direction (العربية)",
                    crumb: "Action",
                    run: () =>
                        document.getElementById("dirBtn") &&
                        document.getElementById("dirBtn").click(),
                },
            ];
            return [
                { group: "Pages", items: pages },
                { group: "Features", items: stories },
                { group: "Actions", items: actions },
            ];
        }
        function renderList(q) {
            const query = (q || "").trim().toLowerCase();
            const groups = buildItems()
                .map((g) => ({
                    group: g.group,
                    items: g.items.filter(
                        (it) =>
                            !query ||
                            (it.label + " " + it.crumb)
                                .toLowerCase()
                                .includes(query),
                    ),
                }))
                .filter((g) => g.items.length);
            items = groups.flatMap((g) => g.items);
            active = 0;
            list.innerHTML = groups.length
                ? groups
                      .map(
                          (g) => `
        <div class="rd-cmdk__group">${g.group}</div>
        ${g.items
            .map(
                (
                    it,
                ) => `<button class="rd-cmdk__item" role="option" data-ci="${items.indexOf(it)}">
          ${ic(it.icon)}<span>${it.label}</span><span class="crumb">${it.crumb}</span></button>`,
            )
            .join("")}`,
                      )
                      .join("")
                : `<div class="rd-cmdk__empty">No results. Try a page name or an action.</div>`;
            paint();
        }
        function paint() {
            list.querySelectorAll(".rd-cmdk__item").forEach((el) =>
                el.classList.toggle("is-active", +el.dataset.ci === active),
            );
            const el = list.querySelector(".rd-cmdk__item.is-active");
            if (el) el.scrollIntoView({ block: "nearest" });
        }
        function open() {
            root.classList.add("is-open");
            input.value = "";
            renderList("");
            input.focus();
        }
        function close() {
            root.classList.remove("is-open");
        }
        RD.cmdk = open;

        document.addEventListener("keydown", (e) => {
            if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
                e.preventDefault();
                root.classList.contains("is-open") ? close() : open();
                return;
            }
            if (!root.classList.contains("is-open")) return;
            if (e.key === "Escape") {
                close();
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                active = Math.min(active + 1, items.length - 1);
                paint();
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                active = Math.max(active - 1, 0);
                paint();
            }
            if (e.key === "Enter" && items[active]) {
                close();
                items[active].run();
            }
        });
        input.addEventListener("input", () => renderList(input.value));
        list.addEventListener("click", (e) => {
            const el = e.target.closest("[data-ci]");
            if (el) {
                close();
                items[+el.dataset.ci].run();
            }
        });
        root.addEventListener("mousedown", (e) => {
            if (e.target === root) close();
        });

        /* the topbar search IS the palette trigger - one search surface, not two.
       Delegated (focusin bubbles) so it survives topbar style re-renders. */
        document.addEventListener("focusin", (e) => {
            if (e.target.id === "searchInput") {
                e.target.blur();
                open();
            }
        });
    }

    /* =====================================================================
     NOTIFICATIONS CENTER - inbox drawer behind the topbar bell. Sample
     items (the real product feeds this from the API); read state is
     per-visit. registry: notifications-center.md
     ===================================================================== */
    const NOTIFS = [
        {
            id: "n1",
            day: "Today",
            icon: "booking",
            title: "New Booking Request",
            body: "You Have A New Booking Request From Michael For N/A. Booking ID: 3447. Status: Pending Approval.",
            time: "10 Minutes Ago",
            unread: true,
        },
        {
            id: "n2",
            day: "Earlier",
            icon: "revenue",
            title: "New Booking (Online Payment)",
            body: "The User Michael Has Created The Booking Number 3435 At The Football Unit",
            time: "2 Weeks Ago",
            unread: true,
        },
        {
            id: "n3",
            day: "Earlier",
            icon: "warn",
            title: "Booking Cancellation",
            body: "The User Michael Has Canceled His Booking Number 3430 At The Football Unit.",
            time: "3 Weeks Ago",
            unread: false,
        },
        {
            id: "n4",
            day: "Earlier",
            icon: "booking",
            title: "New Booking (Cash Payment)",
            body: "The User Michael Has Created The Booking Number 3430 At The Football Unit",
            time: "3 Weeks Ago",
            unread: false,
        },
        {
            id: "n5",
            day: "Earlier",
            icon: "warn",
            title: "Booking Cancellation",
            body: "The User Mostafa Has Canceled His Booking Number 3384 At The Bowling Center Unit.",
            time: "1 Month Ago",
            unread: false,
        },
        {
            id: "n6",
            day: "Earlier",
            icon: "booking",
            title: "New Booking Request",
            body: "You Have A New Booking Request From Mousa For 2026-05-21 22:00. Booking ID: 3319. Status: Pending Approval.",
            time: "2 Months Ago",
            unread: false,
        },
        {
            id: "n7",
            day: "Earlier",
            icon: "users",
            title: "Public Event Leaving",
            body: "The User Yasmeen Test Has Left The Public Event Number 525 At The Bowling Center Unit",
            time: "2 Months Ago",
            unread: false,
        },
        {
            id: "n8",
            day: "Earlier",
            icon: "users",
            title: "Public Event Joining",
            body: "The User Yasmeen Test Has Joined The Public Event Number 525 At The Bowling Center Unit.",
            time: "2 Months Ago",
            unread: false,
        },
        {
            id: "n9",
            day: "Earlier",
            icon: "booking",
            title: "Multi Booking Booked",
            body: "The User Yasmeen Test Has Booked The Multi Booking Session Number 42615 At The Bowling Center Unit.",
            time: "2 Months Ago",
            unread: false,
        },
    ];
    function initNotif() {
        if (document.getElementById("rdNotif")) return;
        let notifs = NOTIFS.map((n) => Object.assign({}, n));
        const root = document.createElement("div");
        root.className = "rd-notif";
        root.id = "rdNotif";
        document.body.appendChild(root);

        /* query the bells fresh every time - topbar style switches re-render the
       topbar bell, and the phone app-header bell (#rdAppHeaderBell, see
       initMobileAppHeader) is re-rendered on every chrome repaint too */
        const syncDot = () => {
            const has = notifs.some((n) => n.unread);
            document
                .querySelectorAll("#notifBtn, #rdAppHeaderBell")
                .forEach((btn) => {
                    let dot = btn.querySelector(".rd-notif-dot");
                    if (has && !dot) {
                        dot = document.createElement("span");
                        dot.className = "rd-notif-dot";
                        btn.appendChild(dot);
                    }
                    if (!has && dot) dot.remove();
                });
        };
        /* the app header repaints its bell outside this closure — let it pull the
       dot back afterwards (see syncMobileAppHeader) */
        RD.__notifSyncDot = syncDot;
        function render() {
            const days = [...new Set(notifs.map((n) => n.day))];
            root.innerHTML = `<div class="rd-notif__scrim"></div>
        <div class="rd-notif__panel" role="dialog" aria-modal="true" aria-label="Notifications">
          <div class="rd-notif__head"><b>Notifications</b><span class="grow"></span>
            ${notifs.some((n) => n.unread) ? `<button class="rd-notif__mark" id="notifMarkAll">Mark all as read</button>` : ""}
            <button class="icon-btn" id="notifClose" aria-label="Close">${ic("close")}</button></div>
          <div class="rd-notif__list">
            ${
                notifs.length
                    ? days
                          .map(
                              (d) => `
              <div class="rd-notif__day">${d}</div>
              ${notifs
                  .filter((n) => n.day === d)
                  .map(
                      (n) => `
                <button class="rd-notif__item ${n.unread ? "" : "is-read"}" data-notif="${n.id}">
                  <span class="kpi-ic">${ic(n.icon)}</span>
                  <span class="rd-notif__body"><b>${n.title}</b><p>${n.body}</p><time>${n.time}</time></span>
                  <span class="rd-notif__unread"></span>
                </button>`,
                  )
                  .join("")}`,
                          )
                          .join("")
                    : `<div class="rd-notif__empty"><span class="kpi-ic">${ic("bell")}</span><b>You're all caught up</b><p>New booking, payment and waitlist activity will appear here.</p></div>`
            }
          </div>
          ${notifs.length ? `<div class="rd-notif__foot"><button id="notifClear">Clear all</button></div>` : ""}
        </div>`;
            syncDot();
        }
        const open = () => {
            render();
            root.classList.add("is-open");
        };
        const close = () => root.classList.remove("is-open");
        /* delegated: survives topbar re-renders; also re-attaches the unread dot
       right after a navbar style switch replaces the bell */
        document.addEventListener("click", (e) => {
            if (e.target.closest("#notifBtn, #rdAppHeaderBell")) {
                open();
                return;
            }
            if (e.target.closest("[data-navstyle]")) setTimeout(syncDot, 0);
        });
        root.addEventListener("click", (e) => {
            if (
                e.target.closest("#notifClose") ||
                e.target.classList.contains("rd-notif__scrim")
            ) {
                close();
                return;
            }
            if (e.target.closest("#notifMarkAll")) {
                notifs.forEach((n) => {
                    n.unread = false;
                });
                render();
                return;
            }
            if (e.target.closest("#notifClear")) {
                notifs = [];
                render();
                return;
            }
            const it = e.target.closest("[data-notif]");
            if (it) {
                const n = notifs.find((x) => x.id === it.dataset.notif);
                if (n) {
                    n.unread = false;
                    render();
                }
            }
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") close();
        });
        syncDot();
    }

    /* Thin top progress bar shown on every boot - masks the brief gap between
     navigation and the page's own content being ready, and gives page-to-page
     navigation a continuous feel instead of an abrupt pop-in. */
    RD.pageLoader = function () {
        const bar = document.createElement("div");
        bar.className = "rd-topload";
        bar.id = "rdTopload";
        document.body.appendChild(bar);
        requestAnimationFrame(() => {
            bar.style.width = "72%";
        });
        const finish = () => {
            bar.classList.add("is-done");
            setTimeout(() => bar.remove(), 450);
        };
        if (document.readyState === "complete") setTimeout(finish, 180);
        else
            window.addEventListener("load", () => setTimeout(finish, 120), {
                once: true,
            });
    };

    /* =====================================================================
     ARABIC MODE - choosing RTL also translates the UI.
     Layer 1: the nav model (sidebar / tab bar / quicklinks render Arabic natively).
     Layer 2: an exact-match vocabulary pass over rendered text, placeholders and
     aria-labels — re-applied via MutationObserver so re-rendered content
     (filter tabs, live tables) stays translated. Sample DATA (names, emails,
     venues) intentionally stays bilingual; the real product uses message
     catalogs (en/ar) per the architecture package.
     ===================================================================== */
    const AR_NAV = {
        /* labels verbatim from the Super Admin dashboard's own ar.json */
        dashboard: "لوحة القيادة",
        partners: "الشركاء",
        "partner-services": "قوائم وخدمات الشركاء",
        units: "الوحدات",
        packages: "الباقات",
        users: "المستخدمون",
        "public-events": "الأحداث العامة",
        "pe-list": "الأحداث العامة",
        "pe-joining-list": "قائمة الانضمام",
        bookings: "الحجوزات",
        "multi-booking": "جلسات الحجز المتعدد",
        comments: "جميع التعليقات",
        employees: "موظفين",
        "emp-list": "موظفين",
        "emp-jobs": "وظائف",
        "emp-activity-log": "سجل النشاط",
        financials: "البيانات المالية",
        wallet: "محفظة",
        activities: "أنشطة",
        subscriptions: "الاشتراكات",
        "setup-files": "ملفات الإعداد",
        "sf-types": "الأنواع",
        "sf-capacities": "السعة",
        "sf-services": "خدمات",
        "sf-age-groups": "الفئات العمرية",
        "sf-languages": "اللغات",
        "sf-banks": "البنوك",
        "sf-support-categories": "فئات الدعم",
        locations: "المواقع",
        "loc-countries": "الدول",
        "loc-states": "المحافظات",
        "loc-cities": "المدن",
        marketing: "تسويق",
        "mk-promo-codes": "رموز الترويج",
        "mk-partner-promo-codes": "رموز ترويج الشركاء",
        "mk-advertisements": "إدارة الإعلانات",
        "design-system-admin": "نظام التصميم",
        "dsa-systems": "أنظمة التصميم",
        "dsa-pages": "صفحات نظام التصميم",
        "dsa-access": "صلاحيات نظام التصميم",
        notifications: "إشعارات",
        "nt-settings": "إعدادات الإشعارات",
        "nt-partners": "الشركاء",
        "nt-users": "المستخدمون",
        "pages-content": "محتوى الصفحات",
        "pc-pages": "الصفحات",
        "pc-help-center": "مركز المساعدة",
        settings: "الإعدادات",
        "activities-contacts": "جهات اتصال الأنشطة",
        foundations: "الأساسيات",
        templates: "القوالب",
        components: "المكوّنات",
    };
    const AR_GROUPS = {
        "Design System": "نظام التصميم",
    };
    const AR_VOCAB = {
        /* shell */
        More: "المزيد",
        New: "جديد",
        Account: "الحساب",
        "Partner Admin": "مدير الشريك",
        /* page heads */
        Dashboard: "لوحة القيادة",
        Scheduling: "الجدولة",
        Bookings: "الحجوزات",
        Customers: "العملاء",
        Memberships: "العضويات",
        Marketing: "التسويق",
        Finance: "المالية",
        Reports: "التقارير",
        Administration: "الإدارة",
        Settings: "الإعدادات",
        "Future Page Templates": "قوالب الصفحات القادمة",
        Components: "المكوّنات",
        "New booking": "حجز جديد",
        "Welcome back, Hana! Here's what's happening across your venues today.":
            "أهلًا بعودتكِ يا هناء! هذا ما يحدث في منشآتك اليوم.",
        "Every reservation across every resource - search, filter, and act on one or many at once.":
            "كل حجز عبر كل مورد — ابحث ورشّح ونفّذ على حجز واحد أو عدة حجوزات دفعة واحدة.",
        "Every reservation, open session and public event across your venue - one grid, switchable by day, week, timeline or resource.":
            "كل حجز وجلسة مفتوحة وفعالية عامة في منشأتك — شبكة واحدة تتبدل باليوم أو الأسبوع أو الخط الزمني أو المورد.",
        "Every guest who has ever booked - tier, lifetime value and their most recent activity, one click from every reservation.":
            "كل ضيف حجز يومًا — فئته وقيمته الإجمالية وآخر نشاط له، على بُعد نقرة من أي حجز.",
        "The plans you sell and the members currently on them, side by side.":
            "الخطط التي تبيعها والأعضاء المشتركون فيها حاليًا، جنبًا إلى جنب.",
        "Every campaign driving bookings, with spend and reach against target.":
            "كل حملة تدفع الحجوزات، مع الإنفاق والوصول مقارنة بالمستهدف.",
        "Revenue, payouts and the channels driving them.":
            "الإيرادات والمدفوعات والقنوات التي تحركها.",
        "Saved reports for booking volume, occupancy and the funnel from browse to paid.":
            "تقارير محفوظة لحجم الحجوزات والإشغال ومسار التحويل من التصفح إلى الدفع.",
        "Staff, branches, permissions and the policies your front desk operates by.":
            "الموظفون والفروع والصلاحيات والسياسات التي يعمل بها مكتب الاستقبال.",
        "Business profile, notifications, hours and the tools High Five connects to.":
            "ملف المنشأة والإشعارات وساعات العمل والأدوات المتصلة بـ High Five.",
        "Pages the product doesn't need yet but will - built from the same components as everything else, ready to drop in when the time comes.":
            "صفحات لا يحتاجها المنتج بعد لكنه سيحتاجها — مبنية من المكوّنات ذاتها، وجاهزة للإضافة حين يحين وقتها.",
        "A working reference for the smaller form, feedback and overlay pieces every module ends up needing.":
            "مرجع عملي لعناصر النماذج والتنبيهات والطبقات الصغيرة التي تحتاجها كل وحدة في النهاية.",
        "Four steps: details, schedule, payment, confirm — the price stays visible the whole way.":
            "أربع خطوات: التفاصيل، الموعد، الدفع، التأكيد — والسعر ظاهر طوال الطريق.",
        /* common actions */
        Export: "تصدير",
        "View all": "عرض الكل",
        "View schedule": "عرض الجدول",
        "Show more": "عرض المزيد",
        "Add employee": "إضافة موظف",
        "Clear all": "مسح الكل",
        "Add filter": "إضافة مرشِّح",
        Back: "رجوع",
        Continue: "متابعة",
        Cancel: "إلغاء",
        Apply: "تطبيق",
        Today: "اليوم",
        "This week": "هذا الأسبوع",
        "This month": "هذا الشهر",
        Day: "يوم",
        Week: "أسبوع",
        Month: "شهر",
        Timeline: "الخط الزمني",
        "Timeline · Today": "الخط الزمني · اليوم",
        "All resources": "كل الموارد",
        Message: "مراسلة",
        "Full profile": "الملف الكامل",
        "New plan": "خطة جديدة",
        "Edit plan": "تعديل الخطة",
        "Most popular": "الأكثر شيوعًا",
        members: "عضوًا",
        /* docs mode */
        Foundations: "الأساسيات",
        "The raw material every component is built from — colors, type, space, elevation and icons, live from tokens.css.":
            "المادة الخام التي تُبنى منها كل المكوّنات — الألوان والخطوط والمسافات والظلال والأيقونات، حيّةً من tokens.css.",
        "Brand color scales": "تدرجات ألوان الهوية",
        "Semantic roles": "الأدوار الدلالية",
        Typography: "الخطوط",
        Spacing: "المسافات",
        "Radius & borders": "الحواف والإطارات",
        "Shadows & elevation": "الظلال والارتفاع",
        Iconography: "الأيقونات",
        Motion: "الحركة",
        "Design System Reference": "مرجع نظام التصميم",
        "What you see here is component documentation, not a product page.":
            "ما تراه هنا توثيقٌ للمكوّنات، وليس صفحةً من المنتج.",
        "Open the product ↗": "افتح المنتج ↗",
        /* statuses */
        All: "الكل",
        Confirmed: "مؤكد",
        Pending: "قيد الانتظار",
        "Checked in": "تم تسجيل الحضور",
        "Checked out": "تم تسجيل المغادرة",
        Completed: "مكتمل",
        Cancelled: "الملغى",
        Refunded: "مسترد",
        Waitlist: "قائمة الانتظار",
        Available: "متاح",
        Booked: "محجوز",
        Maintenance: "صيانة",
        Active: "نشط",
        Inactive: "غير نشط",
        "On leave": "في إجازة",
        "Open session": "جلسة مفتوحة",
        "Public event": "نشاط جماعي",
        Now: "الآن",
        Success: "نجاح",
        Refund: "استرداد",
        /* table headers & labels */
        Booking: "الحجز",
        Customer: "العميل",
        Activity: "النشاط",
        Venue: "المكان",
        "Date · Time": "التاريخ · الوقت",
        "Date · time": "التاريخ · الوقت",
        Amount: "المبلغ",
        Status: "الحالة",
        Resource: "المورد",
        "Resource Name": "اسم المورد",
        Type: "النوع",
        "Price · hr": "السعر · ساعة",
        Method: "طريقة الدفع",
        Employee: "الموظف",
        Role: "الدور",
        Branch: "الفرع",
        Email: "البريد الإلكتروني",
        Tier: "الفئة",
        "Last visit": "آخر زيارة",
        "Total bookings": "إجمالي الحجوزات",
        "Lifetime value": "القيمة الإجمالية",
        "Recent activity": "النشاط الأخير",
        /* dashboard */
        "Bookings overview": "نظرة عامة على الحجوزات",
        "Today's bookings": "حجوزات اليوم",
        "Active resources": "الموارد النشطة",
        "Revenue (7 days)": "الإيراد (7 أيام)",
        "Occupancy rate": "معدل الإشغال",
        /* finance */
        "Revenue trend": "اتجاه الإيراد",
        "Channel mix": "مزيج القنوات",
        "Recent payments": "آخر المدفوعات",
        "Revenue (MTD)": "الإيراد (منذ بداية الشهر)",
        "Payouts sent": "مدفوعات مُرسلة",
        Refunds: "المستردات",
        Outstanding: "مستحقات معلقة",
        /* booking flow / summary rail */
        Summary: "الملخص",
        Details: "التفاصيل",
        Schedule: "الموعد",
        Payment: "الدفع",
        Confirm: "تأكيد",
        Duration: "المدة",
        "Court rate": "سعر الملعب",
        Total: "الإجمالي",
        "Booking details": "تفاصيل الحجز",
        "Booking confirmed": "تم تأكيد الحجز",
        /* misc */
        Staff: "الموظفون",
        Branches: "الفروع",
        Policies: "السياسات",
        "Notes & permissions": "الملاحظات والصلاحيات",
        Members: "الأعضاء",
        Plans: "الخطط",
        reservations: "حجزًا",
        customers: "عميلًا",
        /* shell: command palette + notifications + density */
        Pages: "الصفحات",
        Features: "الميزات",
        Actions: "الإجراءات",
        "Toggle theme": "تبديل السمة",
        "Toggle direction (العربية)": "تبديل الاتجاه (English)",
        "No results. Try a page name or an action.":
            "لا توجد نتائج. جرّب اسم صفحة أو إجراء.",
        Navigate: "تنقّل",
        Open: "فتح",
        Notifications: "الإشعارات",
        "Mark all as read": "تعليم الكل كمقروء",
        "Clear all": "مسح الكل",
        Today: "اليوم",
        Yesterday: "أمس",
        Earlier: "سابقًا",
        "You're all caught up": "لا جديد لديك",
        "New booking, payment and waitlist activity will appear here.":
            "سيظهر هنا نشاط الحجوزات والمدفوعات وقوائم الانتظار الجديدة.",
        Density: "الكثافة",
        Comfortable: "مريح",
        Compact: "مضغوط",
        /* templates page list + email viewer + POS */
        "Email templates": "قوالب البريد الإلكتروني",
        "POS / Checkout": "نقطة البيع / الدفع",
        "Open standalone ↗": "فتح مستقل ↗",
        English: "English",
        Login: "تسجيل الدخول",
        "404 / Error": "‏404 / خطأ",
        "Empty state": "حالة فارغة",
        "Invoice / Receipt": "فاتورة / إيصال",
        "QR check-in code": "رمز QR لتسجيل الحضور",
        "Packages / bundles": "الباقات والحزم",
        Onboarding: "جولة التعريف",
        Chat: "المحادثات",
        /* feature: Bookings check-in audit (#2510) */
        "Check-in date": "تاريخ التسجيل",
        "Scan status": "حالة المسح",
        "Checked-in": "تم تسجيل الحضور",
        "Not checked-in": "لم يُسجَّل",
        "Not yet": "لم يُسجَّل بعد",
        Coming: "القادمة",
        Past: "السابقة",
        Unit: "الوحدة",
        Sort: "الترتيب",
        Reset: "إعادة تعيين",
        "Created At": "تاريخ الإنشاء",
        "Start At · End At": "يبدأ · ينتهي",
        Users: "المستخدمون",
        Action: "إجراء",
        View: "عرض",
        "View details": "عرض التفاصيل",
        "Single booking": "حجز فردي",
        "Flexible session": "جلسة مرنة",
        "Multi Booking": "حجز متعدد",
        "Public Event": "نشاط جماعي",
        "Check-in details": "تفاصيل التسجيل",
        Scanned: "تم المسح",
        "Not scanned": "لم يُمسح",
        Tickets: "التذاكر",
        Ticket: "التذكرة",
        Holder: "حامل التذكرة",
        "Joined users": "المستخدمون المنضمّون",
        Participant: "المشارك",
        "Checked in by": "سُجِّل بواسطة",
        Time: "الوقت",
        Method: "الطريقة",
        "QR scan": "مسح QR",
        Manual: "يدوي",
        "Scanned at": "تم المسح في",
        "Not checked in yet": "لم يتم تسجيل الحضور بعد",
        "View / audit only — bookings are not reversible here.":
            "للعرض / التدقيق فقط — لا يمكن التراجع عن الحجوزات هنا.",
        "No bookings match these filters.":
            "لا توجد حجوزات مطابقة لهذه المرشِّحات.",
        "Try widening the check-in date or clearing filters.":
            "جرّب توسيع تاريخ التسجيل أو مسح المرشِّحات.",
        "Select a booking to see its check-in breakdown.":
            "اختر حجزًا لعرض تفصيل تسجيله.",
        "All branches": "كل الفروع",
        "All types": "كل الأنواع",
        "Branch · Unit": "الفرع · الوحدة",
        "All bookings": "كل الحجوزات",
        "Last 7 days": "آخر 7 أيام",
        "Any time": "أي وقت",
        "Audit who checked in and when: a Check-in date filter plus a Scan status column on every booking. View / audit only — bookings are not reversible here.":
            "دقّقي من سجّل الوصول ومتى: مرشِّح تاريخ التسجيل بالإضافة إلى عمود حالة المسح على كل حجز. للعرض / التدقيق فقط — لا يمكن التراجع عن الحجوزات هنا.",
        "Check-in date filter & Scan status":
            "مرشِّح تاريخ التسجيل وحالة المسح",
        /* feature: Bookings check-in audit — attendee check-in modal (shipped into bookings.html) */
        "Check-in": "تسجيل الحضور",
        attendee: "حاضر",
        attendees: "حضور",
        "checked-in": "سُجِّل",
        "Just now": "الآن",
        "checked in.": "تم تسجيله.",
        "Check-in opens at": "يُفتح تسجيل الحضور في",
        /* feature: QR Scan (Partner Web) — #2503/#2506/#2507/#2508 */
        "QR Scan": "مسح QR",
        "QR Scan — Check-in": "مسح QR — تسجيل الحضور",
        "Check in customers by scanning a barcode or manual search — per employee permissions.":
            "تسجيل حضور العملاء بمسح الباركود أو البحث اليدوي — حسب صلاحيات الموظف.",
        "Scan barcode": "مسح الباركود",
        "Manual search": "بحث يدوي",
        "Scan mode": "وضع المسح",
        Register: "تسجيل",
        Review: "المراجعة",
        "Allow camera": "السماح باستخدام الكاميرا",
        Allow: "السماح",
        "Required to scan the customer barcode": "مطلوب لمسح باركود العميل",
        "Point the camera at the customer's QR code":
            "وجّه الكاميرا نحو رمز QR الخاص بالعميل",
        "Search by name, phone or booking ID":
            "ابحث بالاسم أو الهاتف أو رقم الحجز",
        "Recent check-ins": "آخر عمليات التسجيل",
        "Operations done today": "العمليات التي تمت اليوم",
        "By me": "بواسطتي",
        "By other staff": "بواسطة موظفين آخرين",
        "Check-in method": "طريقة التسجيل",
        "Barcode scan": "سكان بالباركود",
        "Manual check-in": "تسجيل يدوي",
        Reviewed: "تمت المراجعة",
        "Choose branch": "اختر الفرع",
        "Choose the branch you're checking in for to start scanning.":
            "اختَر الفرع الذي تُسجّل له لبدء المسح.",
        "Change branch": "تغيير الفرع",
        "Confirm check-in": "تأكيد الحضور",
        "Scan another": "مسح آخر",
        Retry: "إعادة المحاولة",
        "Employee permissions": "صلاحيات الموظف",
        "Branch setup": "إعداد الفرع",
        Immediate: "تسجيل فوري",
        "Confirmation required": "تأكيد مطلوب",
        "Employee branches": "فروع الموظف",
        "Multiple branches": "أكثر من فرع",
        "Single branch": "فرع واحد",
        "Scan result": "حالة المسح",
        "Reset simulator": "إعادة ضبط المحاكي",
        "This is a review simulator — not part of the product.":
            "هذا محاكٍ للمراجعة — ليس جزءًا من المنتج.",
        "message": "رسالة",
        "Public Events": "الأنشطة الجماعية",
        /* nav / account menu */
        "Lists and Services": "القوائم والخدمات",
        "Support": "الدعم الفني",
        "Contact Us": "اتصل بنا",
        "Company Profile": "حساب الشركة",
        "Account Settings": "إعدادات الحساب",
        "Sign out": "تسجيل الخروج",
        /* core CRUD / actions */
        "Save": "حفظ",
        "Edit": "تعديل",
        "Delete": "حذف",
        "Create": "إنشاء",
        "Update": "تحديث",
        "Add": "إضافة",
        "Search": "بحث",
        "Filter": "تصفية",
        "Close": "إغلاق",
        "Yes": "نعم",
        "No": "لا",
        "Submit": "أرسال",
        "Remove": "حذف",
        "Cancel": "إلغاء",
        "Select": "اختيار",
        "Actions": "الإجراءات",
        "Loading...": "جاري التحميل...",
        "OK": "موافق",
        /* auth pages */
        "Log in": "تسجيل الدخول",
        "Password": "كلمة المرور",
        "Full Name": "الاسم الكامل",
        "Phone number": "رقم الهاتف",
        "Company Name": "اسم الشركة",
        "Remember me": "تذكرني",
        "Don't have an account yet?": "ليس لديك حساب بعد؟",
        "Sign up": "سجل الان",
        "Verify": "التحقق",
        "Company": "الشركة",
        "Terms And Conditions": "الشروط والأحكام",
        "Previous": "السابق",
        "Next": "التالي",
        "Back to login": "الرجوع لتسجيل الدخول",
        "Set up new password": "تعيين كلمة مرور جديدة",
        "Verification Code": "رمز التحقق",
        "Resend": "اعادة إرسال",
        "Confirm Password": "تأكيد كلمة المرور",
        "Login successful": "تم تسجيل الدخول بنجاح",
        "Register successfully": "تم التسجيل بنجاح",
        "Documents": "المستندات",
        "Choose file": "اختر ملفًا",
        /* common form field labels */
        "Name": "الاسم",
        "Description": "الوصف",
        "Price": "السعر",
        "Phone Number": "رقم الهاتف",
        "Address": "العنوان",
        "City": "المدينة",
        "State": "المحافظة",
        "Country": "الدولة",
        "Start Date": "تاريخ البداية",
        "End Date": "تاريخ النهاية",
        "This field is required": "هذا الحقل مطلوب",
        /* status words */
        "Expired": "منتهي",
        "Not approved": "مرفوض",
        "Approved": "تمت الموافقة",
        "Paid": "مدفوع",
        "Unpaid": "غير مدفوع",
        "Partly paid": "مدفوع جزئيا",
        "Locked": "مقفل",
        "Unlocked": "غير مقفل",
        /* empty states */
        "There is no data to show right now": "لا يوجد بيانات لعرضها",
        "No data available": "لا توجد بيانات متاحة",
        "No results found": "لم يتم العثور على نتائج",
        /* pagination */
        "Page": "صفحة",
        "of": "من",
        "Rows per page": "صفوف لكل صفحة",
        /* dashboard */
        "Units": "الوحدات",
        "Contacts": "جهات الاتصال",
        "Employees": "الموظفين",
        /* Jobs (ADO #2565 employees-jobs.html + placeholder employees-jobs-permissions.html) */
        "Jobs": "الوظائف",
        "Add New Job": "إضافة وظيفة جديدة",
        "Edit Job": "تعديل الوظيفة",
        "Delete Job": "حذف الوظيفة",
        "Job Name": "اسم الوظيفة",
        "Enter job name": "أدخل اسم الوظيفة",
        "Enter job description": "أدخل وصف الوظيفة",
        "Status": "الحالة",
        "Active": "نشط",
        "Inactive": "غير نشط",
        "All": "الكل",
        "Search by job name": "بحث باسم الوظيفة",
        "Assign Permissions": "إسناد الصلاحيات",
        "Assign Permissions to Job": "إسناد الصلاحيات للوظيفة",
        "Save Permissions": "حفظ الصلاحيات",
        "Are you sure you want to delete this job?": "هل أنت متأكد أنك تريد حذف هذه الوظيفة؟",
        "Employees assigned to this job will lose the permissions it grants.": "الموظفون المسندون لهذه الوظيفة سيفقدون الصلاحيات التي تمنحها.",
        "Please enter a job name.": "الرجاء إدخال اسم الوظيفة.",
        "Job created successfully": "تم إنشاء الوظيفة بنجاح",
        "Job updated successfully": "تم تحديث الوظيفة بنجاح",
        "Job deleted successfully": "تم حذف الوظيفة بنجاح",
        "Cannot Delete Job": "لا يمكن حذف الوظيفة",
        "Permissions updated successfully": "تم تحديث الصلاحيات بنجاح",
        /* Assign Permissions to Job (ADO #2569) — permission groups/pages/actions */
        "Job Title": "المسمى الوظيفي",
        "Permission Groups": "مجموعات الصلاحيات",
        "Select permission groups": "اختر مجموعات الصلاحيات",
        "Select a permission group above to configure its pages and actions.": "اختر مجموعة صلاحيات أعلاه لضبط صفحاتها وإجراءاتها.",
        "Bookings & Public Events": "الحجوزات والفعاليات العامة",
        "Membership": "العضوية",
        "Membership (Partner)": "العضوية (الشريك)",
        "Notification": "الإشعارات",
        "Notifications": "الإشعارات",
        "Management": "الإدارة",
        "Multi-Booking Sessions": "جلسات الحجز المتعدد",
        "Walk-In": "حضور مباشر",
        "HighFive Users": "مستخدمو هاي فايف",
        "Partner Users": "مستخدمو الشريك",
        "Members": "الأعضاء",
        "View Dashboard": "عرض لوحة التحكم",
        "View Dated Schedule": "عرض الجدول بالتاريخ",
        "Add Public Event": "إضافة نشاط جماعي",
        "View Booking Details": "عرض تفاصيل الحجز",
        "Cancel Booking and Public Event": "إلغاء الحجز والنشاط الجماعي",
        "Collect": "تحصيل",
        "Delete Payment History": "حذف سجل الدفع",
        "Confirm Booking": "تأكيد الحجز",
        "Booking Approval": "الموافقة على الحجز",
        "Delete Booking": "حذف الحجز",
        "View Walk-In Customers List": "عرض قائمة عملاء الحضور المباشر",
        "Edit Walk-In Customer": "تعديل عميل الحضور المباشر",
        "View HighFive Users List": "عرض قائمة مستخدمي هاي فايف",
        "Block Booking and Public Event": "حظر الحجز والنشاط الجماعي",
        "View Partner Users List": "عرض قائمة مستخدمي الشريك",
        "View Employees List": "عرض قائمة الموظفين",
        "Add Employee": "إضافة موظف",
        "Activity Log": "سجل النشاط",
        "View Jobs List": "عرض قائمة الوظائف",
        "Add Job": "إضافة وظيفة",
        "View Members List": "عرض قائمة الأعضاء",
        "Add Member": "إضافة عضو",
        "End Membership": "إنهاء العضوية",
        "View Request Membership List": "عرض قائمة طلبات العضوية",
        "Update Membership Request": "تحديث طلب العضوية",
        "View Expired Membership List": "عرض قائمة العضويات المنتهية",
        "View Coupons": "عرض الكوبونات",
        "Add Coupon": "إضافة كوبون",
        "View Coupon Usage": "عرض استخدام الكوبون",
        "Delete Coupon": "حذف الكوبون",
        "View Financials": "عرض الماليات",
        "View Transaction Details": "عرض تفاصيل المعاملة",
        "View Notification": "عرض الإشعارات",
        "Add Notification": "إضافة إشعار",
        "Delete Notification": "حذف إشعار",
        "View Page": "عرض الصفحة",
        "Edit and Translate": "تعديل وترجمة",
        "Add Branch": "إضافة فرع",
        "View Units List": "عرض قائمة الوحدات",
        "Add Unit": "إضافة وحدة",
        "Update Unit": "تحديث الوحدة",
        "View / Create / Edit Schedules": "عرض / إنشاء / تعديل الجداول",
        "Delete Temporary Schedule": "حذف الجدول المؤقت",
        "Add / Edit / Delete Session": "إضافة / تعديل / حذف الجلسة",
        "Copy Session": "نسخ الجلسة",
        "View Coming Bookings": "عرض الحجوزات القادمة",
        "View Coming Public Event": "عرض النشاط الجماعي القادم",
        "View List": "عرض القائمة",
        "Toggle Coordinator's Contact": "تفعيل/تعطيل بيانات تواصل المنسق",
        "Delete Assigned Employee": "حذف الموظف المُسند",
        "View Booking Methodology": "عرض طريقة الحجز",
        "Update Booking Method": "تحديث طريقة الحجز",
        "View Comments": "عرض التعليقات",
        "Request Deletion": "طلب الحذف",
        "View Assigned Services": "عرض الخدمات المعينة",
        "Add / Edit Assigned Services List": "إضافة / تعديل قائمة الخدمات المعينة",
        "View Service Lists": "عرض قوائم الخدمات",
        "Edit List": "تعديل القائمة",
        "Walk-in": "عملاء مباشرين",
        "High Five Customers": "عملاء هاي فايف",
        "Partner Customers": "عملاء الشريك",
        "Coming Booking (High Five)": "الحجوزات القادمة (هاي فايف)",
        "Coming Public Events": "الفعاليات العامة القادمة",
        "Coming Booking (Partner)": "الحجوزات القادمة (الشريك)",
        "Your account is under review. The High Five team will contact you to activate your account":
            "حسابك قيد المراجعة. سيتواصل معك فريق High Five لتفعيل حسابك.",
        /* bookings list */
        "Branch / Unit": "الفرع / الوحدة",
        "Category / Activity": "الفئة / النشاط",
        "Start At / End At": "يبدأ في / ينتهي في",
        "Online": "عبر الإنترنت",
        "Linked": "مرتبط",
        "Online Flexible Slot Session": "جلسة فترة مرنة أونلاين",
        "Pending Approval": "في انتظار الموافقة",
        "All Branches": "جميع الفروع",
        "All Units": "جميع الوحدات",
        "All Types": "جميع الأنواع",
        "Latest bookings": "أحدث الحجوزات",
        "Nearest bookings": "أقرب الحجوزات",
        "booked": "محجوز",
        "joined": "منضم",
        "There is no data to show": "لا توجد بيانات لعرضها",
        /* booking details pages */
        "Session Information": "معلومات الجلسة",
        "App Type": "نوع التطبيق",
        "User Type": "نوع المستخدم",
        "Payment Method": "طريقة الدفع",
        "Payment Status": "حالة الدفع",
        "Collect": "تحصيل",
        "Collecet": "تحصيل",
        "Reject": "رفض",
        "Approve": "قبول",
        "Start Meeting": "بدء الاجتماع",
        "Break down": "تفاصيل",
        "Total Amount": "المبلغ الإجمالي",
        "Coupon code": "رمز الكوبون",
        "Paid from Coupon": "مدفوع من الكوبون",
        "Date and Time": "التاريخ والوقت",
        "Cancel Booking": "إلغاء الحجز",
        "View Details Booking": "تفاصيل الحجز",
        "Additional Services": "خدمات إضافية",
        "Mobile number": "رقم الجوال",
        "Booked By": "حجزه",
        "Booked At": "وقت الحجز",
        "Gender": "الجنس",
        "Age Group": "الفئة العمرية",
        "Summery": "الملخص",
        "Booked For": "محجوز باسم",
        /* scheduling module */
        "Dated Schedule": "جدول بالتاريخ",
        "Flexible Dated Schedule": "جدول مرن بالتاريخ",
        "Weekly Schedule": "الجدول الاسبوعي",
        "Sunday": "الأحد",
        "Monday": "الاثنين",
        "Tuesday": "الثلاثاء",
        "Wednesday": "الأربعاء",
        "Thursday": "الخميس",
        "Friday": "الجمعة",
        "Saturday": "السبت",
        "Select Branch": "اختر الفرع",
        "Select Unit": "اختر الوحدة",
        "Previous week": "الأسبوع السابق",
        "Next week": "الأسبوع التالي",
        "Flexible Session": "جلسة مرنة",
        "Male": "ذكر",
        "Female": "أنثى",
        "Male & Female": "ذكر وأنثى",
        "Session Type": "نوع الجلسة",
        "Single Booking": "حجز واحد",
        "Cash": "نقدي",
        "Max Capacity": "الحد الأقصى للسعة",
        "Max Tickets per User": "الحد الأقصى للتذاكر لكل مستخدم",
        "Show More": "عرض المزيد",
        "Unit Services": "خدمات الوحدة",
        "Book": "حجز",
        "Remaining": "المتبقي",
        "Select an option": "اختر خيارًا",
        "Number of Reservations": "عدد الحجوزات",
        /* branches / units module */
        "ID": "المعرف",
        "State, City": "المحافظة، المدينة",
        "Not Approved": "مرفوض",
        "Maintains": "غير متاح",
        "Add New Branch": "اضافة فرع جديد",
        "Save Branch": "حفظ الفرع",
        "General Information": "بيانات عامة",
        "Location Information": "معلومات الموقع",
        "Branch Name": "اسم الفرع",
        "Unit Name": "اسم الوحدة",
        "Street and district": "الشارع والحي",
        "Search for address": "البحث عن العنوان",
        "Search location": "بحث عن الموقع",
        "Onsite": "حضوري",
        "Main Category": "الفئة الرئيسية",
        "Main Activity": "النشاط الرئيسي",
        "Capacity": "السعه",
        "Address in Arabic": "العنوان بالعربية",
        "Address in English": "العنوان بالإنجليزية",
        "Selected city area": "المنطقة المحددة",
        "Units Management": "ادارة الوحدات",
        "Session Management": "ادارة الجلسات",
        "Assigned Employees": "الموظفين",
        "Booking Methodology": "طريقة الحجز",
        "rating": "التقييم",
        "comment": "التعليق",
        "created date": "تاريخ الإنشاء",
        "coordinator's Contact": "جهة اتصال المنسق",
        "assign employee": "تعيين موظف",
        "walk in only": "حجز مباشر فقط",
        "online booking": "الحجز عبر الإنترنت",
        "edit contacts": "تعديل جهات الاتصال",
        "edit policy": "تعديل السياسة",
        "create temporary schedule": "انشاء جلسة مؤقتة",
        "period": "المدة",
        "status": "الحالة",
        /* customers module */
        "Gender - Age": "الجنس - العمر",
        "Block Booking": "حظر الحجز",
        "Block Public Event": "حظر النشاط الجماعي",
        "Search By user or username": "البحث حسب المستخدم أو اسم المستخدم",
        "Walk-in Customers": "عملاء الحضور المباشر",
        "Phone": "رقم الهاتف",
        "Update customer info": "تحديث بيانات العميل",
        "Please enter your Name": "الرجاء إدخال اسمك",
        "Wallet": "المحفظة",
        "Upcoming": "القادم",
        "Active member": "عضو نشط",
        "Lifetime spend": "إجمالي الإنفاق",
        "No-shows": "عدم الحضور",
        "Member since": "عضو منذ",
        "Activity timeline": "سجل النشاط",
        "Notes": "ملاحظات",
        "Manage membership": "إدارة العضوية",
        "Add credit": "إضافة رصيد",
        "Add note": "إضافة ملاحظة",
        /* employees module */
        "Delete Employee": "حذف الموظف",
        "Create Employee": "انشاء موظف",
        "Edit Employee": "تعديل الموظف",
        "Please confirm that you want to remove this user from the field.":
            "يرجى تأكيد رغبتك في إزالة هذا المستخدم من الحقل.",
        "Verified": "تم التحقق",
        "Confirm password": "تأكيد كلمة المرور",
        "A verification code has been sent to:": "تم إرسال رمز التحقق إلى:",
        "Resend Code": "إعادة إرسال الرمز",
        "Set Password": "تعيين كلمة المرور",
        "Phone Verification": "التحقق من الهاتف",
        "Change Password": "تغيير كلمة المرور",
        "Leave blank to keep the current password.":
            "اتركه فارغًا للاحتفاظ بكلمة المرور الحالية.",
        /* marketing / coupons module */
        "Coupons": "الكوبونات",
        "Ended": "منتهي",
        "Code": "الكود",
        "Fixed": "ثابت",
        "Percentage": "نسبة مئوية",
        "Unlimited": "غير محدود",
        "there is no data yet": "لا توجد بيانات بعد",
        "New Coupon": "كوبون جديد",
        "Discount Type": "نوع الخصم",
        "Expiry Date": "تاريخ الانتهاء",
        "Back To Coupons": "العودة إلى الكوبونات",
        "Bookings list": "قائمة الحجوزات",
        "Joining List": "قائمة الانضمام",
        "Max Amount": "الحد الأقصى",
        "Usage / Limit": "الاستخدام / الحد",
        "Total Discount Amount": "إجمالي مبلغ الخصم",
        "Coupon Amount": "مبلغ الكوبون",
        "Coupon created successfully": "تم إنشاء الكوبون بنجاح",
        "Code:": "الكود:",
        "Description:": "الوصف:",
        "Status:": "الحالة:",
        "Schedules": "المواعيد",
        /* memberships module */
        "Expired Membership": "العضوية المنتهية",
        "Request Membership": "طلبات العضوية",
        "Search By User Or Username or Reference Number":
            "ابحث بالاسم او اسم المستخدم او رقم المرجع او رقم الهاتف",
        "Categories": "التصنيفات",
        "User will not be able to book from your private units":
            "لا يمكنك حجز من وحدتك الخاصة.",
        "Rejection will remove the request and the user will be able to send another request again.":
            "الرفض سيتم حذف الطلب وسيتم تفعيله مرة أخرى.",
        "category": "التصنيف",
        "I have an active membership": "لدي عضوية نشطة",
        "Reference Number": "الرقم المرجعي",
        "New Membership": "عضوية جديدة",
        /* policies module */
        "Units POLICY": "سياسة الوحدات",
        "Who can book?": "من يمكنه الحجز؟",
        "Booking Frequency": "تكرار الحجز",
        "Customized": "مخصص",
        "Requires Approval": "يتطلب الموافقة",
        "Approval Duration": "مدة الموافقة",
        "Cancellation policy": "سياسة الإلغاء",
        "Fees for cancellation": "رسوم الإلغاء",
        "Cash payment": "الدفع النقدي",
        "Free cancellation": "إلغاء مجاني",
        "Auto-confirm time": "وقت التأكيد الآلي",
        "Receive bookings time control": "التحكم في وقت تلقي الحجوزات",
        "Hours Before End Time": "ساعات قبل وقت الانتهاء",
        "Policy created successfully!": "تم إنشاء السياسة بنجاح!",
        "Policy updated successfully": "تم تحديث السياسة بنجاح",
        "Number of linked units": "عدد الوحدات المرتبطة",
        /* feature: Packages > Policies (US3) — the packages module's own policy
           list, distinct from Management > Policies above */
        "Number of linked packages": "عدد الباقات المرتبطة",
        "There is no created policy yet.": "لا يوجد سياسة مُنشأة بعد.",
        "Confirmation Message": "رسالة التأكيد",
        "Please confirm that you want to remove this policy.":
            "يرجى تأكيد رغبتك في إزالة هذه السياسة.",
        "Enter name": "أدخل الاسم",
        "Public": "عام",
        "Send Request": "إرسال طلب",
        "Members Only": "الأعضاء فقط",
        "Select duration": "اختر المدة",
        "Policy deleted successfully": "تم حذف السياسة بنجاح",
        /* finance / payment / tax */
        "Financials": "المالية",
        "Filter": "تصفية",
        "Year": "السنة",
        "Payment Type": "نوع الدفع",
        "Transaction Type": "نوع المعاملة",
        "Revenue": "العائد",
        "Collected": "التحصيلات",
        "Cash & Online": "الدفع النقدي والإلكتروني",
        "Does not require online payment agreement":
            "لا يتطلب موافقة الدفع على الانترنت",
        "Requires online payment agreement": "يتطلب موافقة الدفع على الانترنت",
        "Tax Included": "الضريبة مشمولة",
        "Tax Excluded": "الضريبة غير مشمولة",
        "Not Applicable for Tax (Default)": "غير قابل للضريبة (افتراضي)",
        "Payment Settings": "إعدادات الدفع",
        "Tax Settings": "إعدادات الضريبة",
        "Payment method updated successfully!": "تم تحديث طريقة الدفع بنجاح!",
        "Tax settings updated successfully!": "تم تحديث إعدادات الضريبة بنجاح!",
        "Transaction Of": "معاملات",
        "For Unit": "للوحدة",
        "For all units": "لجميع الوحدات",
        /* services / categories module */
        "Assign Service Lists": "تعيين قوائم الخدمات",
        "Edit Services Assignment": "تعديل تخصيص الخدمات",
        "Assigned Services": "الخدمات المعينة",
        "Category Management": "ادارة التصنيفات",
        "name": "الاسم",
        "No. of branches": "عدد الفروع",
        "No. of units": "عدد الوحدات",
        "Create Category": "انشاء تصنيف",
        "My Lists and Services": "قوائمي وخدماتي",
        "Service Lists": "قوائم الخدمات",
        "Create List": "إنشاء قائمة",
        "Default": "افتراضي",
        "Single": "فردي",
        "Multiple": "متعدد",
        "Service Name": "اسم الخدمة",
        "Back to all lists": "العودة إلى جميع القوائم",
        /* profile / company-profile */
        "Verify Email": "التحقق من البريد الإلكتروني",
        "Update phone": "تحديث الهاتف",
        "Full name": "الاسم الكامل",
        "Update Email": "تحديث البريد الإلكتروني",
        "Personal information": "المعلومات الشخصية",
        "Security": "الأمان",
        "Not Verified": "لم يتم التحقق",
        "Activate Email": "تفعيل البريد الإلكتروني",
        "Old Password": "كلمة المرور القديمة",
        "New Password": "كلمة المرور الجديدة",
        "About": "نبذة",
        /* reports.html */
        "Jan": "يناير",
        "Feb": "فبراير",
        "Mar": "مارس",
        "Apr": "أبريل",
        "May": "مايو",
        "Jun": "يونيو",
        "Jul": "يوليو",
        "Aug": "أغسطس",
        "Sep": "سبتمبر",
        "Oct": "أكتوبر",
        "Nov": "نوفمبر",
        "Dec": "ديسمبر",
        "Mon": "الاثنين",
        "Tue": "الثلاثاء",
        "Wed": "الأربعاء",
        "Thu": "الخميس",
        "Fri": "الجمعة",
        "Sat": "السبت",
        "Sun": "الأحد",
        "Bookings by month": "الحجوزات حسب الشهر",
        "Occupancy heatmap": "خريطة الإشغال الحرارية",
        "Booking funnel": "مسار تحويل الحجز",
        "Customer retention": "معدل الاحتفاظ بالعملاء",
        "Viewed activity": "مشاهدة النشاط",
        "Selected a time slot": "اختيار موعد",
        "Started checkout": "بدء الدفع",
        "Paid & confirmed": "مدفوع ومؤكد",
        "Jan cohort": "فوج يناير",
        "Feb cohort": "فوج فبراير",
        "Mar cohort": "فوج مارس",
        /* administration / settings / contacts / support */
        "Roles & permissions": "الأدوار والصلاحيات",
        "Manager": "المدير",
        "Integrations": "التكاملات",
        "Language": "اللغة",
        "Connected": "متصل",
        "Manage": "إدارة",
        "Connect": "ربط",
        "What is contact": "ما هو جهة الاتصال",
        "phone": "رقم الهاتف",
        "Update contact": "تحديث جهة اتصال",
        "There is no contacts found": "لا توجد جهات اتصال",
        "Subcategory": "التنصيف الفرعي",
        "Send": "إرسال",
        "Select a category": "اختر التصنيف",
        /* shard 1 — booking-new.html */
        "Payment method": "طريقة الدفع",
        "Pay at venue": "الدفع في الفرع",
        "Send the e-ticket to the customer by WhatsApp":
            "إرسال التذكرة الإلكترونية للعميل عبر واتساب",
        "The slot is held while you complete payment. Cancellation is free up to 12h before.":
            "يتم حجز الفترة مؤقتًا حتى تكمل عملية الدفع. الإلغاء مجاني حتى 12 ساعة قبل الموعد.",
        "Back to bookings": "العودة إلى الحجوزات",
        "HF-24816 · Padel - Court A · Thu, Jul 23 · 6:00 PM · 90 min":
            "HF-24816 · Padel - Court A · الخميس، 23 يوليو · 6:00 م · 90 دقيقة",
        "Thu, Jul 23 · 6:00 PM": "الخميس، 23 يوليو · 6:00 م",
        "Pick a slot — Thursday, Jul 23": "اختر موعدًا — الخميس، 23 يوليو",
        "Evening availability": "المواعيد المتاحة مساءً",
        "Greyed slots are already booked on Court A.":
            "الفترات الرمادية محجوزة بالفعل في Court A.",
        "Check-in from": "تسجيل الحضور من",
        "Check-in to": "تسجيل الحضور إلى",
        "Bookings Check-in Audit": "تدقيق تسجيل حضور الحجوزات",
        "New in Booking: a Scan status column and a Check-in date filter to audit who checked in and when. View / audit only.":
            "جديد في الحجوزات: عمود لحالة المسح ومرشح لتاريخ تسجيل الحضور لمراجعة من سجّل حضوره ومتى. للعرض والمراجعة فقط.",
        /* shard 1 — bookings-details.html */
        "(Coming)": "(القادمة)",
        "(Pending)": "(قيد الانتظار)",
        "Type :": "النوع :",
        "Date :": "التاريخ :",
        "Start At :": "تبدأ في :",
        "End At :": "تنتهي في :",
        "Gender :": "الجنس :",
        "Price :": "السعر :",
        "Booking Status :": "حالة الحجز :",
        "App Type :": "نوع التطبيق :",
        "User Type :": "نوع المستخدم :",
        "Booked For :": "محجوز باسم :",
        "Mobile number :": "رقم الجوال :",
        "Booked By :": "حجزه :",
        "Booked At :": "وقت الحجز :",
        "Check-in Status :": "حالة تسجيل الحضور :",
        "Check-in Time :": "وقت تسجيل الحضور :",
        "Checked in by :": "سُجِّل بواسطة :",
        "Method :": "الطريقة :",
        "Payment Method :": "طريقة الدفع :",
        "Payment Status :": "حالة الدفع :",
        "Cancelation Fee :": "رسوم الالغاء :",
        "Base Price :": "السعر الاساسي :",
        "Total Session Price :": "إجمالي سعر الجلسة :",
        "Taxes :": "الضرائب :",
        "Additional Services :": "خدمات إضافية :",
        "Total Additional Services :": "إجمالي الخدمات الإضافية :",
        "Total :": "الإجمالي :",
        "Amount :": "المبلغ :",
        "Refund Note :": "ملاحظات الاسترداد :",
        "Session Information (#": "معلومات الجلسة (#",
        "Edited": "تم التعديل",
        "ONLINE": "عبر الإنترنت",
        "Single Session": "جلسة واحدة",
        "High Five user": "مستخدم High Five",
        "Click to start the online meeting": "انقر لبدء الاجتماع عبر الإنترنت",
        "Session has ended": "انتهت الجلسة",
        "You can start the meeting only at the scheduled time.":
            "يمكنك بدء الاجتماع فقط في الموعد المحدد.",
        "Checked in successfully": "تم تسجيل الحضور بنجاح",
        "Booking canceled successfully!": "تم الغاء الحجز بنجاح!",
        "Booking collected successfully!": "تم تحصيل الحجز بنجاح!",
        "Your booking has been approved.": "تمت الموافقة على حجزك.",
        "Your booking request has been rejected.": "تم رفض طلب الحجز الخاص بك.",
        "partly-Paid": "مدفوع جزئيا",
        "SAR": "ريال سعودي",
        /* shard 2 — bookings-details.html (Edit-session / Cancel-booking modals) */
        "Editing the time will update the cancellation policy to 100% refund at any time of cancellation":
            "تعديل الوقت سيؤدي إلى تحديث سياسة الإلغاء إلى استرداد 100٪ في أي وقت من الإلغاء",
        "Start At": "تبدأ في",
        "End At": "تنتهي في",
        "Overnight": "ليلا",
        "Please confirm that you want to remove this booking (#":
            "يرجى تأكيد رغبتك في إزالة هذا الحجز (#",
        /* shard 2 — bookings-multi-details.html */
        "Single Session (Multi Booking)": "جلسة فردية (حجز متعدد)",
        "Tickets :": "التذاكر :",
        "Online Multi Booking": "حجز متعدد عبر الإنترنت",
        "Customer (App)": "العميل (التطبيق)",
        "Qty": "الكمية",
        "Remaining:": "المتبقي:",
        /* shard 3 — bookings-multi-details.html */
        "Collection History": "سجل التحصيل",
        "Paid From High Five Wallet": "مدفوع من محفظة هاي فايف",
        "Paid from Bank": "مدفوع من البنك",
        "Are you sure you want to collect this booking?":
            "هل أنت متأكد أنك تريد تحصيل هذا الحجز؟",
        "Remaining :": "المتبقي :",
        /* shard 3 — bookings-public-event-details.html */
        "View Details Public Event": "تفاصيل النشاط الجماعي",
        "Price of the session is not used in public event.":
            "سعر الجلسة لا يستخدم في النشاط الجماعي.",
        "Public Event (#": "النشاط الجماعي (#",
        "Cancel Public Event": "إلغاء النشاط الجماعي",
        /* shard 4 — bookings-public-event-details.html */
        "Public Event Status :": "حالة النشاط الجماعي :",
        "Number Of Users :": "عدد المستخدمين :",
        "Age Group :": "الفئة العمرية :",
        "Created By :": "انشئ بواسطة :",
        "Created At :": "تاريخ الإنشاء :",
        "High Five App": "تطبيق هاي فايف",
        "Partner App (Al Olaya Sports Co.)":
            "تطبيق الشريك (Al Olaya Sports Co.)",
        "No Users Joined": "لم ينضم أي مستخدم",
        "No Users left": "لا يوجد مستخدمين مغادرين",
        "No Users left early": "لا يوجد مستخدمين مغادرين مبكرًا",
        "No Users left late": "لا يوجد مستخدمين مغادرين متأخرًا",
        "No removed users": "لا يوجد مستخدمين تمت إزالتهم",
        "collected from all users": "تم التحصيل من جميع المستخدمين",
        "No users joined yet": "لم ينضم أي مستخدم حتى الآن",
        "Price Per User :": "السعر لكل مستخدم :",
        "Charge for leave within :": "رسوم الإلغاء خلال :",
        "Cancelation Fee per user :": "رسوم الالغاء لكل مستخدم :",
        "Total payment from joined users :":
            "اجمالي المبلغ المدفوع من المستخدمين المنضمين :",
        "Total fee from Left users :":
            "اجمالي الرسوم من المستخدمين المغادرين :",
        "Total collected income from public event :":
            "اجمالي الدخل المحصل من النشاط الجماعي :",
        "Payment History": "سجل الدفع",
        /* shard 5 — bookings-public-event-details.html */
        "User": "المستخدم",
        "Partner Coupon": "كوبون الشريك",
        "Super Admin Coupon": "كوبون المدير العام",
        "Price per user Break Down": "السعر لكل مستخدم",
        "Total public event price per user :":
            "إجمالي سعر النشاط الجماعي لكل مستخدم :",
        "Total Payment from joined users Break Down":
            "اجمالي المبلغ المدفوع من المستخدمين المنضمين",
        "total joined users :": "إجمالي المستخدمين المنضمين :",
        "Total Fee from Left users Break Down":
            "إجمالي الرسوم من المستخدمين المغادرين",
        "Total Number of left users with fee :":
            "إجمالي عدد المستخدمين المغادرين مع الرسوم :",
        "Fee Price per user :": "الرسوم لكل مستخدم :",
        "Total income from public event Break Down":
            "إجمالي الدخل من النشاط الجماعي",
        "Total Number of Users :": "إجمالي عدد المستخدمين :",
        "Price per user :": "السعر لكل مستخدم :",
        "End time must be greater than start time":
            "وقت الانتهاء يجب أن يكون أكبر من وقت البدء",
        "All joined user should be removed to cancel the public event":
            "يجب إزالة جميع المستخدمين المنضمين لإلغاء النشاط الجماعي",
        "Please confirm that you want to remove this Public Event":
            "يرجى تأكيد رغبتك في إزالة هذا النشاط الجماعي",
        "For online booking: Full refund will be applied.":
            "للحجز عبر الإنترنت: سيتم تطبيق استرداد كامل.",
        "For cash booking: Payment history will be deleted and refund is subject to agreement.":
            "للحجز النقدي: سيتم حذف سجل الدفع ويخضع الاسترداد للاتفاق.",
        "Remove User": "ازالة المستخدم",
        "Are you sure you want to remove this user?":
            "هل انت متأكد انك تريد ازالة هذا المستخدم؟",
        "All joined users with no payment history":
            "جميع المستخدمين المنضمين بدون سجل دفع",
        "Select All": "تحديد الكل",
        "Unselect All": "إلغاء تحديد الكل",
        "Price Per User": "السعر لكل مستخدم",
        "Session updated successfully": "تم تحديث الجلسة بنجاح",
        "User removed successfully!": "تمت إزالة المستخدم بنجاح!",
        /* shard 6 — bookings-public-event-details.html */
        "Public event canceled successfully!": "تم إلغاء النشاط الجماعي بنجاح!",
        "Please select at least one user": "الرجاء تحديد مستخدم واحد على الأقل",
        "Users collected successfully!": "تم تحصيل المستخدمين بنجاح!",
        /* shard 6 — scheduling.html / scheduling-create-booking.html (shared topbar + scheduling grid) */
        "Open navigation": "فتح القائمة",
        "Toggle text direction (Arabic / RTL)": "تبديل اتجاه النص (عربي / RTL)",
        "Session actions": "إجراءات الجلسة",
        "Create Session": "إنشاء جلسة",
        "Total taxes:": "إجمالي الضرائب:",
        "Session": "الجلسة",
        "Create Booking": "إنشاء حجز",
        "Create Public Event": "إنشاء نشاط جماعي",
        "Copy": "نسخ",
        "Are you sure you want to delete this session?":
            "هل أنت متأكد أنك تريد حذف هذه الجلسة؟",
        "You cannot undo this action.": "لا يمكنك التراجع عن هذا الإجراء.",
        /* shard 7 — scheduling-create-booking.html */
        "User Information": "معلومات المستخدم",
        "User :": "المستخدم :",
        "Partner User": "عميل الشريك",
        "New User": "مستخدم جديد",
        "Select user": "اختر المستخدم",
        "Send SMS :": "إرسال رسالة نصية :",
        "Send SMS": "إرسال رسالة نصية",
        "Lock Booking:": "قفل الحجز:",
        "locked": "مقفل",
        "No Description": "لا يوجد وصف",
        "Payment Method:": "طريقة الدفع:",
        "unpaid": "غير مدفوع",
        "Subject to Agreement": "خاضع للاتفاق",
        "Date of Collection": "تاريخ التحصيل",
        "Name must be at least 2 characters":
            "يجب أن يتكون الاسم من حرفين على الأقل",
        "Country code": "رمز الدولة",
        "Saudi Arabia": "السعودية",
        "Egypt": "مصر",
        "United Arab Emirates": "الإمارات العربية المتحدة",
        "Kuwait": "الكويت",
        "Phone number must be digits only": "رقم الهاتف يجب ان يكون ارقام فقط",
        "Collect Amount": "إجمالي التحصيل",
        "Please enter the amount": "الرجاء إدخال المبلغ",
        /* shard 7 — scheduling-session.html */
        "View Session": "عرض الجلسة",
        /* shard 8 — scheduling-session.html (Break-down modals, Edit Session modal, Users Bookings) */
        "Taxes:": "الضرائب:",
        "Total:": "الإجمالي:",
        "Price per increment — Breakdown": "تفصيل السعر لكل زيادة",
        "Edit Session": "تعديل الجلسة",
        "Editing the time will update the cancellation policy to 100% refund at any time of cancellation for existing bookings.":
            "تعديل الوقت سيؤدي إلى تحديث سياسة الإلغاء لتصبح استرداد كامل 100% في أي وقت من أوقات الإلغاء للحجوزات الحالية.",
        "Users Bookings (": "حجوزات المستخدمين (",
        /* shard 8 — scheduling-session.html + scheduling-flexible.html (shared flexible-session fields) */
        "Flexible Slot Session": "جلسة فترة مرنة",
        "Min Duration (Minutes)": "الحد الأدنى للمدة (دقائق)",
        "Enter Min Duration": "أدخل الحد الأدنى للمدة",
        "Unit Min Session Length:": "الحد الأدنى لمدة الجلسة في الوحدة:",
        "Max Duration (Minutes)": "الحد الأقصى للمدة (دقائق)",
        "Enter Max Duration": "أدخل الحد الأقصى للمدة",
        "Unit Max Session Length:": "الحد الأقصى لمدة الجلسة في الوحدة:",
        "Increment / Block (Minutes)": "الزيادة / البلوك (دقائق)",
        "Enter Increment/Block Value": "أدخل قيمة الزيادة/البلوك",
        "Minutes": "دقيقة",
        "30 Minutes": "30 دقيقة",
        "60 Minutes (1 Hour)": "60 دقيقة (ساعة واحدة)",
        "90 Minutes (1 Hour and 30 Minutes)": "90 دقيقة (ساعة و30 دقيقة)",
        "120 Minutes (2 Hours)": "120 دقيقة (ساعتان)",
        "150 Minutes (2 Hours and 30 Minutes)": "150 دقيقة (ساعتان و30 دقيقة)",
        "180 Minutes (3 Hours)": "180 دقيقة (3 ساعات)",
        "Min Duration Price": "سعر الحد الأدنى للمدة",
        "Price Per Increment": "السعر لكل زيادة",
        /* shard 8 — scheduling-flexible.html */
        "Flexible slot": "فترة مرنة",
        "Conflict": "تعارض",
        "Create Flexible Session": "إنشاء جلسة مرنة",
        "Edit Flexible Session": "تعديل الجلسة المرنة",
        /* shard 9 — scheduling-flexible.html (context-menu header/items) */
        "Flexible Slot": "فترة مرنة",
        "View Session Details": "عرض تفاصيل الجلسة",
        /* shard 9 — scheduling-public-event.html */
        "Enter number of Users": "أدخل عدد المستخدمين",
        "Under 12": "أقل من 12",
        "Adults": "بالغين",
        "All ages": "جميع الأعمار",
        "Guaranteed Refund Time:": "وقت استرداد مضمون:",
        "Cancellation percentage:": "نسبة الإلغاء:",
        "Enter public event price:": "أدخل سعر النشاط الجماعي:",
        "Total public event price per user:":
            "سعر النشاط الجماعي لمستخدم واحد:",
        "Total Public Event Price": "إجمالي سعر النشاط الجماعي",
        /* shard 10 — scheduling-public-event.html */
        "Please choose a valid age Group option":
            "الرجاء اختيار خيار مجموعة عمرية صالح",
        "Please choose a valid payment Method": "الرجاء اختيار طريقة دفع صالحة",
        /* shard 10 — scheduling-weekly.html */
        "Temporary schedule": "جلسة مؤقتة",
        "Normal slot": "فترة عادية",
        "Session copied! Click on any cell to paste.":
            "تم نسخ الجلسة! انقر على أي خلية للصق.",
        "Min Duration": "الحد الأدنى للمدة",
        "Max Duration": "الحد الأقصى للمدة",
        "Increment / Block": "الزيادة / الكتلة",
        "Max duration exceeds this slot's length.":
            "الحد الأقصى للمدة يتجاوز طول هذه الفترة.",
        "Session created successfully": "تم إنشاء الجلسة بنجاح",
        "Session deleted successfully": "تم حذف الجلسة بنجاح",
        "Start and End Time are required": "وقت البدء والانتهاء مطلوبان",
        "Start Time must be before End Time OR the overnight method must be yes":
            "يجب أن يكون وقت البدء قبل وقت الانتهاء او يجب أن يكون ليلا نعم",
        "Please select gender": "يرجى اختيار النوع",
        /* shard 11 — scheduling-weekly.html */
        "Please enter a valid max capacity.":
            "الرجاء إدخال حد أقصى للسعة صحيح.",
        "Max capacity cannot exceed the limit set by Super Admin.":
            "لا يمكن أن يتجاوز الحد الأقصى للسعة الحد المحدد من قبل المدير العام.",
        "Please enter a valid max tickets per user.":
            "الرجاء إدخال حد أقصى صحيح للتذاكر لكل مستخدم.",
        "Please enter the flexible pricing fields.":
            "الرجاء إدخال حقول التسعير المرن.",
        "Please enter session price.": "الرجاء إدخال سعر الجلسة.",
        "Price cannot be negative": "لا يمكن ان يكون السعر بالسالب",
        "Unit not found.": "الوحدة غير موجودة.",
        /* shard 11 — branches.html */
        "Units management": "ادارة الوحدات",
        /* shard 11 — branches-new.html */
        "Locked to your registered country": "هذا الحقل مقفل حسب بلدك المسجل",
        "Select a state": "اختر المحافظة",
        "Select a city": "اختر المدينة",
        "Name is required": "الاسم مطلوب",
        "Name must be at least 3 characters":
            "يجب أن يتكون الاسم من 3 أحرف على الأقل",
        "State is required": "المحافظة مطلوبة",
        "City is required": "المدينة مطلوبة",
        "Couldn't find the location on map, Please search for valid address":
            "لم يتم العثور على الموقع على الخريطة، يرجى البحث عن عنوان صالح",
        "Please select a state and city first.":
            "يرجى اختيار المحافظة والمدينة أولاً.",
        /* shard 11 — branches-units.html */
        "Edit order": "تعديل الترتيب",
        "Save order": "حفظ الترتيب",
        "Main": "رئيسي",
        "Comments": "التعليقات",
        "Attendance": "الحضور",
        "Services": "الخدمات",
        "Both": "ذكر وأنثى",
        "Update status": "تحديث الحالة",
        /* shard 12 — branches-units.html (Update status modal) */
        "Unit Status:": "حالة الوحدة:",
        "Save changes": "حفظ التغييرات",
        /* shard 12 — branches-unit-booking-methodology.html */
        "Booking methodology settings": "إعدادات منهجية الحجز",
        "Please select one to be applied on your unit:":
            "يرجى اختيار أحد الخيارات لتطبيقه على وحدتك:",
        "Walk in only": "حجز مباشر فقط",
        "Your unit will not be shown in user app but you can make walk-in bookings.":
            "لن تظهر وحدتك في تطبيق المستخدمين ولكن يمكنك إجراء حجوزات مباشرة.",
        "Edit contacts": "تعديل جهات الاتصال",
        "Select at least one contact to choose this option.":
            "اختر جهة اتصال واحدة على الأقل لتحديد هذا الخيار.",
        "Online booking": "الحجز عبر الإنترنت",
        "Edit policy": "تعديل السياسة",
        "Select a policy to choose this option.":
            "اختر سياسة لتحديد هذا الخيار.",
        "Select contacts": "اختر جهات الاتصال",
        "Save contacts": "حفظ جهات الاتصال",
        "Select policy": "اختر سياسة",
        "Save policy": "حفظ السياسة",
        /* shard 12 — branches-unit-comments.html */
        "Rating": "التقييم",
        "Comment": "التعليق",
        "Created Date": "تاريخ الإنشاء",
        "Deletion request": "طلب الحذف",
        "Comment details": "تفاصيل التعليق",
        "User:": "المستخدم:",
        "Rating:": "التقييم:",
        "Comment:": "التعليق:",
        "App Type:": "نوع التطبيق:",
        "Created Date:": "تاريخ الإنشاء:",
        "Confirm deletion": "تأكيد الحذف",
        "Are you sure you want to delete this comment?":
            "هل أنت متأكد أنك تريد حذف هذا التعليق؟",
        /* shard 13 — branches-unit-employees.html */
        "Coordinator's Contact": "جهة اتصال المنسق",
        "Assign employee": "تعيين موظف",
        "Remove User": "ازالة المستخدم",
        "please select at least one employee to assign.":
            "يرجى اختيار موظف واحد على الأقل لتعيينه.",
        "employees assigned successfully!": "تم تعيين الموظفين بنجاح!",
        "employee deleted successfully!": "تم حذف الموظف بنجاح!",
        "owner contact status updated to active.":
            "تم تحديث حالة جهة اتصال المالك إلى نشط.",
        "No unassigned employees available.":
            "لا يوجد موظفون غير معينين متاحون.",
        /* shard 13 — branches-unit-new.html */
        "Add New Unit": "إضافة وحدة جديدة",
        "Unit Name *": "اسم الوحدة *",
        "Attendance Type *": "نوع الحضور *",
        "Gender *": "الجنس *",
        "Main Category *": "الفئة الرئيسية *",
        "This determines Type, Capacity, and Services":
            "هذا يحدد النوع والسعة والخدمات",
        "Main Activity *": "النشاط الرئيسي *",
        "Pictures": "الصور",
        "Upload size limits":
            "الصور: الحد الأقصى 1 ميجابايت | الفيديوهات: الحد الأقصى 10 ميجابايت",
        "Drag & drop files here, or": "اسحب الملفات وأفلتها هنا، أو",
        "browse": "تصفح",
        "Type *": "النوع *",
        "Part": "فرعي",
        "Part From": "فرعي من",
        "select Main Unit": "اختر الوحدة الرئيسية",
        "Conflicted Units": "الوحدات المتعارضة",
        "There is no part unit": "لا توجد وحدات فرعية",
        /* shard 14 — branches-unit-new.html */
        "Note: a new field will be under review then the status will be set as selected":
            "ملاحظة: سيتم وضع حقل جديد تحت المراجعة ثم سيتم تعيين الحالة كما تم تحديدها",
        "For online units, it's recommended to enable online payment only to avoid attendance issues.":
            "بالنسبة للوحدات عبر الإنترنت، يُنصح بتمكين الدفع عبر الإنترنت فقط لتجنب مشاكل الحضور.",
        "Gender is required": "الجنس مطلوب",
        "Activity Category is required": "فئة النشاط مطلوبة",
        "Activity is required": "النشاط مطلوب",
        "Part From is required": "فرعي من: مطلوب",
        /* shard 14 — branches-unit-sessions.html */
        "Create temporary schedule": "انشاء جلسة مؤقتة",
        "Period": "المدة",
        /* proposed wording, no exact ar.json reference — flag for BA/product sign-off
        (built from the generic "Default": "افتراضي" at ar.json line 1817) */
        "Default schedule": "الجدول الافتراضي",
        "Activated": "مفعل",
        "Create temporary session": "إنشاء جلسة مؤقتة",
        "Normal": "عادي",
        "Flexible": "مرن",
        "Edit temporary schedule": "تعديل الجلسة المؤقتة",
        "Schedule name": "اسم الجلسة",
        "Delete session": "حذف الجلسة",
        /* shard 14 — customers.html */
        "Booking status updated successfully": "تم تحديث حالة الحجز بنجاح",
        "Event status updated successfully": "تم تحديث حالة النشاط بنجاح",
        /* shard 14 — customer.html: static demo date/time strings (no locale call to hook into,
        unlike finance.html's MONTHS_AR helper) — literal per-value translations since each
        is an isolated text node holding one hardcoded mock value */
        "+3 this month": "+3 هذا الشهر",
        "28 mo": "28 شهرًا",
        "Mar 2024": "مارس 2024",
        "Thu, Jul 23 · 6:00 PM": "الخميس، 23 يوليو · 6:00 م",
        "Jul 9 · 6:00 PM": "9 يوليو · 6:00 م",
        "Jul 2 · 7:30 PM": "2 يوليو · 7:30 م",
        "Jun 25 · 6:00 PM": "25 يونيو · 6:00 م",
        "Jun 12 · 9:00 PM": "12 يونيو · 9:00 م",
        "Jul 9, 6:04 PM": "9 يوليو، 6:04 م",
        "Jul 9, 5:52 PM": "9 يوليو، 5:52 م",
        "Jul 9, 5:50 PM": "9 يوليو، 5:50 م",
        "Jul 1, 9:00 AM": "1 يوليو، 9:00 ص",
        "Jun 28, 2:15 PM": "28 يونيو، 2:15 م",
        /* shard 15 — customer.html: whole-sentence hardcoded strings (static markup +
        JS-array mock timeline entries), each an isolated text node so literal
        per-value translation (exact-match AR_VOCAB wins over the older suffix-only
        AR_REGEX rule below for this one string) */
        "8 sessions / month · renews Aug 1, 2026":
            "8 جلسات شهريًا · يُجدَّد في 1 أغسطس 2026",
        "5 of 8 sessions used this cycle": "5 من 8 جلسات مستخدمة في هذه الدورة",
        "Checked in · Padel Court A": "تم تسجيل الحضور · ملعب بادل A",
        "Payment SAR 180 · Mada": "دفعة 180 ر.س · مدى",
        "Booked HF-24816 for Jul 23": "تم حجز HF-24816 ليوم 23 يوليو",
        "Membership renewed · Padel Monthly":
            "تم تجديد العضوية · Padel Monthly",
        "Refund SAR 140 credited to wallet":
            "تم إضافة استرداد بقيمة 140 ر.س إلى المحفظة",
        "Credit from refund HF-24810 · usable on any booking.":
            "رصيد من استرداد HF-24810 · قابل للاستخدام في أي حجز.",
        /* shard 15 — customers-walkin.html */
        "Name :": "الاسم :",
        "Phone :": "رقم الهاتف :",
        "Please enter  Phone Number.": "من فضلك قم بادخال رقم الهاتف",
        "Customer updated successfully!": "تم تحديث بيانات العميل بنجاح!",
        /* shard 15 — employees.html: Employees List (ADO #2570) */
        "Job": "الوظيفة",
        "No Job": "بدون وظيفة",
        "No employees found": "لا يوجد موظفون",
        "Search by employee or job name": "بحث باسم الموظف أو الوظيفة",
        /* shard 16 — employees-edit.html / employees-new.html / employees-new-password.html /
        employees-new-verify.html: WhatsApp checkbox label, password hint and OTP-modal
        copy shared across the employee create/edit flow */
        "have WhatsApp": "لديه واتساب",
        /* Job field on Add/Edit Employee (ADO #2571) */
        "Select a Job": "اختر وظيفة",
        "No Jobs available": "لا توجد وظائف متاحة",
        "Please select a Job.": "يرجى اختيار وظيفة.",
        "No Jobs available. Please create a Job first.":
            "لا توجد وظائف متاحة. يرجى إنشاء وظيفة أولاً.",
        "Password must be between 8-16 characters and contain at least one letter.":
            "يجب أن تتراوح كلمة المرور بين 8-16 حرفًا وتحتوي على حرف واحد على الأقل.",
        "Please make sure the entered code is correct.":
            "يرجى التأكد من صحة الرمز المدخل.",
        "We will request verification.": "سنطلب التحقق.",
        "Please enter the verification code below:":
            "يرجى إدخال رمز التحقق أدناه:",
        /* shard 16 — employees-new-verify.html: OTP box aria-labels (accessibility only,
        not visible on-screen text) */
        "Digit 1": "خانة 1",
        "Digit 2": "خانة 2",
        "Digit 3": "خانة 3",
        "Digit 4": "خانة 4",
        /* shard 16 — login.html: whole-sentence entry added ahead of the "Welcome back"
        AR_REGEX rule so the exact-match AR_VOCAB lookup wins and the trailing English
        half of the subtitle no longer survives the regex's partial replace */
        "Welcome back — sign in to the Super Admin dashboard.":
            "مرحبًا بعودتك — سجّل الدخول إلى لوحة تحكم السوبر أدمن.",
        "Email or Phone Number": "البريد الالكتروني او رقم الهاتف",
        "Forgot Password?": "نسيت كلمة المرور؟",
        "OR": "او",
        "Please enter the Email address or Phone number":
            "يرجى إدخال البريد الإلكتروني أو رقم الهاتف",
        "Please enter the Password": "يرجى إدخال كلمة المرور",
        /* shard 16 — auth pages (login/registration/reset-password): password-field eye
        icon aria-label, both toggle states */
        "Show password": "إظهار كلمة المرور",
        "Hide password": "إخفاء كلمة المرور",
        /* shard 16 — registration.html */
        "Create your account": "أنشئ حسابك",
        "Sign up as a company owner": "سجّل كمالك شركة",
        "Verify your phone number": "تحقق من رقم هاتفك",
        "Company Information — please enter company details":
            "بيانات الشركة — يرجى إدخال تفاصيل الشركة",
        "Please upload required documents and send a message":
            "يرجى رفع المستندات المطلوبة وإرسال رسالة",
        "Please upload required documents and send a message.":
            "يرجى رفع المستندات المطلوبة وإرسال رسالة.",
        "Review your details and accept the terms":
            "راجع بياناتك ووافق على الشروط",
        "Independent": "مستقل",
        "Show in app": "العرض في تطبيق هاي فايف",
        /* shard 17 — registration.html: Documents/Review-step labels + validation toasts
        (a whole category of auth-flow validation toasts was missing from AR_VOCAB) */
        "Owner Message": "رسالة المالك",
        "Owner": "المالك",
        "Location": "الموقع",
        "I Accept the": "أوافق على",
        "Already have an account?": "لديك حساب بالفعل؟",
        "Sign Up": "تسجيل",
        "Invalid email format": "صيغة البريد الإلكتروني غير صالحة",
        "Phone number is required": "رقم الهاتف مطلوب",
        "Minimum 8 symbols": "الحد الأدنى 8 رموز",
        "Password confirmation is required": "تأكيد كلمة المرور مطلوب",
        "OTP must be 4 digits": "يجب أن يتكون رمز التحقق من 4 أرقام",
        "Please enter the company name": "الرجاء إدخال اسم الشركة",
        "Please upload required documents": "يرجى رفع المستندات المطلوبة",
        "You must accept the terms and conditions":
            "يجب عليك قبول الشروط والأحكام",
        "OTP sent successfully": "تم ارسال الكود بنجاح",
        "Files added": "تمت إضافة الملفات",
        /* shard 17 — reset-password.html */
        "Choose a strong password for your account.":
            "اختر كلمة مرور قوية لحسابك.",
        "Password and Confirm Password must match":
            "كلمة المرور وتأكيد كلمة المرور يجب أن تتطابق",
        "Password updated successfully": "تم تحديث كلمة المرور بنجاح",
        /* shard 17 — forgot-password.html */
        "Forgot Password": "نسيت كلمة المرور",
        "Please choose one of the methods.": "الرجاء اختيار أحدى الطرق",
        "Using Email": "باستخدام البريد الإلكتروني",
        "Using Phone": "باستخدام رقم الهاتف",
        /* shard 18 — forgot-password-mail.html / forgot-password-phone.html: subheads
        under the "Forgot Password" H1 (per-method instruction line) */
        "Enter your email and we'll send a verification code.":
            "أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق.",
        "Enter your phone and we'll send a verification code.":
            "أدخل رقم هاتفك وسنرسل لك رمز التحقق.",
        /* shard 18 — forgot-password-otp.html: #otpDest subtitle (set via JS depending on
        ?via=email|phone) + the post-verify success toast */
        "Enter the 4-digit code sent to your email.":
            "أدخل الرمز المكوّن من 4 أرقام المُرسل إلى بريدك الإلكتروني.",
        "Enter the 4-digit code sent to your phone.":
            "أدخل الرمز المكوّن من 4 أرقام المُرسل إلى هاتفك.",
        "OTP verified successfully.": "تم التحقق من رمز التحقق بنجاح.",
        /* shard 18 — marketing.html: coupons table column header + row action tooltips/
        modal heading that were missing from AR_VOCAB (title/aria-label attrs already
        pass through arabize()'s generic [title]/[aria-label] loop once a key exists) */
        "Dates": "التواريخ",
        "Usage details": "تفاصيل الاستخدام",
        "Edit status": "تعديل الحالة",
        "Delete item": "حذف العنصر",
        /* shard 19 — marketing.html: delete-confirmation modal body text */
        "Are you sure you want to delete this coupon?":
            "هل أنت متأكد من أنك تريد حذف هذا الكوبون؟",
        /* shard 19 — marketing-coupon-new.html: stepper labels / section headings /
        field labels + hints across all 5 wizard steps (step 5 "Schedule" was
        already translated - steps 1-4 were the ones missed) */
        "Basic Info": "المعلومات الأساسية",
        "Basic Information": "المعلومات الأساسية",
        "Coupon Type": "نوع الكوبون",
        "Discount": "الخصم",
        "Usage Limit": "حد الاستخدام",
        "Minimum 3 symbols, maximum 50.":
            "الحد الأدنى 3 رموز، الحد الأقصى 50 رمز.",
        "All Users": "جميع المستخدمين",
        "(All users in the system)": "(جميع المستخدمين في النظام)",
        "Specific Users": "مستخدمين محددين",
        "Specific Branches": "فروع محددة",
        "Specific Units": "وحدات محددة",
        "Coupon Percentage": "نسبة الكوبون",
        "Select a Percentage...": "اختر نسبة...",
        "Min Booking / Join Price": "الحد الأدنى للحجز / سعر الانضمام",
        "Limited": "محدود",
        "Usage Limit Per User": "حد الاستخدام لكل مستخدم:",
        "You do not have permission to create coupons":
            "لا يمكنك إنشاء كوبونات، يرجى الاتصال بالمسؤول",
        /* shard 19 — marketing-coupon-details.html: Coupon Usage Amount column header
        (both tabs) + the Joining-list tab's own headers that were never translated
        (ID/Company/Branch-Unit/Category-Activity/Age Group already covered elsewhere) */
        "Coupon Usage Amount": "مبلغ استخدام الكوبون",
        "Public Event Time": "وقت الحدث العام",
        "Session Gender": "جنس الجلسة",
        /* shard 20 — marketing-coupon-details.html: Joining-list tab headers/values that
        were still missing (ID/Company/Branch-Unit/Category-Activity/Users/Actions/
        Coupon Usage Amount were already covered) */
        "Joining status": "حالة الانضمام",
        "Public event ID": "معرف الحدث العام",
        "Public event status": "حالة الحدث العام",
        "Joined": "منضم",
        "coming": "قادم",
        /* shard 20 — marketing-coupon-view.html: field labels (row() concatenates
        "<label>:" into a single text node, so the colon must be part of the key)
        across the Coupon Type / Discount Type / Usage Limit / Dates sections,
        plus the Coupon status History table (heading + all 4 column headers) */
        "Users:": "المستخدمون:",
        "All users": "جميع المستخدمين",
        "Branches:": "الفروع:",
        "Type:": "النوع:",
        "Coupon Amount:": "مبلغ الكوبون:",
        "Min Booking / Join Price:": "الحد الأدنى للحجز / سعر الانضمام:",
        "Usage Limit:": "حد الاستخدام:",
        "Usage Limit Per User:": "حد الاستخدام لكل مستخدم:",
        "Start Date:": "تاريخ البداية:",
        "Expiry Date:": "تاريخ الانتهاء:",
        "Coupon status History": "تاريخ حالة الكوبون",
        "Changed by": "تم التغيير بواسطة",
        "Old Status": "الحالة القديمة",
        "New Status": "الحالة الجديدة",
        "Change Date/Time": "تاريخ/وقت التغيير",
        /* shard 20 — memberships.html: main table "Category" column header + "End"
        row action + its confirmation-modal body text ("End At" was checked and is
        already translated everywhere via the existing shard-2 entry above) */
        "Category": "التصنيف",
        "End": "إنهاء",
        "Are you sure you want to end this membership?":
            "هل أنت متأكد أنك تريد إنهاء هذا العضوية؟",
        /* shard 21 — memberships.html / memberships-request.html: Create/Edit
        Membership modal title + Length field label + Edit modal's Update
        button ("Update" already covered by an existing sitewide entry above) */
        "Create Membership": "إنشاء عضوية",
        "Edit Membership": "تعديل العضوية",
        "Length": "المدة",
        /* shard 21 — memberships-request.html: reject-confirmation modal body text */
        "Are you sure you want reject request?":
            "هل أنت متأكد أنك تريد رفض هذا الطلب?",
        /* shard 21 — memberships-expired.html: Renew action + the disabled-state
        label shown instead of Renew for players who already have an active
        membership ("I have an active membership" — the inline-link variant —
        was already covered by an existing sitewide entry above) */
        "Renew Membership": "تجديد العضوية",
        "Have an active membership": "لدي عضوية نشطة",
        /* shard 21 — memberships.html / memberships-request.html / memberships-expired.html:
        document <title> tags (translated via a small arInit() addition below) */
        "Memberships · HighFive": "العضويات · HighFive",
        "Request Membership · HighFive": "طلبات العضوية · HighFive",
        "Expired Membership · HighFive": "عضويات منتهية · HighFive",
        /* shard 21 — policies-new.html: field labels missing from AR_VOCAB. The
        "Requires Approval"/"Approval Duration" section headings carry a
        trailing " *" baked into the same text node, so the plain (no-asterisk)
        entries already above never match — literal asterisk variants added
        instead of restructuring the markup. */
        "Requires Approval *": "يتطلب الموافقة *",
        "Approval Duration *": "مدة الموافقة *",
        "Operation Hours From": "ساعات العمل من",
        "Operation Hours To": "ساعات العمل إلى",
        "Number of sessions": "عدد الجلسات",
        "Per": "لكل",
        "hours": "ساعات",
        "Hours before session start with full refund.":
            "ساعات قبل بدء الجلسة مع استرداد كامل.",
        "Charged on the paid amount after the free-cancellation window.":
            "تُحصَّل من المبلغ المدفوع بعد انتهاء فترة الإلغاء المجاني.",
        "Hours before start time. 3 hours minimum.":
            "ساعات قبل وقت البدء. 3 ساعات كحد أدنى.",
        "Receiving booking time frame": "إطار زمني لتلقي الحجوزات",
        /* shard 22 — policies-new.html / policies-edit.html / policies-view.html: remaining
        untranslated strings verified live (shard 21 covered the rest of this form) */
        "Sessions are hidden from users within this many hours of their start time.":
            "يتم إخفاء الجلسات عن المستخدمين خلال هذا العدد من الساعات قبل وقت بدئها.",
        "Receive Bookings Before End Of Session":
            "استلام الحجوزات قبل نهاية الجلسة",
        "End-of-session booking cutoff will not be applied because the session is hidden before the start time.":
            "لن يتم تطبيق قطع الحجز قبل نهاية الجلسة لأن الجلسة مخفية قبل وقت البدء.",
        /* shard 22 — policies-new.html: RD.toast() validation messages, verified live by
        submitting the form with Requires Approval = Yes and invalid Operation Hours /
        Approval Duration combinations */
        "Operation Hours are required when approval is required":
            "ساعات العمل مطلوبة عند تفعيل الموافقة",
        "Approval Duration is required when approval is required":
            "مدة الموافقة مطلوبة عند تفعيل الموافقة",
        'Operation hours "To" must be after "From"':
            'يجب أن يكون وقت "إلى" بعد وقت "من"',
        /* shard 22 — policies-new.html: Approval Duration <option> labels (built at runtime as
        `${h} hour${h===1?"":"s"}`) need exact-string overrides so proper Arabic numeral-noun
        agreement wins over the generic "^(\d+) hours?$" -> "$1 ساعة" AR_REGEX rule below,
        which otherwise flattens 3/6/9 to the wrong singular form */
        "1 hour": "ساعة واحدة",
        "3 hours": "3 ساعات",
        "6 hours": "6 ساعات",
        "9 hours": "9 ساعات",
        "12 hours": "12 ساعة",
        /* shard 22 — finance.html: full month names for the filter drawer's <select id="fMonth">,
        which is populated from the English MONTHS array regardless of language (only the
        page's own MONTHS_AR-driven summary heading was ever localized). "May" already
        matched by the 3-letter abbreviation entry above; the rest were missing outright. */
        "January": "يناير",
        "February": "فبراير",
        "March": "مارس",
        "April": "أبريل",
        "June": "يونيو",
        "July": "يوليو",
        "August": "أغسطس",
        "September": "سبتمبر",
        "October": "أكتوبر",
        "November": "نوفمبر",
        "December": "ديسمبر",
        /* shard 23 — finance.html: <option> text is lowercase ("All units"), unlike the
        existing "All Units" entry above used elsewhere, so a dedicated lowercase-u
        variant is needed for the Unit filter's default option. */
        "All units": "جميع الوحدات",
        /* shard 23 — finance.html: statCard() Collections sub-captions + the third
        summary card's title + its net-profit column header, all left raw English. */
        "Collected with high five": "تم تحصيله من high five",
        "To be collected by partner": "يتم تحصيله من قبل الشركة",
        "All Revenues": "إجمالي الإيرادات",
        "net profit": "صافي الربح",
        /* shard 23 — finance.html: transactions table headers/data-labels + the
        payment-channel tag under Collected Amount + the row action's aria-label
        + the filter drawer's aria-label (visible heading already uses "Filter"). */
        "Booking Status": "حالة الحجز",
        /* "Collected Amount" is a shared column header (also used by
        scheduling-create-booking.html's collection-history table) - moved here so
        both pages agree on the verified ar.json wording instead of the ad hoc
        "المبلغ المحصل" a previous shard had used only for that other page. */
        "Collected Amount": "إجمالي التحصيل",
        "High Five": "هاي فايف",
        "Partner": "شريك",
        "View transaction": "عرض المعاملة",
        "Filters": "تصفية",
        /* shard 23 — payment-settings.html: section labels are built as `${label}:`
        (colon baked into the same text node) + the online-payment-agreement footnote. */
        "Bookings:": "الحجوزات:",
        "Public Events:": "الانشطة الجماعية:",
        "In order to activate online payment for your company, you have to complete an online payment agreement.":
            "لتفعيل الدفع عبر الإنترنت لشركتك، يجب عليك استكمال اتفاقية الدفع عبر الإنترنت.",
        /* shard 23 — tax-settings.html: table headers, the no-tax-data placeholder cell,
        and the footnote above the table. */
        "branch/Unit Name": "اسم الفرع/الوحدة",
        "Tax value (%)": "قيمة الضريبة (%)",
        "No tax data": "لا توجد بيانات ضريبية",
        "Any change will affect all upcoming sessions not yet booked.":
            "اي تغيير سيؤثر على جميع الجلسات المقبلة التي لم يتم حجزها بعد.",
        /* shard 23 — assigned-services.html: main table column header, Assign Lists modal
        copy, and the row action's tooltip/aria-label ("Services" column header and the
        "Assign Service Lists" modal title were already covered by existing entries above). */
        "List Name": "اسم القائمة",
        "Edit Services": "تعديل الخدمات",
        "Select service lists and choose which services to assign":
            "اختر قوائم الخدمات واختر الخدمات التي تريد تخصيصها",
        "Select a list to preview services": "اختر قائمة لمعاينة الخدمات",
        "Select a list from the left to preview its services":
            "اختر قائمة من اليسار لمعاينة خدماتها",
        "Ready to assign": "جاهز للتخصيص",
        /* shard 24 — assigned-services.html: Assign Lists modal submit button, the
        Edit Services modal's subtitle/info-banner/footer buttons, and the
        "Already Assigned"/"Assigned" service-card badges (incl. the separate,
        previously entirely-unlocalized Services Preview popup opened from the
        table row's "X / Y" link). */
        "Already Assigned": "معينة مسبقاً",
        "Assigned": "معينة",
        "Assign Lists": "تخصيص القوائم",
        "Manage services for list:": "إدارة الخدمات للقائمة:",
        "How it works": "كيف يعمل",
        "Select services to assign. Checked services will be assigned.":
            "اختر الخدمات لتخصيصها. الخدمات المحددة سيتم تخصيصها.",
        "Unassign All Services": "إلغاء تخصيص جميع الخدمات",
        "Assign All Services": "تخصيص جميع الخدمات",
        "Update Services List": "تحديث قائمة الخدمات",
        /* shard 24 — categories.html: table headers left raw English (uppercased
        only via CSS text-transform - actual text nodes are lowercase), the
        Update Category modal title, both modals' name-field label, the
        branches/units instructional lines, the units-section placeholder
        shown before any branch is checked, and the delete-confirmation body. */
        "No. of active memberships": "عدد العضويات النشطة",
        "actions": "الإجراءات",
        "Update Category Management": "تعديل تصنيف",
        "Category name": "اسم التصنيف",
        "Please select branches you would like to enroll under this category:":
            "الرجاء أختيار الفروع التي تريد تسجيلها في هذا التصنيف:",
        "Please select units you would like to enroll under this category:":
            "الرجاء أختيار الوحدات التي تريد تسجيلها في هذا التصنيف:",
        "Select branches first": "الرجاء اختيار الفروع أولاً",
        "Are you sure that you want to delete this category?":
            "هل انت متأكد انك تريد حذف هذا التصنيف؟",
        "Deleting category will end all active memberships under this category.":
            "الحذف سينهي جميع العضويات النشطة في هذا التصنيف.",
        /* shard 25 — lists-services.html: lists table column headers + badge values,
        and the Create/Edit List modal (title/subtitle/sections/fields/toggles)
        and Delete List confirmation modal */
        "Required": "إجباري",
        "Selection Type": "نوع الاختيار",
        "Min / Max": "الحد الأدنى / الأقصى",
        "Created": "تاريخ الإنشاء",
        "Optional": "اختياري",
        "Create New List": "إنشاء قائمة جديدة",
        "Configure list settings and rules": "تكوين إعدادات القائمة وقواعدها",
        "Configuration": "الإعدادات",
        "This list already has session bookings — the name can't be changed.":
            "هذه القائمة مرتبطة بحجوزات حالية، لذا لا يمكن تغيير الاسم.",
        "Required List": "قائمة إجبارية",
        "Customer must select at least one option":
            "يجب على العميل اختيار خيار واحد على الأقل",
        "Enable Quantity Mode": "تفعيل وضع الكميات",
        "Enable quantity selection per item": "تفعيل اختيار الكمية لكل عنصر",
        "Selection Limits": "حدود الاختيار",
        "Min Selection": "الحد الأدنى للاختيار",
        "Max Selection": "الحد الأقصى للاختيار",
        "Quantity Limits": "حدود الكميات",
        "Min Total Quantity": "الحد الأدنى للإجمالي",
        "Max Total Quantity": "الحد الأقصى للإجمالي",
        "Delete List": "حذف القائمة",
        "Are you sure you want to delete this list?":
            "هل أنت متأكد من حذف هذه القائمة؟",
        "This action cannot be undone.": "هذا الإجراء لا يمكن التراجع عنه.",
        /* shard 25 — lists-services-detail.html: services table column headers,
        Add New button, and the Add/Edit Service modal fields */
        "Add New": "إضافة خدمة",
        "Image": "الصورة",
        "Max Quantity": "الحد الأقصى للكمية",
        "Minimum Selection": "الحد الأدنى للاختيار",
        "Visibility": "الرؤية",
        "Toggle visibility": "تبديل الرؤية",
        /* shard 26 — lists-services-detail.html: Add/Edit Service modal title
        (set via textContent — see #svcModalTitle in the page script), image
        dropzone copy and the duration select's default option. */
        "Add New Service": "إضافة خدمة جديدة",
        "Edit Service": "تعديل خدمة",
        "Service Image": "صورة الخدمة",
        "Drag & drop, or": "اسحب وأفلت الملف هنا، أو",
        "Accepted formats: JPG, PNG, WEBP. Max size: 2MB":
            "الصيغ المدعومة: JPG، PNG، WEBP. الحد الأقصى للحجم: 2 ميجابايت",
        "Remove Image": "إزالة الصورة",
        "Select duration (optional)": "اختر المدة (اختياري)",
        /* shard 26 — profile.html: Update-email/Update-phone/Edit-Password modal
        titles + fields, password-rule bullets and the OTP-flow toasts (email/
        phone update confirmation, resend, verify, activation). */
        "Update email": "تحديث البريد الإلكتروني",
        "Enter New email": "أدخل عنوان البريد الإلكتروني الجديد",
        "Enter New phone": "أدخل رقم الهاتف الجديد",
        "Edit Password": "تعديل كلمة المرور",
        "Password must contain at least one letter":
            "يجب أن تحتوي كلمة المرور على حرف واحد على الأقل",
        "Password must be at least 8 characters":
            "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
        "Old password is required": "كلمة المرور القديمة مطلوبة",
        "Verification code sent successfully.": "تم إرسال رمز التحقق بنجاح.",
        "Verification code is sent to your phone":
            "تم إرسال رمز التحقق إلى هاتفك",
        "Please enter the full verification code.":
            "يرجى إدخال رمز التحقق الكامل.",
        "New verification code has been sent.": "تم إرسال رمز التحقق الجديد.",
        "Your email has been activated.": "تم تنشيط بريدك الإلكتروني.",
        "Your phone has been activated.": "تم تنشيط هاتفك.",
        /* shard 26 — dashboard.html/reports.html shared shell: sidebar collapse
        button aria-label (screen-reader only, no visible tooltip). */
        "Collapse sidebar": "طي الشريط الجانبي",
        /* shard 26 — dashboard.html: notification-center sample items (NOTIFS
        array) — titles, bodies and timestamps are hardcoded literal strings
        (not templated), so each is added as its own exact-match entry.
        Person/court/booking-ID/SAR-amount business data stays untranslated;
        only the surrounding UI wording is Arabic. */
        "New booking — Court A": "حجز جديد — Court A",
        "Payout settled": "تسوية دفعة",
        "Waitlist promotion": "ترقية من قائمة الانتظار",
        "Booking cancelled": "تم إلغاء الحجز",
        "Membership expiring": "اقتراب انتهاء العضوية",
        "Omar Al-Fahad booked Court A, 6:00–7:00 PM (SAR 180).":
            "حجز Omar Al-Fahad ملعب Court A، 6:00–7:00 مساءً (180 ريال).",
        "SAR 12,480 transferred to your bank account ending 4471.":
            "تم تحويل 12,480 ريال إلى حسابك البنكي المنتهي بـ 4471.",
        "Farah Idris moved from waitlist to confirmed — Padel 8:00 PM.":
            "انتقلت Farah Idris من قائمة الانتظار إلى التأكيد — بادل 8:00 مساءً.",
        "HF-20931 cancelled by the customer. Refund of SAR 240 issued.":
            "تم إلغاء HF-20931 من قبل العميل. تم إصدار استرداد بقيمة 240 ريال.",
        "3 Gold memberships expire this week — renewal reminders sent.":
            "3 عضويات ذهبية تنتهي هذا الأسبوع — تم إرسال تذكيرات التجديد.",
        "12 min ago": "قبل 12 دقيقة",
        "1 h ago": "قبل ساعة",
        "3 h ago": "قبل 3 ساعات",
        "Yesterday, 9:12 PM": "أمس، 9:12 م",
        "Yesterday, 2:40 PM": "أمس، 2:40 م",
        /* shard 27 — dashboard.html/reports.html shared shell: mobile tab-bar
        "More" button and command-palette dialog aria-labels missed by the
        existing (differently-worded) vocab entries. */
        "Open full navigation": "فتح التنقل الكامل",
        "Command palette": "لوحة الأوامر",
        "Type a command or search": "اكتب أمرًا أو ابحث",
        /* shard 27 — reports.html: chart-tab subtitle captions (tab titles and
        the data below each chart are already translated; only these one-line
        descriptions were left out). */
        "Reservation volume across the last 12 months.":
            "حجم الحجوزات خلال آخر 12 شهرًا.",
        "Utilization by day of week over the last 16 weeks.":
            "معدل الإشغال حسب أيام الأسبوع خلال آخر 16 أسبوعًا.",
        "From browsing an activity to a paid, confirmed reservation.":
            "من تصفح النشاط إلى حجز مدفوع ومؤكَّد.",
        "Share of customers who book again within 60 days, by cohort.":
            "نسبة العملاء الذين يحجزون مرة أخرى خلال 60 يومًا، حسب الفوج.",
        /* shard 27 — administration.html: Roles & Permissions catalog + Policies tab */
        "Branch Manager": "مدير الفرع",
        "Front Desk": "مكتب الاستقبال",
        "Coach": "المدرب",
        "Bookings (own sessions)": "الحجوزات (الجلسات الخاصة به)",
        "Cancellation": "الإلغاء",
        "Free up to 24h before start time. Inside 24h, 50% of the session fee is charged.":
            "مجاني حتى 24 ساعة قبل موعد البدء. خلال 24 ساعة، تُخصم 50% من رسوم الجلسة.",
        "No-show": "عدم الحضور",
        "Full session fee charged. Three no-shows in 30 days pause online booking.":
            "تُخصم رسوم الجلسة كاملة. عدم الحضور 3 مرات خلال 30 يومًا يوقف الحجز عبر الإنترنت مؤقتًا.",
        /* "Edit policy" already covered by an existing entry (see shard 7-ish
        block above, ~line 1388) — same exact translation, no new key needed. */
        /* shard 27 — settings.html: nav tabs, General-tab fields and
        Notifications-tab toggle titles/descriptions (NOTIFS array). */
        "General": "عام",
        "Business hours": "ساعات العمل",
        "Business profile": "ملف المنشأة",
        "Business name": "اسم المنشأة",
        "Timezone": "المنطقة الزمنية",
        "(GMT+3) Riyadh": "(GMT+3) الرياض",
        "Currency": "العملة",
        "SAR - Saudi Riyal": "ريال سعودي (SAR)",
        /* "Save changes" already covered by an existing entry (~line 1380) —
        same exact translation, no new key needed. */
        "Booking confirmations": "تأكيدات الحجز",
        "Email the guest the moment a booking is confirmed.":
            "إرسال بريد إلكتروني للضيف فور تأكيد الحجز.",
        "Cancellations & refunds": "الإلغاءات والمستردات",
        "Notify guests and finance when a booking is cancelled.":
            "إشعار الضيوف والقسم المالي عند إلغاء الحجز.",
        /* shard 28 — settings.html: remaining Notifications-tab toggles (NOTIFS
        array) + Integrations-tab rows (INTEGRATIONS array) */
        "SMS reminders": "تذكيرات عبر الرسائل النصية",
        "Send a reminder SMS 2 hours before the session.":
            "إرسال رسالة تذكير نصية قبل ساعتين من موعد الجلسة.",
        "Marketing emails": "رسائل تسويقية",
        "Weekly digest of offers and new sessions.":
            "ملخص أسبوعي بالعروض والجلسات الجديدة.",
        "Mada / card payments": "مدى / الدفع بالبطاقة",
        "Accept card payments at checkout.":
            "قبول الدفع بالبطاقة عند إتمام الحجز.",
        "SMS gateway": "بوابة الرسائل النصية",
        "Booking reminders and OTP codes.": "تذكيرات الحجز ورموز التحقق (OTP).",
        "Google Calendar sync": "مزامنة تقويم Google",
        "Push confirmed bookings to staff calendars.":
            "إرسال الحجوزات المؤكدة إلى تقاويم الموظفين.",
        "Accounting export": "تصدير المحاسبة",
        "Nightly export of payments to your accounting system.":
            "تصدير ليلي للمدفوعات إلى نظام المحاسبة الخاص بك.",
        /* shard 28 — contacts.html: add-contact modal title (edit modal's
        "تحديث جهة اتصال" was already translated) + delete-confirm body text
        (dialog title/buttons were already translated, this sentence wasn't) */
        "New contact": "إنشاء جهة اتصال",
        "Are you sure you want to delete this contact?":
            "هل أنت متأكد أنك تريد حذف جهة الاتصال؟",
        /* shard 28 — contacts.html: "ما هو جهة الاتصال" info-dialog body bullets
        (dialog title + close buttons were already translated, body wasn't) */
        "If assigned to a field with contact booking methodology, contacts will be displayed on available sessions.":
            "إذا تم تعيينه إلى حقل باستخدام منهجية حجز جهة اتصال، فسيتم عرض جهات الاتصال في الجلسات المتاحة.",
        "Assigned contact should have good communication skills as they will receive calls from High Five users.":
            "يجب أن تتمتع جهة الاتصال المعينة بمهارات اتصال جيدة حيث ستتلقى مكالمات من مستخدمي High Five.",
        /* shard 28 — support.html: Category/Subcategory <select> options (built
        at runtime from the inline CATEGORIES array) + App Type option value.
        "High Five" reuses the existing entry above (~line 1655). */
        "Booking Issue": "مشكلة في الحجز",
        "Technical Problem": "مشكلة تقنية",
        "Billing & Payments": "الفواتير والمدفوعات",
        "Can't create a booking": "لا يمكن إنشاء حجز",
        "Booking shows the wrong price": "الحجز يعرض سعرًا خاطئًا",
        "App crashes": "التطبيق يتوقف عن العمل",
        "A page won't load": "الصفحة لا يتم تحميلها",
        "Payout delayed": "تأخرت الدفعة",
        "Refund question": "سؤال عن الاسترداد",
        "Select a category first": "اختر التصنيف أولاً",
        "Select a subcategory": "اختر تصنيفًا فرعيًا",
        "Partner App": "تطبيق الشريك",
        /* round-2 fix (post-verification pass) — bookings-details.html. NOTE: this
        whole block was originally added to AR_PLACEHOLDERS by mistake (the `};`
        it was inserted before turned out to close AR_PLACEHOLDERS, not
        AR_VOCAB - the two objects are adjacent and easy to conflate by
        proximity) so none of it took effect; moved here, the correct object,
        after brace-counting to confirm this is really AR_VOCAB's own close. */
        "Booking (#": "الحجز (#",
        "(Cancelled)": "(الملغى)",
        "CancelledBy :": "ألغيت بواسطة :",
        "You": "أنت",
        "Slot Start Time :": "وقت بداية الفترة :",
        "Slot End Time :": "وقت نهاية الفترة :",
        "Increment / Block :": "الزيادة / الفترة :",
        "Min Duration :": "الحد الأدنى للمدة :",
        "Max Duration :": "الحد الأقصى للمدة :",
        "Number of Slots :": "عدد الفترات :",
        /* round-2 fix — scheduling.html */
        "Add Session and Create Booking": "إضافة جلسة وإنشاء حجز",
        /* round-2 fix — branches-unit-comments.html */
        "Please enter a reason for deletion.": "الرجاء إدخال سبب الحذف.",
        "comment deleted successfully": "تم حذف التعليق بنجاح",
        "No Comments available": "لا توجد تعليقات متاحة",
        /* round-2 fix — branches-unit-employees.html */
        "(owner)": "(المالك)",
        "(employee)": "(الموظف)",
        "Employee contact status updated successfully!":
            "تم تحديث حالة جهة اتصال الموظف بنجاح!",
        "you must keep at least one user active.":
            "يجب أن يبقى مستخدم واحد نشطًا على الأقل.",
        /* round-2 fix — branches-unit-new.html */
        "Unit added successfully!": "تمت إضافة الوحدة بنجاح!",
        "Enter unit name": "أدخل اسم الوحدة",
        /* round-2 fix — branches-unit-sessions.html */
        "Please enter a schedule name.": "الرجاء إدخال اسم الجدول.",
        "Please pick a start and end date.":
            "الرجاء اختيار تاريخ البداية والنهاية.",
        "Session created successfully!": "تم إنشاء الجلسة بنجاح!",
        "Session updated successfully!": "تم تحديث الجلسة بنجاح!",
        "Session deleted successfully!": "تم حذف الجلسة بنجاح!",
        "Open schedule": "فتح الجدول",
        /* round-2 fix — registration.html: province/city dropdowns + document labels */
        "Riyadh Province": "منطقة الرياض",
        "Makkah Province": "منطقة مكة المكرمة",
        "Riyadh": "الرياض",
        "Diriyah": "الدرعية",
        "Jeddah": "جدة",
        "Makkah": "مكة المكرمة",
        "Commercial Registration": "السجل التجاري",
        "VAT Certificate": "شهادة ضريبة القيمة المضافة",
        "National Address": "العنوان الوطني",
        /* round-2 fix — marketing-coupon-details.html / marketing-coupon-view.html */
        "View booking": "عرض الحجز",
        "View public event": "عرض النشاط الجماعي",
        "Mixed": "مختلط",
        "Units:": "الوحدات:",
        "No logs available": "لا توجد سجلات متاحة",
        /* round-2 fix — memberships.html / memberships-request.html / memberships-expired.html */
        "Search By User Or Username or Reference Number":
            "البحث حسب المستخدم أو اسم المستخدم أو الرقم المرجعي",
        "Membership ended successfully": "تم إنهاء العضوية بنجاح",
        "Please enter a valid search query": "الرجاء إدخال عبارة بحث صالحة",
        "Data loaded successfully": "تم تحميل البيانات بنجاح",
        "Membership updated successfully!": "تم تحديث العضوية بنجاح!",
        "Membership created successfully!": "تم إنشاء العضوية بنجاح!",
        "Membership rejected successfully": "تم رفض طلب العضوية بنجاح",
        "Opening the active membership…": "جارٍ فتح العضوية النشطة…",
        /* round-2 fix — finance.html */
        "File downloaded successfully": "تم تنزيل الملف بنجاح",
        /* round-2 fix — lists-services.html validation toasts */
        "No lists found.": "لم يتم العثور على قوائم.",
        "List name is required": "اسم القائمة مطلوب",
        "List name must be at least 2 characters":
            "يجب ألا يقل اسم القائمة عن حرفين",
        "List name must not exceed 100 characters":
            "يجب ألا يتجاوز اسم القائمة 100 حرف",
        "List name cannot be only numbers. It must contain at least one letter.":
            "لا يمكن أن يتكون اسم القائمة من أرقام فقط، يجب أن يحتوي على حرف واحد على الأقل.",
        "A list with this name already exists": "توجد قائمة بهذا الاسم بالفعل",
        "Minimum value cannot exceed 999":
            "لا يمكن أن تتجاوز القيمة الدنيا 999",
        "Maximum value cannot exceed 999":
            "لا يمكن أن تتجاوز القيمة القصوى 999",
        "Max Selection must be 1 for Single selection type":
            "يجب أن يكون الحد الأقصى للاختيار 1 لنوع الاختيار الفردي",
        "Min Selection must be 1 for Required Single selection":
            "يجب أن يكون الحد الأدنى للاختيار 1 للاختيار الفردي المطلوب",
        "Min Selection must be 0 for Optional Single selection":
            "يجب أن يكون الحد الأدنى للاختيار 0 للاختيار الفردي الاختياري",
        "Max Selection cannot be negative":
            "لا يمكن أن يكون الحد الأقصى للاختيار سالبًا",
        "Min Selection cannot be negative":
            "لا يمكن أن يكون الحد الأدنى للاختيار سالبًا",
        "Max selection must be at least 1 or empty for unlimited":
            "يجب أن يكون الحد الأقصى للاختيار 1 على الأقل أو فارغًا لغير محدود",
        "Max total quantity must be at least 1 or empty for unlimited":
            "يجب أن تكون الكمية الإجمالية القصوى 1 على الأقل أو فارغة لغير محدود",
        "The default list cannot be deleted.":
            "لا يمكن حذف القائمة الافتراضية.",
        "List updated successfully": "تم تحديث القائمة بنجاح",
        "List created successfully": "تم إنشاء القائمة بنجاح",
        "List deleted successfully": "تم حذف القائمة بنجاح",
        /* round-2 fix — lists-services-detail.html */
        "No services available.": "لا توجد خدمات متاحة.",
        "service-photo.jpg selected": "تم اختيار service-photo.jpg",
        "Image removed": "تمت إزالة الصورة",
        "Visibility updated successfully": "تم تحديث الظهور بنجاح",
        "Service deleted successfully": "تم حذف الخدمة بنجاح",
        "Service name is required": "اسم الخدمة مطلوب",
        "Please select an image": "الرجاء اختيار صورة",
        "Price is required": "السعر مطلوب",
        "Price must be at least 0": "يجب ألا يقل السعر عن 0",
        "Max quantity must be at least 1": "يجب ألا تقل الكمية القصوى عن 1",
        "Minimum selection must be at least 0":
            "يجب ألا يقل الحد الأدنى للاختيار عن 0",
        "Minimum selection must not exceed 100":
            "يجب ألا يتجاوز الحد الأدنى للاختيار 100",
        "Service updated successfully": "تم تحديث الخدمة بنجاح",
        "Service created successfully": "تم إنشاء الخدمة بنجاح",
        /* round-2 fix — profile.html */
        "Digit 5": "خانة 5",
        "Digit 6": "خانة 6",
        /* shared strings that first arrived with the (removed) Quick Access modal */
        "n/a": "غير متوفر",
        "Joining": "انضمام",
        "Try again": "حاول مرة أخرى",
        /* shard 29 — Support · My Tickets / Ticket details (ADO #2868). "Open"
        itself is deliberately left out of this dictionary: it already means
        the verb "فتح" via the command palette, so every ticket-status use
        here carries its own data-ar="مفتوحة" override instead (same pattern
        the code comment above arabize()'s data-ar pass documents). */
        "New Ticket": "تذكرة جديدة",
        "My Tickets": "تذاكري",
        "In Progress": "قيد المعالجة",
        "Awaiting your reply": "بانتظار ردك",
        "Closed": "مغلقة",
        "Cancelled": "ملغاة",
        "Archived": "مؤرشفة",
        "Archived — submitted before the ticketing system":
            "مؤرشفة — تم إرسالها قبل نظام التذاكر",
        "Ticket #": "رقم التذكرة",
        "Opened by": "فتحها",
        "Employee": "موظف",
        "Last update": "آخر تحديث",
        "No tickets yet.": "لا توجد تذاكر بعد.",
        "Open a new ticket": "فتح تذكرة جديدة",
        "Cancel ticket": "إلغاء التذكرة",
        "Are you sure you want to cancel this ticket?":
            "هل أنت متأكد أنك تريد إلغاء هذه التذكرة؟",
        "This can't be undone — the ticket will be marked Cancelled.":
            "لا يمكن التراجع عن هذا — سيتم تعليم التذكرة كملغاة.",
        "Keep ticket": "الإبقاء على التذكرة",
        "HighFive Support": "دعم HighFive",
        "Reply": "الرد",
        "Send Reply": "إرسال الرد",
        "Write a reply…": "اكتب ردًا…",
        "Attachments": "المرفقات",
        "Attachments (optional)": "المرفقات (اختياري)",
        "Opened by you": "فتحتها أنت",
        "Opened by the Owner": "فتحها المالك",
        "All Categories": "كل التصنيفات",
        "All Subcategories": "كل التصنيفات الفرعية",
        "Opened by (anyone)": "فتحها (أي شخص)",
        "Created date": "تاريخ الإنشاء",
        "Search by ticket number": "ابحث برقم التذكرة",
        "View ticket": "عرض التذكرة",
        "You don't have permission": "ليس لديك صلاحية",
        /* Support permission group, Employees › Jobs (ADO #2868 P1-P7) */
        "Open ticket": "فتح تذكرة",
        "View own tickets": "عرض تذاكره",
        "View all tickets": "عرض كل التذاكر",
    };
    const AR_PLACEHOLDERS = {
        "Search bookings, customers, resources…":
            "ابحث في الحجوزات والعملاء والموارد…",
        "What happened, and where in the app were you?":
            "إيه اللي حصل، وكنت في أي صفحة في التطبيق؟",
        "Enter your email": "أدخل بريدك الإلكتروني",
        "Enter your password": "أدخل كلمة المرور",
        "Search…": "بحث…",
        "Jump to a page…": "انتقل إلى صفحة…",
        "Search reservations": "ابحث في الحجوزات",
        "Search customers": "ابحث في العملاء",
        "Type a command or search…": "اكتب أمرًا أو ابحث…",
        "Enter full name": "ادخل الاسم الكامل",
        "Enter email address": "ادخل البريد الالكتروني",
        "Enter phone number": "ادخل رقم الهاتف",
        "Enter password": "ادخل كلمة المرور",
        /* shard 1 — booking-new.html */
        "Search by name or phone — e.g. Salem Al-Qahtani":
            "ابحث بالاسم أو رقم الجوال — مثال: Salem Al-Qahtani",
        /* shard 6 — scheduling.html (Create Session modal) */
        "Enter max capacity": "أدخل الحد الأقصى للسعة",
        "Enter max tickets per user": "أدخل الحد الأقصى للتذاكر لكل مستخدم",
        /* shard 7 — scheduling-create-booking.html (falls back to AR_VOCAB too, listed for clarity) */
        "Select user": "اختر المستخدم",
        /* shard 8 — scheduling-session.html */
        "Search Booking ID, username...": "البحث برقم الحجز، اسم المستخدم...",
        /* shard 11 — branches-new.html */
        "Enter branch name": "ادخل اسم الفرع",
        "Enter street and district": "أدخل الشارع والحي",
        "Search location first": "ابحث عن الموقع أولاً",
        /* shard 12 — branches-unit-comments.html */
        "Enter reason for deletion": "أدخل سبب الحذف",
        /* shard 14 — branches-unit-sessions.html */
        "Enter schedule name": "ادخل اسم الجلسة",
        /* shard 14 — customers.html */
        "Search by user or username": "البحث حسب المستخدم أو اسم المستخدم",
        /* shard 15 — customers-walkin.html */
        "Search by name or phone number": "ابحث بالاسم أو رقم الهاتف",
        /* shard 17 — registration.html */
        "You can write a message to the High Five team":
            "يمكنك كتابة رسالة إلى فريق High Five",
        /* shard 18 — marketing.html */
        "Search by the coupon code": "البحث عن طريق كود الكوبون",
        /* shard 19 — marketing-coupon-new.html */
        "Enter Coupon Amount": "أدخل مبلغ الكوبون",
        "The Limit Number": "رقم الحد",
        "The Limit Number Per User": "رقم الحد لكل مستخدم",
        /* shard 19 — marketing-coupon-details.html (set via JS on #cdSearch per tab) */
        "Search by Booking ID , User name , Username , Company name , Unit name":
            "البحث عن طريق معرف الحجز، اسم المستخدم، اسم المستخدم، اسم الشركة، اسم الوحدة",
        /* shard 23 — assigned-services.html: Assign Lists modal search box */
        "Search service lists...": "البحث في قوائم الخدمات...",
        /* shard 24 — categories.html (Create/Update Category modal name field) */
        "Enter Category Name": "ادخل اسم التصنيف",
        /* shard 24 — lists-services.html (lists table search box) */
        "Search lists...": "بحث في القوائم...",
        /* shard 25 — lists-services.html (Create/Edit List modal name field) */
        "Enter list name": "أدخل اسم القائمة",
        /* shard 25 — lists-services-detail.html (services table search box) */
        "Search services...": "بحث في الخدمات...",
        /* shard 26 — profile.html (falls back to AR_VOCAB too, listed for clarity) */
        "Enter New email": "أدخل عنوان البريد الإلكتروني الجديد",
        "Enter New phone": "أدخل رقم الهاتف الجديد",
        /* shard 28 — contacts.html: add/edit-contact modals' name field */
        "Enter Name": "أدخل الاسم",
        /* shard 28 — support.html: message textarea */
        "How can we help?": "كيف يمكننا مساعدتك؟",
    };
    const AR_REGEX = [
        [/^Ticket #(\d+)$/, "تذكرة #$1"],
        [/^Participant #(\d+)$/, "مشارك #$1"],
        [/^Showing 1–(\d+) of ([\d,]+) reservations$/, "عرض 1–$1 من $2 حجزًا"],
        [/^Showing 1–(\d+) of ([\d,]+) customers$/, "عرض 1–$1 من $2 عميلًا"],
        [/^Showing 1–(\d+) of ([\d,]+) bookings$/, "عرض 1–$1 من $2 حجزًا"],
        /* employees-jobs.html pagination footer (ADO #2565) */
        [/^Showing (\d+) to (\d+) of (\d+)$/, "عرض $1 إلى $2 من $3"],
        [/^Showing 0 of 0$/, "عرض 0 من 0"],
        [/^This job has 1 employee assigned and cannot be deleted at this time\.$/, "يوجد لدى هذه الوظيفة موظف واحد، ولا يمكن حذفها في الوقت الحالي."],
        [/^This job has (\d+) employees assigned and cannot be deleted at this time\.$/, "يوجد لدى هذه الوظيفة $1 موظفين، ولا يمكن حذفها في الوقت الحالي."],
        [/^(\d+) of (\d+) scanned$/, "تم مسح $1 من $2"],
        /* specific-before-general: "Welcome back X" must win over plain "Welcome X" */
        [/^Welcome back (.+)$/, "مرحبًا بعودتك، $1"],
        [/^Welcome (.+)$/, "مرحبًا بك، $1"],
        [/^(\d+) of (\d+) reservations$/, "$1 من $2 حجزًا"],
        [/^(\d+) of (\d+) customers$/, "$1 من $2 عميلًا"],
        [/^(\d+) of (\d+) coupons$/, "عرض $1 من $2 كوبونًا"],
        [/^(\d+) of (\d+) memberships$/, "$1 من $2 عضوية"],
        [/^(\d+) records?$/, "$1 سجلًا"],
        [/^(\d+) requests?$/, "$1 طلبًا"],
        [/^Conflicted with (.+)$/, "تعارض مع $1"],
        [/^Time remaining: (\d+) seconds$/, "الوقت المتبقي: $1 ثانية"],
        [/^Remaining: /, "المتبقي: "],
        [/(\d+(?:\.\d+)?) SAR$/, "$1 ريال سعودي"],
        [/^(\d+) min$/, "$1 دقيقة"],
        [/^(\d+) minutes$/, "$1 دقيقة"],
        /* round-2 fix — bookings-details.html flexible-session rows render "60 Minutes"
        (capitalized), which the lowercase-only rule above never matches */
        [/^(\d+) Minutes$/, "$1 دقيقة"],
        [/^(\d+) Hours?$/, "$1 ساعة"],
        [/^(\d+) Hours? and (\d+) minutes?$/, "$1 ساعة و$2 دقيقة"],
        /* shard 21 — policies-new.html: Approval Duration <option> labels are built at
        runtime via `${h} hour${h===1?"":"s"}` (lowercase, unlike the capitalized
        "Hours" rule above), so a dedicated lowercase entry is needed to catch them */
        [/^(\d+) hours?$/, "$1 ساعة"],
        /* shard 1 — booking-new.html / bookings.html / bookings-details.html */
        [/^Pay SAR (\d+(?:\.\d+)?)$/, "ادفع $1 ريال سعودي"],
        [/^E-ticket sent to (.+)\.$/, "تم إرسال التذكرة الإلكترونية إلى $1."],
        /* AM/PM display convention (none existed sitewide) - suffix-anchored so it
        fixes both bare times ("6:00 PM") and full datetimes ("05/08/2026 08:20 AM"). */
        [/(\d{1,2}):(\d{2}) AM$/, "$1:$2 ص"],
        [/(\d{1,2}):(\d{2}) PM$/, "$1:$2 م"],
        [/^Total Tax \((\d+)%\) :$/, "إجمالي الضريبة ($1%) :"],
        /* shard 2 — bookings-multi-details.html: id is interpolated inline (not in its own <span>) */
        [/^Booking \(# (\d+)\)$/, "الحجز (# $1)"],
        [/^\(Related Canceled Booking #(\d+)\)$/, "(الحجز الملغي المرتبط #$1)"],
        /* shard 4 — bookings-public-event-details.html: accordion header "title (n/total)" is one
        raw text node (count is interpolated and changes as users check in / get removed) */
        [/^joined users \((\d+)\/(\d+)\)$/, "المستخدمون المنضمون ($1/$2)"],
        [/^Left Users \(Early\) \((\d+)\/(\d+)\)$/, "المستخدمون المغادرون (مبكرًا) ($1/$2)"],
        [/^Left Users \(Late\) \((\d+)\/(\d+)\)$/, "المستخدمون المغادرون (متأخرًا) ($1/$2)"],
        [/^Left Users \((\d+)\/(\d+)\)$/, "المستخدمون المغادرون ($1/$2)"],
        [/^Removed Users \((\d+)\/(\d+)\)$/, "المستخدمون المحذوفون ($1/$2)"],
        /* "remaining users N : (X.XX SAR)" collect banner — count + amount interpolated into one node */
        [/^remaining users (\d+) : \((\d+(?:\.\d+)?) SAR\)$/, "المستخدمين المتبقين $1 : ($2 ريال سعودي)"],
        /* SAR followed by a trailing "(NN%)" (cancelation fee value) isn't end-anchored so the
        generic "(\d+(?:\.\d+)?) SAR$" rule above never fires on it */
        [/^(\d+(?:\.\d+)?) SAR \((\d+)%\)$/, "$1 ريال سعودي ($2%)"],
        /* shard 7 — scheduling-create-booking.html: min-selection count is interpolated */
        [/^Minimum selection required: (\d+)$/, "الحد الأدنى للاختيار المطلوب: $1"],
        /* shard 8 — scheduling-session.html: break-down modal tax line is one interpolated
        node ("VAT (15%) — 23.48 SAR") — must translate name + SAR in a single pass since
        only the first matching AR_REGEX rule ever fires per text node */
        [/^VAT \((\d+)%\) — (\d+(?:\.\d+)?) SAR$/, "ضريبة القيمة المضافة ($1%) — $2 ريال سعودي"],
        /* shard 10 — scheduling-public-event.html: MIN/MAX are interpolated into the toast */
        [/^Please enter a valid number of users From (\d+) To (\d+)$/, "الرجاء إدخال عدد صحيح من المستخدمين من $1 إلى $2"],
        /* shard 10 — scheduling-weekly.html: hint text with an interpolated count */
        [/^Maximum allowed: (\d+)$/, "الحد الأقصى المسموح: $1"],
        [/^Cannot exceed Max Capacity: (\d+)$/, "لا يمكن أن يتجاوز الحد الأقصى للسعة: $1"],
        [/^View coming bookings \((\d+)\)$/, "عرض الحجوزات القادمة ($1)"],
        [/^View coming public events \((\d+)\)$/, "عرض الأنشطة الجماعية القادمة ($1)"],
        /* day name is translated to Arabic in-page (see dayDisplay()) before this toast fires,
        but the pattern also matches the raw English key as a safe fallback */
        [/^Session pasted to (.+) at (\d{1,2}:\d{2})$/, "تم لصق الجلسة إلى $1 الساعة $2"],
        [/^Time must be between (\d+) and (\d+) minutes$/, "يجب أن يكون الوقت بين $1 و$2 دقيقة"],
        /* shard 11 — branches.html: footer pagination summary (mirrors the "... of ... memberships" rule) */
        [/^(\d+) of (\d+) branches$/, "$1 من $2 فروع"],
        /* shard 11 — branches-units.html: statusBadge() builds one text node "<label>: <status>"
        (label is a brand name — "High Five" / "Partner App" — left untranslated) */
        [/^(.+): Approved$/, "$1: تمت الموافقة"],
        [/^(.+): Pending$/, "$1: قيد الانتظار"],
        [/^(.+): Not Approved$/, "$1: مرفوض"],
        /* shard 14 — customers.html: gender+age is one interpolated text node ("Male - 28") */
        [/^Male - (\d+)$/, "ذكر - $1"],
        [/^Female - (\d+)$/, "أنثى - $1"],
        /* shard 14 — customer.html: membership renewal line is one text node
        ("8 sessions / month · renews Aug 1, 2026") - only the date suffix is in scope */
        [/ · renews Aug 1, 2026$/, " · يتجدد في 1 أغسطس 2026"],
        /* shard 18 — forgot-password-otp.html: assets/js/auth.js countdown() rewrites this
        text node every second (`Resend in ${s}s`), so only a regex catches every tick */
        [/^Resend in (\d+)s$/, "إعادة الإرسال خلال $1 ثانية"],
        /* shard 23 — assigned-services.html: list-card service count + the assign-lists
        modal's "N list(s) selected" counters (both patterns are unique to this page —
        verified no other page renders this exact shape — so a sitewide regex is safe) */
        [/^(\d+) services$/, "$1 خدمات"],
        [/^(\d+) list\(s\) selected$/, "$1 قائمة محددة"],
        /* shard 24 — assigned-services.html: service-card stat pills + counters that
        interpolate a live count, so exact AR_VOCAB entries can't catch them.
        "SAR · Max N [· D min]" is one combined text node in the (previously
        entirely-unlocalized) Services Preview popup, so both the with- and
        without-duration shapes are handled in a single rule each here. */
        [/^(\d+) \/ (\d+) services selected$/, "$1 / $2 خدمات محددة"],
        [/^(\d+)\/(\d+) services assigned$/, "$1/$2 خدمات معينة"],
        [/^(\d+) already assigned$/, "$1 معينة مسبقاً"],
        [/^Max: (\d+)$/, "الحد الأقصى: $1"],
        [/^(\d+(?:\.\d+)?) SAR · Max (\d+) · (\d+) min$/, "$1 ريال سعودي · الحد الأقصى $2 · $3 دقيقة"],
        [/^(\d+(?:\.\d+)?) SAR · Max (\d+)$/, "$1 ريال سعودي · الحد الأقصى $2"],
        /* shard 25 — lists-services.html: Services-column link text is
        "${l.servicesCount} Services" (count interpolated) — needs proper Arabic
        singular/dual/plural agreement, not a straight string swap, so 1 and 2
        get dedicated rules (checked before the generic 3+ rule below). */
        [/^1 Services$/, "خدمة واحدة"],
        [/^2 Services$/, "خدمتان"],
        [/^(\d+) Services$/, "$1 خدمات"],
        /* shard 25 — lists-services-detail.html: page heading is one interpolated
        text node ("${list.name} - Services") set via textContent — the list
        name is business data and stays as-is, only the " - Services" suffix
        is UI chrome */
        [/^(.+) - Services$/, "$1 - الخدمات"],
        /* shard 26 — profile.html: the Update-email OTP screen's #otpDest text is
        built as a template literal `Verification code is sent to ${v}` where v
        is the email address the user just typed (business/user data, kept
        as-is) — the exact-match "Verification code is sent to your phone"
        entry above still wins for the phone flow since AR_VOCAB is checked
        before AR_REGEX. */
        [/^Verification code is sent to (.+)$/, "تم إرسال رمز التحقق إلى $1"],
    ];

    function arInit() {
        document.documentElement.lang = "ar";
        /* shard 21 — translate the <title> tag itself (arabize() only ever walks
       document.body, so the browser-tab title was never touched by any pass).
       round-2 fix: every page's title is "<Page Title> · HighFive" - an
       exact-match lookup on the WHOLE string almost never hits since the
       dictionary only has the prefix on its own (e.g. "Account Settings",
       not "Account Settings · HighFive"). Split on the separator and
       translate just the prefix, falling back to the old whole-string
       lookup for the rare page whose title doesn't follow that shape. */
        if (AR_VOCAB[document.title]) {
            document.title = AR_VOCAB[document.title];
        } else {
            const parts = document.title.split(" · ");
            if (parts.length === 2 && AR_VOCAB[parts[0]])
                document.title = AR_VOCAB[parts[0]] + " · " + parts[1];
        }
        /* Layer 1: nav model (before any renderer reads it). Translate the canonical
       RD.NAV_FULL (not just the possibly-permission-filtered RD.NAV, #2525/#2526) so the
       translation survives any later re-filter — RD.applyPermissions clones group/parent
       objects from RD.NAV_FULL, so mutating a filtered clone's label/title would be lost
       the next time permissions are (re)applied (e.g. once GET /auth/me resolves). */
        RD.NAV_FULL.forEach((g) => {
            const arLabel = AR_GROUPS[g.label];
            if (arLabel) {
                SECTION_ICON[arLabel] = SECTION_ICON[g.label];
                g.label = arLabel;
            }
            RD.leaves(g.items)
                .concat(g.items)
                .forEach((it) => {
                    if (AR_NAV[it.id]) it.title = AR_NAV[it.id];
                    if (it.badge === "New") it.badge = "جديد";
                });
        });
        /* Re-derive RD.NAV/RD.FLAT from the now-translated RD.NAV_FULL, preserving whichever
       permission set is currently active (identity when RD.NAV was never narrowed). */
        if (RD.NAV !== RD.NAV_FULL)
            RD.applyPermissions(RD.currentPermissions());
        else
            RD.FLAT = RD.NAV.flatMap((g) =>
                RD.leaves(g.items).map((it) =>
                    Object.assign({ group: g.label }, it),
                ),
            );
        /* Layer 2: content pass after the page's own script has rendered
       (the page loader overlay covers the swap) + observer for re-renders */
        const run = () => {
            arabize(document.body);
            const mo = new MutationObserver(() => {
                if (arabize.__pending) return;
                arabize.__pending = true;
                requestAnimationFrame(() => {
                    arabize.__pending = false;
                    mo.disconnect();
                    arabize(document.body);
                    mo.observe(document.body, {
                        childList: true,
                        subtree: true,
                        characterData: true,
                    });
                });
            });
            mo.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true,
            });
        };
        if (document.readyState === "complete") run();
        else window.addEventListener("load", run, { once: true });
    }
    /* Exposed so pages with no RD.boot() call (the auth scaffold - see
     assets/js/auth.js) can still translate under dir="rtl". */
    RD.arInit = arInit;

    /* Looks up a single English phrase the same way arabize()'s per-text-node
     walk does (exact AR_VOCAB match, then AR_REGEX fallback) - returns
     undefined if no translation is known. Exposed so call sites that insert
     content OUTSIDE the normal render pass (RD.toast, any innerHTML built
     from a JS string at runtime) can translate at insertion time instead of
     relying on the MutationObserver in arInit() to catch it after the fact,
     which - confirmed by testing - is intermittent for content that arrives
     asynchronously (e.g. after a click handler's own delay). */
    function arLookup(t) {
        let out = AR_VOCAB[t];
        if (out === undefined) {
            for (const [re, rep] of AR_REGEX) {
                if (re.test(t)) {
                    out = t.replace(re, rep);
                    break;
                }
            }
        }
        return out;
    }
    RD.arLookup = arLookup;
    /* only translate strings while the page is actually in Arabic mode - same
     condition arInit() itself is gated behind. */
    RD.t = function (str) {
        if (document.documentElement.lang !== "ar") return str;
        const out = arLookup(str);
        return out === undefined ? str : out;
    };
    /* Several pages build a date display string as one pre-concatenated text
     node, e.g. `${DAYS[d.getDay()]}, ${dd}/${mm}/${yyyy}` - arabize()'s
     exact-match walk can't translate just the weekday portion of that, so
     the day name stayed English everywhere this pattern was used (same root
     cause finance.html's MONTHS_AR fix already solved for month names).
     RD.weekdayName reuses AR_VOCAB's own Sunday..Saturday entries instead of
     duplicating the translations, so pages can call
     `${RD.weekdayName(d.getDay())}, ${dd}/${mm}/${yyyy}` and get the correct
     language automatically. */
    const EN_WEEKDAYS = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    RD.weekdayName = function (i) {
        return RD.t(EN_WEEKDAYS[i]);
    };
    /* Forces an immediate re-translation of a subtree instead of waiting for
     the MutationObserver in arInit() to catch it - use right after setting
     .innerHTML on content that's injected long after page load (e.g. a
     modal body built from a click handler), where the observer's
     rAF-debounced re-fire has proven unreliable/intermittent in testing. */
    RD.retranslate = function (root) {
        if (document.documentElement.lang === "ar") arabize(root || document.body);
    };

    function arabize(root) {
        const SKIP = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, KBD: 1 };
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(n) {
                if (!n.nodeValue || !n.nodeValue.trim())
                    return NodeFilter.FILTER_REJECT;
                if (n.parentElement && SKIP[n.parentElement.tagName])
                    return NodeFilter.FILTER_REJECT;
                /* initials ("OK" for Omar Khalid) and anything marked
                   translate="no" are names, not words — never translate them */
                if (n.parentElement && n.parentElement.closest(".avatar, [translate=\"no\"], .notranslate"))
                    return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            },
        });
        let n;
        while ((n = walker.nextNode())) {
            const raw = n.nodeValue,
                t = raw.trim();
            const out = arLookup(t);
            if (out !== undefined && out !== t) n.nodeValue = raw.replace(t, out);
        }
        root.querySelectorAll("[placeholder]").forEach((el) => {
            const v =
                AR_PLACEHOLDERS[el.placeholder] || AR_VOCAB[el.placeholder];
            if (v) el.placeholder = v;
        });
        /* mobile card-view labels render from data-label via ::before */
        root.querySelectorAll("[data-label]").forEach((el) => {
            const v = AR_VOCAB[el.dataset.label];
            if (v) el.dataset.label = v;
        });
        root.querySelectorAll("[aria-label]").forEach((el) => {
            const v = AR_VOCAB[el.getAttribute("aria-label")];
            if (v) el.setAttribute("aria-label", v);
        });
        /* title="" tooltips (e.g. the bookings-details.html Start-Meeting wrapper)
       were never translated at all - arabize() had no pass for this attribute.
       Mirrors the placeholder/aria-label passes above. */
        root.querySelectorAll("[title]").forEach((el) => {
            const v = AR_VOCAB[el.title];
            if (v) el.title = v;
        });
        /* Context-scoped override: a handful of source strings are ambiguous in
       isolation (e.g. "Open" reads as the verb "فتح" via the generic
       command-palette entry, but as the adjective "مفتوح" on a membership-
       length radio / Booking Frequency radio / status badge) - elements
       that carry data-ar win over the plain text-node pass above. */
        root.querySelectorAll("[data-ar]").forEach((el) => {
            if (el.textContent.trim()) el.textContent = el.dataset.ar;
        });
    }

    /* =====================================================================
     ACCESS GUARD (#2525/#2526) — session + permission enforcement for every
     page that calls RD.boot(). Auth pages (login, registration, forgot/reset
     password) never call RD.boot, so they're naturally exempt. Pages that
     don't load assets/js/api.js (e.g. archived revisions/ snapshots) are
     exempt too — see the `if (window.API)` guard where RD.NAV is first
     narrowed, above.
     ===================================================================== */
    function redirectToLogin() {
        const back = encodeURIComponent(location.pathname + location.search);
        /* login.html is the static, view-only design reference (no API calls);
       login-live.html is the real, backend-wired entry point (#2525/#2526). */
        location.replace("login-live.html?redirect=" + back);
    }
    /* Deep link outside the user's permissions (#2525 AC): swap the page's own
     content for a 403 message + "Back to Dashboard" button, composed from the
     empty-state pattern (design-system/components/empty-state.md). */
    /* reason "system": the session is valid, but it carries no access to THIS
     design system (the backend grants permissions per system now — the account
     may well hold the User one). That is an account matter, not a permission
     one, so the copy says so, and the way out is a different account rather
     than a Dashboard this session cannot open either. */
    function renderForbidden(reason) {
        const main = document.querySelector(".content");
        if (!main) return;
        const copy =
            reason === "system"
                ? {
                      title: "This account can't open the Super Admin design system",
                      body: "Your account doesn't include access to this design system. Ask your Super Admin to grant it.",
                  }
                : {
                      title: "You don't have access to this page",
                      body: "Ask your Super Admin to grant this permission if you need it.",
                  };
        const action =
            reason === "system"
                ? `<button class="btn btn--sm" id="forbiddenLogin">Log in with a different account</button>`
                : `<button class="btn btn--sm" id="forbiddenBack">Back to Dashboard</button>`;
        main.innerHTML = `<div class="row" style="min-height:60vh;align-items:center;justify-content:center">
      <div class="card card--pad stack gap-3" style="text-align:center;align-items:center;max-width:320px">
        <span style="width:48px;height:48px;border-radius:var(--radius-full);background:var(--color-danger-subtle);color:var(--color-danger);display:grid;place-items:center">${ic("lock")}</span>
        <div><b class="t-sm">${copy.title}</b><p class="t-xs text-tertiary" style="margin-top:2px">${copy.body}</p></div>
        ${action}
      </div>
    </div>`;
        const login = document.getElementById("forbiddenLogin");
        if (login)
            login.addEventListener("click", () => {
                /* End the session BEFORE navigating. login-live.html sends an
                   already-authenticated visitor straight back into the app, so
                   leaving the token in place would bounce them onto this same
                   wall and the button would look broken. Navigate whether or
                   not the server-side call succeeds. */
                const go = () => location.replace("login-live.html");
                if (window.API) API.logout().then(go, go);
                else go();
            });
        const btn = document.getElementById("forbiddenBack");
        if (btn)
            btn.addEventListener(
                "click",
                () => (location.href = "index.html"),
            );
    }
    /* Backend unreachable / misconfigured deployment (missing or un-substituted
     assets/js/env.js, DNS/CORS/network failure, 5xx, or any other non-401
     failure talking to /auth/me) — swap the page's own content for a clear
     "can't reach the server" state instead of leaving whatever was already
     painted (cached/default permissions, static markup) on screen, which
     would otherwise look like the app "let you in" with no real session. */
    function renderApiError() {
        const main = document.querySelector(".content");
        if (!main) return;
        main.innerHTML = `<div class="row" style="min-height:100vh;align-items:center;justify-content:center; position:absolute; top:0; left:0; right:0; bottom:0; z-index:1000; background-color: var(--color-canvas);">
      <div class="card card--pad stack gap-3" style="text-align:center;align-items:center;max-width:340px">
        <span style="width:48px;height:48px;border-radius:var(--radius-full);background:var(--color-danger-subtle);color:var(--color-danger);display:grid;place-items:center">${ic("server")}</span>
        <div><b class="t-sm">Can't connect to the server</b><p class="t-xs text-tertiary" style="margin-top:2px">We couldn't reach the backend to verify your session. Check your connection and try again.</p></div>
        <button class="btn btn--sm" id="apiErrorRetry">Retry</button>
      </div>
    </div>`;
        const btn = document.getElementById("apiErrorRetry");
        if (btn) btn.addEventListener("click", () => location.reload());
    }
    function enforceAccess(ctx) {
        if (!window.API)
            return; /* no api.js on this page — nothing to enforce, unchanged behaviour */
        if (!API.isConfigured()) {
            renderApiError();
            return;
        }
        API.me()
            .then((res) => {
                /* Multiple design systems (backend change, 2026-08-16): api.js
           has already picked THIS system out of the user's list and scoped
           res.permissions to it — never the flat union beside it, which
           would hand this deck the User system's keys. res.systems is null
           on the older flat backend; only a session that genuinely carries
           systems, none of which is this one, is refused here. */
                const systems = res && res.systems;
                const system = res && res.system;
                if (systems && !system) {
                    renderForbidden("system");
                    return;
                }
                const permissions = (res && res.permissions) || ["dashboard"];
                try {
                    sessionStorage.setItem(
                        "hf_permissions",
                        JSON.stringify(permissions),
                    );
                } catch (e) {}
                window.HF = window.HF || {};
                HF.session = {
                    profile: res && res.profile,
                    permissions: permissions,
                    system: system || null,
                    systems: systems || null,
                };
                RD.applyPermissions(permissions);
                /* let page scripts that render session-dependent copy (the
                   dashboard's "Welcome back <name>") refresh now the profile
                   is actually known — they paint before this resolves. */
                document.dispatchEvent(
                    new CustomEvent("hf:session", { detail: HF.session }),
                );
                /* repaint chrome now the real, server-resolved permission set (and profile) is
         known — first paint above used the cached/default set to avoid a flash. */
                applyTopbar(readStyle("rd-navbar-style", 5), ctx);
                applySidebar(readStyle("rd-sidebar-style", 5), ctx);
                /* Every docs-mode page — Foundations/Components/Templates AND every Features
         story page under the features/ folder — lives inside the Design System group,
         so it is always gated by the single "design-system" key, never by whatever activeId
         it borrows to highlight a related sidebar item (e.g. the QR Scan stories pass
         activeId:"bookings" purely for nav-highlight context, not because they need
         the "booking" permission). ctx.docs is how every one of those pages already
         self-identifies (see the initDocsMode() call below in RD.boot). */
                const requiredKey = ctx.docs
                    ? "design-system"
                    : RD.permKeyForActiveId(ctx.activeId);
                if (requiredKey && !new Set(permissions).has(requiredKey))
                    renderForbidden();
            })
            .catch((err) => {
                if (err && err.status === 401) {
                    redirectToLogin();
                    return;
                }
                /* Any other failure (network/CORS error, DNS failure, misconfigured
         API_BASE_URL, 5xx, ...) used to "fail open" on the already-rendered,
         cached-permission chrome — that let a completely unreachable backend
         look like a successfully loaded page with no real session behind it.
         Show a clear error state instead; the user can retry once the backend
         is actually reachable. */
                renderApiError();
            });
    }

    /* =====================================================================
     BOOT
     ===================================================================== */
    RD.boot = function (ctx) {
        ctx = ctx || {};
        RD.__activeId = ctx.activeId;
        const embed = new URLSearchParams(location.search).has("rdpreview");

        /* Broken deployment (env.js missing / never regenerated from the envsubst
       template / blank API_BASE_URL): the backend is unreachable no matter
       what, so don't bother redirecting to login (it would fail there too) —
       show the connection-error state right away instead of the page's own
       (static) content. */
        if (window.API && !API.isConfigured()) {
            renderApiError();
            return;
        }

        /* No/expired token -> straight to login, before any chrome or content
       paints (#2525 AC: "Expired/invalid token on any request -> redirect
       to the login page"). */
        if (window.API && (!API.getToken() || API.isExpired())) {
            API.clearSession();
            redirectToLogin();
            return;
        }

        RD.pageLoader();
        try {
            document.documentElement.setAttribute(
                "data-theme",
                localStorage.getItem("rd-theme") === "1" ? "dark" : "light",
            );
            document.documentElement.dir =
                localStorage.getItem("rd-dir") === "1" ? "rtl" : "ltr";
        } catch (e) {}

        /* Arabic mode: RTL is a language choice, not just a direction — translate
       the nav model BEFORE any renderer reads it, then the page content on load. */
        if (document.documentElement.dir === "rtl") arInit();

        applyTopbar(readStyle("rd-navbar-style", 5), ctx);
        applySidebar(readStyle("rd-sidebar-style", 5), ctx);

        const app = document.getElementById("app");
        const scrim = app && app.querySelector(".scrim");
        if (scrim)
            scrim.addEventListener("click", () =>
                app.classList.remove("nav-open"),
            );
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && app) app.classList.remove("nav-open");
        });

        applyDensity();

        /* Design-system documentation pages get a distinct "docs" treatment so
       they never read as product screens (ribbon + blueprint canvas). */
        if (
            ctx.activeId === "components" ||
            ctx.activeId === "templates" ||
            ctx.activeId === "foundations" ||
            ctx.docs
        )
            initDocsMode();

        /* A little "hi" from the brand mark on load — plays the same wave
       .hf-logo-mask:hover already gets, once, shortly after the page
       settles (feels like a greeting, not a layout-shift twitch). Hovering
       the logo afterward replays it via the CSS :hover rule alone. */
        setTimeout(() => {
            document.querySelectorAll(".hf-logo-mask").forEach((el) => {
                el.classList.add("hf-wave-play");
                el.addEventListener(
                    "animationend",
                    () => el.classList.remove("hf-wave-play"),
                    { once: true },
                );
            });
        }, 350);


        enforceAccess(ctx);
    };

    /* =====================================================================
     FEATURES ACCORDION - nested inside the Design System group, rendered
     from the single registry features/features.js (window.HF.FEATURES).
     docs: design-system/docs/07-features-workflow.md
     ===================================================================== */
    function ensureFeatures() {
        if (window.HF && window.HF.FEATURES) {
            renderFeatures();
            return;
        }
        if (document.getElementById("featuresRegistry"))
            return; /* already loading */
        const s = document.createElement("script");
        s.id = "featuresRegistry";
        s.src = "features/features.js";
        s.onload = renderFeatures;
        s.onerror =
            () => {}; /* no registry yet — the accordion simply doesn't render */
        document.head.appendChild(s);
    }

    function renderFeatures() {
        const mount = document.getElementById("dsFeatures");
        const feats = window.HF && window.HF.FEATURES;
        if (!mount || !feats || !feats.length) return;
        const isAr = document.documentElement.lang === "ar";
        /* the static server serves clean URLs (/booking-new) — compare without .html */
        const norm = (p) => (p.split("/").pop() || "").replace(/\.html$/, "");
        const here = norm(location.pathname);
        let open = false;
        try {
            open = localStorage.getItem("rd-features-open") === "1";
        } catch (e) {}
        const activeFeat = feats.find((f) =>
            f.stories.some((st) => norm(st.href) === here),
        );
        if (activeFeat) {
            open = true;
            /* surface the whole path: the parent DS accordion opens too */
            const gEl = document.getElementById("dsGroup"),
                tEl = document.getElementById("dsToggle");
            if (gEl && !gEl.classList.contains("is-open")) {
                gEl.classList.add("is-open");
                if (tEl) tEl.setAttribute("aria-expanded", "true");
            }
        }
        mount.innerHTML = `
      <button class="feat-head ${open ? "is-open" : ""}" id="featToggle" aria-expanded="${open}">
        ${ic("flash")}<span>${isAr ? "الميزات" : "Features"}</span>${ic("chevronDown")}
      </button>
      <div class="feat-body ${open ? "is-open" : ""}">
        ${feats
            .map((f) => {
                const fOpen = activeFeat && activeFeat.id === f.id;
                return `
          <div class="feat-item ${fOpen ? "is-open" : ""}" data-feat="${f.id}">
            <button class="feat-item__head" aria-expanded="${fOpen}">
              <span>${isAr && f.name_ar ? f.name_ar : f.name}</span>
              <code class="feat-ver">v${f.version}</code>${ic("chevronDown")}
            </button>
            <div class="feat-stories">
              ${f.stories.map((st) => `<a class="feat-story ${norm(st.href) === here ? "is-active" : ""}" href="${st.href}">${isAr && st.title_ar ? st.title_ar : st.title}</a>`).join("")}
            </div>
          </div>`;
            })
            .join("")}
      </div>`;
        document.getElementById("featToggle").addEventListener("click", () => {
            const head = document.getElementById("featToggle");
            const body = mount.querySelector(".feat-body");
            const on = head.classList.toggle("is-open");
            body.classList.toggle("is-open", on);
            head.setAttribute("aria-expanded", on);
            writeStyle("rd-features-open", on ? "1" : "0");
        });
        mount.querySelectorAll(".feat-item__head").forEach((h) => {
            h.addEventListener("click", () => {
                const item = h.closest(".feat-item");
                const on = item.classList.toggle("is-open");
                h.setAttribute("aria-expanded", on);
            });
        });
    }

    function initDocsMode() {
        const app = document.getElementById("app");
        if (!app || document.getElementById("docsRibbon")) return;
        app.classList.add("is-docs");
        const ribbon = document.createElement("div");
        ribbon.className = "docs-ribbon";
        ribbon.id = "docsRibbon";
        ribbon.innerHTML = `${ic("layers")}<span><b>Design System Reference</b><span class="docs-ribbon__sub">What you see here is component documentation, not a product page.</span></span><a href="index.html">Open the product ↗</a>`;
        const tabs = document.getElementById("topTabsMount");
        const topbar = document.getElementById("topbarMount");
        (tabs || topbar).insertAdjacentElement("afterend", ribbon);
    }

    /* Mobile bottom tab bar - native-app style primary navigation, shown only
     under 768px (CSS). The four most-used modules get a tab; "More" opens
     the full sidebar as a drawer for everything else. */
    function initTabbar(ctx) {
        if (document.getElementById("rdTabbar")) return;
        const TAB_IDS = ["dashboard", "partners", "bookings", "users"];
        const items = RD.navPick(TAB_IDS);
        const bar = document.createElement("nav");
        bar.className = "rd-tabbar";
        bar.id = "rdTabbar";
        bar.setAttribute("aria-label", "Primary");
        bar.innerHTML =
            items
                .map(
                    (it) =>
                        `<a href="${it.href}" class="${it.ids.includes(ctx.activeId) ? "is-active" : ""}" ${it.ids.includes(ctx.activeId) ? 'aria-current="page"' : ""}>${ic(it.icon)}<span>${it.title}</span></a>`,
                )
                .join("") +
            `<button id="rdTabbarMore" aria-label="Open full navigation">${ic("menu")}<span>More</span></button>`;
        document.body.appendChild(bar);
        document
            .getElementById("rdTabbarMore")
            .addEventListener("click", () => {
                document.getElementById("app").classList.add("nav-open");
            });
    }

    /* Mobile app-look bottom nav (shown only ≤640px, CSS-gated) — a visual
     port of the companion app's floating GNav pill (partner-mobile-in-web-design/
     main_screen/main.css .bottomnav): dark rounded pill floating 16px from the
     bottom, active tab = white pill with dark icon + label. Presentation only:
     Home/Schedule are plain links into existing pages, Menu reuses the SAME
     off-canvas drawer the hamburger / tabbar "More" already toggle (.nav-open). */
    function initMobileAppNav(ctx) {
        if (document.getElementById("rdMobileNav")) return;
        const isAr = document.documentElement.lang === "ar";
        const active =
            ctx.activeId === "dashboard"
                ? "home"
                : String(ctx.activeId || "").indexOf("scheduling") === 0
                  ? "schedule"
                  : "menu";
        const items = [
            {
                key: "home",
                icon: "home",
                label: isAr ? "الرئيسية" : "Home",
                href: "index.html",
            },
            {
                key: "schedule",
                icon: "calendar",
                label: isAr ? "الجدولة" : "Schedule",
                href: "scheduling.html",
            },
            { key: "menu", icon: "menu", label: isAr ? "القائمة" : "Menu" },
        ];
        const nav = document.createElement("nav");
        nav.className = "rd-mobilenav";
        nav.id = "rdMobileNav";
        nav.setAttribute("aria-label", "App navigation");
        nav.innerHTML = items
            .map((it) => {
                const on = it.key === active;
                const cls = `rd-mobilenav__btn${on ? " is-active" : ""}`;
                const inner = `${ic(it.icon)}<span class="rd-mobilenav__label">${it.label}</span>`;
                return it.href
                    ? `<a class="${cls}" href="${it.href}"${on ? ' aria-current="page"' : ""}>${inner}</a>`
                    : `<button type="button" class="${cls}" id="rdMobileNavMenu" aria-label="Open full navigation">${inner}</button>`;
            })
            .join("");
        document.body.appendChild(nav);
        document
            .getElementById("rdMobileNavMenu")
            .addEventListener("click", () => {
                document.getElementById("app").classList.add("nav-open");
            });
    }

    /* App-style profile header — visual port of the companion app's Home
     profile section (partner-mobile-in-web-design/home: .profile — avatar +
     two-line identity on the start side, notification bell on the end side).
     Phone width only: CSS shows .rd-appheader ≤640px and hides the web
     .topbar/#topTabsMount in the same breath (scoped via body:has(#rdAppHeader)
     so embedded rdpreview iframes, which skip this init, keep their topbar).
     The bell reuses the EXISTING notifications popover: initNotif's delegated
     document-level click handler matches #rdAppHeaderBell alongside #notifBtn,
     and its syncDot targets both bells — no second popover, one source of truth. */
    function syncMobileAppHeader() {
        const el = document.getElementById("rdAppHeader");
        if (!el) return;
        const p = currentProfile(); /* same live-session model the sidebar user row + topbar avatar use */
        const isAr = document.documentElement.lang === "ar";
        const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";
        el.innerHTML = `<span class="avatar rd-appheader__avatar" aria-hidden="true">${avatarInner(p)}</span>
      <span class="rd-appheader__meta">
        <b class="rd-appheader__name">${p.name}</b>
        <span class="rd-appheader__sub">${isAr ? "سوبر أدمن هاي فايف" : "HighFive Super Admin"}</span>
      </span>
      <button type="button" class="icon-btn rd-appheader__act" id="rdAppHeaderLang" aria-label="${isAr ? "Switch to English" : "التبديل إلى العربية"}">${ic("globe")}</button>
      <button type="button" class="icon-btn rd-appheader__act" id="rdAppHeaderTheme" aria-label="Toggle light/dark theme">${ic(isDark ? "sun" : "moon")}</button>
      <button type="button" class="icon-btn rd-appheader__bell" id="rdAppHeaderBell" aria-label="Notifications">${ic("bell")}</button>`;
        /* the repaint just replaced the bell node — pull the unread dot back */
        if (RD.__notifSyncDot) RD.__notifSyncDot();
        /* theme + language toggles (owner: the companion app lacks both, so
       the responsive header carries them) — same mechanics as the topbar's
       #themeBtn/#dirBtn in wireTopbar: theme flips live + persists rd-theme;
       language persists rd-dir then reloads (arInit's one-way text walk has
       no live undo — see the comment on dirBtn). */
        const themeBtn = document.getElementById("rdAppHeaderTheme");
        if (themeBtn)
            themeBtn.addEventListener("click", () => {
                const t =
                    document.documentElement.getAttribute("data-theme") ===
                    "dark"
                        ? "light"
                        : "dark";
                document.documentElement.setAttribute("data-theme", t);
                writeStyle("rd-theme", t === "dark" ? 1 : 0);
                syncMobileAppHeader(); /* re-render swaps the sun/moon icon */
            });
        const langBtn = document.getElementById("rdAppHeaderLang");
        if (langBtn)
            langBtn.addEventListener("click", () => {
                const rtl = document.documentElement.dir !== "rtl";
                writeStyle("rd-dir", rtl ? "1" : "0");
                location.reload();
            });
    }
    function initMobileAppHeader() {
        if (document.getElementById("rdAppHeader")) return;
        const main = document.querySelector(".main");
        if (!main) return;
        const el = document.createElement("header");
        el.className = "rd-appheader";
        el.id = "rdAppHeader";
        main.insertBefore(el, main.firstChild);
        syncMobileAppHeader();
    }

    /* Shared record-detail drawer, reused by every page (booking / customer / etc.) */
    RD.openDrawer = function (title, rows, footButtons) {
        let drawer = document.getElementById("rdDrawer"),
            backdrop = document.getElementById("rdDrawerBackdrop");
        if (!drawer) {
            backdrop = document.createElement("div");
            backdrop.className = "drawer-backdrop";
            backdrop.id = "rdDrawerBackdrop";
            drawer = document.createElement("aside");
            drawer.className = "drawer-live";
            drawer.id = "rdDrawer";
            document.body.appendChild(backdrop);
            document.body.appendChild(drawer);
            const close = () => {
                drawer.classList.remove("is-open");
                backdrop.classList.remove("is-open");
            };
            backdrop.addEventListener("click", close);
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") close();
            });
            drawer.addEventListener("click", (e) => {
                if (e.target.closest("[data-drawer-close]")) close();
            });
        }
        drawer.innerHTML = `<div class="drawer__head"><b>${title}</b><button class="icon-btn" data-drawer-close style="width:32px;height:32px" aria-label="Close">${ic("close")}</button></div>
      <div class="drawer__body">${rows.map((r) => `<div class="drawer-body-row"><span>${r[0]}</span><span>${r[1]}</span></div>`).join("")}</div>
      <div class="drawer__foot">${footButtons || '<button class="btn btn--ghost" data-drawer-close>Close</button>'}</div>`;
        drawer.classList.add("is-open");
        backdrop.classList.add("is-open");
    };

    /* Portal any dropdown/popover .menu to <body> and position it with fixed
     coordinates from its trigger's own bounding box. Any menu left nested
     inside a card inherits that card's stacking context - and cards on this
     product animate in on every load (opacity/transform), which creates a
     stacking context of its own for the whole animation. A menu trapped
     inside loses to a later sibling card regardless of its z-index, for as
     long as that animation is running. Portaling to body sidesteps the
     problem entirely instead of chasing every place a transform might appear. */
    RD.portalMenu = function (menu) {
        if (menu && menu.parentElement !== document.body)
            document.body.appendChild(menu);
        return menu;
    };
    /* A portaled menu has to FIT, not just land somewhere.

       This used to clamp the horizontal axis and ignore the vertical one
       entirely: the menu was always placed at `trigger.bottom + 6`, so a
       row near the foot of the page opened a menu that ran off the
       viewport with no scroll. The items were in the DOM and simply could
       not be reached — reported as "Delete is missing" from the Packages
       list, where the longest menu is nine rows.

       It could not have measured itself before, either: every caller
       positions the menu BEFORE adding .is-open, and .menu is
       `display: none` until then, so offsetHeight was 0 and any height
       logic would silently have read zero. The measurement below makes it
       measurable without showing it.

       Order of preference: below the trigger, then above it, then
       whichever side has more room with the menu scrolling inside. */
    RD.positionMenu = function (menu, trigger, align) {
        const r = trigger.getBoundingClientRect();
        const EDGE = 8; /* keep off the viewport edge */
        const GAP = 6; /* breathing room against the trigger */

        menu.style.position = "fixed";
        menu.style.insetInlineEnd = "auto";
        /* cleared before measuring, or a previous placement's cap is
           mistaken for the menu's natural height */
        menu.style.maxHeight = "";
        menu.style.overflowY = "";

        const wasHidden = !menu.classList.contains("is-open");
        let prevVis, prevDisp;
        if (wasHidden) {
            prevVis = menu.style.visibility;
            prevDisp = menu.style.display;
            menu.style.visibility = "hidden";
            menu.style.display = "block";
        }
        const mh = menu.offsetHeight;
        const mw = menu.offsetWidth || 220;
        if (wasHidden) {
            menu.style.visibility = prevVis;
            menu.style.display = prevDisp;
        }

        const below = window.innerHeight - r.bottom - GAP - EDGE;
        const above = r.top - GAP - EDGE;
        let top;
        if (mh <= below) {
            top = r.bottom + GAP;
        } else if (mh <= above) {
            top = r.top - GAP - mh; /* flip above */
        } else if (below >= above) {
            top = r.bottom + GAP;
            menu.style.maxHeight = Math.max(120, below) + "px";
            menu.style.overflowY = "auto";
        } else {
            top = EDGE;
            menu.style.maxHeight = Math.max(120, above) + "px";
            menu.style.overflowY = "auto";
        }
        menu.style.top = Math.max(EDGE, top) + "px";

        let left = align === "end" ? r.right - mw : r.left;
        left = Math.min(Math.max(EDGE, left), window.innerWidth - mw - EDGE);
        menu.style.left = left + "px";
    };

    /* Shared KPI strip - 4 tones cycle automatically so every page's glance row
     reads with color instead of one repeated navy tint, and each tile fades
     up in sequence instead of popping in all at once. */
    RD.kpiStrip = function (items) {
        return items
            .map(
                (k, i) => `
      <div class="card card--pad animate-in" style="animation-delay:${i * 70}ms">
        <div class="row between rd-tone-${i % 4}"><span class="kpi-ic">${ic(k.icon)}</span><span class="badge ${k.up ? "badge--success" : "badge--danger"}">${k.delta}</span></div>
        <div class="t-h2" style="margin:var(--space-3) 0 2px">${k.value}</div>
        <div class="t-sm text-tertiary">${k.label}</div>
      </div>`,
            )
            .join("");
    };

    /* Stagger-fade a list of already-rendered elements (table rows, cards, …) */
    RD.stagger = function (selectorOrList, step) {
        const list =
            typeof selectorOrList === "string"
                ? document.querySelectorAll(selectorOrList)
                : selectorOrList;
        list.forEach((el, i) => {
            el.classList.add("animate-in");
            el.style.animationDelay = i * (step || 45) + "ms";
        });
    };

    /* =====================================================================
     TOAST QUEUE - the shared toast emitter every page uses instead of a
     local helper. Queue rules (pattern: toast-queue.md): one stack, newest
     on top, max 3 visible (oldest leaves), auto-dismiss 5s / 8s with an
     action, timer pauses on hover, action button fires once then closes.
       RD.toast("success", "Booking cancelled.", { action: "Undo", onAction: fn })
     ===================================================================== */
    RD.toast = function (kind, msg, opts) {
        opts = opts || {};
        msg = RD.t(msg);
        if (opts.action) opts.action = RD.t(opts.action);
        let stack = document.getElementById("rdToasts");
        if (!stack) {
            stack = document.createElement("div");
            stack.className = "toast-stack";
            stack.id = "rdToasts";
            document.body.appendChild(stack);
        }
        while (stack.children.length >= 3) stack.lastElementChild.remove();
        const el = document.createElement("div");
        el.className =
            "toast" + (kind && kind !== "info" ? " toast--" + kind : "");
        el.setAttribute("role", kind === "danger" ? "alert" : "status");
        el.innerHTML = `<span class="toast__icon">${ic(kind === "success" ? "check" : kind === "danger" ? "close" : kind === "warn" ? "warn" : "info")}</span>
      <p>${msg}</p>
      ${opts.action ? `<button class="toast__action">${opts.action}</button>` : ""}
      <button aria-label="Dismiss">${ic("close")}</button>`;
        const life = opts.duration || (opts.action ? 8000 : 5000);
        let timer = setTimeout(dismiss, life);
        function dismiss() {
            clearTimeout(timer);
            el.remove();
        }
        el.addEventListener("mouseenter", () => clearTimeout(timer));
        el.addEventListener("mouseleave", () => {
            clearTimeout(timer);
            timer = setTimeout(dismiss, 2500);
        });
        el.querySelector("[aria-label='Dismiss']").addEventListener(
            "click",
            dismiss,
        );
        const act = el.querySelector(".toast__action");
        if (act)
            act.addEventListener("click", () => {
                dismiss();
                if (opts.onAction) opts.onAction();
            });
        stack.prepend(el); /* newest on top */
        return dismiss;
    };
})();

