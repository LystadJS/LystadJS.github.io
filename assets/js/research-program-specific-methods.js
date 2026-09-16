(() => {
  "use strict";

  const payload = window.JSLResearchProgramData;
  if (!payload) return;
  const { DATA, LAYOUT, EDGES } = payload;

  Object.assign(DATA, {
    sm_kmeans: {kind:"specific_method",title:"K-Means",summary:"Partition observations into centroid-based clusters.",bullets:["A simple baseline for compact cluster structure."],methods:["Unsupervised learning"],work:[]},
    sm_gmm: {kind:"specific_method",title:"Gaussian Mixture Models",summary:"Represent latent groups as probabilistic mixture components.",bullets:["Allows soft membership and probabilistic cluster structure."],methods:["Unsupervised learning"],work:[]},

    sm_dbscan: {kind:"specific_method",title:"DBSCAN",summary:"Identify dense regions without requiring a fixed number of clusters.",bullets:["Useful for irregular clusters and explicit noise points."],methods:["Cluster analysis"],work:[]},
    sm_hdbscan: {kind:"specific_method",title:"HDBSCAN",summary:"Identify stable density-based clusters across varying density levels.",bullets:["Extends density clustering with hierarchical stability."],methods:["Cluster analysis"],work:[]},

    sm_pca: {kind:"specific_method",title:"Principal Component Analysis",summary:"Represent linear variation using orthogonal components.",bullets:["Compress correlated variables while preserving variance."],methods:["Dimensionality reduction"],work:[]},
    sm_umap: {kind:"specific_method",title:"UMAP",summary:"Construct nonlinear low-dimensional representations of complex structure.",bullets:["Emphasizes local neighborhood structure."],methods:["Dimensionality reduction"],work:[]},

    sm_louvain: {kind:"specific_method",title:"Louvain Community Detection",summary:"Detect communities by optimizing network modularity.",bullets:["Identifies densely connected network communities."],methods:["Network analysis"],work:[]},
    sm_centrality: {kind:"specific_method",title:"Centrality Analysis",summary:"Measure structural importance within a network.",bullets:["Compare influence, brokerage, reach, and connectivity."],methods:["Network analysis"],work:[]},

    sm_panel: {kind:"specific_method",title:"Panel Models",summary:"Model repeated observations across units and time.",bullets:["Separate temporal change from stable between-unit differences."],methods:["Longitudinal analysis"],work:[]},
    sm_changepoint: {kind:"specific_method",title:"Change-Point Analysis",summary:"Identify points where a process changes structurally.",bullets:["Useful for detecting abrupt regime or trajectory shifts."],methods:["Longitudinal analysis"],work:[]},

    sm_reml: {kind:"specific_method",title:"REML",summary:"Estimate variance components in multilevel and mixed-effects models.",bullets:["Reduces finite-sample bias in variance estimation."],methods:["Multilevel models"],work:[]},
    sm_icc: {kind:"specific_method",title:"Intraclass Correlation",summary:"Measure how much variation is attributable to group membership.",bullets:["Quantifies dependence created by nested data."],methods:["Multilevel models"],work:[]},

    sm_mice: {kind:"specific_method",title:"MICE",summary:"Impute incomplete variables using chained conditional models.",bullets:["Multiple imputation propagates missing-data uncertainty."],methods:["Missing-data methods"],work:[]},
    sm_fiml: {kind:"specific_method",title:"Full Information Maximum Likelihood",summary:"Estimate model parameters using all available observed information.",bullets:["Avoids discarding partially observed cases."],methods:["Missing-data methods"],work:[]},

    sm_mcmc: {kind:"specific_method",title:"Markov Chain Monte Carlo",summary:"Approximate posterior distributions through stochastic simulation.",bullets:["Supports Bayesian inference when closed-form solutions are unavailable."],methods:["Bayesian methods"],work:[]},
    sm_hmc: {kind:"specific_method",title:"Hamiltonian Monte Carlo",summary:"Use gradient-informed simulation to explore posterior distributions efficiently.",bullets:["Well suited to high-dimensional Bayesian models."],methods:["Bayesian methods"],work:[]},

    sm_bootstrap: {kind:"specific_method",title:"Bootstrap",summary:"Estimate uncertainty by repeatedly resampling observed data.",bullets:["Useful for standard errors, intervals, and stability analysis."],methods:["Model validation"],work:[]},
    sm_cv: {kind:"specific_method",title:"Cross-Validation",summary:"Evaluate model behavior on observations withheld from fitting.",bullets:["Tests generalization rather than in-sample fit."],methods:["Model validation"],work:[]},

    sm_topic: {kind:"specific_method",title:"Topic Modeling",summary:"Discover recurring latent themes within collections of text.",bullets:["Useful for exploratory structure in large document corpora."],methods:["Text analysis"],work:[]},
    sm_content: {kind:"specific_method",title:"Content Analysis",summary:"Systematically code and compare substantive features of text.",bullets:["Links qualitative meaning to reproducible structured evidence."],methods:["Text analysis"],work:[]},

    sm_embeddings: {kind:"specific_method",title:"Language Embeddings",summary:"Represent text as numerical vectors encoding linguistic similarity.",bullets:["Supports semantic comparison, clustering, and retrieval."],methods:["Natural language processing"],work:[]},
    sm_transformers: {kind:"specific_method",title:"Transformer Models",summary:"Model contextual relationships in language using attention mechanisms.",bullets:["Supports modern classification, extraction, and language representation."],methods:["Natural language processing"],work:[]},

    sm_moran: {kind:"specific_method",title:"Moran's I",summary:"Measure global spatial autocorrelation.",bullets:["Tests whether similar values cluster geographically."],methods:["Spatial statistics"],work:[]},
    sm_kriging: {kind:"specific_method",title:"Kriging",summary:"Predict spatial values using modeled geographic covariance.",bullets:["Produces spatial interpolation with uncertainty."],methods:["Spatial statistics"],work:[]},

    sm_arima: {kind:"specific_method",title:"ARIMA",summary:"Model autocorrelated temporal processes using autoregressive and moving-average structure.",bullets:["A standard framework for univariate time-series forecasting."],methods:["Forecasting"],work:[]},
    sm_statespace: {kind:"specific_method",title:"State-Space Models",summary:"Represent evolving systems through latent states and observed measurements.",bullets:["Useful for dynamic inference, filtering, and forecasting."],methods:["Forecasting"],work:[]}
  });

  LAYOUT.center.r = 56;

  Object.assign(LAYOUT, {
    sm_kmeans:{x:150,y:120,r:11,short:"K-MEANS",lines:[],groups:["structure"]},
    sm_gmm:{x:235,y:120,r:11,short:"GMM",lines:[],groups:["structure"]},

    sm_dbscan:{x:40,y:225,r:11,short:"DBSCAN",lines:[],groups:["structure"]},
    sm_hdbscan:{x:40,y:285,r:11,short:"HDBSCAN",lines:[],groups:["structure"]},

    sm_pca:{x:285,y:45,r:11,short:"PCA",lines:[],groups:["structure"]},
    sm_umap:{x:365,y:45,r:11,short:"UMAP",lines:[],groups:["structure"]},

    sm_louvain:{x:400,y:105,r:11,short:"LOUVAIN",lines:[],groups:["structure","anticipatory"]},
    sm_centrality:{x:455,y:110,r:11,short:"CENTRAL",lines:[],groups:["structure","anticipatory"]},

    sm_panel:{x:295,y:370,r:11,short:"PANEL",lines:[],groups:["structure","anticipatory"]},
    sm_changepoint:{x:295,y:440,r:11,short:"CHANGE",lines:[],groups:["structure","anticipatory"]},

    sm_reml:{x:625,y:45,r:11,short:"REML",lines:[],groups:["degraded"]},
    sm_icc:{x:695,y:45,r:11,short:"ICC",lines:[],groups:["degraded"]},

    sm_mice:{x:790,y:115,r:11,short:"MICE",lines:[],groups:["degraded"]},
    sm_fiml:{x:860,y:205,r:11,short:"FIML",lines:[],groups:["degraded"]},

    sm_mcmc:{x:795,y:255,r:11,short:"MCMC",lines:[],groups:["degraded"]},
    sm_hmc:{x:795,y:310,r:11,short:"HMC",lines:[],groups:["degraded"]},

    sm_bootstrap:{x:665,y:340,r:11,short:"BOOT",lines:[],groups:["degraded","anticipatory"]},
    sm_cv:{x:665,y:395,r:11,short:"CV",lines:[],groups:["degraded","anticipatory"]},

    sm_topic:{x:535,y:105,r:11,short:"TOPIC",lines:[],groups:["degraded","anticipatory"]},
    sm_content:{x:535,y:190,r:11,short:"CONTENT",lines:[],groups:["degraded","anticipatory"]},

    sm_embeddings:{x:750,y:105,r:11,short:"EMBED",lines:[],groups:["degraded","anticipatory"]},
    sm_transformers:{x:750,y:190,r:11,short:"TRANSF",lines:[],groups:["degraded","anticipatory"]},

    sm_arima:{x:460,y:590,r:11,short:"ARIMA",lines:[],groups:["anticipatory"]},
    sm_statespace:{x:560,y:590,r:11,short:"STATE",lines:[],groups:["anticipatory"]},

    sm_moran:{x:295,y:615,r:11,short:"MORAN I",lines:[],groups:["anticipatory"]},
    sm_kriging:{x:355,y:615,r:11,short:"KRIG",lines:[],groups:["anticipatory"]}
  });

  EDGES.push(
    {a:"unsupervised",b:"sm_kmeans",type:"specific-method"},
    {a:"unsupervised",b:"sm_gmm",type:"specific-method"},
    {a:"clustering",b:"sm_dbscan",type:"specific-method"},
    {a:"clustering",b:"sm_hdbscan",type:"specific-method"},
    {a:"dimension",b:"sm_pca",type:"specific-method"},
    {a:"dimension",b:"sm_umap",type:"specific-method"},
    {a:"networks",b:"sm_louvain",type:"specific-method"},
    {a:"networks",b:"sm_centrality",type:"specific-method"},
    {a:"longitudinal",b:"sm_panel",type:"specific-method"},
    {a:"longitudinal",b:"sm_changepoint",type:"specific-method"},
    {a:"multilevel",b:"sm_reml",type:"specific-method"},
    {a:"multilevel",b:"sm_icc",type:"specific-method"},
    {a:"missing",b:"sm_mice",type:"specific-method"},
    {a:"missing",b:"sm_fiml",type:"specific-method"},
    {a:"bayesian",b:"sm_mcmc",type:"specific-method"},
    {a:"bayesian",b:"sm_hmc",type:"specific-method"},
    {a:"validation",b:"sm_bootstrap",type:"specific-method"},
    {a:"validation",b:"sm_cv",type:"specific-method"},
    {a:"nlp",b:"sm_topic",type:"specific-method"},
    {a:"nlp",b:"sm_content",type:"specific-method"},
    {a:"naturallanguage",b:"sm_embeddings",type:"specific-method"},
    {a:"naturallanguage",b:"sm_transformers",type:"specific-method"},
    {a:"spatial",b:"sm_moran",type:"specific-method"},
    {a:"spatial",b:"sm_kriging",type:"specific-method"},
    {a:"forecasting",b:"sm_arima",type:"specific-method"},
    {a:"forecasting",b:"sm_statespace",type:"specific-method"}
  );
})();