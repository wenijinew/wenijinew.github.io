# Deep Learning Fundamentals

## Activation Functions

### tanh (Hyperbolic Tangent)

**Definition:**

$$\tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}$$

**Properties:**

| Property | Value |
|---|---|
| Output range | (-1, 1) |
| Center | 0 (zero-centered) |
| Monotonic | Yes, strictly increasing |
| Derivative | 1 − tanh²(x) |
| Max derivative | 1 (at x = 0) |
| Saturates at | ±1 for large \|x\| |

**Relationship to sigmoid:**

```
tanh(x) = 2 · sigmoid(2x) − 1
```

**Role in deep learning:**

- **Zero-centered output** — gradients don't have a systematic positive/negative bias, leading to faster convergence compared to sigmoid
- **LSTM core component** — used in cell state updates: the candidate cell state (C̃) passes through tanh to keep values in [-1, 1]
- **Stronger gradients** — derivative peaks at 1 (vs 0.25 for sigmoid), so gradients flow better during backpropagation
- **Still suffers vanishing gradients** — for |x| > 3, the gradient ≈ 0, which is why LSTM/GRU gates were invented to mitigate this

**Where tanh is used in LSTM:**

```
C̃_t = tanh(W_c · [h_{t-1}, x_t] + b_c)    ← candidate cell state
h_t  = o_t * tanh(C_t)                      ← output hidden state
```

**When to use tanh vs alternatives:**

| Use case | Recommendation |
|---|---|
| LSTM/GRU internals | tanh (by design) |
| Hidden layers (general) | ReLU or GELU preferred (no saturation) |
| Output layer, range [-1,1] | tanh |
| Output layer, range [0,1] | sigmoid |
| Classification output | softmax / sigmoid |

### Worked Example: tanh(12039) → 1.0

**Step 1 — Plug into the formula:**

$$\tanh(12039) = \frac{e^{12039} - e^{-12039}}{e^{12039} + e^{-12039}}$$

**Step 2 — Compute the exponentials:**

| Term | Value |
|---|---|
| e^12039 | ≈ 10^5228 (a number with over 5000 digits) |
| e^-12039 | ≈ 10^-5228 (over 5000 zeros after the decimal point) |

**Step 3 — Simplify:**

```
Numerator   = e^12039 - e^-12039 ≈ 10^5228   (subtracting ~0 changes nothing)
Denominator = e^12039 + e^-12039 ≈ 10^5228   (adding ~0 changes nothing)

tanh(12039) = 10^5228 / 10^5228 = 1.0
```

**Step 4 — The general intuition for large x:**

```
e^-x → 0  when x is large

         e^x - 0     e^x
tanh = --------- = ----- = 1
         e^x + 0     e^x
```

**Step 5 — Convergence table:**

| x | e^x | e^-x | Numerator | Denominator | tanh(x) |
|---|---|---|---|---|---|
| 0 | 1 | 1 | 0 | 2 | **0.0000** |
| 1 | 2.718 | 0.368 | 2.350 | 3.086 | **0.7616** |
| 2 | 7.389 | 0.135 | 7.254 | 7.524 | **0.9640** |
| 3 | 20.086 | 0.050 | 20.036 | 20.136 | **0.9951** |
| 5 | 148.41 | 0.0067 | 148.40 | 148.42 | **0.9999** |
| 10 | 22026 | 0.0000454 | 22026 | 22026 | **0.99999999..** |
| 12039 | 10^5228 | ≈ 0 | 10^5228 | 10^5228 | **1.0** |

!!! note "Why the computer says exactly 1.0"
    Mathematically, tanh **never** reaches exactly 1 — it only approaches it asymptotically. But computers use 64-bit floating point (float64), which has a smallest representable positive number of ≈ 5×10^-324. Since e^-12039 ≈ 10^-5228 is far below that threshold, the computer stores it as 0. In practice, `tanh(x) = 1.0` exactly for any x ≥ ~19.

**Python verification:**

```python
import numpy as np

print(f"tanh(12039) = {np.tanh(12039)}")        # 1.0
print(f"e^-12039    = {np.exp(-12039)}")         # 0.0 (underflow)
print(f"1 - tanh(5) = {1 - np.tanh(5):.2e}")    # 1.81e-04
print(f"1 - tanh(10)= {1 - np.tanh(10):.2e}")   # 8.27e-09
print(f"1 - tanh(20)= {1 - np.tanh(20):.2e}")   # 0.00e+00 ← exact 1.0
```

