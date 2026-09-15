(() => {
  "use strict";

  const COUNTRY_NAMES = {
    AF: "Afghanistan",
    AE: "United Arab Emirates",
    AM: "Armenia",
    AU: "Australia",
    AZ: "Azerbaijan",
    BD: "Bangladesh",
    BE: "Belgium",
    BF: "Burkina Faso",
    BH: "Bahrain",
    BN: "Brunei",
    CD: "Democratic Republic of the Congo",
    CM: "Cameroon",
    DE: "Germany",
    DJ: "Djibouti",
    DZ: "Algeria",
    EG: "Egypt",
    FR: "France",
    GB: "United Kingdom",
    GE: "Georgia",
    ID: "Indonesia",
    IL: "Israel",
    IN: "India",
    IQ: "Iraq",
    IR: "Iran",
    JO: "Jordan",
    KG: "Kyrgyzstan",
    KW: "Kuwait",
    KZ: "Kazakhstan",
    LB: "Lebanon",
    LK: "Sri Lanka",
    LY: "Libya",
    MA: "Morocco",
    ML: "Mali",
    MV: "Maldives",
    MX: "Mexico",
    MY: "Malaysia",
    MZ: "Mozambique",
    NE: "Niger",
    NG: "Nigeria",
    OM: "Oman",
    PH: "Philippines",
    PK: "Pakistan",
    PS: "West Bank and Gaza Strip",
    QA: "Qatar",
    RU: "Russia",
    SA: "Saudi Arabia",
    SO: "Somalia",
    SY: "Syria",
    TD: "Chad",
    TJ: "Tajikistan",
    TN: "Tunisia",
    TR: "Turkey",
    TZ: "Tanzania",
    UG: "Uganda",
    YE: "Yemen"
  };

  const PROJECTS = {
    targetMap: {
      shortTitle: "Target Map",
      title: "The Caliphate's Target Map: Ethnosectarian Composition and Insurgent Violence in Iraq",
      status: "Published",
      year: "2026",
      question: "How closely did Islamic State attack patterns correspond to district-level ethnosectarian composition and target type?",
      themes: ["Political violence", "Terrorism"],
      systems: ["Insurgent violence", "Ethnosectarian geography", "Civilian targeting"],
      challenges: ["Spatial composition", "Event heterogeneity", "Target-type variation"],
      methods: ["Population-weighted geography", "Statistical modeling", "Data visualization"],
      countries: ["IQ"],
      href: null
    },

    lethality: {
      shortTitle: "Estimating Lethality",
      title: "Estimating Lethality Under Missing Casualty Data: Suicide Attacks in Islamic State-Linked Terrorism",
      status: "Published",
      year: "2026",
      question: "How do missing casualty observations and perpetrator-attribution bias alter estimates of lethality in Islamic State-linked suicide attacks?",
      themes: ["Terrorism", "Missing data"],
      systems: ["Suicide attacks", "Islamic State-linked terrorism", "Attack lethality"],
      challenges: ["Missing casualty data", "Attribution bias", "Cross-country event data"],
      methods: ["Missing-data analysis", "Comparative event analysis", "R"],
      countries: [
        "AF", "DZ", "AU", "BH", "BD", "BE", "BF", "CM", "TD", "CD", "EG", "FR",
        "GE", "DE", "IN", "ID", "IR", "IQ", "IL", "JO", "KZ", "KW", "KG", "LB",
        "LY", "MY", "MV", "ML", "MZ", "NE", "NG", "PK", "PH", "RU", "SA", "SO",
        "LK", "SY", "TJ", "TZ", "TN", "TR", "UG", "GB", "PS", "YE"
      ],
      href: null
    },

    climate: {
      shortTitle: "Climate Change",
      title: "The Effects of Climate Change on the Development of Terrorist Networks in the Middle East and North Africa",
      status: "Published",
      year: "2022",
      question: "How could projected climate stress intensify resource scarcity, governance pressure, and conditions exploitable by terrorist organizations across the Middle East and North Africa?",
      themes: ["Climate risk", "Human security", "Terrorism"],
      systems: ["Climate stress", "Resource scarcity", "Terrorist network development"],
      challenges: ["Scenario uncertainty", "Cross-country climate exposure", "Multi-source integration"],
      methods: ["Climate scenario comparison", "Spatial analysis", "Data visualization"],
      countries: [
        "DZ", "BH", "DJ", "EG", "IR", "IQ", "IL", "JO", "KW", "LB",
        "LY", "MA", "OM", "QA", "SA", "SY", "TN", "AE", "PS", "YE"
      ],
      href: null
    },

    vanguards: {
      shortTitle: "Vanguards of Terror",
      title: "Vanguards of Terror: The Strategic and Tactical Orientation and Cohesion of the Islamic State Insurgency, 1999–2019",
      status: "Published",
      year: "2022",
      question: "How consistent were the strategic and tactical behaviors of Islamic State wilayat across the movement's geographic expansion through 2019?",
      themes: ["Terrorism", "Organizational behavior"],
      systems: ["Islamic State wilayat", "Tactical cohesion", "Strategic variation"],
      challenges: ["Cross-unit comparability", "Longitudinal conflict data", "Organizational heterogeneity"],
      methods: ["Comparative analysis", "Longitudinal analysis", "OSINT"],
      countries: [
        "AF", "DZ", "AM", "AZ", "BD", "BN", "BF", "CM", "TD", "CD", "EG", "GE",
        "IN", "ID", "IQ", "LY", "MY", "ML", "MZ", "NE", "NG", "PK", "PH", "RU",
        "SA", "SO", "SY", "TZ", "TN", "TR", "UG", "YE"
      ],
      href: null
    }
  };

  function unique(values) {
    return [...new Set(values)];
  }

  function buildResearchCases() {
    const cases = {};

    Object.entries(PROJECTS).forEach(([projectId, project]) => {
      project.countries.forEach((code) => {
        if (!COUNTRY_NAMES[code]) return;

        if (!cases[code]) {
          cases[code] = {
            country: COUNTRY_NAMES[code],
            themes: [],
            systems: [],
            challenges: [],
            methods: [],
            projects: []
          };
        }

        cases[code].themes.push(...project.themes);
        cases[code].systems.push(...project.systems);
        cases[code].challenges.push(...project.challenges);
        cases[code].methods.push(...project.methods);
        cases[code].projects.push({ id: projectId, ...project });
      });
    });

    Object.values(cases).forEach((item) => {
      item.themes = unique(item.themes);
      item.systems = unique(item.systems);
      item.challenges = unique(item.challenges);
      item.methods = unique(item.methods);
    });

    return cases;
  }

  const RESEARCH_CASES = buildResearchCases();

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
    return item.projects.some((project) => project.id === activeFilter);
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

  function renderFilters() {
    const buttons = [
      { value: "all", label: "All research" },
      ...Object.entries(PROJECTS).map(([value, project]) => ({
        value,
        label: project.shortTitle
      }))
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

  function visibleProjects() {
    if (activeFilter === "all") return Object.keys(PROJECTS);
    return PROJECTS[activeFilter] ? [activeFilter] : [];
  }

  function renderDefaultPanel() {
    const countryCount = Object.keys(RESEARCH_CASES).filter(matchesCurrentFilter).length;
    const projectCount = visibleProjects().length;

    panel.innerHTML = `
      <div class="empirical-panel-inner empirical-panel-empty">
        <p class="empirical-panel-kicker">Geographic research explorer</p>
        <h3>Select an empirical setting.</h3>
        <p>
          Highlighted countries appear in the selected research project.
          Hover for a preview or select a country to see every project connected to that setting.
        </p>
        <div class="empirical-summary">
          <div class="empirical-summary-item">
            <strong>${countryCount}</strong>
            <span>${pluralize(countryCount, "empirical setting")}</span>
          </div>
          <div class="empirical-summary-item">
            <strong>${projectCount}</strong>
            <span>${pluralize(projectCount, "project")}</span>
          </div>
        </div>
      </div>
    `;

    animatePanel();
  }

  function renderCountryPreview(code) {
    const item = getCase(code);
    if (!item) return;

    const visibleCountryProjects = item.projects.filter(
      (project) => activeFilter === "all" || project.id === activeFilter
    );

    panel.innerHTML = `
      <div class="empirical-panel-inner empirical-panel-empty">
        <p class="empirical-panel-kicker">Empirical setting</p>
        <h3 class="empirical-country-title">${escapeHTML(item.country)}</h3>
        <p>
          ${visibleCountryProjects.length} ${pluralize(visibleCountryProjects.length, "research project")} connected to this setting.
          Select the country to view the projects, systems, methods, and statistical challenges represented here.
        </p>

        <div class="empirical-meta-section">
          <p class="empirical-meta-label">Research domains</p>
          ${tagHTML(item.themes)}
        </div>

        <div class="empirical-summary">
          <div class="empirical-summary-item">
            <strong>${visibleCountryProjects.length}</strong>
            <span>${pluralize(visibleCountryProjects.length, "linked project")}</span>
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

    const visibleCountryProjects = item.projects.filter(
      (project) => activeFilter === "all" || project.id === activeFilter
    );

    const projectsHTML = visibleCountryProjects.map((project) => {
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

    const activeProjectIds = new Set(visibleCountryProjects.map((project) => project.id));
    const activeThemes = unique(visibleCountryProjects.flatMap((project) => project.themes));
    const activeSystems = unique(visibleCountryProjects.flatMap((project) => project.systems));
    const activeChallenges = unique(visibleCountryProjects.flatMap((project) => project.challenges));
    const activeMethods = unique(visibleCountryProjects.flatMap((project) => project.methods));

    panel.innerHTML = `
      <div class="empirical-panel-inner">
        <header class="empirical-country-header">
          <p class="empirical-panel-kicker">Selected setting</p>
          <h3 class="empirical-country-title">${escapeHTML(item.country)}</h3>
          <p class="empirical-country-count">
            ${activeProjectIds.size} ${pluralize(activeProjectIds.size, "research project")}
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
          ${tagHTML(activeThemes)}
        </div>

        <div class="empirical-meta-section">
          <p class="empirical-meta-label">Systems studied</p>
          ${tagHTML(activeSystems)}
        </div>

        <div class="empirical-meta-section">
          <p class="empirical-meta-label">Statistical challenges</p>
          ${tagHTML(activeChallenges)}
        </div>

        <div class="empirical-meta-section">
          <p class="empirical-meta-label">Methods</p>
          ${tagHTML(activeMethods)}
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

      region.classList.toggle("empirical-region--active", hasResearch && visible);
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

        const count = item.projects.filter(
          (project) => activeFilter === "all" || project.id === activeFilter
        ).length;

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
