# 食在輔大：心園餐廳

大學入門課作業。用 [Void](https://void.cloud/)（Vite＋Cloudflare）做的一頁式介紹網站，含「同學推薦」按讚功能（D1 資料庫，所有人畫面即時更新）。

## 待辦（交作業前）
- [x] **上線**（2026-10-19）：https://eat-at-fju.mobbsong.workers.dev
- [x] 正式網址 Lighthouse（手機）：效能 96、無障礙 100、最佳做法 100、SEO 100（LCP 1.9 秒、CLS 0）
- [ ] 到心園現場確認價格與營業時間，改 `lib/menu-data.ts`（目前是 2023 年報導的資料）
- [ ] 拍心園實拍照，換掉 `public/img/` 的示意照（同檔名，480／720／960 三種寬度的 webp）

## 本機跑起來
```sh
npm install
npm run dev
```
打開 http://localhost:5173

## 上線（部署到自己的 Cloudflare 帳號，免費額度內）
```sh
npx void connect --platform cloudflare   # 第一次：開瀏覽器登入 Cloudflare、選帳號
npx void deploy --platform cloudflare    # 打包並上線，完成後印出網址
```
直接 `npx void deploy` 會報「No Void platform connected」，因為預設是 Void 自家平台。

## 檔案
- `lib/menu-data.ts`：店家、菜色、價格、資料來源（價格是 2023 年報導，交作業前到現場確認）
- `pages/index.tsx`：頁面
- `pages/index.server.ts`：讀推薦數（loader）、網頁標題與描述
- `routes/vote.ts`：按推薦（+1 後推播給所有人）。不用頁面 action，因為它送完會捲回頁首
- `routes/live.ts`、`src/live.ts`：即時推播（Durable Objects）
- `components/`：菜色卡片、今天吃什麼、百元計算機、推薦邏輯（`useVotes.ts`）
- `lib/budget.ts`：百元計算機的配餐規則
- `db/schema.ts`：推薦數資料表
- `public/img/`：維基共享資源的示意照（作者與授權在 `lib/photo-credits.json`，頁尾會列出）。有心園實拍照就用同檔名蓋掉
