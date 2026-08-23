# AI Agents & Autonomous Systems

*Written: 2026-08-23*

## What Are AI Agents?

Systems that perceive their environment, reason about it, make decisions, and take actions to achieve goals — with varying degrees of autonomy.

```
        Perception → Reasoning → Planning → Action
             ↑                                  │
             └────────── Environment ←──────────┘
                      (feedback loop)
```

### Agent vs Tool

| Aspect | Tool (e.g., calculator) | Agent (e.g., coding assistant) |
|--------|------------------------|-------------------------------|
| Initiative | Responds to explicit commands | Proactively plans and acts |
| State | Stateless | Maintains memory and context |
| Decision-making | None (deterministic function) | Decides what to do next |
| Error handling | Returns error | Retries, adapts, tries alternatives |
| Goal completion | Single step | Multi-step, iterative |
| Autonomy | None | Low to high |

### Autonomy Spectrum

```
Level 0: Chat model (answer questions, no actions)
Level 1: Tool-augmented (call APIs/tools when asked)
Level 2: Reactive agent (observe → decide → act loops)
Level 3: Planning agent (decompose goals → multi-step execution)
Level 4: Autonomous agent (self-directed, long-horizon, learns from experience)
Level 5: Multi-agent systems (coordinate with other agents)
```

---

## Agent Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────┐
│                        Agent                             │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Perception│  │ Reasoning│  │ Planning │  │ Action ││
│  │           │  │ (LLM)   │  │          │  │        ││
│  │ - Observe │  │ - Think  │  │ - Goals  │  │ - Tools││
│  │ - Parse   │  │ - Reflect│  │ - Steps  │  │ - APIs ││
│  │ - Retrieve│  │ - Judge  │  │ - Decide │  │ - Code ││
│  └──────────┘  └──────────┘  └──────────┘  └────────┘│
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                    Memory                         │  │
│  │  - Working memory (current task context)          │  │
│  │  - Short-term (conversation history)              │  │
│  │  - Long-term (knowledge base, past experiences)   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Reasoning Patterns

| Pattern | Method | Use case |
|---------|--------|----------|
| ReAct | Thought → Action → Observation (interleaved) | Simple tool-use tasks |
| Chain-of-Thought | Step-by-step reasoning before answering | Complex reasoning |
| Plan-and-Execute | Full plan upfront, then execute steps | Multi-step tasks |
| Reflexion | Act → Reflect on failure → Retry with lessons | Learning from mistakes |
| Tree of Thought | Explore multiple reasoning branches | Complex decisions |
| LATS | Monte Carlo tree search over reasoning paths | Under uncertainty |
| Self-Ask | Decompose into sub-questions, answer each | Research tasks |
| Debate | Multiple agents argue, converge on answer | Adversarial verification |

---

## LLM-Based Agents

### ReAct Pattern

```
User: "What's the population of the country where the Eiffel Tower is located?"

Agent:
    Thought: I need to find which country has the Eiffel Tower, then look up its population.
    Action: search("Eiffel Tower location")
    Observation: The Eiffel Tower is located in Paris, France.
    
    Thought: The Eiffel Tower is in France. Now I need France's population.
    Action: search("France population 2024")
    Observation: France has a population of approximately 68.4 million (2024).
    
    Thought: I have the answer.
    Answer: The population of France (where the Eiffel Tower is) is approximately 68.4 million.
```

### Plan-and-Execute

```
User: "Refactor the authentication module to use JWT tokens instead of sessions"

Planner:
    1. Read current auth module to understand session-based implementation
    2. Identify all session-related code paths
    3. Design JWT token structure and refresh flow
    4. Implement JWT generation and validation
    5. Update middleware to check JWT instead of sessions
    6. Update login/logout endpoints
    7. Write tests for new JWT flow
    8. Run tests and fix failures

Executor:
    Step 1: [reads files] → identifies auth.py, middleware.py, routes.py
    Step 2: [greps for session usage] → finds 12 locations
    Step 3: [designs schema] → access + refresh tokens, 15min/7day expiry
    ...continues executing each step...
    
Re-planner (after each step):
    - Was step successful? If not, revise plan.
    - Is new information available? Adjust remaining steps.
```

