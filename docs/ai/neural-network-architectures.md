---
tags:
  - intermediate
  - foundations
---

# Neural Network Architectures

*Written: 2026-08-23*

## Feedforward Neural Networks (FNN)

The simplest architecture — data flows in one direction from input to output.

**Forward pass:**

```
z^[l] = W^[l] · a^[l-1] + b^[l]     (linear transformation)
a^[l] = g(z^[l])                      (activation function)
```

**Layer types:**

| Layer | Purpose | Parameters |
|-------|---------|------------|
| Dense (Fully Connected) | General transformation | W: (n_out × n_in), b: (n_out) |
| Dropout | Regularization | p (drop probability) |
| BatchNorm | Stabilize training | γ, β (learnable scale/shift) |
| LayerNorm | Stabilize (sequence models) | γ, β per feature |

**Universal Approximation Theorem:**
A single hidden layer with sufficient neurons can approximate any continuous function on a compact subset of ℝⁿ. In practice, deeper networks learn hierarchical features more efficiently than wide shallow ones.

---

## Convolutional Neural Networks (CNN)

### Core Operations

**Convolution:**

$$(\text{Feature Map})_{i,j} = \sum_{m}\sum_{n} \text{Input}_{i+m, j+n} \cdot \text{Kernel}_{m,n} + \text{bias}$$

**Output size formula:**

$$\text{out} = \left\lfloor \frac{\text{in} + 2p - k}{s} \right\rfloor + 1$$

where p = padding, k = kernel size, s = stride.

### Key Layers

| Layer | Operation | Purpose |
|-------|-----------|---------|
| Conv2D | Sliding kernel multiplication | Extract spatial features |
| MaxPool | Take max in window | Downsample, translation invariance |
| AvgPool | Take mean in window | Smooth downsampling |
| GlobalAvgPool | Average entire feature map | Replace FC layer at end |
| Depthwise Conv | One kernel per channel | Lightweight (MobileNet) |
| Dilated Conv | Kernel with gaps | Larger receptive field without params |
| Deconv (TransposeConv) | Learned upsampling | Segmentation, generation |

### Architecture Evolution

| Architecture | Year | Key Innovation | Top-1 ImageNet |
|--------------|------|----------------|----------------|
| LeNet-5 | 1998 | First practical CNN | — |
| AlexNet | 2012 | ReLU, dropout, GPU training | 63.3% |
| VGG-16 | 2014 | Uniform 3×3 convolutions | 74.4% |
| GoogLeNet/Inception | 2014 | Multi-scale inception modules | 74.8% |
| ResNet-50 | 2015 | Skip connections (residual learning) | 76.1% |
| DenseNet | 2017 | Dense connections between all layers | 77.4% |
| EfficientNet | 2019 | Compound scaling (depth × width × resolution) | 84.4% |
| ConvNeXt | 2022 | Modernized ResNet with Transformer tricks | 87.8% |
| EVA-02 | 2023 | CLIP pre-training + MIM | 90.0% |

### ResNet: The Skip Connection

```
                    ┌─────────────┐
         x ────────┤             │
                    │  F(x) block │
                    │  (conv-bn-  │
                    │   relu-conv-│
                    │   bn)       │
                    └──────┬──────┘
                           │
         x ────────────────┼──── (+) ──── ReLU ──── output
              (identity     │
               shortcut)    │
                    H(x) = F(x) + x
```

**Why it works:**
- Easier to learn residual F(x) = H(x) - x than full mapping H(x)
- Gradient flows through identity shortcut — mitigates vanishing gradients
- Enables training 100+ layer networks

---

## Recurrent Neural Networks (RNN)

### Vanilla RNN

**Recurrence:**

```
h_t = tanh(W_hh · h_{t-1} + W_xh · x_t + b_h)
y_t = W_hy · h_t + b_y
```

**Problem:** Vanishing/exploding gradients over long sequences — gradient multiplied by W_hh at each step.

### LSTM (Long Short-Term Memory)

**Four components at each time step:**

```
# Gates (sigmoid → values in [0,1])
f_t = σ(W_f · [h_{t-1}, x_t] + b_f)          # Forget gate
i_t = σ(W_i · [h_{t-1}, x_t] + b_i)          # Input gate
o_t = σ(W_o · [h_{t-1}, x_t] + b_o)          # Output gate

# Cell state update
C̃_t = tanh(W_c · [h_{t-1}, x_t] + b_c)      # Candidate
C_t  = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t            # New cell state

# Hidden state
h_t  = o_t ⊙ tanh(C_t)                        # Output
```

**Why LSTM solves vanishing gradients:**
- Cell state C_t acts as a "highway" — gradient flows through multiplicative gates, not repeated nonlinearities
- Forget gate can be ≈1 → gradient passes unchanged across many time steps
- Additive update (not multiplicative) preserves gradient magnitude

