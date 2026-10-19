import { useState } from 'react';
import type { Dish } from '../lib/menu-data';

interface Props {
  dish: Dish;
  count: number;
  voted: boolean;
  highlighted: boolean;
  onRecommend: () => void;
}

// 響應式圖片：有 480／720／960 三種寬度，瀏覽器依 sizes（這張圖在畫面上多寬）挑最小夠用的
export function Photo({ name, alt, priority = false, sizes = '(max-width: 560px) 92vw, 240px' }:
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
  // 每按一次產生一批小愛心，動畫跑完就清掉
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
      <div className="photo">
        <Photo name={dish.photo} alt={dish.name} />
        <span className="price">{dish.price}</span>
      </div>
      <div className="dish-body">
        <span className="shop">{dish.shop}</span>
        <h3>{dish.name}</h3>
        <p className="note">{dish.note}</p>
        <button className={`heart${voted ? ' done' : ''}`} onClick={click} aria-pressed={voted}>
          <span aria-hidden>{voted ? '❤️' : '🤍'}</span> {voted ? '已推薦' : '推薦'}<span className="sr-only">{dish.name}，目前票數</span>
          <span className="count" aria-live="polite">{count}</span>
          {bursts.map((id) => (
            <span key={id} className="burst" aria-hidden>
              {Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--a': `${i * 45}deg` } as React.CSSProperties}>❤</i>)}
            </span>
          ))}
        </button>
      </div>
    </li>
  );
}
