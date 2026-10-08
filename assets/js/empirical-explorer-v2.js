(() => {
  "use strict";

  // Country and project records come from the checked-in local dataset.
  const D = window.JSL_EMPIRICAL_DATA;
  const mapEl = document.getElementById("empirical-map");
  const panel = document.getElementById("empirical-panel");
  const filters = document.getElementById("empirical-filters");
  const explorer = document.querySelector(".empirical-explorer");

  if (!D || !mapEl || !panel || !filters || !explorer) return;
  if (typeof window.jsVectorMap === "undefined") {
    panel.innerHTML = '<div class="empirical-load-error">The map is unavailable. All research entries remain available in the portfolio above.</div>';
    return;
  }

  const legend = document.querySelector(".empirical-legend span:last-child");
  const note = document.querySelector(".empirical-map-note");

  let mode = "research";
  let scope = "all";
  let locked = null;
  let preview = null;
  let regionNodes = [];

  const uniq = values => [...new Set(values)];
  const esc = (value = "") => String(value).replace(/[&<>"']/g, character => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  })[character]);
  const plural = (count, singular, pluralForm = `${singular}s`) => count === 1 ? singular : pluralForm;

  // The research, UN, military and reporting modes share one map.
  const MODE_CONFIG = {
    research: {
      label: "Research",
      collection: () => D.researchProjects || {},
      definitions: () => D.scopeDefinitions?.research || []
    },
    applied: {
      label: "Applied Projects",
      collection: () => D.unProjects || {},
      definitions: () => D.scopeDefinitions?.applied || []
    },
    military: {
      label: "Military Service",
      collection: () => D.armyProjects || {},
      definitions: () => D.scopeDefinitions?.military || []
    },
    journalism: {
      label: "Independent Reporting",
      collection: () => D.journalismProjects || {},
      definitions: () => D.scopeDefinitions?.journalism || []
    }
  };

  function activeDefinition() {
    return MODE_CONFIG[mode].definitions().find(item => item.id === scope) || { id:scope, label:scope };
  }

  function projectMatches(project) {
    return scope === "all" || (project.scopes || []).includes(scope);
  }

  // The page's project data is immutable after initialization. Cache the small
  // set of scope combinations instead of rebuilding it on every pointer move.
  const projectCache = new Map();
  const caseCache = new Map();
  const scopeKey = () => `${mode}:${scope}`;
  function selectedProjects() {
    const key = scopeKey();
    if (!projectCache.has(key)) {
      projectCache.set(key, Object.entries(MODE_CONFIG[mode].collection())
        .filter(([, project]) => projectMatches(project))
        .map(([id, project]) => ({ id, ...project })));
    }
    return projectCache.get(key);
  }

  function buildCountryCases(projects, explicitOnly = false) {
    const cases = {};
    projects.forEach(project => {
      const codes = (project.mapCountries?.length ? project.mapCountries : project.countries) || [];
      if (explicitOnly && project.global && codes.length === 0) return;

      codes.forEach(code => {
        if (!D.countryNames[code]) return;
        cases[code] ??= { country:D.countryNames[code], projects:[] };
        cases[code].projects.push(project);
      });
    });
    return cases;
  }

  function currentCases() {
    const key = scopeKey();
    if (!caseCache.has(key)) caseCache.set(key, buildCountryCases(selectedProjects(), mode === "applied"));
    return caseCache.get(key);
  }

  function globalAppliedProjects(excludeProjects = []) {
    if (mode !== "applied") return [];
    const excludedIds = new Set(excludeProjects.map(project => project.id));
    return selectedProjects().filter(project => project.global && !excludedIds.has(project.id));
  }

  function tags(items = []) {
    return `<div class="empirical-tags">${uniq(items).map(item => `<span class="empirical-tag">${esc(item)}</span>`).join("")}</div>`;
  }

  function card(project, label = null) {
    const status = label || project.status || "";
    return `
      <article class="empirical-project">
        <p class="empirical-project-status">${esc(status)}${project.year ? ` · ${esc(project.year)}` : ""}</p>
        <h4>${esc(project.title)}</h4>
        ${project.question || project.summary ? `<p class="empirical-project-question">${esc(project.question || project.summary)}</p>` : ""}
        ${project.href ? `<a class="empirical-project-link" href="${esc(project.href)}">View work</a>` : ""}
      </article>
    `;
  }

  function animatePanel() {
    // Renderers notify consumers directly; no subtree observers or repair pass.
    panel.dispatchEvent(new CustomEvent("empirical:panel-rendered"));
    const element = panel.querySelector(".empirical-panel-inner");
    if (element?.animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.animate([
        { opacity:.2, transform:"translateX(9px)" },
        { opacity:1, transform:"translateX(0)" }
      ], { duration:170, easing:"ease-out" });
    }
  }

  function modeUI() {
    explorer.classList.toggle("is-un-mode", mode === "applied");
    explorer.classList.toggle("is-army-mode", mode === "military");
    explorer.classList.toggle("is-journalism-mode", mode === "journalism");

    if (legend) {
      if (mode === "applied") legend.textContent = "Applied project setting";
      else if (mode === "military") legend.textContent = "Military service setting";
      else if (mode === "journalism") legend.textContent = "Independent reporting setting";
      else legend.textContent = "Academic research setting";
    }

    if (note) {
      if (mode === "applied") note.textContent = "Only countries tied to country-specific applied work are highlighted";
      else if (mode === "military") note.textContent = "Military-service scope assignments can be added later in the data file";
      else if (mode === "journalism") note.textContent = "Reporting-scope assignments can be added later in the data file";
      else note.textContent = "Hover to preview · Select a country to explore";
    }
  }

  function renderFilters() {
    const groups = [
      { key:"research", label:"Research" },
      { key:"applied", label:"Applied Projects" },
      { key:"military", label:"Military Service" },
      { key:"journalism", label:"Independent Reporting" }
    ];

    filters.innerHTML = groups.map(group => {
      const modifier = group.key === "applied" ? "un" : group.key === "military" ? "army" : group.key === "journalism" ? "journalism" : "research";
      const buttons = MODE_CONFIG[group.key].definitions();
      return `
        <div class="empirical-filter-row empirical-filter-row--${group.key}">
          <span class="empirical-filter-row-label">${esc(group.label)}</span>
          <div class="empirical-filter-row-buttons">
            ${buttons.map(button => `
              <button
                class="empirical-filter empirical-filter--${modifier} ${mode === group.key && scope === button.id ? "is-active" : ""}"
                type="button"
                data-mode="${esc(group.key)}"
                data-scope="${esc(button.id)}"
                aria-pressed="${mode === group.key && scope === button.id}"
              >${esc(button.label)}</button>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  function defaultPanel() {
    const definition = activeDefinition();
    const projects = selectedProjects();
    const cases = currentCases();
    const countryCount = Object.keys(cases).length;

    let description;
    if ((mode === "military" || mode === "journalism") && scope !== "all" && projects.length === 0) {
      description = "This scope is ready for entries, but no countries or records have been assigned to it yet. Add scope assignments later in assets/js/empirical-data.js.";
    } else if (mode === "applied") {
      description = "Projects are grouped by applied scope. Global or multilateral projects with explicit mapped-country coverage are highlighted; other global work remains listed without implying country-level coverage.";
    } else if (mode === "military") {
      description = "Country coverage is active now. Specific service categories can be assigned to each country record later without changing the map interface.";
    } else if (mode === "journalism") {
      description = "Country coverage is active now. Investigative and foreign-correspondence assignments can be added later at the individual country-entry level.";
    } else {
      description = "Academic projects are grouped by substantive discipline. Projects may appear in more than one discipline when their research questions genuinely overlap.";
    }

    panel.innerHTML = `
      <div class="empirical-panel-inner">
        <p class="empirical-panel-kicker">${esc(MODE_CONFIG[mode].label)}</p>
        <h3 class="empirical-country-title">${esc(definition.label)}</h3>
        <p class="empirical-project-question">${esc(description)}</p>
        <div class="empirical-summary">
          <div class="empirical-summary-item"><strong>${countryCount}</strong><span>${plural(countryCount,"mapped country","mapped countries")}</span></div>
          <div class="empirical-summary-item"><strong>${projects.length}</strong><span>${plural(projects.length,"entry")}</span></div>
        </div>
        ${projects.length ? `<div class="empirical-projects"><p class="empirical-projects-title">Work in this scope</p>${projects.map(project => card(project, project.global ? "Global / multilateral" : null)).join("")}</div>` : ""}
      </div>
    `;
    animatePanel();
  }

  function previewPanel(code) {
    const cases = currentCases();
    const item = cases[code];
    if (!item) return;

    const globals = globalAppliedProjects(item.projects);
    panel.innerHTML = `
      <div class="empirical-panel-inner empirical-panel-empty">
        <p class="empirical-panel-kicker">${esc(activeDefinition().label)}</p>
        <h3 class="empirical-country-title">${esc(item.country)}</h3>
        <p>${item.projects.length} ${plural(item.projects.length,"country-linked entry")} connected to this setting${globals.length ? `, plus ${globals.length} additional global / multilateral ${plural(globals.length,"entry")}` : ""}.</p>
        <div class="empirical-meta-section">
          <p class="empirical-meta-label">Domains</p>
          ${tags(item.projects.flatMap(project => project.themes || []))}
        </div>
        <div class="empirical-summary">
          <div class="empirical-summary-item"><strong>${item.projects.length}</strong><span>${plural(item.projects.length,"linked entry")}</span></div>
          <div class="empirical-summary-item"><strong>→</strong><span>Select to explore</span></div>
        </div>
      </div>
    `;
    animatePanel();
  }

  function detailPanel(code) {
    const cases = currentCases();
    const item = cases[code];
    if (!item) return;
    const globals = globalAppliedProjects(item.projects);

    const domains = uniq(item.projects.flatMap(project => project.themes || []));
    const systems = uniq(item.projects.flatMap(project => project.systems || []));
    const methods = uniq(item.projects.flatMap(project => project.methods || []));
    const challenges = uniq(item.projects.flatMap(project => project.challenges || []));

    panel.innerHTML = `
      <div class="empirical-panel-inner">
        <header class="empirical-country-header">
          <p class="empirical-panel-kicker">${esc(activeDefinition().label)}</p>
          <h3 class="empirical-country-title">${esc(item.country)}</h3>
          <p class="empirical-country-count">${item.projects.length} ${plural(item.projects.length,"country-linked entry")}</p>
          <button class="empirical-close" type="button" data-close-country aria-label="Close ${esc(item.country)}">×</button>
        </header>
        ${domains.length ? `<div class="empirical-meta-section"><p class="empirical-meta-label">Domains</p>${tags(domains)}</div>` : ""}
        ${systems.length ? `<div class="empirical-meta-section"><p class="empirical-meta-label">Systems / context</p>${tags(systems)}</div>` : ""}
        ${challenges.length ? `<div class="empirical-meta-section"><p class="empirical-meta-label">Analytical challenges</p>${tags(challenges)}</div>` : ""}
        ${methods.length ? `<div class="empirical-meta-section"><p class="empirical-meta-label">Methods / competencies</p>${tags(methods)}</div>` : ""}
        <div class="empirical-projects"><p class="empirical-projects-title">Country-linked work</p>${item.projects.map(project => card(project, project.global ? "Global / multilateral" : null)).join("")}</div>
        ${globals.length ? `<div class="empirical-projects"><p class="empirical-projects-title">Additional global / multilateral work in this scope</p>${globals.map(project => card(project,"Global / multilateral")).join("")}</div>` : ""}
      </div>
    `;
    animatePanel();
  }

  function syncMap() {
    const cases = currentCases();
    regionNodes.forEach(region => {
      const code = region.dataset.code;
      const activeCase = cases[code];

      region.classList.toggle("empirical-region--active", Boolean(activeCase) && mode === "research");
      region.classList.toggle("empirical-region--un-specific", Boolean(activeCase) && mode === "applied");
      region.classList.toggle("empirical-region--category-active", Boolean(activeCase) && !["research", "applied"].includes(mode));
      region.classList.toggle("empirical-region--preview", Boolean(activeCase) && preview === code);
      region.classList.toggle("empirical-region--selected", Boolean(activeCase) && locked === code);

      if (activeCase) {
        region.tabIndex = 0;
        region.setAttribute("role","button");
        region.setAttribute("aria-label",`Explore ${MODE_CONFIG[mode].label.toLowerCase()} in ${activeCase.country}`);
      } else {
        region.removeAttribute("tabindex");
        region.removeAttribute("role");
        region.removeAttribute("aria-label");
      }
    });
  }

  function selectScope(nextMode, nextScope) {
    mode = nextMode;
    scope = nextScope;
    locked = null;
    preview = null;
    modeUI();
    renderFilters();
    syncMap();
    defaultPanel();
  }

  // Delegated listeners keep the region controls lightweight.
  function bindRegions() {
    regionNodes = [...mapEl.querySelectorAll(".jvm-region[data-code]")];
    const getRegion = event => event.target.closest?.(".jvm-region[data-code]");
    const select = region => {
      const code = region?.dataset.code;
      if (!currentCases()[code]) return;
      locked = code;
      preview = null;
      syncMap();
      detailPanel(code);
    };
    const showPreview = region => {
      const code = region?.dataset.code;
      if (!currentCases()[code] || preview === code) return;
      preview = code;
      syncMap();
      if (!locked) previewPanel(code);
    };
    // One delegated listener per event, rather than four per map region.
    mapEl.addEventListener("pointerover", event => showPreview(getRegion(event)));
    mapEl.addEventListener("focusin", event => showPreview(getRegion(event)));
    const leavePreview = event => {
      const region = getRegion(event);
      if (!region || region.contains(event.relatedTarget) || preview !== region.dataset.code) return;
      preview = null;
      syncMap();
      locked ? detailPanel(locked) : defaultPanel();
    };
    mapEl.addEventListener("pointerout", leavePreview);
    mapEl.addEventListener("focusout", leavePreview);
    mapEl.addEventListener("click", event => select(getRegion(event)));
    mapEl.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const region = getRegion(event);
      if (!region || !currentCases()[region.dataset.code]) return;
      event.preventDefault();
      select(region);
    });
  }

  filters.addEventListener("click", event => {
    const button = event.target.closest("[data-mode][data-scope]");
    if (!button) return;
    selectScope(button.dataset.mode, button.dataset.scope);
  });

  panel.addEventListener("click", event => {
    if (!event.target.closest("[data-close-country]")) return;
    locked = null;
    preview = null;
    syncMap();
    defaultPanel();
  });

  // The rest of the portfolio remains usable if the map cannot load.
  try {
    new window.jsVectorMap({
      selector: "#empirical-map",
      map: "world",
      backgroundColor: "transparent",
      zoomOnScroll: false,
      zoomButtons: true,
      regionStyle: {
        initial: { fill: "#211b23", stroke: "#3c303d", strokeWidth: .45 },
        hover: { fill: "#211b23" }
      },
      onRegionTooltipShow(event, tooltip, code) {
        const item = currentCases()[code];
        if (!item) {
          event.preventDefault();
          return;
        }
        tooltip.text(`<strong>${esc(item.country)}</strong><span>${item.projects.length} ${plural(item.projects.length,"entry")} · click to explore</span>`, true);
      },
      onLoaded() {
        bindRegions();
        modeUI();
        renderFilters();
        syncMap();
        defaultPanel();
      }
    });
  } catch (error) {
    panel.innerHTML = '<div class="empirical-load-error">The geographic explorer could not initialize. Research entries remain available in the portfolio above.</div>';
    console.error("Empirical Settings Explorer initialization failed:", error);
  }

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !locked) return;
    locked = null;
    preview = null;
    syncMap();
    defaultPanel();
  });
})();