### GRU (Gated Recurrent Unit)

**Simplified LSTM — 2 gates instead of 3, no separate cell state:**

```
z_t = σ(W_z · [h_{t-1}, x_t])                 # Update gate
r_t = σ(W_r · [h_{t-1}, x_t])                 # Reset gate
h̃_t = tanh(W · [r_t ⊙ h_{t-1}, x_t])        # Candidate
h_t  = (1 - z_t) ⊙ h_{t-1} + z_t ⊙ h̃_t     # Interpolate
```

### RNN Comparison

| Architecture | Gates | Parameters | Long-range | Speed |
|-------------|-------|------------|------------|-------|
| Vanilla RNN | 0 | Low | Poor | Fast |
| LSTM | 3 (forget, input, output) | 4× RNN | Good | Slow |
| GRU | 2 (update, reset) | 3× RNN | Good | Medium |
| BiLSTM | 3 × 2 directions | 8× RNN | Good (both dirs) | Slower |

---

## Transformer Architecture

### The Self-Attention Mechanism

**Scaled dot-product attention:**

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) V$$

where Q = queries, K = keys, V = values, d_k = key dimension.

**Multi-head attention:**

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · W^O
where head_i = Attention(Q·W_i^Q, K·W_i^K, V·W_i^V)
```

**Why √d_k scaling?**
- Without scaling, dot products grow with dimension → softmax saturates → near-zero gradients
- Dividing by √d_k keeps variance ≈ 1 regardless of dimension

### Full Transformer Block

```
┌─────────────────────────────────────┐
│  Input embeddings + Positional enc   │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │  Multi-Head Self-Attention  │    │
│  └──────────────┬──────────────┘    │
│                 │                    │
│  ──── Add & LayerNorm ────          │  × N layers
│                 │                    │
│  ┌─────────────────────────────┐    │
│  │  Feed-Forward Network       │    │
│  │  FFN(x) = W₂·GELU(W₁·x+b₁)+b₂ │
│  └──────────────┬──────────────┘    │
│                 │                    │
│  ──── Add & LayerNorm ────          │
└─────────────────────────────────────┘
```

### Positional Encoding

**Sinusoidal (original):**

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
```

**Alternatives:**

| Type | Method | Used in |
|------|--------|---------|
| Sinusoidal | Fixed sin/cos | Original Transformer |
| Learned | Trainable embeddings | BERT, GPT |
| Rotary (RoPE) | Rotation matrix in attention | LLaMA, PaLM |
| ALiBi | Linear bias in attention scores | BLOOM |
| Relative | Relative position embeddings | T5, DeBERTa |

### Transformer Variants

| Model | Type | Architecture | Innovation |
|-------|------|-------------|------------|
| BERT | Encoder-only | Bidirectional self-attention | Masked language modeling |
| GPT | Decoder-only | Causal (left-to-right) attention | Autoregressive generation |
| T5 | Encoder-decoder | Full Transformer | Text-to-text framework |
| ViT | Encoder-only | Patch embeddings + Transformer | Vision without convolutions |
| DALL-E | Decoder | dVAE + Transformer | Text → image generation |
| Whisper | Encoder-decoder | Audio spectrogram → text | Universal speech recognition |

### Attention Complexity & Solutions

**Standard self-attention:** O(n²·d) — quadratic in sequence length.

| Method | Complexity | Approach | Trade-off |
|--------|-----------|----------|-----------|
| Standard | O(n²d) | Full attention matrix | Exact, expensive |
| Sparse (BigBird) | O(n·√n·d) | Local + global + random | Approximate |
| Linear (Performer) | O(n·d²) | Kernel approximation | Faster, less precise |
| Flash Attention | O(n²d) compute, O(n) memory | Tiling + recomputation | Exact, memory-efficient |
| Sliding Window (Mistral) | O(n·w·d) | Fixed window + global tokens | Long context |
| Ring Attention | O(n²d / num_devices) | Distributed across devices | Scales to millions of tokens |

---

## Generative Adversarial Networks (GAN)

### Min-Max Game

$$\min_G \max_D \; \mathbb{E}_{x \sim p_{data}}[\log D(x)] + \mathbb{E}_{z \sim p_z}[\log(1 - D(G(z)))]$$

**Training loop:**

```
for each batch:
    # Train Discriminator
    real_pred = D(real_images)
    fake_images = G(random_noise)
    fake_pred = D(fake_images.detach())
    D_loss = -mean(log(real_pred) + log(1 - fake_pred))
    update D
    
    # Train Generator
    fake_images = G(random_noise)
    fake_pred = D(fake_images)
    G_loss = -mean(log(fake_pred))      # or mean(log(1 - fake_pred))
    update G
```

