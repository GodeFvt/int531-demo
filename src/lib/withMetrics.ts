import { NextRequest, NextResponse } from 'next/server';

import {
  activeRequests,
  httpRequestDurationSeconds,
  httpRequestsErrorsTotal,
  httpRequestsTotal,
} from './metrics';

export const withMetrics =
  (handler: (req: NextRequest) => Promise<NextResponse>, route?: string) =>
  async (req: NextRequest) => {
    const start = process.hrtime();
    activeRequests.inc();

    // Use provided route pattern or extract pathname from URL
    const routeLabel = route || new URL(req.url).pathname;

    try {
      const res = await handler(req);

      const diff = process.hrtime(start);
      const duration = diff[0] + diff[1] / 1e9;

      httpRequestsTotal.inc({
        method: req.method,
        route: routeLabel,
        status: res.status,
      });

      httpRequestDurationSeconds.observe(
        { method: req.method, route: routeLabel, status: res.status },
        duration
      );

      if (res.status >= 500) {
        httpRequestsErrorsTotal.inc({
          method: req.method,
          route: routeLabel,
          status: res.status,
        });
      }

      return res;
    } finally {
      activeRequests.dec();
    }
  };
