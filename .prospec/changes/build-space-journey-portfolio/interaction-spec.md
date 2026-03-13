# Interaction Spec: build-space-journey-portfolio

> Generated from: proposal.md + design-spec.md
> DSL Version: draft-1
> Last updated: 2026-03-12 (v2 — corrected scroll model)

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
   -> Rocket (70×140, scale 1.8) appears fixed at viewport center, positioned visually above Earth

4. Scroll indicator appears (subtle arrow or text cue)
```

---

### Flow: ScrollJourney

**Description:** User scrolls through the portfolio. Rocket stays fixed at viewport center; the planets layer moves to create the illusion of rocket flight.

**Scroll model:**
- Rocket: `position: fixed; top: 50vh; left: 50vw` — never moves
- Planets layer: `position: fixed; translateY = scrollProgress × SCENE_HEIGHT` — moves DOWN as user scrolls DOWN
- Visual effect: rocket appears to fly UP through the solar system

**Steps:**

```
1. User scrolls down (0% → 8%)
   -> Rocket scale: 1.8 → 1.0 (shrinks as it leaves Earth)
   -> Planets layer moves down: Earth recedes below rocket
   -> Visual: rocket launches away from Earth

2. User scrolls down (8% → 85%)
   -> Rocket scale: 1.0 (constant)
   -> Planets layer continues moving down
   -> Planets sequentially pass through viewport (outer → inner solar system)
   -> Each planet animates in when it enters the rocket's region

3. User scrolls down (85% → 100%)
   -> Rocket scale: 1.0 → 2.2 (grows as Sun fills the view)
   -> Sun fills the background

4. User reaches scrollProgress > 0.92 (landing threshold)
   -> Rocket z-index: 30 → 20 (rocket passes "into" sun between corona and body layers)
   -> Final section (title + subtitle + contact button) visible

5. User scrolls back up
   -> All animations reverse: planets layer moves up, rocket scale reverses
   -> Rocket visually descends back toward Earth
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
| Rocket leave Earth | Scale 1.8→1.0 (scroll 0→8%) | Continuous | Framer Motion (useTransform) |
| Planets layer scroll | TranslateY = scrollProgress × SCENE_HEIGHT | Continuous | Framer Motion (useScroll + useTransform) |
| Rocket approach Sun | Scale 1.0→2.2 (scroll 85→100%) | Continuous | Framer Motion (useTransform) |
| Rocket landing z-switch | z-index 30→20 at scrollProgress > 0.92 | Instant | useMotionValueEvent |
| Contact button hover | Scale 1.0 → 1.02, brightness +10% | 150ms | Framer Motion |
| Sun landing | Rocket scale 2.2×, flies between sun layers | Continuous | Framer Motion |
| Language toggle | Text update (instant) + subtle fade | 100ms | next-intl + CSS transition |

---

## Responsive Interactions

| Interaction | Mobile | Desktop |
|-------------|--------|---------|
| Planet preview | Tap planet → dialog opens directly (no hover) | Hover → HoverCard → click → dialog |
| Dialog layout | Full-screen, stacked (image top / details bottom) | 50/50 split (iframe/image left, details right) |
| Scroll animation | Simplified: planets layer moves, rocket scale transitions at endpoints | Same model; scale transitions and z-switch may be disabled on low-end devices |
| Language toggle | Accessible via tap in nav area | Click in navbar |
| Planet layout | Stacked vertically, centered on scroll path | Alternating left/right of trajectory |
