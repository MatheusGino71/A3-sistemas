/**
 * Prometheus Metrics Configuration
 * Coleta métricas da aplicação para monitoramento
 */

const client = require('prom-client');

// Registro de métricas
const register = new client.Registry();

// Adicionar métricas padrão do Node.js (CPU, memória, event loop)
client.collectDefaultMetrics({ 
  register,
  prefix: 'zenit_',
  timeout: 10000 
});

// ========================================
// Métricas HTTP
// ========================================

// Contador de requisições HTTP
const httpRequestsTotal = new client.Counter({
  name: 'zenit_http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status_code']
});

// Histograma de duração das requisições
const httpRequestDuration = new client.Histogram({
  name: 'zenit_http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
});

// Gauge de conexões WebSocket ativas
const wsConnectionsActive = new client.Gauge({
  name: 'zenit_ws_connections_active',
  help: 'Número de conexões WebSocket ativas'
});

// ========================================
// Métricas de Database
// ========================================

// Contador de queries do banco
const dbQueriesTotal = new client.Counter({
  name: 'zenit_db_queries_total',
  help: 'Total de queries executadas no banco de dados',
  labelNames: ['operation', 'table', 'status']
});

// Histograma de duração de queries
const dbQueryDuration = new client.Histogram({
  name: 'zenit_db_query_duration_seconds',
  help: 'Duração das queries do banco de dados em segundos',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1]
});

// ========================================
// Métricas de Negócio
// ========================================

// Contador de denúncias criadas
const fraudReportsTotal = new client.Counter({
  name: 'zenit_fraud_reports_total',
  help: 'Total de denúncias de fraude criadas',
  labelNames: ['status', 'risk_level']
});

// Contador de análises de risco
const riskAnalysesTotal = new client.Counter({
  name: 'zenit_risk_analyses_total',
  help: 'Total de análises de risco executadas',
  labelNames: ['risk_level']
});

// Gauge de usuários ativos
const activeUsersGauge = new client.Gauge({
  name: 'zenit_active_users',
  help: 'Número de usuários ativos no sistema'
});

// Contador de notificações enviadas
const notificationsSent = new client.Counter({
  name: 'zenit_notifications_sent_total',
  help: 'Total de notificações enviadas',
  labelNames: ['type', 'status']
});

// ========================================
// Métricas de Rate Limiting
// ========================================

// Contador de requisições bloqueadas por rate limit
const rateLimitBlocked = new client.Counter({
  name: 'zenit_rate_limit_blocked_total',
  help: 'Total de requisições bloqueadas por rate limit',
  labelNames: ['limiter_type', 'endpoint']
});

// ========================================
// Métricas de Erros
// ========================================

// Contador de erros por tipo
const errorsTotal = new client.Counter({
  name: 'zenit_errors_total',
  help: 'Total de erros na aplicação',
  labelNames: ['type', 'severity']
});

// ========================================
// Registrar todas as métricas
// ========================================

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDuration);
register.registerMetric(wsConnectionsActive);
register.registerMetric(dbQueriesTotal);
register.registerMetric(dbQueryDuration);
register.registerMetric(fraudReportsTotal);
register.registerMetric(riskAnalysesTotal);
register.registerMetric(activeUsersGauge);
register.registerMetric(notificationsSent);
register.registerMetric(rateLimitBlocked);
register.registerMetric(errorsTotal);

// ========================================
// Middleware para coletar métricas HTTP
// ========================================

const metricsMiddleware = (req, res, next) => {
  // Ignorar requisições de métricas
  if (req.path === '/metrics') {
    return next();
  }

  const start = Date.now();
  
  // Interceptar o fim da resposta
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    // Incrementar contador de requisições
    httpRequestsTotal.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode
    });
    
    // Registrar duração
    httpRequestDuration.observe({
      method: req.method,
      route: route,
      status_code: res.statusCode
    }, duration);
  });
  
  next();
};

// ========================================
// Helper Functions
// ========================================

/**
 * Incrementa contador de queries do banco
 */
function recordDbQuery(operation, table, status, duration) {
  dbQueriesTotal.inc({ operation, table, status });
  if (duration !== undefined) {
    dbQueryDuration.observe({ operation, table }, duration);
  }
}

/**
 * Incrementa contador de denúncias
 */
function recordFraudReport(status, riskLevel) {
  fraudReportsTotal.inc({ 
    status: status || 'unknown', 
    risk_level: riskLevel || 'unknown' 
  });
}

/**
 * Incrementa contador de análises de risco
 */
function recordRiskAnalysis(riskLevel) {
  riskAnalysesTotal.inc({ risk_level: riskLevel || 'unknown' });
}

/**
 * Atualiza gauge de usuários ativos
 */
function setActiveUsers(count) {
  activeUsersGauge.set(count);
}

/**
 * Incrementa contador de notificações
 */
function recordNotification(type, status) {
  notificationsSent.inc({ type, status });
}

/**
 * Incrementa contador de rate limit
 */
function recordRateLimitBlock(limiterType, endpoint) {
  rateLimitBlocked.inc({ 
    limiter_type: limiterType, 
    endpoint: endpoint || 'unknown' 
  });
}

/**
 * Incrementa contador de erros
 */
function recordError(type, severity = 'error') {
  errorsTotal.inc({ type, severity });
}

/**
 * Incrementa/decrementa conexões WebSocket
 */
function incrementWsConnections() {
  wsConnectionsActive.inc();
}

function decrementWsConnections() {
  wsConnectionsActive.dec();
}

// ========================================
// Exportar
// ========================================

module.exports = {
  register,
  metricsMiddleware,
  
  // Helpers para métricas de negócio
  recordDbQuery,
  recordFraudReport,
  recordRiskAnalysis,
  setActiveUsers,
  recordNotification,
  recordRateLimitBlock,
  recordError,
  incrementWsConnections,
  decrementWsConnections,
  
  // Métricas diretas (para casos especiais)
  metrics: {
    httpRequestsTotal,
    httpRequestDuration,
    wsConnectionsActive,
    dbQueriesTotal,
    dbQueryDuration,
    fraudReportsTotal,
    riskAnalysesTotal,
    activeUsersGauge,
    notificationsSent,
    rateLimitBlocked,
    errorsTotal
  }
};
