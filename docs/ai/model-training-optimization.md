---
tags:
  - intermediate
  - foundations
---

# Model Training & Optimization

*Written: 2026-08-23*

## Training Loop Anatomy

```
for epoch in range(num_epochs):
    for batch in dataloader:
        # Forward pass
        predictions = model(batch.inputs)
        loss = loss_function(predictions, batch.targets)
        
        # Backward pass
        optimizer.zero_grad()
        loss.backward()                # compute gradients
        clip_grad_norm_(model.parameters(), max_norm)  # gradient clipping
        optimizer.step()               # update parameters
        scheduler.step()               # adjust learning rate
    
    # Validation
    val_loss = evaluate(model, val_dataloader)
    early_stopping.check(val_loss)
```

---

## Loss Functions

### Regression Losses

| Loss | Formula | Properties |
|------|---------|------------|
| MSE (L2) | (1/n) Σ(y - ŷ)² | Penalizes large errors heavily, differentiable everywhere |
| MAE (L1) | (1/n) Σ\|y - ŷ\| | Robust to outliers, not differentiable at 0 |
| Huber | L2 if \|e\| < δ, else δ·(\|e\| - δ/2) | Best of MSE + MAE, smooth transition |
| Log-Cosh | (1/n) Σ log(cosh(y - ŷ)) | Similar to Huber, twice differentiable |
| Quantile | τ·max(e,0) + (1-τ)·max(-e,0) | Predict specific percentiles |

### Classification Losses

| Loss | Formula | Use case |
|------|---------|----------|
| Binary Cross-Entropy | -[y·log(ŷ) + (1-y)·log(1-ŷ)] | Binary classification |
| Categorical CE | -Σ yᵢ·log(ŷᵢ) | Multi-class (one-hot) |
| Focal Loss | -α(1-ŷ)^γ · log(ŷ) | Imbalanced classes (γ=2 typical) |
| Label Smoothing CE | CE with soft targets: y' = (1-α)·y + α/K | Prevent overconfidence |
| Hinge Loss | max(0, 1 - y·ŷ) | SVM-style margin |

### Specialized Losses

| Loss | Formula/Concept | Use case |
|------|----------------|----------|
| Contrastive | Pull positives together, push negatives apart | Representation learning |
| Triplet | max(0, d(a,p) - d(a,n) + margin) | Face recognition, retrieval |
| InfoNCE | -log(exp(sim(q,k⁺)) / Σexp(sim(q,kᵢ))) | CLIP, SimCLR |
| KL Divergence | Σ p·log(p/q) | Distribution matching (VAE) |
| Reconstruction (L1/L2) | Pixel-level or feature-level difference | Autoencoders, super-resolution |
| Perceptual | VGG feature distance between images | Style transfer, image generation |
| WGAN-GP | Wasserstein + gradient penalty | GAN training stability |

---

## Optimizers

### Gradient Descent Family

**Vanilla SGD:**

$$\theta_{t+1} = \theta_t - \eta \cdot \nabla_\theta L(\theta_t)$$

**SGD with Momentum:**

$$v_t = \beta \cdot v_{t-1} + \nabla_\theta L$$
$$\theta_{t+1} = \theta_t - \eta \cdot v_t$$

- Momentum β typically 0.9
- Accumulates gradient direction — accelerates through flat regions, dampens oscillation

**Nesterov Accelerated Gradient (NAG):**

$$v_t = \beta \cdot v_{t-1} + \nabla_\theta L(\theta_t - \eta \cdot \beta \cdot v_{t-1})$$

- "Look ahead" — compute gradient at anticipated position
- Slightly better convergence than standard momentum

### Adaptive Learning Rate Methods

**AdaGrad:**

$$\theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{G_t + \epsilon}} \cdot g_t$$

where G_t = sum of squared past gradients. Problem: learning rate monotonically decreases → may stop learning.

**RMSProp:**

$$E[g^2]_t = \beta \cdot E[g^2]_{t-1} + (1-\beta) \cdot g_t^2$$
$$\theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{E[g^2]_t + \epsilon}} \cdot g_t$$