### GAN Variants

| Variant | Innovation | Problem solved |
|---------|-----------|----------------|
| DCGAN | Convolutional architecture | Stable image generation |
| WGAN | Wasserstein distance | Mode collapse, training stability |
| StyleGAN | Style-based generator | Fine-grained control |
| CycleGAN | Unpaired image translation | No paired training data needed |
| Pix2Pix | Conditional GAN + L1 loss | Paired image-to-image |
| ProGAN | Progressive growing | High-resolution generation |

### GAN Training Challenges

| Problem | Symptom | Solution |
|---------|---------|----------|
| Mode collapse | Generator produces limited variety | Wasserstein loss, minibatch discrimination |
| Training instability | Loss oscillates, no convergence | Spectral normalization, gradient penalty |
| Vanishing gradients | D too strong, G gets no signal | Label smoothing, feature matching |
| Evaluation | No ground truth metric | FID, IS, LPIPS |

---

## Diffusion Models

### Forward Process (Add Noise)

$$q(x_t | x_{t-1}) = \mathcal{N}(x_t; \sqrt{1-\beta_t} x_{t-1}, \beta_t I)$$

After T steps: x_T ≈ pure Gaussian noise.

### Reverse Process (Denoise)

$$p_\theta(x_{t-1} | x_t) = \mathcal{N}(x_{t-1}; \mu_\theta(x_t, t), \Sigma_\theta(x_t, t))$$

**Training objective (simplified):**

$$L = \mathbb{E}_{t, x_0, \epsilon} \left[ ||\epsilon - \epsilon_\theta(x_t, t)||^2 \right]$$

The network learns to predict the noise that was added.

### Key Innovations

| Method | Contribution |
|--------|-------------|
| DDPM | Original denoising formulation |
| DDIM | Deterministic sampling (faster, fewer steps) |
| Latent Diffusion (Stable Diffusion) | Diffuse in VAE latent space (cheaper) |
| Classifier-Free Guidance | Conditional generation without separate classifier |
| ControlNet | Add spatial conditioning (pose, edge, depth) |
| Consistency Models | Single-step generation (distilled) |

---

## Architecture Selection Guide

| Task | Primary architecture | Alternative |
|------|---------------------|-------------|
| Image classification | ViT, EfficientNet, ConvNeXt | ResNet (baseline) |
| Object detection | DETR, YOLOv8 | Faster R-CNN |
| Semantic segmentation | SegFormer, Mask2Former | U-Net |
| Text classification | BERT, RoBERTa | Fine-tuned LLM |
| Text generation | GPT-4, LLaMA, Mistral | T5 |
| Machine translation | mBART, NLLB | Encoder-decoder Transformer |
| Speech recognition | Whisper | Conformer |
| Image generation | Stable Diffusion, DALL-E 3 | StyleGAN (faces) |
| Time series forecasting | Temporal Fusion Transformer | LSTM, N-BEATS |
| Tabular data | **Not neural nets** — use XGBoost | TabNet (if you must) |
| Graph data | Graph Attention Network (GAT) | GCN, GraphSAGE |
| Multimodal | CLIP, LLaVA, Gemini | BLIP-2 |

---

## Parameter Count Reference

| Model | Parameters | Architecture | Context length |
|-------|-----------|-------------|----------------|
| BERT-base | 110M | Encoder, 12 layers | 512 tokens |
| GPT-2 | 1.5B | Decoder, 48 layers | 1024 tokens |
| GPT-3 | 175B | Decoder, 96 layers | 4096 tokens |
| GPT-4 | ~1.7T (MoE) | Decoder, MoE | 128k tokens |
| LLaMA-3 70B | 70B | Decoder, 80 layers | 128k tokens |
| Mistral 7B | 7B | Decoder, 32 layers | 32k tokens |
| Stable Diffusion XL | ~3.5B | U-Net + VAE + CLIP | — |
| ViT-L/14 | 304M | Encoder, 24 layers | 256 patches |
| Whisper Large v3 | 1.5B | Encoder-decoder | 30s audio |

---

## Compute Requirements

**Training compute estimation:**

```
FLOPs ≈ 6 × N × D

N = number of parameters
D = number of training tokens
6 = forward (2) + backward (4) multiplier
```

**Scaling laws (Chinchilla optimal):**

```
Optimal tokens ≈ 20 × parameters

Model size    Optimal training tokens
1B            20B
7B            140B
70B           1.4T
```

**Inference cost:**

```
Memory ≈ 2 × N bytes (FP16) or N bytes (INT8)

7B model:  ~14 GB (FP16), ~7 GB (INT8)
70B model: ~140 GB (FP16), ~70 GB (INT8)
```
