---
name: prospec-tasks
description: "Break Down Tasks | 拆解任務 - Decompose implementation plan into an actionable task checklist (tasks.md). Triggers: break down, tasks, task list, work items, how to split, 拆解, 任務清單, 工作項目, 怎麼拆"
---

# Prospec Tasks Skill

## Activation

When triggered, briefly describe:
- That you'll read plan.md and delta-spec.md to understand the implementation scope
- Tasks will be organized by architecture layer (Types → Lib → Services → CLI → Tests)
- Each task will have complexity estimates and parallelization markers

## Startup Loading

1. Read `.prospec/changes/[name]/plan.md` — parse implementation steps
2. Read `.prospec/changes/[name]/delta-spec.md` — parse file changes and specifications
3. Read `.prospec/changes/[name]/design-spec.md` (if exists) — identify UI components for task decomposition
4. Read `prospec/CONSTITUTION.md` — prepare test coverage check
5. Read related module `README.md` from `prospec/ai-knowledge/modules/` — confirm architecture layers and dependency directions for task ordering
6. **MANDATORY** — Read [`references/tasks-format.md`](references/tasks-format.md) for tasks.md format

## Core Workflow

### Phase 1: Parse Planning Documents

Auto-identify current change, read plan.md and delta-spec.md, summarize implementation phases, file changes, and spec count.

### Phase 2: Create Scaffolding

| Scenario | Action |
|----------|--------|
| tasks.md doesn't exist | Create empty `tasks.md`, update `metadata.yaml` status → `tasks` |
| Already exists | Read and populate |

### Phase 3: Decompose by Architecture Layer

Organize tasks following the layer order defined in `references/tasks-format.md`:

```
Types → Lib → Services → CLI → Tests
```

Each task format: `- [ ] [description] ~{lines} lines`. Add `[P]` marker for parallelizable tasks.

**Decomposition principles:**
- Single responsibility: one task does one thing
- Verifiable: clear completion criteria
- Right-sized: ideal 15-25 tasks, each 20-100 lines
- Dependency direction: follow `cli → services → lib → types` order from `_conventions.md` — implement lower layers first

**UI task decomposition** (when design-spec.md exists):
- Reference specific component names from design-spec.md in each UI task description
- Annotate each UI task with: "Read precise design values from design tool via adapter MCP before implementing"
- This ensures the implement phase knows which components to look up and which MCP tools to use

### Phase 4: Mark Parallelization Opportunities

Identify tasks with no dependencies, mark with `[P]`. Independent tasks within the same layer are usually parallelizable.

### Phase 5: Generate Summary

Add statistics at end of file: Total Tasks, Parallelizable Tasks, Total Estimated Lines.

### Phase 6: Constitution Test Check

Ensure each new/modified module has corresponding test tasks. If coverage is insufficient, add test tasks or raise a warning.

### Phase 7: Knowledge Quality Gate

Before finalizing, verify task decomposition against Knowledge:

| Check Item | PASS | WARN |
|------------|------|------|
| Architecture layers confirmed | Layer order matches module dependency graph | Layer order assumed without README verification |
| File paths verified | All task file paths exist or are clearly new | Some paths uncertain |
| Test tasks included | Every new/modified module has test tasks | Some modules missing test coverage |

WARN items do not block — add clarification notes to affected tasks.

### Phase 8: Summary + Next Steps

Suggest: `/prospec-implement` or manual review.

## NEVER

- **NEVER** produce more than 30 tasks — indicates Story scope creep; large task lists overwhelm AI context and lose coherence
- **NEVER** create overly fine-grained tasks (<10 lines) — micro-tasks inflate task count and add checkbox overhead without meaningful progress tracking
- **NEVER** create overly coarse tasks (>200 lines) — unverifiable; if a 200-line task fails, the entire block must be debugged and reworked
- **NEVER** forget to update metadata.yaml status to `tasks` — downstream Skills check status to determine workflow stage
- **NEVER** start decomposition without plan.md — tasks without architecture context produce random file edits instead of layered implementation
- **NEVER** skip test tasks — Constitution requires test coverage; untested modules are deployment blockers in Verify phase
- **NEVER** forget to mark `[P]` — Implement Skill uses this to suggest parallel developer assignment; missing markers force sequential execution
- **NEVER** use S/M/L complexity markers — `~{lines} lines` provides actionable estimates for progress tracking and commit sizing