- Exponential moving average of squared gradients (fixes AdaGrad's decay)
- β = 0.99 typical

**Adam (Adaptive Moment Estimation):**

$$m_t = \beta_1 \cdot m_{t-1} + (1-\beta_1) \cdot g_t \quad \text{(1st moment — mean)}$$
$$v_t = \beta_2 \cdot v_{t-1} + (1-\beta_2) \cdot g_t^2 \quad \text{(2nd moment — variance)}$$
$$\hat{m}_t = m_t / (1-\beta_1^t) \quad \text{(bias correction)}$$
$$\hat{v}_t = v_t / (1-\beta_2^t)$$
$$\theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon} \cdot \hat{m}_t$$

Default hyperparameters: β₁ = 0.9, β₂ = 0.999, ε = 1e-8.

**AdamW (Adam with decoupled Weight Decay):**

$$\theta_{t+1} = \theta_t - \eta \left( \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon} + \lambda \cdot \theta_t \right)$$

- Decouples weight decay from gradient-based update
- Standard for Transformer training
- λ = 0.01 to 0.1 typical

### Optimizer Comparison

| Optimizer | Strengths | Weaknesses | Best for |
|-----------|-----------|-----------|----------|
| SGD + Momentum | Best generalization, simple | Needs LR tuning, slow convergence | CNNs, when final accuracy matters |
| Adam | Fast convergence, adaptive | May generalize worse, memory 2× | Default choice, prototyping |
| AdamW | Good for Transformers, decoupled decay | Same memory as Adam | LLMs, BERT, ViT |
| LAMB | Layer-wise scaling for large batches | Complex | Large batch distributed training |
| Lion | Memory efficient (sign-based update) | Newer, less validated | LLM training |
| Sophia | Second-order approximation | Compute overhead | Faster LLM convergence |

---

## Learning Rate Scheduling

### Schedules

| Schedule | Behavior | Use case |
|----------|----------|----------|
| Constant | η = η₀ | Baselines |
| Step decay | η *= factor every N epochs | Classic CNN training |
| Exponential | η = η₀ · γ^t | Smooth decay |
| Cosine annealing | η = η_min + 0.5·(η_max - η_min)·(1 + cos(πt/T)) | Transformers, modern CNNs |
| Linear warmup + decay | Ramp up, then decrease | LLMs, BERT fine-tuning |
| OneCycleLR | Warmup → max → decay (single cycle) | Fast convergence (super-convergence) |
| ReduceOnPlateau | Reduce when metric stalls | Adaptive, any task |

### Warmup

```
Warmup schedule (linear):
    if step < warmup_steps:
        lr = base_lr * (step / warmup_steps)
    else:
        lr = cosine_decay(step - warmup_steps)
```

**Why warmup?**
- Early gradients are large and unreliable (random initialization)
- Adam's moment estimates are biased initially
- Prevents early divergence, especially in Transformers
- Typical warmup: 1-10% of total training steps

### Learning Rate Finder

```
1. Start with very small lr (1e-7)
2. Increase lr exponentially each batch
3. Record loss at each lr
4. Plot loss vs lr
5. Pick lr where loss decreases fastest (steepest slope)
   → typically 10× below the divergence point
```

---

## Regularization

### Weight Regularization

| Method | Mechanism | Effect |
|--------|-----------|--------|
| L2 (Weight Decay) | Add λ·\|\|w\|\|² to loss | Shrink all weights toward zero |
| L1 | Add λ·\|\|w\|\|₁ to loss | Sparse weights (feature selection) |
| ElasticNet | L1 + L2 combined | Sparse + grouped selection |

### Structural Regularization

| Method | How it works | Typical value |
|--------|-------------|---------------|
| Dropout | Randomly zero activations during training | 0.1-0.5 |
| DropPath | Drop entire residual paths | 0.1-0.3 (ViT) |
| DropConnect | Zero random weights (not activations) | — |
| Stochastic Depth | Skip layers randomly during training | Linear decay 0→0.5 |

**Dropout mechanics:**

```
Training:  h_i = h_i * Bernoulli(1-p) / (1-p)    # inverted dropout
Inference: h_i = h_i                               # no dropout, no scaling
```

### Data Regularization

