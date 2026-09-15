
(() => {
  /* Consolidate the former Projects page into Research. */
  document.querySelectorAll('a[href*="projects.html"]').forEach(link => {
    const rawHref = link.getAttribute("href") || "";

    if (link.closest(".site-nav, .nav-links")) {
      link.remove();
      return;
    }

    let destination = "research.html#applied-research";
    if (rawHref.startsWith("../")) destination = "../research.html#applied-research";
    if (rawHref.startsWith("/")) destination = "/research.html#applied-research";

    link.setAttribute("href", destination);

    const directText = link.childElementCount === 0 ? link.textContent.trim() : "";
    if (directText === "Projects") link.textContent = "Applied Research";
    if (directText === "Applied Projects") link.textContent = "Applied Research";
    if (directText === "Applied Projects ↗") link.textContent = "Applied Research ↗";

    const heading = link.querySelector("h3");
    if (heading && heading.textContent.trim() === "Projects") {
      heading.textContent = "Applied Research";
    }

    const kicker = link.querySelector(".card-kicker");
    if (kicker && kicker.textContent.trim() === "Applied") {
      kicker.textContent = "Applied";
    }

    const arrow = link.querySelector(".arrow");
    if (arrow && /project archive/i.test(arrow.textContent)) {
      arrow.textContent = "View applied research →";
    }
  });

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(".site-nav a[data-page]").forEach(link => {
      if (link.dataset.page === page) link.classList.add("active");
    });
  }

  /* Homepage-only full-width hero and compact contact icon rail. */
  if (page === "index") {
    if (!document.querySelector('link[href="assets/css/hero-contact-rail.css"]')) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "assets/css/hero-contact-rail.css";
      document.head.appendChild(stylesheet);
    }

    const heroProfile = document.querySelector(".hero-profile");

    if (heroProfile && !heroProfile.querySelector(".hero-contact-rail")) {
      const contactLinks = [
        {
          label: "Website",
          href: "https://lystadjs.github.io/",
          brand: "website",
          external: false,
          icon: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M3 12h18M12 3c2.2 2.45 3.35 5.45 3.35 9S14.2 18.55 12 21c-2.2-2.45-3.35-5.45-3.35-9S9.8 5.45 12 3Z"></path>
            </svg>`
        },
        {
          label: "GitHub",
          href: "https://github.com/LystadJS",
          brand: "github",
          external: true,
          icon: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 .8C5.82.8.8 5.82.8 12c0 4.94 3.2 9.13 7.64 10.61.56.1.76-.24.76-.54v-2.1c-3.11.68-3.77-1.32-3.77-1.32-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15A10.7 10.7 0 0 1 12 6.2c.95 0 1.9.13 2.8.38 2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.62 5.23-5.11 5.51.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.77.54A11.2 11.2 0 0 0 23.2 12C23.2 5.82 18.18.8 12 .8Z"></path>
            </svg>`
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/lystadjs/",
          brand: "linkedin",
          external: true,
          icon: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5.2 7.9H1.7V22h3.5V7.9ZM3.45 2A2.05 2.05 0 1 0 3.45 6.1 2.05 2.05 0 0 0 3.45 2ZM22 13.9c0-4.25-2.27-6.23-5.3-6.23-2.44 0-3.54 1.34-4.15 2.28V7.9H9.05V22h3.5v-6.98c0-1.84.35-3.62 2.63-3.62 2.24 0 2.27 2.1 2.27 3.74V22H22v-8.1Z"></path>
            </svg>`
        },
        {
          label: "NYU Email",
          href: "mailto:jl17842@nyu.edu",
          brand: "nyu-email",
          external: false,
          icon: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="1.5"></rect>
              <path d="m4 7 8 6 8-6"></path>
              <path d="M7.5 3.4h9"></path>
            </svg>`
        },
        {
          label: "Personal Email",
          href: "mailto:lystadjs@gmail.com",
          brand: "personal-email",
          external: false,
          icon: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="1.5"></rect>
              <path d="m4 7 8 6 8-6"></path>
              <circle cx="18.4" cy="17.2" r="2.1"></circle>
            </svg>`
        }
      ];

      const rail = document.createElement("nav");
      rail.className = "hero-contact-rail";
      rail.setAttribute("aria-label", "Profile and contact links");

      contactLinks.forEach(item => {
        const link = document.createElement("a");
        link.className = "hero-contact-link";
        link.href = item.href;
        link.dataset.brand = item.brand;
        link.dataset.label = item.label;
        link.setAttribute("aria-label", item.label);
        link.title = item.label;
        link.innerHTML = item.icon;

        if (item.external) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }

        rail.appendChild(link);
      });

      heroProfile.appendChild(rail);
    }
  }

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();

  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    items.forEach(item => observer.observe(item));
  } else {
    items.forEach(item => item.classList.add("visible"));
  }
})();
