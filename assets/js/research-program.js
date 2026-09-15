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
      summary: "Using statistical computing to find structure, measure change, and represent uncertainty across research, policy, and operational problems.",
      plain: [
        "The map is arranged by shared research setting and application context, not by a formal empirical distance.",
        "Nodes that sit between neighborhoods are intentionally placed there because they connect more than one part of the research program."
      ],
      methods: ["Unsupervised learning", "Networks", "Longitudinal models", "Text analysis", "Spatial statistics", "Probabilistic models"],
      projects: ["AI-governance diffusion", "UN evidence systems", "Conflict and violence structure mapping"]
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
      plain: ["Turns a large feature space into a map that can be inspected, compared, and tracked over time."],
      methods: ["UMAP", "PCA", "MDS", "Embeddings"],
      projects: ["Longitudinal maps", "Governance similarity maps", "Exploratory structure"]
    },
    multilevel: {
      kind: "method",
      title: "Multilevel Models",
      summary: "Modeling observations that are nested inside larger structures such as places, organizations, countries, or time periods.",
      plain: ["Separates case-level variation from the larger systems those cases belong to."],
      methods: ["Mixed effects", "Partial pooling", "Nested data"],
      projects: ["Cross-national analysis", "Institutional comparisons", "Repeated actor data"]
    },
    networks: {
      kind: "method",
      title: "Network Analysis",
      summary: "Studying systems where relationships among actors, institutions, or venues matter as much as the actors themselves.",
      plain: ["This is a bridge method: it links theoretical structure to coalition, influence, diffusion, and institutional questions."],
      methods: ["Centrality", "Communities", "Bipartite networks", "Temporal networks"],
      projects: ["Country–venue networks", "Institutional diffusion", "Actor–institution systems"]
    },
    nlp: {
      kind: "method",
      title: "Text / NLP",
      summary: "Turning documents, transcripts, and statements into structured evidence that can be analyzed statistically.",
      plain: ["The goal is to preserve who said what and in what context while making large text collections measurable."],
      methods: ["Information extraction", "Text embeddings", "Attribution", "Classification"],
      projects: ["UN transcript automation", "Stance extraction", "Evidence-linked summarization"]
    },
    messy: {
      kind: "method",
      title: "Messy & Missing Data",
      summary: "Building analyses that remain useful when real-world evidence is incomplete, inconsistent, delayed, or imperfectly measured.",
      plain: ["The data-quality problem is treated as part of the research design rather than a preprocessing inconvenience."],
      methods: ["Multiple imputation", "Robust preprocessing", "Sensitivity checks"],
      projects: ["Evidence pipelines", "Data-quality audits", "Missing-data workflows"]
    },
    longitudinal: {
      kind: "method",
      title: "Longitudinal Methods",
      summary: "Studying how people, organizations, clusters, and systems change over time.",
      plain: ["A snapshot can hide the story; repeated observations show movement, persistence, and structural change."],
      methods: ["Panel models", "Repeated embeddings", "Trajectory analysis", "Alignment"],
      projects: ["driftmapR", "Cluster correspondence", "Movement uncertainty"]
    },
    spatial: {
      kind: "method",
      title: "Spatial Statistics",
      summary: "Studying how geography and distance shape conflict, risk, humanitarian conditions, and operational behavior.",
      plain: ["Nearby events are often related; spatial methods model that dependence instead of ignoring it."],
      methods: ["Spatial dependence", "Distance analysis", "Geographic clustering"],
      projects: ["Conflict geography", "Humanitarian-risk mapping", "Event-pattern analysis"]
    },
    bayesian: {
      kind: "method",
      title: "Bayesian / Probabilistic Models",
      summary: "Representing uncertainty directly when evidence is incomplete, noisy, sparse, or evolving.",
      plain: ["Instead of pretending the answer is exact, these models describe what is more or less plausible."],
      methods: ["Bayesian models", "Hierarchical models", "Probabilistic inference"],
      projects: ["Dynamic political models", "Uncertainty studies", "Sensitivity analysis"]
    },

    violence: {
      kind: "domain",
      title: "Political Violence",
      summary: "Studying latent organization, escalation, fragmentation, and changing behavior in violent political systems.",
      plain: ["This sits close to the research-heavy side of the map but connects directly to counterterrorism and conflict analysis."],
      methods: ["Unsupervised learning", "Networks", "Longitudinal methods"],
      projects: ["Conflict actor structure", "Violence typologies", "Event-pattern analysis"]
    },
    humanecology: {
      kind: "domain",
      title: "Human Ecology",
      summary: "Studying how human populations, institutions, environments, and social systems interact to produce vulnerability and adaptation.",
      plain: ["It sits between theory-driven research and applied multilateral work because the questions naturally span both."],
      methods: ["Dimension reduction", "Multilevel models", "Network analysis"],
      projects: ["Human-systems analysis", "Environmental and social vulnerability"]
    },
    massviolence: {
      kind: "domain",
      title: "Mass Violence",
      summary: "Studying large-scale organized harm, escalation, and the structures that precede or sustain it.",
      plain: ["This is another bridge between academic research and applied policy because the same structural questions matter for explanation and prevention."],
      methods: ["Unsupervised learning", "Networks", "Multilevel models"],
      projects: ["Escalation patterns", "Mass-violence risk structure"]
    },
    counterextremism: {
      kind: "domain",
      title: "Counterterrorism and counterextremism",
      summary: "Studying terrorist and extremist systems, behaviors, networks, and intervention-relevant structure.",
      plain: ["Its position between research and military-facing work is intentional: the domain depends on both explanatory science and operational application."],
      methods: ["Unsupervised learning", "Networks", "Spatial statistics", "Probabilistic models"],
      projects: ["Extremist structure analysis", "Counterterrorism analytics", "Behavioral clustering"]
    },
    conflict: {
      kind: "domain",
      title: "Conflict Dynamics",
      summary: "Studying how conflicts develop, spread, reorganize, and change across time and space.",
      plain: ["This leans toward operational work but remains connected to academic research on violence and structural change."],
      methods: ["Longitudinal methods", "Spatial statistics", "Probabilistic models"],
      projects: ["Trajectory analysis", "Conflict-network dynamics", "Movement analysis"]
    },

    institutions: {
      kind: "domain",
      title: "Institutions & Governance",
      summary: "Studying how states and institutions form, transmit, negotiate, and formalize policy ideas.",
      plain: ["This is placed firmly in the multilateral and diplomatic neighborhood of the map."],
      methods: ["Networks", "Text / NLP", "Multilevel models"],
      projects: ["UN process influence", "Institutional typologies", "Multilateral networks"]
    },
    aigov: {
      kind: "domain",
      title: "AI Governance",
      summary: "Studying how artificial-intelligence rules and governance models spread across countries and institutions.",
      plain: ["It bridges research and diplomatic application because it combines methodological questions about diffusion with live institutional processes."],
      methods: ["Networks", "Text / NLP", "Longitudinal methods"],
      projects: ["AI-governance diffusion", "Venue networks", "Regulatory forecasting"]
    },
    ainonproliferation: {
      kind: "domain",
      title: "AI Non-Proliferation",
      summary: "Studying multilateral and diplomatic approaches to limiting dangerous proliferation of advanced AI capabilities.",
      plain: ["This is placed firmly inside the UN / State-oriented neighborhood because the core problem is institutional, diplomatic, and multilateral."],
      methods: ["Network analysis", "Text / NLP", "Messy & missing data"],
      projects: ["Open-source AI non-proliferation", "Multilateral AI governance"]
    },
    autonomous: {
      kind: "domain",
      title: "Autonomous Systems",
      summary: "Studying governance and risk surrounding autonomous systems, including autonomous weapons and open-source AI capabilities.",
      plain: ["This sits between diplomatic and military-facing work because the technology creates both governance and operational questions."],
      methods: ["Networks", "Probabilistic models", "Longitudinal methods"],
      projects: ["Autonomous-weapon non-proliferation", "Open-source AI governance"]
    },
    humanitarian: {
      kind: "domain",
      title: "Human-Created Humanitarian Crises",
      summary: "Studying crises generated or intensified by conflict, political decisions, institutional failure, and organized violence.",
      plain: ["It remains connected to multilateral response but is pulled toward the operational side because crisis conditions are experienced on the ground."],
      methods: ["Spatial statistics", "Longitudinal methods", "Probabilistic models", "Missing-data methods"],
      projects: ["Humanitarian-risk modeling", "Conflict-driven crisis analysis", "Early-structure detection"]
    },
    humansecurity: {
      kind: "domain",
      title: "Human Security",
      summary: "Studying threats to people that emerge from conflict, instability, governance failure, and complex social systems.",
      plain: ["This is a bridge between diplomatic and military-facing work, with a slight operational pull."],
      methods: ["Spatial statistics", "Longitudinal methods", "Probabilistic models"],
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
    "q-proliferation": {
      kind: "question",
      title: "How does dangerous capability spread?",
      summary: "A question about technological diffusion, institutional response, and the movement of capabilities across actors and borders.",
      plain: ["Which pathways make proliferation more likely, and where can institutions observe or interrupt them?"],
      methods: ["Network analysis", "Text / NLP", "Messy & missing data"],
      projects: ["AI non-proliferation", "Autonomous-systems governance"]
    },
    "q-early": {
      kind: "question",
      title: "Can structure reveal risk early?",
      summary: "Emerging organization may become visible before conventional labels or outcome measures stabilize.",
      plain: ["Can subtle structural changes provide useful warning before a crisis is obvious?"],
      methods: ["Unsupervised learning", "Longitudinal methods", "Spatial statistics"],
      projects: ["Early-structure detection", "Conflict dynamics"]
    },
    "q-change": {
      kind: "question",
      title: "Real change or changing geometry?",
      summary: "Repeated statistical maps can move even when the underlying system has not changed substantively.",
      plain: ["How can we tell genuine movement from changes caused by the mapping method itself?"],
      methods: ["Longitudinal embeddings", "Alignment", "Bootstrap uncertainty"],
      projects: ["driftmapR"]
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

  /*
    Positions are intentionally curated to create three implicit neighborhoods:
    research-heavy work at upper-left, diplomatic/multilateral work at upper-right,
    and military/operational work toward the lower-left / lower-center.
    Those neighborhoods are not labeled in the UI.
  */
  const LAYOUT = {
    center: { x: 450, y: 300, r: 46, lines: ["Computational", "Statistics"], groups: ["academic", "un", "military"] },

    unsupervised: { x: 300, y: 165, r: 31, lines: ["Unsupervised", "Learning"], groups: ["academic"], primary: true },
    clustering: { x: 185, y: 115, r: 22, lines: ["Clustering"], groups: ["academic"] },
    dimension: { x: 350, y: 78, r: 22, lines: ["Dimension", "Reduction"], groups: ["academic"] },
    multilevel: { x: 175, y: 255, r: 20, lines: ["Multilevel", "Models"], groups: ["academic"] },

    networks: { x: 535, y: 178, r: 26, lines: ["Network", "Analysis"], groups: ["academic", "un"] },
    nlp: { x: 650, y: 140, r: 21, lines: ["Text / NLP"], groups: ["un"] },
    messy: { x: 700, y: 285, r: 21, lines: ["Messy &", "Missing Data"], groups: ["un"] },

    longitudinal: { x: 565, y: 405, r: 24, lines: ["Longitudinal", "Methods"], groups: ["un", "military"] },
    spatial: { x: 315, y: 445, r: 22, lines: ["Spatial", "Statistics"], groups: ["military"] },
    bayesian: { x: 435, y: 500, r: 23, lines: ["Bayesian /", "Probabilistic"], groups: ["military"] },

    violence: { x: 72, y: 160, r: 23, lines: ["Political", "Violence"], groups: ["academic"] },
    humanecology: { x: 445, y: 100, r: 22, lines: ["Human", "Ecology"], groups: ["academic", "un"] },
    massviolence: { x: 455, y: 155, r: 22, lines: ["Mass", "Violence"], groups: ["academic", "un"] },

    counterextremism: { x: 235, y: 345, r: 28, lines: ["Counterterrorism", "& counterextremism"], groups: ["academic", "military"] },
    conflict: { x: 220, y: 525, r: 22, lines: ["Conflict", "Dynamics"], groups: ["academic", "military"] },

    aigov: { x: 795, y: 92, r: 23, lines: ["AI", "Governance"], groups: ["academic", "un"] },
    institutions: { x: 815, y: 180, r: 24, lines: ["Institutions &", "Governance"], groups: ["un"] },
    ainonproliferation: { x: 805, y: 275, r: 27, lines: ["AI", "Non-Proliferation"], groups: ["un"] },

    autonomous: { x: 735, y: 355, r: 22, lines: ["Autonomous", "Systems"], groups: ["un", "military"] },
    humanitarian: { x: 690, y: 455, r: 28, lines: ["Human-Created", "Humanitarian Crises"], groups: ["un", "military"] },
    humansecurity: { x: 575, y: 535, r: 23, lines: ["Human", "Security"], groups: ["un", "military"] },

    "q-latent": { x: 105, y: 120, r: 24, lines: ["Structure before", "labels?"], groups: ["academic"], question: true },
    "q-labels": { x: 230, y: 245, r: 23, lines: ["Contested", "categories?"], groups: ["academic", "un"], question: true },
    "q-diffusion": { x: 800, y: 135, r: 24, lines: ["Diffusion or", "similarity?"], groups: ["un"], question: true },
    "q-proliferation": { x: 805, y: 270, r: 24, lines: ["Capability", "proliferation?"], groups: ["un"], question: true },
    "q-early": { x: 705, y: 430, r: 23, lines: ["Early structural", "warning?"], groups: ["un", "military"], question: true },
    "q-change": { x: 350, y: 540, r: 24, lines: ["Real change or", "geometry?"], groups: ["military"], question: true },
    "q-missing": { x: 590, y: 525, r: 24, lines: ["Incomplete", "evidence?"], groups: ["un", "military"], question: true }
  };

  const HALOS = [
    { id: "academic", cx: 255, cy: 175, rx: 240, ry: 155 },
    { id: "un", cx: 690, cy: 205, rx: 220, ry: 175 },
    { id: "military", cx: 345, cy: 470, rx: 275, ry: 145 }
  ];

  const EDGES = [
    ["center", "unsupervised", "core"], ["center", "networks", "core"], ["center", "nlp", "core"],
    ["center", "messy", "core"], ["center", "longitudinal", "core"], ["center", "spatial", "core"],
    ["center", "bayesian", "core"], ["center", "multilevel", "core"],

    ["unsupervised", "clustering", "method"], ["unsupervised", "dimension", "method"],
    ["clustering", "dimension", "method"], ["dimension", "multilevel", "method"],
    ["networks", "nlp", "method"], ["networks", "longitudinal", "method"],
    ["nlp", "messy", "method"], ["messy", "longitudinal", "method"],
    ["longitudinal", "spatial", "method"], ["longitudinal", "bayesian", "method"],
    ["spatial", "bayesian", "method"],

    ["violence", "unsupervised", "domain"], ["violence", "clustering", "domain"], ["violence", "networks", "domain"],
    ["humanecology", "dimension", "domain"], ["humanecology", "multilevel", "domain"], ["humanecology", "networks", "domain"],
    ["massviolence", "unsupervised", "domain"], ["massviolence", "multilevel", "domain"], ["massviolence", "networks", "domain"],

    ["counterextremism", "unsupervised", "domain"], ["counterextremism", "networks", "domain"],
    ["counterextremism", "spatial", "domain"], ["counterextremism", "bayesian", "domain"],
    ["conflict", "spatial", "domain"], ["conflict", "longitudinal", "domain"], ["conflict", "bayesian", "domain"],

    ["institutions", "networks", "domain"], ["institutions", "nlp", "domain"], ["institutions", "multilevel", "domain"],
    ["aigov", "networks", "domain"], ["aigov", "nlp", "domain"], ["aigov", "longitudinal", "domain"],
    ["ainonproliferation", "networks", "domain"], ["ainonproliferation", "nlp", "domain"], ["ainonproliferation", "messy", "domain"],

    ["autonomous", "networks", "domain"], ["autonomous", "longitudinal", "domain"], ["autonomous", "bayesian", "domain"],
    ["humanitarian", "messy", "domain"], ["humanitarian", "longitudinal", "domain"],
    ["humanitarian", "spatial", "domain"], ["humanitarian", "bayesian", "domain"],
    ["humansecurity", "longitudinal", "domain"], ["humansecurity", "spatial", "domain"], ["humansecurity", "bayesian", "domain"],

    ["violence", "massviolence", "domain-link"], ["massviolence", "humanecology", "domain-link"],
    ["violence", "counterextremism", "domain-link"], ["counterextremism", "conflict", "domain-link"],
    ["humanecology", "institutions", "domain-link"], ["massviolence", "humanitarian", "domain-link"],
    ["institutions", "aigov", "domain-link"], ["aigov", "ainonproliferation", "domain-link"],
    ["ainonproliferation", "autonomous", "domain-link"], ["autonomous", "humanitarian", "domain-link"],
    ["humanitarian", "humansecurity", "domain-link"], ["conflict", "humansecurity", "domain-link"],

    ["q-latent", "unsupervised", "question"], ["q-latent", "clustering", "question"], ["q-latent", "dimension", "question"],
    ["q-labels", "unsupervised", "question"], ["q-labels", "nlp", "question"], ["q-labels", "bayesian", "question"],
    ["q-diffusion", "networks", "question"], ["q-diffusion", "longitudinal", "question"], ["q-diffusion", "nlp", "question"],
    ["q-proliferation", "networks", "question"], ["q-proliferation", "nlp", "question"], ["q-proliferation", "messy", "question"],
    ["q-early", "longitudinal", "question"], ["q-early", "spatial", "question"], ["q-early", "messy", "question"],
    ["q-change", "longitudinal", "question"], ["q-change", "bayesian", "question"], ["q-change", "dimension", "question"],
    ["q-missing", "messy", "question"], ["q-missing", "bayesian", "question"], ["q-missing", "multilevel", "question"]
  ].map(([a, b, type]) => ({ a, b, type }));

  const section = document.querySelector(".rpm-section");
  const map = document.getElementById("rpm-map");
  if (!section || !map) return;

  section.classList.add("rpm-network-v4");

  const heading = section.querySelector(".section-header h2");
  const intro = section.querySelector(".section-header p");
  if (heading) heading.textContent = "A research program organized by shared problems and applications.";
  if (intro) {
    intro.innerHTML = "Nearby nodes tend to share data, questions, or application context; bridge nodes connect otherwise distinct parts of the program. <strong>Computational statistics</strong> remains the center, with <strong>unsupervised learning</strong> as the primary methodological focus.";
  }

  const modeButtons = [...section.querySelectorAll("[data-rpm-mode]")];
  if (modeButtons[0]) {
    modeButtons[0].textContent = "Domains";
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
    return `<g class="rpm-cluster-halo rpm-cluster-context" data-cluster="${h.id}">
      <ellipse cx="${h.cx}" cy="${h.cy}" rx="${h.rx}" ry="${h.ry}" />
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
      <title id="rpm-title">Interactive conceptual network map of the research program</title>
      <desc id="rpm-desc">A network-style map showing methods, research domains, and open questions arranged into three implicit neighborhoods without labeling those neighborhoods directly. Computational statistics is the central node.</desc>
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

  function groupsFor(id) {
    return new Set(LAYOUT[id]?.groups || []);
  }

  function relatedClusters(ids) {
    const set = new Set();
    ids.forEach(id => groupsFor(id).forEach(g => set.add(g)));
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
    halos.forEach(halo => halo.classList.remove("rpm-hidden"));
  }

  const MOBILE_GROUPS = [
    {
      title: "Structure, ecology & violence",
      summary: "Research-oriented work on latent structure, political violence, human ecology, and mass violence.",
      ids: ["unsupervised", "clustering", "dimension", "multilevel", "violence", "humanecology", "massviolence"]
    },
    {
      title: "Institutions, AI & diplomacy",
      summary: "Applied institutional work on governance, AI policy, non-proliferation, and evidence from multilateral systems.",
      ids: ["networks", "nlp", "messy", "institutions", "aigov", "ainonproliferation"]
    },
    {
      title: "Conflict, operations & human security",
      summary: "Operationally oriented work on counterterrorism, conflict dynamics, autonomous systems, humanitarian crises, and human security.",
      ids: ["counterextremism", "conflict", "longitudinal", "spatial", "bayesian", "autonomous", "humanitarian", "humansecurity"]
    }
  ];

  function renderMobile() {
    if (!mobile) return;
    if (mode === "questions") {
      const ids = ["q-latent", "q-labels", "q-diffusion", "q-proliferation", "q-early", "q-change", "q-missing"];
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