---
tags:
  - beginner
  - foundations
---

# Machine Learning Algorithms

*Written: 2026-08-23*

## Learning Paradigms

| Paradigm | Input | Goal | Examples |
|----------|-------|------|----------|
| **Supervised** | Labeled data (X, y) | Learn mapping f(X) → y | Classification, regression |
| **Unsupervised** | Unlabeled data (X) | Find structure in data | Clustering, dimensionality reduction |
| **Semi-supervised** | Small labeled + large unlabeled | Leverage both | Label propagation, self-training |
| **Self-supervised** | Unlabeled, create pseudo-labels | Learn representations | BERT masking, contrastive learning |

---

## Linear Regression

**Model:**

$$\hat{y} = w^T x + b$$

**Loss function (MSE):**

$$L = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2$$

**Closed-form solution (Normal Equation):**

$$w = (X^T X)^{-1} X^T y$$

**Properties:**

| Property | Value |
|----------|-------|
| Type | Regression |
| Assumption | Linear relationship, i.i.d. errors, homoscedasticity |
| Regularization | Ridge (L2), Lasso (L1), ElasticNet (L1+L2) |
| Complexity | O(n·d²) for normal equation, O(n·d·k) for gradient descent (k iterations) |
| Interpretability | High — coefficients show feature importance |

**Regularized variants:**

```
Ridge:      L = MSE + λ · ||w||₂²        (shrinks coefficients)
Lasso:      L = MSE + λ · ||w||₁         (sparse solutions, feature selection)
ElasticNet: L = MSE + λ₁·||w||₁ + λ₂·||w||₂²  (combines both)
```

**When to use:**
- Baseline for any regression task
- Features have approximately linear relationship with target
- Interpretability required (regulated industries, medical)
- Lasso when you suspect many irrelevant features

---

## Logistic Regression

**Model (binary):**

$$P(y=1|x) = \sigma(w^T x + b) = \frac{1}{1 + e^{-(w^T x + b)}}$$

**Loss function (Binary Cross-Entropy):**

$$L = -\frac{1}{n} \sum_{i=1}^{n} [y_i \log(\hat{y}_i) + (1-y_i) \log(1-\hat{y}_i)]$$

**Decision boundary:**

```
w^T x + b = 0  →  linear boundary in feature space
```

**Properties:**

| Property | Value |
|----------|-------|
| Type | Classification (binary or multinomial) |
| Output | Probability [0, 1] |
| Decision boundary | Linear (hyperplane) |
| Multi-class | One-vs-Rest (OvR) or Softmax (multinomial) |
| Regularization | L1, L2, ElasticNet |
| Interpretability | High — odds ratios from coefficients |

**When to use:**
- Binary classification baseline
- Need probability calibration (not just class label)
- Features are approximately linearly separable
- Medical/financial: interpretable risk scoring

---

## Support Vector Machines (SVM)

**Objective (hard margin):**

$$\min_{w,b} \frac{1}{2} ||w||^2 \quad \text{s.t.} \quad y_i(w^T x_i + b) \geq 1$$

**Soft margin (C-SVM):**

$$\min_{w,b,\xi} \frac{1}{2} ||w||^2 + C \sum_{i=1}^{n} \xi_i$$

where ξᵢ are slack variables allowing misclassification.

**Kernel trick — map to higher dimensions without computing the transformation:**

| Kernel | Formula | Use case |
|--------|---------|----------|
| Linear | K(x,z) = x·z | Linearly separable, high-d text |
| RBF (Gaussian) | K(x,z) = exp(-γ\|\|x-z\|\|²) | Default choice, non-linear |
| Polynomial | K(x,z) = (γ·x·z + r)^d | Image features |
| Sigmoid | K(x,z) = tanh(γ·x·z + r) | Neural network analogy |

**Key concepts:**

- **Support vectors** — data points closest to the decision boundary; they alone define the hyperplane
- **Margin** — distance between boundary and nearest support vectors; SVM maximizes this
- **C parameter** — trade-off between margin width and misclassification; high C = narrow margin, low error
- **γ (gamma)** — RBF kernel width; high γ = tight fit (overfitting risk), low γ = smooth boundary

**When to use:**
- Small to medium datasets (< 100k samples) — scales O(n²) to O(n³)
- High-dimensional sparse data (text classification)
- Clear margin of separation exists
- When you need strong theoretical guarantees (max margin)

---

## Decision Trees

**Splitting criteria:**

| Criterion | Formula | Used in |
|-----------|---------|---------|
| Gini impurity | 1 − Σ pᵢ² | CART (Classification) |
| Entropy | −Σ pᵢ log₂(pᵢ) | ID3, C4.5 |
| Information gain | H(parent) − Σ (nₖ/n)·H(childₖ) | ID3, C4.5 |
| Variance reduction | Var(parent) − Σ (nₖ/n)·Var(childₖ) | CART (Regression) |

