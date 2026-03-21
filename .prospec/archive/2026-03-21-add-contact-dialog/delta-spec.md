# add-contact-dialog — Delta Spec

## ADDED

### REQ-PROFILE-001: Centralized Profile Data Module

**Feature:** contact-dialog
**Story:** US-2

**Description:**
Create `src/lib/profile.ts` exporting a typed `PROFILE` object as the single source of truth for all personal information used across the site.

**Acceptance Criteria:**
1. `Profile` interface defines: name, nickname, email, phone?, linkedinUrl?, githubUrl?, resumeUrl?
2. `PROFILE` is exported as a const satisfying the `Profile` type
3. TypeScript compile error if required fields (name, nickname, email) are missing

**Priority:** High

---

### REQ-DIALOG-001: Contact Dialog Component

**Feature:** contact-dialog
**Story:** US-1

**Description:**
Create a `ContactDialog` component that displays the developer's full contact profile in a modal dialog, triggered by both the nav "Contact" link and the sun section "Get in Touch" button.

**Acceptance Criteria:**
1. Dialog displays all non-empty profile fields with appropriate icons and labels
2. Email row includes a "copy to clipboard" button with visual feedback ("Copied!")
3. Phone row uses `tel:` link to trigger device dialer
4. LinkedIn, GitHub, Resume links open in new tabs (`target="_blank"`)
5. Dialog closes via backdrop click, close button, or Escape key
6. Responsive: full-width on mobile, centered modal on desktop

**Priority:** High

---

### REQ-DIALOG-002: Shared Dialog State via Context

**Feature:** contact-dialog
**Story:** US-1

**Description:**
Create a React Context (`ContactDialogContext`) to manage dialog open/close state, consumed by NavBar, ContactButton, and the dialog itself.

**Acceptance Criteria:**
1. `useContactDialog()` hook returns `{ isOpen, open, close }`
2. NavBar "Contact" calls `open()` on click
3. ContactButton "Get in Touch" calls `open()` on click

**Priority:** High

---

### REQ-DIALOG-003: i18n Support for Contact Dialog

**Feature:** contact-dialog
**Story:** US-1

**Description:**
Add translation keys for the contact dialog labels in both `en.json` and `zh-TW.json`.

**Acceptance Criteria:**
1. Keys exist for: dialog title, email label, phone label, linkedin label, github label, resume label, copied feedback
2. Both locale files have complete translations

**Priority:** Medium

---

## MODIFIED

### REQ-NAV-001: Nav Contact Link Behavior

**Feature:** contact-dialog
**Story:** US-1

**Before:**
Nav "Contact" is an `<a href="#contact">` anchor link that scrolls to the contact button.

**After:**
Nav "Contact" is a `<button>` that opens the ContactDialog via context.

**Reason:**
Replace broken anchor scroll with a dialog for richer contact info display.

**Priority:** High

---

### REQ-SUN-001: Get in Touch Button Behavior

**Feature:** contact-dialog
**Story:** US-1

**Before:**
"Get in Touch" button is a `<motion.a href="mailto:...">` that opens email client.

**After:**
"Get in Touch" button is a `<motion.button>` that opens the ContactDialog via context.

**Reason:**
Replace single-action mailto with full contact info dialog.

**Priority:** High

---

### REQ-PAGE-001: Remove Scattered Profile Constants

**Feature:** contact-dialog
**Story:** US-2

**Before:**
`DEVELOPER_NAME` and `CONTACT_HREF` defined as constants in `page.tsx`, passed as props through component tree.

**After:**
Profile data imported from `src/lib/profile.ts`. `contactHref` prop removed from component chain.

**Reason:**
Single source of truth for all personal data.

**Priority:** Medium

---
