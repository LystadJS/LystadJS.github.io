(() => {
  "use strict";

  /* Centralized destinations for Research-page skill/method/domain buttons. */
  const LINKS = {
    "Counterterrorism": "https://github.com/LystadJS/domain-terrorism-counterterrorism",
    "Data Visualization": "https://github.com/LystadJS/method-statistical-computing",
    "R": "https://github.com/LystadJS/method-statistical-computing",
    "Missing Data": "https://github.com/LystadJS/method-missing-data",
    "OSINT": "https://github.com/LystadJS/counterterrorism_ethnosectarian_islamic_state",
    "Interdisciplinary Research": "research.html#academic-research",
    "Humanitarian": "https://github.com/LystadJS/domain-humanitarian-response",
    "Access": "https://github.com/LystadJS/domain-humanitarian-response",
    "Operational analysis": "cv.html#skills",
    "United Nations": "https://github.com/LystadJS/UN-Transcript-Intelligence-Dynamic-Voting-Alignment",
    "AI governance": "https://github.com/LystadJS/domain-emerging-technology",
    "Multilateral policy": "https://github.com/LystadJS/UN-Transcript-Intelligence-Dynamic-Voting-Alignment",
    "Autonomy": "https://github.com/LystadJS/domain-emerging-technology",
    "Security": "https://github.com/LystadJS/domain-human-security",
    "Non-proliferation": "https://github.com/LystadJS/domain-emerging-technology",
    "Statistics": "https://github.com/LystadJS/method-statistical-computing",
    "Decision support": "https://github.com/LystadJS/method-statistical-computing",
    "Policy": "research.html#applied-research"
  };

  window.JSL_RESEARCH_TAG_LINKS = LINKS;

  document.querySelectorAll("#academic-research .meta .tag, #applied-research .meta .tag").forEach(tag => {
    const label = tag.textContent.trim();
    const href = LINKS[label] || "cv.html#skills";
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
})();
