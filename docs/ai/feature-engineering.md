# Feature Engineering

*Written: 2026-08-23*

## What Is Feature Engineering?

The process of transforming raw data into informative representations that improve model performance. Often the single largest lever for model quality on tabular/structured data.

```
Raw Data → Feature Engineering → Model-Ready Features
   │                                      │
   ├─ Missing values                      ├─ Numerical (scaled)
   ├─ Mixed types                         ├─ Categorical (encoded)
   ├─ Noise                               ├─ Temporal (decomposed)
   ├─ Irrelevant columns                  ├─ Interactions
   └─ Raw text/dates/IDs                  └─ Domain-specific signals
```

---

## Numerical Feature Transformations

### Scaling Methods

| Method | Formula | When to use |
|--------|---------|-------------|
| StandardScaler (Z-score) | (x - μ) / σ | Most algorithms, Gaussian-ish data |
| MinMaxScaler | (x - min) / (max - min) | Neural networks, bounded activations |
| RobustScaler | (x - median) / IQR | Outlier-heavy data |
| MaxAbsScaler | x / max(\|x\|) | Sparse data (preserves zeros) |
| Normalizer | x / \|\|x\|\| | Per-sample normalization (text TF-IDF) |

**When scaling matters:**

| Algorithm | Needs scaling? | Why |
|-----------|---------------|-----|
| Linear/Logistic Regression | Yes | Gradient descent convergence |
| SVM | Yes | Distance-based kernel |
| KNN | Yes | Distance computation |
| Neural Networks | Yes | Activation saturation |
| Decision Trees / RF / XGBoost | No | Split-based (scale invariant) |
| Naive Bayes | No | Probability-based |

### Non-linear Transformations

| Transform | Formula | Use case |
|-----------|---------|----------|
| Log | log(x + 1) | Right-skewed distributions (income, counts) |
| Square root | √x | Count data, moderate skewness |
| Box-Cox | (x^λ - 1) / λ | Optimal normalization (x > 0 only) |
| Yeo-Johnson | Extended Box-Cox | Handles negative values |
| Power transform | x^n | Specific domain relationships |
| Quantile transform | Map to uniform/normal | Force any distribution to target |

**When to apply log transform:**
- Skewness > 2 or < -2
- Data spans multiple orders of magnitude
- Multiplicative relationships (price, population, frequency)

### Binning / Discretization

| Method | Approach | Use case |
|--------|----------|----------|
| Equal-width | Fixed-size bins | Uniform distribution |
| Equal-frequency (quantile) | Same number of samples per bin | Skewed distributions |
| Domain-based | Business rules (age groups, income brackets) | Interpretability |
| Decision tree bins | Use tree splits as bin edges | Optimal for target relationship |

---

## Categorical Feature Encoding

### Encoding Methods

| Method | Output | Cardinality | Preserves order |
|--------|--------|-------------|-----------------|
| Label Encoding | Single integer column | Any | Only for ordinal |
| One-Hot Encoding | K binary columns | Low (< 20) | No |
| Binary Encoding | log₂(K) columns | Medium | No |
| Target Encoding | Mean of target per category | High | N/A |
| Frequency Encoding | Count or proportion per category | High | N/A |
| Ordinal Encoding | Ordered integers | Any ordinal | Yes |
| Embedding | Dense learned vector | Very high | Learned |
| Hash Encoding | Fixed-size hash bins | Very high | No |

### Target Encoding (with regularization)

```
# Naive target encoding (leaks target → overfitting)
encoded_value = mean(target for rows with this category)

# Regularized (smoothed)
encoded_value = (count * category_mean + weight * global_mean) / (count + weight)

# With cross-validation (safe approach)
for fold in k_folds:
    train_folds = all folds except current
    encoded_values[fold] = mean(target in train_folds for this category)
```

**Key rules:**
- Always compute on training set only (never use test/val data)
- Use k-fold or leave-one-out to prevent leakage
- Add smoothing for rare categories (Bayesian shrinkage toward global mean)
- Add noise during training for additional regularization

### High-Cardinality Strategies

| Strategy | When | Example |
|----------|------|---------|
| Target encoding (smoothed) | Predictive category-target relationship | ZIP codes → house prices |
| Frequency encoding | Category popularity matters | Product IDs → purchase counts |
| Embedding layers | Deep learning, very high cardinality | User IDs (millions) |
| Clustering then encoding | Natural groups exist | Group rare categories into "Other" |
| Hash encoding | Extremely high cardinality, memory constrained | URLs, email domains |

---

## Missing Data Handling

### Strategies

