import { db } from '@/db';
import {
  dbQueriesTotal,
  dbQueryDurationSeconds,
  dbQueryErrorsTotal,
  dbActiveConnections,
} from './metrics';

type DbOperation = 'select' | 'insert' | 'update' | 'delete';

export async function withDbMetrics<T>(
  operation: DbOperation,
  table: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const start = process.hrtime();
  dbActiveConnections.inc();

  try {
    const result = await queryFn();

    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9;

    dbQueriesTotal.inc({ operation, table });
    dbQueryDurationSeconds.observe({ operation, table }, duration);

    return result;
  } catch (error) {
    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9;

    const errorType = error instanceof Error ? error.name : 'UnknownError';
    dbQueryErrorsTotal.inc({ operation, table, error_type: errorType });
    dbQueryDurationSeconds.observe({ operation, table }, duration);

    throw error;
  } finally {
    dbActiveConnections.dec();
  }
}

export { db };
