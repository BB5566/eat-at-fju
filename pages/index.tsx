import { action } from '@void/react';
import { useState } from 'react';
import type { Props } from './index.server';
import { DISHES, INFO, SOURCES } from '../lib/menu-data';

export default function Home({ counts }: Props) {
  const [voting, setVoting] = useState<string | null>(null);

  async function recommend(dishId: string) {
    setVoting(dishId);
    await action('/', { data: { dishId } }); // 成功後頁面會自動拿到新的推薦數
    setVoting(null);
  }

  // 推薦榜：推薦數多的排前面
  const ranked = [...DISHES].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0));

  return (
    <main>
      <header className="hero">
        <p className="eyebrow">食在輔大</p>
        <h1>心園餐廳</h1>
        <p className="lead">藏在宿舍地下室的平價食堂。10 元一大杯現榨果汁，32 年沒漲價。</p>
      </header>

      <section className="card info">
        <h2>怎麼去</h2>
        <dl>
          <dt>位置</dt><dd>{INFO.location}</dd>
          <dt>地址</dt><dd>{INFO.address}</dd>
          <dt>營業時間</dt><dd>{INFO.hours}</dd>
          <dt>附近</dt><dd>{INFO.others}</dd>
        </dl>
      </section>

      <section>
        <h2>必吃清單</h2>
        <p className="hint">吃過覺得好吃就按「推薦」，下面的推薦榜會即時更新。</p>
        <ul className="dishes">
          {DISHES.map((d) => (
            <li key={d.id} className="card dish">
              <span className="emoji" aria-hidden>{d.emoji}</span>
              <div className="body">
                <h3>{d.name}</h3>
                <p className="price">{d.price}<span className="shop">・{d.shop}</span></p>
                <p className="note">{d.note}</p>
              </div>
              <button onClick={() => recommend(d.id)} disabled={voting === d.id}>
                👍 推薦 <span className="count">{counts[d.id] ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>同學推薦榜</h2>
        <ol className="ranking">
          {ranked.slice(0, 3).map((d) => (
            <li key={d.id}>{d.emoji} {d.name}<span className="count">{counts[d.id] ?? 0} 票</span></li>
          ))}
        </ol>
      </section>

      <footer>
        <p>大學入門課作業「食在輔大」，非輔大官方網站。價格與營業時間參考下列報導，實際以現場為準。</p>
        <ul>
          {SOURCES.map((s) => (
            <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>
          ))}
        </ul>
      </footer>
    </main>
  );
}
