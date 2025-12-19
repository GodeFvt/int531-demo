import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';

// Lazy initialization to avoid database connection during build time
let _db: ReturnType<typeof drizzle> | null = null;

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    if (!_db) {
      _db = drizzle(process.env.DATABASE_URL!);
    }
    return (_db as any)[prop];
  }
});