| Method | Approach | Domain |
|--------|----------|--------|
| Data augmentation | Random transforms (flip, crop, color) | Images |
| Mixup | Linear interpolation of input pairs | Images, tabular |
| CutMix | Replace patch with another image's patch | Images |
| Label smoothing | Soften one-hot labels | Any classification |
| Back-translation | Translate to language B then back to A | NLP |
| Masking | Random token masking during training | NLP |

### Normalization (as regularizer)

| Method | Normalizes across | Used in |
|--------|-------------------|---------|
| Batch Norm | Batch dimension (per feature) | CNNs |
| Layer Norm | Feature dimension (per sample) | Transformers |
| Group Norm | Groups of channels | Small batch sizes |
| RMS Norm | Root mean square of features | LLaMA, Mistral |
| Instance Norm | Per channel per sample | Style transfer |

**Batch Normalization:**

$$\hat{x}_i = \frac{x_i - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}} \cdot \gamma + \beta$$

- μ_B, σ_B = batch mean/variance (training) or running stats (inference)
- γ, β = learnable scale and shift
- Reduces internal covariate shift, allows higher learning rates, acts as regularizer

---

## Gradient Issues & Solutions

### Vanishing Gradients

| Cause | Solution |
|-------|----------|
| Deep networks with sigmoid/tanh | Use ReLU family activations |
| Very deep networks | Residual connections (ResNet) |
| Recurrent networks (long sequences) | LSTM/GRU gates, or use Transformers |
| Multiplicative interactions | Careful initialization (Xavier, He) |

### Exploding Gradients

| Cause | Solution |
|-------|----------|
| Large weights | Gradient clipping (by norm or value) |
| Poor initialization | He/Xavier initialization |
| High learning rate | Warmup schedule |
| Recurrent networks | Truncated BPTT, gradient clipping |

### Gradient Clipping

```
# Clip by global norm (most common)
total_norm = sqrt(sum(p.grad.norm()² for p in parameters))
if total_norm > max_norm:
    for p in parameters:
        p.grad *= max_norm / total_norm

# Clip by value
for p in parameters:
    p.grad.clamp_(-clip_value, clip_value)
```

Typical max_norm values: 1.0 (LLMs), 5.0 (general), 0.5 (sensitive tasks).

---

## Weight Initialization

| Method | Formula | Best for |
|--------|---------|----------|
| Xavier/Glorot (uniform) | U(-√(6/(n_in+n_out)), √(6/(n_in+n_out))) | tanh, sigmoid activations |
| Xavier/Glorot (normal) | N(0, 2/(n_in+n_out)) | tanh, sigmoid |
| He/Kaiming (normal) | N(0, 2/n_in) | ReLU family |
| He/Kaiming (uniform) | U(-√(6/n_in), √(6/n_in)) | ReLU family |
| Orthogonal | QR decomposition of random matrix | RNNs |
| Zero | All zeros | Biases (common default) |

**Principle:** Keep variance of activations approximately constant across layers.

---

## Distributed Training

### Data Parallelism

```
┌─────────────────────────────────────────────────────┐
│                  Parameter Server / AllReduce         │
└──────────┬──────────────┬──────────────┬────────────┘
           │              │              │
     ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐
     │  GPU 0    │ │  GPU 1    │ │  GPU 2    │
     │  Batch 0  │ │  Batch 1  │ │  Batch 2  │
     │  Model    │ │  Model    │ │  Model    │
     │  (full)   │ │  (full)   │ │  (full)   │
     └───────────┘ └───────────┘ └───────────┘
     
Each GPU: forward + backward on its batch
AllReduce: average gradients across GPUs
Each GPU: apply averaged gradient to its model copy
```

### Model Parallelism

| Strategy | Splits | When to use |
|----------|--------|-------------|
| Tensor Parallelism (TP) | Split individual layers across GPUs | Single-node, large layers |
| Pipeline Parallelism (PP) | Assign layer groups to different GPUs | Cross-node, sequential models |
| Expert Parallelism (EP) | MoE experts on different GPUs | Mixture-of-Experts models |
| FSDP (Fully Sharded) | Shard parameters, gradients, optimizer states | Large models, multi-node |
| ZeRO (stages 1-3) | Progressive sharding of optimizer/gradient/params | DeepSpeed, any large model |

### Mixed Precision Training

