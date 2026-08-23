# Bayesian Machine Learning

*Written: 2026-08-23*

## Bayesian Thinking

### Frequentist vs Bayesian

| Aspect | Frequentist | Bayesian |
|--------|-------------|----------|
| Parameters | Fixed unknown constants | Random variables with distributions |
| Probability | Long-run frequency | Degree of belief/uncertainty |
| Inference | Point estimates (MLE, p-values) | Posterior distributions |
| Uncertainty | Confidence intervals (frequentist interpretation) | Credible intervals (direct probability) |
| Data | Random (repeat experiments) | Fixed (observed once) |
| Prior knowledge | Not used formally | Encoded as prior distribution |

### Bayes' Theorem

$$P(\theta | D) = \frac{P(D | \theta) \cdot P(\theta)}{P(D)}$$

| Term | Name | Role |
|------|------|------|
| P(θ\|D) | Posterior | What we believe about θ after seeing data |
| P(D\|θ) | Likelihood | How probable the data is given parameters |
| P(θ) | Prior | What we believed before seeing data |
| P(D) | Evidence (marginal likelihood) | Normalizing constant = ∫ P(D\|θ)P(θ)dθ |

**In words:** Posterior ∝ Likelihood × Prior

---

## Bayesian Inference

### Conjugate Priors

When prior and posterior belong to the same distribution family:

| Likelihood | Prior | Posterior | Use case |
|-----------|-------|-----------|----------|
| Bernoulli | Beta | Beta | Coin flips, click-through rates |
| Multinomial | Dirichlet | Dirichlet | Categorical distributions |
| Gaussian (known σ) | Gaussian | Gaussian | Mean estimation |
| Gaussian (unknown σ) | Normal-Inverse-Gamma | Normal-Inverse-Gamma | Mean + variance |
| Poisson | Gamma | Gamma | Count data |
| Exponential | Gamma | Gamma | Wait times |

### Beta-Bernoulli Example

```
Prior: θ ~ Beta(α₀, β₀)
Data: n trials, k successes

Posterior: θ | data ~ Beta(α₀ + k, β₀ + n - k)

Point estimates:
    MAP:  (α₀ + k - 1) / (α₀ + β₀ + n - 2)
    Mean: (α₀ + k) / (α₀ + β₀ + n)

With more data, posterior concentrates (prior influence fades)
With α₀ = β₀ = 1 (uniform prior): equivalent to Laplace smoothing
```

### Maximum A Posteriori (MAP) vs Full Bayesian

| Approach | Computes | Uncertainty? | Computational cost |
|----------|----------|-------------|-------------------|
| MLE (Maximum Likelihood) | argmax_θ P(D\|θ) | No | Low |
| MAP | argmax_θ P(θ\|D) = argmax_θ P(D\|θ)P(θ) | No (point estimate) | Low |
| Full Bayesian | Entire P(θ\|D) distribution | Yes | High |

**Connection to regularization:**

```
MAP with Gaussian prior N(0, σ²) → L2 regularization (Ridge)
MAP with Laplace prior Laplace(0, b) → L1 regularization (Lasso)

log P(θ|D) = log P(D|θ) + log P(θ) - const
            = log-likelihood  + regularization term
```

---

## Approximate Inference

The posterior P(θ|D) is usually intractable (evidence integral has no closed form).

### Markov Chain Monte Carlo (MCMC)

**Goal:** Generate samples from the posterior without computing it analytically.

**Metropolis-Hastings:**

```
1. Initialize θ₀
2. For t = 1, 2, ..., T:
    a. Propose θ' from proposal distribution q(θ'|θ_t)
    b. Compute acceptance ratio:
       α = min(1, P(θ'|D) · q(θ_t|θ') / (P(θ_t|D) · q(θ'|θ_t)))
    c. Accept with probability α:
       θ_{t+1} = θ' (with prob α) or θ_t (with prob 1-α)
3. Discard burn-in samples, use remainder as posterior samples
```

**MCMC Variants:**

| Method | Key idea | When to use |
|--------|----------|-------------|
| Metropolis-Hastings | General proposal-acceptance | Simple models |
| Gibbs sampling | Sample each variable conditionally on others | Conjugate conditionals |
| HMC (Hamiltonian Monte Carlo) | Use gradient for efficient proposals | Continuous parameters, high-d |
| NUTS (No U-Turn Sampler) | Auto-tune HMC path length | Default in Stan/PyMC |

**MCMC Diagnostics:**

| Diagnostic | What it checks | Good value |
|-----------|---------------|-----------|
| R-hat (Gelman-Rubin) | Chain convergence | < 1.01 |
| Effective sample size (ESS) | Independent samples after autocorrelation | > 400 |
| Trace plot | Visual convergence check | Stable "hairy caterpillar" |
| Divergences (HMC) | Numerical issues in sampling | 0 divergences |

