import client from 'prom-client';

export const register = new client.Registry();

client.collectDefaultMetrics({ register });

// ===========================================
// HTTP/API METRICS (Backend Golden Signals)
// ===========================================

// TRAFFIC: Total HTTP requests
export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestsTotal);

// LATENCY: HTTP request duration
export const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});
register.registerMetric(httpRequestDurationSeconds);

// ERRORS: Total failed HTTP requests
export const httpRequestsErrorsTotal = new client.Counter({
  name: 'http_requests_errors_total',
  help: 'Total failed HTTP requests',
  labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestsErrorsTotal);

// SATURATION: Number of active/in-flight requests
export const activeRequests = new client.Gauge({
  name: 'active_requests',
  help: 'Number of active requests',
});
register.registerMetric(activeRequests);

// ===========================================
// DATABASE METRICS (Golden Signals)
// ===========================================

// TRAFFIC: Total database queries
export const dbQueriesTotal = new client.Counter({
  name: 'db_queries_total',
  help: 'Total database queries',
  labelNames: ['operation', 'table'],
});
register.registerMetric(dbQueriesTotal);

// LATENCY: Database query duration
export const dbQueryDurationSeconds = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
});
register.registerMetric(dbQueryDurationSeconds);

// ERRORS: Total failed database queries
export const dbQueryErrorsTotal = new client.Counter({
  name: 'db_query_errors_total',
  help: 'Total failed database queries',
  labelNames: ['operation', 'table', 'error_type'],
});
register.registerMetric(dbQueryErrorsTotal);

// SATURATION: Active database connections
export const dbActiveConnections = new client.Gauge({
  name: 'db_active_connections',
  help: 'Number of active database connections',
});
register.registerMetric(dbActiveConnections);

// ===========================================
// FRONTEND METRICS (Golden Signals)
// ===========================================

// TRAFFIC: Frontend page views
export const frontendPageViewsTotal = new client.Counter({
  name: 'frontend_page_views_total',
  help: 'Total frontend page views',
  labelNames: ['page', 'referrer'],
});
register.registerMetric(frontendPageViewsTotal);

// LATENCY: Frontend action duration (e.g., form submissions, API calls from UI)
export const frontendActionDurationSeconds = new client.Histogram({
  name: 'frontend_action_duration_seconds',
  help: 'Frontend action duration in seconds',
  labelNames: ['action', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});
register.registerMetric(frontendActionDurationSeconds);

// ERRORS: Frontend errors
export const frontendErrorsTotal = new client.Counter({
  name: 'frontend_errors_total',
  help: 'Total frontend errors',
  labelNames: ['action', 'error_type'],
});
register.registerMetric(frontendErrorsTotal);

// TRAFFIC: Frontend API calls from browser
export const frontendApiCallsTotal = new client.Counter({
  name: 'frontend_api_calls_total',
  help: 'Total API calls initiated from frontend',
  labelNames: ['endpoint', 'method', 'status'],
});
register.registerMetric(frontendApiCallsTotal);
