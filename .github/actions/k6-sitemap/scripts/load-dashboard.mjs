import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const reportPath = process.env.K6_WEB_DASHBOARD_EXPORT;
const outDir = process.env.OUTPUT_DIR;

fs.mkdirSync(outDir, { recursive: true });

const absolute = path.resolve(reportPath);
const url = `file://${absolute}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

await page.goto(url, { waitUntil: "networkidle" });

await page.screenshot({
  path: path.join(outDir, "dashboard.png"),
  fullPage: true,
});

await browser.close();