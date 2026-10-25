/* Profile content and contact links are available without JavaScript. */
(() => {
  const portrait = document.querySelector('.academic-profile .headshot-image');
  if (!portrait) return;
  const showFallback = () => { portrait.hidden = true; };
  portrait.addEventListener('error', showFallback, { once: true });
  if (portrait.complete && !portrait.naturalWidth) showFallback();
})();
