import { votes } from '@schema';
import { defineHandler, defineHead } from 'void';
import type { InferProps } from 'void';
import { db } from 'void/db';

export type Props = InferProps<typeof loader>;

// 讀出每道菜的推薦數（還沒人推薦的算 0）。按推薦走 routes/vote.ts
export const loader = defineHandler(async () => {
  const rows = await db.select().from(votes);
  const counts = Object.fromEntries(rows.map((r) => [r.dishId, r.count]));
  return { counts: counts as Record<string, number> };
});

export const head = defineHead(() => ({
  title: '心園餐廳',
  meta: [
    { name: 'description', content: '輔大心園餐廳（信義和平學苑地下一樓）：檸檬汁 10 元、乾麵 35 元、水餃一顆 5 元。完整價目、營業時間與實拍照片，2026 年 11 月整理。' },
    { name: 'theme-color', content: '#f6f4ee' },
  ],
  link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
}));
