import { action } from '@void/react';
import { useState } from 'react';
import type { Props } from './index.server';
import { DISHES, HIGHLIGHTS, INFO, SOURCES } from '../lib/menu-data';
import CREDITS from '../lib/photo-credits.json';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Home({ counts }: Props) {
  const [voting, setVoting] = useState<string | null>(null);

  async function recommend(dishId: string) {
    setVoting(dishId);
    await action('/', { data: { dishId } }); // 成功後頁面會自動拿到新的推薦數
    setVoting(null);
  }

  // 推薦榜：推薦數多的排前面，長條的長度跟第一名比
  const ranked = [...DISHES].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0)).slice(0, 3);
  const top = Math.max(1, ...ranked.map((d) => counts[d.id] ?? 0));

  return (
    <>
      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">食在輔大 · EAT AT FJU</p>
          <h1>心園餐廳</h1>
          <p className="lead">藏在宿舍地下室的平價食堂。<br />下課走幾步，十塊錢就有一大杯現榨果汁。</p>
          <a className="cta" href="#menu">看看必吃清單 ↓</a>
        </div>
        <div className="collage" aria-hidden>
          <img src="/img/juice.jpg" alt="" />
          <img src="/img/curry.jpg" alt="" />
          <img src="/img/dumplings.jpg" alt="" />
        </div>
      </header>

      <main>
        <section className="highlights">
          {HIGHLIGHTS.map((h) => (
            <div key={h.big} className="highlight">
              <strong>{h.big}</strong>
              <span>{h.label}</span>
            </div>
          ))}
        </section>

        <section id="menu">
          <h2>必吃清單</h2>
          <p className="hint">吃過覺得好吃就按 ❤️，下面的推薦榜會即時更新。</p>
          <ul className="dishes">
            {DISHES.map((d) => (
              <li key={d.id} className="dish">
                <div className="photo" style={{ backgroundImage: `url(${d.photo})` }}>
                  <span className="price">{d.price}</span>
                </div>
                <div className="dish-body">
                  <span className="shop">{d.shop}</span>
                  <h3>{d.name}</h3>
                  <p className="note">{d.note}</p>
                  <button onClick={() => recommend(d.id)} disabled={voting === d.id}>
                    ❤️ 推薦 <span className="count">{counts[d.id] ?? 0}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="ranking card">
          <h2>同學推薦榜</h2>
          <ol>
            {ranked.map((d, i) => (
              <li key={d.id}>
                <span className="medal">{MEDALS[i]}</span>
                <span className="rank-name">{d.name}</span>
                <span className="bar"><span style={{ width: `${((counts[d.id] ?? 0) / top) * 100}%` }} /></span>
                <span className="votes">{counts[d.id] ?? 0}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="visit card">
          <img className="visit-photo" src="/img/hero.jpg" alt="輔仁大學校門" />
          <h2>怎麼去</h2>
          <dl>
            <dt>📍 位置</dt><dd>{INFO.location}</dd>
            <dt>🏫 地址</dt><dd>{INFO.address}</dd>
            <dt>🕗 營業</dt><dd>{INFO.hours}</dd>
            <dt>🖨️ 附近</dt><dd>{INFO.others}</dd>
          </dl>
          <a className="map-link" href={INFO.mapUrl} target="_blank" rel="noreferrer">在 Google 地圖打開</a>
        </section>
      </main>

      <footer>
        <p>大學入門課作業「食在輔大」，非輔大官方網站。價格與營業時間參考下列報導，實際以現場為準。</p>
        <ul>
          {SOURCES.map((s) => (
            <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>
          ))}
        </ul>
        <p>照片為維基共享資源的示意照，非心園實拍：</p>
        <ul className="credits">
          {CREDITS.map((c) => (
            <li key={c.file}><a href={c.url} target="_blank" rel="noreferrer">{c.author}</a>，{c.license}</li>
          ))}
        </ul>
      </footer>
    </>
  );
}
