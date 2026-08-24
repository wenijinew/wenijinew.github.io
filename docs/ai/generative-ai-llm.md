---
tags:
  - advanced
  - nlp
---

# Generative AI & Large Language Models

*Written: 2026-08-23*

## The Generative AI Landscape

```
                         Generative AI
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                     │
    Text/Code           Images/Video           Audio/Music
         │                    │                     │
    ├── LLMs             ├── Diffusion          ├── TTS (text-to-speech)
    ├── Code models      ├── GANs               ├── Voice cloning
    └── Agents           └── NeRF/3D            └── Music generation
```

### Key Model Families

| Family | Developer | Notable models | Paradigm |
|--------|-----------|---------------|----------|
| GPT | OpenAI | GPT-4, GPT-4o, o1, o3 | Closed, API-only |
| Claude | Anthropic | Claude 3.5 Sonnet, Claude 4 | Closed, safety-focused |
| Gemini | Google | Gemini Ultra, Pro, Flash | Closed, multimodal |
| LLaMA | Meta | LLaMA 3.1 (8B-405B) | Open weights |
| Mistral | Mistral AI | Mistral 7B, Mixtral, Mistral Large | Open + commercial |
| Qwen | Alibaba | Qwen2.5 (0.5B-72B) | Open weights |
| DeepSeek | DeepSeek AI | DeepSeek-V3, DeepSeek-R1 | Open weights, reasoning |
| Command | Cohere | Command R+ | Enterprise RAG |
| Stable Diffusion | Stability AI | SDXL, SD3 | Open weights (image) |
| DALL-E | OpenAI | DALL-E 3 | Closed (image) |
| Sora | OpenAI | Sora | Closed (video) |

---

## LLM Architecture Deep Dive

### Decoder-Only Transformer (GPT-style)

```
Input tokens:  [The] [cat] [sat] [on] [the]
                 ↓     ↓     ↓     ↓     ↓
Token embeddings + Positional encoding (RoPE)
                 ↓
┌────────────────────────────────────────────┐
│  Causal Self-Attention (masked)            │  ← each token sees only left context
│  + RMSNorm (pre-norm)                      │
│  + Residual connection                     │
├────────────────────────────────────────────┤
│  Feed-Forward Network (SwiGLU)             │  × N layers
│  + RMSNorm (pre-norm)                      │
│  + Residual connection                     │
└────────────────────────────────────────────┘
                 ↓
Final RMSNorm → Linear → Softmax → P(next token)
                                       ↓
                                    [mat] (predicted)
```

### Modern LLM Innovations

| Innovation | Used in | Benefit |
|-----------|---------|---------|
| RoPE (Rotary Position Embedding) | LLaMA, Mistral | Better length generalization |
| RMSNorm (pre-norm) | LLaMA, PaLM | Faster, more stable than LayerNorm |
| SwiGLU activation | LLaMA, PaLM | Better than ReLU/GELU in FFN |
| Grouped Query Attention (GQA) | LLaMA 2/3, Mistral | Faster inference (shared KV heads) |
| Sliding Window Attention | Mistral | Efficient long context |
| Mixture of Experts (MoE) | Mixtral, GPT-4, DeepSeek-V3 | More params, same compute per token |
| Flash Attention | Nearly all modern LLMs | 2-4× memory reduction |
| KV-cache compression | Various | Reduce memory for long contexts |

### Mixture of Experts (MoE)

```
Input token embedding
        │
        ▼
┌───────────────┐
│  Router       │ → selects top-K experts (typically K=2)
│  (linear +    │
│   softmax)    │
└───────┬───────┘
        │
   ┌────┼────┬────┬────┬────┐
   ▼    ▼    ▼    ▼    ▼    ▼
 [E1] [E2] [E3] [E4] [E5] [E6]  ← only K are activated
   │    │
   ▼    ▼
 Weighted sum → output

Total params: N × expert_size (e.g., 8 × 7B = 56B total)
Active params: K × expert_size (e.g., 2 × 7B = 14B per token)
```

**Benefits:** More knowledge capacity without proportional compute increase.

---

## Pre-Training

### Data

| Aspect | Details |
|--------|---------|
| Scale | 1-15 trillion tokens (modern LLMs) |
| Sources | Web (Common Crawl), books, code (GitHub), Wikipedia, papers |
| Filtering | Deduplication, quality scoring, toxicity removal, PII removal |
| Mixing | Proportional sampling from domains (more code = better reasoning) |
| Tokenizer | BPE with 32k-128k vocabulary |

### Compute

