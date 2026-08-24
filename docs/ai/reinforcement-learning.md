---
tags:
  - advanced
  - systems
---

# Reinforcement Learning

*Written: 2026-08-23*

## Core Framework

### Agent-Environment Interaction

```
┌───────────┐    action a_t    ┌─────────────┐
│           │ ───────────────→ │             │
│   Agent   │                  │ Environment │
│           │ ←─────────────── │             │
└───────────┘  state s_{t+1}   └─────────────┘
               reward r_{t+1}
```

At each time step t:
1. Agent observes state s_t
2. Agent selects action a_t according to policy π
3. Environment transitions to s_{t+1} and emits reward r_{t+1}
4. Agent updates its policy to maximize cumulative reward

### Markov Decision Process (MDP)

**Formally defined as tuple (S, A, P, R, γ):**

| Symbol | Meaning |
|--------|---------|
| S | State space |
| A | Action space |
| P(s'|s,a) | Transition probability |
| R(s,a,s') | Reward function |
| γ ∈ [0,1] | Discount factor |

**Markov property:** Future depends only on current state, not history.

$$P(s_{t+1} | s_t, a_t, s_{t-1}, a_{t-1}, ...) = P(s_{t+1} | s_t, a_t)$$

---

## Key Concepts

### Return (Cumulative Discounted Reward)

$$G_t = r_{t+1} + \gamma r_{t+2} + \gamma^2 r_{t+3} + ... = \sum_{k=0}^{\infty} \gamma^k r_{t+k+1}$$

- γ = 0: myopic (only immediate reward matters)
- γ = 1: far-sighted (all future rewards equally important)
- γ ∈ (0.9, 0.99): common range for most tasks

### Value Functions

**State-value function (how good is this state?):**

$$V^\pi(s) = \mathbb{E}_\pi [G_t | s_t = s] = \mathbb{E}_\pi \left[\sum_{k=0}^{\infty} \gamma^k r_{t+k+1} \bigg| s_t = s\right]$$

**Action-value function (how good is this action from this state?):**

$$Q^\pi(s, a) = \mathbb{E}_\pi [G_t | s_t = s, a_t = a]$$

**Relationship:**

$$V^\pi(s) = \sum_a \pi(a|s) \cdot Q^\pi(s, a)$$

### Bellman Equations

**Bellman expectation equation (for policy π):**

$$V^\pi(s) = \sum_a \pi(a|s) \sum_{s'} P(s'|s,a) [R(s,a,s') + \gamma V^\pi(s')]$$

**Bellman optimality equation (for optimal policy π*):**

$$V^*(s) = \max_a \sum_{s'} P(s'|s,a) [R(s,a,s') + \gamma V^*(s')]$$

$$Q^*(s,a) = \sum_{s'} P(s'|s,a) [R(s,a,s') + \gamma \max_{a'} Q^*(s',a')]$$

---

## Taxonomy of RL Methods

```
                    RL Algorithms
                         │
            ┌────────────┼────────────┐
        Model-Free                Model-Based
            │                         │
    ┌───────┼───────┐          ┌──────┼──────┐
Value-Based  Policy   Actor-    Learn    Given
             Gradient  Critic    Model    Model
    │           │       │         │        │
Q-Learning  REINFORCE  A2C     Dreamer   AlphaGo
DQN         PPO        SAC     World     MCTS
             TRPO      TD3     Models
```

| Category | Learns | Example | Characteristic |
|----------|--------|---------|----------------|
| Value-based | Q(s,a) or V(s) | DQN, SARSA | Derive policy from values |
| Policy-based | π(a|s) directly | REINFORCE, PPO | Can handle continuous actions |
| Actor-Critic | Both value + policy | A2C, SAC, TD3 | Reduced variance |
| Model-based | Transition model P(s'|s,a) | Dreamer, MuZero | Sample efficient, planning |

---

## Value-Based Methods

### Q-Learning (Tabular)

**Off-policy TD control — learns optimal Q regardless of behavior policy:**

$$Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha \left[ r_{t+1} + \gamma \max_{a'} Q(s_{t+1}, a') - Q(s_t, a_t) \right]$$

```
function q_learning(env, episodes, α, γ, ε):
    Q = zeros(|S|, |A|)
    for episode in range(episodes):
        s = env.reset()
        while not done:
            a = ε-greedy(Q, s, ε)              # explore vs exploit
            s', r, done = env.step(a)
            Q[s, a] += α * (r + γ * max(Q[s']) - Q[s, a])
            s = s'
    return Q
```

### SARSA (On-Policy)

$$Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha \left[ r_{t+1} + \gamma Q(s_{t+1}, a_{t+1}) - Q(s_t, a_t) \right]$$

**Key difference from Q-Learning:**
- Q-Learning uses max_a' Q(s', a') — optimistic about future (off-policy)
- SARSA uses Q(s', a') where a' is actually taken — conservative (on-policy)
- SARSA is safer for stochastic environments; Q-Learning converges to optimal faster

### Deep Q-Network (DQN)

**Key innovations that made Q-learning work with neural networks:**

| Innovation | Problem solved |
|-----------|---------------|
| Experience replay | Break correlation between consecutive samples |
| Target network | Stabilize learning (update target Q every N steps) |
| Reward clipping | Normalize reward scale across games |
| Frame stacking | Provide velocity/motion information |

**Loss function:**

$$L(\theta) = \mathbb{E}_{(s,a,r,s') \sim \mathcal{D}} \left[ \left( r + \gamma \max_{a'} Q(s', a'; \theta^-) - Q(s, a; \theta) \right)^2 \right]$$

where θ⁻ = target network parameters (slow-moving copy).

### DQN Extensions

| Extension | Innovation | Improvement |
|-----------|-----------|-------------|
| Double DQN | Decouple action selection from evaluation | Reduce overestimation |
| Dueling DQN | Separate V(s) and A(s,a) streams | Better state evaluation |
| Prioritized Replay | Sample important transitions more often | Faster learning |
| Noisy Nets | Learnable noise in weights | Better exploration than ε-greedy |
| Rainbow | Combine all above + distributional + n-step | SOTA on Atari |

---

## Policy Gradient Methods

### REINFORCE (Monte Carlo Policy Gradient)

**Policy gradient theorem:**

$$\nabla_\theta J(\theta) = \mathbb{E}_\pi \left[ \nabla_\theta \log \pi_\theta(a|s) \cdot G_t \right]$$

```
function reinforce(env, episodes, α):
    π = policy_network(θ)
    for episode in range(episodes):
        trajectory = rollout(env, π)              # collect full episode
        for t in range(len(trajectory)):
            G_t = discounted_return(trajectory, t)
            θ += α * ∇_θ log π(a_t|s_t) * G_t    # gradient ascent
    return π
```

**Problem:** High variance — full episode returns are noisy.

**Solution — add baseline (reduce variance without adding bias):**

$$\nabla_\theta J(\theta) = \mathbb{E}_\pi \left[ \nabla_\theta \log \pi_\theta(a|s) \cdot (G_t - b(s_t)) \right]$$

Common baseline: V(s) learned by a separate value network → **Actor-Critic**.

### Proximal Policy Optimization (PPO)

**The dominant RL algorithm (2017-present) — used for RLHF, robotics, games.**

**Clipped surrogate objective:**

$$L^{CLIP}(\theta) = \mathbb{E}_t \left[ \min \left( r_t(\theta) \hat{A}_t, \; \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon) \hat{A}_t \right) \right]$$

where:
- r_t(θ) = π_θ(a_t|s_t) / π_θ_old(a_t|s_t) — probability ratio
- Â_t = advantage estimate (GAE)
- ε = 0.2 (typical clipping range)

**Why PPO works:**
- Clipping prevents too-large policy updates (catastrophic forgetting)
- Simple to implement compared to TRPO (which uses KL constraint)
- Works with both discrete and continuous actions
- Parallelizable — collect rollouts from many environments

**Generalized Advantage Estimation (GAE):**

$$\hat{A}_t^{GAE(\gamma, \lambda)} = \sum_{l=0}^{\infty} (\gamma \lambda)^l \delta_{t+l}$$

where δ_t = r_t + γV(s_{t+1}) - V(s_t) is the TD error.

- λ = 0: one-step TD (low variance, high bias)
- λ = 1: Monte Carlo (high variance, low bias)
- λ ∈ (0.9, 0.99): practical balance

### Trust Region Policy Optimization (TRPO)

**Constrained optimization:**

$$\max_\theta \; \mathbb{E}_t \left[ r_t(\theta) \hat{A}_t \right] \quad \text{s.t.} \quad \mathbb{E}_t [KL[\pi_{\theta_{old}} || \pi_\theta]] \leq \delta$$

- Guarantees monotonic policy improvement
- Uses conjugate gradient + line search
- More principled than PPO but harder to implement and tune

---

## Actor-Critic Methods

### Advantage Actor-Critic (A2C)

```
Two networks:
  Actor:  π_θ(a|s)     — policy (what to do)
  Critic: V_φ(s)       — value (how good is this state)

Update:
  Advantage: A_t = r_t + γV_φ(s_{t+1}) - V_φ(s_t)
  Actor loss:  -log π_θ(a_t|s_t) · A_t
  Critic loss: (r_t + γV_φ(s_{t+1}) - V_φ(s_t))²
```

### Soft Actor-Critic (SAC)

**Maximum entropy RL — optimize reward AND policy entropy:**

$$J(\pi) = \sum_t \mathbb{E}_\pi \left[ r_t + \alpha \mathcal{H}(\pi(\cdot|s_t)) \right]$$

**Key properties:**
- Encourages exploration (high entropy = more randomness)
- More robust to hyperparameters
- Automatic temperature α tuning
- SOTA for continuous control (robotics)

### Twin Delayed DDPG (TD3)

**Improvements over DDPG for continuous control:**

| Trick | Purpose |
|-------|---------|
| Twin critics (min of two Q) | Reduce overestimation |
| Delayed policy update | Update actor less frequently than critic |
| Target policy smoothing | Add noise to target actions (regularization) |

---

## Model-Based RL

### Concept

```
1. Collect data from environment
2. Learn transition model: s_{t+1} = f(s_t, a_t)
3. Plan using learned model (imagined rollouts)
4. Execute best plan in real environment
5. Repeat
```

### Key Methods

| Method | Model type | Planning | Domain |
|--------|-----------|----------|--------|
| Dyna-Q | Tabular model | Q-learning on simulated experience | Simple environments |
| MBPO | Neural network ensemble | Short model rollouts + SAC | Continuous control |
| Dreamer (v3) | World model (RSSM) | Imagine trajectories in latent space | Atari, robotics, Minecraft |
| MuZero | Learned dynamics + value | MCTS with learned model | Go, Chess, Atari |
| TD-MPC2 | Implicit model | Model predictive control | Continuous control |

### Trade-offs

| Aspect | Model-Free | Model-Based |
|--------|-----------|-------------|
| Sample efficiency | Low (millions of steps) | High (thousands of steps) |
| Computation per step | Low | High (planning) |
| Asymptotic performance | Better (no model error) | Limited by model accuracy |
| Applicability | Any environment | Harder for complex dynamics |

---

## Exploration Strategies

| Strategy | Method | When to use |
|----------|--------|-------------|
| ε-greedy | Random action with probability ε | Simple, DQN |
| Boltzmann (softmax) | Sample proportional to Q values | Temperature-based exploration |
| UCB (Upper Confidence Bound) | Optimism in face of uncertainty | Bandits, MCTS |
| Intrinsic motivation (curiosity) | Reward for visiting novel states | Sparse reward environments |
| Random Network Distillation (RND) | Predict random network output | Hard exploration (Montezuma) |
| Count-based | Bonus inversely proportional to visit count | Tabular or hash-based |
| Go-Explore | Archive promising states, restart from them | Very hard exploration |

---

## RLHF (Reinforcement Learning from Human Feedback)

### The Alignment Pipeline

```
Step 1: Supervised Fine-Tuning (SFT)
    Base LLM → train on human-written demonstrations → SFT model

Step 2: Reward Model Training
    SFT model generates pairs of responses
    Humans rank: response A > response B
    Train reward model R(prompt, response) → scalar score

Step 3: RL Fine-Tuning (PPO)
    Policy = SFT model
    Reward = R(prompt, response) - β · KL(π || π_SFT)
    Optimize with PPO to maximize reward while staying close to SFT model
```

**KL penalty:** Prevents reward hacking (exploiting reward model weaknesses).

### RLHF Alternatives

| Method | Approach | Advantage |
|--------|----------|-----------|
| RLHF (PPO) | Separate reward model + RL | Flexible, proven |
| DPO (Direct Preference Optimization) | Reparameterize reward into policy loss | No RL needed, simpler |
| KTO (Kahneman-Tversky Optimization) | Binary feedback (good/bad) | No paired comparisons needed |
| RLAIF | AI provides feedback instead of humans | Scalable, cheaper |
| Constitutional AI | AI self-critiques against principles | Reduced human labeling |
| GRPO (Group Relative Policy Optimization) | Group-based advantage, no critic | Simpler, DeepSeek-R1 |

### DPO Loss

$$L_{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l)} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w|x)}{\pi_{ref}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{ref}(y_l|x)} \right) \right]$$

