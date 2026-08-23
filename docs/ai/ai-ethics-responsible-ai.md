# AI Ethics & Responsible AI

*Written: 2026-08-23*

## The Responsible AI Framework

```
                    Responsible AI
                         │
    ┌────────────┬───────┼───────┬────────────┐
    │            │       │       │            │
Fairness    Transparency  Safety  Privacy   Accountability
    │            │       │       │            │
No bias      Explain-   Robust  Data        Human
No discrim.  ability    Aligned  protection  oversight
```

### Core Principles

| Principle | Definition | Operationalization |
|-----------|-----------|-------------------|
| Fairness | Equal treatment regardless of protected attributes | Bias testing, demographic parity, equalized odds |
| Transparency | Understandable decisions and limitations | Explainability tools, model cards, documentation |
| Safety | Prevent harm, operate within bounds | Red-teaming, guardrails, alignment, testing |
| Privacy | Protect individual data and rights | Differential privacy, federated learning, data minimization |
| Accountability | Clear ownership and redress mechanisms | Audit trails, human oversight, incident response |
| Beneficence | AI should benefit humanity | Impact assessments, stakeholder engagement |

---

## Bias in AI Systems

### Where Bias Enters

```
Data Collection → Feature Engineering → Model Training → Deployment → Feedback Loop
      │                  │                    │              │              │
Historical bias    Proxy variables      Algorithmic        Selection     Reinforcement
Sampling bias      Encoding choices     amplification      bias          of existing
Labeling bias                           bias                             bias
```

### Types of Bias

| Type | Description | Example |
|------|-------------|---------|
| Historical bias | Data reflects past societal inequalities | Hiring data favoring men in tech roles |
| Representation bias | Underrepresentation of groups in training data | Face recognition failing on dark skin |
| Measurement bias | Features measured differently across groups | Credit scores using ZIP code (proxy for race) |
| Aggregation bias | One model for diverse populations | Single disease model across ethnicities |
| Evaluation bias | Benchmarks not representative | ImageNet mostly Western-centric images |
| Deployment bias | Model used in context it wasn't designed for | Recidivism model used for sentencing |
| Feedback loop bias | Biased outputs become future training data | Predictive policing → more arrests → more data |

### Protected Attributes

| Attribute | Examples | Legal frameworks |
|-----------|---------|-----------------|
| Race/Ethnicity | Skin color, national origin | Civil Rights Act, ECHR |
| Gender | Sex, gender identity | Equal Pay Act, GDPR |
| Age | Date of birth, age group | Age Discrimination Act |
| Disability | Physical, mental, cognitive | ADA, Equality Act |
| Religion | Faith, beliefs, practices | First Amendment, ECHR |
| Sexual orientation | LGBTQ+ status | Employment Equality Directive |
| Socioeconomic status | Income, education, ZIP code | Varies by jurisdiction |

---

## Fairness Metrics

### Group Fairness

| Metric | Definition | Formula |
|--------|-----------|---------|
| Demographic Parity | Equal positive rates across groups | P(Ŷ=1\|A=0) = P(Ŷ=1\|A=1) |
| Equalized Odds | Equal TPR and FPR across groups | P(Ŷ=1\|Y=1,A=0) = P(Ŷ=1\|Y=1,A=1) |
| Equal Opportunity | Equal TPR across groups | Same as above but only TPR |
| Predictive Parity | Equal precision across groups | P(Y=1\|Ŷ=1,A=0) = P(Y=1\|Ŷ=1,A=1) |
| Calibration | Equal probability meaning across groups | P(Y=1\|Ŷ=p,A=0) = P(Y=1\|Ŷ=p,A=1) = p |
| Treatment Equality | Equal FN/FP ratio across groups | FN_A0/FP_A0 = FN_A1/FP_A1 |

### Impossibility Theorem

**Key insight:** You cannot simultaneously satisfy all fairness criteria (except in trivial cases).

```
Calibration + Equal FPR + Equal FNR → impossible (unless base rates are equal)

Example:
    Group A: 30% recidivism rate
    Group B: 50% recidivism rate
    
    A well-calibrated model MUST have different thresholds per group
    → violates demographic parity
    → you must choose which fairness criterion to prioritize
```

**Implication:** Fairness is a design choice that depends on context, not a single metric.

### Individual Fairness

```
Similar individuals should receive similar predictions:

d_output(f(x₁), f(x₂)) ≤ L · d_input(x₁, x₂)

Challenge: defining "similar" (what metric? which features?)
```

