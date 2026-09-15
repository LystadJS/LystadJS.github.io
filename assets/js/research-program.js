(() => {
  const REVIEW_CSS = "assets/css/research-program-review.css";
  if (!document.querySelector(`link[href="${REVIEW_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = REVIEW_CSS;
    document.head.appendChild(link);
  }

  const DATA = {
    center: {
      kind: "core",
      title: "Computational Statistics",
      summary: "Using statistical computing to find structure, measure change, and represent uncertainty in complex human systems.",
      plain: [
        "I use statistics to find patterns that are difficult to see directly.",
        "The emphasis is on messy, changing systems where useful labels may not already exist."
      ],
      methods: ["Unsupervised learning", "Networks", "Longitudinal models", "Text analysis", "Spatial statistics"],
      projects: ["Longitudinal embedding alignment", "UN evidence systems", "AI-governance diffusion research"]
    },
    unsupervised: {
      kind: "method",
      title: "Unsupervised Learning",
      summary: "Finding meaningful structure without requiring a known outcome label in advance.",
      plain: ["Ask the data what groups or patterns exist before deciding what the categories should be."],
      methods: ["Clustering", "Representation learning", "Latent structure"],
      projects: ["Conflict actor structure", "AI-governance mapping", "Changing latent spaces"]
    },
    clustering: {
      kind: "method",
      title: "Clustering",
      summary: "Grouping observations that behave or look similar without a predefined answer key.",
      plain: ["Useful when the groups themselves are part of the research question."],
      methods: ["HDBSCAN", "Hierarchical clustering", "K-means", "Fuzzy clustering"],
      projects: ["Actor typologies", "Behavioral group discovery", "Coalition structure"]
    },
    dimension: {
      kind: "method",
      title: "Dimension Reduction",
      summary: "Compressing many variables into a smaller representation while preserving important structure.",
      plain: ["Turns a large, complicated feature space into a map that can be inspected and compared."],
      methods: ["UMAP", "PCA", "MDS", "Embeddings"],
      projects: ["Longitudinal maps", "Governance similarity maps", "Exploratory structure"]
    },
    networks: {
      kind: "method",
      title: "Network Analysis",
      summary: "Studying systems where the relationships among actors matter as much as the actors themselves.",
      plain: ["Useful for coalitions, influence, diffusion, communication, and organizational structure."],
      methods: ["Centrality", "Communities", "Bipartite networks", "Temporal networks"],
      projects: ["Country–venue networks", "Institutional diffusion", "Actor–institution systems"]
    },
    nlp: {
      kind: "method",
      title: "Text / NLP",
      summary: "Turning documents, transcripts, and statements into structured evidence that can be analyzed statistically.",
      plain: ["The goal is to preserve who said what, in what context, while making large text collections measurable."],
      methods: ["Information extraction", "Text embeddings", "Attribution", "Classification"],
      projects: ["UN transcript automation", "Stance extraction", "Evidence-linked summarization"]
    },
    spatial: {
      kind: "method",
      title: "Spatial Statistics",
      summary: "Studying how geography and distance shape patterns of conflict, risk, and political behavior.",
      plain: ["Nearby events are often related; spatial methods model that dependence instead of ignoring it."],
      methods: ["Spatial dependence", "Distance analysis", "Geographic clustering"],
      projects: ["Conflict geography", "Humanitarian-risk mapping", "Event-pattern analysis"]
    },
    longitudinal: {
      kind: "method",
      title: "Longitudinal Methods",
      summary: "Studying how people, organizations, clusters, and systems change over time.",
      plain: ["A snapshot can hide the story; repeated observations show movement, persistence, and structural change."],
      methods: ["Panel models", "Repeated embeddings", "Trajectory analysis", "Alignment"],
      projects: ["driftmapR", "Cluster correspondence", "Movement uncertainty"]
    },
    bayesian: {
      kind: "method",
      title: "Bayesian / Probabilistic Models",
      summary: "Representing uncertainty directly when evidence is incomplete, noisy, or sparse.",
      plain: ["Instead of pretending the answer is exact, these models describe what is more or less plausible."],
      methods: ["Bayesian models", "Hierarchical models", "Probabilistic inference"],
      projects: ["Dynamic political models", "Uncertainty studies", "Sensitivity analysis"]
    },
    messy: {
      kind: "method",
      title: "Messy & Missing Data",
      summary: "Building analyses that remain useful when real-world data are incomplete, inconsistent, or imperfectly measured.",
      plain: ["Real datasets rarely arrive clean; the missingness and measurement problems are part of the analysis."],
      methods: ["Multiple imputation", "Robust preprocessing", "Sensitivity checks"],
      projects: ["Evidence pipelines", "Data-quality audits", "Missing-data workflows"]
    },
    multilevel: {
      kind: "method",
      title: "Multilevel Models",
      summary: "Modeling data with nested structure, such as events within places or observations within actors.",
      plain: ["These models separate individual-level variation from the larger groups or systems those observations belong to."],
      methods: ["Mixed effects", "Partial pooling", "Nested data"],
      projects: ["Repeated actor data", "Cross-national analysis", "Institutional comparisons"]
    },

    counterextremism: {
      kind: "domain",
      title: "Counterterrorism and counterextremism",
      summary: "Studying terrorist and extremist systems, behaviors, networks, and intervention-relevant structure.",
      plain: ["The focus is on discovering how violent movements organize, change, connect, and fragment."],
      methods: ["Clustering", "Networks", "Text / NLP", "Longitudinal methods"],
      projects: ["Extremist structure analysis", "Behavioral clustering", "Ideological mapping"]
    },
    violence: {
      kind: "domain",
      title: "Political Violence",
      summary: "Studying latent organization, escalation, fragmentation, and changing behavior in violent political systems.",
      plain: ["Formal organization names do not always capture who behaves similarly or how conflict structures evolve."],
      methods: ["Unsupervised learning", "Networks", "Spatial statistics", "Longitudinal methods"],
      projects: ["Conflict actor structure", "Event-pattern analysis", "Violence typologies"]
    },
    conflict: {
      kind: "domain",
      title: "Conflict Dynamics",
      summary: "Studying how conflicts develop, spread, reorganize, and change across time and space.",
      plain: ["The question is not only where violence happens, but how the structure of a conflict itself changes."],
      methods: ["Longitudinal methods", "Networks", "Spatial statistics"],
      projects: ["Trajectory analysis", "Cluster movement", "Conflict-network dynamics"]
    },
    institutions: {
      kind: "domain",
      title: "Institutions & Governance",
      summary: "Studying how states and institutions form, transmit, negotiate, and formalize policy ideas.",
      plain: ["Institutions create networks through which ideas, rules, and coalitions can move."],
      methods: ["Networks", "Text / NLP", "Longitudinal methods", "Unsupervised learning"],
      projects: ["UN process influence", "Institutional typologies", "Multilateral networks"]
    },
    aigov: {
      kind: "domain",
      title: "AI Governance",
      summary: "Studying how artificial-intelligence rules and governance models spread across countries and institutions.",
      plain: ["The research asks which governance ideas travel, through which institutions, and how those ideas change along the way."],
      methods: ["Networks", "Text / NLP", "Unsupervised learning", "Longitudinal methods"],
      projects: ["AI-governance diffusion", "Venue networks", "Forecasting regulatory instruments"]
    },
    autonomous: {
      kind: "domain",
      title: "Autonomous Systems",
      summary: "Studying governance and risk surrounding autonomous systems, including autonomous weapons and open-source AI capabilities.",
      plain: ["This connects technical change with questions of proliferation, governance, and human security."],
      methods: ["Networks", "Probabilistic models", "Text / NLP"],
      projects: ["Autonomous-weapon non-proliferation", "Open-source AI governance"]
    },
    humanitarian: {
      kind: "domain",
      title: "Human-Created Humanitarian Crises",
      summary: "Studying crises generated or intensified by conflict, political decisions, institutional failure, and organized violence.",
      plain: ["The aim is to detect structure in crises whose causes are social and political rather than purely natural."],
      methods: ["Spatial statistics", "Longitudinal methods", "Probabilistic models", "Missing-data methods"],
      projects: ["Humanitarian-risk modeling", "Conflict-driven crisis analysis", "Early-structure detection"]
    },
    humansecurity: {
      kind: "domain",
      title: "Human Security",
      summary: "Studying threats to people that emerge from conflict, instability, governance failure, and complex social systems.",
      plain: ["Human security connects the statistical work to the people affected by high-stakes political systems."],
      methods: ["Spatial statistics", "Probabilistic models", "Messy & missing data"],
      projects: ["Risk mapping", "Humanitarian decision support", "Crisis analysis"]
    },

    "q-latent": {
      kind: "question",
      title: "What structure exists before labels?",
      summary: "A recurring question whenever the meaningful groups are unknown before the analysis begins.",
      plain: ["Can the data reveal groups or regimes before we decide what to call them?"],
      methods: ["Unsupervised learning", "Clustering", "Dimension reduction"],
      projects: ["Conflict actor structure", "AI-governance maps"]
    },
    "q-labels": {
      kind: "question",
      title: "What if categories are contested?",
      summary: "Political and security labels are often incomplete, disputed, or strategically defined.",
      plain: ["The model should not treat a disputed category as unquestioned ground truth."],
      methods: ["Unsupervised learning", "Text / NLP", "Probabilistic models"],
      projects: ["Latent-structure studies", "Attribution and stance extraction"]
    },
    "q-diffusion": {
      kind: "question",
      title: "Diffusion or similar behavior?",
      summary: "Observed similarity does not prove that an idea or behavior actually moved from one actor to another.",
      plain: ["What evidence shows real transmission rather than coincidence or common exposure?"],
      methods: ["Network analysis", "Longitudinal methods", "Text evidence"],
      projects: ["AI-governance diffusion", "Institutional process analysis"]
    },
    "q-change": {
      kind: "question",
      title: "Real change or changing geometry?",
      summary: "Repeated statistical maps can move even when the underlying system has not changed substantively.",
      plain: ["How can we tell genuine movement from changes caused by the mapping method itself?"],
      methods: ["Longitudinal embeddings", "Alignment", "Bootstrap uncertainty"],
      projects: ["driftmapR"]
    },
    "q-early": {
      kind: "question",
      title: "Can structure reveal risk early?",
      summary: "Emerging organization may become visible before conventional labels or outcome measures stabilize.",
      plain: ["Can subtle structural changes provide useful warning before a crisis is obvious?"],
      methods: ["Unsupervised learning", "Longitudinal methods", "Spatial statistics"],
      projects: ["Early-structure detection", "Conflict dynamics"]
    },
    "q-missing": {
      kind: "question",
      title: "What survives incomplete evidence?",
      summary: "High-stakes political data are often missing, delayed, biased, or inconsistently observed.",
      plain: ["Which conclusions remain credible after explicitly accounting for imperfect evidence?"],
      methods: ["Messy & missing data", "Probabilistic models", "Multilevel models"],
      projects: ["Data-quality audits", "Sensitivity analysis", "Evidence pipelines"]
    }
  };

  const LAYOUT = {
    center: { x: 450, y: 300, r: 47, lines: ["Computational", "Statistics"], label: "inside" },

    unsupervised: { x: 350, y: 180, r: 33, lines: ["Unsupervised", "Learning"], group: "latent", primary: true },
    clustering: { x: 235, y: 120, r: 23, lines: ["Clustering"], group: "latent" },
    dimension: { x: 405, y: 92, r: 23, lines: ["Dimension", "Reduction"], group: "latent" },

    networks: { x: 560, y: 175, r: 27, lines: ["Network", "Analysis"], group: "relational" },
    nlp: { x: 660, y: 115, r: 22, lines: ["Text / NLP"], group: "relational" },
    spatial: { x: 250, y: 325, r: 22, lines: ["Spatial", "Statistics"], group: "relational" },

    longitudinal: { x: 355, y: 420, r: 25, lines: ["Longitudinal", "Methods"], group: "change" },
    bayesian: { x: 485, y: 458, r: 24, lines: ["Bayesian /", "Probabilistic"], group: "change" },
    messy: { x: 605, y: 435, r: 22, lines: ["Messy &", "Missing Data"], group: "change" },
    multilevel: { x: 255, y: 500, r: 20, lines: ["Multilevel", "Models"], group: "change" },

    counterextremism: { x: 105, y: 145, r: 28, lines: ["Counterterrorism", "& counterextremism"], group: "security" },
    violence: { x: 88, y: 290, r: 24, lines: ["Political", "Violence"], group: "security" },
    conflict: { x: 125, y: 430, r: 22, lines: ["Conflict", "Dynamics"], group: "security" },

    autonomous: { x: 700, y: 62, r: 21, lines: ["Autonomous", "Systems"], group: "governance" },
    institutions: { x: 735, y: 175, r: 25, lines: ["Institutions &", "Governance"], group: "governance" },
    aigov: { x: 805, y: 290, r: 25, lines: ["AI", "Governance"], group: "governance" },

    humanitarian: { x: 775, y: 465, r: 29, lines: ["Human-Created", "Humanitarian Crises"], group: "humanitarian" },
    humansecurity: { x: 655, y: 520, r: 22, lines: ["Human", "Security"], group: "humanitarian" },

    "q-latent": { x: 105, y: 145, r: 24, lines: ["Structure before", "labels?"], question: true },
    "q-labels": { x: 105, y: 285, r: 24, lines: ["Contested", "categories?"], question: true },
    "q-early": { x: 140, y: 445, r: 23, lines: ["Early structural", "warning?"], question: true },
    "q-diffusion": { x: 785, y: 145, r: 24, lines: ["Diffusion or", "similarity?"], question: true },
    "q-change": { x: 805, y: 315, r: 24, lines: ["Real change or", "geometry?"], question: true },
    "q-missing": { x: 700, y: 500, r: 24, lines: ["Incomplete", "evidence?"], question: true }
  };

  const HALOS = [
    { id: "latent", label: "LATENT STRUCTURE", cx: 330, cy: 150, rx: 155, ry: 100, type: "method" },
    { id: "relational", label: "RELATIONSHIPS + LANGUAGE", cx: 515, cy: 225, rx: 205, ry: 130, type: "method" },
    { id: "change", label: "CHANGE + UNCERTAINTY", cx: 425, cy: 455, rx: 235, ry: 95, type: "method" },
    { id: "security", label: "SECURITY", cx: 110, cy: 295, rx: 88, ry: 205, type: "domain" },
    { id: "governance", label: "GOVERNANCE + TECHNOLOGY", cx: 760, cy: 190, rx: 105, ry: 165, type: "domain" },
    { id: "humanitarian", label: "HUMAN SECURITY", cx: 720, cy: 475, rx: 120, ry: 88, type: "domain" }
  ];

  const EDGES = [
    ["center", "unsupervised", "core"], ["center", "networks", "core"], ["center", "spatial", "core"],
    ["center", "longitudinal", "core"], ["center", "bayesian", "core"], ["center", "nlp", "core"],
    ["center", "messy", "core"], ["center", "multilevel", "core"],

    ["unsupervised", "clustering", "method"], ["unsupervised", "dimension", "method"], ["clustering", "dimension", "method"],
    ["networks", "nlp", "method"], ["networks", "spatial", "method"],
    ["longitudinal", "bayesian", "method"], ["longitudinal", "multilevel", "method"], ["bayesian", "messy", "method"],
    ["multilevel", "messy", "method"], ["spatial", "longitudinal", "method"],

    ["counterextremism", "unsupervised", "domain"], ["counterextremism", "networks", "domain"],
    ["counterextremism", "nlp", "domain"], ["counterextremism", "longitudinal", "domain"],
    ["violence", "unsupervised", "domain"], ["violence", "networks", "domain"], ["violence", "spatial", "domain"],
    ["violence", "longitudinal", "domain"], ["conflict", "networks", "domain"], ["conflict", "spatial", "domain"],
    ["conflict", "longitudinal", "domain"],

    ["institutions", "networks", "domain"], ["institutions", "nlp", "domain"], ["institutions", "longitudinal", "domain"],
    ["aigov", "networks", "domain"], ["aigov", "nlp", "domain"], ["aigov", "unsupervised", "domain"],
    ["aigov", "bayesian", "domain"], ["autonomous", "networks", "domain"], ["autonomous", "nlp", "domain"],
    ["autonomous", "bayesian", "domain"],

    ["humanitarian", "spatial", "domain"], ["humanitarian", "longitudinal", "domain"],
    ["humanitarian", "bayesian", "domain"], ["humanitarian", "messy", "domain"],
    ["humansecurity", "spatial", "domain"], ["humansecurity", "bayesian", "domain"], ["humansecurity", "messy", "domain"],

    ["counterextremism", "violence", "domain-link"], ["violence", "conflict", "domain-link"],
    ["institutions", "aigov", "domain-link"], ["aigov", "autonomous", "domain-link"],
    ["humanitarian", "humansecurity", "domain-link"], ["conflict", "humanitarian", "domain-link"],

    ["q-latent", "unsupervised", "question"], ["q-latent", "clustering", "question"], ["q-latent", "dimension", "question"],
    ["q-labels", "unsupervised", "question"], ["q-labels", "nlp", "question"], ["q-labels", "bayesian", "question"],
    ["q-early", "unsupervised", "question"], ["q-early", "longitudinal", "question"], ["q-early", "spatial", "question"],
    ["q-diffusion", "networks", "question"], ["q-diffusion", "longitudinal", "question"], ["q-diffusion", "nlp", "question"],
    ["q-change", "longitudinal", "question"], ["q-change", "bayesian", "question"], ["q-change", "dimension", "question"],
    ["q-missing", "messy", "question"], ["q-missing", "bayesian", "question"], ["q-missing", "multilevel", "question"]
  ].map(([a, b, type]) => ({ a, b, type }));

  const section = document.querySelector(".rpm-section");
  const map = document.getElementById("rpm-map");
  if (!section || !map) return;

  section.classList.add("rpm-network-v3");

  const heading = section.querySelector(".section-header h2");
  const intro = section.querySelector(".section-header p");
  if (heading) heading.textContent = "A connected research program, not a list of projects.";
  if (intro) intro.innerHTML = "The map groups my methods and research domains by how they connect in practice. <strong>Computational statistics</strong> sits at the center; <strong>unsupervised learning</strong> is my primary methodological focus. Hover or select any node to trace its immediate neighborhood.";

  const modeButtons = [...section.querySelectorAll("[data-rpm-mode]")];
  if (modeButtons[0]) {
    modeButtons[0].textContent = "Network";
    modeButtons[0].dataset.rpmMode = "network";
  }
  if (modeButtons[1]) modeButtons[1].textContent = "Questions";

  const detailLabels = [...section.querySelectorAll(".rpm-detail-label")];
  if (detailLabels[0]) detailLabels[0].textContent = "In plain English";
  if (detailLabels[1]) detailLabels[1].textContent = "Related methods / concepts";
  if (detailLabels[2]) detailLabels[2].textContent = "Selected work";

  const detailFoot = section.querySelector(".rpm-detail-foot");
  if (detailFoot) detailFoot.textContent = "Node position shows conceptual grouping, not a measured score. Hover to trace direct links; click to lock a neighborhood.";

  const legend = section.querySelector(".rpm-footer-legend");
  if (legend) {
    legend.innerHTML = `
      <span class="rpm-legend-item"><span class="rpm-legend-symbol rpm-symbol-method">●</span> Method</span>
      <span class="rpm-legend-item"><span class="rpm-legend-symbol rpm-symbol-domain">○</span> Research domain</span>
      <span class="rpm-legend-item"><span class="rpm-legend-symbol rpm-symbol-question">◌</span> Open question</span>
      <span class="rpm-legend-item">Node size = emphasis, not an empirical score</span>`;
  }

  const footerState = section.querySelector(".rpm-footer-state");
  if (footerState) footerState.textContent = "Select a node to inspect its network";

  function haloMarkup(h) {
    return `<g class="rpm-cluster-halo rpm-cluster-${h.type}" data-cluster="${h.id}">
      <ellipse cx="${h.cx}" cy="${h.cy}" rx="${h.rx}" ry="${h.ry}" />
      <text x="${h.cx - h.rx + 12}" y="${h.cy - h.ry + 17}">${h.label}</text>
    </g>`;
  }

  function edgeMarkup(e) {
    const a = LAYOUT[e.a];
    const b = LAYOUT[e.b];
    return `<line class="rpm-edge rpm-edge-${e.type}${e.type === "question" ? " rpm-hidden" : ""}" data-a="${e.a}" data-b="${e.b}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" />`;
  }

  function labelMarkup(node, id) {
    if (id === "center") {
      return `<text class="rpm-network-center-label" text-anchor="middle" aria-hidden="true">
        <tspan x="0" y="-6">Computational</tspan>
        <tspan x="0" y="16">Statistics</tspan>
        <tspan class="rpm-network-center-sub" x="0" y="34">RESEARCH CORE</tspan>
      </text>`;
    }

    const start = node.r + 15;
    const tspans = node.lines.map((line, i) => `<tspan x="0" y="${start + i * 13}">${line}</tspan>`).join("");
    const primary = node.primary ? `<tspan class="rpm-network-node-sub" x="0" y="${start + node.lines.length * 13 + 2}">PRIMARY METHOD</tspan>` : "";
    return `<text class="rpm-network-node-label" text-anchor="middle" aria-hidden="true">${tspans}${primary}</text>`;
  }

  function nodeMarkup(id, node) {
    const data = DATA[id];
    const kind = data.kind;
    const extra = `${node.primary ? " rpm-primary" : ""}${kind === "question" ? " rpm-hidden" : ""}`;
    const hidden = kind === "question" ? ` tabindex="-1" aria-hidden="true"` : ` tabindex="0" aria-hidden="false"`;
    return `<g class="rpm-node rpm-network-node rpm-kind-${kind}${extra}${id === "center" ? " is-active" : ""}" role="button" data-id="${id}" transform="translate(${node.x} ${node.y})"${hidden}>
      <circle class="rpm-shape" r="${node.r}" />
      ${labelMarkup(node, id)}
    </g>`;
  }

  function renderNetwork() {
    const nodeIds = Object.keys(LAYOUT);
    map.setAttribute("viewBox", "0 0 900 600");
    map.innerHTML = `
      <title id="rpm-title">Interactive network map of the research program</title>
      <desc id="rpm-desc">A force-directed-style network showing clusters of statistical methods, substantive research domains, and open research questions. Computational statistics is the central node.</desc>
      <g class="rpm-halo-layer">${HALOS.map(haloMarkup).join("")}</g>
      <g class="rpm-edge-layer">${EDGES.map(edgeMarkup).join("")}</g>
      <g class="rpm-node-layer">${nodeIds.map(id => nodeMarkup(id, LAYOUT[id])).join("")}</g>`;
  }

  renderNetwork();

  const nodes = [...map.querySelectorAll(".rpm-node")];
  const edges = [...map.querySelectorAll(".rpm-edge")];
  const halos = [...map.querySelectorAll(".rpm-cluster-halo")];
  const mobile = section.querySelector(".rpm-mobile");

  const kicker = document.getElementById("rpm-detail-kicker");
  const title = document.getElementById("rpm-detail-title");
  const summary = document.getElementById("rpm-detail-summary");
  const plain = document.getElementById("rpm-detail-questions");
  const methods = document.getElementById("rpm-detail-methods");
  const projects = document.getElementById("rpm-detail-projects");

  let locked = null;
  let mode = "network";

  function nodeVisible(id) {
    const kind = DATA[id]?.kind;
    if (kind === "question") return mode === "questions";
    if (kind === "domain") return mode === "network";
    return true;
  }

  function edgeVisible(edge) {
    const type = edge.className.baseVal || edge.getAttribute("class") || "";
    if (type.includes("rpm-edge-question")) return mode === "questions";
    if (type.includes("rpm-edge-domain") || type.includes("rpm-edge-domain-link")) return mode === "network";
    return true;
  }

  function renderDetail(id) {
    const d = DATA[id] || DATA.center;
    kicker.textContent = d.kind === "core" ? "Research core" : d.kind === "method" ? "Method" : d.kind === "domain" ? "Research domain" : "Open question";
    title.textContent = d.title;
    summary.textContent = d.summary;
    plain.innerHTML = d.plain.map(x => `<li>${x}</li>`).join("");
    methods.innerHTML = d.methods.map(x => `<span class="rpm-chip">${x}</span>`).join("");
    projects.innerHTML = d.projects.map(x => `<li>${x}</li>`).join("");
  }

  function clearState() {
    nodes.forEach(node => node.classList.remove("is-active", "is-related", "is-muted"));
    edges.forEach(edge => edge.classList.remove("is-active", "is-muted"));
    halos.forEach(halo => halo.classList.remove("is-related", "is-muted"));
  }

  function showOverview() {
    clearState();
    const center = nodes.find(n => n.dataset.id === "center");
    if (center) center.classList.add("is-active");
    renderDetail("center");
    locked = null;
  }

  function neighbors(id) {
    const set = new Set([id]);
    edges.forEach(edge => {
      if (!edgeVisible(edge)) return;
      const a = edge.dataset.a;
      const b = edge.dataset.b;
      if (a === id) set.add(b);
      if (b === id) set.add(a);
    });
    return set;
  }

  function relatedClusters(ids) {
    const set = new Set();
    ids.forEach(id => {
      const g = LAYOUT[id]?.group;
      if (g) set.add(g);
    });
    return set;
  }

  function highlight(id, transient = false) {
    const related = neighbors(id);
    const clusters = relatedClusters(related);

    nodes.forEach(node => {
      const nodeId = node.dataset.id;
      if (!nodeVisible(nodeId)) return;
      node.classList.toggle("is-active", nodeId === id);
      node.classList.toggle("is-related", nodeId !== id && related.has(nodeId));
      node.classList.toggle("is-muted", !related.has(nodeId));
    });

    edges.forEach(edge => {
      if (!edgeVisible(edge)) return;
      const active = edge.dataset.a === id || edge.dataset.b === id;
      edge.classList.toggle("is-active", active);
      edge.classList.toggle("is-muted", !active);
    });

    halos.forEach(halo => {
      const visible = mode === "network" || halo.classList.contains("rpm-cluster-method");
      if (!visible) return;
      const relatedHalo = clusters.has(halo.dataset.cluster);
      halo.classList.toggle("is-related", relatedHalo);
      halo.classList.toggle("is-muted", clusters.size > 0 && !relatedHalo);
    });

    renderDetail(id);
    if (!transient) locked = id;
  }

  function restore() {
    if (locked) highlight(locked, true);
    else showOverview();
  }

  function setVisibility() {
    nodes.forEach(node => {
      const id = node.dataset.id;
      const visible = nodeVisible(id);
      node.classList.toggle("rpm-hidden", !visible);
      node.setAttribute("tabindex", visible ? "0" : "-1");
      node.setAttribute("aria-hidden", visible ? "false" : "true");
    });

    edges.forEach(edge => edge.classList.toggle("rpm-hidden", !edgeVisible(edge)));
    halos.forEach(halo => {
      const domainHalo = halo.classList.contains("rpm-cluster-domain");
      halo.classList.toggle("rpm-hidden", mode === "questions" && domainHalo);
    });
  }

  const MOBILE_GROUPS = [
    { title: "Latent structure", summary: "Methods for discovering hidden groups and low-dimensional structure.", ids: ["unsupervised", "clustering", "dimension"] },
    { title: "Relationships & language", summary: "Methods for analyzing connections, text, and spatial relationships.", ids: ["networks", "nlp", "spatial"] },
    { title: "Change & uncertainty", summary: "Methods for repeated observations, uncertainty, hierarchy, and imperfect data.", ids: ["longitudinal", "bayesian", "messy", "multilevel"] },
    { title: "Security", summary: "Substantive work on political violence and violent movements.", ids: ["counterextremism", "violence", "conflict"] },
    { title: "Governance & technology", summary: "Institutions, AI governance, and autonomous systems.", ids: ["institutions", "aigov", "autonomous"] },
    { title: "Human security", summary: "Humanitarian crises and threats to people in complex political systems.", ids: ["humanitarian", "humansecurity"] }
  ];

  function renderMobile() {
    if (!mobile) return;
    if (mode === "questions") {
      const ids = ["q-latent", "q-labels", "q-early", "q-diffusion", "q-change", "q-missing"];
      mobile.innerHTML = ids.map((id, i) => {
        const d = DATA[id];
        return `<div class="rpm-mobile-item${i === 0 ? " is-open" : ""}">
          <button class="rpm-mobile-trigger" type="button" aria-expanded="${i === 0 ? "true" : "false"}">
            <span class="rpm-mobile-name">${d.title}</span><span class="rpm-mobile-symbol">${i === 0 ? "−" : "+"}</span>
          </button>
          <div class="rpm-mobile-content"><p>${d.summary}</p>${d.methods.map(x => `<span>${x}</span>`).join("")}</div>
        </div>`;
      }).join("");
      return;
    }

    mobile.innerHTML = MOBILE_GROUPS.map((g, i) => `<div class="rpm-mobile-item${i === 0 ? " is-open" : ""}">
      <button class="rpm-mobile-trigger" type="button" aria-expanded="${i === 0 ? "true" : "false"}">
        <span class="rpm-mobile-name">${g.title}</span><span class="rpm-mobile-symbol">${i === 0 ? "−" : "+"}</span>
      </button>
      <div class="rpm-mobile-content"><p>${g.summary}</p>${g.ids.map(id => `<span>${DATA[id].title}</span>`).join("")}</div>
    </div>`).join("");
  }

  function setMode(nextMode) {
    mode = nextMode;
    map.dataset.mode = mode;
    modeButtons.forEach(button => {
      const active = button.dataset.rpmMode === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    setVisibility();
    renderMobile();
    showOverview();
  }

  nodes.forEach(node => {
    const id = node.dataset.id;
    node.addEventListener("mouseenter", () => { if (nodeVisible(id)) highlight(id, true); });
    node.addEventListener("mouseleave", restore);
    node.addEventListener("focus", () => { if (nodeVisible(id)) highlight(id, true); });
    node.addEventListener("blur", restore);
    node.addEventListener("click", () => {
      if (!nodeVisible(id)) return;
      if (id === "center" || locked === id) showOverview();
      else highlight(id);
    });
    node.addEventListener("keydown", event => {
      if ((event.key === "Enter" || event.key === " ") && nodeVisible(id)) {
        event.preventDefault();
        node.click();
      }
    });
  });

  modeButtons.forEach(button => button.addEventListener("click", () => setMode(button.dataset.rpmMode)));

  if (mobile) {
    mobile.addEventListener("click", event => {
      const button = event.target.closest(".rpm-mobile-trigger");
      if (!button) return;
      const item = button.closest(".rpm-mobile-item");
      const symbol = button.querySelector(".rpm-mobile-symbol");
      const opening = !item.classList.contains("is-open");
      item.classList.toggle("is-open", opening);
      button.setAttribute("aria-expanded", opening ? "true" : "false");
      symbol.textContent = opening ? "−" : "+";
    });
  }

  setMode("network");
})();
