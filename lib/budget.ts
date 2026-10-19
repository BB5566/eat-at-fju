// 百元吃飽計算機：在預算內配出像樣的一餐。
// 規則（一個人吃一餐）：主食剛好一樣（水餃可以點 5／10／15 顆）、飲料最多一杯、點心最多兩樣各一份。
// 菜只有 7 樣，直接把所有組合列出來算，最簡單也最不會錯。
import { DISHES, type Dish } from './menu-data';

export interface Combo {
  items: { dish: Dish; qty: number }[];
  total: number;
}

const meals = DISHES.filter((d) => d.category === 'meal');
const drinks = DISHES.filter((d) => d.category === 'drink');
const snacks = DISHES.filter((d) => d.category === 'snack');

// 主食的點法：水餃可以加點，其他就一份
function mealChoices() {
  return meals.flatMap((dish) => (dish.id === 'dumplings' ? [1, 2, 3] : [1]).map((qty) => ({ dish, qty })));
}

// 點心的所有選法：不點、點一樣、點兩樣
function snackChoices(): Dish[][] {
  const result: Dish[][] = [[]];
  snacks.forEach((a, i) => {
    result.push([a]);
    snacks.slice(i + 1).forEach((b) => result.push([a, b]));
  });
  return result;
}

export function findCombos(budget: number, howMany = 3): Combo[] {
  const all: Combo[] = [];
  for (const meal of mealChoices()) {
    for (const drink of [null, ...drinks]) {
      for (const snackSet of snackChoices()) {
        const items = [meal, ...(drink ? [{ dish: drink, qty: 1 }] : []), ...snackSet.map((dish) => ({ dish, qty: 1 }))];
        const total = items.reduce((sum, i) => sum + i.dish.cost * i.qty, 0);
        if (total <= budget) all.push({ items, total });
      }
    }
  }

  // 越接近預算越好（錢花好花滿）；一樣的話，有飲料的優先
  const hasDrink = (c: Combo) => (c.items.some((i) => i.dish.category === 'drink') ? 1 : 0);
  all.sort((a, b) => b.total - a.total || hasDrink(b) - hasDrink(a));

  // 每種主食只挑一個最好的組合，讓三個建議口味不一樣
  const picked: Combo[] = [];
  const seenMeals = new Set<string>();
  for (const combo of all) {
    if (seenMeals.has(combo.items[0].dish.id)) continue;
    seenMeals.add(combo.items[0].dish.id);
    picked.push(combo);
    if (picked.length === howMany) break;
  }
  return picked;
}
