'use client';

// Helper to send metrics to backend
const sendMetric = async (payload: Record<string, unknown>) => {
  try {
    await fetch('/api/frontend-metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently fail - don't break the app for metrics
  }
};

// Track page views
export const trackPageView = (page: string, referrer?: string) => {
  sendMetric({
    type: 'page_view',
    page,
    referrer: referrer || document.referrer || 'direct',
  });
};

// Track frontend actions with duration
export const trackAction = async <T>(
  action: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  let status = 'success';

  try {
    const result = await fn();
    return result;
  } catch (error) {
    status = 'error';
    sendMetric({
      type: 'error',
      action,
      error_type: error instanceof Error ? error.name : 'UnknownError',
    });
    throw error;
  } finally {
    const duration = performance.now() - start;
    sendMetric({
      type: 'action',
      action,
      status,
      duration,
    });
  }
};

// Track API calls from frontend
export const trackApiCall = (
  endpoint: string,
  method: string,
  status: number | string
) => {
  sendMetric({
    type: 'api_call',
    endpoint,
    method,
    status: String(status),
  });
};

// Track errors
export const trackError = (action: string, errorType: string) => {
  sendMetric({
    type: 'error',
    action,
    error_type: errorType,
  });
};

// Wrapped fetch with automatic metrics
export const fetchWithMetrics = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  const method = options?.method || 'GET';
  const endpoint = new URL(url, window.location.origin).pathname;
  const start = performance.now();

  try {
    const res = await fetch(url, options);
    const duration = performance.now() - start;

    // Track the API call
    trackApiCall(endpoint, method, res.status);

    // Track action duration
    sendMetric({
      type: 'action',
      action: `${method} ${endpoint}`,
      status: res.ok ? 'success' : 'error',
      duration,
    });

    return res;
  } catch (error) {
    trackApiCall(endpoint, method, 'network_error');
    trackError(`${method} ${endpoint}`, 'NetworkError');
    throw error;
  }
};
