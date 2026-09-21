/* One persistent SVG. Hover/focus previews; click/Enter/Space pins. No data or network calls. */
(() => {
  "use strict";
  const root = document.getElementById("anticipatory-direction");
  if (!root || root.classList.contains("is-enhanced")) return;
  const order = ["detect", "forecast", "intervene", "adapt"];
  const hotspots = Array.from(root.querySelectorAll(".ae-hotspot[data-ae-stage]"));
  const regions = Array.from(root.querySelectorAll(".ae-layer[data-ae-region]"));
  const panels = Array.from(root.querySelectorAll(".ae-panel[data-ae-panel]"));
  const status = root.querySelector("#ae-info-status");
  const diagram = root.querySelector(".ae-diagram");
  // Keep all static explanations readable if the document is incomplete.
  if (!status || !diagram || hotspots.length !== 4 || regions.length !== 4 || panels.length !== 4 ||
      order.some(key => hotspots.filter(n => n.dataset.aeStage === key).length !== 1 ||
        regions.filter(n => n.dataset.aeRegion === key).length !== 1 ||
        panels.filter(n => n.dataset.aePanel === key).length !== 1)) return;

  const labels = { detect: "Detect", forecast: "Forecast", intervene: "Intervene", adapt: "Adapt" };
  let pinned = order.includes(root.dataset.pinnedStage) ? root.dataset.pinnedStage : "detect";
  let hovered = null;
  let focused = null;
  const render = () => {
    const active = hovered || focused || pinned;
    root.dataset.activeStage = active;
    root.dataset.pinnedStage = pinned;
    panels.forEach(panel => { panel.hidden = panel.dataset.aePanel !== active; });
    hotspots.forEach(node => {
      // aria-pressed describes the pinned choice, not a temporary hover preview.
      node.setAttribute("aria-pressed", String(node.dataset.aeStage === pinned));
    });
    const text = active === pinned ? `Pinned · ${labels[pinned]}` : `Preview · ${labels[active]} · click to pin`;
    if (status.textContent !== text) status.textContent = text;
  };
  const pin = stage => {
    pinned = stage;
    hovered = null;
    focused = null;
    render();
  };
  const previewTarget = (node, stage) => {
    node.addEventListener("pointerenter", event => {
      if (event.pointerType === "touch") return;
      hovered = stage;
      render();
    });
    node.addEventListener("pointerleave", () => {
      if (hovered === stage) hovered = null;
      render();
    });
    node.addEventListener("click", () => pin(stage));
  };
  hotspots.forEach((node, index) => {
    const stage = node.dataset.aeStage;
    node.setAttribute("role", "button");
    node.setAttribute("tabindex", "0");
    node.setAttribute("aria-controls", "ae-info");
    previewTarget(node, stage);
    node.addEventListener("focus", () => { focused = stage; render(); });
    node.addEventListener("blur", () => { if (focused === stage) focused = null; render(); });
    node.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        pin(stage);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        hovered = null;
        focused = null;
        render();
        return;
      }
      let next;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % hotspots.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + hotspots.length) % hotspots.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = hotspots.length - 1;
      else return;
      event.preventDefault();
      hovered = null;
      hotspots[next].focus({ preventScroll: true });
    });
  });
  regions.forEach(node => previewTarget(node, node.dataset.aeRegion));
  diagram.addEventListener("pointerleave", () => { hovered = null; render(); });
  render();
  root.classList.add("is-enhanced");
})();
