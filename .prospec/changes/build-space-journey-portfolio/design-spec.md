# Design Spec: build-space-journey-portfolio

> Generated from: proposal.md (ui_scope: full)
> Platform: pencil
> Last updated: 2026-03-06

---

## Visual Identity

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| --color-bg | #030308 | Page background |
| --color-nav-bg | #03030B | Navbar background |
| --color-text-primary | #FFFFFF | Hero name, dialog headings |
| --color-text-secondary | #6B7BA4 | Hero subtitle, muted body text |
| --color-text-muted | #7A8AB4 | Hover card value/description |
| --color-accent-blue | #3B82F6 | Earth label, CTA links |
| --color-accent-cyan | #06B6D4 | Rocket window highlight |
| --color-accent-orange | #F97316 | Rocket flame, contact button, Mars/Jupiter labels |
| --color-accent-yellow | #FDE68A | Rocket flame core, final section subtitle |
| --color-accent-indigo | #E0E7FF | Hover card title text |
| --color-accent-sky | #38BDF8 | Hover card tech stack tags |
| --color-traj-line | #0D1B3E | Trajectory path line |
| --color-hover-divider | #1B3A6E | Horizontal rule in hover card |
| --color-hover-cta-bg | #1B4FAD | Hover card CTA button background |

**Planet-specific accent colors (used for labels and tints):**

| Planet | Body Color | Label Color |
|--------|-----------|-------------|
| Earth | #1B4FAD | #3B82F6 |
| Saturn | #E8C97C | #FDE68A |
| Moon | #94A3B8 | #CBD5E1 |
| Jupiter | #C17F3E | #F97316 |
| Mars | #C1440E | #F97316 |
| Neptune | #3B5BDB | #93C5FD |
| Uranus (purple) | #7C3AED | #A78BFA |

**Sun colors:**
- Corona outer: #7C2D04
- Corona: #B45309
- Sun body: #FCD34D
- Glow: #FBBF24
- Highlight: #FEF3C7

### Typography

| Token | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| --font-hero-name | Space Grotesk | 80px | 700 | Developer name on Earth |
| --font-hero-sub | Space Grotesk | 16px | 400 | Hero subtitle |
| --font-final-title | Space Grotesk | 56px | 700 | Final section title (Sun area) |
| --font-final-sub | Space Grotesk | 18px | 400 | Final section subtitle |
| --font-proj-name | Space Grotesk | 15–16px | 600 | Project name on planet |
| --font-hover-title | Space Grotesk | 13px | 600 | Hover card title |
| --font-hover-desc | Space Grotesk | 12px | 400 | Hover card description |
| --font-footer | Space Grotesk | 13px | 400 | Footer/credit text |
| --font-planet-label | JetBrains Mono | 9–12px | 400 | Planet name labels (monospace) |
| --font-stack-tag | JetBrains Mono | 10px | 400 | Tech stack in hover card |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| --space-xs | 4px | Tag gaps |
| --space-sm | 8px | Inner card padding |
| --space-md | 16px | Section inner padding |
| --space-lg | 24px | Card padding |
| --space-xl | 48px | Section vertical spacing |

### Visual Style

