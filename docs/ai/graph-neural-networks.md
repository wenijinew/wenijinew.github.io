# Graph Neural Networks

*Written: 2026-08-23*

## Why Graphs?

Many real-world data are naturally structured as graphs — entities (nodes) connected by relationships (edges). Standard neural networks assume grid-like (images) or sequential (text) structure and cannot directly operate on arbitrary graph topologies.

| Domain | Nodes | Edges | Task |
|--------|-------|-------|------|
| Social networks | Users | Friendships, follows | Community detection, link prediction |
| Molecular chemistry | Atoms | Bonds | Property prediction, drug discovery |
| Knowledge graphs | Entities | Relations | Link prediction, reasoning |
| Citation networks | Papers | Citations | Paper classification |
| Transportation | Intersections | Roads | Traffic prediction |
| Recommendation | Users + items | Interactions | Collaborative filtering |
| Protein structure | Amino acids | Spatial proximity | Function prediction |
| Code analysis | AST nodes | Parent-child, data flow | Bug detection |

---

## Graph Fundamentals

### Notation

```
G = (V, E)          Graph with vertices V and edges E
A ∈ {0,1}^(n×n)     Adjacency matrix (A_ij = 1 if edge between i and j)
D = diag(d₁,...,dₙ) Degree matrix (d_i = number of neighbors of node i)
X ∈ ℝ^(n×f)         Node feature matrix (n nodes, f features each)
E ∈ ℝ^(m×d)         Edge feature matrix (m edges, d features each)
L = D - A           Graph Laplacian (unnormalized)
L̃ = I - D^(-½)AD^(-½)  Normalized graph Laplacian
```

### Graph Types

| Type | Properties | Example |
|------|-----------|---------|
| Undirected | A = Aᵀ | Friendships |
| Directed | A ≠ Aᵀ | Citations, web links |
| Weighted | Edge values ∈ ℝ | Road distances |
| Bipartite | Two node sets, edges only between sets | Users ↔ Items |
| Heterogeneous | Multiple node/edge types | Knowledge graphs |
| Hypergraph | Edges connect >2 nodes | Group interactions |
| Dynamic/temporal | Edges change over time | Evolving social networks |

---

## Message Passing Framework

Most GNNs follow the **message passing** paradigm:

```
For each layer l:
    1. MESSAGE:   m_ij = MSG(h_i^(l), h_j^(l), e_ij)    (compute messages from neighbors)
    2. AGGREGATE: M_i  = AGG({m_ij : j ∈ N(i)})          (combine neighbor messages)
    3. UPDATE:    h_i^(l+1) = UPD(h_i^(l), M_i)          (update node representation)
```

**General form:**

$$h_i^{(l+1)} = \phi\left(h_i^{(l)}, \bigoplus_{j \in \mathcal{N}(i)} \psi(h_i^{(l)}, h_j^{(l)}, e_{ij})\right)$$

where ⊕ is a permutation-invariant aggregation (sum, mean, max).

---

## Core Architectures

### GCN (Graph Convolutional Network)

**Layer operation:**

$$H^{(l+1)} = \sigma\left(\tilde{D}^{-\frac{1}{2}} \tilde{A} \tilde{D}^{-\frac{1}{2}} H^{(l)} W^{(l)}\right)$$

where:
- Ã = A + I (adjacency with self-loops)
- D̃ = degree matrix of Ã
- W^(l) = learnable weight matrix
- σ = activation (ReLU)

**Per-node form:**

$$h_i^{(l+1)} = \sigma\left(W^{(l)} \sum_{j \in \mathcal{N}(i) \cup \{i\}} \frac{h_j^{(l)}}{\sqrt{d_i \cdot d_j}}\right)$$

**Properties:**
- Symmetric normalization (1/√(d_i·d_j)) prevents high-degree nodes from dominating
- Self-loops ensure node's own features are included
- Each layer aggregates 1-hop neighborhood → L layers = L-hop receptive field
- Spectral interpretation: approximation of graph convolution in frequency domain

