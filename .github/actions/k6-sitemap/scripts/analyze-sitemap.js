import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";
import { parseHTML } from "k6/html";


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

  // whatever remains is the steady-state hold
  const holdSec = Math.max(0, durSec - upSec - downSec);

  return [
    { duration: rampUp, target: peakVUs },
    { duration: `${holdSec}s`, target: peakVUs },
    { duration: rampDown, target: 0 },
  ];
}


// -------------------- Metrics --------------------
const pages_discovered = new Counter("pages_discovered");
const pages_tested = new Counter("pages_tested");

const status_2xx = new Counter("status_2xx");
const status_3xx = new Counter("status_3xx");
const status_4xx = new Counter("status_4xx");
const status_5xx = new Counter("status_5xx");
const status_other = new Counter("status_other");
const status_count = new Counter("status_count");

const check_pass_rate = new Rate("check_pass_rate");
const http_error_rate = new Rate("http_error_rate"); // “our definition of bad”
const page_duration = new Trend("page_duration", true);

// -------------------- Config --------------------
const BASE = __ENV.BASE_URL || "https://example.com";
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
const RATE = Number(__ENV.RATE || 10);
const TIME_UNIT = __ENV.TIME_UNIT || "1s";
const PREALLOCATED_VUS = Number(__ENV.PREALLOCATED_VUS || 20);
const MAX_VUS = Number(__ENV.VUS || 50);

// ramping-vus (gradual VU changes)
const STAGES = __ENV.STAGES
  ? JSON.parse(__ENV.STAGES) // e.g. [{"duration":"30s","target":5},{"duration":"1m","target":20},{"duration":"30s","target":0}]
  : stagesFromVUs({
      peakVUs: VUS,
      duration: DURATION
    })

// ramping-arrival-rate (gradual RPS changes)
const ARRIVAL_START_RATE = Number(__ENV.ARRIVAL_START_RATE || 1);
const ARRIVAL_STAGES = __ENV.ARRIVAL_STAGES
  ? JSON.parse(__ENV.ARRIVAL_STAGES) // e.g. [{"duration":"30s","target":10},{"duration":"1m","target":50},{"duration":"30s","target":5}]
  : [
      { duration: "20s", target: 10 },
      { duration: "40s", target: 30 },
      { duration: "20s", target: 0 },
    ];

function buildScenario() {
  if (MODE === "rate") {
    // constant arrival rate (open model)
    return {
      executor: "constant-arrival-rate",
      rate: RATE,
      timeUnit: TIME_UNIT,
      duration: DURATION,
      preAllocatedVUs: PREALLOCATED_VUS,
      maxVUs: MAX_VUS,
    };
  }

  if (MODE === "ramp") {
    // ramping VUs (closed model)
    return {
      executor: "ramping-vus",
      startVUs: VUS,
      stages: STAGES,
      gracefulRampDown: "30s",
    };
  }

  if (MODE === "ramp-rate") {
    // ramping arrival rate (open model)
    return {
      executor: "ramping-arrival-rate",
      startRate: ARRIVAL_START_RATE,
      timeUnit: TIME_UNIT,
      stages: ARRIVAL_STAGES,
      preAllocatedVUs: PREALLOCATED_VUS,
      maxVUs: MAX_VUS,
    };
  }

  // default: constant VUs (closed model)
  return { executor: "constant-vus", vus: VUS, duration: DURATION };
}