### Python APIs for tanh

| Library | Usage | GPU | Autodiff | Best for |
|---|---|---|---|---|
| `math.tanh(x)` | scalar | ❌ | ❌ | Simple calculations |
| `np.tanh(arr)` | ndarray | ❌ | ❌ | Data preprocessing |
| `torch.tanh(t)` | Tensor | ✅ | ✅ | PyTorch model training |
| `tf.math.tanh(t)` | Tensor | ✅ | ✅ | TensorFlow model training |

---

## Data Preprocessing for Time Series

### Scalers from sklearn.preprocessing

| Scaler | Method | Good for LSTM? | Why |
|---|---|---|---|
| **MinMaxScaler** | Scales to [0,1] range | ✅ Best choice | LSTM sigmoid/tanh activations work best with bounded inputs |
| **StandardScaler** | Zero mean, unit variance | ⚠️ Use with caution | Assumes stationary data; most time series are non-stationary |
| **RobustScaler** | Uses median & IQR | ⚠️ Situational | Good for outliers/spikes, but unbounded output can cause issues |
| **MaxAbsScaler** | Scales by max absolute value | ⚠️ Situational | Preserves sparsity and sign; rare fit for time series |

!!! tip "Best practice"
    Always `fit()` on training data only, then `transform()` on both train and test. Fitting on the full dataset causes data leakage.

**Recommended pattern:**

```python
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler(feature_range=(0, 1))
train_scaled = scaler.fit_transform(train_data)    # fit on train only
test_scaled = scaler.transform(test_data)           # transform test

# After prediction
predictions = scaler.inverse_transform(pred_scaled)
```

!!! warning "Watch out for non-stationarity"
    If test data has values outside the training range, MinMaxScaler will produce values outside [0,1]. Consider differencing the series first, using a rolling window scaler, or clipping outliers.

---

## LSTM Input Shape

### Why LSTM Requires 3D Input: (samples, timesteps, features)

| Dimension | Meaning | Example (stock prediction) |
|---|---|---|
| **samples** | Number of independent sequences (batch size) | 1000 different 30-day windows |
| **timesteps** | Length of each sequence (lookback window) | 30 days per window |
| **features** | Variables measured at each timestep | price, volume, RSI = 3 features |

At each timestep, the LSTM cell receives **one slice** of features and combines it with memory from previous steps:

```
Timestep:    t=0         t=1         t=2        ...    t=29
              │           │           │                  │
Input:    [p,v,rsi]   [p,v,rsi]   [p,v,rsi]         [p,v,rsi]
              ▼           ▼           ▼                  ▼
           ┌──────┐   ┌──────┐   ┌──────┐          ┌──────┐
    h₀ ──▶ │ LSTM │──▶│ LSTM │──▶│ LSTM │──▶ ... ──│ LSTM │──▶ output
           └──────┘   └──────┘   └──────┘          └──────┘
```

**Reshaping 2D data for LSTM:**

```python
lookback = 30
X = []
for i in range(lookback, len(data)):
    X.append(data[i - lookback:i])  # slice 30 rows

X = np.array(X)  # shape: (970, 30, 3)
```

!!! note "`input_shape` in the first LSTM layer"
    Only needs `(timesteps, features)` — Keras infers the samples dimension automatically from the batch.

---

## Building an LSTM Model (Keras Sequential API)

```python
model = tf.keras.models.Sequential([
    tf.keras.layers.LSTM(50, return_sequences=True, input_shape=(timesteps, features)),
    tf.keras.layers.LSTM(50),
    tf.keras.layers.Dense(1),
])

model.compile(optimizer='adam', loss='mse')
model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.1)
predictions = model.predict(X_test)
```

| API | Use case |
|---|---|
| `Sequential` | Linear stack of layers (most LSTM time series models) |
| `Functional` | Multi-input/output, shared layers, skip connections |
| `Subclassing` | Full custom forward pass logic |

---

## Training Workflow: Scale → Train → Predict → Inverse Transform

The model lives in scaled space. Only come back to original space for evaluation.

