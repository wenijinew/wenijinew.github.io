# Multimodal AI

*Written: 2026-08-23*

## What Is Multimodal AI?

Systems that can process, understand, and generate information across multiple modalities (text, images, audio, video, 3D, etc.) in a unified framework.

```
Modalities:
├── Text (natural language, code, structured data)
├── Vision (images, video, depth, 3D)
├── Audio (speech, music, environmental sounds)
├── Tactile (haptic feedback, pressure)
├── Structured (tables, graphs, knowledge bases)
└── Actions (robotics, tool use)

Multimodal tasks:
├── Understanding: VQA, captioning, cross-modal retrieval
├── Generation: text→image, text→video, text→audio
├── Reasoning: chart QA, document understanding, spatial reasoning
└── Interaction: embodied AI, multimodal dialogue
```

---

## Multimodal Foundation Models

### Architecture Approaches

| Approach | How | Examples |
|----------|-----|---------|
| Dual encoder | Separate encoders, shared embedding space | CLIP, ALIGN, SigLIP |
| Fusion encoder | Early fusion of modalities in single model | Flamingo, LLaVA |
| Encoder-decoder | Encode input modality, decode output modality | Stable Diffusion, DALL-E |
| Unified model | Single model handles all modalities natively | Gemini, GPT-4o |
| MoE routing | Route different modalities to different experts | Unified-IO 2 |

### Key Models

| Model | Year | Developer | Modalities | Architecture |
|-------|------|-----------|------------|-------------|
| CLIP | 2021 | OpenAI | Image + Text | Dual encoder (contrastive) |
| Flamingo | 2022 | DeepMind | Image/Video + Text | Frozen LM + visual perceiver |
| GPT-4V | 2023 | OpenAI | Image + Text | Unified Transformer |
| LLaVA | 2023 | UW/MS | Image + Text | CLIP encoder + LLaMA |
| Gemini 1.5 | 2024 | Google | Image + Video + Audio + Text | Unified MoE Transformer |
| GPT-4o | 2024 | OpenAI | Image + Audio + Text | Native multimodal |
| Claude 3.5 | 2024 | Anthropic | Image + Text | Unified architecture |
| InternVL 2.5 | 2024 | Shanghai AI Lab | Image + Text | Dynamic resolution + LLM |
| Qwen2-VL | 2024 | Alibaba | Image + Video + Text | Dynamic resolution ViT + Qwen |
| Pixtral | 2024 | Mistral | Image + Text | Variable resolution, native |

---

## Vision-Language Models

### CLIP (Contrastive Language-Image Pre-training)

```
Training (400M image-text pairs from internet):
    Image → ViT encoder → image embedding (768-d)
    Text  → Transformer encoder → text embedding (768-d)
    
    Loss: InfoNCE contrastive loss
        - Maximize similarity of matching (image, text) pairs
        - Minimize similarity of non-matching pairs in batch

Zero-shot classification:
    Classes: ["cat", "dog", "bird"]
    Prompts: ["a photo of a cat", "a photo of a dog", "a photo of a bird"]
    
    Encode prompts → text embeddings
    Encode image → image embedding
    Predict: argmax(cosine_similarity(image_emb, text_embs))
```

**CLIP's impact:**
- Foundation for most modern vision-language models
- Text-conditioned image generation (Stable Diffusion uses CLIP text encoder)
- Zero-shot transfer to any visual classification task
- Enables open-vocabulary detection/segmentation

### LLaVA Architecture (Visual Instruction Tuning)

```
Image → CLIP ViT-L/14 → patch embeddings (576 tokens)
                              │
                    Linear projection (align vision → language)
                              │
                              ▼
Text instruction → Tokenizer → token embeddings
                              │
                              ▼
                    LLM (LLaMA/Vicuna)
                              │
                              ▼
                    Generated text response

Training stages:
1. Pre-training: align visual features to language (frozen LLM, train projector)
2. Fine-tuning: visual instruction tuning (unfreeze LLM, train end-to-end)
```