- **Theme**: Deep space — near-black background (#030308), glowing celestial bodies
- **Border radius**: Rounded for buttons (~8px); circles for planets
- **Rocket scaling**: Rocket grows from Small (44×88) → Medium → Large → XL → Final (120×240) as scroll progresses, giving a sense of approaching the Sun
- **Trajectory**: A 2px vertical line (#0D1B3E) centered on page, acting as the flight path
- **Parallax stars**: Scattered ellipses (#FFFFFF, #C7D2FE, #A5B4FC) of 1–3px as background starfield

---

## Components

### NavBar

**Layout:**
- Fixed top, full-width (1440px × 60px)
- Flex row, space-between, items centered
- Dark background (#03030B)

**Children:**
- Logo / developer name (left)
- Language toggle (zh-TW / en) — right side
- Optional: nav links (scroll anchors)

**States:**

| State | Visual Changes |
|-------|---------------|
| Default | Transparent or #03030B with subtle blur backdrop |
| Scrolled | Adds backdrop-filter blur, slight border-bottom |

---

### HeroEarth

**Layout:**
- Full-viewport section, centered vertically and horizontally
- Earth circle: 680×680px ellipse, fill #1B4FAD
- Atmosphere glow behind Earth: 760×760px ellipse, fill #0A2040
- Continent details: overlapping green ellipses (#2E7D32, #388E3C)
- Ocean highlight: blue ellipse (#2196F3)
- Cloud: white ellipse (#FFFFFF), 130×55px

**Text overlay (heroName + heroSub):**
- heroName: Space Grotesk 80px #FFFFFF, positioned on/near Earth
- heroSub: Space Grotesk 16px #6B7BA4, below heroName
- earthLbl: JetBrains Mono 11px #3B82F6 (planet name annotation)

**States:**

| State | Visual Changes |
|-------|---------------|
| Initial load | Fade-in animation, Earth subtle rotation |
| Scrolling | Earth slowly recedes, rocket begins journey |

---

### TrajectoryPath

**Layout:**
- Fixed 2px wide vertical line, centered horizontally (x ≈ 720px)
- Height: ~6300px (spans entire scroll distance)
- Fill: #0D1B3E (very dark indigo)
- Decorative: dashed or gradient fade at ends (design intent)

---

### Rocket

The rocket has 5 size variants representing growth during the journey:

| Variant | Body Size | Usage |
|---------|-----------|-------|
| Small (S) | 44×88px | Near Earth |
| Medium (M) | 70×140px | Mid journey |
| Large (L) | 80×158px | Further out |
| XL | 96×190px | Near Neptune |
| Final | 120×240px | Near Sun |

**Color tokens (same for all sizes):**
- Body: #F1F5F9 (Small–Large) / #F8FAFC (Final)
- Wings: #CBD5E1 (Small–Large) / #E2E8F0 (Final)
- Window: #06B6D4
- Flame outer: #F97316
- Flame core: #FDE68A

**States:**

| State | Visual Changes |
|-------|---------------|
| Traveling | Slight oscillation/tilt, flame animated (flicker) |
| Landing (Sun) | Scale up + landing animation, flame grows |

---

### PlanetNode

**Layout:**
- Circular planet body (varies: 200–460px diameter per planet)
- Planet name label below (JetBrains Mono, planet-specific accent color)
- Project name text above or below planet (Space Grotesk 15–16px #FFFFFF)
- Positioned alternating left/right of trajectory line

**Planet sizes:**
| Planet | Size | Notes |
|--------|------|-------|
| Moon | 200×200px | Grey #94A3B8, craters |
| Mars | 300×300px | Red #C1440E, polar ice cap |
| Saturn | 340×310px | Gold #E8C97C, ring 540px wide |
| Jupiter | 400×360px | Brown #C17F3E, 3 banding stripes |
| Neptune | 460×460px | Indigo #3B5BDB, ring behind |
| Purple planet | 200×200px | #7C3AED, crater detail |

**States:**

| State | Visual Changes |
|-------|---------------|
| Default | Planet renders with label and project name |
| Hover | HoverCard appears (295×200px, dark tinted bg) |
| Active/Click | Dialog opens with full project detail |

---

### HoverCard

**Layout:**
- 295×200px frame, absolutely positioned near planet
- Background: dark planet-tinted color (e.g., #040B18 for Earth, #060300 for Jupiter)
- Rounded corners, subtle border

**Children (top to bottom):**
- `ehTitle`: Space Grotesk 13px #E0E7FF — project title
- `ehStack`: JetBrains Mono 10px #38BDF8 — tech stack tags
- `ehDivider`: 1px horizontal rule, fill-container width, #1B3A6E
- `ehValue`: Space Grotesk 12px #7A8AB4 — one-line project description
- `ehCta`: 90×26px button frame, fill #1B4FAD — view project CTA

**States:**

| State | Visual Changes |
|-------|---------------|
| Hidden | opacity: 0, scale 0.95 |
| Visible | opacity: 1, scale 1.0, animate in (Framer Motion) |

---

### ProjectDialog

**Layout:**
- Full-screen or large modal overlay
- Split 50/50 horizontal layout:
  - Left panel: iframe (if live URL exists) or project screenshot image
  - Right panel: project details
- Right panel content: project name (heading), description, tech stack tags, GitHub link, Live Demo link

**States:**

| State | Visual Changes |
|-------|---------------|
| Closed | Hidden |
| Opening | Fade-in + slide-up from center |
| Open — with URL | Left panel shows iframe |
| Open — no URL | Left panel shows screenshot image |
| iframe loading | Left panel shows spinner |
| iframe error | Left panel shows fallback screenshot |

---

### SunFinalSection

**Layout:**
- Large circular Sun centered at page bottom
- Sun corona rings (layered ellipses): 2440px outer → 2000px → 1640px glow → 2000px body
- Text overlay above Sun:
  - `finalTitle`: Space Grotesk 56px #FFFFFF
  - `finalSub`: Space Grotesk 18px #FDE68A
- Contact button below text: 232×52px, fill #F97316
- Footer text: Space Grotesk 13px #78350F

**States:**

| State | Visual Changes |
|-------|---------------|
| Rocket approaching | Rocket grows to Final size, flame intensifies |
| Rocket landing | Landing animation plays on contact button area |

---

### ContactButton

**Layout:**
- 232×52px, background #F97316
- Text: Space Grotesk, white
- Rounded corners

**States:**

| State | Visual Changes |
|-------|---------------|
| Default | #F97316 background |
| Hover | Slight brightness increase or scale 1.02 |
| Active | Scale 0.98 |

---

## Responsive Strategy

### Breakpoints

| Name | Min Width | Notes |
|------|-----------|-------|
| Mobile | 0px | Single column, simplified animations |
| Tablet | 768px | Reduced planet sizes, simplified layout |
| Desktop | 1024px | Full experience at 1440px design width |

### Layout Adaptations

| Component | Mobile | Desktop |
|-----------|--------|---------|
| NavBar | Hamburger or simplified | Full nav |
| HeroEarth | Earth scaled to ~320px, text smaller | Full 680px Earth |
| Trajectory + Rocket | Centered, rocket smaller | Full scroll animation |
| PlanetNode | Stacked vertically, centered | Alternating left/right of path |
| HoverCard | Disabled or tap-to-reveal | On hover |
| ProjectDialog | Full-screen, stacked (image top, detail bottom) | 50/50 split |
| SunFinalSection | Sun cropped/scaled, centered | Full sun rendering |

### Navigation

- Mobile: Language toggle in hamburger menu or fixed top-right icon
- Desktop: Language toggle in navbar right side
