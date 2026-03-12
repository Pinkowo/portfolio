# Proposal: build-space-journey-portfolio

## Background

身為前端工程師，需要一個作品集網站給招募人員查看。以「太空旅程」為核心視覺隱喻：火箭從地球出發，途經代表七個專案的行星（對應太陽系七大行星），最終降落在太陽，打造沉浸式的滾動體驗。

## User Stories

### US-1: 英雄區塊 — 地球打招呼 [P1]

As a recruiter visiting the portfolio,
I want to see a space-themed hero section with Earth displaying the developer's name and intro,
So that I immediately understand who this person is and feel engaged by the creative presentation.

**Acceptance Scenarios:**

- WHEN the page loads, THEN a dark space background is shown with an animated Earth at the top
- WHEN the page loads, THEN the developer's name and a brief self-introduction are visible on/near the Earth
- WHEN I begin scrolling, THEN the rocket starts its journey upward (away from Earth)

**Independent Test:** Open the site at root URL — name, title, and Earth are visible without scrolling.

---

### US-2: 滾動火箭動畫 [P1]

As a recruiter browsing the portfolio,
I want a rocket that visually travels through space as I scroll,
So that the scrolling feels immersive and encourages me to explore all projects.

**Acceptance Scenarios:**

- WHEN I scroll down, THEN the rocket moves along the vertical space path proportionally to scroll progress
- WHEN I scroll back up, THEN the rocket moves back toward Earth
- WHEN the rocket reaches the Sun (bottom), THEN a landing animation plays

**Independent Test:** Scroll slowly from top to bottom — rocket position tracks scroll progress without jitter.

---

### US-3: 行星專案展示 [P1]

As a recruiter reviewing projects,
I want each planet to represent a project with its name, tech stack, and a one-line description,
So that I can quickly scan all projects at a glance.

**Acceptance Scenarios:**

- WHEN I view a planet, THEN I can see the project name, tech stack tags, and a one-line description
- WHEN I hover over a planet, THEN a project screenshot/preview image appears
- WHEN I click a planet, THEN a dialog opens with full project details
- WHEN the dialog opens for a project with a live URL, THEN the left half shows an embedded iframe of the site
- WHEN the dialog opens for a project without a live URL, THEN the left half shows a project screenshot

**Independent Test:** Click each planet — dialog opens with correct content for that project.

---

### US-4: Notion CMS 串接 [P1]

As a frontend engineer maintaining the portfolio,
I want to manage project content in a Notion Database,
So that I can update project info without touching code.

**Acceptance Scenarios:**

- WHEN I add a new row in Notion Database, THEN the project appears on the site after refresh
- WHEN I update a project's description in Notion, THEN the site reflects the change after refresh
- WHEN Notion API is unavailable, THEN the site shows a graceful fallback or cached data

**Independent Test:** Add a test project in Notion — refresh the site and verify it appears correctly.

---

### US-5: 中英雙語切換 [P1]

As a recruiter from any background,
I want to switch between Chinese and English,
So that I can read the portfolio in my preferred language.

**Acceptance Scenarios:**

- WHEN I click the language toggle, THEN all UI text switches between zh-TW and en
- WHEN my browser language is English, THEN the site defaults to English
- WHEN I switch language, THEN the URL or state reflects the current locale

**Independent Test:** Set browser language to English — verify default locale is en; toggle to zh-TW — verify all text changes.

---

### US-6: 個人簡歷區塊 [P2]

As a recruiter evaluating the candidate,
I want to view work experience and skills in a dedicated section,
So that I can assess the developer's background without leaving the portfolio.

**Acceptance Scenarios:**

- WHEN I navigate to the resume section, THEN I see work history with company, role, and dates
- WHEN I view the resume section, THEN tech skills are listed or categorized

**Independent Test:** Resume section is reachable via navigation or scroll — all fields are populated.

---

### US-7: 聯絡方式 [P2]

As a recruiter wanting to reach out,
I want a contact section at the end of the journey (near the Sun),
So that I can easily find the developer's email or social links after being impressed.

**Acceptance Scenarios:**

- WHEN I reach the Sun / bottom of the page, THEN a contact section with email and/or social links is visible
- WHEN I click a contact link, THEN it opens correctly (mailto or new tab)

**Independent Test:** Scroll to bottom — contact links are visible and functional.

---

## Edge Cases

- 無 Demo 網址的專案：dialog 左半改顯示圖片，不嵌入 iframe
- 行動裝置：滾動動畫降級為靜態或簡化動畫，確保可讀性
- iframe 載入失敗：顯示 fallback 圖片或提示文字
- 七個行星對應七個專案，若未來增減需重新設計路徑節點

## Functional Requirements

- **FR-001**: 頁面為單頁滾動（SPA），不切換路由
- **FR-002**: 火箭位置由 scroll progress (0–100%) 驅動
- **FR-003**: 七顆行星依序對應水星、金星、火星、木星、土星、天王星、海王星
- **FR-004**: 行星 hover 顯示專案預覽圖
- **FR-005**: 行星 click 開啟 Dialog，左：iframe 或圖片，右：專案詳情（名稱、描述、技術、連結）
- **FR-006**: 支援 GitHub 連結和 Live Demo 連結
- **FR-007**: 使用 Next.js + Tailwind CSS + shadcn/ui + Framer Motion 動畫
- **FR-008**: 結尾太陽處有聯絡方式區塊
- **FR-009**: 專案資料透過 Notion API 串接，更新 Notion Database 即可同步網站內容
- **FR-010**: 支援中英雙語切換（i18n），預設語言可由瀏覽器語言自動偵測

## Success Criteria

- **SC-001**: 所有七個行星可點擊並顯示正確的專案資訊
- **SC-002**: 滾動時火箭動畫流暢，無明顯掉幀（60fps on desktop）
- **SC-003**: 招募人員可在 30 秒內找到開發者的聯絡方式
- **SC-004**: 頁面在桌機和手機均可正常瀏覽（RWD）
- **SC-005**: Lighthouse Performance 分數 >= 80
- **SC-006**: 更新 Notion Database 後，網站重新整理即可看到最新專案資料
- **SC-007**: 中英切換後所有文案正確對應，無遺漏翻譯

## Related Modules

- 無已定義模組（AI Knowledge 尚未初始化）— 待 `/prospec-knowledge-generate` 執行後補充

## Open Questions

- [x] 動畫函式庫：**Framer Motion**
- [x] 多語言：**中英雙語（zh-TW / en）**，瀏覽器語言自動偵測
- [x] 內容管理：**Notion API** 作為 CMS，無需改碼即可更新專案
- [ ] **NEEDS CLARIFICATION**: Notion Database 的欄位結構（名稱、描述、技術、截圖URL、Demo URL、GitHub URL、行星對應）需在實作前確認

## Constitution Check

- [x] Reviewed against `prospec/CONSTITUTION.md`
- [x] Constitution 目前為模板狀態，無具體 constraints — 無違反項目

## UI Scope

**Scope:** full