### Reflexion

```
Attempt 1:
    Agent writes code → Tests fail (3/5 pass)
    Reflection: "I forgot to handle the edge case where input is empty.
                 Also, the return type should be Optional[int], not int."

Attempt 2:
    Agent rewrites with lessons learned → Tests pass (5/5)
    
Key insight: Agent maintains a "reflection memory" — lessons learned
             from past failures that inform future attempts.
```

---

## Tool Use

### Tool Types

| Category | Examples | Mechanism |
|----------|---------|-----------|
| Information retrieval | Web search, RAG, database queries | Read-only, returns data |
| Computation | Calculator, code interpreter, Wolfram Alpha | Deterministic computation |
| Code execution | Python sandbox, shell commands | Turing-complete actions |
| API interaction | REST APIs, Slack, email, calendar | Side effects on external systems |
| File operations | Read/write/create files | Persistent state changes |
| Browser automation | Click, type, navigate web pages | GUI interaction |
| Communication | Send messages, create tasks | Interact with humans/systems |

### Function Calling (Tool Definition)

```json
{
  "name": "get_weather",
  "description": "Get current weather for a city",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "City name (e.g., 'Stockholm')"
      },
      "units": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Temperature units"
      }
    },
    "required": ["city"]
  }
}
```

### Tool Selection Challenges

| Challenge | Description | Mitigation |
|-----------|-------------|-----------|
| Too many tools | Model can't choose among 100+ tools | Hierarchical tool selection, RAG over tool docs |
| Incorrect tool | Picks wrong tool for the task | Better descriptions, few-shot examples |
| Wrong parameters | Correct tool but malformed arguments | Structured output (JSON mode), validation |
| Unnecessary tool use | Calls tool when it already knows the answer | "Do I need a tool?" decision step |
| Tool errors | API returns error or unexpected format | Error handling, retry with different approach |

---

## Memory Systems

### Memory Types

| Type | Duration | Implementation | Purpose |
|------|----------|---------------|---------|
| Working memory | Current task | Context window | Active reasoning |
| Episodic memory | Session-level | Conversation history | Track dialogue state |
| Semantic memory | Persistent | Vector DB, knowledge graph | Long-term knowledge |
| Procedural memory | Persistent | Saved plans, workflows | How to do things |

### Long-Term Memory Architectures

```
Experience → Memory Manager
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
 Summarize   Extract     Reflect
 (compress)  (key facts) (lessons)
    │           │           │
    └───────────┼───────────┘
                │
         Memory Store (vector DB)
                │
         Retrieval (similarity search)
                │
         Inject into context for future tasks
```

### Memory Strategies

| Strategy | Method | When |
|----------|--------|------|
| Sliding window | Keep last N messages | Short conversations |
| Summarization | LLM summarizes old context | Long conversations |
| RAG over history | Retrieve relevant past interactions | Knowledge-heavy tasks |
| Entity memory | Track facts about entities mentioned | Relationship-heavy tasks |
| Reflection | Periodically extract lessons learned | Learning agents |

---

## Multi-Agent Systems

### Architectures

| Architecture | Description | Example |
|-------------|-------------|---------|
| Hierarchical | Manager agent delegates to worker agents | CEO → team leads → specialists |
| Peer-to-peer | Agents communicate directly as equals | Debate, brainstorming |
| Pipeline | Sequential handoff between specialized agents | Researcher → Writer → Reviewer |
| Competitive | Agents compete (adversarial or market) | Red-team / blue-team |
| Collaborative | Agents share information toward common goal | Software development team |
| Society | Emergent behavior from many simple agents | Simulation, collective intelligence |

