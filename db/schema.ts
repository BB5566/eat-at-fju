// 同學推薦數：每道菜一列，按一下「推薦」就 +1
import { integer, sqliteTable, text } from 'void/schema-d1';

export const votes = sqliteTable('votes', {
  dishId: text('dish_id').primaryKey(),
  count: integer('count').notNull().default(0),
});
