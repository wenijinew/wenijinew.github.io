---
tags:
  - overview
  - tools
---

# AI for Code

*Written: 2026-08-23*

## Code Intelligence Landscape

```
                        AI for Code
                            │
     ┌──────────┬──────────┼──────────┬──────────┐
     │          │          │          │          │
 Generation  Understanding  Repair   Analysis  Translation
     │          │          │          │          │
 Copilot    Code search   Bug fix   Review    Language
 Completion Summarize     Patch     Vulnerab. migration
 Full-file  Navigation    Debug     Optimize  Framework
```

| Capability | What it does | Example tools |
|-----------|-------------|---------------|
| Code completion | Predict next tokens/lines | GitHub Copilot, Cursor, Supermaven |
| Code generation | Full function/file from description | ChatGPT, Claude, Codex |
| Code explanation | Summarize what code does | All major LLMs |
| Bug detection | Identify potential bugs | DeepCode, CodeQL + AI |
| Code review | Suggest improvements | CodeRabbit, Copilot Review |
| Test generation | Write unit tests | Copilot, Diffblue |
| Refactoring | Improve code structure | LLM-assisted IDEs |
| Documentation | Generate docstrings, READMEs | Mintlify, LLM tools |
| Translation | Convert between languages | GPT-4, specialized models |

---

## Code-Focused Language Models

### Model Evolution

| Model | Year | Developer | Size | Training data |
|-------|------|-----------|------|---------------|
| Codex | 2021 | OpenAI | 12B | GitHub (54M repos) |
| AlphaCode | 2022 | DeepMind | 41B | GitHub + competitive programming |
| CodeGen | 2022 | Salesforce | 16B | Multi-turn code generation |
| StarCoder | 2023 | BigCode | 15B | The Stack (80+ languages) |
| Code Llama | 2023 | Meta | 7-70B | LLaMA 2 + code fine-tuning |
| DeepSeek-Coder | 2024 | DeepSeek | 1.3-33B | 2T code + NL tokens |
| StarCoder2 | 2024 | BigCode | 3-15B | The Stack v2 (67TB) |
| Codestral | 2024 | Mistral | 22B | 80+ languages |
| Qwen2.5-Coder | 2024 | Alibaba | 1.5-32B | 5.5T code tokens |
| Claude (code) | 2024+ | Anthropic | — | Strong at complex reasoning + code |

### Architecture Choices for Code

| Design choice | Approach | Benefit |
|---------------|----------|---------|
| Fill-in-the-Middle (FIM) | Train to predict middle given prefix + suffix | Better completion (IDE context) |
| Long context | 16K-128K token windows | Whole-file and multi-file understanding |
| Repository-level training | Include cross-file dependencies | Better project understanding |
| Infilling objective | SPM (suffix-prefix-middle) training | Natural IDE completion |
| Multi-language | Train on 80+ languages simultaneously | Cross-language transfer |
| Instruction tuning | Fine-tune on code QA and instructions | Follow natural language requests |

### Fill-in-the-Middle (FIM) Training

```
Original code:
    def add(a, b):
        return a + b

FIM transformation (for training):
    <PRE> def add(a, b):\n    <SUF> \n <MID> return a + b

At inference (IDE completion):
    Cursor is between prefix and suffix
    Model generates the middle portion
    → More contextual completions than left-to-right only
```

---

## Code Representation

### How Models See Code

| Representation | Method | Used for |
|---------------|--------|----------|
| Token sequence | BPE/subword tokenization | LLMs (GPT, StarCoder) |
| Abstract Syntax Tree (AST) | Parser-generated tree structure | Static analysis, tree-based models |
| Control Flow Graph (CFG) | Basic blocks + edges (branch/jump) | Program analysis, bug detection |
| Data Flow Graph (DFG) | Variable definition-use chains | CodeBERT, GraphCodeBERT |
| Execution trace | Runtime values at each step | Dynamic analysis, debugging |
| Intermediate representation | Compiler IR (LLVM, bytecode) | Optimization, binary analysis |

### Code-Specific Tokenization Challenges

```
Standard BPE struggles with:
    - Indentation (significant in Python)
    - Variable names (split awkwardly: camelCase → "cam", "el", "Case")
    - Numbers (123456 → "123", "456" — loses numerical meaning)
    - Whitespace patterns

Solutions:
    - Indent/dedent tokens (treat indentation as special tokens)
    - Byte-level BPE (handles any character)
    - Larger vocabulary for code (32K → 50K+)
    - Specialized tokenizers that respect code structure
```

---

## Code Generation

### Evaluation Benchmarks