---

## Bias Mitigation Strategies

### Pre-processing (fix the data)

| Method | How | Trade-off |
|--------|-----|-----------|
| Resampling | Over/under-sample to balance groups | May lose data or create duplicates |
| Reweighting | Assign weights to correct for imbalance | Changes effective distribution |
| Data augmentation | Generate synthetic samples for underrepresented groups | Quality of synthetic data |
| Feature removal | Drop protected attributes and proxies | Proxies are hard to identify completely |
| Fair representation | Learn embeddings that remove protected info | May reduce predictive power |

### In-processing (fix the algorithm)

| Method | How | Trade-off |
|--------|-----|-----------|
| Adversarial debiasing | Adversary tries to predict protected attribute from representations | Accuracy vs fairness |
| Constrained optimization | Add fairness constraint to loss function | Explicit fairness-accuracy trade-off |
| Fairness regularization | Penalize unfair predictions in loss | Tunable λ parameter |
| Causal methods | Model causal structure, block discriminatory paths | Requires causal graph |

### Post-processing (fix the output)

| Method | How | Trade-off |
|--------|-----|-----------|
| Threshold adjustment | Different decision thresholds per group | Requires group labels at inference |
| Calibration per group | Equalize prediction meaning across groups | May not equalize rates |
| Reject option | Abstain near decision boundary for minority groups | Reduces coverage |

---

## Explainability & Interpretability

### Taxonomy

| Type | When | Examples |
|------|------|---------|
| Intrinsic | Model is inherently interpretable | Linear regression, decision trees, rule lists |
| Post-hoc | Explanation generated after prediction | SHAP, LIME, Grad-CAM, attention |
| Local | Explain one prediction | "Why was THIS loan denied?" |
| Global | Explain overall model behavior | "What features matter most overall?" |

### Key Methods

| Method | Type | How it works | Output |
|--------|------|-------------|--------|
| SHAP | Local + Global | Game-theoretic feature attribution (Shapley values) | Per-feature contribution to prediction |
| LIME | Local | Fit simple model on perturbed neighbors | Linear weights for this prediction |
| Grad-CAM | Local (vision) | Gradient of class w.r.t. feature maps | Heatmap showing important regions |
| Attention visualization | Local | Display attention weights | Which tokens/patches were attended to |
| Feature importance | Global | Permutation or tree-based importance | Ranked feature list |
| Counterfactual explanations | Local | "What minimal change would flip the decision?" | Actionable change suggestion |
| Concept activation (TCAV) | Global | Test if model uses human concepts | "Does this model use 'stripes' for 'zebra'?" |

### SHAP Values

```
For prediction f(x):
    f(x) = base_value + Σ SHAP_values

    base_value = expected model output (mean prediction)
    SHAP_i = contribution of feature i to this specific prediction

Properties:
    - Additive: all SHAP values sum to (prediction - base_value)
    - Consistent: increasing a feature's contribution never decreases its SHAP value
    - Local accuracy: explanation matches the model's actual prediction
    - Based on Shapley values from cooperative game theory
```

### Explanation Requirements by Domain

| Domain | Required explanation | Regulation |
|--------|-------------------|-----------|
| Healthcare | Why this diagnosis/treatment recommended | FDA, MDR |
| Finance (lending) | Reason for credit denial | ECOA, GDPR Art. 22 |
| Insurance | Factors in pricing/denial | State insurance regulations |
| Criminal justice | Basis for risk assessment | Due process, COMPAS controversy |
| Hiring | Non-discriminatory basis | Title VII, EEOC |
| Autonomous vehicles | Accident liability and decision basis | Emerging regulation |

---

## Privacy in AI

### Threat Model

| Attack | Goal | Method |
|--------|------|--------|
| Membership inference | Was this data point in training set? | Query model, compare confidence |
| Model inversion | Reconstruct training data from model | Optimize input to maximize output confidence |
| Data extraction | Extract verbatim training data | Prompt LLM with prefixes from training data |
| Attribute inference | Infer sensitive attributes | Use model predictions to deduce private info |
| Model stealing | Replicate model via API queries | Query with many inputs, train surrogate |

### Privacy-Preserving Techniques