export const options = {
  discardResponseBodies: true, // big win when you do not inspect bodies
  scenarios: {
    sitemap_pages: buildScenario(),
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1500"],
    http_error_rate: ["rate<0.01"],
    check_pass_rate: ["rate>0.99"],
  },
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

// -------------------- Sitemap parsing --------------------
// More robust than regex: parse and select <loc> tags.
// For typical sitemaps, <loc> tag names are plain even with namespaces.
// Extract <loc>...</loc> with or without CDATA
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

function fetchText(url, tagName) {
  const u = normalizeUrl(url); // root urls should be absolute
  if (!u) return null;

  const res = http.get(u, {
    timeout: HTTP_TIMEOUT,
    redirects: REDIRECT_LIMIT,
    tags: { name: tagName },
    headers: { "User-Agent": USER_AGENT, "Accept": "application/xml,text/xml,*/*" },
  });

  check(res, { [`${tagName} fetched (200)`]: (r) => r.status === 200 });
  if (res.status !== 200) return null;

  return res.body;
}

export function fetchAllUrlsFromSitemap(sitemapUrl) {
  const root = normalizeUrl(sitemapUrl);
  const xml = fetchText(root, "sitemap_root");
  if (!xml) return [];

  // Root urlset => page URLs
  if (isUrlset(xml) && !isSitemapIndex(xml)) {
    return extractLocs(xml)
      .map((loc) => normalizeUrl(loc, root))
      .filter(Boolean);
  }

  // Root index => child sitemaps
  if (isSitemapIndex(xml)) {
    let all = [];
    const children = extractLocs(xml)
      .map((loc) => normalizeUrl(loc, root))
      .filter(Boolean);

    for (const child of children) {
      const childXml = fetchText(child, "sitemap_child");
      if (!childXml) continue;

      if (isSitemapIndex(childXml)) {
        const grandChildren = extractLocs(childXml)
          .map((loc) => normalizeUrl(loc, child))
          .filter(Boolean);

        for (const gc of grandChildren) {
          const gcXml = fetchText(gc, "sitemap_grandchild");
          if (!gcXml) continue;
          if (isUrlset(gcXml)) {
            all = all.concat(
              extractLocs(gcXml).map((loc) => normalizeUrl(loc, gc)).filter(Boolean)
            );
          }
        }
      } else if (isUrlset(childXml)) {
        all = all.concat(
          extractLocs(childXml).map((loc) => normalizeUrl(loc, child)).filter(Boolean)
        );
      }
    }
    return all;
  }

  return [];
}
// -------------------- Lifecycle --------------------
export function setup() {
  const raw = fetchAllUrlsFromSitemap(SITEMAP);

  // normalize + dedupe + optional clamp
  const deduped = new Set();
  for (const u of raw) {
    const nu = normalizeUrl(u);
    if (nu) deduped.add(nu);
  }

  const urls = Array.from(deduped);
  pages_discovered.add(urls.length);

  const sliced = urls.slice(0, URL_LIMIT);
  check({ n: sliced.length }, { "found at least 1 URL": (x) => x.n > 0 });

  return { urls: sliced };
}

export default function (data) {
  const urls = data.urls;
  const url = urls[Math.floor(Math.random() * urls.length)];

  const res = http.get(url, {
    timeout: HTTP_TIMEOUT,
    redirects: REDIRECT_LIMIT,
    tags: { name: "page" },
    headers: { "User-Agent": USER_AGENT },
  });

  pages_tested.add(1);
  page_duration.add(res.timings.duration);

  const s = res.status;
  status_count.add(1, { status: String(s) });

  if (s >= 200 && s < 300) status_2xx.add(1);
  else if (s >= 300 && s < 400) status_3xx.add(1);
  else if (s >= 400 && s < 500) status_4xx.add(1);
  else if (s >= 500 && s < 600) status_5xx.add(1);
  else status_other.add(1);

  // “OK” definition: treat any 2xx as pass.
  // If you care about redirects, track them separately via status counters already.
  const ok = check(res, {
    "status is 2xx": (r) => r.status >= 200 && r.status < 300,
  });

  check_pass_rate.add(ok);
  http_error_rate.add(!ok);

  sleep(Math.random() * 1.5);
}

export function handleSummary(data) {
  // Safer filename unless your runner guarantees directory creation.
  return {
    "results/artifacts/summary.json": JSON.stringify(data, null, 2),
  };
}
