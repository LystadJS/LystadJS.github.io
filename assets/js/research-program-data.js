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
    political: "https://github.com/LystadJS/domain-political-violence",
    terrorism: "https://github.com/LystadJS/domain-terrorism-counterterrorism",
    humanitarian: "https://github.com/LystadJS/domain-humanitarian-response",
    humansecurity: "https://github.com/LystadJS/domain-human-security",
    technology: "https://github.com/LystadJS/domain-emerging-technology",
    ecology: "https://github.com/LystadJS/domain-anthropocene-human-ecology",
    aiProject: "https://github.com/LystadJS/project-ai-governance-non-proliferation",
    isProject: "https://github.com/LystadJS/counterterrorism_ethnosectarian_islamic_state",
    unProject: "https://github.com/LystadJS/UN-Transcript-Intelligence-Dynamic-Voting-Alignment"
  };

  const DATA = {
    center: {
      kind: "core", title: "Computational Statistics",
      summary: "Make catastrophic threats to human security legible before they become irreversible.",
      bullets: ["Find hidden structure.", "Quantify uncertainty.", "Detect consequential change early."],
      methods: ["Unsupervised learning", "Longitudinal analysis", "Network methods", "Missing-data methods", "Spatial statistics"],
      work: ["AI Governance and Non-Proliferation", "Islamic State Attack Patterns", "UN Transcript and Voting Alignment"]
    },
    pillar_structure: {
      kind: "pillar", title: "Latent Structure & Transition",
      summary: "Discover hidden organization and identify real structural change.",
      bullets: ["What structure exists before labels?", "When does movement become transition?", "Which changes precede fragmentation or escalation?"],
      methods: ["Unsupervised learning", "Clustering", "Dimension reduction", "Network analysis", "Longitudinal methods"],
      work: ["Islamic State Attack Patterns"]
    },
    pillar_degraded: {
      kind: "pillar", title: "Inference Under Degraded Information",
      summary: "Make defensible claims from incomplete, sparse, biased, or delayed evidence.",
      bullets: ["What can the evidence actually support?", "Which claims survive alternative assumptions?", "How much uncertainty must remain explicit?"],
      methods: ["Missing-data methods", "Probabilistic models", "Multilevel models", "Sensitivity analysis", "Text extraction"],
      work: ["Islamic State Attack Patterns", "UN Transcript and Voting Alignment"]
    },
    pillar_anticipatory: {
      kind: "pillar", title: "Anticipatory Systems",
      summary: "Turn structural signals and uncertainty into early, interpretable evidence.",
      bullets: ["Can risk become legible before outcomes are visible?", "Which signals are strong enough to become evidence?", "How can early warning avoid false precision?"],
      methods: ["Forecasting", "Spatial statistics", "Longitudinal methods", "Network analysis", "Sensitivity analysis"],
      work: ["AI Governance and Non-Proliferation", "UN Transcript and Voting Alignment"]
    },

    unsupervised: {kind:"method",title:"Unsupervised Learning",summary:"Signature method for discovering structure without predefined labels.",bullets:["Groups, regimes, and latent structure."],methods:["HDBSCAN","Hierarchical clustering","Mixture models"],work:[]},
    clustering: {kind:"method",title:"Clustering",summary:"Identify coherent groups that are themselves part of the research question.",bullets:["Hard, fuzzy, hierarchical, and density-based partitions."],methods:["Density clustering","Fuzzy clustering"],work:[]},
    dimension: {kind:"method",title:"Dimension Reduction",summary:"Map high-dimensional structure into interpretable lower-dimensional spaces.",bullets:["Use maps to inspect and compare structure."],methods:["PCA","UMAP","MDS"],work:["AI Governance and Non-Proliferation"]},
    networks: {kind:"method",title:"Network Analysis",summary:"Study communities, bridges, diffusion, and changing relational structure.",bullets:["Relationships matter as much as the actors."],methods:["Community detection","Centrality","Diffusion analysis"],work:["UN Transcript and Voting Alignment"]},
    longitudinal: {kind:"method",title:"Longitudinal Methods",summary:"Separate persistence, movement, and transition across repeated observations.",bullets:["Track change rather than snapshots."],methods:["Panel models","Trajectory analysis","Alignment"],work:["UN Transcript and Voting Alignment"]},
    missing: {kind:"method",title:"Messy & Missing Data",summary:"Treat incomplete evidence as an inferential problem, not a cleanup nuisance.",bullets:["Audit missingness and measurement directly."],methods:["Multiple imputation","Missingness diagnostics"],work:["Islamic State Attack Patterns"]},
    bayesian: {kind:"method",title:"Bayesian / Probabilistic",summary:"Represent uncertainty directly when evidence is sparse or evolving.",bullets:["Do not hide uncertainty behind a single estimate."],methods:["Probabilistic inference","Simulation"],work:[]},
    multilevel: {kind:"method",title:"Multilevel Models",summary:"Model observations nested inside actors, places, institutions, or time.",bullets:["Separate case-level and system-level variation."],methods:["Mixed-effects modeling","Partial pooling"],work:["UN Transcript and Voting Alignment"]},
    validation: {kind:"method",title:"Sensitivity & Validation",summary:"Test what makes a result disappear.",bullets:["Robustness is part of the result."],methods:["Sensitivity analysis","Bootstrap"],work:[]},
    nlp: {kind:"method",title:"Text / NLP",summary:"Turn documents and transcripts into structured evidence without losing attribution.",bullets:["Preserve who said what and where it came from."],methods:["Information extraction","Attribution","Classification"],work:["UN Transcript and Voting Alignment"]},
    spatial: {kind:"method",title:"Spatial Statistics",summary:"Model geographic dependence, proximity, and place-based risk.",bullets:["Nearby events are often related."],methods:["Spatial analysis","Population-weighted geography"],work:["Islamic State Attack Patterns"]},
    forecasting: {kind:"method",title:"Forecasting & Early Warning",summary:"Recognize meaningful change earlier without pretending to know the future.",bullets:["Signal detection over false precision."],methods:["Forecasting","Change detection"],work:["AI Governance and Non-Proliferation"]},

    political: {kind:"domain",title:"Political Violence",summary:"Organized violence, escalation, fragmentation, and actor structure.",bullets:["A testbed for latent structure and transition."],methods:["Unsupervised learning","Network analysis","Longitudinal methods"],work:["Islamic State Attack Patterns"]},
    massviolence: {kind:"domain",title:"Mass Violence",summary:"Large-scale organized harm and catastrophic escalation.",bullets:["Focus on transition before the endpoint is obvious."],methods:["Unsupervised learning","Forecasting"],work:[]},
    counterextremism: {kind:"domain",title:"Counterterrorism & Counterextremism",summary:"Terrorist and extremist systems, behavior, and intervention-relevant structure.",bullets:["Application domain, not the identity of the program."],methods:["Network analysis","Spatial statistics","Text / NLP"],work:["Islamic State Attack Patterns"]},
    humanecology: {kind:"domain",title:"Human Ecology",summary:"Interactions among populations, institutions, environments, and vulnerability.",bullets:["Extends the program beyond conflict alone."],methods:["Multilevel models","Spatial statistics"],work:[]},
    humanitarian: {kind:"domain",title:"Human-Created Humanitarian Crises",summary:"Crises intensified by conflict, politics, institutional failure, and organized violence.",bullets:["Degraded information and nonlinear change are central."],methods:["Missing-data methods","Spatial statistics","Forecasting"],work:[]},
    humansecurity: {kind:"domain",title:"Human Security",summary:"Threats to human life and well-being across violent, political, environmental, and technological systems.",bullets:["The common substantive frame."],methods:["Forecasting","Spatial statistics","Sensitivity analysis"],work:["AI Governance and Non-Proliferation","Islamic State Attack Patterns"]},
    climate: {kind:"domain",title:"Climate & Environmental Risk",summary:"Environmental stress interacting with human systems, vulnerability, and security.",bullets:["Treat environmental risk as part of a coupled human system."],methods:["Spatial statistics","Multilevel models","Forecasting"],work:[]},
    ainonproliferation: {kind:"domain",title:"AI Non-Proliferation",summary:"Spread and governance of advanced AI capabilities as a human-security problem.",bullets:["Technology diffusion, uncertainty, and governance."],methods:["Network analysis","Text / NLP","Forecasting"],work:["AI Governance and Non-Proliferation"]},
    autonomous: {kind:"domain",title:"Autonomous Systems",summary:"Governance and risk surrounding autonomous systems and weapons.",bullets:["Understand diffusion and risk before governance catches up."],methods:["Network analysis","Probabilistic inference","Forecasting"],work:["AI Governance and Non-Proliferation"]},

    proj_is: {kind:"project",title:"Islamic State Attack Patterns",summary:"Public counterterrorism analysis repository.",bullets:["Iraq · attacks · ethnosectarian context · spatial analysis."],methods:["Spatial statistics","Missing-data methods"],work:["Islamic State Attack Patterns"],url:REPOS.isProject},
    proj_un: {kind:"project",title:"UN Transcript and Voting Alignment",summary:"Public transcript-evidence and voting-alignment repository.",bullets:["Institutional text · networks · longitudinal change."],methods:["Text / NLP","Network analysis","Longitudinal methods"],work:["UN Transcript and Voting Alignment"],url:REPOS.unProject},
    proj_ai: {kind:"project",title:"AI Governance and Non-Proliferation",summary:"Public AI-governance reproducibility repository.",bullets:["AI governance · non-proliferation · multilateral analysis."],methods:["Dimension reduction","Statistical computing"],work:["AI Governance and Non-Proliferation"],url:REPOS.aiProject}
  };

  const LAYOUT = {
    center:{x:500,y:315,r:45,lines:["Computational","Statistics"],groups:["structure","degraded","anticipatory"]},
    pillar_structure:{x:305,y:225,r:34,lines:["Latent Structure","& Transition"],groups:["structure"]},
    pillar_degraded:{x:695,y:225,r:34,lines:["Degraded","Information"],groups:["degraded"]},
    pillar_anticipatory:{x:500,y:430,r:36,lines:["Anticipatory","Systems"],groups:["anticipatory"]},
    unsupervised:{x:190,y:165,r:31,lines:["Unsupervised","Learning"],groups:["structure"],primary:true},
    clustering:{x:80,y:255,r:21,lines:["Clustering"],groups:["structure"]},
    dimension:{x:325,y:92,r:22,lines:["Dimension","Reduction"],groups:["structure"]},
    networks:{x:425,y:155,r:25,lines:["Network","Analysis"],groups:["structure","anticipatory"]},
    longitudinal:{x:335,y:405,r:24,lines:["Longitudinal","Methods"],groups:["structure","anticipatory"]},
    multilevel:{x:660,y:92,r:21,lines:["Multilevel","Models"],groups:["degraded"]},
    missing:{x:825,y:165,r:24,lines:["Messy &","Missing Data"],groups:["degraded"]},
    bayesian:{x:840,y:290,r:24,lines:["Bayesian /","Probabilistic"],groups:["degraded"]},
    validation:{x:715,y:365,r:22,lines:["Sensitivity","& Validation"],groups:["degraded","anticipatory"]},
    nlp:{x:600,y:150,r:22,lines:["Text / NLP"],groups:["degraded","anticipatory"]},
    forecasting:{x:510,y:545,r:28,lines:["Forecasting","& Early Warning"],groups:["anticipatory"]},
    spatial:{x:325,y:555,r:22,lines:["Spatial","Statistics"],groups:["anticipatory"]},
    political:{x:75,y:95,r:23,lines:["Political","Violence"],groups:["structure","anticipatory"]},
    massviolence:{x:82,y:365,r:24,lines:["Mass","Violence"],groups:["structure","anticipatory"]},
    counterextremism:{x:170,y:495,r:26,lines:["Counterterrorism","& counterextremism"],groups:["structure","anticipatory"]},
    humanecology:{x:275,y:575,r:22,lines:["Human","Ecology"],groups:["structure","anticipatory"]},
    ainonproliferation:{x:905,y:100,r:27,lines:["AI","Non-Proliferation"],groups:["degraded","anticipatory"]},
    autonomous:{x:915,y:305,r:22,lines:["Autonomous","Systems"],groups:["degraded","anticipatory"]},
    humanitarian:{x:850,y:445,r:28,lines:["Human-Created","Humanitarian Crises"],groups:["degraded","anticipatory"]},
    humansecurity:{x:690,y:550,r:28,lines:["Human","Security"],groups:["degraded","anticipatory"]},
    climate:{x:865,y:565,r:24,lines:["Climate &","Environmental Risk"],groups:["degraded","anticipatory"]},
    proj_is:{x:125,y:430,r:7,lines:[],groups:["structure","anticipatory"]},
    proj_un:{x:775,y:105,r:7,lines:[],groups:["degraded","anticipatory"]},
    proj_ai:{x:885,y:220,r:7,lines:[],groups:["degraded","anticipatory"]}
  };

  const HALOS = [
    {id:"structure",cx:270,cy:215,rx:238,ry:160},
    {id:"degraded",cx:720,cy:215,rx:225,ry:160},
    {id:"anticipatory",cx:500,cy:475,rx:285,ry:140}
  ];

  const EDGES = [
    ["center","pillar_structure","pillar"],["center","pillar_degraded","pillar"],["center","pillar_anticipatory","pillar"],
    ["pillar_structure","unsupervised","method"],["pillar_structure","clustering","method"],["pillar_structure","dimension","method"],["pillar_structure","networks","method"],["pillar_structure","longitudinal","method"],
    ["pillar_degraded","multilevel","method"],["pillar_degraded","missing","method"],["pillar_degraded","bayesian","method"],["pillar_degraded","validation","method"],["pillar_degraded","nlp","method"],
    ["pillar_anticipatory","forecasting","method"],["pillar_anticipatory","spatial","method"],["pillar_anticipatory","longitudinal","method"],["pillar_anticipatory","networks","method"],["pillar_anticipatory","validation","method"],
    ["unsupervised","clustering","method-link"],["unsupervised","dimension","method-link"],["networks","longitudinal","method-link"],["missing","bayesian","method-link"],["missing","validation","method-link"],["bayesian","multilevel","method-link"],["forecasting","longitudinal","method-link"],["forecasting","spatial","method-link"],
    ["political","unsupervised","domain"],["political","networks","domain"],["massviolence","unsupervised","domain"],["massviolence","forecasting","domain"],["counterextremism","unsupervised","domain"],["counterextremism","networks","domain"],["counterextremism","nlp","domain"],["counterextremism","spatial","domain"],["humanecology","multilevel","domain"],["humanecology","spatial","domain"],
    ["humanitarian","missing","domain"],["humanitarian","bayesian","domain"],["humanitarian","spatial","domain"],["humanitarian","forecasting","domain"],["humansecurity","forecasting","domain"],["humansecurity","longitudinal","domain"],["humansecurity","spatial","domain"],["humansecurity","validation","domain"],["climate","spatial","domain"],["climate","multilevel","domain"],["climate","forecasting","domain"],["ainonproliferation","networks","domain"],["ainonproliferation","nlp","domain"],["ainonproliferation","forecasting","domain"],["autonomous","networks","domain"],["autonomous","bayesian","domain"],["autonomous","forecasting","domain"],
    ["political","massviolence","domain-link"],["political","counterextremism","domain-link"],["massviolence","humanitarian","domain-link"],["humanecology","humansecurity","domain-link"],["humanecology","climate","domain-link"],["humanitarian","humansecurity","domain-link"],["humansecurity","climate","domain-link"],["ainonproliferation","autonomous","domain-link"],
    ["proj_is","counterextremism","project"],["proj_is","political","project"],["proj_un","nlp","project"],["proj_un","networks","project"],["proj_ai","ainonproliferation","project"],["proj_ai","autonomous","project"]
  ].map(([a,b,type]) => ({a,b,type}));

  const MOBILE_GROUPS=[
    {title:"Latent Structure & Transition",summary:"Hidden groups, relational structure, and structural change.",ids:["unsupervised","clustering","dimension","networks","longitudinal"]},
    {title:"Inference Under Degraded Information",summary:"Missingness, uncertainty, hierarchy, and validation.",ids:["missing","bayesian","multilevel","validation","nlp"]},
    {title:"Anticipatory Systems",summary:"Early warning, spatial structure, and evidence translation.",ids:["forecasting","spatial","longitudinal","networks","validation"]},
    {title:"Application Domains",summary:"Human-security problems that test the statistical program.",ids:["political","massviolence","counterextremism","humanecology","humanitarian","humansecurity","climate","ainonproliferation","autonomous"]},
    {title:"Public Projects",summary:"Current public reproducibility repositories.",ids:["proj_ai","proj_is","proj_un"]}
  ];

  window.JSLResearchProgramData = { REPOS, DATA, LAYOUT, HALOS, EDGES, MOBILE_GROUPS };
})();
