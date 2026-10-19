import { useState } from 'react';
import { flushSync } from 'react-dom';
import type { Props } from './index.server';
import { CATEGORIES, DISHES, HIGHLIGHTS, INFO, SOURCES, type Category } from '../lib/menu-data';
import CREDITS from '../lib/photo-credits.json';
import { BudgetPlanner } from '../components/BudgetPlanner';
import { DishCard, Photo } from '../components/DishCard';
import { FoodPicker } from '../components/FoodPicker';
import { useVotes } from '../components/useVotes';

const MEDALS = ['🥇', '🥈', '🥉'];

// 有支援 View Transitions 的瀏覽器，切換時卡片會平滑移動；沒支援就直接切
function withTransition(update: () => void) {
  if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(() => flushSync(update));
  } else {
    update();
  }
}

export default function Home(props: Props) {
  const { counts, voted, notice, recommend } = useVotes(props.counts);
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [picked, setPicked] = useState<string | null>(null);

  const shown = DISHES.filter((d) => filter === 'all' || d.category === filter);
  const ranked = [...DISHES].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0)).slice(0, 3);
  const top = Math.max(1, ...ranked.map((d) => counts[d.id] ?? 0));

  // 抽到的菜：切回「全部」，捲過去並閃一下
  function pick(dishId: string) {
    withTransition(() => setFilter('all'));
    setPicked(dishId);
    setTimeout(() => document.getElementById(`dish-${dishId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    setTimeout(() => setPicked(null), 2_500);
  }

  return (
    <>
      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">食在輔大 · EAT AT FJU</p>
          <h1>心園<br />餐廳</h1>
          <p className="lead">藏在宿舍地下室的平價食堂。<br />下課走幾步，十塊錢就有一大杯現榨果汁。</p>
          <a className="cta" href="#menu">看看必吃清單 ↓</a>
        </div>
        <div className="collage" aria-hidden>
          <Photo name="juice" alt="" priority sizes="(max-width: 760px) 55vw, 300px" />
          <Photo name="curry" alt="" priority sizes="(max-width: 760px) 55vw, 300px" />
          <Photo name="dumplings" alt="" priority sizes="(max-width: 760px) 55vw, 300px" />
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
          <p className="hint">吃過覺得好吃就按 🤍，所有人的畫面會即時更新。</p>
          <div className="chips" role="group" aria-label="分類">
            {CATEGORIES.map((c) => (
              <button key={c.id} className={`chip${filter === c.id ? ' on' : ''}`} aria-pressed={filter === c.id}
                onClick={() => withTransition(() => setFilter(c.id))}>
                {c.label}
              </button>
            ))}
          </div>
          <ul className="dishes">
            {shown.map((d) => (
              <DishCard key={d.id} dish={d} count={counts[d.id] ?? 0} voted={voted.includes(d.id)}
                highlighted={picked === d.id} onRecommend={() => recommend(d.id)} />
            ))}
          </ul>
        </section>

        <FoodPicker onPick={pick} />
        <BudgetPlanner />

        <section className="ranking card reveal">
          <h2>同學推薦榜 <span className="live-dot" title="即時更新">LIVE</span></h2>
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

        <section className="visit card reveal">
          <img className="visit-photo" src="/img/hero-960.webp" alt="輔仁大學校門" width={960} height={747} loading="lazy" />
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

      <div className={`toast${notice ? ' show' : ''}`} role="status">{notice}</div>

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
        <p className="tech">技術：Void（Vite＋Cloudflare Workers）· React 19 · D1 資料庫 · Durable Objects 即時推播 · View Transitions · CSS 捲動動畫 · 響應式 WebP</p>
      </footer>
    </>
  );
}