## Error Handling

| Scenario | Action |
|----------|--------|
| plan.md not found | Guide user to run `/prospec-plan` first |
| Task count exceeds 30 | Suggest splitting the Story or merging fine-grained tasks |
| Insufficient test coverage | Offer options: add test tasks / document test debt |



---

## Reference: Tasks Format

# Tasks Format Reference

This document defines the expected format for `tasks.md`, used by the **prospec-tasks** Skill.

---

## Purpose

`tasks.md` breaks down `plan.md` implementation steps into concrete development tasks with complexity estimates and dependency markers.

---

## Standard Format

### 1. Checkbox Format

Use Markdown checkbox syntax:

```markdown
- [ ] Pending task
- [x] Completed task
```

---

### 2. Architecture-Layer Grouping

Group tasks by architecture layer in recommended order:

```markdown
## Types

- [ ] [Task description] ~{lines} lines

## Lib

- [ ] [Task description] ~{lines} lines

## Services

- [ ] [Task description] ~{lines} lines

## CLI

- [ ] [Task description] ~{lines} lines

## Tests

- [ ] [Task description] ~{lines} lines
```

**Example:**

```markdown
## Types

- [ ] Define ErrorType enum (ValidationError, NotFoundError, etc.) ~30 lines
- [ ] Create ErrorResponse interface for API responses ~20 lines

## Lib

- [ ] [P] Implement BaseError class with error code mapping ~50 lines
- [ ] [P] Implement ErrorFormatter utility ~40 lines
- [ ] Create error factory functions (createValidationError, etc.) ~60 lines

## Services

- [ ] Integrate error handler with API middleware ~80 lines
- [ ] Update existing error handling in UserService ~40 lines
- [ ] Update existing error handling in AuthService ~40 lines

## CLI

- [ ] Add error code reference to CLI help command ~20 lines

## Tests

- [ ] [P] Write unit tests for BaseError class ~60 lines
- [ ] [P] Write unit tests for ErrorFormatter ~50 lines
- [ ] Write integration tests for API error responses ~100 lines
```

---

### 3. Parallelizable Task Markers

Use `[P]` to mark tasks that can be executed in parallel (no dependencies):

```markdown
- [ ] [P] Parallelizable task 1 ~50 lines
- [ ] [P] Parallelizable task 2 ~50 lines
```

---

### 4. Complexity Estimate Format

Use `~{lines} lines` to estimate complexity:

```markdown
- [ ] Simple task ~20 lines
- [ ] Medium task ~50 lines
- [ ] Complex task ~100 lines
```

---

### 5. Summary Section

Add a summary at the end of the file:

```markdown
## Summary

- **Total Tasks:** {total task count}
- **Parallelizable Tasks:** {parallelizable task count}
- **Total Estimated Lines:** ~{total estimated lines} lines
```

**Example:**

```markdown
## Summary

- **Total Tasks:** 13
- **Parallelizable Tasks:** 4
- **Total Estimated Lines:** ~640 lines
```

---

## Task Granularity Guidelines

- **Ideal count: 15-25 tasks**
- **Too many (>25):** Consider merging similar tasks
- **Too few (<10):** Consider splitting complex tasks

---

## Task Granularity Examples

### Good granularity:

```markdown
- [ ] Implement BaseError class with error code mapping ~50 lines
```

### Too coarse (needs splitting):

```markdown
- [ ] Implement entire error handling system ~500 lines
```

**Split into:**

```markdown
- [ ] Implement BaseError class ~50 lines
- [ ] Implement ErrorFormatter utility ~40 lines
- [ ] Implement error factory functions ~60 lines
- [ ] Integrate with API middleware ~80 lines
```

### Too fine (needs merging):

```markdown
- [ ] Import BaseError class ~1 line
- [ ] Define error code constant ~1 line
- [ ] Define error message constant ~1 line
```

**Merge into:**

```markdown
- [ ] Define error codes and messages ~30 lines
```

---

## File Length Guidelines

- Keep under **100 lines**
- If tasks exceed 30, consider whether the Story scope is too large

---

## Reference Information

- Project name: `portfolio`
- AI Knowledge path: `prospec/ai-knowledge`
- Constitution file: `prospec/CONSTITUTION.md`
