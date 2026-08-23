# AI Hardware & Accelerators

*Written: 2026-08-23*

## Why Specialized Hardware?

AI workloads are dominated by matrix multiplications and convolutions — highly parallel operations that CPUs handle poorly. AI accelerators provide massive parallelism optimized for these specific compute patterns.

```
Traditional CPU:                        AI Accelerator (GPU/TPU):
┌──────────────────┐                   ┌──────────────────────────────┐
│  Few powerful    │                   │  Thousands of simple cores   │
│  cores (8-128)   │                   │  (10,000+ on modern GPUs)    │
│                  │                   │                              │
│  Optimized for:  │                   │  Optimized for:              │
│  - Sequential    │                   │  - Parallel operations       │
│  - Branch-heavy  │                   │  - Matrix multiply           │
│  - Low latency   │                   │  - High throughput           │
└──────────────────┘                   └──────────────────────────────┘
```

---

## GPU Architecture (NVIDIA)

### Evolution

| Generation | Year | Architecture | Tensor Core Gen | Key AI feature |
|-----------|------|-------------|-----------------|----------------|
| Pascal | 2016 | P100 | — | FP16 compute |
| Volta | 2017 | V100 | 1st gen | First Tensor Cores (mixed precision) |
| Turing | 2018 | T4 | 2nd gen | INT8 inference |
| Ampere | 2020 | A100 | 3rd gen | TF32, sparsity, MIG |
| Hopper | 2022 | H100 | 4th gen | FP8, Transformer Engine |
| Blackwell | 2024 | B200 | 5th gen | FP4, 2nd-gen Transformer Engine |
| Blackwell Ultra | 2025 | B300 | 5th gen+ | Enhanced memory, NVLink 6 |

### NVIDIA GPU Comparison (Data Center)

| GPU | VRAM | Memory BW | FP16 TFLOPS | FP8 TFLOPS | Interconnect |
|-----|------|-----------|-------------|------------|-------------|
| A100 (80GB) | 80 GB HBM2e | 2.0 TB/s | 312 | — | NVLink 600 GB/s |
| H100 (SXM) | 80 GB HBM3 | 3.35 TB/s | 990 | 1,979 | NVLink 900 GB/s |
| H200 | 141 GB HBM3e | 4.8 TB/s | 990 | 1,979 | NVLink 900 GB/s |
| B200 | 192 GB HBM3e | 8.0 TB/s | 2,250 | 4,500 | NVLink 1,800 GB/s |
| GB200 (Grace+Blackwell) | 192 GB + 480 GB CPU | 8.0 TB/s | 2,250 | 4,500 | NVLink 1,800 GB/s |

### Tensor Cores

```
Standard CUDA cores:
    One multiply-add per clock per core: a × b + c

Tensor Cores:
    4×4 matrix multiply-accumulate per clock:
    D = A × B + C  (where A, B, C, D are 4×4 matrices)
    
    → 64 FMA operations per clock vs 1
    → Massively accelerates matrix-heavy workloads (attention, convolution)

Precision evolution:
    Volta:    FP16 × FP16 → FP32
    Ampere:   TF32, BF16, INT8, INT4
    Hopper:   FP8 (E4M3, E5M2)
    Blackwell: FP4, second-gen Transformer Engine
```

### Memory Hierarchy

```
┌─────────────────────────────────────────┐
│  HBM (Global Memory): 80-192 GB        │  ← slowest, largest
│  Bandwidth: 2-8 TB/s                    │
├─────────────────────────────────────────┤
│  L2 Cache: 40-60 MB                     │
├─────────────────────────────────────────┤
│  Shared Memory / L1: 128-256 KB per SM  │  ← programmer-managed
├─────────────────────────────────────────┤
│  Registers: 256 KB per SM               │  ← fastest, smallest
└─────────────────────────────────────────┘

Performance bottleneck for LLMs:
    Compute-bound: training (matrix multiplies dominate)
    Memory-bound: inference (loading weights from HBM dominates)
    
    Arithmetic intensity = FLOPs / bytes moved
    Low AI → memory-bound (inference)
    High AI → compute-bound (training)
```

---

## Google TPU (Tensor Processing Unit)

### Architecture

```
TPU core (MXU - Matrix Multiply Unit):
    Systolic array: 128×128 multiply-accumulate units
    Data flows through array in a wave pattern
    
    Each cycle: processes 128×128 = 16,384 multiply-adds
    Highly efficient for dense matrix operations
```

### TPU Generations