```
Raw data ──▶ scaler.fit_transform() ──▶ Scaled data ──▶ Train LSTM
                                                              │
                                                              ▼
Raw predictions ◀── scaler.inverse_transform() ◀── Scaled predictions
```

```python
scaler = MinMaxScaler(feature_range=(0, 1))
train_scaled = scaler.fit_transform(train_data)   # fit + transform
test_scaled = scaler.transform(test_data)          # transform only

model.fit(X_train_scaled, y_train_scaled, epochs=50)
pred_scaled = model.predict(X_test_scaled)

# Inverse transform only for evaluation/display
predictions = scaler.inverse_transform(pred_scaled)
rmse = np.sqrt(np.mean((predictions - actual_values) ** 2))
```

!!! warning "Why you must train on scaled data"
    - LSTM activations (sigmoid, tanh) have bounded ranges — raw values like 12039 saturate these functions, killing gradients
    - Large input values → exploding/vanishing gradients
    - Features on different scales cause the optimizer to zigzag
    - MSE loss on raw values would be dominated by large-scale features

---

## Evaluation Metrics

### Metric Functions

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def metric(y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    r2 = r2_score(y_true, y_pred)
    print(f"MAE={mae:.2f} RMSE={rmse:.2f} MAPE={mape:.1f}% R²={r2:.4f}")
```

### What Each Metric Means

| Metric | Meaning | Poor | Acceptable | Good |
|---|---|---|---|---|
| **MAE** | Average absolute error in original units | — | — | Lower is better |
| **RMSE** | Penalizes large errors more than MAE | — | — | Close to MAE = consistent |
| **MAPE** | Percentage error relative to true values | > 20% | 10–20% | < 10% |
| **R²** | Variance explained by model (1.0 = perfect) | < 0.5 | 0.5–0.8 | > 0.8 |

!!! tip "RMSE vs MAE gap"
    If RMSE >> MAE, the model has some predictions with very large errors (spikes). Investigate those outliers.

!!! tip "MAPE with small values"
    MAPE is inflated when true values are near zero. Use symmetric MAPE (sMAPE) instead:
    ```python
    smape = np.mean(2 * np.abs(y_true - y_pred) / (np.abs(y_true) + np.abs(y_pred))) * 100
    ```

### Improving Underperforming Models (R² < 0.5)

| Issue | Fix |
|---|---|
| Underfitting | Increase LSTM units, add layers, train more epochs |
| Insufficient features | Add day_of_week, hour_of_day, lag features, rolling stats |
| Too short lookback | Experiment with longer timesteps (48h, 72h, 168h) |
| No stationarity handling | Difference the series or add trend features |
| Slow convergence | Use `ReduceLROnPlateau` and `EarlyStopping` callbacks |

```python
# Improved model with dropout and callbacks
model = Sequential([
    LSTM(128, return_sequences=True, input_shape=(timesteps, features)),
    Dropout(0.2),
    LSTM(64),
    Dropout(0.2),
    Dense(1)
])

callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5),
]
model.compile(optimizer='adam', loss='mse')
model.fit(X_train, y_train, epochs=100, callbacks=callbacks, validation_split=0.1)
```

---

## Visualization

### Plotting Predictions with Forecast Zone

```python
nr_datapoints = 24 * 7                        # last 7 days
nr_datapoints_addon = nr_datapoints + 12       # + 12h forecast

y_true = y_val.flatten()[-nr_datapoints:]      # 168 points
y_pred = y_val_pred.flatten()[-nr_datapoints_addon:]  # 180 points

x_true = np.arange(0, nr_datapoints)
x_pred = np.arange(nr_datapoints_addon - len(y_pred), nr_datapoints_addon)

fig, ax = plt.subplots(figsize=(15, 5))
sns.lineplot(x=x_true, y=y_true, color=colors[0], label="true", ax=ax)
sns.lineplot(x=x_pred, y=y_pred, color=colors[1], label="predicted", ax=ax)

# Forecast zone
ax.axvline(x=nr_datapoints, color='gray', linestyle='--', alpha=0.5, label="forecast start")
ax.axvspan(nr_datapoints, nr_datapoints_addon, alpha=0.1, color='orange', label="forecast zone")

# Formatting
ax.set_xticks(np.arange(0, nr_datapoints_addon + 1, 24))
ax.legend(fontsize=14, loc='lower center')
ax.grid(alpha=0.3)
```