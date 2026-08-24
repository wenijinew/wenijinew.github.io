---
tags:
  - advanced
  - infrastructure
---

# MLOps & Model Deployment

*Written: 2026-08-23*

## MLOps Lifecycle

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐
│  Data   │ →  │  Model  │ →  │  Model  │ →  │  Deploy │ →  │  Monitor │
│  Prep   │    │  Train  │    │  Eval   │    │  Serve  │    │  Retrain │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └──────────┘
     ↑                                                             │
     └─────────────────────── feedback loop ───────────────────────┘
```

### Maturity Levels

| Level | Description | Characteristics |
|-------|-------------|-----------------|
| 0 — Manual | Jupyter notebooks, manual deployment | No automation, no versioning, no monitoring |
| 1 — ML Pipeline | Automated training pipeline | Versioned data/models, reproducible, manual deploy |
| 2 — CI/CD for ML | Automated training + deployment | Auto-retrain on triggers, staged rollout, monitoring |
| 3 — Full MLOps | Continuous training + continuous monitoring | Feature stores, drift detection, auto-rollback |

---

## Experiment Tracking

### What to Track

| Artifact | Examples |
|----------|---------|
| Parameters | Learning rate, batch size, architecture choices |
| Metrics | Loss, accuracy, F1 at each epoch |
| Data version | Hash of training/validation dataset |
| Code version | Git commit SHA |
| Model artifacts | Weights, checkpoints, exported models |
| Environment | Python version, package versions, hardware |
| Metadata | Training time, GPU utilization, cost |

### Platforms

| Platform | Type | Key feature |
|----------|------|-------------|
| MLflow | Open source | Experiment tracking + model registry + serving |
| Weights & Biases (W&B) | Managed | Beautiful dashboards, hyperparameter sweeps |
| Neptune | Managed | Collaboration-focused, custom metadata |
| ClearML | Open source | End-to-end orchestration |
| Comet | Managed | Code tracking, visual diff |
| DVC | Open source | Data + model versioning (Git-like) |

### Model Registry

```
Model Registry
├── Model: fraud_detector
│   ├── Version 1.0 (Staging)     ← candidate for production
│   │   ├── Metrics: F1=0.92, AUC=0.97
│   │   ├── Artifacts: model.pt, config.yaml
│   │   └── Lineage: dataset_v3, experiment_42
│   ├── Version 0.9 (Production)  ← currently serving
│   └── Version 0.8 (Archived)    ← retired
```

---

## Model Serialization & Formats

| Format | Framework | Use case |
|--------|-----------|----------|
| PyTorch (.pt/.pth) | PyTorch | Training checkpoints, fine-tuning |
| SavedModel | TensorFlow | TF Serving deployment |
| ONNX | Cross-framework | Interoperability, optimization |
| TorchScript | PyTorch | Production (no Python dependency) |
| GGUF | llama.cpp | LLM inference on CPU/edge |
| TensorRT | NVIDIA | GPU-optimized inference |
| Core ML | Apple | iOS/macOS deployment |
| OpenVINO | Intel | Intel hardware optimization |
| SafeTensors | HuggingFace | Safe, fast model loading |

### ONNX Conversion Example

```
# PyTorch → ONNX
import torch.onnx

dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    input_names=["image"],
    output_names=["prediction"],
    dynamic_axes={"image": {0: "batch"}, "prediction": {0: "batch"}}
)

# ONNX → Optimized runtime
import onnxruntime as ort
session = ort.InferenceSession("model.onnx")
result = session.run(None, {"image": input_array})
```

---

## Model Serving Patterns

### Serving Architectures

| Pattern | Latency | Throughput | Use case |
|---------|---------|-----------|----------|
| Real-time (online) | < 100ms | Variable | User-facing predictions |
| Batch | Minutes-hours | Very high | Overnight scoring, reports |
| Streaming | Sub-second | Continuous | Event processing, fraud |
| Edge | < 10ms | Per-device | IoT, mobile, autonomous vehicles |

### Real-Time Serving Stack

```
Client → Load Balancer → API Gateway → Model Server → Model
                              │
                         Auth, Rate Limit,
                         Request Validation