| Method | Approach | Assumption |
|--------|----------|------------|
| Drop rows | Remove incomplete samples | MCAR (missing completely at random), enough data |
| Drop columns | Remove feature with too many NaN | >50% missing, not important |
| Mean/median imputation | Replace with central tendency | MCAR, numerical features |
| Mode imputation | Replace with most frequent | Categorical features |
| KNN imputation | Use K nearest neighbors' values | Similar samples have similar values |
| Iterative (MICE) | Multiple regression-based imputation | MAR (missing at random) |
| Forward/backward fill | Use previous/next value | Time series |
| Indicator column | Add binary "is_missing" feature | Missingness itself is informative |
| Model-based | Train model to predict missing values | Complex patterns |

### Missingness Types

| Type | Definition | Example |
|------|-----------|---------|
| MCAR | Missing independent of all values | Random sensor dropout |
| MAR | Missing depends on observed values | Older patients skip questionnaire |
| MNAR | Missing depends on the missing value itself | High income people don't report income |

**Decision flow:**

```
Missing rate < 5%?     → Simple imputation (mean/median) + indicator column
Missing rate 5-50%?    → KNN or iterative imputation + indicator column
Missing rate > 50%?    → Consider dropping feature (unless missingness is signal)
MNAR suspected?        → Indicator column is critical (missingness = information)
```

---

## Temporal Feature Engineering

### Date/Time Decomposition

| Feature | Example values | Use case |
|---------|---------------|----------|
| Year | 2024, 2025 | Trend |
| Month | 1-12 | Seasonality |
| Day of week | 0-6 (Mon-Sun) | Weekly patterns |
| Hour | 0-23 | Intraday patterns |
| Is weekend | 0/1 | Binary behavior change |
| Is holiday | 0/1 | Special events |
| Quarter | 1-4 | Business cycles |
| Days since event | 0, 1, 2, ... | Recency effects |
| Cyclical encoding | sin(2π·hour/24), cos(2π·hour/24) | Preserve cyclical nature |

### Lag Features (Time Series)

```
# Lag features
feature_lag_1 = target.shift(1)        # previous value
feature_lag_7 = target.shift(7)        # same day last week
feature_lag_30 = target.shift(30)      # same day last month

# Rolling statistics
rolling_mean_7 = target.rolling(7).mean()
rolling_std_7 = target.rolling(7).std()
rolling_max_7 = target.rolling(7).max()

# Expanding statistics
expanding_mean = target.expanding().mean()  # cumulative mean

# Difference features
diff_1 = target.diff(1)               # day-over-day change
pct_change_1 = target.pct_change(1)   # percentage change
```

**Critical rule:** Always use only past data for features — no future leakage.

---

## Text Feature Engineering

| Method | Output | Captures |
|--------|--------|----------|
| Bag of Words (BoW) | Sparse count vector | Word presence/frequency |
| TF-IDF | Weighted sparse vector | Importance relative to corpus |
| Word2Vec/GloVe | Dense vector (aggregated) | Semantic meaning |
| Sentence embeddings | Dense vector per text | Full semantic content |
| Character n-grams | Sparse features | Subword patterns, typo-robust |
| Named entities | Count/type features | Structured info from text |
| Sentiment scores | Numerical score | Emotional content |
| Text statistics | Length, word count, punctuation | Surface-level signals |

### TF-IDF

$$\text{TF-IDF}(t, d) = \text{TF}(t, d) \times \log\frac{N}{\text{DF}(t)}$$

- TF(t,d) = term frequency in document d
- DF(t) = number of documents containing term t
- N = total number of documents
- High TF-IDF = word is important in this document but rare overall

---

## Feature Interactions

### Manual Interactions

```
# Arithmetic combinations
area = length * width
bmi = weight / height²
speed = distance / time

# Polynomial features (degree 2)
[x₁, x₂] → [x₁, x₂, x₁², x₁·x₂, x₂²]

# Ratio features
price_per_sqft = price / square_footage
click_through_rate = clicks / impressions

# Cross features (categorical)
city_x_device = city + "_" + device_type
```

### Automated Feature Generation

| Tool | Approach | Output |
|------|----------|--------|
| Featuretools (DFS) | Deep feature synthesis (relational) | Auto-aggregated features from related tables |
| AutoFeat | Symbolic regression | Mathematical combinations |
| tsfresh | Time series feature extraction | 700+ statistical features from time series |
| Polars expressions | Lazy evaluation on dataframes | Window/group features |

---

## Feature Selection

### Filter Methods (pre-training, fast)

| Method | Measures | Type |
|--------|----------|------|
| Correlation (Pearson/Spearman) | Linear/monotonic relationship with target | Univariate |
| Mutual Information | Any dependency (including non-linear) | Univariate |
| Chi-squared | Association (categorical features) | Univariate |
| Variance threshold | Remove near-constant features | Univariate |
| ANOVA F-test | Between-class vs within-class variance | Univariate |

