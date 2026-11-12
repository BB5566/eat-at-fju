import { useMemo, useState } from 'react';
import { CHEAPEST_MEAL, findCombos } from '../lib/budget';

const LABELS = ['最接近預算', '換個口味', '再一種'];

export function BudgetPlanner() {
  const [budget, setBudget] = useState(100);
  const combos = useMemo(() => findCombos(budget), [budget]);

  return (
    <section id="planner" className="planner panel reveal">
      <p className="sec-tag">計算機</p>
      <h2>預算多少，吃什麼</h2>
      <p className="hint">拉一下今天的預算，幫你配一餐：一樣主食，加飲料或點心。現場計價的自助餐和滷味不算在內。</p>
      <label className="budget">
        <span>預算</span>
        <input type="range" min={20} max={150} step={5} value={budget}
          onChange={(e) => setBudget(Number(e.target.value))} aria-valuetext={`${budget} 元`} />
        <output>${budget}</output>
      </label>
      {combos.length === 0 ? (
        <p className="empty">最便宜的主食是 {CHEAPEST_MEAL} 元，再加一點就有得吃。</p>
      ) : (
        <ol className="combos">
          {combos.map((combo, i) => (
            <li key={combo.items.map((x) => x.dish.id + x.qty).join()}>
              <span className="combo-tag">{LABELS[i]}</span>
              <p>
                {combo.items.map((x) => (x.dish.id === 'dumplings' ? `水餃 ${x.qty * 5} 顆` : x.dish.name)).join(' ＋ ')}
              </p>
              <strong>
                ${combo.total}
                <small>剩 ${budget - combo.total}</small>
              </strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
