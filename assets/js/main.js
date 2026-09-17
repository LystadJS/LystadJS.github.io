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

  /* Homepage-only hero enhancements. */
  if (page === "index") {
    if (!document.querySelector('link[href="assets/css/hero-contact-rail.css"]')) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "assets/css/hero-contact-rail.css";
      document.head.appendChild(stylesheet);
    }

    const heroProfile = document.querySelector(".hero-profile");

    if (heroProfile) {
      /* Keep the existing portrait, identity, and lede as the primary hero. */
      let heroMain = heroProfile.querySelector(".hero-main");
      if (!heroMain) {
        heroMain = document.createElement("div");
        heroMain.className = "hero-main";

        const headshot = heroProfile.querySelector(".hero-headshot");
        const identity = heroProfile.querySelector(".hero-identity");
        const details = heroProfile.querySelector(".hero-details");

        heroProfile.insertBefore(heroMain, heroProfile.firstChild);
        [headshot, identity, details].forEach(element => {
          if (element) heroMain.appendChild(element);
        });
      }

      /* Three primary destinations, designed to echo the homepage research network. */
      if (!heroProfile.querySelector(".hero-practice-index")) {
        const practice = document.createElement("aside");
        practice.className = "hero-practice-index";
        practice.setAttribute("aria-label", "Primary portfolio destinations");
        practice.innerHTML = `
          <nav class="hero-practice-links" aria-label="Portfolio destinations">
            <a href="research.html">
              <svg class="hero-practice-icon" viewBox="0 0 68 50" aria-hidden="true">
                <!-- Research paper / evidence packet -->
                <rect class="mini-method" x="3" y="5" width="25" height="40" rx="1.5"></rect>
                <line class="mini-edge" x1="8" y1="13" x2="23" y2="13"></line>
                <line class="mini-edge" x1="8" y1="20" x2="23" y2="20"></line>
                <line class="mini-edge" x1="8" y1="27" x2="20" y2="27"></line>
                <line class="mini-edge" x1="8" y1="34" x2="17" y2="34"></line>
                <!-- Translation from research into applied work -->
                <line class="mini-edge" x1="28" y1="25" x2="39" y2="25"></line>
                <polygon class="mini-project" points="43,20 48,25 43,30 38,25"></polygon>
                <line class="mini-edge" x1="48" y1="25" x2="58" y2="15"></line>
                <line class="mini-edge" x1="48" y1="25" x2="58" y2="35"></line>
                <circle class="mini-app" cx="61" cy="12" r="4.5"></circle>
                <circle class="mini-app" cx="61" cy="38" r="4.5"></circle>
              </svg>
              <span class="hero-practice-card-copy">
                <strong>Research &amp; Applied Work</strong>
                <small>Methods · projects · human-security applications</small>
              </span>
              <span class="hero-practice-arrow" aria-hidden="true">→</span>
            </a>

            <a href="code.html">
              <svg class="hero-practice-icon" viewBox="0 0 68 50" aria-hidden="true">
                <!-- Terminal / source code -->
                <rect class="mini-method" x="2" y="8" width="22" height="34" rx="2"></rect>
                <line class="mini-edge" x1="6" y1="14" x2="20" y2="14"></line>
                <line class="mini-edge" x1="7" y1="23" x2="11" y2="27"></line>
                <line class="mini-edge" x1="11" y1="27" x2="7" y2="31"></line>
                <line class="mini-edge" x1="13" y1="32" x2="19" y2="32"></line>
                <!-- Package / reusable tool -->
                <line class="mini-edge" x1="24" y1="25" x2="31" y2="25"></line>
                <rect class="mini-gold" x="31" y="15" width="16" height="20" rx="1.5"></rect>
                <line class="mini-edge" x1="34" y1="20" x2="44" y2="20"></line>
                <line class="mini-edge" x1="34" y1="25" x2="41" y2="25"></line>
                <line class="mini-edge" x1="34" y1="30" x2="43" y2="30"></line>
                <!-- Validated output -->
                <line class="mini-edge" x1="47" y1="25" x2="52" y2="25"></line>
                <rect class="mini-app" x="52" y="10" width="14" height="30" rx="2"></rect>
                <line class="mini-edge" x1="55" y1="17" x2="63" y2="17"></line>
                <line class="mini-edge" x1="55" y1="23" x2="61" y2="23"></line>
                <polyline class="mini-edge" points="55,31 58,34 63,28" fill="none"></polyline>
              </svg>
              <span class="hero-practice-card-copy">
                <strong>Code &amp; Development</strong>
                <small>R · software · reproducible analytical tools</small>
              </span>
              <span class="hero-practice-arrow" aria-hidden="true">→</span>
            </a>

            <a href="cv.html">
              <svg class="hero-practice-icon" viewBox="0 0 68 50" aria-hidden="true">
                <!-- CV / career timeline -->
                <line class="mini-edge" x1="10" y1="6" x2="10" y2="44"></line>
                <circle class="mini-gold" cx="10" cy="9" r="3.5"></circle>
                <circle class="mini-method" cx="10" cy="25" r="3.5"></circle>
                <circle class="mini-app" cx="10" cy="41" r="3.5"></circle>
                <!-- Education entry -->
                <line class="mini-edge" x1="16" y1="8" x2="55" y2="8"></line>
                <line class="mini-edge" x1="16" y1="13" x2="42" y2="13"></line>
                <!-- Experience entry -->
                <line class="mini-edge" x1="16" y1="24" x2="63" y2="24"></line>
                <line class="mini-edge" x1="16" y1="29" x2="49" y2="29"></line>
                <!-- Research / skills entry -->
                <line class="mini-edge" x1="16" y1="40" x2="57" y2="40"></line>
                <line class="mini-edge" x1="16" y1="45" x2="36" y2="45"></line>
              </svg>
              <span class="hero-practice-card-copy">
                <strong>Curriculum Vitae</strong>
                <small>Education · research · experience · skills</small>
              </span>
              <span class="hero-practice-arrow" aria-hidden="true">→</span>
            </a>

          </nav>`;
        heroProfile.appendChild(practice);
      }

      if (!heroProfile.querySelector(".hero-contact-rail")) {
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
                <!-- NYU torch badge -->
                <rect x="14.1" y="13.1" width="8.7" height="8.7" rx="1.6" style="fill:#57068c;stroke:#0d0b10;stroke-width:.9"></rect>
                <path d="M18.45 14.55c-.75.62-1.25 1.2-1.18 1.88.08.73.67 1.19 1.36 1.17.72-.03 1.25-.52 1.28-1.18.03-.63-.38-1.15-1.02-1.63.08.54-.18.92-.45 1.16-.03-.55-.18-.95.01-1.4Z" style="fill:#fff;stroke:none"></path>
                <path d="M17.15 18.05h2.75M18.52 18.05v2.2M17.7 20.25h1.64" style="fill:none;stroke:#fff;stroke-width:.72;stroke-linecap:round"></path>
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

    /* Remove any former full-width 02 / Practice section if present. */
    document.querySelectorAll(".section").forEach(section => {
      const index = section.querySelector(".section-index");
      if (index && index.textContent.trim() === "02 / Practice") {
        section.remove();
      }
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