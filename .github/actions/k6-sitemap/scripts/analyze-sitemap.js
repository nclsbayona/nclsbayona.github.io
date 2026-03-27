import http from "k6/http";
import { check, fail, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

// -------------------- Config --------------------
const BASE_URL = (__ENV.BASE_URL || "https://example.com").replace(/\/+$/, "");
const SITEMAP_URL = __ENV.SITEMAP_URL || `${BASE_URL}/sitemap.xml`;
const VUS = Number(__ENV.VUS || 5);
const DURATION = __ENV.DURATION || "1m";
const URL_LIMIT = Number(__ENV.URL_LIMIT || 100);
const HTTP_TIMEOUT = __ENV.HTTP_TIMEOUT || "10s";

// -------------------- Custom Golden Signals --------------------
const pages_discovered = new Counter("pages_discovered");
const pages_tested = new Counter("pages_tested");

const gs_latency = new Trend("gs_latency", true);
const gs_error_rate = new Rate("gs_error_rate");
const gs_requests = new Counter("gs_requests");
const gs_iteration = new Trend("gs_iteration", true);

// -------------------- Status Code Metrics --------------------
const status_count = new Counter("status_count"); // tagged with exact code

const status_200 = new Counter("status_200");
const status_204 = new Counter("status_204");
const status_301 = new Counter("status_301");
const status_302 = new Counter("status_302");
const status_304 = new Counter("status_304");
const status_400 = new Counter("status_400");
const status_401 = new Counter("status_401");
const status_403 = new Counter("status_403");
const status_404 = new Counter("status_404");
const status_429 = new Counter("status_429");
const status_500 = new Counter("status_500");
const status_502 = new Counter("status_502");
const status_503 = new Counter("status_503");
const status_other = new Counter("status_other");

const status_2xx = new Counter("status_2xx");
const status_3xx = new Counter("status_3xx");
const status_4xx = new Counter("status_4xx");
const status_5xx = new Counter("status_5xx");

// -------------------- Options --------------------
export const options = {
  vus: VUS,
  duration: DURATION,
  discardResponseBodies: true,
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    gs_latency: ["p(95)<2000"],
    gs_error_rate: ["rate<0.05"],
  },
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

// -------------------- Helpers --------------------
function extractUrlsFromSitemap(xml) {
  const urls = [];
  const re = /<loc>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/loc>|<loc>\s*([\s\S]*?)\s*<\/loc>/gi;
  let match;

  while ((match = re.exec(xml)) !== null) {
    const url = (match[1] || match[2] || "").trim();
    if (url) urls.push(url);
  }

  return urls;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function value(data, metric, stat, fallback = null) {
  return data.metrics?.[metric]?.values?.[stat] ?? fallback;
}

function recordStatus(status) {
  status_count.add(1, { status: String(status) });

  if (status >= 200 && status < 300) status_2xx.add(1);
  else if (status >= 300 && status < 400) status_3xx.add(1);
  else if (status >= 400 && status < 500) status_4xx.add(1);
  else if (status >= 500 && status < 600) status_5xx.add(1);

  switch (status) {
    case 200:
      status_200.add(1);
      break;
    case 204:
      status_204.add(1);
      break;
    case 301:
      status_301.add(1);
      break;
    case 302:
      status_302.add(1);
      break;
    case 304:
      status_304.add(1);
      break;
    case 400:
      status_400.add(1);
      break;
    case 401:
      status_401.add(1);
      break;
    case 403:
      status_403.add(1);
      break;
    case 404:
      status_404.add(1);
      break;
    case 429:
      status_429.add(1);
      break;
    case 500:
      status_500.add(1);
      break;
    case 502:
      status_502.add(1);
      break;
    case 503:
      status_503.add(1);
      break;
    default:
      status_other.add(1);
      break;
  }
}

// -------------------- Setup --------------------
export function setup() {
  const res = http.get(SITEMAP_URL, {
    timeout: HTTP_TIMEOUT,
    responseType: "text",
    headers: {
      Accept: "application/xml,text/xml,*/*",
      "User-Agent": "k6-simple-sitemap-test",
    },
    tags: { name: "sitemap" },
  });

  if (res.status !== 200) {
    fail(`Failed to fetch sitemap: ${SITEMAP_URL} (status ${res.status})`);
  }

  if (!res.body) {
    fail(`Sitemap body is empty: ${SITEMAP_URL}`);
  }

  const allUrls = extractUrlsFromSitemap(res.body).slice(0, URL_LIMIT);
  pages_discovered.add(allUrls.length);

  if (allUrls.length === 0) {
    fail(`No URLs found in sitemap: ${SITEMAP_URL}`);
  }

  console.log(`Discovered ${allUrls.length} URLs from sitemap`);

  return { urls: allUrls };
}

// -------------------- Test --------------------
export default function (data) {
  const start = Date.now();

  if (!data.urls || data.urls.length === 0) {
    fail("No URLs available for testing");
  }

  const url = pickRandom(data.urls);

  const res = http.get(url, {
    timeout: HTTP_TIMEOUT,
    responseType: "none",
    redirects: 5,
    headers: {
      "User-Agent": "k6-simple-sitemap-test",
    },
    tags: { name: "page" },
  });

  recordStatus(res.status);

  const ok = check(res, {
    "status is 2xx": (r) => r.status >= 200 && r.status < 300,
  });

  pages_tested.add(1);
  gs_requests.add(1);
  gs_latency.add(res.timings.duration);
  gs_error_rate.add(!ok);

  // Optional: log only bad responses
  if (!ok) {
    console.log(`Non-2xx response: ${res.status} ${url}`);
  }

  sleep(Math.random());
  gs_iteration.add(Date.now() - start);
}

// -------------------- Summary --------------------
export function handleSummary(data) {
  const output = [
    "",
    "=== GOLDEN SIGNALS ===",
    "",
    "Latency",
    `  http_req_duration p95: ${value(data, "http_req_duration", "p(95)", 0)} ms`,
    `  gs_latency p95: ${value(data, "gs_latency", "p(95)", 0)} ms`,
    "",
    "Traffic",
    `  http_reqs count: ${value(data, "http_reqs", "count", 0)}`,
    `  data_received: ${value(data, "data_received", "count", 0)} bytes`,
    `  data_sent: ${value(data, "data_sent", "count", 0)} bytes`,
    `  pages_discovered: ${value(data, "pages_discovered", "count", 0)}`,
    `  pages_tested: ${value(data, "pages_tested", "count", 0)}`,
    "",
    "Errors",
    `  http_req_failed rate: ${value(data, "http_req_failed", "rate", 0)}`,
    `  checks rate: ${value(data, "checks", "rate", 0)}`,
    `  gs_error_rate: ${value(data, "gs_error_rate", "rate", 0)}`,
    "",
    "Saturation",
    `  vus: ${value(data, "vus", "value", 0)}`,
    `  vus_max: ${value(data, "vus_max", "value", 0)}`,
    `  iteration_duration p95: ${value(data, "iteration_duration", "p(95)", 0)} ms`,
    `  gs_iteration p95: ${value(data, "gs_iteration", "p(95)", 0)} ms`,
    "",
    "HTTP Status Codes",
    `  200: ${value(data, "status_200", "count", 0)}`,
    `  204: ${value(data, "status_204", "count", 0)}`,
    `  301: ${value(data, "status_301", "count", 0)}`,
    `  302: ${value(data, "status_302", "count", 0)}`,
    `  304: ${value(data, "status_304", "count", 0)}`,
    `  400: ${value(data, "status_400", "count", 0)}`,
    `  401: ${value(data, "status_401", "count", 0)}`,
    `  403: ${value(data, "status_403", "count", 0)}`,
    `  404: ${value(data, "status_404", "count", 0)}`,
    `  429: ${value(data, "status_429", "count", 0)}`,
    `  500: ${value(data, "status_500", "count", 0)}`,
    `  502: ${value(data, "status_502", "count", 0)}`,
    `  503: ${value(data, "status_503", "count", 0)}`,
    `  other: ${value(data, "status_other", "count", 0)}`,
    "",
    "HTTP Status Families",
    `  2xx: ${value(data, "status_2xx", "count", 0)}`,
    `  3xx: ${value(data, "status_3xx", "count", 0)}`,
    `  4xx: ${value(data, "status_4xx", "count", 0)}`,
    `  5xx: ${value(data, "status_5xx", "count", 0)}`,
    "",
  ].join("\n");

  return {
    stdout: output,
    "summary.json": JSON.stringify(data, null, 2),
    "golden-signals.txt": output,
  };
}