### Visual Question Answering (VQA)

```
Input: Image + "How many red cars are in the parking lot?"
Output: "3"

Challenges:
- Spatial reasoning ("left of", "behind")
- Counting (models struggle with exact counts)
- Common sense ("Is this person happy?")
- Multi-step reasoning ("Which object would fall first if pushed?")
```

### Document Understanding

| Task | Input | Output | Model |
|------|-------|--------|-------|
| OCR | Document image | Extracted text | PaddleOCR, EasyOCR |
| Layout analysis | Document image | Regions (title, table, figure) | LayoutLM, DiT |
| Table extraction | Table image | Structured data (CSV/JSON) | TableFormer, GPT-4V |
| Chart QA | Chart/graph + question | Answer | ChartLlama, Deplot |
| Form understanding | Form image | Key-value pairs | LayoutLMv3, Donut |
| Full document QA | Multi-page PDF + question | Answer with citation | DocQuery, GPT-4V |

---

## Text-to-Image Generation

### Pipeline (Stable Diffusion)

```
Text prompt → CLIP Text Encoder → text embeddings (conditioning)
                                        │
                                   Cross-attention
                                        │
Random latent noise → U-Net denoiser ──→ Denoised latent
                      (T timesteps)           │
                                        VAE Decoder → Full image (512×512 or 1024×1024)
```

### Evolution

| Model | Year | Key advancement |
|-------|------|----------------|
| DALL-E | 2021 | First large-scale text→image (dVAE + Transformer) |
| DALL-E 2 | 2022 | CLIP guidance + diffusion |
| Stable Diffusion | 2022 | Latent diffusion (open-source, efficient) |
| Midjourney v5 | 2023 | Aesthetic quality leap |
| SDXL | 2023 | Dual text encoders, refiner model |
| DALL-E 3 | 2023 | Much better text understanding (caption-first) |
| Stable Diffusion 3 | 2024 | Rectified flow + MMDiT (multi-modal DiT) |
| Flux | 2024 | Fast, high-quality rectified flow |
| Imagen 3 | 2024 | Photorealism, text rendering |

### Conditioning and Control

| Method | Controls | Mechanism |
|--------|----------|-----------|
| Text prompt | Content, style, composition | Cross-attention conditioning |
| Negative prompt | What to avoid | Classifier-free guidance (negative) |
| ControlNet | Spatial structure (edge, depth, pose) | Trainable copy of encoder + zero-conv |
| IP-Adapter | Style from reference image | Image embeddings via cross-attention |
| T2I-Adapter | Lightweight spatial conditioning | Adapter layers (cheaper than ControlNet) |
| LoRA | Custom style/subject | Fine-tuned low-rank weights |
| Textual Inversion | New concept from few images | Learned embedding vector |
| DreamBooth | Personalized subject generation | Fine-tune entire model on few images |
| Inpainting | Edit specific region | Masked denoising |

---

## Text-to-Video

### Models

| Model | Year | Developer | Capability |
|-------|------|-----------|-----------|
| Make-A-Video | 2022 | Meta | Text/image → short video |
| Gen-2 (Runway) | 2023 | Runway | Text → 4s video, video editing |
| Stable Video Diffusion | 2023 | Stability AI | Image → video (motion) |
| Sora | 2024 | OpenAI | Text → up to 60s video, realistic |
| Kling | 2024 | Kuaishou | Text/image → video, long form |
| Veo 2 | 2024 | Google DeepMind | Text → high-quality video |

### Challenges

| Challenge | Why it's hard | Current approaches |
|-----------|-------------|-------------------|
| Temporal consistency | Objects should look the same across frames | 3D-aware generation, temporal attention |
| Physics | Objects should follow physical laws | Physics simulation training data |
| Long-form coherence | Narrative consistency over 60+ seconds | Hierarchical generation, planning |
| Text rendering | Text in video should be readable | Still largely unsolved |
| Controllability | Precise camera motion, character actions | ControlNet for video, motion conditioning |
| Compute cost | Orders of magnitude more than images | Latent video diffusion, efficient architectures |