- y_w = preferred response, y_l = dispreferred response
- π_ref = reference (SFT) model
- Directly optimizes policy without explicit reward model

---

## Multi-Agent RL (MARL)

| Setting | Agents' relationship | Example |
|---------|---------------------|---------|
| Cooperative | Shared reward | Team robotics, Overcooked |
| Competitive | Zero-sum reward | Go, Poker, StarCraft |
| Mixed | Both cooperative and competitive | Traffic, economics |

**Key challenges:**
- Non-stationarity — each agent's environment changes as others learn
- Credit assignment — who contributed to team reward?
- Communication — should agents share information?
- Scalability — exponential state/action space with more agents

---

## Landmark Results

| Year | Achievement | Algorithm | Significance |
|------|------------|-----------|-------------|
| 2013 | Atari from pixels | DQN | First deep RL success |
| 2016 | Beat Go world champion | AlphaGo (MCTS + RL) | Superhuman in complex strategy |
| 2017 | Dota 2 (OpenAI Five) | PPO (scaled) | Complex multi-agent coordination |
| 2019 | StarCraft II Grandmaster | AlphaStar | Imperfect information, real-time |
| 2019 | Rubik's Cube with robot hand | PPO + domain randomization | Sim-to-real transfer |
| 2022 | ChatGPT | RLHF (PPO) | LLM alignment breakthrough |
| 2023 | Diplomacy (Cicero) | RL + language | Negotiation and strategic deception |
| 2024 | Minecraft diamond from scratch | Dreamer-v3 | Open-world, long-horizon |
| 2025 | DeepSeek-R1 | GRPO | Reasoning via RL without SFT |

---

## Practical Considerations

### Hyperparameter Sensitivity

| Hyperparameter | Typical range | Impact |
|----------------|---------------|--------|
| Learning rate | 1e-4 to 3e-4 | Most critical — too high diverges, too low no learning |
| Discount γ | 0.95 - 0.999 | Determines planning horizon |
| GAE λ | 0.9 - 0.99 | Bias-variance trade-off in advantage estimation |
| Clip ε (PPO) | 0.1 - 0.3 | Step size constraint |
| Batch size | 2048 - 65536 | Larger = more stable, slower per update |
| Entropy bonus | 0.0 - 0.01 | Exploration encouragement |
| Target update rate | 0.005 - 0.01 | Critic stability (soft update τ) |

### Common Pitfalls

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| Reward shaping gone wrong | Agent exploits unintended shortcuts | Simplify reward, test edge cases |
| Sparse reward | Agent never discovers positive signal | Curiosity bonus, curriculum, demonstrations |
| Non-stationary environment | Policy oscillates, never converges | Self-play, population-based training |
| Reward hacking | High reward, bad behavior | Constrained optimization, KL penalty |
| Sim-to-real gap | Works in simulation, fails in reality | Domain randomization, system identification |
