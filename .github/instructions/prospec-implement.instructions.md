---
name: prospec-implement
description: "Implementation | 執行實作 - Execute tasks from the task list, implementing features one by one. Triggers: implement, start coding, write code, execute tasks, 實作, 開始做, 寫 code, 執行任務"
---

# Prospec Implement Skill

## Activation

When triggered, briefly describe:
- That you'll read tasks.md and execute tasks in order
- Knowledge will be loaded progressively as needed
- Each completed task will be immediately marked in tasks.md

## Startup Loading

1. Read `.prospec/changes/[name]/tasks.md` — find the first uncompleted task
2. Read `.prospec/changes/[name]/plan.md` — understand design intent
3. Read `.prospec/changes/[name]/delta-spec.md` — understand file specifications
4. **MANDATORY** — Read [`references/implementation-guide.md`](references/implementation-guide.md) for implementation guidelines
5. **MANDATORY** — Read `prospec/ai-knowledge/_conventions.md` — follow project patterns (execute(), atomicWrite(), ContentMerger)

**Do NOT** load all module AI Knowledge at once. Load on demand.

## Progressive Knowledge Loading Strategy

| Layer | What to Load | When to Load | Budget |
|-------|-------------|--------------|--------|
| L0 | `_index.md` + `_conventions.md` + tasks.md + plan.md + delta-spec.md | At startup — navigate modules and understand current tasks | ≤ 1,500 tokens (knowledge) |
| L1 | Related module `README.md` (Recipe-First) | When starting a task — understand APIs, modification patterns, and ripple effects | ≤ 400 tokens/module |
| L2 | Source code files | When implementing — verify details, read exact signatures | On-demand |

**Principles:** L0 is always loaded. L1 is loaded per-module as needed. Never duplicate L2 content in L1.

## Core Workflow

### Phase 1: Read Task List

Parse tasks.md, display progress statistics (completed/total/percentage), locate current task.

### Phase 2: Load Relevant Knowledge

Extract architecture design and technical decisions related to current task from plan.md.
Extract file specifications for current task from delta-spec.md.
Load relevant module AI Knowledge (Layer 2).

**For UI tasks** (when design-spec.md exists):
1. Read `.prospec/changes/[name]/design-spec.md` — identify component structure, tokens, states
2. Read `.prospec/changes/[name]/interaction-spec.md` — understand interaction flows and transitions
3. Read the platform adapter reference (based on `.prospec.yaml` → `design.platform`) — understand MCP tool usage for reading design data
4. If design-spec.md does NOT exist for a UI task → warn user: "No design spec found. UI implementation will rely on proposal.md descriptions only. Consider running `/prospec-design` first."

### Phase 3: Execute Implementation

Implement code based on delta-spec specifications and module design patterns.
Follow `prospec/ai-knowledge/_conventions.md` patterns: Service `execute()`, `atomicWrite()` for file operations, `ContentMerger` for preserving user sections.

**For UI tasks — MCP-first approach:**
Before writing any UI code, use the platform adapter's Implement Phase guidelines to read precise design values from the design tool via MCP (exact colors, spacing, font sizes, component structure). MCP-read values are more precise than design-spec.md markdown descriptions — always prefer MCP data for visual properties. Use design-spec.md as the structural blueprint, and MCP as the measurement source.

### Phase 4: Verify Implementation

After completion, perform quick quality check:
- Specification compliance (against delta-spec.md)
- Type safety
- Error handling
- Constitution compliance

### Phase 5: Mark Complete

Update checkbox in tasks.md `- [ ]` → `- [x]`, display updated progress.

### Phase 6: Move to Next Task

Auto-locate next uncompleted task. If switching architecture layers, load new module knowledge.
When all tasks are complete, suggest `/prospec-verify`.

## Task Execution Rules

- **Execute in order**: Follow tasks.md architecture layer sequence (Types → Lib → Services → CLI → Tests)
- **`[P]` marked tasks**: Can be parallelized but AI still executes sequentially; remind user they can assign to other developers
- **Immediate marking**: Update tasks.md immediately after completing each task
- **Commit strategy**: Suggest commit after completing a group of related tasks

## Knowledge Quality Gate

After completing each task, verify Knowledge alignment:

| Check Item | PASS | WARN |
|------------|------|------|
| _conventions.md patterns followed | execute()/atomicWrite()/ContentMerger used where applicable | Patterns not followed — justify deviation |
| Module README consulted | Related module API verified before implementation | Implemented without checking module README |
| Delta-spec compliance | Implementation matches specification | Deviation documented in tasks.md |

WARN items do not block — document reasoning in task completion notes.

## NEVER

