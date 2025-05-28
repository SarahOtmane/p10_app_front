import { register, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Collecter les métriques par défaut (CPU, mémoire, etc.)
collectDefaultMetrics({
  timeout: 10000,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
});

// Compteur pour les requêtes HTTP
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Histogramme pour la durée des requêtes
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

// Métriques spécifiques F1
export const f1Metrics = {
  betsPlaced: new Counter({
    name: 'f1_bets_placed_total',
    help: 'Total number of F1 bets placed',
    labelNames: ['gp_name', 'pilot_name'],
  }),
  
  leaguesCreated: new Counter({
    name: 'f1_leagues_created_total',
    help: 'Total number of leagues created',
    labelNames: ['type'], // private/public
  }),
  
  userLogins: new Counter({
    name: 'f1_user_logins_total',
    help: 'Total number of user logins',
  }),
  
  pageViews: new Counter({
    name: 'f1_page_views_total',
    help: 'Total number of page views',
    labelNames: ['page'],
  }),
};

export { register };