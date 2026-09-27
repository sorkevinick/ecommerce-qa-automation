import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { stages, thresholds } from '../config/load-profile.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost';

export const options = { stages, thresholds };

export default function () {
  group('Browse product catalog', () => {
    const catalog = http.get(`${BASE_URL}/produtos/`, {
      tags: { name: 'GET catalog' },
    });
    check(catalog, {
      'catalog loaded': (r) => r.status === 200 && r.body.includes('Abominable Hoodie'),
    });
    sleep(1);

    const product = http.get(`${BASE_URL}/product/abominable-hoodie/`, {
      tags: { name: 'GET product page' },
    });
    check(product, {
      'product page loaded': (r) => r.status === 200 && r.body.includes('Abominable Hoodie'),
    });
    sleep(1);

    const search = http.get(`${BASE_URL}/?s=jacket&post_type=product`, {
      tags: { name: 'GET search' },
    });
    check(search, {
      'search returned results': (r) => r.status === 200 && r.body.includes('Jacket'),
    });
    sleep(1);
  });
}