| Model | Training tokens | GPUs | Training time | Estimated cost |
|-------|----------------|------|---------------|----------------|
| LLaMA 2 70B | 2T | 2048 × A100 | 35 days | ~$5M |
| LLaMA 3 405B | 15T | 16,384 × H100 | ~60 days | ~$100M+ |
| GPT-4 | ~13T (estimated) | ~25,000 × A100 | ~90 days | ~$100M+ |
| Mistral 7B | ~8T | 512 × A100 | ~14 days | ~$500K |

### Scaling Laws

```
Chinchilla optimal (2022):
    Tokens ≈ 20 × Parameters

    Model size    Optimal tokens    Training FLOPs
    1B            20B               1.2 × 10²⁰
    7B            140B              8.4 × 10²⁰
    70B           1.4T              8.4 × 10²¹
    400B          8T                4.8 × 10²²

Over-training (2024+ trend):
    Train smaller models on MORE data than Chinchilla-optimal
    Example: Mistral 7B trained on ~8T tokens (>50× parameter count)
    Rationale: inference cost dominates; smaller + over-trained = cheaper to serve
```

---

## Fine-Tuning Methods

### Full Fine-Tuning

```
All parameters updated — requires same GPU memory as pre-training.
Only viable for: small models (< 7B) or large GPU clusters.
```

### Parameter-Efficient Fine-Tuning (PEFT)

| Method | Trainable params | How it works |
|--------|-----------------|--------------|
| LoRA | 0.1-1% of total | Low-rank matrices added to attention weights |
| QLoRA | 0.1-1% | LoRA + 4-bit quantized base model |
| Prefix Tuning | < 0.1% | Learnable tokens prepended to each layer |
| Prompt Tuning | < 0.01% | Learnable soft prompt tokens at input |
| Adapters | 1-5% | Small bottleneck layers inserted between existing layers |
| IA³ | < 0.01% | Learned vectors that rescale activations |

### LoRA (Low-Rank Adaptation)

```
Original weight: W ∈ ℝ^(d × d)
LoRA decomposition: W' = W + α · B · A

Where:
    A ∈ ℝ^(r × d)    (down-projection)
    B ∈ ℝ^(d × r)    (up-projection)
    r << d            (rank, typically 8-64)
    α                 (scaling factor)

Trainable params: 2 × r × d  (vs d² for full)
For d=4096, r=16: 131K vs 16.7M per weight matrix (125× reduction)
```

**QLoRA additions:**
- Base model quantized to NF4 (4-bit NormalFloat)
- Double quantization (quantize the quantization constants)
- Paged optimizers (offload optimizer states to CPU when GPU OOM)
- Result: Fine-tune 65B model on single 48GB GPU

### Fine-Tuning Data

| Format | Example | Use case |
|--------|---------|----------|
| Instruction-following | {"instruction": "...", "response": "..."} | General assistant |
| Chat format | [{"role": "user", "content": "..."}, {"role": "assistant", ...}] | Conversational |
| Code completion | {"prefix": "def sort(", "completion": "arr): ..."} | Code models |
| Tool/function calling | {"functions": [...], "user": "...", "call": {...}} | Agent capabilities |

---

## Prompt Engineering

### Core Techniques

| Technique | Description | Example |
|-----------|-------------|---------|
| Zero-shot | Direct instruction, no examples | "Translate to French: ..." |
| Few-shot | Provide examples before the task | "Input: X → Output: Y\nInput: Z → Output: ?" |
| Chain-of-Thought (CoT) | "Think step by step" | "Let's work through this step by step..." |
| Self-consistency | Sample multiple CoT paths, majority vote | Generate 5 solutions, pick most common answer |
| Tree of Thought | Explore multiple reasoning branches | Structured exploration with backtracking |
| ReAct | Thought → Action → Observation loop | Agent-style reasoning + tool use |
| Structured output | Force JSON/XML format | "Respond in this JSON schema: {...}" |

### System Prompt Design

```
A well-structured system prompt:

1. Role definition      → "You are a senior Python developer..."
2. Constraints          → "Always use type hints. Never use global variables."
3. Output format        → "Respond in JSON with keys: analysis, recommendation, code"
4. Context/knowledge    → "The codebase uses FastAPI 0.100+ and SQLAlchemy 2.0"
5. Examples (optional)  → "Here's an example of good output: ..."
6. Guardrails           → "If unsure, say 'I don't know' rather than guessing."
```

### Prompt Optimization

| Approach | Method |
|----------|--------|
| Manual iteration | Test, evaluate, refine prompt wording |
| DSPy | Programmatic prompt optimization with metrics |
| OPRO (LLM-optimized) | Use LLM to optimize its own prompts |
| A/B testing | Statistical comparison of prompt variants |
| Temperature tuning | Adjust randomness per task (0.0 for factual, 0.7 for creative) |

