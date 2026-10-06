/* CV controls and resolved, lazy-loading institutional logos. */
(() => {
  const printButton = document.querySelector("[data-print-cv]");
  if (printButton) printButton.addEventListener("click", () => window.print());

  const updated = document.querySelector("[data-cv-updated]");
  if (updated) {
    const parsed = new Date(document.lastModified);
    if (!Number.isNaN(parsed.getTime())) {
      updated.textContent = parsed.toLocaleDateString(undefined, {year: "numeric", month: "long"});
    }
  }

  const links = [...document.querySelectorAll(".cv-toc a")];
  const sections = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      const id = `#${visible[0].target.id}`;
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === id));
    }, {rootMargin: "-20% 0px -65% 0px", threshold: 0});
    sections.forEach(s => observer.observe(s));
  }
})();
(() => {
  "use strict";
  document.querySelectorAll(".cv-org-logo img, .cv-role-logo img").forEach(image => {
    const slot = image.parentElement;
    const update = () => {
      const loaded = image.complete && image.naturalWidth > 0;
      slot.classList.toggle("logo-loaded", loaded);
      slot.classList.toggle("logo-missing", !loaded);
    };
    image.addEventListener("load", update, { once: true });
    image.addEventListener("error", update, { once: true });
    if (image.complete) update();
  });
})();
