# Performance Test Report – EBAC Shop

## Objective
Evaluate how the EBAC Shop behaves under a moderate, sustained load in two critical flows:
customer login and product catalog browsing.

## Test Configuration
| Parameter | Value |
|---|---|
| Tool | k6 |
| Virtual users | 20 |
| Duration | 2 minutes |
| Ramp-up | 20 seconds (0 → 20 users) |
| Think time | 1 second between actions |
| Test data | 5 users (`user1_ebac` … `user5_ebac`) |
| Environment | Local store in Docker, running under x86 emulation on Apple Silicon |

### Acceptance Criteria (thresholds)
| Metric | Limit |
|---|---|
| Failed requests (`http_req_failed`) | < 1% |
| Response time, 95th percentile (`http_req_duration p(95)`) | < 3,000 ms |
| Functional checks (`checks`) | > 99% |

## Test Cases
| ID | Flow | Steps per iteration |
|---|---|---|
| PERF-01 | Login | Open the login page, read the security token (nonce), submit the credentials and verify the account dashboard is shown |
| PERF-02 | Catalog browsing | Open the product list, open a product page and search for "jacket" |

## Results
| Metric | PERF-01: Login | PERF-02: Catalog |
|---|---|---|
| Checks passed | 100% (3,082) | 100% (1,857) |
| Failed requests | 0% (of 4,623) | 0% (of 1,857) |
| Average response time | 145 ms | 201 ms |
| **p(95) response time** | **247 ms** | **306 ms** |
| Maximum response time | 882 ms | 857 ms |
| Completed iterations | 1,541 | 619 |
| **Thresholds** | ✅ All passed | ✅ All passed |

## Analysis
1. **Stability:** the store handled 20 concurrent users with no failed requests across more than 6,400 requests.
2. **Response time:** the 95th percentile was roughly 10 times below the limit. The 3-second threshold proved conservative; a tighter target (e.g., 1 second) is recommended for future runs.
3. **Catalog is the heavier flow:** its average response time is about 40% higher than login's, as catalog, product and search pages build product listings with database queries. It is the first candidate for optimization.
4. **Isolated spikes:** maximum times near 880 ms occurred rarely (they do not affect the 95th percentile) and are consistent with the ramp-up phase and the emulated environment.
5. **Page weight:** the login test received 531 MB in 2 minutes (≈115 KB per request), since every response is a full WordPress page. This is relevant for customers on slow mobile networks.

## Limitations
- The store ran under **x86 emulation**, so absolute times are not representative of production. Results are valid for relative comparison and bottleneck detection.
- **20 users is a moderate load.** These tests confirm the behavior at this load, not the system's limit.

## Recommendations
- Run a **stress test** (gradually increasing load until degradation) to find the breaking point.
- Tighten the p(95) threshold to 1 second and add per-flow thresholds (e.g., search only).
- Re-run the tests in an environment closer to production (native x86 server) before drawing absolute conclusions.

## How to Reproduce
See the performance section in the [project README](../../README.md#how-to-run). HTML reports are generated in `performance/reports/`.