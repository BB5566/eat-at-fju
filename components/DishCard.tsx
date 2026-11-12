import { useState } from 'react';
import type { Dish } from '../lib/menu-data';
import CREDITS from '../lib/photo-credits.json';

interface Props {
  dish: Dish;
  count: number;
  voted: boolean;
  highlighted: boolean;
  onRecommend: () => void;
}

// 照片下面的小字：誰拍的、哪個月（照片都來自 Google 地圖使用者）
export function creditFor(name: string) {
  const c = CREDITS.find((x) => x.file === name);
  return c ? `攝影 ${c.author}・${c.date}` : '';
}

// 響應式圖片：有 480／720／960 三種寬度，瀏覽器依 sizes（這張圖在畫面上多寬）挑最小夠用的
export function Photo({ name, alt, priority = false, sizes = '(max-width: 560px) 112px, 260px' }:
  { name: string; alt: string; priority?: boolean; sizes?: string }) {
  return (
    <img
      src={`/img/${name}-480.webp`}
      srcSet={`/img/${name}-480.webp 480w, /img/${name}-720.webp 720w, /img/${name}-960.webp 960w`}
      sizes={sizes}
      alt={alt}
      width={480}
      height={360}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}

export function DishCard({ dish, count, voted, highlighted, onRecommend }: Props) {
  // 每按一次噴出一圈小紅點，動畫跑完就清掉
  const [bursts, setBursts] = useState<number[]>([]);

  function click() {
    onRecommend();
    if (voted) return;
    const id = Date.now();
    setBursts((b) => [...b, id]);
    setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 900);
  }

  return (
    <li id={`dish-${dish.id}`} className={`dish${highlighted ? ' picked' : ''}`} style={{ viewTransitionName: `dish-${dish.id}` }}>
      <figure className="photo">
        <Photo name={dish.photo} alt={dish.name} />
        <figcaption>{creditFor(dish.photo)}</figcaption>
      </figure>
      <div className="dish-body">
        <p className="dish-head">
          <span className="shop">{dish.shop}</span>
          <span className={`price${dish.cost === undefined ? ' text' : ''}`}>{dish.price}</span>
        </p>
        <h3>{dish.name}</h3>
        <p className="note">{dish.note}</p>
        <button className={`vote${voted ? ' done' : ''}`} onClick={click} aria-pressed={voted}>
          {voted ? '已推薦' : '推薦'}<span className="sr-only">{dish.name}，目前票數</span>
          <span className="count" aria-live="polite">{count}</span>
          {bursts.map((id) => (
            <span key={id} className="burst" aria-hidden>
              {Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--a': `${i * 45}deg` } as React.CSSProperties} />)}
            </span>
          ))}
        </button>
      </div>
    </li>
  );
}