### Wrapper Methods (model-dependent, expensive)

| Method | Approach | Complexity |
|--------|----------|-----------|
| Forward selection | Add best feature one at a time | O(d² × train) |
| Backward elimination | Remove worst feature one at a time | O(d² × train) |
| Recursive Feature Elimination (RFE) | Remove least important iteratively | O(d × train) |
| Sequential Feature Selection | Greedy forward/backward | O(d × k × train) |

### Embedded Methods (during training)

| Method | Algorithm | How |
|--------|-----------|-----|
| L1 regularization | Lasso, linear models | Zeros out unimportant weights |
| Tree importance | RF, XGBoost | Split frequency or information gain |
| Permutation importance | Any model | Shuffle feature, measure accuracy drop |
| SHAP values | Any model | Game-theoretic feature contribution |
| Attention weights | Transformers | Which inputs the model focuses on |

### Feature Importance Comparison

| Method | Handles interactions | Handles correlation | Reliable |
|--------|---------------------|--------------------| ---------|
| Pearson correlation | No | No (misleading) | Low |
| Tree importance (impurity) | Partially | No (biased toward high-card) | Medium |
| Permutation importance | Yes | Somewhat (shared importance) | High |
| SHAP | Yes | Yes (individual contributions) | Highest |
| Mutual Information | Partially | Not affected | Medium |

---

## Dimensionality Reduction as Feature Engineering

### When to Reduce

- Curse of dimensionality (KNN, distance-based methods suffer in high-d)
- Multicollinearity (correlated features confuse linear models)
- Visualization (project to 2D/3D for exploration)
- Compute constraints (reduce training time/memory)
- Noise reduction (low-variance components = noise)

### Methods

| Method | Linear | Supervised | Preserves |
|--------|--------|-----------|-----------|
| PCA | Yes | No | Global variance |
| LDA | Yes | Yes | Class separability |
| t-SNE | No | No | Local neighborhoods |
| UMAP | No | No/Yes | Local + global topology |
| Autoencoders | No | No | Learned reconstruction |
| Truncated SVD | Yes | No | Variance (sparse data) |
| NMF | Yes | No | Non-negative parts |

---

## Feature Stores

### Architecture

```
┌──────────────┐    ┌──────────────────┐    ┌───────────────┐
│ Data Sources │ →  │  Feature Store    │ →  │  Model        │
│ (raw data)   │    │                    │    │  Training &   │
│              │    │  ┌─────────────┐  │    │  Serving      │
│  DB, Kafka,  │    │  │ Offline     │  │    └───────────────┘
│  files, APIs │    │  │ (batch)     │  │
│              │    │  ├─────────────┤  │
│              │    │  │ Online      │  │
│              │    │  │ (low-latency)│  │
│              │    │  └─────────────┘  │
└──────────────┘    └──────────────────┘
```

### Key Platforms

| Platform | Type | Key feature |
|----------|------|-------------|
| Feast | Open source | Lightweight, point-in-time joins |
| Tecton | Managed | Real-time features, Spark/Flink |
| Hopsworks | Hybrid | Great API, time-travel |
| Vertex AI Feature Store | GCP managed | Integrated with Vertex pipelines |
| SageMaker Feature Store | AWS managed | Integrated with SageMaker |
| Databricks Feature Store | Databricks | Unity Catalog integration |

### Why Feature Stores?

| Problem | Solution |
|---------|----------|
| Training/serving skew | Same feature logic for batch + online |
| Feature reuse | Share features across teams/models |
| Point-in-time correctness | Prevent future leakage in training |
| Feature freshness | Automated pipelines keep features current |
| Feature discovery | Catalog with metadata + lineage |
| Monitoring | Detect feature drift in production |

---

## Feature Engineering Anti-Patterns

| Anti-pattern | Why it's bad | Fix |
|-------------|-------------|-----|
| Target leakage | Feature contains future info → inflated metrics, fails in production | Temporal validation, causal analysis |
| Fit on all data | Scaler/encoder sees test set → optimistic estimates | Fit only on training set |
| Over-engineering | 1000 features, most noise → overfitting | Start simple, add if needed |
| Ignoring domain knowledge | Miss obvious signals, waste compute | Talk to domain experts first |
| One-hot with high cardinality | Millions of sparse features → memory explosion | Target/frequency encoding, embeddings |
| Treating ordinal as nominal | Lose ordering information | Ordinal encoding |
| Imputing then forgetting | Lose information about missingness patterns | Always add "is_missing" indicator |
| Scaling before splitting | Test info leaks into train via scaler stats | Split first, then fit scaler on train only |
