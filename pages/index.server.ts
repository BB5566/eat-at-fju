import { votes } from '@schema';
import { defineHandler, defineHead } from 'void';
import type { InferProps } from 'void';
import { db, sql } from 'void/db';
import { DISHES } from '../lib/menu-data';
import { live, VOTES_TOPIC } from '../src/live';

export type Props = InferProps<typeof loader>;

// 推播給大家的內容：哪道菜、現在幾票、誰按的（自己按的不用跳通知）
export interface VoteEvent {
  dishId: string;
  count: number;
  clientId: string;
}

// 讀出每道菜的推薦數（還沒人推薦的算 0）
export const loader = defineHandler(async () => {
  const rows = await db.select().from(votes);
  const counts = Object.fromEntries(rows.map((r) => [r.dishId, r.count]));
  return { counts: counts as Record<string, number> };
});

// 按「推薦」：這道菜 +1，再把新票數推播給所有人。只接受菜單上有的菜
export const action = defineHandler(async (c) => {
  const { dishId, clientId } = await c.req.json<{ dishId: string; clientId: string }>();
  if (!DISHES.some((d) => d.id === dishId)) {
    return c.json({ message: '沒有這道菜' }, 400);
  }
  const [row] = await db
    .insert(votes)
    .values({ dishId, count: 1 })
    .onConflictDoUpdate({ target: votes.dishId, set: { count: sql`${votes.count} + 1` } })
    .returning();
  const event: VoteEvent = { dishId, count: row.count, clientId: String(clientId).slice(0, 40) };
  await live.publish(VOTES_TOPIC, event, { type: 'vote' });
});

export const head = defineHead(() => ({
  title: '心園餐廳',
  meta: [
    { name: 'description', content: '輔大心園餐廳：10 元現榨果汁、銅板價水餃與咖哩飯，學生的平價好去處。' },
    { name: 'theme-color', content: '#e2552d' },
  ],
  link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
}));