### Variational Inference (VI)

**Goal:** Approximate posterior with a simpler distribution q(θ) by minimizing KL divergence.

$$q^*(\theta) = \arg\min_{q \in \mathcal{Q}} KL(q(\theta) \| p(\theta|D))$$

Equivalent to maximizing the **Evidence Lower Bound (ELBO):**

$$\text{ELBO}(q) = \mathbb{E}_q[\log p(D|\theta)] - KL(q(\theta) \| p(\theta))$$

$$\log p(D) \geq \text{ELBO}(q) \quad \text{(hence "lower bound")}$$

**Mean-field VI:** Assume q factorizes: q(θ) = ∏ᵢ qᵢ(θᵢ)

| Aspect | MCMC | Variational Inference |
|--------|------|---------------------|
| Approximation | Exact (given infinite samples) | Biased (restricted q family) |
| Speed | Slow (sequential sampling) | Fast (optimization) |
| Scalability | Poor (for large data) | Good (mini-batch, GPU) |
| Uncertainty quality | Gold standard | May underestimate uncertainty |
| Multimodal posteriors | Can explore (with tricks) | Often misses modes |
| Use case | Research, small models | Production, large models |

---

## Bayesian Neural Networks (BNN)

### Concept

Replace fixed weights with weight distributions:

```
Standard NN: y = f(x; w)     where w are fixed learned values
Bayesian NN: y = f(x; w)     where w ~ P(w|D), a distribution

Prediction: P(y|x, D) = ∫ P(y|x, w) P(w|D) dw
            (integrate over all possible weight configurations)
```

### Methods for Approximate BNN Inference

| Method | Approach | Cost | Quality |
|--------|----------|------|---------|
| MC Dropout | Dropout at test time = approximate variational inference | Low (just enable dropout) | Coarse |
| Bayes by Backprop | Learn mean + variance for each weight (Gaussian VI) | 2× parameters | Good |
| SWAG | Collect weight statistics during SGD training | Low overhead | Good |
| Deep Ensembles | Train N models independently | N× training cost | Excellent |
| Laplace Approximation | Gaussian fit at MAP using Hessian | Post-hoc, cheap | Moderate |
| HMC | Full MCMC on weight space | Very expensive | Gold standard |

### MC Dropout

```
# At test time (normally dropout is off):
predictions = []
for i in range(T):  # T forward passes with dropout active
    predictions.append(model(x, dropout=True))

mean_prediction = mean(predictions)        # point estimate
uncertainty = variance(predictions)         # epistemic uncertainty
```

**Theoretical justification:** Dropout training approximates variational inference with Bernoulli approximate posterior on weights.

### Deep Ensembles

```
Train M models independently (different random seeds):
    model_1, model_2, ..., model_M

Prediction:
    mean = (1/M) Σ μ_i(x)                    # ensemble mean
    variance = (1/M) Σ [σ²_i(x) + μ²_i(x)] - mean²   # total uncertainty
    
    Aleatoric uncertainty: (1/M) Σ σ²_i(x)    (data noise)
    Epistemic uncertainty: (1/M) Σ (μ_i - mean)²  (model disagreement)
```

---

## Uncertainty Quantification

### Types of Uncertainty

| Type | Source | Reducible? | Example |
|------|--------|-----------|---------|
| Aleatoric (data) | Inherent noise in data | No (irreducible) | Sensor noise, label ambiguity |
| Epistemic (model) | Lack of knowledge/data | Yes (more data helps) | Regions with few training samples |
| Distributional | Input from different distribution | Yes (detect and handle OOD) | Novel class, corrupted input |

### Uncertainty in Decision Making

```
Confident + Correct → Trust prediction
Confident + Wrong  → Dangerous! (overconfident)
Uncertain + Correct → Could improve with more data
Uncertain + Wrong  → Correctly flagged for human review

High-stakes application:
    if uncertainty > threshold:
        defer to human expert
    else:
        use model prediction
```

### Calibration of Uncertainty

```
A model is calibrated if:
    P(y = correct | confidence = 0.8) ≈ 0.8

Reliability diagram:
    Bin predictions by confidence
    Plot accuracy per bin vs confidence
    Perfect calibration: diagonal line

Metrics:
    ECE = Expected Calibration Error = Σ (|bin_i| / n) · |acc_i - conf_i|
    Brier Score = (1/n) Σ (p_i - y_i)²
```

---

## Gaussian Processes (GP)

### Definition

A Gaussian Process is a distribution over functions:

