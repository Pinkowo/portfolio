---
name: prospec-plan
description: "Plan Implementation | 規劃實作 - Convert User Story into technical implementation plan (plan.md) and change specification (delta-spec.md). Triggers: plan, design architecture, how to implement, 規劃, 設計架構, 怎麼實作"
---

# Prospec Plan Skill

## Activation

When triggered, briefly describe:
- That you'll read the proposal.md and design an implementation plan
- You'll produce both plan.md and delta-spec.md
- Knowledge will be loaded progressively (Layer 1 then Layer 2 as needed)

## Startup Loading

1. Read `.prospec/changes/[name]/proposal.md` — parse User Stories and acceptance scenarios
2. Read `prospec/ai-knowledge/_index.md` — identify related modules (Layer 1)
3. Read `prospec/CONSTITUTION.md` — prepare Constitution check
4. Read `/specs/features/` — load relevant Feature Specs for existing requirements and User Story context
5. Read `/specs/product.md` — understand product-level overview and feature map
6. **MANDATORY** — Read [`references/plan-format.md`](references/plan-format.md) for plan.md format
7. **MANDATORY** — Read [`references/delta-spec-format.md`](references/delta-spec-format.md) for delta-spec.md format

**Do NOT** load all module AI Knowledge at once. Load on demand.

## Progressive Knowledge Loading Strategy

| Layer | What to Load | When to Load | Budget |
|-------|-------------|--------------|--------|
| L0 | `_index.md` + `_conventions.md` + Feature Specs + Product Spec | At startup — navigate modules and understand existing requirements | ≤ 1,500 tokens (knowledge) |
| L1 | Related module `README.md` (Recipe-First) | During architecture design — understand APIs, dependencies, and modification patterns | ≤ 400 tokens/module |
| L2 | Source code files | When technical questions arise — user can request explicitly | On-demand |

**Principles:** L0 is always loaded. L1 is loaded per-module as needed. Never duplicate L2 content in L1.

## Core Workflow

### Phase 1: Parse proposal.md

Auto-identify the current change (from directory context or ask user), read and summarize User Story.

### Phase 2: Context Mode Detection + Load Knowledge

**Step 1 — Detect Context Mode:**

| Condition | Mode |
|-----------|------|
| `prospec/ai-knowledge/modules/` has >= 2 modules with README.md | **Brownfield** |
| Otherwise (empty or < 2 modules) | **Greenfield** |

**Step 2 — Load Knowledge by Mode:**

- **Brownfield**: Load related module READMEs + `prospec/ai-knowledge/_conventions.md`. Prepare to synthesize Technical Summary in Phase 4.
- **Greenfield**: Skip module loading. Scan project root for tech stack indicators (`package.json`, `pyproject.toml`, `.prospec.yaml`), top-level directory structure, and 2-3 core source files. Recommend `prospec knowledge init` + `/prospec-knowledge-generate`.

### Phase 3: Create Scaffolding

| Scenario | Action |
|----------|--------|
| plan.md doesn't exist | Create empty `plan.md` + `delta-spec.md`, update `metadata.yaml` status → `plan` |
| Already exists | Read and populate |

### Phase 4: Design plan.md

Follow `references/plan-format.md` format:
- **Overview**: Implementation strategy summary
- **Technical Summary** (Brownfield) or **Technical Context** (Greenfield): Auto-synthesized from Phase 2 — see `references/plan-format.md` Section 2
- **Affected Modules**: Table of impacted modules and changes
- **Implementation Steps**: 4-8 steps with details
- **Risk Assessment**: Risks, impact, and mitigation strategies

### Phase 5: Generate delta-spec.md

Follow `references/delta-spec-format.md` format:
- **ADDED**: New requirements (REQ ID + Description + AC + Priority)
- **MODIFIED**: Changed requirements — reference existing behavior from Feature Specs as "Before" (Before/After/Reason)
- **REMOVED**: Removed requirements (Reason)

Each requirement in delta-spec.md must include **Feature** and **Story** routing fields (see `references/delta-spec-format.md`). These fields route requirements to the correct Feature Spec during archive Spec Sync.

### Phase 6: Constitution Check

Compare against 3+ most relevant principles, focusing on architecture, testing, performance, and security.

### Phase 7: Knowledge Quality Gate

Before finalizing, verify Knowledge loading completeness:

| Check Item | PASS | WARN |
|------------|------|------|
| Context mode detected | Brownfield/Greenfield identified | Could not determine — defaulted |
| Module Knowledge loaded | All related module READMEs read | Some modules missing README |
| Technical Summary synthesized | Section included in plan.md | Skipped or incomplete |
| Feature Specs checked | Existing User Stories and requirements reviewed | No Feature Specs found |

WARN items do not block — note them in plan.md Risk Assessment.

### Phase 8: Summary + Next Steps

Suggest: `/prospec-tasks` or manual review.

