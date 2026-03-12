# Delta Spec: build-space-journey-portfolio

## ADDED

### REQ-SPACE-CANVAS-001: Space background with star field

**Feature:** space-journey-portfolio
**Story:** US-2

**Description:**
Full-page dark space canvas (#030308) with randomized star particles and a centered 2px vertical trajectory line connecting Earth to Sun.

**Acceptance Criteria:**
1. Background color is #030308 across entire viewport
2. Stars render as small ellipses (#FFFFFF, #C7D2FE, #A5B4FC) scattered across canvas
3. Trajectory line (2px, #0D1B3E) is centered horizontally and spans full scroll height

**Priority:** High

---

### REQ-HERO-001: Earth hero section with developer intro

**Feature:** space-journey-portfolio
**Story:** US-1

**Description:**
First viewport shows an Earth illustration with developer name and subtitle overlaid, establishing identity before the journey begins.

**Acceptance Criteria:**
1. Earth circle (680px) with atmosphere glow, continents, ocean highlight renders at page top
2. Developer name (Space Grotesk 80px #FFFFFF) and subtitle (16px #6B7BA4) are visible without scrolling
3. Entry animation: Earth fades/scales in on page load (Framer Motion)

**Priority:** High

---

### REQ-ROCKET-001: Scroll-driven rocket animation

**Feature:** space-journey-portfolio
**Story:** US-2

**Description:**
A rocket travels from Earth to Sun as the user scrolls, growing in size across 5 thresholds to simulate approach toward the Sun.

**Acceptance Criteria:**
1. Rocket Y position is derived from `useScroll + useTransform` (scroll 0% → top, 100% → Sun)
2. Rocket transitions through 5 sizes: S(44×88) → M(70×140) → L(80×158) → XL(96×190) → Final(120×240)
3. Size transitions occur at 20%/40%/60%/80% scroll thresholds with smooth crossfade (300ms)
4. Landing animation plays when scroll reaches ≥ 95%

**Priority:** High

---

### REQ-PLANET-001: Planet project nodes with hover and click

**Feature:** space-journey-portfolio
**Story:** US-3

**Description:**
Seven planets positioned along the trajectory path, each representing a project. Hover reveals a preview card; click opens a detailed dialog.

**Acceptance Criteria:**
1. All 7 planets render with correct colors, sizes, and labels (JetBrains Mono)
2. Project name (Space Grotesk 15px) is displayed on/near each planet
3. Hover (desktop) shows HoverCard (295×200px) with title, tech stack, description, and CTA
4. Click on planet (or HoverCard CTA) opens ProjectDialog
5. Planet entry uses `whileInView` fade + scale animation (Framer Motion)

**Priority:** High

---

### REQ-DIALOG-001: Project detail dialog with iframe/image split

**Feature:** space-journey-portfolio
**Story:** US-3

**Description:**
A full-detail modal with 50/50 split: left shows embedded site (iframe) or screenshot; right shows project metadata and links.

**Acceptance Criteria:**
1. Dialog opens with Framer Motion AnimatePresence (opacity + translateY)
2. Left panel: renders iframe if `demoUrl` exists; shows screenshot image otherwise
3. Left panel: shows loading spinner while iframe loads; shows fallback screenshot on error
4. Right panel: project name, description, tech stack tags, GitHub and Demo buttons
5. Dialog closes on Esc, backdrop click, or close button

**Priority:** High

---

### REQ-NOTION-001: Notion API CMS integration

**Feature:** space-journey-portfolio
**Story:** US-4

**Description:**
Project data is sourced from a Notion Database via @notionhq/client, enabling content updates without code changes.

**Acceptance Criteria:**
1. `lib/notion.ts` fetches all projects from Notion Database using ISR (revalidate: 60s)
2. Notion Database fields: Name, Description, Tech (multi-select), ScreenshotUrl, DemoUrl, GitHubUrl, Planet (select)
3. Site reflects Notion changes after next revalidation cycle (≤ 60s)
4. If Notion API is unavailable, site renders fallback static project data

**Priority:** High

---

### REQ-I18N-001: Bilingual zh-TW / en support

**Feature:** space-journey-portfolio
**Story:** US-5

**Description:**
Full bilingual support via next-intl with App Router `[locale]` routing. Browser language detection sets default locale.

**Acceptance Criteria:**
1. All UI strings (nav, hero, planets, dialog, contact) are defined in `messages/zh-TW.json` and `messages/en.json`
2. Language toggle in NavBar switches locale without page reload
3. Browser language `en*` defaults to English; all others default to zh-TW
4. Active locale is reflected in URL path (`/en/` or `/zh-TW/`)

**Priority:** High

---

### REQ-SUN-001: Final Sun section with contact

**Feature:** space-journey-portfolio
**Story:** US-7

**Description:**
The journey ends at a large Sun illustration with a final title, subtitle, and contact button.

**Acceptance Criteria:**
1. Sun (multi-layer corona, body #FCD34D) renders at page bottom
2. Final title (Space Grotesk 56px) and subtitle (18px #FDE68A) are visible near Sun
3. Contact button (232×52px, #F97316) links to email or opens contact method

**Priority:** Medium

---

## MODIFIED

*(none — greenfield project)*

## REMOVED

*(none — greenfield project)*
