(() => {
  "use strict";

  /* Centralized destinations for Research-page skill/method/domain buttons.
     Change a URL here later and every matching tag updates automatically. */
  const LINKS = {
    "Counterterrorism": "research.html#academic-research",
    "Data Visualization": "code.html",
    "R": "code.html",
    "Missing Data": "code.html",
    "OSINT": "cv.html#skills",
    "Interdisciplinary Research": "cv.html#skills",
    "Humanitarian": "research.html#applied-research",
    "Access": "research.html#applied-research",
    "Operational analysis": "cv.html#skills",
    "United Nations": "research.html#empirical-settings",
    "AI governance": "research.html#applied-research",
    "Multilateral policy": "research.html#applied-research",
    "Autonomy": "research.html#applied-research",
    "Security": "research.html#applied-research",
    "Non-proliferation": "research.html#applied-research",
    "Statistics": "cv.html#skills",
    "Decision support": "cv.html#skills",
    "Policy": "research.html#applied-research"
  };

  window.JSL_RESEARCH_TAG_LINKS = LINKS;

  document.querySelectorAll("#academic-research .meta .tag, #applied-research .meta .tag").forEach(tag => {
    const label = tag.textContent.trim();
    const href = LINKS[label] || "cv.html#skills";

    if (tag.tagName === "A") {
      tag.href = href;
      tag.classList.add("research-tag-link");
      return;
    }

    const link = document.createElement("a");
    link.className = `${tag.className} research-tag-link`;
    link.href = href;
    link.textContent = label;
    link.setAttribute("aria-label", `${label}: view related skill, method, or work`);
    tag.replaceWith(link);
  });
})();