Model Server options:
├── TorchServe (PyTorch)
├── TF Serving (TensorFlow)
├── Triton Inference Server (NVIDIA — multi-framework)
├── vLLM (LLM serving — paged attention)
├── TGI (HuggingFace Text Generation Inference)
├── BentoML (framework-agnostic, easy packaging)
└── Ray Serve (distributed, Python-native)
```

### Scaling Strategies

| Strategy | Method | When |
|----------|--------|------|
| Horizontal scaling | More replicas behind LB | Request volume grows |
| Vertical scaling | Bigger GPU/more memory | Model doesn't fit on small instance |
| Auto-scaling | Scale on queue depth or latency | Variable traffic |
| Batching | Group requests, process together | GPU utilization < 50% |
| Model sharding | Split model across GPUs | Model > single GPU memory |
| Caching | Cache frequent predictions | Repeated inputs (recommendations) |

---

## Model Optimization for Inference

### Quantization

| Method | Precision | When | Accuracy impact |
|--------|-----------|------|-----------------|
| Post-Training Quantization (PTQ) | FP32 → INT8 | After training, no retraining | Small (< 1% usually) |
| Quantization-Aware Training (QAT) | FP32 → INT8 | During training (simulated quant) | Minimal |
| GPTQ | FP16 → INT4 | LLM compression | Small for most tasks |
| AWQ (Activation-aware) | FP16 → INT4 | LLM, protects salient weights | Less than GPTQ |
| GGUF (llama.cpp) | Various (Q4_K_M, Q5_K_M, etc.) | CPU inference for LLMs | Depends on quant level |
| bitsandbytes (NF4) | FP16 → NF4 | QLoRA fine-tuning | Minimal with double quant |

### Pruning

| Type | Method | Speedup |
|------|--------|---------|
| Unstructured | Zero individual weights (sparse) | Needs sparse hardware |
| Structured | Remove entire neurons/channels/heads | Immediate speedup |
| Movement pruning | Prune weights that move toward zero during training | Better for fine-tuned models |
| Lottery ticket hypothesis | Find sparse subnetwork that trains as well as full | Theoretical insight |

### Other Optimizations

| Technique | What it does | Speedup |
|-----------|-------------|---------|
| Knowledge distillation | Train small model to mimic large one | 2-10× smaller |
| Operator fusion | Combine sequential ops (Conv+BN+ReLU → one kernel) | 1.5-3× |
| Flash Attention | Memory-efficient attention (tiling) | 2-4× for long sequences |
| Speculative decoding | Draft model + verify with large model | 2-3× for LLM generation |
| KV-cache | Cache key/value tensors for autoregressive gen | Required for LLM serving |
| Continuous batching | Add/remove sequences from batch dynamically | Higher GPU utilization |
| PagedAttention (vLLM) | Paged memory management for KV-cache | 2-4× throughput |

---

## CI/CD for ML

### ML Pipeline Components

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Data        │ →  │  Training    │ →  │  Evaluation  │
│  Validation  │    │  Pipeline    │    │  Gate        │
└──────────────┘    └──────────────┘    └──────┬───────┘
                                               │
                                    Pass?──────┼──────No → Alert
                                               │
                                    ┌──────────▼───────┐
                                    │  Model Registry   │
                                    │  (stage: staging) │
                                    └──────────┬───────┘
                                               │
                                    ┌──────────▼───────┐
                                    │  Integration     │
                                    │  Tests           │
                                    └──────────┬───────┘
                                               │
                                    ┌──────────▼───────┐
                                    │  Deploy (canary) │
                                    └──────────────────┘
```

### Orchestration Platforms

