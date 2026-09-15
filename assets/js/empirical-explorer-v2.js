(() => {
  "use strict";

  const D = window.JSL_EMPIRICAL_DATA;
  const MODES = {
    RESEARCH_ALL: "all",
    UN: "unProjects",
    ARMY: "armyProjects",
    JOURNALISM: "journalismProjects"
  };

  const mapEl = document.getElementById("empirical-map");
  const panel = document.getElementById("empirical-panel");
  const filters = document.getElementById("empirical-filters");
  const explorer = document.querySelector(".empirical-explorer");

  if (!D || !mapEl || !panel || !filters || !explorer || typeof window.jsVectorMap === "undefined") return;

  const legend = document.querySelector(".empirical-legend span:last-child");
  const note = document.querySelector(".empirical-map-note");

  let active = MODES.RESEARCH_ALL;
  let locked = null;
  let preview = null;

  const uniq = values => [...new Set(values)];
  const esc = (value = "") => String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
  const plural = (count, singular, pluralForm = `${singular}s`) => count === 1 ? singular : pluralForm;

  function buildCases(collection = {}) {
    const out = {};
    Object.entries(collection).forEach(([id, project]) => {
      (project.countries || []).forEach(code => {
        if (!D.countryNames[code]) return;
        out[code] ??= { country: D.countryNames[code], projects: [] };
        out[code].projects.push({ id, ...project });
      });
    });
    return out;
  }

  const researchCases = buildCases(D.researchProjects);
  const armyCases = buildCases(D.armyProjects);
  const journalismCases = buildCases(D.journalismProjects);

  const isUN = () => active === MODES.UN;
  const isArmy = () => active === MODES.ARMY;
  const isJournalism = () => active === MODES.JOURNALISM;
  const isResearch = () => !isUN() && !isArmy() && !isJournalism();

  const researchCase = code => researchCases[code] || null;
  const armyCase = code => armyCases[code] || null;
  const journalismCase = code => journalismCases[code] || null;

  const localUN = code => Object.entries(D.unProjects || {})
    .filter(([, project]) => !project.global && (project.countries || []).includes(code))
    .map(([id, project]) => ({ id, ...project }));

  const globalUN = () => Object.entries(D.unProjects || {})
    .filter(([, project]) => project.global)
    .map(([id, project]) => ({ id, ...project }));

  function modeCase(code) {
    if (isArmy()) return armyCase(code);
    if (isJournalism()) return journalismCase(code);
    return researchCase(code);
  }

  function matches(code) {
    if (isUN()) return localUN(code).length > 0;
    if (isArmy()) return Boolean(armyCase(code));
    if (isJournalism()) return Boolean(journalismCase(code));

    const item = researchCase(code);
    return Boolean(item) && (
      active === MODES.RESEARCH_ALL ||
      item.projects.some(project => project.id === active)
    );
  }

  const tags = items => `
    <div class="empirical-tags">
      ${uniq(items).map(item => `<span class="empirical-tag">${esc(item)}</span>`).join("")}
    </div>
  `;

  const card = (project, label = null) => `
    <article class="empirical-project">
      <p class="empirical-project-status">${esc(label || project.status || "")}${project.year ? ` · ${esc(project.year)}` : ""}</p>
      <h4>${esc(project.title)}</h4>
      ${project.question || project.summary ? `<p class="empirical-project-question">${esc(project.question || project.summary)}</p>` : ""}
      ${project.href ? `<a class="empirical-project-link" href="${esc(project.href)}">View work</a>` : ""}
    </article>
  `;

  function animate() {
    const element = panel.querySelector(".empirical-panel-inner");
    if (element?.animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.animate(
        [
          { opacity: .2, transform: "translateX(9px)" },
          { opacity: 1, transform: "translateX(0)" }
        ],
        { duration: 170, easing: "ease-out" }
      );
    }
  }

  function modeUI() {
    explorer.classList.toggle("is-un-mode", isUN());
    explorer.classList.toggle("is-army-mode", isArmy());
    explorer.classList.toggle("is-journalism-mode", isJournalism());

    if (legend) {
      if (isUN()) legend.textContent = "UN / multilateral scope";
      else if (isArmy()) legend.textContent = "Army experience";
      else if (isJournalism()) legend.textContent = "Journalistic work";
      else legend.textContent = "Research setting";
    }

    if (note) {
      if (isUN()) note.textContent = "UN blue = global / multilateral scope · Nepal + China include country-specific work";
      else if (isArmy()) note.textContent = "Army green = country-specific Army experience · details can be expanded later";
      else if (isJournalism()) note.textContent = "Dark blue = country-specific journalistic work · details can be expanded later";
      else note.textContent = "Hover to preview · Select a country to explore";
    }
  }

  function renderFilters() {
    const researchButtons = [
      { value: MODES.RESEARCH_ALL, label: "All Research" },
      ...Object.entries(D.researchProjects).map(([value, project]) => ({ value, label: project.shortTitle }))
    ];

    const groups = [
      { label: "Research", className: "research", buttons: researchButtons },
      { label: "Applied Projects", className: "applied", buttons: [{ value: MODES.UN, label: "UN Projects", modifier: "un" }] },
      { label: "Army", className: "army", buttons: [{ value: MODES.ARMY, label: "Army Experience", modifier: "army" }] },
      { label: "Journalism", className: "journalism", buttons: [{ value: MODES.JOURNALISM, label: "Journalistic Work", modifier: "journalism" }] }
    ];

    filters.innerHTML = groups.map(group => `
      <div class="empirical-filter-row empirical-filter-row--${group.className}">
        <span class="empirical-filter-row-label">${esc(group.label)}</span>
        <div class="empirical-filter-row-buttons">
          ${group.buttons.map(button => `
            <button
              class="empirical-filter ${button.modifier ? `empirical-filter--${button.modifier}` : ""} ${active === button.value ? "is-active" : ""}"
              type="button"
              data-filter="${esc(button.value)}"
              aria-pressed="${active === button.value}"
            >${esc(button.label)}</button>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  function unDefault() {
    const all = Object.values(D.unProjects || {});
    const specific = uniq(all.filter(project => !project.global).flatMap(project => project.countries || []));

    panel.innerHTML = `
      <div class="empirical-panel-inner">
        <p class="empirical-panel-kicker">UN / multilateral projects</p>
        <h3 class="empirical-country-title">Applied work across the UN system</h3>
        <p class="empirical-project-question">Blue shading represents global or multilateral project scope. Nepal and China are additionally emphasized because the Himalayan flood-response project is explicitly country-specific.</p>
        <div class="empirical-summary">
          <div class="empirical-summary-item"><strong>${all.length}</strong><span>${plural(all.length, "applied project")}</span></div>
          <div class="empirical-summary-item"><strong>${specific.length}</strong><span>Country-specific settings</span></div>
        </div>
        <div class="empirical-projects">
          <p class="empirical-projects-title">Applied research</p>
          ${all.map(project => card(project)).join("")}
        </div>
      </div>
    `;
    animate();
  }

  function categoryDefault(collection, label, headline, description) {
    const projects = Object.values(collection || {});
    const countries = uniq(projects.flatMap(project => project.countries || []));

    panel.innerHTML = `
      <div class="empirical-panel-inner empirical-panel-empty">
        <p class="empirical-panel-kicker">${esc(label)}</p>
        <h3>${esc(headline)}</h3>
        <p>${esc(description)}</p>
        <div class="empirical-summary">
          <div class="empirical-summary-item"><strong>${countries.length}</strong><span>${plural(countries.length, "country")}</span></div>
          <div class="empirical-summary-item"><strong>${projects.length}</strong><span>${plural(projects.length, "entry")}</span></div>
        </div>
      </div>
    `;
    animate();
  }

  function defaultPanel() {
    if (isUN()) return unDefault();

    if (isArmy()) {
      return categoryDefault(
        D.armyProjects,
        "Army",
        "U.S. Army experience",
        "Japan, the United States, and Canada are active placeholders. Select a country to open its record; dates, roles, units, projects, and links can be added later in the centralized data file."
      );
    }

    if (isJournalism()) {
      return categoryDefault(
        D.journalismProjects,
        "Journalism",
        "Journalistic work",
        "The United States, Morocco, Spain, France, and Algeria are active placeholders. Select a country to open its record; outlets, dates, articles, reporting topics, and links can be added later in the centralized data file."
      );
    }

    const count = Object.keys(researchCases).filter(matches).length;
    const projectCount = active === MODES.RESEARCH_ALL ? Object.keys(D.researchProjects).length : 1;

    panel.innerHTML = `
      <div class="empirical-panel-inner empirical-panel-empty">
        <p class="empirical-panel-kicker">Geographic research explorer</p>
        <h3>Select an empirical setting.</h3>
        <p>Highlighted countries appear in the selected research project. Hover for a preview or select a country to see every project connected to that setting.</p>
        <div class="empirical-summary">
          <div class="empirical-summary-item"><strong>${count}</strong><span>${plural(count, "empirical setting")}</span></div>
          <div class="empirical-summary-item"><strong>${projectCount}</strong><span>${plural(projectCount, "project")}</span></div>
        </div>
      </div>
    `;
    animate();
  }

  function categoryPreview(code, kicker) {
    const item = modeCase(code);
    if (!item) return;

    panel.innerHTML = `
      <div class="empirical-panel-inner empirical-panel-empty">
        <p class="empirical-panel-kicker">${esc(kicker)}</p>
        <h3 class="empirical-country-title">${esc(item.country)}</h3>
        <p>${item.projects.length} ${plural(item.projects.length, "entry")} connected to this country. Select it to open the editable placeholder record.</p>
        <div class="empirical-meta-section">
          <p class="empirical-meta-label">Current tags</p>
          ${tags(item.projects.flatMap(project => project.themes || []))}
        </div>
        <div class="empirical-summary">
          <div class="empirical-summary-item"><strong>${item.projects.length}</strong><span>${plural(item.projects.length, "entry")}</span></div>
          <div class="empirical-summary-item"><strong>→</strong><span>Select to explore</span></div>
        </div>
      </div>
    `;
    animate();
  }

  function previewPanel(code) {
    if (isUN()) {
      const local = localUN(code);
      if (!local.length) return;
      const globals = globalUN();

      panel.innerHTML = `
        <div class="empirical-panel-inner empirical-panel-empty">
          <p class="empirical-panel-kicker">UN project setting</p>
          <h3 class="empirical-country-title">${esc(D.countryNames[code] || code)}</h3>
          <p>${local.length} ${plural(local.length, "country-specific project")} plus ${globals.length} global / multilateral ${plural(globals.length, "project")} represented in this layer.</p>
          <div class="empirical-meta-section"><p class="empirical-meta-label">Country-specific focus</p>${tags(local.flatMap(project => project.themes || []))}</div>
          <div class="empirical-summary">
            <div class="empirical-summary-item"><strong>${local.length}</strong><span>Country-specific</span></div>
            <div class="empirical-summary-item"><strong>→</strong><span>Select to explore</span></div>
          </div>
        </div>
      `;
      animate();
      return;
    }

    if (isArmy()) return categoryPreview(code, "Army setting");
    if (isJournalism()) return categoryPreview(code, "Journalism setting");

    const item = researchCase(code);
    if (!item) return;
    const projects = item.projects.filter(project => active === MODES.RESEARCH_ALL || project.id === active);

    panel.innerHTML = `
      <div class="empirical-panel-inner empirical-panel-empty">
        <p class="empirical-panel-kicker">Empirical setting</p>
        <h3 class="empirical-country-title">${esc(item.country)}</h3>
        <p>${projects.length} ${plural(projects.length, "research project")} connected to this setting. Select the country to view the projects, systems, methods, and statistical challenges represented here.</p>
        <div class="empirical-meta-section"><p class="empirical-meta-label">Research domains</p>${tags(projects.flatMap(project => project.themes || []))}</div>
        <div class="empirical-summary">
          <div class="empirical-summary-item"><strong>${projects.length}</strong><span>${plural(projects.length, "linked project")}</span></div>
          <div class="empirical-summary-item"><strong>→</strong><span>Select to explore</span></div>
        </div>
      </div>
    `;
    animate();
  }

  function unDetail(code) {
    const local = localUN(code);
    if (!local.length) return;
    const globals = globalUN();
    const name = D.countryNames[code] || code;

    panel.innerHTML = `
      <div class="empirical-panel-inner">
        <header class="empirical-country-header">
          <p class="empirical-panel-kicker">Country-specific UN setting</p>
          <h3 class="empirical-country-title">${esc(name)}</h3>
          <p class="empirical-country-count">${local.length} ${plural(local.length, "country-specific project")}</p>
          <button class="empirical-close" type="button" data-close-country aria-label="Close ${esc(name)}">×</button>
        </header>
        <div class="empirical-meta-section"><p class="empirical-meta-label">Project domains</p>${tags(local.flatMap(project => project.themes || []))}</div>
        <div class="empirical-meta-section"><p class="empirical-meta-label">Systems studied</p>${tags(local.flatMap(project => project.systems || []))}</div>
        <div class="empirical-meta-section"><p class="empirical-meta-label">Analytical challenges</p>${tags(local.flatMap(project => project.challenges || []))}</div>
        <div class="empirical-projects"><p class="empirical-projects-title">Country-specific project</p>${local.map(project => card(project)).join("")}</div>
        <div class="empirical-projects"><p class="empirical-projects-title">Global / multilateral projects</p>${globals.map(project => card(project, "Global / multilateral")).join("")}</div>
      </div>
    `;
    animate();
  }

  function categoryDetail(code, label) {
    const item = modeCase(code);
    if (!item) return;

    const projects = item.projects;
    panel.innerHTML = `
      <div class="empirical-panel-inner">
        <header class="empirical-country-header">
          <p class="empirical-panel-kicker">${esc(label)}</p>
          <h3 class="empirical-country-title">${esc(item.country)}</h3>
          <p class="empirical-country-count">${projects.length} ${plural(projects.length, "entry")}</p>
          <button class="empirical-close" type="button" data-close-country aria-label="Close ${esc(item.country)}">×</button>
        </header>
        <div class="empirical-meta-section"><p class="empirical-meta-label">Domains</p>${tags(projects.flatMap(project => project.themes || []))}</div>
        <div class="empirical-meta-section"><p class="empirical-meta-label">Systems / context</p>${tags(projects.flatMap(project => project.systems || []))}</div>
        <div class="empirical-meta-section"><p class="empirical-meta-label">Methods / competencies</p>${tags(projects.flatMap(project => project.methods || []))}</div>
        <div class="empirical-projects"><p class="empirical-projects-title">Editable record</p>${projects.map(project => card(project)).join("")}</div>
      </div>
    `;
    animate();
  }

  function detailPanel(code) {
    if (isUN()) return unDetail(code);
    if (isArmy()) return categoryDetail(code, "Army experience");
    if (isJournalism()) return categoryDetail(code, "Journalistic work");

    const item = researchCase(code);
    if (!item) return;
    const projects = item.projects.filter(project => active === MODES.RESEARCH_ALL || project.id === active);
    const name = item.country;

    panel.innerHTML = `
      <div class="empirical-panel-inner">
        <header class="empirical-country-header">
          <p class="empirical-panel-kicker">Selected setting</p>
          <h3 class="empirical-country-title">${esc(name)}</h3>
          <p class="empirical-country-count">${projects.length} ${plural(projects.length, "research project")}</p>
          <button class="empirical-close" type="button" data-close-country aria-label="Close ${esc(name)}">×</button>
        </header>
        <div class="empirical-meta-section"><p class="empirical-meta-label">Research domains</p>${tags(projects.flatMap(project => project.themes || []))}</div>
        <div class="empirical-meta-section"><p class="empirical-meta-label">Systems studied</p>${tags(projects.flatMap(project => project.systems || []))}</div>
        <div class="empirical-meta-section"><p class="empirical-meta-label">Statistical challenges</p>${tags(projects.flatMap(project => project.challenges || []))}</div>
        <div class="empirical-meta-section"><p class="empirical-meta-label">Methods</p>${tags(projects.flatMap(project => project.methods || []))}</div>
        <div class="empirical-projects"><p class="empirical-projects-title">Featured research</p>${projects.map(project => card(project)).join("")}</div>
      </div>
    `;
    animate();
  }

  function sync() {
    mapEl.querySelectorAll(".jvm-region[data-code]").forEach(region => {
      const code = region.dataset.code;
      const researchItem = researchCase(code);
      const local = localUN(code);
      const categoryItem = modeCase(code);

      region.classList.remove(
        "empirical-region--active",
        "empirical-region--filtered",
        "empirical-region--preview",
        "empirical-region--selected",
        "empirical-region--un-scope",
        "empirical-region--un-specific",
        "empirical-region--category-active"
      );

      if (isUN()) {
        region.classList.add("empirical-region--un-scope");
        if (local.length) region.classList.add("empirical-region--un-specific");
        region.classList.toggle("empirical-region--preview", preview === code && local.length > 0);
        region.classList.toggle("empirical-region--selected", locked === code && local.length > 0);

        if (local.length) {
          region.tabIndex = 0;
          region.setAttribute("role", "button");
          region.setAttribute("aria-label", `Explore UN project work in ${D.countryNames[code] || code}`);
        } else {
          region.removeAttribute("tabindex");
          region.removeAttribute("role");
          region.removeAttribute("aria-label");
        }
        return;
      }

      if (isArmy() || isJournalism()) {
        const visible = Boolean(categoryItem);
        region.classList.toggle("empirical-region--category-active", visible);
        region.classList.toggle("empirical-region--preview", preview === code && visible);
        region.classList.toggle("empirical-region--selected", locked === code && visible);

        if (visible) {
          region.tabIndex = 0;
          region.setAttribute("role", "button");
          region.setAttribute("aria-label", `Explore ${isArmy() ? "Army" : "journalistic"} work in ${categoryItem.country}`);
        } else {
          region.removeAttribute("tabindex");
          region.removeAttribute("role");
          region.removeAttribute("aria-label");
        }
        return;
      }

      const visible = matches(code);
      region.classList.toggle("empirical-region--active", Boolean(researchItem) && visible);
      region.classList.toggle("empirical-region--filtered", Boolean(researchItem) && !visible);
      region.classList.toggle("empirical-region--preview", preview === code && visible);
      region.classList.toggle("empirical-region--selected", locked === code && visible);

      if (researchItem && visible) {
        region.tabIndex = 0;
        region.setAttribute("role", "button");
        region.setAttribute("aria-label", `Explore research in ${researchItem.country}`);
      } else {
        region.removeAttribute("tabindex");
        region.removeAttribute("role");
        region.removeAttribute("aria-label");
      }
    });
  }

  function previewRegion(code) {
    if (!matches(code)) return;
    preview = code;
    sync();
    if (!locked) previewPanel(code);
  }

  function clearPreview(code) {
    if (preview !== code) return;
    preview = null;
    sync();
    locked ? detailPanel(locked) : defaultPanel();
  }

  function selectRegion(code) {
    if (!matches(code)) return;
    locked = code;
    preview = null;
    sync();
    detailPanel(code);
  }

  function bind() {
    mapEl.querySelectorAll(".jvm-region[data-code]").forEach(region => {
      if (region.dataset.empiricalV3) return;
      region.dataset.empiricalV3 = "1";
      const code = region.dataset.code;
      region.addEventListener("pointerenter", () => previewRegion(code));
      region.addEventListener("pointerleave", () => clearPreview(code));
      region.addEventListener("click", () => selectRegion(code));
      region.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        selectRegion(code);
      });
    });
  }

  filters.addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    active = button.dataset.filter || MODES.RESEARCH_ALL;
    if (locked && !matches(locked)) locked = null;
    preview = null;
    modeUI();
    renderFilters();
    sync();
    locked ? detailPanel(locked) : defaultPanel();
  });

  panel.addEventListener("click", event => {
    if (!event.target.closest("[data-close-country]")) return;
    locked = null;
    preview = null;
    sync();
    defaultPanel();
  });

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
        if (isUN()) {
          const local = localUN(code);
          if (!local.length) {
            event.preventDefault();
            return;
          }
          tooltip.text(`<strong>${esc(D.countryNames[code] || code)}</strong><span>${local.length} country-specific UN ${plural(local.length, "project")} · click to explore</span>`, true);
          return;
        }

        if (isArmy() || isJournalism()) {
          const item = modeCase(code);
          if (!item) {
            event.preventDefault();
            return;
          }
          tooltip.text(`<strong>${esc(item.country)}</strong><span>${item.projects.length} ${isArmy() ? "Army" : "journalism"} ${plural(item.projects.length, "entry")} · click to explore</span>`, true);
          return;
        }

        const item = researchCase(code);
        if (!item || !matches(code)) {
          event.preventDefault();
          return;
        }
        const count = item.projects.filter(project => active === MODES.RESEARCH_ALL || project.id === active).length;
        tooltip.text(`<strong>${esc(item.country)}</strong><span>${count} ${plural(count, "project")} · click to explore</span>`, true);
      },
      onLoaded() {
        bind();
        modeUI();
        sync();
        renderFilters();
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
    sync();
    defaultPanel();
  });
})();