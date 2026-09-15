(() => {
  "use strict";

  const panel = document.getElementById("empirical-panel");
  const explorer = document.querySelector(".empirical-explorer");
  if (!panel || !explorer) return;

  const REPOS = {
    statistics: "https://github.com/LystadJS/Unsupervised-Machine-Learning",
    counterterrorism: "https://github.com/LystadJS/counterterrorism_ethnosectarian_islamic_state",
    unitedNations: "https://github.com/LystadJS/UN-Transcript-Intelligence-Dynamic-Voting-Alignment",
    index: "https://github.com/LystadJS?tab=repositories"
  };

  const normalize = value => String(value || "").trim().toLowerCase();

  function destinationFor(label) {
    const value = normalize(label);

    /* Military-service and reporting tags remain externally linked, but use
       the public repository index until dedicated public repositories exist. */
    if (explorer.classList.contains("is-army-mode") || explorer.classList.contains("is-journalism-mode")) {
      return REPOS.index;
    }

    /* Statistical / computational methods. */
    if (/(statistic|model|data visualization|missing-data|missing data|spatial analysis|population-weighted|longitudinal|comparative analysis|cluster|unsupervised|machine learning|\br\b|uncertainty)/i.test(value)) {
      return REPOS.statistics;
    }

    /* Political violence, terrorism, insurgency, and related empirical systems. */
    if (/(terror|islamic state|insurgent|political violence|ethnosectarian|suicide attack|attack lethality|civilian targeting|wilayat|tactical cohesion|strategic variation|counterterror|osint)/i.test(value)) {
      return REPOS.counterterrorism;
    }

    /* UN, humanitarian, multilateral, and applied-policy systems. */
    if (/(united nations|multilateral|humanitarian|food security|food insecurity|aid worker|civilian protection|policy|access|conflict environment|human security|governance|decision support|operational analysis)/i.test(value)) {
      return REPOS.unitedNations;
    }

    return REPOS.index;
  }

  function convertTags() {
    panel.querySelectorAll("span.empirical-tag").forEach(tag => {
      const label = tag.textContent.trim();
      const link = document.createElement("a");
      link.className = `${tag.className} empirical-tag-link`;
      link.href = destinationFor(label);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = label;
      link.setAttribute("aria-label", `Open GitHub repository for ${label}`);
      link.title = `Open related GitHub repository: ${label}`;
      tag.replaceWith(link);
    });
  }

  const observer = new MutationObserver(() => convertTags());
  observer.observe(panel, { childList: true, subtree: true });

  convertTags();
})();
