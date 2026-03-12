---
name: prospec-knowledge-generate
description: "Generate AI Knowledge | 生成 AI Knowledge - Read raw-scan.md, analyze project structure, autonomously decide module boundaries, and produce Recipe-First module READMEs and index. Triggers: knowledge, generate knowledge, analyze project, module split, 生成知識, 分析專案, 模組切割"
---

# Prospec Knowledge Generate Skill

## Activation

When triggered, briefly describe:
- That you'll read raw-scan.md to understand the project structure
- You'll autonomously decide module boundaries using the configured granularity strategy
- Each module gets exactly **one README.md** in Recipe-First format (≤100 lines)
- You'll populate _index.md (with Loading Rules) and _conventions.md

## Startup Loading

1. Read `prospec/ai-knowledge/raw-scan.md` — **must exist**, otherwise stop and prompt `prospec knowledge init`
2. Read `prospec/ai-knowledge/_index.md` — if exists
3. Read `prospec/ai-knowledge/_conventions.md` — if exists
4. Read `prospec/CONSTITUTION.md` — if exists
5. Read `.prospec.yaml` → check `knowledge.strategy` (auto|architecture|domain|package) and `knowledge.token_budget`

## Prerequisite

Run `prospec knowledge init` first to generate `raw-scan.md` and empty scaffolding.

## Token Budget

All generated knowledge must respect these limits (configurable via `.prospec.yaml`):

| Layer | Content | Default Budget |
|-------|---------|---------------|
| L0 | `_index.md` + `_conventions.md` | ≤ 1,500 tokens total |
| L1 | Each module `README.md` | ≤ 400 tokens / ≤ 100 lines per module |
| L2 | Source code (not generated) | On-demand, no limit |

**Why budgets matter:** AI agents load L0 on every task. Bloated L0 wastes tokens on irrelevant context. L1 is loaded per-module — concise READMEs mean more modules fit in context.

## Core Workflow

### Step 1: Analyze Project Type

Identify project type from raw-scan.md:

| Indicator | CLI Tool | Backend API | SPA Frontend | Mobile App | Monorepo |
|-----------|----------|-------------|--------------|------------|----------|
| Entry | bin/, CLI entry | server.ts, app.ts | main.ts, App.tsx | App.tsx, main.dart | packages/ |
| Dirs | commands/, cli/ | routes/, controllers/ | components/, pages/ | screens/, navigation/ | packages/, apps/ |
| Framework | commander, yargs | express, fastify, django | react, vue, angular | react-native, flutter | turborepo, nx |
| Config | — | — | vite.config, next.config | app.json, pubspec.yaml | workspace config |

The table is a reference only — actual splitting should follow the project's real structure. A project may be a **hybrid** (e.g., full-stack with both backend API and frontend).

### Step 2: Determine Granularity Strategy

Read `.prospec.yaml` → `knowledge.strategy` and apply:

| Strategy | When to Use | Module = |
|----------|------------|----------|
| `architecture` | CLI tools, libraries with clear layer structure | Top-level `src/` directory (e.g., `commands/`, `lib/`, `services/`) |
| `domain` | Frontend apps, feature-organized projects | Business domain inferred from routes/components/pages naming |
| `package` | Monorepos, multi-package workspaces | Each workspace package (from pnpm-workspace.yaml, turbo.json, etc.) |
| `auto` (default) | Unknown or new projects | Try package → domain → architecture; pick first with ≥2 modules |

**After determining strategy, tell the user:**
> "Detected: [project type] ([framework]). Strategy: [strategy]. Modules: [count] ([list])."

### Step 3: Decide Module Boundaries

Apply the chosen strategy to split the project into modules. Guidelines:

- **Minimum**: 2 modules (even small projects have distinct responsibilities)
- **Maximum**: ~15 modules (more means too fine-grained; consider merging)
- **Merge**: Small directories with <3 files into their parent module
- **Split**: Large modules with >30 files into sub-domains if clear boundaries exist
- Each module must have a clear, distinct responsibility

### Step 4: Create Module README.md (Recipe-First Format)

For each module, generate **exactly one file**: `prospec/ai-knowledge/modules/{module}/README.md`

**Recipe-First structure** (each section concise, total ≤100 lines):

```markdown
# {module_name}

> One-line description of what this module does

<!-- prospec:auto-start -->

## Key Files

| File | Purpose |
|------|---------|
| `path/to/file.ts` | Brief purpose |

(Top 10 most important files only)

## Public API

- `functionName()` — what it does (1-line)
- `ClassName` — what it does (1-line)

(Signature + 1-line description. Max 8 entries. Agent reads source (L2) for full API.)

## Dependencies

- **depends_on**: `module-a` (why), `module-b` (why)
- **used_by**: `module-c`, `module-d`

## Modification Guide

When changing this module:
1. [Step-by-step guidance for common modifications]
2. [What to update together]

## Ripple Effects

Changes here affect:
- [What breaks or needs updating in other modules]

## Pitfalls

- [Common mistakes when modifying this module]
- [Non-obvious constraints or gotchas]

<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- prospec:user-end -->
```

**Key principles:**
- **No api-surface.md, dependencies.md, or patterns.md** — all information consolidated into README.md
- **Modification Guide > API Reference** — tell agents HOW to change, not just WHAT exists
- **Ripple Effects** — prevent agents from making isolated changes that break other modules
- **Pitfalls** — capture tribal knowledge that prevents repeated mistakes

### Step 5: Populate _index.md

Fill module table within `prospec:auto-start/end` markers using new format:

```
| Module | Keywords | Status | Description | Rationale | Depends On |
```

- **Rationale**: Why this module exists as a separate unit (1 sentence)
- **Status**: Active / Deprecated / New

Also populate the **Loading Rules** section at the bottom:

