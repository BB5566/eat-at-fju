import { useRef, useState } from 'react';
import { DISHES } from '../lib/menu-data';
import { Photo } from './DishCard';

// 今天吃什麼：像拉霸一樣快速輪播，越轉越慢，停下來就捲到那道菜
export function FoodPicker({ onPick }: { onPick: (dishId: string) => void }) {
  const [index, setIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = Math.floor(Math.random() * DISHES.length);
    let steps = reduceMotion ? 0 : 18 + target;
    let delay = 50;
    let current = index;

    const tick = () => {
      current = (current + 1) % DISHES.length;
      setIndex(current);
      if (steps-- > 0) {
        delay *= 1.12;
        timer.current = setTimeout(tick, delay);
      } else {
        setSpinning(false);
        onPick(DISHES[current].id);
      }
    };
    if (reduceMotion) {
      setIndex(target);
      setSpinning(false);
      onPick(DISHES[target].id);
    } else {
      tick();
    }
  }

  const dish = DISHES[index];
  return (
    <section id="picker" className="picker panel reveal">
      <div className="picker-text">
        <p className="sec-tag">抽籤</p>
        <h2>今天吃什麼</h2>
        <p className="hint">不想選就交給它，抽到的菜會在清單裡亮起來。</p>
        <button className="btn" onClick={spin} disabled={spinning}>{spinning ? '抽籤中…' : '幫我選一道'}</button>
      </div>
      <figure className={`slot${spinning ? ' spinning' : ''}`} aria-live="polite">
        <Photo name={dish.photo} alt={dish.name} sizes="(max-width: 560px) 92vw, 320px" />
        <figcaption><b>{dish.name}</b><span>{dish.price}</span></figcaption>
      </figure>
    </section>
  );
}
