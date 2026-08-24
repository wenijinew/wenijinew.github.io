---
tags:
  - intermediate
  - research
---

# Time Series Forecasting

*Written: 2026-08-23*

## Time Series Fundamentals

### Components of a Time Series

```
y(t) = Trend(t) + Seasonality(t) + Residual(t)       (additive)
y(t) = Trend(t) × Seasonality(t) × Residual(t)       (multiplicative)
```

| Component | Description | Example |
|-----------|-------------|---------|
| Trend | Long-term increase or decrease | Population growth |
| Seasonality | Regular periodic patterns | Higher sales in December |
| Cyclical | Irregular long-term fluctuations | Business cycles (2-10 years) |
| Residual (noise) | Random, unpredictable variation | Day-to-day stock fluctuations |

### Stationarity

A stationary time series has constant statistical properties over time:
- Constant mean
- Constant variance
- Autocovariance depends only on lag, not time

**Testing for stationarity:**

| Test | Null hypothesis | Interpretation |
|------|----------------|---------------|
| ADF (Augmented Dickey-Fuller) | Unit root (non-stationary) | p < 0.05 → stationary |
| KPSS | Stationary | p < 0.05 → non-stationary |
| Phillips-Perron | Unit root | Like ADF but robust to serial correlation |

**Making series stationary:**

| Transform | When to use |
|-----------|-------------|
| Differencing (d=1) | Remove linear trend |
| Second differencing (d=2) | Remove quadratic trend |
| Log transform | Stabilize variance (multiplicative patterns) |
| Seasonal differencing | Remove seasonal pattern (y_t - y_{t-m}) |
| Box-Cox transform | Stabilize variance (parameterized) |

---

## Statistical Models

### ARIMA (AutoRegressive Integrated Moving Average)

**ARIMA(p, d, q):**

$$\phi(B)(1-B)^d y_t = \theta(B) \epsilon_t$$

| Parameter | Meaning | Determined by |
|-----------|---------|---------------|
| p | AR order (autoregressive lags) | PACF (partial autocorrelation) |
| d | Differencing order | Stationarity tests |
| q | MA order (moving average errors) | ACF (autocorrelation) |

**Components:**

```
AR(p): y_t = c + φ₁y_{t-1} + φ₂y_{t-2} + ... + φ_p·y_{t-p} + ε_t
MA(q): y_t = c + ε_t + θ₁ε_{t-1} + θ₂ε_{t-2} + ... + θ_q·ε_{t-q}
I(d):  Apply differencing d times before fitting ARMA

ARIMA = AR + I + MA combined
```

### SARIMA (Seasonal ARIMA)

**SARIMA(p,d,q)(P,D,Q)[m]:**

Adds seasonal AR/MA/differencing with period m.

```
Example: Monthly data with yearly seasonality
SARIMA(1,1,1)(1,1,1)[12]

- (1,1,1): non-seasonal AR(1), differencing(1), MA(1)
- (1,1,1)[12]: seasonal AR(1), seasonal differencing(1), seasonal MA(1), period=12
```

### Exponential Smoothing (ETS)

| Model | Components | Notation |
|-------|-----------|----------|
| Simple Exponential Smoothing | Level only | (A,N,N) |
| Holt's Linear | Level + Trend | (A,A,N) |
| Holt-Winters Additive | Level + Trend + Additive Season | (A,A,A) |
| Holt-Winters Multiplicative | Level + Trend + Multiplicative Season | (A,A,M) |
| Damped Trend | Level + Damped Trend | (A,Ad,N) |

**ETS notation:** (Error, Trend, Seasonality) — each can be:
- N (none), A (additive), M (multiplicative), Ad (additive damped)

### Prophet (Meta)

```
y(t) = g(t) + s(t) + h(t) + ε_t

g(t) = growth (linear or logistic with changepoints)
s(t) = seasonality (Fourier series — yearly, weekly, daily)
h(t) = holidays (user-specified special events)
ε_t  = error term
```

**When Prophet works well:**
- Strong seasonal effects (multiple seasonalities)
- Missing data and outliers common
- Business time series with holiday effects
- Non-expert users (minimal tuning)

---

## Machine Learning Approaches

### Feature Engineering for Time Series ML

