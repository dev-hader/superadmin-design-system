/* ============================================================================
   RUNTIME CONFIG TEMPLATE — do not fill values in here.
   In Docker, the Dockerfile runs `envsubst` on this file at build time
   (value comes from the API_BASE_URL build arg) and writes the result to
   assets/js/env.js, which the pages actually load.
   For local/static preview without Docker, copy this file to
   assets/js/env.js and replace the placeholder yourself.
   ========================================================================== */
window.ENV = {
  API_BASE_URL: "${API_BASE_URL}",
};
