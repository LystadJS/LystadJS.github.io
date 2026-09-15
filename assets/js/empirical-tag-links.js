(() => {
  "use strict";

  const panel = document.getElementById("empirical-panel");
  const explorer = document.querySelector(".empirical-explorer");
  if (!panel || !explorer) return;

  const HUBS = {
    methods: {
      unsupervised: "https://github.com/LystadJS/Unsupervised-Machine-Learning",
      clustering: "https://github.com/LystadJS/method-clustering",
      dimensionReduction: "https://github.com/LystadJS/method-dimension-reduction",
      networkAnalysis: "https://github.com/LystadJS/method-network-analysis",
      missingData: "https://github.com/LystadJS/method-missing-data",
      longitudinal: "https://github.com/LystadJS/method-longitudinal-multilevel",
      spatial: "https://github.com/LystadJS/method-spatial-statistics",
      statisticalComputing: "https://github.com/LystadJS/method-statistical-computing"
    },
    domains: {
      politicalViolence: "https://github.com/LystadJS/domain-political-violence",
      terrorism: "https://github.com/LystadJS/domain-terrorism-counterterrorism",
      humanitarian: "https://github.com/LystadJS/domain-humanitarian-response",
      humanSecurity: "https://github.com/LystadJS/domain-human-security",
      emergingTechnology: "https://github.com/LystadJS/domain-emerging-technology",
      anthropocene: "https://github.com/LystadJS/domain-anthropocene-human-ecology"
    },
    projects: {
      counterterrorism: "https://github.com/LystadJS/counterterrorism_ethnosectarian_islamic_state",
      unitedNations: "https://github.com/LystadJS/UN-Transcript-Intelligence-Dynamic-Voting-Alignment"
    },
    index: "https://github.com/LystadJS?tab=repositories"
  };

  const normalize = value => String(value || "").trim().toLowerCase();

  const EXACT = new Map([
    ["political violence", HUBS.domains.politicalViolence],
    ["terrorism", HUBS.domains.terrorism],
    ["humanitarian", HUBS.domains.humanitarian],
    ["humanitarian response", HUBS.domains.humanitarian],
    ["humanitarian protection", HUBS.domains.humanitarian],
    ["human security", HUBS.domains.humanSecurity],
    ["climate risk", HUBS.domains.anthropocene],
    ["ai governance", HUBS.domains.emergingTechnology],
    ["autonomy", HUBS.domains.emergingTechnology],
    ["non-proliferation", HUBS.domains.emergingTechnology],
    ["statistics", HUBS.methods.statisticalComputing],
    ["statistical analysis", HUBS.methods.statisticalComputing],
    ["statistical modeling", HUBS.methods.statisticalComputing],
    ["data visualization", HUBS.methods.statisticalComputing],
    ["decision support", HUBS.methods.statisticalComputing],
    ["missing data", HUBS.methods.missingData],
    ["missing-data analysis", HUBS.methods.missingData],
    ["longitudinal analysis", HUBS.methods.longitudinal],
    ["spatial analysis", HUBS.methods.spatial],
    ["population-weighted geography", HUBS.methods.spatial],
    ["r", HUBS.methods.statisticalComputing],
    ["united nations", HUBS.projects.unitedNations],
    ["multilateral policy", HUBS.projects.unitedNations],
    ["osint", HUBS.projects.counterterrorism]
  ]);

  function destinationFor(label) {
    const value = normalize(label);

    if (explorer.classList.contains("is-army-mode") || explorer.classList.contains("is-journalism-mode")) {
      return HUBS.index;
    }

    if (EXACT.has(value)) return EXACT.get(value);

    if (/(cluster|k-means|hierarchical|dbscan|hdbscan|fuzzy|mixture model|expectation-maximization)/i.test(value)) {
      return HUBS.methods.clustering;
    }
    if (/(dimension reduction|dimensionality|\bpca\b|\bpcoa\b|umap|t-sne|multidimensional scaling|embedding|procrustes)/i.test(value)) {
      return HUBS.methods.dimensionReduction;
    }
    if (/(network analysis|community detection|centrality|network construction|dynamic network|diffusion analysis)/i.test(value)) {
      return HUBS.methods.networkAnalysis;
    }
    if (/(missing|imputation|mice|attribution bias)/i.test(value)) {
      return HUBS.methods.missingData;
    }
    if (/(longitudinal|multilevel|nested data|mixed-effects|trajectory)/i.test(value)) {
      return HUBS.methods.longitudinal;
    }
    if (/(spatial|geograph|population-weighted|place-based|cross-country climate exposure)/i.test(value)) {
      return HUBS.methods.spatial;
    }
    if (/(statistic|modeling|visualization|simulation|bootstrap|uncertainty|comparative analysis|comparative event analysis|data integration|multi-source integration|decision support)/i.test(value)) {
      return HUBS.methods.statisticalComputing;
    }
    if (/(unsupervised|machine learning|latent structure|similarity)/i.test(value)) {
      return HUBS.methods.unsupervised;
    }

    if (/(terror|islamic state|insurgent|ethnosectarian|suicide attack|attack lethality|civilian targeting|wilayat|tactical cohesion|strategic variation|counterterror)/i.test(value)) {
      return HUBS.domains.terrorism;
    }
    if (/(political violence|conflict behavior|organized violence)/i.test(value)) {
      return HUBS.domains.politicalViolence;
    }
    if (/(humanitarian|aid worker|food security|food insecurity|civilian protection|access constraint|disaster response)/i.test(value)) {
      return HUBS.domains.humanitarian;
    }
    if (/(human security|civilian risk|protection environment)/i.test(value)) {
      return HUBS.domains.humanSecurity;
    }
    if (/(ai governance|emerging technology|autonomous system|technology proliferation|technology diffusion|dual-use|non-proliferation)/i.test(value)) {
      return HUBS.domains.emergingTechnology;
    }
    if (/(climate|resource scarcity|human ecology|environmental|anthropocene)/i.test(value)) {
      return HUBS.domains.anthropocene;
    }

    if (/(united nations|multilateral|international institution)/i.test(value)) {
      return HUBS.projects.unitedNations;
    }
    if (/(osint|open-source intelligence)/i.test(value)) {
      return HUBS.projects.counterterrorism;
    }

    return HUBS.index;
  }

  function convertTags() {
    panel.querySelectorAll(".empirical-tag").forEach(tag => {
      const label = tag.textContent.trim();
      const href = destinationFor(label);

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

  const observer = new MutationObserver(() => convertTags());
  observer.observe(panel, { childList: true, subtree: true });

  convertTags();
})();