| Feature type | Examples |
|-------------|---------|
| Lag features | y_{t-1}, y_{t-7}, y_{t-30} |
| Rolling statistics | mean_7d, std_7d, min_7d, max_7d |
| Expanding statistics | cumulative_mean, cumulative_max |
| Calendar features | day_of_week, month, is_holiday, is_weekend |
| Cyclical encoding | sin(2π·hour/24), cos(2π·hour/24) |
| Trend features | Time index, days since start |
| Difference features | y_t - y_{t-1}, pct_change |
| External regressors | Temperature, price, events |

### Gradient Boosting for Time Series

| Library | Strengths | Approach |
|---------|-----------|----------|
| XGBoost | Fast, well-understood | Tabular features from time series |
| LightGBM | Handles high cardinality, large datasets | Same + native categorical |
| CatBoost | Less tuning needed | Same + ordered boosting |

**Important considerations:**

```
⚠️ Time series cross-validation (never shuffle!)
    Train: [──────────] Val: [────]
    Train: [──────────────────] Val: [────]
    Train: [──────────────────────────] Val: [────]

⚠️ No future leakage:
    BAD:  rolling_mean_7d = mean(y[t-3:t+4])  ← includes future!
    GOOD: rolling_mean_7d = mean(y[t-7:t])    ← past only
```

---

## Deep Learning Models

### RNN-Based

| Model | Architecture | Key property |
|-------|-------------|-------------|
| Vanilla RNN | Recurrent hidden state | Vanishing gradients (limited memory) |
| LSTM | Cell state + 3 gates | Long-range dependencies |
| GRU | 2 gates (update, reset) | Lighter than LSTM, similar performance |
| DeepAR (Amazon) | LSTM + probabilistic output | Quantile forecasts, multiple series |
| LSTNet | CNN + RNN + skip connections | Multi-scale temporal patterns |

### Transformer-Based

| Model | Year | Key innovation |
|-------|------|----------------|
| Transformer (original) | 2017 | Self-attention (not designed for time series) |
| Informer | 2021 | ProbSparse attention — O(n log n) |
| Autoformer | 2021 | Auto-correlation + series decomposition |
| FEDformer | 2022 | Frequency-enhanced attention (Fourier/wavelet) |
| PatchTST | 2023 | Patch tokenization + channel-independence |
| iTransformer | 2024 | Invert: attention over variables, FFN over time |
| TimesFM (Google) | 2024 | Foundation model for time series (pre-trained) |
| Chronos (Amazon) | 2024 | Pre-trained on tokenized time series (T5-based) |
| Moirai (Salesforce) | 2024 | Universal forecasting foundation model |

### PatchTST Architecture

```
Input: multivariate time series [B, C, L]  (batch, channels, length)
    │
    ▼ (treat each channel independently)
Patching: split into non-overlapping patches of size P with stride S
    [B×C, N, P]  where N = (L-P)/S + 1
    │
    ▼
Linear embedding + positional encoding
    │
    ▼
Transformer encoder (self-attention over patches)
    │
    ▼
Flatten + Linear head → forecast [B, C, H]  (H = forecast horizon)
```

**Why patches work:**
- Reduce sequence length (from L to L/P) → less compute
- Each patch captures local temporal patterns
- Self-attention captures long-range dependencies between patches
- Channel-independence avoids overfitting on variable correlations

### N-BEATS (Neural Basis Expansion)

```
Input: lookback window [y_{t-L}, ..., y_{t-1}]
    │
    ▼
Stack 1 (trend): FC layers → basis expansion → trend forecast + backcast
    │ (residual = input - backcast)
    ▼
Stack 2 (seasonality): FC layers → basis expansion → seasonal forecast + backcast
    │ (residual = input - backcast)
    ▼
Stack 3 (generic): FC layers → basis expansion → generic forecast
    │
    ▼
Final forecast = sum of all stacks' forecasts
```

---

## Probabilistic Forecasting

### Why Probabilistic?

Point forecasts (single value) are insufficient for:
- Risk management (need worst-case scenarios)
- Inventory optimization (need demand uncertainty)
- Energy trading (need price ranges)
- Capacity planning (need confidence intervals)

### Methods

| Method | Approach | Output |
|--------|----------|--------|
| Quantile regression | Predict specific percentiles (10th, 50th, 90th) | Quantile estimates |
| Monte Carlo dropout | Multiple forward passes with dropout | Empirical distribution |
| Deep ensembles | Train N models, aggregate predictions | Prediction intervals |
| Bayesian neural networks | Weight distributions → output distribution | Full posterior |
| Conformal prediction | Distribution-free coverage guarantees | Prediction intervals |
| DeepAR | Parametric distribution (Gaussian, NegBin) | Full distribution parameters |
| Normalizing flows | Learn complex output distributions | Flexible density estimate |

