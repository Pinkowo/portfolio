# Plan: build-space-journey-portfolio (v2 — Corrected Scroll Model)

## Overview

原始實作滾動模型錯誤：火箭隨 scroll 往下移動（0%→92% top），行星為 absolute 定位隨頁面自然往上跑，方向與「火箭升空」直覺相反。另外火箭的多尺寸系統（S→XL→Final）需改為單一尺寸，只在兩個端點有縮放動畫。

本次全面修正為「**星球逆向捲動 + 火箭固定中央**」模型：火箭固定在視窗中央不動；可滾動頁面驅動一個 fixed planets layer 往下移動（反向 parallax），製造火箭向上飛行的視覺幻覺。特殊動畫只在兩個端點：離開地球（rocket 由小變大，從畫面下方升起），降落太陽（rocket 由正常放大，穿越日冕後停在太陽上）。

## Technical Context (Greenfield)

> AI Knowledge 未初始化 — context 由源碼掃描取得

### Tech Stack
- **Framework**: Next.js 15 (App Router), TypeScript
- **Animation**: Framer Motion (`useScroll`, `useTransform`, `useSpring`)
- **Styling**: Tailwind CSS
- **i18n**: next-intl

### Key Files to Modify
- `src/hooks/useScrollRocket.ts` — 滾動核心 hook（需完全重寫）
- `src/components/SpaceJourneyPage.tsx` — 頁面組裝（需重構 layout model）
- `src/components/rocket/Rocket.tsx` — 移除多尺寸，改為接收 scale prop
- `src/components/sun/SunFinalSection.tsx` — z-index 分層
- `src/lib/constants.ts` — 新增 threshold 常數

### Current Bug (需修正)
```ts
// 現在：火箭往下移動 → 錯誤
rocketY = useTransform(scrollYProgress, [0,1], ['0%', '92%'])

// 修正：火箭固定，星球層往下移動
planetsTranslateY = useTransform(scrollYProgress, [0,1], [0, SCENE_HEIGHT])
```

## Affected Modules

| Module | Impact | Changes |
|--------|--------|---------|
| `useScrollRocket.ts` | High | 重寫：輸出 planetsY + rocketScale，移除 rocketY/sizeIndex |
| `SpaceJourneyPage.tsx` | High | 重構：rocket fixed 中央；planets layer fixed + planetsY transform |
| `Rocket.tsx` | Medium | 移除 sizeIndex/多尺寸，改接 scale prop，套用 motion scale |
| `SunFinalSection.tsx` | Medium | z-index 分層：sun body > rocket（landing 時）> sun highlight |
| `constants.ts` | Low | 新增 LAUNCH_THRESHOLD(0.05)、LANDING_THRESHOLD(0.9)、SCENE_HEIGHT |

## Implementation Steps

1. **更新 `constants.ts`**
   - 移除 `ROCKET_THRESHOLDS`
   - 新增 `LAUNCH_THRESHOLD = 0.05`、`LANDING_THRESHOLD = 0.90`
   - 新增 `SCENE_HEIGHT = 12000`（planets layer 總移動距離 px）

2. **重寫 `useScrollRocket.ts`**
   - 輸出 `planetsY`：`useTransform([0,1], [0, SCENE_HEIGHT])`（往下 scroll → planets 往下）
   - 輸出 `rocketScale`：3 段 keyframe
     - `[0, 0.08]` → `[1.8, 1.0]`（離地縮小，遠離地球感）
     - `[0.08, 0.85]` → `[1.0, 1.0]`（飛行中途固定，強調太空遼闊）
     - `[0.85, 1.0]` → `[1.0, 2.2]`（接近太陽放大，降落感）
   - 輸出 `isLanding`：`scrollProgress > 0.92`（用於切換 z-index）
   - 移除 `rocketY`、`sizeIndex`

3. **重構 `SpaceJourneyPage.tsx`**
   - Rocket：改為 `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)`
   - 建立 `planetsLayer`：`position: fixed; inset: 0; overflow: hidden; pointer-events: none`
   - 行星、地球、軌跡線、太陽放入 `planetsLayer`，套用 `planetsY` transform
   - 保留 invisible scroll container（`min-height: SCROLL_DRIVE_HEIGHT`）驅動 scrollYProgress
   - 行星的 `pointer-events` 在 planetsLayer 內獨立開啟

4. **更新 `Rocket.tsx`**
   - 移除 `sizeIndex` prop 和多尺寸 map
   - 接收 `scale: MotionValue<number>` prop
   - Rocket 固定為單一中等尺寸（70×140），套用 `motion.div style={{ scale }}`

5. **調整 Sun z-index 分層（`SunFinalSection.tsx`）**
   - Sun corona（背層）：`z-index: 18`
   - Sun body + highlight：`z-index: 22`
   - Rocket（一般）：`z-index: 30`
   - Rocket landing 狀態（`isLanding=true`）：`z-index: 20`（飛入太陽本體層之間）

6. **更新測試 `scrollRocket.test.ts`**
   - 更新 hook 輸出的 assertions（planetsY、rocketScale）
   - 移除 sizeIndex 相關 test cases

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| planets layer 行星 pointer-events 被遮擋 | High | planetsLayer `pointer-events: none`，行星個別開啟 `pointer-events: auto` |
| scroll container 高度需足夠驅動動畫 | Medium | `min-height: SCROLL_DRIVE_HEIGHT (8000px)` 獨立於 SCENE_HEIGHT |
| mobile 效能（fixed + transform） | Medium | `will-change: transform` 只加在 planetsLayer，避免過度提升 |
| Sun landing z-index 切換不夠精準 | Low | 使用 `useMotionValueEvent` 監聽 scrollProgress 閾值切換 |
