# Portfolio — Space Journey

一個以「太空旅程」為主題的互動式個人作品集網站。使用者透過滾動畫面，搭乘火箭依序經過 8 顆行星，每顆行星代表一個專案展示。

## 功能特色

- 🚀 **滾動互動動畫**：滾動頁面時觸發火箭飛行與行星呈現效果
- 🪐 **行星專案展示**：8 顆行星（Saturn、Moon、Jupiter、Mars、Uranus、Neptune、Venus、Mercury）對應不同專案
- 📝 **Notion 驅動內容**：專案資料透過 Notion API 即時取得與管理
- 💬 **聯絡表單**：可在任意位置開啟的 Contact Dialog
- 🌍 **多語系支援**：繁體中文（zh-TW）與英文切換
- ⭐ **星空背景與細節動畫**：StarField、TrajectoryPath 等視覺效果

## 技術架構

- **框架**：Next.js 14（App Router）+ TypeScript
- **UI**：React 18、Tailwind CSS、Framer Motion（動畫）、Radix UI、Lucide React（icon）
- **內容來源**：Notion API（@notionhq/client）
- **多語系**：next-intl
- **測試**：Vitest + Testing Library
- **套件管理**：pnpm

## 專案結構

```
src/
├── app/[locale]/      # Next.js App Router 頁面（支援多語系路由）
├── components/        # React 元件
│   ├── dialog/        # 專案 / 聯絡表單彈窗
│   ├── planet/        # 行星節點與 hover 卡片
│   ├── space/         # 星空背景、地球、飛行軌跡
│   ├── rocket/        # 火箭動畫
│   ├── sun/           # 結尾區塊與聯絡按鈕
│   ├── nav/           # 導覽列、語言切換
│   └── ui/            # 共用 UI 元件
├── context/           # React Context（聯絡表單狀態等）
├── hooks/             # 自訂 hooks（滾動火箭、行星鍵盤導覽）
├── lib/               # 工具函式（Notion 串接、個人資料、常數）
├── types/             # TypeScript 型別定義
├── i18n/              # 多語系設定
└── messages/          # 多語系翻譯文字
```

## 開始使用

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 建置正式版本
pnpm build

# 啟動正式伺服器
pnpm start

# 程式碼檢查
pnpm lint

# TypeScript 型別檢查
pnpm type-check

# 執行測試
pnpm test
```

開發伺服器啟動後，於瀏覽器開啟 [http://localhost:3000](http://localhost:3000) 即可查看。
