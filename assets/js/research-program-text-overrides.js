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
})();