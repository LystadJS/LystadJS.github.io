(() => {
  "use strict";

  const explorer = document.querySelector(".empirical-explorer");
  const map = document.getElementById("empirical-map");
  const panel = document.getElementById("empirical-panel");
  const filters = document.getElementById("empirical-filters");
  const note = document.querySelector(".empirical-map-note");
  const legend = document.querySelector(".empirical-legend span:last-child");

  if (!explorer || !map || !panel || !filters) return;

  function normalizeAppliedMode() {
    if (!explorer.classList.contains("is-un-mode")) return;

    /* Global/multilateral scope belongs in the panel, not on the country map. */
    map.querySelectorAll(".jvm-region.empirical-region--un-scope:not(.empirical-region--un-specific)")
      .forEach(region => region.classList.remove("empirical-region--un-scope"));

    if (legend) legend.textContent = "Applied project setting";
    if (note) note.textContent = "Only countries tied to country-specific applied work are highlighted";
  }

  filters.addEventListener("click", () => queueMicrotask(normalizeAppliedMode));

  const mapObserver = new MutationObserver(() => normalizeAppliedMode());
  mapObserver.observe(map, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"]
  });

  const panelObserver = new MutationObserver(() => normalizeAppliedMode());
  panelObserver.observe(panel, { subtree: true, childList: true });

  normalizeAppliedMode();
})();
