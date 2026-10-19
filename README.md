# 食在輔大：心園餐廳

大學入門課作業。用 [Void](https://void.cloud/)（Vite＋Cloudflare）做的一頁式介紹網站，含「同學推薦」按讚功能（D1 資料庫）。

## 本機跑起來
```sh
npm install
npm run dev
```
打開 http://localhost:5173

## 上線
```sh
npx void deploy
```
第一次會開瀏覽器登入 Cloudflare，完成後印出網址。

## 檔案
- `lib/menu-data.ts`：店家、菜色、價格、資料來源（價格是 2023 年報導，交作業前到現場確認）
- `pages/index.tsx`：頁面
- `pages/index.server.ts`：讀推薦數（loader）、按推薦（action）
- `db/schema.ts`：推薦數資料表
- `public/img/`：維基共享資源的示意照（作者與授權在 `lib/photo-credits.json`，頁尾會列出）。有心園實拍照就用同檔名蓋掉
