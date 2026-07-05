const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const pageUrl = process.env.PAGE_URL;
  const elementId = process.env.ELEMENT_ID;
  const outputDir = process.env.OUTPUT_DIR;
  const screenshotName = process.env.SCREENSHOT_NAME;
  const timeout = parseInt(process.env.TIMEOUT, 10);

  if (!pageUrl) {
    throw new Error('PAGE_URL is required');
  }
  if (!elementId) {
    throw new Error('ELEMENT_ID is required');
  }
  if (!outputDir) {
    throw new Error('OUTPUT_DIR is required');
  }
  if (!screenshotName) {
    throw new Error('SCREENSHOT_NAME is required');
  }
  if (isNaN(timeout)) {
    throw new Error('TIMEOUT is required and must be a number');
  }

  await fs.promises.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pageUrl, { waitUntil: 'networkidle', timeout });

  const element = await page.$(`#${elementId}`);
  if (!element) {
    await browser.close();
    throw new Error(`Element with ID '${elementId}' not found on ${pageUrl}`);
  }

  const screenshotPath = path.join(outputDir, screenshotName);
  await element.screenshot({ path: screenshotPath });
  await browser.close();

  console.log(`Screenshot written to ${screenshotPath}`);
})();