| TPU | Year | TFLOPS (BF16) | HBM | Interconnect |
|-----|------|---------------|-----|-------------|
| TPU v2 | 2017 | 45 | 16 GB | 2D mesh |
| TPU v3 | 2018 | 123 | 32 GB | 2D torus |
| TPU v4 | 2022 | 275 | 32 GB | 3D torus (4096-chip pods) |
| TPU v5e | 2023 | 197 | 16 GB | 3D torus (cost-optimized) |
| TPU v5p | 2023 | 459 | 95 GB | 3D torus (8960-chip pods) |
| TPU v6e (Trillium) | 2024 | 920 | 32 GB | ICI 6th gen |

### TPU vs GPU

| Aspect | TPU | GPU (NVIDIA) |
|--------|-----|-------------|
| Design philosophy | Custom ASIC for ML | General-purpose parallel | 
| Programming | JAX/XLA (optimized for TPU) | CUDA (massive ecosystem) |
| Memory | HBM, fixed per chip | HBM, various capacities |
| Interconnect | ICI (tight coupling in pods) | NVLink + InfiniBand |
| Flexibility | ML workloads only | ML + graphics + HPC + anything |
| Availability | Google Cloud only | Any cloud + on-premise |
| Best for | Large-scale training (Google's infra) | General ML + inference |

---

## Other AI Accelerators

### Overview

| Accelerator | Developer | Type | Target workload |
|-------------|-----------|------|----------------|
| Gaudi 2/3 | Intel (Habana) | Training accelerator | Large model training |
| Trainium/Inferentia | AWS | Custom ASIC | Training / Inference |
| MI300X | AMD | GPU (CDNA 3) | Training + inference |
| Groq LPU | Groq | Language Processing Unit | Ultra-low-latency inference |
| Cerebras WSE-3 | Cerebras | Wafer-scale chip | Massive models (no partitioning) |
| GraphCore IPU | GraphCore | Intelligence Processing Unit | Sparse/graph workloads |
| SambaNova | SambaNova | Reconfigurable dataflow | Enterprise AI |
| Tenstorrent | Tenstorrent | RISC-V based AI | Flexible, programmable |
| Apple Neural Engine | Apple | Mobile NPU | On-device inference |
| Qualcomm AI Engine | Qualcomm | Mobile NPU + DSP | Edge inference |

### AMD MI300X

| Spec | MI300X | H100 (SXM) |
|------|--------|-------------|
| VRAM | 192 GB HBM3 | 80 GB HBM3 |
| Memory BW | 5.3 TB/s | 3.35 TB/s |
| FP16 TFLOPS | 1,307 | 990 |
| Architecture | CDNA 3 (chiplet) | Hopper |
| Software | ROCm (maturing) | CUDA (dominant) |
| Best use case | LLM inference (huge VRAM) | General training + inference |

### Groq LPU (Language Processing Unit)

```
Key innovation: deterministic execution (no caches, no shared memory)
    - Entire model weights stored in SRAM (on-chip)
    - No memory bottleneck → extremely low latency
    - Predictable performance (no variability)
    
Trade-off: limited model size (fits in on-chip SRAM)
Performance: ~500 tokens/sec per chip for LLaMA-70B (10× lower latency than GPU)
```

### Cerebras WSE-3 (Wafer-Scale Engine)

```
Entire 300mm wafer = single chip
    - 900,000 AI cores
    - 44 GB on-chip SRAM
    - 21 PB/s memory bandwidth
    - No model partitioning needed (even for large models)
    
Advantage: eliminates all inter-chip communication overhead
Limitation: specialized hardware, limited flexibility, high cost
```

---

## Edge & Mobile AI Hardware

### Comparison

| Chip | Device | TOPS (INT8) | Power | Use case |
|------|--------|-------------|-------|----------|
| Apple A17 Pro (Neural Engine) | iPhone 15 Pro | 35 | 5W | On-device LLM, image processing |
| Apple M4 (Neural Engine) | MacBook Pro | 38 | 20W | Local AI, creative tools |
| Qualcomm Snapdragon 8 Gen 3 | Android phones | 45 | 5W | On-device AI |
| Intel Meteor Lake NPU | Laptops | 34 | 10W | AI PC features |
| NVIDIA Jetson Orin | Robotics/edge | 275 | 60W | Autonomous systems |
| Google Edge TPU | Coral devices | 4 | 2W | IoT inference |
| Hailo-8 | Edge devices | 26 | 2.5W | Video analytics |

### On-Device LLM Requirements

```
Model size and memory requirements for on-device:

LLaMA 3.2 1B (INT4):  ~600 MB RAM  → fits on phone
LLaMA 3.2 3B (INT4):  ~1.7 GB RAM  → fits on phone (tight)
Phi-3 Mini 3.8B (INT4): ~2 GB RAM  → fits on modern phone
Mistral 7B (INT4):    ~4 GB RAM    → fits on laptop/tablet
LLaMA 3 8B (INT4):    ~5 GB RAM    → laptop with 16+ GB RAM
LLaMA 3 70B (INT4):   ~40 GB RAM   → high-end workstation

Key constraint: memory bandwidth (not compute)
    Phone LPDDR5: ~50 GB/s → ~10 tokens/sec for 7B model
    Laptop DDR5:  ~80 GB/s → ~15 tokens/sec for 7B model
    M4 Max:       ~400 GB/s → ~60 tokens/sec for 7B model
```

---

## Interconnects & Networking

### Why Interconnects Matter

```
Multi-GPU training requires synchronization:
    - AllReduce: average gradients across all GPUs
    - Model parallelism: send activations between GPUs
    
Bottleneck: if interconnect is slow, GPUs wait for data → low utilization
```

### Interconnect Technologies

| Technology | Bandwidth | Latency | Scope |
|-----------|-----------|---------|-------|
| PCIe Gen 5 | 64 GB/s (×16) | ~μs | Intra-node (CPU↔GPU) |
| NVLink 4 (H100) | 900 GB/s (total) | ~ns | Intra-node (GPU↔GPU) |
| NVLink 5 (B200) | 1,800 GB/s | ~ns | Intra-node (GPU↔GPU) |
| NVSwitch | Full mesh connectivity | ~ns | 8 GPUs fully connected |
| InfiniBand NDR400 | 400 Gb/s per port | ~1μs | Inter-node (rack-to-rack) |
| RoCE (RDMA over Ethernet) | 100-400 Gb/s | ~2-5μs | Inter-node (cheaper) |
| Google ICI | Tbps per chip | ~ns | TPU pod interconnect |

### Cluster Topology

```
DGX H100 SuperPOD (256 GPUs):
    32 × DGX H100 nodes
    Each node: 8 × H100 (connected via NVSwitch)
    Nodes connected via: InfiniBand NDR (400 Gb/s × 8 ports per node)
    
    Total FP8: 256 × 1,979 = 506 PFLOPS
    Total memory: 256 × 80 GB = 20 TB HBM
```

---

## Software Stack

### NVIDIA CUDA Ecosystem

```
Application layer:
    PyTorch, TensorFlow, JAX
        │
Framework optimizations:
    cuDNN (convolution), cuBLAS (linear algebra), NCCL (communication)
        │
Compiler / Runtime:
    CUDA, TensorRT (inference), Triton (kernel compiler)
        │
Hardware:
    GPU (Tensor Cores, CUDA Cores, HBM)
```

### Key Libraries

| Library | Purpose | Used by |
|---------|---------|---------|
| cuDNN | Optimized deep learning primitives | All frameworks |
| cuBLAS | Dense linear algebra (GEMM) | Matrix multiplications |
| NCCL | Multi-GPU communication (AllReduce) | Distributed training |
| TensorRT | Inference optimization (graph fusion, quantization) | Production serving |
| Triton (OpenAI) | Python → GPU kernel compiler | Flash Attention, custom ops |
| DeepSpeed | Distributed training framework (ZeRO) | Large model training |
| Megatron-LM | Model parallelism framework | LLM pre-training |
| vLLM | LLM inference engine (PagedAttention) | LLM serving |
| Flash Attention | Memory-efficient attention kernel | All Transformer training/inference |

### Compiler Approaches

| Compiler | Developer | Target | Approach |
|----------|-----------|--------|----------|
| XLA | Google | TPU, GPU, CPU | Graph-level optimization, fusion |
| TorchInductor | PyTorch | GPU, CPU | torch.compile backend |
| Triton | OpenAI | NVIDIA GPU | Block-level GPU programming |
| MLIR | LLVM/Google | Any accelerator | Multi-level IR framework |
| TVM | Apache | Any hardware | Auto-tuning, code generation |
| IREE | Google | Mobile, edge | MLIR-based deployment |

---

## Performance Optimization

### Key Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| FLOPS utilization (MFU) | Achieved FLOPS / Peak FLOPS | > 50% (training), > 30% (inference) |
| Memory bandwidth utilization | Achieved BW / Peak BW | Close to theoretical |
| GPU utilization | Time GPU is active vs idle | > 90% |
| Tokens per second | Throughput for LLMs | Maximize |
| Time-to-first-token (TTFT) | Latency for first output | < 500ms (interactive) |
| Tokens per dollar | Cost efficiency | Maximize |

### Training Optimization

| Technique | What it does | Improvement |
|-----------|-------------|-------------|
| Mixed precision (BF16) | Compute in lower precision | 2× throughput, 2× memory |
| Gradient checkpointing | Recompute activations instead of storing | 4-5× memory reduction |
| Flash Attention | Fused, tiled attention kernel | 2-4× for attention layers |
| Operator fusion | Combine sequential ops into one kernel | Reduce memory I/O |
| Tensor parallelism | Split layers across GPUs | Scale to larger models |
| Pipeline parallelism | Split layers sequentially across GPUs | More GPUs utilized |
| Data parallelism (FSDP/ZeRO) | Shard optimizer + gradients + weights | Scale to more GPUs |
| Sequence packing | Pack multiple short sequences into one batch | Better GPU utilization |
| Activation offloading | Move activations to CPU during backward | More memory |

### Inference Optimization

| Technique | What it does | Speedup |
|-----------|-------------|---------|
| Quantization (INT8/INT4) | Reduce precision of weights | 2-4× throughput |
| KV-cache | Cache key/value tensors for autoregressive | Required for LLMs |
| PagedAttention (vLLM) | Paged memory management for KV-cache | 2-4× throughput |
| Continuous batching | Add/remove requests dynamically | Better utilization |
| Speculative decoding | Draft model + verify with large model | 2-3× latency |
| Flash Decoding | Parallelized KV-cache attention | Faster decoding |
| Kernel fusion | Combine operations (e.g., RMSNorm + residual) | 10-30% improvement |
| Static shapes + torch.compile | JIT compilation with fixed shapes | 1.5-2× |

---

## Cost & Efficiency

### Cloud GPU Pricing (Approximate, 2024-2025)

| GPU | On-demand ($/hr) | Spot/preemptible | Use case |
|-----|-------------------|-----------------|----------|
| T4 (16GB) | $0.35 | $0.10 | Inference, light training |
| A10G (24GB) | $1.00 | $0.40 | Medium inference |
| A100 40GB | $3.50 | $1.20 | Training |
| A100 80GB | $5.00 | $1.80 | Large model training |
| H100 80GB | $8-12 | $3-5 | LLM training |
| 8×H100 node | $65-100 | $25-40 | Large-scale training |

### Efficiency Trends

| Metric | 2020 (A100) | 2022 (H100) | 2024 (B200) | Improvement |
|--------|-------------|-------------|-------------|-------------|
| FP8 TFLOPS | — | 1,979 | 4,500 | 2.3× per gen |
| Memory BW | 2.0 TB/s | 3.35 TB/s | 8.0 TB/s | 2.4× per gen |
| HBM capacity | 80 GB | 80 GB | 192 GB | 2.4× |
| Training time (GPT-3 equivalent) | ~34 days (1024 A100) | ~8 days (1024 H100) | ~3 days (1024 B200) | ~4× per gen |

### Tokens per Dollar Optimization

```
Strategy priority:
1. Right-size the model (smaller model if quality sufficient)
2. Quantize (INT4/INT8 for inference)
3. Batch efficiently (continuous batching, high utilization)
4. Use spot instances for training (60-80% savings)
5. Cache common prefixes (system prompt KV-cache)
6. Distill large model into smaller (one-time cost)
7. Use specialized inference hardware (Groq, Inferentia)
```

---

## Future Directions

| Trend | What's coming | Impact |
|-------|---------------|--------|
| Chiplet designs | Multiple dies per package | Higher yields, mix-and-match |
| Optical interconnects | Light-based chip-to-chip communication | 10× bandwidth, lower power |
| In-memory compute | Process data where it's stored (PIM) | Eliminate memory bottleneck |
| Photonic computing | Light-based matrix multiplication | Ultra-low energy inference |
| Neuromorphic chips | Brain-inspired spiking networks | Event-driven, low power |
| Quantum-classical hybrid | Quantum for specific sub-problems | Optimization, sampling |
| 3D stacking | Vertical integration (logic + memory) | More bandwidth, less latency |
| Sparsity hardware | Native support for sparse operations | 2-4× efficiency for sparse models |
