(() => {
  "use strict";

  const payload = window.JSLResearchProgramData;
  if (!payload) return;
  const { DATA, LAYOUT, MOBILE_GROUPS } = payload;

  const COPY = {
    center: {summary:"Computational methods for latent structure, uncertainty, and consequential change.",bullets:["Discover latent structure.","Quantify uncertainty.","Detect consequential change."]},
    pillar_structure: {title:"Latent Structure & Transition",summary:"Identify hidden organization and consequential changes in system structure.",bullets:["What structure exists before categories are imposed?","When does variation become structural transition?","Which changes precede fragmentation, escalation, or regime shift?"]},
    pillar_degraded: {title:"Inference Under Degraded Information",summary:"Draw defensible inference from incomplete, sparse, biased, or delayed evidence.",bullets:["What can the available evidence support?","Which conclusions survive alternative assumptions?","How should uncertainty propagate into the result?"]},
    pillar_anticipatory: {title:"Anticipatory Statistics",summary:"Estimate evolving risk and detect consequential change before outcomes are obvious.",bullets:["Which signals precede consequential outcomes?","When is early warning statistically defensible?","How should uncertainty constrain anticipatory claims?"]},

    unsupervised:{summary:"Discover latent structure without predefined labels.",bullets:["Identify groups, regimes, and anomalous observations."]},
    clustering:{summary:"Partition observations into empirically coherent groups.",bullets:["Compare centroid-, hierarchy-, density-, and mixture-based structure."]},
    dimension:{summary:"Represent high-dimensional variation in lower-dimensional spaces.",bullets:["Reduce complexity while preserving interpretable structure."]},
    networks:{summary:"Model relational structure, communities, diffusion, and brokerage.",bullets:["Treat ties and topology as part of the data-generating process."]},
    longitudinal:{summary:"Model persistence, trajectories, and structural change over time.",bullets:["Distinguish temporal change from cross-sectional differences."]},
    missing:{summary:"Model incomplete observations without discarding uncertainty.",bullets:["Diagnose missingness before selecting an estimation strategy."]},
    bayesian:{summary:"Update probabilistic inference as evidence accumulates.",bullets:["Represent parameter and predictive uncertainty explicitly."]},
    multilevel:{summary:"Model dependence created by nested and repeated observations.",bullets:["Separate unit-level and group-level variation."]},
    validation:{summary:"Evaluate stability, calibration, and sensitivity to analytical choices.",bullets:["Treat robustness as part of the inferential result."]},
    nlp:{summary:"Convert qualitative text into structured, attributable evidence.",bullets:["Preserve context, attribution, and provenance."]},
    naturallanguage:{summary:"Represent and extract linguistic information computationally at scale.",bullets:["Use embeddings, classification, and information extraction."]},
    spatial:{summary:"Model geographic dependence, proximity, and spatial heterogeneity.",bullets:["Account for spatial structure in estimation and prediction."]},
    forecasting:{summary:"Estimate evolving risk and detect consequential temporal change.",bullets:["Prioritize calibrated early warning over false precision."]},

    political:{summary:"Violent political behavior, organization, escalation, and fragmentation.",bullets:["Study latent structure and transition in conflict systems."]},
    massviolence:{summary:"Large-scale organized harm and pathways toward catastrophic escalation.",bullets:["Identify structural changes that precede extreme outcomes."]},
    counterextremism:{summary:"Terrorist and extremist organization, adaptation, behavior, and intervention.",bullets:["Connect relational, spatial, and textual evidence to operationally relevant structure."]},
    humanecology:{summary:"Coupled relationships among populations, institutions, environments, and vulnerability.",bullets:["Model interacting social and environmental systems."]},
    humanitarian:{summary:"Humanitarian access, protection, and response under conflict and institutional stress.",bullets:["Support inference and prioritization under degraded information."]},
    humansecurity:{summary:"Threats to human life and well-being across violent, environmental, institutional, and technological systems.",bullets:["Provide the common substantive frame for the research program."]},
    climate:{summary:"Environmental stress, vulnerability, and security within coupled human systems.",bullets:["Model how environmental change alters exposure and risk."]},
    ainonproliferation:{summary:"Diffusion and governance of advanced AI capabilities as a human-security problem.",bullets:["Study capability spread, institutional response, and systemic risk."]},
    autonomous:{summary:"Risk, diffusion, and governance of autonomous and weaponized systems.",bullets:["Study proliferation before institutional response stabilizes."]},

    proj_target:{summary:"Ethnosectarian composition and insurgent targeting in Iraq.",bullets:["Academic study · 2026"]},
    proj_lethality:{summary:"Terrorist lethality estimation under incomplete casualty reporting.",bullets:["Academic study · 2026"]},
    proj_vanguards:{summary:"Strategic orientation and organizational cohesion in the Islamic State insurgency, 1999–2019.",bullets:["Honors thesis · 2022"]},
    proj_climate:{summary:"Climate stress, resource competition, and terrorist-network development in MENA.",bullets:["Published study · 2020"]},
    proj_flood:{summary:"Humanitarian access and response effectiveness along the Nepal–China border.",bullets:["Applied research · Humanitarian response"]},
    proj_food:{summary:"Conflict-driven food insecurity, humanitarian access, and civilian protection.",bullets:["Applied research · Human security"]},
    proj_aid:{summary:"Threats to humanitarian personnel, access, and protection in conflict environments.",bullets:["Applied research · Humanitarian protection"]},
    proj_ai:{summary:"Diffusion and governance of advanced AI capabilities across the UN system.",bullets:["Applied research · Emerging technology"]},
    proj_autonomous:{summary:"Proliferation risk from accessible autonomous systems and enabling technologies.",bullets:["Applied research · Emerging technology"]},
    proj_ambassador:{summary:"Quantitative analysis supporting senior multilateral decision-making.",bullets:["Applied analysis · Decision support"]},

    sm_kmeans:{summary:"Partition observations around iteratively estimated centroids.",bullets:["Centroid-based clustering."]},
    sm_gmm:{summary:"Model latent groups as probabilistic mixture components.",bullets:["Soft cluster membership."]},
    sm_dbscan:{summary:"Identify density-connected clusters while isolating noise.",bullets:["Density-based clustering."]},
    sm_hdbscan:{summary:"Identify stable clusters across multiple density scales.",bullets:["Hierarchical density clustering."]},
    sm_pca:{summary:"Represent correlated variation with orthogonal linear components.",bullets:["Linear dimension reduction."]},
    sm_umap:{summary:"Construct nonlinear embeddings from local neighborhood structure.",bullets:["Nonlinear manifold learning."]},
    sm_louvain:{summary:"Detect communities by optimizing network modularity.",bullets:["Community detection."]},
    sm_centrality:{summary:"Quantify structural prominence, brokerage, and reach.",bullets:["Node-level network structure."]},
    sm_panel:{summary:"Model repeated observations across units and time.",bullets:["Longitudinal dependence."]},
    sm_changepoint:{summary:"Detect discrete changes in process structure or parameters.",bullets:["Structural break detection."]},
    sm_reml:{summary:"Estimate variance components with reduced finite-sample bias.",bullets:["Mixed-effects estimation."]},
    sm_icc:{summary:"Quantify variance attributable to clustering or grouping.",bullets:["Within-group dependence."]},
    sm_mice:{summary:"Generate multiple imputations through chained conditional models.",bullets:["Missing-data uncertainty."]},
    sm_fiml:{summary:"Estimate parameters from all observed information under the model.",bullets:["Likelihood-based missing-data handling."]},
    sm_mcmc:{summary:"Approximate posterior distributions through stochastic simulation.",bullets:["Bayesian computation."]},
    sm_hmc:{summary:"Explore posterior distributions using gradient-informed dynamics.",bullets:["Efficient Bayesian computation."]},
    sm_bootstrap:{summary:"Estimate sampling uncertainty through repeated resampling.",bullets:["Resampling-based uncertainty."]},
    sm_cv:{summary:"Estimate generalization performance using held-out observations.",bullets:["Out-of-sample validation."]},
    sm_topic:{summary:"Infer latent thematic structure from document collections.",bullets:["Unsupervised text structure."]},
    sm_content:{summary:"Systematically encode substantive features of text.",bullets:["Structured textual evidence."]},
    sm_embeddings:{summary:"Represent linguistic content in continuous vector spaces.",bullets:["Semantic representation."]},
    sm_transformers:{summary:"Model contextual language dependencies through attention.",bullets:["Contextual language modeling."]},
    sm_moran:{summary:"Quantify global spatial autocorrelation.",bullets:["Spatial dependence."]},
    sm_kriging:{summary:"Predict spatial values from modeled covariance structure.",bullets:["Spatial interpolation."]},
    sm_arima:{summary:"Model autocorrelated series with autoregressive and moving-average terms.",bullets:["Classical time-series forecasting."]},
    sm_statespace:{summary:"Represent dynamic systems through latent states and observed measurements.",bullets:["Dynamic estimation and forecasting."]}
  };

  Object.entries(COPY).forEach(([id, patch]) => {
    if (DATA[id]) Object.assign(DATA[id], patch);
  });

  const visibleLines = {
    pillar_structure:["Latent Structure","& Transition"],
    pillar_degraded:["Inference Under","Degraded Information"],
    pillar_anticipatory:["Anticipatory","Statistics"],
    unsupervised:["Unsupervised","Learning"], clustering:["Cluster","Analysis"], dimension:["Dimensionality","Reduction"], networks:["Network","Analysis"], longitudinal:["Longitudinal","Analysis"], multilevel:["Multilevel","Models"], missing:["Missing","Data"], bayesian:["Bayesian","Methods"], validation:["Model","Validation"], nlp:["Text","Analysis"], naturallanguage:["Natural Language","Processing"], forecasting:["Forecasting","& Early Warning"], spatial:["Spatial","Statistics"],
    political:["Political","Violence"], massviolence:["Mass","Violence"], counterextremism:["Counterterrorism","& Counterextremism"], humanecology:["Human","Ecology"], ainonproliferation:["AI","Non-Proliferation"], autonomous:["Autonomous","Systems"], humanitarian:["Humanitarian","Crisis Response"], humansecurity:["Human","Security"], climate:["Climate","Risk"]
  };

  Object.entries(visibleLines).forEach(([id, lines]) => {
    if (LAYOUT[id]) LAYOUT[id].lines = lines;
  });

  if (MOBILE_GROUPS?.length >= 5) {
    Object.assign(MOBILE_GROUPS[0], {title:"Latent Structure & Transition",summary:"Latent structure, relational organization, and structural transition."});
    Object.assign(MOBILE_GROUPS[1], {title:"Inference Under Degraded Information",summary:"Inference under missingness, uncertainty, hierarchy, and textual evidence."});
    Object.assign(MOBILE_GROUPS[2], {title:"Anticipatory Statistics",summary:"Forecasting, early warning, spatial dependence, and evolving risk."});
    Object.assign(MOBILE_GROUPS[3], {title:"Application Domains",summary:"Human-security domains that motivate and test the statistical program."});
    Object.assign(MOBILE_GROUPS[4], {title:"Research & Applied Projects",summary:"Research and applied work linked to methods and domains."});
  }
})();