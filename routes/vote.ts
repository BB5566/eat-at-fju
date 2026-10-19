import { votes } from '@schema';
import { defineHandler } from 'void';
import { db, sql } from 'void/db';
import { DISHES } from '../lib/menu-data';
import { live, VOTES_TOPIC } from '../src/live';

// 推播給大家的內容：哪道菜、現在幾票、誰按的（自己按的不用跳通知）
export interface VoteEvent {
  dishId: string;
  count: number;
  clientId: string;
}

// 按「推薦」：這道菜 +1，再把新票數推播給所有人。只接受菜單上有的菜。
// 用獨立 API 而不是頁面 action：頁面 action 送完會重新載入頁面、捲回頁首
export const POST = defineHandler(async (c) => {
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
  return c.json(event);
});
