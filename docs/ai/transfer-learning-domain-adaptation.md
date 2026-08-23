# Transfer Learning & Domain Adaptation

*Written: 2026-08-23*

## Transfer Learning Overview

### Core Idea

Leverage knowledge from a source task/domain to improve learning on a target task/domain.

```
Source Domain (abundant data)          Target Domain (limited data)
┌─────────────────────────┐           ┌─────────────────────────┐
│  ImageNet (14M images)  │           │  Medical X-rays (500)   │
│  Large text corpora     │  ──→      │  Domain-specific text   │
│  Pre-trained model      │  transfer │  Few-shot task          │
└─────────────────────────┘           └─────────────────────────┘
```

### Taxonomy

| Category | Source/Target | Example |
|----------|--------------|---------|
| **Inductive TL** | Same/different domain, different task | ImageNet → bird species classification |
| **Transductive TL** | Different domain, same task | English sentiment → German sentiment |
| **Unsupervised TL** | No labels in either domain | Pre-train representations, transfer |
| **Domain Adaptation** | Different distributions, same task | Synthetic → real images |
| **Domain Generalization** | Train on multiple domains, generalize to unseen | Multiple hospitals → new hospital |

---

## Transfer Learning Strategies

### Feature Extraction (Frozen Backbone)

```
Pre-trained model: [Backbone (frozen)] → [New head (trainable)]

Steps:
1. Load pre-trained model (e.g., ResNet-50 on ImageNet)
2. Remove classification head
3. Freeze all backbone parameters
4. Add new task-specific head
5. Train only the head on target data

When: Very small target dataset (< 1000 samples)
Why:  Prevents overfitting by keeping pre-trained features intact
```

### Fine-Tuning (Full or Partial)

```
Pre-trained model: [Backbone (trainable)] → [New head (trainable)]

Strategies:
├── Full fine-tuning: update all parameters
├── Gradual unfreezing: unfreeze layers progressively (top → bottom)
├── Discriminative LR: lower learning rate for earlier layers
└── Layer freezing: freeze first N layers, fine-tune rest
```

**Discriminative learning rates:**

```
Layer 1-4  (low-level features):  lr × 0.01
Layer 5-8  (mid-level features):  lr × 0.1
Layer 9-12 (high-level features): lr × 1.0
New head:                          lr × 10.0
```

### When to Fine-Tune vs Feature Extract

| Scenario | Strategy | Reasoning |
|----------|----------|-----------|
| Small data, similar domain | Feature extraction | Avoid overfitting, features transfer well |
| Small data, different domain | Fine-tune top layers only | Adapt high-level features |
| Large data, similar domain | Full fine-tuning (small lr) | Plenty of data to adapt |
| Large data, different domain | Full fine-tuning or train from scratch | May need to relearn features |

---

## Pre-Training Paradigms

### Self-Supervised Pre-Training

| Method | Domain | How | Models |
|--------|--------|-----|--------|
| Masked Language Modeling | NLP | Predict masked tokens | BERT, RoBERTa |
| Causal Language Modeling | NLP | Predict next token | GPT, LLaMA |
| Masked Image Modeling | Vision | Predict masked patches | MAE, BEiT |
| Contrastive Learning | Vision | Align augmented views | SimCLR, MoCo, DINO |
| CLIP-style | Multimodal | Align image-text pairs | CLIP, SigLIP |
| Denoising | Any | Reconstruct corrupted input | T5, diffusion models |

### Contrastive Learning

```
SimCLR framework:
    Image x → augment → view_1, view_2
    Encoder: f(view_1) → z_1,  f(view_2) → z_2
    
    Loss (InfoNCE): maximize similarity(z_1, z_2) for same image
                    minimize similarity(z_1, z_j) for different images

    Temperature-scaled: L = -log(exp(sim(z_i, z_j)/τ) / Σ_k exp(sim(z_i, z_k)/τ))
```

### Masked Image Modeling (MAE)

```
Input image → split into patches → mask 75% of patches
    │
Visible patches → Encoder (ViT) → latent representations
    │
All tokens (visible + mask tokens) → Decoder → reconstruct masked pixels
    │
Loss: MSE on masked patches only

Key insight: high masking ratio (75%) forces model to learn semantics,
not just interpolate from nearby patches
```

---

## Domain Adaptation

### Problem Setting

```
Source domain: labeled data (X_s, y_s) ~ P_s(X, Y)
Target domain: unlabeled data X_t ~ P_t(X)  (or very few labels)
Goal: train model that performs well on target domain

Challenge: P_s(X) ≠ P_t(X) — different feature distributions
           (domain shift / dataset bias / distribution shift)
```

### Types of Domain Shift

