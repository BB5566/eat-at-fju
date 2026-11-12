import { useState } from 'react';
import { flushSync } from 'react-dom';
import type { Props } from './index.server';
import { CATEGORIES, DISHES, HERO_TAGS, HOURS, INFO, PRICE_BOARD, SOURCES, UPDATED, type Category } from '../lib/menu-data';
import CREDITS from '../lib/photo-credits.json';
import { BudgetPlanner } from '../components/BudgetPlanner';
import { DishCard, Photo, creditFor } from '../components/DishCard';
import { FoodPicker } from '../components/FoodPicker';
import { useVotes } from '../components/useVotes';

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
  const ranked = [...DISHES].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0)).slice(0, 5);
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
      <nav className="topbar" aria-label="頁面段落">
        <a className="brand" href="#top">食在輔大</a>
        <a href="#menu">必吃</a>
        <a href="#board">價目</a>
        <a href="#picker">抽籤</a>
        <a href="#visit">怎麼去</a>
        <a href="#about">關於</a>
      </nav>

      {/* 首圖：左邊標題和三張直式價目牌（照果汁吧牆上掛的牌子做），右邊用餐區實景 */}
      <header id="top" className="hero">
        <div className="hero-text">
          <p className="kicker"><span className="banner">輔大學生餐廳</span><span>{UPDATED}更新</span></p>
          <h1>心園餐廳</h1>
          <p className="lead">{INFO.location}。下課走幾步，十塊錢一杯檸檬汁、三十五塊一碗乾麵。</p>
          <ul className="tags" aria-label="代表價格">
            {HERO_TAGS.map((t) => (
              <li key={t.name} className={`tag ink-${t.ink}`}>
                <span className="tag-name">{t.name}</span>
                <span className="tag-price">{t.price}</span>
              </li>
            ))}
          </ul>
          <div className="actions">
            <a className="btn" href="#board">看完整價目</a>
            <a className="btn ghost" href="#menu">必吃清單</a>
          </div>
        </div>
        <figure className="hero-fig">
          <img
            src="/img/hall-960.webp"
            srcSet="/img/hall-720.webp 720w, /img/hall-960.webp 960w, /img/hall-1440.webp 1440w"
            sizes="(max-width: 860px) 100vw, 56vw"
            alt="心園的用餐區，一排排灰色長桌"
            width={1440}
            height={1080}
            fetchPriority="high"
            decoding="async"
          />
          <figcaption>心園用餐區｜{creditFor('hall')}</figcaption>
        </figure>
      </header>

      <main>
        <section id="menu" className="block">
          <div className="sec-head">
            <p className="sec-tag">必吃</p>
            <h2>必吃清單</h2>
            <p className="hint">吃過覺得好吃就按「推薦」，所有人的畫面會即時更新。照片都是 Google 地圖上同學拍的。</p>
          </div>
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
            {/* 佔兩格：每個分類的卡片數加上它剛好排滿一列 */}
            <li className="more-card">
              <h3>還想吃別的？</h3>
              <p>麵食部的湯麵、燴飯、小菜，鬆餅屋的鹹鬆餅和茶飲，價格都抄在價目板上。</p>
              <a className="btn" href="#board">看完整價目板</a>
            </li>
          </ul>
        </section>

        {/* 價目板：照各攤牆上的價目牌抄，每一區標照片是哪個月拍的 */}
        <section id="board" className="block">
          <div className="sec-head">
            <p className="sec-tag">價目</p>
            <h2>完整價目板</h2>
            <p className="hint">照 Google 地圖上同學拍的價目牌整理，單位是新台幣。價格會調整，以現場為準。</p>
          </div>
          <div className="board">
            {PRICE_BOARD.map((s) => (
              <article key={s.shop} className={`stall stall-${s.groups.length > 1 ? 'wide' : 'narrow'}`}>
                <header>
                  <h3>{s.shop}</h3>
                  <span>{s.date}價目</span>
                </header>
                {s.photo && (
                  <figure className="stall-fig">
                    <Photo name={s.photo} alt={`${s.shop}的店面`} sizes="(max-width: 860px) 92vw, 360px" />
                    <figcaption>{creditFor(s.photo)}</figcaption>
                  </figure>
                )}
                <div className="stall-groups">
                  {s.groups.map((g, i) => (
                    <div key={g.title ?? i} className="group">
                      {g.title && <h4>{g.title}</h4>}
                      <ul className={g.items.length > 3 && g.items.every(([n, p]) => n.length <= 6 && p.length <= 3) ? 'two' : undefined}>
                        {g.items.map(([name, price]) => (
                          <li key={name}><span>{name}</span><b>{price}</b></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {s.note && <p className="stall-note">{s.note}</p>}
              </article>
            ))}
          </div>
        </section>

        <div className="tools block">
          <FoodPicker onPick={pick} />
          <BudgetPlanner />
        </div>

        <section className="ranking panel reveal block">
          <p className="sec-tag">即時</p>
          <h2>同學推薦榜 <span className="live-dot">LIVE</span></h2>
          <p className="hint">{ranked.some((d) => (counts[d.id] ?? 0) > 0)
            ? '在上面的必吃清單按「推薦」，名次會即時變動。'
            : '還沒有人推薦。在上面的必吃清單按一下，這裡和所有人的畫面會同時更新。'}</p>
          <ol>
            {ranked.map((d, i) => (
              <li key={d.id}>
                <span className="rank-no">{i + 1}</span>
                <span className="rank-name">{d.name}</span>
                <span className="bar"><span style={{ width: `${((counts[d.id] ?? 0) / top) * 100}%` }} /></span>
                <span className="votes">{counts[d.id] ?? 0}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="visit" className="visit block reveal">
          <figure className="visit-fig">
            <Photo name="entrance" alt="信義和平學苑的入口，心園在這棟的地下一樓" sizes="(max-width: 860px) 92vw, 460px" />
            <figcaption>信義和平學苑入口｜{creditFor('entrance')}</figcaption>
          </figure>
          <div className="visit-text">
            <p className="sec-tag">交通</p>
            <h2>怎麼去</h2>
            <dl className="facts">
              <dt>位置</dt><dd>{INFO.location}</dd>
              <dt>地址</dt><dd>{INFO.address}</dd>
              <dt>電話</dt><dd><a href={`tel:${INFO.phone.replaceAll('-', '')}`}>{INFO.phone}</a></dd>
            </dl>
            <table className="hours">
              <caption>營業時間</caption>
              <tbody>
                {HOURS.map((h) => (
                  <tr key={h.who}>
                    <th scope="row">{h.who}</th>
                    <td>{h.when.map((w) => <span key={w}>{w}</span>)}<small>{h.src}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="hint">{INFO.others}</p>
            <a className="btn dark" href={INFO.mapUrl} target="_blank" rel="noreferrer">在 Google 地圖打開</a>
          </div>
        </section>

        {/* 課堂報告用：這個網站的資料怎麼來、做了什麼、怎麼做的 */}
        <section id="about" className="about block">
          <div className="sec-head">
            <p className="sec-tag">關於</p>
            <h2>關於這個網站</h2>
            <p className="hint">大學入門課「食在輔大」作業，介紹宿舍地下室的心園餐廳。</p>
          </div>
          <div className="about-cols">
            <div>
              <h3>資料怎麼來</h3>
              <ul>
                <li>價格：Google 地圖上同學拍的價目牌，每一攤標出拍攝月份（2024 年 10 月～2026 年 9 月）。</li>
                <li>營業時間：Google 地圖店家資訊、評論，和鬆餅屋門口的公告。</li>
                <li>照片：Google 地圖上的心園實拍，每張都標拍攝者和月份。</li>
              </ul>
            </div>
            <div>
              <h3>可以做什麼</h3>
              <ul>
                <li>必吃清單：主食、飲料、點心分類看。</li>
                <li>完整價目板：麵食部、果汁吧、鬆餅屋、水果攤整理在一起。</li>
                <li>今天吃什麼：隨機抽一道。</li>
                <li>預算計算機：輸入預算，配出三種吃法。</li>
                <li>同學推薦：一個人按，所有人的畫面同時更新。</li>
              </ul>
            </div>
            <div>
              <h3>怎麼做的</h3>
              <ul>
                <li>React 19＋TypeScript，用 Void 開發。</li>
                <li>放在 Cloudflare Workers；推薦數存在 D1 資料庫，即時更新用 Durable Objects。</li>
                <li>照片做成三種寬度的 WebP，手機只下載需要的大小。</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <div className={`toast${notice ? ' show' : ''}`} role="status">{notice}</div>

      <footer>
        <p>大學入門課作業「食在輔大」，不是輔大或心園的官方網站。價格與營業時間整理於 {UPDATED}，實際以現場為準。</p>
        <h3>資料來源</h3>
        <ul>
          {SOURCES.map((s) => (
            <li key={s.title}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>
          ))}
        </ul>
        <h3>照片（皆取自 Google 地圖「心園餐廳」的使用者相片）</h3>
        <ul className="credits">
          {CREDITS.map((c) => (
            <li key={c.file}>{c.what}：{c.author}，{c.date}</li>
          ))}
        </ul>
      </footer>
    </>
  );
}
