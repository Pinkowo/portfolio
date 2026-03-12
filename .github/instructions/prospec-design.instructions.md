---
name: prospec-design
description: "Design Phase | 設計階段 - Generate visual and interaction specs from proposal (Generate Mode) or extract specs from existing design tools (Extract Mode). Supports pencil/Figma/Penpot/HTML platforms. Triggers: design, UI spec, 設計, 視覺規格, 互動規格, generate design, extract design"
---

# Prospec Design Skill

## Activation

When triggered, briefly describe:
- That you'll read proposal.md and determine the design workflow mode
- Generate Mode: produce design-spec.md + interaction-spec.md from proposal
- Extract Mode: reverse-extract specs from an existing design tool via MCP
- Platform adapter will guide tool-specific operations

## Startup Loading

1. Read `.prospec/changes/[name]/proposal.md` — parse UI Scope and User Stories
2. Read `.prospec.yaml` — check `design.platform` setting (pencil|figma|penpot|html)
3. Read `prospec/CONSTITUTION.md` — prepare Constitution check
4. **MANDATORY** — Read [`references/design-spec-format.md`](references/design-spec-format.md) for design-spec.md format
5. **MANDATORY** — Read [`references/interaction-spec-format.md`](references/interaction-spec-format.md) for interaction-spec.md format
6. Load the platform adapter reference based on `design.platform`:
   - pencil → [`references/adapter-pencil.md`](references/adapter-pencil.md)
   - figma → [`references/adapter-figma.md`](references/adapter-figma.md)
   - penpot → [`references/adapter-penpot.md`](references/adapter-penpot.md)
   - html → [`references/adapter-html.md`](references/adapter-html.md)
   - If not set → default to `html` adapter (zero-dependency fallback)
   - **Do NOT load** adapters for platforms not in use — only load the one matching `design.platform`

## Core Workflow

### Phase 1: Parse Proposal + Detect Mode

1. Extract `UI Scope` from proposal.md (full/partial/none)
   - If `none` → inform user Design Phase is not needed, suggest `/prospec-tasks`
2. Detect mode:

| Condition | Mode |
|-----------|------|
| `.prospec/changes/[name]/design-spec.md` already exists | **Extract Mode** |
| Design tool has existing design for this Story (check via adapter) | **Extract Mode** |
| Otherwise | **Generate Mode** |

3. Confirm detected mode with user before proceeding.

### Phase 2a: Generate Mode

Produce design specs from proposal.md:

1. **Visual Identity** — First check if the project has an existing design system, brand guidelines, or design tokens (in `_conventions.md`, `design-spec.md` from prior changes, or project CSS variables). Extend existing patterns rather than creating from scratch. Then define color palette, typography, spacing scale, visual style based on proposal requirements and project conventions
2. **Components** — For each UI element in the proposal:
   - Define layout structure (flex/grid, dimensions)
   - Define all visual states (default, hover, active, disabled, loading, error)
   - Assign design tokens
3. **Interaction Flows** — For each User Story:
   - Define screen states and transitions
   - Write trigger → action flow sequences
   - Document gestures and micro-interactions
4. **Responsive Strategy** — Define breakpoints and layout adaptations

Write `design-spec.md` and `interaction-spec.md` following their format references.

### Phase 2b: Extract Mode

Reverse-extract specs from existing design:

1. **Read design** — Use adapter's Implement Phase guidelines to read design tool via MCP
2. **Map to spec structure** — Convert tool-specific data to design-spec.md format:
   - Extract colors, typography, spacing → Visual Identity
   - Extract component structure, states → Components
   - Infer responsive rules → Responsive Strategy
3. **Identify gaps** — Mark unclear design intent with `[NEEDS CLARIFICATION]`
4. **Generate interaction-spec.md** — Infer interaction flows from design structure; mark uncertain transitions with `[NEEDS CLARIFICATION]`
5. **User review** — Present extracted specs for user validation, resolve `[NEEDS CLARIFICATION]` items