---

## Retrieval-Augmented Generation (RAG)

### Architecture

```
Query → Query Processing → Retriever → Reranker → Context Assembly → LLM → Response
              │                 │           │              │
         Query expansion    Vector DB   Cross-encoder   Prompt with
         HyDE (hypothetical  + BM25     (more accurate  retrieved docs
          document)          hybrid     but slower)
```

### Advanced RAG Techniques

| Technique | Purpose | How |
|-----------|---------|-----|
| Hybrid retrieval | Best of sparse + dense | BM25 + embedding search with RRF |
| HyDE | Better query for dense retrieval | LLM generates hypothetical answer, embed that |
| Query decomposition | Complex queries | Break into sub-queries, retrieve for each |
| Parent document retrieval | More context | Retrieve chunk, return parent document |
| Multi-vector retrieval | Multiple representations | Summary embeddings + full doc retrieval |
| Self-RAG | Selective retrieval | LLM decides when it needs external info |
| RAPTOR | Hierarchical summarization | Tree of summaries at different granularities |
| GraphRAG | Structured knowledge | Build knowledge graph, retrieve subgraphs |
| Agentic RAG | Multi-step retrieval | Agent iterates: retrieve → reason → retrieve more |

### Chunking Strategies

| Strategy | How | Best for |
|----------|-----|----------|
| Fixed-size | Split at N characters/tokens | Simple, baseline |
| Recursive | Split at paragraphs → sentences → words | Structured documents |
| Semantic | Split when embedding similarity drops | Topic coherence |
| Document-aware | Respect headers, sections, pages | Structured docs (PDF, HTML) |
| Sentence window | Retrieve sentence, expand to window | Precise retrieval + context |

---

## AI Agents

### Agent Architecture

```
User query → Planning (decompose into steps)
                │
                ▼
            ┌───────────┐
            │   Agent   │ ← memory (conversation + long-term)
            │   Loop    │
            └─────┬─────┘
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
 Reason       Use Tool      Observe
 (CoT/plan)   (API, search, (parse result)
              code exec)
                  │
                  ▼
            Continue loop or return final answer
```

### Agent Frameworks

| Framework | Key feature | Use case |
|-----------|-------------|----------|
| LangChain/LangGraph | Graph-based agent workflows | Complex multi-step agents |
| CrewAI | Multi-agent collaboration | Team-of-agents scenarios |
| AutoGen (Microsoft) | Conversational agent framework | Multi-agent debate/collaboration |
| Semantic Kernel | Enterprise, .NET + Python | Microsoft ecosystem integration |
| Haystack | Modular RAG + agent pipelines | Search and QA systems |
| LlamaIndex | Data framework for LLM apps | RAG-focused applications |

### Tool Use

```
User: "What's the weather in Stockholm?"
Agent:
    Thought: I need to check the weather. I'll use the weather API.
    Action: weather_api(location="Stockholm")
    Observation: {"temp": 18, "condition": "partly cloudy", "humidity": 65}
    Thought: I have the information. Let me format a response.
    Answer: "It's 18°C and partly cloudy in Stockholm with 65% humidity."
```

### Planning Patterns

| Pattern | Method | Suitable for |
|---------|--------|-------------|
| ReAct | Interleaved reasoning + acting | Simple tool-use tasks |
| Plan-and-Execute | Full plan first, then execute steps | Multi-step complex tasks |
| Reflexion | Execute + self-reflect + retry | Tasks needing iterative improvement |
| LATS (Language Agent Tree Search) | Monte Carlo tree search with LLM | Complex reasoning under uncertainty |

---

## Evaluation & Benchmarks

### LLM Benchmarks

| Benchmark | Measures | Format |
|-----------|---------|--------|
| MMLU | General knowledge (57 subjects) | Multiple choice |
| HumanEval / MBPP | Code generation | Function completion |
| GSM8K | Math reasoning (grade school) | Word problems |
| MATH | Advanced mathematics | Proofs and computation |
| HellaSwag | Common sense reasoning | Sentence completion |
| ARC | Science reasoning | Multiple choice |
| TruthfulQA | Factual accuracy | Open-ended + MC |
| MT-Bench | Multi-turn conversation quality | LLM-as-judge scoring |
| GPQA | Graduate-level QA (expert) | Multiple choice (hard) |
| SWE-bench | Real software engineering tasks | Fix GitHub issues |
| Aider polyglot | Code editing across languages | Multi-file code changes |

### Evaluation Methods

