# Interaction Spec: build-space-journey-portfolio

> Generated from: proposal.md + design-spec.md
> DSL Version: draft-1
> Last updated: 2026-03-06

---

## Screens

### Screen: SpaceJourneyPage

Single-page scrollable canvas — no route changes.

**States:**

| State | Description | Entry Condition |
|-------|-------------|-----------------|
| Loading | Fetching project data from Notion API | Page initial load |
| Loaded | Full page rendered with planet nodes | Notion fetch success |
| Error | Failed to load project data | Notion API error |
| DialogOpen | Project dialog overlays the page | Planet click |

**Transitions:**

```
Loading -> Loaded : notion fetch success
Loading -> Error  : notion fetch error
Error   -> Loading : user refresh / retry
Loaded  -> DialogOpen : planet click
DialogOpen -> Loaded  : dialog close (Esc / close button)
```

---

## Flows

### Flow: PageLoad

**Description:** User opens the portfolio for the first time.

**Steps:**

```
1. Browser detects locale
   -> If browser lang is 'en': set locale = 'en'
   -> Else: set locale = 'zh-TW'

2. Page fetches project data from Notion API (ISR or SSG)
   -> On success: render planets with project info
   -> On error: render planets with fallback static data

3. Hero section animates in
   -> Earth fades/scales in
   -> heroName + heroSub appear with staggered Framer Motion animation
   -> Rocket (Small) appears at Earth position

4. Scroll indicator appears (subtle arrow or text cue)
```

---

### Flow: ScrollJourney

**Description:** User scrolls through the portfolio, rocket travels through space.

**Steps:**

```
1. User scrolls down
   -> Rocket Y position = lerp(earthY, sunY, scrollProgress)
   -> Rocket size transitions at scroll thresholds:
      0–20%   : Small (44×88)
      20–40%  : Medium (70×140)
      40–60%  : Large (80×158)
      60–80%  : XL (96×190)
      80–100% : Final (120×240)

2. Each planet comes into viewport
   -> Planet + label animate in (fade + scale from 0.8)
   -> Project name text appears below planet

3. User scrolls back up
   -> Rocket travels back toward Earth
   -> Size decreases correspondingly

4. User reaches 100% scroll (Sun)
   -> Landing animation plays
   -> Final section (title + subtitle + contact button) fades in
```

---

### Flow: PlanetHover

**Description:** User hovers over a planet on desktop to preview project.

**Steps:**

```
1. User hovers over planet circle
   -> Planet subtle scale: 1.0 -> 1.05 (100ms ease)
   -> HoverCard appears near planet
      -> Animate: opacity 0->1, scale 0.95->1.0 (150ms ease-out)

2. HoverCard displays:
   -> Project title (ehTitle)
   -> Tech stack tags (ehStack)
   -> One-line description (ehValue)
   -> "View Project" CTA (ehCta)

3. User moves cursor away from planet
   -> HoverCard disappears: opacity 1->0, scale 1.0->0.95 (100ms)
   -> Planet returns to normal scale
```

---

### Flow: PlanetClick — OpenDialog

**Description:** User clicks a planet to view full project details.

**Steps:**

```
1. User clicks planet (or HoverCard CTA)
   -> Dialog overlay animates in: opacity 0->1 + translateY(20px->0) (200ms ease)
   -> Backdrop dims (rgba(0,0,0,0.7))

2. Dialog renders:
   Left panel:
   -> If project has liveUrl: render <iframe src={liveUrl} />
      -> Show loading spinner while iframe loads
      -> On iframe load error: show fallback screenshot image
   -> If no liveUrl: show project screenshot image

   Right panel:
   -> Project name (heading)
   -> Description text
   -> Tech stack tags
   -> GitHub link button
   -> Live Demo link button (if liveUrl exists)

3. User closes dialog
   -> Via: Esc key / click backdrop / close button
   -> Dialog animates out: opacity 1->0 + translateY(0->10px) (150ms)
```

---

### Flow: LanguageToggle

**Description:** User switches between zh-TW and English.

**Steps:**

```
1. User clicks language toggle in NavBar
   -> Current locale toggles: 'zh-TW' <-> 'en'
   -> URL updates to reflect locale (e.g., /en or /zh-TW via next-intl)

2. All UI text updates immediately
   -> No page reload (client-side locale switch)
   -> Planet labels, project names, hero text, nav items all update

3. Language preference persisted
   -> Store in localStorage or cookie for subsequent visits
```

---

## Gestures

| Element | Gesture | Action |
|---------|---------|--------|
| Planet | Hover (desktop) | Show HoverCard |
| Planet | Click / Tap | Open ProjectDialog |
| Dialog backdrop | Click | Close dialog |
| Page | Scroll | Move rocket along trajectory |
| Page | Touch scroll (mobile) | Same as desktop scroll |

## Micro-interactions

| Trigger | Animation | Duration | Library |
|---------|-----------|----------|---------|
| Page load | Earth scale-in + hero text stagger | 600ms total | Framer Motion |
| Planet enter viewport | Fade + scale from 0.8 | 400ms | Framer Motion (whileInView) |
| Planet hover | Scale 1.0 → 1.05 | 100ms | Framer Motion (whileHover) |
| HoverCard appear | Opacity + scale | 150ms ease-out | Framer Motion |
| Dialog open | Opacity + translateY | 200ms ease | Framer Motion (AnimatePresence) |
| Dialog close | Opacity + translateY | 150ms ease | Framer Motion (AnimatePresence) |
| Rocket travel | Y position lerp on scroll | Continuous | Framer Motion (useScroll + useTransform) |
| Rocket size change | Smooth size crossfade at threshold | 300ms | Framer Motion (animate) |
| Contact button hover | Scale 1.0 → 1.02, brightness +10% | 150ms | Framer Motion |
| Sun landing | Rocket scale-up + flame grow | 500ms | Framer Motion |
| Language toggle | Text update (instant) + subtle fade | 100ms | next-intl + CSS transition |

---

## Responsive Interactions

| Interaction | Mobile | Desktop |
|-------------|--------|---------|
| Planet preview | Tap planet → dialog opens directly (no hover) | Hover → HoverCard → click → dialog |
| Dialog layout | Full-screen, stacked (image top / details bottom) | 50/50 split (iframe/image left, details right) |
| Scroll animation | Simplified: rocket moves but no size transition | Full rocket size progression |
| Language toggle | Accessible via tap in nav area | Click in navbar |
| Planet layout | Stacked vertically, centered on scroll path | Alternating left/right of trajectory |
