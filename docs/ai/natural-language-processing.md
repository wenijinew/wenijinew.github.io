# Natural Language Processing

*Written: 2026-08-23*

## NLP Pipeline Overview

```
Raw Text → Preprocessing → Tokenization → Encoding → Model → Task Head → Output
```

| Stage | Operation | Example |
|-------|-----------|---------|
| Preprocessing | Lowercasing, unicode normalization, noise removal | "It's GREAT!!!" → "it's great" |
| Tokenization | Split text into tokens | "unhappiness" → ["un", "happi", "ness"] |
| Encoding | Convert tokens to numerical IDs | ["un", "happi", "ness"] → [342, 8891, 1204] |
| Embedding | Map IDs to dense vectors | [342, 8891, 1204] → [[0.2, -0.1, ...], ...] |
| Contextualization | Apply model (Transformer, RNN) | Static embeddings → context-aware vectors |
| Task head | Classification, generation, extraction | Vectors → predicted labels, text, spans |

---

## Tokenization

### Methods

| Method | Approach | Vocabulary | Used by |
|--------|----------|-----------|---------|
| Word-level | Split on whitespace/punctuation | 50k-200k | Early NLP (Word2Vec era) |
| Character-level | Each character is a token | 256-1000 | ByT5 |
| BPE (Byte-Pair Encoding) | Iteratively merge frequent pairs | 30k-50k | GPT, RoBERTa, LLaMA |
| WordPiece | BPE variant with likelihood objective | 30k | BERT |
| Unigram | Start large, prune by loss | 32k | T5, XLNet, SentencePiece |

### BPE Algorithm

```
# Training
vocabulary = all individual characters
for i in range(num_merges):
    pair = most_frequent_adjacent_pair(corpus, vocabulary)
    vocabulary.add(merge(pair))
    corpus = apply_merge(corpus, pair)

# Encoding
function tokenize(word):
    tokens = list(word)
    while True:
        pair = find_highest_priority_merge(tokens)
        if pair not in vocabulary:
            break
        tokens = apply_merge(tokens, pair)
    return tokens
```

**Example:**

```
"lower" with learned merges: l, o, w, e, r → lo, w, er → low, er → lower
"lowest" → low, est  (shares "low" subword with "lower")
```

### Tokenization Impact on Models

| Issue | Cause | Consequence |
|-------|-------|-------------|
| OOV (Out-of-vocabulary) | Word-level tokenizers | Model can't handle unseen words |
| Token fertility | Languages with longer tokens per word | Non-English text uses more tokens → slower, expensive |
| Arithmetic failures | Numbers split into arbitrary sub-tokens | "1234" → "12", "34" — model loses numerical meaning |
| Spelling sensitivity | Character sequences not meaningful | "teh" tokenized differently from "the" |

---

## Word Embeddings

### Static Embeddings

| Method | Year | Approach | Key insight |
|--------|------|----------|-------------|
| Word2Vec (CBOW) | 2013 | Predict center word from context | Co-occurrence captures meaning |
| Word2Vec (Skip-gram) | 2013 | Predict context from center word | Better for rare words |
| GloVe | 2014 | Factorize co-occurrence matrix | Global statistics + local context |
| FastText | 2016 | Skip-gram on character n-grams | Handles OOV, morphology |

**Word2Vec Skip-gram objective:**

$$\max \sum_{t=1}^T \sum_{-c \leq j \leq c, j \neq 0} \log P(w_{t+j} | w_t)$$

$$P(w_O | w_I) = \frac{\exp(v'_{w_O} \cdot v_{w_I})}{\sum_{w=1}^W \exp(v'_w \cdot v_{w_I})}$$

**Negative sampling** makes this tractable:

$$\log \sigma(v'_{w_O} \cdot v_{w_I}) + \sum_{i=1}^k \mathbb{E}_{w_i \sim P_n(w)} [\log \sigma(-v'_{w_i} \cdot v_{w_I})]$$

### Properties of Word Embeddings

```
king - man + woman ≈ queen          (gender analogy)
Paris - France + Japan ≈ Tokyo      (capital analogy)
walking - walk + swim ≈ swimming    (tense analogy)
```

**Limitations of static embeddings:**
- One vector per word regardless of context ("bank" = river bank = financial bank)
- Cannot handle polysemy or word sense disambiguation
- Fixed vocabulary — OOV problem (mitigated by FastText)

### Contextual Embeddings (Modern)

| Model | Embedding dim | Context | Key property |
|-------|--------------|---------|--------------|
| ELMo | 1024 | BiLSTM | First contextual: different vector per usage |
| BERT-base | 768 | Bidirectional Transformer | Deep bidirectional context |
| GPT-2 | 1600 | Unidirectional Transformer | Left-context only |
| Sentence-BERT | 768 | Siamese BERT | Sentence-level similarity |

