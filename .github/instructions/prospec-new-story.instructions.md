---
name: prospec-new-story
description: "New Story | 新增故事 - Create change requests by guiding User Story and acceptance criteria definition. Triggers: new feature, requirement, story, I want to, change, 新功能, 需求, 我想做, 新增功能, 變更"
---

# Prospec New Story Skill

## Activation

When triggered, briefly describe:
- That you'll guide them through defining a User Story with acceptance criteria
- The interview will take 3-4 questions to converge
- A proposal.md will be created in `.prospec/changes/`

## Startup Loading

1. Read `prospec/ai-knowledge/_index.md` — identify related modules by matching proposal keywords against module `keywords` field
2. Read `prospec/CONSTITUTION.md` — prepare Constitution check
3. **MANDATORY** — Read [`references/proposal-format.md`](references/proposal-format.md) for proposal.md format specification
4. Read `/specs/capabilities/` — check existing capability specs for context

## Core Workflow

### Phase 1: Requirements Interview (3-4 questions to converge)

Collect: Background (why), Role (who), Feature (what), Value (why it matters), Constraints (limitations).

### Phase 2: Derive Change Name

Derive a kebab-case name from interview results (verb-first, 2-4 words). Confirm before proceeding.

### Phase 3: Create Scaffolding

| Scenario | Action |
|----------|--------|
| Directory doesn't exist | Create `.prospec/changes/[name]/` + `metadata.yaml`(status: story) + empty `proposal.md` |
| Already exists | Read existing files, proceed to populate |

### Phase 4: Collect INVEST User Stories

Guide the user to define one or more INVEST User Stories:

1. **Background**: 1-3 sentences on problem context
2. **User Stories**: For each story:
   - As a [specific role] / I want [feature] / So that [value]
   - **Priority**: P1 (must-have), P2 (should-have), P3 (nice-to-have)
   - **Acceptance Scenarios**: 2-5 WHEN/THEN pairs per story
   - **Independent Test**: How to verify this story in isolation
3. **Edge Cases**: Known boundary conditions and error scenarios
4. **Functional Requirements**: Numbered FR-001, FR-002... for traceability
5. **Success Criteria**: Measurable SC-001, SC-002...
6. **Related Modules**: Cross-reference proposal terms (feature names, domain concepts) against `_index.md` module keywords. List matched modules with relevance reasoning.
7. **Open Questions**: Mark `NEEDS CLARIFICATION` for ambiguities

### Phase 5: Write proposal.md

Follow `references/proposal-format.md` format with all sections from Phase 4.

### Phase 6: Constitution Check

Compare against 3+ most relevant Constitution principles:
- **PASS**: Fully aligned
- **WARN**: Partially aligned, with suggestions
- **FAIL**: Violates principle, must adjust

### Phase 7: Knowledge Quality Gate

Before finalizing, verify Knowledge awareness:

| Check Item | PASS | WARN |
|------------|------|------|
| Related Modules identified | >= 1 module matched from _index.md | No modules matched — verify _index.md coverage |
| Capability specs reviewed | Existing requirements checked for overlap | No capability specs found |
| Module keywords matched | Proposal terms found in module keywords | Manual assignment needed |

WARN items do not block — note them in Open Questions section.

### Phase 8: Summary + Next Steps

Save proposal.md, suggest:
1. `/prospec-plan` — proceed to planning
2. `/prospec-ff` — fast-forward full planning
3. Manually adjust proposal.md

## NEVER

- **NEVER** create non-kebab-case change names — all lowercase, hyphen-separated, verb-first
- **NEVER** complete a Story without Constitution check — principles must validate the proposal
- **NEVER** write implementation details in Acceptance Criteria — ACs focus on user-observable outcomes
- **NEVER** create a Story with fewer than 2 acceptance scenarios (WHEN/THEN)
- **NEVER** include technical architecture or code in proposal.md — that belongs in plan.md
- **NEVER** forget to update metadata.yaml status
- **NEVER** ask more than 4 questions at once
- **NEVER** use generic "user" as the role — be specific (developer, project manager, system admin)

