// Headless run of the in-page self-test (index.html?selftest): passes only when the page reports
// "SELFTEST PASS" with no page errors. Uses the machine's installed Chrome via playwright-core, so
// there is no browser download.  Run: npm i --no-save playwright-core && node selftest.mjs
import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const page_ = path.join(path.dirname(fileURLToPath(import.meta.url)), 'index.html');
// house standards: what's new feed and licence notices
const here = (f) => path.join(path.dirname(fileURLToPath(import.meta.url)), f);
const news = JSON.parse(fs.readFileSync(here('whatsnew.json'), 'utf8'));
const fileErrors = [];
if (!Array.isArray(news) || !news.length || !news.every((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date) && e.items?.length && e.items.every((i) => typeof i === 'string' && i)))
  fileErrors.push('whatsnew.json must be [{date:"YYYY-MM-DD", items:["…"]}]');
else if (news.some((e, i) => i && e.date > news[i - 1].date)) fileErrors.push('whatsnew.json must be newest first');
const notices = fs.readFileSync(here('THIRD-PARTY-NOTICES.md'), 'utf8');
for (const d of fs.readdirSync(here('vendor'))) if (!fs.readdirSync(here('vendor/' + d)).some((f) => /^LICENSE/.test(f))) fileErrors.push(`vendor/${d} has no LICENSE file`);
for (const n of ['Tesseract.js', 'PDF.js', 'tessdata']) if (!notices.includes(n)) fileErrors.push(`THIRD-PARTY-NOTICES.md does not list ${n}`);
if (fileErrors.length) { console.log(fileErrors.join(' · ')); process.exit(1); }

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
