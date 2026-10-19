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
    { name: 'description', content: '輔大心園餐廳：10 元現榨果汁、銅板價水餃與咖哩飯，學生的平價好去處。' },
    { name: 'theme-color', content: '#e2552d' },
  ],
  link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
}));
