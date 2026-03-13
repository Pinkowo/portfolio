# Tasks: build-space-journey-portfolio

## Config

- [x] Init Next.js 14 project with TypeScript + Tailwind (`pnpm create next-app`) ~10 lines
- [x] Install dependencies: framer-motion, @notionhq/client, next-intl, shadcn/ui ~5 lines (commands)
- [x] Configure Tailwind — add Space Grotesk + JetBrains Mono fonts, extend colors with design tokens ~60 lines
- [x] Add global CSS variables (--color-bg, --color-accent-_, --color-planet-_) to `globals.css` ~40 lines
- [x] Configure `next.config.ts` with next-intl plugin + image domains (Notion CDN) ~20 lines

## Types

- [x] [P] Define `Project` interface (id, name, desc, tech[], screenshotUrl, demoUrl, githubUrl, planet) ~30 lines
- [x] [P] Define `PlanetKey` union type + `PlanetConfig` interface (color, size, labelColor, scrollThreshold) ~25 lines

## Data

- [x] Implement `lib/constants.ts` — PLANETS_CONFIG array (7 planets, colors, sizes, scroll thresholds) ~70 lines
- [x] Update `lib/constants.ts` — remove ROCKET_THRESHOLDS; add LAUNCH_THRESHOLD=0.05, LANDING_THRESHOLD=0.92, SCENE_HEIGHT=12000, SCROLL_DRIVE_HEIGHT=8000; add Venus/Mercury to PLANETS_CONFIG ~50 lines
- [ ] Set up Notion Database with required fields (Name, Description, Tech, ScreenshotUrl, DemoUrl, GitHubUrl, Planet) ~0 lines (manual)
- [x] Implement `lib/notion.ts` — fetchProjects() with ISR revalidation (60s) + fallback static data ~100 lines
- [x] Write `messages/zh-TW.json` — all UI strings in Traditional Chinese ~50 lines
- [x] [P] Write `messages/en.json` — all UI strings in English ~50 lines
- [x] Implement `i18n/request.ts` + `middleware.ts` for next-intl locale routing + browser detection ~40 lines

## Components

- [x] NavBar — fixed top, logo + LanguageToggle button, backdrop blur on scroll ~80 lines
- [x] LanguageToggle — locale switcher button, reads/sets next-intl locale ~40 lines
- [x] StarField — randomized star ellipses CSS background or canvas ~50 lines
- [x] TrajectoryPath — centered 2px vertical line (CSS, full scroll height) ~20 lines
- [x] HeroEarth — Earth SVG/CSS illustration + heroName + heroSub overlay + entry animation ~120 lines
- [x] [P] TechTag — small pill component for tech stack display ~20 lines
- [x] [P] PlanetNode — reusable planet circle + label + project name + whileInView animation ~100 lines
- [x] HoverCard — Framer Motion AnimatePresence popup (title, stack, desc, CTA) ~80 lines
- [x] ProjectDialog — shadcn Dialog, left iframe/image + right details panel + error fallback ~150 lines
- [x] Update `Rocket.tsx` — remove sizeIndex prop and multi-size map; accept `scale: MotionValue<number>` prop; fixed size 70×140px with `motion.div style={{ scale }}` ~60 lines
- [x] SunFinalSection — Sun illustration (layered CSS ellipses) + finalTitle + finalSub + ContactButton ~120 lines
- [x] Update `SunFinalSection.tsx` — export SunCoronaRings (z-18 via planets layer) and SunFinalSection (z-22 via separate layer); accept `isLanding` prop ~70 lines
- [x] ContactButton — 232×52px orange button with hover animation ~30 lines

## Animation

- [x] Rewrite `hooks/useScrollRocket.ts` — output `planetsY` (useTransform [0,1]→[0,SCENE_HEIGHT]), `rocketScale` (3-segment keyframe: 1.8→1.0→1.0→2.2), `isLanding` (scrollProgress > 0.92); remove rocketY + sizeIndex ~40 lines
- [x] Refactor `SpaceJourneyPage.tsx` — Rocket `position:fixed` at center; planets layer (z-10) + sun body layer (z-22) both fixed with planetsY; planets positioned at calc(50vh - T\*SCENE_HEIGHT - size/2) ~100 lines

## Pages

- [x] `app/[locale]/layout.tsx` — NextIntlClientProvider + font imports + metadata ~50 lines
- [x] `app/[locale]/page.tsx` — server component, fetch projects, pass to SpaceJourneyPage ~40 lines

## Tests

- [x] [P] Smoke test: page renders without errors (vitest + @testing-library/react) ~50 lines
- [x] Update `test/scrollRocket.test.ts` — replace sizeIndex assertions with planetsY + rocketScale + isLanding assertions; remove ROCKET_THRESHOLDS test cases ~70 lines
- [x] Integration test: ProjectDialog opens/closes correctly on planet click ~60 lines

## Summary

- **Total Tasks:** 32
- **Completed:** 31
- **Remaining:** 1 (Notion DB setup — manual task)
- **Parallelizable Tasks:** 8
- **Total Estimated Lines:** ~2,050 lines
