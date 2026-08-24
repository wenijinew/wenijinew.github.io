---
tags:
  - advanced
  - research
---

# Federated Learning

*Written: 2026-08-23*

## What Is Federated Learning?

A distributed machine learning paradigm where models are trained across multiple decentralized devices or servers holding local data, without exchanging raw data.

```
Traditional ML:
    All data → Central server → Train model

Federated Learning:
    Data stays on devices → Train locally → Share only model updates
    
    ┌──────────┐     ┌──────────┐     ┌──────────┐
    │ Device 1 │     │ Device 2 │     │ Device 3 │
    │ Local    │     │ Local    │     │ Local    │
    │ Data     │     │ Data     │     │ Data     │
    │ + Model  │     │ + Model  │     │ + Model  │
    └────┬─────┘     └────┬─────┘     └────┬─────┘
         │                │                │
         └───── Model updates only ────────┘
                        │
               ┌────────▼────────┐
               │  Central Server  │
               │  (Aggregation)   │
               └─────────────────┘
```

### Why Federated Learning?

| Motivation | Description | Example |
|-----------|-------------|---------|
| Privacy | Data never leaves the device | Medical records, personal messages |
| Regulation | Data cannot be moved (GDPR, HIPAA) | Cross-border healthcare |
| Communication | Too expensive to transfer data centrally | Edge IoT with limited bandwidth |
| Data ownership | Organizations won't share raw data | Competing hospitals, banks |
| Scale | Data generated at billions of endpoints | Mobile keyboard prediction |

---

## Federated Averaging (FedAvg)

### Algorithm

```
Server initializes global model: w₀

For each round t = 1, 2, ..., T:
    1. Server sends global model w_t to subset of clients (C fraction)
    2. Each selected client k:
        a. Receives w_t
        b. Trains locally for E epochs on local data:
           w_k^{t+1} = w_t - η · ∇L(w_t; D_k)  (multiple SGD steps)
        c. Sends update Δw_k = w_k^{t+1} - w_t to server
    3. Server aggregates:
        w_{t+1} = w_t + Σ_k (n_k / n) · Δw_k
        
        (weighted average by client data size n_k)
```

### Hyperparameters

| Parameter | Meaning | Typical values |
|-----------|---------|---------------|
| C (client fraction) | Fraction of clients selected per round | 0.01-0.1 |
| E (local epochs) | Training epochs per client per round | 1-5 |
| B (local batch size) | Mini-batch size on each client | 10-64 |
| η (learning rate) | Local SGD learning rate | 0.01-0.1 |
| T (rounds) | Total communication rounds | 100-1000+ |

---

## Challenges

### Statistical Heterogeneity (Non-IID Data)

```
IID: each client has representative sample of overall distribution
Non-IID: clients have different data distributions

Examples of non-IID:
    - Label skew: Client A has mostly cats, Client B has mostly dogs
    - Feature skew: Different hospitals have different scanners (image quality)
    - Quantity skew: Some clients have 10 samples, others have 10,000
    - Temporal skew: Data collected at different times

Impact:
    - Local models diverge (client drift)
    - Averaging diverged models → poor global model
    - Convergence is slower and less stable
```

### Solutions for Non-IID

| Method | Approach | How |
|--------|----------|-----|
| FedProx | Proximal regularization | Add ||w - w_global||² penalty to local loss |
| SCAFFOLD | Variance reduction | Control variates correct client drift |
| FedNova | Normalized averaging | Account for different local steps per client |
| FedMA | Model matching | Align neurons before averaging |
| Personalized FL | Per-client models | Local adaptation layers |
| Clustered FL | Group similar clients | Separate models per cluster |

### Communication Efficiency

```
Problem: sending full model updates is expensive
    - LLaMA-7B: 7B parameters × 4 bytes = 28 GB per round per client
    - Millions of clients × hundreds of rounds = impractical

Solutions:
```

| Method | Compression ratio | Approach |
|--------|-------------------|----------|
| Gradient compression | 100-1000× | Top-k sparsification + error feedback |
| Quantization | 4-32× | Compress updates to fewer bits |
| Structured updates | 10-100× | Low-rank factorization of updates |
| Knowledge distillation | Model-agnostic | Share soft predictions, not weights |
| Federated dropout | 2-10× | Each client trains random subset of model |
| One-shot FL | 1 round only | Single communication round |

### System Heterogeneity

| Challenge | Description | Mitigation |
|-----------|-------------|-----------|
| Straggler problem | Slow devices delay each round | Async FL, partial updates, timeout |
| Device availability | Clients go offline unpredictably | Robust aggregation, over-selection |
| Hardware diversity | Different compute capabilities | Variable local epochs, model heterogeneity |
| Network variability | Bandwidth varies across clients | Adaptive compression |

