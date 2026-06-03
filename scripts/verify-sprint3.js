const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:4321';
const OUT = path.join('D:/project/viperone', 'verify-screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const wait = ms => new Promise(r => setTimeout(r, ms));
let i = 20;
const shot = async (page, label) => {
  const name = `${String(i++).padStart(2,'0')}-${label}`;
  await page.screenshot({ path: path.join(OUT, name + '.png') });
  console.log(`[shot] ${name}.png`);
};

async function goToShift(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message.slice(0,80)));
  await page.goto(BASE, { waitUntil: 'networkidle' }); await wait(2000);
  await page.locator('button:has-text("Open ViperOne")').click({ timeout: 8000 }); await wait(500);
  await page.locator('button:has-text("Sign in")').last().click({ timeout: 5000 }); await wait(800);
  // clock in
  await page.locator('button:has-text("Clock In")').first().click({ timeout: 5000 }); await wait(3500);
  await page.mouse.click(195, 640); await wait(500); // tap photo
  await wait(2000);
  const btn = page.locator('button:has-text("Clock In Now")');
  if (await btn.isEnabled({ timeout: 3000 }).catch(() => false)) { await btn.click(); await wait(800); }
  if (errs.length) console.log('Errors:', errs);
  return page;
}

(async () => {
  const browser = await chromium.launch({ headless: false });

  // Schedule screen
  console.log('\n=== Schedule ===');
  const ctx0 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p0 = await ctx0.newPage();
  await p0.goto(BASE, { waitUntil: 'networkidle' }); await wait(2000);
  await p0.locator('button:has-text("Open ViperOne")').click({ timeout: 8000 }); await wait(500);
  await p0.locator('button:has-text("Sign in")').last().click({ timeout: 5000 }); await wait(800);
  await shot(p0, 'home-with-schedule');
  // Click "View all" schedule
  await p0.locator('text=View all').first().click({ timeout: 5000 }); await wait(600);
  await shot(p0, 'schedule');

  // Active shift with I'm Alive welfare timer
  console.log('\n=== Active Shift + Welfare ===');
  const p1 = await goToShift(browser);
  await shot(p1, 'active-shift-clean');
  // Tap I'm Alive
  await p1.locator('text=I\'m Alive').click({ timeout: 5000 }); await wait(600);
  await shot(p1, 'welfare-bar-active');

  // Reports with filters + export
  console.log('\n=== Reports ===');
  await p1.locator('text=Reports').click({ timeout: 5000 }); await wait(600);
  await shot(p1, 'reports-list');
  // filter by Open
  await p1.locator('button:has-text("Open")').first().click({ timeout: 5000 }); await wait(400);
  await shot(p1, 'reports-filtered-open');
  // tap export
  await p1.locator('button').filter({ has: p1.locator('[name="download"]') }).first().click({ timeout: 5000 }).catch(async () => {
    // try by position - export button is first in the right side header
    const btns = await p1.locator('button').all();
    for (const b of btns) {
      const txt = await b.textContent().catch(() => '');
      if (txt === '') { await b.click().catch(() => {}); break; }
    }
  });
  await wait(600);
  await shot(p1, 'reports-export-sheet');

  await browser.close();
  console.log('\nDone.');
})();
