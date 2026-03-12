# Plan: build-space-journey-portfolio

## Overview

打造一個以太空旅程為主題的個人作品集，讓招募人員透過沉浸式滾動體驗認識開發者。火箭從地球出發，途經七大行星（每顆代表一個專案），最終降落在太陽，全程以 Framer Motion 驅動的 scroll-progress 動畫呈現。

技術策略：Next.js 14 App Router + next-intl 做 i18n 路由；Notion API 做 CMS（ISR revalidation）；Framer Motion `useScroll + useTransform` 驅動火箭位置與尺寸；shadcn/ui Dialog 做專案詳情浮層；Tailwind CSS 配合設計稿 design tokens 管理視覺系統。

## Technical Context (Greenfield)

> AI Knowledge not yet established — substitute context collected below

### Tech Stack Detection
- Language: JavaScript / TypeScript
- Framework: Next.js 14 (App Router)
- Package Manager: pnpm
- UI: Tailwind CSS + shadcn/ui
- Animation: Framer Motion
- CMS: Notion API (@notionhq/client)
- i18n: next-intl
- Deploy: Vercel (recommended)

### Project Structure (Target)
```
src/
  app/[locale]/         # i18n routing
    page.tsx            # main portfolio page
    layout.tsx          # locale provider
  components/
    nav/                # NavBar, LanguageToggle
    space/              # StarField, TrajectoryPath, HeroEarth
    rocket/             # Rocket variants, ScrollRocket
    planet/             # PlanetNode, HoverCard
    dialog/             # ProjectDialog
    sun/                # SunFinalSection, ContactButton
    ui/                 # TechTag, shared shadcn components
  lib/
    notion.ts           # Notion API client + fetchers
    constants.ts        # Planet config, scroll thresholds
    utils.ts            # cn, formatters
  types/
    project.ts          # Project, Planet interfaces
  messages/
    zh-TW.json          # Chinese translations
    en.json             # English translations
  hooks/
    useScrollRocket.ts  # scroll progress → rocket position/size
```

### External Dependencies (to install)
- `next`, `react`, `react-dom`
- `framer-motion`
- `@notionhq/client`
- `next-intl`
- `tailwindcss`, `shadcn/ui`
- `@types/node`, `@types/react`, `typescript`

## Affected Modules

| Module | Impact | Changes |
|--------|--------|---------|
| space-canvas | High | New — full-page scroll container, star field, trajectory |
| rocket | High | New — 5-size variants, scroll-driven positioning |
| planet-node | High | New — 7 planets, hover card, click dialog |
| notion-data | High | New — Notion API integration, ISR caching |
| i18n | High | New — next-intl routing, zh-TW/en messages |
| nav | Medium | New — navbar with language toggle |
| sun-section | Medium | New — final section with contact |
| project-dialog | Medium | New — shadcn Dialog, iframe/image split |

## Implementation Steps

1. **Project scaffolding**
   - `pnpm create next-app` with TypeScript + Tailwind
   - Install: framer-motion, @notionhq/client, next-intl, shadcn/ui
   - Configure Tailwind with design tokens from design-spec.md (Space Grotesk, JetBrains Mono, color vars)
   - Add global CSS variables (#030308 bg, color palette)

2. **i18n setup (next-intl)**
   - Configure App Router i18n with `[locale]` segment
   - Create `middleware.ts` for locale detection (browser lang auto-detect)
   - Write `messages/zh-TW.json` and `messages/en.json` (hero, nav, planets, contact)
   - Wrap layout with `NextIntlClientProvider`

3. **Notion API data layer**
   - Create Notion Database with required fields (name, desc, tech, screenshotUrl, demoUrl, githubUrl, planet)
   - Implement `lib/notion.ts` — fetchProjects with ISR revalidation (60s)
   - Define `types/project.ts` (Project, PlanetKey interfaces)
   - Define `lib/constants.ts` — 7 planets config (name, color, size, scroll threshold)

4. **Core UI components**
   - NavBar: fixed top, logo + language toggle button
   - StarField: randomized star ellipses (CSS or canvas)
   - HeroEarth: Earth SVG/CSS illustration, heroName + heroSub overlay
   - TrajectoryPath: centered 2px vertical line, full scroll height
   - PlanetNode: reusable component for each planet + hover card trigger
   - HoverCard: Framer Motion AnimatePresence, project preview (title, stack, desc, CTA)
   - ProjectDialog: shadcn Dialog, split iframe/image left + details right
   - SunFinalSection: Sun illustration + title + contact button

5. **Scroll animation system**
   - `useScrollRocket` hook: `useScroll` + `useTransform` → y position + size index
   - Rocket component: renders correct size variant based on scroll progress (5 thresholds)
   - Planet entry animations: `whileInView` fade + scale-in per planet
   - Sun landing animation: trigger when scroll reaches 95%+

6. **Page assembly**
   - `app/[locale]/page.tsx`: fetch projects (server component), pass to SpaceJourneyPage
   - SpaceJourneyPage (client): orchestrates all sections with scroll container
   - Error boundary + fallback static data if Notion API fails
   - SEO: metadata (title, description, og:image)

7. **Deployment**
   - Configure Vercel env vars (NOTION_API_KEY, NOTION_DATABASE_ID)
   - Set ISR revalidation period
   - Verify Lighthouse score ≥ 80

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Notion API rate limits | Medium | ISR caching (60s revalidation), fallback static data |
| iframe cross-origin restrictions | Medium | Detect load error, show screenshot fallback |
| Scroll animation performance on mobile | High | Disable complex animations on mobile (useReducedMotion), CSS-only fallback |
| Framer Motion bundle size | Low | Use dynamic imports for animation-heavy components |
| next-intl locale routing complexity | Low | Follow next-intl App Router docs strictly |
