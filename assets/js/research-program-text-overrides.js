(() => {
  "use strict";

  const payload = window.JSLResearchProgramData;
  if (!payload) return;

  const { DATA, LAYOUT, MOBILE_GROUPS } = payload;

  // Text-only taxonomy update.  Geometry, node types, halos, edges, and
  // interaction behavior remain controlled by the original research-program
  // code and are intentionally untouched here.
  const COPY = {
    center: {
      title: "Statistical Methods for High-Consequence Systems",
      summary: "Statistical methods for latent structure, dynamic change, future risk, and uncertainty in consequential systems.",
      bullets: [
        "Discover hidden structure.",
        "Model dynamic change.",
        "Estimate risk and uncertainty."
      ],
      methods: [
        "Statistical learning & unsupervised learning",
        "Statistical forecasting & risk analysis",
        "Network & diffusion analysis",
        "Longitudinal & dynamic modeling"
      ],
      work: [
        "Artificial Intelligence Non-Proliferation at the United Nations",
        "The Caliphate’s Target Map",
        "Estimating Lethality Under Missing Casualty Data",
        "Himalayan Flood Response"
      ]
    },

    pillar_structure: {
      title: "Latent Structure",
      summary: "Identify hidden organization, clusters, regimes, and relationships before categories are imposed.",
      bullets: [
        "What structure exists before labels are assigned?",
        "Which observations, groups, or relationships define the system?",
        "When does structural change become substantively consequential?"
      ]
    },
    pillar_degraded: {
      title: "Uncertainty & Inference",
      summary: "Draw defensible inference when evidence is incomplete, sparse, biased, or evolving.",
      bullets: [
        "What can the available evidence support?",
        "Which conclusions survive alternative assumptions?",
        "How should uncertainty propagate into the result?"
      ]
    },
    pillar_anticipatory: {
      title: "Dynamic Change & Early Warning",
      summary: "Model trajectories, diffusion, and emerging risk without overstating predictive certainty.",
      bullets: [
        "Which signals precede consequential outcomes?",
        "How do systems and actors change over time?",
        "When is early warning statistically defensible?"
      ]
    },

    unsupervised: {
      title: "Statistical Learning & Unsupervised Learning",
      summary: "Discover latent structure and patterns without relying on predefined outcome labels.",
      bullets: ["Identify groups, regimes, anomalies, and lower-dimensional structure."]
    },
    networks: {
      title: "Network & Diffusion Analysis",
      summary: "Model relational structure, communities, influence, diffusion, and pathways through connected systems.",
      bullets: ["Treat relationships and topology as part of the data-generating process."]
    },
    longitudinal: {
      title: "Longitudinal & Dynamic Modeling",
      summary: "Model persistence, trajectories, repeated observations, and structural change over time.",
      bullets: ["Distinguish temporal change from cross-sectional differences."]
    },
    forecasting: {
      title: "Statistical Forecasting & Risk Analysis",
      summary: "Estimate future trajectories and evolving risk while keeping predictive uncertainty explicit.",
      bullets: ["Prioritize calibrated forecasting and early warning over false precision."]
    },

    counterextremism: {
      title: "Counterterrorism & Counterextremism",
      summary: "Terrorist and extremist networks, organizational behavior, adaptation, mobilization, violence, and intervention-relevant structure.",
      bullets: ["Apply relational, spatial, temporal, and textual methods to violent non-state systems."]
    },
    humanitarian: {
      title: "Humanitarian Crisis Response",
      summary: "Civilian harm, disasters, displacement, food insecurity, humanitarian access, and response under severe uncertainty.",
      bullets: ["Support crisis anticipation and response with explicit uncertainty and degraded-information constraints."]
    },
    ainonproliferation: {
      title: "Catastrophic & Emerging Risks",
      summary: "Emerging technologies, systemic threats, and low-frequency/high-impact risks with potentially severe consequences.",
      bullets: ["Study diffusion, governance, early warning, and systemic risk before outcomes fully materialize."]
    },
    autonomous: {
      title: "Emerging Technology and AI",
      summary: "Emerging technologies, advanced AI, autonomous systems, and their diffusion, governance, and associated risks.",
      bullets: ["Emerging technology and AI are treated as a subdomain of catastrophic and emerging risk."]
    },
    humansecurity: {
      title: "Systemic & Societal Risk",
      summary: "Cross-domain risks to populations, institutions, and social systems that connect otherwise distinct application areas.",
      bullets: ["Provide a cross-cutting application node without duplicating the Human Security umbrella used elsewhere on the site."]
    },
    climate: {
      title: "Climate & Environmental Risk",
      summary: "Environmental stress, vulnerability, and security within coupled human and ecological systems.",
      bullets: ["Model how environmental change alters exposure, vulnerability, and downstream risk."]
    },
    massviolence: {
      title: "Civilian Harm & Mass Violence",
      summary: "Large-scale organized harm, civilian exposure, and pathways toward catastrophic escalation.",
      bullets: ["Identify structural and temporal changes associated with extreme outcomes."]
    },

    proj_ai: {
      summary: "AI governance, diffusion, and institutional pathways across the UN and multilateral ecosystem.",
      bullets: ["Applied research · Catastrophic & emerging risks"]
    },
    proj_autonomous: {
      summary: "Proliferation and governance risks from increasingly accessible autonomous systems and enabling technologies.",
      bullets: ["Applied research · Emerging technology and AI"]
    },
    proj_food: {
      summary: "Conflict-driven food insecurity, humanitarian access, civilian protection, and early warning.",
      bullets: ["Applied research · Humanitarian crisis response"]
    },
    proj_aid: {
      summary: "Threats to humanitarian personnel, operating access, and protection in conflict environments.",
      bullets: ["Applied research · Humanitarian crisis response"]
    },
    proj_ambassador: {
      summary: "Quantitative analysis supporting senior multilateral decision-making under uncertainty.",
      bullets: ["Applied analysis · High-consequence decision support"]
    }
  };

  Object.entries(COPY).forEach(([id, patch]) => {
    if (DATA[id]) Object.assign(DATA[id], patch);
  });

  // Visible node labels only.  Coordinates, radii, shapes, and groups remain
  // exactly as defined by the original map.
  const visibleLines = {
    center: ["Statistical", "Methods"],
    pillar_structure: ["Latent", "Structure"],
    pillar_degraded: ["Uncertainty", "& Inference"],
    pillar_anticipatory: ["Dynamic Change", "& Early Warning"],

    unsupervised: ["Statistical", "Learning"],
    networks: ["Network &", "Diffusion"],
    longitudinal: ["Longitudinal", "& Dynamic"],
    forecasting: ["Forecasting", "& Risk Analysis"],

    counterextremism: ["Counterterrorism", "& Counterextremism"],
    humanitarian: ["Humanitarian", "Crisis Response"],
    ainonproliferation: ["Catastrophic &", "Emerging Risks"],
    autonomous: ["Emerging Technology", "and AI"],
    humansecurity: ["Systemic &", "Societal Risk"],
    climate: ["Climate &", "Environmental Risk"],
    massviolence: ["Civilian Harm", "& Mass Violence"]
  };

  Object.entries(visibleLines).forEach(([id, lines]) => {
    if (LAYOUT[id]) LAYOUT[id].lines = lines;
  });

  if (MOBILE_GROUPS?.length >= 5) {
    Object.assign(MOBILE_GROUPS[0], {
      title: "Latent Structure",
      summary: "Statistical learning, clustering, dimensionality reduction, networks, and structural change."
    });
    Object.assign(MOBILE_GROUPS[1], {
      title: "Uncertainty & Inference",
      summary: "Missing data, Bayesian inference, multilevel models, text evidence, and model validation."
    });
    Object.assign(MOBILE_GROUPS[2], {
      title: "Dynamic Change & Early Warning",
      summary: "Forecasting, risk analysis, spatial dependence, diffusion, and longitudinal change."
    });
    Object.assign(MOBILE_GROUPS[3], {
      title: "Application Domains",
      summary: "Catastrophic and emerging risks, counterterrorism and counterextremism, humanitarian crisis response, and related subdomains."
    });
    Object.assign(MOBILE_GROUPS[4], {
      title: "Research & Applied Work",
      summary: "Selected academic, applied, and decision-support projects linked to the methods and domains above."
    });
  }

  // Homepage contact rail: add GitHub Gists immediately after GitHub.
  window.addEventListener("DOMContentLoaded", () => {
    const rail = document.querySelector(".hero-contact-rail");
    if (!rail || rail.querySelector('[data-brand="gists"]')) return;

    const githubLink = rail.querySelector('[data-brand="github"]');
    if (!githubLink) return;

    const gistLink = document.createElement("a");
    gistLink.className = "hero-contact-link";
    gistLink.href = "https://gist.github.com/LystadJS";
    gistLink.dataset.brand = "gists";
    gistLink.dataset.label = "GitHub Gists";
    gistLink.setAttribute("aria-label", "GitHub Gists");
    gistLink.title = "GitHub Gists";
    gistLink.target = "_blank";
    gistLink.rel = "noopener noreferrer";
    gistLink.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 .8C5.82.8.8 5.82.8 12c0 4.94 3.2 9.13 7.64 10.61.56.1.76-.24.76-.54v-2.1c-3.11.68-3.77-1.32-3.77-1.32-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15A10.7 10.7 0 0 1 12 6.2c.95 0 1.9.13 2.8.38 2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.62 5.23-5.11 5.51.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.77.54A11.2 11.2 0 0 0 23.2 12C23.2 5.82 18.18.8 12 .8Z"
          transform="translate(.8 .6) scale(.78)"
          style="fill:currentColor;stroke:none"
        ></path>
        <rect x="13.3" y="14.2" width="9.2" height="7.6" rx="1.4" style="fill:#0d0b10;stroke:currentColor;stroke-width:1.2"></rect>
        <polyline points="15.5,16.3 18.1,18 15.5,19.7" style="fill:none;stroke:currentColor;stroke-width:1.35;stroke-linecap:round;stroke-linejoin:round"></polyline>
      </svg>`;

    githubLink.insertAdjacentElement("afterend", gistLink);
  });
})();