# add-contact-dialog — Tasks

## Types

- [x] [P] Define `Profile` interface in `src/lib/profile.ts` ~15 lines
- [x] [P] Define `ContactDialogContextType` in `src/context/ContactDialogContext.tsx` ~10 lines

## Lib

- [x] Create `PROFILE` constant with real data in `src/lib/profile.ts` ~20 lines

## Context

- [x] Create `ContactDialogContext` with provider and `useContactDialog` hook ~30 lines

## i18n

- [x] [P] Add `contactDialog` keys to `src/messages/en.json` ~12 lines
- [x] [P] Add `contactDialog` keys to `src/messages/zh-TW.json` ~12 lines

## Components

- [x] Create `ContactDialog` component — backdrop + modal shell with AnimatePresence ~40 lines
- [x] Add profile rows rendering (icon + label + link/value) with conditional hide ~50 lines
- [x] Add email copy-to-clipboard button with "Copied!" feedback ~25 lines
- [x] Add phone `tel:` link, LinkedIn/GitHub/Resume `target="_blank"` links ~20 lines
- [x] Add Escape key handler and focus trap ~15 lines
- [x] Responsive styling — full-width mobile, centered desktop ~10 lines

## Integration

- [x] Wrap `SpaceJourneyPage` content with `ContactDialogProvider` ~5 lines
- [x] Render `<ContactDialog />` in SpaceJourneyPage alongside ProjectDialog ~3 lines
- [x] Update `NavBar` — replace `<a href="#contact">` with `<button onClick={open}>` ~8 lines
- [x] Update `ContactButton` — replace `<motion.a>` with `<motion.button onClick={open}>` ~10 lines

## Cleanup

- [x] Remove `contactHref` prop from SunTextOverlay, SunFinalSection, SpaceJourneyPage ~15 lines
- [x] Remove `DEVELOPER_NAME` and `CONTACT_HREF` from `page.tsx`, import `PROFILE.name` ~8 lines
- [x] Remove `name` prop drilling from SpaceJourneyPage → NavBar / HeroEarth if using PROFILE directly ~10 lines (skipped — prop drilling is minimal, page.tsx already uses PROFILE.name)

## Summary

- **Total Tasks:** 19
- **Completed:** 19
- **Remaining:** 0
- **Total Estimated Lines:** ~308 lines