### Quantile Loss (Pinball Loss)

$$L_\tau(y, \hat{y}) = \begin{cases} \tau \cdot (y - \hat{y}) & \text{if } y \geq \hat{y} \\ (1-\tau) \cdot (\hat{y} - y) & \text{if } y < \hat{y} \end{cases}$$

- τ = 0.5: median (equivalent to MAE)
- τ = 0.9: 90th percentile (penalizes under-prediction more)
- τ = 0.1: 10th percentile (penalizes over-prediction more)

---

## Multi-Step Forecasting Strategies

| Strategy | Method | Pros/Cons |
|----------|--------|-----------|
| Recursive (iterated) | Predict 1 step, feed back as input, repeat | Simple; error accumulates |
| Direct | Train separate model for each horizon | No error accumulation; expensive |
| Multi-output | Single model outputs all horizons at once | Fast; may miss horizon-specific patterns |
| MIMO (Multiple Input Multiple Output) | One model, all horizons jointly | Captures cross-horizon dependencies |
| DirRec (hybrid) | Direct for each step, using recursive predictions as features | Balance of both |

---

## Multivariate Time Series

### Approaches

| Method | Handles cross-variable dependencies | Scalability |
|--------|-------------------------------------|-------------|
| Channel-independent (CI) | No (each variable forecasted separately) | High (scales to many variables) |
| Channel-dependent (CD) | Yes (attention/correlation across variables) | Lower (quadratic in variables) |
| Graph-based | Yes (explicit structure between variables) | Medium |
| VAR (Vector AutoRegression) | Yes (linear cross-variable relationships) | Low (O(d²) parameters) |

### Vector AutoRegression (VAR)

```
y_t = c + A₁·y_{t-1} + A₂·y_{t-2} + ... + A_p·y_{t-p} + ε_t

where y_t ∈ ℝ^d (d-dimensional vector of all variables)
      A_i ∈ ℝ^(d×d) (coefficient matrices)

Number of parameters: d² × p + d (grows quadratically with variables)
→ impractical for d > 20-50
```

### Granger Causality

```
Test: Does variable X help predict variable Y?

1. Fit: Y_t = f(Y_{t-1}, ..., Y_{t-p})               → RSS_restricted
2. Fit: Y_t = f(Y_{t-1}, ..., Y_{t-p}, X_{t-1}, ...) → RSS_unrestricted
3. F-test: is the improvement significant?

If p < 0.05: "X Granger-causes Y" (predictive, not necessarily causal)
```

---

## Anomaly Detection in Time Series

### Methods

| Method | Approach | Best for |
|--------|----------|----------|
| Statistical (Z-score) | Flag points > k standard deviations | Simple, univariate |
| Moving average residual | Flag large deviations from moving average | Trending data |
| Isolation Forest | Anomaly = easy to isolate in random tree | Multivariate, no labels |
| LSTM Autoencoder | High reconstruction error = anomaly | Complex temporal patterns |
| Spectral Residual (Microsoft) | Frequency domain anomalies | Periodic time series |
| Prophet + residuals | Fit Prophet, flag large residuals | Business metrics with seasonality |
| Matrix Profile | Distance-based motif/discord detection | Pattern-based anomalies |

### Types of Anomalies

| Type | Description | Example |
|------|-------------|---------|
| Point anomaly | Single unexpected value | Sudden spike in CPU usage |
| Contextual anomaly | Normal value, wrong context | 30°C temperature in January (Stockholm) |
| Collective anomaly | Sequence that's abnormal together | Sustained elevated heart rate |
| Seasonal anomaly | Deviation from expected seasonal pattern | Low December sales |

---

## Evaluation Metrics

### Point Forecast Metrics

| Metric | Formula | Properties |
|--------|---------|------------|
| MAE | (1/n) Σ\|y-ŷ\| | Scale-dependent, robust to outliers |
| RMSE | √((1/n) Σ(y-ŷ)²) | Scale-dependent, penalizes large errors |
| MAPE | (100/n) Σ\|y-ŷ\|/\|y\| | Scale-free, undefined when y=0 |
| sMAPE | (200/n) Σ\|y-ŷ\|/(\|y\|+\|ŷ\|) | Symmetric, bounded [0, 200] |
| MASE | MAE / MAE_naive | Scale-free, relative to naive forecast |
| WAPE | Σ\|y-ŷ\| / Σ\|y\| | Weighted, handles zeros |

