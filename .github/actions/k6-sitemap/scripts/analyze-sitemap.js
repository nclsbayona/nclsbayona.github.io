import * as http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

// -------------------- Helpers --------------------
function parseDurationToSeconds(s) {
  // supports "30s", "5m", "1h", "1m30s"
  const re = /(\d+)\s*([smh])/g;
  let total = 0;
  let m;
  while ((m = re.exec(String(s))) !== null) {
    const n = Number(m[1]);
    const unit = m[2];
    if (unit === "s") total += n;
    else if (unit === "m") total += n * 60;
    else if (unit === "h") total += n * 3600;
  }
  return total;
}

function stagesFromVUs({ peakVUs, duration, rampUp = "20s", rampDown = "20s" }) {
  const durSec = parseDurationToSeconds(duration);
  const upSec = parseDurationToSeconds(rampUp);
  const downSec = parseDurationToSeconds(rampDown);
  const holdSec = Math.max(0, durSec - upSec - downSec);

  return [
    { duration: rampUp, target: peakVUs },
    { duration: `${holdSec}s`, target: peakVUs },
    { duration: rampDown, target: 0 },
  ];
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

// -------------------- Golden Signals Metrics --------------------
// Latency (Trends)
const gs_latency_total = new Trend("gs_latency_total", true);
const gs_latency_blocked = new Trend("gs_latency_blocked", true);
const gs_latency_connecting = new Trend("gs_latency_connecting", true);
const gs_latency_tls = new Trend("gs_latency_tls", true);
const gs_latency_sending = new Trend("gs_latency_sending", true);
const gs_latency_waiting = new Trend("gs_latency_waiting", true);
const gs_latency_receiving = new Trend("gs_latency_receiving", true);

// Traffic (Counters)
const gs_requests = new Counter("gs_requests");          // count of requests
const gs_bytes_in = new Counter("gs_bytes_in");          // response bytes
const gs_bytes_out = new Counter("gs_bytes_out");        // request bytes (best-effort)

// Errors (Rates + Counters)
const gs_error_rate = new Rate("gs_error_rate");         // true when request considered "bad"
const gs_check_pass_rate = new Rate("gs_check_pass_rate");
const gs_status_count = new Counter("gs_status_count");  // with tags: status, endpoint_group
const gs_status_2xx = new Counter("gs_status_2xx");
const gs_status_3xx = new Counter("gs_status_3xx");
const gs_status_4xx = new Counter("gs_status_4xx");
const gs_status_5xx = new Counter("gs_status_5xx");
const gs_status_other = new Counter("gs_status_other");

// Saturation (Trends)
const gs_iter_duration = new Trend("gs_iteration_duration", true);  // iteration wall time
const gs_sleep_time = new Trend("gs_sleep_time", true);             // time we intentionally slept
const gs_sitemap_parse_ms = new Trend("gs_sitemap_parse_ms", true); // setup parse time

// Your original “business” counters
const pages_discovered = new Counter("pages_discovered");
const pages_tested = new Counter("pages_tested");

// -------------------- Config (keeps your env vars) --------------------
const BASE = (__ENV.BASE_URL || "https://example.com").replace(/\/+$/, "");
const SITEMAP = __ENV.SITEMAP_URL || `${BASE}/sitemap.xml`;
const URL_LIMIT = Number(__ENV.URL_LIMIT || 500);
const REDIRECT_LIMIT = Number(__ENV.REDIRECT_LIMIT || 5);

const HTTP_TIMEOUT = __ENV.HTTP_TIMEOUT || "10s";
const USER_AGENT = __ENV.USER_AGENT || "k6-sitemap-loadtest";

const MODE = (__ENV.MODE || "vus").toLowerCase();

// constant-vus
const VUS = Number(__ENV.VUS || 5);
const DURATION = __ENV.DURATION || "1m";

// constant-arrival-rate
const RATE_RPS = Number(__ENV.RATE || 10);
const TIME_UNIT = __ENV.TIME_UNIT || "1s";
const PREALLOCATED_VUS = Number(__ENV.PREALLOCATED_VUS || 20);
const MAX_VUS = Number(__ENV.MAX_VUS || 50);

// ramping-vus (gradual VU changes)
const START_VUS = Number(__ENV.START_VUS || 0);
const STAGES = __ENV.STAGES
  ? JSON.parse(__ENV.STAGES)
  : stagesFromVUs({ peakVUs: VUS, duration: DURATION });

// ramping-arrival-rate (gradual RPS changes)
const ARRIVAL_START_RATE = Number(__ENV.ARRIVAL_START_RATE || 1);
const ARRIVAL_STAGES = __ENV.ARRIVAL_STAGES
  ? JSON.parse(__ENV.ARRIVAL_STAGES)
  : [
      { duration: "20s", target: 10 },
      { duration: "40s", target: 30 },
      { duration: "20s", target: 0 },
    ];

function buildScenario() {
  if (MODE === "rate") {
    return {
      executor: "constant-arrival-rate",
      rate: RATE_RPS,
      timeUnit: TIME_UNIT,
      duration: DURATION,
      preAllocatedVUs: PREALLOCATED_VUS,
      maxVUs: MAX_VUS,
    };
  }

  if (MODE === "ramp") {
    return {
      executor: "ramping-vus",
      startVUs: START_VUS,
      stages: STAGES,
      gracefulRampDown: "30s",
    };
  }

  if (MODE === "ramp-rate") {
    return {
      executor: "ramping-arrival-rate",
      startRate: ARRIVAL_START_RATE,
      timeUnit: TIME_UNIT,
      stages: ARRIVAL_STAGES,
      preAllocatedVUs: PREALLOCATED_VUS,
      maxVUs: MAX_VUS,
    };
  }

  return { executor: "constant-vus", vus: VUS, duration: DURATION };
}

export const options = {
  discardResponseBodies: true,
  scenarios: {
    sitemap_pages: buildScenario(),
  },
  thresholds: {
    // keep your original intent + golden-signal thresholds
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1500"],
    gs_error_rate: ["rate<0.01"],
    gs_check_pass_rate: ["rate>0.99"],
    gs_latency_total: ["p(95)<1500"],
  },
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

// -------------------- Sitemap parsing --------------------
function extractLocs(xml) {
  const locs = [];
  const re = /<loc>\s*(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const raw = (m[1] || m[2] || "").trim();
    if (raw) locs.push(raw);
  }
  return locs;
}

function isSitemapIndex(xml) {
  return /<sitemapindex[\s>]/i.test(xml);
}
function isUrlset(xml) {
  return /<urlset[\s>]/i.test(xml);
}

function normalizeUrl(value, base) {
  if (typeof value !== "string") return null;
  const s = value.trim();
  if (!s) return null;
  try {
    return new URL(s, base).toString();
  } catch {
    return null;
  }
}

function fetchXml(url, tagName) {
  const u = normalizeUrl(url);
  if (!u) return null;

  const res = http.get(u, {
    timeout: HTTP_TIMEOUT,
    redirects: REDIRECT_LIMIT,
    responseType: "text",
    tags: { name: tagName, endpoint_group: tagName },
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/xml,text/xml,*/*",
    },
  });

  check(res, { [`${tagName} fetched (200)`]: (r) => r.status === 200 });
  if (res.status !== 200) return null;

  return res.body;
}

function parseSitemap(xml, baseUrl) {
  if (isSitemapIndex(xml)) {
    const childSitemaps = extractLocs(xml)
      .map((loc) => normalizeUrl(loc, baseUrl))
      .filter(Boolean);
    return { kind: "index", childSitemaps, urls: [] };
  }

  if (isUrlset(xml)) {
    const urls = extractLocs(xml)
      .map((loc) => normalizeUrl(loc, baseUrl))
      .filter(Boolean);
    return { kind: "urlset", childSitemaps: [], urls };
  }

  return { kind: "unknown", childSitemaps: [], urls: [] };
}

export function fetchAllUrlsFromSitemap(sitemapUrl, { maxDepth = 5 } = {}) {
  const root = normalizeUrl(sitemapUrl);
  if (!root) return [];

  const seenSitemaps = new Set();
  const seenUrls = new Set();

  function walk(url, depth) {
    if (depth > maxDepth) return;
    if (seenSitemaps.has(url)) return;
    seenSitemaps.add(url);

    const xml = fetchXml(url, depth === 0 ? "sitemap_root" : "sitemap_child");
    if (!xml) return;

    const parsed = parseSitemap(xml, url);
    if (parsed.kind === "urlset") {
      for (const u of parsed.urls) seenUrls.add(u);
      return;
    }

    if (parsed.kind === "index") {
      for (const child of parsed.childSitemaps) walk(child, depth + 1);
      return;
    }
  }

  const t0 = Date.now();
  walk(root, 0);
  gs_sitemap_parse_ms.add(Date.now() - t0, { endpoint_group: "sitemap_parse" });

  return Array.from(seenUrls);
}

// -------------------- Golden signals recording --------------------
function recordGoldenSignals(res, { endpoint_group }) {
  // Traffic
  gs_requests.add(1, { endpoint_group });
  gs_bytes_in.add(res.body ? res.body.length : 0, { endpoint_group });
  // request bytes are not easily known; approximate from headers only if available
  const out = res.request && res.request.body ? String(res.request.body).length : 0;
  gs_bytes_out.add(out, { endpoint_group });

  // Latency breakdown
  gs_latency_total.add(res.timings.duration, { endpoint_group });
  gs_latency_blocked.add(res.timings.blocked, { endpoint_group });
  gs_latency_connecting.add(res.timings.connecting, { endpoint_group });
  gs_latency_tls.add(res.timings.tls_handshaking, { endpoint_group });
  gs_latency_sending.add(res.timings.sending, { endpoint_group });
  gs_latency_waiting.add(res.timings.waiting, { endpoint_group });
  gs_latency_receiving.add(res.timings.receiving, { endpoint_group });

  // Status class counters + tagged status count
  const s = res.status;
  gs_status_count.add(1, { endpoint_group, status: String(s) });
  if (s >= 200 && s < 300) gs_status_2xx.add(1, { endpoint_group });
  else if (s >= 300 && s < 400) gs_status_3xx.add(1, { endpoint_group });
  else if (s >= 400 && s < 500) gs_status_4xx.add(1, { endpoint_group });
  else if (s >= 500 && s < 600) gs_status_5xx.add(1, { endpoint_group });
  else gs_status_other.add(1, { endpoint_group });
}

// -------------------- Lifecycle --------------------
export function setup() {
  const raw = fetchAllUrlsFromSitemap(SITEMAP, { maxDepth: 5 });

  const urls = raw.slice(0, clamp(URL_LIMIT, 1, Number.MAX_SAFE_INTEGER));
  pages_discovered.add(urls.length);

  check({ n: urls.length }, { "found at least 1 URL": (x) => x.n > 0 });

  return { urls };
}

export default function (data) {
  const iterStart = Date.now();

  const urls = data.urls;
  if (!urls || urls.length === 0) return;

  const url = pickRandom(urls);

  // “endpoint_group” is the key tag for dashboards (slice everything by it).
  const endpoint_group = "page";

  const res = http.get(url, {
    timeout: HTTP_TIMEOUT,
    redirects: REDIRECT_LIMIT,
    tags: { name: "page", endpoint_group },
    headers: { "User-Agent": USER_AGENT },
  });

  pages_tested.add(1);

  // Errors definition: treat only 2xx as pass (same as you wanted)
  const ok = check(res, {
    "status is 2xx": (r) => r.status >= 200 && r.status < 300,
  });

  gs_check_pass_rate.add(ok, { endpoint_group });
  gs_error_rate.add(!ok, { endpoint_group });

  recordGoldenSignals(res, { endpoint_group });

  // Saturation proxies
  const sleepFor = Math.random() * 1.5;
  gs_sleep_time.add(sleepFor * 1000, { endpoint_group: "sleep" });

  sleep(sleepFor);

  gs_iter_duration.add(Date.now() - iterStart, { endpoint_group: "iteration" });
}

export function handleSummary(data) {
  return {
    "results/artifacts/summary.json": JSON.stringify(data, null, 2),
  };
}
