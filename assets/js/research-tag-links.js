(() => {
  "use strict";

  const client = window.JSLResearchRegistry || {
    ready: Promise.resolve(null),
    repositoryIndex: "https://github.com/LystadJS?tab=repositories",
    resolveFrom: () => null
  };

  const TARGETS = {
    "Counterterrorism": ["domains", "terrorism-counterterrorism"],
    "Data Visualization": ["methods", "statistical-computing"],
    "R": ["methods", "statistical-computing"],
    "Missing Data": ["methods", "missing-data"],
    "OSINT": ["projects", "islamic-state-ethnosectarian-attack-patterns"],
    "Humanitarian": ["domains", "humanitarian-response"],
    "Access": ["domains", "humanitarian-response"],
    "United Nations": ["projects", "un-transcript-voting-alignment"],
    "AI governance": ["domains", "emerging-technology"],
    "Multilateral policy": ["projects", "ai-governance-non-proliferation"],
    "Autonomy": ["domains", "emerging-technology"],
    "Security": ["domains", "human-security"],
    "Non-proliferation": ["domains", "emerging-technology"],
    "Statistics": ["methods", "statistical-computing"],
    "Decision support": ["methods", "statistical-computing"]
  };

  const LOCAL = {
    "Interdisciplinary Research": "research.html#academic-research",
    "Operational analysis": "cv.html#skills",
    "Policy": "research.html#applied-research"
  };

  function destination(label, registry) {
    if (LOCAL[label]) return LOCAL[label];
    const target = TARGETS[label];
    if (!target) return "cv.html#skills";
    return client.resolveFrom(registry, target[0], target[1]) || client.repositoryIndex;
  }

  function convert(registry) {
    document.querySelectorAll("#academic-research .meta .tag, #applied-research .meta .tag").forEach(tag => {
      const label = tag.textContent.trim();
      const href = destination(label, registry);
      const external = /^https?:\/\//i.test(href);

      if (tag.tagName === "A") {
        tag.href = href;
        tag.classList.add("research-tag-link");
        if (external) {
          tag.target = "_blank";
          tag.rel = "noopener noreferrer";
        } else {
          tag.removeAttribute("target");
          tag.removeAttribute("rel");
        }
        return;
      }

      const link = document.createElement("a");
      link.className = `${tag.className} research-tag-link`;
      link.href = href;
      link.textContent = label;
      link.setAttribute("aria-label", `${label}: view related skill, method, or work`);
      if (external) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      tag.replaceWith(link);
    });

    const aiCard = document.getElementById("project-ai-nonproliferation");
    const aiWorkLinks = aiCard?.querySelector(".work-links");
    const aiUrl = client.resolveFrom(registry, "projects", "ai-governance-non-proliferation");
    if (aiWorkLinks && aiUrl) {
      const link = document.createElement("a");
      link.href = aiUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Public reproducibility repository ↗";
      link.setAttribute("aria-label", "Open the public AI governance reproducibility repository");
      aiWorkLinks.replaceChildren(link);
    }
  }

  client.ready.then(convert);
})();