## NEVER

- **NEVER** write code in plan.md — plan is about architecture and steps, not code
- **NEVER** load all module AI Knowledge at once — only load related modules (Layer 2 on demand)
- **NEVER** skip delta-spec.md — plan and delta-spec must be produced together
- **NEVER** forget to update metadata.yaml status to `plan`
- **NEVER** start planning without a proposal.md — guide user to create a Story first
- **NEVER** produce more than 10 Implementation Steps — too many means the Story scope is too large
- **NEVER** ignore existing module design patterns — new implementation should follow project conventions
- **NEVER** skip Context Mode Detection — Brownfield/Greenfield determination drives Technical Summary format
- **NEVER** list risks in Risk Assessment without mitigation strategies

## Error Handling

| Scenario | Action |
|----------|--------|
| proposal.md not found | Guide user to run `/prospec-new-story` first |
| Insufficient module info | Offer options: continue with available info / pause to supplement Knowledge / load source code |
| Constitution conflict | Modify plan to comply (preferred) / document exception reasoning |



---

## Reference: Plan Format

# Plan Format Reference

This document defines the expected format for `plan.md`, used by the **prospec-plan** Skill.

---

## Purpose

`plan.md` is the execution plan for a Story, describing the implementation overview, affected modules, implementation steps, and risk assessment.

---

## Standard Format

### 1. Overview

A 1-2 paragraph summary describing the overall implementation strategy:

```markdown
## Overview

[Paragraph 1: What problem this Story solves]

[Paragraph 2: The implementation strategy and key design decisions]
```

**Example:**

```markdown
## Overview

This story implements a unified error handling mechanism for portfolio. Currently, errors are handled inconsistently across different modules, making debugging difficult.

We will create a centralized error handler module that defines standard error types, response formats, and logging strategies. This follows the error handling conventions specified in prospec/CONSTITUTION.md.
```

---

### 2. Technical Summary (Context-Dependent)

This section is **auto-synthesized** based on the project's Knowledge state. Include exactly ONE of the following:

**Brownfield Mode** — when `prospec/ai-knowledge/modules/` has >= 2 modules with README.md:

```markdown
## Technical Summary

> Auto-synthesized from AI Knowledge for this change's context

### Affected Module Overview
| Module | Core Responsibility | Key API | Dependencies |
|--------|-------------------|---------|--------------|
| [name] | [responsibility] | [key exports] | [deps] |

### Existing Patterns (from _conventions.md)
- [Pattern 1]: [brief description]
- [Pattern 2]: [brief description]

### Architecture Constraints (from Constitution)
- [Constraint 1]
- [Constraint 2]
```

**Greenfield Mode** — when AI Knowledge is empty or has < 2 modules:

```markdown
## Technical Context (Greenfield)

> AI Knowledge not yet established — substitute context collected below

### Tech Stack Detection
- Language: (inferred from .prospec.yaml or package.json/pyproject.toml)
- Framework: (inferred from dependencies)
- Test Framework: (inferred from devDependencies)

### Project Structure Scan
- Entry points: (src/index.ts, main.py, etc.)
- Directory summary: (top-level directories + inferred purpose)

### Detected Patterns
- (Scan 2-3 core files for naming conventions, architecture patterns)

### External Dependencies
- (List key dependencies from package.json/requirements.txt)

### [To Be Supplemented]
- Recommend running `prospec knowledge init` + `/prospec-knowledge-generate` for full Knowledge
```

---

### 3. Affected Modules

Use a table to list affected modules:

```markdown
## Affected Modules

| Module | Impact | Changes |
|--------|--------|---------|
| [module name] | [High/Medium/Low] | [Brief description of changes] |
```

**Example:**

```markdown
## Affected Modules

| Module | Impact | Changes |
|--------|--------|---------|
| error-handler | High | New module creation |
| api-middleware | Medium | Integrate centralized error handler |
| logger | Low | Add error-specific log formatting |
```

---

### 4. Implementation Steps

Use an ordered numbered list with details for each step:

```markdown
## Implementation Steps

1. **[Step title]**
   - [Detail 1]
   - [Detail 2]

2. **[Step title]**
   - [Detail 1]
   - [Detail 2]
```

**Example:**

```markdown
## Implementation Steps

1. **Create error-handler module**
   - Define standard error types (ValidationError, NotFoundError, etc.)
   - Implement error code mapping system
   - Create error response formatter

2. **Integrate with existing modules**
   - Update api-middleware to use centralized error handler
   - Refactor existing error handling code
   - Ensure backward compatibility

3. **Add logging and monitoring**
   - Integrate with logger module
   - Add error tracking hooks
   - Configure log levels per error type

4. **Update documentation**
   - Document error codes in prospec/ai-knowledge
   - Add usage examples for developers
   - Update API documentation
```

---

### 5. Risk Assessment