```markdown
## Loading Rules

| Layer | Content | When to Load | Budget |
|-------|---------|-------------|--------|
| L0 | _index.md + _conventions.md | Always (every task) | ≤ {l0_max} tokens |
| L1 | modules/{name}/README.md | When working on related module | ≤ {l1_per_module} tokens/module |
| L2 | Source code files | When implementation details needed | On-demand |

**Principles:**
- L0 is loaded on every task — keep it a navigation map, not a reference manual
- L1 is loaded per-module — only load modules relevant to current task
- L2 is never pre-loaded — agent reads source files when needed
- Never duplicate L2 content in L1 — README points to source, doesn't copy it
```

### Step 6: Populate _conventions.md

Naming conventions, project-specific patterns, directory conventions, import ordering rules.

### Step 7: Quality Check

- Each module has clear responsibility boundaries
- No circular dependencies between modules
- **Each module README ≤ 100 lines** (check and trim if exceeded)
- README contains all Recipe-First sections (Key Files, Public API, Dependencies, Modification Guide, Ripple Effects, Pitfalls)
- _index.md has Rationale column and Loading Rules section
- **L0 total (_index.md + _conventions.md) ≤ 1,500 tokens** (estimate ~4 chars/token)
- All `prospec:user-start/end` content preserved
- Strategy matches project structure (auto resolved correctly)

## NEVER

- **NEVER** overwrite content between `prospec:user-start/end` markers — these are user notes, always preserve
- **NEVER** start without raw-scan.md — prompt user to run `prospec knowledge init` first
- **NEVER** create circular module dependencies — module dependency graph must be a DAG
- **NEVER** put all files in a single module — even small projects need 2-3 responsibility modules minimum
- **NEVER** ignore Tech Stack info from raw-scan.md — it affects module splitting strategy
- **NEVER** write outdated file paths in READMEs — all paths must come from raw-scan.md real data
- **NEVER** generate api-surface.md, dependencies.md, or patterns.md — all info goes in README.md only
- **NEVER** exceed 100 lines per module README — trim to essential information; agent uses L2 (source) for details
- **NEVER** duplicate source code in README — use function signatures and 1-line descriptions; the README is a map, not a copy

## Error Handling

| Scenario | Action |
|----------|--------|
| raw-scan.md missing | Stop, prompt `prospec knowledge init` |
| raw-scan.md incomplete | List missing sections, suggest re-running init or manual completion |
| Module README already exists | Only overwrite auto sections, preserve user sections |
| Strategy produces <2 modules | Fall back to `architecture` strategy |
| Module README exceeds 100 lines | Trim Key Files and Public API sections; keep Modification Guide and Pitfalls intact |
| Ambiguous project type | Ask user to clarify, or treat as hybrid |


---

## Reference: Knowledge Format

# AI Knowledge Format Reference

This document describes the AI Knowledge format and usage patterns, referenced by all Skills.

---

## AI Knowledge Structure

```
prospec/ai-knowledge/
├── _index.md                    # Overview: module list, keyword index, available files
├── _conventions.md              # Project-wide coding conventions
├── raw-scan.md                  # CLI scan data (input for knowledge generation)
└── modules/
    ├── {module-1}/
    │   ├── README.md            # Overview: responsibilities, design decisions
    │   ├── api-surface.md       # Public API: export signatures, types
    │   ├── dependencies.md      # Dependency analysis: import graph, packages
    │   └── patterns.md          # Code patterns: error handling, naming
    ├── {module-2}/
    │   ├── README.md
    │   ├── api-surface.md
    │   └── dependencies.md
    └── {module-3}/
        └── README.md
```

**Note:** Not all modules need all file types. Check `_index.md` Files column for available files per module.

---

## 1. `_index.md` Format

### Purpose

Provides a module overview and keyword index for the project, enabling quick identification of relevant modules.

### Standard Format

```markdown
# portfolio - AI Knowledge Index

## Modules

| Module | Keywords | Status | Description | Files | Depends On |
|--------|----------|--------|-------------|-------|------------|
| [module-1] | keyword1, keyword2 | Active | [Brief description] | readme, api-surface, dependencies, patterns | - |
| [module-2] | keyword3, keyword4 | Active | [Brief description] | readme, api-surface | module-1 |
| [module-3] | keyword5, keyword6 | Deprecated | [Brief description] | readme | module-1, module-2 |
```

### Field Descriptions

- **Module:** Module name (links to corresponding README.md)
- **Keywords:** Tags for keyword matching (comma-separated)
- **Status:** Module status (Active, Deprecated, Planned)
- **Description:** Brief description of module functionality
- **Files:** Available knowledge files for this module (comma-separated: readme, api-surface, dependencies, patterns)
- **Depends On:** Other modules this depends on (comma-separated)

---

## 2. Module Knowledge Files

Each module can have multiple knowledge files. The `README.md` is always present; others are generated based on project type detection or `.prospec.yaml` `knowledge.files` config.

### Base Files (all project types)

| File | Purpose | When to Load |
|------|---------|-------------|
| `README.md` | Overview, responsibilities, design decisions | Always — start here |
| `api-surface.md` | Public functions, classes, types with signatures | When calling or extending module APIs |
| `dependencies.md` | Import graph, third-party packages, reverse deps | When assessing change impact |
| `patterns.md` | Error handling, naming, idioms specific to module | When writing new code in the module |

### Project-Type-Specific Files (auto-detected)

| File | Project Type | Purpose | When to Load |
|------|-------------|---------|-------------|
| `endpoints.md` | Backend API | HTTP/GraphQL routes, request/response schemas | When working with API endpoints |
| `components.md` | Frontend SPA | Component props, events, hooks, state stores | When composing or extending UI |
| `screens.md` | Mobile App | Screen navigation, native bridges, platform diffs | When building screen flows |