| Platform | Type | Strengths |
|----------|------|-----------|
| Kubeflow Pipelines | Kubernetes-native | Full MLOps platform, TFX integration |
| Apache Airflow | General DAG orchestration | Mature, wide ecosystem |
| Prefect | Modern orchestration | Pythonic, cloud-native |
| Dagster | Data-aware orchestration | Strong typing, asset-based |
| ZenML | ML pipeline abstraction | Integrates many tools, portable |
| Metaflow (Netflix) | Data science focused | Simple API, AWS integration |
| SageMaker Pipelines | AWS managed | Integrated with SageMaker ecosystem |
| Vertex AI Pipelines | GCP managed | Integrated with Vertex ecosystem |

### Data Validation

| Check | Tool | What it catches |
|-------|------|-----------------|
| Schema validation | Great Expectations, Pandera | Wrong types, missing columns |
| Statistical tests | Great Expectations | Distribution shift, range violations |
| Data drift detection | Evidently, NannyML | Feature distributions changing |
| Data quality | dbt tests, Soda | Nulls, duplicates, referential integrity |
| Bias detection | Fairlearn, AIF360 | Protected group imbalance |

---

## Deployment Strategies

### Rollout Patterns

| Strategy | Risk | Complexity | Use case |
|----------|------|-----------|----------|
| Direct replacement | High | Low | Non-critical models, early stage |
| Blue-Green | Medium | Medium | Quick rollback capability |
| Canary | Low | Medium | Gradual confidence building |
| Shadow (dark launch) | None | High | Validate without user impact |
| A/B test | Low | High | Statistical comparison needed |
| Multi-armed bandit | Low | High | Continuous optimization |

### Canary Deployment

```
Phase 1: 5% traffic → new model (monitor for 1 hour)
    ├── Metrics OK?  → Phase 2
    └── Metrics bad? → Rollback immediately

Phase 2: 25% traffic → new model (monitor for 4 hours)
    ├── Metrics OK?  → Phase 3
    └── Metrics bad? → Rollback

Phase 3: 100% traffic → new model
    └── Continue monitoring for 24 hours
```

### Shadow Deployment

```
All traffic → Production model → Response to user
         └──→ Shadow model    → Log predictions (not served)

Compare: shadow_predictions vs production_predictions
    - Same? → Shadow model is safe to promote
    - Different? → Investigate discrepancies
    - Better (with ground truth)? → Promote shadow to production
```

---

## Monitoring & Observability

### What to Monitor

| Layer | Metrics | Tools |
|-------|---------|-------|
| Infrastructure | CPU, GPU, memory, disk, network | Prometheus, Grafana, CloudWatch |
| Application | Request latency (p50/p95/p99), throughput, errors | Datadog, New Relic |
| Model | Prediction distribution, confidence scores | Evidently, NannyML, Fiddler |
| Data | Feature drift, schema violations | Great Expectations, Evidently |
| Business | Conversion rate, revenue, user satisfaction | Internal dashboards |

### Drift Detection

| Type | What changed | Detection method |
|------|-------------|-----------------|
| Data drift | Input feature distributions | PSI, KS test, KL divergence |
| Concept drift | Relationship between features and target | Monitor live performance metrics |
| Label drift | Target distribution changes | Compare prediction dist vs training dist |
| Upstream drift | Data pipeline changes | Schema validation, data contracts |

### Population Stability Index (PSI)

```
PSI = Σ (actual_% - expected_%) × ln(actual_% / expected_%)

PSI < 0.1:  No significant change
PSI 0.1-0.2: Moderate shift — investigate
PSI > 0.2:  Significant shift — retrain needed
```

### Alerting Strategy

| Severity | Condition | Action |
|----------|-----------|--------|
| Critical | Model returning errors, latency > SLA | Page on-call, auto-rollback |
| High | Significant drift (PSI > 0.2), accuracy drop > 5% | Alert team, investigate |
| Medium | Moderate drift, slow degradation | Create ticket, plan retrain |
| Low | Minor distribution shift, informational | Log for next review cycle |

---

## Retraining Strategies

