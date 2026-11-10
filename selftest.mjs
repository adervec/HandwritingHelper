// Headless run of the in-page self-test (index.html?selftest): passes only when the page reports
// "SELFTEST PASS" with no page errors. Uses the machine's installed Chrome via playwright-core, so
// there is no browser download.  Run: npm i --no-save playwright-core && node selftest.mjs
import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const page_ = path.join(path.dirname(fileURLToPath(import.meta.url)), 'index.html');
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(pathToFileURL(page_).href + '?selftest');
await page.waitForFunction(() => document.getElementById('selftest')?.textContent.length > 0, null, { timeout: 60000 });
const out = await page.textContent('#selftest');
await browser.close();

const lines = out.split('\n');
console.log(lines[0]);
if (!lines[0].startsWith('SELFTEST PASS') || errors.length) {
  console.log(lines.slice(1).join('\n'));
  if (errors.length) console.log('page errors:\n  ' + errors.join('\n  '));
  process.exit(1);
}