| Technique | How | Trade-off |
|-----------|-----|-----------|
| Differential Privacy (DP) | Add calibrated noise during training (DP-SGD) | Accuracy loss (privacy budget ε) |
| Federated Learning | Train on distributed data, share only gradients | Communication cost, partial privacy |
| Secure Multi-Party Computation | Multiple parties compute jointly without revealing data | Computational overhead (10-1000×) |
| Homomorphic Encryption | Compute on encrypted data | Very slow (improving) |
| Data anonymization | Remove or generalize identifying info | Utility loss, re-identification risk |
| Synthetic data generation | Create artificial data preserving statistics | May not capture all patterns |

### Differential Privacy

```
A mechanism M is (ε, δ)-differentially private if:

P(M(D) ∈ S) ≤ e^ε · P(M(D') ∈ S) + δ

Where D and D' differ in one individual's data.

ε (privacy budget):
    ε → 0: strong privacy (lots of noise, less utility)
    ε → ∞: no privacy (no noise, full utility)
    Typical: ε = 1-10 (practical range)

DP-SGD (Differentially Private Stochastic Gradient Descent):
    1. Clip individual gradients: ‖g_i‖ ≤ C
    2. Add Gaussian noise: g̃ = (1/B) Σ clip(g_i) + N(0, σ²C²I)
    3. Track cumulative privacy loss (privacy accountant)
```

---

## AI Regulation Landscape

### Key Regulations

| Regulation | Jurisdiction | Scope | Status |
|-----------|-------------|-------|--------|
| EU AI Act | European Union | Risk-based AI regulation | In force (2024), fully applicable 2026 |
| GDPR Art. 22 | European Union | Right to explanation for automated decisions | In force |
| Executive Order 14110 | United States | AI safety and security standards | Signed Oct 2023 |
| NIST AI RMF | United States | Risk management framework (voluntary) | Published 2023 |
| China AI Regulations | China | Algorithmic recommendation, deepfakes, GenAI | Multiple regulations in force |
| Canada AIDA | Canada | Artificial Intelligence and Data Act | Proposed |
| UK AI White Paper | United Kingdom | Pro-innovation, sector-specific | Framework stage |

### EU AI Act Risk Categories

| Risk level | Examples | Requirements |
|-----------|---------|-------------|
| Unacceptable (banned) | Social scoring, real-time biometric mass surveillance | Prohibited |
| High risk | Credit scoring, hiring, medical devices, law enforcement | Conformity assessment, auditing, documentation |
| Limited risk | Chatbots, emotion detection, deepfakes | Transparency obligations (must disclose AI) |
| Minimal risk | Spam filters, AI in games | No specific requirements |

### Compliance Requirements for High-Risk AI

```
1. Risk management system (continuous lifecycle)
2. Data governance (quality, representativeness, bias testing)
3. Technical documentation (design, purpose, performance)
4. Record-keeping (logging for traceability)
5. Transparency (instructions for deployers)
6. Human oversight (ability to override, understand, intervene)
7. Accuracy, robustness, cybersecurity
8. Conformity assessment (before market placement)
9. Post-market monitoring (ongoing surveillance)
```

---

## AI Safety & Alignment

### The Alignment Problem

```
What we want: AI that does what we intend and benefits humanity
What's hard:
    - Specifying human values formally is near-impossible
    - Reward hacking (Goodhart's law: any metric becomes gamed)
    - Goal misgeneralization (right behavior in training, wrong in deployment)
    - Deceptive alignment (appears aligned during evaluation, not during deployment)
    - Mesa-optimization (model develops internal objectives misaligned with outer goal)
```

### Alignment Approaches

| Approach | Method | Organization |
|----------|--------|-------------|
| RLHF | Human feedback → reward model → PPO | OpenAI, Anthropic |
| Constitutional AI | Self-critique against principles | Anthropic |
| Scalable oversight | AI assists humans in evaluating AI | OpenAI (weak-to-strong) |
| Mechanistic interpretability | Understand circuits inside neural networks | Anthropic, EleutherAI |
| Debate | AI systems argue, human judges | OpenAI |
| Recursive reward modeling | AI helps humans provide better feedback | DeepMind |
| Process-based supervision | Reward reasoning steps, not just outcomes | OpenAI (process reward model) |
| Cooperative AI | Design AI for cooperation, not just competition | DeepMind, CHAI |

### Existential Risk Considerations

| Risk | Mechanism | Mitigation |
|------|-----------|-----------|
| Power-seeking behavior | Instrumental convergence (AI seeks power as sub-goal) | Corrigibility, shutdown switches |
| Recursive self-improvement | AI improves itself faster than humans can control | Compute governance, capability limits |
| Goal drift | Optimization pressure warps aligned goals | Ongoing alignment verification |
| Coordination failure | Race dynamics prevent safety investment | International agreements, safety standards |
| Weaponization | State or non-state actors deploy harmful AI | Export controls, monitoring |

