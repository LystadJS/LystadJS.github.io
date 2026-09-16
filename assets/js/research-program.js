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
      summary: "Computational statistics for anticipatory human security: making catastrophic threats more legible before they become irreversible.",
      plain: [
        "The research identity is methodological first: discover hidden structure, quantify uncertainty, and detect consequential change in complex human systems.",
        "Political violence, humanitarian crises, emerging technologies, and security problems are application domains for that statistical program—not substitutes for it."
      ],
      methods: ["Unsupervised learning", "Longitudinal analysis", "Network methods", "Missing-data methods", "Spatial statistics", "Probabilistic inference"],
      projects: ["driftmapR", "Political-violence structure analysis", "AI-governance diffusion", "Humanitarian-risk analysis"]
    },

    pillar_structure: {
      kind: "pillar",
      title: "Latent Structure & Catastrophic Transition",
      summary: "Discovering hidden organization and identifying when complex systems are reorganizing toward qualitatively different states.",
      plain: [
        "The first question is often not 'what predicts the outcome?' but 'what structure exists before we know what the categories should be?'",
        "The second is whether changes in that structure signal fragmentation, escalation, convergence, or transition."
      ],
      methods: ["Unsupervised learning", "Clustering", "Dimension reduction", "Networks", "Longitudinal methods"],
      projects: ["Latent actor structure", "Changing embeddings", "Mass-violence structure", "Conflict transition analysis"]
    },
    pillar_degraded: {
      kind: "pillar",
      title: "Inference Under Degraded Information",
      summary: "Producing defensible statistical claims when evidence is missing, delayed, biased, sparse, heterogeneous, or only partially observed.",
      plain: [
        "High-stakes data are rarely clean enough to justify pretending uncertainty away.",
        "The goal is to determine what the evidence actually supports, what remains uncertain, and which conclusions survive reasonable alternative assumptions."
      ],
      methods: ["Missing-data methods", "Bayesian models", "Multilevel models", "Sensitivity analysis", "Text extraction"],
      projects: ["Data-quality audits", "Evidence-linked extraction", "Robustness studies", "Sparse-event analysis"]
    },
    pillar_anticipatory: {
      kind: "pillar",
      title: "Anticipatory Systems & Evidence Translation",
      summary: "Turning structural change, uncertainty, and heterogeneous evidence into early-warning systems and interpretable decision-relevant analysis.",
      plain: [
        "Anticipation does not mean pretending to predict the future with certainty.",
        "It means identifying meaningful signals early enough to improve understanding before outcomes become obvious or irreversible."
      ],
      methods: ["Forecasting", "Early warning", "Spatial statistics", "Longitudinal methods", "Networks", "Evidence translation"],
      projects: ["Humanitarian-risk monitoring", "AI-governance forecasting", "Conflict trajectory analysis", "Evidence-linked decision support"]
    },

    unsupervised: {
      kind: "method",
      title: "Unsupervised Learning",
      summary: "The signature toolkit for discovering structure without requiring predefined labels or outcomes.",
      plain: ["Ask what groups, regimes, or patterns are present before deciding what the categories should be."],
      methods: ["HDBSCAN", "Hierarchical clustering", "Mixture models", "Representation learning"],
      projects: ["Conflict actor structure", "Governance mapping", "Latent risk regimes"]
    },
    clustering: {
      kind: "method",
      title: "Clustering",
      summary: "Grouping observations that behave similarly so that the groups themselves become objects of scientific study.",
      plain: ["Useful when the research question concerns hidden subgroups, coalitions, regimes, or typologies."],
      methods: ["Density clustering", "Hierarchical clustering", "Fuzzy clustering"],
      projects: ["Actor typologies", "Behavioral grouping", "Coalition structure"]
    },
    dimension: {
      kind: "method",
      title: "Dimension Reduction",
      summary: "Compressing high-dimensional data into interpretable representations while preserving important structure.",
      plain: ["A complicated feature space becomes a map that can be inspected, compared, and tracked through time."],
      methods: ["PCA", "UMAP", "MDS", "Embeddings"],
      projects: ["Longitudinal maps", "Governance embeddings", "Exploratory structure"]
    },
    networks: {
      kind: "method",
      title: "Network Analysis",
      summary: "Studying systems where relationships among actors, institutions, or events are substantively meaningful.",
      plain: ["Networks help identify communities, bridges, diffusion pathways, and changing relational structure."],
      methods: ["Centrality", "Community detection", "Bipartite networks", "Temporal networks"],
      projects: ["Country–venue networks", "Institutional diffusion", "Conflict networks"]
    },
    longitudinal: {
      kind: "method",
      title: "Longitudinal Methods",
      summary: "Studying how latent structure, entities, risks, and relationships change through time.",
      plain: ["Repeated observations distinguish persistence, movement, transition, and structural change from a single snapshot."],
      methods: ["Panel models", "Repeated embeddings", "Trajectory analysis", "Alignment"],
      projects: ["driftmapR", "Cluster correspondence", "Movement uncertainty"]
    },
    missing: {
      kind: "method",
      title: "Messy & Missing Data",
      summary: "Treating incomplete and imperfect evidence as part of the inferential problem rather than a preprocessing nuisance.",
      plain: ["Missingness, inconsistent reporting, and weak measurement can change the answer; they must be modeled and audited."],
      methods: ["Multiple imputation", "Missingness analysis", "Robust preprocessing"],
      projects: ["Evidence pipelines", "Data-quality audits", "Missing-data workflows"]
    },
    bayesian: {
      kind: "method",
      title: "Bayesian / Probabilistic Models",
      summary: "Representing uncertainty directly when evidence is sparse, noisy, dependent, or evolving.",
      plain: ["These models describe what is more or less plausible instead of hiding uncertainty behind a single estimate."],
      methods: ["Bayesian updating", "Hierarchical models", "Probabilistic inference"],
      projects: ["Dynamic risk models", "Uncertainty studies", "Sparse-event inference"]
    },
    multilevel: {
      kind: "method",
      title: "Multilevel Models",
      summary: "Modeling observations that are nested within larger structures such as actors, places, institutions, countries, or time periods.",
      plain: ["Separates case-level variation from the systems those cases belong to."],
      methods: ["Mixed effects", "Partial pooling", "Nested data"],
      projects: ["Cross-national analysis", "Institutional comparisons", "Repeated actor data"]
    },
    validation: {
      kind: "method",
      title: "Sensitivity & Validation",
      summary: "Testing whether conclusions survive reasonable alternative assumptions, samples, specifications, and measurement choices.",
      plain: ["A result is more useful when you know what makes it disappear."],
      methods: ["Sensitivity analysis", "Bootstrap validation", "Robustness checks"],
      projects: ["Model audits", "Calibration studies", "Evidence validation"]
    },
    nlp: {
      kind: "method",
      title: "Text / NLP",
      summary: "Transforming documents, transcripts, and statements into structured evidence without losing attribution or context.",
      plain: ["Large text collections become measurable while preserving who said what and where the evidence came from."],
      methods: ["Information extraction", "Embeddings", "Attribution", "Classification"],
      projects: ["UN transcript automation", "Stance extraction", "Evidence-linked summarization"]
    },
    spatial: {
      kind: "method",
      title: "Spatial Statistics",
      summary: "Studying how geography, proximity, and spatial dependence shape risk and human outcomes.",
      plain: ["Events that occur near one another are often related; spatial methods model that dependence rather than ignoring it."],
      methods: ["Spatial dependence", "Distance analysis", "Geographic clustering"],
      projects: ["Conflict geography", "Humanitarian-risk mapping", "Climate-risk analysis"]
    },
    forecasting: {
      kind: "method",
      title: "Forecasting & Early Warning",
      summary: "Estimating how systems may evolve while keeping uncertainty explicit and emphasizing signal detection over false precision.",
      plain: ["The aim is not certainty about the future; it is earlier recognition of meaningful change."],
      methods: ["Forecasting", "Change detection", "Scenario analysis"],
      projects: ["AI-governance forecasting", "Risk monitoring", "Early-warning systems"]
    },

    political: {
      kind: "domain",
      title: "Political Violence",
      summary: "Studying organization, escalation, fragmentation, and changing behavior in violent political systems.",
      plain: ["This is a substantive testbed for methods that discover hidden groups, transitions, and relational structure."],
      methods: ["Unsupervised learning", "Networks", "Longitudinal methods"],
      projects: ["Violence typologies", "Actor structure", "Event-pattern analysis"]
    },
    massviolence: {
      kind: "domain",
      title: "Mass Violence",
      summary: "Studying large-scale organized harm and the structural changes that precede or sustain catastrophic escalation.",
      plain: ["The central scientific problem is recognizing meaningful transition before the endpoint is obvious."],
      methods: ["Unsupervised learning", "Longitudinal methods", "Forecasting"],
      projects: ["Escalation structure", "Mass-violence risk analysis"]
    },
    counterextremism: {
      kind: "domain",
      title: "Counterterrorism and counterextremism",
      summary: "Applying statistical methods to terrorist and extremist systems while keeping the scientific focus on organization, change, and intervention-relevant structure.",
      plain: ["This is an application domain for the broader statistical program, not the identity of the program itself."],
      methods: ["Unsupervised learning", "Networks", "Text / NLP", "Spatial statistics"],
      projects: ["Extremist structure analysis", "Behavioral clustering", "Counterterrorism analytics"]
    },
    humanecology: {
      kind: "domain",
      title: "Human Ecology",
      summary: "Studying how populations, institutions, environments, and social systems interact to produce vulnerability, adaptation, and risk.",
      plain: ["Human ecology broadens anticipatory human security beyond conflict alone."],
      methods: ["Multilevel models", "Spatial statistics", "Networks"],
      projects: ["Human-systems analysis", "Environmental and social vulnerability"]
    },
    humanitarian: {
      kind: "domain",
      title: "Human-Created Humanitarian Crises",
      summary: "Studying crises produced or intensified by conflict, political decisions, institutional failure, and organized violence.",
      plain: ["These crises are ideal examples of degraded information, nonlinear change, and urgent evidence translation."],
      methods: ["Missing-data methods", "Spatial statistics", "Forecasting", "Probabilistic models"],
      projects: ["Humanitarian-risk modeling", "Conflict-driven crisis analysis", "Early-warning analysis"]
    },
    humansecurity: {
      kind: "domain",
      title: "Human Security",
      summary: "The broad substantive frame: threats to human life and well-being arising from violent, political, institutional, environmental, and technological systems.",
      plain: ["Human security is the application space that ties otherwise different high-stakes problems together."],
      methods: ["Forecasting", "Spatial statistics", "Longitudinal methods", "Sensitivity analysis"],
      projects: ["Risk mapping", "Crisis analysis", "Humanitarian decision support"]
    },
    climate: {
      kind: "domain",
      title: "Climate & Environmental Risk",
      summary: "Studying environmental stress as part of interacting human systems rather than as an isolated physical hazard.",
      plain: ["The interest is in how environmental change interacts with vulnerability, institutions, conflict, and humanitarian outcomes."],
      methods: ["Spatial statistics", "Multilevel models", "Forecasting"],
      projects: ["Climate-risk analysis", "Human-ecology research", "Food-security applications"]
    },
    ainonproliferation: {
      kind: "domain",
      title: "AI Non-Proliferation",
      summary: "Studying the spread and governance of advanced AI capabilities as an emerging human-security problem.",
      plain: ["This is one emerging-technology application of diffusion analysis, degraded evidence, and anticipatory governance."],
      methods: ["Networks", "Text / NLP", "Forecasting", "Missing-data methods"],
      projects: ["Open-source AI non-proliferation", "Multilateral AI governance"]
    },
    autonomous: {
      kind: "domain",
      title: "Autonomous Systems",
      summary: "Studying governance and risk surrounding autonomous systems, including autonomous weapons and related emerging technologies.",
      plain: ["The statistical problem is to understand diffusion, uncertainty, and changing risk before governance catches up."],
      methods: ["Networks", "Probabilistic models", "Forecasting"],
      projects: ["Autonomous-systems governance", "Weapons non-proliferation"]
    },

    "q-latent": {
      kind: "question",
      title: "What structure exists before labels?",
      summary: "A foundational question for unsupervised learning and latent-structure research.",
      plain: ["Can the data reveal groups or regimes before we decide what to call them?"],
      methods: ["Unsupervised learning", "Clustering", "Dimension reduction"],
      projects: ["Actor structure", "Latent risk regimes"]
    },
    "q-transition": {
      kind: "question",
      title: "When is a system approaching catastrophic transition?",
      summary: "A question about whether structural change can reveal escalation before the final outcome is obvious.",
      plain: ["Which changes are ordinary variation, and which indicate that the system is reorganizing into something more dangerous?"],
      methods: ["Longitudinal methods", "Networks", "Forecasting"],
      projects: ["Mass-violence transition", "Conflict trajectories"]
    },
    "q-degraded": {
      kind: "question",
      title: "What can be inferred from degraded information?",
      summary: "A core inference question for missing, biased, sparse, delayed, or heterogeneous evidence.",
      plain: ["What does the evidence support when the dataset is not clean enough for easy answers?"],
      methods: ["Missing-data methods", "Bayesian models", "Multilevel models"],
      projects: ["Evidence pipelines", "Sparse-event analysis"]
    },
    "q-robust": {
      kind: "question",
      title: "What survives alternative assumptions?",
      summary: "A robustness question about whether conclusions remain stable when reasonable analytical choices change.",
      plain: ["Which claims disappear when the model, sample, missing-data treatment, or measurement choices change?"],
      methods: ["Sensitivity analysis", "Validation", "Probabilistic models"],
      projects: ["Model audits", "Calibration studies"]
    },
    "q-early": {
      kind: "question",
      title: "Can risk become legible before outcomes are visible?",
      summary: "The central anticipatory question: whether structural signals can become useful before conventional indicators fully register the threat.",
      plain: ["Can we recognize a dangerous pattern early enough to understand it before it becomes irreversible?"],
      methods: ["Forecasting", "Spatial statistics", "Longitudinal methods"],
      projects: ["Early-warning systems", "Humanitarian-risk monitoring"]
    },
    "q-translation": {
      kind: "question",
      title: "Which signals are strong enough to become evidence?",
      summary: "A translation question about moving from exploratory structure to defensible, interpretable evidence for real decisions.",
      plain: ["How do we turn a statistical pattern into something useful without overstating what the data prove?"],
      methods: ["Validation", "Text / NLP", "Networks", "Forecasting"],
      projects: ["Evidence-linked systems", "Research translation"]
    }
  };

  const LAYOUT = {
    center: { x: 480, y: 315, r: 45, lines: ["Computational", "Statistics"], groups: ["structure", "degraded", "anticipatory"] },

    pillar_structure: { x: 295, y: 225, r: 34, lines: ["Latent Structure", "& Transition"], groups: ["structure"], pillar: true },
    pillar_degraded: { x: 665, y: 225, r: 34, lines: ["Degraded", "Information"], groups: ["degraded"], pillar: true },
    pillar_anticipatory: { x: 480, y: 455, r: 36, lines: ["Anticipatory", "Systems"], groups: ["anticipatory"], pillar: true },

    unsupervised: { x: 175, y: 145, r: 31, lines: ["Unsupervised", "Learning"], groups: ["structure"], primary: true },
    clustering: { x: 65, y: 225, r: 21, lines: ["Clustering"], groups: ["structure"] },
    dimension: { x: 285, y: 78, r: 22, lines: ["Dimension", "Reduction"], groups: ["structure"] },
    networks: { x: 405, y: 145, r: 25, lines: ["Network", "Analysis"], groups: ["structure", "anticipatory"] },
    longitudinal: { x: 340, y: 395, r: 24, lines: ["Longitudinal", "Methods"], groups: ["structure", "anticipatory"] },

    multilevel: { x: 640, y: 82, r: 21, lines: ["Multilevel", "Models"], groups: ["degraded"] },
    missing: { x: 805, y: 145, r: 24, lines: ["Messy &", "Missing Data"], groups: ["degraded"] },
    bayesian: { x: 820, y: 270, r: 24, lines: ["Bayesian /", "Probabilistic"], groups: ["degraded"] },
    validation: { x: 700, y: 355, r: 22, lines: ["Sensitivity", "& Validation"], groups: ["degraded", "anticipatory"] },
    nlp: { x: 585, y: 125, r: 22, lines: ["Text / NLP"], groups: ["degraded", "anticipatory"] },

    forecasting: { x: 485, y: 555, r: 28, lines: ["Forecasting", "& Early Warning"], groups: ["anticipatory"] },
    spatial: { x: 315, y: 535, r: 22, lines: ["Spatial", "Statistics"], groups: ["anticipatory"] },

    political: { x: 65, y: 78, r: 23, lines: ["Political", "Violence"], groups: ["structure", "anticipatory"] },
    massviolence: { x: 80, y: 340, r: 24, lines: ["Mass", "Violence"], groups: ["structure", "anticipatory"] },
    counterextremism: { x: 165, y: 505, r: 26, lines: ["Counterterrorism", "& counterextremism"], groups: ["structure", "anticipatory"] },
    humanecology: { x: 255, y: 590, r: 22, lines: ["Human", "Ecology"], groups: ["structure", "anticipatory"] },

    ainonproliferation: { x: 895, y: 95, r: 27, lines: ["AI", "Non-Proliferation"], groups: ["degraded", "anticipatory"] },
    autonomous: { x: 900, y: 305, r: 22, lines: ["Autonomous", "Systems"], groups: ["degraded", "anticipatory"] },
    humanitarian: { x: 835, y: 470, r: 28, lines: ["Human-Created", "Humanitarian Crises"], groups: ["degraded", "anticipatory"] },
    humansecurity: { x: 665, y: 575, r: 28, lines: ["Human", "Security"], groups: ["degraded", "anticipatory"] },
    climate: { x: 855, y: 590, r: 24, lines: ["Climate &", "Environmental Risk"], groups: ["degraded", "anticipatory"] },

    "q-latent": { x: 70, y: 95, r: 24, lines: ["Structure before", "labels?"], groups: ["structure"], question: true },
    "q-transition": { x: 90, y: 330, r: 25, lines: ["Catastrophic", "transition?"], groups: ["structure", "anticipatory"], question: true },
    "q-degraded": { x: 890, y: 95, r: 24, lines: ["Degraded", "information?"], groups: ["degraded"], question: true },
    "q-robust": { x: 900, y: 305, r: 24, lines: ["Robust to", "assumptions?"], groups: ["degraded"], question: true },
    "q-early": { x: 835, y: 470, r: 25, lines: ["Risk legible", "early?"], groups: ["anticipatory"], question: true },
    "q-translation": { x: 660, y: 575, r: 25, lines: ["Signal to", "evidence?"], groups: ["degraded", "anticipatory"], question: true }
  };

  const HALOS = [
    { id: "structure", lines: ["LATENT STRUCTURE", "+ TRANSITION"], cx: 270, cy: 205, rx: 245, ry: 165, labelX: 270, labelY: 20, stemFromY: 26, stemToY: 40 },
    { id: "degraded", lines: ["DEGRADED INFORMATION", "+ INFERENCE"], cx: 700, cy: 205, rx: 235, ry: 165, labelX: 700, labelY: 20, stemFromY: 26, stemToY: 40 },
    { id: "anticipatory", lines: ["ANTICIPATORY SYSTEMS", "+ EVIDENCE"], cx: 485, cy: 455, rx: 275, ry: 155, labelX: 485, labelY: 618, stemFromY: 603, stemToY: 610 }
  ];

  const EDGES = [
    ["center", "pillar_structure", "pillar"], ["center", "pillar_degraded", "pillar"], ["center", "pillar_anticipatory", "pillar"],

    ["pillar_structure", "unsupervised", "method"], ["pillar_structure", "clustering", "method"],
    ["pillar_structure", "dimension", "method"], ["pillar_structure", "networks", "method"],
    ["pillar_structure", "longitudinal", "method"],

    ["pillar_degraded", "multilevel", "method"], ["pillar_degraded", "missing", "method"],
    ["pillar_degraded", "bayesian", "method"], ["pillar_degraded", "validation", "method"],
    ["pillar_degraded", "nlp", "method"],

    ["pillar_anticipatory", "forecasting", "method"], ["pillar_anticipatory", "spatial", "method"],
    ["pillar_anticipatory", "longitudinal", "method"], ["pillar_anticipatory", "networks", "method"],
    ["pillar_anticipatory", "nlp", "method"], ["pillar_anticipatory", "validation", "method"],

    ["unsupervised", "clustering", "method-link"], ["unsupervised", "dimension", "method-link"],
    ["networks", "longitudinal", "method-link"], ["missing", "bayesian", "method-link"],
    ["missing", "validation", "method-link"], ["bayesian", "multilevel", "method-link"],
    ["forecasting", "longitudinal", "method-link"], ["forecasting", "spatial", "method-link"],

    ["political", "unsupervised", "domain"], ["political", "networks", "domain"], ["political", "longitudinal", "domain"],
    ["massviolence", "unsupervised", "domain"], ["massviolence", "forecasting", "domain"], ["massviolence", "longitudinal", "domain"],
    ["counterextremism", "unsupervised", "domain"], ["counterextremism", "networks", "domain"], ["counterextremism", "nlp", "domain"], ["counterextremism", "spatial", "domain"],
    ["humanecology", "multilevel", "domain"], ["humanecology", "spatial", "domain"], ["humanecology", "networks", "domain"],

    ["humanitarian", "missing", "domain"], ["humanitarian", "bayesian", "domain"], ["humanitarian", "spatial", "domain"], ["humanitarian", "forecasting", "domain"],
    ["humansecurity", "forecasting", "domain"], ["humansecurity", "longitudinal", "domain"], ["humansecurity", "spatial", "domain"], ["humansecurity", "validation", "domain"],
    ["climate", "spatial", "domain"], ["climate", "multilevel", "domain"], ["climate", "forecasting", "domain"],
    ["ainonproliferation", "networks", "domain"], ["ainonproliferation", "nlp", "domain"], ["ainonproliferation", "forecasting", "domain"], ["ainonproliferation", "missing", "domain"],
    ["autonomous", "networks", "domain"], ["autonomous", "bayesian", "domain"], ["autonomous", "forecasting", "domain"],

    ["political", "massviolence", "domain-link"], ["political", "counterextremism", "domain-link"],
    ["massviolence", "humanitarian", "domain-link"], ["humanecology", "humansecurity", "domain-link"],
    ["humanecology", "climate", "domain-link"], ["humanitarian", "humansecurity", "domain-link"],
    ["humansecurity", "climate", "domain-link"], ["ainonproliferation", "autonomous", "domain-link"],

    ["q-latent", "unsupervised", "question"], ["q-latent", "clustering", "question"], ["q-latent", "dimension", "question"],
    ["q-transition", "longitudinal", "question"], ["q-transition", "networks", "question"], ["q-transition", "forecasting", "question"],
    ["q-degraded", "missing", "question"], ["q-degraded", "bayesian", "question"], ["q-degraded", "multilevel", "question"],
    ["q-robust", "validation", "question"], ["q-robust", "bayesian", "question"], ["q-robust", "missing", "question"],
    ["q-early", "forecasting", "question"], ["q-early", "spatial", "question"], ["q-early", "longitudinal", "question"],
    ["q-translation", "validation", "question"], ["q-translation", "nlp", "question"], ["q-translation", "networks", "question"], ["q-translation", "forecasting", "question"]
  ].map(([a, b, type]) => ({ a, b, type }));

  const section = document.querySelector(".rpm-section");
  const map = document.getElementById("rpm-map");
  if (!section || !map) return;

  section.classList.add("rpm-anticipatory-identity");

  const heading = section.querySelector(".section-header h2");
  const intro = section.querySelector(".section-header p");
  if (heading) heading.textContent = "Computational Statistics for Anticipatory Human Security.";
  if (intro) {
    intro.innerHTML = "Make catastrophic threats to human security legible before they become irreversible. The research program is organized around <strong>latent structure and transition</strong>, <strong>inference under degraded information</strong>, and <strong>anticipatory systems and evidence translation</strong>.";
  }

  const modeButtons = [...section.querySelectorAll("[data-rpm-mode]")];
  if (modeButtons[0]) {
    modeButtons[0].textContent = "Program";
    modeButtons[0].dataset.rpmMode = "program";
  }
  if (modeButtons[1]) modeButtons[1].textContent = "Questions";

  const detailLabels = [...section.querySelectorAll(".rpm-detail-label")];
  if (detailLabels[0]) detailLabels[0].textContent = "In plain English";
  if (detailLabels[1]) detailLabels[1].textContent = "Methods / concepts";
  if (detailLabels[2]) detailLabels[2].textContent = "Selected work";

  const detailFoot = section.querySelector(".rpm-detail-foot");
  if (detailFoot) detailFoot.textContent = "The map is a conceptual research architecture, not a fitted embedding. Position indicates intellectual proximity; node size indicates emphasis, not an empirical score.";

  const legend = section.querySelector(".rpm-footer-legend");
  if (legend) {
    legend.innerHTML = `
      <span class="rpm-legend-item"><span class="rpm-legend-symbol rpm-symbol-pillar">◆</span> Research pillar</span>
      <span class="rpm-legend-item"><span class="rpm-legend-symbol rpm-symbol-method">●</span> Method</span>
      <span class="rpm-legend-item"><span class="rpm-legend-symbol rpm-symbol-domain">○</span> Application domain</span>
      <span class="rpm-legend-item"><span class="rpm-legend-symbol rpm-symbol-question">◌</span> Open question</span>`;
  }

  const footerState = section.querySelector(".rpm-footer-state");
  if (footerState) footerState.textContent = "Statistician first · human-security applications second";

  function haloMarkup(h) {
    const tspans = h.lines.map((line, i) => `<tspan x="${h.labelX}" dy="${i === 0 ? 0 : 8.5}">${line}</tspan>`).join("");
    return `<g class="rpm-cluster-halo" data-cluster="${h.id}">
      <ellipse cx="${h.cx}" cy="${h.cy}" rx="${h.rx}" ry="${h.ry}" />
      <path class="rpm-cluster-halo-stem" d="M ${h.labelX} ${h.stemFromY} L ${h.labelX} ${h.stemToY}" />
      <text class="rpm-cluster-halo-label" x="${h.labelX}" y="${h.labelY}" text-anchor="middle">${tspans}</text>
    </g>`;
  }

  function edgeMarkup(e) {
    const a = LAYOUT[e.a];
    const b = LAYOUT[e.b];
    return `<line class="rpm-edge rpm-edge-${e.type}${e.type === "question" ? " rpm-hidden" : ""}" data-a="${e.a}" data-b="${e.b}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" />`;
  }

  function shapeMarkup(id, node, kind) {
    if (kind === "pillar") {
      const r = node.r;
      return `<polygon class="rpm-shape" points="0,${-r} ${r * .86},0 0,${r} ${-r * .86},0" />`;
    }
    return `<circle class="rpm-shape" r="${node.r}" />`;
  }

  function labelMarkup(node, id) {
    if (id === "center") {
      return `<text class="rpm-network-center-label" text-anchor="middle" aria-hidden="true">
        <tspan x="0" y="-8">Computational</tspan>
        <tspan x="0" y="14">Statistics</tspan>
        <tspan class="rpm-network-center-sub" x="0" y="34">ANTICIPATORY HUMAN SECURITY</tspan>
      </text>`;
    }

    const start = node.r + 15;
    const tspans = node.lines.map((line, i) => `<tspan x="0" y="${start + i * 13}">${line}</tspan>`).join("");
    const primary = node.primary ? `<tspan class="rpm-network-node-sub" x="0" y="${start + node.lines.length * 13 + 2}">SIGNATURE METHOD</tspan>` : "";
    return `<text class="rpm-network-node-label" text-anchor="middle" aria-hidden="true">${tspans}${primary}</text>`;
  }

  function nodeMarkup(id, node) {
    const data = DATA[id];
    const kind = data.kind;
    const extra = `${node.primary ? " rpm-primary" : ""}${kind === "question" ? " rpm-hidden" : ""}`;
    const hidden = kind === "question" ? ` tabindex="-1" aria-hidden="true"` : ` tabindex="0" aria-hidden="false"`;
    return `<g class="rpm-node rpm-network-node rpm-kind-${kind}${extra}${id === "center" ? " is-active" : ""}" role="button" data-id="${id}" transform="translate(${node.x} ${node.y})"${hidden}>
      ${shapeMarkup(id, node, kind)}
      ${labelMarkup(node, id)}
    </g>`;
  }

  function renderNetwork() {
    map.setAttribute("viewBox", "0 0 960 640");
    map.innerHTML = `
      <title id="rpm-title">Research architecture for computational statistics and anticipatory human security</title>
      <desc id="rpm-desc">A conceptual network centered on computational statistics, with three research pillars, statistical methods, high-stakes human-security application domains, and open research questions.</desc>
      <g class="rpm-halo-layer">${HALOS.map(haloMarkup).join("")}</g>
      <g class="rpm-edge-layer">${EDGES.map(edgeMarkup).join("")}</g>
      <g class="rpm-node-layer">${Object.keys(LAYOUT).map(id => nodeMarkup(id, LAYOUT[id])).join("")}</g>`;
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
  let mode = "program";

  function nodeVisible(id) {
    const kind = DATA[id]?.kind;
    if (kind === "question") return mode === "questions";
    if (kind === "domain") return mode === "program";
    return true;
  }

  function edgeVisible(edge) {
    const type = edge.className.baseVal || edge.getAttribute("class") || "";
    if (type.includes("rpm-edge-question")) return mode === "questions";
    if (type.includes("rpm-edge-domain") || type.includes("rpm-edge-domain-link")) return mode === "program";
    return true;
  }

  function renderDetail(id) {
    const d = DATA[id] || DATA.center;
    kicker.textContent = d.kind === "core" ? "Research identity" : d.kind === "pillar" ? "Research pillar" : d.kind === "method" ? "Method" : d.kind === "domain" ? "Application domain" : "Open question";
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
    ids.forEach(id => (LAYOUT[id]?.groups || []).forEach(g => set.add(g)));
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
  }

  const MOBILE_GROUPS = [
    { title: "Latent Structure & Catastrophic Transition", summary: "Discover hidden organization and detect consequential structural change.", ids: ["unsupervised", "clustering", "dimension", "networks", "longitudinal"] },
    { title: "Inference Under Degraded Information", summary: "Make defensible claims from incomplete, sparse, biased, or heterogeneous evidence.", ids: ["missing", "bayesian", "multilevel", "validation", "nlp"] },
    { title: "Anticipatory Systems & Evidence Translation", summary: "Turn structural signals and uncertainty into interpretable early-warning evidence.", ids: ["forecasting", "spatial", "longitudinal", "networks", "nlp", "validation"] },
    { title: "Human-Security Applications", summary: "High-stakes domains that test and motivate the statistical program.", ids: ["political", "massviolence", "counterextremism", "humanecology", "humanitarian", "humansecurity", "climate", "ainonproliferation", "autonomous"] }
  ];

  function renderMobile() {
    if (!mobile) return;
    if (mode === "questions") {
      const ids = ["q-latent", "q-transition", "q-degraded", "q-robust", "q-early", "q-translation"];
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

  setMode("program");
})();