### 2a. `modules/{module}/README.md` Format

#### Purpose

Provides detailed documentation for a single module, including overview, file listing, API, and internal notes.

### Standard Format

```markdown
# Module: {module-name}

## Overview

[1-2 paragraphs describing the module's functionality, purpose, and design principles]

---

## Key Files

- **src/{module}/index.ts**: [File purpose]
- **src/{module}/core.ts**: [File purpose]
- **src/{module}/utils.ts**: [File purpose]

---

## Public API

### Function: functionName(param1, param2)

**Description:** [Functionality description]

**Parameters:**
- `param1` (Type): [Parameter description]
- `param2` (Type): [Parameter description]

**Returns:** (Type) [Return value description]

**Example:**
```javascript
// Usage example
const result = functionName(value1, value2);
```

---

### Class: ClassName

**Description:** [Class description]

**Methods:**
- `method1(param)`: [Method description]
- `method2(param)`: [Method description]

**Example:**
```javascript
// Usage example
const instance = new ClassName();
instance.method1(value);
```

---

## Internal Notes

### Design Decisions

- [Design decision 1]
- [Design decision 2]

### Known Issues

- [Known issue 1]
- [Known issue 2]

### Future Improvements

- [Future improvement 1]
- [Future improvement 2]
```

---

## 3. Content Markers

AI Knowledge uses special markers to distinguish auto-generated and manually maintained content:

### Auto-Generated Content

```markdown
<!-- prospec:auto-start -->
[Auto-generated content, will be overwritten by tools]
<!-- prospec:auto-end -->
```

### User-Maintained Content

```markdown
<!-- prospec:user-start -->
[User manually maintained content, will not be overwritten by tools]
<!-- prospec:user-end -->
```

---

## 4. Progressive Disclosure Usage

**Load AI Knowledge progressively — avoid loading all files at once:**

### Step 1: Read _index.md

Before starting any Story or task, read `prospec/ai-knowledge/_index.md`:

- Understand the project's overall architecture
- Quickly locate relevant modules via keyword matching
- Check the **Files** column to know what knowledge is available per module
- Confirm module dependency relationships

### Step 2: Load Module Knowledge On Demand

Based on your task type, choose the right knowledge file:

| Task Type | Load First | Then If Needed |
|-----------|-----------|----------------|
| Understanding a module | `README.md` | — |
| Calling module APIs | `api-surface.md` | `README.md` for context |
| Assessing change impact | `dependencies.md` | `README.md` for overview |
| Writing new code | `patterns.md` | `api-surface.md` for interfaces |
| Working with API routes | `endpoints.md` | `api-surface.md` for service interfaces |
| Building UI components | `components.md` | `patterns.md` for conventions |
| Implementing screen flow | `screens.md` | `components.md` for shared widgets |
| Full module deep-dive | `README.md` | all available files |

Examples:
- Working on `error-handler` API integration → read `prospec/ai-knowledge/modules/error-handler/api-surface.md`
- Adding new REST endpoint → read `prospec/ai-knowledge/modules/api/endpoints.md`
- Building new page component → read `prospec/ai-knowledge/modules/pages/components.md`
- Refactoring `api-middleware` → read `prospec/ai-knowledge/modules/api-middleware/dependencies.md` first

### Step 3: Avoid Over-Loading

**Do not read all module files at once**, as this causes:
- Context overload (token waste)
- Judgment interference (irrelevant information)

Start with the most specific file for your task. Load additional files only when the first doesn't answer your question.

---

## Example Usage Flow

### Scenario: Implementing a "Unified Error Handling" Story

1. **Read _index.md:**
   - Discover relevant modules: `error-handler`, `api-middleware`, `logger`
   - Check Files column: `error-handler` has `readme, api-surface, patterns`

2. **Execute Tasks:**
   - Task 1: Implement `BaseError` → Read `prospec/ai-knowledge/modules/error-handler/patterns.md` (error patterns) + `api-surface.md` (existing exports)
   - Task 2: Integrate API Middleware → Read `prospec/ai-knowledge/modules/api-middleware/dependencies.md` (impact analysis)
   - Task 3: Update Logger → Read `prospec/ai-knowledge/modules/logger/api-surface.md` (current interface)

3. **Avoid:**
   - Reading all module files at once (causes context overload)
   - Loading `dependencies.md` when you only need API signatures

---

## Reference Information

- Project name: `portfolio`
- Tech stack: `javascript` + ``
- AI Knowledge path: `prospec/ai-knowledge`
- Constitution file: `prospec/CONSTITUTION.md`


---

## Reference: Knowledge Generate Format

# Knowledge Generate Format Reference

This document defines the output file format specifications for the `/prospec-knowledge-generate` Skill.

---

## 1. modules/{module}/README.md Format

### Required Sections

Each module README must include the following sections, using `prospec:auto-start/end` and `prospec:user-start/end` markers:

```markdown
# [Module Name]

> [One-sentence description of module responsibility]

<!-- prospec:auto-start -->
## Overview

[2-3 paragraphs describing:]
- The module's role and position in the system
- Core design principles
- Primary use cases

## Responsibilities

- [Responsibility 1: Specific description of what this module handles]
- [Responsibility 2]
- [Responsibility 3]

## Key Files

| File | Purpose |
|------|---------|
| `[relative path]` | [Specific purpose of this file] |
| `[relative path]` | [Specific purpose of this file] |

## Public Interface

### [Function/Class Name]

- **Signature**: `functionName(param: Type): ReturnType`
- **Purpose**: [Brief description]

### [Function/Class Name]

- **Signature**: `className.method(param: Type): ReturnType`
- **Purpose**: [Brief description]

## Dependencies

- **Depends on**: [List modules this module imports from]
- **Depended by**: [List modules that import from this module]

## Design Decisions

- **[Decision title]**: [What was chosen] — [Why this choice was made]
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- Add manual notes, memos, TODOs here. This section will not be overwritten. -->
<!-- prospec:user-end -->
```

