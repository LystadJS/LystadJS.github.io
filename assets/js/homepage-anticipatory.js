/* Progressive enhancement for the homepage analysis cycle; no network dependencies. */
(() => {
  "use strict";
  const root = document.querySelector('body[data-page="index"] .anticipatory-home');
  if (!root) return;
  const cycle = root.querySelector(".as-cycle");
  if (!cycle) return;
  const buttons = Array.from(cycle.querySelectorAll("button[data-as-stage]"));
  const panels = Array.from(cycle.querySelectorAll(".as-cycle-panel"));
  if (!buttons.length || buttons.length !== panels.length) return;
  const ids = new Set(panels.map(panel => panel.id));
  if (buttons.some(button => !ids.has(button.getAttribute("aria-controls")))) return;

  const select = button => {
    const selectedId = button.getAttribute("aria-controls");
    buttons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    panels.forEach(panel => { panel.hidden = panel.id !== selectedId; });
  };

  cycle.classList.add("is-enhanced");
  cycle.querySelector(".as-cycle-panels").setAttribute("aria-live", "polite");
  buttons.forEach((button, index) => {
    button.disabled = false;
    button.addEventListener("click", () => select(button));
    button.addEventListener("keydown", event => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = buttons.length - 1;
      else return;
      event.preventDefault();
      buttons[next].focus();
      select(buttons[next]);
    });
  });
  select(buttons[0]);
})();