---

## Privacy & Security

### Threats to Federated Learning

| Attack | How | Impact |
|--------|-----|--------|
| Gradient inversion | Reconstruct training data from model updates | Privacy breach |
| Membership inference | Determine if a sample was used in training | Privacy breach |
| Model poisoning | Malicious client sends corrupted updates | Model degradation |
| Data poisoning | Inject mislabeled data locally | Backdoor attacks |
| Free-riding | Client participates without contributing meaningful updates | Reduced model quality |
| Inference from model | Extract global model information | IP theft |

### Gradient Inversion Attack

```
Attacker observes model update (gradient) from client:
    ∇w = (1/n) Σ ∇L(w; x_i, y_i)

Attack: optimize dummy data (x', y') to match observed gradient:
    min_{x', y'} ||∇L(w; x', y') - ∇w||²

Result: reconstructed images/text that closely match original training data!

Defense:
    - Differential privacy (add noise to updates)
    - Secure aggregation (server can't see individual updates)
    - Gradient compression/clipping (reduces information)
    - Large batch sizes (harder to invert averaged gradients)
```

### Defense Mechanisms

| Defense | Against | Mechanism | Trade-off |
|---------|---------|-----------|-----------|
| Differential Privacy (DP) | Gradient inversion, membership inference | Clip gradients + add Gaussian noise | Privacy ↔ accuracy |
| Secure Aggregation | Curious server | Cryptographic protocol (server sees only sum) | Communication overhead |
| Homomorphic Encryption | Model/data inspection | Compute on encrypted updates | 10-100× compute overhead |
| Byzantine-Robust Aggregation | Poisoning attacks | Median, trimmed mean, Krum | May reject valid updates |
| Verifiable Computation | Free-riding | Proof of computation | Additional verification cost |

### Differential Privacy in FL

```
DP-SGD adapted for FL (per-client):

1. Each client clips gradient norm: ||g_k|| ≤ C
2. Server adds calibrated noise after aggregation:
   w_{t+1} = w_t + (1/K)(Σ clip(Δw_k, C) + N(0, σ²C²I))

3. Track privacy budget (ε, δ) using privacy accountant

Privacy-utility trade-off:
    Strong privacy (ε ≈ 1): significant accuracy loss (5-15%)
    Moderate privacy (ε ≈ 8): small accuracy loss (1-3%)
    Weak privacy (ε > 20): negligible accuracy loss
```

---

## Personalization in Federated Learning

### Why Personalize?

A single global model may not serve all clients well (different distributions, preferences, domains).

### Approaches

| Method | Idea | When to use |
|--------|------|-------------|
| Fine-tuning | Global model → local fine-tuning per client | Enough local data for adaptation |
| Per-FedAvg | MAML-style meta-learning in FL | Model that adapts quickly with few local steps |
| FedPer | Shared base + personal head per client | Common features, different tasks/classes |
| FedRep | Shared representation + local linear head | Feature sharing with personalized classification |
| Local adaptation | Train local models with global regularization | Maximum personalization |
| Mixture of global + local | Interpolate between global and local model | Balance generalization and personalization |
| Clustered FL (IFCA) | Multiple global models for client clusters | Natural groups in client population |
| FedLoRA | Global base + per-client LoRA adapters | Large models with limited local adaptation |

### FedPer Architecture

```
Shared layers (federated):
    [Conv1] → [Conv2] → [Conv3] → [Pool] → [FC1]    ← aggregated
                                                │
Personal layers (local only):
                                          [FC2] → [Softmax]  ← not shared

Each client:
    1. Receives global shared layers
    2. Attaches their personal head
    3. Trains both, sends only shared layers back
```

---

## Cross-Silo vs Cross-Device FL

| Aspect | Cross-Silo | Cross-Device |
|--------|-----------|-------------|
| Clients | Organizations (hospitals, banks) | End-user devices (phones, IoT) |
| Number of clients | 2-100 | Millions-billions |
| Data per client | Large (thousands-millions of samples) | Small (tens-hundreds of samples) |
| Availability | Always online | Intermittent (charging, WiFi) |
| Trust model | Semi-trusted, contractual | Untrusted individual users |
| Communication | High bandwidth (data center) | Low/variable bandwidth (mobile) |
| Computation | Powerful servers | Limited (mobile CPU/GPU) |
| Identity | Known, authenticated | Anonymous or pseudonymous |
| Examples | Healthcare consortium, financial alliance | Keyboard prediction, Siri |