**Algorithm (CART):**

```
function build_tree(data, depth):
    if stopping_condition(data, depth):
        return leaf(majority_class or mean)
    
    best_feature, best_threshold = find_best_split(data)
    left, right = partition(data, best_feature, best_threshold)
    
    return node(
        feature = best_feature,
        threshold = best_threshold,
        left = build_tree(left, depth + 1),
        right = build_tree(right, depth + 1)
    )
```

**Hyperparameters for controlling overfitting:**

| Parameter | Effect |
|-----------|--------|
| max_depth | Limit tree depth |
| min_samples_split | Minimum samples to split a node |
| min_samples_leaf | Minimum samples in a leaf |
| max_features | Number of features to consider per split |
| ccp_alpha | Cost-complexity pruning parameter |

**Properties:**
- Non-parametric — no assumptions about data distribution
- Handles mixed feature types (numerical + categorical)
- Interpretable (visualize the tree)
- Prone to overfitting without pruning
- Unstable — small data changes → different tree

---

## Ensemble Methods

### Bagging (Bootstrap Aggregating)

**Concept:** Train multiple models on random bootstrap samples, aggregate predictions.

```
For i = 1 to B:
    sample_i = bootstrap(training_data)    # sample with replacement
    model_i  = train(sample_i)

prediction = majority_vote([model_i(x) for i in 1..B])   # classification
           = mean([model_i(x) for i in 1..B])            # regression
```

### Random Forest

**Extension of bagging** — each tree also uses a random subset of features at each split.

| Hyperparameter | Default | Effect |
|----------------|---------|--------|
| n_estimators | 100 | Number of trees |
| max_features | √d (clf), d/3 (reg) | Features per split |
| max_depth | None | Tree depth limit |
| min_samples_leaf | 1 | Leaf size |
| oob_score | False | Out-of-bag validation |

**Why it works:**
- Individual trees overfit (high variance, low bias)
- Averaging reduces variance without increasing bias
- Feature randomization decorrelates trees → better ensemble

### Boosting

**Concept:** Train models sequentially, each correcting errors of the previous ensemble.

#### AdaBoost

```
Initialize sample weights: w_i = 1/n
For t = 1 to T:
    Train weak learner h_t on weighted data
    Compute error: ε_t = Σ w_i · I(h_t(x_i) ≠ y_i)
    Compute model weight: α_t = 0.5 · ln((1-ε_t)/ε_t)
    Update sample weights: w_i *= exp(-α_t · y_i · h_t(x_i))
    Normalize weights

Final: H(x) = sign(Σ α_t · h_t(x))
```

#### Gradient Boosting (GBM)

```
Initialize: F_0(x) = argmin_γ Σ L(y_i, γ)
For m = 1 to M:
    Compute pseudo-residuals: r_i = -∂L(y_i, F_{m-1}(x_i))/∂F_{m-1}(x_i)
    Fit tree h_m to residuals r_i
    Find step size: γ_m = argmin_γ Σ L(y_i, F_{m-1}(x_i) + γ·h_m(x_i))
    Update: F_m(x) = F_{m-1}(x) + η · γ_m · h_m(x)    (η = learning rate)
```

### Modern Gradient Boosting Implementations

| Library | Key innovation | Speed | Use case |
|---------|---------------|-------|----------|
| **XGBoost** | Regularized objective, histogram binning | Fast | Tabular competitions, production |
| **LightGBM** | Leaf-wise growth, GOSS, EFB | Faster | Large datasets, high cardinality |
| **CatBoost** | Ordered boosting, native categorical | Fast | Categorical-heavy data, less tuning |

**XGBoost objective:**

$$\text{Obj} = \sum_{i=1}^n L(y_i, \hat{y}_i) + \sum_{k=1}^K \left[ \gamma T_k + \frac{1}{2}\lambda ||w_k||^2 \right]$$

where T = number of leaves, w = leaf weights, γ = leaf penalty, λ = L2 regularization.

---

## K-Nearest Neighbors (KNN)

**Algorithm:**

```
function predict(x_query, k):
    distances = [distance(x_query, x_i) for x_i in training_data]
    neighbors = k_smallest(distances)
    return majority_vote(neighbors)       # classification
           weighted_mean(neighbors)       # regression
```

**Distance metrics:**

| Metric | Formula | Best for |
|--------|---------|----------|
| Euclidean | √(Σ(xᵢ-yᵢ)²) | Continuous, same-scale features |
| Manhattan | Σ\|xᵢ-yᵢ\| | High dimensions, sparse data |
| Minkowski | (Σ\|xᵢ-yᵢ\|^p)^(1/p) | Generalized (p=1: Manhattan, p=2: Euclidean) |
| Cosine | 1 - (x·y)/(‖x‖·‖y‖) | Text, high-dimensional sparse vectors |