### Multi-Agent Frameworks

| Framework | Developer | Approach |
|-----------|-----------|----------|
| CrewAI | CrewAI | Role-based agents with goals and backstories |
| AutoGen | Microsoft | Conversational multi-agent framework |
| LangGraph | LangChain | Graph-based agent workflows (stateful) |
| MetaGPT | DeepWisdom | Software company simulation (PM, architect, dev) |
| ChatDev | OpenBMB | Virtual software company |
| CAMEL | CAMEL-AI | Communicative agents for task solving |
| Swarm (OpenAI) | OpenAI | Lightweight multi-agent orchestration |

### Agent Communication

```
Manager Agent:
    "We need to build a REST API for user authentication.
     @architect: Design the API structure.
     @developer: Implement based on architect's design.
     @tester: Write integration tests."

Architect Agent → Developer Agent:
    "Here's the design:
     POST /auth/login (email, password) → JWT token
     POST /auth/register (email, password, name) → user + token
     POST /auth/refresh (refresh_token) → new access token
     Use bcrypt for passwords, RS256 for JWT."

Developer Agent → Tester Agent:
    "Implementation complete in src/auth/. 
     3 files: routes.py, service.py, models.py"

Tester Agent → Manager Agent:
    "All 12 test cases pass. Coverage: 94%.
     Edge case found: duplicate email returns 500 instead of 409. Filed."
```

---

## Autonomous Systems (Robotics & Vehicles)

### Autonomous Driving Stack

```
Sensors → Perception → Prediction → Planning → Control → Actuators
  │           │            │           │          │
LiDAR      Object       Trajectory   Path       Steering,
Camera     Detection     Forecasting  Planning   Throttle,
Radar      Tracking      Intent       Decision   Braking
IMU        Mapping       Prediction   Making
GPS        Localization
```

### SAE Automation Levels

| Level | Name | Description | Driver role |
|-------|------|-------------|-------------|
| 0 | No automation | Human does everything | Full control |
| 1 | Driver assistance | One axis (steering OR speed) | Monitor + control other axis |
| 2 | Partial automation | Both steering AND speed | Must always monitor |
| 3 | Conditional automation | System drives in certain conditions | Ready to take over |
| 4 | High automation | System handles most scenarios in defined area | No intervention needed in area |
| 5 | Full automation | System handles all scenarios everywhere | No human needed |

### Robotics + Foundation Models

| Approach | Method | Example |
|----------|--------|---------|
| Vision-Language-Action (VLA) | Single model: image + instruction → robot action | RT-2, Octo |
| Language as planner | LLM generates high-level plan, low-level policy executes | SayCan, Code as Policies |
| World models | Predict future states, plan in imagination | Dreamer, UniSim |
| Imitation learning | Learn from human demonstrations | BC, DAgger |
| Sim-to-real transfer | Train in simulation, deploy on real robot | Domain randomization |
| Foundation model for robotics | Pre-train on diverse robot data | RT-X, OpenVLA |

---

## Agent Evaluation

### Benchmarks

| Benchmark | Task | Metric |
|-----------|------|--------|
| WebArena | Web browsing tasks (realistic websites) | Task success rate |
| SWE-bench | Fix real GitHub issues | % resolved |
| GAIA | General AI assistant tasks | Task completion accuracy |
| AgentBench | Multi-domain agent evaluation | Score across 8 environments |
| ToolBench | API tool usage across 16K APIs | Pass rate, win rate |
| OSWorld | Operating system tasks (desktop) | Success rate |
| τ-bench | Customer service agent (airline, retail) | Accuracy under constraints |
| MLE-bench | ML engineering competitions | Kaggle medal equivalents |

### Evaluation Dimensions