---

## Attention Mechanisms in NLP

### Evolution of Attention

| Year | Mechanism | Paper | Contribution |
|------|-----------|-------|-------------|
| 2014 | Additive (Bahdanau) | Neural Machine Translation | Align source to target |
| 2015 | Multiplicative (Luong) | Effective Approaches | Simpler dot-product alignment |
| 2017 | Self-attention (Vaswani) | Attention Is All You Need | Remove recurrence entirely |
| 2018 | Multi-head | Same paper | Attend to different representation subspaces |
| 2020 | Cross-attention | DALL-E, CLIP | Connect different modalities |

### Bahdanau (Additive) Attention

```
# Alignment score
e_ij = v^T · tanh(W_s · s_{i-1} + W_h · h_j)

# Attention weights
α_ij = softmax(e_ij)

# Context vector
c_i = Σ_j α_ij · h_j
```

### Self-Attention vs Cross-Attention

| Type | Q source | K,V source | Use case |
|------|----------|-----------|----------|
| Self-attention | Same sequence | Same sequence | BERT, GPT (understand own context) |
| Cross-attention | Decoder | Encoder output | Translation, text-to-image |
| Causal self-attention | Same sequence (masked future) | Same sequence | GPT (autoregressive generation) |

---

## Pre-trained Language Models

### Training Objectives

| Objective | Method | Models |
|-----------|--------|--------|
| MLM (Masked Language Model) | Predict [MASK]ed tokens (15%) | BERT, RoBERTa, ALBERT |
| CLM (Causal Language Model) | Predict next token | GPT, LLaMA, Mistral |
| Seq2Seq denoising | Reconstruct corrupted input | T5, BART, UL2 |
| Contrastive | Align similar pairs, repel dissimilar | SimCSE, CLIP |
| Prefix LM | Bidirectional prefix + causal generation | PaLM, GLM |

### BERT Architecture

```
Input: [CLS] token_1 token_2 ... token_n [SEP] token_a token_b ... [SEP]
        ↓
Token embeddings + Segment embeddings + Position embeddings
        ↓
12 Transformer encoder layers (bidirectional self-attention)
        ↓
[CLS] vector → classification    |    token vectors → token-level tasks
```

**Pre-training tasks:**

1. **MLM:** Randomly mask 15% of tokens. Of those: 80% → [MASK], 10% → random token, 10% → unchanged. Predict original.
2. **NSP (Next Sentence Prediction):** Given sentence A and B, predict if B follows A. (Later shown to be unnecessary — RoBERTa drops it.)

### GPT Architecture

```
Input: token_1 token_2 ... token_n
        ↓
Token embeddings + Position embeddings
        ↓
N Transformer decoder layers (causal attention — each token attends only to left)
        ↓
Next token prediction: P(token_{n+1} | token_1, ..., token_n)
```

**Autoregressive generation:**

```
for each step:
    logits = model(context_tokens)
    next_token = sample(logits[-1], temperature, top_k, top_p)
    context_tokens.append(next_token)
```

### Decoding Strategies

| Strategy | Method | Trade-off |
|----------|--------|-----------|
| Greedy | argmax at each step | Deterministic, often repetitive |
| Beam search | Track top-k sequences | Better quality, still deterministic |
| Temperature sampling | Divide logits by T before softmax | T<1: sharper, T>1: more random |
| Top-k | Sample from top k tokens only | Limits unlikely tokens |
| Top-p (nucleus) | Sample from smallest set with cumulative P ≥ p | Adaptive vocabulary size |
| Repetition penalty | Reduce probability of already-generated tokens | Prevents loops |

---

## Core NLP Tasks

### Text Classification

| Task | Example | Metric |
|------|---------|--------|
| Sentiment analysis | "Great movie!" → Positive | Accuracy, F1 |
| Topic classification | Article → Sports/Politics/Tech | Macro-F1 |
| Intent detection | "Book a flight" → BookFlight | Accuracy |
| Spam detection | Email → Spam/Ham | Precision, Recall |
| Natural Language Inference | Premise + Hypothesis → Entail/Contradict/Neutral | Accuracy |

### Named Entity Recognition (NER)

**BIO tagging scheme:**

```
Elon   Musk  founded  SpaceX  in  2002  in  California
B-PER  I-PER O        B-ORG   O   B-DATE O  B-LOC
```

| Tag | Meaning |
|-----|---------|
| B-X | Beginning of entity type X |
| I-X | Inside (continuation) of entity type X |
| O | Outside any entity |

