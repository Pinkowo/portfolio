# add-contact-dialog — Implementation Plan

## Overview

Contact information is scattered across `page.tsx` constants and the contact button only fires a `mailto:` link. This plan consolidates all personal data into `src/lib/profile.ts` and replaces both contact triggers (NavBar + Sun section) with a shared ContactDialog that displays full profile info.

The dialog will use Framer Motion + Lucide icons (both already in the project) and manage open/close state via React Context to avoid prop drilling through multiple component layers.

## Technical Context (Greenfield)

> AI Knowledge not yet established — substitute context collected below

### Tech Stack Detection
- Language: TypeScript (Next.js 14 App Router)
- Framework: Next.js 14, React 18, Framer Motion 11, next-intl 3
- UI: Tailwind CSS 3, Lucide React icons, Radix Dialog (installed but unused for this)

### Detected Patterns
- Client components use `'use client'` directive
- Dialogs use Framer Motion `AnimatePresence` (see `ProjectDialog.tsx`)
- i18n via `useTranslations()` hook from next-intl
- Color palette: dark space theme — `#03050F` bg, `#1B3A6E` borders, `#6B7BA4` muted text

### External Dependencies
- `lucide-react` — already has `X`, `Github`, `ExternalLink`; will add `Mail`, `Phone`, `Linkedin`, `FileText`, `Copy`, `Check`

## Affected Modules

| Module | Impact | Changes |
|--------|--------|---------|
| src/lib/profile.ts | High | New file — single source of truth for all personal data |
| src/components/dialog/ContactDialog.tsx | High | New component — dialog rendering profile info |
| src/context/ContactDialogContext.tsx | Medium | New context — shared open/close state |
| src/components/nav/NavBar.tsx | Medium | Replace `<a href="#contact">` with onClick to open dialog |
| src/components/sun/ContactButton.tsx | Medium | Replace `<a href={mailto}>` with onClick to open dialog |
| src/components/sun/SunTextOverlay.tsx | Low | Remove `contactHref` prop |
| src/components/sun/SunFinalSection.tsx | Low | Remove `contactHref` prop |
| src/components/SpaceJourneyPage.tsx | Low | Remove `contactHref` prop, add Context provider |
| src/app/[locale]/page.tsx | Low | Remove `CONTACT_HREF`, import name from profile |
| src/components/space/HeroEarth.tsx | Low | Import name from profile instead of prop (optional) |
| src/messages/en.json + zh-TW.json | Low | Add `contact` dialog i18n keys |

## Implementation Steps

1. **Create `src/lib/profile.ts`**
   - Define `Profile` interface with all fields (name, nickname, email, phone, linkedinUrl, githubUrl, resumeUrl)
   - Export `PROFILE` constant with real data
   - All URL fields optional to support FR-006

2. **Create `src/context/ContactDialogContext.tsx`**
   - React Context with `isOpen` + `open()` / `close()` functions
   - Provider wraps the app in SpaceJourneyPage

3. **Add i18n keys for contact dialog**
   - Add `contact` section to both `en.json` and `zh-TW.json`
   - Keys: title, email, phone, linkedin, github, resume, copied

4. **Create `src/components/dialog/ContactDialog.tsx`**
   - Use Framer Motion AnimatePresence (consistent with ProjectDialog pattern)
   - Dark space theme styling (NOT matching ProjectDialog's iframe layout)
   - Each row: icon + label + value/link
   - Email row: `mailto:` link + copy button with "Copied!" feedback
   - Phone row: `tel:` link
   - LinkedIn/GitHub/Resume: `target="_blank"` links
   - Hide rows where profile field is empty
   - Backdrop click + Escape key + close button to dismiss
   - Responsive: full-width on mobile, centered modal on desktop

5. **Integrate Context + Dialog into SpaceJourneyPage**
   - Wrap content with `ContactDialogProvider`
   - Render `<ContactDialog />` alongside existing `<ProjectDialog />`

6. **Update NavBar — replace anchor with dialog trigger**
   - Import `useContactDialog` hook
   - Replace `<a href="#contact">` with `<button onClick={open}>`

7. **Update ContactButton — replace mailto with dialog trigger**
   - Import `useContactDialog` hook
   - Replace `<motion.a href={...}>` with `<motion.button onClick={open}>`
   - Remove `href` prop from interface

8. **Clean up prop drilling**
   - Remove `contactHref` from SunTextOverlay, SunFinalSection, SpaceJourneyPage props
   - Remove `CONTACT_HREF` from page.tsx
   - Import `PROFILE.name` in page.tsx to replace `DEVELOPER_NAME`

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Clipboard API not available (older browsers / non-HTTPS) | Low | Fallback: try `document.execCommand('copy')`, show error toast if both fail |
| Dialog z-index conflicts with existing ProjectDialog | Low | Use same z-index strategy (z-40 backdrop, z-50 dialog) — only one dialog open at a time |
| Context re-renders | Low | Context value is simple boolean + 2 functions, minimal re-render scope |

## Constitution Check

- [x] Reviewed against `prospec/CONSTITUTION.md`
- [x] No violations identified (Constitution has template defaults only)