---

## Text-to-Audio / Speech

### Text-to-Speech (TTS)

| Model | Year | Innovation |
|-------|------|-----------|
| Tacotron 2 | 2018 | Attention-based mel spectrogram synthesis |
| VITS | 2021 | End-to-end (text → waveform) with VAE |
| Bark (Suno) | 2023 | Multi-speaker, emotions, non-speech sounds |
| XTTS (Coqui) | 2023 | Zero-shot voice cloning from 6s sample |
| VALL-E (Microsoft) | 2023 | Neural codec language model (3s cloning) |
| Parler-TTS | 2024 | Describe voice style in text |
| F5-TTS | 2024 | Flow matching, zero-shot, fast |

### Music Generation

| Model | Year | Developer | Approach |
|-------|------|-----------|----------|
| MusicLM | 2023 | Google | Hierarchical tokens from text |
| MusicGen | 2023 | Meta | Single-stage Transformer on codecs |
| Stable Audio | 2023 | Stability AI | Latent diffusion for audio |
| Udio | 2024 | Udio | Full song generation from text |
| Suno v3 | 2024 | Suno | Lyrics + style → full song |

---

## Cross-Modal Retrieval

### Architecture

```
Text → Text Encoder ─────────────→ Shared
                                    Embedding ← Similarity
Image → Image Encoder ───────────→ Space        Search
                                    
Audio → Audio Encoder ───────────→

Query (any modality) → retrieve results (any modality)
```

### Training Approaches

| Approach | Method | Scale |
|----------|--------|-------|
| Contrastive (CLIP-style) | InfoNCE on paired data | Billions of pairs |
| Generative (CoCa) | Contrastive + captioning jointly | Multi-task |
| Distillation (ImageBind) | Bind all modalities to image embedding | One pivot modality |

### ImageBind (Meta)

```
Key insight: use images as a "binding" modality
    - Image ↔ Text (CLIP)
    - Image ↔ Audio (paired video)
    - Image ↔ Depth (paired RGBD)
    - Image ↔ Thermal (paired thermal)
    - Image ↔ IMU (ego4d)

Result: ALL modalities are aligned without needing all-pairs data
    Text ↔ Audio emerges (through shared image space)
    Audio ↔ Depth emerges
    → "Zero-shot" cross-modal retrieval between any pair
```

---

## Multimodal Reasoning

### Visual Reasoning Tasks

| Task | Challenge | Example |
|------|-----------|---------|
| Spatial reasoning | Understanding 3D layout from 2D | "Is the cup to the left of the book?" |
| Counting | Precise enumeration | "How many people are wearing hats?" |
| OCR + reasoning | Read text and reason about it | "What is the total on this receipt?" |
| Chart understanding | Extract data from visualizations | "Which quarter had highest revenue?" |
| Multi-image reasoning | Compare/relate multiple images | "What changed between these two photos?" |
| Video temporal reasoning | Understand events over time | "What happened after the person sat down?" |

### Chain-of-Thought for Multimodal

```
Image: [complex scene with multiple objects]
Question: "If the ball rolls off the table, what will it hit first?"

Standard answer: "The chair"

Chain-of-thought:
    1. I can see a ball on the edge of the table
    2. Below the table, there's a chair to the left and a box to the right
    3. The ball is positioned on the left side of the table
    4. Due to gravity, it would fall straight down
    5. The chair is directly below where the ball would fall
    Answer: "The ball would hit the chair first"
```

---

## Multimodal Agents

### Architecture

