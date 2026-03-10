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

// -------------------- Options --------------------
export const options = {
  vus: VUS,
  duration: DURATION,
  discardResponseBodies: false,
  thresholds: {
    http_req_failed: ["rate<0.5"],
    http_req_duration: ["p(95)<2000"],
    gs_error_rate: ["rate<0.5"],
    gs_latency: ["p(95)<2000"],
  },
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

// -------------------- Helpers --------------------
function extractUrlsFromSitemap(xml) {
  const urls = [];
  const re = /<loc>\s*(.*?)\s*<\/loc>/gi;
  let match;

  while ((match = re.exec(xml)) !== null) {
    const url = match[1].trim();
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
    headers: {
      "User-Agent": "k6-simple-sitemap-test",
    },
    tags: { name: "page" },
  });

  const ok = check(res, {
    "status is 2xx": (r) => r.status >= 200 && r.status < 300,
  });

  pages_tested.add(1);
  gs_requests.add(1);
  gs_latency.add(res.timings.duration);
  gs_error_rate.add(!ok);

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
  ].join("\n");

  return {
    stdout: output,
    "results/artifacts/summary.json": JSON.stringify(data, null, 2),
    "results/artifacts/golden-signals.json": JSON.stringify(output, null, 2)
  };
}