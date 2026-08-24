---
tags:
  - beginner
  - foundations
---

# Model Evaluation Metrics

*Written: 2026-08-23*

## Why Metrics Matter

Choosing the wrong metric can lead to a model that looks great on paper but fails in production. The metric must align with the business objective.

| Business goal | Wrong metric | Right metric |
|--------------|-------------|-------------|
| Detect fraud (rare events) | Accuracy (99% by predicting "no fraud") | Precision-Recall, AUPRC |
| Medical screening | Precision (misses patients) | Recall (catch all cases) |
| Ranking search results | Accuracy | NDCG, MAP |
| Predicting house prices | MAE (if outliers matter less) | RMSE or MAPE depending on use |
| Balanced classification | Accuracy (misleading if imbalanced) | Macro-F1, Cohen's Kappa |

---

## Classification Metrics

### Confusion Matrix

```
                    Predicted
                 Positive  Negative
Actual  Positive    TP        FN
        Negative    FP        TN

TP = True Positive  (correctly predicted positive)
FP = False Positive (incorrectly predicted positive — Type I error)
FN = False Negative (incorrectly predicted negative — Type II error)
TN = True Negative  (correctly predicted negative)
```

### Core Metrics

| Metric | Formula | Answers |
|--------|---------|---------|
| Accuracy | (TP+TN) / (TP+TN+FP+FN) | Overall correctness |
| Precision | TP / (TP+FP) | Of predicted positives, how many are correct? |
| Recall (Sensitivity) | TP / (TP+FN) | Of actual positives, how many did we find? |
| Specificity | TN / (TN+FP) | Of actual negatives, how many did we identify? |
| F1 Score | 2·P·R / (P+R) | Harmonic mean of precision & recall |
| Fβ Score | (1+β²)·P·R / (β²·P + R) | Weighted balance (β>1 favors recall) |

### When to Prioritize What

| Scenario | Prioritize | Why |
|----------|-----------|-----|
| Spam filter | Precision | Don't lose important emails (FP costly) |
| Cancer screening | Recall | Don't miss patients (FN costly) |
| Balanced importance | F1 | Equal cost for FP and FN |
| Search ranking | Precision@K | Top results must be relevant |
| Fraud detection | Recall + AUPRC | Catch fraud, tolerate some alerts |

### Multi-Class Averaging

| Averaging | Method | Use when |
|-----------|--------|----------|
| Micro | Pool all TP/FP/FN globally | Class imbalance, overall performance |
| Macro | Average metric per class (unweighted) | All classes equally important |
| Weighted | Average metric per class (weighted by support) | Account for class sizes |
| Samples | Average per sample (multi-label) | Multi-label classification |

**Example:**

```
Class A: Precision=0.90, Support=900
Class B: Precision=0.60, Support=100

Macro Precision:    (0.90 + 0.60) / 2 = 0.75
Weighted Precision: (0.90×900 + 0.60×100) / 1000 = 0.87
```

---

## Threshold-Independent Metrics

### ROC Curve & AUC

**ROC (Receiver Operating Characteristic):** Plot TPR vs FPR at all thresholds.

```
TPR (True Positive Rate)  = Recall = TP / (TP+FN)     (y-axis)
FPR (False Positive Rate) = FP / (FP+TN)              (x-axis)

AUC = Area Under ROC Curve
    = 0.5 → random classifier
    = 1.0 → perfect classifier
    = Probability that model ranks a random positive higher than a random negative
```

**When to use ROC-AUC:**
- Balanced datasets
- Equal cost of FP and FN
- Need threshold-independent comparison

**When NOT to use ROC-AUC:**
- Highly imbalanced data (FPR stays low even with many FP because TN dominates)
- When you care more about precision than overall discrimination

### Precision-Recall Curve & AUPRC

```
Precision (y-axis) vs Recall (x-axis) at all thresholds

AUPRC (Average Precision):
AP = Σ_n (R_n - R_{n-1}) · P_n
   ≈ Area under the PR curve
```

**When to use AUPRC:**
- Imbalanced datasets (positive class is rare)
- Cost of false positives and false negatives differ significantly
- Fraud, medical diagnosis, anomaly detection

### ROC-AUC vs AUPRC Comparison

| Aspect | ROC-AUC | AUPRC |
|--------|---------|-------|
| Baseline (random) | 0.5 | Proportion of positives (e.g., 0.01 for 1% positive) |
| Imbalanced data | Overly optimistic | More informative |
| Interpretation | Discrimination ability | Precision at various recall levels |
| Sensitive to FP | Less (denominator includes TN) | More (denominator is TP+FP only) |

---

## Regression Metrics