$$f(x) \sim \mathcal{GP}(m(x), k(x, x'))$$

- m(x): mean function (often 0)
- k(x, x'): kernel (covariance function) — encodes assumptions about function smoothness

### Kernel Functions

| Kernel | Formula | Properties |
|--------|---------|-----------|
| RBF (Squared Exponential) | k(x,x') = σ² exp(-\|\|x-x'\|\|² / 2l²) | Infinitely smooth |
| Matérn-3/2 | σ²(1+√3r/l)exp(-√3r/l) | Once differentiable |
| Matérn-5/2 | σ²(1+√5r/l+5r²/3l²)exp(-√5r/l) | Twice differentiable |
| Periodic | σ² exp(-2sin²(π\|x-x'\|/p)/l²) | Repeating patterns |
| Linear | σ²(x-c)(x'-c) | Linear functions |
| Rational Quadratic | σ²(1+\|\|x-x'\|\|²/(2αl²))^(-α) | Mixture of RBFs |

**Kernel composition:** Kernels can be added/multiplied to model complex patterns.

### GP Regression (Prediction)

```
Given: training points (X, y), test points X*
Prior: f ~ GP(0, K)
Observation model: y = f(x) + ε, where ε ~ N(0, σ²_n)

Posterior predictive:
    mean:     μ* = K(X*, X) [K(X,X) + σ²_n I]⁻¹ y
    variance: Σ* = K(X*, X*) - K(X*, X) [K(X,X) + σ²_n I]⁻¹ K(X, X*)
```

**Properties:**
- Exact uncertainty quantification (posterior is Gaussian)
- Non-parametric — complexity grows with data
- Computational cost: O(n³) for training (matrix inversion) — limits to ~10K points
- Sparse GP approximations: inducing points reduce to O(nm²) where m << n

### GP for Bayesian Optimization

```
Bayesian Optimization loop:
1. Fit GP to observed (x, y) pairs
2. Compute acquisition function (e.g., Expected Improvement)
3. Find x_next = argmax acquisition(x)
4. Evaluate expensive function at x_next
5. Add (x_next, y_next) to observations
6. Repeat until budget exhausted

Acquisition functions:
    EI (Expected Improvement) = E[max(f(x) - f_best, 0)]
    UCB (Upper Confidence Bound) = μ(x) + κ·σ(x)
    PI (Probability of Improvement) = P(f(x) > f_best + ξ)
```

**Applications of Bayesian Optimization:**
- Hyperparameter tuning (Optuna, BoTorch)
- Neural architecture search
- Drug design (optimize molecular properties)
- A/B test optimization
- Materials discovery

---

## Bayesian Deep Learning in Practice

### When Bayesian Methods Add Value

| Scenario | Why Bayesian? |
|----------|--------------|
| Small data | Prior regularizes, prevents overfitting |
| Safety-critical | Uncertainty enables "I don't know" |
| Active learning | Uncertainty guides which samples to label next |
| Continual learning | Prior = previous task knowledge |
| Out-of-distribution detection | High epistemic uncertainty on OOD inputs |
| Model selection | Marginal likelihood for principled comparison |
| Decision under uncertainty | Expected utility maximization |

### When NOT Bayesian

| Scenario | Why not? |
|----------|----------|
| Abundant data, simple task | Point estimate is fine, Bayesian adds cost |
| Real-time latency critical | Multiple forward passes too slow |
| Very large models (>1B params) | Full Bayesian intractable |
| Well-calibrated by other means | Temperature scaling cheaper |

---

## Tools & Libraries

| Library | Language | Strengths |
|---------|----------|-----------|
| PyMC (v5) | Python | General Bayesian modeling, NUTS sampler |
| Stan (CmdStanPy) | Python/R/Julia | Gold-standard MCMC, rigorous diagnostics |
| NumPyro | Python (JAX) | Fast, GPU-accelerated MCMC and VI |
| Pyro | Python (PyTorch) | Deep probabilistic programming, VI |
| GPyTorch | Python (PyTorch) | Scalable Gaussian Processes |
| BoTorch | Python (PyTorch) | Bayesian Optimization (built on GPyTorch) |
| TensorFlow Probability | Python (TF) | Bayesian layers, distributions, VI |
| Edward2 | Python (TF) | Probabilistic programming |
| Laplace (PyTorch) | Python | Post-hoc Laplace approximation for NNs |
| Optuna | Python | Bayesian hyperparameter optimization (TPE) |

---

## Summary: Bayesian vs Non-Bayesian Decision Matrix

| Criterion | Bayesian preferred | Standard (non-Bayesian) preferred |
|-----------|-------------------|----------------------------------|
| Data size | Small (< 1000) | Large (> 100K) |
| Uncertainty need | Critical (medical, autonomous) | Not required |
| Interpretability | Need to understand confidence | Black-box acceptable |
| Compute budget | Moderate (can afford MCMC/ensemble) | Tight (single forward pass) |
| Prior knowledge | Strong domain expertise to encode | No useful prior available |
| Decision theory | Actions depend on uncertainty | Argmax is sufficient |
| Model complexity | Simple to moderate | Very large (LLMs, ViTs) |