| Method | Approach | When |
|--------|----------|------|
| Exact match | Output == expected | Factual QA, code output |
| ROUGE/BLEU | N-gram overlap | Summarization, translation |
| BERTScore | Semantic similarity | Any text generation |
| LLM-as-judge | GPT-4 / Claude rates output quality | Open-ended generation |
| Human evaluation (Elo) | Pairwise preference ranking | Gold standard |
| Functional correctness | Run generated code, check tests pass | Code generation |
| Factual grounding | Verify claims against source docs | RAG, factual QA |

---

## Image Generation

### Diffusion Models

```
Training:
    x_0 (clean image) → add noise step by step → x_T (pure noise)
    Model learns to predict noise at each step: ε_θ(x_t, t)

Inference (sampling):
    x_T (random noise) → denoise step by step → x_0 (generated image)
    
    x_{t-1} = (1/√α_t) · (x_t - (β_t/√(1-ᾱ_t)) · ε_θ(x_t, t)) + σ_t · z
```

### Text-to-Image Pipeline (Stable Diffusion)

```
Text prompt → CLIP Text Encoder → text embeddings
                                        ↓
Random noise → U-Net (denoising) ← cross-attention with text embeddings
    (in latent space)       │
                            ↓
            Denoised latent → VAE Decoder → Full-resolution image
```

### Image Generation Models

| Model | Type | Key feature | Resolution |
|-------|------|-------------|-----------|
| DALL-E 3 | Diffusion (closed) | Best text understanding | 1024×1024 |
| Midjourney v6 | Diffusion (closed) | Aesthetic quality | Up to 2048 |
| Stable Diffusion XL | Latent diffusion (open) | Customizable, fine-tunable | 1024×1024 |
| Stable Diffusion 3 | MMDiT (open) | Multi-modal Transformer backbone | 1024×1024 |
| Flux | Rectified flow (open) | Fast, high quality | 1024×1024 |
| Imagen 3 | Diffusion (closed) | Photorealism | Variable |

### Control Mechanisms

| Method | Controls | How |
|--------|---------|-----|
| Text prompt | Content, style, composition | Natural language description |
| Negative prompt | What to avoid | "blurry, low quality, watermark" |
| ControlNet | Spatial structure | Edge maps, depth maps, pose |
| IP-Adapter | Style/subject reference | Reference image embeddings |
| LoRA | Style/character fine-tuning | Low-rank adaptation on diffusion model |
| Inpainting | Edit specific regions | Mask + prompt |
| img2img | Transform existing image | Input image + denoising strength |

---

## Safety & Alignment

### Alignment Techniques

| Technique | How | Applied at |
|-----------|-----|-----------|
| RLHF (PPO) | Human preferences → reward model → RL | Post-training |
| DPO | Direct optimization on preference pairs | Post-training |
| Constitutional AI | Self-critique against principles | Post-training |
| Red-teaming | Adversarial testing by humans/AI | Evaluation |
| System prompts | Instructions constraining behavior | Inference |
| Output filtering | Classifier on generated text | Inference |
| Input filtering | Block harmful prompts before processing | Inference |

### Guardrails

```
User input → Input guard (toxic/jailbreak detection)
                    │
                    ▼
              LLM generation
                    │
                    ▼
           Output guard (harmful content, PII, hallucination detection)
                    │
                    ▼
              Safe response to user
```

| Guardrail tool | Type |
|---------------|------|
| NVIDIA NeMo Guardrails | Programmable rails (topical, safety, security) |
| Guardrails AI | Schema validation + LLM output verification |
| LLM Guard (Protect AI) | Input/output scanning for risk categories |
| Lakera Guard | Prompt injection + data leakage detection |

---

## Cost & Latency Optimization

### Strategies

| Strategy | Cost reduction | Latency impact |
|----------|---------------|----------------|
| Smaller model (route easy queries) | 50-90% | Faster |
| Caching (semantic cache) | 30-70% | Much faster (cache hit) |
| Prompt compression | 20-40% | Faster (fewer tokens) |
| Batch API calls | 50% (OpenAI batch) | Higher (async) |
| Self-hosted open model | 60-80% vs API | Depends on hardware |
| Streaming | None | Better UX (time-to-first-token) |
| Speculative decoding | None (same quality) | 2-3× faster |
| Quantization (INT4/INT8) | GPU cost reduction | Same or slightly faster |

### Model Routing

```
User query → Complexity classifier
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
       Simple   Medium   Complex
          │        │        │
       Small     Medium   Large
       model     model    model
      (fast,    (balanced) (slow,
      cheap)              expensive)
```

Use a small classifier or LLM to route queries to the appropriate model tier — saves 60-80% of costs while maintaining quality on hard queries.
