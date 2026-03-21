---
feature: contact-dialog
status: active
story_count: 2
req_count: 7
last_updated: 2026-03-21
---

# Feature: Contact Dialog

## US-1: Contact Dialog [P1]

As a portfolio visitor,
I want to click "Contact" (nav) or "Get in Touch" (sun section) and see a dialog with the developer's full contact info,
So that I can quickly find the most convenient way to reach out.

### Requirements

#### REQ-DIALOG-001: Contact Dialog Component
Dialog displays all non-empty profile fields with icons/labels. Email has copy-to-clipboard. Phone uses `tel:`. LinkedIn/GitHub/Resume open in new tabs. Closes via backdrop, close button, or Escape. Responsive layout.

#### REQ-DIALOG-002: Shared Dialog State via Context
`useContactDialog()` hook returns `{ isOpen, open, close }`. NavBar and ContactButton both call `open()`.

#### REQ-DIALOG-003: i18n Support
Translation keys in both `en.json` and `zh-TW.json` for all dialog labels.

#### REQ-NAV-001: Nav Contact Link Behavior
Nav "Contact" is a `<button>` that opens the ContactDialog via context.

#### REQ-SUN-001: Get in Touch Button Behavior
"Get in Touch" is a `<motion.button>` that opens the ContactDialog via context.

## US-2: Centralized Profile Data [P1]

As a developer maintaining this portfolio,
I want all personal info managed in a single `src/lib/profile.ts` file,
So that I only need to edit one place when my info changes.

### Requirements

#### REQ-PROFILE-001: Centralized Profile Data Module
`src/lib/profile.ts` exports typed `PROFILE` object with: name, nameEn, nickname, email, phone?, linkedinUrl?, githubUrl?, resumeUrl?.

#### REQ-PAGE-001: Remove Scattered Profile Constants
Profile data imported from `profile.ts`. No `DEVELOPER_NAME`/`CONTACT_HREF` in page.tsx.

## Change History

| Date | Change | REQs Affected |
|------|--------|---------------|
| 2026-03-21 | Initial creation from add-contact-dialog | All |