| Metric | Formula | Properties |
|--------|---------|------------|
| MAE | (1/n) Σ\|yᵢ - ŷᵢ\| | Robust to outliers, interpretable in original units |
| MSE | (1/n) Σ(yᵢ - ŷᵢ)² | Penalizes large errors more, differentiable |
| RMSE | √MSE | Same units as target, penalizes large errors |
| MAPE | (100/n) Σ\|yᵢ - ŷᵢ\|/\|yᵢ\| | Percentage error, undefined when y=0 |
| R² | 1 - SS_res/SS_tot | Proportion of variance explained (can be negative) |
| Adjusted R² | 1 - (1-R²)(n-1)/(n-d-1) | Penalizes additional features |
| Huber | L2 if \|e\| < δ, else L1 | Balanced outlier robustness |

### R² Interpretation

```
R² = 1 - Σ(yᵢ - ŷᵢ)² / Σ(yᵢ - ȳ)²

R² = 1.0  → perfect prediction
R² = 0.0  → model is as good as predicting the mean
R² < 0.0  → model is WORSE than predicting the mean (very bad)
```

### Choosing Regression Metrics

| Scenario | Metric | Reasoning |
|----------|--------|-----------|
| Outliers are noise (ignore them) | MAE | Not influenced by extreme values |
| Outliers are important (penalize) | RMSE | Quadratic penalty for large errors |
| Relative error matters | MAPE | 10% error on $100 ≈ 10% error on $1M |
| Comparing models | R² | Normalized, interpretable baseline |
| Business context: actual cost | Custom | Map prediction error to business cost |

---

## Ranking Metrics

### Precision@K and Recall@K

```
Precision@K = |relevant items in top K| / K
Recall@K    = |relevant items in top K| / |total relevant items|
```

### Mean Average Precision (MAP)

```
AP@K = (1/min(K, R)) · Σ_{k=1}^{K} Precision@k · rel(k)

MAP = mean(AP across all queries)

where rel(k) = 1 if item at rank k is relevant, else 0
```

### Normalized Discounted Cumulative Gain (NDCG)

```
DCG@K  = Σ_{k=1}^{K} (2^{rel_k} - 1) / log₂(k + 1)
IDCG@K = DCG of ideal ranking (sorted by relevance)
NDCG@K = DCG@K / IDCG@K

rel_k = relevance score of item at position k (can be graded: 0, 1, 2, 3)
```

**NDCG properties:**
- Handles graded relevance (not just binary)
- Position-aware (higher ranks matter more)
- Normalized to [0, 1] — comparable across queries
- Standard for search and recommendation systems

### Mean Reciprocal Rank (MRR)

```
RR = 1 / rank_of_first_relevant_result
MRR = mean(RR across all queries)
```

Used when only one correct answer exists (QA, entity linking).

### Ranking Metrics Comparison

| Metric | Binary relevance | Graded relevance | Position-weighted |
|--------|-----------------|------------------|-------------------|
| Precision@K | Yes | No | No (equal weight) |
| MAP | Yes | No | Yes (via cumulative) |
| NDCG | Yes | Yes | Yes (logarithmic) |
| MRR | Yes | No | Yes (first hit only) |

---

## Clustering Metrics

### External (ground truth available)

| Metric | Range | What it measures |
|--------|-------|-----------------|
| Adjusted Rand Index (ARI) | [-1, 1] | Agreement between cluster and truth |
| Normalized Mutual Information (NMI) | [0, 1] | Shared information |
| V-measure | [0, 1] | Harmonic mean of homogeneity and completeness |
| Fowlkes-Mallows (FMI) | [0, 1] | Geometric mean of precision and recall on pairs |

### Internal (no ground truth)

| Metric | Range | What it measures |
|--------|-------|-----------------|
| Silhouette Score | [-1, 1] | Cohesion vs separation |
| Calinski-Harabasz | [0, ∞) | Between-cluster / within-cluster variance ratio |
| Davies-Bouldin | [0, ∞) | Average similarity between clusters (lower = better) |
| Inertia (WCSS) | [0, ∞) | Sum of distances to cluster centers (lower = tighter) |

### Silhouette Score

```
For each sample i:
    a(i) = mean distance to other points in same cluster (cohesion)
    b(i) = mean distance to points in nearest other cluster (separation)
    s(i) = (b(i) - a(i)) / max(a(i), b(i))

Overall silhouette = mean(s(i) for all i)

s = +1: point well-clustered
s =  0: point on border between clusters
s = -1: point likely in wrong cluster
```

---

## Cross-Validation

### Strategies

| Method | Splits | Use case |
|--------|--------|----------|
| K-Fold | K train/val splits, each val = 1/K | Standard, most tasks |
| Stratified K-Fold | K-Fold preserving class proportions | Imbalanced classification |
| Leave-One-Out (LOO) | N splits, val = 1 sample each | Very small datasets |
| Repeated K-Fold | K-Fold repeated M times | More stable estimate |
| Time Series Split | Expanding window, no future leakage | Temporal data |
| Group K-Fold | All samples from same group in one fold | Grouped data (patients, users) |
| Nested CV | Outer CV for evaluation, inner for tuning | Unbiased estimate with tuning |

### Time Series Cross-Validation