Use a table to list risks, impacts, and mitigation strategies:

```markdown
## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk description] | [High/Medium/Low] | [Mitigation strategy] |
```

**Example:**

```markdown
## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing error handling | High | Implement gradual migration, maintain backward compatibility |
| Performance overhead | Low | Optimize error handler, benchmark critical paths |
| Incomplete error coverage | Medium | Conduct thorough code review, add integration tests |
```

---

## File Length Guidelines

- Keep under **120 lines**
- Ideal number of Implementation Steps: 4-8
- If steps exceed 10, consider splitting into multiple Stories

---

## Reference Information

- Project name: `portfolio`
- AI Knowledge path: `prospec/ai-knowledge`
- Constitution file: `prospec/CONSTITUTION.md`


---

## Reference: Delta Spec Format

# Delta Spec Format Reference

This document defines the expected format for `delta-spec.md`, used by the **prospec-plan** Skill.

---

## Purpose

`delta-spec.md` describes requirement deltas using ADDED/MODIFIED/REMOVED categories to track requirement evolution.

---

## REQ ID Naming Convention

```
REQ-{MODULE}-{NUMBER}
```

- `{MODULE}`: Module name in uppercase, hyphen-separated (e.g., `AUTH`, `API-MIDDLEWARE`, `ERROR-HANDLER`)
- `{NUMBER}`: Three-digit sequential number (e.g., `001`, `002`, `003`)

**Examples:**
- `REQ-AUTH-001`
- `REQ-API-MIDDLEWARE-001`
- `REQ-ERROR-HANDLER-002`

---

## Standard Format

### 1. ADDED - New Requirements

New requirements with full details:

```markdown
## ADDED

### REQ-{MODULE}-{NUMBER}: [Requirement title]

**Feature:** {feature-slug}
**Story:** US-{N}

**Description:**
[Detailed description of the requirement]

**Acceptance Criteria:**
1. [Specific verifiable condition 1]
2. [Specific verifiable condition 2]
3. [Specific verifiable condition 3]

**Priority:** [High/Medium/Low]

---
```

> **Feature** routes this REQ to `specs/features/{feature-slug}.md` during archive Spec Sync.
> **Story** links this REQ to the User Story in proposal.md it implements.

**Example:**

```markdown
## ADDED

### REQ-ERROR-HANDLER-001: Centralized Error Types

**Feature:** error-handling
**Story:** US-1

**Description:**
Define a set of standard error types that can be used across all modules in portfolio. Each error type should have a unique error code and HTTP status mapping.

**Acceptance Criteria:**
1. Error types include ValidationError, NotFoundError, UnauthorizedError, ServerError
2. Each error type has a unique error code following the convention in prospec/CONSTITUTION.md
3. Error codes map to appropriate HTTP status codes (400, 401, 404, 500, etc.)

**Priority:** High

---

### REQ-ERROR-HANDLER-002: Error Response Formatter

**Feature:** error-handling
**Story:** US-1

**Description:**
Implement a formatter that converts errors into standardized JSON responses for API endpoints.

**Acceptance Criteria:**
1. Response includes error code, message, and timestamp
2. Stack traces are excluded from production responses
3. Supports localization for error messages

**Priority:** Medium

---
```

---

### 2. MODIFIED - Changed Requirements

Modified requirements showing before/after comparison:

```markdown
## MODIFIED

### REQ-{MODULE}-{NUMBER}: [Requirement title]

**Feature:** {feature-slug}
**Story:** US-{N}

**Before:**
[Original requirement description or condition]

**After:**
[Updated requirement description or condition]

**Reason:**
[Why this modification was needed]

**Priority:** [High/Medium/Low]

---
```

**Example:**

```markdown
## MODIFIED

### REQ-API-MIDDLEWARE-003: Error Logging

**Feature:** error-handling
**Story:** US-2

**Before:**
Log all errors to console with full stack traces.

**After:**
Log errors to the logger module with configurable log levels. Stack traces are only logged in development mode.

**Reason:**
Align with the logging strategy defined in prospec/CONSTITUTION.md and improve production security.

**Priority:** Medium

---
```

---

### 3. REMOVED - Removed Requirements

Removed requirements with rationale:

```markdown
## REMOVED

### REQ-{MODULE}-{NUMBER}: [Requirement title]

**Reason:**
[Why this requirement was removed]

---
```

**Example:**

```markdown
## REMOVED

### REQ-ERROR-HANDLER-004: Email Notification on Errors

**Reason:**
Out of scope for this story. Email notification will be handled by a separate monitoring module in a future story.

---
```

---

## File Length Guidelines

- Keep under **100 lines**
- If deltas exceed 10 requirements, consider splitting into multiple Stories

---

## Reference Information

- Project name: `portfolio`
- AI Knowledge path: `prospec/ai-knowledge`
- Constitution file: `prospec/CONSTITUTION.md`