| Shift type | What changes | Example |
|-----------|-------------|---------|
| Covariate shift | P(X) changes, P(Y\|X) same | Camera change (lighting, angle) |
| Label shift | P(Y) changes, P(X\|Y) same | Different disease prevalence by hospital |
| Concept shift | P(Y\|X) changes | Word meaning changes over time |
| Dataset bias | Spurious correlations differ | Cows on grass (training) vs beach (test) |

### Approaches

#### Distribution Alignment

| Method | How | Loss/Metric |
|--------|-----|-------------|
| Maximum Mean Discrepancy (MMD) | Minimize distance between domain feature distributions | MMD kernel metric |
| CORAL (CORrelation ALignment) | Align second-order statistics (covariance) | Frobenius norm of covariance difference |
| DANN (Domain-Adversarial) | Adversarial training: fool domain classifier | Domain confusion loss |
| CDAN | Class-conditional domain alignment | Conditional adversarial loss |

#### Domain-Adversarial Neural Network (DANN)

```
Input → Feature Extractor (shared) → features
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                                         ▼
         Label Predictor                          Domain Classifier
         (classify task)                          (predict source/target)
              │                                          │
         Task loss (minimize)                    Domain loss (MAXIMIZE via
                                                 Gradient Reversal Layer)

GRL: during backprop, gradient is negated → feature extractor learns
     domain-INVARIANT representations (that confuse domain classifier)
```

#### Self-Training / Pseudo-Labeling

```
1. Train model on source labeled data
2. Predict labels for target unlabeled data (pseudo-labels)
3. Filter high-confidence predictions (threshold > 0.95)
4. Retrain model on source data + pseudo-labeled target data
5. Repeat (iteratively improve pseudo-labels)

Variants:
- FixMatch: weak augmentation → pseudo-label, strong augmentation → train
- SHOT: information maximization + self-training (no source data needed)
- AdaMatch: distribution alignment + pseudo-labeling
```

---

## Few-Shot Learning

### Problem

Learn to classify new classes from very few examples (1-5 per class).

### Approaches

| Approach | Method | Key idea |
|----------|--------|----------|
| Metric learning | Siamese, Prototypical, Matching Networks | Learn embedding space where same-class examples are close |
| Optimization-based | MAML, Reptile | Learn initialization that adapts quickly to new tasks |
| Augmentation-based | Hallucinator networks | Generate synthetic examples for few-shot classes |
| In-context learning | GPT-style LLMs | Provide examples in the prompt |

### Prototypical Networks

```
Support set: K classes, N examples each (K-way N-shot)
Query set: examples to classify

1. Embed all support examples: z = f_θ(x)
2. Compute class prototypes: c_k = (1/N) Σ f_θ(x_i) for class k
3. Classify query by nearest prototype:
   P(y=k|x) = softmax(-||f_θ(x) - c_k||²)
```

### MAML (Model-Agnostic Meta-Learning)

```
Meta-training (learn to learn):
    For each task T_i:
        1. Inner loop: take few gradient steps on task T_i's support set
           θ'_i = θ - α · ∇_θ L(T_i, θ)
        2. Outer loop: evaluate adapted model on T_i's query set
           Meta-loss += L(T_i, θ'_i)
    
    Update meta-parameters: θ ← θ - β · ∇_θ Σ L(T_i, θ'_i)

At test time:
    New task → few gradient steps from θ → adapted model θ'
    (fast adaptation because θ is in a region that's easy to adapt from)
```

---

## Continual Learning (Lifelong Learning)

### The Catastrophic Forgetting Problem

```
Train on Task A → good on A
Train on Task B → good on B, BAD on A (forgotten!)
Train on Task C → good on C, BAD on A and B

Goal: learn tasks sequentially without forgetting previous ones
```

### Strategies

| Approach | Method | Examples |
|----------|--------|---------|
| Regularization | Penalize changes to important weights | EWC, SI, LwF |
| Replay | Store/generate examples from old tasks | Experience Replay, DGR |
| Architecture | Allocate separate parameters per task | PackNet, Progressive Nets |
| Prompt-based | Learn task-specific prompts, shared backbone | L2P, DualPrompt |

### Elastic Weight Consolidation (EWC)

$$L_{total} = L_{task_B}(\theta) + \frac{\lambda}{2} \sum_i F_i (\theta_i - \theta^*_{A,i})^2$$

- F_i = Fisher information matrix diagonal (importance of weight i for task A)
- θ*_A = optimal parameters for task A
- Important weights (high F_i) are anchored near task A solution
- Less important weights are free to adapt to task B

---

## Parameter-Efficient Transfer

### Methods for Large Models

