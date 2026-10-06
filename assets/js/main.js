/* Shared navigation and progressive enhancement. No page-specific payloads. */
(() => {
  "use strict";
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const mobile = window.matchMedia("(max-width: 780px)");

  if (menuButton && nav) {
    const setMenu = (open, restoreFocus = false) => {
      nav.classList.toggle("open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      if (restoreFocus) menuButton.focus();
    };
    if (!nav.id) nav.id = "site-navigation";
    menuButton.setAttribute("aria-controls", nav.id);
    menuButton.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.classList.contains("open")) setMenu(false, true);
    });
    mobile.addEventListener("change", event => {
      if (!event.matches) setMenu(false);
    });
  }

  const currentPage = document.body.dataset.page;
  document.querySelectorAll(".site-nav a[data-page]").forEach(link => {
    const active = link.dataset.page === currentPage;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-current-year]").forEach(node => { node.textContent = year; });

  // Content is visible without JavaScript. Only successfully observed elements
  // enter the reveal state; reduced-motion visitors skip that state entirely.
  const items = [...document.querySelectorAll(".reveal")];
  if (!items.length) return;
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(item => item.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("reveal-pending");
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  items.forEach(item => {
    item.classList.add("reveal-pending");
    observer.observe(item);
  });
})();