### GraphSAGE (SAmple and aggreGatE)

**Key innovation:** Sample fixed-size neighborhood instead of using all neighbors.

```
For each target node:
    1. Sample K neighbors at each layer (not all)
    2. Aggregate sampled neighbor features
    3. Concatenate with own features
    4. Apply linear transform + nonlinearity

h_i^(l+1) = σ(W · CONCAT(h_i^(l), AGG({h_j^(l) : j ∈ SAMPLE(N(i), K)})))
```

**Aggregation options:**

| Aggregator | Method | Properties |
|-----------|--------|------------|
| Mean | Average neighbor features | Simple, effective |
| Pool | Max-pool after linear transform | Captures salient features |
| LSTM | Order-invariant LSTM on random permutation | More expressive (in theory) |
| GCN-style | Normalized mean (like GCN) | Spectral-like |

**Advantage:** Inductive — can generalize to unseen nodes/graphs (unlike transductive GCN).

### GAT (Graph Attention Network)

**Key innovation:** Learn different weights for different neighbors using attention.

$$\alpha_{ij} = \frac{\exp(\text{LeakyReLU}(a^T [W h_i \| W h_j]))}{\sum_{k \in \mathcal{N}(i)} \exp(\text{LeakyReLU}(a^T [W h_i \| W h_k]))}$$

$$h_i^{(l+1)} = \sigma\left(\sum_{j \in \mathcal{N}(i)} \alpha_{ij} W h_j^{(l)}\right)$$

**Multi-head attention (like Transformer):**

$$h_i^{(l+1)} = \|_{k=1}^{K} \sigma\left(\sum_{j \in \mathcal{N}(i)} \alpha_{ij}^k W^k h_j^{(l)}\right)$$

- || = concatenation (intermediate layers) or averaging (final layer)
- Attention allows model to focus on important neighbors
- No need for spectral graph knowledge
- Handles variable-degree nodes naturally

### GIN (Graph Isomorphism Network)

**Most expressive GNN under the Weisfeiler-Leman test:**

$$h_i^{(l+1)} = \text{MLP}\left((1 + \epsilon) \cdot h_i^{(l)} + \sum_{j \in \mathcal{N}(i)} h_j^{(l)}\right)$$

- ε = learnable parameter (or fixed)
- Sum aggregation (not mean/max) maximizes expressiveness
- Provably as powerful as 1-WL graph isomorphism test
- Best for graph classification where you need to distinguish different structures

---

## Architecture Comparison

| Model | Year | Aggregation | Attention | Inductive | Complexity |
|-------|------|-------------|-----------|-----------|-----------|
| GCN | 2017 | Normalized mean | No | No (transductive) | O(\|E\|·f) |
| GraphSAGE | 2017 | Mean/pool/LSTM | No | Yes | O(K^L · f²) |
| GAT | 2018 | Attention-weighted | Yes | Yes | O(\|V\|·f + \|E\|·f) |
| GIN | 2019 | Sum + MLP | No | Yes | O(\|E\|·f) |
| GATv2 | 2022 | Dynamic attention | Yes (fixed) | Yes | Same as GAT |

---

## Graph-Level Tasks

### Graph Pooling (Readout)

To get a single vector for the entire graph from node embeddings:

| Method | Approach | Properties |
|--------|----------|-----------|
| Global mean pool | Average all node embeddings | Simple, loses structure info |
| Global max pool | Element-wise max over nodes | Captures salient features |
| Global sum pool | Sum all node embeddings | Sensitive to graph size |
| Hierarchical (DiffPool) | Learn soft assignment to coarser graph | Preserves structure |
| Set2Set | LSTM-based attention over node set | Order-invariant, expressive |
| SAGPool | Score nodes, keep top-k | Learnable graph sparsification |
| Virtual node | Add global node connected to all | Propagates global info |

### Applications in Graph Classification

