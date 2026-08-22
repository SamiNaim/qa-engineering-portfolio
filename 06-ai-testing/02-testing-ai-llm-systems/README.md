# DeepEval

**Link:** https://deepeval.com/docs/getting-started

DeepEval is an open-source LLM evaluation framework, built to feel like a unit-testing library (think Pytest, but for model outputs) rather than a notebook full of ad hoc scoring code. You define an `LLMTestCase` (input, actual output, and optionally retrieval context or expected output) and run it against one or more metrics.

**Core metrics worth knowing:**
- **Faithfulness**: does the output factually align with the retrieved context? This is DeepEval's main hallucination check for RAG systems.
- **Hallucination**: compares output against a curated ground-truth context (different from Faithfulness, which checks against whatever was actually retrieved at runtime).
- **Answer Relevancy**: does the output actually address the input?
- **Contextual Relevancy / Recall / Precision**: retriever-side metrics for RAG pipelines.
- **G-Eval**: a customizable LLM-as-a-judge metric where you define your own evaluation steps in plain English (useful for domain-specific criteria, e.g. "penalize any unsupported medical claim").

Most of these metrics use **LLM-as-a-judge** scoring, and DeepEval returns a reasoned explanation alongside every score, which matters when you need to debug *why* a test failed rather than just that it did.

---

# Promptfoo

**Link:** https://www.promptfoo.dev/docs/intro/

Promptfoo is an open-source CLI tool that does two related but distinct jobs: **evaluation** (compare prompts/models against your own test cases) and **red-teaming** (automatically generate adversarial inputs to find where your app breaks). You describe prompts, providers, and test cases in a `promptfooconfig.yaml`, then run `promptfoo eval` to get a side-by-side comparison matrix. Notably, <cite index="17-1">it runs locally with no account required and ships as a single npx-executable package.</cite>

**Evaluation side:**
- Works across 50+ model providers (OpenAI, Anthropic, Google, local models) so you can compare outputs from the same prompt across models.
- Supports deterministic assertions (string match, JSON schema, regex), model-graded assertions ("does this response satisfy X"), and custom JS/Python assertions.
- Built for CI/CD: assertions can gate a pipeline the same way unit tests do.

**Red-team side:**
- <cite index="16-1">Automatically generates adversarial inputs targeting a defined set of vulnerabilities, and automates evaluation of the outputs</cite> against them.
- `promptfoo redteam run` combines attack generation and evaluation into one command, so your generated attacks stay in sync with your latest app configuration.
- Covers dozens of vulnerability categories (jailbreaks, prompt injection, PII extraction, RAG poisoning) that map directly onto the OWASP list below.

**Note:** Promptfoo was acquired by OpenAI in early 2026, but remains open-source and usable independent of any specific model provider.

---

# Ragas

**Link:** https://docs.ragas.io

Ragas ("RAG Assessment") is a framework purpose-built for evaluating **RAG (Retrieval-Augmented Generation) pipelines** where DeepEval is general-purpose, Ragas is specialized for the retrieve-then-generate architecture.

**Core metrics:**
- **Faithfulness**: factual consistency of the answer against the retrieved context.
- **Context Precision**: how much of the retrieved context is actually relevant (and correctly ranked).
- **Context Recall**: whether all the information needed to answer the question was retrieved at all.
- **Response/Answer Relevancy**: how well the answer addresses the actual question asked.

These four together separate retrieval quality from generation quality: a low score on Context Recall points at your retriever/embedding setup, while a low Faithfulness score points at the generator hallucinating despite having the right context. Ragas' full metric catalog also extends into agent evaluation (tool call accuracy, goal accuracy) and non-LLM metrics (BLEU, ROUGE, exact match) for cases where you don't want LLM-as-a-judge overhead.

---

# OWASP Top 10 for LLM Applications

**Link:** https://genai.owasp.org

<cite index="38-1">The OWASP Top 10 for LLM Applications is a community-ranked list of the ten most critical security risks in applications built on large language models</cite>. It's the closest thing this space has to a standard vocabulary for AI application security. The 2025 edition (v2.0) is the current one.

**The 2025 list:**
1. **LLM01: Prompt Injection**: <cite index="33-1">attacker input alters the model's behavior; can be direct (user types it) or indirect (the model ingests it from an external source like a webpage)</cite>.
2. **LLM02: Sensitive Information Disclosure**: the model exposes data it shouldn't (PII, secrets, training data).
3. **LLM03: Supply Chain**: risks from third-party models, datasets, plugins, or fine-tuning pipelines.
4. **LLM04: Data and Model Poisoning**: training or fine-tuning data manipulated to corrupt behavior.
5. **LLM05: Improper Output Handling**: treating model output as trusted when it should be sanitized like any external input, since <cite index="31-1">this vulnerability typically chains with prompt injection, where an attacker injects instructions that cause the model to generate malicious output that the application then executes</cite>.
6. **LLM06: Excessive Agency**: an agent has more permissions, autonomy, or tool access than it needs.
7. **LLM07: System Prompt Leakage**: the system prompt itself (often containing business logic or guardrails) gets exposed.
8. **LLM08: Vector and Embedding Weaknesses**: risks specific to RAG's embedding and vector-store layer.
9. **LLM09: Misinformation**: the model <cite index="31-1">hallucinates facts and invents citations, producing polished responses to questions it can't reliably answer</cite> (renamed from "Overreliance" in the 2024 list).
10. **LLM10: Unbounded Consumption**: runaway cost or resource use, an evolution of the old "Denial of Service" category.

---

## How these fit together

- **DeepEval** and **Ragas** overlap heavily (both do faithfulness/relevancy/context metrics). DeepEval is the more general-purpose, unit-test-flavored tool; Ragas is RAG-specialized. Worth running both against the same pipeline once, to see where they agree/disagree.
- **Promptfoo** is the operational layer that ties evaluation and red-teaming into something you'd actually run in CI.
- **OWASP** is the risk taxonomy that tells you *what* to red-team for.