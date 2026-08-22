# Anthropic prompt engineering docs

**Link:** [url](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview)

## Best Practices

### General Principles

- Be clear and direct
- Add context to improve performance
- Use example effictively (relevant, diverse, structured)
- Structure prompts with XML tags: \<instructions>, \<context>, \<input>, \<documents> -> \<document index="n"> (nesting)
- Give Claude a role
- Long context prompting:
    - Put longform data at the top
    - Ground responses in quotes
- Model self-knowledge: "The assistant is Claude, created by Anthropic. The current model is Claude Opus 5."

### Output and formatting

- Communication style and verbosity
- Control the format of responses:
    - Tell Claude what to do instead of what not to do
    - Use XML format indicators
    - Match your prompt style to the desired output
    - Use detailed prompts for specific formatting preferences

### Thinking and reasoning

- Overthinking and excessive thoroughness:
    - Replace blanket defaults with more targeted instructions
    - Remove over-prompting
    - Change effort as a fallback

# Playwright MCP

**Link:** [url](https://github.com/microsoft/playwright-mcp)

## Description

A Model Context Protocol (MCP) server that provides browser automation capabilities using Playwright. This server enables LLMs to interact with web pages through structured accessibility snapshots, bypassing the need for screenshots or visually-tuned models.

## Takeaways

- AI tests using Playwright
- Good for finding edge cases
- Describe scenario and the tool generates Playwright test/tests

# DeepLearning.AI short courses

**Link:** [url](https://www.deeplearning.ai/courses?types=short_course)

## Agent Skills with Anthropic

- Skills are standardized to all agents that use skills
- Lightweight, open format for extending AI agent capabilities
- Use cases: domain expertise, repeatable workflow, new capabilities
- MCP: connects agent to external systems and data != skills
- Tools: Read, Write, Edit, Bash, Grep, ... != skills
- Subagents: isolated context, tool premissions != skills