| Domain | Task | Input graph | Output |
|--------|------|-------------|--------|
| Drug discovery | Molecular property prediction | Molecule (atoms + bonds) | Solubility, toxicity, binding |
| Materials science | Crystal property prediction | Crystal structure | Band gap, stability |
| Program analysis | Bug detection | Control flow graph | Bug/no-bug |
| Brain imaging | Disease classification | fMRI connectivity | AD/healthy |

---

## Heterogeneous Graph Networks

### Heterogeneous Graphs

Multiple node types and/or edge types (relations):

```
Example: Academic graph
    Node types: Paper, Author, Venue
    Edge types: writes(Author→Paper), cites(Paper→Paper), published_in(Paper→Venue)
```

### Relational GCN (R-GCN)

$$h_i^{(l+1)} = \sigma\left(\sum_{r \in R} \sum_{j \in N_r(i)} \frac{1}{|N_r(i)|} W_r^{(l)} h_j^{(l)} + W_0^{(l)} h_i^{(l)}\right)$$

- Separate weight matrix W_r for each relation type r
- Can have many parameters → use basis decomposition or block-diagonal

### HAN (Heterogeneous Attention Network)

```
1. Define meta-paths (e.g., Author → Paper → Author, Paper → Venue → Paper)
2. For each meta-path, compute attention between connected node pairs
3. Aggregate across meta-paths with semantic-level attention
```

---

## Scalability

### Challenges

- Full-batch GCN requires storing entire graph + all embeddings in memory
- Neighbor explosion: L layers → exponential growth in receptive field nodes
- Large graphs (>1M nodes): cannot fit in GPU memory

### Solutions

| Method | Approach | Scales to |
|--------|----------|-----------|
| Neighbor sampling (GraphSAGE) | Fixed-size random sample per layer | Millions of nodes |
| Cluster-GCN | Partition graph into clusters, train on subgraphs | Large graphs |
| GraphSAINT | Sample subgraphs with variance reduction | Large graphs |
| ShaDow-GNN | Extract local subgraph per target node | Very large graphs |
| Mini-batch via NeighborLoader | Sample k neighbors per node per layer | Production systems |
| Distributed training | Partition across machines (DGL, PyG) | Billion-node graphs |

### Mini-Batch Training (PyG Example)

```python
from torch_geometric.loader import NeighborLoader

loader = NeighborLoader(
    data,
    num_neighbors=[25, 10],    # sample 25 at layer 1, 10 at layer 2
    batch_size=512,            # 512 target nodes per batch
    input_nodes=train_mask,
)

for batch in loader:
    out = model(batch.x, batch.edge_index)
    loss = criterion(out[:batch.batch_size], batch.y[:batch.batch_size])
    loss.backward()
    optimizer.step()
```

---

## Graph Transformers

### Motivation

Standard GNNs are limited by:
- Over-squashing (information bottleneck through narrow paths)
- Over-smoothing (node representations converge after many layers)
- Limited to local neighborhoods (bounded receptive field)

Graph Transformers apply global attention to overcome these.

### Approaches

| Model | Year | Positional encoding | Attention scope |
|-------|------|-------------------|----------------|
| GT (Dwivedi) | 2020 | Laplacian eigenvectors | Global |
| SAN | 2021 | Learned structural encodings | Global |
| Graphormer | 2021 | Centrality + spatial + edge encoding | Global |
| GPS (General Powerful Scalable) | 2022 | Random walk PE + GNN | Local (MPNN) + Global (Transformer) |
| TokenGT | 2022 | Node/edge tokens, type embedding | Global |
| Exphormer | 2023 | Sparse attention (virtual + expander) | Sparse global |

### GPS Architecture (Hybrid)

```
Input: node features + positional/structural encoding
    │
    ▼
For each layer:
    ├── Local MPNN branch (e.g., GatedGCN) → captures local structure
    ├── Global Transformer branch → captures long-range dependencies
    └── Combine (sum/concat) → output for this layer
    │
    ▼
Readout → Task head
```

