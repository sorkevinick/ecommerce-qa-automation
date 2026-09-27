import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { stages, thresholds } from '../config/load-profile.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost';
const PASSWORD = __ENV.PERF_PASSWORD;

// Loaded once and shared by all virtual users (saves memory)
const users = new SharedArray('users', () => JSON.parse(open('../data/users.json')));

export const options = { stages, thresholds };

export function setup() {
  if (!PASSWORD) {
    throw new Error('Missing PERF_PASSWORD environment variable.');
  }
}

export default function () {
  // Each virtual user always logs in with the same account (VU 1 → user1, VU 6 → user1...)
  const user = users[(__VU - 1) % users.length];

  // Start every iteration logged out
  http.cookieJar().clear(BASE_URL);

  // 1. Open the login page and read the security token (nonce) from the form
  const loginPage = http.get(`${BASE_URL}/minha-conta/`, {
    tags: { name: 'GET login page' },
  });
  check(loginPage, { 'login page loaded': (r) => r.status === 200 });

  const nonce = loginPage.html().find('input[name="woocommerce-login-nonce"]').attr('value');

  // 2. Submit the login form
  const loginResponse = http.post(
    `${BASE_URL}/minha-conta/`,
    {
      username: user.username,
      password: PASSWORD,
      'woocommerce-login-nonce': nonce,
      _wp_http_referer: '/minha-conta/',
      login: 'Login',
    },
    { tags: { name: 'POST login' } },
  );

  check(loginResponse, {
    'logged in successfully': (r) =>
      r.status === 200 && r.body.includes('woocommerce-MyAccount-navigation'),
  });

  sleep(1); // think time: a real user pauses between actions
}