### Phase 3: Platform Execution

Follow the loaded adapter's **Design Phase** guidelines:

| Platform | Key Actions |
|----------|------------|
| pencil | `batch_design()` to create components, `set_variables()` for design tokens |
| figma | Generate HTML prototype, push via `html-to-figma` MCP |
| penpot | Use Penpot API to create design components |
| html | Output HTML + CSS prototype to `design.output_dir` |

Skip this phase if:
- Generate Mode and user only wants spec documents (no design tool output)
- Platform is not configured

### Phase 4: Design Verification

Validate the design output:

1. **Structure check** — Verify design-spec.md has all required sections (Visual Identity, Components, Responsive Strategy)
2. **Completeness check** — Verify every component in proposal's UI scope has a corresponding entry
3. **Visual check** (if design tool used) — Use adapter's Verify Phase guidelines:
   - pencil: `get_screenshot()` to capture and review
   - figma: Compare Figma nodes with spec
   - html: Open prototype in browser
4. **No `[NEEDS CLARIFICATION]` remaining** — All items must be resolved

### Phase 5: Summary + Next Steps

Display completion summary:
- Mode used (Generate/Extract)
- Files created (design-spec.md, interaction-spec.md)
- Platform artifacts (if any)
- Unresolved items (if any)

Suggest: `/prospec-plan` (if plan.md doesn't exist) or `/prospec-tasks` (if plan.md exists)

## NEVER

- **NEVER** include platform-specific references in design-spec.md — downstream Implement/Verify Skills read spec not tools; platform refs break portability
- **NEVER** skip user confirmation on detected mode — wrong mode wastes entire phase; Generate overwrites existing design, Extract on empty tool produces garbage
- **NEVER** hardcode color values without defining tokens — tokens enable consistent theming and design system reuse across components
- **NEVER** skip interaction states — incomplete states cause runtime visual bugs (missing loading/error/empty states are the #1 UI implementation gap)
- **NEVER** proceed with `ui_scope: none` — Design Phase has no value for backend-only changes; wasted tokens and user confusion
- **NEVER** generate design specs without reading the adapter reference — each platform has unique MCP tools and capabilities; blind generation produces unusable specs
- **NEVER** leave `[NEEDS CLARIFICATION]` unresolved — unresolved items propagate ambiguity to Tasks and Implement, causing inconsistent UI implementation

## Error Handling

| Scenario | Action |
|----------|--------|
| proposal.md not found | Guide user to run `/prospec-new-story` first |
| No `UI Scope` in proposal | Assume `full` and confirm with user |
| `design.platform` not in .prospec.yaml | Default to `html` adapter, inform user |
| MCP tool unavailable for platform | Fall back to `html` adapter, warn user |
| Extract Mode yields >50% `[NEEDS CLARIFICATION]` items | Suggest switching to Generate Mode — extraction source lacks sufficient design detail |



---

## Reference: Design Spec Format

# Design Spec Format Reference

This document defines the expected format for `design-spec.md`, used by the **prospec-design** Skill.

---

## Purpose

`design-spec.md` is a platform-agnostic visual design specification that captures the design intent for a Story's UI scope. It serves as both a human-readable design document and a structured reference for AI implementation.

**Important:** This document captures design *structure and intent*. During implementation, AI should read precise values (exact colors, spacing, sizes) directly from the design tool via MCP — this spec provides the blueprint, the design tool provides the measurements.

---

## Standard Format

### 1. Header

```markdown
# Design Spec: [Story Name]

> Generated from: proposal.md (ui_scope: full|partial)
> Platform: [pencil|figma|penpot|html]
> Last updated: [date]
```

---

### 2. Visual Identity

Define the overall look and feel. Use design token names where possible.

```markdown
## Visual Identity

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| --color-primary | #3B82F6 | Primary actions, links |
| --color-surface | #FFFFFF | Card backgrounds |
| --color-text | #1F2937 | Body text |

### Typography

| Token | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| --font-heading | Inter | 24px | 700 | Page headings |
| --font-body | Inter | 16px | 400 | Body text |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| --space-xs | 4px | Inline element gaps |
| --space-sm | 8px | Compact padding |
| --space-md | 16px | Default padding |
| --space-lg | 24px | Section spacing |

### Visual Style

- Border radius: `8px` (cards), `4px` (inputs)
- Shadow: `0 1px 3px rgba(0,0,0,0.1)` (elevation-1)
- Transition: `150ms ease-in-out` (default)
```

---

### 3. Components

Define each UI component with its structure, states, and design tokens.

```markdown
## Components

### [ComponentName]

**Layout:**
- Container: [flex/grid], [direction], [alignment]
- Dimensions: [width] x [height], [padding]

**States:**

| State | Visual Changes |
|-------|---------------|
| Default | [description] |
| Hover | [description] |
| Active | [description] |
| Disabled | [description] |
| Loading | [description] |

**Design Tokens:**

| Property | Token | Resolved Value |
|----------|-------|---------------|
| Background | --color-surface | #FFFFFF |
| Text | --color-text | #1F2937 |
| Padding | --space-md | 16px |

**Children:**
- [ChildComponent]: [brief description]
- [ChildComponent]: [brief description]
```

Repeat for each component in the UI scope.

---

### 4. Responsive Strategy

Define how the layout adapts across breakpoints.

```markdown
## Responsive Strategy

### Breakpoints

| Name | Min Width | Columns | Gutter |
|------|-----------|---------|--------|
| Mobile | 0px | 1 | 16px |
| Tablet | 768px | 2 | 24px |
| Desktop | 1024px | 3+ | 32px |

### Layout Adaptations

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| [Component] | [behavior] | [behavior] | [behavior] |

### Navigation

- Mobile: [pattern, e.g., bottom tab bar]
- Tablet: [pattern, e.g., collapsible sidebar]
- Desktop: [pattern, e.g., persistent sidebar]
```

---

## Guidelines

- **No platform-specific references** — do not mention pencil nodes, Figma layers, or CSS class names
- **Use design tokens** — prefer token names over raw values where a token exists
- **Document intent** — describe *why* a design choice was made, not just *what* it is
- **Keep component granularity practical** — one section per reusable component, not per HTML element
- **States are required** — every interactive component must list its visual states


---

## Reference: Interaction Spec Format

# Interaction Spec Format Reference

This document defines the expected format for `interaction-spec.md`, used by the **prospec-design** Skill.

---

## Purpose

`interaction-spec.md` captures platform-agnostic interaction behaviors using a draft Interaction DSL. It defines how users move through screens, trigger actions, and experience state transitions.

**Note:** The DSL syntax below is a **draft** — core concepts (States, Transitions, Flows) are stable, but exact syntax may evolve in future versions.

---

## Standard Format

### 1. Header

```markdown
# Interaction Spec: [Story Name]

> Generated from: proposal.md + design-spec.md
> DSL Version: draft-1
> Last updated: [date]
```

---

### 2. Screen / Component Definitions

Define the interactive states and transitions for each screen or component.

```markdown
## Screens

### Screen: [ScreenName]

**States:**

| State | Description | Entry Condition |
|-------|-------------|-----------------|
| Empty | No data loaded | Initial visit, no items |
| Loading | Fetching data | On enter / on refresh |
| Loaded | Data displayed | Fetch success |
| Error | Fetch failed | Fetch error |

**Transitions:**

```
Empty -> Loading : on enter
Loading -> Loaded : fetch success
Loading -> Error : fetch error
Error -> Loading : retry click
Loaded -> Loading : pull refresh
```
```

---

### 3. Interaction Flows

Define user journeys as sequences of trigger → action pairs.

```markdown
## Flows

### Flow: [FlowName]

**Description:** [What the user is trying to accomplish]

**Steps:**

```
1. User taps [element]
   -> Navigate to [ScreenName]
   -> Show loading indicator

2. System fetches [data]
   -> On success: render [component] with [data]
   -> On error: show [ErrorState] with retry

3. User fills [form]
   -> Validate on blur
   -> Enable submit when valid

4. User taps submit
   -> Disable button, show spinner
   -> On success: navigate to [Screen], show toast "[message]"
   -> On error: show inline error, re-enable button
```
```

---

### 4. Gestures & Micro-interactions

```markdown
## Gestures

| Element | Gesture | Action |
|---------|---------|--------|
| List item | Swipe left | Reveal delete action |
| Card | Long press | Enter selection mode |
| Image | Pinch | Zoom in/out |

## Micro-interactions

| Trigger | Animation | Duration |
|---------|-----------|----------|
| Button tap | Scale down 0.95 → 1.0 | 100ms |
| Page enter | Fade in + slide up 8px | 200ms |
| Toast appear | Slide in from top | 150ms |
```

---

### 5. Responsive Interaction Differences

```markdown
## Responsive Interactions

| Interaction | Mobile | Desktop |
|-------------|--------|---------|
| Navigation | Swipe between tabs | Click sidebar items |
| Item selection | Tap to open | Hover preview + click |
| Context menu | Long press | Right click |
| Form submission | Sticky bottom button | Inline button |
```

---

## Guidelines

- **No platform-specific references** — describe behaviors, not implementations
- **States are exhaustive** — cover empty, loading, loaded, error, and edge states
- **Flows are user-centric** — write from the user's perspective, not the system's
- **Draft DSL** — the `->` trigger syntax is a convention, not a strict grammar; prioritize clarity over formalism
- **Keep flows focused** — one flow per user goal, 3-7 steps per flow


---

## Reference: Platform Adapter: pencil.dev

# Platform Adapter: pencil.dev

MCP-based design tool adapter for pencil.dev (.pen files).

**Requires:** `pencil` MCP server configured in `.mcp.json`

---

## Design Phase

Create design components and set design tokens in a .pen file.

### Setup

1. Use `get_editor_state()` to check if a .pen file is open
2. If no file open, use `open_document('new')` to create one or `open_document(filePath)` to open existing
3. Use `get_guidelines(topic)` for design rules (available topics: `code`, `table`, `tailwind`, `landing-page`)
4. Use `get_style_guide_tags` + `get_style_guide(tags)` for design inspiration

### Creating Components

Use `batch_design(operations)` with these operations:

| Operation | Syntax | Purpose |
|-----------|--------|---------|
| Insert | `foo=I("parent", { ... })` | Create new node |
| Copy | `baz=C("nodeid", "parent", { ... })` | Clone existing node |
| Replace | `foo2=R("nodeid", { ... })` | Replace node properties |
| Update | `U("nodeid", { ... })` | Update node properties |
| Delete | `D("nodeid")` | Remove node |
| Move | `M("nodeid", "parent", index)` | Reorder nodes |
| Image | `G("nodeid", "ai", "prompt")` | Generate image |

**Limit:** Maximum 25 operations per `batch_design()` call.

### Setting Design Tokens

Use `set_variables()` to define design tokens (colors, spacing, typography) as .pen file variables. This ensures consistency across all components.

### Tips

- Use `find_empty_space_on_canvas(direction, size)` before inserting new frames
- Use `snapshot_layout()` to check computed layout before placing elements
- Use `get_screenshot()` periodically to validate visual output

---

## Implement Phase

Read precise design values from .pen files for implementation.

### Reading Design Data

1. Use `batch_get(patterns)` to search for components by name or pattern
2. Use `batch_get(nodeIds)` to read specific node properties (colors, spacing, dimensions)
3. Use `get_variables()` to read all design tokens and their resolved values
4. Use `get_screenshot()` to capture visual reference for a specific node

### Workflow

```
1. Read design-spec.md to identify component names
2. batch_get(patterns=["ComponentName"]) → find node IDs
3. batch_get(nodeIds=[...]) → read exact properties (fill, stroke, padding, font)
4. get_variables() → read design token values
5. Implement using exact values from MCP, not approximate values from markdown
```

**Important:** MCP values are more precise than design-spec.md descriptions. Always prefer MCP-read values for colors, spacing, font sizes, and dimensions.

---

## Verify Phase

Compare implementation against design using visual and structural checks.

### Visual Comparison

1. Use `get_screenshot()` to capture the design for each component
2. Compare screenshot with implemented UI (side-by-side or overlay)
3. Check: colors match, spacing is consistent, typography is correct

### Structural Comparison

1. Use `batch_get(nodeIds)` to read component structure
2. Use `search_all_unique_properties(parentIds)` to enumerate all properties
3. Compare design structure with implementation DOM/component structure
4. Flag discrepancies in spacing, color, or layout

### Verification Checklist

- [ ] All design tokens from `get_variables()` match implementation CSS variables
- [ ] Component visual states match design (hover, active, disabled)
- [ ] Responsive breakpoints produce correct layout changes
- [ ] Typography (font family, size, weight, line-height) matches design


---

## Reference: Platform Adapter: Figma

# Platform Adapter: Figma

Design tool adapter for Figma, using html-to-figma MCP for design creation and Figma MCP for reading.

**Requires:** `html-to-figma` MCP server and/or `figma` MCP server configured in `.mcp.json`

---

## Design Phase

Create designs in Figma by generating HTML prototypes and pushing them via MCP.

### Workflow

```
1. Generate HTML + CSS prototype from design-spec.md
   - Use semantic HTML elements
   - Apply design tokens as CSS custom properties
   - Include all component states as separate sections

2. Push to Figma using html-to-figma MCP:
   - import-html: Push HTML string directly
   - import-url: Push from a served URL

3. Refine in Figma manually if needed
```

### Tips

- Structure HTML with clear component boundaries (one `<section>` per component)
- Use CSS Grid/Flexbox matching the design-spec layout descriptions
- Include visual state variations as adjacent elements for Figma review

---

## Implement Phase

Read design details from Figma for precise implementation.

### Reading Design Data

Use Figma MCP tools to read node properties:

1. Navigate Figma file structure to find target components
2. Read node properties: fills (colors), strokes, effects (shadows), text styles
3. Extract auto-layout properties (padding, spacing, alignment)
4. Read component variants for state-based designs

### Workflow

```
1. Read design-spec.md to identify component names
2. Use Figma MCP to find matching components/frames
3. Read exact property values (hex colors, px spacing, font details)
4. Implement using Figma-read values, not markdown approximations
```

**Important:** Figma MCP values are authoritative. Prefer them over design-spec.md descriptions.

---

## Verify Phase

Compare implementation against Figma design.

### Verification Workflow

1. Use Figma MCP to read design node details
2. Compare against implementation:
   - Color values (hex/rgba match)
   - Spacing and padding (px match)
   - Typography (font, size, weight, line-height)
   - Layout direction and alignment
3. Flag discrepancies with specific property differences

### Verification Checklist

- [ ] Color palette matches Figma fills and strokes
- [ ] Spacing matches Figma auto-layout padding and item spacing
- [ ] Typography matches Figma text style properties
- [ ] Component structure follows Figma layer hierarchy


---

## Reference: Platform Adapter: Penpot

# Platform Adapter: Penpot

Design tool adapter for Penpot, using Penpot API for design operations.

**Requires:** Penpot MCP server or API access configured in `.mcp.json`

---

## Design Phase

Create design components using Penpot API.

### Workflow

```
1. Create or open a Penpot project/page for the Story
2. Create frames for each screen defined in design-spec.md
3. Build components with proper naming conventions
4. Apply design tokens as Penpot library colors and text styles
5. Set up responsive constraints where supported
```

### Tips

- Use Penpot components for reusable UI elements
- Define shared colors and text styles in the Penpot library
- Name layers consistently with design-spec.md component names

---

## Implement Phase

Export and read Penpot design data for implementation.

### Reading Design Data

1. Export Penpot components as SVG or inspect via API
2. Read component properties: fills, strokes, text styles, dimensions
3. Extract layout constraints and spacing values
4. Map Penpot library colors to design tokens

### Workflow

```
1. Read design-spec.md to identify component names
2. Use Penpot API to find matching components
3. Read exact property values from Penpot data
4. Implement using Penpot-read values for precision
```

**Important:** Penpot data is authoritative. Prefer API-read values over design-spec.md descriptions.

---

## Verify Phase

Compare implementation against Penpot design.

### Verification Workflow

1. Export Penpot frames for visual comparison
2. Read component properties via API
3. Compare against implementation:
   - Color values match
   - Spacing and dimensions match
   - Typography matches text styles
4. Flag discrepancies with specific differences

### Verification Checklist

- [ ] Colors match Penpot library color definitions
- [ ] Spacing matches Penpot frame constraints
- [ ] Typography matches Penpot text styles
- [ ] Component structure follows Penpot layer organization


---

## Reference: Platform Adapter: HTML

# Platform Adapter: HTML

Zero-dependency design adapter that produces HTML + CSS prototypes directly.

**Requires:** No external MCP server — works with standard file system only.

---

## Design Phase

Generate HTML + CSS prototype files from design-spec.md.

### Workflow

```
1. Create output directory: design.output_dir (default: .prospec/changes/[name]/prototype/)
2. Generate index.html with semantic HTML structure
3. Generate styles.css with:
   - CSS custom properties for all design tokens
   - Component styles matching design-spec.md
   - Responsive media queries matching breakpoints
4. Generate component files if needed (one HTML file per screen)
```

### File Structure

```
prototype/
  index.html          — Main entry with navigation
  styles.css          — Design tokens + component styles
  [screen-name].html  — Individual screen prototypes
```

### Tips

- Use CSS custom properties (`--color-primary`, `--space-md`) for all design tokens
- Use `<template>` or `<section>` to separate component state variations
- Include `:hover`, `:focus`, `:disabled` pseudo-states in CSS
- Use CSS Grid/Flexbox matching design-spec layout descriptions
- Add `@media` queries matching responsive strategy breakpoints

---

## Implement Phase

Read prototype files for precise implementation values.

### Reading Design Data

1. Read `styles.css` to extract:
   - CSS custom property values (design tokens)
   - Component selectors and their styles
   - Media query breakpoints
2. Read HTML files to understand:
   - Component structure and nesting
   - Semantic element choices
   - State variation patterns

### Workflow

```
1. Read design-spec.md to identify component names
2. Read prototype/styles.css for exact token values
3. Read prototype/[screen].html for component structure
4. Implement using prototype values as reference
```

**Important:** The HTML prototype is the single source of truth for design values when using this adapter.

---

## Verify Phase

Compare implementation against HTML prototype using DOM and CSS comparison.

### Verification Workflow

1. Read prototype CSS custom properties
2. Compare against implementation:
   - CSS variable values match
   - Component structure matches prototype HTML
   - Media queries match responsive breakpoints
3. Visual comparison: open both prototype and implementation side-by-side

### Verification Checklist

- [ ] CSS custom properties match prototype `styles.css` values
- [ ] DOM structure follows prototype HTML nesting patterns
- [ ] Responsive breakpoints match prototype media queries
- [ ] Component states (hover, active, disabled) match prototype pseudo-states
