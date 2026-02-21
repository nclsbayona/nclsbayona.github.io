import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const reportPath = process.env.REPORT_HTML || "artifacts/k6-report.html";
const outDir = process.env.OUT_DIR || "artifacts/images";

fs.mkdirSync(outDir, { recursive: true });

const absolute = path.resolve(reportPath);
const url = `file://${absolute}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

await page.goto(url, { waitUntil: "networkidle" });

await page.screenshot({
  path: path.join(outDir, "k6-dashboard.png"),
  fullPage: true,
});

await browser.close();