### Format Rules

1. **Module name**: Use directory name, e.g., `cli`, `services`, `lib`
2. **Responsibilities**: 3-7 items, each starting with a verb (e.g., "Handle", "Manage", "Provide")
3. **Key files**: List only main files (5-15), no need to list everything
4. **Public interface**: Only list exported functions/classes, not internal implementations
5. **Dependencies**: Use module names, not file paths

---

## 2. modules/{module}/api-surface.md Format

### Purpose

Documents all public exports (functions, classes, types, constants) with exact type signatures.

### Required Sections

```markdown
# [Module Name] — API Surface

> Public exports and type signatures for the [module-name] module.

<!-- prospec:auto-start -->
## Exported Functions

### `functionName(param1: Type, param2: Type): ReturnType`

- **Purpose**: [One-line description]
- **Parameters**:
  - `param1` — [Description]
  - `param2` — [Description]
- **Returns**: [Description]
- **Throws**: [Error conditions, if any]

## Exported Classes

### `ClassName`

| Method | Signature | Description |
|--------|-----------|-------------|
| `method1` | `(param: Type): ReturnType` | [Description] |

## Exported Types

| Type | Definition | Description |
|------|-----------|-------------|
| `TypeName` | `{ field: string; ... }` | [Purpose] |

## Exported Constants

| Constant | Type | Value/Description |
|----------|------|-------------------|
| `CONST_NAME` | `Type` | [Description] |
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- prospec:user-end -->
```

### Format Rules

1. Only list **exported** items — skip internal/private
2. Use **exact type signatures** from source code
3. Group by kind, sort alphabetically within each group
4. Omit empty sections

---

## 3. modules/{module}/dependencies.md Format

### Purpose

Documents import graph (internal modules and external packages) for impact analysis.

### Required Sections

```markdown
# [Module Name] — Dependencies

> Import graph and external package usage for the [module-name] module.

<!-- prospec:auto-start -->
## Internal Dependencies (imports from other modules)

| Module | Files Imported | Purpose |
|--------|---------------|---------|
| `types` | `config.ts`, `errors.ts` | Schema types and error classes |

## Internal Dependents (modules that import from this one)

| Module | What They Import | Purpose |
|--------|-----------------|---------|
| `cli` | `execute()` | Command handler entry point |

## External Packages

| Package | Version | Usage | Files |
|---------|---------|-------|-------|
| `zod` | `^3.x` | Schema validation | `config.ts` |
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- prospec:user-end -->
```

### Format Rules

1. Internal deps: group by module, list specific imported files
2. Include **reverse dependencies** (who depends on this module)
3. External packages: include version range from package.json
4. Omit empty sections

---

## 4. modules/{module}/patterns.md Format

### Purpose

Documents recurring code patterns, conventions, and idioms specific to a module.

### Required Sections

```markdown
# [Module Name] — Patterns

> Code patterns, conventions, and idioms for the [module-name] module.

<!-- prospec:auto-start -->
## Error Handling Pattern

[Description + code example from actual source]

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files | [pattern] | `user-service.ts` |

## Common Idioms

### [Idiom Name]

[Description + code example]

## File Organization

[Directory structure description]

## Testing Patterns

[How this module is tested]
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- prospec:user-end -->
```

### Format Rules

1. Use **real code examples** from actual source — don't invent
2. Focus on **module-specific** patterns (project-wide goes in `_conventions.md`)
3. Keep examples concise (5-15 lines)
4. Omit empty sections

---

## 5. modules/{module}/endpoints.md Format (Backend API)

### Purpose

Documents HTTP/GraphQL/gRPC endpoints exposed by the module. Auto-selected for Backend API projects.

### Required Sections

