(() => {
  "use strict";

  const explorer = document.querySelector(".empirical-explorer");
  const map = document.getElementById("empirical-map");
  const panel = document.getElementById("empirical-panel");
  const filters = document.getElementById("empirical-filters");
  const note = document.querySelector(".empirical-map-note");
  const legend = document.querySelector(".empirical-legend span:last-child");

  if (!explorer || !map || !panel || !filters) return;

  function normalizeUNMode() {
    if (!explorer.classList.contains("is-un-mode")) return;

    /* Do not treat global/multilateral scope as country-level coverage. */
    map.querySelectorAll(".jvm-region.empirical-region--un-scope:not(.empirical-region--un-specific)")
      .forEach(region => region.classList.remove("empirical-region--un-scope"));

    if (legend) legend.textContent = "UN project setting";
    if (note) note.textContent = "UN blue = country-specific project settings · global / multilateral work remains listed in the panel";

    const overview = panel.querySelector(".empirical-panel-inner > .empirical-project-question");
    if (overview && /Blue shading represents global or multilateral project scope/i.test(overview.textContent)) {
      overview.textContent = "Only countries tied to country-specific UN work are highlighted in blue. Global and multilateral projects remain listed here without implying country-level coverage.";
    }
  }

  /* The primary explorer rerenders classes and panel content on interaction.
     Re-apply the consistency rule immediately after those updates. */
  filters.addEventListener("click", () => queueMicrotask(normalizeUNMode));

  const mapObserver = new MutationObserver(() => normalizeUNMode());
  mapObserver.observe(map, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"]
  });

  const panelObserver = new MutationObserver(() => normalizeUNMode());
  panelObserver.observe(panel, { subtree: true, childList: true });

  normalizeUNMode();
})();
