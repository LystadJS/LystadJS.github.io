/* Interactive R examples; the examples are templates, not automatic analyses. */
(() => {
  const codeLibrary = {
    pca: {
      label: "PCA",
      file: "pca.R",
      status: "R | Principal Component Analysis",
      code: `library(tidyverse)

set.seed(1501211)

# ---------------------------------------------------------------------------
# 1. PREPARE FEATURE MATRIX:
pca_data_complete <- data |>
  drop_na(where(is.numeric))

x <- pca_data_complete |>
  select(where(is.numeric))

# ---------------------------------------------------------------------------
# 2. FIT PCA:
pca_fit <- prcomp(
  x,
  center = TRUE,   # Center each variable around its mean
  scale. = TRUE,   # Standardize variables to unit variance
  rank. = NULL     # Retain all available principal components
)

# ---------------------------------------------------------------------------
# 3. EXTRACT PRINCIPAL COMPONENT COORDINATES:
pca_coords <- as_tibble(pca_fit$x[, 1:2]) |>
  setNames(c("PC1", "PC2"))

# ---------------------------------------------------------------------------
# 4. ATTACH COORDINATES TO ORIGINAL DATA:
pca_data <- pca_data_complete |>
  bind_cols(pca_coords)

# ---------------------------------------------------------------------------
# 5. CALCULATE VARIANCE EXPLAINED:
variance_explained <- pca_fit$sdev^2 / sum(pca_fit$sdev^2)

variance_table <- tibble(
  component = paste0("PC", seq_along(variance_explained)),
  variance_explained = variance_explained,
  cumulative_variance = cumsum(variance_explained)
)

# ---------------------------------------------------------------------------
# 6. EXTRACT VARIABLE LOADINGS:
pca_loadings <- as_tibble(
  pca_fit$rotation,
  rownames = "variable"
)

# ---------------------------------------------------------------------------
# 7. VISUALIZATION:
ggplot(pca_data, aes(x = PC1, y = PC2)) +
  geom_point(alpha = 0.70, size = 2) +
  coord_equal() +
  labs(
    x = paste0(
      "PC1 (",
      scales::percent(variance_explained[1], accuracy = 0.1),
      ")"
    ),
    y = paste0(
      "PC2 (",
      scales::percent(variance_explained[2], accuracy = 0.1),
      ")"
    )
  ) +
  theme_minimal()

# ---------------------------------------------------------------------------
# 8. PROJECT NEW OBSERVATIONS:
new_x <- new_data |>
  select(all_of(colnames(x)))

new_coords <- predict(
  pca_fit,
  newdata = new_x
) |>
  as_tibble() |>
  select(PC1, PC2)
`
    },

    umap: {
      label: "UMAP",
      file: "umap.R",
      status: "R | Uniform Manifold Approximation and Projection",
      code: `library(tidyverse)
library(uwot)

set.seed(1501211)

# ---------------------------------------------------------------------------
# 1. PREPARE FEATURE MATRIX:
x <- data |>
  select(where(is.numeric)) |>
  drop_na() |>
  scale()

# ---------------------------------------------------------------------------
# 2. FIT UMAP:
umap_fit <- umap(
  x,
  n_neighbors = 15,     # Size of the local neighborhood
  n_components = 2,     # Number of embedding dimensions
  metric = "euclidean", # Distance metric in the original feature space
  min_dist = 0.10,      # Minimum spacing between embedded observations
  spread = 1,           # Overall scale of the embedding
  init = "spectral",    # Starting configuration
  n_epochs = 500,       # Number of optimization iterations
  learning_rate = 1,    # Optimization step size
  ret_model = TRUE,     # Retain fitted model for later projection
  verbose = FALSE
)

# ---------------------------------------------------------------------------
# 3. EXTRACT UMAP COORDINATES:
umap_coords <- as_tibble(umap_fit$embedding) |>
  setNames(c("UMAP1", "UMAP2"))

# ---------------------------------------------------------------------------
# 4. ATTACH COORDINATES TO ORIGINAL DATA:
umap_data <- data |>
  drop_na() |>
  bind_cols(umap_coords)

# ---------------------------------------------------------------------------
# 5. VISUALIZATION:
ggplot(umap_data, aes(x = UMAP1, y = UMAP2)) +
  geom_point(alpha = 0.70, size = 2) +
  coord_equal() +
  labs(
    x = "UMAP 1",
    y = "UMAP 2"
  ) +
  theme_minimal()

# ---------------------------------------------------------------------------
# 6. PROJECT NEW OBSERVATIONS:
new_x <- new_data |>
  select(where(is.numeric)) |>
  scale(
    center = attr(x, "scaled:center"),
    scale = attr(x, "scaled:scale")
  )

new_coords <- umap_transform(
  new_x,
  umap_fit
) |>
  as_tibble() |>
  setNames(c("UMAP1", "UMAP2"))
`
    },

    multilevel: {
      label: "Multilevel Models",
      file: "multilevel.R",
      status: "R / hierarchical modeling",
      code: `# Random-intercept multilevel model
library(tidyverse)
library(lme4)

model_data <- data |>
  drop_na(outcome, predictor, group_id)

fit <- lmer(
  outcome ~ predictor + (1 | group_id),
  data = model_data,
  REML = TRUE
)

summary(fit)

# Variance components / ICC
vc <- as.data.frame(VarCorr(fit))
icc <- vc$vcov[1] / sum(vc$vcov)
icc
`
    },

    kmeans: {
      label: "K-Means",
      file: "kmeans.R",
      status: "R | K-Means Clustering",
      code: `library(tidyverse)
library(cluster)

set.seed(1501211)

# ------------------------------------------------------------------------------------------
# 1. PREPARE FEATURE MATRIX:
cluster_data_complete <- data |>
  drop_na(where(is.numeric))

x <- cluster_data_complete |>
  select(where(is.numeric)) |>
  scale()

# ------------------------------------------------------------------------------------------
# 2. SELECT NUMBER OF CLUSTERS:
k_values <- 2:10

k_results <- map_dfr(
  k_values,
  ~ {
    fit <- kmeans(
      x,
      centers = .x,
      nstart = 50,
      iter.max = 100
    )

    tibble(
      k = .x,
      total_within_ss = fit$tot.withinss,
      silhouette = mean(
        silhouette(fit$cluster, dist(x))[, "sil_width"]
      )
    )
  }
)

# ------------------------------------------------------------------------------------------
# 3. FIT K-MEANS:
k <- 3                          # Selected number of clusters

kmeans_fit <- kmeans(
  x,
  centers = k,                  # Number of clusters
  nstart = 50,                  # Random initializations
  iter.max = 100,               # Maximum iterations
  algorithm = "Hartigan-Wong"   # K-means optimization algorithm
)

# ------------------------------------------------------------------------------------------
# 4. EXTRACT CLUSTER ASSIGNMENTS:
clusters <- factor(
  kmeans_fit$cluster
)

cluster_centers <- as_tibble(
  kmeans_fit$centers,
  rownames = "cluster"
)

# ------------------------------------------------------------------------------------------
# 5. ATTACH CLUSTERS TO ORIGINAL DATA:
kmeans_data <- cluster_data_complete |>
  mutate(
    cluster = clusters
  )

# ------------------------------------------------------------------------------------------
# 6. REDUCE TO TWO DIMENSIONS FOR VISUALIZATION:
pca_fit <- prcomp(
  x,
  center = FALSE,
  scale. = FALSE
)

cluster_coords <- as_tibble(
  pca_fit$x[, 1:2]
) |>
  setNames(c("PC1", "PC2")) |>
  mutate(
    cluster = clusters
  )

# ------------------------------------------------------------------------------------------
# 7. VISUALIZATION:
ggplot(
  cluster_coords,
  aes(
    x = PC1,
    y = PC2,
    color = cluster
  )
) +
  geom_point(
    alpha = 0.70,
    size = 2
  ) +
  stat_ellipse(
    linewidth = 0.7,
    show.legend = FALSE
  ) +
  coord_equal() +
  labs(
    x = "PC1",
    y = "PC2",
    color = "Cluster"
  ) +
  theme_minimal()

# ------------------------------------------------------------------------------------------
# 8. EVALUATE CLUSTER QUALITY:
silhouette_scores <- silhouette(
  kmeans_fit$cluster,
  dist(x)
)

mean_silhouette <- mean(
  silhouette_scores[, "sil_width"]
)
`
    },

    expectationMaximization: {
      label: "Expectation-Maximization",
      file: "expectation_maximization.R",
      status: "R | Expectation-Maximization for Gaussian Mixture Models",
      code: `library(tidyverse)
library(mclust)

set.seed(1501211)

# ------------------------------------------------------------------------------------------
# 1. PREPARE FEATURE MATRIX:
cluster_data_complete <- data |>
  drop_na(where(is.numeric))

x <- cluster_data_complete |>
  select(where(is.numeric)) |>
  scale()

# ------------------------------------------------------------------------------------------
# 2. SELECT NUMBER OF MIXTURE COMPONENTS:
gmm_selection <- Mclust(
  x,
  G = 1:10                    # Candidate numbers of mixture components
)

best_g <- gmm_selection$G      # BIC-selected number of components

# ------------------------------------------------------------------------------------------
# 3. FIT GAUSSIAN MIXTURE MODEL WITH EM:
em_fit <- Mclust(
  x,
  G = best_g                   # Number of Gaussian mixture components
)

# ------------------------------------------------------------------------------------------
# 4. EXTRACT CLUSTER ASSIGNMENTS:
clusters <- factor(
  em_fit$classification
)

# ------------------------------------------------------------------------------------------
# 5. EXTRACT POSTERIOR MEMBERSHIP PROBABILITIES:
membership <- as_tibble(
  em_fit$z
) |>
  setNames(
    paste0("cluster_", seq_len(best_g))
  )

max_membership <- apply(
  em_fit$z,
  1,
  max
)

# ------------------------------------------------------------------------------------------
# 6. EXTRACT CLASSIFICATION UNCERTAINTY:
uncertainty <- em_fit$uncertainty

# ------------------------------------------------------------------------------------------
# 7. ATTACH RESULTS TO ORIGINAL DATA:
em_data <- cluster_data_complete |>
  mutate(
    cluster = clusters,
    membership = max_membership,
    uncertainty = uncertainty
  ) |>
  bind_cols(
    membership
  )

# ------------------------------------------------------------------------------------------
# 8. EXTRACT MIXTURE MODEL PARAMETERS:
mixing_proportions <- em_fit$parameters$pro

cluster_means <- em_fit$parameters$mean

cluster_variance <- em_fit$parameters$variance

# ------------------------------------------------------------------------------------------
# 9. IDENTIFY UNCERTAIN OBSERVATIONS:
uncertain_cases <- em_data |>
  arrange(
    desc(uncertainty)
  )

# ------------------------------------------------------------------------------------------
# 10. REDUCE TO TWO DIMENSIONS FOR VISUALIZATION:
pca_fit <- prcomp(
  x,
  center = FALSE,
  scale. = FALSE
)

cluster_coords <- as_tibble(
  pca_fit$x[, 1:2]
) |>
  setNames(c("PC1", "PC2")) |>
  mutate(
    cluster = clusters,
    membership = max_membership
  )

# ------------------------------------------------------------------------------------------
# 11. VISUALIZE MIXTURE COMPONENTS:
ggplot(
  cluster_coords,
  aes(
    x = PC1,
    y = PC2,
    color = cluster,
    alpha = membership
  )
) +
  geom_point(
    size = 2
  ) +
  stat_ellipse(
    linewidth = 0.7,
    show.legend = FALSE
  ) +
  scale_alpha(
    range = c(0.25, 1)
  ) +
  coord_equal() +
  labs(
    x = "PC1",
    y = "PC2",
    color = "Component",
    alpha = "Membership"
  ) +
  theme_minimal()

# ------------------------------------------------------------------------------------------
# 12. INSPECT MODEL FIT:
em_fit$bic                       # Bayesian Information Criterion

em_fit$loglik                    # Maximized log-likelihood

summary(
  em_fit
)
`
    },

    dbscan: {
      label: "DBSCAN",
      file: "dbscan.R",
      status: "R | Density-Based Spatial Clustering",
      code: `library(tidyverse)
library(dbscan)

set.seed(1501211)

# ------------------------------------------------------------------------------------------
# 1. PREPARE FEATURE MATRIX:
cluster_data_complete <- data |>
  drop_na(where(is.numeric))

x <- cluster_data_complete |>
  select(where(is.numeric)) |>
  scale()

# ------------------------------------------------------------------------------------------
# 2. CHOOSE MINIMUM POINTS:
min_pts <- 5                     # Minimum points required for a dense region

# ------------------------------------------------------------------------------------------
# 3. INSPECT K-NEAREST-NEIGHBOR DISTANCES:
kNNdistplot(
  x,
  k = min_pts
)

abline(
  h = 0.5,                       # Candidate epsilon threshold
  lty = 2
)

# ------------------------------------------------------------------------------------------
# 4. FIT DBSCAN:
eps <- 0.5                       # Maximum neighborhood radius

dbscan_fit <- dbscan(
  x,
  eps = eps,
  minPts = min_pts,
  borderPoints = TRUE
)

# ------------------------------------------------------------------------------------------
# 5. EXTRACT CLUSTER ASSIGNMENTS:
cluster_id <- dbscan_fit$cluster

clusters <- if_else(
  cluster_id == 0,
  "Noise",                       # DBSCAN labels noise observations as 0
  paste0("Cluster ", cluster_id)
) |>
  factor()

# ------------------------------------------------------------------------------------------
# 6. ATTACH CLUSTERS TO ORIGINAL DATA:
dbscan_data <- cluster_data_complete |>
  mutate(
    cluster = clusters
  )

# ------------------------------------------------------------------------------------------
# 7. SUMMARIZE CLUSTERS:
cluster_summary <- dbscan_data |>
  count(
    cluster,
    name = "n"
  ) |>
  mutate(
    proportion = n / sum(n)
  )

# ------------------------------------------------------------------------------------------
# 8. REDUCE TO TWO DIMENSIONS FOR VISUALIZATION:
pca_fit <- prcomp(
  x,
  center = FALSE,
  scale. = FALSE
)

cluster_coords <- as_tibble(
  pca_fit$x[, 1:2]
) |>
  setNames(c("PC1", "PC2")) |>
  mutate(
    cluster = clusters
  )

# ------------------------------------------------------------------------------------------
# 9. VISUALIZE CLUSTERS:
ggplot(
  cluster_coords,
  aes(
    x = PC1,
    y = PC2,
    color = cluster
  )
) +
  geom_point(
    alpha = 0.70,
    size = 2
  ) +
  coord_equal() +
  labs(
    x = "PC1",
    y = "PC2",
    color = "Cluster"
  ) +
  theme_minimal()

# ------------------------------------------------------------------------------------------
# 10. EXTRACT NOISE OBSERVATIONS:
noise_data <- dbscan_data |>
  filter(
    cluster == "Noise"
  )
`
    },

    hdbscan: {
      label: "HDBSCAN",
      file: "hdbscan.R",
      status: "R | Hierarchical Density-Based Spatial Clustering",
      code: `library(tidyverse)
library(dbscan)

set.seed(1501211)

# ------------------------------------------------------------------------------------------
# 1. PREPARE FEATURE MATRIX:
cluster_data_complete <- data |>
  drop_na(where(is.numeric))

x <- cluster_data_complete |>
  select(where(is.numeric)) |>
  scale()

# ------------------------------------------------------------------------------------------
# 2. DEFINE MINIMUM CLUSTER DENSITY:
min_pts <- 5                     # Minimum points used to define dense regions

# ------------------------------------------------------------------------------------------
# 3. FIT HDBSCAN:
hdbscan_fit <- hdbscan(
  x,
  minPts = min_pts
)

# ------------------------------------------------------------------------------------------
# 4. EXTRACT CLUSTER ASSIGNMENTS:
cluster_id <- hdbscan_fit$cluster

clusters <- if_else(
  cluster_id == 0,
  "Noise",                       # HDBSCAN labels noise observations as 0
  paste0("Cluster ", cluster_id)
) |>
  factor()

# ------------------------------------------------------------------------------------------
# 5. EXTRACT MEMBERSHIP STRENGTH:
membership_probability <- hdbscan_fit$membership_prob

outlier_score <- hdbscan_fit$outlier_scores

# ------------------------------------------------------------------------------------------
# 6. ATTACH RESULTS TO ORIGINAL DATA:
hdbscan_data <- cluster_data_complete |>
  mutate(
    cluster = clusters,
    membership_probability = membership_probability,
    outlier_score = outlier_score
  )

# ------------------------------------------------------------------------------------------
# 7. SUMMARIZE CLUSTERS:
cluster_summary <- hdbscan_data |>
  group_by(
    cluster
  ) |>
  summarise(
    n = n(),
    mean_membership = mean(membership_probability),
    mean_outlier_score = mean(outlier_score),
    .groups = "drop"
  )

# ------------------------------------------------------------------------------------------
# 8. REDUCE TO TWO DIMENSIONS FOR VISUALIZATION:
pca_fit <- prcomp(
  x,
  center = FALSE,
  scale. = FALSE
)

cluster_coords <- as_tibble(
  pca_fit$x[, 1:2]
) |>
  setNames(c("PC1", "PC2")) |>
  mutate(
    cluster = clusters,
    membership_probability = membership_probability
  )

# ------------------------------------------------------------------------------------------
# 9. VISUALIZE CLUSTERS:
ggplot(
  cluster_coords,
  aes(
    x = PC1,
    y = PC2,
    color = cluster,
    alpha = membership_probability
  )
) +
  geom_point(
    size = 2
  ) +
  scale_alpha(
    range = c(0.25, 1)
  ) +
  coord_equal() +
  labs(
    x = "PC1",
    y = "PC2",
    color = "Cluster",
    alpha = "Membership"
  ) +
  theme_minimal()

# ------------------------------------------------------------------------------------------
# 10. IDENTIFY POTENTIAL OUTLIERS:
potential_outliers <- hdbscan_data |>
  arrange(
    desc(outlier_score)
  )
`
    },

    hard: {
      label: "Hard Clustering",
      file: "hard_clustering.R",
      status: "R | Hard Partition Clustering",
      code: `library(tidyverse)
library(cluster)

set.seed(1501211)

# ------------------------------------------------------------------------------------------
# 1. PREPARE FEATURE MATRIX:
cluster_data_complete <- data |>
  drop_na(where(is.numeric))

x <- cluster_data_complete |>
  select(where(is.numeric)) |>
  scale()

# ------------------------------------------------------------------------------------------
# 2. DEFINE NUMBER OF CLUSTERS:
k <- 3                           # Each observation will belong to one cluster

# ------------------------------------------------------------------------------------------
# 3. FIT HARD CLUSTERING:
hard_fit <- kmeans(
  x,
  centers = k,
  nstart = 50,                   # Random initializations
  iter.max = 100,                # Maximum optimization iterations
  algorithm = "Hartigan-Wong"
)

# ------------------------------------------------------------------------------------------
# 4. EXTRACT HARD CLUSTER ASSIGNMENTS:
clusters <- factor(
  hard_fit$cluster
)

# ------------------------------------------------------------------------------------------
# 5. CREATE MEMBERSHIP INDICATORS:
hard_membership <- model.matrix(
  ~ clusters - 1
) |>
  as_tibble()

names(hard_membership) <- paste0(
  "cluster_",
  seq_len(k)
)

# ------------------------------------------------------------------------------------------
# 6. ATTACH RESULTS TO ORIGINAL DATA:
hard_data <- cluster_data_complete |>
  mutate(
    cluster = clusters
  ) |>
  bind_cols(
    hard_membership
  )

# ------------------------------------------------------------------------------------------
# 7. EXTRACT CLUSTER CENTERS:
cluster_centers <- as_tibble(
  hard_fit$centers,
  rownames = "cluster"
)

# ------------------------------------------------------------------------------------------
# 8. CALCULATE CLUSTER QUALITY:
silhouette_scores <- silhouette(
  hard_fit$cluster,
  dist(x)
)

mean_silhouette <- mean(
  silhouette_scores[, "sil_width"]
)

# ------------------------------------------------------------------------------------------
# 9. REDUCE TO TWO DIMENSIONS FOR VISUALIZATION:
pca_fit <- prcomp(
  x,
  center = FALSE,
  scale. = FALSE
)

cluster_coords <- as_tibble(
  pca_fit$x[, 1:2]
) |>
  setNames(c("PC1", "PC2")) |>
  mutate(
    cluster = clusters
  )

# ------------------------------------------------------------------------------------------
# 10. VISUALIZE HARD CLUSTERS:
ggplot(
  cluster_coords,
  aes(
    x = PC1,
    y = PC2,
    color = cluster
  )
) +
  geom_point(
    alpha = 0.70,
    size = 2
  ) +
  stat_ellipse(
    linewidth = 0.7,
    show.legend = FALSE
  ) +
  coord_equal() +
  labs(
    x = "PC1",
    y = "PC2",
    color = "Cluster"
  ) +
  theme_minimal()
`
    },

    fuzzy: {
      label: "Fuzzy",
      file: "fuzzy_clustering.R",
      status: "R | Fuzzy C-Means Clustering",
      code: `library(tidyverse)
library(e1071)

set.seed(1501211)

# ------------------------------------------------------------------------------------------
# 1. PREPARE FEATURE MATRIX:
cluster_data_complete <- data |>
  drop_na(where(is.numeric))

x <- cluster_data_complete |>
  select(where(is.numeric)) |>
  scale()

# ------------------------------------------------------------------------------------------
# 2. DEFINE CLUSTER PARAMETERS:
k <- 3                           # Number of clusters
fuzziness <- 2                   # Controls degree of fuzzy membership

# ------------------------------------------------------------------------------------------
# 3. FIT FUZZY C-MEANS:
fuzzy_fit <- cmeans(
  x,
  centers = k,
  m = fuzziness,                 # Fuzziness parameter
  iter.max = 100,                # Maximum optimization iterations
  dist = "euclidean",            # Distance metric
  method = "cmeans"
)

# ------------------------------------------------------------------------------------------
# 4. EXTRACT MEMBERSHIP PROBABILITIES:
membership <- as_tibble(
  fuzzy_fit$membership
) |>
  setNames(
    paste0("cluster_", seq_len(k))
  )

# ------------------------------------------------------------------------------------------
# 5. EXTRACT PRIMARY CLUSTER ASSIGNMENTS:
clusters <- factor(
  fuzzy_fit$cluster
)

max_membership <- apply(
  fuzzy_fit$membership,
  1,
  max
)

# ------------------------------------------------------------------------------------------
# 6. ATTACH RESULTS TO ORIGINAL DATA:
fuzzy_data <- cluster_data_complete |>
  mutate(
    cluster = clusters,
    max_membership = max_membership
  ) |>
  bind_cols(
    membership
  )

# ------------------------------------------------------------------------------------------
# 7. EXTRACT CLUSTER CENTERS:
cluster_centers <- as_tibble(
  fuzzy_fit$centers,
  rownames = "cluster"
)

# ------------------------------------------------------------------------------------------
# 8. IDENTIFY AMBIGUOUS OBSERVATIONS:
ambiguous_cases <- fuzzy_data |>
  arrange(
    max_membership
  )

# ------------------------------------------------------------------------------------------
# 9. REDUCE TO TWO DIMENSIONS FOR VISUALIZATION:
pca_fit <- prcomp(
  x,
  center = FALSE,
  scale. = FALSE
)

cluster_coords <- as_tibble(
  pca_fit$x[, 1:2]
) |>
  setNames(c("PC1", "PC2")) |>
  mutate(
    cluster = clusters,
    membership = max_membership
  )

# ------------------------------------------------------------------------------------------
# 10. VISUALIZE FUZZY CLUSTERS:
ggplot(
  cluster_coords,
  aes(
    x = PC1,
    y = PC2,
    color = cluster,
    alpha = membership
  )
) +
  geom_point(
    size = 2
  ) +
  scale_alpha(
    range = c(0.25, 1)
  ) +
  coord_equal() +
  labs(
    x = "PC1",
    y = "PC2",
    color = "Cluster",
    alpha = "Membership"
  ) +
  theme_minimal()
`
    },

    hierarchical: {
      label: "Hierarchical",
      file: "hierarchical.R",
      status: "R | Hierarchical Clustering",
      code: `library(tidyverse)
library(cluster)

# ------------------------------------------------------------------------------------------
# 1. PREPARE FEATURE MATRIX:
cluster_data_complete <- data |>
  drop_na(where(is.numeric))

x <- cluster_data_complete |>
  select(where(is.numeric)) |>
  scale()

# ------------------------------------------------------------------------------------------
# 2. CALCULATE DISTANCE MATRIX:
distance_matrix <- dist(
  x,
  method = "euclidean"          # Pairwise distance between observations
)

# ------------------------------------------------------------------------------------------
# 3. FIT HIERARCHICAL CLUSTERING:
hierarchical_fit <- hclust(
  distance_matrix,
  method = "ward.D2"            # Minimize within-cluster variance
)

# ------------------------------------------------------------------------------------------
# 4. VISUALIZE DENDROGRAM:
plot(
  hierarchical_fit,
  labels = FALSE,
  hang = -1,
  main = NULL,
  xlab = NULL,
  sub = NULL,
  ylab = "Height"
)

# ------------------------------------------------------------------------------------------
# 5. CUT DENDROGRAM INTO CLUSTERS:
k <- 3                          # Selected number of clusters

clusters <- cutree(
  hierarchical_fit,
  k = k
) |>
  factor()

# ------------------------------------------------------------------------------------------
# 6. ATTACH CLUSTERS TO ORIGINAL DATA:
hierarchical_data <- cluster_data_complete |>
  mutate(
    cluster = clusters
  )

# ------------------------------------------------------------------------------------------
# 7. REDUCE TO TWO DIMENSIONS FOR VISUALIZATION:
pca_fit <- prcomp(
  x,
  center = FALSE,
  scale. = FALSE
)

cluster_coords <- as_tibble(
  pca_fit$x[, 1:2]
) |>
  setNames(c("PC1", "PC2")) |>
  mutate(
    cluster = clusters
  )

# ------------------------------------------------------------------------------------------
# 8. VISUALIZE CLUSTERS:
ggplot(
  cluster_coords,
  aes(
    x = PC1,
    y = PC2,
    color = cluster
  )
) +
  geom_point(
    alpha = 0.70,
    size = 2
  ) +
  stat_ellipse(
    linewidth = 0.7,
    show.legend = FALSE
  ) +
  coord_equal() +
  labs(
    x = "PC1",
    y = "PC2",
    color = "Cluster"
  ) +
  theme_minimal()

# ------------------------------------------------------------------------------------------
# 9. EVALUATE CLUSTER QUALITY:
silhouette_scores <- silhouette(
  as.integer(clusters),
  distance_matrix
)

mean_silhouette <- mean(
  silhouette_scores[, "sil_width"]
)
`
    },

mice: {
      label: "MICE",
      file: "mice.R",
      status: "R | Multiple Imputation by Chained Equations",
      code: `library(tidyverse)
library(mice)

set.seed(1501211)

# ------------------------------------------------------------------------------------------
# 1. INSPECT MISSING DATA:
md.pattern(data)

missing_summary <- data |>
  summarise(
    across(
      everything(),
      ~ mean(is.na(.x))
    )
  ) |>
  pivot_longer(
    everything(),
    names_to = "variable",
    values_to = "missing_rate"
  )

# ------------------------------------------------------------------------------------------
# 2. INITIALIZE IMPUTATION SETTINGS:
mice_init <- mice(
  data,
  maxit = 0,
  printFlag = FALSE
)

methods <- mice_init$method
predictor_matrix <- mice_init$predictorMatrix

# ------------------------------------------------------------------------------------------
# 3. DEFINE IMPUTATION METHODS:
methods <- make.method(data)

methods[sapply(data, is.numeric)] <- "pmm"       # Predictive mean matching
methods[sapply(data, is.logical)] <- "logreg"    # Binary logistic regression

factor_vars <- names(data)[sapply(data, is.factor)]

for (variable in factor_vars) {
  methods[variable] <- if (
    nlevels(data[[variable]]) == 2
  ) "logreg" else "polyreg"
}

methods[colSums(is.na(data)) == 0] <- ""          # Do not impute complete variables

# ------------------------------------------------------------------------------------------
# 4. DEFINE PREDICTOR MATRIX:
predictor_matrix <- make.predictorMatrix(data)

diag(predictor_matrix) <- 0                       # Variable cannot predict itself

# ------------------------------------------------------------------------------------------
# 5. RUN MULTIPLE IMPUTATION:
mice_fit <- mice(
  data,
  m = 20,                         # Number of imputed datasets
  maxit = 20,                     # Number of chained-equation iterations
  method = methods,
  predictorMatrix = predictor_matrix,
  seed = 1501211,
  printFlag = FALSE
)

# ------------------------------------------------------------------------------------------
# 6. CHECK IMPUTATION CONVERGENCE:
plot(mice_fit)

densityplot(
  mice_fit
)

stripplot(
  mice_fit,
  pch = 20,
  cex = 0.6
)

# ------------------------------------------------------------------------------------------
# 7. EXTRACT COMPLETED DATASETS:
completed_data <- complete(
  mice_fit,
  action = "all"
)

completed_long <- complete(
  mice_fit,
  action = "long",
  include = TRUE
)

# ------------------------------------------------------------------------------------------
# 8. EXTRACT A SINGLE IMPUTED DATASET:
data_imputed <- complete(
  mice_fit,
  action = 1
)
`
    },


    ggplot: {
      label: "ggplot2",
      file: "publication-plot.R",
      status: "R / publication visualization",
      code: `# Publication-ready visualization
library(tidyverse)

plot_data <- data |>
  drop_na(x, y, group)

ggplot(
  plot_data,
  aes(x = x, y = y, group = group)
) +
  geom_line(linewidth = 0.7) +
  geom_point(size = 1.8) +
  labs(
    x = "X",
    y = "Y",
    caption = "Source: analytical dataset"
  ) +
  theme_minimal(base_size = 11) +
  theme(
    panel.grid.minor = element_blank(),
    plot.title.position = "plot"
  )
`
    },

    network: {
      label: "Network Graphs",
      file: "network-graph.R",
      status: "R / relational visualization",
      code: `# Network visualization
library(tidyverse)
library(igraph)
library(ggraph)

graph <- graph_from_data_frame(
  d = edges,
  vertices = nodes,
  directed = FALSE
)

ggraph(graph, layout = "fr") +
  geom_edge_link(alpha = 0.30) +
  geom_node_point(aes(size = centrality)) +
  geom_node_text(
    aes(label = name),
    repel = TRUE
  ) +
  theme_graph()
`
    },

    diagnostics: {
      label: "Data Diagnostics",
      file: "diagnostics.R",
      status: "R / validation and QA",
      code: `# Compact data-quality audit
library(tidyverse)

audit <- tibble(
  variable = names(data),
  type = map_chr(data, ~ class(.x)[1]),
  missing_n = map_int(data, ~ sum(is.na(.x))),
  missing_pct = map_dbl(data, ~ mean(is.na(.x))),
  unique_n = map_int(data, n_distinct)
)

duplicate_rows <- data |>
  duplicated() |>
  sum()

audit |>
  arrange(desc(missing_pct))

duplicate_rows
`
    }
  };

  const fileEl = document.getElementById("terminal-file");
  const statusEl = document.getElementById("terminal-status");
  const commandEl = document.getElementById("terminal-command");
  const codeEl = document.getElementById("terminal-code");
  const readyEl = document.getElementById("terminal-ready");
  const buttons = document.querySelectorAll("[data-code-snippet]");

  if (!fileEl || !statusEl || !commandEl || !codeEl || !readyEl || !buttons.length) {
    return;
  }

  const loadSnippet = (key) => {
    const snippet = codeLibrary[key];
    if (!snippet) return;

    fileEl.textContent = snippet.file;
    statusEl.textContent = snippet.status;
    commandEl.textContent = `cat ${snippet.file}`;
    codeEl.textContent = snippet.code.trim();
    readyEl.textContent = `$${snippet.label} >`;

    buttons.forEach((button) => {
      const isActive = button.dataset.codeSnippet === key;
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      loadSnippet(button.dataset.codeSnippet);
    });
  });

  loadSnippet("pca");
})();