```
User (text + image + audio) → Perception Module
                                    │
                          ┌─────────┼─────────┐
                          ▼         ▼         ▼
                     Vision     Language    Audio
                     Encoder    Model      Encoder
                          │         │         │
                          └─────────┼─────────┘
                                    │
                               Fusion / LLM
                                    │
                          ┌─────────┼─────────┐
                          ▼         ▼         ▼
                     Reason      Plan      Act
                     (CoT)    (decompose)  (tools)
                                    │
                          Tool execution (web, code, APIs)
                                    │
                          Multimodal response (text + image + audio)
```

### Capabilities

| Capability | Example |
|-----------|---------|
| Visual grounding | "Click the blue button in the screenshot" |
| GUI navigation | "Book a flight on this website" (sees screenshots) |
| Document analysis | "Summarize this PDF" (processes pages as images) |
| Real-world interaction | Robotics guided by visual + language understanding |
| Creative generation | "Make a video about X in the style of Y" |

---

## Evaluation

### Benchmarks

| Benchmark | Modalities | Task | Metric |
|-----------|-----------|------|--------|
| VQAv2 | Image + Text | Visual QA | Accuracy |
| GQA | Image + Text | Compositional reasoning | Accuracy |
| TextVQA | Image (with text) + Text | OCR-based QA | Accuracy |
| MMMU | Image + Text | University-level reasoning | Accuracy |
| MathVista | Image + Text | Mathematical reasoning | Accuracy |
| MMBench | Image + Text | Multi-ability evaluation | Score |
| Video-MME | Video + Text | Video understanding | Accuracy |
| SEED-Bench | Image/Video + Text | Generative comprehension | Accuracy |
| Perception Test | Video + Text + Audio | Perception skills | Accuracy |
| AudioCaps | Audio + Text | Audio captioning | CIDEr, SPICE |

### Limitations and Challenges

| Challenge | Description | Status |
|-----------|-------------|--------|
| Hallucination | Describes objects not in image | Active research (POPE, CHAIR metrics) |
| Spatial reasoning | Poor at "left/right/above/below" | Improving with better training data |
| Counting | Fails at counting > 5-6 objects | Partially solved with CoT |
| Fine-grained OCR | Misreads small or stylized text | Improving with higher resolution |
| Temporal understanding | Struggles with "before/after" in video | Active research area |
| Cultural bias | Western-centric understanding | Multilingual/multicultural datasets |
| Grounding accuracy | Says "red car" but can't point to it | Grounding models (Florence-2) |

---

## Training Multimodal Models

### Data

| Data type | Scale | Sources |
|-----------|-------|---------|
| Image-text pairs | 400M - 5B | LAION, CC3M, CC12M, web crawl |
| Image-text (curated) | 10M - 100M | ShareGPT4V, ALLaVA, synthetic captions |
| Video-text | 10M - 100M | WebVid, InternVid, HowTo100M |
| Audio-text | 1M - 50M | AudioSet, WavCaps, AudioCaps |
| Instruction tuning | 100K - 1M | LLaVA-Instruct, multimodal chat data |

### Training Stages (Typical)

```
Stage 1: Vision-Language Alignment (pre-training)
    - Freeze vision encoder + LLM
    - Train only the projection layer
    - Data: large-scale image-caption pairs
    - Goal: align visual features to language embedding space

Stage 2: Visual Instruction Tuning (fine-tuning)
    - Unfreeze LLM (optionally vision encoder)
    - Train on instruction-following data
    - Data: VQA, detailed descriptions, reasoning, conversations
    - Goal: follow instructions involving visual content

Stage 3 (optional): RLHF / DPO alignment
    - Human preference on multimodal outputs
    - Reduce hallucination, improve helpfulness
```

### Efficient Multimodal Training

| Technique | Purpose |
|-----------|---------|
| Frozen encoders | Don't retrain CLIP/ViT — only train connector |
| Dynamic resolution | Process images at native aspect ratio, variable tokens |
| Visual token compression | Reduce patch tokens (perceiver resampler, pooling) |
| LoRA on LLM | Parameter-efficient adaptation |
| Mixed precision (BF16) | Memory savings |
| Gradient checkpointing | Trade compute for memory |