### Question Answering

| Type | Input | Output | Example model |
|------|-------|--------|---------------|
| Extractive | Context + question | Span from context | BERT, RoBERTa |
| Abstractive | Context + question | Generated answer | T5, GPT |
| Open-domain | Question only | Answer from knowledge | RAG, REALM |
| Multi-hop | Multiple documents | Reasoning chain | HotpotQA models |

### Machine Translation

**Evolution:**

| Era | Approach | Example |
|-----|----------|---------|
| Rule-based (1950s-1990s) | Grammar rules + dictionaries | SYSTRAN |
| Statistical (1990s-2016) | Phrase tables + language models | Moses |
| Neural (2016+) | Seq2seq with attention | Google NMT |
| LLM-based (2023+) | Prompt-based translation | GPT-4, NLLB |

### Text Summarization

| Type | Method | Output |
|------|--------|--------|
| Extractive | Select important sentences | Subset of input sentences |
| Abstractive | Generate new text | Novel phrasing of key ideas |
| Query-focused | Summarize w.r.t. specific question | Targeted summary |

---

## Retrieval-Augmented Generation (RAG)

### Architecture

```
Query → Retriever → Top-k Documents → Context + Query → Generator → Answer
         │                                                    │
    Dense retrieval                                    LLM (GPT, LLaMA)
    (bi-encoder)
```

### Components

| Component | Purpose | Implementation |
|-----------|---------|---------------|
| Chunking | Split documents into passages | Recursive splitting, semantic chunking |
| Embedding | Encode passages to vectors | Sentence-BERT, E5, BGE |
| Index | Store and search vectors | FAISS, Pinecone, pgvector |
| Retriever | Find relevant passages | Dense (bi-encoder), sparse (BM25), hybrid |
| Reranker | Re-score retrieved passages | Cross-encoder (more accurate, slower) |
| Generator | Produce final answer | LLM with retrieved context in prompt |

### Retrieval Methods Comparison

| Method | How it works | Strengths | Weaknesses |
|--------|-------------|-----------|------------|
| BM25 (sparse) | TF-IDF with saturation + length normalization | Exact keyword match, fast, no training | No semantic understanding |
| Dense retrieval | Embed query + docs, cosine similarity | Semantic matching, handles paraphrase | Needs training data, misses keywords |
| Hybrid (RRF) | Combine BM25 + dense scores | Best of both | More complex, two indexes |
| ColBERT | Late interaction (token-level matching) | Fine-grained matching | Larger index |

### RAG Challenges

| Challenge | Problem | Mitigation |
|-----------|---------|------------|
| Chunking strategy | Wrong boundaries lose context | Overlap chunks, semantic splitting |
| Retrieval quality | Irrelevant documents → hallucination | Reranker, query expansion, metadata filtering |
| Lost in the middle | LLMs ignore middle of long context | Put key info at start/end, compress |
| Stale data | Index out of date | Incremental indexing, TTL |
| Attribution | Can't trace answer to source | Citation generation, highlight spans |

---

## Evaluation Metrics for NLP

| Metric | Task | What it measures |
|--------|------|-----------------|
| BLEU | Translation | n-gram precision vs reference |
| ROUGE-L | Summarization | Longest common subsequence |
| BERTScore | Any generation | Semantic similarity via BERT embeddings |
| Perplexity | Language modeling | How well model predicts held-out text |
| Exact Match (EM) | QA | Predicted = ground truth (strict) |
| F1 (token-level) | QA, NER | Overlap between predicted and gold spans |
| METEOR | Translation | Unigram matching with stemming + synonyms |
| Human eval (Elo) | Open generation | Pairwise preference ranking |

---

## NLP Timeline & Key Papers

| Year | Paper | Contribution |
|------|-------|-------------|
| 2013 | Word2Vec (Mikolov) | Efficient word embeddings |
| 2014 | Seq2Seq + Attention (Bahdanau) | Neural machine translation |
| 2017 | Attention Is All You Need (Vaswani) | Transformer architecture |
| 2018 | ELMo (Peters) | Contextual embeddings |
| 2018 | BERT (Devlin) | Bidirectional pre-training |
| 2019 | GPT-2 (Radford) | Large-scale language generation |
| 2020 | GPT-3 (Brown) | Few-shot learning via scale |
| 2020 | RAG (Lewis) | Retrieval-augmented generation |
| 2022 | ChatGPT / InstructGPT | RLHF alignment |
| 2023 | GPT-4 | Multimodal, reasoning |
| 2024 | Mixture of Experts at scale | Efficient scaling (Mixtral, DBRX) |
| 2025 | Long-context models (1M+ tokens) | Full-document understanding |