### MASE (Mean Absolute Scaled Error)

$$MASE = \frac{MAE_{model}}{MAE_{naive}} = \frac{\frac{1}{h}\sum_{t}\|y_t - \hat{y}_t\|}{\frac{1}{n-m}\sum_{t=m+1}^{n}\|y_t - y_{t-m}\|}$$

- Denominator = MAE of seasonal naive forecast (repeat value from m periods ago)
- MASE < 1: model beats naive baseline
- MASE > 1: model worse than naive — don't deploy!

### Probabilistic Forecast Metrics

| Metric | Measures |
|--------|----------|
| CRPS (Continuous Ranked Probability Score) | Overall calibration + sharpness |
| Quantile loss (pinball loss) | Accuracy at specific quantiles |
| Coverage | Fraction of actuals within prediction interval |
| Interval width | Sharpness of prediction intervals |
| Calibration plot | Reliability of probability estimates |

---

## Foundation Models for Time Series

### Pre-trained Models (2024+)

| Model | Developer | Architecture | Training data |
|-------|-----------|-------------|---------------|
| TimesFM | Google | Decoder-only, patching | 100B time points (public + synthetic) |
| Chronos | Amazon | T5-based, tokenized values | 27 diverse datasets |
| Moirai | Salesforce | Masked encoder, multi-patch | Large Open Time Series Archive |
| Lag-Llama | Independent | LLaMA-style, lag features | 27 datasets |
| Timer | Tsinghua | GPT-style, unified forecasting | Large-scale time series corpus |

### Zero-Shot vs Fine-Tuned

```
Zero-shot (no task-specific training):
    Pre-trained model → directly forecast new series
    ✓ No training needed, instant results
    ✗ May not capture domain-specific patterns

Fine-tuned (adapt to your data):
    Pre-trained model → fine-tune on target domain → forecast
    ✓ Better accuracy on specific domain
    ✗ Needs labeled data, compute for fine-tuning
```

---

## Tools & Libraries

| Library | Language | Strengths |
|---------|----------|-----------|
| statsmodels | Python | Classical (ARIMA, ETS, VAR) |
| Prophet | Python/R | Additive models, holiday effects |
| Darts | Python | Unified API for all models (classical + DL) |
| NeuralForecast (Nixtla) | Python | Neural models (N-BEATS, PatchTST, iTransformer) |
| GluonTS (Amazon) | Python | Probabilistic deep learning models |
| tslearn | Python | Time series ML (DTW, clustering) |
| sktime | Python | Scikit-learn API for time series |
| tsfresh | Python | Automated feature extraction |
| AutoTS | Python | Automated model selection |
| StatsForecast (Nixtla) | Python | Fast statistical models |

---

## Practical Guidelines

### Model Selection

| Data characteristics | Recommended approach |
|---------------------|---------------------|
| < 100 observations | Exponential smoothing, ARIMA |
| Strong seasonality, holidays | Prophet, SARIMA, ETS |
| Many related series | Global models (DeepAR, N-BEATS, PatchTST) |
| Rich exogenous variables | Gradient boosting, LSTM with features |
| Need uncertainty | DeepAR, Conformal prediction, ensembles |
| Real-time / streaming | Online learning, exponential smoothing |
| Zero-shot (new series, no history) | Foundation models (TimesFM, Chronos) |
| Complex multivariate dependencies | Transformer-based, Graph Neural Networks |

### Common Pitfalls

| Pitfall | Consequence | Fix |
|---------|-------------|-----|
| Shuffled train/test split | Future leakage, overly optimistic metrics | Always use temporal split |
| Including future information in features | Impossible in production | Strict lag enforcement |
| Ignoring seasonality period | Model can't capture patterns | ACF analysis, domain knowledge |
| Over-differencing | Lose signal, unstable predictions | Check ADF after each differencing |
| Single point forecast for decisions | Ignores uncertainty | Use probabilistic forecasts |
| Training on too-short history | Can't learn seasonal patterns | Need ≥ 2 full cycles |
| Evaluating on one test window | High variance estimate | Use rolling-origin evaluation |
