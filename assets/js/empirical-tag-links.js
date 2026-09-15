(() => {
  "use strict";

  const panel = document.getElementById("empirical-panel");
  const explorer = document.querySelector(".empirical-explorer");
  if (!panel || !explorer) return;

  const client = window.JSLResearchRegistry || {
    ready: Promise.resolve(null),
    repositoryIndex: "https://github.com/LystadJS?tab=repositories",
    resolveFrom: () => null
  };

  const normalize = value => String(value || "").trim().toLowerCase();

  const EXACT = new Map([
    ["political violence", ["domains", "political-violence"]],
    ["terrorism", ["domains", "terrorism-counterterrorism"]],
    ["humanitarian", ["domains", "humanitarian-response"]],
    ["humanitarian response", ["domains", "humanitarian-response"]],
    ["humanitarian protection", ["domains", "humanitarian-response"]],
    ["human security", ["domains", "human-security"]],
    ["climate risk", ["domains", "anthropocene-human-ecology"]],
    ["ai governance", ["domains", "emerging-technology"]],
    ["autonomy", ["domains", "emerging-technology"]],
    ["non-proliferation", ["domains", "emerging-technology"]],
    ["statistics", ["methods", "statistical-computing"]],
    ["statistical analysis", ["methods", "statistical-computing"]],
    ["statistical modeling", ["methods", "statistical-computing"]],
    ["data visualization", ["methods", "statistical-computing"]],
    ["decision support", ["methods", "statistical-computing"]],
    ["missing data", ["methods", "missing-data"]],
    ["missing-data analysis", ["methods", "missing-data"]],
    ["longitudinal analysis", ["methods", "longitudinal-multilevel"]],
    ["spatial analysis", ["methods", "spatial-statistics"]],
    ["population-weighted geography", ["methods", "spatial-statistics"]],
    ["r", ["methods", "statistical-computing"]],
    ["united nations", ["projects", "un-transcript-voting-alignment"]],
    ["multilateral policy", ["projects", "ai-governance-non-proliferation"]],
    ["osint", ["projects", "islamic-state-ethnosectarian-attack-patterns"]]
  ]);

  const PATTERNS = [
    [/(cluster|k-means|hierarchical|dbscan|hdbscan|fuzzy|mixture model|expectation-maximization)/i, "methods", "clustering"],
    [/(dimension reduction|dimensionality|\bpca\b|\bpcoa\b|umap|t-sne|multidimensional scaling|embedding|procrustes)/i, "methods", "dimension-reduction"],
    [/(network analysis|community detection|centrality|network construction|dynamic network|diffusion analysis)/i, "methods", "network-analysis"],
    [/(missing|imputation|mice|attribution bias)/i, "methods", "missing-data"],
    [/(longitudinal|multilevel|nested data|mixed-effects|trajectory)/i, "methods", "longitudinal-multilevel"],
    [/(spatial|geograph|population-weighted|place-based|cross-country climate exposure)/i, "methods", "spatial-statistics"],
    [/(statistic|modeling|visualization|simulation|bootstrap|uncertainty|comparative analysis|comparative event analysis|data integration|multi-source integration|decision support)/i, "methods", "statistical-computing"],
    [/(unsupervised|machine learning|latent structure|similarity)/i, "methods", "unsupervised-learning"],
    [/(terror|islamic state|insurgent|ethnosectarian|suicide attack|attack lethality|civilian targeting|wilayat|tactical cohesion|strategic variation|counterterror)/i, "domains", "terrorism-counterterrorism"],
    [/(political violence|conflict behavior|organized violence)/i, "domains", "political-violence"],
    [/(humanitarian|aid worker|food security|food insecurity|civilian protection|access constraint|disaster response)/i, "domains", "humanitarian-response"],
    [/(human security|civilian risk|protection environment)/i, "domains", "human-security"],
    [/(ai governance|emerging technology|autonomous system|technology proliferation|technology diffusion|dual-use|non-proliferation)/i, "domains", "emerging-technology"],
    [/(climate|resource scarcity|human ecology|environmental|anthropocene)/i, "domains", "anthropocene-human-ecology"],
    [/(united nations|international institution)/i, "projects", "un-transcript-voting-alignment"],
    [/(multilateral)/i, "projects", "ai-governance-non-proliferation"],
    [/(osint|open-source intelligence)/i, "projects", "islamic-state-ethnosectarian-attack-patterns"]
  ];

  function targetFor(label) {
    const value = normalize(label);
    if (EXACT.has(value)) return EXACT.get(value);
    for (const [pattern, kind, id] of PATTERNS) {
      if (pattern.test(value)) return [kind, id];
    }
    return null;
  }

  function destinationFor(label, registry) {
    if (explorer.classList.contains("is-army-mode") || explorer.classList.contains("is-journalism-mode")) {
      return client.repositoryIndex;
    }
    const target = targetFor(label);
    if (!target) return client.repositoryIndex;
    return client.resolveFrom(registry, target[0], target[1]) || client.repositoryIndex;
  }

  function convertTags(registry) {
    panel.querySelectorAll(".empirical-tag").forEach(tag => {
      const label = tag.textContent.trim();
      const href = destinationFor(label, registry);

      if (tag.tagName === "A") {
        tag.href = href;
        tag.target = "_blank";
        tag.rel = "noopener noreferrer";
        tag.classList.add("empirical-tag-link");
        tag.setAttribute("aria-label", `Open related GitHub repository for ${label}`);
        tag.title = `Open related GitHub repository: ${label}`;
        return;
      }

      const link = document.createElement("a");
      link.className = `${tag.className} empirical-tag-link`;
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = label;
      link.setAttribute("aria-label", `Open related GitHub repository for ${label}`);
      link.title = `Open related GitHub repository: ${label}`;
      tag.replaceWith(link);
    });
  }

  client.ready.then(registry => {
    const observer = new MutationObserver(() => convertTags(registry));
    observer.observe(panel, { childList: true, subtree: true });
    convertTags(registry);
  });
})();
