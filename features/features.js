/* ============================================================================
   HIGH FIVE SUPER ADMIN - FEATURES REGISTRY (single source for the sidebar accordion)
   Schema: { id, name, name_ar?, version, stories: [{ id, title, title_ar?, href }] }
   Versioning: MINOR = new story · PATCH = fix to an existing story's UI · MAJOR = rebuild
   Empty until the first Super Admin user story arrives.
   ========================================================================== */
(function () {
  const HF = (window.HF = window.HF || {});
  HF.FEATURES = [];
})();
