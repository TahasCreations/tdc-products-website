/**
 * Load Testing Script for TDC Market
 * 
 * Usage:
 * 1. Install k6: https://k6.io/docs/getting-started/installation/
 * 2. Run: k6 run tests/load-test.js
 * 
 * Or use Artillery:
 * npm install -g artillery
 * artillery run tests/load-test.yml
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const apiResponseTime = new Trend('api_response_time');
const pageLoadTime = new Trend('page_load_time');
const requestCount = new Counter('request_count');

// Test configuration
export const options = {
  stages: [
    // Warm-up
    { duration: '30s', target: 10 },
    
    // Ramp up to 50 users
    { duration: '1m', target: 50 },
    
    // Stay at 50 users for 3 minutes
    { duration: '3m', target: 50 },
    
    // Ramp up to 100 users
    { duration: '1m', target: 100 },
    
    // Stay at 100 users for 3 minutes
    { duration: '3m', target: 100 },
    
    // Spike test: sudden jump to 200 users
    { duration: '30s', target: 200 },
    
    // Stay at 200 users for 1 minute
    { duration: '1m', target: 200 },
    
    // Ramp down
    { duration: '1m', target: 0 },
  ],
  
  thresholds: {
    // 95% of requests should be below 500ms
    'http_req_duration': ['p(95)<500'],
    
    // Error rate should be below 1%
    'errors': ['rate<0.01'],
    
    // 99% of requests should succeed
    'http_req_failed': ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test scenarios
export default function () {
  // Homepage
  group('Homepage', function () {
    const res = http.get(`${BASE_URL}/`);
    
    check(res, {
      'homepage status is 200': (r) => r.status === 200,
      'homepage loads in < 2s': (r) => r.timings.duration < 2000,
    });
    
    pageLoadTime.add(res.timings.duration);
    errorRate.add(res.status !== 200);
    requestCount.add(1);
    
    sleep(1);
  });
  
  // Product listing
  group('Product Listing', function () {
    const res = http.get(`${BASE_URL}/products`);
    
    check(res, {
      'products page status is 200': (r) => r.status === 200,
      'products page loads in < 1s': (r) => r.timings.duration < 1000,
    });
    
    pageLoadTime.add(res.timings.duration);
    errorRate.add(res.status !== 200);
    requestCount.add(1);
    
    sleep(1);
  });
  
  // API: Get products
  group('API - Products', function () {
    const res = http.get(`${BASE_URL}/api/products`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    check(res, {
      'API products status is 200': (r) => r.status === 200,
      'API products response < 500ms': (r) => r.timings.duration < 500,
      'API products returns JSON': (r) => r.headers['Content-Type']?.includes('application/json'),
    });
    
    apiResponseTime.add(res.timings.duration);
    errorRate.add(res.status !== 200);
    requestCount.add(1);
    
    sleep(0.5);
  });
  
  // Search
  group('Search', function () {
    const searchQueries = ['laptop', 'phone', 'headphones', 'camera', 'watch'];
    const query = searchQueries[Math.floor(Math.random() * searchQueries.length)];
    
    const res = http.get(`${BASE_URL}/api/search?q=${query}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    check(res, {
      'search status is 200': (r) => r.status === 200,
      'search response < 500ms': (r) => r.timings.duration < 500,
    });
    
    apiResponseTime.add(res.timings.duration);
    errorRate.add(res.status !== 200);
    requestCount.add(1);
    
    sleep(1);
  });
  
  // Category page
  group('Category Page', function () {
    const categories = ['figur-koleksiyon', 'moda-aksesuar', 'elektronik'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const res = http.get(`${BASE_URL}/categories/${category}`);
    
    check(res, {
      'category page status is 200': (r) => r.status === 200,
      'category page loads in < 1.5s': (r) => r.timings.duration < 1500,
    });
    
    pageLoadTime.add(res.timings.duration);
    errorRate.add(res.status !== 200);
    requestCount.add(1);
    
    sleep(2);
  });
  
  // Health check
  group('Health Check', function () {
    const res = http.get(`${BASE_URL}/api/health`);
    
    check(res, {
      'health check status is 200': (r) => r.status === 200,
      'health check response < 200ms': (r) => r.timings.duration < 200,
    });
    
    apiResponseTime.add(res.timings.duration);
    requestCount.add(1);
    
    sleep(0.5);
  });
}

// Teardown function (runs once at the end)
export function teardown(data) {
  console.log('Load test completed!');
  console.log(`Total requests: ${requestCount.value}`);
}