---

## Federated Learning Systems

### Frameworks

| Framework | Developer | Focus |
|-----------|-----------|-------|
| Flower (flwr) | Flower Labs | Framework-agnostic, flexible, production-ready |
| PySyft | OpenMined | Privacy-preserving ML (FL + crypto) |
| FATE | WeBank | Industrial FL, cross-silo |
| TFF (TensorFlow Federated) | Google | Research + simulation |
| FedML | FedML Inc. | Multi-platform (edge, cloud, on-premise) |
| NVFlare | NVIDIA | Enterprise FL (healthcare, finance) |
| OpenFL | Intel | Research + production |
| FedScale | University of Michigan | Benchmarking realistic FL |

### Real-World Deployments

| Deployment | Organization | Use case | Scale |
|-----------|-------------|----------|-------|
| Gboard (keyboard prediction) | Google | Next-word prediction | 1.5B+ devices |
| Siri | Apple | Voice model improvement | Billions of devices |
| Drug discovery consortium | Pharma companies (MELLODDY) | Molecular property prediction | 10 pharma companies |
| Healthcare imaging | HealthChain / NVIDIA Clara | Tumor segmentation | Multiple hospitals |
| Financial fraud detection | Credit card networks | Cross-bank fraud models | Major banks |
| Autonomous driving | Multiple OEMs | Shared driving models | Fleet vehicles |

---

## Federated Learning for LLMs

### Challenges at LLM Scale

| Challenge | Why | Mitigation |
|-----------|-----|-----------|
| Model size | 7B-70B params can't fit on edge devices | Federated fine-tuning (not pre-training from scratch) |
| Communication cost | Full model updates = 28-280 GB per round | LoRA-based FL (only send adapters) |
| Compute requirements | Full fine-tuning needs multiple GPUs | PEFT methods (LoRA, prompt tuning) |
| Privacy sensitivity | Text data is highly personal | DP + secure aggregation |
| Heterogeneous tasks | Different clients need different capabilities | Personalized adapters |

### FedLoRA (Federated LoRA)

```
Global base model: frozen LLaMA-7B (shared, never transmitted after init)
    │
Per-client LoRA adapters: A ∈ ℝ^(r×d), B ∈ ℝ^(d×r)
    │
Federated training:
    1. Each client trains their LoRA adapters locally
    2. Only LoRA weights transmitted (rank 16: ~17 MB vs 28 GB full model)
    3. Server aggregates LoRA weights
    4. Updated LoRA sent back to clients

Communication reduction: ~1600× compared to full model FL
```

---

## Evaluation & Benchmarks

### Metrics

| Metric | What it measures |
|--------|-----------------|
| Global model accuracy | Performance of aggregated model on test set |
| Per-client accuracy | How well model serves individual clients |
| Communication cost | Total bytes transmitted (rounds × update size) |
| Convergence speed | Rounds to reach target accuracy |
| Privacy guarantee | (ε, δ)-differential privacy achieved |
| Fairness | Accuracy variance across clients (low = fair) |
| Robustness | Tolerance to Byzantine/poisoning attacks |

### Benchmarks & Datasets

| Benchmark | Task | Non-IID simulation |
|-----------|------|-------------------|
| LEAF | Multi-task FL benchmark | Natural user-level partitioning |
| FedScale | Realistic FL at scale | Real device traces + heterogeneity |
| FLamby | Healthcare FL | Natural hospital splits (6 medical datasets) |
| pFL-Bench | Personalized FL | Systematic non-IID evaluation |
| OARF | Open real-world FL | Finance, healthcare, NLP |

---

## Open Problems & Future Directions

| Problem | Current state | Research direction |
|---------|--------------|-------------------|
| Communication efficiency | Compression helps but still costly at scale | One-shot FL, communication-free FL |
| Non-IID convergence | FedProx/SCAFFOLD help, not solved | Theoretical understanding, adaptive methods |
| Privacy-utility trade-off | DP causes 2-15% accuracy loss | Better privacy accountants, relaxed DP notions |
| Incentive design | How to motivate participation? | Game theory, blockchain-based rewards |
| Fairness | Global model may serve some clients poorly | Fair aggregation, personalization |
| Unlearning | Remove a client's data influence from model | Federated machine unlearning |
| Foundation models | FL + LLMs still early | Efficient federated PEFT, split learning |
| Vertical FL | Different features per client (same users) | Privacy-preserving feature sharing |
| Asynchronous FL | Stale updates from slow clients | Staleness-aware aggregation |
| Verification | How to verify clients trained honestly? | Zero-knowledge proofs, TEEs |
