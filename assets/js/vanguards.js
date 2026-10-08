/* Local view selection only. All graphics and the data table exist without JS. */
(() => {
  'use strict';

  // Vanguards: switch between the panels already present in the page.
  const figure = document.querySelector('#paper-vanguards .rp-stat-figure');
  if (!figure) return;

  const controls = figure.querySelector('.vg-controls');
  const buttons = [...figure.querySelectorAll('[data-vanguards-view]')];
  const panels = [...figure.querySelectorAll('[data-vanguards-panel]')];
  if (!controls || panels.length !== 3 || buttons.length !== 3) return;

  controls.hidden = false;
  controls.addEventListener('click', event => {
    const button = event.target.closest('button[data-vanguards-view]');
    if (!button || !controls.contains(button)) return;

    const key = button.dataset.vanguardsView;
    if (!panels.some(panel => panel.dataset.vanguardsPanel === key)) return;

    panels.forEach(panel => {
      const active = panel.dataset.vanguardsPanel === key;
      panel.toggleAttribute('hidden', !active);
      panel.setAttribute('aria-hidden', String(!active));
    });

    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
})();