- **NEVER** skip tasks to work on later ones — architecture layers have dependency direction; skipping causes missing imports, undefined types, or broken contracts
- **NEVER** start implementation without tasks.md — coding without task structure produces scattered changes that fail Verify's spec compliance check
- **NEVER** load all module AI Knowledge at once — wastes context window tokens; a 6-module project loads ~3000 tokens unnecessarily when only 1 module is relevant
- **NEVER** forget to mark task completion — unchecked tasks cause Verify to report false incomplete status; also breaks progress tracking for user
- **NEVER** deviate from delta-spec.md specifications without documenting — undocumented deviations cause Verify FAIL and capability spec inconsistency
- **NEVER** skip quality check before marking complete — unmarked type errors and spec mismatches compound across tasks, making late fixes exponentially harder
- **NEVER** forget to suggest `/prospec-verify` when all tasks are complete — users may skip verification and proceed to archive, missing quality issues

## Error Handling

| Scenario | Action |
|----------|--------|
| tasks.md not found | Guide user to run `/prospec-tasks` first |
| Task has unmet dependency | Suggest completing dependency first / skip and record blocker |
| Unclear specification | Decide based on conventions and best practices / return to `/prospec-plan` to supplement |
| Technical blocker | Record blocker, continue with other independent tasks |



---

## Reference: Implementation Guide

# Implementation Guide

This document provides implementation guidelines for the **prospec-implement** Skill.

---

## Implementation Principles

### 1. TDD Approach (If Required by Constitution)

If `prospec/CONSTITUTION.md` requires TDD (Test-Driven Development):

1. **Write tests first:** Write corresponding unit tests before implementing functionality
2. **Red-Green-Refactor cycle:**
   - Red: Write test, ensure it fails
   - Green: Implement minimum functionality to pass the test
   - Refactor: Optimize code quality
3. **Test coverage:** Ensure core logic has sufficient test coverage

---

### 2. Task Execution Order

Follow the architecture layer sequence in `tasks.md`:

```
Types → Lib → Services → CLI → Tests
```

**Dependency rules:**
- Complete depended-upon modules first (e.g., Types, Lib)
- Then implement modules that depend on others (e.g., Services, CLI)
- `[P]` marked tasks can be executed simultaneously (no dependencies)

**Example execution order:**

```
1. Types/Define ErrorType enum
2. Types/Create ErrorResponse interface
3. [P] Lib/Implement BaseError class (parallelizable)
   [P] Lib/Implement ErrorFormatter utility (parallelizable)
4. Lib/Create error factory functions (depends on BaseError)
5. Services/Integrate with API middleware (depends on BaseError, ErrorFormatter)
```

---

### 3. Progressive Disclosure

**Only load AI Knowledge relevant to the current task:**

1. **Before starting:** Read `prospec/ai-knowledge/_index.md` to understand overall architecture
2. **During task execution:** Only read `prospec/ai-knowledge/modules/{module}/README.md` for the relevant module
3. **Avoid:** Loading all AI Knowledge files at once

**Example:**

When executing task `Implement BaseError class`:
- Read `prospec/ai-knowledge/modules/error-handler/README.md`
- No need to read `api-middleware`, `logger`, or other module READMEs

---

### 4. Task Completion Marking

**Mark complete immediately:**

After completing each task, immediately update `tasks.md` to mark as `[x]`:

```markdown
- [x] Implement BaseError class with error code mapping ~50 lines
```

This helps track progress and avoid duplicate work.

---

### 5. Commit Strategy

**Recommended commit strategy:**

- **Logical grouping:** Commit after completing a group of related tasks
- **Commit message format:**
  ```
  feat: [brief description] (Task ID)
  ```
  or
  ```
  test: [test description] (Task ID)
  ```

**Example:**

```bash
# After completing Types tasks
git add src/types/error.ts
git commit -m "feat: define error types and interfaces (T001-T002)"

# After completing Lib tasks
git add src/lib/error-handler.ts src/lib/error-formatter.ts
git commit -m "feat: implement error handler core logic (T003-T005)"

# After completing Tests
git add tests/error-handler.test.ts
git commit -m "test: add unit tests for error handler (T011-T012)"
```

---

### 6. Error Handling

**If a task fails:**

1. **Record blocker:** Document the issue in `tasks.md` or the Story's Notes
2. **Continue execution:** If there are other independent tasks, continue with them
3. **Report:** Report incomplete tasks and reasons when Story is finalized

**Example:**

```markdown
## Blockers

- Task "Integrate with API middleware" blocked: API middleware module not yet merged from another branch
```

---

### 7. Code Quality Checks

**After completing implementation:**

1. **Lint:** Run linter to ensure consistent code style
   ```bash
   pnpm run lint
   ```

2. **Type Check:** Run TypeScript type checking
   ```bash
   pnpm run type-check
   ```

3. **Tests:** Run tests to verify functionality
   ```bash
   pnpm test
   ```

---

## Reference Information

- Project name: `portfolio`
- Tech stack: `javascript` + ``
- Package manager: `pnpm`
- AI Knowledge path: `prospec/ai-knowledge`
- Constitution file: `prospec/CONSTITUTION.md`