---

## Responsible AI in Practice

### Model Cards

```
Model Card Template:
├── Model Details (name, version, type, developer)
├── Intended Use (primary use, out-of-scope uses)
├── Factors (relevant demographics, instrumentation)
├── Metrics (performance measures chosen, why)
├── Evaluation Data (dataset, motivation, preprocessing)
├── Training Data (same structure as evaluation)
├── Quantitative Analyses (disaggregated across groups)
├── Ethical Considerations (identified risks)
└── Caveats and Recommendations
```

### AI Impact Assessment

| Phase | Activities |
|-------|-----------|
| Scoping | Identify stakeholders, potential harms, affected populations |
| Data assessment | Audit training data for bias, representativeness, consent |
| Model assessment | Test fairness metrics, robustness, failure modes |
| Deployment assessment | Consider context, power dynamics, feedback loops |
| Monitoring plan | Define metrics, alerting, review cadence |
| Redress mechanism | How can affected individuals appeal or report issues? |

### Red-Teaming

| Category | Goal | Methods |
|----------|------|---------|
| Safety | Find harmful outputs | Adversarial prompts, jailbreaks, edge cases |
| Bias | Identify discriminatory behavior | Test across demographics, stereotyped scenarios |
| Security | Find vulnerabilities | Prompt injection, data extraction, model manipulation |
| Factuality | Find hallucinations | Domain expert evaluation, fact-checking |
| Robustness | Find failure modes | Typos, adversarial inputs, distribution shift |

---

## Ethical Frameworks for AI Decision-Making

| Framework | Principle | AI application |
|-----------|-----------|---------------|
| Utilitarianism | Maximize overall well-being | Optimize for aggregate benefit, but beware sacrificing minorities |
| Deontology (Kantian) | Act according to universal rules | Never use people merely as means; respect autonomy |
| Virtue ethics | Develop good character/habits | Build AI that exhibits fairness, honesty, prudence |
| Justice (Rawls) | Decisions should benefit the least advantaged | Ensure AI doesn't widen inequality |
| Care ethics | Prioritize relationships and context | Consider power dynamics, not just abstract rules |
| Ubuntu | "I am because we are" | Community-centered AI, collective benefit |

### Practical Decision Framework

```
When facing an ethical dilemma in AI development:

1. Identify stakeholders (who is affected? who benefits? who bears risk?)
2. Map harms (what could go wrong? for whom? how severe? how reversible?)
3. Check fairness (are outcomes equitable across groups?)
4. Assess transparency (can decisions be explained? to whom?)
5. Evaluate consent (did people agree to this use of their data/identity?)
6. Consider alternatives (is AI the right tool? less risky approaches?)
7. Plan monitoring (how will we know if something goes wrong?)
8. Establish accountability (who is responsible? what's the redress?)
```

---

## Tools & Resources

### Fairness & Bias

| Tool | Developer | Purpose |
|------|-----------|---------|
| Fairlearn | Microsoft | Fairness assessment + mitigation algorithms |
| AI Fairness 360 (AIF360) | IBM | Comprehensive bias metrics + mitigation |
| What-If Tool | Google | Interactive fairness exploration (TensorBoard) |
| Aequitas | U. Chicago | Bias and fairness audit toolkit |

### Explainability

| Tool | Purpose |
|------|---------|
| SHAP | Shapley-value-based explanations |
| LIME | Local interpretable model-agnostic explanations |
| Captum | PyTorch model interpretability |
| InterpretML | Unified framework for interpretability (Microsoft) |
| ELI5 | Debug classifiers, explain predictions |

### Privacy

| Tool | Purpose |
|------|---------|
| Opacus (Meta) | DP-SGD for PyTorch |
| TensorFlow Privacy | DP training for TensorFlow |
| PySyft | Privacy-preserving ML (federated, encrypted) |
| Flower | Federated learning framework |
| SmartNoise | Differential privacy library (Microsoft/OpenDP) |

### Safety & Monitoring

| Tool | Purpose |
|------|---------|
| Garak | LLM vulnerability scanner |
| Inspect (UK AISI) | LLM evaluation framework |
| LangSmith | LLM application monitoring + debugging |
| Evidently | ML monitoring + data drift |
| NannyML | Performance estimation without ground truth |
