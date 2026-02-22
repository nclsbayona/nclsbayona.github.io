import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

// Metrics
const pages_discovered = new Counter("pages_discovered");
const pages_tested = new Counter("pages_tested");

const status_2xx = new Counter("status_2xx");
const status_3xx = new Counter("status_3xx");
const status_4xx = new Counter("status_4xx");
const status_5xx = new Counter("status_5xx");
const status_other = new Counter("status_other");
const status_count = new Counter("status_count");

const check_pass_rate = new Rate("check_pass_rate");
const http_error_rate = new Rate("http_error_rate");
const page_duration = new Trend("page_duration", true);

// Config
const BASE = __ENV.BASE_URL || "https://example.com";
const SITEMAP = __ENV.SITEMAP_URL || `${BASE}/sitemap.xml`;
const URL_LIMIT = Number(__ENV.URL_LIMIT || 500);
const REDIRECT_LIMIT = Number(__ENV.REDIRECT_LIMIT || 5);

// Load model
const MODE = (__ENV.MODE || "vus").toLowerCase();
const VUS = Number(__ENV.VUS || 5);
const DURATION = __ENV.DURATION || "1m";

const RATE = Number(__ENV.RATE || 10);
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
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1500"],
    http_error_rate: ["rate<0.01"],
    check_pass_rate: ["rate>0.99"],
  },
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

// Minimal sitemap parsing: extract <loc>...</loc>
function extractLocs(xml) {
  const locs = [];
  const re = /<loc>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/loc>|<loc>\s*([\s\S]*?)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const url = (m[1] || m[2] || "").trim();
    if (url) locs.push(url);
  }
  return locs;
}

// Detect sitemapindex vs urlset by looking for those tags
function isSitemapIndex(xml) {
  return /<sitemapindex[\s>]/i.test(xml);
}

function fetchText(url, tagName) {
  const res = http.get(url, { tags: { name: tagName } });
  check(res, { [`${tagName} fetched (200)`]: (r) => r.status === 200 });
  return res.body;
}

function fetchAllUrlsFromSitemap(sitemapUrl) {
  const xml = fetchText(sitemapUrl, "sitemap");

  const locs = extractLocs(xml);

  if (isSitemapIndex(xml)) {
    // locs are child sitemap URLs
    let all = [];
    for (const child of locs) {
      const childXml = fetchText(child, "sitemap_child");
      all = all.concat(extractLocs(childXml));
    }
    return all;
  }

  // urlset: locs are page URLs
  return locs;
}

export function setup() {
  const urls = fetchAllUrlsFromSitemap(SITEMAP);

  pages_discovered.add(urls.length);

  const sliced = urls.slice(0, URL_LIMIT);
  check({ n: sliced.length }, { "found at least 1 URL": (x) => x.n > 0 });

  return { urls: sliced };
}

export default function (data) {
  const urls = data.urls;
  const url = urls[Math.floor(Math.random() * urls.length)];

  const res = http.get(url, {
    redirects: REDIRECT_LIMIT,
    tags: { name: "page" },
    headers: { "User-Agent": "k6-sitemap-loadtest" },
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

  const ok = check(res, {
    "status ok (200/204/301/302)": (r) => [200, 204, 301, 302].includes(r.status),
  });

  check_pass_rate.add(ok);
  http_error_rate.add(!ok);

  sleep(Math.random() * 1.5);
}

export function handleSummary(data) {
  return {
    "artifacts/summary.json": JSON.stringify(data, null, 2),
    stdout: "",
  };
}