| Benchmark | Task | Metric | Difficulty |
|-----------|------|--------|-----------|
| HumanEval | Generate Python function from docstring (164 problems) | pass@k | Medium |
| MBPP | Mostly Basic Python Programs (974) | pass@k | Easy-Medium |
| HumanEval+ | HumanEval with more test cases (catching false positives) | pass@k | Medium |
| APPS | 10K coding problems (introductory → competition) | pass@k | Easy-Hard |
| CodeContests | Competitive programming problems | pass@k, n@k | Hard |
| SWE-bench | Fix real GitHub issues (2,294 tasks) | % resolved | Very Hard |
| Aider polyglot | Multi-language multi-file editing | % correct edits | Hard |
| LiveCodeBench | Contamination-free (post-training cutoff) | pass@k | Medium-Hard |
| BigCodeBench | Complex function-level generation | pass@k | Hard |

### pass@k Metric

```
Generate k code samples per problem
pass@k = probability that at least one of k samples passes all tests

Unbiased estimator:
    pass@k = 1 - C(n-c, k) / C(n, k)
    
where:
    n = total samples generated
    c = number of correct samples
    C = binomial coefficient

Common reporting:
    pass@1:  single attempt (hardest, most practical)
    pass@10: best of 10 attempts (shows model potential)
```

### State of the Art (2026)

| Model | HumanEval pass@1 | SWE-bench Verified |
|-------|-------------------|-------------------|
| GPT-4o | 90.2% | 33.2% |
| Claude 3.5 Sonnet | 92.0% | 49.0% |
| Claude 4 | 93%+ | 55%+ |
| DeepSeek-Coder-V2 | 90.2% | — |
| o1-preview | 92.4% | — |
| Qwen2.5-Coder-32B | 92.7% | — |

---

## Code Understanding

### Tasks

| Task | Input → Output | Application |
|------|---------------|-------------|
| Code summarization | Code → natural language | Documentation generation |
| Code search | NL query → relevant code | Finding examples, reuse |
| Clone detection | Code pair → same/different | Plagiarism, refactoring |
| Vulnerability detection | Code → vulnerability type | Security scanning |
| Type inference | Code → type annotations | TypeScript migration |
| Code complexity | Code → metrics/concerns | Code review prioritization |

### Code Search (Retrieval)

```
Architecture (bi-encoder):
    Code snippet → Code encoder → code embedding (768-d)
    NL query    → Query encoder → query embedding (768-d)
    
    Score = cosine_similarity(code_embedding, query_embedding)
    
    Return top-K code snippets by score

Models: CodeBERT, UniXcoder, CodeSage, Jina Code Embeddings
Index: FAISS, Qdrant, or any vector DB
```

---

## AI-Assisted Software Engineering

### Code Completion (IDE Integration)

```
Developer types:
    def calculate_shipping(weight, destination):
        |  ← cursor here

Model sees:
    - Current file context (prefix + suffix)
    - Open files in workspace
    - Language/framework signals
    - Comment/docstring hints

Generates:
    base_rate = 5.99
    rate_per_kg = 2.50 if destination == "domestic" else 7.50
    return base_rate + (weight * rate_per_kg)
```

### Multi-File / Repository Context

| Approach | What's included | Model |
|----------|----------------|-------|
| Single-file | Current file only | Basic completion |
| Open tabs | All open editor files | Copilot, Cursor |
| LSP-aware | Imports, definitions, type info | Cursor, Sourcegraph Cody |
| RAG over codebase | Retrieved relevant snippets | Cursor, Continue |
| Full repo | Entire repository indexed | Codegen agents, SWE-bench solvers |

### Agentic Code Generation

```
SWE-Agent / OpenHands architecture:

User issue: "Fix bug: login fails when password contains special chars"
    │
    ▼
Agent loop:
    1. UNDERSTAND: Read issue, explore codebase (find relevant files)
    2. LOCATE: Search for authentication code, find bug location
    3. PLAN: Determine fix approach
    4. EDIT: Make code changes
    5. TEST: Run existing tests + write new test
    6. VERIFY: Check fix resolves issue without breaking others
    7. SUBMIT: Create patch/PR

Tools available to agent:
    - File navigation (find, grep, open)
    - Code editing (insert, replace, delete lines)
    - Terminal (run tests, build, git)
    - LSP (go to definition, find references)
```

---

## Program Repair & Bug Fixing

### Automated Program Repair (APR)

| Approach | Method | Example |
|----------|--------|---------|
| Template-based | Predefined fix patterns (e.g., add null check) | PAR, TBar |
| Search-based | Generate candidate patches, validate with tests | GenProg |
| Learning-based | Train model on bug-fix pairs | SequenceR, CURE |
| LLM-based | Prompt LLM with buggy code + error message | ChatGPT, Copilot |
| Agent-based | Multi-step reasoning with tools | SWE-Agent, Aider |

### Debugging with AI