| Method | Trainable params | Approach |
|--------|-----------------|----------|
| Full fine-tuning | 100% | Update all weights |
| Linear probing | < 0.1% | Only train classification head |
| LoRA | 0.1-1% | Low-rank additive matrices on attention |
| QLoRA | 0.1-1% (4-bit base) | LoRA + quantized backbone |
| Adapters | 1-5% | Small bottleneck modules between layers |
| Prefix tuning | < 0.1% | Learnable prefix tokens per layer |
| Prompt tuning | < 0.01% | Learnable soft prompt at input |
| BitFit | 0.1% | Only train bias terms |
| IA³ | < 0.01% | Learned rescaling of activations |
| DoRA | 0.1-1% | Decomposed weight into magnitude + direction |

### Adapter Architecture

```
Original Transformer layer:
    Input → Self-Attention → Add&Norm → FFN → Add&Norm → Output

With adapter:
    Input → Self-Attention → Add&Norm → [Adapter] → FFN → Add&Norm → [Adapter] → Output

Adapter module (bottleneck):
    Input (d) → Down-project (d→r) → ReLU → Up-project (r→d) → Residual add
    
    Only r×d + d×r parameters added per adapter (r << d)
```

---

## Domain Generalization

### Goal

Train on multiple source domains, generalize to an unseen target domain (no target data at all).

### Methods

| Method | Approach | Example |
|--------|----------|---------|
| Data augmentation | Create domain diversity artificially | Style randomization, adversarial augmentation |
| Domain-invariant representations | Learn features that are stable across domains | IRM, CORAL, domain adversarial |
| Meta-learning | Simulate domain shift during training | MLDG, MetaReg |
| Ensemble/averaging | Average predictions across domain-specific models | DomainBed baselines |
| Causal reasoning | Learn causal (not spurious) features | IRM, CausIRL |

### Invariant Risk Minimization (IRM)

```
Objective: find features Φ such that the optimal classifier on top of Φ
           is the SAME across all environments (domains)

L_IRM = Σ_e L_e(w ∘ Φ) + λ · ||∇_w L_e(w ∘ Φ)|_{w=1.0}||²

Penalty term: if the gradient at w=1 is non-zero for some environment,
              then the representation is not invariant
              → force features that work equally well everywhere
```

---

## Test-Time Adaptation (TTA)

### Concept

Adapt model at inference time when encountering distribution shift — no source data needed.

| Method | Approach | Requirements |
|--------|----------|-------------|
| TTT (Test-Time Training) | Self-supervised auxiliary task at test time | Auxiliary head during training |
| TENT | Minimize entropy on test predictions (update BN stats) | BatchNorm layers |
| MEMO | Augment test input, minimize entropy across augmentations | None (any model) |
| DUA | Update BatchNorm statistics with test data | BatchNorm layers |
| TPT (Test-time Prompt Tuning) | Optimize prompt at test time for CLIP | Prompt-based model |

---

## Practical Guide

### Pre-Trained Model Selection

| Task domain | Recommended pre-training | Model |
|-------------|-------------------------|-------|
| Natural images | ImageNet-21K or CLIP | ConvNeXt, ViT, EVA |
| Medical images | ImageNet → domain-specific (RadImageNet) | ResNet, ViT-B |
| Text (English) | Large web corpus | BERT, RoBERTa, LLaMA |
| Text (multilingual) | Multilingual web corpus | XLM-R, mBERT, NLLB |
| Code | Code + NL pre-training | CodeLlama, StarCoder |
| Audio/Speech | Large speech corpus | Whisper, wav2vec 2.0 |
| Video | Video + image pre-training | VideoMAE, InternVideo |
| Scientific text | Papers (S2ORC, PubMed) | SciBERT, BiomedCLIP |
| Molecules | Molecular databases | MolBERT, Uni-Mol |

### Fine-Tuning Recipe (Vision)

```
1. Load pre-trained model (e.g., timm.create_model('vit_base', pretrained=True))
2. Replace head for target number of classes
3. Optimizer: AdamW with weight decay 0.01-0.05
4. Learning rate: 1e-4 to 5e-5 (10× less than training from scratch)
5. Schedule: linear warmup (5-10%) + cosine decay
6. Augmentation: RandAugment + Mixup + CutMix
7. Regularization: label smoothing 0.1, stochastic depth
8. Epochs: 10-100 depending on data size
9. EMA (Exponential Moving Average) of weights

Critical: lower lr for backbone, higher lr for head
```

### Fine-Tuning Recipe (NLP / LLM)

```
1. Load pre-trained model (e.g., LLaMA-3-8B)
2. Apply LoRA (rank 8-64, α = 16-32) on q, k, v, o projections
3. Learning rate: 1e-4 to 2e-4
4. Batch size: small (4-16) with gradient accumulation
5. Epochs: 1-5 (less for larger models, more for small datasets)
6. Warmup: 3-10% of steps
7. Context length: pack multiple examples per sequence
8. Data: high-quality instruction-response pairs
9. Evaluation: held-out set + task-specific benchmarks
```