```
Fold 1: Train [────────]  Val [──]
Fold 2: Train [──────────────]  Val [──]
Fold 3: Train [────────────────────]  Val [──]
Fold 4: Train [──────────────────────────]  Val [──]

Key: training always BEFORE validation (no future leakage)
```

### Nested Cross-Validation

```
Outer loop (evaluation — unbiased performance estimate):
    for each outer fold:
        Inner loop (tuning — find best hyperparameters):
            for each inner fold:
                train with candidate hyperparams
                evaluate on inner val
            select best hyperparams
        
        Train with best hyperparams on full outer train
        Evaluate on outer test → final performance estimate

Result: unbiased estimate of generalization performance
```

---

## Statistical Significance in Model Comparison

### Methods

| Method | Compares | Assumption |
|--------|----------|-----------|
| Paired t-test | Two models, K-fold results | Normal distribution of differences |
| Wilcoxon signed-rank | Two models | Non-parametric (no normality assumption) |
| McNemar's test | Two classifiers on same test set | Paired binary classification |
| Friedman test | Multiple models, multiple datasets | Non-parametric ANOVA |
| Bootstrap confidence interval | Any metric | No distributional assumption |

### Bootstrap Confidence Interval

```
for b in range(B):                          # B = 1000-10000
    sample = resample(test_predictions)     # sample with replacement
    metric_b = compute_metric(sample)

CI_lower = percentile(metrics, 2.5)
CI_upper = percentile(metrics, 97.5)

If CIs of two models don't overlap → statistically significant difference
```

---

## Calibration

### What Is Calibration?

A model is calibrated if when it predicts 70% probability, the event occurs ~70% of the time.

```
Perfectly calibrated:
    P(y=1 | predicted_prob = 0.7) = 0.7

Over-confident: model says 0.9, actual rate is 0.6
Under-confident: model says 0.5, actual rate is 0.8
```

### Calibration Metrics

| Metric | Method |
|--------|--------|
| Calibration curve | Bin predictions, plot mean predicted vs actual frequency |
| Expected Calibration Error (ECE) | Weighted average of bin-wise calibration error |
| Brier Score | MSE of probability predictions: (1/n) Σ(pᵢ - yᵢ)² |

### Calibration Methods

| Method | Approach | Preserves ranking? |
|--------|----------|-------------------|
| Platt Scaling | Fit sigmoid on logits (logistic regression) | Yes |
| Temperature Scaling | Divide logits by learned T | Yes |
| Isotonic Regression | Non-parametric monotonic mapping | Yes |
| Beta Calibration | Fit beta distribution | Yes |

---

## Online Metrics (Production)

### A/B Testing

```
Control (model A) ←── random user split ───→ Treatment (model B)
       ↓                                              ↓
   Measure metric                              Measure metric
       ↓                                              ↓
   Statistical test: is difference significant?
```

| Concept | Meaning |
|---------|---------|
| Statistical power | Probability of detecting a real effect |
| Sample size | Minimum users needed for reliable conclusion |
| p-value | Probability of seeing this result if no real difference exists |
| MDE (Minimum Detectable Effect) | Smallest improvement worth detecting |
| Type I error (α) | False positive — conclude difference when none exists |
| Type II error (β) | False negative — miss a real difference |

### Business Metrics vs Model Metrics

| Model metric | Business metric | Gap |
|-------------|----------------|-----|
| Accuracy | Revenue, conversion rate | Accuracy ≠ revenue |
| NDCG | Click-through rate, session time | Offline ranking ≠ online engagement |
| F1 | Customer satisfaction, retention | Detection rate ≠ customer happiness |
| Latency (p95) | User abandonment rate | Speed ≠ satisfaction (non-linear) |

### Monitoring Metrics Post-Deployment

| What to monitor | Detection method |
|-----------------|-----------------|
| Prediction drift | KL divergence on prediction distribution |
| Feature drift | PSI (Population Stability Index) per feature |
| Label drift | Ground truth feedback loops |
| Performance degradation | Sliding window metrics vs baseline |
| Latency | p50, p95, p99 response times |
| Error rate | HTTP 5xx, model exceptions |

---

## Metric Selection Decision Tree

```
Classification?
├── Binary?
│   ├── Balanced?     → Accuracy, F1, ROC-AUC
│   └── Imbalanced?   → AUPRC, F2 (if recall matters), Precision@K
├── Multi-class?
│   ├── All classes equal?  → Macro-F1
│   └── Class sizes vary?  → Weighted-F1, Micro-F1
└── Multi-label?          → Sample-averaged F1, Hamming loss

Regression?
├── Outliers are noise?     → MAE
├── Outliers matter?        → RMSE
├── Relative error matters? → MAPE
└── Explained variance?     → R², Adjusted R²

Ranking?
├── Binary relevance?   → MAP, Precision@K
├── Graded relevance?   → NDCG@K
└── Single correct?     → MRR

Clustering?
├── Ground truth?       → ARI, NMI
└── No ground truth?    → Silhouette, Calinski-Harabasz
```
