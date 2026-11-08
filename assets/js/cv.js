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

/* Position role starts and today on the shared annual scale after resizing. */
(() => {
  const timeline = document.querySelector('.cv-service-scale');
  if (!timeline) return;
  const position_role_points = () => {
    const years = new Map([...timeline.querySelectorAll('.cv-service-year')].map(label => {
      const box = label.getBoundingClientRect();
      return [Number(label.textContent), box.top + box.height / 2];
    }));
    // Use the portfolio owner's time zone so the date is consistent for visitors.
    const today = timeline.querySelector('.cv-today-marker');
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date());
    const date_part = type => Number(parts.find(part => part.type === type).value);
    const year = date_part('year'), month = date_part('month'), day = date_part('day');
    const january = years.get(year);
    const step = years.get(2026) - years.get(2027);
    // The upper edge represents January of the year after the highest tick.
    const next_january = years.get(year + 1) ?? (january - step);
    if (today && january !== undefined) {
      const days_in_month = new Date(year, month, 0).getDate();
      const fraction = (month - 1 + (day - 1) / days_in_month) / 12;
      today.style.top = (january + (next_january - january) * fraction - timeline.getBoundingClientRect().top) + 'px';
      today.dateTime = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      // A short stacked date fits the unit side of the rail without widening it.
      const month_label = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day)));
      today.textContent = month_label + ' ' + day + '\n' + year;
      today.title = 'Current date: ' + today.dateTime;
      today.setAttribute('aria-label', today.title);
      today.hidden = false;
    }
    // Align requested unit/rank pairs by the artwork centers, regardless of label height.
    timeline.querySelectorAll('[data-align-promotion]').forEach(unit => {
      const promotion = timeline.querySelector('.cv-service-promotion time[datetime="' + unit.dataset.alignPromotion + '"]');
      if (!promotion) return;
      unit.style.transform = '';
      const badge = unit.querySelector('img').getBoundingClientRect();
      const rank = promotion.parentElement.querySelector('img').getBoundingClientRect();
      unit.style.transform = 'translateY(' + (rank.top + rank.height / 2 - badge.top - badge.height / 2) + 'px)';
    });
    timeline.querySelectorAll('.cv-role-point').forEach(point => {
      const [year, month] = point.dataset.startDate.split('-').map(Number);
      const january = years.get(year);
      const next_january = years.get(year + 1);
      if (january === undefined || next_january === undefined) return;
      // January is the lower tick; July is halfway toward the next year's tick.
      const position = january + (next_january - january) * (month - 1) / 12;
      const entry_top = point.parentElement.getBoundingClientRect().top;
      point.style.top = (position - entry_top) + 'px';
    });
    // Match a unit badge to its role circle after the date-based circle positions settle.
    timeline.querySelectorAll('[data-align-role]').forEach(unit => {
      const point = timeline.querySelector('.cv-role-point[data-start-date="' + unit.dataset.alignRole + '"]');
      if (!point) return;
      unit.style.transform = '';
      const badge = unit.querySelector('img').getBoundingClientRect();
      const circle = point.getBoundingClientRect();
      unit.style.transform = 'translateY(' + (circle.top + circle.height / 2 - badge.top - badge.height / 2) + 'px)';
    });
  };
  position_role_points();
  document.fonts.ready.then(position_role_points);
  new ResizeObserver(position_role_points).observe(timeline);
  // Refresh on return to the page as well as while it remains open overnight.
  document.addEventListener("visibilitychange", position_role_points);
  setInterval(position_role_points, 60000);
})();
