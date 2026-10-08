(() => {
  'use strict';

  // Figure 4: switch between the panels already present in the page.
  const figure = document.querySelector('#paper-target-map .rp-stat-figure');
  if (!figure) return;

  const controls = figure.querySelector('.st-controls');
  const panels = [...figure.querySelectorAll('[data-target-panel]')];
  const buttons = [...figure.querySelectorAll('[data-target-view]')];
  if (!controls || panels.length !== 3 || buttons.length !== 3) return;

  controls.hidden = false;
  controls.addEventListener('click', event => {
    const button = event.target.closest('button[data-target-view]');
    if (!button || !controls.contains(button)) return;

    const key = button.dataset.targetView;
    if (!panels.some(panel => panel.dataset.targetPanel === key)) return;

    panels.forEach(panel => {
      const selected = panel.dataset.targetPanel === key;
      panel.toggleAttribute('hidden', !selected);
      panel.setAttribute('aria-hidden', String(!selected));
    });

    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
})();
