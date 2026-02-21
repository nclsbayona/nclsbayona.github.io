import http from "k6/http";
import { check, sleep } from "k6";
import { XMLParser } from "https://jslib.k6.io/xml/2.0.0/index.js";
import { Counter, Rate, Trend } from "k6/metrics";

// --- Custom metrics (these show up in output + summary.json) ---
const pages_discovered = new Counter("pages_discovered");
const pages_tested = new Counter("pages_tested");

const status_2xx = new Counter("status_2xx");
const status_3xx = new Counter("status_3xx");
const status_4xx = new Counter("status_4xx");
const status_5xx = new Counter("status_5xx");
const status_other = new Counter("status_other");

// Exact status counter (tagged)
const status_count = new Counter("status_count");

// Pass/fail rates
const check_pass_rate = new Rate("check_pass_rate");
const http_error_rate = new Rate("http_error_rate");

// Per-page duration trend (not replacing built-ins; just a handy view)
const page_duration = new Trend("page_duration", true);

// --- Config ---
const BASE = __ENV.BASE_URL || "https://example.com";
const SITEMAP = __ENV.SITEMAP_URL || `${BASE}/sitemap.xml`;
const URL_LIMIT = Number(__ENV.URL_LIMIT || 500);

// Load model:
// - MODE=vus: constant VUs for DURATION (classic concurrency test)
// - MODE=rate: constant arrival rate (stable RPS-ish test)
const MODE = (__ENV.TEST_MODE || "vus").toLowerCase();

// VU mode
const VUS = Number(__ENV.VUS || 5);
const DURATION = __ENV.DURATION || "1m";

// Rate mode
const RATE = Number(__ENV.RATE || 10); // iterations/sec across all VUs
const TIME_UNIT = __ENV.TIME_UNIT || "1s";
const PREALLOCATED_VUS = Number(__ENV.PREALLOCATED_VUS || 20);
const MAX_VUS = Number(__ENV.MAX_VUS || 50);

export const options = {
  scenarios:
    MODE === "rate"
      ? {
          sitemap_pages: {
            executor: "constant-arrival-rate",
            rate: RATE,
            timeUnit: TIME_UNIT,
            duration: DURATION,
            preAllocatedVUs: PREALLOCATED_VUS,
            maxVUs: MAX_VUS,
          },
        }
      : {
          sitemap_pages: {
            executor: "constant-vus",
            vus: VUS,
            duration: DURATION,
          },
        },

  thresholds: {
    http_req_failed: ["rate<0.01"],          // built-in error rate
    http_req_duration: ["p(95)<1500"],       // built-in latency
    http_error_rate: ["rate<0.01"],          // our error rate
    check_pass_rate: ["rate>0.99"],          // our pass rate
  },

  // Cleaner console output grouping (optional)
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

function parseSitemap(xmlText) {
  const parser = new XMLParser();
  const doc = parser.parse(xmlText);

  const urls = (doc.urlset?.url || []).map((u) => u.loc).filter(Boolean);
  const nested = (doc.sitemapindex?.sitemap || []).map((s) => s.loc).filter(Boolean);

  return { urls, nested };
}

function fetchAllUrls(sitemapUrl) {
  const res = http.get(sitemapUrl, { tags: { name: "sitemap" } });
  check(res, { "sitemap fetched (200)": (r) => r.status === 200 });

  const { urls, nested } = parseSitemap(res.body);

  if (nested.length) {
    let all = [];
    for (const child of nested) {
      const childRes = http.get(child, { tags: { name: "sitemap_child" } });
      check(childRes, { "child sitemap fetched (200)": (r) => r.status === 200 });
      all = all.concat(parseSitemap(childRes.body).urls);
    }
    return all;
  }

  return urls;
}

export function setup() {
  const urls = fetchAllUrls(SITEMAP);

  pages_discovered.add(urls.length);

  const sliced = urls.slice(0, URL_LIMIT);
  check({ n: sliced.length }, { "found at least 1 URL": (x) => x.n > 0 });

  return { urls: sliced };
}

export default function (data) {
  const urls = data.urls;
  const url = urls[Math.floor(Math.random() * urls.length)];

  const res = http.get(url, {
    redirects: Number(__ENV.REDIRECT_LIMIT || 3),
    tags: { name: "page", page: url }, // page tag is useful but can create high-cardinality metrics if huge
    headers: { "User-Agent": "k6-sitemap-loadtest" },
  });

  pages_tested.add(1);
  page_duration.add(res.timings.duration);

  // Status breakdown
  const s = res.status;
  status_count.add(1, { status: String(s) });

  if (s >= 200 && s < 300) status_2xx.add(1);
  else if (s >= 300 && s < 400) status_3xx.add(1);
  else if (s >= 400 && s < 500) status_4xx.add(1);
  else if (s >= 500 && s < 600) status_5xx.add(1);
  else status_other.add(1);

  // “error rate” as “unexpected responses”
  const ok = check(res, {
    "status ok (200/204/301/302)": (r) => [200, 204, 301, 302].includes(r.status),
  });

  check_pass_rate.add(ok);
  http_error_rate.add(!ok);

  // Think-time so you don’t accidentally run a pure-benchmark of your CDN edge
  sleep(Math.random() * 1.5);
}

// Write a machine-readable summary you can store as an artifact
export function handleSummary(data) {
  return {
    "artifacts/summary.json": JSON.stringify(data, null, 2),
    stdout: "", // keep console output cleaner; remove this line if you want default text summary
  };
}