```markdown
# [Module Name] — Endpoints

> API endpoints and request/response contracts for the [module-name] module.

<!-- prospec:auto-start -->
## REST Endpoints

### `GET /api/v1/resources`

- **Purpose**: [Description]
- **Auth**: [Required / Public]
- **Query params**: [Parameters]
- **Response** `200`: [Schema example]
- **Errors**: [Error codes]

### `POST /api/v1/resources`

- **Purpose**: [Description]
- **Auth**: [Required]
- **Request body**: [Schema example]
- **Response** `201`: [Schema example]

## Middleware / Guards

| Middleware | Applied To | Purpose |
|-----------|-----------|---------|
| `authGuard` | All `/api/*` | JWT validation |
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- prospec:user-end -->
```

### Format Rules

1. Group by HTTP method or operation type (REST, GraphQL, WebSocket)
2. Include **auth requirements** for every endpoint
3. Show request/response as JSON examples
4. List error codes with meaning

---

## 6. modules/{module}/components.md Format (Frontend)

### Purpose

Documents UI components, props, events, slots, and hooks. Auto-selected for Frontend SPA/SSR projects.

### Required Sections

```markdown
# [Module Name] — Components

> UI components, props, events, and composition patterns for the [module-name] module.

<!-- prospec:auto-start -->
## Components

### `ComponentName`

- **Purpose**: [Description]
- **File**: `src/components/ComponentName.tsx`

**Props**:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | — | Page title |

**Events / Emits**:

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ value: string }` | Input changed |

## Hooks / Composables

### `useFeatureName(options): Result`

- **Purpose**: [Description]
- **Returns**: [Reactive state / methods]

## State Management

### Store: `featureStore`

| Action | Signature | Description |
|--------|-----------|-------------|
| `fetchItems` | `() => Promise<void>` | Load items |
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- prospec:user-end -->
```

### Format Rules

1. Document all **public** components — skip internal helpers
2. Props table is **required** for every component
3. Use the **framework's actual syntax** (React/Vue/Angular/Svelte)
4. Include hooks/composables in the module's public API

---

## 7. modules/{module}/screens.md Format (Mobile App)

### Purpose

Documents screens, navigation flow, native bridge interfaces. Auto-selected for Mobile App projects.

### Required Sections

```markdown
# [Module Name] — Screens

> Screen definitions, navigation flow, and platform behavior for the [module-name] module.

<!-- prospec:auto-start -->
## Screens

### `ScreenName`

- **Purpose**: [Description]
- **Platform**: [Both / iOS only / Android only]

**Navigation Params** (received):

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `itemId` | `string` | Yes | Item to display |

**Navigation Actions** (can navigate to):

| Target | Trigger | Params Passed |
|--------|---------|--------------|
| `DetailScreen` | Tap item | `{ itemId }` |

## Navigation Graph

```
HomeScreen
  ├── ListScreen → DetailScreen
  └── ProfileScreen → SettingsScreen
```

## Native Bridge / Platform Channels

| Method | Signature | Platform | Description |
|--------|-----------|----------|-------------|
| `takePhoto` | `(options) → Promise<Photo>` | Both | Open camera |
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- prospec:user-end -->
```

### Format Rules

1. Document all **user-facing screens** — skip internal fragments
2. Navigation params are required for every screen
3. Include **navigation graph** showing full flow
4. Document **platform differences** where behavior differs

---

## 8. Project Type → File Type Auto-Detection

When `knowledge.files` is not configured, the system auto-detects project type and selects file types:

| Project Type | Base Files (always) | Extra Files |
|-------------|-------------------|------------|
| CLI Tool / Library | readme, api-surface, dependencies, patterns | — |
| Backend API | readme, api-surface, dependencies, patterns | endpoints |
| Frontend SPA / SSR | readme, api-surface, dependencies, patterns | components |
| Mobile App | readme, api-surface, dependencies, patterns | screens |
| Monorepo | readme, api-surface, dependencies, patterns | per-package |
| Hybrid (fullstack) | readme, api-surface, dependencies, patterns | endpoints + components |

---

## 9. Custom File Types

Users can add custom file type names in `.prospec.yaml`:

```yaml
knowledge:
  files:
    - readme
    - api-surface
    - dependencies
    - patterns
    - endpoints         # Built-in: Backend API
    - components        # Built-in: Frontend
    - screens           # Built-in: Mobile App
    - security          # Custom type — AI infers content
```

Built-in types: `readme`, `api-surface`, `dependencies`, `patterns`, `endpoints`, `components`, `screens`

For custom types not in the built-in list:

1. **Infer content** from the type name (e.g., `security` → security analysis, threat models)
2. **Use the same marker pattern** (`prospec:auto-start/end` + `prospec:user-start/end`)
3. **File name**: `{type-name}.md` (e.g., `security.md`)
4. **Follow the general structure**: title, purpose description, auto section, user section

---

## 10. _index.md Module Table Format

### Table Structure

```markdown
## Modules

| Module | Keywords | Status | Description | Files | Depends On |
|--------|----------|--------|-------------|-------|------------|
| [name] | [keywords] | active | [description] | readme, api-surface, ... | [dependencies] |
```

### Field Specifications

- **Module**: Module name, matching the directory name under `modules/`
- **Keywords**: 3-5 keywords, comma-separated, used for search and matching
- **Status**: `active` (in use), `deprecated` (phased out), `planned` (upcoming)
- **Description**: One-sentence description, max 50 words
- **Files**: Comma-separated list of available knowledge files for this module (e.g., `readme, api-surface, dependencies`)
- **Depends On**: Names of other depended-upon modules, use `—` if none

### Sorting Rules

Modules are sorted by architecture layer (bottom to top):
1. types / type definitions
2. lib / shared utilities
3. services / business logic
4. cli / command interface
5. templates / templates

---

## 11. _conventions.md Format

```markdown
# Coding Conventions

> portfolio coding conventions and best practices

<!-- prospec:auto-start -->
## Naming Conventions

- **Files**: [Convention, e.g., kebab-case]
- **Variables/Functions**: [Convention, e.g., camelCase]
- **Classes/Interfaces**: [Convention, e.g., PascalCase]
- **Constants**: [Convention, e.g., UPPER_SNAKE_CASE]

## Project Patterns

### [Pattern name, e.g., Error Handling]
[Describe how this project handles this pattern]

### [Pattern name, e.g., Logging]
[Description]

## Import Ordering

1. Node.js built-in modules
2. Third-party packages
3. Project internal modules (absolute paths)
4. Relative path modules

## Testing Conventions

- Test file location: [e.g., tests/unit/]
- Naming format: [e.g., *.test.ts]
- Testing framework: [e.g., vitest]
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- Add team-specific conventions, exceptions, etc. here -->
<!-- prospec:user-end -->
```

---

## 12. Re-run Safety Rules

| Operation | prospec:auto-start/end | prospec:user-start/end |
|-----------|----------------------|----------------------|
| First generation | Populate content | Leave empty (with comment prompt) |
| Re-run generation | Overwrite and update | Preserve as-is |

**Implementation**: Read existing file → Extract `prospec:user-start/end` content → Regenerate `prospec:auto-start/end` → Merge and write back.


---

## Reference: API Surface Format

# API Surface Format Reference

This document defines the output format for `modules/{module}/api-surface.md` files.

---

## modules/{module}/api-surface.md Format

### Purpose

Documents the module's public API surface — all public functions, classes, types, and constants. This file enables AI agents to understand **what a module offers** without reading implementation details.

### Language Adaptation

Adapt section names and signature syntax to the project's language:

| Concept | TypeScript | Python | Go | Swift/Kotlin | Dart |
|---------|-----------|--------|-----|-------------|------|
| Public function | `export function` | `def` in `__all__` | Capitalized name | `public func` | top-level / `export` |
| Public class | `export class` | `class` in `__all__` | Exported struct | `public class` | `class` |
| Public type | `export type/interface` | `TypeAlias`, `Protocol` | Exported type | `protocol` | `typedef` |
| Constant | `export const` | Module-level UPPER | Exported `const` | `static let` | `const` |

### Standard Format

```markdown
# [Module Name] — API Surface

> Public API and type signatures for the [module-name] module.

<!-- prospec:auto-start -->
## Public Functions

### `functionName(param1: Type, param2: Type): ReturnType`

- **Purpose**: [One-line description]
- **Parameters**:
  - `param1` — [Description]
  - `param2` — [Description]
- **Returns**: [Description of return value]
- **Throws/Raises**: [Error conditions, if any]

### `anotherFunction(options: OptionsType): Promise<Result>`

- **Purpose**: [One-line description]
- **Parameters**:
  - `options` — [Description]
- **Returns**: [Description]

## Public Classes

### `ClassName`

**Constructor**: `new ClassName(config: ConfigType)` / `ClassName(config)` / `ClassName.init(config:)`

| Method | Signature | Description |
|--------|-----------|-------------|
| `method1` | `(param: Type): ReturnType` | [Description] |
| `method2` | `(param: Type): Promise<Result>` | [Description] |

## Public Types / Interfaces

| Type | Definition | Description |
|------|-----------|-------------|
| `TypeName` | `{ field: string; ... }` | [Purpose] |
| `EnumName` | `'a' \| 'b' \| 'c'` | [Purpose] |

## Public Constants

| Constant | Type | Value/Description |
|----------|------|-------------------|
| `CONST_NAME` | `Type` | [Description] |

## Re-exports / Public Submodules

- `export { X } from './submodule'` — [Why re-exported]
- `from .submodule import X` — [Why exposed]
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- Add usage notes, gotchas, or deprecation notices here. -->
<!-- prospec:user-end -->
```

### Format Rules

1. **Only list public items** — skip internal/private functions (language-specific visibility rules apply)
2. **Use the project's actual signature syntax** — TypeScript types, Python type hints, Go signatures, etc.
3. **Group by kind** — functions, classes, types, constants
4. **Sort alphabetically** within each group
5. **Include docstring/JSDoc summary** if available as the Purpose field
6. **Omit empty sections** — if a module has no public classes, skip that section
7. **For dynamically-typed languages** — document parameter and return types in description if no type annotations exist


---

## Reference: Dependencies Format

# Dependencies Format Reference

This document defines the output format for `modules/{module}/dependencies.md` files.

---

## modules/{module}/dependencies.md Format

### Purpose

Documents a module's dependency relationships — both internal (other project modules) and external (third-party packages). This file enables AI agents to understand **impact analysis** and **change propagation** without tracing imports manually.

### Language Adaptation

Adapt terminology to the project's ecosystem:

| Concept | Node.js | Python | Go | Swift | Dart/Flutter |
|---------|---------|--------|-----|-------|-------------|
| Package manager | npm/pnpm/yarn | pip/poetry/uv | go modules | SPM/CocoaPods | pub |
| Import syntax | `import/require` | `import/from` | `import` | `import` | `import` |
| Standard library | `node:*` | stdlib | stdlib | Foundation | `dart:*` |
| Version file | `package.json` | `pyproject.toml` | `go.mod` | `Package.swift` | `pubspec.yaml` |

### Standard Format

```markdown
# [Module Name] — Dependencies

> Import graph and package usage for the [module-name] module.

<!-- prospec:auto-start -->
## Internal Dependencies (imports from other modules)

| Module | Files Imported | Purpose |
|--------|---------------|---------|
| `types` | `config.ts`, `errors.ts` | Schema types and error classes |
| `lib` | `template.ts`, `fs-utils.ts` | Template rendering and file operations |

## Internal Dependents (modules that import from this one)

| Module | What They Import | Purpose |
|--------|-----------------|---------|
| `cli` | `execute()` | Command handler entry point |
| `services` | `renderTemplate()` | Template generation |

## Third-Party Packages

| Package | Version | Usage | Files |
|---------|---------|-------|-------|
| `zod` | `^3.x` | Schema validation | `config.ts` |
| `commander` | `^12.x` | CLI framework | `cli/index.ts` |

## Import Graph Summary

```
[module] → types (schema definitions)
[module] → lib (utility functions)
cli → [module] (command handling)
```

## Standard Library Usage

| Module | Usage |
|--------|-------|
| `node:fs` / `os` / `fmt` | [Usage description] |
| `node:path` / `pathlib` / `path/filepath` | [Usage description] |
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- Add notes about dependency decisions, planned migrations, etc. -->
<!-- prospec:user-end -->
```

### Format Rules

1. **Internal dependencies**: Group by module, list specific files imported
2. **Internal dependents**: Show reverse dependencies — who depends on this module
3. **Third-party packages**: Include version range from the project's version/lock file
4. **Import graph summary**: ASCII art showing directional flow
5. **Omit empty sections** — if no third-party packages, skip that section
6. **Use module names** (not file paths) for internal dependencies


---

## Reference: Patterns Format

# Patterns Format Reference

This document defines the output format for `modules/{module}/patterns.md` files.

---

## modules/{module}/patterns.md Format

### Purpose

Documents recurring code patterns, conventions, and idioms specific to a module. This file enables AI agents to **write code consistent with existing patterns** rather than introducing new conventions.

### Standard Format

```markdown
# [Module Name] — Patterns

> Code patterns, conventions, and idioms for the [module-name] module.

<!-- prospec:auto-start -->
## Error Handling Pattern

[Describe how errors are handled in this module]

```[language]
// Example from actual code
try {
  const result = await riskyOperation();
} catch (error) {
  throw new SpecificError('message', 'hint');
}
```

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files | [pattern] | `user-service.ts` |
| Functions | [pattern] | `getUserById()` |
| Constants | [pattern] | `MAX_RETRY_COUNT` |

## Common Idioms

### [Idiom Name, e.g., "Options Pattern"]

[Description of the pattern and when it's used]

```[language]
// Example from actual code
```

### [Idiom Name, e.g., "Guard Clause"]

[Description]

```[language]
// Example from actual code
```

## File Organization

[How files are typically structured within this module]

```
module/
├── index.ts          # Public exports
├── core.ts           # Main logic
├── types.ts          # Module-local types
└── helpers/          # Internal utilities
```

## Testing Patterns

[How tests are written for this module]

- Test file naming: `*.test.ts`
- Test structure: [describe/it pattern, fixture usage, etc.]
- Mocking approach: [what's mocked and how]
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- Add team preferences, anti-patterns to avoid, or style notes here. -->
<!-- prospec:user-end -->
```

### Format Rules

1. **Use real code examples** — extract from actual source, don't invent
2. **Focus on module-specific patterns** — skip project-wide patterns (those go in `_conventions.md`)
3. **Include anti-patterns** if there are common mistakes to avoid
4. **Keep examples concise** — 5-15 lines max per example
5. **Omit empty sections** — if no special error handling pattern, skip it
6. **Prefer descriptive names** for patterns — "Options Pattern" not "Pattern 1"


---

## Reference: Endpoints Format

# Endpoints Format Reference

This document defines the output format for `modules/{module}/endpoints.md` files.

**Applicable project types**: Backend API, BFF (Backend-for-Frontend), Microservice

---

## modules/{module}/endpoints.md Format

### Purpose

Documents HTTP/gRPC/GraphQL endpoints exposed by the module. Enables AI agents to understand **what the API serves** — routes, methods, request/response schemas, and authentication requirements.

### Standard Format

```markdown
# [Module Name] — Endpoints

> API endpoints and request/response contracts for the [module-name] module.

<!-- prospec:auto-start -->
## REST Endpoints

### `GET /api/v1/resources`

- **Purpose**: [One-line description]
- **Auth**: [Required / Public / Role-based]
- **Query params**:
  - `page` (number, optional) — Pagination offset
  - `limit` (number, optional) — Items per page
- **Response** `200`:
  ```json
  { "data": [...], "total": 100 }
  ```
- **Errors**: `401 Unauthorized`, `403 Forbidden`

### `POST /api/v1/resources`

- **Purpose**: [One-line description]
- **Auth**: [Required]
- **Request body**:
  ```json
  { "name": "string", "type": "enum(a|b|c)" }
  ```
- **Response** `201`:
  ```json
  { "id": "uuid", "name": "string" }
  ```
- **Validation**: [Key validation rules]
- **Errors**: `400 Bad Request`, `409 Conflict`

## GraphQL Operations

### Query: `resources(filter: ResourceFilter): [Resource!]!`

- **Purpose**: [Description]
- **Auth**: [Required / Public]
- **Arguments**: [Description of filter type]

### Mutation: `createResource(input: CreateResourceInput!): Resource!`

- **Purpose**: [Description]
- **Auth**: [Required]

## Middleware / Guards

| Middleware | Applied To | Purpose |
|-----------|-----------|---------|
| `authGuard` | All `/api/*` | JWT token validation |
| `rateLimiter` | `POST /api/*` | Rate limiting (100 req/min) |

## WebSocket / SSE Channels

### `ws://host/events`

- **Purpose**: [Description]
- **Events emitted**: `resource.created`, `resource.updated`
- **Auth**: [Token in query param / header]
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- Add API versioning notes, deprecation timeline, etc. -->
<!-- prospec:user-end -->
```

### Format Rules

1. **Group by HTTP method or operation type** — REST, GraphQL, WebSocket
2. **Include auth requirements** for every endpoint
3. **Show request/response schemas** as JSON examples (not full JSON Schema)
4. **List error codes** with meaning
5. **Document middleware** that affects the module's endpoints
6. **Omit empty sections** — if no WebSocket channels, skip that section
7. **Use actual route paths** from the source code


---

## Reference: Components Format

# Components Format Reference

This document defines the output format for `modules/{module}/components.md` files.

**Applicable project types**: Frontend SPA, SSR Web App, Component Library

---

## modules/{module}/components.md Format

### Purpose

Documents UI components, their props/inputs, events/outputs, slots, and composition patterns. Enables AI agents to understand **how to use and compose components** correctly.

### Language Adaptation

| Concept | React | Vue | Angular | Svelte |
|---------|-------|-----|---------|--------|
| Props | `props: { name: Type }` | `defineProps<{}>()` | `@Input()` | `export let name` |
| Events | `onEvent` callback | `defineEmits()` | `@Output()` | `dispatch('event')` |
| Slots | `children` / render props | `<slot>` | `<ng-content>` | `<slot>` |
| State | `useState` / store | `ref()` / Pinia | Service / Signal | `$state` / store |
| Lifecycle | `useEffect` | `onMounted` | `ngOnInit` | `onMount` |

### Standard Format

```markdown
# [Module Name] — Components

> UI components, props, events, and composition patterns for the [module-name] module.

<!-- prospec:auto-start -->
## Components

### `ComponentName`

- **Purpose**: [One-line description]
- **File**: `src/components/ComponentName.tsx`

**Props**:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | — | Page title |
| `variant` | `'primary' \| 'secondary'` | No | `'primary'` | Visual variant |
| `onSubmit` | `(data: FormData) => void` | No | — | Submit callback |

**Events / Emits**:

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ value: string }` | Emitted when input changes |
| `close` | — | Emitted when modal closes |

**Slots / Children**:

| Slot | Description |
|------|-------------|
| `default` | Main content area |
| `header` | Optional header override |

**Usage Example**:

```[language]
<ComponentName title="Hello" variant="primary" @change="handleChange">
  <template #header>Custom Header</template>
  Content here
</ComponentName>
```

## Hooks / Composables

### `useFeatureName(options: Options): Result`

- **Purpose**: [Description]
- **Parameters**: [Description]
- **Returns**: [Description of reactive state / methods returned]
- **Usage**:
  ```[language]
  const { data, loading } = useFeatureName({ key: 'value' });
  ```

## State Management

### Store: `featureStore`

| State | Type | Description |
|-------|------|-------------|
| `items` | `Item[]` | List of items |
| `loading` | `boolean` | Loading state |

| Action | Signature | Description |
|--------|-----------|-------------|
| `fetchItems` | `() => Promise<void>` | Load items from API |
| `addItem` | `(item: NewItem) => void` | Add item to store |

## Route Definitions

| Route | Component | Auth | Description |
|-------|-----------|------|-------------|
| `/dashboard` | `DashboardPage` | Required | Main dashboard |
| `/settings` | `SettingsPage` | Required | User settings |
| `/login` | `LoginPage` | Public | Authentication |
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- Add component design system notes, theme variables, accessibility requirements, etc. -->
<!-- prospec:user-end -->
```

### Format Rules

1. **Document all public components** — skip internal/helper components
2. **Props table is required** for every component
3. **Use the framework's actual syntax** for examples
4. **Include hooks/composables** that are part of the module's public API
5. **Document state management** stores if the module owns them
6. **Route definitions** — only for the routes this module manages
7. **Omit empty sections** — if no slots, skip that section


---

## Reference: Screens Format

# Screens Format Reference

This document defines the output format for `modules/{module}/screens.md` files.

**Applicable project types**: Mobile App (iOS, Android, React Native, Flutter, etc.)

---

## modules/{module}/screens.md Format

### Purpose

Documents screens/pages, navigation flow, platform-specific behavior, and native bridge interfaces. Enables AI agents to understand **app navigation structure** and **platform-specific constraints**.

### Language Adaptation

| Concept | React Native | Flutter | SwiftUI | Jetpack Compose |
|---------|-------------|---------|---------|-----------------|
| Screen | Screen component | Widget (Page) | View | Composable (Screen) |
| Navigation | React Navigation | Navigator/GoRouter | NavigationStack | NavHost |
| State | useState/Redux | Provider/Riverpod | @State/@Observable | ViewModel |
| Native module | NativeModules | MethodChannel | native | Platform Channel |
| Platform check | `Platform.OS` | `Platform.isIOS` | `#if os(iOS)` | build variant |

### Standard Format

```markdown
# [Module Name] — Screens

> Screen definitions, navigation flow, and platform behavior for the [module-name] module.

<!-- prospec:auto-start -->
## Screens

### `ScreenName`

- **Purpose**: [One-line description]
- **File**: `src/screens/ScreenName.tsx`
- **Platform**: [Both / iOS only / Android only]

**Navigation Params** (received):

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `itemId` | `string` | Yes | ID of the item to display |
| `mode` | `'view' \| 'edit'` | No | Display mode (default: 'view') |

**Navigation Actions** (can navigate to):

| Target | Trigger | Params Passed |
|--------|---------|--------------|
| `DetailScreen` | Tap item | `{ itemId }` |
| `SettingsScreen` | Menu button | — |
| ← Back | Swipe / button | — |

**Platform Differences**:

| Behavior | iOS | Android |
|----------|-----|---------|
| Back gesture | Swipe from left edge | System back button |
| Status bar | Light content | Transparent |

## Navigation Graph

```
SplashScreen → (auth check)
  ├── LoginScreen → HomeScreen
  └── HomeScreen
       ├── ListScreen → DetailScreen → EditScreen
       ├── ProfileScreen → SettingsScreen
       └── SearchScreen → DetailScreen
```

## Deep Links

| Link Pattern | Target Screen | Params |
|-------------|--------------|--------|
| `app://items/:id` | DetailScreen | `{ itemId: id }` |
| `app://settings` | SettingsScreen | — |

## Native Bridge / Platform Channels

### `CameraModule`

| Method | Signature | Platform | Description |
|--------|-----------|----------|-------------|
| `takePhoto` | `(options: PhotoOptions) → Promise<Photo>` | Both | Open camera |
| `requestPermission` | `() → Promise<boolean>` | Both | Request camera access |

### Platform-Specific APIs

| API | Platform | Usage |
|-----|----------|-------|
| HealthKit | iOS | Step counter data |
| Google Fit | Android | Step counter data |

## Gestures & Animations

| Gesture/Animation | Screen | Description |
|-------------------|--------|-------------|
| Pull to refresh | ListScreen | Reload item list |
| Swipe to delete | ListScreen | Delete item with undo |
| Hero transition | List → Detail | Shared element animation |
<!-- prospec:auto-end -->

<!-- prospec:user-start -->
<!-- Add accessibility requirements, animation specs, design tokens, etc. -->
<!-- prospec:user-end -->
```

### Format Rules

1. **Document all user-facing screens** — skip internal fragments/widgets
2. **Navigation params are required** for every screen
3. **Navigation graph** — show the full flow, including conditional branches (auth, onboarding)
4. **Platform differences** — document only where behavior actually differs
5. **Native bridge** — document all methods exposed to the JS/Dart layer
6. **Deep links** — document all registered URL patterns
7. **Omit empty sections** — if no native bridge, skip that section
