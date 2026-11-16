/* =====================================================================
   AUTH scaffold — shared brand panel + helpers for the pre-login pages
   (login, registration, forgot / reset password). Depends on shell.js
   for RD.icon / RD.toast / RD.phoneCountry / RD.FLAGS (no RD.boot — auth
   pages render no app chrome). Each page provides its own .auth-card form
   and calls AUTH.init(). A page that wants its own .auth-brand content
   (e.g. login-live.html's "value props" panel) marks the <aside
   data-brand="custom"> and fills it itself — init() then leaves it alone
   instead of overwriting it with the generic brand() below.

   init() also injects the shared .lg-deco decoration layer (bloom + wave)
   into .auth, so no page carries that markup either. All of the styling for
   both lives in the "AUTH — brand panel + raised card" section at the end of
   assets/css/components.css.
   ===================================================================== */
window.AUTH = (function () {
    const ic = window.RD ? RD.icon : () => "";
    /* reuse the shell's own identity-aware brand mark (mask-image on
     RD.logoMark, colored via --lime-N/--navy-N — see shell.js/shell.css)
     instead of a separate hardcoded vector, so auth pages track Identity
     #2/#3 the same way the app shell does. */
    const LOGO = window.RD ? `<span style="display:inline-flex;width:26px;height:22px;flex-shrink:0">${RD.logoMark}</span>` : "";
    /* full-size static mark — kept for pages (e.g. login-live.html's own
     custom "value props" brand panel) that render their own markup and
     reference AUTH.BIGLOGO directly instead of going through brand(). */
    const BIGLOGO = `<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13.5V9M8.5 12.5V5.5M12 12V4M15.5 12.5V5.5M19 13.5V9"/><path d="M5 13.5c0 4.2 2.9 7 7 7s7-2.8 7-7"/></svg>`;

    /* Inline vector rather than the .hf-logo-mask mask-image: Chrome refuses
     to load a CSS mask image over file://, so the masked mark vanishes when
     the deck is opened straight from disk. Same paths as
     assets/img/logo-mark.svg, filled with a token-driven gradient
     (.lg-mark__from/__mid/__to in components.css) so identities #2/#3 still
     recolour it. Explicit width/height: base.css's `svg:not([width])` rule
     would otherwise force it to 20x20. Takes a gradient id so the panel mark
     and the card-header mark can both be on the page without colliding. */
    const MARK = (id, w, h) => `<svg class="lg-mark" width="${w}" height="${h}" viewBox="0 0 71.12 58.24" aria-hidden="true">
        <defs>
            <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
                <stop class="lg-mark__from" offset="0" />
                <stop class="lg-mark__mid" offset=".6" />
                <stop class="lg-mark__to" offset="1" />
            </linearGradient>
        </defs>
        <g fill="url(#${id})">
            <path d="M9.19 34.39C8.66 33.98 8.39 33.32 6.29 32.44 4.52 31.7 2 32.73 2.07 35.06 2.15 37.81 7.95 50.58 10.44 53.63 12.15 55.74 16.3 54.67 16.78 51.56 17.46 47.1 11.6 36.26 9.19 34.39" />
            <path d="M57.86 13.44C56.88 13.08 53.96 13.48 51.32 19.16 49.99 22.02 45.55 38.6 45.63 40.58 45.75 43.74 50.36 45.81 52.67 42.28 53.44 41.11 59.78 19.81 60.15 18.41 60.95 15.37 59.63 14.07 57.86 13.44" />
            <path d="M33.57 5.08C32.57 4.75 30.43 5.64 27.22 11.03 25.3 14.24 20.01 34.86 19.9 41.69 19.81 47.32 25.82 46.77 27.05 43.99 29.87 37.62 35.64 11.65 36.03 9.96 36.72 6.9 35.36 5.65 33.57 5.08" />
            <path d="M66.39 28.04C65.4 27.69 62.48 28.08 59.84 33.76 58.93 35.72 54.31 49.26 54.65 51.63 55.03 54.21 59.1 56.24 61.35 53.21 61.99 52.35 62.74 49.48 63.38 47.41 65.82 39.58 68.02 33.43 68.31 32.3 69.12 29.26 68.16 28.68 66.39 28.04" />
            <path d="M50.27 7.33C51.07 4.29 49.76 3 47.98 2.36 47 2 44.08 2.39 41.44 8.08 39.7 11.81 32.43 33.12 33.95 37.77 34.71 40.1 37.95 41.32 40.38 38.99 42.69 36.78 49.81 9.09 50.27 7.33" />
        </g>
    </svg>`;

    /* The approved login.html brand panel (2026-08-06), now the shared one:
     lockup, display headline, three product-true feature rows. Arabic rides
     on data-ar so arabize() swaps the leaf text without needing AR_VOCAB
     entries for brand copy. Styling lives in components.css's
     "AUTH — brand panel + raised card" section. */
    const brand = () => `
    <div class="lg-lockup">${MARK("lgMarkGrad", 58, 48)}<span class="lg-wordmark">High<b>Five</b></span></div>

    <div class="lg-d__head" style="--d:.1s">
        <h2 class="lg-h">
            <span data-ar="كل وحدة،">Every unit,</span><br />
            <span data-ar="كل جلسة">every session</span>
        </h2>
        <div class="lg-h__soft" data-ar="جدول واحد.">one schedule.</div>
    </div>

    <div class="lg-feats">
        <div class="lg-feat" style="--d:.25s">
            <span class="lg-feat__ic" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            <div>
                <div class="lg-feat__t" data-ar="جدولة ذكية">Smart scheduling</div>
                <div class="lg-feat__s" data-ar="الجلسات والمواعيد والفعاليات في مكان واحد.">Sessions, slots and events in one place.</div>
            </div>
        </div>
        <div class="lg-feat" style="--d:.35s">
            <span class="lg-feat__ic" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14h1M14 20h1M20 20h1"/></svg></span>
            <div>
                <div class="lg-feat__t" data-ar="الحجوزات وتسجيل الحضور">Bookings &amp; check-in</div>
                <div class="lg-feat__s" data-ar="من الحجز حتى تسجيل الحضور بالـ QR.">From booking to QR check-in.</div>
            </div>
        </div>
        <div class="lg-feat" style="--d:.45s">
            <span class="lg-feat__ic" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
            <div>
                <div class="lg-feat__t" data-ar="العملاء والعضويات">Customers &amp; memberships</div>
                <div class="lg-feat__s" data-ar="اعرف عملاءك الدائمين ونمِّ عضوياتهم.">Know your regulars, grow their memberships.</div>
            </div>
        </div>
    </div>`;

    /* Decoration layer — a round blurred bloom plus one full-width wave that
     sweeps in from the inline-end edge, behind the card and out the other
     side. Injected as .auth's FIRST child so every auth page gets it without
     carrying the markup; guarded so a second init() can't double it up.
     preserveAspectRatio="none" keeps the wave spanning edge to edge at any
     viewport; the width/height attributes are mandatory (see base.css). */
    const DECO = `<span class="lg-glow"></span>
    <!-- the auth pages' board shape: the quieted "Activity Dots" field
         (owner kept it here, 2026-08-12, after previewing Orbit Paths —
         the orbits now live on the product surfaces instead: dashboard
         hero, support hero, .app::after watermark). Gradient-fill +
         dot-mask: the tile is a fixed 26px pitch in user space with NO
         viewBox, so the dots keep one size and simply repeat, and the
         gradient always spans the full field. -->
    <svg class="lg-shape--dots" width="100%" height="100%" fill="none" aria-hidden="true">
        <defs>
            <linearGradient id="lgDotsGrad" x1="0" y1="0" x2=".62" y2=".68">
                <!-- both stops sit on the mint ramp -->
                <stop class="lg-dots__s1" offset="0" />
                <stop class="lg-dots__s2" offset="1" />
            </linearGradient>
            <pattern id="lgDotTile" width="26" height="26" patternUnits="userSpaceOnUse">
                <circle cx="13" cy="13" r="6.4" fill="#fff" />
            </pattern>
            <radialGradient id="lgDotsFade" cx=".32" cy=".28" r=".66">
                <stop offset="0" stop-color="#fff" stop-opacity="1" />
                <stop offset="1" stop-color="#fff" stop-opacity="0" />
            </radialGradient>
            <mask id="lgDotsFadeMask"><rect width="100%" height="100%" fill="url(#lgDotsFade)" /></mask>
            <mask id="lgDotsMask">
                <!-- nested mask: the dot field itself dissolves outward, so the
                     grid never ends on a hard edge -->
                <g mask="url(#lgDotsFadeMask)"><rect width="100%" height="100%" fill="url(#lgDotTile)" /></g>
            </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#lgDotsGrad)" mask="url(#lgDotsMask)" opacity=".16" />
    </svg>
    <svg class="lg-shape--wave" width="100%" height="100%" viewBox="0 0 1200 400" fill="none" preserveAspectRatio="none">
        <g stroke="currentColor" stroke-width="1.4" stroke-linecap="round" vector-effect="non-scaling-stroke">
            <path d="M1240 40 C 1040 60, 980 168, 800 196 S 470 190, 300 268 S 80 348, -40 344" opacity=".26" />
            <path d="M1240 78 C 1044 98, 986 206, 806 234 S 476 228, 306 306 S 86 386, -40 382" opacity=".17" />
            <path d="M1240 116 C 1048 136, 992 244, 812 272 S 482 266, 312 344 S 92 424, -40 420" opacity=".1" />
        </g>
        <circle class="lg-shape__node--alt" cx="300" cy="268" r="3.4" fill="currentColor" opacity=".7" />
    </svg>`;

    function mountDeco() {
        const a = document.querySelector(".auth");
        if (!a || a.querySelector(":scope > .lg-deco")) return;
        const d = document.createElement("div");
        d.className = "lg-deco";
        d.setAttribute("aria-hidden", "true");
        d.innerHTML = DECO;
        a.prepend(d);
    }

    /* theme + language (RTL/Arabic) toggles — auth pages have no app topbar, so
     mount them here, wired the same way as the shell topbar. */
    function mountTools() {
        if (document.querySelector(".auth-tools")) return;
        const bar = document.createElement("div");
        bar.className = "auth-tools";
        bar.innerHTML = `<button class="icon-btn" id="authDir" aria-label="Toggle text direction (Arabic / RTL)">${ic("globe")}</button>
      <button class="icon-btn" id="authTheme" aria-label="Toggle theme"></button>`;
        document.body.appendChild(bar);
        const theme = bar.querySelector("#authTheme");
        const syncTheme = () => {
            theme.innerHTML =
                document.documentElement.getAttribute("data-theme") === "dark"
                    ? ic("sun")
                    : ic("moon");
        };
        syncTheme();
        theme.addEventListener("click", () => {
            const t =
                document.documentElement.getAttribute("data-theme") === "dark"
                    ? "light"
                    : "dark";
            document.documentElement.setAttribute("data-theme", t);
            try {
                localStorage.setItem("rd-theme", t === "dark" ? "1" : "0");
            } catch (e) {}
            syncTheme();
        });
        const dir = bar.querySelector("#authDir");
        dir.addEventListener("click", () => {
            const rtl = document.documentElement.dir !== "rtl";
            try {
                localStorage.setItem("rd-dir", rtl ? "1" : "0");
            } catch (e) {}
            /* Reload rather than flip `dir` live - same reasoning as the shell
             topbar's own dirBtn (assets/shell.js): switching TO Arabic needs
             RD.arInit() (lang attr + the one-way arabize() text-node walk),
             which only ever runs once at boot; a reload re-applies the value
             just persisted above so the whole page - including this auth
             scaffold - translates correctly on first paint. */
            location.reload();
        });
    }

    const cardLogo = () =>
        `<a class="auth-card__logo" href="login.html">${LOGO}</a>`;

    /* The card header mark (shown once the brand rail collapses under 860px).
     Same inline vector as the rail's, at header size: RD.logoMark is a CSS
     mask-image and needs assets/shell.css, which login-live.html does not
     load — that page rendered an empty gap at the top of the card. */
    const CARDMARK = MARK("lgMarkGradSm", 34, 28);

    function init() {
        mountDeco();
        const b = document.querySelector(".auth-brand");
        if (b && b.dataset.brand !== "custom") b.innerHTML = brand();
        const cl = document.querySelector(".auth-card__logo");
        if (cl) cl.innerHTML = CARDMARK;
        mountTools();

        /* Arabic mode: auth pages render no app shell and so never got
         RD.boot()'s arInit() call - translate the same way the rest of the
         product does whenever the pre-paint script has already set dir=rtl
         (persisted rd-dir from a previous toggle). */
        if (document.documentElement.dir === "rtl" && window.RD && RD.arInit)
            RD.arInit();

        /* fill empty checkbox boxes with the check glyph */
        document
            .querySelectorAll(".check__box:empty")
            .forEach((x) => (x.innerHTML = ic("check")));

        /* password show / hide toggles */
        document.querySelectorAll("[data-eye]").forEach((e) => {
            e.innerHTML = ic("eye");
            e.setAttribute("aria-label", "Show password");
            e.addEventListener("click", () => {
                const f = document.getElementById(e.dataset.eye);
                const showing = f.type === "password";
                f.type = showing ? "text" : "password";
                e.innerHTML = ic(showing ? "eyeOff" : "eye");
                e.setAttribute(
                    "aria-label",
                    showing ? "Hide password" : "Show password",
                );
            });
        });
    }

    /* build an N-box OTP input with auto-advance; returns a getter for the code */
    function otp(mountId, len) {
        len = len || 4;
        const m = document.getElementById(mountId);
        m.innerHTML = Array.from(
            { length: len },
            (_, i) =>
                `<input class="input" maxlength="1" inputmode="numeric" data-otp="${i}" aria-label="Digit ${i + 1}">`,
        ).join("");
        const boxes = [...m.querySelectorAll("[data-otp]")];
        boxes.forEach((box, i) => {
            box.addEventListener("input", () => {
                if (box.value && i < len - 1) boxes[i + 1].focus();
            });
            box.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && !box.value && i > 0)
                    boxes[i - 1].focus();
            });
        });
        boxes[0].focus();
        return () => boxes.map((b) => b.value).join("");
    }

    /* resend countdown on a button + timer element */
    function countdown(btnId, labelId, secs) {
        secs = secs || 30;
        const btn = document.getElementById(btnId),
            lab = document.getElementById(labelId);
        let s = secs,
            t;
        const paint = () => {
            lab.textContent = s > 0 ? `Resend in ${s}s` : "";
            btn.disabled = s > 0;
        };
        clearInterval(t);
        s = secs;
        paint();
        t = setInterval(() => {
            s--;
            if (s < 0) {
                clearInterval(t);
                paint();
                return;
            }
            paint();
        }, 1000);
        return () => {
            s = secs;
            paint();
            t = setInterval(() => {
                s--;
                if (s < 0) {
                    clearInterval(t);
                    paint();
                    return;
                }
                paint();
            }, 1000);
        };
    }

    /* MARK is exported so a page rendering its own custom rail
       (login-live.html) shows the identical brand mark instead of a
       second, differently-drawn one. */
    return { init, otp, countdown, LOGO, BIGLOGO, MARK };
})();
