/* Full-width Section 02. Hover/focus previews; click/tap pins a floating popover. */
(() => {
  "use strict";
  const root = document.getElementById("anticipatory-direction");
  if (!root || root.classList.contains("is-enhanced")) return;

  const order = ["detect", "forecast", "intervene", "adapt"];
  const hotspots = Array.from(root.querySelectorAll(".ae-hotspot[data-ae-stage]"));
  const regions = Array.from(root.querySelectorAll(".ae-layer[data-ae-region]"));
  const panels = Array.from(root.querySelectorAll(".ae-panel[data-ae-panel]"));
  const popover = root.querySelector("#ae-popover");
  const close = root.querySelector(".ae-popover-close");

  if (!popover || !close || hotspots.length !== 4 || regions.length !== 4 || panels.length !== 4 ||
      order.some(key => hotspots.filter(n => n.dataset.aeStage === key).length !== 1 ||
        regions.filter(n => n.dataset.aeRegion === key).length !== 1 ||
        panels.filter(n => n.dataset.aePanel === key).length !== 1)) return;

  let pinned = null;
  let hovered = null;
  let focused = null;

  const render = () => {
    const active = hovered || focused || pinned;

    if (active) root.dataset.activeStage = active;
    else delete root.dataset.activeStage;

    if (pinned) root.dataset.pinnedStage = pinned;
    else delete root.dataset.pinnedStage;

    popover.hidden = !active;
    panels.forEach(panel => {
      panel.hidden = !active || panel.dataset.aePanel !== active;
    });

    hotspots.forEach(node => {
      const isPinned = node.dataset.aeStage === pinned;
      node.setAttribute("aria-pressed", String(isPinned));
      node.setAttribute("aria-expanded", String(Boolean(active && node.dataset.aeStage === active)));
    });
  };

  const clearAll = () => {
    pinned = null;
    hovered = null;
    focused = null;
    render();
  };

  const togglePin = stage => {
    pinned = pinned === stage ? null : stage;
    hovered = null;
    focused = null;
    render();
  };

  const bindPreview = (node, stage) => {
    node.addEventListener("pointerenter", event => {
      if (event.pointerType === "touch") return;
      hovered = stage;
      render();
    });
    node.addEventListener("pointerleave", () => {
      if (hovered === stage) hovered = null;
      render();
    });
    node.addEventListener("click", () => togglePin(stage));
  };

  hotspots.forEach((node, index) => {
    const stage = node.dataset.aeStage;
    node.setAttribute("role", "button");
    node.setAttribute("tabindex", "0");
    node.setAttribute("aria-controls", "ae-popover");
    node.setAttribute("aria-expanded", "false");

    bindPreview(node, stage);

    node.addEventListener("focus", () => {
      focused = stage;
      render();
    });
    node.addEventListener("blur", event => {
      if (popover.contains(event.relatedTarget)) return;
      if (focused === stage) focused = null;
      render();
    });
    node.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        togglePin(stage);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        clearAll();
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

  regions.forEach(node => bindPreview(node, node.dataset.aeRegion));

  close.addEventListener("click", clearAll);
  close.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.preventDefault();
      clearAll();
    }
  });

  root.addEventListener("keydown", event => {
    if (event.key === "Escape") clearAll();
  });

  render();
  root.classList.add("is-enhanced");
})();