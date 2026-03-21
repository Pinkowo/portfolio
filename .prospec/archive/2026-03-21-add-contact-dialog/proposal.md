# add-contact-dialog

## Background

Contact information is currently scattered across `page.tsx` as `DEVELOPER_NAME` and `CONTACT_HREF` constants, and the contact button simply triggers a `mailto:` link. Visitors have no way to see the developer's full contact profile (LinkedIn, GitHub, phone, email, resume, etc.) at a glance. Consolidating profile data into a single file and replacing the mailto behavior with a dialog improves maintainability and provides a richer contact experience.

## User Stories

### US-1: Contact Dialog [P1]

As a portfolio visitor,
I want to click "Contact" (nav) or "Get in Touch" (sun section) and see a dialog with the developer's full contact info,
So that I can quickly find the most convenient way to reach out.

**Acceptance Scenarios:**

- WHEN I click the nav "Contact" link, THEN a dialog opens displaying the developer's name, nickname, email, phone, LinkedIn, GitHub, and resume link
- WHEN I click the "Get in Touch" button in the sun/final section, THEN the same contact dialog opens
- WHEN I click a contact item (e.g. LinkedIn, GitHub, resume), THEN it opens in a new tab (`target="_blank"`)
- WHEN I click the email "copy" button, THEN the email address is copied to clipboard with visual feedback
- WHEN I click the phone number, THEN it triggers `tel:` to open the device's dialer
- WHEN I click the dialog backdrop or close button, THEN the dialog closes

**Independent Test:**
Click both "Contact" and "Get in Touch" triggers, verify the dialog opens with all profile fields and external links open in new tabs.

### US-2: Centralized Profile Data [P1]

As a developer maintaining this portfolio,
I want all personal info (name, nickname, email, phone, LinkedIn, GitHub, resume URL) managed in a single `src/lib/profile.ts` file,
So that I only need to edit one place when my info changes.

**Acceptance Scenarios:**

- WHEN I open `src/lib/profile.ts`, THEN I see a typed object containing all profile fields (name, nickname, email, phone, linkedinUrl, githubUrl, resumeUrl)
- WHEN I update a field in `profile.ts`, THEN the change is reflected in both the contact dialog and any other component consuming that data (e.g. NavBar name, HeroEarth name)
- WHEN a required field is missing, THEN TypeScript reports a compile error

**Independent Test:**
Change a field in `profile.ts`, verify it propagates to all consuming components without editing any other file.

## Edge Cases

- **Empty optional fields**: If a field like phone is left empty, the dialog should hide that row rather than showing a blank entry
- **Long URLs**: Resume or LinkedIn URLs should be displayed as friendly labels (e.g. "LinkedIn", "Resume"), not raw URLs
- **Mobile**: Dialog should be responsive — full-width on small screens, centered modal on desktop
- **Keyboard accessibility**: Dialog should be closable with Escape key and trap focus while open

## Functional Requirements

- **FR-001**: Create `src/lib/profile.ts` exporting a typed `PROFILE` object with fields: name, nickname, email, phone, linkedinUrl, githubUrl, resumeUrl
- **FR-002**: Create a `ContactDialog` component that renders all non-empty profile fields with appropriate icons/labels and external links opening in new tabs. Email row includes a "copy" button; phone row uses `tel:` link to trigger dialer
- **FR-003**: Replace nav "Contact" `<a href="#contact">` with an onClick that opens the ContactDialog
- **FR-004**: Replace sun section "Get in Touch" `<a href="mailto:...">` with an onClick that opens the ContactDialog
- **FR-005**: Remove `DEVELOPER_NAME` and `CONTACT_HREF` from `page.tsx`; import from `profile.ts` instead
- **FR-006**: Profile fields with empty/undefined values should not render in the dialog

## Success Criteria

- **SC-001**: Both "Contact" and "Get in Touch" triggers open the same dialog with all profile data
- **SC-002**: All external links (LinkedIn, GitHub, Resume) open in new tabs
- **SC-003**: No profile data exists outside `src/lib/profile.ts` — single source of truth
- **SC-004**: Dialog is responsive and keyboard-accessible (Escape to close)

## Related Modules

- No modules currently indexed in `_index.md` — WARN noted below

## Open Questions

- [x] ~~Should the dialog include a "Copy email" button?~~ Yes — copy to clipboard with visual feedback
- [x] ~~Visual style?~~ Match the overall website dark/space theme, NOT the ProjectDialog style

## Constitution Check

- [x] Reviewed against `prospec/CONSTITUTION.md`
- [x] No violations identified (Constitution has no defined principles/constraints yet — template defaults only)

## UI Scope

**Scope:** partial
