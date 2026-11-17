/* =============================================================================
   HF DATE PICKER - shared flatpickr wrapper
   -----------------------------------------------------------------------------
   Presentation-layer replacement for native <input type="date">. Exposes
   window.HFDatePicker.init(inputOrSelector) which lazy-loads flatpickr from
   CDN (once, mirroring the ensureIdentityFonts() lazy-load convention in
   shell.js) and instantiates it on the given input(s).

   dateFormat is locked to "Y-m-d" - this MUST match native <input type="date">
   value format (always "YYYY-MM-DD" per the HTML spec) so any existing JS that
   reads input.value keeps working unchanged. Do not change this without also
   auditing every page's JS that reads these inputs' .value.

   This file only loads flatpickr's OWN css/js/locale from CDN. The DS-themed
   look (tokens, colors, RTL icon mirroring) lives in assets/css/datepicker.css,
   which pages must link separately - this file does not inject it.
   ============================================================================= */
(function () {
  "use strict";

  var FP_VERSION = "4.6.13";
  var FP_BASE = "https://cdn.jsdelivr.net/npm/flatpickr@" + FP_VERSION;
  var FP_CSS_URL = FP_BASE + "/dist/flatpickr.min.css";
  var FP_JS_URL = FP_BASE + "/dist/flatpickr.min.js";
  var FP_AR_URL = FP_BASE + "/dist/l10n/ar.js";

  var loadPromise = null;

  /* Lazy-loads flatpickr's CSS + JS + Arabic locale from CDN exactly once,
     no matter how many times init() is called or how many inputs are passed.
     Same "load on first real use, cache the promise" shape as
     ensureIdentityFonts() in shell.js. */
  function ensureFlatpickr() {
    if (loadPromise) return loadPromise;

    loadPromise = new Promise(function (resolve, reject) {
      if (window.flatpickr) { resolve(); return; }

      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FP_CSS_URL;
      document.head.appendChild(link);

      var script = document.createElement("script");
      script.src = FP_JS_URL;
      script.onload = function () {
        var arScript = document.createElement("script");
        arScript.src = FP_AR_URL;
        arScript.onload = function () { resolve(); };
        arScript.onerror = function () { reject(new Error("HFDatePicker: failed to load flatpickr ar locale from CDN")); };
        document.head.appendChild(arScript);
      };
      script.onerror = function () { reject(new Error("HFDatePicker: failed to load flatpickr from CDN")); };
      document.head.appendChild(script);
    });

    return loadPromise;
  }

  /* RTL calendars need more than a translated locale: flatpickr ships zero
     built-in RTL layout support (verified against its source - no "rtl"
     branching in flatpickr.js itself). The month header, weekday row and day
     grid are plain CSS flex rows, so setting dir="rtl" on the calendar
     container is enough to mirror their visual order for free (flexbox
     row order follows directionality). The one thing that does NOT mirror
     itself is the prev/next chevron glyphs - both still point their original
     LTR way after the flex reversal, so datepicker.css flips each icon
     (scaleX(-1)) the same way this DS already mirrors chevrons elsewhere
     (see [dir="rtl"] .pg-prev/.pg-next svg in components.css). */
  function markRTL(instance) {
    instance.calendarContainer.classList.add("hf-datepicker--rtl");
    instance.calendarContainer.setAttribute("dir", "rtl");
  }

  function instantiate(el) {
    if (!el || el.nodeName !== "INPUT") return null;

    var isRTL = document.documentElement.dir === "rtl";

    return window.flatpickr(el, {
      dateFormat: "Y-m-d",   // MUST stay "Y-m-d" - matches native input[type=date].value exactly
      allowInput: true,
      disableMobile: true,   // keep our themed calendar even on touch/mobile
      locale: isRTL ? "ar" : "default",
      onReady: function (_selectedDates, _dateStr, instance) {
        instance.calendarContainer.classList.add("hf-datepicker");
        if (isRTL) markRTL(instance);
      },
    });
  }

  function toElementList(inputOrSelector) {
    if (typeof inputOrSelector === "string") {
      return Array.prototype.slice.call(document.querySelectorAll(inputOrSelector));
    }
    if (inputOrSelector && typeof inputOrSelector.length === "number") {
      return Array.prototype.slice.call(inputOrSelector);
    }
    if (inputOrSelector) return [inputOrSelector];
    return [];
  }

  /* window.HFDatePicker.init(inputOrSelector)
     Accepts a CSS selector string, a single <input>, or a NodeList/array of
     <input> elements. Returns a Promise resolving to the flatpickr instance
     (or array of instances, for multiple inputs) once flatpickr has loaded
     and been attached. Safe to call more than once on the same input -
     flatpickr itself destroys and re-creates the prior instance. */
  function init(inputOrSelector) {
    return ensureFlatpickr().then(function () {
      var instances = toElementList(inputOrSelector).map(instantiate).filter(Boolean);
      return instances.length === 1 ? instances[0] : instances;
    });
  }

  window.HFDatePicker = { init: init };
})();
