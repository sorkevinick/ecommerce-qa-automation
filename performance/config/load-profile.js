// Load profile defined by the project requirements:
// 20 virtual users, 2 minutes in total, 20-second ramp-up.
export const stages = [
  { duration: '20s', target: 20 },   // ramp-up: 0 → 20 users
  { duration: '1m40s', target: 20 }, // steady load: 20 users
];

// Acceptance criteria: the test fails if any of these limits is exceeded.
export const thresholds = {
  http_req_failed: ['rate<0.01'],    // less than 1% of requests may fail
  http_req_duration: ['p(95)<3000'], // 95% of requests must finish in under 3s
  checks: ['rate>0.99'],             // more than 99% of functional checks must pass
};