```
Error: TypeError: cannot unpack non-sequence NoneType
File: processor.py, line 42
Code: name, age = get_user_data(user_id)

AI diagnosis:
    1. get_user_data() returns None when user not found
    2. Attempting to unpack None into (name, age) fails
    3. Fix: add None check before unpacking
    
    result = get_user_data(user_id)
    if result is None:
        raise ValueError(f"User {user_id} not found")
    name, age = result
```

---

## Code Security

### Vulnerability Detection

| Vulnerability | CWE | AI detection approach |
|--------------|-----|----------------------|
| SQL injection | CWE-89 | Detect string concatenation in queries |
| XSS (Cross-site scripting) | CWE-79 | Track untrusted input to HTML output |
| Buffer overflow | CWE-120 | Bounds checking analysis |
| Path traversal | CWE-22 | Detect unsanitized file paths |
| Hardcoded secrets | CWE-798 | Pattern + entropy analysis |
| Insecure deserialization | CWE-502 | Track untrusted data to deserialize calls |

### AI-Powered Security Tools

| Tool | Approach |
|------|----------|
| CodeQL (GitHub) | Semantic code analysis + query language |
| Semgrep | Pattern matching + taint analysis |
| Snyk Code | ML-based vulnerability detection |
| SonarQube AI | Rule-based + ML for code smells |
| Amazon CodeGuru | ML-based code review (AWS) |

---

## Code Translation

### Language Migration

```
Source (Python):
    def fibonacci(n):
        if n <= 1:
            return n
        return fibonacci(n-1) + fibonacci(n-2)

Target (Rust):
    fn fibonacci(n: u64) -> u64 {
        if n <= 1 {
            return n;
        }
        fibonacci(n - 1) + fibonacci(n - 2)
    }
```

### Challenges

| Challenge | Why it's hard | Example |
|-----------|-------------|---------|
| Type system differences | Python dynamic vs Rust strict ownership | Lifetime annotations |
| Library mapping | Different standard libraries | requests → reqwest |
| Idiom translation | Same logic, different patterns | List comprehension → iterators |
| Memory model | GC vs manual vs ownership | Python → C++ |
| Concurrency model | Different primitives | asyncio → tokio |
| Error handling | Exceptions vs Result types | try/except → match |

---

## Training Data & Ethics

### Data Sources

| Source | Size | License consideration |
|--------|------|---------------------|
| GitHub public repos | Hundreds of TB | Various open-source licenses |
| The Stack (BigCode) | 6TB (350+ languages) | Opt-out available, permissive focus |
| Stack Overflow | Q&A pairs | CC BY-SA |
| Documentation | Official docs, tutorials | Various |
| Competitive programming | Codeforces, LeetCode | Permission varies |
| Books/courses | Programming textbooks | Copyright protected |

### Concerns

| Issue | Description | Mitigation |
|-------|-------------|-----------|
| License compliance | Generated code may match copyrighted training data | License detection, attribution |
| Code quality | Model learns from bad code too | Filter training data quality |
| Security | May generate vulnerable patterns | Security-aware fine-tuning, scanning |
| Memorization | Verbatim reproduction of training code | Deduplication, output filtering |
| Dependency risk | Suggest outdated/vulnerable packages | Version-aware training, real-time checks |

---

## Evaluation Beyond pass@k

### Real-World Metrics

| Metric | What it measures | How |
|--------|-----------------|-----|
| Acceptance rate | % of suggestions accepted by developer | IDE telemetry |
| Keystroke savings | % fewer characters typed | Compare with/without AI |
| Task completion time | Time to finish coding task | Controlled experiments |
| Bug introduction rate | New bugs from AI-generated code | Post-merge defect tracking |
| Code quality | Maintainability, readability | Linter scores, code review |
| Developer satisfaction | Perceived helpfulness | Survey (Likert scale) |

### Reported Impact (Industry)

```
GitHub Copilot (2023 study):
    - 55% faster task completion
    - 46% of code written by AI
    - Highest impact: boilerplate, tests, documentation

Cursor (2024):
    - Developers report 2-3× productivity on routine coding
    - Most effective for: code in familiar patterns
    - Least effective for: novel algorithms, complex architecture decisions
```

---

## Future Directions

| Direction | Current state | Next frontier |
|-----------|--------------|---------------|
| Whole-repo understanding | RAG over repo, limited context | Full dependency graph reasoning |
| Specification → code | NL descriptions → functions | Formal specs → verified programs |
| Self-debugging agents | LLM + test runner loops | Autonomous issue resolution |
| Formal verification | Research prototypes | AI-assisted proof generation (Lean, Coq) |
| Code optimization | Basic refactoring suggestions | Performance-aware code transformation |
| Multi-agent development | Single-agent coding | Team of specialized agents (architect, dev, tester) |
| Personalized models | Generic code style | Adapt to codebase conventions and developer preferences |
