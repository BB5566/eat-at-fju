// 即時推播：有人按推薦，所有開著網頁的人都會收到新的票數。
// 不用登入就能看，所以允許匿名連線；只有一個公開的 topic「votes」。
import { defineLiveStream } from 'void/live';

export const VOTES_TOPIC = 'votes';

export const live = defineLiveStream({
  id: 'eat-at-fju',
  allowAnonymousControl: true,
  onSubscribe(ctx) {
    if (ctx.topic !== VOTES_TOPIC) return new Response('Forbidden', { status: 403 });
  },
});