---

## Self-Supervised Learning on Graphs

### Pre-training Objectives

| Method | Approach | Level |
|--------|----------|-------|
| Node feature masking | Mask node features, predict from neighbors | Node |
| Edge prediction | Predict if edge exists between node pairs | Edge |
| Graph contrastive (GraphCL) | Augment graph, contrastive learning | Graph |
| DGI (Deep Graph Infomax) | Maximize mutual info (local vs global) | Node + Graph |
| BGRL | Bootstrap augmented views (no negatives) | Node |
| GraphMAE | Masked autoencoder for graphs | Node |

### Graph Augmentations

| Augmentation | Method |
|-------------|--------|
| Node dropping | Remove random nodes |
| Edge perturbation | Add/remove random edges |
| Feature masking | Zero out random feature dimensions |
| Subgraph sampling | Extract random connected subgraph |
| Graph diffusion | Smooth features via diffusion kernel |

---

## Applications Deep Dive

### Drug Discovery

```
Molecule → Graph (atoms=nodes, bonds=edges)
    │
    ▼
GNN encoder → molecular embedding
    │
    ▼
Property prediction: solubility, toxicity, binding affinity
                     or generation of new molecules
```

| Task | Method | Impact |
|------|--------|--------|
| Virtual screening | Score molecule-target binding | Filter millions of candidates |
| ADMET prediction | Predict absorption, distribution, metabolism, excretion, toxicity | Early-stage filtering |
| Molecule generation | VAE/flow/diffusion on molecular graphs | Design novel compounds |
| Protein-ligand docking | Predict binding pose and affinity | 3D structure prediction |

### Recommendation Systems

```
User-Item bipartite graph:
    Users ←→ Items (edges = interactions: purchase, click, rate)
    
GNN propagation:
    User embedding = aggregate(embeddings of interacted items)
    Item embedding = aggregate(embeddings of interacting users)
    
Prediction: score(user, item) = dot(user_embedding, item_embedding)
```

| Model | Approach |
|-------|----------|
| PinSage (Pinterest) | Random walk + GraphSAGE on pin-board graph |
| LightGCN | Simplified GCN (no feature transform, no activation) for CF |
| NGCF | Embed user-item interactions in GNN message passing |

---

## Tools & Libraries

| Library | Language | Strengths |
|---------|----------|-----------|
| PyTorch Geometric (PyG) | Python/PyTorch | Most popular, extensive models, good docs |
| DGL (Deep Graph Library) | Python/PyTorch/MXNet | Scalable, message passing API |
| GraphNets (DeepMind) | Python/TensorFlow | Research-focused |
| Spektral | Python/Keras | Easy to use, Keras integration |
| OGB (Open Graph Benchmark) | Python | Standard benchmarks for graph ML |
| NetworkX | Python | Graph manipulation (not ML, preprocessing) |
| Neo4j GDS | Java/Python | Graph algorithms on Neo4j databases |

---

## Current Challenges & Frontiers

| Challenge | Description | Active approaches |
|-----------|-------------|-------------------|
| Over-smoothing | Node representations become identical with depth | Residual connections, normalization, jumping knowledge |
| Over-squashing | Information bottleneck through graph topology | Graph rewiring, virtual nodes, Graph Transformers |
| Expressiveness | 1-WL limit — cannot distinguish certain graph structures | Higher-order GNNs (k-WL), subgraph GNNs |
| Scalability | Billion-node graphs (web, social) | Sampling, partitioning, distributed training |
| Dynamic graphs | Graph structure changes over time | Temporal GNNs (TGAT, TGN), snapshot methods |
| Heterogeneity | Multiple node/edge types | R-GCN, HAN, heterogeneous message passing |
| 3D geometry | Molecules, proteins have 3D structure | Equivariant GNNs (EGNN, SE(3)-Transformers) |
| Foundation models | Pre-trained GNN for any graph task | Graph-level self-supervised pre-training |