| Dimension | What it measures | How to evaluate |
|-----------|-----------------|----------------|
| Task success | Did it achieve the goal? | Binary success + partial credit |
| Efficiency | How many steps / tokens / cost? | Step count, token usage, API calls |
| Safety | Did it avoid harmful actions? | Red-teaming, constraint checking |
| Robustness | Works with noisy/ambiguous input? | Adversarial inputs, edge cases |
| Generalization | Works on unseen tasks? | Held-out task categories |
| Collaboration | Works well with humans? | Human satisfaction, correction rate |
| Reliability | Consistent performance? | Success variance across runs |

---

## Safety & Control

### Risks of Autonomous Agents

| Risk | Description | Mitigation |
|------|-------------|-----------|
| Unintended actions | Agent takes harmful irreversible action | Sandboxing, confirmation gates |
| Goal misalignment | Agent pursues instrumental subgoals | Constrained optimization, oversight |
| Deception | Agent appears aligned but acts differently | Monitoring, interpretability |
| Resource acquisition | Agent seeks more compute/access than needed | Resource budgets, capability limits |
| Cascading failures | One agent's error propagates to others | Circuit breakers, isolation |
| Accountability gap | Unclear who is responsible for agent actions | Logging, human-in-the-loop |

### Control Mechanisms

| Mechanism | Description | When to use |
|-----------|-------------|-------------|
| Human-in-the-loop | Require human approval for actions | High-risk decisions |
| Sandboxing | Execute in isolated environment | Code execution, web browsing |
| Budget constraints | Limit steps, tokens, API calls, cost | All production agents |
| Action allowlists | Only permit pre-approved actions | Restricted environments |
| Monitoring + kill switch | Real-time observation with ability to stop | All autonomous agents |
| Guardrails | Input/output filtering for harmful content | User-facing agents |
| Capability limitations | Don't give agent access it doesn't need | Principle of least privilege |
| Audit logging | Record all decisions and actions | Compliance, debugging |

### Trust Levels

```
Level 1 (Supervised): Agent suggests, human decides and executes
    → Code review suggestions, email drafts

Level 2 (Confirmed): Agent plans and proposes, human approves
    → PR creation, meeting scheduling, purchase orders

Level 3 (Monitored): Agent acts autonomously, human monitors
    → Automated testing, data pipeline management

Level 4 (Autonomous): Agent acts with minimal human oversight
    → Only for well-bounded, reversible, low-risk tasks
```

---

## Emerging Directions

### Computer Use Agents

```
Agent sees screenshots → understands GUI → takes mouse/keyboard actions

GPT-4V / Claude → screenshot understanding → action planning
    │
    ▼
Browser automation: click(x, y), type("text"), scroll, navigate
Desktop automation: open app, interact with native UI
Mobile: tap, swipe, type on virtual keyboard

Challenges:
    - Spatial grounding (where exactly to click?)
    - State tracking (what happened after last action?)
    - Long-horizon planning (multi-step workflows)
    - Error recovery (unexpected popups, loading screens)
```

### Agent Operating Systems

| Concept | Description |
|---------|-------------|
| Agent protocol | Standardized communication between agents (MCP, A2A) |
| Tool marketplace | Registry of tools agents can discover and use |
| Agent identity | Credentials, permissions, trust levels for agents |
| Orchestration layer | Route tasks to appropriate specialized agents |
| Shared memory | Persistent knowledge accessible across agent sessions |
| Agent lifecycle | Spawn, monitor, scale, terminate agents |

### Current Limitations & Future

| Limitation | Current state | Needed breakthrough |
|-----------|--------------|-------------------|
| Reliability | 30-70% success on complex benchmarks | Better planning, error recovery |
| Long-horizon | Degrades over 10+ steps | Hierarchical planning, better memory |
| Real-world grounding | Mostly digital environments | Embodied AI, world models |
| Cost | $0.10-$10+ per agent task | Smaller models, efficient reasoning |
| Speed | Seconds-minutes per step | Faster inference, parallel execution |
| Trust | Hard to verify agent correctness | Formal verification, interpretability |
| Coordination | Multi-agent systems are brittle | Better communication protocols |
