
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
