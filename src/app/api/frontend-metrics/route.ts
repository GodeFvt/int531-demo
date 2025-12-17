import {
  frontendPageViewsTotal,
  frontendActionDurationSeconds,
  frontendErrorsTotal,
  frontendApiCallsTotal,
} from '@/lib/metrics';
import { NextRequest, NextResponse } from 'next/server';

interface FrontendMetricPayload {
  type: 'page_view' | 'action' | 'error' | 'api_call';
  page?: string;
  referrer?: string;
  action?: string;
  status?: string;
  duration?: number;
  error_type?: string;
  endpoint?: string;
  method?: string;
}

export async function POST(req: NextRequest) {
  try {
    const payload: FrontendMetricPayload = await req.json();

    switch (payload.type) {
      case 'page_view':
        frontendPageViewsTotal.inc({
          page: payload.page || '/',
          referrer: payload.referrer || 'direct',
        });
        break;

      case 'action':
        if (payload.duration !== undefined) {
          frontendActionDurationSeconds.observe(
            {
              action: payload.action || 'unknown',
              status: payload.status || 'success',
            },
            payload.duration / 1000 // Convert ms to seconds
          );
        }
        break;

      case 'error':
        frontendErrorsTotal.inc({
          action: payload.action || 'unknown',
          error_type: payload.error_type || 'unknown',
        });
        break;

      case 'api_call':
        frontendApiCallsTotal.inc({
          endpoint: payload.endpoint || 'unknown',
          method: payload.method || 'GET',
          status: payload.status || 'unknown',
        });
        break;
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
