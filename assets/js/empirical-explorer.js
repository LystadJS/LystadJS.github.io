(() => {
  "use strict";

  const RESEARCH_CASES = {
    IQ: {
      country: "Iraq",
      themes: ["Political violence", "Terrorism"],
      summary:
        "An empirical setting for research on insurgent violence, ethnosectarian composition, geographic concentration, and target selection.",
      systems: [
        "Insurgent violence",
        "Ethnosectarian geography",
        "Civilian targeting"
      ],
      challenges: [
        "Spatial composition",
        "Event heterogeneity",
        "Target-type variation"
      ],
      methods: [
        "Population-weighted geography",
        "Statistical modeling",
        "Data visualization"
      ],
      projects: [
        {
          title:
            "The Caliphate's Target Map: Ethnosectarian Composition and Insurgent Violence in Iraq",
          status: "Published",
          year: "2026",
          question:
            "How closely did Islamic State attack patterns correspond to district-level ethnosectarian composition and target type?",
          href: null
        }
      ]
    }
  };

  const mapElement = document.getElementById("empirical-map");
  const panel = document.getElementById("empirical-panel");
  const filters = document.getElementById("empirical-filters");

  if (!mapElement || !panel || !filters) return;

  if (typeof window.jsVectorMap === "undefined") {
    panel.innerHTML = `
      <div class="empirical-load-error">
        The geographic explorer could not load. Research entries remain available in the portfolio above.
      </div>
    `;
    console.error("Empirical Settings Explorer: jsVectorMap failed to load.");
    return;
  }

  let activeFilter = "all";
  let lockedCountry = null;
  let previewCountry = null;

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  function pluralize(count, singular, plural = `${singular}s`) {
    return count === 1 ? singular : plural;
  }

  function getCase(code) {
    return RESEARCH_CASES[code] || null;
  }

  function matchesCurrentFilter(code) {
    const item = getCase(code);
    if (!item) return false;
    if (activeFilter === "all") return true;
    return item.themes.includes(activeFilter);
  }

  function tagHTML(items = []) {
    return `
      <div class="empirical-tags">
        ${items.map((item) => `<span class="empirical-tag">${escapeHTML(item)}</span>`).join("")}
      </div>
    `;
  }

  function animatePanel() {
    const inner = panel.querySelector(".empirical-panel-inner");
    if (!inner || !inner.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    inner.animate(
      [
        { opacity: 0.2, transform: "translateX(9px)" },
        { opacity: 1, transform: "translateX(0)" }
      ],
      { duration: 170, easing: "ease-out" }
    );
  }

  function getAllThemes() {
    return [...new Set(Object.values(RESEARCH_CASES).flatMap((item) => item.themes))].sort();
  }

  function renderFilters() {
    const buttons = [
      { value: "all", label: "All settings" },
      ...getAllThemes().map((theme) => ({ value: theme, label: theme }))
    ];

    filters.innerHTML = buttons.map(({ value, label }) => `
      <button
        class="empirical-filter ${activeFilter === value ? "is-active" : ""}"
        type="button"
        data-filter="${escapeHTML(value)}"
        aria-pressed="${activeFilter === value}"
      >
        ${escapeHTML(label)}
      </button>
    `).join("");
  }

  function renderDefaultPanel() {
    const visibleCases = Object.entries(RESEARCH_CASES)
      .filter(([code]) => matchesCurrentFilter(code))
      .map(([, item]) => item);

    const countryCount = visibleCases.length;
    const projectCount = visibleCases.reduce((total, item) => total + item.projects.length, 0);

    panel.innerHTML = `
      <div class="empirical-panel-inner empirical-panel-empty">
        <p class="empirical-panel-kicker">Geographic research explorer</p>
        <h3>Select an empirical setting.</h3>
        <p>
          Highlighted countries contain research associated with that setting.
          Hover for a preview or select a country for the complete research record.
        </p>
        <div class="empirical-summary">
          <div class="empirical-summary-item">
            <strong>${countryCount}</strong>
            <span>${pluralize(countryCount, "empirical setting")}</span>
          </div>
          <div class="empirical-summary-item">
            <strong>${projectCount}</strong>
            <span>${pluralize(projectCount, "linked project")}</span>
          </div>
        </div>
      </div>
    `;

    animatePanel();
  }

  function renderCountryPreview(code) {
    const item = getCase(code);
    if (!item) return;

    panel.innerHTML = `
      <div class="empirical-panel-inner empirical-panel-empty">
        <p class="empirical-panel-kicker">Empirical setting</p>
        <h3 class="empirical-country-title">${escapeHTML(item.country)}</h3>
        <p>${escapeHTML(item.summary)}</p>

        <div class="empirical-meta-section">
          <p class="empirical-meta-label">Research domains</p>
          ${tagHTML(item.themes)}
        </div>

        <div class="empirical-summary">
          <div class="empirical-summary-item">
            <strong>${item.projects.length}</strong>
            <span>${pluralize(item.projects.length, "linked project")}</span>
          </div>
          <div class="empirical-summary-item">
            <strong>→</strong>
            <span>Select to explore</span>
          </div>
        </div>
      </div>
    `;

    animatePanel();
  }

  function renderCountryDetail(code) {
    const item = getCase(code);
    if (!item) return;

    const projectsHTML = item.projects.map((project) => {
      const statusLine = [project.status, project.year].filter(Boolean).join(" · ");
      const linkHTML = project.href
        ? `<a class="empirical-project-link" href="${escapeHTML(project.href)}">View research</a>`
        : "";

      return `
        <article class="empirical-project">
          <p class="empirical-project-status">${escapeHTML(statusLine)}</p>
          <h4>${escapeHTML(project.title)}</h4>
          ${project.question ? `<p class="empirical-project-question">${escapeHTML(project.question)}</p>` : ""}
          ${linkHTML}
        </article>
      `;
    }).join("");

    panel.innerHTML = `
      <div class="empirical-panel-inner">
        <header class="empirical-country-header">
          <p class="empirical-panel-kicker">Selected setting</p>
          <h3 class="empirical-country-title">${escapeHTML(item.country)}</h3>
          <p class="empirical-country-count">
            ${item.projects.length} ${pluralize(item.projects.length, "research project")}
          </p>
          <button
            class="empirical-close"
            type="button"
            data-close-country
            aria-label="Close ${escapeHTML(item.country)}"
          >×</button>
        </header>

        <div class="empirical-meta-section">
          <p class="empirical-meta-label">Research domains</p>
          ${tagHTML(item.themes)}
        </div>

        <div class="empirical-meta-section">
          <p class="empirical-meta-label">Systems studied</p>
          ${tagHTML(item.systems)}
        </div>

        <div class="empirical-meta-section">
          <p class="empirical-meta-label">Statistical challenges</p>
          ${tagHTML(item.challenges)}
        </div>

        <div class="empirical-meta-section">
          <p class="empirical-meta-label">Methods</p>
          ${tagHTML(item.methods)}
        </div>

        <div class="empirical-projects">
          <p class="empirical-projects-title">Featured research</p>
          ${projectsHTML}
        </div>
      </div>
    `;

    animatePanel();
  }

  function syncRegionStates() {
    mapElement.querySelectorAll(".jvm-region[data-code]").forEach((region) => {
      const code = region.getAttribute("data-code");
      const hasResearch = Boolean(getCase(code));
      const visible = matchesCurrentFilter(code);

      region.classList.toggle("empirical-region--active", hasResearch);
      region.classList.toggle("empirical-region--filtered", hasResearch && !visible);
      region.classList.toggle("empirical-region--preview", previewCountry === code && visible);
      region.classList.toggle("empirical-region--selected", lockedCountry === code && visible);

      if (hasResearch && visible) {
        region.setAttribute("tabindex", "0");
        region.setAttribute("role", "button");
        region.setAttribute("aria-label", `Explore research in ${getCase(code).country}`);
      } else {
        region.removeAttribute("tabindex");
        region.removeAttribute("role");
        region.removeAttribute("aria-label");
      }
    });
  }

  function previewRegion(code) {
    if (!matchesCurrentFilter(code)) return;
    previewCountry = code;
    syncRegionStates();
    if (!lockedCountry) renderCountryPreview(code);
  }

  function clearRegionPreview(code) {
    if (previewCountry !== code) return;
    previewCountry = null;
    syncRegionStates();
    if (lockedCountry) renderCountryDetail(lockedCountry);
    else renderDefaultPanel();
  }

  function selectRegion(code) {
    if (!matchesCurrentFilter(code)) return;
    lockedCountry = code;
    previewCountry = null;
    syncRegionStates();
    renderCountryDetail(code);
  }

  function bindRegionEvents() {
    mapElement.querySelectorAll(".jvm-region[data-code]").forEach((region) => {
      if (region.dataset.empiricalBound === "true") return;

      const code = region.getAttribute("data-code");
      region.dataset.empiricalBound = "true";

      region.addEventListener("pointerenter", () => previewRegion(code));
      region.addEventListener("pointerleave", () => clearRegionPreview(code));
      region.addEventListener("click", () => selectRegion(code));
      region.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        selectRegion(code);
      });
    });
  }

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    activeFilter = button.dataset.filter || "all";

    if (lockedCountry && !matchesCurrentFilter(lockedCountry)) {
      lockedCountry = null;
    }

    previewCountry = null;
    renderFilters();
    syncRegionStates();

    if (lockedCountry) renderCountryDetail(lockedCountry);
    else renderDefaultPanel();
  });

  panel.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-close-country]");
    if (!closeButton) return;

    lockedCountry = null;
    previewCountry = null;
    syncRegionStates();
    renderDefaultPanel();
  });

  try {
    new window.jsVectorMap({
      selector: "#empirical-map",
      map: "world",
      backgroundColor: "transparent",
      zoomOnScroll: false,
      zoomButtons: true,
      regionStyle: {
        initial: {
          fill: "#211b23",
          stroke: "#3c303d",
          strokeWidth: 0.45
        },
        hover: {
          fill: "#211b23"
        }
      },
      onRegionTooltipShow(event, tooltip, code) {
        const item = getCase(code);

        if (!item || !matchesCurrentFilter(code)) {
          event.preventDefault();
          return;
        }

        const count = item.projects.length;
        tooltip.text(
          `<strong>${escapeHTML(item.country)}</strong><span>${count} ${pluralize(count, "project")} · click to explore</span>`,
          true
        );
      },
      onLoaded() {
        bindRegionEvents();
        syncRegionStates();
        renderFilters();
        renderDefaultPanel();
      }
    });
  } catch (error) {
    panel.innerHTML = `
      <div class="empirical-load-error">
        The geographic explorer could not initialize. Research entries remain available in the portfolio above.
      </div>
    `;
    console.error("Empirical Settings Explorer initialization failed:", error);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !lockedCountry) return;
    lockedCountry = null;
    previewCountry = null;
    syncRegionStates();
    renderDefaultPanel();
  });
})();
