/* Local view selection only. All graphics and tables exist without JavaScript. */
(() => {
  'use strict';

  function initializeFigure({ selector, controlsSelector, attribute }) {
    const figure = document.querySelector(selector);
    if (!figure) return;

    const controls = figure.querySelector(controlsSelector);
    const panelAttribute = `data-${attribute}-panel`;
    const viewAttribute = `data-${attribute}-view`;
    const panels = [...figure.querySelectorAll(`[${panelAttribute}]`)];
    const buttons = [...figure.querySelectorAll(`[${viewAttribute}]`)];
    if (!controls || panels.length !== 3 || buttons.length !== 3) return;

    controls.hidden = false;
    controls.addEventListener('click', event => {
      const button = event.target.closest(`button[${viewAttribute}]`);
      if (!button || !controls.contains(button)) return;
      const key = button.getAttribute(viewAttribute);
      if (!panels.some(panel => panel.getAttribute(panelAttribute) === key)) return;

      panels.forEach(panel => {
        const selected = panel.getAttribute(panelAttribute) === key;
        panel.toggleAttribute('hidden', !selected);
        panel.setAttribute('aria-hidden', String(!selected));
      });
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    });
  }

  [
    { selector: '#paper-target-map .rp-stat-figure', controlsSelector: '.st-controls', attribute: 'target' },
    { selector: '#paper-vanguards .rp-stat-figure', controlsSelector: '.vg-controls', attribute: 'vanguards' }
  ].forEach(initializeFigure);
})();
