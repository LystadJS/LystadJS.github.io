(() => {
  "use strict";
  const REVIEW_CSS = "assets/css/research-program-review.css";
  if (!document.querySelector(`link[href="${REVIEW_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = REVIEW_CSS;
    document.head.appendChild(link);
  }

  const files = ["assets/js/research-program-data.js", "assets/js/research-program-core.js"];
  const load = index => {
    if (index >= files.length) return;
    const script = document.createElement("script");
    script.src = files[index];
    script.defer = false;
    script.onload = () => load(index + 1);
    document.head.appendChild(script);
  };
  load(0);
})();
