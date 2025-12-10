import { sql } from 'drizzle-orm';
import { datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const students = mysqlTable('students', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(
    sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
  ),
});

export type Student = typeof students.$inferSelect;
