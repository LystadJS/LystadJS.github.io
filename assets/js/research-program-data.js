(() => {
  "use strict";

  const REPOS = {
    unsupervised: "https://github.com/LystadJS/Unsupervised-Machine-Learning",
    clustering: "https://github.com/LystadJS/method-clustering",
    dimension: "https://github.com/LystadJS/method-dimension-reduction",
    networks: "https://github.com/LystadJS/method-network-analysis",
    missing: "https://github.com/LystadJS/method-missing-data",
    longitudinal: "https://github.com/LystadJS/method-longitudinal-multilevel",
    spatial: "https://github.com/LystadJS/method-spatial-statistics",
    computing: "https://github.com/LystadJS/method-statistical-computing",
    unTranscript: "https://github.com/LystadJS/UN-Transcript-Intelligence-Dynamic-Voting-Alignment",
    political: "https://github.com/LystadJS/domain-political-violence",
    terrorism: "https://github.com/LystadJS/domain-terrorism-counterterrorism",
    humanitarian: "https://github.com/LystadJS/domain-humanitarian-response",
    humansecurity: "https://github.com/LystadJS/domain-human-security",
    technology: "https://github.com/LystadJS/domain-emerging-technology",
    ecology: "https://github.com/LystadJS/domain-anthropocene-human-ecology",

    targetMap: "https://github.com/LystadJS/counterterrorism_ethnosectarian_islamic_state",
    lethality: "research.html#paper-estimating-lethality",
    vanguards: "https://repository.lib.fsu.edu/islandora/object/fsu:802361",
    climateTerror: "https://journals.flvc.org/owl/article/view/119038/129613",
    floodResponse: "research.html#project-himalayan-flood",
    foodUnderFire: "research.html#project-food-under-fire",
    protectingAidWorkers: "research.html#project-protecting-aid-workers",
    aiNonproliferation: "https://github.com/LystadJS/project-ai-governance-non-proliferation",
    autonomousWeapons: "research.html#project-autonomous-weapons",
    ambassadorAdvising: "research.html#project-ambassador-advising"
  };

  const DATA = {
    center: {
      kind: "core",
      title: "Computational Statistics",
      summary: "Statistical methods for hidden structure, uncertainty, and consequential change.",
      bullets: ["Discover hidden structure.", "Quantify uncertainty.", "Detect consequential change early."],
      methods: ["Unsupervised learning", "Longitudinal analysis", "Network analysis", "Missing-data methods", "Spatial statistics"],
      work: [
        "The Caliphate’s Target Map",
        "Estimating Lethality Under Missing Casualty Data",
        "Artificial Intelligence Non-Proliferation at the United Nations",
        "Himalayan Flood Response"
      ]
    },

    pillar_structure: {
      kind: "pillar",
      title: "Latent Structure & Catastrophic Transition",
      summary: "Discover hidden organization and detect consequential state change.",
      bullets: ["What structure exists before labels?", "When does change become transition?", "Which changes precede fragmentation or escalation?"],
      methods: ["Unsupervised learning", "Cluster analysis", "Dimensionality reduction", "Network analysis", "Longitudinal analysis"],
      work: ["The Caliphate’s Target Map", "Vanguards of Terror", "The Effects of Climate Change on Terrorist Networks"]
    },

    pillar_degraded: {
      kind: "pillar",
      title: "Inference Under Degraded Information",
      summary: "Draw defensible inference from incomplete, sparse, biased, or delayed evidence.",
      bullets: ["What can the evidence support?", "Which claims survive alternative assumptions?", "How much uncertainty must remain explicit?"],
      methods: ["Missing-data methods", "Bayesian methods", "Multilevel models", "Model validation", "Text analysis"],
      work: ["Estimating Lethality Under Missing Casualty Data", "Himalayan Flood Response", "Protecting Aid Workers"]
    },

    pillar_anticipatory: {
      kind: "pillar",
      title: "Anticipatory Statistics",
      summary: "Detect consequential risk early without overstating what the evidence can predict.",
      bullets: ["Can risk become legible before outcomes are obvious?", "Which signals are strong enough to matter?", "How should early warning carry uncertainty?"],
      methods: ["Forecasting", "Spatial statistics", "Longitudinal analysis", "Network analysis", "Model validation"],
      work: ["Food Under Fire", "Artificial Intelligence Non-Proliferation at the United Nations", "Countering Autonomous Weapons Proliferation", "Statistical Analysis for Ambassador-Level Advising"]
    },

    unsupervised: {kind:"method",title:"Unsupervised Learning",summary:"Discover latent structure without predefined labels.",bullets:["Find groups, regimes, and structure before categories are imposed."],methods:["HDBSCAN","Hierarchical clustering","Mixture models"],work:["The Caliphate’s Target Map","Artificial Intelligence Non-Proliferation at the United Nations"]},
    clustering: {kind:"method",title:"Cluster Analysis",summary:"Identify coherent groups and latent partitions in complex data.",bullets:["Compare hard, fuzzy, hierarchical, and density-based structure."],methods:["Density clustering","Fuzzy clustering"],work:["Artificial Intelligence Non-Proliferation at the United Nations"]},
    dimension: {kind:"method",title:"Dimensionality Reduction",summary:"Represent high-dimensional structure in lower-dimensional spaces.",bullets:["Compress complexity while preserving useful geometry."],methods:["PCA","UMAP","MDS"],work:["Artificial Intelligence Non-Proliferation at the United Nations","Estimating Lethality Under Missing Casualty Data"]},
    networks: {kind:"method",title:"Network Analysis",summary:"Study communities, bridges, diffusion, and relational structure.",bullets:["Model relationships as part of the data-generating system."],methods:["Community detection","Centrality","Diffusion analysis"],work:["Vanguards of Terror","Artificial Intelligence Non-Proliferation at the United Nations"]},
    longitudinal: {kind:"method",title:"Longitudinal Analysis",summary:"Measure persistence, movement, and transition across repeated observations.",bullets:["Track change rather than snapshots."],methods:["Panel models","Trajectory analysis","Alignment"],work:["Vanguards of Terror"]},
    missing: {kind:"method",title:"Missing Data",summary:"Model incomplete evidence as part of the inferential problem.",bullets:["Diagnose missingness before treating it."],methods:["Multiple imputation","Missingness diagnostics"],work:["Estimating Lethality Under Missing Casualty Data"]},
    bayesian: {kind:"method",title:"Bayesian Methods",summary:"Represent uncertainty directly when evidence is sparse or evolving.",bullets:["Update inference as evidence changes."],methods:["Bayesian inference","Simulation"],work:["Statistical Analysis for Ambassador-Level Advising"]},
    multilevel: {kind:"method",title:"Multilevel Models",summary:"Model observations nested within actors, places, institutions, or time.",bullets:["Separate case-level and system-level variation."],methods:["Mixed-effects modeling","Partial pooling"],work:["The Effects of Climate Change on Terrorist Networks"]},
    validation: {kind:"method",title:"Model Validation",summary:"Test whether conclusions survive reasonable analytical choices.",bullets:["Robustness is part of the result."],methods:["Sensitivity analysis","Bootstrap validation"],work:["Estimating Lethality Under Missing Casualty Data","Statistical Analysis for Ambassador-Level Advising"]},
    nlp: {kind:"method",title:"Text Analysis",summary:"Extract structured evidence from documents, statements, and transcripts.",bullets:["Preserve attribution, context, and provenance."],methods:["Content analysis","Information extraction","Attribution"],work:["Food Under Fire","Protecting Aid Workers","Artificial Intelligence Non-Proliferation at the United Nations"]},
    naturallanguage: {kind:"method",title:"Natural Language Processing",summary:"Use computational language models to represent, classify, and extract information from text.",bullets:["Convert large text corpora into analyzable representations."],methods:["Embeddings","Classification","Information extraction"],work:["Protecting Aid Workers","Artificial Intelligence Non-Proliferation at the United Nations"]},
    spatial: {kind:"method",title:"Spatial Statistics",summary:"Model geographic dependence, proximity, and place-based risk.",bullets:["Account for spatial dependence rather than treating place as incidental."],methods:["Spatial analysis","Population-weighted geography"],work:["The Caliphate’s Target Map","Himalayan Flood Response","The Effects of Climate Change on Terrorist Networks"]},
    forecasting: {kind:"method",title:"Forecasting & Early Warning",summary:"Estimate evolving risk while keeping uncertainty explicit.",bullets:["Early warning without false precision."],methods:["Forecasting","Change detection"],work:["Food Under Fire","Artificial Intelligence Non-Proliferation at the United Nations"]},

    political: {kind:"domain",title:"Political Violence",summary:"Organization, escalation, fragmentation, and actor behavior in violent political systems.",bullets:["Study structure and transition in high-stakes social systems."],methods:["Unsupervised learning","Network analysis","Longitudinal analysis"],work:["The Caliphate’s Target Map","Vanguards of Terror"]},
    massviolence: {kind:"domain",title:"Mass Violence",summary:"Large-scale organized harm, escalation, and catastrophic transition.",bullets:["Study the transition before the endpoint is obvious."],methods:["Unsupervised learning","Forecasting"],work:["Vanguards of Terror"]},
    counterextremism: {kind:"domain",title:"Counterterrorism & Counterextremism",summary:"Terrorist and extremist systems, organizational behavior, adaptation, and intervention-relevant structure.",bullets:["A high-stakes application of structure, behavior, and change."],methods:["Network analysis","Spatial statistics","Text analysis","Natural language processing"],work:["The Caliphate’s Target Map","Estimating Lethality Under Missing Casualty Data","Vanguards of Terror","The Effects of Climate Change on Terrorist Networks"]},
    humanecology: {kind:"domain",title:"Human Ecology",summary:"Interactions among populations, institutions, environments, and vulnerability.",bullets:["Study coupled human and environmental systems."],methods:["Multilevel models","Spatial statistics"],work:["The Effects of Climate Change on Terrorist Networks","Himalayan Flood Response"]},
    humanitarian: {kind:"domain",title:"Humanitarian Crisis Response",summary:"Access, protection, and response effectiveness under conflict and institutional stress.",bullets:["Analyze urgent decisions under degraded information."],methods:["Missing-data methods","Spatial statistics","Forecasting","Text analysis"],work:["Himalayan Flood Response","Food Under Fire","Protecting Aid Workers"]},
    humansecurity: {kind:"domain",title:"Human Security",summary:"Threats to human life and well-being across violent, environmental, institutional, and technological systems.",bullets:["The substantive frame tying the program together."],methods:["Forecasting","Spatial statistics","Model validation"],work:["Food Under Fire","Protecting Aid Workers","Countering Autonomous Weapons Proliferation"]},
    climate: {kind:"domain",title:"Climate Risk",summary:"Environmental stress interacting with vulnerability, institutions, conflict, and human security.",bullets:["Model environmental risk as part of a coupled human system."],methods:["Spatial statistics","Multilevel models","Forecasting"],work:["The Effects of Climate Change on Terrorist Networks","Himalayan Flood Response"]},
    ainonproliferation: {kind:"domain",title:"AI Non-Proliferation",summary:"Spread and governance of advanced AI capabilities as a human-security problem.",bullets:["Study technology diffusion, uncertainty, and governance."],methods:["Network analysis","Text analysis","Natural language processing","Forecasting"],work:["Artificial Intelligence Non-Proliferation at the United Nations"]},
    autonomous: {kind:"domain",title:"Autonomous Systems",summary:"Risk and governance surrounding autonomous systems and weapons.",bullets:["Study proliferation before governance catches up."],methods:["Network analysis","Bayesian methods","Forecasting"],work:["Countering Autonomous Weapons Proliferation","Artificial Intelligence Non-Proliferation at the United Nations"]},

    proj_target: {kind:"project",title:"The Caliphate’s Target Map",summary:"Ethnosectarian composition and insurgent violence in Iraq.",bullets:["Academic research · May 2026"],methods:["Spatial statistics","Network analysis","Data visualization"],work:["The Caliphate’s Target Map"],url:REPOS.targetMap},
    proj_lethality: {kind:"project",title:"Estimating Lethality Under Missing Casualty Data",summary:"Suicide attacks in Islamic State-linked terrorism under incomplete casualty records.",bullets:["Academic research · May 2026"],methods:["Missing-data methods","Multiple imputation","PCA"],work:["Estimating Lethality Under Missing Casualty Data"],url:REPOS.lethality},
    proj_vanguards: {kind:"project",title:"Vanguards of Terror",summary:"Strategic and tactical orientation and cohesion of the Islamic State insurgency, 1999–2019.",bullets:["Honors thesis · May 2022"],methods:["Network analysis","Content analysis","Longitudinal analysis"],work:["Vanguards of Terror"],url:REPOS.vanguards},
    proj_climate: {kind:"project",title:"The Effects of Climate Change on Terrorist Networks",summary:"Environmental change, resource stress, recruitment, and terrorist-network development in MENA.",bullets:["Published research · Dec. 2020"],methods:["Spatial statistics","Scenario comparison","Human ecology"],work:["The Effects of Climate Change on Terrorist Networks"],url:REPOS.climateTerror},
    proj_flood: {kind:"project",title:"Himalayan Flood Response",summary:"Humanitarian access and response effectiveness along the Nepalese-Chinese border.",bullets:["Applied humanitarian analysis"],methods:["Spatial statistics","Operational analysis"],work:["Himalayan Flood Response"],url:REPOS.floodResponse},
    proj_food: {kind:"project",title:"Food Under Fire",summary:"Conflict-driven food insecurity, humanitarian access, and civilian protection.",bullets:["UN-facing applied research"],methods:["Forecasting","Humanitarian analysis","Decision support"],work:["Food Under Fire"],url:REPOS.foodUnderFire},
    proj_aid: {kind:"project",title:"Protecting Aid Workers",summary:"Threats to humanitarian personnel, operating access, and protection in conflict environments.",bullets:["UN-facing applied research"],methods:["Human-security analysis","Text analysis","Natural language processing"],work:["Protecting Aid Workers"],url:REPOS.protectingAidWorkers},
    proj_ai: {kind:"project",title:"Artificial Intelligence Non-Proliferation at the United Nations",summary:"AI non-proliferation across the UN and multilateral ecosystem.",bullets:["Applied emerging-technology research"],methods:["Network analysis","Dimensionality reduction","Unsupervised learning","Natural language processing"],work:["Artificial Intelligence Non-Proliferation at the United Nations"],url:REPOS.aiNonproliferation},
    proj_autonomous: {kind:"project",title:"Countering Autonomous Weapons Proliferation",summary:"Proliferation risks from increasingly accessible autonomous systems and enabling technologies.",bullets:["Applied human-security research"],methods:["Network analysis","Forecasting","Bayesian methods"],work:["Countering Autonomous Weapons Proliferation"],url:REPOS.autonomousWeapons},
    proj_ambassador: {kind:"project",title:"Statistical Analysis for Ambassador-Level Advising",summary:"Releasable descriptions of quantitative analysis supporting senior multilateral decision-making.",bullets:["Decision support"],methods:["Statistical computing","Model validation","Forecasting"],work:["Statistical Analysis for Ambassador-Level Advising"],url:REPOS.ambassadorAdvising}
  };

  const LAYOUT = {
    center:{x:500,y:315,r:45,lines:["Computational","Statistics"],groups:["structure","degraded","anticipatory"]},
    pillar_structure:{x:305,y:225,r:34,lines:["Latent Structure","& Transition"],groups:["structure"]},
    pillar_degraded:{x:695,y:225,r:34,lines:["Degraded","Information"],groups:["degraded"]},
    pillar_anticipatory:{x:500,y:430,r:36,lines:["Anticipatory","Statistics"],groups:["anticipatory"]},

    unsupervised:{x:190,y:165,r:31,lines:["Unsupervised","Learning"],groups:["structure"],primary:true},
    clustering:{x:80,y:255,r:21,lines:["Cluster","Analysis"],groups:["structure"]},
    dimension:{x:325,y:92,r:22,lines:["Dimensionality","Reduction"],groups:["structure"]},
    networks:{x:425,y:155,r:25,lines:["Network","Analysis"],groups:["structure","anticipatory"]},
    longitudinal:{x:335,y:405,r:24,lines:["Longitudinal","Analysis"],groups:["structure","anticipatory"]},
    multilevel:{x:660,y:92,r:21,lines:["Multilevel","Models"],groups:["degraded"]},
    missing:{x:825,y:165,r:24,lines:["Missing","Data"],groups:["degraded"]},
    bayesian:{x:840,y:290,r:24,lines:["Bayesian","Methods"],groups:["degraded"]},
    validation:{x:715,y:365,r:22,lines:["Model","Validation"],groups:["degraded","anticipatory"]},
    nlp:{x:575,y:145,r:22,lines:["Text","Analysis"],groups:["degraded","anticipatory"]},
    naturallanguage:{x:705,y:145,r:22,lines:["Natural Language","Processing"],groups:["degraded","anticipatory"]},
    forecasting:{x:510,y:545,r:28,lines:["Forecasting","& Early Warning"],groups:["anticipatory"]},
    spatial:{x:325,y:555,r:22,lines:["Spatial","Statistics"],groups:["anticipatory"]},

    political:{x:75,y:95,r:23,lines:["Political","Violence"],groups:["structure","anticipatory"]},
    massviolence:{x:82,y:365,r:24,lines:["Mass","Violence"],groups:["structure","anticipatory"]},
    counterextremism:{x:170,y:495,r:26,lines:["Counterterrorism","& counterextremism"],groups:["structure","anticipatory"]},
    humanecology:{x:275,y:575,r:22,lines:["Human","Ecology"],groups:["structure","anticipatory"]},
    ainonproliferation:{x:905,y:100,r:27,lines:["AI","Non-Proliferation"],groups:["degraded","anticipatory"]},
    autonomous:{x:915,y:305,r:22,lines:["Autonomous","Systems"],groups:["degraded","anticipatory"]},
    humanitarian:{x:850,y:445,r:28,lines:["Humanitarian","Crisis Response"],groups:["degraded","anticipatory"]},
    humansecurity:{x:690,y:550,r:28,lines:["Human","Security"],groups:["degraded","anticipatory"]},
    climate:{x:865,y:565,r:24,lines:["Climate","Risk"],groups:["degraded","anticipatory"]},

    proj_target:{x:125,y:455,r:6,lines:[],groups:["structure","anticipatory"]},
    proj_lethality:{x:215,y:455,r:6,lines:[],groups:["structure","degraded"]},
    proj_vanguards:{x:225,y:515,r:6,lines:[],groups:["structure","anticipatory"]},
    proj_climate:{x:820,y:535,r:6,lines:[],groups:["structure","anticipatory"]},
    proj_flood:{x:795,y:475,r:6,lines:[],groups:["degraded","anticipatory"]},
    proj_food:{x:810,y:405,r:6,lines:[],groups:["degraded","anticipatory"]},
    proj_aid:{x:900,y:410,r:6,lines:[],groups:["degraded","anticipatory"]},
    proj_ai:{x:950,y:135,r:6,lines:[],groups:["degraded","anticipatory"]},
    proj_autonomous:{x:950,y:275,r:6,lines:[],groups:["degraded","anticipatory"]},
    proj_ambassador:{x:750,y:535,r:6,lines:[],groups:["degraded","anticipatory"]}
  };

  const HALOS = [
    {id:"structure",cx:270,cy:215,rx:238,ry:160},
    {id:"degraded",cx:720,cy:215,rx:225,ry:160},
    {id:"anticipatory",cx:500,cy:475,rx:285,ry:140}
  ];

  const EDGES = [
    ["center","pillar_structure","pillar"],["center","pillar_degraded","pillar"],["center","pillar_anticipatory","pillar"],
    ["pillar_structure","unsupervised","method"],["pillar_structure","clustering","method"],["pillar_structure","dimension","method"],["pillar_structure","networks","method"],["pillar_structure","longitudinal","method"],
    ["pillar_degraded","multilevel","method"],["pillar_degraded","missing","method"],["pillar_degraded","bayesian","method"],["pillar_degraded","validation","method"],["pillar_degraded","nlp","method"],["pillar_degraded","naturallanguage","method"],
    ["pillar_anticipatory","forecasting","method"],["pillar_anticipatory","spatial","method"],["pillar_anticipatory","longitudinal","method"],["pillar_anticipatory","networks","method"],["pillar_anticipatory","validation","method"],["pillar_anticipatory","naturallanguage","method"],
    ["unsupervised","clustering","method-link"],["unsupervised","dimension","method-link"],["networks","longitudinal","method-link"],["missing","bayesian","method-link"],["missing","validation","method-link"],["bayesian","multilevel","method-link"],["forecasting","longitudinal","method-link"],["forecasting","spatial","method-link"],["nlp","naturallanguage","method-link"],

    ["political","unsupervised","domain"],["political","networks","domain"],["massviolence","unsupervised","domain"],["massviolence","forecasting","domain"],
    ["counterextremism","unsupervised","domain"],["counterextremism","networks","domain"],["counterextremism","nlp","domain"],["counterextremism","naturallanguage","domain"],["counterextremism","spatial","domain"],
    ["humanecology","multilevel","domain"],["humanecology","spatial","domain"],
    ["humanitarian","missing","domain"],["humanitarian","bayesian","domain"],["humanitarian","spatial","domain"],["humanitarian","forecasting","domain"],["humanitarian","nlp","domain"],
    ["humansecurity","forecasting","domain"],["humansecurity","longitudinal","domain"],["humansecurity","spatial","domain"],["humansecurity","validation","domain"],
    ["climate","spatial","domain"],["climate","multilevel","domain"],["climate","forecasting","domain"],
    ["ainonproliferation","networks","domain"],["ainonproliferation","nlp","domain"],["ainonproliferation","naturallanguage","domain"],["ainonproliferation","forecasting","domain"],
    ["autonomous","networks","domain"],["autonomous","bayesian","domain"],["autonomous","forecasting","domain"],

    ["political","massviolence","domain-link"],["political","counterextremism","domain-link"],["massviolence","humanitarian","domain-link"],
    ["humanecology","humansecurity","domain-link"],["humanecology","climate","domain-link"],["humanitarian","humansecurity","domain-link"],
    ["humansecurity","climate","domain-link"],["ainonproliferation","autonomous","domain-link"],

    ["proj_target","counterextremism","project"],["proj_target","political","project"],["proj_target","spatial","project"],["proj_target","networks","project"],
    ["proj_lethality","counterextremism","project"],["proj_lethality","missing","project"],["proj_lethality","validation","project"],["proj_lethality","dimension","project"],
    ["proj_vanguards","counterextremism","project"],["proj_vanguards","political","project"],["proj_vanguards","networks","project"],["proj_vanguards","longitudinal","project"],
    ["proj_climate","climate","project"],["proj_climate","humanecology","project"],["proj_climate","counterextremism","project"],["proj_climate","spatial","project"],["proj_climate","multilevel","project"],["proj_climate","forecasting","project"],
    ["proj_flood","humanitarian","project"],["proj_flood","humanecology","project"],["proj_flood","climate","project"],["proj_flood","spatial","project"],
    ["proj_food","humanitarian","project"],["proj_food","humansecurity","project"],["proj_food","forecasting","project"],["proj_food","nlp","project"],
    ["proj_aid","humanitarian","project"],["proj_aid","humansecurity","project"],["proj_aid","nlp","project"],["proj_aid","naturallanguage","project"],
    ["proj_ai","ainonproliferation","project"],["proj_ai","autonomous","project"],["proj_ai","networks","project"],["proj_ai","dimension","project"],["proj_ai","unsupervised","project"],["proj_ai","naturallanguage","project"],
    ["proj_autonomous","autonomous","project"],["proj_autonomous","ainonproliferation","project"],["proj_autonomous","humansecurity","project"],["proj_autonomous","networks","project"],["proj_autonomous","forecasting","project"],["proj_autonomous","bayesian","project"],
    ["proj_ambassador","humansecurity","project"],["proj_ambassador","validation","project"],["proj_ambassador","forecasting","project"],["proj_ambassador","bayesian","project"]
  ].map(([a,b,type]) => ({a,b,type}));

  const MOBILE_GROUPS = [
    {title:"Latent Structure & Catastrophic Transition",summary:"Hidden structure, relational organization, and consequential state change.",ids:["unsupervised","clustering","dimension","networks","longitudinal"]},
    {title:"Inference Under Degraded Information",summary:"Missingness, uncertainty, hierarchy, language evidence, and validation.",ids:["missing","bayesian","multilevel","validation","nlp","naturallanguage"]},
    {title:"Anticipatory Statistics",summary:"Forecasting, early warning, spatial dependence, and evolving risk.",ids:["forecasting","spatial","longitudinal","networks","validation"]},
    {title:"Application Domains",summary:"Human-security problems that test the statistical program.",ids:["political","massviolence","counterextremism","humanecology","humanitarian","humansecurity","climate","ainonproliferation","autonomous"]},
    {title:"Research & Applied Projects",summary:"Projects and studies listed on the Research page and CV.",ids:["proj_target","proj_lethality","proj_vanguards","proj_climate","proj_flood","proj_food","proj_aid","proj_ai","proj_autonomous","proj_ambassador"]}
  ];

  window.JSLResearchProgramData = { REPOS, DATA, LAYOUT, HALOS, EDGES, MOBILE_GROUPS };
})();