| Strategy | Trigger | Use case |
|----------|---------|----------|
| Scheduled (periodic) | Time-based (daily/weekly/monthly) | Stable environments |
| Performance-triggered | Metric drops below threshold | Clear performance degradation |
| Drift-triggered | Data drift detected (PSI > threshold) | Input distribution changes |
| Event-triggered | New labeled data available, schema change | Data pipeline changes |
| Continuous | Every N new samples | Rapidly changing environments |

### Retraining Pipeline

```
Trigger (drift/schedule/performance)
    │
    ▼
Fetch new data + validate
    │
    ▼
Retrain model (same hyperparams or re-tune)
    │
    ▼
Evaluate: new_model vs current_production
    ├── New model better → Register + deploy (canary)
    └── New model worse → Alert + investigate (data issue? concept shift?)
```

---

## Infrastructure Patterns

### Kubernetes-Based Serving

```yaml
# Simplified KServe InferenceService
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: fraud-detector
spec:
  predictor:
    model:
      modelFormat:
        name: pytorch
      storageUri: s3://models/fraud-detector/v2
      resources:
        limits:
          nvidia.com/gpu: 1
          memory: 8Gi
        requests:
          cpu: 2
          memory: 4Gi
  transformer:
    containers:
      - name: feature-transform
        image: registry/feature-transform:v1.2
```

### Cost Optimization

| Strategy | Savings | Trade-off |
|----------|---------|-----------|
| Spot/preemptible instances for training | 60-90% | May be interrupted |
| Right-size GPU (don't over-provision) | 30-50% | Requires profiling |
| Auto-scale to zero (no traffic = no cost) | Variable | Cold start latency |
| Model quantization (smaller GPU needed) | 50-75% | Slight accuracy loss |
| Batch predictions off-peak | 20-40% | Higher latency |
| Multi-model serving (share GPU) | 40-60% | Isolation concerns |

---

## LLMOps (LLM-Specific Operations)

### Challenges Unique to LLMs

| Challenge | Why it's different | Solution |
|-----------|-------------------|----------|
| Model size (7B-70B+ params) | Doesn't fit on single GPU | Model parallelism, quantization |
| Inference cost | $0.01-$0.10 per request | Caching, smaller models, routing |
| Evaluation | No single ground truth | LLM-as-judge, human eval, benchmarks |
| Prompt management | Prompts are code now | Version prompts, test prompts, A/B test |
| Hallucination | Confident wrong answers | RAG, grounding, citations |
| Latency | Time-to-first-token matters | Streaming, speculative decoding |
| Safety | Toxic/harmful outputs | Guardrails, content filtering |

### LLM Serving Stack

```
User → Gateway (rate limit, auth)
    → Router (model selection, load balancing)
    → Inference Engine (vLLM, TGI, Triton)
    → Model (quantized, sharded)
    → Response (streaming tokens)
    → Guardrails (output filtering)
    → User
```

### Prompt Engineering as Operations

| Practice | Implementation |
|----------|---------------|
| Prompt versioning | Store prompts in version control with metadata |
| Prompt testing | Eval suite with expected outputs per prompt version |
| Prompt monitoring | Track prompt performance metrics over time |
| A/B testing prompts | Route traffic to different prompt versions |
| Prompt caching | Cache system prompt KV-cache for repeated prefixes |

---

## MLOps Tools Landscape

| Category | Tools |
|----------|-------|
| Experiment tracking | MLflow, W&B, Neptune, ClearML |
| Pipeline orchestration | Kubeflow, Airflow, Dagster, Prefect, ZenML |
| Feature store | Feast, Tecton, Hopsworks |
| Model serving | Triton, TorchServe, BentoML, KServe, vLLM |
| Monitoring | Evidently, NannyML, Fiddler, Arize |
| Data validation | Great Expectations, Pandera, Soda |
| Model registry | MLflow, SageMaker, Vertex AI, Neptune |
| Labeling | Label Studio, Scale AI, Labelbox |
| Notebook → Production | Metaflow, Ploomber, Papermill |
| End-to-end platforms | SageMaker, Vertex AI, Databricks, Azure ML |
