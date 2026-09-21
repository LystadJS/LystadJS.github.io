/* Section 02 progressive enhancement. No libraries, network calls, or automatic playback. */
(() => {
  "use strict";
  const root = document.getElementById("anticipatory-direction");
  if (!root || root.classList.contains("is-enhanced")) return;
  const tablist = root.querySelector(".ae-tabs");
  const tabs = Array.from(root.querySelectorAll("button[data-ae-stage]"));
  const panels = Array.from(root.querySelectorAll(".ae-panel"));
  const label = root.querySelector("#ae-visual-label");
  const title = root.querySelector("#ae-chart-title");
  const description = root.querySelector("#ae-chart-desc");
  const caption = root.querySelector("#ae-visual-caption");
  const firstKey = root.querySelector('[data-ae-legend="first"]');
  const secondKey = root.querySelector('[data-ae-legend="second"]');
  const scenarios = root.querySelector(".ae-scenarios");
  const effectButtons = Array.from(root.querySelectorAll("button[data-ae-effect]"));

  const views = {
    detect: {
      label: "01 / Finding the signal",
      title: "Detection: observations and a candidate underlying change",
      description: "Irregular observations surround a smooth candidate signal. The final observations suggest a change to investigate, not an established warning of catastrophe. All geometry is illustrative.",
      caption: "Separate a possible underlying change from variation in how the system is observed.",
      keys: ["Observed indicators", "Candidate latent signal"]
    },
    forecast: {
      label: "02 / Looking ahead",
      title: "Forecasting: possible futures beyond the last observation",
      description: "A past indicator is followed by a dashed hypothetical outlook and an illustrative uncertainty band. Neither the curve nor the band is estimated from data; the vertical scale is not a probability.",
      caption: "Define the horizon, locate potential exposure, and evaluate how much usable warning a forecast provides. Shading illustrates uncertainty; it is not an estimated interval.",
      keys: ["Observed history", "Outlook + illustrative uncertainty"]
    },
    intervene: {
      label: "03 / Comparing possible actions",
      title: "Intervention: contrasting hypothetical effects",
      description: "A dashed reference trajectory is compared with an assumed intervention path. The shaded window marks a possible time to act. The effect selector illustrates benefit, no effect, or harm; these are assumptions, not causal estimates.",
      caption: "",
      keys: ["Reference path", "Assumed intervention path"]
    },
    adapt: {
      label: "04 / Learning as events unfold",
      title: "Adaptation: new observations and a revised outlook",
      description: "Gold points illustrate new evidence below an earlier dashed outlook. A revised trajectory and an illustrative band incorporate that evidence. The difference does not establish that an intervention worked.",
      caption: "New evidence can change the outlook—and the response. Updating a forecast is distinct from establishing why an outcome changed.",
      keys: ["Earlier outlook", "New evidence + revised outlook"]
    }
  };
  const effects = {
    benefit: "Assumed benefit: the action bends the path toward less harm. Evidence would still be needed to establish that effect.",
    none: "Assumed no effect: the path follows the reference trajectory. Acting is not the same as changing the outcome.",
    harm: "Assumed harm: the action worsens the trajectory. Unintended consequences belong in the comparison."
  };

  // Leave the complete static content readable if the markup is incomplete.
  if (!tablist || tabs.length !== 4 || panels.length !== 4 ||
      !label || !title || !description || !caption || !firstKey || !secondKey || !scenarios ||
      effectButtons.length !== 3 ||
      tabs.some(tab => !Object.hasOwn(views, tab.dataset.aeStage) ||
        !panels.some(panel => panel.id === tab.getAttribute("aria-controls"))) ||
      effectButtons.some(button => !Object.hasOwn(effects, button.dataset.aeEffect))) return;

  const setEffect = key => {
    if (!Object.hasOwn(effects, key)) return;
    root.dataset.effect = key;
    effectButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.aeEffect === key)));
    if (root.dataset.stage === "intervene") {
      caption.textContent = effects[key];
      description.textContent = `${views.intervene.description} ${effects[key]}`;
    }
  };

  const select = tab => {
    const key = tab.dataset.aeStage;
    const view = views[key];
    if (!view) return;
    root.dataset.stage = key;
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute("aria-controls"); });
    label.textContent = view.label;
    title.textContent = view.title;
    description.textContent = view.description;
    caption.textContent = view.caption;
    firstKey.textContent = view.keys[0];
    secondKey.textContent = view.keys[1];
    scenarios.hidden = key !== "intervene";
    if (key === "intervene") setEffect(root.dataset.effect || "benefit");
  };

  tablist.setAttribute("role", "tablist");
  tablist.setAttribute("aria-orientation", "horizontal");
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    const panel = panels.find(item => item.id === tab.getAttribute("aria-controls"));
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.tabIndex = 0;
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", event => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(tabs[next]);
      tabs[next].focus({ preventScroll: true });
    });
  });
  effectButtons.forEach(button => button.addEventListener("click", () => setEffect(button.dataset.aeEffect)));
  select(tabs[0]);
  root.classList.add("is-enhanced");
  caption.setAttribute("aria-live", "polite");
  caption.setAttribute("aria-atomic", "true");
})();
