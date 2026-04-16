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
