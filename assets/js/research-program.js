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
      kicker: "Research core",
      title: "Computational Statistics",
      summary: "Statistical computing for discovering structure, measuring change, and quantifying uncertainty in complex human systems.",
      questions: [
        "What structure exists when meaningful categories are incomplete or unknown?",
        "Which observed patterns represent substantive change rather than measurement or representation artifacts?",
        "How can uncertainty remain explicit in high-stakes empirical work?"
      ],
      methods: [
        "Unsupervised learning",
        "Network analysis",
        "Longitudinal methods",
        "Text-as-data",
        "Spatial statistics",
        "Statistical learning"
      ],
      projects: [
        "Longitudinal embedding alignment",
        "UN transcript evidence systems",
        "AI-governance diffusion research"
      ]
    },

    unsupervised: {
      kicker: "Primary methodological focus",
      title: "Unsupervised Learning",
      summary: "Discovering latent structure without requiring predefined outcome classes or treating contested categories as ground truth.",
      questions: [
        "Which groups, regimes, or structures emerge from the data before labels are imposed?",
        "When does apparent clustering reflect substantive organization rather than algorithmic convenience?",
        "How can latent representations remain interpretable as entities and relationships change?"
      ],
      methods: [
        "UMAP",
        "PCA",
        "HDBSCAN",
        "Hierarchical clustering",
        "Mixture models",
        "Fuzzy clustering"
      ],
      projects: [
        "Conflict actor structure",
        "AI-governance mapping",
        "Longitudinal embedding alignment"
      ]
    },

    networks: {
      kicker: "Method",
      title: "Network Methods",
      summary: "Representing political and institutional systems through relationships among actors, states, organizations, and venues.",
      questions: [
        "Which actors bridge otherwise separated groups?",
        "How do coalitions form, fragment, and reorganize?",
        "When does relational similarity support a diffusion claim, and when is it only resemblance?"
      ],
      methods: [
        "Centrality",
        "Community detection",
        "Bipartite networks",
        "Diffusion paths",
        "Temporal networks"
      ],
      projects: [
        "UN venue networks",
        "Institutional diffusion analysis",
        "Actor–institution process mapping"
      ]
    },

    longitudinal: {
      kicker: "Method",
      title: "Longitudinal Methods",
      summary: "Studying structural change through time while distinguishing real movement from changes induced by measurement or representation.",
      questions: [
        "How can repeated low-dimensional representations be compared?",
        "How should uncertainty in entity-level movement be quantified?",
        "What changes when the observed set of actors is not constant?"
      ],
      methods: [
        "Repeated embeddings",
        "Alignment",
        "Bootstrap uncertainty",
        "Panel models",
        "Trajectory analysis"
      ],
      projects: [
        "driftmapR",
        "Cluster correspondence",
        "Movement-uncertainty studies"
      ]
    },

    nlp: {
      kicker: "Method",
      title: "Text / NLP",
      summary: "Turning political and institutional language into structured evidence while preserving attribution, context, and uncertainty.",
      questions: [
        "How can positions and behaviors be extracted reliably from long institutional records?",
        "How can attribution errors be detected before downstream analysis?",
        "What language signals changing stance, endorsement, opposition, or uncertainty?"
      ],
      methods: [
        "Information extraction",
        "Text embeddings",
        "Attribution",
        "Classification",
        "Evidence-linked summarization"
      ],
      projects: [
        "UN transcript automation",
        "Topic-agnostic stance extraction",
        "Evidence-linked summarization"
      ]
    },

    spatial: {
      kicker: "Method",
      title: "Spatial Methods",
      summary: "Using geographic dependence and spatial organization to study conflict, humanitarian risk, and political behavior.",
      questions: [
        "Where are risks concentrated, and how stable are those concentrations?",
        "Do neighboring events reflect diffusion, common exposure, or shared structural conditions?",
        "How does geography interact with latent actor and network structure?"
      ],
      methods: [
        "Spatial statistics",
        "Distance analysis",
        "Geographic clustering",
        "Spatial visualization"
      ],
      projects: [
        "Conflict geography",
        "Humanitarian-risk mapping",
        "Event-pattern analysis"
      ]
    },

    bayesian: {
      kicker: "Method",
      title: "Bayesian / Statistical Learning",
      summary: "Quantifying uncertainty in systems where evidence is sparse, noisy, dependent, or only partially observed.",
      questions: [
        "How should prior information enter models of rare political events?",
        "How can uncertainty remain explicit when evidence is incomplete?",
        "Which conclusions survive reasonable changes in model assumptions?"
      ],
      methods: [
        "Bayesian models",
        "Hierarchical models",
        "Probabilistic inference",
        "Sensitivity analysis"
      ],
      projects: [
        "Dynamic political models",
        "Uncertainty studies",
        "Validation pipelines"
      ]
    },

    violence: {
      kicker: "Research problem",
      title: "Political Violence",
      summary: "Studying latent organization, behavioral similarity, escalation, fragmentation, and change in violent political systems.",
      questions: [
        "Which actors behave similarly despite different formal identities?",
        "Can latent structure reveal emerging fragmentation or coalition formation?",
        "Which patterns precede meaningful shifts in violence?"
      ],
      methods: [
        "Unsupervised learning",
        "Networks",
        "Spatial analysis",
        "Text / NLP",
        "Longitudinal methods"
      ],
      projects: [
        "Conflict actor structure",
        "Event-pattern analysis",
        "Latent violence typologies"
      ]
    },

    extremism: {
      kicker: "Research problem",
      title: "Counterterrorism and counterextremism",
      summary: "Studying terrorist and extremist actors, networks, behaviors, and intervention-relevant structures without relying on fixed or uncontested labels.",
      questions: [
        "How should extremist similarity be measured without assuming predefined categories?",
        "When do organizations converge ideologically or operationally?",
        "Can emerging structures be detected before they are formally recognized?"
      ],
      methods: [
        "Unsupervised learning",
        "Networks",
        "Text embeddings",
        "Longitudinal methods"
      ],
      projects: [
        "Extremist structure analysis",
        "Behavioral clustering",
        "Ideological representation mapping"
      ]
    },

    institutions: {
      kicker: "Research problem",
      title: "Institutions & Governance",
      summary: "Studying how states and institutions generate, transmit, alter, and formalize governance ideas and political preferences.",
      questions: [
        "Which institutional structures make ideas more portable?",
        "How can diffusion be separated from parallel adoption or textual similarity?",
        "Which venues convert preferences into durable outputs?"
      ],
      methods: [
        "Networks",
        "Longitudinal methods",
        "Text / NLP",
        "Unsupervised learning"
      ],
      projects: [
        "AI-governance diffusion",
        "UN process influence",
        "Institutional typology research"
      ]
    },

    humanitarian: {
      kicker: "Research problem",
      title: "Human-Created Humanitarian Crises",
      summary: "Studying crises generated or intensified by political decisions, institutional failure, conflict, and organized violence.",
      questions: [
        "Which structural patterns precede worsening humanitarian outcomes?",
        "How can latent risk regimes be identified before conventional labels stabilize?",
        "How do conflict, governance, geography, and uncertainty interact in crisis formation?"
      ],
      methods: [
        "Longitudinal methods",
        "Spatial statistics",
        "Statistical learning",
        "Clustering"
      ],
      projects: [
        "Humanitarian-risk modeling",
        "Conflict-driven crisis analysis",
        "Early-structure detection"
      ]
    },

    "q-latent": {
      kicker: "Open research question",
      title: "What structure exists before labels?",
      summary: "A recurring question across political violence, counterterrorism and counterextremism, humanitarian risk, institutional behavior, and representation learning.",
      questions: [
        "Which structures emerge from the observations themselves rather than from analyst-defined categories?"
      ],
      methods: [
        "Clustering",
        "Representation learning",
        "Spatial structure"
      ],
      projects: [
        "Conflict actor structure",
        "AI-governance maps"
      ]
    },

    "q-labels": {
      kicker: "Open research question",
      title: "What if categories are contested?",
      summary: "Many consequential political concepts have disputed, incomplete, or strategically constructed labels.",
      questions: [
        "How can statistical models remain useful without treating disputed categories as unquestioned ground truth?"
      ],
      methods: [
        "Unsupervised learning",
        "Text-as-data",
        "Probabilistic classification"
      ],
      projects: [
        "Topic-agnostic extraction",
        "Latent-structure studies"
      ]
    },

    "q-diffusion": {
      kicker: "Open research question",
      title: "Diffusion or merely similar behavior?",
      summary: "Observed resemblance does not by itself establish that an idea, rule, or behavior moved from one actor to another.",
      questions: [
        "What process evidence is needed to distinguish diffusion from parallel adoption, common exposure, or coincidence?"
      ],
      methods: [
        "Network analysis",
        "Longitudinal methods",
        "Text evidence"
      ],
      projects: [
        "AI-governance diffusion",
        "UN institutional analysis"
      ]
    },

    "q-change": {
      kicker: "Open research question",
      title: "Real movement or changing geometry?",
      summary: "Repeated latent maps can move even when the underlying entities have not changed substantively.",
      questions: [
        "How can substantive movement be separated from arbitrary orientation, scaling, sampling variation, and changing entity sets?"
      ],
      methods: [
        "Longitudinal embeddings",
        "Alignment",
        "Bootstrap uncertainty"
      ],
      projects: [
        "driftmapR"
      ]
    }
  };

  const map = document.getElementById("rpm-map");
  if (!map) return;

  const nodes = [...document.querySelectorAll(".rpm-node")];
  const edges = [...document.querySelectorAll(".rpm-edge")];
  const problemNodes = [...document.querySelectorAll(".rpm-layer-problem")];
  const questionNodes = [...document.querySelectorAll(".rpm-layer-question")];
  const modeButtons = [...document.querySelectorAll("[data-rpm-mode]")];
  const mobile = document.querySelector(".rpm-mobile");

  const kicker = document.getElementById("rpm-detail-kicker");
  const title = document.getElementById("rpm-detail-title");
  const summary = document.getElementById("rpm-detail-summary");
  const questions = document.getElementById("rpm-detail-questions");
  const methods = document.getElementById("rpm-detail-methods");
  const projects = document.getElementById("rpm-detail-projects");

  let locked = null;
  let mode = "problems";

  function updateVisibleCopy() {
    const intro = document.querySelector("#research-program .section-header p");
    if (intro) {
      intro.textContent =
        "My research uses computational statistics—especially unsupervised learning—to study political violence, counterterrorism and counterextremism, institutional behavior, and human-created humanitarian crises when categories are incomplete, contested, or changing.";
    }

    const extremismNode = document.querySelector('.rpm-node[data-id="extremism"]');
    if (extremismNode) {
      const labels = extremismNode.querySelectorAll("text");
      if (labels[0]) labels[0].textContent = "Counterterrorism and";
      if (labels[1]) labels[1].textContent = "counterextremism";
    }
  }

  function edgeIsVisible(edge) {
    if (edge.classList.contains("rpm-question-edge")) return mode === "questions";
    if (edge.classList.contains("rpm-problem-edge")) return mode === "problems";
    return true;
  }

  function nodeIsVisible(node) {
    if (node.classList.contains("rpm-layer-question")) return mode === "questions";
    if (node.classList.contains("rpm-layer-problem")) return mode === "problems";
    return true;
  }

  function neighbors(id) {
    const result = new Set([id]);

    edges.forEach(edge => {
      if (!edgeIsVisible(edge)) return;

      const a = edge.dataset.a;
      const b = edge.dataset.b;

      if (a === id) result.add(b);
      if (b === id) result.add(a);
    });

    return result;
  }

  function renderDetail(id) {
    const d = DATA[id] || DATA.center;

    kicker.textContent = d.kicker;
    title.textContent = d.title;
    summary.textContent = d.summary;
    questions.innerHTML = d.questions.map(x => `<li>${x}</li>`).join("");
    methods.innerHTML = d.methods.map(x => `<span class="rpm-chip">${x}</span>`).join("");
    projects.innerHTML = d.projects.map(x => `<li>${x}</li>`).join("");
  }

  function clearState() {
    nodes.forEach(node => node.classList.remove("is-active", "is-related", "is-muted"));
    edges.forEach(edge => edge.classList.remove("is-active", "is-muted"));
  }

  function showOverview() {
    clearState();

    const center = nodes.find(node => node.dataset.id === "center");
    if (center) center.classList.add("is-active");

    renderDetail("center");
    locked = null;
  }

  function highlight(id, transient = false) {
    const related = neighbors(id);

    nodes.forEach(node => {
      const nodeId = node.dataset.id;

      if (!nodeIsVisible(node)) {
        node.classList.remove("is-active", "is-related", "is-muted");
        return;
      }

      node.classList.toggle("is-active", nodeId === id);
      node.classList.toggle("is-related", nodeId !== id && related.has(nodeId));
      node.classList.toggle("is-muted", !related.has(nodeId));
    });

    edges.forEach(edge => {
      if (!edgeIsVisible(edge)) {
        edge.classList.remove("is-active", "is-muted");
        return;
      }

      const active = edge.dataset.a === id || edge.dataset.b === id;
      edge.classList.toggle("is-active", active);
      edge.classList.toggle("is-muted", !active);
    });

    renderDetail(id);

    if (!transient) locked = id;
  }

  function restore() {
    if (locked) {
      highlight(locked, true);
    } else {
      showOverview();
    }
  }

  function mobileEntriesForMode(nextMode) {
    if (nextMode === "questions") {
      return ["q-latent", "q-labels", "q-diffusion", "q-change"];
    }

    return ["violence", "extremism", "institutions", "humanitarian"];
  }

  function renderMobile(nextMode) {
    if (!mobile) return;

    const entries = mobileEntriesForMode(nextMode);

    mobile.innerHTML = entries.map((id, index) => {
      const d = DATA[id];
      const chips = d.methods.map(x => `<span>${x}</span>`).join("");

      return `
        <div class="rpm-mobile-item${index === 0 ? " is-open" : ""}" data-mobile-id="${id}">
          <button class="rpm-mobile-trigger" type="button" aria-expanded="${index === 0 ? "true" : "false"}">
            <span class="rpm-mobile-name">${d.title}</span>
            <span class="rpm-mobile-symbol">${index === 0 ? "−" : "+"}</span>
          </button>
          <div class="rpm-mobile-content">
            <p>${d.summary}</p>
            ${chips}
          </div>
        </div>`;
    }).join("");
  }

  function setMode(nextMode) {
    mode = nextMode;
    map.dataset.mode = mode;

    modeButtons.forEach(button => {
      const active = button.dataset.rpmMode === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    problemNodes.forEach(node => {
      const visible = mode === "problems";
      node.setAttribute("tabindex", visible ? "0" : "-1");
      node.setAttribute("aria-hidden", visible ? "false" : "true");
    });

    questionNodes.forEach(node => {
      const visible = mode === "questions";
      node.setAttribute("tabindex", visible ? "0" : "-1");
      node.setAttribute("aria-hidden", visible ? "false" : "true");
    });

    renderMobile(mode);
    showOverview();
  }

  nodes.forEach(node => {
    const id = node.dataset.id;

    node.addEventListener("mouseenter", () => {
      if (nodeIsVisible(node)) highlight(id, true);
    });

    node.addEventListener("mouseleave", restore);

    node.addEventListener("focus", () => {
      if (nodeIsVisible(node)) highlight(id, true);
    });

    node.addEventListener("blur", restore);

    node.addEventListener("click", () => {
      if (!nodeIsVisible(node)) return;

      if (id === "center" || locked === id) {
        showOverview();
      } else {
        highlight(id);
      }
    });

    node.addEventListener("keydown", event => {
      if ((event.key === "Enter" || event.key === " ") && nodeIsVisible(node)) {
        event.preventDefault();
        node.click();
      }
    });
  });

  modeButtons.forEach(button => {
    button.addEventListener("click", () => setMode(button.dataset.rpmMode));
  });

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

  updateVisibleCopy();
  setMode("problems");
})();