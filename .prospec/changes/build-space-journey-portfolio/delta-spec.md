# Delta Spec: build-space-journey-portfolio (v2 — Corrected Scroll Model)

## ADDED

### REQ-SCROLL-001: 行星逆向捲動（reverse parallax）

**Feature:** space-journey-portfolio
**Story:** US-2

**Description:**
建立一個 fixed planets layer，當使用者往下 scroll 時，星球層往下移動（而非往上），製造火箭向上飛行的視覺幻覺。

**Acceptance Criteria:**
1. Planets layer 為 `position: fixed`，套用 `translateY` = `scrollProgress * SCENE_HEIGHT`
2. 往下 scroll → planets 往下 → 火箭（固定在中央）視覺上向上穿越星球
3. 往上 scroll → planets 往上 → 火箭視覺上向下返回地球

**Priority:** High

---

### REQ-ROCKET-002: 火箭固定視窗中央

**Feature:** space-journey-portfolio
**Story:** US-2

**Description:**
火箭在整個旅程中固定在視窗中央，不隨 scroll 移動。視覺上的移動感完全由 planets layer 的逆向移動製造。

**Acceptance Criteria:**
1. Rocket 為 `position: fixed; top: 50vh; left: 50vw; transform: translate(-50%, -50%)`
2. Scroll 過程中火箭不移動，始終保持視窗中央
3. 單一固定尺寸（70×140px），不依 scroll 進度切換尺寸

**Priority:** High

---

## MODIFIED

### REQ-ROCKET-001: Scroll-driven 火箭動畫模型修正

**Feature:** space-journey-portfolio
**Story:** US-2

**Before:**
火箭 Y 座標從頁面 top 0% 移動到 92%，並隨 scroll 進度切換 5 種尺寸（S→M→L→XL→Final）。

**After:**
火箭固定在視窗中央不動，scale 隨距離感變化：
- 停在地球（scroll 0→8%）：scale 1.8→1.0（離地縮小，遠離地球感）
- 飛行中途（scroll 8%→85%）：scale 維持 1.0（一致的小尺寸，強調太空遼闊）
- 接近太陽（scroll 85%→100%）：scale 1.0→2.2（靠近太陽放大，降落感）

**Reason:**
原始模型火箭往下移動，與「升空」直覺相反。改為固定中央 + 行星逆向移動，更符合太空旅程的沉浸感。多尺寸系統複雜且與新模型衝突，改為 scale transform 更簡潔。

**Priority:** High

---

### REQ-SUN-001: 太陽降落 z-index 分層

**Feature:** space-journey-portfolio
**Story:** US-7

**Before:**
太陽為單一 z-index 層，火箭始終在太陽上方。

**After:**
太陽分為背層（corona）與前層（body + highlight），降落時火箭 z-index 切換至兩層之間，製造火箭「飛入太陽本體」的視覺效果，最終停在太陽上。

- Sun corona：z-index 18
- Rocket（一般）：z-index 30
- Rocket（`scrollProgress > 0.92`）：z-index 20
- Sun body + highlight：z-index 22

**Reason:**
US-2 acceptance scenario「landing animation plays when scroll reaches ≥ 95%」需要火箭穿越太陽的視覺層次，而非停在太陽表面上方。

**Priority:** Medium

---

## REMOVED

### REQ-ROCKET-SIZE-SYSTEM: 火箭多尺寸系統（S/M/L/XL/Final）

**Reason:**
新的固定中央 + scale transform 模型不再需要多個尺寸變體。`ROCKET_THRESHOLDS` 和 `sizeIndex` 整個移除，改由單一 `rocketScale` MotionValue 處理。

---
