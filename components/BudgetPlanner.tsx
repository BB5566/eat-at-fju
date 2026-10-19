import { useMemo, useState } from 'react';
import { findCombos } from '../lib/budget';

const LABELS = ['💰 花好花滿', '🍽 換個口味', '🎲 再一種'];

export function BudgetPlanner() {
  const [budget, setBudget] = useState(100);
  const combos = useMemo(() => findCombos(budget), [budget]);

  return (
    <section className="planner card reveal">
      <h2>百元吃飽計算機</h2>
      <p className="hint">拉一下你今天的預算，幫你配好一餐：一樣主食、一杯飲料、加點心。</p>
      <label className="budget">
        <span>預算</span>
        <input type="range" min={30} max={150} step={5} value={budget}
          onChange={(e) => setBudget(Number(e.target.value))} aria-valuetext={`${budget} 元`} />
        <output>${budget}</output>
      </label>
      {combos.length === 0 ? (
        <p className="empty">這個預算還吃不到主食，再加一點吧！</p>
      ) : (
        <ol className="combos">
          {combos.map((combo, i) => (
            <li key={combo.items.map((x) => x.dish.id + x.qty).join()}>
              <span className="combo-tag">{LABELS[i]}</span>
              <p>
                {combo.items.map((x) => (x.dish.id === 'dumplings' ? `水餃 ${x.qty * 5} 顆` : x.dish.name)).join(' ＋ ')}
              </p>
              <strong>
                {combo.items.some((x) => x.dish.approx) ? '約 ' : ''}${combo.total}
                <small>　剩 ${budget - combo.total}</small>
              </strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
