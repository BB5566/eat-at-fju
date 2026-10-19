// 推薦數的所有邏輯都在這裡：
// 1. 按下去馬上 +1（不用等伺服器），失敗再退回
// 2. 收到別人的推薦（即時推播）就更新數字，並回傳一則通知文字
// 3. 每台裝置每道菜只能推薦一次（記在 localStorage）
import { useEffect, useState } from 'react';
import { connectLiveStream } from 'void/live/client';
import type { VoteEvent } from '../routes/vote';
import { DISHES } from '../lib/menu-data';

const VOTED_KEY = 'xinyuan-voted';

function readVoted(): string[] {
  try {
    return JSON.parse(localStorage.getItem(VOTED_KEY) || '[]');
  } catch {
    return [];
  }
}

// 每個分頁一個隨機代號，用來分辨「自己按的」推播。
// 要等到瀏覽器裡用到才產生：Cloudflare Workers 不准在模組最外層產生亂數（伺服器渲染會直接 500）
let clientId = '';
function getClientId() {
  if (!clientId) clientId = crypto.randomUUID();
  return clientId;
}

export function useVotes(initial: Record<string, number>) {
  const [counts, setCounts] = useState(initial);
  const [voted, setVoted] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => setVoted(readVoted()), []);

  // 訂閱即時推播
  useEffect(() => {
    const stream = connectLiveStream('/live', { retryDelay: 2_000 });
    stream.subscribe({
      id: 'votes',
      topic: 'votes',
      onEvent(event) {
        const vote = event.data as VoteEvent;
        setCounts((prev) => ({ ...prev, [vote.dishId]: Math.max(prev[vote.dishId] ?? 0, vote.count) }));
        if (vote.clientId !== getClientId()) {
          const dish = DISHES.find((d) => d.id === vote.dishId);
          if (dish) setNotice(`有同學剛推薦了「${dish.name}」`);
        }
      },
    });
    return () => stream.close();
  }, []);

  // 通知 3 秒後自己消失
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3_000);
    return () => clearTimeout(timer);
  }, [notice]);

  async function recommend(dishId: string) {
    // 推薦過的再按，跳提示讓人知道按鈕有反應
    if (voted.includes(dishId)) {
      setNotice('你已經推薦過這道了，一道菜只能推薦一次');
      return;
    }
    const nextVoted = [...voted, dishId];
    setVoted(nextVoted);
    setCounts((prev) => ({ ...prev, [dishId]: (prev[dishId] ?? 0) + 1 }));
    try {
      localStorage.setItem(VOTED_KEY, JSON.stringify(nextVoted));
    } catch {
      // 無痕模式等情況存不了，不影響推薦
    }
    const res = await fetch('/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishId, clientId: getClientId() }),
    }).catch(() => null);
    if (!res?.ok) {
      setVoted(voted);
      setCounts((prev) => ({ ...prev, [dishId]: (prev[dishId] ?? 1) - 1 }));
    }
  }

  return { counts, voted, notice, recommend };
}