## Error Handling

| Scenario | Action |
|----------|--------|
| Scaffolding creation fails | Check if .prospec.yaml exists, prompt user to confirm project root |
| Constitution FAIL | Provide adjustment suggestions, or document exception reasoning |
| Module identification unclear | Suggest returning to `/prospec-explore` or continue, deepen in Plan phase |



---

## Reference: Proposal Format

# Proposal Format Reference

This document defines the expected format for `proposal.md`, used by the **prospec-new-story** Skill.

---

## Purpose

`proposal.md` is the starting point of a Story: it captures WHY the change is needed, WHAT it delivers (as INVEST User Stories), and HOW success is measured. Each Story should be **Independent, Negotiable, Valuable, Estimable, Small, and Testable**.

---

## Standard Format

### 1. Background (Why)

Briefly explain the motivation and problem context:

```markdown
## Background

[1-3 sentences describing the problem, gap, or opportunity that motivates this change.]
```

---

### 2. User Stories

One or more INVEST-compliant User Stories, each with Priority and acceptance scenarios:

```markdown
## User Stories

### US-1: [Short title] [P1]

As a [role],
I want [feature],
So that [value].

**Acceptance Scenarios:**

- WHEN [condition], THEN [expected outcome]
- WHEN [condition], THEN [expected outcome]

**Independent Test:**
[How to verify this story works in isolation]
```

**Priority levels:** P1 (must-have), P2 (should-have), P3 (nice-to-have)

**Guidelines:**
- Each Story should be independently developable, testable, and deployable
- If a Story has more than 5 acceptance scenarios, consider splitting it
- Use concrete, measurable outcomes in WHEN/THEN (not vague descriptions)

---

### 3. Edge Cases

Known boundary conditions and error scenarios:

```markdown
## Edge Cases

- [Edge case 1]: [Expected behavior]
- [Edge case 2]: [Expected behavior]
```

---

### 4. Functional Requirements

Numbered requirements for traceability (mapped to delta-spec REQ IDs later):

```markdown
## Functional Requirements

- **FR-001**: [Requirement description]
- **FR-002**: [Requirement description]
```

---

### 5. Success Criteria

Measurable indicators of completion:

```markdown
## Success Criteria

- **SC-001**: [Measurable outcome]
- **SC-002**: [Measurable outcome]
```

---

### 6. Related Modules

List related modules based on keyword matching from `prospec/ai-knowledge/_index.md`:

```markdown
## Related Modules

- **module-name-1**: [Brief explanation of relevance]
- **module-name-2**: [Brief explanation of relevance]
```

---

### 7. Open Questions (Optional)

Items that need clarification before or during implementation:

```markdown
## Open Questions

- [ ] **NEEDS CLARIFICATION**: [Question or ambiguity]
- [ ] **NEEDS CLARIFICATION**: [Question or ambiguity]
```

---

### 8. Constitution Check

Quick verification against project principles:

```markdown
## Constitution Check

- [ ] Reviewed against `prospec/CONSTITUTION.md`
- [ ] No violations identified / Violations noted: [details]
```

---

### 9. UI Scope (Optional)

Indicate the extent of UI work in this Story. Used by the **prospec-design** Skill to determine the design workflow.

```markdown
## UI Scope

**Scope:** full | partial | none
```

| Option | When to Use |
|--------|------------|
| `full` | Story involves complete screens or pages with layout, components, and interactions |
| `partial` | Story modifies existing UI elements (e.g., adding a button, tweaking a form) |
| `none` | Story is backend-only, CLI-only, or has no visual component |

**This section is optional.** If omitted, the design Skill will assume `full` and confirm with the user. Existing proposals without this section are unaffected.

---

## File Length Guidelines

- Keep under **150 lines**
- If User Stories exceed 5, consider splitting into multiple proposals
- Each Story should have 2-5 acceptance scenarios

---

## Reference Information

- Project name: `portfolio`
- AI Knowledge path: `prospec/ai-knowledge`
- Constitution file: `prospec/CONSTITUTION.md`
