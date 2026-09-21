(() => {
  "use strict";

  const payload = window.JSLResearchProgramData;
  if (!payload) return;
  const { REPOS, DATA, LAYOUT, HALOS, EDGES, MOBILE_GROUPS } = payload;

  const section = document.querySelector(".rpm-section");
  const map = document.getElementById("rpm-map");
  if (!section || !map) return;

  section.classList.add("rpm-anticipatory-identity");

  const detailLabels = [...section.querySelectorAll(".rpm-detail-label")];
  if (detailLabels[1]) detailLabels[1].textContent = "Methods & concepts";
  if (detailLabels[2]) detailLabels[2].textContent = "Selected work";

  const kicker = document.getElementById("rpm-detail-kicker");
  const title = document.getElementById("rpm-detail-title");
  const summary = document.getElementById("rpm-detail-summary");
  const plain = document.getElementById("rpm-detail-questions");
  const methods = document.getElementById("rpm-detail-methods");
  const projects = document.getElementById("rpm-detail-projects");
  const popover = document.getElementById("rpm-popover");
  const popoverClose = section.querySelector(".rpm-popover-close");
  const detailLink = document.getElementById("rpm-detail-link");
  const mobile = section.querySelector(".rpm-mobile");

  const conceptRepoCache = new Map();
  const projectRepoByTitle = new Map(
    Object.values(DATA)
      .filter(item => item.kind === "project" && item.url)
      .map(item => [item.title, item.url])
  );

  function conceptRepo(label) {
    if (conceptRepoCache.has(label)) return conceptRepoCache.get(label);
    const x = String(label || "").toLowerCase();
    let url = REPOS.computing;
    if (/unsupervised/.test(x)) url = REPOS.unsupervised;
    else if (/(cluster|hdbscan|hierarchical|mixture|fuzzy|density)/.test(x)) url = REPOS.clustering;
    else if (/(dimension|dimensionality|pca|umap|mds|embedding)/.test(x)) url = REPOS.dimension;
    else if (/(network|centrality|community|bipartite|diffusion)/.test(x)) url = REPOS.networks;
    else if (/(longitudinal|panel|trajectory|alignment|multilevel|mixed|partial pooling|nested|reml|icc)/.test(x)) url = REPOS.longitudinal;
    else if (/(missing|imputation|missingness|mice|fiml)/.test(x)) url = REPOS.missing;
    else if (/(spatial|distance|geographic|population-weighted|moran|kriging)/.test(x)) url = REPOS.spatial;
    else if (/(text|nlp|natural language|language processing|extraction|attribution|classification|embedding|transformer|topic|content analysis)/.test(x)) url = REPOS.unTranscript;
    else if (/(human ecology|climate|environment)/.test(x)) url = REPOS.ecology;
    else if (/humanitarian/.test(x)) url = REPOS.humanitarian;
    else if (/human security/.test(x)) url = REPOS.humansecurity;
    else if (/(counterterror|terrorism)/.test(x)) url = REPOS.terrorism;
    conceptRepoCache.set(label, url);
    return url;
  }

  function nodeRepo(id) {
    if (DATA[id]?.kind === "project") return DATA[id].url || null;
    return ({
      unsupervised: REPOS.unsupervised,
      clustering: REPOS.clustering,
      dimension: REPOS.dimension,
      networks: REPOS.networks,
      longitudinal: REPOS.longitudinal,
      missing: REPOS.missing,
      bayesian: REPOS.computing,
      multilevel: REPOS.longitudinal,
      validation: REPOS.computing,
      nlp: REPOS.unTranscript,
      naturallanguage: REPOS.unTranscript,
      spatial: REPOS.spatial,
      forecasting: REPOS.computing,
      political: REPOS.political,
      massviolence: REPOS.political,
      counterextremism: REPOS.terrorism,
      humanecology: REPOS.ecology,
      humanitarian: REPOS.humanitarian,
      humansecurity: REPOS.humansecurity,
      climate: REPOS.ecology,
      ainonproliferation: REPOS.technology,
      autonomous: REPOS.technology
    })[id] || null;
  }

  const haloMarkup = h => `<g class="rpm-cluster-halo" data-cluster="${h.id}"><ellipse cx="${h.cx}" cy="${h.cy}" rx="${h.rx}" ry="${h.ry}" /></g>`;
  const edgeMarkup = e => `<line class="rpm-edge rpm-edge-${e.type}" data-a="${e.a}" data-b="${e.b}" x1="${LAYOUT[e.a].x}" y1="${LAYOUT[e.a].y}" x2="${LAYOUT[e.b].x}" y2="${LAYOUT[e.b].y}" />`;

  function shapeMarkup(node, kind) {
    if (kind === "pillar") return `<polygon class="rpm-shape" points="0,${-node.r} ${node.r * .86},0 0,${node.r} ${-node.r * .86},0" />`;
    if (kind === "domain" || kind === "project") return `<rect class="rpm-shape" x="${-node.r}" y="${-node.r}" width="${node.r * 2}" height="${node.r * 2}" />`;
    return `<circle class="rpm-shape" r="${node.r}" />`;
  }

  const LABEL_METRICS = {
    pillar: { offset: 14, lineHeight: 12.5 },
    method: { offset: 14, lineHeight: 12.5 },
    domain: { offset: 14, lineHeight: 12.5 }
  };

  function labelMarkup(node, id) {
    const d = DATA[id];
    if (d.kind === "project" || d.kind === "specific_method") return "";
    if (id === "center") {
      return `<text class="rpm-network-center-label" text-anchor="middle" aria-hidden="true"><tspan x="0" y="-6">Computational</tspan><tspan x="0" y="13">Statistics</tspan></text>`;
    }
    const metrics = LABEL_METRICS[d.kind] || LABEL_METRICS.method;
    const start = node.r + metrics.offset;
    const lines = node.lines.map((line, i) => `<tspan x="0" y="${start + i * metrics.lineHeight}">${line}</tspan>`).join("");
    return `<text class="rpm-network-node-label" text-anchor="middle" aria-hidden="true">${lines}</text>`;
  }

  function nodeMarkup(id, node) {
    const d = DATA[id];
    const needsTitle = d.kind === "project" || d.kind === "specific_method";
    return `<g class="rpm-node rpm-network-node rpm-kind-${d.kind}${node.primary ? " rpm-primary" : ""}${id === "center" ? " is-active" : ""}" role="button" tabindex="0" aria-hidden="false" data-id="${id}" transform="translate(${node.x} ${node.y})">${needsTitle ? `<title>${d.title}</title>` : ""}${shapeMarkup(node, d.kind)}${labelMarkup(node, id)}</g>`;
  }

  map.setAttribute("viewBox", "0 0 980 650");
  map.innerHTML = `<title id="rpm-title">Research program network</title><desc id="rpm-desc">A five-level research network linking computational statistics to research pillars, method frameworks, specific methods, application domains, and projects.</desc><g>${HALOS.map(haloMarkup).join("")}</g><g>${EDGES.map(edgeMarkup).join("")}</g><g>${Object.entries(LAYOUT).map(([id, node]) => nodeMarkup(id, node)).join("")}</g>`;

  const nodeById = new Map([...map.querySelectorAll(".rpm-node")].map(node => [node.dataset.id, node]));
  const edgeElements = [...map.querySelectorAll(".rpm-edge")];
  const haloByCluster = new Map([...map.querySelectorAll(".rpm-cluster-halo")].map(halo => [halo.dataset.cluster, halo]));

  const neighborsById = new Map();
  const incidentEdgesById = new Map();
  Object.keys(DATA).forEach(id => {
    neighborsById.set(id, new Set([id]));
    incidentEdgesById.set(id, new Set());
  });
  EDGES.forEach((edge, index) => {
    const el = edgeElements[index];
    neighborsById.get(edge.a)?.add(edge.b);
    neighborsById.get(edge.b)?.add(edge.a);
    incidentEdgesById.get(edge.a)?.add(el);
    incidentEdgesById.get(edge.b)?.add(el);
  });

  const clustersById = new Map(
    Object.entries(LAYOUT).map(([id, node]) => [id, new Set(node.groups || [])])
  );

  const detailCache = new Map();
  Object.entries(DATA).forEach(([id, d]) => {
    const linked = d.work
      .map(label => ({ label, href: projectRepoByTitle.get(label) }))
      .filter(item => item.href);

    const detailLabel =
      d.kind === "core" ? "Program logic" :
      d.kind === "pillar" ? "Research questions" :
      d.kind === "method" || d.kind === "specific_method" ? "Analytical role" :
      d.kind === "domain" ? "Research focus" :
      "Project context";

    detailCache.set(id, {
      label: detailLabel,
      kicker:
        d.kind === "core" ? "Research core" :
        d.kind === "pillar" ? "Research pillar" :
        d.kind === "method" ? "Method framework" :
        d.kind === "specific_method" ? "Specific method" :
        d.kind === "domain" ? "Application domain" :
        "Project / study",
      title: d.title,
      summary: d.summary,
      bullets: d.bullets.map(x => `<li>${x}</li>`).join(""),
      methods: d.methods.map(x => `<a class="rpm-chip" href="${conceptRepo(x)}" target="_blank" rel="noopener noreferrer">${x}</a>`).join(""),
      work: linked.map(x => `<li><a class="rpm-work-link" href="${x.href}" target="_blank" rel="noopener noreferrer">${x.label}</a></li>`).join("")
    });
  });

  let lastDetailId = null;
  function renderDetail(id) {
    if (lastDetailId === id) return;
    lastDetailId = id;
    const d = detailCache.get(id) || detailCache.get("center");
    if (detailLabels[0]) detailLabels[0].textContent = d.label;
    kicker.textContent = d.kicker;
    title.textContent = d.title;
    summary.textContent = d.summary;
    plain.innerHTML = d.bullets;
    methods.innerHTML = d.methods;
    const block = projects.closest(".rpm-detail-block");
    if (d.work) {
      block.hidden = false;
      projects.innerHTML = d.work;
    } else {
      block.hidden = true;
      projects.innerHTML = "";
    }

    const directUrl = DATA[id]?.url || null;
    if (detailLink && directUrl) {
      detailLink.hidden = false;
      detailLink.href = directUrl;
      detailLink.textContent = DATA[id]?.kind === "project" ? "Open project ↗" : "Open repository ↗";
    } else if (detailLink) {
      detailLink.hidden = true;
      detailLink.removeAttribute("href");
    }
  }

  let locked = null;
  let hovered = null;
  let focused = null;
  let activeId = null;
  let relatedNodeIds = new Set();
  let activeEdges = new Set();
  let relatedClusters = new Set();
  let frame = 0;
  let queued = null;

  function clearInteractiveState() {
    if (activeId) nodeById.get(activeId)?.classList.remove("is-active");
    relatedNodeIds.forEach(id => nodeById.get(id)?.classList.remove("is-related"));
    activeEdges.forEach(edge => edge.classList.remove("is-active"));
    relatedClusters.forEach(cluster => haloByCluster.get(cluster)?.classList.remove("is-related"));
    activeId = null;
    relatedNodeIds = new Set();
    activeEdges = new Set();
    relatedClusters = new Set();
    map.classList.remove("is-filtered");
  }

  function hidePopover() {
    if (popover) popover.hidden = true;
    delete section.dataset.rpmSide;
  }

  function neutral() {
    clearInteractiveState();
    hidePopover();
  }

  function applyHighlight(id, transient = false) {
    clearInteractiveState();
    map.classList.add("is-filtered");
    activeId = id;
    nodeById.get(id)?.classList.add("is-active");

    const neighbors = neighborsById.get(id) || new Set([id]);
    relatedNodeIds = new Set([...neighbors].filter(nodeId => nodeId !== id));
    relatedNodeIds.forEach(nodeId => nodeById.get(nodeId)?.classList.add("is-related"));

    activeEdges = new Set(incidentEdgesById.get(id) || []);
    activeEdges.forEach(edge => edge.classList.add("is-active"));

    relatedClusters = new Set();
    neighbors.forEach(nodeId => {
      clustersById.get(nodeId)?.forEach(cluster => relatedClusters.add(cluster));
    });
    relatedClusters.forEach(cluster => haloByCluster.get(cluster)?.classList.add("is-related"));

    renderDetail(id);
    if (popover) popover.hidden = false;

    const x = LAYOUT[id]?.x ?? 490;
    section.dataset.rpmSide = x < 490 ? "right" : "left";
    if (!transient) locked = id;
  }

  function activeTarget() {
    return hovered || focused || locked;
  }

  function renderState() {
    const id = activeTarget();
    if (id) applyHighlight(id, Boolean(hovered || focused));
    else neutral();

    nodeById.forEach((node, nodeId) => {
      node.setAttribute("aria-pressed", String(nodeId === locked));
      node.setAttribute("aria-expanded", String(Boolean(id && nodeId === id)));
    });
  }

  function scheduleRender() {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      renderState();
    });
  }

  function toggleLock(id) {
    locked = locked === id ? null : id;
    hovered = null;
    focused = null;
    renderState();
  }

  nodeById.forEach((node, id) => {
    node.setAttribute("aria-controls", "rpm-popover");
    node.setAttribute("aria-pressed", "false");
    node.setAttribute("aria-expanded", "false");

    node.addEventListener("pointerenter", event => {
      if (event.pointerType === "touch") return;
      hovered = id;
      scheduleRender();
    }, { passive: true });

    node.addEventListener("pointerleave", () => {
      if (hovered === id) hovered = null;
      scheduleRender();
    }, { passive: true });

    node.addEventListener("focus", () => {
      focused = id;
      scheduleRender();
    });

    node.addEventListener("blur", event => {
      if (popover?.contains(event.relatedTarget)) return;
      if (focused === id) focused = null;
      scheduleRender();
    });

    node.addEventListener("click", () => toggleLock(id));

    node.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleLock(id);
      } else if (event.key === "Escape") {
        event.preventDefault();
        locked = null;
        hovered = null;
        focused = null;
        renderState();
      }
    });
  });

  popoverClose?.addEventListener("click", () => {
    locked = null;
    hovered = null;
    focused = null;
    renderState();
  });

  section.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    locked = null;
    hovered = null;
    focused = null;
    renderState();
  });

  function renderMobile() {
    if (!mobile) return;
    mobile.innerHTML = MOBILE_GROUPS.map((g, i) => `<div class="rpm-mobile-item${i === 0 ? " is-open" : ""}"><button class="rpm-mobile-trigger" type="button" aria-expanded="${i === 0 ? "true" : "false"}"><span class="rpm-mobile-name">${g.title}</span><span class="rpm-mobile-symbol">${i === 0 ? "−" : "+"}</span></button><div class="rpm-mobile-content"><p>${g.summary}</p>${g.ids.map(id => { const href = DATA[id].url || nodeRepo(id); return href ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${DATA[id].title}</a>` : `<span>${DATA[id].title}</span>`; }).join("")}</div></div>`).join("");
  }

  mobile?.addEventListener("click", event => {
    const button = event.target.closest(".rpm-mobile-trigger");
    if (!button) return;
    const item = button.closest(".rpm-mobile-item");
    const symbol = button.querySelector(".rpm-mobile-symbol");
    const open = !item.classList.contains("is-open");
    item.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
    symbol.textContent = open ? "−" : "+";
  });

  renderMobile();
  neutral();
})();