**Properties:**
- Lazy learner — no training phase, all computation at prediction time
- Non-parametric — decision boundary adapts to data shape
- Curse of dimensionality — performance degrades in high-d; use PCA or feature selection
- O(n·d) per prediction without acceleration structures (KD-tree, Ball-tree)

---

## Naive Bayes

**Bayes' Theorem applied to classification:**

$$P(y|x_1,...,x_d) = \frac{P(y) \cdot \prod_{j=1}^d P(x_j|y)}{P(x_1,...,x_d)}$$

**"Naive" assumption:** features are conditionally independent given the class.

**Variants:**

| Variant | P(xⱼ|y) | Use case |
|---------|----------|----------|
| Gaussian | Normal distribution | Continuous features |
| Multinomial | Multinomial distribution | Word counts, TF-IDF |
| Bernoulli | Bernoulli distribution | Binary features (word presence) |
| Complement | Complement class counts | Imbalanced text classification |

**When to use:**
- Text classification (spam detection, sentiment analysis)
- Very fast training and prediction
- Works well with small datasets
- Baseline that's surprisingly hard to beat for text

---

## Clustering Algorithms

### K-Means

**Algorithm:**

```
Initialize k centroids (random or k-means++)
Repeat until convergence:
    Assign each point to nearest centroid
    Recompute centroids as mean of assigned points
```

**Objective (inertia):**

$$J = \sum_{i=1}^n ||x_i - \mu_{c(i)}||^2$$

### Comparison of Clustering Methods

| Algorithm | Shape | Scalability | Parameters | Handles noise |
|-----------|-------|-------------|------------|---------------|
| K-Means | Spherical | O(n·k·d·i) | k | No |
| DBSCAN | Arbitrary | O(n log n) | ε, min_samples | Yes (outliers) |
| Hierarchical | Arbitrary | O(n²) or O(n² log n) | linkage, threshold | No |
| Gaussian Mixture | Ellipsoidal | O(n·k·d²·i) | k, covariance type | Soft assignments |
| HDBSCAN | Arbitrary | O(n log n) | min_cluster_size | Yes |

---

## Dimensionality Reduction

### PCA (Principal Component Analysis)

**Steps:**

1. Center data: X̄ = X - mean(X)
2. Compute covariance matrix: C = (1/n) X̄ᵀ X̄
3. Eigendecomposition: C = VΛVᵀ
4. Select top-k eigenvectors (largest eigenvalues)
5. Project: Z = X̄ · V_k

**Variance retained:**

$$\text{explained ratio} = \frac{\sum_{i=1}^k \lambda_i}{\sum_{i=1}^d \lambda_i}$$

### Comparison

| Method | Linear? | Preserves | Use case |
|--------|---------|-----------|----------|
| PCA | Yes | Global variance | General reduction, preprocessing |
| t-SNE | No | Local structure | 2D/3D visualization |
| UMAP | No | Local + global | Visualization, clustering preprocessing |
| LDA | Yes | Class separation | Supervised reduction |
| Autoencoders | No | Learned representation | Complex non-linear manifolds |

---

## Algorithm Selection Guide

| Scenario | Recommended algorithms |
|----------|----------------------|
| Small data, need interpretability | Logistic Regression, Decision Tree |
| Tabular data, maximize accuracy | XGBoost, LightGBM, CatBoost |
| High-dimensional sparse (text) | Linear SVM, Naive Bayes, Logistic Regression |
| Non-linear relationships, medium data | Random Forest, SVM (RBF), Gradient Boosting |
| Very large dataset (>1M rows) | LightGBM, SGD-based linear models, neural networks |
| Clustering with unknown k | DBSCAN, HDBSCAN |
| Need probability estimates | Logistic Regression, Calibrated Random Forest |
| Streaming/online learning | SGD, Perceptron, Online Naive Bayes |

## Bias-Variance Trade-off

```
Total Error = Bias² + Variance + Irreducible Noise

High bias (underfitting):    model too simple → misses patterns
High variance (overfitting): model too complex → fits noise

                    Bias    Variance    Risk
Linear Regression   High    Low         Underfitting
Decision Tree       Low     High        Overfitting
Random Forest       Low     Medium      Good balance
Boosting (tuned)    Low     Low-Med     Best (if tuned well)
KNN (small k)       Low     High        Overfitting
KNN (large k)       High    Low         Underfitting
```

**Strategies:**

| Problem | Solution |
|---------|----------|
| High bias | More complex model, more features, less regularization |
| High variance | More data, regularization, ensemble, fewer features, dropout |
| Both high | Better features, different algorithm family |