```
# Automatic Mixed Precision (AMP)
with torch.autocast(device_type='cuda', dtype=torch.float16):
    output = model(input)
    loss = criterion(output, target)

scaler.scale(loss).backward()       # Scale loss to prevent underflow
scaler.step(optimizer)              # Unscale gradients, then step
scaler.update()                     # Adjust scale factor
```

**Precision hierarchy:**

| Precision | Bits | Use case | Memory saving |
|-----------|------|----------|---------------|
| FP32 | 32 | Master weights, loss scaling | Baseline |
| FP16 | 16 | Forward/backward computation | 2× |
| BF16 | 16 | Same range as FP32, less precision | 2× (preferred for LLMs) |
| FP8 (E4M3) | 8 | Forward pass (Hopper GPUs) | 4× |
| INT8 | 8 | Inference quantization | 4× |
| INT4 | 4 | Inference (GPTQ, AWQ, GGUF) | 8× |

---

## Training Strategies

### Transfer Learning

```
1. Pre-trained model (ImageNet, BERT, etc.)
2. Replace/add task-specific head
3. Freeze base layers initially
4. Fine-tune with small learning rate

Strategy:
  - Freeze all → train head only (few epochs)
  - Unfreeze top layers → fine-tune with lower lr
  - Optionally unfreeze all → very low lr
```

### Curriculum Learning

| Strategy | Concept |
|----------|---------|
| Easy-to-hard | Start with simple examples, increase difficulty |
| Anti-curriculum | Start with hard examples (sometimes better for robustness) |
| Self-paced | Model selects samples based on current loss |
| Dynamic | Adjust difficulty based on training progress |

### Knowledge Distillation

```
Teacher (large model) → soft predictions (logits / T)
Student (small model) → trained to match both:
    L = α · CE(student, hard_labels) + (1-α) · KL(student_soft, teacher_soft)

Temperature T > 1 softens probability distribution → reveals "dark knowledge"
(relative probabilities between non-target classes)
```

### Early Stopping

```
patience = 10
best_val_loss = infinity
counter = 0

for epoch in training:
    val_loss = evaluate()
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        save_checkpoint()
        counter = 0
    else:
        counter += 1
        if counter >= patience:
            break  # stop training
```

---

## Hyperparameter Tuning

### Search Methods

| Method | Approach | Efficiency |
|--------|----------|-----------|
| Grid search | Try all combinations | Exhaustive but exponential |
| Random search | Random sampling from ranges | Better than grid for most cases |
| Bayesian (Optuna, BOHB) | Model the objective function, exploit structure | Most efficient |
| Population-based (PBT) | Evolve hyperparams during training | Good for RL, large models |
| Successive halving (Hyperband) | Allocate more budget to promising configs | Fast elimination |

### Key Hyperparameters by Priority

| Priority | Hyperparameter | Typical search range |
|----------|---------------|---------------------|
| 1 (critical) | Learning rate | 1e-5 to 1e-2 (log scale) |
| 2 (important) | Batch size | 16, 32, 64, 128, 256 |
| 3 (important) | Weight decay | 1e-4 to 0.1 |
| 4 (model) | Hidden dimensions, layers | Task-dependent |
| 5 (regularization) | Dropout rate | 0.0 to 0.5 |
| 6 (schedule) | Warmup steps, decay type | 0-10% steps, cosine/linear |

---

## Debugging Training

### Common Failure Modes

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Loss = NaN | Exploding gradients, lr too high | Gradient clipping, reduce lr, check data |
| Loss doesn't decrease | lr too low, bug in data loading, wrong loss | Overfit single batch first, check labels |
| Val loss increases, train decreases | Overfitting | More data, regularization, early stopping |
| Train loss oscillates wildly | lr too high, batch too small | Reduce lr, increase batch size |
| Loss plateaus | Local minimum, lr too high for fine details | Reduce lr, change scheduler |
| Accuracy stuck at random | Labels shuffled, architecture bug | Verify data pipeline end-to-end |

### Sanity Checks

```
1. Overfit a single batch → loss should go to ~0
2. Increase model capacity → training loss should decrease
3. Add regularization → gap between train/val should shrink
4. Check gradient norms → should be stable, not growing/vanishing
5. Verify data augmentation → visualize augmented samples
6. Check class distribution → balanced or weighted loss?
7. Learning rate finder → find optimal range before full training
```
